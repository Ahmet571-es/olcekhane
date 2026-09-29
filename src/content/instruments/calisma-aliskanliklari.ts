import type { LikertInstrument, LikertItemDef } from '@/lib/instruments/types';

/**
 * Çalışma Alışkanlıkları Envanteri
 * Özgün ölçek (Ölçekhane, 2026). Maddeler, öğrenme yöntemleri üzerine yapılan araştırmalarda etkili
 * bulunan davranışlara göre yazılmıştır: kendini sınama ve aralıklı tekrar (Dunlosky ve ark., 2013),
 * anlamaya yönelik çalışma, planlama, dikkat dağıtıcıları yönetme, hatalardan öğrenme ve yardım isteme.
 * Her ölçekte ters yönlü maddeler vardır. Durum: pilot.
 */

const P = 'planning';
const T = 'retrieval';
const U = 'understanding';
const F = 'focus';
const H = 'help';

const RAW: { key: string; scale: string; text: string; reverse?: boolean }[] = [
  { key: 'P1', scale: P, text: 'Ders çalışmaya başlamadan önce o gün neyi çalışacağımı belirlerim.' },
  { key: 'T1', scale: T, text: 'Bir konuyu çalıştıktan sonra kitaba bakmadan neler hatırladığımı kontrol ederim.' },
  { key: 'U1', scale: U, text: 'Yeni öğrendiğim bir bilgiyi daha önce bildiklerimle ilişkilendirmeye çalışırım.' },
  { key: 'F1', scale: F, text: 'Ders çalışırken telefonumu başka bir odaya koyar ya da sessize alırım.' },
  { key: 'H1', scale: H, text: 'Anlamadığım bir konuyu öğretmenime sorarım.' },

  { key: 'P2', scale: P, text: 'Haftalık bir çalışma planım vardır ve ona uymaya çalışırım.' },
  { key: 'T2', scale: T, text: 'Öğrendiğim konuları birkaç gün sonra yeniden tekrar ederim.' },
  { key: 'U2', scale: U, text: 'Bir konuyu çalışırken “Bu neden böyle?” diye kendime sorarım.' },
  { key: 'F2', scale: F, text: 'Ders çalışırken sık sık sosyal medyaya ya da mesajlarıma bakarım.', reverse: true },
  { key: 'H2', scale: H, text: 'Sınavda ya da ödevde yaptığım yanlışları inceleyip neden yanlış yaptığımı anlamaya çalışırım.' },

  { key: 'P3', scale: P, text: 'Sınavlara son güne bırakmadan, günler öncesinden hazırlanmaya başlarım.' },
  { key: 'T3', scale: T, text: 'Bir konuyu tekrar etmek için genellikle yalnızca notlarımı yeniden okurum.', reverse: true },
  { key: 'U3', scale: U, text: 'Öğrendiğim bir konuyu kendi cümlelerimle anlatmaya çalışırım.' },
  { key: 'F3', scale: F, text: 'Ders çalışmak için dikkatimi dağıtan şeylerin olmadığı bir yer seçerim.' },
  { key: 'H3', scale: H, text: 'Anlamadığım bir şey olduğunda kimseye sormadan geçerim.', reverse: true },

  { key: 'P4', scale: P, text: 'Ödevlerimi çoğu zaman son dakikaya bırakırım.', reverse: true },
  { key: 'T4', scale: T, text: 'Soru çözerek ya da soru kartlarıyla kendimi sınarım.' },
  { key: 'U4', scale: U, text: 'Konuları anlamadan ezberlemeye çalışırım.', reverse: true },
  { key: 'F4', scale: F, text: 'Uzun süre çalışacaksam arada kısa molalar veririm.' },
  { key: 'H4', scale: H, text: 'Bir konuyu anlamak için farklı kaynaklara (kitap, video, soru bankası) başvururum.' },

  { key: 'P5', scale: P, text: 'Büyük bir ödevi küçük parçalara bölüp her birine bir zaman ayırırım.' },
  { key: 'T5', scale: T, text: 'Sınavdan önce kendime sınavda çıkabilecek sorular sorarım.' },
  { key: 'U5', scale: U, text: 'Anlamadığım bir yeri atlamak yerine anlayana kadar üzerinde dururum.' },
  { key: 'F5', scale: F, text: 'Ders çalışırken aklım başka şeylere kayar ve bunu uzun süre fark etmem.', reverse: true },
  { key: 'H5', scale: H, text: 'Takıldığımda arkadaşlarımdan ya da ailemden yardım isterim.' },
];

export const calismaAliskanliklari: LikertInstrument = {
  slug: 'calisma-aliskanliklari',
  version: 1,
  engine: 'likert',
  name: 'Çalışma Alışkanlıkları Envanteri',
  shortName: 'Çalışma alışkanlıkları',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 6,
  maxGrade: 13,
  estimatedMinutes: 5,
  sortOrder: 35,
  tagline: 'Öğrencinin araştırmalarla etkisi gösterilmiş çalışma yöntemlerini ne sıklıkla kullandığını ölçer.',
  description:
    'Bu envanter öğrencinin nasıl ders çalıştığını beş alanda inceler: planlama, kendini sınama ve tekrar, anlayarak çalışma, odaklanma ve hatalardan öğrenip yardım isteme. Maddeler, öğrenme araştırmalarında etkili bulunan yöntemlere göre yazılmıştır. Rapor, hangi alışkanlıkların güçlü olduğunu ve hangilerinin geliştirilebileceğini gösterir.',
  intro: {
    title: 'Nasıl ders çalışıyorsun?',
    paragraphs: [
      'Birazdan ders çalışma alışkanlıklarınla ilgili 25 cümle göreceksin. Her birini ne sıklıkla yaptığını seç.',
      'Nasıl çalışman gerektiğini değil, gerçekte nasıl çalıştığını düşün. Doğru ya da yanlış cevap yok; dürüst cevaplar sana en çok işe yarayacak raporu verir.',
    ],
  },
  prompt: 'Bunu ne sıklıkla yaparsın?',
  options: [
    { value: 1, label: 'Hiçbir zaman' },
    { value: 2, label: 'Nadiren' },
    { value: 3, label: 'Bazen' },
    { value: 4, label: 'Sık sık' },
    { value: 5, label: 'Her zaman' },
  ],
  scoring: { method: 'mean', minAnsweredRatio: 0.8 },
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
      key: P,
      name: 'Planlama',
      plain: 'Çalışmayı önceden planlama ve işleri son güne bırakmama.',
      poles: { low: 'Plansız, son dakikaya bırakan', high: 'Planlı, önceden başlayan' },
    },
    {
      key: T,
      name: 'Kendini sınama ve tekrar',
      plain: 'Öğrenilenleri kitaba bakmadan hatırlamaya çalışma ve tekrarı günlere yayma.',
      poles: { low: 'Yeniden okumaya dayanan', high: 'Kendini sınayan, aralıklı tekrar yapan' },
    },
    {
      key: U,
      name: 'Anlayarak çalışma',
      plain: 'Ezberlemek yerine konuyu anlamaya, açıklamaya ve bildiklerle ilişkilendirmeye çalışma.',
      poles: { low: 'Ezbere dayanan', high: 'Anlamaya ve ilişki kurmaya çalışan' },
    },
    {
      key: F,
      name: 'Odaklanma',
      plain: 'Dikkat dağıtıcıları uzak tutma ve çalışırken dikkati toplayabilme.',
      poles: { low: 'Dikkati kolay dağılan', high: 'Dikkat dağıtıcıları yöneten' },
    },
    {
      key: H,
      name: 'Hatalardan öğrenme ve yardım isteme',
      plain: 'Yanlışları inceleme, takılınca soru sorma ve farklı kaynaklara başvurma.',
      poles: { low: 'Takıldığında geçen', high: 'Soran, araştıran, hatasından öğrenen' },
    },
  ],
  items: RAW as LikertItemDef[],
  science: {
    basedOn:
      'Özgün ölçek (Ölçekhane, 2026). Maddeler, öğrenme yöntemlerini karşılaştıran araştırmaların (Dunlosky ve ark., 2013) etkili bulduğu çalışma davranışlarına göre yazılmıştır.',
    whatItMeasures:
      'Öğrencinin beş alandaki çalışma alışkanlıklarını ne sıklıkla kullandığını ölçer: planlama, kendini sınama ve aralıklı tekrar, anlayarak çalışma, odaklanma, hatalardan öğrenme ve yardım isteme. Kişilik değil davranış ölçer; bu yüzden sonuçlar doğrudan geliştirilebilir.',
    turkishVersion: 'Özgün Türkçe ölçek; bir çeviri değildir. Her alanda, onaylama eğilimini dengelemek için ters yönlü maddeler vardır.',
    reliability:
      'Pilot aşamasındadır: iç tutarlılık ve yapı geçerliği henüz incelenmedi; sonuçlar hazır olduğunda burada yayımlanacak.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok. Puanlar, her alışkanlığın ne sıklıkla kullanıldığına göre (1: hiçbir zaman, 5: her zaman) yorumlanır.',
    ageNote: '6. sınıftan itibaren uygulanır. Maddeler ortaokul ve lise öğrencilerinin ders çalışma deneyimlerine göre yazılmıştır.',
    license: 'Özgün ölçek. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Öğrencinin kendi bildirimine dayanır; insanlar alışkanlıklarını olduğundan biraz farklı değerlendirebilir.',
      'Pilot aşamasındadır: güvenirlik ve geçerlik çalışması henüz yapılmadı.',
      'Okul başarısını tek başına açıklamaz; ön bilgi, motivasyon ve öğrenme ortamı da önemlidir.',
    ],
    citations: [
      {
        text: 'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J. ve Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.',
        url: 'https://doi.org/10.1177/1529100612453266',
      },
      {
        text: 'Roediger, H. L. ve Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.',
        url: 'https://doi.org/10.1111/j.1467-9280.2006.01693.x',
      },
      {
        text: 'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T. ve Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.',
        url: 'https://doi.org/10.1037/0033-2909.132.3.354',
      },
    ],
  },
};
