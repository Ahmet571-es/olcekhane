import type { TowerState } from './types';

/**
 * Kule görevinin ortak parçaları (tarayıcıda ve sunucuda aynı). Düzen, her çubuktaki topların alttan üste harfleridir
 * (ör. `['KM', 'S', '']`: soldaki çubukta altta kırmızı, üstünde mavi; ortadaki çubukta sarı; sağdaki çubuk boş).
 * Çubuklar 0–2 (soldan sağa) ile numaralanır; tarayıcının gönderdiği hamlelerde 1–3 kullanılır (`towerCode`).
 */

/** Çubukların alabileceği top sayısı: soldaki 3, ortadaki 2, sağdaki 1 (Shallice, 1982). */
export const TOWER_CAPACITY = [3, 2, 1] as const;

export type TowerBall = 'K' | 'M' | 'S';
export const TOWER_BALL_ORDER: TowerBall[] = ['K', 'M', 'S'];

/**
 * Topların adı ve çizim renkleri (açık ve koyu temada aynı; tahta her zaman açık zeminde çizilir). Renkleri ayırt etmekte
 * zorlananlar için her topun üstünde adının ilk harfi yazar.
 */
export const TOWER_BALLS: Record<TowerBall, { name: string; fill: string; ink: string }> = {
  K: { name: 'kırmızı', fill: '#d8382c', ink: '#ffffff' },
  M: { name: 'mavi', fill: '#2f5ce0', ink: '#ffffff' },
  S: { name: 'sarı', fill: '#f2c200', ink: '#1f2937' },
};

/** Çubukların adları (yönergede ve ekran okuyucu metinlerinde). */
export const TOWER_PEGS = ['soldaki', 'ortadaki', 'sağdaki'] as const;

/** Bir problemde en çok bu kadar hamle yapılabilir; sonra problem çözülmemiş sayılır. */
export const TOWER_MAX_MOVES = 60;

/** Düzenin kurallara uyup uymadığı: üç top birer kez, çubuklar alabileceğinden fazla top taşımaz. */
export function towerValid(s: TowerState): boolean {
  if (s.length !== 3) return false;
  if (s.some((peg, i) => peg.length > TOWER_CAPACITY[i] || /[^KMS]/.test(peg))) return false;
  return [...s.join('')].sort().join('') === 'KMS';
}

/** Hamle: `from` çubuğundaki en üstteki topu `to` çubuğuna taşır (0–2). Kurala aykırıysa `null`. */
export function towerMove(s: TowerState, from: number, to: number): TowerState | null {
  if (from === to || from < 0 || from > 2 || to < 0 || to > 2) return null;
  if (s[from].length === 0 || s[to].length >= TOWER_CAPACITY[to]) return null;
  const next = [...s] as [string, string, string];
  const ball = next[from].slice(-1);
  next[from] = next[from].slice(0, -1);
  next[to] = next[to] + ball;
  return next;
}

export const towerSame = (a: TowerState, b: TowerState) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/** Tarayıcının gönderdiği hamle: 10 × (nereden) + (nereye), çubuklar 1–3 (ör. 13: soldakinden sağdakine). */
export const towerCode = (from: number, to: number) => (from + 1) * 10 + (to + 1);
export function towerDecode(code: number): [number, number] | null {
  const from = Math.floor(code / 10) - 1;
  const to = (code % 10) - 1;
  if (!Number.isInteger(code) || from < 0 || from > 2 || to < 0 || to > 2 || from === to) return null;
  return [from, to];
}

/** Düzenin sözle anlatımı (ekran okuyucu için): "soldaki çubukta alttan üste kırmızı, mavi; ortadaki çubuk boş; ...". */
export function towerSpeech(s: TowerState): string {
  return s
    .map((peg, i) =>
      peg.length === 0
        ? `${TOWER_PEGS[i]} çubuk boş`
        : peg.length === 1
          ? `${TOWER_PEGS[i]} çubukta ${TOWER_BALLS[peg as TowerBall].name}`
          : `${TOWER_PEGS[i]} çubukta alttan üste ${[...peg].map((b) => TOWER_BALLS[b as TowerBall].name).join(', ')}`,
    )
    .join('; ');
}
