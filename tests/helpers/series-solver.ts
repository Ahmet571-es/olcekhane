/**
 * Sayı dizileri için bağımsız çözücü (tests/sayi-dizileri.test.ts): eksik yere -2000 ile 9999 arasındaki her sayıyı
 * koyar ve dizinin bütünü sık kullanılan dizi kurallarından birine uyuyor mu diye bakar. Bir kural ancak bilinen
 * sayılar onu belirlemeye yetiyorsa sayılır (bilinen sayı adedi, kuralın serbest değişken sayısından fazla olmalı);
 * yoksa her sayı bir kurala "uyar". Böylece bir dizinin tek doğru cevabı olduğu, dizinin bilinen sayılarına uyan her
 * kuralın aynı sayıyı vermesiyle denetlenir.
 */

type Seq = number[];

const diffs = (s: Seq) => s.slice(1).map((x, i) => x - s[i]);
const allEqual = (s: Seq) => s.every((x) => x === s[0]);
/** Sabit oran: her ardışık üçlüde b² = a·c ve sıfır yok (oran kesirli de olabilir). */
const geometric = (s: Seq) => s.length >= 2 && s.every((x) => x !== 0) && s.slice(2).every((x, i) => s[i + 1] * s[i + 1] === s[i] * x);
/** Aynı işlem (sabit fark ya da sabit oran) uygulanan geçişler. */
function sameOp(pairs: [number, number][]): boolean {
  if (pairs.length === 0) return true;
  const add = pairs.every(([a, b]) => b - a === pairs[0][1] - pairs[0][0]);
  const mul = pairs.every(([a, b]) => a !== 0 && b * pairs[0][0] === pairs[0][1] * a);
  return add || mul;
}

interface Family {
  name: string;
  /** Serbest değişken sayısı (başlangıç sayıları dahil). */
  params: number;
  fits: (s: Seq) => boolean;
}

const FAMILIES: Family[] = [
  { name: 'sabit fark', params: 2, fits: (s) => allEqual(diffs(s)) },
  { name: 'sabit oran', params: 2, fits: geometric },
  { name: 'farklar sabit farkla değişir (2. derece)', params: 3, fits: (s) => allEqual(diffs(diffs(s))) },
  { name: '3. derece', params: 4, fits: (s) => allEqual(diffs(diffs(diffs(s)))) },
  { name: 'farklar sabit oranla değişir', params: 3, fits: (s) => geometric(diffs(s)) },
  { name: 'farklar önceki iki farkın toplamı', params: 3, fits: (s) => diffs(s).every((d, i, ds) => i < 2 || d === ds[i - 1] + ds[i - 2]) },
  {
    name: 'farklar ardışık kareler',
    params: 2,
    fits: (s) => {
      const ds = diffs(s);
      if (ds.some((d) => d < 0 || !Number.isInteger(Math.sqrt(d)))) return false;
      const roots = ds.map((d) => Math.sqrt(d));
      return roots.every((r, i) => i === 0 || r === roots[i - 1] + 1);
    },
  },
  { name: 'önceki iki sayının toplamı', params: 2, fits: (s) => s.every((x, i) => i < 2 || x === s[i - 1] + s[i - 2]) },
  { name: 'önceki iki sayının toplamı + sabit', params: 3, fits: (s) => allEqual(s.slice(2).map((x, i) => x - s[i + 1] - s[i])) },
  { name: 'önceki üç sayının toplamı', params: 3, fits: (s) => s.every((x, i) => i < 3 || x === s[i - 1] + s[i - 2] + s[i - 3]) },
  // a(n+1) = k·a(n) + b; k tam sayı (−5…5) olduğundan serbest değişkenler başlangıç ve b'dir. (Kesirli k, farkların sabit
  // oranla değişmesiyle aynı şeydir; yukarıda vardır.)
  ...[-5, -4, -3, -2, -1, 2, 3, 4, 5].map(
    (k): Family => ({ name: `${k} katı + sabit`, params: 2, fits: (s) => allEqual(s.slice(1).map((x, i) => x - k * s[i])) }),
  ),
  // a(n) = p·a(n−1) + q·a(n−2); p ve q küçük tam sayılar (önceki iki sayının toplamı p = q = 1'dir).
  ...[-2, -1, 1, 2, 3].flatMap((p) =>
    [-2, -1, 1, 2, 3].map(
      (q): Family => ({ name: `${p}·önceki + ${q}·bir önceki`, params: 2, fits: (s) => s.every((x, i) => i < 2 || x === p * s[i - 1] + q * s[i - 2]) }),
    ),
  ),
];

/** Bir alt dizinin (iç içe dizilerden biri) uyabileceği kurallar. */
const SUB_FAMILIES = FAMILIES.filter((f) => ['sabit fark', 'sabit oran'].includes(f.name) || f.name.endsWith('katı + sabit'));

export interface Prediction {
  rule: string;
  value: number;
}

/** Bilinen sayılara uyan her kural ve eksik yer için önerdiği sayı. */
export function predictSeries(terms: (number | null)[]): Prediction[] {
  const gap = terms.indexOf(null);
  if (gap < 0 || terms.indexOf(null, gap + 1) >= 0) throw new Error('Dizide tam bir eksik sayı olmalı.');
  const known = terms.length - 1;
  const out: Prediction[] = [];
  for (let v = -2000; v <= 9999; v++) {
    const s = terms.map((t) => (t === null ? v : t));
    for (const f of FAMILIES) if (known >= f.params + 1 && f.fits(s)) out.push({ rule: f.name, value: v });
    // İç içe iki dizi: eksik sayının bulunduğu alt dizi (tek ya da çift sıradakiler) bir kurala uyar.
    const sub = s.filter((_, i) => i % 2 === gap % 2);
    for (const f of SUB_FAMILIES) if (sub.length - 1 >= f.params + 1 && f.fits(sub)) out.push({ rule: `iç içe: ${f.name}`, value: v });
    // Sırayla değişen iki (ya da üç) işlem: aynı sıradaki geçişlerin her biri kendi içinde aynı işlem (sabit fark ya da
    // oran); her işlem bilinen sayılar arasındaki en az iki geçişte görülür.
    const steps = s.slice(1).map((x, i) => [s[i], x] as [number, number]);
    for (const period of [2, 3]) {
      const knownSteps = (p: number) => steps.filter((_, i) => i % period === p && i !== gap && i + 1 !== gap);
      const classes = Array.from({ length: period }, (_, p) => p);
      if (classes.every((p) => knownSteps(p).length >= 2 && sameOp(steps.filter((_, i) => i % period === p)))) {
        out.push({ rule: period === 2 ? 'sırayla değişen iki işlem' : 'sırayla değişen üç işlem', value: v });
      }
    }
  }
  return out;
}

/** Önerilen sayıların kümesi (küçükten büyüğe). */
export const predictedValues = (terms: (number | null)[]) => [...new Set(predictSeries(terms).map((p) => p.value))].sort((a, b) => a - b);

/**
 * Daha basit bir kuralla bulunan yanlış cevaplar (yalnızca son sayı eksikken), bulunuş yollarıyla:
 *  - dizinin yalnızca bir bölümüne uyan bir kural: son farkı aynen eklemek, son işlemi (tam sayıyla çarpma) tekrarlamak,
 *    dizinin başındaki en az üç sayıya uyan oranı sürdürmek, iç içe dizilerde öteki dizinin sıradaki sayısını yazmak;
 *  - kuralın bir adımını atlamak: dizi k·a + b kuralına uyuyorsa yalnızca k katını almak, önceki üç sayının toplamına
 *    uyuyorsa yalnızca son iki sayıyı toplamak.
 */
export function partialRuleValues(terms: (number | null)[]): { value: number; why: string }[] {
  const s = terms.slice(0, -1) as number[];
  const n = s.length;
  const last = s[n - 1];
  const prev = s[n - 2];
  const out: { value: number; why: string }[] = [{ value: last + (last - prev), why: 'son farkı tekrarlamak' }];
  if (prev !== 0 && last % prev === 0) out.push({ value: last * (last / prev), why: 'son işlemi tekrarlamak' });
  if (s[0] !== 0 && s[1] % s[0] === 0) {
    const r = s[1] / s[0];
    let k = 1;
    while (k < n && s[k] === s[k - 1] * r) k++;
    if (k >= 3 && k < n) out.push({ value: last * r, why: `dizinin başına uyan ${r} katını sürdürmek` });
  }
  const other = s.filter((_, i) => i % 2 === (n - 1) % 2);
  if (other.length >= 3) {
    const m = other.length;
    if (allEqual(diffs(other))) out.push({ value: other[m - 1] + (other[m - 1] - other[m - 2]), why: 'öteki dizinin sıradaki sayısı' });
    if (geometric(other)) out.push({ value: (other[m - 1] * other[m - 1]) / other[m - 2], why: 'öteki dizinin sıradaki sayısı' });
  }
  for (const k of [2, 3, 4, 5]) {
    const b = s[1] - k * s[0];
    if (b !== 0 && s.every((x, i) => i === 0 || x === k * s[i - 1] + b)) out.push({ value: k * last, why: `${k} katı + ${b} yerine yalnızca ${k} katı` });
  }
  if (n >= 5 && s.every((x, i) => i < 3 || x === s[i - 1] + s[i - 2] + s[i - 3])) out.push({ value: last + prev, why: 'üç yerine iki sayının toplamı' });
  return out;
}
