import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Altı Boyutlu Kişilik Profili
 * Kaynak: IPIP-HEXACO ölçekleri (Ashton, Lee ve Goldberg, 2007). Lee ve Ashton'ın HEXACO kişilik modelinin altı
 * boyutunu ve 24 alt boyutunu Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, her alt boyutta 10 madde
 * olmak üzere 240 maddelik kamu malı ölçeklerdir: izin ve ücret gerektirmeden her amaçla kullanılabilir, çevrilebilir.
 * Maddeler, anahtarlar ve iç tutarlılık değerleri IPIP'in sayfasından (https://ipip.ori.org/newHEXACO_PI_key.htm)
 * alındı; sayfa iki ayrı okumayla madde madde karşılaştırıldı, farklı çıkan maddeler üçüncü bir okumayla doğrulandı.
 * Bağımsız bir incelemede de 240 maddenin alt boyutu ve yönü sayfayla karşılaştırıldı.
 * Kaynakta madde kısaltılmadı: kısa bir sürümün güvenirliği sınanmadığı için 240 maddenin hepsi kullanılır.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde (Ayrıntılı Kişilik Profili, Beş Faktör Kişilik Profili) birebir aynı
 *    İngilizce maddeler için kullanılan çeviriler korundu (48 madde); ikisi o testlerdeki kültürel uyarlamadır ("Am
 *    the life of the party", "Talk to a lot of different people at parties": "parti" yerine arkadaş ortamları ve
 *    kalabalık ortamlar). Tek ayrılık pati10 ("Get upset easily"): Beş Faktör'deki "Kolayca üzülürüm" hüzün anlatır;
 *    Sabırlılık alt boyutunda anlamı kolayca kızıp bozulmak olduğu için "Küçük şeylere kolayca bozulurum" denir.
 *  - Kalan 191 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi.
 *    Varsayım bildiren "-(I)rdI" biçimli maddelerde, geçmişte olan bir şey gibi okunmasınlar diye koşul yazıldı
 *    (ör. "Topluluk önünde konuşma yapmam gerekse korkardım").
 *  - Siyasi görüş soran madde yoktur. Merak alt boyutundaki iki madde ("Find political discussions interesting",
 *    "Don't bother worrying about political and social problems") siyasete ve toplumsal sorunlara ilgiyi sorar, görüşü
 *    sormaz; kaynaktaki gibi kullanılır.
 * Boyutlar kaynaktaki yönleriyle puanlanır (Duygusallık'ta yüksek puan, duyguları daha yoğun yaşamak demektir; öteki
 * testlerdeki Duygusal Denge puanının tersi değildir). Alt boyutların adları gündelik dille verilir.
 *
 * Madde anahtarı: alt boyutun kısaltması ve maddenin kaynak sayfadaki sırası (sayfa her alt boyutta önce artı, sonra
 * eksi yönlü maddeleri verir; ör. sinc01). Uygulama sırası şu kuralla sabit olarak üretildi: her alt boyutun maddeleri
 * kaynaktaki sırayla, bir artı bir eksi yönlü olacak biçimde dizilir; 24 alt boyut H, E, X, A, C, O döngüsüyle sırayla
 * birer madde verir (art arda gelen iki madde hiçbir zaman aynı boyuttan değildir).
 *
 * Güvenirlik (α): IPIP sayfasında her alt boyut için bildirilen değer. Sayfada standart sapmalar verilmediği için
 * `sdRef` yoktur; raporda ölçüm payı gösterilmez.
 * Durum: yayında; hoca 2026-10-07'de onayladı. Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

// Dürüstlük-Alçakgönüllülük
const H1 = 'sincerity';
const H2 = 'fairness';
const H3 = 'greed_avoidance';
const H4 = 'modesty';
// Duygusallık
const E1 = 'fearfulness';
const E2 = 'anxiety';
const E3 = 'dependence';
const E4 = 'sentimentality';
// Dışadönüklük
const X1 = 'expressiveness';
const X2 = 'social_boldness';
const X3 = 'sociability';
const X4 = 'liveliness';
// Uyumluluk
const A1 = 'forgiveness';
const A2 = 'gentleness';
const A3 = 'flexibility';
const A4 = 'patience';
// Sorumluluk
const C1 = 'organization';
const C2 = 'diligence';
const C3 = 'perfectionism';
const C4 = 'prudence';
// Deneyime Açıklık
const O1 = 'aesthetic_appreciation';
const O2 = 'inquisitiveness';
const O3 = 'creativity';
const O4 = 'unconventionality';

/** Madde anahtarının ilk dört harfi (kaynaktaki ölçek kısaltması) → alt boyut. */
const FACET_OF: Record<string, string> = {
  sinc: H1,
  fair: H2,
  gree: H3,
  mode: H4,
  fear: E1,
  anxi: E2,
  depe: E3,
  sent: E4,
  expr: X1,
  socb: X2,
  soci: X3,
  live: X4,
  forg: A1,
  gent: A2,
  flex: A3,
  pati: A4,
  orga: C1,
  dili: C2,
  perf: C3,
  prud: C4,
  aesa: O1,
  inqu: O2,
  crea: O3,
  unco: O4,
};

/** [anahtar, ters puanlanır mı, Türkçe, İngilizce aslı] — sıra uygulama sırasıdır. */
const ITEMS: [string, boolean, string, string][] = [
  ['sinc01', false, 'Olduğumdan fazlasıymışım gibi davranmam.', "Don't pretend to be more than I am."],
  ['fear01', false, 'Fiziksel tehlike karşısında korkak biriyim.', 'Am a physical coward.'],
  ['expr01', false, 'Çok konuşurum.', 'Talk a lot.'],
  ['forg01', false, 'Düşmanlarımı bile severim.', 'Love my enemies.'],
  ['orga01', false, 'Eşyalarımı derli toplu tutarım.', 'Keep things tidy.'],
  ['aesa01', false, 'Sanatın önemli olduğuna inanırım.', 'Believe in the importance of art.'],
  ['fair01', false, 'Benim olmayan bir şeyi asla almam.', "Would never take things that aren't mine."],
  ['anxi01', false, 'Sonunda önemsiz çıkan şeyler için sık sık endişelenirim.', 'Often worry about things that turn out to be unimportant.'],
  ['socb01', false, 'Hazırlıksız konuşma yapmakta iyiyim.', 'Am good at making impromptu speeches.'],
  ['gent01', false, 'Nadiren şikâyet ederim.', 'Rarely complain.'],
  ['dili01', false, 'Başarılı olmak için kendimi çok zorlarım.', 'Push myself very hard to succeed.'],
  ['inqu01', false, 'Bilime ilgi duyarım.', 'Am interested in science.'],
  ['gree01', false, 'Ünlü biri olmaktan hoşlanmazdım.', 'Would not enjoy being a famous celebrity.'],
  ['depe01', false, 'Başkalarının içimi rahatlatmasına ihtiyaç duyarım.', 'Need reassurance.'],
  ['soci01', false, 'Boş zamanımı genellikle başkalarıyla geçirmeyi severim.', 'Usually like to spend my free time with people.'],
  ['flex01', false, 'Kolayca uyum sağlarım.', 'Adjust easily.'],
  ['perf01', false, 'Ayrıntılara dikkat ederim.', 'Pay attention to details.'],
  ['crea01', false, 'Canlı bir hayal gücüm vardır.', 'Have a vivid imagination.'],
  ['mode01', false, 'Başkalarından daha iyi olduğumu düşünmem.', "Don't think that I'm better than other people."],
  ['sent01', false, 'Başkalarının ne hissettiğini içimde hissederim.', "Feel others' emotions."],
  ['live01', false, 'Gün boyunca enerjimi yüksek tutarım.', 'Maintain high energy throughout the day.'],
  ['pati01', false, 'Birine kızmam için çok şey olması gerekir.', 'Find that it takes a lot to make me feel angry at someone.'],
  ['prud01', false, 'Hata yapmaktan kaçınırım.', 'Avoid mistakes.'],
  ['unco01', false, 'Biraz aykırı, alışılmadık biri olarak görülürüm.', 'Am considered to be kind of eccentric.'],
  ['sinc02', true, 'Öne geçmek için yağcılık yaparım.', 'Use flattery to get ahead.'],
  ['fear06', true, 'Korkutucu şeyler yapmayı severim.', 'Like to do frightening things.'],
  ['expr06', true, 'Çok konuşmam.', "Don't talk a lot."],
  ['forg05', true, 'Başkalarını affetmekte zorlanırım.', 'Find it hard to forgive others.'],
  ['orga06', true, 'Odamı dağınık bırakırım.', 'Leave a mess in my room.'],
  ['aesa06', true, 'Sanatı sevmem.', 'Do not like art.'],
  ['fair06', true, 'Gerçekten zekice bir dolandırıcılığa hayranlık duyarım.', 'Admire a really clever scam.'],
  ['anxi06', true, 'Nadiren endişelenirim.', 'Rarely worry.'],
  ['socb06', true, 'Topluluk önünde konuşma yapmam gerekse korkardım.', 'Would be afraid to give a speech in public.'],
  ['gent05', true, 'İnsanlar beklentilerimi karşılamadığında hayal kırıklığına uğrar ve onlara kızarım.', "Become frustrated and angry with people when they don't live up to my expectations."],
  ['dili06', true, 'Sadece idare edecek kadar çalışırım.', 'Do just enough work to get by.'],
  ['inqu07', true, 'Tarih hakkında pek bir şey bilmem.', "Don't know much about history."],
  ['gree03', true, 'Lüksü çok severim.', 'Love luxury.'],
  ['depe02', false, 'Başkalarının beni etkilemesine izin veririm.', 'Let myself be influenced by others.'],
  ['soci06', true, 'İnsanlarla iletişim kurmaktan başkalarına kıyasla daha az keyif alıyor gibiyim.', 'Seem to derive less enjoyment from interacting with people than others do.'],
  ['flex03', true, 'Bir grup insanla bir aradayken çoğu zaman içlerinden en az biri sinirime dokunur.', 'When interacting with a group of people, am often bothered by at least one of them.'],
  ['perf09', true, 'Ayrıntılara gereğinden az dikkat ederim.', 'Pay too little attention to details.'],
  ['crea07', true, 'Hayal gücüm pek güçlü değildir.', 'Do not have a good imagination.'],
  ['mode05', true, 'Başkalarından daha güçlü bir konumda olmak isterim.', 'Would like to have more power than other people.'],
  ['sent06', true, 'Hüzünlü filmleri izlerken nadiren ağlarım.', 'Rarely cry during sad movies.'],
  ['live09', true, 'Çabuk yorulurum.', 'Tire out quickly.'],
  ['pati06', true, 'Kolayca sinirlenirim.', 'Am easily annoyed.'],
  ['prud04', true, 'Düşünmeden işlere atılırım.', 'Jump into things without thinking.'],
  ['unco06', true, 'Tuhaf ya da garip biri olarak görülmekten nefret ederim.', 'Would hate to be considered odd or strange.'],
  ['sinc03', true, 'İstediğimi yapsınlar diye başkalarına duymak istediklerini söylerim.', 'Tell other people what they want to hear so that they will do what I want them to do.'],
  ['fear02', false, 'Tehlike olduğunda paniğe kapılmaya başlarım.', 'Begin to panic when there is danger.'],
  ['expr02', false, 'Söyleyecek söz bulmakta hiçbir zaman zorlanmam.', 'Am never at a loss for words.'],
  ['forg02', false, 'Affedip unutmaya çalışırım.', 'Try to forgive and forget.'],
  ['orga02', false, 'Yapmam gereken işleri hemen hallederim.', 'Get chores done right away.'],
  ['aesa02', false, 'Kendimi müziğe tamamen kaptırırım.', 'Get deeply immersed in music.'],
  ['fair02', false, 'Asla vergi kaçırmazdım.', 'Would never cheat on my taxes.'],
  ['anxi02', false, 'Birçok şey için endişelenirim.', 'Worry about things.'],
  ['socb02', false, 'İlgi odağı olmak beni rahatsız etmez.', "Don't mind being the center of attention."],
  ['gent02', false, 'Olayları geldiği gibi karşılarım.', 'Take things as they come.'],
  ['dili02', false, 'Bir işi yapmaya hemen başlarım.', 'Get started quickly on doing a job.'],
  ['inqu02', false, 'Alışılmadık yerleri keşfetmeyi çok isterdim.', 'Would love to explore strange places.'],
  ['gree02', false, 'Şık görünmek için uğraşmam.', "Don't strive for elegance in my appearance."],
  ['depe03', false, 'Başkalarının onayına ihtiyaç duyarım.', 'Need the approval of others.'],
  ['soci02', false, 'Kalabalık ortamlarda birçok farklı kişiyle konuşurum.', 'Talk to a lot of different people at parties.'],
  ['flex02', false, 'Tavsiyelere kulak vermeyi bilirim.', 'Am good at taking advice.'],
  ['perf02', false, 'Her şey mükemmel olana kadar devam ederim.', 'Continue until everything is perfect.'],
  ['crea02', false, 'Yeni bir şeyler düşünüp bulurum.', 'Come up with something new.'],
  ['mode02', false, 'Kendimi ortalama bir insan olarak görürüm.', 'See myself as an average person.'],
  ['sent02', false, 'Üzücü bir olay duyduğumda hemen hüzünlenirim.', 'Immediately feel sad when hearing of an unhappy event.'],
  ['live02', false, 'Kondisyonum çok iyidir.', 'Have great stamina.'],
  ['pati02', false, 'İnsanlara nadiren kızarım.', 'Rarely feel angry with people.'],
  ['prud02', false, 'Plan yapar ve planıma bağlı kalırım.', 'Make plans and stick to them.'],
  ['unco02', false, 'Fikirlerimin bazen insanları şaşırttığını bilirim.', 'Know that my ideas sometimes surprise people.'],
  ['sinc04', true, 'İnsanları etkilemek için yapmacık davranırım.', 'Put on a show to impress people.'],
  ['fear07', true, 'Tehlike karşısında kendimden emin davranırım.', 'Face danger confidently.'],
  ['expr07', true, 'Dikkatleri üzerime çekmekten hoşlanmam.', "Don't like to draw attention to myself."],
  ['forg06', true, 'Kin tutarım.', 'Hold a grudge.'],
  ['orga07', true, 'Eşyalarımı ortada bırakırım.', 'Leave my belongings around.'],
  ['aesa07', true, 'Tabloların ve resimlerin duygusal yanlarını nadiren fark ederim.', 'Seldom notice the emotional aspects of paintings and pictures.'],
  ['fair07', true, 'Öne geçmek için hile yaparım.', 'Cheat to get ahead.'],
  ['anxi07', true, 'Nadiren kendimi moralsiz hissederim.', 'Rarely feel depressed.'],
  ['socb07', true, 'Kalabalıkta geri planda kalmayı tercih ederim.', 'Keep in the background.'],
  ['gent06', true, 'Başkalarını hemen yargılarım.', 'Am quick to judge others.'],
  ['dili07', true, 'Yaptığım iş çok zorlaşınca bırakırım.', 'Stop when work becomes too difficult.'],
  ['inqu08', true, 'Okuması zor metinlerden kaçınırım.', 'Avoid difficult reading material.'],
  ['gree04', true, 'Güç sahibi olmaya büyük ihtiyaç duyarım.', 'Have a strong need for power.'],
  ['depe04', false, 'Birinin beni korumasına ihtiyaç duyarım.', 'Need protection.'],
  ['soci07', true, 'İnsanlarla bir arada olmaktan nadiren keyif alırım.', 'Rarely enjoy being with people.'],
  ['flex04', true, 'Eleştirilere sert tepki veririm.', 'React strongly to criticism.'],
  ['perf10', true, 'İşleri oluruna bırakmayı tercih ederim.', 'Prefer to just let things happen.'],
  ['crea08', true, 'Bir şeyleri hayal etmekte zorlanırım.', 'Have difficulty imagining things.'],
  ['mode06', true, 'Kendimi başkalarından üstün görürüm.', 'Believe that I am better than others.'],
  ['sent07', true, 'Bir hikâyenin hüzünlü bölümünü okurken gözlerim nadiren dolar.', 'Seldom feel weepy while reading the sad part of a story.'],
  ['live10', true, 'Sık sık kendimi hüzünlü hissederim.', 'Often feel blue.'],
  ['pati07', true, 'Çabuk öfkelenirim.', 'Get angry easily.'],
  ['prud05', true, 'Sonuçlarını düşünmeden bir şeyler yaparım.', 'Do things without thinking of the consequences.'],
  ['unco07', true, 'Normal, herkes gibi biri olarak görülmekten hoşlanırım.', 'Enjoy being thought of as a normal "mainstream" person.'],
  ['sinc05', true, 'Canım istediğinde taraf değiştiririm.', 'Switch my loyalties when I feel like it.'],
  ['fear03', false, 'Suç oranı yüksek bir semtte yürümem gerekse korkardım.', 'Would fear walking in a high-crime part of a city.'],
  ['expr03', false, 'Arkadaş ortamlarında havayı canlandıran kişi genellikle benim.', 'Am the life of the party.'],
  ['forg03', false, 'Başkalarını affetmeye yatkınım.', 'Am inclined to forgive others.'],
  ['orga03', false, 'Düzeni severim.', 'Like order.'],
  ['aesa03', false, 'Başkalarının fark etmeyebileceği şeylerde güzellik görürüm.', 'See beauty in things that others might not notice.'],
  ['fair03', false, 'Kasiyer para üstünü yanlışlıkla fazla verirse fazlasını geri veririm.', 'Return extra change when a cashier makes a mistake.'],
  ['anxi03', false, 'Kolayca strese girerim.', 'Get stressed out easily.'],
  ['socb03', false, 'İnsanların arasında kendimi rahat hissederim.', 'Feel comfortable around people.'],
  ['gent03', false, 'İnsanları oldukları gibi kabul ederim.', 'Accept people as they are.'],
  ['dili03', false, 'Yaptığım işte titizimdir.', 'Am exacting in my work.'],
  ['inqu03', false, 'Zekâ oyunlarından hoşlanırım.', 'Enjoy intellectual games.'],
  ['gree05', true, 'Statü peşinde koşarım.', 'Seek status.'],
  ['depe05', false, 'Sık sık yardıma ihtiyaç duyarım.', 'Often need help.'],
  ['soci03', false, 'Sohbet etmeyi çok severim.', 'Love to chat.'],
  ['flex05', true, 'Başkaları benim kurduğum düzeni değiştirirse sinirlenirim.', 'Get upset if others change the way that I have arranged things.'],
  ['perf03', false, 'Ayrıntıları iyi fark ederim.', 'Have an eye for detail.'],
  ['crea03', false, 'Sohbetin seviyesini yükseltirim.', 'Carry the conversation to a higher level.'],
  ['mode03', false, 'Sadece sıradan biriyim.', 'Am just an ordinary person.'],
  ['sent03', false, 'Film izlerken ağlarım.', 'Cry during movies.'],
  ['live03', false, 'Genellikle aktif ve enerji dolu biriyim.', 'Am usually active and full of energy.'],
  ['pati03', false, 'Genellikle sabırlı biriyim.', 'Am usually a patient person.'],
  ['prud03', false, 'İşleri bir plana göre yaparım.', 'Do things according to a plan.'],
  ['unco03', false, 'Başkalarının garip bulduğu şeyler yaparım.', 'Do things that others find strange.'],
  ['sinc06', true, 'İnsanları etkilemek için rol yaparım.', 'Play a role in order to impress people.'],
  ['fear08', true, 'Tehlikeli durumları çok severim.', 'Love dangerous situations.'],
  ['expr08', true, 'Az konuşurum.', 'Say little.'],
  ['forg07', true, 'Bana hakaret edenlere bunu ödetirim.', 'Get back at people who insult me.'],
  ['orga08', true, 'Başladığım işleri yarım bırakırım.', "Don't finish the things that I start."],
  ['aesa08', true, 'Şiiri sevmem.', 'Do not like poetry.'],
  ['fair08', true, 'Başkalarına ait şeyleri çalarım.', 'Steal things.'],
  ['anxi08', true, 'Olaylar karşısında kolay kolay huzursuz olmam.', 'Am not easily disturbed by events.'],
  ['socb08', true, 'Başkalarının yanına gidip konuşmakta zorlanırım.', 'Find it difficult to approach others.'],
  ['gent07', true, 'Her şeyde bir kusur bulurum.', 'Find fault with everything.'],
  ['dili08', true, 'Gereğinden az çalışırım.', 'Do too little work.'],
  ['inqu09', true, 'Siyasi ve toplumsal sorunlara kafa yormam.', "Don't bother worrying about political and social problems."],
  ['gree06', true, 'Beni asıl ilgilendiren şey paradır.', 'Am mainly interested in money.'],
  ['depe06', false, 'Üzüldüğümü belli ederim.', 'Show my sadness.'],
  ['soci08', true, 'İnsanlarla çok fazla iletişim gerektiren bir iş hoşuma gitmezdi.', 'Would not enjoy a job that involves a lot of social interaction.'],
  ['flex06', true, 'Beni ikna etmek zordur.', 'Am hard to convince.'],
  ['perf04', false, 'Her ayrıntının halledilmiş olmasını isterim.', 'Want every detail taken care of.'],
  ['crea09', true, 'Başkalarının nasıl tepki vereceğini tahmin etmekte zorlanırım.', 'Have trouble guessing how others will react.'],
  ['mode07', true, 'Dikkat çekmeyi severim.', 'Like to attract attention.'],
  ['sent08', true, 'Tanımadığım insanların acı çektiğini görünce nadiren üzülürüm.', 'Am seldom bothered by the apparent suffering of strangers.'],
  ['live04', false, 'Çok gülümserim.', 'Smile a lot.'],
  ['pati08', true, 'Sinirim çabuk bozulur.', 'Get irritated easily.'],
  ['prud06', true, 'Aceleci kararlar veririm.', 'Make rash decisions.'],
  ['unco08', true, 'Düzgün ve alışılmış kalıplara uygun biri olarak görülmeyi severim.', 'Like to be viewed as proper and conventional.'],
  ['sinc07', true, 'Başkalarını umursuyormuş gibi yaparım.', 'Pretend to be concerned for others.'],
  ['fear04', false, 'Tehlikeli durumlarda titrerim.', 'Tremble in dangerous situations.'],
  ['expr04', false, 'Sinirlendiğimde bunu insanlara söylerim.', "Tell people about it when I'm irritated."],
  ['forg04', false, 'Kızmam gereken insanlara iyi davranırım.', 'Am nice to people I should be angry at.'],
  ['orga04', false, 'Ortalığı toplayıp düzenlemeyi severim.', 'Like to tidy up.'],
  ['aesa04', false, 'Kendimi doğaya yakın hissetmekten keyif alırım.', 'Enjoy feeling "close to the earth."'],
  ['fair04', false, 'Birinden bir şey çalsam uzun süre kendimi çok kötü hissederdim.', 'Would feel very badly for a long time if I were to steal from someone.'],
  ['anxi04', false, 'Aklıma hoş olmayan düşünceler gelince huzursuz olurum.', 'Get upset by unpleasant thoughts that come into my mind.'],
  ['socb04', false, 'Liderlik yeteneğim var.', 'Have leadership abilities.'],
  ['gent04', false, 'Herkes hakkında söyleyecek iyi bir sözüm vardır.', 'Have a good word for everyone.'],
  ['dili04', false, 'Çok çalışırım.', 'Work hard.'],
  ['inqu04', false, 'Anlamak için kafa yormam gereken metinler okumayı severim.', 'Love to read challenging material.'],
  ['gree07', true, 'Sonsuza kadar genç kalmak isterim.', 'Wish to stay young forever.'],
  ['depe07', false, 'Üzgün olduğumda yüz ifademin beni ele verdiğini düşünürüm.', 'Suspect that my facial expressions give me away when I feel sad.'],
  ['soci04', false, 'Kolayca arkadaş edinirim.', 'Make friends easily.'],
  ['flex07', true, 'Başkalarının hataları beni sinirlendirir.', "Am annoyed by others' mistakes."],
  ['perf05', false, 'Kusurlu işlerden hoşlanmam.', 'Dislike imperfect work.'],
  ['crea04', false, 'Aklım fikirlerle doludur.', 'Am full of ideas.'],
  ['mode04', false, 'Kendimi ortalama biri sayarım.', 'Consider myself an average person.'],
  ['sent04', false, 'Başkalarının ihtiyaçlarına karşı duyarlıyım.', 'Am sensitive to the needs of others.'],
  ['live05', false, 'Çoğu zaman kendimi sağlıklı ve dinç hissederim.', 'Feel healthy and vibrant most of the time.'],
  ['pati04', false, 'Sinirim nadiren bozulur.', 'Rarely get irritated.'],
  ['prud07', true, 'Bir şey beni rahatsız ettiğinde düşünmeden hareket ederim.', 'Act impulsively when something is bothering me.'],
  ['unco04', false, 'Otoriteye karşı gelirim.', 'Rebel against authority.'],
  ['sinc08', true, 'Farklı durumlarda farklı biri gibi davranırım.', 'Act like different people in different situations.'],
  ['fear09', true, 'Yanan bir binadan insanları kurtarmakta başarılı olurdum.', 'Would be good at rescuing people from a burning building.'],
  ['expr09', true, 'Duygularımı içime atarım.', 'Bottle up my feelings.'],
  ['forg08', true, 'Bana kötü davranana aynısıyla karşılık veririm.', 'Get even with others.'],
  ['orga09', true, 'Kullandığım şeyleri yerine koymayı sık sık unuturum.', 'Often forget to put things back in their proper place.'],
  ['aesa09', true, 'Konserleri sevmem.', 'Do not like concerts.'],
  ['fair09', true, 'Bana güvenen insanları kandırırım.', 'Cheat on people who have trusted me.'],
  ['anxi09', true, 'Baskı altında sakin kalırım.', 'Remain calm under pressure.'],
  ['socb09', true, 'İlgi odağı olmaktan nefret ederim.', 'Hate being the center of attention.'],
  ['gent08', true, 'Başkaları hakkında kötü konuşurum.', 'Speak ill of others.'],
  ['dili09', true, 'Hiçbir şey yapmadan boş boş vakit geçiririm.', 'Hang around doing nothing.'],
  ['inqu10', true, 'Bir konunun derinine inmem.', 'Will not probe deeply into a subject.'],
  ['gree08', true, 'Başkalarının gözünde etkileyici görünmeye çalışırım.', 'Try to impress others.'],
  ['depe08', false, 'Destek ararım.', 'Seek support.'],
  ['soci09', true, 'Beni tanımak zordur.', 'Am hard to get to know.'],
  ['flex08', true, 'Söylediklerime itiraz edilmesine dayanamam.', "Can't stand being contradicted."],
  ['perf06', false, 'Her şeyin kusursuzca birbirini tutmasını isterim.', 'Want everything to add up perfectly.'],
  ['crea10', true, 'Nadiren ani sezgilerim olur.', 'Seldom experience sudden intuitive insights.'],
  ['mode08', true, 'Çoğu insandan daha yetenekliyim.', 'Am more capable than most others.'],
  ['sent09', true, 'Duygusallaşan insanları anlamam.', "Don't understand people who get emotional."],
  ['live06', false, 'Çok gülerim.', 'Laugh a lot.'],
  ['pati09', true, 'Öfkemi kontrol etmekte zorlanırım.', 'Lose my temper.'],
  ['prud08', true, 'Dikkatsizlikten hatalar yaparım.', 'Make careless mistakes.'],
  ['unco09', true, 'Normal biri olarak görülmeyi severim.', 'Like to be thought of as a normal kind of person.'],
  ['sinc09', true, 'Güç sahibi kişileri memnun etmem gerektiğini düşünürüm.', 'Find it necessary to please the people who have power.'],
  ['fear05', false, 'Kanoyla sert akıntılı bir nehirden aşağı asla inmezdim.', 'Would never go riding down a stretch of rapids in a canoe.'],
  ['expr05', false, 'Yüksek sesli, coşkulu kahkahalar atarım.', 'Have an intense, boisterous laugh.'],
  ['forg09', true, 'İnsanlara güvenmem.', 'Distrust people.'],
  ['orga05', false, 'Her şeyin tam yerli yerinde olmasını isterim.', 'Want everything to be "just right."'],
  ['aesa05', false, 'Edebiyatın büyük klasiklerini okudum.', 'Have read the great literary classics.'],
  ['fair05', false, 'Kurallara uymaya çalışırım.', 'Try to follow the rules.'],
  ['anxi05', false, 'Kolayca paniğe kapılırım.', 'Panic easily.'],
  ['socb05', false, 'Güçlü bir kişiliğim var.', 'Have a strong personality.'],
  ['gent09', true, 'Sivri dilli biriyim.', 'Have a sharp tongue.'],
  ['dili05', false, 'Üstlendiğim işleri başarıyla tamamlarım.', 'Complete tasks successfully.'],
  ['inqu05', false, 'Siyasi tartışmaları ilginç bulurum.', 'Find political discussions interesting.'],
  ['gree09', true, 'Pahalı restoranlarda yemek yemeyi tercih ederim.', 'Prefer to eat at expensive restaurants.'],
  ['depe09', false, 'Yanımda birileri olmadan yapamam.', "Can't do without the company of others."],
  ['soci05', false, 'Bir grubun parçası olmaktan keyif alırım.', 'Enjoy being part of a group.'],
  ['flex09', true, 'Beni memnun etmek zordur.', 'Am hard to satisfy.'],
  ['perf07', false, 'Hataları yakalarım.', 'Detect mistakes.'],
  ['crea05', false, 'İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim.', 'Love to think up new ways of doing things.'],
  ['mode09', true, 'Fırsatını bulursam hava atarım.', 'Am likely to show off if I get the chance.'],
  ['sent05', false, 'Başkalarının başına gelen kötü şeylerden derinden etkilenirim.', "Am deeply moved by others' misfortunes."],
  ['live07', false, 'İçimde büyük bir güç olduğunu hissederim.', 'Feel that I have a lot of inner strength.'],
  ['pati05', false, 'Nadiren öfkelenirim.', 'Seldom get mad.'],
  ['prud09', true, 'Yaptığım bazı şeyleri neden yaptığımı bilmiyorum.', "Don't know why I do some of the things I do."],
  ['unco05', false, 'Çoğunluğa uymak yerine akıntıya karşı yüzerim.', 'Swim against the current.'],
  ['sinc10', true, 'Kendilerini önemli hissetsinler diye başkalarının bana patronluk taslamasına izin veririm.', 'Let people push me around to help them feel important.'],
  ['fear10', true, 'Risk almaya istekliyim.', 'Am willing to take risks.'],
  ['expr10', true, 'Alçak sesle konuşurum.', 'Speak softly.'],
  ['forg10', true, 'Çoğu insana güvenilemeyeceğini düşünürüm.', "Feel that most people can't be trusted."],
  ['orga10', true, 'Dağınıklık beni rahatsız etmez.', 'Am not bothered by disorder.'],
  ['aesa10', true, 'Dans gösterilerini izlemekten keyif almam.', 'Do not enjoy watching dance performances.'],
  ['fair10', true, 'Bir anlık dürtüyle birini kullansam, yaptığıma pişman olmazdım.', 'Would not regret my behavior if I were to take advantage of someone impulsively.'],
  ['anxi10', true, 'Olup bitmiş şeyleri dert etmem.', "Don't worry about things that have already happened."],
  ['socb10', true, 'Genellikle söyleyecek pek bir şeyim olmaz.', 'Have little to say.'],
  ['gent10', true, 'Başkalarının eksiklerini eleştiririm.', "Criticize others' shortcomings."],
  ['dili10', true, 'Başladığım işlere olan ilgimi çabuk kaybederim.', 'Quickly lose interest in the tasks I start.'],
  ['inqu06', false, 'Kelime dağarcığım zengindir.', 'Have a rich vocabulary.'],
  ['gree10', true, 'Kendi çıkarımın peşinde koşarım.', 'Am out for my own personal gain.'],
  ['depe10', false, 'Sevilmek isterim.', 'Want to be liked.'],
  ['soci10', true, 'İnsanlara karşı mesafeli dururum.', 'Keep others at a distance.'],
  ['flex10', true, 'Bana laf anlatmak zordur.', 'Am hard to reason with.'],
  ['perf08', false, 'Kalite konusunda ısrarcıyım.', 'Demand quality.'],
  ['crea06', false, 'Çok iyi fikirler bulurum.', 'Have excellent ideas.'],
  ['mode10', true, 'İyi yönlerimle övünürüm.', 'Boast about my virtues.'],
  ['sent10', true, 'Nadiren duygulanırım.', 'Seldom get emotional.'],
  ['live08', false, 'Çok eğlenirim.', 'Have a lot of fun.'],
  ['pati10', true, 'Küçük şeylere kolayca bozulurum.', 'Get upset easily.'],
  ['prud10', true, 'Kendimi gülünç duruma düşürürüm.', 'Make a fool of myself.'],
  ['unco10', true, 'Karmaşık insanlardan uzak durmaya çalışırım.', 'Try to avoid complex people.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: FACET_OF[key.slice(0, 4)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const altiBoyutluKisilik: LikertInstrument = {
  slug: 'alti-boyutlu-kisilik-profili',
  version: 1,
  engine: 'likert',
  profile: 'facets',
  name: 'Altı Boyutlu Kişilik Profili',
  shortName: 'Altı boyutlu kişilik',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 30,
  sortOrder: 12,
  tagline: 'Kişiliği altı temel boyut ve 24 alt özellikle anlatır; beş faktör modeline benzeyen beş boyutun yanında dürüstlük-alçakgönüllülüğü de ölçer.',
  description:
    'Kamu malı IPIP-HEXACO ölçeklerine dayanan bu uzun ve ayrıntılı envanter, kişiliği altı temel boyutla anlatan HEXACO modeline göre hazırlanmıştır. Beş faktör modeline benzeyen beş boyutun yanında içtenliği, adil davranmayı, lükse ve statüye düşkün olmamayı ve alçakgönüllülüğü bir araya getiren altıncı bir boyutu, dürüstlük-alçakgönüllülüğü de ölçer. Her boyut dört alt özelliğe ayrılır ve 24 alt özelliğin her biri sade bir dille anlatılır. 240 cümleden oluşur ve yaklaşık 30 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'Kendini nasıl tanımlıyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 240 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Bu uzun bir test; yaklaşık 30 dakika sürer. Acele etmeyeceğin, sessiz bir zamanda başla.',
      'Bazı cümleler henüz yaşamadığın durumları anlatabilir (bir iş, vergi ya da tehlikeli bir durum gibi). Bunlarda, öyle bir durumda olsan nasıl davranacağını düşünerek cevap ver.',
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
  scales: [
    // Boyutlar (bileşik ölçekler): puan, alt özelliklerinin bütün maddelerinden (40 madde) hesaplanır.
    {
      key: 'honesty_humility',
      name: 'Dürüstlük-Alçakgönüllülük',
      plain: 'İnsanlarla içten ve adil ilişkiler kurma, lükse ve statüye düşkün olmama, kendini başkalarından üstün görmeme eğilimi.',
      of: [H1, H2, H3, H4],
    },
    {
      key: 'emotionality',
      name: 'Duygusallık',
      plain: 'Fiziksel tehlikeden korkma, günlük sorunlar için endişelenme, zor zamanlarda destek arama ve başkalarına duygusal olarak bağlanma eğilimi.',
      of: [E1, E2, E3, E4],
    },
    {
      key: 'extraversion',
      name: 'Dışadönüklük',
      plain: 'İnsanlarla bir arada olmaktan hoşlanma, kendini rahatça ifade etme, topluluk içinde öne çıkmaktan çekinmeme ve kendini enerjik hissetme eğilimi.',
      of: [X1, X2, X3, X4],
    },
    {
      key: 'agreeableness',
      name: 'Uyumluluk',
      plain: 'Başkalarının hatalarını bağışlama, hoşgörülü, uzlaşmaya açık ve sabırlı olma eğilimi.',
      of: [A1, A2, A3, A4],
    },
    {
      key: 'conscientiousness',
      name: 'Sorumluluk',
      plain: 'Düzenli, çalışkan, özenli ve düşünerek hareket eden biri olma eğilimi.',
      of: [C1, C2, C3, C4],
    },
    {
      key: 'openness',
      name: 'Deneyime Açıklık',
      plain: 'Sanata ve güzelliğe, bilgiye, yeni fikirlere ve alışılmışın dışındaki yollara ilgi duyma eğilimi.',
      of: [O1, O2, O3, O4],
    },
    // Alt özellikler (her biri 10 madde; α: IPIP sayfasındaki değer)
    { key: H1, name: 'İçtenlik', plain: 'İnsanları etkilemek ya da onlardan bir şey elde etmek için rol yapmama, yağcılık yapmama.', alpha: 0.81 },
    { key: H2, name: 'Adil davranma', plain: 'Hile yapmama, başkasının hakkına dokunmama ve kurallara uyma.', alpha: 0.77 },
    { key: H3, name: 'Sadelik', plain: 'Lükse, paraya ve statüye pek önem vermeme; sade bir yaşamla yetinebilme.', alpha: 0.69 },
    { key: H4, name: 'Alçakgönüllülük', plain: 'Kendini başkalarından üstün görmeme, övünmekten ve dikkat çekmekten kaçınma.', alpha: 0.81 },
    { key: E1, name: 'Tehlikeden çekinme', plain: 'Fiziksel tehlike ve risk karşısında korku duyma ve bunlardan uzak durma.', alpha: 0.84 },
    { key: E2, name: 'Endişelenme', plain: 'Günlük sorunlar ve belirsizlik karşısında endişelenme ve strese girme eğilimi.', alpha: 0.85 },
    { key: E3, name: 'Destek ihtiyacı', plain: 'Zor zamanlarda başkalarının desteğine, onayına ve yakınlığına ihtiyaç duyma.', alpha: 0.73 },
    { key: E4, name: 'Duygusal duyarlılık', plain: 'Başkalarının duygularını derinden hissetme, üzücü olaylardan kolayca etkilenme.', alpha: 0.79 },
    { key: X1, name: 'Kendini ifade etme', plain: 'Konuşkanlık; duygularını ve düşüncelerini açıkça dışa vurma.', alpha: 0.84 },
    { key: X2, name: 'Sosyal cesaret', plain: 'Topluluk önünde konuşmaktan, ilgi odağı olmaktan ve öne çıkmaktan çekinmeme.', alpha: 0.86 },
    { key: X3, name: 'Sosyallik', plain: 'İnsanlarla bir arada olmaktan, sohbetten ve bir grubun parçası olmaktan hoşlanma.', alpha: 0.85 },
    { key: X4, name: 'Canlılık', plain: 'Gün boyu enerjik, neşeli ve dinç hissetme.', alpha: 0.82 },
    { key: A1, name: 'Bağışlayıcılık', plain: 'Kendisine kötü davranan birini affedebilme, kin tutmama ve insanlara yeniden güvenebilme.', alpha: 0.78 },
    { key: A2, name: 'Hoşgörü', plain: 'İnsanları çabucak yargılamama, oldukları gibi kabul etme ve eleştirirken yumuşak olma.', alpha: 0.81 },
    { key: A3, name: 'Esneklik', plain: 'Başkalarıyla uzlaşabilme, farklı görüşlere ve tavsiyelere açık olma.', alpha: 0.73 },
    { key: A4, name: 'Sabırlılık', plain: 'Kolay kolay öfkelenmeme, öfkelendiğinde de kendini kontrol edebilme.', alpha: 0.88 },
    { key: C1, name: 'Düzenlilik', plain: 'Eşyalarını ve çevresini derli toplu tutma, düzeni sevme.', alpha: 0.85 },
    { key: C2, name: 'Çalışkanlık', plain: 'Çok çalışma, işlere hemen başlama ve zorlandığında bırakmama.', alpha: 0.81 },
    { key: C3, name: 'Özenlilik', plain: 'Ayrıntılara dikkat etme ve işin hatasız, kaliteli olmasını isteme.', alpha: 0.8 },
    { key: C4, name: 'Temkinlilik', plain: 'Karar vermeden ve harekete geçmeden önce düşünme, plan yapıp ona bağlı kalma.', alpha: 0.8 },
    { key: O1, name: 'Sanata ve güzelliğe ilgi', plain: 'Sanattan, müzikten, edebiyattan ve doğanın güzelliğinden etkilenme.', alpha: 0.83 },
    { key: O2, name: 'Merak', plain: 'Bilime, tarihe, farklı yerlere ve derin konulara merak duyma.', alpha: 0.78 },
    { key: O3, name: 'Yaratıcılık', plain: 'Yeni fikirler bulma, bir şeyleri yapmanın yeni yollarını arama ve hayal gücünü kullanma.', alpha: 0.85 },
    { key: O4, name: 'Sıra dışılık', plain: 'Alışılmış kalıpların dışına çıkmaktan, farklı ve sıra dışı görülmekten çekinmeme.', alpha: 0.84 },
  ],
  items,
  science: {
    basedOn:
      'IPIP-HEXACO ölçekleri (Ashton, Lee ve Goldberg, 2007): Lee ve Ashton’ın HEXACO kişilik modelinin altı boyutunu ve 24 alt boyutunu Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, her alt boyutta 10 madde olmak üzere 240 maddelik kamu malı ölçekler. Kaynaktaki 240 maddenin hepsi kullanılır.',
    whatItMeasures:
      'Kişiliği altı temel boyutla anlatan HEXACO modeline göre dürüstlük-alçakgönüllülük, duygusallık, dışadönüklük, uyumluluk, sorumluluk ve deneyime açıklık boyutlarını ve her boyutun altındaki dört alt özelliği ölçer. Beş faktör modelinden en önemli farkı, içtenliği, adil davranmayı, lükse ve statüye düşkün olmamayı ve alçakgönüllülüğü bir araya getiren altıncı boyuttur. Ayrıca uyumluluk ve duygusallık boyutları beş faktör modelindeki karşılıklarından farklı tanımlanır: öfke ve sabır uyumluluk boyutunda, başkalarına duygusal bağlılık ise duygusallık boyutunda yer alır. Bu yüzden Duygusallık puanı, öteki kişilik testlerimizdeki Duygusal Denge puanının tersi gibi okunmamalıdır; yüksek puan duyguları daha yoğun yaşamak demektir, bir sorun belirtisi değildir. Her alt özellik on cümleyle ölçülür; boyut puanı, alt özelliklerinin bütün cümlelerinden hesaplanır.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Ölçekhane’nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (48 madde); bunlardan ikisinde “parti” yerine arkadaş ortamları ve kalabalık ortamlar denerek kültürel uyarlama yapılmıştır. Kalan 191 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi. Öteki testlerde de bulunan bir madde (“Get upset easily”), bu testte sabırlılık alt özelliğinde yer aldığı için anlamına uygun biçimde yeniden çevrildi. Siyasi görüş ya da inanç soran madde yoktur; merak alt özelliğindeki iki madde siyasete ve toplumsal sorunlara ilgiyi sorar. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'IPIP sayfasında 24 alt boyut ölçeğinin iç tutarlılığı (Cronbach α) .69 ile .88 arasında bildirilmiştir. Sayfada ölçeklerin standart sapmaları verilmediği için raporda ölçüm payı gösterilmez. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. 240 cümleden oluşan uzun bir testtir ve yaklaşık 30 dakika sürer. Bazı cümleler yetişkin yaşamından durumları anlatır (ör. bir iş ya da vergi); öğrencilerden bunlara, öyle bir durumda olsalar nasıl davranacaklarını düşünerek cevap vermeleri istenir. Kişilik ergenlikte gelişmeye devam ettiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Dürüstlük-alçakgönüllülük gibi değer yüklü özelliklerde insanlar kendilerini olduklarından daha olumlu anlatabilir.',
      'Uzun bir testtir; yorgunken ya da acele ederek verilen cevaplar sonucu etkileyebilir.',
      'Alt özellikler on cümleyle ölçüldüğü için boyut puanlarından daha az kesindir; tek bir alt özelliğe bakarak sonuç çıkarılmamalıdır.',
      'Destek ihtiyacı alt özelliğinin bütün cümleleri aynı yöndedir; cümlelere düşünmeden katılmak bu puanı yükseltebilir.',
      'Kişilik yaşam boyu değişmeye devam eder; en belirgin değişimler genç yetişkinlikte (yaklaşık 20–40 yaş) görülür. Sonuç kalıcı bir etiket değildir.',
      'Tanı koymaz; ruh sağlığı ya da kişilik bozukluğu değerlendirmesi değildir. Endişelenme ve duygusallık puanları bir tarama aracı değildir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Ashton, M. C., Lee, K. ve Goldberg, L. R. (2007). The IPIP–HEXACO scales: An alternative, public-domain measure of the personality constructs in the HEXACO model. Personality and Individual Differences, 42(8), 1515–1526.',
      },
      {
        text: 'IPIP-HEXACO ölçekleri: madde listesi, anahtar ve güvenirlik değerleri (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newHEXACO_PI_key.htm',
      },
      {
        text: 'Ashton, M. C. ve Lee, K. (2007). Empirical, theoretical, and practical advantages of the HEXACO model of personality structure. Personality and Social Psychology Review, 11, 150–166.',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
      {
        text: 'Roberts, B. W., Walton, K. E. ve Viechtbauer, W. (2006). Patterns of mean-level change in personality traits across the life course: A meta-analysis of longitudinal studies. Psychological Bulletin, 132(1), 1–25 (kişiliğin yaşam boyu değişimi).',
        url: 'https://doi.org/10.1037/0033-2909.132.1.1',
      },
    ],
  },
};
