import type { TaskInstrument, TowerPracticeProblem, TowerProblem, TowerTask } from '@/lib/instruments/types';

/**
 * Planlama: kule görevi (Londra Kulesi düzeni; Shallice, 1982). Üç çubuk (soldaki 3, ortadaki 2, sağdaki 1 top alır) ve
 * üç renkli top (K kırmızı, M mavi, S sarı). Kişi alttaki tahtadaki topları, en az hamleyle üstteki hedef düzene getirir.
 * Bir seferde yalnızca bir top, yalnızca en üstteki top taşınır; yapılan hamle geri alınamaz. En az hamle sayısı ekranda
 * yazar; her problem için 1 dakika süre vardır (Shallice, 1982 ve Freiburg sürümündeki gibi; Unterrainer ve ark., 2019).
 *
 * Problemler Ölçekhane'nindir: bu düzendeki 36 top dizilişi arasından bilgisayarla seçildi. Her en az hamle sayısında
 * (3, 4, 5, 6 ve 7) dört problem vardır; problemler kısadan uzuna sıralanır. Her düzeyde hedeflerden biri üç topun aynı
 * çubukta durduğu kule, biri topların üç çubuğa birer birer dağıldığı düz dizilişi, ikisi iki ve bir toptan oluşan
 * dizilişlerdir (hedefin biçimi zorluğu etkiler: Berg ve ark., 2010; Kaller ve ark., 2011). Her düzeyde başlangıç ve hedef
 * dizilişlerin biçimleri değişir; yalnızca tek bir en kısa yolla çözülen problemlerle birden çok en kısa yolu olanlar
 * birlikte bulunur. 3 hamlelik problemlerin birinde her top doğrudan yerine taşınır, ötekilerde bir topun geçici olarak
 * başka bir yere konması gerekir (Kaller ve ark., 2008). Renkleri değiştirilince birbirinin aynısı ya da tersi (başlangıcı
 * ötekinin hedefi, hedefi ötekinin başlangıcı) olan iki problem yoktur; başlangıç dizilişleri birbirinden, hedef dizilişleri
 * birbirinden farklıdır ve art arda gelen iki problem ortak bir diziliş kullanmaz. Bu düzende 36 diziliş olduğu için bir
 * diziliş bir problemde başlangıç, başka bir problemde hedef olabilir.
 *
 * tests/planlama-kule-gorevi.test.ts bütün dizilişleri ve hamleleri bağımsız bir aramayla tarayarak en az hamle
 * sayılarını ve bu kuralları denetler (tests/helpers/tower-check.ts).
 */

const ITEMS: TowerProblem[] = [
  { key: 'kg01', start: ['', 'SM', 'K'], goal: ['MSK', '', ''], minMoves: 3 },
  { key: 'kg02', start: ['S', 'M', 'K'], goal: ['KS', 'M', ''], minMoves: 3 },
  { key: 'kg03', start: ['K', 'SM', ''], goal: ['M', 'SK', ''], minMoves: 3 },
  { key: 'kg04', start: ['M', 'K', 'S'], goal: ['S', 'K', 'M'], minMoves: 3 },
  { key: 'kg05', start: ['', 'MS', 'K'], goal: ['KM', 'S', ''], minMoves: 4 },
  { key: 'kg06', start: ['K', 'M', 'S'], goal: ['', 'SK', 'M'], minMoves: 4 },
  { key: 'kg07', start: ['K', 'MS', ''], goal: ['SMK', '', ''], minMoves: 4 },
  { key: 'kg08', start: ['MS', '', 'K'], goal: ['K', 'S', 'M'], minMoves: 4 },
  { key: 'kg09', start: ['SK', '', 'M'], goal: ['KM', '', 'S'], minMoves: 5 },
  { key: 'kg10', start: ['KMS', '', ''], goal: ['MK', 'S', ''], minMoves: 5 },
  { key: 'kg11', start: ['SM', 'K', ''], goal: ['MKS', '', ''], minMoves: 5 },
  { key: 'kg12', start: ['KSM', '', ''], goal: ['M', 'S', 'K'], minMoves: 5 },
  { key: 'kg13', start: ['K', 'S', 'M'], goal: ['M', 'KS', ''], minMoves: 6 },
  { key: 'kg14', start: ['', 'KS', 'M'], goal: ['K', 'M', 'S'], minMoves: 6 },
  { key: 'kg15', start: ['KS', '', 'M'], goal: ['SM', 'K', ''], minMoves: 6 },
  { key: 'kg16', start: ['MSK', '', ''], goal: ['KMS', '', ''], minMoves: 6 },
  { key: 'kg17', start: ['M', 'SK', ''], goal: ['S', 'M', 'K'], minMoves: 7 },
  { key: 'kg18', start: ['MK', '', 'S'], goal: ['S', 'MK', ''], minMoves: 7 },
  { key: 'kg19', start: ['', 'MK', 'S'], goal: ['MS', '', 'K'], minMoves: 7 },
  { key: 'kg20', start: ['M', 'S', 'K'], goal: ['SKM', '', ''], minMoves: 7 },
];

/**
 * Alıştırma: 2 hamlelik bir problem (iki top doğrudan yerine) ve 3 hamlelik bir problem (mavi top geçici olarak sağdaki
 * çubuğa konur). Süre sınırı yoktur; fazla hamle yapılırsa en az hamleli çözüm gösterilir.
 */
const PRACTICE: TowerPracticeProblem[] = [
  {
    key: 'kgp1',
    start: ['KMS', '', ''],
    goal: ['K', 'S', 'M'],
    minMoves: 2,
    solution: [
      [1, 2],
      [1, 3],
    ],
  },
  {
    key: 'kgp2',
    start: ['KM', 'S', ''],
    goal: ['KSM', '', ''],
    minMoves: 3,
    solution: [
      [1, 3],
      [2, 1],
      [3, 1],
    ],
  },
];

const task: TowerTask = {
  key: 'planlama-kule-gorevi',
  kind: 'tower',
  name: 'Kule Görevi',
  measures: 'Topları en az hamleyle hedef düzene getirerek planlamayı ölçer.',
  instructions: [
    'Alttaki tahtadaki topları, üstteki hedefle aynı düzene getireceksin.',
    'Bir seferde yalnızca bir top taşıyabilirsin; yalnızca en üstteki top alınabilir.',
    'Çubuklar farklı boydadır: soldaki 3, ortadaki 2, sağdaki 1 top alır.',
    'Her problemde en az kaç hamle gerektiği yazar; o kadar hamlede çözmeye çalış. Yaptığın hamle geri alınamaz; bir topu yeniden taşırsan yeni bir hamle sayılır.',
    'Topa dokunmadan önce çözümü kafanda düşün. Her problem için 1 dakika süren var.',
  ],
  practice: PRACTICE,
  items: ITEMS,
  limitMs: 60_000,
};

export const planlamaKuleGorevi: TaskInstrument = {
  slug: 'planlama-kule-gorevi',
  version: 1,
  engine: 'tasks',
  name: 'Planlama: Kule Görevi',
  shortName: 'Kule görevi',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 15,
  sortOrder: 49.95,
  tagline: 'Topları en az hamleyle hedef düzene getirerek planlamayı ölçer.',
  description:
    'Bu test, birkaç adımı başlamadan önce kafada sıraya koyabilmeyi, yani planlamayı ölçer. Üç çubuğa dizilmiş üç renkli top, en az hamleyle hedefteki düzene getirilir. 20 problem vardır; problemler 3 hamleden 7 hamleye doğru uzar. Problemler Ölçekhane tarafından özgün olarak seçilmiştir. Rapor; problemlerin kaçının en az hamlede çözüldüğünü, problemler uzadıkça sonucun nasıl değiştiğini ve başlamadan önce ne kadar düşünüldüğünü sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Topları hedef düzene getir',
    paragraphs: [
      'Birazdan üç çubuk ve üç renkli top göreceksin. Alttaki tahtadaki topları, üstteki hedefle aynı düzene getireceksin; bunu en az hamleyle yapmaya çalışacaksın.',
      `Test ${ITEMS.length} problemden oluşur; önce ${PRACTICE.length} alıştırma problemi var. Her problem için 1 dakika süre vardır. Problemler kısadan uzuna doğru gider.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'kg_dogru', name: 'En az hamlede çözülenler', plain: 'Problemlerin kaçının en az hamlede çözüldüğü.' },
    { key: 'kg_uzunluk', name: 'Problem uzadıkça', plain: 'Kısa ve uzun problemlerdeki sonuçların karşılaştırılması.' },
    { key: 'kg_cozum', name: 'Çözüm biçimi', plain: 'En az hamlede, fazla hamleyle çözülen ve süre içinde çözülemeyen problemler.' },
    { key: 'kg_plan', name: 'Başlamadan önce düşünme', plain: 'İlk hamleye başlamadan önce ne kadar düşünüldüğü.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Londra Kulesi düzeni (Shallice, 1982): üç çubuk (3, 2 ve 1 top alır) ve üç renkli top; başlangıçtaki diziliş en az hamleyle hedef dizilişe getirilir. Problemlerin en az hamle sayısına göre kısadan uzuna sıralanması, en az hamle sayısının ekranda gösterilmesi, her problem için 1 dakikalık süre ve en az hamlede çözülen problem sayısının asıl sonuç olması, bilgisayarlı Freiburg sürümündeki gibidir (Unterrainer ve ark., 2019). Problemler başka test setlerinden alınmamıştır; Ölçekhane tarafından, bu düzendeki 36 olası top dizilişi (Fimbel ve ark., 2009) arasından bilgisayarla seçilmiştir. Olası problem sayısı az olduğu için bazı problemler başka setlerdekilerle rastlantısal olarak aynı olabilir. Ticari ya da araştırma amaçlı test setlerinin puanlama kuralları ve normları kullanılmaz.',
    whatItMeasures:
      'Planlamayı, yani bir hedefe ulaşmak için gereken adımları başlamadan önce kafada sıraya koyabilmeyi ölçer. Planlama, davranışı bir amaca göre düzenleyen zihinsel becerilerin (yürütücü işlevlerin) en tipik örneklerinden biri sayılır (Schumacher ve ark., 2026). Problemin en az hamle sayısı arttıkça problemler belirgin biçimde zorlaşır (Kaller ve ark., 2012; Waid-Ebbs ve ark., 2026); aynı hamle sayısındaki problemlerin zorluğu da hedef dizilişin biçimine ve en kısa çözüm yollarının sayısına göre değişebilir (Berg ve ark., 2010; Kaller ve ark., 2011). Bu yüzden her hamle sayısında farklı biçimlerde dört problem vardır. Bazı problemler (bu testteki ilk problem gibi) her topu doğrudan yerine taşıyarak çözülebilir; bazılarında ise bir topun önce geçici bir yere konması gerekir ve bu, ileriyi düşünmeyi gerektirir (Kaller ve ark., 2008). Asıl sonuç, en az hamlede çözülen problemlerin sayısıdır; bu sonuç, görevin süre ölçülerinden daha güvenilir bulunmuştur (Schumacher ve ark., 2026). Rapor ayrıca taşınan ilk topa dokunmadan önce geçen süreyi ve hedefe ulaşılan problemlerde bu sürenin bütün çözüm süresi içindeki payını (başlamadan önce düşünme payı; bir araştırmada önerilen adıyla ön planlama payı) anlatır; bu pay, en az hamlede çözülen problem sayısıyla olumlu yönde ilişkili ve tekrar ölçümlerde düşünme süresinden daha kararlı bulunmuştur (Schumacher ve ark., 2026). Başlamadan önce tam plan yapmanın söylendiği bir çalışmada daha çok problem çözülmüş (Unterrainer ve ark., 2003), başka bir çalışmada bu fark görülmemiştir; aynı çalışmada çoğu kişinin iki ara adımı kafada doğru planlayabildiği, üçüncüde zorlandığı görülmüştür (Phillips ve ark., 2001). Planlama ergenlik boyunca gelişmeyi sürdürür: kolay problemlerde 17 yaş dolayında yetişkin düzeyine ulaşılırken en zor problemlerde 20’li yaşların başına kadar ilerleme görülmüştür (Albert ve Steinberg, 2011). 9–20 yaş arasındakilerle yapılan bir çalışmada doğru çözümler 15–17 yaşa kadar artmış ve çalışma belleğiyle ilişkili bulunmuştur (Luciana ve ark., 2009); 4–8 yaş arasındaki çocuklarda sonuçlar bir akıl yürütme testiyle orta düzeyde ilişkili bulunmuştur (Malloy-Diniz ve ark., 2008). 40–80 yaş arasındaki yetişkinlerde bu tür bir görevdeki sonuçlar yaş ilerledikçe düşmüş ve eğitim düzeyiyle ilişkili bulunmuştur (Unterrainer ve ark., 2019).',
    turkishVersion: 'Özgün test. Problemler, yönergeler ve rapor Türkçe olarak hazırlanmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her problemin en az hamle sayısı, olası bütün top dizilişleri ve hamleler ayrı bir programla taranarak yeniden doğrulanmıştır. Bu görevin özgün 12 problemlik setinin güvenirliği yetersiz bulunmuştur (Humes ve ark., 1997, aktaran Unterrainer ve ark., 2019). Problemleri dikkatle seçilmiş bilgisayarlı bir sürümün 24 problemlik setinde güvenirlik .70’in üzerinde bulunmuştur; yazarlar daha çok problemden oluşan sürümlerin daha güvenilir göründüğünü ve bunun bir nedeninin problemlerin dikkatle seçilmesi olabileceğini belirtmiştir (Unterrainer ve ark., 2019). Bu sonuçlar farklı problemlerle elde edildiği için bu teste doğrudan aktarılamaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, problemlerin kaçının en az hamlede çözüldüğüyle ve problemler uzadıkça sonucun nasıl değiştiğiyle anlatılır. Yaşın bu görevdeki etkisi kültürler arasında farklı bulunabilmiştir (Phillips ve ark., 2021); başka ülkelerde toplanmış normlar bu yüzden de kullanılmaz. Zekâ puanı (IQ) verilmez.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Problemler okuma ya da hesap gerektirmez; iki alıştırma problemi topların nasıl taşınacağını öğretir. Her problem için 1 dakika süre vardır; bu süre, yetişkinlerle sınanmış 4–6 hamlelik bilgisayarlı sürümdeki gibidir (Unterrainer ve ark., 2019). 7 hamlelik problemler, 4–7 hamlelik problemlerden oluşan başka bir sette de kullanılmıştır (Kaller ve ark., 2012). Küçük yaşta uzun problemlerde süre yetmeyebilir.',
    license: 'Özgün test. Problemler, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Planlamanın yalnızca bir yönünü, topları hedef düzene getirmeyi ölçer; günlük hayattaki planlama (bir işi zamana yaymak gibi) hakkında doğrudan bilgi vermez.',
      'Topları taşırken yapılan dokunma ya da tıklama hataları sonucu biraz etkileyebilir; yapılan hamle geri alınamaz.',
      'Her problem için 1 dakika süre vardır; uzun problemlerde, özellikle küçük yaşta, çözümü kafada ararken bu süre yetmeyebilir. Bu durumda problem çözülmemiş sayılır ve rapor bunu ayrıca belirtir.',
      'Bazı araştırmacılar bu görevin başlamadan önce kafada yapılan planı ne ölçüde ölçtüğünü sorgulamıştır; kişiler hamle yaparken de plan yapabilir (Phillips ve ark., 2001; Fimbel ve ark., 2009).',
      'Görevi daha önce çözmüş olmak sonucu etkileyebilir: tekrar uygulamada süreler kısalır ve doğru çözümler biraz artabilir (Schumacher ve ark., 2026).',
      'Sonuç; o günkü yorgunluk, isteklilik ve dikkatten etkilenebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Albert, D. ve Steinberg, L. (2011). Age differences in strategic planning as indexed by the Tower of London. Child Development, 82(5), 1501–1517.',
        url: 'https://doi.org/10.1111/j.1467-8624.2011.01613.x',
      },
      {
        text: 'Berg, W. K., Byrd, D. L., McNamara, J. P. ve Case, K. (2010). Deconstructing the tower: Parameters and predictors of problem difficulty on the Tower of London task. Brain and Cognition, 72(3), 472–482.',
        url: 'https://doi.org/10.1016/j.bandc.2010.01.002',
      },
      {
        text: 'Fimbel, E., Lauzon, S. ve Rainville, C. (2009). Performance of humans vs. exploration algorithms on the Tower of London test. PLoS ONE, 4(9), Article e7263.',
        url: 'https://doi.org/10.1371/journal.pone.0007263',
      },
      {
        text: 'Kaller, C. P., Rahm, B., Köstering, L. ve Unterrainer, J. M. (2011). Reviewing the impact of problem structure on planning: A software tool for analyzing tower tasks. Behavioural Brain Research, 216(1), 1–8.',
        url: 'https://doi.org/10.1016/j.bbr.2010.07.029',
      },
      {
        text: 'Kaller, C. P., Rahm, B., Spreer, J., Mader, I. ve Unterrainer, J. M. (2008). Thinking around the corner: The development of planning abilities. Brain and Cognition, 67(3), 360–370.',
        url: 'https://doi.org/10.1016/j.bandc.2008.02.003',
      },
      {
        text: 'Kaller, C. P., Unterrainer, J. M. ve Stahl, C. (2012). Assessing planning ability with the Tower of London task: Psychometric properties of a structurally balanced problem set. Psychological Assessment, 24(1), 46–53.',
        url: 'https://doi.org/10.1037/a0025174',
      },
      {
        text: 'Luciana, M., Collins, P. F., Olson, E. A. ve Schissel, A. M. (2009). Tower of London performance in healthy adolescents: The development of planning skills and associations with self-reported inattention and impulsivity. Developmental Neuropsychology, 34(4), 461–475.',
        url: 'https://doi.org/10.1080/87565640902964540',
      },
      {
        text: 'Malloy-Diniz, L. F., Cardoso-Martins, C., Nassif, E. P., Levy, A. M., Leite, W. B. ve Fuentes, D. (2008). Planning abilities of children aged 4 years and 9 months to 8½ years: Effects of age, fluid intelligence and school type on performance in the Tower of London test. Dementia & Neuropsychologia, 2(1), 26–30.',
        url: 'https://doi.org/10.1590/S1980-57642009DN20100006',
      },
      {
        text: 'Phillips, L. H., Lawrie, L., Schaefer, A., Tan, C. Y. ve Yong, M. H. (2021). The effects of adult ageing and culture on the Tower of London task. Frontiers in Psychology, 12, Article 631458.',
        url: 'https://doi.org/10.3389/fpsyg.2021.631458',
      },
      {
        text: 'Phillips, L. H., Wynn, V. E., McPherson, S. ve Gilhooly, K. J. (2001). Mental planning and the Tower of London task. The Quarterly Journal of Experimental Psychology Section A, 54(2), 579–597.',
        url: 'https://doi.org/10.1080/713755977',
      },
      {
        text: 'Schumacher, L. V., Rahm, B., Kaller, C. P., Schyle, V., Weiller, C. ve Unterrainer, J. M. (2026). A novel index to measure pre-planning in the Tower of London task: Test–retest reliability and known-group validity. British Journal of Psychology, 117(3), 1007–1025.',
        url: 'https://doi.org/10.1111/bjop.70044',
      },
      {
        text: 'Shallice, T. (1982). Specific impairments of planning. Philosophical Transactions of the Royal Society of London. B, Biological Sciences, 298(1089), 199–209.',
        url: 'https://doi.org/10.1098/rstb.1982.0082',
      },
      {
        text: 'Unterrainer, J. M., Rahm, B., Kaller, C. P., Wild, P. S., Münzel, T., Blettner, M., Lackner, K., Pfeiffer, N. ve Beutel, M. E. (2019). Assessing planning ability across the adult life span in a large population-representative sample: Reliability estimates and normative data for the Tower of London (TOL-F) task. Journal of the International Neuropsychological Society, 25(5), 520–529.',
        url: 'https://doi.org/10.1017/S1355617718001248',
      },
      {
        text: 'Unterrainer, J. M., Rahm, B., Leonhart, R., Ruff, C. C. ve Halsband, U. (2003). The Tower of London: The impact of instructions, cueing, and learning on planning abilities. Cognitive Brain Research, 17(3), 675–683.',
        url: 'https://doi.org/10.1016/S0926-6410(03)00191-5',
      },
      {
        text: 'Waid-Ebbs, J. K., Wen, P.-S., Seamon, B. A. ve Velozo, C. A. (2026). Construct validity of the Tower of London test: Generating a construct specification equation relating problem characteristics to problem difficulty in a sample of veterans with mild traumatic brain injury. Assessment, 33(5), 806–816.',
        url: 'https://doi.org/10.1177/10731911251347489',
      },
    ],
  },
};
