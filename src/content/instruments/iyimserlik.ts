import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * İyimserlik Ölçeği
 * Kaynak: IPIP'in Optimism ölçeği (https://ipip.ori.org/newSingleConstructsKey.htm, "Optimism (Scheier, Carver, & Bridges,
 * 1994)", sayfada α .86): Scheier, Carver ve Bridges'in (1994) Yaşam Yönelimi Testi'ne (LOT-R) karşılık gelen 10 madde.
 * Kamu malıdır. Kaynaktaki 10 maddenin hepsi kullanılır.
 *
 * Madde anahtarı: o + maddenin IPIP sayfasındaki sırası (sayfa önce dört artı, sonra altı eksi yönlü maddeyi verir).
 *
 * IPIP'in karşılaştırma tablosuna (https://ipip.ori.org/newSingleConstructs.htm) göre bu 10 madde ile LOT-R arasındaki ilişki
 * .69 (ölçüm hatası düzeltildiğinde .82); iki ölçek de ABD'deki Eugene-Springfield Topluluk Örneklemi'nde yetişkinlere
 * uygulanmıştır. Bu IPIP ölçeğinin ortalamasını ve standart sapmasını veren yayımlanmış bir çalışma bulunamadı; açık veriye
 * (ESCS, Harvard Dataverse) bu oturumdan ulaşılamadı. Bu yüzden `sdRef` yok, raporda ölçüm payı gösterilmez.
 *
 * Maddelerin içeriği: IPIP ölçekleri, karşılık geldikleri ölçekle en çok ilişkili maddeler seçilerek kurulmuştur. Bu yüzden
 * on maddenin yalnızca beşi geleceğe ve hayata bakışı sorar ("Başarılı biri olacağımı biliyorum", "Hayatın iyi tarafından
 * bakarım", "Geleceğe karamsar bakarım", "Hayatımın belli bir yönü olmadığını hissederim", "Her şeyde bir zorluk görürüm");
 * ikisi kendine bakışı ("Kendimle barışığım", "Kendimden hoşlanmam"), üçü ruh hâlini ("Kendimi nadiren hüzünlü
 * hissederim", "Sık sık kendimi hüzünlü hissederim", "Sık sık keyifsiz olurum") sorar. On maddenin beşi IPIP'in NEO
 * depresyon alt ölçeğinde de yer alır (https://ipip.ori.org/newNEOFacetsKey.htm: hüzün maddeleri, "Kendimden hoşlanmam",
 * "Kendimle barışığım", "Hayatımın belli bir yönü olmadığını hissederim"). Asıl puan on maddenin
 * ortalamasıdır (`iyimserlik`, bileşik ölçek). Raporda ayrıca bu üç konunun ortalamaları gösterilir (`gelecek`,
 * `kendine_bakis`, `ruh_hali`): bunlar Ölçekhane'nin cümlelerin içeriğine göre yaptığı bir ayrımdır, ayrı birer ölçek olarak
 * geliştirilmemiş ve güvenirlikleri sınanmamıştır; bu yüzden ölçüm payı gösterilmez ve metinler kesin hüküm vermez.
 *
 * Çeviri: beş madde sitedeki öteki kişilik testlerindeki çevirilerle aynıdır ("Kendimle barışığım", "Kendimi nadiren
 * hüzünlü hissederim", "Hayatın iyi tarafından bakarım", "Kendimden hoşlanmam", "Sık sık kendimi hüzünlü hissederim");
 * beşi yeni çevrildi.
 *
 * Uygulama sırası: dört artı yönlü madde 1., 4., 7. ve 10. sıradadır, aralarında ikişer eksi yönlü madde vardır; test olumlu
 * bir maddeyle ("Hayatın iyi tarafından bakarım") başlar ve umutlu bir maddeyle ("Başarılı biri olacağımı biliyorum") biter.
 * Birbirinin tersini söyleyen ya da birbirine yakın maddeler birbirinden uzaktadır (iyi taraf–zorluk yedi, kendimle
 * barışığım–kendimden hoşlanmam beş, iki hüzün maddesi dört, sık sık hüzün–sık sık keyifsizlik üç madde arayla).
 *
 * Karşılıklı çiftler (`oppositePairs`) yoktur: birbirinin tam tersini söyleyen yalnızca iki çift ("Kendimi nadiren hüzünlü
 * hissederim" – "Sık sık kendimi hüzünlü hissederim"; "Kendimle barışığım" – "Kendimden hoşlanmam") vardır ve iki çiftle
 * uyarı tek çiftte çıkardı (dürüst cevaplarda da sık). Madde sayısı 20'den az olduğu için "hep aynı seçenek" denetimi de
 * çalışmaz; çok hızlı cevap, eksik madde ve bütün cümlelere aynı cevap (`sameAnswerCheck`; ortadaki seçenek dışında: on
 * cümlenin altısı ters yönlü olduğu için bu, cümleye bakmadan cevap vermeyi düşündürür) denetlenir.
 *
 * Madde düzeyinde destek (`supportItems`): "Sık sık kendimi hüzünlü hissederim" ya da "Kendimden hoşlanmam" cümlesine
 * "Oldukça doğru" ya da "Tamamen doğru" denirse, satırların ortalaması düşük olmasa da raporda destek kutusu açılır ve
 * kutu bunun nedenini söyler. Üç ya da iki cümlelik bir konuda ortalama tek bir cevabı gizleyebilir. Aynı nedenle bir konunun
 * cevapları iki uca ayrışırsa (biri olumlu, biri olumsuz) raporda "Farklı cevaplar" yazar (rapor şablonu: itemSplit).
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır). Türkçe çevirinin
 * güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

export const OPT = 'iyimserlik';
export const OPT_GROUPS = ['gelecek', 'kendine_bakis', 'ruh_hali'] as const;

/** [anahtar, konu, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, (typeof OPT_GROUPS)[number], boolean, string, string][] = [
  ['o04', 'gelecek', false, 'Hayatın iyi tarafından bakarım.', 'Look at the bright side of life.'],
  ['o05', 'gelecek', true, 'Geleceğe karamsar bakarım.', 'Have a dark outlook on the future.'],
  ['o08', 'ruh_hali', true, 'Sık sık kendimi hüzünlü hissederim.', 'Often feel blue.'],
  ['o02', 'kendine_bakis', false, 'Kendimle barışığım.', 'Feel comfortable with myself.'],
  ['o06', 'gelecek', true, 'Hayatımın belli bir yönü olmadığını hissederim.', 'Feel that my life lacks direction.'],
  ['o10', 'ruh_hali', true, 'Sık sık keyifsiz olurum.', 'Am often in a bad mood.'],
  ['o03', 'ruh_hali', false, 'Kendimi nadiren hüzünlü hissederim.', 'Seldom feel blue.'],
  ['o09', 'gelecek', true, 'Her şeyde bir zorluk görürüm.', 'See difficulties everywhere.'],
  ['o07', 'kendine_bakis', true, 'Kendimden hoşlanmam.', 'Dislike myself.'],
  ['o01', 'gelecek', false, 'Başarılı biri olacağımı biliyorum.', 'Just know that I will be a success.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, scale, reverse, text, source]) => ({
  key,
  scale,
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const iyimserlik: LikertInstrument = {
  slug: 'iyimserlik',
  version: 1,
  engine: 'likert',
  name: 'İyimserlik Ölçeği',
  shortName: 'İyimserlik',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 2,
  sortOrder: 15.9,
  tagline: 'Geleceğe, hayata ve kendine ne kadar umutla baktığını 10 kısa cümleyle gösterir.',
  description:
    'Araştırmacılar iyimserliği, geleceğe dair genel olarak iyi şeyler bekleme eğilimi olarak tanımlar (Carver ve ark., 2010). Bu kısa ölçek, kamu malı olan Uluslararası Kişilik Madde Havuzu’ndaki (IPIP) 10 maddelik iyimserlik ölçeğine dayanır. Cümlelerin beşi hayata ve geleceğe bakışı, ikisi kendine bakışı, üçü ruh hâlini sorar; rapor toplam puanın yanında bu üç konuyu ayrı ayrı da gösterir. Yaklaşık 2 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Tanı koymaz; bir ruh sağlığı değerlendirmesinin yerini tutmaz.',
  intro: {
    title: 'Hayata nasıl bakıyorsun?',
    paragraphs: [
      'Birazdan geleceğe, hayata ve kendine bakışınla ve ruh hâlinle ilgili 10 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok. Yalnızca bugünü değil, genellikle nasıl olduğunu düşün; en faydalı sonuç, olmak istediğin hâli değil, gerçekte nasıl olduğunu anlattığında çıkar.',
      'Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur. Yaklaşık 2 dakika sürer.',
    ],
  },
  prompt: 'Bu cümle seni ne kadar doğru anlatıyor?',
  options: [
    { value: 1, label: 'Hiç doğru değil' },
    { value: 2, label: 'Pek doğru değil' },
    { value: 3, label: 'Ne doğru ne yanlış' },
    { value: 4, label: 'Oldukça doğru' },
    { value: 5, label: 'Tamamen doğru' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.75 },
  supportItems: [
    { key: 'o08', min: 4 },
    { key: 'o07', min: 4 },
  ],
  sameAnswerCheck: true,
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'very_low', min: 1 },
      { band: 'low', min: 1.8 },
      { band: 'average', min: 2.6 },
      { band: 'high', min: 3.4 },
      { band: 'very_high', min: 4.2 },
    ],
  },
  scales: [
    {
      key: OPT,
      name: 'İyimserlik',
      plain: 'Genel olarak işlerin iyi gideceğini bekleme; hayata, geleceğe ve kendine olumlu bakma eğilimi. On cümlenin hepsinin ortalaması.',
      poles: { low: 'Daha karamsar', high: 'Daha iyimser' },
      of: [...OPT_GROUPS],
      alpha: 0.86,
    },
    {
      key: 'gelecek',
      name: 'Hayata ve geleceğe bakış',
      plain: 'Başarılı olacağına inanma, hayatın iyi tarafını görme, geleceğe karamsar bakmama ve hayatında bir yön görme. Beş cümlenin ortalaması.',
      poles: { low: 'Karamsar cevaplar', high: 'Umutlu cevaplar' },
    },
    {
      key: 'kendine_bakis',
      name: 'Kendine bakış',
      plain: 'Kendinle barışık olma ve kendinden hoşlanma. İki cümlenin ortalaması.',
      poles: { low: 'Olumsuz cevaplar', high: 'Olumlu cevaplar' },
    },
    {
      key: 'ruh_hali',
      name: 'Ruh hâli',
      plain: 'Hüzünlü ya da keyifsiz hissetmenin ne kadar sık olduğu; puan yüksekse bu duygular daha seyrek. Üç cümlenin ortalaması.',
      poles: { low: 'Sık sık hüzünlü ya da keyifsiz', high: 'Çoğunlukla keyifli' },
    },
  ],
  items,
  science: {
    basedOn:
      'IPIP’teki Optimism ölçeği: Scheier, Carver ve Bridges’in (1994) Yaşam Yönelimi Testi’ne (LOT-R) karşılık gelen, Uluslararası Kişilik Madde Havuzu’nda (IPIP; Goldberg ve ark., 2006) yayımlanan 10 maddelik kamu malı ölçek. Kaynaktaki 10 maddenin hepsi kullanılır.',
    whatItMeasures:
      'Araştırmacılar iyimserliği, geleceğe dair genel olarak iyi şeyler bekleme eğilimi olarak tanımlar (Carver ve ark., 2010). IPIP ölçekleri, karşılık geldikleri testle en çok ilişkili cümleler seçilerek hazırlanır (IPIP, ölçek hazırlama yöntemi). Bu yüzden on cümleden yalnızca beşi hayata ve geleceğe bakışı sorar; ikisi kendine bakışı, üçü ruh hâlini sorar. On cümlenin beşi IPIP’in depresyon alt ölçeğinde de yer alır; “Sık sık keyifsiz olurum” öfke, “Hayatın iyi tarafından bakarım” neşe alt ölçeğindedir. Asıl puan on cümlenin ortalamasıdır; raporda ayrıca bu üç konunun ortalamaları gösterilir, ama bunlar ayrı birer ölçek olarak geliştirilmemiştir. İyimserliğin ruh hâline ve kendine bakışa yakın olması şaşırtıcı değildir; yine de 4.309 kişilik verilerde iyimserliğin depresyonla ve zorluklarla başa çıkmanın bazı yönleriyle ilişkisi, olumsuz duygulara yatkınlık (nevrotiklik), sürekli kaygı, kendine hâkimiyet duygusu ve öz-saygı hesaba katıldığında da sürmüştür (Scheier ve ark., 1994). 50 çalışmayı (11.629 kişi) birleştiren bir meta analizde iyimser kişilerin zorluklarla karşılaşınca sorunla ya da yarattığı duygularla doğrudan uğraşmaya daha yatkın (r = .17), sorundan kaçmaya daha az yatkın (r = −.21) olduğu bulunmuştur (Solberg Nes ve Segerstrom, 2006). Beden sağlığıyla ilişkisi küçüktür, ama araştırmacılara göre önemsiz değildir: 83 çalışmayı birleştiren bir meta analizde ortalama etki büyüklüğü .17 bulunmuştur (Rasmussen ve ark., 2009); 221.133 kişiyi kapsayan ve depresyon belirtileri gibi başka etkenleri hesaba katan bir yeniden incelemede ise ilişki çok küçüktür (r = .03; Scheier ve ark., 2021). 10–25 yaşındaki 26.325 kişiyi kapsayan 31 çalışmayı birleştiren bir meta analizde iyimserlik ile depresyon belirtileri arasında belirgin, ters yönde bir ilişki (r = −.47; ergenlerde −.52) bulunmuştur; çalışmaların çoğu tek seferlik ölçüm olduğu için neden-sonuç söylenemez (Rincón Uribe ve ark., 2021). Türkiye’de İstanbul’da 435 lise öğrencisiyle yapılan bir çalışmada iyimserlik, yaşam doyumuyla r = .65, akademik başarıyla r = .22 ilişkili bulunmuştur (Erdoğdu, 2021). İyimserlik görece kalıcı bir eğilimdir ama tamamen sabit değildir: 29 çalışmayı birleştiren bir meta analizde psikolojik çalışmaların iyimserliği küçük bir etkiyle artırdığı bulunmuş, daha büyük etki kişinin en iyi olası geleceğini hayal edip yazdığı çalışmalarda görülmüştür; bu artışın ne kadar sürdüğü belli değildir (Malouff ve Schutte, 2017).',
    turkishVersion:
      'Beş cümle (“Kendimle barışığım”, “Kendimi nadiren hüzünlü hissederim”, “Hayatın iyi tarafından bakarım”, “Kendimden hoşlanmam”, “Sık sık kendimi hüzünlü hissederim”) sitedeki öteki kişilik testlerindeki çevirilerle aynıdır; beşi bu test için çevrildi. Bu IPIP maddelerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’deki bazı iyimserlik araştırmalarında Yaşam Yönelimi Testi’nin Türkçeye uyarlanmış ilk biçimi kullanılmıştır (Aydın ve Tezer, 1991; aktaran Erdoğdu, 2021); örneğin İstanbul’daki bir lisede yapılan çalışmada bu biçim kullanılmıştır (Erdoğdu, 2021). Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfasında ölçeğin iç tutarlılığı (Cronbach α) .86, Yaşam Yönelimi Testi’yle (LOT-R) ilişkisi .69 olarak verilir (ölçüm hatası düzeltildiğinde .82). Bu değerler ABD’deki bir topluluk örnekleminde yetişkinlerden hesaplanmıştır (Eugene-Springfield Topluluk Örneklemi; Goldberg ve Saucier, 2016). Bu IPIP ölçeğinin ortalamasını ve standart sapmasını veren yayımlanmış bir çalışmaya ulaşılamadı; bu yüzden raporda ölçüm payı gösterilmez. Yaşam Yönelimi Testi ile ölçülen iyimserlik görece kararlıdır: Almanya’da (Leipzig) genel nüfustan 4.965 yetişkin altı yıl arayla iki kez ölçüldüğünde iki sonuç arasındaki ilişki .61 bulunmuştur (Hinz ve ark., 2024). Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç, kişinin kendini nasıl tanımladığını gösterir; başkalarıyla karşılaştırma yapmaz. İyimserlik için kesin kesme puanları yoktur; raporda düşük, orta ve yüksek düzeyler klinik bir eşik değildir.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Bu IPIP ölçeğinin güvenirliği yetişkinlerde hesaplanmıştır; aynı cümlelerle gençlerde yapılmış bir çalışmaya ulaşılamadı. İyimserlik gençlerde başka ölçeklerle incelenmiştir: Hollanda’da 11–18 yaşındaki 459 gençle yapılan bir çalışmada, dört hafta sonra yeniden ölçülen 281 gençte iyimserlik alt ölçeğinin iki ölçümü arasındaki uyum .74 bulunmuştur (Kennes ve ark., 2021). Kadınlarla erkekler ve yaş grupları arasındaki farklar araştırmalarda küçük ya da tutarsızdır (Hinz ve ark., 2017; Chen ve ark., 2025).',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır.',
      'On cümleden beşi IPIP’in depresyon alt ölçeğinde de yer alır; bu ölçek iyimserliği ruh hâlinden ve kendine bakıştan ayrı ölçmez. Yine de bir ruh sağlığı taraması ya da tanı aracı değildir.',
      'Raporda gösterilen üç konu (hayata ve geleceğe bakış, kendine bakış, ruh hâli) Ölçekhane’nin cümlelerin içeriğine göre yaptığı bir ayrımdır; ayrı ölçekler olarak geliştirilmemiş, güvenirlikleri sınanmamıştır. İki ya da üç cümleden oluştukları için tek bir cevap bu sonuçları çok değiştirebilir.',
      'Ölçeğin ortalaması ve standart sapması bilinmediği için ölçüm payı gösterilmez.',
      'İyimserlikle ilgili bulguların çoğu ilişki gösterir, neden-sonuç değil; ilişkilerin bir kısmı küçüktür.',
      'Sonuç o günkü ruh hâlinden etkilenebilir; tek bir sonuç kalıcı bir etiket değildir.',
      'Tanı koymaz.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynak çalışmalardaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Scheier, M. F., Carver, C. S. ve Bridges, M. W. (1994). Distinguishing optimism from neuroticism (and trait anxiety, self-mastery, and self-esteem): A reevaluation of the Life Orientation Test. Journal of Personality and Social Psychology, 67(6), 1063–1078.',
        url: 'https://doi.org/10.1037/0022-3514.67.6.1063',
      },
      { text: 'IPIP. Tek yapılı ölçekler: Optimism maddeleri ve anahtarı.', url: 'https://ipip.ori.org/newSingleConstructsKey.htm' },
      { text: 'IPIP. Özgün ölçekler ile IPIP karşılıklarının karşılaştırması (iç tutarlılık ve ilişki).', url: 'https://ipip.ori.org/newSingleConstructs.htm' },
      { text: 'IPIP. Ölçek hazırlama yöntemi (IPIP scale-construction procedures).', url: 'https://ipip.ori.org/newScaleConstruction.htm' },
      { text: 'IPIP. NEO alt ölçeklerinin maddeleri ve anahtarı (depresyon alt ölçeği).', url: 'https://ipip.ori.org/newNEOFacetsKey.htm' },
      {
        text: 'Goldberg, L. R., Johnson, J. A., Eber, H. W., Hogan, R., Ashton, M. C., Cloninger, C. R. ve Gough, H. G. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Goldberg, L. R. ve Saucier, G. (2016). The Eugene-Springfield Community Sample: Information available from the research participants (ORI Technical Report, 56(1)). Oregon Research Institute.',
        url: 'https://ipip.ori.org/ESCS_TechnicalReport_January2016.pdf',
      },
      {
        text: 'Carver, C. S., Scheier, M. F. ve Segerstrom, S. C. (2010). Optimism. Clinical Psychology Review, 30(7), 879–889.',
        url: 'https://doi.org/10.1016/j.cpr.2010.01.006',
      },
      {
        text: 'Solberg Nes, L. ve Segerstrom, S. C. (2006). Dispositional optimism and coping: A meta-analytic review. Personality and Social Psychology Review, 10(3), 235–251.',
        url: 'https://doi.org/10.1207/s15327957pspr1003_3',
      },
      {
        text: 'Rasmussen, H. N., Scheier, M. F. ve Greenhouse, J. B. (2009). Optimism and physical health: A meta-analytic review. Annals of Behavioral Medicine, 37(3), 239–256.',
        url: 'https://doi.org/10.1007/s12160-009-9111-x',
      },
      {
        text: 'Scheier, M. F., Swanson, J. D., Barlow, M. A., Greenhouse, J. B., Wrosch, C. ve Tindle, H. A. (2021). Optimism versus pessimism as predictors of physical health: A comprehensive reanalysis of dispositional optimism research. American Psychologist, 76(3), 529–548.',
        url: 'https://doi.org/10.1037/amp0000666',
      },
      {
        text: 'Rincón Uribe, F. A., de Oliveira, S. B., Gouveia Junior, A. ve Pedroso, J. S. (2021). Association between the dispositional optimism and depression in young people: A systematic review and meta-analysis. Psicologia: Reflexão e Crítica, 34(1), Makale 37.',
        url: 'https://doi.org/10.1186/s41155-021-00202-y',
      },
      {
        text: 'Erdoğdu, M. Y. (2021). İyimserlik (yaşam yönelimi) ile yaşam doyumu arasındaki ilişkide akademik başarının aracılık rolü. Eğitim ve Bilim, 46(205), 395–407.',
        url: 'https://doi.org/10.15390/EB.2020.8998',
      },
      {
        text: 'Malouff, J. M. ve Schutte, N. S. (2017). Can psychological interventions increase optimism? A meta-analysis. The Journal of Positive Psychology, 12(6), 594–604.',
        url: 'https://doi.org/10.1080/17439760.2016.1221122',
      },
      {
        text: 'Hinz, A., Friedrich, M., Glaesmer, H., Brendel, B., Nesterko, Y., Ernst, J., Schroeter, M. L. ve Mehnert-Theuerkauf, A. (2024). Temporal stability of optimism and pessimism (LOT-R) over 6 years in the general population. Frontiers in Psychology, 15, 1379651.',
        url: 'https://doi.org/10.3389/fpsyg.2024.1379651',
      },
      {
        text: 'Kennes, A., Peeters, S., Janssens, M., Reijnders, J., Simons, M., Lataster, J. ve Jacobs, N. (2021). Optimism and mental health in adolescence: A prospective validation study of the Dutch Life-Orientation Test-Revised (LOT-R-A) for adolescents. Psychologica Belgica, 61(1), 104–115.',
        url: 'https://doi.org/10.5334/pb.799',
      },
      {
        text: 'Hinz, A., Sander, C., Glaesmer, H., Brähler, E., Zenger, M., Hilbert, A. ve Kocalevent, R.-D. (2017). Optimism and pessimism in the general population: Psychometric properties of the Life Orientation Test (LOT-R). International Journal of Clinical and Health Psychology, 17(2), 161–170.',
        url: 'https://doi.org/10.1016/j.ijchp.2017.02.003',
      },
      {
        text: 'Chen, Y., Kubzansky, L. D., Kim, E. S., Koga, H., Shiba, K., Padgett, R. N., Wilkinson, R., Johnson, B. R. ve VanderWeele, T. J. (2025). The distribution of optimism across sociodemographic groups in 22 countries. Scientific Reports, 15(1), 14553.',
        url: 'https://doi.org/10.1038/s41598-024-77257-1',
      },
    ],
  },
};
