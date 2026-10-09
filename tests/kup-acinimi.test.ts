import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { CUBE_NETS, CUBE_PRACTICE_SPECS, CUBE_SPECS, kupAcinimi } from '@/content/instruments/kup-acinimi';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import {
  CUBE_FACES,
  CUBE_POSITIONS,
  SYMBOL_PERIOD,
  SYMBOL_SHAPES,
  cubeViews,
  lureOf,
  type CubeLure,
  type CubePos,
  type CubeSymbol,
  type CubeView,
} from '@/lib/instruments/cube';
import type { CubeItem, CubeNetTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { CUBE_LURE_TEXT, CUBE_TYPES } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  CUBE_CHANCE_MAX,
  CUBE_LURE_NOTE,
  CUBE_LURE_P,
  CUBE_LURES_ORDER,
  CUBE_RAPID_MS,
  CUBE_SAME_MAX_CORRECT,
  TaskInputError,
  cubeLureStandsOut,
  cubeRapid,
  cubeSamePosition,
  scoreCube,
  type CubeResult,
  type CubeTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { cubeBody, cubeLureOption, cubeRank, type CubeCell } from './helpers/bodies';
import { drawnAxes, drawnEdgeMismatches, drawnPeriod, foldPaper, looks, netDistances, opposites, sameDrawn } from './helpers/cube-check';
import { schoolWords } from './helpers/school';

const SLUG = 'kup-acinimi';
const task = kupAcinimi.tasks[0] as CubeNetTask;
const TITLES = ['Doğru cevaplar', 'Ulaşılan düzey', 'Yüzlerin yeri ve şekillerin yönü', 'Çalışma biçimi'];
const ALL: { item: CubeItem; answer: number; lures: (CubeLure | null)[] }[] = [
  ...task.items.map((item, i) => ({ item, answer: task.answers[i], lures: task.optionLures[i] })),
  ...task.practice.map((p) => ({ item: p as CubeItem, answer: p.answer, lures: [] as (CubeLure | null)[] })),
];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof cubeBody>) => (body.data as { blocks: Record<string, CubeTrialInput[]> }).blocks[task.key];
const seenFaces = (v: CubeView) => CUBE_POSITIONS.map((p) => v[p][0]);
/** Bağımsız denetleyiciye göre görünüş bu açınımdan olabilir mi. */
const possible = (item: CubeItem, v: CubeView) => looks(foldPaper(item.cells)).some((l) => sameDrawn(l, v, item.faces));

describe('Küp açınımı: sorular', () => {
  it('20 soru, 4 düzey (her birinde 5), kolaydan zora; 10 soruda yalnızca yüzlerin yeri, 10 soruda şekillerin yönü de önemli; 2 alıştırma', () => {
    expect(task.items.map((it) => it.key)).toEqual(Array.from({ length: 20 }, (_, i) => `kp${String(i + 1).padStart(2, '0')}`));
    expect(task.practice.map((p) => p.key)).toEqual(['kpp1', 'kpp2']);
    expect([1, 2, 3, 4].map((l) => task.items.filter((it) => it.level === l).length)).toEqual([5, 5, 5, 5]);
    expect(task.items.every((it, i) => i === 0 || it.level >= task.items[i - 1].level)).toBe(true);
    expect(['place', 'turn'].map((t) => task.items.filter((it) => it.type === t).length)).toEqual([10, 10]);
    for (const l of [1, 2, 3, 4])
      expect(new Set(task.items.filter((it) => it.level === l).map((it) => it.type)), String(l)).toEqual(new Set(['place', 'turn']));
    expect(task.levels.map((l) => l.level)).toEqual([1, 2, 3, 4]);
    expect(task.practice.map((p) => p.type)).toEqual(['place', 'turn']);
    expect(Object.keys(CUBE_TYPES)).toEqual(['place', 'turn']);
    // Her soruda altı farklı şekil ve altı farklı renk: yüzler hem şekliyle hem rengiyle ayırt edilir.
    for (const { item } of ALL) {
      expect(new Set(item.faces.map((f) => f.symbol)).size, item.key).toBe(6);
      expect(new Set(item.faces.map((f) => f.color)).size, item.key).toBe(6);
    }
  });

  it('on bir açınımın hepsi kullanılır ve hiçbiri ötekinin dönmüş ya da aynalanmış hâli değildir; hepsi kâğıt gibi katlanınca küp olur', () => {
    const shapeKey = (cells: readonly (readonly [number, number])[]) => {
      const forms: string[] = [];
      for (let k = 0; k < 8; k++) {
        const pts = cells.map(([x, y]) => {
          let [a, b] = k & 4 ? [-x, y] : [x, y];
          for (let r = 0; r < (k & 3); r++) [a, b] = [-b, a];
          return [a, b];
        });
        const mx = Math.min(...pts.map((p) => p[0]));
        const my = Math.min(...pts.map((p) => p[1]));
        forms.push(
          pts
            .map(([a, b]) => `${a - mx},${b - my}`)
            .sort()
            .join(' '),
        );
      }
      return forms.sort()[0];
    };
    const keys = Object.values(CUBE_NETS).map(shapeKey);
    expect(keys).toHaveLength(11);
    expect(new Set(keys).size).toBe(11);
    expect(new Set(CUBE_SPECS.map((s) => s.net))).toEqual(new Set(Object.keys(CUBE_NETS)));
    for (const [name, cells] of Object.entries(CUBE_NETS)) {
      const f = foldPaper(cells);
      expect(f, name).toHaveLength(6);
      expect(
        opposites(f).every((o, i) => o >= 0 && o !== i && opposites(f)[o] === i),
        name,
      ).toBe(true);
    }
    // Denetleyici gerçekten denetler: yan yana altı kare küp olmaz.
    expect(() =>
      foldPaper([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
      ]),
    ).toThrow();
  });

  it('şekillerin dönme simetrisi çizimden hesaplanınca aynı çıkar', () => {
    for (const s of Object.keys(SYMBOL_SHAPES) as CubeSymbol[]) expect(drawnPeriod(s), s).toBe(SYMBOL_PERIOD[s]);
  });

  it('kâğıt gibi katlanan küpün 24 duruşu testin kendi hesabıyla aynı; doğru seçenek bu duruşlardan biri, öteki üç seçenek hiçbiri değil', () => {
    for (const { item, answer } of ALL) {
      const mine = looks(foldPaper(item.cells));
      expect(mine, item.key).toHaveLength(24);
      expect(new Set(mine.map((v) => JSON.stringify(v))), item.key).toEqual(new Set(cubeViews(item.cells).map((v) => JSON.stringify(v))));
      expect(
        item.options.map((o) => possible(item, o)),
        item.key,
      ).toEqual(item.options.map((_, j) => j === answer - 1));
      // Dört seçenek ekranda birbirinden farklı görünür.
      for (let a = 0; a < 4; a++)
        for (let b = a + 1; b < 4; b++) expect(sameDrawn(item.options[a], item.options[b], item.faces), `${item.key} ${a}${b}`).toBe(false);
    }
  });

  it('çizim denetimi: doğru seçenekte açınımda yan yana duran iki yüz, çizimde de açınımdaki kenarlarından birleşir', () => {
    let pairs = 0;
    for (const { item, answer } of ALL) {
      const v = item.options[answer - 1];
      expect(drawnEdgeMismatches(item.cells, v), item.key).toEqual([]);
      // Denetim gerçekten denetler: açınımda komşusu görünen bir yüz çeyrek döndürülünce kenarlar uymaz.
      for (const pos of CUBE_POSITIONS) {
        const others = CUBE_POSITIONS.filter((q) => q !== pos).map((q) => v[q][0]);
        const d = netDistances(item.cells);
        if (!others.some((o) => d[v[pos][0]][o] === 1)) continue;
        pairs++;
        const turned: CubeView = { ...v, [pos]: [v[pos][0], ((v[pos][1] + 1) % 4) as 0 | 1 | 2 | 3] };
        expect(drawnEdgeMismatches(item.cells, turned).length, `${item.key} ${pos}`).toBeGreaterThan(0);
      }
    }
    expect(pairs).toBeGreaterThan(30);
  });

  it('yanlış seçeneklerin yanılgı türü doğrulanır (alıştırmalarda da): karşılıklı yüzler yan yana, köşedeki sıra ters ya da şeklin yönü yanlış', () => {
    const practiceLures = CUBE_PRACTICE_SPECS.map((ps) => ps.options.map((o) => lureOf(o.change)));
    const checked = [
      ...task.items.map((item, i) => ({ item, lures: task.optionLures[i], answer: task.answers[i] })),
      ...task.practice.map((item, i) => ({ item: item as CubeItem, lures: practiceLures[i], answer: item.answer })),
    ];
    for (const { item, lures, answer } of checked) {
      const folded = foldPaper(item.cells);
      const opp = opposites(folded);
      const all = looks(folded);
      item.options.forEach((o, j) => {
        const kind = lures[j];
        const label = `${item.key} ${'ABCD'[j]} ${kind}`;
        const faces = seenFaces(o);
        const hasOpposite = faces.some((f, a) => faces.some((g, b) => a !== b && opp[f] === g));
        const samePlaces = all.some((l) => CUBE_POSITIONS.every((p) => l[p][0] === o[p][0]));
        const sameSet = all.some((l) => new Set(seenFaces(l)).size === 3 && seenFaces(l).every((f) => faces.includes(f)));
        if (kind === null) {
          expect(j, label).toBe(answer - 1);
        } else if (kind === 'opposite') {
          expect(hasOpposite, label).toBe(true);
        } else if (kind === 'order') {
          // Üç yüz bir köşede buluşur ama sıraları ters.
          expect([hasOpposite, sameSet, samePlaces], label).toEqual([false, true, false]);
        } else {
          // Yüzler doğru yerde, yalnızca bir yüzdeki şeklin yönü yanlış.
          expect([hasOpposite, samePlaces], label).toEqual([false, true]);
          const base = all.find((l) => CUBE_POSITIONS.every((p) => l[p][0] === o[p][0]))!;
          const off = CUBE_POSITIONS.filter((p) => (base[p][1] - o[p][1]) % SYMBOL_PERIOD[item.faces[o[p][0]].symbol] !== 0);
          expect(off, label).toHaveLength(1);
        }
      });
      expect(new Set(lures.filter(Boolean)).size, item.key).toBeGreaterThanOrEqual(2);
    }
    // Alıştırmada üç yanılgı türünün her biri gösterilir ve açıklamada anılır.
    expect(new Set(practiceLures.flat().filter(Boolean))).toEqual(new Set(['opposite', 'order', 'turn']));
    expect(task.practice.map((p) => (p.explain.match(/\b[ABCD](’de|’da|\))/g) ?? []).length)).toEqual([3, 3]);
    // Yön yanılgısı yalnızca yönü olan şekillerin bulunduğu sorularda; bu soruların hepsinde en az bir tane.
    task.items.forEach((it, i) => {
      const turns = task.optionLures[i].filter((k) => k === 'turn').length;
      if (it.type === 'place') {
        expect(turns, it.key).toBe(0);
        expect(
          it.faces.every((f) => SYMBOL_PERIOD[f.symbol] === 1),
          it.key,
        ).toBe(true);
      } else {
        expect(turns, it.key).toBeGreaterThanOrEqual(1);
        expect(
          seenFaces(it.options[task.answers[i] - 1]).some((f) => SYMBOL_PERIOD[it.faces[f].symbol] > 1),
          it.key,
        ).toBe(true);
      }
    });
    const offered = Object.fromEntries(CUBE_LURES_ORDER.map((k) => [k, task.optionLures.flat().filter((x) => x === k).length]));
    expect(offered).toEqual({ opposite: 24, order: 24, turn: 12 });
  });

  it('raporda ve yönergede anlatılan kurallar on bir açınımın hepsinde doğru', () => {
    for (const [name, cells] of Object.entries(CUBE_NETS)) {
      const folded = foldPaper(cells);
      const opp = opposites(folded);
      const at = (c: number, r: number) => cells.findIndex((x) => x[0] === c && x[1] === r);
      const adjacent = (i: number, j: number) => Math.abs(cells[i][0] - cells[j][0]) + Math.abs(cells[i][1] - cells[j][1]) === 1;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          // Açınımda yan yana duran iki kare küpte de yan yana kalır.
          if (adjacent(i, j)) expect(opp[i], `${name} ${i}-${j}`).not.toBe(j);
          // Düz bir sırada aralarında tek kare olan iki kare karşı karşıya gelir.
          const [dc, dr] = [cells[j][0] - cells[i][0], cells[j][1] - cells[i][1]];
          if ((Math.abs(dc) === 2 && dr === 0) || (dc === 0 && Math.abs(dr) === 2)) {
            if (at(cells[i][0] + dc / 2, cells[i][1] + dr / 2) >= 0) expect(opp[i], `${name} ${i}-${j} düz`).toBe(j);
          }
        }
      }
      // Düz bir sıranın (yatay ya da dikey, en az bir kare) bir yanına bağlı kare ile öbür yanına bağlı kare karşı karşıya gelir.
      let sides = 0;
      for (const horizontal of [true, false]) {
        for (let i = 0; i < 6; i++) {
          for (let len = 1; len <= 4; len++) {
            const run = Array.from({ length: len }, (_, k) => (horizontal ? at(cells[i][0] + k, cells[i][1]) : at(cells[i][0], cells[i][1] + k)));
            if (run.some((x) => x < 0)) break;
            const side = (s: 1 | -1) =>
              run.map((x) => (horizontal ? at(cells[x][0], cells[x][1] + s) : at(cells[x][0] + s, cells[x][1]))).filter((x) => x >= 0);
            for (const a of side(-1))
              for (const b of side(1)) {
                expect(opp[a], `${name} sıra ${run} ${a}-${b}`).toBe(b);
                sides++;
              }
          }
        }
      }
      expect(sides, name).toBeGreaterThan(0);
      // Bir noktanın çevresindeki üç kare küpte bir köşede buluşur ve sıraları değişmez (dışarıdan bakınca).
      for (let c = -1; c <= 5; c++) {
        for (let r = -1; r <= 3; r++) {
          const around = [at(c, r), at(c + 1, r), at(c + 1, r + 1), at(c, r + 1)];
          if (around.filter((x) => x >= 0).length !== 3) continue;
          // Kâğıtta saat yönünün tersi (yukarısı +y): sol üst, sol alt, sağ alt, sağ üst.
          const ccw = [around[0], around[3], around[2], around[1]].filter((x) => x >= 0);
          const [na, nb, nc] = ccw.map((x) => folded[x].n);
          const det = na[0] * (nb[1] * nc[2] - nb[2] * nc[1]) - na[1] * (nb[0] * nc[2] - nb[2] * nc[0]) + na[2] * (nb[0] * nc[1] - nb[1] * nc[0]);
          expect(det, `${name} ${c},${r}`).toBe(1);
        }
      }
    }
  });

  it('çizim ayna görüntüsü değil: üst yüz üstte, sağ ön yüz sağda; her yüzün şekli dışarıdan bakıldığı gibi çizilir', () => {
    const centroid = (pos: CubePos) => {
      const pts = CUBE_FACES.find((f) => f.pos === pos)!
        .points.split(' ')
        .map((q) => q.split(',').map(Number));
      return [pts.reduce((a, q) => a + q[0], 0) / 4, pts.reduce((a, q) => a + q[1], 0) / 4];
    };
    const [top, left, right] = [centroid('top'), centroid('left'), centroid('right')];
    expect(top[1]).toBeLessThan(Math.min(left[1], right[1]));
    expect(left[0]).toBeLessThan(right[0]);
    // Yerlerin dışa bakan yönleri sağ elli bir eksen takımı: üst × sol = sağ.
    const N = { top: [0, 1, 0], left: [0, 0, 1], right: [1, 0, 0] } as const;
    for (const pos of CUBE_POSITIONS) {
      // Ekranın yatayı sağa, dikeyi aşağı: dışarıdan bakınca yerel x × yerel y yüzün içine bakar.
      const { u, v } = drawnAxes(pos);
      const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]].map((x) => x + 0);
      expect(c, pos).toEqual(N[pos].map((x) => 0 - x + 0));
    }
  });

  it('düzeyler: açınımın biçimi ve doğru seçenekte görünen üç yüzün açınımda birbirinden uzaklığı', () => {
    for (const [i, it] of task.items.entries()) {
      const spec = CUBE_SPECS[i];
      const d = netDistances(it.cells);
      const f = seenFaces(it.options[task.answers[i] - 1]);
      const span = Math.max(d[f[0]][f[1]], d[f[0]][f[2]], d[f[1]][f[2]]);
      const label = `${it.key} ${spec.net} ${span}`;
      if (it.level === 1) expect([spec.net[0], span <= 2], label).toEqual(['N', true]);
      if (it.level === 2) expect([spec.net[0], span], label).toEqual(['N', 3]);
      if (it.level === 3) expect([spec.net[0], span >= 3], label).toEqual(['S', true]);
      if (it.level === 4) expect([spec.net[0], span >= 4], label).toEqual(['Z', true]);
    }
  });

  it('doğru seçenek kestirme yollarla bulunamaz: öteki seçeneklere benzerlik, yüzlerin sıklığı, üstteki yüz', () => {
    const hits: Record<string, number> = { benzer: 0, benzerYon: 0, sik: 0, seyrek: 0, ustCogunluk: 0 };
    const uniqueBest = (scores: number[], answer: number, max = true) => {
      const best = max ? Math.max(...scores) : Math.min(...scores);
      return scores.filter((x) => x === best).length === 1 && scores.indexOf(best) === answer;
    };
    task.items.forEach((it, i) => {
      const a = task.answers[i] - 1;
      const o = it.options;
      const share = (x: CubeView, y: CubeView) => CUBE_POSITIONS.filter((p) => x[p][0] === y[p][0]).length;
      const shareExact = (x: CubeView, y: CubeView) => CUBE_POSITIONS.filter((p) => x[p][0] === y[p][0] && x[p][1] === y[p][1]).length;
      if (
        uniqueBest(
          o.map((x, j) => o.reduce((s, y, k) => s + (k === j ? 0 : share(x, y)), 0)),
          a,
        )
      )
        hits.benzer++;
      if (
        uniqueBest(
          o.map((x, j) => o.reduce((s, y, k) => s + (k === j ? 0 : shareExact(x, y)), 0)),
          a,
        )
      )
        hits.benzerYon++;
      const cnt = new Map<number, number>();
      o.forEach((x) => seenFaces(x).forEach((f) => cnt.set(f, (cnt.get(f) ?? 0) + 1)));
      const freq = o.map((x) => seenFaces(x).reduce((s, f) => s + cnt.get(f)!, 0));
      if (uniqueBest(freq, a)) hits.sik++;
      if (uniqueBest(freq, a, false)) hits.seyrek++;
      const tops = o.map((x) => o.filter((y) => y.top[0] === x.top[0]).length);
      if (uniqueBest(tops, a)) hits.ustCogunluk++;
    });
    // Rastgele seçen biri 20 soruda yaklaşık 5 doğru bulur; hiçbir kestirme yol bundan iyi değildir.
    for (const [name, n] of Object.entries(hits)) expect(n, name).toBeLessThanOrEqual(5);
  });

  it('cevap anahtarı dengeli: her harf beş kez, art arda aynı harf yok; alıştırmalarda da doğru seçenek tek', () => {
    expect([1, 2, 3, 4].map((o) => task.answers.filter((a) => a === o).length)).toEqual([5, 5, 5, 5]);
    expect(task.answers.every((a, i) => i === 0 || a !== task.answers[i - 1])).toBe(true);
    expect(task.answers).toEqual(CUBE_SPECS.map((s) => s.options.findIndex((o) => !o.change) + 1));
    expect(task.optionLures.every((ls, i) => ls.filter((l) => l === null).length === 1 && ls[task.answers[i] - 1] === null)).toBe(true);
    for (const p of task.practice) expect(p.explain.length, p.key).toBeGreaterThan(80);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, lures: task.optionLures, levels: task.levels }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: kupAcinimi.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '1a83e7b509f4ca41';

describe('Küp açınımı: puanlama', () => {
  const all = (fn: (i: number) => Partial<CubeTrialInput> = () => ({})): CubeTrialInput[] =>
    task.items.map((_, index) => ({ index, response: task.answers[index], rtMs: 12_000, ...fn(index) }));
  const cell = (i: number): CubeCell => ({ level: task.items[i].level, type: task.items[i].type, answer: task.answers[i], lures: task.optionLures[i], i });

  it('hatasız: 20 doğru, bütün düzeyler ve türler tam', () => {
    const { result } = scoreCube(task, all());
    expect([result.correct, result.reached, result.wrong, result.rapid, result.rapidOf, result.samePosition]).toEqual([20, 4, 0, 0, 10, 5]);
    expect(result.types.map((t) => `${t.type} ${t.correct}/${t.n}`)).toEqual(['place 10/10', 'turn 10/10']);
    expect(result.levels.map((l) => `${l.correct}/${l.n}`)).toEqual(['5/5', '5/5', '5/5', '5/5']);
    expect(result.offeredByKind).toEqual({ opposite: 24, order: 24, turn: 12 });
  });

  it('yanılgı türleri, çok hızlı yanlış ve hep aynı yer ayrı ayrı sayılır', () => {
    const opp = scoreCube(
      task,
      all((i) => (task.items[i].level >= 3 ? { response: cubeLureOption(cell(i), 'opposite') } : {})),
    ).result;
    expect([opp.wrong, opp.luresByKind.opposite, opp.luresByKind.order, opp.reached]).toEqual([10, 10, 0, 2]);
    const turn = scoreCube(
      task,
      all((i) => (task.items[i].type === 'turn' ? { response: cubeLureOption(cell(i), 'turn') } : {})),
    ).result;
    expect([turn.luresByKind.turn, turn.types[1].correct, turn.types[0].correct]).toEqual([10, 0, 10]);
    const rapid = scoreCube(
      task,
      all((i) => ({ rtMs: CUBE_RAPID_MS - 1, response: cubeLureOption(cell(i)) })),
    ).result;
    expect([rapid.rapid, rapid.rapidOf, cubeRapid(rapid)]).toEqual([10, 10, true]);
    expect(
      scoreCube(
        task,
        all(() => ({ rtMs: CUBE_RAPID_MS - 1 })),
      ).result.rapid,
    ).toBe(0);
    const same = scoreCube(
      task,
      all(() => ({ response: 3 })),
    ).result;
    expect([same.samePosition, cubeSamePosition(same)]).toEqual([20, true]);
    expect(CUBE_CHANCE_MAX).toBe(8);
    expect(CUBE_LURE_NOTE).toBe(3);
  });

  it('yanılgının beklenenden sık olup olmadığı: olasılık, yanlışlardaki seçeneklerin bütün birleşimleri sayılarak doğrulanır', () => {
    // Yanlış cevaplanan her soruda üç yanlış seçenekten biri eşit olasılıkla seçilseydi, türün en az bu kadar görülme olasılığı.
    const exact = (r: CubeResult, wrongIdx: number[], k: CubeLure) => {
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
    const patterns: ((i: number) => Partial<CubeTrialInput>)[] = [
      (i) => (task.items[i].level >= 3 ? { response: cubeLureOption(cell(i), 'opposite') } : {}),
      (i) => (i % 2 ? { response: cubeLureOption(cell(i), CUBE_LURES_ORDER[i % 3]) } : {}),
      (i) => (i >= 12 ? { response: cubeLureOption(cell(i), 'turn') } : {}),
      (i) => (i % 3 === 0 ? { response: cubeLureOption(cell(i), 'order') } : {}),
    ];
    for (const [n, fn] of patterns.entries()) {
      const trials = all(fn);
      const r = scoreCube(task, trials).result;
      const wrongIdx = trials.filter((t) => t.response !== task.answers[t.index]).map((t) => t.index);
      expect(wrongIdx.length, String(n)).toBeLessThanOrEqual(10);
      for (const k of CUBE_LURES_ORDER) expect(r.lureP[k], `${n} ${k}`).toBeCloseTo(exact(r, wrongIdx, k), 3);
    }
    // Yanlışlar seçeneklerdeki dağılıma yakınsa hiçbir yanılgı beklenenden sık sayılmaz; yalnızca biri seçilirse sayılır.
    const mixed = scoreCube(
      task,
      all((i) => (i % 2 ? { response: cubeLureOption(cell(i), CUBE_LURES_ORDER[i % 3]) } : {})),
    ).result;
    expect(CUBE_LURES_ORDER.filter((k) => cubeLureStandsOut(mixed, k))).toEqual([]);
    const oneKind = scoreCube(
      task,
      all((i) => (task.items[i].level >= 3 ? { response: cubeLureOption(cell(i), 'opposite') } : {})),
    ).result;
    expect(CUBE_LURES_ORDER.filter((k) => cubeLureStandsOut(oneKind, k))).toEqual(['opposite']);
    expect(CUBE_LURE_P).toBe(0.05);
  });

  it('aynı sıradaki seçenek: çok doğru cevap verende bakmadan seçmeye bağlanmaz', () => {
    // 15 doğru; 5 yanlışın hepsi A: A yarıyı bulsa da uyarı verilmez.
    const strong = scoreCube(
      task,
      all((i) => (i >= 15 ? { response: 1 } : {})),
    ).result;
    expect(strong.correct).toBeGreaterThan(CUBE_SAME_MAX_CORRECT);
    expect(cubeSamePosition(strong)).toBe(false);
    const weak = scoreCube(
      task,
      all((i) => (i >= 8 ? { response: 1 } : {})),
    ).result;
    expect([weak.correct <= CUBE_SAME_MAX_CORRECT, weak.samePosition >= 10, cubeSamePosition(weak)]).toEqual([true, true, true]);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreCube(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 5, 2.5, Number.NaN]) {
      expect(
        () =>
          scoreCube(
            task,
            ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t)),
          ),
        String(bad),
      ).toThrow(TaskInputError);
    }
    expect(() => scoreCube(task, [...ok, { index: 20, response: 1, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreCube(task, [...ok, { index: 0, response: 1, rtMs: 1 }]).result.correct).toBe(20);
    expect(() => scoreCube({ ...task, answers: [], optionLures: [] }, ok)).toThrow(TaskInputError);
    const bad = cubeBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Küp açınımı: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar ve düzeylere göre grafik; iki tür olduğu için üç boyutlu grafik yok', () => {
    const r = evaluate(
      SLUG,
      cubeBody((q) => ({ response: q.answer, rtMs: 6000 + 2000 * q.level })),
    );
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '20 soruda 20 doğru'],
      ['Ulaşılan düzey', '4. düzey'],
      ['Yüzlerin yeri ve şekillerin yönü', 'İki soru türünde de soruların çoğu doğru'],
      ['Çalışma biçimi', 'Soru başına tipik süre 11 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '20/20'],
      ['Ulaşılan düzey', '4. düzey'],
      ['Soru başına tipik süre', '11 saniye'],
    ]);
    expect(r.student.items[2].text).toContain('Yüzlerin yeri 10/10 · Şekillerin yönü 10/10.');
    expect(r.student.items[3].text).toContain('1–2. düzeyde tipik 9 saniye · 3–4. düzeyde 13 saniye.');
    const rm = r.student.roadmap!;
    expect(rm.bars).toEqual([]);
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('durumlar: rastgele düzeyi, yanılgılar, çok hızlı, hep aynı yer, tür farkı, kolay sorularda yanılma', () => {
    const none = evaluate(
      SLUG,
      cubeBody((q) => ({ response: cubeLureOption(q), rtMs: 9000 })),
    );
    expect(none.student.items.map((i) => i.badge)).toEqual(['20 soruda 0 doğru', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');

    const opp = evaluate(
      SLUG,
      cubeBody((q) => ({ response: q.level >= 3 && q.lures.includes('opposite') ? cubeLureOption(q, 'opposite') : q.answer, rtMs: 15_000 })),
    );
    const oppText = opp.student.items[2].text;
    expect(oppText).toContain(
      `10 yanlış cevabında şu yanılgı, seçeneklerde bulunma sıklığına göre beklenenden sık görüldü: ${CUBE_LURE_TEXT.opposite} (10 yanlışta).`,
    );
    expect(oppText).toContain('Karşılıklı iki yüz bir küpte hiçbir zaman aynı anda görünmez');
    expect(opp.parent.items[2].text).toContain('Çocuğunuzun');
    expect(opp.student.items[0].text).toContain('öne çıkan yanılgılar için yüzlerin yeri ve şekillerin yönü kartına bak.');
    expect(opp.parent.items[0].text).toContain('kartına bakın.');

    const turn = evaluate(
      SLUG,
      cubeBody((q) => ({ response: q.type === 'turn' ? cubeLureOption(q, 'turn') : q.answer, rtMs: 15_000 })),
    );
    expect(turn.student.items[2].badge).toBe('“Yüzlerin yeri” sorularının çoğu doğru');
    expect(turn.student.items[2].text).toContain('“Yüzlerin yeri” sorularının çoğunu doğru buldun; “Şekillerin yönü” sorularında zorlandın. Bu sorularda');
    expect(turn.student.items[2].text).toContain(`beklenenden sık görüldü: ${CUBE_LURE_TEXT.turn} (10 yanlışta)`);
    expect(turn.student.items[2].text).toContain('bir şekil açınımda hangi komşu yüze bakıyorsa küpte de o yüze bakar');

    const rapid = evaluate(
      SLUG,
      cubeBody((q) => ({ response: q.level >= 3 ? cubeLureOption(q) : q.answer, rtMs: q.level >= 3 ? 1500 : 12_000 })),
    );
    expect(rapid.student.cautions.join(' ')).toContain('3. düzey ve üstündeki 10 sorunun hepsinde yanlış bir cevap 3 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[3].text).toContain('3. düzey ve üstündeki 10 sorunun hepsinde 3 saniyeden kısa sürede yanlış cevap verdin.');
    expect(rapid.student.items[2].text).toContain('yanlışlardaki yanılgılar yorumlanmadı');
    expect(rapid.student.items[0].text).toContain('açınıma bakmadan seçmiş olabileceğin');

    const same = evaluate(
      SLUG,
      cubeBody(() => ({ response: 2, rtMs: 9000 })),
    );
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı sıradaki seçeneği seçtin');

    // Kolay sorularda yanılıp zorlarda doğru: dikkatin dağılması olasılık olarak söylenir (öne çıkan yanılgı yoksa).
    const slip = evaluate(
      SLUG,
      cubeBody((q) => ({ response: q.level === 1 && cubeRank(q) < 2 ? cubeLureOption(q) : q.answer, rtMs: 12_000 })),
    );
    expect(slip.student.items[0].text).toContain('1. düzeydeki kolay sorulardan 2 tanesini doğru cevaplamadın');
    expect(slip.student.items[0].text).toContain('dikkatinin dağılmasından');

    // Zor düzeylerde düşüş.
    const drop = evaluate(SLUG, cubeBody());
    expect(drop.student.items[0].badge).toBe('20 soruda 17 doğru');
    expect(drop.student.items[1].text).toContain(
      '1–3. düzeylerdeki soruların çoğunu doğru cevapladın. 3. düzeydeki sorularda şu gerekiyordu: basamaklı açınımlarda',
    );
    expect(drop.student.items[1].text).toContain('4. düzeyde soruların çoğunda zorlandın; bu düzeydeki sorularda zikzak açınımlarda');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    type Pattern = (q: CubeCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      ilkUc: (q) => q.level <= 3,
      ilkIki: (q) => q.level <= 2,
      ilkBir: (q) => q.level <= 1,
      kolaydaYanilma: (q) => !(q.level === 1 && cubeRank(q) < 3),
      duz: (q) => cubeRank(q) % 2 === 0,
      sekizDogru: (q) => q.i < CUBE_CHANCE_MAX,
      dokuzDogru: (q) => q.i < CUBE_CHANCE_MAX + 1,
      yerDogru: (q) => q.type === 'place',
      yonDogru: (q) => q.type === 'turn',
      zorDogru: (q) => q.level >= 3,
    };
    const wrongKinds: Record<string, (q: CubeCell) => number> = {
      karsilikli: (q) => cubeLureOption(q, 'opposite'),
      sira: (q) => cubeLureOption(q, 'order'),
      yon: (q) => cubeLureOption(q, 'turn'),
      karisik: (q) => cubeLureOption(q, CUBE_LURES_ORDER[q.i % 3]),
    };
    const times: Record<string, (q: CubeCell) => number | null> = {
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
            const body = cubeBody((q) => ({ response: samePos ? 2 : correct(q) ? q.answer : wrong(q), rtMs: rt(q) }), 7);
            const label = `${cName}/${wName}/${tName}/${samePos}`;
            const res = evaluate(SLUG, body);
            const result: CubeResult = scoreCube(task, trialsOf(body)).result;
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const chance = result.correct <= CUBE_CHANCE_MAX;
            const doubt = cubeRapid(result) || cubeSamePosition(result);
            const noted = chance || doubt ? [] : CUBE_LURES_ORDER.filter((k) => result.luresByKind[k] >= CUBE_LURE_NOTE && result.lureP[k] <= CUBE_LURE_P);
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
              expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(chance);
              expect(r.roadmap!.bars, label).toEqual([]);
              expect(
                r.cautions.some((c) => c.includes('rastgele seçen')),
                label,
              ).toBe(chance);
              const rapidNote = r.cautions.some((c) => c.includes('3 saniyeden kısa'));
              expect(rapidNote, label).toBe(cubeRapid(result));
              expect(r.items[3].text.includes('3 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = r.cautions.some((c) => c.includes('aynı sıradaki seçenek seçilmiş'));
              expect(sameNote, label).toBe(cubeSamePosition(result));
              expect(r.items[3].text.includes('aynı sıradaki seçeneği seçti'), label).toBe(sameNote);
              if (doubt) expect(r.items[3].text, label).not.toMatch(/zaman ayır|yakın süreler/);
              if (!chance) expect(/açınıma bakmadan seçmiş|açınıma bakılmadan seçilmiş/.test(r.items[0].text), label).toBe(doubt);
              // Yanılgılar: yalnızca sonuç yorumlanabiliyorsa ve en az üç yanlışta görülünce, sayısıyla.
              const tur = r.items[2].text;
              expect(tur.includes('beklenenden sık görüldü'), label).toBe(noted.length > 0);
              for (const k of CUBE_LURES_ORDER) {
                expect(tur.includes(CUBE_LURE_TEXT[k]), `${label} ${k}`).toBe(noted.includes(k));
                if (noted.includes(k)) expect(tur, `${label} ${k}`).toContain(`${CUBE_LURE_TEXT[k]} (${result.luresByKind[k]} yanlışta)`);
              }
              expect(tur.includes('yanılgılar yorumlanmadı'), label).toBe(chance || (doubt && result.wrong > 0));
              expect(tur.includes('hiçbir yanılgı, seçeneklerde'), label).toBe(!chance && !doubt && noted.length === 0 && result.wrong >= CUBE_LURE_NOTE);
              expect(r.items[0].text.includes('yanılgılar için yüzlerin yeri'), label).toBe(noted.length > 0);
              // Yanılgılar anlatılıyorsa kolay sorulardaki yanlışlar dikkatsizliğe bağlanmaz.
              if (noted.length || doubt) expect(r.items[0].text + r.items[1].text, label).not.toMatch(/dağılmasından/);
              // Sonuç kuşkuluysa düşüş "beklenen bir durum" diye yorumlanmaz.
              if (doubt) expect(r.items[0].text, label).not.toContain('beklenen bir durumdur');
              if (!chance) {
                const [place, turnT] = result.types;
                expect(tur, label).toContain(`Yüzlerin yeri ${place.correct}/10 · Şekillerin yönü ${turnT.correct}/10.`);
                const good = (x: { correct: number; n: number }) => x.correct * 2 > x.n;
                expect(r.items[2].badge, label).toBe(
                  good(place) && good(turnT)
                    ? 'İki soru türünde de soruların çoğu doğru'
                    : !good(place) && !good(turnT)
                      ? 'İki soru türünde de soruların çoğu doğru değil'
                      : `“${good(place) ? 'Yüzlerin yeri' : 'Şekillerin yönü'}” sorularının çoğu doğru`,
                );
              }
              const fig = r.keyFigures.find((f) => f.label === 'Ulaşılan düzey')!.value;
              if (chance) expect(fig, label).toBe('Yorumlanmadı');
              else if (result.reached === 0) expect([fig, r.items[1].badge?.startsWith('1. düzeyde zorlandı')], label).toEqual(['Belirtilmedi', true]);
              else expect([fig, r.items[1].badge], label).toEqual([`${result.reached}. düzey`, `${result.reached}. düzey`]);
              expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(result.levels.map((l) => `${l.correct}/5`));
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(
              /\b(buldun|verdin|cevapladın|zorlandın|seçtin|bulamadın|cevaplamadın|ayırdın|olabilirsin|olabileceğin|katlayabildin)\b|bak\./,
            );
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(12 * 4 * 4 * 2);
  }, 300_000);

  it('5. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, cubeBody(undefined, 4))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, cubeBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(rmText).not.toMatch(/kitap/i);
    expect(
      schoolWords([kupAcinimi.intro.title, ...kupAcinimi.intro.paragraphs, ...task.instructions, ...task.practice.map((p) => p.explain)].join(' ')),
    ).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /KP_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      cubeBody((q) => ({ response: Number(m![1].split(',')[q.i]), rtMs: 8000 + 500 * q.i })),
    );
    expect(r.student.items[0].badge).toBe('20 soruda 20 doğru');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(4);
    expect(r.parent.roadmap!.bars).toHaveLength(0);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/kp_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"optionLures\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(
      SLUG,
      cubeBody((q) => ({ response: q.type === 'turn' && q.level >= 2 ? cubeLureOption(q, 'turn') : q.answer, rtMs: 12_000 })),
    );
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, cubeBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(kupAcinimi.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(kupAcinimi.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(kupAcinimi.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...kupAcinimi.science, citations: [] });
    for (const a of [
      'Dahm ve Sachse, 2025',
      'Harris ve ark., 2013',
      'Hilton ve ark., 2022',
      'Hodgkiss ve ark., 2018',
      'Pawlak-Jakubowska ve Terczyńska, 2023',
      'Shepard ve Feng, 1972',
    ])
      expect(body, a).toContain(a);
    expect(kupAcinimi.science.citations.map((c) => c.text.split(',')[0])).toEqual(['Dahm', 'Harris', 'Hilton', 'Hodgkiss', 'Pawlak-Jakubowska', 'Shepard']);
    // Yol haritasının kaynakları sitede kullanılan, künyesi doğrulanmış kaynaklardır.
    expect(TASK_ROADMAPS[SLUG].sources.every((s) => s.url?.startsWith('https://doi.org/'))).toBe(true);
  });
});
