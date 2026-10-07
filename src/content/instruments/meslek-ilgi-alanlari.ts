import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Meslek İlgi Alanları
 * Kaynak: Oregon Vocational Interest Scales, ORVIS (Pozzebon, Visser, Ashton, Lee ve Goldberg, 2010). 92 madde,
 * 8 ölçek; Uluslararası Kişilik Madde Havuzu (IPIP) kapsamında yayımlanmıştır ve kamu malıdır: izin ve ücret
 * gerektirmeden her amaçla kullanılabilir, çevrilebilir (https://ipip.ori.org/). Ölçeğin kendi adı ve yazarları
 * anılır; "IPIP" tek başına bir ölçeğin adı olarak kullanılmaz.
 *
 * Türkçe sürüm (Ölçekhane, 2026): maddeler çevrildi; her maddenin İngilizce aslı `source` alanında durur.
 *  - Kültürel uyarlama (Türkiye'de karşılığı yok): 24 "Be a professor of English", 63 "Be a bounty hunter",
 *    73 "Be a state governor or senator". Siyasi görev maddeleri (33, 81) seçim sözcüğüyle yansız tutuldu.
 *  - Çıkarılan madde: 35 "Be a minister, priest, rabbi, or other religious teacher" (Yardım ölçeği). Din ve
 *    inançla ilgili bilgi istememe ilkemiz gereği kullanılmaz; ölçekte 12 madde kalır.
 * Bütün maddeler olumlu yönlüdür (ters puanlanan madde yoktur).
 * Durum: yayında; hoca 2026-10-07'de onayladı. Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.
 */

const L = 'leadership';
const O = 'organization';
const Y = 'altruism';
const C = 'creativity';
const A = 'analysis';
const P = 'production';
const M = 'adventure';
const E = 'erudition';

/** [özgün numara, ölçek, Türkçe, İngilizce aslı] — sıra kaynaktaki sıradır. */
const ITEMS: [number, string, string, string][] = [
  [1, L, 'Önemli işlerin gerçekleşmesini sağlamak', 'Make important things happen'],
  [2, O, 'Bir şirketin mali işlerinden sorumlu yönetici olmak', 'Be the financial officer for a company'],
  [3, Y, 'Başkalarının yeni fikirler öğrenmesine yardım etmek', 'Help others learn new ideas'],
  [4, C, 'Sanat eserleri yaratmak', 'Create works of art'],
  [5, A, 'Kimyager olmak', 'Be a chemist'],
  [6, P, 'Büyükbaş hayvanlara ya da atlara bakmak', 'Care for cattle or horses'],
  [7, M, 'Profesyonel sporcu olmak', 'Be a professional athlete'],
  [8, E, 'Çevirmen ya da tercüman olmak', 'Be a translator or interpreter'],
  [9, L, 'Başka insanlara liderlik etmek', 'Lead other people'],
  [10, O, 'Büro yöneticisi olmak', 'Be an office manager'],
  [11, Y, 'Hasta insanlara bakmak', 'Care for sick people'],
  [12, C, 'Yeni moda tasarımları yapmak', 'Create new fashion designs'],
  [13, A, 'Bir laboratuvar deneyi tasarlamak', 'Design a laboratory experiment'],
  [14, P, 'Çiftçi olmak', 'Be a farmer'],
  [15, M, 'Heyecan verici maceralara atılmak', 'Engage in exciting adventure'],
  [16, E, 'Kütüphaneci olmak', 'Be a librarian'],
  [17, L, 'Satış ya da pazarlama müdürü olmak', 'Be a sales or marketing director'],
  [18, O, 'Bütçe planlamak', 'Plan budgets'],
  [19, Y, 'İlkokul öğretmeni olmak', 'Be an elementary-school teacher'],
  [20, C, 'Profesyonel dansçı olmak', 'Be a professional dancer'],
  [21, A, 'Matematikçi olmak', 'Be a mathematician'],
  [22, P, 'Yeni binalar inşa etmek', 'Construct new buildings'],
  [23, M, 'Vahşi doğada hayatta kalmak', 'Survive in the wilderness'],
  // Kültürel uyarlama: Türkiye'de "İngilizce profesörü" yerine dil ve edebiyat öğretim üyeliği.
  [24, E, 'Üniversitede dil ve edebiyat dersleri vermek', 'Be a professor of English'],
  [25, L, 'Büyük bir şirketin genel müdürü olmak', 'Be the chief executive of a large company'],
  [26, O, 'Mali sözleşmeler hazırlamak', 'Prepare financial contracts'],
  [27, Y, 'Sosyal hizmet uzmanı olmak', 'Be a social worker'],
  [28, C, 'Öykü ya da roman yazmak', 'Write short stories or novels'],
  [29, A, 'Bilimsel kavramları başkalarına açıklamak', 'Explain scientific concepts to others'],
  [30, P, 'Orman muhafaza memuru olmak', 'Be a forest ranger'],
  [31, M, 'Yarış pilotu olmak', 'Be a racing car driver'],
  [32, E, 'Kelime bulmacaları hazırlamak', 'Make up word puzzles'],
  [33, L, 'Bir seçim kampanyası yürütmek', 'Organize a political campaign'],
  [34, O, 'Bir büro için dosyalama düzeni kurmak', 'Develop an office filing system'],
  // 35 "Be a minister, priest, rabbi, or other religious teacher" çıkarıldı (din ve inanç bilgisi istenmez).
  [36, C, 'Bir senfoni orkestrasında çalgı çalmak', 'Play an instrument in a symphony'],
  [37, A, 'Fizikçi olmak', 'Be a physicist'],
  [38, P, 'Bitki yetiştirmek', 'Cultivate plants'],
  [39, M, 'Fiziksel tehlikeyle yüz yüze gelmek', 'Face physical danger'],
  [40, E, 'Bir gazetenin editörlüğünü yapmak', 'Edit a newspaper'],
  [41, L, 'Bir toplantıda ya da törende sunuculuk yapmak', 'Be the master of ceremonies at a meeting'],
  [42, O, 'Başkalarının işini denetlemek', 'Supervise the work of others'],
  [43, Y, 'Yardıma ihtiyacı olan kişilere danışmanlık yapmak', 'Counsel persons who need help'],
  [44, C, 'Evinin dekorasyonunu yenilemek', "Redecorate one's house"],
  [45, A, 'Tıp alanında araştırma yapmak', 'Carry out medical research'],
  [46, P, 'Doğa yürüyüşlerine çıkmak', 'Go on nature walks'],
  [47, M, 'Subay olmak', 'Be a military officer'],
  [48, E, 'Birçok dil bilmek', 'Know many languages'],
  [49, L, 'Bir reklam kampanyası planlamak', 'Plan an advertising campaign'],
  [50, O, 'Yatırım stratejileri planlamak', 'Plan investment strategies'],
  [51, Y, 'Anne babalara çocuk bakımı konusunda bilgi vermek', 'Instruct parents on child care'],
  [52, C, 'Bir müze için sanat eserleri seçmek', 'Select art works for a museum'],
  [53, A, 'Bilim muhabiri olmak', 'Be a scientific reporter'],
  [54, P, 'Ahşap işleri yapmak', 'Do woodworking'],
  [55, M, 'Spor yarışmalarına katılmak', 'Compete in athletic events'],
  [56, E, 'Yurt dışı muhabiri olmak', 'Be a foreign correspondent'],
  [57, L, 'Herkese açık bir toplantıda tartışmaya katılmak', 'Debate topics in a public meeting'],
  [58, O, 'Zaman çizelgeleri hazırlamak', 'Establish time schedules'],
  [59, Y, 'Doktor ya da hemşire olmak', 'Be a doctor or nurse'],
  [60, C, 'Profesyonel olarak şarkı söylemek', 'Sing professionally'],
  [61, A, 'Karmaşık bulmacalar çözmek', 'Solve complex puzzles'],
  [62, P, 'Çiçek yetiştirmek', 'Raise flowers'],
  // Kültürel uyarlama: "ödül avcılığı"nın karşılığı yok; macera ve tehlike içeriği korunarak değiştirildi.
  [63, M, 'Paraşüt, dağcılık gibi ekstrem sporlar yapmak', 'Be a bounty hunter'],
  [64, E, 'Her konuda akıcı biçimde konuşabilmek', 'Speak fluently on any subject'],
  [65, L, 'Başkalarını görüşlerini değiştirmeye ikna etmek', 'Persuade others to change their views'],
  [66, O, 'Bir işletmenin harcamalarını izlemek', 'Monitor business expenses'],
  [67, Y, 'Fizyoterapist olmak', 'Be a physical therapist'],
  [68, C, 'Oyuncu olmak', 'Be an actor or actress'],
  [69, A, 'Bir bilgisayar programı geliştirmek', 'Develop a computer program'],
  [70, P, 'Otomobil ya da kamyon tamir etmek', 'Repair cars or trucks'],
  [71, M, 'Uzun mesafe bisiklet yarışçısı olmak', 'Be a long-distance bicycle rider'],
  [72, E, 'Çok sayıda kitap okumak', 'Read many books'],
  // Kültürel uyarlama: eyalet valisi ya da senatör yerine Türkiye'deki karşılıkları.
  [73, L, 'Vali ya da milletvekili olmak', 'Be a state governor or senator'],
  [74, O, 'Bir şirketin satın alma sorumlusu olmak', 'Be a purchasing agent'],
  [75, Y, 'Başkalarına teselli ve destek vermek', 'Provide comfort and support to others'],
  [76, C, 'Sanatçı ya da mimar olmak', 'Be an artist or architect'],
  [77, A, 'İstatistikçi olmak', 'Be a statistician'],
  [78, P, 'Alet ve makinelerle çalışmak', 'Work with tools and machinery'],
  [79, M, 'Polis olmak', 'Be a police officer'],
  [80, E, 'Günlük tutmak', 'Keep a diary or journal'],
  [81, L, 'Seçimle gelinen bir göreve aday olmak', 'Run for political office'],
  [82, O, 'Bir şirketin stoklarını takip etmek', "Keep track of a company's inventory"],
  [83, Y, 'Yardım etkinliklerine katılmak', 'Participate in charity events'],
  [84, C, 'Bir tiyatro oyununda rol almak', 'Act in a play'],
  [85, C, 'İnternet sayfaları tasarlamak', 'Design Internet web pages'],
  [86, L, 'Pek çok insanı etkileyen kararlar vermek', 'Make decisions that affect a lot of people'],
  [87, O, 'Bir bilgisayar veri tabanını yönetmek', 'Manage a computer data base'],
  [88, Y, 'İnsanların meslek kararları vermesine yardım etmek', 'Help people make career decisions'],
  [89, C, 'Şarkı yazmak', 'Write songs'],
  [90, O, 'Ayrıntılı kayıt tutmak', 'Keep detailed records'],
  [91, Y, 'Psikolojik danışman ya da terapist olmak', 'Be a counselor or therapist'],
  [92, C, 'Resim ya da çizim yapmak', 'Paint or draw'],
];

/** Kaynakta uyarlanan ve çıkarılan maddelerin numaraları (inceleme belgesi ve testler için). */
export const ORVIS_ADAPTED = [24, 63, 73];
export const ORVIS_REMOVED = [35];

const items: LikertItemDef[] = ITEMS.map(([n, scale, text, source]) => ({
  key: `o${String(n).padStart(2, '0')}`,
  scale,
  text,
  source,
}));

export const meslekIlgiAlanlari: LikertInstrument = {
  slug: 'meslek-ilgi-alanlari',
  version: 1,
  engine: 'likert',
  profile: 'interests',
  name: 'Meslek İlgi Alanları',
  shortName: 'Meslek ilgi alanları',
  domain: 'career',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 9,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 10,
  sortOrder: 31,
  tagline:
    'Sekiz ilgi alanında hangi işlerden ve etkinliklerden hoşlandığını ölçer; en belirgin ilgi alanlarını ve onlarla ilişkili alan örneklerini gösterir.',
  description:
    'Kamu malı bir ilgi ölçeği olan Oregon Mesleki İlgi Ölçekleri’ne (ORVIS) dayanan bu test, liderlikten sanata, bilimden doğaya sekiz ilgi alanında hangi işlerden ne kadar hoşlanıldığını ölçer. Sonuçta alanlar en yüksekten en düşüğe sıralanır; en belirgin ilgi alanlarının açıklamasını ve bu ilgilerle ilişkili okul ve meslek alanlarına örnekleri görürsünüz.',
  intro: {
    title: 'Hangi işler sana göre?',
    paragraphs: [
      'Birazdan 91 iş ve etkinlik göreceksin. Her birini yapmaktan ne kadar hoşlanacağını seç.',
      'O işi yapıp yapamayacağını, ne kadar kazandıracağını ya da başkalarının ne düşüneceğini düşünme. Yalnızca hoşlanıp hoşlanmayacağını düşün.',
      'Bazı işler sana uzak gelebilir. Bir gün o işi yaptığını hayal et ve ilk aklına geleni işaretle.',
    ],
  },
  prompt: 'Bunu yapmaktan ne kadar hoşlanırdın?',
  options: [
    { value: 1, label: 'Hiç hoşlanmam' },
    { value: 2, label: 'Pek hoşlanmam' },
    { value: 3, label: 'Kararsızım' },
    { value: 4, label: 'Hoşlanırım' },
    { value: 5, label: 'Çok hoşlanırım' },
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
    { key: L, name: 'Liderlik ve İkna', plain: 'İnsanlara yön vermekten, ikna etmekten, karar almaktan ve sorumluluk üstlenmekten hoşlanmak.' },
    { key: O, name: 'Düzen ve Organizasyon', plain: 'Planlama, bütçe, kayıt ve düzen gerektiren işlerden; sayılar ve ayrıntılarla çalışmaktan hoşlanmak.' },
    { key: Y, name: 'Yardım ve Destek', plain: 'İnsanlara yardım etmekten, öğretmekten, bakım vermekten ve destek olmaktan hoşlanmak.' },
    { key: C, name: 'Sanat ve Yaratıcılık', plain: 'Resim, müzik, yazı, sahne ve tasarım gibi yaratıcı, kendini ifade eden işlerden hoşlanmak.' },
    { key: A, name: 'Bilim ve Analiz', plain: 'Bilimsel araştırmadan, matematikten, deneylerden ve karmaşık problemleri çözmekten hoşlanmak.' },
    { key: P, name: 'Doğa ve Üretim', plain: 'Doğada, toprakla, hayvanlarla ya da alet ve makinelerle elle yapılan somut işlerden hoşlanmak.' },
    { key: M, name: 'Macera ve Hareket', plain: 'Heyecan, hareket, fiziksel mücadele ve risk içeren işlerden hoşlanmak.' },
    { key: E, name: 'Dil ve Edebiyat', plain: 'Okumaktan, yazmaktan, dillerden ve bilgi birikimiyle uğraşmaktan hoşlanmak.' },
  ],
  items,
  science: {
    basedOn:
      'Oregon Mesleki İlgi Ölçekleri, ORVIS (Pozzebon, Visser, Ashton, Lee ve Goldberg, 2010). Uluslararası Kişilik Madde Havuzu (IPIP) kapsamında yayımlanmış kamu malı bir ölçektir; kaynaktaki 92 maddeden 91’i kullanılır.',
    whatItMeasures:
      'Sekiz ilgi alanında işlerden ve etkinliklerden ne kadar hoşlanıldığını ölçer: Liderlik ve İkna, Düzen ve Organizasyon, Yardım ve Destek, Sanat ve Yaratıcılık, Bilim ve Analiz, Doğa ve Üretim, Macera ve Hareket, Dil ve Edebiyat. Mesleki ilgiler, okul ve iş hayatındaki tercihlerle ve başarıyla ilişkili, görece kalıcı eğilimlerdir.',
    turkishVersion:
      'Maddeler Ölçekhane tarafından Türkçeye çevrildi. Türkiye’de karşılığı olmayan üç iş kültürel olarak uyarlandı (ör. “eyalet valisi ya da senatör” yerine “vali ya da milletvekili”). Din görevliliğiyle ilgili bir madde, din ve inançla ilgili bilgi istememe ilkemiz gereği çıkarıldı. Bu çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    reliability:
      'Kaynak çalışmada sekiz ölçeğin iç tutarlılığı (Cronbach α) .75 ile .91 arasında bildirilmiştir; çalışma üniversite öğrencileri ve yetişkin bir topluluk örneklemiyle yapılmıştır. Türkçe çevirinin güvenirliği henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok. Puanlar 1–5 cevap aralığına göre ve kişinin kendi profili içinde, en yüksekten en düşüğe sıralanarak yorumlanır; sonuç başkalarıyla karşılaştırılmaz.',
    ageNote:
      '9. sınıftan itibaren uygulanır; mezunlar ve yetişkinler de çözebilir. Kaynak çalışma üniversite öğrencileri ve yetişkinlerle yapılmıştır. İlgiler ergenlik boyunca gelişmeye devam ettiği için lise öğrencilerinde sonuçlar bir keşif aracı olarak sunulur.',
    license: 'Kamu malı: IPIP maddeleri izin ve ücret gerektirmeden her amaçla kullanılabilir ve çevrilebilir.',
    licenseUrl: 'https://ipip.ori.org/',
    limitations: [
      'İlgi, yetenek demek değildir. Bir alana ilgi duymak o alanda şimdiden başarılı olmak anlamına gelmez; tersi de doğrudur.',
      'İlgiler ergenlikte ve genç yetişkinlikte değişebilir; yaş ilerledikçe daha kararlı hâle gelir. Lise öğrencilerinin testi bir iki yılda bir tekrarlaması önerilir.',
      'Türkçe çevirinin güvenirlik ve geçerlik çalışması henüz yapılmadı; kaynak çalışmadaki değerler bu çeviri için doğrudan geçerli sayılmamalıdır.',
      'Alan örnekleri yol gösterici niteliktedir, bir meslek önerisi değildir. Meslek seçiminde değerler, beceriler, olanaklar ve yaşam koşulları da önemlidir.',
      'Bazı maddeler yetişkin iş hayatından örnekler içerir; hiç tanımadığın bir işte kendini hayal ederek cevap vermen yeterlidir.',
    ],
    citations: [
      {
        text: 'Pozzebon, J. A., Visser, B. A., Ashton, M. C., Lee, K. ve Goldberg, L. R. (2010). Psychometric characteristics of a public-domain self-report measure of vocational interests: The Oregon Vocational Interest Scales. Journal of Personality Assessment, 92(2), 168–174.',
        url: 'https://ipip.ori.org/newORVISKey.htm',
      },
      {
        text: 'Schreiber, M. (2016). Handbuch zum Fragebogen ORVIS-R. Zürcher Hochschule für Angewandte Wissenschaften (ORVIS’in güvenirlik değerlerini aktaran kaynak).',
        url: 'https://laufbahndiagnostik.zhaw.ch/downloads/de/Handbuch_Fragebogen_ORVIS-R.pdf',
      },
      {
        text: 'Low, K. S. D., Yoon, M., Roberts, B. W. ve Rounds, J. (2005). The stability of vocational interests from early adolescence to middle adulthood. Psychological Bulletin, 131(5), 713–737.',
        url: 'https://doi.org/10.1037/0033-2909.131.5.713',
      },
      {
        text: 'Nye, C. D., Su, R., Rounds, J. ve Drasgow, F. (2012). Vocational interests and performance: A quantitative summary of over 60 years of research. Perspectives on Psychological Science, 7(4), 384–403.',
        url: 'https://doi.org/10.1177/1745691612449021',
      },
    ],
  },
};
