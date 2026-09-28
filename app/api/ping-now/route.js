import { pingAll } from '../../../lib/store';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  if (process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD)
    return Response.json({ error: 'Wrong password' }, { status: 401 });
  await pingAll();
  return Response.json({ ok: true });
}
