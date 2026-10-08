import type { Citation } from '@/lib/instruments/types';
import { KAYNAK } from './kaynaklar';
import type { AudienceText } from './types';

/**
 * Sesli Okuma Değerlendirmesi: gelişim yol haritası metinleri (kurulum lib/reports/oral-roadmap.ts).
 *
 * İlkeler:
 *  - Akıcı okuma; doğru, yeterince hızlı ve anlama uygun vurgu ve tonlamayla okumaktır (National Reading Panel, 2000).
 *    Okuduğunu anlamak, kelimeleri rahat çözebilmek ile dili anlamanın birleşimidir (Gough ve Tunmer, 1986).
 *  - Bir yetişkinle birlikte ve onu örnek alarak okumak tek başına okumaktan daha etkilidir (Kuhn ve Stahl, 2003).
 *    Hızlı okuma teknikleri önerilmez: anlamayı azaltır (Rayner ve ark., 2016).
 *  - Öneriler okumanın dört yönüne göre yazıldı ve en çok çalışılacak yönden başlayarak sıralanır; rapordaki metinler
 *    tekrar edilmez. Tanı koyan, korkutan ya da kesin hüküm veren dil kullanılmaz. Değerlendirme yetişkinlere açık değildir.
 *  - Otomatik analizde (cihazdaki yapay zekâ; yetişkin dinlemez) akıcılık yönü yoktur; metinler yetişkinin okumayı
 *    dinlediğini ya da işaretlediğini anlatmaz.
 */

export type OralAspect = 'accuracy' | 'prosody' | 'comprehension' | 'retell';

export interface OralRoadmapTemplate {
  version: string;
  aspects: Record<OralAspect, { title: string; color: string; need: AudienceText; full: AudienceText; action: AudienceText }>;
  habits: { title: string; intro: AudienceText; items: { student: string[]; parent: string[] }; note: AudienceText };
  approach: Record<'low' | 'average' | 'high', { title: string; text: string }[]>;
  firstWeek: AudienceText;
  /** Çalışılacak ikinci bir yön yoksa üçüncü hafta: metnin düzeyine göre. */
  thirdWeek: Record<'hard' | 'support' | 'easy', { title: string; text: AudienceText }>;
  /** Hiçbir yön çalışma gerektirmiyorsa ikinci hafta. */
  extraWeek: { title: string; text: AudienceText };
  lastWeek: { same: AudienceText; up: AudienceText };
  nextTests: string[];
  nextPurpose: { you: string; parent: string };
  /** Otomatik analizde girişin son cümlesi: önerilerin neye dayandığı. */
  autoBasis: AudienceText;
  sources: Citation[];
}

export const sesliOkumaRoadmap: OralRoadmapTemplate = {
  version: 'sesli-okuma-yol-haritasi-1',
  aspects: {
    accuracy: {
      title: 'Kelimeleri doğru okuma',
      color: '#2f5ce0',
      need: {
        student:
          'Zorlandığın kelimeleri bir kâğıda yaz. Her birini önce hecelerine ayırarak, sonra bütün olarak oku; ardından kelimeyi metindeki cümlesiyle birlikte bir kez daha oku. Uzun kelimelerde önce kökü, sonra ekleri bulmak işini kolaylaştırır.',
        parent:
          'Raporda işaretli kelimeleri bir kâğıda yazın. Her birini önce hecelerine ayırarak, sonra bütün olarak okumasını; ardından kelimeyi cümlesi içinde yeniden okumasını isteyin. Uzun kelimelerde önce kökü, sonra ekleri birlikte bulmak çözümlemeyi kolaylaştırır. Zorlandığı kelimelerin ortak bir özelliği varsa (ör. hep ekler ya da benzer harfler) öğretmeniyle paylaşın.',
      },
      full: {
        student: 'Kelimeleri doğru okuyorsun. Biraz daha uzun ve yeni kelimelerin geçtiği metinler okuyarak bu beceriyi sağlam tutabilirsin.',
        parent: 'Kelimeleri doğru okuyor. Biraz daha uzun ve yeni kelimelerin geçtiği metinler bu beceriyi sağlam tutar.',
      },
      action: {
        student: 'Bu hafta her gün okuduğun metinden zorlandığın üç kelimeyi seç; hecelerine ayırarak ve bütün olarak oku, sonra her birini bir cümlede kullan.',
        parent: 'Bu hafta her gün birlikte okuduğunuz metinden zorlandığı üç kelimeyi seçin; hecelerine ayırarak ve bütün olarak okusun, sonra her birini bir cümlede kullansın.',
      },
    },
    prosody: {
      title: 'Akıcılık ve tonlama',
      color: '#7a4ee6',
      need: {
        student:
          'Kısa bir paragrafı önce bir yetişkinden dinle, sonra aynı paragrafı onun gibi okumaya çalış. Noktada kısa bir dur, soru cümlelerini soruyormuş gibi, konuşmaları o kişi konuşuyormuş gibi oku. Aynı paragrafı birkaç kez okudukça daha akıcı okuduğunu fark edeceksin.',
        parent:
          'Kısa bir paragrafı önce siz anlama uygun bir tonlamayla okuyun, sonra aynı paragrafı onun okumasını isteyin. Bir yetişkini örnek alarak, onunla birlikte okumak tek başına okumaktan daha etkilidir (Kuhn ve Stahl, 2003). Noktalarda durmaya ve soru cümlelerinin tonlamasına birlikte dikkat edin.',
      },
      full: {
        student: 'Anlamına uygun bir tonlamayla, akıcı okuyorsun. Bir öyküyü karakterlerin sesiyle okuyup bir yetişkine dinletmek bu beceriyi keyifle geliştirir.',
        parent: 'Anlama uygun bir tonlamayla, akıcı okuyor. Kısa öyküleri karakterlerin sesiyle okuyup size dinletmesi bu beceriyi keyifle geliştirir.',
      },
      action: {
        student: 'Bu hafta her gün kısa bir paragrafı önce dinle, sonra üç kez sesli oku; her okumada noktalarda durmaya ve soru cümlelerinin tonlamasına dikkat et.',
        parent: 'Bu hafta her gün kısa bir paragrafı önce siz okuyun, sonra o iki üç kez sesli okusun; noktalarda durmasına ve soru cümlelerinin tonlamasına birlikte dikkat edin.',
      },
    },
    comprehension: {
      title: 'Okuduğunu anlama',
      color: '#0e9c8c',
      need: {
        student:
          'Okurken ara ara dur ve "Burada ne anlatılıyor?" diye kendine sor. Metni bitirince bir cümleyle özetle. Bilmediğin kelimelerin anlamını önce cümleden tahmin et, sonra sözlükten bak.',
        parent:
          'Okuduktan sonra "Sence neden böyle oldu?", "Bu metni bir cümleyle nasıl özetlersin?" gibi sorular sorun. Bilmediği kelimelerin anlamını önce birlikte cümleden tahmin edip sonra sözlükten kontrol etmek kelime bilgisini de geliştirir.',
      },
      full: {
        student: 'Okuduğunu iyi anlıyorsun. Okuduğun bir metin hakkında "Yazar bunu neden böyle yazmış olabilir?" diye düşünmek anlamanı daha da derinleştirir.',
        parent: 'Okuduğunu iyi anlıyor. Okuduğu metinler hakkında farklı yorumları birlikte konuşmanız bu beceriyi derinleştirir.',
      },
      action: {
        student: 'Bu hafta her gün okuduğun metni bitirince kitaba bakmadan bir cümlelik özet yaz ve metindeki bilmediğin bir kelimeyi sözlükten bul.',
        parent: 'Bu hafta her gün okuduğu metin hakkında ona iki soru sorun: biri metinde yazanı, öteki metinde yazmayıp ipuçlarından anlaşılanı soran.',
      },
    },
    retell: {
      title: 'Yeniden anlatma',
      color: '#d28a14',
      need: {
        student:
          'Okuduğun bir öyküyü birine anlatırken "Önce ne oldu, sonra ne oldu, en sonunda ne oldu?" sırasını izle. Bilgilendirici bir metinde önce en önemli bilgiyi, sonra onu destekleyen iki ayrıntıyı söyle.',
        parent:
          'Okuduğu bir metni size anlatmasını isteyin. Öykülerde "Önce ne oldu, sonra ne oldu, sonunda ne oldu?", bilgilendirici metinlerde "En önemli bilgi neydi?" sorularıyla sırayı ve ana fikri kurmasına yardım edin.',
      },
      full: {
        student: 'Okuduğunu kendi cümlelerinle iyi anlatıyorsun. Okuduğun bir kitabı arkadaşlarına tanıtmak bu beceriyi daha da geliştirir.',
        parent: 'Okuduğunu kendi cümleleriyle iyi anlatıyor. Okuduğu bir kitabı ailesine ya da arkadaşlarına tanıtmasına fırsat verin.',
      },
      action: {
        student: 'Bu hafta her gün okuduğun bir bölümü bir yetişkine üç cümleyle anlat: başta ne oldu, ortada ne oldu, sonda ne oldu?',
        parent: 'Bu hafta her akşam okuduğu bölümü size üç cümleyle anlatmasını isteyin: başta, ortada ve sonda ne oldu?',
      },
    },
  },
  habits: {
    title: 'Okuma alışkanlığı için',
    intro: {
      student: 'Okumak en çok okudukça gelişir. Şunlar işini kolaylaştırır:',
      parent: 'Okumak en çok okudukça gelişir. Şunlar çocuğunuzun işini kolaylaştırır:',
    },
    items: {
      student: [
        'Her gün aynı saatte, kısa da olsa oku; on dakika bile yeter.',
        'Sana uygun kitaplar seç: Bir sayfada bilmediğin kelime çok değilse o kitap sana göredir.',
        'Sevdiğin konularda kitap ve dergi seç: Okumak bir yarış değil, keyifli bir alışkanlık.',
        'Hızlı okuma tekniklerine ihtiyacın yok: Hız, bol okudukça ve kelime bilgin genişledikçe kendiliğinden artar.',
      ],
      parent: [
        'Evde kısa ve düzenli bir okuma zamanı belirleyin; sizin de okuduğunuzu görmesi iyi bir örnek olur.',
        'Rahat okuyabildiği, bilmediği kelimenin az olduğu kitaplar seçmesine yardım edin; daha zor kitapları birlikte okuyun.',
        'Okumayı bir yarışa ya da cezaya çevirmeyin: Kronometreyle yapılan baskılı çalışmalar okumayı sevimsiz hâle getirebilir.',
        'Hızlı okuma kurslarına gerek yoktur: Bu teknikler anlamayı azaltır; hız, bol okudukça ve kelime bilgisi genişledikçe artar (Rayner ve ark., 2016).',
      ],
    },
    note: {
      student: 'Bu öneriler tek bir metnin sesli okunmasına dayanır; okulda ve evde fark ettiklerinle birlikte değerlendir.',
      parent: 'Bu öneriler tek bir metnin sesli okunmasına dayanır; okulda ve evde gözlediklerinizle birlikte değerlendirin.',
    },
  },
  approach: {
    low: [
      {
        title: 'Destekli okuma',
        text: 'Kısa bir metni önce siz sesli okuyun, sonra aynı metni o okusun ya da aynı anda birlikte okuyun. Bir yetişkini örnek alarak okumak tek başına okumaktan daha etkilidir.',
      },
      {
        title: 'Doğru zorlukta metin',
        text: 'Rahat ya da destekle okuyabildiği düzeydeki metinlerle çalışın; zor metinlerle zorlamak okumayı sevimsiz hâle getirebilir.',
      },
      {
        title: 'Her hatayı düzeltmeyin',
        text: 'Okurken her hatada durdurmak yerine anlamı bozan hatalara odaklanın; kendi fark edip düzelttiği yerleri takdir edin.',
      },
      {
        title: 'Öğretmenle birlikte',
        text: 'Bu raporu ve gözlemlerinizi sınıf öğretmeniyle paylaşın; okuldaki çalışmalarla evdekiler birbirini tamamlar.',
      },
    ],
    average: [
      {
        title: 'Sırayla okuma',
        text: 'Bir paragrafı siz, bir paragrafı o okusun; tonlamanızı örnek alır, okuma da bir yük olmaktan çıkar.',
      },
      {
        title: 'Okuduktan sonra konuşun',
        text: 'Okuduğu metni size kendi cümleleriyle anlatmasını isteyin; eksik kalan yerleri sorularla birlikte tamamlayın.',
      },
      {
        title: 'Kelime merakı',
        text: 'Bilmediği kelimelerin anlamını birlikte tahmin edip sözlükten kontrol etmeyi bir oyuna dönüştürün.',
      },
    ],
    high: [
      {
        title: 'Daha zengin metinler',
        text: 'Rahat okuduğu için biraz daha uzun ve farklı türlerde metinler (bilim yazısı, biyografi, şiir) önerebilirsiniz.',
      },
      {
        title: 'Sesli okuma keyfi',
        text: 'Küçük bir kardeşine ya da ailesine kitaptan sesli okuma yapması hem akıcılığını hem okuma sevgisini besler.',
      },
    ],
  },
  firstWeek: {
    student: 'Bu hafta her gün on dakika bir yetişkinle birlikte oku: Önce o bir paragraf okusun, sonra aynı paragrafı sen oku.',
    parent: 'Bu hafta her gün on dakika birlikte okuyun: Önce siz bir paragraf okuyun, sonra aynı paragrafı o okusun.',
  },
  thirdWeek: {
    hard: {
      title: 'Kolay metinlerle',
      text: {
        student: 'Bu hafta sana kolay gelen kısa bir metni her gün iki üç kez sesli oku; rahatladıkça biraz daha uzun metinlere geç.',
        parent: 'Bu hafta ona kolay gelen kısa bir metni her gün iki üç kez sesli okusun; rahatladıkça metinleri adım adım uzatın.',
      },
    },
    support: {
      title: 'Karakterleri seslendirme',
      text: {
        student: 'Bu hafta kısa bir öyküyü bir yetişkinle paylaşarak oku: Her biriniz bir karakteri seslendirsin, karakterin duygusunu sesine yansıt.',
        parent: 'Bu hafta kısa bir öyküde karakterleri paylaşarak okuyun: Siz bir karakteri, o başka bir karakteri seslendirsin. Bu tür okuma tonlamayı keyifle geliştirir.',
      },
    },
    easy: {
      title: 'Bir adım ileri',
      text: {
        student: 'Bu hafta biraz daha uzun ya da yeni kelimelerin çok geçtiği bir kitap seç; zorlandığın yerleri bir yetişkinle birlikte oku.',
        parent: 'Bu hafta biraz daha uzun ya da yeni kelimelerin çok geçtiği bir kitap seçin; zorlandığı yerleri birlikte okuyun.',
      },
    },
  },
  extraWeek: {
    title: 'Yeni türler',
    text: {
      student: 'Bu hafta daha önce az okuduğun bir türde (ör. bilim yazısı, biyografi ya da şiir) bir metin seç ve bir yetişkine sesli oku.',
      parent: 'Bu hafta daha önce az okuduğu bir türde (ör. bilim yazısı ya da biyografi) bir metin seçin; size sesli okusun, sonra konuşun.',
    },
  },
  lastWeek: {
    same: {
      student: 'Ayın sonunda Sesli Okuma Değerlendirmesini aynı sınıf düzeyinden başka bir metinle yeniden yap ve iki raporu karşılaştır: Nerede ilerledin?',
      parent: 'Ayın sonunda Sesli Okuma Değerlendirmesini aynı sınıf düzeyinden başka bir metinle yeniden yapın ve iki raporu karşılaştırın; ilerlemeyi birlikte konuşun.',
    },
    up: {
      student: 'Ayın sonunda Sesli Okuma Değerlendirmesini bir üst sınıfın metinlerinden biriyle yap ve iki raporu karşılaştır.',
      parent: 'Ayın sonunda Sesli Okuma Değerlendirmesini bir üst sınıfın metinlerinden biriyle yapın ve iki raporu karşılaştırın.',
    },
  },
  nextTests: ['okuma-hizi-ve-anlama'],
  nextPurpose: { you: 'sessiz okumada hızını ve anlamanı görmek', parent: 'sessiz okumadaki hızını ve anlamasını görmek' },
  autoBasis: {
    student: 'Öneriler, tek bir metni sesli okumanın yapay zekâyla yapılan otomatik analizine dayanır; sonuçlar yaklaşık olduğu için kesin hüküm değildir.',
    parent: 'Öneriler, tek bir metnin sesli okunmasının yapay zekâyla yapılan otomatik analizine dayanır; sonuçlar yaklaşık olduğu için kesin hüküm değildir.',
  },
  sources: [KAYNAK.nrp, KAYNAK.kuhn, KAYNAK.gough, KAYNAK.rayner],
};
