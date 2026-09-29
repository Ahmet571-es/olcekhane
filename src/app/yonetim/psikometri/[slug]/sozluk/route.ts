import { getSession } from '@/lib/auth/session';
import { codebookCsv } from '@/lib/psychometrics/export';

/** Değişken sözlüğü: madde metinleri, ters maddeler ve cevap anahtarları (yalnızca platform yöneticisi). */
export async function GET(req: Request, ctx: RouteContext<'/yonetim/psikometri/[slug]/sozluk'>) {
  const s = await getSession();
  if (s?.kind !== 'user' || s.user.role !== 'admin') return new Response('Bulunamadı', { status: 404 });
  const { slug } = await ctx.params;
  const csv = await codebookCsv(slug, { excel: new URL(req.url).searchParams.get('bicim') === 'excel' });
  if (!csv) return new Response('Bulunamadı', { status: 404 });
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="olcekhane-${slug}-degisken-sozlugu.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
