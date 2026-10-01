/**
 * Görev uyaranlarının belirlenimci üretimi: sabit bir tohumdan (seed) her seferinde aynı deneme sırası ve aynı
 * yerleşim çıkar. Böylece herkes aynı denemeleri görür, sunucu da tarayıcıyla aynı uyaranları bilir. Bir üretim
 * kuralı değişirse o görevi kullanan testin sürüm numarası artırılmalıdır.
 */

/** Küçük, belirlenimci rastgele sayı üreteci (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Hücreleri, her adımda kurala uyan kalan hücrelerden rastgele birini seçerek sıralar; tıkanırsa baştan dener.
 * `ok(önceki, aday)`: aday, o ana kadarki sıranın sonuna eklenebilir mi?
 */
export function constrainedOrder<T>(cells: readonly T[], rand: () => number, ok: (before: T[], next: T) => boolean): T[] {
  for (let attempt = 0; attempt < 5000; attempt++) {
    const pool = [...cells];
    const out: T[] = [];
    while (pool.length) {
      const options: number[] = [];
      for (let i = 0; i < pool.length; i++) if (ok(out, pool[i])) options.push(i);
      if (!options.length) break;
      const pick = options[Math.floor(rand() * options.length)];
      out.push(pool[pick]);
      pool.splice(pick, 1);
    }
    if (out.length === cells.length) return out;
  }
  throw new Error('Kurallara uyan bir deneme sırası üretilemedi.');
}

export interface Point {
  x: number;
  y: number;
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** Bir noktanın bir doğru parçasına uzaklığı. */
export function segmentDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy });
}

/** İki doğru parçası birbirini kesiyor mu? Ucu ortak olan (art arda gelen) parçalar için kullanılmaz. */
export function segmentsCross(a: Point, b: Point, c: Point, d: Point): boolean {
  const side = (p: Point, q: Point, r: Point) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  return side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0;
}

/** Sırayla birleştirme yerleşiminin kuralları (0–100 arası yüzde koordinatlarda). */
export const TRAIL_RULES = {
  /** Dairelerin kenara en yakın merkez uzaklığı. */
  margin: 9,
  /** İki dairenin merkezleri arasındaki en küçük uzaklık. */
  minGap: 15,
  /** Sıradaki iki daire arasındaki uzaklık: ne yan yana ne de çok uzak. */
  step: [18, 52] as const,
  /** Birleştirme çizgisi başka bir dairenin merkezine bundan fazla yaklaşmaz (çizgi dairelerin üstünden geçmez). */
  clearance: 8,
};

const r1 = (v: number) => Math.round(v * 10) / 10;

/** Toplam yol uzunluğu: sıradaki daireler arasındaki uzaklıkların toplamı. */
export function pathLength(pts: readonly Point[]): number {
  let sum = 0;
  for (let i = 1; i < pts.length; i++) sum += dist(pts[i - 1], pts[i]);
  return sum;
}

/**
 * Bir yerleşimin kurallara uymadığı yerler (boşsa uyar): daireler kenara ve birbirine çok yakın değil, sıradaki
 * daire ne yan yana ne çok uzak, birleştirme çizgisi başka bir dairenin üstünden geçmez ve çizgiler birbirini kesmez.
 * Noktalar 0,1'e yuvarlandığı için küçük bir pay bırakılır.
 */
export function trailLayoutProblems(pts: readonly Point[]): string[] {
  const { margin, minGap, step, clearance } = TRAIL_RULES;
  const out: string[] = [];
  pts.forEach((p, i) => {
    if (p.x < margin - 0.1 || p.x > 100 - margin + 0.1 || p.y < margin - 0.1 || p.y > 100 - margin + 0.1) out.push(`daire ${i} kenara çok yakın`);
    for (let j = i + 1; j < pts.length; j++) if (dist(p, pts[j]) < minGap - 0.2) out.push(`daire ${i} ile ${j} çok yakın`);
  });
  for (let i = 1; i < pts.length; i++) {
    const [a, b] = [pts[i - 1], pts[i]];
    const d = dist(a, b);
    if (d < step[0] - 0.2 || d > step[1] + 0.2) out.push(`adım ${i} uzunluğu ${d.toFixed(1)}`);
    pts.forEach((p, k) => {
      if (k !== i && k !== i - 1 && segmentDistance(p, a, b) < clearance - 0.3) out.push(`çizgi ${i - 1}-${i}, daire ${k} üstünden geçiyor`);
    });
    for (let j = 1; j + 1 < i; j++) if (segmentsCross(pts[j - 1], pts[j], a, b)) out.push(`çizgi ${j - 1}-${j} ile ${i - 1}-${i} kesişiyor`);
  }
  return out;
}

/**
 * Sırayla birleştirme yerleşimi: noktalar sırayla yerleştirilir. Her yeni nokta bir öncekinden belirli bir
 * uzaklıktadır, diğer bütün noktalardan yeterince uzaktır; iki nokta arasındaki çizgi başka bir dairenin üstünden
 * geçmez ve önceki çizgileri kesmez. Tıkanırsa yerleşim baştan kurulur.
 */
export function trailLayout(n: number, rand: () => number): Point[] {
  const { margin, minGap, step, clearance } = TRAIL_RULES;
  const span = 100 - 2 * margin;
  for (let attempt = 0; attempt < 20_000; attempt++) {
    const pts: Point[] = [{ x: r1(margin + rand() * span), y: r1(margin + rand() * span) }];
    let stuck = false;
    while (pts.length < n && !stuck) {
      const prev = pts[pts.length - 1];
      let placed = false;
      for (let tries = 0; tries < 400 && !placed; tries++) {
        const angle = rand() * Math.PI * 2;
        const r = step[0] + rand() * (step[1] - step[0]);
        const c = { x: prev.x + Math.cos(angle) * r, y: prev.y + Math.sin(angle) * r };
        if (c.x < margin || c.x > 100 - margin || c.y < margin || c.y > 100 - margin) continue;
        if (pts.some((p) => dist(p, c) < minGap)) continue;
        // Yeni çizgi eski dairelerin üstünden, eski çizgiler de yeni dairenin üstünden geçmesin.
        if (pts.slice(0, -1).some((p) => segmentDistance(p, prev, c) < clearance)) continue;
        let blocked = false;
        for (let i = 0; i + 1 < pts.length && !blocked; i++) if (segmentDistance(c, pts[i], pts[i + 1]) < clearance) blocked = true;
        // Yeni çizgi önceki çizgileri kesmesin (bir önceki çizgiyle yalnızca ucu ortaktır).
        for (let i = 0; i + 2 < pts.length && !blocked; i++) if (segmentsCross(pts[i], pts[i + 1], prev, c)) blocked = true;
        if (blocked) continue;
        pts.push({ x: r1(c.x), y: r1(c.y) });
        placed = true;
      }
      if (!placed) stuck = true;
    }
    // Yuvarlamadan sonra da kurallar geçerli olsun.
    if (pts.length === n && trailLayoutProblems(pts).length === 0) return pts;
  }
  throw new Error('Sırayla birleştirme yerleşimi üretilemedi.');
}

/**
 * Yerleşimin, karenin ters köşegenine göre yansıması: daireler arasındaki bütün uzaklıklar, yol uzunluğu ve
 * kurallar aynen korunur, ama yerleşim başka görünür. İki bölümün yolu böylece birebir aynı uzunlukta olur.
 */
export function mirrorLayout(pts: readonly Point[]): Point[] {
  return pts.map((p) => ({ x: r1(100 - p.y), y: r1(100 - p.x) }));
}

/* ---------- Geriye dönük hatırlama (n-geri düzeni) ---------- */

/**
 * Bir harfin n-geri dizisindeki rolü: hedef (n önceki harfle aynı; basılır), tuzak (iki geri bölümünde bir önceki
 * harfle aynı; basılmaz ama tanıdık geldiği için yanıltır) ya da diğer.
 */
export type NBackRole = 'target' | 'lure' | 'other';

/** Rolleri harflerden çıkarır; puanlama da bunu kullanır (tarayıcının söylediğine değil, harflere bakılır). */
export function nBackRoles(letters: readonly string[], n: number): NBackRole[] {
  return letters.map((l, i) => (i >= n && letters[i - n] === l ? 'target' : n > 1 && i >= 1 && letters[i - 1] === l ? 'lure' : 'other'));
}

/**
 * n-geri dizisi. Önce roller sıralanır: bölümün başında en az bir karşılaştırma hedefsiz geçer (ilk hedef bir geride en
 * erken üçüncü, iki geride en erken dördüncü harftir); hedef ve tuzak yalnızca "diğer" bir harfin aynısı olabilir:
 * hedefin n önceki harfi, tuzağın bir önceki harfi diğer harftir (aynı harf zincirleme tekrarlanmasın: bir geride K K K,
 * iki geride K M K S K gibi); tuzaktan hemen sonra hedef gelmez (hedef aynı zamanda bir önceki harfin aynısı olmasın).
 * Sonra harfler rollere göre seçilir: hedef n önceki harfin, tuzak bir önceki harfin aynısıdır; diğer harfler son üç
 * harften farklıdır (yanlışlıkla hedef ya da tuzak oluşmasın) ve aralarından o ana kadar en az kullanılanlardan biri
 * seçilir (harfler dizide dengeli dağılsın).
 */
export function nBackSequence(
  opts: { n: 1 | 2; length: number; targets: number; lures: number; letters: readonly string[] },
  rand: () => number,
): string[] {
  const { n, length, targets, lures, letters } = opts;
  if (n === 1 && lures > 0) throw new Error('Bir geri bölümünde tuzak olmaz.');
  const cells: NBackRole[] = [
    ...Array<NBackRole>(targets).fill('target'),
    ...Array<NBackRole>(lures).fill('lure'),
    ...Array<NBackRole>(length - targets - lures).fill('other'),
  ];
  for (let attempt = 0; attempt < 200; attempt++) {
    const roles = constrainedOrder(cells, rand, (before, next) => {
      const i = before.length;
      const last = before[i - 1];
      if (next === 'target') return i > n && before[i - n] === 'other' && last !== 'lure';
      if (next === 'lure') return i >= 2 && last === 'other';
      return true;
    });
    const out: string[] = [];
    const used = new Map(letters.map((l) => [l, 0]));
    roles.forEach((role, i) => {
      if (role === 'target') out.push(out[i - n]);
      else if (role === 'lure') out.push(out[i - 1]);
      else {
        const recent = new Set(out.slice(Math.max(0, i - 3)));
        const pool = letters.filter((l) => !recent.has(l));
        const least = Math.min(...pool.map((l) => used.get(l)!));
        const pick = pool.filter((l) => used.get(l) === least);
        out.push(pick[Math.floor(rand() * pick.length)]);
      }
      used.set(out[i], used.get(out[i])! + 1);
    });
    // Roller, harflerden yeniden çıkarıldığında da aynı olmalı.
    const back = nBackRoles(out, n);
    if (back.every((r, i) => r === roles[i])) return out;
  }
  throw new Error('Kurallara uyan bir n-geri dizisi üretilemedi.');
}
