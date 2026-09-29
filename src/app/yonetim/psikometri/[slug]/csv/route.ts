import { audit } from '@/lib/audit';
import { getSession } from '@/lib/auth/session';
import { researchCsv } from '@/lib/psychometrics/export';

/** Araştırma verisi (yalnızca platform yöneticisi). Her indirme denetim kaydına yazılır. */
export async function GET(req: Request, ctx: RouteContext<'/yonetim/psikometri/[slug]/csv'>) {
  const s = await getSession();
  if (s?.kind !== 'user' || s.user.role !== 'admin' || !s.user.twoFactor) return new Response('Bulunamadı', { status: 404 });
  const { slug } = await ctx.params;
  const out = await researchCsv(slug, { excel: new URL(req.url).searchParams.get('bicim') === 'excel' });
  if (!out) return new Response('Bulunamadı', { status: 404 });
  await audit({ actorUserId: s.user.id, action: 'research.export', entity: 'instrument', entityId: slug, meta: { n: out.n } });
  const day = new Date().toISOString().slice(0, 10);
  return new Response(out.csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="olcekhane-${slug}-${day}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
