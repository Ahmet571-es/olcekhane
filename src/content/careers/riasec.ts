/**
 * Holland’ın RIASEC modeli: altı ilgi alanı, öğrenciye ve veliye yönelik açıklamalar,
 * örnek meslekler ve Türkiye’deki eğitim yolları.
 *
 * Meslek kodları Holland kuramına göre Ölçekhane tarafından yaklaşık olarak atanmıştır ve yol
 * gösterici örneklerdir; resmî ya da kesin bir eşleştirme değildir. Kod, mesleğin en çok hangi
 * ilgi alanlarına hitap ettiğini baskınlık sırasına göre gösterir (ör. "SA": önce sosyal, sonra sanatçı).
 */

export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

/** Altıgendeki sıra: komşu alanlar birbirine benzer, karşı köşeler en az benzer. */
export const RIASEC_ORDER: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export interface RiasecType {
  key: RiasecKey;
  /** Testteki ölçek anahtarı. */
  scaleKey: string;
  name: string;
  english: string;
  /** Tek cümlelik tanım. */
  plain: string;
  /** Öğrenciye: bu alan senin için belirginse. */
  student: string;
  /** Veliye: bu alan çocuğunuz için belirginse. */
  parent: string;
  /** Bu alandaki insanların sevdiği etkinlik türleri. */
  likes: string[];
  /** Keşif için öneriler (kulüpler, projeler, deneyimler). */
  explore: string[];
  /** Türkiye’deki eğitim yolları. */
  paths: { lise: string; universite: string };
}

export const RIASEC_TYPES: Record<RiasecKey, RiasecType> = {
  R: {
    key: 'R',
    scaleKey: 'realistic',
    name: 'Gerçekçi',
    english: 'Realistic',
    plain: 'Elle, aletlerle, makinelerle ya da doğada somut işler yapmaktan hoşlanmak.',
    student:
      'Ellerinle bir şey yapmaktan, söküp takmaktan, kurmaktan ve onarmaktan hoşlanıyorsun. Sonucu elle tutulur işler, makineler, araçlar, bitkiler ya da açık hava sana daha çekici geliyor.',
    parent:
      'Çocuğunuz somut, elle yapılan işlerden hoşlandığını belirtiyor: bir şeyi tamir etmek, kurmak, yetiştirmek ya da açık havada çalışmak. Atölye, tamir, yapım ve açık hava etkinliklerinde deneme fırsatları onun için değerli olabilir.',
    likes: ['Tamir etmek, kurmak, monte etmek', 'Makinelerle ve aletlerle çalışmak', 'Açık havada ve doğada olmak', 'Sonucu gözle görülen işler'],
    explore: [
      'Robotik, maket ya da tasarım-beceri atölyelerine katıl.',
      'Evde bir tamir işinde bir büyüğüne yardım et.',
      'Bir fidan ya da sebze yetiştir, büyümesini izle.',
      'Bir teknik servisi, atölyeyi ya da çiftliği ziyaret etme fırsatı yarat.',
    ],
    paths: {
      lise: 'Mesleki ve teknik Anadolu liselerindeki elektrik-elektronik, makine, motorlu araçlar, bilişim, tesisat ve tarım alanları; Anadolu liselerinde sayısal ağırlıklı dersler.',
      universite: 'Makine, inşaat, elektrik-elektronik, ziraat ve orman mühendislikleri; veteriner fakültesi; meslek yüksekokullarının teknik programları.',
    },
  },
  I: {
    key: 'I',
    scaleKey: 'investigative',
    name: 'Araştırmacı',
    english: 'Investigative',
    plain: 'Gözlem yapmaktan, araştırmaktan ve karmaşık problemleri çözmekten hoşlanmak.',
    student:
      'Bir şeyin nasıl ve neden olduğunu anlamak istiyorsun. Soru sormak, araştırmak, deney yapmak ve zor problemler üzerinde düşünmek sana keyif veriyor.',
    parent:
      'Çocuğunuz araştırmaktan, bir şeyin nedenini anlamaktan ve problem çözmekten hoşlandığını belirtiyor. Merakını besleyen kitaplar, bilim etkinlikleri ve kendi başına araştırma fırsatları ona iyi gelebilir.',
    likes: ['Neden ve nasıl sorularına cevap aramak', 'Deney ve gözlem yapmak', 'Matematik ve mantık problemleri', 'Bilgiyi karşılaştırıp sonuca varmak'],
    explore: [
      'Bir bilim fuarı projesi hazırla ya da TÜBİTAK proje yarışmalarını incele.',
      'Merak ettiğin bir konuda farklı kaynakları karşılaştırıp kısa bir rapor yaz.',
      'Kodlama ya da veri analizi üzerine ücretsiz bir çevrim içi kursa başla.',
      'Bir üniversitenin laboratuvarını ya da bir bilim merkezini ziyaret et.',
    ],
    paths: {
      lise: 'Fen liseleri ve Anadolu liselerinde sayısal ağırlıklı dersler.',
      universite: 'Matematik, fizik, kimya, biyoloji, moleküler biyoloji; tıp, diş hekimliği, eczacılık; bilgisayar mühendisliği, istatistik.',
    },
  },
  A: {
    key: 'A',
    scaleKey: 'artistic',
    name: 'Sanatçı',
    english: 'Artistic',
    plain: 'Kendini ifade etmekten, yaratıcı ve özgün işler ortaya koymaktan hoşlanmak.',
    student:
      'Kendini ifade etmek ve yeni bir şey yaratmak senin için önemli. Resim, müzik, yazı, tasarım ya da sahne gibi alanlar ve kuralları esnek, özgür çalışma ortamları sana çekici geliyor.',
    parent:
      'Çocuğunuz yaratıcı işlerden, kendini ifade etmekten ve özgün bir şey ortaya koymaktan hoşlandığını belirtiyor. Sanat, müzik, yazı ya da tasarım alanlarında deneme fırsatları onun için değerli olabilir.',
    likes: ['Çizmek, tasarlamak, yazmak', 'Müzik ve sahne sanatları', 'Özgün fikirler üretmek', 'Kuralları esnek, özgür çalışma'],
    explore: [
      'Okulun sanat, müzik, tiyatro ya da dergi kulübüne katıl.',
      'Bir kısa film, podcast ya da fotoğraf serisi hazırla.',
      'Beğendiğin bir tasarımı incele ve nasıl yapıldığını araştır.',
      'Bir sergiyi, konseri ya da atölyeyi ziyaret et.',
    ],
    paths: {
      lise: 'Güzel sanatlar liseleri (görsel sanatlar, müzik); Anadolu liselerinde sözel ve eşit ağırlıklı dersler.',
      universite: 'Güzel sanatlar fakülteleri, mimarlık, iç mimarlık, grafik ve endüstriyel tasarım, iletişim, konservatuvar, dil ve edebiyat bölümleri.',
    },
  },
  S: {
    key: 'S',
    scaleKey: 'social',
    name: 'Sosyal',
    english: 'Social',
    plain: 'İnsanlara yardım etmekten, öğretmekten ve onlarla birlikte çalışmaktan hoşlanmak.',
    student:
      'İnsanlarla birlikte olmak, onlara yardım etmek ve bir şeyler öğretmek sana iyi geliyor. Başkalarının sorununu dinlemek ve birlikte çözüm bulmak da ilgini çekiyor.',
    parent:
      'Çocuğunuz insanlara yardım etmekten, öğretmekten ve iş birliği yapmaktan hoşlandığını belirtiyor. Gönüllülük, akran yardımı ve grup çalışmaları onun için anlamlı deneyimler olabilir.',
    likes: ['Yardım etmek ve destek olmak', 'Öğretmek ve anlatmak', 'İnsanlarla birlikte çalışmak', 'Dinlemek ve anlamak'],
    explore: [
      'Okulda akran yardımı ya da küçük sınıflara okuma desteği gönüllüsü ol.',
      'Bir sosyal sorumluluk projesinde görev al.',
      'Bir öğretmenle, hemşireyle ya da psikolojik danışmanla işleri üzerine konuş.',
      'Bir yaz kampında ya da etkinlikte küçük çocuklara yardımcı ol.',
    ],
    paths: {
      lise: 'Sosyal bilimler liseleri; Anadolu liselerinde eşit ağırlık ya da sözel dersler; sağlık alanları için sayısal dersler.',
      universite: 'Eğitim fakülteleri (öğretmenlik bölümleri), rehberlik ve psikolojik danışmanlık, psikoloji, hemşirelik, fizyoterapi, sosyal hizmet, beslenme ve diyetetik.',
    },
  },
  E: {
    key: 'E',
    scaleKey: 'enterprising',
    name: 'Girişimci',
    english: 'Enterprising',
    plain: 'İkna etmekten, liderlik etmekten, organize etmekten ve risk almaktan hoşlanmak.',
    student:
      'Bir işi başlatmak, insanları bir hedef etrafında toplamak ve onları ikna etmek sana heyecan veriyor. Liderlik, organizasyon ve rekabet içeren durumlar sana çekici geliyor.',
    parent:
      'Çocuğunuz liderlik etmekten, organize etmekten ve insanları ikna etmekten hoşlandığını belirtiyor. Sorumluluk alabileceği projeler, öğrenci kulüpleri ve girişimcilik etkinlikleri ona uygun olabilir.',
    likes: ['Liderlik etmek ve yönetmek', 'İkna etmek ve müzakere etmek', 'Proje ve etkinlik organize etmek', 'Hedef koyup rekabet etmek'],
    explore: [
      'Bir okul etkinliğinin ya da kulübünün organizasyonunu üstlen.',
      'Münazara ya da Model Birleşmiş Milletler gibi etkinliklere katıl.',
      'Küçük bir girişim fikri geliştir: maliyet, fiyat ve müşteri hesabı yap.',
      'Bir işletme sahibiyle ya da yöneticiyle işini nasıl yürüttüğünü konuş.',
    ],
    paths: {
      lise: 'Anadolu liselerinde eşit ağırlıklı dersler; mesleki ve teknik liselerin muhasebe-finansman, pazarlama ve perakende, konaklama ve seyahat alanları.',
      universite: 'İşletme, hukuk, uluslararası ilişkiler, siyaset bilimi, halkla ilişkiler ve reklamcılık, turizm işletmeciliği, spor yöneticiliği.',
    },
  },
  C: {
    key: 'C',
    scaleKey: 'conventional',
    name: 'Düzenli',
    english: 'Conventional',
    plain: 'Düzenden, belirli kurallarla ilerleyen işlerden, verilerle ve ayrıntılarla çalışmaktan hoşlanmak.',
    student:
      'Her şeyin yerli yerinde olması, planlı ve düzenli çalışmak sana iyi geliyor. Verilerle, tablolarla, belgelerle ve ayrıntılarla uğraşmaktan ve bir işi doğru ve eksiksiz yapmaktan hoşlanıyorsun.',
    parent:
      'Çocuğunuz düzenli, planlı ve ayrıntıya dikkat gerektiren işlerden hoşlandığını belirtiyor. Verilerle, hesaplarla ve belgelerle çalışmak ona uygun gelebilir; bu özellik pek çok meslekte çok değerlidir.',
    likes: ['Düzenlemek ve sınıflandırmak', 'Verilerle ve hesaplarla çalışmak', 'Ayrıntılara dikkat etmek', 'Planlı ve kurallı işler'],
    explore: [
      'Bir okul etkinliğinin bütçesini ya da kayıtlarını tutmayı üstlen.',
      'Kendi harcamaların için bir tablo oluştur ve bir ay boyunca takip et.',
      'Bir hesap tablosu (Excel gibi) programını ileri düzeyde öğren.',
      'Bir muhasebeci, bankacı ya da lojistik uzmanıyla işi üzerine konuş.',
    ],
    paths: {
      lise: 'Anadolu liselerinde sayısal ya da eşit ağırlıklı dersler; mesleki ve teknik liselerin muhasebe-finansman, büro yönetimi ve lojistik alanları.',
      universite: 'Muhasebe ve finans, bankacılık, iktisat, aktüerya, istatistik, lojistik, bilgi ve belge yönetimi; meslek yüksekokullarının büro yönetimi ve muhasebe programları.',
    },
  },
};

export interface Occupation {
  name: string;
  /** Holland kodu, baskınlık sırasıyla (2–3 harf). */
  code: string;
  /** Türkiye’de tipik eğitim yolu. */
  education: 'Mesleki lise / ön lisans' | 'Ön lisans' | 'Lisans' | 'Lisans ve uzmanlık';
}

/** Örnek meslekler. Yol göstericidir; kodlar yaklaşıktır. */
export const OCCUPATIONS: Occupation[] = [
  // Gerçekçi ağırlıklı
  { name: 'Elektrik-elektronik teknisyeni', code: 'RIC', education: 'Mesleki lise / ön lisans' },
  { name: 'Otomotiv teknisyeni', code: 'RIC', education: 'Mesleki lise / ön lisans' },
  { name: 'İnşaat mühendisi', code: 'RIC', education: 'Lisans' },
  { name: 'Ziraat mühendisi', code: 'RIE', education: 'Lisans' },
  { name: 'Orman mühendisi', code: 'RIC', education: 'Lisans' },
  { name: 'Pilot', code: 'RCI', education: 'Lisans' },
  { name: 'Aşçı', code: 'RAE', education: 'Mesleki lise / ön lisans' },
  { name: 'İtfaiye eri', code: 'RSE', education: 'Ön lisans' },
  { name: 'Mobilya ve iç mekân ustası', code: 'RAC', education: 'Mesleki lise / ön lisans' },
  { name: 'Uçak bakım teknisyeni', code: 'RCI', education: 'Ön lisans' },
  // Araştırmacı ağırlıklı
  { name: 'Makine mühendisi', code: 'IRC', education: 'Lisans' },
  { name: 'Elektrik-elektronik mühendisi', code: 'IRC', education: 'Lisans' },
  { name: 'Yazılım geliştirici', code: 'ICR', education: 'Lisans' },
  { name: 'Veri bilimci', code: 'ICA', education: 'Lisans' },
  { name: 'Hekim', code: 'ISR', education: 'Lisans ve uzmanlık' },
  { name: 'Diş hekimi', code: 'IRS', education: 'Lisans' },
  { name: 'Eczacı', code: 'ICS', education: 'Lisans' },
  { name: 'Veteriner hekim', code: 'IRS', education: 'Lisans' },
  { name: 'Biyolog', code: 'IRA', education: 'Lisans' },
  { name: 'Kimyager', code: 'IRC', education: 'Lisans' },
  { name: 'Tıbbi laboratuvar teknikeri', code: 'IRC', education: 'Ön lisans' },
  { name: 'Diyetisyen', code: 'ISC', education: 'Lisans' },
  { name: 'Psikolog', code: 'ISA', education: 'Lisans ve uzmanlık' },
  // Sanatçı ağırlıklı
  { name: 'Mimar', code: 'AIR', education: 'Lisans' },
  { name: 'İç mimar', code: 'AER', education: 'Lisans' },
  { name: 'Grafik tasarımcı', code: 'AER', education: 'Lisans' },
  { name: 'Endüstriyel tasarımcı', code: 'AIR', education: 'Lisans' },
  { name: 'Moda tasarımcısı', code: 'AER', education: 'Lisans' },
  { name: 'Fotoğrafçı', code: 'ARE', education: 'Ön lisans' },
  { name: 'Müzisyen', code: 'AES', education: 'Lisans' },
  { name: 'Oyuncu', code: 'AES', education: 'Lisans' },
  { name: 'Yazar ya da editör', code: 'AEI', education: 'Lisans' },
  { name: 'Gazeteci', code: 'AES', education: 'Lisans' },
  { name: 'Çevirmen', code: 'ASC', education: 'Lisans' },
  // Sosyal ağırlıklı
  { name: 'Öğretmen', code: 'SAE', education: 'Lisans' },
  { name: 'Okul öncesi öğretmeni', code: 'SAC', education: 'Lisans' },
  { name: 'Psikolojik danışman', code: 'SAI', education: 'Lisans' },
  { name: 'Hemşire', code: 'SIC', education: 'Lisans' },
  { name: 'Ebe', code: 'SIR', education: 'Lisans' },
  { name: 'Fizyoterapist', code: 'SIR', education: 'Lisans' },
  { name: 'Ergoterapist', code: 'SIR', education: 'Lisans' },
  { name: 'Dil ve konuşma terapisti', code: 'SIA', education: 'Lisans' },
  { name: 'Sosyal hizmet uzmanı', code: 'SEI', education: 'Lisans' },
  { name: 'Çocuk gelişimcisi', code: 'SAI', education: 'Lisans' },
  { name: 'Spor antrenörü', code: 'SER', education: 'Lisans' },
  // Girişimci ağırlıklı
  { name: 'Avukat', code: 'EIS', education: 'Lisans ve uzmanlık' },
  { name: 'Girişimci / şirket kurucusu', code: 'ECA', education: 'Lisans' },
  { name: 'Satış ve pazarlama yöneticisi', code: 'ECA', education: 'Lisans' },
  { name: 'Halkla ilişkiler uzmanı', code: 'EAS', education: 'Lisans' },
  { name: 'Otel ve turizm işletmecisi', code: 'ESC', education: 'Lisans' },
  { name: 'İnsan kaynakları uzmanı', code: 'ESC', education: 'Lisans' },
  { name: 'Emlak danışmanı', code: 'ECS', education: 'Ön lisans' },
  { name: 'Diplomat', code: 'ESA', education: 'Lisans' },
  { name: 'Turist rehberi', code: 'ESA', education: 'Lisans' },
  // Düzenli ağırlıklı
  { name: 'Muhasebeci / mali müşavir', code: 'CEI', education: 'Lisans' },
  { name: 'Bankacı', code: 'CES', education: 'Lisans' },
  { name: 'Aktüer', code: 'CIE', education: 'Lisans' },
  { name: 'İstatistikçi', code: 'CIR', education: 'Lisans' },
  { name: 'Lojistik uzmanı', code: 'CER', education: 'Lisans' },
  { name: 'Denetçi', code: 'CEI', education: 'Lisans' },
  { name: 'Kütüphaneci ve arşivci', code: 'CSA', education: 'Lisans' },
  { name: 'Büro yöneticisi', code: 'CES', education: 'Ön lisans' },
  { name: 'Tıbbi sekreter', code: 'CSR', education: 'Ön lisans' },
];

/**
 * Öğrencinin koduna uyan örnek meslekler. Önce baskın alanla başlayan meslekler (en çok 5), sonra
 * ikinci alanla başlayıp baskın alanı da içerenler (en çok 3) seçilir; liste gerekirse üçüncü alanla
 * tamamlanır. Her grubun içinde, kodu öğrencinin diğer alanlarıyla daha çok örtüşenler öne alınır.
 */
export function occupationsFor(code: RiasecKey[], limit = 8): Occupation[] {
  const [first, second, third] = code;
  const overlap = (o: Occupation) =>
    code.reduce((acc, k, i) => {
      const pos = o.code.indexOf(k);
      return pos === -1 ? acc : acc + (3 - i) * (3 - pos);
    }, 0);
  const pick = (pred: (o: Occupation) => boolean, n: number, taken: Set<string>) =>
    OCCUPATIONS.filter((o) => !taken.has(o.name) && pred(o))
      .map((o, i) => ({ o, s: overlap(o), i }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .slice(0, n)
      .map((x) => x.o);

  const taken = new Set<string>();
  const out: Occupation[] = [];
  const add = (list: Occupation[]) => list.forEach((o) => { taken.add(o.name); out.push(o); });
  add(pick((o) => o.code[0] === first, 5, taken));
  if (second) add(pick((o) => o.code[0] === second && o.code.includes(first), 3, taken));
  if (out.length < limit && third)
    add(pick((o) => o.code[0] === third && (o.code.includes(first) || o.code.includes(second)), limit - out.length, taken));
  if (out.length < limit) add(pick((o) => o.code[0] === first, limit - out.length, taken));
  return out.slice(0, limit);
}
