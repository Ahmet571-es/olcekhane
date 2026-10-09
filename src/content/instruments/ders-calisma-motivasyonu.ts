import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Ders Çalışma Motivasyonu
 * Özgün ölçek (Ölçekhane, 2026). Maddeler öz-belirleme kuramının motivasyon türlerine göre sıfırdan yazılmıştır (Ryan ve
 * Deci, 2000): iç motivasyon (merak ve keyif), benimsenmiş düzenleme (önemini görme), içe atılmış düzenleme (iç baskı:
 * suçluluk, utanç, değerini başarıya bağlama), dış düzenleme (ödül, ceza, denetim, zorunluluk) ve motivasyonsuzluk
 * (isteksizlik). Nedenleri "…için çalışırım" biçiminde sorma yolu Ryan ve Connell'den (1989) gelir; o çalışmanın ve
 * Akademik Öz-Düzenleme Anketi'nin (SRQ-A; selfdeterminationtheory.org'a göre ticari kullanımı izne bağlıdır) maddeleri
 * kullanılmamıştır.
 *
 * Bileşik ölçekler: kendi isteğiyle çalışma (özerk motivasyon = iç motivasyon + önemini görme) ve baskıyla çalışma
 * (kontrollü motivasyon = iç baskı + dış baskı ve ödül). Rapor (profil: motivation) bu ikisinin birlikte gösterildiği bir
 * motivasyon haritasını Vansteenkiste ve arkadaşlarının (2009) dört profiline göre yorumlar.
 *
 * Maddelerin hepsi düz yönlüdür (bir nedenin ne kadar uyduğu sorulur; ters madde bu biçimde anlamlı değildir). Kendi
 * isteğiyle çalışma ile isteksizliğin ikisinin birden yüksek çıkması birbirine ters düştüğü için raporda uyarı olarak
 * gösterilir. Durum: pilot.
 */

const IN = 'intrinsic';
const ID = 'identified';
const IJ = 'introjected';
const EX = 'external';
const AM = 'amotivation';

/** Uygulama sırası: türler sırayla döner (merak ve keyif, dış baskı, önemini görme, isteksizlik, iç baskı). */
const RAW: { key: string; scale: string; text: string }[] = [
  { key: 'IN1', scale: IN, text: 'Bir konuyu öğrenirken iyi vakit geçirdiğim için ders çalışırım.' },
  { key: 'EX1', scale: EX, text: 'Çalışmazsam ailemden azar işiteceğim için çalışırım.' },
  { key: 'ID1', scale: ID, text: 'Öğrendiklerimin hayatta işime yarayacağını düşündüğüm için çalışırım.' },
  { key: 'AM1', scale: AM, text: 'Ders çalışmak bana anlamsız geliyor.' },
  { key: 'IJ1', scale: IJ, text: 'Çalışmadığım zaman kendimi suçlu hissettiğim için çalışırım.' },

  { key: 'IN2', scale: IN, text: 'Merak ettiğim bir şeyin cevabını bulmak bana keyif verdiği için çalışırım.' },
  { key: 'EX2', scale: EX, text: 'İyi not alınca ödül (harçlık, hediye ya da izin gibi) kazandığım için çalışırım.' },
  { key: 'ID2', scale: ID, text: 'Kendi seçtiğim bir hedefe (bir okul ya da meslek gibi) ulaşmak istediğim için çalışırım.' },
  { key: 'AM2', scale: AM, text: 'Derslerde öğrendiklerimin hayatta işime yaramayacağını düşünüyorum.' },
  { key: 'IJ2', scale: IJ, text: 'Kötü bir not alırsam utanacağım için çalışırım.' },

  { key: 'IN3', scale: IN, text: 'Zor bir konuyu sonunda anladığımda aldığım zevk için çalışırım.' },
  { key: 'EX3', scale: EX, text: 'Notlarım düşerse bazı şeyler (telefon, oyun ya da dışarı çıkmak gibi) yasaklanacağı için çalışırım.' },
  { key: 'ID3', scale: ID, text: 'Bilgili biri olmayı önemsediğim için çalışırım.' },
  { key: 'AM3', scale: AM, text: 'Çalışsam da çalışmasam da sonucun aynı olacağını düşünüyorum.' },
  { key: 'IJ3', scale: IJ, text: 'Notlarım kötü olursa kendimi yetersiz biri gibi hissedeceğim için çalışırım.' },

  { key: 'IN4', scale: IN, text: 'Derslerdeki konular ilgimi çektiği için çalışırım.' },
  { key: 'EX4', scale: EX, text: 'Öğretmenlerim çalışıp çalışmadığımı kontrol ettiği için çalışırım.' },
  { key: 'ID4', scale: ID, text: 'Derslerdeki konuları öğrenmenin beni geliştirdiğine inandığım için çalışırım.' },
  { key: 'AM4', scale: AM, text: 'Ne kadar uğraşsam da derslerde başarılı olamayacakmışım gibi geliyor.' },
  { key: 'IJ4', scale: IJ, text: 'Çevremdekilerin beni başarısız biri olarak görmesinden korktuğum için çalışırım.' },

  { key: 'IN5', scale: IN, text: 'Çalışırken konunun içine dalmaktan hoşlandığım için çalışırım.' },
  { key: 'EX5', scale: EX, text: 'Başka seçeneğim olmadığı, zorunda olduğum için çalışırım.' },
  { key: 'ID5', scale: ID, text: 'Ders çalışmayı kendim de önemli bulduğum için çalışırım.' },
  { key: 'AM5', scale: AM, text: 'Ders çalışmayı gereksiz buluyorum.' },
  { key: 'IJ5', scale: IJ, text: 'İçimden bir ses “çalışmalısın” dediği için çalışırım.' },
];

export const dersCalismaMotivasyonu: LikertInstrument = {
  slug: 'ders-calisma-motivasyonu',
  version: 1,
  engine: 'likert',
  profile: 'motivation',
  name: 'Ders Çalışma Motivasyonu',
  shortName: 'Ders çalışma motivasyonu',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 13,
  estimatedMinutes: 5,
  sortOrder: 35.5,
  tagline: 'Neden ders çalıştığını gösterir: merak ve istekle mi, baskıyla mı? Motivasyonun yalnızca miktarına değil, niteliğine de bakar.',
  description:
    'Bu test öğrencinin ders çalışma nedenlerini beş türde inceler: merak ve keyif, önemini görme, iç baskı (suçluluk, utanç), dış baskı ve ödül, isteksizlik. Bu nedenler iki büyük grupta toplanır: kendi isteğiyle çalışma ve baskıyla çalışma. Rapordaki motivasyon haritası ikisini birlikte gösterir ve araştırmalarda öğrencilerde bulunan dört motivasyon profiline göre yorumlanır. Maddeler öz-belirleme kuramına göre sıfırdan yazılmıştır.',
  intro: {
    title: 'Neden ders çalışıyorsun?',
    paragraphs: [
      'Birazdan ders çalışmayla ilgili 25 cümle göreceksin; çoğu bir ders çalışma nedenini anlatıyor. Her birinin sana ne kadar uyduğunu seç.',
      'Çoğu insanın birden çok nedeni vardır: bir cümleye “uyuyor” demen, ötekilere “uymuyor” demeni gerektirmez. Derslere göre farklı hissediyorsan çoğu zaman nasıl olduğunu düşün.',
      'Doğru ya da yanlış cevap yok. Olması gerekeni değil, gerçekte nasıl olduğunu seçersen rapor sana en çok işe yarar.',
    ],
  },
  prompt: 'Bu cümle sana ne kadar uyuyor?',
  options: [
    { value: 1, label: 'Hiç uymuyor' },
    { value: 2, label: 'Pek uymuyor' },
    { value: 3, label: 'Biraz uyuyor' },
    { value: 4, label: 'Çoğunlukla uyuyor' },
    { value: 5, label: 'Tamamen uyuyor' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.8 },
  // Bir ondalıklı ortalamaya göre: 1,0–2,4 düşük (nedenler çoğunlukla "uymuyor"), 2,5–3,4 orta ("biraz"), 3,5–5,0 yüksek
  // (çoğunlukla "uyuyor").
  anchoredBands: {
    basis: 'mean',
    thresholds: [
      { band: 'low', min: 1 },
      { band: 'average', min: 2.5 },
      { band: 'high', min: 3.5 },
    ],
  },
  scales: [
    {
      key: IN,
      name: 'Merak ve keyif',
      plain: 'Öğrenmenin kendisinden hoşlandığı için çalışma: merak, ilgi ve bir şeyi anlamanın verdiği zevk (iç motivasyon).',
      poles: { low: 'Konular pek ilgisini çekmiyor', high: 'Öğrenmekten keyif alıyor' },
    },
    {
      key: ID,
      name: 'Önemini görme',
      plain: 'Öğrenmenin kendisi için önemli olduğunu düşündüğü ve kendi hedefleriyle ilişkilendirdiği için çalışma.',
      poles: { low: 'Çalışmanın ne kazandıracağı net değil', high: 'Çalışmanın önemini kendisi görüyor' },
    },
    {
      key: IJ,
      name: 'İç baskı',
      plain: 'Suçluluk, utanç ya da kendi değerini başarıya bağlama gibi içten gelen bir baskıyla çalışma.',
      poles: { low: 'Kendine baskı yapmıyor', high: 'Kendine çok baskı yapıyor' },
    },
    {
      key: EX,
      name: 'Dış baskı ve ödül',
      plain: 'Ödül almak, ceza almamak, denetlendiği ya da zorunda olduğu için çalışma.',
      poles: { low: 'Ödül ya da ceza belirleyici değil', high: 'Ödül, ceza ya da denetim belirleyici' },
    },
    {
      key: AM,
      name: 'İsteksizlik',
      plain: 'Ders çalışmak için bir neden görememe ya da çalışmanın işe yaramayacağını düşünme.',
      poles: { low: 'Çalışmayı anlamsız bulmuyor', high: 'Çalışmanın anlamını göremiyor' },
    },
    {
      key: 'autonomous',
      name: 'Kendi isteğiyle çalışma',
      plain: 'Merak ve keyif ile önemini görme birlikte: çalışmanın nedeni kişinin kendisinden geliyor (özerk motivasyon).',
      of: [IN, ID],
    },
    {
      key: 'controlled',
      name: 'Baskıyla çalışma',
      plain: 'İç baskı ile dış baskı ve ödül birlikte: çalışmanın nedeni bir baskı ya da beklenti (kontrollü motivasyon).',
      of: [IJ, EX],
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). Maddeler öz-belirleme kuramının motivasyon türlerine göre sıfırdan yazılmıştır (Ryan ve Deci, 2000). Nedenleri “…için çalışırım” biçiminde sorma yolu Ryan ve Connell’in (1989) çalışmasından gelir; o çalışmanın ya da başka bir ölçeğin maddeleri kullanılmamıştır.',
    whatItMeasures:
      'Ders çalışma nedenlerini beş türde ölçer: merak ve keyif (iç motivasyon), önemini görme, iç baskı (suçluluk, utanç, değerini başarıya bağlama), dış baskı ve ödül, isteksizlik. İlk ikisi “kendi isteğiyle çalışma” (özerk motivasyon), ortadaki ikisi “baskıyla çalışma” (kontrollü motivasyon) olarak birleştirilir. Rapordaki motivasyon haritası bu ikisini birlikte gösterir ve araştırmalarda öğrencilerde bulunan dört profile göre yorumlanır (Vansteenkiste ve ark., 2009). Test motivasyonun yalnızca ne kadar olduğuna değil, nereden geldiğine de bakar: araştırmalarda başarı, vazgeçmeden sürdürme ve kendini iyi hissetmeyle en olumlu ilişkili olan, kendi isteğiyle çalışmadır (Howard ve ark., 2021).',
    turkishVersion:
      'Özgün Türkçe ölçek; bir çeviri değildir. Maddeler ortaokul ve lise öğrencilerinin gündelik diline göre yazılmıştır.',
    reliability:
      'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi. Kurama göre motivasyon türleri, kişinin kendisinden ne kadar geldiğine göre bir yelpaze üzerinde dizilir (Ryan ve Deci, 2000); isteksizlik dışındaki dört türde yan yana duranların birbiriyle daha çok ilişkili olduğu gösterilmiştir (Ryan ve Connell, 1989). Bu ölçekte bu düzenin görülüp görülmediği henüz sınanmadı.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok. Puanlar, her nedenin öğrenciye ne kadar uyduğuna göre (1: hiç uymuyor, 5: tamamen uyuyor) yorumlanır; öğrenci başka öğrencilerle karşılaştırılmaz.',
    ageNote:
      '5. sınıftan itibaren ve mezunlar için. Maddeler okulda ders çalışma deneyimine göre yazıldığı için yetişkinlere açık değildir.',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Öğrencinin kendi bildirimine dayanır; o günkü ruh hâli ve yakın zamandaki bir sınav deneyimi cevapları etkileyebilir.',
      'Genel ders çalışma nedenlerini sorar; motivasyon derse göre değişebilir.',
      'Motivasyon kalıcı bir özellik değildir: ortama, desteğe ve zamana göre değişir; örneğin öğretmenin özerkliği desteklemesi ve öğrencinin kendini yeterli hissetmesi, kendi isteğiyle çalışmayla güçlü biçimde ilişkilidir (Bureau ve ark., 2022). Sonuç bugünü gösterir.',
      'Araştırmalardaki dört profil, öğrencilerin birbirine göre puanlarıyla bulunmuştur; bu testte ise cevap seçeneklerine göre konmuş sabit sınırlar (2,5 ve 3,5) kullanılır. Bu yüzden profil adları yaklaşık bir eşleştirmedir ve sınıra yakın puanlarda kesin değildir.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Ryan, R. M. ve Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist, 55(1), 68–78.',
        url: 'https://doi.org/10.1037/0003-066X.55.1.68',
      },
      {
        text: 'Ryan, R. M. ve Connell, J. P. (1989). Perceived locus of causality and internalization: Examining reasons for acting in two domains. Journal of Personality and Social Psychology, 57(5), 749–761.',
        url: 'https://doi.org/10.1037/0022-3514.57.5.749',
      },
      {
        text: 'Vansteenkiste, M., Sierens, E., Soenens, B., Luyckx, K. ve Lens, W. (2009). Motivational profiles from a self-determination perspective: The quality of motivation matters. Journal of Educational Psychology, 101(3), 671–688.',
        url: 'https://doi.org/10.1037/a0015083',
      },
      {
        text: 'Howard, J. L., Bureau, J., Guay, F., Chong, J. X. Y. ve Ryan, R. M. (2021). Student motivation and associated outcomes: A meta-analysis from self-determination theory. Perspectives on Psychological Science, 16(6), 1300–1323.',
        url: 'https://doi.org/10.1177/1745691620966789',
      },
      {
        text: 'Bureau, J. S., Howard, J. L., Chong, J. X. Y. ve Guay, F. (2022). Pathways to student motivation: A meta-analysis of antecedents of autonomous and controlled motivations. Review of Educational Research, 92(1), 46–72.',
        url: 'https://doi.org/10.3102/00346543211042426',
      },
    ],
  },
};
