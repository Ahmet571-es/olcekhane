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
    expect(r.student.items[0].text).toContain('Ancak “Veri ve olasılık” alanındaki soruların çoğunda zorlandın');
    expect(r.parent.items[0].text).toContain('Ancak “Veri ve olasılık” alanındaki soruların çoğunda zorlandı');
  });

  it('genel sonuç orta ve bazı alanlar öncelikliyse o alanlar söylenir; alanların çoğu öncelikliyse "belirli konularda" denmez', () => {
    const form = formOf(7);
    const domainOf = (i: number) => form.items[i].domain;
    const keys = form.domains.map((x) => x.key);
    // 12/20: ilk iki alanın dört sorusunun hepsi yanlış (iki alan öncelikli), öteki üç alanın hepsi doğru.
    const avg = evaluate(SLUG, body(7, (i) => (keys.slice(0, 2).includes(domainOf(i)) ? wrongOf(7, i) : (form.items[i].answer as Choice))));
    expect(avg.student.items[0].badge).toBe('Pekiştirilmeli');
    expect(avg.student.items[0].text).toContain(`Ancak “${form.domains[0].name}” ve “${form.domains[1].name}” alanlarındaki sorularda zorlandın; çalışmaya bu alanlardan başlaman iyi olur.`);
    expect(avg.parent.items[0].text).toContain('çalışmaya bu alanlardan başlanması iyi olur');
    // 8/20: üç alan öncelikli (1/4), iki alan sağlam olsa da genel sonuç öncelikli; eksikler "belirli konularda" değil.
    let seen: Record<string, number> = {};
    const low = evaluate(
      SLUG,
      body(7, (i) => {
        const d = domainOf(i);
        seen[d] = (seen[d] ?? 0) + 1;
        const right = keys.slice(0, 3).includes(d) ? seen[d] === 1 : seen[d] <= 3 && d === keys[3] ? true : seen[d] <= 2;
        return right ? (form.items[i].answer as Choice) : wrongOf(7, i);
      }),
    );
    seen = {};
    expect(low.student.items[0].badge).toBe('Öncelikli');
    expect(low.student.items[0].text).not.toContain('belirli konularda');
  });

  it('bütün sorularda "Bilmiyorum" denirse sonuç yorumlanmaz; hata türü çıkarılmadığı söylenir', () => {
    const r = evaluate(SLUG, body(8, () => 'X'));
    for (const rep of [r.student, r.parent]) {
      expect(rep.items.every((x) => x.badge === 'Yorumlanmadı' && !x.visual)).toBe(true);
      expect(rep.items[0].text).toContain('neyi bildiğini gösteremiyor');
      expect(rep.items[0].text).not.toMatch(/belirli konularda|zorland/);
      expect(rep.chart).toBeNull();
      expect(rep.keyFigures[2].value).toBe('Yorumlanmadı');
      expect(rep.cautions).toContain('Bütün sorularda “Bilmiyorum” denmiş; bu yüzden sonuç yorumlanmadı.');
      expect(rep.quiz!.errorsNote).toContain('hata türü çıkarılmadı');
      expect(rep.roadmap!.bars).toEqual([]);
    }
    expect(r.student.quiz!.questions).toHaveLength(20);
    expect(r.student.quiz!.questions.every((q) => q.status === 'dontKnow')).toBe(true);
  });

  it('yayın denetimindeki gövde (cevaplar sırayla A, B, C, D) yorumlanır; yol haritasında beş alan', () => {
    const answers = Object.fromEntries(Array.from({ length: 20 }, (_, k) => [`M6-${String(k + 1).padStart(2, '0')}`, { choice: 'ABCD'[(k + 1) % 4] as Choice, rtMs: 40_000 }]));
    const r = evaluate(SLUG, { grade: 6, data: { engine: 'quiz', answers } });
    const m = r.parent.roadmap!;
    expect(m.bars).toHaveLength(5);
    expect(m.weeks[0].title).toBe('Hata defteri');
    expect(m.approach!.items.length).toBeGreaterThanOrEqual(1);
    expect(m.preview).toBe(false);
  });

  it('çok hızlı ya da hep aynı harfle cevaplanınca sonuç ve hata türleri yorumlanmaz', () => {
    for (const [ch, rt] of [[() => 'A' as Choice, 40_000], [(i: number) => (i % 2 ? 'A' : 'B') as Choice, 1500]] as const) {
      const r = evaluate(SLUG, body(5, ch, rt));
      for (const rep of [r.student, r.parent]) {
        expect(rep.quiz!.errors).toEqual([]);
        expect(rep.quiz!.errorsNote).toContain('hata türleri yorumlanmadı');
        expect(rep.quiz!.questions.every((q) => q.misconception === null)).toBe(true);
        expect(rep.items.every((x) => x.badge === 'Yorumlanmadı' && !x.visual)).toBe(true);
        expect(rep.items[0].text).toContain('tahminle verilmiş olabilir');
        expect(rep.items[0].text).not.toMatch(/biliyorsun|ne tür hatalar|belirli konularda/);
        const study = rep.roadmap!.study.items;
        expect(study.every((x) => x.badge.startsWith('Yorumlanmadı'))).toBe(true);
        expect(rep.roadmap!.weeks[0].text).not.toContain('nedenini');
      }
    }
  });

});
