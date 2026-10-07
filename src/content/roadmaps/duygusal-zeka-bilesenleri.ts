import { besFaktorRoadmap as bf } from './bes-faktor';
import type { RoadmapTemplate } from './types';

/**
 * Duygusal Zekâ Bileşenleri: gelişim yol haritası metinleri.
 *
 * İlkeler (Beş Faktör yol haritasıyla aynı):
 *  - Etkili çalışma yöntemleri herkes için aynıdır (kendini sınamak, tekrarları günlere yaymak; Dunlosky ve ark., 2013).
 *    Duygularla ilgili eğilimler bu yöntemlerin nasıl kullanılacağını ve zor anlarda kişinin kendine nasıl destek
 *    olacağını seçmeye yardım eder; "duygusal zekâya uygun öğrenme yolu" gibi bir eşleştirme vaat edilmez.
 *  - Puanlar bir not değildir: iki ucun da işe yarayan ve dikkat edilecek yanları vardır (rapor metinleriyle aynı dil).
 *  - Üzücü olaylardan etkilenme yüksekken 3. hafta iyi oluşa ayrılır. Bu ölçek kaygı ölçmediği için "Sınav kaygısı"
 *    yazısına bağlantı verilmez ve sınav kaygısı önerisi verilmez; öneriler duygusal yükü hafifletmeye ve kendine iyi
 *    bakmaya (dinlenme, uyku, üzücü haberlere ara verme, güvenilen biriyle konuşma) yöneliktir.
 *  - Veliye yaklaşım önerileri rapordaki veli metinlerini ve aynı raporda yan yana okunan "Bu hafta dene"
 *    metinlerini tekrar etmez.
 *  - 2. hafta "Duygularına dikkat": bu testte çalışma düzenini ölçen bir ölçek yoktur; duyguları fark etmek öteki
 *    bütün önerilerin başlangıcıdır.
 *  - Ortamlar bir meslek önerisi değildir; meslek için ilgi testlerine yönlendirilir.
 *  - Yetişkin metni yalnızca öğrenci metni okula özgü olduğunda yazılır.
 */
export const duygusalZekaBilesenleriRoadmap: RoadmapTemplate = {
  version: 'duygusal-zeka-bilesenleri-yol-haritasi-1',
  planningScale: 'attending_emotions',
  planningTitle: 'Duygularına dikkat',
  wellbeing: { scale: 'responsive_distress', group: 'high', link: null },
  studyIntro: {
    student:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Duygularınla ilgili eğilimlerin, bu yöntemleri nasıl kullanmanın ve zor anlarda kendine nasıl destek olmanın sana kolay geleceğini gösterebilir.',
    parent:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kitaba bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Çocuğunuzun duygularıyla ilgili eğilimleri, bu yöntemleri nasıl kullanmanın ve zor anlarda ona nasıl destek olmanın kolay olacağını gösterebilir.',
    adult:
      'Araştırmalara göre herkes için en etkili yöntemler aynıdır: öğrendiğini kaynağa bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak. Duygularınla ilgili eğilimlerin, bu yöntemleri nasıl kullanmanın ve zor anlarda kendine nasıl destek olmanın sana kolay geleceğini gösterebilir.',
  },
  settingsNote: {
    student:
      'Duygularınla ilgili eğilimler tek başına meslek seçtirmez: aynı meslekte çok farklı insanlar başarılı olur. Bu liste yalnızca hangi ortamlarda kendini daha rahat hissedebileceğine dair bir ipucudur. Alan ve meslek seçerken ilgilerine de bakmak gerekir.',
    parent:
      'Duygularla ilgili eğilimler tek başına meslek seçtirmez: aynı meslekte çok farklı insanlar başarılı olur. Bu liste, çocuğunuzun hangi ortamlarda kendini daha rahat hissedebileceğine dair bir ipucudur. Alan ve meslek seçiminde ilgilerine de bakmanızı öneririz.',
  },
  firstWeek: {
    student:
      'Raporundaki en belirgin eğilimlerini düşün. Bu hafta onların sana nerede yardım ettiğini ve nerede zorladığını iki üç cümleyle bir deftere yaz.',
    parent: bf.firstWeek.parent,
  },
  lastWeek: bf.lastWeek,
  nextTests: bf.nextTests,
  approach: {
    positive_expressivity: {
      low: 'Duygularını göstermesi için onu zorlamayın; birlikte yürümek ya da yemek hazırlamak gibi sakin ortak işler, söze dökmeden yakınlık kurmanıza fırsat verebilir.',
      average: 'Sevinçli anları birlikte paylaşabileceğiniz küçük aile alışkanlıkları oluşturabilirsiniz.',
      high: 'Sevincine ve coşkusuna ortak olun; neşesini paylaştığında ona zaman ayırın.',
    },
    negative_expressivity: {
      low: 'Duygularını anlatması için baskı yapmayın; yazarak ya da bir mesajla anlatmanın da bir yol olduğunu söyleyin.',
      average: 'Olumsuz duygularını gösterdiğinde de onu dinlediğinizi hissettirin.',
      high: 'Duygularını açıkça söylemesini olağan karşılayın; öfkeli bir anda sesinizi alçak ve sakin tutmanız ona da yol gösterir.',
    },
    attending_emotions: {
      low: 'Kendi duygularınızı da günlük konuşmalarda adlandırın: "Bugün biraz yorgunum" ya da "Buna çok sevindim" gibi.',
      average: 'Duygularını adlandırmasına yardım edebilirsiniz: örneğin kızgın mı yoksa kırgın mı olduğunu birlikte ayırt edin.',
      high: 'Duygularını anlattığında onları ciddiye alın ve dinleyin.',
    },
    emotion_decisions: {
      low: 'Kararlarında mantığına güvenin; aile kararlarında siz de gerekçenizin yanında ne hissettiğinizi söyleyerek örnek olabilirsiniz.',
      average: 'Kararlarında hem gerekçelerini hem de ne hissettiğini konuşabilirsiniz.',
      high: 'Bir karar verirken içinden gelene saygı gösterin; önemli bir kararı bir gece bekletip ertesi gün yeniden konuşmayı önerebilirsiniz.',
    },
    responsive_joy: {
      low: 'Neşeli ortamlara katılması için onu zorlamayın; kendi sevdiği şeyleri (bir oyun, bir müzik, bir başarı) anlattığında ilgiyle dinleyin.',
      average: 'Hem kalabalık hem sakin etkinliklere yer açmak ona iyi gelebilir.',
      high: 'Arkadaşlarıyla birlikte yapabileceği etkinliklere fırsat verin.',
    },
    responsive_distress: {
      low: 'Sakinliğini takdir edin; zor bir dönem geçiren bir arkadaşı olduğunda ona nasıl destek olabileceğini birlikte düşünün.',
      average: 'Zor zamanlarda onu dinlemeye hazır olduğunuzu hissettirin.',
      high: 'Üzüldüğünde duygularını küçümsemeden dinleyin; hemen çözüm önermek yerine önce ne hissettiğini anlatmasına fırsat verin.',
    },
    empathic_concern: {
      low: 'Öğüt vermek yerine, bir yakınınızı ziyaret ettiğinizde ya da birine yardım ettiğinizde onu da yanınıza alın.',
      average: 'Başkalarına yardım ettiği anları fark ettiğinizi ona söyleyin.',
      high: 'Başkalarının derdini dert edindiğinde onu dinleyin; her sorunu onun çözmesi gerekmediğini hatırlatın.',
    },
  },
  scales: {
    positive_expressivity: {
      color: '#ee6a36',
      study: {
        high: {
          student:
            'Sevincini ve heyecanını kolayca gösteriyorsun; bu enerji birlikte çalışırken başkalarını da harekete geçirebilir. Öğrendiğin bir konuyu heyecanla birine anlatmak, aynı zamanda en etkili yöntemlerden birini kullanmak demektir: anlatırken takıldığın yer, tekrar etmen gereken yerdir. Küçük başarılarını kutlamak da çalışmayı sürdürmeni kolaylaştırabilir.',
          parent:
            'Çocuğunuz sevincini ve heyecanını kolayca gösteriyor; bu enerji birlikte çalışırken başkalarını da harekete geçirebilir. Öğrendiği bir konuyu size heyecanla anlatmasına fırsat verin: anlatırken takıldığı yer, tekrar etmesi gereken yerdir. Küçük ilerlemelerini birlikte fark etmek çalışmayı sürdürmesini kolaylaştırabilir.',
        },
        average: {
          student:
            'Sevincini bazı durumlarda açıkça gösteriyor, bazen içinde yaşıyorsun. Çalışırken de iki yolu kullanabilirsin: öğrendiğini bazen birine anlatarak, bazen de kendi kendine sessizce hatırlamaya çalışarak pekiştir. Hangisinden sonra daha çok hatırladığını kendini sınayarak gözle.',
          parent:
            'Çocuğunuz sevincini bazı durumlarda açıkça gösteriyor, bazen içinde yaşıyor. Öğrendiklerini bazen size anlatarak, bazen de kendi kendine hatırlamaya çalışarak pekiştirmesi iyi bir denge kurar.',
        },
        low: {
          student:
            'Sevincini ve sevgini çoğu zaman içinde yaşıyorsun. Kendini sınamak için bunu dışa vurman gerekmez: çalışmanın sonunda kitabı kapatıp hatırladıklarını yazmak, birine anlatmak kadar işe yarar. İlerlediğini gördüğünde bunu kendine not etmek, çabanı fark etmeni kolaylaştırabilir.',
          parent:
            'Çocuğunuz sevincini ve sevgisini çoğu zaman içinde yaşıyor olabilir. Öğrendiğini sınamak için bunu dışa vurması gerekmez: çalışmanın sonunda kitaba bakmadan hatırladıklarını yazması da çok işe yarar. Başarılarını gösterişle kutlamasa da çabasını fark ettiğinizi ona sakin bir dille söyleyebilirsiniz.',
          adult:
            'Sevincini ve sevgini çoğu zaman içinde yaşıyorsun. Kendini sınamak için bunu dışa vurman gerekmez: çalışmanın sonunda kaynağı kapatıp hatırladıklarını yazmak, birine anlatmak kadar işe yarar. İlerlediğini gördüğünde bunu kendine not etmek, çabanı fark etmeni kolaylaştırabilir.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta öğrendiğin bir konuyu birine 5 dakikada anlat; anlatamadığın yerleri not al ve ertesi gün yeniden çalış.',
          parent: 'Çocuğunuzdan bu hafta öğrendiği bir konuyu size 5 dakikada anlatmasını isteyin; anlatamadığı yerleri birlikte not alın.',
        },
        average: {
          student:
            'Bir konuyu bir gün birine anlatarak, başka bir gün sessizce yazarak tekrar et; hafta sonunda hangisinden sonra daha çok hatırladığını kendini sınayarak karşılaştır.',
          parent: 'Çocuğunuzla, öğrendiklerini size anlattığında mı yoksa kendi kendine yazdığında mı daha çok hatırladığını birlikte gözlemleyin.',
        },
        low: {
          student: 'Bu hafta her gün emek verdiğin ve iyi giden bir şeyi tek cümleyle yaz; hafta sonunda listene bak.',
          parent: 'Bu hafta çocuğunuzun emek verdiği bir şeyi fark ettiğinizde bunu ona abartmadan ve sakin bir dille söyleyin.',
        },
      },
      settings: {
        high: 'İnsanlarla sıcak ve canlı iletişimin kurulduğu, coşkunun paylaşıldığı ortamlar',
        low: 'Ölçülü ve sakin iletişimin olduğu, işin kendisine odaklanılan ortamlar',
      },
    },
    negative_expressivity: {
      color: '#df4777',
      study: {
        high: {
          student:
            'Zorlandığında ya da sıkıldığında bunu saklamıyorsun. Bu açıklık, takıldığın yerde yardım istemeni kolaylaştırabilir: anlamadığın bir konuyu hemen bir arkadaşına ya da öğretmenine sor. Çok gergin ya da kızgın olduğun anlarda çalışmaya kısa bir mola verip birkaç derin nefesle başlamak işine yarayabilir.',
          parent:
            'Çocuğunuz zorlandığında ya da sıkıldığında bunu saklamıyor olabilir. Bu açıklık, takıldığı yerde yardım istemesini kolaylaştırır; zorlandığını söylediğinde yargılamadan dinleyin. Çok gergin ya da kızgın olduğu anlarda çalışmaya kısa bir mola verip sonra devam etmesini önerebilirsiniz.',
          adult:
            'Zorlandığında ya da sıkıldığında bunu saklamıyorsun. Bu açıklık, takıldığın yerde yardım istemeni kolaylaştırabilir: anlamadığın bir konuyu hemen birine sor. Çok gergin ya da kızgın olduğun anlarda işe kısa bir mola verip birkaç derin nefesle başlamak işine yarayabilir.',
        },
        average: {
          student:
            'Olumsuz duygularını bazen gösteriyor, bazen kendine saklıyorsun. Bir konuda zorlandığında bunu içinde tutmak yerine birine söylemek, yardım almanın en kısa yoludur. Zorlandığın konuları bir listeye yazmak da neyi tekrar etmen gerektiğini gösterir.',
          parent:
            'Çocuğunuz olumsuz duygularını bazen gösteriyor, bazen kendine saklıyor. Zorlandığı konuları size ya da öğretmenine rahatça söyleyebilmesi yardım almasını kolaylaştırır.',
        },
        low: {
          student:
            'Olumsuz duygularını çoğu zaman kendine saklıyorsun; bu, sakin görünmeni sağlayabilir ama zorlandığını başkalarının fark etmesini güçleştirebilir. Takıldığın bir konuyu birine sormayı kendine küçük bir görev olarak ver. Zor bir günün sonunda yaşadıklarını birkaç dakika kâğıda yazmak da duygularını toparlamana yardım edebilir.',
          parent:
            'Çocuğunuz olumsuz duygularını çoğu zaman kendine saklıyor olabilir; bu yüzden zorlandığını fark etmek güç olabilir. Takıldığı bir konuyu birine sormayı kendine küçük bir görev olarak vermesini önerebilirsiniz. Zor bir günün sonunda yaşadıklarını birkaç dakika bir kâğıda yazması da duygularını toparlamasına yardım edebilir.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta çok kızgın ya da gergin hissettiğinde konuşmadan ya da çalışmaya dönmeden önce 4 saniye nefes al, 4 saniye tut, 6 saniyede ver; birkaç kez tekrarla.',
          parent: 'Çocuğunuzla, öfkeli ya da gergin anlarda neyin onu sakinleştirdiğini konuşun; sakinleştikten sonra konuşmayı birlikte deneyin.',
        },
        average: {
          student: 'Bu hafta zorlandığın bir konuyu ya da durumu en az bir kez birine söyle ve birlikte bir çözüm ara.',
          parent: 'Bu hafta çocuğunuza zorlandığı bir konuyu sorun; çözümü onun yerine bulmadan birlikte düşünün.',
        },
        low: {
          student: 'Bu hafta takıldığın bir soruyu ya da konuyu en az bir kez birine sor; sonra nasıl hissettiğini not et.',
          parent: 'Bu hafta sakin bir anda çocuğunuza "Bu hafta seni en çok ne zorladı?" diye sorun ve yalnızca dinleyin.',
        },
      },
      settings: {
        high: 'Duyguların ve görüşlerin açıkça konuşulabildiği, geri bildirimin rahatça verildiği ortamlar',
        low: 'Sakinliğin ve soğukkanlılığın değer gördüğü, ölçülü iletişimin olduğu ortamlar',
      },
    },
    attending_emotions: {
      color: '#7a4ee6',
      study: {
        high: {
          student:
            'Ne hissettiğini fark etmek senin güçlü yanın. Bunu çalışırken kullan: yorulduğunu ya da sıkıldığını erken fark ettiğinde kısa bir mola ver, sonra kaldığın yerden kitaba bakmadan hatırlamaya çalışarak devam et. Hangi konuların seni gerdiğini fark etmek, onlara erken başlamanı da kolaylaştırır.',
          parent:
            'Çocuğunuz ne hissettiğini fark ediyor olabilir; bu, çalışırken işine yarar. Yorulduğunu ya da sıkıldığını söylediğinde kısa bir mola vermesine izin verin. Hangi konuların onu gerdiğini konuşmak, o konulara erken başlamasını kolaylaştırır.',
          adult:
            'Ne hissettiğini fark etmek senin güçlü yanın. Bunu çalışırken kullan: yorulduğunu ya da sıkıldığını erken fark ettiğinde kısa bir mola ver, sonra kaldığın yerden kaynağa bakmadan hatırlamaya çalışarak devam et. Hangi işlerin seni gerdiğini fark etmek, onlara erken başlamanı da kolaylaştırır.',
        },
        average: {
          student:
            'Duygularını çoğu zaman fark ediyorsun. Çalışmanın sonunda bir dakika durup "Bugün nasıl çalıştım, ne hissettim?" diye sormak, hangi saatlerde ve hangi konularda daha verimli olduğunu görmeni sağlar.',
          parent:
            'Çocuğunuz duygularını çoğu zaman fark ediyor. Çalışmanın sonunda bir dakika durup nasıl çalıştığını ve ne hissettiğini düşünmesi, ne zaman daha verimli olduğunu görmesini sağlar.',
        },
        low: {
          student:
            'Ne hissettiğinin üzerinde pek durmuyorsun; bu, işine odaklanmanı kolaylaştırabilir. Yine de yorgunluk ya da sıkılma fark edilmediğinde çalışma uzar ama verim düşebilir. Çalışırken her 25–30 dakikada bir kısa bir mola ver ve kendine "Şu an nasılım?" diye sor.',
          parent:
            'Çocuğunuz ne hissettiğinin üzerinde pek durmuyor olabilir; bu, işine odaklanmasını kolaylaştırabilir. Yine de yorgunluğu fark edilmediğinde çalışma uzar ama verim düşebilir. Belirli aralıklarla kısa molalar vermesini önerebilirsiniz.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta bir duyguyu fark ettiğinde ona göre küçük bir adım seç: yorgunsan 5 dakika mola, gerginsen birkaç derin nefes, sıkıldıysan konuyu değiştirip karışık çalışmak.',
          parent:
            'Çocuğunuzla, bir duyguyu fark ettiğinde neler yapabileceğini konuşun: yorgunsa kısa bir mola, gerginse birkaç derin nefes, sıkıldıysa konuyu değiştirmek.',
        },
        average: {
          student: 'Bu hafta her akşam günün en güçlü duygusunu ve nedenini tek cümleyle yaz.',
          parent: 'Bu hafta akşam yemeğinde, çocuğunuz da dâhil herkesin günün en güçlü duygusunu ve nedenini tek cümleyle söylemesini deneyin.',
        },
        low: {
          student: 'Bu hafta günde iki kez kendine "Şu an ne hissediyorum?" diye sor ve cevabı tek kelimeyle not et.',
          parent: 'Bu hafta gün içinde çocuğunuza nasıl hissettiğini sorun ve cevabını yorum yapmadan dinleyin.',
        },
      },
      settings: {
        high: 'Düşünmeye ve kendini ifade etmeye zaman tanıyan ortamlar',
        low: 'Somut işlerin ve hızlı eylemin öne çıktığı ortamlar',
      },
    },
    emotion_decisions: {
      color: '#2f5ce0',
      study: {
        high: {
          student:
            'Kararlarında içinden gelene kulak veriyorsun; ilgini çeken bir konuya kendini kolayca verebilirsin. İlgini çekmeyen derslerde ise o günkü ruh hâline göre davranmak işleri erteletebilir. Bunun için çalışma saatini baştan belirle ve sıkıcı bulduğun konuyu ilgini çeken bir konuyla aynı güne koy.',
          parent:
            'Çocuğunuz kararlarında içinden gelene kulak veriyor olabilir; ilgisini çeken konulara kendini kolayca verebilir. İlgisini çekmeyen derslerde ruh hâline göre davranmak işleri erteletebilir. Çalışma saatini baştan birlikte belirlemek ve zor konuyu sevdiği bir konuyla aynı güne koymak yardımcı olabilir.',
          adult:
            'Kararlarında içinden gelene kulak veriyorsun; ilgini çeken bir işe kendini kolayca verebilirsin. İlgini çekmeyen işlerde ise o günkü ruh hâline göre davranmak işleri erteletebilir. Bunun için çalışma saatini baştan belirle ve sıkıcı bulduğun işi sevdiğin bir işle aynı güne koy.',
        },
        average: {
          student:
            'Karar verirken hem aklını hem kalbini dinliyorsun. Çalışırken de bu dengeyi kullan: neyi çalışacağını planla, ama hangi sırayla çalışacağını o günkü enerjine göre seç.',
          parent:
            'Çocuğunuz karar verirken hem aklını hem kalbini dinliyor. Neyi çalışacağını birlikte planlayıp hangi sırayla çalışacağını ona bırakmak bu dengeyi destekler.',
        },
        low: {
          student:
            'Kararlarını mantığa ve gerçeklere göre veriyorsun; plan yapmak ve ona uymak sana kolay gelebilir. Bunu etkili yöntemlerle birleştir: tekrarlarını takvimde günlere yay ve kendini düzenli olarak sına. Bir alan ya da bölüm seçerken ise neyin seni gerçekten heyecanlandırdığını da hesaba kat.',
          parent:
            'Çocuğunuz kararlarını mantığa ve gerçeklere göre veriyor olabilir; plan yapmak ona kolay gelebilir. Tekrarlarını günlere yayan bir plan yapmasına destek olun. Alan ya da bölüm seçimi gibi büyük kararlarda ona neyin heyecan verdiğini de sorun.',
          adult:
            'Kararlarını mantığa ve gerçeklere göre veriyorsun; plan yapmak ve ona uymak sana kolay gelebilir. Bunu etkili yöntemlerle birleştir: tekrarlarını takvimde günlere yay ve kendini düzenli olarak sına. İş ve kariyer kararlarında ise neyin seni gerçekten heyecanlandırdığını da hesaba kat.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta en az sevdiğin dersi sevdiğin bir dersle aynı güne koy ve önce zor olanla başla.',
          parent:
            'Bu hafta çocuğunuzla birlikte çalışma saatlerini belirleyin; en az sevdiği dersi sevdiği bir dersle aynı güne koymasını önerin.',
          adult: 'Bu hafta en az sevdiğin işi sevdiğin bir işle aynı güne koy ve önce zor olanla başla.',
        },
        average: {
          student: 'Bu hafta önemli bir kararı verirken iki liste yap: "Ne düşünüyorum?" ve "Ne hissediyorum?". Sonra ikisini karşılaştır.',
          parent: 'Bu hafta küçük bir aile kararında çocuğunuza hem ne düşündüğünü hem ne hissettiğini sorun.',
        },
        low: {
          student: 'Bu hafta bir kararı verirken gerekçelerinin yanına "Bu konuda ne hissediyorum?" sorusunun cevabını da tek cümleyle ekle.',
          parent: 'Bu hafta çocuğunuzla bir kararı konuşurken gerekçelerinin yanında ne hissettiğini de sorun.',
        },
      },
      settings: {
        high: 'Değerlerin ve insan ilişkilerinin önemsendiği, kişisel anlam taşıyan işlerin yapıldığı ortamlar',
        low: 'Kararların veriye, kurallara ve mantığa dayandığı ortamlar',
      },
    },
    responsive_joy: {
      color: '#d28a14',
      study: {
        high: {
          student:
            'Çevrendekilerin neşesi seni de canlandırıyor. Bunu çalışmaya taşı: bir arkadaşınla birlikte çalışın ve kitapları kapatıp birbirinize soru sorun; ilerlemelerinizi birlikte kutlamak motivasyonunuzu artırabilir. Sohbete kaymamak için başta hedef ve süre belirleyin.',
          parent:
            'Çocuğunuzu çevresindekilerin neşesi canlandırıyor olabilir. Bir arkadaşıyla birlikte, kitapları kapatıp birbirlerine soru sorarak çalışması ona iyi gelebilir. Sohbete kaymamaları için başta hedef ve süre belirlemelerini önerebilirsiniz.',
          adult:
            'Çevrendekilerin neşesi seni de canlandırıyor. Bunu çalışmaya taşı: biriyle birlikte çalışın ve kaynağa bakmadan birbirinize soru sorun; ilerlemelerinizi birlikte kutlamak motivasyonunuzu artırabilir. Sohbete kaymamak için başta hedef ve süre belirleyin.',
        },
        average: {
          student:
            'Başkalarının sevincine çoğu zaman ortak oluyorsun, bazen de kendi hâlinde kalıyorsun. Bazı konuları bir arkadaşınla, bazılarını tek başına çalışmak bu iki yanını da kullanmanı sağlar.',
          parent:
            'Çocuğunuz başkalarının sevincine çoğu zaman ortak oluyor, bazen de kendi hâlinde kalıyor. Bazı konuları bir arkadaşıyla, bazılarını tek başına çalışması iyi bir denge kurar.',
        },
        low: {
          student:
            'Çevrendekilerin coşkusundan pek etkilenmiyor, kendi ruh hâlinde kalabiliyorsun. Bu, kalabalık ve gürültülü ortamlarda bile kendi işine odaklanmanı kolaylaştırabilir. Kendi hedeflerini kendin belirle ve ilerlemeni bir çizelgede izle; çabanı görmek seni motive edebilir.',
          parent:
            'Çocuğunuz çevresindekilerin coşkusundan pek etkilenmiyor, kendi ruh hâlinde kalabiliyor olabilir. Bu, kendi işine odaklanmasını kolaylaştırabilir. Kendi hedeflerini belirleyip ilerlemesini bir çizelgede izlemesine destek olabilirsiniz.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir arkadaşınla 20 dakikalık bir soru-cevap çalışması yapın; sonunda ikinizin de öğrendiği bir şeyi birbirinize söyleyin.',
          parent: 'Çocuğunuza bu hafta bir arkadaşıyla 20 dakikalık bir soru-cevap çalışması yapmasını önerin.',
          adult:
            'Bu hafta öğrendiğin bir konuyu biriyle 20 dakika soru-cevap yaparak tekrar edin; sonunda ikinizin de öğrendiği bir şeyi birbirinize söyleyin.',
        },
        average: {
          student: 'Bu hafta bir konuyu yalnız, bir konuyu bir arkadaşınla çalış; hangisinde daha keyifli ve verimli olduğunu not et.',
          parent: 'Bu hafta çocuğunuzla, yalnız mı yoksa bir arkadaşıyla mı daha keyifli ve verimli çalıştığını konuşun.',
          adult: 'Bu hafta bir konuyu tek başına, bir konuyu biriyle birlikte çalış; hangisinde daha keyifli ve verimli olduğunu not et.',
        },
        low: {
          student: 'Bu hafta kendine üç küçük çalışma hedefi koy ve her birini bitirdiğinde çizelgende işaretle.',
          parent: 'Bu hafta çocuğunuzla birlikte üç küçük hedef belirleyin ve ilerlemesini bir çizelgede izlemesini önerin.',
        },
      },
      settings: {
        high: 'Neşeli, takım ruhunun güçlü olduğu ve başarıların birlikte kutlandığı ortamlar',
        low: 'Sakin, bağımsız çalışılabilen ve kişisel hedeflerin öne çıktığı ortamlar',
      },
    },
    responsive_distress: {
      color: '#0e9c8c',
      study: {
        high: {
          student:
            'Üzücü olaylardan ve gergin anlardan derinden etkilenebiliyorsun. Bu duyarlılık başkalarını anlamana yardım edebilir; ama yorgun düştüğün günlerde çalışmak zorlaşabilir. Böyle günlerde planını küçült ama bırakma: 20 dakikalık kısa bir tekrar bile işe yarayabilir. Başkalarının acısı seni çok yorduğunda üzücü haberlere ve görüntülere bir süre ara vermek, yeterince uyumak ve sevdiğin sakin bir işle dinlenmek yükünü hafifletebilir.',
          parent:
            'Çocuğunuz üzücü olaylardan ve gergin anlardan derinden etkilenebiliyor. Bu duyarlılık başkalarını anlamasına yardım edebilir; ama yorgun düştüğü günlerde çalışmak zorlaşabilir. Böyle günlerde planı küçültmesine ama bırakmamasına destek olun. Başkalarının acısı onu çok yorduğunda üzücü haberlere bir süre ara vermesi, uykusunu koruması ve sevdiği sakin bir işle dinlenmesi yükünü hafifletebilir.',
          adult:
            'Üzücü olaylardan ve gergin anlardan derinden etkilenebiliyorsun. Bu duyarlılık başkalarını anlamana yardım edebilir; ama yorgun düştüğün günlerde çalışmak zorlaşabilir. Böyle günlerde planını küçült ama bırakma: 20 dakikalık kısa bir çalışma bile işe yarayabilir. Başkalarının acısı seni çok yorduğunda üzücü haberlere ve görüntülere bir süre ara vermek, yeterince uyumak ve sevdiğin sakin bir işle dinlenmek yükünü hafifletebilir.',
        },
        average: {
          student:
            'Üzücü olaylardan etkileniyor, ama çoğu zaman sakinliğini koruyabiliyorsun. Seni zorlayan konulara erken başlamak, sınav dönemlerinde de bu sakinliği korumana yardım edebilir.',
          parent:
            'Çocuğunuz üzücü olaylardan etkileniyor, ama çoğu zaman sakinliğini koruyabiliyor. Zorlandığı konulara erken başlaması, sınav dönemlerinde de sakin kalmasına yardım edebilir.',
          adult:
            'Üzücü olaylardan etkileniyor, ama çoğu zaman sakinliğini koruyabiliyorsun. Seni zorlayan işlere erken başlamak, yoğun dönemlerde de bu sakinliği korumana yardım edebilir.',
        },
        low: {
          student:
            'Gergin anlarda sakin kalabiliyorsun; bu, sınav gibi baskılı durumlarda işine yarayabilir. Sakinliğin "Nasılsa yetişir" düşüncesine dönüşmesin: tekrarlarını günlere yay ve kendini düzenli olarak sına. Zorlanan bir arkadaşına destek olmak da hem ona hem sana iyi gelebilir.',
          parent:
            'Çocuğunuz gergin anlarda sakin kalabiliyor olabilir; bu, sınav gibi baskılı durumlarda işine yarayabilir. Sakinliğin son ana bırakmaya dönüşmemesi için tekrarlarını günlere yayan küçük bir plan yapmasına destek olabilirsiniz.',
          adult:
            'Gergin anlarda sakin kalabiliyorsun; bu, baskılı durumlarda işine yarayabilir. Sakinliğin "Nasılsa yetişir" düşüncesine dönüşmesin: işlerini günlere yay ve kendini düzenli olarak sına. Zorlanan birine destek olmak da hem ona hem sana iyi gelebilir.',
        },
      },
      action: {
        high: {
          student:
            'Bu hafta seni üzen ya da geren bir şey olduğunda duygularını birkaç dakika kâğıda yaz ya da güvendiğin biriyle konuş; o akşam uyku saatini koru.',
          parent:
            'Bu hafta çocuğunuzu dinlemek için sakin bir zaman ayırın: "Bu hafta seni en çok ne üzdü ya da gerdi?" diye sorun ve uyku saatini birlikte koruyun.',
        },
        average: {
          student: 'Bu hafta seni en çok zorlayan konuyu belirle ve ona haftada üç kez 15 dakika ayır.',
          parent: 'Bu hafta çocuğunuza onu en çok neyin zorladığını yargılamadan sorun ve o konuya erken başlaması için küçük bir plan yapın.',
        },
        low: {
          student: 'Bu hafta bir sonraki sınavının tarihinden geriye doğru üç tekrar günü belirle ve takvimine yaz.',
          parent: 'Bu hafta çocuğunuzla bir sonraki sınav tarihinden geriye doğru üç tekrar günü belirleyin ve takvime yazın.',
          adult: 'Bu hafta önemli bir işin tarihinden geriye doğru üç hazırlık günü belirle ve takvimine yaz.',
        },
      },
      settings: {
        high: 'Destekleyici, öngörülebilir ve gerginliğin az olduğu ortamlar',
        low: 'Soğukkanlılığın gerektiği, baskı altında sakin kalmanın değer gördüğü ortamlar',
      },
    },
    empathic_concern: {
      color: '#5a9e2f',
      study: {
        high: {
          student:
            'Başkalarının iyiliğini önemsiyorsun; arkadaşlarına yardım etmek sana doğal geliyor. Bir arkadaşına konu anlatmak hem ona hem sana yarar, çünkü anlatırken kendi bilgini de sınarsın. Yardım ederken kendi çalışma zamanını korumayı unutma.',
          parent:
            'Çocuğunuz başkalarının iyiliğini önemsiyor; arkadaşlarına yardım etmek ona doğal geliyor olabilir. Arkadaşlarına konu anlatması hem onlara hem kendisine yarar. Yardım ederken kendi çalışma zamanını korumasına destek olun.',
          adult:
            'Başkalarının iyiliğini önemsiyorsun; insanlara yardım etmek sana doğal geliyor. Bildiğini birine anlatmak hem ona hem sana yarar, çünkü anlatırken kendi bilgini de sınarsın. Yardım ederken kendi zamanını korumayı unutma.',
        },
        average: {
          student:
            'Başkalarının iyiliğini çoğu zaman önemsiyorsun. Grup çalışmalarında herkesin görüşünü sormak ve görevleri baştan paylaşmak, işi hem kolaylaştırır hem de herkesi işin içine katar.',
          parent:
            'Çocuğunuz başkalarının iyiliğini çoğu zaman önemsiyor. Grup çalışmalarında herkesin görüşünü sormasını ve görevleri baştan paylaşmayı önerebilirsiniz.',
          adult:
            'Başkalarının iyiliğini çoğu zaman önemsiyorsun. Ortak işlerde herkesin görüşünü sormak ve görevleri baştan paylaşmak, işi hem kolaylaştırır hem de herkesi işin içine katar.',
        },
        low: {
          student:
            'Olaylara mesafeli ve nesnel bakabiliyorsun; bu, bir konuyu tarafsız değerlendirmeni kolaylaştırabilir. Öğrenirken bunu kullan: tarih ya da edebiyat gibi derslerde olayları farklı kişilerin gözünden anlatmayı dene; bu, konuyu farklı yönleriyle görmeni sağlar.',
          parent:
            'Çocuğunuz olaylara mesafeli ve nesnel bakabiliyor olabilir; bu, bir konuyu tarafsız değerlendirmesini kolaylaştırabilir. Okuduğu bir hikâyeyi ya da tarihî bir olayı farklı kişilerin gözünden anlatmasını isteyebilirsiniz; bu, başkalarının yerine kendini koyma fırsatı da sunar.',
          adult:
            'Olaylara mesafeli ve nesnel bakabiliyorsun; bu, bir konuyu tarafsız değerlendirmeni kolaylaştırabilir. Öğrenirken ya da bir karar verirken olayı farklı kişilerin gözünden anlatmayı dene; bu, konuyu farklı yönleriyle görmeni sağlar.',
        },
      },
      action: {
        high: {
          student: 'Bu hafta bir arkadaşına bir konuyu anlat, ama önce kendi planındaki işi bitir.',
          parent: 'Çocuğunuzla, başkalarına yardım ederken kendi işini nasıl koruyacağını konuşun.',
          adult: 'Bu hafta birine yardım etmeden önce kendi önceliğini bitir; sonra gönül rahatlığıyla yardım et.',
        },
        average: {
          student: 'Bu hafta bir grup çalışmasında herkesin görüşünü sor ve görevleri yazılı olarak paylaşmayı öner.',
          parent: 'Bu hafta çocuğunuzla bir grup çalışmasında herkesin nasıl işin içine katılabileceğini konuşun.',
          adult: 'Bu hafta ortak bir işte herkesin görüşünü sor ve görevleri yazılı olarak paylaşmayı öner.',
        },
        low: {
          student: 'Bu hafta okuduğun bir hikâyeyi ya da bir olayı, içindeki farklı bir kişinin gözünden üç cümleyle anlat.',
          parent: 'Bu hafta çocuğunuzla birlikte izlediğiniz bir film ya da okuduğunuz bir hikâyede karakterlerin neler hissetmiş olabileceğini konuşun.',
        },
      },
      settings: {
        high: 'İnsanlara yardım etmenin, iş birliğinin ve desteğin öne çıktığı ortamlar',
        low: 'Nesnel ölçütlerin ve görev odaklı çalışmanın öne çıktığı ortamlar',
      },
    },
  },
  // Poropat (2009) Sorumluluk boyutuyla, Jamieson ve ark. (2010) ile Ramirez ve Beilock (2011) sınav kaygısı önerileriyle
  // ilgilidir; bu testte kullanılmaz.
  sources: bf.sources.filter((s) => !/^(Poropat|Jamieson|Ramirez)/.test(s.text)),
};
