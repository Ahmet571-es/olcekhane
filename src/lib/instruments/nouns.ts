import type { LikertInstrument } from './types';

/**
 * Likert testlerinde maddelerin adı: ilgi ve etkinlik testlerinde maddeler birer etkinliktir ("Müze gezmek"), değer
 * testinde bir işin özelliğini anlatan birer ifadedir ("İyi para kazanmak"), öteki testlerde cümledir ("Sohbeti
 * genellikle ben başlatırım."). Test sayfasında ("92 etkinlik") ve atlanan maddeler anlatılırken ("3 etkinliği
 * atlamışsın") kullanılır.
 */
export type ItemNoun = 'etkinlik' | 'cümle' | 'ifade';

export function likertItemNoun(def: Pick<LikertInstrument, 'profile'>): ItemNoun {
  if (def.profile === 'values') return 'ifade';
  return def.profile === 'riasec' || def.profile === 'interests' || def.profile === 'activities' ? 'etkinlik' : 'cümle';
}

/** Belirtme hâli: "etkinliği", "cümleyi", "ifadeyi". */
export const ITEM_NOUN_ACCUSATIVE: Record<ItemNoun, string> = { etkinlik: 'etkinliği', cümle: 'cümleyi', ifade: 'ifadeyi' };

/** Çoğul: "etkinlikler", "cümleler", "ifadeler". */
export const ITEM_NOUN_PLURAL: Record<ItemNoun, string> = { etkinlik: 'etkinlikler', cümle: 'cümleler', ifade: 'ifadeler' };

/** Yönelme hâli: "etkinliğe", "cümleye", "ifadeye". */
export const ITEM_NOUN_DATIVE: Record<ItemNoun, string> = { etkinlik: 'etkinliğe', cümle: 'cümleye', ifade: 'ifadeye' };

/** İlgi hâli: "etkinliğin", "cümlenin", "ifadenin". */
export const ITEM_NOUN_GENITIVE: Record<ItemNoun, string> = { etkinlik: 'etkinliğin', cümle: 'cümlenin', ifade: 'ifadenin' };

/** Ek fiille: "etkinliktir", "cümledir", "ifadedir". */
export const ITEM_NOUN_COPULA: Record<ItemNoun, string> = { etkinlik: 'etkinliktir', cümle: 'cümledir', ifade: 'ifadedir' };

/** Bir maddenin adıyla, iyelik ve yönelme: “…” cümlesine, “…” etkinliğine, “…” ifadesine. */
export const ITEM_NOUN_POSS_DATIVE: Record<ItemNoun, string> = { etkinlik: 'etkinliğine', cümle: 'cümlesine', ifade: 'ifadesine' };

/** Vasıta hâli: "etkinlikle", "cümleyle", "ifadeyle". */
export const ITEM_NOUN_INSTRUMENTAL: Record<ItemNoun, string> = { etkinlik: 'etkinlikle', cümle: 'cümleyle', ifade: 'ifadeyle' };
