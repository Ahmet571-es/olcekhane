import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { FOLDING_SPECS, kagitKatlama } from '@/content/instruments/kagit-katlama';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { HOLE_R, flap, inside, reflect, sameHoles, shapes, unfold, variant } from '@/lib/instruments/folding';
import { foldPanels } from '@/lib/instruments/folding-draw';
import type { FoldingItem, PaperFoldingTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { FOLDING_TYPES } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  FOLDING_CHANCE_MAX,
  foldingChance,
  FOLDING_RAPID_MS,
  TaskInputError,
  foldingLurePattern,
  foldingRapid,
  foldingSamePosition,
  scoreFolding,
  type FoldingTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { foldingBody, foldingOther, foldingRank, type FoldingCell } from './helpers/bodies';
import { holesBySimulation } from './helpers/fold-sim';
import { guessStrategies, optionProblems } from './helpers/folding-check';
import { schoolWords } from './helpers/school';

const SLUG = 'kagit-katlama';
const task = kagitKatlama.tasks[0] as PaperFoldingTask;
const ALL: { item: FoldingItem; answer: number }[] = [
  ...task.practice.map((p) => ({ item: p, answer: p.answer })),
  ...task.items.map((item, i) => ({ item, answer: task.answers[i] })),
];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])].filter(Boolean).join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Katlama türleri', 'Çalışma biçimi'];

describe('Kâğıt katlama: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; her türden sekiz soru; her türden bir alıştırma', () => {
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || task.items[i - 1].level <= it.level)).toBe(true);
    expect(new Set(ALL.map((x) => x.item.key)).size).toBe(27);
    expect(['half', 'partial', 'diagonal'].map((t) => task.items.filter((it) => it.type === t).length)).toEqual([8, 8, 8]);
    // Katlama sayısı düzeyle artar: 1. düzeyde tek katlama, 4. ve 5. düzeyde en az iki katlama.
    for (const it of task.items) {
      if (it.level === 1) expect(it.folds.length, it.key).toBe(1);
      if (it.level >= 3) expect(it.folds.length, it.key).toBeGreaterThanOrEqual(2);
      expect(it.folds.length, it.key).toBeLessThanOrEqual(3);
      expect(it.punches.length, it.key).toBeLessThanOrEqual(2);
    }
    expect(task.practice.map((p) => p.type)).toEqual(['half', 'partial', 'diagonal']);
    expect(task.practice.every((p) => p.explain.length > 80)).toBe(true);
    // Yönergeler alıştırma sayısıyla uyumlu; kâğıt katlayarak değil, zihinde çözülür.
    expect(task.instructions.join(' ')).toContain('üç alıştırma sorusu');
    expect(task.instructions.join(' ')).toContain('Kâğıt ya da kalem kullanmadan, zihninde çöz.');
    expect([task.answers.length, task.lures.length, task.lureKinds.length]).toEqual([24, 24, 24]);
  });

  it('katlamalar geçerli: kanat kalan parçanın dışına taşmaz; delik katlanmış kâğıdın içinde ve kenarlardan uzakta', () => {
    for (const { item } of ALL) {
      const sh = shapes(item.folds);
      item.folds.forEach((f, k) => {
        const fl = flap(item.folds, k);
        expect(fl.length, `${item.key} ${k}`).toBeGreaterThanOrEqual(3);
        // Kanadın her köşesinin aynası katlamadan sonraki kâğıdın içinde ya da kenarında.
        for (const p of fl) {
          const r = reflect(f, p);
          const onOrIn = inside(sh[k + 1], r) || sh[k + 1].some((_, i) => {
            const a = sh[k + 1][i];
            const b = sh[k + 1][(i + 1) % sh[k + 1].length];
            const cross = (b[0] - a[0]) * (r[1] - a[1]) - (b[1] - a[1]) * (r[0] - a[0]);
            const within = Math.min(a[0], b[0]) - 1e-6 <= r[0] && r[0] <= Math.max(a[0], b[0]) + 1e-6 && Math.min(a[1], b[1]) - 1e-6 <= r[1] && r[1] <= Math.max(a[1], b[1]) + 1e-6;
            return Math.abs(cross) < 1e-6 && within;
          });
          expect(onOrIn, `${item.key} ${k} ${p}`).toBe(true);
        }
      });
      for (const p of item.punches) expect(inside(sh[item.folds.length], p, HOLE_R + 0.3), `${item.key} ${p}`).toBe(true);
      // Çizim: her katlama için bir resim ve delikli son resim.
      expect(foldPanels(item.folds, item.punches)).toHaveLength(item.folds.length + 1);
    }
  });

  it('doğru seçenek bağımsız bir yolla doğrulanır: kâğıdın her noktası katlanınca deliğe düşen yerler', () => {
    for (const { item, answer } of ALL) {
      const sim = holesBySimulation(item.folds, item.punches, HOLE_R);
      expect(sameHoles(sim, item.options[answer - 1]), item.key).toBe(true);
      // Öteki seçeneklerin hiçbiri doğru değil.
      item.options.forEach((o, i) => {
        if (i !== answer - 1) expect(sameHoles(sim, o), `${item.key} ${i + 1}`).toBe(false);
      });
    }
  });

  it('seçenekler: beşi de farklı, delikler kenara taşmaz ve birbirine değmez', () => {
    for (const { item } of ALL) {
      expect(item.options, item.key).toHaveLength(5);
      expect(optionProblems(item.options), item.key).toEqual([]);
    }
  });

  it('doğru seçenek delik sayısından ya da öteki seçeneklere benzerliğinden bulunamaz', () => {
    for (const { item, answer } of ALL) {
      const key = item.options[answer - 1];
      // Doğru seçenekle aynı sayıda delikli en az bir yanlış seçenek var.
      expect(item.options.filter((o, i) => i !== answer - 1 && o.length === key.length).length, item.key).toBeGreaterThanOrEqual(1);
    }
    // Seçenekleri bir ölçüte göre sıralayıp hep aynı sıradakini seçen biri (ör. en çok delikli, öteki seçeneklerle en çok
    // ortak deliği olan, en simetrik): 24 soruda beklenen doğru sayısı rastgele seçmenin üst sınırının (8) belirgin altında.
    const totals = new Map<string, number>();
    task.items.forEach((item, i) => {
      for (const [name, p] of Object.entries(guessStrategies(item.options, task.answers[i] - 1))) totals.set(name, (totals.get(name) ?? 0) + p);
    });
    expect(totals.size).toBe(14);
    for (const [name, t] of totals) expect(t, name).toBeLessThanOrEqual(6.5);
    expect(FOLDING_CHANCE_MAX).toBe(8);
  });

  it('delikler kat kenarlarından uzakta: deliğin çevresindeki her noktada kat sayısı aynı (delik bir katın kenarına denk gelmez)', () => {
    for (const { item } of ALL) {
      const fin = shapes(item.folds)[item.folds.length];
      for (const p of item.punches) {
        const n = unfold(item.folds, [p]).length;
        for (let a = 0; a < 48; a++) {
          const r = HOLE_R + 0.8;
          const q = [p[0] + r * Math.cos((a * Math.PI) / 24), p[1] + r * Math.sin((a * Math.PI) / 24)] as const;
          if (!inside(fin, q)) continue;
          expect(unfold(item.folds, [q]).length, `${item.key} ${p} ${q}`).toBe(n);
        }
      }
    }
  });

  it('cevap anahtarı ve çeldiriciler beş seçeneğe dengeli; çeldirici gerçekten o yanılgıyla bulunur', () => {
    const count = (xs: number[]) => [1, 2, 3, 4, 5].map((o) => xs.filter((x) => x === o).length);
    expect(count(task.answers)).toEqual([5, 5, 5, 5, 4]);
    expect(count(task.lures)).toEqual([4, 5, 5, 5, 5]);
    expect(task.answers.every((a, i) => i === 0 || a !== task.answers[i - 1])).toBe(true);
    for (const [i, s] of FOLDING_SPECS.entries()) {
      expect(task.lures[i], s.key).not.toBe(task.answers[i]);
      const it = task.items[i];
      expect(sameHoles(it.options[task.lures[i] - 1], variant(s.folds, s.punches, s.lure)), s.key).toBe(true);
      expect(sameHoles(it.options[task.answers[i] - 1], unfold(s.folds, s.punches)), s.key).toBe(true);
    }
    // Yanılgı türleri: kenardan katlamaya özgü yanılgılar ("ortadan katlanmış sanmak", "tek kat olan yeri iki kat sanmak")
    // yalnızca kenardan katlamalı sorularda.
    expect(task.lureKinds.filter((k, i) => (k === 'single' || k === 'half') && task.items[i].type !== 'partial')).toEqual([]);
    expect(new Set(task.lureKinds)).toEqual(new Set(['skip', 'slide', 'half', 'single', 'axis']));
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, lures: task.lures, kinds: task.lureKinds, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: kagitKatlama.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
    expect(FOLDING_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
  });
});

/**
 * Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. 2026-10-22'de yalnızca düzeylerin
 * rapordaki sade anlatımı değişti (sorular, cevaplar ve puanlama aynı); bu yüzden sürüm 1 kaldı.
 */
const SORU_IZI = '5ca0704ea9e763aa';

describe('Kâğıt katlama: puanlama', () => {
  const all = (fn: (i: number) => Partial<FoldingTrialInput> = () => ({})): FoldingTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 15_000, ...fn(index) }));
  const cell = (i: number): FoldingCell => ({ level: task.items[i].level, type: task.items[i].type, answer: task.answers[i], lure: task.lures[i], i });
  const otherAt = (i: number) => ({ response: foldingOther(cell(i)) });

  it('hatasız: 24 doğru, bütün düzeyler ve türler tam', () => {
    const { result } = scoreFolding(task, all());
    expect(result.correct).toBe(24);
    expect(result.reached).toBe(5);
    expect(result.types.map((t) => `${t.type} ${t.correct}/${t.n}`)).toEqual(['half 8/8', 'partial 8/8', 'diagonal 8/8']);
    expect([result.wrong, result.lures, result.rapid, result.rapidOf]).toEqual([0, 0, 0, 15]);
    expect(result.samePosition).toBe(5);
  });

  it('çeldirici türleri, çok hızlı yanlış ve hep aynı yer ayrı ayrı sayılır', () => {
    const lure = scoreFolding(task, all((i) => (task.items[i].level >= 4 ? { response: task.lures[i] } : {}))).result;
    expect([lure.wrong, lure.lures]).toEqual([10, 10]);
    expect(lure.luresByKind).toEqual({ skip: 6, slide: 0, half: 3, single: 1, axis: 0 });
    expect(foldingLurePattern(lure)).toBe(true);
    const rapid = scoreFolding(task, all((i) => ({ rtMs: FOLDING_RAPID_MS - 1, ...otherAt(i) }))).result;
    expect([rapid.rapid, rapid.rapidOf, foldingRapid(rapid)]).toEqual([15, 15, true]);
    expect(scoreFolding(task, all(() => ({ rtMs: FOLDING_RAPID_MS - 1 }))).result.rapid).toBe(0);
    const same = scoreFolding(task, all(() => ({ response: 2 }))).result;
    expect([same.samePosition, foldingSamePosition(same)]).toEqual([24, true]);
    expect(FOLDING_CHANCE_MAX).toBe(8);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreFolding(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 6, 2.5, Number.NaN]) {
      expect(() => scoreFolding(task, ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreFolding({ ...task, answers: [], lures: [], lureKinds: [] }, ok)).toThrow(TaskInputError);
    const bad = foldingBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Kâğıt katlama: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar ve katlama türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, foldingBody((q) => ({ response: q.answer, rtMs: 8000 + 4000 * q.level })));
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Katlama türleri', '3 katlama türünün hepsinde bütün sorular doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 20 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.valueLabel])).toEqual([
      ['Ortadan katlama', '8/8'],
      ['Kenardan katlama', '8/8'],
      ['Çapraz katlama', '8/8'],
    ]);
    expect(rm.barsTitle).toBe('Katlama türlerine göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('durumlar: rastgele düzeyi, çeldiriciler, çok hızlı, hep aynı yer, tür farkı', () => {
    const none = evaluate(SLUG, foldingBody((q) => ({ response: foldingOther(q), rtMs: 9000 })));
    expect(none.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(none.student.roadmap!.bars).toEqual([]);
    const lure = evaluate(SLUG, foldingBody((q) => ({ response: q.level >= 4 ? q.lure : q.answer, rtMs: 20_000 })));
    expect(lure.student.items[0].text).toContain(
      'Yanlış cevaplarının hepsinde ilk bakışta doğru görünen ama katlamalara uymayan seçeneği seçtin. Bu yanlışlar şu yanılgılardan kaynaklanmış olabilir: kâğıdı açarken bir katlamayı atlamak; kenardan katlamayı kâğıdın ortasından katlanmış gibi açmak; kenardan katlamada kâğıdın tek kat kaldığı yeri iki kat sanmak.',
    );
    expect(lure.parent.items[0].text).toContain('Çocuğunuz yanlış cevaplarının hepsinde');
    const rapid = evaluate(SLUG, foldingBody((q) => ({ response: q.level >= 3 ? foldingOther(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 15 sorunun hepsinde yanlış bir cevap 2,5 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[3].text).toContain('15 sorunun hepsine 2,5 saniyeden kısa sürede yanlış cevap verdin');
    const same = evaluate(SLUG, foldingBody(() => ({ response: 2, rtMs: 9000 })));
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');
    // 1. düzeyde zorlanıp yanlışların çoğunda çeldiriciyi seçmek: düzey kartı dikkatsizlikten söz etmez, yanılgılara gönderir.
    const lowLure = foldingBody((q) => ({ response: q.level >= 2 && foldingRank(q) < 3 ? q.answer : q.lure, rtMs: 20_000 }));
    const lowRes = scoreFolding(task, (lowLure.data as { blocks: Record<string, FoldingTrialInput[]> }).blocks[task.key]).result;
    expect([lowRes.correct, lowRes.reached, foldingLurePattern(lowRes)]).toEqual([12, 0, true]);
    const low = evaluate(SLUG, lowLure);
    expect(low.student.items[1].text).toContain('Bu, yönergeyi tam anlamamaktan ya da doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir.');
    expect(low.parent.items[1].text).toContain('doğru cevaplar kartında anlatılan yanılgılardan kaynaklanabilir ve tek başına yorumlanmamalıdır.');
    expect(low.student.items[0].text).toContain('ilk bakışta doğru görünen');
    const diag = evaluate(SLUG, foldingBody((q) => ({ response: q.type === 'diagonal' ? foldingOther(q) : q.answer, rtMs: 20_000 })));
    expect(diag.student.items[2].badge).toBe('3 katlama türünün 2 tanesinde soruların çoğu doğru');
    expect(diag.student.items[2].text).toContain('“Ortadan katlama” ve “kenardan katlama” sorularının çoğunu doğru buldun; “çapraz katlama” sorularında zorlandın.');
    const ex = evaluate(SLUG, foldingBody());
    expect(ex.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(ex.student.items[1].text).toContain('1–3. düzeylerdeki soruların hepsini doğru cevapladın. 3. düzeydeki sorularda şu gerekiyordu: iki katlamayı (ortadan, çapraz ya da kenardan) sondan başa doğru açarak');
    expect(ex.student.items[1].text).toContain('4. düzeydeki 5 sorunun 3 tanesini doğru bulamadın. Bu düzeydeki sorularda şu gerekiyordu: üç kez katlanan');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: FoldingCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      kolaydaYanilma: (q) => !(q.level === 1 && foldingRank(q) < 2),
      duz: (q) => foldingRank(q) % 2 === 0,
      sekizDogru: (q) => q.i < FOLDING_CHANCE_MAX,
      dokuzDogru: (q) => q.i < FOLDING_CHANCE_MAX + 1,
      tureGore: (q) => q.type === 'half',
    };
    const wrongKinds: Record<string, (q: FoldingCell) => number> = { baska: foldingOther, celdirici: (q) => q.lure };
    const times: Record<string, (q: FoldingCell) => number | null> = {
      artan: (q) => 6000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 7000 * q.level,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = foldingBody((q) => ({ response: samePos ? 2 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const { result } = scoreFolding(task, (body.data as { blocks: Record<string, FoldingTrialInput[]> }).blocks[task.key]);
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const chance = foldingChance(result);
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
              expect(r.items.map((i) => i.title), label).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.roadmap!.bars.length, label).toBe(chance ? 0 : 3);
              expect(r.cautions.some((c) => c.includes('rastgele seçen')), label).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('2,5 saniyeden kısa'));
              expect(rapidNote, label).toBe(foldingRapid(result));
              expect(r.items[3].text.includes('2,5 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(foldingSamePosition(result));
              expect(r.items[3].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (rapidNote || sameNote) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/katlamalara bakmadan seçmiş|katlamalara bakılmadan seçilmiş/.test(r.items[0].text), label).toBe(rapidNote || sameNote);
              expect(r.items[0].text.includes('ilk bakışta doğru görünen'), label).toBe(!chance && foldingLurePattern(result));
              // Yanlışlar çeldiricilerden geliyorsa kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
              if (!chance && foldingLurePattern(result)) expect(r.items[0].text + r.items[1].text, label).not.toMatch(/dağılmasından/);
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge], label).toEqual(['Belirtilmedi', 'Düzey belirtilmedi']);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|cevapladın|ayırdın|zorlandın|seçtin|bulamadın|cevaplamadın)\b/);
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(9 * 2 * 4 * 2);
  }, 180_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, foldingBody(undefined, 2))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, foldingBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([kagitKatlama.intro.title, ...kagitKatlama.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
    expect(Object.keys(FOLDING_TYPES)).toEqual(['half', 'partial', 'diagonal']);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /KK_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(SLUG, foldingBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 9000 + 1000 * q.i })));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(3);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/kk_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"lures\\":\[\][\s\S]*\\"lureKinds\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, foldingBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, foldingBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı', () => {
    expect(kagitKatlama.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(kagitKatlama.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(kagitKatlama.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...kagitKatlama.science, citations: [] });
    const authors = ['Uttal', 'Wai'];
    expect(kagitKatlama.science.citations.map((c) => c.text.split(',')[0])).toEqual(authors);
    for (const a of authors) expect(body, a).toMatch(new RegExp(`${a}(’in| ve| ve ark\\.|,)`));
    expect(TASK_ROADMAPS[SLUG].sources.map((s) => s.url).sort()).toEqual(kagitKatlama.science.citations.map((c) => c.url).sort());
  });
});
