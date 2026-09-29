'use server';

import { and, eq, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { recoveryCodes, sessions, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { safeNextPath } from '@/lib/auth/next-path';
import { verifyPassword } from '@/lib/auth/password';
import { getSession } from '@/lib/auth/session';
import { newTotpSecret } from '@/lib/auth/totp';
import {
  attemptSecondFactor,
  recoveryCodeUsed,
  replaceRecoveryCodes,
  revokePendingLogins,
  sealSecret,
  secondFactorAttemptAllowed,
  twoFactorRequired,
  verifyPendingCode,
  verifySecondFactor,
} from '@/lib/auth/two-factor';
import { sendEmail } from '@/lib/email/send';
import { twoFactorChangedTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl, clientIpBucket } from '@/lib/request';

export type TwoFactorState = { ok?: boolean; message?: string; errors?: Record<string, string>; codes?: string[] };

const PAGE = '/hesap/iki-asamali';
const TOO_MANY = 'Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.';

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

async function notify(userId: string, change: 'enabled' | 'moved' | 'disabled' | 'codes') {
  const [u] = await db.select({ email: users.email, fullName: users.fullName }).from(users).where(eq(users.id, userId)).limit(1);
  if (u) await sendEmail({ to: u.email, ...twoFactorChangedTemplate({ name: u.fullName, change, link: appUrl(PAGE) }) });
}

/**
 * Kurulumu (ya da yeni cihaza taşımayı) başlatır. Şifre istenir; iki aşamalı doğrulama zaten açıksa
 * güncel kod ya da bir kurtarma kodu da istenir. Yeni sır yalnızca bu oturuma bağlanır: aynı şifreyi
 * bilen biri başka bir oturumdan bu sırrı göremez, kurulumu da tamamlayamaz. Var olan kurulum, yeni
 * cihazda kod doğrulanana kadar geçerli kalır.
 */
export async function startSetupAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  if (!(await rateLimit(`iki-asama-kurulum:${s.user.id}`, 20, 3600))) return { message: 'Kısa sürede çok fazla işlem yapıldı. Biraz sonra tekrar deneyin.' };
  const [u] = await db
    .select({ passwordHash: users.passwordHash, enabledAt: users.totpEnabledAt })
    .from(users)
    .where(eq(users.id, s.user.id))
    .limit(1);
  if (!u) redirect('/giris');
  const password = String(formData.get('password') ?? '');
  if (!password || !(await verifyPassword(u.passwordHash, password))) return { errors: { password: 'Şifreniz hatalı.' } };
  if (u.enabledAt) {
    if (!(await secondFactorAttemptAllowed(s.user.id))) return { message: TOO_MANY };
    if (!(await verifySecondFactor(s.user.id, String(formData.get('code') ?? '')))) {
      return { errors: { code: 'Kod doğru değil. Şu anki cihazınızdaki kodu ya da bir kurtarma kodunu yazın.' } };
    }
  }
  await db.update(sessions).set({ totpPendingSecret: sealSecret(newTotpSecret()) }).where(eq(sessions.id, s.sessionId));
  redirect(back(formData));
}

export async function cancelSetupAction(formData: FormData): Promise<void> {
  const s = await userSession();
  await db.update(sessions).set({ totpPendingSecret: null }).where(eq(sessions.id, s.sessionId));
  redirect(back(formData));
}

/**
 * Kurulumu tamamlar: uygulamadaki kod bu oturumun bekleyen sırrıyla doğrulanır. Tek bir işlemde sır
 * etkinleşir, bu oturum iki aşamalı sayılır, yeni kurtarma kodları üretilir (yalnızca bu yanıtta
 * gösterilir), diğer oturumlar kapanır ve kodu girilmemiş bekleyen girişler geçersiz olur.
 */
export async function confirmSetupAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  if (!(await rateLimit(`iki-asama-onay:${s.user.id}`, 10, 900))) return { message: TOO_MANY };
  const [row] = await db.select({ pending: sessions.totpPendingSecret }).from(sessions).where(eq(sessions.id, s.sessionId)).limit(1);
  const pending = row?.pending;
  if (!pending) return { message: 'Kurulum bulunamadı. Sayfayı yenileyip yeniden başlatın.' };
  const step = verifyPendingCode(pending, String(formData.get('code') ?? ''));
  if (step === null) return { errors: { code: 'Kod doğru değil. Uygulamadaki güncel 6 haneli kodu yazın; telefonunuzun saati otomatik ayarlı olmalı.' } };

  const result = await db.transaction(async (tx) => {
    const now = new Date();
    // Bekleyen sır hâlâ bu oturumdaysa kurulum üstlenilir (iki pencereden aynı anda onaylanamaz).
    const [claimed] = await tx
      .update(sessions)
      .set({ totpPendingSecret: null, twoFactorAt: now })
      .where(and(eq(sessions.id, s.sessionId), eq(sessions.totpPendingSecret, pending)))
      .returning({ id: sessions.id });
    if (!claimed) return null;
    const [before] = await tx.select({ enabledAt: users.totpEnabledAt }).from(users).where(eq(users.id, s.user.id)).for('update');
    await tx.update(users).set({ totpSecret: pending, totpEnabledAt: now, totpLastStep: step }).where(eq(users.id, s.user.id));
    const codes = await replaceRecoveryCodes(s.user.id, tx);
    await tx.delete(sessions).where(and(eq(sessions.userId, s.user.id), ne(sessions.id, s.sessionId)));
    await revokePendingLogins(s.user.id, tx);
    return { codes, moved: !!before?.enabledAt };
  });
  if (!result) return { message: 'Kurulum başka bir pencerede değişti. Sayfayı yenileyin.' };
  await audit({ actorUserId: s.user.id, action: result.moved ? 'user.2fa_moved' : 'user.2fa_enable', entity: 'user', entityId: s.user.id });
  await notify(s.user.id, result.moved ? 'moved' : 'enabled');
  // Sayfa yeniden çizilmez: kurtarma kodları yalnızca bu yanıtta, formun yerinde gösterilir; sayfa
  // yenilenseydi form kaybolur ve kodlar görülemezdi.
  return { ok: true, codes: result.codes };
}

/**
 * Kodla doğrulanmamış bir oturumu doğrular (ör. iki aşamalı doğrulama bu oturum açıkken başka bir
 * yerde kuruldu). Girişin ikinci adımıyla aynı sınırlar uygulanır.
 */
export async function verifySessionAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  const next = safeNextPath(formData.get('sonra'));
  if (!s.user.twoFactorEnabled || s.user.twoFactor) redirect(next ?? PAGE);
  const code = String(formData.get('code') ?? '').trim();
  if (!code) return { errors: { code: 'Kodu yazın.' } };
  const attempt = await attemptSecondFactor(s.user.id, s.user.email, code, await clientIpBucket());
  if (!attempt.ok) return attempt.codeError ? { errors: { code: attempt.codeError } } : { message: attempt.message };
  await db.update(sessions).set({ twoFactorAt: new Date() }).where(eq(sessions.id, s.sessionId));
  await audit({ actorUserId: s.user.id, action: 'user.2fa_session_verified', entity: 'user', entityId: s.user.id, meta: { method: attempt.method } });
  if (attempt.method === 'recovery') {
    const left = await recoveryCodeUsed(s.user.id, s.user.email);
    redirect(`${PAGE}?kurtarma=${left}`);
  }
  redirect(next ?? PAGE);
}

/** Kurtarma kodlarını yeniler (uygulamadaki güncel kodla). */
export async function regenerateCodesAction(_: TwoFactorState, formData: FormData): Promise<TwoFactorState> {
  const s = await userSession();
  if (!(await rateLimit(`iki-asama-onay:${s.user.id}`, 10, 900)) || !(await secondFactorAttemptAllowed(s.user.id))) return { message: TOO_MANY };
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
  if (!(await rateLimit(`iki-asama-onay:${s.user.id}`, 10, 900)) || !(await secondFactorAttemptAllowed(s.user.id))) return { message: TOO_MANY };
  const [u] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, s.user.id)).limit(1);
  const password = String(formData.get('password') ?? '');
  if (!u || !(await verifyPassword(u.passwordHash, password))) return { errors: { password: 'Şifreniz hatalı.' } };
  const code = String(formData.get('code') ?? '');
  if (!(await verifySecondFactor(s.user.id, code))) return { errors: { code: 'Kod doğru değil.' } };
  await db.transaction(async (tx) => {
    await tx.update(users).set({ totpSecret: null, totpEnabledAt: null, totpLastStep: null }).where(eq(users.id, s.user.id));
    await tx.delete(recoveryCodes).where(eq(recoveryCodes.userId, s.user.id));
    await tx.update(sessions).set({ totpPendingSecret: null, twoFactorAt: null }).where(eq(sessions.userId, s.user.id));
    await revokePendingLogins(s.user.id, tx);
  });
  await audit({ actorUserId: s.user.id, action: 'user.2fa_disable', entity: 'user', entityId: s.user.id });
  await notify(s.user.id, 'disabled');
  redirect(`${PAGE}?kapatildi=1`);
}
