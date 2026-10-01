import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Kişilerarası Tarz
 * Kaynak: IPIP Kişilerarası Çember Ölçeği (IPIP-IPC; Markey ve Markey, 2009). Kişilerarası çember modelindeki sekiz
 * tarzı, her biri dört Uluslararası Kişilik Madde Havuzu (IPIP) maddesiyle ölçen 32 maddelik kamu malı ölçek: izin ve
 * ücret gerektirmeden her amaçla kullanılabilir, çevrilebilir. Maddeler ve tarzlar IPIP'in anahtar sayfasından
 * (https://ipip.ori.org/newIPIP-IPCScoringKey.htm) alındı ve makalenin ekindeki listeyle (iki ayrı okuma) karşılaştırıldı;
 * üç okumada da 32 maddenin metni, sırası ve tarzı aynı çıktı. Bütün maddeler düz yönlüdür (IPIP: "All items are
 * +keyed"); ters puanlanan madde yoktur. Uygulama sırası kaynaktaki sıradır (FG, HI, JK, LM, NO, PA, BC, DE döngüsü; art
 * arda iki madde hiçbir zaman aynı tarzdan değildir).
 *
 * Puanlama: her tarzın puanı dört maddesinin ortalamasıdır (1–5). Kaynakta tarzlardan baskınlık ve sıcaklık boyutları da
 * hesaplanır, ama bu hesap tarz puanlarının bir başvuru grubunun ortalama ve standart sapmalarına göre standartlaştırılmasını
 * gerektirir. Türkiye için böyle bir veri olmadığı için boyut puanı verilmez; çember grafiği tarzların birbirine göre
 * yerini gösterir. Ham tarz puanlarından boyut hesaplamak yanıltıcı olur: kaynak çalışmada (Çalışma 1, 501 yetişkin)
 * sıcak ve uysal tarzların ortalaması (3,8–3,9) sert ve mesafeli tarzlarınkinden (2,1–2,2) çok yüksektir.
 *
 * Güvenirlik: dört maddelik tarz ölçeklerinin güvenirliği (makalede "composite reliability") düşüktür (üç çalışmada ortalama
 * .60–.64; en düşük .46, en yüksek .77); baskınlık ve sıcaklık boyutlarınınki .80–.89'dur. Tarz başına tek bir değer
 * elimizde olmadığı için `alpha` yoktur; raporda ölçüm payı gösterilmez (bilim kartında yaklaşık değeri yazılı).
 * Bütün maddeler düz yönlü olduğu için cümlelerin çoğuna katılma ya da katılmama eğilimi bütün tarzları birlikte
 * yükseltir ya da düşürür; raporda karşı karşıya duran iki tarzın ikisi de yüksek (ya da düşük) çıkan en az iki çift
 * varsa bir uyarı gösterilir (lib/reports/simple.ts).
 *
 * Türkçe sürüm (Ölçekhane, 2026): her maddenin İngilizce aslı `source` alanında durur.
 *  - Ölçekhane'nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (12 madde);
 *    ikisi o testlerdeki "parti" uyarlamasıdır (ipc21, ipc29: "kalabalık ortamlar", "kalabalık kutlamalar ve eğlenceler").
 *  - Kalan 20 madde için iki ayrı çeviri taslağı hazırlandı; ikisi karşılaştırılarak her maddenin son hâli seçildi.
 *    "Demand" iki maddede isteğin gücünü korumak için "ısrar etmek" (ipc06) ve "ilgiyi üzerine çekmeye çalışmak" (ipc30)
 *    ile verildi; "her zaman" ya da "sürekli" gibi sıklık sözcükleri eklenmedi (bağımsız inceleme). "Cut others to pieces"
 *    deyimi, "yerden yere vurmak"ın dövmek anlamına da gelebileceği için "acımasızca eleştirmek" (ipc07) oldu.
 *  - Yaptığımız aramada bu ölçeğin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı.
 * Tarzların adları gündelik dille verilir; çember grafiğinde kısa adları (`short`) kullanılır.
 * Durum: uzman incelemesinde. Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const PA = 'assured_dominant';
const BC = 'arrogant_calculating';
const DE = 'cold_hearted';
const FG = 'aloof_introverted';
const HI = 'unassured_submissive';
const JK = 'unassuming_ingenuous';
const LM = 'warm_agreeable';
const NO = 'gregarious_extraverted';

/** [tarz, Türkçe metin, İngilizce aslı] — kaynaktaki (ve uygulamadaki) sırayla; anahtar ipc01–ipc32. */
const ITEMS: [string, string, string][] = [
  [FG, 'Tanımadığım insanların yanında sessiz olurum.', 'Am quiet around strangers.'],
  [HI, 'Alçak sesle konuşurum.', 'Speak softly.'],
  [JK, 'İnsanların pek çok davranışına katlanırım.', 'Tolerate a lot from others.'],
  [LM, 'İnsanlara ilgi duyarım.', 'Am interested in people.'],
  [NO, 'İnsanların arasında kendimi rahat hissederim.', 'Feel comfortable around people.'],
  [PA, 'İlgi odağı olmakta ısrar ederim.', 'Demand to be the center of interest.'],
  [BC, 'Başkalarını acımasızca eleştiririm.', 'Cut others to pieces.'],
  [DE, 'Herkesin kendi başının çaresine bakması gerektiğine inanırım.', 'Believe people should fend for themselves.'],
  [FG, 'Özel hayatımı pek kimseyle paylaşmam.', 'Am a very private person.'],
  [HI, 'Başkalarının sözünü bitirmesine izin veririm.', 'Let others finish what they are saying.'],
  [JK, 'Olayları geldiği gibi karşılarım.', 'Take things as they come.'],
  [LM, 'Başkalarının içini rahatlatırım.', 'Reassure others.'],
  [NO, 'Sohbeti genellikle ben başlatırım.', 'Start conversations.'],
  [PA, 'Sohbetlerde en çok ben konuşurum.', 'Do most of the talking.'],
  [BC, 'Başkalarının söylediklerine karşı çıkarım.', 'Contradict others.'],
  [DE, 'Acındırmak için anlatılan hikâyelere kanmam.', "Don't fall for sob-stories."],
  [FG, 'Çok konuşmam.', "Don't talk a lot."],
  [HI, 'Kendimi pek övmem.', 'Seldom toot my own horn.'],
  [JK, 'Önce başkalarını düşünürüm.', 'Think of others first.'],
  [LM, 'Başkalarının hâlini hatırını sorarım.', "Inquire about others' well-being."],
  [NO, 'Kalabalık ortamlarda birçok farklı kişiyle konuşurum.', 'Talk to a lot of different people at parties.'],
  [PA, 'Yüksek sesle konuşurum.', 'Speak loudly.'],
  [BC, 'İnsanlara terslenirim.', 'Snap at people.'],
  [DE, 'Bir şeylere pek kafa yormam.', "Don't put a lot of thought into things."],
  [FG, 'Genellikle söyleyecek pek bir şeyim olmaz.', 'Have little to say.'],
  [HI, 'İlgi odağı olmaktan hoşlanmam.', 'Dislike being the center of attention.'],
  [JK, 'Bir şey anlatırken nadiren abartırım.', 'Seldom stretch the truth.'],
  [LM, 'Başkalarıyla iyi geçinirim.', 'Get along well with others.'],
  [NO, 'Kalabalık kutlamaları ve eğlenceleri çok severim.', 'Love large parties.'],
  [PA, 'İlgiyi üzerime çekmeye çalışırım.', 'Demand attention.'],
  [BC, 'Sivri dilli biriyim.', 'Have a sharp tongue.'],
  [DE, 'Başkalarının sorunları beni ilgilendirmez.', "Am not interested in other people's problems."],
];

const items: LikertItemDef[] = ITEMS.map(([scale, text, source], i) => ({
  key: `ipc${String(i + 1).padStart(2, '0')}`,
  scale,
  text,
  source,
}));

export const kisilerarasiTarz: LikertInstrument = {
  slug: 'kisilerarasi-tarz',
  version: 1,
  engine: 'likert',
  profile: 'circumplex',
  name: 'Kişilerarası Tarz',
  shortName: 'Kişilerarası tarz',
  domain: 'personality',
  status: 'review',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 5,
  sortOrder: 13,
  tagline: 'İnsanlarla ilişkilerdeki sekiz tarzı bir çember üzerinde gösterir: öne çıkan ya da geri planda kalan, sıcak ya da mesafeli.',
  description:
    'Kamu malı IPIP Kişilerarası Çember Ölçeği’ne (Markey ve Markey, 2009) dayanan bu kısa test, insanlarla ilişkilerdeki sekiz tarzı ölçer: öne çıkma, sosyal ve girişken olma, sıcak ve uyumlu olma, hoşgörülü ve uysal olma, geri planda kalma, sessiz ve içe dönük olma, başkalarının derdine mesafeli olma ile sert ve eleştirel olma. Tarzlar, kişilerarası çember modeline göre bir çember üzerinde gösterilir: yan yana duran tarzlar birbirine benzer, karşı karşıya duranlar birbirinin tersidir. 32 cümleden oluşur ve yaklaşık 5 dakika sürer. Öğrenciye ve veliye ayrı raporlar, testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor hazırlanır.',
  intro: {
    title: 'İnsanlarla nasılsın?',
    paragraphs: [
      'Birazdan insanlarla ilişkilerini anlatan 32 kısa cümle göreceksin. Her cümlenin seni ne kadar doğru anlattığını seç.',
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
  // Çemberde üstten başlayıp saat yönünde (kaynaktaki açılarla: PA 90°, NO 45°, LM 0°, JK 315°, HI 270°, FG 225°,
  // DE 180°, BC 135°).
  scales: [
    {
      key: PA,
      name: 'Öne çıkma',
      short: 'Öne çıkan',
      angle: 90,
      plain: 'Sohbetlerde sözü ele alma, yüksek sesle konuşma ve ilgi odağı olmak isteme.',
      poles: { low: 'İlgi odağı olmayı aramayan', high: 'İlgi odağı olmak isteyen' },
    },
    {
      key: NO,
      name: 'Sosyal ve girişken olma',
      short: 'Girişken',
      angle: 45,
      plain: 'İnsanların arasında rahat olma, sohbet başlatma ve kalabalık ortamlardan hoşlanma.',
      poles: { low: 'Kalabalığı pek aramayan', high: 'Sosyal ve girişken' },
    },
    {
      key: LM,
      name: 'Sıcak ve uyumlu olma',
      short: 'Sıcak',
      angle: 0,
      plain: 'İnsanlarla ilgilenme, onların hâlini hatırını sorma, içlerini rahatlatma ve iyi geçinme.',
      poles: { low: 'İnsanlarla az ilgilenen', high: 'Sıcak ve uyumlu' },
    },
    {
      key: JK,
      name: 'Hoşgörülü ve uysal olma',
      short: 'Uysal',
      angle: 315,
      plain: 'Başkalarının pek çok davranışına katlanma, olayları geldiği gibi karşılama, önce başkalarını düşünme ve abartmadan konuşma.',
      poles: { low: 'Her şeye katlanmayan', high: 'Hoşgörülü ve uysal' },
    },
    {
      key: HI,
      name: 'Geri planda kalma',
      short: 'Geri planda',
      angle: 270,
      plain: 'Alçak sesle konuşma, sözü başkalarına bırakma, kendini övmeme ve ilgi odağı olmaktan hoşlanmama.',
      poles: { low: 'Geri planda kalmayan', high: 'Geri planda kalan' },
    },
    {
      key: FG,
      name: 'Sessiz ve içe dönük olma',
      short: 'Sessiz',
      angle: 225,
      plain: 'Az konuşma, tanımadığı insanların yanında sessiz kalma ve özel hayatını pek kimseyle paylaşmama.',
      poles: { low: 'Konuşmaktan çekinmeyen', high: 'Sessiz ve içe dönük' },
    },
    {
      key: DE,
      name: 'Başkalarının derdine mesafeli olma',
      short: 'Mesafeli',
      angle: 180,
      plain: 'Herkesin kendi başının çaresine bakması gerektiğini düşünme; başkalarının sorunlarına ve acındırmaya mesafeli durma.',
      poles: { low: 'Başkalarının derdine kayıtsız kalmayan', high: 'Başkalarının derdine mesafeli' },
    },
    {
      key: BC,
      name: 'Sert ve eleştirel olma',
      short: 'Sert',
      angle: 135,
      plain: 'Başkalarına sık sık karşı çıkma, onları acımasızca eleştirme ve insanlara terslenme.',
      poles: { low: 'Yumuşak dilli', high: 'Sert ve eleştirel' },
    },
  ],
  items,
  science: {
    basedOn:
      'IPIP Kişilerarası Çember Ölçeği (IPIP-IPC; Markey ve Markey, 2009): kişilerarası çember modelindeki sekiz tarzı, her biri dört Uluslararası Kişilik Madde Havuzu (IPIP) maddesiyle ölçen 32 maddelik kamu malı ölçek. 32 maddenin hepsi kullanılır.',
    whatItMeasures:
      'Kişilerarası çember modeline göre insanlarla ilişkilerdeki sekiz tarzı ölçer: öne çıkma, sosyal ve girişken olma, sıcak ve uyumlu olma, hoşgörülü ve uysal olma, geri planda kalma, sessiz ve içe dönük olma, başkalarının derdine mesafeli olma ile sert ve eleştirel olma. Model bu tarzları iki temel eksenin, öne çıkma–geri planda kalma ile sıcaklık–mesafenin birleşimi olarak bir çember üzerinde düzenler: çemberde yan yana duran tarzlar birbirine benzer, karşı karşıya duranlar birbirinin tersidir. Her tarz dört cümlesinin ortalamasıyla puanlanır.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Ölçekhane’nin öteki kişilik testlerinde birebir aynı İngilizce maddeler için kullanılan çeviriler korundu (12 madde); bunlardan ikisinde “parti” yerine kalabalık ortamlar ve kalabalık kutlamalar denerek kültürel uyarlama yapılmıştır. Kalan 20 madde için iki ayrı çeviri taslağı hazırlandı ve ikisi karşılaştırılarak her maddenin son hâli seçildi. Yaptığımız aramada bu ölçeğin yayımlanmış bir Türkçe uyarlamasına ulaşılamadı. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'Kaynak makaledeki üç çalışmada dört cümlelik tarz ölçeklerinin güvenirliği düşüktür: ortalama .60 ile .64 arasında, en düşük .46, en yüksek .77. Tarzlardan hesaplanan iki ana boyutun (baskınlık ve sıcaklık) güvenirliği daha yüksektir (.80–.89). Ama bu boyutlar, tarz puanlarının bir başvuru grubunun ortalama ve standart sapmalarına göre standartlaştırılmasıyla hesaplanır; Türkiye için böyle bir veri olmadığından raporda boyut puanı verilmez ve tarz sonuçları boyut puanlarından daha az kesindir. Kaynaktaki değerlerle hesaplandığında bir tarz puanının ölçüm payı 1–5 aralığında yaklaşık ±0,6–0,8 puandır. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre yorumlanır: sonuç kişinin kendini nasıl tanımladığını gösterir, akranlarıyla karşılaştırma yapmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak çalışmalar yetişkinler ve üniversite öğrencileriyle yapılmıştır; lise öğrencileriyle yapılmış bir güvenirlik çalışmasına ulaşılamadı.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'Öz bildirime dayanır; sonuç kişinin kendini nasıl gördüğünü yansıtır. Kaynak çalışmadaki yetişkinler sıcak ve uysal tarzların cümlelerine (ortalama 3,8–3,9), sert ve mesafeli tarzlarınkinden (2,1–2,2) çok daha fazla katılmıştır; bu yüzden ilk ikisinde yüksek, ötekilerde düşük sonuç sık görülebilir.',
      'Bütün cümleler aynı yönde yazılmıştır; ters puanlanan cümle yoktur. Cümlelerin çoğuna katılma (ya da katılmama) eğilimi bütün tarzları birlikte yükseltir (ya da düşürür); karşı karşıya duran tarzların birlikte yüksek ya da birlikte düşük çıkması buna işaret edebilir.',
      'Her tarz dört cümleyle ölçülür ve güvenirliği düşüktür; tek bir tarza bakarak kesin sonuç çıkarılmamalıdır.',
      'İnsanların ilişkilerdeki tarzı duruma ve kişilere göre değişebilir; sonuç genel eğilimi anlatır.',
      'Tanı koymaz; kişilik bozukluğu ya da ruh sağlığı değerlendirmesi değildir.',
      'Tarzların çember üzerindeki düzeninin Türkçe çeviride korunup korunmadığı henüz incelenmedi.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynaktaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
    ],
    citations: [
      {
        text: 'Markey, P. M. ve Markey, C. N. (2009). A brief assessment of the interpersonal circumplex: The IPIP-IPC. Assessment, 16(4), 352–361.',
      },
      {
        text: 'IPIP Kişilerarası Çember Ölçeği: maddeler ve tarzların anahtarı (Uluslararası Kişilik Madde Havuzu).',
        url: 'https://ipip.ori.org/newIPIP-IPCScoringKey.htm',
      },
      {
        text: 'Goldberg, L. R. ve ark. (2006). The International Personality Item Pool and the future of public-domain personality measures. Journal of Research in Personality, 40(1), 84–96.',
        url: 'https://doi.org/10.1016/j.jrp.2005.08.007',
      },
    ],
  },
};
