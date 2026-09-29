import type { NextRequest } from 'next/server';
import { reportResponse } from '@/lib/assessment/http';

/** Testin cevapları puanlanır, öğrenci ve veli raporu döner. Hiçbir şey kaydedilmez. */
export async function POST(req: NextRequest, ctx: RouteContext<'/api/rapor/[slug]'>) {
  const { slug } = await ctx.params;
  return reportResponse(req, slug);
}
