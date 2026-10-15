import type { ComplexSpanOp, ComplexSpanSet, ComplexSpanTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Çalışma Belleği: Hesapla ve Hatırla
 *
 * Karmaşık bellek aralığı (complex span) görevlerinin işlem aralığı (operation span) düzenine dayanan özgün bir testtir:
 * her adımda kısa bir işlemin sonucunun doğru olup olmadığına karar verilir, ardından bir harf gösterilir; birkaç adımdan
 * sonra harfler gösterildikleri sırayla seçilir. Harfleri akılda tutarken araya işlem girer; bu yüzden görev yalnızca
 * akılda tutmayı değil, dikkat dağılırken bilgiyi korumayı da gerektirir.
 *
 * Düzen (Unsworth ve ark., 2005; aktaran Đokić ve ark., 2018 ve Monteiro ve ark., 2025): diziler 3–7 harftir; işlem süre
 * sınırı kişiye göre belirlenir: yalnızca işlemlerden oluşan alıştırmadaki cevap sürelerinin ortalaması + 2,5 standart sapma,
 * 3 ile 15 saniye arasında (süre dolarsa işlem yanlış sayılır ve harfe geçilir). Alıştırmada süre sınırının nasıl
 * belirlendiği söylenmez: alıştırmada bilerek yavaş cevap verilmesin. Puan kısmi puandır: doğru yerde seçilen her harf,
 * dizinin tamamı doğru olmasa da sayılır (Đokić ve ark., 2018 kısmi puanlamanın tam puanlamaya yeğlenmesini önerir).
 * İşlemlerin en az %85'inin doğru olması istenir; bu ölçüt sonuçtan kimseyi çıkarmaz, rapor anlatır (ölçütün kaldırılması
 * görevin ölçme özelliklerini bozmamıştır: Đokić ve ark., 2018). İşlemler rastgele basma düzeyindeyse ya da çok hızlı
 * cevaplanmışsa kalite notu eklenir.
 *
 * Harfler (12 ünsüz) birbirine benzemeyen, Türkçede kolay okunan büyük harflerdir. Bir dizide aynı harf yoktur; alfabede
 * birbirine yakın harfler art arda gelmez ve diziler bilinen kısaltmalar oluşturmaz. Her uzunluktan iki dizi vardır
 * (toplam 50 harf, 50 işlem); uzunluklar karışık sıradadır, böylece dizinin ne zaman biteceği bilinmez. İşlemlerin yarısı
 * doğru, yarısı 1 ya da 2 eksik/fazla sonuç gösterir. Hesaplamadan doğru cevabı ele veren ipucu yoktur: yanlış sonuç
 * çarpımın kendisine eşit değildir ve çarpıma göre doğru sonuçla aynı taraftadır (toplamada büyük, çıkarmada küçük);
 * gösterilen sonucun tek ya da çift olması, 5'e bölünmesi, büyüklüğü ve işaret doğru ve yanlış işlemlerde benzer
 * sıklıktadır: testteki ipuçlarından birine göre basan biri en çok 31 işlemi doğru bulur (rastgele basma sınırı). Art arda
 * en çok üç işlem aynı cevaplıdır; alıştırma işlemleri (çarpanların sırası değişse de) asıl bölümde yinelenmez. İşlemler, harfler ve
 * rapor Ölçekhane'nindir; kurallar tests/hesapla-ve-hatirla.test.ts'te denetlenir. Diziler değişirse testin sürüm numarası
 * artırılmalıdır.
 */

const LETTERS = ['F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'Y'];

const idx = (s: string) => [...s].map((c) => LETTERS.indexOf(c));
const op = (a: number, b: number, sign: 1 | -1, c: number, shown: number): ComplexSpanOp => [a, b, sign, c, shown];
const set = (letters: string, ops: [number, number, 1 | -1, number, number][]): ComplexSpanSet => ({ letters: idx(letters), ops: ops.map((o) => op(...o)) });

const task: ComplexSpanTask = {
  key: 'hesapla-ve-hatirla',
  kind: 'complex_span',
  name: 'Hesapla ve Hatırla',
  measures: 'Bir yandan kısa işlemler yaparken bir yandan da harfleri sırasıyla akılda tutabilmeyi, yani çalışma belleğini ölçer.',
  instructions: [
    'Her adımda önce kısa bir işlem göreceksin, örneğin (3 × 4) − 2 = 10. Eşittirden sonraki sonuç doğruysa DOĞRU, yanlışsa YANLIŞ düğmesine bas.',
    'İşlemden hemen sonra bir harf belirecek. Harfi aklında tut; sonra yeni bir işlem gelecek.',
    'Birkaç işlem ve harften sonra harfleri gösterildikleri sırayla seç. Hatırlayamadığın bir harfin yerine BOŞ düğmesine bas; böylece öteki harfler yerinde kalır.',
    'İki işe de özen göster: işlemleri doğru yapmaya ve harfleri hatırlamaya. İşlemlerin en az %85’ini doğru yapmaya çalış. Kâğıt ya da kalem kullanma.',
  ],
  letters: LETTERS,
  letterMs: 1000,
  limit: { factor: 2.5, minMs: 3000, maxMs: 15_000 },
  practiceLetters: [idx('FN'), idx('YTM')],
  practiceOps: [
    op(3, 4, 1, 3, 14),
    op(3, 5, -1, 5, 10),
    op(6, 4, -1, 2, 23),
    op(4, 4, -1, 4, 13),
    op(6, 2, -1, 5, 7),
    op(4, 3, -1, 1, 10),
    op(5, 2, 1, 5, 17),
    op(6, 2, -1, 1, 11),
    op(6, 2, -1, 4, 8),
    op(3, 2, 1, 3, 7),
    op(5, 4, -1, 1, 19),
    op(4, 3, -1, 3, 7),
    op(5, 2, 1, 1, 11),
    op(2, 4, 1, 5, 13),
    op(3, 3, -1, 3, 8),
  ],
  practiceSets: [
    set('NS', [
      [6, 3, 1, 5, 21],
      [5, 3, -1, 3, 12],
    ]),
    set('HRJ', [
      [6, 5, -1, 5, 25],
      [6, 2, -1, 2, 10],
      [3, 5, 1, 2, 16],
    ]),
  ],
  sets: [
    set('RJYT', [
      [5, 3, -1, 2, 13],
      [6, 5, -1, 2, 26],
      [6, 5, 1, 5, 34],
      [2, 2, 1, 1, 5],
    ]),
    set('FJHKPL', [
      [4, 2, -1, 2, 5],
      [3, 5, -1, 1, 14],
      [6, 4, -1, 1, 23],
      [3, 3, -1, 4, 5],
      [4, 4, 1, 4, 18],
      [2, 4, -1, 5, 2],
    ]),
    set('NRM', [
      [6, 4, 1, 4, 29],
      [4, 5, 1, 3, 23],
      [6, 5, -1, 1, 29],
    ]),
    set('PYKTFSN', [
      [4, 3, 1, 5, 19],
      [5, 2, -1, 2, 8],
      [2, 2, 1, 3, 7],
      [6, 3, 1, 1, 19],
      [5, 2, -1, 4, 7],
      [2, 2, -1, 1, 3],
      [5, 2, -1, 3, 9],
    ]),
    set('MHFLS', [
      [6, 4, -1, 3, 21],
      [6, 3, -1, 3, 13],
      [6, 4, -1, 5, 20],
      [2, 4, 1, 3, 11],
      [6, 4, -1, 4, 18],
    ]),
    set('TYJ', [
      [6, 2, 1, 5, 19],
      [3, 2, -1, 2, 2],
      [5, 2, 1, 3, 13],
    ]),
    set('KPMHS', [
      [5, 3, 1, 1, 16],
      [6, 5, 1, 2, 31],
      [4, 4, 1, 5, 23],
      [4, 3, -1, 5, 7],
      [6, 3, 1, 4, 22],
    ]),
    set('KPLRJHF', [
      [4, 5, 1, 5, 27],
      [5, 5, 1, 4, 29],
      [5, 5, 1, 3, 28],
      [2, 5, 1, 4, 15],
      [5, 4, -1, 4, 16],
      [3, 4, 1, 1, 14],
      [2, 4, 1, 4, 13],
    ]),
    set('LRNK', [
      [4, 3, -1, 4, 7],
      [2, 4, -1, 4, 4],
      [5, 5, 1, 5, 30],
      [2, 2, -1, 2, 1],
    ]),
    set('HMTPYJ', [
      [3, 2, 1, 4, 10],
      [5, 3, 1, 5, 18],
      [4, 3, -1, 2, 8],
      [2, 4, 1, 2, 12],
      [4, 5, -1, 5, 15],
      [2, 3, 1, 2, 8],
    ]),
  ],
};

const LETTER_TOTAL = task.sets.reduce((s, x) => s + x.letters.length, 0);

export const hesaplaVeHatirla: TaskInstrument = {
  slug: 'hesapla-ve-hatirla',
  version: 1,
  engine: 'tasks',
  name: 'Çalışma Belleği: Hesapla ve Hatırla',
  shortName: 'Hesapla ve hatırla',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 15,
  sortOrder: 59.2,
  tagline: 'Kısa işlemler yaparken harfleri sırasıyla akılda tutabilmeyi, yani dikkat başka bir işe giderken bilgiyi koruyabilmeyi (çalışma belleğini) ölçer.',
  description: `Bu test, psikolojide çalışma belleğini ölçmek için yaygın olarak kullanılan karmaşık bellek aralığı (complex span) görevlerinin işlem aralığı düzenine dayanır: her adımda kısa bir işlemin sonucunun doğru olup olmadığına karar verilir, ardından bir harf gösterilir; birkaç adımdan sonra harfler gösterildikleri sırayla seçilir. Diziler 3 ile 7 harf arasındadır; toplam ${LETTER_TOTAL} harf ve ${LETTER_TOTAL} işlem vardır; işlemler için kişiye göre belirlenen bir süre vardır. İşlemler ve harf dizileri Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç harfin doğru yerde hatırlandığını, diziler uzadıkça sonucun nasıl değiştiğini, işlemlerin ne kadarının doğru yapıldığını ve doğru yerde olmayan harflerin türünü sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.`,
  intro: {
    title: 'Hem hesapla hem hatırla!',
    paragraphs: [
      'Birazdan kısa işlemler ve harfler göreceksin. Her işlemin sonucunun doğru olup olmadığına karar verecek, araya giren harfleri de sırasıyla aklında tutacaksın.',
      `Başta üç kısa alıştırma var: önce yalnızca harfler, sonra yalnızca işlemler, sonra ikisi birlikte. Ardından ${task.sets.length} dizilik asıl bölüm gelir.`,
      'Sessiz bir yerde, kâğıt kalem kullanmadan ve dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır. Bir dizi sürerken başka bir uygulamaya geçersen o dizi baştan gösterilir.',
    ],
  },
  scales: [
    { key: 'hb_harf', name: 'Hatırlanan harfler', plain: `İşlemlerin arasında gösterilen ${LETTER_TOTAL} harften kaç tanesinin doğru yerde hatırlandığı.` },
    {
      key: 'hb_uzunluk',
      name: 'Dizi uzunluğu',
      plain: 'Diziler uzadıkça (3 harften 7 harfe) harflerin ne kadarının doğru yerde hatırlandığı ve bütün harfleri doğru hatırlanan en uzun dizi.',
    },
    { key: 'hb_islem', name: 'İşlemler', plain: 'Harfleri akılda tutarken yapılan işlemlerin kaç tanesinin süresi içinde doğru cevaplandığı.' },
    {
      key: 'hb_hata',
      name: 'Hata türleri',
      plain: 'Doğru yerde olmayan harflerin türü: yeri karışan harfler, o dizide olmayan harfler ve boş bırakılan yerler.',
    },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Karmaşık bellek aralığı (complex span) görevlerinin işlem aralığı (operation span) düzeni: her harften önce basit bir işlemin doğru olup olmadığına karar verilir; 3–7 harflik dizilerin sonunda harfler gösterildikleri sırayla hatırlanır. İşlem süresi kişiye göre belirlenir: yalnızca işlemlerden oluşan alıştırmadaki cevap sürelerinin ortalaması ile 2,5 standart sapmanın toplamı (bu testte en az 3, en çok 15 saniye). Bu süre sınırı, işlemler yapılırken harflerin içinden tekrar edilmesini sınırlamak içindir (Unsworth ve ark., 2005; aktaran Đokić ve ark., 2018 ve Monteiro ve ark., 2025). Puan, doğru yerde hatırlanan harflerin toplamıdır (kısmi puan): üç tür bellek aralığı göreviyle yapılan bir çalışma, bu puanlamanın yalnızca tamamı doğru dizileri sayan puanlamaya yeğlenmesini önermektedir (Đokić ve ark., 2018). Bu tür görevlerde geleneksel olarak işlemlerin en az %85’inin doğru olması istenir; bu testte bu ölçüt kimseyi sonuçtan çıkarmaz, raporda anlatılır: aynı çalışmada ölçüt kaldırıldığında görevin ölçme özellikleri bozulmamıştır (Đokić ve ark., 2018). İşlemler, harf dizileri ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da başka araştırma testlerinin uyaranları, puanlama yazılımları ya da normları kullanılmaz.',
    whatItMeasures:
      'Çalışma belleğini, yani bilgiyi kısa bir süre akılda tutarken aynı anda başka bir iş yapabilmeyi ölçer. Harfleri yalnızca tekrar etmek yerine araya işlemler girdiği için görev, dikkat başka bir işe giderken bilgiyi koruyabilmeyi ve sonra geri getirebilmeyi gerektirir. Bir derlemeye göre bu görevlerin karmaşık düşünmeyle ilişkisinin önemli bir kısmı, dikkati yönetebilmekten kaynaklanıyor olabilir (Lee ve Engle, 2026). Almanya’da 68 okul öncesi ve 66 ilkokul çocuğuyla (ilkokuldakilerin yaş ortalaması 9) yapılan bir çalışmada, birkaç bellek aralığı göreviyle ölçülen çalışma belleği, cinsiyet ve sözel olmayan zekâ hesaba katıldıktan sonra da iki grupta matematik becerisiyle ilişkili bulunmuştur (Hischa ve ark., 2025). Bununla birlikte tek bir görevin sonucu, çalışma belleğinin yanında o göreve ve o tür görevlere özgü etkileri de taşır (Schmiedek ve ark., 2014); çalışma belleğini daha doğru kestirmek için farklı türden görevlerin birlikte kullanılması önerilir (Monteiro ve ark., 2025). Karmaşık bellek aralığı görevleri ile n-geri (geriye dönük hatırlama) görevleri arasındaki ilişki bir meta-analizde ortalamada zayıf bulunmuştur (r = .20; Redick ve Lindsey, 2013); birçok görevi birlikte inceleyen bir çalışma ise iki tür görevin de çalışma belleğinin geçerli göstergeleri olduğunu bildirir (Schmiedek ve ark., 2014).',
    turkishVersion: 'Özgün test. İşlemler rakamlarla, harfler Türkçede kolay okunan büyük ünsüzlerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Bu düzendeki işlem aralığı görevlerinin iç tutarlılığı başka ülkelerdeki çalışmalarda yeterli bulunmuştur: 18–41 yaş arası 504 üniversite öğrencisiyle yapılan bir çalışmada işlem aralığı görevinin iç tutarlılığı (Cronbach α) puanlama biçimine göre .76 ile .83 arasında bulunmuştur (Đokić ve ark., 2018); Portekiz’de 163 genç yetişkinle yapılan bir çalışmada 60 denemelik bir işlem aralığı görevinin iç tutarlılığı .90, yalnızca ilk 20 denemesininki .79 bulunmuştur (Monteiro ve ark., 2025). Bu değerler o görevlere aittir; bu test için geçerli sayılamaz. 50 üniversite öğrencisiyle yapılan bir çalışmada, aynı kişilerin laboratuvarda ve uzaktan, internet üzerinden çözdüğü işlem aralığı görevinin sonuçları güçlü biçimde ilişkili bulunmuştur (görevi iki ortamda da tamamlayan 43 kişide; Ruiz ve ark., 2019). O çalışmada harf yerine alışılmadık simgeler kullanılmıştır, çünkü başka bir araştırmada internet sürümünde harfler kâğıda yazılmıştır; bu testte harfler kullanıldığı için bu bulgu bu teste doğrudan aktarılamaz.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, kaç harfin doğru yerde hatırlandığıyla ve dizi uzunluklarına göre anlatılır. Zekâ puanı (IQ) verilmez. Çalışma belleği yaşla değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '5. sınıftan itibaren uygulanır; yetişkinler de çözebilir. İşlemler çarpım tablosu ve toplama-çıkarma bilgisi gerektirir. İngiltere’de 10–86 yaş arası 350 kişiyle yapılan bir çalışmada, araştırmacıların bütün yaşlara uygun diye seçtiği, laboratuvarda yapılan bir işlem aralığı görevinde sonuçlar 10 yaşından 30 yaşına kadar biraz yükselmiş, 30 yaşından sonra düşmüştür (Ferguson ve ark., 2021). Bu testin internette 10–11 yaşındaki çocuklarla yapılan uygulamasının geçerliği ayrıca gösterilmemiştir.',
    license:
      'Özgün test. İşlemler, harf dizileri, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir; görevin düzeni bilimsel yayınlarda tanımlanan işlem aralığı düzenidir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; dikkat eksikliği, öğrenme güçlüğü ya da bellek sorunları gibi durumlar ancak uzman değerlendirmesiyle anlaşılabilir.',
      'Çalışma belleğini tek bir görevle ölçer; tek görevin sonucu o göreve özgü etkileri de taşır (Schmiedek ve ark., 2014). Sonuç, çalışma belleğinin tamamı hakkında kesin bir yargı için yeterli değildir.',
      'İşlem kısmı matematik becerisini ölçmek için değil, harfleri akılda tutmayı zorlaştırmak için vardır. İşlemlerde zorlanan biri için görev daha da zorlaşır; bu yüzden harf sonucu işlem sonucuyla birlikte okunmalıdır.',
      'Her uzunlukta yalnızca iki dizi vardır; bütün harfleri doğru hatırlanan en uzun dizi yalnızca kabaca fikir verir. Asıl sonuç, doğru yerde hatırlanan harflerin toplamıdır.',
      'Sonuç; o günkü yorgunluk, isteklilik, ortamdaki gürültü ve cihazdan etkilenebilir. Harflerin kâğıda yazılması ya da görev sırasında yardım alınması sonucu geçersiz kılar.',
      'Bellek aralığı görevleriyle yapılan alıştırmaların, güncelleme görevleri gibi başka türden çalışma belleği görevlerine ve çalışma belleği dışındaki becerilere aktarıldığı gösterilememiştir (55 çalışmayı birleştiren bir meta-analiz: Fu ve ark., 2026). Daha önceki bir meta-analizde de çalışma belleği alıştırmalarının başka becerilere yansıdığına dair inandırıcı bir kanıt bulunmamıştır (Melby-Lervåg ve Hulme, 2013). Bu görevi tekrar tekrar çözmenin başka becerileri geliştireceği beklenmemelidir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Đokić, R., Koso-Drljević, M. ve Đapo, N. (2018). Working memory span tasks: Group administration and omitting accuracy criterion do not change metric characteristics. PLoS ONE, 13(10), e0205169.',
        url: 'https://doi.org/10.1371/journal.pone.0205169',
      },
      {
        text: 'Ferguson, H. J., Brunsdon, V. E. A. ve Bradford, E. E. F. (2021). The developmental trajectories of executive function from adolescence to old age. Scientific Reports, 11, 1382.',
        url: 'https://doi.org/10.1038/s41598-020-80866-1',
      },
      {
        text: 'Fu, J., Zhou, Y., Yuan, M. ve Cai, Y. (2026). The asymmetry of working memory training transfer: A systematic review and meta-analysis. Psychonomic Bulletin & Review, 33(7), 227.',
        url: 'https://doi.org/10.3758/s13423-026-02994-5',
      },
      {
        text: 'Hischa, V., Moeller, K., Seitz-Stein, K. ve Niklas, F. (2025). Differential contributions of approximate number system, number line estimation, and working memory to mathematical skills in preschool and primary school. Psychological Research, 89(5), 142.',
        url: 'https://doi.org/10.1007/s00426-025-02144-x',
      },
      {
        text: 'Lee, Y. ve Engle, R. (2026). Beyond working memory capacity: Attention control as the underlying mechanism of cognitive abilities. Journal of Intelligence, 14(2), 22.',
        url: 'https://doi.org/10.3390/jintelligence14020022',
      },
      {
        text: 'Melby-Lervåg, M. ve Hulme, C. (2013). Is working memory training effective? A meta-analytic review. Developmental Psychology, 49(2), 270–291.',
        url: 'https://doi.org/10.1037/a0028228',
      },
      {
        text: 'Monteiro, F., Nascimento, L. B., Leitão, J. A., Santos, E. J. R., Rodrigues, P., Santos, I. M., Simões, F. ve Nascimento, C. S. (2025). Optimizing working memory assessment: Development of shortened versions of complex spans, updating, and binding tasks. Psychological Research, 89(2), 65.',
        url: 'https://doi.org/10.1007/s00426-025-02083-7',
      },
      {
        text: 'Redick, T. S. ve Lindsey, D. R. B. (2013). Complex span and n-back measures of working memory: A meta-analysis. Psychonomic Bulletin & Review, 20(6), 1102–1113.',
        url: 'https://doi.org/10.3758/s13423-013-0453-9',
      },
      {
        text: 'Ruiz, S., Chen, X., Rebuschat, P. ve Meurers, D. (2019). Measuring individual differences in cognitive abilities in the lab and on the web. PLoS ONE, 14(12), e0226217.',
        url: 'https://doi.org/10.1371/journal.pone.0226217',
      },
      {
        text: 'Schmiedek, F., Lövdén, M. ve Lindenberger, U. (2014). A task is a task is a task: Putting complex span, n-back, and other working memory indicators in psychometric context. Frontiers in Psychology, 5, 1475.',
        url: 'https://doi.org/10.3389/fpsyg.2014.01475',
      },
      {
        text: 'Unsworth, N., Heitz, R. P., Schrock, J. C. ve Engle, R. W. (2005). An automated version of the operation span task. Behavior Research Methods, 37(3), 498–505.',
        url: 'https://doi.org/10.3758/BF03192720',
      },
    ],
  },
};
