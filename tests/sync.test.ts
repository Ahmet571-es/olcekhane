import { describe, expect, it } from 'vitest';
import { stableStringify } from '@/lib/stable-json';

/**
 * Tanım karşılaştırması: PostgreSQL jsonb anahtar sırasını değiştirir; eşitleme bu yüzden anahtarları
 * sıralı bir JSON ile karşılaştırır. Bu test, anahtar sırası farklı iki nesnenin aynı özeti ürettiğini doğrular.
 */
describe('stableStringify', () => {
  it('anahtar sırasından bağımsız', () => {
    expect(stableStringify({ band: 'low', min: 1 })).toBe(stableStringify({ min: 1, band: 'low' }));
    expect(stableStringify([{ b: 1, a: { d: 2, c: 3 } }])).toBe(stableStringify([{ a: { c: 3, d: 2 }, b: 1 }]));
  });
  it('tanımsız alanları yok sayar', () => {
    expect(stableStringify({ a: 1, b: undefined })).toBe(stableStringify({ a: 1 }));
  });
});
