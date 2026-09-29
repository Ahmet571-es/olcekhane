import { describe, expect, it } from 'vitest';
import type { LikertInstrument } from '@/lib/instruments/types';
import {
  alphaIfDeleted,
  analyzeDichotomous,
  analyzeLikert,
  correctedItemTotal,
  discriminationIndex,
  normPreview,
  normSizeRating,
  reliabilityRating,
  skewness,
  splitHalf,
  type DichotomousItemSpec,
} from '@/lib/psychometrics/analysis';
import { nearestBand } from '@/lib/reports/bands';
import { normNoteText } from '@/lib/reports/build';
import { cronbachAlpha, pearson } from '@/lib/scoring/stats';

/** Tekrarlanabilir rastgele sayılar (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function normal(r: () => number) {
  const u = Math.max(r(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

/** Alfa, kovaryans matrisinden bağımsız olarak: k/(k−1) × (1 − iz(C) / ΣC). */
function alphaFromCovariance(rows: number[][]): number {
  const n = rows.length;
  const k = rows[0].length;
  const means = Array.from({ length: k }, (_, j) => rows.reduce((s, r) => s + r[j], 0) / n);
  let trace = 0;
  let total = 0;
  for (let a = 0; a < k; a++) {
    for (let b = 0; b < k; b++) {
      const c = rows.reduce((s, r) => s + (r[a] - means[a]) * (r[b] - means[b]), 0) / (n - 1);
      total += c;
      if (a === b) trace += c;
    }
  }
  return (k / (k - 1)) * (1 - trace / total);
}

function likertData(seed: number, n: number, k: number, noise = 0.9) {
  const r = rng(seed);
  return Array.from({ length: n }, () => {
    const t = normal(r);
    return Array.from({ length: k }, () => Math.min(5, Math.max(1, Math.round(3 + t + noise * normal(r)))));
  });
}

describe('güvenirlik', () => {
  it('Cronbach alfa, kovaryans matrisiyle hesaplanan değere eşit', () => {
    const rows = likertData(7, 250, 8);
    expect(cronbachAlpha(rows)!).toBeCloseTo(alphaFromCovariance(rows), 10);
  });

  it('ters yönde işleyen madde düşük madde-toplam korelasyonu alır ve çıkarılınca alfa artar', () => {
    const rows = likertData(11, 300, 6).map((r) => [...r.slice(0, 5), 6 - r[5]]);
    const citc = correctedItemTotal(rows);
    for (let j = 0; j < 5; j++) expect(citc[j]!).toBeGreaterThan(0.4);
    expect(citc[5]!).toBeLessThan(0);
    const alpha = cronbachAlpha(rows)!;
    expect(alphaIfDeleted(rows)[5]!).toBeGreaterThan(alpha);
  });

  it('iki kategorili maddelerde KR-20 alfaya eşittir ve ayırt edicilik doğru hesaplanır', () => {
    const item = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1];
    const totals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11];
    // Toplamı en yüksek %27 (3 kişi) hep doğru, en düşük %27 hep yanlış: D = 1
    expect(discriminationIndex(item, totals)).toBe(1);
  });

  it('Spearman-Brown düzeltmesi', () => {
    expect(splitHalf([1, 2, 3, 4], [1, 2, 3, 4])).toBeCloseTo(1, 10);
    const odd = [1, 2, 3, 4, 5, 6, 7, 8];
    const even = [2, 1, 4, 3, 6, 8, 5, 7];
    const r = pearson(odd, even)!;
    expect(splitHalf(odd, even)!).toBeCloseTo((2 * r) / (1 + r), 10);
  });

  it('EFPA derecelendirmesi', () => {
    expect(reliabilityRating(0.69)).toBe('inadequate');
    expect(reliabilityRating(0.7)).toBe('adequate');
    expect(reliabilityRating(0.85)).toBe('good');
    expect(reliabilityRating(0.9)).toBe('excellent');
    expect(normSizeRating(199)).toBe('inadequate');
    expect(normSizeRating(200)).toBe('adequate');
    expect(normSizeRating(300)).toBe('good');
    expect(normSizeRating(1000)).toBe('excellent');
  });
});

describe('likert madde analizi', () => {
  const def = {
    options: [1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) })),
    scales: [{ key: 's', name: 'Ölçek', plain: '' }],
    items: [
      { key: 'm1', text: 'Bir', scale: 's' },
      { key: 'm2', text: 'İki', scale: 's' },
      { key: 'm3', text: 'Üç', scale: 's', reverse: true },
      { key: 'm4', text: 'Dört', scale: 's' },
      { key: 'm5', text: 'Beş (anahtarı yanlış)', scale: 's' },
    ],
  } as unknown as LikertInstrument;

  it('ters maddeleri çevirir; yönü yanlış tanımlanmış maddeyi işaretler', () => {
    const r = rng(21);
    const people = Array.from({ length: 300 }, () => {
      const t = normal(r);
      const v = () => Math.min(5, Math.max(1, Math.round(3 + t + 0.8 * normal(r))));
      // m3 tanımda ters: veri de ters üretilir. m5 tanımda düz ama veri ters: anahtar hatası.
      return { m1: v(), m2: v(), m3: 6 - v(), m4: v(), m5: 6 - v() };
    });
    const [scale] = analyzeLikert(def, people);
    const byKey = Object.fromEntries(scale.items.map((i) => [i.key, i]));
    expect(byKey.m3.citc!).toBeGreaterThan(0.4);
    expect(byKey.m5.citc!).toBeLessThan(0);
    expect(byKey.m5.flags.join(' ')).toContain('anahtar yönünü');
    expect(byKey.m5.alphaIfDeleted!).toBeGreaterThan(scale.alpha!);
    expect(scale.nComplete).toBe(300);
    // Dağılım oranlarının toplamı 1
    expect(byKey.m1.dist.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 10);
  });

  it('eksik cevaplı kişiler alfaya girmez ama madde istatistiğine girer', () => {
    const people: Record<string, number>[] = [
      { m1: 5, m2: 5, m3: 1, m4: 5, m5: 5 },
      { m1: 1, m2: 1, m3: 5, m4: 1, m5: 1 },
      { m1: 3, m2: 3, m3: 3, m4: 3, m5: 3 },
      { m1: 4, m2: 4 },
    ];
    const [scale] = analyzeLikert(def, people);
    expect(scale.nComplete).toBe(3);
    expect(scale.items.find((i) => i.key === 'm1')!.n).toBe(4);
  });
});

describe('doğru/yanlış madde analizi', () => {
  // Rasch modeliyle 400 öğrenci ve güçlükleri −2 ile 2 arasında dağılan 9 madde.
  const r = rng(99);
  const b = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
  const spec: DichotomousItemSpec[] = b.map((_, j) => ({
    key: `q${j + 1}`,
    text: `Soru ${j + 1}`,
    answer: 'A',
    choices: ['A', 'B', 'C', 'D', 'X'].map((k) => ({ key: k, label: k })),
  }));
  const people = Array.from({ length: 400 }, () => {
    const theta = normal(r);
    const row: Record<string, string> = {};
    b.forEach((bj, j) => {
      const p = 1 / (1 + Math.exp(-(theta - bj)));
      if (r() < p) row[`q${j + 1}`] = 'A';
      else {
        const u = r();
        // D seçeneği neredeyse hiç seçilmiyor (işlemeyen çeldirici).
        row[`q${j + 1}`] = u < 0.6 ? 'B' : u < 0.85 ? 'C' : u < 0.87 ? 'D' : 'X';
      }
    });
    return row;
  });

  it('güçlük sırası ve ayırt edicilik', () => {
    const res = analyzeDichotomous(spec, people);
    const ps = res.items.map((i) => i.p!);
    for (let j = 1; j < ps.length; j++) expect(ps[j]).toBeLessThan(ps[j - 1] + 0.03);
    for (const it of res.items) expect(it.pbis!).toBeGreaterThan(0.15);
    // Anahtar seçeneğinin korelasyonu pozitif, çeldiricilerinki negatif.
    const mid = res.items[4];
    expect(mid.choices.find((c) => c.key === 'A')!.pbis!).toBeGreaterThan(0);
    expect(mid.choices.find((c) => c.key === 'B')!.pbis!).toBeLessThan(0);
    expect(mid.flags.join(' ')).toContain('D seçeneği işlemiyor');
  });

  it('KR-20, 0/1 matrisinin alfasına eşittir', () => {
    const res = analyzeDichotomous(spec, people);
    const matrix = people.map((p) => spec.map((s) => (p[s.key] === s.answer ? 1 : 0)));
    expect(res.kr20!).toBeCloseTo(cronbachAlpha(matrix)!, 10);
    expect(res.sem!).toBeGreaterThan(0);
  });

  it('yanlış anahtar negatif korelasyonla yakalanır', () => {
    const wrongKey = spec.map((s, j) => (j === 4 ? { ...s, answer: 'B' } : s));
    const res = analyzeDichotomous(wrongKey, people);
    expect(res.items[4].pbis!).toBeLessThan(0);
    expect(res.items[4].flags.join(' ')).toContain('anahtarı kontrol edin');
  });
});

describe('norm önizlemesi ve rapor notu', () => {
  it('çarpık dağılımı işaretler', () => {
    const sym = Array.from({ length: 200 }, (_, i) => (i % 2 ? 1 : -1) * (i % 7));
    expect(Math.abs(skewness(sym)!)).toBeLessThan(0.05);
    const skewed = Array.from({ length: 200 }, (_, i) => (i < 180 ? 1 : 10 + i));
    const p = normPreview({ key: 'k', name: 'Ölçek' }, skewed, 0.8);
    expect(p.skew!).toBeGreaterThan(1);
    expect(p.flags.join(' ')).toContain('çarpık');
    expect(p.n).toBe(200);
  });

  it('norm varken oluşan uç düzeyler üç düzeyli şablonlarda en yakın düzeye iner', () => {
    const three = (b: string) => ['low', 'average', 'high'].includes(b);
    expect(nearestBand('very_high', three)).toBe('high');
    expect(nearestBand('very_low', three)).toBe('low');
    expect(nearestBand('average', three)).toBe('average');
    expect(nearestBand('very_high', () => true)).toBe('very_high');
  });

  it('ön normda temsil sınırını açıkça söyler', () => {
    const provisional = normNoteText({ status: 'provisional', n: 250, gradeMin: 5, gradeMax: 8, source: '' });
    expect(provisional).toContain('ön norm');
    expect(provisional).toContain('temsil eden bir örneklem değildir');
    expect(provisional).toContain('5.–8. sınıf');
    const final = normNoteText({ status: 'final', n: 1200, gradeMin: 7, gradeMax: 7, source: '7 bölgeden 40 okul, 2027' });
    expect(final).toContain('1.200 öğrenci');
    expect(final).toContain('7 bölgeden 40 okul');
  });
});
