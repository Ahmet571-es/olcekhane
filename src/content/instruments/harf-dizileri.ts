import { TURKISH_ALPHABET, type LetterSeriesItem, type LetterSeriesPracticeItem, type LetterSeriesRule, type LetterSeriesTask, type TaskInstrument } from '@/lib/instruments/types';

/**
 * Harf dizileri: Türk alfabesiyle yazılmış, bir kurala göre ilerleyen harf dizisindeki eksik harfi bulmak. Görev düzeni
 * Thurstone'un harf dizilerine ve Simon ile Kotovsky'nin (1963) dizi tamamlama çalışmalarına dayanır; bütün diziler
 * Ölçekhane'nindir (hiçbir testin dizisi kullanılmadı).
 *
 * Her sorunun tek doğru cevabı olduğu tests/harf-dizileri.test.ts'te bağımsız bir çözücüyle (tests/helpers/letter-solver.ts)
 * denetlenir: dizinin bilinen harflerine uyan her kural (her biri sabit adımla ilerleyen 1–6 harflik gruplar, adımları
 * düzenli büyüyen ya da küçülen diziler ve bunların iç içe geçmiş ikilisi) aynı eksik harfi vermelidir. Diziler alfabenin
 * sonundan başına (Z'den A'ya) dolanmaz.
 *
 * Tuzaklar: daha basit bir kuralla bulunan yanlış harfler. Ya dizinin yalnızca bir bölümüne uyan bir kural (son harfin
 * alfabedeki sıradakini yazmak, son adımı aynen sürdürmek, iç içe iki dizide öteki dizinin sıradaki harfini yazmak) ya da
 * kuralın bir parçasını atlamak (bir grubu değiştirmeden tekrarlamak). Raporda yanlışların ne kadarının böyle olduğu
 * anlatılır; testte her tuzağın bu yollardan biriyle bulunduğu denetlenir. Doğru cevaplar birbirinden farklıdır ("hep aynı
 * harfi seçme" doğru cevaplarla karışmasın) ve sabit adım dışındaki sorularda son harfin alfabedeki sıradakini yazmak
 * doğru cevabı vermez.
 */
interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  rule: LetterSeriesRule;
  /** Harfler boşlukla ayrılır; eksik harf "_". */
  terms: string;
  answer: string;
  traps: string[];
}

const SPECS: Spec[] = [
  // 1. düzey: alfabede birer harf ilerleme, iki harfin sırayla tekrarlanması, her harfin iki kez yazılması.
  { key: 'hd01', level: 1, rule: 'next', terms: 'A B C Ç D _', answer: 'E', traps: [] },
  { key: 'hd02', level: 1, rule: 'repeat', terms: 'R B R B R B R _', answer: 'B', traps: ['S'] },
  { key: 'hd03', level: 1, rule: 'repeat', terms: 'D D E E F F G _', answer: 'G', traps: ['Ğ'] },
  { key: 'hd04', level: 1, rule: 'next', terms: 'P R S Ş T _', answer: 'U', traps: [] },
  // 2. düzey: geriye doğru ya da birer harf atlayarak ilerleme, araya hep aynı harfin girmesi, ikişer harflik gruplar, iç
  // içe iki basit dizi.
  { key: 'hd05', level: 2, rule: 'next', terms: 'Z Y V Ü U _', answer: 'T', traps: ['Ü'] },
  { key: 'hd06', level: 2, rule: 'next', terms: 'E G H İ K _', answer: 'M', traps: ['L'] },
  { key: 'hd07', level: 2, rule: 'repeat', terms: 'M A M B M C M _', answer: 'Ç', traps: ['N', 'C'] },
  { key: 'hd08', level: 2, rule: 'group', terms: 'J K M N Ö P _', answer: 'S', traps: ['R'] },
  { key: 'hd09', level: 2, rule: 'interleaved', terms: 'A K B L C M Ç _', answer: 'N', traps: ['D'] },
  // 3. düzey: ikişer harf atlama, adımları büyüyen dizi, ortada eksik harf, farklı adımlı iç içe diziler, üç harflik gruplar.
  { key: 'hd10', level: 3, rule: 'next', terms: 'C E Ğ İ L _', answer: 'O', traps: ['M'] },
  { key: 'hd11', level: 3, rule: 'growing', terms: 'D E G I L _', answer: 'P', traps: ['Ö', 'M'] },
  { key: 'hd12', level: 3, rule: 'repeat', terms: 'Z A Y A V A _ A', answer: 'Ü', traps: ['V', 'B'] },
  { key: 'hd13', level: 3, rule: 'interleaved', terms: 'B M Ç N E O G _', answer: 'Ö', traps: ['H', 'Ğ'] },
  { key: 'hd14', level: 3, rule: 'group', terms: 'F G Z G Ğ Z Ğ H Z _', answer: 'H', traps: ['Ğ'] },
  // 4. düzey: geriye doğru ikişer harf atlama, geriye doğru büyüyen adımlar, biri ileri biri geri giden iç içe diziler,
  // tekrar eden harfli üç harflik gruplar ve geriye doğru sıralı gruplar.
  { key: 'hd15', level: 4, rule: 'next', terms: 'Z Ü Ş P N _', answer: 'K', traps: ['O'] },
  { key: 'hd16', level: 4, rule: 'growing', terms: 'Y V U S O _', answer: 'J', traps: ['K', 'Ö'] },
  { key: 'hd17', level: 4, rule: 'interleaved', terms: 'B Z Ç V E U G _', answer: 'Ş', traps: ['Ğ', 'H'] },
  { key: 'hd18', level: 4, rule: 'group', terms: 'A B B A C C A Ç Ç A _', answer: 'D', traps: ['Ç', 'B'] },
  { key: 'hd19', level: 4, rule: 'group', terms: 'D Ç C E D Ç F E D G _', answer: 'F', traps: ['E', 'Ğ'] },
  // 5. düzey: adımları her seferinde büyüyen diziler (tek başına ya da iç içe), farklı adımlı iç içe diziler, dört harflik
  // gruplar, iki dizinin birlikte ilerlediği üç harflik gruplar.
  { key: 'hd20', level: 5, rule: 'growing', terms: 'A C E H L _', answer: 'R', traps: ['P', 'M'] },
  { key: 'hd21', level: 5, rule: 'interleaved', terms: 'A Z C Ü D Ş F P _', answer: 'Ğ', traps: ['N', 'R'] },
  { key: 'hd22', level: 5, rule: 'group', terms: 'A B Z Y B C Y V C Ç _', answer: 'V', traps: ['Y', 'D'] },
  { key: 'hd23', level: 5, rule: 'group', terms: 'A O A B N B C M C Ç _', answer: 'L', traps: ['M', 'D'] },
  { key: 'hd24', level: 5, rule: 'growing', terms: 'A Z B Y Ç V F Ü _', answer: 'I', traps: ['H', 'V'] },
];

const letters = (s: string): (string | null)[] => s.split(' ').map((x) => (x === '_' ? null : x));

const PRACTICE: LetterSeriesPracticeItem[] = [
  {
    key: 'hdp1',
    level: 1,
    rule: 'next',
    terms: letters('K L M N O _'),
    answer: 'Ö',
    explain:
      'Her harf alfabede bir öncekinin hemen arkasından geliyor: K, L, M, N, O. Türk alfabesinde O’dan sonra Ö gelir; bu yüzden eksik harf Ö. Harflerin sırasını tuş takımında görebilirsin.',
  },
  {
    key: 'hdp2',
    level: 1,
    rule: 'repeat',
    terms: letters('A K B K _ K Ç K'),
    answer: 'C',
    explain:
      'Harflerden biri hep K. Aradaki harfler alfabede sırayla ilerliyor: A, B, ?, Ç. B ile Ç arasında C var; bu yüzden eksik harf C. Eksik harf bazen dizinin ortasında olabilir.',
  },
];

export const LETTER_SERIES_SPECS: readonly Spec[] = SPECS;

const series: LetterSeriesTask = {
  key: 'harf-dizileri',
  kind: 'letter_series',
  name: 'Harf Dizileri',
  measures: 'Bir kurala göre ilerleyen harf dizisinde kuralı bulup eksik harfi seçebilmeyi (harflerle akıl yürütme) ölçer.',
  instructions: [
    'Her soruda bir kurala göre ilerleyen bir harf dizisi göreceksin. Dizideki harflerden biri eksik: çoğunlukla sonuncusu, bazen ortadaki bir harf.',
    'Dizilerde Türk alfabesinin 29 harfi kullanılır. Harflerin nasıl değiştiğine bak ve kuralı bul. Sonra eksik harfi ekrandaki harf tuşlarından (ya da klavyeyle) seç ve “Cevabı ver” düğmesine bas. Tuşlar alfabe sırasıyla dizilmiştir.',
    'Sorular kolaydan zora doğru gider; sona doğru zorlanman olağandır. Bulamadığın bir soruda “Bilmiyorum” diyebilirsin. Süre sınırı yok; kâğıt ve kalem kullanabilirsin.',
    'Önce doğru cevabı gösterilen iki alıştırma sorusu çözeceksin.',
  ],
  practice: PRACTICE,
  items: SPECS.map(({ key, level, rule, terms }): LetterSeriesItem => ({ key, level, rule, terms: letters(terms) })),
  answers: SPECS.map((s) => s.answer),
  traps: SPECS.map((s) => s.traps),
  levels: [
    { level: 1, name: '1. düzey', plain: 'Alfabede birer harf ilerleyen, iki harfin sırayla tekrarlandığı ya da her harfin iki kez yazıldığı dizileri sürdürmek.' },
    {
      level: 2,
      name: '2. düzey',
      plain: 'Geriye doğru ya da birer harf atlayarak ilerleyen dizileri, araya hep aynı harfin girdiği dizileri, ikişer harflik grupları ve iç içe geçmiş iki basit diziyi çözmek.',
    },
    {
      level: 3,
      name: '3. düzey',
      plain: 'İkişer harf atlayarak ya da her seferinde bir harf daha fazla atlayarak ilerleyen dizileri, farklı adımlarla ilerleyen iç içe iki diziyi ve üç harflik grupları çözmek, dizinin ortasındaki eksik harfi bulmak.',
    },
    {
      level: 4,
      name: '4. düzey',
      plain: 'Geriye doğru birkaç harf atlayan ya da geriye doğru giderek daha çok harf atlayan dizileri, biri ileri biri geri giden iç içe iki diziyi ve üç harflik grupları çözmek.',
    },
    {
      level: 5,
      name: '5. düzey',
      plain: 'Adımları her seferinde büyüyen dizileri (tek başına ya da başka bir diziyle iç içe), farklı adımlarla ilerleyen iç içe dizileri ve iki dizinin birlikte ilerlediği üç ve dört harflik grupları çözmek.',
    },
  ],
  rapidMs: 2500,
};

export const harfDizileri: TaskInstrument = {
  slug: 'harf-dizileri',
  version: 1,
  engine: 'tasks',
  name: 'Harf Dizileri',
  shortName: 'Harf dizileri',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 10,
  sortOrder: 49.6,
  tagline: 'Bir kurala göre ilerleyen harf dizilerinde kuralı bulup eksik harfi seçebilmeyi, yani harflerle akıl yürütebilmeyi ölçer.',
  description: `Bu test, akıl yürütmeyi ölçmek için uzun zamandır kullanılan “harf dizisi” sorularına dayanır: bir kurala göre ilerleyen dizideki eksik harfi bulmak gerekir. Diziler Türk alfabesinin ${TURKISH_ALPHABET.length} harfiyle yazılmıştır; cevap, alfabe sırasıyla dizilmiş harf tuşlarından seçilir. Sorular seçenekli değildir; bu yüzden tahminle doğru bulmak çok zordur. Sorular kolaydan zora doğru beş düzeyde ilerler. Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi tür kuralların daha kolay bulunduğunu, yanlış cevapların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.`,
  intro: {
    title: 'Eksik harfi bul',
    paragraphs: [
      'Birazdan bir kurala göre ilerleyen harf dizileri göreceksin. Her dizide bir harf eksik; kuralı bulup eksik harfi seçeceksin.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler. Diziler Türk alfabesiyle yazılmıştır; harflerin sırası ekrandaki tuşlarda görünür. Süre sınırı yok. Yanında kâğıt ve kalem bulunabilir.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'hd_dogru', name: 'Doğru cevaplar', plain: 'Kuralı bulup eksik harfin doğru seçildiği soruların sayısı.' },
    { key: 'hd_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'hd_kural', name: 'Kural türleri', plain: 'Hangi tür kuralların daha kolay, hangilerinin daha zor bulunduğu.' },
    { key: 'hd_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı, kaç soruda “Bilmiyorum” dendiği ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [series],
  science: {
    basedOn: `Harf dizisi soruları: bir kurala göre ilerleyen harf dizisindeki eksik harfi bulmak. Bu soru türü uzun zamandır akıl yürütmeyi ölçmek için kullanılır. Simon ve Kotovsky (1963), insanların bir dizinin kuralını nasıl bulduğunu incelerken Thurstone’un harf dizisi sorularını kullanmış ve katılımcılardan boşluğa doğru harfi yazmalarını istemiştir. Yetişkinleri yıllarca izleyen bir çalışmada da akıl yürütme, bir harf dizisinde sıradaki harfi bulmayı isteyen sorularla ölçülmüştür (Caskie, Schaie ve Willis, 1999). Bu testin dizileri Türk alfabesinin ${TURKISH_ALPHABET.length} harfiyle Ölçekhane tarafından özgün olarak yazılmıştır; hiçbir testin dizisi, puanlama kuralı ya da normu kullanılmaz. Cevaplar seçeneklerden seçilmez; alfabe sırasıyla dizilmiş ${TURKISH_ALPHABET.length} harf tuşundan biri seçilir.`,
    whatItMeasures:
      'Harflerle akıl yürütmeyi, yani bir dizideki harfler arasındaki ilişkiyi bulup kuralı sürdürebilmeyi ölçer. Simon ve Kotovsky’ye (1963) göre bu tür dizileri çözen kişi, alfabenin ileri ve geri sırasını bilir; harfler arasında “aynı harf” ve “sıradaki harf” gibi ilişkileri arar, dizinin kaç harfte bir tekrarlandığını bulur ve kuralı kısa bir “dizi tarifi” olarak aklında tutar. Araştırmacılar, kolay soruların tarifinin daha kısa olduğunu ve zorluğun, dizinin kaç harfte bir tekrarlandığından çok, aynı anda alfabede izlenmesi gereken yer sayısıyla ilgili göründüğünü bildirmiş, ama bunu kesin bir sonuç saymamıştır. Kotovsky ve Simon’un (1973; aktaran Holzman, Glaser ve Pellegrino, 1976) lise öğrencilerinden elde ettiği verilerde dizinin tarifi uzadıkça hatalar artmıştır (ikisi arasındaki ilişki güçlüdür: sıra korelasyonu .80). Bu araştırmacıların gözlemlerinde en sık hata, doğru kural bulunduktan sonra onu sürdürürken yapılmıştır. Aynı harfin tekrarlandığını fark etmek, sıradaki harfi bulmaktan; sıradaki harfi bulmak da geriye doğru gitmekten daha kolaydır (Glaser ve Pellegrino, 1979). Bu yüzden bu testte sorular; harfler geriye gittikçe, atlanan harf sayısı ve grup uzunluğu arttıkça ve aynı anda izlenmesi gereken dizi sayısı çoğaldıkça zorlaşacak biçimde sıralanmıştır; bu sıra henüz veriyle denetlenmedi. Bu soruların gerektirdiği bilgi büyük ölçüde alfabenin sırasıdır (Glaser ve Pellegrino, 1979); alfabe dizilerinde akılda tutulması gereken bilginin miktarı zorluğu önemli ölçüde artırıyor görünmektedir (Kotovsky ve Simon, 1973; aktaran LeFevre ve Bisanz, 1986). Bu testte harf tuşları alfabe sırasıyla dizildiği için alfabeyi ezbere bilmek gerekmez; yine de alfabede rahatça ileri geri sayabilmek işi kolaylaştırır.',
    turkishVersion: 'Özgün test. Diziler Türk alfabesinin 29 harfiyle (Ç, Ğ, I, İ, Ö, Ş ve Ü dahil) yazılmıştır; yönergeler Türkçedir. Kısa bir taramada, Türkiye’de harf dizisi tamamlama sorularının kullanıldığı yayımlanmış bir çalışmaya ulaşılamadı.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sorular; kural türüne, grup uzunluğuna ve adımın büyüklüğüne göre kolaydan zora beş düzeye ayrılmıştır. Bu sıralama Ölçekhane’nin tasarımıdır; soruların bu testteki gerçek zorluk sırası henüz veriyle denetlenmedi. Her sorunun tek doğru cevabı olduğu bir bilgisayar programıyla denetlenmiştir: program eksik yere alfabenin 29 harfini tek tek koyar ve diziyi açıklayabilecek kuralları (her biri sabit adımla ilerleyen 1–6 harflik gruplar, adımları düzenli büyüyen ya da küçülen diziler) dener; dizinin bilinen harflerine uyan her kural aynı harfi verir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki sorularda ve hangi tür kurallarda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Akıl yürütme becerisi çocuklukta hızla, gençlikte daha yavaş gelişir; gençlik yıllarının sonuna doğru artık pek değişmez (Ferrer, O’Hare ve Bunge, 2009). Harf dizilerinde alfabe bilgisi de rol oynar. Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Harf dizileri üzerine bir araştırmanın 3. ve 5. sınıftan yalnızca 12 çocukla yapılan ikinci deneyinde, eğitim almadan dört kez test çözmek 5. sınıflarda sonucu eğitim kadar yükseltmiş, 3. sınıflarda yükseltmemiştir; araştırmacılar küçük çocukların ilerlemesi için açık bir anlatımın gerekli göründüğünü yazmıştır (Holzman, Glaser ve Pellegrino, 1976). Bu testte alıştırma sorularından sonra doğru cevabın nedeni anlatılır. Yetişkinleri yıllarca izleyen bir çalışmada, harf dizileriyle ölçülen akıl yürütmenin 25 ile 53 yaş arasında ortalama olarak hemen hemen aynı kaldığı, 60 yaşına kadar biraz azaldığı, sonra daha hızlı azaldığı bildirilmiştir; çalışma 25 ile 81 yaş arasını kapsar (Caskie, Schaie ve Willis, 1999). Telefonla da çözülebilir.',
    license: 'Özgün test. Diziler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir; görevin düzeni bilimsel yayınlarda tanımlanan harf dizisi düzenidir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Akıl yürütmenin yalnızca harf dizileriyle yapılan yönünü ölçer ve sonuç alfabe bilgisiyle de ilişkilidir (Glaser ve Pellegrino, 1979). Şekillerle ve sayılarla akıl yürütme, bilgi, bellek ve hız gibi öteki beceriler hakkında bilgi vermez.',
      'Sonuç; o günkü yorgunluk, isteklilik ve dikkatten etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu tür soruları çözme yolları öğretilebilir ve öğrenmek sonucu yükseltebilir. Harflerin arasındaki ilişkileri ve dizinin kaç harfte bir tekrarlandığını aramayı yaklaşık dört kısa oturumda öğrenen çocukların hataları, eğitim almayanlarınkinden daha çok azalmıştır (yaklaşık %32’ye karşı %13; Holzman, Glaser ve Pellegrino, 1976). 65–91 yaş arası 699 kişiyle yapılan bir çalışmada, dizi çözme yollarını öğreten 10 oturumluk bir eğitim harf dizilerindeki sonucu belirgin biçimde yükseltmiş ve bu kazanç 5 yıl boyunca sürmüştür; ama günlük hayattaki işleri ölçen testlerin yalnızca birinde küçük bir etki görülmüştür (Willis ve Caskie, 2013). Çocuklara örüntü ve kural bulmayı öğreten 74 eğitim deneyini birleştiren bir çalışmada ise bu eğitimlerin zekâ testlerindeki sonuçlara orta büyüklükte, okuldaki öğrenmeye biraz daha büyük bir etkisi bulunmuştur (Klauer ve Phye, 2008).',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Simon, H. A. ve Kotovsky, K. (1963). Human acquisition of concepts for sequential patterns. Psychological Review, 70(6), 534–546.',
        url: 'https://doi.org/10.1037/h0043901',
      },
      {
        text: 'Holzman, T. G., Glaser, R. ve Pellegrino, J. W. (1976). Process training derived from a computer simulation theory. Memory & Cognition, 4(4), 349–356.',
        url: 'https://doi.org/10.3758/BF03213188',
      },
      {
        text: 'Glaser, R. ve Pellegrino, J. W. (1979). Cognitive process analysis of aptitude: The nature of inductive reasoning tasks (LRDC-1979/24). University of Pittsburgh, Learning Research and Development Center.',
        url: 'https://files.eric.ed.gov/fulltext/ED198175.pdf',
      },
      {
        text: 'LeFevre, J.-A. ve Bisanz, J. (1986). A cognitive analysis of number-series problems: Sources of individual differences in performance. Memory & Cognition, 14(4), 287–298.',
        url: 'https://doi.org/10.3758/BF03202506',
      },
      {
        text: 'Caskie, G. I. L., Schaie, K. W. ve Willis, S. L. (1999, Kasım). Individual differences in the rate of change in cognitive abilities during adulthood [Bildiri]. Gerontological Society of America yıllık toplantısı, San Francisco, CA.',
        url: 'https://sls.psychiatry.uw.edu/wp-content/uploads/2020/03/Individual-differences_99.pdf',
      },
      {
        text: 'Willis, S. L. ve Caskie, G. I. L. (2013). Reasoning training in the ACTIVE study: How much is needed and who benefits? Journal of Aging and Health, 25(8 Suppl.), 43S–64S.',
        url: 'https://doi.org/10.1177/0898264313503987',
      },
      {
        text: 'Klauer, K. J. ve Phye, G. D. (2008). Inductive reasoning: A training approach. Review of Educational Research, 78(1), 85–123.',
        url: 'https://doi.org/10.3102/0034654307313402',
      },
      {
        text: 'Ferrer, E., O’Hare, E. D. ve Bunge, S. A. (2009). Fluid reasoning and the developing brain. Frontiers in Neuroscience, 3(1), 46–51.',
        url: 'https://doi.org/10.3389/neuro.01.003.2009',
      },
    ],
  },
};
