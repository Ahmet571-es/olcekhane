import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { taskTrial } from '@/lib/assessment/schemas';
import { AssessmentError, saveTaskBlock } from '@/lib/assessment/service';
import { guardAttempt, jsonError } from '@/lib/api-guard';
import { rateLimit } from '@/lib/rate-limit';

/** Bir bilişsel görevin bütün denemeleri tek istekte gelir; doğruluk sunucuda yeniden hesaplanır. */
const body = z.object({
  block: z.string().min(1).max(40),
  trials: z.array(taskTrial).min(1).max(400),
});

export async function POST(req: NextRequest, ctx: RouteContext<'/api/attempts/[id]/task'>) {
  const { id } = await ctx.params;
  const g = await guardAttempt(req, id);
  if ('error' in g) return g.error;
  if (!(await rateLimit(`gorev:${id}`, 60, 600))) return jsonError(429, 'Çok hızlı istek gönderildi.');
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    await saveTaskBlock(id, parsed.data.block, parsed.data.trials);
  } catch (err) {
    if (err instanceof AssessmentError) return jsonError(err.code === 'not_in_progress' ? 409 : 400, err.message);
    throw err;
  }
  return NextResponse.json({ ok: true });
}
