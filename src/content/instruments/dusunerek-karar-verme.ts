import type { CognitiveReflectionTask, ReflectionDomain, ReflectionItem, ReflectionPracticeItem, ReflectionRole, TaskInstrument } from '@/lib/instruments/types';

/**
 * Düşünerek karar verme (bilişsel yansıtma): kısa bir durum ve bir soru, dört seçenek. Bütün sorular Ölçekhane'nindir.
 *
 * 16 tuzaklı soruda ilk akla gelen cevap yanlıştır (Bilişsel Yansıtma Testi'ndeki gibi; Frederick, 2005, aktaran Sirota
 * ve Juanchich, 2018): 8 sayısal (toplam ve fark, ikiye katlanma, makineler, aralık sayma, kesim, katlar, sıradaki yer,
 * kuyudaki salyangoz) ve 8 sözel (sıradaki yer, ad, "biri dışında hepsi", "kaç tane senin", olmayan bir şeyi soran
 * sorular). Sözel sorular hesaba çok az dayanır (Thomson ve Oppenheimer, 2016; Sirota ve ark., 2021).
 *
 * 8 tuzaklı sorunun bir de tuzaksız eşi vardır (De Neys, Rossi ve Houdé, 2013): aynı sayılar ya da benzer bir durum, ama
 * ilk akla gelen cevap doğrudur. Tuzaksız eşini bilip tuzaklı soruda ilk akla gelen cevabı seçmek, yanlışın soruyu
 * anlamamaktan çok cevabı denetlememekten kaynaklanmış olabileceğini düşündürür. Eşler arasında en az altı soru vardır;
 * dört eşte tuzaksız soru, dört eşte tuzaklı soru önce gelir. Tuzaksız soru önce gelen eşlerde öykü de değişir (De Neys ve
 * ark., 2013'teki gibi yüzeysel benzerlik azaltılır); böylece önce gelen soru tuzağı ele vermez.
 *
 * Seçenekler: doğru cevap, tuzak (tuzaklı soruda ilk akla gelen yanlış cevap; tuzaksız soruda tuzak varmış gibi düşününce
 * bulunan cevap) ve iki başka yanlış cevap (Sirota ve Juanchich, 2018'deki dört seçenekli biçim). Doğru seçenek her
 * harfte altı kez, tuzaklı sorularda ilk akla gelen cevap her harfte dört kez bulunur.
 *
 * tests/dusunerek-karar-verme.test.ts sayısal soruların doğru ve ilk akla gelen cevabını sorudaki sayılardan bağımsızca
 * hesaplar (tests/helpers/reflection-check.ts).
 */

interface Spec {
  key: string;
  domain: ReflectionDomain;
  role: ReflectionRole;
  /** Eşli sorularda eşinin anahtarı. */
  pair?: string;
  stem: string[];
  question: string;
  correct: string;
  /** Tuzaklı soruda ilk akla gelen cevap; tuzaksız soruda tuzak varmış gibi düşününce bulunan cevap. */
  lure: string;
  others: [string, string];
  /** Doğru seçeneğin ve tuzağın yeri (1–4); öteki iki seçenek kalan yerlere sırayla yerleşir. */
  at: [number, number];
}

const SPECS: Spec[] = [
  {
    key: 'dk01',
    domain: 'verb',
    role: 'control',
    pair: 'dk08',
    stem: ['Bir çiftçinin 12 tavuğu vardı.', 'Bir gün tavuklardan 7’si kümesten kaçtı.'],
    question: 'Kümeste kaç tavuk kaldı?',
    correct: '5 tavuk',
    lure: '7 tavuk',
    others: ['12 tavuk', '19 tavuk'],
    at: [3, 1],
  },
  {
    key: 'dk02',
    domain: 'num',
    role: 'control',
    pair: 'dk19',
    stem: ['Bir dergi ile bir muz birlikte 14 lira.', 'Dergi 10 lira.'],
    question: 'Muz kaç lira?',
    correct: '4 lira',
    lure: '2 lira',
    others: ['7 lira', '24 lira'],
    at: [1, 2],
  },
  {
    key: 'dk03',
    domain: 'verb',
    role: 'lure',
    stem: ['Bir horoz, bir evin sivri çatısının tam tepesinde yumurtluyor.', 'Rüzgâr batıdan doğuya doğru esiyor.'],
    question: 'Yumurta çatının hangi yanına düşer?',
    correct: 'Hiçbir yanına: horozlar yumurtlamaz.',
    lure: 'Çatının doğu yanına: rüzgâr onu oraya iter.',
    others: ['Çatının batı yanına: rüzgârın geldiği yana yuvarlanır.', 'Hiçbir yanına: tepede dengede kalır.'],
    at: [4, 1],
  },
  {
    key: 'dk04',
    domain: 'num',
    role: 'lure',
    stem: ['50 metre uzunluğundaki düz bir yolun bir kenarına her 10 metrede bir ağaç dikilecek.', 'Yolun başına ve sonuna da birer ağaç dikilecek.'],
    question: 'Yol boyunca toplam kaç ağaç dikilir?',
    correct: '6 ağaç',
    lure: '5 ağaç',
    others: ['4 ağaç', '10 ağaç'],
    at: [2, 3],
  },
  {
    key: 'dk05',
    domain: 'num',
    role: 'control',
    pair: 'dk13',
    stem: ['Bir usta, bir duvarı her gün aynı miktarda örüyor.', 'Duvar 20 günde bitiyor.'],
    question: 'Usta, duvarın yarısını kaç günde örer?',
    correct: '10 günde',
    lure: '19 günde',
    others: ['5 günde', '15 günde'],
    at: [1, 3],
  },
  {
    key: 'dk06',
    domain: 'verb',
    role: 'lure',
    pair: 'dk14',
    stem: ['Bir koşu yarışında üçüncü sırada koşan kişiyi geçtin.'],
    question: 'Şimdi kaçıncı sıradasın?',
    correct: 'Üçüncü sıradayım.',
    lure: 'İkinci sıradayım.',
    others: ['Birinci sıradayım.', 'Dördüncü sıradayım.'],
    at: [3, 2],
  },
  {
    key: 'dk07',
    domain: 'num',
    role: 'lure',
    pair: 'dk23',
    stem: ['Bir fabrikada 5 makine, 5 kutu bisküviyi 5 dakikada paketliyor.', 'Bütün makineler aynı hızla çalışıyor.'],
    question: '50 makine, 50 kutu bisküviyi kaç dakikada paketler?',
    correct: '5 dakikada',
    lure: '50 dakikada',
    others: ['10 dakikada', '1 dakikada'],
    at: [2, 4],
  },
  {
    key: 'dk08',
    domain: 'verb',
    role: 'lure',
    pair: 'dk01',
    stem: ['Bir çobanın 12 koyunu vardı.', 'Bir gün koyunların 7’si dışında hepsi kaçtı.'],
    question: 'Çobanın kaç koyunu kaldı?',
    correct: '7 koyun',
    lure: '5 koyun',
    others: ['12 koyun', '19 koyun'],
    at: [4, 1],
  },
  {
    key: 'dk09',
    domain: 'verb',
    role: 'lure',
    pair: 'dk18',
    stem: ['Tek katlı, pembe bir evde her şey pembe: duvarlar, kapılar, perdeler, halılar ve lambalar.'],
    question: 'Bu evin üst kata çıkan merdivenleri ne renk?',
    correct: 'Bu evde üst kat yoktur.',
    lure: 'Merdivenler de pembedir.',
    others: ['Merdivenler beyazdır.', 'Merdivenler kahverengidir.'],
    at: [1, 3],
  },
  {
    key: 'dk10',
    domain: 'num',
    role: 'control',
    pair: 'dk17',
    stem: ['Bir binadaki asansör hiç durmadan ve hep aynı hızla çıkıyor.', 'Asansör bir kat yukarı 15 saniyede çıkıyor.'],
    question: 'Asansör 4 kat yukarı kaç saniyede çıkar?',
    correct: '60 saniye',
    lure: '45 saniye',
    others: ['75 saniye', '30 saniye'],
    at: [4, 1],
  },
  {
    key: 'dk11',
    domain: 'num',
    role: 'lure',
    stem: ['Bir kütüğü testereyle enine kesip iki parçaya ayırmak 4 dakika sürüyor.', 'Her kesim aynı sürede yapılıyor ve her seferinde yalnızca bir parça kesiliyor.'],
    question: 'Aynı kalınlıkta başka bir kütüğü enine kesip dört parçaya ayırmak kaç dakika sürer?',
    correct: '12 dakika',
    lure: '8 dakika',
    others: ['16 dakika', '6 dakika'],
    at: [3, 2],
  },
  {
    key: 'dk12',
    domain: 'verb',
    role: 'lure',
    pair: 'dk22',
    stem: ['Elif’in annesinin dört çocuğu var.', 'Çocuklardan üçünün adı Bahar, Yaz ve Güz.'],
    question: 'Dördüncü çocuğun adı ne?',
    correct: 'Elif',
    lure: 'Kış',
    others: ['Nisan', 'Bilinemez'],
    at: [2, 4],
  },
  {
    key: 'dk13',
    domain: 'num',
    role: 'lure',
    pair: 'dk05',
    stem: ['Bir göletteki yosun her gün iki katına çıkıyor.', 'Yosun, göletin tamamını 20 günde kaplıyor.'],
    question: 'Yosun, göletin yarısını kaç günde kaplamıştı?',
    correct: '19 günde',
    lure: '10 günde',
    others: ['5 günde', '15 günde'],
    at: [4, 1],
  },
  {
    key: 'dk14',
    domain: 'verb',
    role: 'control',
    pair: 'dk06',
    stem: ['Bir koşu yarışında üçüncü sıradaydın ve hemen önündeki kişiyi geçtin.'],
    question: 'Şimdi kaçıncı sıradasın?',
    correct: 'İkinci sıradayım.',
    lure: 'Üçüncü sıradayım.',
    others: ['Birinci sıradayım.', 'Dördüncü sıradayım.'],
    at: [1, 4],
  },
  {
    key: 'dk15',
    domain: 'num',
    role: 'lure',
    stem: ['Bir bilet kuyruğunda Deniz, baştan sayınca 8. sırada.', 'Kuyruğun sonundan sayınca da 8. sırada.'],
    question: 'Kuyrukta kaç kişi var?',
    correct: '15 kişi',
    lure: '16 kişi',
    others: ['14 kişi', '17 kişi'],
    at: [3, 4],
  },
  {
    key: 'dk16',
    domain: 'verb',
    role: 'lure',
    stem: ['Rüzgâr kuzeyden güneye doğru esiyor.', 'Elektrikli bir tren doğuya doğru gidiyor.'],
    question: 'Trenin dumanı hangi yöne gider?',
    correct: 'Hiçbir yöne: elektrikli trenden duman çıkmaz.',
    lure: 'Güneye gider: rüzgâr onu oraya iter.',
    others: ['Batıya gider: tren doğuya ilerledikçe duman geride kalır.', 'Hiçbir yöne: duman olduğu yerde dağılır.'],
    at: [2, 3],
  },
  {
    key: 'dk17',
    domain: 'num',
    role: 'lure',
    pair: 'dk10',
    stem: [
      'Bir binada 1. kattan 3. kata merdivenle çıkmak 30 saniye sürüyor.',
      'Katlar arasındaki bütün merdivenler aynı uzunlukta ve hep aynı hızla çıkılıyor.',
    ],
    question: '1. kattan 6. kata çıkmak kaç saniye sürer?',
    correct: '75 saniye',
    lure: '60 saniye',
    others: ['90 saniye', '45 saniye'],
    at: [4, 2],
  },
  {
    key: 'dk18',
    domain: 'verb',
    role: 'control',
    pair: 'dk09',
    stem: ['İki katlı, pembe bir evde her şey pembe: duvarlar, kapılar, perdeler, halılar ve lambalar.'],
    question: 'Bu evin üst kata çıkan merdivenleri ne renk?',
    correct: 'Merdivenler de pembedir.',
    lure: 'Bu evde üst kat yoktur.',
    others: ['Merdivenler beyazdır.', 'Merdivenler kahverengidir.'],
    at: [2, 3],
  },
  {
    key: 'dk19',
    domain: 'num',
    role: 'lure',
    pair: 'dk02',
    stem: ['Bir defter ile bir kalem birlikte 14 lira.', 'Defter, kalemden 10 lira daha pahalı.'],
    question: 'Kalem kaç lira?',
    correct: '2 lira',
    lure: '4 lira',
    others: ['7 lira', '12 lira'],
    at: [1, 3],
  },
  {
    key: 'dk20',
    domain: 'verb',
    role: 'lure',
    stem: ['Bir sincap, bir kaplumbağa ve bir kuş, bir çam ağacının tepesine çıkmak için yarışıyor.'],
    question: 'Ağaçtaki elmayı ilk kim alır?',
    correct: 'Hiçbiri: çam ağacında elma olmaz.',
    lure: 'Elmayı kuş alır: tepeye uçabilir.',
    others: ['Elmayı sincap alır: ağaca en iyi o tırmanır.', 'Elmayı kaplumbağa alır: yavaş ama kararlıdır.'],
    at: [3, 1],
  },
  {
    key: 'dk21',
    domain: 'num',
    role: 'lure',
    stem: [
      'Bir salyangoz, 10 metre derinliğindeki bir kuyunun dibinde.',
      'Salyangoz her gündüz 3 metre yukarı tırmanıyor, her gece de 2 metre aşağı kayıyor.',
    ],
    question: 'Salyangoz kuyunun ağzına kaçıncı gün ulaşır?',
    correct: '8. gün',
    lure: '10. gün',
    others: ['7. gün', '9. gün'],
    at: [2, 4],
  },
  {
    key: 'dk22',
    domain: 'verb',
    role: 'control',
    pair: 'dk12',
    stem: ['Bir annenin dört çocuğu var.', 'Çocuklardan üçünün adı Bahar, Yaz ve Güz; dördüncüsüne de kalan mevsimin adı verilmiş.'],
    question: 'Dördüncü çocuğun adı ne?',
    correct: 'Kış',
    lure: 'Bilinemez',
    others: ['Nisan', 'Elif'],
    at: [4, 2],
  },
  {
    key: 'dk23',
    domain: 'num',
    role: 'control',
    pair: 'dk07',
    stem: ['Bir fabrikada 5 makine, 5 kutu bisküviyi 5 dakikada paketliyor.', 'Bütün makineler aynı hızla çalışıyor.'],
    question: 'Aynı 5 makine, 50 kutu bisküviyi kaç dakikada paketler?',
    correct: '50 dakikada',
    lure: '5 dakikada',
    others: ['10 dakikada', '25 dakikada'],
    at: [1, 4],
  },
  {
    key: 'dk24',
    domain: 'verb',
    role: 'lure',
    stem: ['Masada 5 elma vardı.', 'Sen bunlardan 3 tanesini aldın.'],
    question: 'Şimdi senin kaç elman var?',
    correct: '3 elma',
    lure: '2 elma',
    others: ['5 elma', '8 elma'],
    at: [3, 2],
  },
];

export const REFLECTION_SPECS: readonly Spec[] = SPECS;

/** Seçenekleri yerleştirir: doğru cevap ve tuzak kendi yerlerine, öteki iki seçenek kalan yerlere sırayla. */
function optionsOf(s: Pick<Spec, 'correct' | 'lure' | 'others' | 'at'>): string[] {
  const out: string[] = Array(4).fill('');
  out[s.at[0] - 1] = s.correct;
  out[s.at[1] - 1] = s.lure;
  let k = 0;
  for (let i = 0; i < 4; i++) if (!out[i]) out[i] = s.others[k++];
  return out;
}

const item = (s: Spec): ReflectionItem => ({ key: s.key, stem: s.stem, question: s.question, options: optionsOf(s) });

/** Alıştırma: tuzaksız iki soru; yalnızca cevap vermeyi öğretir. */
const PRACTICE: ReflectionPracticeItem[] = [
  {
    key: 'dkp1',
    stem: ['Bir sepette 6 elma vardı.', 'Sepete 3 elma daha konuldu.'],
    question: 'Sepette kaç elma var?',
    options: ['9 elma', '6 elma', '3 elma', '12 elma'],
    answer: 1,
    explain: 'Sepette önce 6 elma vardı; 3 elma daha konulunca 6 + 3 = 9 elma oldu.',
  },
  {
    key: 'dkp2',
    stem: ['Bugün salı.'],
    question: 'İki gün sonra hangi gün olur?',
    options: ['Çarşamba', 'Perşembe', 'Cuma', 'Pazartesi'],
    answer: 2,
    explain: 'Salıdan bir gün sonra çarşamba, iki gün sonra perşembe gelir.',
  },
];

const task: CognitiveReflectionTask = {
  key: 'dusunerek-karar-verme',
  kind: 'cognitive_reflection',
  name: 'Düşünerek Karar Verme',
  measures: 'Kısa, günlük sorularda düşünerek karar vermeyi ölçer.',
  instructions: [
    'Her soruda kısa bir durum ve bir soru göreceksin.',
    'Dört seçenekten doğru olduğunu düşündüğün cevabı seç.',
    'Süre sınırı yok; istersen kâğıt ve kalem de kullanabilirsin.',
  ],
  practice: PRACTICE,
  items: SPECS.map(item),
  answers: SPECS.map((s) => s.at[0]),
  domains: SPECS.map((s) => s.domain),
  roles: SPECS.map((s) => s.role),
  lures: SPECS.map((s) => s.at[1]),
  pairs: SPECS.map((s) => (s.pair ? SPECS.findIndex((x) => x.key === s.pair) : null)),
};

export const dusunerekKararVerme: TaskInstrument = {
  slug: 'dusunerek-karar-verme',
  version: 1,
  engine: 'tasks',
  name: 'Düşünerek Karar Verme',
  shortName: 'Düşünerek karar verme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 15,
  sortOrder: 49.9,
  tagline: 'Kısa, günlük sorularla düşünerek karar vermeyi ölçer.',
  description:
    'Bu test kısa, günlük sorularla düşünerek karar vermeyi ölçer. 24 kısa soru vardır; her sorunun dört seçeneği vardır. Soruların bir kısmı biraz hesap, bir kısmı yalnızca dikkatli okuma gerektirir. Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; soruların kaçında doğru cevaba ulaşıldığını, yanlışların neyi düşündürdüğünü ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'Kısa sorular, dört seçenek',
    paragraphs: [
      'Birazdan kısa sorular göreceksin. Her sorunun dört seçeneği var; doğru olduğunu düşündüğün seçeneği seçeceksin.',
      `Test ${SPECS.length} sorudan oluşur; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok. İstersen kâğıt ve kalem de kullanabilirsin.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'dk_dogru', name: 'Doğru cevaplar', plain: 'Soruların kaçında doğru cevaba ulaşıldığı (sayısal ve sözel sorular ayrı).' },
    { key: 'dk_yanlis', name: 'Yanlışların türü', plain: 'Yanlış cevapların neyi düşündürdüğü.' },
    { key: 'dk_es', name: 'Benzer soru çiftleri', plain: 'Benzer soru çiftlerinin karşılaştırılması.' },
    { key: 'dk_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Bilişsel Yansıtma Testi (Frederick, 2005; aktaran Sirota ve Juanchich, 2018), onun hesaba daha az dayanan (Thomson ve Oppenheimer, 2016) ve hesap gerektirmeyen (Sirota ve ark., 2021) sözel sürümleri ve çocuklara uygun sürümü (Young ve Shtulman, 2020a); dört seçenekli biçim (Sirota ve Juanchich, 2018) ve tuzaksız eş sorular (De Neys, Rossi ve Houdé, 2013). Sorular Ölçekhane tarafından özgün olarak hazırlanmıştır; ticari ya da araştırma amaçlı test setlerinin soruları, puanlama kuralları ya da normları kullanılmaz.',
    whatItMeasures:
      'Bilişsel yansıtmayı, yani ilk akla gelen ama yanlış olan cevabı fark edip durup düşünerek doğru cevaba ulaşma eğilimini ölçer. Bu tür sorularda ilk akla gelen cevap çok güçlüdür: üniversite öğrencilerinin yaklaşık %80’i, bir sopa ile bir topun fiyatını soran ünlü soruda ilk akla gelen yanlış cevabı verir (De Neys ve ark., 2013). Yanlış cevapların büyük çoğunluğu ilk akla gelen cevaptır. Düşünerek karar vermenin göstergesi doğru cevap sayısıdır; ilk akla gelen yanlış cevapların sayısı, sezgiye dayanma eğiliminin ayrı bir ölçüsü olarak geçerli bulunmamıştır (Pennycook ve ark., 2016). İlk akla gelen yanlış cevabı verenler, bu cevaba tuzaksız eş sorudaki cevaplarından daha az güvenmiştir (De Neys ve ark., 2013). Sayısal sorular hesap becerisiyle de ilişkilidir; sözel soruların hesap becerisiyle ilişkisi daha zayıftır (Thomson ve Oppenheimer, 2016; Sirota ve ark., 2021). Dört seçenekli biçim, cevabın yazıldığı biçimle benzer doğru cevap sayısı vermiş ve daha kısa sürmüştür (Sirota ve Juanchich, 2018). Okul çağındaki çocuklarla yapılan çalışmalarda çocuklara uygun sürümdeki sonuçlar, yaş hesaba katıldıktan sonra da fen ve matematik kavramlarını anlamayla ilişkili bulunmuştur (Young ve Shtulman, 2020a, 2020b). Yetişkinlerde sonuçlar zaman içinde oldukça kararlıdır (Stagnaro ve ark., 2018); bu tür soruları daha önce görmüş olmak doğru cevap sayısını artırabilir (Bialek ve Pennycook, 2018).',
    turkishVersion: 'Özgün test. Sorular ve yönergeler Türkçe olarak yazılmıştır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Sayısal soruların doğru cevapları, sorudaki sayılardan ikinci ve bağımsız bir hesapla yeniden bulunmuştur. Hangi yanlış cevabın gerçekten en sık ilk akla geldiği henüz verilerle sınanmadı.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuçlar akranlarla karşılaştırılmadan, tuzaklı ve tuzaksız sorularda ne kadar doğru cevap verildiğiyle ve yanlışların türüyle anlatılır. Zekâ puanı (IQ) verilmez.',
    ageNote:
      '5. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Sayısal soruların hesapları küçük sayılarla dört işlemle yapılabilir. Süre sınırı yoktur.',
    license: 'Özgün test. Sorular, puanlama ve rapor Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Kısa sorularla ölçer; günlük hayattaki bütün kararlar hakkında bilgi vermez.',
      'Sayısal sorularda hesap becerisi de sonucu etkiler; sözel ve tuzaksız eş sorular bu etkiyi ayırmaya yardım eder ama tamamen ortadan kaldırmaz.',
      'Bu tür soruları ya da benzerlerini daha önce görmüş olmak sonucu yükseltebilir.',
      'Sonuç; o günkü yorgunluk, isteklilik ve dikkatten etkilenebilir.',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Bialek, M. ve Pennycook, G. (2018). The cognitive reflection test is robust to multiple exposures. Behavior Research Methods, 50(5), 1953–1959.',
        url: 'https://doi.org/10.3758/s13428-017-0963-x',
      },
      {
        text: 'De Neys, W., Rossi, S. ve Houdé, O. (2013). Bats, balls, and substitution sensitivity: Cognitive misers are no happy fools. Psychonomic Bulletin & Review, 20(2), 269–273.',
        url: 'https://doi.org/10.3758/s13423-013-0384-5',
      },
      {
        text: 'Pennycook, G., Cheyne, J. A., Koehler, D. J. ve Fugelsang, J. A. (2016). Is the cognitive reflection test a measure of both reflection and intuition? Behavior Research Methods, 48(1), 341–348.',
        url: 'https://doi.org/10.3758/s13428-015-0576-1',
      },
      {
        text: 'Sirota, M., Dewberry, C., Juanchich, M., Valuš, L. ve Marshall, A. C. (2021). Measuring cognitive reflection without maths: Development and validation of the verbal cognitive reflection test. Journal of Behavioral Decision Making, 34(3), 322–343.',
        url: 'https://doi.org/10.1002/bdm.2213',
      },
      {
        text: 'Sirota, M. ve Juanchich, M. (2018). Effect of response format on cognitive reflection: Validating a two- and four-option multiple choice question version of the Cognitive Reflection Test. Behavior Research Methods, 50(6), 2511–2522.',
        url: 'https://doi.org/10.3758/s13428-018-1029-4',
      },
      {
        text: 'Stagnaro, M. N., Pennycook, G. ve Rand, D. G. (2018). Performance on the Cognitive Reflection Test is stable across time. Judgment and Decision Making, 13(3), 260–267.',
        url: 'https://doi.org/10.1017/S1930297500007695',
      },
      {
        text: 'Thomson, K. S. ve Oppenheimer, D. M. (2016). Investigating an alternate form of the cognitive reflection test. Judgment and Decision Making, 11(1), 99–113.',
        url: 'https://doi.org/10.1017/S1930297500007622',
      },
      {
        text: 'Young, A. G. ve Shtulman, A. (2020a). How children’s cognitive reflection shapes their science understanding. Frontiers in Psychology, 11, Article 1247.',
        url: 'https://doi.org/10.3389/fpsyg.2020.01247',
      },
      {
        text: 'Young, A. G. ve Shtulman, A. (2020b). Children’s cognitive reflection predicts conceptual understanding in science and mathematics. Psychological Science, 31(11), 1396–1408.',
        url: 'https://doi.org/10.1177/0956797620954449',
      },
    ],
  },
};
