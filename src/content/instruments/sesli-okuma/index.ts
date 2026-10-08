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
 * cümleleriyle anlatır ve metne bakmadan soruları cevaplar. Bir yetişkin kaydı dinleyerek okuma hatalarını işaretler,
 * anlatmada söylenen fikirleri ve okumanın akıcılığını değerlendirir. Her sınıfa üç metin vardır; sayı artırılabilir.
 *
 * Otomatik analiz sürümünde (önizleme bağlantısıyla; lib/oral/auto.ts) öğrenci tek başına okur ve soruları cevaplar;
 * kaydı öğrencinin cihazında çalışan bir konuşma tanıma modeli inceler, yetişkin dinlemez. Bu sürümde akıcılık
 * derecelendirmesi ve yeniden anlatma yoktur. Bilim kartındaki metinler iki sürümü de doğru anlatır.
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
    'Öğrenci sınıfına uygun bir metni sesli okur; öğretmen ya da veli kaydı dinleyerek doğru okumayı, hızı, akıcılığı ve anlamayı değerlendirir.',
  description:
    'Okuma becerisini en iyi gösteren yollardan biri, çocuğun bir metni sesli okumasını dinlemektir. Bu değerlendirmede öğrenci sınıf düzeyine göre yazılmış bir metni sesli okur; okuma yalnızca cihazda kayda alınır. Sonra metni kendi cümleleriyle anlatır ve metne bakmadan soruları cevaplar. Ardından bir yetişkin (öğretmen ya da veli) kaydı dinleyerek okuma hatalarını kelime kelime işaretler, anlatmada söylenen fikirleri ve okumanın akıcılığını değerlendirir. Rapor; dakikada doğru okunan kelime sayısını, doğru okuma oranını, hata türlerini, duraklamaları, akıcılığı ve okuduğunu anlamayı sade bir dille anlatır ve metnin öğrenci için rahat mı, destekle mi okunabilir yoksa şimdilik zor mu olduğunu gösterir.',
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
    { key: 'comprehension', name: 'Okuduğunu anlama', plain: 'Metindeki bilgiyi bulma, çıkarım yapma, kelime anlamı ve ana fikir.' },
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
      'Özgün değerlendirme: sınıf düzeyine göre yazılmış metinlerin sesli okunması, yetişkinin kaydı dinleyerek okuma hatalarını işaretlemesi, yeniden anlatma ve anlama soruları (Ölçekhane, 2026). Deneme aşamasındaki otomatik analiz sürümünde okuma hatalarını yetişkin değil, öğrencinin cihazında çalışan bir yapay zekâ modeli (konuşma tanıma) işaretler. Akıcı okumanın üç yönü (doğruluk, hız, vurgu ve tonlama) Ulusal Okuma Paneli’nin (2000) tanımına dayanır.',
    whatItMeasures:
      'Doğru okuma (doğru okunan kelime oranı), okuma hızı (dakikada doğru okunan kelime), akıcılık (vurgu ve tonlama, öbekleme, düzgünlük, tempo), okuduğunu anlama (bilgi, çıkarım, kelime anlamı ve ana fikir soruları) ve yeniden anlatma. Otomatik analiz sürümünde akıcılık derecelendirilmez ve yeniden anlatma yoktur; okumanın ritmi duraklamalarla gösterilir.',
    turkishVersion: 'Metinler, sorular ve derecelendirmeler doğrudan Türkçe yazılmıştır; çeviri değildir.',
    reliability:
      'Değerlendirme pilot aşamadadır. Metinlerin sınıf düzeyine uygunluğu, soruların madde analizi, iki dinleyicinin işaretlemelerinin ne kadar uyuştuğu ve otomatik analizin işaretlerinin bir öğretmenin işaretlemesiyle ne kadar uyuştuğu henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Bu değerlendirmenin Türkiye normu yoktur; sonuçlar akranlarla karşılaştırılmaz. Metnin öğrenci için düzeyi Ölçekhane’nin pilot ölçütlerine göre belirlenir: Doğru okunan kelime oranı %97 ve üzerindeyse rahat, %90 ile %97 arasındaysa destekle, %90’ın altındaysa zor; sorularda doğru oranı %80 ve üzerindeyse rahat, %60 ile %80 arasındaysa destekle, %60’ın altındaysa zor. İkisinden düşük olanı metnin düzeyidir. 1–5. sınıflarda okuma hızı, Türkiye’de yayımlanmış bir çalışmadaki ortalamayla yalnızca kaba bir fikir vermek için karşılaştırılır.',
    ageNote:
      '1–8. sınıflar için. Her sınıfa üç metin vardır; öğrenci kendi sınıfının ya da bir alt ve bir üst sınıfın metnini okuyabilir. 1. sınıf metinleri ikinci dönem için yazılmıştır. Değerlendirmeyi bir yetişkin (öğretmen ya da veli) yapar; otomatik analiz sürümünde öğrenci tek başına okur ve kaydını bir yetişkin dinlemez.',
    license: 'Özgün içerik: metinler, sorular ve derecelendirmeler Ölçekhane’ye aittir.',
    limitations: [
      'Okuma hatalarını dinleyen yetişkin işaretler: İki dinleyici aynı okumayı biraz farklı işaretleyebilir. Kaydı gerektiğinde yavaşlatıp yeniden dinleyerek işaretlemek bu farkı azaltır.',
      'Tek bir metne dayanır; konuya ilgi, metnin türü ve o günkü yorgunluk sonucu etkileyebilir. Gelişimi izlemek için farklı metinlerle tekrarlanmalıdır.',
      'Yetişkinin işaretlediği sürümde uygulama konuşmayı tanımaz; ses kaydından yalnızca süre ve duraklamalar ölçülür. Bu ölçümler arka plan gürültüsünden etkilenebilir.',
      'Otomatik analiz sürümü deneme aşamasındadır: Okumayı, öğrencinin cihazında (tarayıcıda) çalışan bir yapay zekâ modeli inceler; ses cihazdan çıkmaz ve analiz bitince silinir. Model, özellikle çocuk seslerinde ve gürültülü ortamlarda bazı kelimeleri yanlış duyabilir; doğru okunmuş bir kelimeyi hata sayabilir ya da bir hatayı fark etmeyebilir. Net ayırt edemediği kelimeler hata sayılmaz; bu yüzden doğru okuma oranı olduğundan yüksek çıkabilir. Sonuçlar yaklaşıktır.',
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
