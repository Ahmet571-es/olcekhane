import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { PATTERN_LEVEL_TEXTS, PATTERN_PRACTICE_TEXTS, desenHatirlama } from '@/content/instruments/desen-hatirlama';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { patternText } from '@/lib/instruments/pattern';
import type { PatternMemoryTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  PATTERN_RAPID_BASE_MS,
  PATTERN_RAPID_MS_PER_CELL,
  TaskInputError,
  patternFloor,
  patternManySkipped,
  patternRapid,
  scorePattern,
  type PatternResult,
  type PatternTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { dhExtraOne, dhFarOne, dhMissOne, dhNoneRight, dhShiftOne, patternBody, type PatternCell, type PatternPlay } from './helpers/bodies';
import { blocks, diff, diffAny, filled, key, longestRuns, parts, plainLines, read, size, symmetric } from './helpers/pattern-check';
import { schoolWords } from './helpers/school';

const SLUG = 'desen-hatirlama';
const task = desenHatirlama.tasks[0] as PatternMemoryTask;
const TITLES = ['En büyük doğru desen', 'Doğru hatırlanan desenler', 'Hata türleri', 'Çalışma biçimi'];
/** Dolu kare sayısına göre ızgara (satır × sütun): içerik dosyasının başındaki tablo. */
const GRIDS: Record<number, [number, number]> = {
  3: [2, 3],
  4: [2, 4],
  5: [3, 4],
  6: [3, 4],
  7: [4, 4],
  8: [4, 4],
  9: [4, 5],
  10: [4, 5],
  11: [5, 5],
  12: [5, 5],
  13: [5, 6],
  14: [5, 6],
  15: [5, 6],
};
/** Bir düzeydeki desenlerin birbirinden (ve aynı ızgarada art arda gelen desenlerin) en az farkı. */
const need = (n: number) => (n <= 5 ? 1 : n <= 8 ? 2 : n <= 11 ? 3 : 4);

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof patternBody>) => (body.data as unknown as { blocks: Record<string, PatternTrialInput[]> }).blocks[task.key];

describe('Desen hatırlama: desenler', () => {
  const levels = PATTERN_LEVEL_TEXTS.map(([n, ps]) => ({ n, grids: ps.map(read) }));
  const practice = PATTERN_PRACTICE_TEXTS.map(read);

  it('13 büyüklük (3–15 dolu kare), her birinde üç desen; ızgaralar tablodaki gibi, karelerin %42–50’si dolu; 2 alıştırma', () => {
    expect(levels.map((l) => l.n)).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    for (const { n, grids } of levels) {
      expect(grids, String(n)).toHaveLength(3);
      for (const g of grids) {
        const { rows, cols } = size(g);
        expect([rows, cols], key(g)).toEqual(GRIDS[n]);
        expect(filled(g), key(g)).toBe(n);
        expect(n / (rows * cols), key(g)).toBeGreaterThanOrEqual(0.41);
        expect(n / (rows * cols), key(g)).toBeLessThanOrEqual(0.5);
        expect(g.every((r) => r.length === cols), key(g)).toBe(true);
      }
    }
    expect(task.showMs).toBe(3000);
    expect(task.practice.map((p) => p.cells.length)).toEqual([2, 3]);
    // İçerik dosyasının okuyucusu (lib/instruments/pattern.ts) desenleri aynı okur.
    task.levels.forEach((l, i) => {
      expect(l.cells).toBe(levels[i].n);
      l.items.forEach((it, k) => expect(patternText(it)).toBe(PATTERN_LEVEL_TEXTS[i][1][k]));
    });
    task.practice.forEach((p, i) => expect(patternText(p)).toBe(PATTERN_PRACTICE_TEXTS[i]));
    expect(new Set(task.levels.flatMap((l) => l.items.map((x) => x.key))).size).toBe(39);
  });

  it('kolay ad verilecek biçimler yok: dolu ya da boş satır ve sütun, simetri, uzun düz dizi, birden çok dolu ya da boş 2 × 2 bölge', () => {
    for (const { n, grids } of levels) {
      for (const g of grids) {
        const { rows, cols } = size(g);
        const label = `${n}: ${key(g)}`;
        expect(plainLines(g), label).toEqual([]);
        expect(symmetric(g), label).toBe(false);
        const runs = longestRuns(g);
        expect(runs.h, label).toBeLessThanOrEqual(cols <= 4 ? 2 : 3);
        expect(runs.v, label).toBeLessThanOrEqual(rows <= 4 ? 2 : 3);
        expect(runs.d, label).toBeLessThanOrEqual(3);
        const b = blocks(g);
        expect(b.full, label).toBeLessThanOrEqual(1);
        expect(b.empty, label).toBeLessThanOrEqual(1);
      }
    }
  });

  it('dolu kareler birkaç parçaya ayrılır; bir büyüklükteki üç desenin parça sayıları en çok 1 farklı', () => {
    for (const { n, grids } of levels) {
      const ps = grids.map(parts);
      const lo = n <= 3 ? 1 : Math.max(2, Math.ceil(n / 4));
      const hi = n <= 3 ? 2 : Math.max(2, Math.ceil(n / 2.5));
      for (const [i, p] of ps.entries()) {
        expect(p, `${n}: ${key(grids[i])}`).toBeGreaterThanOrEqual(lo);
        expect(p, `${n}: ${key(grids[i])}`).toBeLessThanOrEqual(hi);
      }
      expect(Math.max(...ps) - Math.min(...ps), String(n)).toBeLessThanOrEqual(1);
    }
  });

  it('bir büyüklükteki desenler döndürülse ya da aynada çevrilse bile birbirinden farklı; art arda gelen desenler de; bütün desenler ve alıştırmalar ayrı', () => {
    const flat = levels.flatMap((l) => l.grids.map((g) => ({ n: l.n, g })));
    for (const { n, grids } of levels) {
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) expect(diffAny(grids[i], grids[j]), `${n}: ${key(grids[i])} – ${key(grids[j])}`).toBeGreaterThanOrEqual(need(n));
    }
    for (let i = 1; i < flat.length; i++) {
      const [a, b] = [flat[i - 1], flat[i]];
      const sa = size(a.g);
      const sb = size(b.g);
      if (sa.rows === sb.rows && sa.cols === sb.cols) expect(diff(a.g, b.g), `${key(a.g)} – ${key(b.g)}`).toBeGreaterThanOrEqual(need(b.n));
    }
    expect(new Set(flat.map((x) => key(x.g))).size).toBe(39);
    for (const p of practice) {
      for (const x of flat) {
        const [sp, sx] = [size(p), size(x.g)];
        if (sp.rows === sx.rows && sp.cols === sx.cols) expect(diffAny(p, x.g), `${key(p)} – ${key(x.g)}`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('desenler sabit: desenler değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256').update(JSON.stringify({ levels: task.levels, practice: task.practice, showMs: task.showMs })).digest('hex').slice(0, 16);
    expect({ version: desenHatirlama.version, hash }).toEqual({ version: 1, hash: DESEN_IZI });
  });
});

/** Desenlerin izi (sürüm 1): desenler bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const DESEN_IZI = 'a5665729eb638814';

describe('Desen hatırlama: puanlama', () => {
  const allRight = (q: PatternCell): PatternPlay => ({ cells: q.cells });

  it('hatasız: 39 desenin hepsi doğru, desen aralığı 15, test sonuna kadar sürer', () => {
    const { result } = scorePattern(task, trialsOf(patternBody(allRight)));
    expect([result.span, result.stoppedAt, result.trials, result.correct, result.wrong, result.cellsHit, result.cellsCredit, result.cellsShown]).toEqual([15, null, 39, 39, 0, 351, 351, 351]);
    // Test sonuna kadar sürdüğünde testin bittiği büyüklük en büyük büyüklüktür.
    expect([result.beforeStop, result.skippedBeforeStop, result.restarts]).toEqual([36, 0, 0]);
    expect(result.levels.map((l) => `${l.size}:${l.correct}/${l.n}`).join(' ')).toBe(
      '3:3/3 4:3/3 5:3/3 6:3/3 7:3/3 8:3/3 9:3/3 10:3/3 11:3/3 12:3/3 13:3/3 14:3/3 15:3/3',
    );
  });

  it('varsayılan örnek: 10 kareye kadar, 11 karede biter; eksik kareler ve tek kare farkı sayılır', () => {
    const { result } = scorePattern(task, trialsOf(patternBody()));
    expect([result.span, result.stoppedAt, result.trials, result.correct]).toEqual([10, 11, 27, 20]);
    expect([result.attemptedWrong, result.near, result.fewer, result.more, result.same, result.missed, result.extra, result.shifted]).toEqual([7, 7, 7, 0, 0, 7, 0, 0]);
    expect([result.cellsShown, result.cellsHit, result.cellsCredit, result.beforeStop, result.skippedBeforeStop]).toEqual([189, 182, 182, 24, 0]);
  });

  it('kısmi puan: desende olmayan işaretli kareler düşülür; bütün kareleri işaretlemek puan getirmez', () => {
    const all = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size === 3 && q.k === 0 ? q.cells : Array.from({ length: q.rows * q.cols }, (_, c) => c) })))).result;
    expect([all.span, all.stoppedAt, all.trials]).toEqual([3, 4, 6]);
    expect([all.cellsHit, all.cellsCredit]).toEqual([3 + 3 + 3 + 4 + 4 + 4, 3]);
  });

  it('hata türleri: kayan, uzağa konan, fazla ve "Hatırlamıyorum" ayrı sayılır', () => {
    const plays: Record<string, (q: PatternCell) => number[]> = { shift: dhShiftOne, far: dhFarOne, extra: dhExtraOne, skip: () => [] };
    for (const [name, wrong] of Object.entries(plays)) {
      const { result } = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 6 ? q.cells : wrong(q) }))));
      expect([result.span, result.stoppedAt, result.attemptedWrong + result.skipped], name).toEqual([6, 7, 3]);
      if (name === 'shift') expect([result.same, result.near, result.shifted, result.extra, result.missed], name).toEqual([3, 3, 3, 3, 3]);
      if (name === 'far') expect([result.same, result.near, result.shifted, result.extra], name).toEqual([3, 3, 0, 3]);
      if (name === 'extra') expect([result.more, result.near, result.extra, result.missed], name).toEqual([3, 3, 3, 0]);
      if (name === 'skip') expect([result.skipped, result.attemptedWrong, result.wrong], name).toEqual([3, 0, 3]);
    }
    // Kayma yalnızca 7 ve daha büyük desenlerde sayılır: küçük tabloda rastgele konan kare de çoğu zaman doğru yerin yanına düşer.
    const shifts = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 3 || q.k === 0 ? q.cells : dhShiftOne(q) })))).result;
    expect([shifts.stoppedAt, shifts.attemptedWrong, shifts.same, shifts.near, shifts.shifted]).toEqual([null, 24, 24, 24, 18]);
  });

  it('en küçük desenler de yanlışsa desen aralığı 0 ve uyarı; çok hızlı yanlışlar ve çok "Hatırlamıyorum" ayrıca', () => {
    const floor = scorePattern(task, trialsOf(patternBody((q) => ({ cells: dhMissOne(q) })))).result;
    expect([floor.span, floor.stoppedAt, floor.trials, patternFloor(floor)]).toEqual([0, 3, 3, true]);
    // Çok hızlı ve karelerin çoğu yanlış: bakmadan işaretlenmiş olabilir.
    const fast = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 5 ? q.cells : dhNoneRight(q), rtMs: q.size <= 5 ? 6000 : 300 })))).result;
    expect([fast.rapid, patternRapid(fast)]).toEqual([3, true]);
    // Sınır: 800 ms + kare başına 200 ms; 6 kare işaretlenmişse 2 saniye. Sınırda ya da üstünde sayılmaz.
    const limit = PATTERN_RAPID_BASE_MS + 6 * PATTERN_RAPID_MS_PER_CELL;
    const slow = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 5 ? q.cells : dhNoneRight(q), rtMs: q.size <= 5 ? 6000 : limit })))).result;
    expect(slow.rapid).toBe(0);
    // Hızlı ama doğruya yakın (bir kare eksik): hızlı bir hatırlama olabilir, sayılmaz.
    const quickNear = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 5 ? q.cells : dhMissOne(q), rtMs: q.size <= 5 ? 6000 : 300 })))).result;
    expect(quickNear.rapid).toBe(0);
    const skips = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 3 || q.k === 0 ? q.cells : q.size >= 5 ? [] : q.cells })))).result;
    expect([skips.stoppedAt, skips.beforeStop, skips.skippedBeforeStop, patternManySkipped(skips)]).toEqual([null, 36, 20, true]);
    // Testin bittiği büyüklükte "Hatırlamıyorum" demek düğmenin amacına uygundur: sayılmaz.
    const atStop = scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 6 ? q.cells : [] })))).result;
    expect([atStop.stoppedAt, atStop.skipped, atStop.beforeStop, atStop.skippedBeforeStop, patternManySkipped(atStop)]).toEqual([7, 3, 12, 0, false]);
  });

  it('desen gösterilirken başka uygulamaya geçilince desen yeniden gösterilir: iki ya da daha çok kez olursa not düşülür', () => {
    const once = evaluate(SLUG, patternBody((q) => ({ cells: q.size <= 8 ? q.cells : dhMissOne(q), restarts: q.i === 4 ? 1 : 0 })));
    expect(once.student.cautions).toEqual([]);
    expect(once.student.items[3].text).not.toContain('başka bir uygulamaya');
    const twice = evaluate(SLUG, patternBody((q) => ({ cells: q.size <= 8 ? q.cells : dhMissOne(q), restarts: q.i === 4 || q.i === 9 ? 1 : 0 })));
    expect(scorePattern(task, trialsOf(patternBody((q) => ({ cells: q.size <= 8 ? q.cells : dhMissOne(q), restarts: q.i === 4 || q.i === 9 ? 1 : 0 })))).result.restarts).toBe(2);
    expect(twice.student.cautions.join(' ')).toContain('2 kez başka bir uygulamaya geçilmiş');
    expect(twice.student.items[3].text).toContain('Desen gösterilirken 2 kez başka bir uygulamaya geçtin');
    expect(twice.parent.items[3].text).toContain('Desen gösterilirken 2 kez başka bir uygulamaya geçildi');
    const ok = trialsOf(patternBody());
    for (const restarts of [-1, 1.5, 51]) {
      expect(() => scorePattern(task, [{ ...ok[0], response: { ...ok[0].response, restarts } }, ...ok.slice(1)]), String(restarts)).toThrow(TaskInputError);
    }
  });

  it('eksik, sırası bozuk ya da geçersiz cevap reddedilir; kural gereği bitmesi gereken yerden sonra gelen desen de', () => {
    const ok = trialsOf(patternBody());
    expect(() => scorePattern(task, ok.slice(0, 26))).toThrow(TaskInputError);
    expect(() => scorePattern(task, ok.slice(1))).toThrow(TaskInputError);
    expect(() => scorePattern(task, [])).toThrow(TaskInputError);
    // 11 karede biten bir oturuma 12 karelik desenler eklenemez.
    const extra = [...ok, ...[27, 28, 29].map((index) => ({ index, response: { cells: [0] }, rtMs: 5000 }))];
    expect(() => scorePattern(task, extra)).toThrow(TaskInputError);
    // En büyük düzeye gelmeden, en az bir doğru olan bir düzeyde biten oturum eksiktir.
    expect(() => scorePattern(task, ok.slice(0, 24))).toThrow(TaskInputError);
    const bad = (cells: number[]) => [{ ...ok[0], response: { cells } }, ...ok.slice(1)];
    expect(() => scorePattern(task, bad([0, 0, 1]))).toThrow(TaskInputError);
    expect(() => scorePattern(task, bad([6]))).toThrow(TaskInputError);
    expect(() => scorePattern(task, bad([-1]))).toThrow(TaskInputError);
    expect(() => scorePattern(task, [{ ...ok[0], rtMs: -5 }, ...ok.slice(1)])).toThrow(TaskInputError);
  });
});

describe('Desen hatırlama: rapor', () => {
  it('örnek: dört kart, öne çıkan sayılar ve desen büyüklüğüne göre grafik; üç boyutlu grafik yok', () => {
    const r = evaluate(SLUG, patternBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['En büyük doğru desen', '10 kare'],
      ['Doğru hatırlanan desenler', '27 desenden 20 doğru'],
      ['Hata türleri', 'Hepsinde tek kare farkı'],
      ['Çalışma biçimi', 'Desen başına tipik süre 6 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['En büyük doğru desen', '10 kare'],
      ['Doğru hatırlanan desen', '20/27'],
      ['Karelerde isabet', '%96'],
    ]);
    expect(r.student.items[0].text).toContain('Bütün kareleriyle doğru hatırladığın en büyük desen 10 kareliydi. 11 kareli üç desenin hiçbirini tam doğru hatırlayamadığın için test orada bitti.');
    expect(r.student.items[1].text).toContain('8 kareye kadarki desenlerin hepsini doğru hatırladın');
    // Yanlışların çoğu tek kare farkı: bunu "Hata türleri" kartı söyler, "Doğru hatırlanan desenler" kartı tekrarlamaz.
    expect(r.student.items[1].text).not.toContain('Tam doğru hatırlayamadığın desenlerde de karelerin çoğunu');
    expect(r.student.items[1].text).toMatch(/^Gösterilen 27 desenin 20 tanesini/);
    expect(r.student.items[1].visual?.type === 'stack' ? r.student.items[1].visual.parts.map((x) => x.value) : []).toEqual([20, 7, 0]);
    expect(r.student.items[2].text).toContain('Tam doğru hatırlayamadığın desenlerin hepsinde yalnızca bir kare farklıydı');
    expect(r.student.items[2].text).toContain('Bunların hepsinde desendekinden daha az kare işaretledin');
    expect(r.parent.items[2].text).toContain('Çocuğunuz bunların hepsinde desendekinden daha az kare işaretledi');
    expect(r.parent.items[0].text).toMatch(/^Desenler 3 dolu kareden 15 dolu kareye/);
    expect(r.parent.items[0].text).toContain('Çocuğunuzun bütün kareleriyle doğru hatırladığı en büyük desen 10 kareliydi.');
    const chart = r.student.chart;
    expect(chart?.type === 'bars' ? chart.rows.map((x) => [x.label, x.valueLabel]) : []).toEqual([
      ['3 kareli', '3/3'],
      ['4 kareli', '3/3'],
      ['5 kareli', '3/3'],
      ['6 kareli', '3/3'],
      ['7 kareli', '3/3'],
      ['8 kareli', '3/3'],
      ['9 kareli', '1/3'],
      ['10 kareli', '1/3'],
      ['11 kareli', '0/3'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars).toEqual([]);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('hatasız ve en küçük desenler de yanlış: uç durumlar', () => {
    const top = evaluate(SLUG, patternBody((q) => ({ cells: q.cells })));
    expect(top.student.items.map((i) => i.badge)).toEqual(['15 kare (testin en büyük deseni)', '39 desenin hepsi doğru', 'Hata yok', 'Desen başına tipik süre 6 saniye']);
    expect(top.student.items[0].text).toContain('En büyük (15 kareli) desenlerin hepsini de bütün kareleriyle doğru hatırladın. Testte daha büyük desen olmadığı için');
    expect(top.parent.items[0].text).toContain('Çocuğunuz en büyük (15 kareli) desenlerin hepsini de bütün kareleriyle doğru hatırladı.');
    const topOne = evaluate(SLUG, patternBody((q) => ({ cells: q.size <= 14 || q.k === 1 ? q.cells : dhMissOne(q) })));
    expect(topOne.student.items[0].text).toContain('En büyük (15 kareli) desenlerden birini de bütün kareleriyle doğru hatırladın.');
    // En küçük desenlerden birinde yanılıp sonra hepsini doğru hatırlayan.
    const slip = evaluate(SLUG, patternBody((q) => ({ cells: q.i === 0 ? dhMissOne(q) : q.cells })));
    expect(slip.student.items[1].text).toContain('En küçük (3 kareli) desenlerden birinde yanıldın; daha büyük desenlerin hepsini doğru hatırladın.');
    expect(top.student.items[0].text).not.toContain('kabaca fikir verir');
    const floor = evaluate(SLUG, patternBody((q) => ({ cells: dhMissOne(q) })));
    expect(floor.student.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Desen başına tipik süre 6 saniye']);
    expect(floor.student.items.slice(0, 3).map((i) => i.visual)).toEqual([undefined, undefined, undefined]);
    expect(floor.student.cautions.join(' ')).toContain('en küçük (3 kareli) desenlerin hiçbiri doğru hatırlanmadı');
    expect(floor.student.keyFigures.slice(0, 2).map((f) => f.value)).toEqual(['Yorumlanmadı', 'Yorumlanmadı']);
  });

  it('ikinci tur incelemedeki durumlar: başlıklar, kısmi hatırlama, karışık hata türleri, hepsi "Hatırlamıyorum"', () => {
    // Bir 5 kareli desende bir kare eksik, 7 karede üçü de "Hatırlamıyorum": başlık yalnızca işaretlenen yanlışı anlatır.
    const one = evaluate(SLUG, patternBody((q) => ({ cells: q.size === 5 && q.k === 1 ? dhMissOne(q) : q.size <= 6 ? q.cells : [] })));
    expect(one.student.items[2].badge).toBe('İşaretlenen bir yanlış desen');
    expect(one.student.items[2].text).toContain('Tam doğru hatırlayamadığın 4 desenin 3 tanesinde “Hatırlamıyorum” düğmesine bastın');
    // Küçük desenlerde başlayan yanlışlar "büyük desenlerde yanılmak olağandır" diye anlatılmaz.
    expect(one.student.items[1].text).not.toContain('olağandır');
    const two = evaluate(SLUG, patternBody((q) => ({ cells: (q.size === 5 || q.size === 6) && q.k === 1 ? dhMissOne(q) : q.size <= 6 ? q.cells : [] })));
    expect(two.student.items[2].badge).toBe('İşaretlenenlerin hepsinde tek kare farkı');
    // Bakmadan işaretleme kuşkusu varken kısmi hatırlama cümlesi yazılmaz.
    const rapidMix = evaluate(
      SLUG,
      patternBody((q) => {
        if ((q.size === 3 && q.k > 0) || (q.size === 4 && q.k === 1)) return { cells: dhNoneRight(q), rtMs: 300 };
        if (q.size === 12 && q.k === 1) return { cells: q.cells.slice(0, -2) };
        if (q.size >= 13 && q.k === 1) return { cells: dhMissOne(q) };
        return { cells: q.cells };
      }),
    );
    expect(rapidMix.student.cautions.join(' ')).toContain('çok kısa sürede işaretlenmiş');
    expect(rapidMix.student.items[1].text).not.toContain('karelerin çoğunu doğru yerde');
    // Karışık türler: "desendekinden daha çok ve … desendeki kadar".
    const free = (q: PatternCell) => Array.from({ length: q.rows * q.cols }, (_, c) => c).filter((c) => !q.cells.includes(c));
    const moreTwo = (q: PatternCell) => [...q.cells, ...free(q).slice(0, 2)];
    const sameTwo = (q: PatternCell) => [...q.cells.slice(2), ...free(q).slice(0, 2)];
    const mixed = evaluate(
      SLUG,
      patternBody((q) => ({ cells: q.size <= 8 || q.k === 0 ? q.cells : (q.size === 15 ? q.k === 1 : q.size % 2 === 1) ? moreTwo(q) : sameTwo(q) })),
    );
    expect(mixed.student.items[2].badge).toBe('14 yanlış desen');
    expect(mixed.student.items[2].text).toContain('Tam doğru hatırlayamadığın desenlerin 7 tanesinde desendekinden daha çok ve 7 tanesinde desendeki kadar kare işaretledin.');
    // Bütün desenlerde "Hatırlamıyorum": süre yok, nedeni söylenir.
    const none = evaluate(SLUG, patternBody(() => ({ cells: [] })));
    expect(none.student.items[3].badge).toBe('“Hatırlamıyorum” denen desenler');
    expect(none.student.items[3].text).toBe('Gösterilen 3 desenin hepsinde “Hatırlamıyorum” düğmesine bastın; hiç kare işaretlenmediği için işaretleme süresi yok.');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    // Her denemede ne yapılacağı: doğru, bir kare eksik, bir kare fazla, bir kare kaymış, uzağa konmuş, "Hatırlamıyorum".
    const wrongs: Record<string, (q: PatternCell) => number[]> = {
      eksik: dhMissOne,
      fazla: dhExtraOne,
      kayan: dhShiftOne,
      uzak: dhFarOne,
      bos: () => [],
      karisik: (q) => [dhMissOne, dhExtraOne, dhShiftOne, dhFarOne, () => [] as number[]][q.i % 5](q),
      cokEksik: (q) => q.cells.slice(0, Math.max(1, Math.floor(q.cells.length / 2))),
    };
    // Hangi denemelerin doğru olduğu (sınır büyüklüğü ve düzeydeki doğru sayısı).
    const correctness: Record<string, (q: PatternCell) => boolean> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkDuzey: (q) => q.size === 3 && q.k === 0,
      yedi: (q) => q.size <= 7,
      onBirTek: (q) => q.size <= 9 || (q.size <= 11 && q.k === 2),
      dalgali: (q) => q.size <= 5 || q.k === (q.size % 3),
      buyukte: (q) => q.size <= 12 || q.k === 0,
    };
    const times: Record<string, (q: PatternCell) => number | null> = {
      normal: (q) => 1500 + 600 * q.size,
      hizli: (q) => (q.size >= 6 ? 250 : 5000),
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongs)) {
        for (const [tName, rt] of Object.entries(times)) {
          const body = patternBody((q) => ({ cells: correct(q) ? q.cells : wrong(q), rtMs: correct(q) && tName === 'hizli' ? 5000 : rt(q) }), 7);
          const label = `${cName}/${wName}/${tName}`;
          const res = evaluate(SLUG, body);
          const result: PatternResult = scorePattern(task, trialsOf(body)).result;
          const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
          const floor = patternFloor(result);
          const many = !floor && patternManySkipped(result);
          const rapid = !floor && patternRapid(result);
          for (const r of [res.student, res.parent, adult]) {
            const t = text(r);
            expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
            expect(
              r.items.map((i) => i.title),
              label,
            ).toEqual(TITLES);
            for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
            expect(r.items[0].badge, label).toBe(floor ? 'Yorumlanmadı' : result.stoppedAt === null ? `${result.span} kare (testin en büyük deseni)` : `${result.span} kare`);
            expect(r.items[1].badge, label).toBe(
              floor ? 'Yorumlanmadı' : result.correct === result.trials ? `${result.trials} desenin hepsi doğru` : `${result.trials} desenden ${result.correct} doğru`,
            );
            expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(floor);
            expect(r.items[2].badge === 'Hata yok', label).toBe(!floor && result.wrong === 0);
            expect(r.cautions.some((c) => c.includes('en küçük')), label).toBe(floor);
            expect(r.cautions.some((c) => c.includes('“Hatırlamıyorum” denmiş')), label).toBe(many);
            expect(r.cautions.some((c) => c.includes('çok kısa sürede işaretlenmiş ve karelerinin çoğu yanlış')), label).toBe(rapid);
            expect(r.items[3].text.includes('çok kısa sürede işaretlendi ve karelerinin çoğu yanlıştı'), label).toBe(rapid);
            const hedged = /tam yansıtmayabilir/.test(r.items[0].text);
            expect(hedged, label).toBe(many || rapid);
            expect(r.chart?.type === 'bars' ? r.chart.rows.map((x) => x.valueLabel) : [], label).toEqual(result.levels.map((l) => `${l.correct}/3`));
            expect(r.keyFigures.map((f) => f.value)[1], label).toBe(floor ? 'Yorumlanmadı' : `${result.correct}/${result.trials}`);
            expect(r.roadmap!.bars, label).toEqual([]);
            // Hata türü yalnızca en az iki denenmiş yanlış desende ve yarıdan çoğunda görülünce söylenir.
            const h = r.items[2].text;
            if (!floor && result.attemptedWrong >= 2) {
              expect(/çoğunda desendekinden daha az|hepsinde desendekinden daha az/.test(h), label).toBe(2 * result.fewer > result.attemptedWrong);
              expect(/desendekinden daha çok kare/.test(h), label).toBe(2 * result.fewer <= result.attemptedWrong && 2 * result.more > result.attemptedWrong);
              expect(/hemen yanına konmuştu/.test(h), label).toBe(result.shifted >= 2);
              expect(/yalnızca bir kare farklıydı/.test(h), label).toBe(2 * result.near >= result.attemptedWrong);
              expect(/ yarısında yalnızca bir kare/.test(h), label).toBe(2 * result.near === result.attemptedWrong);
              const sc = (q: string) => (result.skipped > 0 ? `İşaretlenenlerin ${q}` : `${q.charAt(0).toLocaleUpperCase('tr-TR')}${q.slice(1)}`);
              expect(r.items[2].badge === sc('yarısında tek kare farkı'), label).toBe(2 * result.near === result.attemptedWrong);
              expect(r.items[2].badge === sc('çoğunda tek kare farkı'), label).toBe(2 * result.near > result.attemptedWrong && result.near < result.attemptedWrong);
              expect(r.items[2].badge === sc('hepsinde tek kare farkı'), label).toBe(result.near === result.attemptedWrong);
            } else {
              expect(h, label).not.toMatch(/çoğunda|yarısında|hemen yanına konmuştu/);
            }
            // Kısmi hatırlama cümlesi yalnızca yanlış desenlerde karelerin en az dörtte üçü doğruysa (desende olmayan kareler düşülerek).
            if (!floor && r.items[1].text.includes('karelerin çoğunu doğru yerde')) {
              const tried = result.items.filter((x) => !x.correct && !x.skipped);
              const credit = tried.reduce((a, x) => a + Math.max(0, x.hits - x.extra), 0);
              expect(credit >= 0.75 * tried.reduce((a, x) => a + x.size, 0), label).toBe(true);
              expect(tried.every((x) => 2 * Math.max(0, x.hits - x.extra) >= x.size), label).toBe(true);
              expect(rapid, label).toBe(false);
            }
            // Öne çıkan sayılardaki isabet aşağı yuvarlanır: bir hata varken %100 görünmez.
            expect(r.keyFigures[2].value === '%100', label).toBe(result.cellsCredit === result.cellsShown);
            if (!floor && result.skipped > 0 && !many) expect(r.items[3].text, label).toContain('“Hatırlamıyorum” düğmesine bas');
            // "Bazılarını doğru, bazılarını yanlış" yalnızca ilk yanlışın olduğu büyüklükte ya da sonrasında doğru desen varsa.
            const firstMiss = result.levels.findIndex((l) => l.correct < l.n);
            if (r.items[1].text.includes('bazılarını doğru, bazılarını yanlış')) {
              expect(result.levels.slice(firstMiss).some((l) => l.correct > 0), label).toBe(true);
            }
            // Kısmi hatırlama cümlesi ile tek kare farkı cümlesi aynı raporda birlikte geçmez.
            expect(r.items[1].text.includes('karelerin çoğunu doğru yerde') && r.items[2].text.includes('yalnızca bir kare farklıydı'), label).toBe(false);
            // Hata türü cümlelerinde "Hatırlamıyorum" denen desenler sayılmaz.
            if (result.skipped > 0 && result.attemptedWrong >= 2) expect(r.items[2].text, label).not.toMatch(/(^|\. )(Çocuğunuz )?[Yy]anlış desenlerin/);
            if (result.skipped === result.trials) expect(r.items[3].badge, label).toBe('“Hatırlamıyorum” denen desenler');
            else if (result.medianRt === null) expect(r.items[3].badge, label).toBe('Süre hesaplanamadı');
            // "Hatırlamıyorum" denen desen varsa hata türü başlığı yalnızca işaretlenen yanlış desenleri anlattığını söyler.
            if (!floor && result.skipped > 0 && result.attemptedWrong > 0) expect(r.items[2].badge, label).toMatch(/^İşaretlenen/);
            // "Büyük desenlerde yanılmak olağandır" yalnızca yanlışlar 7 ya da daha büyük desenlerde başladıysa.
            if (r.items[1].text.includes('yanılmak bu testte olağandır')) expect(result.levels[firstMiss].size, label).toBeGreaterThanOrEqual(7);
            // Karışık hata türlerinde karşılaştırma sözcüğü vardır.
            if (/(?<!desendekinden )daha çok (ve|kare)/.test(r.items[2].text)) expect(r.items[2].text, label).toMatch(/desendekinden daha az, /);
          }
          expect(text(res.student), label).not.toContain('Çocuğunuz');
          expect(text(adult), label).not.toContain('Çocuğunuz');
          expect(text(res.parent), label).not.toMatch(/(?<!\p{L})(hatırladın|hatırlayamadın|işaretledin|bastın|harcadın|yanıldın|tutabildin|olabilirsin|basmadın|yanılmadın|işaretlemedin)(?!\p{L})/u);
          expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
          n++;
        }
      }
    }
    expect(n).toBe(7 * 7 * 3);
  }, 300_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, patternBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, patternBody(undefined, 3)).student.items).toHaveLength(4);
    const r = evaluateReports(SLUG, patternBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([desenHatirlama.intro.title, ...desenHatirlama.intro.paragraphs, ...task.instructions].join(' '))).toEqual([]);
    // Önerilen sonraki testler: 3–4. sınıfta kelime listesi ve gizli şekiller, 5. sınıftan itibaren ve yetişkinde kelime
    // listesi ve hesapla ve hatırla.
    const next = (grade: number) => evaluateReports(SLUG, patternBody(undefined, grade));
    const weeks = (x: ReturnType<typeof next>) => ('adult' in x ? x.adult : x.student).roadmap!.weeks;
    expect(weeks(next(3)).at(-1)!.text).toContain('Kelime Listesi Hatırlama ve Gizli Şekiller');
    // Adlardan biri "ve" ya da iki nokta içerdiği için adlar tırnak içindedir.
    expect(weeks(next(7)).at(-1)!.text).toContain('“Kelime Listesi Hatırlama” ve “Çalışma Belleği: Hesapla ve Hatırla”');
    expect(weeks(next(ADULT_GRADE)).at(-1)!.text).toContain('“Kelime Listesi Hatırlama” ve “Çalışma Belleği: Hesapla ve Hatırla”');
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar bu testin desenleridir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    expect(yml).toContain('/api/rapor/desen-hatirlama');
    expect(yml).toContain('desen-hatirlama-raporu');
    const m = /DH_DESEN=\(([^)]*)\)/.exec(yml);
    expect(m?.[1].trim().split(/\s+/)).toEqual(task.levels.flatMap((l) => l.items.map((it) => it.cells.join(','))));
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, patternBody());
    const adult = evaluateAdult(SLUG, { ...patternBody(), grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı ve metinde anılıyor', () => {
    expect(desenHatirlama.status).toBe('pilot');
    expect([desenHatirlama.minGrade, desenHatirlama.maxGrade, desenHatirlama.adults]).toEqual([3, 13, true]);
    expect(publicInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(desenHatirlama.name).not.toMatch(/tanı/i);
    const sc = desenHatirlama.science;
    expect(sc.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...sc, citations: [] });
    for (const a of [
      'Della Sala ve ark., 1999',
      'Brown ve ark., 2006',
      'Brown ve Wesley, 2013',
      'Wilson ve ark., 1987',
      'Logie ve Pearson, 1997',
      'Pickering ve ark., 2001',
      'Mammarella ve ark., 2008',
      'Johnson ve ark., 2010',
      'Melby-Lervåg ve Hulme, 2013',
      'Melby-Lervåg ve ark., 2016',
      'Phillips, 1974',
    ]) {
      expect(body, a).toContain(a);
    }
    for (const c of sc.citations) expect(body, c.text).toContain(c.text.split(',')[0].replace(/\.$/, ''));
    expect(sc.ageNote).toContain('yetişkinler de çözebilir');
    expect(sc.limitations.join(' ')).toContain('Zekâ puanı (IQ) vermez ve tanı koymaz');
    const rm = TASK_ROADMAPS[SLUG];
    for (const x of rm.sources) expect(sc.citations.some((c) => c.text === x.text), x.text).toBe(true);
  });
});
