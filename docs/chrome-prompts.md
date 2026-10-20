# Prompts Claude in Chrome : 681 émissions, 69 lots
Un lot à la fois : copier tout le bloc du lot dans Claude in Chrome, puis coller sa réponse JSON à Claude Code.

## Lot 2

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 2, do them one by one, in this order):
- id: intervilles | show: Intervilles | channel: TF1 | years: 2000-2010 | seasons we already have: 2
- id: la-france-a-un-incroyable-talent | show: La France a un incroyable talent | channel: M6 | years: 2006-2010 | seasons we already have: 2
- id: faites-entrer-l-accuse | show: Faites entrer l'accusé | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: on-n-est-pas-couche | show: On n'est pas couché | channel: France 2 | years: 2006-2010 | seasons we already have: 5
- id: super-nanny | show: Super Nanny | channel: M6 | years: 2005-2010 | seasons we already have: 1 2 6
- id: l-amour-est-dans-le-pre | show: L'amour est dans le pré | channel: M6 | years: 2006-2010 | seasons we already have: none
- id: loft-story | show: Loft Story | channel: M6 | years: 2001-2002 | seasons we already have: 1 2
- id: groland | show: Groland | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: strip-tease | show: Strip-Tease | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: pekin-express | show: Pékin Express | channel: M6 | years: 2006-2010 | seasons we already have: 1 2 4 5

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 3

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 3, do them one by one, in this order):
- id: qui-veut-gagner-des-millions | show: Qui veut gagner des millions ? | channel: TF1 | years: 2000-2010 | seasons we already have: 2 4 5 6 7 8 9 10 11
- id: le-juste-prix | show: Le Juste Prix | channel: TF1 | years: 2000-2010 | seasons we already have: 1 2 3 4 5 6 7 8 10 11 12 15
- id: questions-pour-un-champion | show: Questions pour un champion | channel: France 3 | years: 2000-2010 | seasons we already have: 2 7
- id: y-a-que-la-verite-qui-compte | show: Y'a que la vérité qui compte | channel: TF1 | years: 2000-2010 | seasons we already have: 1 2 3 4 5
- id: l-ile-de-la-tentation | show: L'Île de la tentation | channel: TF1 | years: 2002-2010 | seasons we already have: 4 5 8
- id: le-grand-journal | show: Le Grand Journal | channel: Canal+ | years: 2004-2010 | seasons we already have: none
- id: les-minikeums | show: Les Minikeums | channel: France 3 | years: 2000-2002 | seasons we already have: 1
- id: vivement-dimanche | show: Vivement dimanche | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: la-ferme-celebrites | show: La Ferme Célébrités | channel: TF1 | years: 2004-2010 | seasons we already have: 1 2 3
- id: le-bigdil | show: Le Bigdil | channel: TF1 | years: 2000-2004 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 4

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 4, do them one by one, in this order):
- id: tout-le-monde-en-parle | show: Tout le monde en parle | channel: France 2 | years: 2000-2006 | seasons we already have: none
- id: les-enfants-de-la-tele | show: Les Enfants de la télé | channel: TF1 | years: 2000-2010 | seasons we already have: 1 2 3 13 15
- id: popstars | show: Popstars | channel: M6 | years: 2001-2010 | seasons we already have: 2
- id: a-prendre-ou-a-laisser | show: À prendre ou à laisser | channel: TF1 | years: 2004-2010 | seasons we already have: 1 2 3 4 5 6 7
- id: le-plus-grand-cabaret-du-monde | show: Le Plus Grand Cabaret du monde | channel: France 2 | years: 2000-2010 | seasons we already have: 13
- id: attention-a-la-marche | show: Attention à la marche ! | channel: TF1 | years: 2001-2010 | seasons we already have: 1 2 3 4 5 9 10
- id: le-maillon-faible | show: Le Maillon faible | channel: TF1 | years: 2001-2010 | seasons we already have: 1 2 3 4
- id: un-diner-presque-parfait | show: Un dîner presque parfait | channel: M6 | years: 2008-2010 | seasons we already have: 2 3
- id: zone-interdite | show: Zone interdite | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: c-est-mon-choix | show: C'est mon choix | channel: France 3 | years: 2000-2010 | seasons we already have: 1 2

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 5

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 5, do them one by one, in this order):
- id: greg-le-millionnaire | show: Greg le millionnaire | channel: TF1 | years: 2003-2003 | seasons we already have: none
- id: nice-people | show: Nice People | channel: TF1 | years: 2003-2003 | seasons we already have: none
- id: bachelor-le-gentleman-celibataire | show: Bachelor, le gentleman célibataire | channel: M6 | years: 2003-2010 | seasons we already have: none
- id: la-methode-cauet | show: La Méthode Cauet | channel: TF1 | years: 2003-2008 | seasons we already have: none
- id: x-factor | show: X Factor | channel: M6 | years: 2009-2010 | seasons we already have: 1 2
- id: hit-machine | show: Hit Machine | channel: M6 | years: 2000-2009 | seasons we already have: none
- id: ca-se-discute | show: Ça se discute | channel: France 2 | years: 2000-2009 | seasons we already have: none
- id: vis-ma-vie | show: Vis ma vie | channel: TF1 | years: 2001-2007 | seasons we already have: 1 2
- id: le-zapping | show: Le Zapping | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: combien-ca-coute | show: Combien ça coûte ? | channel: TF1 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 6

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 6, do them one by one, in this order):
- id: morandini | show: Morandini ! | channel: Direct 8 | years: 2006-2010 | seasons we already have: none
- id: les-douze-coups-de-midi | show: Les Douze Coups de midi | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: des-chiffres-et-des-lettres | show: Des chiffres et des lettres | channel: France 2 | years: 2000-2010 | seasons we already have: 1 2 6 7 10
- id: la-minute-de-verite | show: La Minute de vérité (série documentaire) | channel: Direct 8 | years: 2004-2010 | seasons we already have: none
- id: victoires-de-la-musique | show: Victoires de la musique | channel: ? | years: 2000-2010 | seasons we already have: none
- id: j-irai-dormir-chez-vous | show: J'irai dormir chez vous | channel: Canal+ | years: 2005-2010 | seasons we already have: none
- id: tout-le-monde-veut-prendre-sa-place | show: Tout le monde veut prendre sa place | channel: France 2 | years: 2006-2010 | seasons we already have: 1 2 3 4
- id: touche-pas-a-mon-poste | show: Touche pas à mon poste ! | channel: France 4 | years: 2010-2010 | seasons we already have: none
- id: telematin | show: Télématin | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: la-carte-aux-tresors | show: La Carte aux trésors | channel: France 3 | years: 2000-2009 | seasons we already have: 1 2 3 4 5 6 7 10

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 7

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 7, do them one by one, in this order):
- id: le-dessous-des-cartes | show: Le Dessous des cartes | channel: Arte | years: 2000-2010 | seasons we already have: 2
- id: art-attack | show: Art Attack | channel: Disney Channel | years: 2000-2006 | seasons we already have: 2 14
- id: c-a-vous | show: C à vous | channel: France 5 | years: 2009-2010 | seasons we already have: none
- id: des-trains-pas-comme-les-autres | show: Des trains pas comme les autres | channel: France 2 | years: 2000-2010 | seasons we already have: 9
- id: domino-day | show: Domino Day | channel: TF1 | years: 2000-2009 | seasons we already have: none
- id: la-roue-de-la-fortune | show: La Roue de la fortune | channel: TF1 | years: 2000-2010 | seasons we already have: 1 2 4 7
- id: mot-de-passe | show: Mot de passe | channel: France 2 | years: 2009-2010 | seasons we already have: 1
- id: secrets-d-histoire | show: Secrets d'Histoire | channel: France 2 | years: 2007-2010 | seasons we already have: none
- id: journal-de-20-heures | show: Journal de 20 heures | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: burger-quiz | show: Burger Quiz | channel: Canal+ | years: 2001-2002 | seasons we already have: 1

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 8

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 8, do them one by one, in this order):
- id: non-elucide | show: Non élucidé | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: top-chef | show: Top Chef | channel: M6 | years: 2010-2010 | seasons we already have: 1
- id: telefoot | show: Téléfoot | channel: TF1 | years: 2000-2010 | seasons we already have: 1 4 5 6 29
- id: c-dans-l-air | show: C dans l'air | channel: France 5 | years: 2001-2010 | seasons we already have: none
- id: la-classe | show: La Classe | channel: France 3 | years: 2000-2005 | seasons we already have: 8
- id: l-ecole-des-fans | show: L'École des fans | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: thalassa | show: Thalassa | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: telethon-en-france | show: Téléthon en France | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: on-n-demande-qu-a-en-rire | show: On n'demande qu'à en rire | channel: France 2 | years: 2010-2010 | seasons we already have: 1
- id: pascal-le-grand-frere | show: Pascal, le grand frère | channel: TF1 | years: 2006-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 9

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 9, do them one by one, in this order):
- id: 27e-ceremonie-des-cesar | show: 27e cérémonie des César | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: masters-de-n-oubliez-pas-les-paroles | show: Masters de N'oubliez pas les paroles ! | channel: France 2 | years: 2007-2010 | seasons we already have: none
- id: silence-ca-pousse | show: Silence, ça pousse ! | channel: France 5 | years: 2000-2010 | seasons we already have: none
- id: la-grande-librairie | show: La Grande Librairie | channel: France 5 | years: 2008-2010 | seasons we already have: none
- id: 30e-ceremonie-des-cesar | show: 30e cérémonie des César | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: echappees-belles | show: Échappées belles | channel: France 5 | years: 2006-2010 | seasons we already have: none
- id: le-pensionnat-de-chavagnes | show: Le Pensionnat de Chavagnes | channel: M6 | years: 2004-2004 | seasons we already have: none
- id: 26e-ceremonie-des-cesar | show: 26e cérémonie des César | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: slam | show: Slam | channel: France 2 | years: 2009-2010 | seasons we already have: 1 2
- id: arret-sur-images | show: Arrêt sur images | channel: France 5 | years: 2000-2007 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 10

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 10, do them one by one, in this order):
- id: pyramide | show: Pyramide | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: le-grand-concours | show: Le Grand Concours | channel: TF1 | years: 2002-2010 | seasons we already have: none
- id: la-trilogie-du-samedi | show: La Trilogie du samedi | channel: M6 | years: 2000-2008 | seasons we already have: none
- id: motus | show: Motus | channel: France 2 | years: 2000-2010 | seasons we already have: 16
- id: zouzous | show: Zouzous | channel: France 5 | years: 2000-2010 | seasons we already have: none
- id: journal-de-20-heures-2 | show: Journal de 20 heures | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: le-mag-de-la-sante | show: Le Mag de la santé | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: recherche-appartement-ou-maison | show: Recherche appartement ou maison | channel: M6 | years: 2006-2010 | seasons we already have: none
- id: morning-live | show: Morning Live | channel: M6 | years: 2000-2003 | seasons we already have: none
- id: 28e-ceremonie-des-cesar | show: 28e cérémonie des César | channel: Canal+ | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 11

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 11, do them one by one, in this order):
- id: des-racines-et-des-ailes | show: Des racines et des ailes | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: soupcons | show: Soupçons (mini-série, 2004) | channel: Canal+ | years: 2004-2004 | seasons we already have: none
- id: c-politique | show: C politique | channel: France 5 | years: 2009-2010 | seasons we already have: none
- id: enquetes-criminelles-le-magazine-des-faits-divers | show: Enquêtes criminelles : le magazine des faits divers | channel: W9 | years: 2008-2010 | seasons we already have: none
- id: in-ze-boite | show: In ze boîte | channel: Gulli | years: 2007-2010 | seasons we already have: none
- id: jamel-comedy-club | show: Jamel Comedy Club | channel: Canal+ | years: 2006-2010 | seasons we already have: none
- id: after-foot | show: After Foot | channel: BFM TV | years: 2006-2010 | seasons we already have: none
- id: complement-d-enquete | show: Complément d'enquête | channel: France 2 | years: 2001-2010 | seasons we already have: none
- id: ca-peut-vous-arriver | show: Ça peut vous arriver | channel: TF1 | years: 2001-2002 | seasons we already have: none
- id: apocalypse | show: Apocalypse (série documentaire) | channel: ? | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 12

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 12, do them one by one, in this order):
- id: nulle-part-ailleurs | show: Nulle part ailleurs | channel: Canal+ | years: 2000-2001 | seasons we already have: none
- id: une-famille-en-or | show: Une famille en or | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: les-z-amours | show: Les Z'amours | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: tournez-manege | show: Tournez manège ! | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: top-50 | show: Top 50 | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: masterchef | show: MasterChef | channel: TF1 | years: 2010-2010 | seasons we already have: 1
- id: ca-va-se-savoir | show: Ça va se savoir ! | channel: NT1 | years: 2002-2010 | seasons we already have: none
- id: emissions-speciales-de-n-oubliez-pas-les-paroles | show: Émissions spéciales de N'oubliez pas les paroles ! | channel: France 2 | years: 2007-2010 | seasons we already have: none
- id: on-a-tout-essaye | show: On a tout essayé | channel: France 2 | years: 2000-2007 | seasons we already have: none
- id: champs-elysees | show: Champs-Élysées | channel: France 2 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 13

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 13, do them one by one, in this order):
- id: tfou | show: Tfou | channel: TF1 | years: 2007-2010 | seasons we already have: none
- id: envoye-special | show: Envoyé spécial | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: kd2a | show: KD2A | channel: France 2 | years: 2001-2009 | seasons we already have: none
- id: mon-incroyable-fiance | show: Mon incroyable fiancé | channel: TF1 | years: 2005-2010 | seasons we already have: none
- id: le-petit-journal | show: Le Petit Journal | channel: Canal+ | years: 2004-2010 | seasons we already have: none
- id: la-maison-des-maternelles | show: La maison des Maternelles | channel: France 2 | years: 2001-2010 | seasons we already have: none
- id: turbo | show: Turbo | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: cinema-de-minuit | show: Cinéma de minuit | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: journal-de-13-heures | show: Journal de 13 heures | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: le-journal-du-hard | show: Le Journal du hard | channel: Canal+ | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 14

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 14, do them one by one, in this order):
- id: stade-2 | show: Stade 2 | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: video-gag | show: Vidéo Gag | channel: TF1 | years: 2000-2008 | seasons we already have: none
- id: d-et-co | show: D&CO | channel: M6 | years: 2006-2010 | seasons we already have: none
- id: faut-pas-rever | show: Faut pas rêver | channel: France 3 | years: 2000-2010 | seasons we already have: 3
- id: sept-a-huit | show: Sept à huit | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: ciel-mon-mardi | show: Ciel, mon mardi ! | channel: TF1 | years: 2000-2001 | seasons we already have: none
- id: teleshopping | show: Téléshopping | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: the-ou-cafe | show: Thé ou Café | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: 30-millions-d-amis | show: 30 millions d'amis | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: automoto | show: Automoto | channel: TF1 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 15

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 15, do them one by one, in this order):
- id: l-academie-des-neuf | show: L'Académie des neuf | channel: NRJ 12 | years: 2000-2010 | seasons we already have: none
- id: le-pensionnat-de-sarlat | show: Le Pensionnat de Sarlat | channel: M6 | years: 2005-2005 | seasons we already have: none
- id: journal-de-13-heures-2 | show: Journal de 13 heures | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: m6-kid | show: M6 Kid | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: le-grand-concours-des-animateurs | show: Le Grand Concours des animateurs | channel: TF1 | years: 2003-2010 | seasons we already have: none
- id: sans-aucun-doute | show: Sans aucun doute | channel: TF1 | years: 2000-2010 | seasons we already have: 7
- id: le-jour-du-seigneur | show: Le Jour du Seigneur | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: la-chance-aux-chansons | show: La Chance aux chansons | channel: TF1 | years: 2000-2000 | seasons we already have: none
- id: c-est-du-propre | show: C'est du propre ! | channel: M6 | years: 2005-2010 | seasons we already have: none
- id: ludo | show: Ludo | channel: France 3 | years: 2009-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 16

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 16, do them one by one, in this order):
- id: les-enquetes-extraordinaires | show: Les Enquêtes extraordinaires | channel: NT1 | years: 2000-2010 | seasons we already have: none
- id: canal-football-club | show: Canal Football Club | channel: Canal+ | years: 2008-2010 | seasons we already have: none
- id: tf | show: TF! | channel: TF1 | years: 2000-2006 | seasons we already have: none
- id: tous-ensemble | show: Tous ensemble | channel: TF1 | years: 2009-2010 | seasons we already have: none
- id: e-m6 | show: E=M6 | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: 50-minutes-inside | show: 50 minutes inside | channel: TF1 | years: 2006-2010 | seasons we already have: none
- id: action-discrete | show: Action discrète | channel: Canal+ | years: 2006-2010 | seasons we already have: none
- id: capital | show: Capital | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: fa-si-la-chanter | show: Fa si la chanter | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: operation-seduction-aux-caraibes | show: Opération séduction aux Caraïbes | channel: M6 | years: 2002-2004 | seasons we already have: 2

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 17

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 17, do them one by one, in this order):
- id: comment-ca-va-bien | show: Comment ça va bien ! | channel: France 2 | years: 2010-2010 | seasons we already have: none
- id: graines-de-star | show: Graines de star | channel: M6 | years: 2000-2003 | seasons we already have: none
- id: 90-enquetes | show: 90' Enquêtes | channel: TMC | years: 2007-2010 | seasons we already have: none
- id: union-libre | show: Union libre | channel: France 2 | years: 2000-2002 | seasons we already have: none
- id: arte-journal | show: Arte Journal | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: on-ne-peut-pas-plaire-a-tout-le-monde | show: On ne peut pas plaire à tout le monde | channel: France 3 | years: 2000-2006 | seasons we already have: none
- id: le-1945 | show: Le 1945 | channel: M6 | years: 2009-2010 | seasons we already have: none
- id: incroyable-mais-vrai | show: Incroyable mais vrai ! | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: petits-plats-en-equilibre | show: Petits Plats en équilibre | channel: TF1 | years: 2008-2010 | seasons we already have: none
- id: je-suis-une-celebrite-sortez-moi-de-la | show: Je suis une célébrité, sortez-moi de là ! | channel: TF1 | years: 2006-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 18

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 18, do them one by one, in this order):
- id: absolument-stars | show: Absolument stars | channel: M6 | years: 2009-2010 | seasons we already have: none
- id: karambolage | show: Karambolage | channel: Arte | years: 2004-2010 | seasons we already have: none
- id: 93-faubourg-saint-honore | show: 93, faubourg Saint-Honoré | channel: Paris Première | years: 2003-2007 | seasons we already have: none
- id: a-la-clairefontaine | show: À la Clairefontaine | channel: Canal+ | years: 2002-2006 | seasons we already have: none
- id: culture-pub | show: Culture Pub | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: l-amour-est-aveugle | show: L'amour est aveugle | channel: TF1 | years: 2007-2010 | seasons we already have: none
- id: que-le-meilleur-gagne | show: Que le meilleur gagne | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: super-moscato-show | show: Super Moscato Show | channel: ? | years: 2007-2010 | seasons we already have: none
- id: tellement-vrai | show: Tellement vrai | channel: NRJ 12 | years: 2008-2010 | seasons we already have: none
- id: avis-de-recherche | show: Avis de recherche | channel: TF1 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 19

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 19, do them one by one, in this order):
- id: ce-soir | show: Ce soir (ou jamais !) | channel: France 2 | years: 2006-2010 | seasons we already have: none
- id: les-grands-du-rire | show: Les Grands du rire | channel: France 3 | years: 2003-2010 | seasons we already have: none
- id: confessions-intimes | show: Confessions intimes | channel: TF1 | years: 2001-2010 | seasons we already have: none
- id: maison-a-vendre | show: Maison à vendre | channel: M6 | years: 2007-2010 | seasons we already have: none
- id: toute-une-histoire | show: Toute une histoire | channel: France 2 | years: 2006-2010 | seasons we already have: none
- id: ushuaia-nature | show: Ushuaïa Nature | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: qui-est-qui | show: Qui est qui ? | channel: France 2 | years: 2000-2002 | seasons we already have: none
- id: planete-rap | show: Planète Rap | channel: France 4 | years: 2000-2010 | seasons we already have: none
- id: zone-rouge | show: Zone rouge | channel: TF1 | years: 2003-2005 | seasons we already have: none
- id: dilemme | show: Dilemme | channel: W9 | years: 2010-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 20

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 20, do them one by one, in this order):
- id: genies-en-herbe | show: Génies en herbe | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: belle-toute-nue | show: Belle toute nue | channel: M6 | years: 2008-2010 | seasons we already have: none
- id: paris-derniere | show: Paris Dernière | channel: Paris Première | years: 2000-2010 | seasons we already have: 9 10
- id: premiere-compagnie | show: Première Compagnie | channel: TF1 | years: 2005-2005 | seasons we already have: none
- id: en-aparte | show: En aparté | channel: Canal+ | years: 2001-2010 | seasons we already have: none
- id: la-cible | show: La Cible | channel: France 2 | years: 2003-2007 | seasons we already have: none
- id: la-grosse-emission | show: La Grosse Émission | channel: Comédie ! | years: 2000-2010 | seasons we already have: none
- id: enquete-exclusive | show: Enquête exclusive | channel: M6 | years: 2005-2010 | seasons we already have: none
- id: ici-19-20 | show: Ici 19/20 | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: les-terriens-du-samedi | show: Les Terriens du samedi ! | channel: Canal+ | years: 2006-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 21

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 21, do them one by one, in this order):
- id: la-maison-france-5 | show: La Maison France 5 | channel: France 5 | years: 2003-2010 | seasons we already have: none
- id: vivement-dimanche-prochain | show: Vivement dimanche prochain | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: un-tresor-dans-votre-maison | show: Un trésor dans votre maison | channel: M6 | years: 2010-2010 | seasons we already have: none
- id: bouillon-de-culture | show: Bouillon de culture | channel: France 2 | years: 2000-2001 | seasons we already have: none
- id: fear-factor | show: Fear Factor | channel: TF1 | years: 2003-2004 | seasons we already have: 2
- id: la-fureur | show: La Fureur | channel: TF1 | years: 2000-2007 | seasons we already have: none
- id: exclusif | show: Exclusif | channel: TF1 | years: 2000-2002 | seasons we already have: none
- id: tout-le-sport | show: Tout le sport | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: qui-veut-epouser-mon-fils | show: Qui veut épouser mon fils ? | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: toowam | show: Toowam | channel: France 3 | years: 2006-2009 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 22

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 22, do them one by one, in this order):
- id: millionnaire | show: Millionnaire | channel: TF1 | years: 2000-2009 | seasons we already have: none
- id: bon-appetit-bien-sur | show: Bon appétit bien sûr | channel: France 3 | years: 2000-2009 | seasons we already have: none
- id: la-meteo-de-gulli | show: La Météo de Gulli | channel: Gulli | years: 2008-2010 | seasons we already have: none
- id: le-grand-bluff | show: Le Grand Bluff | channel: TF1 | years: 2000-2002 | seasons we already have: none
- id: les-nouveaux-explorateurs | show: Les Nouveaux Explorateurs | channel: Canal+ | years: 2007-2010 | seasons we already have: none
- id: plein-les-yeux | show: Plein les yeux | channel: TF1 | years: 2000-2003 | seasons we already have: none
- id: stars-a-domicile | show: Stars à domicile | channel: TF1 | years: 2001-2004 | seasons we already have: none
- id: tracks | show: Tracks | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: 66-minutes | show: 66 minutes | channel: M6 | years: 2006-2010 | seasons we already have: none
- id: soir-3 | show: Soir 3 | channel: France 3 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 23

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 23, do them one by one, in this order):
- id: ici-12-13 | show: Ici 12/13 | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: le-1245 | show: Le 1245 | channel: M6 | years: 2006-2010 | seasons we already have: none
- id: le-cercle | show: Le Cercle | channel: Canal+ | years: 2004-2010 | seasons we already have: none
- id: les-quatre-verites | show: Les Quatre Vérités | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: l-equipe-du-dimanche | show: L'Équipe du dimanche | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: le-grand-jury | show: Le Grand Jury | channel: Paris Première | years: 2000-2010 | seasons we already have: none
- id: m6-boutique | show: M6 Boutique | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: la-marche-du-siecle | show: La Marche du siècle | channel: France 3 | years: 2000-2001 | seasons we already have: none
- id: cine-dimanche | show: Ciné Dimanche | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: dance-machine | show: Dance Machine | channel: M6 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 24

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 24, do them one by one, in this order):
- id: va-savoir | show: Va savoir | channel: France 3 | years: 2000-2004 | seasons we already have: none
- id: architectures | show: Architectures | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: frequenstar | show: Fréquenstar | channel: M6 | years: 2000-2006 | seasons we already have: none
- id: level-one | show: Level One | channel: ? | years: 2000-2010 | seasons we already have: none
- id: ca-se-dispute | show: Ça se dispute | channel: i>Télé | years: 2003-2010 | seasons we already have: none
- id: corpus-christi | show: Corpus Christi | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: la-matinale | show: La Matinale | channel: Canal+ | years: 2004-2010 | seasons we already have: none
- id: les-animaux-de-la-8 | show: Les Animaux de la 8 | channel: Direct 8 | years: 2005-2010 | seasons we already have: none
- id: palettes | show: Palettes | channel: Arte | years: 2000-2003 | seasons we already have: none
- id: total-wipeout | show: Total Wipeout | channel: M6 | years: 2009-2010 | seasons we already have: 1

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 25

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 25, do them one by one, in this order):
- id: 1-contre-100 | show: 1 contre 100 | channel: TF1 | years: 2007-2008 | seasons we already have: none
- id: voyage-au-bout-de-la-nuit | show: Voyage au bout de la nuit | channel: Direct 8 | years: 2008-2010 | seasons we already have: none
- id: mission-pirattak | show: Mission Pirattak | channel: France 3 | years: 2000-2000 | seasons we already have: none
- id: panique-dans-l-oreillette | show: Panique dans l'oreillette | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: les-colocataires | show: Les Colocataires | channel: M6 | years: 2004-2004 | seasons we already have: none
- id: t-o-3 | show: T O 3 | channel: France 3 | years: 2002-2004 | seasons we already have: none
- id: c-est-au-programme | show: C'est au programme | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: d-art-d-art | show: D'art d'art ! | channel: France 2 | years: 2002-2010 | seasons we already have: 2
- id: les-30-histoires-les-plus-spectaculaires | show: Les 30 Histoires les plus spectaculaires | channel: TF1 | years: 2007-2010 | seasons we already have: none
- id: histoires-naturelles | show: Histoires naturelles (série documentaire) | channel: TF1 | years: 2000-2009 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 26

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 26, do them one by one, in this order):
- id: queer-cinq-experts-dans-le-vent | show: Queer, cinq experts dans le vent | channel: TF1 | years: 2004-2004 | seasons we already have: none
- id: velo-club | show: Vélo Club | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: les-100-plus-grands | show: Les 100 plus grands... | channel: TF1 | years: 2003-2010 | seasons we already have: none
- id: les-escapades-de-petitrenaud | show: Les Escapades de Petitrenaud | channel: France 5 | years: 2006-2010 | seasons we already have: none
- id: les-jeudis-de-l-angoisse | show: Les Jeudis de l'angoisse | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: secrets-d-actualite | show: Secrets d'actualité | channel: M6 | years: 2000-2008 | seasons we already have: none
- id: 20-h-10-petantes | show: 20 h 10 pétantes | channel: Canal+ | years: 2003-2005 | seasons we already have: none
- id: cresus | show: Crésus | channel: TF1 | years: 2005-2006 | seasons we already have: none
- id: grands-reportages | show: Grands Reportages | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: un-siecle-d-ecrivains | show: Un siècle d'écrivains | channel: France 3 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 27

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 27, do them one by one, in this order):
- id: ca-balance-a-paris | show: Ça balance à Paris | channel: Paris Première | years: 2004-2010 | seasons we already have: none
- id: enquete-d-action | show: Enquête d'action | channel: W9 | years: 2005-2010 | seasons we already have: none
- id: faits-divers-le-mag | show: Faits divers, le mag | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: infrarouge | show: Infrarouge | channel: France 2 | years: 2006-2010 | seasons we already have: none
- id: quelle-aventure | show: Quelle aventure ! | channel: France 3 | years: 2001-2005 | seasons we already have: none
- id: sale-temps-pour-la-planete | show: Sale temps pour la planète | channel: ? | years: 2007-2010 | seasons we already have: none
- id: l-effet-papillon | show: L'Effet papillon | channel: Canal+ | years: 2006-2010 | seasons we already have: none
- id: questions-pour-un-super-champion | show: Questions pour un super champion | channel: France 3 | years: 2006-2010 | seasons we already have: none
- id: zapping-zone | show: Zapping Zone | channel: Disney Channel | years: 2000-2005 | seasons we already have: none
- id: 5-rue-sesame | show: 5, rue Sésame | channel: France 5 | years: 2005-2007 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 28

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 28, do them one by one, in this order):
- id: cineastes-de-notre-temps | show: Cinéastes de notre temps | channel: Arte | years: 2000-2009 | seasons we already have: none
- id: club-disney | show: Club Disney | channel: TF1 | years: 2000-2006 | seasons we already have: none
- id: la-maison-du-bluff | show: La Maison du bluff | channel: NRJ 12 | years: 2010-2010 | seasons we already have: 1
- id: le-vrai-journal | show: Le Vrai Journal | channel: Canal+ | years: 2000-2006 | seasons we already have: none
- id: appels-d-urgence | show: Appels d'urgence | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: le-grand-rendez-vous | show: Le Grand Rendez-vous | channel: i>Télé | years: 2002-2010 | seasons we already have: none
- id: les-annees-bonheur | show: Les Années bonheur | channel: France 2 | years: 2006-2010 | seasons we already have: none
- id: operation-okavango | show: Opération Okavango | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: ce-soir-avec-arthur | show: Ce soir avec Arthur | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: histoire-parallele | show: Histoire parallèle | channel: Arte | years: 2000-2001 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 29

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 29, do them one by one, in this order):
- id: identity | show: Identity | channel: TF1 | years: 2009-2010 | seasons we already have: none
- id: l-il-du-cyclone | show: L'Œil du cyclone | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: special-investigation | show: Spécial Investigation | channel: Canal+ | years: 2006-2010 | seasons we already have: none
- id: tous-sur-orbite | show: Tous sur orbite ! | channel: France 5 | years: 2000-2010 | seasons we already have: none
- id: pieces-a-conviction | show: Pièces à conviction | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: t-empeches-tout-le-monde-de-dormir | show: T'empêches tout le monde de dormir | channel: M6 | years: 2006-2008 | seasons we already have: none
- id: un-livre-un-jour | show: Un livre, un jour | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: blow-up | show: Blow Up | channel: Arte | years: 2010-2010 | seasons we already have: none
- id: jour-de-foot | show: Jour de foot | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: 360-geo | show: 360° Geo | channel: Arte | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 30

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 30, do them one by one, in this order):
- id: en-route-pour-l-aventure | show: En route pour l'aventure | channel: ? | years: 2000-2010 | seasons we already have: none
- id: islam | show: Islam | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: vie-privee-vie-publique | show: Vie privée, vie publique | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: en-toutes-lettres | show: En toutes lettres | channel: France 2 | years: 2009-2010 | seasons we already have: none
- id: le-six | show: Le Six' | channel: M6 | years: 2000-2009 | seasons we already have: none
- id: gym-direct | show: Gym Direct | channel: Direct 8 | years: 2005-2010 | seasons we already have: none
- id: on-n-a-pas-tout-dit | show: On n'a pas tout dit | channel: France 2 | years: 2007-2008 | seasons we already have: none
- id: 13-h-15-le-dimanche | show: 13 h 15, le dimanche | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: bourdin-direct | show: Bourdin Direct | channel: BFM TV | years: 2001-2010 | seasons we already have: none
- id: chabada | show: Chabada | channel: France 3 | years: 2009-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 31

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 31, do them one by one, in this order):
- id: f1-a-la-une | show: F1 à la Une | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: le-coffre | show: Le Coffre | channel: France 2 | years: 2004-2004 | seasons we already have: none
- id: mots-croises | show: Mots croisés | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: prouve-le | show: Prouve-le ! | channel: Gulli | years: 2005-2007 | seasons we already have: none
- id: direct-auto | show: Direct Auto | channel: Direct 8 | years: 2005-2010 | seasons we already have: none
- id: incroyables-experiences | show: Incroyables Expériences | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: les-petits-papiers-de-noel | show: Les Petits Papiers de Noël | channel: ? | years: 2000-2010 | seasons we already have: none
- id: recre-kids | show: Récré Kids | channel: TMC | years: 2000-2002 | seasons we already have: 2
- id: a-la-conquete-de-l-espace | show: À la conquête de l'espace | channel: Arte | years: 2005-2005 | seasons we already have: none
- id: mysteres-d-archives | show: Mystères d'archives | channel: Arte | years: 2009-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 32

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 32, do them one by one, in this order):
- id: l-ete-de-tous-les-records | show: L'Été de tous les records | channel: France 3 | years: 2003-2005 | seasons we already have: none
- id: marjolaine-et-les-millionnaires | show: Marjolaine et les Millionnaires | channel: TF1 | years: 2004-2004 | seasons we already have: none
- id: c-a-dire | show: C à dire ?! | channel: France 5 | years: 2007-2010 | seasons we already have: none
- id: fan-de-stars | show: Fan de stars | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: nouveau-look-pour-une-nouvelle-vie | show: Nouveau Look pour une nouvelle vie | channel: M6 | years: 2004-2010 | seasons we already have: none
- id: riding-zone | show: Riding Zone | channel: France Ô | years: 2007-2010 | seasons we already have: none
- id: 100-foot | show: 100 % foot | channel: M6 | years: 2005-2010 | seasons we already have: none
- id: accuse-a-tort | show: Accusé à tort | channel: M6 | years: 2010-2010 | seasons we already have: none
- id: c-est-ma-vie | show: C'est ma vie | channel: M6 | years: 2010-2010 | seasons we already have: none
- id: l-ecole-des-stars | show: L'École des stars | channel: Direct 8 | years: 2008-2009 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 33

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 33, do them one by one, in this order):
- id: salut-les-toons | show: Salut les toons | channel: TF1 | years: 2000-2000 | seasons we already have: none
- id: sebastien-c-est-fou | show: Sébastien c'est fou ! | channel: TF1 | years: 2000-2010 | seasons we already have: 22
- id: sport-6 | show: Sport 6 | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: service-maximum | show: Service Maximum | channel: France 2 | years: 2008-2009 | seasons we already have: none
- id: 60-jours-60-nuits | show: 60 jours 60 nuits | channel: Canal+ | years: 2003-2003 | seasons we already have: none
- id: les-parents-les-plus-stricts-du-monde | show: Les Parents les plus stricts du monde | channel: M6 | years: 2009-2010 | seasons we already have: 1 2
- id: les-sept-peches-capitaux | show: Les Sept Péchés capitaux | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: l-emission-impossible | show: L'Émission impossible | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: l-il-et-la-main | show: L'Œil et la Main | channel: France 5 | years: 2000-2010 | seasons we already have: none
- id: l-origine-du-christianisme | show: L'Origine du christianisme | channel: Arte | years: 2003-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 34

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 34, do them one by one, in this order):
- id: sagas | show: Sagas | channel: TF1 | years: 2000-2007 | seasons we already have: none
- id: bunny-et-tous-ses-amis | show: Bunny et tous ses amis | channel: France 3 | years: 2001-2008 | seasons we already have: none
- id: etes-vous-plus-fort-qu-un-eleve-de-10-ans | show: Êtes-vous plus fort qu'un élève de 10 ans ? | channel: M6 | years: 2007-2007 | seasons we already have: none
- id: expression-directe | show: Expression directe | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: fourchette-et-sac-a-dos | show: Fourchette et sac à dos | channel: France 5 | years: 2007-2010 | seasons we already have: none
- id: hypershow | show: Hypershow | channel: Canal+ | years: 2002-2002 | seasons we already have: none
- id: les-specialistes | show: Les Spécialistes | channel: Canal+ | years: 2006-2010 | seasons we already have: none
- id: retro-game-one | show: Retro Game One | channel: ? | years: 2007-2010 | seasons we already have: none
- id: samedi-soir-en-direct | show: Samedi soir en direct | channel: Canal+ | years: 2003-2004 | seasons we already have: none
- id: cartoon | show: Cartoon+ | channel: Canal+ | years: 2009-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 35

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 35, do them one by one, in this order):
- id: rencontres-a-xv | show: Rencontres à XV | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: retour-gagnant | show: Retour gagnant | channel: TF1 | years: 2003-2010 | seasons we already have: none
- id: la-kaz | show: La Kaz | channel: Canal+ | years: 2004-2005 | seasons we already have: none
- id: le-kadox | show: Le Kadox | channel: France 3 | years: 2000-2000 | seasons we already have: none
- id: les-infiltres | show: Les Infiltrés | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: nous-ne-sommes-pas-des-anges | show: Nous ne sommes pas des anges | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: reportages | show: Reportages | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: les-grands-enfants | show: Les Grands Enfants | channel: ? | years: 2000-2010 | seasons we already have: none
- id: 100-question | show: 100 % Question | channel: France 5 | years: 2000-2004 | seasons we already have: none
- id: le-royaume | show: Le Royaume | channel: TF1 | years: 2006-2006 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 36

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 36, do them one by one, in this order):
- id: iapiap | show: Iapiap ! | channel: Canal J | years: 2000-2010 | seasons we already have: none
- id: la-planete-miracle | show: La Planète Miracle | channel: ? | years: 2000-2010 | seasons we already have: none
- id: love-and-bluff-qui-de-nous-trois | show: Love and Bluff : Qui de nous trois ? | channel: TF1 | years: 2009-2009 | seasons we already have: none
- id: 100-mag | show: 100 % mag | channel: M6 | years: 2008-2010 | seasons we already have: none
- id: canaille | show: Canaille + | channel: Canal+ | years: 2003-2007 | seasons we already have: none
- id: la-folle-route | show: La Folle Route | channel: W9 | years: 2008-2010 | seasons we already have: 1 2
- id: les-forges-du-desert | show: Les Forges du désert | channel: France 2 | years: 2000-2001 | seasons we already have: none
- id: a-vous-de-juger | show: À vous de juger | channel: France 2 | years: 2005-2010 | seasons we already have: none
- id: l-apocalypse | show: L'Apocalypse | channel: Arte | years: 2008-2010 | seasons we already have: 1
- id: aventures-sur-le-net | show: Aventures sur le net | channel: TF6 | years: 2001-2001 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 37

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 37, do them one by one, in this order):
- id: game-zone | show: Game Zone | channel: ? | years: 2000-2010 | seasons we already have: none
- id: gloire-et-fortune | show: Gloire et Fortune | channel: M6 | years: 2004-2004 | seasons we already have: none
- id: presence-protestante | show: Présence protestante | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: xenius | show: Xenius | channel: Arte | years: 2009-2010 | seasons we already have: none
- id: 52-sur-la-une | show: 52 sur la Une | channel: TF1 | years: 2000-2001 | seasons we already have: none
- id: des-mots-de-minuit | show: Des mots de minuit | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: entree-d-artistes | show: Entrée d'artistes | channel: France 2 | years: 2004-2007 | seasons we already have: none
- id: euro-disney-l-ouverture | show: Euro Disney : L'Ouverture | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: le-grand-blind-test | show: Le Grand Blind test | channel: TF1 | years: 2003-2010 | seasons we already have: none
- id: morning-cafe | show: Morning Café | channel: M6 | years: 2005-2008 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 38

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 38, do them one by one, in this order):
- id: vu-du-ciel | show: Vu du ciel | channel: France 2 | years: 2006-2010 | seasons we already have: none
- id: france-2-foot | show: France 2 Foot | channel: France 2 | years: 2007-2008 | seasons we already have: none
- id: je-passe-a-la-tele | show: Je passe à la télé | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: le-quatrieme-duel | show: Le Quatrième Duel | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: ripostes | show: Ripostes | channel: France 5 | years: 2000-2009 | seasons we already have: none
- id: scooby-gang | show: Scooby-Gang | channel: France 3 | years: 2004-2008 | seasons we already have: none
- id: tac-o-tac-gagnant-a-vie | show: Tac O Tac, gagnant à vie | channel: France 3 | years: 2004-2006 | seasons we already have: none
- id: affaires-criminelles | show: Affaires criminelles | channel: NT1 | years: 2008-2010 | seasons we already have: none
- id: cellulo | show: Cellulo | channel: France 5 | years: 2000-2001 | seasons we already have: none
- id: qui-est-le-bluffeur | show: Qui est le bluffeur ? | channel: France 2 | years: 2006-2006 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 39

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 39, do them one by one, in this order):
- id: sagesses-bouddhistes | show: Sagesses bouddhistes | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: village-depart | show: Village Départ | channel: France 3 | years: 2005-2010 | seasons we already have: none
- id: cinema-de-quartier | show: Cinéma de quartier | channel: Canal+ | years: 2000-2007 | seasons we already have: none
- id: i-afrique | show: I-Afrique | channel: i>Télé | years: 2001-2010 | seasons we already have: none
- id: la-case-du-siecle | show: La Case du siècle | channel: France 5 | years: 2010-2010 | seasons we already have: none
- id: la-soiree-de-l-etrange | show: La Soirée de l'étrange | channel: TF1 | years: 2005-2010 | seasons we already have: none
- id: tout-vu-tout-lu | show: Tout vu tout lu | channel: France 2 | years: 2003-2006 | seasons we already have: none
- id: cote-maison | show: Côté maison | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: les-badaboks | show: Les Badaboks | channel: ? | years: 2000-2010 | seasons we already have: none
- id: 13-h-15-le-samedi | show: 13 h 15, le samedi | channel: France 2 | years: 2007-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 40

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 40, do them one by one, in this order):
- id: ca-tourne-bromby | show: Ça tourne Bromby | channel: France 5 | years: 2000-2000 | seasons we already have: none
- id: cauetivi | show: CaueTivi | channel: MCM | years: 2003-2008 | seasons we already have: none
- id: disney-kid-club | show: Disney Kid Club | channel: M6 | years: 2010-2010 | seasons we already have: none
- id: eurasia-a-la-conquete-de-l-orient | show: Eurasia : À la conquête de l'Orient | channel: ? | years: 2003-2003 | seasons we already have: none
- id: questions-au-gouvernement | show: Questions au gouvernement | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: vendredi-c-est-julie | show: Vendredi, c'est Julie | channel: France 2 | years: 2000-2000 | seasons we already have: none
- id: ca-vaut-le-detour | show: Ça vaut le détour | channel: TF1 | years: 2000-2005 | seasons we already have: none
- id: la-porte-ouverte-a-toutes-les-fenetres | show: La Porte ouverte à toutes les fenêtres | channel: France 4 | years: 2009-2009 | seasons we already have: none
- id: le-juste-euro | show: Le Juste Euro | channel: France 2 | years: 2001-2002 | seasons we already have: none
- id: rive-droite-rive-gauche | show: Rive droite / Rive gauche | channel: Paris Première | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 41

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 41, do them one by one, in this order):
- id: la-nuit-nous-appartient | show: La nuit nous appartient | channel: NRJ 12 | years: 2009-2010 | seasons we already have: none
- id: clair | show: + Clair | channel: Canal+ | years: 2001-2009 | seasons we already have: none
- id: carnaval | show: Carnaval | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: les-hyenes | show: Les Hyènes | channel: France 2 | years: 2004-2004 | seasons we already have: none
- id: mon-kanar | show: Mon Kanar | channel: France 3 | years: 2002-2005 | seasons we already have: none
- id: 100-minutes-pour-convaincre | show: 100 minutes pour convaincre | channel: France 2 | years: 2002-2005 | seasons we already have: none
- id: carte-postale-gourmande | show: Carte postale gourmande | channel: France 5 | years: 2000-2006 | seasons we already have: none
- id: jour-de-rugby | show: Jour de rugby | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: y-a-un-truc | show: Y'a un truc | channel: ? | years: 2000-2010 | seasons we already have: none
- id: j-y-vais-j-y-vais-pas | show: J'y vais... j'y vais pas ? | channel: France 3 | years: 2004-2004 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 42

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 42, do them one by one, in this order):
- id: le-visiophon-d-omar-et-fred | show: Le Visiophon, d'Omar et Fred | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: nous-nous-sommes-tant-aimes | show: Nous nous sommes tant aimés | channel: France 3 | years: 2010-2010 | seasons we already have: none
- id: amour-gloire-et-debats-d-idees | show: Amour, gloire et débats d'idées | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: france-europe-express | show: France Europe Express | channel: France 3 | years: 2000-2007 | seasons we already have: none
- id: 120-minutes-de-bonheur | show: 120 minutes de bonheur | channel: TF1 | years: 2000-2005 | seasons we already have: none
- id: consomag | show: ConsoMag | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: le-numero-gagnant | show: Le Numéro gagnant | channel: France 2 | years: 2001-2002 | seasons we already have: none
- id: re-7 | show: Re-7 | channel: Canal J | years: 2001-2009 | seasons we already have: none
- id: vol-de-nuit | show: Vol de nuit | channel: TF1 | years: 2000-2008 | seasons we already have: none
- id: dimanche | show: Dimanche + | channel: Canal+ | years: 2006-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 43

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 43, do them one by one, in this order):
- id: le-plus-grand-quiz-de-france | show: Le Plus Grand Quiz de France | channel: TF1 | years: 2009-2010 | seasons we already have: none
- id: sacha-show | show: Sacha Show | channel: ? | years: 2000-2010 | seasons we already have: none
- id: ca-va-s-cauet | show: Ça va s'Cauet | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: one-shot-not | show: One Shot Not | channel: Arte | years: 2007-2010 | seasons we already have: none
- id: campus | show: Campus | channel: France 2 | years: 2001-2006 | seasons we already have: none
- id: lindor-de-la-musique-guyanaise | show: Lindor de la musique guyanaise | channel: ? | years: 2000-2010 | seasons we already have: none
- id: metropolis | show: Metropolis | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: tous-a-la-une | show: Tous à la une | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: un-il-sur-la-planete | show: Un œil sur la planète | channel: France 2 | years: 2002-2010 | seasons we already have: none
- id: le-hit-w9 | show: Le Hit W9 | channel: W9 | years: 2007-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 44

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 44, do them one by one, in this order):
- id: 90-minutes | show: 90 Minutes (investigation) | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: face-a-france | show: Face à France | channel: NRJ 12 | years: 2000-2010 | seasons we already have: none
- id: la-bande-a-dexter | show: La Bande à Dexter | channel: France 3 | years: 2000-2004 | seasons we already have: none
- id: medias-le-mag | show: Médias, le mag | channel: France 5 | years: 2008-2010 | seasons we already have: none
- id: qui-sera-le-meilleur-ce-soir | show: Qui sera le meilleur ce soir ? | channel: TF1 | years: 2007-2010 | seasons we already have: none
- id: 19-00-dimanche | show: 19:00 Dimanche | channel: TF1 | years: 2000-2000 | seasons we already have: none
- id: histoire-de-comprendre | show: Histoire de comprendre | channel: France 5 | years: 2000-2001 | seasons we already have: none
- id: hors-serie | show: Hors Série | channel: France 3 | years: 2009-2010 | seasons we already have: none
- id: plies-en-4 | show: Pliés en 4 | channel: France 4 | years: 2008-2010 | seasons we already have: none
- id: le-bateau-livre | show: Le Bateau livre | channel: France 5 | years: 2004-2008 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 45

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 45, do them one by one, in this order):
- id: le-journal-du-cinema | show: Le Journal du cinéma | channel: Canal+ | years: 2000-2010 | seasons we already have: none
- id: c-est-quoi-l-amour | show: C'est quoi l'amour ? | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: esprits-libres | show: Esprits libres | channel: France 2 | years: 2006-2008 | seasons we already have: none
- id: ils-ont-filme-la-guerre-en-couleur | show: Ils ont filmé la guerre en couleur | channel: ? | years: 2000-2010 | seasons we already have: none
- id: justice-en-france | show: Justice en France (série documentaire, 1991) | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: les-p-tites-canailles | show: Les P'tites Canailles | channel: TF1 | years: 2000-2000 | seasons we already have: none
- id: manga-manga | show: Manga Manga | channel: Canal+ | years: 2000-2001 | seasons we already have: none
- id: savoir-plus-sante | show: Savoir plus santé | channel: France 2 | years: 2000-2006 | seasons we already have: none
- id: wazup | show: Wazup | channel: Gulli | years: 2010-2010 | seasons we already have: none
- id: c-est-l-ete | show: C'est l'été | channel: France 3 | years: 2000-2000 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 46

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 46, do them one by one, in this order):
- id: cafe-picouly | show: Café Picouly | channel: France 5 | years: 2005-2010 | seasons we already have: none
- id: semaine-critique | show: Semaine critique ! | channel: France 2 | years: 2010-2010 | seasons we already have: none
- id: destination-noel | show: Destination Noël | channel: ? | years: 2000-2010 | seasons we already have: none
- id: l-aventure-humaine | show: L'Aventure humaine (collection documentaire) | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: la-legende-des-sciences | show: La Légende des sciences | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: le-morning-star | show: Le Morning Star | channel: Direct Star | years: 2010-2010 | seasons we already have: none
- id: scrupules | show: Scrupules | channel: TF1 | years: 2000-2010 | seasons we already have: 9
- id: tout-le-monde-en-a-parle | show: Tout le monde en a parlé | channel: Direct 8 | years: 2010-2010 | seasons we already have: none
- id: vendredi-si-ca-me-dit | show: Vendredi, si ça me dit ! | channel: France 2 | years: 2008-2008 | seasons we already have: none
- id: animax | show: Animax | channel: France 3 | years: 2001-2005 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 47

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 47, do them one by one, in this order):
- id: disney-kid | show: Disney Kid | channel: M6 | years: 2000-2002 | seasons we already have: none
- id: drole-de-reveil | show: Drôle de réveil ! | channel: M6 | years: 2007-2009 | seasons we already have: none
- id: la-teloose | show: La Téloose | channel: Comédie ! | years: 2004-2010 | seasons we already have: none
- id: a-toi-l-actu | show: À toi l'actu@ ! | channel: France 3 | years: 2000-2002 | seasons we already have: none
- id: dede-les-doigts-de-fee | show: Dédé les doigts de fée | channel: Paris Première | years: 2007-2010 | seasons we already have: none
- id: generation-albator | show: Génération Albator | channel: France 3 | years: 2000-2000 | seasons we already have: none
- id: l-appel-gagnant | show: L'Appel gagnant | channel: RTL9 | years: 2006-2010 | seasons we already have: none
- id: l-inventeur-de-l-annee | show: L'Inventeur de l'année | channel: M6 | years: 2007-2010 | seasons we already have: none
- id: on-a-tout-revise | show: On a tout révisé | channel: France 2 | years: 2009-2010 | seasons we already have: none
- id: point-route | show: Point Route | channel: France 2 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 48

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 48, do them one by one, in this order):
- id: tres-chasse | show: Très chasse | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: 100-poker | show: 100 % poker | channel: M6 | years: 2010-2010 | seasons we already have: none
- id: pop-com | show: Pop Com | channel: Canal+ | years: 2009-2010 | seasons we already have: none
- id: pourquoi-les-manchots-n-ont-ils-pas-froid-aux-pieds | show: Pourquoi les manchots n'ont-ils pas froid aux pieds ? | channel: France 2 | years: 2007-2007 | seasons we already have: none
- id: trivial-pursuit | show: Trivial Pursuit | channel: France 2 | years: 2000-2003 | seasons we already have: none
- id: tv | show: TV+ | channel: Canal+ | years: 2000-2000 | seasons we already have: none
- id: blagadonf | show: Blagadonf | channel: France 2 | years: 2002-2007 | seasons we already have: none
- id: orthodoxie | show: Orthodoxie | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: bienvenue-dans-ma-tribu | show: Bienvenue dans ma tribu | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: contacts | show: Contacts | channel: Arte | years: 2000-2008 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 49

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 49, do them one by one, in this order):
- id: empreintes | show: Empreintes | channel: France 5 | years: 2007-2010 | seasons we already have: none
- id: harry-roselmack-en-immersion | show: Harry Roselmack en immersion | channel: TF1 | years: 2009-2010 | seasons we already have: none
- id: disney-channel-talents | show: Disney Channel Talents | channel: Disney Channel | years: 2006-2010 | seasons we already have: 5
- id: le-grand-show-des-enfants | show: Le Grand Show des enfants | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: les-ecrans-du-savoir | show: Les Écrans du savoir | channel: France 5 | years: 2000-2001 | seasons we already have: none
- id: rien-a-cacher | show: Rien à cacher | channel: RTL9 | years: 2003-2004 | seasons we already have: none
- id: encore-plus-libre | show: Encore plus libre | channel: France 2 | years: 2004-2005 | seasons we already have: none
- id: faut-que-ca-saute | show: Faut que ça saute ! | channel: Canal J | years: 2000-2010 | seasons we already have: none
- id: l-arene-de-france | show: L'Arène de France | channel: France 2 | years: 2006-2007 | seasons we already have: none
- id: c-est-toujours-l-ete | show: C'est toujours l'été | channel: France 3 | years: 2001-2001 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 50

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 50, do them one by one, in this order):
- id: qui-peut-battre | show: Qui peut battre… ? | channel: TF1 | years: 2008-2010 | seasons we already have: none
- id: club | show: Club | channel: M6 | years: 2006-2009 | seasons we already have: none
- id: cafe-litteraire | show: Café littéraire | channel: France 2 | years: 2008-2009 | seasons we already have: none
- id: le-grand-quiz-du-cerveau | show: Le Grand Quiz du cerveau | channel: TF1 | years: 2007-2010 | seasons we already have: none
- id: le-trophee-campus | show: Le Trophée Campus | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: tenue-de-soiree | show: Tenue de soirée | channel: France 2 | years: 2006-2010 | seasons we already have: none
- id: g-cine | show: G Ciné | channel: Gulli | years: 2008-2010 | seasons we already have: none
- id: l-art-et-la-maniere | show: L'Art et la Manière | channel: Arte | years: 2005-2010 | seasons we already have: none
- id: dance-floor-qui-sera-le-plus-fort | show: Dance Floor : Qui sera le plus fort ? | channel: TF1 | years: 2008-2008 | seasons we already have: none
- id: de-l-autre-cote-du-miroir | show: De l'autre côté du miroir | channel: France 2 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 51

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 51, do them one by one, in this order):
- id: duel-sur-la-3 | show: Duel sur la 3 | channel: France 3 | years: 2007-2008 | seasons we already have: none
- id: le-monde-est-scoop | show: Le monde est scoop | channel: Canal J | years: 2002-2010 | seasons we already have: none
- id: un-autre-journal | show: Un autre journal | channel: Canal+ | years: 2000-2001 | seasons we already have: none
- id: archimede | show: Archimède | channel: Arte | years: 2000-2010 | seasons we already have: none
- id: au-fil-des-mots | show: Au fil des mots | channel: TF1 | years: 2008-2010 | seasons we already have: none
- id: jouez-pour-5-fois-plus | show: Jouez pour 5 fois plus | channel: TF1 | years: 2008-2008 | seasons we already have: none
- id: pour-le-plaisir | show: Pour le plaisir | channel: France 3 | years: 2006-2006 | seasons we already have: none
- id: le-sexe-dans-tous-ses-etats | show: Le Sexe dans tous ses états | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: disney-break | show: Disney Break | channel: NRJ 12 | years: 2009-2010 | seasons we already have: none
- id: referendum-en-direct-avec-le-president | show: Référendum : en direct avec le président | channel: TF1 | years: 2005-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 52

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 52, do them one by one, in this order):
- id: tele-la-question | show: Télé la question | channel: France 3 | years: 2005-2006 | seasons we already have: none
- id: code-de-la-route | show: Code de la route | channel: TF1 | years: 2003-2008 | seasons we already have: none
- id: la-musicale | show: La Musicale | channel: Canal+ | years: 2004-2010 | seasons we already have: none
- id: la-toile-infernale | show: La Toile infernale | channel: Canal J | years: 2008-2010 | seasons we already have: none
- id: mythologies | show: Mythologies | channel: France 5 | years: 2001-2010 | seasons we already have: none
- id: vous-aurez-le-dernier-mot | show: Vous aurez le dernier mot | channel: France 2 | years: 2009-2010 | seasons we already have: none
- id: arte-reportage | show: Arte Reportage | channel: Arte | years: 2004-2010 | seasons we already have: none
- id: coupable-non-coupable | show: Coupable, non coupable | channel: M6 | years: 2009-2010 | seasons we already have: none
- id: interieurs | show: Intérieurs | channel: Paris Première | years: 2003-2010 | seasons we already have: none
- id: la-cauetidienne | show: La Cauetidienne | channel: TF1 | years: 2008-2008 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 53

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 53, do them one by one, in this order):
- id: c-est-votre-vie | show: C'est votre vie ! | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: gulli-mag | show: Gulli Mag | channel: Gulli | years: 2006-2010 | seasons we already have: none
- id: n-ayons-pas-peur-des-mots | show: N'ayons pas peur des mots | channel: i>Télé | years: 2004-2010 | seasons we already have: none
- id: pixifoly | show: Pixifoly | channel: ? | years: 2000-2010 | seasons we already have: none
- id: tout-le-monde-il-est-beau-tout-le-monde-il-est-gentil | show: Tout le monde il est beau, tout le monde il est gentil | channel: Canal+ | years: 2010-2010 | seasons we already have: none
- id: geopolis | show: Géopolis | channel: France 2 | years: 2000-2010 | seasons we already have: none
- id: la-25e-heure | show: La 25e Heure | channel: France 2 | years: 2000-2000 | seasons we already have: none
- id: le-news-show | show: Le News Show | channel: Canal+ | years: 2009-2010 | seasons we already have: none
- id: les-agites-du-bocal | show: Les Agités du bocal | channel: France 4 | years: 2007-2010 | seasons we already have: none
- id: quartier-interdit | show: Quartier interdit | channel: Canal+ | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 54

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 54, do them one by one, in this order):
- id: un-deux-trois-series | show: Un, deux, trois, séries | channel: TF1 | years: 2000-2000 | seasons we already have: none
- id: l-aventuriere | show: L'Aventurière | channel: ? | years: 2006-2007 | seasons we already have: none
- id: 60-secondes-du-colisee | show: 60 secondes du Colisée | channel: France 2 | years: 2007-2007 | seasons we already have: none
- id: anne-au-pays-d-euro-disney | show: Anne au pays d'Euro Disney | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: david-contre-goliath | show: David contre Goliath | channel: France 2 | years: 2001-2010 | seasons we already have: none
- id: oceaniques | show: Océaniques | channel: ? | years: 2000-2010 | seasons we already have: none
- id: 80-a-l-heure | show: 80 à l'heure | channel: M6 | years: 2003-2006 | seasons we already have: none
- id: a-vous-de-voir | show: À vous de voir | channel: France 5 | years: 2000-2010 | seasons we already have: none
- id: anime-ton-week-end | show: Anime ton week-end | channel: France 2 | years: 2000-2000 | seasons we already have: none
- id: enquetes-et-revelations | show: Enquêtes et Révélations | channel: TF1 | years: 2008-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 55

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 55, do them one by one, in this order):
- id: field-dans-ta-chambre | show: Field dans ta chambre | channel: Paris Première | years: 2002-2010 | seasons we already have: none
- id: la-gym-des-neurones | show: La Gym des neurones | channel: France 2 | years: 2001-2002 | seasons we already have: none
- id: trafic-musique | show: Trafic.musique | channel: France 2 | years: 2002-2010 | seasons we already have: none
- id: c-est-notre-affaire | show: C'est notre affaire | channel: France 5 | years: 2004-2010 | seasons we already have: none
- id: culture-et-dependances | show: Culture et Dépendances | channel: France 3 | years: 2001-2010 | seasons we already have: none
- id: l-alternative-live | show: L'Alternative Live | channel: M6 | years: 2006-2008 | seasons we already have: none
- id: le-fabuleux-destin-de | show: Le Fabuleux Destin de... | channel: France 3 | years: 2002-2004 | seasons we already have: none
- id: revu-et-corrige | show: Revu et corrigé | channel: France 5 | years: 2007-2010 | seasons we already have: none
- id: c-est-vous-qui-le-dites | show: C'est vous qui le dites | channel: i>Télé | years: 2006-2008 | seasons we already have: none
- id: choc-l-emission | show: Choc, l'émission | channel: NT1 | years: 2005-2007 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 56

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 56, do them one by one, in this order):
- id: good-as-you | show: Good As You | channel: ? | years: 2001-2010 | seasons we already have: none
- id: link-la-vie-en-face | show: Link, la vie en face | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: tubissimo | show: Tubissimo | channel: M6 | years: 2002-2007 | seasons we already have: none
- id: 50-ans-qui-ont-change-notre-quotidien | show: 50 ans qui ont changé notre quotidien | channel: M6 | years: 2010-2010 | seasons we already have: none
- id: acoustic | show: Acoustic (TV5 Monde) | channel: ? | years: 2002-2010 | seasons we already have: none
- id: musiques-au-c-ur | show: Musiques au cœur | channel: France 2 | years: 2000-2009 | seasons we already have: none
- id: cote-match | show: Côté match | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: direct-poker | show: Direct Poker | channel: Direct 8 | years: 2006-2010 | seasons we already have: none
- id: l-objet-du-scandale | show: L'Objet du scandale | channel: France 2 | years: 2008-2010 | seasons we already have: none
- id: le-champion-de-la-tele | show: Le Champion de la télé | channel: TF1 | years: 2003-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 57

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 57, do them one by one, in this order):
- id: double-je | show: Double je | channel: France 2 | years: 2002-2006 | seasons we already have: none
- id: droit-d-inventaire | show: Droit d'inventaire | channel: France 3 | years: 2007-2009 | seasons we already have: none
- id: foot-3 | show: Foot 3 | channel: France 3 | years: 2001-2004 | seasons we already have: none
- id: le-journal-des-jeux-video | show: Le Journal des jeux vidéo | channel: Canal+ | years: 2006-2010 | seasons we already have: none
- id: anim | show: Anim + | channel: France 2 | years: 2000-2000 | seasons we already have: none
- id: cd-aujourd-hui | show: CD'Aujourd'hui | channel: France 2 | years: 2001-2010 | seasons we already have: none
- id: enquetes-speciales | show: Enquêtes spéciales | channel: France 2 | years: 2010-2010 | seasons we already have: none
- id: jazz-6 | show: Jazz 6 | channel: M6 | years: 2000-2003 | seasons we already have: none
- id: les-mordus-de-la-video | show: Les Mordus de la vidéo | channel: ? | years: 2000-2010 | seasons we already have: none
- id: voila-la-cinq | show: Voilà La Cinq | channel: ? | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 58

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 58, do them one by one, in this order):
- id: decrochez-vos-vacances | show: Décrochez vos vacances | channel: France 3 | years: 2002-2007 | seasons we already have: none
- id: happy-hour | show: Happy Hour | channel: Canal+ | years: 2010-2010 | seasons we already have: none
- id: panorama | show: Panorama | channel: ? | years: 2000-2010 | seasons we already have: none
- id: saga-cites | show: Saga-Cités | channel: France 3 | years: 2000-2002 | seasons we already have: none
- id: aux-frontieres-de-la-chine | show: Aux frontières de la Chine | channel: ? | years: 2006-2006 | seasons we already have: none
- id: classe-confidentiel | show: Classé confidentiel | channel: M6 | years: 2004-2008 | seasons we already have: none
- id: les-enfants-de-l-an-2000 | show: Les Enfants de l'an 2000 | channel: France 5 | years: 2000-2002 | seasons we already have: none
- id: zygomusic | show: Zygomusic | channel: M6 | years: 2000-2010 | seasons we already have: none
- id: direct-chez-vous | show: Direct chez vous ! | channel: France 3 | years: 2010-2010 | seasons we already have: none
- id: cosmic-connexion | show: Cosmic Connexion | channel: Arte | years: 2006-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 59

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 59, do them one by one, in this order):
- id: graffiti | show: Graffiti (série documentaire) | channel: ? | years: 2004-2008 | seasons we already have: none
- id: kiosque-de-tv5-monde | show: Kiosque de TV5 Monde | channel: ? | years: 2000-2010 | seasons we already have: none
- id: adn-accelerateur-de-neurones | show: ADN : Accélérateur de neurones | channel: France 2 | years: 2009-2010 | seasons we already have: none
- id: en-campagne | show: En campagne | channel: France 5 | years: 2009-2010 | seasons we already have: none
- id: grandeurs-nature | show: Grandeurs nature | channel: ? | years: 2009-2010 | seasons we already have: none
- id: le-monde-des-animaux | show: Le Monde des animaux | channel: France 5 | years: 2000-2009 | seasons we already have: none
- id: pop-job | show: Pop Job | channel: Virgin 17 | years: 2009-2009 | seasons we already have: none
- id: retro-and-magic | show: Retro and Magic | channel: Nolife | years: 2007-2010 | seasons we already have: none
- id: le-tournoi-d-orthographe | show: Le Tournoi d'orthographe | channel: France 3 | years: 2009-2010 | seasons we already have: none
- id: le-grenier-de-sebastien | show: Le Grenier de Sébastien | channel: France 2 | years: 2009-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 60

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 60, do them one by one, in this order):
- id: lorsque-le-monde-parlait-arabe | show: Lorsque le monde parlait arabe | channel: ? | years: 2001-2010 | seasons we already have: none
- id: jules-et-les-filles | show: Jules et les Filles | channel: France 3 | years: 2005-2005 | seasons we already have: none
- id: repas-de-familles | show: Repas de familles | channel: France 3 | years: 2010-2010 | seasons we already have: none
- id: chez-fog | show: Chez FOG | channel: France 5 | years: 2006-2010 | seasons we already have: none
- id: premier-amour | show: Premier Amour | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: 24-h-berlin-une-journee-en-capitale | show: 24 h Berlin, une journée en capitale | channel: Arte | years: 2009-2010 | seasons we already have: none
- id: 7-a-voir | show: 7 à voir | channel: France 3 | years: 2008-2010 | seasons we already have: none
- id: kaz-manga | show: Kaz'Manga | channel: France 2 | years: 2000-2000 | seasons we already have: none
- id: la-grande-soiree-anti-arnaque | show: La Grande Soirée anti-arnaque | channel: TF1 | years: 2004-2007 | seasons we already have: none
- id: la-vie-a-l-endroit | show: La Vie à l'endroit | channel: France 2 | years: 2000-2000 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 61

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 61, do them one by one, in this order):
- id: rayons-x | show: Rayons X | channel: France 2 | years: 2002-2007 | seasons we already have: none
- id: allo-rufo | show: Allô Rufo | channel: France 5 | years: 2009-2010 | seasons we already have: none
- id: avenue-de-l-europe-le-mag | show: Avenue de l'Europe, le mag | channel: France 3 | years: 2006-2010 | seasons we already have: none
- id: haute-definition | show: Haute Définition | channel: TF1 | years: 2010-2010 | seasons we already have: none
- id: les-chroniques-de-la-terre-sauvage | show: Les Chroniques de la Terre sauvage | channel: ? | years: 2000-2010 | seasons we already have: none
- id: merci-pour-l-info | show: Merci pour l'info | channel: Canal+ | years: 2003-2004 | seasons we already have: none
- id: en-course-sur-france-3 | show: En course sur France 3 | channel: France 3 | years: 2009-2010 | seasons we already have: none
- id: japan-in-motion | show: Japan in Motion | channel: Nolife | years: 2009-2010 | seasons we already have: none
- id: mission-millenium-le-masque-de-chac | show: Mission Millenium : Le Masque de Chac | channel: France 3 | years: 2010-2010 | seasons we already have: none
- id: au-bonheur-des-enfants | show: Au bonheur des enfants | channel: TF1 | years: 2000-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 62

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 62, do them one by one, in this order):
- id: l-histoire-du-cinema-francais-par-ceux-qui-l-ont-fait | show: L'Histoire du cinéma français par ceux qui l'ont fait | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: le-rebut-global | show: Le Rebut global | channel: ? | years: 2004-2010 | seasons we already have: none
- id: contes-a-trembler-debout | show: Contes à trembler debout | channel: TF1 | years: 2000-2010 | seasons we already have: none
- id: dimanche-midi-amar | show: Dimanche Midi Amar | channel: France 2 | years: 2000-2001 | seasons we already have: none
- id: les-matins-de-dexter | show: Les Matins de Dexter | channel: ? | years: 2001-2003 | seasons we already have: none
- id: cinemas | show: Cinémas | channel: France 5 | years: 2009-2010 | seasons we already have: none
- id: des-livres-et-moi | show: Des livres et moi | channel: Paris Première | years: 2001-2010 | seasons we already have: none
- id: trabendo-sessions | show: Trabendo Sessions | channel: Virgin 17 | years: 2005-2010 | seasons we already have: none
- id: hip-hop-50 | show: Hip hop 50 | channel: Virgin 17 | years: 2006-2010 | seasons we already have: none
- id: journal-de-la-defense | show: Journal de la Défense | channel: LCP | years: 2006-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 63

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 63, do them one by one, in this order):
- id: 18-30-aujourd-hui | show: 18:30 aujourd'hui | channel: France 3 | years: 2009-2010 | seasons we already have: none
- id: d-un-monde-a-l-autre | show: D'un monde à l'autre | channel: France 2 | years: 2000-2005 | seasons we already have: none
- id: generations-famille | show: Générations famille | channel: M6 | years: 2009-2009 | seasons we already have: none
- id: aleas-le-magazine-de-l-imprevisible | show: Aléas : le magazine de l'imprévisible | channel: France 3 | years: 2000-2004 | seasons we already have: none
- id: bon-et-a-savoir | show: Bon et à savoir | channel: M6 | years: 2008-2010 | seasons we already have: none
- id: jour-j | show: Jour J | channel: M6 | years: 2005-2007 | seasons we already have: none
- id: le-doc-du-dimanche | show: Le Doc du dimanche | channel: France 5 | years: 2008-2010 | seasons we already have: none
- id: les-stars-du-rire-s-amusent | show: Les stars du rire s'amusent | channel: France 2 | years: 2009-2010 | seasons we already have: none
- id: rue-de-la-gaite | show: Rue de la gaîté | channel: ? | years: 2000-2010 | seasons we already have: none
- id: c-est-chic-c-est-cannes | show: C'est chic, c'est Cannes | channel: France 2 | years: 2009-2009 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 64

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 64, do them one by one, in this order):
- id: la-traversee-du-miroir | show: La Traversée du miroir | channel: France 5 | years: 2009-2010 | seasons we already have: none
- id: passe-simple | show: Passé simple | channel: M6 | years: 2000-2001 | seasons we already have: none
- id: reporters-2 | show: Reporters (magazine de NT1) | channel: NT1 | years: 2008-2010 | seasons we already have: none
- id: bien-dans-ma-vie | show: Bien dans ma vie | channel: M6 | years: 2008-2009 | seasons we already have: none
- id: caracteres | show: Caractères | channel: ? | years: 2000-2010 | seasons we already have: none
- id: explosif | show: Explosif | channel: RTL9 | years: 2002-2010 | seasons we already have: none
- id: j-b-a-la-recherche-de-l-amour | show: J.B. à la recherche de l'amour | channel: ? | years: 2008-2010 | seasons we already have: none
- id: la-carte | show: @ la carte | channel: France 3 | years: 2008-2009 | seasons we already have: none
- id: echappees-sauvages | show: Échappées sauvages | channel: France 3 | years: 2000-2006 | seasons we already have: none
- id: l-hebdo-du-mediateur | show: L'Hebdo du médiateur | channel: France 2 | years: 2000-2008 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 65

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 65, do them one by one, in this order):
- id: y-a-une-solution-a-tout | show: Y'a une solution à tout ! | channel: Direct 8 | years: 2009-2009 | seasons we already have: none
- id: 88-minutes | show: 88 minutes | channel: Direct 8 | years: 2005-2008 | seasons we already have: none
- id: droits-d-auteurs | show: Droits d'auteurs | channel: France 5 | years: 2000-2004 | seasons we already have: none
- id: extinctions | show: Extinctions | channel: France 5 | years: 2010-2010 | seasons we already have: none
- id: global-mag | show: Global Mag | channel: Arte | years: 2009-2010 | seasons we already have: none
- id: watts | show: Watts | channel: Eurosport | years: 2002-2010 | seasons we already have: none
- id: les-lumieres-du-music-hall | show: Les Lumières du music-hall | channel: France 5 | years: 2000-2001 | seasons we already have: none
- id: place-a-l-art-contemporain | show: Place à l'art contemporain ! | channel: ? | years: 2000-2010 | seasons we already have: none
- id: drole-de-13-heures | show: Drôle de 13 heures ! | channel: France 3 | years: 2010-2010 | seasons we already have: none
- id: lescure-tot-ou-tard | show: Lescure : tôt ou tard | channel: Paris Première | years: 2010-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 66

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 66, do them one by one, in this order):
- id: mondes-et-merveilles | show: Mondes et Merveilles | channel: France 5 | years: 2006-2007 | seasons we already have: none
- id: une-fois-par-jour | show: Une fois par jour | channel: ? | years: 2000-2010 | seasons we already have: none
- id: gaia-le-rendez-vous-du-developpement-durable | show: Gaïa, le rendez-vous du développement durable | channel: France 5 | years: 2000-2004 | seasons we already have: none
- id: cote-labo-cote-cuisine | show: Côté labo, côté cuisine | channel: France 5 | years: 2002-2010 | seasons we already have: none
- id: l-ecole-des-chefs | show: L'École des chefs | channel: France 2 | years: 2007-2010 | seasons we already have: none
- id: les-citadins-du-rebut-global | show: Les Citadins du Rebut global | channel: ? | years: 2005-2010 | seasons we already have: none
- id: chic | show: Chic | channel: Arte | years: 2005-2009 | seasons we already have: none
- id: le-sens-de-l-histoire | show: Le Sens de l'histoire | channel: France 5 | years: 2000-2001 | seasons we already have: none
- id: politiquement-parlant | show: Politiquement parlant | channel: Direct 8 | years: 2007-2010 | seasons we already have: none
- id: dieu-merci | show: Dieu merci ! | channel: Direct 8 | years: 2005-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 67

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 67, do them one by one, in this order):
- id: theatre-en-direct | show: Théâtre en direct | channel: Direct 8 | years: 2005-2010 | seasons we already have: none
- id: c-est-positif | show: C'est positif | channel: M6 | years: 2009-2009 | seasons we already have: none
- id: europole-tv | show: Europole TV | channel: France 3 | years: 2000-2010 | seasons we already have: none
- id: la-polemique | show: La Polémique | channel: i>Télé | years: 2005-2010 | seasons we already have: none
- id: lci-est-vous | show: LCI est @ vous | channel: LCI | years: 2009-2010 | seasons we already have: none
- id: les-109 | show: Les 109 | channel: France 5 | years: 2003-2004 | seasons we already have: none
- id: sud | show: Sud | channel: TMC | years: 2000-2002 | seasons we already have: none
- id: yparaikanoel | show: Yparaikanoël | channel: ? | years: 2005-2010 | seasons we already have: none
- id: 26-minutes-de-celebrite | show: 26 minutes de célébrité | channel: Canal+ | years: 2008-2010 | seasons we already have: none
- id: un-monde-de-bulles | show: Un monde de bulles | channel: ? | years: 2005-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 68

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 68, do them one by one, in this order):
- id: chacun-sa-place | show: Chacun sa place ! | channel: RTL9 | years: 2006-2006 | seasons we already have: none
- id: l-emploi-par-le-net | show: L'Emploi par le Net | channel: France 5 | years: 2002-2010 | seasons we already have: none
- id: tour-de-france-inter | show: Tour de France Inter | channel: ? | years: 2000-2010 | seasons we already have: none
- id: voir | show: Voir (magazine de télévision) | channel: ? | years: 2000-2010 | seasons we already have: none
- id: le-tournoi-des-as | show: Le Tournoi des as | channel: Paris Première | years: 2005-2010 | seasons we already have: none
- id: authentik-aventures | show: Authentik Aventures | channel: ? | years: 2008-2010 | seasons we already have: none
- id: bandes-originales | show: Bandes originales (collection de documentaires) | channel: ? | years: 2007-2010 | seasons we already have: none
- id: la-cuisine-d-a-cote | show: La Cuisine d'à côté | channel: France 3 | years: 2002-2010 | seasons we already have: none
- id: vertigo | show: Vertigo | channel: ? | years: 2009-2010 | seasons we already have: none
- id: yourope | show: Yourope | channel: Arte | years: 2010-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 69

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 10 SHOWS (batch 69, do them one by one, in this order):
- id: comic-hall-stars | show: Comic Hall Stars | channel: France 4 | years: 2008-2010 | seasons we already have: none
- id: immersion-totale | show: Immersion totale | channel: France 2 | years: 2004-2010 | seasons we already have: none
- id: otrement-dit | show: Ôtrement dit | channel: France Ô | years: 2007-2010 | seasons we already have: none
- id: virgin-17-sessions | show: Virgin 17 Sessions | channel: Virgin 17 | years: 2009-2010 | seasons we already have: none
- id: la-semaine-de-l-economie | show: La Semaine de l'économie | channel: France 5 | years: 2001-2003 | seasons we already have: none
- id: le-forum-des-europeens | show: Le Forum des Européens | channel: Arte | years: 2001-2006 | seasons we already have: none
- id: arts-du-mythe | show: Arts du mythe | channel: ? | years: 2004-2010 | seasons we already have: none
- id: postface | show: Postface | channel: i>Télé | years: 2003-2010 | seasons we already have: none
- id: ultime-razzia | show: Ultime Razzia | channel: ? | years: 2002-2010 | seasons we already have: none
- id: le-miroir | show: Le Miroir | channel: France 4 | years: 2009-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```

## Lot 70

```
TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE 1 SHOWS (batch 70, do them one by one, in this order):
- id: l-or-sauvage | show: L'Or sauvage | channel: ? | years: 2004-2010 | seasons we already have: none

STEP 1. For each show, search on YouTube, one after the other:
   "<show> saison 1 intégrale", "<show> saison 2 intégrale", ... for every season in the years given
   "<show> <year> émission" for each year in "years"
   "<show> playlist"
   Focus first on the seasons we do NOT already have.

STEP 2. Write down:
   a) PLAYLISTS that contain a whole season (most useful). The playlist ID is the text after "list=" in the URL.
   b) FULL episodes: usually longer than 20 minutes, or titled "intégrale", "prime", "quotidienne",
      "émission complète", "épisode".

STEP 3. Rules. Read them carefully.
  - Only episodes that aired between 2000 and 2010.
  - Do NOT take: short clips, reactions, interviews, trailers, best-ofs, reboots or new seasons after 2010,
    foreign versions (other countries, other languages), video games.
  - Season number: use the number in the video title. If the title only gives a year, put the year
    in "year" and leave "season" as null. Never guess a season number.
  - Episode number: the number in the title (Prime 3 = 3, Épisode 12 = 12, EM45 = 45). If none, null.
  - "format": "Prime", "Quotidienne", "Finale", or null.
  - "part": if one episode is cut into several videos (partie 1/3, part 2...), the part number. Otherwise null.
  - "airDate": the broadcast date if it is in the title, format YYYY-MM-DD. Otherwise null.
  - Maximum 40 episodes per season. For daily shows, prefer the first episodes, the last ones and the finale.
  - Copy the video title exactly. Copy the YouTube ID exactly: the 11 characters after "watch?v=".
  - Never invent an ID. Only include videos you actually saw on YouTube.
  - If you find nothing for a show, give it an empty list [].

STEP 4. When all the shows are done, answer with ONE JSON code block and nothing else, in this exact format:

{
  "star-academy": [
    { "playlistId": "PLxxxxxxxxxxxxxxxx", "season": 3, "title": "Star Academy saison 3 - tous les primes" },
    { "youtubeId": "AbCdEfGhIjK", "title": "Star Academy 3 - Prime 1 - 30 août 2003", "kind": "episode", "season": 3, "episode": 1, "format": "Prime", "part": null, "airDate": "2003-08-30", "year": 2003, "channelName": "Archives Télé", "source": "chrome" }
  ],
  "some-show-with-nothing": []
}

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".
```
