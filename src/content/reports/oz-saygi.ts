import type { ReportTemplate } from './types';

export const ozSaygiReport: ReportTemplate = {
  version: 'oz-saygi-rapor-1',
  bandLabels: {
    low: 'Kendine karşı eleştirel',
    average: 'Genel olarak olumlu',
    high: 'Olumlu',
  },
  scales: {
    self_esteem: {
      high: {
        summary: 'Kendine olumlu bakıyor',
        student: 'Kendine karşı olumlu bir bakışın var; kendini değerli ve yeterli görüyorsun.',
        parent: 'Çocuğunuz kendine karşı olumlu bir bakışa sahip olduğunu belirtiyor.',
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
        summary: 'Genel olarak olumlu',
        student:
          'Kendine genel olarak olumlu bakıyorsun; bazı zamanlar kendinden şüphe duyman da çok doğal.',
        parent:
          'Çocuğunuzun kendine bakışı genel olarak olumlu; zaman zaman kendinden şüphe duyduğunu belirtiyor. Bu ergenlikte çok yaygındır.',
        tipsStudent: [
          'İyi yaptığın üç şeyi yazmak bile kendine bakışını güçlendirir.',
          'Kendini başkalarıyla değil, dünkü hâlinle karşılaştır.',
        ],
        tipsParent: ['Sonuçtan çok çabayı övün.', 'Onu başkalarıyla karşılaştırmaktan kaçının.'],
      },
      low: {
        summary: 'Kendine karşı eleştirel',
        student:
          'Son zamanlarda kendine karşı oldukça eleştirel olduğunu söylüyorsun. Böyle hissetmek zor olabilir; ama bu duygular değişebilir ve bu konuda destek almak mümkün.',
        parent:
          'Çocuğunuz kendine karşı oldukça eleştirel bir bakışa sahip olduğunu belirtiyor. Bu bir tanı değildir, ancak dikkate alınması gereken bir işarettir.',
        tipsStudent: [
          'Güvendiğin bir yetişkinle nasıl hissettiğini konuş.',
          'Her akşam o gün iyi giden küçük bir şeyi not et.',
        ],
        tipsParent: [
          'Onu dinleyin, duygularını küçümsemeyin; eleştiri yerine destekleyici bir dil kullanın.',
          'Bu duygular uzun süredir devam ediyorsa ya da mutsuzluk, içe kapanma, uyku değişikliği gibi belirtiler varsa okulun rehber öğretmeniyle ya da bir uzmanla görüşmenizi öneririz.',
        ],
        support: true,
      },
    },
  },
};
