# Relire et compléter les replays avec Claude in Chrome

Le script `scripts/youtube-search.mjs` a déjà proposé jusqu'à 6 vidéos par émission (marquées `"source": "auto"`).
Claude in Chrome sert à **vérifier** ces choix et à **trouver** les vidéos manquantes, lot par lot.

## Préparer

```bash
node scripts/make-todo.mjs      # écrit data/video-todo.csv (lots de 25, cultes et émissions sans vidéo d'abord)
```

## Prompt à coller dans Claude in Chrome (un lot à la fois)

> Tu m'aides à remplir le site « Années 2000 », un catalogue des émissions de télé françaises diffusées entre 2000 et 2010.
> Voici le lot N° __ de `data/video-todo.csv` (colle ici les 25 lignes).
>
> Pour chaque émission :
> 1. Ouvre le lien `recherche_youtube` (et essaie aussi « titre + année » si besoin).
> 2. Garde au maximum 6 vidéos, dans cet ordre de priorité : épisodes complets ou primes d'époque (2000-2010),
>    puis moments cultes / extraits, puis le générique. Préfère les chaînes officielles (INA, Ina Culture, Ina Officiel,
>    TF1, M6, France TV, Canal+, ICON TV, Strip Tease Officiel) aux réuploads.
> 3. Ignore les vidéos qui ne parlent pas de cette émission, les versions étrangères, les parodies et les reprises après 2011.
> 4. Vérifie que la vidéo se lit bien (pas « vidéo indisponible » ni « lecture désactivée sur d'autres sites »).
>
> Réponds uniquement avec un JSON de cette forme, que j'enregistrerai dans `data/videos/chrome-lot-__.json` :
>
> ```json
> {
>   "loft-story": [
>     { "youtubeId": "XXXXXXXXXXX", "title": "Titre exact de la vidéo", "kind": "episode", "year": 2001, "channelName": "INA", "source": "chrome" }
>   ],
>   "nice-people": [
>     { "youtubeId": "YYYYYYYYYYY", "remove": true }
>   ]
> }
> ```
>
> `kind` vaut `episode`, `extrait`, `générique` ou `best-of`. `youtubeId` = les 11 caractères après `watch?v=`.
> Pour retirer une mauvaise vidéo proposée automatiquement, utilise `"remove": true`.
> Si tu ne trouves rien pour une émission, mets une liste vide.

## Intégrer le lot

```bash
node scripts/merge-videos.mjs   # fusionne data/videos/*.json dans data/shows.json (les vidéos relues passent devant)
node scripts/check-videos.mjs   # retire les vidéos supprimées ou non intégrables
node scripts/merge-videos.mjs
git add data && git commit -m "Replays : lot __"
```
