// Cherche le générique de chaque émission sur YouTube (« <émission> générique »), pour le blind test télé.
// Résultat : data/videos/generiques.json, fusionné avec les autres lots par scripts/merge-videos.mjs.
//
// Usage : node scripts/generique-search.mjs [--redo]

import { readFile, writeFile } from 'node:fs/promises';
import { fold, foreignScript } from './lib/video-meta.mjs';
import { search } from './lib/youtube.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const OUT = ROOT + 'data/videos/generiques.json';
const redo = process.argv.includes('--redo');

const norm = (s = '') => fold(s).replace(/[^a-z0-9]+/g, ' ').trim();
const STOP = new Set(['le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd', 'et', 'a', 'en', 'au', 'aux', 'the']);
// Un vrai générique, pas une compilation, une réaction, une parodie ou une bande-annonce.
export const GENERIQUE_RE = /g[ée]n[ée]rique|jingle|\bintro\b|opening/i;
export const NOT_GENERIQUE_RE = /react|r[ée]action|[ée]volution|tous les g[ée]n[ée]riques|compil|parodie|remix|bande[- ]annonce|teaser|\bpubs?\b|\d+\s*(?:à|a)\s*\d+/i;

function matches(show, v) {
  if (foreignScript(v.title) || !GENERIQUE_RE.test(v.title) || NOT_GENERIQUE_RE.test(v.title)) return false;
  const vt = ` ${norm(v.title)} `;
  const words = norm(show.title.replace(/\(.*?\)/g, '')).split(' ').filter((w) => w && !STOP.has(w));
  return words.length > 0 && words.every((w) => vt.includes(` ${w} `)) && (!v.seconds || v.seconds <= 6 * 60);
}

const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
let done = {};
try { done = JSON.parse(await readFile(OUT, 'utf8')); } catch {}
const queue = shows.filter((s) => redo || !(s.id in done)).sort((a, b) => b.score - a.score);
let n = 0;
for (const s of queue) {
  const found = (await search(`${s.title.replace(/\(.*?\)/g, '')} générique`, 1)).filter((v) => matches(s, v));
  found.sort((a, b) => b.views - a.views);
  done[s.id] = found.slice(0, 2).map((v) => ({ youtubeId: v.youtubeId, title: v.title, kind: 'générique', channelName: v.channelName, seconds: v.seconds, source: 'auto' }));
  n++;
  process.stderr.write(`[${n}/${queue.length}] ${s.title}: ${done[s.id].length} générique(s)\n`);
  if (n % 10 === 0) await writeFile(OUT, JSON.stringify(done, null, 1));
}
await writeFile(OUT, JSON.stringify(done, null, 1));
console.log(`${Object.values(done).filter((v) => v.length).length} émissions avec un générique.`);
