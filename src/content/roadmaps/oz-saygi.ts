import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * Öz-saygı Ölçeği: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öz-saygıyı yükseltmek ders başarısını artırmaz (Baumeister ve ark., 2003); yol haritası başarı vaat etmez.
 *    Kendine bakışın, zorlanınca kişinin kendine nasıl davrandığını etkileyebileceği anlatılır.
 *  - Veliye öneriler "Öz-saygı nedir?" rehber yazısındaki önerilerle aynı çizgidedir: abartılı övgü yerine çabayı ve
 *    yöntemi somut olarak takdir etmek (Brummelman ve ark., 2014), karşılaştırmamak, dinlemek, gerçek sorumluluk
 *    vermek, hata yapmaya alan açmak. O yazıya her raporda bağlantı verilir.
 *  - Tek boyutlu test: üç boyutlu profil ve ortamlar bölümü yoktur; 3. hafta şablondaki ek denemedir ("Gerçek bir
 *    sorumluluk"). Düşük düzeyde raporun kendi destek kutusu gösterilir; yol haritası onu tekrar etmez.
 *  - Rapor metinleri tekrar edilmez; tanı koyan ya da korkutan dil kullanılmaz. Test yetişkinlere açık değildir.
 */
export const ozSaygiRoadmap: RoadmapTemplate = {
  version: 'oz-saygi-yol-haritasi-1',
  planningScale: 'self_esteem',
  planningTitle: 'Kendine bakış',
  extraWeek: {
    title: 'Gerçek bir sorumluluk',
    text: {
      student:
        'Bu hafta baştan sona kendin yürüteceğin küçük ama gerçek bir iş üstlen (ör. bir yemeği hazırlamak ya da bir aile işini yürütmek); bitirince neyi iyi yaptığını yaz.',
      parent:
        'Bu hafta çocuğunuza baştan sona kendisinin yürüteceği gerçek bir sorumluluk verin (ör. bir yemeği hazırlamak); bitince neyi iyi yaptığını birlikte konuşun.',
    },
  },
  links: [{ label: 'Öz-saygı nedir?', href: '/rehber/oz-saygi-nedir' }],
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Öz-saygı ile ders başarısı arasındaki ilişki zayıftır; ama kendine bakışın, zorlandığın anlarda kendine nasıl davrandığını etkileyebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Öz-saygı ile ders başarısı arasındaki ilişki zayıftır; ama çocuğunuzun kendine bakışı, zorlandığı anlarda kendine nasıl davrandığını etkileyebilir.',
  },
  firstWeek: {
    student:
      'Raporundaki sonucu düşün. Bu hafta kendinle ilgili düşüncelerinin hangi durumlarda olumlu, hangilerinde olumsuz olduğunu fark et ve iki üç cümleyle bir deftere yaz.',
    parent: bf.firstWeek.parent,
  },
  lastWeek: bf.lastWeek,
  nextTests: bf.nextTests,
  approach: {
    self_esteem: {
      low: 'Sevginizin notlara bağlı olmadığını hissettirin; başarısızlık anlarında sakin ve sıcak kalın.',
      average: 'Onu kardeşleriyle ya da arkadaşlarıyla karşılaştırmaktan kaçının.',
      high: 'Emeğini takdir etmeye devam edin; sağlıklı öz-saygının hataları kabul edebilmeyi de içerdiğini konuşabilirsiniz.',
    },
  },
  scales: {
    self_esteem: {
      color: '#df4777',
      study: {
        low: {
          student:
            'Kendine bakışın, çalışırken takıldığın anlarda “Ben yapamam” düşüncesine dönüşebilir. Böyle anlarda zor işi küçük parçalara böl ve yalnızca ilk adıma odaklan; ilerlemeni başkalarıyla değil kendi geçen haftanla karşılaştır. Takıldığında güvendiğin birinden yardım istemek de bir güçtür.',
          parent:
            'Çocuğunuzun kendine eleştirel bakışı, çalışırken takıldığı anlarda “Ben yapamam” düşüncesine dönüşebilir. Zor işleri küçük parçalara bölmesine yardım etmek ve ilerlemesini başkalarıyla değil kendi geçen haftasıyla karşılaştırmak işini kolaylaştırabilir. Abartılı övgü yerine çabasını ve yöntemini somut olarak takdir edin.',
        },
        average: {
          student:
            'Zorlandığın günlerde kendinden şüphe duyabilirsin. Böyle günlerde daha önce zorlanıp sonra başardığın bir konuyu hatırla. Çalışırken küçük hedefler koyup tamamladıklarını işaretlemek ilerlemeni görünür kılar.',
          parent:
            'Çocuğunuz zorlandığı günlerde kendinden şüphe duyabilir. Daha önce zorlanıp sonra başardığı bir şeyi birlikte hatırlamak ve küçük hedeflerini tamamladıkça işaretlemesini önermek ilerlemesini görünür kılar.',
        },
        high: {
          student:
            'Kendine olumlu bakman, zor bir konuya girişmeyi kolaylaştırabilir. Bu güveni yeni şeyler denemek için kullan: biraz zorlayan sorular seç ve yanlışlarını öğrenmenin bir parçası olarak gör. Hata yaptığında da kendine aynı nezaketi göster.',
          parent:
            'Çocuğunuzun kendine olumlu bakışı, zor bir konuya girişmesini kolaylaştırabilir. Biraz zorlayan işler seçmesini destekleyin; yanlışlarını öğrenmenin bir parçası olarak görmesine yardım edin.',
        },
      },
      action: {
        low: {
          student:
            'Bu hafta her akşam o gün iyi giden ya da emek verdiğin küçük bir şeyi yaz. Kendini eleştirdiğin bir an olursa, aynı durumdaki bir arkadaşına ne söyleyeceğini düşün ve aynısını kendine söyle.',
          parent:
            'Bu hafta çocuğunuz kendisi hakkında olumsuz konuştuğunda hemen itiraz etmeden önce dinleyin: “Bugün kendini böyle hissetmene ne sebep oldu?” diye sorun.',
        },
        average: {
          student: 'Bu hafta kendini başkalarıyla değil, geçen haftaki hâlinle karşılaştır: her gün öncekine göre daha iyi yaptığın bir şeyi yaz.',
          parent: 'Bu hafta çocuğunuzun çabasını ve yöntemini somut bir cümleyle takdir edin (ör. “Bu problemi çözmek için üç farklı yol denedin.”).',
        },
        high: {
          student: 'Bu hafta biraz zorlayacağını bildiğin yeni bir şey dene; başaramazsan bir dahaki sefere neyi farklı yapacağını yaz.',
          parent: 'Bu hafta çocuğunuzun zor bir işe girişmesine fırsat verin; başaramazsa “Bir dahaki sefere neyi farklı yaparsın?” diye sorun.',
        },
      },
    },
  },
  sources: [
    bf.sources[0],
    {
      text: 'Baumeister, R. F., Campbell, J. D., Krueger, J. I. ve Vohs, K. D. (2003). Does high self-esteem cause better performance, interpersonal success, happiness, or healthier lifestyles? Psychological Science in the Public Interest, 4(1), 1–44.',
      url: 'https://doi.org/10.1111/1529-1006.01431',
    },
    {
      text: 'Brummelman, E., Thomaes, S., Orobio de Castro, B., Overbeek, G. ve Bushman, B. J. (2014). “That’s not just beautiful—that’s incredibly beautiful!”: The adverse impact of inflated praise on children with low self-esteem. Psychological Science, 25(3), 728–735.',
      url: 'https://doi.org/10.1177/0956797613514251',
    },
  ],
};
