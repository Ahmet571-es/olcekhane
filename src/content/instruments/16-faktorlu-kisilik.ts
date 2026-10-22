import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * 16 Faktörlü Kişilik Profili
 * Kaynak: IPIP 16PF ölçekleri: Cattell'in 16 Kişilik Faktörü Anketi'nin (16PF) ölçtüğü özelliklere benzeyen
 * 16 özelliği Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, kamu malı ön (preliminary) ölçekler ("The
 * Items in the 16 Preliminary IPIP Scales Measuring Constructs Similar to Those in Cattell's 16 Personality Factor
 * Questionnaire"): izin ve ücret gerektirmeden her amaçla kullanılabilir, çevrilebilir. Maddeler ve anahtarlar IPIP'in
 * sayfasından (https://ipip.ori.org/new16PFKey.htm), iç tutarlılık değerleri ve 16PF ölçekleriyle ilişkileri
 * karşılaştırma tablosundan (https://ipip.ori.org/new16PFTable.htm) alındı; madde sayfası iki ayrı okumayla madde
 * madde karşılaştırıldı ve iki okuma 163 maddenin hepsinde (metin, ölçek ve yön) birebir aynı çıktı. Testin adında
 * "16PF" geçmez: o ad özgün anketin adıdır; bu test onun maddelerini kullanmaz, benzer özellikleri IPIP maddeleriyle
 * ölçer.
 *
 * Çıkarılan maddeler: Kurallara bağlılık (Dutifulness, 16PF G) ölçeğinin üç artı yönlü maddesi ("Believe laws should be
 * strictly enforced.", "Believe in one true religion.", "Like to stand during the national anthem."; g01, g03, g05).
 * Yasaların uygulanmasına, dine ve millî marşa bakışı sordukları için siyasi ve dinî görüş sormama ilkemiz gereği
 * kullanılmaz (Duygusal Zekâ Bileşenleri'nden suçlulara bakışla ilgili iki maddenin çıkarılmasıyla aynı gerekçe). Bu
 * ölçek kalan yedi maddeyle (ikisi artı, beşi eksi yönlü) hesaplanır; böylece 160 madde kalır. Otoriteye saygı ve
 * kurallara uyma maddeleri (g02, g04, g06, g07, g09, g10) kalır: bir görüş değil, kişinin kurallar karşısındaki kendi
 * davranışını sorarlar.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde (Beş Faktör, Ayrıntılı ve Altı Boyutlu Kişilik Profili, Kişilerarası Tarz,
 *    Duygusal Zekâ Bileşenleri) birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (75 madde).
 *  - Kalan 85 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi.
 *    Aynı ölçekteki maddelerle karışmasın diye "Am not easily frustrated" için "İşler yolunda gitmediğinde kolay kolay
 *    bunalmam" (Gerginlik'teki "Sinirim çabuk bozulur"dan ayrı), "Am easily put out" için "Ufak şeylere çabuk
 *    bozulurum" (aynı ölçekteki "Çabuk öfkelenirim"den ayrı) denir.
 *  - Bağımsız bir incelemeden sonra beş madde yeniden düzenlendi: b06 ("gerekçeli" sözcüğü aslında yok), b11 ("özel"
 *    sözcüğü n08'deki "en özel düşüncelerim"le karışmasın diye "Sıradan biri olduğumu biliyorum"), e06 ("Gerektiğinde sert
 *    kararlar alabilirim"), l05 (daha akıcı) ve o03 ("Gönlüm çabuk kırılır": Gerginlik'teki "Ufak şeylere çabuk
 *    bozulurum"dan ayrı, kırılgan olmayı anlatır).
 *  - Bu ölçeklerin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 * 16 ölçek ayrı ayrı puanlanır; toplam puan ve ikinci düzey (genel) faktörler hesaplanmaz: kaynak sayfa bu ölçekler
 * için genel faktörlerin nasıl hesaplanacağını vermez.
 *
 * Düşünsel özgüven (Intellect, 16PF B): 16PF'teki B ölçeği akıl yürütme sorularıyla ölçülen bir yetenek ölçeğidir; IPIP
 * karşılığı ise kişinin düşünme ve öğrenme konusunda kendini nasıl gördüğünü soran cümlelerdir (16PF B ile ilişkisi en
 * düşük ölçek: .51). Bu yüzden adı "Düşünsel özgüven"dir ve rapor metinleri zekâ ölçmediğini söyler.
 *
 * Madde anahtarı: ölçeğin 16PF harfi ve maddenin kaynak sayfadaki sırası (sayfa her ölçekte önce artı, sonra eksi
 * yönlü maddeleri verir; ör. q4_07: Q4'ün yedinci maddesi). Uygulama sırası şu kuralla sabit olarak üretildi: her
 * ölçeğin maddeleri kaynaktaki sırayla, bir artı bir eksi yönlü olacak biçimde dizilir (biri bitince öteki sırayla
 * devam eder; ölçeklerden biri artı, sonraki eksi yönlü bir maddeyle başlar); sonra her ölçeğin k. maddesine
 * (k + (j + 0,5) / 16) / n konumu verilir (j: ölçeğin 16PF sırasındaki yeri, n: ölçeğin madde sayısı) ve maddeler bu
 * konuma göre sıralanır. Böylece her ölçeğin maddeleri teste eşit aralıklarla yayılır, ilk 17 maddede 16 ölçeğin hepsi
 * bulunur ve art arda iki madde hiçbir zaman aynı ölçekten değildir.
 *
 * Güvenirlik: IPIP tablosunda iç tutarlılık (α) .73 ile .86 arasında verilir (501 yetişkin); standart sapmalar
 * verilmediği için `alpha` ve `sdRef` yoktur; raporda ölçüm payı gösterilmez.
 * Durum: yayında (site sahibinin 2026-10-07 kararı: kaynağı doğrulanmış ölçek, hoca yayındaki siteyi inceler). Türkçe
 * çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const A = 'warmth';
const B = 'intellect';
const C = 'emotional_stability';
const E = 'assertiveness';
const F = 'gregariousness';
const G = 'dutifulness';
const H = 'friendliness';
const I = 'sensitivity';
const L = 'distrust';
const M = 'imagination';
const N = 'reserve';
const O = 'anxiety';
const Q1 = 'complexity';
const Q2 = 'introversion';
const Q3 = 'orderliness';
const Q4 = 'emotionality';

/** Madde anahtarının ölçek kısmı (sondaki iki rakamdan önceki: "a", "q1_") → ölçek. */
const SCALE_OF: Record<string, string> = { a: A, b: B, c: C, e: E, f: F, g: G, h: H, i: I, l: L, m: M, n: N, o: O, q1_: Q1, q2_: Q2, q3_: Q3, q4_: Q4 };

/** [anahtar, ters yönlü mü, Türkçe metin, İngilizce aslı] — uygulama sırasıyla. */
const ITEMS: [string, boolean, string, string][] = [
  ['a01', false, 'Başkalarını nasıl teselli edeceğimi bilirim.', 'Know how to comfort others.'],
  ['b09', true, 'Kendimi ortalama biri sayarım.', 'Consider myself an average person.'],
  ['c01', false, 'Kendimi nadiren hüzünlü hissederim.', 'Seldom feel blue.'],
  ['e07', true, 'Yolu başkalarının göstermesini beklerim.', 'Wait for others to lead the way.'],
  ['f01', false, 'Arkadaş ortamlarında havayı canlandıran kişi genellikle benim.', 'Am the life of the party.'],
  ['h01', false, 'İnsanların arasında kendimi rahat hissederim.', 'Feel comfortable around people.'],
  ['i07', true, 'Dans gösterilerini izlemekten keyif almam.', 'Do not enjoy watching dance performances.'],
  ['g06', true, 'Otoriteye direnirim.', 'Resist authority.'],
  ['l01', false, 'Başkalarını affetmekte zorlanırım.', 'Find it hard to forgive others.'],
  ['m08', true, 'İşleri usulüne uygun yaparım.', 'Do things by the book.'],
  ['n01', false, 'Kendimle ilgili pek az şey anlatırım.', 'Reveal little about myself.'],
  ['o08', true, 'Olup bitmiş şeyleri dert etmem.', "Don't worry about things that have already happened."],
  ['q1_01', false, 'Sanatın önemli olduğuna inanırım.', 'Believe in the importance of art.'],
  ['b01', false, 'Yerinde ve derin yorumlar yaparım.', 'Make insightful remarks.'],
  ['q2_08', true, 'Bir grubun parçası olmaktan keyif alırım.', 'Enjoy being part of a group.'],
  ['q3_01', false, 'Her şeyin tam yerli yerinde olmasını isterim.', 'Want everything to be "just right."'],
  ['q4_08', true, 'Kolay kolay sinirlenmem.', 'Am not easily annoyed.'],
  ['a08', true, 'Başkalarının sorunlarıyla ilgilenmekten hoşlanmam.', "Don't like to get involved in other people's problems."],
  ['c06', true, 'Duygularım gün içinde sık sık iniş çıkış yapar.', 'Have frequent mood swings.'],
  ['e01', false, 'İdareyi ele alırım.', 'Take charge.'],
  ['f07', true, 'Pek şaka yapmam.', 'Seldom joke around.'],
  ['h06', true, 'Başkalarının yanına gidip konuşmakta zorlanırım.', 'Find it difficult to approach others.'],
  ['i01', false, 'Kitap okumayı severim.', 'Like to read.'],
  ['l07', true, 'İnsanların söylediklerine güvenirim.', 'Trust what people say.'],
  ['m01', false, 'Başkalarının garip bulduğu şeyler yaparım.', 'Do things that others find strange.'],
  ['b10', true, 'Kafam çabuk karışır.', 'Get confused easily.'],
  ['n06', true, 'Kendimle ilgili şeyleri başkalarına açıkça anlatırım.', 'Am open about myself to others.'],
  ['o01', false, 'Yanlış bir şey yapacağım diye korkarım.', 'Am afraid that I will do the wrong thing.'],
  ['q1_06', true, 'Felsefi tartışmalardan kaçınırım.', 'Avoid philosophical discussions.'],
  ['q2_01', false, 'Yalnız bırakılmak isterim.', 'Want to be left alone.'],
  ['q3_06', true, 'Dağınık insanlar beni rahatsız etmez.', 'Am not bothered by messy people.'],
  ['g02', false, 'Kurallara uymaya çalışırım.', 'Try to follow the rules.'],
  ['q4_01', false, 'Sinirim çabuk bozulur.', 'Get irritated easily.'],
  ['a02', false, 'İnsanları bir araya getirmekten hoşlanırım.', 'Enjoy bringing people together.'],
  ['c02', false, 'Kendimle barışığım.', 'Feel comfortable with myself.'],
  ['e08', true, 'Hiçbir şeye itiraz etmem.', 'Never challenge things.'],
  ['f02', false, 'Kalabalık kutlamaları ve eğlenceleri çok severim.', 'Love large parties.'],
  ['b02', false, 'Birçok sorunun cevabını bilirim.', 'Know the answers to many questions.'],
  ['h02', false, 'Kalabalık ortamlarda birçok farklı kişiyle konuşurum.', 'Talk to a lot of different people at parties.'],
  ['i08', true, 'Şiiri sevmem.', 'Do not like poetry.'],
  ['l02', false, 'Başkalarının gizli niyetleri olduğundan şüphelenirim.', 'Suspect hidden motives in others.'],
  ['m09', true, 'Pek hayal kurmam.', 'Seldom daydream.'],
  ['n02', false, 'Beni tanımak zordur.', 'Am hard to get to know.'],
  ['o09', true, 'Bir şeyleri kolay kolay kafama takmam.', 'Am not easily bothered by things.'],
  ['q1_02', false, 'İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim.', 'Love to think up new ways of doing things.'],
  ['q2_09', true, 'Takım çalışmasından hoşlanırım.', 'Enjoy teamwork.'],
  ['q3_02', false, 'Yapmam gereken işleri hemen hallederim.', 'Get chores done right away.'],
  ['q4_09', true, 'Affedip unutmaya çalışırım.', 'Try to forgive and forget.'],
  ['a09', true, 'Aslında diğer insanlara pek ilgi duymam.', 'Am not really interested in others.'],
  ['b11', true, 'Sıradan biri olduğumu biliyorum.', 'Know that I am not a special person.'],
  ['c07', true, 'Sık sık kendimi hüzünlü hissederim.', 'Often feel blue.'],
  ['e02', false, 'İşlerin başında ben olmak isterim.', 'Want to be in charge.'],
  ['f08', true, 'Kalabalık etkinlikleri sevmem.', "Don't like crowded events."],
  ['g07', true, 'Kuralları çiğnerim.', 'Break rules.'],
  ['h07', true, 'Başkalarının yanında sık sık kendimi huzursuz hissederim.', 'Often feel uncomfortable around others.'],
  ['i02', false, 'Başkalarıyla filmler ve kitaplar hakkında konuşmaktan hoşlanırım.', 'Enjoy discussing movies and books with others.'],
  ['l08', true, 'Başkalarına güvenirim.', 'Trust others.'],
  ['m02', false, 'Düşüncelere dalıp gitmeyi severim.', 'Like to get lost in thought.'],
  ['n07', true, 'Duygularım konusunda açık biriyim.', 'Am open about my feelings.'],
  ['o02', false, 'Kendimi kolayca tehdit altında hissederim.', 'Feel threatened easily.'],
  ['q1_07', true, 'Olaylarda daha derin bir anlam pek aramam.', 'Rarely look for a deeper meaning in things.'],
  ['q2_02', false, 'İşleri tek başıma yapmayı tercih ederim.', 'Prefer to do things by myself.'],
  ['q3_07', true, 'Dağınıklık beni rahatsız etmez.', 'Am not bothered by disorder.'],
  ['b03', false, 'Olayları analiz etme eğilimindeyim.', 'Tend to analyze things.'],
  ['q4_02', false, 'Çabuk öfkelenirim.', 'Get angry easily.'],
  ['a03', false, 'Başkalarının ne hissettiğini içimde hissederim.', "Feel others' emotions."],
  ['c03', false, 'Aksilikleri kolayca atlatırım.', 'Readily overcome setbacks.'],
  ['e09', true, 'Kararları başkalarına bırakırım.', 'Let others make the decisions.'],
  ['f03', false, 'Çok şaka yaparım.', 'Joke around a lot.'],
  ['h03', false, 'İlgi odağı olmak beni rahatsız etmez.', "Don't mind being the center of attention."],
  ['i09', true, 'Roman, hikâye gibi kurgusal eserlerden hoşlanmam.', 'Dislike works of fiction.'],
  ['l03', false, 'Başkalarına karşı temkinli davranırım.', 'Am wary of others.'],
  ['m10', true, 'Pek düşüncelere dalıp gitmem.', 'Seldom get lost in thought.'],
  ['n03', false, 'Çok konuşmam.', "Don't talk a lot."],
  ['b12', true, 'Kelime dağarcığım dardır.', 'Have a poor vocabulary.'],
  ['o10', true, 'Başkalarının cesaretimi kırmasına izin vermem.', "Don't let others discourage me."],
  ['g04', false, 'Otoriteye saygı duyarım.', 'Respect authority.'],
  ['q1_03', false, 'Yeni fikirler duymaktan hoşlanırım.', 'Enjoy hearing new ideas.'],
  ['q2_10', true, 'Yanımda birileri olmadan yapamam.', "Can't do without the company of others."],
  ['q3_03', false, 'Düzeni severim.', 'Like order.'],
  ['q4_10', true, 'Herkes hakkında söyleyecek iyi bir sözüm vardır.', 'Have a good word for everyone.'],
  ['a10', true, 'İhtiyaç sahiplerini düşünmemeye çalışırım.', 'Try not to think about the needy.'],
  ['c08', true, 'Kendimden hoşlanmam.', 'Dislike myself.'],
  ['e03', false, 'Ne düşünüyorsam onu söylerim.', 'Say what I think.'],
  ['f09', true, 'Şakalara kolay kolay gülmem.', 'Am the last to laugh at a joke.'],
  ['h08', true, 'Genellikle söyleyecek pek bir şeyim olmaz.', 'Have little to say.'],
  ['b04', false, 'Aklımı kullanırım.', 'Use my brain.'],
  ['i03', false, 'Çok kitap okurum.', 'Read a lot.'],
  ['l09', true, 'İnsanların iyi niyetli olduğuna inanırım.', 'Believe that others have good intentions.'],
  ['m03', false, 'Uçsuz bucaksız hayallere dalmaktan hoşlanırım.', 'Enjoy wild flights of fantasy.'],
  ['n08', true, 'En özel düşüncelerimi paylaşırım.', 'Disclose my intimate thoughts.'],
  ['o03', false, 'Gönlüm çabuk kırılır.', 'Am easily hurt.'],
  ['q1_08', true, 'Teorik tartışmalar ilgimi çekmez.', 'Am not interested in theoretical discussions.'],
  ['q2_03', false, 'Tek başıma vakit geçirmekten hoşlanırım.', 'Enjoy spending time by myself.'],
  ['q3_08', true, 'Odamı dağınık bırakırım.', 'Leave a mess in my room.'],
  ['q4_03', false, 'Başkalarını hemen yargılarım.', 'Am quick to judge others.'],
  ['a04', false, 'Başka insanların hayatlarına ilgi duyarım.', "Take an interest in other people's lives."],
  ['c04', false, 'Çoğu zaman rahat ve sakinimdir.', 'Am relaxed most of the time.'],
  ['g08', true, 'Küfürlü konuşurum.', 'Use swear words.'],
  ['e10', true, 'Başkalarının bana patronluk taslamasına izin veririm.', 'Let myself be pushed around.'],
  ['b13', true, 'Okurken zor kelimeleri atlarım.', 'Skip difficult words while reading.'],
  ['f04', false, 'Gürültülü bir kalabalığın içinde olmaktan hoşlanırım.', 'Enjoy being part of a loud crowd.'],
  ['h04', false, 'Kolayca arkadaş edinirim.', 'Make friends easily.'],
  ['i10', true, 'Duygusal tepkilerimi pek fark etmem.', 'Rarely notice my emotional reactions.'],
  ['l04', false, 'İnsanlara güvenmem.', 'Distrust people.'],
  ['m04', false, 'Hayal kurmayı çok severim.', 'Love to daydream.'],
  ['n04', false, 'Duygularımı içime atarım.', 'Bottle up my feelings.'],
  ['o04', false, 'Birçok şey için endişelenirim.', 'Worry about things.'],
  ['q1_04', false, 'Sohbetin seviyesini yükseltirim.', 'Carry the conversation to a higher level.'],
  ['q2_04', false, 'Sessiz, sakin ortamlar ararım.', 'Seek quiet.'],
  ['q3_04', false, 'Her şey mükemmel olana kadar devam ederim.', 'Continue until everything is perfect.'],
  ['q4_04', false, 'Başkalarının hataları beni sinirlendirir.', "Am annoyed by others' mistakes."],
  ['b05', false, 'Çabuk öğrenirim.', 'Learn quickly.'],
  ['a05', false, 'İnsanların moralini yükseltirim.', 'Cheer people up.'],
  ['c09', true, 'Kendimi çaresiz hissederim.', 'Feel desperate.'],
  ['e04', false, 'Eleştiri yapmaktan korkmam.', 'Am not afraid of providing criticism.'],
  ['f10', true, 'Yüksek sesli müzikten hoşlanmam.', 'Dislike loud music.'],
  ['h09', true, 'Tanımadığım insanların yanında sessiz olurum.', 'Am quiet around strangers.'],
  ['i04', false, 'Aksiyon filmlerini sevmem.', "Don't like action movies."],
  ['l10', true, 'İnsanların temelde ahlaklı olduğuna inanırım.', 'Believe that people are basically moral.'],
  ['m05', false, 'Çoğunluğa uymak yerine akıntıya karşı yüzerim.', 'Swim against the current.'],
  ['g09', true, 'Otoriteye karşı çıkarım.', 'Oppose authority.'],
  ['n09', true, 'Duygularımı belli ederim.', 'Show my feelings.'],
  ['o05', false, 'Geçmişteki hatalarımı düşünerek zaman geçiririm.', 'Spend time thinking about past mistakes.'],
  ['b06', false, 'Başkalarının öne sürdüğü görüşlere karşı görüş getiririm.', "Counter others' arguments."],
  ['q1_09', true, 'Soyut fikirler ilgimi çekmez.', 'Am not interested in abstract ideas.'],
  ['q2_05', false, 'Tek başıma yemek yemek beni rahatsız etmez.', "Don't mind eating alone."],
  ['q3_09', true, 'Eşyalarımı ortada bırakırım.', 'Leave my belongings around.'],
  ['q4_05', false, 'Ufak şeylere çabuk bozulurum.', 'Am easily put out.'],
  ['a06', false, 'İnsanların yanımda rahat hissetmesini sağlarım.', 'Make people feel at ease.'],
  ['c05', false, 'İşler yolunda gitmediğinde kolay kolay bunalmam.', 'Am not easily frustrated.'],
  ['e05', false, 'İşlerin kontrolünü elime alırım.', 'Take control of things.'],
  ['f05', false, 'Arkadaşlarımı eğlendiririm.', 'Amuse my friends.'],
  ['h05', false, 'Sohbeti genellikle ben başlatırım.', 'Start conversations.'],
  ['i05', false, 'Film izlerken ağlarım.', 'Cry during movies.'],
  ['l05', false, 'İnsanların gerçeğin tamamını pek söylemediğine inanırım.', 'Believe that people seldom tell you the whole truth.'],
  ['b07', false, 'Bir şey yapmadan önce üzerinde düşünürüm.', 'Reflect on things before acting.'],
  ['m06', false, 'Aykırı görüşler savunurum.', 'Take deviant positions.'],
  ['n05', false, 'Düşüncelerimi kendime saklarım.', 'Keep my thoughts to myself.'],
  ['o06', false, '“Hayır” dediğimde kendimi suçlu hissederim.', 'Feel guilty when I say "no."'],
  ['q1_05', false, 'Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim.', 'Prefer variety to routine.'],
  ['q2_06', false, 'Sessizlikten hoşlanırım.', 'Enjoy silence.'],
  ['q3_05', false, 'Yaptığım işte titizimdir.', 'Am exacting in my work.'],
  ['q4_06', false, 'Söylediklerime itiraz edilmesine dayanamam.', "Can't stand being contradicted."],
  ['a07', false, 'Başkalarına zaman ayırırım.', 'Take time out for others.'],
  ['g10', true, 'Kuralların açığını bulmayı bilirim.', 'Know how to get around the rules.'],
  ['c10', true, 'Cesaretim çabuk kırılır.', 'Am easily discouraged.'],
  ['e06', false, 'Gerektiğinde sert kararlar alabilirim.', 'Can take strong measures.'],
  ['f06', false, 'Çılgınca şeyler yaparım.', 'Act wild and crazy.'],
  ['b08', false, 'Bir şeyin artılarını ve eksilerini tartarım.', 'Weigh the pros against the cons.'],
  ['h10', true, 'Kalabalıkta geri planda kalmayı tercih ederim.', 'Keep in the background.'],
  ['i06', false, 'Çiçekleri çok severim.', 'Love flowers.'],
  ['l06', false, 'İnsanların özünde kötü olduğuna inanırım.', 'Believe that people are essentially evil.'],
  ['m07', false, 'Beklenmedik şeyler yaparım.', 'Do unexpected things.'],
  ['n10', true, 'Kendim hakkında konuşmaktan çekinmem.', 'Am willing to talk about myself.'],
  ['o07', false, 'Aksilikler karşısında kendimi yıkılmış hissederim.', 'Feel crushed by setbacks.'],
  ['q1_10', true, 'Karmaşık insanlardan uzak durmaya çalışırım.', 'Try to avoid complex people.'],
  ['q2_07', false, 'Kendi özel alanımda olmaktan hoşlanırım.', 'Enjoy my privacy.'],
  ['q3_10', true, 'Hoşa gitmeyen işleri ertelerim.', 'Put off unpleasant tasks.'],
  ['q4_07', false, 'İnsanları dış görünüşlerine göre yargılarım.', 'Judge people by their appearance.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, -2)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const onAltiFaktorKisilik: LikertInstrument = {
  slug: '16-faktorlu-kisilik-profili',
  version: 1,
  engine: 'likert',
  name: '16 Faktörlü Kişilik Profili',
  shortName: '16 faktörlü kişilik profili',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 20,
  sortOrder: 14,
  tagline:
    'Kişiliği 16 ayrı özellikle ayrıntılı biçimde gösterir: sıcaklıktan atılganlığa, duyarlılıktan düzen ve titizliğe kadar.',
  description:
    'Kamu malı IPIP ölçeklerine dayanan bu ayrıntılı envanter, Cattell’in 16 kişilik faktörü modelindeki özelliklere benzeyen 16 özelliği ölçer: sıcaklık, düşünsel özgüven, duygusal denge, atılganlık, neşe ve canlılık, kurallara bağlılık, sosyal rahatlık, duyarlılık, temkinlilik, hayal gücü, kendini kolay açmama, endişeye yatkınlık, yeniliğe açıklık, kendi başına olmayı sevme, düzen ve titizlik, gerginlik. Kişinin kendini nasıl gördüğünü anlatır; zekâ ya da yetenek ölçmez. 160 cümleden oluşur ve yaklaşık 20 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Kendini nasıl tanımlıyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 160 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Bu uzunca bir test; yaklaşık 20 dakika sürer. Acele etmeyeceğin, sessiz bir zamanda başla.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar. Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur.',
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
  // 16PF'teki sırayla: A, B, C, E, F, G, H, I, L, M, N, O, Q1, Q2, Q3, Q4.
  scales: [
    {
      key: A,
      name: 'Sıcaklık',
      plain: 'İnsanlarla ilgilenme, onları önemseme, moralini yükseltme ve yanında rahat hissettirme.',
      poles: { low: 'Başkalarına mesafeli duran', high: 'İnsanlarla sıcak ve ilgili' },
    },
    {
      key: B,
      name: 'Düşünsel özgüven',
      plain:
        'Kendini düşünme ve öğrenme konusunda nasıl gördüğü: çabuk öğrenme, olayları çözümleme, bir işe girişmeden önce artılarını ve eksilerini tartma. Zekâyı ölçmez.',
      poles: { low: 'Düşünme becerisine pek güvenmeyen', high: 'Düşünme becerisine güvenen' },
    },
    {
      key: C,
      name: 'Duygusal denge',
      plain: 'Çoğu zaman sakin ve kendiyle barışık olma, aksiliklerden sonra kolayca toparlanma.',
      poles: { low: 'Duyguları sık sık iniş çıkış yapan', high: 'Sakin ve dengeli' },
    },
    {
      key: E,
      name: 'Atılganlık',
      plain: 'Düşündüğünü açıkça söyleme, gerektiğinde itiraz etme ve işlerin başına geçmekten hoşlanma.',
      poles: { low: 'Kararları başkalarına bırakan', high: 'Sözünü söyleyen ve yön veren' },
    },
    {
      key: F,
      name: 'Neşe ve canlılık',
      plain: 'Şakacı ve neşeli olma; kalabalık, hareketli ve gürültülü ortamlardan hoşlanma.',
      poles: { low: 'Sessiz ve ölçülü', high: 'Şakacı ve hareketli' },
    },
    {
      key: G,
      name: 'Kurallara bağlılık',
      plain: 'Kurallara uyma ve otoriteye saygı gösterme; kuralları çiğnemekten ve açığını aramaktan kaçınma.',
      poles: { low: 'Kuralları sorgulayan', high: 'Kurallara bağlı' },
    },
    {
      key: H,
      name: 'Sosyal rahatlık',
      plain: 'İnsanların arasında rahat olma, kolayca sohbet başlatma ve arkadaş edinme; ilgi odağı olmaktan çekinmeme.',
      poles: { low: 'Yeni insanlarla tanışırken çekingen', high: 'İnsanların arasında rahat' },
    },
    {
      key: I,
      name: 'Duyarlılık',
      plain: 'Kitaplardan, şiirden, filmlerden ve güzel şeylerden etkilenme; duygusal tepkilerini fark etme.',
      poles: { low: 'Sanattan ve edebiyattan pek etkilenmeyen', high: 'İnce duygulu, sanattan etkilenen' },
    },
    {
      key: L,
      name: 'Temkinlilik',
      plain: 'İnsanların niyetlerinden kuşkulanma, onlara kolay kolay güvenmeme ve affetmekte zorlanma.',
      poles: { low: 'İnsanlara kolayca güvenen', high: 'İnsanlara karşı temkinli' },
    },
    {
      key: M,
      name: 'Hayal gücü',
      plain: 'Hayallere ve düşüncelere dalma; alışılmışın dışında davranma ve çoğunluktan farklı görüşler savunma.',
      poles: { low: 'Ayakları yere basan, usulüne uygun', high: 'Hayallere dalan, sıra dışı' },
    },
    {
      key: N,
      name: 'Kendini kolay açmama',
      plain: 'Düşüncelerini ve duygularını kendine saklama, kendinden pek söz etmeme.',
      poles: { low: 'Kendini ve duygularını açıkça paylaşan', high: 'Kendini ve duygularını kendine saklayan' },
    },
    {
      key: O,
      name: 'Endişeye yatkınlık',
      plain: 'Kolayca endişelenme, yanlış yapmaktan korkma, geçmişteki hataları düşünme ve kolayca kırılma.',
      poles: { low: 'Kolay kolay endişelenmeyen', high: 'Kolayca endişelenen' },
    },
    {
      key: Q1,
      name: 'Yeniliğe açıklık',
      plain: 'Yeni fikirlerden, soyut ve felsefi konulardan, işleri yeni yollarla yapmaktan ve çeşitlilikten hoşlanma.',
      poles: { low: 'Alışılmış yolları seven', high: 'Yeni fikirlere ve değişime açık' },
    },
    {
      key: Q2,
      name: 'Kendi başına olmayı sevme',
      plain: 'Tek başına vakit geçirmekten, sessizlikten ve işleri kendi başına yapmaktan hoşlanma.',
      poles: { low: 'Bir grubun içinde olmayı seven', high: 'Kendi başına olmayı seven' },
    },
    {
      key: Q3,
      name: 'Düzen ve titizlik',
      plain: 'Düzeni sevme, işleri hemen ve kusursuz yapmaya çalışma; dağınıklıktan rahatsız olma.',
      poles: { low: 'Esnek ve rahat', high: 'Düzenli ve titiz' },
    },
    {
      key: Q4,
      name: 'Gerginlik',
      plain: 'Çabuk sinirlenme, başkalarının hatalarına ve itiraza katlanmakta zorlanma, insanları hemen yargılama.',
      poles: { low: 'Sakin ve hoşgörülü', high: 'Çabuk sinirlenen, sabırsız' },
    },
  ],
  items,
  science: {
    basedOn:
      'IPIP 16PF ölçekleri: Cattell’in 16 Kişilik Faktörü Anketi’nin (16PF) ölçtüğü özelliklere benzeyen 16 özelliği Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, 10 ile 13 maddelik kamu malı ön ölçekler. Kaynaktaki 163 maddeden 160’ı kullanılır (Kurallara bağlılık bu testte 7 maddeyle ölçülür). Test, 16PF’in kendi maddelerini kullanmaz.',
    whatItMeasures:
      'Kişinin kendini 16 özellik bakımından nasıl tanımladığını ölçer: sıcaklık, düşünsel özgüven, duygusal denge, atılganlık, neşe ve canlılık, kurallara bağlılık, sosyal rahatlık, duyarlılık, temkinlilik, hayal gücü, kendini kolay açmama, endişeye yatkınlık, yeniliğe açıklık, kendi başına olmayı sevme, düzen ve titizlik, gerginlik. 16 ölçek ayrı ayrı puanlanır; toplam bir puan ve genel (ikinci düzey) faktörler hesaplanmaz. Düşünsel özgüven ölçeği, 16PF’teki akıl yürütme ölçeğinden farklı olarak bir yetenek testi değildir: zekâyı ya da akıl yürütme becerisini ölçmez, kişinin düşünme ve öğrenme konusunda kendini nasıl gördüğünü gösterir.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Ölçekhane’nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (75 madde); kalan 85 madde için iki ayrı çeviri taslağı hazırlandı ve ikisi karşılaştırılarak her maddenin son hâli seçildi; bağımsız bir incelemeden sonra beşi yeniden düzenlendi. Kurallara bağlılık ölçeğinin üç maddesi (yasaların sıkı uygulanması gerektiğine inanma, tek bir doğru dine inanma, millî marş çalarken ayağa kalkmayı sevme), siyasi ve dinî görüş sormama ilkemiz gereği kullanılmaz; bu ölçek yedi maddeyle hesaplanır. Bu ölçeklerin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP sayfasında, Amerika Birleşik Devletleri’nde 501 yetişkinden oluşan bir toplum örnekleminde (Eugene-Springfield) ölçeklerin iç tutarlılığı (Cronbach α) .73 ile .86 arasında (ortalama .80) bildirilmiştir; aynı grupta 16PF’in kendi ölçeklerinde bu değer ortalama .74’tür. Aynı grupta her IPIP ölçeğinin 16PF’teki karşılığıyla ilişkisi (korelasyon) .51 ile .77 arasındadır (ortalama .66); en düşük ilişki düşünsel özgüven ile 16PF’in akıl yürütme ölçeği arasındadır. Kurallara bağlılık ölçeğinden üç madde çıkarıldığı için bu ölçeğin güvenirliği kaynakta bildirilen değerden (.84) düşük olabilir. Kaynakta standart sapmalar verilmediği için raporda ölçüm payı gösterilmez. Ölçekhane çevirisinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu test için Türkiye’de henüz bir karşılaştırma çalışması (norm) yapılmadı. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç, kişinin kendini nasıl tanımladığını gösterir; başkalarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynaktaki güvenirlik değerleri yetişkinlerden elde edilmiştir; lise öğrencileriyle yapılmış bir çalışmaya ulaşılamadı. Kişilik gençlik yıllarında gelişmeye devam ettiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır.',
      'Bu ölçekler IPIP’in ön ölçekleridir: 16PF’in ölçtüğü özelliklere benzeyen özellikleri ölçer, ama 16PF’in yerine geçmez ve puanları 16PF puanlarıyla karşılaştırılamaz.',
      'Düşünsel özgüven ölçeği zekâyı ya da akıl yürütme becerisini ölçmez; akıl yürütmeyi sorularla ölçen bir test için Şekil Akıl Yürütme testine bakılabilir.',
      'Her ölçek 7 ile 13 cümleden oluşur; tek bir ölçeğe bakarak kesin sonuç çıkarılmamalıdır.',
      'Kurallara bağlılık ölçeğinden üç madde çıkarıldığı için kaynakta bu ölçek için bildirilen güvenirlik değeri, yedi maddelik sürüm için doğrudan geçerli değildir.',
      'Duyarlılık ölçeğindeki bazı cümleler (çiçekleri sevmek, film izlerken ağlamak, dans gösterilerini izlemek gibi) kültürel alışkanlıklardan ve toplumsal beklentilerden etkilenebilir.',
      'Tanı koymaz; ruh sağlığı değerlendirmesi değildir. Duygusal denge, endişeye yatkınlık ve gerginlik puanları bir tarama aracı değildir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'IPIP 16PF ölçekleri: madde listesi ve anahtar (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/new16PFKey.htm',
      },
      {
        text: 'IPIP 16PF ölçekleriyle 16PF ölçeklerinin karşılaştırma tablosu: iç tutarlılık ve ilişki değerleri (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/new16PFTable.htm',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
    ],
  },
};
