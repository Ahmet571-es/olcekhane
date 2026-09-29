import 'server-only';
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from 'node:crypto';
import { appSecret } from './secret';
import { studentLoginCode } from './tokens';

/* ---------- Sırrın şifrelenmesi ---------- */

function key(): Buffer {
  return Buffer.from(hkdfSync('sha256', appSecret(), 'olcekhane', 'totp-secret-v1', 32));
}

/** Sırrı AES-256-GCM ile şifreler: "v1.<iv>.<şifreli>.<etiket>" (base64url). */
export function sealSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64url'), ct.toString('base64url'), cipher.getAuthTag().toString('base64url')].join('.');
}

export function openSecret(sealed: string): string {
  const [v, iv, ct, tag] = sealed.split('.');
  if (v !== 'v1' || !iv || !ct || !tag) throw new Error('Şifreli sır biçimi tanınmadı.');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ct, 'base64url')), decipher.final()]).toString('utf8');
}

/* ---------- Kurtarma kodları ---------- */

export const RECOVERY_CODE_COUNT = 10;

export function hashRecoveryCode(normalized: string): string {
  return createHmac('sha256', appSecret()).update(`kurtarma-kodu:${normalized}`).digest('hex');
}

/** Yeni kurtarma kodları: gösterim biçimi (ör. K7PXM-3QD2A) ve saklanacak özetleri. */
export function newRecoveryCodes(): { display: string[]; hashes: string[] } {
  const display = Array.from({ length: RECOVERY_CODE_COUNT }, () => studentLoginCode());
  return { display, hashes: display.map((c) => hashRecoveryCode(c.replace('-', ''))) };
}
