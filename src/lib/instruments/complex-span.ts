import type { ComplexSpanOp, ComplexSpanTask } from './types';

/**
 * Hesapla ve hatırla görevinin ortak hesapları: işlemin metni ve doğruluğu, kişiye göre işlem süre sınırı. Hem tarayıcıda
 * (çözme ekranı) hem sunucuda (puanlama) kullanılır.
 */

/** Ekranda gösterilen işlem: "(3 × 4) − 2 = 10". */
export function opText(op: ComplexSpanOp): string {
  const [a, b, sign, c, shown] = op;
  return `(${a} × ${b}) ${sign > 0 ? '+' : '−'} ${c} = ${shown}`;
}

/** İşlemin gösterilen sonucu doğru mu? */
export const opTrue = (op: ComplexSpanOp): boolean => op[0] * op[1] + op[2] * op[3] === op[4];

/** Hatırlama ekranında "Boş" düğmesinin değeri: harf listesinin uzunluğu (harflerin sırası 0'dan başlar). */
export const blankOf = (task: Pick<ComplexSpanTask, 'letters'>) => task.letters.length;

/**
 * Kişiye göre işlem süre sınırı (ms): alıştırmada işlemlere verilen cevapların süre ortalaması + `factor` × standart sapma
 * (Unsworth ve ark., 2005'teki düzen; aktaran Đokić ve ark., 2018), [minMs, maxMs] arasında. Süre alınamazsa üst sınır.
 */
export function opLimitMs(rts: readonly number[], limit: ComplexSpanTask['limit']): number {
  const xs = rts.filter((x) => Number.isFinite(x) && x > 0);
  if (xs.length < 3) return limit.maxMs;
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / (xs.length - 1));
  return Math.round(Math.min(limit.maxMs, Math.max(limit.minMs, mean + limit.factor * sd)));
}
