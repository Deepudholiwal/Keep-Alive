'use client';
import { useEffect, useState, useCallback } from 'react';

const ago = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m + ' min ago'; };

export default function Home() {
  const [data, setData] = useState({ interval: 10, locked: false, sites: [] });
  const [url, setUrl] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    const r = await fetch('/api/sites', { cache: 'no-store' });
    setData(await r.json());
  }, []);

  useEffect(() => { load(); const i = setInterval(load, 30000); return () => clearInterval(i); }, [load]);

  async function call(path, method, body) {
    setErr('');
    const r = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: body && JSON.stringify(body),
    });
    if (!r.ok) setErr((await r.json()).error);
    await load();
    return r.ok;
  }

  async function add(e) {
    e.preventDefault();
    if (await call('/api/sites', 'POST', { url })) setUrl('');
  }

  return (
    <main>
      <h1><span className="pulse" />Keep-alive</h1>
      <p className="sub">Add your Render URLs. Each one gets a request every {data.interval} minutes so it stays awake.</p>
      <form onSubmit={add}>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-app.onrender.com" required aria-label="Website URL" />
        <button>Add site</button>
      </form>
      {data.locked && <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Admin password" aria-label="Admin password" style={{ width: '100%', marginBottom: 8 }} />}
      <div className="err">{err}</div>
      <div className="tools">
        <span>{data.sites.length} {data.sites.length === 1 ? 'site' : 'sites'} monitored</span>
        <button className="ghost" onClick={() => call('/api/ping-now', 'POST')}>Ping all now</button>
      </div>
      {data.sites.length === 0 && <div className="empty">No sites yet. Add your first URL above.</div>}
      {data.sites.map(s => {
        const h = s.history, last = h[0];
        const rate = h.length ? Math.round(h.filter(x => x.ok).length / h.length * 100) : 0;
        return (
          <div className="site" key={s.id}>
            <div className="top">
              <span className="url">{s.url}</span>
              <button className="ghost" onClick={() => call('/api/sites/' + s.id, 'DELETE')}>Remove</button>
            </div>
            <div className="meta">
              {last ? `${last.ok ? 'Awake' : 'Not responding'} · status ${last.status || 'none'} · ${last.ms} ms · checked ${ago(last.t)} · ${rate}% success` : 'First ping running…'}
            </div>
            <div className="bars">
              {h.slice(0, 30).reverse().map((x, i) => <i key={i} className={x.ok ? '' : 'bad'} title={String(x.status || x.error)} />)}
            </div>
          </div>
        );
      })}
    </main>
  );
}
