// Écrit docs/chrome-prompts.md : un prompt prêt à coller dans Claude in Chrome pour chaque lot de 10 émissions,
// avec la liste des émissions écrite dedans (Claude in Chrome n'a besoin que de YouTube).
// Les lots déjà traités (fichiers data/videos/chrome-lot-N.json) sont sautés.
//
// Usage : node scripts/make-chrome-prompts.mjs

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { maxSeason } from './lib/video-meta.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const extras = JSON.parse(await readFile(ROOT + 'data/extras.json', 'utf8'));
const done = new Set();
for (const f of await readdir(ROOT + 'data/videos')) {
  if (!/^chrome-lot-\d+\.json$/.test(f)) continue;
  Object.keys(JSON.parse(await readFile(ROOT + 'data/videos/' + f, 'utf8'))).forEach((id) => done.add(id));
}

const queue = shows
  .filter((s) => !done.has(s.id))
  .sort((a, b) => (extras[b.id]?.culte ? 1 : 0) - (extras[a.id]?.culte ? 1 : 0) || b.score - a.score);

const line = (s) => {
  const from = Math.max(s.yearStart || 2000, 2000);
  const to = Math.min(s.yearEnd ?? 2010, 2010);
  const seasons = [...new Set(s.videos.filter((v) => v.kind === 'episode' && v.season != null).map((v) => v.season))].sort((a, b) => a - b);
  return `- id: ${s.id} | show: ${s.title} | channel: ${s.channels[0] || '?'} | years: ${from}-${to} | seasons we already have: ${seasons.join(' ') || 'none'}`;
};

const prompt = (n, list) => `TASK: Find full episodes of French TV shows on YouTube, sorted by season and episode number.
Use ONLY YouTube. Do not open any other website. Work slowly and carefully. Follow the steps in order.

THE ${list.length} SHOWS (batch ${n}, do them one by one, in this order):
${list.map(line).join('\n')}

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

The keys are the "id" values above, exactly as written. Every video must have "kind": "episode" and "source": "chrome".`;

const batches = [];
for (let i = 0; i < queue.length; i += 10) batches.push(queue.slice(i, i + 10));
const first = Math.max(1, ...[...(await readdir(ROOT + 'data/videos'))].map((f) => +(f.match(/^chrome-lot-(\d+)\.json$/)?.[1] || 0))) + 1;
const out = [`# Prompts Claude in Chrome : ${queue.length} émissions, ${batches.length} lots\n`,
  'Un lot à la fois : copier tout le bloc du lot dans Claude in Chrome, puis coller sa réponse JSON à Claude Code.\n'];
batches.forEach((b, i) => out.push(`\n## Lot ${first + i}\n\n\`\`\`\n${prompt(first + i, b)}\n\`\`\`\n`));
await writeFile(ROOT + 'docs/chrome-prompts.md', out.join(''));

// La même liste, publiée sur le site (chrome/emissions.html) pour le prompt unique.
const txt = [`ANNEES 2000 - LISTE DES EMISSIONS A TRAITER (${queue.length} émissions, lots ${first} à ${first + batches.length - 1})`, ''];
batches.forEach((b, i) => txt.push(`=== LOT ${first + i} ===`, ...b.map(line), ''));
await mkdir(ROOT + 'chrome', { recursive: true });
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
await writeFile(ROOT + 'chrome/emissions.html', `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Liste des émissions</title></head><body><pre>${esc(txt.join('\n'))}</pre></body></html>\n`);
console.log(`${batches.length} lots (${first} à ${first + batches.length - 1}) écrits dans docs/chrome-prompts.md`);
