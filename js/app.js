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
const KIND_LABEL = { episode: 'Épisode complet', extrait: 'Extrait', generique: 'Générique', 'générique': 'Générique', 'best-of': 'Best-of' };

const state = { q: '', cat: '', channel: '', year: 0, sort: 'fame', withVideo: false, limit: PAGE };
let SHOWS = [];
let BY_ID = new Map();

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
  const [main, extras] = await Promise.all([
    fetch('data/shows.json').then((r) => r.json()),
    fetch('data/extras.json').then((r) => r.json()).catch(() => ({})),
  ]);
  SHOWS = main.shows.map((s) => ({ ...s, ...(extras[s.id] || {}), _q: fold(`${s.title} ${(s.hosts || []).join(' ')} ${s.channels.join(' ')}`) }));
  BY_ID = new Map(SHOWS.map((s) => [s.id, s]));
}

/* ---------- Cartes ---------- */
function card(s) {
  const [c1, c2] = CHANNEL_COLORS[s.channels[0]] || DEFAULT_COLORS;
  const vids = s.videos?.length || 0;
  const img = vids ? `<img src="${thumb(s.videos[0].youtubeId)}" alt="" loading="lazy">` : `<span class="card__initials" aria-hidden="true">${esc(initials(s.title))}</span>`;
  return `<a class="card" href="#/e/${encodeURIComponent(s.id)}">
    <div class="card__screen" style="--c1:${c1};--c2:${c2}">
      ${img}
      ${s.channels[0] ? `<span class="card__bug">${esc(s.channels[0])}</span>` : ''}
      ${s.culte ? '<span class="card__culte">CULTE</span>' : ''}
      ${vids ? `<span class="card__badge">▶ ${vids} replay${vids > 1 ? 's' : ''}</span>` : ''}
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
  document.title = "Années 2000 · La télé qu'on regardait";
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
function tvBox(s, wide = false) {
  if (!s) return '';
  const v = s.videos?.[0];
  const screen = v
    ? posterHTML(v)
    : `<span class="noise"></span><a class="tv__msg" href="#/e/${encodeURIComponent(s.id)}" style="text-decoration:none">${esc(s.title)}<br>▶ ${esc(s.channels[0] || 'Télé')}</a>`;
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
function renderShow(id) {
  const s = BY_ID.get(id);
  if (!s) {
    $view.innerHTML = `<div class="panel empty" style="margin-top:30px">Cette émission n'est pas (encore) au programme. <a href="#/">Retour au catalogue</a></div>`;
    return;
  }
  document.title = `${s.title} · Années 2000`;
  store.set('recent', [s.id, ...store.get('recent', []).filter((x) => x !== s.id)].slice(0, 12));

  const vids = s.videos || [];
  const related = SHOWS.filter((o) => o.id !== s.id && o.category === s.category && o.channels[0] === s.channels[0])
    .sort((a, b) => b.score - a.score).slice(0, 8);

  $view.innerHTML = `
    <a class="back" href="#/">← Retour au catalogue</a>
    <article class="show">
      <div>
        ${tvBox(s, true)}
        ${vids.length > 1 ? `<div class="playlist"><h3>Replays (${vids.length})</h3>${vids.map((v, i) => `
          <button class="pl-item" type="button" data-video="${esc(v.youtubeId)}" aria-current="${i === 0}">
            <img src="${thumb(v.youtubeId)}" alt="" loading="lazy">
            <span><small>${esc(KIND_LABEL[v.kind] || v.kind || 'Vidéo')}${v.year ? ' · ' + v.year : ''}</small><b>${esc(v.title || s.title)}</b></span>
          </button>`).join('')}</div>` : ''}
        <div class="actions">
          <a class="gel gel--zap" href="${ytSearch(s)}" target="_blank" rel="noopener">🔎 Chercher sur YouTube</a>
          ${s.playlistId ? `<a class="gel" href="https://www.youtube.com/playlist?list=${encodeURIComponent(s.playlistId)}" target="_blank" rel="noopener">▶ Playlist complète</a>` : ''}
        </div>
        ${!vids.length ? '<p class="muted">Pas encore de replay sélectionné pour cette émission : le bouton ci-dessus lance la recherche sur YouTube.</p>' : ''}
      </div>
      <div>
        <h1 class="show__title">${esc(s.title)}</h1>
        <div class="tags">
          <a class="tag tag--cat" href="#/" data-filter-cat="${esc(s.category)}">${esc(CATEGORIES[s.category] || s.category)}</a>
          ${s.culte ? '<span class="tag" style="background:var(--gold);color:#3a2400;border-color:transparent">★ Culte</span>' : ''}
          ${s.channels.map((c) => `<a class="tag" href="#/" data-filter-ch="${esc(c)}">${esc(c)}</a>`).join('')}
        </div>
        <div class="panel facts">
          <dl>
            <dt>Diffusion</dt><dd>${esc(years(s)) || 'n.c.'}</dd>
            ${s.channels.length ? `<dt>Chaîne${s.channels.length > 1 ? 's' : ''}</dt><dd>${esc(s.channels.join(', '))}</dd>` : ''}
            ${s.hosts?.length ? `<dt>Présentation</dt><dd>${esc(s.hosts.join(', '))}</dd>` : ''}
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
    ${related.length ? `<h2 class="row-title">Dans le même genre</h2><div class="strip">${related.map(card).join('')}</div>` : ''}`;

  bindPosters($view);
  $view.querySelectorAll('[data-video]').forEach((b) => b.addEventListener('click', () => {
    $view.querySelectorAll('[data-video]').forEach((x) => x.setAttribute('aria-current', String(x === b)));
    play(document.getElementById('tv-screen'), b.dataset.video);
    document.getElementById('tv-screen').scrollIntoView({ block: 'center', behavior: 'smooth' });
  }));
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

/* ---------- Routeur ---------- */
function route() {
  const hash = location.hash.slice(1) || '/';
  const m = hash.match(/^\/e\/(.+)$/);
  if (m) renderShow(decodeURIComponent(m[1]));
  else if (hash === '/frise') renderTimeline();
  else renderHome();
  window.scrollTo(0, 0);
}

document.getElementById('zap').addEventListener('click', () => {
  const pool = SHOWS.filter((s) => s.videos?.length).length > 20 ? SHOWS.filter((s) => s.videos?.length) : SHOWS.filter((s) => s.fame <= 2);
  const s = pool[Math.floor(Math.random() * pool.length)];
  if (s) location.hash = `#/e/${s.id}`;
});

window.addEventListener('hashchange', route);
load().then(route).catch((e) => {
  console.error(e);
  $view.innerHTML = '<div class="panel empty" style="margin-top:30px">Impossible de charger le catalogue. Ouvrez le site via un serveur web (voir README).</div>';
});
