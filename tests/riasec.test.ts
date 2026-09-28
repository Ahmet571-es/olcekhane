import { describe, expect, it } from 'vitest';
import { OCCUPATIONS, RIASEC_ORDER, RIASEC_TYPES, occupationsFor } from '@/content/careers/riasec';
import { meslekiIlgi } from '@/content/instruments/mesleki-ilgi';

describe('Mesleki İlgi Profili tanımı', () => {
  it('her alanda 8 madde var ve aynı alandan iki madde art arda gelmiyor', () => {
    const counts = new Map<string, number>();
    meslekiIlgi.items.forEach((it, i) => {
      counts.set(it.scale, (counts.get(it.scale) ?? 0) + 1);
      if (i > 0) expect(meslekiIlgi.items[i - 1].scale).not.toBe(it.scale);
    });
    expect(meslekiIlgi.items).toHaveLength(48);
    for (const k of RIASEC_ORDER) expect(counts.get(RIASEC_TYPES[k].scaleKey)).toBe(8);
  });

  it('madde anahtarları benzersiz ve metinler tekrarsız', () => {
    const keys = new Set(meslekiIlgi.items.map((i) => i.key));
    const texts = new Set(meslekiIlgi.items.map((i) => i.text));
    expect(keys.size).toBe(48);
    expect(texts.size).toBe(48);
  });

  it('ölçek anahtarları RIASEC türleriyle eşleşiyor', () => {
    expect(meslekiIlgi.scales.map((s) => s.key)).toEqual(RIASEC_ORDER.map((k) => RIASEC_TYPES[k].scaleKey));
  });
});

describe('Meslek örnekleri', () => {
  it('meslek kodları geçerli harflerden oluşuyor ve tekrarsız', () => {
    for (const o of OCCUPATIONS) {
      expect(o.code).toMatch(/^[RIASEC]{2,3}$/);
      expect(new Set(o.code).size).toBe(o.code.length);
    }
    expect(new Set(OCCUPATIONS.map((o) => o.name)).size).toBe(OCCUPATIONS.length);
  });

  it('baskın alanla başlayan meslekleri öne alıyor, ikinci alandan da örnek veriyor', () => {
    const list = occupationsFor(['S', 'E', 'A']);
    expect(list.length).toBe(8);
    expect(list[0].code[0]).toBe('S');
    expect(list.filter((o) => o.code[0] === 'S').length).toBeLessThanOrEqual(5);
    expect(list.some((o) => o.code[0] === 'E' && o.code.includes('S'))).toBe(true);
  });

  it('her olası ilk iki harf için en az 5 örnek buluyor', () => {
    for (const a of RIASEC_ORDER)
      for (const b of RIASEC_ORDER) {
        if (a === b) continue;
        const c = RIASEC_ORDER.find((k) => k !== a && k !== b)!;
        expect(occupationsFor([a, b, c]).length).toBeGreaterThanOrEqual(5);
      }
  });
});
