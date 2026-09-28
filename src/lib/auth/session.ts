import 'server-only';
import { and, eq, gt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { db } from '@/db';
import { sessions, students, users } from '@/db/schema';
import { clientIp, userAgent } from '@/lib/request';
import { hashToken, randomToken } from './tokens';

export const SESSION_COOKIE = 'olc_oturum';
const USER_SESSION_DAYS = 30;
const STUDENT_SESSION_HOURS = 8;

function cookieSecure(): boolean {
  if (process.env.SESSION_COOKIE_SECURE === 'false') return false;
  return process.env.NODE_ENV === 'production';
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function createUserSession(userId: string): Promise<void> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + USER_SESSION_DAYS * 86400_000);
  await db.insert(sessions).values({
    tokenHash: hashToken(token),
    kind: 'user',
    userId,
    expiresAt,
    ip: await clientIp(),
    userAgent: await userAgent(),
  });
  await setSessionCookie(token, expiresAt);
}

export async function createStudentSession(studentId: string): Promise<void> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + STUDENT_SESSION_HOURS * 3600_000);
  await db.insert(sessions).values({
    tokenHash: hashToken(token),
    kind: 'student',
    studentId,
    expiresAt,
    ip: await clientIp(),
    userAgent: await userAgent(),
  });
  await setSessionCookie(token, expiresAt);
}

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'parent' | 'staff' | 'admin';
  emailVerified: boolean;
};

export type SessionStudent = { id: string; firstName: string; grade: number; orgId: string | null };

export type CurrentSession =
  | { kind: 'user'; sessionId: string; user: SessionUser }
  | { kind: 'student'; sessionId: string; student: SessionStudent };

/**
 * Geçerli oturum. Aynı istek içinde tekrar sorgulanmaması için React `cache` ile saklanır.
 * Yalnızca gerekli alanlar döndürülür (şifre özeti asla dışarı çıkmaz).
 */
export const getSession = cache(async (): Promise<CurrentSession | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const tokenHash = hashToken(token);
  const now = new Date();

  const [row] = await db
    .select({
      id: sessions.id,
      kind: sessions.kind,
      lastSeenAt: sessions.lastSeenAt,
      userId: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      emailVerifiedAt: users.emailVerifiedAt,
      userDeletedAt: users.deletedAt,
      studentId: students.id,
      studentFirstName: students.firstName,
      studentGrade: students.grade,
      studentOrgId: students.orgId,
      studentDeletedAt: students.deletedAt,
    })
    .from(sessions)
    .leftJoin(users, eq(users.id, sessions.userId))
    .leftJoin(students, eq(students.id, sessions.studentId))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .limit(1);

  if (!row) return null;

  // Son görülme zamanını en fazla saatte bir güncelle.
  if (now.getTime() - row.lastSeenAt.getTime() > 3600_000) {
    await db.update(sessions).set({ lastSeenAt: now }).where(eq(sessions.id, row.id));
  }

  if (row.kind === 'user' && row.userId && !row.userDeletedAt) {
    return {
      kind: 'user',
      sessionId: row.id,
      user: {
        id: row.userId,
        email: row.email!,
        fullName: row.fullName!,
        role: row.role!,
        emailVerified: !!row.emailVerifiedAt,
      },
    };
  }
  if (row.kind === 'student' && row.studentId && !row.studentDeletedAt) {
    return {
      kind: 'student',
      sessionId: row.id,
      student: {
        id: row.studentId,
        firstName: row.studentFirstName!,
        grade: row.studentGrade!,
        orgId: row.studentOrgId,
      },
    };
  }
  return null;
});

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

/** Şifre değişince kullanıcının diğer tüm oturumlarını kapatır. */
export async function destroyAllUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
