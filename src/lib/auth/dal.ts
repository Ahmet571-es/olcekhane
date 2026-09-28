import 'server-only';
import { and, eq, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/db';
import { guardianships, memberships, students } from '@/db/schema';
import { getSession, type SessionStudent, type SessionUser } from './session';

/** Oturum açmış yetişkin kullanıcıyı döndürür; yoksa giriş sayfasına yönlendirir. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const s = await getSession();
  if (s?.kind === 'user') return s.user;
  redirect(`/giris${next ? `?sonra=${encodeURIComponent(next)}` : ''}`);
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser('/yonetim');
  if (user.role !== 'admin') redirect('/panel');
  return user;
}

export async function optionalUser(): Promise<SessionUser | null> {
  const s = await getSession();
  return s?.kind === 'user' ? s.user : null;
}

export async function optionalStudent(): Promise<SessionStudent | null> {
  const s = await getSession();
  return s?.kind === 'student' ? s.student : null;
}

export type StudentAccess =
  | { allowed: false }
  | {
      allowed: true;
      via: 'guardian' | 'counselor' | 'admin' | 'self';
      student: { id: string; firstName: string; lastName: string | null; grade: number; orgId: string | null; birthYear: number | null };
    };

/**
 * Bir öğrencinin bireysel verilerine kimin erişebileceği:
 * - velisi (guardianships)
 * - öğrencinin okulundaki rehber öğretmen (memberships.role = counselor)
 * - platform yöneticisi (denetim kaydıyla)
 * - öğrencinin kendisi (öğrenci oturumu)
 * Öğretmen ve okul yöneticisi bireysel sonuç göremez; yalnızca grup özetlerini görür.
 */
export const studentAccess = cache(async (studentId: string): Promise<StudentAccess> => {
  const s = await getSession();
  if (!s) return { allowed: false };
  const [student] = await db
    .select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      grade: students.grade,
      orgId: students.orgId,
      birthYear: students.birthYear,
    })
    .from(students)
    .where(and(eq(students.id, studentId), isNull(students.deletedAt)))
    .limit(1);
  if (!student) return { allowed: false };

  if (s.kind === 'student') {
    return s.student.id === student.id ? { allowed: true, via: 'self', student } : { allowed: false };
  }
  const user = s.user;
  const [g] = await db
    .select({ id: guardianships.id })
    .from(guardianships)
    .where(and(eq(guardianships.studentId, studentId), eq(guardianships.userId, user.id)))
    .limit(1);
  if (g) return { allowed: true, via: 'guardian', student };

  if (student.orgId) {
    const [m] = await db
      .select({ id: memberships.id })
      .from(memberships)
      .where(
        and(eq(memberships.userId, user.id), eq(memberships.orgId, student.orgId), eq(memberships.role, 'counselor')),
      )
      .limit(1);
    if (m) return { allowed: true, via: 'counselor', student };
  }
  if (user.role === 'admin') return { allowed: true, via: 'admin', student };
  return { allowed: false };
});
