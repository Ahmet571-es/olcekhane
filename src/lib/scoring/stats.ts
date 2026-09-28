/** İstatistik yardımcıları: normal dağılım, yüzdelik, güven aralığı. */

/** Hata fonksiyonu (Abramowitz ve Stegun 7.1.26), mutlak hata < 1.5e-7. */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

/** Standart normal birikimli dağılım fonksiyonu. */
export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Ölçmenin standart hatası: SH = SS × √(1 − güvenirlik). */
export function standardError(sd: number, reliability: number): number {
  const r = Math.min(Math.max(reliability, 0), 0.999);
  return sd * Math.sqrt(1 - r);
}

export const Z90 = 1.6449;

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export function round(v: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

export function mean(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
}

export function median(values: number[]): number {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Cronbach alfa: k/(k−1) × (1 − Σ madde varyansı / toplam puan varyansı). Satır = kişi, sütun = madde. */
export function cronbachAlpha(matrix: number[][]): number | null {
  const rows = matrix.filter((r) => r.every((v) => Number.isFinite(v)));
  if (rows.length < 3) return null;
  const k = rows[0].length;
  if (k < 2) return null;
  const itemVars = Array.from({ length: k }, (_, j) => variance(rows.map((r) => r[j])));
  const totalVar = variance(rows.map((r) => r.reduce((s, v) => s + v, 0)));
  if (totalVar === 0) return null;
  return (k / (k - 1)) * (1 - itemVars.reduce((s, v) => s + v, 0) / totalVar);
}

/** Pearson korelasyonu. */
export function pearson(x: number[], y: number[]): number | null {
  if (x.length !== y.length || x.length < 3) return null;
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}
