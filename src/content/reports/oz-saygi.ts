import type { ReportTemplate } from './types';

/**
 * Öz-saygı Ölçeği rapor metinleri.
 *
 * İlkeler:
 *  - Sonuç öz bildirime dayanır: öğrenciye "… söylüyorsun", veliye "Çocuğunuz … belirtiyor" dili kullanılır; puan bir
 *    gerçek ya da yetenek gibi anlatılmaz. Tanı koyan ya da korkutan dil kullanılmaz.
 *  - Orta aralık (15–25) geniştir ve en altı (15) on cümlenin yarısında olumsuz cevap demektir; bu yüzden orta düzey
 *    "genel olarak olumlu" denmez, "Dengeli" denir: kişi kendini değerli gördüğü zamanlar da, kendinden şüphe duyduğu
 *    zamanlar da olduğunu söyler (2026-10-22 incelemesi).
 *  - Toplam puan tek bir cevabı gizleyebilir: "işe yaramaz" ya da "başarısız" cümlesine katılınırsa (ölçekte supportItems)
 *    destek kutusu her düzeyde açılır ve ilk satırı nedenini söyler (`itemSupport`). Bu satır öneri vermez: düşük düzeyin
 *    veli kartı zaten onunla konuşmayı önerir; kutunun öteki satırları nereden destek alınabileceğini söyler.
 *  - Öneriler raporda değil, yol haritasındadır (öneri listeleri basit raporda gösterilmez).
 */
export const ozSaygiReport: ReportTemplate = {
  version: 'oz-saygi-rapor-1',
  bandLabels: {
    low: 'Kendine karşı eleştirel',
    average: 'Dengeli',
    high: 'Olumlu',
  },
  itemSupport: {
    student: 'Cevaplarından en az birinde kendini zaman zaman işe yaramaz hissettiğini ya da başarısız biri gibi gördüğünü söyledin.',
    parent:
      'Çocuğunuz cevaplarından en az birinde kendini zaman zaman işe yaramaz hissettiğini ya da başarısız biri gibi gördüğünü belirtmiş. Bu duygular bir süredir devam ediyorsa aşağıdaki yollardan destek alabilirsiniz.',
  },
  scales: {
    self_esteem: {
      high: {
        summary: 'Kendine olumlu bakıyor',
        student: 'Kendine karşı olumlu bir bakışın olduğunu, kendini değerli ve yeterli gördüğünü söylüyorsun.',
        parent: 'Çocuğunuz kendine karşı olumlu bir bakışa sahip olduğunu, kendini değerli ve yeterli gördüğünü belirtiyor.',
        tipsStudent: [
          'Bu güveni yeni şeyler denemek için kullan.',
          'Hata yaptığında da kendine aynı nezaketi göstermeye devam et.',
        ],
        tipsParent: [
          'Emeğini ve çabasını takdir etmeye devam edin.',
          'Sağlıklı öz-saygı hataları kabul edebilmeyi de içerir; bunu birlikte konuşabilirsiniz.',
        ],
      },
      average: {
        summary: 'Dengeli',
        student:
          'Kendini değerli ve yeterli gördüğün zamanlar da, kendinden şüphe duyduğun zamanlar da olduğunu söylüyorsun. Bu çok yaygındır.',
        parent:
          'Çocuğunuz kendini değerli ve yeterli gördüğü zamanlar da, kendinden şüphe duyduğu zamanlar da olduğunu belirtiyor. Bu, ergenlikte çok yaygındır.',
        tipsStudent: [
          'İyi yaptığın üç şeyi yazmak bile kendine bakışını güçlendirir.',
          'Kendini başkalarıyla değil, dünkü hâlinle karşılaştır.',
        ],
        tipsParent: ['Sonuçtan çok çabayı övün.', 'Onu başkalarıyla karşılaştırmaktan kaçının.'],
      },
      low: {
        summary: 'Kendine karşı eleştirel',
        student:
          'Kendine karşı eleştirel bir bakışın olduğunu söylüyorsun. Böyle hissetmek zor olabilir; ama bu duygular değişebilir ve bu konuda destek almak mümkün.',
        parent:
          'Çocuğunuz kendine karşı eleştirel bir bakışı olduğunu belirtiyor. Bu bir tanı değildir; ama nasıl hissettiğini onunla sakin bir anda konuşmaya değer.',
        tipsStudent: [
          'Güvendiğin bir yetişkinle nasıl hissettiğini konuş.',
          'Her akşam o gün iyi giden küçük bir şeyi not et.',
        ],
        tipsParent: [
          'Onu dinleyin, duygularını küçümsemeyin; eleştiri yerine destekleyici bir dil kullanın.',
          'Bu duygular uzun süredir devam ediyorsa ya da mutsuzluk, içe kapanma, uyku değişikliği gibi belirtiler varsa okulun rehberlik servisiyle (psikolojik danışman) ya da bir uzmanla görüşmenizi öneririz.',
        ],
        support: true,
      },
    },
  },
};
