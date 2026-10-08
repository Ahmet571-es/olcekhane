import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Öğrenme ve Başarı Özellikleri
 * Kaynak: Uluslararası Kişilik Madde Havuzu'nun (IPIP) kamu malı ölçeklerinden, öğrenme ve başarıyla ilişkili altı özelliği
 * ölçenler. IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir. VIA (karakter güçlü
 * yanları) kaynaklı IPIP ölçekleri kullanılmaz. Ölçekler ve kaynak sayfaları:
 *  - Çaba ve sebat: IPIP-HEXACO Diligence (Ashton, Lee ve Goldberg, 2007; https://ipip.ori.org/newHEXACO_PI_key.htm), 10 madde, α .81.
 *  - İşe hemen koyulma: Cloninger'in Mizaç ve Karakter Envanteri'ne benzeyen IPIP ön ölçeklerinden Initiative (P1;
 *    https://ipip.ori.org/newTCIKey.htm), 10 madde, .85.
 *  - Planlı ve dikkatli çalışma: Tellegen'in Çok Boyutlu Kişilik Anketi'ne benzeyen IPIP ön ölçeklerinden Planfulness (CO;
 *    https://ipip.ori.org/newMPQKey.htm), 10 maddenin 9'u, α .78.
 *  - Zorlukla başa çıkma: TCI'ya benzeyen IPIP ön ölçeklerinden Competence (P2), 9 maddenin 8'i, .75.
 *  - Düşünmekten hoşlanma: Cacioppo ve Petty'nin (1982) "bilişsel ihtiyaç" kavramını ölçen IPIP ölçeği (Need for Cognition;
 *    https://ipip.ori.org/newSingleConstructsKey.htm), 10 madde, α .84.
 *  - Öğrenmeye açıklık: Altı Faktörlü Kişilik Anketi'ne benzeyen IPIP ön ölçeklerinden Intellectual Openness (OP;
 *    https://ipip.ori.org/new6FPQKey.htm), 10 maddenin 9'u, α .80.
 * Maddeler ve anahtarlar IPIP sayfalarından iki ayrı okumayla alındı; iki okuma bütün maddelerde (metin ve yön) aynı çıktı.
 *
 * Kesişen maddeler: IPIP'te aynı madde birden çok ölçekte bulunabilir. Bu testte bir madde yalnızca bir ölçekte sorulur:
 *  - "Am exacting in my work." hem Diligence hem Planfulness'ta vardır; Çaba ve sebat'ta sorulur (plan03 kullanılmaz).
 *  - "Like to solve complex problems." hem Need for Cognition hem Competence'ta vardır; Düşünmekten hoşlanma'da sorulur
 *    (comp01 kullanılmaz).
 *  - "Try to avoid complex people." hem Need for Cognition hem Intellectual Openness'ta vardır; Düşünmekten hoşlanma'da
 *    sorulur (open09 kullanılmaz).
 * Bu üç ölçek bir eksik maddeyle hesaplanır; kaynakta bildirilen güvenirlik değerleri tam ölçekler içindir.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde (Altı Boyutlu, Ayrıntılı, Beş Faktör ve 16 Faktörlü Kişilik Profili) birebir
 *    aynı İngilizce maddeler için kullanılan çeviriler korundu (32 madde). "Have difficulty understanding abstract ideas"
 *    için iki çeviri vardır; 9. sınıftan başlayan Ayrıntılı Kişilik Profili'ndeki kısa çeviri kullanılır (Beş Faktör 6.
 *    sınıftan başladığı için açıklamalıdır).
 *  - Kalan 24 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi. Aynı
 *    testte yan yana gelebilecek benzer maddeler birbirinden ayrılsın diye "Get things done quickly" için "İşleri çabuk
 *    bitiririm", "Finish tasks quickly" için "Görevlerimi kısa sürede tamamlarım", "Start tasks right away" için
 *    "Görevlerime vakit kaybetmeden başlarım" (Çaba ve sebat'taki "Bir işi yapmaya hemen başlarım"dan ayrı) denir.
 *  - Bu ölçeklerin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 * Altı ölçek ayrı ayrı puanlanır; toplam puan hesaplanmaz.
 *
 * Madde anahtarı: ölçeğin kısaltması ve maddenin kaynak sayfadaki sırası (sayfa her ölçekte önce artı, sonra eksi yönlü
 * maddeleri verir; kullanılmayan kesişen maddenin numarası atlanır). Uygulama sırası 16 Faktörlü Kişilik Profili'ndeki
 * kuralla sabit olarak üretildi: her ölçeğin maddeleri kaynaktaki sırayla, bir artı bir eksi yönlü dizilir (ölçeklerden
 * biri artı, sonraki eksi yönlü bir maddeyle başlar); her ölçeğin k. maddesine (k + (j + 0,5) / 6) / n konumu verilir
 * (j: ölçeğin sırası, n: madde sayısı). Böylece her ölçek teste eşit aralıklarla yayılır ve art arda iki madde hiçbir
 * zaman aynı ölçekten değildir.
 *
 * Güvenirlik: IPIP sayfalarında her ölçek için tek bir iç tutarlılık değeri verilir (.75–.85); standart sapmalar
 * verilmediği ve üç ölçek bir eksik maddeyle hesaplandığı için `alpha` ve `sdRef` yoktur; raporda ölçüm payı gösterilmez.
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçekler, hoca yayındaki siteyi inceler). Türkçe
 * çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const DILI = 'diligence';
const INIT = 'initiative';
const PLAN = 'planfulness';
const COMP = 'competence';
const NCOG = 'need_for_cognition';
const OPEN = 'openness';

/** Madde anahtarının ölçek kısmı → ölçek. */
const SCALE_OF: Record<string, string> = { dili: DILI, init: INIT, plan: PLAN, comp: COMP, ncog: NCOG, open: OPEN };

/** [anahtar, ters yönlü mü, Türkçe metin, İngilizce aslı] — uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['dili01', false, 'Başarılı olmak için kendimi çok zorlarım.', 'Push myself very hard to succeed.'],
  ['init07', true, 'İşlere başlamakta zorlanırım.', 'Have difficulty starting tasks.'],
  ['plan01', false, 'Önceden plan yapmayı severim.', 'Like to plan ahead.'],
  ['comp07', true, 'Kolayca pes ederim.', 'Give up easily.'],
  ['ncog01', false, 'Karmaşık problemleri çözmeyi severim.', 'Like to solve complex problems.'],
  ['open06', true, 'Bildiğim şeylere bağlı kalmayı tercih ederim.', 'Prefer to stick with things that I know.'],
  ['dili06', true, 'Sadece idare edecek kadar çalışırım.', 'Do just enough work to get by.'],
  ['init01', false, 'İşleri çabuk bitiririm.', 'Get things done quickly.'],
  ['plan06', true, 'Düşünmeden işlere atılırım.', 'Jump into things without thinking.'],
  ['ncog07', true, 'Soyut fikirleri anlamakta zorlanırım.', 'Have difficulty understanding abstract ideas.'],
  ['comp02', false, 'Kendimi her işi yapabilecek güçte hissederim.', 'Feel up to any task.'],
  ['dili02', false, 'Bir işi yapmaya hemen başlarım.', 'Get started quickly on doing a job.'],
  ['open01', false, 'Sohbetin seviyesini yükseltirim.', 'Carry the conversation to a higher level.'],
  ['init08', true, 'Bir işe başlamam için birinin beni dürtmesi gerekir.', 'Need a push to get started.'],
  ['plan02', false, 'İşleri usulüne uygun yaparım.', 'Do things by the book.'],
  ['ncog02', false, 'Bir şeyin bana bir kez anlatılması yeter.', 'Need things explained only once.'],
  ['dili07', true, 'Yaptığım iş çok zorlaşınca bırakırım.', 'Stop when work becomes too difficult.'],
  ['comp08', true, 'Kendimi elimdeki işe veremem.', "Don't put my mind on the task at hand."],
  ['open07', true, 'Soyut fikirler ilgimi çekmez.', 'Am not interested in abstract ideas.'],
  ['init02', false, 'Yapmam gereken işleri hemen hallederim.', 'Get chores done right away.'],
  ['ncog08', true, 'Karmaşık insanlardan uzak durmaya çalışırım.', 'Try to avoid complex people.'],
  ['plan07', true, 'Aklıma estiği gibi davranmayı severim.', 'Like to act on a whim.'],
  ['dili03', false, 'Yaptığım işte titizimdir.', 'Am exacting in my work.'],
  ['init09', true, 'Oturup çalışmaya başlamak bana zor gelir.', 'Find it difficult to get down to work.'],
  ['open02', false, 'Pek çok şeye ilgi duyarım.', 'Am interested in many things.'],
  ['comp03', false, 'Birçok farklı işi yapabilirim.', 'Can perform a wide variety of tasks.'],
  ['ncog03', false, 'Çok miktarda bilgiyle başa çıkabilirim.', 'Can handle a lot of information.'],
  ['plan04', false, 'Ayrıntılara dikkat ederim.', 'Pay attention to details.'],
  ['dili08', true, 'Gereğinden az çalışırım.', 'Do too little work.'],
  ['init03', false, 'Hemen işe koyulurum.', 'Get to work at once.'],
  ['open08', true, 'Teorik tartışmalar ilgimi çekmez.', 'Am not interested in theoretical discussions.'],
  ['comp09', true, 'İşleri sonuna kadar götürmem.', "Don't see things through."],
  ['ncog09', true, 'Okuması zor metinlerden kaçınırım.', 'Avoid difficult reading material.'],
  ['plan08', true, 'Planlarımı sık sık son dakikada yaparım.', 'Often make last-minute plans.'],
  ['dili04', false, 'Çok çalışırım.', 'Work hard.'],
  ['init10', true, 'Hoşa gitmeyen işleri ertelerim.', 'Put off unpleasant tasks.'],
  ['open03', false, 'Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim.', 'Prefer variety to routine.'],
  ['ncog04', false, 'İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim.', 'Love to think up new ways of doing things.'],
  ['comp04', false, 'Zorlu görevleri kabul ederim.', 'Accept challenging tasks.'],
  ['dili09', true, 'Hiçbir şey yapmadan boş boş vakit geçiririm.', 'Hang around doing nothing.'],
  ['plan05', false, 'Plan yapar ve planıma bağlı kalırım.', 'Make plans and stick to them.'],
  ['init04', false, 'İşlere bütün gönlümle dalarım.', 'Plunge into tasks with all my heart.'],
  ['open10', true, 'Olaylarda daha derin bir anlam pek aramam.', 'Rarely look for a deeper meaning in things.'],
  ['ncog10', true, 'Felsefi tartışmalardan kaçınırım.', 'Avoid philosophical discussions.'],
  ['dili05', false, 'Üstlendiğim işleri başarıyla tamamlarım.', 'Complete tasks successfully.'],
  ['comp05', false, 'Bildiklerimi nasıl uygulayacağımı bilirim.', 'Know how to apply my knowledge.'],
  ['plan09', true, 'Aceleci kararlar veririm.', 'Make rash decisions.'],
  ['init05', false, 'Görevlerimi kısa sürede tamamlarım.', 'Finish tasks quickly.'],
  ['ncog05', false, 'Bir şeyleri çabuk kavrarım.', 'Am quick to understand things.'],
  ['open04', false, 'Bilgimi artırmak isterim.', 'Want to increase my knowledge.'],
  ['dili10', true, 'Başladığım işlere olan ilgimi çabuk kaybederim.', 'Quickly lose interest in the tasks I start.'],
  ['init06', false, 'Görevlerime vakit kaybetmeden başlarım.', 'Start tasks right away.'],
  ['plan10', true, 'İşleri birbirine karıştırırım.', 'Make a mess of things.'],
  ['comp06', false, 'Karşıma çıkan zorlukların üstesinden gelirim.', 'Meet challenges.'],
  ['ncog06', false, 'Anlamak için kafa yormam gereken metinler okumayı severim.', 'Love to read challenging material.'],
  ['open05', false, 'Değişime açığımdır.', 'Am open to change.'],
]

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, -2)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const ogrenmeVeBasari: LikertInstrument = {
  slug: 'ogrenme-ve-basari-ozellikleri',
  version: 1,
  engine: 'likert',
  name: 'Öğrenme ve Başarı Özellikleri',
  shortName: 'Öğrenme ve başarı özellikleri',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 8,
  sortOrder: 15,
  tagline:
    'Öğrenmeyle ve başarıyla ilişkili altı özelliği ölçer: çaba ve sebat, işlere ertelemeden başlama, planlı çalışma, zorluklar karşısında kendine güven, düşünmekten hoşlanma ve öğrenmeye açıklık.',
  description:
    'Kamu malı IPIP ölçeklerine dayanan bu envanter, öğrenmeyle ve başarıyla ilişkili altı özelliği ölçer: ne kadar çaba gösterildiği ve zorlanınca devam edilip edilmediği, işlere ertelemeden başlanıp başlanmadığı, planlı ve dikkatli çalışma, zor görevler karşısında kendine güven, kafa yoran işlerden hoşlanma ve yeni bilgilere açıklık. Bir yetenek ya da zekâ testi değildir; kişinin öğrenirken ve çalışırken nasıl davrandığını kendi gözünden anlatmasını sağlar. 56 cümleden oluşur ve yaklaşık 8 dakika sürer. Rapor her özelliği ayrı ayrı anlatır ve hangi alışkanlıkların işe yarayabileceğini gösteren bir gelişim yol haritası içerir. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Öğrenirken ve çalışırken nasılsın?',
    paragraphs: [
      'Birazdan çalışma, öğrenme ve başarıyla ilgili 56 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok; bu bir yetenek testi değil. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar. Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur.',
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
      key: DILI,
      name: 'Çaba ve sebat',
      plain: 'Çok çalışma, işini titizlikle yapma ve iş zorlaştığında ya da sıkıcılaştığında bırakmadan sürdürme.',
      poles: { low: 'İdare edecek kadar çalışan', high: 'Çok çalışan ve zorlanınca bırakmayan' },
    },
    {
      key: INIT,
      name: 'İşe hemen koyulma',
      plain: 'Yapılacak işlere ertelemeden başlama; başlamak için birinin dürtmesine ihtiyaç duymama ve işleri çabuk bitirme.',
      poles: { low: 'İşlere başlamakta zorlanan', high: 'İşlere ertelemeden başlayan' },
    },
    {
      key: PLAN,
      name: 'Planlı ve dikkatli çalışma',
      plain: 'Önceden plan yapma ve plana bağlı kalma, ayrıntılara dikkat etme, düşünmeden ve aceleyle harekete geçmeme.',
      poles: { low: 'Anlık ve son dakikada hareket eden', high: 'Planlı ve dikkatli çalışan' },
    },
    {
      key: COMP,
      name: 'Zorlukla başa çıkma',
      plain: 'Zor görevleri kabul etme ve üstesinden gelebileceğine güvenme; kolay pes etmeden işi sonuna kadar götürme.',
      poles: { low: 'Zorlanınca kendine güveni azalan', high: 'Zorlukları üstlenmeye hazır' },
    },
    {
      key: NCOG,
      name: 'Düşünmekten hoşlanma',
      plain: 'Karmaşık problemler, zor metinler ve kafa yoran konularla uğraşmaktan hoşlanma; kendini zor konuları kavrayabilen biri olarak görme.',
      poles: { low: 'Kafa yoran işlerden kaçınan', high: 'Kafa yoran işlerden hoşlanan' },
    },
    {
      key: OPEN,
      name: 'Öğrenmeye açıklık',
      plain: 'Yeni bilgilere, fikirlere ve değişikliğe ilgi duyma; bildiklerinin dışına çıkmaktan ve şeylerin derin anlamını aramaktan hoşlanma.',
      poles: { low: 'Bildiği yollara bağlı kalan', high: 'Yeni bilgilere ve fikirlere açık' },
    },
  ],
  items,
  science: {
    basedOn:
      'Uluslararası Kişilik Madde Havuzu’nun (IPIP) kamu malı ölçeklerinden altısı: IPIP-HEXACO çalışkanlık ölçeği (Ashton, Lee ve Goldberg, 2007), Cloninger’in Mizaç ve Karakter Envanteri’ne benzeyen IPIP ön ölçeklerinden “işe girişme” (initiative) ve “yeterlik” (competence), Tellegen’in Çok Boyutlu Kişilik Anketi’ne benzeyen ön ölçeklerden “planlılık” (planfulness), Altı Faktörlü Kişilik Anketi’ne benzeyen ön ölçeklerden “düşünsel açıklık” (intellectual openness) ve Cacioppo ve Petty’nin (1982) tanımladığı bilişsel ihtiyacı (düşünmekten hoşlanma) ölçen IPIP ölçeği. Bu envanterlerin kendi maddeleri kullanılmaz; benzer özellikler IPIP maddeleriyle ölçülür. Kaynaktaki 59 maddeden, iki ölçekte birden bulunan üç madde yalnızca birinde sorulduğu için 56 madde kullanılır.',
    whatItMeasures:
      'Kişinin öğrenirken ve çalışırken kendini nasıl tanımladığını altı özellikte ölçer: çaba ve sebat, işe hemen koyulma, planlı ve dikkatli çalışma, zorlukla başa çıkma, düşünmekten hoşlanma ve öğrenmeye açıklık. Bu özelliklere benzeyen özelliklerin öğrenmeyle ilişkisi araştırmalarda incelenmiştir: 70.000’i aşkın kişiyi kapsayan bir meta analizde sorumluluk (çalışkanlık ve düzen) özelliğinin akademik başarıyla ilişkili olduğu ve bu ilişkinin büyük ölçüde zekâdan bağımsız olduğu bulunmuştur (Poropat, 2009). Üniversite öğrencileriyle yapılan çalışmaları birleştiren bir başka meta analizde, başarıyla en güçlü ilişkili etkenlerden birinin kişinin başarabileceğine olan güveni olduğu, çaba gösterip sürdürebilmenin de orta düzeyde ilişkili olduğu görülmüştür (Richardson, Abraham ve Bond, 2012). Bir meta analizde ertelemeyle güçlü ve tutarlı biçimde ilişkili bulunan etkenler şunlardır: işin hoşa gitmemesi, işin sonucunun ya da son tarihin uzakta olması, kendine güven, dürtüsellik ve sorumluluk ile onun öz denetim, dikkatin kolay dağılması, düzen ve başarı isteği gibi yanları (Steel, 2007). Düşünmekten hoşlanma (bilişsel ihtiyaç), düşünmeye girişme ve düşünmekten keyif alma eğilimidir (Cacioppo ve Petty, 1982). Bu test bir yetenek ya da zekâ testi değildir; sonuç, kişinin kendini nasıl gördüğünü gösterir. Altı ölçek ayrı ayrı puanlanır ve toplam bir puan hesaplanmaz.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Ölçekhane’nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (32 madde); kalan 24 madde için iki ayrı çeviri taslağı hazırlandı ve ikisi karşılaştırılarak her maddenin son hâli seçildi. Bu ölçeklerin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP sayfalarında bu altı ölçeğin iç tutarlılığı (Cronbach α) .75 ile .85 arasında bildirilir: Çaba ve sebat (çalışkanlık) .81, İşe hemen koyulma (işe girişme) .85, Planlı ve dikkatli çalışma (planlılık) .78, Zorlukla başa çıkma (yeterlik) .75, Düşünmekten hoşlanma (bilişsel ihtiyaç) .84, Öğrenmeye açıklık (düşünsel açıklık) .80. Kaynak sayfalar bu değerlerin hangi gruptan elde edildiğini ayrıca belirtmez; lise öğrencileriyle yapılmış bir güvenirlik çalışmasına ulaşılamadı. Üç ölçek (Planlı ve dikkatli çalışma, Zorlukla başa çıkma, Öğrenmeye açıklık) bir eksik maddeyle hesaplandığı için kaynaktaki değerler bu ölçekler için doğrudan geçerli değildir. Kaynakta standart sapmalar verilmediği için raporda ölçüm payı gösterilmez. Ölçekhane çevirisinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Lise öğrencileriyle yapılmış bir güvenirlik çalışmasına ulaşılamadı. Kişilik ve çalışma alışkanlıkları gençlik yıllarında gelişmeye devam ettiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Başarının kendisini ya da bir yeteneği ölçmez; zekâ puanı vermez.',
      'Araştırmalarda bu özelliklerle başarı arasında bulunan ilişkiler grup ortalamalarıdır; bir kişinin başarısını tek başına önceden söylemez.',
      'Ölçekler 8–10 cümleden oluşan kısa ölçeklerdir; tek bir ölçeğe bakarak kesin sonuç çıkarılmamalıdır. Üç ölçek kaynaktakinden bir madde eksiktir.',
      'Bu özellikler değişmez değildir: alışkanlıklar ve çalışma ortamı, kişinin nasıl çalıştığını etkiler.',
      'Tanı koymaz; dikkat ya da öğrenme güçlüğü taraması değildir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Ashton, M. C., Lee, K. ve Goldberg, L. R. (2007). The IPIP–HEXACO scales: An alternative, public-domain measure of the personality constructs in the HEXACO model. Personality and Individual Differences, 42(8), 1515–1526.',
      },
      {
        text: 'Cacioppo, J. T. ve Petty, R. E. (1982). The need for cognition. Journal of Personality and Social Psychology, 42(1), 116–131.',
        url: 'https://doi.org/10.1037/0022-3514.42.1.116',
      },
      {
        text: 'Poropat, A. E. (2009). A meta-analysis of the five-factor model of personality and academic performance. Psychological Bulletin, 135(2), 322–338.',
        url: 'https://doi.org/10.1037/a0014996',
      },
      {
        text: 'Richardson, M., Abraham, C. ve Bond, R. (2012). Psychological correlates of university students’ academic performance: A systematic review and meta-analysis. Psychological Bulletin, 138(2), 353–387.',
        url: 'https://doi.org/10.1037/a0026838',
      },
      {
        text: 'Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. Psychological Bulletin, 133(1), 65–94.',
        url: 'https://doi.org/10.1037/0033-2909.133.1.65',
      },
      {
        text: 'IPIP-HEXACO ölçekleri: madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newHEXACO_PI_key.htm',
      },
      {
        text: 'Mizaç ve Karakter Envanteri’ne benzeyen IPIP ön ölçekleri: madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newTCIKey.htm',
      },
      {
        text: 'Çok Boyutlu Kişilik Anketi’ne benzeyen IPIP ön ölçekleri: madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newMPQKey.htm',
      },
      {
        text: 'Altı Faktörlü Kişilik Anketi’ne benzeyen IPIP ön ölçekleri: madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/new6FPQKey.htm',
      },
      {
        text: 'Tek kavramlı IPIP ölçekleri (bilişsel ihtiyaç dahil): madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newSingleConstructsKey.htm',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
    ],
  },
};
