// Vérifie chaque vidéo de data/shows.json via l'oEmbed YouTube (existe et intégrable).
// Les vidéos mortes sont écrites dans data/videos/zz-dead.json sous forme { remove: true },
// ce qui les retire au prochain merge.
//
// Usage : node scripts/check-videos.mjs

import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url).pathname;
const CONCURRENCY = 6;

const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const jobs = shows.flatMap((s) => (s.videos || []).map((v) => ({ show: s.id, id: v.youtubeId })));

async function alive(id) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}`;
      const res = await fetch(url);
      if (res.ok) return true;
      // 400/401/403/404 : supprimée, privée ou intégration désactivée.
      if ([400, 401, 403, 404].includes(res.status)) return false;
    } catch {}
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
  return true; // Erreur réseau persistante : on ne conclut pas.
}

const dead = {};
let i = 0;
let checked = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < jobs.length) {
    const job = jobs[i++];
    if (!(await alive(job.id))) (dead[job.show] ||= []).push({ youtubeId: job.id, remove: true });
    if (++checked % 100 === 0) process.stderr.write(`${checked}/${jobs.length}\n`);
  }
}));

const n = Object.values(dead).flat().length;
let previous = {};
try {
  previous = JSON.parse(await readFile(ROOT + 'data/videos/zz-dead.json', 'utf8'));
} catch {}
for (const [show, list] of Object.entries(dead)) {
  const ids = new Set((previous[show] || []).map((v) => v.youtubeId));
  previous[show] = [...(previous[show] || []), ...list.filter((v) => !ids.has(v.youtubeId))];
}
await writeFile(ROOT + 'data/videos/zz-dead.json', JSON.stringify(previous, null, 1));
console.log(`${jobs.length} vidéos vérifiées, ${n} indisponibles (ajoutées à data/videos/zz-dead.json).`);
if (n) console.log('Relancez node scripts/merge-videos.mjs pour les retirer du site.');
