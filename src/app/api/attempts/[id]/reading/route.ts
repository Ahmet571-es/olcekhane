import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { AssessmentError, completeReadingAttempt } from '@/lib/assessment/service';
import { guardAttempt, jsonError } from '@/lib/api-guard';
import { audit } from '@/lib/audit';

const body = z.object({
  passageKey: z.string().min(1).max(40),
  readingMs: z.number().min(0).max(3_600_000),
  answers: z.record(z.string().max(10), z.string().max(4)),
});

export async function POST(req: NextRequest, ctx: RouteContext<'/api/attempts/[id]/reading'>) {
  const { id } = await ctx.params;
  const g = await guardAttempt(req, id);
  if ('error' in g) return g.error;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    await completeReadingAttempt(id, parsed.data);
  } catch (err) {
    if (err instanceof AssessmentError) return jsonError(400, err.message);
    throw err;
  }
  await audit({
    actorUserId: g.session.kind === 'user' ? g.session.user.id : null,
    actorStudentId: g.session.kind === 'student' ? g.session.student.id : null,
    action: 'attempt.complete',
    entity: 'attempt',
    entityId: id,
  });
  return NextResponse.json({ ok: true });
}
