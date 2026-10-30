import type { SymbolSearchTask, SymbolSearchTrial, TaskInstrument } from '@/lib/instruments/types';

/**
 * İşlem Hızı: Simge Bulma (görsel eşleştirme düzeni; işlem hızı). Her denemede üstte iki aranan simge, altında dört simgelik bir
 * sıra gösterilir; aranan simgelerden biri sırada tıpatıp aynısıyla varsa "Var", yoksa "Yok" denir. Altı denemelik geri
 * bildirimli alıştırmadan sonra iki dakika boyunca yapılabildiği kadar karar verilir. Wechsler testlerindeki "Symbol Search"
 * (Türkçe WÇZÖ-IV'te "Simge Arama") alt testinin düzenine benzer, ama o alt test ya da onun bir sürümü değildir: simgeler,
 * deneme üretim kuralı, puanlama ve rapor Ölçekhane'nindir; o testin malzemeleri, kuralları ve normları kullanılmaz.
 *
 * Simgeler 3 × 3 nokta ızgarasında dört çizgidir: her çizgi iki komşu nokta arasındadır (yatay, dikey ya da çapraz; "x1y1-x2y2",
 * 0–2, y aşağı doğru). Simgeler bir üreticiyle seçildi (scratchpad'de, depoda değil); tests/simge-bulma.test.ts kuralları
 * bağımsız bir denetleyiciyle (tests/helpers/symbol-search-check.ts) yeniden denetler:
 *  - her simge dört ayrı birim çizgidir, çizgiler birbirine bağlıdır ve simge ızgaranın bütününe yayılır (en solda, en sağda,
 *    en üstte ve en altta çizgisi vardır): simgeler aynı büyüklükte görünür;
 *  - havuzdaki iki simge en çok bir çizgiyi paylaşır ve hiçbiri ötekinin döndürülmüş ya da aynadaki görüntüsü değildir (aynı
 *    biçimin farklı yönlerini ayırt etmek bu görevin konusu değildir);
 *  - her simgenin iki ya da üç benzeri vardır: simgenin bir çizgisi, bir ucunun çevresinde döndürülmüştür (bir çizgi çıkar,
 *    çıkan çizgiyle bir ucu ortak yeni bir çizgi gelir). Benzer de bağlıdır ve ızgaranın bütününe yayılır; hiçbir havuz
 *    simgesinin (kendi simgesi dahil) döndürülmüş ya da aynadaki görüntüsü değildir; öteki havuz simgeleriyle en çok iki
 *    çizgi paylaşır (yalnızca kendi simgesine benzer);
 *  - simgeler ve benzerler gözle de gözden geçirildi: harfe, rakama, oka ya da bilinen bir işarete benzeyenler (ör. Γ, K, N,
 *    Z, «, √, ↗) alınmadı. Bir simgenin aynı biçimde birden çok yönü olabileceği için bu ayıklama yargıya dayanır.
 * Denemeler her uygulamada uygulama kimliğinden yeniden üretilir (lib/instruments/symbol-search.ts): sekizli bloklarda dört
 * deneme türünün (aranan simge sırada var ya da yok × sırada benzer simge var ya da yok) her birinden iki deneme vardır.
 * Simgeler ya da üretim kuralı değişirse `generator` ve testin sürüm numarası artırılmalıdır.
 */

/** Simge havuzu (14 simge). */
const GLYPHS: string[][] = [
  ['00-01', '00-10', '01-12', '10-20'],
  ['01-02', '01-11', '02-12', '11-20'],
  ['01-10', '10-20', '11-20', '11-22'],
  ['02-11', '10-11', '11-22', '12-22'],
  ['00-10', '00-11', '11-21', '21-22'],
  ['02-12', '12-21', '12-22', '20-21'],
  ['01-10', '10-21', '20-21', '21-22'],
  ['01-02', '01-10', '01-12', '12-21'],
  ['00-10', '10-11', '10-21', '12-21'],
  ['00-01', '01-11', '11-12', '11-22'],
  ['02-12', '10-21', '11-12', '11-21'],
  ['01-11', '02-11', '11-21', '20-21'],
  ['00-11', '02-11', '11-12', '12-21'],
  ['01-12', '10-11', '11-12', '11-20'],
];

/** Her simgenin benzerleri (bir çizgisi farklı), GLYPHS ile aynı sırada. */
const LOOKALIKES: string[][][] = [
  [['00-01', '01-10', '01-12', '10-20'], ['00-01', '00-10', '01-12', '10-21']],
  [['01-02', '01-11', '02-11', '11-20'], ['01-02', '01-11', '11-12', '11-20']],
  [['00-10', '10-20', '11-20', '11-22'], ['01-10', '01-11', '10-20', '11-22'], ['01-10', '10-11', '10-20', '11-22']],
  [['00-11', '10-11', '11-22', '12-22'], ['00-11', '02-11', '11-22', '12-22'], ['02-11', '10-11', '11-22', '21-22']],
  [['00-11', '10-21', '11-21', '21-22'], ['00-10', '00-11', '10-21', '21-22'], ['00-10', '00-11', '11-21', '11-22']],
  [['01-12', '12-21', '12-22', '20-21'], ['01-12', '02-12', '12-21', '20-21'], ['02-12', '11-12', '12-21', '20-21']],
  [['01-10', '10-20', '10-21', '21-22'], ['01-10', '10-21', '12-21', '21-22']],
  [['00-01', '01-10', '01-12', '12-21'], ['01-02', '01-10', '02-12', '12-21'], ['01-02', '01-10', '01-12', '10-21']],
  [['00-11', '10-11', '10-21', '12-21'], ['00-10', '01-10', '10-21', '12-21'], ['00-10', '10-21', '11-12', '12-21']],
  [['00-01', '00-11', '11-12', '11-22'], ['00-01', '01-11', '01-12', '11-22'], ['00-01', '01-11', '02-11', '11-22']],
  [['01-12', '10-21', '11-12', '11-21'], ['02-12', '11-12', '11-21', '20-21']],
  [['00-11', '02-11', '11-21', '20-21'], ['02-11', '10-11', '11-21', '20-21'], ['02-11', '11-21', '11-22', '20-21']],
  [['02-11', '11-12', '11-20', '12-21'], ['00-11', '02-12', '11-12', '12-21'], ['00-11', '11-12', '11-21', '12-21']],
  [['01-11', '01-12', '11-12', '11-20'], ['01-12', '10-20', '11-12', '11-20'], ['01-12', '11-12', '11-20', '11-21']],
];

/**
 * Alıştırma: aranan simge var (benzer yok), yok (benzer yok), yok ama benzeri var, var ve öteki aranan simgenin benzeri de
 * var, yok, var. Yanlış cevapta neden yanlış olduğu gösterilir.
 */
const PRACTICE: SymbolSearchTrial[] = [
  { targets: [0, 5], group: [{ g: 9 }, { g: 0 }, { g: 12 }, { g: 3 }], present: true, lookalike: false },
  { targets: [7, 2], group: [{ g: 4 }, { g: 11 }, { g: 6 }, { g: 13 }], present: false, lookalike: false },
  { targets: [10, 1], group: [{ g: 8 }, { g: 1, l: 0 }, { g: 5 }, { g: 3 }], present: false, lookalike: true },
  { targets: [4, 13], group: [{ g: 4, l: 1 }, { g: 2 }, { g: 13 }, { g: 7 }], present: true, lookalike: true },
  { targets: [6, 9], group: [{ g: 0 }, { g: 12 }, { g: 10 }, { g: 5 }], present: false, lookalike: false },
  { targets: [11, 3], group: [{ g: 2 }, { g: 8 }, { g: 6 }, { g: 3 }], present: true, lookalike: false },
];

const task: SymbolSearchTask = {
  key: 'simge-bulma',
  kind: 'symbol_search',
  name: 'Simge Bulma',
  measures: 'Benzer simgeleri hızlı ve doğru karşılaştırabilmeyi, yani işlem hızını ölçer.',
  instructions: [
    'Üstte iki aranan simge, altında dört simgelik bir sıra göreceksin.',
    'Aranan simgelerden biri sırada tıpatıp aynısıyla varsa “Var”, yoksa “Yok” düğmesine bas. Bazı simgeler arananlara çok benzer ama bir çizgileri farklıdır; onlar aynı simge sayılmaz.',
    'Bilgisayarda sol ok ya da V tuşu “Var”, sağ ok ya da Y tuşu “Yok” demektir.',
    'Önce altı denemelik bir alıştırma var. Sonra iki dakika boyunca yapabildiğin kadar karar ver; hem hızlı hem doğru olmaya çalış.',
  ],
  glyphs: GLYPHS,
  lookalikes: LOOKALIKES,
  groupSize: 4,
  durationMs: 120_000,
  trials: 240,
  practice: PRACTICE,
  generator: 1,
};

export const SYMBOL_SEARCH_GLYPHS = GLYPHS;
export const SYMBOL_SEARCH_LOOKALIKES = LOOKALIKES;

export const simgeBulma: TaskInstrument = {
  slug: 'simge-bulma',
  version: 1,
  engine: 'tasks',
  name: 'İşlem Hızı: Simge Bulma',
  shortName: 'Simge bulma',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 62.25,
  tagline: 'Benzer simgeleri hızlı ve doğru karşılaştırabilmeyi, yani işlem hızını ölçer.',
  description:
    'Bu test, işlem hızını, yani basit görsel bilgiyi hızlı ve doğru karşılaştırıp karar verebilmeyi ölçer. Her denemede üstte iki aranan simge, altında dört simgelik bir sıra görünür; aranan simgelerden biri sırada varsa “Var”, yoksa “Yok” denir. Bazı simgeler arananlara çok benzer ama bir çizgileri farklıdır. Kısa bir alıştırmadan sonra iki dakika boyunca yapılabildiği kadar karar verilir; test yaklaşık 5 dakika sürer. Simgeler Ölçekhane tarafından özgün olarak hazırlanmıştır; denemeler her uygulamada yeniden üretilir, bu yüzden ezberlenemez. Rapor, iki dakikadaki doğru kararları, doğruluğu ve hata türlerini sade bir dille anlatır. Benzer simgelerin etkisini, “Var” ve “Yok” kararlarının süresini ve hızla doğruluğun dengesini de gösterir. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Simgeyi bul',
    paragraphs: [
      'Birazdan üstte iki simge, altında dört simgelik bir sıra göreceksin. Üstteki simgelerden biri sırada tıpatıp aynısıyla varsa “Var”, yoksa “Yok” düğmesine basacaksın.',
      'Önce altı denemelik bir alıştırma var. Sonra iki dakika boyunca yapabildiğin kadar karar vereceksin. Hem hızlı hem doğru olmaya çalış.',
      'Sessiz bir yerde ve dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır. Başka bir sekmeye ya da uygulamaya geçersen görev ve süre durur.',
    ],
  },
  scales: [
    { key: 'sg_hiz', name: 'Çalışma hızı', plain: 'İki dakikada verilen doğru cevapların sayısı ve bir kararın tipik süresi.' },
    {
      key: 'sg_dogruluk',
      name: 'Doğruluk ve hata türleri',
      plain: 'Kararların ne kadarının doğru olduğu; yanlışlarda sıradaki aranan simgenin mi gözden kaçtığı, yoksa sırada olmayan bir simgenin mi görüldüğü.',
    },
    { key: 'sg_benzer', name: 'Benzer simgeler', plain: 'Sırada aranan simgelerden birine çok benzeyen bir simge varken doğruluğun ve sürenin nasıl değiştiği.' },
    { key: 'sg_varyok', name: 'Var mı, yok mu?', plain: 'Aranan simge sırada varken ve yokken verilen doğru kararların tipik süresi.' },
    { key: 'sg_denge', name: 'Hız ve doğruluk dengesi', plain: 'En hızlı verilen kararlarla daha uzun düşünülen kararların doğruluğu.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Görsel eşleştirme ve simge arama türü işlem hızı görevleri. Bu görevlerde kişi, iki aranan simgenin yanındaki küçük bir simge grubunda olup olmadığına “var” ya da “yok” diye karar verir. Bu düzen, Wechsler testlerinin bazı sürümlerinde (ör. WISC-IV ve WAIS-IV) “Symbol Search” adlı alt testte kullanılır. Orada iki aranan simge ve beş simgelik bir grup vardır; kişi iki dakikada yapabildiği kadar denemeyi çözer. Puan, doğru sayısından yanlış sayısı çıkarılarak bulunur (Langer ve ark., 2017). Wechsler Çocuklar İçin Zekâ Ölçeği-IV’ün Türkçe sürümünde bu alt testin adı “Simge Arama”dır (Uluç ve Öktem, 2023). Bu test o alt test değildir, onun bir sürümü de değildir. Simgeleri, denemeleri, puanlaması ve raporu Ölçekhane’nindir; o testin malzemeleri, kuralları ve normları kullanılmaz. Sonuçları da o testin sonuçlarıyla karşılaştırılamaz. Bu testte iki aranan simge ve dört simgelik bir sıra vardır; simgeler 3 × 3 noktalı bir ızgarada dört çizgiden oluşur. Denemelerin yarısında sırada aranan simgelerden birinin, bir çizgisi farklı bir benzeri bulunur. Telefonda çözülen başka bir simge arama görevinde de denemelerin dörtte üçünde kişiyi yanıltabilecek bir simge vardır (Valentine ve Kratz, 2023). Denemeler her uygulamada bilgisayar tarafından yeniden üretilir; bu yüzden ezberlenemez.',
    whatItMeasures:
      'İşlem hızını, yani basit görsel bilgiyi ne kadar çabuk fark edip doğru karar verebildiğini ölçer. Bu tür görevler hızın yanında aranan simgeleri akılda tutmayı, simgeleri birbirinden ayırt etmeyi ve dikkatli karşılaştırmayı da ister (Langer ve ark., 2017). Simgeleri yazmayı ya da çizmeyi gerektiren sembol eşleştirme görevlerinden farkı, yalnızca “Var” ya da “Yok” demeyi istemesidir. İşlem hızı, çalışma belleği ve akıl yürütmeyle bağlantılı becerilerden biridir. 7–19 yaşlarında 214 kişiyle yapılan bir çalışmada, çalışma belleğinde yaşla görülen artışın yaklaşık dörtte üçü hızdaki gelişmeyle açıklanmıştır (Fry ve Hale, 1996). Bir başka çalışmada 6–13 yaşlarında 277 çocuk yaklaşık iki buçuk yıl izlendi. Görsel eşleştirme gibi görevlerle ölçülen hız, sonraki akıl yürütmeyi doğrudan öngördü (Kail ve ark., 2016). Yine de işlem hızı tek başına okul başarısını söylemez. 1–11. sınıflardan 1.560 öğrenciyle yapılan bir çalışmada hız, seçmeli tepki süresiyle ölçüldü. Hız ile notlar arasında ya hiç ya da çok zayıf bir ilişki bulundu (Tikhomirova ve ark., 2020). Aramada bazı olgular çoğu kişide görülür. Aranan simge sırada yokken karar vermek genellikle daha uzun sürer (Treisman ve Gelade, 1980; Wolfe, 2021). Çünkü “Yok” demek için sıradaki bütün simgelere bakmak gerekir (Langer ve ark., 2017). Aranan simgeye benzeyen simgeler aramayı zorlaştırır (Duncan ve Humphreys, 1989; Wolfe ve Horowitz, 2017). Aranan şeyin aramaların yarısında bulunduğu durumlarda en sık hata, genellikle var olanı gözden kaçırmaktır (Wolfe, 2021). Hız ile doğruluk birbirini etkiler: hızlanınca hata artabilir, dikkatli çalışınca yavaşlanabilir. Bu yüzden ikisi birlikte okunmalıdır (Heitz, 2014). Bir çocuk hastanesinin bilgi sayfası, beyin hasarından sonra işlem hızı yavaşlayan çocuklar için yazılmıştır. Ek süre vermeyi, işi azaltmayı ve süreli işleri sınırlamayı önerir (The Royal Children’s Hospital Melbourne, 2025). Matematikte zorlanan öğrenciler için hazırlanan bir kılavuz, her destek oturumunda yaklaşık 10 dakikanın temel işlemleri akıcı hâle getirmeye ayrılmasını önerir (Gersten ve ark., 2009). Bu öneri işlem hızına değil, matematiğin temel işlemlerine yöneliktir. Rapordaki hata türleri ve karşılaştırmalar Ölçekhane’nin betimleyici çözümlemeleridir. Bu test bir zekâ puanı (IQ) vermez; sonuç, işlem hızının bugünkü durumunu anlatır.',
    turkishVersion:
      'Özgün test. Simgeler, denemeler ve yönergeler Ölçekhane tarafından hazırlanmıştır; simgeler harf ya da rakam değildir, çözmek için okuma gerekmez. Türkiye’de aynı türden bir alt test, Wechsler Çocuklar İçin Zekâ Ölçeği-IV’ün Türkçe sürümünde “Simge Arama” adıyla kullanılır (Uluç ve Öktem, 2023). Bu ölçeğin Türkiye standardizasyonu 2.225 çocukla yapılmıştır (Öktem ve ark., 2016; aktaran Çelik, 2021). Bu test o alt testin maddelerini, puanlamasını ve normlarını kullanmaz; o testin sonuçları bu test için geçerli sayılmaz.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Süreli testlerde, testi iki yarıya bölerek hesaplanan güvenirlik yanıltıcı olabilir (Cronbach ve Warrington, 1951). Bu yüzden böyle testlerin güvenirliği başka yollarla incelenmelidir. Yetişkinlerin telefonda günde birkaç kez çözdüğü benzer bir simge arama görevinde, ilk günün oturumları kişileri güvenilir biçimde ayırmıştır (.88–.91). Ama aynı kişinin sonucu oturumdan oturuma belirgin biçimde değişmiştir. Sonuçlardaki farkların %35–39’u bu dalgalanmadan gelmiştir (Valentine ve Kratz, 2023). Yetişkinlerin günlük hayatta telefonla tekrar tekrar çözdüğü benzer görevlerde de birçok ölçümün ortalaması çok güvenilir bulunmuştur. Kişinin ölçümden ölçüme değişimi de güvenilir biçimde ölçülebilmiştir (Sliwinski ve ark., 2018). Bu değerler o görevlere aittir; bu test için geçerli sayılamaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, iki dakikadaki doğru cevaplarla ve kişinin kendi kararları arasındaki farklarla anlatılır. Zekâ puanı (IQ) verilmez. İşlem hızı çocuklukta hızla artar, büyüdükçe bu artış yavaşlar (Kail, 1991). Bir araştırmada 10 yaş grubu genç erişkinlerden yaklaşık 1,8 kat, 12 yaş grubu yaklaşık 1,5 kat yavaştı; 15 yaş grubu ise genç erişkinlere yakın hızdaydı (Hale, 1990). Yetişkinlikte yaş ilerledikçe hız yavaş yavaş azalır (Salthouse, 1996). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir. Telefon ve bilgisayar tepki sürelerini biraz farklı ölçebilir (Pronk ve ark., 2020); farklı cihazlarda alınan süreler birebir karşılaştırılmamalıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Tablet ya da bilgisayarla yapılması önerilir; telefonda da çözülebilir. Aynı kişinin sonuçları karşılaştırılacaksa test aynı tür cihazla çözülmelidir.',
    license: 'Özgün test. Simgeler, deneme üretim kuralı, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir; görevin düzeni bilimsel yayınlarda tanımlanan görsel arama ve eşleştirme düzenidir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; dikkat ya da öğrenmeyle ilgili güçlükler ancak uzman değerlendirmesiyle anlaşılabilir.',
      'İşlem hızının yalnızca bir yönünü (benzer simgeleri görerek karşılaştırmayı) ölçer; yazma ya da okuma hızı hakkında doğrudan bilgi vermez.',
      'Süreler cihaza, ekrana ve tarayıcıya göre biraz değişir: web uygulamalarında ölçülen tepki sürelerinin gerçek süreden biraz uzun ölçüldüğü bulunmuştur (Pronk ve ark., 2020). Dokunarak, fareyle ya da klavyeyle cevap vermek de süreyi etkileyebilir.',
      'Test yeniden çözüldüğünde sonuç çoğu zaman biraz yükselir: bilişsel testlerin yeniden uygulanmasıyla ilgili bir derlemede, işlem hızı testlerinde ikinci uygulamadaki ortalama artış yaklaşık 0,37 standart sapma bulunmuştur (Scharfen ve ark., 2018). Bu artış gerçek bir değişim olmayabilir.',
      'Sonuç; o günkü uyku, yorgunluk, isteklilik ve ortamdaki gürültüden etkilenebilir. İki dakikalık tek bir oturum o günkü durumu gösterir.',
      'Bir görevi çok çalışmak o görevde ve ona çok benzeyen görevlerde sonucu yükseltebilir; ama bilişsel alıştırmaların başka becerilere yansıdığı gösterilememiştir (Sala ve ark., 2019; Sala ve Gobet, 2020). Bu görevi tekrar tekrar çözmenin kişiyi genel olarak hızlandıracağı beklenmemelidir.',
      'Rapordaki karşılaştırmalar (benzer simge olan ve olmayan denemeler, “Var” ve “Yok” kararları, hızlı ve yavaş kararlar) iki dakikalık tek bir oturuma dayanır ve kabaca fikir verir; bu ayrımların güvenirliği araştırılmadı.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Cronbach, L. J. ve Warrington, W. G. (1951). Time-limit tests: Estimating their reliability and degree of speeding. Psychometrika, 16(2), 167–188.',
        url: 'https://doi.org/10.1007/BF02289113',
      },
      {
        text: 'Çelik, C. (2021). Confirmatory factor analyses of the Turkish version of the WISC-IV in non-clinical sample: Validation of the Wechsler and CHC models with core and supplemental subtests. Psychiatry and Clinical Psychopharmacology, 31(3), 319–330.',
        url: 'https://doi.org/10.5152/pcp.2021.21120',
      },
      {
        text: 'Duncan, J. ve Humphreys, G. W. (1989). Visual search and stimulus similarity. Psychological Review, 96(3), 433–458.',
        url: 'https://doi.org/10.1037/0033-295X.96.3.433',
      },
      {
        text: 'Fry, A. F. ve Hale, S. (1996). Processing speed, working memory, and fluid intelligence: Evidence for a developmental cascade. Psychological Science, 7(4), 237–241.',
        url: 'https://doi.org/10.1111/j.1467-9280.1996.tb00366.x',
      },
      {
        text: 'Gersten, R., Beckmann, S., Clarke, B., Foegen, A., Marsh, L., Star, J. R. ve Witzel, B. (2009). Assisting students struggling with mathematics: Response to Intervention (RtI) for elementary and middle schools (NCEE 2009-4060). National Center for Education Evaluation and Regional Assistance, Institute of Education Sciences, U.S. Department of Education.',
        url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/2/',
      },
      {
        text: 'Hale, S. (1990). A global developmental trend in cognitive processing speed. Child Development, 61(3), 653–663.',
        url: 'https://doi.org/10.1111/j.1467-8624.1990.tb02809.x',
      },
      {
        text: 'Heitz, R. P. (2014). The speed-accuracy tradeoff: History, physiology, methodology, and behavior. Frontiers in Neuroscience, 8, 150.',
        url: 'https://doi.org/10.3389/fnins.2014.00150',
      },
      {
        text: 'Kail, R. (1991). Developmental change in speed of processing during childhood and adolescence. Psychological Bulletin, 109(3), 490–501.',
        url: 'https://doi.org/10.1037/0033-2909.109.3.490',
      },
      {
        text: 'Kail, R. V., Lervåg, A. ve Hulme, C. (2016). Longitudinal evidence linking processing speed to the development of reasoning. Developmental Science, 19(6), 1067–1074.',
        url: 'https://doi.org/10.1111/desc.12352',
      },
      {
        text: 'Langer, N., Ho, E. J., Pedroni, A., Alexander, L. M., Marcelle, E. T., Schuster, K., Milham, M. P. ve Kelly, S. P. (2017). A multi-modal approach to decomposing standard neuropsychological test performance: Symbol Search [Ön baskı]. bioRxiv.',
        url: 'https://doi.org/10.1101/200998',
      },
      {
        text: 'Öktem, F., Erden, G., Gençöz, T., Sezgin, N. ve Uluç, S. (2016). Wechsler Çocuklar İçin Zekâ Ölçeği-IV (WÇZÖ-IV) uygulama ve puanlama el kitabı Türkçe sürümü. Türk Psikologlar Derneği-Pearson.',
      },
      {
        text: 'Pronk, T., Wiers, R. W., Molenkamp, B. ve Murre, J. (2020). Mental chronometry in the pocket? Timing accuracy of web applications on touchscreen and keyboard devices. Behavior Research Methods, 52(3), 1371–1382.',
        url: 'https://doi.org/10.3758/s13428-019-01321-2',
      },
      {
        text: 'Sala, G., Aksayli, N. D., Tatlidil, K. S., Tatsumi, T., Gondo, Y. ve Gobet, F. (2019). Near and far transfer in cognitive training: A second-order meta-analysis. Collabra: Psychology, 5(1), 18.',
        url: 'https://doi.org/10.1525/collabra.203',
      },
      {
        text: 'Sala, G. ve Gobet, F. (2020). Working memory training in typically developing children: A multilevel meta-analysis. Psychonomic Bulletin & Review, 27(3), 423–434.',
        url: 'https://doi.org/10.3758/s13423-019-01681-y',
      },
      {
        text: 'Salthouse, T. A. (1996). The processing-speed theory of adult age differences in cognition. Psychological Review, 103(3), 403–428.',
        url: 'https://doi.org/10.1037/0033-295X.103.3.403',
      },
      {
        text: 'Scharfen, J., Peters, J. M. ve Holling, H. (2018). Retest effects in cognitive ability tests: A meta-analysis. Intelligence, 67, 44–66.',
        url: 'https://doi.org/10.1016/j.intell.2018.01.003',
      },
      {
        text: 'Sliwinski, M. J., Mogle, J. A., Hyun, J., Munoz, E., Smyth, J. M. ve Lipton, R. B. (2018). Reliability and validity of ambulatory cognitive assessments. Assessment, 25(1), 14–30.',
        url: 'https://doi.org/10.1177/1073191116643164',
      },
      {
        text: 'The Royal Children’s Hospital Melbourne (2025). Brain injury – Speed of information processing [Bilgi sayfası].',
        url: 'https://rch.org.au/kidsinfo/fact_sheets/Brain_injury_Speed_of_information_processing',
      },
      {
        text: 'Tikhomirova, T., Malykh, A. ve Malykh, S. (2020). Predicting academic achievement with cognitive abilities: Cross-sectional study across school education. Behavioral Sciences, 10(10), 158.',
        url: 'https://doi.org/10.3390/bs10100158',
      },
      {
        text: 'Treisman, A. M. ve Gelade, G. (1980). A feature-integration theory of attention. Cognitive Psychology, 12(1), 97–136.',
        url: 'https://doi.org/10.1016/0010-0285(80)90005-5',
      },
      {
        text: 'Uluç, S. ve Öktem, F. (2023). Kaufman Kısa Zekâ Testi İkinci Sürümünün (KBIT-2) ve Wechsler Çocuklar için Zekâ Ölçeğinin Dördüncü Sürümünün (WÇZÖ-IV) karşılaştırılması. Psikoloji Çalışmaları – Studies in Psychology, 43(1), 117–140.',
        url: 'https://doi.org/10.26650/SP2022-1092655',
      },
      {
        text: 'Valentine, T. R. ve Kratz, A. L. (2023). Feasibility, reliability, and validity of ambulatory cognitive tests in fibromyalgia and matched controls. Journal of the International Neuropsychological Society, 29(9), 893–901.',
        url: 'https://doi.org/10.1017/S1355617723000073',
      },
      {
        text: 'Wolfe, J. M. (2021). Guided Search 6.0: An updated model of visual search. Psychonomic Bulletin & Review, 28(4), 1060–1092.',
        url: 'https://doi.org/10.3758/s13423-020-01859-9',
      },
      {
        text: 'Wolfe, J. M. ve Horowitz, T. S. (2017). Five factors that guide attention in visual search. Nature Human Behaviour, 1(3), 0058.',
        url: 'https://doi.org/10.1038/s41562-017-0058',
      },
    ],
  },
};
