import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { ARITH_ITEMS, ARITH_PRACTICE, zihindenHesaplama } from '@/content/instruments/zihinden-hesaplama';
import { hasPublicRoadmap } from '@/content/roadmaps';
import { evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { answersBody } from '@/lib/assessment/schemas';
import { ADULT_GRADE } from '@/lib/config';
import { ARITH_OPS, arithAnswer, arithErrorKind } from '@/lib/instruments/arithmetic';
import type { ArithItem, ArithOp, MentalArithmeticTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  ARITH_ERROR_NOTE,
  ARITH_MIN_ANSWERED,
  TaskInputError,
  arithRead,
  scoreArithmetic,
  type ArithTrialInput,
} from '@/lib/scoring/tasks';
import { arithBody, type ArithCell } from './helpers/bodies';

const SLUG = 'zihinden-hesaplama-hizi';
const tasks = zihindenHesaplama.tasks as MentalArithmeticTask[];
const taskOf = (op: ArithOp) => tasks.find((t) => t.op === op)!;

/* ---------- İşlemler ---------- */

/** Düzeylerin kuralları, işlemlerin sayılarından bağımsızca (content/instruments/zihinden-hesaplama.ts'teki tanımla aynı). */
const nz = (x: number) => x % 10 !== 0;
const RULES: Record<ArithOp, ((a: number, b: number) => boolean)[]> = {
  add: [
    (a, b) => a < 10 && b < 10 && a + b <= 10,
    (a, b) => a < 10 && b < 10 && a + b >= 11,
    (a, b) => a > 10 && a < 100 && nz(a) && b < 10 && (a % 10) + b <= 9,
    (a, b) => a > 10 && a < 100 && nz(a) && b < 10 && (a % 10) + b >= 10 && a + b < 100,
    (a, b) => a > 10 && b > 10 && nz(a) && nz(b) && (a % 10) + (b % 10) <= 9 && a + b < 100,
    (a, b) => a > 10 && b > 10 && nz(a) && nz(b) && (a % 10) + (b % 10) >= 10 && a + b < 100,
  ],
  sub: [
    (a, b) => a <= 10 && b < 10 && a - b >= 2,
    (a, b) => a > 10 && a < 20 && b < 10 && a - b < 10,
    (a, b) => a > 20 && nz(a) && b < 10 && a % 10 > b,
    (a, b) => a > 20 && nz(a) && b < 10 && a % 10 < b,
    (a, b) => b > 10 && nz(a) && nz(b) && a % 10 > b % 10 && a - b > 10,
    (a, b) => b > 10 && nz(a) && nz(b) && a % 10 < b % 10 && a - b > 10,
  ],
  mul: [
    (a, b) => [a, b].some((x) => [2, 5, 10].includes(x)) && Math.max(a, b) <= 10,
    (a, b) => [a, b].some((x) => [3, 4].includes(x)) && Math.max(a, b) < 10 && ![a, b].some((x) => [2, 5, 10].includes(x)),
    (a, b) => a >= 6 && a <= 9 && b >= 6 && b <= 9,
    (a, b) => a > 10 && nz(a) && b < 10 && (a % 10) * b <= 9 && Math.floor(a / 10) * b <= 9,
    (a, b) => a > 10 && nz(a) && b < 10 && (a % 10) * b >= 10 && a * b < 100,
    (a, b) => a > 10 && nz(a) && b < 10 && a * b >= 100,
  ],
  div: [
    (a, b) => [2, 5, 10].includes(b) && a % b === 0 && a / b < 10,
    (a, b) => [3, 4].includes(b) && a % b === 0 && a / b < 10,
    (a, b) => b >= 6 && b <= 9 && a % b === 0 && a / b >= 6 && a / b <= 9,
    (a, b) => a < 100 && a % b === 0 && a / b >= 10 && Math.floor(a / 10) % b === 0,
    (a, b) => a < 100 && a % b === 0 && a / b >= 10 && Math.floor(a / 10) % b !== 0,
    (a, b) => a >= 100 && a % b === 0 && a / b >= 10 && a / b < 100,
  ],
};

describe('Zihinden hesaplama: işlemler', () => {
  it('dört bölüm; her bölümde altı düzey, düzey başına 8 işlem; düzey adları ve örnekleri işlemlerle uyuşur', () => {
    expect(tasks.map((t) => t.op)).toEqual(ARITH_OPS);
    for (const t of tasks) {
      expect(t.items, t.op).toHaveLength(48);
      expect(t.levels, t.op).toHaveLength(6);
      expect(t.perLevel).toBe(8);
      expect(t.durationMs).toBe(60_000);
      expect(t.factLevels).toBe(t.op === 'add' || t.op === 'sub' ? 2 : 3);
      // Düzey adındaki örnek o düzeyin bir işlemidir.
      t.levels.forEach((name, l) => {
        const m = name.match(/\((\d+) [+−×÷] (\d+)\)$/);
        expect(m, `${t.op} ${name}`).not.toBeNull();
        const ex: ArithItem = [Number(m![1]), Number(m![2])];
        expect(ARITH_ITEMS[t.op][l], `${t.op} ${name}`).toContainEqual(ex);
      });
    }
  });

  it('her işlem kendi düzeyinin kuralına uyar; sonuçlar tam sayı ve en çok üç basamaklı', () => {
    for (const op of ARITH_OPS) {
      ARITH_ITEMS[op].forEach((level, l) => {
        for (const [a, b] of level) {
          expect(RULES[op][l](a, b), `${op} ${l + 1}. düzey ${a}, ${b}`).toBe(true);
          const c = arithAnswer(op, [a, b]);
          expect(Number.isInteger(c) && c >= 0 && c < 1000, `${op} ${a}, ${b}`).toBe(true);
        }
      });
    }
  });

  it('bir bölümde aynı işlem iki kez yok; düzeyde aynı sonuç en çok iki kez; art arda aynı sonuç ya da ikinci sayı yok; alıştırma asıl işlemlerde yok', () => {
    for (const op of ARITH_OPS) {
      const key = ([a, b]: ArithItem) => (op === 'add' || op === 'mul' ? [a, b].sort((x, y) => x - y).join(',') : `${a},${b}`);
      const all = ARITH_ITEMS[op].flat();
      expect(new Set(all.map(key)).size, op).toBe(all.length);
      for (const p of ARITH_PRACTICE[op]) expect(all.map(key), `${op} alıştırma`).not.toContain(key(p));
      for (const level of ARITH_ITEMS[op]) {
        const answers = level.map((it) => arithAnswer(op, it));
        for (const x of answers) expect(answers.filter((y) => y === x).length, `${op} ${x}`).toBeLessThanOrEqual(2);
        for (let i = 1; i < level.length; i++) {
          expect(answers[i], `${op} ${level[i]}`).not.toBe(answers[i - 1]);
          expect(level[i][1], `${op} ${level[i]}`).not.toBe(level[i - 1][1]);
        }
      }
    }
  });

  it('yanlışların türü ayırt edilebilir: eldeli ve bozmalı işlemlerde 5 yok, ilk düzeyde çarpım toplamın bir yanında değil, bölmeler çarpmaların tersi değil', () => {
    for (const op of ['add', 'sub'] as const) {
      const t = taskOf(op);
      t.items.forEach(([a, b], i) => {
        // 5 + 5 için 0 elde yanlışı sayılmaz (lib/instruments/arithmetic.ts); toplamı tam 10 olan tek basamaklılar ayrışır.
        const carry = op === 'add' ? (a % 10) + (b % 10) >= 10 && (a >= 10 || a + b > 10) : a > 10 && a % 10 < b % 10;
        if (carry && b < 10) expect([a % 10 === 5 && a < 10, b === 5], `${op} ${a}, ${b} (${i})`).toEqual([false, false]);
      });
    }
    for (const [a, b] of ARITH_ITEMS.add[0]) expect(Math.abs(a * b - (a + b)), `${a} + ${b}`).not.toBe(1);
    const mul = new Set(ARITH_ITEMS.mul.flat().map(([a, b]) => a * 1000 + b));
    for (const l of [3, 4]) {
      for (const [a, b] of ARITH_ITEMS.div[l]) expect(mul.has((a / b) * 1000 + b) || mul.has(b * 1000 + a / b), `${a} ÷ ${b}`).toBe(false);
    }
  });
});

/* ---------- Puanlama ---------- */

const trials = (op: ArithOp, f: (q: ArithCell) => { response: number | null; rtMs: number }) =>
  (arithBody((q) => (q.op === op ? f(q) : { response: q.answer, rtMs: 2000 })).data as { blocks: Record<string, ArithTrialInput[]> }).blocks[taskOf(op).key];

describe('Zihinden hesaplama: puanlama', () => {
  it('yanlışların türü', () => {
    const k = (op: ArithOp, item: ArithItem, v: number, fact = true) => arithErrorKind(op, item, v, fact);
    expect(k('add', [47, 8], 45, false)).toBe('regroup');
    expect(k('add', [8, 5], 3)).toBe('regroup');
    expect(k('add', [9, 4], 5)).toBe('operation');
    expect(k('add', [3, 4], 12)).toBe('operation');
    expect(k('add', [7, 6], 12)).toBe('near');
    expect(k('sub', [52, 7], 55, false)).toBe('regroup');
    expect(k('sub', [63, 28], 45, false)).toBe('regroup');
    expect(k('sub', [52, 7], 54, false)).toBe('reversal');
    expect(k('sub', [9, 4], 13)).toBe('operation');
    expect(k('mul', [7, 8], 63)).toBe('table');
    expect(k('mul', [7, 8], 48)).toBe('table');
    expect(k('mul', [7, 8], 32)).toBe('table');
    expect(k('mul', [7, 8], 15)).toBe('operation');
    expect(k('mul', [7, 8], 54)).toBe('other');
    expect(k('mul', [16, 4], 44, false)).toBe('regroup');
    expect(k('mul', [16, 4], 28, false)).toBe('regroup');
    expect(k('div', [56, 8], 6)).toBe('quotient');
    // Rakamların yeri tablo yanlışından önce: 7 × 3 için 12 (12 de 3'ün katıdır).
    expect(k('mul', [7, 3], 12)).toBe('reversal');
    // 9 × 9 için 18 hem 9 + 9 hem rakamların yeri: başka işlemin sonucu sayılır.
    expect(k('mul', [9, 9], 18)).toBe('operation');
    // 10 × 4 için 4 ve eldesiz 12 × 3 için 9 elde yanlışı değildir (9 aynı zamanda 12 − 3).
    expect(k('mul', [10, 4], 4)).not.toBe('regroup');
    expect(k('mul', [12, 3], 9, false)).toBe('operation');
    expect(k('mul', [25, 6], 120, false)).toBe('regroup');
    expect(k('div', [56, 8], 48)).toBe('operation');
    expect(k('div', [72, 4], 17, false)).toBe('other');
    expect(() => k('add', [3, 4], 7)).toThrow();
  });

  it('süre dolana kadar verilen cevaplar; düzeyler, doğruluk ve tipik süreler', () => {
    const t = taskOf('add');
    const r = scoreArithmetic(t, trials('add', (q) => ({ response: q.i % 5 === 4 ? q.answer + 1 : q.answer, rtMs: 1000 + 500 * q.level }))).result;
    // 1,5 sn × 8 + 2 sn × 8 + 2,5 sn × 8 = 48 sn; dördüncü düzeyde 3 sn'lik dört işlem daha (60 sn).
    expect([r.attempted, r.reached, r.ceiling, r.finished]).toEqual([28, 4, false, false]);
    expect(r.levels.map((l) => l.attempted)).toEqual([8, 8, 8, 4, 0, 0]);
    expect(r.wrong).toBe(r.wrongs.length);
    expect(r.correct + r.wrong + r.skipped).toBe(r.attempted);
    expect(r.factRts.every((x) => x === 1500 || x === 2000)).toBe(true);
    expect(r.factMedianRt).not.toBeNull();
    expect(r.perMinute).toBe(r.correct);
    expect(arithRead(r)).toBe(true);
  });

  it('geçersiz cevaplar reddedilir', () => {
    const t = taskOf('sub');
    const ok = trials('sub', (q) => ({ response: q.answer, rtMs: 2000 }));
    expect(() => scoreArithmetic(t, ok.slice(1))).toThrow(TaskInputError);
    expect(() => scoreArithmetic(t, [...ok.slice(0, 3), { ...ok[3], index: 5 }])).toThrow(TaskInputError);
    expect(() => scoreArithmetic(t, [{ index: 0, response: { answer: 1000 }, rtMs: 100 }])).toThrow(TaskInputError);
    expect(() => scoreArithmetic(t, [{ index: 0, response: { answer: 2.5 }, rtMs: 100 }])).toThrow(TaskInputError);
    expect(() => scoreArithmetic(t, ok.map((x) => ({ ...x, rtMs: 3000 })))).toThrow(TaskInputError);
    expect(() => scoreArithmetic(t, [{ index: 0, response: null, rtMs: 61_000 }])).toThrow(TaskInputError);
    // Süresiz cevap kabul edilmez.
    expect(() => scoreArithmetic(t, [{ index: 0, response: { answer: 5 }, rtMs: null }])).toThrow(TaskInputError);
    expect(scoreArithmetic(t, []).result.attempted).toBe(0);
    // İstek şeması bloğu kabul eder.
    expect(answersBody.safeParse(arithBody()).success).toBe(true);
  });

  it('bütün işlemler süre dolmadan biterse dakikada doğru işlem geçen süreye göre', () => {
    const r = scoreArithmetic(taskOf('add'), trials('add', (q) => ({ response: q.answer, rtMs: 1000 }))).result;
    expect([r.ceiling, r.finished, r.attempted, r.elapsedMs]).toEqual([true, true, 48, 48_000]);
    expect(r.perMinute).toBe(60);
  });

  it('geçilen işlemler ilerleme ve tavan sayılmaz; çok kısa süreler tipik süreye katılmaz', () => {
    // İlk düzey doğru, gerisi hızla geçildi.
    const r = scoreArithmetic(taskOf('add'), trials('add', (q) => (q.level === 1 ? { response: q.answer, rtMs: 2000 } : { response: null, rtMs: 400 }))).result;
    expect([r.finished, r.ceiling, r.reached, r.skipped]).toEqual([true, false, 1, 40]);
    expect(r.levels.map((l) => l.skipped)).toEqual([0, 8, 8, 8, 8, 8]);
    // Yarısı 0,3 sn'de verilen doğru cevaplar.
    const q = scoreArithmetic(taskOf('sub'), trials('sub', (x) => ({ response: x.answer, rtMs: x.i % 2 ? 300 : 2000 }))).result;
    expect(q.rts.every((x) => x >= 500)).toBe(true);
    expect(q.rapid).toBeGreaterThan(0);
  });
});

/* ---------- Rapor ---------- */

const text = (r: SimpleReport) =>
  [
    ...r.cautions,
    ...r.keyFigures.flatMap((k) => [k.label, k.value, k.note ?? '']),
    ...r.items.flatMap((i) => [i.title, i.badge ?? '', i.text]),
    ...(r.roadmap
      ? [r.roadmap.intro, ...r.roadmap.study.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.roadmap.weeks.flatMap((w) => [w.title, w.text])]
      : []),
    r.disclaimer.text,
  ].join(' ');

/** Örüntüler: işlem türüne ve düzeye göre cevap ve süre. */
const wrongOf = (q: ArithCell, kind: 'regroup' | 'operation' | 'table' | 'quotient' | 'near' | 'reversal' | 'other'): number => {
  const [a, b] = q.item;
  const c = q.answer;
  if (kind === 'regroup' && q.op === 'add' && (a % 10) + (b % 10) >= 10) return c - 10;
  if (kind === 'regroup' && q.op === 'sub' && a % 10 < b % 10) return c + 10;
  if (kind === 'operation') return q.op === 'add' ? a * b : q.op === 'sub' ? a + b : q.op === 'mul' ? a + b : a * b;
  if (kind === 'table' && q.op === 'mul' && b < 10) return a * (b + 1);
  if ((kind === 'table' || kind === 'quotient') && q.op === 'div') return c + 1;
  if (kind === 'reversal' && c >= 10 && c % 10 !== 0) return Number(String(c).split('').reverse().join(''));
  if (kind === 'near') return c + 1;
  return c + 7;
};

const PATTERNS: Record<string, () => ReturnType<typeof arithBody>> = {
  hepsiDogru: () => arithBody(),
  hizliYetiskin: () => arithBody((q) => ({ response: q.answer, rtMs: 700 + 450 * q.level })),
  hepsiBitti: () => arithBody((q) => ({ response: q.answer, rtMs: 1100 })),
  elde: () => arithBody((q) => ({ response: q.i % 4 === 3 ? wrongOf(q, 'regroup') : q.answer, rtMs: 1800 + 700 * q.level })),
  islem: () => arithBody((q) => ({ response: q.i % 4 === 1 ? wrongOf(q, 'operation') : q.answer, rtMs: 2000 + 600 * q.level })),
  tablo: () => arithBody((q) => ({ response: q.i % 3 === 2 ? wrongOf(q, 'table') : q.answer, rtMs: 2200 + 500 * q.level })),
  karisik: () =>
    arithBody((q) => ({
      response: q.i % 5 === 0 ? wrongOf(q, (['regroup', 'operation', 'table', 'near', 'other'] as const)[q.i % 4]) : q.answer,
      rtMs: 2500 + 900 * q.level,
    })),
  birYanlis: () => arithBody((q) => ({ response: q.i === 3 && q.op === 'mul' ? q.answer + 9 : q.answer, rtMs: 2400 })),
  gecen: () => arithBody((q) => ({ response: q.level >= 2 && q.i % 2 ? null : q.answer, rtMs: 2600 })),
  bolmeYok: () => arithBody((q) => (q.op === 'div' ? { response: null, rtMs: 4000 } : { response: q.answer, rtMs: 2000 })),
  bolmeAz: () => arithBody((q) => (q.op === 'div' ? { response: q.answer, rtMs: 25_000 } : { response: q.answer, rtMs: 2000 })),
  yavas: () => arithBody((q) => ({ response: q.answer, rtMs: 9000 + 1000 * q.level })),
  rastgele: () => arithBody(() => ({ response: 7, rtMs: 300 })),
  yarisiRastgele: () => arithBody((q) => (q.op === 'add' || q.op === 'sub' ? { response: 7, rtMs: 300 } : { response: q.answer, rtMs: 2500 })),
  zayif: () => arithBody((q) => ({ response: q.i % 2 ? wrongOf(q, 'other') : q.answer, rtMs: 4000 + 1000 * q.level }), 4),
  rakam: () => arithBody((q) => ({ response: q.i % 3 === 1 ? wrongOf(q, 'reversal') : q.answer, rtMs: 2400 + 400 * q.level })),
  // Yalnızca toplama yorumlanır: 3 cevabın biri doğru.
  azCevap: () =>
    arithBody((q) =>
      q.op === 'add' ? (q.i < 3 ? { response: q.i === 0 ? q.answer : q.answer + 7, rtMs: 3000 } : { response: null, rtMs: 25_000 }) : { response: null, rtMs: 30_000 },
    ),
  // Çıkarmada hepsi yanlış ve yavaş.
  hicDogruYok: () => arithBody((q) => (q.op === 'sub' ? { response: q.answer + 7, rtMs: 3500 } : { response: q.answer, rtMs: 2000 })),
  // İlk düzey doğru, gerisi hızla geçildi.
  ilkDuzeyGerisiGecildi: () => arithBody((q) => (q.level === 1 ? { response: q.answer, rtMs: 2000 } : { response: null, rtMs: 400 })),
  // Temel işlemlerin hepsi geçildi, büyük sayılarla doğru ve yanlış.
  temelGecildi: () =>
    arithBody((q) => (q.level <= (q.op === 'add' || q.op === 'sub' ? 2 : 3) ? { response: null, rtMs: 500 } : { response: q.i % 3 ? q.answer : q.answer + 7, rtMs: 3000 })),
  // Bölmede üç temel doğru cevap 1,5 sn; ötekilerde ikişer doğru 6 sn.
  tekHiz: () =>
    arithBody((q) =>
      q.op === 'div'
        ? q.i < 3 ? { response: q.answer, rtMs: 1500 } : { response: q.answer + 7, rtMs: 3000 }
        : q.i < 2 ? { response: q.answer, rtMs: 6000 } : { response: q.answer + 7, rtMs: 3000 },
    ),
  // Bölmede hepsi doğru ama yavaş; ötekilerde hızlı.
  bolmeYavasDogru: () => arithBody((q) => (q.op === 'div' ? { response: q.answer, rtMs: 6000 } : { response: q.answer, rtMs: 1500 })),
  // Hepsi doğru ama okumaya yetmeyecek kadar kısa sürede (tipik süreye katılmaz).
  cokHizli: () => arithBody((q) => ({ response: q.answer, rtMs: 300 })),
  // Büyük sayılarla daha hızlı.
  buyukHizli: () => arithBody((q) => ({ response: q.answer, rtMs: q.level <= 2 ? 3000 : 1200 })),
};

describe('Zihinden hesaplama: rapor', () => {
  it('bütün örüntülerde kartlar, grafikler, öne çıkan sayılar ve uyarılar birbirini tutar', async () => {
    let checked = 0;
    for (const [name, make] of Object.entries(PATTERNS)) {
      for (const grade of [5, 13, ADULT_GRADE]) {
        const body = make();
        body.grade = grade;
        const reps = evaluateReports(SLUG, body) as unknown as Record<string, SimpleReport>;
        for (const r of Object.values(reps)) {
          const tag = `${name} ${grade} ${r.audience}`;
          const all = text(r);
          expect(all, tag).not.toMatch(/undefined|NaN|null|TASLAK|\{|\}/);
          expect(all, tag).not.toMatch(/\b(\d+) \S+ \1 tanes|(^|\s)[01] tanes/);
          if (r.audience === 'parent') expect(all, tag).toContain('Çocuğunuz');
          else expect(all, tag).not.toMatch(/Çocuğunuz|çocuğunuz/);
          // Yetişkine okula özgü sözcük yok.
          if (r.audience === 'adult') expect(all, tag).not.toMatch(/okul|sınıf|öğretmen|ders/i);
          expect(r.items.map((i) => i.title), tag).toEqual(['Dört işlemde doğru cevaplar', 'Toplama', 'Çıkarma', 'Çarpma', 'Bölme', 'Doğruluk ve hata türleri', 'Temel işlemlerin hızı']);
          const sections = Object.values(body.data.engine === 'tasks' ? body.data.blocks : {}) as ArithTrialInput[][];
          const results = tasks.map((t, i) => scoreArithmetic(t, sections[i]).result);
          const read = results.filter(arithRead);
          // Yorumlanmayan kartın grafiği yok; yorumlanan kartın grafiği var.
          for (const it of r.items) {
            if (['Yorumlanmadı', 'Hesaplanamadı'].includes(it.badge ?? '')) expect(it.visual, `${tag} ${it.title}`).toBeUndefined();
            else expect(it.visual, `${tag} ${it.title}`).toBeDefined();
          }
          // Bölüm kartları: rozet ve grafik doğru sayısıyla aynı.
          results.forEach((s, i) => {
            const card = r.items[i + 1];
            if (!arithRead(s)) {
              expect(card.badge, tag).toBe('Yorumlanmadı');
              return;
            }
            expect(card.badge, tag).toBe(
              s.ceiling ? `${s.n} işlemde ${s.correct} doğru` : s.finished ? `${Math.ceil(s.elapsedMs / 1000)} saniyede ${s.correct} doğru` : `60 saniyede ${s.correct} doğru`,
            );
            const v = card.visual!;
            expect(v.type === 'dots' && v.rows.reduce((t, row) => t + row.filled, 0), tag).toBe(s.correct);
            expect(v.type === 'dots' && v.rows.length, tag).toBe(Math.floor((s.attempted - 1) / 8) + 1);
            // "Bitirdin" ve tavan yalnızca işlemlerin hemen hepsi doğru yapılıp bölüm bittiyse; geçilen işlemler ilerleme sayılmaz.
            expect(/bütün işlemleri süre dolmadan bitirdi/i.test(card.text), tag).toBe(s.ceiling);
            if (s.correct === 0) expect(card.text, tag).toContain('hiçbiri doğru değildi');
            if ((s.accuracy ?? 0) < 0.9) expect(card.text, tag).not.toContain('hemen hepsi');
            // Temel işlemlerin çoğu geçildiyse temel işlemler hakkında hüküm yok.
            const t = tasks[i];
            const fl = s.levels.slice(0, t.factLevels);
            if (2 * fl.reduce((n, l) => n + l.attempted - l.skipped, 0) < fl.reduce((n, l) => n + l.attempted, 0)) expect(card.text, tag).not.toContain('temel işlemlerde yanlış');
          });
          expect(all, tag).not.toMatch(/hiçbiri doğruydu|hiçbiri doğru yaptı/);
          // Tavan uyarısı yalnızca tavanda.
          for (const s of results) {
            const name = { add: 'toplama', sub: 'çıkarma', mul: 'çarpma', div: 'bölme' }[s.op];
            const capNote = r.cautions.find((c) => c.includes('sınırlı kaldı'));
            expect(!!capNote && capNote.split(' bölüm')[0].includes(name), `${tag} ${name}`).toBe(arithRead(s) && s.ceiling);
          }
          const genel = r.items[0];
          if (read.length === 0) {
            expect(genel.badge, tag).toBe('Yorumlanmadı');
            expect(r.items.every((i) => !i.visual), tag).toBe(true);
          } else {
            const v = genel.visual!;
            expect(v.type === 'bars' && v.rows.map((x) => x.value), tag).toEqual((read.length >= 2 ? read : results).map((s) => (arithRead(s) ? s.correct : 0)));
            expect(r.keyFigures[0].value, tag).toBe(String(read.reduce((t, s) => t + s.correct, 0)));
          }
          // Doğruluk kartı: rozet ve sözcük aynı şeyi söyler.
          const accCard = r.items[5];
          const answeredAll = read.reduce((t, s) => t + s.answered, 0);
          const correctAll = read.reduce((t, s) => t + s.correct, 0);
          if (answeredAll > 0 && correctAll / answeredAll < 0.9) expect(accCard.text, tag).not.toContain('hemen hepsi');
          if (answeredAll > 0 && correctAll === 0) expect(accCard.text, tag).toContain('hiçbiri doğru değildi');
          // Hız kartı: rozet, öne çıkan sayı ve grafik aynı tipik süreyi söyler.
          const hiz = r.items[6];
          if (hiz.visual?.type === 'strip') {
            const sec = hiz.badge!.replace('Tipik süre ', '').replace(' sn', '');
            expect(JSON.stringify(hiz.visual), tag).toContain(`Tipik ${sec} sn`);
          }
          const fig = r.keyFigures.find((k) => k.label === 'Temel işlemlerde tipik süre');
          if (fig) expect(hiz.badge, tag).toBe(`Tipik süre ${fig.value}`);
          if (/Sayılar büyüdükçe/.test(hiz.text)) expect(hiz.text, tag).toMatch(/ ise /);
          if (read.reduce((t, s) => t + s.factCorrect, 0) >= 3 && read.reduce((t, s) => t + s.factRts.length, 0) < 3) expect(hiz.text, tag).toContain('yarım saniyeden kısa');
          // Hata türü cümlesi yalnızca en az iki yanlışta ve örnek gerçek bir yanlıştır.
          const acc = r.items[5];
          for (const m of acc.text.matchAll(/ör\. (\d+) ([+−×÷]) (\d+) için (\d+)/g)) {
            const op = ARITH_OPS.find((o) => ({ add: '+', sub: '−', mul: '×', div: '÷' })[o] === m[2])!;
            expect(arithAnswer(op, [Number(m[1]), Number(m[3])]), tag).not.toBe(Number(m[4]));
          }
          const kinds = read.flatMap((s) => s.wrongs.map((w) => w.kind));
          if (kinds.filter((k) => k === 'regroup').length >= ARITH_ERROR_NOTE && read.reduce((t, s) => t + s.wrong, 0) > 2) expect(acc.text, tag).toMatch(/elde|onlar basamağını/);
          // Çarpma ve bölme yanlışları tek cümlede çelişmez.
          expect(acc.text, tag).not.toMatch(/hepsinde[^.]*\. [^.]*Bazılarında/);
          if (kinds.filter((k) => k === 'regroup').length === 0) expect(acc.text, tag).not.toMatch(/eldeyi|elde ya da/);
          // Uyarılar yalnızca gerçek durumlarda.
          for (const s of results) {
            const name = { add: 'toplama', sub: 'çıkarma', mul: 'çarpma', div: 'bölme' }[s.op];
            expect(r.cautions.some((c) => c.includes('yorumlanmamalıdır') && c.split(' bölüm')[0].includes(name)), `${tag} ${name}`).toBe(!arithRead(s));
            if (s.answered > 0 && s.answered < ARITH_MIN_ANSWERED) expect(r.items[results.indexOf(s) + 1].text, tag).toContain('bu kadar az cevap');
          }
          // Gelişim yol haritası her durumda var.
          expect(r.roadmap, tag).toBeDefined();
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(40);
    const pdf = await renderSimpleReportPdf(evaluate(SLUG, PATTERNS.karisik()).parent as SimpleReport, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 120_000);
});

describe('Zihinden hesaplama: sitede', () => {
  it('yayında, zekâ ve zihinsel beceriler alanında, 4. sınıftan yetişkine; yol haritası herkese açık', () => {
    const d = getInstrumentDef(SLUG)!;
    expect(publicInstruments()).toContain(d);
    expect([d.domain, d.engine, d.minGrade, d.maxGrade, !!d.adults, d.status]).toEqual(['cognitive', 'tasks', 4, 13, true, 'pilot']);
    expect(d.name).not.toMatch(/tanı/i);
    expect(hasPublicRoadmap(SLUG)).toBe(true);
  });
});

describe('Zihinden hesaplama: yayın denetimi', () => {
  it('Yayın iş akışındaki örnek cevaplar ilk düzeylerin sonuçlarıdır', () => {
    const yml = readFileSync('.github/workflows/yayin.yml', 'utf8');
    const m = yml.match(/z=(\{"zh-add": [^}]+\})/);
    expect(m).not.toBeNull();
    const z = JSON.parse(m![1]) as Record<string, number[]>;
    for (const t of tasks) expect(z[t.key], t.key).toEqual(t.items.slice(0, t.perLevel).map((it) => arithAnswer(t.op, it)));
    const r = evaluateReports(SLUG, {
      grade: ADULT_GRADE,
      data: { engine: 'tasks', seed: '6f1c2e0b-3e4b-4a8a-9a55-5d1f0c8e2a11', blocks: Object.fromEntries(Object.entries(z).map(([k, v]) => [k, v.map((a, i) => ({ index: i, response: { answer: a }, rtMs: 2000 }))])) },
    }) as unknown as Record<string, SimpleReport>;
    expect(Object.keys(r)).toEqual(['adult']);
    expect([r.adult.items.length, r.adult.items[0].badge, r.adult.items[1].badge, r.adult.items[1].visual?.type]).toEqual([7, 'Dört bölümde 32 doğru işlem', '60 saniyede 8 doğru', 'dots']);
    expect(r.adult.roadmap!.bars).toHaveLength(4);
  });
});
