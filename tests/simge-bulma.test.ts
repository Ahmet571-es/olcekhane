import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { SYMBOL_SEARCH_GLYPHS, SYMBOL_SEARCH_LOOKALIKES, simgeBulma } from '@/content/instruments/simge-bulma';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { SECICI_GOALS } from '@/content/test-secici';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { taskTrial } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { SG_BLOCK, symbolSearchTrials } from '@/lib/instruments/symbol-search';
import type { SymbolSearchTask, SymbolSearchTrial } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  SG_MIN_ACCURACY,
  SG_MIN_ANSWERED,
  TaskInputError,
  scoreSymbolSearch,
  sgAccGap,
  sgAccLower,
  sgHalvesApart,
  sgNotRead,
  sgAbsentSlower,
  sgLookFaster,
  sgLookSlower,
  sgTooFast,
  type SymbolSearchResult,
  type SymbolSearchTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { SEED, sgRight, sgWrong, symbolSearchBody, type SymbolSearchCell, type SymbolSearchPlay } from './helpers/bodies';
import { connected, isUnit, oneJointSwap, sameShape, shared, spansBox } from './helpers/symbol-search-check';
import { schoolWords } from './helpers/school';

const SLUG = 'simge-bulma';
const task = simgeBulma.tasks[0] as SymbolSearchTask;
const TITLES = ['Çalışma hızı', 'Doğruluk ve hata türleri', 'Benzer simgeler', 'Var mı, yok mu?', 'Hız ve doğruluk dengesi'];

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const inputOf = (body: ReturnType<typeof symbolSearchBody>) => (body.data as unknown as { blocks: Record<string, SymbolSearchTrialInput[]> }).blocks[task.key];
const resultOf = (body: ReturnType<typeof symbolSearchBody>) => scoreSymbolSearch(task, symbolSearchTrials(task, SEED), inputOf(body)).result;

/** Denemenin geçerliliği (bağımsız): sıra, aranan simgeler, benzer. */
function checkTrial(t: SymbolSearchTrial, label: string) {
  const n = task.glyphs.length;
  expect(t.group, label).toHaveLength(task.groupSize);
  expect(t.targets[0], label).not.toBe(t.targets[1]);
  for (const g of t.targets) expect(g >= 0 && g < n, label).toBe(true);
  const keys = t.group.map((r) => `${r.g}:${r.l ?? '-'}`);
  expect(new Set(keys).size, label).toBe(keys.length);
  const shownTargets = t.group.filter((r) => r.l === undefined && t.targets.includes(r.g));
  expect(shownTargets.length, label).toBe(t.present ? 1 : 0);
  const looks = t.group.filter((r) => r.l !== undefined);
  expect(looks.length, label).toBe(t.lookalike ? 1 : 0);
  for (const l of looks) {
    expect(t.targets.includes(l.g), label).toBe(true);
    expect(l.l! >= 0 && l.l! < task.lookalikes[l.g].length, label).toBe(true);
  }
  for (const r of t.group) if (r.l === undefined && !t.targets.includes(r.g)) expect(r.g >= 0 && r.g < n, label).toBe(true);
}

describe('Simge bulma: simgeler', () => {
  it('14 simge; her biri dört birim çizgi, bağlı ve ızgaranın bütününe yayılmış (bağımsız denetleyici)', () => {
    expect(SYMBOL_SEARCH_GLYPHS).toHaveLength(14);
    expect(task.glyphs).toBe(SYMBOL_SEARCH_GLYPHS);
    for (const [i, g] of SYMBOL_SEARCH_GLYPHS.entries()) {
      expect(g, `simge ${i}`).toHaveLength(4);
      expect(new Set(g).size, `simge ${i}`).toBe(4);
      expect(g.every(isUnit), `simge ${i}`).toBe(true);
      expect(connected(g), `simge ${i}`).toBe(true);
      expect(spansBox(g), `simge ${i}`).toBe(true);
    }
  });

  it('havuzdaki iki simge en çok bir çizgi paylaşır; hiçbiri ötekinin döndürülmüş ya da aynadaki görüntüsü değildir', () => {
    const G = SYMBOL_SEARCH_GLYPHS;
    for (let i = 0; i < G.length; i++) {
      for (let j = i + 1; j < G.length; j++) {
        expect(shared(G[i], G[j]), `${i}-${j}`).toBeLessThanOrEqual(1);
        expect(sameShape(G[i], G[j]), `${i}-${j}`).toBe(false);
      }
    }
  });

  it('her simgenin iki ya da üç benzeri: tek çizgisi bir ucunun çevresinde döndürülmüş; hiçbir havuz simgesinin görüntüsü değil; yalnızca kendi simgesine benzer', () => {
    const G = SYMBOL_SEARCH_GLYPHS;
    expect(SYMBOL_SEARCH_LOOKALIKES).toHaveLength(G.length);
    for (const [i, looks] of SYMBOL_SEARCH_LOOKALIKES.entries()) {
      expect(looks.length, `simge ${i}`).toBeGreaterThanOrEqual(2);
      expect(looks.length, `simge ${i}`).toBeLessThanOrEqual(3);
      for (const [k, l] of looks.entries()) {
        const label = `simge ${i} benzer ${k}`;
        expect(l.every(isUnit) && new Set(l).size === 4, label).toBe(true);
        expect(connected(l), label).toBe(true);
        expect(spansBox(l), label).toBe(true);
        expect(oneJointSwap(G[i], l), label).toBe(true);
        for (const [j, o] of G.entries()) {
          expect(sameShape(o, l), `${label} ~ ${j}`).toBe(false);
          if (j !== i) expect(shared(o, l), `${label} ~ ${j}`).toBeLessThanOrEqual(2);
        }
      }
      // Bir simgenin benzerleri birbirinden farklıdır.
      expect(new Set(looks.map((l) => [...l].sort().join(' '))).size, `simge ${i}`).toBe(looks.length);
    }
  });

  it('simgeler sabit: değişirse testin ve üreticinin sürüm numarası artırılmalı', () => {
    const hash = JSON.stringify([SYMBOL_SEARCH_GLYPHS, SYMBOL_SEARCH_LOOKALIKES, task.practice]);
    expect(hash.length).toBe(2383);
    expect(simgeBulma.version).toBe(1);
    expect(task.generator).toBe(1);
  });
});

describe('Simge bulma: denemeler', () => {
  it('alıştırma: altı deneme, dört türün hepsi; kurallara uyar', () => {
    expect(task.practice).toHaveLength(6);
    task.practice.forEach((t, i) => checkTrial(t, `alıştırma ${i}`));
    for (const present of [true, false]) for (const look of [true, false]) expect(task.practice.some((t) => t.present === present && t.lookalike === look)).toBe(true);
  });

  it('üretici belirlenimci: aynı tohum aynı denemeler, farklı tohum farklı denemeler', () => {
    expect(symbolSearchTrials(task, SEED)).toEqual(symbolSearchTrials(task, SEED));
    expect(symbolSearchTrials(task, SEED)).not.toEqual(symbolSearchTrials(task, '0f1c2e0b-3e4b-4a8a-9a55-5d1f0c8e2a12'));
  });

  it('birçok tohumda: 240 deneme; sekizli bloklarda türler, yerler ve aranan simgeler dengeli; art arda denemelerde aranan simge yinelenmez', () => {
    expect(task.trials).toBe(240);
    expect(task.groupSize).toBe(4);
    expect(task.trials % SG_BLOCK).toBe(0);
    for (let s = 0; s < 60; s++) {
      const seed = `00000000-0000-4000-8000-${String(s).padStart(12, '0')}`;
      const trials = symbolSearchTrials(task, seed);
      expect(trials).toHaveLength(task.trials);
      const asTarget = new Array(task.glyphs.length).fill(0);
      trials.forEach((t, i) => {
        checkTrial(t, `${seed} ${i}`);
        // Çizgi düzeyinde: "var" denemesinde sıradaki tam bir simgenin çizgileri aranan simgelerden biriyle aynı, "yok"
        // denemesinde hiçbiri aynı değil; benzerin çizgileri hiçbir aranan simgeninkiyle aynı değil.
        const set = (x: string[]) => [...x].sort().join(' ');
        const targetSets = t.targets.map((g) => set(task.glyphs[g]));
        const groupSets = t.group.map((r) => set(r.l === undefined ? task.glyphs[r.g] : task.lookalikes[r.g][r.l]));
        expect(groupSets.filter((x) => targetSets.includes(x)).length, `${seed} ${i}`).toBe(t.present ? 1 : 0);
        for (const r of t.group) if (r.l !== undefined) expect(targetSets.includes(set(task.lookalikes[r.g][r.l])), `${seed} ${i}`).toBe(false);
        if (i > 0) for (const g of t.targets) expect(trials[i - 1].targets.includes(g), `${seed} ${i}`).toBe(false);
        for (const g of t.targets) asTarget[g]++;
      });
      for (let b = 0; b < trials.length; b += SG_BLOCK) {
        const block = trials.slice(b, b + SG_BLOCK);
        const label = `${seed} blok ${b / SG_BLOCK}`;
        for (const present of [true, false]) {
          for (const look of [true, false]) expect(block.filter((t) => t.present === present && t.lookalike === look).length, label).toBe(2);
        }
        const pres = block.filter((t) => t.present);
        // Aranan simgenin sıradaki yeri bloktaki dört "var" denemesinde dört yerin her biri; iki deneme birinci, iki deneme ikinci aranan simge.
        expect(pres.map((t) => t.group.findIndex((r) => r.l === undefined && t.targets.includes(r.g))).sort(), label).toEqual([0, 1, 2, 3]);
        expect(pres.map((t) => t.targets.indexOf(t.group.find((r) => r.l === undefined && t.targets.includes(r.g))!.g)).sort(), label).toEqual([0, 0, 1, 1]);
        const looks = block.filter((t) => t.lookalike);
        expect(looks.map((t) => t.targets.indexOf(t.group.find((r) => r.l !== undefined)!.g)).sort(), label).toEqual([0, 0, 1, 1]);
      }
      // Her simge aranan simge olarak yaklaşık eşit sıklıkta (beklenen 240 × 2 / 14 ≈ 34,3).
      for (const k of asTarget) {
        expect(k, seed).toBeGreaterThanOrEqual(30);
        expect(k, seed).toBeLessThanOrEqual(39);
      }
    }
  });
});

describe('Simge bulma: puanlama', () => {
  it('varsayılan örnek: doğrular, yanlış türleri, türlere göre kararlar, hızlı ve yavaş yarılar, çeyrekler', () => {
    const r = resultOf(symbolSearchBody());
    expect(r.answered).toBe(63);
    expect(r.correct).toBe(56);
    expect([r.falseYok, r.falseVar, r.falseVarLook]).toEqual([3, 4, 4]);
    expect(r.wrong).toBe(r.falseVar + r.falseYok);
    expect(r.net).toBe(r.correct - r.wrong);
    expect(r.quarters.reduce((a, b) => a + b, 0)).toBe(r.correct);
    expect(r.present.n + r.absent.n).toBe(r.answered);
    expect(r.look.n + r.plain.n).toBe(r.answered);
    // Hızlı ve yavaş kararlar ortanca süreye göre ayrılır; ortancaya eşit süreler ikisine de girmez.
    expect(r.timed).toBe(r.answered);
    expect(r.fast.n + r.slow.n).toBeLessThanOrEqual(r.timed);
    expect(r.fast.medianRt!).toBeLessThan(r.slow.medianRt!);
    expect(r.finishedAll).toBe(false);
    expect(r.activeMs).toBe(task.durationMs);
    expect(r.perMinute).toBe(28);
    expect(sgNotRead(r)).toBeNull();
    expect(sgAbsentSlower(r)).toBe(true);
  });

  it('boş blok kabul edilir (süre boyunca hiç karar yok); sonuç yorumlanmaz', () => {
    const r = scoreSymbolSearch(task, symbolSearchTrials(task, SEED), []).result;
    expect(sgNotRead(r)).toBe('none');
    const rep = evaluate(SLUG, symbolSearchBody(() => null));
    expect(rep.student.items.map((i) => i.badge)).toEqual(TITLES.map(() => 'Yorumlanmadı'));
    expect(rep.student.cautions.join(' ')).toContain('hiç karar verilmedi');
  });

  it('yorumlanmama nedenleri: az karar, tek düğme, rastgele düzeyde doğruluk; çok hızlı kararlar uyarı', () => {
    expect(sgNotRead(resultOf(symbolSearchBody((q) => (q.i < SG_MIN_ANSWERED - 1 ? { ans: sgRight(q) } : null))))).toBe('few');
    expect(sgNotRead(resultOf(symbolSearchBody((q) => (q.i < SG_MIN_ANSWERED ? { ans: sgRight(q) } : null))))).toBeNull();
    expect(sgNotRead(resultOf(symbolSearchBody(() => ({ ans: 'yok', rtMs: 700 }))))).toBe('oneButton');
    const chance = resultOf(symbolSearchBody((q) => ({ ans: q.i % 2 ? 'var' : 'yok', rtMs: 900 })));
    expect(chance.accuracy).toBeLessThan(SG_MIN_ACCURACY);
    expect(sgNotRead(chance)).toBe('chance');
    const fast = resultOf(symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: q.i % 4 === 0 ? 250 : 1500 })));
    expect(sgNotRead(fast)).toBeNull();
    expect(sgTooFast(fast)).toBe(true);
    expect(sgTooFast(resultOf(symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: q.i % 10 === 0 ? 250 : 1500 }))))).toBe(false);
  });

  it('bütün karar süreleri aynıysa hızlı ve yavaş kararlar ayrılmaz', () => {
    const r = evaluate(SLUG, symbolSearchBody((q) => ({ ans: q.i % 8 === 0 ? sgWrong(q) : sgRight(q), rtMs: 1500 })));
    expect(['Belirgin fark yok', 'Karşılaştırılmadı']).toContain(r.student.items[4].badge);
    expect(r.student.items[4].text).toContain('süreleri birbirine çok yakın');
  });

  it('bütün denemeler süre dolmadan cevaplanırsa çalışılan süre son cevabın anıdır', () => {
    const trials = symbolSearchTrials(task, SEED);
    const input: SymbolSearchTrialInput[] = trials.map((t, i) => ({ index: i, response: { ans: t.present ? 'var' : 'yok', at: 450 * (i + 1) }, rtMs: 420 }));
    const r = scoreSymbolSearch(task, trials, input).result;
    expect(r.finishedAll).toBe(true);
    expect(r.activeMs).toBe(108_000);
    expect(r.perMinute).toBe(133.3);
  });

  it('rapor: bütün denemeler süre dolmadan bittiyse sayılar çalışılan süreyle söylenir', () => {
    const body = symbolSearchBody((q) => ({ ans: sgRight(q), rtMs: 330 }));
    const r = evaluate(SLUG, body);
    const res = resultOf(body);
    expect(res.finishedAll).toBe(true);
    const secs = Math.round(res.activeMs / 1000);
    expect(r.student.items[0].text).toContain(`${secs} saniyede ${task.trials} karar verdin`);
    expect(r.student.items[0].text).toContain('Bütün denemeleri süre dolmadan bitirdin. Bu yüzden doğru karar sayın hızını olduğundan düşük gösterebilir');
    expect(r.parent.items[0].text).toContain('Çocuğunuz bütün denemeleri süre dolmadan bitirdi.');
    expect(r.student.keyFigures[0].label).toBe(`Doğru karar (${secs} saniyede)`);
    expect(r.student.chartNote).toContain(`Bütün denemeler ${secs}. saniyede bittiği için`);
  });

  it('geçersiz cevaplar reddedilir', () => {
    const trials = symbolSearchTrials(task, SEED);
    const ok = (i: number, at = 1000 * (i + 1)): SymbolSearchTrialInput => ({ index: i, response: { ans: 'var', at }, rtMs: 900 });
    const bad: SymbolSearchTrialInput[][] = [
      [ok(1)],
      [ok(0), ok(0)],
      [ok(0), ok(2)],
      [ok(0, 5000), ok(1, 4000)],
      [ok(0, task.durationMs + 6_000)],
      [{ index: 0, response: { ans: 'belki' as 'var', at: 10 }, rtMs: 900 }],
      [{ index: 0, response: { ans: 'var', at: 10 }, rtMs: -1 }],
      [{ index: 0, response: { ans: 'var', at: Number.NaN }, rtMs: 900 }],
      // Karar süresi, önceki cevaptan bu yana geçen süreden (bir saniyelik payla) uzun olamaz.
      Array.from({ length: 160 }, (_, i) => ({ index: i, response: { ans: 'var' as const, at: i + 1 }, rtMs: 900 })),
      [ok(0, 1000), { index: 1, response: { ans: 'var', at: 1500 }, rtMs: 1600 }],
      Array.from({ length: task.trials + 1 }, (_, i) => ({ index: i, response: { ans: 'var' as const, at: 100 * i }, rtMs: 50 })),
    ];
    for (const input of bad) expect(() => scoreSymbolSearch(task, trials, input), JSON.stringify(input[0])).toThrow(TaskInputError);
    // Tarayıcının gönderdiği biçim: cevap ve an; fazladan alan kabul edilmez.
    expect(taskTrial.safeParse({ index: 3, response: { ans: 'yok', at: 4200 }, rtMs: 1300 }).success).toBe(true);
    expect(taskTrial.safeParse({ index: 3, response: { ans: 'yok', at: 4200, x: 1 }, rtMs: 1300 }).success).toBe(false);
    expect(taskTrial.safeParse({ index: 3, response: { ans: 'evet', at: 4200 }, rtMs: 1300 }).success).toBe(false);
  });
});

describe('Simge bulma: rapor', () => {
  it('örnek: beş kart, öne çıkan sayılar ve 30 saniyelik bölümlere göre grafik; üç boyutlu grafik yok', () => {
    const r = evaluate(SLUG, symbolSearchBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Çalışma hızı', '56 doğru karar'],
      ['Doğruluk ve hata türleri', '%88 doğru'],
      ['Benzer simgeler', 'Belirgin fark yok'],
      ['Var mı, yok mu?', '“Yok” kararları daha uzun'],
      ['Hız ve doğruluk dengesi', 'Belirgin fark yok'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru karar (2 dakikada)', '56'],
      ['Doğruluk', '%88'],
      ['Tipik karar süresi', '1,7 sn'],
    ]);
    expect(r.student.items[0].text).toContain('2 dakikada 63 karar verdin; bunların 56 tanesi doğruydu. Bu, dakikada yaklaşık 28 doğru karar demek.');
    expect(r.parent.items[0].text).toContain('Çocuğunuz 2 dakikada 63 karar verdi');
    // Grafikteki sayılar (doğru ve yanlış karar sayıları, tipik süre) metinde yinelenmez.
    expect(r.student.items[1].text).toBe('Yanlışlarının bir kısmında aranan simge sıradayken “Yok”, bir kısmında sırada yokken “Var” dedin.');
    expect(r.student.items[0].text).not.toContain('tipik olarak');
    const chart = r.student.chart;
    expect(chart?.type === 'bars' ? chart.rows.map((x) => x.label) : []).toEqual(['0–30 sn', '30–60 sn', '60–90 sn', '90–120 sn']);
    expect(r.student.roadmap!.bars).toEqual([]);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    // Kartlarda kişiyi yargılayan, akranla kıyaslayan ya da tanı koyan dil yok.
    expect(text(r.student) + text(r.parent)).not.toMatch(/(?<!\p{L})tanı(?!\p{L})|IQ puan|yavaş bir|zayıf|başarısız|yetersiz|normal(in)? (altı|üstü)|akranlarından/u);
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Ans = (q: SymbolSearchCell) => 'var' | 'yok' | null;
    const answers: Record<string, Ans> = {
      hepsi: sgRight,
      kacirma: (q) => (q.trial.present && q.i % 3 === 0 ? 'yok' : sgRight(q)),
      kacirmaAz: (q) => (q.trial.present && q.i % 11 === 0 ? 'yok' : sgRight(q)),
      benzerVar: (q) => (q.trial.lookalike && !q.trial.present && q.i % 2 === 0 ? 'var' : sgRight(q)),
      duzVar: (q) => (!q.trial.lookalike && !q.trial.present && q.i % 3 === 0 ? 'var' : sgRight(q)),
      karisik: (q) => (q.i % 9 === 0 ? sgWrong(q) : sgRight(q)),
      benzerHepsi: (q) => (q.trial.lookalike && q.i % 3 !== 0 ? sgWrong(q) : sgRight(q)),
      tekYanlis: (q) => (q.i === 5 ? sgWrong(q) : sgRight(q)),
      duzHata: (q) => (!q.trial.lookalike && q.i % 2 === 0 ? sgWrong(q) : sgRight(q)),
      rastgele: (q) => (q.i % 2 ? 'var' : 'yok'),
      cogunYanlis: (q) => (q.i % 4 === 0 ? sgRight(q) : sgWrong(q)),
      tekDugme: () => 'var',
      tekDugmeYok: (q) => (q.i % 15 === 0 ? 'var' : 'yok'),
      az: (q) => (q.i < 9 ? sgRight(q) : null),
      hic: () => null,
    };
    type Rt = (q: SymbolSearchCell, wrong: boolean) => number | null;
    const times: Record<string, Rt> = {
      olagan: (q) => (q.trial.present ? 1300 : 1800) + (q.trial.lookalike ? 200 : 0),
      esit: () => 1500,
      ters: (q) => (q.trial.present ? 1900 : 1300),
      benzerUzun: (q) => (q.trial.lookalike ? 2600 : 1300),
      aceleYanlis: (_, w) => (w ? 450 : 1700),
      yavasYanlis: (_, w) => (w ? 3200 : 1400),
      benzerKisa: (q) => (q.trial.lookalike ? 1100 : 1900),
      cokHizli: (q) => (q.i % 4 === 0 ? 220 : 1500),
      yavas: () => 4200,
      suresiz: () => null,
    };
    let n = 0;
    const seen = new Set<string>();
    for (const [aName, ans] of Object.entries(answers)) {
      for (const [tName, rt] of Object.entries(times)) {
        const label = `${aName} ${tName}`;
        const body = symbolSearchBody((q): SymbolSearchPlay => {
          const a = ans(q);
          return a === null ? null : { ans: a, rtMs: rt(q, a !== sgRight(q)) };
        });
        const res = evaluate(SLUG, body);
        const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
        const result: SymbolSearchResult = resultOf(body);
        const why = sgNotRead(result);
        const rushed = !why && sgTooFast(result);
        for (const r of [res.student, res.parent, adult]) {
          expect(r.items.map((i) => i.title), label).toEqual(TITLES);
          const [hiz, dog, ben, vy, den] = r.items;
          for (const i of r.items) seen.add(i.badge ?? '');
          if (why) {
            expect(r.items.map((i) => i.badge), label).toEqual(TITLES.map(() => 'Yorumlanmadı'));
            for (const i of r.items) expect(i.visual, label).toBeUndefined();
            expect(r.cautions, label).toHaveLength(1);
            expect(r.cautions[0], label).toContain('Sonuç yorumlanmadı');
            expect(r.keyFigures.every((f) => f.value === 'Yorumlanmadı'), label).toBe(true);
            expect(r.chart, label).toBeNull();
            continue;
          }
          // Yorumlanan sonuç: çalışma hızı kartı doğru sayısını söyler; uyarı yalnızca çok hızlı kararlar varsa.
          expect(hiz.badge, label).toBe(`${result.correct} doğru karar`);
          expect(r.cautions.length, label).toBe(rushed ? 1 : 0);
          expect(hiz.text.includes('0,3 saniyeden kısa'), label).toBe(rushed);
          for (const c of [dog, ben, vy, den]) if (c.badge !== 'Karşılaştırılmadı') expect(c.text.includes('Çalışma hızı kartında anlatılan nedenle'), label).toBe(rushed);
          // Doğruluk kartı ile öteki kartlar.
          expect(dog.badge === 'Hata yok', label).toBe(result.wrong === 0);
          if (dog.badge === 'Çoğu yanlışta simge gözden kaçtı') expect(result.falseYok, label).toBeGreaterThanOrEqual(result.falseVar + 2);
          if (dog.badge === 'Çoğu yanlışta olmayan simge görüldü') expect(result.falseVar, label).toBeGreaterThanOrEqual(result.falseYok + 2);
          if (dog.badge === 'Yanlışlarda simge gözden kaçtı') expect(result.falseVar, label).toBe(0);
          if (dog.badge === 'Yanlışlarda olmayan simge görüldü') expect(result.falseYok, label).toBe(0);
          if (dog.text.includes('çoğunda sırada aranan simgeye çok benzeyen')) expect(result.falseVar, label).toBeGreaterThanOrEqual(4);
          if (vy.badge === '“Yok” kararları hızlı') expect(dog.badge, label).not.toBe('Çoğu yanlışta olmayan simge görüldü');
          if (result.wrong === 0) {
            expect([ben.badge, den.badge].every((b) => !b?.includes('yanılgı')), label).toBe(true);
            expect(vy.badge, label).not.toBe('“Yok” kararları hızlı');
          }
          // Benzer simgeler: başlık eşiklerle aynı.
          expect(ben.badge === 'Benzer simgelerde daha çok yanılgı', label).toBe(sgAccLower(result.look, result.plain));
          if (ben.badge === 'Belirgin fark yok') expect(sgLookSlower(result) || sgLookFaster(result), label).toBe(false);
          // Var mı, yok mu: süreler alınamadıysa karşılaştırılmaz.
          if (result.medianRt === null) {
            expect(vy.badge, label).toBe('Karşılaştırılmadı');
            expect(den.badge, label).toBe('Karşılaştırılmadı');
            expect(hiz.visual?.type, label).toBe('stack');
          } else {
            expect(hiz.visual?.type, label).toBe('strip');
            expect(vy.badge === '“Yok” kararları daha uzun', label).toBe(sgAbsentSlower(result));
          }
          expect(den.badge === 'Hızlı kararlarda daha çok yanılgı', label).toBe(result.timed >= 20 && sgHalvesApart(result) && sgAccLower(result.fast, result.slow));
          // Grafikte görülen küçük fark "belirgin sayılmaz" diye söylenir; "Belirgin fark yok" kartı farkı yok saymaz.
          if (ben.badge === 'Belirgin fark yok' && Math.abs(sgAccGap(result.look, result.plain)) >= 0.05) expect(ben.text, label).toContain('belirgin sayılmaz');
          // Açıklama cümleleri bir sayfada en çok bir kez; "herkes" denmez.
          const page = r.items.map((i) => i.text).join(' ');
          expect(page, label).not.toMatch(/herkes/);
          for (const phrase of ['aramayı zorlaştırır', 'aramayı biraz zorlaştırır', 'bütün simgelere bakmak gerekir', 'gözden kaçırmak', 'yanılgıyı artırabilir', 'çoğu kişide']) {
            expect(page.split(phrase).length - 1, `${label} ${phrase}`).toBeLessThanOrEqual(1);
          }
          // Grafikler: karşılaştırılan kartlarda var; yorumlanmayan ya da karşılaştırılmayan kartta yok.
          for (const c of r.items) expect(!!c.visual, `${label} ${c.title}`).toBe(c.badge !== 'Karşılaştırılmadı');
        }
        expect(text(res.student), label).not.toContain('Çocuğunuz');
        expect(text(adult), label).not.toContain('Çocuğunuz');
        expect(text(res.parent), label).not.toMatch(
          /(?<!\p{L})(verdin|vermedin|dedin|yanıldın|yanılmadın|bastın|kaçırdın|düşündüğün|verdiğin|vermen|vermenden|doğruluğun|olabilirsin|seni|sana)(?!\p{L})/u,
        );
        expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
        // Nicelik sözleri sayılarla uyuşur.
        expect(text(res.student), label).not.toMatch(/(^|\s)[01] tanes/);
        n++;
      }
    }
    expect(n).toBe(Object.keys(answers).length * Object.keys(times).length);
    // Birleşimler kartların bütün durumlarını kapsar.
    for (const b of [
      'Yorumlanmadı',
      'Hata yok',
      'Çoğu yanlışta simge gözden kaçtı',
      'Çoğu yanlışta olmayan simge görüldü',
      'Benzer simgelerde daha çok yanılgı',
      'Benzer simgelerde kararlar daha uzun',
      'Belirgin fark yok',
      '“Yok” kararları daha uzun',
      '“Yok” kararları hızlı',
      '“Var” kararları daha uzun',
      'Hızlı kararlarda daha çok yanılgı',
      'Uzun süren kararlarda daha çok yanılgı',
      'Yanlışlarda simge gözden kaçtı',
      'Yanlışlarda olmayan simge görüldü',
      'Benzer simgelerde daha az yanılgı',
      'Benzer simgelerde kararlar daha kısa',
      'Karşılaştırılmadı',
    ]) {
      expect(seen.has(b), b).toBe(true);
    }
  }, 300_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, symbolSearchBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, symbolSearchBody(undefined, 3)).student.items).toHaveLength(5);
    const r = evaluateReports(SLUG, symbolSearchBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(schoolWords(withoutRoadmap(adult))).toEqual([]);
    expect(schoolWords(JSON.stringify(adult.roadmap))).toEqual([]);
    expect(schoolWords([simgeBulma.intro.title, ...simgeBulma.intro.paragraphs, ...task.instructions, task.measures].join(' '))).toEqual([]);
  });

  it('PDF öğrenci, veli ve yetişkin için üretilir', async () => {
    const body = symbolSearchBody();
    const r = evaluate(SLUG, body);
    const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);
});

describe('Simge bulma: rastlantı farkları', () => {
  /** Mulberry32: benzetim için belirlenimci rastgele sayılar. */
  const rng = (seed: number) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());

  it('benzer simgenin, hızın ve "var" ile "yok"un gerçek bir etkisi yokken kartlar fark bulmaz (her kartta en çok %5)', () => {
    const PEOPLE = 150;
    const total = { benzer: 0, varyok: 0, denge: 0 };
    let all = 0;
    for (const errRate of [0.04, 0.08, 0.15]) {
      for (const base0 of [1000, 2500]) {
        const claims = { benzer: 0, varyok: 0, denge: 0 };
        let n = 0;
        for (let k = 0; k < PEOPLE; k++) {
          const seed = `00000000-0000-4000-8000-${String(k + 1000).padStart(12, '0')}`;
          const trials = symbolSearchTrials(task, seed);
          const r = rng(7000 + k + Math.round(errRate * 1000) + base0);
          const base = base0 * (0.8 + 0.4 * r());
          const input: SymbolSearchTrialInput[] = [];
          let at = 0;
          for (const [i, t] of trials.entries()) {
            // Hata türden ve hızdan bağımsız; "yok" kararları "var" kararlarından uzun, benzer simgenin etkisi yok.
            const rt = Math.max(350, Math.round(base * (t.present ? 1 : 1.35) * Math.exp(0.25 * gauss(r))));
            const wrong = r() < errRate;
            const next = at + rt + 200;
            if (next > task.durationMs) break;
            at = next;
            input.push({ index: i, response: { ans: t.present !== wrong ? 'var' : 'yok', at }, rtMs: rt });
          }
          const rep = evaluate(SLUG, { grade: 8, data: { engine: 'tasks', seed, blocks: { [task.key]: input } } }).student;
          if (rep.items[0].badge === 'Yorumlanmadı') continue;
          n++;
          if (rep.items[2].badge !== 'Belirgin fark yok') claims.benzer++;
          if (rep.items[3].badge === '“Yok” kararları hızlı' || rep.items[3].badge === '“Var” kararları daha uzun') claims.varyok++;
          if (rep.items[4].badge === 'Hızlı kararlarda daha çok yanılgı' || rep.items[4].badge === 'Uzun süren kararlarda daha çok yanılgı') claims.denge++;
        }
        // Her koşulda (150 kişilik benzetim, rastlantı payıyla) en çok %7,5; bütün koşullarda birlikte en çok %5.
        for (const [card, c] of Object.entries(claims)) {
          expect(c / n, `${card} %${errRate * 100} ${base0} ms`).toBeLessThanOrEqual(0.075);
          total[card as keyof typeof total] += c;
        }
        all += n;
      }
    }
    for (const [card, c] of Object.entries(total)) expect(c / all, card).toBeLessThanOrEqual(0.05);
  }, 300_000);
});

describe('Simge bulma: bilim kartı ve yol haritası', () => {
  it('bilim kartı: yer tutucu yok; kaynaklar bağlantılı ve metinde yazar ve yılıyla anılıyor; ticari alt testle karıştırılmaz', () => {
    const s = simgeBulma.science;
    const all = [s.basedOn, s.whatItMeasures, s.turkishVersion, s.reliability, s.normNote, s.ageNote, s.license, ...s.limitations].join(' ');
    expect(all).not.toMatch(/YAZILACAK|TODO/);
    expect(s.normStatus).toBe('none');
    for (const c of s.citations) {
      if (c.url) expect(c.url, c.text).toMatch(/^https:\/\//);
      const author = c.text.split(/,| \(/)[0];
      const year = /\((\d{4})\)/.exec(c.text)?.[1];
      expect(year, c.text).toBeDefined();
      expect(all.includes(author) && all.includes(year!), c.text).toBe(true);
    }
    expect(s.basedOn).toContain('Bu test o alt test değildir');
    expect(s.basedOn).toContain('“Simge Arama”');
    expect(simgeBulma.name).not.toContain('Simge Arama');
    expect(simgeBulma.description).toContain('Zekâ puanı (IQ) vermez ve tanı koymaz');
    expect(s.normNote).toContain('Türkiye normu yok');
    // Alıştırmanın başka becerilere yansıdığı, beyni çalıştırdığı ya da yorgunluk söylenmez.
    expect(all).not.toMatch(/beyni(ni)? çalıştır|yoruldu|yorgunluk yüzünden|zekâyla ilgisi yok/);
  });

  it('yol haritası: dört öneri, üç hafta; kaynaklar bilim kartında; sonraki testler yetişkinlere de açık', () => {
    const t = TASK_ROADMAPS[SLUG];
    expect(t.supports).toHaveLength(4);
    expect(t.weeks).toHaveLength(3);
    for (const src of t.sources) expect(simgeBulma.science.citations.some((c) => c.text === src.text), src.text).toBe(true);
    for (const slug of t.nextTests) expect(solvableInstruments().some((d) => d.slug === slug && 'adults' in d && d.adults), slug).toBe(true);
    expect(JSON.stringify(t)).not.toMatch(/daha hızlı düşün|hızını artır|beyni(ni)? çalıştır/);
  });
});

describe('Simge bulma yayında', () => {
  it('listelerde ve site haritasında; pilot; "Hangi test bana uygun?" sayfasında dikkat alanında', () => {
    expect(simgeBulma.status).toBe('pilot');
    expect(publicInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(SECICI_GOALS.find((g) => g.key === 'dikkat')!.slots.some((s) => s.candidates.includes(SLUG))).toBe(true);
  });

  it('çözme ekranı: depo, çerez ya da istek yok; denemeler tohumdan üretilir', () => {
    const ui = readFileSync(new URL('../src/components/runner/tasks/symbol-search.tsx', import.meta.url), 'utf8');
    expect(ui).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    expect(ui).toContain('symbolSearchTrials(task, seed)');
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin tohumundaki doğru cevaplardır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain(`/api/rapor/${SLUG}`);
    expect(yml).toContain('simge-bulma-raporu');
    expect(yml).toContain(`"seed": "${SEED}"`);
    const m = /SG_CEVAP=([VY]+)/.exec(yml);
    expect(m?.[1]).toBe(
      symbolSearchTrials(task, SEED)
        .slice(0, 40)
        .map((t) => (t.present ? 'V' : 'Y'))
        .join(''),
    );
    // Dış sınamadaki gövdeyle rapor: 40 doğru karar, hata yok, "Yok" kararları daha uzun, dört bölümlü grafik, uyarı yok.
    const answersOf = m![1].split('');
    const body = symbolSearchBody((q) => (q.i < 40 ? { ans: answersOf[q.i] === 'V' ? 'var' : 'yok', rtMs: answersOf[q.i] === 'V' ? 1500 : 2200 } : null));
    const input = inputOf(body).map((t, i) => ({ ...t, response: { ...t.response, at: 2500 * (i + 1) } }));
    (body.data as unknown as { blocks: Record<string, SymbolSearchTrialInput[]> }).blocks[task.key] = input;
    const r = evaluate(SLUG, body);
    expect(r.student.items.map((i) => i.badge).slice(0, 2)).toEqual(['40 doğru karar', 'Hata yok']);
    expect(r.student.items[3].badge).toBe('“Yok” kararları daha uzun');
    expect(r.student.chart?.type === 'bars' ? r.student.chart.rows.length : 0).toBe(4);
    expect(r.student.cautions).toEqual([]);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
  });
});
