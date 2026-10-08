import { onAltiFaktorKisilikRoadmap } from './16-faktorlu-kisilik';
import { altiBoyutluKisilikRoadmap } from './alti-boyutlu-kisilik';
import { ayrintiliKisilikRoadmap } from './ayrintili-kisilik';
import { besFaktorRoadmap } from './bes-faktor';
import { calismaAliskanliklariRoadmap } from './calisma-aliskanliklari';
import { duygusalZekaBilesenleriRoadmap } from './duygusal-zeka-bilesenleri';
import { TASK_ROADMAPS } from './gorevler';
import { hobiIlgileriRoadmap } from './hobi-ilgileri';
import { kisilerarasiTarzRoadmap } from './kisilerarasi-tarz';
import { matematikRoadmap } from './matematik';
import { meslekIlgiAlanlariRoadmap } from './meslek-ilgi-alanlari';
import { meslekiIlgiProfiliRoadmap } from './mesleki-ilgi-profili';
import { okumaRoadmap } from './okuma';
import { ozSaygiRoadmap } from './oz-saygi';
import { sesliOkumaRoadmap, type OralRoadmapTemplate } from './sesli-okuma';
import type { AcademicRoadmapTemplate, InterestRoadmapTemplate, ReadingRoadmapTemplate, RoadmapTemplate } from './types';

export { TASK_ROADMAPS };

/** Gelişim yol haritası olan testler. */
export const ROADMAPS: Record<string, RoadmapTemplate> = {
  'bes-faktor-kisilik': besFaktorRoadmap,
  'ayrintili-kisilik-profili': ayrintiliKisilikRoadmap,
  'alti-boyutlu-kisilik-profili': altiBoyutluKisilikRoadmap,
  'duygusal-zeka-bilesenleri': duygusalZekaBilesenleriRoadmap,
  'kisilerarasi-tarz': kisilerarasiTarzRoadmap,
  '16-faktorlu-kisilik-profili': onAltiFaktorKisilikRoadmap,
  'oz-saygi': ozSaygiRoadmap,
  'calisma-aliskanliklari': calismaAliskanliklariRoadmap,
};

/**
 * Uzman incelemesindeki yol haritaları: yalnızca önizleme bağlantısıyla (`/testler/<adres>/coz?onizleme=yol-haritasi`)
 * gösterilir; herkese açık raporda yer almaz. Site sahibinin 2026-10-07 kararıyla yol haritaları hoca onayı beklenmeden
 * yayına alınır; hoca yayındaki metinleri inceleyip düzeltme ister. Liste, bir yol haritasının yayından önce ayrıca
 * gösterilmesi istenirse diye kalır.
 */
export const ROADMAP_IN_REVIEW = new Set<string>([]);

/** Çözme sayfasının adresindeki önizleme seçimi (`?onizleme=`). */
export const ROADMAP_PREVIEW_PARAM = 'yol-haritasi';

/** İlgi testlerinin yol haritaları: ders çalışma yerine ilgilerin nasıl keşfedileceği (lib/reports/interest-roadmap.ts). */
export const INTEREST_ROADMAPS: Record<string, InterestRoadmapTemplate> = {
  'mesleki-ilgi-profili': meslekiIlgiProfiliRoadmap,
  'meslek-ilgi-alanlari': meslekIlgiAlanlariRoadmap,
  'hobi-ve-serbest-zaman-ilgileri': hobiIlgileriRoadmap,
};

/** Konu tarama testlerinin yol haritaları: konu alanlarına göre çalışma planı (lib/reports/academic-roadmap.ts). */
export const ACADEMIC_ROADMAPS: Record<string, AcademicRoadmapTemplate> = {
  'matematik-konu-tarama-testi': matematikRoadmap,
};

/** Okuma testinin yol haritası: okuma becerilerine göre öneriler (lib/reports/reading-roadmap.ts). */
export const READING_ROADMAPS: Record<string, ReadingRoadmapTemplate> = {
  'okuma-hizi-ve-anlama': okumaRoadmap,
};

/** Sesli okumanın yol haritası: okumanın yönlerine göre öneriler (lib/reports/oral-roadmap.ts). */
export const ORAL_ROADMAPS: Record<string, OralRoadmapTemplate> = {
  'sesli-okuma-degerlendirmesi': sesliOkumaRoadmap,
};

/** Testin gelişim yol haritası şablonu var mı (kişilik, ilgi, konu tarama, okuma ya da zihinsel görev)? */
export function hasRoadmap(slug: string): boolean {
  return !!(ROADMAPS[slug] ?? INTEREST_ROADMAPS[slug] ?? ACADEMIC_ROADMAPS[slug] ?? READING_ROADMAPS[slug] ?? TASK_ROADMAPS[slug] ?? ORAL_ROADMAPS[slug]);
}

/** Herkese açık raporda gelişim yol haritası var mı (şablonu var ve incelemede değil)? */
export function hasPublicRoadmap(slug: string): boolean {
  return hasRoadmap(slug) && !ROADMAP_IN_REVIEW.has(slug);
}

/** Test sayfasındaki tanıtım: yol haritasının bu testte hangi bölümlerden oluştuğu. */
export function roadmapSummary(slug: string): string {
  if (ACADEMIC_ROADMAPS[slug]) {
    return 'parmakla döndürülebilen üç boyutlu profil, konu alanlarına göre çalışma önerileri, haftalık çalışma düzeni, veliye destek önerileri ve yanlış yapılan sorulardan başlayan dört haftalık plan';
  }
  if (ORAL_ROADMAPS[slug]) {
    return 'parmakla döndürülebilen üç boyutlu profil, okumanın yönlerine göre çalışma önerileri, okuma alışkanlığı için öneriler, veliye destek önerileri ve dört haftalık küçük adımlar';
  }
  if (READING_ROADMAPS[slug]) {
    return 'parmakla döndürülebilen üç boyutlu profil, okuma becerilerine göre çalışma önerileri, okuma alışkanlığı için öneriler, veliye destek önerileri ve dört haftalık küçük adımlar';
  }
  const task = TASK_ROADMAPS[slug];
  if (task) return `${task.what.summary}, bilmekte yarar olanlar, veliye yaklaşım önerileri ve dört haftalık küçük adımlar`;
  const it = INTEREST_ROADMAPS[slug];
  if (it) {
    const parts = [
      ...(Object.keys(it.areas).length >= 3 ? ['parmakla döndürülebilen üç boyutlu profil'] : []),
      it.what.summary,
      ...(Object.values(it.areas).some((x) => x.paths) ? ['ilişkili eğitim yolları'] : []),
      'veliye yaklaşım önerileri',
    ];
    return `${parts.join(', ')} ve dört haftalık keşif adımları`;
  }
  const t = ROADMAPS[slug];
  const parts = [
    ...(Object.keys(t.scales).length >= 3 ? ['parmakla döndürülebilen üç boyutlu profil'] : []),
    t.focus ? 'en belirgin boyutlara göre nasıl çalışılabileceğine dair öneriler' : 'nasıl çalışılabileceğine dair öneriler',
    ...(Object.values(t.scales).some((x) => x.settings) ? ['rahat edilebilecek ortamlar'] : []),
    'veliye yaklaşım önerileri',
  ];
  return `${parts.join(', ')} ve dört haftalık küçük adımlar`;
}
