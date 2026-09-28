import { getState, addSite, ping } from '../../../lib/store';
export const dynamic = 'force-dynamic';

const locked = req => process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD;

export function GET() {
  const st = getState();
  return Response.json({ interval: st.interval, locked: !!process.env.ADMIN_PASSWORD, sites: st.sites });
}

export async function POST(req) {
  if (locked(req)) return Response.json({ error: 'Wrong password' }, { status: 401 });
  const body = await req.json();
  let url = String(body.url || '').trim();
  if (!/^https?:\/\//.test(url)) url = 'https://' + url;
  try { new URL(url); } catch { return Response.json({ error: 'Invalid URL' }, { status: 400 }); }
  if (getState().sites.find(s => s.url === url)) return Response.json({ error: 'Already added' }, { status: 400 });
  const site = addSite(url);
  await ping(site);
  return Response.json(site);
}
