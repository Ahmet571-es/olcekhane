import type { PerspectiveItem, PerspectiveObject, PerspectiveTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Bakış Açısı Alma
 * Düzen: uzamsal yönelim (bakış açısı alma) testleri (Kozhevnikov ve Hegarty, 2001; Hegarty ve Waller, 2004'ün kullandığı
 * 12 soruluk kâğıt kalem testi; bilgisayar sürümü Friedman ve ark., 2020). Bir haritada yedi nesne vardır; her soruda bir
 * nesnenin yanında durup başka bir nesneye bakıldığı hayal edilir ve üçüncü nesnenin yönü bir çemberin üstünde okla
 * gösterilir. Puan, gösterilen yönün doğru yönden saptığı açıların ortalamasıdır (0–180; cevapsız soru 90 derece: Hegarty
 * laboratuvarının puanlama yönergesi "How to score the Spatial Orientation Test"; Friedman ve ark., 2020).
 *
 * Friedman ve ark.'nın (2020) değişiklikleri izlendi: nesneler önü arkası olmayan, canlı olmayan nesnelerdir (bakış yönünü
 * ele vermesinler); her nesnenin ortası bir noktayla gösterilir; geri bildirimli üç alıştırma vardır; cevap çemberin
 * üstüne dokunularak ya da sürüklenerek verilir. Harita, nesneler ve sorular özgündür (Ölçekhane, 2026): konumlar ve sorular
 * bir üreticiyle seçildi (scratchpad'de; depoda yalnızca sonuç var) ve tests/bakis-acisi-alma.test.ts bağımsız bir hesapla
 * denetler:
 *  - nesneler birbirinden en az 24 birim uzakta; bir sorunun iki çizgisinden (duran → bakılan, duran → hedef) öteki
 *    nesneler en az 9 birim uzakta; iki çizgi de en az 28 birim uzunlukta;
 *  - doğru cevap tam önde ya da tam arkada değil (30–150 derece sağda ya da solda): sağ ile solun karıştırıldığı cevap
 *    doğru cevaptan en az 60 derece uzak;
 *  - zihinde dönülmesi gereken açı (bakılan nesnenin ekranın yukarısıyla yaptığı açı) 0–45 derece 2, 45–90 derece 4,
 *    90–135 derece 3, 135–180 derece 3 soruda: altı küçük (en çok 90), altı büyük dönüş; hiçbir dönüş 45, 90 ve 135
 *    derecelik sınırlara 5 dereceden yakın değil (soru, grubu belirsiz kalacak kadar sınırda değil);
 *  - doğru cevaplar dengeli: 3 sağ ön, 3 sağ arka, 3 sol ön, 3 sol arka; bakış 6 soruda sağa, 6 soruda sola döner;
 *  - dönüşü en az 45 derece olan 10 soruda haritaya göre cevap (hedefin haritadaki yönü) doğru cevaptan da sağ-sol
 *    karışıklığından da en az 45 derece uzak: üç bölge (±20 derece) birbirine değmez;
 *  - aynı nesnenin yanında durulan iki soruda bakılan ve gösterilen nesneler yer değiştirmez; art arda iki soruda aynı
 *    nesnenin yanında durulmaz; yönergedeki örnek ve alıştırmalar asıl sorularla aynı durma-bakma çiftini kullanmaz.
 * Soru sırası: küçük ve büyük dönüşler karışık, ilk soru en kolaylardan.
 *
 * Yaş: 7. sınıftan yetişkine. 8–16 yaşlarındaki çocuklarla kâğıt kalem testinde ortalama hata ortalama 11,5 yaşında 63,5
 * derece (rastgele düzeyi 90), aynı çocuklar 15 yaşına gelince 38,9 derece, ebeveynlerde 24,5 derece (Brucato ve ark., 2022).
 *
 * Durum: pilot (site sahibinin 2026-10-07 kararı: özgün testler doğrudan yayına alınır, hoca yayındaki siteyi inceler).
 */

/** Haritadaki nesneler: konumlar 0–100 (y aşağı doğru). Hepsi önü arkası olmayan, canlı olmayan nesneler. */
const OBJECTS: PerspectiveObject[] = [
  { key: 'agac', name: 'Ağaç', gen: 'ağacın', dat: 'ağaca', x: 92, y: 30 },
  { key: 'cesme', name: 'Çeşme', gen: 'çeşmenin', dat: 'çeşmeye', x: 32, y: 16 },
  { key: 'lamba', name: 'Lamba', gen: 'lambanın', dat: 'lambaya', x: 58, y: 35 },
  { key: 'kova', name: 'Kova', gen: 'kovanın', dat: 'kovaya', x: 22, y: 75 },
  { key: 'saksi', name: 'Saksı', gen: 'saksının', dat: 'saksıya', x: 77, y: 80 },
  { key: 'top', name: 'Top', gen: 'topun', dat: 'topa', x: 19, y: 41 },
  { key: 'kaya', name: 'Kaya', gen: 'kayanın', dat: 'kayaya', x: 55, y: 61 },
];

const [AGAC, CESME, LAMBA, KOVA, SAKSI, TOP, KAYA] = [0, 1, 2, 3, 4, 5, 6];
const q = (at: number, facing: number, target: number): PerspectiveItem => ({ at, facing, target });

/** Yönergedeki örnek: kayanın yanında durup çeşmeye bakınca (yaklaşık 27° sola dönüş) kova solda (yaklaşık 86°). */
const EXAMPLE: PerspectiveItem = q(KAYA, CESME, KOVA);

/** Alıştırmalar: küçük (yaklaşık 28°), orta (50°) ve büyük (yaklaşık 138°) dönüş; cevaplar sağ ön, sol (yaklaşık 111°), sağ ön. */
const PRACTICE: PerspectiveItem[] = [q(TOP, CESME, LAMBA), q(KAYA, AGAC, TOP), q(LAMBA, KOVA, TOP)];

/** Asıl sorular, gösterilme sırasıyla. */
const ITEMS: PerspectiveItem[] = [
  q(KOVA, TOP, LAMBA),
  q(KAYA, TOP, KOVA),
  q(CESME, AGAC, TOP),
  q(SAKSI, AGAC, LAMBA),
  q(AGAC, SAKSI, KAYA),
  q(KOVA, KAYA, TOP),
  q(LAMBA, TOP, SAKSI),
  q(TOP, KOVA, CESME),
  q(LAMBA, CESME, AGAC),
  q(SAKSI, KOVA, AGAC),
  q(TOP, KAYA, CESME),
  q(CESME, KAYA, TOP),
];

export const BAKIS_ACISI_OBJECTS: readonly PerspectiveObject[] = OBJECTS;

const task: PerspectiveTask = {
  key: 'bakis-acisi-alma',
  kind: 'perspective',
  name: 'Bakış Açısı Alma',
  measures: 'Kendini zihinde başka bir yere ve yöne koyup çevredeki nesnelerin oradan hangi yönde kaldığını kestirebilmeyi ölçer.',
  instructions: [
    'Ekranda yedi nesnenin olduğu bir harita göreceksin. Harita hiç dönmez.',
    'Her soruda kendini bir nesnenin yanında, yüzün başka bir nesneye dönük hayal et. Sonra üçüncü nesnenin senin için hangi yönde kaldığını, çemberin üstünde bir okla göster.',
    'Çemberin ortası durduğun yerdir; yukarıyı gösteren ok, baktığın nesnenin yönüdür. Çemberin üstüne dokun ya da oku sürükle; emin olunca cevabı ver.',
    'Ekranı, telefonu ya da başını çevirme; yalnızca zihninde dön. Kâğıt ya da kalem kullanma.',
  ],
  objects: OBJECTS,
  example: EXAMPLE,
  practice: PRACTICE,
  items: ITEMS,
};

export const bakisAcisiAlma: TaskInstrument = {
  slug: 'bakis-acisi-alma',
  version: 1,
  engine: 'tasks',
  name: 'Bakış Açısı Alma',
  shortName: 'Bakış açısı alma',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 7,
  maxGrade: 13,
  adults: true,
  estimatedMinutes: 10,
  sortOrder: 49.87,
  tagline: 'Bir haritadaki nesnelere kendini başka bir yerde ve yönde hayal ederek bakabilmeyi, yani zihinde bakış açısı değiştirebilmeyi ölçer.',
  description:
    'Bu test, uzamsal yönelimi ölçmek için kullanılan bakış açısı alma testlerinin düzenine dayanır. Ekranda yedi nesnenin olduğu bir harita vardır; her soruda bir nesnenin yanında durup başka bir nesneye baktığını hayal edersin ve üçüncü nesnenin senin için hangi yönde kaldığını bir çemberin üstünde okla gösterirsin. Harita, nesneler ve sorular Ölçekhane tarafından özgün olarak hazırlanmıştır. Rapor; gösterilen yönlerin doğru yönden ortalama kaç derece saptığını, kendini zihinde az ya da çok döndürmeyi gerektiren soruların karşılaştırmasını, yanlış yönlerde sağ ile solun karıştırılıp karıştırılmadığını ve sorulara nasıl çalışıldığını sade bir dille anlatır. Zekâ puanı (IQ) vermez ve tanı koymaz.',
  intro: {
    title: 'O nesne senin için hangi yönde?',
    paragraphs: [
      'Birazdan yedi nesnenin olduğu bir harita göreceksin. Her soruda kendini bir nesnenin yanında, yüzün başka bir nesneye dönük hayal edeceksin ve üçüncü nesnenin senin için hangi yönde kaldığını bir okla göstereceksin.',
      `Test ${ITEMS.length} soru; önce ${PRACTICE.length} alıştırma sorusu var. Süre sınırı yok. Ekranı, telefonu ya da başını çevirmeden, yalnızca zihninde dönerek çöz.`,
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan çözersen sonuç seni daha iyi yansıtır. Harita büyük bir ekranda daha rahat görünür.',
    ],
  },
  scales: [
    {
      key: 'ba_hata',
      name: 'Yön gösterme isabeti',
      plain: 'Gösterilen yönlerin doğru yönden ortalama kaç derece saptığı: hata ne kadar küçükse yönler o kadar isabetli gösterilmiştir.',
    },
    {
      key: 'ba_donus',
      name: 'Küçük ve büyük dönüşler',
      plain:
        'Bakılan nesnenin haritada durulan yerin yukarısında ya da yanında kaldığı, yani zihinde en çok 90 derece dönmeyi gerektiren sorularla bakılan nesnenin aşağıda kaldığı, daha çok dönmeyi gerektiren soruların karşılaştırması.',
    },
    {
      key: 'ba_tur',
      name: 'Hata türleri',
      plain: 'Yanlış gösterilen yönlerde sağ ile solun karıştırılıp karıştırılmadığı ve yönün haritaya yukarıdan bakar gibi gösterilip gösterilmediği.',
    },
    { key: 'ba_calisma', name: 'Çalışma biçimi', plain: 'Sorulara ne kadar zaman ayrıldığı ve hep aynı yönün gösterilip gösterilmediği.' },
  ],
  tasks: [task],
  science: {
    basedOn:
      'Uzamsal yönelim (bakış açısı alma) testlerinin düzeni: bir grup nesne gösterilir; kişi bir nesnenin yanında durup başka bir nesneye baktığını hayal eder ve üçüncü nesnenin yönünü bir çemberin üstünde gösterir (Kozhevnikov ve Hegarty, 2001). Hegarty ve Waller’in (2004) kullandığı kâğıt kalem testinde yedi nesne ve 12 soru vardır, süre 5 dakikadır ve kitapçığı döndürmek yasaktır (Hegarty, Kozhevnikov ve Waller, 2008; Friedman ve ark., 2020). O testin bilgisayar sürümünde nesneler önü arkası olmayan, canlı olmayan nesnelerdir, her nesnenin ortası bir noktayla gösterilir ve sorulardan önce geri bildirimli üç alıştırma yapılır (Friedman ve ark., 2020). Puan, gösterilen yönün doğru yönden saptığı açıların ortalamasıdır; cevaplanmayan bir soru, rastgele düzeyi olan 90 derece sayılır (Hegarty Spatial Thinking Lab, t.y.; Friedman ve ark., 2020). Ölçekhane’nin testi bu düzene dayanır; harita, nesneler, sorular ve rapor özgündür, başka testlerden harita, soru ya da norm alınmamıştır. Bu testte süre sınırı yoktur ve gençler için kendini zihinde az döndürmeyi gerektiren sorular da vardır.',
    whatItMeasures:
      'Bakış açısı almayı, yani kendini zihinde başka bir yere ve yöne koyup çevredeki nesnelerin oradan hangi yönde kaldığını kestirebilmeyi ölçer. Bir cismi zihinde döndürme becerisi ile kendini zihinde yeniden yönlendirme becerisinin birbirinden ayrılabilen uzamsal beceriler olduğu bulunmuştur (Kozhevnikov ve Hegarty, 2001); Hegarty ve Waller’in (2004) çalışmasında da bu iki tür testi ayıran iki faktörlü bir model, tek faktörlü modelden daha iyi uymuştur (aktaran Hodgkiss ve ark., 2021). Kozhevnikov ve Hegarty’nin (2001) bulguları, hayal edilen bakış yönü haritanın yönünden 90 dereceden fazla farklı olduğunda kişilerin nesnelerin yerini kendi bedenlerine göre (önüm, sağım gibi) düşündüğüne işaret eder. Bakış yönünü hayalde ne kadar çok değiştirmek gerekirse yanlışlar ve cevap süresi o kadar artar; öndeki bir nesneyi göstermek, yandaki ya da arkadaki bir nesneyi göstermekten daha isabetlidir (Gunalp ve ark., 2021). Hegarty ve Waller’in kullandığı testin bilgisayar sürümünün sonuçları, kâğıt kalem sürümünün sonuçlarıyla üç deneyde güçlü biçimde ilişkili bulunmuştur (r = .62–.71; Friedman ve ark., 2020). Aynı çalışmada 44 üniversite öğrencisiyle yapılan deneyde iki sürümün sonuçları da haritada çizili bir yolun her dönemecinde sağa mı sola mı dönüldüğünü bulma testiyle ve kişilerin kendi yön duygusunu değerlendirdiği bir ölçekle orta düzeyde ilişkili bulunmuştur (Friedman ve ark., 2020). Bu bulgular o test içindir; bu testin geçerlik çalışması henüz yapılmadı.',
    turkishVersion: 'Özgün test. Yönergeler ve sorular Türkçe yazılmıştır; nesnelerin adları haritada da yazılıdır.',
    reliability:
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı. Aynı düzendeki testlerin iç tutarlılığı başka çalışmalarda iyi ya da yüksek bulunmuştur: 12 soruluk bilgisayar sürümünün 60–90 yaşlarındaki 380 kişideki Cronbach α değeri .87’dir (Prevratil ve ark., 2023); yarısından fazlasında görsel-uzamsal ya da motor gelişimle ilgili güçlükler bulunan, 8–16 yaşlarındaki 85 çocukla kullanılan altı soruluk kısa bir kâğıt kalem sürümününki .79’dur (Orefice ve ark., 2024). Bu değerler, sorular farklı olduğu için bu test için geçerli sayılamaz. Şu denetimler güvenirlik kanıtı değil, soruların doğruluğu için yapılmıştır: her sorunun doğru cevabı nesnelerin konumundan ayrı bir hesapla yeniden bulunmuş; doğru cevabın tam önde ya da tam arkada olmadığı, nesnelerin birbirine ve soruların çizgilerine çok yakın olmadığı ve hata türlerinin birbirinden ayırt edilebildiği denetlenmiştir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yok; sonuç akranlarla karşılaştırılmadan, gösterilen yönlerin doğru yönden ortalama kaç derece saptığıyla anlatılır. Zekâ puanı (IQ) verilmez. Yorumlamaya yardım için: rastgele gösterilen yönlerin ortalama hatası 90 derecedir; üniversitede okuyan 165 kişiyle yapılan bir deneyde bilgisayar sürümü ilk çözüldüğünde ortalama hata yaklaşık 29 derecedir (Friedman ve ark., 2020). İlk ölçümde 8–16 yaşlarında olan çocukların yaklaşık üç yıl arayla iki kez ölçüldüğü bir çalışmada kâğıt kalem sürümünde ortalama hata, çocukların yaş ortalaması yaklaşık 11,5 iken yaklaşık 64, yaklaşık 15 iken yaklaşık 39 derece; ebeveynlerinde yaklaşık 25 derece bulunmuştur (Brucato ve ark., 2022). Bu sayılar süre sınırlı başka testlerden alınmıştır; bu testle doğrudan karşılaştırılamaz.',
    ageNote:
      '7. sınıftan itibaren uygulanır; yetişkinler de çözebilir. Bakış açısı alma, çocuklukta zihinde döndürmeden daha yavaş gelişir (Frick ve Pichelmann, 2023). Bu düzendeki bir testte, ilk ölçümde 8–16 yaşlarında olan çocukların hataları yaklaşık üç yılda belirgin biçimde azalmıştır: beceri ergenlikte de gelişmeye devam eder. Araştırmacılar testin en küçük yaşlara tam uygun olmayabileceğini belirtir (Brucato ve ark., 2022). Yaş ortalaması yaklaşık 11,5 olan çocuklarda o testteki ortalama hata (yaklaşık 64 derece), bu testte rastgele cevaplardan ayırt edilebilme sınırı olan 65 dereceye yakın olduğu için test 7. sınıftan başlar. Aynı sonuç farklı yaşlarda farklı anlama gelir.',
    license: 'Özgün test. Harita, nesneler, sorular ve rapor Ölçekhane tarafından geliştirilmiştir; puanlama kuralı bu düzendeki testlerinkiyle aynıdır.',
    limitations: [
      'Zekâ puanı (IQ) vermez ve tanı koymaz; kapsamlı bir değerlendirme yalnızca uzmanlarca, geçerliği gösterilmiş testlerle yapılabilir.',
      'Uzamsal becerinin yalnızca bir yönünü (kendini zihinde başka bir yere ve yöne koymayı) ölçer; gerçek bir ortamda yol bulmayı doğrudan ölçmez.',
      'Rastgele gösterilen yönlerin ortalama hatası 90 derecedir; 12 soruda rastgele gösterilen yönlerle de ortalama hata 65 dereceye kadar düşebilir (olasılığı yaklaşık %5). Bu yüzden ortalama hatası 65 derecenin üstündeki sonuçlar yorumlanmaz; yanlışlar belirli bir türde toplanıyorsa yalnızca bu tür anlatılır.',
      'Ekranı, telefonu ya da başı çevirmek soruları kolaylaştırır; test bunu engelleyemez. Sonuç, yalnızca zihinde dönülerek çözüldüğünde anlamlıdır.',
      'Sonuç; o günkü yorgunluk, dikkat ve ekranın büyüklüğünden etkilenebilir. Bu tür bir test ikinci kez çözüldüğünde hatalar azalabilir (Friedman ve ark., 2020).',
      'Bu testin güvenirlik, geçerlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Brucato, M., Nazareth, A. ve Newcombe, N. S. (2022). Longitudinal development of cognitive mapping from childhood to adolescence. Journal of Experimental Child Psychology, 219, 105412.',
        url: 'https://doi.org/10.1016/j.jecp.2022.105412',
      },
      {
        text: 'Frick, A. ve Pichelmann, S. (2023). Measuring spatial abilities in children: A comparison of mental-rotation and perspective-taking tasks. Journal of Intelligence, 11(8), 165.',
        url: 'https://doi.org/10.3390/jintelligence11080165',
      },
      {
        text: 'Friedman, A., Kohler, B., Gunalp, P., Boone, A. P. ve Hegarty, M. (2020). A computerized spatial orientation test. Behavior Research Methods, 52(2), 799–812.',
        url: 'https://doi.org/10.3758/s13428-019-01277-3',
      },
      {
        text: 'Gunalp, P., Chrastil, E. R. ve Hegarty, M. (2021). Directionality eclipses agency: How both directional and social cues improve spatial perspective taking. Psychonomic Bulletin & Review, 28(4), 1289–1300.',
        url: 'https://doi.org/10.3758/s13423-021-01896-y',
      },
      {
        text: 'Hegarty, M., Kozhevnikov, M. ve Waller, D. (2008). Perspective Taking/Spatial Orientation Test [Test kitapçığı]. University of California, Santa Barbara.',
        url: 'https://hegarty-lab.psych.ucsb.edu/sites/default/files/2022-06/Redrawn%20PTSOT%20Packet_0.pdf',
      },
      {
        text: 'Hegarty, M. ve Waller, D. (2004). A dissociation between mental rotation and perspective-taking spatial abilities. Intelligence, 32(2), 175–191.',
        url: 'https://doi.org/10.1016/j.intell.2003.12.001',
      },
      {
        text: 'Hegarty Spatial Thinking Lab. (t.y.). How to score the Spatial Orientation Test [Puanlama yönergesi]. University of California, Santa Barbara.',
        url: 'https://hegarty-lab.psych.ucsb.edu/sites/default/files/2022-06/Procedure%20for%20scoring%20perspective%20taking%20test%20-%20Short_1.pdf',
      },
      {
        text: 'Hodgkiss, A., Gilligan-Lee, K. A., Thomas, M. S. C., Tolmie, A. K. ve Farran, E. K. (2021). The developmental trajectories of spatial skills in middle childhood. British Journal of Developmental Psychology, 39(4), 566–583.',
        url: 'https://doi.org/10.1111/bjdp.12380',
      },
      {
        text: 'Kozhevnikov, M. ve Hegarty, M. (2001). A dissociation between object manipulation spatial ability and spatial orientation ability. Memory & Cognition, 29(5), 745–756.',
        url: 'https://doi.org/10.3758/BF03200477',
      },
      {
        text: 'Orefice, C., Cardillo, R., Lonciari, I., Zoccante, L. ve Mammarella, I. C. (2024). “Picture this from there”: Spatial perspective-taking in developmental visuospatial disorder and developmental coordination disorder. Frontiers in Psychology, 15, 1349851.',
        url: 'https://doi.org/10.3389/fpsyg.2024.1349851',
      },
      {
        text: 'Prevratil, M. J., Kossowska-Kuhn, D., Gray, N. ve Charness, N. (2023). Components of navigation ability and their predictors in a community-dwelling sample of older adults. Frontiers in Aging, 4, 1239094.',
        url: 'https://doi.org/10.3389/fragi.2023.1239094',
      },
    ],
  },
};
