// Génère data/video-todo.csv : la liste de travail pour relire et compléter les replays
// avec Claude in Chrome (voir docs/chrome-video-prompt.md). Les émissions cultes et
// celles sans vidéo passent en premier.
//
// Usage : node scripts/make-todo.mjs

import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url).pathname;
const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const extras = JSON.parse(await readFile(ROOT + 'data/extras.json', 'utf8'));

const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = [...shows]
  .sort((a, b) => (extras[b.id]?.culte ? 1 : 0) - (extras[a.id]?.culte ? 1 : 0) || (a.videos.length ? 1 : 0) - (b.videos.length ? 1 : 0) || b.score - a.score)
  .map((s, i) => [
    Math.floor(i / 25) + 1,
    s.id,
    s.title,
    s.channels.join(' / '),
    s.yearStart ?? '',
    s.yearEnd ?? '',
    extras[s.id]?.culte ? 'oui' : '',
    s.videos.length,
    s.videos.filter((v) => v.source !== 'auto').length,
    `https://www.youtube.com/results?search_query=${encodeURIComponent(`${s.title} ${s.channels[0] || ''} intégrale`)}`,
  ].map(csv).join(','));

const header = ['lot', 'id', 'titre', 'chaines', 'debut', 'fin', 'culte', 'videos', 'videos_relues', 'recherche_youtube'].join(',');
await writeFile(ROOT + 'data/video-todo.csv', [header, ...rows].join('\n') + '\n');
console.log(`${rows.length} lignes écrites dans data/video-todo.csv (${Math.ceil(rows.length / 25)} lots de 25).`);
