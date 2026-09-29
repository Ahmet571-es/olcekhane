import type { NextRequest } from 'next/server';
import { pdfResponse } from '@/lib/assessment/http';

/** Raporun PDF'i: aynı cevaplardan bellekte üretilir ve doğrudan indirilir. Hiçbir şey kaydedilmez. */
export async function POST(req: NextRequest, ctx: RouteContext<'/api/rapor/[slug]/pdf'>) {
  const { slug } = await ctx.params;
  return pdfResponse(req, slug);
}
