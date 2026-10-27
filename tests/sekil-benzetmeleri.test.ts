import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { ANALOGY_PRACTICE_SPECS, ANALOGY_SPECS, sekilBenzetmeleri } from '@/content/instruments/sekil-benzetmeleri';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { applyOps, buildAnalogyItem, describePanel, el } from '@/lib/instruments/analogy';
import type { AnalogyChange, AnalogyLure, AnalogyPanel, FiguralAnalogyTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { ANALOGY_LURE_NAMES, ANALOGY_LURE_SEEN, ANALOGY_TYPES } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  ANALOGY_CHANCE_MAX,
  ANALOGY_LURE_NOTE,
  ANALOGY_LURE_P,
  ANALOGY_LURES_ORDER,
  ANALOGY_RAPID_MS,
  ANALOGY_SAME_MAX_CORRECT,
  ANALOGY_TYPE_P,
  TaskInputError,
  analogyChance,
  analogyLureStandsOut,
  analogyRapid,
  analogySamePosition,
  scoreAnalogy,
  type AnalogyResult,
  type AnalogyTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { changeList, layoutProblems, lureKind, panelSig, shortcutScores, solveAnalogy } from './helpers/analogy-check';
import { analogyBody, analogyLureOption, analogyMissOption, analogyRank, type AnalogyCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'sekil-benzetmeleri';
const task = sekilBenzetmeleri.tasks[0] as FiguralAnalogyTask;
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Değişiklik türleri', 'Yanlışlarda seçilen şekiller', 'Çalışma biçimi'];
const ITEMS = [...task.items.map((it, i) => ({ it, answer: task.answers[i], lures: task.optionLures[i] })), ...task.practice.map((p) => ({ it: p, answer: p.answer, lures: buildAnalogyItem(ANALOGY_PRACTICE_SPECS.find((s) => s.key === p.key)!).lures }))];
/** Değişen özelliklerin türleri. */
const KIND_OF: Record<string, AnalogyChange> = { renk: 'look', büyüklük: 'look', duruş: 'turn', yer: 'place', sayı: 'place' };

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof analogyBody>) => (body.data as unknown as { blocks: Record<string, AnalogyTrialInput[]> }).blocks[task.key];

describe('Şekil benzetmeleri: sorular', () => {
  it('24 soru, 5 düzey (4, 5, 5, 5, 5), kolaydan zora; 3 alıştırma; her soruda dört seçenek; parçalar bir ya da iki', () => {
    expect(task.items).toHaveLength(24);
    expect([1, 2, 3, 4, 5].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([4, 5, 5, 5, 5]);
    for (let i = 1; i < task.items.length; i++) expect(task.items[i].level).toBeGreaterThanOrEqual(task.items[i - 1].level);
    expect(task.practice).toHaveLength(3);
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    for (const { it } of ITEMS) {
      expect(it.options, it.key).toHaveLength(4);
      for (const p of [it.a, it.b, it.c, ...it.options]) expect([1, 2], it.key).toContain(p.length);
      expect(it.a.length, it.key).toBe(it.c.length);
      expect(task.answers.length).toBe(24);
    }
    expect(new Set(task.items.map((it) => it.key)).size).toBe(24);
  });

  it('tek doğru cevap: A’yı B’ye götüren en yalın yorumların hepsi C’ye uygulanınca yalnızca doğru seçenek çıkar; yanlış seçeneklerin hiçbiri bir fazla değişiklikli bir yorumla da çıkmaz', () => {
    for (const { it, answer } of ITEMS) {
      const sol = solveAnalogy(it.a, it.b, it.c);
      const sigs = it.options.map(panelSig);
      expect([...sol.answers], it.key).toEqual([sigs[answer - 1]]);
      for (const [i, s] of sigs.entries()) if (i !== answer - 1) expect(sol.near.has(s), `${it.key} ${i + 1}`).toBe(false);
    }
  });

  it('düzeyler değişikliklerin sayısına ve türüne göre: 1. düzey bir renk ya da büyüklük, 2. düzey bir duruş, yer ya da sayı, 3. düzey bir parçada iki, 4. düzey iki parçada iki, 5. düzey üç değişiklik', () => {
    for (const { it } of ITEMS) {
      const sol = solveAnalogy(it.a, it.b, it.c);
      const changes = changeList(it.c, it.options[ITEMS.find((x) => x.it === it)!.answer - 1]);
      const els = new Set(changes.map((x) => x.i));
      expect(sol.min, it.key).toBe([0, 1, 1, 2, 2, 3][it.level]);
      if (it.level === 1) expect(changes.map((x) => x.attr).every((x) => x === 'renk' || x === 'büyüklük'), it.key).toBe(true);
      if (it.level === 2) expect(changes.map((x) => x.attr).every((x) => x === 'duruş' || x === 'yer' || x === 'sayı'), it.key).toBe(true);
      if (it.level === 3) expect(els.size, it.key).toBe(1);
      if (it.level === 4) expect([it.a.length, els.size], it.key).toEqual([2, 2]);
      // Değişikliklerin türleri (raporda değişiklik türleri) çizimdeki değişikliklerle aynı.
      expect([...new Set(changes.map((x) => KIND_OF[x.attr]))].sort(), it.key).toEqual([...it.changes].sort());
    }
    expect((['look', 'turn', 'place'] as AnalogyChange[]).map((t) => task.items.filter((it) => it.changes.includes(t)).length)).toEqual([16, 15, 10]);
  });

  it('C, A’dan biçimiyle ayrılır; değişen özellikler C’de A’daki gibi başlar (değişikliğin mutlak ya da göreli okunması aynı cevabı verir)', () => {
    for (const { it, answer } of ITEMS) {
      expect(it.c.some((e, i) => e.shape !== it.a[i].shape), it.key).toBe(true);
      for (const ch of changeList(it.c, it.options[answer - 1])) {
        const x = it.a[ch.i];
        const y = it.c[ch.i];
        const same = { renk: x.fill === y.fill, büyüklük: x.size === y.size, sayı: x.count === y.count, yer: x.slot === y.slot, duruş: x.angle === y.angle && x.flip === y.flip }[ch.attr];
        expect(same, `${it.key} ${ch.i} ${ch.attr}`).toBe(true);
      }
    }
  });

  it('yanlış seçeneklerin türü çizimlerden bağımsızca bulunur ve içerikteki türle aynıdır; seçenekler birbirinden, A’dan ve B’den farklı', () => {
    for (const { it, answer, lures } of ITEMS) {
      const correct = it.options[answer - 1];
      const sigs = it.options.map(panelSig);
      expect(new Set(sigs).size, it.key).toBe(4);
      expect(sigs.includes(panelSig(it.a)) || sigs.includes(panelSig(it.b)), it.key).toBe(false);
      for (const [i, o] of it.options.entries()) {
        if (i === answer - 1) expect(lures[i], it.key).toBeNull();
        else expect(lureKind(it.a, it.b, it.c, correct, o), `${it.key} ${i + 1}`).toBe(lures[i]);
      }
      // Değişmemiş seçenek C'nin aynısıdır ve bir soruda en çok bir tane vardır.
      expect(lures.filter((x) => x === 'copy').length, it.key).toBeLessThanOrEqual(1);
      expect(it.options.filter((o) => panelSig(o) === panelSig(it.c)).length, it.key).toBe(lures.includes('copy') ? 1 : 0);
    }
    // Her yanılgı türü yeterince sık; eksik değişiklik yalnızca iki ve üç değişiklikli sorularda olabilir.
    const count = (k: AnalogyLure) => task.optionLures.flat().filter((x) => x === k).length;
    expect(ANALOGY_LURES_ORDER.map(count)).toEqual([12, 10, 37, 13]);
    for (const [i, it] of task.items.entries()) if (it.level <= 2) expect(task.optionLures[i], it.key).not.toContain('partial');
    // Fazladan değişiklik her zaman şekli ikinci şekle benzetir: değişmemesi gereken özellik B'deki değeri alır.
    for (const { it, answer, lures } of ITEMS) {
      for (const [i, o] of it.options.entries()) {
        if (lures[i] !== 'extra') continue;
        const diff = changeList(it.options[answer - 1], o);
        expect(diff, `${it.key} ${i + 1}`).toHaveLength(1);
        const { i: e, attr } = diff[0];
        const key = ({ renk: 'fill', büyüklük: 'size', sayı: 'count', yer: 'slot', duruş: 'angle' } as const)[attr];
        expect(o[e][key], `${it.key} ${i + 1}`).toBe(it.b[e][key]);
      }
    }
  });

  it('her seçenekte uygulanmayan değişikliklerin türü çizimlerden bağımsızca bulunur: değişmemiş şekil hepsini, eksik şekil bir kısmını kaçırır; fazladan değişiklik hiçbirini kaçırmaz', () => {
    for (const [n, it] of task.items.entries()) {
      const correct = it.options[task.answers[n] - 1];
      const required = changeList(it.c, correct);
      for (const [j, o] of it.options.entries()) {
        const diff = changeList(correct, o);
        const missed = new Set(required.filter((r) => diff.some((d) => d.i === r.i && d.attr === r.attr)).map((r) => KIND_OF[r.attr]));
        const expected = (['look', 'turn', 'place'] as AnalogyChange[]).filter((t) => missed.has(t));
        expect(task.optionMisses[n][j], `${it.key} ${j + 1}`).toEqual(expected);
        const kind = task.optionLures[n][j];
        if (kind === null || kind === 'extra') expect(expected, `${it.key} ${j + 1}`).toEqual([]);
        if (kind === 'copy') expect(expected, `${it.key} ${j + 1}`).toEqual((['look', 'turn', 'place'] as AnalogyChange[]).filter((t) => it.changes.includes(t)));
        if (kind === 'partial' || kind === 'wrong') expect(expected.length, `${it.key} ${j + 1}`).toBeGreaterThan(0);
        for (const t of expected) expect(it.changes, `${it.key} ${j + 1}`).toContain(t);
      }
      // Bir tür, o türü kaçıran bir seçeneğin bulunduğu soruda sınanır. Yalnızca sb16'daki yer değişikliği sınanmaz (bütün
      // seçeneklerde parçalar yer değiştirmiş); puanlama onu türün sorularından saymaz.
      for (const t of it.changes) expect(task.optionMisses[n].some((m) => m.includes(t)), `${it.key} ${t}`).toBe(!(it.key === 'sb16' && t === 'place'));
    }
  });

  it('çizimler görünür: parçalar panodan ve çerçeveden taşmaz, birbirine binmez; çerçevenin içindeki parça çerçeveyle aynı renkte değil', () => {
    for (const { it } of ITEMS) {
      for (const [name, p] of [['A', it.a], ['B', it.b], ['C', it.c], ...it.options.map((o, i) => [`seçenek ${i + 1}`, o] as const)] as [string, AnalogyPanel][]) {
        expect(layoutProblems(p), `${it.key} ${name}`).toEqual([]);
        expect(describePanel(p), `${it.key} ${name}`).not.toMatch(/undefined|NaN/);
      }
    }
    // Yönergedeki örnek (bileşendeki çizimle aynı).
    expect(layoutProblems([el('star', { fill: 'gray' })])).toEqual([]);
  });

  it('doğru seçenek kestirme yollarla bulunamaz: 24 soruda her kestirme yol şans düzeyine yakın (6 doğru); değişiklik sayısını saymak en çok yaklaşık 10 doğru verir', () => {
    const totals: Record<string, number> = {};
    for (const [i, it] of task.items.entries()) {
      const s = shortcutScores(it.a, it.b, it.c, it.options, task.answers[i] - 1);
      for (const [k, v] of Object.entries(s)) {
        totals[k] = (totals[k] ?? 0) + v;
        // Yalnızca seçeneklere bakan yollar hiçbir soruda doğru cevabı kesin olarak bulmaz.
        if (['çoğunluk', 'azınlık', 'benzer', 'aykırı'].includes(k)) expect(v, `${it.key} ${k}`).toBeLessThanOrEqual(0.5);
      }
    }
    for (const [k, v] of Object.entries(totals)) expect(v, k).toBeLessThanOrEqual(k === 'değişiklikSayısı' ? 10 : 7.5);
  });

  it('doğru seçeneklerin yeri dengeli (her sırada 6) ve aynı sıra art arda en çok iki kez', () => {
    expect([1, 2, 3, 4].map((p) => task.answers.filter((a) => a === p).length)).toEqual([6, 6, 6, 6]);
    for (let i = 2; i < task.answers.length; i++) expect(task.answers[i] === task.answers[i - 1] && task.answers[i] === task.answers[i - 2], String(i)).toBe(false);
  });

  it('alıştırma: renk, ayna görüntüsü ve iki değişiklik; seçeneklerin sırası açıklamadaki harflerle uyumlu', () => {
    const [p1, p2, p3] = task.practice;
    expect(task.practice.map((p) => p.changes)).toEqual([['look'], ['turn'], ['turn', 'look']]);
    expect(ITEMS.find((x) => x.it === p1)!.lures).toEqual(['copy', 'extra', null, 'wrong']);
    expect(p1.answer).toBe(3);
    expect(p1.explain).toContain('A’da hiçbir şey değişmemiş; B’deki daha büyük siyah üçgende büyüklük de değişmiş; D’deki daha büyük, içi boş üçgende ise renk yerine büyüklük değişmiş.');
    // Daha büyük seçenekler orta boy (C küçük).
    expect([p1.c[0].size, p1.options[1][0].size, p1.options[3][0].size]).toEqual([1, 2, 2]);
    expect(ITEMS.find((x) => x.it === p2)!.lures).toEqual(['wrong', 'extra', 'copy', null]);
    expect(p2.answer).toBe(4);
    expect(p2.explain).toContain('A’da şekil ayna yerine yarım tur döndürülmüş; B’de ayna görüntüsü doğru ama rengi de değişmiş; C’de hiçbir şey değişmemiş.');
    // Doğru cevapta gri dik üçgen ayna görüntüsünde (dik köşesi sağ altta); A'da yarım tur dönmüş.
    expect(p2.options[3][0]).toMatchObject({ shape: 'wedge', angle: 0, flip: true, fill: 'gray' });
    expect(p2.options[0][0]).toMatchObject({ shape: 'wedge', angle: 180, flip: false, fill: 'gray' });
    expect(p2.options[1][0]).toMatchObject({ shape: 'wedge', angle: 0, flip: true, fill: 'empty' });
    expect(ITEMS.find((x) => x.it === p3)!.lures).toEqual(['partial', null, 'wrong', 'copy']);
    expect(p3.answer).toBe(2);
    expect(p3.explain).toContain('A’da yalnızca renk değişmiş, dönüş eksik; C’de bayrak ters yöne, saat yönünde dönmüş; D’de hiçbir şey değişmemiş.');
    // Alıştırmanın çizimleri: doğru cevapta bayrak saat yönünün tersine çeyrek tur dönmüş ve gri.
    expect(p3.options[1][0]).toMatchObject({ shape: 'flag', angle: 270, flip: false, fill: 'gray' });
  });

  it('yanlış seçeneklerin türleri A–D arasında dengeli: bir sıradaki seçeneği hep seçmek bir yanılgı gibi görünmez', () => {
    for (const range of [[0, 24], [0, 14], [14, 24]]) {
      const idx = task.items.map((_, i) => i).filter((i) => i >= range[0] && i < range[1]);
      for (const k of ANALOGY_LURES_ORDER) {
        const at = [0, 1, 2, 3].map((p) => idx.filter((i) => task.optionLures[i][p] === k).length);
        const total = at.reduce((a, b) => a + b, 0);
        for (const [p, c] of at.entries()) expect(Math.abs(c - total / 4), `${range} ${k} ${p + 1}: ${at}`).toBeLessThanOrEqual(1.25);
      }
    }
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, lures: task.optionLures, misses: task.optionMisses, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    // Sürüm 2 (2026-10-27): yanlış seçeneklerin sırası A–D arasında dengelendi, ayna görüntüsü alıştırması eklendi.
    expect({ version: sekilBenzetmeleri.version, hash }).toEqual({ version: 2, hash: SORU_IZI });
    // İçerik dosyasındaki tanımlar ile görevdeki sorular aynı.
    expect(ANALOGY_SPECS.map((s) => applyOps(s.c, s.ops)).map(panelSig)).toEqual(task.items.map((it, i) => panelSig(it.options[task.answers[i] - 1])));
  });
});

/** Soruların izi (sürüm 2): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '6a31438599d070ae';

describe('Şekil benzetmeleri: puanlama', () => {
  const all = (fn: (i: number) => Partial<AnalogyTrialInput> = () => ({})): AnalogyTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 12_000, ...fn(index) }));
  const cell = (i: number): AnalogyCell => ({ level: task.items[i].level, answer: task.answers[i], lures: task.optionLures[i], misses: task.optionMisses[i], i });

  it('hatasız: 24 doğru, bütün düzeyler ve türler tam', () => {
    const { result } = scoreAnalogy(task, all());
    expect([result.correct, result.reached, result.wrong, result.rapid, result.rapidOf, result.samePosition]).toEqual([24, 5, 0, 0, 15, 6]);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['4/4', '5/5', '5/5', '5/5', '5/5']);
    expect(result.types.map((x) => `${x.type} ${x.applied}/${x.n}`)).toEqual(['look 16/16', 'turn 15/15', 'place 9/9']);
    expect(result.offeredByKind).toEqual({ copy: 12, partial: 10, wrong: 37, extra: 13 });
    expect(result.medianRtCorrect).toBe(12_000);
  });

  it('yanılgı türleri, değişiklik türleri, çok hızlı yanlış ve hep aynı yer ayrı ayrı sayılır', () => {
    const cp3 = scoreAnalogy(task, all((i) => (task.items[i].level >= 3 && task.optionLures[i].includes('copy') ? { response: analogyLureOption(cell(i), 'copy') } : {}))).result;
    expect([cp3.luresByKind.copy, cp3.luresByKind.partial, cp3.wrong]).toEqual([cp3.wrong, 0, task.items.filter((it, i) => it.level >= 3 && task.optionLures[i].includes('copy')).length]);
    const pa = scoreAnalogy(task, all((i) => (task.optionLures[i].includes('partial') ? { response: analogyLureOption(cell(i), 'partial') } : {}))).result;
    expect([pa.luresByKind.partial, pa.wrong]).toEqual([10, 10]);
    // Her değişiklik ayrı sayılır: döndürmeyi kaçıran yanlış bir cevapta doğru uygulanan renk ya da yer değişikliği uygulanmış sayılır.
    const noTurn = scoreAnalogy(task, all((i) => (task.items[i].changes.includes('turn') ? { response: analogyMissOption(cell(i), 'turn') } : {}))).result;
    expect(noTurn.types.find((x) => x.type === 'turn')!.applied).toBe(0);
    const tested = (i: number, t: AnalogyChange) => task.items[i].changes.includes(t) && task.optionMisses[i].some((m) => m.includes(t));
    for (const t of ['look', 'place'] as AnalogyChange[]) {
      const lost = task.items.filter((it, i) => tested(i, t) && it.changes.includes('turn') && task.optionMisses[i][analogyMissOption(cell(i), 'turn') - 1].includes(t)).length;
      const x = noTurn.types.find((y) => y.type === t)!;
      expect([x.n, x.applied], t).toEqual([task.items.filter((_, i) => tested(i, t)).length, task.items.filter((_, i) => tested(i, t)).length - lost]);
    }
    // Değişmemiş şekil seçilince sorudaki bütün türler uygulanmamış sayılır; fazladan değişiklikli şekilde hepsi uygulanmış sayılır.
    const cp = scoreAnalogy(task, all((i) => (task.optionLures[i].includes('copy') ? { response: analogyLureOption(cell(i), 'copy') } : {}))).result;
    for (const x of cp.types) expect(x.applied, x.type).toBe(task.items.filter((_, i) => tested(i, x.type) && !task.optionLures[i].includes('copy')).length);
    const ex = scoreAnalogy(task, all((i) => (task.optionLures[i].includes('extra') ? { response: analogyLureOption(cell(i), 'extra') } : {}))).result;
    expect([ex.wrong, ex.types.map((x) => x.applied === x.n)]).toEqual([13, [true, true, true]]);
    const rapid = scoreAnalogy(task, all((i) => ({ rtMs: ANALOGY_RAPID_MS - 1, response: analogyLureOption(cell(i)) }))).result;
    expect([rapid.rapid, rapid.rapidOf, analogyRapid(rapid)]).toEqual([15, 15, true]);
    expect(scoreAnalogy(task, all(() => ({ rtMs: ANALOGY_RAPID_MS - 1 }))).result.rapid).toBe(0);
    const same = scoreAnalogy(task, all(() => ({ response: 3 }))).result;
    expect([same.samePosition, analogySamePosition(same)]).toEqual([24, true]);
    expect(ANALOGY_CHANCE_MAX).toBe(9);
    // Yalnızca 1. düzeye dört sorunun üçüyle ulaşan ve en çok 9 doğru veren: rastgele seçimden ayırt edilemez.
    const weak1 = scoreAnalogy(task, all((i) => (i === 0 || i >= 6 ? { response: analogyLureOption(cell(i)) } : {}))).result;
    expect([weak1.correct, weak1.reached, analogyChance(weak1)]).toEqual([5, 1, true]);
    const full1 = scoreAnalogy(task, all((i) => (i >= 6 ? { response: analogyLureOption(cell(i)) } : {}))).result;
    expect([full1.correct, full1.reached, analogyChance(full1)]).toEqual([6, 1, false]);
    expect(ANALOGY_LURE_NOTE).toBe(3);
    const mixed = scoreAnalogy(task, all((i) => (i < 12 ? { rtMs: 5000 } : { response: analogyLureOption(cell(i)), rtMs: 30_000 }))).result;
    expect([mixed.medianRtCorrect, mixed.medianRt]).toEqual([5000, 17_500]);
  });

  it('yanılgının beklenenden sık olup olmadığı: olasılık, yanlışlardaki seçeneklerin bütün birleşimleri sayılarak doğrulanır', () => {
    const exact = (r: AnalogyResult, wrongIdx: number[], k: AnalogyLure) => {
      let hit = 0;
      let total = 0;
      const walk = (d: number, count: number) => {
        if (d === wrongIdx.length) {
          total++;
          if (count >= r.luresByKind[k]) hit++;
          return;
        }
        for (const l of task.optionLures[wrongIdx[d]].filter((x) => x !== null)) walk(d + 1, count + (l === k ? 1 : 0));
      };
      walk(0, 0);
      return hit / total;
    };
    const patterns: ((i: number) => Partial<AnalogyTrialInput>)[] = [
      (i) => (task.items[i].level >= 4 ? { response: analogyLureOption(cell(i), 'wrong') } : {}),
      (i) => (i % 2 ? { response: analogyLureOption(cell(i), ANALOGY_LURES_ORDER[i % 4]) } : {}),
      (i) => (i >= 14 ? { response: analogyLureOption(cell(i), 'extra') } : {}),
      (i) => (i % 3 === 0 ? { response: analogyLureOption(cell(i), 'copy') } : {}),
    ];
    for (const [n, fn] of patterns.entries()) {
      const trials = all(fn);
      const r = scoreAnalogy(task, trials).result;
      const wrongIdx = trials.filter((t) => t.response !== task.answers[t.index]).map((t) => t.index);
      expect(wrongIdx.length, String(n)).toBeLessThanOrEqual(12);
      for (const k of ANALOGY_LURES_ORDER) expect(r.lureP[k], `${n} ${k}`).toBeCloseTo(exact(r, wrongIdx, k), 3);
    }
    const copyMany = scoreAnalogy(task, all((i) => (task.optionLures[i].includes('copy') ? { response: analogyLureOption(cell(i), 'copy') } : {}))).result;
    expect(ANALOGY_LURES_ORDER.filter((k) => analogyLureStandsOut(copyMany, k))).toEqual(['copy']);
    expect(ANALOGY_LURE_P).toBe(0.0125);
  });

  it('rastgele yanlışlar nadiren bir yanılgı ya da bir değişiklik türü gibi görünür (benzetim)', () => {
    // Yanlışları seçenekler arasından rastgele seçen, her soruyu yarı olasılıkla doğru bilen 400 kişi.
    let seed = 20261027;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    let read = 0;
    let lureFlag = 0;
    let typeFlag = 0;
    for (let n = 0; n < 400; n++) {
      const r = scoreAnalogy(
        task,
        all((i) => {
          if (rnd() < 0.5) return {};
          const wrongs = [1, 2, 3, 4].filter((p) => p !== task.answers[i]);
          return { response: wrongs[Math.floor(rnd() * 3)] };
        }),
      ).result;
      if (analogyChance(r) || analogySamePosition(r)) continue;
      read++;
      if (ANALOGY_LURES_ORDER.some((k) => analogyLureStandsOut(r, k))) lureFlag++;
      if (r.types.some((x) => x.applied * 2 <= x.n && x.missP <= ANALOGY_TYPE_P)) typeFlag++;
    }
    expect(read).toBeGreaterThan(300);
    expect(lureFlag / read).toBeLessThan(0.05);
    expect(typeFlag / read).toBeLessThan(0.05);
  });

  it('aynı sıradaki seçenek: çok doğru cevap verende bakmadan seçmeye bağlanmaz', () => {
    const strong = scoreAnalogy(task, all((i) => (i >= 19 ? { response: 1 } : {}))).result;
    expect(strong.correct).toBeGreaterThan(ANALOGY_SAME_MAX_CORRECT);
    expect(analogySamePosition(strong)).toBe(false);
    const weak = scoreAnalogy(task, all((i) => (i >= 8 ? { response: 1 } : {}))).result;
    expect([weak.correct <= ANALOGY_SAME_MAX_CORRECT, weak.samePosition >= 12, analogySamePosition(weak)]).toEqual([true, true, true]);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreAnalogy(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 5, 2.5, Number.NaN]) {
      expect(() => scoreAnalogy(task, ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreAnalogy(task, [...ok, { index: 24, response: 1, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreAnalogy(task, [...ok, { index: 0, response: 1, rtMs: 1 }]).result.correct).toBe(24);
    expect(() => scoreAnalogy({ ...task, answers: [], optionLures: [] }, ok)).toThrow(TaskInputError);
    expect(() => scoreAnalogy({ ...task, optionMisses: [] }, ok)).toThrow(TaskInputError);
    const bad = analogyBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Şekil benzetmeleri: rapor', () => {
  it('hatasız: beş kart, öne çıkan sayılar, düzeylere göre grafik ve değişiklik türlerinin üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, analogyBody((q) => ({ response: q.answer, rtMs: 5000 + 3000 * q.level })));
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '24 soruda 24 doğru'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Değişiklik türleri', '3 değişiklik türünün hepsi bütün sorularda doğru uygulandı'],
      ['Yanlışlarda seçilen şekiller', 'Yanlış cevap yok'],
      ['Çalışma biçimi', 'Soru başına tipik süre 14 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '24/24'],
      ['Ulaşılan düzey', '5. düzey'],
      ['Soru başına tipik süre', '14 saniye'],
    ]);
    expect(r.student.items[0].text).toContain('Bütün soruları doğru cevapladın; en zor düzeyde üç değişikliği de doğru uygulayabildin.');
    expect(r.student.items[4].text).toContain('Değişiklikler çoğaldığında sorulara daha çok zaman ayırdın.');
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.key, b.label, b.valueLabel])).toEqual([
      ['look', 'Renk ve büyüklük', '16/16'],
      ['turn', 'Döndürme ve ayna', '15/15'],
      ['place', 'Yer ve sayı', '9/9'],
    ]);
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('durumlar: rastgele düzeyi, her yanılgı türü, çok hızlı, hep aynı yer, kolay sorularda yanılma, türler', () => {
    const none = evaluate(SLUG, analogyBody((q) => ({ response: analogyLureOption(q), rtMs: 9000 })));
    expect(none.student.items.map((i) => i.badge)).toEqual(['24 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');
    expect(none.student.roadmap!.bars).toEqual([]);

    for (const k of ANALOGY_LURES_ORDER) {
      const r = evaluate(SLUG, analogyBody((q) => ({ response: q.lures.includes(k) && q.level >= 2 ? analogyLureOption(q, k) : q.answer, rtMs: 15_000 })));
      const n = task.optionLures.filter((ls, i) => ls.includes(k) && task.items[i].level >= 2).length;
      expect(r.student.items[3].badge, k).toBe(`${ANALOGY_LURE_NAMES[k]} öne çıkıyor`);
      expect(r.student.items[3].text, k).toContain(`${n} yanlış cevabının hepsinde ${ANALOGY_LURE_SEEN[k]} seçildi. Bu, rastgele seçimde beklenenden belirgin biçimde sık.`);
      expect(r.parent.items[3].text, k).toContain('Çocuğunuz');
      expect(r.student.items[0].text, k).toContain('öne çıkan yanılgı için “Yanlışlarda seçilen şekiller” kartına bak.');
    }

    const rapid = evaluate(SLUG, analogyBody((q) => ({ response: q.level >= 3 ? analogyLureOption(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })));
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 15 sorunun hepsinde yanlış bir cevap 3 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[4].text).toContain('3. düzey ve üstündeki 15 sorunun hepsine 3 saniyeden kısa sürede yanlış cevap verdin.');
    expect([rapid.student.items[2].badge, rapid.student.items[3].badge]).toEqual(['Yorumlanmadı', 'Yorumlanmadı']);
    expect(rapid.student.items[0].text).toContain('şekillere bakmadan seçmiş olabileceğin');
    expect(rapid.student.items[1].text).toContain('1–2. düzeylerdeki soruların hepsini doğru cevapladın');
    expect(rapid.student.items[1].text).toContain('çok hızlı cevap verdiğin için 3. düzey ve üstündeki sonuç yorumlanmadı');

    const same = evaluate(SLUG, analogyBody(() => ({ response: 2, rtMs: 9000 })));
    expect(same.student.items[4].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');

    const slip = evaluate(SLUG, analogyBody((q) => ({ response: q.level === 1 && analogyRank(q) < 2 ? analogyLureOption(q, ANALOGY_LURES_ORDER[q.i % 4]) : q.answer, rtMs: 12_000 })));
    expect(slip.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(slip.student.items[0].text).toContain('dikkatinin dağılmasından');
    expect(slip.student.items[3].badge).toBe('2 yanlış');

    const drop = evaluate(SLUG, analogyBody());
    expect(drop.student.items[0].badge).toBe('24 soruda 18 doğru');
    expect(drop.student.items[1].text).toContain('1–3. düzeylerdeki soruların hepsini doğru cevapladın. 3. düzeydeki sorularda şu gerekiyordu: aynı şekilde birlikte olan iki değişikliği bulup ikisini de uygulamak.');
    expect(drop.student.items[1].text).toContain('4. düzeydeki 5 sorunun 3 tanesini doğru bulamadın.');

    // Bir türde zorlanma: döndürme ve ayna değişikliklerinin geçtiği her soruda döndürmeyi kaçıran şekil seçiliyor. Öteki
    // değişiklikler o sorularda da doğru uygulandığı için yalnızca bu tür zor görünür.
    const turn = evaluate(SLUG, analogyBody((q) => ({ response: task.items[q.i].changes.includes('turn') ? analogyMissOption(q, 'turn') : q.answer, rtMs: 12_000 })));
    expect(turn.student.items[2].badge).toBe('3 değişiklik türünün 2 tanesi, geçtiği soruların çoğunda doğru uygulandı');
    expect(turn.student.items[2].text).toContain(
      '“Renk ve büyüklük” ve “yer ve sayı” değişikliklerini geçtikleri soruların çoğunda doğru uyguladın. “Döndürme ve ayna” değişikliklerinde zorlandın: yanlış cevaplarında bu değişiklikler, seçeneklerden rastgele seçimde beklenenden belirgin biçimde daha sık kaçırılmıştı.',
    );
    expect(turn.student.items[2].text).toContain(`Bu değişikliklerde ${ANALOGY_TYPES.turn.plain} gerekir.`);
    expect(turn.student.items[2].text).toContain('her değişiklik ayrı sayıldı');
    expect(turn.parent.items[2].text).toContain('Çocuğunuz “renk ve büyüklük” ve “yer ve sayı” değişikliklerini geçtikleri soruların çoğunda doğru uyguladı');
    const turnBars = turn.student.roadmap!.bars.map((b) => b.valueLabel);
    expect(turnBars[1]).toBe('0/15');
    expect(turn.student.items[2].visual?.type === 'bars' ? turn.student.items[2].visual.rows.map((x) => x.valueLabel) : []).toEqual(turnBars);

    // Yanlışların hepsi fazladan değişiklik: gereken değişikliklerin hepsi uygulanmış; kart bunu yanlışlarla çelişmeden söyler.
    const extra = evaluate(SLUG, analogyBody((q) => ({ response: q.level >= 3 && q.lures.includes('extra') ? analogyLureOption(q, 'extra') : q.answer, rtMs: 12_000 })));
    expect(extra.student.items[2].badge).toBe('Gereken değişikliklerin hepsi uygulandı');
    expect(extra.student.items[2].text).toContain('Yanlış cevaplarında gereken değişiklikler yapılmış ama fazladan bir değişiklik de yapılmıştı (“Yanlışlarda seçilen şekiller” kartına bak).');
    expect(extra.parent.items[2].text).toContain('(“Yanlışlarda seçilen şekiller” kartına bakın).');
    expect(extra.student.items[3].badge).toBe('Fazladan değişiklik öne çıkıyor');

    // Değişmemiş şekil: bütün türler kaçırılmış sayılır ama hiçbir tür ayrıca "zor" denmez; kart bunu söyler.
    const copy = evaluate(SLUG, analogyBody((q) => ({ response: q.level >= 2 && q.lures.includes('copy') ? analogyLureOption(q, 'copy') : q.answer, rtMs: 12_000 })));
    expect(copy.student.items[2].text).not.toContain('zorlandın');
    expect(copy.student.items[2].text).toContain('Değişmemiş şekli seçtiğin sorularda hiçbir değişiklik uygulanmamış sayıldı');
    expect(copy.student.items[3].badge).toBe('Değişmemiş şekil öne çıkıyor');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: AnalogyCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkDort: (q) => q.level <= 4,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkBir: (q) => q.level <= 1,
      kolaydaYanilma: (q) => !(q.level === 1 && analogyRank(q) < 3),
      duz: (q) => analogyRank(q) % 2 === 0,
      dokuzDogru: (q) => q.i < ANALOGY_CHANCE_MAX,
      onDogru: (q) => q.i < ANALOGY_CHANCE_MAX + 1,
      zorDogru: (q) => q.level >= 3,
      birYanlis: (q) => q.i !== 7,
      donmeYanlis: (q) => !task.items[q.i].changes.includes('turn'),
    };
    const wrongKinds: Record<string, (q: AnalogyCell) => number> = {
      kopya: (q) => analogyLureOption(q, 'copy'),
      eksik: (q) => analogyLureOption(q, 'partial'),
      yanlis: (q) => analogyLureOption(q, 'wrong'),
      fazla: (q) => analogyLureOption(q, 'extra'),
      karisik: (q) => analogyLureOption(q, ANALOGY_LURES_ORDER[q.i % 4]),
    };
    const times: Record<string, (q: AnalogyCell) => number | null> = {
      artan: (q) => 4000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 6000 * q.level,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = analogyBody((q) => ({ response: samePos ? 2 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const result = scoreAnalogy(task, trialsOf(body)).result;
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const chance = analogyChance(result);
            const doubt = analogyRapid(result) || analogySamePosition(result);
            const noted = chance || doubt ? [] : ANALOGY_LURES_ORDER.filter((k) => result.luresByKind[k] >= ANALOGY_LURE_NOTE && result.lureP[k] <= ANALOGY_LURE_P);
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
              expect(
                r.items.map((i) => i.title),
                label,
              ).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              expect(r.items[0].badge, label).toBe(`24 soruda ${result.correct} doğru`);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance || doubt);
              expect(r.items[3].badge === 'Yorumlanmadı', label).toBe(chance || (doubt && result.wrong > 0));
              expect(r.roadmap!.bars.length, label).toBe(chance || doubt ? 0 : 3);
              expect(
                r.cautions.some((c) => c.includes('rastgele seçen')),
                label,
              ).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('3 saniyeden kısa'));
              expect(rapidNote, label).toBe(analogyRapid(result));
              expect(r.items[4].text.includes('3 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(analogySamePosition(result));
              expect(r.items[4].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (doubt) expect(r.items[4].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/şekillere bakmadan seçmiş/.test(r.items[0].text), label).toBe(doubt);
              const yan = r.items[3].text;
              expect(yan.includes('rastgele seçimde beklenenden belirgin biçimde sık'), label).toBe(noted.length > 0);
              for (const k of noted) {
                const many = result.luresByKind[k] === result.wrong ? 'hepsinde' : `${result.luresByKind[k]} tanesinde`;
                expect(yan, `${label} ${k}`).toContain(`${many} ${ANALOGY_LURE_SEEN[k]} seçildi`);
              }
              expect(r.items[3].badge, label).toBe(
                chance || (doubt && result.wrong > 0)
                  ? 'Yorumlanmadı'
                  : result.wrong === 0
                    ? 'Yanlış cevap yok'
                    : noted.length > 1
                      ? `${['', '', 'İki', 'Üç', 'Dört'][noted.length]} yanılgı öne çıkıyor`
                      : noted.length === 1
                        ? `${ANALOGY_LURE_NAMES[noted[0]]} öne çıkıyor`
                        : result.wrong >= ANALOGY_LURE_NOTE
                          ? 'Belirgin bir yanılgı yok'
                          : result.wrong === 1
                            ? 'Bir yanlış'
                            : `${result.wrong} yanlış`,
              );
              // Yanlışların türlere dağılımı kartın grafiğindedir (kart yorumlanıyorsa).
              if (r.items[3].badge !== 'Yorumlanmadı') {
                const parts = r.items[3].visual?.type === 'stack' ? r.items[3].visual.parts : [];
                expect(
                  parts.map((x) => x.value),
                  label,
                ).toEqual([result.correct, ...ANALOGY_LURES_ORDER.map((k) => result.luresByKind[k])]);
              } else expect(r.items[3].visual, label).toBeUndefined();
              // Değişiklik türleri: grafik yalnızca kart yorumlanıyorsa; sayılar puanlamayla aynı.
              if (r.items[2].badge !== 'Yorumlanmadı') {
                const rows = r.items[2].visual?.type === 'bars' ? r.items[2].visual.rows : [];
                expect(rows.map((x) => x.valueLabel), label).toEqual(result.types.map((x) => `${x.applied}/${x.n}`));
                const good = result.types.filter((x) => x.applied * 2 > x.n).length;
                expect(r.items[2].badge, label).toMatch(good === 3 ? / hepsi[ ,]|^Gereken değişikliklerin hepsi/ : good === 0 ? / hiçbiri,/ : new RegExp(` ${good === 1 ? 'biri' : `${good} tanesi`},`));
                // "Zorlandı" yalnızca o tür yanlışlarda rastgele seçimde beklenenden belirgin sık kaçırıldıysa.
                const flagged = result.types.filter((x) => x.applied * 2 <= x.n && x.missP <= ANALOGY_TYPE_P).length;
                expect(/zorlandın?:/.test(r.items[2].text), label).toBe(flagged > 0);
                if (result.types.every((x) => x.applied === x.n)) {
                  expect(r.items[2].badge, label).toBe(result.wrong === 0 ? '3 değişiklik türünün hepsi bütün sorularda doğru uygulandı' : 'Gereken değişikliklerin hepsi uygulandı');
                }
                expect(r.items[2].text.includes('her değişiklik ayrı sayıldı'), label).toBe(result.wrong > 0);
                expect(r.items[2].text.includes('türler arasındaki küçük farklar'), label).toBe(result.wrong > 0 && good < 3);
              } else expect(r.items[2].visual, label).toBeUndefined();
              expect(r.items[0].text.includes('Yanlışlarda seçilen şekiller” kartına'), label).toBe(noted.length > 0);
              if (noted.length || doubt) expect(r.items[0].text + r.items[1].text, label).not.toMatch(/dağılmasından/);
              if (doubt) expect(r.items[0].text, label).not.toContain('beklenen bir durumdur');
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge], label).toEqual(['Belirtilmedi', 'Düzey belirtilmedi']);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(result.levels.map((l) => `${l.correct}/${l.n}`));
              // Dikkat ya da acele açıklaması en çok bir kartta.
              expect([r.items[0].text, r.items[1].text].filter((x) => x.includes('dağılmasından')).length, label).toBeLessThanOrEqual(1);
              if (analogyRapid(result)) expect(r.items[1].text, label).not.toMatch(/[345]\. düzeyde soruların (çoğunda zorlandı|hiçbirini)/);
              if (r.items[4].text.includes('yakın süreler')) {
                const ratio = result.rtHard! / result.rtEasy!;
                expect(ratio > 1 / 1.2 && ratio < 1.2, `${label} ${ratio}`).toBe(true);
              }
              if (result.correct === result.n) expect(r.items[0].text, label).toMatch(/[Bb]ütün soruları doğru cevapladı/);
              if (doubt && !chance) expect(/Çalışma biçimi kartında|çok hızlı cevap/.test(r.items[1].text), label).toBe(true);
              if (chance) expect(r.items[4].text, label).not.toMatch(/zaman ayır|yakın süreler|iyi bir çalışma biçimi/);
              expect(r.items[1].text, label).not.toMatch(/\bBu(,)? (testin )?en zor düzey/);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(
              /\b(buldun|verdin|cevapladın|zorlandın|seçtin|bulamadın|cevaplamadın|ayırdın|olabilirsin|olabileceğin|uygulayabildin|uyguladın|seçmedin|ettin|bulduğun)\b|bak\./,
            );
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(13 * 5 * 4 * 2);
  }, 600_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, analogyBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, analogyBody(undefined, 3)).student.items).toHaveLength(5);
    const r = evaluateReports(SLUG, analogyBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([sekilBenzetmeleri.intro.title, ...sekilBenzetmeleri.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
    for (const slug of TASK_ROADMAPS[SLUG].nextTests) {
      const d = solvableInstruments().find((x) => x.slug === slug)!;
      expect([d.minGrade <= 3, d.adults], slug).toEqual([true, true]);
    }
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /SB_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(SLUG, analogyBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 8000 + 500 * q.i }), 4));
    expect(r.student.items[0].badge).toBe('24 soruda 24 doğru');
    expect(r.student.items[3].badge).toBe('Yanlış cevap yok');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(5);
    expect(r.parent.roadmap!.bars).toHaveLength(3);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/sb_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"optionLures\\":\[\][\s\S]*\\"optionMisses\\":\[\]/);
    expect(yml).toContain("grep -q 'Şekillerle benzetme kur'");
    expect(sekilBenzetmeleri.intro.title).toBe('Şekillerle benzetme kur');
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, analogyBody());
    const adult = evaluateAdult(SLUG, { ...analogyBody(), grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı ve metinde anılıyor', () => {
    expect(sekilBenzetmeleri.status).toBe('pilot');
    expect(publicInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(sekilBenzetmeleri.name).not.toMatch(/tanı/i);
    const sc = sekilBenzetmeleri.science;
    expect(JSON.stringify(sc)).not.toMatch(/TASLAK|YAZILACAK/);
    expect(sc.citations.length).toBeGreaterThan(5);
    expect(sc.citations.every((c) => c.url?.startsWith('https://'))).toBe(true);
    const body = JSON.stringify({ ...sc, citations: [] });
    for (const c of sc.citations) expect(body, c.text).toContain(c.text.split(',')[0].replace(/\.$/, ''));
    expect(sc.ageNote).toContain('yetişkinler de çözebilir');
    expect(sc.limitations.join(' ')).toContain('Zekâ puanı (IQ) vermez ve tanı koymaz');
    const rm = TASK_ROADMAPS[SLUG];
    for (const x of rm.sources) expect(sc.citations.some((c) => c.text === x.text), x.text).toBe(true);
  });
});
