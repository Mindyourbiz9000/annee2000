// Construit data/shows.json : toutes les émissions et séries françaises
// diffusées entre 2000 et 2009, à partir des catégories de Wikipédia FR.
//
// Usage : node scripts/build-catalog.mjs
// Les réponses de l'API sont mises en cache dans data/cache/ (non versionné).

import { readFile, writeFile } from 'node:fs/promises';
import { api, categoryMembers } from './lib/wiki.mjs';

const DECADE_START = 2000;
const DECADE_END = 2010;
const ROOT = new URL('../', import.meta.url).pathname;

// Chaînes françaises (nom de catégorie Wikipédia -> nom affiché).
const CHANNELS = {
  'TF1': 'TF1', 'France 2': 'France 2', 'France 3': 'France 3', 'Canal+': 'Canal+', 'M6': 'M6',
  'Arte': 'Arte', 'France 5': 'France 5', 'La Cinquième': 'France 5', 'France 4': 'France 4',
  'W9': 'W9', 'NRJ 12': 'NRJ 12', 'TMC': 'TMC', 'Direct 8': 'Direct 8', 'C8': 'Direct 8',
  'Gulli': 'Gulli', 'Paris Première': 'Paris Première', 'Canal J': 'Canal J', 'I-Télé': 'i>Télé',
  'Virgin 17': 'Virgin 17', 'France Ô': 'France Ô', 'RTL9': 'RTL9', 'Comédie !': 'Comédie !',
  'TF6': 'TF6', 'LCI': 'LCI', 'LCP': 'LCP', 'BFM TV': 'BFM TV', 'Disney Channel (France)': 'Disney Channel',
  'MCM': 'MCM', 'Téva': 'Téva', 'NT1': 'NT1', 'TFX': 'NT1', 'CStar': 'Direct Star', '6ter': '6ter',
  'Nolife': 'Nolife', 'Eurosport': 'Eurosport', 'France 3 Régions': 'France 3',
};
// Chaînes nommées autrement après 2009 : on garde le nom de l'époque.
const PRIORITY = ['TF1', 'France 2', 'France 3', 'Canal+', 'M6', 'France 5', 'Arte', 'France 4', 'W9',
  'NRJ 12', 'TMC', 'Direct 8', 'NT1', 'Gulli', 'Paris Première', 'Canal J', 'i>Télé', 'Virgin 17'];

const SOURCE_CATEGORIES = [
  'Catégorie:Émission de télévision produite en France',
  'Catégorie:Émission de télévision d\'information en France',
  'Catégorie:Émission de télévision destinée à la jeunesse en France',
  'Catégorie:Émission de télévision française sur la criminalité',
  'Catégorie:Émission de télévision sportive en France',
  'Catégorie:Wikipédia:ébauche émission de télévision française',
  'Catégorie:Série télévisée française des années 2000',
  'Catégorie:Mini-série française des années 2000',
  ...Object.keys(CHANNELS).flatMap((c) => [
    `Catégorie:Émission diffusée sur ${c}`,
    `Catégorie:Jeu télévisé diffusé sur ${c}`,
    `Catégorie:Série télévisée de ${c}`,
  ]),
];

const deaccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slugify = (s) => deaccent(s).replace(/\(.*?\)/g, '').replace(/&/g, ' et ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// Les pages de saison, de participants, etc. ne sont pas des émissions à part entière.
const EXCLUDE_TITLE = /(saison|\bliste\b|^Liste|candidats|participants|épisodes|\(\d{4}\)$|Prix |Festival|personnages)/i;

async function collectCandidates() {
  const pages = new Map();
  for (const cat of SOURCE_CATEGORIES) {
    let members;
    try {
      members = await categoryMembers(cat, 'page');
    } catch (e) {
      continue;
    }
    for (const m of members) if (m.ns === 0 && !EXCLUDE_TITLE.test(m.title)) pages.set(m.title, m.pageid);
    process.stderr.write(`${cat}: ${members.length}\n`);
  }
  return pages;
}

function parseCategories(cats) {
  const titles = cats.map((c) => c.title.replace(/^Catégorie:/, ''));
  const years = { start: null, end: null };
  const channels = new Set();
  let french = false;
  let foreign = false;
  for (const t of titles) {
    let m;
    if ((m = t.match(/(?:créée?|créé) en (\d{4})/))) years.start = Math.min(years.start ?? 9999, +m[1]);
    if ((m = t.match(/disparue? en (\d{4})/))) years.end = Math.max(years.end ?? 0, +m[1]);
    if ((m = t.match(/^(?:Émission diffusée sur|Jeu télévisé diffusé sur|Série télévisée de) (.+)$/))) {
      const name = m[1].replace(/^(la |l')/, '');
      if (CHANNELS[name]) channels.add(CHANNELS[name]);
    }
    if (/française|en France|produite en France/.test(t)) french = true;
    if (/produite (aux|au|en) (?!France)|américaine?s?\b|britannique|canadienne?|québécoise?|japonaise?|australienne?|allemande?/i.test(t)) foreign = true;
  }
  const explicitlyFrench = titles.some((t) => /produite en France|française/.test(t));
  const decadeHit = titles.some((t) => /française des années 2000/.test(t) || /^200\d à la télévision en France$/.test(t));
  return { titles, years, channels: [...channels], french: (french || channels.size > 0) && (!foreign || explicitlyFrench), decadeHit };
}

// Classement manuel des émissions-franchises dont les catégories ne disent rien.
const OVERRIDES = {
  'Star Academy': 'téléréalité', 'Loft Story (M6)': 'téléréalité', 'La Ferme Célébrités': 'téléréalité',
  'Popstars': 'téléréalité', 'Nouvelle Star': 'téléréalité', 'Secret Story': 'téléréalité',
  'Vis ma vie': 'téléréalité', 'X Factor': 'téléréalité', 'La France a un incroyable talent': 'divertissement',
};

function classify(titles, title, extract = '') {
  if (OVERRIDES[title]) return OVERRIDES[title];
  const t = titles.join(' | ').toLowerCase();
  const first = extract.split(/\.\s/)[0].toLowerCase();
  if (/documentaire/.test(t) && /série télévisée/.test(t)) return 'magazine';
  if (/télé-?réalité/.test(t) || /télé-?réalité/.test(first)) return 'téléréalité';
  if (/série télévisée|feuilleton|shortcom|sitcom|mini-série|série d'animation|téléfilm/.test(t) || /\b(série|feuilleton) (télévisée|d'animation)/.test(first)) {
    if (/animation/.test(t)) return 'animation';
    return 'série';
  }
  if (/téléréalité/.test(t)) return 'téléréalité';
  if (/jeu télévisé|jeux télévisés/.test(t)) return 'jeu';
  if (/jeunesse/.test(t)) return 'jeunesse';
  if (/humour|humoristique|satiri|sketch/.test(t)) return 'humour';
  if (/musical|musique|hit-parade|variétés/.test(t)) return 'musique';
  if (/sport/.test(t)) return 'sport';
  if (/talk-show|talk show|débat/.test(t)) return 'talk-show';
  if (/information|journal télévisé|documentaire|magazine|reportage|criminalité|politique|culturelle|investigation/.test(t)) return 'magazine';
  if (/divertissement|variété/.test(t)) return 'divertissement';
  if (/^jt |journal/i.test(title)) return 'magazine';
  return 'divertissement';
}

async function fetchDetails(titles) {
  const out = new Map();
  for (const group of chunk(titles, 20)) {
    let cont = {};
    const acc = new Map();
    do {
      const d = await api({
        action: 'query', titles: group.join('|'), redirects: '1',
        prop: 'categories|extracts|pageprops|pageviews|info',
        cllimit: 'max', clshow: '!hidden', exintro: '1', explaintext: '1', exsentences: '3', exlimit: 'max',
        ppprop: 'wikibase_item|disambiguation', pvipdays: '60', inprop: 'url', ...cont,
      });
      for (const p of d.query?.pages || []) {
        const prev = acc.get(p.title) || { categories: [] };
        acc.set(p.title, {
          ...prev, ...p,
          categories: [...prev.categories, ...(p.categories || [])],
          extract: p.extract ?? prev.extract,
          pageviews: p.pageviews ?? prev.pageviews,
        });
      }
      cont = d.continue || null;
    } while (cont);
    for (const [k, v] of acc) out.set(k, v);
    process.stderr.write(`détails: ${out.size}/${titles.length}\r`);
  }
  process.stderr.write('\n');
  return out;
}

async function fetchWikidata(qids) {
  const out = new Map();
  const labelsNeeded = new Set();
  for (const group of chunk(qids, 50)) {
    const d = await wikidata({ action: 'wbgetentities', ids: group.join('|'), props: 'claims|sitelinks' });
    for (const [id, e] of Object.entries(d.entities || {})) {
      const claimIds = (p) => (e.claims?.[p] || []).map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
      const claimYear = (p) => {
        const v = e.claims?.[p]?.[0]?.mainsnak?.datavalue?.value?.time;
        return v ? +v.slice(1, 5) : null;
      };
      const rec = {
        presenters: claimIds('P371'),
        broadcasters: claimIds('P449'),
        start: claimYear('P580'),
        end: claimYear('P582'),
        sitelinks: Object.keys(e.sitelinks || {}).filter((k) => k.endsWith('wiki')).length,
      };
      rec.presenters.forEach((q) => labelsNeeded.add(q));
      out.set(id, rec);
    }
  }
  const labels = new Map();
  for (const group of chunk([...labelsNeeded], 50)) {
    const d = await wikidata({ action: 'wbgetentities', ids: group.join('|'), props: 'labels', languages: 'fr|en' });
    for (const [id, e] of Object.entries(d.entities || {})) labels.set(id, e.labels?.fr?.value || e.labels?.en?.value);
  }
  for (const rec of out.values()) rec.presenters = rec.presenters.map((q) => labels.get(q)).filter(Boolean);
  return out;
}

// Même client que Wikipédia mais pointé vers Wikidata.
async function wikidata(params) {
  return api({ ...params, __host: 'wikidata' });
}

function cleanExtract(s = '') {
  return s.replace(/\s*\([^()]*\)\s*/g, (m) => (m.length > 80 ? ' ' : m)).replace(/\s+/g, ' ').trim();
}

async function main() {
  const candidates = await collectCandidates();
  process.stderr.write(`candidats: ${candidates.size}\n`);
  const details = await fetchDetails([...candidates.keys()]);

  const shows = [];
  const seen = new Set();
  for (const p of details.values()) {
    if (p.missing || p.pageprops?.disambiguation !== undefined) continue;
    if (seen.has(p.title)) continue;
    seen.add(p.title);
    const info = parseCategories(p.categories || []);
    if (!info.french) continue;
    shows.push({ page: p, info });
  }

  const qids = shows.map((s) => s.page.pageprops?.wikibase_item).filter(Boolean);
  const wd = await fetchWikidata(qids);

  const result = [];
  for (const { page, info } of shows) {
    const w = wd.get(page.pageprops?.wikibase_item) || {};
    const start = info.years.start ?? w.start;
    const end = info.years.end ?? w.end;
    const overlaps = start != null
      ? start <= DECADE_END && (end == null || end >= DECADE_START)
      : info.decadeHit;
    if (!overlaps) continue;
    if (start != null && start < 1940) continue;
    const category = classify(info.titles, page.title, page.extract);
    // Le site couvre les émissions (téléréalité, jeux, talk-shows...), pas la fiction.
    if (category === 'série' || category === 'animation') continue;

    const views = Object.values(page.pageviews || {}).reduce((a, b) => a + (b || 0), 0);
    result.push({
      id: slugify(page.title),
      title: page.title.replace(/ \((émission de télévision|émission|jeu télévisé|série télévisée|téléréalité|France|TF1|M6|France 2|France 3|Canal\+)[^)]*\)$/i, ''),
      wikiTitle: page.title,
      category,
      channels: info.channels.sort((a, b) => (PRIORITY.indexOf(a) + 99) % 99 - (PRIORITY.indexOf(b) + 99) % 99),
      yearStart: start ?? null,
      yearEnd: end ?? null,
      hosts: (w.presenters || []).slice(0, 6),
      description: cleanExtract(page.extract),
      wikipedia: page.fullurl,
      views60d: views,
      sitelinks: w.sitelinks ?? 0,
      videos: [],
    });
  }

  // Popularité : vues récentes + présence dans d'autres langues.
  for (const s of result) s.score = Math.round(Math.log10(1 + s.views60d) * 100 + s.sitelinks * 8);
  const sorted = [...result].sort((a, b) => b.score - a.score);
  sorted.forEach((s, i) => (s.fame = i < 150 ? 1 : i < 500 ? 2 : 3));

  // Identifiants uniques.
  const ids = new Map();
  for (const s of sorted) {
    let id = s.id || 'emission';
    let n = 2;
    while (ids.has(id)) id = `${s.id}-${n++}`;
    s.id = id;
    ids.set(id, true);
  }

  // On conserve les vidéos et les textes rédigés à la main d'une exécution précédente.
  let previous = [];
  try {
    previous = JSON.parse(await readFile(ROOT + 'data/shows.json', 'utf8')).shows;
  } catch {}
  const prevByWiki = new Map(previous.map((s) => [s.wikiTitle, s]));
  for (const s of sorted) {
    const prev = prevByWiki.get(s.wikiTitle);
    if (!prev) continue;
    s.id = prev.id;
    for (const k of ['videos', 'anecdote', 'catchphrase', 'playlistId']) if (prev[k]?.length || prev[k]) s[k] = prev[k];
  }

  sorted.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  await writeFile(
    ROOT + 'data/shows.json',
    JSON.stringify({ generated: new Date().toISOString().slice(0, 10), source: 'Wikipédia FR (CC BY-SA 4.0) et Wikidata', count: sorted.length, shows: sorted }, null, 1),
  );
  console.log(`${sorted.length} émissions écrites dans data/shows.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
