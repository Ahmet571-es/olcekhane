import type { LikertInstrument } from '@/lib/instruments/types';

/**
 * Öz-saygı Ölçeği
 * Kaynak: Rosenberg Self-Esteem Scale (Rosenberg, 1965). Ücretsiz ve bildirim gerektirmeden kullanılabilir.
 * Türkçe çeviri: Ölçekhane, 2026. Puanlama 0–3 (toplam 0–30); 2, 5, 6, 8 ve 9. maddeler ters puanlanır.
 *
 * Cevap denetimi (2026-10-22 incelemesi): on cümlenin beşi olumlu, beşi olumsuz bir şey söylediği için bütün cümlelere
 * aynı cevap (ortada seçenek yok; hep "Tamamen katılıyorum" toplamı 15 yapar ve "Dengeli" görünür) kalite notu verir
 * (`sameAnswerCheck`). Madde düzeyinde destek (`supportItems`): toplam puan tek bir cevabı gizleyebilir. "Sonuçta kendimi
 * başarısız biri gibi görme eğilimindeyim" (R9) cümlesine "Katılıyorum" ya da "Tamamen katılıyorum", "Bazen kendimi
 * gerçekten işe yaramaz hissediyorum" (R6) cümlesine "Tamamen katılıyorum" denirse destek kutusu toplam puandan bağımsız
 * açılır ve ilk satırı nedenini söyler (rapor şablonu: itemSupport). R6 "bazen" dediği için yalnızca en güçlü cevap
 * kutuyu açar: zaman zaman kendini işe yaramaz hissettiğine katılmak gençlerde çok yaygındır.
 */
export const ozSaygi: LikertInstrument = {
  slug: 'oz-saygi',
  version: 1,
  engine: 'likert',
  name: 'Öz-saygı Ölçeği',
  shortName: 'Öz-saygı',
  domain: 'personality',
  status: 'active',
  licenseStatus: 'public_domain',
  isFree: true,
  minGrade: 6,
  maxGrade: 13,
  estimatedMinutes: 3,
  sortOrder: 20,
  tagline: 'Öğrencinin kendine genel olarak nasıl baktığını, on kısa cümleyle ölçer.',
  description:
    'Öz-saygı, kişinin kendini genel olarak ne kadar değerli ve yeterli gördüğüdür. Derslere katılımdan arkadaşlıklara kadar pek çok alanı etkiler. Bu ölçek dünyada en çok kullanılan öz-saygı ölçeğidir ve yalnızca üç dakika sürer.',
  intro: {
    title: 'Kendine nasıl bakıyorsun?',
    paragraphs: [
      'Birazdan kendin hakkında 10 cümle göreceksin. Her birine ne kadar katıldığını seç.',
      'Genel olarak nasıl hissettiğini düşün, yalnızca bugünü değil. Doğru ya da yanlış cevap yok.',
    ],
  },
  prompt: 'Bu cümleye ne kadar katılıyorsun?',
  options: [
    { value: 0, label: 'Hiç katılmıyorum' },
    { value: 1, label: 'Katılmıyorum' },
    { value: 2, label: 'Katılıyorum' },
    { value: 3, label: 'Tamamen katılıyorum' },
  ],
  scoring: { method: 'sum', minAnsweredRatio: 0.9 },
  supportItems: [
    { key: 'R6', min: 3 },
    { key: 'R9', min: 2 },
  ],
  sameAnswerCheck: true,
  totalScale: 'self_esteem',
  anchoredBands: {
    basis: 'sum',
    thresholds: [
      { band: 'low', min: 0 },
      { band: 'average', min: 15 },
      { band: 'high', min: 26 },
    ],
  },
  scales: [
    {
      key: 'self_esteem',
      name: 'Öz-saygı',
      plain: 'Kişinin kendini genel olarak değerli ve yeterli görmesi.',
      poles: { low: 'Kendine karşı eleştirel', high: 'Kendine karşı olumlu' },
      alpha: 0.81,
      sdRef: 5,
    },
  ],
  items: [
    { key: 'R1', scale: 'self_esteem', text: 'Genel olarak kendimden memnunum.', source: 'On the whole, I am satisfied with myself.' },
    { key: 'R2', scale: 'self_esteem', reverse: true, text: 'Bazen hiçbir işe yaramadığımı düşünürüm.', source: 'At times I think I am no good at all.' },
    { key: 'R3', scale: 'self_esteem', text: 'Birçok iyi özelliğim olduğunu düşünüyorum.', source: 'I feel that I have a number of good qualities.' },
    { key: 'R4', scale: 'self_esteem', text: 'Çoğu insan kadar iyi iş çıkarabilirim.', source: 'I am able to do things as well as most other people.' },
    { key: 'R5', scale: 'self_esteem', reverse: true, text: 'Kendimde gurur duyacak pek bir şey bulamıyorum.', source: 'I feel I do not have much to be proud of.' },
    { key: 'R6', scale: 'self_esteem', reverse: true, text: 'Bazen kendimi gerçekten işe yaramaz hissediyorum.', source: 'I certainly feel useless at times.' },
    { key: 'R7', scale: 'self_esteem', text: 'En az diğer insanlar kadar değerli biri olduğumu düşünüyorum.', source: "I feel that I'm a person of worth, at least on an equal plane with others." },
    { key: 'R8', scale: 'self_esteem', reverse: true, text: 'Keşke kendime daha çok saygı duyabilsem.', source: 'I wish I could have more respect for myself.' },
    { key: 'R9', scale: 'self_esteem', reverse: true, text: 'Sonuçta kendimi başarısız biri gibi görme eğilimindeyim.', source: 'All in all, I am inclined to feel that I am a failure.' },
    { key: 'R10', scale: 'self_esteem', text: 'Kendime karşı olumlu bir tutumum var.', source: 'I take a positive attitude toward myself.' },
  ],
  science: {
    basedOn: 'Rosenberg Öz-saygı Ölçeği (Rosenberg, 1965), 10 madde.',
    whatItMeasures: 'Kişinin kendine yönelik genel tutumu: kendini ne kadar değerli, yeterli ve saygıya layık gördüğü.',
    turkishVersion:
      'Ölçeğin ergenlerle yapılmış bir Türkçe uyarlaması vardır (Çuhadaroğlu, 1986). Platformdaki metin Ölçekhane’nin kendi çevirisidir; özgün ölçek serbestçe kullanılabildiği için yeni bir çeviri yapıldı. Bu çevirinin Türkçe geçerlik çalışması henüz yapılmadı.',
    reliability:
      '53 ülkede eş zamanlı uygulamada ölçeğin iç tutarlılığı ortalama α = .81 bulunmuştur (Schmitt ve Allik, 2005).',
    normStatus: 'none',
    normNote:
      'Türkiye’de gençler için henüz bir karşılaştırma çalışması (norm) yok. Toplam puan, ölçeğin yaygın kullanılan aralıklarına göre yorumlanır (0–14, 15–25, 26–30): sonuç kişinin kendini nasıl gördüğünü gösterir, başkalarıyla karşılaştırma yapmaz. Bu aralıklar klinik bir eşik değildir.',
    ageNote: '6. sınıftan itibaren uygundur.',
    license: 'Ücretsiz: ölçek izin almadan ve bildirim yapmadan kullanılabilir.',
    licenseUrl: 'https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale',
    limitations: [
      'Genel tutumu ölçer, ama zor bir dönemden geçen öğrencinin puanı geçici olarak düşebilir.',
      'Düşük puan bir tanı değildir. Uzun süredir devam eden bir değersizlik duygusu varsa bir uzmanla konuşmak iyi gelir.',
    ],
    citations: [
      { text: 'Rosenberg, M. (1965). Society and the Adolescent Self-Image. Princeton University Press.' },
      {
        text: 'Schmitt, D. P. ve Allik, J. (2005). Simultaneous administration of the Rosenberg Self-Esteem Scale in 53 nations. Journal of Personality and Social Psychology, 89(4), 623–642.',
        url: 'https://doi.org/10.1037/0022-3514.89.4.623',
      },
      { text: 'Çuhadaroğlu, F. (1986). Adolesanlarda benlik saygısı. Yayımlanmamış uzmanlık tezi, Hacettepe Üniversitesi.' },
    ],
  },
};
