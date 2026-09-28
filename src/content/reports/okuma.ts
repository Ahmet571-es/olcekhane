import type { ReportTemplate } from './types';

export const okumaReport: ReportTemplate = {
  version: 'okuma-rapor-1',
  bandLabels: {
    low: 'Zorlanmış',
    average: 'Gelişiyor',
    high: 'İyi',
    very_high: 'Çok iyi',
  },
  scales: {
    comprehension: {
      very_high: {
        summary: 'Metni çok iyi anladı',
        student: 'Metni çok iyi anladın; bütün soruları doğru cevapladın.',
        parent: 'Çocuğunuz sınıf düzeyine uygun metni çok iyi anladı ve bütün soruları doğru cevapladı.',
        tipsStudent: [
          'Biraz daha uzun ve zor metinler seçerek kendini zorlayabilirsin.',
          'Okuduğun bir yazıyı birine kısaca anlatmak, anladıklarını kalıcı hâle getirir.',
        ],
        tipsParent: [
          'İlgi alanına göre biraz daha zor kitaplar ve bilgilendirici yazılar önerebilirsiniz.',
          'Okuduklarını sohbet konusu yapmak okuma alışkanlığını güçlendirir.',
        ],
      },
      high: {
        summary: 'Metni büyük ölçüde anladı',
        student: 'Metni büyük ölçüde anladın. Kaçırdığın birkaç ayrıntı, dikkatli okumayla kolayca yakalanabilir.',
        parent: 'Çocuğunuz metni büyük ölçüde anladı; bir iki soruda ayrıntıyı ya da çıkarımı kaçırdı.',
        tipsStudent: [
          'Her paragrafın sonunda durup "Burada ne anlatıldı?" diye kendine sor.',
          'Bilmediğin kelimelerin anlamını cümleden tahmin etmeye çalış.',
        ],
        tipsParent: [
          'Birlikte okuduğunuz metinlerde "Sence yazar neden böyle dedi?" gibi sorular sorun.',
          'Düzenli okuma zamanı (ör. her akşam 20 dakika) bu beceriyi güçlendirir.',
        ],
      },
      average: {
        summary: 'Ana hatlarını anladı',
        student:
          'Metnin ana hatlarını anladın; bazı ayrıntılar ve çıkarımlar zor gelmiş olabilir. Bu beceri okudukça gelişir.',
        parent:
          'Çocuğunuz metnin ana hatlarını anladı; ayrıntıları hatırlamakta ya da metinde açıkça yazmayanı çıkarmakta zorlanmış olabilir.',
        tipsStudent: [
          'Okurken önemli gördüğün cümlelerin altını çiz ya da kısa notlar al.',
          'Bir metni bitirince ana fikrini tek cümleyle söylemeyi dene.',
        ],
        tipsParent: [
          'Kısa bilgilendirici metinleri birlikte okuyup ana fikrini konuşun.',
          'Okuduktan sonra "Kim, ne, neden, nasıl?" sorularını sormak anlamayı güçlendirir.',
        ],
      },
      low: {
        summary: 'Anlamakta zorlandı',
        student:
          'Bu metinde anlamakta zorlandın. Bu tek bir ölçüm; yorgunluk ya da konuya ilgi de sonucu etkileyebilir. Okuduğunu anlamak, pratikle gelişen bir beceri.',
        parent:
          'Çocuğunuz bu metni anlamakta zorlandı. Tek bir kısa ölçüm olduğu için kesin bir yargıya varılmamalıdır; ancak benzer zorluklar derslerde de görülüyorsa okuma becerisine odaklanmakta yarar var.',
        tipsStudent: [
          'Metni okumadan önce başlığa bakıp neyi anlatacağını tahmin et.',
          'Uzun cümleleri parçalara bölerek oku; anlamadığın yerde durup yeniden oku.',
        ],
        tipsParent: [
          'Onun ilgisini çeken konularda kısa metinlerle başlayın ve birlikte okuyun.',
          'Okumada kalıcı bir zorluk görüyorsanız öğretmeniyle ve okulun rehberlik servisiyle görüşün.',
        ],
      },
    },
  },
};
