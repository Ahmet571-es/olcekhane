import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import {
  ROTATION3D_EXAMPLE,
  ROTATION3D_FIGURES,
  ROTATION3D_PRACTICE_SPECS,
  ROTATION3D_SPECS,
  ucBoyutluZihindeDondurme,
} from '@/content/instruments/uc-boyutlu-zihinde-dondurme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { rotation3dMixHeadline } from '@/lib/reports/build';
import { ADULT_GRADE } from '@/lib/config';
import {
  cellsOf,
  det,
  drawFigure,
  mul,
  rotX,
  rotY,
  rotZ,
  rotationAngle,
  transpose,
  turnOf,
  type Arm,
  type Cell3,
  type Mat3,
} from '@/lib/instruments/rotation3d';
import type { MentalRotation3dTask, Rotation3dFigure, Rotation3dItem } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  ROTATION3D_CHANCE_MAX,
  ROTATION3D_MIRROR_NOTE,
  ROTATION3D_PART_GAP,
  ROTATION3D_RAPID_MS,
  ROTATION3D_SAME_MAX_CORRECT,
  TaskInputError,
  rotation3dHalfPick,
  rotation3dMirrorPick,
  rotation3dRapid,
  rotation3dSamePair,
  scoreRotation3d,
  type Rotation3dResult,
  type Rotation3dTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { r3Half, rotation3dBody, type Rotation3dCell } from './helpers/bodies';
import {
  armFactors,
  centersOf,
  chainHeights,
  chainOrder,
  crossArmOverlap,
  faceShading,
  isChiral,
  latticeOf,
  painterMismatch,
  pictureResidual,
  relation,
  selfRotations,
  silhouetteIoU,
  zbuffer,
} from './helpers/rotation3d-check';
import { schoolWords } from './helpers/school';

const SLUG = 'uc-boyutlu-zihinde-dondurme';
const task = ucBoyutluZihindeDondurme.tasks[0] as MentalRotation3dTask;
const TITLES = ['Doğru cevaplar', 'Dik eksen ve yan yatırma', 'Ayna görüntüleri', 'Çalışma biçimi'];
type V = [number, number, number];

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof rotation3dBody>) => (body.data as { blocks: Record<string, Rotation3dTrialInput[]> }).blocks[task.key];

/** Tarayıcıya giden veriden şeklin üç boyutlu merkezleri ve ızgaradaki yeri (bağımsız denetleyici). */
const lattice = (f: Rotation3dFigure) => latticeOf(centersOf(f.cells as unknown as Cell3[], f.m as unknown as Mat3));
const raster = (f: Rotation3dFigure) => zbuffer(f.cells as unknown as Cell3[], f.m as unknown as Mat3, 0.03);
/** Küpler tarayıcıya karışık sırayla gider; kol denetimleri için zincir sırası yeniden kurulur. */
const chained = (f: Rotation3dFigure): Cell3[] => chainOrder(f.cells as unknown as Cell3[]).map((i) => f.cells[i] as unknown as Cell3);
const arms = (s: string): Arm[] => s.split(' ').map((x) => ({ dir: x.slice(0, 2) as Arm['dir'], n: Number(x.slice(2)) }));
const ALL: { item: Rotation3dItem; answer: [number, number] }[] = [
  ...task.items.map((item, i) => ({ item, answer: task.answers[i] })),
  ...task.practice.map((p) => ({ item: p as Rotation3dItem, answer: p.answer })),
];
const FIGURES_SHOWN: { label: string; fig: Rotation3dFigure }[] = [
  ...ALL.flatMap(({ item }) => [
    { label: `${item.key} şekil`, fig: item.target },
    ...item.options.map((o, k) => ({ label: `${item.key} ${'ABCD'[k]}`, fig: o })),
  ]),
  { label: 'örnek şekil', fig: task.example.target },
  { label: 'örnek döndürülmüş', fig: task.example.rotated },
  { label: 'örnek ayna', fig: task.example.mirrored },
];
/** İçerik dosyasındaki tanımdan hedefin duruşu: çeyrek turlar (önce z, sonra x, sonra y) ve dik eksende dönüş. */
const targetPose = (base: readonly number[], yaw: number): Mat3 => mul(rotY(yaw), mul(rotY(90 * base[1]), mul(rotX(90 * base[0]), rotZ(90 * base[2]))));

describe('Üç boyutlu zihinde döndürme: şekiller ve sorular', () => {
  it('20 soru (iki bölüm, her birinde 10), 2 alıştırma, her soruda 4 seçenek; on şeklin her biri her bölümde bir kez', () => {
    expect(task.items.map((it) => it.key)).toEqual(Array.from({ length: 20 }, (_, i) => `ud${String(i + 1).padStart(2, '0')}`));
    expect(task.items.map((it) => it.part)).toEqual([...Array(10).fill(1), ...Array(10).fill(2)]);
    expect(task.practice.map((p) => [p.key, p.part])).toEqual([
      ['udp1', 1],
      ['udp2', 2],
    ]);
    for (const { item } of ALL) expect(item.options, item.key).toHaveLength(4);
    const main = Object.keys(ROTATION3D_FIGURES).filter((k) => /^F\d+$/.test(k));
    expect(main).toHaveLength(10);
    for (const part of [1, 2])
      expect(
        ROTATION3D_SPECS.filter((s) => s.part === part)
          .map((s) => s.figure)
          .sort(),
        String(part),
      ).toEqual([...main].sort());
    expect(task.parts.map((p) => p.part)).toEqual([1, 2]);
  });

  it('şekiller: yüz yüze birleşmiş küplerden zincir, dört kol ve üç dik kıvrım, ayna simetrisiz; hiçbiri ötekinin döndürülmüş ya da ayna görüntüsü değil', () => {
    const shapes = Object.entries(ROTATION3D_FIGURES).map(([k, s]) => ({ k, a: arms(s), cells: cellsOf(arms(s)).map((c) => [...c] as V) }));
    for (const { k, a, cells } of shapes) {
      expect(a, k).toHaveLength(4);
      for (let i = 1; i < 4; i++) expect(a[i].dir[0] !== a[i - 1].dir[0], `${k} ${i}. kıvrım dik`).toBe(true);
      expect(
        a.every((x) => x.n >= 2),
        k,
      ).toBe(true);
      expect(cells.length, k).toBe(a.reduce((s, x) => s + x.n, 0));
      if (/^F/.test(k)) expect([9, 10], k).toContain(cells.length);
      // Küpler üst üste binmez; yalnızca zincirde art arda gelen küpler yüz yüze değer.
      expect(new Set(cells.map((c) => c.join())).size, k).toBe(cells.length);
      for (let i = 0; i < cells.length; i++)
        for (let j = i + 1; j < cells.length; j++) {
          const d = Math.abs(cells[i][0] - cells[j][0]) + Math.abs(cells[i][1] - cells[j][1]) + Math.abs(cells[i][2] - cells[j][2]);
          expect(d === 1, `${k} ${i}-${j}`).toBe(j === i + 1);
        }
      expect(isChiral(cells), k).toBe(true);
      // Döndürme simetrisi yok: iki farklı duruş aynı çizimi vermez (duruşlar arası açılar ve kestirme denetimleri buna dayanır).
      expect(selfRotations(cells as unknown as Cell3[]), k).toBe(1);
    }
    for (let i = 0; i < shapes.length; i++)
      for (let j = i + 1; j < shapes.length; j++) expect(relation(shapes[i].cells, shapes[j].cells), `${shapes[i].k}-${shapes[j].k}`).toBe('other');
    // Dört şeklin iki uçtaki kolu eşit uzunlukta görünür (ilk kol köşe küpünü içerir; son kola köşe küpü eklenir).
    const homo = shapes.filter((s) => /^F/.test(s.k) && s.a[0].n === s.a[3].n + 1).map((s) => s.k);
    expect(homo).toEqual(['F3', 'F5', 'F9', 'F10']);
  });

  it('doğru seçenekler, tarayıcıya giden çizim verisinden bağımsız bir hesapla bulunur: ikisi döndürülmüş hâl, ikisi ayna görüntüsü', () => {
    for (const { item, answer } of ALL) {
      const t = lattice(item.target);
      expect(t.err, item.key).toBeLessThan(0.005);
      const rel = item.options.map((o) => {
        const l = lattice(o);
        expect(l.err, item.key).toBeLessThan(0.005);
        return relation(t.cells, l.cells);
      });
      expect(rel, item.key).toEqual(item.options.map((_, k) => (answer.includes(k + 1) ? 'same' : 'mirror')));
    }
    const t = lattice(task.example.target).cells;
    expect([relation(t, lattice(task.example.rotated).cells), relation(t, lattice(task.example.mirrored).cells)]).toEqual(['same', 'mirror']);
  });

  it('tarayıcıya giden veride cevap anahtarı yok: doğru seçenekler hedefle aynı küp listesini taşımaz, küpler zincir sırasıyla gitmez, bütün matrisler gerçek döndürmedir', () => {
    expect(task.answers).toHaveLength(20);
    for (const { item, answer } of ALL)
      for (const k of answer) expect(JSON.stringify(item.options[k - 1].cells), `${item.key} ${k}`).not.toBe(JSON.stringify(item.target.cells));
    // Küplerin sırası karıştırılmıştır: dizideki art arda iki küp çoğu zaman yüz yüze komşu değildir.
    const inChain = FIGURES_SHOWN.filter(({ fig }) => {
      const o = chainOrder(fig.cells as unknown as Cell3[]);
      return o.every((x, i) => x === i) || o.every((x, i) => x === o.length - 1 - i);
    });
    expect(inChain.map((f) => f.label)).toEqual([]);
    for (const { label, fig } of FIGURES_SHOWN) {
      const m = fig.m as unknown as Mat3;
      expect(det(m), label).toBeCloseTo(1, 3);
      const mmT = mul(m, transpose(m));
      [1, 0, 0, 0, 1, 0, 0, 0, 1].forEach((x, k) => expect(mmT[k], `${label} ${k}`).toBeCloseTo(x, 3));
      expect(
        fig.cells.every((c) => c.every((x) => Number.isInteger(x) && x >= 0)),
        label,
      ).toBe(true);
    }
  });

  it('çizim: ressam yöntemi derinlik tamponuyla aynı sonucu verir; her küpün en az dörtte biri görünür, uçtaki küpler yarıya yakın görünür, hiçbir kol kameraya doğru kısalmaz, bağlı olmayan kollar üst üste binmez, küplerin üç yüzü de görünür ve üste bakan yüz açık renktedir', () => {
    for (const { label, fig } of FIGURES_SHOWN) {
      const r = raster(fig);
      const vis = r.visible.map((v, i) => v / r.solo[i]);
      const order = chainOrder(fig.cells as unknown as Cell3[]);
      expect(Math.min(...vis), label).toBeGreaterThanOrEqual(0.24);
      // En çok bir küp üçte birinden az görünür.
      expect(vis.filter((v) => v < 0.3).length, label).toBeLessThanOrEqual(1);
      expect(Math.min(vis[order[0]], vis[order[order.length - 1]]), label).toBeGreaterThanOrEqual(0.45);
      expect(Math.min(...armFactors(chained(fig), fig.m as unknown as Mat3)), label).toBeGreaterThanOrEqual(0.54);
      expect(painterMismatch(drawFigure(fig.cells as unknown as Cell3[], fig.m as unknown as Mat3), r), label).toBeLessThanOrEqual(0.002);
      // Birbirine bağlı olmayan kollar (ör. 1. ve 3. kol) ekranda üst üste binmez.
      expect(crossArmOverlap(chained(fig), fig.m as unknown as Mat3), label).toBeLessThanOrEqual(0.05);
      // Düz bir resim gibi görünmez (üç yüz yönü de görünür) ve ışık bir yönü belirgin biçimde aydınlatır.
      const shade = faceShading(fig.cells as unknown as Cell3[], fig.m as unknown as Mat3);
      expect(shade.minShare, label).toBeGreaterThanOrEqual(0.095);
      expect(shade.bright, label).toBeGreaterThanOrEqual(0.6);
    }
  });

  it('dönüşler: 1. bölümde yalnızca dik eksen (50–180°), 2. bölümde ayrıca resim düzleminde yan yatırma (40–140°); doğru seçeneklerle aynaların açıları dengeli', () => {
    const angles: Record<string, number[]> = { s1: [], m1: [], s2: [], m2: [] };
    for (const spec of [...ROTATION3D_SPECS, ...ROTATION3D_PRACTICE_SPECS]) {
      const t = targetPose(spec.base, spec.yaw);
      for (const o of spec.options) {
        expect(Math.abs(o.yaw), spec.key).toBeGreaterThanOrEqual(spec.part === 1 ? 50 : 40);
        expect(Math.abs(o.yaw), spec.key).toBeLessThanOrEqual(180);
        if (spec.part === 1) expect(o.roll ?? 0, spec.key).toBe(0);
        else expect(Math.abs(o.roll ?? 0), spec.key).toBeGreaterThanOrEqual(40);
        if (spec.part === 2) expect(Math.abs(o.roll ?? 0), spec.key).toBeLessThanOrEqual(140);
        const ang = rotationAngle(mul(turnOf(t, o.yaw, o.roll ?? 0), transpose(t)));
        // Alıştırmalarda dönüşler biraz daha küçük olabilir (alıştırma daha kolaydır).
        expect(ang, spec.key).toBeGreaterThanOrEqual(spec.part === 1 || spec.key.startsWith('udp') ? 45 : 60);
        if (!spec.key.startsWith('udp')) angles[`${o.mirror ? 'm' : 's'}${spec.part}`].push(ang);
      }
    }
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    expect(Math.abs(mean(angles.s1) - mean(angles.m1))).toBeLessThan(15);
    expect(Math.abs(mean(angles.s2) - mean(angles.m2))).toBeLessThan(15);
  });

  it('bir sorudaki seçeneklerin duruşları birbirinden ayrıdır: doğru seçenekle ayna görüntüsü en az 25° (2. bölümde 35°), aynı türden iki seçenek en az 40°', () => {
    for (const spec of [...ROTATION3D_SPECS, ...ROTATION3D_PRACTICE_SPECS]) {
      const t = targetPose(spec.base, spec.yaw);
      const poses = spec.options.map((o) => turnOf(t, o.yaw, o.roll ?? 0));
      for (let a = 0; a < 4; a++)
        for (let b = a + 1; b < 4; b++) {
          const same = spec.options[a].mirror === spec.options[b].mirror;
          // Alıştırmalarda yalnızca aynı türden seçenekler ayrılır (alıştırma daha kolaydır).
          if (!same && spec.key.startsWith('udp')) continue;
          expect(rotationAngle(mul(poses[a], transpose(poses[b]))), `${spec.key} ${a + 1}-${b + 1}`).toBeGreaterThanOrEqual(
            same ? 39.5 : spec.part === 1 ? 24.5 : 34.5,
          );
        }
    }
  });

  it('hiçbir çizim, hedefin ya da başka bir seçeneğin düz bir resim gibi döndürülmüş ya da çevrilmiş hâli değildir (aralarında en az 25° üç boyutlu dönüş kalır)', () => {
    for (const { item } of ALL) {
      const figs = [item.target, ...item.options].map((f) => ({ cells: f.cells as unknown as Cell3[], m: f.m as unknown as Mat3 }));
      for (let a = 0; a < figs.length; a++)
        for (let b = a + 1; b < figs.length; b++)
          expect(pictureResidual(figs[a], figs[b]), `${item.key} ${'ŞABCD'[a]}-${'ŞABCD'[b]}`).toBeGreaterThanOrEqual(24.5);
    }
  });

  it('1. bölümde ayna görüntüleri de dik durur: her seçenekte küplerin zincir boyunca yükseklikleri hedefteki gibidir (baş aşağı ayna yok)', () => {
    for (const item of task.items.filter((it) => it.part === 1)) {
      const h = chainHeights(item.target.cells as unknown as Cell3[], item.target.m as unknown as Mat3);
      for (const [k, o] of item.options.entries()) {
        const ho = chainHeights(o.cells as unknown as Cell3[], o.m as unknown as Mat3);
        const same = (x: number[], y: number[]) => x.every((v, i) => Math.abs(v - y[i]) < 0.01);
        expect(same(h, ho) || same(h, [...ho].reverse()), `${item.key} ${'ABCD'[k]}`).toBe(true);
      }
    }
  });

  it('cevap anahtarı dengeli: her yer 10 soruda doğru, her yer çifti 3 ya da 4 soruda doğru çift, art arda aynı çift yok', () => {
    expect(task.answers).toEqual(ROTATION3D_SPECS.map((s) => s.options.flatMap((o, k) => (o.mirror ? [] : [k + 1]))));
    for (const a of task.answers) expect(a[0] < a[1]).toBe(true);
    expect([1, 2, 3, 4].map((p) => task.answers.filter((a) => a.includes(p)).length)).toEqual([10, 10, 10, 10]);
    const pairs = new Map<string, number>();
    for (const a of task.answers) pairs.set(a.join(), (pairs.get(a.join()) ?? 0) + 1);
    expect(pairs.size).toBe(6);
    for (const [k, n] of pairs) expect([3, 4], k).toContain(n);
    expect(task.answers.every((a, i) => i === 0 || a.join() !== task.answers[i - 1].join())).toBe(true);
    for (const s of [...ROTATION3D_SPECS, ...ROTATION3D_PRACTICE_SPECS])
      expect(
        s.options.filter((o) => o.mirror),
        s.key,
      ).toHaveLength(2);
  });

  it('doğru çift kestirme yollarla bulunamaz: hedefe siluetçe en çok ya da en az benzeyen iki seçenek, birbirine en çok ya da en az benzeyen iki seçenek ya da onların dışında kalan iki seçenek', () => {
    const hits = { enBenzer: 0, enAzBenzer: 0, birbirine: 0, birbirineDisi: 0, birbirineEnAz: 0, birbirineEnAzDisi: 0 };
    const rest = (pair: string) => [1, 2, 3, 4].filter((x) => !pair.split(',').includes(String(x))).join(',');
    task.items.forEach((item, i) => {
      const t = raster(item.target);
      const o = item.options.map(raster);
      const ans = task.answers[i].join();
      const order = o.map((r, k) => ({ k: k + 1, v: silhouetteIoU(t, r) })).sort((a, b) => b.v - a.v);
      if ([order[0].k, order[1].k].sort().join() === ans) hits.enBenzer++;
      if ([order[2].k, order[3].k].sort().join() === ans) hits.enAzBenzer++;
      const pairs: { v: number; pair: string }[] = [];
      for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) pairs.push({ v: silhouetteIoU(o[a], o[b]), pair: `${a + 1},${b + 1}` });
      pairs.sort((x, y) => y.v - x.v);
      const most = pairs[0].pair;
      const least = pairs[pairs.length - 1].pair;
      if (most === ans) hits.birbirine++;
      if (rest(most) === ans) hits.birbirineDisi++;
      if (least === ans) hits.birbirineEnAz++;
      if (rest(least) === ans) hits.birbirineEnAzDisi++;
    });
    // Rastgele seçen biri 20 soruda yaklaşık 3 doğru çift bulur; hiçbir kestirme yol bundan belirgin biçimde iyi değildir.
    for (const [name, n] of Object.entries(hits)) expect(n, name).toBeLessThanOrEqual(5);
  }, 120_000);

  it('alıştırmalar: açıklama doğru harfleri anar; canlandırma hedef şekli tam olarak doğru seçeneklerin duruşuna getirir', () => {
    for (const p of task.practice) {
      const letters = p.answer.map((a) => 'ABCD'[a - 1]);
      expect(p.explain, p.key).toContain(`${letters[0]} ve ${letters[1]}`);
      expect(p.turns, p.key).toHaveLength(2);
      p.turns.forEach((turn, k) => {
        const end = centersOf(p.target.cells as unknown as Cell3[], turnOf(p.target.m as unknown as Mat3, turn.yaw, turn.roll));
        const want = centersOf(p.options[p.answer[k] - 1].cells as unknown as Cell3[], p.options[p.answer[k] - 1].m as unknown as Mat3);
        // Her küpün son yeri, seçenekteki küplerden birinin yerine (yuvarlama payı içinde) denk gelir.
        const near = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.01;
        expect(
          end.every((e) => want.filter((w) => near(e, w)).length === 1),
          `${p.key} ${k}`,
        ).toBe(true);
        expect(
          want.every((w) => end.some((e) => near(e, w))),
          `${p.key} ${k}`,
        ).toBe(true);
      });
    }
    expect(ROTATION3D_EXAMPLE.figure).toBe('E');
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(JSON.stringify({ items: task.items, practice: task.practice, answers: task.answers, example: task.example, parts: task.parts }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: ucBoyutluZihindeDondurme.version, hash }).toEqual({ version: 1, hash: SORU_IZI });
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = 'ab55915858d5f9b6';

describe('Üç boyutlu zihinde döndürme: puanlama', () => {
  const cell = (i: number): Rotation3dCell => {
    const answer = task.answers[i];
    return { part: task.items[i].part, answer, mirrors: [1, 2, 3, 4].filter((o) => !answer.includes(o)) as [number, number], i };
  };
  const all = (fn: (i: number) => Partial<Rotation3dTrialInput> = () => ({})): Rotation3dTrialInput[] =>
    task.items.map((_, index) => ({ index, response: [...task.answers[index]], rtMs: 12_000, ...fn(index) }));

  it('hatasız: 20 doğru, 40 doğru şekil, bölümler tam', () => {
    const { result } = scoreRotation3d(task, all());
    expect([result.correct, result.half, result.none, result.figures, result.rapid, result.medianRt]).toEqual([20, 0, 0, 40, 0, 12_000]);
    expect(result.parts.map((p) => `${p.part}: ${p.correct}/${p.n}`)).toEqual(['1: 10/10', '2: 10/10']);
    expect(result.samePair).toBe(4);
  });

  it('bir doğru bir ayna, iki ayna, çok hızlı yanlış ve hep aynı çift ayrı ayrı sayılır; seçim sırası önemli değildir', () => {
    const half = scoreRotation3d(
      task,
      all((i) => (i % 2 ? { response: r3Half(cell(i), i) } : {})),
    ).result;
    expect([half.correct, half.half, half.none, half.figures]).toEqual([10, 10, 0, 30]);
    const none = scoreRotation3d(
      task,
      all((i) => (task.items[i].part === 2 ? { response: [...cell(i).mirrors].reverse() } : {})),
    ).result;
    expect([none.correct, none.none, none.parts[1].none, none.parts[0].correct, rotation3dMirrorPick(none)]).toEqual([10, 10, 10, 10, true]);
    const reversedOrder = scoreRotation3d(
      task,
      all((i) => ({ response: [...task.answers[i]].reverse() })),
    ).result;
    expect(reversedOrder.correct).toBe(20);
    const rapid = scoreRotation3d(
      task,
      all((i) => (i < 5 ? { response: r3Half(cell(i)), rtMs: ROTATION3D_RAPID_MS - 1 } : {})),
    ).result;
    expect([rapid.rapid, rotation3dRapid(rapid)]).toEqual([5, true]);
    // Çok hızlı ama doğru cevaplar sayılmaz.
    expect(
      scoreRotation3d(
        task,
        all(() => ({ rtMs: 1000 })),
      ).result.rapid,
    ).toBe(0);
    const same = scoreRotation3d(
      task,
      all(() => ({ response: [2, 1] })),
    ).result;
    expect([same.samePair, rotation3dSamePair(same)]).toEqual([20, true]);
    expect(ROTATION3D_CHANCE_MAX).toBe(6);
    expect(ROTATION3D_MIRROR_NOTE).toBe(7);
    expect(ROTATION3D_PART_GAP).toBe(3);
  });

  it('şans sınırları: rastgele seçimde 7 ya da daha çok doğrunun ve 7 ya da daha çok iki aynanın olasılığı %5’ten az, 6 ya da daha çoğununki değil', () => {
    const tail = (k: number) => {
      let p = 0;
      const c = (n: number, r: number) => {
        let x = 1;
        for (let j = 1; j <= r; j++) x = (x * (n - r + j)) / j;
        return x;
      };
      for (let j = k; j <= 20; j++) p += c(20, j) * (1 / 6) ** j * (5 / 6) ** (20 - j);
      return p;
    };
    expect(tail(ROTATION3D_CHANCE_MAX + 1)).toBeLessThan(0.05);
    expect(tail(ROTATION3D_CHANCE_MAX)).toBeGreaterThan(0.05);
    expect(tail(ROTATION3D_MIRROR_NOTE)).toBeLessThan(0.05);
    expect(tail(ROTATION3D_MIRROR_NOTE - 1)).toBeGreaterThan(0.05);
    // Bütün çiftler eşit olasılıkla seçilince bir sorunun doğru olma olasılığı 1/6, iki aynanınki de 1/6.
    const pairs: number[][] = [];
    for (let a = 1; a <= 4; a++) for (let b = a + 1; b <= 4; b++) pairs.push([a, b]);
    for (const [i] of task.answers.entries()) {
      const hits = pairs.map((p) => p.filter((x) => task.answers[i].includes(x)).length);
      expect([hits.filter((h) => h === 2).length, hits.filter((h) => h === 0).length, hits.filter((h) => h === 1).length]).toEqual([1, 1, 4]);
    }
  });

  it('aynı çift: çok doğru cevap verende bakmadan seçmeye bağlanmaz', () => {
    const strong = scoreRotation3d(
      task,
      all((i) => (i >= 11 ? { response: [1, 2] } : {})),
    ).result;
    expect(strong.correct).toBeGreaterThan(ROTATION3D_SAME_MAX_CORRECT);
    expect(rotation3dSamePair(strong)).toBe(false);
    const weak = scoreRotation3d(
      task,
      all((i) => (i >= 6 ? { response: [1, 2] } : {})),
    ).result;
    expect([weak.correct <= ROTATION3D_SAME_MAX_CORRECT, weak.samePair >= 10, rotation3dSamePair(weak)]).toEqual([true, true, true]);
  });

  it('eksik ya da geçersiz cevap reddedilir; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreRotation3d(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [[1], [1, 2, 3], [1, 1], [0, 2], [2, 5], [1.5, 2], [Number.NaN, 1]] as number[][]) {
      expect(
        () =>
          scoreRotation3d(
            task,
            ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t)),
          ),
        JSON.stringify(bad),
      ).toThrow(TaskInputError);
    }
    expect(() =>
      scoreRotation3d(
        task,
        ok.map((t, i) => (i === 3 ? { ...t, response: 2 as unknown as number[] } : t)),
      ),
    ).toThrow(TaskInputError);
    expect(() =>
      scoreRotation3d(
        task,
        ok.map((t, i) => (i === 3 ? { ...t, rtMs: -1 } : t)),
      ),
    ).toThrow(TaskInputError);
    expect(() => scoreRotation3d(task, [...ok, { index: 20, response: [1, 2], rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreRotation3d(task, [...ok, { index: 0, response: [3, 4], rtMs: 1 }]).result.correct).toBe(20);
    expect(() => scoreRotation3d({ ...task, answers: [] }, ok)).toThrow(TaskInputError);
    const bad = rotation3dBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Üç boyutlu zihinde döndürme: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar ve bölümlere göre grafik; iki bölüm olduğu için üç boyutlu grafik yok', () => {
    const r = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.answer, rtMs: q.part === 1 ? 14_000 : 21_000 })),
    );
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '20 soruda 20 doğru'],
      ['Dik eksen ve yan yatırma', 'İki bölümde de hepsi doğru'],
      ['Ayna görüntüleri', 'Ayna görüntüsü seçilmedi'],
      ['Çalışma biçimi', 'Soru başına tipik süre 18 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '20/20'],
      ['Doğru seçilen şekiller', '40/40'],
      ['Soru başına tipik süre', '18 saniye'],
    ]);
    // Bölümlerin sayıları ve süreleri kartların grafiğindedir.
    expect(r.student.items[1].visual?.type === 'bars' ? r.student.items[1].visual.rows.map((x) => x.valueLabel) : []).toEqual(['10/10', '10/10']);
    expect(r.student.items[0].text).toContain('Soruların hepsinde döndürülmüş iki şekli de buldun');
    expect(r.student.items[3].visual?.type === 'bars' ? r.student.items[3].visual.rows.map((x) => `${x.label} ${x.valueLabel}`) : []).toEqual([
      'Bütün sorular 18 sn',
      '1. bölüm 14 sn',
      '2. bölüm 21 sn',
    ]);
    expect(r.student.items[3].text).toContain('Yan yatırılmış şekillere daha çok zaman ayırdın');
    expect(r.student.chart?.type === 'bars' && r.student.chart.rows.map((row) => [row.label, row.valueLabel])).toEqual([
      ['1. bölüm: dik eksende döndürülmüş şekiller', '10/10'],
      ['2. bölüm: yan yatırılmış şekiller', '10/10'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars).toEqual([]);
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
  });

  it('durumlar: rastgele düzeyi, ters anlaşılan yönerge, sık iki ayna, bölüm farkı, çok hızlı, hep aynı çift', () => {
    // Tam doğrular az, şekiller de rastgele seçimdeki kadar: rastgele düzeyi.
    const none = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.i < 2 ? q.answer : q.i < 6 ? q.mirrors : r3Half(q, q.i), rtMs: 9000 })),
    );
    expect(none.student.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(none.student.items[0].visual).toBeUndefined();
    expect(none.student.items[1].text).toBe('Doğru cevaplar çok az olduğu için iki bölüm karşılaştırılmadı.');
    expect(none.student.chart).toBeNull();
    expect(none.student.keyFigures.map((f) => f.value)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', '9 saniye']);
    expect(none.student.cautions.join(' ')).toContain('rastgele seçen birinin de bulabileceği kadar az');

    // Hiç tam doğru yok ama 20 sorunun hepsinde bir doğru şekil ile bir ayna görüntüsü: rastgele seçimde bu pek olmaz.
    const allHalf = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: r3Half(q, q.i), rtMs: 9000 })),
    );
    expect(allHalf.student.items[0].text).toContain('Soruların hepsinde iki şekilden birini doğru seçtin, öbürü ise bir ayna görüntüsüydü.');
    expect(allHalf.student.items[1].text).toBe('Yönerge farklı anlaşılmış olabileceği için iki bölüm karşılaştırılmadı.');
    expect(allHalf.student.items[2].text).toContain('Yanlış cevaplarının hepsinde bir doğru şekil ile bir ayna görüntüsü seçtin');
    expect(allHalf.student.cautions.join(' ')).toContain('20 sorunun hepsinde bir döndürülmüş şekil ile bir ayna görüntüsü seçilmiş');

    // 6 doğru, öteki 14 soruda bir doğru şekil ile bir ayna görüntüsü: 40 şeklin 26'sı doğru; rastgele seçim sayılmaz,
    // yönerge "biri döndürülmüş, biri ayna" diye anlaşılmış olabilir.
    const half = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.i < 6 ? q.answer : r3Half(q, q.i), rtMs: 15_000 })),
    );
    expect(half.student.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 15 saniye']);
    expect(half.student.items[0].text).toContain('20 sorunun 14 tanesinde iki şekilden birini doğru seçtin, öbürü ise bir ayna görüntüsüydü.');
    expect(half.student.items[2].text).toContain('Yanlış cevaplarının hepsinde bir doğru şekil ile bir ayna görüntüsü seçtin');
    expect(half.parent.items[0].text).toContain('Çocuğunuz 20 sorunun 14 tanesinde iki şekilden birini doğru seçti');
    expect(half.student.cautions).toEqual([
      'Üç boyutlu zihinde döndürme testinde 20 sorunun 14 tanesinde bir döndürülmüş şekil ile bir ayna görüntüsü seçilmiş; rastgele seçimde bu pek beklenmez. Yönerge farklı anlaşılmış ya da ikinci şekil hep ayna görüntüsüyle karıştırılmış olabilir. Bu sonuç yorumlanmamalıdır.',
    ]);
    expect(text(half.student)).not.toContain('rastgele seçen birinin de bulabileceği');

    const reversed = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.mirrors, rtMs: 15_000 })),
    );
    expect(reversed.student.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 15 saniye']);
    expect(reversed.student.items[0].text).toContain('Yönergeyi ters anlamış');
    expect(reversed.student.items[1].text).toBe('Yönerge ters anlaşılmış olabileceği için iki bölüm karşılaştırılmadı.');
    expect(reversed.student.items[2].text).toContain('20 yanlış cevabının hepsinde iki ayna görüntüsünü birden seçtin');
    expect(reversed.parent.items[0].text).toContain('Yönerge ters anlaşılmış');
    expect(reversed.student.cautions.join(' ')).toContain('döndürülmüş şekiller yerine ayna görüntüleri aranmış olabilir');
    expect(reversed.student.cautions.join(' ')).not.toContain('rastgele seçen birinin de bulabileceği');

    const depth = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.i < 13 ? q.answer : q.mirrors, rtMs: 15_000 })),
    );
    expect(depth.student.items[2].badge).toBe('İki ayna görüntüsü birden: 7 soru');
    expect(depth.student.items[2].text).toContain('Doğru bulamadığın 7 sorunun hepsinde iki ayna görüntüsünü birden seçtin');
    expect(depth.student.items[2].text).toContain('şeklin derinliğini ters görmüş olabilirsin');
    expect(depth.student.items[2].text).toContain('bir uçtaki kolu ve ona bağlı kolu');
    expect(depth.student.items[0].text).toContain('ayna görüntüleri kartına bak.');
    expect(depth.student.cautions.join(' ')).toContain('hangi kolun öne, hangisinin arkaya uzandığı ters görülmüş olabilir');

    const part2 = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.part === 1 || q.i >= 16 ? q.answer : r3Half(q), rtMs: 15_000 })),
    );
    // Bölümlerin sayıları kartın grafiğindedir; metinde yinelenmez.
    expect(part2.student.items[1].badge).toBe('2. bölümde daha az doğru');
    expect(part2.student.items[1].visual?.type === 'bars' ? part2.student.items[1].visual.rows.map((x) => x.valueLabel) : []).toEqual(['10/10', '4/10']);
    expect(part2.student.items[1].text).toBe(
      'Yalnızca dik eksen çevresinde döndürülmüş şekillerde (1. bölüm), yan yatırılmış şekillerdekinden (2. bölüm) daha çok soruyu doğru buldun. Yan yatırılmış şekillerde iki dönüşü birlikte izlemek gerekir. Bazı çalışmalarda birden çok yönde döndürülmüş şekiller daha zor bulunmuştur. Her bölüm 10 soruya dayanır; bu karşılaştırma kaba bir göstergedir.',
    );
    expect(part2.parent.items[1].text).toContain('Çocuğunuz yalnızca dik eksen çevresinde döndürülmüş şekillerde (1. bölüm)');
    expect(part2.student.items[2].badge).toBe('Yanlışların hepsinde bir doğru şekil');
    expect(part2.student.items[2].text).toContain('Doğru bulamadığın 6 sorunun hepsinde iki şekilden birini doğru seçtin');

    const part1 = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.part === 2 || q.i >= 6 ? q.answer : r3Half(q), rtMs: 15_000 })),
    );
    expect(part1.student.items[1].badge).toBe('2. bölümde daha çok doğru');
    expect(part1.student.items[1].text).toContain('sorulara alışmak zaman alabilir');

    const rapid = evaluate(
      SLUG,
      rotation3dBody((q) => (q.i < 6 ? { response: r3Half(q), rtMs: 1500 } : { response: q.answer, rtMs: 15_000 })),
    );
    expect(rapid.student.cautions.join(' ')).toContain('20 sorunun 6 tanesinde yanlış bir cevap 4 saniyeden kısa sürede verilmiş');
    expect(rapid.student.items[3].text).toContain('20 sorunun 6 tanesinde 4 saniyeden kısa sürede yanlış cevap verdin.');
    expect(rapid.student.items[2].badge).toBe('Yorumlanmadı');
    expect(rapid.student.items[0].text).toContain('şekillere bakmadan seçmiş olabileceğin');
    expect(rapid.student.items[1].badge).toBe('Yorumlanmadı');
    expect(rapid.student.items[1].visual).toBeUndefined();
    expect(rapid.student.items[1].text).toContain('iki bölüm arasındaki fark yorumlanmadı');

    // Sık iki ayna ama bazı cevaplar çok hızlı: ayna kartı yorumlamaz, doğru cevaplar kartı ona yönlendirmez, uyarı derinlikten söz etmez.
    const mixedDoubt = evaluate(
      SLUG,
      rotation3dBody((q) => (q.i < 13 ? { response: q.answer, rtMs: 15_000 } : { response: q.mirrors, rtMs: 2000 })),
    );
    expect(mixedDoubt.student.items[2].badge).toBe('Yorumlanmadı');
    expect(mixedDoubt.student.items[0].text).not.toContain('ayna görüntüleri kartına');
    expect(mixedDoubt.student.cautions.join(' ')).not.toContain('arkaya uzandığı ters görülmüş');
    expect(mixedDoubt.student.cautions.join(' ')).toContain('4 saniyeden kısa');

    // Hep iki ayna ama hepsi çok hızlı: "yönerge ters anlaşılmış" denmez, sonuç rastgele düzeyinde sayılır.
    const reversedDoubt = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: q.mirrors, rtMs: 2000 })),
    );
    expect(reversedDoubt.student.items.slice(0, 3).map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    const rdCautions = reversedDoubt.student.cautions.join(' ');
    expect(rdCautions).not.toContain('ayna görüntüleri aranmış');
    expect(rdCautions).toContain('rastgele seçen birinin de bulabileceği');
    expect(rdCautions).toContain('20 sorunun hepsinde yanlış bir cevap 4 saniyeden kısa sürede verilmiş');
    expect(reversedDoubt.student.items[3].text).toContain('20 sorunun hepsinde 4 saniyeden kısa sürede yanlış cevap verdin.');

    const same = evaluate(
      SLUG,
      rotation3dBody(() => ({ response: [1, 2], rtMs: 9000 })),
    );
    expect(same.student.items[3].text).toContain('Bütün cevaplarında aynı yerdeki iki seçeneği seçtin');
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafik birbiriyle çelişmez', () => {
    type Pattern = (q: Rotation3dCell) => boolean;
    const correctness: Record<string, Pattern> = {
      hepsi: () => true,
      hicbiri: () => false,
      birinciBolum: (q) => q.part === 1,
      ikinciBolum: (q) => q.part === 2,
      altiDogru: (q) => q.i < ROTATION3D_CHANCE_MAX,
      yediDogru: (q) => q.i < ROTATION3D_CHANCE_MAX + 1,
      cift: (q) => q.i % 2 === 0,
      onUc: (q) => q.i < 13,
    };
    const wrongKinds: Record<string, (q: Rotation3dCell) => number[]> = {
      yarim: (q) => r3Half(q, q.i),
      ayna: (q) => q.mirrors,
      karisik: (q) => (q.i % 3 === 0 ? q.mirrors : r3Half(q, q.i)),
    };
    const times: Record<string, (q: Rotation3dCell, right: boolean) => number | null> = {
      artan: (q) => (q.part === 1 ? 12_000 : 18_000),
      hizli: (_, right) => (right ? 10_000 : 2000),
      esit: () => 15_000,
      yok: () => null,
    };
    let n = 0;
    for (const [cName, correct] of Object.entries(correctness)) {
      for (const [wName, wrong] of Object.entries(wrongKinds)) {
        for (const [tName, rt] of Object.entries(times)) {
          for (const samePair of [false, true]) {
            const body = rotation3dBody(
              (q) => ({ response: samePair ? [1, 2] : correct(q) ? q.answer : wrong(q), rtMs: rt(q, samePair ? false : correct(q)) }),
              8,
            );
            const label = `${cName}/${wName}/${tName}/${samePair}`;
            const res = evaluate(SLUG, body);
            const result: Rotation3dResult = scoreRotation3d(task, trialsOf(body)).result;
            const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
            const mirrorPick = rotation3dMirrorPick(result);
            const doubt = rotation3dRapid(result) || rotation3dSamePair(result);
            // Bazı sorularda bakmadan seçilmiş olabilirse "yönerge ters anlaşılmış" yorumu yapılmaz; sonuç rastgele düzeyinde sayılır.
            const reversed = mirrorPick && result.correct <= ROTATION3D_CHANCE_MAX && !doubt;
            // Çoğu soruda bir doğru, bir ayna: rastgele seçim sayılmaz, yönerge farklı anlaşılmış olabilir.
            const halfPick = !reversed && rotation3dHalfPick(result);
            const chance = result.correct <= ROTATION3D_CHANCE_MAX && !reversed && !halfPick;
            const notRead = reversed || halfPick || chance;
            const wrongN = result.n - result.correct;
            const [p1, p2] = result.parts;
            for (const r of [res.student, res.parent, adult]) {
              const t = text(r);
              expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \./);
              expect(
                r.items.map((i) => i.title),
                label,
              ).toEqual(TITLES);
              for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
              // Yorumlanmayan sonucun rozeti ve grafiği yorumlanmış gibi görünmez.
              expect(r.items[0].badge, label).toBe(notRead ? 'Yorumlanmadı' : `20 soruda ${result.correct} doğru`);
              expect(r.items[0].visual === undefined, label).toBe(notRead);
              expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(notRead || doubt);
              expect(r.items[1].visual === undefined, label).toBe(notRead || doubt);
              const ayna = r.items[2].badge!;
              if (notRead) expect(ayna, label).toBe('Yorumlanmadı');
              else if (mirrorPick && !doubt && wrongN > 0) expect(ayna, label).toBe(`İki ayna görüntüsü birden: ${result.none} soru`);
              else if (wrongN === 0) expect(ayna, label).toBe('Ayna görüntüsü seçilmedi');
              else if (doubt) expect(ayna, label).toBe('Yorumlanmadı');
              else expect(ayna, label).toBe(rotation3dMixHeadline(result));
              // Ayna kartının "çoğunda/hepsinde" sözleri sayılarla uyuşur.
              if (/çoğunda bir doğru/.test(ayna)) expect(result.half > result.none, label).toBe(true);
              if (/çoğunda iki ayna/.test(ayna)) expect(result.none > result.half, label).toBe(true);
              if (reversed) expect(r.items[2].text, label).toMatch(new RegExp(`${wrongN} yanlış cevabının (hepsinde|${result.none} tanesinde)`));
              expect(r.roadmap!.bars, label).toEqual([]);
              const cautions = r.cautions.join(' ');
              expect(cautions.includes('rastgele seçen birinin de bulabileceği'), label).toBe(chance);
              expect(cautions.includes('ayna görüntüleri aranmış olabilir'), label).toBe(reversed);
              expect(cautions.includes('bir döndürülmüş şekil ile bir ayna görüntüsü seçilmiş'), label).toBe(halfPick);
              expect(cautions.includes('arkaya uzandığı ters görülmüş'), label).toBe(mirrorPick && !reversed && !doubt);
              const rapidNote = cautions.includes('4 saniyeden kısa');
              expect(rapidNote, label).toBe(rotation3dRapid(result));
              expect(r.items[3].text.includes('4 saniyeden kısa'), label).toBe(rapidNote);
              const sameNote = cautions.includes('aynı yerdeki iki seçenek seçilmiş');
              expect(sameNote, label).toBe(rotation3dSamePair(result));
              expect(/aynı yerdeki iki seçeneği seçt/.test(r.items[3].text), label).toBe(sameNote);
              // Bakmadan seçilmiş olabilirse ya da bölümler karşılaştırılmadıysa süreler de karşılaştırılmaz.
              if (doubt || notRead) expect(r.items[3].text, label).not.toMatch(/zaman ayırd|yakın süreler|hızlanmış/);
              if (!notRead) {
                expect(/şekillere bakmadan seçmiş|şekillere bakılmadan seçilmiş/.test(r.items[0].text), label).toBe(doubt);
                expect(r.items[0].text.includes('ayna görüntüleri kartına'), label).toBe(mirrorPick && !doubt);
                const partRows = r.items[1].visual?.type === 'bars' ? r.items[1].visual.rows.map((x) => x.valueLabel) : [];
                expect(partRows, label).toEqual(doubt ? [] : [`${p1.correct}/10`, `${p2.correct}/10`]);
                const gap = p1.correct - p2.correct;
                expect(r.items[1].badge, label).toBe(
                  doubt
                    ? 'Yorumlanmadı'
                    : gap >= ROTATION3D_PART_GAP
                      ? '2. bölümde daha az doğru'
                      : gap <= -ROTATION3D_PART_GAP
                        ? '2. bölümde daha çok doğru'
                        : p1.correct === 10 && p2.correct === 10
                          ? 'İki bölümde de hepsi doğru'
                          : 'İki bölümde yakın sonuç',
                );
                // Bakmadan seçilmiş olabilirse bölüm farkı açıklanmaz; grafik olmadığı için sayılar metindedir.
                if (doubt) {
                  expect(r.items[1].text, label).not.toMatch(/iki dönüşü birlikte|alışmak zaman|çoğunlukla bulabil/);
                  expect(r.items[1].text, label).toContain('fark yorumlanmadı');
                  expect(r.items[1].text, label).toContain('1. bölümde');
                } else {
                  // Sayılar kartın grafiğinde olduğu için metinde yinelenmez.
                  expect(r.items[1].text, label).not.toMatch(/sorunun (hepsinde|\d+ tanesinde|hiçbirinde)/);
                }
                // Ayna kartındaki sayılar sonuçla aynıdır.
                if (wrongN > 0 && !doubt) expect(r.items[2].text, label).toContain(`${wrongN} soru`);
              }
              // Doğru seçilen şekil sayısı öne çıkan sayılarda ve (hepsi doğru değilse) kartta aynıdır.
              expect(r.keyFigures.find((f) => f.label === 'Doğru seçilen şekiller')!.value, label).toBe(notRead ? 'Yorumlanmadı' : `${result.figures}/40`);
              expect(r.keyFigures.find((f) => f.label === 'Doğru')!.value, label).toBe(notRead ? 'Yorumlanmadı' : `${result.correct}/20`);
              if (!notRead && result.correct < 20) expect(r.items[0].text, label).toContain(`40 şeklin ${result.figures} tanesi`);
              if (result.correct === 20) expect(r.items[0].text, label).toMatch(/[Ss]oruların hepsinde/);
              if (notRead) expect(r.chart, label).toBeNull();
              else expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual([`${p1.correct}/10`, `${p2.correct}/10`]);
            }
            expect(text(res.student), label).not.toContain('Çocuğunuz');
            expect(text(adult), label).not.toContain('Çocuğunuz');
            expect(text(res.parent), label).not.toMatch(
              /\b(buldun|verdin|cevapladın|zorlandın|seçtin|bulamadın|ayırdın|ayırabildin|olabilirsin|olabileceğin|anlamış|aramış)\b|bak\./,
            );
            expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
            n++;
          }
        }
      }
    }
    expect(n).toBe(8 * 3 * 4 * 2);
  }, 400_000);

  it('5. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, rotation3dBody(undefined, 4))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, rotation3dBody(undefined, ADULT_GRADE));
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
        [
          ucBoyutluZihindeDondurme.intro.title,
          ...ucBoyutluZihindeDondurme.intro.paragraphs,
          ...task.instructions,
          ...task.practice.map((p) => p.explain),
          ...task.parts.flatMap((p) => [p.name, p.intro]),
        ].join(' '),
      ),
    ).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /UD_GOVDE=.*?s=(\[\[[\d, [\]]+\]\])/.exec(yml);
    expect(JSON.parse(m![1])).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      rotation3dBody((q) => ({ response: (JSON.parse(m![1]) as number[][])[q.i], rtMs: 8000 + 500 * q.i })),
    );
    expect(r.student.items[0].badge).toBe('20 soruda 20 doğru');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(2);
    expect(r.parent.roadmap!.bars).toHaveLength(0);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/ud_sayfa[\s\S]*\\"answers\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, rotation3dBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, rotation3dBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(ucBoyutluZihindeDondurme.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(ucBoyutluZihindeDondurme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(ucBoyutluZihindeDondurme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({ ...ucBoyutluZihindeDondurme.science, citations: [] });
    for (const a of [
      'Caissie ve ark., 2009',
      'Frick ve Pichelmann, 2023',
      'Ganis ve Kievit, 2015',
      'Gilligan ve ark., 2020',
      'Jansen ve ark., 2019',
      'Jost ve Jansen, 2024',
      'Peters ve ark., 1995',
      'Rajeb ve ark., 2025',
      'Shepard ve Metzler’in (1971)',
      'Shepard ve Metzler, 1971',
      'Timm ve ark., 2024',
      'Uttal ve ark., 2013',
      'Vandenberg ve Kuse, 1978',
    ])
      expect(body, a).toContain(a);
    expect(ucBoyutluZihindeDondurme.science.citations.map((c) => c.text.split(',')[0])).toEqual([
      'Caissie',
      'Frick',
      'Ganis',
      'Gilligan',
      'Jansen',
      'Jost',
      'Peters',
      'Rajeb',
      'Shepard',
      'Timm',
      'Uttal',
      'Vandenberg',
    ]);
    // Yol haritasının kaynakları DOI bağlantılıdır ve testin bilim kartında da yer alır.
    const sci = ucBoyutluZihindeDondurme.science.citations.map((c) => c.url);
    for (const s of TASK_ROADMAPS[SLUG].sources) expect(sci, s.text).toContain(s.url);
  });
});
