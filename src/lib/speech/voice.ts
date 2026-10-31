/**
 * Raporu sesli dinle: yalnızca cihazın kendi konuşma özelliğinin Türkçe sesi kullanılır. Bazı tarayıcıların sesleri (ör.
 * masaüstü Chrome'daki "Google Türkçe") metni okumak için bir sunucuya gönderdiklerini `localService === false` ile bildirir;
 * bunlar hiçbir zaman seçilmez. Yalnızca `localService === true` olan ve dili Türkçe (tr, tr-TR) olan sesler seçilir; böyle
 * bir ses yoksa rapor sesli okunmaz (başka dilde ya da ağdaki bir sese geçilmez). Sınır: tarayıcının "yerel" dediği bir sesin
 * cihazın konuşma motorunda nasıl üretildiğini sayfa denetleyemez (ör. Android'de Türkçe ses paketi yoksa motor çevrim içi
 * sese ya da başka bir dile geçebilir); site metni hiçbir yere göndermez.
 */
export const sameVoice = (a: VoiceLike, b: VoiceLike) => (a.voiceURI && b.voiceURI ? a.voiceURI === b.voiceURI : a.name === b.name && a.lang === b.lang);

export interface VoiceLike {
  name: string;
  /** Sesin kimliği (tarayıcıda SpeechSynthesisVoice.voiceURI); yoksa ad ve dil kullanılır. */
  voiceURI?: string;
  lang: string;
  localService: boolean;
  default?: boolean;
}

const TURKISH = /^tr(?:[-_]|$)/i;
const TURKISH_TR = /^tr[-_]tr$/i;

/** Cihazdaki (localService) Türkçe ses mi? */
export const isLocalTurkish = (v: VoiceLike) => v.localService === true && TURKISH.test(v.lang);

/** Kullanılabilecek ses: cihazdaki (localService) Türkçe ses; tr-TR ve cihazın varsayılan sesi öncelikli. Yoksa null. */
export function pickTurkishVoice<T extends VoiceLike>(voices: readonly T[]): T | null {
  const local = voices.filter(isLocalTurkish);
  if (local.length === 0) return null;
  const tr = local.filter((v) => TURKISH_TR.test(v.lang));
  const pool = tr.length > 0 ? tr : local;
  return pool.find((v) => v.default) ?? pool[0];
}
