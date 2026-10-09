import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Çocuk Kişilik Profili (3–5. sınıf)
 *
 * Kaynak: IPIP Beş Faktör Belirteçleri, 100 maddelik form (Goldberg, 1992; https://ipip.ori.org/newBigFive5broadKey.htm).
 * IPIP maddeleri kamu malıdır: izin ve ücret gerektirmeden kopyalanabilir, düzenlenebilir, çevrilebilir ve her amaçla
 * kullanılabilir (https://ipip.ori.org/). Beş Faktör Kişilik Profili (6. sınıftan itibaren) aynı modelin 50 maddelik
 * formunu kullanır; bu test onun 3–5. sınıflar için kısa ve çocuk diliyle yazılmış sürümüdür.
 *
 * Madde seçimi ve uyarlama (Ölçekhane, 2026):
 *  - Her boyuttan altı madde: üçü düz, üçü ters yönlü. Cümlelerin çoğuna katılma eğilimindeki kişiler arası farklar
 *    10 yaşında 20 yaşındakinin iki katı olduğu için (Soto ve ark., 2008) her boyutta iki yön eşittir; böylece bu eğilim
 *    boyut puanlarını tek bir yöne itmez.
 *  - Maddeler 8–11 yaşındaki bir çocuğun günlük hayatından somut davranışlarla yazıldı (arkadaşlar, oda, okul çantası,
 *    kitaplar). Her maddenin İngilizce aslı `source` alanındadır; uyarlama maddenin anlamını ve yönünü korur. Ters yönlü
 *    maddeler "değil" gibi olumsuzluklarla değil, öteki ucu anlatan bir davranışla yazıldı (tek istisna: "pek aldırmam").
 *    "Avoid difficult reading material" maddesi "Bilmediğim konulardaki kitaplardan uzak dururum" diye uyarlandı: bu yaşta
 *    okuma becerisi çok değiştiği için "zor kitap" demek, okumakta zorlanan bir çocuğun cevabını merak yerine okuma
 *    becerisine bağlardı. "Find it difficult to approach others" maddesinde "tanımadığım biri" yerine "tanımadığım bir
 *    çocuk" denir: çocuklara tanımadıkları yetişkinlerle konuşmamaları öğretilir.
 *  - Çocuklarla kısa anketler, kısa ve kolay anlaşılır cümleler ve daha az cevap seçeneği önerildiği için (Vicentini,
 *    Raccanello ve Burro, 2025) 30 madde ve üç seçenek kullanılır.
 *  - Her boyutta bir çift madde birbirinin tersini söyler (`oppositePairs`). Beş çiftin en az üçünde iki cümleye de aynı uç
 *    cevap verilirse raporda katılma (ya da katılmama) eğilimi uyarısı gösterilir.
 * Uygulama sırası: beş boyut sırayla döner (E, A, C, ES, I); bir turda yönler düz ve ters arasında değişir, sonraki turda
 * tersine döner. Böylece art arda iki madde hiçbir zaman aynı boyuttan değildir ve birbirinin tersi olan çiftler arasında
 * 15 madde vardır.
 *
 * Puanlama: boyut puanı, ters maddeler çevrildikten sonra cevapların ortalamasıdır (1–3). Düzey bir ondalığa yuvarlanmış
 * ortalamadan: 1,0–1,6 düşük, 1,7–2,3 orta, 2,4–3,0 yüksek (altı maddede toplam 6–9, 10–14, 15–18).
 * Güvenirlik ve norm: bu kısa formun güvenirlik ve norm çalışması henüz yapılmadı; `alpha` ve `sdRef` yoktur, raporda
 * ölçüm payı gösterilmez.
 */

const E = 'extraversion';
const A = 'agreeableness';
const C = 'conscientiousness';
const ES = 'emotional_stability';
const I = 'intellect';

/** [anahtar, ölçek, ters yönlü mü, Türkçe metin, IPIP aslı] — uygulama sırasıyla. */
const ITEMS: [string, string, boolean, string, string][] = [
  ['E1', E, false, 'Yeni tanıştığım bir çocukla konuşmayı ilk ben başlatırım.', 'Start conversations.'],
  ['A6', A, true, 'Başkalarının dertlerini dinlemek bana sıkıcı gelir.', "Am not interested in other people's problems."],
  ['C5', C, false, 'Okul çantamı bir gün önceden hazırlarım.', 'Am always prepared.'],
  ['ES4', ES, true, 'Birçok şey için endişelenirim.', 'Worry about things.'],
  ['I1', I, false, 'Hayal gücüm çok geniştir.', 'Have a vivid imagination.'],
  ['E4', E, true, 'Kalabalık bir grupta geride durmayı severim.', 'Keep in the background.'],
  ['A1', A, false, 'Bir arkadaşım üzüldüğünde ben de onun için üzülürüm.', "Sympathize with others' feelings."],
  ['C2', C, true, 'Odamı ve eşyalarımı dağınık bırakırım.', 'Leave a mess in my room.'],
  ['ES3', ES, false, 'Çoğu zaman kendimi sakin ve huzurlu hissederim.', 'Am relaxed most of the time.'],
  ['I4', I, true, 'Bir konuyu ayrıntısıyla araştırmak bana sıkıcı gelir.', 'Will not probe deeply into a subject.'],
  ['E3', E, false, 'Kolayca yeni arkadaş edinirim.', 'Make friends easily.'],
  ['A4', A, true, 'Bazen arkadaşlarımı kıracak sözler söylerim.', 'Insult people.'],
  ['C3', C, false, 'Bana verilen işleri hemen yaparım.', 'Get chores done right away.'],
  ['ES2', ES, true, 'Çabuk kızarım.', 'Get angry easily.'],
  ['I3', I, false, 'Bir şeyi yapmanın yeni yollarını bulmayı severim.', 'Love to think up new ways of doing things.'],
  ['E2', E, true, 'Tanımadığım bir çocukla konuşmaya başlamak bana zor gelir.', 'Find it difficult to approach others.'],
  ['A3', A, false, 'Başkalarına yardım etmeyi severim.', 'Love to help others.'],
  ['C4', C, true, 'Yapmam gereken işlerden kaçmaya çalışırım.', 'Shirk my duties.'],
  ['ES5', ES, false, 'Üzgün hissettiğim zamanlar azdır.', 'Seldom feel blue.'],
  ['I2', I, true, 'Bir şeyi hayal etmek bana zor gelir.', 'Have difficulty imagining things.'],
  ['E5', E, false, 'Arkadaşlarımla birlikteyken ortamı ben neşelendiririm.', 'Am the life of the party.'],
  ['A2', A, true, 'Başkalarının ne hissettiğine pek aldırmam.', 'Am indifferent to the feelings of others.'],
  ['C1', C, false, 'Odamı ve eşyalarımı toplu tutmayı severim.', 'Like to tidy up.'],
  ['ES6', ES, true, 'Çabuk üzülürüm.', 'Get upset easily.'],
  ['I5', I, false, 'Aklıma sık sık yeni fikirler gelir.', 'Am full of ideas.'],
  ['E6', E, true, 'Çoğu zaman az konuşurum.', "Don't talk a lot."],
  ['A5', A, false, 'Neredeyse herkesle iyi geçinirim.', 'Am on good terms with nearly everyone.'],
  ['C6', C, true, 'İşlerimi yarım yamalak yaparım.', 'Do things in a half-way manner.'],
  ['ES1', ES, false, 'Pek az kızarım.', 'Seldom get mad.'],
  ['I6', I, true, 'Bilmediğim konulardaki kitaplardan uzak dururum.', 'Avoid difficult reading material.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, scale, reverse, text, source]) => ({ key, scale, ...(reverse ? { reverse } : {}), text, source }));

export const cocukKisilik: LikertInstrument = {
  slug: 'cocuk-kisilik-profili',
  version: 1,
  engine: 'likert',
  name: 'Çocuk Kişilik Profili',
  shortName: 'Çocuk kişilik profili',
  domain: 'personality',
  status: 'pilot',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 3,
  maxGrade: 5,
  estimatedMinutes: 6,
  sortOrder: 8.5,
  tagline: 'Çocuğun, kişiliğin beş temel boyutunda kendini nasıl gördüğünü çocuk diliyle yazılmış 30 kısa cümleyle gösterir.',
  description:
    'Psikolojide kişiliği anlatmanın en çok araştırılmış yolu beş temel boyuttur. Bu kısa test, 3, 4 ve 5. sınıf öğrencilerinin bu beş boyutta kendilerini nasıl gördüklerini gösterir: arkadaşlarla birlikte olmaktan enerji alma (sosyallik), başkalarının duygularını önemseme ve iyi geçinme (başkalarını önemseme), düzen ve sorumluluk, sakin kalabilme (sakinlik) ile merak ve hayal gücü. Kamu malı IPIP maddelerinden çocuk diliyle uyarlanmış 30 cümleden oluşur; her cümle için üç seçenekten biri seçilir ve yaklaşık 6 dakika sürer. Rapor her boyutu sade bir dille anlatır; öğrenciye ve veliye ayrı raporlar ve bir gelişim yol haritası hazırlanır. Tanı koymaz.',
  intro: {
    title: 'Sen nasıl birisin?',
    paragraphs: [
      'Birazdan 30 kısa cümle okuyacaksın. Her cümlenin sana ne kadar benzediğini seç: hiç benzemiyor, biraz benziyor ya da çok benziyor.',
      'Bu bir sınav değil; doğru ya da yanlış cevap yok. Olmak istediğin hâli değil, genellikle nasıl olduğunu düşünerek cevap ver.',
      'Anlamadığın bir kelime olursa yanındaki yetişkine sorabilirsin, ama cevabı sen seç. Yaklaşık 6 dakika sürer.',
    ],
  },
  prompt: 'Bu cümle sana ne kadar benziyor?',
  options: [
    { value: 1, label: 'Bana hiç benzemiyor' },
    { value: 2, label: 'Bana biraz benziyor' },
    { value: 3, label: 'Bana çok benziyor' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.8 },
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'low', min: 1 },
      { band: 'average', min: 1.7 },
      { band: 'high', min: 2.4 },
    ],
  },
  scales: [
    {
      key: E,
      name: 'Sosyallik',
      plain: 'Arkadaşlarla birlikte olmaktan, konuşmaktan ve yeni arkadaşlıklar kurmaktan enerji alma (bilimsel adı: dışadönüklük).',
      poles: { low: 'Sakin, dinlemeyi seven', high: 'Konuşkan, arkadaş canlısı' },
    },
    {
      key: A,
      name: 'Başkalarını önemseme',
      plain: 'Başkalarının duygularını önemseme, yardım etmeyi sevme ve insanlarla iyi geçinme (bilimsel adı: uyumluluk).',
      poles: { low: 'Başkalarının duygularına daha az odaklanan', high: 'Yardımsever, iyi geçinen' },
    },
    {
      key: C,
      name: 'Düzen ve sorumluluk',
      plain: 'Eşyalarını düzenli tutma, işlerini hemen ve özenle yapma (bilimsel adı: sorumluluk).',
      poles: { low: 'Düzene pek takılmayan', high: 'Düzenli, işini özenle yapan' },
    },
    {
      key: ES,
      name: 'Sakinlik',
      plain: 'Çoğu zaman sakin kalabilme; kolay kolay kızmama, üzülmeme ve endişelenmeme (bilimsel adı: duygusal denge).',
      poles: { low: 'Duyguları yoğun yaşayan', high: 'Sakin, kolay sarsılmayan' },
    },
    {
      key: I,
      name: 'Merak ve hayal gücü',
      plain: 'Hayal kurmayı, yeni fikirler bulmayı ve bir konuyu merak edip araştırmayı sevme (bilimsel adı: deneyime açıklık).',
      poles: { low: 'Somut ve bildiğini seven', high: 'Meraklı, hayal gücü güçlü' },
    },
  ],
  items,
  oppositePairs: [
    ['E1', 'E2'],
    ['A1', 'A2'],
    ['C1', 'C2'],
    ['ES1', 'ES2'],
    ['I1', 'I2'],
  ],
  science: {
    basedOn:
      'IPIP Beş Faktör Belirteçleri (Goldberg, 1992; Uluslararası Kişilik Madde Havuzu). Bu belirteçlerin 100 maddelik formundan her boyut için altı madde (üçü düz, üçü ters yönlü) seçildi ve 3–5. sınıf çocuklarının anlayacağı dile uyarlandı. IPIP maddeleri kamu malıdır (Goldberg ve ark., 2006). 6. sınıftan itibaren aynı modelin 50 maddelik formu Beş Faktör Kişilik Profili’nde kullanılır.',
    whatItMeasures:
      'Kişiliğin en çok araştırılmış beş temel boyutunda çocuğun kendini nasıl gördüğünü ölçer: sosyallik (dışadönüklük), yardımseverlik (uyumluluk), düzen ve sorumluluk (sorumluluk), sakinlik (duygusal denge) ve merak ve hayal gücü (deneyime açıklık). Çocuk ve ergenlerde beş boyutu öz bildirimle ölçen anketleri inceleyen bir derlemede, incelenen 10 anketin biri dışında hepsinin 7–18 yaş arasındaki çocuk ve ergenler için geliştirildiği görülmüş; çocuklarla kısa anketlerin tercih edilmesi önerilmiş, küçük çocuklara kısa ve kolay anlaşılır cümlelerin ve daha az cevap seçeneğinin kolaylık sağladığı belirtilmiştir. İki anketin küçük çocuklar için hazırlanan sürümlerinde üç seçenekli cevap ölçeği kullanılmıştır (Vicentini, Raccanello ve Burro, 2025). Bu test 30 cümle ve üç cevap seçeneği kullanır.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından 8–11 yaşındaki çocukların günlük hayatından somut davranışlarla (arkadaşlar, oda, okul çantası, kitaplar) Türkçeye uyarlandı; her madde IPIP’teki aslının anlamını ve yönünü korur. İki maddede çocuğun güvenliği ve okuma becerisi gözetildi: “başkalarına yaklaşmakta zorlanma” maddesinde tanımadığı bir yetişkin değil bir çocuk anılır; “zor okuma metinlerinden kaçınma” maddesi, okuma becerisinden çok merakı yansıtsın diye bilmediği konulardaki kitaplar üzerinden sorulur. Ters yönlü maddeler, biri dışında, “değil” gibi olumsuzluklarla değil, öteki ucu anlatan bir davranışla yazıldı. IPIP maddeleri kamu malı olduğu için çeviri ve uyarlama serbesttir. Bu uyarlamanın Türkiye’deki çocuklarla güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    reliability:
      'Bu kısa formun güvenirlik çalışması henüz yapılmadı; kaynaktaki 10 ve 20 maddelik ölçekler yetişkinlerle geliştirilmiştir. 10–20 yaş arası 230.000’i aşkın kişinin cevaplarıyla yapılan bir çalışmada, cümlelerin çoğuna katılma eğilimindeki kişiler arası farklılığın (varyansın) 10 yaşında 20 yaşındakinin iki katı olduğu ve bir boyutun maddeleri arasındaki tutarlılığın yaşla arttığı bulunmuştur (Soto ve ark., 2008). Aynı çalışmada, katılma eğilimi denetlendikten sonra, 10 yaşındakilerde 8–10 maddelik ölçeklerin güvenirlik katsayıları .57 ile .76 arasındaydı (20 yaşında .75 ile .87); çalışmanın en küçük katılımcıları 10 yaşındaydı. Bu yüzden her boyutta maddelerin yarısı ters yönlüdür ve birbirinin tersini söyleyen beş cümle çiftinin en az üçünde iki cümleye de aynı uç cevap verilirse raporda uyarı gösterilir. Her boyut altı cümleyle ölçüldüğü için sonuçlar yaklaşıktır; raporda ölçüm payı gösterilmez.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–3 cevap aralığına göre yorumlanır: sonuç çocuğun kendini nasıl gördüğünü gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '3, 4 ve 5. sınıflar için yazılmıştır; 6. sınıftan itibaren Beş Faktör Kişilik Profili önerilir. Çocuk cümleleri kendisi okur ve cevabı kendisi seçer; anlamadığı bir kelimeyi yanındaki yetişkin, cevabı yönlendirmeden açıklayabilir.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden kopyalanabilir, düzenlenebilir, çevrilebilir ve her amaçla kullanılabilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç çocuğun kendini nasıl gördüğünü yansıtır. Bazı çocuklar cümlelerin içeriğinden bağımsız olarak çoğuna “evet” demeye yatkındır; bu eğilimdeki farklar küçük yaşlarda daha büyüktür.',
      'Kişilik çocuklukta gelişmeye devam eder; sonuç kalıcı bir etiket değildir.',
      'Her boyut altı cümleyle ölçülür; tek bir boyuta ya da tek bir cümleye bakarak kesin sonuç çıkarılmamalıdır.',
      'Tanı koymaz; ruh sağlığı, dikkat ya da davranış güçlükleri için bir değerlendirme değildir.',
      'Bu konudaki büyük çalışma (Soto ve ark., 2008) 10–20 yaşları kapsar; 8–9 yaşındaki çocukların cevaplarının ne kadar tutarlı olduğu daha az bilinmektedir.',
      'Uyarlanmış maddelerin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. Psychological Assessment, 4(1), 26–42.',
        url: 'https://doi.org/10.1037/1040-3590.4.1.26',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Soto, C. J., John, O. P., Gosling, S. D. ve Potter, J. (2008). The developmental psychometrics of Big Five self-reports: Acquiescence, factor structure, coherence, and differentiation from ages 10 to 20. Journal of Personality and Social Psychology, 94(4), 718–737.',
        url: 'https://doi.org/10.1037/0022-3514.94.4.718',
      },
      {
        text: 'Vicentini, G., Raccanello, D. ve Burro, R. (2025). Self-report questionnaires to measure Big Five personality traits in children and adolescents: A systematic review. Scandinavian Journal of Psychology, 66(5), 627–653.',
        url: 'https://doi.org/10.1111/sjop.13110',
      },
      { text: 'IPIP Big-Five Factor Markers: madde listesi ve anahtar', url: 'https://ipip.ori.org/newBigFive5broadKey.htm' },
    ],
  },
};
