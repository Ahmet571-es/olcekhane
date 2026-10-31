import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Liderlik Eğilimleri
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) üç ölçeği. Kamu malıdır: izin ve ücret gerektirmeden her amaçla
 * kullanılabilir (https://ipip.ori.org/newPermission.htm: "for any purpose, commercial or non-commercial") ve çevrilebilir
 * (https://ipip.ori.org/).
 *  - Hogan Kişilik Envanteri'ne (HPI) benzeyen IPIP ölçeklerinden "Leadership" (6 maddelik alt bileşen, HIC) → Öne çıkıp
 *    yön verme (https://ipip.ori.org/newHPIKeys.htm; 4 artı + 2 eksi madde, α .81). HPI'nin asıl alt bileşeniyle ilişkisi
 *    .66, ölçüm hatası düzeltilince .79 (o ölçeğin α'sı .86; tablo https://ipip.ori.org/newHPITable.htm; ABD'de 501
 *    yetişkin, Eugene-Springfield Topluluk Örneklemi).
 *  - IPIP-HEXACO "Social Boldness" (X: SocB; Ashton, Lee ve Goldberg, 2007) → Sosyal cesaret
 *    (https://ipip.ori.org/newHEXACO_PI_key.htm; 5 artı + 5 eksi madde, α .86). Sitedeki Altı Boyutlu Kişilik Profili'nin
 *    "Sosyal cesaret" alt özelliğiyle aynı on maddedir; çeviriler ve düzey eşikleri de aynıdır. Ashton, Lee ve Goldberg (2007,
 *    Tablo 2): ESCS'den 411 kişi; IPIP α .86, HEXACO-PI α .85; HEXACO-PI'nin asıl ölçeğiyle (8 madde) ilişkisi .83,
 *    düzeltilince .97 (tablo https://ipip.ori.org/newHEXACO_PI_table.htm).
 *  - AB5C ölçeklerinden "Purposefulness" (III+/IV+) → Kararlılık ve sorumluluk (https://ipip.ori.org/newAB5CKey.htm; 5 artı
 *    + 7 eksi madde, α .81, ortalama madde ilişkisi .27; tablo https://ipip.ori.org/newAB5CTable.htm; 501 yetişkin,
 *    Eugene-Springfield Topluluk Örneklemi). AB5C bir envanter olmadığı için asıl bir ölçekle ilişkisi yoktur.
 * Kaynak doğrulaması: IPIP'in HPI anahtar sayfası 2026-10-31'de maddeleri vermiyordu (yalnızca ölçek adları ve α); HPI ve AB5C
 * tablo sayfaları ile HEXACO tablo sayfası otomatik okumaya kapalıydı (robots); AB5C anahtar sayfasının okunan metni yalnızca
 * I. ve II. faktörün ölçeklerini kapsıyordu. Bu sayfalar IPIP sitesinin bir arşiv kopyasından okundu
 * (https://ipip-remaster.vercel.app/archive/ipip-mirror/ipip.ori.org/newHPIKeys.htm, newAB5CKey.htm ve aynı klasördeki tablo
 * sayfaları); öne çıkıp yön vermenin 6 ve kararlılık ve sorumluluğun 12 maddesi metin, sıra ve yönleriyle birebir karşılaştırıldı.
 * Ayrıca öne çıkıp yön vermenin altı maddesinin her biri IPIP'in resmî sayfalarında birebir aynı metinle yer alır ("Take charge",
 * "Want to be in charge", "Wait for others to lead the way", "Let others make the decisions" new16PFKey.htm'de; "Try to lead
 * others" newCPIKey.htm ve new6FPQKey.htm'de; "Can talk others into doing things" newMPQKey.htm ve BFASKeys.htm'de).
 * Kararlılık ve sorumluluğun on iki maddesinden beşi resmî sayfalarda birebir görüldü ("Am always prepared", "Make a mess of
 * things", "Mess things up", "Shirk my duties" new6FPQKey.htm'de; "Carry out my plans" newCPIKey.htm'de). Sosyal cesaretin
 * maddeleri resmî anahtar sayfasından okundu. Üç ölçek arasında ortak madde yoktur.
 *
 * Seçim: IPIP'te VIA dışında liderliğin bütününü ölçen bir ölçek yoktur; "Leadership" adlı ölçeklerin bazıları ya başka bir
 * şeyi (ör. öz-saygıyı) ya da başkalarını kandırmayı ve güç isteğini soran maddeler içerir (gençlere uygun değil). Bu test,
 * araştırmalarda liderlikle ilişkili bulunan üç eğilimi ayrı ayrı sorar: öne çıkıp yön verme (dışadönüklüğün baskınlık yanı),
 * topluluk içinde rahat olma (sosyal cesaret) ve üstlendiğini sonuna götürme (sorumluluğun kararlılık ve güvenilirlik yanı;
 * Judge ve ark., 2002; bilim kartında). Üçüncü ölçeğin adı "Kararlılık ve sorumluluk"tur: "Purposefulness" amaçlı ve kararlı
 * davranmayı anlatır; maddeler hazırlıklı olmayı, planları uygulamayı, dikkati toplamayı, sorumluluktan kaçmamayı ve karar
 * verebilmeyi sorar. "Sorumluluk" tek başına öteki testlerde beş faktörün bir boyutunun adı olduğu için kullanılmadı;
 * "Liderlik" adı da tek bir ölçeğe verilmedi (Ayrıntılı Kişilik Profili'nde bir alt özelliğin adıdır).
 * "İkna" ya da "takım çalışması" için IPIP'te (VIA dışında) uygun bir ölçek bulunamadı; bu yönler testte yoktur.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Sitedeki öteki testlerde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (25 madde; Çocuk Kişilik
 *    Profili'nin çocuklara yazılmış çevirileri kullanılmadı).
 *  - Kalan 3 madde için iki ayrı çeviri taslağı hazırlandı (ikincisi birincisi görülmeden); ikisi karşılaştırılarak son hâl
 *    seçildi:
 *    "Am not easily distracted": "Dikkatim kolay kolay dağılmaz." / "Bir işe odaklandığımda kolayca başka şeylere kaymam." →
 *    birincisi (kısa ve doğal; karşıtı "Dikkatim kolayca dağılır." Kişiliğin 10 Yönü'ndeki çeviridir).
 *    "Do things at the last minute": "İşleri son dakikaya bırakırım." / "Yapacaklarımı genellikle son ana bırakırım." →
 *    ikincisinden, metin ve mantık incelemesinin önerisiyle "Yapmam gerekenleri son ana bırakırım." ("genellikle" aslında
 *    yok; "Yapacaklarım" az kullanılır; "son dakika" sitedeki "Planlarımı sık sık son dakikada yaparım." ve "Ödevlerimi çoğu
 *    zaman son dakikaya bırakırım." cümlelerine çok benzerdi; bu testte "İşleri" ile başlayan dört madde zaten var).
 *    "Can't make up my mind": "Karar vermekte zorlanırım." / "Bir türlü karar veremem." → birincisi ("bir türlü" aslından
 *    daha güçlü; "Karar vermeyi ertelerim." maddesinden ayrıdır).
 *  - Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 *
 * Madde anahtarı: ölçeğin kısaltması (yon, ces, kar) + maddenin IPIP anahtar sayfasındaki sırası (sayfalar her ölçekte önce
 * artı, sonra eksi yönlü maddeleri verir; ces anahtarları Altı Boyutlu'daki socb anahtarlarıyla aynı sıradadır). Uygulama
 * sırası: art arda iki madde aynı ölçekten değildir; aynı yönde en çok üç madde art arda gelir; ilk madde yumuşak bir
 * başlangıçtır; art arda iki madde aynı sözle başlamaz ve aynı sözle bitmez ("Karar vermekte zorlanırım." ile "Başkalarının
 * yanına gidip konuşmakta zorlanırım." bu yüzden ayrıdır). Birbirinin tersini söyleyen ya da birbirine çok benzeyen maddeler en az
 * 10 madde arayla gelir (idareyi ele alma / yolu başkalarının göstermesini bekleme; ilgi odağı olmak; topluluk önünde
 * konuşma; dikkatin dağılması; "işleri birbirine karıştırırım" / "işleri yüzüme gözüme bulaştırırım"); benzer konulardaki
 * öteki maddeler (iki "liderlik" maddesi, iki "karar" maddesi, iki "işlerin başında olma" maddesi, işi bitirme ve işe başlama
 * maddeleri, geri planda kalma ile yolu başkalarının göstermesini bekleme gibi) en az 6 madde arayla
 * (tests/liderlik-egilimleri.test.ts denetler).
 *
 * Puanlama: her ölçek maddelerinin ortalamasıdır (1–5); en az dörtte üçü cevaplanmalıdır. Düzeyler öteki IPIP testlerindeki
 * gibi üçtür (2,6 ve 3,4 eşikleri). Toplam bir puan hesaplanmaz. Güvenirlik (α) IPIP sayfalarındaki değerdir; standart sapma
 * bilinmediği için `sdRef` yoktur ve raporda ölçüm payı gösterilmez.
 *
 * Evet deme eğilimi: öne çıkıp yön vermenin altı maddesinden dördü düz, sosyal cesaretin beşi düz beşi ters, kararlılık ve
 * sorumluluğun beşi düz yedisi ters yönlüdür. Birbirinin tersini söyleyen dört çift (`oppositePairs`) aynı uç cevabı yakalar:
 * idareyi ele almak / yolu başkalarının göstermesini beklemek; ilgi odağı olmaktan rahatsız olmamak / nefret etmek; hazırlıksız
 * konuşmada iyi olmak / topluluk önünde konuşmaktan korkmak; dikkatin kolay kolay dağılmaması / kolayca dağılması. Uyarı en az
 * ikisinde (likert.ts: çiftlerin yarısı).
 *
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki
 * siteyi inceler). Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const YON = 'lead';
const CES = 'bold';
const KAR = 'purpose';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { yon: YON, ces: CES, kar: KAR };

/** [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı]: uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['ces03', false, 'İnsanların arasında kendimi rahat hissederim.', 'Feel comfortable around people.'],
  ['yon03', false, 'Başkalarına liderlik etmeye çalışırım.', 'Try to lead others.'],
  ['kar05', false, 'İşleri sorunsuz bir şekilde hallederim.', 'Handle tasks smoothly.'],
  ['yon05', true, 'Yolu başkalarının göstermesini beklerim.', 'Wait for others to lead the way.'],
  ['ces01', false, 'Hazırlıksız konuşma yapmakta iyiyim.', 'Am good at making impromptu speeches.'],
  ['kar04', false, 'Dikkatim kolay kolay dağılmaz.', 'Am not easily distracted.'],
  ['ces05', false, 'Güçlü bir kişiliğim var.', 'Have a strong personality.'],
  ['kar11', true, 'Yapmam gerekenleri son ana bırakırım.', 'Do things at the last minute.'],
  ['ces08', true, 'Başkalarının yanına gidip konuşmakta zorlanırım.', 'Find it difficult to approach others.'],
  ['kar02', false, 'Yaptığım planları uygularım.', 'Carry out my plans.'],
  ['ces07', true, 'Kalabalıkta geri planda kalmayı tercih ederim.', 'Keep in the background.'],
  ['kar12', true, 'Karar vermekte zorlanırım.', "Can't make up my mind."],
  ['yon02', false, 'İşlerin başında ben olmak isterim.', 'Want to be in charge.'],
  ['ces10', true, 'Genellikle söyleyecek pek bir şeyim olmaz.', 'Have little to say.'],
  ['kar06', true, 'İşleri birbirine karıştırırım.', 'Make a mess of things.'],
  ['ces02', false, 'İlgi odağı olmak beni rahatsız etmez.', "Don't mind being the center of attention."],
  ['yon04', false, 'Başkalarını bir şeyler yapmaya ikna edebilirim.', 'Can talk others into doing things.'],
  ['kar03', false, 'Hemen işe koyulurum.', 'Get to work at once.'],
  ['yon06', true, 'Kararları başkalarına bırakırım.', 'Let others make the decisions.'],
  ['kar07', true, 'Dikkatim kolayca dağılır.', 'Am easily distracted.'],
  ['yon01', false, 'İdareyi ele alırım.', 'Take charge.'],
  ['kar10', true, 'İşleri sonuna kadar götürmem.', "Don't see things through."],
  ['ces06', true, 'Topluluk önünde konuşma yapmam gerekse korkardım.', 'Would be afraid to give a speech in public.'],
  ['kar09', true, 'Sorumluluklarımdan kaçarım.', 'Shirk my duties.'],
  ['ces04', false, 'Liderlik yeteneğim var.', 'Have leadership abilities.'],
  ['kar01', false, 'Her zaman hazırlıklı olurum.', 'Am always prepared.'],
  ['ces09', true, 'İlgi odağı olmaktan nefret ederim.', 'Hate being the center of attention.'],
  ['kar08', true, 'İşleri yüzüme gözüme bulaştırırım.', 'Mess things up.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const liderlikEgilimleri: LikertInstrument = {
  slug: 'liderlik-egilimleri',
  version: 1,
  engine: 'likert',
  name: 'Liderlik Eğilimleri',
  shortName: 'Liderlik',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 15.995,
  tagline: 'Araştırmalarda liderlikle ilişkili bulunan üç eğilimini gösterir: “Öne çıkıp yön verme”, “Sosyal cesaret” ve “Kararlılık ve sorumluluk”.',
  description:
    'Bu test, araştırmalarda liderlikle ilişkili bulunan üç kişilik eğilimini ayrı ayrı gösterir. Birincisi bir grupta idareyi ele alıp yön verme isteğidir. İkincisi topluluk içinde rahat olmak, söz almak ve ilgi odağı olmaktan çekinmemektir. Üçüncüsü hazırlıklı olmak, planları uygulamak ve üstlenilen işi sonuna götürmektir. Kamu malı olan Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ölçeğine dayanır; 28 kısa cümleden oluşur ve yaklaşık 5 dakika sürer. Rapor, üç eğilimin birlikte ne anlatabileceğini ve gündelik hayatta denenebilecek küçük adımları da anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Test liderlik becerisini ya da iyi bir lider olup olmadığını ölçmez; kişinin kendini nasıl tanımladığını gösterir. Tanı koymaz.',
  intro: {
    title: 'Gruplarda ve üstlendiğin işlerde nasılsın?',
    paragraphs: [
      'Birazdan seni anlatan 28 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Cümleler bir grupta yön vermekle, insanlar arasında konuşmakla ve üstlendiğin işleri yürütmekle ilgili. Belirli bir günü değil, çoğu zaman nasıl davrandığını düşünerek cevap ver.',
      'Doğru ya da yanlış cevap yok; yüksek puan iyi, düşük puan kötü demek değildir. En faydalı sonuç, olmak istediğin hâli değil, gerçekte nasıl olduğunu anlattığında çıkar. Yaklaşık 5 dakika sürer.',
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
    ['yon01', 'yon05'],
    ['ces02', 'ces09'],
    ['ces01', 'ces06'],
    ['kar04', 'kar07'],
  ],
  scales: [
    {
      key: YON,
      name: 'Öne çıkıp yön verme',
      plain:
        'Bir grupta idareyi ele alma, işlerin başında olmak isteme, başkalarına liderlik etmeye çalışma ve başkalarını bir şey yapmaya ikna edebilme; yolu başkalarının göstermesini beklememe ve kararları başkalarına bırakmama.',
      poles: { low: 'Yönü başkalarına bırakan', high: 'Öne çıkıp yön veren' },
      alpha: 0.81,
    },
    {
      key: CES,
      name: 'Sosyal cesaret',
      plain:
        'İnsanlar arasında rahat olma: hazırlıksız konuşabilme, ilgi odağı olmaktan ve topluluk önünde konuşmaktan çekinmeme, başkalarının yanına gidip konuşabilme ve söyleyecek bir şeyi olma; liderlik yeteneği ve güçlü bir kişiliği olduğunu düşünme.',
      poles: { low: 'Geri planda kalmayı seven', high: 'Topluluk önünde rahat' },
      alpha: 0.86,
    },
    {
      key: KAR,
      name: 'Kararlılık ve sorumluluk',
      plain:
        'Hazırlıklı olma, yaptığı planları uygulama, işe hemen koyulma, işleri sorunsuz halletme ve dikkatini toplayabilme; sorumluluklardan kaçmama, işleri sonuna kadar götürme, son ana bırakmama ve karar verebilme.',
      poles: { low: 'İşleri sürdürmekte zorlanan', high: 'Üstlendiğini sonuna götüren' },
      alpha: 0.81,
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) üç ölçeği. Birincisi Hogan Kişilik Envanteri’ne (HPI) benzeyen IPIP ölçeklerinden liderliktir (Leadership). İkincisi IPIP-HEXACO ölçeklerinden sosyal cesarettir (Social Boldness; Ashton, Lee ve Goldberg, 2007). Üçüncüsü AB5C ölçeklerinden amaçlı ve kararlı davranmadır (Purposefulness). Bu testte bunlar sırasıyla “Öne çıkıp yön verme”, “Sosyal cesaret” ve “Kararlılık ve sorumluluk” adıyla kullanılır. Maddeler IPIP’indir (Goldberg ve ark., 2006). Üç ölçeğin bütün maddeleri sorulur: 28 madde; ölçekler arasında ortak madde yoktur. Öne çıkıp yön vermenin ve kararlılık ve sorumluluğun maddeleri IPIP sitesinin bir arşiv kopyasından alındı ve IPIP’in öteki resmî sayfalarıyla karşılaştırıldı.',
    whatItMeasures:
      'Bu test liderlik becerisini, liderlik potansiyelini ya da iyi bir lider olup olmadığını ölçmez. Araştırmalarda liderlikle ilişkili bulunan üç kişilik eğilimini kişinin kendi gözünden gösterir. Bunlar bir grupta idareyi ele alıp yön verme isteği, topluluk içinde rahat olma ve üstlenilen işi sonuna götürmedir. Üç eğilim ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.\n\n60 çalışmayı birleştiren bir incelemede liderlikle en tutarlı ilişkili kişilik özelliği dışadönüklük bulunmuştur (.31). Sorumluluk (.28), deneyime açıklık (.24) ve duygusal denge (.24) de liderlikle ilişkilidir (Judge ve ark., 2002). Bir grupta lider olarak görülmede dışadönüklüğün ve sorumluluğun ilişkisi .33’tür. Beş kişilik boyutunun liderlikle birlikte ilişkisi .48’dir. Yani kişilik önemlidir, ama kimin lider olacağını tek başına belirlemez.\n\nDışadönüklüğün liderlikle ilişkili yanı, insanlarla vakit geçirmeyi sevmekten çok öne çıkıp yön vermektir (Do ve Minbashian, 2014). Ama öne çıkmanın fazlası da her zaman iyi sonuç vermez. İş arkadaşlarının ve çalışanların değerlendirmelerine dayanan iki çalışmada orta düzeyde atılgan olanlar daha iyi lider olarak görülmüştür (Ames ve Flynn, 2007). Çok az ya da çok fazla atılgan olanlar daha düşük değerlendirilmiştir. Korkutarak etki kurmak ile bilgisini paylaşarak saygı kazanmak farklı yollardır. Bir çalışmada ikisi de etki kazandırmış; ama bilgisini paylaşanlar sevilmiş, korkutanlar pek sevilmemiştir (Cheng ve ark., 2013). Küçük gruplarda çok konuşan kişinin lider olarak görülme olasılığı daha yüksektir (MacLaren ve ark., 2020). Çok konuşmak ise iyi liderlik demek değildir.\n\nSessiz davranmak da bazı durumlarda işe yarayabilir. Bir çalışmada ekip üyeleri girişkenken, sakin davranan liderlerin ekipleri daha iyi sonuç almıştır (Grant, Gino ve Hofmann, 2011). Ekip üyeleri edilgen olduğunda ise sonuç tersine dönmüştür. Liderlik yalnızca başkanlık ya da kaptanlık da değildir. Spor takımlarıyla yapılan bir çalışmada katılımcıların %44’ü, incelenen dört liderlik rolünün hiçbirinde kaptanı baş lider olarak görmemiştir (Fransen ve ark., 2014). Liderliğin birkaç kişi arasında paylaşılması, takımların etkililiğiyle ilişkilidir (Wang, Waldman ve Zhang, 2014).\n\nİkiz çalışmalarında, liderlik görevlerinde bulunmadaki farkların yaklaşık %24 ile %30’u genlerle ilişkilendirilmiştir; büyük bölümü genlerle açıklanmamıştır (Arvey ve ark., 2006; De Neve ve ark., 2013). Yetişkinlerle yapılan liderlik eğitimleri öğrenmeyi ve işteki davranışı ortalamada belirgin biçimde artırmıştır. Uygulama ve geri bildirim içeren eğitimler daha etkili bulunmuştur (Lacerenza ve ark., 2017). Gençlere yönelik liderlik programlarının kanıtı ise henüz sınırlıdır; bu çalışmaların çoğunda karşılaştırma grubu yoktur (Karagianni ve Montgomery, 2018).',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki testlerde birebir aynı olan 25 maddenin çevirisi korundu; sosyal cesaretin on maddesi Altı Boyutlu Kişilik Profili’ndekiyle aynıdır. Kalan 3 madde iki ayrı taslakla çevrilip karşılaştırıldı. Bu IPIP ölçeklerinin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Türkiye’de gençler için geliştirilmiş liderlik ölçekleri vardır; örneğin Gençlik Liderlik Özellikleri Ölçeği, İstanbul’da 14–17 yaş arasındaki 1.123 öğrenciyle geliştirilmiştir (Cansoy ve Turan, 2016). Bu testin maddeleri o ölçeğin maddeleri değildir ve o çalışmanın sonuçları bu test için norm sayılmaz. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP’in sayfalarında iç tutarlılık (Cronbach α) şöyle bildirilir. Liderlik (bu testte öne çıkıp yön verme) .81, sosyal cesaret .86’dır. Amaçlı ve kararlı davranma (bu testte kararlılık ve sorumluluk) da .81’dir. Öne çıkıp yön verme ile kararlılık ve sorumluluğun değerleri ABD’de 501 yetişkinle hesaplanmıştır. Sosyal cesaretin değerleri aynı örneklemden 411 yetişkinle hesaplanmıştır (Ashton, Lee ve Goldberg, 2007). IPIP ölçekleri asıl envanterlerdeki karşılıklarıyla da karşılaştırılmıştır. Öne çıkıp yön verme, Hogan Kişilik Envanteri’nin liderlik alt bileşeniyle .66 (ölçüm hatası düzeltilince .79) ilişkilidir. Sosyal cesaret, HEXACO Kişilik Envanteri’nin sosyal cesaret ölçeğiyle .83 (düzeltilince .97) ilişkilidir. Kararlılık ve sorumluluğun karşılaştırılacağı asıl bir envanter yoktur. Öne çıkıp yön vermenin ve kararlılık ve sorumluluğun anahtarları ile tablolar IPIP sitesinin bir arşiv kopyasından alındı. Öne çıkıp yön vermenin altı maddesi ile kararlılık ve sorumluluğun beş maddesi IPIP’in öteki resmî sayfalarında da yer alır. Açık veriye bu çalışmada ulaşılamadığı için standart sapmalar hesaplanamadı; raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, başkalarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak ölçeklerin değerleri yetişkinlerle hesaplanmıştır; aynı maddelerle ergenlerde yapılmış bir güvenirlik ya da geçerlik çalışmasına ulaşılamadı.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Kişinin bir grupta gerçekte nasıl davrandığını ya da başkalarınca nasıl görüldüğünü ölçmez.',
      'Test liderlik becerisini ölçmez; kişinin ileride yönetici olup olmayacağını ya da iş hayatında ne kadar başarılı olacağını öngörmez. Bir meslek önerisi değildir; meslek için ilgi testlerine bakılabilir.',
      'Sosyal cesaretin bir cümlesi (“Liderlik yeteneğim var.”) kişinin kendi liderlik yeteneği hakkındaki görüşünü sorar. Bu cümle de yeteneği ölçmez; kişinin kendini nasıl gördüğünü gösterir.',
      'Yüksek puan her zaman daha iyi demek değildir: atılganlığın fazlası da bir grupta ilişkileri yıpratabilir (Ames ve Flynn, 2007). Düşük puan da liderlik yapılamayacağı anlamına gelmez.',
      'Öne çıkıp yön vermenin altı cümlesinden dördü düz, ikisi ters yöndedir; sosyal cesarette beşi düz, beşi ters; kararlılık ve sorumlulukta beşi düz, yedisi ters yöndedir. Cümlelerin çoğuna “doğru” deme eğilimi öne çıkıp yön verme puanını biraz yükseltip kararlılık ve sorumluluk puanını biraz düşürebilir. Testte birbirinin tersini söyleyen dört cümle çifti vardır: biri öne çıkıp yön vermede, ikisi sosyal cesarette, biri kararlılık ve sorumluluktadır. En az iki çiftte iki cümleye de “Oldukça doğru” ya da “Tamamen doğru” denirse raporda bir uyarı gösterilir. Aynı uyarı, en az iki çiftte iki cümleye de “Hiç doğru değil” ya da “Pek doğru değil” denirse de gösterilir.',
      'Sosyal cesaretin bazı cümleleri (topluluk önünde konuşma, hazırlıksız konuşma gibi) kişinin bu tür durumlarla ne kadar karşılaştığına da bağlıdır. Böyle durumlarla pek karşılaşmamış biri bu cümlelere tahmine dayalı bir cevap verebilir.',
      'İkna etme, insanları bir araya getirme ve ekip çalışması gibi liderliğin öteki yanları bu testte ayrı ayrı ölçülmez; IPIP’te bunlar için uygun bir ölçek bulunamadı.',
      '28 cümlenin 25’i sitedeki öteki testlerde de sorulur; bir cümle birden çok testte olabilir. Bu cümlelerin onu Altı Boyutlu Kişilik Profili’nde, dokuzu 16 Faktörlü Kişilik Profili’nde, sekizi Ayrıntılı Kişilik Profili’nde vardır. Bunların yedisi Beş Faktör Kişilik Profili’nde, yedisi Kişiliğin 10 Yönü’nde, altısı Öz-yeterlik: Kendine Güven’de de sorulur. Ayrıca üçü Öğrenme ve Başarı Özellikleri’nde, üçü Öz-denetim’de sorulur; ikişer cümle de Hızlı Kişilik Testi ve Kişilerarası Tarz’dadır. Sosyal cesaretin on cümlesinin hepsi Altı Boyutlu Kişilik Profili’nin “Sosyal cesaret” alt özelliğidir; o testi çözen biri burada aynı cümleleri görür ve iki sonuç çok benzer çıkar. Öne çıkıp yön vermenin dört cümlesi 16 Faktörlü Kişilik Profili’nin “Atılganlık” özelliğinde, üçü Ayrıntılı Kişilik Profili’nin “Liderlik” özelliğinde de vardır. Bu yüzden sonuçlar birbirine benzeyebilir.',
      'Tanı koymaz ve uzman değerlendirmesinin yerini tutmaz.',
      'Ergenlerde güvenirliğini ve geçerliğini inceleyen bir çalışmaya ulaşılamadığı için lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır. Ölçüm payı hesaplanamadığı için sınıra yakın puanlar komşu düzeye de yakın sayılmalıdır.',
    ],
    citations: [
      { text: 'IPIP. HPI’ye benzeyen IPIP ölçeklerinin anahtarları (liderlik: Leadership).', url: 'https://ipip.ori.org/newHPIKeys.htm' },
      { text: 'IPIP. HPI ölçeklerinin özet tablosu (güvenirlik ve HPI ile ilişki).', url: 'https://ipip.ori.org/newHPITable.htm' },
      { text: 'IPIP. IPIP-HEXACO ölçeklerinin anahtarı (sosyal cesaret: Social Boldness).', url: 'https://ipip.ori.org/newHEXACO_PI_key.htm' },
      { text: 'IPIP. IPIP-HEXACO ölçeklerinin özet tablosu (güvenirlik ve HEXACO-PI ile ilişki).', url: 'https://ipip.ori.org/newHEXACO_PI_table.htm' },
      { text: 'IPIP. AB5C ölçeklerinin anahtarı (amaçlı ve kararlı davranma: Purposefulness).', url: 'https://ipip.ori.org/newAB5CKey.htm' },
      { text: 'IPIP. AB5C ölçeklerinin özet tablosu (güvenirlik).', url: 'https://ipip.ori.org/newAB5CTable.htm' },
      {
        text: 'IPIP sitesinin arşiv kopyası: HPI’ye benzeyen ölçeklerin anahtarı (AB5C anahtarı ve tablolar aynı klasörde).',
        url: 'https://ipip-remaster.vercel.app/archive/ipip-mirror/ipip.ori.org/newHPIKeys.htm',
      },
      {
        text: 'Ashton, M. C., Lee, K. ve Goldberg, L. R. (2007). The IPIP–HEXACO scales: An alternative, public-domain measure of the personality constructs in the HEXACO model. Personality and Individual Differences, 42(8), 1515–1526.',
        url: 'https://doi.org/10.1016/j.paid.2006.10.027',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Judge, T. A., Bono, J. E., Ilies, R. ve Gerhardt, M. W. (2002). Personality and leadership: A qualitative and quantitative review. Journal of Applied Psychology, 87(4), 765–780.',
        url: 'https://doi.org/10.1037/0021-9010.87.4.765',
      },
      {
        text: 'Do, M. H. ve Minbashian, A. (2014). A meta-analytic examination of the effects of the agentic and affiliative aspects of extraversion on leadership outcomes. The Leadership Quarterly, 25(5), 1040–1053.',
        url: 'https://doi.org/10.1016/j.leaqua.2014.04.004',
      },
      {
        text: 'Ames, D. R. ve Flynn, F. J. (2007). What breaks a leader: The curvilinear relation between assertiveness and leadership. Journal of Personality and Social Psychology, 92(2), 307–324.',
        url: 'https://doi.org/10.1037/0022-3514.92.2.307',
      },
      {
        text: 'Cheng, J. T., Tracy, J. L., Foulsham, T., Kingstone, A. ve Henrich, J. (2013). Two ways to the top: Evidence that dominance and prestige are distinct yet viable avenues to social rank and influence. Journal of Personality and Social Psychology, 104(1), 103–125.',
        url: 'https://doi.org/10.1037/a0030398',
      },
      {
        text: 'MacLaren, N. G., Yammarino, F. J., Dionne, S. D., Sayama, H., Mumford, M. D., Connelly, S., Martin, R. W., Mulhearn, T. J., Todd, E. M., Kulkarni, A., Cao, Y. ve Ruark, G. A. (2020). Testing the babble hypothesis: Speaking time predicts leader emergence in small groups. The Leadership Quarterly, 31(5), 101409.',
        url: 'https://doi.org/10.1016/j.leaqua.2020.101409',
      },
      {
        text: 'Grant, A. M., Gino, F. ve Hofmann, D. A. (2011). Reversing the extraverted leadership advantage: The role of employee proactivity. Academy of Management Journal, 54(3), 528–550.',
        url: 'https://doi.org/10.5465/amj.2011.61968043',
      },
      {
        text: 'Fransen, K., Vanbeselaere, N., De Cuyper, B., Vande Broek, G. ve Boen, F. (2014). The myth of the team captain as principal leader: Extending the athlete leadership classification within sport teams. Journal of Sports Sciences, 32(14), 1389–1397.',
        url: 'https://doi.org/10.1080/02640414.2014.891291',
      },
      {
        text: 'Wang, D., Waldman, D. A. ve Zhang, Z. (2014). A meta-analysis of shared leadership and team effectiveness. Journal of Applied Psychology, 99(2), 181–198.',
        url: 'https://doi.org/10.1037/a0034531',
      },
      {
        text: 'Arvey, R. D., Rotundo, M., Johnson, W., Zhang, Z. ve McGue, M. (2006). The determinants of leadership role occupancy: Genetic and personality factors. The Leadership Quarterly, 17(1), 1–20.',
        url: 'https://doi.org/10.1016/j.leaqua.2005.10.009',
      },
      {
        text: 'De Neve, J.-E., Mikhaylov, S., Dawes, C. T., Christakis, N. A. ve Fowler, J. H. (2013). Born to lead? A twin design and genetic association study of leadership role occupancy. The Leadership Quarterly, 24(1), 45–60.',
        url: 'https://doi.org/10.1016/j.leaqua.2012.08.001',
      },
      {
        text: 'Lacerenza, C. N., Reyes, D. L., Marlow, S. L., Joseph, D. L. ve Salas, E. (2017). Leadership training design, delivery, and implementation: A meta-analysis. Journal of Applied Psychology, 102(12), 1686–1718.',
        url: 'https://doi.org/10.1037/apl0000241',
      },
      {
        text: 'Karagianni, D. ve Montgomery, A. J. (2018). Developing leadership skills among adolescents and young adults: A review of leadership programmes. International Journal of Adolescence and Youth, 23(1), 86–98.',
        url: 'https://doi.org/10.1080/02673843.2017.1292928',
      },
      {
        text: 'Cansoy, R. ve Turan, S. (2016). Gençlik Liderlik Özellikleri Ölçeği: Güvenirlik ve geçerlik çalışması. Türkiye Eğitim Dergisi, 1(1), 19–39.',
        url: 'https://dergipark.org.tr/download/article-file/315587',
      },
    ],
  },
};
