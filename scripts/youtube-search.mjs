// Cherche sur YouTube les épisodes et les bonus de chaque émission.
// Plusieurs recherches par émission (nom, « intégrale », « épisode », « saison N », « réaction »)
// et plusieurs pages de résultats, pour retrouver le plus d'épisodes possible.
// Résultat : data/videos/auto.json (source: "auto"), à fusionner avec scripts/merge-videos.mjs.
//
// Usage : node scripts/youtube-search.mjs [--limit 100] [--only id1,id2] [--redo]
//   --redo  refait aussi les émissions déjà cherchées (sinon on reprend là où on s'était arrêté)

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { classify, enrich, episodeKey, fold, foreignScript, maxSeason } from './lib/video-meta.mjs';
import { search } from './lib/youtube.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const OUT = ROOT + 'data/videos/auto.json';
const STATE = ROOT + 'data/videos/.search-state.json';
const MAX_EPISODES = 150;
const MAX_BONUS = 30;

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const limit = +(opt('--limit') || 0) || Infinity;
const only = opt('--only') ? new Set(opt('--only').split(',')) : null;
const redo = args.includes('--redo');

const norm = (s = '') => fold(s).replace(/[^a-z0-9]+/g, ' ').trim();
const STOP = new Set(['le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd', 'et', 'a', 'en', 'au', 'aux', 'pour', 'sur', 'the', 'est', 'pas', 'qui', 'que']);
// Le titre de la vidéo doit contenir les mots importants du nom de l'émission.
function matches(show, video) {
  const vt = ` ${norm(video.title)} `;
  const words = norm(show.title).split(' ').filter((w) => w && !STOP.has(w));
  if (!words.length || !words.every((w) => vt.includes(` ${w} `))) return false;
  if (foreignScript(video.title)) return false;
  // Titre court ou générique : on exige aussi la chaîne, une année ou un mot comme « émission ».
  if (words.length === 1 && words[0].length < 9) {
    const ch = show.channels.map(norm);
    if (!ch.some((c) => vt.includes(` ${c} `)) && !/ (19[89]\d|20[01]\d) /.test(vt) && !/ (emission|integrale|generique|prime|saison|episode) /.test(vt)) return false;
  }
  // On écarte ce qui est daté hors de la vie de l'émission dans la décennie (reprises récentes, archives antérieures).
  const year = video.title.match(/\b(19[5-9]\d|20[0-3]\d)\b/);
  if (year) {
    const y = +year[1];
    if (y > 2011) return false;
    if (show.yearStart && y < show.yearStart - 1) return false;
  }
  return true;
}

function queriesFor(show, culte) {
  const ch = show.channels[0] || '';
  const big = culte || show.fame === 1;
  const q = [
    { q: `${show.title} ${ch}`, pages: big ? 2 : 1 },
    { q: `${show.title} intégrale`, pages: big ? 3 : 2 },
    { q: `${show.title} réaction`, pages: 1 },
  ];
  if (big) q.push({ q: `${show.title} épisode`, pages: 2 });
  // Pour les émissions à saisons, une recherche par saison (on s'arrête dès que ça ne donne plus rien).
  if (['téléréalité', 'jeu', 'divertissement'].includes(show.category)) {
    const seasons = Math.min(culte ? 12 : big ? 8 : 4, maxSeason(show));
    for (let n = 1; n <= seasons; n++) q.push({ q: `${show.title} saison ${n}`, pages: culte ? 2 : 1, season: n });
  }
  return q;
}

async function main() {
  const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
  const extras = JSON.parse(await readFile(ROOT + 'data/extras.json', 'utf8'));
  let done = {};
  let state = {};
  try { done = JSON.parse(await readFile(OUT, 'utf8')); } catch {}
  try { state = JSON.parse(await readFile(STATE, 'utf8')); } catch {}

  const queue = shows
    .filter((s) => (only ? only.has(s.id) : redo || !state[s.id]))
    .sort((a, b) => (extras[b.id]?.culte ? 1 : 0) - (extras[a.id]?.culte ? 1 : 0) || b.score - a.score)
    .slice(0, limit);

  await mkdir(ROOT + 'data/videos', { recursive: true });
  let n = 0;
  for (const s of queue) {
    const culte = !!extras[s.id]?.culte;
    const found = new Map();
    let emptySeasons = 0;
    for (const { q, pages, season } of queriesFor(s, culte)) {
      const before = found.size;
      for (const v of await search(q, pages)) {
        if (found.has(v.youtubeId) || !matches(s, v)) continue;
        found.set(v.youtubeId, v);
      }
      // Deux saisons de suite sans rien de nouveau : on arrête de chercher les saisons suivantes.
      if (season) {
        emptySeasons = found.size === before ? emptySeasons + 1 : 0;
        if (emptySeasons >= 2) break;
      }
    }

    const videos = [...found.values()].map((v) => enrich({
      youtubeId: v.youtubeId, title: v.title, channelName: v.channelName, seconds: v.seconds, source: 'auto', _views: v.views,
    }, s)).filter((v) => !(v.season > maxSeason(s)));
    // Un même épisode mis en ligne plusieurs fois : on garde la version la plus vue.
    videos.sort((a, b) => b._views - a._views);
    const keys = new Set();
    const unique = videos.filter((v) => {
      const k = episodeKey(v);
      if (!k) return true;
      if (keys.has(k)) return false;
      keys.add(k);
      return true;
    });
    videos.length = 0;
    videos.push(...unique);
    const episodes = videos.filter((v) => v.kind === 'episode').sort((a, b) => b._views - a._views).slice(0, MAX_EPISODES);
    const bonus = videos.filter((v) => v.kind !== 'episode').sort((a, b) => b._views - a._views).slice(0, MAX_BONUS);
    done[s.id] = [...episodes, ...bonus].map(({ _views, ...v }) => v);
    state[s.id] = new Date().toISOString().slice(0, 10);

    n++;
    process.stderr.write(`[${n}/${queue.length}] ${s.title}: ${episodes.length} épisode(s), ${bonus.length} bonus\n`);
    if (n % 3 === 0) {
      await writeFile(OUT, JSON.stringify(done, null, 1));
      await writeFile(STATE, JSON.stringify(state));
    }
  }
  await writeFile(OUT, JSON.stringify(done, null, 1));
  await writeFile(STATE, JSON.stringify(state));
  const total = Object.values(done).filter((v) => v.length).length;
  console.log(`${total} émissions avec au moins une vidéo dans ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
