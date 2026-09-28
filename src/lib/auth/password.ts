import 'server-only';
import { hash, verify } from '@node-rs/argon2';

/** Argon2id; OWASP'ın önerdiği en az 19 MiB bellek ve 2 geçiş. */
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

export async function verifyPassword(hashed: string, password: string): Promise<boolean> {
  try {
    return await verify(hashed, password);
  } catch {
    return false;
  }
}

const COMMON = new Set([
  '1234567890', '12345678910', 'qwertyuiop', 'password123', 'sifre12345', 'şifre12345', '1q2w3e4r5t',
  'asdfghjkl1', 'galatasaray', 'fenerbahce', 'besiktas1903', 'trabzonspor', 'istanbul34', 'ankara06',
  'turkiye1923', 'parola1234', 'abc1234567', 'aaaaaaaaaa', '0987654321', '1111111111',
]);

/** Şifre kuralı: en az 10 karakter, yaygın şifre değil, e-posta adresini içermiyor. Hata mesajı ya da null döner. */
export function checkPasswordPolicy(password: string, email?: string): string | null {
  if (password.length < 10) return 'Şifre en az 10 karakter olmalı.';
  if (password.length > 200) return 'Şifre en fazla 200 karakter olabilir.';
  const lower = password.toLocaleLowerCase('tr-TR');
  if (COMMON.has(lower)) return 'Bu şifre çok yaygın. Daha kolay tahmin edilemeyecek bir şifre seçin.';
  if (/^(.)\1+$/.test(password)) return 'Şifre tek bir karakterin tekrarı olamaz.';
  const local = email?.split('@')[0]?.toLocaleLowerCase('tr-TR');
  if (local && local.length >= 4 && lower.includes(local)) return 'Şifre e-posta adresinizi içermemeli.';
  return null;
}

let dummyHash: Promise<string> | null = null;
/** Var olmayan bir hesap için de aynı sürede cevap vermek amacıyla gerçek bir doğrulama yapar. */
export async function dummyVerify(password: string): Promise<false> {
  dummyHash ??= hash('olcekhane-zamanlama-esitleme', OPTIONS);
  await verifyPassword(await dummyHash, password);
  return false;
}
