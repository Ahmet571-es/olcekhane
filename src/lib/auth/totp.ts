import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Zamana dayalı tek kullanımlık şifre (TOTP, RFC 6238): HMAC-SHA1, 30 saniye, 6 hane. Google
 * Authenticator, Microsoft Authenticator gibi bütün kimlik doğrulama uygulamalarıyla uyumludur.
 */
export const TOTP_PERIOD = 30;
export const TOTP_DIGITS = 6;
/** Saat kaymasına karşı bir önceki ve bir sonraki adım da kabul edilir. */
const WINDOW = 1;

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(input: string): Buffer {
  const s = input.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of s) {
    const i = B32.indexOf(ch);
    if (i === -1) throw new Error('Geçersiz base32 karakteri');
    value = (value << 5) | i;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/** RFC 4226 HOTP: sayaç için kod. `digits` yalnızca test vektörleri için değiştirilebilir. */
export function hotp(key: Buffer, counter: number, digits = TOTP_DIGITS): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const mac = createHmac('sha1', key).update(msg).digest();
  const offset = mac[mac.length - 1] & 0x0f;
  const bin = ((mac[offset] & 0x7f) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}

export function totpStep(timeMs = Date.now()): number {
  return Math.floor(timeMs / 1000 / TOTP_PERIOD);
}

/**
 * Kodu doğrular ve eşleşen adımı döndürür (eşleşmezse null). Aynı kodun ikinci kez kullanılmasına
 * karşı yalnızca daha önce kullanılmış adımdan (`lastStep`) sonraki adımlar kabul edilir.
 */
export function verifyTotp(key: Buffer, code: string, lastStep: number | null, timeMs = Date.now()): number | null {
  const clean = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean)) return null;
  const now = totpStep(timeMs);
  const given = Buffer.from(clean);
  for (let step = now - WINDOW; step <= now + WINDOW; step++) {
    if (lastStep !== null && step <= lastStep) continue;
    if (timingSafeEqual(Buffer.from(hotp(key, step)), given)) return step;
  }
  return null;
}

/** Yeni bir sır (160 bit, RFC 4226’nın önerdiği uzunluk), base32 olarak. */
export function newTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

/** Kimlik doğrulama uygulamasına eklemek için otpauth adresi (karekodun içeriği). */
export function otpauthUri(secretBase32: string, account: string, issuer = 'Ölçekhane'): string {
  const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(account)}`;
  const params = new URLSearchParams({ secret: secretBase32, issuer, algorithm: 'SHA1', digits: String(TOTP_DIGITS), period: String(TOTP_PERIOD) });
  return `otpauth://totp/${label}?${params.toString()}`;
}

/** Kurtarma kodunu karşılaştırılabilir biçime getirir (ör. "k7px-m3qd" → "K7PXM3QD"); geçersizse null. */
export function normalizeRecoveryCode(input: string): string | null {
  const s = input.toUpperCase().replace(/[\s-]/g, '');
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10}$/.test(s) ? s : null;
}
