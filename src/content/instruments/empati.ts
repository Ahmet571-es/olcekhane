import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Empati
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) üç ölçeği. Kamu malıdır: izin ve ücret gerektirmeden her amaçla
 * kullanılabilir (https://ipip.ori.org/newPermission.htm: "for any purpose, commercial or non-commercial") ve çevrilebilir
 * (https://ipip.ori.org/: "one can copy, edit, translate, or use them for any purpose without asking permission and without
 * paying a fee").
 *  - AB5C "Understanding" (II+/II+) → Başkalarını düşünme (https://ipip.ori.org/newAB5CKey.htm; 5 artı + 5 eksi madde, α .81,
 *    ortalama madde ilişkisi .30; tablo https://ipip.ori.org/newAB5CTable.htm, Eugene-Springfield Topluluk Örneklemi'nden
 *    (ESCS) 501 yetişkin). AB5C, beş büyük kişilik boyutunu ikişerli birleşimleriyle inceleyen modeldir (Hofstee ve ark., 1992);
 *    II+/II+ uyumluluğun yalnızca kendisiyle tanımlanan yönüdür.
 *  - JPI-R "Empathy" → Duygusal duyarlılık (https://ipip.ori.org/newJPI-RKey.htm; 7 artı + 3 eksi madde, α .80; tablo
 *    https://ipip.ori.org/newJPI-RTable.htm, ESCS'den 471 yetişkin; Jackson Kişilik Envanteri'nin (JPI-R) asıl Empati ölçeğiyle
 *    ilişkisi .64, ölçüm hatası düzeltilince .82).
 *  - AB5C "Warmth" (II+/I+) → Sıcaklık ve destek (9 artı + 2 eksi madde, α .84, ortalama madde ilişkisi .33; N = 501).
 * Maddeler ve yönleri anahtar sayfalarından iki ayrı okumayla alındı. Kaynaktaki iki yazım yanlışı ("spiritally",
 * "other's needs") `source` alanında sayfadaki gibi korunur.
 *
 * Seçim: IPIP'te empati adını taşıyan öteki ölçekler kullanılmadı. HPI "Empathy" sinirlenmemeyi sorar ("Rarely get
 * irritated"); TCI "Empathy" maddelerinin hepsi aynı yöndedir (ters madde yok); AB5C "Empathy" (II+/V+, α .70) yalnızca dört
 * kendi maddesini taşır, öteki maddeleri başka AB5C yönlerinden alınmıştır ("Love to reflect on things" gibi); NEO
 * "Sympathy" (A6) evsizler ve "göze göz" gibi, AB5C "Sympathy" ise "insanlar kendi başının çaresine bakmalı" gibi görüş
 * içeren maddeler taşır; VIA ölçekleri kullanılmaz (Karakter Güçlü Yanları
 * kararı). IPIP'te Davis'in bakış açısı alma (perspective taking) ya da kişisel sıkıntı ölçeklerinin bir karşılığı bulunamadı.
 *
 * Çıkarılan maddeler (iki ölçekte birden yer alan maddeler bir kez sorulur): "Feel others' emotions." hem Sıcaklık'ta hem
 * JPI-R Empati'de vardır; Duygusal duyarlılıkta sorulur (aff01), Sıcaklık'tan çıkarılır (war09). "Am not interested in other
 * people's problems." hem Anlayış'ta hem JPI-R Empati'de vardır; Başkalarını düşünmede sorulur (und07), Duygusal duyarlılıktan
 * çıkarılır (aff09). Böylece kaynaktaki 31 maddeden 29'u kalır. Beklenen güvenirlik (Spearman–Brown): Sıcaklık ve destek on
 * maddeyle 10 · .33 / (1 + 9 · .33) = .83; Duygusal duyarlılık dokuz maddeyle (ortalama madde ilişkisi sayfada
 * .29) 9 · .29 / (1 + 8 · .29) = .79.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Sitedeki öteki testlerde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (19 madde; Çocuk Kişilik
 *    Profili'ndeki çocuklara göre yazılmış çeviriler dışında).
 *  - Kalan 10 madde için iki ayrı çeviri taslağı hazırlandı (ikincisi birincisi görülmeden); ikisi karşılaştırılarak son hâl
 *    seçildi (dört maddede iki taslak aynıydı). "Feel spiritally connected to other people" dinî bir anlam taşımasın diye
 *    "ruhen bağlı" yerine "aramda derin bir bağ"; "Take others' interests into account" için "çıkar" (bencillik çağrıştırır)
 *    yerine "yarar"; "Like to be of service" için "hizmet" yerine "yardımcı olmayı severim"; "Make people feel welcome"
 *    "hissettiririm" diye çevrildi (öteki iki "hissetmesini sağlarım" maddesiyle aynı kalıba girmesin).
 *  - Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 *  - Künyeler: Topçu ve ark. (2010) makalesinin PDF'i sayfaları 174–182 diye basar, DergiPark kaydı 174–180 der; künyede
 *    basılı sayfalar kullanılır. JPI-R empati tanımı yayıncının örnek raporundandır (Sigma Assessment Systems).
 *
 * Örtüşme (İngilizce asılları birebir aynı maddeler; 29 maddeden 19'u): sekizi Beş Faktör Kişilik Profili'nin uyumluluğunda,
 * yedisi Kişiliğin 10 Yönü'nün şefkatinde, altısı Ayrıntılı, beşi 16 Faktörlü, dördü Hızlı Kişilik Testi'nde, dördü Altı
 * Boyutlu Kişilik Profili'nde, dördü Duygusal Zekâ Bileşenleri'nde (üzücü olaylardan etkilenme ve başkalarını önemseme),
 * üçü Kişilerarası Tarz'da (bir madde birden çok testte olabilir). Bu testlerin ilgili sonuçları birbirine benzer çıkabilir;
 * bilim kartında yazılıdır (sayılar tests/empati.test.ts'te denetlenir).
 *
 * Madde anahtarı: ölçeğin kısaltması (und, aff, war) + maddenin IPIP anahtar sayfasındaki sırası (önce artı, sonra eksi
 * yönlü maddeler; çıkarılan maddelerin numaraları, aff09 ve war09, atlanır). Uygulama sırası: üç ölçek sırayla döner
 * (sıcaklık, anlayış, duygusal duyarlılık); art arda iki madde aynı ölçekten değildir. Birbirine benzeyen ya da birbirinin
 * tersini söyleyen maddeler birbirinden uzaktır: "Başkalarına zaman ayırırım" (7) ile "Başkalarına zaman ayırmam" (29);
 * "İnsanlara ilgi duyarım" (1) ile "Aslında diğer insanlara pek ilgi duymam" (13); "Nadiren duygulanırım" (9) ile "Nadiren
 * gülümserim" (22); "Gözlerim kolayca dolar" (12) ile "Kolay ağlarım" (27); "hissetmesini sağlarım" diye biten iki madde
 * (4, 28); iki "beni ilgilendirmez" maddesi (5, 23).
 *
 * Puanlama: her ölçek maddelerinin ortalamasıdır (1–5); en az dörtte üçü cevaplanmalıdır. Düzeyler öteki IPIP testlerindeki
 * gibi üçtür (2,6 ve 3,4 eşikleri). Toplam bir puan hesaplanmaz: kaynak üç ölçeği ayrı verir.
 *
 * Güvenirlik ve ölçüm payı: α değerleri ESCS yetişkinlerindendir. Bu örneklemin herkese açık verisine (Goldberg, 2018,
 * Harvard Dataverse) bu çalışmada ulaşılamadı; standart sapma (sdRef) hesaplanamadığı için raporda ölçüm payı gösterilmez.
 *
 * Evet deme eğilimi: Duygusal duyarlılığın dokuz maddesinden yedisi, Sıcaklık ve desteğin on maddesinden sekizi aynı
 * yöndedir. Birbirinin tersini söyleyen beş çift (`oppositePairs`): dördü aynı ölçekte; beşincisi ("Başkalarına zaman
 * ayırırım" / "Başkalarına zaman ayırmam") iki ayrı ölçektedir ama birbirinin tam tersidir. Çiftlerin çoğuna aynı uç cevap
 * verilirse raporda uyarı çıkar.
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const UND = 'understanding';
const AFF = 'affective';
const WAR = 'warmth';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { und: UND, aff: AFF, war: WAR };

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['war01', false, 'İnsanlara ilgi duyarım.', 'Am interested in people.'],
  ['und01', false, 'Başkalarının duygularını anlar, onlara ortak olurum.', "Sympathize with others' feelings."],
  ['aff01', false, 'Başkalarının ne hissettiğini içimde hissederim.', "Feel others' emotions."],
  ['war02', false, 'İnsanların yanımda rahat hissetmesini sağlarım.', 'Make people feel at ease.'],
  ['und06', true, 'Başkalarının iyi olup olmaması beni pek ilgilendirmez.', 'Feel little concern for others.'],
  ['aff02', false, 'Başkalarının derdiyle dertlenirim.', "Suffer from others' sorrows."],
  ['war05', false, 'Başkalarına zaman ayırırım.', 'Take time out for others.'],
  ['und03', false, 'Başkalarının yararını da düşünürüm.', "Take others' interests into account."],
  ['aff10', true, 'Nadiren duygulanırım.', 'Seldom get emotional.'],
  ['war04', false, 'Başkalarının hâlini hatırını sorarım.', "Inquire about others' well-being."],
  ['und10', true, 'Başkalarının ihtiyaçlarıyla uğraşmak istemem.', "Can't be bothered with other's needs."],
  ['aff04', false, 'Gözlerim kolayca dolar.', 'Am easily moved to tears.'],
  ['war10', true, 'Aslında diğer insanlara pek ilgi duymam.', 'Am not really interested in others.'],
  ['und02', false, 'Başkalarının duygularına saygı gösteririm.', "Respect others' feelings."],
  ['aff07', false, 'Diğer insanlarla aramda derin bir bağ hissederim.', 'Feel spiritally connected to other people.'],
  ['war06', false, 'İnsanlara iyi karşılandıklarını hissettiririm.', 'Make people feel welcome.'],
  ['und08', true, 'Başkalarının ne hissettiği umurumda olmaz.', 'Am indifferent to the feelings of others.'],
  ['aff08', true, 'Duygusallaşan insanları anlamam.', "Don't understand people who get emotional."],
  ['war03', false, 'Başkalarını nasıl teselli edeceğimi bilirim.', 'Know how to comfort others.'],
  ['und05', false, 'Başkalarının bakış açısına değer veririm.', 'Appreciate the viewpoints of others.'],
  ['aff06', false, 'Duygularımı yoğun yaşarım.', 'Experience my emotions intensely.'],
  ['war11', true, 'Nadiren gülümserim.', 'Rarely smile.'],
  ['und07', true, 'Başkalarının sorunları beni ilgilendirmez.', "Am not interested in other people's problems."],
  ['aff03', false, 'Başkalarının başına gelen kötü şeylerden derinden etkilenirim.', "Am deeply moved by others' misfortunes."],
  ['war07', false, 'Birine minnettar olduğumda bunu belli ederim.', 'Show my gratitude.'],
  ['und04', false, 'Başkalarına yardımcı olmayı severim.', 'Like to be of service to others.'],
  ['aff05', false, 'Kolay ağlarım.', 'Cry easily.'],
  ['war08', false, 'Başkalarının kendilerini iyi hissetmelerini sağlarım.', 'Make others feel good.'],
  ['und09', true, 'Başkalarına zaman ayırmam.', 'Take no time for others.'],
];

/** Kaynakta olup bu testte (başka bir ölçekte sorulduğu için) yeniden sorulmayan maddeler. */
export const EMPATI_REMOVED = ['aff09', 'war09'];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const empati: LikertInstrument = {
  slug: 'empati',
  version: 1,
  engine: 'likert',
  name: 'Empati',
  shortName: 'Empati',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 15.95,
  tagline: 'Empatiyi üç yönde gösterir: “başkalarını düşünme”, “duygusal duyarlılık” ve “sıcaklık ve destek”.',
  description:
    'Empati, başkalarının ne hissettiğini anlama ve onların duygularını bir ölçüde paylaşma eğilimidir. Bu test onu üç yönde gösterir: başkalarının duygularına, bakış açısına ve ihtiyaçlarına saygı gösterip onları önemseme; başkalarının duygularını içinde hissetme ve onların acısından etkilenme; insanlara sıcak yaklaşma, onları rahatlatma ve onlara destek olma. Kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ölçeğine dayanır; 29 kısa cümleden oluşur ve yaklaşık 5 dakika sürer. Rapor, üç yönün birlikte ne anlatabileceğini ve gündelik hayatta denenebilecek küçük adımları da anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Sonuç kişinin kendini nasıl gördüğünü gösterir; başkalarının duygularını ne kadar doğru anladığını ölçmez. Tanı koymaz.',
  intro: {
    title: 'Başkalarına nasıl yaklaşırsın?',
    paragraphs: [
      'Birazdan seni anlatan 29 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Cümlelerin çoğu başka insanlarla ilgili. Belirli bir kişiyi değil, insanlara genel olarak nasıl yaklaştığını düşünerek cevap ver.',
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
    ['war01', 'war10'],
    ['aff06', 'aff10'],
    ['und02', 'und08'],
    ['und04', 'und10'],
    ['war05', 'und09'],
  ],
  scales: [
    {
      key: UND,
      name: 'Başkalarını düşünme',
      plain:
        'Başkalarının duygularına ve bakış açısına saygı gösterme, onların yararını da gözetme; sorunlarını ve ihtiyaçlarını önemseme, onlara yardımcı olmaktan hoşlanma.',
      poles: { low: 'Kendi önceliklerine odaklanan', high: 'Başkalarını düşünen ve yardımsever' },
    },
    {
      key: AFF,
      name: 'Duygusal duyarlılık',
      plain:
        'Başkalarının ne hissettiğini içinde hissetme, onların derdiyle dertlenme ve başlarına gelen kötü şeylerden derinden etkilenme; duyguları yoğun yaşama, gözlerin kolayca dolması.',
      poles: { low: 'Duygulardan kolay kolay etkilenmeyen', high: 'Duygulardan derinden etkilenen' },
    },
    {
      key: WAR,
      name: 'Sıcaklık ve destek',
      plain:
        'İnsanlara ilgi duyma; insanları rahatlatma ve onlara iyi karşılandıklarını hissettirme; hâl hatır sorma, teselli etme ve zaman ayırma; gülümseme ve minnettarlığını belli etme.',
      poles: { low: 'Mesafeli ve ölçülü', high: 'Sıcak ve destekleyici' },
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ölçeği: AB5C modelinin anlayış (Understanding) ve sıcaklık (Warmth) ölçekleri ile Jackson Kişilik Envanteri’nin (JPI-R) empati ölçeğinin IPIP karşılığı (Empathy). AB5C, beş büyük kişilik boyutunu ikişerli birleşimleriyle inceleyen bir modeldir (Hofstee ve ark., 1992): anlayış, uyumluluğun yalnızca kendisiyle tanımlanan yönüdür; sıcaklık, uyumluluğun dışadönüklüğe yakın yönüdür. Bu testte anlayış ölçeğinin adı “başkalarını düşünme”dir: maddeleri başkalarını ne kadar iyi anladığını değil, başkalarının duygularına ve ihtiyaçlarına ne kadar önem verdiğini sorar. JPI-R’nin yayıncısı, bu ölçekte puanı yüksek olanları başkalarıyla ve onların sorunlarıyla yakından özdeşleşen, yakın duygusal bağlara değer veren ve başkalarının başına gelen kötü şeylerden üzülen kişiler olarak tanımlar (Jackson, 1994; yayıncının örnek raporu). Maddeler IPIP’indir. Kaynaktaki 31 maddeden ikisi iki ölçekte birden yer aldığı için yalnızca birer kez sorulur; test 29 maddedir.',
    whatItMeasures:
      'Empati, başkasının ne hissettiğini anlama ve onun duygusunu bir ölçüde paylaşma eğilimidir. Araştırmalarda genellikle iki yönü ayrılır: olaylara başkasının gözünden bakabilmek ve onun duygusunu anlamak (bilişsel empati) ve onun duygusundan etkilenmek (duygusal empati) (Davis, 1983; Jolliffe ve Farrington, 2006). Davis (1980, 1983) ayrıca başkalarının durumunu önemseyip onlar için üzülmeyi (empatik ilgi), başkasının sıkıntısı karşısında kişinin kendisinin bunalmasını (kişisel sıkıntı) ve kendini hikâye ve filmlerdeki kişilerin yerine koymayı ayrı ölçer. Bu testin üç yönü bu ayrımlarla birebir örtüşmez: başkalarını düşünme, başkalarının duygularına, bakış açısına ve ihtiyaçlarına önem vermeyi; duygusal duyarlılık, başkalarının duygularından etkilenmeyi ve duyguları yoğun yaşamayı; sıcaklık ve destek ise bu ilginin insanlara nasıl yansıdığını (ilgi gösterme, rahatlatma, teselli etme) sorar. Maddeler, başkalarının ne düşündüğünü ya da hissettiğini doğru tahmin etme becerisini sınamaz; kişinin kendini nasıl gördüğünü sorar. Kişilerin kendi bilişsel empatilerini nasıl değerlendirdiği ile bu beceriyi ölçen görevlerdeki başarıları arasındaki ilişki çok zayıf bulunmuştur: 85 çalışmayı birleştiren bir incelemede öz değerlendirme, görevlerdeki başarı farklarının yalnızca yaklaşık %1’ini açıklamıştır (Murphy ve Lilienfeld, 2019). Empati, yardım etme ve paylaşma gibi davranışlarla ilişkilidir: 146 örneklemi birleştiren bir incelemede bu ilişki bilişsel empati için r = .32, duygusal empati için r = .30 bulunmuştur (Yin ve Wang, 2023). Hollanda’da gençleri altı yıl izleyen bir çalışmada başkalarının durumunu önemseme, gençlerin sonraki yıllarda kendi bildirdikleri yardım etme ve paylaşma gibi davranışlarla ilişkili çıkmış; başkasının gözünden bakabilme ise bu davranışla doğrudan değil, önemseme üzerinden ilişkili bulunmuştur (Van der Graaff ve ark., 2018). Empati çalışmayla gelişebilir: 18 kontrollü deneyi (1.018 kişi) birleştiren bir incelemede empati eğitimlerinin orta büyüklükte bir etkisi bulunmuştur; etki, sağlık çalışanları ve üniversite öğrencileriyle yapılan çalışmalarda ve öz bildirim yerine nesnel ölçümler kullanıldığında daha büyüktür (Teding van Berkhout ve Malouff, 2016). Üç yön ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki testlerde birebir aynı olan 19 maddenin çevirisi korundu; kalan 10 madde iki ayrı taslakla çevrilip karşılaştırıldı. “Spiritually connected” (ruhen bağlı) ifadesi dinî bir anlam taşımasın diye “aramda derin bir bağ” diye çevrildi. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’de empatiyi ölçen başka ölçekler uyarlanmıştır: Davis’in Kişiler Arası Tepkisellik İndeksi üniversite öğrencileriyle (Engeler ve Yargıç, 2007), Temel Empati Ölçeği 13–21 yaşındaki gençlerle (Topçu ve ark., 2010), Toronto Empati Ölçeği üniversite öğrencileriyle (Totan ve ark., 2012). Bu testin maddeleri o ölçeklerin maddeleri değildir. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfalarında, ABD’deki Eugene-Springfield Topluluk Örneklemi’nin yetişkinleriyle hesaplanan iç tutarlılık (Cronbach α) şöyledir: anlayış (bu testte başkalarını düşünme) .81 ve sıcaklık (bu testte sıcaklık ve destek) .84 (501 kişi), empati (bu testte duygusal duyarlılık) .80 (471 kişi). Bu testte iki ölçek birer madde eksik sorulduğu için beklenen değerler biraz düşer: sıcaklık ve destek için yaklaşık .83, duygusal duyarlılık için yaklaşık .79 (sayfadaki ortalama madde ilişkilerinden Spearman–Brown formülüyle hesaplandı). IPIP’in empati ölçeği, JPI-R’nin asıl empati ölçeğiyle .64 (ölçüm hatası düzeltilince .82) ilişkilidir. Bu örneklemin açık verisine bu çalışmada ulaşılamadığı için standart sapmalar hesaplanamadı; raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Bu IPIP ölçeklerinin güvenirliği yetişkinlerde hesaplanmıştır; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı. Empati ergenlikte değişmeye devam eder: Hollanda’da 497 genci 13 ile 18 yaş arasında her yıl soran bir çalışmada başkasının gözünden bakabilme yaşla artmış, bu artış kızlarda erkeklerden daha hızlı olmuştur; başkalarının durumunu önemseme kızlarda daha yüksek ve durağan kalmış, erkeklerde ergenliğin başından ortasına doğru azalıp sonra başlangıçtaki düzeyine dönmüştür (Van der Graaff ve ark., 2014). Bu yüzden lise öğrencilerinde sonuç o dönemin bir resmi olarak düşünülmelidir; zamanla değişebilir.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. O günkü ruh hâli ve kendini nasıl göstermek istediği cevapları etkileyebilir. Başkalarını önemsemek değer verilen bir özellik olduğu için bu cümlelerde insanlar kendilerini olduğundan biraz daha olumlu anlatabilir.',
      'Test, başkalarının duygularını ve düşüncelerini ne kadar doğru anladığını ölçmez: kişilerin kendi empatilerini nasıl değerlendirdiği ile bu beceriyi ölçen görevlerdeki başarıları arasındaki ilişki çok zayıftır (Murphy ve Lilienfeld, 2019).',
      'Duygusal duyarlılığın dokuz cümlesinden yedisi, sıcaklık ve desteğin on cümlesinden sekizi aynı yöndedir: cümlelerin çoğuna “doğru” deme eğilimi bu yönlerin puanını yükseltebilir. Birbirinin tersini söyleyen beş cümle çiftinin çoğuna aynı uç cevap verilirse raporda uyarı gösterilir.',
      '29 cümleden 19’u sitedeki öteki testlerde de sorulur: sekizi Beş Faktör Kişilik Profili’nde, yedisi Kişiliğin 10 Yönü’nde, altısı Ayrıntılı Kişilik Profili’nde, dördü Duygusal Zekâ Bileşenleri’nde; ayrıca beşi 16 Faktörlü Kişilik Profili’nde, dördü Hızlı Kişilik Testi’nde, dördü Altı Boyutlu Kişilik Profili’nde, üçü Kişilerarası Tarz’da (bir cümle birden çok testte olabilir). Bu yüzden sonuçlar birbiriyle uyumlu çıkabilir: ör. uyumluluk ya da şefkat puanı yüksek olan birinin başkalarını düşünme puanı da yüksek olabilir.',
      'Sitedeki Bakış Açısı Alma testi, bir sahnenin başka bir yerden nasıl göründüğünü zihinde canlandırmayı ölçer; bu testteki başkalarını düşünme ise başkalarının duygularını ve görüşlerini önemsemeyi sorar. İkisi farklı şeylerdir.',
      'Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir. Duygulardan derinden etkilenmek kimi zaman yorucu olabilir; duygulardan kolay kolay etkilenmemek de başkalarını önemsemediği anlamına gelmez.',
      'Tanı koymaz; bir ruh sağlığı ya da gelişim taraması değildir ve uzman değerlendirmesinin yerini tutmaz.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır. Ölçüm payı hesaplanamadığı için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      { text: 'IPIP. AB5C ölçeklerinin anahtarları (anlayış ve sıcaklık).', url: 'https://ipip.ori.org/newAB5CKey.htm' },
      { text: 'IPIP. AB5C ölçeklerinin özet tablosu (güvenirlik).', url: 'https://ipip.ori.org/newAB5CTable.htm' },
      { text: 'IPIP. JPI-R ölçeklerinin anahtarları (empati).', url: 'https://ipip.ori.org/newJPI-RKey.htm' },
      { text: 'IPIP. JPI-R ölçeklerinin özet tablosu (güvenirlik ve JPI-R ile ilişki).', url: 'https://ipip.ori.org/newJPI-RTable.htm' },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Hofstee, W. K. B., de Raad, B. ve Goldberg, L. R. (1992). Integration of the Big Five and circumplex approaches to trait structure. Journal of Personality and Social Psychology, 63(1), 146–163.',
        url: 'https://doi.org/10.1037/0022-3514.63.1.146',
      },
      { text: 'Jackson, D. N. (1994). Jackson Personality Inventory–Revised manual. Sigma Assessment Systems.' },
      {
        text: 'Sigma Assessment Systems. (t.y.). Jackson Personality Inventory–Revised: Örnek rapor (ölçeklerin tanımları).',
        url: 'https://www.sigmaassessmentsystems.com/wp-content/uploads/2017/01/JPI-R-Sample-Report.pdf',
      },
      { text: 'Davis, M. H. (1980). A multidimensional approach to individual differences in empathy. JSAS Catalog of Selected Documents in Psychology, 10, 85.' },
      {
        text: 'Davis, M. H. (1983). Measuring individual differences in empathy: Evidence for a multidimensional approach. Journal of Personality and Social Psychology, 44(1), 113–126.',
        url: 'https://doi.org/10.1037/0022-3514.44.1.113',
      },
      {
        text: 'Jolliffe, D. ve Farrington, D. P. (2006). Development and validation of the Basic Empathy Scale. Journal of Adolescence, 29(4), 589–611.',
        url: 'https://doi.org/10.1016/j.adolescence.2005.08.010',
      },
      {
        text: 'Murphy, B. A. ve Lilienfeld, S. O. (2019). Are self-report cognitive empathy ratings valid proxies for cognitive empathy ability? Negligible meta-analytic relations with behavioral task performance. Psychological Assessment, 31(8), 1062–1072.',
        url: 'https://doi.org/10.1037/pas0000732',
      },
      {
        text: 'Yin, Y. ve Wang, Y. (2023). Is empathy associated with more prosocial behaviour? A meta-analysis. Asian Journal of Social Psychology, 26(1), 3–22.',
        url: 'https://doi.org/10.1111/ajsp.12537',
      },
      {
        text: 'Van der Graaff, J., Branje, S., De Wied, M., Hawk, S., Van Lier, P. ve Meeus, W. (2014). Perspective taking and empathic concern in adolescence: Gender differences in developmental changes. Developmental Psychology, 50(3), 881–888.',
        url: 'https://doi.org/10.1037/a0034325',
      },
      {
        text: 'Van der Graaff, J., Carlo, G., Crocetti, E., Koot, H. M. ve Branje, S. (2018). Prosocial behavior in adolescence: Gender differences in development and links with empathy. Journal of Youth and Adolescence, 47(5), 1086–1099.',
        url: 'https://doi.org/10.1007/s10964-017-0786-1',
      },
      {
        text: 'Teding van Berkhout, E. ve Malouff, J. M. (2016). The efficacy of empathy training: A meta-analysis of randomized controlled trials. Journal of Counseling Psychology, 63(1), 32–41.',
        url: 'https://doi.org/10.1037/cou0000093',
      },
      {
        text: 'Engeler, A. ve Yargıç, L. İ. (2007). Kişiler arası tepkisellik indeksi: Empatinin çok boyutlu ölçümü. Yeni Symposium, 45(3), 119–127.',
        url: 'https://acikerisim.ibu.edu.tr/items/15193195-c095-458d-b5c8-0db692833a2e',
      },
      {
        text: 'Topçu, Ç., Erdur-Baker, Ö. ve Çapa-Aydın, Y. (2010). Temel Empati Ölçeği Türkçe uyarlaması: Geçerlik ve güvenirlik çalışması. Türk Psikolojik Danışma ve Rehberlik Dergisi, 4(34), 174–182.',
        url: 'https://doi.org/10.17066/pdrd.58553',
      },
      {
        text: 'Totan, T., Doğan, T. ve Sapmaz, F. (2012). The Toronto Empathy Questionnaire: Evaluation of psychometric properties among Turkish university students. Eğitim Araştırmaları – Eurasian Journal of Educational Research, 12(46), 179–198.',
        url: 'https://acikerisim.ibu.edu.tr/items/04f1b11b-df41-44e2-9be8-2ffac9e92583',
      },
    ],
  },
};
