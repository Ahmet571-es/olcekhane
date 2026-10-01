import { nBackSequence, rng } from '@/lib/instruments/sequences';
import type { NBackTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Geriye Dönük Hatırlama
 *
 * n-geri (n-back) düzenine dayanan özgün bir görevdir (Kirchner, 1958): harfler sabit bir hızla art arda gösterilir;
 * harf, n adım önceki harfle aynıysa düğmeye basılır. Bunu yapabilmek için son birkaç harf akılda tutulur ve her yeni
 * harfle güncellenir (çalışma belleğinin güncellenmesi). Harfler, diziler, süreler, puanlama ve rapor Ölçekhane'nindir;
 * ticari çalışma belleği testlerinin uyaranları, puanlama kuralları ya da normları kullanılmaz.
 *
 * Bölümler: bir geri (31 harf, 10 hedef), sonra iki geri (iki bölüm, her birinde 32 harf, 10 hedef ve 2 tuzak). Her n
 * düzeyinden önce geri bildirimli bir alıştırma vardır. Hedefler harflerin yaklaşık üçte biridir. İki geri bölümündeki
 * tuzaklar, bir önceki harfle aynı olan (ama iki önceki harfle aynı olmayan) harflerdir: yalnızca "tanıdık geldi" diye
 * basmayı ayırt eder. Harfler, Türkçede birbirine benzemeyen sekiz ünsüzdür. Diziler sabit bir tohumla üretilir
 * (lib/instruments/sequences.ts): herkes aynı dizileri görür. Üretim kuralı değişirse testin sürüm numarası artırılmalıdır.
 *
 * Süreler: harf 800 ms görünür, bir sonraki harf 2500 ms sonra gelir (cevap penceresi bu 2500 ms'dir). Pelegrina ve
 * arkadaşlarının (2015) 7–13 yaş normlarında bir, iki ve üç geri düzeyleri kullanılmıştır; bu görevde yalnızca bir ve
 * iki geri kullanılır: görev kısa kalsın ve sonuç 5. sınıftan itibaren yorumlanabilsin.
 *
 * Puanlama (lib/scoring/tasks.ts, scoreNBack): her düzeyde yakalama oranı (hedeflerde basma), yanlış basma oranı (hedef
 * olmayanlarda basma) ve ayırt etme (yakalama oranı eksi yanlış basma oranı). Harf göründükten sonraki ilk 150 ms'deki
 * basışlar harfe verilmiş cevap sayılmaz.
 */

/** Görevde kullanılan harfler: birbirine benzemeyen, Türkçede kolay okunan büyük ünsüzler. */
const LETTERS = ['B', 'F', 'H', 'K', 'M', 'R', 'S', 'T'];

const r = rng(20261003);
const practice1 = nBackSequence({ n: 1, length: 9, targets: 3, lures: 0, letters: LETTERS }, r);
const practice2 = nBackSequence({ n: 2, length: 12, targets: 4, lures: 1, letters: LETTERS }, r);
const block1 = nBackSequence({ n: 1, length: 31, targets: 10, lures: 0, letters: LETTERS }, r);
const block2a = nBackSequence({ n: 2, length: 32, targets: 10, lures: 2, letters: LETTERS }, r);
const block2b = nBackSequence({ n: 2, length: 32, targets: 10, lures: 2, letters: LETTERS }, r);

const nBack: NBackTask = {
  key: 'geriye-donuk',
  kind: 'n_back',
  name: 'Geriye Dönük Hatırlama',
  measures: 'Akıldaki bilgiyi sürekli güncelleyebilme: az önce gördüklerini aklında tutup her yeni harfle karşılaştırabilme (çalışma belleği).',
  instructions: [
    'Ekranda harfler tek tek, belli bir hızla belirecek. Her harfi daha önce gördüğün harflerle karşılaştıracaksın.',
    'Birinci bölümde: harf bir önceki harfle aynıysa AYNI düğmesine (ya da boşluk tuşuna) bas. Aynı değilse hiçbir şeye basma.',
    'İkinci ve üçüncü bölümde: harf iki önceki harfle aynıysa bas. Örneğin K, M, K dizisinde ikinci K’de basarsın.',
    'Her yeni kuraldan önce kısa bir alıştırma var. Ara sıra yanılmak çok normal; özellikle iki geri çoğu kişi için zordur.',
  ],
  stimulusMs: 800,
  trialMs: 2500,
  practice: [
    { n: 1, letters: practice1 },
    { n: 2, letters: practice2 },
  ],
  blocks: [
    { n: 1, letters: block1 },
    { n: 2, letters: block2a },
    { n: 2, letters: block2b },
  ],
};

export const geriyeDonukHatirlama: TaskInstrument = {
  slug: 'geriye-donuk-hatirlama',
  version: 1,
  engine: 'tasks',
  name: 'Geriye Dönük Hatırlama',
  shortName: 'Geriye dönük hatırlama',
  domain: 'cognitive',
  status: 'review',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  estimatedMinutes: 7,
  sortOrder: 59,
  tagline: 'Art arda gelen harflerde bir ya da iki önceki harfi aklında tutup karşılaştırabilmeyi, yani çalışma belleğini sürekli güncelleyebilmeyi ölçer.',
  description:
    'Bu görev, psikolojide çalışma belleğini ölçmek için yaygın olarak kullanılan “n-geri” (n-back) düzenine dayanır: harfler art arda belirir; birinci bölümde harf bir önceki harfle, sonraki iki bölümde iki önceki harfle aynıysa düğmeye basılır. Bunu yapabilmek için son harfler akılda tutulur ve her yeni harfle güncellenir. Görev üç bölümden oluşur ve yaklaşık 7 dakika sürer. Rapor; aynı harfleri yakalamayı, aynı olmayan harflerde basmamayı ve akılda tutulacak harf sayısı artınca sonucun nasıl değiştiğini sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Az önceki harf neydi?',
    paragraphs: [
      'Birazdan ekranda harfler tek tek belirecek. Harfi, bir önceki ya da iki önceki harfle karşılaştırıp aynıysa düğmeye basacaksın.',
      'Görev üç bölümden oluşur; aralarında kısa molalar var. Her yeni kuraldan önce kısa bir alıştırma yapacaksın.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'gh_bir', name: 'Bir geri', plain: 'Harfi bir önceki harfle karşılaştırma: aynı harfleri yakalama ve aynı olmayan harflerde basmama.' },
    { key: 'gh_iki', name: 'İki geri', plain: 'Harfi iki önceki harfle karşılaştırma: son iki harfi akılda tutup her yeni harfle güncelleyebilme.' },
    { key: 'gh_yuk', name: 'Zorluk artınca', plain: 'Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun ne kadar değiştiği.' },
  ],
  tasks: [nBack],
  science: {
    basedOn:
      'n-geri (n-back) düzeni: Kirchner’in (1958) art arda gelen bilgiyi kısa süre akılda tutma çalışmasından gelen ve bugün çalışma belleğini ölçmek için yaygın olarak kullanılan düzen. Harfler, diziler, süreler, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari çalışma belleği testlerinin uyaranları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Çalışma belleğinin güncellenmesini, yani az önceki bilgiyi akılda tutup yeni gelen bilgiyle sürekli karşılaştırabilmeyi ölçer. Bir geri bölümü az önceki harfi akılda tutup yeni harfle karşılaştırmayı, iki geri bölümü ise son iki harfi akılda tutup her yeni harfte bu ikiliyi güncellemeyi gerektirir. Bu beceri; zihinden işlem yapmak, uzun bir cümleyi okurken başını akılda tutmak ya da bir konuşmayı izlemek gibi durumlarda kullanılır.',
    turkishVersion: 'Özgün görev. Görev harflerle yapılır; yönergeler Türkçe yazılmıştır.',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Bir meta-analizde n-geri görevleri ile başka bir tür çalışma belleği görevi (karmaşık dizi görevleri) arasındaki ilişkinin ortalamada zayıf olduğu bulunmuştur (r = 0,20; Redick ve Lindsey, 2013). Birçok görevi bir arada inceleyen bir çalışma ise iki tür görevin de çalışma belleğinin geçerli göstergeleri olduğunu bildirir (Schmiedek ve ark., 2014). Bu yüzden bu görevin sonucu, çalışma belleğinin yalnızca bir yönünü gösterir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. İspanya’da 7–13 yaş arası 3722 çocukla yapılan bir çalışmada n-geri görevindeki başarının yaşla arttığı, aynı olanları yakalamadaki bu artışın iki geride bir geriden daha belirgin olduğu bildirilmiştir (Pelegrina ve ark., 2015). Bu yüzden bir norm yaş gruplarına göre ayrı ayrı oluşturulmalıdır.',
    ageNote:
      '5. sınıftan itibaren uygulanır. Dokunmatik ekranla, fareyle ya da klavyeyle (boşluk tuşu) yapılabilir; aynı kişinin sonuçları karşılaştırılacaksa aynı tür cihaz kullanılmalıdır.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Dikkat eksikliği ve hiperaktivite bozukluğu (DEHB) ya da öğrenme güçlüğü gibi durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Birkaç dakikalık tek bir uygulama sınırlı bilgi verir; okul başarısı ya da gündelik hayattaki bellek hakkında tek başına bir sonuç çıkarılmamalıdır.',
      'Sonuç; yorgunluk, isteklilik, ortamdaki gürültü ve cihaz gibi etkenlerden etkilenir. Görev yeniden yapıldığında alıştırma etkisi görülebilir.',
      'Bir geri bölümünde 10, iki geri bölümlerinde 20 aynı harf vardır; bir geride tek bir kaçırma ayırt etme puanını 10 puan değiştirir. Bu yüzden bir geri ile iki geri arasındaki fark, düzeylerin kendisinden daha az kesindir.',
      'Çalışma belleğini geliştirmeyi amaçlayan bilgisayarlı alıştırma programlarının etkisinin okul başarısına aktarıldığına dair güçlü bir kanıt yoktur (Melby-Lervåg ve Hulme, 2013).',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Kirchner, W. K. (1958). Age differences in short-term retention of rapidly changing information. Journal of Experimental Psychology, 55(4), 352–358.',
        url: 'https://doi.org/10.1037/h0043688',
      },
      {
        text: 'Pelegrina, S., Lechuga, M. T., García-Madruga, J. A., Elosúa, M. R., Macizo, P., Carreiras, M., Fuentes, L. J. ve Bajo, M. T. (2015). Normative data on the n-back task for children and young adolescents. Frontiers in Psychology, 6, 1544.',
        url: 'https://doi.org/10.3389/fpsyg.2015.01544',
      },
      {
        text: 'Redick, T. S. ve Lindsey, D. R. B. (2013). Complex span and n-back measures of working memory: A meta-analysis. Psychonomic Bulletin & Review, 20(6), 1102–1113.',
        url: 'https://doi.org/10.3758/s13423-013-0453-9',
      },
      {
        text: 'Schmiedek, F., Lövdén, M. ve Lindenberger, U. (2014). A task is a task is a task: Putting complex span, n-back, and other working memory indicators in psychometric context. Frontiers in Psychology, 5, 1475.',
        url: 'https://doi.org/10.3389/fpsyg.2014.01475',
      },
      {
        text: 'Melby-Lervåg, M. ve Hulme, C. (2013). Is working memory training effective? A meta-analytic review. Developmental Psychology, 49(2), 270–291.',
        url: 'https://doi.org/10.1037/a0028228',
      },
    ],
  },
};
