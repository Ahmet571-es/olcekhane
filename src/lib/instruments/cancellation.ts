import type { CancellationTask } from './types';

/**
 * Harf işaretleme görevinin sayfaları. Hem tarayıcıda (sayfayı çizmek için) hem sunucuda (aynı sayfayı
 * yeniden üretip puanlamak için) kullanılır; bu yüzden saf ve belirlenimcidir. Sayfa, uygulama
 * kimliğinden türetilen tohumla üretilir: her uygulamanın sayfası farklıdır, aynı uygulamanınki her
 * zaman aynıdır.
 *
 * Her bölümde:
 * - satır başına hedef sayısı task.targetsPerRow değerlerinden eşit sayıda satıra dağıtılır (ör. 1, 2
 *   ve 3 hedefli satırlar eşit sayıda): bölümdeki toplam hedef sayısı sabittir, ama öğrenci "her satırda
 *   iki tane var" diye aramayı erken bırakamaz;
 * - aranan harfler eşit sıklıkta kullanılır;
 * - çeldiriciler karıştırılmış tam turlar hâlinde, eşit sıklıkta gelir ve yan yana aynı harf olmaz.
 */

/** 32 bitlik FNV-1a özeti: metinden tohum. */
export function seedFrom(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Küçük, belirlenimci rastgele sayı üreteci (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function section(task: CancellationTask, rand: () => number): string[] {
  const { rows, columns, targetsPerRow, targets, distractors } = task;
  const counts = shuffle(
    Array.from({ length: rows }, (_, r) => targetsPerRow[r % targetsPerRow.length]),
    rand,
  );
  const total = counts.reduce((a, b) => a + b, 0);
  const targetLetters = shuffle(
    Array.from({ length: total }, (_, i) => targets[i % targets.length]),
    rand,
  );
  let pool: string[] = [];
  const nextDistractor = (avoid: string | undefined): string => {
    if (pool.length === 0 || (pool.length === 1 && pool[0] === avoid)) pool = [...pool, ...shuffle(distractors, rand)];
    const k = pool.findIndex((l) => l !== avoid);
    return pool.splice(k, 1)[0];
  };
  const out: string[] = [];
  let ti = 0;
  for (let r = 0; r < rows; r++) {
    const at = new Set(shuffle(Array.from({ length: columns }, (_, c) => c), rand).slice(0, counts[r]));
    for (let c = 0; c < columns; c++) {
      out.push(at.has(c) ? targetLetters[ti++] : nextDistractor(out[out.length - 1]));
    }
  }
  return out;
}

/** Uygulamanın bütün bölümleri: bölüm başına rows × columns harf, satır satır soldan sağa. */
export function cancellationSheet(task: CancellationTask, seed: string): string[][] {
  const rand = rng(seedFrom(`${seed}:${task.key}:${task.generator}`));
  return Array.from({ length: task.sections }, () => section(task, rand));
}

export function isTarget(task: CancellationTask, letter: string): boolean {
  return task.targets.includes(letter);
}
