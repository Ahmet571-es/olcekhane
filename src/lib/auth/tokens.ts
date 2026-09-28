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

/** Okul öğrencileri için karışmayan karakterlerden kısa giriş kodu (ör. K7PX-M3QD). */
export function studentLoginCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) code += alphabet[bytes[i] % alphabet.length];
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}
