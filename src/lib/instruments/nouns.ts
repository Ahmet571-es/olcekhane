import type { LikertInstrument } from './types';

/**
 * Likert testlerinde maddelerin adı: ilgi ve etkinlik testlerinde maddeler birer etkinliktir ("Müze gezmek"), öteki
 * testlerde cümledir ("Sohbeti genellikle ben başlatırım."). Test sayfasında ("92 etkinlik") ve atlanan maddeler
 * anlatılırken ("3 etkinliği atlamışsın") kullanılır.
 */
export type ItemNoun = 'etkinlik' | 'cümle';

export function likertItemNoun(def: Pick<LikertInstrument, 'profile'>): ItemNoun {
  return def.profile === 'riasec' || def.profile === 'interests' || def.profile === 'activities' ? 'etkinlik' : 'cümle';
}

/** Belirtme hâli: "etkinliği", "cümleyi". */
export const ITEM_NOUN_ACCUSATIVE: Record<ItemNoun, string> = { etkinlik: 'etkinliği', cümle: 'cümleyi' };

/** Çoğul: "etkinlikler", "cümleler". */
export const ITEM_NOUN_PLURAL: Record<ItemNoun, string> = { etkinlik: 'etkinlikler', cümle: 'cümleler' };
