import type { BandText, ReportTemplate, ScaleTexts } from './types';

/**
 * Çalışma Alışkanlıkları Envanteri: rapor metinleri. Düzey adları bir sıklık dizisidir ("Çok az kullanılıyor" … "Çok sık
 * kullanılıyor"): cevaplar bir alışkanlığın ne sıklıkla kullanıldığıdır, düşük düzey bir eksiklik hükmü değildir. Kısa
 * adlar (summary) kişisiz yazılır ("Takılınca çoğu zaman sormadan geçen"); emir gibi okunmaz. Öneriler söz vermez:
 * "-abilir" diye yazılır.
 */

/** Üç düzeyli metni beş düzeye yayar: çok düşük ve düşük aynı, yüksek ve çok yüksek aynı metni kullanır. */
function three(low: BandText, mid: BandText, high: BandText): ScaleTexts {
  return { very_low: low, low, average: mid, high, very_high: high };
}

export const calismaAliskanliklariReport: ReportTemplate = {
  version: 'calisma-aliskanliklari-rapor-2',
  evaluative: true,
  bandLabels: {
    very_low: 'Çok az kullanılıyor',
    low: 'Az kullanılıyor',
    average: 'Ara sıra kullanılıyor',
    high: 'Sık kullanılıyor',
    very_high: 'Çok sık kullanılıyor',
  },
  overview: {
    student:
      'Her satır bir çalışma alışkanlığını gösteriyor. Kırmızı işaret bu alışkanlığı ne sıklıkla kullandığını gösterir. Sağa doğru gidildikçe alışkanlık daha sık kullanılıyor demektir; bunlar araştırmalarda öğrenmeyi destekleyen davranışlardır.',
    parent:
      'Her satır bir çalışma alışkanlığını gösterir. Kırmızı işaret, çocuğunuzun bu alışkanlığı ne sıklıkla kullandığını belirttiğini gösterir. Sağa doğru gidildikçe alışkanlık daha sık kullanılıyor demektir; bunlar araştırmalarda öğrenmeyi destekleyen davranışlardır.',
  },
  scales: {
    planning: three(
      {
        summary: 'Çoğu zaman plansız',
        student:
          'Çalışmaya genellikle plansız başlıyorsun ve işler çoğu zaman son güne kalıyor. Bu çok yaygın bir durum ve küçük adımlarla değiştirilebilir.',
        parent:
          'Çocuğunuz çalışmayı genellikle önceden planlamadığını ve işlerin çoğu zaman son güne kaldığını belirtiyor. Planlama, birlikte çalışılarak geliştirilebilecek bir beceridir.',
        tipsStudent: [
          'Her akşam yalnızca beş dakikanı ayırıp ertesi gün neyi çalışacağını üç madde olarak yaz.',
          'Büyük bir ödevi parçalara böl ve her parçaya bir gün ver.',
        ],
        tipsParent: [
          'Haftanın başında birlikte oturup sınav ve ödev tarihlerini bir takvime yazın.',
          'Planı siz yapmayın; onun yapmasına yardım edin ve küçük ilerlemeleri fark edin.',
        ],
      },
      {
        summary: 'Zaman zaman planlı',
        student: 'Bazen planlı çalışıyorsun, bazen işler son güne kalıyor. Planlamayı bir alışkanlık hâline getirmek sana zaman kazandırabilir.',
        parent: 'Çocuğunuz zaman zaman planlı çalıştığını, zaman zaman da işleri son güne bıraktığını belirtiyor.',
        tipsStudent: [
          'Sınav tarihlerini öğrenir öğrenmez takvimine yaz ve geriye doğru çalışma günleri belirle.',
          'Gün sonunda planının ne kadarını yaptığını kontrol et; yapamadıklarını ertesi güne aktar.',
        ],
        tipsParent: [
          'Sınavdan birkaç gün önce değil, bir hafta önce “Planın ne?” diye sorun.',
          'Planına uyduğu günleri takdir edin; sonuçtan çok düzenli çabayı övün.',
        ],
      },
      {
        summary: 'Planlı ve önceden başlayan',
        student: 'Çalışmanı önceden planlıyor ve işleri son güne bırakmıyorsun. Bu, sınav dönemlerinde sana rahatlık sağlayabilir.',
        parent: 'Çocuğunuz çalışmasını önceden planladığını ve işleri son güne bırakmadığını belirtiyor. Bu güçlü bir alışkanlıktır.',
        tipsStudent: [
          'Planına tekrar günleri de ekle: öğrendiğin konulara birkaç gün sonra geri dön.',
          'Plan yaparken dinlenme ve boş zamanlara da yer ayır.',
        ],
        tipsParent: ['Bu alışkanlığını fark ettiğinizi söyleyin.', 'Planların esnek olabileceğini, aksayan günlerin de normal olduğunu hatırlatın.'],
      },
    ),
    retrieval: three(
      {
        summary: 'Çoğunlukla yeniden okumaya dayalı',
        student:
          'Tekrar yaparken daha çok notlarını yeniden okuyorsun. Yeniden okumak “biliyorum” hissi verir ama kalıcı öğrenme için en etkili yollardan biri, kitabı kapatıp hatırlamaya çalışmaktır.',
        parent:
          'Çocuğunuz tekrar yaparken daha çok notlarını yeniden okuduğunu belirtiyor. Araştırmalar, bilgiyi kitaba bakmadan hatırlamaya çalışmanın ve tekrarı günlere yaymanın çok daha etkili olduğunu gösteriyor.',
        tipsStudent: [
          'Bir konuyu okuduktan sonra kitabı kapat ve hatırladığın her şeyi boş bir kâğıda yaz. Sonra kontrol et.',
          'Aynı konuyu tek seferde üç kez okumak yerine üç farklı günde kısaca tekrar et.',
        ],
        tipsParent: [
          '“Ders çalıştın mı?” yerine “Bugün öğrendiğin bir şeyi bana anlatır mısın?” diye sorun.',
          'Soru kartları hazırlamasına yardım edin ve arada bir onu sınayın.',
        ],
      },
      {
        summary: 'Zaman zaman kendini sınayan',
        student: 'Bazen kendini sınıyor, bazen yalnızca yeniden okuyorsun. Kendini sınamayı daha sık kullanırsan aynı sürede daha kalıcı öğrenebilirsin.',
        parent: 'Çocuğunuz bazen kendini sınadığını, bazen yalnızca notlarını yeniden okuduğunu belirtiyor.',
        tipsStudent: [
          'Her çalışma oturumunu birkaç soruyla bitir: kitaba bakmadan cevaplamaya çalış.',
          'Öğrendiğin konuları ertesi gün, birkaç gün sonra ve bir hafta sonra kısaca tekrar et.',
        ],
        tipsParent: ['Sınavdan önceki son akşam yerine, günlere yayılmış kısa tekrarları destekleyin.', 'Onu sınamayı teklif edin; takıldığı yerleri birlikte not edin.'],
      },
      {
        summary: 'Kendini sınayan, tekrarı günlere yayan',
        student:
          'Öğrendiklerini kitaba bakmadan hatırlamaya çalışıyor ve tekrarını günlere yayıyorsun. Bu, araştırmalarda en etkili bulunan iki çalışma yöntemi.',
        parent:
          'Çocuğunuz öğrendiklerini kitaba bakmadan hatırlamaya çalıştığını ve tekrarını günlere yaydığını belirtiyor. Bunlar araştırmalarda en etkili bulunan iki çalışma yöntemidir.',
        tipsStudent: ['Farklı konulardan soruları karışık sırayla çözerek bir adım daha ileri git.', 'Takıldığın soruları ayrı bir yere not et ve birkaç gün sonra yeniden dene.'],
        tipsParent: ['Bu güçlü alışkanlığı fark ettiğinizi söyleyin.', 'Karışık soru çözümü için farklı ünitelerden sorular bulmasına yardım edin.'],
      },
    ),
    understanding: three(
      {
        summary: 'Daha çok ezbere dayalı',
        student:
          'Konuları çoğu zaman anlamadan ezberlemeye çalışıyorsun. Ezber kısa sürede işe yarar gibi görünür ama çabuk unutulur. Anladığın bilgi ise daha kalıcıdır.',
        parent:
          'Çocuğunuz konuları çoğu zaman anlamadan ezberlemeye çalıştığını belirtiyor. Anlamaya dayalı öğrenme genellikle daha kalıcıdır ve yeni konuları öğrenmeyi kolaylaştırabilir.',
        tipsStudent: [
          'Her yeni bilgi için kendine “Bu neden böyle?” diye sor ve cevabını bir cümleyle yaz.',
          'Öğrendiğin konuyu kendi cümlelerinle bir arkadaşına ya da ailene anlat.',
        ],
        tipsParent: [
          'Öğrendiği bir konuyu size anlatmasını isteyin ve “Neden?” diye merakla sorun.',
          'Konuları gündelik hayattan örneklerle ilişkilendirmesine yardım edin.',
        ],
      },
      {
        summary: 'Zaman zaman anlamaya yönelik',
        student: 'Bazen konuları anlamaya çalışıyor, bazen ezberliyorsun. “Neden?” sorusunu daha sık sormak öğrendiklerini daha kalıcı yapabilir.',
        parent: 'Çocuğunuz bazen konuları anlamaya çalıştığını, bazen ezberlediğini belirtiyor.',
        tipsStudent: ['Yeni bir konuyu daha önce bildiğin bir şeye benzetmeye çalış.', 'Bir çözümün her adımını kendine sesli açıkla.'],
        tipsParent: ['Anlamadığı bir yeri geçmek yerine üzerinde durmasını destekleyin.', 'Doğru cevaptan çok akıl yürütmesini takdir edin.'],
      },
      {
        summary: 'Anlamaya yönelik',
        student: 'Konuları ezberlemek yerine anlamaya, açıklamaya ve bildiklerinle ilişkilendirmeye çalışıyorsun. Bu, kalıcı öğrenmenin temelidir.',
        parent: 'Çocuğunuz konuları ezberlemek yerine anlamaya ve bildikleriyle ilişkilendirmeye çalıştığını belirtiyor. Bu güçlü bir alışkanlıktır.',
        tipsStudent: ['Anladığın konuları kendini sınayarak pekiştir; anlamak ile hatırlamak birbirini tamamlar.', 'Merak ettiğin konularda ders kitabının ötesine geçen kaynaklar ara.'],
        tipsParent: ['Merakını besleyen kitaplar, belgeseller ve etkinlikler önerin.', 'Onun anlattıklarını dinlemeye zaman ayırın.'],
      },
    ),
    focus: three(
      {
        summary: 'Dikkat kolay dağılıyor',
        student:
          'Ders çalışırken dikkatin telefon, bildirimler ya da başka düşünceler yüzünden sık sık dağılıyor. Bu çok yaygın ve ortamda yapacağın küçük değişiklikler büyük fark yaratabilir.',
        parent:
          'Çocuğunuz ders çalışırken dikkatinin sık sık dağıldığını belirtiyor. Dikkat dağıtıcıları ortamdan uzaklaştırmak, yalnızca irade gücüne güvenmekten genellikle daha etkilidir.',
        tipsStudent: [
          'Çalışırken telefonunu başka bir odaya koy; yalnızca molada bak.',
          '25 dakika çalışıp 5 dakika mola ver; molada ekrana bakmamaya çalış.',
        ],
        tipsParent: [
          'Evde çalışma saatlerinde telefonların bir yerde toplandığı bir aile kuralı koymayı düşünün.',
          'Sessiz ve düzenli bir çalışma köşesi hazırlamasına yardım edin.',
        ],
      },
      {
        summary: 'Değişken odaklanma',
        student: 'Bazen dikkatini toplayabiliyor, bazen dağılıyorsun. Çalışma ortamını düzenlemek odaklanmanı kolaylaştırabilir.',
        parent: 'Çocuğunuz ders çalışırken zaman zaman odaklanabildiğini, zaman zaman dikkatinin dağıldığını belirtiyor.',
        tipsStudent: ['Çalışmaya başlamadan önce masandan ilgisiz her şeyi kaldır.', 'Bildirimleri çalışma saatlerinde kapat.'],
        tipsParent: ['Çalışma saatlerinde ev içindeki gürültüyü azaltmaya çalışın.', 'Molalarını ekran yerine hareketle geçirmesini önerin.'],
      },
      {
        summary: 'Dikkat dağıtıcıları iyi yöneten',
        student: 'Dikkat dağıtıcıları uzak tutabiliyor ve çalışırken dikkatini toplayabiliyorsun.',
        parent: 'Çocuğunuz dikkat dağıtıcıları uzak tutabildiğini ve çalışırken odaklanabildiğini belirtiyor.',
        tipsStudent: ['Uzun çalışmalarda düzenli molalar vermeyi unutma.', 'Zor konuları dikkatinin en iyi olduğu saatlere koy.'],
        tipsParent: ['Bu alışkanlığı fark ettiğinizi söyleyin.', 'Yeterli uyku ve düzenli molaların odaklanmayı desteklediğini hatırlatın.'],
      },
    ),
    help: three(
      {
        summary: 'Takılınca çoğu zaman sormadan geçen',
        student:
          'Takıldığında ya da yanlış yaptığında çoğu zaman üzerinde durmadan geçiyorsun. Yanlışlar ve sorular, öğrenmenin en değerli fırsatlarıdır.',
        parent:
          'Çocuğunuz takıldığında ya da yanlış yaptığında çoğu zaman yardım istemeden geçtiğini belirtiyor. Soru sormak ve hatalardan öğrenmek, öğrenmenin önemli bir parçasıdır.',
        tipsStudent: [
          'Her sınavdan ya da denemeden sonra yanlışlarını bir deftere yaz: neyi, neden yanlış yaptın?',
          'Anlamadığın bir şeyi aynı gün öğretmenine ya da bir arkadaşına sor.',
        ],
        tipsParent: [
          'Soru sormanın bir zayıflık değil, güçlü bir öğrenme davranışı olduğunu söyleyin.',
          'Yanlışlarını cezalandırmak yerine “Buradan ne öğrendin?” diye sorun.',
        ],
      },
      {
        summary: 'Zaman zaman yardım isteyen',
        student: 'Bazen yanlışlarını inceliyor ve yardım istiyorsun. Bunu bir alışkanlık hâline getirmek, aynı hataları tekrarlama olasılığını azaltabilir.',
        parent: 'Çocuğunuz bazen yanlışlarını incelediğini ve yardım istediğini belirtiyor.',
        tipsStudent: ['Yanlış yaptığın soruları birkaç gün sonra yeniden çöz.', 'Takıldığında önce ne bildiğini yaz, sonra soruyu sor.'],
        tipsParent: ['Soru sorabileceği kişileri ve kaynakları birlikte belirleyin.', 'Hatalarını paylaştığında sakin ve meraklı bir tutum gösterin.'],
      },
      {
        summary: 'Soran ve hatasından öğrenen',
        student: 'Takıldığında soruyor, farklı kaynaklara başvuruyor ve yanlışlarından öğreniyorsun. Bu, bağımsız öğrenmenin temelidir.',
        parent: 'Çocuğunuz takıldığında soru sorduğunu, farklı kaynaklara başvurduğunu ve yanlışlarından öğrendiğini belirtiyor.',
        tipsStudent: ['Öğrendiğini başkalarına anlatarak hem onlara hem kendine yardım et.', 'Kaynak seçerken güvenilir olanları tercih et.'],
        tipsParent: ['Bu tutumu takdir ettiğinizi söyleyin.', 'Güvenilir kaynakları ayırt etmesi için birlikte konuşun.'],
      },
    ),
  },
};
