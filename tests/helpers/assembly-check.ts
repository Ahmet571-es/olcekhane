/**
 * Parçalardan Şekil sorularının bağımsız denetimi. Kütüphanedeki geometriyi (lib/instruments/assembly.ts) kullanmaz: her kare
 * dört örnek noktayla temsil edilir (karenin dört kenarına yakın üçgenlerin ağırlık merkezleri) ve bir noktanın yarım karenin
 * içinde olup olmadığı köşegene göre hesaplanır. Koordinatlar 1/6 birimdir: (x, y) karesinin noktaları
 * (6x + 3, 6y + 1) üst, (6x + 5, 6y + 3) sağ, (6x + 3, 6y + 5) alt ve (6x + 1, 6y + 3) sol.
 *
 * Döndürme ve ters çevirme bu noktaların üstünde yapılır; döşeme (parçaların bir şekli tam kaplaması) her adımda ilk boş
 * noktayı bir parçanın ilk noktasıyla kapatan kesin bir aramadır.
 */

export type Pt = [number, number];

const SAMPLES: Pt[] = [
  [3, 1],
  [5, 3],
  [3, 5],
  [1, 3],
];

/** Yarım karenin dolu yarısında mı? (u, v karenin içinde 0–6.) */
function inHalf(letter: string, u: number, v: number): boolean {
  switch (letter) {
    case 'A':
      return u + v < 6; // sol üst
    case 'B':
      return u > v; // sağ üst
    case 'C':
      return u + v > 6; // sağ alt
    case 'D':
      return u < v; // sol alt
    default:
      throw new Error(`harf: ${letter}`);
  }
}

/** Simge dizisini parçalara göre nokta kümelerine çevirir. */
export function parts(shape: string): Map<number, Pt[]> {
  const out = new Map<number, Pt[]>();
  const add = (p: number, pt: Pt) => out.set(p, [...(out.get(p) ?? []), pt]);
  shape
    .trim()
    .split('/')
    .forEach((row, y) =>
      row
        .trim()
        .split(/\s+/)
        .forEach((tok, x) => {
          if (tok === '.') return;
          const halves = tok.match(/[1-9][A-D]?/g) ?? [];
          if (halves.join('') !== tok) throw new Error(`simge: ${tok}`);
          for (const [u, v] of SAMPLES) {
            const owners = halves.filter((h) => h.length === 1 || inHalf(h[1], u, v));
            if (owners.length > 1) throw new Error(`üst üste: ${tok}`);
            if (owners.length === 1) add(Number(owners[0][0]), [6 * x + u, 6 * y + v]);
          }
        }),
    );
  return out;
}

/** Bütün şeklin noktaları (parçalar birlikte). */
export const outline = (shape: string): Pt[] => [...parts(shape).values()].flat();

const key = (p: Pt) => `${p[0]},${p[1]}`;

/** Noktaları sol üst köşe karesi (0, 0) olacak biçimde kaydırır ve sıralar. */
export function normalize(pts: Pt[]): Pt[] {
  const dx = Math.min(...pts.map((p) => Math.floor(p[0] / 6))) * 6;
  const dy = Math.min(...pts.map((p) => Math.floor(p[1] / 6))) * 6;
  return pts.map(([x, y]) => [x - dx, y - dy] as Pt).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

/** Saat yönünde çeyrek dönüş. Noktaların kare içindeki yerleri de döner: üst → sağ → alt → sol. */
export const rotate = (pts: Pt[]): Pt[] => normalize(pts.map(([x, y]) => [-y, x] as Pt));
/** Yatay ters çevirme (ayna). */
export const mirror = (pts: Pt[]): Pt[] => normalize(pts.map(([x, y]) => [-x, y] as Pt));

const sig = (pts: Pt[]) => normalize(pts).map(key).join(' ');

/** Bir şeklin farklı yönleri: yalnızca döndürerek ya da ters çevirmeye de izin vererek. */
export function orientations(pts: Pt[], flips: boolean): Pt[][] {
  const seen = new Map<string, Pt[]>();
  let cur = normalize(pts);
  for (const start of flips ? [cur, mirror(cur)] : [cur]) {
    cur = start;
    for (let i = 0; i < 4; i++) {
      seen.set(sig(cur), cur);
      cur = rotate(cur);
    }
  }
  return [...seen.values()];
}

/** İki şekil, döndürerek (isteğe göre ters çevirerek) üst üste gelir mi? */
export const congruent = (a: Pt[], b: Pt[], flips = false) => orientations(b, flips).some((o) => sig(o) === sig(a));
/** Yalnızca kaydırarak (döndürmeden) üst üste gelir mi? */
export const sameByTranslation = (a: Pt[], b: Pt[]) => sig(a) === sig(b);

/** Parçalar (döndürerek, isteğe göre ters çevirerek) hedef şekli boşluksuz ve taşmadan kaplar mı? */
export function tiles(target: Pt[], pieces: Pt[][], flips: boolean): boolean {
  const total = pieces.reduce((a, p) => a + p.length, 0);
  if (total !== target.length) return false;
  const want = new Set(target.map(key));
  const order = normalize(target);
  const covered = new Set<string>();
  const used = pieces.map(() => false);
  const orients = pieces.map((p) => orientations(p, flips));
  const rec = (): boolean => {
    const first = order.find((p) => !covered.has(key(p)));
    if (!first) return true;
    for (let i = 0; i < pieces.length; i++) {
      if (used[i]) continue;
      for (const o of orients[i]) {
        // Parçanın ilk noktası (sıralamada) hedefteki ilk boş noktaya gelir; kayma kare katlarında olmalı.
        const dx = first[0] - o[0][0];
        const dy = first[1] - o[0][1];
        if (dx % 6 !== 0 || dy % 6 !== 0) continue;
        const placed = o.map(([x, y]) => key([x + dx, y + dy]));
        if (placed.some((k) => !want.has(k) || covered.has(k))) continue;
        for (const k of placed) covered.add(k);
        used[i] = true;
        if (rec()) return true;
        used[i] = false;
        for (const k of placed) covered.delete(k);
      }
    }
    return false;
  };
  return rec();
}

/** Seçenekte çizilen parçalar, verilen parçalarla bire bir eşleşir mi (döndürerek, isteğe göre ters çevirerek)? */
export function partsMatch(option: string, pieces: Pt[][], how: 'translate' | 'rotate' | 'flip'): boolean {
  const drawn = [...parts(option).values()];
  if (drawn.length !== pieces.length) return false;
  const same = (a: Pt[], b: Pt[]) => (how === 'translate' ? sameByTranslation(a, b) : congruent(a, b, how === 'flip'));
  const used = pieces.map(() => false);
  const rec = (i: number): boolean => {
    if (i === drawn.length) return true;
    for (let j = 0; j < pieces.length; j++) {
      if (used[j] || !same(drawn[i], pieces[j])) continue;
      used[j] = true;
      if (rec(i + 1)) return true;
      used[j] = false;
    }
    return false;
  };
  return rec(0);
}

/**
 * Şekil tek parça mı? Bir karenin dört üçgeni sırayla birbirine değer (üst–sağ–alt–sol); komşu karelerde karşılıklı üçgenler
 * (sağ ile sol, alt ile üst) ortak bir kenarı paylaşır. Yalnızca köşeden değen kareler bağlı sayılmaz.
 */
export function connected(pts: Pt[]): boolean {
  const set = new Set(pts.map(key));
  const seen = new Set<string>();
  const stack = [pts[0]];
  while (stack.length) {
    const [x, y] = stack.pop()!;
    const k = key([x, y]);
    if (seen.has(k)) continue;
    seen.add(k);
    const cx = Math.floor(x / 6) * 6;
    const cy = Math.floor(y / 6) * 6;
    const u = x - cx;
    const v = y - cy;
    // Aynı karedeki komşu üçgenler.
    const ring: Pt[] = [
      [3, 1],
      [5, 3],
      [3, 5],
      [1, 3],
    ];
    const at = ring.findIndex(([a, b]) => a === u && b === v);
    const near: Pt[] = [ring[(at + 1) % 4], ring[(at + 3) % 4]].map(([a, b]) => [cx + a, cy + b] as Pt);
    // Komşu karedeki karşılıklı üçgen.
    if (at === 0) near.push([cx + 3, cy - 1]);
    if (at === 1) near.push([cx + 7, cy + 3]);
    if (at === 2) near.push([cx + 3, cy + 7]);
    if (at === 3) near.push([cx - 1, cy + 3]);
    for (const p of near) if (set.has(key(p)) && !seen.has(key(p))) stack.push(p);
  }
  return seen.size === set.size;
}

/** Bir şeklin alanı (birim kare). */
export const areaOf = (pts: Pt[]) => pts.length / 4;

/** Tam dolu kare sayısı. */
export function fullSquares(pts: Pt[]): number {
  const n = new Map<string, number>();
  for (const [x, y] of pts) n.set(`${Math.floor(x / 6)},${Math.floor(y / 6)}`, (n.get(`${Math.floor(x / 6)},${Math.floor(y / 6)}`) ?? 0) + 1);
  return [...n.values()].filter((c) => c === 4).length;
}

/** Yarım kare sayısı. */
export function halfSquares(pts: Pt[]): number {
  const n = new Map<string, number>();
  for (const [x, y] of pts) n.set(`${Math.floor(x / 6)},${Math.floor(y / 6)}`, (n.get(`${Math.floor(x / 6)},${Math.floor(y / 6)}`) ?? 0) + 1);
  return [...n.values()].filter((c) => c === 2).length;
}

/** Simetri sayısı: şekli kendine taşıyan döndürme ve ters çevirmelerin sayısı (1–8). */
export const symmetry = (pts: Pt[]) => 8 / orientations(pts, true).length;

/** İki şeklin en iyi örtüşmesi (döndürerek, sol üst köşeleri hizalı; kesişim / birleşim). */
export function overlap(a: Pt[], b: Pt[]): number {
  const A = new Set(normalize(a).map(key));
  let best = 0;
  for (const o of orientations(b, false)) {
    const inter = o.filter((p) => A.has(key(p))).length;
    best = Math.max(best, inter / (A.size + o.length - inter));
  }
  return best;
}

/** Kutusu (genişlik × yükseklik, birim). */
export function box(pts: Pt[]): [number, number] {
  const n = normalize(pts);
  return [Math.max(...n.map((p) => Math.floor(p[0] / 6))) + 1, Math.max(...n.map((p) => Math.floor(p[1] / 6))) + 1];
}

/**
 * Her yatay ve dikey çizgi şekli tek bir aralıkta keser (oyuk, çentik ya da ok ucu yok). Şekil 1/8 birimlik bir ızgarada
 * taranır; bir küçük karenin içindeki bir nokta şeklin içindeyse dolu sayılır.
 */
export function orthoConvex(shape: string): boolean {
  const R = 8;
  const rows = shape
    .trim()
    .split('/')
    .map((r) => r.trim().split(/\s+/));
  const W = Math.max(...rows.map((r) => r.length)) * R;
  const H = rows.length * R;
  const inside = (px: number, py: number): boolean => {
    const x = Math.floor(px / R);
    const y = Math.floor(py / R);
    const tok = rows[y]?.[x] ?? '.';
    if (tok === '.') return false;
    // Örnek noktalar köşegenlerin üstüne düşmesin diye iki eksende farklı kaydırılır (iki yarıya bölünmüş karede boşluk görünmez).
    const u = ((px % R) + 0.3) * (6 / R);
    const v = ((py % R) + 0.6) * (6 / R);
    return (tok.match(/[1-9][A-D]?/g) ?? []).some((h) => h.length === 1 || inHalf(h[1], u, v));
  };
  const oneRun = (cells: boolean[]) => {
    const s = cells.map((c) => (c ? '1' : '0')).join('');
    return /^0*1+0*$/.test(s) || !s.includes('1');
  };
  for (let y = 0; y < H; y++) if (!oneRun([...Array(W)].map((_, x) => inside(x, y)))) return false;
  for (let x = 0; x < W; x++) if (!oneRun([...Array(H)].map((_, y) => inside(x, y)))) return false;
  return true;
}

/** Şeklin döndürmeye (isteğe göre ters çevirmeye) göre değişmeyen adı: yönlerinin en küçük imzası. */
export const canonOf = (pts: Pt[], flips: boolean) => orientations(pts, flips).map(sig).sort()[0];
/** Şeklin olduğu gibi (yalnızca kaydırmaya göre) adı. */
export const exactOf = (pts: Pt[]) => sig(pts);

/**
 * Doğru seçenekte, ekranda doğru şekildeki yönünden başka bir yöne döndürülmüş gösterilen en az parça sayısı (parçalarla
 * çizilen bölgeler arasındaki bütün eşleşmeler üstünden).
 */
export function minRotated(option: string, pieces: Pt[][]): number | null {
  const drawn = [...parts(option).values()];
  let best: number | null = null;
  const used = pieces.map(() => false);
  const rec = (i: number, n: number) => {
    if (best !== null && n >= best) return;
    if (i === drawn.length) {
      best = n;
      return;
    }
    for (let j = 0; j < pieces.length; j++) {
      if (used[j] || !congruent(drawn[i], pieces[j], false)) continue;
      used[j] = true;
      rec(i + 1, n + (sameByTranslation(drawn[i], pieces[j]) ? 0 : 1));
      used[j] = false;
    }
  };
  rec(0, 0);
  return best;
}

/** Dış hattın kenarları: kare kenarları (birim) ve köşegen kenarlar (birim köşegen) "eksen|köşegen" olarak. */
export function edgesOf(pts: Pt[]): string {
  const set = new Set(pts.map(key));
  const ring: Pt[] = [
    [3, 1],
    [5, 3],
    [3, 5],
    [1, 3],
  ];
  const across: Pt[] = [
    [3, -1],
    [7, 3],
    [3, 7],
    [-1, 3],
  ];
  let ax = 0;
  let dg = 0;
  for (const [x, y] of pts) {
    const cx = Math.floor(x / 6) * 6;
    const cy = Math.floor(y / 6) * 6;
    const at = ring.findIndex(([a, b]) => a === x - cx && b === y - cy);
    if (!set.has(key([cx + across[at][0], cy + across[at][1]]))) ax++;
    for (const nb of [ring[(at + 1) % 4], ring[(at + 3) % 4]]) if (!set.has(key([cx + nb[0], cy + nb[1]]))) dg++;
  }
  return `${ax}|${dg / 2}`;
}

/** Bir metindeki cümleler (nokta, soru ya da ünlemden sonra büyük harf ya da rakamla başlayan yerde bölünür). */
export const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9“"])/u).filter(Boolean);
/** 22 sözcükten uzun cümleler. */
export const longSentences = (text: string, max = 22) => sentences(text).filter((s) => s.split(/\s+/).length > max);
