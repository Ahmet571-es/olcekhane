import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { NUMERIC_SPECS, sayisalAkilYurutme } from '@/content/instruments/sayisal-akil-yurutme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { NUMERIC_EQUAL, NUMERIC_NONPROP, NUMERIC_PROP, numericRapidMs } from '@/lib/instruments/numeric';
import type { NumericKind, NumericLureKind, NumericalReasoningTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { NUMERIC_GROUPS } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  NUMERIC_BLANK_MANY,
  NUMERIC_GOOD,
  NUMERIC_LURE_KINDS,
  NUMERIC_LURE_NOTE,
  TaskInputError,
  countOf,
  numericFewAnswered,
  numericNumberDriven,
  numericRapid,
  numericRushed,
  scoreNumeric,
  type NumericTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { numericBody, type NumericCell } from './helpers/bodies';
import { NUMERIC_FORMAL, formalNumbers, numericExpected } from './helpers/numeric-check';
import { schoolWords } from './helpers/school';

const SLUG = 'sayisal-akil-yurutme';
const task = sayisalAkilYurutme.tasks[0] as NumericalReasoningTask;
const TITLES = ['Doğru cevaplar', 'Orantı mı, fark mı?', 'Eşitlik ve denge', 'Çalışma biçimi'];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const count = (k: NumericKind) => task.kinds.filter((x) => x === k).length;
const lureOf = (q: NumericCell, kind: NumericLureKind) => q.lures[kind]![0];
const trialsOf = (body: ReturnType<typeof numericBody>) => (body.data as { blocks: Record<string, NumericTrialInput[]> }).blocks[task.key];

describe('Sayısal akıl yürütme: sorular', () => {
  it('24 soru: 8 orantılı (4 tam katlı, 4 değil), 8 orantılı olmayan, 8 eşitlik ve denge; her yarıda her gruptan 4; 2 alıştırma', () => {
    expect(task.items).toHaveLength(24);
    expect(task.items.map((it) => it.key)).toEqual(Array.from({ length: 24 }, (_, i) => `sy${String(i + 1).padStart(2, '0')}`));
    expect(task.practice.map((p) => p.key)).toEqual(['syp1', 'syp2']);
    expect(['p', 'a', 'c', 'f', 'eq', 'comp', 'bal'].map((k) => count(k as NumericKind))).toEqual([8, 4, 2, 2, 2, 4, 2]);
    const ratioOf = (k: NumericKind, r: string) => task.kinds.filter((x, i) => x === k && task.ratios[i] === r).length;
    expect([ratioOf('p', 'int'), ratioOf('p', 'frac'), ratioOf('a', 'int'), ratioOf('a', 'frac')]).toEqual([4, 4, 2, 2]);
    task.kinds.forEach((k, i) => expect(task.ratios[i] !== null, task.items[i].key).toBe(k === 'p' || k === 'a'));
    for (const half of [task.kinds.slice(0, 12), task.kinds.slice(12)]) {
      expect(half.filter((k) => NUMERIC_PROP.includes(k))).toHaveLength(4);
      expect(half.filter((k) => NUMERIC_NONPROP.includes(k))).toHaveLength(4);
      expect(half.filter((k) => NUMERIC_EQUAL.includes(k))).toHaveLength(4);
    }
    // Aynı gruptan art arda en çok iki soru.
    const groupOf = (k: NumericKind) => (NUMERIC_PROP.includes(k) ? 'P' : NUMERIC_NONPROP.includes(k) ? 'N' : 'E');
    let run = 1;
    for (let i = 1; i < 24; i++) {
      run = groupOf(task.kinds[i]) === groupOf(task.kinds[i - 1]) ? run + 1 : 1;
      expect(run, task.items[i].key).toBeLessThanOrEqual(2);
    }
    expect(NUMERIC_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
  });

  it('cevap anahtarı ve yanılgı cevapları sorunun sayılarından bağımsızca hesaplanınca aynı çıkar; sayılar metinde geçer', () => {
    expect(Object.keys(NUMERIC_FORMAL).sort()).toEqual(task.items.map((it) => it.key).sort());
    for (const [i, it] of task.items.entries()) {
      const exp = numericExpected(it.key);
      expect(task.answers[i], it.key).toBe(exp.answer);
      expect(task.lures[i], it.key).toEqual(exp.lures);
      // Bütün cevaplar ve yanılgılar pozitif tam sayıdır, birbirinden farklıdır ve tuş takımıyla yazılabilir.
      const values = [task.answers[i], ...Object.values(task.lures[i]).flat()];
      for (const x of values) {
        expect(Number.isInteger(x) && x > 0 && x < 10 ** task.maxDigits, `${it.key} ${x}`).toBe(true);
      }
      expect(new Set(values).size, it.key).toBe(values.length);
      // Sorunun sayıları metinde geçer (biçimsel yazım soruyla aynı şeyi söyler).
      const numbers = [...it.stem, it.question].join(' ').match(/\d+/g)!.map(Number);
      for (const x of formalNumbers(it.key)) expect(numbers, `${it.key} ${x}`).toContain(x);
    }
    expect(task.practice.map((p) => p.answer)).toEqual([12, 7]);
  });

  it('yanılgı cevapları sorudaki bir sayıyı ya da iki sayının toplamını, oranını yazmakla karışmaz', () => {
    for (const [i, it] of task.items.entries()) {
      const shown = [...it.stem, it.question].join(' ').match(/\d+/g)!.map(Number);
      const lures = Object.values(task.lures[i]).flat();
      for (const x of lures) expect(shown, `${it.key} ${x}`).not.toContain(x);
      const f = NUMERIC_FORMAL[it.key];
      if (f.kind === 'p' || f.kind === 'a' || f.kind === 'c') {
        // Çarpanlar (c/a, b/a) ve sayıların toplamları (iki ya da üçü birden) ne doğru cevaptır ne de bir yanılgı cevabı.
        for (const x of [task.answers[i], ...lures]) {
          expect([f.c / f.a, f.b / f.a, f.c + f.b, f.a + f.b, f.a + f.c, f.a + f.b + f.c], `${it.key} ${x}`).not.toContain(x);
        }
      }
    }
    // Orantılı ve fark korunan durumlarda oranlar birbirini tekrar etmez (bir sorunun oranı ötekinin cevabını vermez).
    const rates = task.items.flatMap((it) => {
      const f = NUMERIC_FORMAL[it.key];
      return f.kind === 'p' || f.kind === 'a' ? [`${f.kind}:${f.b / f.a}`] : [];
    });
    expect(rates.filter((x) => x.startsWith('p:') && !Number.isInteger(Number(x.slice(2))))).toHaveLength(
      new Set(rates.filter((x) => x.startsWith('p:') && !Number.isInteger(Number(x.slice(2))))).size,
    );
  });

  it('tam katlı (int): iki oran da tam sayı; tam katlı olmayan (frac): ikisi de değil', () => {
    for (const [i, it] of task.items.entries()) {
      const f = NUMERIC_FORMAL[it.key];
      if (f.kind !== 'p' && f.kind !== 'a') continue;
      const internal = Number.isInteger(f.c / f.a);
      const external = Number.isInteger(f.b / f.a);
      expect(task.ratios[i], it.key).toBe(internal && external ? 'int' : !internal && !external ? 'frac' : 'karışık');
    }
  });

  it('denetleyici gerçekten hesaplar: bilinen örnekler', () => {
    expect(numericExpected('sy04')).toEqual({ answer: 15, lures: { additive: [12] } });
    expect(numericExpected('sy03')).toEqual({ answer: 18, lures: { proportional: [36] } });
    expect(numericExpected('sy12')).toEqual({ answer: 30, lures: { operational: [45], reverse: [26] } });
    expect(numericExpected('sy20')).toEqual({ answer: 3, lures: { operational: [8], reverse: [12] } });
  });

  it('metinler: cümleler noktayla, sorular soru işaretiyle biter; eşitliklerde tek bir kutu; durumlarda birim; Türkçe kesme işareti', () => {
    for (const it of [...task.practice, ...task.items]) {
      expect(it.question, it.key).toMatch(/^[0-9A-ZÇĞİÖŞÜ].*\?$/);
      if (it.equation) {
        expect(it.stem, it.key).toHaveLength(1);
        expect(it.stem[0], it.key).toMatch(/^(\d+ [+−×÷] \d+ = (□ [+−×÷] \d+|\d+ [+−×÷] □)|□ \+ \d+ = \d+)$/);
        expect(it.unit, it.key).toBeUndefined();
      } else {
        for (const x of it.stem) expect(x, it.key).toMatch(/^[0-9A-ZÇĞİÖŞÜ].*\.$/);
        expect(it.unit, it.key).toBeTruthy();
      }
      for (const x of [...it.stem, it.question]) expect(x, it.key).not.toContain("'");
    }
    task.items.forEach((it, i) => expect(!!it.equation, it.key).toBe(task.kinds[i] === 'eq' || task.kinds[i] === 'comp'));
  });

  it('çok hızlı cevap sınırı soru uzunluğuna göre: yaklaşık 2–5 saniye', () => {
    const ms = task.items.map(numericRapidMs);
    expect(Math.min(...ms)).toBeGreaterThanOrEqual(1800);
    expect(Math.max(...ms)).toBeLessThanOrEqual(5000);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, kinds: task.kinds, ratios: task.ratios, lures: task.lures }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: sayisalAkilYurutme.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '5a3986511bee7610';

describe('Sayısal akıl yürütme: puanlama', () => {
  const score = (pick?: (q: NumericCell) => { response: number | null; rtMs: number | null }) => scoreNumeric(task, trialsOf(numericBody(pick))).result;

  it('hatasız: 24 doğru; gruplar 8/8; yanılgı ve "Bilmiyorum" yok', () => {
    const r = score();
    expect([r.correct, r.accuracy, r.blank, r.rapid]).toEqual([24, 1, 0, 0]);
    expect([r.prop, r.nonProp, r.equal].map((g) => `${g.correct}/${g.n}`)).toEqual(['8/8', '8/8', '8/8']);
    expect(Object.values(r.lures)).toEqual([0, 0, 0, 0, 0, 0]);
    expect(numericNumberDriven(r)).toBe(false);
  });

  it('her yerde farkı koruyan: orantılı durumların hepsinde fark yanılgısı; fark korunanlar doğru', () => {
    const r = score((q) => ({ response: q.kind === 'p' ? lureOf(q, 'additive') : q.answer, rtMs: 9000 }));
    expect([r.prop.correct, r.lures.additive, r.kinds.a.correct, r.fracAdditive]).toEqual([0, 8, 4, 4]);
  });

  it('her yerde orantı kuran: orantılı olmayan durumların hepsinde orantı yanılgısı, türüne göre sayılır', () => {
    const r = score((q) => ({ response: NUMERIC_NONPROP.includes(q.kind) ? lureOf(q, 'proportional') : q.answer, rtMs: 9000 }));
    expect([r.nonProp.correct, r.lures.proportional, r.propLures.a, r.propLures.c, r.propLures.f, r.intProportional]).toEqual([0, 8, 4, 2, 2, 2]);
  });

  it('sayılara göre yöntem seçen: tam katlıda orantı, değilse fark', () => {
    const r = score((q) => ({
      response: q.kind === 'p' && q.ratio === 'frac' ? lureOf(q, 'additive') : q.kind === 'a' && q.ratio === 'int' ? lureOf(q, 'proportional') : q.answer,
      rtMs: 9000,
    }));
    expect([r.congruent.correct, r.incongruent.correct, r.fracAdditive, r.intProportional, numericNumberDriven(r)]).toEqual([6, 0, 4, 2, true]);
  });

  it('eşitlikte işlem sonucu, ters denkleştirme ve terazinin bir kefesi ayrı sayılır', () => {
    const r = score((q) => ({
      response: q.kind === 'eq' ? lureOf(q, 'operational') : q.kind === 'comp' ? lureOf(q, 'reverse') : q.kind === 'bal' ? lureOf(q, 'partial') : q.answer,
      rtMs: 9000,
    }));
    expect([r.equal.correct, r.lures.operational, r.lures.reverse, r.lures.partial]).toEqual([0, 2, 4, 2]);
  });

  it('"Bilmiyorum", çok hızlı cevaplar ve geçersiz girdiler', () => {
    const blank = score((q) => ({ response: q.i < 12 ? null : q.answer, rtMs: 9000 }));
    expect([blank.blank, blank.correct, blank.prop.blank + blank.nonProp.blank + blank.equal.blank]).toEqual([12, 12, 12]);
    expect(NUMERIC_BLANK_MANY).toBe(12);
    // Cevap yazıldığı için yalnızca kısa sürede yazılan yanlış cevaplara bakılır: en az 6 olunca acele uyarısı.
    const fast = score((q) => ({ response: q.i < 6 && q.i % 2 ? q.answer + 1 : q.answer, rtMs: q.i < 6 ? 800 : 9000 }));
    expect([fast.rapid, fast.rapidCorrect, numericRapid(fast)]).toEqual([6, 3, false]);
    const fastWrong = score((q) => ({ response: q.i < 6 ? q.answer + 1 : q.answer, rtMs: q.i < 6 ? 800 : 9000 }));
    expect([fastWrong.rapid, fastWrong.rapidCorrect, numericRapid(fastWrong), numericRushed(fastWrong)]).toEqual([6, 0, true, false]);
    const quick = score((q) => ({ response: q.answer, rtMs: 800 }));
    expect([quick.rapid, numericRapid(quick)]).toEqual([24, false]);
    // Kısa sürede denen "Bilmiyorum" cevap sayılmaz; ayrıca sayılır.
    const skip = score(() => ({ response: null, rtMs: 800 }));
    expect([skip.rapid, skip.rapidBlank, numericRapid(skip), numericFewAnswered(skip)]).toEqual([0, 24, false, true]);
    expect(score((q) => ({ response: q.answer, rtMs: null })).medianRt).toBeNull();

    const ok = trialsOf(numericBody());
    expect(() => scoreNumeric(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [-1, 1.5, 10_000, Number.NaN]) {
      expect(
        () =>
          scoreNumeric(
            task,
            ok.map((t, i) => (i === 3 ? { ...t, response: { answer: bad } } : t)),
          ),
        String(bad),
      ).toThrow(TaskInputError);
    }
    expect(() => scoreNumeric(task, [...ok, { index: 24, response: null, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreNumeric(task, [...ok, { index: 0, response: { answer: 1 }, rtMs: 1 }]).result.correct).toBe(24);
    expect(() => scoreNumeric({ ...task, answers: [], kinds: [], ratios: [], lures: [] }, ok)).toThrow(TaskInputError);
    const bad = numericBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Sayısal akıl yürütme: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar, grafik ve soru gruplarının üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, numericBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Orantı mı, fark mı?', 'Orantılı 8/8 · Orantılı olmayan 8/8'],
      ['Eşitlik ve denge', '8 soruda 8 doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 9 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '24/24'],
      ['Durum soruları', '16/16'],
      ['Eşitlik soruları', '8/8'],
      ['Soru başına tipik süre', '9 saniye'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.valueLabel])).toEqual(NUMERIC_GROUPS.map((g) => [g.name, '8/8']));
    expect(rm.barsTitle).toBe('Soru gruplarına göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(r.student.items[0].text).toMatch(/^Bütün sorularda doğru cevap verdin: hem günlük durumlarda/);
    expect(r.student.items[1].text).toContain('her soruda ayırt ettin');
    expect(r.student.items[2].text).toContain('her soruda buldun');
    // Türlerin sayıları kartların grafiğindedir; metinde yinelenmez.
    const rows = (i: number) => (r.student.items[i].visual?.type === 'bars' ? r.student.items[i].visual.rows.map((x) => `${x.label} ${x.valueLabel}`) : []);
    expect(rows(1)).toEqual([
      'Orantılı: sayılar birbirinin katı 4/4',
      'Orantılı: sayılar birbirinin katı değil 4/4',
      'Orantılı değil: fark korunuyor 4/4',
      'Orantılı değil: başta bir miktar var 2/2',
      'Orantılı değil: sonuç değişmiyor 2/2',
    ]);
    expect(rows(2)).toEqual(['Eşittir işareti 2/2', 'Denkleştirme 4/4', 'Terazi 2/2']);
    expect(text(r.student)).not.toMatch(/\d+ tanes/);
  });

  it('durumlar: fark yanılgısı, orantı yanılgısı, ters orantı, sayılara göre yöntem, eşitlik yanılgıları, "Bilmiyorum", çok hızlı', () => {
    const additive = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.kind === 'p' ? lureOf(q, 'additive') : q.answer, rtMs: 9000 })),
    );
    expect(additive.student.items[1].text).toContain('Orantılı durumların hepsinde iki sayı arasındaki farkı korudun.');
    expect(additive.student.items[1].text).toContain('Bir araştırmada bu yanılgı 4. sınıftan 6. sınıfa doğru arttı, sonraki sınıflarda azaldı.');
    expect(additive.parent.items[1].text).toMatch(
      /^Çocuğunuz orantılı durumlarda, orantılı olmayanlardan daha az doğru cevap verdi\. Orantılı durumların hepsinde iki sayı arasındaki farkı korudu\./,
    );
    expect(
      evaluateAdult(SLUG, { ...numericBody((q) => ({ response: q.kind === 'p' ? lureOf(q, 'additive') : q.answer, rtMs: 9000 })), grade: ADULT_GRADE }).adult
        .items[1].text,
    ).not.toMatch(/[Aa]raştırma/);

    const onlyAdd = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.kind === 'a' ? lureOf(q, 'proportional') : q.answer, rtMs: 9000 })),
    );
    expect(onlyAdd.student.items[1].text).toContain(
      'Orantılı olmayan durumların yarısında orantı kurdun. Oysa her durum orantılı değildir. Aynı hızla ilerleyen iki şeyde aradaki fark hep aynı kalır.',
    );

    const constant = evaluate(
      SLUG,
      numericBody((q) => ({
        response: q.kind === 'c' ? (q.lures.inverse ? lureOf(q, 'inverse') : lureOf(q, 'proportional')) : q.kind === 'f' ? lureOf(q, 'proportional') : q.answer,
        rtMs: 9000,
      })),
    );
    expect(constant.student.items[1].text).toContain('Bir soruda miktar artınca süreyi kısalttın');
    expect(constant.student.items[1].text).toContain(
      'Orantılı olmayan durumların 3 tanesinde orantı kurdun. Oysa her durum orantılı değildir. Başlangıçta var olan miktar katlanmaz; yalnızca sonradan eklenen kısım artar. Bazı durumlarda miktar artsa da sonuç hiç değişmez.',
    );

    const numberDriven = evaluate(
      SLUG,
      numericBody((q) => ({
        response: q.kind === 'p' && q.ratio === 'frac' ? lureOf(q, 'additive') : q.kind === 'a' && q.ratio === 'int' ? lureOf(q, 'proportional') : q.answer,
        rtMs: 9000,
      })),
    );
    // Aynı yanlışlar tek bir nedenle anlatılır: yaşa bağlı fark yanılgısı cümlesi yazılmaz.
    expect(numberDriven.student.items[1].text).toContain(
      'Sayılar birbirinin katı olmadığında farkı korudun, katı olduğunda ise orantı kurdun. Yöntemi durumdan çok sayılara bakarak seçmiş olabilirsin.',
    );
    expect(numberDriven.student.items[1].text).not.toContain('ayırt ett');
    expect(numberDriven.student.items[1].text).not.toContain('Orantılı durumların');
    expect(numberDriven.student.items[1].text.match(/araştırma/gi)).toHaveLength(1);
    // Hemen hepsi doğru ama eşitlikte iki yanılgı: "hem … hem …" yazılmaz.
    const nearly = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.kind === 'eq' ? lureOf(q, 'operational') : q.answer, rtMs: 9000 })),
    );
    expect(nearly.student.items[0].text).toBe(
      'Soruların hemen hepsinde doğru cevap verdin. Doğru bulamadığın birkaç sorunun hangi türden olduğunu aşağıdaki kartlar gösterir.',
    );
    expect(evaluate(SLUG, numericBody()).student.items[0].text).toContain('hem günlük durumlarda hem de eşitliklerde');

    const eq = evaluate(
      SLUG,
      numericBody((q) => ({
        response: q.kind === 'eq' ? lureOf(q, 'operational') : q.kind === 'comp' ? lureOf(q, 'reverse') : q.kind === 'bal' ? lureOf(q, 'partial') : q.answer,
        rtMs: 9000,
      })),
    );
    const e = eq.student.items[2].text;
    expect(e).toContain('2 soruda eşittir işaretinin solundaki işlemin sonucunu');
    expect(e).toContain('4 soruda bir sayı değişince ötekini ters yönde değiştirdin');
    expect(e).toContain('Terazi sorularının ikisinde de');
    expect(e).toMatch(/^Eşitlik ve denge sorularının hiçbirinde doğru cevap vermedin\./);
    expect(eq.student.items[2].badge).toBe('8 soruda 0 doğru');

    const blank = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.i % 2 ? null : q.answer, rtMs: 9000 })),
    );
    expect(blank.student.cautions.join(' ')).toContain('24 sorunun yarısında “Bilmiyorum” denmiş');
    expect(blank.student.items[0].text).toContain('Soruların yarısında “Bilmiyorum” dediğin için');
    expect(blank.student.items[3].text).toContain('Soruların yarısında “Bilmiyorum” dedin. Bu düğme, emin olunmayan soruda tahmin etmek yerine kullanılır; bu sorular doğru sayılmadı.');
    expect(blank.student.items[1].text).toMatch(/Bu sorulardan \d+ tanesinde “Bilmiyorum” dedin; bunlar doğru sayılmadı\./);
    expect(blank.student.keyFigures.find((f) => f.label === '“Bilmiyorum” denen sorular')?.value).toBe('12');
    // Birkaç "Bilmiyorum" da anlatılır (uyarı olmadan).
    const someBlank = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.i < 2 ? null : q.answer, rtMs: 9000 })),
    );
    expect(someBlank.student.cautions).toEqual([]);
    expect(someBlank.student.items[3].text).toContain('Soruların 2 tanesinde “Bilmiyorum” dedin.');

    const fast = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.i % 2 ? q.answer : q.answer + 1, rtMs: 900 })),
    );
    // Kısa sürede yazılan cevapların yarısı doğru: soru okunmuş, acele edilmiş olabilir; sonuç yorumlanır.
    expect(fast.student.cautions).toEqual([
      'Sayısal akıl yürütme testinde 24 sorunun yarısında cevap çok kısa sürede yazılmış ve yanlış. Bu sorularda acele edilmiş olabilir.',
    ]);
    expect(fast.student.items[0].badge).toBe('24 soruda 12 doğru');
    expect(fast.student.items[0].text).toContain('12 soruda acele etmiş olabileceğin için');
    expect(fast.student.items[3].text).toContain('12 soruda cevabı çok kısa sürede yazdın ve bu cevaplar yanlıştı. Bu sorularda acele etmiş olabilirsin.');
    expect(fast.student.items[3].text).not.toContain('hız tek başına');
    expect(text(fast.student)).not.toContain('okumadan');
    // Bütün cevaplar kısa sürede ve yanlış: sonuç yorumlanmaz.
    const rushed = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.answer + 1, rtMs: 900 })),
    );
    expect(rushed.student.items.slice(0, 3).map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    expect(rushed.student.cautions.join(' ')).toContain('Bu sonuç yorumlanmamalıdır.');
    expect(rushed.student.chart).toBeNull();
    // Hep kısa sürede "Bilmiyorum": cevap yazılmadığı için sonuç yorumlanmaz; "okumadan cevap" denmez.
    const fastBlank = evaluate(
      SLUG,
      numericBody(() => ({ response: null, rtMs: 900 })),
    );
    expect(fastBlank.student.items[0].text).toMatch(/^Soruların hepsinde “Bilmiyorum” dedin\. Cevap yazdığın soru çok az olduğu için sonuç yorumlanmadı\./);
    expect(fastBlank.student.items.slice(0, 3).map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    expect(text(fastBlank.student)).not.toContain('okumadan');
    // Birkaç soruda kısa sürede "Bilmiyorum": atlanmış olabileceği söylenir.
    const skipped = evaluate(
      SLUG,
      numericBody((q) => (q.i < 4 ? { response: null, rtMs: 900 } : { response: q.answer, rtMs: 9000 })),
    );
    expect(skipped.student.cautions).toEqual([]);
    expect(skipped.student.items[3].text).toContain('4 soruda, soruyu okumaya yetmeyecek kadar kısa sürede “Bilmiyorum” dedin. Bu soruları atlamış olabilirsin.');
    const quick = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.answer, rtMs: 900 })),
    );
    expect(quick.student.cautions).toEqual([]);
  });

  it('rastgele 1500 cevap düzeninde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    let s = 20261009;
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    let n = 0;
    for (let k = 0; k < 1500; k++) {
      // Her tür için doğru, yanılgı, başka yanlış ve "Bilmiyorum" olasılıkları; süre düzeni.
      const kinds: NumericKind[] = ['p', 'a', 'c', 'f', 'eq', 'comp', 'bal'];
      const pr = Object.fromEntries(kinds.map((x) => [x, [rnd(), rnd(), rnd() * 0.4, k % 9 === 0 ? 0.6 : rnd() * 0.2]])) as Record<NumericKind, number[]>;
      const timing = k % 7 === 0 ? 'hizli' : k % 7 === 1 ? 'yok' : 'normal';
      const pick = (q: NumericCell) => {
        const [pc, pl, po, pb] = pr[q.kind];
        const total = pc + pl + po + pb;
        const x = rnd() * total;
        const lureValues = Object.values(q.lures).flat();
        let response: number | null;
        if (x < pc) response = q.answer;
        else if (x < pc + pl) {
          const ks = Object.keys(q.lures) as NumericLureKind[];
          response = q.lures[ks[Math.floor(rnd() * ks.length)]]![0];
        } else if (x < pc + pl + po) {
          response = [q.answer + 1, q.answer + 2, q.answer + 3].find((v) => !lureValues.includes(v))!;
        } else response = null;
        return { response, rtMs: timing === 'yok' ? null : timing === 'hizli' && q.i % 3 === 0 ? 900 : 8000 + 300 * q.i };
      };
      const body = numericBody(pick, 5 + (k % 9));
      const label = `${k}/${timing}`;
      const res = evaluate(SLUG, body);
      const result = scoreNumeric(task, trialsOf(body)).result;
      const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
      const good = (x: { correct: number }) => x.correct >= NUMERIC_GOOD;
      const notRead = numericFewAnswered(result) || numericRushed(result);
      const rapid = numericRapid(result);
      const driven = numericNumberDriven(result);
      const L = result.lures;
      const proOther = driven ? L.proportional - result.intProportional : L.proportional;
      for (const r of [res.student, res.parent, adult]) {
        const t = text(r);
        expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
        expect(
          r.items.map((i) => i.title),
          label,
        ).toEqual(TITLES);
        for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
        // Nicelik sözleri sayılarla uyuşur ("8 durumun 8 tanesi", "0 tanesi", "1 tanesi" denmez).
        expect(`${t} ${r.cautions.join(' ')}`, label).not.toMatch(/\b(\d+) (sorunun|durumun) \1 tanes|(^|\s)[01] tanes/);
        // Yorumlanmayan sonucun rozetleri, grafikleri ve öne çıkan sayıları sonuç gibi görünmez.
        if (notRead) {
          expect(r.items.slice(0, 3).map((i) => i.badge), label).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
          expect(r.items.slice(0, 3).every((i) => i.visual === undefined), label).toBe(true);
          expect(r.chart, label).toBeNull();
          expect(r.roadmap!.bars, label).toEqual([]);
          expect(r.keyFigures[0].value, label).toBe('Yorumlanmadı');
        } else {
          expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
          expect(r.items[1].badge, label).toBe(`Orantılı ${result.prop.correct}/8 · Orantılı olmayan ${result.nonProp.correct}/8`);
          expect(r.items[2].badge, label).toBe(`8 soruda ${result.equal.correct} doğru`);
          const o = r.items[1].text;
          const e = r.items[2].text;
          // Yanılgılar yalnızca en az iki cevapta görülünce ve sayılarla uyuşan sözle anlatılır.
          expect(/durumların \S+ ?\S* iki sayı arasındaki farkı korud/.test(o), label).toBe(L.additive >= NUMERIC_LURE_NOTE && !driven);
          if (L.additive >= NUMERIC_LURE_NOTE && !driven) expect(o, label).toContain(`durumların ${countOf(L.additive, 8, 'inde')} iki sayı arasındaki farkı korud`);
          expect(/olmayan durumların .* orantı kurd/.test(o), label).toBe(proOther >= NUMERIC_LURE_NOTE);
          if (proOther >= NUMERIC_LURE_NOTE) {
            expect(o, label).toContain(`olmayan durumların ${countOf(L.proportional, 8, 'inde')} orantı kurd`);
            expect(o.includes('aradaki fark hep aynı kalır'), label).toBe(result.propLures.a > 0);
            expect(o.includes('miktar katlanmaz'), label).toBe(result.propLures.f > 0);
            expect(o.includes('sonuç hiç değişmez'), label).toBe(result.propLures.c > 0);
          }
          expect(o.includes('süreyi kısalt'), label).toBe(L.inverse >= 1);
          expect(o.includes('sayılara bakarak seçmiş olabilir'), label).toBe(driven);
          // "Çoğunlukla" ya da "her soruda" yalnızca iki grup da en az 6/8 iken.
          expect(o.includes('ayırt ett'), label).toBe(good(result.prop) && good(result.nonProp));
          expect(e.includes('“sonuç şudur”'), label).toBe(L.operational >= NUMERIC_LURE_NOTE);
          expect(e.includes('ters yönde değiştird'), label).toBe(L.reverse >= NUMERIC_LURE_NOTE);
          expect(/[Tt]erazi sorularının/.test(e), label).toBe(L.partial >= 1);
          expect(e.includes('eksik sayıyı'), label).toBe(result.equal.correct >= NUMERIC_GOOD && L.operational < NUMERIC_LURE_NOTE && L.reverse < NUMERIC_LURE_NOTE);
          expect(r.items[0].text.includes('hem günlük durumlarda'), label).toBe(
            result.correct >= 22 && [result.prop, result.nonProp, result.equal].every((g) => g.correct >= 7),
          );
          // "Bilmiyorum" denen sorular kartlarda da söylenir.
          expect(o.includes('“Bilmiyorum” ded'), label).toBe(result.prop.blank + result.nonProp.blank > 0);
          expect(e.includes('“Bilmiyorum” ded'), label).toBe(result.equal.blank > 0);
          // Araştırma bulguları (sınıflara göre) yetişkine yazılmaz.
          if (r === adult) expect(o + e, label).not.toMatch(/[Aa]raştırma/);
          expect(r.items[0].text.includes('acele etmiş olabileceğin') || r.items[0].text.includes('acele edilmiş olabileceği'), label).toBe(rapid);
          // Grafik, sütunlar ve öne çıkan sayılar kartlarla aynı sayıları gösterir.
          expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(
            NUMERIC_GROUPS.map((g) => `${result[g.key].correct}/8`),
          );
          expect(
            r.roadmap!.bars.map((b) => b.valueLabel),
            label,
          ).toEqual(NUMERIC_GROUPS.map((g) => `${result[g.key].correct}/8`));
          const k = result.kinds;
          expect(r.items[1].visual?.type === 'bars' ? r.items[1].visual.rows.map((x) => x.valueLabel) : [], label).toEqual(
            [result.pInt, result.pFrac, k.a, k.f, k.c].map((g) => `${g.correct}/${g.n}`),
          );
        }
        // Uyarılar ve kart metinleri uyumlu.
        expect(
          r.cautions.some((c) => c.includes('“Bilmiyorum” denmiş')),
          label,
        ).toBe(result.blank >= NUMERIC_BLANK_MANY || numericFewAnswered(result));
        expect(r.cautions.some((c) => c.includes('yorumlanmamalıdır')), label).toBe(notRead);
        expect(
          r.cautions.some((c) => c.includes('kısa sürede yazılmış ve yanlış')),
          label,
        ).toBe(rapid);
        expect(/kısa sürede yazd(ın|ı) ve bu cevaplar yanlıştı/.test(r.items[3].text), label).toBe(rapid);
        expect(r.items[3].text.includes('hız tek başına'), label).toBe(!rapid && result.medianRt !== null);
      }
      expect(text(res.student), label).not.toContain('Çocuğunuz');
      expect(text(adult), label).not.toContain('Çocuğunuz');
      expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|ettin|dedin|korudun|kurdun|değiştirdin|yazdın|kısalttın|olabilirsin|olabileceğin)\b/);
      expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
      n++;
    }
    expect(n).toBe(1500);
  }, 300_000);

  it('5. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, numericBody(undefined, 4))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, numericBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(rmText).not.toMatch(/kitap/i);
    expect(
      schoolWords(
        [sayisalAkilYurutme.intro.title, ...sayisalAkilYurutme.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '),
      ),
    ).toEqual([]);
    // Sorularda yalnızca bir kişinin yaşı geçer ("3 yaşındayken"); okula özgü sözcük yoktur.
    expect(schoolWords(task.items.flatMap((it) => [...it.stem, it.question]).join(' ')).filter((w) => !w.startsWith('yaşında'))).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /SY_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      numericBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 9000 + 100 * q.i })),
    );
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(3);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/sy_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"kinds\\":\[\][\s\S]*\\"lures\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(
      SLUG,
      numericBody((q) => ({ response: q.kind === 'p' && q.ratio === 'frac' ? lureOf(q, 'additive') : q.answer, rtMs: 9000 })),
    );
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, numericBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı ve metinde anılıyor', () => {
    expect(sayisalAkilYurutme.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(sayisalAkilYurutme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(sayisalAkilYurutme.science.citations.every((c) => c.url?.startsWith('https://'))).toBe(true);
    const body = JSON.stringify({ ...sayisalAkilYurutme.science, citations: [] });
    for (const a of ['Fernández ve ark., 2012', 'Van Dooren ve ark., 2004', 'Knuth ve ark., 2006']) expect(body, a).toContain(a);
    expect(NUMERIC_LURE_KINDS).toHaveLength(6);
  });
});
