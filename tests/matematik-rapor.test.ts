import { describe, expect, it } from 'vitest';
import { evaluate } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import type { QuizInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { def } from './helpers/bodies';

/**
 * Matematik Konu Tarama raporu: yanlış yapılan, "Bilmiyorum" denen ya da boş bırakılan her soru doğru cevabı ve
 * çözümüyle ekranda ve PDF'te gösterilir; hata türleri açıklama ve öneriyle verilir; genel metin alanlarla çelişmez.
 */
const SLUG = 'matematik-konu-tarama-testi';
const quiz = def<QuizInstrument>(SLUG);
type Choice = 'A' | 'B' | 'C' | 'D' | 'X';

function body(grade: number, pick: (i: number) => Choice, rtMs = 40_000): AnswersBody {
  const form = quiz.forms.find((f) => f.grade === grade)!;
  return {
    grade,
    data: {
      engine: 'quiz',
      answers: Object.fromEntries(
        form.items.map((it, i) => [it.key, { choice: pick(i), rtMs }]),
      ),
    },
  } as AnswersBody;
}
const formOf = (grade: number) => quiz.forms.find((f) => f.grade === grade)!;
const wrongOf = (grade: number, i: number): Choice => {
  const it = formOf(grade).items[i];
  return (it.options.find((o) => o.misconception)?.key ?? it.options.find((o) => o.key !== it.answer)!.key) as Choice;
};

describe('Matematik raporu: soru soru inceleme', () => {
  for (const grade of [5, 6, 7, 8]) {
    it(`${grade}. sınıf formu: yanlış, "Bilmiyorum" ve doğru karışık`, async () => {
      const form = formOf(grade);
      // Her 3 sorudan biri yanlış (hata türlü seçenek), her 5 sorudan biri "Bilmiyorum", gerisi doğru.
      const pick = (i: number): Choice => (i % 3 === 0 ? wrongOf(grade, i) : i % 5 === 1 ? 'X' : (form.items[i].answer as Choice));
      const r = evaluate(SLUG, body(grade, pick));
      const missed = form.items.map((it, i) => ({ it, i, c: pick(i) })).filter((x) => x.c !== x.it.answer);
      for (const audience of ['student', 'parent'] as const) {
        const rep = r[audience];
        const q = rep.quiz!;
        expect(q.questions.map((x) => x.no)).toEqual(missed.map((x) => x.i + 1));
        for (const x of q.questions) {
          const it = form.items[x.no - 1];
          expect(x.answer.startsWith(`${it.answer}) `)).toBe(true);
          expect(x.explain).toBe(it.explain);
          if (x.status === 'wrong') expect(x.chosen).toMatch(/^[ABCD]\) /);
          else expect(x.chosen).toBeNull();
        }
        // Hata türleri açıklaması ve önerisiyle; her biri hangi sorularda görüldüğünü söyler.
        for (const e of q.errors) {
          expect(e.explain.length).toBeGreaterThan(20);
          expect(e.tip.length).toBeGreaterThan(20);
          expect(e.seen).toMatch(/soruda görüldü/);
        }
        expect(rep.items.map((i) => i.title)).not.toContain('Dikkat etmen gereken hata türleri');
        expect(rep.chartNote).toContain('kaba bir göstergedir');
        expect(JSON.stringify(rep)).not.toMatch(/undefined|NaN|\{g\}|\{s\}|\{d\}/);
      }
      const pdf = await renderSimpleReportPdf(r.student, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }, 60_000);
  }

  it('bütün sorular doğruysa: ayrı genel metin, incelenecek soru yok', () => {
    const r = evaluate(SLUG, body(6, (i) => formOf(6).items[i].answer as Choice));
    expect(r.student.items[0].text).toContain('soruların hepsini doğru yaptın');
    expect(r.student.items[0].text).not.toContain('Aşağıda yanlış');
    expect(r.student.quiz!.questions).toEqual([]);
    expect(r.student.quiz!.intro).toContain('incelenecek yanlış soru yok');
  });

  it('genel sonuç iyi ama bir alan öncelikliyse o alan söylenir', () => {
    const form = formOf(7);
    const veri = form.items.map((it, i) => (it.domain === 'veri' ? i : -1)).filter((i) => i >= 0);
    // 16/20: veri alanındaki dört sorunun hepsi yanlış.
    const r = evaluate(SLUG, body(7, (i) => (veri.includes(i) ? wrongOf(7, i) : (form.items[i].answer as Choice))));
    expect(r.student.items[0].badge).toBe('Sağlam');
    expect(r.student.items[0].text).toContain('Ancak Veri ve olasılık alanındaki soruların çoğunda zorlandın');
    expect(r.parent.items[0].text).toContain('Ancak Veri ve olasılık alanındaki soruların çoğunda zorlandı');
  });

  it('bütün alanlar öncelikliyse eksiklerin "belirli konularda toplandığı" söylenmez', () => {
    const r = evaluate(SLUG, body(8, () => 'X'));
    expect(r.student.items[0].text).not.toContain('belirli konularda');
    expect(r.student.quiz!.questions).toHaveLength(20);
    expect(r.student.quiz!.questions.every((q) => q.status === 'dontKnow')).toBe(true);
  });

  it('çok hızlı ya da hep aynı harfle cevaplanınca hata türleri yorumlanmaz', () => {
    const r = evaluate(SLUG, body(5, () => 'A', 1500));
    for (const rep of [r.student, r.parent]) {
      expect(rep.quiz!.errors).toEqual([]);
      expect(rep.quiz!.errorsNote).toContain('hata türleri yorumlanmadı');
      expect(rep.quiz!.questions.every((q) => q.misconception === null)).toBe(true);
    }
  });

});
