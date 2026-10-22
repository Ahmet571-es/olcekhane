import { KAYNAK } from './kaynaklar';
import type { ReadingRoadmapTemplate } from './types';

/**
 * Okuma Hızı ve Anlama: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Okuduğunu anlamak, kelimeleri akıcı okuyabilmek ile dili anlamanın birleşimidir (Gough ve Tunmer, 1986). Öneriler
 *    soru türlerine (bilgiyi bulma, çıkarım, kelime anlamı, ana fikir) ve hız ile anlamanın dengesine göre yazıldı.
 *  - Akıcılık için destekli ve tekrarlı okuma önerilir (Kuhn ve Stahl, 2003; National Reading Panel, 2000). Hızlı
 *    okuma teknikleri önerilmez: hız artarken anlama genellikle düşer; hız, okuma deneyimi ve kelime bilgisiyle artar
 *    (Rayner ve ark., 2016).
 *  - Her soru türü bir ile üç soruyla ölçülür; rozet yalnızca sayıyı söyler, düzey adı verilmez.
 *  - Rapordaki metinler ve öneriler tekrar edilmez; tanı koyan dil kullanılmaz. Test yetişkinlere açık değildir.
 *  - Test 3. sınıftan mezunlara kadar açıktır ve metinler sınıfa göre ayrılmaz: veli önerileri her yaşa uyacak biçimde
 *    yazılır; yalnızca küçük çocuklara uyan bir öneri "küçük yaştaysa" diye ayrıca verilir.
 */
export const okumaRoadmap: ReadingRoadmapTemplate = {
  version: 'okuma-yol-haritasi-1',
  skills: {
    literal: {
      color: '#2f5ce0',
      need: {
        student:
          'Paragraf paragraf ilerle: her paragrafın sonunda dur ve kitaba bakmadan o paragraftaki en önemli bilgiyi kendine söyle. Hatırlayamadığın yerde geri dönüp yeniden oku; böylece okurken ayrıntılara dikkat etmeye alışırsın.',
        parent:
          'Çocuğunuzdan paragraf paragraf ilerlemesini ve her paragrafın sonunda kitaba bakmadan o paragraftaki en önemli bilgiyi söylemesini isteyebilirsiniz. Hatırlayamadığı yere geri dönüp yeniden okuması ayrıntılara dikkat etmesini kolaylaştırır.',
      },
      full: {
        student: 'Bu testteki metin bilgisi sorularını doğru cevapladın: metindeki bilgileri hatırlamakta zorlanmadın. Bilgilendirici metinlerdeki bilgileri bir tablo ya da şemayla özetlemek bu beceriyi bir adım ileri taşır.',
        parent: 'Çocuğunuz bu testteki metin bilgisi sorularını doğru cevapladı: metindeki bilgileri hatırlamakta zorlanmadı. Bilgilendirici metinlerdeki bilgileri bir tablo ya da şemayla özetlemesini önerebilirsiniz.',
      },
      action: {
        student: 'Bu hafta her gün kısa bir bilgilendirici yazı oku; bitirince kitaba bakmadan üç bilgiyi yaz, sonra metinden kontrol et.',
        parent: 'Bu hafta çocuğunuz her gün kısa bir bilgilendirici yazı okusun; sonra ona metinden üç bilgi sorun ve cevaplarını birlikte metinden kontrol edin.',
      },
    },
    inference: {
      color: '#7a4ee6',
      need: {
        student:
          'Çıkarım, metinde açıkça yazmayanı ipuçlarından anlamaktır. Okurken "Yazar bunu neden söyledi?" ya da "Bundan sonra ne olabilir?" diye sor ve cevabını metindeki bir cümleye dayandır.',
        parent:
          'Çıkarım, metinde açıkça yazmayanı ipuçlarından anlamaktır. Birlikte okuduğunuz bir öyküde ya da haberde "Bundan sonra ne olabilir, bunu nereden anladın?" diye sorabilir, cevabını metindeki bir cümleye dayandırmasını isteyebilirsiniz.',
      },
      full: {
        student: 'Bu testteki çıkarım sorularını doğru cevapladın. Okuduğun bir metin için farklı yorumlar düşünüp hangisinin metne daha iyi uyduğunu tartışmak bu beceriyi derinleştirir.',
        parent: 'Çocuğunuz bu testteki çıkarım sorularını doğru cevapladı. Okuduğu metinler hakkında farklı yorumları birlikte tartışmanız bu beceriyi derinleştirir.',
      },
      action: {
        student: 'Bu hafta okuduğun bir öyküde ya da haberde açıkça yazmayan üç şeyi çıkar ve her birinin hangi cümleden anlaşıldığını yaz.',
        parent: 'Bu hafta çocuğunuzla okuduğu bir öykü ya da haber üzerine konuşurken ona "Bu kişi neden böyle davrandı, bunu nereden anladın?" diye sorun.',
      },
    },
    vocabulary: {
      color: '#0e9c8c',
      need: {
        student:
          'Yeni kelimeleri bir kelime defterinde topla: kelimeyi, geçtiği cümleyi ve kendi kuracağın bir cümleyi yaz. Kelimenin kökü ve ekleri de anlamı hakkında ipucu verir (ör. "sevgisiz" = sevgi + -siz). Farklı türlerde bol okumak kelime bilgisini genişletmenin en doğal yoludur.',
        parent:
          'Çocuğunuzun yeni kelimeleri bir defterde toplamasını ve her birini kendi cümlesinde kullanmasını destekleyin. Gündelik konuşmalarda yeni kelimeler kullanmanız ve farklı türlerde okuması kelime bilgisini genişletir.',
      },
      full: {
        student: 'Kelimelerin anlamını bulmakta zorlanmadın. Eş anlamlı ve yakın anlamlı kelimeler arasındaki ince farkları fark etmek ve yazılarında kullanmak bu beceriyi zenginleştirir.',
        parent: 'Çocuğunuz bu testteki kelime sorularını doğru cevapladı. Yeni kelimeleri konuşmada ve yazıda kullanmasını destekleyebilirsiniz.',
      },
      action: {
        student: 'Bu hafta okuduğun metinlerden her gün iki yeni kelime seç; kelime defterine anlamlarını yaz ve her birini kendi cümlende kullan.',
        parent: 'Bu hafta çocuğunuzla her akşam okuduğu metinden yeni bir kelimeyi konuşun ve gün içinde o kelimeyi birlikte kullanmaya çalışın.',
      },
    },
    main_idea: {
      color: '#d28a14',
      need: {
        student:
          'Ana fikir, yazarın metinle asıl anlatmak istediğidir. Bir metni bitirince "Bu metin en çok ne hakkındaydı, yazar ne söylemek istedi?" diye sor; cevabını başlığa ve paragrafların ilk cümlelerine bakarak kontrol et.',
        parent:
          'Ana fikir, yazarın metinle asıl anlatmak istediğidir. Çocuğunuzdan okuduğu bir metne kendi başlığını koymasını isteyebilirsiniz; metne uygun bir başlık bulmak ana fikri bulmanın kolay bir yoludur.',
      },
      full: {
        student: 'Metnin ana fikrini doğru buldun. Bir metni okuduktan sonra ana fikri ve onu destekleyen iki ayrıntıyı bir şemayla göstermek bu beceriyi güçlendirir.',
        parent: 'Çocuğunuz metnin ana fikrini doğru buldu. Okuduğu metinlerin ana fikrini ve onu destekleyen ayrıntıları kısa bir şemayla göstermesini önerebilirsiniz.',
      },
      action: {
        student: 'Bu hafta her gün okuduğun bir metne kendi başlığını koy; sonra metnin asıl başlığıyla karşılaştır ve hangisinin metni daha iyi anlattığını düşün.',
        parent: 'Bu hafta çocuğunuzdan okuduğu metinlere kendi başlığını koymasını isteyin ve neden o başlığı seçtiğini konuşun.',
      },
    },
  },
  pace: {
    rush: {
      text: {
        student:
          'Metni çok hızlı geçtin. Okurken hızdan çok anlamaya odaklan: her paragrafın sonunda kısa bir an durup ne anlatıldığını kendine söylemek okumanı daha dikkatli yapar.',
        parent:
          'Çocuğunuz metni çok hızlı geçmiş görünüyor. Okurken hızdan çok anlamaya odaklanması için paragraf aralarında kısa duraklar vermesini ve ne anlatıldığını kendine söylemesini önerebilirsiniz.',
      },
      week: {
        title: 'Yavaşla ve anla',
        text: {
          student: 'Bu hafta her gün kısa bir metni bilerek yavaş oku; her paragraftan sonra durup ne anlatıldığını bir cümleyle söyle.',
          parent: 'Bu hafta çocuğunuzla her gün kısa bir metni acele etmeden okuyun; her paragraftan sonra ne anlatıldığını size bir cümleyle söylemesini isteyin.',
        },
      },
    },
    // Metin çok kısa sürede geçildi ama soruların çoğu doğru: hız ölçülemedi, anlama sonucu ön bilgiyi gösterebilir.
    skim: {
      text: {
        student:
          'Metni çok kısa sürede geçtiğin için hızın ölçülemedi. Soruların çoğunu doğru cevaplaman, konuyu önceden bildiğini gösterebilir. Bir sonraki okumanda metni baştan sona, her cümleyi okuyarak ilerle.',
        parent:
          'Metin çok kısa sürede geçildiği için hız ölçülemedi. Soruların çoğunun doğru cevaplanması, konunun önceden bilindiğini gösterebilir. Bir sonraki okumada metni baştan sona, her cümleyi okuyarak ilerlemesini önerebilirsiniz.',
      },
      week: {
        title: 'Yeni türler',
        text: {
          student: 'Bu hafta daha önce az okuduğun bir türde (ör. bilim yazısı, biyografi ya da şiir) bir metni baştan sona oku ve sana ne kattığını yaz.',
          parent: 'Bu hafta çocuğunuzla daha önce az okuduğu bir türde (ör. biyografi ya da bilim yazısı) bir metin seçin; baştan sona okuduktan sonra konuşun.',
        },
      },
    },
    // Hız olağan, anlama düşük ya da orta: zorluk dili anlamadadır (Gough ve Tunmer, 1986); akıcılık çalışması önerilmez.
    understand: {
      text: {
        student:
          'Okuma hızın bu metin için olağan görünüyor; zorlandığın yer anlamaktı. Okurken her paragrafın sonunda durup “Burada ne anlatıldı?” diye sor. Bilmediğin kelimelerin anlamını cümleden tahmin etmeye çalış.',
        parent:
          'Çocuğunuzun okuma hızı bu metin için olağan görünüyor; zorlandığı yer anlamaktı. Okurken her paragrafın sonunda durup “Burada ne anlatıldı?” diye sormasını önerebilirsiniz. Bilmediği kelimelerin anlamını cümleden tahmin etmeye çalışması da işe yarar.',
      },
      week: {
        title: 'Okurken soru sor',
        text: {
          student: 'Bu hafta her gün kısa bir metin oku. Okumadan önce başlığa bakıp ne anlatacağını tahmin et; bitirince tahminini metinle karşılaştır.',
          parent: 'Bu hafta çocuğunuzla her gün kısa bir metin seçin. Okumadan önce başlığa bakıp ne anlatacağını tahmin etsin; bitirince tahminini metinle karşılaştırsın.',
        },
      },
    },
    quick: {
      text: {
        student:
          'Metni oldukça hızlı okudun ama anlama soruları seni zorladı. Biraz yavaşlayıp her paragrafın sonunda ne anlatıldığını kendine söylemek anlamanı kolaylaştırabilir.',
        parent:
          'Çocuğunuz metni oldukça hızlı okumuş ama anlama soruları onu zorlamış. Biraz yavaşlayıp paragraf aralarında ne anlatıldığını kendine söylemesi anlamasını kolaylaştırabilir.',
      },
      week: {
        title: 'Yavaşla ve anla',
        text: {
          student: 'Bu hafta her gün kısa bir metni acele etmeden oku; her paragraftan sonra durup ne anlatıldığını bir cümleyle söyle.',
          parent: 'Bu hafta çocuğunuzla her gün kısa bir metni acele etmeden okuyun; her paragraftan sonra ne anlatıldığını size bir cümleyle söylemesini isteyin.',
        },
      },
    },
    build: {
      text: {
        student:
          'Akıcı okumak, kelimeleri tek tek çözmeye uğraşmadan okuyabilmektir; akıcılık arttıkça zihnin anlamaya daha çok yer açar. Kısa bir metni sesli olarak birkaç kez okumak (tekrarlı okuma), akıcılığı geliştirmenin en çok araştırılmış yollarından biridir.',
        parent:
          'Akıcı okumak, kelimeleri tek tek çözmeye uğraşmadan okuyabilmektir; akıcılık arttıkça anlamaya daha çok zihinsel kaynak kalır. Kısa bir metni sesli olarak birkaç kez okumak (tekrarlı okuma), akıcılığı geliştirmenin en çok araştırılmış yollarındandır. Küçük yaştaki çocuklar için bir yetişkinle sırayla okumak da işe yarar.',
      },
      week: {
        title: 'Tekrarlı okuma',
        text: {
          student: 'Bu hafta her gün kısa bir paragrafı sesli olarak üç kez oku; her okumada neyin kolaylaştığına dikkat et.',
          parent:
            'Bu hafta çocuğunuz her gün kısa bir paragrafı sesli olarak iki üç kez okusun. Küçük yaştaysa paragrafı önce siz okuyarak örnek olabilirsiniz; daha büyükse her okumadan sonra neyin daha kolay geldiğini kendisi fark etsin.',
        },
      },
    },
    extend: {
      text: {
        student: 'Metni anlayarak okudun. Farklı türlerde bol okumak ve kelime bilgini genişletmek, hem hızını hem anlamanı zamanla geliştirebilir.',
        parent: 'Çocuğunuz metni anlayarak okudu. Farklı türlerde bol okuması ve kelime bilgisinin genişlemesi, hem hızını hem anlamasını zamanla geliştirebilir.',
      },
      week: {
        title: 'Yeni türler',
        text: {
          student: 'Bu hafta daha önce az okuduğun bir türde (ör. bilim yazısı, biyografi ya da şiir) bir metin oku ve sana ne kattığını yaz.',
          parent: 'Bu hafta çocuğunuzla daha önce az okuduğu bir türde (ör. biyografi ya da bilim yazısı) bir metin seçin ve okuduktan sonra konuşun.',
        },
      },
    },
  },
  studyTitle: { you: 'Okuma becerilerine göre nasıl çalışabilirsin?', parent: 'Çocuğunuz okuma becerilerine göre nasıl çalışabilir?' },
  studyIntro: {
    student:
      'Sorular dört okuma becerisini yokladı. Beceriler, en çok zorlandığın beceriden başlayarak sıralandı. Her biri yalnızca bir ile üç soruyla ölçüldüğü için sonuçlar yaklaşık bir fikir verir.',
    parent:
      'Sorular dört okuma becerisini yokladı. Beceriler, en çok zorlandığı beceriden başlayarak sıralandı. Her biri yalnızca bir ile üç soruyla ölçüldüğü için sonuçlar yaklaşık bir fikir verir.',
  },
  habits: {
    title: 'Okuma alışkanlığı için',
    intro: {
      student: 'Okuma becerisi düzenli okumayla ve rehberli çalışmayla gelişir. Şunlar işini kolaylaştırır:',
      parent: 'Okuma becerisi düzenli okumayla ve rehberli çalışmayla gelişir. Şunlar çocuğunuzun işini kolaylaştırır:',
    },
    items: {
      student: [
        'Her gün aynı saatte, kısa da olsa kendi seçtiğin bir şeyi oku: kitap, dergi ya da bilgilendirici bir yazı.',
        'Farklı türler dene: öykü, bilim yazısı, biyografi, haber. Her tür farklı okuma becerileri ister.',
        'Okurken bilmediğin kelimelerin altını hafifçe çiz; okumayı bitirince anlamlarına bak.',
        'Hızlı okuma tekniklerine ihtiyacın yok: bu tekniklerde hız artarken anlama genellikle düşer. Okuma hızı, bol okudukça ve kelime bilgin genişledikçe artar.',
      ],
      parent: [
        'Evde herkesin kendi kitabını okuduğu kısa ve düzenli bir okuma zamanı belirleyin; sizin de okuduğunuzu görmesi iyi bir örnek olur.',
        'Kitap seçimini ona bırakın; ilgisini çeken bir konu okumayı sürdürmeyi kolaylaştırır.',
        'Okuduğu bir şeyi size anlatmasını isteyin; anlatmak, ana fikri ve ayrıntıları ayırmasına yardım eder.',
        'Hızlı okuma kurslarına gerek yoktur: bu tekniklerde hız artarken anlama genellikle düşer. Hız, bol okudukça ve kelime bilgisi genişledikçe artar.',
      ],
    },
    note: {
      student: 'Bu öneriler tek bir kısa metne dayanır; okulda ve evde fark ettiklerinle birlikte değerlendir.',
      parent: 'Bu öneriler tek bir kısa metne dayanır; okulda ve evde gözlediklerinizle birlikte değerlendirin.',
    },
  },
  approach: {
    low: [
      {
        title: 'Destekli okuma',
        text: 'Küçük yaştaysa kısa bir metni önce siz sesli okuyun, sonra aynı metni o okusun; bu tür destekli ve tekrarlı okuma akıcılığı geliştirmeye yardım eder. Daha büyükse ilgisini çeken kısa yazıları (ör. bir haber ya da bir dergi yazısı) birlikte seçip okuduklarınız üzerine konuşmak hem akıcılığı hem anlamayı destekler.',
      },
      {
        title: 'Baskı yapmadan',
        text: 'Okumayı bir sınav gibi değil, birlikte geçirilen bir zaman gibi görmesini sağlayın; her hatayı düzeltmek yerine anlamı bozan hatalara odaklanın.',
      },
      {
        title: 'Öğretmenle birlikte',
        text: 'Gözlemlerinizi öğretmenleriyle paylaşın; okuldaki okuma çalışmalarıyla evdekiler birbirini tamamlar.',
      },
    ],
    average: [
      {
        title: 'Okuduktan sonra konuşun',
        text: 'Okuduğu bir metni size kendi cümleleriyle anlatmasını isteyin; eksik kalan yerleri sorularla birlikte tamamlayın.',
      },
      {
        title: 'Kelime merakı',
        text: 'Bilmediği kelimelerin anlamını önce cümleden tahmin edip sonra sözlükten kontrol etmesini önerin; küçük yaştaysa bunu birlikte bir oyuna dönüştürebilirsiniz.',
      },
    ],
    high: [
      {
        title: 'Okuma listesi',
        text: 'Kendi okuma listesini oluşturmasını ve okuduklarını kısa notlarla kaydetmesini destekleyin.',
      },
      {
        title: 'Okuduklarını paylaşma',
        text: 'Okuduğu bir konuda biraz daha araştırma yapıp öğrendiklerini size anlatmasına fırsat verin.',
      },
    ],
  },
  firstWeek: {
    student: 'Bu hafta her gün ne okuduğunu, kaç dakika okuduğunu ve okuduğundan aklında kalan tek bir cümleyi bir deftere yaz.',
    parent: 'Bu hafta çocuğunuzun her gün ne ve ne kadar okuduğunu birlikte not edin; hemen bir şeyi değiştirmeye çalışmadan okuma alışkanlığını gözlemleyin.',
  },
  extraWeek: {
    title: 'Daha zorlayıcı metinler',
    text: {
      student: 'Bu hafta seni biraz zorlayacak bir metin seç (ör. bir bilim dergisinden bir yazı); okuduktan sonra ana fikrini ve en ilginç üç bilgiyi yaz.',
      parent: 'Bu hafta çocuğunuzla birlikte onu biraz zorlayacak bir metin seçin (ör. bir bilim dergisinden bir yazı) ve okuduktan sonra hakkında konuşun.',
    },
  },
  lastWeek: {
    student:
      'Dört haftanın sonunda okuma günlüğüne bak: en çok neyi okumaktan keyif aldın, hangi beceri daha kolay gelmeye başladı? Gelecek ay için kendine bir okuma hedefi koy.',
    parent:
      'Dört haftanın sonunda okuma günlüğüne çocuğunuzla birlikte bakın: en çok neyi okumaktan keyif aldı, ne daha kolay gelmeye başladı? Gelecek ay için birlikte bir okuma hedefi koyun.',
  },
  nextTests: ['calisma-aliskanliklari', 'matematik-konu-tarama-testi'],
  nextPurpose: {
    you: 'derslerdeki öteki güçlü ve eksik yanlarını da görmek',
    parent: 'çocuğunuzun derslerdeki öteki güçlü ve eksik yanlarını da görmek',
  },
  links: [{ label: 'Okuma hızı mı, okuduğunu anlama mı?', href: '/rehber/okuma-hizi-ve-okudugunu-anlama' }],
  sources: [KAYNAK.gough, KAYNAK.kuhn, KAYNAK.nrp, KAYNAK.rayner],
};
