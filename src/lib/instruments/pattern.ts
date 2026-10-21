import type { PatternItem } from './types';

/**
 * Desen hatırlama: desenlerin yazımı ve ızgara yardımcıları.
 *
 * Bir desen satırları "/" ile ayrılmış bir yazıdır: "#" dolu, "." boş kare (ör. "##./..#": iki satır, üç sütun, üç dolu
 * kare). Kareler satır satır, sol üstten 0'dan başlayarak sıralanır.
 */
export function parsePattern(key: string, text: string): PatternItem {
  const rows = text.split('/');
  const cols = rows[0].length;
  if (rows.some((r) => r.length !== cols || /[^#.]/.test(r))) throw new Error(`Geçersiz desen: ${key}`);
  const cells: number[] = [];
  rows.forEach((r, y) => [...r].forEach((ch, x) => ch === '#' && cells.push(y * cols + x)));
  return { key, rows: rows.length, cols, cells };
}

/** Bir desenin yazımı ("##./..#"); testlerde ve hata iletilerinde kullanılır. */
export function patternText(p: Pick<PatternItem, 'rows' | 'cols' | 'cells'>): string {
  const on = new Set(p.cells);
  return Array.from({ length: p.rows }, (_, y) => Array.from({ length: p.cols }, (_, x) => (on.has(y * p.cols + x) ? '#' : '.')).join('')).join('/');
}

/** İki kare kenardan komşu mu (aynı satırda ya da sütunda yan yana)? */
export function cellsAdjacent(a: number, b: number, cols: number): boolean {
  const [ay, ax, by, bx] = [Math.floor(a / cols), a % cols, Math.floor(b / cols), b % cols];
  return Math.abs(ay - by) + Math.abs(ax - bx) === 1;
}
