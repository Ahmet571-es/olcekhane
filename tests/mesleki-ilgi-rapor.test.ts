import { describe, expect, it } from 'vitest';
import { RIASEC_ORDER, RIASEC_TYPES } from '@/content/careers/riasec';
import { meslekiIlgi } from '@/content/instruments/mesleki-ilgi';
import { evaluate } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';

/**
 * Mesleki İlgi Profili raporu: öne çıkan alanlar, Holland kodu, örnek meslekler ve eğitim yolları puanın düzeyine göre
 * seçilir. Bütün düzey birleşimleri tek tek denenir: düşük ilgili alan hiçbir zaman "belirgin ilgi" diye gösterilmez.
 */
const SLUG = 'mesleki-ilgi-profili';
const SCALES = RIASEC_ORDER.map((k) => RIASEC_TYPES[k].scaleKey);
const NAMES = RIASEC_ORDER.map((k) => RIASEC_TYPES[k].name);
const HIGH_LABELS = ['Yüksek ilgi', 'Çok yüksek ilgi'];
const OK_LABELS = ['Orta düzeyde ilgi', ...HIGH_LABELS];

/** Her alandaki 8 maddeye verilecek cevaplar (alan sırası: R, I, A, S, E, C). */
function body(perScale: number[][], grade = 10): AnswersBody {
  const idx = new Map<string, number>();
  return {
    grade,
    data: {
      engine: 'likert',
      answers: Object.fromEntries(
        meslekiIlgi.items.map((it) => {
          const s = SCALES.indexOf(it.scale);
          const i = idx.get(it.scale) ?? 0;
          idx.set(it.scale, i + 1);
          return [it.key, { value: perScale[s][i % perScale[s].length], rtMs: 2600 }];
        }),
      ),
    },
  };
}
const flat = (v: number) => [v];

function check(levels: number[][], label: string) {
  const r = evaluate(SLUG, body(levels));
  const means = levels.map((xs) => {
    const all = Array.from({ length: 8 }, (_, i) => xs[i % xs.length]);
    return all.reduce((a, b) => a + b, 0) / 8;
  });
  const anyHigh = means.some((m) => m >= 3.4);
  const allSame = means.every((m) => m === means[0]);
  for (const audience of ['student', 'parent'] as const) {
    const rep = r[audience];
    const code = rep.keyFigures.find((f) => f.label === 'İlgi kodu');
    const jobs = rep.items.find((i) => /örnek meslekler/.test(i.title));
    const tops = rep.items.filter((i) => /^\d\. /.test(i.title));
    const where = `${label} ${audience}`;
    // Kod ve meslek yalnızca en az bir alan yüksekken (ve bütün puanlar aynı değilken).
    expect(!!code, where).toBe(anyHigh && !allSame);
    expect(!!jobs, where).toBe(!!code);
    // Öne çıkan alan hiçbir zaman orta düzeyin altında değildir; kodun harfleri öne çıkan alanlardır.
    for (const t of tops) expect(OK_LABELS, `${where}: ${t.title}`).toContain(t.badge);
    if (code) {
      expect(code.value, where).toMatch(/^[RIASEC]{1,3}$/);
      expect(code.value.length, where).toBe(tops.length);
      expect(tops.some((t) => HIGH_LABELS.includes(t.badge!)), where).toBe(true);
    } else {
      expect(tops.length, where).toBeLessThanOrEqual(2);
    }
    if (rep.chart?.type === 'hexagon') {
      expect(rep.chart.highlight.length, where).toBe(tops.length);
    }
    // Öne çıkan alan yoksa bütün alanlar düzeyleriyle listelenir; varsa öteki alanlar ayrı satırdadır.
    const restItem = rep.items.find((i) => i.title === 'Bütün alanlar' || /^Diğer alan/.test(i.title));
    if (tops.length < 6) expect(restItem, where).toBeDefined();
    // Yol haritası raporla aynı alanları öne çıkarır; eğitim yolları yalnızca yüksek düzeydeki alanlar içindir.
    const rm = rep.roadmap!;
    expect(rm.standout.map((s) => s.title), where).toEqual(tops.map((t) => t.title.slice(3)));
    if (rm.settings) {
      expect(anyHigh, where).toBe(true);
      for (const line of rm.settings.items) {
        const name = NAMES.find((n) => line.startsWith(`${n}:`))!;
        const t = tops.find((x) => x.title.endsWith(name));
        expect(t && HIGH_LABELS.includes(t.badge!), `${where}: ${line.slice(0, 40)}`).toBe(true);
      }
    } else {
      expect(anyHigh && tops.some((t) => HIGH_LABELS.includes(t.badge!)), where).toBe(false);
    }
    expect(JSON.stringify(rep), where).not.toMatch(/undefined|NaN/);
  }
  return r;
}

describe('Mesleki İlgi Profili raporu: öne çıkan alanlar düzeye göre', () => {
  it('bütün düzey birleşimlerinde kod, meslek, kartlar ve yol haritası birbiriyle tutarlı', () => {
    const levels = [1, 3, 5];
    let n = 0;
    for (let c = 0; c < levels.length ** 6; c++) {
      const combo = SCALES.map((_, i) => levels[Math.floor(c / levels.length ** i) % levels.length]);
      check(combo.map(flat), combo.join(''));
      n++;
    }
    expect(n).toBe(729);
  }, 300_000);

  it('hiçbir etkinlikten hoşlanmayana ilgi kodu ve meslek verilmez', () => {
    const r = check(SCALES.map(() => flat(1)), 'hepsi 1');
    expect(r.student.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
    expect(r.student.cautions.join(' ')).toContain('ilgi kodu ve örnek meslekler verilmedi');
    expect(r.student.roadmap!.standoutNote).toContain('hiçbir alan öne çıkarılmadı');
  });

  it('her etkinliğe aynı orta cevap: öne çıkan alan yok', () => {
    const r = check(SCALES.map(() => flat(3)), 'hepsi 3');
    expect(r.student.keyFigures).toEqual([]);
    expect(r.student.cautions.join(' ')).toContain('Bütün alanlarda aynı puan çıktı');
  });

  it('hiçbir alan yüksek değilken en yüksek iki orta alan gösterilir, kod ve yol verilmez', () => {
    // R ortalaması 3,25; I 3,0; geri kalanlar düşük.
    const r = check([[3, 3, 3, 3, 3, 3, 4, 4], flat(3), flat(1), flat(2), flat(1), flat(2)], 'orta');
    expect(r.student.keyFigures[0].label).toBe('En yüksek çıkan alanın');
    expect(r.student.items.slice(0, 2).map((i) => i.title)).toEqual(['1. Gerçekçi', '2. Araştırmacı']);
    expect(r.student.roadmap!.settings).toBeNull();
    expect(r.student.cautions.join(' ')).toContain('Hiçbir alanda belirgin (yüksek düzeyde) bir ilgi çıkmadı');
  });

  it('tek yüksek alan: kod tek harf olabilir, düşük alanlar koda girmez', () => {
    const r = check([flat(5), flat(1), flat(1), flat(2), flat(1), flat(2)], 'tek');
    expect(r.student.keyFigures[0]).toMatchObject({ label: 'İlgi kodu', value: 'R' });
    expect(r.student.roadmap!.settings!.items).toHaveLength(1);
  });

  it('eşit puanlar açıkça söylenir', () => {
    // S ve C eşit (5,0), sonra A: S ile C'nin kodundaki sırası yer değiştirebilir.
    const sc = check([flat(2), flat(2), flat(4), flat(5), flat(2), flat(5)], 'S=C');
    expect(sc.student.keyFigures[0].value).toBe('SCA');
    expect(sc.student.cautions).toContain('Sosyal ve Düzenli alanlarındaki puanların neredeyse aynı; ilgi kodunda bu alanların sırası yer değiştirebilir.');
    // R, I, A ve C eşit (4,0): kodun üç harfi bu dört alandan seçildi.
    const four = check([flat(4), flat(4), flat(4), flat(2), flat(2), flat(4)], 'RIAC');
    expect(four.parent.cautions.join(' ')).toContain('Gerçekçi, Araştırmacı, Sanatçı ve Düzenli alanlarındaki puanlar neredeyse aynıdır');
    // Üçüncü ile dördüncü alan eşit.
    const third = check([flat(5), flat(4), flat(3), flat(3), flat(1), flat(1)], '3=4');
    expect(third.student.cautions).toContain('Sanatçı ve Sosyal alanlarındaki puanların neredeyse aynı; üçüncü alanını bu alanlardan herhangi biri olarak düşünebilirsin.');
  });
});
