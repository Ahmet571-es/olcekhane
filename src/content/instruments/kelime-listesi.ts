import type { TaskInstrument, WordListTask } from '@/lib/instruments/types';

/**
 * Kelime Listesi Hatırlama
 *
 * Sözel liste öğrenme düzenine (Rey'in işitsel sözel öğrenme düzeni; Oliveira ve Charchat-Fichman, 2008) dayanan özgün
 * bir görevdir. Kelimeler ekranda yazılı gösterilir (1,5 saniye, aralarında 0,5 saniye boşluk) ve hatırlananlar yazılır
 * (lib/instruments/word-list.ts):
 *  1. İlk liste (15 kelime) üç kez, her seferinde aynı sırayla gösterilir; her gösterimden sonra hatırlanan bütün
 *     kelimeler yazılır.
 *  2. İkinci liste (15 kelime) bir kez gösterilir ve hatırlanır (araya giren liste).
 *  3. İlk liste, yeniden gösterilmeden bir kez daha hatırlanır.
 *  4. Tanıma: 35 kelime tek tek gösterilir; her biri için ilk listede olup olmadığı söylenir. 15'i ilk listedendir;
 *     20'si yanılgıdır: ikinci listeden 5, ilk listedeki bir kelimeyle anlamca yakın 5, sesi ve yazılışı benzer 5 ve
 *     ilgisiz yeni 5 kelime.
 * Başta üç kelimelik, geri bildirimli bir alıştırma vardır.
 *
 * Kelimeler Türkçede sık kullanılan, somut ve kolay yazılan adlardır. Her listede kelimeler farklı türlerdendir
 * (ör. yalnızca bir hayvan, bir meyve, bir çalgı); iki liste arasında ve tanımadaki yanılgılarla kelimeler arasında, yazılışı
 * birbirine yazım kayması sayılacak kadar yakın kelime yoktur (tests/kelime-listesi.test.ts denetler).
 *
 * Puanlama (lib/scoring/tasks.ts, scoreWordList): her denemede doğru hatırlanan farklı kelimeler; öteki listeden ya da
 * hiçbir listeden olmayan kelimeler ayrıca sayılır. Tanımada ilk listedeki kelimelere ve yanılgılara verilen "evet"
 * cevapları türlerine göre sayılır.
 */

/** İlk liste: her denemede bu sırayla gösterilir. */
const LIST_A = ['tavşan', 'pencere', 'limon', 'köprü', 'gitar', 'para', 'gömlek', 'çekiç', 'balon', 'kibrit', 'araba', 'bayrak', 'ayna', 'anahtar', 'kulak'];
/** İkinci (araya giren) liste. */
const LIST_B = ['sabun', 'havuz', 'zarf', 'tabure', 'terazi', 'dürbün', 'mendil', 'yastık', 'pusula', 'heykel', 'kupa', 'sandık', 'şemsiye', 'maske', 'sepet'];

/**
 * Tanıma bölümü, gösterilme sırasıyla. Yanılgılar: anlamca yakın (sincap–tavşan, portakal–limon, keman–gitar,
 * ceket–gömlek, otobüs–araba), sesi ve yazılışı benzer (tencere–pencere, yara–para, salon–balon, yaprak–bayrak,
 * kucak–kulak), ikinci listeden (havuz, terazi, yastık, kupa, maske) ve ilgisiz yeni (zincir, tuğla, boya, çatal, kaktüs).
 * Sıra kuralları: aynı cevap ("evet" ya da "hayır") en çok 3 kez art arda gelir; aynı türden iki yanılgı art arda
 * gelmez; bir yanılgı ile ilişkili olduğu kelime arasında en az 4 kelime vardır; ilk listedeki kelimeler ve yanılgı
 * türleri bölümün iki yarısına dengeli dağılır.
 */
const RECOGNITION: [string, WordListTask['recognitionKey'][number]][] = [
  ['anahtar', { kind: 'target', of: 13 }],
  ['kibrit', { kind: 'target', of: 9 }],
  ['tavşan', { kind: 'target', of: 0 }],
  ['maske', { kind: 'b', of: 13 }],
  ['zincir', { kind: 'new' }],
  ['terazi', { kind: 'b', of: 4 }],
  ['balon', { kind: 'target', of: 8 }],
  ['tuğla', { kind: 'new' }],
  ['bayrak', { kind: 'target', of: 11 }],
  ['limon', { kind: 'target', of: 2 }],
  ['yara', { kind: 'sound', of: 5 }],
  ['yastık', { kind: 'b', of: 7 }],
  ['salon', { kind: 'sound', of: 8 }],
  ['köprü', { kind: 'target', of: 3 }],
  ['portakal', { kind: 'semantic', of: 2 }],
  ['kucak', { kind: 'sound', of: 14 }],
  ['ceket', { kind: 'semantic', of: 6 }],
  ['para', { kind: 'target', of: 5 }],
  ['otobüs', { kind: 'semantic', of: 10 }],
  ['gitar', { kind: 'target', of: 4 }],
  ['çekiç', { kind: 'target', of: 7 }],
  ['kupa', { kind: 'b', of: 10 }],
  ['boya', { kind: 'new' }],
  ['havuz', { kind: 'b', of: 1 }],
  ['kulak', { kind: 'target', of: 14 }],
  ['gömlek', { kind: 'target', of: 6 }],
  ['tencere', { kind: 'sound', of: 1 }],
  ['ayna', { kind: 'target', of: 12 }],
  ['keman', { kind: 'semantic', of: 4 }],
  ['çatal', { kind: 'new' }],
  ['yaprak', { kind: 'sound', of: 11 }],
  ['araba', { kind: 'target', of: 10 }],
  ['kaktüs', { kind: 'new' }],
  ['sincap', { kind: 'semantic', of: 0 }],
  ['pencere', { kind: 'target', of: 1 }],
];

const task: WordListTask = {
  key: 'kelime-listesi',
  kind: 'word_list',
  name: 'Kelime Listesi Hatırlama',
  measures: 'Sözel öğrenme ve bellek: tekrarlarla bir kelime listesini öğrenebilme, öğrendiğini koruyabilme ve öğrendiği kelimeleri tanıyabilme.',
  instructions: [
    'Ekranda 15 kelime tek tek ve kısa süreyle gösterilecek. Kelimeleri okurken aklında tutmaya çalış; gösterilirken onları kâğıda ya da başka bir yere yazma.',
    'Liste bitince hatırladığın bütün kelimeleri yaz; sıra önemli değil. Aynı liste üç kez gösterilecek: her seferinde, daha önce yazdıkların da dâhil, hatırladığın bütün kelimeleri yeniden yaz.',
    'Sonra yeni bir liste göreceksin ve onu da yazacaksın. Ardından ilk listeyi, bu kez gösterilmeden, bir kez daha yazacaksın. En sonda kelimeler tek tek gelecek; her birinin ilk listede olup olmadığını söyleyeceksin.',
    'Kelimeleri gördüğün gibi yazmaya çalış. Türkçe harfleri (ç, ğ, ı, ö, ş, ü) kullanmasan da olur; uzun kelimelerde küçük bir yazım hatası da sorun değil.',
  ],
  practice: ['ekmek', 'saat', 'bardak'],
  listA: LIST_A,
  listB: LIST_B,
  learningTrials: 3,
  recognition: RECOGNITION.map(([w]) => w),
  recognitionKey: RECOGNITION.map(([, k]) => k),
  wordMs: 1500,
  gapMs: 500,
};

export const kelimeListesi: TaskInstrument = {
  slug: 'kelime-listesi-hatirlama',
  version: 1,
  engine: 'tasks',
  name: 'Kelime Listesi Hatırlama',
  shortName: 'Kelime listesi hatırlama',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 59.5,
  tagline: 'Tekrarlarla bir kelime listesini öğrenebilmeyi, araya yeni bilgi girince öğrendiğini koruyabilmeyi ve tanıyabilmeyi ölçer.',
  description:
    'Bu görev, psikolojide sözel öğrenmeyi ve belleği incelemek için dünyada yaygın olarak kullanılan liste öğrenme düzenine dayanır: 15 kelimelik bir liste üç kez gösterilir ve her seferinden sonra hatırlanan kelimeler yazılır; sonra yeni bir liste araya girer, ilk liste yeniden hatırlanır ve en sonda kelimeleri tanıma bölümü gelir. Görev yaklaşık 12 dakika sürer. Rapor; tekrarlarla ne kadar öğrenildiğini, araya giren listeden sonra öğrenilenin ne kadar korunduğunu, tanımada hangi kelimelerin karıştırıldığını ve listenin hangi kısmının daha çok hatırlandığını sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Kelimeleri aklında tut!',
    paragraphs: [
      'Birazdan ekranda kelimeler tek tek gösterilecek. Onları aklında tutmaya çalışacak, sonra hatırladıklarını yazacaksın.',
      'Görev beş kısa hatırlama bölümü ve bir tanıma bölümünden oluşur. Başta kısa bir alıştırma var.',
      'Sessiz bir yerde, kâğıt kalem kullanmadan ve dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'kl_ogrenme', name: 'Öğrenme', plain: 'Aynı liste üç kez gösterildiğinde her seferinde hatırlanan kelime sayısı ve tekrarlarla ne kadar arttığı.' },
    { key: 'kl_koruma', name: 'Öğrenileni koruma', plain: 'Araya yeni bir liste girdikten sonra ilk listeden, yeniden görmeden ne kadar hatırlandığı.' },
    { key: 'kl_tanima', name: 'Tanıma', plain: 'İlk listedeki kelimeleri, ilk listede olmayan (ikinci listedeki, benzer ya da yeni) kelimelerden ayırt edebilme.' },
    { key: 'kl_calisma', name: 'Çalışma biçimi', plain: 'Listenin başından, ortasından ve sonundan ne kadar hatırlandığı ve listede olmayan kelimelerin yazılıp yazılmadığı.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Sözel liste öğrenme düzeni: bir kelime listesi birkaç kez sunulur ve her seferinden sonra hatırlanan kelimeler söylenir; ardından yeni bir liste araya girer, ilk liste yeniden hatırlanır ve bir tanıma bölümü gelir. Rey’in işitsel sözel öğrenme düzeni olarak bilinen bu yapı, dünyada klinikte ve araştırmada yaygın olarak kullanılır; örneğin Brezilya’da 7–10 yaş arası 119 çocukla yapılan bir çalışmada 12 kelimelik bir liste dört kez sunulmuş, araya ikinci bir liste girmiş, ilk liste hemen ve 20 dakika sonra yeniden hatırlanmış, en sonda da tanıma bölümü uygulanmıştır (Oliveira ve Charchat-Fichman, 2008). Bu düzende kelimeler sesli okunur ve hatırlananlar söylenir; bu görevde ise kelimeler ekranda yazılı gösterilir, hatırlananlar yazılır ve 20 dakika sonraki hatırlama yoktur. Kelime listeleri, tanıma bölümündeki kelimeler, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari bellek testlerinin kelime listeleri, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Sözel öğrenmeyi ve belleği ölçer: tekrarlarla bir kelime listesini öğrenebilmeyi (üç denemede hatırlanan kelimeler), araya yeni bir liste girdikten sonra öğrenileni koruyabilmeyi ve öğrenilen kelimeleri yeni ya da benzer kelimelerden ayırt edebilmeyi (tanıma). Raporda ayrıca listenin başından, ortasından ve sonundan ne kadar hatırlandığı ve yanlışlıkla tanınan kelimelerin türü anlatılır. Listenin başındaki kelimeleri hatırlamak, kelimeler sunulurken öncekileri içinden tekrar etmekle ilgilidir ve bu tür tekrar çocukluk boyunca gelişir (Lehmann, 2015). 5, 7, 9 ve 11 yaş gruplarından çocuklarla yapılan bir çalışmada, birbirine anlamca yakın kelimelerden oluşan listelerden sonra listede olmayan ama anlamca yakın bir kelimeyi yanlışlıkla tanıma 5 yaş grubunda öteki gruplardan daha az görülmüş, 7, 9 ve 11 yaş grupları arasında güvenilir bir fark bulunmamıştır; 5 yaş grubundaki çocuklar ise sesçe benzer kelimelerde, anlamca yakın kelimelerdekinden daha çok yanılmıştır (Dewhurst ve ark., 2012).',
    turkishVersion:
      'Özgün görev. Kelimeler Türkçede sık kullanılan, somut ve kolay yazılan adlardan seçilmiştir; bir listedeki kelimeler farklı türlerdendir (ör. yalnızca bir hayvan, bir meyve, bir çalgı).',
    reliability:
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı. Liste her denemede aynı sırayla gösterilir; herkes aynı kelimeleri görür. Tanıma bölümünde her yanılgı türünden yalnızca 5 kelime vardır; bu yüzden türler arasındaki farklar kaba bir göstergedir. Öğrenmedeki artış ya da araya giren listeden sonraki değişim gibi iki sonuç arasındaki farklar, kişiler arasındaki farkları güvenilir biçimde ölçmekte zorlanır (Hedge ve ark., 2018); raporda bu farklar yalnızca betimleyici olarak verilir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Çocuklarda liste öğrenme yaşla gelişir: Brezilya’daki çalışmada 7 yaş grubundaki çocuklar her öğrenme denemesinde 9 ve 10 yaş gruplarındaki çocuklardan daha az kelime hatırlamış ve listeyi daha yavaş öğrenmiştir (Oliveira ve Charchat-Fichman, 2008). Bu yüzden aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Kelimeler ekranda yazılı gösterildiği ve hatırlananlar yazıldığı için okumayı ve yazmayı gerektirir; okumakta ya da yazmakta zorlanan biri için sonuç belleği tam yansıtmayabilir. Telefonda yazmak zor geliyorsa bilgisayarda ya da tablette çözülebilir. Yazım ayrıntıları (Türkçe harflerin işaretleri, çoğul eki ve beş ya da daha çok harfli kelimelerde, ilk harf doğruysa tek bir harf kayması) hata sayılmaz.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Öğrenme ya da bellekle ilgili durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Kelimeler birkaç dakika içinde hatırlanır; uzun süre sonra (ör. yarım saat ya da bir gün sonra) ne kadar hatırlandığı ölçülmez.',
      'Görev yazılı kelimelerle yapılır; duyduğunu hatırlama ya da resim, yer ve yüz gibi sözel olmayan bilgileri hatırlama hakkında tek başına bir sonuç çıkarılmamalıdır.',
      'Kelimelerin bir yere yazılması ya da ekran görüntüsünün alınması sonucu geçersiz kılar; sonuç, görevin yönergeye uygun yapıldığı varsayımıyla anlatılır.',
      'Sonuç; yorgunluk, isteklilik ve ortamdaki dikkat dağıtıcılardan etkilenir. Görev yeniden yapıldığında kelimeler tanıdık geleceği için sonuç yükselebilir.',
      'Bu görevin güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Oliveira, R. M. ve Charchat-Fichman, H. (2008). Brazilian children performance on Rey’s auditory verbal learning paradigm. Arquivos de Neuro-Psiquiatria, 66(1), 40–44.',
        url: 'https://doi.org/10.1590/S0004-282X2008000100010',
      },
      {
        text: 'Lehmann, M. (2015). Rehearsal development as development of iterative recall processes. Frontiers in Psychology, 6, 308.',
        url: 'https://doi.org/10.3389/fpsyg.2015.00308',
      },
      {
        text: 'Dewhurst, S. A., Howe, M. L., Berry, D. M. ve Knott, L. M. (2012). Test-induced priming increases false recognition in older but not younger children. Journal of Experimental Child Psychology, 111(1), 101–107.',
        url: 'https://doi.org/10.1016/j.jecp.2011.08.006',
      },
      {
        text: 'Hedge, C., Powell, G. ve Sumner, P. (2018). The reliability paradox: Why robust cognitive tasks do not produce reliable individual differences. Behavior Research Methods, 50(3), 1166–1186.',
        url: 'https://doi.org/10.3758/s13428-017-0935-1',
      },
    ],
  },
};
