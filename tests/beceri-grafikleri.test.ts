import { describe, expect, it } from 'vitest';
import { getInstrumentDef } from '@/content/instruments';
import { sesliOkuma } from '@/content/instruments/sesli-okuma';
import { ACCURACY_LABEL, ACCURACY_LABEL_YOU } from '@/content/reports/sesli-okuma';
import { evaluate } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';
import type { QuizInstrument, ReadingInstrument } from '@/lib/instruments/types';
import { oralWordCount } from '@/lib/oral/words';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import { oralPassagesFor, type OralInput, type OralMark } from '@/lib/scoring/oral';
import { formForGrade } from '@/lib/scoring/quiz';
import { passageForGrade } from '@/lib/scoring/reading';
import { checkDrawn } from './helpers/visual-check';

/**
 * Okuma Hızı ve Anlama, Sesli Okuma Değerlendirmesi ve Matematik Konu Tarama Testinin kart grafikleri (site sahibinin
 * 2026-10-22 isteği: her başlık sözel açıklamanın yanında grafikle de anlatılır). Grafik kartın rozetiyle ve öne çıkan
 * sayılarla aynı şeyi söyler; grafikteki sayılar metinde yinelenmez; yazılar ekranda ve PDF'te taşmaz. Grafiği olmayan
 * kartlar yalnızca yorumlanmayan ya da hesaplanamayan sonuçlardır.
 */

function checkAll(r: SimpleReport, label: string, noVisual: string[] = []) {
  for (const it of r.items) {
    const at = `${label} ${r.audience} ${it.title}`;
    if (noVisual.includes(it.title)) {
      expect(it.visual, at).toBeUndefined();
      continue;
    }
    expect(it.visual, at).toBeDefined();
    checkDrawn(it.visual!, at);
  }
}

describe('Matematik Konu Tarama Testi', () => {
  const def = getInstrumentDef('matematik-konu-tarama-testi') as QuizInstrument;
  const body = (grade: number, choose: (i: number, answer: string, other: string) => string, rtMs = 40_000): AnswersBody => {
    const form = formForGrade(def, grade);
    return {
      grade,
      data: {
        engine: 'quiz',
        answers: Object.fromEntries(
          form.items.map((it, i) => [it.key, { choice: choose(i, it.answer, it.options.find((o) => o.key !== it.answer)!.key) as 'A', rtMs }]),
        ),
      },
    };
  };
  const patterns: [string, (i: number, a: string, o: string) => string, number?][] = [
    ['hepsi doğru', (_, a) => a],
    ['her üçte bir yanlış', (i, a, o) => (i % 3 === 0 ? o : a)],
    ['yarısı yanlış', (i, a, o) => (i % 2 === 0 ? o : a)],
    ['hepsi yanlış', (_, __, o) => o],
    ['bilmiyorum', (i, a) => (i < 8 ? 'X' : a)],
    ['ilk alan bilinmiyor', (i, a) => (i % 5 === 0 ? 'X' : a)],
    ['çok hızlı', (i, a, o) => (i % 2 ? o : a), 1500],
  ];
  const grades = [...new Set(def.forms.map((f) => f.grade))];

  it('her kartın grafiği var; genel sonucun çubuğu rozetle, alanların kareleri doğru sayısıyla aynı', () => {
    for (const grade of grades) {
      for (const [name, choose, rt] of patterns) {
        const reps = evaluate(def.slug, body(grade, choose, rt));
        for (const r of [reps.student, reps.parent]) {
          const label = `${grade}. sınıf ${name}`;
          // Cevaplar tahmin olabilir (çok hızlı ya da çoğu aynı seçenek): rozetler "Yorumlanmadı", grafik yok.
          if (r.items[0].badge === 'Yorumlanmadı') {
            checkAll(r, label, r.items.map((x) => x.title));
            expect(r.items.every((x) => x.badge === 'Yorumlanmadı'), label).toBe(true);
            expect(r.cautions.length, label).toBeGreaterThan(0);
            continue;
          }
          checkAll(r, label);
          const [genel, ...alanlar] = r.items;
          const g = genel.visual!;
          expect(g.type, label).toBe('gauge');
          if (g.type === 'gauge') {
            expect(g.zones[g.active!].label, label).toBe(genel.badge);
            expect(`${g.value}/${g.max}`, label).toBe(r.keyFigures[0].value);
            // Bölgeler bütün aralığı boşluksuz kaplar.
            expect(g.zones[0].from).toBe(0);
            expect(g.zones[g.zones.length - 1].to).toBe(g.max);
            for (let k = 1; k < g.zones.length; k++) expect(g.zones[k].from).toBe(g.zones[k - 1].to);
          }
          for (const a of alanlar) {
            const v = a.visual!;
            expect(v.type, `${label} ${a.title}`).toBe('dots');
            if (v.type === 'dots') {
              const { filled, total } = v.rows[0];
              // Grafikteki doğru sayısı metinde yinelenmez; sonuç sözle de anlatılır.
              expect(a.text, `${label} ${a.title}`).not.toContain(`${filled}/${total}`);
              expect(a.text, `${label} ${a.title}`).toMatch(/doğru yaptı|zorlandı|“Bilmiyorum”/);
              const ratio = filled / total;
              const band = ratio >= 0.75 ? 'Sağlam' : ratio >= 0.5 ? 'Pekiştirilmeli' : 'Öncelikli';
              expect(a.badge, `${label} ${a.title}`).toBe(band);
            }
          }
        }
      }
    }
  });

  it('PDF', async () => {
    const r = evaluate(def.slug, body(grades[0], (i, a, o) => (i % 3 === 0 ? o : a))).student;
    const pdf = await renderSimpleReportPdf(r, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  });
});

describe('Okuma Hızı ve Anlama', () => {
  const def = getInstrumentDef('okuma-hizi-ve-anlama') as ReadingInstrument;
  const body = (grade: number, wrong: number, readingMs: number): AnswersBody => {
    const p = passageForGrade(def, grade);
    return {
      grade,
      data: {
        engine: 'reading',
        passageKey: p.key,
        readingMs,
        answers: Object.fromEntries(p.questions.map((q, i) => [q.key, i < wrong ? q.options.find((o) => o.key !== q.answer)!.key : q.answer])),
      },
    };
  };

  it('anlama kartında sorular, hız kartında okuma hızı ve anlayarak okuma; yorumlanmayan hızın grafiği yok', () => {
    for (let grade = def.minGrade; grade <= def.maxGrade; grade++) {
      for (const wrong of [0, 1, 2, 3, 5, 8]) {
        for (const ms of [150_000, 2_000, 3_600_000]) {
          const reps = evaluate(def.slug, body(grade, wrong, ms));
          for (const r of [reps.student, reps.parent]) {
            const label = `${grade}. sınıf ${wrong} yanlış ${ms} ms`;
            const speed = r.items.find((x) => x.title === 'Okuma hızı')!;
            const speedRead = r.keyFigures[1].value !== '—';
            checkAll(r, label, speedRead ? [] : ['Okuma hızı']);
            const anlama = r.items.find((x) => x.title === 'Anlama')!;
            const v = anlama.visual!;
            expect(v.type === 'dots' && `${v.rows[0].filled}/${v.rows[0].total}`, label).toBe(r.keyFigures[0].value);
            const flagged = ms !== 150_000;
            expect(speed.badge === 'Yorumlanmadı', label).toBe(flagged);
            if (speed.visual?.type === 'bars') {
              const effective = r.keyFigures[2].value;
              expect(speed.visual.rows.map((x) => x.valueLabel), label).toEqual([r.keyFigures[1].value, effective === '—' ? 'hesaplanmadı' : effective]);
              expect(speed.text, label).toMatch(/anlayarak okuma hızı/i);
            }
            // Hız yorumlanmadıysa hiçbir yerde hız sayısı gösterilmez.
            if (!speedRead) {
              expect(r.keyFigures[2].value, label).toBe('—');
              const rm = JSON.stringify(r.roadmap ?? {});
              expect(rm, label).not.toMatch(/Dakikada \d/);
            }
          }
        }
      }
    }
  });
});

describe('Sesli Okuma Değerlendirmesi', () => {
  const def = sesliOkuma;
  const input = (key: string, o: Partial<OralInput> = {}): OralInput => {
    const p = def.passages.find((x) => x.key === key)!;
    const words = oralWordCount(p.paragraphs);
    return {
      passageKey: key,
      recordMs: 70_000,
      readingMs: Math.round((words / 70) * 60_000),
      timingAuto: true,
      audio: { quality: 'good', pauses: [[1000, 1400], [5000, 6200]], speechMs: 40_000, contour: Array.from({ length: 120 }, (_, i) => (i * 7) % 100), interrupted: false },
      marks: {},
      listened: 1,
      retell: { recorded: true, ideas: p.ideas.filter((_, i) => i % 2 === 0).map((x) => x.key) },
      answers: Object.fromEntries(p.questions.map((q) => [q.key, q.answer])),
      prosody: { expression: 3, phrasing: 2, smoothness: 4, pace: 3 },
      ...o,
    };
  };
  const subs = (n: number, every = 3): Record<string, OralMark> => Object.fromEntries(Array.from({ length: n }, (_, i) => [String(i * every), { s: 'sub' as const }]));

  it('doğru okuma çubuğu rozetle, hız çubukları öne çıkan sayılarla aynı; sınıf ortalaması yalnızca kendi sınıfının metninde', () => {
    for (const grade of [1, 2, 3, 4, 5, 6, 7, 8]) {
      for (const p of oralPassagesFor(def, grade)) {
        const n = oralWordCount(p.paragraphs);
        const variants: [string, OralInput][] = [
          ['rahat', input(p.key)],
          ['birkaç hata', input(p.key, { marks: subs(Math.ceil(n * 0.05)) })],
          ['çok hata', input(p.key, { marks: subs(Math.ceil(n * 0.2), 2) })],
          ['anlatma yok', input(p.key, { retell: null })],
          ['çok kısa süre', input(p.key, { readingMs: 3000 })],
          ['otomatik', (() => {
            const i = input(p.key, { auto: true, prosody: null, retell: null, marks: { '2': { s: 'unclear' }, '5': { s: 'sub' } } });
            delete i.listened;
            return i;
          })()],
        ];
        for (const [name, inp] of variants) {
          const reps = evaluate(def.slug, { grade, data: { engine: 'oral', ...inp } });
          for (const r of [reps.student, reps.parent]) {
            const label = `${grade}. sınıf ${p.key} ${name}`;
            const tooFast = name === 'çok kısa süre';
            checkAll(r, label, [...(tooFast ? ['Okuma hızı'] : []), ...(inp.retell === null && !inp.auto ? ['Yeniden anlatma'] : [])]);
            const acc = r.items.find((x) => x.title === 'Doğru okuma')!;
            const g = acc.visual!;
            expect(g.type, label).toBe('gauge');
            if (g.type === 'gauge') {
              expect(g.zones[g.active!].label, label).toBe(acc.badge);
              expect(g.valueLabel, label).toBe(r.keyFigures[1].value);
              expect(Object.values(r.audience === 'parent' ? ACCURACY_LABEL : ACCURACY_LABEL_YOU)).toContain(acc.badge);
              expect(g.value! >= g.min, label).toBe(true);
            }
            expect(acc.text, label).not.toContain(g.type === 'gauge' ? g.valueLabel : '—');
            const rate = r.items.find((x) => x.title === 'Okuma hızı')!;
            if (rate.visual?.type === 'bars') {
              expect(rate.visual.rows[1].valueLabel, label).toBe(r.keyFigures[0].value);
              const ref = def.referenceRates.find((x) => x.grade === grade);
              expect(!!rate.visual.reference, label).toBe(!!ref && p.grade === grade);
              if (rate.visual.reference) expect(rate.text, label).toContain(`ortalama ${rate.visual.reference.value} kelimeyi`);
            }
            const comp = r.items.find((x) => x.title === 'Okuduğunu anlama')!;
            const cv = comp.visual!;
            expect(cv.type === 'dots' && `${cv.rows[0].filled} / ${cv.rows[0].total}`, label).toBe(r.keyFigures[3].value);
            const retell = r.items.find((x) => x.title === 'Yeniden anlatma');
            if (retell?.visual?.type === 'dots') {
              const said = retell.visual.rows.reduce((k, x) => k + x.filled, 0);
              const all = retell.visual.rows.reduce((k, x) => k + x.total, 0);
              expect(`${said} / ${all} fikir`, label).toBe(retell.badge);
            }
          }
        }
      }
    }
  }, 60_000);

  it('PDF', async () => {
    const p = oralPassagesFor(def, 3)[0];
    const r = evaluate(def.slug, { grade: 3, data: { engine: 'oral', ...input(p.key, { marks: subs(4) }) } }).parent;
    const pdf = await renderSimpleReportPdf(r, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  });
});
