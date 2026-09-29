'use server';

import { and, eq, inArray, isNull, like } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { contactMessages, orgInvites, organizations, recoveryCodes, sessions, students, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { requireAdmin } from '@/lib/auth/dal';
import { revokePendingLogins } from '@/lib/auth/two-factor';
import { retryEmail, sendEmail } from '@/lib/email/send';
import { twoFactorChangedTemplate } from '@/lib/email/templates';
import { appUrl } from '@/lib/request';
import { runPurgeJob } from '@/lib/jobs/purge';
import { sendInvite } from '@/lib/school/invites';
import { slugifyTr } from '@/lib/slug';
import { isUuid } from '@/lib/uuid';

export type AdminFormState = { ok?: boolean; message?: string; errors?: Record<string, string>; values?: Record<string, string> };

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of error.issues) out[String(i.path[0] ?? 'form')] ??= i.message;
  return out;
}

const emailField = z.email('Geçerli bir e-posta adresi yazın.').max(200).transform((v) => v.trim().toLowerCase());
const roleField = z.enum(['org_admin', 'counselor', 'teacher'], { message: 'Görevi seçin.' });
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `En fazla ${max} karakter.`)
    .optional()
    .transform((v) => (v ? v : null));

const orgSchema = z.object({
  name: z.string().trim().min(3, 'Okulun adını yazın.').max(120, 'En fazla 120 karakter.'),
  city: optionalText(60),
  district: optionalText(60),
  email: emailField,
  role: z.enum(['org_admin', 'counselor'], { message: 'İlk kişinin görevini seçin.' }),
});

/** Okul adından benzersiz bir kısa ad üretir (ör. ataturk-ortaokulu, ataturk-ortaokulu-2). */
async function uniqueSlug(name: string): Promise<string> {
  const base = slugifyTr(name).slice(0, 60).replace(/-+$/g, '') || 'okul';
  const taken = new Set(
    (await db.select({ slug: organizations.slug }).from(organizations).where(like(organizations.slug, `${base}%`))).map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function createOrgAction(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { name: raw.name ?? '', city: raw.city ?? '', district: raw.district ?? '', email: raw.email ?? '', role: raw.role ?? '' };
  const parsed = orgSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const d = parsed.data;
  const slug = await uniqueSlug(d.name);
  const [org] = await db
    .insert(organizations)
    .values({ name: d.name, slug, city: d.city, district: d.district, kind: 'school' })
    .returning({ id: organizations.id });
  await sendInvite({ orgId: org.id, orgName: d.name, email: d.email, role: d.role, inviterId: admin.id, inviterName: 'Ölçekhane' });
  await audit({ actorUserId: admin.id, action: 'org.create', entity: 'organization', entityId: org.id, meta: { slug, invited: d.email, role: d.role } });
  redirect(`/yonetim/okullar/${org.id}?yeni=1`);
}

export async function adminInviteAction(orgId: string, _: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  if (!isUuid(orgId)) return { message: 'Okul bulunamadı.' };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { email: raw.email ?? '', role: raw.role ?? '' };
  const parsed = z.object({ email: emailField, role: roleField }).safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const [org] = await db.select({ id: organizations.id, name: organizations.name }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
  if (!org) return { message: 'Okul bulunamadı.' };
  await sendInvite({ orgId: org.id, orgName: org.name, email: parsed.data.email, role: parsed.data.role, inviterId: admin.id, inviterName: 'Ölçekhane' });
  await audit({ actorUserId: admin.id, action: 'org.invite', entity: 'organization', entityId: org.id, meta: { email: parsed.data.email, role: parsed.data.role, by: 'platform' } });
  revalidatePath(`/yonetim/okullar/${orgId}`);
  return { ok: true, message: `${parsed.data.email} adresine davet gönderildi.`, values: { email: '', role: '' } };
}

export async function adminRevokeInviteAction(orgId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get('inviteId') ?? '');
  if (!isUuid(orgId) || !isUuid(id)) redirect('/yonetim/okullar');
  await db
    .update(orgInvites)
    .set({ revokedAt: new Date() })
    .where(and(eq(orgInvites.id, id), eq(orgInvites.orgId, orgId), isNull(orgInvites.acceptedAt)));
  await audit({ actorUserId: admin.id, action: 'org.invite_revoke', entity: 'organization', entityId: orgId, meta: { inviteId: id, by: 'platform' } });
  revalidatePath(`/yonetim/okullar/${orgId}`);
}

const settingsSchema = z.object({
  name: z.string().trim().min(3, 'Okulun adını yazın.').max(120, 'En fazla 120 karakter.'),
  city: optionalText(60),
  district: optionalText(60),
  minGroupSize: z.coerce.number().int('Tam sayı yazın.').min(5, 'En az 5 olabilir.').max(30, 'En fazla 30 olabilir.'),
});

export async function updateOrgAction(orgId: string, _: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  if (!isUuid(orgId)) return { message: 'Okul bulunamadı.' };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { name: raw.name ?? '', city: raw.city ?? '', district: raw.district ?? '', minGroupSize: raw.minGroupSize ?? '' };
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const [org] = await db.select({ settings: organizations.settings }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
  if (!org) return { message: 'Okul bulunamadı.' };
  await db
    .update(organizations)
    .set({
      name: parsed.data.name,
      city: parsed.data.city,
      district: parsed.data.district,
      settings: { ...org.settings, minGroupSize: parsed.data.minGroupSize },
    })
    .where(eq(organizations.id, orgId));
  await audit({ actorUserId: admin.id, action: 'org.update', entity: 'organization', entityId: orgId, meta: { minGroupSize: parsed.data.minGroupSize } });
  revalidatePath(`/yonetim/okullar/${orgId}`);
  return { ok: true, message: 'Okul bilgileri kaydedildi.', values };
}

export async function setOrgActiveAction(orgId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!isUuid(orgId)) redirect('/yonetim/okullar');
  const active = formData.get('active') === '1';
  await db.update(organizations).set({ isActive: active }).where(eq(organizations.id, orgId));
  if (!active) {
    // Açık öğrenci oturumları da kapanır; ekip üyeleri okul sayfalarına zaten erişemez.
    await db.delete(sessions).where(inArray(sessions.studentId, db.select({ id: students.id }).from(students).where(eq(students.orgId, orgId))));
  }
  await audit({ actorUserId: admin.id, action: active ? 'org.activate' : 'org.deactivate', entity: 'organization', entityId: orgId });
  revalidatePath(`/yonetim/okullar/${orgId}`);
  revalidatePath('/yonetim/okullar');
}

export async function setMessageHandledAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get('messageId') ?? '');
  if (!isUuid(id)) redirect('/yonetim/mesajlar');
  const handled = formData.get('handled') === '1';
  await db.update(contactMessages).set({ handledAt: handled ? new Date() : null }).where(eq(contactMessages.id, id));
  await audit({ actorUserId: admin.id, action: handled ? 'contact.handled' : 'contact.reopen', entity: 'contact_message', entityId: id });
  revalidatePath('/yonetim/mesajlar');
}

export async function retryEmailAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get('emailId') ?? '');
  if (!isUuid(id)) redirect('/yonetim/eposta');
  const result = await retryEmail(id);
  await audit({ actorUserId: admin.id, action: 'email.retry', entity: 'email', entityId: id, meta: { result } });
  revalidatePath('/yonetim/eposta');
  redirect(`/yonetim/eposta?deneme=${result}`);
}

/** Günlük temizlik görevini hemen çalıştırır (zamanlayıcıyı beklemeden). */
export async function runPurgeAction(): Promise<void> {
  const admin = await requireAdmin();
  const report = await runPurgeJob('yönetici');
  await audit({ actorUserId: admin.id, action: 'job.purge_manual', entity: 'job', entityId: 'temizlik', meta: report ?? { skipped: 1 } });
  revalidatePath('/yonetim');
  redirect(`/yonetim?temizlik=${report ? 'tamam' : 'mesgul'}#temizlik`);
}

/**
 * Telefonunu ve kurtarma kodlarını kaybeden kullanıcı için: iki aşamalı doğrulama sıfırlanır, bütün
 * oturumları kapatılır ve kullanıcıya e-postayla bildirilir. Zorunlu görevdeki kullanıcı bir sonraki
 * girişinde yeniden kurar. Kimliği doğrulandıktan sonra (ör. okulun resmî yazısı) yapılmalıdır.
 */
export async function resetTwoFactorAction(userId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!isUuid(userId)) redirect('/yonetim/kullanicilar');
  const [u] = await db
    .select({ email: users.email, fullName: users.fullName, enabledAt: users.totpEnabledAt })
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1);
  if (!u) redirect('/yonetim/kullanicilar');
  const back = `/yonetim/kullanicilar?e=${encodeURIComponent(u.email)}`;
  if (userId === admin.id) redirect(`${back}&hata=kendi`);
  if (formData.get('confirm') !== 'on') redirect(`${back}&hata=onay`);
  await db.transaction(async (tx) => {
    await tx.update(users).set({ totpSecret: null, totpEnabledAt: null, totpLastStep: null }).where(eq(users.id, userId));
    await tx.delete(recoveryCodes).where(eq(recoveryCodes.userId, userId));
    // Oturumlarla birlikte bekleyen kurulumlar da gider; kodu henüz girilmemiş girişler de geçersiz olur.
    await tx.delete(sessions).where(eq(sessions.userId, userId));
    await revokePendingLogins(userId, tx);
  });
  await audit({ actorUserId: admin.id, action: 'user.2fa_reset_by_admin', entity: 'user', entityId: userId, meta: { reason: String(formData.get('reason') ?? '').slice(0, 300) } });
  await sendEmail({ to: u.email, ...twoFactorChangedTemplate({ name: u.fullName, change: 'reset', link: appUrl('/hesap/iki-asamali') }) });
  redirect(`${back}&sifirlandi=1`);
}
