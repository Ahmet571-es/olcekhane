import type {
  TaskInstrument,
  VocabularyItem,
  VocabularyLure,
  VocabularyPracticeItem,
  VocabularyTask,
  VocabularyType,
} from '@/lib/instruments/types';

/**
 * Kelime bilgisi: eş anlam, zıt anlam, cümlede anlam ve deyimler; her türden altı soru, beş düzey. Bütün sorular
 * Ölçekhane'nindir. Kelimelerin ve deyimlerin anlamları Türk Dil Kurumunun Güncel Türkçe Sözlüğü ile denetlendi (doğru
 * seçenek sözlükteki anlama uyar; yanlış seçeneklerin hiçbiri sözlükte o kelimenin o cümleye uyan anlamı değildir) ve
 * sorular cevapları bilinmeden iki ayrı çözümle sınandı.
 *
 * Her sorunun bir "ilk bakışta doğru görünen" yanlış seçeneği (çeldirici) vardır: eş anlamda zıt anlamlı ya da aynı
 * konudan bir kelime, zıt anlamda eş anlamlı, cümlede anlamda kelimenin başka (çoğu zaman en bilinen) anlamı, deyimde
 * kelimelerin gerçek anlamı. Seçenekler, doğru seçeneği uzunluğuna ya da yazılışına bakarak bulmayı zorlaştıracak
 * biçimde yazıldı (tests/kelime-bilgisi.test.ts denetler).
 */
interface Spec {
  key: string;
  level: 1 | 2 | 3 | 4 | 5;
  type: VocabularyType;
  /** Eş ve zıt anlamda kelime; cümlede anlam ve deyimlerde cümle. */
  stem: string;
  /** Cümlede vurgulanan kısım (cümlede geçtiği biçimiyle). */
  mark?: string;
  /** Soruda adı geçen biçim; eş ve zıt anlamda kelimenin kendisi. */
  lemma?: string;
  /** Doğru seçenek ve sırası (1–5). */
  right: string;
  answer: number;
  /** Çeldirici, yanılgısı ve sırası. */
  lure: string;
  lureKind: VocabularyLure;
  lurePos: number;
  /** Öteki üç yanlış seçenek (boş kalan sıralara bu sırayla). */
  others: [string, string, string];
}

const SPECS: Spec[] = [
  // 1. düzey: günlük konuşmada sık kullanılan kelimeler ve bir deyim.
  { key: 'kb01', level: 1, type: 'synonym', stem: 'cevap', right: 'yanıt', answer: 3, lure: 'soru', lureKind: 'swap', lurePos: 4, others: ['haber', 'ses', 'mektup'] },
  { key: 'kb02', level: 1, type: 'antonym', stem: 'kolay', right: 'zor', answer: 4, lure: 'basit', lureKind: 'swap', lurePos: 5, others: ['hızlı', 'yeni', 'büyük'] },
  {
    key: 'kb03',
    level: 1,
    type: 'context',
    stem: 'Kazaklarımı dolabın üst gözüne yerleştirdim.',
    mark: 'gözüne',
    lemma: 'göz',
    right: 'Dolabın içindeki bölüm',
    answer: 1,
    lure: 'Yüzümüzdeki görme organı',
    lureKind: 'meaning',
    lurePos: 4,
    others: ['Dolabın açılan kapağı', 'Dolabın kilit anahtarı', 'Dolabın yerdeki ayağı'],
  },
  {
    key: 'kb04',
    level: 1,
    type: 'idiom',
    stem: 'Geç kalıyoruz, elini çabuk tut!',
    mark: 'elini çabuk tut',
    lemma: 'elini çabuk tutmak',
    right: 'acele etmek',
    answer: 4,
    lure: 'elini sıkıca tutmak',
    lureKind: 'literal',
    lurePos: 5,
    others: ['dikkatli olmak', 'sessiz olmak', 'ellerini yıkamak'],
  },
  // 2. düzey: günlük hayatta ve kitaplarda sık geçen kelimeler; cümleye göre değişen anlam; yaygın bir deyim.
  { key: 'kb05', level: 2, type: 'synonym', stem: 'misafir', right: 'konuk', answer: 5, lure: 'komşu', lureKind: 'related', lurePos: 2, others: ['akraba', 'arkadaş', 'ev sahibi'] },
  { key: 'kb06', level: 2, type: 'antonym', stem: 'cimri', right: 'cömert', answer: 1, lure: 'zengin', lureKind: 'related', lurePos: 3, others: ['pinti', 'çalışkan', 'kibar'] },
  {
    key: 'kb07',
    level: 2,
    type: 'context',
    stem: 'Babam bu yıl tarlaya buğday ekmek istiyor.',
    mark: 'ekmek',
    right: 'Tohumu toprağa atmak',
    answer: 3,
    lure: 'Fırında pişirilen yiyecek',
    lureKind: 'meaning',
    lurePos: 5,
    others: ['Ürünü toplamak', 'Tarlayı sulayıp bakmak', 'Ürünü satmak'],
  },
  {
    key: 'kb08',
    level: 2,
    type: 'idiom',
    stem: 'Uyarılarıma hiç kulak asmadı.',
    mark: 'kulak asmadı',
    lemma: 'kulak asmamak',
    right: 'önemsememek',
    answer: 2,
    lure: 'duyamamak',
    lureKind: 'literal',
    lurePos: 3,
    others: ['çok kızmak', 'hemen uymak', 'yüksek sesle konuşmak'],
  },
  { key: 'kb09', level: 2, type: 'synonym', stem: 'doktor', right: 'hekim', answer: 5, lure: 'hemşire', lureKind: 'related', lurePos: 4, others: ['hasta', 'ilaç', 'eczane'] },
  // 3. düzey: daha seyrek kelimeler; gerçek anlamından farklı kullanılan kelime ve deyim.
  { key: 'kb10', level: 3, type: 'synonym', stem: 'ihtiyaç', right: 'gereksinim', answer: 4, lure: 'imkân', lureKind: 'related', lurePos: 1, others: ['fazlalık', 'yardım', 'alışkanlık'] },
  { key: 'kb11', level: 3, type: 'antonym', stem: 'kalabalık', right: 'tenha', answer: 3, lure: 'dolu', lureKind: 'swap', lurePos: 2, others: ['geniş', 'karanlık', 'temiz'] },
  { key: 'kb12', level: 3, type: 'antonym', stem: 'geçici', right: 'kalıcı', answer: 2, lure: 'kısa süreli', lureKind: 'swap', lurePos: 3, others: ['hızlı', 'ucuz', 'yakın'] },
  {
    key: 'kb13',
    level: 3,
    type: 'context',
    stem: 'Yeni komşumuz bize çok soğuk davrandı.',
    mark: 'soğuk',
    right: 'İlgisiz ve sevgisiz',
    answer: 5,
    lure: 'Isısı düşük',
    lureKind: 'meaning',
    lurePos: 2,
    others: ['Kibar ve saygılı', 'Neşeli ve konuşkan', 'Hızlı ve telaşlı'],
  },
  {
    key: 'kb14',
    level: 3,
    type: 'idiom',
    stem: 'Arkadaşının küçük hatasına göz yumdu.',
    mark: 'göz yumdu',
    lemma: 'göz yummak',
    right: 'görmezden gelmek',
    answer: 2,
    lure: 'gözlerini kapatmak',
    lureKind: 'literal',
    lurePos: 1,
    others: ['çok kızmak', 'hatayı düzeltmek', 'herkese anlatmak'],
  },
  // 4. düzey: gazete, bilim ve iş hayatı yazılarında geçen kelimeler ve anlamlar; daha az bilinen bir deyim.
  { key: 'kb15', level: 4, type: 'synonym', stem: 'itina', right: 'özen', answer: 3, lure: 'ihmal', lureKind: 'swap', lurePos: 4, others: ['inat', 'hız', 'istek'] },
  { key: 'kb16', level: 4, type: 'antonym', stem: 'somut', right: 'soyut', answer: 4, lure: 'maddi', lureKind: 'swap', lurePos: 1, others: ['karmaşık', 'yapay', 'sınırlı'] },
  {
    key: 'kb17',
    level: 4,
    type: 'context',
    stem: 'Şirket bu yıl büyük bir açık verdi.',
    mark: 'açık',
    right: 'Gelirin gideri karşılayamaması',
    answer: 2,
    lure: 'Kapalı olmayan yer',
    lureKind: 'meaning',
    lurePos: 3,
    others: ['Fazladan kazanılan para', 'Yeni açılan bir iş yeri', 'Ürünlerde yapılan indirim'],
  },
  {
    key: 'kb18',
    level: 4,
    type: 'context',
    stem: 'Konuşmacı, toplantıda çok önemli bir noktaya değindi.',
    mark: 'noktaya',
    lemma: 'nokta',
    right: 'Ele alınan bir konu',
    answer: 1,
    lure: 'Cümle sonuna konan işaret',
    lureKind: 'meaning',
    lurePos: 5,
    others: ['Kâğıttaki küçük bir leke', 'Haritadaki bir yer', 'Toplantının başlama saati'],
  },
  {
    key: 'kb19',
    level: 4,
    type: 'idiom',
    stem: 'Yeni telefonlar çıkınca eski modellerin pabucu dama atıldı.',
    mark: 'pabucu dama atıldı',
    lemma: 'pabucu dama atılmak',
    right: 'değerini ve önemini yitirmek',
    answer: 5,
    lure: 'ayakkabıları damın üstüne atılmak',
    lureKind: 'literal',
    lurePos: 2,
    others: ['fiyatı birden artmak', 'kısa sürede bozulmak', 'yeniden moda olmak'],
  },
  // 5. düzey: çoğu yazı dilinde geçen seyrek kelimeler, soyut anlamlar ve az bilinen deyimler.
  { key: 'kb20', level: 5, type: 'synonym', stem: 'müphem', right: 'belirsiz', answer: 4, lure: 'mühim', lureKind: 'sound', lurePos: 3, others: ['açık', 'anlaşılır', 'zararlı'] },
  { key: 'kb21', level: 5, type: 'antonym', stem: 'müsrif', right: 'tutumlu', answer: 1, lure: 'savurgan', lureKind: 'swap', lurePos: 2, others: ['varlıklı', 'misafirperver', 'yardımsever'] },
  {
    key: 'kb22',
    level: 5,
    type: 'context',
    stem: 'Yazar, romanında dönemin toplumsal dokusunu başarıyla yansıtmış.',
    mark: 'dokusunu',
    lemma: 'doku',
    right: 'Toplumun genel yapısı',
    answer: 2,
    lure: 'Canlıdaki hücre topluluğu',
    lureKind: 'meaning',
    lurePos: 5,
    others: ['Toplumdaki insanların sayısı', 'Kitabın basıldığı kâğıt', 'Yazarın kendi hayatı'],
  },
  {
    key: 'kb23',
    level: 5,
    type: 'idiom',
    stem: 'Ortak işlerde hep nalıncı keseri gibi kendine yontar.',
    mark: 'nalıncı keseri gibi kendine yontar',
    lemma: 'nalıncı keseri gibi kendine yontmak',
    right: 'her işte kendi çıkarını gözetmek',
    answer: 3,
    lure: 'tahtayı keserle yontmak',
    lureKind: 'literal',
    lurePos: 1,
    others: ['herkese yardım etmek', 'işleri hep yarıda bırakmak', 'işleri çok hızlı bitirmek'],
  },
  {
    key: 'kb24',
    level: 5,
    type: 'idiom',
    stem: 'Ali, saati kendi başına onarmaya kalktı; kaş yapayım derken göz çıkardı.',
    mark: 'kaş yapayım derken göz çıkardı',
    lemma: 'kaş yapayım derken göz çıkarmak',
    right: 'düzelteyim derken işi büsbütün bozmak',
    answer: 1,
    lure: 'resim çizerken kaşı ve gözü karıştırmak',
    lureKind: 'literal',
    lurePos: 4,
    others: ['işi yarıda bırakıp başkasına devretmek', 'işi bitirmek için yardım istemek', 'işi beklenenden de güzel bitirmek'],
  },
];

type PracticeSpec = Omit<Spec, 'level' | 'lureKind'> & { explain: string };

const PRACTICE_SPECS: PracticeSpec[] = [
  {
    key: 'kbp1',
    type: 'synonym',
    stem: 'hızlı',
    right: 'çabuk',
    answer: 2,
    lure: 'yavaş',
    lurePos: 4,
    others: ['ağır', 'yorgun', 'kolay'],
    explain:
      '“Hızlı” ile “çabuk” aynı anlama gelir: ikisi de kısa sürede olan, süratli demektir. “Yavaş” ise “hızlı” kelimesinin zıt anlamlısıdır; eş anlamlıyı ararken zıt anlamlıyla karıştırmamaya dikkat et.',
  },
  {
    key: 'kbp2',
    type: 'antonym',
    stem: 'sıcak',
    right: 'soğuk',
    answer: 3,
    lure: 'kaynar',
    lurePos: 1,
    others: ['yumuşak', 'kuru', 'tatlı'],
    explain: '“Sıcak” kelimesinin zıt anlamlısı “soğuk”tur. “Kaynar” ise çok sıcak demektir; “sıcak” kelimesine yakın bir kelimedir, zıttı değildir.',
  },
  {
    key: 'kbp3',
    type: 'context',
    stem: 'Sandalyenin bir ayağı kırılmış.',
    mark: 'ayağı',
    lemma: 'ayak',
    right: 'Sandalyenin yere basan alt parçası',
    answer: 1,
    lure: 'Bacağımızın ucundaki organ',
    lurePos: 2,
    others: ['Sandalyenin arkalığı', 'Sandalyenin oturulan yeri', 'Sandalyenin kolu'],
    explain:
      'Bir kelimenin birden çok anlamı olabilir. “Ayak” çoğu zaman bacağımızın ucundaki organdır; ama bu cümlede sandalyenin yere basan parçası anlamında kullanılmıştır. Hangi anlamın kastedildiğini cümlenin bütünü gösterir.',
  },
  {
    key: 'kbp4',
    type: 'idiom',
    stem: 'Hediyesini görünce ağzı kulaklarına vardı.',
    mark: 'ağzı kulaklarına vardı',
    lemma: 'ağzı kulaklarına varmak',
    right: 'çok sevinmek',
    answer: 5,
    lure: 'ağzını kocaman açmak',
    lurePos: 3,
    others: ['çok üzülmek', 'çok yorulmak', 'çok acıkmak'],
    explain: 'Deyimler, içindeki kelimelerin tek tek anlamından farklı bir anlam taşır. “Ağzı kulaklarına varmak” ağzını kocaman açmak değil, çok sevinmek demektir.',
  },
];

/** Seçenekler: doğru seçenek `answer` sırasında, çeldirici `lurePos` sırasında, ötekiler kalan sıralarda. */
function options(s: Pick<Spec, 'right' | 'answer' | 'lure' | 'lurePos' | 'others'>): string[] {
  const rest = [...s.others];
  return [1, 2, 3, 4, 5].map((pos) => (pos === s.answer ? s.right : pos === s.lurePos ? s.lure : rest.shift()!));
}

function item(s: Spec | PracticeSpec, level: 1 | 2 | 3 | 4 | 5): VocabularyItem {
  return {
    key: s.key,
    level,
    type: s.type,
    stem: s.stem,
    ...(s.mark ? { mark: s.mark } : {}),
    lemma: s.lemma ?? s.mark ?? s.stem,
    options: options(s),
  };
}

export const VOCABULARY_SPECS: readonly Spec[] = SPECS;

const practice: VocabularyPracticeItem[] = PRACTICE_SPECS.map((p) => ({ ...item(p, 1), answer: p.answer, explain: p.explain }));

const task: VocabularyTask = {
  key: 'kelime-bilgisi',
  kind: 'vocabulary',
  name: 'Kelime Bilgisi',
  measures: 'Türkçe kelimelerin ve deyimlerin anlamlarını bilmeyi ölçer: eş ve zıt anlam, cümlede anlam ve deyimler.',
  instructions: [
    'Her soruda bir kelime ya da içinde bir kelimenin veya deyimin vurgulandığı bir cümle göreceksin. Soruya göre kelimenin eş anlamlısını, zıt anlamlısını ya da cümlede hangi anlamda kullanıldığını beş seçenekten seç.',
    'Bilmediğin bir kelimede tahmin edebilirsin; ama önce cümleyi ve seçeneklerin hepsini dikkatle oku.',
    'Sorular kolaydan zora doğru gider; sona doğru zorlanman olağandır. Süre sınırı yok.',
    'Önce doğru cevabı gösterilen dört alıştırma sorusu çözeceksin.',
  ],
  practice,
  items: SPECS.map((s) => item(s, s.level)),
  answers: SPECS.map((s) => s.answer),
  lures: SPECS.map((s) => s.lurePos),
  lureKinds: SPECS.map((s) => s.lureKind),
  levels: [
    { level: 1, name: '1. düzey', plain: 'Günlük konuşmada sık kullanılan kelimeleri, bir kelimenin sık kullanılan anlamlarını ve yaygın bir deyimi bilmek.' },
    {
      level: 2,
      name: '2. düzey',
      plain: 'Günlük hayatta ve kitaplarda sık geçen kelimelerin eş ve zıt anlamlılarını, cümleye göre değişen anlamlarını ve yaygın deyimleri bilmek.',
    },
    { level: 3, name: '3. düzey', plain: 'Daha seyrek geçen kelimeleri, kelimelerin mecaz anlamlarını ve deyimlerin anlamını bilmek.' },
    { level: 4, name: '4. düzey', plain: 'Gazete, bilim ve iş hayatı yazılarında geçen kelimeleri, bu alanlara özgü anlamları ve daha az bilinen deyimleri bilmek.' },
    { level: 5, name: '5. düzey', plain: 'Çoğu yazı dilinde geçen seyrek kelimeleri, soyut anlamları ve az bilinen deyimleri bilmek.' },
  ],
};

export const kelimeBilgisi: TaskInstrument = {
  slug: 'kelime-bilgisi',
  version: 1,
  engine: 'tasks',
  name: 'Kelime Bilgisi',
  shortName: 'Kelime bilgisi',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 8,
  sortOrder: 49.9,
  tagline: 'Türkçe kelimelerin ve deyimlerin anlamlarını ne kadar bildiğini ölçer: eş ve zıt anlam, cümlede anlam ve deyimler.',
  description:
    'Bu test, Türkçe kelime bilgisini dört soru türüyle ölçer: bir kelimenin eş anlamlısını ve zıt anlamlısını bulmak, birden çok anlamı olan bir kelimenin cümlede hangi anlamda kullanıldığını ayırt etmek ve deyimlerin anlamını bilmek. Sorular günlük konuşmadaki kelimelerden yazı dilindeki seyrek kelimelere doğru beş düzeyde ilerler ve Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; kaç sorunun doğru cevaplandığını, hangi düzeye kadar ulaşıldığını, hangi soru türlerinin daha kolay geldiğini, yanlış cevapların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Kelimelerin anlamını bul',
    paragraphs: [
      'Birazdan kelimeler ve cümleler göreceksin. Her soruda kelimenin ya da deyimin anlamına en uygun seçeneği beş seçenekten seçeceksin.',
      `Test ${SPECS.length} sorudan oluşur ve kolaydan zora doğru ilerler. Süre sınırı yok.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'kb_dogru', name: 'Doğru cevaplar', plain: 'Kelimenin ya da deyimin anlamına uyan seçeneğin seçildiği soruların sayısı.' },
    { key: 'kb_duzey', name: 'Ulaşılan düzey', plain: 'Soruların en az %60’ının doğru cevaplandığı en yüksek düzey; o düzeye kadarki soruların da en az %60’ı doğru olmalıdır.' },
    { key: 'kb_tur', name: 'Soru türleri', plain: 'Eş anlam, zıt anlam, cümlede anlam ve deyim sorularından hangilerinin daha kolay, hangilerinin daha zor geldiği.' },
    { key: 'kb_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve zor sorularda acele edilip edilmediği.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Kelime bilgisi, okuduğunu anlamanın temel taşlarından biridir. Nation’ın (2009) derlediği araştırmalara göre kelime bilgisi ile okuduğunu anlama arasındaki ilişki güçlüdür, çocuklar büyüdükçe artar ve iki yönlüdür: kelime bilgisi okumayı kolaylaştırır, okumak da yeni kelimeler öğrenmenin temel yollarından biridir. Bir kelimeyi bilmek “biliyor ya da bilmiyor” kadar basit değildir; bir kelimenin birden çok anlamını ve deyimleri anlamak da kelime bilgisinin parçasıdır. Bu yüzden test, eş ve zıt anlamın yanında cümlede anlamı ve deyimleri de sorar. Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır; kelimelerin ve deyimlerin anlamları Türk Dil Kurumunun Güncel Türkçe Sözlüğü ile denetlenmiştir.',
    whatItMeasures:
      'Türkçe kelime bilgisini ölçer: kelimelerin eş ve zıt anlamlılarını bilmeyi, birden çok anlamı olan bir kelimenin cümlede hangi anlamda kullanıldığını ayırt etmeyi ve deyimlerin anlamını bilmeyi. Wright ve Cervetti’nin (2017) incelediği araştırmalarda kelimelerin anlamlarını öğretmek, hemen her durumda o kelimelerin geçtiği metinleri anlamayı desteklemiştir; kelimeleri etkin biçimde işlemek (kullanmak, üzerine konuşmak) yalnızca tanımını vermekten genellikle daha etkili bulunmuştur. Aynı inceleme, kelime öğretiminin öğretilmeyen kelimelerin geçtiği metinleri anlamaya da yansıdığına dair kanıtın sınırlı olduğunu bildirir.',
    turkishVersion: 'Özgün test. Sorular Türkçe olarak hazırlanmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sorular, kelimelerin ne kadar sık kullanıldığına ve anlamların ne kadar soyut olduğuna göre kolaydan zora beş düzeye ayrılmıştır; bu sıralama Ölçekhane’nin tasarımıdır ve henüz veriyle denetlenmedi. Her sorudaki kelimelerin ve deyimlerin anlamları Türk Dil Kurumunun Güncel Türkçe Sözlüğü ile denetlendi; sorular, cevapları bilinmeden yapılan iki ayrı çözümle de sınandı ve iki çözüm de her soruda yalnızca doğru seçeneği buldu. Seçenekler, doğru seçeneği en uzun ya da en kısa seçenek olmasından bulmayı zorlaştıracak biçimde yazıldı.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, hangi düzeydeki ve hangi türdeki sorularda ne kadar doğru cevap verildiğiyle anlatılır. Zekâ puanı (IQ) verilmez. Kelime bilgisi yaşla, okuma alışkanlığıyla ve yaşanılan çevreyle birlikte gelişir; aynı sonuç farklı yaşlarda farklı anlama gelir.',
    ageNote:
      '3. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Süre sınırı yoktur. Üst düzeylerdeki kelimeler ve deyimler daha çok yetişkinlerin okuduğu yazılarda geçer; küçük sınıflarda bu sorularda zorlanmak beklenen bir durumdur.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Türkçe kelime bilgisinin yalnızca küçük bir örneğini (24 soru) ölçer; bir kişinin bildiği kelimelerin tamamını göstermez. Kelimeleri konuşurken ve yazarken kullanabilmeyi, yazım ya da dil bilgisi bilgisini ölçmez.',
      'Kelime bilgisi; okuma alışkanlığından, evde ve çevrede konuşulan dilden ve Türkçenin ana dil olup olmamasından etkilenir. Türkçeyi sonradan öğrenen ya da evde başka bir dil konuşan biri için sonuç, düşünme becerisini değil Türkçe kelime bilgisini gösterir.',
      'Sonuç; o günkü yorgunluk, isteklilik ve dikkatten etkilenir. Test yeniden çözüldüğünde soruları hatırlamak sonucu yükseltebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Nation, K. (2009). Reading comprehension and vocabulary: What’s the connection? R. K. Wagner, C. Schatschneider ve C. Phythian-Sence (Ed.), Beyond decoding: The behavioral and biological foundations of reading comprehension içinde. Guilford Press.',
        url: 'https://readoxford.site.ox.ac.uk/article/reading-comprehension-and-vocab-connection',
      },
      {
        text: 'Wright, T. S. ve Cervetti, G. N. (2017). A systematic review of the research on vocabulary instruction that impacts text comprehension. Reading Research Quarterly, 52(2), 203–226.',
        url: 'https://doi.org/10.1002/rrq.163',
      },
      { text: 'Türk Dil Kurumu. (t.y.). Güncel Türkçe Sözlük.', url: 'https://sozluk.gov.tr/' },
    ],
  },
};
