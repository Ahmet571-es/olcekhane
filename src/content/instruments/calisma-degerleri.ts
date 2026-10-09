import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Çalışma Değerleri: Bir İşte Neye Önem Veriyorsun?
 * Özgün ölçek (Ölçekhane, 2026). İfadeler sıfırdan yazılmıştır; Super'in Çalışma Değerleri Envanteri'nin, O*NET İş
 * Önemi Profili'nin ya da başka bir ölçeğin maddelerinin çevirisi değildir. Sekiz değer, her biri dört ifadeyle:
 *  - İlgi ve öğrenme, Kazanç, Güvence, Saygınlık ve ilerleme, Birlikte çalışma: çalışma değerlerinin dört temel türü
 *    (iç, dış, statü ve sosyal; Busque-Carrier, Ratelle ve Le Corff, 2022). Dış değerler kazanç ve güvence olarak ayrı
 *    ölçülür; ikisi gençlerin iş seçiminde ayrı ayrı öne çıkabilir.
 *  - Bağımsızlık (Lechner ve ark., 2017), Başkalarına yardım ve Yaşam dengesi (Twenge ve ark., 2010'daki özgecil ve boş
 *    zaman değerleri).
 * İfadeler Super'in envanteri, O*NET ifadeleri, Minnesota Önem Anketi ve Twenge ve ark.'nın (2010) kullandığı Monitoring
 * the Future ifadeleriyle bağımsız ajan tarafından karşılaştırıldı; yakın bulunan dört ifade (E3, Y3, S4, K3) yeniden yazıldı.
 * Ters yönlü ifade yoktur (önem derecelendirmesinde ters ifade yapaydır). Çoğu kişi birçok değeri önemli bulduğu için
 * (Lechner ve ark., 2017: iç değerler ölçeğin en üstüne yakın) rapor değerleri kişinin kendi içinde sıralar (profil:
 * values); ikisi de en önemliler arasında olan ve birbirine ters yönde çekebilen değerleri ayrıca anlatır (Schwartz, 2012).
 * İfadeler okula özgü değildir; yetişkinlere de açıktır. Durum: pilot.
 */

const L = 'learning';
const K = 'income';
const Y = 'helping';
const B = 'independence';
const G = 'security';
const E = 'team';
const S = 'status';
const D = 'balance';

/** Uygulama sırası: değerler sırayla döner. */
const RAW: { key: string; scale: string; text: string }[] = [
  { key: 'L1', scale: L, text: 'Yaptığım işi ilginç bulmak' },
  { key: 'K1', scale: K, text: 'İyi para kazanmak' },
  { key: 'Y1', scale: Y, text: 'Yaptığım işle insanların hayatını kolaylaştırmak' },
  { key: 'B1', scale: B, text: 'İşimi nasıl yapacağıma kendim karar vermek' },
  { key: 'G1', scale: G, text: 'İşimi kaybetme kaygısı taşımamak' },
  { key: 'E1', scale: E, text: 'Çalışma arkadaşlarımla sıcak ilişkiler kurmak' },
  { key: 'S1', scale: S, text: 'Yaptığım işin insanlar arasında saygı görmesi' },
  { key: 'D1', scale: D, text: 'İş dışında sevdiklerime zaman ayırabilmek' },

  { key: 'L2', scale: L, text: 'Çalışırken sürekli yeni şeyler öğrenmek' },
  { key: 'K2', scale: K, text: 'Harcadığım emeğe değecek bir ücret almak' },
  { key: 'Y2', scale: Y, text: 'İhtiyacı olan insanlara destek olmak' },
  { key: 'B2', scale: B, text: 'Birinin sürekli başımda durmaması' },
  { key: 'G2', scale: G, text: 'Gelirimin her ay aksamadan, düzenli gelmesi' },
  { key: 'E2', scale: E, text: 'Tek başıma değil, bir ekiple birlikte çalışmak' },
  { key: 'S2', scale: S, text: 'Başardıklarımın başkalarınca görülüp takdir edilmesi' },
  { key: 'D2', scale: D, text: 'Akşamları ve hafta sonları iş düşünmek zorunda kalmamak' },

  { key: 'L3', scale: L, text: 'Tekdüze değil, çeşitli işlerle uğraşmak' },
  { key: 'K3', scale: K, text: 'Kazancımla rahat bir hayat kurabilmek' },
  { key: 'Y3', scale: Y, text: 'Yaptığım işin toplumun bir ihtiyacını karşılaması' },
  { key: 'B3', scale: B, text: 'Her adımda birinin onayını beklemeden çalışabilmek' },
  { key: 'G3', scale: G, text: 'Uzun yıllar aynı işte güvenle çalışabilmek' },
  { key: 'E3', scale: E, text: 'İş arkadaşlarımla iş dışında da görüşecek kadar yakın olmak' },
  { key: 'S3', scale: S, text: 'Zamanla daha üst görevlere yükselmek' },
  { key: 'D3', scale: D, text: 'Hobilerime yetecek kadar boş zamanımın olması' },

  { key: 'L4', scale: L, text: 'Merak ettiğim konular üzerinde çalışabilmek' },
  { key: 'K4', scale: K, text: 'Zamanla gelirimin artması' },
  { key: 'Y4', scale: Y, text: 'Yaptığım işin başkalarına yararını görebilmek' },
  { key: 'B4', scale: B, text: 'İşlerimi hangi sırayla yapacağımı kendim belirlemek' },
  { key: 'G4', scale: G, text: 'Geleceğimi güvenle planlayabileceğim bir işte çalışmak' },
  { key: 'E4', scale: E, text: 'Çalıştığım yerde kendimi bir topluluğun parçası gibi hissetmek' },
  { key: 'S4', scale: S, text: 'Yaptığım işle tanınan biri olmak' },
  { key: 'D4', scale: D, text: 'Çok uzun saatler çalışmak zorunda kalmamak' },
];

export const calismaDegerleri: LikertInstrument = {
  slug: 'calisma-degerleri',
  version: 1,
  engine: 'likert',
  name: 'Çalışma Değerleri: Bir İşte Neye Önem Veriyorsun?',
  shortName: 'Çalışma Değerleri',
  domain: 'career',
  profile: 'values',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 7,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 6,
  sortOrder: 33,
  tagline: 'Bir işte senin için en önemli olan ne: kazanç mı, güvence mi, öğrenme mi, insanlara yardım mı? Sekiz değeri sıralar.',
  description:
    'Bu test bir işte neyin ne kadar önemli olduğunu sekiz değerle inceler: ilgi ve öğrenme, kazanç, güvence, saygınlık ve ilerleme, başkalarına yardım, birlikte çalışma, bağımsızlık ve yaşam dengesi. Çoğu kişi birçok şeyi önemli bulduğu için rapor değerleri kişinin kendi içinde sıralar: en önem verilen değerleri anlatır, ikisi de en önemliler arasında olup birbirine ters yönde çekebilen değerleri gösterir ve daha az önem verilenleri belirtir. Değerlerin doğrusu ya da yanlışı yoktur; test meslek seçmez, meslekleri tanırken neye bakılabileceğini gösterir. İfadeler sıfırdan yazılmıştır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Bir işte neye önem veriyorsun?',
    paragraphs: [
      'Birazdan bir işte önemli olabilecek 32 şey göreceksin. Her birinin bir işte senin için ne kadar önemli olduğunu seç.',
      'Doğru ya da yanlış cevap yok. Hepsi önemli gelebilir; ama asıl yol gösteren, hangilerinin senin için daha önemli olduğudur. Bu yüzden her birini ötekilerle karşılaştırarak düşün.',
    ],
  },
  prompt: 'Bir işte bu senin için ne kadar önemli?',
  options: [
    { value: 1, label: 'Hiç önemli değil' },
    { value: 2, label: 'Az önemli' },
    { value: 3, label: 'Orta derecede önemli' },
    { value: 4, label: 'Çok önemli' },
    { value: 5, label: 'Son derece önemli' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.75 },
  // Bir ondalıklı ortalamaya göre: 1,0–2,4 az önemli, 2,5–3,4 orta derecede önemli, 3,5–5,0 çok önemli.
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'low', min: 1 },
      { band: 'average', min: 2.5 },
      { band: 'high', min: 3.5 },
    ],
  },
  scales: [
    {
      key: L,
      name: 'İlgi ve öğrenme',
      plain: 'İşin ilginç ve çeşitli olması, yeni şeyler öğretmesi ve merak edilen konular üzerinde çalışma fırsatı vermesi.',
    },
    {
      key: K,
      name: 'Kazanç',
      plain: 'İyi para kazanmak, emeğin karşılığını almak, rahat bir hayat kurabilmek ve gelirin zamanla artması.',
    },
    {
      key: Y,
      name: 'Başkalarına yardım',
      plain: 'Yapılan işle insanların hayatını kolaylaştırmak, ihtiyacı olanlara destek olmak ve toplumun bir ihtiyacını karşılamak.',
    },
    {
      key: B,
      name: 'Bağımsızlık',
      plain: 'İşin nasıl yapılacağına kendi başına karar vermek, her adımda onay beklememek ve sürekli denetlenmemek.',
    },
    {
      key: G,
      name: 'Güvence',
      plain: 'İşini kaybetme kaygısı taşımamak, düzenli bir gelirinin olması ve geleceğini güvenle planlayabilmek.',
    },
    {
      key: E,
      name: 'Birlikte çalışma',
      plain: 'Bir ekiple çalışmak, iş arkadaşlarıyla sıcak ve yakın ilişkiler kurmak ve kendini bir topluluğun parçası gibi hissetmek.',
    },
    {
      key: S,
      name: 'Saygınlık ve ilerleme',
      plain: 'Yapılan işin saygı görmesi, başarıların takdir edilmesi, daha üst görevlere yükselmek ve yaptığı işle tanınmak.',
    },
    {
      key: D,
      name: 'Yaşam dengesi',
      plain: 'İş dışında sevdiklerine, hobilerine ve dinlenmeye zaman kalması; çok uzun saatler çalışmak zorunda kalmamak.',
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). İfadeler sıfırdan yazılmıştır; başka bir ölçeğin maddeleri kullanılmamıştır. Dayanakları: çalışma değerlerinin dört temel türü (işin kendisinden gelen iç değerler, kazanç ve güvence gibi dış değerler, insan ilişkileriyle ilgili sosyal değerler ve kişisel başarı, saygınlık ve yönetme isteğiyle ilgili statü değerleri; Busque-Carrier, Ratelle ve Le Corff, 2022), bağımsızlık değeri (Lechner ve ark., 2017), başkalarına yardım ve boş zaman değerleri (Twenge ve ark., 2010) ve değerlerin birbirleriyle uyumu ve çatışması (Schwartz, 2012).',
    whatItMeasures:
      'Bir işte neyin ne kadar önemli olduğunu sekiz değerle ölçer: ilgi ve öğrenme, kazanç, güvence, saygınlık ve ilerleme, başkalarına yardım, birlikte çalışma, bağımsızlık ve yaşam dengesi. Çalışma değerleri, işleri ve çalışma ortamlarını değerlendirirken kullanılan ölçütlerdir (Busque-Carrier, Ratelle ve Le Corff, 2022). Çoğu kişi birçok değeri önemli bulduğu için rapor değerleri kişinin kendi içinde sıralar ve en önemlilerini anlatır. Değer kuramına göre değerler birbirleriyle yarışabilir: birini öne çıkaran bir seçim, karşı yöndeki bir değerden biraz vazgeçmeyi gerektirebilir (ör. güvence ile bağımsızlık; Schwartz, 2012); rapor, ikisi de en önemliler arasında olan böyle çiftleri ayrıca belirtir. Kişinin değerleriyle çalıştığı kurum arasındaki uyum, araştırmalarda daha yüksek iş doyumu ve kuruma bağlılıkla ilişkili bulunmuştur (Kristof-Brown, Zimmerman ve Johnson, 2005). Bu bir yetenek ya da ilgi testi değildir; meslek seçmez.',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Her değer dört ifadeyle ölçülür; ters yönlü ifade yoktur. Bütün ifadelere aynı cevap verilirse ya da değerler arasındaki farklar küçükse raporda bu ayrıca belirtilir.',
    reliability: 'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok. Puanlar, ifadelere verilen önem derecesine göre (1: hiç önemli değil, 5: son derece önemli) yorumlanır ve değerler kişinin kendi içinde sıralanır; kişi başkalarıyla karşılaştırılmaz.',
    ageNote:
      '7. sınıftan itibaren; mezunlar ve yetişkinler de çözebilir. İfadeler okula özgü değildir. 20–21 yaşından 25–26 yaşına kadar gençleri dört yıl izleyen bir araştırmada çalışma değerlerinin büyük ölçüde korunduğu görülmüştür (Lechner ve ark., 2017); yine de sonuç bugünkü öncelikleri gösterir ve deneyimle değişebilir.',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Kişinin kendi bildirimine dayanır ve insanlar birçok değeri önemli bulma eğilimindedir; bu yüzden rapor değerleri kişinin kendi içinde sıralar. Puanlar tek başına değil, sıralamayla birlikte yorumlanmalıdır.',
      'Değerler bir meslek seçmez: aynı değer farklı mesleklerde, aynı meslekte de farklı iş yerlerinde karşılanabilir. Meslek için ilgi testleriyle birlikte değerlendirilmelidir.',
      'Toplumda takdir gören bazı değerler (ör. başkalarına yardım) olduğundan daha önemli işaretlenebilir; sıralama yorumlanırken bu akılda tutulmalıdır.',
      'Değerlerle iş arasındaki uyumun iş doyumuyla ilişkisi araştırmalarda ilişkiseldir; bu uyumun tek başına doyumu sağladığı söylenemez.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Busque-Carrier, M., Ratelle, C. F. ve Le Corff, Y. (2022). Work values and job satisfaction: The mediating role of basic psychological needs at work. Journal of Career Development, 49(6), 1386–1401.',
        url: 'https://doi.org/10.1177/08948453211043878',
      },
      {
        text: 'Kristof-Brown, A. L., Zimmerman, R. D. ve Johnson, E. C. (2005). Consequences of individuals’ fit at work: A meta-analysis of person–job, person–organization, person–group, and person–supervisor fit. Personnel Psychology, 58(2), 281–342.',
        url: 'https://doi.org/10.1111/j.1744-6570.2005.00672.x',
      },
      {
        text: 'Lechner, C. M., Sortheix, F. M., Göllner, R. ve Salmela-Aro, K. (2017). The development of work values during the transition to adulthood: A two-country study. Journal of Vocational Behavior, 99, 52–65.',
        url: 'https://doi.org/10.1016/j.jvb.2016.12.004',
      },
      {
        text: 'Schwartz, S. H. (2012). An overview of the Schwartz theory of basic values. Online Readings in Psychology and Culture, 2(1).',
        url: 'https://doi.org/10.9707/2307-0919.1116',
      },
      {
        text: 'Twenge, J. M., Campbell, S. M., Hoffman, B. J. ve Lance, C. E. (2010). Generational differences in work values: Leisure and extrinsic values increasing, social and intrinsic values decreasing. Journal of Management, 36(5), 1117–1142.',
        url: 'https://doi.org/10.1177/0149206309352246',
      },
    ],
  },
};
