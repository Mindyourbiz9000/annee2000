// Les années milléniales : catalogue télé et musique des années 2000, replays YouTube, blind test. Aucune dépendance.

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
  document.title = "La télé des années 2000 · Les années milléniales";
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
    <span class="tv__brand">MILLÉNIALES</span>
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
  document.title = `${s.title} · Les années milléniales`;
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
  document.title = 'Frise · Les années milléniales';
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
  document.title = 'Les années milléniales · La télé et la musique des années 2000';
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
      <p class="choose__more"><a class="gel gel--lime" href="#/blindtest">🎧 Ou teste-toi au blind test des années 2000</a></p>
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
  document.title = 'La musique des années 2000 · Les années milléniales';
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
  document.title = `${h.title} · ${h.artist} · Les années milléniales`;
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
  document.title = 'Frise des tubes · Les années milléniales';
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

/* ---------- Blind test ---------- */
const bt = { broken: new Set(), guard: null, duration: 10, level: 'normal', year: 0, genre: '', rounds: 10, queue: [], i: 0, score: 0, results: [], player: null, timer: null, revealed: false };
const BT_LEVELS = { facile: ['Facile', 150], normal: ['Normal', 450], expert: ['Expert', Infinity] };

// Le lecteur YouTube programmable (API IFrame), chargé une seule fois à la demande.
let ytReady = null;
function loadYouTubeApi() {
  if (ytReady) return ytReady;
  ytReady = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  });
  return ytReady;
}

const clipOf = (h) => h.videos?.find((v) => v.kind === 'clip' && !bt.broken.has(v.youtubeId));

// Comparaison tolérante des réponses : fautes de frappe, singulier/pluriel, y/i, lettres doublées…
const BT_STOP = new Set(['le', 'la', 'les', 'l', 'de', 'des', 'du', 'd', 'un', 'une', 'et', 'the', 'a', 'an', 'it', 's', 'i', 'feat', 'featuring', 'ft', 'of', 'and', 'to', 'in', 'on', 'my', 'me', 'je', 'tu', 'il', 'en']);
const btNorm = (w) => w.replace(/ph/g, 'f').replace(/y/g, 'i').replace(/(.)\1+/g, '$1');
const btWords = (s) => fold(s.replace(/\(.*?\)|\[.*?\]/g, ''))
  .replace(/['’]/g, ' ').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
  .filter((w) => w && !BT_STOP.has(w)).map(btNorm);
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}
function sameWord(a, b) {
  if (a === b) return true;
  const sing = (w) => w.replace(/(s|x)$/, '');
  if (sing(a) === sing(b)) return true;
  const len = Math.min(a.length, b.length);
  if (len < 3) return false;
  return levenshtein(a, b) <= (len >= 7 ? 2 : 1);
}
const found = (answer, target) => target.filter((t) => answer.some((a) => sameWord(a, t)));
// Titre : la moitié des mots importants, dont au moins un de 4 lettres ou plus.
function titleMatches(answer, title) {
  const a = btWords(answer);
  const t = btWords(title);
  if (!a.length || !t.length) return false;
  const ok = found(a, t);
  return ok.length / t.length >= 0.5 && ok.some((w) => w.length >= 4 || t.length === 1);
}
// Artiste : un mot de 4 lettres ou plus suffit (le nom de famille), sinon le nom complet.
function artistMatches(answer, artist) {
  const a = btWords(answer);
  const t = btWords(artist);
  if (!a.length || !t.length) return false;
  const ok = found(a, t);
  return ok.some((w) => w.length >= 4) || ok.length === t.length;
}

function renderBlindSetup() {
  setMode('music');
  document.title = 'Blind test · Les années milléniales';
  const pool = blindPool();
  $view.innerHTML = `
    <section class="hero" style="grid-template-columns:1fr">
      <div>
        <h1>Le <em>blind test</em> des années 2000</h1>
        <p>On te fait écouter les premières secondes d'un tube, l'image est cachée. Trouve le titre ou l'artiste, puis on dévoile le clip.</p>
      </div>
    </section>
    <section class="panel controls blind-setup">
      <div class="filters">
        <span class="muted">Durée de l'extrait</span>
        <div class="chips">${[5, 10].map((d) => `<button class="chip" type="button" data-bt-dur="${d}" aria-pressed="${bt.duration === d}">${d} secondes</button>`).join('')}</div>
      </div>
      <div class="filters">
        <span class="muted">Difficulté</span>
        <div class="chips">${Object.entries(BT_LEVELS).map(([k, [label]]) => `<button class="chip" type="button" data-bt-level="${k}" aria-pressed="${bt.level === k}">${label}</button>`).join('')}</div>
      </div>
      <div class="filters">
        <label for="bt-genre">Genre</label>
        <select id="bt-genre" class="select"><option value="">Tous</option>${Object.entries(GENRES).map(([k, v]) => `<option value="${k}" ${bt.genre === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
        <label for="bt-rounds">Manches</label>
        <select id="bt-rounds" class="select">${[5, 10, 20].map((n) => `<option ${bt.rounds === n ? 'selected' : ''}>${n}</option>`).join('')}</select>
      </div>
      <div class="chips" role="group" aria-label="Année">
        <button class="chip" type="button" data-bt-year="0" aria-pressed="${!bt.year}">Toutes les années</button>
        ${YEARS.map((y) => `<button class="chip" type="button" data-bt-year="${y}" aria-pressed="${bt.year === y}">${y}</button>`).join('')}
      </div>
      <div class="actions">
        <button class="gel gel--zap" type="button" id="bt-start" ${pool.length < 3 ? 'disabled' : ''}>🎧 Jouer en solo</button>
        <a class="gel gel--lime" href="#/blindtest/hote">👥 Jouer à plusieurs</a>
        <span class="muted">${pool.length} tubes possibles avec ces réglages</span>
      </div>
    </section>`;
  const rerender = () => renderBlindSetup();
  $view.querySelectorAll('[data-bt-dur]').forEach((b) => b.addEventListener('click', () => { bt.duration = +b.dataset.btDur; rerender(); }));
  $view.querySelectorAll('[data-bt-level]').forEach((b) => b.addEventListener('click', () => { bt.level = b.dataset.btLevel; rerender(); }));
  $view.querySelectorAll('[data-bt-year]').forEach((b) => b.addEventListener('click', () => { bt.year = +b.dataset.btYear; rerender(); }));
  document.getElementById('bt-genre').addEventListener('change', (e) => { bt.genre = e.target.value; rerender(); });
  document.getElementById('bt-rounds').addEventListener('change', (e) => { bt.rounds = +e.target.value; });
  document.getElementById('bt-start').addEventListener('click', startBlindGame);
}

function blindPool() {
  const max = BT_LEVELS[bt.level][1];
  return [...HITS].filter((h) => clipOf(h)).sort((a, b) => b.score - a.score).slice(0, max)
    .filter((h) => (!bt.year || h.year === bt.year) && (!bt.genre || h.genre === bt.genre));
}

function startBlindGame() {
  const pool = blindPool();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  Object.assign(bt, { queue: pool, i: 0, score: 0, results: [] });
  renderBlindRound();
}

function renderBlindRound() {
  clearTimeout(bt.timer);
  clearTimeout(bt.guard);
  if (bt.results.length >= bt.rounds) return renderBlindEnd();
  // Tube suivant de la file qui a encore un clip lisible.
  while (bt.i < bt.queue.length && !clipOf(bt.queue[bt.i])) bt.i += 1;
  if (bt.i >= bt.queue.length) return renderBlindEnd();
  let h = bt.queue[bt.i];
  bt.revealed = false;
  $view.innerHTML = `
    <section class="blind">
      <div class="blind__bar">
        <span class="blind__round">Manche ${bt.results.length + 1} / ${bt.rounds}</span>
        <span class="blind__score">Score : <b>${bt.score}</b></span>
      </div>
      <div class="tv tv--wide">
        <div class="tv__screen is-playing" id="bt-screen">
          <div id="bt-player"></div>
          <div class="blind__cover" id="bt-cover">
            <span class="noise"></span>
            <span class="blind__q" id="bt-q">?</span>
            <span class="blind__count" id="bt-count"></span>
          </div>
        </div>
        <span class="tv__brand">MILLÉNIALES</span>
        <span class="tv__knobs" aria-hidden="true"><i></i><i></i></span>
      </div>
      <div class="blind__panel panel">
        <div class="actions" id="bt-listen">
          <button class="gel gel--zap" type="button" id="bt-play" hidden>▶ Écouter l'extrait</button>
          <button class="gel gel--lime" type="button" id="bt-more" hidden>⏩ 10 secondes de plus</button>
          <button class="gel gel--ghost" type="button" id="bt-replay" hidden>🔁 Réécouter</button>
        </div>
        <form class="search" id="bt-form" autocomplete="off">
          <label class="skip" for="bt-guess">Ta réponse</label>
          <input id="bt-guess" type="search" placeholder="Le titre ou l'artiste…">
          <button class="gel" type="submit">Valider</button>
        </form>
        <div class="actions"><button class="gel gel--ghost gel--small" type="button" id="bt-giveup">Je donne ma langue au chat</button></div>
        <div id="bt-answer" class="blind__answer" hidden></div>
      </div>
    </section>`;

  const $ = (id) => document.getElementById(id);
  const status = (txt) => { $('bt-count').textContent = txt; };
  const show = (id, on) => { $(id).hidden = !on; };
  let playing = false;
  let ready = false;
  let pending = 0; // secondes à écouter au prochain démarrage de la lecture

  // Écoute pendant `seconds` à partir de la position actuelle, puis pause.
  const countdown = (seconds) => {
    clearTimeout(bt.timer);
    let left = seconds;
    status(`${left}`);
    show('bt-more', false);
    show('bt-replay', false);
    const tick = () => {
      if (bt.revealed) return;
      left -= 1;
      if (left <= 0) {
        bt.player?.pauseVideo?.();
        status('À toi !');
        show('bt-more', true);
        show('bt-replay', true);
      } else {
        status(`${left}`);
        bt.timer = setTimeout(tick, 1000);
      }
    };
    bt.timer = setTimeout(tick, 1000);
  };
  const listenFor = (seconds, fromStart) => {
    pending = seconds;
    if (fromStart) bt.player?.seekTo?.(0, true);
    bt.player?.playVideo?.();
  };

  // Extrait en panne : on note la vidéo et on passe au tube suivant, sans changer de manche.
  const swapSong = () => {
    clearTimeout(bt.guard);
    clearTimeout(bt.timer);
    if (bt.revealed) return;
    const c = clipOf(h);
    if (c) bt.broken.add(c.youtubeId);
    status('Extrait indisponible, on change de tube…');
    bt.i += 1;
    while (bt.i < bt.queue.length && !clipOf(bt.queue[bt.i])) bt.i += 1;
    if (bt.i >= bt.queue.length) return renderBlindEnd();
    h = bt.queue[bt.i];
    setTimeout(() => start(), 600);
  };

  const start = async () => {
    status('Chargement…');
    playing = false;
    ready = false;
    show('bt-play', false);
    const YT = await loadYouTubeApi();
    if (bt.revealed) return;
    const id = clipOf(h).youtubeId;
    pending = bt.duration;
    const onState = (e) => {
      if (e.data === YT.PlayerState.PLAYING && !bt.revealed) {
        playing = true;
        clearTimeout(bt.guard);
        show('bt-play', false);
        if (pending) {
          countdown(pending);
          pending = 0;
        }
      }
    };
    try { bt.player?.destroy?.(); } catch {}
    bt.player = new YT.Player('bt-player', {
      videoId: id,
      playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, start: 0 },
      events: {
        onReady: (e) => {
          ready = true;
          clearTimeout(bt.guard);
          e.target.playVideo();
          // Lecture automatique bloquée par le navigateur : on propose le bouton.
          bt.guard = setTimeout(() => {
            if (playing || bt.revealed) return;
            const st = bt.player?.getPlayerState?.();
            if (st === YT.PlayerState.BUFFERING) {
              bt.guard = setTimeout(() => { if (!playing) swapSong(); }, 8000);
              return;
            }
            status('Appuie sur ▶ pour écouter');
            show('bt-play', true);
            bt.guard = setTimeout(() => { if (!playing && $('bt-play')?.hidden) swapSong(); }, 15000);
          }, 4000);
        },
        onStateChange: onState,
        onError: swapSong,
      },
    });
    // Le lecteur ne se charge pas du tout : autre tube.
    bt.guard = setTimeout(() => { if (!ready && !playing) swapSong(); }, 12000);
  };

  $('bt-play').addEventListener('click', () => {
    show('bt-play', false);
    listenFor(bt.duration, true);
  });
  $('bt-more').addEventListener('click', () => listenFor(10, false));
  $('bt-replay').addEventListener('click', () => listenFor(bt.duration, true));
  $('bt-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const g = $('bt-guess').value;
    if (!g.trim()) return;
    const title = titleMatches(g, h.title);
    const artist = artistMatches(g, mainArtistOf(h.artist)) || artistMatches(g, h.artist);
    revealBlind(h, title ? 2 : artist ? 1 : 0, g);
  });
  $('bt-giveup').addEventListener('click', () => revealBlind(h, 0, ''));
  $('bt-guess').focus();
  start();
}

const mainArtistOf = (a) => a.split(/\s+(?:featuring|feat\.?|ft\.?|et|&|avec|vs\.?|x)\s+|\s*[/,]\s*/i)[0];

function revealBlind(h, points, guess) {
  if (bt.revealed) return;
  bt.revealed = true;
  clearTimeout(bt.timer);
  clearTimeout(bt.guard);
  bt.score += points;
  bt.results.push({ h, points, guess });
  document.getElementById('bt-cover').classList.add('is-gone');
  bt.player?.playVideo?.();
  const verdict = points === 2 ? '🎉 Bravo, c\'est le bon titre ! +2' : points === 1 ? '👍 Bon artiste ! +1' : guess ? '😅 Raté !' : '🙈 Dommage !';
  const box = document.getElementById('bt-answer');
  box.hidden = false;
  box.innerHTML = `
    <p class="blind__verdict">${verdict}</p>
    <p class="show__artist">${esc(h.artist)}</p>
    <h2 class="show__title" style="font-size:clamp(22px,4vw,34px)">${esc(h.title)}</h2>
    <p class="muted">${h.year}${h.numberOne ? ` · Numéro un ${h.weeksAtOne} semaine${h.weeksAtOne > 1 ? 's' : ''}` : h.yearRank ? ` · ${h.yearRank.rank}e des ventes en ${h.yearRank.year}` : ''}</p>
    <div class="actions">
      <button class="gel gel--zap" type="button" id="bt-next">${bt.results.length >= bt.rounds ? '🏁 Voir le résultat' : 'Manche suivante →'}</button>
      <a class="gel gel--ghost gel--small" href="#/m/${encodeURIComponent(h.id)}">Voir la fiche du tube</a>
    </div>`;
  document.getElementById('bt-form').hidden = true;
  document.getElementById('bt-giveup').hidden = true;
  document.getElementById('bt-listen').hidden = true;
  document.getElementById('bt-next').addEventListener('click', () => {
    bt.player?.stopVideo?.();
    bt.i += 1;
    renderBlindRound();
  });
}

function renderBlindEnd() {
  try { bt.player?.destroy?.(); } catch {}
  bt.player = null;
  const max = bt.results.length * 2;
  const best = store.get('blindBest', 0);
  const pct = max ? bt.score / max : 0;
  if (pct > best) store.set('blindBest', pct);
  const mood = pct >= 0.8 ? 'Légende des années 2000 ! 🏆' : pct >= 0.5 ? 'Pas mal du tout ! 🎶' : pct > 0 ? 'Il faut réviser ton Hit Machine 📼' : 'Retour en 2001 obligatoire 😄';
  $view.innerHTML = `
    <section class="hero" style="grid-template-columns:1fr">
      <div>
        <h1>Score final : <em>${bt.score} / ${max}</em></h1>
        <p>${mood}${best ? ` Ton meilleur score : ${Math.round(Math.max(best, pct) * 100)} %.` : ''}</p>
        <div class="actions">
          <button class="gel gel--zap" type="button" id="bt-again">🔁 Rejouer</button>
          <a class="gel gel--ghost" href="#/blindtest" id="bt-settings">⚙️ Changer les réglages</a>
        </div>
      </div>
    </section>
    <h2 class="row-title">Les tubes de la partie</h2>
    <div class="grid">${bt.results.map((r) => hitCard(r.h)).join('')}</div>`;
  document.getElementById('bt-again').addEventListener('click', startBlindGame);
  document.getElementById('bt-settings').addEventListener('click', (e) => { e.preventDefault(); renderBlindSetup(); });
}

/* ---------- Blind test à plusieurs ---------- */
// Partie en réseau sans serveur à nous : les navigateurs se connectent directement (WebRTC via PeerJS).
// L'hôte arbitre tout : il choisit les tubes, reçoit les réponses, compte les points. Rien n'est enregistré.
const MP_PREFIX = 'milleniales-bt-';
const MP_POINTS = [5, 4, 3]; // or, argent, bronze ; ensuite 2 (titre) ou 1 (artiste)
const MEDALS = ['🥇', '🥈', '🥉'];
const mp = { peer: null, conns: new Map(), role: null, code: '', name: '', players: new Map(), round: null, queue: [], qi: 0, n: 0, total: 10, everywhere: true, player: null, timer: null, guard: null, host: null };

let peerReady = null;
function loadPeerJs() {
  if (peerReady) return peerReady;
  peerReady = new Promise((resolve, reject) => {
    if (window.Peer) return resolve(window.Peer);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js';
    s.onload = () => resolve(window.Peer);
    s.onerror = () => reject(new Error('PeerJS indisponible'));
    document.head.appendChild(s);
  });
  return peerReady;
}

function mpLeave() {
  clearTimeout(mp.timer);
  clearTimeout(mp.guard);
  try { mp.player?.destroy?.(); } catch {}
  try { mp.peer?.destroy(); } catch {}
  Object.assign(mp, { peer: null, conns: new Map(), role: null, players: new Map(), round: null, player: null, host: null });
}
const mpCode = () => Array.from({ length: 5 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('');
const mpLink = (code) => `${location.origin}${location.pathname}#/blindtest/partie/${code}`;
const mpBoard = () => [...mp.players.values()].sort((a, b) => b.score - a.score).map((p) => ({ name: p.name, score: p.score }));
function mpSendAll(msg) {
  for (const c of mp.conns.values()) if (c.open) c.send(msg);
  mpOnMessage(msg); // l'hôte joue aussi : il applique ses propres messages
}

/* --- Écrans --- */
function mpShell(inner) {
  setMode('music');
  $view.innerHTML = `<section class="blind mp">${inner}</section>`;
}
function renderMpHost() {
  mpLeave();
  document.title = 'Blind test à plusieurs · Les années milléniales';
  mpShell(`
    <div class="hero" style="grid-template-columns:1fr;margin:10px 0 0">
      <div><h1>Blind test <em>à plusieurs</em></h1>
      <p>Crée une partie, envoie le lien à tes amis : chacun répond sur son téléphone. Le plus rapide gagne l'or 🥇 (5 pts), puis l'argent 🥈 (4) et le bronze 🥉 (3). Ensuite : 2 points pour le titre, 1 pour l'artiste.</p></div>
    </div>
    <div class="panel blind__panel">
      <form class="search" id="mp-host-form" autocomplete="off">
        <label class="skip" for="mp-name">Ton pseudo</label>
        <input id="mp-name" maxlength="20" placeholder="Ton pseudo" value="${esc(store.get('mpName', ''))}" required>
        <button class="gel gel--zap" type="submit">Créer la partie</button>
      </form>
      <label class="check"><input type="checkbox" id="mp-everywhere" checked> La musique joue sur le téléphone de chaque joueur (décoche si vous êtes tous dans la même pièce : seul l'écran de l'hôte joue)</label>
      <p class="muted">Réglages repris du blind test solo : ${bt.duration} s d'extrait, difficulté ${BT_LEVELS[bt.level][0].toLowerCase()}${bt.genre ? `, ${GENRES[bt.genre]}` : ''}${bt.year ? `, ${bt.year}` : ''}, ${bt.rounds} manches. <a href="#/blindtest">Changer</a></p>
    </div>`);
  document.getElementById('mp-host-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('mp-name').value.trim().slice(0, 20);
    if (!name) return;
    store.set('mpName', name);
    mp.everywhere = document.getElementById('mp-everywhere').checked;
    await mpCreate(name);
  });
}

async function mpCreate(name, attempt = 0) {
  let Peer;
  try { Peer = await loadPeerJs(); } catch { return mpError('Impossible de charger le module de jeu en réseau. Vérifie ta connexion.'); }
  mp.role = 'host';
  mp.name = name;
  mp.code = mpCode();
  mp.players = new Map([[name, { name, score: 0 }]]);
  mp.peer = new Peer(MP_PREFIX + mp.code);
  mp.peer.on('error', (err) => {
    if (err.type === 'unavailable-id' && attempt < 3) { mp.peer.destroy(); return mpCreate(name, attempt + 1); }
    if (err.type !== 'peer-unavailable') mpError(`Problème de connexion (${err.type}).`);
  });
  mp.peer.on('open', () => renderMpLobby());
  mp.peer.on('connection', (conn) => {
    conn.on('data', (msg) => mpHostReceive(conn, msg));
    conn.on('close', () => {
      mp.conns.delete(conn.peer);
      mpBroadcastLobby();
    });
  });
}

function renderMpLobby() {
  const isHost = mp.role === 'host';
  const players = isHost ? [...mp.players.keys()] : mp.lobby || [];
  mpShell(`
    <div class="blind__bar"><span>Partie <b class="mp-code">${esc(mp.code)}</b></span><span>${players.length} joueur${players.length > 1 ? 's' : ''}</span></div>
    <div class="panel blind__panel">
      ${isHost ? `
        <p><b>Invite tes amis</b> avec ce lien (ou le code <b>${esc(mp.code)}</b>) :</p>
        <div class="search"><input id="mp-link" readonly value="${esc(mpLink(mp.code))}"><button class="gel" type="button" id="mp-copy">📋 Copier</button></div>
        ${navigator.share ? '<div class="actions"><button class="gel gel--ghost gel--small" type="button" id="mp-share">📤 Partager</button></div>' : ''}` : '<p>Tu es dans la partie ! On attend que l\'hôte lance le premier tube…</p>'}
      <div class="mp-players">${players.map((n) => `<span class="tag">${n === mp.name ? '⭐ ' : ''}${esc(n)}</span>`).join('')}</div>
      ${isHost ? `<div class="actions"><button class="gel gel--zap" type="button" id="mp-go" ${players.length < 1 ? 'disabled' : ''}>🎧 Lancer la partie</button></div>` : ''}
    </div>`);
  if (!isHost) return;
  document.getElementById('mp-copy').addEventListener('click', async () => {
    const input = document.getElementById('mp-link');
    try { await navigator.clipboard.writeText(input.value); } catch { input.select(); document.execCommand('copy'); }
    document.getElementById('mp-copy').textContent = '✅ Copié';
  });
  document.getElementById('mp-share')?.addEventListener('click', () => navigator.share({ title: 'Blind test des années 2000', text: `Rejoins ma partie de blind test (code ${mp.code})`, url: mpLink(mp.code) }).catch(() => {}));
  document.getElementById('mp-go').addEventListener('click', mpStartGame);
}
function mpBroadcastLobby() {
  if (mp.role !== 'host') return;
  const msg = { t: 'lobby', code: mp.code, players: [...mp.players.keys()] };
  for (const c of mp.conns.values()) if (c.open) c.send(msg);
  if (!mp.round) renderMpLobby();
}

function renderMpJoin(code) {
  mpLeave();
  document.title = 'Rejoindre un blind test · Les années milléniales';
  mpShell(`
    <div class="hero" style="grid-template-columns:1fr;margin:10px 0 0">
      <div><h1>Rejoindre la partie <em>${esc(code)}</em></h1><p>Choisis un pseudo, puis attends que l'hôte lance le premier tube.</p></div>
    </div>
    <div class="panel blind__panel">
      <form class="search" id="mp-join-form" autocomplete="off">
        <label class="skip" for="mp-jname">Ton pseudo</label>
        <input id="mp-jname" maxlength="20" placeholder="Ton pseudo" value="${esc(store.get('mpName', ''))}" required>
        <button class="gel gel--zap" type="submit">Rejoindre</button>
      </form>
      <p class="muted" id="mp-join-status"></p>
    </div>`);
  document.getElementById('mp-join-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('mp-jname').value.trim().slice(0, 20);
    if (!name) return;
    store.set('mpName', name);
    document.getElementById('mp-join-status').textContent = 'Connexion…';
    // Débloque le son sur mobile pendant le geste de l'utilisateur.
    loadYouTubeApi();
    let Peer;
    try { Peer = await loadPeerJs(); } catch { return mpError('Impossible de charger le module de jeu en réseau.'); }
    mp.role = 'player';
    mp.name = name;
    mp.code = code.toUpperCase();
    mp.peer = new Peer();
    mp.peer.on('error', (err) => mpError(err.type === 'peer-unavailable' ? 'Cette partie n\'existe pas ou est terminée.' : `Problème de connexion (${err.type}).`));
    mp.peer.on('open', () => {
      const conn = mp.peer.connect(MP_PREFIX + mp.code, { reliable: true });
      mp.host = conn;
      conn.on('open', () => conn.send({ t: 'hello', name }));
      conn.on('data', mpOnMessage);
      conn.on('close', () => mpError('La partie est terminée (l\'hôte s\'est déconnecté).'));
    });
  });
}
function mpError(text) {
  mpShell(`<div class="panel empty">${esc(text)}<div class="actions" style="justify-content:center"><a class="gel" href="#/blindtest">Retour au blind test</a></div></div>`);
}

/* --- Logique de l'hôte --- */
function mpHostReceive(conn, msg) {
  if (msg.t === 'hello') {
    let name = String(msg.name || 'Joueur').slice(0, 20);
    // Même pseudo qu'un joueur déjà connecté : on ajoute un numéro (une reconnexion garde ses points).
    const taken = [...mp.conns.values()].some((c) => c.mpName === name && c.open && c !== conn);
    if (taken || name === mp.name) name = `${name} ${mp.players.size + 1}`;
    conn.mpName = name;
    mp.conns.set(conn.peer, conn);
    if (!mp.players.has(name)) mp.players.set(name, { name, score: 0 });
    conn.send({ t: 'welcome', name, code: mp.code, everywhere: mp.everywhere });
    mpBroadcastLobby();
    if (mp.round && !mp.round.revealed) conn.send(mpRoundMsg());
  } else if (msg.t === 'guess') {
    mpJudge(conn.mpName, String(msg.text || ''), conn);
  }
}
function mpStartGame() {
  const pool = blindPool();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  Object.assign(mp, { queue: pool, qi: 0, n: 0, total: bt.rounds });
  for (const p of mp.players.values()) p.score = 0;
  mpNextRound();
}
function mpNextRound() {
  if (mp.n >= mp.total) return mpSendAll({ t: 'end', board: mpBoard() });
  while (mp.qi < mp.queue.length && !clipOf(mp.queue[mp.qi])) mp.qi += 1;
  if (mp.qi >= mp.queue.length) return mpSendAll({ t: 'end', board: mpBoard() });
  const h = mp.queue[mp.qi];
  mp.n += 1;
  mp.round = { h, found: [], revealed: false, id: Date.now() };
  mpSendAll(mpRoundMsg());
}
const mpRoundMsg = () => ({ t: 'round', n: mp.n, total: mp.total, videoId: clipOf(mp.round.h).youtubeId, duration: bt.duration, everywhere: mp.everywhere, id: mp.round.id });
// Le clip de l'hôte ne se lit pas : on change de tube, même manche.
function mpSwapSong() {
  if (mp.role !== 'host' || !mp.round || mp.round.revealed) return;
  const c = clipOf(mp.round.h);
  if (c) bt.broken.add(c.youtubeId);
  // Les points gagnés sur le tube en panne sont annulés : la manche repart à zéro avec un autre tube.
  for (const f of mp.round.found) {
    const p = mp.players.get(f.name);
    if (p) p.score -= f.pts;
  }
  mp.qi += 1;
  mp.n -= 1;
  mpNextRound();
}
function mpJudge(name, text, conn) {
  const r = mp.round;
  if (!r || r.revealed || !mp.players.has(name)) return;
  if (r.found.some((f) => f.name === name)) return;
  const title = titleMatches(text, r.h.title);
  const artist = !title && (artistMatches(text, mainArtistOf(r.h.artist)) || artistMatches(text, r.h.artist));
  const reply = (m) => (conn ? conn.send(m) : mpOnMessage(m));
  if (!title && !artist) return reply({ t: 'judge', ok: false });
  const rank = r.found.length;
  const pts = rank < 3 ? MP_POINTS[rank] : title ? 2 : 1;
  r.found.push({ name, kind: title ? 'titre' : 'artiste', pts, medal: MEDALS[rank] || '' });
  mp.players.get(name).score += pts;
  reply({ t: 'judge', ok: true, kind: title ? 'titre' : 'artiste', pts, medal: MEDALS[rank] || '' });
  mpSendAll({ t: 'found', list: r.found.map(({ name: n, medal }) => ({ name: n, medal })) });
}
function mpReveal() {
  const r = mp.round;
  if (!r || r.revealed) return;
  r.revealed = true;
  const h = r.h;
  mp.qi += 1;
  mpSendAll({ t: 'reveal', title: h.title, artist: h.artist, year: h.year, hitId: h.id, gains: r.found, board: mpBoard(), last: mp.n >= mp.total });
}

/* --- Ce que tout le monde voit (hôte compris) --- */
function mpOnMessage(msg) {
  if (msg.t === 'welcome') {
    mp.name = msg.name;
    mp.everywhere = msg.everywhere;
    renderMpLobby();
  } else if (msg.t === 'lobby') {
    mp.lobby = msg.players;
    mp.code = msg.code;
    if (!mp.round) renderMpLobby();
  } else if (msg.t === 'round') {
    renderMpRound(msg);
  } else if (msg.t === 'more') {
    mpListen(msg.seconds, false);
  } else if (msg.t === 'judge') {
    const box = document.getElementById('mp-feedback');
    if (!box) return;
    if (msg.ok) {
      box.innerHTML = `${msg.medal || '✅'} Bien joué : bon ${msg.kind} ! +${msg.pts} point${msg.pts > 1 ? 's' : ''}`;
      document.getElementById('mp-form').hidden = true;
    } else {
      box.textContent = '😅 Raté, essaie encore !';
      const g = document.getElementById('mp-guess');
      if (g) { g.value = ''; g.focus(); }
    }
  } else if (msg.t === 'found') {
    const box = document.getElementById('mp-found');
    if (box) box.innerHTML = msg.list.length ? `Ont trouvé : ${msg.list.map((f) => `<span class="tag">${f.medal} ${esc(f.name)}</span>`).join(' ')}` : '';
  } else if (msg.t === 'reveal') {
    renderMpReveal(msg);
  } else if (msg.t === 'end') {
    renderMpEnd(msg.board);
  }
}

function renderMpRound(msg) {
  clearTimeout(mp.timer);
  clearTimeout(mp.guard);
  const isHost = mp.role === 'host';
  const playsHere = isHost || msg.everywhere;
  mp.round = isHost ? mp.round : { id: msg.id };
  mpShell(`
    <div class="blind__bar"><span>Manche ${msg.n} / ${msg.total}</span><span>Partie ${esc(mp.code)}</span></div>
    <div class="tv tv--wide">
      <div class="tv__screen is-playing" id="mp-screen">
        <div id="mp-player"></div>
        <div class="blind__cover" id="mp-cover"><span class="noise"></span><span class="blind__q">?</span><span class="blind__count" id="mp-count">${playsHere ? 'Chargement…' : 'Écoute l\'écran de l\'hôte !'}</span></div>
      </div>
      <span class="tv__brand">MILLÉNIALES</span><span class="tv__knobs" aria-hidden="true"><i></i><i></i></span>
    </div>
    <div class="panel blind__panel">
      ${playsHere ? '<div class="actions"><button class="gel gel--zap" type="button" id="mp-play" hidden>▶ Écouter</button></div>' : ''}
      <form class="search" id="mp-form" autocomplete="off">
        <label class="skip" for="mp-guess">Ta réponse</label>
        <input id="mp-guess" type="search" placeholder="Le titre ou l'artiste…">
        <button class="gel" type="submit">Valider</button>
      </form>
      <p class="blind__verdict" id="mp-feedback"></p>
      <p id="mp-found" class="mp-found"></p>
      ${isHost ? `<div class="actions mp-host-actions">
        <button class="gel gel--lime" type="button" id="mp-more">⏩ 10 secondes de plus pour tous</button>
        <button class="gel gel--ghost" type="button" id="mp-reveal">👀 Révéler la réponse</button>
      </div>` : '<p class="muted">L\'hôte décide quand on ajoute 10 secondes ou quand on révèle la réponse.</p>'}
    </div>`);
  document.getElementById('mp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('mp-guess').value.trim();
    if (!text) return;
    if (isHost) mpJudge(mp.name, text, null);
    else mp.host?.send({ t: 'guess', text });
  });
  document.getElementById('mp-guess').focus();
  if (isHost) {
    document.getElementById('mp-more').addEventListener('click', () => mpSendAll({ t: 'more', seconds: 10 }));
    document.getElementById('mp-reveal').addEventListener('click', mpReveal);
  }
  if (playsHere) mpPlay(msg.videoId, msg.duration);
}

// Lecteur de l'extrait (même principe que le solo : image cachée, compte à rebours, pause).
let mpPending = 0;
function mpListen(seconds, fromStart) {
  if (!mp.player?.playVideo) return;
  mpPending = seconds;
  if (fromStart) mp.player.seekTo(0, true);
  mp.player.playVideo();
}
async function mpPlay(videoId, duration) {
  const YT = await loadYouTubeApi();
  const status = (t) => { const el = document.getElementById('mp-count'); if (el) el.textContent = t; };
  let playing = false;
  let ready = false;
  mpPending = duration;
  try { mp.player?.destroy?.(); } catch {}
  const countdown = (sec) => {
    clearTimeout(mp.timer);
    let left = sec;
    status(`${left}`);
    const tick = () => {
      left -= 1;
      if (left <= 0) { mp.player?.pauseVideo?.(); status('À vous !'); }
      else { status(`${left}`); mp.timer = setTimeout(tick, 1000); }
    };
    mp.timer = setTimeout(tick, 1000);
  };
  const failed = () => {
    if (mp.role === 'host') { status('Extrait indisponible, on change de tube…'); setTimeout(mpSwapSong, 800); }
    else status('Pas de son ici : écoute l\'écran de l\'hôte !');
  };
  mp.player = new YT.Player('mp-player', {
    videoId,
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, start: 0 },
    events: {
      onReady: (e) => {
        ready = true;
        e.target.playVideo();
        mp.guard = setTimeout(() => {
          if (playing) return;
          status('Appuie sur ▶ pour écouter');
          const b = document.getElementById('mp-play');
          if (b) {
            b.hidden = false;
            b.onclick = () => { b.hidden = true; mpListen(mpPending || duration, true); };
          }
        }, 4000);
      },
      onStateChange: (e) => {
        if (e.data !== YT.PlayerState.PLAYING) return;
        playing = true;
        clearTimeout(mp.guard);
        document.getElementById('mp-play')?.setAttribute('hidden', '');
        if (mpPending) { countdown(mpPending); mpPending = 0; }
      },
      onError: failed,
    },
  });
  setTimeout(() => { if (!ready) failed(); }, 12000);
}

function mpBoardHTML(board, gains = []) {
  const won = new Map(gains.map((g) => [g.name, g]));
  return `<ol class="mp-board">${board.map((p, i) => {
    const g = won.get(p.name);
    return `<li class="${p.name === mp.name ? 'is-me' : ''}"><span class="mp-rank">${i + 1}</span><b>${esc(p.name)}</b>${g ? `<span class="mp-gain">${g.medal} +${g.pts}</span>` : ''}<span class="mp-score">${p.score} pt${p.score > 1 ? 's' : ''}</span></li>`;
  }).join('')}</ol>`;
}
function renderMpReveal(msg) {
  clearTimeout(mp.timer);
  clearTimeout(mp.guard);
  if (mp.round) mp.round.revealedLocal = true;
  document.getElementById('mp-cover')?.classList.add('is-gone');
  mp.player?.playVideo?.();
  const isHost = mp.role === 'host';
  const panel = document.querySelector('.mp .blind__panel');
  if (!panel) return;
  panel.innerHTML = `
    <p class="show__artist">${esc(msg.artist)}</p>
    <h2 class="show__title" style="font-size:clamp(22px,4vw,34px);margin:0">${esc(msg.title)}</h2>
    <p class="muted">${msg.year} · <a href="#/m/${encodeURIComponent(msg.hitId)}" target="_blank">fiche du tube</a></p>
    <h3 class="row-title" style="margin:10px 0 0">Classement</h3>
    ${mpBoardHTML(msg.board, msg.gains)}
    ${isHost ? `<div class="actions"><button class="gel gel--zap" type="button" id="mp-next">${msg.last ? '🏁 Voir le podium' : 'Tube suivant →'}</button></div>` : '<p class="muted">L\'hôte lance le tube suivant…</p>'}`;
  document.getElementById('mp-next')?.addEventListener('click', () => {
    try { mp.player?.stopVideo?.(); } catch {}
    mpNextRound();
  });
}
function renderMpEnd(board) {
  try { mp.player?.destroy?.(); } catch {}
  mp.player = null;
  const isHost = mp.role === 'host';
  const podium = board.slice(0, 3);
  mpShell(`
    <div class="hero" style="grid-template-columns:1fr;margin:10px 0 0"><div><h1>Le <em>podium</em> 🏆</h1></div></div>
    <div class="mp-podium">${podium.map((p, i) => `<div class="mp-step mp-step--${i + 1}"><span>${MEDALS[i]}</span><b>${esc(p.name)}</b><small>${p.score} pts</small></div>`).join('')}</div>
    <div class="panel blind__panel">
      ${mpBoardHTML(board)}
      ${isHost ? '<div class="actions"><button class="gel gel--zap" type="button" id="mp-again">🔁 Rejouer avec les mêmes joueurs</button></div>' : '<p class="muted">Merci d\'avoir joué ! L\'hôte peut relancer une partie.</p>'}
    </div>`);
  document.getElementById('mp-again')?.addEventListener('click', () => { mp.round = null; mpStartGame(); });
}

/* ---------- Routeur ---------- */
function setMode(mode) {
  document.body.dataset.mode = mode;
  const frise = document.getElementById('nav-frise');
  frise.href = mode === 'music' ? '#/musique/frise' : '#/tv/frise';
  frise.hidden = mode === 'home';
  document.getElementById('nav-tv').setAttribute('aria-current', String(mode === 'tv'));
  document.getElementById('nav-music').setAttribute('aria-current', String(mode === 'music' && !location.hash.startsWith('#/blindtest')));
  document.getElementById('nav-blind').setAttribute('aria-current', String(location.hash.startsWith('#/blindtest')));
  document.getElementById('nav-music').setAttribute('aria-current', String(mode === 'music' && !location.hash.startsWith('#/blindtest')));
}

function route() {
  // On quitte une partie de blind test : on coupe le son.
  clearTimeout(bt.timer);
  try { bt.player?.destroy?.(); } catch {}
  bt.player = null;
  mpLeave();
  const hash = location.hash.slice(1) || '/';
  let m;
  if ((m = hash.match(/^\/e\/(.+)$/))) { setMode('tv'); renderShow(decodeURIComponent(m[1])); }
  else if ((m = hash.match(/^\/m\/(.+)$/))) renderHit(decodeURIComponent(m[1]));
  else if (hash === '/tv/frise' || hash === '/frise') { setMode('tv'); renderTimeline(); }
  else if (hash === '/tv') { setMode('tv'); renderHome(); }
  else if (hash === '/musique/frise') renderMusicTimeline();
  else if (hash === '/blindtest') renderBlindSetup();
  else if (hash === '/blindtest/hote') renderMpHost();
  else if ((m = hash.match(/^\/blindtest\/partie\/([A-Za-z0-9]{4,8})$/))) renderMpJoin(m[1]);
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
