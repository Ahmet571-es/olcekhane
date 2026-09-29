'use server';

import { and, count, eq, gt, isNull, ne } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { authTokens, loginAttempts, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { recordConsent } from '@/lib/consent';
import { checkPasswordPolicy, dummyVerify, hashPassword, verifyPassword } from '@/lib/auth/password';
import { createUserSession, destroyAllUserSessions, destroySession, getSession } from '@/lib/auth/session';
import { hashToken, randomToken } from '@/lib/auth/tokens';
import { attemptSecondFactor, finishSecondStep, pendingSecondStep, recoveryCodeUsed, revokePendingLogins, startSecondStep } from '@/lib/auth/two-factor';
import { sendEmail } from '@/lib/email/send';
import { passwordResetTemplate, verifyEmailTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl, clientIpBucket } from '@/lib/request';
import { homeFor, safeNextPath } from '@/lib/auth/home';
import { ACCOUNTS_CLOSED_MESSAGE, accountsOpen } from '@/lib/site';

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const HINT_COOKIE = 'olc_var';

async function setHintCookie() {
  (await cookies()).set(HINT_COOKIE, '1', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 86400,
    secure: process.env.SESSION_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production',
  });
}


function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

async function sendVerification(userId: string, email: string, name: string) {
  const token = randomToken();
  await db.insert(authTokens).values({
    kind: 'email_verify',
    tokenHash: hashToken(token),
    userId,
    email,
    expiresAt: new Date(Date.now() + 48 * 3600_000),
  });
  const t = verifyEmailTemplate(name, appUrl(`/eposta-dogrula?t=${token}`));
  await sendEmail({ to: email, ...t }, { priority: true });
}

/* ---------------- Kayıt ---------------- */

const registerSchema = z.object({
  fullName: z.string().trim().min(3, 'Adınızı ve soyadınızı yazın.').max(120, 'En fazla 120 karakter.'),
  email: z.email('Geçerli bir e-posta adresi yazın.').max(200).transform((v) => v.trim().toLowerCase()),
  password: z.string(),
  notice: z.literal('on', { message: 'Devam etmek için kutuyu işaretleyin.' }),
  adult: z.literal('on', { message: 'Veli hesabı yalnızca 18 yaşını doldurmuş kişiler için açılabilir.' }),
});

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  if (!accountsOpen()) return { message: ACCOUNTS_CLOSED_MESSAGE };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { fullName: raw.fullName ?? '', email: raw.email ?? '' };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { fullName, email, password } = parsed.data;
  const policy = checkPasswordPolicy(password, email);
  if (policy) return { errors: { password: policy }, values };

  const ip = await clientIpBucket();
  if (!(await rateLimit(`kayit:${ip}`, 10, 3600))) {
    return { message: 'Çok fazla kayıt denemesi yapıldı. Lütfen bir saat sonra tekrar deneyin.', values };
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { errors: { email: 'Bu e-posta adresiyle bir hesap var. Giriş yapmayı ya da şifrenizi yenilemeyi deneyin.' }, values };
  }

  const [user] = await db
    .insert(users)
    .values({ email, fullName, passwordHash: await hashPassword(password), role: 'parent' })
    .returning({ id: users.id });

  await recordConsent({ kind: 'notice_ack', docKind: 'privacy_notice', granted: true, actorUserId: user.id });
  await recordConsent({ kind: 'notice_ack', docKind: 'terms', granted: true, actorUserId: user.id });
  await sendVerification(user.id, email, fullName);
  await audit({ actorUserId: user.id, action: 'user.register', entity: 'user', entityId: user.id });
  await createUserSession(user.id);
  await setHintCookie();
  redirect(safeNextPath(formData.get('sonra')) ?? '/panel?hosgeldiniz=1');
}

/* ---------------- Giriş ---------------- */

const loginSchema = z.object({
  email: z.email('Geçerli bir e-posta adresi yazın.').transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1, 'Şifrenizi yazın.'),
});

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { email: raw.email ?? '' };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { email, password } = parsed.data;
  const ip = await clientIpBucket();

  // Hesap başına 15 dakikada 8, IP başına 30 başarısız deneme.
  const since = new Date(Date.now() - 15 * 60_000);
  const [[byKey], [byIp]] = await Promise.all([
    db
      .select({ n: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.key, email), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since))),
    db
      .select({ n: count() })
      .from(loginAttempts)
      // Öğrenci kodu denemeleri (okulda aynı IP’den) yetişkin girişlerini kilitlemesin.
      .where(and(eq(loginAttempts.ip, ip), ne(loginAttempts.key, 'ogrenci-kodu'), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since))),
  ]);
  // Hatalı denemeler yukarıda sayılır ama sayım ile kayıt arasında zaman vardır; aynı anda gönderilen
  // istekler bu arayı kullanamasın diye hesap başına bütün denemeler ayrıca atomik olarak sınırlanır.
  if (byKey.n >= 8 || byIp.n >= 30 || !(await rateLimit(`giris-deneme:${email}`, 10, 900))) {
    return { message: 'Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar deneyin ya da şifrenizi yenileyin.', values };
  }

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash, role: users.role, totpEnabledAt: users.totpEnabledAt })
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);
  // Kullanıcı yoksa da aynı sürede cevap vermek için sahte bir doğrulama yapılır.
  const ok = user ? await verifyPassword(user.passwordHash, password) : await dummyVerify(password);

  await db.insert(loginAttempts).values({ key: email, ip, success: !!(user && ok) });
  if (!user || !ok) return { message: 'E-posta adresi ya da şifre hatalı.', values };

  // İki aşamalı doğrulama açıksa oturum ikinci adımdan sonra açılır.
  if (user.totpEnabledAt) {
    await startSecondStep(user.id, safeNextPath(formData.get('sonra')));
    redirect('/giris/dogrulama');
  }
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await createUserSession(user.id);
  await setHintCookie();
  redirect(safeNextPath(formData.get('sonra')) ?? (await homeFor(user)));
}

/* ---------------- Girişin ikinci adımı ---------------- */

/**
 * İki aşamalı doğrulamanın ikinci adımı: kimlik doğrulama uygulamasındaki 6 haneli kod ya da bir
 * kurtarma kodu. Bekleyen giriş 10 dakika geçerlidir; hesap başına 15 dakikada 8 hatalı deneme.
 */
export async function secondStepAction(_: FormState, formData: FormData): Promise<FormState> {
  const pending = await pendingSecondStep();
  if (!pending) return { message: 'Girişin süresi doldu. Lütfen e-posta ve şifrenizle yeniden giriş yapın.' };
  const code = String(formData.get('code') ?? '').trim();
  if (!code) return { errors: { code: 'Kodu yazın.' } };
  const attempt = await attemptSecondFactor(pending.userId, pending.email, code, await clientIpBucket());
  if (!attempt.ok) return attempt.codeError ? { errors: { code: attempt.codeError } } : { message: attempt.message };

  // Bekleyen giriş yalnızca bir kez kullanılabilir: aynı anda gelen ikinci istek ya da bu arada şifre
  // değişmişse (bekleyen girişler geçersiz kılınır) oturum açılmaz.
  if (!(await finishSecondStep(pending.id))) return { message: 'Girişin süresi doldu. Lütfen e-posta ve şifrenizle yeniden giriş yapın.' };
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, pending.userId));
  // Oturum, kodun doğrulandığı kurulumun zamanıyla işaretlenir: bu arada doğrulama yeni cihaza
  // taşındıysa oturum iki aşamalı sayılmaz.
  await createUserSession(pending.userId, { twoFactorAt: attempt.enabledAt });
  await setHintCookie();
  if (attempt.method === 'recovery') {
    const left = await recoveryCodeUsed(pending.userId, pending.email);
    redirect(`/hesap/iki-asamali?kurtarma=${left}`);
  }
  const [u] = await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, pending.userId)).limit(1);
  redirect(pending.next ?? (await homeFor(u)));
}

export async function cancelSecondStepAction(): Promise<void> {
  const pending = await pendingSecondStep();
  await finishSecondStep(pending?.id ?? null);
  redirect('/giris');
}

/* ---------------- Çıkış ---------------- */

export async function logoutAction(): Promise<void> {
  await destroySession();
  (await cookies()).delete(HINT_COOKIE);
  redirect('/');
}

/* ---------------- Şifre yenileme ---------------- */

export async function forgotPasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = z.email().safeParse(String(formData.get('email') ?? '').trim().toLowerCase());
  const values = { email: String(formData.get('email') ?? '') };
  if (!parsed.success) return { errors: { email: 'Geçerli bir e-posta adresi yazın.' }, values };
  const email = parsed.data;
  const ip = await clientIpBucket();
  const allowed = (await rateLimit(`sifre:${email}`, 3, 3600)) && (await rateLimit(`sifre-ip:${ip}`, 10, 3600));
  if (allowed) {
    const [user] = await db
      .select({ id: users.id, fullName: users.fullName })
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);
    if (user) {
      const token = randomToken();
      await db.insert(authTokens).values({
        kind: 'password_reset',
        tokenHash: hashToken(token),
        userId: user.id,
        email,
        expiresAt: new Date(Date.now() + 3600_000),
      });
      const t = passwordResetTemplate(user.fullName, appUrl(`/sifre-yenile?t=${token}`));
      await sendEmail({ to: email, ...t }, { priority: true });
    }
  }
  // Hesabın var olup olmadığını belli etmemek için her durumda aynı mesaj.
  return { ok: true, message: 'Bu adrese kayıtlı bir hesap varsa, şifre yenileme bağlantısı birkaç dakika içinde gelecek.' };
}

export async function resetPasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get('token') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!token) return { message: 'Bağlantı geçersiz. Yeni bir şifre yenileme bağlantısı isteyin.' };
  const [row] = await db
    .select({ id: authTokens.id, userId: authTokens.userId, email: authTokens.email })
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(token)),
        eq(authTokens.kind, 'password_reset'),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!row?.userId) return { message: 'Bağlantının süresi dolmuş ya da daha önce kullanılmış. Yeni bir bağlantı isteyin.' };
  const policy = checkPasswordPolicy(password, row.email ?? undefined);
  if (policy) return { errors: { password: policy } };

  // Bağlantı tek kullanımlıktır: aynı anda gelen ikinci istek şifreyi yeniden değiştiremez.
  const [used] = await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(authTokens.id, row.id), isNull(authTokens.usedAt)))
    .returning({ id: authTokens.id });
  if (!used) return { message: 'Bağlantının süresi dolmuş ya da daha önce kullanılmış. Yeni bir bağlantı isteyin.' };
  await db.update(users).set({ passwordHash: await hashPassword(password) }).where(eq(users.id, row.userId));
  // Eski şifreyle başlatılmış, kodu henüz girilmemiş girişler de geçersiz olur.
  await revokePendingLogins(row.userId);
  await destroyAllUserSessions(row.userId);
  await audit({ actorUserId: row.userId, action: 'user.password_reset', entity: 'user', entityId: row.userId });
  // E-posta kutusuna erişim tek başına yetmesin: iki aşamalı doğrulama açıksa oturum ikinci adımdan sonra açılır.
  const [u] = await db.select({ totpEnabledAt: users.totpEnabledAt }).from(users).where(eq(users.id, row.userId)).limit(1);
  if (u?.totpEnabledAt) {
    await startSecondStep(row.userId, '/hesap?sifre=yenilendi');
    redirect('/giris/dogrulama');
  }
  await createUserSession(row.userId);
  await setHintCookie();
  redirect('/hesap?sifre=yenilendi');
}

/* ---------------- E-posta doğrulama ---------------- */

export async function resendVerificationAction(): Promise<FormState> {
  const s = await getSession();
  if (s?.kind !== 'user') return { message: 'Önce giriş yapın.' };
  if (s.user.emailVerified) return { ok: true, message: 'E-posta adresiniz zaten doğrulanmış.' };
  if (!(await rateLimit(`dogrulama:${s.user.id}`, 3, 3600))) {
    return { message: 'Doğrulama e-postası kısa süre önce gönderildi. Lütfen gelen kutunuzu ve istenmeyen klasörünü kontrol edin.' };
  }
  await sendVerification(s.user.id, s.user.email, s.user.fullName);
  return { ok: true, message: `Doğrulama bağlantısı ${s.user.email} adresine gönderildi.` };
}
