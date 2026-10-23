import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Öz-yeterlik: Kendine Güven
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) üç ölçeği. Kamu malıdır: izin ve ücret gerektirmeden her amaçla
 * kullanılabilir (https://ipip.ori.org/newPermission.htm: "for any purpose, commercial or non-commercial") ve çevrilebilir
 * (https://ipip.ori.org/: "one can copy, edit, translate, or use them for any purpose without asking permission and without
 * paying a fee").
 *  - IPIP-NEO "Self-Efficacy" (C1) → İşlerde kendine güven (https://ipip.ori.org/newNEOKey.htm; 6 artı + 4 eksi madde,
 *    α .78, ortalama madde ilişkisi .27; NEO-PI-R'nin asıl "Competence" (C1) yönüyle ilişkisi .66, ölçüm hatası
 *    düzeltilince .89; tablo https://ipip.ori.org/newNEO_FacetsTable.htm).
 *  - JPI-R "Social Confidence" (Scf) → İnsanlar arasında kendine güven (https://ipip.ori.org/newJPI-RKey.htm; 5 artı + 5 eksi
 *    madde, α .87, ortalama madde ilişkisi .41; Jackson Kişilik Envanteri'nin (JPI-R) asıl ölçeğiyle ilişkisi .81, düzeltilince
 *    .93; tablo https://ipip.ori.org/newJPI-RTable.htm, Eugene-Springfield Topluluk Örneklemi'nden (ESCS) 471 yetişkin).
 *  - TCI "Low Self-Efficacy" (HA4), ters çevrilerek → Zor anlarda kendine güven (https://ipip.ori.org/newTCIKey.htm; IPIP'in
 *    kavram dizini bu ölçeği "Self-efficacy: TCI: HA4-reflected" diye listeler, https://ipip.ori.org/newIndexofScaleLabels.htm.
 *    Sayfada 5 madde düşük öz-yeterlik, 4 madde yüksek öz-yeterlik yönündedir; α .77, ortalama madde ilişkisi .28; Mizaç ve
 *    Karakter Envanteri'nin (TCI) asıl "Fatigability & asthenia" (yorulabilirlik ve güçsüzlük) alt ölçeğiyle ilişkisi .53,
 *    düzeltilince .66; tablo https://ipip.ori.org/newTCITable.htm, ESCS'den 501 yetişkin). Bu testte yönü çevrilir: yüksek
 *    puan zor anlarda kendine güveni gösterir. IPIP bu ölçekleri "preliminary" (ön) ölçekler olarak sunar.
 * Maddeler ve yönleri anahtar sayfalarından iki ayrı okumayla alındı; iki okuma bütün maddelerde (metin, sıra ve yön) aynı
 * çıktı. Üç ölçek arasında ortak madde yoktur.
 *
 * Seçim: IPIP'in kavram dizininde "Self-efficacy" başlığı altında üç ölçek vardır: NEO C1, TCI HA4 (ters) ve CPI
 * "Independence" (In). CPI ölçeğinin on maddesinden altısı zihinsel yetenekle ilgilidir ("Have excellent ideas", "Do not
 * have a good imagination"; Beş Faktör Kişilik Profili'nin zihinsel açıklık maddeleri); bu yüzden kullanılmadı. Öz-yeterlik
 * çoğu zaman alana özgü kabul edilir (Spielman ve ark., 2020; Telef ve Karaca, 2012); gençler için öz-yeterlik ölçeği de
 * akademik, sosyal ve duygusal öz-yeterliği ayırır (Muris, 2001; Türkçe uyarlaması Telef ve Karaca, 2012). Bu testin üç
 * alanı bu ayrıma kabaca benzer: işler (okulla sınırlı değil, genel), insanlar arasında ve zor anlarda. Maddeler belirli bir
 * görevi değil, bu üç geniş alandaki genel güveni sorar. İnsanlar arasında kendine güven için JPI-R "Social Confidence" (10 madde, α .87),
 * HPI "No Social Anxiety"den (6 madde, α .74) daha uzun ve güvenilir olduğu için seçildi. HPI "Self-Confidence" (6 madde,
 * α .74) bir maddesi ("Am sure of my ground") NEO C1'de de olduğu için kullanılmadı. Öğrenme ve Başarı Özellikleri testindeki
 * "Zorlukla başa çıkma" (TCI P2 "Competence") bu testte yoktur.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Sitedeki öteki testlerde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (20 madde).
 *  - Kalan 9 madde için iki ayrı çeviri taslağı hazırlandı (ikincisi birincisi görülmeden); ikisi karşılaştırılarak son hâl
 *    seçildi (dört maddede iki taslak aynıydı). Maddelerin gücü ve genelliği korundu: "Don't understand things" için
 *    "anlamakta zorlanırım" (daha zayıf) ya da "bir şeyleri anlayamam" ("bazı şeyleri" diye okunur; herkes katılır) yerine
 *    "Çoğu şeyi anlayamam"; "Don't see the consequences of things" için "sonuçlarını göremem" (emeğinin sonucunu görememek
 *    diye de okunabilir) ve "olayların" (dış olaylara daraltır) yerine "Bir şeyin neye yol açacağını önceden kestiremem";
 *    "Come up with good solutions" için kaynakta olmayan "sorunlara" eklenmedi; "Can tackle anything" için "her işin"
 *    (işlerdeki güven ölçeğine kayar) yerine "her şeyin üstesinden gelebilirim".
 *  - Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 *
 * Madde anahtarı: ölçeğin kısaltması (tas, soc, cop) + maddenin IPIP anahtar sayfasındaki sırası (sayfa her ölçekte önce
 * artı, sonra eksi yönlü maddeleri verir; HA4'te sayfanın artı yönlü maddeleri düşük öz-yeterliği söyler, bu testte ters
 * puanlanır). Uygulama sırası: üç ölçek sırayla döner (işler, insanlar, zor anlar); art arda iki madde aynı ölçekten değildir.
 * Birbirine benzeyen ya da birbirinin tersini söyleyen maddeler birbirinden uzaktır (tests/oz-yeterlik.test.ts denetler).
 *
 * Puanlama: her ölçek maddelerinin ortalamasıdır (1–5); en az dörtte üçü cevaplanmalıdır. Düzeyler öteki IPIP testlerindeki
 * gibi üçtür (2,6 ve 3,4 eşikleri). Toplam bir puan hesaplanmaz.
 *
 * Güvenirlik ve ölçüm payı: JPI-R ve TCI ölçeklerinin α değerleri ESCS yetişkinlerindendir; NEO tablosu örneklemi
 * belirtmez. Açık veriye bu çalışmada ulaşılamadığı için standart sapma (sdRef) yoktur, raporda ölçüm payı gösterilmez.
 *
 * Evet deme eğilimi: İşlerde kendine güvenin on maddesinden altısı, öteki iki ölçeğin maddelerinin yaklaşık yarısı artı
 * yönlüdür. Birbirinin tersini söyleyen beş çift (`oppositePairs`) aynı uç cevabı yakalar.
 *
 * Destek kutusu: "Zor anlarda kendine güven" düşükse (bunalma, moral bozukluğu, korku) ya da "Sık sık moralim bozuk olur"
 * cümlesine "Oldukça doğru" ya da "Tamamen doğru" denirse açılır (İyimserlik'teki "Sık sık kendimi hüzünlü hissederim" gibi).
 * Bu cümle yol haritasında yalnızca orta düzeydeki "Zor anlarda" önerilerini düşük düzeye çevirir (`flaggedFromAverage`):
 * yüksek düzeyde kart olumlu kaldığı için öneriler de onunla çelişmez.
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const TAS = 'tasks';
const SOC = 'social';
const COP = 'coping';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { tas: TAS, soc: SOC, cop: COP };

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['tas05', false, 'İyi çözümler bulurum.', 'Come up with good solutions.'],
  ['soc01', false, 'İnsanların arasında kendimi rahat hissederim.', 'Feel comfortable around people.'],
  ['cop06', false, 'Aksilikleri kolayca atlatırım.', 'Readily overcome setbacks.'],
  ['tas10', true, 'Bir şeyin neye yol açacağını önceden kestiremem.', "Don't see the consequences of things."],
  ['soc06', true, 'İlgi odağı olmaktan nefret ederim.', 'Hate being the center of attention.'],
  ['cop02', true, 'Sık sık moralim bozuk olur.', 'Am often down in the dumps.'],
  ['tas01', false, 'Üstlendiğim işleri başarıyla tamamlarım.', 'Complete tasks successfully.'],
  ['soc04', false, 'Kendimi kolayca ifade ederim.', 'Express myself easily.'],
  ['cop07', false, 'Aynı anda birçok şeyi idare edebilirim.', 'Can manage many things at the same time.'],
  ['tas09', true, 'Katkı sağlayabileceğim pek bir şey olmaz.', 'Have little to contribute.'],
  ['soc07', true, 'İnsanları etkileme yeteneğim yoktur.', 'Lack the talent for influencing people.'],
  ['cop03', true, 'Karşılaştığım zorluklarla baş edemeyeceğimi hissederim.', "Feel that I'm unable to deal with things."],
  ['tas03', false, 'İşleri sorunsuz bir şekilde hallederim.', 'Handle tasks smoothly.'],
  ['soc03', false, 'Hazırlıksız konuşma yapmakta iyiyim.', 'Am good at making impromptu speeches.'],
  ['cop09', false, 'Hızlı düşünürüm.', 'Think quickly.'],
  ['tas08', true, 'Çoğu şeyi anlayamam.', "Don't understand things."],
  ['soc08', true, 'Başkalarının yanında sık sık kendimi huzursuz hissederim.', 'Often feel uncomfortable around others.'],
  ['cop04', true, 'Birçok şeyden korkarım.', 'Am afraid of many things.'],
  ['tas04', false, 'Ne yaptığımı bildiğimden eminimdir.', 'Am sure of my ground.'],
  ['soc02', false, 'İlgi odağı olmak beni rahatsız etmez.', "Don't mind being the center of attention."],
  ['cop01', true, 'Yaşadığım olaylar karşısında bunalırım.', 'Become overwhelmed by events.'],
  ['tas07', true, 'Durumları yanlış değerlendiririm.', 'Misjudge situations.'],
  ['soc10', true, 'Genellikle söyleyecek pek bir şeyim olmaz.', 'Have little to say.'],
  ['cop08', false, 'Her şeyin üstesinden gelebilirim.', 'Can tackle anything.'],
  ['tas02', false, 'Yaptığım işlerde çok başarılı olurum.', 'Excel in what I do.'],
  ['soc05', false, 'İnsanları etkileme konusunda doğal bir yeteneğim vardır.', 'Have a natural talent for influencing people.'],
  ['cop05', true, 'Başkalarının içimi rahatlatmasına ihtiyaç duyarım.', 'Need reassurance.'],
  ['tas06', false, 'İşleri nasıl yoluna koyacağımı bilirim.', 'Know how to get things done.'],
  ['soc09', true, 'Dikkatleri üzerime çekmekten hoşlanmam.', "Don't like to draw attention to myself."],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const ozYeterlik: LikertInstrument = {
  slug: 'oz-yeterlik',
  version: 1,
  engine: 'likert',
  name: 'Öz-yeterlik: Kendine Güven',
  shortName: 'Kendine Güven',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 15.97,
  tagline: 'Kendine güveni üç alanda gösterir: işlerde, insanlar arasında ve zor anlarda.',
  description:
    'Öz-yeterlik, bir işi başarabileceğine olan güvendir. Bu test kendine güveni üç alanda gösterir: üstlendiği işleri başarabileceğine ve iyi çözümler bulabileceğine güvenme; insanların arasında rahat olma ve kendini kolayca ifade etme; zor anlarda bunalmadan aksilikleri atlatabileceğine güvenme. Kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ölçeğine dayanır; 29 kısa cümleden oluşur ve yaklaşık 5 dakika sürer. Rapor, üç alanın birlikte ne anlatabileceğini ve gündelik hayatta denenebilecek küçük adımları da anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Sonuç kişinin kendine ne kadar güvendiğini gösterir; ne kadar başarılı ya da becerikli olduğunu ölçmez. Tanı koymaz.',
  intro: {
    title: 'Kendine ne kadar güveniyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 29 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Cümleler işlerle, insanlarla ve zor anlarla ilgili. Belirli bir günü değil, genellikle nasıl olduğunu düşünerek cevap ver.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar. Yaklaşık 5 dakika sürer.',
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
  oppositePairs: [
    ['soc01', 'soc08'],
    ['soc02', 'soc06'],
    ['soc05', 'soc07'],
    ['cop08', 'cop03'],
    ['cop06', 'cop01'],
  ],
  supportItems: [{ key: 'cop02', min: 4 }],
  scales: [
    {
      key: TAS,
      name: 'İşlerde kendine güven',
      plain:
        'Üstlendiği işleri başarabileceğine, iyi çözümler bulabileceğine ve işleri nasıl yoluna koyacağını bildiğine güvenme; durumları doğru değerlendirdiğini ve katkı sağlayabileceğini düşünme.',
      poles: { low: 'İşlerde kendinden pek emin olmayan', high: 'İşlerde kendinden emin' },
    },
    {
      key: SOC,
      name: 'İnsanlar arasında kendine güven',
      plain:
        'İnsanların arasında rahat olma, kendini kolayca ifade etme, hazırlıksız konuşabilme ve insanları etkileyebileceğine güvenme; ilgi odağı olmaktan çekinmeme.',
      poles: { low: 'İnsanlar arasında sessiz ve temkinli', high: 'İnsanlar arasında rahat ve kendinden emin' },
    },
    {
      key: COP,
      name: 'Zor anlarda kendine güven',
      plain:
        'Aksilikleri atlatabileceğine, zorluklarla baş edebileceğine ve birçok şeyi aynı anda idare edebileceğine güvenme; olaylar karşısında bunalmama, çok şeyden korkmama ve başkalarının rahatlatmasına pek ihtiyaç duymama.',
      poles: { low: 'Zor anlarda kolay bunalan', high: 'Zor anlarda kendinden emin' },
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ön ölçeği: NEO Kişilik Envanteri’nin (NEO-PI-R) yetkinlik (Competence) yönüne benzeyen öz-yeterlik ölçeği (Self-Efficacy); Jackson Kişilik Envanteri’nin (JPI-R) sosyal güven ölçeğine benzeyen ölçek (Social Confidence) ve Mizaç ve Karakter Envanteri’nin (TCI) yorulabilirlik ve güçsüzlük alt ölçeğine benzeyen düşük öz-yeterlik ölçeği (Low Self-Efficacy). IPIP’in kavram dizini öz-yeterlik başlığı altında birinci ve üçüncü ölçeği (üçüncüsünü yönü çevrilerek) listeler. Bu testte üçüncü ölçeğin yönü çevrilir: yüksek puan zor anlarda kendine güveni gösterir. Maddeler IPIP’indir (Goldberg ve ark., 2006). Üç ölçeğin 29 maddesinin hepsi sorulur; ölçekler arasında ortak madde yoktur.',
    whatItMeasures:
      'Öz-yeterlik, kişinin bir işi başlatıp sonuç alıncaya kadar sürdürebileceğine olan inancıdır; yetenekli olmaya değil, kişinin kendi kaynaklarına güvenmesine karşılık gelir (Bandura, 1994’ten aktaran Yıldırım ve İlhan, 2010). Kısaca, gelecekteki bir iş hakkındaki “yapabilirim” inancıdır (Bandura, 1997’den aktaran Talsma ve ark., 2021). Kişinin kendini ne kadar değerli gördüğünden (öz-saygı) farklıdır ve ondan daha özeldir (Telef ve Karaca, 2012); ikisi ilişkilidir ama birbirinin aynısı değildir (Arens ve Preckel, 2025). Öz-yeterlik çoğu zaman alana özgü kabul edilir: kişi bir alanda kendine güvenip başka bir alanda güvenmeyebilir (Spielman ve ark., 2020; Telef ve Karaca, 2012). Bazı araştırmacılar ise onu zor ya da yeni durumlarla baş edebilme konusunda genel bir güven olarak ele alır (Telef ve Karaca, 2012).\n\nMuris’in (2001) gençler için geliştirdiği öz-yeterlik ölçeği sosyal, akademik ve duygusal öz-yeterliği ayrı ölçer; ölçeğin Türkçe uyarlamasında sosyal öz-yeterlik akran ilişkilerini ve girişkenliği, duygusal öz-yeterlik olumsuz duygularla baş edebilme inancını kapsar (Telef ve Karaca, 2012). Bu testin üç alanı bu ayrıma kabaca benzer ama o ölçeğin maddelerini kullanmaz: işlerde kendine güven (okul işleriyle sınırlı değildir), insanlar arasında kendine güven ve zor anlarda kendine güven. Cümleler belirli bir görevi değil, bu üç geniş alandaki genel güveni sorar. Üç alan ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.\n\nBandura’ya (1977) göre bu güven, kişinin bir işe girişip girişmeyeceğini, ne kadar çaba göstereceğini ve engeller karşısında ne kadar süre dayanacağını etkiler. Öz-yeterliği yüksek olanlar zorlukları üstesinden gelinecek işler olarak görme ve aksiliklerden çabuk toparlanma eğilimindedir; düşük olanlar ise başarabileceklerinden şüphe ettikleri için zor işlerden kaçınabilir (Spielman ve ark., 2020).\n\nÜniversite öğrencileriyle yapılan çalışmaları birleştiren bir incelemede akademik öz-yeterlik ile not ortalaması arasındaki ilişki orta büyüklükte bulunmuştur (r = .31; Richardson ve ark., 2012). Okul başarısıyla ilgili boylamsal çalışmaları birleştiren bir incelemede (toplam 2.688 kişi) önceki başarının sonraki öz-yeterliğe etkisi, öz-yeterliğin sonraki başarıya etkisinden büyük bulunmuştur. Yetişkinlerde ilişki iki yönlü çıkmış; çocuklarda ise yalnızca önceki başarı sonraki öz-yeterliği etkilemiştir (Talsma ve ark., 2018). Okulla ilgili araştırmalarda öz-yeterliğin çoğu zaman en güçlü kaynağı, kişinin bir işi kendisi başarma deneyimidir; kaynakların gücü cinsiyete, derse ve başarı düzeyine göre değişebilir (Usher ve Pajares, 2008; Byars-Winston ve ark., 2017).\n\nÖz-yeterlik bir ölçüde artırılabilir: üniversite öğrencileriyle yapılan ve çoğu yarı deneysel olan çalışmaları birleştiren bir incelemede, öz-yeterliği ve kendine güveni artırmayı amaçlayan programlardan sonra öz-yeterlikte küçük bir artış bulunmuştur; bu yüzden büyük bir artış beklemek gerçekçi olmaz (Braithwaite ve Corr, 2016).',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki testlerde birebir aynı olan 20 maddenin çevirisi korundu; kalan 9 madde iki ayrı taslakla çevrilip karşılaştırıldı. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’de öz-yeterliği ölçen başka ölçekler uyarlanmıştır: Muris’in gençler için öz-yeterlik ölçeği İzmir’de 6–11. sınıflardan 933 öğrenciyle (Telef ve Karaca, 2012), Sherer ve arkadaşlarının genel öz-yeterlik ölçeği 18–70 yaşlarında 895 yetişkinle (Yıldırım ve İlhan, 2010), Schwarzer ve Jerusalem’in genel öz-yeterlik ölçeği 693 üniversite öğrencisiyle (Aypay, 2010). Bu testin maddeleri o ölçeklerin maddeleri değildir ve o çalışmaların sonuçları bu test için norm sayılmaz. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfalarında iç tutarlılık (Cronbach α) şöyle bildirilir: öz-yeterlik (bu testte işlerde kendine güven) .78; sosyal güven (bu testte insanlar arasında kendine güven) .87; düşük öz-yeterlik (bu testte zor anlarda kendine güven) .77. Son iki değer Eugene-Springfield Topluluk Örneklemi’nin yetişkinleriyle hesaplanmıştır (sırasıyla 471 kişi ve 501 kişi); öz-yeterlik ölçeğinin tablosu örneklemi belirtmez. IPIP ölçeklerinin asıl envanterlerin ölçekleriyle ilişkisi: öz-yeterlik NEO-PI-R’nin yetkinlik yönüyle .66 (ölçüm hatası düzeltilince .89), sosyal güven JPI-R’nin ölçeğiyle .81 (.93), düşük öz-yeterlik TCI’nin yorulabilirlik ve güçsüzlük alt ölçeğiyle .53 (.66); bu sonuncusu asıl ölçeğin yalnızca bir kısmını yakalar. Açık veriye bu çalışmada ulaşılamadığı için standart sapmalar hesaplanamadı; raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, başkalarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak sayfalarda örneklemi belirtilen iki ölçeğin güvenirliği yetişkinlerde hesaplanmıştır; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı. Kendine güven yıllar içinde değişebilir: İtalya’da 12–22 yaşlarındaki 412 öğrenciyle yapılan izleme çalışmasında, kendi öğrenmesini düzenleyebileceğine olan güven ortaokuldan liseye doğru giderek azalmıştır (Caprara ve ark., 2008). Bu çalışma tek bir alanla ilgili olsa da lise öğrencilerinde sonuç o dönemin bir resmi olarak düşünülmelidir; zamanla değişebilir.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendine nasıl baktığını yansıtır. O günkü ruh hâli ve kendini nasıl göstermek istediği cevapları etkileyebilir. Kendine güvenmek değer verilen bir özellik olduğu için insanlar kendilerini olduğundan biraz daha olumlu anlatabilir.',
      'Test kişinin ne kadar başarılı ya da becerikli olduğunu ölçmez. Öz-yeterlik ile başarı ilişkilidir ama aynı şey değildir; önceki başarı hesaba katılınca öz-yeterliğin sonraki başarıya etkisi küçüktür (Talsma ve ark., 2018, 2021).',
      'İşlerde kendine güvenin on cümlesinden altısı aynı yöndedir: cümlelerin çoğuna “doğru” deme eğilimi bu alanın puanını biraz yükseltebilir; zor anlarda kendine güvenin dokuz cümlesinden beşi ters yönde olduğu için aynı eğilim o alanın puanını biraz düşürebilir. Birbirinin tersini söyleyen beş cümle çiftinin çoğuna aynı uç cevap verilirse raporda uyarı gösterilir.',
      '29 cümleden 20’si sitedeki öteki testlerde de sorulur: dokuzu Ayrıntılı Kişilik Profili’nde, sekizi Altı Boyutlu Kişilik Profili’nde, beşi 16 Faktörlü Kişilik Profili’nde, dördü Beş Faktör Kişilik Profili’nde, dördü Kişiliğin 10 Yönü’nde; ayrıca ikisi Kişilerarası Tarz’da, birer cümle Öğrenme ve Başarı Özellikleri ile Düşünme ve Çalışma Tarzı’nda (bir cümle birden çok testte olabilir). Bu yüzden sonuçlar birbirine benzeyebilir: ör. dışadönüklüğü ya da sosyal cesareti yüksek çıkan birinin insanlar arasında kendine güven puanı da yüksek, duygusal dengesi düşük çıkan birinin zor anlarda kendine güven puanı da düşük çıkabilir.',
      'Öz-yeterlik, öz-saygı ve duygusal denge birbiriyle ilişkilidir: Almanya’da 11. ve 13. sınıf öğrencileriyle yapılan bir çalışmada genel öz-yeterlik ile öz-saygı arasındaki ilişki yaklaşık .53 ile .61, kaygı ve gerginliğe yatkınlıkla (nevrotiklik) ilişkisi yaklaşık −.48 ile −.66 arasında bulunmuş (ölçüm hatasından arındırılmış değerler); üçünün ortak bir çekirdeği olduğu ama birbirinin aynısı olmadığı sonucuna varılmıştır (Arens ve Preckel, 2025). Sitedeki Öz-saygı Ölçeği kişinin kendini genel olarak ne kadar değerli gördüğünü, bu test ise belirli alanlarda kendine ne kadar güvendiğini sorar.',
      'İnsanlar arasında kendine güvenin cümlelerinin bir kısmı ilgi odağı olmaktan hoşlanmayı, bir kısmı hazırlıksız konuşmada iyi olmayı sorar. Bu yüzden sessizliği seven ve kalabalıktan uzak durmayı tercih eden biri, insanlar arasında kendine güvense de bu alanda düşük puan alabilir. Utangaçlık (insanlar arasında çekingen ve tedirgin olmak) ile insanlarla birlikte olmayı az istemek ayrı özelliklerdir: utangaç biri de insanlarla birlikte olmak isteyebilir (Cheek ve Buss, 1981’den aktaran Tang ve ark., 2014).',
      'Tanı koymaz; bir ruh sağlığı taraması değildir ve uzman değerlendirmesinin yerini tutmaz. Zor anlarda kendine güvenin cümlelerinden ikisi bunalma ve moral bozukluğunu sorar; bu duygular uzun süredir devam ediyorsa ve günlük hayatı etkiliyorsa bir uzmandan destek almak iyi gelebilir.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır. Ölçüm payı hesaplanamadığı için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      { text: 'IPIP. NEO-PI-R’ye benzeyen IPIP ölçeklerinin anahtarları (öz-yeterlik).', url: 'https://ipip.ori.org/newNEOKey.htm' },
      { text: 'IPIP. NEO-PI-R yönlerinin özet tablosu (güvenirlik ve NEO-PI-R ile ilişki).', url: 'https://ipip.ori.org/newNEO_FacetsTable.htm' },
      { text: 'IPIP. JPI-R ölçeklerinin anahtarları (sosyal güven).', url: 'https://ipip.ori.org/newJPI-RKey.htm' },
      { text: 'IPIP. JPI-R ölçeklerinin özet tablosu (güvenirlik ve JPI-R ile ilişki).', url: 'https://ipip.ori.org/newJPI-RTable.htm' },
      { text: 'IPIP. TCI’ye benzeyen IPIP ölçeklerinin anahtarları (düşük öz-yeterlik).', url: 'https://ipip.ori.org/newTCIKey.htm' },
      { text: 'IPIP. TCI ölçeklerinin özet tablosu (güvenirlik ve TCI ile ilişki).', url: 'https://ipip.ori.org/newTCITable.htm' },
      { text: 'IPIP. Kavramların alfabetik dizini (öz-yeterlik).', url: 'https://ipip.ori.org/newIndexofScaleLabels.htm' },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. Psychological Review, 84(2), 191–215.',
        url: 'https://doi.org/10.1037/0033-295X.84.2.191',
      },
      {
        text: 'Yıldırım, F. ve İlhan, İ. Ö. (2010). Genel Özyeterlilik Ölçeği Türkçe formunun geçerlilik ve güvenilirlik çalışması. Türk Psikiyatri Dergisi, 21(4), 301–308.',
        url: 'https://www.turkpsikiyatri.com/PDF/C21S4/301-308.pdf',
      },
      {
        text: 'Talsma, K., Robertson, K., Thomas, C. ve Norris, K. (2021). COVID-19 beliefs, self-efficacy and academic performance in first-year university students: Cohort comparison and mediation analysis. Frontiers in Psychology, 12, 643408.',
        url: 'https://doi.org/10.3389/fpsyg.2021.643408',
      },
      {
        text: 'Telef, B. B. ve Karaca, R. (2012). Çocuklar için Öz-Yeterlik Ölçeği’nin geçerlik ve güvenirlik çalışması. Buca Eğitim Fakültesi Dergisi, (32), 169–187.',
        url: 'https://dergipark.org.tr/tr/pub/deubefd/article/265237',
      },
      {
        text: 'Arens, A. K. ve Preckel, F. (2025). Distinct constructs with a common core: Modelling neuroticism, self-esteem, and generalized self-efficacy using bifactor exploratory structural equation modelling. Current Psychology, 44(12), 12209–12224.',
        url: 'https://doi.org/10.1007/s12144-025-07984-9',
      },
      {
        text: 'Spielman, R. M., Jenkins, W. J. ve Lovett, M. D. (2020). Psychology 2e (11.4 Learning approaches). OpenStax.',
        url: 'https://openstax.org/books/psychology-2e/pages/11-4-learning-approaches',
      },
      {
        text: 'Muris, P. (2001). A brief questionnaire for measuring self-efficacy in youths. Journal of Psychopathology and Behavioral Assessment, 23(3), 145–149.',
        url: 'https://doi.org/10.1023/A:1010961119608',
      },
      {
        text: 'Richardson, M., Abraham, C. ve Bond, R. (2012). Psychological correlates of university students’ academic performance: A systematic review and meta-analysis. Psychological Bulletin, 138(2), 353–387.',
        url: 'https://doi.org/10.1037/a0026838',
      },
      {
        text: 'Talsma, K., Schüz, B., Schwarzer, R. ve Norris, K. (2018). I believe, therefore I achieve (and vice versa): A meta-analytic cross-lagged panel analysis of self-efficacy and academic performance. Learning and Individual Differences, 61, 136–150.',
        url: 'https://doi.org/10.1016/j.lindif.2017.11.015',
      },
      {
        text: 'Usher, E. L. ve Pajares, F. (2008). Sources of self-efficacy in school: Critical review of the literature and future directions. Review of Educational Research, 78(4), 751–796.',
        url: 'https://doi.org/10.3102/0034654308321456',
      },
      {
        text: 'Byars-Winston, A., Diestelmann, J., Savoy, J. N. ve Hoyt, W. T. (2017). Unique effects and moderators of effects of sources on self-efficacy: A model-based meta-analysis. Journal of Counseling Psychology, 64(6), 645–658.',
        url: 'https://doi.org/10.1037/cou0000219',
      },
      {
        text: 'Braithwaite, R. ve Corr, P. J. (2016). Hans Eysenck, education and the experimental approach: A meta-analysis of academic capabilities in university students. Personality and Individual Differences, 103, 163–171.',
        url: 'https://doi.org/10.1016/j.paid.2016.03.040',
      },
      {
        text: 'Aypay, A. (2010). Genel Öz Yeterlik Ölçeği’nin (GÖYÖ) Türkçe’ye uyarlama çalışması. İnönü Üniversitesi Eğitim Fakültesi Dergisi, 11(2), 113–131.',
        url: 'https://abakus.inonu.edu.tr/items/7230e97e-05c0-445b-9976-b3ee25c20b2d',
      },
      {
        text: 'Caprara, G. V., Fida, R., Vecchione, M., Del Bove, G., Vecchio, G. M., Barbaranelli, C. ve Bandura, A. (2008). Longitudinal analysis of the role of perceived self-efficacy for self-regulated learning in academic continuance and achievement. Journal of Educational Psychology, 100(3), 525–534.',
        url: 'https://doi.org/10.1037/0022-0663.100.3.525',
      },
      {
        text: 'Tang, A., Beaton, E. A., Schulkin, J., Hall, G. B. ve Schmidt, L. A. (2014). Revisiting shyness and sociability: A preliminary investigation of hormone-brain-behavior relations. Frontiers in Psychology, 5, 1430.',
        url: 'https://doi.org/10.3389/fpsyg.2014.01430',
      },
    ],
  },
};
