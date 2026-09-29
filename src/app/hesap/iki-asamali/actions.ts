'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { recoveryCodes, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { safeNextPath } from '@/lib/auth/next-path';
import { verifyPassword } from '@/lib/auth/password';
import { destroyOtherUserSessions, getSession } from '@/lib/auth/session';
import { newTotpSecret } from '@/lib/auth/totp';
import { replaceRecoveryCodes, sealSecret, twoFactorRequired, verifyPendingCode, verifySecondFactor } from '@/lib/auth/two-factor';
import { sendEmail } from '@/lib/email/send';
import { twoFactorChangedTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl } from '@/lib/request';

export type TwoFactorState = { ok?: boolean; message?: string; errors?: Record<string, string>; codes?: string[] };

const PAGE = '/hesap/iki-asamali';

async function userSession() {
  const s = await getSession();
  if (s?.kind !== 'user') redirect(`/giris?sonra=${encodeURIComponent(PAGE)}`);
  return s;
}

/** Sayfaya dönerken zorunluluk notu ve dönüş adresi korunur. */
function back(formData: FormData, extra = ''): string {
  const params = new URLSearchParams();
  if (formData.get('zorunlu') === '1') params.set('zorunlu', '1');
  const next = safeNextPath(formData.get('sonra'));
  if (next) params.set('sonra', next);
  if (extra) for (const [k, v] of new URLSearchParams(extra)) params.set(k, v);
  const q = params.toString();
  return q ? `${PAGE}?${q}` : PAGE;
}

async function notify(userId: string, change: 'enabled' | 'disabled' | 'reset' | 'codes') {
  const [u] = await db.select({ email: users.email, fullName: users.fullName }).from(users).where(eq(users.id, userId)).limit(1);
  if (u) await sendEmail({ to: u.email, ...twoFactorChangedTemplate({ name: u.fullName, change, link: appUrl(PAGE) }) });
}

/** Kurulumu başlatır: yeni bir sır üretilir ve kod doğrulanana kadar bekler (var olan kurulum bozulmaz). */
export async function startSetupAction(formData: FormData): Promise<void> {
  const s = await userSession();
  if (!(await rateLimit(`iki-asama-kurulum:${s.user.id}`, 20, 3600))) redirect(back(formData, 'hata=cok-deneme'));
  await db.update(users).set({ totpPendingSecret: sealSecret(newTotpSecret()) }).where(eq(users.id, s.user.id));
  redirect(back(formData));
}

export async function cancelSetupAction(formData: FormData): Promise<void> {
  const s = await userSession();
  await db.update(users).set({ totpPendingSecret: null }).where(eq(users.id, s.user.id));
  redirect(back(formData));
}

/**
 * Kurulumu tamamlar: uygulamadaki kod bekleyen sırla doğrulanır, sır etkinleşir, yeni kurtarma kodları
 * üretilir (yalnızca bu yanıtta gösterilir) ve bu cihaz dışındaki oturumlar kapatılır.
 */
export async function confirmSetupAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  if (!(await rateLimit(`iki-asama-onay:${s.user.id}`, 10, 900))) return { message: 'Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.' };
  const [u] = await db.select({ pending: users.totpPendingSecret, enabledAt: users.totpEnabledAt }).from(users).where(eq(users.id, s.user.id)).limit(1);
  if (!u?.pending) return { message: 'Kurulum bulunamadı. Sayfayı yenileyip yeniden başlatın.' };
  const code = String(formData.get('code') ?? '');
  const step = verifyPendingCode(u.pending, code);
  if (step === null) return { errors: { code: 'Kod doğru değil. Uygulamadaki güncel 6 haneli kodu yazın; telefonunuzun saati otomatik ayarlı olmalı.' } };
  const updated = await db
    .update(users)
    .set({ totpSecret: u.pending, totpPendingSecret: null, totpEnabledAt: new Date(), totpLastStep: step })
    .where(and(eq(users.id, s.user.id), eq(users.totpPendingSecret, u.pending)))
    .returning({ id: users.id });
  if (updated.length === 0) return { message: 'Kurulum başka bir pencerede değişti. Sayfayı yenileyin.' };
  const codes = await replaceRecoveryCodes(s.user.id);
  await destroyOtherUserSessions(s.user.id, s.sessionId);
  await audit({ actorUserId: s.user.id, action: u.enabledAt ? 'user.2fa_moved' : 'user.2fa_enable', entity: 'user', entityId: s.user.id });
  await notify(s.user.id, 'enabled');
  // Sayfa yeniden çizilmez: kurtarma kodları yalnızca bu yanıtta, formun yerinde gösterilir; sayfa
  // yenilenseydi form kaybolur ve kodlar görülemezdi.
  return { ok: true, codes };
}

/** Kurtarma kodlarını yeniler (uygulamadaki güncel kodla). */
export async function regenerateCodesAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  if (!(await rateLimit(`iki-asama-onay:${s.user.id}`, 10, 900))) return { message: 'Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.' };
  const code = String(formData.get('code') ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code) || (await verifySecondFactor(s.user.id, code)) !== 'totp') {
    return { errors: { code: 'Kod doğru değil. Kimlik doğrulama uygulamanızdaki güncel kodu yazın.' } };
  }
  const codes = await replaceRecoveryCodes(s.user.id);
  await audit({ actorUserId: s.user.id, action: 'user.2fa_codes', entity: 'user', entityId: s.user.id });
  await notify(s.user.id, 'codes');
  return { ok: true, codes };
}

/** İki aşamalı doğrulamayı kapatır (şifre ve güncel kodla); zorunlu olan hesaplarda kapatılamaz. */
export async function disableAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  if (await twoFactorRequired(s.user)) {
    return { message: 'Göreviniz gereği iki aşamalı doğrulama kapatılamaz. Telefonunuzu değiştirdiyseniz yeni cihaza taşıyın.' };
  }
  if (!(await rateLimit(`iki-asama-onay:${s.user.id}`, 10, 900))) return { message: 'Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.' };
  const [u] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, s.user.id)).limit(1);
  const password = String(formData.get('password') ?? '');
  if (!u || !(await verifyPassword(u.passwordHash, password))) return { errors: { password: 'Şifreniz hatalı.' } };
  const code = String(formData.get('code') ?? '');
  if (!(await verifySecondFactor(s.user.id, code))) return { errors: { code: 'Kod doğru değil.' } };
  await db
    .update(users)
    .set({ totpSecret: null, totpPendingSecret: null, totpEnabledAt: null, totpLastStep: null })
    .where(eq(users.id, s.user.id));
  await db.delete(recoveryCodes).where(eq(recoveryCodes.userId, s.user.id));
  await audit({ actorUserId: s.user.id, action: 'user.2fa_disable', entity: 'user', entityId: s.user.id });
  await notify(s.user.id, 'disabled');
  redirect(`${PAGE}?kapatildi=1`);
}
