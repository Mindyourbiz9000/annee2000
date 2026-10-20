// Pré-remplit des replays YouTube pour chaque émission à partir de la recherche YouTube.
// Résultat : data/videos/auto.json, à fusionner avec scripts/merge-videos.mjs.
// Les choix automatiques sont marqués source: "auto" pour être relus (par ex. avec Claude in Chrome).
//
// Usage : node scripts/youtube-search.mjs [--limit 100] [--only id1,id2]

import { mkdir, readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url).pathname;
const OUT = ROOT + 'data/videos/auto.json';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const MAX_PER_SHOW = 6;
const INTERVAL_MS = 1500;

const args = process.argv.slice(2);
const limit = +(args[args.indexOf('--limit') + 1] || 0) || Infinity;
const only = args.includes('--only') ? new Set(args[args.indexOf('--only') + 1].split(',')) : null;

const fold = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const STOP = new Set(['le', 'la', 'les', 'l', 'un', 'une', 'des', 'de', 'du', 'd', 'et', 'a', 'en', 'au', 'aux', 'pour', 'sur', 'the', 'est', 'pas', 'qui', 'que']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseDuration(text = '') {
  return text.split(':').reduce((acc, n) => acc * 60 + (+n || 0), 0);
}

function collectVideos(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (node.videoRenderer) {
    const v = node.videoRenderer;
    out.push({
      youtubeId: v.videoId,
      title: v.title?.runs?.map((r) => r.text).join('') || '',
      channelName: v.ownerText?.runs?.[0]?.text || '',
      seconds: parseDuration(v.lengthText?.simpleText),
      views: +(v.viewCountText?.simpleText || '').replace(/\D/g, '') || 0,
    });
    return out;
  }
  for (const k in node) collectVideos(node[k], out);
  return out;
}

async function search(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=fr&gl=FR`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9' },
    });
    if (res.ok) {
      const html = await res.text();
      const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
      if (!m) return [];
      return collectVideos(JSON.parse(m[1]));
    }
    await sleep(5000 * 2 ** attempt);
  }
  return [];
}

// Une vidéo correspond si son titre contient les mots importants du nom de l'émission.
function matches(show, video) {
  const vt = ` ${fold(video.title)} `;
  const words = fold(show.title).split(' ').filter((w) => w && !STOP.has(w));
  if (!words.length || !words.every((w) => vt.includes(` ${w} `))) return false;
  // Titre court ou générique : on exige aussi la chaîne ou une année de la décennie.
  if (words.length === 1 && words[0].length < 9) {
    const ch = show.channels.map(fold);
    if (!ch.some((c) => vt.includes(` ${c} `)) && !/ (200\d|2010) /.test(vt) && !/ (emission|integrale|generique) /.test(vt)) return false;
  }
  return true;
}

function kindOf(v) {
  const t = fold(v.title);
  if (/generique/.test(t)) return 'générique';
  if (/best of|zapping|compilation|meilleurs moments/.test(t)) return 'best-of';
  if (v.seconds >= 20 * 60 || /integrale|episode complet|emission complete/.test(t)) return 'episode';
  return 'extrait';
}

function yearOf(v) {
  const m = v.title.match(/\b(19[89]\d|200\d|201[0-5])\b/);
  return m ? +m[1] : null;
}

async function main() {
  const { shows } = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8'));
  const extras = JSON.parse(await readFile(ROOT + 'data/extras.json', 'utf8'));
  let done = {};
  try {
    done = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {}

  const queue = shows
    .filter((s) => (only ? only.has(s.id) : !(s.id in done)))
    .sort((a, b) => (extras[b.id]?.culte ? 1 : 0) - (extras[a.id]?.culte ? 1 : 0) || b.score - a.score)
    .slice(0, limit);

  await mkdir(ROOT + 'data/videos', { recursive: true });
  let n = 0;
  for (const s of queue) {
    const query = `${s.title} ${s.channels[0] || ''} ${s.category === 'téléréalité' || s.category === 'jeu' ? '' : 'émission'}`.trim();
    // On écarte les vidéos datées d'après la décennie (émissions encore à l'antenne aujourd'hui).
    const found = (await search(query)).filter((v) => matches(s, v) && !(yearOf(v) > 2011));
    const seen = new Set();
    const order = { episode: 0, 'best-of': 1, extrait: 2, 'générique': 3 };
    done[s.id] = found
      .filter((v) => !seen.has(v.youtubeId) && seen.add(v.youtubeId))
      .map((v) => ({ youtubeId: v.youtubeId, title: v.title, kind: kindOf(v), year: yearOf(v), channelName: v.channelName, source: 'auto', _views: v.views }))
      .sort((a, b) => order[a.kind] - order[b.kind] || b._views - a._views)
      .slice(0, MAX_PER_SHOW)
      .map(({ _views, ...v }) => v);
    n++;
    process.stderr.write(`[${n}/${queue.length}] ${s.title}: ${done[s.id].length} vidéo(s)\n`);
    if (n % 10 === 0) await writeFile(OUT, JSON.stringify(done, null, 1));
    await sleep(INTERVAL_MS);
  }
  await writeFile(OUT, JSON.stringify(done, null, 1));
  const total = Object.values(done).filter((v) => v.length).length;
  console.log(`${total} émissions avec au moins une vidéo dans ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
