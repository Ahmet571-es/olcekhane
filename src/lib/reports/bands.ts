import type { Band } from '@/lib/instruments/types';

export const DEFAULT_BAND_LABELS: Record<Band, string> = {
  very_low: 'Çok düşük',
  low: 'Düşük',
  average: 'Orta',
  high: 'Yüksek',
  very_high: 'Çok yüksek',
};

/**
 * Şablonda karşılığı olmayan düzeyi en yakın düzeye indirger. Norm etkinleşince puanlar beş
 * düzeyde yorumlanır (çok düşük … çok yüksek); yalnızca üç düzeyli metni olan ölçeklerde uç
 * düzeyler “düşük” ve “yüksek” metinleriyle anlatılır.
 */
export function nearestBand(band: Band, available: (b: Band) => boolean): Band {
  if (available(band)) return band;
  if (band === 'very_low' && available('low')) return 'low';
  if (band === 'very_high' && available('high')) return 'high';
  if (band === 'low' && available('very_low')) return 'very_low';
  if (band === 'high' && available('very_high')) return 'very_high';
  return band;
}
