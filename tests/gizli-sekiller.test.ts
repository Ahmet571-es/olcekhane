import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { HIDDEN_PRACTICE_SPECS, HIDDEN_SPECS, gizliSekiller } from '@/content/instruments/gizli-sekiller';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { HIDDEN_EXAMPLE_AT, HIDDEN_EXAMPLE_FIGURE, HIDDEN_EXAMPLE_TARGET, type HiddenLure } from '@/lib/instruments/hidden';
import type { HiddenFiguresTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { HIDDEN_LURE_SEEN } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  HIDDEN_CHANCE_MAX,
  HIDDEN_LURE_NOTE,
  HIDDEN_LURE_P,
  HIDDEN_LURES_ORDER,
  HIDDEN_RAPID_MS,
  HIDDEN_SAME_MAX_CORRECT,
  TaskInputError,
  hiddenChance,
  hiddenLureStandsOut,
  hiddenRapid,
  hiddenSamePosition,
  scoreHidden,
  type HiddenResult,
  type HiddenTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { hiddenBody, hiddenLureOption, hiddenRank, type HiddenCell } from './helpers/bodies';
import {
  type Seg,
  bestMissing,
  box,
  connected,
  continued,
  cornerMoves,
  distinctTurns,
  double,
  found,
  length,
  nearly,
  oneCornerApart,
  readSegs,
  shapeDistance,
  sameShape,
  touching,
  turn,
} from './helpers/hidden-check';
import { schoolWords } from './helpers/school';

const SLUG = 'gizli-sekiller';
const task = gizliSekiller.tasks[0] as HiddenFiguresTask;
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Yanlışlarda seçilen şekiller', 'Çalışma biçimi'];
const GRID = 6;

/** Soruların ve alıştırmaların içerik dosyasındaki metinlerinden (testin kendi okuyucusuyla) okunmuş hâli. */
const ALL = [...HIDDEN_SPECS, ...HIDDEN_PRACTICE_SPECS].map((s) => ({
  key: s.key,
  level: s.level,
  target: readSegs(s.target),
  options: s.options.map(readSegs),
  lures: s.lures,
}));

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof hiddenBody>) => (body.data as unknown as { blocks: Record<string, HiddenTrialInput[]> }).blocks[task.key];

describe('Gizli şekiller: sorular', () => {
  it('20 soru, 4 düzey (her birinde 5), kolaydan zora; 2 alıştırma; her soruda dört çizim', () => {
    expect(task.items).toHaveLength(20);
    expect(task.practice).toHaveLength(2);
    expect(task.items.map((i) => i.level)).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4]);
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4]);
    for (const it of [...task.items, ...task.practice]) expect(it.options, it.key).toHaveLength(4);
    expect(task.grid).toBe(GRID);
    // İçerik dosyasındaki metinler testin kendi okuyucusuyla aynı çizgileri verir.
    for (const [i, it] of task.items.entries()) {
      expect(it.target.map((s) => [...s]), it.key).toEqual(ALL[i].target);
      expect(it.options.map((o) => o.map((s) => [...s])), it.key).toEqual(ALL[i].options);
    }
  });

  it('bütün çizgiler ızgarada, yatay, dikey ya da 45° çapraz; çizimler tek parça; dört seçeneğin çizgi miktarı yakın', () => {
    for (const q of ALL) {
      for (const s of [...q.target, ...q.options.flat()]) {
        expect(s.every((v) => v >= 0 && v <= GRID), `${q.key} ${s}`).toBe(true);
        const dx = Math.abs(s[2] - s[0]);
        const dy = Math.abs(s[3] - s[1]);
        expect(dx + dy > 0 && (dx === 0 || dy === 0 || dx === dy), `${q.key} ${s}`).toBe(true);
      }
      for (const [o, fig] of q.options.entries()) expect(connected(fig), `${q.key} ${o}`).toBe(true);
      const sizes = q.options.map((f) => length(f).all);
      expect(Math.max(...sizes) - Math.min(...sizes), `${q.key} ${sizes}`).toBeLessThanOrEqual(4);
      // Çizimler ızgaranın neredeyse tamamına yayılır.
      for (const fig of q.options) {
        const b = box(fig);
        expect(b.x1 - b.x0 >= GRID - 1 && b.y1 - b.y0 >= GRID - 1, q.key).toBe(true);
      }
    }
  });

  it('aranan şekiller: hiçbiri döndürülünce ya da aynalanınca kendisiyle örtüşmez; testteki 22 şeklin hepsi birbirinden farklı', () => {
    for (const q of ALL) expect(distinctTurns(q.target), q.key).toBe(8);
    for (let i = 0; i < ALL.length; i++) {
      for (let j = i + 1; j < ALL.length; j++) {
        for (let g = 0; g < 8; g++) expect(sameShape(ALL[i].target, turn(ALL[j].target, g)), `${ALL[i].key}–${ALL[j].key} ${g}`).toBe(false);
      }
    }
    // Yönergedeki örnek şekil de testteki şekillerden farklıdır; örnek çizimde tam bir yerde (gösterilen yerde) saklıdır.
    const example = HIDDEN_EXAMPLE_TARGET.map((s) => [...s] as Seg);
    expect(found(HIDDEN_EXAMPLE_FIGURE.map((s) => [...s] as Seg), example)).toEqual([[...HIDDEN_EXAMPLE_AT]]);
    for (const q of ALL) for (let g = 0; g < 8; g++) expect(sameShape(example, turn(q.target, g)), q.key).toBe(false);
    // Hiçbir şekil, başka bir şeklin (herhangi bir yönüyle) bir köşesi farklı benzeri değildir: bir soruda yanlış
    // seçenekte görülen benzer, başka bir soruda aranan şekil olamaz.
    for (let i = 0; i < ALL.length; i++) {
      expect(oneCornerApart(example, ALL[i].target), `örnek–${ALL[i].key}`).toBe(false);
      for (let j = i + 1; j < ALL.length; j++) expect(oneCornerApart(ALL[i].target, ALL[j].target), `${ALL[i].key}–${ALL[j].key}`).toBe(false);
    }
    // Asıl sorulardaki şekiller birbirinden, alıştırmalardaki şekillerden ve örnekten belirgin biçimde farklıdır: hangi yöne
    // çevrilip nereye kaydırılırsa kaydırılsın en az 4 birim adım farklı (alıştırmalar ve örnek kendi aralarında öğretmek
    // için benzer olabilir).
    const scored = ALL.filter((q) => !q.key.startsWith('gsp'));
    const others = [...ALL.filter((q) => q.key.startsWith('gsp')).map((q) => ({ key: q.key, target: q.target })), { key: 'örnek', target: example }];
    for (let i = 0; i < scored.length; i++) {
      for (let j = i + 1; j < scored.length; j++) expect(shapeDistance(scored[i].target, scored[j].target), `${scored[i].key}–${scored[j].key}`).toBeGreaterThanOrEqual(4);
      for (const o of others) expect(shapeDistance(scored[i].target, o.target), `${scored[i].key}–${o.key}`).toBeGreaterThanOrEqual(4);
    }
  });

  it('bir sorunun yanlış seçeneğinde, sonra gelen bir sorunun (alıştırmalar önce) aranan şekli yok', () => {
    const order = [...ALL.filter((q) => q.key.startsWith('gsp')), ...ALL.filter((q) => !q.key.startsWith('gsp'))];
    for (let i = 0; i < order.length; i++)
      for (let j = i + 1; j < order.length; j++)
        for (const [o, fig] of order[i].options.entries()) {
          if (order[i].lures[o] === null) continue;
          expect(found(fig, order[j].target).length, `${order[i].key} ${'ABCD'[o]} → ${order[j].key}`).toBe(0);
        }
  });

  it('tek doğru cevap: şekil yalnızca doğru seçenekte ve orada tam bir yerde var; hiçbir seçenekte iki kat büyüğü yok', () => {
    for (const q of ALL) {
      const right = q.lures.indexOf(null);
      expect(q.lures.filter((l) => l === null), q.key).toHaveLength(1);
      for (const [o, fig] of q.options.entries()) {
        expect(found(fig, q.target).length, `${q.key} ${'ABCD'[o]}`).toBe(o === right ? 1 : 0);
        expect(found(fig, double(q.target)).length, `${q.key} ${'ABCD'[o]} 2×`).toBe(0);
      }
    }
  });

  it('yanlış seçeneklerin türü doğrulanır: döndürülmüş biçim tam bir yerde var; köşesi farklı seçenekte şekle çok benzeyen ama eksiği olan bir yer var', () => {
    for (const q of ALL) {
      const turns = (fig: Seg[]) => [1, 2, 3, 4, 5, 6, 7].filter((g) => found(fig, turn(q.target, g)).length > 0);
      const units = length(q.target).all;
      for (const [o, fig] of q.options.entries()) {
        const label = `${q.key} ${'ABCD'[o]} ${q.lures[o]}`;
        if (q.lures[o] === null) {
          // Doğru seçenekte şeklin döndürülmüş biçimleri ve bir adımı eksik benzeri yok.
          expect(turns(fig), label).toEqual([]);
          expect(nearly(fig, q.target), label).toBe(0);
        } else if (q.lures[o] === 'turned') {
          expect(turns(fig), label).toHaveLength(1);
          expect([1, 2, 3, 4, 5, 6, 7].map((g) => found(fig, turn(q.target, g)).length).reduce((a, b) => a + b), label).toBe(1);
          expect(nearly(fig, q.target), label).toBe(0);
        } else {
          expect(turns(fig), label).toEqual([]);
          // Şekle en çok benzeyen yerde en az bir, en çok dört birim adım eksik (bir köşe bir birim kaymış).
          const best = bestMissing(fig, q.target);
          expect(best >= 1 && best <= 4, `${label} eksik ${best}/${units}`).toBe(true);
        }
      }
    }
  });

  it('köşesi farklı benzerler: her "köşesi farklı" seçenekte şeklin bir köşesi bir birim kaydırılmış, aynı büyüklükte bir benzeri tam bir yerde var; döndürülmüş seçeneklerde hiçbiri yok', () => {
    for (const q of ALL) {
      const b = box(q.target);
      const moves = cornerMoves(q.target);
      const sameSize = moves.filter((m) => {
        const c = box(m);
        return c.x1 - c.x0 === b.x1 - b.x0 && c.y1 - c.y0 === b.y1 - b.y0;
      });
      expect(sameSize.length, q.key).toBeGreaterThanOrEqual(2);
      for (const [o, fig] of q.options.entries()) {
        const label = `${q.key} ${'ABCD'[o]} ${q.lures[o]}`;
        if (q.lures[o] === 'changed') expect(sameSize.some((m) => found(fig, m).length > 0), label).toBe(true);
        if (q.lures[o] === 'turned') expect(moves.filter((m) => found(fig, m).length > 0), label).toEqual([]);
        // Doğru seçenekte aynı büyüklükte bir benzer yok (başka büyüklükte olanlar, şekil zaten orada olduğu için zararsız).
        if (q.lures[o] === null) expect(sameSize.filter((m) => found(fig, m).length > 0), label).toEqual([]);
      }
    }
  });

  it('1. düzeyde yanılgılar yumuşak: hiçbir seçenekte şeklin yalnızca bir birim adımı eksik bir benzeri yok', () => {
    for (const q of ALL.filter((x) => x.level === 1 && !x.key.startsWith('gsp')))
      for (const [o, fig] of q.options.entries()) expect(nearly(fig, q.target), `${q.key} ${'ABCD'[o]} ${q.lures[o]}`).toBe(0);
    // Daha zor düzeylerde köşesi farklı benzerlerin bir kısmı şekle bir adım kadar yakındır.
    for (const lv of [2, 3, 4]) {
      const near = ALL.filter((x) => x.level === lv).flatMap((q) => q.options.filter((fig, o) => q.lures[o] === 'changed' && nearly(fig, q.target) > 0));
      expect(near.length, `düzey ${lv}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('her soruda iki yanılgı türü de var; 20 soruda her türden 30 yanlış seçenek; doğru seçeneklerin yeri dengeli ve art arda aynı değil', () => {
    for (const ls of task.optionLures) {
      expect(ls.filter((l) => l === 'turned').length >= 1 && ls.filter((l) => l === 'changed').length >= 1).toBe(true);
    }
    expect(task.optionLures.flat().filter((l) => l === 'turned')).toHaveLength(30);
    expect(task.optionLures.flat().filter((l) => l === 'changed')).toHaveLength(30);
    expect([1, 2, 3, 4].map((o) => task.answers.filter((a) => a === o).length)).toEqual([5, 5, 5, 5]);
    expect(task.answers.every((a, i) => i === 0 || a !== task.answers[i - 1])).toBe(true);
    expect(task.answers).toEqual(HIDDEN_SPECS.map((s) => s.lures.indexOf(null) + 1));
    expect(task.optionLures.every((ls, i) => ls[task.answers[i] - 1] === null)).toBe(true);
    for (const p of task.practice) {
      expect(p.answer).toBe(HIDDEN_PRACTICE_SPECS.find((s) => s.key === p.key)!.lures.indexOf(null) + 1);
      expect(p.explain.length, p.key).toBeGreaterThan(80);
    }
  });

  it('alıştırmadaki vurgular: doğru seçenekte aranan şekil, ötekilerde onun döndürülmüş biçimi ya da köşesi farklı benzeri; açıklama seçeneklerle uyumlu', () => {
    for (const p of task.practice) {
      const spec = ALL.find((q) => q.key === p.key)!;
      for (const [o, mark] of p.marks.entries()) {
        const m = mark.map((s) => [...s] as Seg);
        const fig = spec.options[o];
        const b = box(m);
        // Vurgu çizimin içinde, çizimin çizgileri üzerinde.
        expect(found(fig, m), `${p.key} ${o}`).toContainEqual([b.x0, b.y0]);
        const kind = spec.lures[o];
        if (kind === null) expect(sameShape(m, spec.target), `${p.key} ${o}`).toBe(true);
        else if (kind === 'turned') expect([1, 2, 3, 4, 5, 6, 7].some((g) => sameShape(m, turn(spec.target, g))), `${p.key} ${o}`).toBe(true);
        else expect(distinctTurns(m) > 0 && [0, 1, 2, 3, 4, 5, 6, 7].every((g) => !sameShape(m, turn(spec.target, g))), `${p.key} ${o}`).toBe(true);
      }
      // Açıklamada doğru seçenek ve her yanlış seçeneğin türü harfiyle anılır.
      const letter = 'ABCD'[p.answer - 1];
      expect(p.explain).toContain(`Şekil ${letter}’`);
    }
    const [p1, p2] = task.practice;
    expect(p1.explain).toMatch(/A’da şeklin baş aşağı çevrilmiş, C’de ayna görüntüsü gibi ters çevrilmiş biçimi var; D’deki şeklin bir köşesi farklı/);
    expect(ALL.find((q) => q.key === 'gsp1')!.lures).toEqual(['turned', null, 'turned', 'changed']);
    expect(p2.explain).toMatch(/A’daki ve B’deki şekillerin birer köşesi farklı; D’de şeklin döndürülmüş ve ters çevrilmiş biçimi var/);
    expect(ALL.find((q) => q.key === 'gsp2')!.lures).toEqual(['changed', 'changed', null, 'turned']);
    // gsp1'de A yarım tur (baş aşağı), C ayna görüntüsü; gsp2'de D döndürülmüş ve aynalanmış biçim.
    const g1 = ALL.find((q) => q.key === 'gsp1')!;
    expect(found(g1.options[0], turn(g1.target, 2)).length).toBe(1);
    expect(found(g1.options[2], turn(g1.target, 4)).length).toBe(1);
  });

  it('düzeyler: çizimdeki çizgi miktarı, şeklin devam eden kenarları ve şekle değen yabancı çizgiler düzeyle artar', () => {
    const per = [1, 2, 3, 4].map((lv) => {
      const qs = ALL.filter((q) => q.level === lv && !q.key.startsWith('gsp'));
      const sizes = qs.map((q) => length(q.options[q.lures.indexOf(null)]).all);
      const touch = qs.map((q) => {
        const fig = q.options[q.lures.indexOf(null)];
        const at = found(fig, q.target)[0];
        return touching(fig, q.target, at) / length(q.target).all;
      });
      const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
      // Kenarlarının çizimde aynı doğrultuda devam etmesi, şekli en çok gizleyen özelliktir (de-Wit ve ark., 2017).
      const cont = qs.map((q) => {
        const fig = q.options[q.lures.indexOf(null)];
        return continued(fig, q.target, found(fig, q.target)[0]) / q.target.length;
      });
      return { size: mean(sizes), touch: mean(touch), cont: mean(cont), minSize: Math.min(...sizes), maxSize: Math.max(...sizes) };
    });
    for (let i = 1; i < 4; i++) {
      expect(per[i].cont, `düzey ${i + 1} devam eden kenarlar`).toBeGreaterThan(per[i - 1].cont);
      expect(per[i].size, `düzey ${i + 1}`).toBeGreaterThan(per[i - 1].size);
      expect(per[i].touch, `düzey ${i + 1}`).toBeGreaterThan(per[i - 1].touch);
      expect(per[i].minSize, `düzey ${i + 1}`).toBeGreaterThanOrEqual(per[i - 1].maxSize - 2);
    }
  });

  it('doğru seçenek kestirme yollarla bulunamaz: en çok ya da en az çizgi, en çok çapraz, öteki seçeneklere benzerlik', () => {
    const picks: Record<string, (q: (typeof ALL)[number]) => number> = {
      enCok: (q) => argmax(q.options.map((f) => length(f).all)),
      enAz: (q) => argmax(q.options.map((f) => -length(f).all)),
      enCokCapraz: (q) => argmax(q.options.map((f) => length(f).diag)),
      enAzCapraz: (q) => argmax(q.options.map((f) => -length(f).diag)),
      enCokParca: (q) => argmax(q.options.map((f) => f.length)),
      // Şekle en çok benzeyen yer (en az eksik) en iyi olan seçenek: doğru seçeneği değil, şeklin varlığını arar; yine de
      // döndürülmüş ve köşesi farklı seçenekler yüzünden tek başına yetmez (eşitlikte ilk seçenek).
      enAzEksikDondurulmus: (q) => argmax(q.options.map((f) => -Math.min(...[1, 2, 3, 4, 5, 6, 7].map((g) => bestMissing(f, turn(q.target, g)))))),
    };
    const items = ALL.filter((q) => !q.key.startsWith('gsp'));
    for (const [name, pick] of Object.entries(picks)) {
      const hits = items.filter((q) => pick(q) === q.lures.indexOf(null)).length;
      expect(hits, name).toBeLessThanOrEqual(8);
    }
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, lures: task.optionLures, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: gizliSekiller.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
  });
});

function argmax(xs: number[]): number {
  let best = 0;
  for (let i = 1; i < xs.length; i++) if (xs[i] > xs[best]) best = i;
  return best;
}

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '7763a73f6f6b3734';

describe('Gizli şekiller: puanlama', () => {
  const all = (fn: (i: number) => Partial<HiddenTrialInput> = () => ({})): HiddenTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 12_000, ...fn(index) }));
  const cell = (i: number): HiddenCell => ({ level: task.items[i].level, answer: task.answers[i], lures: task.optionLures[i], i });

  it('hatasız: 20 doğru, bütün düzeyler tam', () => {
    const { result } = scoreHidden(task, all());
    expect([result.correct, result.reached, result.wrong, result.rapid, result.rapidOf, result.samePosition]).toEqual([20, 4, 0, 0, 10, 5]);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['5/5', '5/5', '5/5', '5/5']);
    expect(result.offeredByKind).toEqual({ turned: 30, changed: 30 });
    expect(result.medianRtCorrect).toBe(12_000);
  });

  it('yanılgı türleri, çok hızlı yanlış ve hep aynı yer ayrı ayrı sayılır', () => {
    const tr = scoreHidden(
      task,
      all((i) => (task.items[i].level >= 3 ? { response: hiddenLureOption(cell(i), 'turned') } : {})),
    ).result;
    expect([tr.wrong, tr.luresByKind.turned, tr.luresByKind.changed, tr.reached]).toEqual([10, 10, 0, 2]);
    const ch = scoreHidden(
      task,
      all((i) => (i % 2 ? { response: hiddenLureOption(cell(i), 'changed') } : {})),
    ).result;
    expect([ch.wrong, ch.luresByKind.changed, ch.luresByKind.turned]).toEqual([10, 10, 0]);
    const rapid = scoreHidden(
      task,
      all((i) => ({ rtMs: HIDDEN_RAPID_MS - 1, response: hiddenLureOption(cell(i)) })),
    ).result;
    expect([rapid.rapid, rapid.rapidOf, hiddenRapid(rapid)]).toEqual([10, 10, true]);
    expect(scoreHidden(task, all(() => ({ rtMs: HIDDEN_RAPID_MS - 1 }))).result.rapid).toBe(0);
    const same = scoreHidden(task, all(() => ({ response: 3 }))).result;
    expect([same.samePosition, hiddenSamePosition(same)]).toEqual([20, true]);
    expect(HIDDEN_CHANCE_MAX).toBe(8);
    expect(HIDDEN_LURE_NOTE).toBe(3);
    // Doğru cevaplardaki tipik süre yalnızca doğru cevaplardan hesaplanır.
    const mixed = scoreHidden(task, all((i) => (i < 10 ? { rtMs: 5000 } : { response: hiddenLureOption(cell(i)), rtMs: 30_000 }))).result;
    expect([mixed.medianRtCorrect, mixed.medianRt]).toEqual([5000, 17_500]);
  });

  it('yanılgının beklenenden sık olup olmadığı: olasılık, yanlışlardaki seçeneklerin bütün birleşimleri sayılarak doğrulanır', () => {
    const exact = (r: HiddenResult, wrongIdx: number[], k: HiddenLure) => {
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
    const patterns: ((i: number) => Partial<HiddenTrialInput>)[] = [
      (i) => (task.items[i].level >= 3 ? { response: hiddenLureOption(cell(i), 'turned') } : {}),
      (i) => (i % 2 ? { response: hiddenLureOption(cell(i), HIDDEN_LURES_ORDER[i % 4 === 1 ? 0 : 1]) } : {}),
      (i) => (i >= 12 ? { response: hiddenLureOption(cell(i), 'changed') } : {}),
      (i) => (i % 3 === 0 ? { response: hiddenLureOption(cell(i), 'turned') } : {}),
    ];
    for (const [n, fn] of patterns.entries()) {
      const trials = all(fn);
      const r = scoreHidden(task, trials).result;
      const wrongIdx = trials.filter((t) => t.response !== task.answers[t.index]).map((t) => t.index);
      expect(wrongIdx.length, String(n)).toBeLessThanOrEqual(10);
      for (const k of HIDDEN_LURES_ORDER) expect(r.lureP[k], `${n} ${k}`).toBeCloseTo(exact(r, wrongIdx, k), 3);
    }
    const mixed = scoreHidden(
      task,
      all((i) => (i % 2 ? { response: hiddenLureOption(cell(i), HIDDEN_LURES_ORDER[i % 4 === 1 ? 0 : 1]) } : {})),
    ).result;
    expect(HIDDEN_LURES_ORDER.filter((k) => hiddenLureStandsOut(mixed, k))).toEqual([]);
    const oneKind = scoreHidden(
      task,
      all((i) => (task.items[i].level >= 2 ? { response: hiddenLureOption(cell(i), 'turned') } : {})),
    ).result;
    expect(HIDDEN_LURES_ORDER.filter((k) => hiddenLureStandsOut(oneKind, k))).toEqual(['turned']);
    expect(HIDDEN_LURE_P).toBe(0.05);
  });

  it('aynı sıradaki seçenek: çok doğru cevap verende bakmadan seçmeye bağlanmaz', () => {
    const strong = scoreHidden(task, all((i) => (i >= 15 ? { response: 1 } : {}))).result;
    expect(strong.correct).toBeGreaterThan(HIDDEN_SAME_MAX_CORRECT);
    expect(hiddenSamePosition(strong)).toBe(false);
    const weak = scoreHidden(task, all((i) => (i >= 8 ? { response: 1 } : {}))).result;
    expect([weak.correct <= HIDDEN_SAME_MAX_CORRECT, weak.samePosition >= 10, hiddenSamePosition(weak)]).toEqual([true, true, true]);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreHidden(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 5, 2.5, Number.NaN]) {
      expect(() => scoreHidden(task, ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t))), String(bad)).toThrow(TaskInputError);
    }
    expect(() => scoreHidden(task, [...ok, { index: 20, response: 1, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreHidden(task, [...ok, { index: 0, response: 1, rtMs: 1 }]).result.correct).toBe(20);
    expect(() => scoreHidden({ ...task, answers: [], optionLures: [] }, ok)).toThrow(TaskInputError);
    const bad = hiddenBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Gizli şekiller: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar ve düzeylere göre grafik; üç boyutlu grafik yok', () => {
    const r = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: q.answer, rtMs: 6000 + 4000 * q.level })),
    );
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '20 soruda 20 doğru'],
      ['Ulaşılan düzey', '4. düzey'],
      ['Yanlışlarda seçilen şekiller', 'Yanlış cevap yok'],
      ['Çalışma biçimi', 'Soru başına tipik süre 16 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '20/20'],
      ['Ulaşılan düzey', '4. düzey'],
      ['Soru başına tipik süre', '16 saniye'],
    ]);
    // Sayılar kartın grafiğindedir; bütün sorular doğruyken "doğru bulduğun sorulardaki süre" ayrıca söylenmez.
    const paceRows = r.student.items[3].visual?.type === 'bars' ? r.student.items[3].visual.rows : [];
    expect(paceRows.map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['Bütün sorular 16 sn', 'Kolay sorular (1–2. düzey) 12 sn', 'Zor sorular (3–4. düzey) 20 sn']);
    expect(r.student.items[3].text).not.toContain('Doğru bulduğun sorularda');
    expect(r.student.items[3].text).toContain('Şekiller iyi saklandığında aramaya daha çok zaman ayırdın.');
    const rm = r.student.roadmap!;
    expect(rm.bars).toEqual([]);
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('durumlar: rastgele düzeyi, iki yanılgı türü, çok hızlı, hep aynı yer, kolay sorularda yanılma', () => {
    const none = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: hiddenLureOption(q), rtMs: 9000 })),
    );
    expect(none.student.items.map((i) => i.badge)).toEqual(['20 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');

    const tr = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: q.level >= 3 ? hiddenLureOption(q, 'turned') : q.answer, rtMs: 15_000 })),
    );
    const trText = tr.student.items[2].text;
    expect(tr.student.items[2].badge).toBe('Döndürülmüş biçimler öne çıkıyor');
    expect(trText).toContain(`10 yanlış cevabının hepsinde ${HIDDEN_LURE_SEEN.turned} seçildi. Bu, rastgele seçimle açıklanamayacak kadar sık.`);
    expect(trText).toContain('eğik kenarlarının ve köşelerinin üstteki şekildekilerle aynı yöne bakıp bakmadığını denetlemek');
    expect(tr.parent.items[2].text).toContain('Çocuğunuzun, bulduğu şeklin eğik kenarlarının');
    expect(tr.parent.items[2].text).toContain('Çocuğunuzun');
    expect(tr.student.items[0].text).toContain('öne çıkan yanılgı için “Yanlışlarda seçilen şekiller” kartına bak.');
    expect(tr.parent.items[0].text).toContain('kartına bakın.');

    const ch = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: q.level >= 3 ? hiddenLureOption(q, 'changed') : q.answer, rtMs: 15_000 })),
    );
    expect(ch.student.items[2].badge).toBe('Köşesi farklı benzerler öne çıkıyor');
    expect(ch.student.items[2].text).toContain(`10 yanlış cevabının hepsinde ${HIDDEN_LURE_SEEN.changed} seçildi.`);
    expect(ch.student.items[2].text).toContain('her kenarını ve köşesini üstteki şekille tek tek karşılaştırmak');
    expect(ch.parent.items[2].text).toContain('Çocuğunuzun, bulduğu yerde şeklin her kenarını');

    const rapid = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: q.level >= 3 ? hiddenLureOption(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })),
    );
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 10 sorunun hepsinde yanlış bir cevap 3 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[3].text).toContain('3. düzey ve üstündeki 10 sorunun hepsine 3 saniyeden kısa sürede yanlış cevap verdin.');
    expect(rapid.student.items[2].badge).toBe('Yorumlanmadı');
    expect(rapid.student.items[0].text).toContain('çizimlere bakmadan seçmiş olabileceğin');
    // Çok hızlı yanlışlar 3. düzey ve üstünde: ulaşılan düzey kartı bu düzeyler için hüküm vermez.
    expect(rapid.student.items[1].text).toContain('1–2. düzeylerdeki soruların hepsini doğru cevapladın');
    expect(rapid.student.items[1].text).toContain('çok hızlı cevap verdiğin için 3. düzey ve üstündeki sonuç yorumlanmadı');
    expect(rapid.student.items[1].text).not.toContain('zorlandın');
    expect(rapid.student.items[3].text).not.toContain('Doğru bulduğun sorularda');

    const same = evaluate(SLUG, hiddenBody(() => ({ response: 2, rtMs: 9000 })));
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');
    expect(same.student.items[3].text).not.toContain('Doğru bulduğun sorularda');

    // Kolay düzeylerin hepsi yanlış, zor düzeylerin hepsi doğru: ulaşılan düzey kartı bunu çelişkisiz anlatır.
    const tersine = evaluate(SLUG, hiddenBody((q) => ({ response: q.level >= 3 ? q.answer : hiddenLureOption(q, HIDDEN_LURES_ORDER[q.i % 2]), rtMs: 12_000 })));
    expect(tersine.student.items[1].text).toContain('3. ve 4. düzeydeki soruların hepsini doğru bulmana rağmen, kolay düzeylerdeki yanlışlar yüzünden bu ölçüte ulaşılmadı.');
    expect(tersine.parent.items[1].text).toContain('Çocuğunuz 3. ve 4. düzeydeki soruların hepsini doğru bulmasına rağmen');
    // Açıklama (dikkat ya da acele) yalnızca bir kartta.
    expect([tersine.student.items[0].text, tersine.student.items[1].text].filter((t) => t.includes('dağılmasından'))).toHaveLength(1);

    // Rastgele seçim düzeyinde ve yanlışların çoğu döndürülmüş biçim: yönergenin farklı anlaşılmış olabileceği söylenir.
    expect(none.student.items[0].text).toContain('daha doğru bir sonuç verebilir');
    const turnedAll = evaluate(SLUG, hiddenBody((q) => ({ response: hiddenLureOption(q, 'turned'), rtMs: 9000 })));
    expect(turnedAll.student.items[0].text).toContain('Yanlış cevaplarının çoğunda aranan şeklin döndürülmüş ya da ters çevrilmiş biçimini seçtin. Yönergeyi farklı anlamış olabilirsin');
    expect(turnedAll.parent.items[0].text).toContain('Çocuğunuz yanlış cevaplarının çoğunda aranan şeklin döndürülmüş');
    expect(turnedAll.student.cautions.join(' ')).toContain('Yönerge farklı anlaşılmış olabilir');
    const changedAll = evaluate(SLUG, hiddenBody((q) => ({ response: hiddenLureOption(q, 'changed'), rtMs: 9000 })));
    expect(changedAll.student.items[0].text).not.toContain('Yönergeyi farklı');

    const slip = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: q.level === 1 && hiddenRank(q) < 2 ? hiddenLureOption(q) : q.answer, rtMs: 12_000 })),
    );
    expect(slip.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(slip.student.items[0].text).toContain('dikkatinin dağılmasından');
    expect(slip.student.items[2].badge).toBe('2 yanlış');
    expect(slip.student.items[1].text).toContain('1–4. düzeylerdeki soruların çoğunu doğru cevapladın');

    const drop = evaluate(SLUG, hiddenBody());
    expect(drop.student.items[0].badge).toBe('20 soruda 17 doğru');
    expect(drop.student.items[1].text).toContain('1–3. düzeylerdeki soruların hepsini doğru cevapladın. 3. düzeydeki sorularda şu gerekiyordu: kenarları başka şekillerin');
    expect(drop.student.items[1].text).toContain('4. düzeydeki 5 sorunun 3 tanesini doğru bulamadın. Bu düzeydeki sorularda şu gerekiyordu: kalabalık bir çizimde');

    // Sayılar abartılmaz ya da küçültülmez.
    const all = evaluate(SLUG, hiddenBody((q) => ({ response: q.answer, rtMs: 9000 })));
    expect(all.student.items[0].text).toContain('Bütün soruları doğru cevapladın');
    expect(all.student.items[1].text).toContain('1–4. düzeylerdeki soruların hepsini doğru cevapladın');
    expect(all.student.items[1].text).toContain('4. düzey testin en zor düzeyiydi.');
    // Her düzeyde bir yanlış: iki kart aynı sözle anlatır.
    const birer = evaluate(SLUG, hiddenBody((q) => ({ response: hiddenRank(q) === 0 ? hiddenLureOption(q, HIDDEN_LURES_ORDER[q.i % 2]) : q.answer, rtMs: 12_000 })));
    expect(birer.student.items[0].text).toContain('hemen hepsini');
    expect(birer.student.items[1].text).toContain('1–4. düzeylerdeki soruların hemen hepsini doğru cevapladın');
    // Yanlışların hepsi tek türde ama öne çıkmıyor: "iki türe de dağılıyor" denmez.
    const tek = evaluate(SLUG, hiddenBody((q) => ({ response: hiddenRank(q) === 0 ? hiddenLureOption(q, 'changed') : q.answer, rtMs: 12_000 })));
    if (tek.student.items[2].badge === 'Belirgin bir yanılgı yok') {
      expect(tek.student.items[2].text).not.toContain('iki türe de');
      expect(tek.student.items[2].text).toContain('hepsinde şeklin bir köşesi farklı benzeri seçildi');
    }
    const hard0 = evaluate(SLUG, hiddenBody((q) => ({ response: q.level <= 3 ? q.answer : hiddenLureOption(q), rtMs: 12_000 })));
    expect(hard0.student.items[1].text).toContain('4. düzeydeki 5 sorunun hiçbirini doğru bulamadın');
    const easy2 = evaluate(SLUG, hiddenBody((q) => ({ response: q.level === 1 && hiddenRank(q) < 3 ? hiddenLureOption(q, HIDDEN_LURES_ORDER[q.i % 2]) : q.answer, rtMs: 12_000 })));
    expect(easy2.student.items[0].text).toContain('daha zor düzeylerdeki soruların hepsini doğru buldun');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: HiddenCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkBir: (q) => q.level <= 1,
      kolaydaYanilma: (q) => !(q.level === 1 && hiddenRank(q) < 3),
      duz: (q) => hiddenRank(q) % 2 === 0,
      sekizDogru: (q) => q.i < HIDDEN_CHANCE_MAX,
      dokuzDogru: (q) => q.i < HIDDEN_CHANCE_MAX + 1,
      zorDogru: (q) => q.level >= 3,
      birYanlis: (q) => q.i !== 7,
      ikiYanlis: (q) => q.i !== 7 && q.i !== 12,
    };
    const wrongKinds: Record<string, (q: HiddenCell) => number> = {
      donmus: (q) => hiddenLureOption(q, 'turned'),
      kose: (q) => hiddenLureOption(q, 'changed'),
      karisik: (q) => hiddenLureOption(q, HIDDEN_LURES_ORDER[q.i % 2]),
    };
    const times: Record<string, (q: HiddenCell) => number | null> = {
      artan: (q) => 5000 + 5000 * q.level,
      hizli: (q) => (q.level >= 3 ? 1200 : 9000),
      azalan: (q) => 40_000 - 8000 * q.level,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePos of [false, true]) {
            const body = hiddenBody((q) => ({ response: samePos ? 2 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const result: HiddenResult = scoreHidden(task, trialsOf(body)).result;
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const chance = hiddenChance(result);
            const doubt = hiddenRapid(result) || hiddenSamePosition(result);
            const noted = chance || doubt ? [] : HIDDEN_LURES_ORDER.filter((k) => result.luresByKind[k] >= HIDDEN_LURE_NOTE && result.lureP[k] <= HIDDEN_LURE_P);
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
              expect(
                r.items.map((i) => i.title),
                label,
              ).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              expect(r.items[0].badge, label).toBe(`20 soruda ${result.correct} doğru`);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance || (doubt && result.wrong > 0));
              expect(r.roadmap!.bars, label).toEqual([]);
              expect(
                r.cautions.some((c) => c.includes('rastgele seçen')),
                label,
              ).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('3 saniyeden kısa'));
              expect(rapidNote, label).toBe(hiddenRapid(result));
              expect(r.items[3].text.includes('3 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(hiddenSamePosition(result));
              expect(r.items[3].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (doubt) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/çizimlere bakmadan seçmiş|çizimlere bakılmadan seçilmiş/.test(r.items[0].text), label).toBe(doubt);
              const yan = r.items[2].text;
              expect(yan.includes('rastgele seçimle açıklanamayacak kadar sık'), label).toBe(noted.length > 0);
              for (const k of noted) {
                const many = result.luresByKind[k] === result.wrong ? 'hepsinde' : `${result.luresByKind[k]} tanesinde`;
                expect(yan, `${label} ${k}`).toContain(`${many} ${HIDDEN_LURE_SEEN[k]} seçildi`);
              }
              expect(r.items[2].badge, label).toBe(
                chance || (doubt && result.wrong > 0)
                  ? 'Yorumlanmadı'
                  : result.wrong === 0
                    ? 'Yanlış cevap yok'
                    : noted.length > 1
                      ? 'İki yanılgı da öne çıkıyor'
                      : noted.length === 1
                        ? noted[0] === 'turned'
                          ? 'Döndürülmüş biçimler öne çıkıyor'
                          : 'Köşesi farklı benzerler öne çıkıyor'
                        : result.wrong >= HIDDEN_LURE_NOTE
                          ? 'Belirgin bir yanılgı yok'
                          : result.wrong === 1
                            ? 'Bir yanlış'
                            : `${result.wrong} yanlış`,
              );
              // Yanlışların türlere dağılımı kartın grafiğindedir (kart yorumlanıyorsa).
              if (r.items[2].badge !== 'Yorumlanmadı') {
                const parts = r.items[2].visual?.type === 'stack' ? r.items[2].visual.parts : [];
                expect(
                  parts.slice(0, 3).map((x) => x.value),
                  label,
                ).toEqual([result.correct, result.luresByKind.turned, result.luresByKind.changed]);
              } else expect(r.items[2].visual, label).toBeUndefined();
              expect(r.items[0].text.includes('Yanlışlarda seçilen şekiller” kartına'), label).toBe(noted.length > 0);
              if (noted.length || doubt) expect(r.items[0].text + r.items[1].text, label).not.toMatch(/dağılmasından/);
              if (doubt) expect(r.items[0].text, label).not.toContain('beklenen bir durumdur');
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge], label).toEqual(['Belirtilmedi', 'Düzey belirtilmedi']);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(result.levels.map((l) => `${l.correct}/5`));
              // Doğru bulunan sorulardaki süre yalnızca en az üç doğru varsa ve yanlış da varsa söylenir.
              expect(r.items[3].text.includes('şekli bulma'), label).toBe(
                result.medianRtCorrect !== null && result.correct >= 3 && result.correct < result.n && !chance && !doubt,
              );
              // Dikkat ya da acele açıklaması en çok bir kartta.
              expect([r.items[0].text, r.items[1].text].filter((x) => x.includes('dağılmasından')).length, label).toBeLessThanOrEqual(1);
              // Çok hızlı yanlışlar varken 3. düzey ve üstü için "zorlandı" hükmü verilmez.
              if (hiddenRapid(result)) expect(r.items[1].text, label).not.toMatch(/[34]\. düzeyde soruların (çoğunda zorlandı|hiçbirini)/);
              // "Yakın süreler" yalnızca süreler gerçekten yakınsa.
              if (r.items[3].text.includes('yakın süreler')) {
                const ratio = result.rtHard! / result.rtEasy!;
                expect(ratio > 1 / 1.2 && ratio < 1.2, `${label} ${ratio}`).toBe(true);
              }
              if (result.correct === result.n) expect(r.items[0].text, label).toMatch(/[Bb]ütün soruları doğru cevapladı/);
              // "İki türe de dağılıyor" yalnızca iki türden de yanlış varsa.
              if (r.items[2].text.includes('iki türe de')) expect([result.luresByKind.turned > 0, result.luresByKind.changed > 0], label).toEqual([true, true]);
              // Sonuç kuşkuluysa ulaşılan düzey kartı da bunu söyler; şans düzeyinde çalışma biçimi övülmez.
              if (doubt && !chance) expect(/Çalışma biçimi kartında|çok hızlı cevap/.test(r.items[1].text), label).toBe(true);
              if (chance) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler|iyi bir çalışma biçimi/);
              // "Bu en zor düzeydi" gibi belirsiz gönderme yok.
              expect(r.items[1].text, label).not.toMatch(/\bBu(,)? (testin )?en zor düzey/);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(
              /\b(buldun|verdin|cevapladın|zorlandın|seçtin|bulamadın|cevaplamadın|ayırdın|olabilirsin|olabileceğin|ayırabildin|seçmedin|ettin|bulduğun)\b|bak\./,
            );
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(12 * 3 * 4 * 2);
  }, 300_000);

  it('3. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, hiddenBody(undefined, 2))).toThrow(AssessmentError);
    expect(evaluate(SLUG, hiddenBody(undefined, 3)).student.items).toHaveLength(4);
    const r = evaluateReports(SLUG, hiddenBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(schoolWords([gizliSekiller.intro.title, ...gizliSekiller.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' '))).toEqual([]);
    // Önerilen sonraki testler 3. sınıftan itibaren ve yetişkinlere de açık.
    for (const slug of TASK_ROADMAPS[SLUG].nextTests) {
      const d = solvableInstruments().find((x) => x.slug === slug)!;
      expect([d.minGrade <= 3, d.adults], slug).toEqual([true, true]);
    }
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /GS_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      hiddenBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 8000 + 500 * q.i }), 4),
    );
    expect(r.student.items[0].badge).toBe('20 soruda 20 doğru');
    expect(r.student.items[2].badge).toBe('Yanlış cevap yok');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(4);
    expect(r.parent.roadmap!.bars).toHaveLength(0);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/gs_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"optionLures\\":\[\]/);
    expect(yml).toContain("grep -q 'Saklanan şekli bul'");
    expect(gizliSekiller.intro.title).toBe('Saklanan şekli bul');
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, hiddenBody());
    const adult = evaluateAdult(SLUG, { ...hiddenBody(), grade: ADULT_GRADE }).adult;
    for (const rep of [r.student, r.parent, adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 60_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı ve metinde anılıyor', () => {
    expect(gizliSekiller.status).toBe('pilot');
    expect(publicInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(solvableInstruments().some((d) => d.slug === SLUG)).toBe(true);
    expect(sitemap().some((e) => e.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(gizliSekiller.name).not.toMatch(/tanı/i);
    const sc = gizliSekiller.science;
    expect(JSON.stringify(sc)).not.toMatch(/YAZILACAK/);
    expect(sc.citations.every((c) => c.url?.startsWith('https://'))).toBe(true);
    const body = JSON.stringify({ ...sc, citations: [] });
    for (const a of [
      'Gottschaldt’ın (1926)',
      'Witkin’in (1950)',
      'de-Wit ve ark., 2017',
      'French ve ark., 1963',
      'Carroll, 1993',
      'Milne ve Szczerbinski, 2009',
      'Widiger ve ark., 1980',
      'MacLeod ve ark., 1986',
      'Huygelier ve ark., 2018',
      'Hock ve ark., 1974',
      'Xie ve ark., 2025',
      'Çakan, 2003a',
      'Çakan, 2003b',
      'Conson ve ark., 2022',
      'Evans ve ark., 2013',
      'Uttal ve ark., 2013',
    ]) {
      expect(body, a).toContain(a);
    }
    for (const c of sc.citations) expect(body, c.text).toContain(c.text.split(',')[0].replace(/\.$/, ''));
    expect(sc.ageNote).toContain('yetişkinler de çözebilir');
    expect(sc.limitations.join(' ')).toContain('Zekâ puanı (IQ) vermez ve tanı koymaz');
    const rm = TASK_ROADMAPS[SLUG];
    expect(rm.sources.map((x) => x.text.split(',')[0])).toEqual(['Hock', 'de-Wit', 'Milne', 'Xie', 'Uttal']);
    for (const x of rm.sources) expect(sc.citations.some((c) => c.text === x.text), x.text).toBe(true);
  });
});

