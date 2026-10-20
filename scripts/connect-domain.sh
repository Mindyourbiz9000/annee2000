#!/usr/bin/env bash
# Branche lesmillennials.com (et www) sur la distribution CloudFront du site.
# Prérequis : zone Route 53 créée, serveurs DNS changés chez GoDaddy, certificat ACM validé.
# Usage (CloudShell) : ./scripts/connect-domain.sh
set -euo pipefail

DOMAIN=lesmillennials.com
DIST=EEIGRQEPYF5X3
CF_DOMAIN=d22mgjxgcxd3e3.cloudfront.net
CF_ZONE=Z2FDTNDATAQYW2 # zone fixe de CloudFront pour les alias Route 53
CERT=arn:aws:acm:us-east-1:158346964722:certificate/2886af08-869e-4e48-ba52-a65caba69406

echo "== 1/3 Certificat"
STATUS=$(aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT" --query Certificate.Status --output text)
echo "$STATUS"
[ "$STATUS" = "ISSUED" ] || { echo "Le certificat n'est pas encore validé, réessaie dans quelques minutes."; exit 1; }

echo "== 2/3 CloudFront"
aws cloudfront get-distribution-config --id "$DIST" > /tmp/cf.json
ETAG=$(jq -r .ETag /tmp/cf.json)
jq --arg c "$CERT" --arg d "$DOMAIN" '.DistributionConfig
  | .Aliases = {Quantity: 2, Items: [$d, ("www." + $d)]}
  | .ViewerCertificate = {ACMCertificateArn: $c, SSLSupportMethod: "sni-only", MinimumProtocolVersion: "TLSv1.2_2021", CloudFrontDefaultCertificate: false}' /tmp/cf.json > /tmp/cf-new.json
aws cloudfront update-distribution --id "$DIST" --if-match "$ETAG" --distribution-config file:///tmp/cf-new.json \
  --query 'Distribution.[Status, DistributionConfig.Aliases.Items]' --output text

echo "== 3/3 DNS"
ZONE=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" --query "HostedZones[?Name=='$DOMAIN.'].Id | [0]" --output text)
cat > /tmp/dns.json <<EOF
{"Changes": [
 {"Action": "UPSERT", "ResourceRecordSet": {"Name": "$DOMAIN", "Type": "A", "AliasTarget": {"HostedZoneId": "$CF_ZONE", "DNSName": "$CF_DOMAIN", "EvaluateTargetHealth": false}}},
 {"Action": "UPSERT", "ResourceRecordSet": {"Name": "www.$DOMAIN", "Type": "A", "AliasTarget": {"HostedZoneId": "$CF_ZONE", "DNSName": "$CF_DOMAIN", "EvaluateTargetHealth": false}}}
]}
EOF
aws route53 change-resource-record-sets --hosted-zone-id "$ZONE" --change-batch file:///tmp/dns.json --query ChangeInfo.Status --output text

echo "Terminé : https://$DOMAIN sera en ligne d'ici 5 à 15 minutes."
