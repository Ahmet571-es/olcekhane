import type { BandText, ReportTemplate } from './types';

/**
 * Öğrenme ve Başarı Özellikleri rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): sonuç öz bildirime dayandığı için öğrenciye "Genel olarak ... söylüyorsun",
 * veliye "Çocuğunuz genel olarak ... belirtiyor" dili kullanılır; metinler ölçeğin cümlelerinin söylediğinin ötesine
 * geçmez ve etiketleme yapılmaz. Düşük düzey metinleri suçlamadan, küçük ve uygulanabilir bir öneriyle biter. Düşünmekten
 * hoşlanma metinlerinin üçü de bu ölçeğin zekâyı ölçmediğini söyler. Faydalar kesin sonuç gibi değil, olasılık olarak
 * söylenir.
 * Her metin yalnızca kendi ölçeğinin ortak anlamını anlatır; başka bir ölçekte de bulunan bir davranışı tek bir maddeye
 * dayanarak anlatmaz (ör. iş zorlaşınca bırakmak Çaba ve sebat'ta, zorluklar karşısında kendine güven Zorlukla başa
 * çıkma'da anlatılır): aynı sayfada yan yana okunan iki kart birbiriyle çelişmesin.
 * Öneriler aynı sayfadaki yol haritası kartlarını tekrar etmez (yol haritası daha ayrıntılı öneriler verir).
 * Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 * Destek kutusu gösterilmez: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez.
 * Öneri listeleri (kapsamlı rapor için) bu testte yazılmadı; veliye yaklaşım önerileri gelişim yol haritasındadır.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

export const ogrenmeVeBasariReport: ReportTemplate = {
  version: 'ogrenme-ve-basari-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır bir özelliği gösteriyor; altı özellik ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar bir not değildir ve bir yeteneği ölçmez: öğrenirken ve çalışırken kendini nasıl gördüğünü gösterir. Düşük bir puan değişmez bir yargı değildir; o özelliğin günlük hayattaki karşılığı olan alışkanlıklar küçük adımlarla değiştirilebilir. Her özellik 8–10 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir özelliğe bakarak kesin sonuç çıkarma.',
    parent:
      'Her satır bir özelliği gösterir; altı özellik ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar bir not değildir ve bir yeteneği ölçmez: çocuğunuzun öğrenirken ve çalışırken kendini nasıl gördüğünü gösterir. Düşük bir puan değişmez bir yargı değildir; o özelliğin günlük hayattaki karşılığı olan alışkanlıklar küçük adımlarla değiştirilebilir. Her özellik 8–10 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir özelliğe bakarak kesin sonuç çıkarılmamalıdır.',
  },
  scales: {
    diligence: {
      high: t(
        'Çok çalışan ve kolay bırakmayan',
        'Genel olarak çok çalıştığını, işini titizlikle yaptığını ve başladığın işi kolay kolay bırakmadığını söylüyorsun. Bu çaba, zor konularda ilerlemeni kolaylaştırabilir. Çok çalışırken dinlenmeye ve uykuya da zaman ayırmak, bu temponu uzun süre korumana yardım edebilir.',
        'Çocuğunuz genel olarak çok çalıştığını, işini titizlikle yaptığını ve başladığı işi kolay kolay bırakmadığını belirtiyor. Bu çaba, zor konularda ilerlemesini kolaylaştırabilir; dinlenmeye ve uykuya da zaman ayırması temposunu uzun süre korumasına yardım edebilir.',
      ),
      average: t(
        'Çabası işe göre değişen',
        'Bazı işlerde çok çaba gösterdiğini, bazılarında ise idare edecek kadar çalıştığını söylüyorsun. İlgini çeken ya da önemli bulduğun işlerde daha çok çaba gösteriyor olabilirsin.',
        'Çocuğunuz bazı işlerde çok çaba gösterdiğini, bazılarında ise idare edecek kadar çalıştığını belirtiyor. İlgisini çeken ya da önemli bulduğu işlerde daha çok çaba gösteriyor olabilir.',
      ),
      low: t(
        'Zorlanınca bırakmaya yatkın',
        'Genel olarak idare edecek kadar çalıştığını, iş zorlaştığında ya da ilgini kaybettiğinde bazen bıraktığını söylüyorsun. Bu bazen bir işin nereden tutulacağını bilmemekten ya da işin gözünde büyümesinden kaynaklanabilir. Bir işe ara vermeden önce kaldığın yeri ve bir sonraki adımı not etmek, işe geri dönmeni kolaylaştırabilir.',
        'Çocuğunuz genel olarak idare edecek kadar çalıştığını, iş zorlaştığında ya da ilgisini kaybettiğinde bazen bıraktığını belirtiyor. Bu bazen bir işin nereden tutulacağını bilmemekten ya da işin gözünde büyümesinden kaynaklanabilir; bir işe ara vermeden önce kaldığı yeri ve bir sonraki adımı not etmesi, işe geri dönmesini kolaylaştırabilir.',
      ),
    },
    initiative: {
      high: t(
        'İşlere ertelemeden başlayan',
        'Genel olarak yapman gereken işlere ertelemeden başladığını, başlamak için birinin seni dürtmesine gerek olmadığını ve işleri çabuk bitirdiğini söylüyorsun. Bu, son güne kalan işleri ve son dakika telaşını azaltabilir. Çabuk bitirdiğin işlerde, işi bitmiş saymadan önce kısa bir kontrol yapmak gözden kaçan hataları yakalamana yardım edebilir.',
        'Çocuğunuz genel olarak yapması gereken işlere ertelemeden başladığını, başlamak için birinin onu dürtmesine gerek olmadığını ve işleri çabuk bitirdiğini belirtiyor. Bu, son güne kalan işleri ve son dakika telaşını azaltabilir; çabuk bitirdiği işlerde kısa bir kontrol yapması gözden kaçan hataları yakalamasına yardım edebilir.',
      ),
      average: t(
        'Bazen erteleyen',
        'Bazı işlere hemen başladığını, bazılarını ise, özellikle hoşuna gitmeyenleri, zaman zaman ertelediğini söylüyorsun. Hoşa gitmeyen işler herkes için daha kolay ertelenir; böyle bir işe günün belli bir saatinde başlamayı önceden kararlaştırmak işini kolaylaştırabilir.',
        'Çocuğunuz bazı işlere hemen başladığını, bazılarını ise, özellikle hoşuna gitmeyenleri, zaman zaman ertelediğini belirtiyor. Hoşa gitmeyen işler herkes için daha kolay ertelenir.',
      ),
      low: t(
        'İşlere başlamakta zorlanan',
        'Genel olarak işlere başlamakta zorlandığını, başlamak için birinin seni dürtmesine ihtiyaç duyduğunu ve hoşuna gitmeyen işleri ertelediğini söylüyorsun. Erteleme yaygın bir durumdur ve sıklıkla işin zor ya da sıkıcı görünmesiyle ilişkilidir. Başlamadan önce dikkatini dağıtan şeyleri (ör. telefonu) uzaklaştırmak, başlamayı kolaylaştırabilir.',
        'Çocuğunuz genel olarak işlere başlamakta zorlandığını, başlamak için birinin onu dürtmesine ihtiyaç duyduğunu ve hoşuna gitmeyen işleri ertelediğini belirtiyor. Erteleme yaygın bir durumdur ve sıklıkla işin zor ya da sıkıcı görünmesiyle ilişkilidir; başlamadan önce dikkatini dağıtan şeyleri (ör. telefonu) uzaklaştırması, başlamayı kolaylaştırabilir.',
      ),
    },
    planfulness: {
      high: t(
        'Planlı ve dikkatli',
        'Genel olarak önceden plan yaptığını, planına bağlı kaldığını, ayrıntılara dikkat ettiğini ve düşünmeden harekete geçmediğini söylüyorsun. Bu, büyük işleri zamanında ve az hatayla bitirmeni kolaylaştırabilir. İşler planladığın gibi gitmediğinde planını yenilemek, bu düzeni esnek tutmana yardım edebilir.',
        'Çocuğunuz genel olarak önceden plan yaptığını, planına bağlı kaldığını, ayrıntılara dikkat ettiğini ve düşünmeden harekete geçmediğini belirtiyor. Bu, büyük işleri zamanında ve az hatayla bitirmesini kolaylaştırabilir; işler planladığı gibi gitmediğinde planını yenileyebilmesi de önemlidir.',
      ),
      average: t(
        'Bazen planlı, bazen anlık',
        'Bazı işleri önceden planladığını, bazılarında ise içinden geldiği gibi davrandığını söylüyorsun. Önemli ve uzun işlerde kısa bir plan yapmak işini kolaylaştırabilir.',
        'Çocuğunuz bazı işleri önceden planladığını, bazılarında ise içinden geldiği gibi davrandığını belirtiyor. Önemli ve uzun işlerde kısa bir plan yapmak işini kolaylaştırabilir.',
      ),
      low: t(
        'Anlık ve son dakikada hareket eden',
        'Genel olarak planlarını sık sık son dakikada yaptığını, aklına estiği gibi davranmayı sevdiğini ve zaman zaman düşünmeden işlere atıldığını söylüyorsun. Bu kendiliğindenlik bazı durumlarda işe yarar; ama uzun ve önemli işlerde son dakikaya kalmak işi zorlaştırabilir. Önemli bir işin tarihini öğrenir öğrenmez bir yere not etmek, son dakika telaşını azaltabilir.',
        'Çocuğunuz genel olarak planlarını sık sık son dakikada yaptığını, aklına estiği gibi davranmayı sevdiğini ve zaman zaman düşünmeden işlere atıldığını belirtiyor. Bu kendiliğindenlik bazı durumlarda işe yarar; ama uzun ve önemli işlerde son dakikaya kalmak işi zorlaştırabilir.',
      ),
    },
    competence: {
      high: t(
        'Zorluklara güvenle yaklaşan',
        'Genel olarak zor görevleri kabul ettiğini, kendini pek çok işi yapabilecek güçte hissettiğini ve karşına çıkan zorlukların üstesinden gelebileceğine güvendiğini söylüyorsun. Bu güven, yeni ve zor konulara girişmeni kolaylaştırabilir. Takıldığın yerlerde yardım istemek de bu güvenin bir parçasıdır.',
        'Çocuğunuz genel olarak zor görevleri kabul ettiğini, kendini pek çok işi yapabilecek güçte hissettiğini ve karşısına çıkan zorlukların üstesinden gelebileceğine güvendiğini belirtiyor. Bu güven, yeni ve zor konulara girişmesini kolaylaştırabilir; takıldığı yerlerde yardım istemesi de bu güvenin bir parçasıdır.',
      ),
      average: t(
        'Duruma göre kendine güvenen',
        'Bazı zorlukların üstesinden gelebileceğine güvendiğini, bazılarında ise emin olamadığını söylüyorsun. Daha önce başardığın benzer işleri hatırlamak, zor bir işe başlarken sana güç verebilir.',
        'Çocuğunuz bazı zorlukların üstesinden gelebileceğine güvendiğini, bazılarında ise emin olamadığını belirtiyor. Daha önce başardığı benzer işleri hatırlamak, zor bir işe başlarken ona güç verebilir.',
      ),
      low: t(
        'Zorlanınca kendine güveni azalan',
        'Genel olarak zor görevlerden çekindiğini ve karşına çıkan zorlukların üstesinden gelebileceğinden pek emin olmadığını söylüyorsun. Zorlandığın bir işte yardım istemek ya da biriyle birlikte çalışmak, üstesinden gelebileceğini görmeni ve kendine güvenmeni kolaylaştırabilir.',
        'Çocuğunuz genel olarak zor görevlerden çekindiğini ve karşısına çıkan zorlukların üstesinden gelebileceğinden pek emin olmadığını belirtiyor. Zorlandığı bir işte yardım istemesi ya da biriyle birlikte çalışması, üstesinden gelebileceğini görmesini ve kendine güvenmesini kolaylaştırabilir.',
      ),
    },
    need_for_cognition: {
      high: t(
        'Kafa yoran işlerden hoşlanan',
        'Genel olarak karmaşık problemleri çözmekten, zor metinler okumaktan ve kafa yoran konularla uğraşmaktan hoşlandığını, yeni şeyleri çabuk kavradığını söylüyorsun. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir. Bu istek, bir konuyu ezberlemek yerine anlamaya çalışmanı kolaylaştırabilir.',
        'Çocuğunuz genel olarak karmaşık problemleri çözmekten, zor metinler okumaktan ve kafa yoran konularla uğraşmaktan hoşlandığını, yeni şeyleri çabuk kavradığını belirtiyor. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir.',
      ),
      average: t(
        'Duruma göre düşünmeye istekli',
        'Bazı kafa yoran işlerden hoşlandığını, bazılarından ise kaçındığını söylüyorsun. Bu ölçek zekâyı ölçmez; ilgini çeken konularda düşünmeye daha istekli olabilirsin.',
        'Çocuğunuz bazı kafa yoran işlerden hoşlandığını, bazılarından ise kaçındığını belirtiyor. Bu ölçek zekâyı ölçmez; ilgisini çeken konularda düşünmeye daha istekli olabilir.',
      ),
      low: t(
        'Kafa yoran işlerden kaçınan',
        'Genel olarak karmaşık problemler, okuması zor metinler ve felsefi tartışmalar gibi kafa yoran işlerden pek hoşlanmadığını söylüyorsun. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir. Zor bir konuya ilgini çeken bir örnekle başlamak, kafa yormayı daha kolay ve keyifli hâle getirebilir.',
        'Çocuğunuz genel olarak karmaşık problemler, okuması zor metinler ve felsefi tartışmalar gibi kafa yoran işlerden pek hoşlanmadığını belirtiyor. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir.',
      ),
    },
    openness: {
      high: t(
        'Yeni bilgilere ve fikirlere açık',
        'Genel olarak pek çok şeye ilgi duyduğunu, bilgini artırmak istediğini, değişime ve yeni fikirlere açık olduğunu söylüyorsun. Bu merak, yeni konuları öğrenmeyi keyifli hâle getirebilir. İlgini çeken pek çok konu arasında öncelik belirlemek, enerjini dağıtmadan ilerlemene yardım edebilir.',
        'Çocuğunuz genel olarak pek çok şeye ilgi duyduğunu, bilgisini artırmak istediğini, değişime ve yeni fikirlere açık olduğunu belirtiyor. Bu merak, yeni konuları öğrenmeyi onun için keyifli hâle getirebilir.',
      ),
      average: t(
        'Seçici biçimde meraklı',
        'Bazı yeni bilgilere ve fikirlere ilgi duyduğunu, bazı konularda ise bildiğin yollara bağlı kalmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı yeni bilgilere ve fikirlere ilgi duyduğunu, bazı konularda ise bildiği yollara bağlı kalmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Bildiği yollara bağlı kalan',
        'Genel olarak bildiğin şeylere ve alışık olduğun yollara bağlı kalmayı tercih ettiğini, olaylarda daha derin bir anlam pek aramadığını söylüyorsun. Bildiğin yolların güvenli geldiği durumlar vardır; yine de öğrendiğin bir konunun gündelik hayatta nerede kullanıldığını bulmak, yeni konulara ilgini artırabilir.',
        'Çocuğunuz genel olarak bildiği şeylere ve alışık olduğu yollara bağlı kalmayı tercih ettiğini, olaylarda daha derin bir anlam pek aramadığını belirtiyor. Öğrendiği konuların gündelik hayatta nerede kullanıldığını birlikte bulmak, yeni konulara ilgisini artırabilir.',
      ),
    },
  },
};
