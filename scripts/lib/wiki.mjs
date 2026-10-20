// Petit client pour l'API Wikipédia FR : cache disque, débit limité, reprise sur 429.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const HOSTS = {
  wikipedia: 'https://fr.wikipedia.org/w/api.php',
  wikidata: 'https://www.wikidata.org/w/api.php',
};
const UA = 'annee2000-catalog/0.1 (https://github.com/mindyourbiz9000/annee2000)';
const CACHE_DIR = new URL('../../data/cache/', import.meta.url).pathname;
const MIN_INTERVAL_MS = 400;

let last = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function api({ __host = 'wikipedia', ...params }) {
  const API = HOSTS[__host];
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const key = createHash('sha1').update(API + qs.toString()).digest('hex');
  const file = join(CACHE_DIR, key + '.json');
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {}

  for (let attempt = 0; attempt < 12; attempt++) {
    const wait = last + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    last = Date.now();
    const res = await fetch(`${API}?${qs}`, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) {
      const backoff = Math.min(60000, 2000 * 2 ** attempt);
      process.stderr.write(`  ${res.status}, nouvelle tentative dans ${backoff / 1000}s\n`);
      await sleep(backoff);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} pour ${qs}`);
    const data = await res.json();
    // Serveur de recherche surchargé ou limitation de débit : on patiente et on réessaie.
    if (data.error && /busy|ratelimit|maxlag|too many/i.test(`${data.error.code} ${data.error.info}`)) {
      const backoff = Math.min(60000, 3000 * 2 ** attempt);
      process.stderr.write(`  ${data.error.code}, nouvelle tentative dans ${backoff / 1000}s\n`);
      await sleep(backoff);
      continue;
    }
    if (data.error) throw new Error(`API: ${data.error.info}`);
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(file, JSON.stringify(data));
    return data;
  }
  throw new Error(`Échec après plusieurs tentatives: ${qs}`);
}

// Parcourt toutes les pages d'une requête qui renvoie "continue".
export async function apiAll(params, pick) {
  const out = [];
  let cont = {};
  do {
    const data = await api({ ...params, ...cont });
    out.push(...(pick(data) || []));
    cont = data.continue || null;
  } while (cont);
  return out;
}

export async function categoryMembers(title, cmtype = 'page|subcat') {
  return apiAll(
    { action: 'query', list: 'categorymembers', cmtitle: title, cmlimit: 'max', cmtype },
    (d) => d.query?.categorymembers,
  );
}
