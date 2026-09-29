import 'server-only';
import { createHmac } from 'node:crypto';
import { studentLoginCode } from './tokens';

/**
 * Öğrenci giriş kodları. Kodlar kısa olduğu için (10 karakter, 32 harfli alfabe: yaklaşık 10¹⁵ olasılık)
 * düz SHA-256 özetiyle saklanmaz: veritabanı sızarsa kodlar denenerek bulunamasın diye sunucuya özel
 * bir anahtarla (APP_SECRET) HMAC özeti saklanır. Çevrim içi denemeler ise hız sınırıyla durdurulur.
 */

let warned = false;
function secret(): string {
  const s = process.env.APP_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('APP_SECRET tanımlı değil ya da 32 karakterden kısa. Öğrenci giriş kodları için gereklidir.');
  }
  if (!warned) {
    console.warn('[güvenlik] APP_SECRET tanımlı değil; geliştirme için sabit bir anahtar kullanılıyor.');
    warned = true;
  }
  return 'gelistirme-ortami-icin-sabit-anahtar-uretimde-kullanmayin';
}

/** Kullanıcının yazdığı kodu karşılaştırılabilir biçime getirir: büyük harf, tire ve boşluk yok. */
export function normalizeLoginCode(input: string): string | null {
  const s = input
    .toLocaleUpperCase('tr-TR')
    .replace(/İ/g, 'I')
    .replace(/[\s-]/g, '');
  // Karıştırılmaması için alfabede olmayan harfleri benzerleriyle eşle: O→0 yok, I→1 yok; bu harfler geçersizdir.
  if (!/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10}$/.test(s)) return null;
  return s;
}

export function hashLoginCode(normalized: string): string {
  return createHmac('sha256', secret()).update(`ogrenci-kodu:${normalized}`).digest('hex');
}

/** Yeni bir kod üretir; gösterim biçimi (ör. K7PXM-3QD2A) ve saklanacak özetiyle birlikte. */
export function newLoginCode(): { display: string; hash: string } {
  const display = studentLoginCode();
  return { display, hash: hashLoginCode(display.replace('-', '')) };
}
