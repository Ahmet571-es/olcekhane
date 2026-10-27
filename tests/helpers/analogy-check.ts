import { elementPrims } from '@/lib/instruments/analogy';
import type { AnalogyElement, AnalogyFill, AnalogyPanel, AnalogySlot } from '@/lib/instruments/types';

/**
 * Şekil benzetmelerinin bağımsız denetleyicisi. Soruları kuran kodun dönüşümlerini (applyOps) kullanmaz: panoları yalnızca
 * çizildikleri biçimle (lib/instruments/analogy.ts'teki elementPrims: ekranda görünen çokgenler ve daireler) karşılaştırır
 * ve A'yı B'ye götüren yorumları kendisi arar.
 *
 * Bir yorum: bütün panonun bir döndürülmesi ya da aynalanması (8 simetri; döndürülmüş ve aynalanmış kare gibi), A'nın
 * parçalarıyla B'nin parçalarının biçimi koruyan bir eşleşmesi ve her parçada değişen özellikler (renk, büyüklük, sayı, yer,
 * duruş; iki parçanın yer değiştirmesi). Renk, büyüklük, sayı ve yer hem mutlak (B'deki değer) hem göreli (aradaki fark)
 * okunur. Yorumun bedeli değişen şeylerin sayısıdır; insanlar bir değişikliği en yalın biçimde okur, bu yüzden en düşük
 * bedelli yorumlar C'ye uygulanır ve hepsi aynı çizimi vermelidir (`solveAnalogy`).
 */

type Mat = readonly [number, number, number, number];
const I: Mat = [1, 0, 0, 1];
const mul = (p: Mat, q: Mat): Mat => [p[0] * q[0] + p[1] * q[2], p[0] * q[1] + p[1] * q[3], p[2] * q[0] + p[3] * q[2], p[2] * q[1] + p[3] * q[3]];
/** Saat yönünde dönüş (ekranda y aşağı doğru). */
const rot = (deg: number): Mat => {
  const a = (deg * Math.PI) / 180;
  return [Math.round(Math.cos(a)), -Math.round(Math.sin(a)), Math.round(Math.sin(a)), Math.round(Math.cos(a))];
};
const FLIP: Mat = [-1, 0, 0, 1];
/** Karenin 8 simetrisi: 4 dönüş, dikey ve yatay eksene göre ayna, iki köşegene göre ayna. */
export const D4: Mat[] = [0, 90, 180, 270].flatMap((d) => [rot(d), mul(rot(d), FLIP)]);
const key = (m: Mat) => m.join(',');
const isId = (m: Mat) => key(m) === key(I);

/** Parçanın duruşu bir matris olarak: önce ayna, sonra dönüş. */
const poseOf = (e: AnalogyElement): Mat => (e.flip ? mul(rot(e.angle), FLIP) : rot(e.angle));
/** Matristen duruşa (dönüş ve ayna). */
function fromMat(m: Mat): { angle: number; flip: boolean } {
  const det = m[0] * m[3] - m[1] * m[2];
  const r = det > 0 ? m : mul(m, FLIP); // ayna varsa önce aynayı çıkar: m = R · F → R = m · F
  const angle = ((Math.round((Math.atan2(r[2], r[0]) * 180) / Math.PI) % 360) + 360) % 360;
  return { angle, flip: det < 0 };
}

const SLOTS: AnalogySlot[] = ['c', 'l', 'r', 't', 'b', 'tl', 'tr', 'bl', 'br'];
const DIR: Record<AnalogySlot, [number, number]> = { c: [0, 0], l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1], tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] };
const slotOf = (x: number, y: number): AnalogySlot | null => SLOTS.find((s) => DIR[s][0] === x && DIR[s][1] === y) ?? null;
const moveSlot = (m: Mat, s: AnalogySlot): AnalogySlot => slotOf(m[0] * DIR[s][0] + m[1] * DIR[s][1], m[2] * DIR[s][0] + m[3] * DIR[s][1])!;

const FILLS: AnalogyFill[] = ['empty', 'gray', 'black'];

/** Bir parçanın çizimden çıkan imzası (noktalar yuvarlanmış ve sıralanmış; renk dahil). */
export function elementSig(e: AnalogyElement): string {
  return elementPrims(e)
    .map((p) =>
      p.kind === 'circle'
        ? `c${p.cx.toFixed(1)},${p.cy.toFixed(1)},${p.r.toFixed(1)},${p.fill}`
        : `p${p.points
            .map(([x, y]) => `${(Math.round(x * 10) / 10 + 0).toFixed(1)},${(Math.round(y * 10) / 10 + 0).toFixed(1)}`)
            .sort()
            .join(' ')},${p.fill}`,
    )
    .sort()
    .join('|');
}

/** Panonun imzası: çizimdeki bütün parçalar, sırasız. Aynı imzalı iki pano ekranda aynı görünür. */
export const panelSig = (panel: AnalogyPanel): string => panel.map(elementSig).sort().join(' / ');

/** Yalnızca biçimin duruşu (yer, renk, büyüklük ve sayı sabitlenerek): iki duruş ekranda aynı mı görünür? */
const outlineSig = (e: AnalogyElement, m: Mat) => elementSig({ ...e, ...fromMat(m), fill: 'empty', size: 2, slot: 'c', count: 1 });

/** Bir özelliği mutlak (B'deki değer) ya da göreli (sıradaki fark kadar) değiştiren seçenekler. */
function numeric<T extends string | number>(from: T, to: T, order: readonly T[], set: (e: AnalogyElement, v: T) => AnalogyElement, get: (e: AnalogyElement) => T): ((e: AnalogyElement) => AnalogyElement | null)[] {
  if (from === to) return [(e) => e];
  const d = order.indexOf(to) - order.indexOf(from);
  return [
    (e) => set(e, to),
    (e) => {
      const j = order.indexOf(get(e)) + d;
      return j >= 0 && j < order.length ? set(e, order[j]) : null;
    },
  ];
}

/** Bütün eşleşmeler: A'nın i. parçası B'nin p[i]. parçasına, biçimler aynı kalarak. */
function matchings(a: AnalogyPanel, b: AnalogyPanel): number[][] {
  if (a.length !== b.length) return [];
  const out: number[][] = [];
  const go = (i: number, used: number[]) => {
    if (i === a.length) return void out.push([...used]);
    for (let j = 0; j < b.length; j++) if (!used.includes(j) && b[j].shape === a[i].shape) go(i + 1, [...used, j]);
  };
  go(0, []);
  return out;
}

export interface Interpretation {
  cost: number;
  /** Okunabilir anlatım (ör. "pano: 90° | 0: renk"). */
  label: string;
  apply: (c: AnalogyPanel) => AnalogyPanel | null;
}

/** A'yı B'ye götüren bütün yorumlar (bedelleriyle). */
export function interpretations(a: AnalogyPanel, b: AnalogyPanel): Interpretation[] {
  const out: Interpretation[] = [];
  for (const g of D4) {
    const ga = a.map((e) => ({ ...e, ...fromMat(mul(g, poseOf(e))), slot: moveSlot(g, e.slot) }));
    for (const p of matchings(a, b)) {
      // Her parça için olası değişiklik seçenekleri: [uygula, bedel, ad] listelerinin listesi.
      const perEl: { apply: (e: AnalogyElement) => AnalogyElement | null; cost: number; label: string }[][] = [];
      let ok = true;
      for (let i = 0; i < a.length && ok; i++) {
        const from = ga[i];
        const to = b[p[i]];
        const steps: { apply: (e: AnalogyElement) => AnalogyElement | null; cost: number; label: string }[][] = [];
        // Renk, büyüklük, sayı: mutlak ya da göreli.
        steps.push(numeric(from.fill, to.fill, FILLS, (e, v) => ({ ...e, fill: v }), (e) => e.fill).map((f) => ({ apply: f, cost: from.fill === to.fill ? 0 : 1, label: from.fill === to.fill ? '' : `${i}:renk` })));
        steps.push(numeric(from.size, to.size, [1, 2, 3] as const, (e, v) => ({ ...e, size: v }), (e) => e.size).map((f) => ({ apply: f, cost: from.size === to.size ? 0 : 1, label: from.size === to.size ? '' : `${i}:büyüklük` })));
        steps.push(numeric(from.count, to.count, [1, 2, 3, 4], (e, v) => ({ ...e, count: v }), (e) => e.count).map((f) => ({ apply: f, cost: from.count === to.count ? 0 : 1, label: from.count === to.count ? '' : `${i}:sayı` })));
        // Yer: mutlak ya da göreli (yön farkı).
        if (from.slot === to.slot) steps.push([{ apply: (e) => e, cost: 0, label: '' }]);
        else {
          const dx = DIR[to.slot][0] - DIR[from.slot][0];
          const dy = DIR[to.slot][1] - DIR[from.slot][1];
          steps.push([
            { apply: (e) => ({ ...e, slot: to.slot }), cost: 1, label: `${i}:yer` },
            {
              apply: (e) => {
                const s = slotOf(DIR[e.slot][0] + dx, DIR[e.slot][1] + dy);
                return s ? { ...e, slot: s } : null;
              },
              cost: 1,
              label: `${i}:yer`,
            },
          ]);
        }
        // Duruş: B'deki duruşu veren bütün simetriler (biçim simetrikse birden çok).
        const target = outlineSig(to, poseOf(to));
        const hs = D4.filter((h) => outlineSig(from, mul(h, poseOf(from))) === target);
        if (!hs.length) ok = false;
        // Duruş görünür biçimde değişmediyse (h = I seçilebiliyorsa) yalnızca o seçilir: değişmeyen bir şey değişmiş okunmaz.
        const poses = hs.some(isId) ? [I] : hs;
        steps.push(poses.map((h) => ({ apply: (e) => ({ ...e, ...fromMat(mul(h, poseOf(e))) }), cost: isId(h) ? 0 : 1, label: isId(h) ? '' : `${i}:duruş` })));
        // Seçeneklerin çarpımı tek bir parça değişikliği listesi olur.
        let combos: { apply: (e: AnalogyElement) => AnalogyElement | null; cost: number; label: string }[] = [{ apply: (e) => e, cost: 0, label: '' }];
        for (const opts of steps) {
          combos = combos.flatMap((c) =>
            opts.map((o) => ({
              apply: (e: AnalogyElement) => {
                const x = c.apply(e);
                return x ? o.apply(x) : null;
              },
              cost: c.cost + o.cost,
              label: [c.label, o.label].filter(Boolean).join(' '),
            })),
          );
        }
        perEl.push(combos);
      }
      if (!ok) continue;
      // Parçaların seçeneklerinin çarpımı.
      let all: { fns: ((e: AnalogyElement) => AnalogyElement | null)[]; cost: number; label: string }[] = [{ fns: [], cost: isId(g) ? 0 : 1, label: isId(g) ? '' : `pano:${key(g)}` }];
      for (const opts of perEl) all = all.flatMap((x) => opts.map((o) => ({ fns: [...x.fns, o.apply], cost: x.cost + o.cost, label: [x.label, o.label].filter(Boolean).join(' ') })));
      for (const x of all) {
        out.push({
          cost: x.cost,
          label: x.label,
          apply: (c) => {
            const gc = c.map((e) => ({ ...e, ...fromMat(mul(g, poseOf(e))), slot: moveSlot(g, e.slot) }));
            const res: AnalogyElement[] = [];
            for (let i = 0; i < gc.length; i++) {
              const y = x.fns[i](gc[i]);
              if (!y) return null;
              res.push(y);
            }
            return res;
          },
        });
      }
    }
  }
  // İki parçanın yer değiştirmesi tek bir değişiklik sayılır: yer değişikliklerinin bedeli 2 yerine 1.
  return out.map((it) => {
    const moves = (it.label.match(/\d:yer/g) ?? []).length;
    return moves === 2 && a.length === 2 && a[0].slot === b[1].slot && a[1].slot === b[0].slot ? { ...it, cost: it.cost - 1, label: `${it.label} (yer değiştirme)` } : it;
  });
}

export interface Solution {
  /** En düşük bedel. */
  min: number;
  /** En düşük bedelli yorumların C'ye uygulanmasıyla çıkan çizimlerin imzaları. */
  answers: Set<string>;
  /** Bir fazla bedelli yorumların verdiği çizimler (gözden geçirmek için). */
  near: Set<string>;
  /** En düşük bedelli yorumların anlatımları. */
  labels: string[];
}

export function solveAnalogy(a: AnalogyPanel, b: AnalogyPanel, c: AnalogyPanel): Solution {
  const its = interpretations(a, b).filter((it) => {
    const r = it.apply(a);
    return r !== null && panelSig(r) === panelSig(b);
  });
  const min = Math.min(...its.map((x) => x.cost));
  const answers = new Set<string>();
  const near = new Set<string>();
  const labels: string[] = [];
  for (const it of its) {
    const r = it.apply(c);
    if (!r) continue;
    if (it.cost === min) {
      answers.add(panelSig(r));
      labels.push(it.label);
    } else if (it.cost === min + 1) near.add(panelSig(r));
  }
  return { min, answers, near, labels };
}

/* ---------- Yanlış seçeneklerin türü ---------- */

/**
 * Bir parçaya tek bir özellik değişikliği (fazladan değişiklik ararken): renk, büyüklük, sayı, yer ya da duruş. A'dan B'ye
 * değişen özellikler (`skip`) bunun dışındadır: onlardaki farklı bir değer fazladan değil, yanlış bir değişikliktir.
 */
function singleChanges(e: AnalogyElement, skip: Set<string>): AnalogyElement[] {
  const out: AnalogyElement[] = [];
  if (!skip.has('renk')) for (const f of FILLS) if (f !== e.fill) out.push({ ...e, fill: f });
  if (!skip.has('büyüklük')) for (const s of [1, 2, 3] as const) if (s !== e.size) out.push({ ...e, size: s });
  if (!skip.has('sayı')) for (const n of [1, 2, 3, 4]) if (n !== e.count) out.push({ ...e, count: n });
  if (!skip.has('yer')) for (const s of SLOTS) if (s !== e.slot) out.push({ ...e, slot: s });
  if (!skip.has('duruş')) for (const h of D4) if (!isId(h)) out.push({ ...e, ...fromMat(mul(h, poseOf(e))) });
  return out;
}

/**
 * A'dan B'ye değişen özellikler, parça parça: en düşük bedelli (tek) yorumun etiketlerinden. Her biri C'ye ayrı ayrı
 * uygulanabilsin diye, yorumun C'deki her parçayı nasıl değiştirdiği özellik özellik çıkarılır.
 */
function changeSteps(a: AnalogyPanel, b: AnalogyPanel, c: AnalogyPanel, correct: AnalogyPanel): { i: number; attr: string; to: (e: AnalogyElement) => AnalogyElement }[] {
  void a;
  void b;
  const steps: { i: number; attr: string; to: (e: AnalogyElement) => AnalogyElement }[] = [];
  // Doğru cevap ile C arasındaki farklar (eşleşme sırayla; biçimler aynıdır).
  for (let i = 0; i < c.length; i++) {
    const x = c[i];
    const y = correct[i];
    if (x.fill !== y.fill) steps.push({ i, attr: 'renk', to: (e) => ({ ...e, fill: y.fill }) });
    if (x.size !== y.size) steps.push({ i, attr: 'büyüklük', to: (e) => ({ ...e, size: y.size }) });
    if (x.count !== y.count) steps.push({ i, attr: 'sayı', to: (e) => ({ ...e, count: y.count }) });
    if (x.slot !== y.slot) steps.push({ i, attr: 'yer', to: (e) => ({ ...e, slot: y.slot }) });
    if (outlineSig(x, poseOf(x)) !== outlineSig(y, poseOf(y))) steps.push({ i, attr: 'duruş', to: (e) => ({ ...e, angle: y.angle, flip: y.flip }) });
  }
  return steps;
}

/**
 * Bir yanlış seçeneğin türü, yalnızca çizimlere bakarak: C'nin aynısı (`copy`); doğru cevaptaki değişikliklerin bir kısmı
 * (`partial`); doğru cevaptaki değişikliklerin hepsi ve fazladan bir değişiklik (`extra`); ya da bunların hiçbiri (`wrong`).
 */
export function lureKind(a: AnalogyPanel, b: AnalogyPanel, c: AnalogyPanel, correct: AnalogyPanel, lure: AnalogyPanel): 'copy' | 'partial' | 'wrong' | 'extra' {
  const sig = panelSig(lure);
  if (sig === panelSig(c)) return 'copy';
  const steps = changeSteps(a, b, c, correct);
  // Bir kısmı: değişikliklerin boş olmayan, hepsini içermeyen her alt kümesi.
  for (let mask = 1; mask < (1 << steps.length) - 1; mask++) {
    const p = c.map((e, i) => steps.filter((s, k) => mask & (1 << k) && s.i === i).reduce((x, s) => s.to(x), e));
    if (panelSig(p) === sig) return 'partial';
  }
  // Fazladan: doğru cevabın bir parçasında, A'dan B'ye değişmeyen bir özellikte tek bir değişiklik daha.
  for (let i = 0; i < correct.length; i++) {
    for (const e of singleChanges(correct[i], new Set(steps.filter((s) => s.i === i).map((s) => s.attr)))) {
      const p = correct.map((x, k) => (k === i ? e : x));
      if (panelSig(p) === sig) return 'extra';
    }
  }
  return 'wrong';
}

/* ---------- Kestirme yollar ---------- */

/** İki pano arasında farklı olan özelliklerin sayısı (parçalar sırayla eşleşir; duruş görünüşüyle karşılaştırılır). */
export function attrDistance(p: AnalogyPanel, q: AnalogyPanel): number {
  let d = Math.abs(p.length - q.length);
  for (let i = 0; i < Math.min(p.length, q.length); i++) {
    const x = p[i];
    const y = q[i];
    if (x.shape !== y.shape) d++;
    if (x.fill !== y.fill) d++;
    if (x.size !== y.size) d++;
    if (x.count !== y.count) d++;
    if (x.slot !== y.slot) d++;
    if (x.shape === y.shape && outlineSig(x, poseOf(x)) !== outlineSig(y, poseOf(y))) d++;
  }
  return d;
}

/** Bir özelliğin seçeneklerdeki değerleri (özellik çoğunluğu kestirmesi için). */
export function attrValues(p: AnalogyPanel): string[] {
  return p.flatMap((e, i) => [`${i}s${e.shape}`, `${i}f${e.fill}`, `${i}z${e.size}`, `${i}n${e.count}`, `${i}y${e.slot}`, `${i}d${outlineSig(e, poseOf(e))}`]);
}

/* ---------- Görünürlük ---------- */

type P = [number, number];
const primPoints = (e: AnalogyElement): P[][] =>
  elementPrims(e).map((p) =>
    p.kind === 'circle' ? Array.from({ length: 24 }, (_, k): P => [p.cx + p.r * Math.cos((k * Math.PI) / 12), p.cy + p.r * Math.sin((k * Math.PI) / 12)]) : (p.points as P[]),
  );
const bbox = (pts: P[]) => {
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
/** Dışbükey bir çokgenin (ya da dairenin) içinde, kenarlarından en az `m` birim uzakta mı? */
function insideFrame(frame: AnalogyElement, pts: P[], m: number): boolean {
  const [prim] = elementPrims(frame);
  if (prim.kind === 'circle') return pts.every(([x, y]) => Math.hypot(x - prim.cx, y - prim.cy) <= prim.r - m);
  const poly = prim.points as P[];
  // Kenarların iç yanı: çokgenin ağırlık merkezinin bulunduğu yan.
  const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length;
  const cy = poly.reduce((s, q) => s + q[1], 0) / poly.length;
  return poly.every((p, k) => {
    const q = poly[(k + 1) % poly.length];
    const nx = q[1] - p[1];
    const ny = p[0] - q[0];
    const len = Math.hypot(nx, ny);
    const side = Math.sign(nx * (cx - p[0]) + ny * (cy - p[1]));
    return pts.every(([x, y]) => (side * (nx * (x - p[0]) + ny * (y - p[1]))) / len >= m);
  });
}

/**
 * Bir panonun görünüş sorunları: parça panonun dışına taşıyor; iki parça (ya da bir parçanın kopyaları) birbirine çok
 * yakın ya da üst üste; büyük bir şeklin (çerçevenin) içindeki parça çerçeveden taşıyor ya da onunla aynı renkte (içi boş
 * çerçeve hariç), yani görünmüyor.
 */
export function layoutProblems(panel: AnalogyPanel): string[] {
  const out: string[] = [];
  const shapes = panel.map(primPoints);
  shapes.flat().forEach((pts) => {
    const b = bbox(pts);
    if (b.x0 < 3 || b.y0 < 3 || b.x1 > 97 || b.y1 > 97) out.push('panodan taşıyor');
  });
  for (const copies of shapes) {
    for (let i = 0; i < copies.length; i++)
      for (let j = i + 1; j < copies.length; j++) {
        const p = bbox(copies[i]);
        const q = bbox(copies[j]);
        if (!(p.x1 + 3 <= q.x0 || q.x1 + 3 <= p.x0 || p.y1 + 3 <= q.y0 || q.y1 + 3 <= p.y0)) out.push('kopyalar birbirine çok yakın');
      }
  }
  for (let i = 0; i < panel.length; i++)
    for (let j = 0; j < panel.length; j++) {
      if (i === j) continue;
      const a = panel[i];
      const b = panel[j];
      if (a.size === 3 && b.size < 3) {
        if (!shapes[j].every((pts) => insideFrame(a, pts, 4))) out.push(`${j}. parça çerçeveden taşıyor`);
        if (a.fill !== 'empty' && a.fill === b.fill) out.push(`${j}. parça çerçeveyle aynı renkte`);
      } else if (i < j && a.size < 3 && b.size < 3) {
        const p = bbox(shapes[i].flat());
        const q = bbox(shapes[j].flat());
        if (!(p.x1 + 4 <= q.x0 || q.x1 + 4 <= p.x0 || p.y1 + 4 <= q.y0 || q.y1 + 4 <= p.y0)) out.push(`${i}. ve ${j}. parça birbirine çok yakın`);
      }
    }
  return out;
}

/** C ile doğru cevap arasında değişen özellikler, parça parça (renk, büyüklük, sayı, yer, duruş). */
export function changeList(c: AnalogyPanel, correct: AnalogyPanel): { i: number; attr: 'renk' | 'büyüklük' | 'sayı' | 'yer' | 'duruş' }[] {
  const out: { i: number; attr: 'renk' | 'büyüklük' | 'sayı' | 'yer' | 'duruş' }[] = [];
  for (let i = 0; i < c.length; i++) {
    const x = c[i];
    const y = correct[i];
    if (x.fill !== y.fill) out.push({ i, attr: 'renk' });
    if (x.size !== y.size) out.push({ i, attr: 'büyüklük' });
    if (x.count !== y.count) out.push({ i, attr: 'sayı' });
    if (x.slot !== y.slot) out.push({ i, attr: 'yer' });
    if (outlineSig(x, poseOf(x)) !== outlineSig(y, poseOf(y))) out.push({ i, attr: 'duruş' });
  }
  return out;
}

/** En yüksek (ya da en düşük) puanlı seçeneklerden biri rastgele seçilirse doğru cevabın seçilme olasılığı. */
function pickProb(scores: number[], correct: number, best: 'max' | 'min', exclude: boolean[] = []): number {
  const ok = scores.map((s, i) => (exclude[i] ? NaN : s));
  const vals = ok.filter((x) => !Number.isNaN(x));
  if (!vals.length) return 0.25;
  const target = best === 'max' ? Math.max(...vals) : Math.min(...vals);
  const top = ok.map((s, i) => (s === target ? i : -1)).filter((i) => i >= 0);
  return top.includes(correct) ? 1 / top.length : 0;
}

/**
 * Soruyu çözmeden doğru cevabı bulmaya çalışan kestirme yollar ve her birinin bu soruda doğru cevabı bulma olasılığı:
 * seçeneklerde en sık (ya da en seyrek) görülen özellikleri taşıyanı, ötekilere en çok (ya da en az) benzeyeni, üçüncü
 * şekilden en çok ya da (aynısı dışında) en az farklı olanı, üçüncü şekilden birinci ile ikinci arasındaki kadar özellikle
 * ayrılanı, ikinci şekle en çok ya da en az benzeyeni seçmek; soruda görülen bir şeklin aynısı olan seçenekleri eleyip
 * kalanlardan rastgele seçmek.
 */
export function shortcutScores(a: AnalogyPanel, b: AnalogyPanel, c: AnalogyPanel, options: AnalogyPanel[], ci: number): Record<string, number> {
  const dC = options.map((o) => attrDistance(o, c));
  const dAB = attrDistance(a, b);
  const dB = options.map((o) => attrDistance(o, b));
  const vals = options.map(attrValues);
  const freq = new Map<string, number>();
  for (const v of vals.flat()) freq.set(v, (freq.get(v) ?? 0) + 1);
  const plural = vals.map((vs) => vs.reduce((s, v) => s + (freq.get(v) ?? 0), 0));
  const medoid = options.map((o) => options.reduce((s, p) => s + attrDistance(o, p), 0));
  const given = [panelSig(a), panelSig(b), panelSig(c)];
  const same = options.map((o) => given.includes(panelSig(o)));
  return {
    çoğunluk: pickProb(plural, ci, 'max'),
    azınlık: pickProb(plural, ci, 'min'),
    benzer: pickProb(medoid, ci, 'min'),
    aykırı: pickProb(medoid, ci, 'max'),
    üçüncüdenUzak: pickProb(dC, ci, 'max'),
    üçüncüyeYakın: pickProb(dC, ci, 'min', dC.map((d) => d === 0)),
    değişiklikSayısı: pickProb(dC.map((d) => -Math.abs(d - dAB)), ci, 'max'),
    ikinciyeYakın: pickProb(dB, ci, 'min'),
    ikincidenUzak: pickProb(dB, ci, 'max'),
    eleme: same[ci] ? 0 : 1 / same.filter((x) => !x).length,
  };
}
