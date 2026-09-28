import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data.json');
const g = globalThis;

function init() {
  if (g.__ka) return g.__ka;
  let sites = [];
  try { sites = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch {}
  (process.env.SITES || '').split(',').map(s => s.trim()).filter(Boolean).forEach(url => {
    if (!sites.find(s => s.url === url)) sites.push({ id: String(Date.now() + Math.random()), url, history: [] });
  });
  g.__ka = { sites, timer: null, interval: Number(process.env.INTERVAL_MIN || 10) };
  return g.__ka;
}

const save = () => { try { fs.writeFileSync(FILE, JSON.stringify(init().sites)); } catch {} };
export const getState = () => init();

export async function ping(site) {
  const start = Date.now();
  let e;
  try {
    const res = await fetch(site.url, { cache: 'no-store', signal: AbortSignal.timeout(60000), headers: { 'User-Agent': 'nextjs-keepalive/1.0' } });
    e = { t: Date.now(), ok: res.status < 500, status: res.status, ms: Date.now() - start };
  } catch (err) {
    e = { t: Date.now(), ok: false, status: 0, ms: Date.now() - start, error: err.message };
  }
  site.history.unshift(e);
  site.history = site.history.slice(0, 50);
  save();
}

export const pingAll = () => Promise.all(init().sites.map(ping));

export function addSite(url) {
  const st = init();
  const site = { id: String(Date.now()), url, history: [] };
  st.sites.push(site);
  save();
  return site;
}

export function removeSite(id) {
  const st = init();
  st.sites = st.sites.filter(s => s.id !== id);
  save();
}

export function startPinger() {
  const st = init();
  if (st.timer) return;
  setTimeout(pingAll, 5000);
  st.timer = setInterval(pingAll, st.interval * 60 * 1000);
  console.log(`[keepalive] pinging every ${st.interval} min`);
}
