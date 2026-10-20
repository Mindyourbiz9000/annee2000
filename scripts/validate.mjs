// Contrôle de cohérence de data/shows.json (utilisé aussi par le déploiement).
import { readFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url).pathname;
const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const extras = JSON.parse(await readFile(ROOT + 'data/extras.json', 'utf8'));
const errors = [];
const ids = new Set();

for (const s of shows) {
  if (!s.id || ids.has(s.id)) errors.push(`id manquant ou en double : ${s.id}`);
  ids.add(s.id);
  if (!s.title) errors.push(`${s.id} : titre manquant`);
  if (!/^https:\/\/fr\.wikipedia\.org\//.test(s.wikipedia || '')) errors.push(`${s.id} : lien Wikipédia invalide`);
  if (s.yearStart && (s.yearStart > 2010 || (s.yearEnd && s.yearEnd < 2000))) errors.push(`${s.id} : hors de la période 2000-2010`);
  for (const v of s.videos || []) if (!/^[A-Za-z0-9_-]{11}$/.test(v.youtubeId)) errors.push(`${s.id} : youtubeId invalide ${v.youtubeId}`);
}
for (const id of Object.keys(extras)) if (!id.startsWith('_') && !ids.has(id)) errors.push(`extras.json : id inconnu ${id}`);

try {
  const { hits } = JSON.parse(await readFile(ROOT + 'data/hits.json', 'utf8'));
  const hitIds = new Set();
  for (const h of hits) {
    if (!h.id || hitIds.has(h.id)) errors.push(`tube : id manquant ou en double ${h.id}`);
    hitIds.add(h.id);
    if (!h.title || !h.artist) errors.push(`${h.id} : titre ou artiste manquant`);
    if (h.year < 2000 || h.year > 2010) errors.push(`${h.id} : année hors période`);
    for (const v of h.videos || []) if (!/^[A-Za-z0-9_-]{11}$/.test(v.youtubeId)) errors.push(`${h.id} : youtubeId invalide`);
  }
} catch (e) {
  errors.push(`data/hits.json illisible : ${e.message}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK : ${shows.length} émissions, ${shows.reduce((n, s) => n + (s.videos?.length || 0), 0)} vidéos.`);
