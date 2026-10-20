// Génère data/episode-todo.csv : pour chaque émission, ce qui a déjà été trouvé
// (saisons, nombre d'épisodes) et ce qui manque, pour la recherche des épisodes avec Claude in Chrome.
// Émissions cultes d'abord, puis par popularité. Lots de 10.
//
// Usage : node scripts/make-episode-todo.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { maxSeason } from './lib/video-meta.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const SITE = 'https://d22mgjxgcxd3e3.cloudfront.net';
const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const extras = JSON.parse(await readFile(ROOT + 'data/extras.json', 'utf8'));

const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = [...shows]
  .sort((a, b) => (extras[b.id]?.culte ? 1 : 0) - (extras[a.id]?.culte ? 1 : 0) || b.score - a.score)
  .map((s, i) => {
    const eps = (s.videos || []).filter((v) => v.kind === 'episode');
    const seasons = [...new Set(eps.map((v) => v.season).filter((n) => n != null))].sort((a, b) => a - b);
    const from = Math.max(s.yearStart || 2000, 2000);
    const to = Math.min(s.yearEnd ?? 2010, 2010);
    return [
      Math.floor(i / 10) + 1,
      s.id,
      s.title,
      s.channels.join(' / '),
      `${from}-${to}`,
      s.yearStart && s.yearStart < 2000 ? `saisons d'avant 2000 possibles (lancée en ${s.yearStart})` : '',
      maxSeason(s),
      seasons.join(' '),
      eps.length,
      (s.videos || []).length - eps.length,
      `${SITE}/#/e/${s.id}`,
    ].map(csv).join(',');
  });

const header = ['lot', 'id', 'titre', 'chaines', 'periode_2000_2010', 'note', 'saisons_max', 'saisons_trouvees', 'episodes_trouves', 'bonus_trouves', 'page_du_site'].join(',');
await writeFile(ROOT + 'data/episode-todo.csv', [header, ...rows].join('\n') + '\n');
console.log(`${rows.length} émissions dans data/episode-todo.csv (${Math.ceil(rows.length / 10)} lots de 10).`);
