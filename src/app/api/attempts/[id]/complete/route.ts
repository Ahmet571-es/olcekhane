import { NextResponse, type NextRequest } from 'next/server';
import { AssessmentError, completeAttempt } from '@/lib/assessment/service';
import { guardAttempt, jsonError } from '@/lib/api-guard';
import { audit } from '@/lib/audit';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/attempts/[id]/complete'>) {
  const { id } = await ctx.params;
  const g = await guardAttempt(req, id);
  if ('error' in g) return g.error;
  try {
    await completeAttempt(id);
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
