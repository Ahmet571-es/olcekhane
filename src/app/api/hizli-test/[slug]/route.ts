import type { NextRequest } from 'next/server';
import { quickReportResponse } from '@/lib/assessment/quick-http';

/** Hızlı test: cevaplar puanlanır, basit rapor döner. Hiçbir şey kaydedilmez. */
export async function POST(req: NextRequest, ctx: RouteContext<'/api/hizli-test/[slug]'>) {
  const { slug } = await ctx.params;
  return quickReportResponse(req, slug);
}
