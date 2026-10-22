import type { RoadmapTemplate } from './types';

/**
 * Beş Faktör Kişilik Profili: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Etkili çalışma yöntemleri herkes için aynıdır (kendini sınamak, tekrarları günlere yaymak, karışık çalışmak,
 *    "neden?" diye sorup kendine açıklamak; Dunlosky ve ark., 2013). Kişilik bu yöntemlerin hangi düzende ve hangi
 *    ortamda kullanılacağını seçmeye yardım eder. "Kişiliğine uygun öğrenme yolu" gibi bir eşleştirme vaat edilmez:
 *    öğrenme stillerine göre öğretmenin işe yaradığı gösterilmemiştir (sitedeki "Öğrenme stilleri efsanesi" yazısı).
 *  - Ortamlar bir meslek önerisi değildir; kişilik tek başına meslek seçtirmez. Meslek için ilgi testlerine yönlendirilir.
 *  - Duygusal denge düşükken öneriler iyi oluşu öne alır (sınav kaygısı yazısındaki, araştırmayla desteklenen yollar).
 *  - Uçlar iyi ya da kötü değildir: yüksek uç bir başarı ya da "en büyük avantaj", düşük uç bir beceri (ör. uyumluluk
 *    düşükken "eleştirel düşünme") diye anlatılmaz; kişinin kendi söylediğinden ("sana kolay geliyor") yola çıkılır.
 *  - Orta düzeyin metinleri ("Bazı işlere başlamak sana ötekilerden daha zor gelebilir") kişiye bir özellik yüklemez: Ayrıntılı
 *    ve Altı Boyutlu Kişilik Profili'nde alt özellikleri ayrışan (biri yüksek, öteki düşük) bir boyutta da bu metinler
 *    gösterilir ve o alt özelliklerin kartlarıyla çelişmemelidir. Rapordaki kartı da tekrar etmezler.
 */
export const besFaktorRoadmap: RoadmapTemplate = {
  version: 'bes-faktor-yol-haritasi-1',
  planningScale: 'conscientiousness',
  wellbeing: { scale: 'emotional_stability', group: 'low' },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Kişiliğin, bu yöntemleri hangi düzende ve hangi ortamda kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun kişiliği, bu yöntemleri hangi düzende ve hangi ortamda kullanmanın ona kolay geleceği konusunda ipucu verebilir.',
    adult:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Kişiliğin, bu yöntemleri hangi düzende ve hangi ortamda kullanmanın sana kolay geleceği konusunda ipucu verebilir.',
  },
  settingsNote: {
    student:
      'Kişilik tek başına meslek seçtirmez: aynı meslekte çok farklı kişilikte insanlar başarılı olur. Bu bölüm yalnızca hangi ortamlarda kendini daha rahat hissedebileceğine dair bir ipucu verir. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'Kişilik tek başına meslek seçtirmez: aynı meslekte çok farklı kişilikte insanlar başarılı olur. Bu bölüm yalnızca çocuğunuzun hangi ortamlarda kendini daha rahat hissedebileceğine dair bir ipucu verir. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Raporunda seni en iyi anlattığını düşündüğün iki üç özelliği seç. Bu hafta bu özelliklerin sana nerede yardım ettiğini, seni nerede zorladığını bir deftere kısaca yaz.',
    parent:
      'Raporu çocuğunuzla birlikte okuyun ve ona hangi cümlelerin kendisini anlattığını sorun. Bu hafta yalnızca birlikte gözlem yapın; hemen bir şeyi değiştirmeye çalışmayın.',
  },
  lastWeek: {
    student: 'Dört haftada neyin işe yaradığını yaz; işe yarayanı sürdür, yaramayanı bırak.',
    parent: 'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  },
  nextTests: ['meslek-ilgi-alanlari', 'mesleki-ilgi-profili', 'hobi-ve-serbest-zaman-ilgileri'],
  scales: {
    extraversion: {
      color: '#ee6a36',
      study: {
        high: {
          student:
            'İnsanlarla birlikte çalışmak seni canlı tutuyor. Bunu en etkili yöntemle birleştir: bir arkadaşınla kitapları kapatıp birbirinize sırayla soru sorun ya da konuyu ona anlat. Anlatırken takıldığın yer, tekrar etmen gereken yerdir. Sohbete kaymamak için başta hedefi ve süreyi belirleyin.',
          parent:
            'Çocuğunuzu insanlarla birlikte çalışmak canlı tutuyor olabilir. Bunu etkili bir yöntemle birleştirebilir: bir arkadaşıyla kitapları kapatıp birbirlerine sırayla soru sormak ya da konuyu size anlatmak. Sohbete kaymamaları için başta hedef ve süre belirlemelerini önerebilirsiniz.',
          adult:
            'İnsanlarla birlikte çalışmak seni canlı tutuyor. Bunu en etkili yöntemle birleştir: öğrendiğini birine anlat ya da biriyle birbirinize kaynağa bakmadan soru sorun. Anlatırken takıldığın yer, tekrar etmen gereken yerdir.',
        },
        average: {
          student:
            'Bazı işlerde grupla, bazılarında yalnız daha rahat olabilirsin. Yeni bir konuyu önce tek başına çalış, sonra bir arkadaşınla birbirinize soru sorarak pekiştir. Hangi düzende daha çok hatırladığını kendini sınayarak gözle.',
          parent:
            'Çocuğunuz bazı işlerde grupla, bazılarında yalnız daha rahat olabilir. Yeni bir konuyu önce tek başına çalışıp sonra bir arkadaşıyla soru sorarak pekiştirmesi iyi bir denge kurar.',
        },
        low: {
          student:
            'Sessiz ve kesintisiz ortamlar sana iyi geliyor. Kendine sabit, sakin bir çalışma köşesi oluştur. Kendini sınamak için bir gruba ihtiyacın yok: çalışmanın sonunda kitabı kapat ve hatırladıklarını yaz ya da konuyu yüksek sesle kendine anlat.',
          parent:
            'Çocuğunuza sessiz ve kesintisiz ortamlar iyi geliyor olabilir. Evde sabit ve sakin bir çalışma köşesi bunu destekler. Öğrendiğini sınamak için çalışmanın sonunda kitaba bakmadan hatırladıklarını yazması, bir gruba katılmak kadar işe yarar.',
          adult:
            'Sessiz ve kesintisiz ortamlar sana iyi geliyor. Kendine sabit, sakin bir çalışma köşesi oluştur. Kendini sınamak için bir gruba ihtiyacın yok: çalışmanın sonunda kaynağı kapat ve hatırladıklarını yaz ya da konuyu yüksek sesle kendine anlat.',
        },
      },
      action: {
        high: {
          student:
            'Bir arkadaşınla 20 dakikalık bir soru-cevap çalışması yapın: kitaplar kapalı, sırayla birbirinize soru sorun ve süre tutun.',
          parent:
            'Çocuğunuza bir arkadaşıyla 20 dakikalık bir soru-cevap çalışması yapmasını önerin: kitaplar kapalı, sırayla birbirlerine soru sorsunlar ve süre tutsunlar.',
          adult: 'Öğrendiğin bir konuyu birine 5 dakikada anlat; anlatamadığın yerleri not al ve yeniden çalış.',
        },
        average: {
          student:
            'Aynı konudan iki parçayı bir kez yalnız, bir kez bir arkadaşınla çalış; ertesi gün hangisini daha çok hatırladığını kendini sınayarak karşılaştır.',
          parent:
            'Çocuğunuzla, bir konuyu yalnız çalıştığında mı yoksa bir arkadaşıyla çalıştığında mı daha çok hatırladığını birlikte gözlemleyin.',
          adult:
            'Bir konunun iki parçasını bir kez yalnız, bir kez biriyle çalış; ertesi gün hangisini daha çok hatırladığını kendini sınayarak karşılaştır.',
        },
        low: {
          student: 'Her çalışmanın sonunda kitabı kapat ve öğrendiklerini 5 dakika boyunca hatırlayabildiğin kadar yaz; sonra kitapla karşılaştır.',
          parent:
            'Evde çocuğunuz için sessiz ve sabit bir çalışma köşesi hazırlayın; çalışmanın sonunda öğrendiklerini kitaba bakmadan yazmasını önerin.',
          adult: 'Her çalışmanın sonunda kaynağı kapat ve öğrendiklerini 5 dakika boyunca hatırlayabildiğin kadar yaz; sonra karşılaştır.',
        },
      },
      settings: {
        high: 'İnsanlarla sık iletişim kurulan, ekip hâlinde yürüyen, hareketli ortamlar',
        low: 'Derinlemesine ve bağımsız çalışılabilen, sakin ortamlar',
      },
    },
    agreeableness: {
      color: '#df4777',
      study: {
        high: {
          student:
            'İş birliği içinde öğrenmek sana kolay geliyor. Arkadaşlarına konu anlatmak hem onlara hem sana yarar, çünkü anlatırken kendi bilgini de sınarsın. Yardım ederken kendi çalışma zamanını korumayı unutma: önce kendi planındaki işi bitir.',
          parent:
            'Çocuğunuza iş birliği içinde öğrenmek kolay geliyor olabilir. Arkadaşlarına konu anlatması hem onlara hem kendisine yarar. Başkalarına yardım ederken kendi çalışma zamanını korumasına destek olun.',
          adult:
            'İş birliği içinde öğrenmek sana kolay geliyor. Bildiğini başkalarına anlatmak hem onlara hem sana yarar, çünkü anlatırken kendi bilgini de sınarsın. Yardım ederken kendi zamanını korumayı unutma.',
        },
        average: {
          student:
            'Hem birlikte hem tek başına çalışabiliyorsun. Grup çalışmalarında görevleri baştan paylaşmak herkesin ne yapacağını netleştirir ve işi kolaylaştırır.',
          parent:
            'Çocuğunuz hem birlikte hem tek başına çalışabiliyor. Grup ödevlerinde görevleri baştan paylaşmayı önermek işleri kolaylaştırır.',
          adult:
            'Hem birlikte hem tek başına çalışabiliyorsun. Ortak işlerde görevleri baştan paylaşmak herkesin ne yapacağını netleştirir ve işi kolaylaştırır.',
        },
        low: {
          student:
            'Fikirleri sorgulamak sana doğal geliyor olabilir. Bunu öğrenirken kullan: okuduğun bir konu için "Bunun kanıtı ne? Karşı görüş ne olabilir?" diye sor ve cevaplarını not al. Grup çalışmalarında farklı düşündüğünde gerekçeni sakin bir dille anlatmak fikrinin daha iyi duyulmasını sağlar.',
          parent:
            'Çocuğunuz fikirleri sorgulamayı ve kendi görüşünü savunmayı seviyor olabilir. Bu sorgulayıcılığı "Bunun kanıtı ne?" gibi sorularla derslere yönlendirebilirsiniz. Grup çalışmalarında görüşünü sakin bir dille anlatmasına destek olun.',
          adult:
            'Fikirleri sorgulamak sana doğal geliyor olabilir. Bunu öğrenirken kullan: okuduğun bir konu için "Bunun kanıtı ne? Karşı görüş ne olabilir?" diye sor ve cevaplarını not al. Ortak işlerde farklı düşündüğünde gerekçeni sakin bir dille anlatmak fikrinin daha iyi duyulmasını sağlar.',
        },
      },
      action: {
        high: {
          student:
            'Bir arkadaşına bir konuyu anlat, ama önce kendi planındaki işi bitir. "Önce kendi işimi bitireyim, sonra yardım ederim" demeyi dene.',
          parent:
            'Çocuğunuzla, başkalarına yardım ederken kendi işini nasıl koruyacağını konuşun. "Önce kendi işimi bitireyim, sonra yardım ederim" demeyi birlikte deneyin.',
          adult: 'Birine yardım etmeden önce kendi önceliğini bitir. "Şu işimi bitirince yardım edeyim" demeyi dene.',
        },
        average: {
          student: 'Bir grup çalışmasında görevleri en baştan yazılı olarak paylaşmayı öner.',
          parent: 'Çocuğunuzla bir grup ödevinde görevlerin nasıl paylaşıldığını konuşun ve görevleri baştan yazmayı önerin.',
          adult: 'Ortak bir işte görevleri en baştan yazılı olarak paylaşmayı öner.',
        },
        low: {
          student: 'Okuduğun bir konu için "Bunun kanıtı ne? Karşı görüş ne olabilir?" sorularının cevabını üç cümleyle yaz.',
          parent:
            'Akşam yemeğinde güncel bir konuyu konuşun ve çocuğunuzdan görüşünü gerekçesiyle anlatmasını isteyin. Farklı düşündüğünüzde de sakin bir dille konuşmayı birlikte deneyin.',
        },
      },
      settings: {
        high: 'İş birliğinin, yardımlaşmanın ve insanlara destek olmanın öne çıktığı ortamlar',
        low: 'Bağımsız karar verilen; eleştirel değerlendirmenin ve tartışmanın değerli olduğu ortamlar',
      },
    },
    conscientiousness: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Planlı çalışmak sana kolay geliyor; bu, öğrenirken işine yarar. Bu düzeni en etkili yöntemlerle birleştir: konuyu okuduktan sonra kitabı kapatıp hatırlamaya çalış ve tekrarları günlere yay. Planına dinlenmeyi de yaz; her şeyin kusursuz olması gerekmez.',
          parent:
            'Çocuğunuza planlı çalışmak kolay geliyor olabilir; bu, öğrenirken işine yarar. Bu düzeni en etkili yöntemlerle birleştirmesine destek olun: konuyu kitaba bakmadan hatırlamaya çalışması ve tekrarları günlere yayması. Dinlenmenin de planın parçası olduğunu hatırlatın.',
          adult:
            'Planlı çalışmak sana kolay geliyor; bu, öğrenirken işine yarar. Bu düzeni en etkili yöntemlerle birleştir: öğrendiğini kaynağa bakmadan hatırlamaya çalış ve tekrarları günlere yay. Planına dinlenmeyi de yaz; her şeyin kusursuz olması gerekmez.',
        },
        average: {
          student:
            'Bazı işlere başlamak sana ötekilerden daha zor gelebilir. Her akşam ertesi günün en önemli işini seç ve ona ne zaman, nerede başlayacağını yaz: "Okuldan gelince, masamda, 30 dakika." Bunu önceden belirlemek başlamayı kolaylaştırır.',
          parent:
            'Bazı işlere başlamak çocuğunuza ötekilerden daha zor gelebilir. Her akşam ertesi günün en önemli işini ve ona ne zaman, nerede başlayacağını birlikte kısaca yazmak başlamayı kolaylaştırır.',
          adult:
            'Bazı işlere başlamak sana ötekilerden daha zor gelebilir. Her akşam ertesi günün en önemli işini seç ve ona ne zaman, nerede başlayacağını yaz. Bunu önceden belirlemek başlamayı kolaylaştırır.',
        },
        low: {
          student:
            'Uzun planlar yerine kısa ve net adımlar sana daha uygun. Çalışmayı 25 dakikalık bloklara böl ve her bloğun sonunda kısa bir mola ver. Telefonu başka odaya bırakmak ve işe en kolay parçadan başlamak ilk adımı küçültür. Sınavları son geceye bırakmamak için takvime birkaç kısa tekrar günü yaz.',
          parent:
            'Çocuğunuza uzun planlar yerine kısa ve net adımlar daha uygun olabilir. Çalışmayı 25 dakikalık bloklara bölmesi, telefonu başka odada bırakması ve işe en kolay parçadan başlaması ilk adımı küçültür.',
          adult:
            'Uzun planlar yerine kısa ve net adımlar sana daha uygun. Çalışmayı 25 dakikalık bloklara böl ve her bloğun sonunda kısa bir mola ver. Telefonu başka odaya bırakmak ve işe en kolay parçadan başlamak ilk adımı küçültür.',
        },
      },
      action: {
        high: {
          student: 'Her konuyu çalıştıktan bir gün sonra 10 dakikalık bir kendini sınama yap. Programına bir de serbest akşam koy.',
          parent:
            'Çocuğunuzun programında bir serbest akşam olmasına destek olun. Çalıştığı konuları ertesi gün kitaba bakmadan hatırlamayı denemesini önerin.',
          adult: 'Öğrendiğin her konuyu bir gün sonra 10 dakika kendini sınayarak tekrar et. Programına bir de serbest akşam koy.',
        },
        average: {
          student: 'Her akşam ertesi günün tek önemli işini, ne zaman ve nerede başlayacağınla birlikte bir kâğıda yaz.',
          parent: 'Her akşam çocuğunuzla ertesi günün tek önemli işini ve ona ne zaman başlayacağını kısaca konuşun.',
          adult: 'Her akşam ertesi günün tek önemli işini, ne zaman ve nerede başlayacağınla birlikte yaz.',
        },
        low: {
          student: 'Her gün en az bir kez 25 dakikalık bir çalışma bloğu yap: telefon başka odada, işe en kolay parçadan başla.',
          parent:
            'Evde herkesin görebileceği bir haftalık takvim asın ve çocuğunuzla her gün yaptığı kısa çalışma bloğunu birlikte işaretleyin.',
          adult: 'Her gün en az bir kez 25 dakikalık bir çalışma bloğu yap: telefon başka odada, işe en kolay parçadan başla.',
        },
      },
      settings: {
        high: 'Planlama, takip ve titizlik isteyen; sorumlulukların net olduğu ortamlar',
        low: 'Esnekliğin ve çeşitliliğin olduğu, kısa sürede sonuç alınan işlerin yapıldığı ortamlar',
      },
    },
    emotional_stability: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Baskı altında sakin kalabilmen sınavlarda işine yarar. Bu rahatlığın "Nasılsa yetişir" düşüncesine dönüşmemesi için sınav tarihinden geriye doğru küçük bir plan yap ve deneme sınavlarıyla kendini sına.',
          parent:
            'Çocuğunuzun baskı altında sakin kalabilmesi sınavlarda işine yarayabilir. Bu rahatlığın son ana bırakmaya dönüşmemesi için sınav tarihinden geriye doğru küçük bir plan yapmasına destek olabilirsiniz.',
          adult:
            'Baskı altında sakin kalabilmen işine yarayabilir. Bu rahatlığın son ana bırakmaya dönüşmemesi için önemli bir işin tarihinden geriye doğru küçük bir plan yap.',
        },
        average: {
          student:
            'Bazı dersler ya da sınavlar seni ötekilerden daha çok gerebilir. Seni zorlayan konulara daha erken başla ve onları kısa ama sık tekrarlarla çalış. İyi hazırlanmış hissetmek gerginliği azaltır.',
          parent:
            'Bazı dersler ya da sınavlar çocuğunuzu ötekilerden daha çok gerebilir. Zorlandığı konulara erken başlaması ve onları kısa ama sık tekrarlarla çalışması, iyi hazırlanmış hissetmesini sağlar.',
          adult:
            'Bazı işler seni ötekilerden daha çok gerebilir. Seni zorlayan işlere daha erken başla ve onları küçük parçalara böl. İyi hazırlanmış hissetmek gerginliği azaltır.',
        },
        low: {
          student:
            'Duygularını yoğun yaşaman ders çalışırken ve sınavlarda da kendini gösterebilir. Sınavdan hemen önce endişelerini birkaç dakika kâğıda yazmak ve kalp çarpıntısını "vücudum bu işe hazırlanıyor" diye yorumlamak işine yarayabilir. Uyku ve düzenli molalar da ders çalışmanın bir parçasıdır.',
          parent:
            'Çocuğunuz duyguları yoğun yaşıyor olabilir; bu, ders çalışırken ve sınavlarda da kendini gösterebilir. Sınavdan hemen önce endişelerini birkaç dakika yazması ve uykusunu koruması işine yarayabilir. Sınavı hayat meselesine çevirmemek ve sonuçtan çok emeği konuşmak baskıyı azaltabilir.',
          adult:
            'Duygularını yoğun yaşaman çalışırken de kendini gösterebilir. Önemli bir sınav ya da sunumdan hemen önce endişelerini birkaç dakika kâğıda yazmak ve kalp çarpıntısını "vücudum bu işe hazırlanıyor" diye yorumlamak işine yarayabilir. Uyku ve düzenli molalar da çalışmanın bir parçasıdır.',
        },
      },
      action: {
        high: {
          student: 'Yaklaşan bir sınav ya da ödev için tarihten geriye doğru üç küçük adım belirle ve takvime yaz.',
          parent: 'Çocuğunuzla yaklaşan bir sınav için tarihten geriye doğru üç küçük adım belirleyin.',
          adult: 'Yaklaşan önemli bir iş için tarihten geriye doğru üç küçük adım belirle ve takvime yaz.',
        },
        average: {
          student: 'Seni en çok geren dersi ya da durumu belirle ve ona haftada üç kez 15 dakika ayır.',
          parent: 'Çocuğunuza onu en çok neyin gerdiğini yargılamadan sorun ve o konuya erken başlaması için küçük bir plan yapın.',
          adult: 'Seni en çok geren işi belirle ve ona haftada üç kez 15 dakika ayır.',
        },
        low: {
          student:
            'Gergin hissettiğinde 4 saniye nefes al, 4 saniye tut, 6 saniyede ver; birkaç kez tekrarla. Kendini çok zorlanmış hissedersen güvendiğin bir yetişkinle konuş.',
          parent:
            'Çocuğunuzun uyku saatini birlikte koruyun ve onu dinlemek için sakin bir zaman ayırın: "Bu hafta seni en çok ne zorladı?" diye sorun.',
          adult:
            'Gergin hissettiğinde 4 saniye nefes al, 4 saniye tut, 6 saniyede ver; birkaç kez tekrarla. Çok zorlandığında güvendiğin biriyle konuş.',
        },
      },
      settings: {
        high: 'Baskı altında sakin kalmayı ve hızlı karar vermeyi gerektiren ortamlar',
        low: 'Öngörülebilir, destekleyici ve geri bildirimin bol olduğu ortamlar',
      },
    },
    intellect: {
      color: '#7a4ee6',
      study: {
        high: {
          student:
            'Merakın öğrenmenin motoru. Ezberlemek yerine "Bu neden böyle?" diye sor ve cevabı kendi cümlelerinle açıkla. Konular arasında bağlantı kurmak ve öğrendiğini bir projeye dönüştürmek seni canlı tutar. Merakın seni ana konudan uzaklaştırırsa soruları bir kenara not et ve sonra dön.',
          parent:
            'Çocuğunuzun merakı öğrenmenin motoru olabilir. Ezber yerine "Bu neden böyle?" sorusunu teşvik edin ve öğrendiğini kendi cümleleriyle anlatmasını isteyin. Öğrendiklerini bir projeye dönüştürmesine fırsat verin.',
          adult:
            'Merakın öğrenmenin motoru. Ezberlemek yerine "Bu neden böyle?" diye sor ve cevabı kendi cümlelerinle açıkla. Konular arasında bağlantı kurmak ve öğrendiğini bir projeye dönüştürmek seni canlı tutar.',
        },
        average: {
          student:
            'Merakın konuya göre değişebilir. İlgini daha az çeken bir derste konuyu sevdiğin bir alanla ilişkilendirmeyi dene ya da "Bunu nerede kullanırım?" diye sor. Somut örnekler konuyu canlandırır.',
          parent:
            'Çocuğunuzun merakı konuya göre değişebilir. İlgisini daha az çeken bir dersi sevdiği bir alanla ilişkilendirmesine yardım edebilir, "Bunu nerede kullanırız?" sorusunu birlikte cevaplayabilirsiniz.',
          adult:
            'Merakın konuya göre değişebilir. İlgini daha az çeken bir konuyu sevdiğin bir alanla ilişkilendirmeyi dene ya da "Bunu nerede kullanırım?" diye sor. Somut örnekler konuyu canlandırır.',
        },
        low: {
          student:
            'Somut ve işe yarar konular ilgini daha çok çekiyor. Soyut bir konuyu gerçek hayattan bir örnekle ve bir çizimle başlatmak işini kolaylaştırır. Bol örnek soru çözmek ve farklı türde soruları karışık sırayla çalışmak, öğrendiğini kalıcı hâle getirmene yardım eder.',
          parent:
            'Somut ve işe yarar konular çocuğunuzun ilgisini daha çok çekiyor olabilir. Soyut bir konuyu gerçek hayattan bir örnekle ya da bir çizimle başlatmak onun işini kolaylaştırır. Bol örnek soru çözmesi ve farklı türde soruları karışık çalışması kalıcı öğrenmeyi destekleyebilir.',
          adult:
            'Somut ve işe yarar konular ilgini daha çok çekiyor. Soyut bir konuyu gerçek hayattan bir örnekle ve bir çizimle başlatmak işini kolaylaştırır. Bol uygulama yapmak ve farklı türde örnekleri karışık sırayla çalışmak, öğrendiğini kalıcı hâle getirmene yardım eder.',
        },
      },
      action: {
        high: {
          student: 'Merak ettiğin bir soruyu seç, cevabını araştır ve bulduklarını bir sayfalık kısa bir yazı ya da bir çizimle anlat.',
          parent: 'Çocuğunuzun merak ettiği bir soruyu birlikte araştırın ve bulduklarını size anlatmasını isteyin.',
          adult: 'Merak ettiğin bir soruyu seç, araştır ve bulduklarını bir sayfada kendi cümlelerinle anlat.',
        },
        average: {
          student: 'En az sevdiğin derste her konu için "Bunu nerede kullanırım?" sorusunun cevabını bir cümleyle yaz.',
          parent: 'Çocuğunuzla en az sevdiği dersteki bir konunun günlük hayatta nerede kullanıldığını birlikte bulun.',
          adult: 'İlgini daha az çeken bir konu için "Bunu nerede kullanırım?" sorusunun cevabını bir cümleyle yaz.',
        },
        low: {
          student: 'Zorlandığın soyut bir konuyu gerçek hayattan bir örnekle ve bir çizimle kâğıda anlat; sonra o konudan karışık sırayla beş soru çöz.',
          parent: 'Çocuğunuzun zorlandığı soyut bir konuyu günlük hayattan bir örnekle birlikte anlatmayı deneyin.',
          adult: 'Zorlandığın soyut bir konuyu gerçek hayattan bir örnek ve bir çizimle kâğıda anlat.',
        },
      },
      settings: {
        high: 'Yeni fikirlerin, araştırmanın, tasarımın ya da sanatın öne çıktığı ortamlar',
        low: 'Somut sonuç veren, adımları net ve uygulamalı işlerin yapıldığı ortamlar',
      },
    },
  },
  sources: [
    {
      text: 'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J. ve Willingham, D. T. (2013). Improving students’ learning with effective learning techniques: Promising directions from cognitive and educational psychology. Psychological Science in the Public Interest, 14(1), 4–58.',
      url: 'https://doi.org/10.1177/1529100612453266',
    },
    {
      text: 'Jamieson, J. P., Mendes, W. B., Blackstock, E. ve Schmader, T. (2010). Turning the knots in your stomach into bows: Reappraising arousal improves performance on the GRE. Journal of Experimental Social Psychology, 46(1), 208–212.',
      url: 'https://doi.org/10.1016/j.jesp.2009.08.015',
    },
    {
      text: 'Poropat, A. E. (2009). A meta-analysis of the five-factor model of personality and academic performance. Psychological Bulletin, 135(2), 322–338.',
      url: 'https://doi.org/10.1037/a0014996',
    },
    {
      text: 'Ramirez, G. ve Beilock, S. L. (2011). Writing about testing worries boosts exam performance in the classroom. Science, 331(6014), 211–213.',
      url: 'https://doi.org/10.1126/science.1199427',
    },
  ],
};
