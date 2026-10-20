// Lit dans le titre d'une vidéo YouTube : saison, numéro d'épisode, partie, date de diffusion,
// et range la vidéo soit dans les épisodes, soit dans un dossier « bonus ».

const MONTHS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

export const fold = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Types de vidéo. "episode" va dans la liste des épisodes, tout le reste dans le dossier bonus.
export const KINDS = ['episode', 'react', 'coulisses', 'extrait', 'best-of', 'générique'];

const num = (s) => (s == null ? null : parseInt(s, 10));

export function parseAirDate(title) {
  const t = fold(title);
  let m = t.match(/\b(\d{1,2})(?:er)?\s+(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\s+((?:19|20)\d{2})\b/);
  if (m) return iso(+m[3], MONTHS.indexOf(m[2]) + 1, +m[1]);
  m = t.match(/\b(\d{1,2})[./-](\d{1,2})[./-]((?:19|20)\d{2})\b/);
  if (m && +m[2] <= 12 && +m[1] <= 31) return iso(+m[3], +m[2], +m[1]);
  m = t.match(/\b((?:19|20)\d{2})[./-](\d{1,2})[./-](\d{1,2})\b/);
  if (m && +m[2] <= 12 && +m[3] <= 31) return iso(+m[1], +m[2], +m[3]);
  return null;
}
function iso(y, mo, d) {
  if (!mo || !d) return null;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function parseNumbers(title) {
  const t = ` ${fold(title).replace(/[|·•:–—_()[\]]/g, ' ')} `;
  let season = null;
  let episode = null;
  let format = null; // prime, quotidienne, finale…
  let part = null;
  let m;

  if ((m = t.match(/\bs(?:aison)?\s?0*(\d{1,2})\s?e(?:p(?:isode)?)?\s?0*(\d{1,4})\b/))) {
    season = num(m[1]);
    episode = num(m[2]);
  }
  if (season == null && (m = t.match(/\b(?:saison|season|serie)\s*n?\s*0*(\d{1,2})\b/))) season = num(m[1]);
  if (season == null && (m = t.match(/\bs\s?0*(\d{1,2})\b(?!\s?(?:ans|h\b|min))/))) season = num(m[1]);
  if (season == null && (m = t.match(/\b(\d{1,2})(?:e|eme|ere|er)\s+saison\b/))) season = num(m[1]);

  if ((m = t.match(/\bprimes?\s*(?:n\s*)?0*(\d{1,3})\b/))) {
    format = 'Prime';
    episode ??= num(m[1]);
  } else if ((m = t.match(/\bquotidiennes?\s*(?:n\s*)?0*(\d{1,3})\b/))) {
    format = 'Quotidienne';
    episode ??= num(m[1]);
  } else if (/\b(grande )?finale\b/.test(t)) {
    format = 'Finale';
  }
  if (episode == null && (m = t.match(/\b(?:episode|ep|em|emission|epi)\.?\s*(?:n\s*)?0*(\d{1,4})\b/))) episode = num(m[1]);
  if (episode == null && (m = t.match(/(?:#|\bn\s?°?\s?|\bno\s)0*(\d{1,4})\b/))) episode = num(m[1]);
  if ((m = t.match(/\b(?:partie|part|pt|p)\.?\s*0*(\d{1,2})\b/)) || (m = t.match(/\b(\d)\s*\/\s*\d\b/))) part = num(m[1]);

  return { season, episode, format, part };
}

export function classify(title, seconds = 0) {
  const t = fold(title);
  if (/\b(react|reaction|reagi[rst]?|reagissons|je regarde|on regarde|je juge|on juge|avis sur|analyse|critique|debrief|podcast)\b/.test(t)) return 'react';
  if (/(documentaire|l'histoire de|l histoire de|que sont[- ]ils devenus|que sont[- ]elles devenues|enquete sur|retour sur|coulisses|making of|behind the scenes|backstage|interview|\bitw\b|temoign|se confie|raconte|souvenirs?|anniversaire|ans apres|revelations?|secrets? de tournage|casting)/.test(t)) return 'coulisses';
  if (/(generique|jingle|bande[- ]annonce|teaser|\bbumper\b|habillage|indicatif|\bpub\b|publicite)/.test(t)) return 'générique';
  if (/(best of|best-of|zapping|compilation|meilleurs moments|top \d+|betisier|moments cultes|florilege)/.test(t)) return 'best-of';
  if (seconds >= 20 * 60) return 'episode';
  if (/(integrale|episode complet|emission complete|en entier|\bcomplet\b|\bcomplete\b)/.test(t)) return 'episode';
  if (/\bemission du\b/.test(t) && (seconds >= 8 * 60 || !seconds)) return 'episode';
  const n = parseNumbers(title);
  if ((n.episode != null || n.format) && seconds >= 8 * 60) return 'episode';
  if (!seconds && (n.episode != null || /\bprime\b|\bquotidienne\b/.test(t))) return 'episode';
  return 'extrait';
}

// « Star Academy 4 », « Loft Story 2 » : le nombre collé au nom de l'émission est la saison.
export function seasonAfterTitle(title, showTitle) {
  if (!showTitle) return null;
  const words = fold(showTitle).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length || /\d$/.test(words[words.length - 1])) return null;
  const t = ` ${fold(title).replace(/[^a-z0-9/]+/g, ' ')} `;
  const m = t.match(new RegExp(`\\b${words.join(' ')} 0*(\\d{1,2})(?![\\d/])(?! (?:ans|min|h|heures|millions?|euros?|candidats|semaines?|jours?)\\b)`));
  return m ? +m[1] : null;
}

// Complète une vidéo avec ce que l'on peut lire dans son titre (sans écraser ce qui a été saisi à la main).
export function enrich(video, show = null) {
  const n = parseNumbers(video.title || '');
  n.season ??= seasonAfterTitle(video.title || '', show?.title);
  const airDate = video.airDate ?? parseAirDate(video.title || '');
  const yearMatch = (video.title || '').match(/\b(19[89]\d|20[01]\d)\b/);
  return {
    ...video,
    kind: KINDS.includes(video.kind) && video.source !== 'auto' ? video.kind : classify(video.title || '', video.seconds || 0),
    season: video.season ?? n.season,
    episode: video.episode ?? n.episode,
    format: video.format ?? n.format,
    part: video.part ?? n.part,
    airDate,
    year: video.year ?? (airDate ? +airDate.slice(0, 4) : yearMatch ? +yearMatch[1] : null),
  };
}

// Clé d'un épisode pour repérer les doublons (même épisode mis en ligne plusieurs fois).
export function episodeKey(v) {
  if (v.kind !== 'episode') return null;
  // Sans saison, l'année distingue « E01 2001 » de « E01 2002 ».
  if (v.episode != null || v.format === 'Finale') return `s${v.season ?? `y${v.year ?? '?'}`}-${v.format || 'ep'}-${v.episode ?? 'f'}-p${v.part ?? 0}`;
  if (v.airDate) return `d${v.airDate}-p${v.part ?? 0}`;
  return null;
}

// Titre écrit dans un autre alphabet (version étrangère) : arabe, cyrillique, hébreu, asiatique…
export const foreignScript = (title = '') => /[\u0400-\u04FF\u0590-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(title);

// Une saison par an au plus jusqu'en 2010 : au-delà, c'est une saison postérieure à la décennie.
export function maxSeason(show) {
  const from = show.yearStart && show.yearStart >= 1950 ? show.yearStart : 2000;
  return Math.max(1, Math.min(show.yearEnd ?? 2010, 2010) - from + 1);
}
