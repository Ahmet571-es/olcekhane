import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { getAttempt } from '@/lib/assessment/service';
import { studentAccess } from '@/lib/auth/dal';
import { getSession } from '@/lib/auth/session';

/** Tarayıcı kaynaklı isteklerde başka bir siteden gönderilmiş istekleri reddeder. */
export function sameOrigin(req: NextRequest): boolean {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

/** Uygulamaya (attempt) yalnızca öğrencinin velisi, rehber öğretmeni ya da öğrencinin kendisi erişebilir. */
export async function guardAttempt(req: NextRequest, attemptId: string) {
  if (!sameOrigin(req)) return { error: jsonError(403, 'İstek reddedildi.') } as const;
  const session = await getSession();
  if (!session) return { error: jsonError(401, 'Oturum süresi dolmuş. Lütfen yeniden giriş yapın.') } as const;
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) return { error: jsonError(404, 'Uygulama bulunamadı.') } as const;
  const attempt = await getAttempt(attemptId);
  if (!attempt) return { error: jsonError(404, 'Uygulama bulunamadı.') } as const;
  const access = await studentAccess(attempt.studentId);
  if (!access.allowed || access.via === 'admin') return { error: jsonError(403, 'Bu uygulamaya erişiminiz yok.') } as const;
  return { attempt, access, session } as const;
}
