import { describe, expect, it } from 'vitest';
import { matematik } from '@/content/instruments/matematik';
import { MISCONCEPTIONS } from '@/content/instruments/matematik/misconceptions';
import { groupDigits, plainMath } from '@/components/quiz/math-text';
import type { QuizForm } from '@/lib/instruments/types';
import { buildReport, type StoredScore } from '@/lib/reports/build';
import { DONT_KNOW, formForGrade, quizBand, scoreQuiz, type QuizAnswer, type QuizChoice } from '@/lib/scoring/quiz';

const forms = matematik.forms;

/** Seçenek metnini sayıya çevirir: "10 357", "−0,75", "%32", "65°", "{1 3/4}", "16.35". Sayı değilse null. */
function numeric(text: string): number | null {
  let s = text.replace(/[\s ]/g, '').replace(/−/g, '-').replace(/^%/, '').replace(/°$/, '');
  const neg = s.startsWith('-');
  if (neg) s = s.slice(1);
  let v: number | null = null;
  const frac = s.match(/^\{(\d+)\/(\d+)\}$/);
  const mixed = text.match(/\{(\d+) (\d+)\/(\d+)\}/);
  if (mixed) v = Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  else if (frac) v = Number(frac[1]) / Number(frac[2]);
  else if (/^\d+(,\d+)?$/.test(s)) v = Number(s.replace(',', '.'));
  else if (/^\d{2}\.\d{2}$/.test(s)) v = Number(s); // saat: 16.35
  if (v === null) return null;
  return neg ? -v : v;
}

function answersFor(form: QuizForm, pick: (i: number) => QuizChoice, rtMs = 30_000): Record<string, QuizAnswer> {
  return Object.fromEntries(form.items.map((it, i) => [it.key, { choice: pick(i), rtMs }]));
}

describe('Matematik Tanı Testi formları', () => {
  it('her sınıf için bir form var; öğrenci bir önceki sınıfın konularını çözüyor', () => {
    expect(forms.map((f) => f.grade)).toEqual([5, 6, 7, 8]);
    for (const f of forms) expect(f.contentGrade).toBe(f.grade - 1);
    expect(matematik.minGrade).toBe(5);
    expect(matematik.maxGrade).toBe(8);
  });

  it('her formda 20 soru ve her alanda 4 soru var; alanlar ölçek listesinde tanımlı', () => {
    const scaleKeys = new Set(matematik.scales.map((s) => s.key));
    for (const f of forms) {
      expect(f.items).toHaveLength(20);
      expect(f.domains).toHaveLength(5);
      for (const d of f.domains) {
        expect(scaleKeys.has(d.key)).toBe(true);
        expect(f.items.filter((i) => i.domain === d.key)).toHaveLength(4);
      }
    }
  });

  it('soru anahtarları bütün formlarda benzersiz ve metinler tekrarsız', () => {
    const all = forms.flatMap((f) => f.items);
    expect(new Set(all.map((i) => i.key)).size).toBe(all.length);
    for (const f of forms) expect(new Set(f.items.map((i) => i.text)).size).toBe(f.items.length);
  });

  it('her soruda dört farklı seçenek ve tek doğru cevap var', () => {
    for (const it of forms.flatMap((f) => f.items)) {
      expect(it.options.map((o) => o.key)).toEqual(['A', 'B', 'C', 'D']);
      expect(new Set(it.options.map((o) => o.text)).size).toBe(4);
      expect(it.options.some((o) => o.key === it.answer)).toBe(true);
      expect(it.options.find((o) => o.key === it.answer)?.misconception).toBeUndefined();
      expect(it.explain.length).toBeGreaterThan(20);
    }
  });

  it('doğru cevaplar harflere dengeli dağılmış ve aynı harf üç kez art arda gelmiyor', () => {
    for (const f of forms) {
      const keys = f.items.map((i) => i.answer);
      for (const l of ['A', 'B', 'C', 'D']) {
        const n = keys.filter((k) => k === l).length;
        expect(n, `${f.key} ${l}`).toBeGreaterThanOrEqual(4);
        expect(n, `${f.key} ${l}`).toBeLessThanOrEqual(6);
      }
      for (let i = 2; i < keys.length; i++) {
        expect(keys[i] === keys[i - 1] && keys[i] === keys[i - 2], `${f.key} ${i}`).toBe(false);
      }
    }
  });

  it('sayısal seçenekler sıralı yazılmış (paydaya göre sıralanan M7-20 dışında)', () => {
    for (const it of forms.flatMap((f) => f.items)) {
      const vals = it.options.map((o) => numeric(o.text));
      if (vals.some((v) => v === null) || it.key === 'M7-20') continue;
      const nums = vals as number[];
      const asc = nums.every((v, i) => i === 0 || v > nums[i - 1]);
      const desc = nums.every((v, i) => i === 0 || v < nums[i - 1]);
      expect(asc || desc, `${it.key}: ${nums.join(', ')}`).toBe(true);
    }
  });

  it('seçeneklerdeki hata türleri tanımlı ve tanımlı her hata türü en az bir soruda kullanılıyor', () => {
    const used = new Set<string>();
    for (const it of forms.flatMap((f) => f.items)) {
      for (const o of it.options) {
        if (!o.misconception) continue;
        expect(MISCONCEPTIONS[o.misconception], `${it.key} ${o.key}: ${o.misconception}`).toBeDefined();
        used.add(o.misconception);
      }
    }
    expect([...Object.keys(MISCONCEPTIONS)].filter((k) => !used.has(k))).toEqual([]);
    for (const m of Object.values(MISCONCEPTIONS)) {
      expect(m.name.length).toBeGreaterThan(3);
      expect(m.explain.length).toBeGreaterThan(20);
      expect(m.tip.length).toBeGreaterThan(20);
    }
  });

  it('sütun grafiklerinde değerler ölçek adımlarına tam oturuyor', () => {
    for (const it of forms.flatMap((f) => f.items)) {
      const c = it.chart;
      if (!c || c.kind === 'pie') continue;
      expect(c.labels.length).toBe(c.values.length);
      for (const v of c.values) {
        expect(v).toBeLessThanOrEqual(c.max!);
        if (!c.showValues) expect(v % c.step!).toBe(0);
      }
    }
  });

  it('paralel doğru şeklindeki açı etiketleri çizimle tutarlı', () => {
    for (const it of forms.flatMap((f) => f.items)) {
      const fig = it.figure;
      if (!fig || fig.kind !== 'parallel') continue;
      for (const m of fig.marks) {
        const deg = m.label.match(/^(\d+)°$/);
        if (!deg) continue;
        const expected = m.region === 'above-right' || m.region === 'below-left' ? fig.slope : 180 - fig.slope;
        expect(Number(deg[1])).toBe(expected);
      }
    }
  });

  it('form, öğrencinin sınıfına göre seçiliyor', () => {
    for (const g of [5, 6, 7, 8]) expect(formForGrade(matematik, g).grade).toBe(g);
    expect(formForGrade(matematik, 9).grade).toBe(8);
    expect(formForGrade(matematik, 4).grade).toBe(5);
  });
});

describe('Akademik test puanlaması', () => {
  const form = forms[1];

  it('bütün cevaplar doğruysa düzey “high” ve hata türü yok', () => {
    const r = scoreQuiz(form, answersFor(form, (i) => form.items[i].answer));
    expect(r.correct).toBe(20);
    expect(r.band).toBe('high');
    expect(r.misconceptions).toEqual([]);
    expect(r.domains.every((d) => d.correct === 4 && d.band === 'high')).toBe(true);
  });

  it('“Bilmiyorum” doğru sayılmıyor ve hata türü üretmiyor', () => {
    const r = scoreQuiz(form, answersFor(form, () => DONT_KNOW));
    expect(r.correct).toBe(0);
    expect(r.dontKnow).toBe(20);
    expect(r.wrong).toBe(0);
    expect(r.misconceptions).toEqual([]);
    expect(r.band).toBe('low');
  });

  it('seçilen yanlış seçeneklerin hata türleri soru numaralarıyla sayılıyor', () => {
    // Her soruda hata türü işaretli ilk yanlış seçeneği seç.
    const pick = (i: number) => form.items[i].options.find((o) => o.misconception)?.key ?? form.items[i].answer;
    const r = scoreQuiz(form, answersFor(form, pick));
    const total = r.misconceptions.reduce((s, m) => s + m.count, 0);
    expect(total).toBe(form.items.filter((it) => it.options.some((o) => o.misconception)).length);
    for (const m of r.misconceptions) {
      for (const no of m.itemNumbers) {
        const it = form.items[no - 1];
        expect(it.options.find((o) => o.key === r.items[no - 1].choice)?.misconception).toBe(m.key);
      }
    }
    // En sık görülen önce.
    for (let i = 1; i < r.misconceptions.length; i++) expect(r.misconceptions[i - 1].count).toBeGreaterThanOrEqual(r.misconceptions[i].count);
  });

  it('eşikler: 3/4 sağlam, 2/4 pekiştirilmeli, 1/4 öncelikli', () => {
    expect(quizBand(0.75)).toBe('high');
    expect(quizBand(0.5)).toBe('average');
    expect(quizBand(0.25)).toBe('low');
    expect(quizBand(15 / 20)).toBe('high');
    expect(quizBand(14 / 20)).toBe('average');
    expect(quizBand(9 / 20)).toBe('low');
  });

  it('çok hızlı ve hep aynı harfle cevaplamayı işaretliyor', () => {
    const fast = scoreQuiz(form, answersFor(form, () => 'A', 1500));
    expect(fast.flags.tooFast).toBe(true);
    expect(fast.flags.sameLetter).toBe(true);
    expect(fast.flags.notes).toHaveLength(2);
    const calm = scoreQuiz(form, answersFor(form, (i) => form.items[i].answer, 45_000));
    expect(calm.flags.tooFast).toBe(false);
    expect(calm.flags.sameLetter).toBe(false);
  });
});

describe('Akademik rapor', () => {
  it('öğrenci ve veli raporunda bütün sorular, alanlar ve hata türleri yer alıyor', () => {
    const form = forms[3];
    const pick = (i: number): QuizChoice => (i % 3 === 0 ? (form.items[i].options.find((o) => o.misconception)?.key ?? 'A') : form.items[i].answer);
    const result = scoreQuiz(form, answersFor(form, pick));
    const stored: StoredScore[] = [
      {
        scaleKey: 'total',
        raw: result.correct,
        mean: result.ratio,
        band: result.band,
        percentile: null,
        ciLow: null,
        ciHigh: null,
        nAnswered: 20,
        nItems: 20,
        normSetId: null,
        extra: JSON.parse(JSON.stringify(result)),
      },
    ];
    for (const audience of ['student', 'parent'] as const) {
      const rep = buildReport({
        def: matematik,
        scores: stored,
        audience,
        studentName: 'Deniz',
        grade: 8,
        completedAt: new Date('2026-09-29T10:00:00Z'),
        hasNorms: false,
      });
      const a = rep.academic!;
      expect(a.review).toHaveLength(20);
      expect(a.domains).toHaveLength(5);
      expect(a.correct).toBe(result.correct);
      expect(a.contentGrade).toBe(7);
      expect(a.text).toContain('7. sınıf');
      expect(a.text).not.toContain('{');
      expect(a.misconceptions.length).toBe(result.misconceptions.length);
      expect(a.review.filter((r) => !r.correct).length).toBe(20 - result.correct);
      expect(['Sağlam', 'Pekiştirilmeli', 'Öncelikli']).toContain(a.bandLabel);
    }
  });
});

describe('Matematik gösterimi', () => {
  it('üçerli gruplanmış sayıları birleştiriyor, dört basamaklıları ve kısa sayıları değiştirmiyor', () => {
    expect(groupDigits('102 045')).toBe('102 045');
    expect(groupDigits('3 × 1 000 000 + 5')).toBe('3 × 1 000 000 + 5');
    expect(groupDigits('18 sınıfın 32’şer')).toBe('18 sınıfın 32’şer');
    expect(groupDigits('4672 sayısı')).toBe('4672 sayısı');
  });

  it('kesirleri düz yazıya çeviriyor', () => {
    expect(plainMath('{3/8}’i')).toBe('3/8’i');
    expect(plainMath('{1 3/4}')).toBe('1 tam 3/4');
  });

  it('soru metinlerinde kapanmamış kesir işareti yok', () => {
    for (const it of forms.flatMap((f) => f.items)) {
      for (const s of [it.text, it.explain, ...it.options.map((o) => o.text)]) {
        const stripped = s.replace(/\{(?:\d+ )?\d+\/\d+\}/g, '');
        expect(stripped, it.key).not.toMatch(/[{}]/);
      }
    }
  });
});
