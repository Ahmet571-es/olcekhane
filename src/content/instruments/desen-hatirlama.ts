import { parsePattern } from '@/lib/instruments/pattern';
import type { PatternMemoryTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Desen Hatırlama (görsel desen aralığı; Della Sala ve ark., 1999'daki Görsel Desenler Testi düzeni): kareli bir ızgarada
 * dolu kareler 3 saniye gösterilir, ardından boş ızgarada aynı kareler işaretlenir. Desenler düzey düzey büyür (3'ten 15
 * dolu kareye; her düzeyde üç desen); bir düzeyin üç deseninin hiçbiri tam doğru hatırlanmazsa test biter. Puan, tam doğru
 * hatırlanan en büyük desendeki dolu kare sayısıdır (desen aralığı).
 *
 * Bütün desenler ve ızgara boyları Ölçekhane'nindir; ticari testin (Visual Patterns Test, Thames Valley Test Company)
 * desenleri, puan düzeltmeleri ya da normları kullanılmaz. Izgaralar (satır × sütun): 3 kare 2 × 3, 4 kare 2 × 4, 5–6 kare
 * 3 × 4, 7–8 kare 4 × 4, 9–10 kare 4 × 5, 11–12 kare 5 × 5, 13–15 kare 5 × 6; karelerin %42–50'si doludur (kaynak testte
 * yarısı).
 *
 * Desenler bir üreticiyle seçildi (scratchpad'de, depoda değil). Kolay ad verilebilen desenler daha iyi hatırlandığı için
 * (Brown ve ark., 2006) şu kurallar uygulandı ve tests/desen-hatirlama.test.ts bunları bağımsız bir denetleyiciyle
 * (tests/helpers/pattern-check.ts) yeniden denetler:
 *  - hiçbir satır ve (3 ya da daha çok satırlı ızgarada) hiçbir sütun tamamen dolu ya da tamamen boş değildir;
 *  - desen yatay ya da dikey eksene göre ayna simetrik değildir, 180 derece döndürüldüğünde kendisiyle örtüşmez (kare
 *    ızgarada köşegenlere göre de simetrik değildir, 90 derece döndürmede örtüşmez);
 *  - yatay dolu dizi 4 ve daha dar ızgarada en çok 2, daha genişte en çok 3 kare; dikey dolu dizi 4 ve daha az satırda en
 *    çok 2, daha çokta en çok 3 kare; köşegen dolu dizi en çok 3 kare;
 *  - tamamen dolu ve tamamen boş 2 × 2'lik bölge en çok birer tanedir;
 *  - dolu kareler birkaç parçaya ayrılır (kenardan birbirine değen kareler bir parçadır): 3 karede 1–2 parça; 4 ve daha
 *    çok karede en az max(2, ⌈kare/4⌉), en çok max(2, ⌈kare/2,5⌉) parça (ör. 8 karede 2–4, 15 karede 4–6); bir düzeydeki
 *    üç desenin parça sayıları en çok 1 farklıdır;
 *  - bir düzeydeki üç desen, biri döndürülse ya da aynada çevrilse bile birbirinden farklıdır (en az 1–4 kare; büyük
 *    düzeylerde daha çok); aynı ızgaradaki art arda iki desen en az o kadar farklıdır;
 *  - alıştırma desenleri asıl desenlerden farklıdır.
 * Desenler değişirse testin sürüm numarası artırılmalıdır.
 */

/** [dolu kare sayısı, üç desen]: satırlar "/" ile ayrılır, "#" dolu, "." boş kare. */
const LEVELS: [number, [string, string, string]][] = [
  [3, ['##./.#.', '##./..#', '#../##.']],
  [4, ['..##/#..#', '..#./#.##', '...#/#.##']],
  [5, ['#.../..##/.##.', '#.../.##./..##', '..##/...#/##..']],
  [6, ['##.#/.#../..##', '...#/#.##/##..', '.#../##.#/#.#.']],
  [7, ['..#./##../.##./..##', '.#../#..#/##../.##.', '..##/#.#./#.../.##.']],
  [8, ['...#/##../#.##/.##.', '#.../..##/#.#./##.#', '##.#/.#../#.#./#.#.']],
  [9, ['###../..#.#/##.../..##.', '..#../##.../.#.#./#.###', '.#.##/....#/..##./###..']],
  [10, ['...#./#..#./.##.#/#.###', '#..##/#..../.###./##..#', '.##.#/##.../#.#.#/..##.']],
  [11, ['#...#/#.##./#..../..##./.##.#', '....#/#.#../.##.#/##.#./.#.#.', '#..##/....#/.#.#./.#..#/.##.#']],
  [12, ['..###/...#./###../...##/.###.', '.##.#/..###/....#/.##../#..##', '..#../#.###/.##.#/#..../##.#.']],
  [13, ['#...#./.#.###/#..#.#/.##.../...##.', '..#.##/.#.###/...#../##..../#..##.', '##.#../#..##./.....#/.#.##./..###.']],
  [14, ['#.#.#./#.###./.###.#/...#.#/.#....', '#..##./..##.#/...##./.##.../##..##', '#.##.#/....##/#..##./.#..##/.##...']],
  [15, ['.#..##/##.###/.##.../#...#./##..#.', '..#.#./.#.###/.....#/##.###/.#.##.', '..###./###.#./##.#.#/.#..#./..##..']],
];

/** Alıştırma: 2 kareli ve 3 kareli birer desen (geri bildirimli, puanlanmaz). */
const PRACTICE = ['#./.#', '#.#/..#'];

export const PATTERN_LEVEL_TEXTS = LEVELS;
export const PATTERN_PRACTICE_TEXTS = PRACTICE;

const task: PatternMemoryTask = {
  key: 'desen-hatirlama',
  kind: 'pattern_memory',
  name: 'Desen Hatırlama',
  measures: 'Kısa bir süre gösterilen bir deseni akılda tutabilmeyi, yani kısa süreli görsel belleği ölçer.',
  instructions: [
    'Ekranda kareli bir tablo göreceksin; karelerin bazıları koyu renkli (dolu) olacak.',
    'Desen 3 saniye görünecek, sonra kaybolacak. Ardından boş tabloda, dolu olan karelere dokunarak aynı deseni yap.',
    'Desenler giderek büyüyecek. Hatırlamadığın bir desende “Hatırlamıyorum” düğmesine basabilirsin.',
  ],
  showMs: 3000,
  practice: PRACTICE.map((p, i) => parsePattern(`dhp${i + 1}`, p)),
  levels: LEVELS.map(([cells, items]) => ({ cells, items: items.map((p, k) => parsePattern(`dh${String(cells).padStart(2, '0')}${'abc'[k]}`, p)) })),
};

const MIN = LEVELS[0][0];
const MAX = LEVELS[LEVELS.length - 1][0];

export const desenHatirlama: TaskInstrument = {
  slug: 'desen-hatirlama',
  version: 1,
  engine: 'tasks',
  name: 'Desen Hatırlama',
  shortName: 'Desen hatırlama',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 8,
  sortOrder: 59.3,
  tagline: 'Kısa bir süre gösterilen kareli bir deseni akılda tutabilmeyi, yani kısa süreli görsel belleği ölçer.',
  description: `Bu test, kısa bir süre gösterilen bir deseni akılda tutabilmeyi, yani kısa süreli görsel belleği ölçer. Kareli bir tabloda bazı kareler 3 saniye boyunca koyu renkli gösterilir; desen kaybolunca boş tabloda aynı kareler işaretlenir. Desenler ${MIN} dolu kareden ${MAX} dolu kareye kadar büyür; her büyüklükte üç desen vardır ve bir büyüklükteki üç desenin hiçbiri doğru hatırlanamayınca test biter. Bütün desenler Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; tam doğru hatırlanan en büyük deseni, desenler büyüdükçe sonucun nasıl değiştiğini, yanlış hatırlanan desenlerde nelerin karıştığını ve desenlere nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.`,
  intro: {
    title: 'Deseni aklında tut',
    paragraphs: [
      'Birazdan kareli bir tabloda bazı karelerin koyu renkli olduğu desenler göreceksin. Her desen 3 saniye görünecek; sonra boş tabloda aynı kareleri işaretleyeceksin.',
      `Önce iki alıştırma deseni var. Ardından desenler ${MIN} dolu kareden başlayıp giderek büyür; bir büyüklükteki üç desenin hiçbirini doğru hatırlayamadığında test biter. Bu yüzden testin süresi kişiden kişiye değişir; çoğu kişi için 5–10 dakikadır.`,
      'Sessiz bir yerde, kâğıt kalem kullanmadan ve dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır. Desen gösterilirken başka bir uygulamaya geçersen aynı desen yeniden gösterilir.',
    ],
  },
  scales: [
    { key: 'dh_aralik', name: 'En büyük doğru desen', plain: `Bütün kareleriyle doğru hatırlanan en büyük desendeki dolu kare sayısı (${MIN} ile ${MAX} arası).` },
    {
      key: 'dh_desen',
      name: 'Doğru hatırlanan desenler',
      plain: 'Gösterilen desenlerin kaç tanesinin bütün kareleriyle doğru hatırlandığı ve desenler büyüdükçe bunun nasıl değiştiği.',
    },
    {
      key: 'dh_hata',
      name: 'Hata türleri',
      plain: 'Yanlış hatırlanan desenlerde karelerin unutulup unutulmadığı, desende olmayan kareler işaretlenip işaretlenmediği ve yanlış karelerin doğru yerin hemen yanında olup olmadığı.',
    },
    { key: 'dh_calisma', name: 'Çalışma biçimi', plain: 'Desenleri işaretlemeye ne kadar zaman ayrıldığı ve “Hatırlamıyorum” düğmesinin ne kadar kullanıldığı.' },
  ],
  tasks: [task],
  science: {
    basedOn: `Görsel desen aralığı (pattern span) görevleri: kareli bir tabloda karelerin yaklaşık yarısının dolu olduğu bir desen kısa bir süre gösterilir, ardından aynı boyda boş bir tabloda dolu kareler işaretlenir. Rastgele doldurulmuş kareli desenler görsel bellek araştırmalarında 1970’lerden beri kullanılır (Phillips, 1974). Della Sala ve arkadaşlarının Görsel Desenler Testi’nde (Visual Patterns Test) desenler 2 × 2’lik bir tabloda 2 dolu kareden 5 × 6’lık bir tabloda 15 dolu kareye kadar büyür, her büyüklükte üç desen vardır, her desen 3 saniye gösterilir ve puan, doğru hatırlanan en büyük desendeki dolu kare sayısıdır; bu sayıya desen aralığı denir (Della Sala ve ark., 1999). Bu testte de her desen 3 saniye gösterilir; desenler 2 × 3’lük bir tabloda ${MIN} dolu kareden 5 × 6’lık bir tabloda ${MAX} dolu kareye kadar büyür, her büyüklükte üç desen vardır ve puan aynı biçimde hesaplanır. Bir büyüklükteki üç desenin hiçbiri tam doğru hatırlanmazsa test biter (aynı çalışmadaki deneyde de test, hiç doğru cevap verilmeyen düzeyde bitirilmiştir). Bütün desenler ve tablo boyları Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari testin desenleri, puan düzeltmeleri ya da normları kullanılmaz.`,
    whatItMeasures:
      'Kısa süreli görsel belleği, yani bir şeklin ya da desenin görünüşünü kısa bir süre akılda tutabilmeyi ölçer. Bu tür görevler, yerlerin sırayla gösterildiği görevlerden (ör. kutuların sırayla yandığı kutu dizisi) farklı bir beceriyi ölçmeye yöneliktir: tek bir bakışta görülen, hareketsiz bir görüntüyü akılda tutmak. Della Sala ve arkadaşlarının çalışmasında sağlıklı yetişkinlerde iki tür görevin sonuçları arasındaki ilişki zayıf bulunmuştur (r = .27 ve .35; iki görevin ortak payı yalnızca yaklaşık %7–12). Aynı çalışmada 16 üniversite öğrencisiyle yapılan bir deneyde, desen ile hatırlama arasındaki 10 saniyede soyut bir resme bakmak desen hatırlamayı, görmeden dokunarak bir sırayı izlemek ise kutu dizisini daha çok bozmuştur (Della Sala ve ark., 1999). Çocuklarla yapılan çalışmalar da desenleri hatırlamanın, hareket ya da yol sıralarını hatırlamaktan ayrı bir gelişim izlediğini düşündürür (Logie ve Pearson, 1997; Pickering ve ark., 2001). Desenlere sözcükle ad vermek hatırlamayı kolaylaştırabilir: 60 yetişkinle yapılan bir çalışmada kolay ad verilen desenlerle ölçülen ortalama desen aralığı 10,1, zor ad verilen desenlerle 8,7 bulunmuş ve yeni desenlerin bu açıdan denetlenmesi önerilmiştir (Brown ve ark., 2006). 40 yetişkinle yapılan başka bir çalışmada da kolay ad verilen desenler daha iyi hatırlanmış; görsel ve sözel yolları birlikte kullanmanın ve görüntüye bir anlam yüklemenin görsel belleğe yardım ettiği sonucuna varılmıştır (Brown ve Wesley, 2013). Bu yüzden bu testin desenleri, kolay ad verilebilecek biçimlerden (tamamen dolu ya da boş satırlar, büyük tablolarda tamamen dolu ya da boş sütunlar, uzun düz çizgiler, simetrik desenler, tek parça büyük şekiller) kaçınılarak seçilmiştir. Bu test bir zekâ puanı (IQ) vermez; sonuç, kısa süreli görsel belleğin bugünkü durumunu anlatır.',
    turkishVersion: 'Özgün test. Desenler ve yönergeler Ölçekhane tarafından hazırlanmıştır. Türkiye’de bu tür bir desen görevinin kullanıldığı yayımlanmış bir çalışmaya ulaşılamadı.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Görsel Desenler Testi’nin iki eş formu (iki ayrı desen takımı) arasındaki ilişki 13–92 yaş arası 194 kişide .81, yaş ortalaması 29 olan 74 sağlıklı yetişkinde .77 bulunmuştur; test bir hafta arayla yeniden uygulandığında iki sonuç arasındaki ilişki 50 kişide .75 ve .73’tür (Della Sala ve ark., 1999). 3. ve 4. sınıftaki 162 çocukla yapılan bir çalışmada, bu testten uyarlanmış bir desen görevinin iç tutarlılığı (Cronbach α) .84 bulunmuştur (Mammarella ve ark., 2008). Bu değerler o görevlere aittir; bu test için geçerli sayılamaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, tam doğru hatırlanan en büyük desenle ve desen büyüklüklerine göre doğru hatırlanan desenlerle anlatılır. Zekâ puanı (IQ) verilmez. Desen hatırlama çocuklukta gelişip yetişkinlikte yaşla azaldığı için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Bir araştırmada desen aralığı 5 ile 11 yaş arasında hızla artmış ve 11 yaşına gelindiğinde yetişkinlerin düzeyine ulaşmıştır (Wilson ve ark., 1987). Yetişkinlikte ise yaş ilerledikçe azalır: 13–92 yaş arası 345 sağlıklı kişiyle yapılan çalışmada desen aralığı ile yaş arasındaki ilişki r = −.55 bulunmuştur (Della Sala ve ark., 1999). İnternette çözülen benzer bir desen görevinde de (yaklaşık 95 bin kişi) ortalama puan genç yetişkinlerden yaşlılara doğru düşmüştür: 18–20 yaşta 10 üzerinden 5,5, 81 yaş ve üstünde 2,7 (Johnson ve ark., 2010). Desenler koyu ve açık karelerden oluşur, renk ayırt etmeyi gerektirmez; gözlük kullanan kişi gözlüğüyle çözmelidir.',
    license: 'Özgün test. Desenler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir; görevin düzeni bilimsel yayınlarda tanımlanan desen aralığı düzenidir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; bellek ya da öğrenme sorunları gibi durumlar ancak uzman değerlendirmesiyle anlaşılabilir.',
      'Görsel belleğin yalnızca bir yönünü (3 saniye gösterilen hareketsiz bir deseni hemen ardından hatırlamayı) ölçer. Yerlerin sırasını hatırlamak, uzun süreli bellek ya da günlük hayattaki unutkanlık hakkında bilgi vermez.',
      'Her büyüklükte yalnızca üç desen vardır ve bir büyüklükteki üç desenin hiçbiri doğru hatırlanamayınca test biter. Bu yüzden o günkü dikkatteki kısa bir dalgınlık sonucu düşürebilir; sonuç kabaca fikir verir.',
      'Desenlere sözcükle ad vermek hatırlamayı kolaylaştırabilir (Brown ve ark., 2006). Desenler, kolay ad verilebilecek biçimlerden kaçınılarak kurallarla seçildi; ama kişilere desenlere ad verdirilerek denetlenmedi, bazı desenler yine de kolay adlandırılabilir.',
      'Sonuç; o günkü yorgunluk, isteklilik, ortamdaki gürültü ve cihazdan etkilenebilir (telefonda kareler küçük görünür). Test yeniden çözüldüğünde desenleri hatırlamak sonucu yükseltebilir.',
      'Bellek görevleriyle yapılan alıştırmalar alıştırılan göreve benzer görevlerde sonucu kısa vadede yükseltebilir; ama bunun zekâ testlerine ve başka becerilere yansıdığına dair güvenilir bir kanıt yoktur (Melby-Lervåg ve Hulme, 2013; Melby-Lervåg ve ark., 2016). Bu görevi tekrar tekrar çözmenin başka becerileri geliştireceği beklenmemelidir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Brown, L. A., Forbes, D. ve McConnell, J. (2006). Limiting the use of verbal coding in the Visual Patterns Test. Quarterly Journal of Experimental Psychology, 59(7), 1169–1176.',
        url: 'https://doi.org/10.1080/17470210600665954',
      },
      {
        text: 'Brown, L. A. ve Wesley, R. (2013). Visual working memory is enhanced by mixed strategy use and semantic coding. Journal of Cognitive Psychology, 25(3), 328–338.',
        url: 'https://doi.org/10.1080/20445911.2013.773004',
      },
      {
        text: 'Della Sala, S., Gray, C., Baddeley, A., Allamano, N. ve Wilson, L. (1999). Pattern span: A tool for unwelding visuo-spatial memory. Neuropsychologia, 37(10), 1189–1199.',
        url: 'https://doi.org/10.1016/S0028-3932(98)00159-6',
      },
      {
        text: 'Johnson, W., Logie, R. H. ve Brockmole, J. R. (2010). Working memory tasks differ in factor structure across age cohorts: Implications for dedifferentiation. Intelligence, 38(5), 513–528.',
        url: 'https://doi.org/10.1016/j.intell.2010.06.005',
      },
      {
        text: 'Logie, R. H. ve Pearson, D. G. (1997). The inner eye and the inner scribe of visuo-spatial working memory: Evidence from developmental fractionation. European Journal of Cognitive Psychology, 9(3), 241–257.',
        url: 'https://doi.org/10.1080/713752559',
      },
      {
        text: 'Mammarella, I. C., Pazzaglia, F. ve Cornoldi, C. (2008). Evidence for different components in children’s visuospatial working memory. British Journal of Developmental Psychology, 26(3), 337–355.',
        url: 'https://doi.org/10.1348/026151007X236061',
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
        text: 'Phillips, W. A. (1974). On the distinction between sensory storage and short-term visual memory. Perception & Psychophysics, 16(2), 283–290.',
        url: 'https://doi.org/10.3758/BF03203943',
      },
      {
        text: 'Pickering, S. J., Gathercole, S. E., Hall, M. ve Lloyd, S. A. (2001). Development of memory for pattern and path: Further evidence for the fractionation of visuo-spatial memory. Quarterly Journal of Experimental Psychology, 54A(2), 397–420.',
        url: 'https://doi.org/10.1080/713755973',
      },
      {
        text: 'Wilson, J. T. L., Scott, J. H. ve Power, K. G. (1987). Developmental differences in the span of visual memory for pattern. British Journal of Developmental Psychology, 5(3), 249–255.',
        url: 'https://doi.org/10.1111/j.2044-835X.1987.tb01060.x',
      },
    ],
  },
};
