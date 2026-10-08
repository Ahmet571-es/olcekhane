import { HOLE_R, PAPER, sameHoles, type Pt } from '@/lib/instruments/folding';

/** Deliklerin kâğıt kenarından en az bu kadar içeride olması gerekir (birim). */
export const EDGE_MARGIN = HOLE_R + 0.4;
/** Aynı seçenekteki iki deliğin merkezleri arasındaki en küçük uzaklık. */
export const HOLE_GAP = 2 * HOLE_R + 0.5;

/** Bir sorunun seçeneklerindeki sorunlar: kenara taşan ya da birbirine değen delik, aynı ya da boş seçenek. */
export function optionProblems(options: readonly (readonly Pt[])[]): string[] {
  const out: string[] = [];
  options.forEach((o, i) => {
    if (o.length === 0) out.push(`${i + 1}. seçenek boş`);
    for (const p of o) {
      if (p[0] < EDGE_MARGIN || p[1] < EDGE_MARGIN || p[0] > PAPER - EDGE_MARGIN || p[1] > PAPER - EDGE_MARGIN) out.push(`${i + 1}. seçenekte kenara taşan delik ${p}`);
    }
    for (let a = 0; a < o.length; a++)
      for (let b = a + 1; b < o.length; b++)
        if (Math.hypot(o[a][0] - o[b][0], o[a][1] - o[b][1]) < HOLE_GAP) out.push(`${i + 1}. seçenekte birbirine değen delikler ${o[a]} / ${o[b]}`);
    // Seçenekler birbirinden açıkça ayrılır: yalnızca bir iki birimlik kaymayla ayrılan iki seçenek görme keskinliğini ölçer.
    for (let j = 0; j < i; j++) if (sameHoles(o, options[j], 1.6)) out.push(`${j + 1}. ve ${i + 1}. seçenek aynı ya da çok benzer`);
  });
  return out;
}

const near = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.5;
const common = (a: readonly Pt[], b: readonly Pt[]) => a.filter((p) => b.some((q) => near(p, q))).length;
/** Kâğıdın orta çizgilerine ve köşegenlerine göre simetri sayısı (0–4). */
const symmetry = (x: readonly Pt[]) =>
  [(p: Pt): Pt => [PAPER - p[0], p[1]], (p: Pt): Pt => [p[0], PAPER - p[1]], (p: Pt): Pt => [p[1], p[0]], (p: Pt): Pt => [PAPER - p[1], PAPER - p[0]]].filter((f) =>
    sameHoles(x.map(f), x),
  ).length;

/** Değerler büyükten küçüğe sıralanınca doğru seçeneğin her sırada seçilme olasılığı (eşitlikte paylaşılır). */
function rankProb(vals: number[], k: number): number[] {
  const first = [...vals].sort((a, b) => b - a).indexOf(vals[k]);
  const size = vals.filter((v) => v === vals[k]).length;
  return vals.map((_, r) => (r >= first && r < first + size ? 1 / size : 0));
}

/**
 * Soruyu çözmeden seçen birinin basit yolları ve her birinde doğru seçeneği bulma olasılığı: seçenekleri delik sayısına ya
 * da öteki seçeneklerle ortak delik sayısına göre sıralayıp hep aynı sıradakini seçmek, en sık görülen delik sayısını,
 * en simetrik seçeneği, öteki seçenekleri en çok ya da en az kapsayan seçeneği seçmek.
 */
export function guessStrategies(options: readonly (readonly Pt[])[], k: number): Record<string, number> {
  const opts = options.map((o) => [...o]);
  const shared = opts.map((x, i) => opts.reduce((a, y, j) => a + (j === i ? 0 : common(x, y)), 0));
  const counts = opts.map((x) => x.length);
  const freq = counts.map((c) => counts.filter((d) => d === c).length);
  const sup = opts.map((x, i) => opts.filter((y, j) => j !== i && common(y, x) === y.length).length);
  const out: Record<string, number> = {};
  rankProb(shared, k).forEach((p, r) => (out[`ortak delik ${r + 1}. sıra`] = p));
  rankProb(counts, k).forEach((p, r) => (out[`delik sayısı ${r + 1}. sıra`] = p));
  out['en sık delik sayısı'] = rankProb(freq, k)[0];
  out['en simetrik'] = rankProb(opts.map(symmetry), k)[0];
  out['en çok kapsayan'] = rankProb(sup, k)[0];
  out['en az kapsayan'] = rankProb(sup, k)[opts.length - 1];
  return out;
}
