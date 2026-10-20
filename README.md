# Années 2000 · La télé qu'on regardait

Le grand catalogue des émissions de télévision françaises diffusées entre **2000 et 2010** :
téléréalité, jeux, talk-shows, divertissements, magazines, humour, musique et jeunesse,
avec leurs replays YouTube intégrés sur une seule plateforme. Design inspiré de l'esthétique Y2K
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
| `data/shows.json` | Le catalogue complet (généré). |
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

### Replays YouTube

1. `node scripts/youtube-search.mjs` pré-remplit jusqu'à 6 vidéos par émission (`source: "auto"`).
2. `node scripts/make-todo.mjs` puis Claude in Chrome relit et complète lot par lot : voir
   [`docs/chrome-video-prompt.md`](docs/chrome-video-prompt.md).
3. `node scripts/merge-videos.mjs` et `node scripts/check-videos.mjs` (retire les vidéos mortes ou non intégrables).

Les vidéos sont seulement intégrées via le lecteur YouTube (`youtube-nocookie.com`) : rien n'est téléchargé ni rehébergé.

## Déploiement

Le workflow `.github/workflows/pages.yml` publie le site sur GitHub Pages à chaque push sur `main`
(activer Pages dans *Settings → Pages → Source : GitHub Actions*).

## Licences

Textes des fiches issus de Wikipédia FR et Wikidata, sous licence CC BY-SA 4.0. Les vidéos restent la propriété de leurs ayants droit.
