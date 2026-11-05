import type { OralReadingInstrument } from '@/lib/instruments/types';
import { passages as sinif12 } from './sinif-1-2';
import { passages as sinif34 } from './sinif-3-4';
import { passages as sinif56 } from './sinif-5-6';
import { passages as sinif78 } from './sinif-7-8';

const ERDEN = 'Erden, Kurdoğlu ve Uslu, 2002';

/**
 * Sesli Okuma Değerlendirmesi
 * Özgün değerlendirme: metinler, sorular, yeniden anlatma fikirleri ve akıcılık derecelendirmesi Ölçekhane tarafından
 * yazılmıştır. Öğrenci sınıfına uygun bir metni sesli okur (ses yalnızca cihazda kayda alınır), metni kendi
 * cümleleriyle anlatır ve metne bakmadan soruları cevaplar. Her sınıfa üç metin vardır; sayı artırılabilir.
 *
 * Varsayılan (herkese açık) sürüm otomatik analizdir (site sahibinin 2026-11-05 kararı; lib/oral/auto.ts): öğrenci tek
 * başına okur ve soruları cevaplar; kaydı öğrencinin cihazında çalışan bir konuşma tanıma modeli inceler, yetişkin
 * dinlemez. Bu sürümde akıcılık derecelendirmesi ve yeniden anlatma yoktur. Yetişkinin kaydı dinleyip hataları
 * işaretlediği, anlatmayı ve akıcılığı değerlendirdiği sürüm yalnızca ayrı bir adresle (`?surum=yetiskinli`) açılır:
 * yapay zekâyı çalıştıramayan cihazlar için yedek yol. Bilim kartındaki metinler iki sürümü de doğru anlatır.
 */
export const sesliOkuma: OralReadingInstrument = {
  slug: 'sesli-okuma-degerlendirmesi',
  version: 1,
  engine: 'oral',
  name: 'Sesli Okuma Değerlendirmesi',
  shortName: 'Sesli okuma',
  domain: 'reading',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 1,
  maxGrade: 8,
  estimatedMinutes: 20,
  sortOrder: 39,
  tagline:
    'Öğrenci sınıfına uygun bir metni sesli okur; cihazdaki yapay zekâ okumayı kelime kelime inceler, hatalı okunan yerleri ekranda gösterir ve hata raporu hazırlar. Kaydı kimse dinlemez.',
  description:
    'Okuma becerisini en iyi gösteren yollardan biri, çocuğun bir metni sesli okumasıdır. Bu değerlendirmede öğrenci sınıf düzeyine göre yazılmış bir metni tek başına sesli okur; okuma yalnızca cihazda kayda alınır ve kaydı hiçbir yetişkin dinlemez. Öğrenci isterse okumayı, cihazında çalışan bir yapay zekâ modeli inceler: Okunan kelimeler metinle tek tek karşılaştırılır, hız ve duraklamalar ölçülür; öğrenci bu sırada metne bakmadan soruları cevaplar ve inceleme bitince ses kaydı silinir. Raporda metin kelime kelime, hatalı okunan yerler işaretli olarak gösterilir; dakikada doğru okunan kelime sayısı, doğru okuma oranı, hata türleri, yanlış okunan kelimeler, duraklamalar ve okuduğunu anlama sade bir dille anlatılır ve metnin öğrenci için rahat mı, destekle mi okunabilir yoksa şimdilik zor mu olduğu gösterilir. Yapay zekânın net anlayamadığı kelimeler hata sayılmaz.',
  intro: {
    title: 'Sesli Okuma Değerlendirmesi',
    paragraphs: [
      'Bu değerlendirmeyi öğrenci ve bir yetişkin (öğretmen ya da veli) birlikte yapar. Önce öğrenci metni sesli okur, anlatır ve soruları cevaplar; sonra yetişkin kaydı dinleyerek değerlendirir.',
      'Değerlendirmeyi tek seferde bitirin: Sayfayı kapatır ya da yenilerseniz kayıtlar ve işaretler silinir ve baştan başlamanız gerekir.',
    ],
  },
  scales: [
    { key: 'accuracy', name: 'Doğru okuma', plain: 'Metindeki kelimelerin ne kadarının doğru okunduğu (kelime tanıma).' },
    { key: 'rate', name: 'Okuma hızı', plain: 'Bir dakikada doğru okunan kelime sayısı.' },
    { key: 'prosody', name: 'Akıcılık', plain: 'Vurgu ve tonlama, anlamlı kelime gruplarıyla okuma, düzgünlük ve tempo.' },
    { key: 'comprehension', name: 'Okuduğunu anlama', plain: 'Metindeki bilgiyi hatırlama, çıkarım yapma, kelime anlamı ve ana fikir.' },
    { key: 'retell', name: 'Yeniden anlatma', plain: 'Metni kendi cümleleriyle anlatırken önemli fikirlerin ne kadarının söylendiği.' },
  ],
  referenceRates: [
    // Erden, Kurdoğlu ve Uslu (2002), Tablo 3: 1 dakikada doğru okunan kelime, ortalama ve standart sapma (Ankara,
    // N = 2481). 3. sınıfın standart sapması kaynakta 2. sınıfınkiyle aynı (31,16) yazılmıştır.
    { grade: 1, wpm: 45, sd: 27, source: ERDEN },
    { grade: 2, wpm: 73, sd: 31, source: ERDEN },
    { grade: 3, wpm: 91, sd: 31, source: ERDEN },
    { grade: 4, wpm: 97, sd: 46, source: ERDEN },
    { grade: 5, wpm: 121, sd: 53, source: ERDEN },
  ],
  passages: [...sinif12, ...sinif34, ...sinif56, ...sinif78],
  science: {
    basedOn:
      'Özgün değerlendirme: sınıf düzeyine göre yazılmış metinlerin sesli okunması, okuma hatalarının kelime kelime işaretlenmesi ve anlama soruları (Ölçekhane, 2026). Olağan sürümde okuma hatalarını, öğrencinin cihazında çalışan bir yapay zekâ modeli (konuşma tanıma) işaretler; yetişkinin kaydı dinleyerek işaretlediği, yeniden anlatma ve akıcılık derecelendirmesi de içeren sürüm yalnızca ayrı bir bağlantıyla açılır. Akıcı okumanın üç yönü (doğruluk, hız, vurgu ve tonlama) Ulusal Okuma Paneli’nin (2000) tanımına dayanır.',
    whatItMeasures:
      'Doğru okuma (doğru okunan kelime oranı; hata türleri: yanlış okuma, atlama, ekleme), okuma hızı (dakikada doğru okunan kelime), okumanın ritmi (kayıttan ölçülen duraklamalar) ve okuduğunu anlama (bilgi, çıkarım, kelime anlamı ve ana fikir soruları). Yetişkinin dinlediği sürümde ayrıca akıcılık (vurgu ve tonlama, öbekleme, düzgünlük, tempo) derecelendirilir ve yeniden anlatma değerlendirilir.',
    turkishVersion: 'Metinler, sorular ve derecelendirmeler doğrudan Türkçe yazılmıştır; çeviri değildir.',
    reliability:
      'Değerlendirme pilot aşamadadır. Metinlerin sınıf düzeyine uygunluğu, soruların madde analizi ve otomatik analizin işaretlerinin bir öğretmenin işaretlemesiyle ne kadar uyuştuğu (gerçek öğrenci kayıtlarıyla) henüz incelenmedi; yapay zekânın doğruluğu şimdiye kadar yapay ses ve yetişkin kayıtlarıyla ölçüldü.',
    normStatus: 'none',
    normNote:
      'Bu değerlendirmenin kendi Türkiye normu yoktur; doğru okuma, anlama ve akıcılık sonuçları akranlarla karşılaştırılmaz. Metnin düzeyi, raporda bir tabloyla gösterilen pilot ölçütlere göre belirlenir: doğru okuma ve anlamadan düşük olanı metnin düzeyidir. Doğru okuma ve anlama rahat olsa bile okuma belirgin biçimde yavaşsa ya da akıcılık puanı düşükse düzey “Doğru okuyor, akıcılığı gelişiyor” olarak verilir. 1–5. sınıflarda okuma hızı, Ankara’da 2002’de yayımlanan bir çalışmanın ortalamasıyla yalnızca kaba bir fikir vermek için karşılaştırılır.',
    ageNote:
      '1–8. sınıflar için. Her sınıfa üç metin vardır; öğrenci kendi sınıfının ya da bir alt ve bir üst sınıfın metnini okuyabilir. 1. sınıf metinleri ikinci dönem için yazılmıştır. Öğrenci tek başına okur ve kaydını bir yetişkin dinlemez; küçük sınıflarda bir büyüğün düğmelere basmaya yardım etmesi (okurken kelime söylememesi) önerilir.',
    license: 'Özgün içerik: metinler, sorular ve derecelendirmeler Ölçekhane’ye aittir.',
    limitations: [
      'Okumayı, öğrencinin cihazında (tarayıcıda) çalışan bir yapay zekâ modeli inceler; ses cihazdan çıkmaz ve analiz bitince silinir. Model, özellikle çocuk seslerinde ve gürültülü ortamlarda bazı kelimeleri yanlış duyabilir; doğru okunmuş bir kelimeyi hata sayabilir ya da bir hatayı fark etmeyebilir. Net ayırt edemediği kelimeler hata sayılmaz; bu yüzden doğru okuma oranı olduğundan yüksek çıkabilir. Sonuçlar yaklaşıktır; gerçek öğrenci kayıtlarıyla doğruluk ölçümü henüz yapılmadı.',
      'Tek bir metne dayanır; konuya ilgi, metnin türü ve o günkü yorgunluk sonucu etkileyebilir. Gelişimi izlemek için farklı metinlerle tekrarlanmalıdır.',
      'Yetişkinin dinleyip işaretlediği sürümde (yalnızca ayrı bağlantıyla) iki dinleyici aynı okumayı biraz farklı işaretleyebilir; kaydı gerektiğinde yavaşlatıp yeniden dinlemek bu farkı azaltır. O sürümde uygulama konuşmayı tanımaz; ses kaydından yalnızca süre ve duraklamalar ölçülür.',
      'Okuma güçlüğü (disleksi) gibi bir durumu teşhis etmez. Kalıcı zorluk görülürse okulun rehberlik servisiyle görüşülmelidir.',
    ],
    citations: [
      {
        text: 'National Reading Panel (2000). Report of the National Reading Panel: Teaching children to read. National Institute of Child Health and Human Development.',
        url: 'https://www.nichd.nih.gov/publications/pubs/nrp/smallbook',
      },
      {
        text: 'Kuhn, M. R. ve Stahl, S. A. (2003). Fluency: A review of developmental and remedial practices. Journal of Educational Psychology, 95(1), 3–21.',
        url: 'https://doi.org/10.1037/0022-0663.95.1.3',
      },
      {
        text: 'Gough, P. B. ve Tunmer, W. E. (1986). Decoding, reading, and reading disability. Remedial and Special Education, 7(1), 6–10.',
        url: 'https://doi.org/10.1177/074193258600700104',
      },
      {
        text: 'Erden, G., Kurdoğlu, F. ve Uslu, R. (2002). İlköğretim okullarına devam eden Türk çocuklarının sınıf düzeylerine göre okuma hızı ve yazım hataları normlarının geliştirilmesi. Türk Psikiyatri Dergisi, 13(1), 5–13.',
      },
    ],
  },
};
