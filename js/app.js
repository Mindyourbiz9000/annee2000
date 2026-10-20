// Années 2000 : catalogue, fiches et replays YouTube. Aucune dépendance.

const CATEGORIES = {
  'téléréalité': 'Téléréalité',
  'jeu': 'Jeu télé',
  'divertissement': 'Divertissement',
  'talk-show': 'Talk-show',
  'magazine': 'Magazine & docu',
  'humour': 'Humour',
  'musique': 'Musique',
  'jeunesse': 'Jeunesse',
  'sport': 'Sport',
};

// Couleurs d'écran par chaîne (dégradés « années 2000 », pas les logos officiels).
const CHANNEL_COLORS = {
  'TF1': ['#2f6bff', '#0a1f7a'], 'France 2': ['#ff4b4b', '#7a0a1f'], 'France 3': ['#3cc4ff', '#0a3f7a'],
  'Canal+': ['#5b5b5b', '#050505'], 'M6': ['#b44dff', '#3a0a7a'], 'France 5': ['#4ccf4c', '#0a5a2a'],
  'Arte': ['#ff8a3d', '#6a2400'], 'France 4': ['#ff4fb0', '#6a0a4a'], 'W9': ['#ffd23f', '#8a5a00'],
  'NRJ 12': ['#ff3d6e', '#5a0a2a'], 'TMC': ['#3dd6c4', '#0a4a4a'], 'Direct 8': ['#ffb84d', '#7a3a00'],
  'NT1': ['#9cf23a', '#2a5a00'], 'Gulli': ['#ff9a3d', '#a0300a'], 'Paris Première': ['#d9b45a', '#3a2a0a'],
};
const DEFAULT_COLORS = ['#22b8ff', '#0b1a4a'];
const YEARS = Array.from({ length: 11 }, (_, i) => 2000 + i);
const PAGE = 48;

const state = { q: '', cat: '', channel: '', year: 0, sort: 'fame', withVideo: false, limit: PAGE };
let SHOWS = [];
let BY_ID = new Map();
let HITS = [];
let HIT_BY_ID = new Map();

const $view = document.getElementById('view');
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fold = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

function years(s) {
  if (!s.yearStart) return '';
  if (s.yearEnd === s.yearStart) return String(s.yearStart);
  return `${s.yearStart} – ${s.yearEnd ?? 'auj.'}`;
}
function airedIn(s, y) {
  return s.yearStart && s.yearStart <= y && (s.yearEnd == null || s.yearEnd >= y);
}
function initials(title) {
  const words = title.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter((w) => w && !/^(le|la|les|l|un|une|des|de|du|d|et|à|a|en|pour|qui|que)$/i.test(w));
  return (words.slice(0, 2).map((w) => w[0]).join('') || title.slice(0, 2)).toUpperCase();
}
const thumb = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
const ytSearch = (s) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${s.title} ${s.channels[0] || ''} émission intégrale`)}`;

async function load() {
  const [main, extras, music] = await Promise.all([
    fetch('data/shows.json').then((r) => r.json()),
    fetch('data/extras.json').then((r) => r.json()).catch(() => ({})),
    fetch('data/hits.json').then((r) => r.json()).catch(() => ({ hits: [] })),
  ]);
  HITS = music.hits.map((h) => ({ ...h, _q: fold(`${h.title} ${h.artist}`) }));
  HIT_BY_ID = new Map(HITS.map((h) => [h.id, h]));
  SHOWS = main.shows.map((s) => ({ ...s, ...(extras[s.id] || {}), _q: fold(`${s.title} ${(s.hosts || []).join(' ')} ${s.channels.join(' ')}`) }));
  BY_ID = new Map(SHOWS.map((s) => [s.id, s]));
}

/* ---------- Cartes ---------- */
function card(s) {
  const [c1, c2] = CHANNEL_COLORS[s.channels[0]] || DEFAULT_COLORS;
  const vids = s.videos?.length || 0;
  const eps = s.videos?.filter((v) => v.kind === 'episode').length || 0;
  const badge = eps ? `▶ ${eps} épisode${eps > 1 ? 's' : ''}` : `▶ ${vids} vidéo${vids > 1 ? 's' : ''}`;
  const img = vids ? `<img src="${thumb(s.videos[0].youtubeId)}" alt="" loading="lazy">` : `<span class="card__initials" aria-hidden="true">${esc(initials(s.title))}</span>`;
  return `<a class="card" href="#/e/${encodeURIComponent(s.id)}">
    <div class="card__screen" style="--c1:${c1};--c2:${c2}">
      ${img}
      ${s.channels[0] ? `<span class="card__bug">${esc(s.channels[0])}</span>` : ''}
      ${s.culte ? '<span class="card__culte">CULTE</span>' : ''}
      ${vids ? `<span class="card__badge">${badge}</span>` : ''}
    </div>
    <div class="card__body">
      <span class="card__title">${esc(s.title)}</span>
      <span class="card__meta">${esc(CATEGORIES[s.category] || s.category)} · ${esc(years(s))}</span>
    </div>
  </a>`;
}

/* ---------- Catalogue ---------- */
function filtered() {
  const q = fold(state.q.trim());
  let list = SHOWS.filter((s) =>
    (!q || s._q.includes(q)) &&
    (!state.cat || s.category === state.cat) &&
    (!state.channel || s.channels.includes(state.channel)) &&
    (!state.year || airedIn(s, state.year)) &&
    (!state.withVideo || s.videos?.length));
  const sorters = {
    fame: (a, b) => (b.culte ? 1 : 0) - (a.culte ? 1 : 0) || b.score - a.score,
    az: (a, b) => a.title.localeCompare(b.title, 'fr'),
    year: (a, b) => (a.yearStart || 9999) - (b.yearStart || 9999) || a.title.localeCompare(b.title, 'fr'),
    videos: (a, b) => (b.videos?.length || 0) - (a.videos?.length || 0) || b.score - a.score,
  };
  return list.sort(sorters[state.sort]);
}

function renderHome() {
  document.title = "La télé des années 2000 · Années 2000";
  const channels = [...new Set(SHOWS.flatMap((s) => s.channels))].sort((a, b) =>
    SHOWS.filter((s) => s.channels[0] === b).length - SHOWS.filter((s) => s.channels[0] === a).length);
  const recent = store.get('recent', []).map((id) => BY_ID.get(id)).filter(Boolean);
  const cultes = SHOWS.filter((s) => s.culte).sort((a, b) => b.score - a.score);
  const replays = SHOWS.filter((s) => s.videos?.length).length;
  const digits = String(SHOWS.length).padStart(5, '0').split('').map((d) => `<span>${d}</span>`).join('');
  const isFiltering = state.q || state.cat || state.channel || state.year || state.withVideo;

  $view.innerHTML = `
    <section class="hero">
      <div>
        <h1>Toute la télé des <em>années 2000</em>, au même endroit.</h1>
        <p>Loft Story, Star Academy, Le Maillon faible, Strip-Tease, Tout le monde en parle… Le grand catalogue des émissions françaises diffusées de 2000 à 2010, avec leurs replays sur YouTube.</p>
        <div class="counter" aria-label="${SHOWS.length} émissions répertoriées">${digits}<span class="counter__label">émissions · ${replays} avec replay</span></div>
      </div>
      <div class="hero__tv">${tvBox(cultes[Math.floor(Math.random() * cultes.length)])}</div>
    </section>

    <section class="panel controls" aria-label="Recherche et filtres">
      <form class="search" role="search" id="search-form">
        <label class="skip" for="q">Rechercher une émission ou un animateur</label>
        <input id="q" type="search" placeholder="Une émission, un animateur… (ex. Castaldi, Loft)" value="${esc(state.q)}" autocomplete="off">
        <button class="gel" type="submit">OK</button>
      </form>
      <div class="filters">
        <label for="f-cat">Genre</label>
        <select id="f-cat" class="select">
          <option value="">Tous</option>
          ${Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}" ${state.cat === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
        <label for="f-ch">Chaîne</label>
        <select id="f-ch" class="select">
          <option value="">Toutes</option>
          ${channels.map((c) => `<option ${state.channel === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
        </select>
        <label for="f-sort">Tri</label>
        <select id="f-sort" class="select">
          <option value="fame" ${state.sort === 'fame' ? 'selected' : ''}>Les plus cultes</option>
          <option value="az" ${state.sort === 'az' ? 'selected' : ''}>A → Z</option>
          <option value="year" ${state.sort === 'year' ? 'selected' : ''}>Année de lancement</option>
          <option value="videos" ${state.sort === 'videos' ? 'selected' : ''}>Avec le plus de replays</option>
        </select>
        <label class="check"><input type="checkbox" id="f-vid" ${state.withVideo ? 'checked' : ''}> Avec replay</label>
      </div>
      <div class="chips" role="group" aria-label="Année de diffusion">
        <button class="chip" type="button" data-year="0" aria-pressed="${!state.year}">Toutes les années</button>
        ${YEARS.map((y) => `<button class="chip" type="button" data-year="${y}" aria-pressed="${state.year === y}">${y}</button>`).join('')}
      </div>
    </section>

    ${!isFiltering && recent.length ? `<h2 class="row-title">Vu récemment</h2><div class="strip">${recent.map(card).join('')}</div>` : ''}
    ${!isFiltering ? `<h2 class="row-title">Les émissions cultes <span class="burst">TOP</span></h2><div class="strip">${cultes.map(card).join('')}</div>` : ''}

    <div class="result-line">
      <h2 id="results-title">${isFiltering ? 'Résultats' : 'Tout le catalogue'}</h2>
      <span class="muted" id="results-count"></span>
    </div>
    <div class="grid" id="grid"></div>
    <div class="more" id="more"></div>`;

  bindHome();
  renderGrid();
}

function renderGrid() {
  const list = filtered();
  document.getElementById('results-count').textContent = `${list.length} émission${list.length > 1 ? 's' : ''}`;
  const grid = document.getElementById('grid');
  grid.innerHTML = list.length
    ? list.slice(0, state.limit).map(card).join('')
    : '<div class="panel empty">Aucune émission ne correspond. Essayez un autre mot ou retirez un filtre.</div>';
  const more = document.getElementById('more');
  more.innerHTML = list.length > state.limit ? `<button class="gel gel--lime" type="button" id="more-btn">Voir plus (${list.length - state.limit} restantes)</button>` : '';
  document.getElementById('more-btn')?.addEventListener('click', () => {
    state.limit += PAGE;
    renderGrid();
  });
}

function bindHome() {
  const refresh = () => {
    state.limit = PAGE;
    renderHome();
    document.getElementById('results-title').scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  const q = document.getElementById('q');
  let t;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.q = q.value;
      state.limit = PAGE;
      renderGrid();
    }, 150);
  });
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.q = q.value;
    refresh();
  });
  document.getElementById('f-cat').addEventListener('change', (e) => { state.cat = e.target.value; refresh(); });
  document.getElementById('f-ch').addEventListener('change', (e) => { state.channel = e.target.value; refresh(); });
  document.getElementById('f-sort').addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });
  document.getElementById('f-vid').addEventListener('change', (e) => { state.withVideo = e.target.checked; refresh(); });
  document.querySelectorAll('[data-year]').forEach((b) => b.addEventListener('click', () => { state.year = +b.dataset.year; refresh(); }));
  bindPosters($view);
}

/* ---------- Téléviseur et lecteur ---------- */
function tvBox(s, wide = false, href = null) {
  if (!s) return '';
  const v = s.videos?.[0];
  const screen = v
    ? posterHTML(v)
    : `<span class="noise"></span><a class="tv__msg" href="${href || `#/e/${encodeURIComponent(s.id)}`}" style="text-decoration:none">${esc(s.title)}<br>▶ ${esc(s.channels[0] || 'Télé')}</a>`;
  return `<div class="tv ${wide ? 'tv--wide' : ''}">
    <div class="tv__screen" id="tv-screen">${screen}</div>
    <span class="tv__brand">TÉLÉ 2000</span>
    <span class="tv__knobs" aria-hidden="true"><i></i><i></i></span>
  </div>`;
}
function posterHTML(v) {
  return `<button class="poster" type="button" data-play="${esc(v.youtubeId)}" aria-label="Lire : ${esc(v.title || 'vidéo')}">
    <img src="${thumb(v.youtubeId)}" alt="" loading="lazy"><span class="play" aria-hidden="true">▶</span>
  </button>`;
}
function play(screen, id) {
  screen.classList.add('is-playing');
  screen.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="Lecteur YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
}
function bindPosters(root) {
  root.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => play(b.closest('.tv__screen'), b.dataset.play)));
}

/* ---------- Fiche émission ---------- */
const BONUS_GROUPS = [
  ['react', 'Réactions & critiques', '💬'],
  ['coulisses', 'Coulisses, interviews & docs', '🎤'],
  ['extrait', 'Moments cultes & extraits', '⭐'],
  ['best-of', 'Best-of & zappings', '🎞️'],
  ['générique', 'Génériques, jingles & pubs', '🎵'],
];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function niceDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}
function duration(sec) {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
}

// Regroupe les épisodes par saison (ou par année de diffusion quand la saison est inconnue).
function seasonsOf(episodes) {
  const groups = new Map();
  for (const v of episodes) {
    const key = v.season != null ? `s${String(v.season).padStart(3, '0')}` : v.year ? `y${v.year}` : 'z';
    const label = v.season != null ? `Saison ${v.season}` : v.year ? `Diffusion ${v.year}` : 'Autres épisodes';
    if (!groups.has(key)) groups.set(key, { key, label, items: [] });
    groups.get(key).items.push(v);
  }
  const order = (v) => (v.format === 'Finale' ? 1 : 0);
  for (const g of groups.values()) {
    g.items.sort((a, b) => order(a) - order(b) ||
      (a.episode ?? 9999) - (b.episode ?? 9999) ||
      (a.airDate || '9999').localeCompare(b.airDate || '9999') ||
      (a.part ?? 0) - (b.part ?? 0));
  }
  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function episodeLabel(v) {
  const bits = [];
  if (v.season != null) bits.push(`S${v.season}`);
  if (v.format === 'Finale') bits.push('Finale');
  else if (v.episode != null) bits.push(`${v.format || 'Ép.'} ${v.episode}`);
  else if (v.format) bits.push(v.format);
  if (v.part) bits.push(`partie ${v.part}`);
  return bits.join(' · ') || (v.airDate ? niceDate(v.airDate) : 'Épisode');
}

function videoItem(v, label) {
  const meta = [v.airDate && !label.includes(niceDate(v.airDate)) ? niceDate(v.airDate) : '', duration(v.seconds), v.channelName].filter(Boolean).join(' · ');
  return `<button class="ep" type="button" data-video="${esc(v.youtubeId)}">
    <span class="ep__thumb"><img src="${thumb(v.youtubeId)}" alt="" loading="lazy">${v.seconds ? `<i>${esc(duration(v.seconds))}</i>` : ''}</span>
    <span class="ep__text">
      <small class="ep__label">${esc(label)}</small>
      <b>${esc(v.title)}</b>
      ${meta ? `<small>${esc(meta)}</small>` : ''}
    </span>
  </button>`;
}

function renderShow(id) {
  const s = BY_ID.get(id);
  if (!s) {
    $view.innerHTML = `<div class="panel empty" style="margin-top:30px">Cette émission n'est pas (encore) au programme. <a href="#/tv">Retour au catalogue</a></div>`;
    return;
  }
  document.title = `${s.title} · Années 2000`;
  store.set('recent', [s.id, ...store.get('recent', []).filter((x) => x !== s.id)].slice(0, 12));

  const vids = s.videos || [];
  const episodes = vids.filter((v) => v.kind === 'episode');
  const bonus = vids.filter((v) => v.kind !== 'episode');
  const seasons = seasonsOf(episodes);
  const first = seasons[0]?.items[0] || bonus[0];
  const related = SHOWS.filter((o) => o.id !== s.id && o.category === s.category && o.channels[0] === s.channels[0])
    .sort((a, b) => b.score - a.score).slice(0, 8);

  $view.innerHTML = `
    <a class="back" href="#/tv">← Retour au catalogue</a>
    <article class="show">
      <div>
        ${tvBox({ ...s, videos: first ? [first] : [] }, true)}
        <p class="now-playing muted" id="now-playing">${first ? `À l'écran : ${esc(first.title)}` : 'Pas encore de replay sélectionné : le bouton ci-dessous lance la recherche sur YouTube.'}</p>
        <div class="actions">
          <a class="gel gel--zap" href="${ytSearch(s)}" target="_blank" rel="noopener">🔎 Chercher sur YouTube</a>
          ${s.playlistId ? `<a class="gel" href="https://www.youtube.com/playlist?list=${encodeURIComponent(s.playlistId)}" target="_blank" rel="noopener">▶ Playlist complète</a>` : ''}
        </div>
      </div>
      <div>
        <h1 class="show__title">${esc(s.title)}</h1>
        <div class="tags">
          <a class="tag tag--cat" href="#/tv" data-filter-cat="${esc(s.category)}">${esc(CATEGORIES[s.category] || s.category)}</a>
          ${s.culte ? '<span class="tag" style="background:var(--gold);color:#3a2400;border-color:transparent">★ Culte</span>' : ''}
          ${s.channels.map((c) => `<a class="tag" href="#/tv" data-filter-ch="${esc(c)}">${esc(c)}</a>`).join('')}
        </div>
        <div class="panel facts">
          <dl>
            <dt>Diffusion</dt><dd>${esc(years(s)) || 'n.c.'}</dd>
            ${s.channels.length ? `<dt>Chaîne${s.channels.length > 1 ? 's' : ''}</dt><dd>${esc(s.channels.join(', '))}</dd>` : ''}
            ${s.hosts?.length ? `<dt>Présentation</dt><dd>${esc(s.hosts.join(', '))}</dd>` : ''}
            <dt>Replays</dt><dd>${episodes.length} épisode${episodes.length > 1 ? 's' : ''} · ${bonus.length} bonus</dd>
          </dl>
        </div>
        ${s.catchphrase ? `<blockquote class="quote">${esc(s.catchphrase)}</blockquote>` : ''}
        <div class="desc">
          ${s.anecdote ? `<p>${esc(s.anecdote)}</p>` : ''}
          ${s.description ? `<p class="${s.anecdote ? 'muted' : ''}">${esc(s.description)}</p>` : ''}
          <p class="muted">Source : <a href="${esc(s.wikipedia)}" target="_blank" rel="noopener">article Wikipédia</a> (CC BY-SA 4.0).</p>
        </div>
      </div>
    </article>

    ${vids.length ? `<section class="library">
      <div class="folder folder--episodes">
        <h2 class="folder__tab">📼 Épisodes <span>${episodes.length}</span></h2>
        <div class="folder__body">
          ${s.playlists?.length ? `<div class="actions playlists">${s.playlists.map((p) => `<a class="gel gel--small" href="https://www.youtube.com/playlist?list=${encodeURIComponent(p.playlistId)}" target="_blank" rel="noopener">▶ ${esc(p.title || (p.season != null ? `Playlist saison ${p.season}` : 'Playlist YouTube'))}</a>`).join('')}</div>` : ''}
          ${seasons.length ? `
            <div class="chips seasons" role="tablist" aria-label="Saisons">
              ${seasons.map((g, i) => `<button class="chip" type="button" role="tab" data-season="${g.key}" aria-selected="${i === 0}" aria-pressed="${i === 0}">${esc(g.label)} <small>(${g.items.length})</small></button>`).join('')}
            </div>
            ${seasons.map((g, i) => `<div class="ep-list" data-season-panel="${g.key}" ${i ? 'hidden' : ''}>
              ${g.items.map((v) => videoItem(v, episodeLabel(v))).join('')}
            </div>`).join('')}`
          : '<p class="muted">Aucun épisode complet trouvé pour l\'instant. Jetez un œil au dossier bonus.</p>'}
        </div>
      </div>
      <aside class="folder folder--bonus">
        <h2 class="folder__tab">📁 Bonus <span>${bonus.length}</span></h2>
        <div class="folder__body">
          ${bonus.length ? BONUS_GROUPS.map(([kind, label, icon]) => {
            const items = bonus.filter((v) => v.kind === kind);
            return items.length ? `<details class="sub" ${kind === BONUS_GROUPS.find(([k]) => bonus.some((v) => v.kind === k))[0] ? 'open' : ''}>
              <summary>${icon} ${esc(label)} <span>${items.length}</span></summary>
              <div class="ep-list ep-list--compact">${items.map((v) => videoItem(v, v.year ? String(v.year) : label)).join('')}</div>
            </details>` : '';
          }).join('') : '<p class="muted">Pas encore de bonus.</p>'}
        </div>
      </aside>
    </section>` : ''}

    ${related.length ? `<h2 class="row-title">Dans le même genre</h2><div class="strip">${related.map(card).join('')}</div>` : ''}`;

  bindPosters($view);
  bindLibrary();
  $view.querySelectorAll('[data-filter-cat]').forEach((a) => a.addEventListener('click', () => Object.assign(state, { cat: a.dataset.filterCat, channel: '', q: '', year: 0 })));
  $view.querySelectorAll('[data-filter-ch]').forEach((a) => a.addEventListener('click', () => Object.assign(state, { channel: a.dataset.filterCh, cat: '', q: '', year: 0 })));
}

/* ---------- Frise chronologique ---------- */
function renderTimeline() {
  document.title = 'Frise · Années 2000';
  const starts = SHOWS.filter((s) => s.yearStart >= 2000 && s.yearStart <= 2010);
  $view.innerHTML = `
    <section class="hero" style="grid-template-columns:1fr">
      <div><h1>La frise des <em>lancements</em></h1>
      <p>Chaque année, les émissions qui ont débarqué à l'antenne. Les cultes sont en tête.</p></div>
    </section>
    <div class="timeline">
      ${YEARS.map((y) => {
        const list = starts.filter((s) => s.yearStart === y).sort((a, b) => (b.culte ? 1 : 0) - (a.culte ? 1 : 0) || b.score - a.score);
        return `<section class="year" aria-label="${y}">
          <div class="year__label">${y}</div>
          <div class="year__shows">${list.map((s) => `<a class="tag" href="#/e/${encodeURIComponent(s.id)}" ${s.culte ? 'style="background:var(--gold);color:#3a2400;border-color:transparent"' : ''}>${esc(s.title)}</a>`).join('')}</div>
        </section>`;
      }).join('')}
    </div>`;
}

/* ---------- Accueil : la télé ou la musique ? ---------- */
function renderChooser() {
  setMode('home');
  document.title = 'Années 2000 · La télé et la musique des années 2000';
  const replays = SHOWS.filter((s) => s.videos?.length).length;
  const clips = HITS.filter((h) => h.videos?.length).length;
  $view.innerHTML = `
    <section class="choose">
      <p class="choose__kicker">Bienvenue dans les années 2000 ✦</p>
      <h1 class="choose__q">Tu veux voir la <em>télé</em> ou écouter la <em class="alt">musique</em> des années 2000 ?</h1>
      <div class="choose__grid">
        <a class="choice choice--tv" href="#/tv">
          <span class="choice__art" aria-hidden="true">
            <span class="mini-tv"><span class="noise"></span><span class="mini-tv__txt">TF1 · M6 · CANAL+</span></span>
          </span>
          <span class="choice__title">La télé des années 2000</span>
          <span class="choice__desc">Loft Story, Star Academy, Le Maillon faible, Strip-Tease… ${SHOWS.length} émissions, ${replays} avec replays.</span>
          <span class="gel">📺 Allumer la télé</span>
        </a>
        <a class="choice choice--music" href="#/musique">
          <span class="choice__art" aria-hidden="true"><span class="cd"></span></span>
          <span class="choice__title">La musique des années 2000</span>
          <span class="choice__desc">Tous les numéros un et les plus grosses ventes de 2000 à 2010 : ${HITS.length} tubes, ${clips} avec clips et lives.</span>
          <span class="gel gel--zap">🎵 Lancer le CD</span>
        </a>
      </div>
    </section>`;
}

/* ---------- Musique ---------- */
const GENRES = {
  'variété': 'Variété française',
  'pop': 'Pop',
  'rap-rnb': "Rap & R'n'B",
  'dance': 'Dance & électro',
  'latino': 'Latino & tubes de l\'été',
  'rock': 'Rock',
  'télé-crochet': 'Télé-crochets',
};
const GENRE_COLORS = {
  'variété': ['#ff6fa8', '#7a0a3f'], 'pop': ['#b44dff', '#3a0a7a'], 'rap-rnb': ['#ffb84d', '#5a2a00'],
  'dance': ['#22d3ff', '#0a2f7a'], 'latino': ['#ff8a3d', '#8a1a00'], 'rock': ['#8a8a8a', '#111'], 'télé-crochet': ['#ffd23f', '#8a5a00'],
};
const MUSIC_MAIN = [
  ['clip', 'Clip officiel', '🎬'],
  ['live', 'Lives & télé', '📺'],
  ['version', 'Versions & remix', '🎚️'],
];
const MUSIC_BONUS = [
  ['react', 'Réactions & critiques', '💬'],
  ['coulisses', 'Coulisses, making-of & interviews', '🎤'],
  ['paroles', 'Paroles & karaoké', '📝'],
  ['reprise', 'Reprises & covers', '🎸'],
];
const mstate = { q: '', genre: '', year: 0, sort: 'score', onlyOne: false, limit: PAGE };

function hitBadge(h) {
  if (h.numberOne) return `N°1 · ${h.weeksAtOne} sem.`;
  if (h.yearRank) return `Top ${h.yearRank.rank} ${h.yearRank.year}`;
  return '';
}
function hitCard(h) {
  const [c1, c2] = GENRE_COLORS[h.genre] || DEFAULT_COLORS;
  const clip = h.videos?.find((v) => v.kind === 'clip') || h.videos?.[0];
  const n = h.videos?.length || 0;
  return `<a class="card card--hit" href="#/m/${encodeURIComponent(h.id)}">
    <div class="card__screen" style="--c1:${c1};--c2:${c2}">
      ${clip ? `<img src="${thumb(clip.youtubeId)}" alt="" loading="lazy">` : `<span class="card__initials" aria-hidden="true">♪</span>`}
      <span class="card__bug">${h.year}</span>
      ${hitBadge(h) ? `<span class="card__culte">${esc(hitBadge(h))}</span>` : ''}
      ${n ? `<span class="card__badge">▶ ${n} vidéo${n > 1 ? 's' : ''}</span>` : ''}
    </div>
    <div class="card__body">
      <span class="card__title">${esc(h.title)}</span>
      <span class="card__meta">${esc(h.artist)} · ${esc(GENRES[h.genre] || h.genre)}</span>
    </div>
  </a>`;
}

function filteredHits() {
  const q = fold(mstate.q.trim());
  const list = HITS.filter((h) =>
    (!q || h._q.includes(q)) &&
    (!mstate.genre || h.genre === mstate.genre) &&
    (!mstate.year || h.year === mstate.year) &&
    (!mstate.onlyOne || h.numberOne));
  const sorters = {
    score: (a, b) => b.score - a.score,
    weeks: (a, b) => b.weeksAtOne - a.weeksAtOne || b.score - a.score,
    year: (a, b) => a.year - b.year || (a.released || '').localeCompare(b.released || '') || b.score - a.score,
    az: (a, b) => a.title.localeCompare(b.title, 'fr'),
  };
  return list.sort(sorters[mstate.sort]);
}

function renderMusicHome() {
  setMode('music');
  document.title = 'La musique des années 2000 · Années 2000';
  const top = [...HITS].sort((a, b) => b.score - a.score).slice(0, 20);
  const pick = top[Math.floor(Math.random() * Math.min(10, top.length))];
  const digits = String(HITS.length).padStart(5, '0').split('').map((d) => `<span>${d}</span>`).join('');
  const isFiltering = mstate.q || mstate.genre || mstate.year || mstate.onlyOne;
  const clip = pick?.videos?.find((v) => v.kind === 'clip') || pick?.videos?.[0];

  $view.innerHTML = `
    <section class="hero">
      <div>
        <h1>Tous les <em>tubes</em> des années 2000.</h1>
        <p>Des numéros un du Top 50 aux plus grosses ventes de chaque année, de 2000 à 2010 : le clip, les lives télé, les remix, et tout le reste dans le dossier bonus.</p>
        <div class="counter" aria-label="${HITS.length} tubes">${digits}<span class="counter__label">tubes · ${HITS.filter((h) => h.numberOne).length} numéros un</span></div>
      </div>
      <div class="hero__tv">${tvBox({ id: pick?.id, title: pick ? `${pick.artist} · ${pick.title}` : '', channels: ['Hit'], videos: clip ? [clip] : [] }, true, `#/m/${pick?.id}`)}</div>
    </section>

    <section class="panel controls" aria-label="Recherche et filtres">
      <form class="search" role="search" id="m-search-form">
        <label class="skip" for="mq">Rechercher un titre ou un artiste</label>
        <input id="mq" type="search" placeholder="Un titre, un artiste… (ex. Lorie, Crazy, Diam's)" value="${esc(mstate.q)}" autocomplete="off">
        <button class="gel" type="submit">OK</button>
      </form>
      <div class="filters">
        <label for="m-genre">Genre</label>
        <select id="m-genre" class="select">
          <option value="">Tous</option>
          ${Object.entries(GENRES).map(([k, v]) => `<option value="${k}" ${mstate.genre === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
        <label for="m-sort">Tri</label>
        <select id="m-sort" class="select">
          <option value="score" ${mstate.sort === 'score' ? 'selected' : ''}>Les plus gros succès</option>
          <option value="weeks" ${mstate.sort === 'weeks' ? 'selected' : ''}>Semaines numéro un</option>
          <option value="year" ${mstate.sort === 'year' ? 'selected' : ''}>Date de sortie</option>
          <option value="az" ${mstate.sort === 'az' ? 'selected' : ''}>A → Z</option>
        </select>
        <label class="check"><input type="checkbox" id="m-one" ${mstate.onlyOne ? 'checked' : ''}> Numéros un seulement</label>
      </div>
      <div class="chips" role="group" aria-label="Année">
        <button class="chip" type="button" data-myear="0" aria-pressed="${!mstate.year}">Toutes les années</button>
        ${YEARS.map((y) => `<button class="chip" type="button" data-myear="${y}" aria-pressed="${mstate.year === y}">${y}</button>`).join('')}
      </div>
    </section>

    ${!isFiltering ? `<h2 class="row-title">Les plus gros tubes <span class="burst">HIT</span></h2><div class="strip">${top.map(hitCard).join('')}</div>` : ''}
    ${!isFiltering ? Object.keys(GENRES).map((g) => {
      const list = HITS.filter((h) => h.genre === g).sort((a, b) => b.score - a.score).slice(0, 12);
      return list.length ? `<h2 class="row-title">${esc(GENRES[g])}</h2><div class="strip">${list.map(hitCard).join('')}</div>` : '';
    }).join('') : ''}

    <div class="result-line">
      <h2 id="m-results-title">${isFiltering ? 'Résultats' : 'Tous les tubes'}</h2>
      <span class="muted" id="m-results-count"></span>
    </div>
    <div class="grid" id="m-grid"></div>
    <div class="more" id="m-more"></div>`;

  const refresh = () => {
    mstate.limit = PAGE;
    renderMusicHome();
    document.getElementById('m-results-title').scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  const q = document.getElementById('mq');
  let t;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { mstate.q = q.value; mstate.limit = PAGE; renderHitGrid(); }, 150);
  });
  document.getElementById('m-search-form').addEventListener('submit', (e) => { e.preventDefault(); mstate.q = q.value; refresh(); });
  document.getElementById('m-genre').addEventListener('change', (e) => { mstate.genre = e.target.value; refresh(); });
  document.getElementById('m-sort').addEventListener('change', (e) => { mstate.sort = e.target.value; refresh(); });
  document.getElementById('m-one').addEventListener('change', (e) => { mstate.onlyOne = e.target.checked; refresh(); });
  document.querySelectorAll('[data-myear]').forEach((b) => b.addEventListener('click', () => { mstate.year = +b.dataset.myear; refresh(); }));
  bindPosters($view);
  renderHitGrid();
}

function renderHitGrid() {
  const list = filteredHits();
  document.getElementById('m-results-count').textContent = `${list.length} tube${list.length > 1 ? 's' : ''}`;
  document.getElementById('m-grid').innerHTML = list.length
    ? list.slice(0, mstate.limit).map(hitCard).join('')
    : '<div class="panel empty">Aucun tube ne correspond. Essayez un autre mot ou retirez un filtre.</div>';
  const more = document.getElementById('m-more');
  more.innerHTML = list.length > mstate.limit ? `<button class="gel gel--lime" type="button" id="m-more-btn">Voir plus (${list.length - mstate.limit} restants)</button>` : '';
  document.getElementById('m-more-btn')?.addEventListener('click', () => { mstate.limit += PAGE; renderHitGrid(); });
}

// Dossier à onglets (épisodes d'une émission, ou clip / lives / versions d'un tube).
function tabbedFolder(icon, title, groups, emptyText) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return `<div class="folder folder--episodes">
    <h2 class="folder__tab">${icon} ${esc(title)} <span>${total}</span></h2>
    <div class="folder__body">
      ${groups.length ? `
        <div class="chips seasons" role="tablist" aria-label="${esc(title)}">
          ${groups.map((g, i) => `<button class="chip" type="button" role="tab" data-season="${g.key}" aria-selected="${i === 0}" aria-pressed="${i === 0}">${esc(g.label)} <small>(${g.items.length})</small></button>`).join('')}
        </div>
        ${groups.map((g, i) => `<div class="ep-list" data-season-panel="${g.key}" ${i ? 'hidden' : ''}>
          ${g.items.map((v) => videoItem(v, g.itemLabel(v))).join('')}
        </div>`).join('')}`
      : `<p class="muted">${esc(emptyText)}</p>`}
    </div>
  </div>`;
}
function bonusFolder(groups, items) {
  const firstKind = groups.find(([k]) => items.some((v) => v.kind === k))?.[0];
  return `<aside class="folder folder--bonus">
    <h2 class="folder__tab">📁 Bonus <span>${items.length}</span></h2>
    <div class="folder__body">
      ${items.length ? groups.map(([kind, label, icon]) => {
        const list = items.filter((v) => v.kind === kind);
        return list.length ? `<details class="sub" ${kind === firstKind ? 'open' : ''}>
          <summary>${icon} ${esc(label)} <span>${list.length}</span></summary>
          <div class="ep-list ep-list--compact">${list.map((v) => videoItem(v, v.year ? String(v.year) : label)).join('')}</div>
        </details>` : '';
      }).join('') : '<p class="muted">Pas encore de bonus.</p>'}
    </div>
  </aside>`;
}
function bindLibrary() {
  const screen = document.getElementById('tv-screen');
  $view.querySelectorAll('[data-video]').forEach((b) => b.addEventListener('click', () => {
    $view.querySelectorAll('[data-video]').forEach((x) => x.classList.toggle('is-current', x === b));
    play(screen, b.dataset.video);
    document.getElementById('now-playing').textContent = `À l'écran : ${b.querySelector('b').textContent}`;
    screen.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }));
  $view.querySelectorAll('[data-season]').forEach((b) => b.addEventListener('click', () => {
    const box = b.closest('.folder__body');
    box.querySelectorAll('[data-season]').forEach((x) => {
      x.setAttribute('aria-pressed', String(x === b));
      x.setAttribute('aria-selected', String(x === b));
    });
    box.querySelectorAll('[data-season-panel]').forEach((p) => (p.hidden = p.dataset.seasonPanel !== b.dataset.season));
  }));
}

function renderHit(id) {
  setMode('music');
  const h = HIT_BY_ID.get(id);
  if (!h) {
    $view.innerHTML = `<div class="panel empty" style="margin-top:30px">Ce tube n'est pas (encore) dans la playlist. <a href="#/musique">Retour aux tubes</a></div>`;
    return;
  }
  document.title = `${h.title} · ${h.artist} · Années 2000`;
  const vids = h.videos || [];
  const main = MUSIC_MAIN.map(([kind, label, icon]) => ({
    key: kind, label: `${icon} ${label}`, items: vids.filter((v) => v.kind === kind),
    itemLabel: (v) => (v.year ? `${label} · ${v.year}` : label),
  })).filter((g) => g.items.length);
  const bonus = vids.filter((v) => MUSIC_BONUS.some(([k]) => k === v.kind));
  const first = main[0]?.items[0] || bonus[0];
  const sameYear = HITS.filter((o) => o.id !== h.id && o.year === h.year).sort((a, b) => b.score - a.score).slice(0, 10);
  const sameArtist = HITS.filter((o) => o.id !== h.id && fold(o.artist).includes(fold(h.artist.split(/ (?:featuring|feat\.?|et|&) /i)[0])));
  const ytq = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${h.artist} ${h.title}`)}`;

  $view.innerHTML = `
    <a class="back" href="#/musique">← Retour aux tubes</a>
    <article class="show">
      <div>
        ${tvBox({ ...h, channels: [], videos: first ? [first] : [] }, true)}
        <p class="now-playing muted" id="now-playing">${first ? `À l'écran : ${esc(first.title)}` : 'Pas encore de vidéo sélectionnée : le bouton ci-dessous lance la recherche sur YouTube.'}</p>
        <div class="actions"><a class="gel gel--zap" href="${ytq}" target="_blank" rel="noopener">🔎 Chercher sur YouTube</a></div>
      </div>
      <div>
        <p class="show__artist">${esc(h.artist)}</p>
        <h1 class="show__title">${esc(h.title)}</h1>
        <div class="tags">
          <a class="tag tag--cat" href="#/musique" data-filter-genre="${esc(h.genre)}">${esc(GENRES[h.genre] || h.genre)}</a>
          ${h.numberOne ? `<span class="tag" style="background:var(--gold);color:#3a2400;border-color:transparent">★ Numéro un</span>` : ''}
          <a class="tag" href="#/musique" data-filter-myear="${h.year}">${h.year}</a>
        </div>
        <div class="panel facts">
          <dl>
            <dt>Sortie</dt><dd>${h.released ? esc(niceDate(h.released)) : h.year}</dd>
            ${h.numberOne ? `<dt>Numéro un</dt><dd>${h.weeksAtOne} semaine${h.weeksAtOne > 1 ? 's' : ''} en tête du Top</dd>` : ''}
            ${h.yearRank ? `<dt>Classement annuel</dt><dd>${h.yearRank.rank}${h.yearRank.rank === 1 ? 'er' : 'e'} meilleure vente de ${h.yearRank.year}</dd>` : ''}
            ${h.genres?.length ? `<dt>Style</dt><dd>${esc(h.genres.join(', '))}</dd>` : ''}
            <dt>Vidéos</dt><dd>${vids.length - bonus.length} clip${vids.length - bonus.length > 1 ? 's' : ''} & lives · ${bonus.length} bonus</dd>
          </dl>
        </div>
        <div class="desc">
          ${h.description ? `<p>${esc(h.description)}</p>` : ''}
          ${h.wikipedia ? `<p class="muted">Source : <a href="${esc(h.wikipedia)}" target="_blank" rel="noopener">article Wikipédia</a> (CC BY-SA 4.0), classements SNEP.</p>` : '<p class="muted">Source : classements SNEP via Wikipédia.</p>'}
        </div>
      </div>
    </article>

    ${vids.length ? `<section class="library">
      ${tabbedFolder('🎬', 'Clip & lives', main, 'Pas encore de clip trouvé. Jetez un œil au dossier bonus.')}
      ${bonusFolder(MUSIC_BONUS, bonus)}
    </section>` : ''}

    ${sameArtist.length ? `<h2 class="row-title">Du même artiste</h2><div class="strip">${sameArtist.map(hitCard).join('')}</div>` : ''}
    ${sameYear.length ? `<h2 class="row-title">Les autres tubes de ${h.year}</h2><div class="strip">${sameYear.map(hitCard).join('')}</div>` : ''}`;

  bindPosters($view);
  bindLibrary();
  $view.querySelectorAll('[data-filter-genre]').forEach((a) => a.addEventListener('click', () => Object.assign(mstate, { genre: a.dataset.filterGenre, year: 0, q: '' })));
  $view.querySelectorAll('[data-filter-myear]').forEach((a) => a.addEventListener('click', () => Object.assign(mstate, { year: +a.dataset.filterMyear, genre: '', q: '' })));
}

function renderMusicTimeline() {
  setMode('music');
  document.title = 'Frise des tubes · Années 2000';
  $view.innerHTML = `
    <section class="hero" style="grid-template-columns:1fr">
      <div><h1>La frise des <em>tubes</em></h1>
      <p>Chaque année, les tubes qui ont fait danser la France, dans l'ordre de leur sortie. Les numéros un sont en or.</p></div>
    </section>
    <div class="timeline">
      ${YEARS.map((y) => {
        const list = HITS.filter((h) => h.year === y).sort((a, b) => (a.released || `${y}-99`).localeCompare(b.released || `${y}-99`) || b.score - a.score);
        return `<section class="year" aria-label="${y}">
          <div class="year__label">${y}</div>
          <div class="year__shows">${list.map((h) => `<a class="tag" href="#/m/${encodeURIComponent(h.id)}" ${h.numberOne ? 'style="background:var(--gold);color:#3a2400;border-color:transparent"' : ''}>${esc(h.artist)} · ${esc(h.title)}</a>`).join('')}</div>
        </section>`;
      }).join('')}
    </div>`;
}

/* ---------- Routeur ---------- */
function setMode(mode) {
  document.body.dataset.mode = mode;
  const frise = document.getElementById('nav-frise');
  frise.href = mode === 'music' ? '#/musique/frise' : '#/tv/frise';
  frise.hidden = mode === 'home';
  document.getElementById('nav-tv').setAttribute('aria-current', String(mode === 'tv'));
  document.getElementById('nav-music').setAttribute('aria-current', String(mode === 'music'));
}

function route() {
  const hash = location.hash.slice(1) || '/';
  let m;
  if ((m = hash.match(/^\/e\/(.+)$/))) { setMode('tv'); renderShow(decodeURIComponent(m[1])); }
  else if ((m = hash.match(/^\/m\/(.+)$/))) renderHit(decodeURIComponent(m[1]));
  else if (hash === '/tv/frise' || hash === '/frise') { setMode('tv'); renderTimeline(); }
  else if (hash === '/tv') { setMode('tv'); renderHome(); }
  else if (hash === '/musique/frise') renderMusicTimeline();
  else if (hash === '/musique') renderMusicHome();
  else renderChooser();
  window.scrollTo(0, 0);
}

document.getElementById('zap').addEventListener('click', () => {
  if (document.body.dataset.mode === 'music') {
    const pool = HITS.filter((h) => h.videos?.length);
    const h = (pool.length ? pool : HITS)[Math.floor(Math.random() * (pool.length || HITS.length))];
    if (h) location.hash = `#/m/${h.id}`;
    return;
  }
  const pool = SHOWS.filter((s) => s.videos?.length).length > 20 ? SHOWS.filter((s) => s.videos?.length) : SHOWS.filter((s) => s.fame <= 2);
  const s = pool[Math.floor(Math.random() * pool.length)];
  if (s) location.hash = `#/e/${s.id}`;
});

window.addEventListener('hashchange', route);
load().then(route).catch((e) => {
  console.error(e);
  $view.innerHTML = '<div class="panel empty" style="margin-top:30px">Impossible de charger le catalogue. Ouvrez le site via un serveur web (voir README).</div>';
});
