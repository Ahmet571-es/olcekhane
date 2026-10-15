/**
 * Kule görevinin bağımsız denetleyicisi (tests/planlama-kule-gorevi.test.ts). Testin kendi kodunu (lib/instruments/tower.ts)
 * kullanmaz: dizilişler burada çubuk dizileri olarak yeniden kurulur, bütün dizilişler ve hamleler taranır, en kısa
 * uzaklıklar genişlik öncelikli aramayla bulunur.
 *
 *  - Diziliş: üç çubuk, her biri alttan üste top harfleri (K, M, S); çubuklar 3, 2 ve 1 top alır.
 *  - Hamle: bir çubuğun en üstündeki top, dolu olmayan başka bir çubuğun en üstüne konur.
 */
export type Pegs = string[][];

const CAPS = [3, 2, 1];
const key = (p: Pegs) => p.map((x) => x.join('')).join('|');
const parse = (k: string): Pegs => k.split('|').map((x) => (x ? x.split('') : []));
export const pegsOf = (s: readonly string[]): Pegs => s.map((x) => x.split(''));
export const keyOf = (s: readonly string[]) => key(pegsOf(s));

/** Bütün dizilişler: üç topun her sırası ve her çubuğa düşen top sayısı. */
export function allStates(): string[] {
  const out = new Set<string>();
  const perms = ['KMS', 'KSM', 'MKS', 'MSK', 'SKM', 'SMK'];
  for (const p of perms) {
    for (let a = 0; a <= 3; a++) {
      for (let b = 0; b <= 2; b++) {
        const c = 3 - a - b;
        if (c < 0 || c > 1) continue;
        out.add(key([p.slice(0, a).split(''), p.slice(a, a + b).split(''), p.slice(a + b).split('')]));
      }
    }
  }
  return [...out].sort();
}

/** Bir dizilişten yapılabilecek hamleler: [nereden, nereye, sonraki diziliş] (çubuklar 0–2). */
export function successors(k: string): [number, number, string][] {
  const p = parse(k);
  const out: [number, number, string][] = [];
  p.forEach((src, i) => {
    if (src.length === 0) return;
    p.forEach((dst, j) => {
      if (i === j || dst.length >= CAPS[j]) return;
      const q = p.map((x) => [...x]);
      q[j].push(q[i].pop()!);
      out.push([i, j, key(q)]);
    });
  });
  return out;
}

/** Bir dizilişten bütün dizilişlere en kısa uzaklık ve en kısa yolların sayısı. */
export function distancesFrom(start: string): { dist: Map<string, number>; paths: Map<string, number> } {
  const dist = new Map<string, number>([[start, 0]]);
  const paths = new Map<string, number>([[start, 1]]);
  const queue = [start];
  while (queue.length) {
    const x = queue.shift()!;
    for (const [, , y] of successors(x)) {
      if (!dist.has(y)) {
        dist.set(y, dist.get(x)! + 1);
        paths.set(y, 0);
        queue.push(y);
      }
      if (dist.get(y) === dist.get(x)! + 1) paths.set(y, paths.get(y)! + paths.get(x)!);
    }
  }
  return { dist, paths };
}

/** En kısa yollardan biri: hamleler [nereden, nereye] (çubuklar 0–2). */
export function shortestPath(start: string, goal: string): [number, number][] {
  const back = distancesFrom(goal).dist; // hamleler geri alınabildiği için hedefe uzaklık, hedeften uzaklıktır
  const out: [number, number][] = [];
  let x = start;
  while (x !== goal) {
    const step = successors(x).find(([, , y]) => back.get(y) === back.get(x)! - 1)!;
    out.push([step[0], step[1]]);
    x = step[2];
  }
  return out;
}

/** Bütün en kısa yollar boyunca hiç hedefteki yerine gitmeyen (ara) hamlelerin en az sayısı: hamle sayısı − taşınan top sayısı. */
export function minIntermediate(start: string, goal: string): number {
  const toGoal = distancesFrom(goal).dist;
  let best = Infinity;
  const walk = (x: string, moved: Set<string>, n: number) => {
    if (x === goal) {
      best = Math.min(best, n - moved.size);
      return;
    }
    const p = parse(x);
    for (const [i, , y] of successors(x)) {
      if (toGoal.get(y) !== toGoal.get(x)! - 1) continue;
      walk(y, new Set([...moved, p[i][p[i].length - 1]]), n + 1);
    }
  };
  walk(start, new Set(), 0);
  return best;
}

/** Dizilişin biçimi: üç top bir çubukta (kule), iki ve bir (kısmi) ya da birer birer (düz). */
export function shapeOf(k: string): 'kule' | 'kismi' | 'duz' {
  const m = Math.max(...parse(k).map((x) => x.length));
  return m === 3 ? 'kule' : m === 2 ? 'kismi' : 'duz';
}

/** Her çubuktaki top sayısı (ör. "2-1-0"). */
export const countsOf = (k: string) =>
  parse(k)
    .map((x) => x.length)
    .join('-');

/** Renkleri değiştirince aynı olan problemlerin ortak adı: altı renk eşlemesinin sözlükte en küçüğü. */
export function structureOf(start: string, goal: string): string {
  const names = ['KMS', 'KSM', 'MKS', 'MSK', 'SKM', 'SMK'];
  return names
    .map((p) => {
      const tr = (s: string) => s.replace(/[KMS]/g, (c) => p['KMS'.indexOf(c)]);
      return `${tr(start)}>${tr(goal)}`;
    })
    .sort()[0];
}
