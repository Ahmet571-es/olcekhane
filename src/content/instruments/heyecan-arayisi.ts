import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Heyecan Arayışı
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) üç heyecan arayışı ölçeği ("Sensation-seeking facets", Hoyle ve
 * ark., 2002'ye atıfla; https://ipip.ori.org/newSingleConstructsKey.htm, özet tablo https://ipip.ori.org/newSingleconstructs.htm).
 * Kamu malıdır: izin ve ücret gerektirmeden her amaçla kullanılabilir (https://ipip.ori.org/newPermission.htm: "for any
 * purpose, commercial or non-commercial") ve çevrilebilir (https://ipip.ori.org/: "one can copy, edit, translate, or use them
 * for any purpose without asking permission and without paying a fee"). Maddeler ve yönleri anahtar sayfasından iki ayrı okumayla alındı; iki
 * okumada da metinler, yönler ve ölçekler aynı çıktı.
 *  - Dangerous thrill-seeking → Tehlikeli heyecanlara ilgi (sayfada 8 artı + 2 eksi madde, α .86, ortalama madde
 *    ilişkisi .40)
 *  - Impulsive thrill-seeking → Anlık heyecan arayışı (10 artı madde, α .84, .34)
 *  - Calculated thrill-seeking → Göze alma ve keşif (5 artı + 5 eksi madde, α .78, .27)
 * Ölçekler arası ilişkiler (sayfanın notu; köşeli parantezde ölçüm hatası düzeltilmiş): tehlikeli–anlık .47 [.55],
 * anlık–göze alma .45 [.56], tehlikeli–göze alma .62 [.76]. Sayfanın notuna göre bu ölçekler öteki IPIP ölçeklerinden farklı
 * kurulmuştur: maddeler dış ölçütlerle ilişkiye bakılarak değil, anlamlarına ve iç tutarlılığa göre seçilmiştir; ESCS'de
 * Hoyle ve ark.'nın Kısa Heyecan Arama Ölçeği (BSSS) uygulanmadığı için onunla karşılaştırılmamıştır ("Constructs for which
 * only IPIP items were administered to the ESCS"). Birkaç IPIP maddesi BSSS maddelerine çok benzer ("I like to do frightening
 * things", "I would like to explore strange places", "I would like to do bungee jumping"; BSSS-8). Bütün analizler
 * Eugene-Springfield Topluluk Örneklemi'ndeki (ESCS) yetişkinlerledir.
 *
 * Çıkarılan madde: "Might actually enjoy being caught in an earthquake or tornado." (tehlikeli heyecanlara ilginin 3.
 * maddesi). Türkiye'de depremler büyük kayıplara yol açmıştır; bir depreme yakalanmaktan keyif almayı sormak duyarsız olur
 * ve maddeyi yalnızca "hortum"a çevirmek de doğal afetten keyif almayı sormaya devam eder. Ölçek dokuz maddeyle
 * hesaplanır. Sayfadaki ortalama madde ilişkisiyle (.40) dokuz maddeli ölçeğin beklenen güvenirliği α ≈ .86'dır
 * (Spearman–Brown: 9 · .40 / (1 + 8 · .40) = .857).
 *
 * Kültürel uyarlama: "hang gliding" (delta kanat) Türkiye'de pek bilinmediği için dan10'da yerine bilinen benzer hava sporu
 * "yamaç paraşütü" yazılır (bilim kartında yazılı).
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (14 madde:
 *    dokuzu Altı Boyutlu Kişilik Profili'nde (sekizi Tehlikeden çekinme, biri Merak alt özelliğinde), beşi Ayrıntılı ve 16 Faktörlü
 *    Kişilik Profili ile Öğrenme ve Başarı Özellikleri'nde).
 *  - Kalan 15 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi.
 *    "Do crazy things" → "Çılgınlıklar yaparım" (aynı ölçekteki "Act wild and crazy" sitede "Çılgınca şeyler yaparım" diye
 *    çevrilmiştir; iki madde testin iki ucunda durur); "Take risks" → "Risk alırım" (göze almadaki "Risk almaya istekliyim"
 *    bir istekliliği, bu madde bir davranışı sorar; İngilizcesindeki fark korunur); "Might..." → "-abilirdim", "Would..." →
 *    "-ırdım"; "Would like to try" → "denemek isterim" ("isterdim" bir pişmanlık gibi okunabilir).
 *  - Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 *
 * Örtüşme (İngilizce asılları birebir aynı maddeler): göze alma ve keşfin beş maddesi ile tehlikeli heyecanlara ilginin üç
 * maddesi Altı Boyutlu Kişilik Profili'nin "Tehlikeden çekinme" alt özelliğinde de sorulur; göze almanın bir maddesi o testin
 * "Merak" alt özelliğindedir. Anlık heyecan arayışının beş maddesi öteki testlerdedir: "Macera ararım" ve "Çılgınca şeyler
 * yaparım" Ayrıntılı Kişilik Profili'nin heyecan arayışında, "Uçsuz bucaksız hayallere dalmaktan hoşlanırım" onun hayal
 * gücünde; "Çılgınca şeyler yaparım" 16 Faktörlü Kişilik Profili'nin neşe ve canlılığında, "Beklenmedik şeyler yaparım" ve
 * "Uçsuz bucaksız..." onun hayal gücünde; "Aklıma estiği gibi davranmayı severim" Öğrenme ve Başarı Özellikleri'nin planlı ve
 * dikkatli çalışmasında (ters yönde). Bu testlerin ilgili sonuçları birbirine benzer çıkabilir; bilim kartında yazılıdır.
 *
 * Madde anahtarı: ölçeğin kısaltması (dan, imp, cal) + maddenin IPIP sayfasındaki sırası (önce artı, sonra eksi yönlü
 * maddeler; çıkarılan deprem maddesinin numarası, dan03, atlanır). Uygulama sırası: üç ölçek sırayla döner (anlık,
 * tehlikeli, göze alma); art arda iki madde aynı ölçekten değildir. Birbirine benzeyen ya da birbirinin tersini söyleyen
 * maddeler birbirinden uzaktır: "Çılgınlıklar yaparım" (4) ile "Çılgınca şeyler yaparım" (22) 18; iki bungee jumping maddesi
 * (5, 17) 12; "Risk almaya istekliyim" (12) ile "Risk alırım" (28) 16; iki "asla" maddesi (17, 27) 10; "Korkutucu şeyler
 * yapmayı severim" (8) ile "Tehlikeli durumları çok severim" (23) 15 madde arayla.
 *
 * Puanlama: her ölçek maddelerinin ortalamasıdır (1–5); en az dörtte üçü cevaplanmalıdır. Düzeyler öteki IPIP testlerindeki
 * gibi üçtür (2,6 ve 3,4 eşikleri). Uçların iyi ya da kötü anlamı yoktur. Toplam bir puan hesaplanmaz: kaynak üç ölçeği ayrı
 * verir.
 *
 * Güvenirlik ve ölçüm payı: IPIP sayfasındaki α değerleri ESCS yetişkinlerindendir. Bu örneklemin herkese açık verisine
 * (Goldberg, 2018, Harvard Dataverse) bu çalışmada ulaşılamadı (ağ erişimi kapalı); bu yüzden standart sapma (sdRef)
 * hesaplanamadı ve raporda ölçüm payı gösterilmez. Veriye ulaşılınca α ve sdRef hesaplanıp eklenebilir.
 *
 * Evet deme eğilimi: anlık heyecan arayışının on maddesinin hepsi aynı yöndedir; cümlelerin çoğuna "doğru" deme eğilimi bu
 * ölçeğin puanını yükseltebilir (bilim kartında yazılı). Ölçeklerde birbirinin tam tersi olan yeterli sayıda madde çifti
 * olmadığı için karşıt çift uyarısı (`oppositePairs`) kullanılmaz.
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const DAN = 'danger';
const IMP = 'impulsive';
const CAL = 'venture';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { dan: DAN, imp: IMP, cal: CAL };

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['imp03', false, 'Beklenmedik şeyler yaparım.', 'Do unexpected things.'],
  ['dan09', true, 'Suç oranı yüksek bir semtte yürümem gerekse korkardım.', 'Would fear walking in a high-crime part of a city.'],
  ['cal05', false, 'Yeni deneyimlere açığım.', 'Am open to new experiences.'],
  ['imp01', false, 'Çılgınlıklar yaparım.', 'Do crazy things.'],
  ['dan04', false, 'Bungee jumping yapmayı denemek isterim.', 'Would like to try bungee jumping.'],
  ['cal06', true, 'Fiziksel tehlike karşısında korkak biriyim.', 'Am a physical coward.'],
  ['imp09', false, 'Macera ararım.', 'Seek adventure.'],
  ['dan02', false, 'Korkutucu şeyler yapmayı severim.', 'Like to do frightening things.'],
  ['cal08', true, 'Hava kötü olduğunda içeride kalmaya çalışırım.', 'Try to stay inside when the weather is bad.'],
  ['imp04', false, 'Aklıma estiği gibi davranmayı severim.', 'Like to act on a whim.'],
  ['dan05', false, 'Açık denizde kaybolmanın heyecanından hoşlanabilirdim.', 'Might enjoy the thrill of being lost at sea.'],
  ['cal02', false, 'Risk almaya istekliyim.', 'Am willing to take risks.'],
  ['imp06', false, 'Ne yapacağım belli olmaz; insanlar ne söyleyeceğimi asla kestiremez.', 'Am unpredictable, people never know what I am going to say.'],
  ['dan08', false, 'Sıkılmaktansa korkmayı tercih ederim.', 'Prefer fear to boredom.'],
  ['cal09', true, 'Yükseklikten korkarım.', 'Am afraid of heights.'],
  ['imp07', false, 'Uçsuz bucaksız hayallere dalmaktan hoşlanırım.', 'Enjoy wild flights of fantasy.'],
  ['dan10', true, 'Yamaç paraşütü ya da bungee jumping asla yapmazdım.', 'Would never go hang gliding or bungee jumping.'],
  ['cal01', false, 'Tehlike karşısında kendimden emin davranırım.', 'Face danger confidently.'],
  ['imp05', false, 'Saçma şeyler yapmaya kolayca ikna olurum.', 'Am easily talked into doing silly things.'],
  ['dan06', false, 'Uçaktan paraşütle atlayıp serbest düşüş yapmaktan hoşlanabilirdim.', 'Might enjoy a free fall from an airplane.'],
  ['cal03', false, 'Yanan bir binadan insanları kurtarmakta başarılı olurdum.', 'Would be good at rescuing people from a burning building.'],
  ['imp02', false, 'Çılgınca şeyler yaparım.', 'Act wild and crazy.'],
  ['dan01', false, 'Tehlikeli durumları çok severim.', 'Love dangerous situations.'],
  ['cal10', true, 'Büyük köpeklerden korkarım.', 'Am afraid of large dogs.'],
  ['imp08', false, 'Başkalarını gerçekten maceralı ya da çılgınca bir şey yapmaya ikna ettiğim olmuştur.', 'Have persuaded others to do something really adventurous or crazy.'],
  ['dan07', false, 'Fırtınalı havada denizde bir yelkenlide olmaktan hoşlanırdım.', 'Would enjoy being out on a sailboat during a storm.'],
  ['cal07', true, 'Kanoyla sert akıntılı bir nehirden aşağı asla inmezdim.', 'Would never go riding down a stretch of rapids in a canoe.'],
  ['imp10', false, 'Risk alırım.', 'Take risks.'],
  ['cal04', false, 'Alışılmadık yerleri keşfetmeyi çok isterdim.', 'Would love to explore strange places.'],
];

/** Kaynakta olup bu testte sorulmayan madde (deprem maddesi). */
export const HEYECAN_REMOVED = ['dan03'];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const heyecanArayisi: LikertInstrument = {
  slug: 'heyecan-arayisi',
  version: 1,
  engine: 'likert',
  name: 'Heyecan Arayışı',
  shortName: 'Heyecan arayışı',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 15.8,
  tagline: 'Heyecan arayışını üç yönde gösterir: tehlikeli heyecanlara ilgi, anlık heyecan arayışı, göze alma ve keşif.',
  description:
    'Heyecan arayışı, yeni, değişik ve yoğun deneyimler arama eğilimidir. Bu test onu üç yönde gösterir: korku ve tehlike içeren deneyimlere ilgi; anlık kararlarla beklenmedik ve çılgınca şeyler yapma; tehlike karşısında kendinden emin olma, yeni şeyleri göze alma ve keşfetme. Kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç heyecan arayışı ölçeğine dayanır; 29 kısa cümleden oluşur ve yaklaşık 5 dakika sürer. Rapor, üç yönün birlikte ne anlatabileceğini ve heyecan ihtiyacının güvenli yollarla nasıl karşılanabileceğini de anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Tanı koymaz; kişinin ne yapacağını ya da riskli bir davranışta bulunup bulunmayacağını öngörmez.',
  intro: {
    title: 'Heyecanı nerede ararsın?',
    paragraphs: [
      'Birazdan seni anlatan 29 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Bazı cümleler hiç yaşamadığın durumları sorar (ör. bungee jumping). Böyle bir durumda kendini nasıl hissedeceğini düşünerek cevap ver.',
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
  scales: [
    {
      key: DAN,
      name: 'Tehlikeli heyecanlara ilgi',
      plain:
        'Korku ve tehlike içeren heyecanlı deneyimlere (bungee jumping, paraşütle atlama, fırtınada denize açılmak gibi) ilgi duyma ve korkmayı sıkılmaya tercih etme.',
      poles: { low: 'Tehlikeli heyecanlara pek ilgi duymayan', high: 'Tehlikeli heyecanlara ilgi duyan' },
    },
    {
      key: IMP,
      name: 'Anlık heyecan arayışı',
      plain:
        'Aklına estiği gibi davranma; beklenmedik ve çılgınca şeyler yapma, macera arama ve risk alma; başkalarını bu tür şeylere ikna etme ya da kolayca ikna olma.',
      poles: { low: 'Ölçülü ve öngörülebilir', high: 'Anlık kararlarla macera arayan' },
    },
    {
      key: CAL,
      name: 'Göze alma ve keşif',
      plain:
        'Tehlike karşısında kendinden emin olma, risk almayı göze alma, alışılmadık yerleri keşfetmek isteme ve yeni deneyimlere açık olma; yükseklik, kötü hava ya da büyük köpekler gibi şeylerden pek çekinmeme.',
      poles: { low: 'Temkinli, güvenli olanı seçen', high: 'Göze alan ve keşfetmeyi seven' },
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç heyecan arayışı ölçeği: tehlikeli heyecan arayışı (Dangerous thrill-seeking), anlık heyecan arayışı (Impulsive thrill-seeking) ve hesaplı heyecan arayışı (Calculated thrill-seeking). IPIP bu ölçekleri Hoyle ve arkadaşlarının (2002) kısa heyecan arama ölçeği üzerine yaptığı çalışmaya atıfla verir. Ölçeklerin maddeleri IPIP’indir; birkaçı (ör. korkutucu şeyler yapmak, alışılmadık yerleri keşfetmek, bungee jumping) o ölçeğin maddelerine çok benzer. Kaynaktaki 30 maddeden 29’u kullanılır: tehlikeli heyecan arayışında bir depreme yakalanmaktan keyif almayı soran madde, Türkiye’de depremlerin yol açtığı acılar düşünülerek çıkarıldı.',
    whatItMeasures:
      'Heyecan arayışı, farklı, yeni, karmaşık ve yoğun his ve deneyimler arama ve bu deneyimler için fiziksel, sosyal, yasal ve parasal riskleri göze almaya istekli olma eğilimidir (Zuckerman, 1994). Bu test onu üç yönde ölçer: korku ve tehlike içeren deneyimlere ilgi ve korkmayı sıkılmaya tercih etme (tehlikeli heyecanlara ilgi); aklına estiği gibi davranma, beklenmedik ve çılgınca şeyler yapma, macera arama ve risk alma (anlık heyecan arayışı); tehlike karşısında kendinden emin olma, risk almaya istekli olma, alışılmadık yerleri keşfetmek isteme ve yükseklik ya da kötü hava gibi şeylerden pek çekinmeme (göze alma ve keşif). Kaynakta “hesaplı heyecan arayışı” diye adlandırılan üçüncü ölçeğin maddeleri plan yapmayı değil, göze almayı ve keşfetmeyi sorar; Türkçe adı bu yüzden seçildi. Kaynak, üç ölçeğin adlarının nereden geldiğini açıklamaz. Heyecan arayışı, düşünmeden hareket etmeyle (dürtüsellik) aynı şey değildir: 10–30 yaşındaki 935 kişiyle yapılan bir çalışmada iki özellik yaşla farklı biçimde değişmiştir (Steinberg ve ark., 2008); heyecan arayan birçok kişi tehlikeli bir işe girişmeden önce dikkatle plan yapar (Maples-Keller ve ark., 2016). Paraşütle atlama, dağcılık ve kaya tırmanışı gibi yüksek riskli sporlarla uğraşanlarla yapılan bir çalışmada heyecan arayışı yüksek olanların daha az önlem almadığı görülmüş (bir ölçekle ikisi arasında ilişki bulunmamış, başka bir ölçekle heyecan arayışı yüksek olanlar biraz daha çok önlem aldıklarını bildirmiş); önlem alanlar ise biraz daha az kaza ve kıl payı kurtulma bildirmiştir (Woodman ve ark., 2013). 16–20 yaşındaki 223 gençle yapılan bir çalışmada heyecan arayışı, bir takıma girmeyi denemek gibi olumlu risklerle de, olumsuz risklerle de ilişkili bulunmuş; dürtüsellik ise yalnızca olumsuz risklerle ilişkili çıkmıştır (Duell ve Steinberg, 2020). Arkadaşların yanında risk alma artar; bu etki 13–22 yaşındakilerde 24 yaş ve üstündekilerden daha güçlü bulunmuştur (Gardner ve Steinberg, 2005). Üç ölçek ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz. Bu test bir yetenek, cesaret ya da zekâ ölçmez; sonuç kişinin kendini nasıl tanımladığını gösterir.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki kişilik testlerinde birebir aynı olan 14 maddenin çevirisi korundu; kalan 15 madde iki ayrı taslakla çevrilip karşılaştırıldı. Türkiye’de pek bilinmeyen “hang gliding” (delta kanat) yerine bilinen benzer hava sporu yamaç paraşütü yazıldı. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’de heyecan arayışını ölçen başka ölçekler uyarlanmıştır: Hoyle ve arkadaşlarının kısa ölçeğinden türetilen dört maddelik biçim (Stephenson ve ark., 2003) 8. sınıf öğrencileriyle (Çelik, 2015), Zuckerman ve arkadaşlarının dürtüsel heyecan arayışı ölçeği yetişkinlerle (Yıldırım ve ark., 2021). Bu testin maddeleri o ölçeklerin maddeleri değildir; ancak birkaç madde kısa ölçeğin maddelerine çok benzer (ör. “Korkutucu şeyler yapmayı severim” Çelik’in Türkçe sürümünde de aynı sözlerle geçer). Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfasında, ABD’deki Eugene-Springfield Topluluk Örneklemi’nin yetişkinleriyle hesaplanan iç tutarlılık (Cronbach α) şöyledir: tehlikeli heyecanlara ilgi .86, anlık heyecan arayışı .84, göze alma ve keşif .78. Deprem maddesi çıkarılınca tehlikeli heyecanlara ilginin dokuz maddesiyle beklenen değer yine yaklaşık .86’dır (sayfadaki ortalama madde ilişkisinden hesaplandı). Ölçekler birbiriyle ilişkilidir: tehlikeli heyecanlara ilgi ile göze alma arasında .62, öteki çiftlerde .45–.47. Bu örneklemin açık verisine bu çalışmada ulaşılamadığı için standart sapmalar hesaplanamadı; raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Bu IPIP ölçeklerinin güvenirliği yetişkinlerde hesaplanmıştır; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı. Heyecan arayışı yaşla değişir: 11 ülkede 10–30 yaşındaki 5.000’den fazla kişiyle yapılan bir çalışmada, sorular ve oyun benzeri görevlerle ölçülen heyecan arayışı en yüksek düzeyine 19 yaş dolayında ulaşmış, sonra azalmıştır; ergenlikte yükselip sonra azalan bu düzen 11 ülkenin 7’sinde anlamlı bulunmuş, en yüksek düzeyin yaşı ülkeden ülkeye biraz değişmiştir (Steinberg ve ark., 2018). Bu yüzden lise öğrencilerinde sonuç o dönemin bir resmi olarak düşünülmelidir; zamanla değişebilir.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. O günkü ruh hâli ve kendini nasıl göstermek istediği cevapları etkileyebilir.',
      'Cümlelerin bir kısmı kişinin hiç yaşamadığı durumları sorar (ör. bungee jumping, paraşütle atlama); bu cümlelerde cevap, kişinin o durumda nasıl hissedeceğini düşündüğünü gösterir.',
      'Anlık heyecan arayışının on cümlesinin hepsi aynı yöndedir: cümlelerin çoğuna “doğru” deme eğilimi bu yönün puanını yükseltebilir.',
      'Bu IPIP ölçeklerinin maddeleri anlamlarına ve iç tutarlılığa göre seçilmiştir; IPIP sayfası bu ölçeklerin bilinen heyecan arama ölçekleriyle ya da kişilerin gerçek davranışlarıyla karşılaştırıldığı bir sonuç vermez.',
      '29 cümleden 14’ü sitedeki öteki kişilik testlerinde de sorulur: dokuzu Altı Boyutlu Kişilik Profili’nde (tehlikeden çekinme ve merak), beşi Ayrıntılı Kişilik Profili, 16 Faktörlü Kişilik Profili ve Öğrenme ve Başarı Özellikleri’nde. Bu yüzden sonuçlar birbiriyle uyumlu çıkabilir: ör. tehlikeden çekinme puanı yüksek olan birinin göze alma ve keşif puanı düşük olabilir.',
      'Uçların iyi ya da kötü anlamı yoktur. Test, kişinin riskli bir davranışta bulunup bulunmayacağını öngörmez.',
      'Tanı koymaz; bir ruh sağlığı ya da dürtüsellik taraması değildir ve uzman değerlendirmesinin yerini tutmaz.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır. Ölçüm payı hesaplanamadığı için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      { text: 'IPIP. Tek yapıyı ölçen IPIP ölçeklerinin anahtarları (heyecan arayışı ölçekleri, Hoyle ve ark., 2002’ye atıfla).', url: 'https://ipip.ori.org/newSingleConstructsKey.htm' },
      { text: 'IPIP. Tek yapıyı ölçen IPIP ölçeklerinin özet tablosu (güvenirlik ve ölçekler arası ilişkiler).', url: 'https://ipip.ori.org/newSingleconstructs.htm' },
      {
        text: 'Hoyle, R. H., Stephenson, M. T., Palmgreen, P., Lorch, E. P. ve Donohew, R. L. (2002). Reliability and validity of a brief measure of sensation seeking. Personality and Individual Differences, 32(3), 401–414.',
        url: 'https://doi.org/10.1016/S0191-8869(01)00032-0',
      },
      {
        text: 'Stephenson, M. T., Hoyle, R. H., Palmgreen, P. ve Slater, M. D. (2003). Brief measures of sensation seeking for screening and large-scale surveys. Drug and Alcohol Dependence, 72(3), 279–286.',
        url: 'https://doi.org/10.1016/j.drugalcdep.2003.08.003',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      { text: 'Zuckerman, M. (1994). Behavioral expressions and biosocial bases of sensation seeking. Cambridge University Press.' },
      {
        text: 'Maples-Keller, J. L., Berke, D. S., Few, L. R. ve Miller, J. D. (2016). A review of sensation seeking and its empirical correlates: Dark, bright, and neutral hues. V. Zeigler-Hill ve D. K. Marcus (Ed.), The dark side of personality: Science and practice in social, personality, and clinical psychology (s. 137–156). American Psychological Association.',
        url: 'https://doi.org/10.1037/14854-008',
      },
      {
        text: 'Steinberg, L., Albert, D., Cauffman, E., Banich, M., Graham, S. ve Woolard, J. (2008). Age differences in sensation seeking and impulsivity as indexed by behavior and self-report: Evidence for a dual systems model. Developmental Psychology, 44(6), 1764–1778.',
        url: 'https://doi.org/10.1037/a0012955',
      },
      {
        text: 'Steinberg, L. ve ark. (2018). Around the world, adolescence is a time of heightened sensation seeking and immature self-regulation. Developmental Science, 21(2), e12532.',
        url: 'https://doi.org/10.1111/desc.12532',
      },
      {
        text: 'Woodman, T., Barlow, M., Bandura, C., Hill, M., Kupciw, D. ve MacGregor, A. (2013). Not all risks are equal: The Risk Taking Inventory for high-risk sports. Journal of Sport and Exercise Psychology, 35(5), 479–492.',
        url: 'https://doi.org/10.1123/jsep.35.5.479',
      },
      {
        text: 'Duell, N. ve Steinberg, L. (2020). Differential correlates of positive and negative risk taking in adolescence. Journal of Youth and Adolescence, 49, 1162–1178.',
        url: 'https://doi.org/10.1007/s10964-020-01237-7',
      },
      {
        text: 'Gardner, M. ve Steinberg, L. (2005). Peer influence on risk taking, risk preference, and risky decision making in adolescence and adulthood: An experimental study. Developmental Psychology, 41(4), 625–635.',
        url: 'https://doi.org/10.1037/0012-1649.41.4.625',
      },
      {
        text: 'Çelik, E. (2015). Ergenler için Kısa Heyecan Arayışı Ölçeği’nin psikometrik özelliklerinin incelenmesi. Sakarya University Journal of Education, 5(3), 42–51.',
        url: 'https://doi.org/10.19126/suje.52806',
      },
      {
        text: 'Yıldırım, S., Bilgin, E., Yüksel, Y., Demirhan, G. ve Aşçı, F. H. (2021). Adaptation of the Impulsive Sensation Seeking Scale to Turkish. Addicta: The Turkish Journal on Addictions, 8(2), 151–156.',
        url: 'https://doi.org/10.5152/addicta.2021.21030',
      },
    ],
  },
};
