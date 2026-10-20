// Recherche YouTube sans clé d'API : page de résultats + pages suivantes via l'API interne du site.

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const INTERVAL_MS = 1100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastRequest = 0;
async function throttle() {
  const wait = lastRequest + INTERVAL_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();
}

const parseDuration = (text = '') => text.split(':').reduce((acc, n) => acc * 60 + (+n || 0), 0);

function collect(node, out) {
  if (!node || typeof node !== 'object') return;
  if (node.videoRenderer) {
    const v = node.videoRenderer;
    out.videos.push({
      youtubeId: v.videoId,
      title: v.title?.runs?.map((r) => r.text).join('') || '',
      channelName: v.ownerText?.runs?.[0]?.text || '',
      seconds: parseDuration(v.lengthText?.simpleText),
      views: +(v.viewCountText?.simpleText || '').replace(/\D/g, '') || 0,
    });
    return;
  }
  if (node.continuationCommand?.token) out.token = node.continuationCommand.token;
  for (const k in node) collect(node[k], out);
}

let client = null;
async function searchPage(query) {
  await throttle();
  const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=fr&gl=FR`, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const key = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
  const version = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1];
  if (key && version) client = { key, version };
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  const out = { videos: [], token: null };
  if (m) collect(JSON.parse(m[1]), out);
  return out;
}

async function nextPage(token) {
  if (!client) return { videos: [], token: null };
  await throttle();
  const res = await fetch(`https://www.youtube.com/youtubei/v1/search?key=${client.key}&prettyPrint=false`, {
    method: 'POST',
    headers: { 'User-Agent': UA, 'Content-Type': 'application/json', 'Accept-Language': 'fr-FR,fr;q=0.9' },
    body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: client.version, hl: 'fr', gl: 'FR' } }, continuation: token }),
  });
  if (!res.ok) return { videos: [], token: null };
  const out = { videos: [], token: null };
  collect(await res.json(), out);
  return out;
}

export async function search(query, pages = 1) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      let page = await searchPage(query);
      const all = [...page.videos];
      for (let i = 1; i < pages && page.token; i++) {
        page = await nextPage(page.token);
        all.push(...page.videos);
      }
      return all;
    } catch {
      await sleep(5000 * 2 ** attempt);
    }
  }
  return [];
}

