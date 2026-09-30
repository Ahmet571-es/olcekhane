import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Ayrıntılı Kişilik Profili
 * Kaynak: IPIP-NEO-120 (Johnson, 2014). NEO PI-R'nin beş boyutunu ve 30 alt boyutunu Uluslararası Kişilik Madde
 * Havuzu (IPIP) maddeleriyle ölçen 120 maddelik envanterdir; kamu malıdır: izin ve ücret gerektirmeden her amaçla
 * kullanılabilir, çevrilebilir (https://ipip.ori.org/). Maddeler ve anahtarlar Johnson (2014) Tablo 1 ile
 * karşılaştırılarak doğrulandı.
 *
 * Türkçe sürüm (Ölçekhane, 2026): maddeler çevrildi; her maddenin İngilizce aslı `source` alanında durur.
 *  - Çıkarılan alt boyut: O6 Liberalizm (28, 58, 88, 118). Maddeleri siyasi görüş (hangi adaylara oy verildiği) ve
 *    ahlaki inanç soruyor; siyasi görüş ve inançla ilgili bilgi istememe ilkemiz gereği kullanılmaz. Deneyime Açıklık
 *    boyutu kalan beş alt özelliğin 20 maddesiyle hesaplanır. Böylece 116 madde, 29 alt özellik kalır.
 *  - Duygusal Denge: kaynaktaki Nevrotiklik boyutu ve altı alt boyutu ters yönde puanlanır (yüksek puan = daha
 *    dengeli). Alt boyutlar klinik terimler yerine gündelik adlarla sunulur: Kaygı → Sakinlik, Öfke → Sabırlılık,
 *    Depresyon → İç huzuru, Sosyal kaygı (Self-Consciousness) → Sosyal rahatlık, Aşırılık (Immoderation) →
 *    Ölçülülük, Kırılganlık (Vulnerability) → Dayanıklılık.
 *  - A2 Morality "Adil davranma" adıyla sunulur: maddeleri başkalarını kullanmamayı ve hile yapmamayı sorar
 *    ("doğruyu söyleme" maddesi kaynakta Görev bilinci alt boyutundadır); "Dürüstlük" adı düşük puanda yanıltıcı olur.
 *  - Kültürel uyarlama: 7, 37 ("parti") ve 98 ("sanat müzesi"); satırlarında not var.
 * Madde sırası kaynaktaki sıradır (N, E, O, A, C döngüsü). Ters yönlü maddelerde `reverse` işaretlidir.
 *
 * Ölçüm payı için güvenirlik (α) ve başvuru standart sapmaları (sdRef, 1–5 madde ortalaması ölçeğinde):
 * Kajonius ve Johnson (2018), N = 320.128, 19–69 yaş; standart sapmalar kadın ve erkek değerlerinden birleştirildi.
 * Deneyime Açıklık boyutunun değerleri Liberalizm'i de içeren 24 maddelik boyuta aittir (yaklaşık değer).
 * Durum: uzman incelemesinde. Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

// Duygusal Denge (kaynakta Nevrotiklik; ters yönde)
const N1 = 'calm';
const N2 = 'patience';
const N3 = 'contentment';
const N4 = 'social_ease';
const N5 = 'moderation';
const N6 = 'resilience';
// Dışadönüklük
const E1 = 'friendliness';
const E2 = 'gregariousness';
const E3 = 'assertiveness';
const E4 = 'activity';
const E5 = 'excitement';
const E6 = 'cheerfulness';
// Deneyime Açıklık (O6 Liberalizm çıkarıldı)
const O1 = 'imagination';
const O2 = 'artistic';
const O3 = 'emotionality';
const O4 = 'adventurousness';
const O5 = 'intellect';
// Uyumluluk
const A1 = 'trust';
const A2 = 'morality';
const A3 = 'altruism';
const A4 = 'cooperation';
const A5 = 'modesty';
const A6 = 'sympathy';
// Sorumluluk
const C1 = 'self_efficacy';
const C2 = 'orderliness';
const C3 = 'dutifulness';
const C4 = 'achievement';
const C5 = 'self_discipline';
const C6 = 'cautiousness';

/** [özgün numara, alt özellik, ters puanlanır mı, Türkçe, İngilizce aslı] — sıra kaynaktaki sıradır. */
const ITEMS: [number, string, boolean, string, string][] = [
  [1, N1, true, 'Birçok şey için endişelenirim.', 'Worry about things'],
  [2, E1, false, 'Kolayca arkadaş edinirim.', 'Make friends easily'],
  [3, O1, false, 'Canlı bir hayal gücüm vardır.', 'Have a vivid imagination'],
  [4, A1, false, 'Başkalarına güvenirim.', 'Trust others'],
  [5, C1, false, 'Üstlendiğim işleri başarıyla tamamlarım.', 'Complete tasks successfully'],
  [6, N2, true, 'Çabuk öfkelenirim.', 'Get angry easily'],
  // Kültürel uyarlama: "büyük partiler" yerine kalabalık kutlamalar ve eğlenceler.
  [7, E2, false, 'Kalabalık kutlamaları ve eğlenceleri çok severim.', 'Love large parties'],
  [8, O2, false, 'Sanatın önemli olduğuna inanırım.', 'Believe in the importance of art'],
  [9, A2, true, 'Başkalarını kendi çıkarım için kullanırım.', 'Use others for my own ends'],
  [10, C2, false, 'Ortalığı toplayıp düzenlemeyi severim.', 'Like to tidy up'],
  [11, N3, true, 'Sık sık kendimi hüzünlü hissederim.', 'Often feel blue'],
  [12, E3, false, 'İdareyi ele alırım.', 'Take charge'],
  [13, O3, false, 'Duygularımı yoğun yaşarım.', 'Experience my emotions intensely'],
  [14, A3, false, 'Başkalarına yardım etmeyi severim.', 'Love to help others'],
  [15, C3, false, 'Verdiğim sözleri tutarım.', 'Keep my promises'],
  [16, N4, true, 'Başkalarının yanına gidip konuşmakta zorlanırım.', 'Find it difficult to approach others'],
  [17, E4, false, 'Hep bir şeylerle meşgulümdür.', 'Am always busy'],
  [18, O4, false, 'Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim.', 'Prefer variety to routine'],
  [19, A4, true, 'Kavga etmekten hoşlanırım.', 'Love a good fight'],
  [20, C4, false, 'Çok çalışırım.', 'Work hard'],
  [21, N5, true, 'Kendimi kaptırıp aşırıya kaçarım.', 'Go on binges'],
  [22, E5, false, 'Heyecanı çok severim.', 'Love excitement'],
  [23, O5, false, 'Anlamak için kafa yormam gereken metinler okumayı severim.', 'Love to read challenging material'],
  [24, A5, true, 'Kendimi başkalarından üstün görürüm.', 'Believe that I am better than others'],
  [25, C5, false, 'Her zaman hazırlıklı olurum.', 'Am always prepared'],
  [26, N6, true, 'Kolayca paniğe kapılırım.', 'Panic easily'],
  [27, E6, false, 'Etrafıma neşe saçarım.', 'Radiate joy'],
  [29, A6, false, 'Evsizlerin durumuna üzülürüm.', 'Sympathize with the homeless'],
  [30, C6, true, 'Düşünmeden işlere atılırım.', 'Jump into things without thinking'],
  [31, N1, true, 'En kötüsünün olacağından korkarım.', 'Fear for the worst'],
  [32, E1, false, 'İnsanların arasında kendimi rahat hissederim.', 'Feel comfortable around people'],
  [33, O1, false, 'Uçsuz bucaksız hayallere dalmaktan hoşlanırım.', 'Enjoy wild flights of fantasy'],
  [34, A1, false, 'İnsanların iyi niyetli olduğuna inanırım.', 'Believe that others have good intentions'],
  [35, C1, false, 'Yaptığım işlerde çok başarılı olurum.', 'Excel in what I do'],
  [36, N2, true, 'Sinirim çabuk bozulur.', 'Get irritated easily'],
  // Kültürel uyarlama: "partilerde" yerine kalabalık ortamlarda (Beş Faktör Kişilik Profili ile aynı).
  [37, E2, false, 'Kalabalık ortamlarda birçok farklı kişiyle konuşurum.', 'Talk to a lot of different people at parties'],
  [38, O2, false, 'Başkalarının fark etmeyebileceği şeylerde güzellik görürüm.', 'See beauty in things that others might not notice'],
  [39, A2, true, 'Öne geçmek için hile yaparım.', 'Cheat to get ahead'],
  [40, C2, true, 'Kullandığım şeyleri yerine koymayı sık sık unuturum.', 'Often forget to put things back in their proper place'],
  [41, N3, true, 'Kendimden hoşlanmam.', 'Dislike myself'],
  [42, E3, false, 'Başkalarına liderlik etmeye çalışırım.', 'Try to lead others'],
  [43, O3, false, 'Başkalarının ne hissettiğini içimde hissederim.', "Feel others' emotions"],
  [44, A3, false, 'Başkalarının iyi olup olmadığını önemserim.', 'Am concerned about others'],
  [45, C3, false, 'Doğruyu söylerim.', 'Tell the truth'],
  [46, N4, true, 'Dikkatleri üzerime çekmekten çekinirim.', 'Am afraid to draw attention to myself'],
  [47, E4, false, 'Sürekli hareket hâlindeyim.', 'Am always on the go'],
  [48, O4, true, 'Bildiğim şeylere bağlı kalmayı tercih ederim.', 'Prefer to stick with things that I know'],
  [49, A4, true, 'İnsanlara bağırırım.', 'Yell at people'],
  [50, C4, false, 'Benden beklenenden fazlasını yaparım.', "Do more than what's expected of me"],
  [51, N5, false, 'Nadiren aşırıya kaçarım.', 'Rarely overindulge'],
  [52, E5, false, 'Macera ararım.', 'Seek adventure'],
  [53, O5, true, 'Felsefi tartışmalardan kaçınırım.', 'Avoid philosophical discussions'],
  [54, A5, true, 'Kendimi çok beğenirim.', 'Think highly of myself'],
  [55, C5, false, 'Yaptığım planları uygularım.', 'Carry out my plans'],
  [56, N6, true, 'Yaşadığım olaylar karşısında bunalırım.', 'Become overwhelmed by events'],
  [57, E6, false, 'Çok eğlenirim.', 'Have a lot of fun'],
  [59, A6, false, 'Benden daha zor durumda olanlara karşı şefkat duyarım.', 'Feel sympathy for those who are worse off than myself'],
  [60, C6, true, 'Aceleci kararlar veririm.', 'Make rash decisions'],
  [61, N1, true, 'Birçok şeyden korkarım.', 'Am afraid of many things'],
  [62, E1, true, 'Başkalarıyla görüşmekten kaçınırım.', 'Avoid contacts with others'],
  [63, O1, false, 'Hayal kurmayı çok severim.', 'Love to daydream'],
  [64, A1, false, 'İnsanların söylediklerine güvenirim.', 'Trust what people say'],
  [65, C1, false, 'İşleri sorunsuz bir şekilde hallederim.', 'Handle tasks smoothly'],
  [66, N2, true, 'Öfkemi kontrol etmekte zorlanırım.', 'Lose my temper'],
  [67, E2, true, 'Yalnız kalmayı tercih ederim.', 'Prefer to be alone'],
  [68, O2, true, 'Şiiri sevmem.', 'Do not like poetry'],
  [69, A2, true, 'Başkalarının iyi niyetini kendi lehime kullanırım.', 'Take advantage of others'],
  [70, C2, true, 'Odamı dağınık bırakırım.', 'Leave a mess in my room'],
  [71, N3, true, 'Sık sık moralim bozuk olur.', 'Am often down in the dumps'],
  [72, E3, false, 'İşlerin kontrolünü elime alırım.', 'Take control of things'],
  [73, O3, true, 'Duygusal tepkilerimi pek fark etmem.', 'Rarely notice my emotional reactions'],
  [74, A3, true, 'Başkalarının ne hissettiği umurumda olmaz.', 'Am indifferent to the feelings of others'],
  [75, C3, true, 'Kuralları çiğnerim.', 'Break rules'],
  [76, N4, true, 'Yalnızca arkadaşlarımın yanında rahat ederim.', 'Only feel comfortable with friends'],
  [77, E4, false, 'Boş zamanlarımda birçok şey yaparım.', 'Do a lot in my spare time'],
  [78, O4, true, 'Değişiklikten hoşlanmam.', 'Dislike changes'],
  [79, A4, true, 'Başkalarını kıracak sözler söylerim.', 'Insult people'],
  [80, C4, true, 'Sadece idare edecek kadar çalışırım.', 'Do just enough work to get by'],
  [81, N5, false, 'Cazip gelen şeylere kolayca direnebilirim.', 'Easily resist temptations'],
  [82, E5, false, 'Tehlikeyi umursamadan davranmaktan hoşlanırım.', 'Enjoy being reckless'],
  [83, O5, true, 'Soyut fikirleri anlamakta zorlanırım.', 'Have difficulty understanding abstract ideas'],
  [84, A5, true, 'Kendime yüksek bir değer biçerim.', 'Have a high opinion of myself'],
  [85, C5, true, 'Zamanımı boşa harcarım.', 'Waste my time'],
  [86, N6, true, 'Karşılaştığım zorluklarla baş edemeyeceğimi hissederim.', "Feel that I'm unable to deal with things"],
  [87, E6, false, 'Hayatı severim.', 'Love life'],
  [89, A6, true, 'Başkalarının sorunları beni ilgilendirmez.', "Am not interested in other people's problems"],
  [90, C6, true, 'Bir işe acele edip hemen dalarım.', 'Rush into things'],
  [91, N1, true, 'Kolayca strese girerim.', 'Get stressed out easily'],
  [92, E1, true, 'İnsanlara karşı mesafeli dururum.', 'Keep others at a distance'],
  [93, O1, false, 'Düşüncelere dalıp gitmeyi severim.', 'Like to get lost in thought'],
  [94, A1, true, 'İnsanlara güvenmem.', 'Distrust people'],
  [95, C1, false, 'İşleri nasıl yoluna koyacağımı bilirim.', 'Know how to get things done'],
  [96, N2, false, 'Kolay kolay sinirlenmem.', 'Am not easily annoyed'],
  [97, E2, true, 'Kalabalıktan kaçarım.', 'Avoid crowds'],
  // Kültürel uyarlama: "sanat müzeleri" yerine sanat sergileri.
  [98, O2, true, 'Sanat sergilerini gezmekten hoşlanmam.', 'Do not enjoy going to art museums'],
  [99, A2, true, 'Başkalarının planlarına engel olurum.', "Obstruct others' plans"],
  [100, C2, true, 'Eşyalarımı ortada bırakırım.', 'Leave my belongings around'],
  [101, N3, false, 'Kendimle barışığım.', 'Feel comfortable with myself'],
  [102, E3, true, 'Yolu başkalarının göstermesini beklerim.', 'Wait for others to lead the way'],
  [103, O3, true, 'Duygusallaşan insanları anlamam.', "Don't understand people who get emotional"],
  [104, A3, true, 'Başkalarına zaman ayırmam.', 'Take no time for others'],
  [105, C3, true, 'Sözümden dönerim.', 'Break my promises'],
  [106, N4, false, 'Zor ya da gergin sosyal durumlar beni pek rahatsız etmez.', 'Am not bothered by difficult social situations'],
  [107, E4, true, 'Yavaş ve rahat bir tempoda yaşamayı severim.', 'Like to take it easy'],
  [108, O4, true, 'Alışılmış yöntemlere bağlıyım.', 'Am attached to conventional ways'],
  [109, A4, true, 'Bana yapılanın intikamını alırım.', 'Get back at others'],
  [110, C4, true, 'İşlerime az zaman ve emek harcarım.', 'Put little time and effort into my work'],
  [111, N5, false, 'Canım bir şeyi çok çektiğinde kendimi tutabilirim.', 'Am able to control my cravings'],
  [112, E5, false, 'Çılgınca şeyler yaparım.', 'Act wild and crazy'],
  [113, O5, true, 'Teorik tartışmalar ilgimi çekmez.', 'Am not interested in theoretical discussions'],
  [114, A5, true, 'İyi yönlerimle övünürüm.', 'Boast about my virtues'],
  [115, C5, true, 'İşlere başlamakta zorlanırım.', 'Have difficulty starting tasks'],
  [116, N6, false, 'Baskı altında sakin kalırım.', 'Remain calm under pressure'],
  [117, E6, false, 'Hayatın iyi tarafından bakarım.', 'Look at the bright side of life'],
  [119, A6, true, 'İhtiyaç sahiplerini düşünmemeye çalışırım.', 'Try not to think about the needy'],
  [120, C6, true, 'Düşünmeden hareket ederim.', 'Act without thinking'],
];

/** Kaynakta uyarlanan ve çıkarılan maddelerin numaraları (inceleme belgesi ve testler için). */
export const NEO_ADAPTED = [7, 37, 98];
export const NEO_REMOVED = [28, 58, 88, 118];

const items: LikertItemDef[] = ITEMS.map(([n, scale, reverse, text, source]) => ({
  key: `k${String(n).padStart(3, '0')}`,
  scale,
  ...(reverse ? { reverse: true } : {}),
  text,
  source,
}));

export const ayrintiliKisilik: LikertInstrument = {
  slug: 'ayrintili-kisilik-profili',
  version: 1,
  engine: 'likert',
  profile: 'facets',
  name: 'Ayrıntılı Kişilik Profili',
  shortName: 'Ayrıntılı kişilik',
  domain: 'personality',
  status: 'review',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  estimatedMinutes: 15,
  sortOrder: 11,
  tagline: 'Kişiliğin beş temel boyutunu ve bu boyutların altındaki 29 alt özelliği ayrı ayrı gösterir.',
  description:
    'Kamu malı bir kişilik envanteri olan IPIP-NEO-120’ye dayanan bu profil, kişiliğin beş temel boyutunun her birini beş ya da altı alt özelliğe ayırır. Böylece örneğin sorumluluk boyutunda düzenli, çalışkan ya da temkinli olmanın ayrı ayrı nerede durduğu görülür. Her boyut ve alt özellik öğrenciye ve veliye sade bir dille anlatılır.',
  intro: {
    title: 'Kendini nasıl tanımlıyorsun?',
    paragraphs: [
      'Birazdan seni anlatan 116 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
      'Doğru ya da yanlış cevap yok. En faydalı sonuç, olmak istediğin hâli değil, genellikle nasıl olduğunu anlattığında çıkar.',
      'Çok düşünmene gerek yok; aklına ilk gelen genellikle en doğrusudur. Yaklaşık 15 dakika sürer.',
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
    // Boyutlar (bileşik ölçekler): puan, alt özelliklerinin bütün maddelerinden hesaplanır.
    {
      key: 'extraversion',
      name: 'Dışadönüklük',
      plain: 'İnsanlarla birlikte olmaktan, hareketten ve heyecandan enerji bulma eğilimi.',
      of: [E1, E2, E3, E4, E5, E6],
      alpha: 0.89,
      sdRef: 0.59,
    },
    {
      key: 'agreeableness',
      name: 'Uyumluluk',
      plain: 'Başkalarıyla güvene dayalı, anlayışlı ve uyumlu ilişkiler kurma eğilimi.',
      of: [A1, A2, A3, A4, A5, A6],
      alpha: 0.85,
      sdRef: 0.5,
    },
    {
      key: 'conscientiousness',
      name: 'Sorumluluk',
      plain: 'Planlı, düzenli, güvenilir ve hedeflerine kararlı olma eğilimi.',
      of: [C1, C2, C3, C4, C5, C6],
      alpha: 0.9,
      sdRef: 0.59,
    },
    {
      key: 'emotional_stability',
      name: 'Duygusal Denge',
      plain: 'Stresli ve zor anlarda sakin kalabilme, duyguları dengeli yaşama eğilimi.',
      of: [N1, N2, N3, N4, N5, N6],
      alpha: 0.9,
      sdRef: 0.66,
    },
    {
      key: 'openness',
      name: 'Deneyime Açıklık',
      plain: 'Hayal gücüne, sanata, duygulara, yeniliklere ve fikirlere açık olma eğilimi.',
      of: [O1, O2, O3, O4, O5],
      alpha: 0.82,
      sdRef: 0.52,
    },
    // Alt özellikler (her biri 4 madde)
    { key: E1, name: 'Sıcakkanlılık', plain: 'İnsanlarla kolayca yakınlık kurma ve arkadaş edinme.', alpha: 0.81, sdRef: 0.9 },
    { key: E2, name: 'Kalabalık sevgisi', plain: 'Kalabalık ortamlardan ve topluluk içinde olmaktan hoşlanma.', alpha: 0.8, sdRef: 1 },
    { key: E3, name: 'Liderlik', plain: 'İdareyi ele alma ve başkalarını yönlendirme isteği.', alpha: 0.86, sdRef: 0.86 },
    { key: E4, name: 'Tempo', plain: 'Hareketli, dolu ve hızlı bir yaşam temposunu sevme.', alpha: 0.71, sdRef: 0.79 },
    { key: E5, name: 'Heyecan arayışı', plain: 'Heyecan, macera ve hareketli deneyimler arama.', alpha: 0.74, sdRef: 0.83 },
    { key: E6, name: 'Neşe', plain: 'Sevinç, keyif ve olumlu duyguları sık yaşama.', alpha: 0.8, sdRef: 0.8 },
    { key: A1, name: 'İnsanlara güven', plain: 'İnsanların iyi niyetli ve dürüst olduğuna inanma.', alpha: 0.86, sdRef: 0.88 },
    { key: A2, name: 'Adil davranma', plain: 'Başkalarını kendi çıkarı için kullanmama, öne geçmek için hileye başvurmama.', alpha: 0.74, sdRef: 0.72 },
    { key: A3, name: 'Yardımseverlik', plain: 'Başkalarına yardım etmekten ve onlara zaman ayırmaktan hoşlanma.', alpha: 0.73, sdRef: 0.64 },
    { key: A4, name: 'Uzlaşmacılık', plain: 'Çatışmadan kaçınma, kırıcı olmadan anlaşabilme.', alpha: 0.69, sdRef: 0.87 },
    { key: A5, name: 'Alçakgönüllülük', plain: 'Kendini başkalarından üstün görmeme, övünmekten kaçınma.', alpha: 0.72, sdRef: 0.84 },
    { key: A6, name: 'Şefkat', plain: 'Zor durumdaki insanların hâline duyarlı olma.', alpha: 0.73, sdRef: 0.78 },
    { key: C1, name: 'Yetkinlik duygusu', plain: 'İşlerin üstesinden gelebildiğine inanma.', alpha: 0.77, sdRef: 0.6 },
    { key: C2, name: 'Düzenlilik', plain: 'Eşyalarını ve çevresini derli toplu tutma.', alpha: 0.85, sdRef: 1.08 },
    { key: C3, name: 'Görev bilinci', plain: 'Sözünü tutma, doğruyu söyleme ve kurallara uyma.', alpha: 0.67, sdRef: 0.64 },
    { key: C4, name: 'Çalışkanlık', plain: 'Çok çalışma ve beklenenden fazlasını yapma isteği.', alpha: 0.78, sdRef: 0.77 },
    { key: C5, name: 'Öz disiplin', plain: 'İşlere erteleme olmadan başlama ve planlarını uygulama.', alpha: 0.72, sdRef: 0.79 },
    { key: C6, name: 'Temkinlilik', plain: 'Karar vermeden ve harekete geçmeden önce düşünme.', alpha: 0.88, sdRef: 1.02 },
    { key: N1, name: 'Sakinlik', plain: 'Kolay kolay endişelenmeme ve kötü ihtimallere takılmama.', alpha: 0.79, sdRef: 0.94 },
    { key: N2, name: 'Sabırlılık', plain: 'Çabuk öfkelenmeme, sinirini kolay kolay bozdurmama.', alpha: 0.87, sdRef: 1.03 },
    { key: N3, name: 'İç huzuru', plain: 'Kendiyle barışık olma ve çoğu zaman iyi bir ruh hâlinde olma.', alpha: 0.85, sdRef: 0.97 },
    { key: N4, name: 'Sosyal rahatlık', plain: 'Yeni insanlara yaklaşırken ve dikkatler üzerindeyken rahat olma.', alpha: 0.72, sdRef: 0.91 },
    { key: N5, name: 'Ölçülülük', plain: 'İsteklerine ve canının çektiği şeylere karşı kendini tutabilme.', alpha: 0.72, sdRef: 0.86 },
    { key: N6, name: 'Dayanıklılık', plain: 'Baskı ve zorluklar karşısında paniğe kapılmadan toparlanabilme.', alpha: 0.78, sdRef: 0.91 },
    { key: O1, name: 'Hayal gücü', plain: 'Hayal kurmaktan ve düşüncelere dalmaktan hoşlanma.', alpha: 0.75, sdRef: 0.85 },
    { key: O2, name: 'Sanata ilgi', plain: 'Sanata, şiire ve güzelliğe değer verme.', alpha: 0.75, sdRef: 0.9 },
    { key: O3, name: 'Duygulara açıklık', plain: 'Kendi duygularını ve başkalarının duygularını fark etme, derinden yaşama.', alpha: 0.66, sdRef: 0.75 },
    { key: O4, name: 'Değişime açıklık', plain: 'Çeşitlilikten, değişiklikten ve alışılmışın dışına çıkmaktan hoşlanma.', alpha: 0.71, sdRef: 0.81 },
    { key: O5, name: 'Düşünsel merak', plain: 'Soyut fikirlerle, felsefi ve teorik konularla uğraşmaktan hoşlanma.', alpha: 0.74, sdRef: 0.89 },
  ],
  items,
  science: {
    basedOn:
      'IPIP-NEO-120 (Johnson, 2014): kişiliğin beş boyutunu ve 30 alt boyutunu Uluslararası Kişilik Madde Havuzu (IPIP) maddeleriyle ölçen, 120 maddelik kamu malı bir envanter. Kaynaktaki 120 maddeden 116’sı kullanılır.',
    whatItMeasures:
      'Kişilik psikolojisinde en geniş araştırma desteğine sahip beş temel boyutu (dışadönüklük, uyumluluk, sorumluluk, duygusal denge ve deneyime açıklık) ve bu boyutların altındaki 29 alt özelliği ölçer. Her alt özellik dört cümleyle ölçülür; boyut puanı, alt özelliklerinin bütün cümlelerinden hesaplanır.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi; üç madde kültürel olarak uyarlandı (ör. “büyük partiler” yerine “kalabalık kutlamalar ve eğlenceler”). Siyasi görüş ve ahlaki inanç soran Liberalizm alt boyutu, siyasi görüş ve inançla ilgili bilgi istememe ilkemiz gereği çıkarıldı; deneyime açıklık boyutu kalan beş alt özellikle hesaplanır. Kaynaktaki Nevrotiklik boyutu ters yönde puanlanarak “Duygusal Denge” adıyla, alt boyutları da klinik terimler yerine gündelik adlarla sunulur. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'Kaynak çalışmada (N = 619.150) beş boyutun iç tutarlılığı (Cronbach α) .81 ile .90, dört maddelik alt boyutlarınki .63 ile .88 arasında bildirilmiştir; bu testte kullanılan 29 alt boyutta en düşük değer .65’tir. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar da çözebilir. Kaynak çalışmalar ağırlıkla genç yetişkinlerle yapılmıştır (yaş ortalaması 25 civarında). Kişilik ergenlikte gelişmeye devam ettiği için lise öğrencilerinde sonuçlar kendini tanımaya yönelik bir başlangıç olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır.',
      'Alt özellikler dörder cümleyle ölçüldüğü için boyut puanlarından daha az kesindir; tek bir alt özelliğe bakarak sonuç çıkarılmamalıdır.',
      'Kişilik ergenlikte gelişmeye devam eder; sonuç kalıcı bir etiket değildir.',
      'Tanı koymaz; ruh sağlığı ya da kişilik bozukluğu değerlendirmesi değildir. Duygusal denge alt özellikleri bir tarama aracı değildir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynak çalışmadaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory: Development of the IPIP-NEO-120. Journal of Research in Personality, 51, 78–89.',
        url: 'https://doi.org/10.1016/j.jrp.2014.05.003',
      },
      {
        text: 'Kajonius, P. J. ve Johnson, J. A. (2019). Assessing the structure of the Five Factor Model of personality (IPIP-NEO-120) in the public domain. Europe’s Journal of Psychology, 15(2), 260–275.',
        url: 'https://doi.org/10.5964/ejop.v15i2.1671',
      },
      {
        text: 'Kajonius, P. J. ve Johnson, J. (2018). Sex differences in 30 facets of the five factor model of personality in the large public (N = 320,128). Personality and Individual Differences, 129, 126–130 (ölçüm payı hesabındaki güvenirlik ve standart sapma değerleri).',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
    ],
  },
};
