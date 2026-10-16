import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { bakisAcisiAlma } from '@/content/instruments/bakis-acisi-alma';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import {
  PA_CLOSE,
  PA_EGO_MIN_SHIFT,
  PA_SMALL_MAX,
  PA_ZONE,
  angleDiff,
  correctAngle,
  dialAngle,
  egocentricAngle,
  explainText,
  headingOf,
  mirrorAngle,
  normDeg,
  questionText,
  sectorWords,
  shiftBin,
  turnBy,
} from '@/lib/instruments/perspective';
import type { PerspectiveItem, PerspectiveTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { PA_GAP } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  PA_CHANCE_MEAN,
  PA_PATTERN_MIN,
  PA_RAPID_MS,
  PA_SAME_DIR,
  TaskInputError,
  perspectiveChance,
  perspectiveDoubt,
  perspectiveEgo,
  perspectiveMirror,
  perspectivePatternHigh,
  perspectiveRapid,
  perspectiveSameDir,
  scorePerspective,
  type PerspectiveResult,
  type PerspectiveTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { perspectiveBody, type PerspectiveCell } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'bakis-acisi-alma';
const task = bakisAcisiAlma.tasks[0] as PerspectiveTask;
const O = task.objects;
const TITLES = ['Yön gösterme isabeti', 'Küçük ve büyük dönüşler', 'Hata türleri', 'Çalışma biçimi'];

/* ---------- Bağımsız hesap: açılar vektörlerle (atan2 ile değil, iç ve dış çarpımla) ---------- */

type P = { x: number; y: number };
const vec = (a: P, b: P) => ({ x: b.x - a.x, y: b.y - a.y });
const len = (v: P) => Math.hypot(v.x, v.y);
/** `u`dan `v`ye ekranda saat yönündeki işaretli açı (y aşağı doğru büyür): dış çarpım pozitifse saat yönü. */
function turn(u: P, v: P): number {
  const dot = u.x * v.x + u.y * v.y;
  const cross = u.x * v.y - u.y * v.x;
  return (Math.atan2(cross, dot) * 180) / Math.PI;
}
const UP = { x: 0, y: -1 };
/** Bağımsız hesap: zihinde dönülecek açı, doğru yön, haritaya göre yön ve sağ-sol karışıklığının yönü. */
function check(item: PerspectiveItem) {
  const f = vec(O[item.at], O[item.facing]);
  const t = vec(O[item.at], O[item.target]);
  const shift = turn(UP, f);
  const correct = turn(f, t);
  const ego = turn(UP, t);
  return { shift, correct, ego, mirror: -correct };
}
/** Bir noktanın bir doğru parçasına uzaklığı. */
function segDist(p: P, a: P, b: P): number {
  const d = vec(a, b);
  const k = Math.max(0, Math.min(1, ((p.x - a.x) * d.x + (p.y - a.y) * d.y) / (d.x * d.x + d.y * d.y)));
  return Math.hypot(p.x - a.x - k * d.x, p.y - a.y - k * d.y);
}
const circ = (a: number, b: number) => Math.abs(((((a - b) % 360) + 540) % 360) - 180);

const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const trialsOf = (body: ReturnType<typeof perspectiveBody>) => (body.data as { blocks: Record<string, PerspectiveTrialInput[]> }).blocks[task.key];
const score = (body: ReturnType<typeof perspectiveBody>) => scorePerspective(task, trialsOf(body)).result;
const nfDeg = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
const deg = (x: number) => `${nfDeg.format(x)} derece`;

/** Üreticinin bulduğu açılar (derece, bir ondalık): sorular değişirse bağımsız hesapla birlikte güncellenir. */
const EXPECTED: [shift: number, correct: number][] = [
  [-5, 47],
  [-60.9, -52],
  [103.1, 104.3],
  [16.7, -39.6],
  [-163.3, 33.3],
  [67, -72.1],
  [-98.7, -104.1],
  [175, -147.5],
  [-53.8, 135.5],
  [-84.8, 101.5],
  [119.1, -91.6],
  [152.9, 54.5],
];

describe('Bakış açısı alma: harita ve sorular', () => {
  it('yedi nesne: adları ve ekleri doğru, birbirinden en az 24 birim uzak, haritanın içinde', () => {
    expect(O.map((o) => o.name)).toEqual(['Ağaç', 'Çeşme', 'Lamba', 'Kova', 'Saksı', 'Top', 'Kaya']);
    expect(O.map((o) => [o.gen, o.dat])).toEqual([
      ['ağacın', 'ağaca'],
      ['çeşmenin', 'çeşmeye'],
      ['lambanın', 'lambaya'],
      ['kovanın', 'kovaya'],
      ['saksının', 'saksıya'],
      ['topun', 'topa'],
      ['kayanın', 'kayaya'],
    ]);
    expect(new Set(O.map((o) => o.key)).size).toBe(7);
    for (const o of O) {
      expect(o.x, o.name).toBeGreaterThanOrEqual(10);
      expect(o.x, o.name).toBeLessThanOrEqual(92);
      expect(o.y, o.name).toBeGreaterThanOrEqual(10);
      expect(o.y, o.name).toBeLessThanOrEqual(85);
    }
    for (let i = 0; i < O.length; i++)
      for (let j = i + 1; j < O.length; j++) expect(len(vec(O[i], O[j])), `${O[i].name}-${O[j].name}`).toBeGreaterThanOrEqual(24);
  });

  it('açılar bağımsız bir hesapla (iç ve dış çarpım) aynı çıkar; üreticinin bulduğu açılarla aynıdır', () => {
    const all = [task.example, ...task.practice, ...task.items];
    for (const item of all) {
      const c = check(item);
      expect(circ(headingOf(O, item), c.shift), JSON.stringify(item)).toBeLessThan(1e-9);
      expect(circ(correctAngle(O, item), c.correct)).toBeLessThan(1e-9);
      expect(circ(egocentricAngle(O, item), c.ego)).toBeLessThan(1e-9);
      expect(circ(mirrorAngle(O, item), c.mirror)).toBeLessThan(1e-9);
      // Haritaya göre yön, doğru yönün bakış açısı kadar döndürülmüşüdür.
      expect(circ(c.ego, c.correct + c.shift)).toBeLessThan(1e-9);
    }
    expect(task.items.map((it) => [Math.round(headingOf(O, it) * 10) / 10, Math.round(correctAngle(O, it) * 10) / 10])).toEqual(EXPECTED);
  });

  it('12 soru: üç nesne farklı; çizgiler en az 28 birim; öteki nesneler çizgilerden en az 9 birim uzak; doğru yön tam önde ya da arkada değil', () => {
    expect(task.items).toHaveLength(12);
    for (const [k, item] of [task.example, ...task.practice, ...task.items].entries()) {
      const { at, facing, target } = item;
      expect(new Set([at, facing, target]).size, `${k}`).toBe(3);
      expect(len(vec(O[at], O[facing])), `${k}`).toBeGreaterThanOrEqual(28);
      expect(len(vec(O[at], O[target])), `${k}`).toBeGreaterThanOrEqual(28);
      for (let o = 0; o < O.length; o++) {
        if (o === at || o === facing || o === target) continue;
        expect(segDist(O[o], O[at], O[facing]), `${k} ${O[o].name}`).toBeGreaterThanOrEqual(9);
        expect(segDist(O[o], O[at], O[target]), `${k} ${O[o].name}`).toBeGreaterThanOrEqual(9);
      }
      const c = Math.abs(check(item).correct);
      expect(c, `${k}`).toBeGreaterThanOrEqual(30);
      expect(c, `${k}`).toBeLessThanOrEqual(150);
    }
  });

  it('dönüşler: gruplarda 2, 4, 3, 3 soru; altı küçük, altı büyük; bakış altı soruda sağa, altısında sola döner; ilk soru en kolay gruptan', () => {
    const shifts = task.items.map((it) => check(it).shift);
    expect([0, 1, 2, 3].map((b) => shifts.filter((s) => shiftBin(s) === b).length)).toEqual([2, 4, 3, 3]);
    expect(shifts.filter((s) => Math.abs(s) <= PA_SMALL_MAX)).toHaveLength(6);
    expect(shifts.filter((s) => s > 0)).toHaveLength(6);
    expect(shiftBin(shifts[0])).toBe(0);
    // Hiçbir dönüş grup sınırına 5 dereceden yakın değil (sınırdaki bir soru grubunu belirsizleştirir).
    for (const s of shifts) for (const edge of [45, 90, 135]) expect(Math.abs(Math.abs(s) - edge), `${s}`).toBeGreaterThanOrEqual(5);
    // Küçük ve büyük dönüşler karışık: art arda üç soru aynı grupta değil.
    const small = shifts.map((s) => Math.abs(s) <= PA_SMALL_MAX);
    for (let i = 2; i < small.length; i++) expect(small[i] === small[i - 1] && small[i] === small[i - 2], `${i}`).toBe(false);
  });

  it('doğru cevaplar dengeli: 3 sağ ön, 3 sağ arka, 3 sol ön, 3 sol arka', () => {
    const quad = (c: number) => (c > 0 ? (c < 90 ? 'sağ ön' : 'sağ arka') : c > -90 ? 'sol ön' : 'sol arka');
    const counts: Record<string, number> = {};
    for (const it of task.items) {
      const q = quad(check(it).correct);
      counts[q] = (counts[q] ?? 0) + 1;
    }
    expect(counts).toEqual({ 'sağ ön': 3, 'sağ arka': 3, 'sol ön': 3, 'sol arka': 3 });
  });

  it('hata türleri ayırt edilebilir: dönüşü en az 45 derece olan 10 soruda doğru yön, haritaya göre yön ve sağ-sol karışıklığı birbirinden en az 45 derece uzak', () => {
    const eligible = task.items.filter((it) => Math.abs(check(it).shift) >= PA_EGO_MIN_SHIFT);
    expect(eligible).toHaveLength(10);
    for (const it of task.items) {
      const c = check(it);
      // Sağ-sol karışıklığı doğru yönden 2 × |doğru yön| kadar uzaktır: en az 60 derece.
      expect(circ(c.mirror, c.correct), JSON.stringify(it)).toBeGreaterThanOrEqual(60);
      if (Math.abs(c.shift) < PA_EGO_MIN_SHIFT) continue;
      expect(circ(c.ego, c.correct), JSON.stringify(it)).toBeGreaterThanOrEqual(45);
      expect(circ(c.ego, c.mirror), JSON.stringify(it)).toBeGreaterThanOrEqual(45);
    }
    // Bölgeler (±20 derece) birbirine değmediği için bir cevap iki türe birden sayılamaz.
    expect(2 * PA_ZONE).toBeLessThan(45);
  });

  it('soru düzeni: art arda iki soruda aynı nesnenin yanında durulmaz; aynı durma-bakma çifti iki kez yok; yer değiştirmiş soru yok; örnek ve alıştırmalar asıl sorulardan farklı', () => {
    for (let i = 1; i < task.items.length; i++) expect(task.items[i].at, `${i}`).not.toBe(task.items[i - 1].at);
    const pair = (it: PerspectiveItem) => `${it.at}-${it.facing}`;
    expect(new Set(task.items.map(pair)).size).toBe(12);
    for (const a of task.items)
      for (const b of task.items) if (a !== b && a.at === b.at) expect(a.facing === b.target && a.target === b.facing, `${pair(a)} ${pair(b)}`).toBe(false);
    const test = new Set(task.items.map(pair));
    for (const it of [task.example, ...task.practice]) expect(test.has(pair(it)), pair(it)).toBe(false);
    expect(new Set([task.example, ...task.practice].map(pair)).size).toBe(4);
    // Alıştırmalar küçük, orta ve büyük dönüşü gösterir.
    expect(task.practice.map((it) => shiftBin(check(it).shift))).toEqual([0, 1, 3]);
  });

  it('soru ve açıklama cümleleri doğru eklerle yazılır; yön sözcükleri sekiz dilime göre', () => {
    expect(questionText(O, task.items[0])).toBe('Kovanın yanında durup topa doğru baktığını hayal et. Lamba hangi yönde?');
    expect(explainText(O, task.example)).toBe('Kayanın yanında durup çeşmeye doğru baktığında kova solunda kalır.');
    expect(explainText(O, task.practice[2])).toBe('Lambanın yanında durup kovaya doğru baktığında top sağ önünde kalır.');
    // 111 derece solda: sol arkadan çok sola yakın.
    expect(explainText(O, task.practice[1])).toBe('Kayanın yanında durup ağaca doğru baktığında top solunda kalır.');
    expect([0, 22, 23, 45, 90, 135, 158, 180, -180, -170, -135, -90, -45, -23].map((a) => sectorWords(a))).toEqual([
      'tam önünde',
      'tam önünde',
      'sağ önünde',
      'sağ önünde',
      'sağında',
      'sağ arkanda',
      'tam arkanda',
      'tam arkanda',
      'tam arkanda',
      'tam arkanda',
      'sol arkanda',
      'solunda',
      'sol önünde',
      'sol önünde',
    ]);
    expect([normDeg(190), normDeg(-180), normDeg(540), angleDiff(170, -170), angleDiff(-90, 90)]).toEqual([-170, 180, 180, 20, 180]);
  });

  it('metinler: yetişkinlerin de gördüğü yönerge ve tanıtımda okula özgü sözcük yok; harita ve sorular sabit (değişirse sürüm artırılmalı)', () => {
    expect(schoolWords([bakisAcisiAlma.intro.title, ...bakisAcisiAlma.intro.paragraphs, task.measures, ...task.instructions].join(' '))).toEqual([]);
    const runner = readFileSync(new URL('../src/components/runner/tasks/perspective.tsx', import.meta.url), 'utf8');
    expect(schoolWords(runner.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''))).toEqual([]);
    const hash = createHash('sha256')
      .update(JSON.stringify({ objects: task.objects, example: task.example, practice: task.practice, items: task.items }))
      .digest('hex')
      .slice(0, 16);
    expect({ version: bakisAcisiAlma.version, hash }).toEqual({ version: 1, hash: HARITA_IZI });
  });
});

/** Haritanın ve soruların izi (sürüm 1): bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const HARITA_IZI = '36521c3fdc517167';

/* ---------- Puanlama ---------- */

/** Irwin–Hall dağılımı: n tane [0, 1] eşit dağılımlı sayının toplamının x'ten küçük olma olasılığı. */
function irwinHall(n: number, x: number): number {
  let s = 0;
  let fact = 1;
  for (let i = 2; i <= n; i++) fact *= i;
  for (let k = 0; k <= Math.floor(x); k++) {
    let c = 1;
    for (let j = 0; j < k; j++) c = (c * (n - j)) / (j + 1);
    s += (k % 2 ? -1 : 1) * c * (x - k) ** n;
  }
  return s / fact;
}
const binomTail = (n: number, k: number, p: number) => {
  let s = 0;
  for (let i = k; i <= n; i++) {
    let c = 1;
    for (let j = 0; j < i; j++) c = (c * (n - j)) / (j + 1);
    s += c * p ** i * (1 - p) ** (n - i);
  }
  return s;
};
/** Sabit tohumlu sözde rastgele sayılar (0–1). */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

describe('Bakış açısı alma: puanlama', () => {
  it('hatasız: ortalama hata 0, 12 soru doğru yöne yakın, hata türü yok', () => {
    const r = score(perspectiveBody((q) => ({ deg: q.correct, rtMs: 10_000 })));
    expect(r.meanError).toBe(0);
    expect(r.close).toBe(12);
    expect([r.ego.count, r.mirror.count, r.ego.eligible, r.mirror.eligible]).toEqual([0, 0, 10, 12]);
    expect(r.small).toEqual({ n: 6, meanError: 0 });
    expect(r.large).toEqual({ n: 6, meanError: 0 });
    expect(r.bins.map((b) => [b.from, b.to, b.n])).toEqual([
      [0, 45, 2],
      [45, 90, 4],
      [90, 135, 3],
      [135, 180, 3],
    ]);
    expect(r.medianRt).toBe(10_000);
    expect([r.rapid, r.answered]).toEqual([0, 12]);
    // Doğru cevaplar kendi aralarında kümelenmez: hep aynı yön sayılmaz.
    expect(r.sameDir).toBeLessThan(PA_SAME_DIR);
  });

  it('hata: gösterilen yönle doğru yön arasındaki kısa açı; cevapsız soru 90 derece; 180 dereceyi geçmez', () => {
    let r = score(perspectiveBody((q) => ({ deg: normDeg(q.correct + 30), rtMs: 9000 })));
    expect(r.meanError).toBeCloseTo(30, 5);
    expect(r.close).toBe(0);
    r = score(perspectiveBody((q) => ({ deg: normDeg(q.correct + 180), rtMs: 9000 })));
    expect(r.meanError).toBe(180);
    r = score(perspectiveBody((q) => ({ deg: q.i < 3 ? null : q.correct, rtMs: 9000 })));
    expect(r.answered).toBe(9);
    expect(r.meanError).toBe(22.5);
    expect(r.items.slice(0, 3).map((x) => [x.error, x.ego, x.mirror])).toEqual([
      [90, false, false],
      [90, false, false],
      [90, false, false],
    ]);
  });

  it('haritaya göre yön ve sağ-sol karışıklığı ayrı sayılır; haritaya göre yön yalnızca dönüşü en az 45 derece olan sorularda', () => {
    let r = score(perspectiveBody((q) => ({ deg: q.ego, rtMs: 9000 })));
    expect(r.ego.count).toBe(10);
    expect(r.mirror.count).toBe(0);
    expect(r.meanError).toBeGreaterThan(PA_CHANCE_MEAN);
    expect(perspectivePatternHigh(r) && perspectiveEgo(r) && !perspectiveChance(r)).toBe(true);
    r = score(perspectiveBody((q) => ({ deg: q.mirror, rtMs: 9000 })));
    expect([r.ego.count, r.mirror.count]).toEqual([0, 12]);
    expect(perspectivePatternHigh(r) && perspectiveMirror(r)).toBe(true);
    // ±20 derece içindeki cevap sayılır, dışındaki sayılmaz.
    r = score(perspectiveBody((q) => ({ deg: normDeg(q.mirror + (q.i % 2 ? 19 : -19)), rtMs: 9000 })));
    expect(r.mirror.count).toBe(12);
    r = score(perspectiveBody((q) => ({ deg: normDeg(q.mirror + 21), rtMs: 9000 })));
    expect(r.mirror.count).toBe(0);
  });

  it('çok hızlı yanlışlar ve hep aynı yön sayılır', () => {
    let r = score(perspectiveBody((q) => ({ deg: q.i < 3 ? normDeg(q.correct + 90) : q.correct, rtMs: q.i < 3 ? PA_RAPID_MS - 1 : 9000 })));
    expect(r.rapid).toBe(3);
    expect(perspectiveRapid(r)).toBe(true);
    // Çok hızlı ama isabetli cevap sayılmaz.
    r = score(perspectiveBody((q) => ({ deg: q.correct, rtMs: 1000 })));
    expect(r.rapid).toBe(0);
    r = score(perspectiveBody((q) => ({ deg: q.i < 8 ? 30 + q.i : q.correct, rtMs: 9000 })));
    expect(r.sameDir).toBeGreaterThanOrEqual(8);
    expect(perspectiveSameDir(r)).toBe(true);
  });

  it('cevapsız sorular çok hızlı yanlış sayılmaz; hep aynı yön −180/180 sınırında da bulunur; sınırdaki ortalama hata', () => {
    let r = score(perspectiveBody((q) => ({ deg: q.i < 4 ? null : q.correct, rtMs: q.i < 4 ? 500 : 9000 })));
    expect([r.rapid, r.answered, r.rest.n]).toEqual([0, 8, 12]);
    expect(perspectiveRapid(r)).toBe(false);
    r = score(perspectiveBody((q) => ({ deg: q.i < 8 ? (q.i % 2 ? 176 : -176) : q.correct, rtMs: 9000 })));
    expect(r.sameDir).toBeGreaterThanOrEqual(8);
    // 30 derecelik dilimin dışına taşan cevaplar sayılmaz.
    r = score(perspectiveBody((q) => ({ deg: q.i < 8 ? (q.i % 2 ? 16 : -16) : q.correct, rtMs: 9000 })));
    expect(r.sameDir).toBeLessThan(8);
    // Ortalama hata tam 65 derece: rastgele düzeyi sayılmaz; 65,1: sayılır (hata türü yoksa).
    r = score(perspectiveBody((q) => ({ deg: normDeg(q.correct + (q.i % 2 ? 65 : -65)), rtMs: 9000 })));
    expect(r.meanError).toBe(65);
    expect(perspectiveChance(r) || perspectivePatternHigh(r)).toBe(false);
    r = score(perspectiveBody((q) => ({ deg: normDeg(q.correct + (q.i % 2 ? 65.1 : -65.1)), rtMs: 9000 })));
    expect(r.meanError).toBe(65.1);
    expect(perspectiveChance(r) || perspectivePatternHigh(r)).toBe(true);
  });

  it('yüksek hatayı hata türü ancak türe girmeyen cevaplar rastgele düzeyinin altındaysa açıklar', () => {
    // Uygun bütün sorularda haritaya göre yön: kalan iki sorunun hatası küçük, açıklanır.
    let r = score(perspectiveBody((q) => ({ deg: q.ego, rtMs: 9000 })));
    expect(r.rest.n).toBe(2);
    expect(r.rest.meanError).toBeLessThanOrEqual(PA_CHANCE_MEAN);
    expect(perspectivePatternHigh(r)).toBe(true);
    // Dört soruda haritaya göre yön, ötekiler tam ters: kalan sorular rastgele düzeyinin üstünde, rastgele düzeyi sayılır.
    r = score(perspectiveBody((q) => ({ deg: EGO4.has(q.i) ? q.ego : normDeg(q.correct + 180), rtMs: 9000 })));
    expect(r.ego.count).toBeGreaterThanOrEqual(4);
    expect(r.rest.meanError).toBeGreaterThan(PA_CHANCE_MEAN);
    expect([perspectivePatternHigh(r), perspectiveChance(r)]).toEqual([false, true]);
    // Aynı yolla çözen birinin oku her soruda tam o yöne düşmeyebilir: türün yönüne 45 dereceye kadar yakın cevaplar türe uyar.
    r = score(perspectiveBody((q) => ({ deg: normDeg(q.mirror + (q.i < 3 ? 25 : 0)), rtMs: 9000 })));
    expect(r.mirror.count).toBeLessThanOrEqual(9);
    expect(r.rest.n).toBe(0);
    expect([perspectivePatternHigh(r), perspectiveChance(r)]).toEqual([true, false]);
  });

  it('cevap çemberi: dokunulan noktanın yönü (0 yukarı, saat yönünde), ortaya çok yakın dokunuş yok sayılır; klavye adımı −180/180 sınırını geçer', () => {
    expect([dialAngle(0, -30), dialAngle(30, 0), dialAngle(0, 30), dialAngle(-30, 0), dialAngle(20, -20), dialAngle(-20, 20)]).toEqual([
      0, 90, 180, -90, 45, -135,
    ]);
    expect(dialAngle(3, 3)).toBeNull();
    expect(dialAngle(-0.0001, 30)).toBe(180);
    expect([turnBy(null, 5), turnBy(null, -5), turnBy(178, 5), turnBy(-178, -5), turnBy(180, 1)]).toEqual([5, -5, -177, 177, -179]);
  });

  it('aynı soru iki kez gelirse ilk cevap geçerlidir; soruların hepsi gerekir', () => {
    const body = perspectiveBody();
    const trials = trialsOf(body);
    const twice = [...trials, { index: 0, response: { deg: 0 }, rtMs: 1000 }];
    expect(scorePerspective(task, twice).result.items[0].response).toBe(trials[0].response!.deg);
    expect(() => scorePerspective(task, trials.slice(1))).toThrow(TaskInputError);
  });

  it('geçersiz girdiler reddedilir', () => {
    const trials = trialsOf(perspectiveBody());
    const bad = (t: Partial<PerspectiveTrialInput>) => [...trials.slice(1), { ...trials[0], ...t } as PerspectiveTrialInput];
    expect(() => scorePerspective(task, bad({ index: 12 }))).toThrow(TaskInputError);
    expect(() => scorePerspective(task, bad({ index: -1 }))).toThrow(TaskInputError);
    expect(() => scorePerspective(task, bad({ response: { deg: 181 } }))).toThrow(TaskInputError);
    expect(() => scorePerspective(task, bad({ response: { deg: Number.NaN } }))).toThrow(TaskInputError);
    expect(() => scorePerspective(task, bad({ rtMs: -5 }))).toThrow(TaskInputError);
    const wrongIndex = trialsOf(perspectiveBody()).map((t) => ({ ...t, index: 0 }));
    expect(() => scorePerspective(task, wrongIndex)).toThrow(TaskInputError);
    // Sunucu girdisi: derece −180–180 arasında olmalı.
    expect(() =>
      evaluate(SLUG, { ...perspectiveBody(), data: { engine: 'tasks', seed: 'x', blocks: { [task.key]: bad({ response: { deg: 200 } }) } } }),
    ).toThrow();
  });

  it('şans sınırları: 12 soruda rastgele gösterilen yönlerin ortalama hatasının 65 dereceye kadar düşme olasılığı %5’ten az, 70’e kadar düşmesininki değil; hata türü eşiği rastlantıyla %5’ten az aşılır', () => {
    const p65 = irwinHall(12, (12 * PA_CHANCE_MEAN) / 180);
    expect(p65).toBeGreaterThan(0.045);
    expect(p65).toBeLessThan(0.05);
    expect(irwinHall(12, (12 * 70) / 180)).toBeGreaterThan(0.05);
    // Benzetimle de: 20 000 rastgele kişi.
    const rnd = lcg(7);
    let low = 0;
    for (let k = 0; k < 20_000; k++) {
      let s = 0;
      for (let i = 0; i < 12; i++) s += rnd() * 180;
      if (s / 12 <= PA_CHANCE_MEAN) low++;
    }
    expect(Math.abs(low / 20_000 - p65)).toBeLessThan(0.006);
    // Rastgele bir cevabın ±20 derecelik bir bölgeye düşme olasılığı 1/9.
    expect(binomTail(10, PA_PATTERN_MIN, 1 / 9)).toBeLessThan(0.02);
    expect(binomTail(12, PA_PATTERN_MIN, 1 / 9)).toBeLessThan(0.05);
    expect(binomTail(12, PA_PATTERN_MIN - 1, 1 / 9)).toBeGreaterThan(0.05);
    // İsabetli ama dağınık cevaplar (doğru yönün ±35 derecesi) hep aynı yön sayılmaz: en kalabalık 70 derecelik dilimde 8'den az doğru yön var.
    const correct = task.items.map((it) => check(it).correct);
    for (let a = -180; a < 180; a++) expect(correct.filter((c) => circ(c, a) <= 35).length, `${a}`).toBeLessThan(PA_SAME_DIR);
  });
});

/* ---------- Rapor ---------- */

type Pick = (q: PerspectiveCell) => number | null;
const rnd12 = (seed: number) => {
  const r = lcg(seed);
  return Array.from({ length: 12 }, () => Math.round(r() * 360 - 180));
};
const RANDOM_A = rnd12(11);
const RANDOM_B = rnd12(29);
const firstEligible = (n: number) => {
  const idx = task.items.map((it, i) => (Math.abs(check(it).shift) >= PA_EGO_MIN_SHIFT ? i : -1)).filter((i) => i >= 0);
  return new Set(idx.slice(0, n));
};
const EGO4 = firstEligible(4);
const EGO6 = firstEligible(6);
const MIRROR4 = new Set(
  task.items
    .map((_, i) => i)
    .filter((i) => !EGO4.has(i))
    .slice(0, 4),
);

describe('Bakış açısı alma: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar, dönüş açısına göre grafik; uyarı yok; üç boyutlu grafik yok', () => {
    const r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: q.correct, rtMs: 14_000 })),
    );
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Yön gösterme isabeti', 'Ortalama hata 0 derece'],
      ['Küçük ve büyük dönüşler', 'İki grupta yakın hata'],
      ['Hata türleri', 'Belirgin kayma yok'],
      ['Çalışma biçimi', 'Soru başına tipik süre 14 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Ortalama hata', '0 derece'],
      ['Doğru yöne çok yakın cevaplar', '12/12'],
      ['Soru başına tipik süre', '14 saniye'],
    ]);
    expect(r.student.items[0].text).toContain('Doğru yöne çok yakın (en çok 20 derece hata): 12/12 soru.');
    expect(r.student.items[0].text).toContain('isabetle kestirebildin');
    expect(r.student.items[1].text).toContain('Kendini zihinde çok döndürmen gerektiğinde de yönleri isabetli gösterebildin.');
    expect(r.student.chart?.type === 'bars' && r.student.chart.rows.map((row) => [row.label, row.valueLabel])).toEqual([
      ['0–45 derece dönüş (2 soru)', '0°'],
      ['45–90 derece dönüş (4 soru)', '0°'],
      ['90–135 derece dönüş (3 soru)', '0°'],
      ['135–180 derece dönüş (3 soru)', '0°'],
    ]);
    expect(r.parent.roadmap!.bars).toEqual([]);
    expect(r.parent.roadmap!.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.parent)).toContain('Çocuğunuzun gösterdiği oklar doğru yöne çok yakındı');
  });

  it('durumlar: büyük dönüşlerde zorlanma, haritaya göre yön, sağ-sol karışıklığı, rastgele düzeyi, çok hızlı cevaplar', () => {
    // Büyük dönüşlerde 60 derece kayma.
    let r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: Math.abs(q.shift) > PA_SMALL_MAX ? normDeg(q.correct + 60) : q.correct, rtMs: 9000 })),
    );
    expect(r.student.items.map((i) => i.badge)).toEqual([
      'Ortalama hata 30 derece',
      'Büyük dönüşlerde daha çok hata',
      'Belirgin bir hata türü yok',
      'Soru başına tipik süre 9 saniye',
    ]);
    expect(r.student.items[1].text).toContain('Bu beklenen bir durumdur');
    expect(r.student.items[1].text).toContain('Her grup 6 soruya dayanır');

    // Haritaya göre yön (bütün uygun sorularda): yüksek hata, yönerge farklı anlaşılmış olabilir.
    r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: q.ego, rtMs: 9000 })),
    );
    expect(r.student.items[0].text).toContain('rastgele dağılmıyor');
    expect(r.student.items[1].badge).toBe('Yorumlanmadı');
    expect(r.student.items[2].badge).toBe('Haritaya yukarıdan bakar gibi: 10 soru');
    expect(r.student.items[2].text).toContain('Çemberin yukarısı her zaman baktığın nesnedir');
    expect(r.student.cautions).toHaveLength(1);
    expect(r.student.cautions[0]).toContain('haritaya yukarıdan bakar gibi');

    // Dört soruda sağ-sol karışıklığı, öteki sorular doğru: düşük hata, hata türü kartta.
    r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: MIRROR4.has(q.i) ? q.mirror : q.correct, rtMs: 9000 })),
    );
    expect(r.student.items[2].badge).toBe('Sağ ile sol karışmış olabilir: 4 soru');
    expect(r.student.items[0].text).toContain('Yanlışlarının bir kısmı belirli bir türde toplanıyor');
    expect(r.student.cautions).toEqual([]);

    // Rastgele: yorumlanmaz.
    r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: normDeg(q.correct + 180), rtMs: 9000 })),
    );
    expect(r.student.items.map((i) => i.badge)).toEqual(['Ortalama hata 180 derece', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(r.student.cautions).toHaveLength(1);
    expect(r.student.chartNote).toContain('Ortalama hata çok yüksek olduğu için');

    // Dört soruda 2 saniyede çok hatalı cevap: hata türleri ve karşılaştırma yorumlanmaz.
    r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: q.i < 4 ? normDeg(q.correct + 100) : q.correct, rtMs: q.i < 4 ? 2000 : 9000 })),
    );
    expect(r.student.items[2].badge).toBe('Yorumlanmadı');
    expect(r.student.items[1].text).toContain('iki grup arasındaki fark yorumlanmadı');
    expect(r.student.items[3].text).toContain('12 sorunun 4 tanesinde çok hatalı bir yönü (45 dereceden fazla) 3 saniyeden kısa sürede gösterdin');
    expect(r.student.cautions).toHaveLength(1);
  });

  it('bütün durum birleşimlerinde kartlar, uyarılar ve grafik birbiriyle çelişmez', () => {
    const picks: Record<string, Pick> = {
      dogru: (q) => q.correct,
      yakin8: (q) => normDeg(Math.round(q.correct) + (q.i % 2 ? 8 : -8)),
      k19: (q) => normDeg(q.correct + 19),
      k27: (q) => normDeg(q.correct - 27),
      k34: (q) => normDeg(q.correct + 34),
      k36: (q) => normDeg(q.correct + 36),
      k49: (q) => normDeg(q.correct - 49),
      k51: (q) => normDeg(q.correct + 51),
      k64: (q) => normDeg(q.correct + 64),
      k66: (q) => normDeg(q.correct - 66),
      k100: (q) => normDeg(q.correct + 100),
      ters: (q) => normDeg(q.correct + 180),
      ego: (q) => q.ego,
      ego4: (q) => (EGO4.has(q.i) ? q.ego : q.correct),
      ego6: (q) => (EGO6.has(q.i) ? q.ego : normDeg(q.correct + 60)),
      ayna: (q) => q.mirror,
      ayna4: (q) => (MIRROR4.has(q.i) ? q.mirror : q.correct),
      ikiTur: (q) => (EGO4.has(q.i) ? q.ego : MIRROR4.has(q.i) ? q.mirror : normDeg(q.correct + 120)),
      ikiTurAz: (q) => (EGO4.has(q.i) ? q.ego : MIRROR4.has(q.i) ? q.mirror : q.correct),
      ayniYon: () => 30,
      buyukZor: (q) => (Math.abs(q.shift) > PA_SMALL_MAX ? normDeg(q.correct + 60) : q.correct),
      kucukZor: (q) => (Math.abs(q.shift) <= PA_SMALL_MAX ? normDeg(q.correct + 60) : q.correct),
      bos2: (q) => (q.i < 2 ? null : q.correct),
      hepsiBos: () => null,
      rastgeleA: (q) => RANDOM_A[q.i],
      rastgeleB: (q) => RANDOM_B[q.i],
      // Dört soruda haritaya göre yön, ötekilerde rastgele: hata türü yüksek hatayı açıklamaz, rastgele düzeyi sayılır.
      ego4Rastgele: (q) => (EGO4.has(q.i) ? q.ego : RANDOM_A[q.i]),
      ayna4Ters: (q) => (MIRROR4.has(q.i) ? q.mirror : normDeg(q.correct + 180)),
      bos3: (q) => (q.i < 3 ? null : normDeg(q.correct + 30)),
      // Bütün sorularda sağ-sol karışıklığı, üç soruda ok 25 derece kaymış: aynı yolla çözülmüş, yüksek hatayı tür açıklar.
      aynaGurultu: (q) => normDeg(q.mirror + (q.i < 3 ? 25 : 0)),
    };
    const rts: Record<string, (i: number) => number | null> = {
      normal: () => 12_000,
      hizli: () => 1500,
      hizli3: (i) => (i < 3 ? 1000 : 12_000),
      yok: () => null,
      uzun: () => 120_000,
    };
    let n = 0;
    for (const [pName, pick] of Object.entries(picks)) {
      for (const [tName, rt] of Object.entries(rts)) {
        const label = `${pName}/${tName}`;
        const body = perspectiveBody((q) => ({ deg: pick(q), rtMs: rt(q.i) }), 9);
        const res = evaluate(SLUG, body);
        const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
        const r: PerspectiveResult = score(body);
        const chance = perspectiveChance(r);
        const high = perspectivePatternHigh(r);
        const doubt = perspectiveDoubt(r);
        const egoP = perspectiveEgo(r);
        const mirrorP = perspectiveMirror(r);
        const rapid = perspectiveRapid(r);
        const same = perspectiveSameDir(r);
        const m = r.meanError;
        const far = r.items.filter((x) => x.error > PA_CLOSE).length;
        expect(chance && high, label).toBe(false);
        expect(chance || high, label).toBe(m > PA_CHANCE_MEAN);
        for (const rep of [res.student, res.parent, adult]) {
          const you = rep !== res.parent;
          const t = text(rep);
          expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]|: \.|%-|Infinity/);
          expect(t, label).not.toMatch(/(^|\s)1 tanesi/);
          // "10 sorunun 10 tanesinde" değil "10 sorunun hepsinde".
          expect(`${t} ${rep.cautions.join(' ')}`, label).not.toMatch(/(\d+) sorunun \1 tanesinde/);
          expect(
            rep.items.map((i) => i.title),
            label,
          ).toEqual(TITLES);
          for (const i of rep.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
          for (const clause of t.split(/[.;:]/).filter((c) => /hiçbir/i.test(c))) expect(clause, label).toMatch(/değil|amadı|emedi|madı|medi|mez|maz|yok/);
          const [hata, donus, tur, calisma] = rep.items;
          const look = you ? 'bak)' : 'bakın)';

          // Yön gösterme isabeti
          expect(hata.badge, label).toBe(`Ortalama hata ${deg(m)}`);
          expect(hata.text.startsWith(`Doğru yöne çok yakın (en çok ${PA_CLOSE} derece hata): ${r.close}/12 soru.`), label).toBe(true);
          expect(hata.text.includes('rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil'), label).toBe(chance);
          expect(hata.text.includes('rastgele dağılmıyor'), label).toBe(high);
          expect(hata.text.includes(`hata türleri kartına ${look}`), label).toBe(high || (!chance && (egoP || mirrorP) && !doubt));
          expect(hata.text.includes('doğru yöne çok yakındı'), label).toBe(!chance && !high && m <= 20);
          expect(hata.text.includes('doğru yönden biraz saptı'), label).toBe(m > 20 && m <= 35);
          expect(hata.text.includes('doğru yönden epeyce saptı'), label).toBe(m > 35 && m <= 50);
          expect(hata.text.includes('doğru yönden büyük ölçüde saptı'), label).toBe(m > 50 && m <= PA_CHANCE_MEAN);
          expect(hata.text.includes('ortalama hata yorumlanmamalıdır') || hata.text.includes('ortalama hata tek başına bir şey söylemez'), label).toBe(high);
          expect(hata.text.includes('bu sonuç seni tam yansıtmayabilir') || hata.text.includes('bu sonuç çocuğunuzu tam yansıtmayabilir'), label).toBe(
            doubt && !chance && !high,
          );
          expect(hata.text.includes('soru, rastgele düzeyi olan 90 derece hata sayıldı'), label).toBe(r.answered < 12);

          // Küçük ve büyük dönüşler
          const gap = r.large.meanError - r.small.meanError;
          expect(donus.badge === 'Yorumlanmadı', label).toBe(chance || high || doubt);
          if (!chance && !high) {
            if (!doubt)
              expect(donus.badge, label).toBe(
                gap >= PA_GAP ? 'Büyük dönüşlerde daha çok hata' : gap <= -PA_GAP ? 'Büyük dönüşlerde daha az hata' : 'İki grupta yakın hata',
              );
            const small = you ? `ortalama hatan ${deg(r.small.meanError)}` : `çocuğunuzun ortalama hatası ${deg(r.small.meanError)}`;
            expect(
              donus.text.startsWith(
                `Zihinde en çok 90 derece dönmeyi gerektiren 6 soruda ${small}, 90 dereceden fazla dönmeyi gerektiren 6 soruda ${deg(r.large.meanError)}.`,
              ),
              label,
            ).toBe(true);
            expect(donus.text.includes('iki grup arasındaki fark yorumlanmadı'), label).toBe(doubt);
            expect(donus.text.includes('Bu beklenen bir durumdur'), label).toBe(!doubt && gap >= PA_GAP);
            expect(donus.text.includes('genellikle bunun tersi olur'), label).toBe(!doubt && gap <= -PA_GAP);
            expect(donus.text.includes('Haritaya yukarıdan bakar gibi gösterilen yönler'), label).toBe(!doubt && gap >= PA_GAP && egoP);
            expect(donus.text.includes('bu farkı etkilemiş olabilir'), label).toBe(!doubt && gap <= -PA_GAP && (egoP || mirrorP));
            expect(donus.text.includes('Her grup 6 soruya dayanır'), label).toBe(!doubt);
          }

          // Hata türleri
          expect(tur.badge === 'Yorumlanmadı', label).toBe(chance || (doubt && !chance));
          if (!chance && !doubt) {
            const expected =
              far === 0
                ? 'Belirgin kayma yok'
                : egoP && mirrorP
                  ? 'İki hata türü birden'
                  : egoP
                    ? `Haritaya yukarıdan bakar gibi: ${r.ego.count} soru`
                    : mirrorP
                      ? `Sağ ile sol karışmış olabilir: ${r.mirror.count} soru`
                      : 'Belirgin bir hata türü yok';
            expect(tur.badge, label).toBe(expected);
            if (far > 0)
              expect(
                tur.text.startsWith(`Haritaya yukarıdan bakar gibi: ${r.ego.count}/10 soru · Sağ ile sol karışık: ${r.mirror.count}/12 soru.`),
                label,
              ).toBe(true);
          }
          // Yorumlanmamanın nedeni doğru söylenir: düşünmeden cevap verilmiş olabilirse bu, değilse rastgele düzeyi.
          if (doubt) expect(tur.text, label).toMatch(/düşünmeden cevap ver/);
          else if (chance) expect(tur.text, label).toContain('rastgele gösterilen yönlerden belirgin biçimde daha isabetli olmadığı için');
          // Hata türü olmayan bir sonuçta haritaya göre yön ya da sağ-sol karışıklığı anlatılmaz.
          if (!egoP) expect(tur.text.includes('haritayı olduğu gibi kullanmış'), label).toBe(false);
          if (!mirrorP) expect(tur.text.includes('sağ ile solu karıştırmış olabilir'), label).toBe(false);

          // Çalışma biçimi
          expect(calisma.text.includes('3 saniyeden kısa sürede'), label).toBe(rapid);
          expect(calisma.text.includes('hemen hemen aynı yönü'), label).toBe(same);
          if (r.medianRt === null) expect(calisma.badge, label).toBe('Süre hesaplanamadı');
          else expect(calisma.badge, label).toMatch(/^Soru başına tipik süre (bir saniyeden kısa|\d+ saniye|\d+ dakika( \d+ saniye)?)$/);

          // Uyarılar kartlarla aynı şeyi söyler.
          const cautions = rep.cautions.join(' ');
          expect(cautions.includes('rastgele gösterilen yönlerden belirgin biçimde daha isabetli değil'), label).toBe(chance);
          expect(cautions.includes('haritaya yukarıdan bakar gibi'), label).toBe(high && egoP);
          expect(cautions.includes('ters tarafa'), label).toBe(high && mirrorP);
          expect(cautions.includes('ortalama hata yorumlanmamalıdır; yalnızca yanlışların türü anlatılır'), label).toBe(high);
          expect(cautions.includes('3 saniyeden kısa sürede'), label).toBe(rapid);
          expect(cautions.includes('hemen hemen aynı yön'), label).toBe(same);

          // Öne çıkan sayılar ve grafik sonuçla aynıdır.
          const fig = Object.fromEntries(rep.keyFigures.map((f) => [f.label, f.value]));
          expect(fig['Ortalama hata'], label).toBe(deg(m));
          expect(fig['Doğru yöne çok yakın cevaplar'], label).toBe(`${r.close}/12`);
          expect(rep.chart?.type === 'bars' ? rep.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(
            r.bins.map((b) => `${nfDeg.format(b.meanError)}°`),
          );
          expect(rep.chartNote?.includes('yorumlanmamalıdır'), label).toBe(chance || high || doubt);
          expect(rep.roadmap!.bars, label).toEqual([]);
        }
        expect(text(res.student), label).not.toContain('Çocuğunuz');
        expect(text(adult), label).not.toContain('Çocuğunuz');
        expect(text(res.parent), label).not.toMatch(/\b(gösterdin|verdin|kestirebildin|gösterebildin|olabilirsin|karıştırdın|cevaplaman|hatan|kartına bak\))/);
        expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
        n++;
      }
    }
    expect(n).toBe(30 * 5);
  }, 400_000);

  it('7. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, perspectiveBody(undefined, 6))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, perspectiveBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(rmText).not.toMatch(/kitap/i);
    expect(schoolWords(withoutRoadmap(adult))).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel doğru yönleridir', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /BA_GOVDE=.*?a=(\[[-\d,]+\])/.exec(yml);
    const answers = task.items.map((it) => Math.round(correctAngle(O, it)));
    expect(JSON.parse(m![1])).toEqual(answers);
    const r = evaluate(
      SLUG,
      perspectiveBody((q) => ({ deg: answers[q.i], rtMs: 12_000 }), 8),
    );
    expect(r.student.items[2].badge).toBe('Belirgin kayma yok');
    expect(Object.fromEntries(r.student.keyFigures.map((f) => [f.label, f.value]))['Doğru yöne çok yakın cevaplar']).toBe('12/12');
    expect(r.parent.chart?.type === 'bars' && r.parent.chart.rows).toHaveLength(4);
    expect(r.parent.roadmap!.bars).toHaveLength(0);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/ba_sayfa[\s\S]*O nesne senin için hangi yönde\?/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(SLUG, perspectiveBody());
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, perspectiveBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar bağlantılı ve metinde anılıyor', () => {
    expect(bakisAcisiAlma.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(bakisAcisiAlma.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    // Makaleler DOI ile; test kitapçığı ve puanlama yönergesi laboratuvarın kendi sayfasından.
    for (const c of bakisAcisiAlma.science.citations) expect(c.url, c.text).toMatch(/^https:\/\/(doi\.org\/|hegarty-lab\.psych\.ucsb\.edu\/)/);
    const body = JSON.stringify({ ...bakisAcisiAlma.science, citations: [] });
    const cited = [
      'Brucato ve ark., 2022',
      'Frick ve Pichelmann, 2023',
      'Friedman ve ark., 2020',
      'Gunalp ve ark., 2021',
      'Hegarty, Kozhevnikov ve Waller, 2008',
      'Hegarty ve Waller’in (2004)',
      'Hegarty Spatial Thinking Lab, t.y.',
      'Hodgkiss ve ark., 2021',
      'Kozhevnikov ve Hegarty, 2001',
      'Orefice ve ark., 2024',
      'Prevratil ve ark., 2023',
    ];
    for (const a of cited) expect(body, a).toContain(a);
    expect(bakisAcisiAlma.science.citations.map((c) => c.text.split(/[,(]/)[0].trim().replace(/\.$/, ''))).toEqual(
      cited.map((a) => a.split(/ ve |,| ve$|’/)[0].trim()),
    );
    // Cinsiyet farkı anlatılmaz (kalıp yargıyı pekiştirebilir).
    expect(JSON.stringify(bakisAcisiAlma)).not.toMatch(/erkek|kadın|kız|cinsiyet/i);
  });
});
