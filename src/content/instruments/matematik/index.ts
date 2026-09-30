import type { QuizInstrument } from '@/lib/instruments/types';
import { form5 } from './form5';
import { form6 } from './form6';
import { form7 } from './form7';
import { form8 } from './form8';
import { MISCONCEPTIONS } from './misconceptions';

/**
 * Matematik Konu Tarama Testi (eski adı: Matematik Tanı Testi; eski adres kalıcı olarak yönlendirilir)
 * Özgün test (Ölçekhane, 2026). Her öğrenci, bulunduğu sınıftan bir önceki sınıfın temel konularını
 * yoklayan 20 soruluk formu çözer (hazırbulunuşluk). Yanlış seçenekler yaygın hatalara göre yazılmıştır;
 * rapor hem konu alanlarındaki başarıyı hem de yanlış cevapların işaret ettiği hata türlerini gösterir.
 * Durum: pilot.
 */
export const matematik: QuizInstrument = {
  slug: 'matematik-konu-tarama-testi',
  version: 1,
  engine: 'quiz',
  subject: 'Matematik',
  name: 'Matematik Konu Tarama Testi',
  shortName: 'Matematik',
  domain: 'academic',
  status: 'pilot',
  licenseStatus: 'original',
  isFree: true,
  minGrade: 5,
  maxGrade: 8,
  estimatedMinutes: 30,
  sortOrder: 42,
  tagline:
    'Bir önceki sınıfın temel konularını yoklayan hazırbulunuşluk testi: neyin sağlam, neyin eksik olduğunu ve yanlışların hangi hatadan kaynaklandığını gösterir.',
  description:
    'Matematikte her konu bir öncekinin üzerine kurulur; bu yüzden eksikleri erken fark etmek önemlidir. Bu testte öğrenci, bulunduğu sınıftan bir önceki sınıfın temel konularını yoklayan 20 soru çözer. Yanlış seçenekler, öğrencilerin sık yaptığı hatalara göre hazırlanmıştır. Rapor yalnızca kaç sorunun doğru olduğunu değil, yanlışların hangi hata türüne işaret ettiğini de gösterir.',
  intro: {
    title: 'Matematik konu tarama testi',
    paragraphs: [
      'Birazdan 20 matematik sorusu göreceksin. Sorular bir önceki sınıfta öğrendiğin konulardan seçildi.',
      'Kâğıt ve kalem kullanabilirsin; hesap makinesi kullanma. Acele etmene gerek yok.',
      'Bir sorunun cevabını bilmiyorsan tahmin etme, “Bilmiyorum” düğmesine bas. Böylece rapor neyi bilip neyi henüz öğrenmediğini daha doğru gösterir.',
    ],
  },
  scales: [
    { key: 'sayilar', name: 'Sayılar ve işlemler', plain: 'Doğal sayılar, tam sayılar, basamak değeri, bölünebilme ve dört işlem problemleri.' },
    { key: 'kesirler', name: 'Kesirler, ondalık gösterim ve yüzde', plain: 'Kesirlerin anlamı ve gösterimleri, kesirlerle işlemler, ondalık gösterim ve yüzdeler.' },
    { key: 'oran', name: 'Oran ve orantı', plain: 'Oran, doğru orantı ve yüzde problemleri (8. sınıf formunda).' },
    { key: 'cebir', name: 'İşlemler, örüntüler ve cebir', plain: 'İşlem önceliği, eşitlik, örüntüler, cebirsel ifadeler ve denklemler.' },
    { key: 'geometri', name: 'Geometri ve ölçme', plain: 'Açılar, şekillerin çevresi ve alanı, çember, hacim ve ölçü birimleri.' },
    { key: 'veri', name: 'Veri ve olasılık', plain: 'Tablo ve grafik okuma, ortalama ve ortanca, olasılık.' },
    { key: 'total', name: 'Genel', plain: 'Bütün sorulardaki doğru cevap oranı.' },
  ],
  forms: [form5, form6, form7, form8],
  misconceptions: MISCONCEPTIONS,
  science: {
    basedOn:
      'Özgün konu tarama testi (Ölçekhane, 2026). Sorular ortaokul matematik öğretim programının temel konularına göre yazılmış; yanlış seçenekler, matematik eğitimi araştırmalarında sık rastlanan hata türlerine göre hazırlanmıştır.',
    whatItMeasures:
      'Öğrencinin bir önceki sınıfta öğrendiği temel matematik konularındaki hâkimiyetini beş alanda ölçer ve yanlış cevapların hangi hata türüne işaret ettiğini gösterir. Böylece yalnızca “kaç doğru” sorusuna değil, “neden yanlış” sorusuna da cevap verir.',
    turkishVersion:
      'Özgün Türkçe test; çeviri değildir. Her sınıf için ayrı bir form vardır (5., 6., 7. ve 8. sınıflar için 20’şer soru). Her alanda 4 soru bulunur.',
    reliability:
      'Pilot aşamasındadır. Soruların güçlüğü ve ayırt ediciliği ile formların güvenirliği (KR-20) henüz incelenmedi.',
    normStatus: 'none',
    normNote:
      'Türkiye normu yoktur; sonuçlar ölçüt temellidir. Bir alanda 4 sorudan en az 3’ünü doğru yapmak “sağlam”, 2’sini doğru yapmak “pekiştirilmeli”, daha azını doğru yapmak “öncelikli” olarak yorumlanır. Testin geneli için de aynı oranlar kullanılır (20 sorudan en az 15 ve en az 10 doğru).',
    ageNote:
      '5.–8. sınıflar. Her öğrenci, bulunduğu sınıftan bir önceki sınıfın konularını içeren formu çözer; böylece test yılın her döneminde adil olur ve yeni konuların üzerine kurulacağı temeli yoklar. 2024’ten itibaren kademeli olarak uygulanan Türkiye Yüzyılı Maarif Modeli programında sınıf düzeyi değişen konular, öğrencinin gerçekten işlemiş olacağı biçimde seçilmiştir.',
    license: 'Özgün test. Ölçekhane tarafından geliştirilmiştir.',
    limitations: [
      'Her alanda 4 soru vardır; alan sonuçları kaba bir göstergedir ve tek başına karar vermek için kullanılmamalıdır.',
      'Öğretim programı değişikliği sürecinde bazı konular okullarda farklı sınıflarda işlenebilir. Henüz işlenmemiş bir konudaki yanlış, eksik değil öğretilmemiş olduğunu gösterebilir.',
      'Tek bir yanlış seçenek bir hata türünü kesin olarak göstermez; dikkatsizlik ya da tahmin de olabilir. Aynı hata türü birden fazla soruda görüldüğünde işaret daha güçlüdür.',
      'Aynı form ikinci kez çözüldüğünde soruların hatırlanması puanı yükseltebilir; bu yüzden tekrarlanan sonuçlar dikkatle karşılaştırılmalıdır.',
      'Pilot aşamasındadır: soru istatistikleri ve güvenirlik çalışması henüz yapılmadı.',
    ],
    citations: [
      {
        text: 'Millî Eğitim Bakanlığı (2024). Türkiye Yüzyılı Maarif Modeli öğretim programları: Ortaokul Matematik Dersi Öğretim Programı.',
        url: 'https://tymm.meb.gov.tr/ogretim-programlari',
      },
      {
        text: 'Brown, J. S. ve Burton, R. R. (1978). Diagnostic models for procedural bugs in basic mathematical skills. Cognitive Science, 2(2), 155–192.',
        url: 'https://doi.org/10.1207/s15516709cog0202_4',
      },
      {
        text: 'Ni, Y. ve Zhou, Y.-D. (2005). Teaching and learning fraction and rational numbers: The origins and implications of whole number bias. Educational Psychologist, 40(1), 27–52.',
        url: 'https://doi.org/10.1207/s15326985ep4001_3',
      },
      {
        text: 'Haladyna, T. M., Downing, S. M. ve Rodriguez, M. C. (2002). A review of multiple-choice item-writing guidelines for classroom assessment. Applied Measurement in Education, 15(3), 309–333.',
        url: 'https://doi.org/10.1207/S15324818AME1503_5',
      },
      {
        text: 'Rohrer, D., Dedrick, R. F. ve Stershic, S. (2015). Interleaved practice improves mathematics learning. Journal of Educational Psychology, 107(3), 900–908.',
        url: 'https://doi.org/10.1037/edu0000001',
      },
    ],
  },
};
