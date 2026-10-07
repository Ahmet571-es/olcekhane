import { altiBoyutluKisilikRoadmap } from './alti-boyutlu-kisilik';
import { ayrintiliKisilikRoadmap } from './ayrintili-kisilik';
import { besFaktorRoadmap } from './bes-faktor';
import { duygusalZekaBilesenleriRoadmap } from './duygusal-zeka-bilesenleri';
import { kisilerarasiTarzRoadmap } from './kisilerarasi-tarz';
import type { RoadmapTemplate } from './types';

/** Gelişim yol haritası olan testler. */
export const ROADMAPS: Record<string, RoadmapTemplate> = {
  'bes-faktor-kisilik': besFaktorRoadmap,
  'ayrintili-kisilik-profili': ayrintiliKisilikRoadmap,
  'alti-boyutlu-kisilik-profili': altiBoyutluKisilikRoadmap,
  'duygusal-zeka-bilesenleri': duygusalZekaBilesenleriRoadmap,
  'kisilerarasi-tarz': kisilerarasiTarzRoadmap,
};

/**
 * Uzman incelemesindeki yol haritaları: yalnızca önizleme bağlantısıyla (`/testler/<adres>/coz?onizleme=yol-haritasi`)
 * gösterilir; herkese açık raporda yer almaz. Hoca onaylayınca test buradan çıkarılır (Beş Faktör, Ayrıntılı Kişilik ve
 * Altı Boyutlu Kişilik: 2026-10-07).
 */
export const ROADMAP_IN_REVIEW = new Set<string>(['duygusal-zeka-bilesenleri', 'kisilerarasi-tarz']);

/** Çözme sayfasının adresindeki önizleme seçimi (`?onizleme=`). */
export const ROADMAP_PREVIEW_PARAM = 'yol-haritasi';

/** Herkese açık raporda gelişim yol haritası var mı (şablonu var ve incelemede değil)? */
export function hasPublicRoadmap(slug: string): boolean {
  return !!ROADMAPS[slug] && !ROADMAP_IN_REVIEW.has(slug);
}
