/**
 * Mantıksal akıl yürütme sorularının bağımsız denetleyicisi (tests/mantiksal-akil-yurutme.test.ts). Her soru burada
 * biçimsel olarak yeniden yazılır; denetleyici bilgilere uyan BÜTÜN olası dünyaları (hangi özellik birleşimlerinin dolu
 * olduğu ve adı geçen bireyin nerede durduğu) tek tek dener ve sonucun her dünyada mı (kesin), bazısında mı (olabilir)
 * yoksa hiçbirinde mi (yanlış) doğru olduğunu bulur. Biçimsel yazımın sorunun Türkçe metniyle aynı şeyi söylediği gözle
 * denetlenir: her kaydın yanında sorunun bilgileri ve sonucu yazılıdır.
 *
 * Koşullu kurallar ("Eğer bir kart yıldızlıysa arkası mavidir") bireyler hakkında "bütün" cümlesi gibi yazılır: yıldızlı
 * her kartın arkası mavidir. Günlük dildeki gibi adı geçen her özelliğin en az bir şeyde var olduğu varsayılır.
 */

export type Verdict = 'kesin' | 'olabilir' | 'yanlış';

type S = { all: [string, string] } | { no: [string, string] } | { some: [string, string] } | { is: [string, string] } | { not: [string, string] };

interface Spec {
  sets: string[];
  premises: S[];
  conclusion: S;
}

const X = 'x';
const all = (a: string, b: string): S => ({ all: [a, b] });
const no = (a: string, b: string): S => ({ no: [a, b] });
const some = (a: string, b: string): S => ({ some: [a, b] });
const is = (a: string): S => ({ is: [X, a] });
const not = (a: string): S => ({ not: [X, a] });

/** Soruların biçimsel yazımı (anahtar: sorunun anahtarı). */
export const LOGIC_FORMAL: Record<string, Spec> = {
  // Alıştırma. Eğer bir kutu kırmızıysa içinde top vardır. Bu kutu kırmızı. → Bu kutuda top vardır.
  map1: {
    sets: ['kırmızı', 'toplu'],
    premises: [all('kırmızı', 'toplu'), is('kırmızı')],
    conclusion: is('toplu'),
  },
  // Bazı kutular boştur. Bu bir kutudur. → Bu kutu boştur.
  map2: {
    sets: ['kutu', 'boş'],
    premises: [some('kutu', 'boş'), is('kutu')],
    conclusion: is('boş'),
  },
  // Bütün atlar mavidir. Duman bir attır. → Duman mavidir.
  map3: {
    sets: ['at', 'mavi'],
    premises: [all('at', 'mavi'), is('at')],
    conclusion: is('mavi'),
  },

  // Eğer bir kartın önünde yıldız varsa, o kartın arkası mavidir. Elif'in kartının önünde yıldız var. → arkası mavidir.
  ma01: {
    sets: ['yıldızlı', 'arkasıMavi'],
    premises: [all('yıldızlı', 'arkasıMavi'), is('yıldızlı')],
    conclusion: is('arkasıMavi'),
  },
  // Bütün köpekler havlar. Karabaş bir köpektir. → Karabaş havlar.
  ma02: {
    sets: ['köpek', 'havlar'],
    premises: [all('köpek', 'havlar'), is('köpek')],
    conclusion: is('havlar'),
  },
  // Eğer bir balon kırmızıysa, içinde hediye vardır. Mert'in balonunun içinde hediye var. → Mert'in balonu kırmızıdır.
  ma03: {
    sets: ['kırmızı', 'hediyeli'],
    premises: [all('kırmızı', 'hediyeli'), is('hediyeli')],
    conclusion: is('kırmızı'),
  },
  // Bütün kuşlar su altında nefes alabilir. Güvercin bir kuştur. → Güvercin su altında nefes alabilir.
  ma04: {
    sets: ['kuş', 'suAltıNefes'],
    premises: [all('kuş', 'suAltıNefes'), is('kuş')],
    conclusion: is('suAltıNefes'),
  },
  // Bütün balıklar yüzebilir. Ördek yüzebilir. → Ördek bir balıktır.
  ma05: {
    sets: ['balık', 'yüzer'],
    premises: [all('balık', 'yüzer'), is('yüzer')],
    conclusion: is('balık'),
  },
  // Eğer bir çiçek fuşa ise, yaprakları mordur. Bu çiçek bir fuşa değil. → Bu çiçeğin yaprakları mor değildir.
  ma06: {
    sets: ['fuşa', 'morYapraklı'],
    premises: [all('fuşa', 'morYapraklı'), not('fuşa')],
    conclusion: not('morYapraklı'),
  },
  // Eğer bir bitki zemzer ise, yaprakları yuvarlaktır. Bu bitkinin yaprakları yuvarlak değil. → Bu bitki bir zemzer değildir.
  ma07: {
    sets: ['zemzer', 'yuvarlak'],
    premises: [all('zemzer', 'yuvarlak'), not('yuvarlak')],
    conclusion: not('zemzer'),
  },
  // Bütün kuşların kanatları vardır. Kartalın kanatları vardır. → Kartal bir kuştur.
  ma08: {
    sets: ['kuş', 'kanatlı'],
    premises: [all('kuş', 'kanatlı'), is('kanatlı')],
    conclusion: is('kuş'),
  },
  // Hiçbir taş canlı değildir. Çakıl bir taştır. → Çakıl canlı değildir.
  ma09: {
    sets: ['taş', 'canlı'],
    premises: [no('taş', 'canlı'), is('taş')],
    conclusion: not('canlı'),
  },
  // Eğer bir hayvan tilpi ise, kulakları turuncudur. Pıtı bir tilpidir. → Pıtı'nın kulakları turuncudur.
  ma10: {
    sets: ['tilpi', 'turuncuKulaklı'],
    premises: [all('tilpi', 'turuncuKulaklı'), is('tilpi')],
    conclusion: is('turuncuKulaklı'),
  },
  // Hiçbir kedi miyavlamaz. Pamuk bir kedidir. → Pamuk miyavlamaz.
  ma11: {
    sets: ['kedi', 'miyavlar'],
    premises: [no('kedi', 'miyavlar'), is('kedi')],
    conclusion: not('miyavlar'),
  },
  // Eğer bir hayvan lupu ise, kuyruğu çizgilidir. Bu hayvanın kuyruğu çizgili. → Bu hayvan bir lupudur.
  ma12: {
    sets: ['lupu', 'çizgiliKuyruk'],
    premises: [all('lupu', 'çizgiliKuyruk'), is('çizgiliKuyruk')],
    conclusion: is('lupu'),
  },
  // Bütün balıklar suda yaşar. Kedi bir balık değildir. → Kedi suda yaşamaz.
  ma13: {
    sets: ['balık', 'sudaYaşar'],
    premises: [all('balık', 'sudaYaşar'), not('balık')],
    conclusion: not('sudaYaşar'),
  },
  // Eğer bir mektup Kuzey Kasabası'na gidiyorsa, zarfı sarıdır. Bu mektubun zarfı sarı değil. → Kuzey Kasabası'na gitmiyor.
  ma14: {
    sets: ['kuzeye', 'sarıZarf'],
    premises: [all('kuzeye', 'sarıZarf'), not('sarıZarf')],
    conclusion: not('kuzeye'),
  },
  // Bütün arabaların tekerleği vardır. Bisiklet bir araba değildir. → Bisikletin tekerleği yoktur.
  ma15: {
    sets: ['araba', 'tekerlekli'],
    premises: [all('araba', 'tekerlekli'), not('araba')],
    conclusion: not('tekerlekli'),
  },
  // Eğer bir balık pelzi ise, pulları yeşildir. Bu balık bir pelzi değil. → Bu balığın pulları yeşil değildir.
  ma16: {
    sets: ['pelzi', 'yeşilPullu'],
    premises: [all('pelzi', 'yeşilPullu'), not('pelzi')],
    conclusion: not('yeşilPullu'),
  },
  // Bütün kediler memelidir. Bütün memeliler hayvandır. → Bütün kediler hayvandır.
  ma17: {
    sets: ['kedi', 'memeli', 'hayvan'],
    premises: [all('kedi', 'memeli'), all('memeli', 'hayvan')],
    conclusion: all('kedi', 'hayvan'),
  },
  // Eğer bir kapı yeşil anahtarla açılıyorsa, ardında bahçe vardır. Bu kapının ardında bahçe var. → yeşil anahtarla açılır.
  ma18: {
    sets: ['yeşilAnahtar', 'bahçeli'],
    premises: [all('yeşilAnahtar', 'bahçeli'), is('bahçeli')],
    conclusion: is('yeşilAnahtar'),
  },
  // Eğer bir kutudan zil sesi geliyorsa, o kutuda altın vardır. Üçüncü kutudan zil sesi geliyor. → Üçüncü kutuda altın vardır.
  ma19: {
    sets: ['zilli', 'altınlı'],
    premises: [all('zilli', 'altınlı'), is('zilli')],
    conclusion: is('altınlı'),
  },
  // Bütün güller çiçektir. Bazı çiçekler kırmızıdır. → Bazı güller kırmızıdır.
  ma20: {
    sets: ['gül', 'çiçek', 'kırmızı'],
    premises: [all('gül', 'çiçek'), some('çiçek', 'kırmızı')],
    conclusion: some('gül', 'kırmızı'),
  },
  // Bütün köpekler balıktır. Bütün balıklar uçabilir. → Bütün köpekler uçabilir.
  ma21: {
    sets: ['köpek', 'balık', 'uçar'],
    premises: [all('köpek', 'balık'), all('balık', 'uçar')],
    conclusion: all('köpek', 'uçar'),
  },
  // Eğer bir dolabın kapısı maviyse, içinde battaniye vardır. Bu dolabın kapısı mavi değil. → Bu dolapta battaniye yoktur.
  ma22: {
    sets: ['maviKapı', 'battaniyeli'],
    premises: [all('maviKapı', 'battaniyeli'), not('maviKapı')],
    conclusion: not('battaniyeli'),
  },
  // Bütün atlar hayvandır. Bazı hayvanlar kanatlıdır. → Bazı atlar kanatlıdır.
  ma23: {
    sets: ['at', 'hayvan', 'kanatlı'],
    premises: [all('at', 'hayvan'), some('hayvan', 'kanatlı')],
    conclusion: some('at', 'kanatlı'),
  },
  // Bütün serçeler canlıdır. Bütün kuşlar canlıdır. → Bütün serçeler kuştur.
  ma24: {
    sets: ['serçe', 'canlı', 'kuş'],
    premises: [all('serçe', 'canlı'), all('kuş', 'canlı')],
    conclusion: all('serçe', 'kuş'),
  },
  // Eğer bir şişenin kapağı kırmızıysa, üstünde yıldız vardır. Bu şişenin üstünde yıldız yok. → kapağı kırmızı değildir.
  ma25: {
    sets: ['kırmızıKapak', 'yıldızResimli'],
    premises: [all('kırmızıKapak', 'yıldızResimli'), not('yıldızResimli')],
    conclusion: not('kırmızıKapak'),
  },
  // Eğer bir bitki dorpa ise, çiçekleri beyazdır. Bahçedeki bitki bir dorpadır. → Bahçedeki bitkinin çiçekleri beyazdır.
  ma26: {
    sets: ['dorpa', 'beyazÇiçekli'],
    premises: [all('dorpa', 'beyazÇiçekli'), is('dorpa')],
    conclusion: is('beyazÇiçekli'),
  },
  // Bütün ağaçlar yürüyebilir. Çam yürüyemez. → Çam bir ağaç değildir.
  ma27: {
    sets: ['ağaç', 'yürür'],
    premises: [all('ağaç', 'yürür'), not('yürür')],
    conclusion: not('ağaç'),
  },
  // Eğer bir böcek melgi ise, sırtında üç benek vardır. Bu böceğin sırtında üç benek var. → Bu böcek bir melgidir.
  ma28: {
    sets: ['melgi', 'üçBenekli'],
    premises: [all('melgi', 'üçBenekli'), is('üçBenekli')],
    conclusion: is('melgi'),
  },
  // Bütün kuşların gagası vardır. Kedinin gagası yoktur. → Kedi bir kuş değildir.
  ma29: {
    sets: ['kuş', 'gagalı'],
    premises: [all('kuş', 'gagalı'), not('gagalı')],
    conclusion: not('kuş'),
  },
  // Eğer bir gemi yıldızlı bayrak taşıyorsa, limana sabah girer. Bu gemi yıldızlı bayrak taşımıyor. → sabah girmez.
  ma30: {
    sets: ['yıldızlıBayrak', 'sabahGirer'],
    premises: [all('yıldızlıBayrak', 'sabahGirer'), not('yıldızlıBayrak')],
    conclusion: not('sabahGirer'),
  },
  // Bütün balıklar canlıdır. Bütün ağaçlar canlıdır. → Bütün balıklar ağaçtır.
  ma31: {
    sets: ['balık', 'canlı', 'ağaç'],
    premises: [all('balık', 'canlı'), all('ağaç', 'canlı')],
    conclusion: all('balık', 'ağaç'),
  },
  // Eğer bir hayvan nimbo ise, gözleri yeşildir. Bu hayvanın gözleri yeşil değil. → Bu hayvan bir nimbo değildir.
  ma32: {
    sets: ['nimbo', 'yeşilGözlü'],
    premises: [all('nimbo', 'yeşilGözlü'), not('yeşilGözlü')],
    conclusion: not('nimbo'),
  },
};

/** Bir dünyada cümlenin doğruluğu: `regions` dolu özellik birleşimleri (bit maskesi), `at` bireyin birleşimi. */
function holds(s: S, sets: string[], regions: number[], at: number): boolean {
  const bit = (a: string) => {
    const i = sets.indexOf(a);
    if (i < 0) throw new Error(`Bilinmeyen özellik: ${a}`);
    return 1 << i;
  };
  if ('all' in s) return regions.every((r) => !(r & bit(s.all[0])) || !!(r & bit(s.all[1])));
  if ('no' in s) return regions.every((r) => !(r & bit(s.no[0])) || !(r & bit(s.no[1])));
  if ('some' in s) return regions.some((r) => !!(r & bit(s.some[0])) && !!(r & bit(s.some[1])));
  if ('is' in s) return !!(at & bit(s.is[1]));
  return !(at & bit(s.not[1]));
}

/** Bilgilere uyan bütün dünyalarda sonucun hükmü ve bu dünyaların sayısı. */
export function logicVerdict(key: string): {
  verdict: Verdict;
  worlds: number;
} {
  const spec = LOGIC_FORMAL[key];
  if (!spec) throw new Error(`Biçimsel yazımı olmayan soru: ${key}`);
  const k = spec.sets.length;
  const nRegions = 1 << k;
  const truths: boolean[] = [];
  for (let mask = 1; mask < 1 << nRegions; mask++) {
    const regions = Array.from({ length: nRegions }, (_, r) => r).filter((r) => mask & (1 << r));
    // Adı geçen her özellik en az bir şeyde vardır.
    if (spec.sets.some((_, i) => !regions.some((r) => r & (1 << i)))) continue;
    for (const at of regions) {
      if (!spec.premises.every((p) => holds(p, spec.sets, regions, at))) continue;
      truths.push(holds(spec.conclusion, spec.sets, regions, at));
    }
  }
  const verdict: Verdict = truths.every(Boolean) ? 'kesin' : truths.some(Boolean) ? 'olabilir' : 'yanlış';
  return { verdict, worlds: truths.length };
}
