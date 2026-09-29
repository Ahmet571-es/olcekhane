import 'server-only';
import { and, eq, isNull } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/db';
import { guardianships, memberships, organizations, students } from '@/db/schema';
import { accountsOpen } from '@/lib/site';
import { isUuid } from '@/lib/uuid';
import { getSession, type SessionStudent, type SessionUser } from './session';

/**
 * Veli paneli, okul paneli, öğrenci sayfası ve hesapla test çözme yalnızca hesaplar açıkken kullanılır.
 * Kapalıyken (hızlı test modu) bu sayfalar ve işlemler yokmuş gibi davranır; yöneticiler için de.
 */
export function requireAccountsOpen(): void {
  if (!accountsOpen()) notFound();
}

/**
 * Oturum açmış yetişkin kullanıcıyı döndürür; yoksa giriş sayfasına yönlendirir. İki aşamalı doğrulaması
 * açık ama bu oturumda ikinci adımı doğrulanmamış kullanıcı, oturumu doğrulama sayfasına gider.
 */
export async function requireUser(next?: string): Promise<SessionUser> {
  const s = await getSession();
  if (s?.kind === 'user') return s.user;
  const q = next ? `?sonra=${encodeURIComponent(next)}` : '';
  if (s?.kind === 'unverified') redirect(`/hesap/iki-asamali${q}`);
  redirect(`/giris${q}`);
}

/**
 * Hesabım bölümünün çerçevesi için: doğrulanmamış oturumlar da kabul edilir (oturumu doğrulama sayfası
 * bu bölümdedir). Sayfaların kendisi requireUser ile korunur.
 */
export async function requireAccountHolder(next: string): Promise<SessionUser> {
  const s = await getSession();
  if (s?.kind === 'user') return s.user;
  if (s?.kind === 'unverified') return s.unverifiedUser;
  redirect(`/giris?sonra=${encodeURIComponent(next)}`);
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser('/yonetim');
  if (user.role !== 'admin') redirect('/panel');
  // Bireysel verilere erişebildiği için iki aşamalı doğrulama zorunlu (KVKK Kurulu 2018/10).
  if (!user.twoFactor) redirect('/hesap/iki-asamali?zorunlu=1&sonra=%2Fyonetim');
  return user;
}

export async function optionalUser(): Promise<SessionUser | null> {
  const s = await getSession();
  return s?.kind === 'user' ? s.user : null;
}

/** Öğrenci oturumu (okul koduyla giriş); yoksa öğrenci girişine yönlendirir. */
export async function requireStudent(next?: string): Promise<SessionStudent> {
  const s = await getSession();
  if (s?.kind === 'student') return s.student;
  redirect(`/ogrenci-girisi${next ? `?sonra=${encodeURIComponent(next)}` : ''}`);
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
  if (!s || !isUuid(studentId)) return { allowed: false };
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
  // İkinci adımı doğrulanmamış oturum hiçbir öğrencinin verisine erişemez.
  if (s.kind !== 'user') return { allowed: false };
  const user = s.user;
  const [g] = await db
    .select({ id: guardianships.id })
    .from(guardianships)
    .where(and(eq(guardianships.studentId, studentId), eq(guardianships.userId, user.id)))
    .limit(1);
  if (g) return { allowed: true, via: 'guardian', student };

  if (student.orgId) {
    // Rehber öğretmen erişimi, okul etkin olduğu sürece geçerlidir.
    const [m] = await db
      .select({ id: memberships.id })
      .from(memberships)
      .innerJoin(organizations, eq(organizations.id, memberships.orgId))
      .where(
        and(
          eq(memberships.userId, user.id),
          eq(memberships.orgId, student.orgId),
          eq(memberships.role, 'counselor'),
          eq(organizations.isActive, true),
          isNull(organizations.deletedAt),
        ),
      )
      .limit(1);
    // Rehber öğretmen ve yönetici bireysel sonuçları yalnızca iki aşamalı doğrulamayla açılmış oturumda görür.
    if (m && user.twoFactor) return { allowed: true, via: 'counselor', student };
  }
  if (user.role === 'admin' && user.twoFactor) return { allowed: true, via: 'admin', student };
  return { allowed: false };
});
