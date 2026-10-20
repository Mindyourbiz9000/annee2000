// Fusionne les fichiers data/videos/*.json dans data/shows.json.
// Format d'un fichier : { "<id émission>": [ { youtubeId, title, kind, year, channelName, source }, ... ] }
// Les vidéos relues à la main (source différente de "auto") passent devant les choix automatiques,
// et une entrée { "youtubeId": "...", "remove": true } retire une vidéo.
//
// Usage : node scripts/merge-videos.mjs

import { readdir, readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url).pathname;
const ID_RE = /^[A-Za-z0-9_-]{11}$/;
const KINDS = new Set(['episode', 'extrait', 'générique', 'best-of']);

const data = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const byId = new Map(data.shows.map((s) => [s.id, s]));

// auto.json d'abord, puis les lots relus (ordre alphabétique) qui ont le dernier mot.
const files = (await readdir(ROOT + 'data/videos')).filter((f) => f.endsWith('.json'))
  .sort((a, b) => (a === 'auto.json' ? -1 : b === 'auto.json' ? 1 : a.localeCompare(b)));

const merged = new Map();
const removed = new Map();
const unknown = [];
for (const f of files) {
  const batch = JSON.parse(await readFile(ROOT + 'data/videos/' + f, 'utf8'));
  for (const [showId, videos] of Object.entries(batch)) {
    if (!byId.has(showId)) {
      unknown.push(`${f}: ${showId}`);
      continue;
    }
    const list = merged.get(showId) || [];
    const gone = removed.get(showId) || new Set();
    for (const v of videos) {
      if (!ID_RE.test(v.youtubeId || '')) continue;
      if (v.remove) {
        gone.add(v.youtubeId);
        continue;
      }
      const clean = {
        youtubeId: v.youtubeId,
        title: String(v.title || '').slice(0, 200),
        kind: KINDS.has(v.kind) ? v.kind : 'extrait',
        year: Number.isInteger(v.year) ? v.year : null,
        channelName: v.channelName || '',
        source: v.source || f.replace(/\.json$/, ''),
      };
      const i = list.findIndex((x) => x.youtubeId === v.youtubeId);
      if (i >= 0) list[i] = { ...list[i], ...clean };
      else if (clean.source === 'auto') list.push(clean);
      else list.unshift(clean);
    }
    merged.set(showId, list);
    removed.set(showId, gone);
  }
}

let withVideos = 0;
let total = 0;
for (const s of data.shows) {
  const gone = removed.get(s.id) || new Set();
  const list = (merged.get(s.id) || []).filter((v) => !gone.has(v.youtubeId));
  const reviewed = list.filter((v) => v.source !== 'auto');
  s.videos = [...reviewed, ...list.filter((v) => v.source === 'auto')];
  if (s.videos.length) withVideos++;
  total += s.videos.length;
}

await writeFile(ROOT + 'data/shows.json', JSON.stringify(data, null, 1));
console.log(`${total} vidéos sur ${withVideos} émissions (${data.shows.length} au total).`);
if (unknown.length) console.warn(`Ids inconnus ignorés :\n  ${unknown.join('\n  ')}`);
