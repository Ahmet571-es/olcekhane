import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Duygusal Zekâ Bileşenleri
 * Kaynak: IPIP duygusal zekâ bileşenleri ölçekleri (Barchard, 2001). Duygusal zekâyla ilişkili olabileceği düşünülen
 * yedi bileşeni Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, 9 ya da 10 maddelik kamu malı
 * ölçeklerdir: izin ve ücret gerektirmeden her amaçla kullanılabilir, çevrilebilir. Maddeler ve anahtarlar IPIP'in
 * sayfasından (https://ipip.ori.org/newEmotionalIntelligenceKey.htm), iç tutarlılık değerleri tablo sayfasından
 * (https://ipip.ori.org/newEmotionalIntelligenceTable.htm) alındı; madde sayfası iki ayrı okumayla madde madde
 * karşılaştırıldı ve iki okuma 68 maddenin hepsinde (metin ve yön) birebir aynı çıktı.
 *
 * Çıkarılan maddeler: Başkalarını önemseme (Empathic Concern) ölçeğinin suçlulara bakışla ilgili iki maddesi ("Believe
 * that criminals should receive help rather than punishment.", "Have no sympathy for criminals."; empc04 ve empc07).
 * Ceza ve suçlulara tutum konusunda siyasi ve ahlaki görüş içerdikleri için siyasi ve ahlaki görüş sormama ilkemiz
 * gereği kullanılmaz (Ayrıntılı Kişilik Profili'nden Liberalizm alt boyutunun çıkarılmasıyla aynı gerekçe). Bu ölçek
 * kalan sekiz maddeyle (dördü artı, dördü eksi yönlü) hesaplanır; böylece 66 madde kalır. Yoksullar, evsizler ve
 * işsizlerle ilgili maddeler (empc03, empc05, empc10) kalır: bir politika ya da görüş değil, zor durumdaki insanlara
 * duyulan şefkati sorarlar (uzman incelemesinde ayrıca soruldu).
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde (Altı Boyutlu, Ayrıntılı ve Beş Faktör Kişilik Profili) birebir aynı
 *    İngilizce maddeler için kullanılan çeviriler korundu (10 madde).
 *  - Kalan 56 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi
 *    (25 maddede iki taslak aynıydı). Bağımsız bir incelemeden sonra yedi madde yeniden düzenlendi: 14 yaşındaki bir
 *    öğrencinin kendini de "çocuk" sayabileceği için rjoy01 ve rjoy10'da "küçük çocuklar"; ters anlaşılabilecek
 *    rjoy06'da "uzun süre keyifsiz kalamam"; "duygularıma dikkat ederim" (kendini koruma gibi de okunabilir) yerine
 *    atte02'de "ne hissettiğime"; pexp01, atte08 ve empc08'de daha sade ve açık sözcükler.
 *  - pexp04 ("Sometimes laugh out loud when reading or watching TV."): bugünkü izleme alışkanlıklarına uysun diye
 *    "televizyon izlerken" yerine "bir şey izlerken" denir.
 *  - Bu ölçeklerin ayrı bir Türkçe uyarlaması vardır (Tatar, Saltukoğlu, Tok ve Tekin Bender, 2016, Anadolu Psikiyatri
 *    Dergisi). Ölçekhane sürümü o çalışmanın maddelerini kullanmaz.
 * Yedi ölçek ayrı ayrı puanlanır; toplam puan hesaplanmaz (duygulara göre karar verme ve üzücü olaylardan etkilenme gibi
 * ölçeklerde yüksek ya da düşük puanın daha iyi olduğu söylenemez).
 *
 * Madde anahtarı: ölçeğin kısaltması ve maddenin kaynak sayfadaki sırası (sayfa her ölçekte önce artı, sonra eksi
 * yönlü maddeleri verir; ör. pexp07). Uygulama sırası şu kuralla sabit olarak üretildi: her ölçeğin maddeleri
 * kaynaktaki sırayla, bir artı bir eksi yönlü olacak biçimde dizilir (ölçeklerden biri artı, sonraki eksi yönlü bir
 * maddeyle başlar); yedi ölçek sırayla birer madde verir (art arda gelen iki madde hiçbir zaman aynı ölçekten değildir).
 *
 * Güvenirlik: IPIP tablosunda iç tutarlılık kadınlar (N = 432) ve erkekler (N = 317) için ayrı verilir; tek bir değer
 * olmadığı ve standart sapmalar verilmediği için `alpha` ve `sdRef` yoktur; raporda ölçüm payı gösterilmez.
 * Durum: yayında; hoca 2026-10-07'de onayladı. Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const PE = 'positive_expressivity';
const NE = 'negative_expressivity';
const AE = 'attending_emotions';
const ED = 'emotion_decisions';
const RJ = 'responsive_joy';
const RD = 'responsive_distress';
const EC = 'empathic_concern';

/** Madde anahtarının ilk dört harfi (kaynaktaki ölçek) → ölçek. */
const SCALE_OF: Record<string, string> = { pexp: PE, nexp: NE, atte: AE, edec: ED, rjoy: RJ, rdis: RD, empc: EC };

/** [anahtar, ters yönlü mü, Türkçe metin, İngilizce aslı] — uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['pexp01', false, 'Sevgimi sarılarak ya da dokunarak gösteririm.', 'Express my affection physically.'],
  ['nexp06', true, 'Ne kadar mutsuz olursam olayım, duygularımı kendime saklarım.', 'Keep my feelings to myself, regardless of how unhappy I am.'],
  ['atte01', false, 'Duygularımın nedenlerini düşünürüm.', 'Think about the causes of my emotions.'],
  ['edec06', true, 'Hayatımı mantığa göre planlarım.', 'Plan my life logically.'],
  ['rjoy01', false, 'Küçük çocukları hediyelerini açarken izlemeyi severim.', 'Like to watch children open presents.'],
  ['rdis06', true, 'Gergin durumlarda bile sakinimdir.', 'Am calm even in tense situations.'],
  ['empc01', false, 'Başkalarının iyi olup olmadığını önemserim.', 'Am concerned about others.'],
  ['pexp07', true, 'İnsanlara onları önemsediğimi göstermekte zorlanırım.', 'Find it difficult showing people that I care about them.'],
  ['nexp01', false, 'Öfkelendiğimde bağırıp çağırırım.', "Shout or scream when I'm angry."],
  ['atte06', true, 'Nasıl hissettiğimi pek düşünmem.', 'Rarely think about how I feel.'],
  ['edec01', false, 'Önemli kararlar verirken duygularımı dinlerim.', 'Listen to my feelings when making important decisions.'],
  ['rjoy07', true, 'Üzgün olduğumda mutlu insanların yanında olmaktan hoşlanmam.', "Dislike being around happy people when I'm feeling sad."],
  ['rdis01', false, 'Başkalarının başına gelen kötü şeylerden derinden etkilenirim.', "Am deeply moved by others' misfortunes."],
  ['empc06', true, 'Başkalarının iyi olup olmaması beni pek ilgilendirmez.', 'Feel little concern for others.'],
  ['pexp02', false, 'Bir şey komikse kahkahayla gülerim.', 'Laugh out loud if something is funny.'],
  ['nexp07', true, 'Birine kızdığımda bunu ona göstermekte zorlanırım.', "Find it difficult showing people that I'm angry with them."],
  ['atte02', false, 'Ne hissettiğime çok dikkat ederim.', 'Pay a lot of attention to my feelings.'],
  ['edec07', true, 'Önemli kararların mantığa dayanması gerektiğine inanırım.', 'Believe important decisions should be based on logical reasoning.'],
  ['rjoy02', false, 'Çevremdekiler gülüyorsa genellikle ben de gülmeye başlarım.', 'Usually end up laughing if the people around me are laughing.'],
  ['rdis07', true, 'Olaylar karşısında kolay kolay huzursuz olmam.', 'Am not easily disturbed by events.'],
  ['empc02', false, 'Benden daha zor durumda olanlara karşı şefkat duyarım.', 'Feel sympathy for those who are worse off than myself.'],
  ['pexp08', true, 'Sevgimi göstermekte zorlanırım.', 'Have difficulty showing affection.'],
  ['nexp02', false, 'Kötü bir şey olduğunda elimde olmadan üzgün görünürüm.', "Can't help but look upset when something bad happens."],
  ['atte07', true, 'Duygularımı pek analiz etmem.', 'Rarely analyze my emotions.'],
  ['edec02', false, 'Hayattaki hedeflerimi mantık yerine ilhama göre belirlerim.', 'Base my goals in life on inspiration, rather than logic.'],
  ['rjoy08', true, 'Başkalarının mutluluğundan etkilenmem.', "Am unaffected by other people's happiness."],
  ['rdis02', false, 'Gözlerim kolayca dolar.', 'Am easily moved to tears.'],
  ['empc08', true, 'İnsanların her türlü zayıflığını küçümserim.', 'Look down on any weakness.'],
  ['pexp03', false, 'Sevincimi bir çocuk gibi gösteririm.', 'Express my happiness in a childlike manner.'],
  ['nexp08', true, 'Ne kadar korkarsam korkayım, duygularımı kendime saklarım.', 'Keep my feelings to myself, regardless of how scared I am.'],
  ['atte03', false, 'Genellikle nasıl hissettiğimin farkındayım.', "Am usually aware of the way that I'm feeling."],
  ['edec08', true, 'Kalbimden çok aklımı dinlerim.', 'Listen to my brain rather than my heart.'],
  ['rjoy03', false, 'Başkalarının sevincini ben de hissederim.', "Feel other people's joy."],
  ['rdis08', true, 'Başkalarının acı çekmesinden etkilenmem.', 'Am unaffected by the suffering of others.'],
  ['empc03', false, 'Evsizlerin durumuna üzülürüm.', 'Sympathize with the homeless.'],
  ['pexp09', true, 'Mutluluğumu kendime saklarım.', 'Keep my happy feelings to myself.'],
  ['nexp03', false, 'Korktuğumu belli ederim.', 'Show my fear.'],
  ['atte08', true, 'Kendi duygularımı pek tanımam.', 'Am not in touch with my feelings.'],
  ['edec03', false, 'Hayatımı nasıl hissettiğime göre planlarım.', 'Plan my life based on how I feel.'],
  ['rjoy09', true, 'Çevremdeki coşkuya pek kapılmam.', 'Rarely get caught up in the excitement.'],
  ['rdis03', false, 'Başkalarının derdiyle dertlenirim.', "Suffer from others' sorrows."],
  ['empc09', true, 'Başkalarının sorunlarıyla ilgilenmekten hoşlanmam.', "Don't like to get involved in other people's problems."],
  ['pexp04', false, 'Bir şey okurken ya da izlerken bazen kahkahayla gülerim.', 'Sometimes laugh out loud when reading or watching TV.'],
  ['nexp09', true, 'Öfkemi nadiren belli ederim.', 'Rarely show my anger.'],
  ['atte04', false, 'Duygularımı fark ederim.', 'Notice my emotions.'],
  ['edec09', true, 'Duygulara göre değil, gerçeklere göre karar veririm.', 'Make decisions based on facts, not feelings.'],
  ['rjoy04', false, 'Başkaları kutlama yaparken ben de o coşkuya kapılırım.', 'Get caught up in the excitement when others are celebrating.'],
  ['rdis09', true, 'Hüzünlü filmleri izlerken nadiren ağlarım.', 'Rarely cry during sad movies.'],
  ['empc05', false, 'Yoksulların şefkatimizi hak ettiğine inanırım.', 'Believe that the poor deserve our sympathy.'],
  ['pexp05', false, 'Yakın arkadaşlarıma sarılırım.', 'Hug my close friends.'],
  ['nexp04', false, 'Üzgün olduğumda yüz ifademin beni ele verdiğini düşünürüm.', 'Suspect that my facial expressions give me away when I feel sad.'],
  ['atte09', true, 'Duygularımı sık sık görmezden gelirim.', 'Often ignore my feelings.'],
  ['edec04', false, 'Duyguların hayata yön verdiğine inanırım.', 'Believe emotions give direction to life.'],
  ['rjoy10', true, 'Küçük çocukların doğum günü partilerinden hoşlanmam.', "Dislike children's birthday parties."],
  ['rdis04', false, 'Tanımadığım insanların başına gelen kötü şeylere üzülürüm.', 'Am upset by the misfortunes of strangers.'],
  ['empc10', true, 'İşsizlerin durumuna pek üzülmem.', 'Have little sympathy for the unemployed.'],
  ['pexp06', false, 'Mutlu olduğumda duygularımı belli ederim.', "Show my feelings when I'm happy."],
  ['nexp10', true, 'Keşke olumsuz duygularımı daha kolay gösterebilsem.', 'Wish I could more easily show my negative feelings.'],
  ['atte05', false, 'Sık sık durup nasıl hissettiğimi analiz ederim.', "Often stop to analyze how I'm feeling."],
  ['edec05', false, 'Aklımdan çok kalbimi dinlerim.', 'Listen to my heart rather than my brain.'],
  ['rjoy05', false, 'Başkalarının neşesinden çok etkilenirim.', 'Am strongly influenced by the good moods of others.'],
  ['rdis10', true, 'Acil durumlarda sakin kalırım.', 'Remain calm during emergencies.'],
  ['nexp05', false, 'Üzüldüğümü belli ederim.', 'Show my sadness.'],
  ['atte10', true, 'Duygusal tepkilerimi pek fark etmem.', 'Rarely notice my emotional reactions.'],
  ['rjoy06', false, 'Çevremdekiler mutluysa uzun süre keyifsiz kalamam.', 'Find it hard to stay in a bad mood if the people around me are happy.'],
  ['rdis05', false, 'Yaralı bir hayvan görsem üzülürdüm.', 'Would be upset if I saw an injured animal.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 4)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const duygusalZekaBilesenleri: LikertInstrument = {
  slug: 'duygusal-zeka-bilesenleri',
  version: 1,
  engine: 'likert',
  name: 'Duygusal Zekâ Bileşenleri',
  shortName: 'Duygusal zekâ bileşenleri',
  domain: 'skills',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 10,
  sortOrder: 60,
  tagline:
    'Duygusal zekâyla ilişkili olabilecek yedi eğilimi ölçer: duyguları fark etme ve gösterme, karar verirken duygulara kulak verme, başkalarının sevincine ve acısına ortak olma.',
  description:
    'Kamu malı IPIP ölçeklerine (Barchard, 2001) dayanan bu envanter, duygusal zekâyla ilişkili olabileceği düşünülen yedi bileşeni ölçer: olumlu ve olumsuz duyguları gösterme, duygulara dikkat etme, karar verirken duygulara kulak verme, başkalarının sevincine ortak olma, üzücü olaylardan etkilenme ve başkalarını önemseme. Bir yetenek testi değildir; kişinin duygularıyla ilgili eğilimlerini kendi gözünden anlatmasını sağlar. 66 cümleden oluşur ve yaklaşık 10 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Duygularını nasıl yaşıyorsun?',
    paragraphs: [
      'Birazdan kendi duygularınla ve başkalarının duygularıyla ilgili 66 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Bazı cümleler, acil bir durum gibi sık yaşanmayan anları anlatır. Bunlarda, öyle bir durumda nasıl davranacağını ve ne hissedeceğini düşünerek cevap ver.',
      'Doğru ya da yanlış cevap yok; bu, bir beceriyi sınayan bir test değil. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar. Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur.',
    ],
  },
  prompt: 'Bu cümle seni ne kadar doğru anlatıyor?',
  options: [
    { value: 1, label: 'Hiç doğru değil' },
    { value: 2, label: 'Pek doğru değil' },
    { value: 3, label: 'Ne doğru ne yanlış' },
    { value: 4, label: 'Oldukça doğru' },
    { value: 5, label: 'Tamamen doğru' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.75 },
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'very_low', min: 1 },
      { band: 'low', min: 1.8 },
      { band: 'average', min: 2.6 },
      { band: 'high', min: 3.4 },
      { band: 'very_high', min: 4.2 },
    ],
  },
  scales: [
    {
      key: PE,
      name: 'Olumlu duyguları gösterme',
      plain: 'Sevinci ve sevgiyi açıkça gösterme: kahkahayla gülme, sevdiklerine sarılma, onları önemsediğini belli etme.',
      poles: { low: 'Sevincini ve sevgisini içinde yaşayan', high: 'Sevincini ve sevgisini açıkça gösteren' },
    },
    {
      key: NE,
      name: 'Olumsuz duyguları gösterme',
      plain: 'Üzüntü, korku ve öfke gibi duyguları saklamadan dışa vurma.',
      poles: { low: 'Olumsuz duygularını kendine saklayan', high: 'Olumsuz duygularını dışa vuran' },
    },
    {
      key: AE,
      name: 'Duygularına dikkat etme',
      plain: 'Kendi duygularını fark etme, onlara dikkat etme ve nedenlerini düşünme.',
      poles: { low: 'Duygularının üzerinde pek durmayan', high: 'Duygularını fark edip üzerinde düşünen' },
    },
    {
      key: ED,
      name: 'Duygulara göre karar verme',
      plain: 'Karar verirken ve hayatını planlarken mantıktan çok duygularına ve içinden gelene kulak verme.',
      poles: { low: 'Mantığa ve gerçeklere göre karar veren', high: 'Duygularına göre karar veren' },
    },
    {
      key: RJ,
      name: 'Başkalarının sevincine ortak olma',
      plain: 'Çevresindeki insanların neşesinden ve coşkusundan etkilenme, onların sevincini paylaşma.',
      poles: { low: 'Başkalarının neşesinden pek etkilenmeyen', high: 'Başkalarının neşesine kolayca ortak olan' },
    },
    {
      key: RD,
      name: 'Üzücü olaylardan etkilenme',
      plain: 'Başkalarının acısından ve üzücü ya da gergin olaylardan kolayca ve derinden etkilenme.',
      poles: { low: 'Üzücü olaylardan kolay kolay sarsılmayan', high: 'Üzücü olaylardan derinden etkilenen' },
    },
    {
      key: EC,
      name: 'Başkalarını önemseme',
      plain: 'Başkalarının, özellikle zor durumdaki insanların iyiliğini önemseme ve onlara şefkat duyma.',
      poles: { low: 'Başkalarının sorunlarına mesafeli duran', high: 'Zor durumdakileri önemseyen' },
    },
  ],
  items,
  science: {
    basedOn:
      'IPIP duygusal zekâ bileşenleri ölçekleri (Barchard, 2001): duygusal zekâyla ilişkili olabileceği düşünülen yedi bileşeni Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, 9 ya da 10 maddelik kamu malı ölçekler. Kaynaktaki 68 maddeden 66’sı kullanılır.',
    whatItMeasures:
      'Kişinin duygularıyla ilgili yedi eğilimini nasıl tanımladığını ölçer: olumlu duyguları gösterme, olumsuz duyguları gösterme, duygularına dikkat etme, karar verirken duygulara kulak verme, başkalarının sevincine ortak olma, üzücü olaylardan etkilenme ve başkalarını önemseme. Duyguları doğru tanıma ya da yönetme becerisini görevlerle sınayan bir yetenek testi değildir; sonuç, kişinin kendini nasıl gördüğünü gösterir. Yedi ölçek ayrı ayrı puanlanır ve toplam bir “duygusal zekâ puanı” hesaplanmaz, çünkü duygulara göre karar verme ya da üzücü olaylardan etkilenme gibi ölçeklerde yüksek ya da düşük puanın daha iyi olduğu söylenemez.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Ölçekhane’nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (10 madde); kalan 56 madde için iki ayrı çeviri taslağı hazırlandı ve ikisi karşılaştırılarak her maddenin son hâli seçildi. Bir maddede “televizyon izlerken” yerine, bugünkü izleme alışkanlıklarına uyması için “bir şey izlerken” denir. Başkalarını önemseme ölçeğinin suçlulara bakışla ilgili iki maddesi (suçluların ceza yerine yardım görmesi gerektiğine inanma; suçlulara hiç acımama), siyasi ve ahlaki görüş sormama ilkemiz gereği kullanılmaz; bu ölçek sekiz maddeyle hesaplanır. Bu ölçeklerin ayrı bir Türkçe uyarlaması yayımlanmıştır (Tatar ve ark., 2016); Ölçekhane sürümü o çalışmanın maddelerini kullanmaz. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP sayfasında, 432 kadın ve 317 erkekten oluşan bir grupta yedi ölçeğin iç tutarlılığı (Cronbach α) kadınlarda .59 ile .81, erkeklerde .63 ile .83 arasında bildirilmiştir; en düşük değerler üzücü olaylardan etkilenme ölçeğine aittir. Ayrı bir Türkçe uyarlamada (Tatar ve ark., 2016; 18–80 yaş arası 1.754 kişi) alt ölçeklerin iç tutarlılığı .57 ile .71 arasında, 15 gün arayla 211 kişiye yapılan iki uygulamanın puanları arasındaki tutarlılık (test-tekrar test) .67 ile .80 arasında bulunmuştur. Türkçe uyarlamada en düşük değer başkalarını önemseme ölçeğine aittir (.57); bu testte o ölçekten iki madde çıkarıldığı için güvenirliği daha da düşük olabilir. Bu değerler ölçeklerin güvenirliğinin düşük ile orta arasında olduğunu gösterir. Kaynakta standart sapmalar verilmediği için raporda ölçüm payı gösterilmez. Ölçekhane çevirisinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Türkçe uyarlama çalışması 18 yaş ve üzerindeki kişilerle yapılmıştır; lise öğrencileriyle yapılmış bir güvenirlik çalışmasına ulaşılamadı. Duygusal gelişim ergenlikte sürdüğü için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Bir karşılaştırma çalışmasında, öz bildirime dayalı iki duygusal zekâ ölçeğinin, duygusal becerileri görevlerle ölçen bir testle çok zayıf ilişkili olduğu bulunmuştur (Brackett ve Mayer, 2003).',
      'Duygusal zekânın ne olduğu ve nasıl ölçülmesi gerektiği araştırmacılar arasında hâlâ tartışmalıdır; bu ölçekler duygusal zekânın kendisini değil, onunla ilişkili olabileceği düşünülen eğilimleri ölçer.',
      'Ölçekler 8–10 cümleden oluşan kısa ölçeklerdir ve güvenirlikleri düşük ile orta arasındadır; tek bir ölçeğe bakarak kesin sonuç çıkarılmamalıdır.',
      'Başkalarını önemseme ölçeğinden iki madde çıkarıldığı için kaynakta bu ölçek için bildirilen güvenirlik değeri, sekiz maddelik sürüm için doğrudan geçerli değildir.',
      'Tanı koymaz; ruh sağlığı değerlendirmesi değildir. Üzücü olaylardan etkilenme ya da olumsuz duyguları gösterme puanları bir tarama aracı değildir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki ve Türkçe uyarlamadaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Barchard, K. A. (2001). Emotional and social intelligence: Examining its place in the nomological network (Doktora tezi). University of British Columbia.',
        url: 'https://doi.org/10.14288/1.0090848',
      },
      {
        text: 'IPIP duygusal zekâ bileşenleri ölçekleri: madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newEmotionalIntelligenceKey.htm',
      },
      {
        text: 'IPIP duygusal zekâ bileşenleri ölçeklerinin güvenirlik değerleri (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newEmotionalIntelligenceTable.htm',
      },
      {
        text: 'Tatar, A., Saltukoğlu, G., Tok, S. ve Tekin Bender, M. (2016). UKMH Duygusal Zeka Testinin Türkçeye uyarlanması ve psikometrik özelliklerinin incelenmesi. Anadolu Psikiyatri Dergisi, 17(Ek 1), 5–13.',
        url: 'https://doi.org/10.5455/apd.189925',
      },
      {
        text: 'Brackett, M. A. ve Mayer, J. D. (2003). Convergent, discriminant, and incremental validity of competing measures of emotional intelligence. Personality and Social Psychology Bulletin, 29, 1147–1158.',
        url: 'https://doi.org/10.1177/0146167203254596',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
    ],
  },
};
