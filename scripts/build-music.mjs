// Construit data/hits.json : les plus gros tubes en France de 2000 à 2010.
// Sources : les pages Wikipédia « Liste des titres musicaux numéro un en France en AAAA »
// (numéros un de la semaine + dix meilleures ventes de l'année), complétées par Wikidata (genre).
//
// Usage : node scripts/build-music.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { api } from './lib/wiki.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const YEARS = Array.from({ length: 11 }, (_, i) => 2000 + i);

const fold = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slugify = (s) => fold(s).replace(/&/g, ' et ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

// Texte lisible d'une cellule de tableau wiki.
function cellText(raw) {
  let s = raw.replace(/^\|/, '');
  // Attributs de cellule : rowspan="3" style="..." | contenu
  const m = s.match(/^\s*(?:(?:rowspan|colspan|style|align|class|bgcolor|width)\s*=\s*(?:"[^"]*"|[^\s|]+)\s*)+\|(.*)$/);
  if (m) s = m[1];
  return s
    .replace(/<ref[^>]*\/>|<ref[^>]*>.*?<\/ref>/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\{\{(?:lang|langue)\|[^|}]*\|([^}]*)\}\}/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
const firstLink = (raw) => raw.match(/\[\[([^|\]#]+)/)?.[1]?.trim() || null;
const rowspan = (raw) => +(raw.match(/rowspan\s*=\s*"?(\d+)/)?.[1] || 1);

// Repère les couples (cellule artiste, cellule titre en italique) dans un bout de tableau.
function pairs(text) {
  const lines = text.split('\n').map((l) => l.trim());
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const cur = lines[i];
    const prev = lines[i - 1];
    if (!cur.startsWith('|') || cur.startsWith('|-') || cur.startsWith('|}') || !cur.includes("''")) continue;
    if (!prev.startsWith('|') || prev.startsWith('|-') || prev.includes("''") || /\{\{(date|1er)/.test(prev) || /^\|\s*\d+\s*$/.test(prev)) continue;
    const artist = cellText(prev);
    const title = cellText(cur).replace(/^«\s*|\s*»$/g, '');
    if (!artist || !title || /^\d+$/.test(artist)) continue;
    out.push({ artist, title, songPage: firstLink(cur), artistPage: firstLink(prev), weeks: rowspan(cur) });
  }
  return out;
}

function sections(wikitext) {
  const parts = wikitext.split(/\n(?==+[^=])/);
  return parts.map((p) => ({ heading: (p.match(/^=+\s*(.*?)\s*=+/) || [])[1] || '', body: p }));
}

async function main() {
  const hits = new Map();
  for (const year of YEARS) {
    const page = `Liste des titres musicaux numéro un en France en ${year}`;
    const d = await api({ action: 'parse', page, prop: 'wikitext', redirects: '1' });
    const wt = d.parse?.wikitext || '';
    const secs = sections(wt);
    const singles = secs.filter((s) => /singles/i.test(s.heading) && !/album/i.test(s.heading));
    const weekly = singles.find((s) => /classement/i.test(s.heading)) || singles[0];
    // « Les dix meilleures ventes » puis sa sous-section « Singles ».
    const topIdx = secs.findIndex((s) => /meilleures ventes|classement annuel|top annuel/i.test(s.heading));
    const top = secs.slice(topIdx).find((s, i) => i > 0 && /singles/i.test(s.heading)) || (topIdx >= 0 ? secs[topIdx] : null);

    const add = (p, extra) => {
      const id = slugify(`${p.artist}-${p.title}`).slice(0, 80);
      const key = fold(`${p.title}`).replace(/[^a-z0-9]/g, '') + '|' + fold(p.artist).replace(/[^a-z0-9]/g, '').slice(0, 12);
      const h = hits.get(key) || { id, title: p.title, artist: p.artist, songPage: p.songPage, artistPage: p.artistPage, years: new Set(), weeksAtOne: 0, yearRank: null, firstNumberOne: null };
      h.songPage ||= p.songPage;
      h.artistPage ||= p.artistPage;
      h.years.add(year);
      if (extra.weekly) {
        h.weeksAtOne += p.weeks;
        h.firstNumberOne ??= year;
      }
      if (extra.rank && (!h.yearRank || extra.rank < h.yearRank.rank)) h.yearRank = { year, rank: extra.rank };
      hits.set(key, h);
    };
    const w = weekly ? pairs(weekly.body) : [];
    w.forEach((p) => add(p, { weekly: true }));
    const t = top && top !== weekly ? pairs(top.body).slice(0, 10) : [];
    t.forEach((p, i) => add(p, { rank: i + 1 }));
    process.stderr.write(`${year}: ${w.length} cellules numéro un, ${t.length} meilleures ventes\n`);
  }

  // Détails des chansons : résumé, vues, Wikidata (genre, date de sortie).
  const list = [...hits.values()];
  const pagesNeeded = [...new Set(list.map((h) => h.songPage).filter(Boolean))];
  const info = new Map();
  for (const group of chunk(pagesNeeded, 20)) {
    const d = await api({
      action: 'query', titles: group.join('|'), redirects: '1',
      prop: 'extracts|pageprops|pageviews|info|categories', exintro: '1', explaintext: '1', exsentences: '3', exlimit: 'max',
      ppprop: 'wikibase_item|disambiguation', pvipdays: '60', inprop: 'url', cllimit: 'max', clshow: '!hidden',
    });
    const redirects = new Map((d.query?.redirects || []).map((r) => [r.from, r.to]));
    const normalized = new Map((d.query?.normalized || []).map((r) => [r.from, r.to]));
    for (const p of d.query?.pages || []) info.set(p.title, p);
    for (const t of group) {
      const n = normalized.get(t) || t;
      const r = redirects.get(n) || n;
      if (info.has(r)) info.set(t, info.get(r));
    }
  }
  const qids = [...new Set([...info.values()].map((p) => p.pageprops?.wikibase_item).filter(Boolean))];
  const wd = new Map();
  const genreIds = new Set();
  for (const group of chunk(qids, 50)) {
    const d = await api({ __host: 'wikidata', action: 'wbgetentities', ids: group.join('|'), props: 'claims' });
    for (const [id, e] of Object.entries(d.entities || {})) {
      const genres = (e.claims?.P136 || []).map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
      // Date de sortie seulement si elle est connue au jour près (précision 11 dans Wikidata).
      const dv = e.claims?.P577?.[0]?.mainsnak?.datavalue?.value;
      const date = dv?.precision >= 11 ? dv.time : null;
      genres.forEach((g) => genreIds.add(g));
      wd.set(id, { genres, released: date ? date.slice(1, 11).replace(/-00/g, '-01') : null });
    }
  }
  const genreLabels = new Map();
  for (const group of chunk([...genreIds], 50)) {
    const d = await api({ __host: 'wikidata', action: 'wbgetentities', ids: group.join('|'), props: 'labels', languages: 'fr|en' });
    for (const [id, e] of Object.entries(d.entities || {})) genreLabels.set(id, e.labels?.fr?.value || e.labels?.en?.value || '');
  }

  const out = list.map((h) => {
    const p = h.songPage ? info.get(h.songPage) : null;
    const w = wd.get(p?.pageprops?.wikibase_item) || {};
    const genreNames = (w.genres || []).map((g) => genreLabels.get(g)).filter(Boolean);
    const cats = (p?.categories || []).map((c) => c.title).join(' | ');
    const views = Object.values(p?.pageviews || {}).reduce((a, b) => a + (b || 0), 0);
    const year = Math.min(...h.years);
    return {
      id: h.id,
      title: h.title,
      artist: h.artist,
      year,
      released: w.released && +w.released.slice(0, 4) >= year - 1 ? w.released : null,
      weeksAtOne: h.weeksAtOne,
      numberOne: h.weeksAtOne > 0,
      yearRank: h.yearRank,
      genre: bucket(genreNames, cats, h),
      genres: genreNames.slice(0, 4),
      description: (p?.extract || '').replace(/\s+/g, ' ').trim(),
      wikipedia: p && !p.missing ? p.fullurl : null,
      views60d: views,
      videos: [],
    };
  });
  for (const h of out) h.score = Math.round(h.weeksAtOne * 30 + (h.yearRank ? (11 - h.yearRank.rank) * 25 : 0) + Math.log10(1 + h.views60d) * 40);

  // Ids uniques, et on garde les vidéos d'une exécution précédente.
  const seen = new Set();
  for (const h of out) {
    let id = h.id;
    for (let n = 2; seen.has(id); n++) id = `${h.id}-${n}`;
    h.id = id;
    seen.add(id);
  }
  try {
    const prev = new Map(JSON.parse(await readFile(ROOT + 'data/hits.json', 'utf8')).hits.map((h) => [h.id, h]));
    for (const h of out) if (prev.get(h.id)?.videos?.length) h.videos = prev.get(h.id).videos;
  } catch {}

  out.sort((a, b) => a.year - b.year || b.score - a.score);
  await writeFile(ROOT + 'data/hits.json', JSON.stringify({ generated: new Date().toISOString().slice(0, 10), source: 'Wikipédia FR (CC BY-SA 4.0) et Wikidata', count: out.length, hits: out }, null, 1));
  console.log(`${out.length} tubes écrits dans data/hits.json`);
}

// Grandes familles de genre pour les filtres du site (genres Wikidata d'abord, catégories ensuite).
function bucket(genres, cats, h) {
  if (/star academy|popstars|nouvelle star|tele-crochet|telecrochet|lofteurs/.test(fold(h.artist + ' ' + cats))) return 'télé-crochet';
  for (const text of [fold(genres.join(' | ')), fold(cats.replace(/Catégorie:(Single|Chanson) (numéro un|classé|certifié)[^|]*/g, ''))]) {
    if (/latin|reggaeton|salsa|bachata|merengue|cumbia|zumba|kuduro|zouk/.test(text)) return 'latino';
    if (/\brap\b|hip-hop|hip hop|r&b|rnb|rhythm and blues|\bsoul\b|ragga|dancehall|reggae|grime/.test(text)) return 'rap-rnb';
    if (/house|techno|electro|dance|eurodance|trance|disco|electronique|hi-nrg/.test(text)) return 'dance';
    if (/rock|metal|punk|grunge|indie/.test(text)) return 'rock';
    if (/chanson francaise|variete|chanson/.test(text) && text === fold(genres.join(' | '))) return 'variété';
    if (/\bpop\b/.test(text)) return /francais|france/.test(fold(cats)) ? 'variété' : 'pop';
  }
  return /francais|france/.test(fold(cats)) ? 'variété' : 'pop';
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
