# Les années milléniales · La télé et la musique des années 2000

À l'ouverture, le site demande : la **télé** ou la **musique** des années 2000 ?

- **Télé** : le grand catalogue des émissions françaises diffusées entre 2000 et 2010
  (téléréalité, jeux, talk-shows, divertissements, magazines, humour, musique, jeunesse).
  Chaque fiche range les épisodes par saison et numéro, avec un dossier « Bonus » à côté
  (réactions, coulisses et interviews, moments cultes, best-of, génériques).
- **Musique** : tous les numéros un et les dix meilleures ventes de chaque année en France,
  de 2000 à 2010, classés par genre, avec le clip, les lives télé, les remix et un dossier « Bonus »
  (réactions, making-of et interviews, paroles, reprises). Design inspiré de l'esthétique Y2K
(boutons « gel », logo chrome, téléviseur cathodique).

## Lancer le site en local

Site statique, sans étape de build :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Données

| Fichier | Rôle |
| --- | --- |
| `data/shows.json` | Le catalogue des émissions (généré). |
| `data/hits.json` | Les tubes 2000-2010 et leurs vidéos (générés). |
| `data/extras.json` | Anecdotes et répliques cultes rédigées à la main, par id d'émission. |
| `data/videos/*.json` | Lots de vidéos YouTube, fusionnés dans `shows.json`. |
| `data/video-todo.csv` | Liste de travail pour relire les replays avec Claude in Chrome. |

### Reconstruire le catalogue depuis Wikipédia

```bash
node scripts/build-catalog.mjs   # parcourt les catégories de Wikipédia FR + Wikidata
node scripts/merge-videos.mjs    # remet les vidéos dans le nouveau catalogue
```

Le script garde les émissions françaises (hors fiction : séries et dessins animés exclus) dont la diffusion
recoupe 2000-2010, et calcule une popularité à partir des vues Wikipédia et du nombre de langues.

### Tubes

```bash
node scripts/build-music.mjs     # numéros un + meilleures ventes annuelles (Wikipédia FR, Wikidata)
node scripts/music-search.mjs    # clip, lives, remix et bonus sur YouTube
```

### Replays YouTube

1. `node scripts/youtube-search.mjs` cherche les épisodes (recherches par saison, plusieurs pages de résultats) et les bonus de chaque émission (`source: "auto"`). Saison, numéro, partie et date sont lus dans les titres (`scripts/lib/video-meta.mjs`).
2. `node scripts/make-todo.mjs` puis Claude in Chrome relit et complète lot par lot : voir
   [`docs/chrome-video-prompt.md`](docs/chrome-video-prompt.md).
3. `node scripts/merge-videos.mjs` et `node scripts/check-videos.mjs` (retire les vidéos mortes ou non intégrables).

Les vidéos sont seulement intégrées via le lecteur YouTube (`youtube-nocookie.com`) : rien n'est téléchargé ni rehébergé.

## Déploiement

Le site est hébergé sur AWS : bucket S3 privé `annee2000-site-158346964722` (Paris) servi par CloudFront
(https://d22mgjxgcxd3e3.cloudfront.net). Le workflow `.github/workflows/deploy-aws.yml` le met à jour à chaque push :
il se connecte à AWS par OIDC avec le rôle `annee2000-deploy` (aucune clé stockée sur GitHub), synchronise les fichiers
du site et vide le cache CloudFront.

## Licences

Textes des fiches issus de Wikipédia FR et Wikidata, sous licence CC BY-SA 4.0. Les vidéos restent la propriété de leurs ayants droit.
