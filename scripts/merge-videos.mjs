// Fusionne les fichiers data/videos/*.json dans data/shows.json.
// Format d'un fichier : { "<id émission>": [ { youtubeId, title, kind, year, channelName, source }, ... ] }
// Les vidéos relues à la main (source différente de "auto") passent devant les choix automatiques,
// et une entrée { "youtubeId": "...", "remove": true } retire une vidéo.
//
// Usage : node scripts/merge-videos.mjs

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { enrich, episodeKey, foreignScript, KINDS, maxSeason } from './lib/video-meta.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

const data = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
const byId = new Map(data.shows.map((s) => [s.id, s]));

// auto.json d'abord, puis les lots relus (ordre alphabétique) qui ont le dernier mot.
const files = (await readdir(ROOT + 'data/videos')).filter((f) => f.endsWith('.json') && !f.startsWith('music-'))
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
      if (!ID_RE.test(v.youtubeId || '') || foreignScript(v.title)) continue;
      if (v.remove) {
        gone.add(v.youtubeId);
        continue;
      }
      const int = (x) => (Number.isInteger(x) ? x : null);
      const clean = enrich({
        youtubeId: v.youtubeId,
        title: String(v.title || '').slice(0, 200),
        kind: KINDS.includes(v.kind) ? v.kind : undefined,
        season: int(v.season) ?? undefined,
        episode: int(v.episode) ?? undefined,
        part: int(v.part) ?? undefined,
        format: v.format || undefined,
        airDate: /^\d{4}-\d{2}-\d{2}$/.test(v.airDate || '') ? v.airDate : undefined,
        year: int(v.year) ?? undefined,
        seconds: int(v.seconds) || 0,
        channelName: v.channelName || '',
        source: v.source || f.replace(/\.json$/, ''),
      }, byId.get(showId));
      if (clean.season > maxSeason(byId.get(showId))) continue;
      // Contenu daté d'après 2011 (nouvelles saisons, réactions à une version récente) : hors sujet.
      if (clean.source === 'auto' && +(clean.title.match(/\b(20[1-3]\d)\b/)?.[1] || 0) > 2011) continue;
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
  // Doublons d'un même épisode : la version relue à la main l'emporte, sinon la première trouvée.
  const keys = new Set();
  s.videos = [...reviewed, ...list.filter((v) => v.source === 'auto')].filter((v) => {
    const k = episodeKey(v);
    if (!k) return true;
    if (keys.has(k)) return false;
    keys.add(k);
    return true;
  });
  if (s.videos.length) withVideos++;
  total += s.videos.length;
}

await writeFile(ROOT + 'data/shows.json', JSON.stringify(data, null, 1));
console.log(`${total} vidéos sur ${withVideos} émissions (${data.shows.length} au total).`);
if (unknown.length) console.warn(`Ids inconnus ignorés :\n  ${unknown.join('\n  ')}`);
