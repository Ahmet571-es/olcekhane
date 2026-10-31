/**
 * Raporu sesli dinle: yalnızca cihazın kendi Türkçe sesi kullanılır. Bazı tarayıcıların sesleri (ör. masaüstü Chrome'daki
 * "Google Türkçe") metni okumak için bir sunucuya gönderir; bunların `localService` değeri false'tur. Bu yüzden yalnızca
 * `localService === true` olan ve dili Türkçe (tr, tr-TR) olan sesler seçilir; böyle bir ses yoksa rapor sesli okunmaz
 * (başka dilde ya da ağdaki bir sese geçilmez).
 */

export interface VoiceLike {
  name: string;
  lang: string;
  localService: boolean;
  default?: boolean;
}

const TURKISH = /^tr(?:[-_]|$)/i;
const TURKISH_TR = /^tr[-_]tr$/i;

/** Kullanılabilecek ses: cihazdaki (localService) Türkçe ses; tr-TR ve cihazın varsayılan sesi öncelikli. Yoksa null. */
export function pickTurkishVoice<T extends VoiceLike>(voices: readonly T[]): T | null {
  const local = voices.filter((v) => v.localService === true && TURKISH.test(v.lang));
  if (local.length === 0) return null;
  const tr = local.filter((v) => TURKISH_TR.test(v.lang));
  const pool = tr.length > 0 ? tr : local;
  return pool.find((v) => v.default) ?? pool[0];
}
