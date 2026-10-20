// Cherche sur YouTube les vidéos de chaque tube de data/hits.json :
// clip officiel, lives télé (Hit Machine, Star Academy, Taratata…), remix et versions,
// et les bonus (réactions, interviews, paroles, reprises).
// Les résultats sont écrits dans data/hits.json (et gardés dans data/videos/music-auto.json).
//
// Usage : node scripts/music-search.mjs [--only id1,id2] [--redo] [--merge-only]
//   --merge-only  recopie seulement les vidéos déjà trouvées dans data/hits.json

import { readFile, writeFile } from 'node:fs/promises';
import { fold, foreignScript } from './lib/video-meta.mjs';
import { search } from './lib/youtube.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const FULL_CACHE = ROOT + 'data/videos/music-auto.json';
const CLIPS_CACHE = ROOT + 'data/videos/music-clips.json';
const MAX = { clip: 3, live: 12, version: 6, react: 6, coulisses: 6, paroles: 3, reprise: 6 };

const args = process.argv.slice(2);
const only = args.includes('--only') ? new Set(args[args.indexOf('--only') + 1].split(',')) : null;
const redo = args.includes('--redo');
// --clips-only : passe rapide, une seule recherche par tube pour trouver le clip (pour le blind test).
// Elle tourne à côté de la passe complète, avec son propre fichier, et ne traite que les tubes sans vidéo.
const clipsOnly = args.includes('--clips-only');
const CACHE = clipsOnly ? CLIPS_CACHE : FULL_CACHE;
const readJson = async (f) => { try { return JSON.parse(await readFile(f, 'utf8')); } catch { return {}; } };

const norm = (s = '') => fold(s).replace(/[^a-z0-9]+/g, ' ').trim();
const STOP = new Set(['le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd', 'et', 'a', 'en', 'au', 'the', 'feat', 'featuring', 'ft', 'and', 'of', 'me', 'my', 'je', 'tu', 'il', 'on', 'it']);
const words = (s) => norm(s.replace(/\(.*?\)/g, '')).split(' ').filter((w) => w && !STOP.has(w));
// Artiste principal : avant « featuring », « & », « et », « / ».
const mainArtist = (a) => a.split(/\s+(?:featuring|feat\.?|ft\.?|et|&|avec|vs\.?|x)\s+|\s*[/,]\s*/i)[0];

function matches(hit, v) {
  if (foreignScript(v.title)) return false;
  const vt = ` ${norm(v.title)} `;
  const ch = ` ${norm(v.channelName)} `;
  const tw = words(hit.title);
  if (!tw.length || !tw.every((w) => vt.includes(` ${w} `))) return false;
  const aw = words(mainArtist(hit.artist));
  const artistIn = (s) => aw.length && aw.every((w) => s.includes(` ${w} `));
  // Titre court (« Seul », « Fan », « SOS ») : l'artiste doit apparaître dans le titre ou la chaîne.
  return artistIn(vt) || artistIn(ch) || (tw.join(' ').length >= 14 && aw.some((w) => vt.includes(` ${w} `)));
}

function kindOf(hit, v) {
  const t = fold(v.title);
  const ch = fold(v.channelName);
  if (/\b(reacts?|reactions?|reagi[rst]?|je decouvre|first time hearing|analyse|critique|review|vocal coach|discovers|deconstructing|breakdown)\b/.test(t) || /reaction/.test(ch)) return 'react';
  if (/(interview|itw|making of|making-of|coulisses|histoire de la chanson|l'histoire de|documentaire|behind the scenes|que devient|se confie|raconte)/.test(t)) return 'coulisses';
  if (/(paroles|lyrics|lyric video|karaoke|karaoké|letra)/.test(t)) return 'paroles';
  if (/(cover|reprise|repris par|tribute|parodie|version piano|guitar|guitare|acoustic cover)/.test(t) && !norm(v.channelName).includes(norm(mainArtist(hit.artist)))) return 'reprise';
  if (/(remix|radio edit|extended|version longue|club mix|mashup|instrumental|acoustique|acoustic)/.test(t)) return 'version';
  if (/(live|en direct|concert|hit machine|star academy|taratata|victoires|nrj music awards|\bnma\b|top of the pops|fete de la musique|stade|zenith|olympia|bercy|plateau|tv |\btf1\b|\bm6\b|france 2|france 3|canal\+|w9|ce soir|tous ensemble|c a vous|quotidien|\brtl\b|grand studio|mask singer|the voice|disney channel|nrj12|la fureur|graines de star|fan de|cd'aujourd'hui|20h|playback)/.test(t)) return 'live';
  if (/(clip officiel|official video|official music video|videoclip|video officielle|vidéo officielle|clip video|official hd video|\bclip\b)/.test(t) || /vevo$/.test(ch.replace(/\s/g, ''))) return 'clip';
  if (/(official audio|audio officiel|\baudio\b)/.test(t)) return 'version';
  return 'clip-maybe';
}

async function main() {
  const data = JSON.parse(await readFile(ROOT + 'data/hits.json', 'utf8'));
  const cache = await readJson(CACHE);
  const full = clipsOnly ? await readJson(FULL_CACHE) : cache;
  const queue = args.includes('--merge-only') ? [] : data.hits
    .filter((h) => (only ? only.has(h.id) : redo || (!cache[h.id] && !full[h.id]?.length)))
    .sort((a, b) => b.score - a.score);

  let n = 0;
  for (const h of queue) {
    const a = mainArtist(h.artist);
    const queries = clipsOnly ? [{ q: `${a} ${h.title} clip officiel`, pages: 1 }] : [
      { q: `${a} ${h.title} clip officiel`, pages: 1 },
      { q: `${a} ${h.title} live ${h.year}`, pages: 2 },
      { q: `${a} ${h.title} réaction`, pages: 1 },
      { q: `${a} ${h.title} interview`, pages: 1 },
    ];
    const found = new Map();
    for (const { q, pages } of queries) {
      for (const v of await search(q, pages)) if (!found.has(v.youtubeId) && matches(h, v)) found.set(v.youtubeId, v);
    }
    const vids = [...found.values()].map((v) => ({ ...v, kind: kindOf(h, v) }));
    // Le clip officiel : la vidéo « clip » la plus vue ; sinon la plus vue des vidéos de l'artiste sans autre type.
    vids.sort((x, y) => y.views - x.views);
    const maybe = vids.filter((v) => v.kind === 'clip-maybe');
    if (!vids.some((v) => v.kind === 'clip') && maybe[0]) maybe[0].kind = 'clip';
    for (const v of vids) if (v.kind === 'clip-maybe') v.kind = v.seconds > 7 * 60 ? 'live' : 'version';
    const out = [];
    for (const kind of Object.keys(MAX)) {
      out.push(...vids.filter((v) => v.kind === kind).slice(0, MAX[kind]).map((v) => ({
        youtubeId: v.youtubeId, title: v.title, kind, channelName: v.channelName, seconds: v.seconds,
        year: +(v.title.match(/\b(19[89]\d|20[0-3]\d)\b/)?.[1] || 0) || null, source: 'auto',
      })));
    }
    cache[h.id] = out;
    n++;
    process.stderr.write(`[${n}/${queue.length}] ${h.artist} - ${h.title}: ${out.length} vidéo(s)\n`);
    if (n % 5 === 0) await writeFile(CACHE, JSON.stringify(cache, null, 1));
  }
  await writeFile(CACHE, JSON.stringify(cache, null, 1));

  // On relit hits.json : le catalogue a pu être reconstruit pendant la recherche.
  const fresh = JSON.parse(await readFile(ROOT + 'data/hits.json', 'utf8'));
  // La passe complète l'emporte sur la passe rapide (clip seul).
  const [fullNow, clipsNow] = [await readJson(FULL_CACHE), await readJson(CLIPS_CACHE)];
  for (const h of fresh.hits) h.videos = (fullNow[h.id]?.length ? fullNow[h.id] : clipsNow[h.id]) || h.videos || [];
  data.hits = fresh.hits;
  await writeFile(ROOT + 'data/hits.json', JSON.stringify(fresh, null, 1));
  console.log(`${data.hits.filter((h) => h.videos.length).length}/${data.hits.length} tubes avec vidéos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
