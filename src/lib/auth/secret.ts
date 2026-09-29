import 'server-only';

let warned = false;

/**
 * Sunucuya özel gizli anahtar (APP_SECRET): öğrenci giriş kodlarının ve kurtarma kodlarının HMAC
 * özetleri ile iki aşamalı doğrulama sırlarının şifrelenmesinde kullanılır. Üretimde en az 32
 * karakter olmalıdır; geliştirmede tanımlı değilse sabit bir anahtarla uyarı verilir.
 */
export function appSecret(): string {
  const s = process.env.APP_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('APP_SECRET tanımlı değil ya da 32 karakterden kısa.');
  }
  if (!warned) {
    console.warn('[güvenlik] APP_SECRET tanımlı değil; geliştirme için sabit bir anahtar kullanılıyor.');
    warned = true;
  }
  return 'gelistirme-ortami-icin-sabit-anahtar-uretimde-kullanmayin';
}
