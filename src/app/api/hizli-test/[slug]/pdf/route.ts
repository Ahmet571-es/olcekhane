import type { NextRequest } from 'next/server';
import { quickPdfResponse } from '@/lib/assessment/quick-http';

/** Hızlı testin PDF raporu: aynı cevaplardan bellekte üretilir ve doğrudan indirilir. */
export async function POST(req: NextRequest, ctx: RouteContext<'/api/hizli-test/[slug]/pdf'>) {
  const { slug } = await ctx.params;
  return quickPdfResponse(req, slug);
}
