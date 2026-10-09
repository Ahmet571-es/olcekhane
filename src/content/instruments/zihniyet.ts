import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Zihniyet: Zekâ ve Öğrenme İnançları
 * Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; Dweck'in örtük zekâ kuramı ölçeğinin, Blackwell ve
 * arkadaşlarının (2007) çaba inancı maddelerinin ya da Haimovitz ve Dweck'in (2016) başarısızlık zihniyeti maddelerinin
 * çevirisi değildir. Dört alan, hepsinde yüksek puan gelişim yönündeki inancı gösterir:
 *  - Zekâya bakış: zekânın ve zihinsel becerilerin gelişebileceği inancı (örtük kuramlar: Burnette ve ark., 2013).
 *  - Çabaya bakış: çabanın ilerlettiği, zorlanmanın yeteneksizlik işareti olmadığı inancı (Blackwell, Trzesniewski ve Dweck,
 *    2007'deki olumlu çaba inançları).
 *  - Hataya bakış: hatanın ve başarısızlığın öğretici olduğu inancı (Haimovitz ve Dweck, 2016).
 *  - Zorluğa yaklaşım: zorlayıcı işleri seçme, iyi görünmek yerine öğrenmeyi önemseme (öğrenme ve performans hedefleri:
 *    Burnette ve ark., 2013).
 * Her alanda altı madde, üçü ters yönlü; birbirinin tersi beş çift. Raporda zihniyetin başarıyla ilişkisinin küçük olduğu
 * açıkça söylenir (Sisk ve ark., 2018; Burgoyne, Hambrick ve Macnamara, 2020): test bir yetenek ya da başarı testi değildir.
 * Maddeler okula özgü değildir; yetişkinlere de açıktır. Durum: pilot.
 */

const Z = 'intelligence';
const C = 'effort';
const H = 'failure';
const G = 'challenge';

/** Uygulama sırası: alanlar sırayla döner (zekâ, çaba, hata, zorluk). */
const RAW: { key: string; scale: string; text: string; reverse?: boolean }[] = [
  { key: 'Z1', scale: Z, reverse: true, text: 'Kimin ne kadar zeki olacağı daha doğarken bellidir.' },
  { key: 'C1', scale: C, text: 'Emek verdiğim konularda bunun karşılığını alırım.' },
  { key: 'H1', scale: H, text: 'Yaptığım hatalar, neyi öğrenmem gerektiğini gösterir.' },
  { key: 'G1', scale: G, text: 'Kolay işler yerine beni zorlayacak işleri seçerim.' },

  { key: 'Z2', scale: Z, text: 'İnsan, zorlandığı işlerle uğraştıkça daha zeki hâle gelebilir.' },
  { key: 'C2', scale: C, reverse: true, text: 'Bir konu için çok çalışmam gerekiyorsa, o konuda yeteneğim yok demektir.' },
  { key: 'H2', scale: H, reverse: true, text: 'Bir işte başarısız olmak, o işte ilerleme şansımı azaltır.' },
  { key: 'G2', scale: G, reverse: true, text: 'Hata yapma ihtimalim yüksekse o işe girişmem.' },

  { key: 'Z3', scale: Z, reverse: true, text: 'Zekâ boy gibidir: çalışarak artırılamaz.' },
  { key: 'C3', scale: C, text: 'Bir alanda çok iyi olan insanlar, o noktaya çoğunlukla çalışarak gelmiştir.' },
  { key: 'H3', scale: H, text: 'Kötü giden bir işten sonra neyi farklı yapabileceğimi düşünürüm.' },
  { key: 'G3', scale: G, text: 'Hemen çözemediğim sorular ilgimi çeker.' },

  { key: 'Z4', scale: Z, text: 'Çalıştıkça benim zekâm da gelişebilir.' },
  { key: 'C4', scale: C, reverse: true, text: 'Bir şeyi başkalarından daha geç öğreniyorsam, o iş bana göre değildir.' },
  { key: 'H4', scale: H, reverse: true, text: 'Bir hata yaptığımda, o işi aslında yapamayacağımı düşünürüm.' },
  { key: 'G4', scale: G, reverse: true, text: 'Başkalarının önünde zorlanacağım bir işi denemekten kaçınırım.' },

  { key: 'Z5', scale: Z, reverse: true, text: 'Matematik ya da yabancı dil gibi bazı alanlarda insanın ya kafası çalışır ya çalışmaz.' },
  { key: 'C5', scale: C, text: 'Bir konuda takıldığımda yeni bir yol denemek beni ilerletir.' },
  { key: 'H5', scale: H, text: 'Başarısızlık, daha iyi olma yolunda normal bir adımdır.' },
  { key: 'G5', scale: G, text: 'Yeni bir şey öğrenirken başta beceriksiz görünmek beni rahatsız etmez.' },

  { key: 'Z6', scale: Z, text: 'Bugün kendini pek zeki bulmayan biri, yıllar içinde çok daha zeki hâle gelebilir.' },
  { key: 'C6', scale: C, reverse: true, text: 'Doğuştan yetenekli olanların çalışmasına pek gerek yoktur.' },
  { key: 'H6', scale: H, reverse: true, text: 'Başarısız olduğum bir şeyi bir daha düşünmek bile istemem.' },
  { key: 'G6', scale: G, reverse: true, text: 'Zaten iyi olduğum şeylerle uğraşmayı, yeni şeyler denemeye tercih ederim.' },
];

export const zihniyet: LikertInstrument = {
  slug: 'zihniyet',
  version: 1,
  engine: 'likert',
  name: 'Zihniyet: Zekâ ve Öğrenme İnançları',
  shortName: 'Zihniyet',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 35.7,
  tagline: 'Zekâ, çaba, hata ve zorluk hakkında neye inandığını gösterir: gelişim mi, sabitlik mi? Araştırmaların ne dediğini abartmadan anlatır.',
  description:
    'Bu test öğrenmeyle ilgili dört inancı inceler: zekânın gelişebileceğine inanma, çabaya bakış, hataya bakış ve zorluğa yaklaşım. Rapor alanları önce birlikte yorumlar (inançlarla davranışların örtüşüp örtüşmediğine bakar), ardından her birini ayrı ayrı anlatır. “Gelişim zihniyeti” üzerine yapılan araştırmaların ne bulduğunu abartmadan söyler: zihniyetin başarıyla ilişkisi küçüktür; hedeflerle ve zorlanınca seçilen yollarla ilişkisi ise en çok zorlanma anlarında belirginleşir. Maddeler sıfırdan yazılmıştır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Öğrenme hakkında neye inanıyorsun?',
    paragraphs: [
      'Birazdan zekâ, çaba, hata ve zorluk hakkında 24 cümle göreceksin. Her birine ne kadar katıldığını seç.',
      'Doğru ya da yanlış cevap yok; bu bir yetenek testi değil. Olması gerekeni değil, gerçekten ne düşündüğünü seçersen rapor sana en çok yarar.',
    ],
  },
  prompt: 'Bu cümleye ne kadar katılıyorsun?',
  options: [
    { value: 1, label: 'Hiç katılmıyorum' },
    { value: 2, label: 'Katılmıyorum' },
    { value: 3, label: 'Kararsızım' },
    { value: 4, label: 'Katılıyorum' },
    { value: 5, label: 'Tamamen katılıyorum' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.8 },
  // Bir ondalıklı ortalamaya göre: 1,0–2,4 düşük, 2,5–3,4 orta, 3,5–5,0 yüksek (gelişim yönünde).
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'low', min: 1 },
      { band: 'average', min: 2.5 },
      { band: 'high', min: 3.5 },
    ],
  },
  oppositePairs: [
    ['Z2', 'Z1'],
    ['Z4', 'Z3'],
    ['C3', 'C6'],
    ['H1', 'H4'],
    ['G1', 'G6'],
  ],
  scales: [
    {
      key: Z,
      name: 'Zekâya bakış',
      plain: 'Zekânın ve zihinsel becerilerin öğrenerek gelişebileceğine inanma. Puan düşükse zekâ doğuştan belli ve sabit görülür.',
      poles: { low: 'Zekâ sabittir', high: 'Zekâ gelişebilir' },
    },
    {
      key: C,
      name: 'Çabaya bakış',
      plain: 'Çabanın ve yöntem değiştirmenin ilerlettiğine inanma; çok çalışmak gerekmesini yeteneksizlik işareti saymama.',
      poles: { low: 'Çaba yeteneksizlik işaretidir', high: 'Çaba ilerletir' },
    },
    {
      key: H,
      name: 'Hataya bakış',
      plain: 'Hatayı ve başarısızlığı öğrenmenin normal bir parçası, neyin öğrenileceğini gösteren bir işaret olarak görme.',
      poles: { low: 'Hata engeller', high: 'Hata öğretir' },
    },
    {
      key: G,
      name: 'Zorluğa yaklaşım',
      plain: 'Zorlayıcı işleri seçme ve iyi görünmek yerine öğrenmeyi önemseme; hata ihtimali olan işten kaçınmama.',
      poles: { low: 'Zorluktan kaçınma', high: 'Zorluğu arama' },
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). Maddeler sıfırdan yazılmıştır; başka bir ölçeğin maddeleri kullanılmamıştır. Dayanakları: zekâ hakkındaki örtük kuramlar ve bunların hedef seçimi ve zorlanınca kullanılan yollarla ilişkisi (Burnette ve ark., 2013), çaba hakkındaki inançlar (Blackwell, Trzesniewski ve Dweck, 2007) ve başarısızlığı öğretici ya da engelleyici görme (Haimovitz ve Dweck, 2016).',
    whatItMeasures:
      'Öğrenmeyle ilgili dört inancı ölçer: zekânın gelişebileceği, çabanın ilerlettiği, hatanın öğrettiği ve zorlayıcı işlerin seçilmeye değer olduğu. Her alanda yüksek puan gelişim yönündeki inancı (“gelişim zihniyeti”), düşük puan sabitlik yönündeki inancı (“sabit zihniyet”) gösterir. Rapor alanları birlikte de yorumlar: inançlarla davranışlar her zaman örtüşmez. Araştırmalarda zihniyetin akademik başarıyla ilişkisi küçük bulunmuştur (Sisk ve ark., 2018); üniversite öğrencileriyle yapılan bir araştırmada kuramın altı temel öncülünden yalnızca ikisi desteklenmiştir (Burgoyne, Hambrick ve Macnamara, 2020). Zihniyetin hedeflerle ve zorlanınca seçilen yollarla ilişkisi en çok zorlanma ve başarısızlık anlarında belirginleşir (Burnette ve ark., 2013). Bu bir yetenek ya da zekâ testi değildir.',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Her alanda altı maddenin üçü ters yönlüdür; birbirinin tersini söyleyen beş cümle çiftinden en az üçünde iki cümleye de aynı yöndeki iki seçenekten biri (“Katılıyorum” ya da “Tamamen katılıyorum”; “Hiç katılmıyorum” ya da “Katılmıyorum”) verilirse raporda “evet ya da hayır deme eğilimi” uyarısı gösterilir.',
    reliability: 'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok. Puanlar, gelişim yönündeki inancın ne kadar güçlü olduğuna göre (1: sabitlik yönünde, 5: gelişim yönünde) yorumlanır; kişi başkalarıyla karşılaştırılmaz.',
    ageNote:
      '5. sınıftan itibaren; mezunlar ve yetişkinler de çözebilir. Maddeler okula özgü değildir. Araştırmalarda zihniyetin akademik başarıyla ilişkisi çocuklarda ve ergenlerde küçük, üniversite öğrencileri gibi yetişkinlerde ise neredeyse yok bulunmuştur (Sisk ve ark., 2018).',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Kişinin kendi bildirimine dayanır; insanlar ne düşünmesi gerektiğini bildikleri için cevaplarını o yöne çekebilir.',
      'Zihniyet başarıyı tek başına belirlemez: araştırmalarda akademik başarıyla ilişkisi küçüktür (r = .10) ve kısa zihniyet çalışmalarının başarıya ortalama etkisi çok küçüktür; daha belirgin etkiler, sınırlı sayıda çalışmada, düşük gelirli ailelerden gelen ya da notları düşük öğrencilerde görülmüştür (Sisk ve ark., 2018; Yeager ve ark., 2019).',
      'İnançlar ve davranışlar her zaman örtüşmez; bu test inançları ve kendi bildirilen davranış eğilimlerini sorar, gerçek davranışı gözlemlemez.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Blackwell, L. S., Trzesniewski, K. H. ve Dweck, C. S. (2007). Implicit theories of intelligence predict achievement across an adolescent transition: A longitudinal study and an intervention. Child Development, 78(1), 246–263.',
        url: 'https://doi.org/10.1111/j.1467-8624.2007.00995.x',
      },
      {
        text: 'Burnette, J. L., O’Boyle, E. H., VanEpps, E. M., Pollack, J. M. ve Finkel, E. J. (2013). Mind-sets matter: A meta-analytic review of implicit theories and self-regulation. Psychological Bulletin, 139(3), 655–701.',
        url: 'https://doi.org/10.1037/a0029531',
      },
      {
        text: 'Haimovitz, K. ve Dweck, C. S. (2016). Parents’ views of failure predict children’s fixed and growth intelligence mind-sets. Psychological Science, 27(6), 859–869.',
        url: 'https://doi.org/10.1177/0956797616639727',
      },
      {
        text: 'Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L. ve Macnamara, B. N. (2018). To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses. Psychological Science, 29(4), 549–571.',
        url: 'https://doi.org/10.1177/0956797617739704',
      },
      {
        text: 'Burgoyne, A. P., Hambrick, D. Z. ve Macnamara, B. N. (2020). How firm are the foundations of mind-set theory? The claims appear stronger than the evidence. Psychological Science, 31(3), 258–267.',
        url: 'https://doi.org/10.1177/0956797619897588',
      },
      {
        text: 'Yeager, D. S. ve ark. (2019). A national experiment reveals where a growth mindset improves achievement. Nature, 573(7774), 364–369.',
        url: 'https://doi.org/10.1038/s41586-019-1466-y',
      },
    ],
  },
};
