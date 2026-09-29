import 'server-only';
import { createHmac } from 'node:crypto';
import { appSecret } from './secret';
import { studentLoginCode } from './tokens';

/**
 * Öğrenci giriş kodları. Kodlar kısa olduğu için (10 karakter, 32 harfli alfabe: yaklaşık 10¹⁵ olasılık)
 * düz SHA-256 özetiyle saklanmaz: veritabanı sızarsa kodlar denenerek bulunamasın diye sunucuya özel
 * bir anahtarla (APP_SECRET) HMAC özeti saklanır. Çevrim içi denemeler ise hız sınırıyla durdurulur.
 */

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
  return createHmac('sha256', appSecret()).update(`ogrenci-kodu:${normalized}`).digest('hex');
}

/** Yeni bir kod üretir; gösterim biçimi (ör. K7PXM-3QD2A) ve saklanacak özetiyle birlikte. */
export function newLoginCode(): { display: string; hash: string } {
  const display = studentLoginCode();
  return { display, hash: hashLoginCode(display.replace('-', '')) };
}
