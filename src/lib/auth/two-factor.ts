import 'server-only';
import { and, count, eq, gt, isNull, ne, or, lt, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db, type Exec, type Tx } from '@/db';
import { authTokens, loginAttempts, memberships, organizations, recoveryCodes, users } from '@/db/schema';
import { audit } from '@/lib/audit';
import { sendEmail } from '@/lib/email/send';
import { recoveryCodeUsedTemplate, secondStepFailedTemplate } from '@/lib/email/templates';
import { rateLimit } from '@/lib/rate-limit';
import { appUrl } from '@/lib/request';
import { hashToken, randomToken } from './tokens';
import { base32Decode, normalizeRecoveryCode, verifyTotp } from './totp';
import { hashRecoveryCode, newRecoveryCodes, openSecret } from './two-factor-crypto';

export { sealSecret, openSecret, RECOVERY_CODE_COUNT } from './two-factor-crypto';

/**
 * İki aşamalı doğrulama. KVKK Kurulunun 2018/10 sayılı kararı, özel nitelikli kişisel verilere uzaktan
 * erişimde en az iki kademeli kimlik doğrulamayı öngörür: öğrencilerin bireysel ölçme sonuçlarını
 * görebilen platform yöneticileri ve rehber öğretmenler için zorunludur, diğer kullanıcılar için isteğe bağlıdır.
 */

/**
 * Kullanıcının kurtarma kodlarını yenileriyle değiştirir; yeni kodları (bir kez gösterilmek üzere)
 * döndürür. Süren bir işlem verilirse onun içinde çalışır.
 */
export async function replaceRecoveryCodes(userId: string, tx?: Tx): Promise<string[]> {
  const codes = newRecoveryCodes();
  const run = async (t: Tx) => {
    await t.delete(recoveryCodes).where(eq(recoveryCodes.userId, userId));
    await t.insert(recoveryCodes).values(codes.hashes.map((codeHash) => ({ userId, codeHash })));
  };
  if (tx) await run(tx);
  else await db.transaction(run);
  return codes.display;
}

/**
 * Kullanıcının bekleyen (şifresi doğrulanmış, kodu henüz girilmemiş) girişlerini geçersiz kılar:
 * şifre değişince, iki aşamalı doğrulama kurulunca, kapatılınca ya da sıfırlanınca.
 */
export async function revokePendingLogins(userId: string, exec: Exec = db): Promise<void> {
  await exec
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(authTokens.userId, userId), eq(authTokens.kind, 'login_2fa'), isNull(authTokens.usedAt)));
}

export async function unusedRecoveryCodes(userId: string): Promise<number> {
  return db.$count(recoveryCodes, and(eq(recoveryCodes.userId, userId), isNull(recoveryCodes.usedAt)));
}

/* ---------- Zorunluluk ---------- */

/** Kullanıcı için iki aşamalı doğrulama zorunlu mu: platform yöneticisi ya da etkin bir okulda rehber öğretmen. */
export async function twoFactorRequired(user: { id: string; role: string }): Promise<boolean> {
  if (user.role === 'admin') return true;
  const [m] = await db
    .select({ id: memberships.id })
    .from(memberships)
    .innerJoin(organizations, eq(organizations.id, memberships.orgId))
    .where(and(eq(memberships.userId, user.id), eq(memberships.role, 'counselor'), eq(organizations.isActive, true), isNull(organizations.deletedAt)))
    .limit(1);
  return !!m;
}

/* ---------- Doğrulama ---------- */

/**
 * İkinci adımı doğrular: 6 haneli kod ya da kurtarma kodu. Aynı kodun iki kez kullanılmaması için
 * adım ve kurtarma kodu veritabanında koşullu güncellemeyle işaretlenir. Başarılıysa yöntemi ve kodun
 * doğrulandığı kurulumun zamanını (totp_enabled_at) döndürür: oturum bu zamanla işaretlenir, böylece
 * doğrulama bu arada yeni cihaza taşınırsa (zaman değişir) oturum iki aşamalı sayılmaz.
 */
export async function verifySecondFactorAt(userId: string, input: string): Promise<{ method: 'totp' | 'recovery'; enabledAt: Date } | null> {
  const [u] = await db
    .select({ secret: users.totpSecret, lastStep: users.totpLastStep, enabledAt: users.totpEnabledAt })
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1);
  if (!u?.secret || !u.enabledAt) return null;
  const enabledAt = u.enabledAt;
  const digits = input.replace(/\s/g, '');
  if (/^\d{6}$/.test(digits)) {
    const step = verifyTotp(base32Decode(openSecret(u.secret)), digits, u.lastStep);
    if (step === null) return null;
    // Kurulum okunduğundan beri değişmediyse (aynı sır) adım işaretlenir.
    const [ok] = await db
      .update(users)
      .set({ totpLastStep: step })
      .where(
        and(
          eq(users.id, userId),
          eq(users.totpEnabledAt, enabledAt),
          or(isNull(users.totpLastStep), lt(users.totpLastStep, step)),
        ),
      )
      .returning({ id: users.id });
    return ok ? { method: 'totp', enabledAt } : null;
  }
  const code = normalizeRecoveryCode(input);
  if (!code) return null;
  const [used] = await db
    .update(recoveryCodes)
    .set({ usedAt: new Date() })
    .where(and(eq(recoveryCodes.userId, userId), eq(recoveryCodes.codeHash, hashRecoveryCode(code)), isNull(recoveryCodes.usedAt)))
    .returning({ id: recoveryCodes.id });
  return used ? { method: 'recovery', enabledAt } : null;
}

/** verifySecondFactorAt'in yalnızca yöntemi döndüren biçimi (oturum işaretlemeyen işlemler için). */
export async function verifySecondFactor(userId: string, input: string): Promise<'totp' | 'recovery' | null> {
  return (await verifySecondFactorAt(userId, input))?.method ?? null;
}

/**
 * İkinci adım denemeleri için kesin sınır. Kod doğrulanmadan önce, tek bir atomik sayaçla sayılır;
 * böylece aynı anda gönderilen istekler sınırı aşamaz. Hesap başına 15 dakikada 8, günde 40 deneme
 * (başarılı denemeler dahil). Hatalı denemelere göre kullanıcıya gösterilen sınırlar ayrıca uygulanır.
 */
export async function secondFactorAttemptAllowed(userId: string): Promise<boolean> {
  return (await rateLimit(`iki-asama-deneme:${userId}`, 8, 900)) && (await rateLimit(`iki-asama-gun:${userId}`, 40, 86400));
}

export type SecondFactorAttempt = { ok: true; method: 'totp' | 'recovery'; enabledAt: Date } | { ok: false; message?: string; codeError?: string };

/**
 * İkinci adımı sınırlarıyla birlikte dener (girişte ve kodla doğrulanmamış bir oturumu doğrularken):
 * hesap başına 15 dakikada 8 ve günde 20 hatalı deneme, IP başına 15 dakikada 30 hatalı deneme; ayrıca
 * bütün denemeler atomik sayaçla sınırlıdır. Kod art arda yanlış girilirse şifre başkasının elinde
 * olabilir: hesap sahibi e-postayla uyarılır (6 saatte bir).
 */
export async function attemptSecondFactor(userId: string, email: string, input: string, ip: string): Promise<SecondFactorAttempt> {
  const key = `iki-asama:${email}`;
  const since = new Date(Date.now() - 15 * 60_000);
  const day = new Date(Date.now() - 86400_000);
  const failed = (from: Date) => and(eq(loginAttempts.key, key), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, from));
  const [[byKey], [byDay], [byIp]] = await Promise.all([
    db.select({ n: count() }).from(loginAttempts).where(failed(since)),
    db.select({ n: count() }).from(loginAttempts).where(failed(day)),
    db
      .select({ n: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.ip, ip), ne(loginAttempts.key, 'ogrenci-kodu'), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since))),
  ]);
  if (byDay.n >= 20) return { ok: false, message: 'Bugün çok fazla hatalı kod girildi. Yarın tekrar deneyin ya da şifrenizi yenileyin.' };
  if (byKey.n >= 8 || byIp.n >= 30 || !(await secondFactorAttemptAllowed(userId))) {
    return { ok: false, message: 'Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar deneyin.' };
  }
  const verified = await verifySecondFactorAt(userId, input);
  await db.insert(loginAttempts).values({ key, ip, success: !!verified });
  if (verified) return { ok: true, ...verified };
  if (byKey.n + 1 >= 3 && (await rateLimit(`iki-asama-uyari:${userId}`, 1, 6 * 3600))) {
    const [u] = await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, userId)).limit(1);
    await sendEmail({ to: email, ...secondStepFailedTemplate(u?.fullName ?? '', appUrl('/sifremi-unuttum')) });
  }
  return { ok: false, codeError: 'Kod doğru değil ya da süresi geçmiş. Uygulamadaki güncel kodu yazın.' };
}

/** Kurtarma koduyla girildi: denetim kaydı ve hesap sahibine e-posta. Kalan kod sayısını döndürür. */
export async function recoveryCodeUsed(userId: string, email: string): Promise<number> {
  const left = await unusedRecoveryCodes(userId);
  await audit({ actorUserId: userId, action: 'user.recovery_code_used', entity: 'user', entityId: userId, meta: { left } });
  const [u] = await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, userId)).limit(1);
  await sendEmail({ to: email, ...recoveryCodeUsedTemplate(u?.fullName ?? '', left, appUrl('/hesap/iki-asamali')) });
  return left;
}

/** Kurulum sırasında bekleyen sırla gelen kodu doğrular; doğruysa eşleşen adımı döndürür. */
export function verifyPendingCode(sealedPending: string, input: string): number | null {
  return verifyTotp(base32Decode(openSecret(sealedPending)), input, null);
}

/* ---------- Girişin ikinci adımı ---------- */

export const SECOND_STEP_COOKIE = 'olc_iki_asama';
const SECOND_STEP_MINUTES = 10;

function cookieSecure(): boolean {
  if (process.env.SESSION_COOKIE_SECURE === 'false') return false;
  return process.env.NODE_ENV === 'production';
}

/** Şifre doğrulandıktan sonra ikinci adımı başlatır: kısa ömürlü bir bekleyen giriş ve çerezi. */
export async function startSecondStep(userId: string, next: string | null): Promise<void> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SECOND_STEP_MINUTES * 60_000);
  await db.insert(authTokens).values({ kind: 'login_2fa', tokenHash: hashToken(token), userId, payload: next ? { next } : {}, expiresAt });
  (await cookies()).set(SECOND_STEP_COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/** Bekleyen giriş (ikinci adım sayfası ve eylemi için). */
export async function pendingSecondStep(): Promise<{ id: string; userId: string; email: string; next: string | null } | null> {
  const token = (await cookies()).get(SECOND_STEP_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const [row] = await db
    .select({ id: authTokens.id, userId: users.id, email: users.email, payload: authTokens.payload })
    .from(authTokens)
    .innerJoin(users, eq(users.id, authTokens.userId))
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(token)),
        eq(authTokens.kind, 'login_2fa'),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, sql`now()`),
        isNull(users.deletedAt),
      ),
    )
    .limit(1);
  if (!row) return null;
  const next = typeof row.payload?.next === 'string' ? row.payload.next : null;
  return { id: row.id, userId: row.userId, email: row.email, next };
}

/**
 * İkinci adım tamamlandı ya da vazgeçildi: bekleyen giriş kapatılır. Bekleyen giriş bu çağrıyla
 * kapandıysa true döner; aynı anda gelen ikinci bir istek (ya da şifre değişince geçersiz kılınmış bir
 * giriş) false alır ve oturum açmamalıdır.
 */
export async function finishSecondStep(id: string | null): Promise<boolean> {
  let consumed = false;
  if (id) {
    const rows = await db
      .update(authTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(authTokens.id, id), isNull(authTokens.usedAt), gt(authTokens.expiresAt, sql`now()`)))
      .returning({ id: authTokens.id });
    consumed = rows.length > 0;
  }
  (await cookies()).delete(SECOND_STEP_COOKIE);
  return consumed;
}
