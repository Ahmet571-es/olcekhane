import type { LetterNumberTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Harf-Sayı Sıralama (çalışma belleği; Gold ve ark., 1997'nin harf-sayı sıralama düzeni): karışık sayılar ve harfler ekranda
 * tek tek gösterilir; dizi bitince önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla girilir. Diziler 2 öğeden 8
 * öğeye uzar; her uzunlukta üç dizi vardır ve bir uzunluğun üç dizisinin hiçbiri tam doğru değilse test biter. Puan, tam doğru
 * sıralanan en uzun dizidir; doğru diziler, öğelerin hatırlanması ve sıralanması ayrıca anlatılır.
 *
 * Bütün diziler Ölçekhane'nindir; ticari testlerin (WAIS, WISC) maddeleri, puanlaması ya da normları kullanılmaz. Öğeler
 * dinletilmez, ekranda gösterilir; cevap ekrandaki tuşlarla ya da klavyeyle girilir.
 *
 * Öğeler: 1–9 sayıları ve 12 ünsüz (C D F H K L M N P R T Y). Ünlü yoktur: bir dizinin harfleri bir sözcük oluşturmasın. Sayılarla
 * karışabilecek harfler (B–8, G–6, I/İ–1, O–0, S–5, Z–2), Türkçeye özgü harfler (Ç, Ğ, Ş) ve birbirine benzeyen V–Y ile seyrek
 * kullanılan J alınmadı. Bu 12 harfin sırası Türk alfabesinde ve İngiliz alfabesinde aynıdır. Harf tuşları klavyedeki gibi
 * dizilidir (alfabe sırasıyla değil): alfabe sırasını tuşlar değil, kişinin kendisi bulur.
 *
 * Diziler bir üreticiyle seçildi (scratchpad'de, depoda değil); tests/harf-sayi-siralama.test.ts kuralları bağımsız bir
 * denetleyiciyle (tests/helpers/letter-number-check.ts) yeniden denetler:
 *  - bir dizide aynı öğe iki kez geçmez; iki öğeli dizilerde harf sayıdan önce gelir (cevap için sırayı değiştirmek gerekir);
 *  - üç ve daha uzun dizilerde: aynı türden en çok iki öğe art arda gelir; en az bir harf bir sayıdan önce gelir; dört ve daha
 *    uzun dizilerde sayılar ve harfler en az uzunluğun yarısı kadar yer değiştirir (iki blok hâlinde gelmez);
 *  - bir türden iki öğe varsa büyükten küçüğe (alfabede sondan başa) gösterilir; üç ya da dört öğe varsa ne sıralı ne de tam
 *    ters sıralıdır: her türde sıralama gerekir;
 *  - dört cevap biçimi birbirinden farklıdır: doğru cevap, gösterildiği sıra, önce harfler (ikisi de sıralı) ve sayılarla
 *    harflerin ayrılıp kendi içlerinde sıralanmadığı cevap (hata türleri bu yüzden ayırt edilebilir);
 *  - bir dizideki sayılar ya da harfler arasında art arda üç değer yoktur (ör. 3 4 5; K L M); sıralı sayılarda ikişer ya da
 *    üçer artan üç sayı yoktur (ör. 2 4 6, 3 6 9); harfler sıralı ya da gösterildiği sırada bilinen bir kısaltma ya da ad
 *    oluşturmaz (ör. TL, KM, CHP, LC), yan yana gelen bir sayı ve harf bilinen bir ad oluşturmaz (ör.
 *    3D, 4K) ve sayılar bilinen bir yıl oluşturmaz (1923, 1453, 1938);
 *  - uzunluklarda sayı ve harf sayıları dengelidir (toplam 53 sayı, 52 harf); her sayı ve harf testte yaklaşık eşit sıklıkta
 *    geçer; art arda iki dizi aynı öğeyle başlamaz ve en çok yarı yarıya ortaktır; aynı uzunluktaki diziler birbirinden farklıdır;
 *  - alıştırma dizileri asıl dizilerden farklıdır.
 * Diziler değişirse testin sürüm numarası artırılmalıdır.
 */

const DIGITS = '123456789';
const LETTERS = 'CDFHKLMNPRTY';
/** Harf tuşları: Türkçe Q klavyedeki satırlarına ve sıralarına göre. */
const KEY_ROWS = ['RTYP', 'DFHKL', 'CNM'];

/** [uzunluk, üç dizi]. */
const LEVELS: [number, [string, string, string]][] = [
  [2, ['P4', 'C5', 'Y9']],
  [3, ['7N6', 'T8F', '3L2']],
  [4, ['Y31K', '9MD8', 'L4H2']],
  [5, ['5KP1F', 'N27H6', '8T3PR']],
  [6, ['T61D9M', '7KY4C5', 'N14C2R']],
  [7, ['85HM9D6', 'H37RL6F', '2N85T4F']],
  [8, ['C7K69R1L', '58DY3L2M', 'D79H1R3P']],
];

/** Alıştırma: iki öğeli (sıra değişir), üç öğeli (sayılar sıralanır) ve dört öğeli (ikisi de sıralanır) birer dizi. */
const PRACTICE = ['M4', '6C2', 'R7H1'];

export const LETTER_NUMBER_LEVELS = LEVELS;
export const LETTER_NUMBER_PRACTICE = PRACTICE;

const task: LetterNumberTask = {
  key: 'harf-sayi-siralama',
  kind: 'letter_number',
  name: 'Harf-Sayı Sıralama',
  measures: 'Karışık sayıları ve harfleri akılda tutup sıraya koyabilmeyi, yani çalışma belleğini ölçer.',
  instructions: [
    'Ekranda sayılar ve harfler tek tek, karışık olarak görünecek.',
    'Dizi bitince önce sayıları küçükten büyüğe, sonra harfleri alfabe sırasıyla gir. Örneğin “K 3 D 1” görürsen “1 3 D K” girersin.',
    'Diziler giderek uzayacak. Hatırlamadığın bir dizide “Hatırlamıyorum” düğmesine basabilirsin.',
  ],
  onMs: 1000,
  offMs: 250,
  digits: DIGITS,
  letters: LETTERS,
  keyRows: KEY_ROWS,
  practice: PRACTICE,
  levels: LEVELS.map(([length, items]) => ({ length, items })),
};

const MIN = LEVELS[0][0];
const MAX = LEVELS[LEVELS.length - 1][0];

export const harfSayiSiralama: TaskInstrument = {
  slug: 'harf-sayi-siralama',
  version: 1,
  engine: 'tasks',
  name: 'Harf-Sayı Sıralama',
  shortName: 'Harf-sayı sıralama',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 8,
  sortOrder: 59.25,
  tagline: 'Karışık sayıları ve harfleri akılda tutup sıraya koyabilmeyi, yani çalışma belleğini ölçer.',
  description: `Bu test, karışık olarak gösterilen sayıları ve harfleri akılda tutup sıraya koyabilmeyi, yani çalışma belleğini ölçer. Ekranda sayılar ve harfler tek tek görünür; dizi bitince önce sayılar küçükten büyüğe, sonra harfler alfabe sırasıyla girilir. Diziler ${MIN} öğeden ${MAX} öğeye kadar uzar; her uzunlukta üç dizi vardır ve bir uzunluktaki üç dizinin hiçbiri doğru sıralanamayınca test biter. Bütün diziler Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; doğru sıralanan en uzun diziyi, diziler uzadıkça sonucun nasıl değiştiğini, yanlışlarda öğelerin mi unutulduğunu yoksa sıranın mı karıştığını, sayılarla harflerin ayrı ayrı nasıl hatırlanıp sıralandığını ve dizilere nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.`,
  intro: {
    title: 'Aklında tut, sıraya koy',
    paragraphs: [
      'Birazdan ekranda sayılar ve harfler tek tek, karışık olarak görünecek. Dizi bitince önce sayıları küçükten büyüğe, sonra harfleri alfabe sırasıyla gireceksin.',
      `Önce üç alıştırma dizisi var. Ardından diziler ${MIN} öğeden başlayıp giderek uzar; bir uzunluktaki üç dizinin hiçbirini doğru sıralayamadığında test biter. Bu yüzden testin süresi kişiden kişiye değişir; çoğu kişi için 5–10 dakikadır.`,
      'Sessiz bir yerde, kâğıt kalem kullanmadan ve dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır. Dizi gösterilirken başka bir uygulamaya geçersen aynı dizi yeniden gösterilir.',
    ],
  },
  scales: [
    { key: 'hs_aralik', name: 'En uzun doğru dizi', plain: `Bütün öğeleri doğru sırada girilen en uzun dizideki öğe sayısı (${MIN} ile ${MAX} arası).` },
    { key: 'hs_dizi', name: 'Doğru sıralanan diziler', plain: 'Gösterilen dizilerin kaç tanesinin bütün öğeleriyle doğru sırada girildiği ve diziler uzadıkça bunun nasıl değiştiği.' },
    {
      key: 'hs_hata',
      name: 'Hata türleri',
      plain: 'Yanlış dizilerde öğelerin mi unutulduğu yoksa bütün öğeler hatırlanıp sıranın mı karıştığı; sıra karıştıysa nasıl karıştığı.',
    },
    { key: 'hs_turler', name: 'Sayılar ve harfler', plain: 'Gösterilen sayıların ve harflerin ayrı ayrı ne kadarının hatırlandığı ve doğru sıraya konduğu.' },
    { key: 'hs_calisma', name: 'Çalışma biçimi', plain: 'Dizilere cevap vermeye ne kadar zaman ayrıldığı ve “Hatırlamıyorum” düğmesinin ne kadar kullanıldığı.' },
  ],
  tasks: [task],
  science: {
    basedOn: `Harf-sayı sıralama (letter-number sequencing) görevi: karışık sayılar ve harfler sırayla verilir; kişi sayıları küçükten büyüğe, harfleri alfabe sırasıyla söyler. Görev, 1997’de yeni bir çalışma belleği ölçüsü olarak tanıtılmıştır (Gold ve ark., 1997). Aynı yıllarda Wechsler zekâ ve bellek testlerine alt test olarak girmiştir (Tulsky ve Zhu, 2000). Yetişkinler için WAIS-IV’te (16–69 yaş) yedek bir alt test, çocuklar için WISC-IV’te ise çalışma belleği indeksinin iki alt testinden biridir (Harrison ve ark., 2024). Bu testlerde öğeler kişiye okunur ve kişi sözlü cevap verir. Bu testte ise öğeler, akıllı telefonlar için geliştirilen Mobile Toolbox “Sequences” görevinde olduğu gibi ekranda tek tek gösterilir ve cevap ekrandaki tuşlarla girilir. O görevde öğeler saniyede bir gösterilir, iki alıştırma dizisi geri bildirim verir ve bir uzunluktaki üç dizinin hepsi yanlış olunca görev biter; ama orada önce harfler, sonra sayılar istenir (Slotkin ve ark., 2025). Bu testte önce sayılar, sonra harfler girilir. Her öğe 1 saniye görünür ve öğeler arasında çeyrek saniyelik bir boşluk vardır; diziler ${MIN} öğeden ${MAX} öğeye uzar ve her uzunlukta üç dizi vardır. Bütün diziler Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari testlerin dizileri, puanlaması ya da normları kullanılmaz.`,
    whatItMeasures:
      'Çalışma belleğini, yani bilgiyi kısa bir süre akılda tutarken onu düzenleyebilmeyi ölçer. Sayıları gösterildiği sırayla tekrarlamaktan farkı, öğelerin akılda tutulurken bir de sıraya konmasıdır. Yine de bu görev, sayı dizisi görevleriyle çok şey paylaşır. 102 üniversite öğrencisiyle yapılan bir çalışmada harf-sayı sıralamadaki farkların büyük kısmı sayı dizisi görevleriyle açıklanmış; işlem hızı ve görsel-uzamsal bellek de ayrıca katkı yapmıştır (Crowe, 2000). WAIS-IV’te bu görevin zihinde düzenleme yükünün düşük kaldığını ileri süren bir çalışma da vardır (Egeland, 2015). Öte yandan görev, laboratuvarlarda kullanılan üç çalışma belleği göreviyle (işlem aralığı, dinleme aralığı ve n-geri) aynı etkende toplanmış; onlarla birlikte akıcı zekâ görevlerini en iyi öngören ölçüler arasında yer almıştır (Shelton ve ark., 2009). WAIS-IV’te 16–69 yaşlarında görevin çalışma belleği indeksine yükü .69 (Wechsler, 2008’den aktaran Harrison ve ark., 2024), sayı dizisiyle ilişkisi .60 bildirilmiştir (Holdnack ve ark., 2011’den aktaran Harrison ve ark., 2024). Görev sırasında beynin alın bölgesinde ve arka yan (parietal) bölgesinde, çalışma belleğiyle ilişkili alanlarda etkinlik görülmüştür (Haut ve ark., 2000). Ekranda görülen harfler de çoğu kişi tarafından içinden söylenerek akılda tutulur. Sesleri birbirine benzeyen harflerden oluşan diziler, yazılı gösterildiklerinde bile daha zor hatırlanır (Conrad, 1964’ten aktaran Chubala ve ark., 2020). Sesleri benzeyen öğeler hatırlanırken yer değiştirebilir, yani sıraları karışabilir (Conrad, 1965’ten aktaran Li ve ark., 2000). İnsanların aynı anda akılda tutabildiği anlamlı birimlerin sayısı sınırlıdır: genç yetişkinlerde 3 ile 5 arasında olduğu düşünülür. Ölçülen bellek aralığına öbeklere ayırmak ve içinden tekrar etmek gibi yollar da katkı yapar (Cowan, 2010). Rapordaki hata türleri (öğelerin unutulması, öğelerin sıraya konmadan girilmesi, önce harflerin yazılması, sıranın karışması) Ölçekhane’nin tanımladığı betimleyici türlerdir; bu görev için yayımlanmış bir hata sınıflamasına ulaşılamadı. Bu test bir zekâ puanı (IQ) vermez; sonuç, çalışma belleğinin bugünkü durumunu anlatır.',
    turkishVersion:
      'Özgün test. Diziler ve yönergeler Ölçekhane tarafından hazırlanmıştır. Aynı tür görev Türkiye’de Wechsler Çocuklar İçin Zekâ Ölçeği-IV’ün Türkçe sürümünde “Harf-Rakam Dizisi” (Ünsal Özberk ve Koç, 2017), Wechsler Bellek Ölçeği-III’ün Türkçe uyarlamasında “Harf-Sayı Dizisi” adıyla kullanılır (Yılmaz ve Bozyiğit, 2023). Türkiye’de 6–16 yaş arası 793 çocukla yapılan doğrulayıcı bir çalışmada, harf-rakam dizisinin çalışma belleği etkeninde yer aldığı modeller verilere iyi uymuştur (Çelik, 2021). Bu test o testlerin maddelerini, puanlamasını ve normlarını kullanmaz; o testlerin sonuçları bu test için geçerli sayılmaz.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Ekranda gösterilen ve telefonda cevaplanan benzer bir görevde (Mobile Toolbox “Sequences”) testin iki yarısı arasındaki tutarlılık yüksek bulunmuştur (.90). Ama kişiler testi gözetimsiz olarak yaklaşık iki hafta arayla yeniden çözdüğünde iki sonuç arasındaki tutarlılık orta düzeyde kalmıştır (ICC = .55). Bu yüzden yazarlar sonucun tek bir kişi için değil, gruplar için yorumlanmasını önermiştir. 78 kişilik bir alt örneklemde aynı görevin WAIS-IV harf-sayı sıralamayla ilişkisi .52 bulunmuştur (Slotkin ve ark., 2025). Bu değerler o göreve aittir; bu test için geçerli sayılamaz. Bu testin asıl puanı tam doğru sıralanan dizilerdir. Rapor ayrıca öğe öğe bir sayı da gösterir: cevapta birbirine göre doğru sırada girilen öğelerin oranı. Karmaşık bellek görevlerinde öğe öğe verilen kısmi puanın, yalnızca tam doğru dizileri saymaktan daha güvenilir olduğu bulunmuştur (Conway ve ark., 2005). Buradaki sayı o çalışmadaki puanlamaya benzer ama onun aynısı değildir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, doğru sıralanan en uzun diziyle ve dizi uzunluklarına göre doğru dizilerle anlatılır. Zekâ puanı (IQ) verilmez. Çalışma belleği çocuklukta gelişip yetişkinlikte yaşla azaldığı için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Harfleri sıraya koymak için testteki 12 harfin alfabedeki sırasını bilmek gerekir. 2019 Türkçe öğretim programında ilk okuma yazma ses esaslı bir yöntemle öğretilir ve harfler alfabe sırasıyla değil, harf grupları hâlinde ele alınır (Millî Eğitim Bakanlığı, 2019); bu yüzden küçük sınıflarda alfabe sırasındaki rahatlık sonucu etkileyebilir. Çalışma belleği çocukluk boyunca gelişir: 3–15 yaş arası 208 çocukla yapılan bir çalışmada benzer bir sıralama görevinin sonuçları yaşla güçlü biçimde ilişkiliydi (r = .77) ve çocukluk ile erken ergenlik boyunca yükseldi (Tulsky ve ark., 2013). Bir görsel bellek görevinde akılda tutulan birim sayısı 7 yaşındaki çocuklarda yaklaşık 1,5, daha büyük çocuklarda ve yetişkinlerde yaklaşık 3 bulunmuştur (Cowan, 2010). Yetişkinlikte ise yaş ilerledikçe azalır: 20–85 yaş arası 268 kişide aynı sıralama görevinin sonuçları yaşla ters yönde ilişkiliydi (r = −.44; Tulsky ve ark., 2014). Harf-sayı sıralama puanlarının ileri yaşlarda giderek belirginleşen bir düşüş gösterdiği de bildirilmiştir (Myerson ve ark., 2003).',
    license: 'Özgün test. Diziler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir; görevin düzeni bilimsel yayınlarda tanımlanan harf-sayı sıralama düzenidir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; dikkat, bellek ya da öğrenme sorunları gibi durumlar ancak uzman değerlendirmesiyle anlaşılabilir.',
      'Çalışma belleğinin yalnızca bir yönünü (görülen sayıları ve harfleri kısa bir süre akılda tutup sıraya koymayı) ölçer. Uzun süreli bellek ya da günlük hayattaki unutkanlık hakkında bilgi vermez.',
      'Öğeler bu testte dinletilmez, ekranda gösterilir. Öğelerin duyulması ya da görülmesi sonucu değiştirebilir (Mielicki ve ark., 2018); bu yüzden sonuç, öğelerin okunduğu testlerin sonuçlarıyla doğrudan karşılaştırılmamalıdır.',
      'Harfleri sıraya koyarken alfabenin sırasını rahat bilmek de rol oynar. Türkçede ünsüzlerin adları be, ke gibi aynı “e” sesiyle biter. Sesleri birbirine benzeyen harfler daha zor hatırlandığı (Conrad, 1964’ten aktaran Chubala ve ark., 2020) ve hatırlanırken yer değiştirebildiği için (Conrad, 1965’ten aktaran Li ve ark., 2000) harfler bazı kişilere sayılardan daha zor gelebilir.',
      'Rapordaki hata türleri ve sayılarla harflerin karşılaştırması Ölçekhane’nin betimleyici çözümlemeleridir; bu ayrımların güvenirliği araştırılmadı. Az sayıda diziye dayandıkları için kabaca fikir verir.',
      'Her uzunlukta yalnızca üç dizi vardır ve bir uzunluğun üç dizisinin hiçbiri doğru sıralanamayınca test biter; bu yüzden o günkü kısa bir dalgınlık sonucu düşürebilir. Benzer bir telefon görevinde gözetimsiz yeniden çözümlerde sonuçların tutarlılığı orta düzeyde kalmıştır (Slotkin ve ark., 2025).',
      'Sonuç; o günkü yorgunluk, isteklilik, ortamdaki gürültü ve cihazdan etkilenebilir. Test yeniden çözüldüğünde aynı diziler gösterileceği için sonuç yükselebilir.',
      'Bellek görevleriyle yapılan alıştırmalar alıştırılan göreve benzer görevlerde sonucu kısa vadede yükseltebilir; ama bunun zekâ testlerine ve başka becerilere yansıdığına dair güvenilir bir kanıt yoktur (Melby-Lervåg ve Hulme, 2013; Melby-Lervåg ve ark., 2016). Alıştırmadan sonra görülen yükselişin bir kısmı, öbeklere ayırma gibi bir yolun daha çok kullanılmasından gelebilir (Dunning ve Holmes, 2014). Bu görevi tekrar tekrar çözmenin başka becerileri geliştireceği beklenmemelidir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Chubala, C. M., Guitard, D., Neath, I., Saint-Aubin, J. ve Surprenant, A. M. (2020). Visual similarity effects in immediate serial recall and (sometimes) in immediate serial recognition. Memory & Cognition, 48(3), 411–425.',
        url: 'https://doi.org/10.3758/s13421-019-00979-5',
      },
      {
        text: 'Conway, A. R. A., Kane, M. J., Bunting, M. F., Hambrick, D. Z., Wilhelm, O. ve Engle, R. W. (2005). Working memory span tasks: A methodological review and user’s guide. Psychonomic Bulletin & Review, 12(5), 769–786.',
        url: 'https://doi.org/10.3758/BF03196772',
      },
      {
        text: 'Cowan, N. (2010). The magical mystery four: How is working memory capacity limited, and why? Current Directions in Psychological Science, 19(1), 51–57.',
        url: 'https://doi.org/10.1177/0963721409359277',
      },
      {
        text: 'Crowe, S. F. (2000). Does the letter number sequencing task measure anything more than digit span? Assessment, 7(2), 113–117.',
        url: 'https://doi.org/10.1177/107319110000700202',
      },
      {
        text: 'Çelik, C. (2021). Confirmatory factor analyses of the Turkish version of the WISC-IV in non-clinical sample: Validation of the Wechsler and CHC models with core and supplemental subtests. Psychiatry and Clinical Psychopharmacology, 31(3), 319–330.',
        url: 'https://doi.org/10.5152/pcp.2021.21120',
      },
      {
        text: 'Dunning, D. L. ve Holmes, J. (2014). Does working memory training promote the use of strategies on untrained working memory tasks? Memory & Cognition, 42(6), 854–862.',
        url: 'https://doi.org/10.3758/s13421-014-0410-5',
      },
      {
        text: 'Egeland, J. (2015). Measuring working memory with Digit Span and the Letter-Number Sequencing subtests from the WAIS-IV: Too low manipulation load and risk for underestimating modality effects. Applied Neuropsychology: Adult, 22(6), 445–451.',
        url: 'https://doi.org/10.1080/23279095.2014.992069',
      },
      {
        text: 'Gold, J. M., Carpenter, C., Randolph, C., Goldberg, T. E. ve Weinberger, D. R. (1997). Auditory working memory and Wisconsin Card Sorting Test performance in schizophrenia. Archives of General Psychiatry, 54(2), 159–165.',
        url: 'https://doi.org/10.1001/archpsyc.1997.01830140071013',
      },
      {
        text: 'Harrison, A. G., Beal, A. L., Armstrong, I. T. ve Gallagher, A. (2024). Measurement of working memory on the Wechsler Adult Intelligence Scale: Should we subtract arithmetic? Psychological Injury and Law, 17(1), 55–65.',
        url: 'https://doi.org/10.1007/s12207-024-09499-3',
      },
      {
        text: 'Haut, M. W., Kuwabara, H., Leach, S. ve Arias, R. G. (2000). Neural activation during performance of number-letter sequencing. Applied Neuropsychology, 7(4), 237–242.',
        url: 'https://doi.org/10.1207/S15324826AN0704_5',
      },
      {
        text: 'Li, X., Schweickert, R. ve Gandour, J. (2000). The phonological similarity effect in immediate recall: Positions of shared phonemes. Memory & Cognition, 28(7), 1116–1125.',
        url: 'https://doi.org/10.3758/BF03211813',
      },
      {
        text: 'Melby-Lervåg, M. ve Hulme, C. (2013). Is working memory training effective? A meta-analytic review. Developmental Psychology, 49(2), 270–291.',
        url: 'https://doi.org/10.1037/a0028228',
      },
      {
        text: 'Melby-Lervåg, M., Redick, T. S. ve Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of “far transfer”: Evidence from a meta-analytic review. Perspectives on Psychological Science, 11(4), 512–534.',
        url: 'https://doi.org/10.1177/1745691616635612',
      },
      {
        text: 'Mielicki, M. K., Koppel, R. H., Valencia, G. ve Wiley, J. (2018). Measuring working memory capacity with the letter–number sequencing task: Advantages of visual administration. Applied Cognitive Psychology, 32(6), 805–814.',
        url: 'https://doi.org/10.1002/acp.3468',
      },
      {
        text: 'Millî Eğitim Bakanlığı (2019). Türkçe dersi öğretim programı (ilkokul ve ortaokul 1, 2, 3, 4, 5, 6, 7 ve 8. sınıflar). Millî Eğitim Bakanlığı.',
        url: 'https://mufredat.meb.gov.tr/Dosyalar/20195716392253-02-T%C3%BCrk%C3%A7e%20%C3%96%C4%9Fretim%20Program%C4%B1%202019.pdf',
      },
      {
        text: 'Myerson, J., Emery, L., White, D. A. ve Hale, S. (2003). Effects of age, domain, and processing demands on memory span: Evidence for differential decline. Aging, Neuropsychology, and Cognition, 10(1), 20–27.',
        url: 'https://doi.org/10.1076/anec.10.1.20.13454',
      },
      {
        text: 'Shelton, J. T., Elliott, E. M., Hill, B. D., Calamia, M. R. ve Gouvier, W. D. (2009). A comparison of laboratory and clinical working memory tests and their prediction of fluid intelligence. Intelligence, 37(3), 283–293.',
        url: 'https://doi.org/10.1016/j.intell.2008.11.005',
      },
      {
        text: 'Slotkin, J., Kaat, A. J., Young, S. R., Dworak, E. M., Novack, M. A., Shono, Y. ve ark. (2025). Mobile Toolbox Sequences task: Development and validation of a remote, smartphone-based working memory test. Frontiers in Psychology, 15, 1497816.',
        url: 'https://doi.org/10.3389/fpsyg.2024.1497816',
      },
      {
        text: 'Tulsky, D. S., Carlozzi, N., Chevalier, N., Espy, K. A., Beaumont, J. L. ve Mungas, D. (2013). V. NIH Toolbox Cognition Battery (CB): Measuring working memory. Monographs of the Society for Research in Child Development, 78(4), 70–87.',
        url: 'https://doi.org/10.1111/mono.12035',
      },
      {
        text: 'Tulsky, D. S., Carlozzi, N. E., Chiaravalloti, N. D., Beaumont, J. L., Kisala, P. A., Mungas, D., Conway, K. P. ve Gershon, R. C. (2014). NIH Toolbox Cognition Battery (NIHTB-CB): List Sorting Test to measure working memory. Journal of the International Neuropsychological Society, 20(6), 599–610.',
        url: 'https://doi.org/10.1017/S135561771400040X',
      },
      {
        text: 'Tulsky, D. S. ve Zhu, J. (2000). Could test length or order affect scores on Letter Number Sequencing of the WAIS-III and WMS-III? Ruling out effects of fatigue. The Clinical Neuropsychologist, 14(4), 474–478.',
        url: 'https://doi.org/10.1076/clin.14.4.474.7205',
      },
      {
        text: 'Ünsal Özberk, E. B. ve Koç, N. (2017). WÇZÖ-IV maddelerinin cinsiyet ve sosyo-ekonomik düzey açısından işlev farklılığının belirlenmesinde kullanılan yöntemlerin karşılaştırılması. Eğitimde ve Psikolojide Ölçme ve Değerlendirme Dergisi, 8(1), 112–127.',
        url: 'https://doi.org/10.21031/epod.287577',
      },
      {
        text: 'Yılmaz, S. ve Bozyiğit, T. (2023). Farklı dijital oyun bağımlılığı düzeyine sahip çocuklarda görsel uzaysal bilişsel beceriler ve çalışma belleği kapasitesinin karşılaştırılması. Bağımlılık Dergisi, 24(3), 371–380.',
        url: 'https://doi.org/10.51982/bagimli.1207764',
      },
    ],
  },
};
