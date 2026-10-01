import { constrainedOrder } from './sequences';
import type { ReactionTrial } from './types';

/**
 * Tepki hızı görevinin deneme düzeni. Bu dosyadaki üretim kuralları değişirse testin sürüm numarası artırılmalıdır.
 */

/**
 * Daireden önceki bekleme 1 ile 3 saniye arasındadır: dört eşit aralığın (1–1,5, 1,5–2, 2–2,5, 2,5–3 saniye) her
 * birine eşit sayıda deneme düşer; aralığın içindeki değer 10 ms adımlarla rastgele seçilir. Böylece dairenin ne zaman
 * belireceği kestirilemez, beklemeler de bölüm boyunca dengeli kalır.
 */
export const REACTION_WAIT_BINS = [1000, 1500, 2000, 2500] as const;
export const REACTION_WAIT_WIDTH = 500;

/** Beklemenin düştüğü aralığın başlangıcı (ms). */
export const waitBin = (waitMs: number) => REACTION_WAIT_BINS[Math.min(REACTION_WAIT_BINS.length - 1, Math.floor((waitMs - 1000) / REACTION_WAIT_WIDTH))];

/**
 * Bir bölümün denemeleri: her kutu ve her bekleme aralığı `each` kez. Sıra kuralları: aynı bekleme aralığı en çok 2 kez,
 * (seçmeli bölümde) daire aynı kutuda en çok 3 kez art arda gelir.
 */
export function reactionTrials(boxes: 1 | 2, each: number, rand: () => number): ReactionTrial[] {
  const cells: { bin: number; box: number }[] = [];
  for (let box = 0; box < boxes; box++) {
    for (const bin of REACTION_WAIT_BINS) {
      for (let k = 0; k < each; k++) cells.push({ bin, box });
    }
  }
  const ordered = constrainedOrder(cells, rand, (before, next) => {
    let sameBin = 0;
    for (let i = before.length - 1; i >= 0 && before[i].bin === next.bin; i--) sameBin++;
    if (sameBin >= 2) return false;
    let sameBox = 0;
    for (let i = before.length - 1; i >= 0 && before[i].box === next.box; i--) sameBox++;
    return boxes === 1 || sameBox < 3;
  });
  return ordered.map(({ bin, box }) => ({ box, waitMs: bin + Math.floor(rand() * (REACTION_WAIT_WIDTH / 10)) * 10 }));
}
