'use server';

import { and, count, eq, gt, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { loginAttempts, organizations, students } from '@/db/schema';
import { audit } from '@/lib/audit';
import { hashLoginCode, normalizeLoginCode } from '@/lib/auth/codes';
import { createStudentSession, destroySession } from '@/lib/auth/session';
import { clientIpBucket } from '@/lib/request';

export type StudentLoginState = { message?: string; value?: string };

/**
 * Okul öğrencisinin kodla girişi. Okulda bütün sınıf aynı IP adresinden (NAT) girdiği için IP başına
 * (IPv6’da /64) sınır cömerttir: 15 dakikada 40 hatalı kod denemesi (yetişkin şifre denemeleri
 * sayılmaz). Kod uzayı (32¹⁰ ≈ 10¹⁵) dağıtık denemelerle taranamayacak kadar büyüktür; bütün sistemde
 * 15 dakikada 20 000 hatalı denemede devreye giren geçici durdurma yalnızca olağan dışı bir saldırıda
 * işler ve birkaç adresle tetiklenemez. Hatalı denemeler kayıt altına alınır.
 */
export async function studentLoginAction(_: StudentLoginState, formData: FormData): Promise<StudentLoginState> {
  const raw = String(formData.get('code') ?? '');
  const value = raw.slice(0, 20);
  const ip = await clientIpBucket();
  const since = new Date(Date.now() - 15 * 60_000);
  const [[byIp], [all]] = await Promise.all([
    db
      .select({ n: count() })
      .from(loginAttempts)
      .where(
        and(eq(loginAttempts.ip, ip), eq(loginAttempts.key, 'ogrenci-kodu'), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since)),
      ),
    db
      .select({ n: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.key, 'ogrenci-kodu'), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since))),
  ]);
  if (byIp.n >= 40 || all.n >= 20000) {
    return { message: 'Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar dene ya da öğretmeninden yardım iste.', value };
  }
  const code = normalizeLoginCode(raw);
  if (!code) {
    await db.insert(loginAttempts).values({ key: 'ogrenci-kodu', ip, success: false });
    return { message: 'Kod 10 karakterden oluşur (ör. K7PXM-3QD2A). Kartındaki kodu kontrol et.', value };
  }
  const [student] = await db
    .select({ id: students.id })
    .from(students)
    .innerJoin(organizations, eq(organizations.id, students.orgId))
    .where(
      and(
        eq(students.loginCodeHash, hashLoginCode(code)),
        isNull(students.deletedAt),
        eq(organizations.isActive, true),
        isNull(organizations.deletedAt),
      ),
    )
    .limit(1);
  await db.insert(loginAttempts).values({ key: 'ogrenci-kodu', ip, success: !!student });
  if (!student) return { message: 'Bu kod bulunamadı. Kartındaki kodu kontrol et; sorun devam ederse öğretmenine söyle.', value };
  await createStudentSession(student.id);
  await audit({ actorStudentId: student.id, action: 'student.login', entity: 'student', entityId: student.id });
  redirect('/ogrenci');
}

export async function studentLogoutAction(): Promise<void> {
  await destroySession();
  redirect('/ogrenci-girisi');
}
