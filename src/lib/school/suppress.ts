/**
 * Grup raporlarında küçük grupların korunması.
 *
 * - Tek bir özellik için sayılar (ör. bir hata türünü yapan öğrenci sayısı) 1 ya da 2 ise gösterilmez.
 * - Toplamı bilinen sıralı dağılımlarda (düzeylere göre öğrenci sayıları) hücre gizlemek yetmez:
 *   gizli hücreler toplamdan ve kuraldan geriye doğru hesaplanabilir. Veriye göre değişen birleştirmeler
 *   de (ör. küçük düzeyi komşusuna katmak) kural bilindiğinde tersine çözülebilir. Bu yüzden düzeyler
 *   sabit bir basamak dizisine göre birleştirilir ve her grubun 0 ya da en az 3 olduğu en ince basamak
 *   gösterilir; hiçbiri uymazsa dağılım gösterilmez. Beş düzeyde ara basamak “düşük uç / orta / yüksek
 *   uç”tur; üç düzeyde ara basamak yoktur (iki gruba bölmek bakışımsız olur ve sayıyı ele verir).
 */
export const SUPPRESS_BELOW = 3;

/** null: gösterilmeyen küçük sayı (1–2 öğrenci). */
export type Cell = number | null;

export function suppress(count: number): Cell {
  return count > 0 && count < SUPPRESS_BELOW ? null : count;
}

export interface BandCell {
  key: string;
  label: string;
  count: number;
}

const LADDERS: Record<number, number[][][]> = {
  5: [
    [[0], [1], [2], [3], [4]],
    [[0, 1], [2], [3, 4]],
  ],
  3: [[[0], [1], [2]]],
};

/** Güvenli dağılım: her grubu 0 ya da en az 3 olan en ince basamak; yoksa null (dağılım gösterilmez). */
export function safeBands(cells: BandCell[]): BandCell[] | null {
  const levels = LADDERS[cells.length] ?? [cells.map((_, i) => [i])];
  for (const level of levels) {
    const groups = level.map((idx) => ({
      key: idx.map((i) => cells[i].key).join('+'),
      label: idx.length > 1 ? `${cells[idx[0]].label} – ${cells[idx[idx.length - 1]].label}` : cells[idx[0]].label,
      count: idx.reduce((sum, i) => sum + cells[i].count, 0),
    }));
    if (groups.every((g) => g.count === 0 || g.count >= SUPPRESS_BELOW)) return groups;
  }
  return null;
}
