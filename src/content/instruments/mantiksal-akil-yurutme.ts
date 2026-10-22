import { LOGIC_VALID } from '@/lib/instruments/logic';
import type { LogicForm, LogicItem, LogicPracticeItem, LogicalReasoningTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Mantıksal akıl yürütme (tümdengelim): her soruda iki bilgi ve bir sonuç vardır; bilgiler doğru kabul edildiğinde
 * sonucun kesin olarak doğru olup olmadığına karar verilir. Bütün sorular Ölçekhane'nindir.
 *
 * 32 soru, iki tür:
 *  - Koşullu ("Eğer … ise …"), 16 soru: dört çıkarımın her birinden dört soru (Evans, Thompson ve Over, 2015, Tablo 1):
 *    koşul var → sonuç var (`mp`, kesin), sonuç yok → koşul yok (`mt`, kesin), sonuç var → koşul var (`ac`, kesin
 *    değil), koşul yok → sonuç yok (`da`, kesin değil). Kurallar uydurma bir dünyadandır; gerçek hayat bilgisi cevaba
 *    karışmaz (sonucun gerçekte doğru olup olmadığı bilinemez, başka bir açıklama akla gelmez). Her çıkarımın dört
 *    sorusundan ikisi uydurma canlı adlarıyla (fuşa, zemzer, lupu, tilpi, dorpa, nimbo, melgi, pelzi), ikisi gelişigüzel
 *    kurallarla kurulur: uydurma adlı kurallarda çocuklar koşullu cümleleri daha olgun yorumlar, gelişigüzel kurallarda
 *    ise 9 ve 12 yaşındakiler çoğunlukla "ikisi birlikte" diye yorumlar (Markovits, Brisson ve de Chantal, 2016).
 *  - Kategorik ("bütün", "hiçbir", "bazı"), 16 soru: sonucun geçerliği ile gerçek hayatta inandırıcı olup olmadığı
 *    çaprazlanır (Evans, Barston ve Pollard, 1983 düzeni; Trippas ve ark., 2018): geçerli–inandırıcı (`vb`), geçerli–
 *    inandırıcı değil (`vu`), geçersiz–inandırıcı (`ib`), geçersiz–inandırıcı değil (`iu`), her birinden dört soru. Her
 *    hücrede dört ayrı biçim vardır: geçerliler "bütün A B'dir; x A'dır → x B'dir", "hiçbir A B değildir; x A'dır → x B
 *    değildir", "bütün A B'dir; bütün B C'dir → bütün A C'dir", "bütün A B'dir; x B değildir → x A değildir";
 *    geçersizler "bütün A B'dir; x B'dir → x A'dır", "bütün A B'dir; x A değildir → x B değildir", "bütün A B'dir;
 *    bazı B C'dir → bazı A C'dir", "bütün A B'dir; bütün C B'dir → bütün A C'dir". Geçersiz soruların hepsinde sonuç
 *    olabilir ama kesin değildir (bilgilerle çelişmez).
 *
 * Doğru cevaplar sorunun türünden gelir; tests/mantiksal-akil-yurutme.test.ts her soruyu biçimsel olarak yeniden yazar ve
 * bilgilere uyan bütün olası dünyaları deneyerek geçerliği bağımsızca doğrular. Cevaplar 16 "evet", 16 "hayır"dır ve
 * art arda en çok üç kez aynı cevap gelir. Sorunun türü cevabı ele verdiği için türler de tarayıcıya gitmez.
 * Sözel Akıl Yürütme'deki mantıksal çıkarım sorularının içerikleri (hamsi, Maviş, ejderhalar, arılar) burada kullanılmaz.
 */

interface Spec {
  key: string;
  form: LogicForm;
  premises: [string, string];
  conclusion: string;
}

/** Uygulama sırası: koşullu ve kategorik sorular karışık; her yarıda her türden ikişer soru. */
const SPECS: Spec[] = [
  {
    key: 'ma01',
    form: 'mp',
    premises: ['Eğer bir kartın önünde yıldız varsa, o kartın arkası mavidir.', 'Elif’in kartının önünde yıldız var.'],
    conclusion: 'Elif’in kartının arkası mavidir.',
  },
  {
    key: 'ma02',
    form: 'vb',
    premises: ['Bütün köpekler havlar.', 'Karabaş bir köpektir.'],
    conclusion: 'Karabaş havlar.',
  },
  {
    key: 'ma03',
    form: 'ac',
    premises: ['Eğer bir balon kırmızıysa, içinde hediye vardır.', 'Mert’in balonunun içinde hediye var.'],
    conclusion: 'Mert’in balonu kırmızıdır.',
  },
  {
    key: 'ma04',
    form: 'vu',
    premises: ['Bütün kuşlar su altında nefes alabilir.', 'Güvercin bir kuştur.'],
    conclusion: 'Güvercin su altında nefes alabilir.',
  },
  {
    key: 'ma05',
    form: 'iu',
    premises: ['Bütün balıklar yüzebilir.', 'Ördek yüzebilir.'],
    conclusion: 'Ördek bir balıktır.',
  },
  {
    key: 'ma06',
    form: 'da',
    premises: ['Eğer bir çiçek fuşa ise, yaprakları mordur.', 'Bu çiçek bir fuşa değil.'],
    conclusion: 'Bu çiçeğin yaprakları mor değildir.',
  },
  {
    key: 'ma07',
    form: 'mt',
    premises: ['Eğer bir bitki zemzer ise, yaprakları yuvarlaktır.', 'Bu bitkinin yaprakları yuvarlak değil.'],
    conclusion: 'Bu bitki bir zemzer değildir.',
  },
  {
    key: 'ma08',
    form: 'ib',
    premises: ['Bütün kuşların kanatları vardır.', 'Kartalın kanatları vardır.'],
    conclusion: 'Kartal bir kuştur.',
  },
  {
    key: 'ma09',
    form: 'vb',
    premises: ['Hiçbir taş canlı değildir.', 'Çakıl bir taştır.'],
    conclusion: 'Çakıl canlı değildir.',
  },
  {
    key: 'ma10',
    form: 'mp',
    premises: ['Eğer bir hayvan tilpi ise, kulakları turuncudur.', 'Pıtı bir tilpidir.'],
    conclusion: 'Pıtı’nın kulakları turuncudur.',
  },
  {
    key: 'ma11',
    form: 'vu',
    premises: ['Hiçbir kedi miyavlamaz.', 'Pamuk bir kedidir.'],
    conclusion: 'Pamuk miyavlamaz.',
  },
  {
    key: 'ma12',
    form: 'ac',
    premises: ['Eğer bir hayvan lupu ise, kuyruğu çizgilidir.', 'Bu hayvanın kuyruğu çizgili.'],
    conclusion: 'Bu hayvan bir lupudur.',
  },
  {
    key: 'ma13',
    form: 'ib',
    premises: ['Bütün balıklar suda yaşar.', 'Kedi bir balık değildir.'],
    conclusion: 'Kedi suda yaşamaz.',
  },
  {
    key: 'ma14',
    form: 'mt',
    premises: ['Eğer bir mektup Kuzey Kasabası’na gidiyorsa, zarfı sarıdır.', 'Bu mektubun zarfı sarı değil.'],
    conclusion: 'Bu mektup Kuzey Kasabası’na gitmiyor.',
  },
  {
    key: 'ma15',
    form: 'iu',
    premises: ['Bütün arabaların tekerleği vardır.', 'Bisiklet bir araba değildir.'],
    conclusion: 'Bisikletin tekerleği yoktur.',
  },
  {
    key: 'ma16',
    form: 'da',
    premises: ['Eğer bir balık pelzi ise, pulları yeşildir.', 'Bu balık bir pelzi değil.'],
    conclusion: 'Bu balığın pulları yeşil değildir.',
  },
  {
    key: 'ma17',
    form: 'vb',
    premises: ['Bütün kediler memelidir.', 'Bütün memeliler hayvandır.'],
    conclusion: 'Bütün kediler hayvandır.',
  },
  {
    key: 'ma18',
    form: 'ac',
    premises: ['Eğer bir kapı yeşil anahtarla açılıyorsa, ardında bahçe vardır.', 'Bu kapının ardında bahçe var.'],
    conclusion: 'Bu kapı yeşil anahtarla açılır.',
  },
  {
    key: 'ma19',
    form: 'mp',
    premises: ['Eğer bir kutudan zil sesi geliyorsa, o kutuda altın vardır.', 'Üçüncü kutudan zil sesi geliyor.'],
    conclusion: 'Üçüncü kutuda altın vardır.',
  },
  {
    key: 'ma20',
    form: 'ib',
    premises: ['Bütün güller çiçektir.', 'Bazı çiçekler kırmızıdır.'],
    conclusion: 'Bazı güller kırmızıdır.',
  },
  {
    key: 'ma21',
    form: 'vu',
    premises: ['Bütün köpekler balıktır.', 'Bütün balıklar uçabilir.'],
    conclusion: 'Bütün köpekler uçabilir.',
  },
  {
    key: 'ma22',
    form: 'da',
    premises: ['Eğer bir dolabın kapısı maviyse, içinde battaniye vardır.', 'Bu dolabın kapısı mavi değil.'],
    conclusion: 'Bu dolapta battaniye yoktur.',
  },
  {
    key: 'ma23',
    form: 'iu',
    premises: ['Bütün atlar hayvandır.', 'Bazı hayvanlar kanatlıdır.'],
    conclusion: 'Bazı atlar kanatlıdır.',
  },
  {
    key: 'ma24',
    form: 'ib',
    premises: ['Bütün serçeler canlıdır.', 'Bütün kuşlar canlıdır.'],
    conclusion: 'Bütün serçeler kuştur.',
  },
  {
    key: 'ma25',
    form: 'mt',
    premises: ['Eğer bir şişenin kapağı kırmızıysa, üstünde yıldız vardır.', 'Bu şişenin üstünde yıldız yok.'],
    conclusion: 'Bu şişenin kapağı kırmızı değildir.',
  },
  {
    key: 'ma26',
    form: 'mp',
    premises: ['Eğer bir bitki dorpa ise, çiçekleri beyazdır.', 'Bahçedeki bitki bir dorpadır.'],
    conclusion: 'Bahçedeki bitkinin çiçekleri beyazdır.',
  },
  {
    key: 'ma27',
    form: 'vu',
    premises: ['Bütün ağaçlar yürüyebilir.', 'Çam yürüyemez.'],
    conclusion: 'Çam bir ağaç değildir.',
  },
  {
    key: 'ma28',
    form: 'ac',
    premises: ['Eğer bir böcek melgi ise, sırtında üç benek vardır.', 'Bu böceğin sırtında üç benek var.'],
    conclusion: 'Bu böcek bir melgidir.',
  },
  {
    key: 'ma29',
    form: 'vb',
    premises: ['Bütün kuşların gagası vardır.', 'Kedinin gagası yoktur.'],
    conclusion: 'Kedi bir kuş değildir.',
  },
  {
    key: 'ma30',
    form: 'da',
    premises: ['Eğer bir gemi yıldızlı bayrak taşıyorsa, limana sabah girer.', 'Bu gemi yıldızlı bayrak taşımıyor.'],
    conclusion: 'Bu gemi limana sabah girmez.',
  },
  {
    key: 'ma31',
    form: 'iu',
    premises: ['Bütün balıklar canlıdır.', 'Bütün ağaçlar canlıdır.'],
    conclusion: 'Bütün balıklar ağaçtır.',
  },
  {
    key: 'ma32',
    form: 'mt',
    premises: ['Eğer bir hayvan nimbo ise, gözleri yeşildir.', 'Bu hayvanın gözleri yeşil değil.'],
    conclusion: 'Bu hayvan bir nimbo değildir.',
  },
];

export const LOGIC_SPECS: readonly Spec[] = SPECS;

/** Alıştırma: bir kesin koşullu çıkarım, bir kesin olmayan "bazı" çıkarımı ve gerçeğe uymayan ama kesin bir sonuç. */
const PRACTICE: LogicPracticeItem[] = [
  {
    key: 'map1',
    premises: ['Eğer bir kutu kırmızıysa, içinde top vardır.', 'Bu kutu kırmızı.'],
    conclusion: 'Bu kutuda top vardır.',
    answer: 1,
    explain: 'Kurala göre her kırmızı kutuda top vardır. Bu kutu kırmızı olduğuna göre içinde kesin olarak top vardır.',
  },
  {
    key: 'map2',
    premises: ['Bazı kutular boştur.', 'Bu bir kutudur.'],
    conclusion: 'Bu kutu boştur.',
    answer: 2,
    explain: 'Bilgiler kutuların yalnızca bazılarının boş olduğunu söylüyor. Bu kutu boş olabilir ama dolu da olabilir; bu yüzden sonuç kesin değildir.',
  },
  {
    key: 'map3',
    premises: ['Bütün atlar mavidir.', 'Duman bir attır.'],
    conclusion: 'Duman mavidir.',
    answer: 1,
    explain:
      'Gerçekte mavi at yoktur. Ama bilgileri doğru kabul edince, Duman bir at olduğu için mavi olmak zorundadır. Bu testte gerçek hayatta ne olduğu değil, yalnızca bilgilerden ne çıktığı sorulur.',
  },
];

const task: LogicalReasoningTask = {
  key: 'mantiksal-akil-yurutme',
  kind: 'logical_reasoning',
  name: 'Mantıksal Akıl Yürütme',
  measures: 'Verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt edebilmeyi (tümdengelim) ölçer.',
  instructions: [
    'Her soruda iki bilgi ve bir sonuç göreceksin.',
    'Bilgileri, gerçekte öyle olmasa bile doğru kabul et. Sonra karar ver: bu bilgiler doğruysa, sonuç da kesin olarak doğru mu?',
    'Sonuç bilgilerden kesin olarak çıkıyorsa “Evet, kesin olarak doğru”; doğru olabilir ama kesin değilse “Hayır, kesin değil” seç.',
  ],
  practice: PRACTICE,
  items: SPECS.map((s): LogicItem => ({
    key: s.key,
    premises: [...s.premises],
    conclusion: s.conclusion,
  })),
  answers: SPECS.map((s) => (LOGIC_VALID.includes(s.form) ? 1 : 2)),
  forms: SPECS.map((s) => s.form),
};

export const mantiksalAkilYurutme: TaskInstrument = {
  slug: 'mantiksal-akil-yurutme',
  version: 1,
  engine: 'tasks',
  name: 'Mantıksal Akıl Yürütme',
  shortName: 'Mantıksal akıl yürütme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 49.75,
  tagline: 'Verilen bilgilerden kesin olarak neyin çıktığını bulabilmeyi ölçer; gerçek hayattaki bilginin kararını ne kadar etkilediğini de gösterir.',
  description:
    'Bu test tümdengelimli akıl yürütmeyi, yani verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt edebilmeyi ölçer. Her soruda iki bilgi ve bir sonuç vardır; bilgiler doğruysa sonucun da kesin olarak doğru olup olmadığına karar verilir. Soruların yarısı “eğer … ise …” kurallarıyla, yarısı “bütün, bazı, hiçbir” sözcükleriyle kurulmuştur ve Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, “eğer–ise” kurallarında kesin olanla olmayanın ayırt edilip edilmediğini, sonuç gerçek hayatta doğru ya da yanlış göründüğünde bu bilginin kararı etkileyip etkilemediğini ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Bilgilerden ne çıkar?',
    paragraphs: [
      'Birazdan bazı bilgiler ve bunlardan çıkarılmış sonuçlar göreceksin. Her soruda, bilgiler doğruysa sonucun da kesin olarak doğru olup olmadığına karar vereceksin.',
      `Test ${SPECS.length} sorudan oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    {
      key: 'ma_dogru',
      name: 'Doğru cevaplar',
      plain: 'Sonucun bilgilerden kesin olarak çıkıp çıkmadığına doğru karar verilen soruların sayısı.',
    },
    {
      key: 'ma_kosul',
      name: 'Eğer–ise çıkarımları',
      plain: '“Eğer … ise …” kurallarından kesin olarak neyin çıktığını, neyin çıkmadığını ayırt edebilmek.',
    },
    {
      key: 'ma_inanc',
      name: 'Bilgiler ve gerçek hayat',
      plain: 'Sonuç gerçek hayatta doğru ya da yanlış göründüğünde de yalnızca verilen bilgilere göre karar verebilmek.',
    },
    {
      key: 'ma_calisma',
      name: 'Çalışma biçimi',
      plain: 'Sorulara ne kadar zaman ayrıldığı ve cevapların hep aynı yöne kayıp kaymadığı.',
    },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Tümdengelimli akıl yürütmeyi incelemek için uzun süredir kullanılan iki soru türü: “eğer … ise …” kurallarıyla kurulan dört temel çıkarım (Evans, Thompson ve Over, 2015) ve sonucun mantıksal geçerliğiyle gerçek hayatta inandırıcı olup olmadığının çaprazlandığı “bütün, bazı, hiçbir” soruları (Evans, Barston ve Pollard, 1983; Trippas ve ark., 2018). Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı test setlerinin soruları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Verilen bilgilerden kesin olarak neyin çıktığını, neyin çıkmadığını ayırt edebilmeyi ölçer. Rapor iki şeye ayrıca bakar. Birincisi “eğer A ise B” kuralından, B olduğunda A’nın da olduğu ya da A olmadığında B’nin de olmadığı sonucuna varmaktır: bu iki çıkarım kesin değildir ama yetişkinler de onları sık kabul eder (Evans, Thompson ve Over, 2015); Kıbrıs’ta 2., 4. ve 6. sınıf öğrencileriyle yapılan ve “kesin öyle”, “kesin öyle değil” ve “kesin bir şey söylenemez” seçeneklerinin sunulduğu bir çalışmada bu iki çıkarımdaki doğru cevap oranı ortalama %41–48 olmuştur (Datsogianni ve ark., 2020). İkincisi inandırıcılık etkisidir: sonuç gerçek hayatta doğru göründüğünde bilgilerden çıkmasa da kabul etmek, yanlış göründüğünde bilgilerden çıksa da reddetmek. Bir çalışmada geçersiz ama inandırıcı sonuçların %92’si, geçersiz ve inandırıcı olmayanların %8’i kabul edilmiştir (Evans ve ark., 1983; aktaran Trippas ve ark., 2018). Sonucun bilgilerden çıkıp çıkmadığı ile gerçekte doğru olup olmadığının çatıştığı sorularda çocukların ve ileri yaştaki yetişkinlerin başarısı genç yetişkinlerden düşük bulunmuştur (De Neys ve Van Gelder, 2009).',
    turkishVersion: 'Özgün test. Sorular ve yönergeler Türkçe olarak yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Her sorunun doğru cevabı, soru biçimsel olarak yeniden yazılıp bilgilere uyan bütün olası durumlar tek tek denenerek bağımsızca doğrulanmıştır; kesin olmayan sonuçların hepsi bilgilerle çelişmez, yani doğru olabilir ama kesin değildir. Sonuçların inandırıcı olup olmadığı gerçek hayattaki bilgiye göre belirlenmiştir ve henüz veriyle denetlenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi tür sorularda ne kadar doğru karar verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Akıl yürütme yaşla ve deneyimle değiştiği için aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '5. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Sorular okumayı gerektirir; okumakta zorlanan biri için sonuç akıl yürütmeyi tam yansıtmayabilir.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Akıl yürütmenin yalnızca bir yönünü (sözel bilgilerden kesin sonuç çıkarmayı) ölçer; şekillerle ya da sayılarla akıl yürütme hakkında bilgi vermez.',
      'Her soruda iki seçenek olduğu için rastgele seçen biri de soruların yaklaşık yarısını doğru bulabilir; bu yüzden toplam doğru sayısından çok, hangi tür sorularda zorlanıldığı yorumlanır.',
      'Sonuç; o günkü yorgunluk, isteklilik, dikkat ve okuma hızından etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Datsogianni, A., Sodian, B., Markovits, H. ve Ufer, S. (2020). Reasoning with conditionals about everyday and mathematical concepts in primary school. Frontiers in Psychology, 11, Article 531640.',
        url: 'https://doi.org/10.3389/fpsyg.2020.531640',
      },
      {
        text: 'De Neys, W. ve Van Gelder, E. (2009). Logic and belief across the lifespan: The rise and fall of belief inhibition during syllogistic reasoning. Developmental Science, 12(1), 123–130.',
        url: 'https://doi.org/10.1111/j.1467-7687.2008.00746.x',
      },
      {
        text: 'Evans, J. St. B. T., Barston, J. L. ve Pollard, P. (1983). On the conflict between logic and belief in syllogistic reasoning. Memory & Cognition, 11(3), 295–306.',
        url: 'https://doi.org/10.3758/BF03196976',
      },
      {
        text: 'Evans, J. St. B. T., Thompson, V. A. ve Over, D. E. (2015). Uncertain deduction and conditional reasoning. Frontiers in Psychology, 6, Article 398.',
        url: 'https://doi.org/10.3389/fpsyg.2015.00398',
      },
      {
        text: 'Trippas, D., Kellen, D., Singmann, H., Pennycook, G., Koehler, D. J., Fugelsang, J. A. ve Dubé, C. (2018). Characterizing belief bias in syllogistic reasoning: A hierarchical Bayesian meta-analysis of ROC data. Psychonomic Bulletin & Review, 25(6), 2141–2174.',
        url: 'https://doi.org/10.3758/s13423-018-1460-7',
      },
    ],
  },
};
