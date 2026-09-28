import { removeSite } from '../../../../lib/store';
export const dynamic = 'force-dynamic';

export async function DELETE(req, { params }) {
  if (process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD)
    return Response.json({ error: 'Wrong password' }, { status: 401 });
  const { id } = await params;
  removeSite(id);
  return Response.json({ ok: true });
}
