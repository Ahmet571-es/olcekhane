import 'server-only';
import { and, eq, gt, isNull, or, lt, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { authTokens, memberships, organizations, recoveryCodes, users } from '@/db/schema';
import { hashToken, randomToken } from './tokens';
import { base32Decode, normalizeRecoveryCode, verifyTotp } from './totp';
import { hashRecoveryCode, newRecoveryCodes, openSecret } from './two-factor-crypto';

export { sealSecret, openSecret, RECOVERY_CODE_COUNT } from './two-factor-crypto';

/**
 * İki aşamalı doğrulama. KVKK Kurulunun 2018/10 sayılı kararı, özel nitelikli kişisel verilere uzaktan
 * erişimde en az iki kademeli kimlik doğrulamayı öngörür: öğrencilerin bireysel ölçme sonuçlarını
 * görebilen platform yöneticileri ve rehber öğretmenler için zorunludur, diğer kullanıcılar için isteğe bağlıdır.
 */

/** Kullanıcının kurtarma kodlarını yenileriyle değiştirir; yeni kodları (bir kez gösterilmek üzere) döndürür. */
export async function replaceRecoveryCodes(userId: string): Promise<string[]> {
  const codes = newRecoveryCodes();
  await db.transaction(async (tx) => {
    await tx.delete(recoveryCodes).where(eq(recoveryCodes.userId, userId));
    await tx.insert(recoveryCodes).values(codes.hashes.map((codeHash) => ({ userId, codeHash })));
  });
  return codes.display;
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
 * adım ve kurtarma kodu veritabanında koşullu güncellemeyle işaretlenir. Başarılıysa yöntemi döndürür.
 */
export async function verifySecondFactor(userId: string, input: string): Promise<'totp' | 'recovery' | null> {
  const [u] = await db
    .select({ secret: users.totpSecret, lastStep: users.totpLastStep, enabledAt: users.totpEnabledAt })
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1);
  if (!u?.secret || !u.enabledAt) return null;
  const digits = input.replace(/\s/g, '');
  if (/^\d{6}$/.test(digits)) {
    const step = verifyTotp(base32Decode(openSecret(u.secret)), digits, u.lastStep);
    if (step === null) return null;
    const [ok] = await db
      .update(users)
      .set({ totpLastStep: step })
      .where(and(eq(users.id, userId), or(isNull(users.totpLastStep), lt(users.totpLastStep, step))))
      .returning({ id: users.id });
    return ok ? 'totp' : null;
  }
  const code = normalizeRecoveryCode(input);
  if (!code) return null;
  const [used] = await db
    .update(recoveryCodes)
    .set({ usedAt: new Date() })
    .where(and(eq(recoveryCodes.userId, userId), eq(recoveryCodes.codeHash, hashRecoveryCode(code)), isNull(recoveryCodes.usedAt)))
    .returning({ id: recoveryCodes.id });
  return used ? 'recovery' : null;
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

/** İkinci adım tamamlandı ya da vazgeçildi: bekleyen giriş kapatılır. */
export async function finishSecondStep(id: string | null): Promise<void> {
  if (id) await db.update(authTokens).set({ usedAt: new Date() }).where(and(eq(authTokens.id, id), isNull(authTokens.usedAt)));
  (await cookies()).delete(SECOND_STEP_COOKIE);
}
