#!/usr/bin/env bash
# Met en ligne la dernière version du site sur AWS (S3 + CloudFront).
# Usage, dans AWS CloudShell :   cd ~/annee2000 && ./deploy.sh
set -euo pipefail

BUCKET=annee2000-site-158346964722
DISTRIBUTION_ID=EEIGRQEPYF5X3
BRANCH=claude/wizardly-mendel-ojlr60

cd "$(dirname "$0")"
echo "1/3 Récupération de la dernière version…"
git fetch -q origin "$BRANCH" && git checkout -q "$BRANCH" && git reset -q --hard "origin/$BRANCH"

echo "2/3 Envoi des fichiers sur S3…"
aws s3 sync . "s3://$BUCKET" --delete --only-show-errors \
  --exclude "*" \
  --include "index.html" --include "404.html" \
  --include "css/*" --include "js/*" \
  --include "data/shows.json" --include "data/extras.json" --include "data/hits.json" \
  --include "chrome/*" \
  --cache-control "public, max-age=300"

echo "3/3 Rafraîchissement du cache CloudFront…"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --query Invalidation.Status --output text

echo "C'est en ligne (1 à 2 minutes pour que le cache se vide) : https://d22mgjxgcxd3e3.cloudfront.net"
