'use server';

import { getAttempt } from '@/lib/assessment/service';
import { studentAccess } from '@/lib/auth/dal';
import { getSession } from '@/lib/auth/session';
import { hasActiveConsent, recordConsent } from '@/lib/consent';

/** Çocuğun kendi yaşına uygun bilgilendirmeyi okuduktan sonra verdiği onay. */
export async function childAssentAction(attemptId: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  const attempt = await getAttempt(attemptId);
  if (!attempt) return { ok: false };
  const access = await studentAccess(attempt.studentId);
  if (!access.allowed) return { ok: false };
  if (!(await hasActiveConsent(attempt.studentId, 'child_info'))) {
    await recordConsent({
      kind: 'child_assent',
      docKind: 'child_info',
      granted: true,
      studentId: attempt.studentId,
      actorUserId: session.kind === 'user' ? session.user.id : null,
      meta: { verilenCihaz: session.kind === 'user' ? 'veli oturumu' : 'öğrenci oturumu', attemptId },
    });
  }
  return { ok: true };
}
