import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { AssessmentError, saveLikertAnswer } from '@/lib/assessment/service';
import { guardAttempt, jsonError } from '@/lib/api-guard';
import { rateLimit } from '@/lib/rate-limit';

const body = z.object({
  itemKey: z.string().min(1).max(40),
  value: z.number().int().min(-10).max(10),
  rtMs: z.number().min(0).max(3_600_000).nullable().optional(),
});

export async function POST(req: NextRequest, ctx: RouteContext<'/api/attempts/[id]/answer'>) {
  const { id } = await ctx.params;
  const g = await guardAttempt(req, id);
  if ('error' in g) return g.error;
  if (!(await rateLimit(`cevap:${id}`, 600, 600))) return jsonError(429, 'Çok hızlı istek gönderildi.');
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    await saveLikertAnswer(id, parsed.data.itemKey, parsed.data.value, parsed.data.rtMs ?? null);
  } catch (err) {
    if (err instanceof AssessmentError) return jsonError(err.code === 'not_in_progress' ? 409 : 400, err.message);
    throw err;
  }
  return NextResponse.json({ ok: true });
}
