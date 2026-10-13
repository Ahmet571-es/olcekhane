import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Kişiliğin 10 Yönü
 * Kaynak: Büyük Beşli'nin On Yönü Ölçekleri (Big Five Aspect Scales, BFAS; DeYoung, Quilty ve Peterson, 2007). Kişiliğin
 * beş temel boyutunun her birini iki yöne ayıran, her yönü 10 maddeyle ölçen ve Uluslararası Kişilik Madde Havuzu'nda (IPIP)
 * yayımlanan 100 maddelik envanter. Kamu malıdır: izin ve ücret gerektirmeden her amaçla kullanılabilir, çevrilebilir (IPIP:
 * https://ipip.ori.org/; geliştiren laboratuvarın sayfasında da "The BFAS is in the public domain" yazar:
 * https://deyoung.psych.umn.edu/research). Maddeler ve yönleri IPIP'in anahtar sayfasından
 * (https://ipip.ori.org/BFASKeys.htm) iki ayrı okumayla alındı; iki okumada da 100 maddenin metni, yönü ve hangi yöne ait
 * olduğu aynı çıktı. Kaynaktaki 100 maddenin hepsi kullanılır.
 *
 * Yönler nasıl bulundu (DeYoung ve ark., 2007): iki envanterdeki (NEO PI-R ve IPIP-AB5C) 75 alt boyut puanının etmen
 * analizinde her boyutun 15 alt boyutu iki etmende toplandı; bu etmenlerle en çok ilişkili IPIP maddeleri arasından her
 * yönün 10 maddesi ikinci bir örneklemde (480 kişi) seçildi ve sınandı. Üçüncü çalışmada on yönden sekizi, Kanada ve
 * Almanya'da yapılmış geniş bir davranış genetiği çalışmasındaki (Jang ve ark., 2002) genetik etmenlerden biriyle belirgin
 * biçimde örtüştü (şefkat ve düşünsel merakta örtüşme zayıftı).
 *
 * Puanlama: her yön 10 maddesinin ortalamasıdır (1–5); boyut puanı iki yönünün 20 maddesinden hesaplanır (kaynakta boyut,
 * iki yönün ortalamasıdır; maddeler eksiksizse ikisi aynıdır).
 *  - Duygusal Denge: kaynaktaki Nevrotiklik boyutu ve iki yönü ters yönde puanlanır (yüksek puan = daha dengeli), sitedeki
 *    Beş Faktör ve Ayrıntılı Kişilik Profili ile aynı düzende. Yönler klinik çağrışımlı adlar yerine gündelik adlarla sunulur:
 *    Volatility (öfke, sinirlilik, duyguların hızla inip çıkması) → Soğukkanlılık; Withdrawal (endişe, kuşku, hüzün,
 *    cesaretin kırılması) → İç rahatlık. Bu iki yönde kaynaktaki artı yönlü maddeler ters puanlanır. "Sakinlik" adı
 *    kullanılmaz: Ayrıntılı Kişilik Profili'nde o ad kaygı alt özelliğinin tersidir.
 *  - Intellect "Düşünsel merak" adıyla sunulur: zekâyı ölçmez; soyut fikirlerle uğraşmaktan hoşlanmayı ve kişinin kendini
 *    nasıl gördüğünü sorar. Openness (aspect) "Sanat ve hayal gücü" adıyla sunulur.
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (64 madde).
 *    Bir maddede iki çeviri varsa 9. sınıftan başlayan testlerdeki çeviri kullanılır ("Have difficulty understanding
 *    abstract ideas": Ayrıntılı Kişilik Profili; "Get upset easily": öfke alt özelliğinde soran Altı Boyutlu Kişilik
 *    Profili, "Küçük şeylere kolayca bozulurum"; Beş Faktör'deki "Kolayca üzülürüm" hüzün anlatır, oysa madde burada öfke ve
 *    sinirlilik yönündedir; "Sympathize with others' feelings": Beş Faktör'deki tek yetişkin çevirisi).
 *  - Kalan 36 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi ve
 *    iki bağımsız incelemeden sonra yedisi düzeltildi. Aynı testteki benzer maddeler birbirinden ayrılsın diye "Seek
 *    conflict" için "Tartışma çıkarmaya çalışırım" ("Love a good fight": "Kavga etmekten hoşlanırım"), "Get easily
 *    agitated" için "Sinirlerim çabuk gerilir" ("Am not easily annoyed": "Kolay kolay sinirlenmem") denir.
 *  - Bu ölçeğin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı (Ekim 2026); IPIP'in çeviriler sayfasında da Türkçe BFAS
 *    çevirisi yoktur.
 *
 * Madde anahtarı: yönün kısaltması ve maddenin kaynak sayfadaki sırası (sayfa her yönde önce artı, sonra eksi yönlü
 * maddeleri verir). Uygulama sırası 16 Faktörlü Kişilik Profili'ndeki kuralla sabit olarak üretildi: her yönün maddeleri
 * kaynaktaki sırayla, bir artı bir eksi yönlü dizilir (yönlerden biri artı, sonraki eksi yönlü bir maddeyle başlar); her
 * yönün k. maddesine (k + (j + 0,5) / 10) / 10 konumu verilir (j: yönün sırası). Yönlerin sırası Nevrotiklik, Dışadönüklük,
 * Deneyime Açıklık, Uyumluluk, Sorumluluk döngüsüyle iki turdur (önce birinci, sonra ikinci yönler). Böylece art arda iki
 * madde hiçbir zaman aynı boyuttan değildir.
 *
 * Birbirinin tersini söyleyen beş madde çifti (`oppositePairs`): çoğuna aynı uç cevap verilirse raporda uyarı çıkar.
 *
 * Ölçüm payı için güvenirlik (α) ve başvuru standart sapmaları (sdRef, 1–5 madde ortalaması ölçeğinde): DeYoung ve ark.
 * (2007) Tablo 5, üniversite örneklemi (Kanada, N = 480, yaş 17–61, ortalama 19,3). Yeniden test: bu örneklemden 90 kişi,
 * ortalama 38 gün sonra. Durum: yayında (site sahibinin
 * 2026-10-07 kararı: kaynağı doğrulanmış ölçekler doğrudan yayına alınır, hoca yayındaki siteyi inceler). Türkçe
 * çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

// Duygusal Denge (kaynakta Nevrotiklik; ters yönde)
const COMPOSURE = 'composure';
const SECURITY = 'security';
// Uyumluluk
const COMPASSION = 'compassion';
const POLITENESS = 'politeness';
// Sorumluluk
const INDUSTRIOUSNESS = 'industriousness';
const ORDERLINESS = 'orderliness';
// Dışadönüklük
const ENTHUSIASM = 'enthusiasm';
const ASSERTIVENESS = 'assertiveness';
// Deneyime Açıklık (kaynakta Openness/Intellect)
const INTELLECT = 'intellect';
const AESTHETICS = 'aesthetics';

/** Madde anahtarının yön kısmı → ölçek. */
const SCALE_OF: Record<string, string> = {
  vol: COMPOSURE,
  wit: SECURITY,
  com: COMPASSION,
  pol: POLITENESS,
  ind: INDUSTRIOUSNESS,
  ord: ORDERLINESS,
  ent: ENTHUSIASM,
  ass: ASSERTIVENESS,
  int: INTELLECT,
  opn: AESTHETICS,
};

/**
 * [anahtar, ters puanlanır mı, Türkçe metin, İngilizce aslı] — uygulama sırasıyla. Soğukkanlılık (vol) ve İç rahatlık (wit)
 * yönlerinde kaynaktaki artı yönlü maddeler ters puanlanır; öteki yönlerde eksi yönlü maddeler.
 */
const ITEMS: [string, boolean, string, string][] = [
  ['vol01', true, 'Çabuk öfkelenirim.', 'Get angry easily.'],
  ['ent06', true, 'Beni tanımak zordur.', 'Am hard to get to know.'],
  ['int01', false, 'Bir şeyleri çabuk kavrarım.', 'Am quick to understand things.'],
  ['com06', true, 'Başkalarının sorunları beni ilgilendirmez.', "Am not interested in other people's problems."],
  ['ind01', false, 'Yaptığım planları uygularım.', 'Carry out my plans.'],
  ['wit07', false, 'Kendimi nadiren hüzünlü hissederim.', 'Seldom feel blue.'],
  ['ass01', false, 'İdareyi ele alırım.', 'Take charge.'],
  ['opn07', true, 'Şiiri sevmem.', 'Do not like poetry.'],
  ['pol01', false, 'Otoriteye saygı duyarım.', 'Respect authority.'],
  ['ord07', true, 'Eşyalarımı ortada bırakırım.', 'Leave my belongings around.'],
  ['vol07', false, 'Sinirim nadiren bozulur.', 'Rarely get irritated.'],
  ['ent01', false, 'Kolayca arkadaş edinirim.', 'Make friends easily.'],
  ['int07', true, 'Soyut fikirleri anlamakta zorlanırım.', 'Have difficulty understanding abstract ideas.'],
  ['com01', false, 'Başkalarının ne hissettiğini içimde hissederim.', "Feel others' emotions."],
  ['ind05', true, 'Zamanımı boşa harcarım.', 'Waste my time.'],
  ['wit01', true, 'Birçok konuda içim kuşkularla doludur.', 'Am filled with doubts about things.'],
  ['ass07', true, 'Atılgan bir kişiliğim yoktur.', 'Do not have an assertive personality.'],
  ['opn01', false, 'Doğanın güzelliğinden keyif alırım.', 'Enjoy the beauty of nature.'],
  ['pol05', true, 'Başkalarını kıracak sözler söylerim.', 'Insult people.'],
  ['ord01', false, 'Düzeni severim.', 'Like order.'],
  ['vol02', true, 'Küçük şeylere kolayca bozulurum.', 'Get upset easily.'],
  ['ent07', true, 'İnsanlara karşı mesafeli dururum.', 'Keep others at a distance.'],
  ['int02', false, 'Çok miktarda bilgiyle başa çıkabilirim.', 'Can handle a lot of information.'],
  ['com07', true, 'Başkalarının ihtiyaçlarıyla uğraşmak istemem.', "Can't be bothered with other's needs."],
  ['ind02', false, 'Başladığım işi bitiririm.', 'Finish what I start.'],
  ['wit08', false, 'Kendimle barışığım.', 'Feel comfortable with myself.'],
  ['ass02', false, 'Güçlü bir kişiliğim var.', 'Have a strong personality.'],
  ['opn08', true, 'Pek düşüncelere dalıp gitmem.', 'Seldom get lost in thought.'],
  ['pol02', false, 'Israrcı biri gibi görünmekten hiç hoşlanmam.', 'Hate to seem pushy.'],
  ['ord08', true, 'Dağınık insanlar beni rahatsız etmez.', 'Am not bothered by messy people.'],
  ['vol08', false, 'Duygularımı kontrol altında tutarım.', 'Keep my emotions under control.'],
  ['ent02', false, 'İnsanlara çabuk ısınırım.', 'Warm up quickly to others.'],
  ['int08', true, 'Felsefi tartışmalardan kaçınırım.', 'Avoid philosophical discussions.'],
  ['com02', false, 'Başkalarının hâlini hatırını sorarım.', "Inquire about others' well-being."],
  ['ind06', true, 'Oturup çalışmaya başlamak bana zor gelir.', 'Find it difficult to get down to work.'],
  ['wit02', true, 'Kendimi kolayca tehdit altında hissederim.', 'Feel threatened easily.'],
  ['ass08', true, 'İnsanları etkileme yeteneğim yoktur.', 'Lack the talent for influencing people.'],
  ['opn02', false, 'Sanatın önemli olduğuna inanırım.', 'Believe in the importance of art.'],
  ['pol06', true, 'Kendimi başkalarından üstün görürüm.', 'Believe that I am better than others.'],
  ['ord02', false, 'Eşyalarımı derli toplu tutarım.', 'Keep things tidy.'],
  ['vol03', true, 'Ruh hâlim sık sık değişir.', 'Change my mood a lot.'],
  ['ent08', true, 'Kendimle ilgili pek az şey anlatırım.', 'Reveal little about myself.'],
  ['int03', false, 'Karmaşık problemleri çözmeyi severim.', 'Like to solve complex problems.'],
  ['com08', true, 'Başkalarının ne hissettiği umurumda olmaz.', 'Am indifferent to the feelings of others.'],
  ['ind03', false, 'İşleri çabuk bitiririm.', 'Get things done quickly.'],
  ['wit09', false, 'Nadiren kendimi moralsiz hissederim.', 'Rarely feel depressed.'],
  ['ass03', false, 'İnsanları kendime çekmeyi bilirim.', 'Know how to captivate people.'],
  ['opn09', true, 'Pek hayal kurmam.', 'Seldom daydream.'],
  ['pol03', false, 'İsteklerimi başkalarına dayatmaktan kaçınırım.', 'Avoid imposing my will on others.'],
  ['ord09', true, 'Dağınıklık beni rahatsız etmez.', 'Am not bothered by disorder.'],
  ['vol09', false, 'Soğukkanlılığımı nadiren kaybederim.', 'Rarely lose my composure.'],
  ['ent03', false, 'Mutlu olduğumda duygularımı belli ederim.', "Show my feelings when I'm happy."],
  ['int09', true, 'Okuması zor metinlerden kaçınırım.', 'Avoid difficult reading material.'],
  ['com03', false, 'Başkalarının duygularını anlar, onlara ortak olurum.', "Sympathize with others' feelings."],
  ['ind07', true, 'İşleri yüzüme gözüme bulaştırırım.', 'Mess things up.'],
  ['wit03', true, 'Birçok şey için endişelenirim.', 'Worry about things.'],
  ['ass09', true, 'Yolu başkalarının göstermesini beklerim.', 'Wait for others to lead the way.'],
  ['opn03', false, 'Bir şeyler üzerine düşünüp taşınmayı çok severim.', 'Love to reflect on things.'],
  ['pol07', true, 'Başkalarının iyi niyetini kendi lehime kullanırım.', 'Take advantage of others.'],
  ['ord03', false, 'Bir plana ya da programa göre hareket ederim.', 'Follow a schedule.'],
  ['vol04', true, 'Ruh hâli kolayca inip çıkan biriyim.', 'Am a person whose moods go up and down easily.'],
  ['ent09', true, 'Çevremdeki coşkuya pek kapılmam.', 'Rarely get caught up in the excitement.'],
  ['int04', false, 'Kelime dağarcığım zengindir.', 'Have a rich vocabulary.'],
  ['com09', true, 'Başkalarına zaman ayırmam.', 'Take no time for others.'],
  ['ind04', false, 'Ne yaptığımı her zaman bilirim.', 'Always know what I am doing.'],
  ['wit10', false, 'Kolay kolay utanmam.', 'Am not embarrassed easily.'],
  ['ass04', false, 'Kendimi iyi bir lider olarak görürüm.', 'See myself as a good leader.'],
  ['opn10', true, 'Tabloların ve resimlerin duygusal yanlarını nadiren fark ederim.', 'Seldom notice the emotional aspects of paintings and pictures.'],
  ['pol04', false, 'İnsanları nadiren baskı altına alırım.', 'Rarely put people under pressure.'],
  ['ord10', true, 'Rutinden hoşlanmam.', 'Dislike routine.'],
  ['vol10', false, 'Kolay kolay sinirlenmem.', 'Am not easily annoyed.'],
  ['ent04', false, 'Çok eğlenirim.', 'Have a lot of fun.'],
  ['int10', true, 'Bir şeyleri yavaş öğrenirim.', 'Learn things slowly.'],
  ['com04', false, 'Başka insanların hayatlarına ilgi duyarım.', "Take an interest in other people's lives."],
  ['ind08', true, 'Kendimi elimdeki işe veremem.', "Don't put my mind on the task at hand."],
  ['wit04', true, 'Cesaretim çabuk kırılır.', 'Am easily discouraged.'],
  ['ass10', true, 'Fikirlerimi kendime saklarım.', 'Hold back my opinions.'],
  ['opn04', false, 'Kendimi müziğe tamamen kaptırırım.', 'Get deeply immersed in music.'],
  ['pol08', true, 'Tartışma çıkarmaya çalışırım.', 'Seek conflict.'],
  ['ord04', false, 'Her şeyin tam yerli yerinde olmasını isterim.', 'Want everything to be "just right."'],
  ['vol05', true, 'Sinirlerim çabuk gerilir.', 'Get easily agitated.'],
  ['ent10', true, 'Pek coşkulu biri değilim.', 'Am not a very enthusiastic person.'],
  ['int05', false, 'Hızlı düşünürüm.', 'Think quickly.'],
  ['com10', true, 'Yumuşak bir yanım yoktur.', "Don't have a soft side."],
  ['ind09', true, 'Karar vermeyi ertelerim.', 'Postpone decisions.'],
  ['wit05', true, 'Yaşadığım olaylar karşısında bunalırım.', 'Become overwhelmed by events.'],
  ['ass05', false, 'Başkalarını bir şeyler yapmaya ikna edebilirim.', 'Can talk others into doing things.'],
  ['opn05', false, 'Başkalarının fark etmeyebileceği şeylerde güzellik görürüm.', 'See beauty in things that others might not notice.'],
  ['pol09', true, 'Kavga etmekten hoşlanırım.', 'Love a good fight.'],
  ['ord05', false, 'Kurallara uyulmasını sağlarım.', 'See that rules are observed.'],
  ['vol06', true, 'Duygularım kolayca alevlenir.', 'Can be stirred up easily.'],
  ['ent05', false, 'Çok gülerim.', 'Laugh a lot.'],
  ['int06', false, 'Fikirlerimi kafamda açık ve net bir biçimde oluştururum.', 'Formulate ideas clearly.'],
  ['com05', false, 'Başkaları için bir şeyler yapmayı severim.', 'Like to do things for others.'],
  ['ind10', true, 'Dikkatim kolayca dağılır.', 'Am easily distracted.'],
  ['wit06', true, 'Birçok şeyden korkarım.', 'Am afraid of many things.'],
  ['ass06', false, 'Harekete ilk geçen ben olurum.', 'Am the first to act.'],
  ['opn06', false, 'Yaratıcılığımı ortaya koyabileceğim bir uğraşa ihtiyaç duyarım.', 'Need a creative outlet.'],
  ['pol10', true, 'Kendi çıkarımın peşinde koşarım.', 'Am out for my own personal gain.'],
  ['ord06', false, 'Her ayrıntının halledilmiş olmasını isterim.', 'Want every detail taken care of.'],
];

const items: LikertItemDef[] = ITEMS.map(([key, reverse, text, source]) => ({
  key,
  scale: SCALE_OF[key.slice(0, 3)],
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const kisiligin10Yonu: LikertInstrument = {
  slug: 'kisiligin-10-yonu',
  version: 1,
  engine: 'likert',
  profile: 'facets',
  facetTerms: { from: 'iki yönden', subject: 'Yönler', toOne: 'tek bir yöne', ofDomain: 'iki yönünün' },
  name: 'Kişiliğin 10 Yönü',
  shortName: 'Kişiliğin 10 yönü',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 12,
  sortOrder: 11.5,
  tagline: 'Kişiliğin beş temel boyutunun her birini iki yöne ayırır; bir boyutun iki yönü birbirinden ayrıldığında bunu ayrıca anlatır.',
  description:
    'Kişiliğin beş temel boyutunun her biri iki ayrı yönden oluşur. Örneğin sorumluluk boyutunda çalışkanlık ve düzenlilik iki ayrı yöndür: çok çalışkan biri düzene pek önem vermeyebilir, düzenli biri de işe başlamakta zorlanabilir. Bu test, kamu malı olan Büyük Beşli’nin On Yönü Ölçekleri’ne (DeYoung, Quilty ve Peterson, 2007) dayanır. 100 kısa cümleyle beş boyutu ve on yönü ayrı ayrı gösterir; bir boyutun iki yönü birbirinden ayrıldığında bunun ne anlama gelebileceğini ayrıca anlatır. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır. Bir yetenek ya da zekâ testi değildir; tanı koymaz.',
  intro: {
    title: 'Kendini nasıl tanımlıyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 100 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar.',
      'Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur. Yaklaşık 12 dakika sürer.',
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
  oppositePairs: [
    ['vol01', 'vol10'],
    ['vol02', 'vol07'],
    ['ord02', 'ord07'],
    ['ass01', 'ass09'],
    ['int01', 'int10'],
  ],
  scales: [
    // Boyutlar (bileşik ölçekler): puan, iki yönünün bütün maddelerinden hesaplanır.
    {
      key: 'extraversion',
      name: 'Dışadönüklük',
      plain: 'İnsanlara kolayca ısınma, sevincini dışa vurma ve gruplarda öne çıkma eğilimi.',
      of: [ENTHUSIASM, ASSERTIVENESS],
      alpha: 0.88,
      sdRef: 0.63,
    },
    {
      key: 'agreeableness',
      name: 'Uyumluluk',
      plain: 'Başkalarının duygularını önemseme ve onlara saygıyla, kırmadan davranma eğilimi.',
      of: [COMPASSION, POLITENESS],
      alpha: 0.85,
      sdRef: 0.56,
    },
    {
      key: 'conscientiousness',
      name: 'Sorumluluk',
      plain: 'İşlerini kararlı ve düzenli bir biçimde yürütme, hedeflerine bağlı kalma eğilimi.',
      of: [INDUSTRIOUSNESS, ORDERLINESS],
      alpha: 0.81,
      sdRef: 0.56,
    },
    {
      key: 'emotional_stability',
      name: 'Duygusal Denge',
      plain: 'Zor ve stresli anlarda sakin kalabilme, olumsuz duyguları dengeli yaşama eğilimi.',
      of: [COMPOSURE, SECURITY],
      alpha: 0.89,
      sdRef: 0.7,
    },
    {
      key: 'openness',
      name: 'Deneyime Açıklık',
      plain: 'Fikirlere, sanata, güzelliğe ve hayal gücüne açık olma eğilimi.',
      of: [INTELLECT, AESTHETICS],
      alpha: 0.8,
      sdRef: 0.52,
    },
    // Yönler (her biri 10 madde)
    { key: ENTHUSIASM, name: 'Coşku', plain: 'İnsanlara çabuk ısınma, kolayca arkadaş edinme, neşesini ve sevincini dışa vurma.', alpha: 0.81, sdRef: 0.73 },
    { key: ASSERTIVENESS, name: 'Atılganlık', plain: 'İdareyi ele alma, fikrini söyleme, başkalarını etkileme ve harekete ilk geçme.', alpha: 0.84, sdRef: 0.71 },
    {
      key: COMPASSION,
      name: 'Şefkat',
      plain: 'Başkalarının duygularını içinde hissetme, onların iyiliğini önemseme ve onlar için bir şeyler yapmaktan hoşlanma.',
      alpha: 0.84,
      sdRef: 0.65,
    },
    {
      key: POLITENESS,
      name: 'Nezaket',
      plain: 'Başkalarına saygı gösterme; onları kırmaktan, kendi isteklerini onlara dayatmaktan ve çatışmadan kaçınma.',
      alpha: 0.76,
      sdRef: 0.67,
    },
    { key: INDUSTRIOUSNESS, name: 'Çalışkanlık', plain: 'İşe koyulma, başladığını bitirme ve dikkatini elindeki işte tutabilme.', alpha: 0.79, sdRef: 0.7 },
    {
      key: ORDERLINESS,
      name: 'Düzenlilik',
      plain: 'Düzeni, programı ve ayrıntıları önemseme; eşyalarını derli toplu tutma ve kurallara uyulmasını isteme.',
      alpha: 0.72,
      sdRef: 0.64,
    },
    {
      key: COMPOSURE,
      name: 'Soğukkanlılık',
      plain: 'Çabuk öfkelenmeme ve sinirlenmeme; duyguların hızla inip çıkmadan dengede kalması.',
      alpha: 0.87,
      sdRef: 0.82,
    },
    {
      key: SECURITY,
      name: 'İç rahatlık',
      plain: 'Kolay kolay endişeye, kuşkuya ve hüzne kapılmama; zorluklar karşısında cesaretini koruyabilme.',
      alpha: 0.81,
      sdRef: 0.75,
    },
    {
      key: INTELLECT,
      name: 'Düşünsel merak',
      plain: 'Soyut fikirlerle, karmaşık sorunlarla ve zor metinlerle uğraşmaktan hoşlanma; yeni şeyleri çabuk kavradığını düşünme.',
      alpha: 0.79,
      sdRef: 0.67,
    },
    {
      key: AESTHETICS,
      name: 'Sanat ve hayal gücü',
      plain: 'Doğanın, sanatın ve müziğin güzelliğine duyarlı olma, hayal kurma ve düşüncelere dalma.',
      alpha: 0.72,
      sdRef: 0.64,
    },
  ],
  items,
  science: {
    basedOn:
      'Büyük Beşli’nin On Yönü Ölçekleri (Big Five Aspect Scales; DeYoung, Quilty ve Peterson, 2007): kişiliğin beş temel boyutunun her birini iki yöne ayıran, Uluslararası Kişilik Madde Havuzu’nda (IPIP) yayımlanan 100 maddelik kamu malı bir envanter. Kaynaktaki 100 maddenin hepsi kullanılır.',
    whatItMeasures:
      'Kişiliğin en çok araştırılmış beş temel boyutunu ve her boyutun iki yönünü ölçer: coşku ve atılganlık (dışadönüklük), şefkat ve nezaket (uyumluluk), çalışkanlık ve düzenlilik (sorumluluk), soğukkanlılık ve iç rahatlık (duygusal denge), düşünsel merak ile sanat ve hayal gücü (deneyime açıklık). Araştırmacılar bu yönleri, yüzlerce kişinin kişilik puanlarında hangi özelliklerin birlikte gittiğine bakarak buldu (DeYoung ve ark., 2007). Aynı çalışmada on yönden sekizi, daha önceki bir genetik araştırmanın bulgularıyla da belirgin biçimde örtüştü. Bir boyutun iki yönü birbiriyle ilişkilidir ama aynı şey değildir. Örneğin çalışkanlık, anlık keyif yerine ileriki hedefler için çalışmayı; düzenlilik ise kurallara ve düzene uymayı anlatır (DeYoung, 2015). Coşku ve atılganlık ile şefkat ve nezaket, insan ilişkilerindeki farklı tarzlara karşılık gelir (DeYoung ve ark., 2013). Düşünsel merak yönü, sanat ve hayal gücü yönünden farklı olarak hem sözel hem sözel olmayan zihinsel becerilerle ilişkili bulunmuştur (DeYoung ve ark., 2014); ama bu test zekâyı ölçmez. Her yön 10 cümleyle ölçülür; boyut puanı, iki yönünün 20 cümlesinden hesaplanır.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Sitedeki öteki kişilik testlerinde birebir aynı olan 64 maddenin çevirisi korundu; kalan maddeler iki ayrı taslakla çevrilip karşılaştırıldı. “Get upset easily” maddesi bu testte öfke ve sinirlilik yönünde olduğu için Altı Boyutlu Kişilik Profili’ndeki gibi “Küçük şeylere kolayca bozulurum” diye çevrildi (Beş Faktör Kişilik Profili’nde “Kolayca üzülürüm”). Kaynaktaki Nevrotiklik boyutu ters yönde puanlanarak “Duygusal Denge” adıyla, iki yönü de klinik çağrışımlı adlar yerine “Soğukkanlılık” ve “İç rahatlık” adlarıyla sunulur. Bu ölçeğin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı; bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'Kaynak çalışmada iki örneklem vardı: ABD’de 481 yetişkin ve Kanada’da 480 üniversite öğrencisi. On yönün iç tutarlılığı (Cronbach α) .72 ile .87, beş boyutunki .80 ile .89 arasındaydı. Üniversite örnekleminden 90 kişiye test yaklaşık bir ay sonra (ortalama 38 gün) yeniden uygulandığında, yönlerdeki puanların tutarlılığı (test-tekrar test) .73 ile .86 arasındaydı. Ölçüm payı, üniversite örnekleminin değerleriyle hesaplanır. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak çalışmalar 17 yaş ve üzerindeki kişilerle yapılmıştır; ergenlerle yapılmış yayımlanmış bir çalışmaya ulaşılamadı. Kişilik ergenlikte gelişmeye devam ettiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır.',
      'Yönler onar cümleyle ölçüldüğü için boyut puanlarından daha az kesindir; tek bir yöne bakarak sonuç çıkarılmamalıdır.',
      'Düşünsel merak yönü zekâyı ölçmez: kişinin fikirlerle uğraşmaktan ne kadar hoşlandığını ve kendini nasıl gördüğünü sorar.',
      'Kişilik yaşam boyu değişmeye devam eder; en belirgin değişimler genç yetişkinlikte görülür. Sonuç kalıcı bir etiket değildir.',
      'Tanı koymaz; ruh sağlığı ya da kişilik bozukluğu değerlendirmesi değildir. Duygusal Denge ve yönleri bir tarama aracı değildir.',
      'Bir boyutun iki yönü arasındaki fark, yönlerin her birinden daha az kesindir; raporda yalnızca bir yön yüksek, öteki düşük çıktığında ayrıca anlatılır.',
      'Ergenlerde yapılmış bir çalışması bulunmadığından lise öğrencilerinde sonuçlar dikkatle yorumlanmalıdır.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynak çalışmadaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'DeYoung, C. G., Quilty, L. C. ve Peterson, J. B. (2007). Between facets and domains: 10 aspects of the Big Five. Journal of Personality and Social Psychology, 93(5), 880–896.',
        url: 'https://doi.org/10.1037/0022-3514.93.5.880',
      },
      {
        text: 'IPIP. Big Five Aspect Scales: maddeler ve anahtar.',
        url: 'https://ipip.ori.org/BFASKeys.htm',
      },
      {
        text: 'DeYoung, C. G. (2015). Cybernetic Big Five Theory. Journal of Research in Personality, 56, 33–58.',
        url: 'https://doi.org/10.1016/j.jrp.2014.07.004',
      },
      {
        text: 'DeYoung, C. G., Weisberg, Y. J., Quilty, L. C. ve Peterson, J. B. (2013). Unifying the aspects of the Big Five, the interpersonal circumplex, and trait affiliation. Journal of Personality, 81(5), 465–475.',
        url: 'https://doi.org/10.1111/jopy.12020',
      },
      {
        text: 'DeYoung, C. G., Quilty, L. C., Peterson, J. B. ve Gray, J. R. (2014). Openness to experience, intellect, and cognitive ability. Journal of Personality Assessment, 96(1), 46–52.',
        url: 'https://doi.org/10.1080/00223891.2013.806327',
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
