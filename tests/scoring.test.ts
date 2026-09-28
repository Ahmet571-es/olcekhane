import { describe, expect, it } from 'vitest';
import { besFaktor } from '@/content/instruments/bes-faktor';
import { okumaHizi } from '@/content/instruments/okuma-hizi';
import { ozSaygi } from '@/content/instruments/oz-saygi';
import { INSTRUMENTS } from '@/content/instruments';
import { anchoredBand, likertQuality, percentileBand, scoreLikert, type LikertAnswer } from '@/lib/scoring/likert';
import { countWords, passageForGrade, scoreReading } from '@/lib/scoring/reading';
import { cronbachAlpha, normalCdf } from '@/lib/scoring/stats';

const answersFrom = (pairs: [string, number][]): Record<string, LikertAnswer> =>
  Object.fromEntries(pairs.map(([k, v]) => [k, { value: v, rtMs: 2500 }]));

describe('istatistik', () => {
  it('normal dağılım', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1)).toBeCloseTo(0.1587, 3);
  });
  it('Cronbach alfa: paralel maddelerde yüksek, ilişkisiz maddelerde düşük', () => {
    const parallel = [
      [1, 1, 2], [2, 2, 2], [3, 3, 4], [4, 4, 4], [5, 5, 5], [2, 3, 2],
    ];
    expect(cronbachAlpha(parallel)!).toBeGreaterThan(0.9);
    const unrelated = [
      [1, 5, 3], [5, 1, 3], [3, 3, 1], [2, 4, 5], [4, 2, 2], [1, 1, 4],
    ];
    expect(cronbachAlpha(unrelated)!).toBeLessThan(0.3);
  });
});

describe('test tanımları tutarlı', () => {
  for (const def of INSTRUMENTS) {
    it(`${def.slug}`, () => {
      const scaleKeys = new Set(def.scales.map((s) => s.key));
      if (def.engine === 'likert') {
        const keys = def.items.map((i) => i.key);
        expect(new Set(keys).size).toBe(keys.length);
        for (const item of def.items) expect(scaleKeys.has(item.scale)).toBe(true);
        for (const s of def.scales) expect(def.items.some((i) => i.scale === s.key)).toBe(true);
        expect(def.options.length).toBeGreaterThanOrEqual(2);
      } else {
        for (const p of def.passages) {
          expect(p.questions.length).toBe(8);
          const answers = p.questions.map((q) => q.answer);
          expect(new Set(answers).size).toBeGreaterThanOrEqual(3); // doğru şıklar tek bir harfte toplanmasın
          for (const q of p.questions) expect(q.options.some((o) => o.key === q.answer)).toBe(true);
        }
      }
    });
  }
});

describe('Beş Faktör puanlama', () => {
  it('ters maddeler doğru çevriliyor', () => {
    // Dışadönüklük: düz maddelere 5, ters maddelere 1 → ortalama 5
    const pairs: [string, number][] = besFaktor.items.map((i) => [i.key, i.reverse ? 1 : 5]);
    const scores = scoreLikert(besFaktor, answersFrom(pairs));
    for (const s of scores) {
      expect(s.valid).toBe(true);
      expect(s.mean).toBe(5);
      expect(s.band).toBe('very_high');
      expect(s.basis).toBe('anchored');
      expect(s.ciLow!).toBeLessThan(5);
      expect(s.ciHigh).toBe(5);
    }
  });
  it('hep aynı seçenek: puanlar ortada ve kalite uyarısı var', () => {
    const answers = answersFrom(besFaktor.items.map((i) => [i.key, 5]));
    const scores = scoreLikert(besFaktor, answers);
    const ex = scores.find((s) => s.scaleKey === 'extraversion')!;
    expect(ex.mean).toBe(3); // 5 düz ×5 + 5 ters ×1 → 3
    expect(likertQuality(besFaktor, answers).straightLining).toBe(true);
  });
  it('eksik madde: %80 sınırı', () => {
    const pairs: [string, number][] = besFaktor.items.filter((i) => i.key !== 'E1' && i.key !== 'E2').map((i) => [i.key, 4]);
    let s = scoreLikert(besFaktor, answersFrom(pairs)).find((x) => x.scaleKey === 'extraversion')!;
    expect(s.valid).toBe(true);
    expect(s.nAnswered).toBe(8);
    const fewer = pairs.filter(([k]) => !['E3', 'E4', 'E5'].includes(k));
    s = scoreLikert(besFaktor, answersFrom(fewer)).find((x) => x.scaleKey === 'extraversion')!;
    expect(s.valid).toBe(false);
    expect(s.band).toBeNull();
  });
  it('norm varsa yüzdelik ve bant normdan hesaplanıyor', () => {
    const pairs: [string, number][] = besFaktor.items.map((i) => [i.key, i.reverse ? 2 : 4]);
    const scores = scoreLikert(besFaktor, answersFrom(pairs), {
      extraversion: { normSetId: 'n1', mean: 3.2, sd: 0.8, reliability: 0.85 },
    });
    const ex = scores.find((s) => s.scaleKey === 'extraversion')!;
    expect(ex.basis).toBe('norm');
    expect(ex.z).toBeCloseTo(1, 3);
    expect(ex.percentile).toBeCloseTo(84.1, 0);
    expect(ex.band).toBe('high');
    expect(percentileBand(95)).toBe('very_high');
  });
  it('çok hızlı cevaplar işaretleniyor', () => {
    const answers = Object.fromEntries(besFaktor.items.map((i, n) => [i.key, { value: (n % 5) + 1, rtMs: 300 }]));
    expect(likertQuality(besFaktor, answers).tooFast).toBe(true);
  });
});

describe('Öz-saygı puanlama', () => {
  it('olumlu kendilik algısı 30 puan', () => {
    const pairs: [string, number][] = ozSaygi.items.map((i) => [i.key, i.reverse ? 0 : 3]);
    const [s] = scoreLikert(ozSaygi, answersFrom(pairs));
    expect(s.raw).toBe(30);
    expect(s.value).toBe(30);
    expect(s.band).toBe('high');
  });
  it('hepsine "tamamen katılıyorum" 15 puan', () => {
    const [s] = scoreLikert(ozSaygi, answersFrom(ozSaygi.items.map((i) => [i.key, 3])));
    expect(s.value).toBe(15);
    expect(s.band).toBe('average');
  });
  it('bant eşikleri', () => {
    expect(anchoredBand(14, ozSaygi.anchoredBands)).toBe('low');
    expect(anchoredBand(15, ozSaygi.anchoredBands)).toBe('average');
    expect(anchoredBand(25, ozSaygi.anchoredBands)).toBe('average');
    expect(anchoredBand(26, ozSaygi.anchoredBands)).toBe('high');
  });
});

describe('Okuma', () => {
  it('kelime sayımı', () => {
    expect(countWords(['Bir iki üç.', '— dört, beş!'])).toBe(5);
  });
  it('sınıfa göre metin seçimi', () => {
    expect(passageForGrade(okumaHizi, 2).key).toBe('karincalar');
    expect(passageForGrade(okumaHizi, 5).key).toBe('catalhoyuk');
    expect(passageForGrade(okumaHizi, 8).key).toBe('arilar');
    expect(passageForGrade(okumaHizi, 13).key).toBe('uyku');
  });
  it('hız ve anlama', () => {
    const p = passageForGrade(okumaHizi, 7);
    const words = countWords(p.paragraphs);
    const answers = Object.fromEntries(p.questions.map((q) => [q.key, q.answer]));
    const r = scoreReading(p, 60000 * (words / 150), answers);
    expect(r.wpm).toBe(150);
    expect(r.correct).toBe(8);
    expect(r.band).toBe('very_high');
    expect(r.effectiveWpm).toBe(150);
    expect(r.flags.tooFast).toBe(false);
    const fast = scoreReading(p, 5000, {});
    expect(fast.flags.tooFast).toBe(true);
    expect(fast.band).toBe('low');
  });
  it('metin uzunlukları sınıf düzeyiyle artıyor', () => {
    const lengths = okumaHizi.passages.map((p) => countWords(p.paragraphs));
    for (let i = 1; i < lengths.length; i++) expect(lengths[i]).toBeGreaterThan(lengths[i - 1]);
  });
});
