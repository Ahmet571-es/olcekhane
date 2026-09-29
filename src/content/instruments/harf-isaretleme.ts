import type { CancellationTask, TaskInstrument } from '@/lib/instruments/types';

/**
 * Sürekli Dikkat: Harf İşaretleme
 *
 * Bourdon'un (1895) harf işaretleme (iptal) düzenine dayanan özgün bir görevdir; Türkiye'de "Burdon
 * dikkat testi" adıyla bilinen kâğıt-kalem uygulamaları da bu düzeni kullanır. Harf sayfaları her
 * uygulamada uygulama kimliğinden yeniden üretilir (src/lib/instruments/cancellation.ts): öğrenci sayfayı
 * ezberleyemez, sunucu aynı sayfayı üretip puanlar. d2 gibi ticari testlerin sayfaları, işaretleri,
 * puanlama kuralları ya da normları kullanılmaz.
 *
 * Her bölümde 60 satır × 10 harf vardır; satırların üçte birinde 1, üçte birinde 2, üçte birinde 3
 * aranan harf bulunur (bölüm başına 120 hedef, harflerin %20'si). Sayfa, en hızlı öğrencinin bile süre
 * bitmeden bitiremeyeceği kadar uzundur. Üretim kuralı değişirse `generator` ve testin sürümü artırılmalı.
 */

const harf: CancellationTask = {
  key: 'harf',
  kind: 'cancellation',
  name: 'Harf İşaretleme',
  measures: 'Sürekli dikkat: uzun süre aynı işe odaklanıp hem hızlı hem dikkatli çalışabilme.',
  instructions: [
    'Ekranda satır satır dizilmiş harfler göreceksin. Aradığın harfler: a, b, d ve g.',
    'Bu harflerin her birine dokunarak ya da tıklayarak işaretle. Yanlış bir harfi işaretlersen üzerine yeniden dokun; işaret kalkar.',
    'Kitap okur gibi soldan sağa, satır satır ilerle ve satır atlama. Sayfa aşağı doğru devam eder.',
    'Görev 90 saniyelik 4 bölümden oluşur. Her bölümde yeni bir sayfa gelir; yine ilk satırdan başla. Hem hızlı hem dikkatli olmaya çalış.',
  ],
  targets: ['a', 'b', 'd', 'g'],
  // Türk alfabesinin geri kalan harfleri; g'den yalnızca bir işaretle ayrılan ğ bilerek kullanılmaz.
  distractors: ['c', 'ç', 'e', 'f', 'h', 'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z'],
  columns: 10,
  rows: 60,
  targetsPerRow: [1, 2, 3],
  sections: 4,
  sectionMs: 90_000,
  practice: [
    ['p', 'a', 'e', 'n', 'd', 'o', 'c', 'b', 'u', 's'],
    ['g', 'r', 'o', 'd', 'k', 'p', 'a', 'ü', 'e', 'b'],
  ],
  generator: 1,
};

export const harfIsaretleme: TaskInstrument = {
  slug: 'surekli-dikkat',
  version: 1,
  engine: 'tasks',
  name: 'Sürekli Dikkat: Harf İşaretleme',
  shortName: 'Harf işaretleme',
  domain: 'cognitive',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 3,
  maxGrade: 13,
  estimatedMinutes: 9,
  sortOrder: 55,
  tagline: 'Harf sayfalarında aranan harfleri bularak dikkati uzun süre sürdürebilmeyi, çalışma hızını ve dikkatli çalışmayı ölçer.',
  description:
    'Bu görev, dikkat araştırmalarında 19. yüzyıldan beri kullanılan harf işaretleme düzenine dayanır; Türkiye’de “Burdon dikkat testi” adıyla bilinen uygulamalar da bu türdendir. Öğrenci, satır satır dizilmiş harfler arasında a, b, d ve g harflerini bulup işaretler. Görev 90 saniyelik dört bölümden oluşur ve yaklaşık 9 dakika sürer. Harf sayfaları her uygulamada bilgisayar tarafından yeniden üretilir; bu yüzden ezberlenemez. Rapor; çalışma hızını, bulunan ve atlanan harfleri, yanlış işaretlemeleri ve bölümler ilerledikçe dikkatin nasıl değiştiğini sade bir dille anlatır. Tanı koymaz.',
  intro: {
    title: 'Harfleri bul, işaretle',
    paragraphs: [
      'Birazdan ekranda satır satır dizilmiş harfler göreceksin. Görevin, aradığın harfleri bulup her birine dokunarak işaretlemek.',
      'Görev 90 saniyelik dört bölümden oluşur; bölümler arasında birkaç saniyelik geçiş olur. Başlamadan önce kısa bir alıştırma yapacaksın.',
      'Sessiz bir yerde, dikkatini dağıtacak şeyler olmadan yaparsan sonuç seni daha iyi yansıtır.',
    ],
  },
  scales: [
    { key: 'tempo', name: 'Çalışma hızı', plain: 'Dakikada taranan harf sayısı: işi ne kadar hızlı yürütebildiği.' },
    { key: 'isabet', name: 'Hedefleri bulma', plain: 'Taranan satırlardaki aranan harflerden kaçının bulunduğu: ne kadar dikkatli çalışıldığı.' },
    { key: 'net', name: 'Net doğru', plain: 'Doğru işaretlerden yanlış işaretler çıkarılınca kalan sayı: hızla dikkatin birlikte ölçüsü.' },
    { key: 'surdurme', name: 'Dikkati sürdürme', plain: 'Görev ilerledikçe performansın korunup korunmadığı: son bölümlerin ilk bölümlere göre değişimi.' },
  ],
  tasks: [harf],
  science: {
    basedOn:
      'Bourdon’un (1895) harf işaretleme (iptal) görevi. Türkiye’de “Burdon dikkat testi” adıyla bilinen kâğıt-kalem uygulamaları da bu düzeni kullanır. Harf sayfaları, puanlama ve rapor Ölçekhane tarafından özgün olarak hazırlanmıştır; d2 gibi ticari testlerin sayfaları, işaretleri ya da normları kullanılmaz.',
    whatItMeasures:
      'Sürekli ve seçici dikkati ölçer: aranan harfleri benzer harfler arasından ayırt edebilmeyi (seçici dikkat), bunu birkaç dakika boyunca aynı hız ve özenle sürdürebilmeyi (sürekli dikkat) ve çalışma hızını. Bu beceriler, uzun bir metni dikkatle okumak, sınavda soruları gözden kaçırmadan çözmek ya da yazılan bir metindeki hataları fark etmek gibi okul işlerinde kullanılır.',
    turkishVersion:
      'Özgün görev. Harfler Türk alfabesinden seçilmiştir; aranan g harfinden yalnızca bir işaretle ayrılan ğ sayfalarda kullanılmaz. Yönergeler Türkçedir.',
    reliability:
      'Pilot aşamasındadır; bu görevin güvenirlik çalışması henüz yapılmadı. Her bölüm ayrı süreyle uygulandığı için güvenirlik bölümler arası tutarlılıkla hesaplanabilir. Benzer bir dijital harf işaretleme görevinde üniversite öğrencileriyle paralel form güvenirliği r = .71–.83, iç tutarlılık α = .73–.91, d2 dikkat testiyle ilişki r = .43–.59 bulunmuştur (Pahor ve ark., 2022). Bu değerler çocuklar ve bu görev için doğrudan geçerli değildir.',
    normStatus: 'none',
    normNote:
      'Türkiye normu henüz yok; sonuçlar akranlarla karşılaştırılmadan, görevde yapılanlarla anlatılır. Sürekli dikkat çocukluk boyunca yaşla birlikte belirgin biçimde gelişir (Betts ve ark., 2006); bu yüzden bir norm, sınıf düzeylerine göre ayrı ayrı oluşturulmalıdır. Puanlar, kâğıt-kalem Burdon uygulamalarının puanları ve normlarıyla karşılaştırılamaz: sayfa, süre ve işaretleme biçimi farklıdır.',
    ageNote:
      '3. sınıftan itibaren uygulanır. Tablet ya da bilgisayarla yapılması önerilir; telefonda harfler küçük kalır. Aynı öğrencinin sonuçları karşılaştırılacaksa aynı tür cihaz kullanılmalıdır.',
    license: 'Özgün görev. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Dikkat eksikliği ve hiperaktivite bozukluğu (DEHB) gibi durumlar için tanı koymaz; tanı yalnızca uzman değerlendirmesiyle konur.',
      'Sonuç; yorgunluk, uykusuzluk, ortamdaki gürültü, isteklilik ve cihaz (ekran boyutu, dokunmatik ekran ya da fare) gibi etkenlerden etkilenir.',
      'Harfleri tanımakta ya da b, d ve p gibi harfleri ayırt etmekte zorlanan öğrencilerde sonuç, dikkatten çok harf tanımayı yansıtabilir.',
      'Görev yeniden yapıldığında alıştırma etkisiyle puanlar bir miktar yükselir; iki uygulama arasındaki küçük farklar yorumlanmamalıdır.',
      'Pilot aşamasındadır: güvenirlik ve norm çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Bourdon, B. (1895). Observations comparatives sur la reconnaissance, la discrimination et l’association. Revue Philosophique de la France et de l’Étranger.',
      },
      {
        text: 'Betts, J., McKay, J., Maruff, P. ve Anderson, V. (2006). The development of sustained attention in children: The effect of age and task load. Child Neuropsychology, 12(3), 205–221.',
        url: 'https://doi.org/10.1080/09297040500488522',
      },
      {
        text: 'Pahor, A., Mester, R. E., Carrillo, A. A., Ghil, E., Reimer, J. F., Jaeggi, S. M. ve Seitz, A. R. (2022). UCancellation: A new mobile measure of selective attention and concentration. Behavior Research Methods, 54(5), 2602–2617.',
        url: 'https://doi.org/10.3758/s13428-021-01765-5',
      },
      {
        text: 'Uttl, B. ve Pilkenton-Taylor, C. (2001). Letter cancellation performance across the adult life span. The Clinical Neuropsychologist, 15(4), 521–530.',
        url: 'https://doi.org/10.1076/clin.15.4.521.1881',
      },
    ],
  },
};
