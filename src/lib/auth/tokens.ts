import 'server-only';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** Tahmin edilemez, URL'de kullanılabilir belirteç (256 bit). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

/** Veritabanında belirtecin kendisi değil, SHA-256 özeti saklanır. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Okul öğrencileri için karışmayan karakterlerden giriş kodu (ör. K7PXM-3QD2A): 10 karakter, 32 harfli
 * alfabe, yaklaşık 10¹⁵ olasılık. Alfabe 32 harf olduğu için bayt değerinin 32’ye göre kalanı eşit dağılır.
 */
export function studentLoginCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(10);
  let code = '';
  for (let i = 0; i < 10; i++) code += alphabet[bytes[i] % alphabet.length];
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}
