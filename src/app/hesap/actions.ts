'use server';

import { and, count, eq, inArray, isNull, ne, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { attempts, authTokens, classTeachers, emailOutbox, guardianships, memberships, organizations, sessions, students, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { checkPasswordPolicy, hashPassword, verifyPassword } from '@/lib/auth/password';
import { SESSION_COOKIE, getSession } from '@/lib/auth/session';
import { randomToken } from '@/lib/auth/tokens';
import { hasActiveConsent, revokeConsent } from '@/lib/consent';
import { sendEmail } from '@/lib/email/send';
import { accountClosedTemplate, passwordChangedTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl } from '@/lib/request';

export type AccountFormState = { ok?: boolean; message?: string; errors?: Record<string, string>; values?: Record<string, string> };

async function userSession() {
  const s = await getSession();
  if (s?.kind !== 'user') redirect('/giris?sonra=/hesap');
  return s;
}

/* ---------- Ad ---------- */

const nameSchema = z.string().trim().min(3, 'Adınızı ve soyadınızı yazın.').max(120, 'En fazla 120 karakter.');

export async function updateNameAction(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const s = await userSession();
  const raw = String(formData.get('fullName') ?? '');
  const parsed = nameSchema.safeParse(raw);
  if (!parsed.success) return { errors: { fullName: parsed.error.issues[0].message }, values: { fullName: raw } };
  await db.update(users).set({ fullName: parsed.data }).where(eq(users.id, s.user.id));
  await audit({ actorUserId: s.user.id, action: 'user.update_name', entity: 'user', entityId: s.user.id });
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Adınız güncellendi.', values: { fullName: parsed.data } };
}

/* ---------- Şifre ---------- */

export async function changePasswordAction(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const s = await userSession();
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  const again = String(formData.get('again') ?? '');
  const errors: Record<string, string> = {};
  if (!current) errors.current = 'Şu anki şifrenizi yazın.';
  const policy = checkPasswordPolicy(next, s.user.email);
  if (policy) errors.next = policy;
  else if (next !== again) errors.again = 'Yeni şifreyi iki kez aynı yazın.';
  if (Object.keys(errors).length) return { errors };
  if (!(await rateLimit(`sifre-degistir:${s.user.id}`, 10, 3600))) {
    return { message: 'Kısa sürede çok fazla deneme yapıldı. Bir saat sonra tekrar deneyin.' };
  }
  const [u] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, s.user.id)).limit(1);
  if (!u || !(await verifyPassword(u.hash, current))) return { errors: { current: 'Şu anki şifreniz hatalı.' } };
  if (current === next) return { errors: { next: 'Yeni şifre eskisiyle aynı olamaz.' } };

  await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, s.user.id));
  // Bu cihazdaki oturum açık kalır; diğer bütün oturumlar ve bekleyen şifre yenileme bağlantıları geçersiz olur.
  await db.delete(sessions).where(and(eq(sessions.userId, s.user.id), ne(sessions.id, s.sessionId)));
  await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(authTokens.userId, s.user.id), eq(authTokens.kind, 'password_reset'), isNull(authTokens.usedAt)));
  await audit({ actorUserId: s.user.id, action: 'user.password_change', entity: 'user', entityId: s.user.id });
  await sendEmail({ to: s.user.email, ...passwordChangedTemplate(s.user.fullName, appUrl('/sifremi-unuttum')) });
  revalidatePath('/hesap');
  return { ok: true, message: 'Şifreniz değiştirildi. Diğer cihazlardaki oturumlarınız kapatıldı.' };
}

/* ---------- Oturumlar ---------- */

export async function signOutOtherSessionsAction(): Promise<void> {
  const s = await userSession();
  await db.delete(sessions).where(and(eq(sessions.userId, s.user.id), ne(sessions.id, s.sessionId)));
  await audit({ actorUserId: s.user.id, action: 'user.sessions_revoke', entity: 'user', entityId: s.user.id });
  redirect('/hesap?oturumlar=kapatildi');
}

/* ---------- Hesabı kapatma ---------- */

/**
 * Hesabı kapatır. Yalnızca bu velinin açtığı (okula bağlı olmayan ve başka velisi bulunmayan) çocuk
 * profilleri silinir; okulun eklediği öğrenci kayıtları okulda kalır, yalnızca veli bağı kaldırılır.
 * Ad ve e-posta hemen silinir; açık rıza kayıtları ispat yükümlülüğü için erişime kapalı saklanır.
 * Ölçme verilerinin kalıcı silinmesini günlük temizlik görevi 30 gün içinde yapar.
 */
export async function closeAccountAction(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const s = await userSession();
  if (s.user.role === 'admin') return { message: 'Platform yöneticisi hesabı buradan kapatılamaz.' };
  const password = String(formData.get('password') ?? '');
  const errors: Record<string, string> = {};
  if (!password) errors.password = 'Şifrenizi yazın.';
  if (formData.get('confirm') !== 'on') errors.confirm = 'Devam etmek için kutuyu işaretleyin.';
  if (Object.keys(errors).length) return { errors };
  if (!(await rateLimit(`hesap-kapat:${s.user.id}`, 5, 3600))) return { message: 'Kısa sürede çok fazla deneme yapıldı. Bir saat sonra tekrar deneyin.' };
  const [u] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, s.user.id)).limit(1);
  if (!u || !(await verifyPassword(u.hash, password))) return { errors: { password: 'Şifreniz hatalı.' } };

  // Etkin bir okulun tek yöneticisi hesabını kapatırsa okul yönetilemez hâle gelir. (Pasif okulların
  // ekip sayfası açılamadığı için onlar bu denetime girmez.)
  const adminOf = await db
    .select({ orgId: memberships.orgId, name: organizations.name })
    .from(memberships)
    .innerJoin(organizations, eq(organizations.id, memberships.orgId))
    .where(and(eq(memberships.userId, s.user.id), eq(memberships.role, 'org_admin'), eq(organizations.isActive, true), isNull(organizations.deletedAt)));
  for (const o of adminOf) {
    const [{ n }] = await db
      .select({ n: count() })
      .from(memberships)
      .where(and(eq(memberships.orgId, o.orgId), eq(memberships.role, 'org_admin')));
    if (n <= 1) {
      return { message: `${o.name} için tek okul yöneticisi sizsiniz. Hesabınızı kapatmadan önce ekip sayfasından başka birini okul yöneticisi olarak davet edin.` };
    }
  }

  // Görevler, yönetici satırları kilitlenerek silinir: aynı anda kapatılan iki yönetici hesabı etkin
  // bir okulu yöneticisiz bırakamaz.
  const blocked = await db.transaction(async (tx) => {
    for (const o of adminOf) {
      const admins = await tx.execute(sql`select id from memberships where org_id = ${o.orgId} and role = 'org_admin' for update`);
      if (admins.length <= 1) return o.name;
    }
    await tx.delete(memberships).where(eq(memberships.userId, s.user.id));
    return null;
  });
  if (blocked) {
    return { message: `${blocked} için tek okul yöneticisi sizsiniz. Hesabınızı kapatmadan önce ekip sayfasından başka birini okul yöneticisi olarak davet edin.` };
  }

  const kids = await db
    .select({ id: students.id, orgId: students.orgId })
    .from(guardianships)
    .innerJoin(students, eq(students.id, guardianships.studentId))
    .where(and(eq(guardianships.userId, s.user.id), isNull(students.deletedAt)));
  const toDelete: string[] = [];
  for (const k of kids) {
    if (k.orgId) continue;
    const [{ n }] = await db
      .select({ n: count() })
      .from(guardianships)
      .where(and(eq(guardianships.studentId, k.id), ne(guardianships.userId, s.user.id)));
    if (n === 0) toDelete.push(k.id);
  }

  const now = new Date();
  if (toDelete.length) {
    await db.update(students).set({ deletedAt: now }).where(inArray(students.id, toDelete));
    // Silinen profillerin bütün uygulamaları geçersiz sayılır; veriler günlük temizlikte silinir.
    await db
      .update(attempts)
      .set({ status: 'invalidated' })
      .where(and(inArray(attempts.studentId, toDelete), ne(attempts.status, 'invalidated')));
    for (const id of toDelete) {
      if (await hasActiveConsent(id, 'consent_assessment')) await revokeConsent(id, 'consent_assessment', s.user.id);
      if (await hasActiveConsent(id, 'consent_research')) await revokeConsent(id, 'consent_research', s.user.id);
    }
  }
  await db.delete(guardianships).where(eq(guardianships.userId, s.user.id));
  await db.delete(classTeachers).where(eq(classTeachers.userId, s.user.id));
  await db.delete(authTokens).where(eq(authTokens.userId, s.user.id));

  // Bilgilendirme e-postası, adres silinmeden önce gönderilir; ardından e-posta kayıtlarındaki adres de silinir.
  const anonEmail = `kapali-${s.user.id}@hesap.invalid`;
  const notice = await sendEmail({ to: s.user.email, ...accountClosedTemplate(s.user.fullName, toDelete.length) });
  // Gönderilemeyen kapanış bildirimi yeniden denenebilsin diye yalnızca o kayıtta adres kalır; günlük
  // temizlik görevi başarısız e-postaları belirli bir süre sonra siler.
  await db
    .update(emailOutbox)
    .set({ toEmail: anonEmail })
    .where(and(eq(emailOutbox.toEmail, s.user.email), notice.status === 'failed' ? ne(emailOutbox.id, notice.id) : undefined));
  await db
    .update(users)
    .set({
      deletedAt: now,
      email: anonEmail,
      fullName: 'Kapatılmış hesap',
      phone: null,
      emailVerifiedAt: null,
      passwordHash: await hashPassword(randomToken()),
    })
    .where(eq(users.id, s.user.id));
  await db.delete(sessions).where(eq(sessions.userId, s.user.id));
  await audit({ actorUserId: s.user.id, action: 'user.close_account', entity: 'user', entityId: s.user.id, meta: { deletedProfiles: toDelete.length } });
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete('olc_var');
  redirect('/giris?hesap=kapatildi');
}
