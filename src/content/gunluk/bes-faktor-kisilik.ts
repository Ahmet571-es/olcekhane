import type { SurveyDaily } from './types';

/**
 * Beş Faktör Kişilik Profili: günlük hayatta nasıl görünür (6. sınıftan mezuna; yetişkinlere açık değil).
 * Şablonun beş düzeyi üç gruba toplanır: belirgin biçimde düşük ve düşük → düşük, orta → orta, yüksek ve belirgin biçimde
 * yüksek → yüksek. Kişilik boyutlarında iyi ya da kötü uç yoktur (src/content/reports/bes-faktor.ts): her uç bir kolaylık
 * ve bir zorlukla anlatılır; kişi etiketlenmez, davranış anlatılır. Duygusal dengenin düşük ucu destek kutusunu açabildiği
 * için yumuşak yazıldı: belirti sayılmaz, zor anın yanında bir dayanak söylenir. Merak ve hayal gücünün örnekleri zekâ ya da
 * kavrama hızı gibi okunmaz ("Bir şeyleri çabuk kavrarım" maddesine dayanan örnek yoktur).
 */
export const besFaktorDaily: SurveyDaily = {
  kind: 'survey',
  version: 'bes-faktor-gunluk-1',
  scales: {
    /*
     * Dışadönüklük: "Sohbeti genellikle ben başlatırım", "Kalabalık ortamlarda birçok farklı kişiyle konuşurum", "İlgi odağı
     * olmak beni rahatsız etmez", "İnsanların arasında kendimi rahat hissederim"; ters: "Kalabalıkta geri planda kalmayı
     * tercih ederim", "Tanımadığım insanların yanında sessiz olurum", "Dikkatleri üzerime çekmekten hoşlanmam", "Çok konuşmam".
     */
    extraversion: {
      poles: { low: 'Önce dinler', high: 'Sohbeti başlatır' },
      bands: {
        low: {
          student: {
            school: 'Sınıfta söz almadan önce düşünmeyi ve çoğu zaman dinlemeyi seçebilirsin.',
            friends: 'Kalabalık yerine bir iki yakın arkadaşla vakit geçirmek sana daha rahat gelebilir. Tanımadığın biriyle sohbete başlamak ise zor gelebilir.',
            home: 'Kalabalık bir günün ardından kendi başına sakin bir zaman geçirmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta söz almadan önce düşünmeyi ve çoğu zaman dinlemeyi seçebilir.',
            friends: 'Kalabalık yerine bir iki yakın arkadaşla vakit geçirmek ona daha rahat gelebilir. Tanımadığı biriyle sohbete başlamak ise zor gelebilir.',
            home: 'Kalabalık bir günün ardından kendi başına sakin bir zaman geçirmek ona iyi gelebilir.',
          },
        },
        average: {
          student: {
            school: 'Bazı derslerde söz alıp konuşabilir, bazılarında dinlemeyi seçebilirsin.',
            friends: 'Tanıdığın kişilerle rahat konuşurken tanımadığın birinin yanında önce biraz sessiz kalabilirsin.',
            home: 'Kalabalık bir günden sonra yalnız kalmak, sessiz bir günden sonra da birileriyle konuşmak isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde söz alıp konuşabilir, bazılarında dinlemeyi seçebilir.',
            friends: 'Tanıdığı kişilerle rahat konuşurken tanımadığı birinin yanında önce biraz sessiz kalabilir.',
            home: 'Kalabalık bir günden sonra yalnız kalmak, sessiz bir günden sonra da birileriyle konuşmak isteyebilir.',
          },
        },
        high: {
          student: {
            school: 'Sınıfta söz almak ya da bir sunum yapmak sana çoğu zaman kolay gelebilir.',
            friends: 'Yeni tanıştığın biriyle sohbeti sen başlatabilir, kalabalıkta pek çok kişiyle konuşabilirsin.',
            home: 'Uzun süre tek başına kalınca canın sıkılabilir; birileriyle konuşmak seni canlandırabilir.',
          },
          parent: {
            school: 'Sınıfta söz almak ya da bir sunum yapmak çocuğunuza çoğu zaman kolay gelebilir.',
            friends: 'Yeni tanıştığı biriyle sohbeti o başlatabilir, kalabalıkta pek çok kişiyle konuşabilir.',
            home: 'Uzun süre tek başına kalınca canı sıkılabilir; birileriyle konuşmak onu canlandırabilir.',
          },
        },
      },
    },
    /*
     * Uyumluluk: "İnsanlara ilgi duyarım", "Başkalarının duygularını anlar, onlara ortak olurum", "Başkalarına zaman
     * ayırırım", "Başkalarının ne hissettiğini içimde hissederim", "İnsanların yanımda rahat hissetmesini sağlarım"; ters:
     * "Başkalarının sorunları beni ilgilendirmez", "Başkalarını kıracak sözler söylerim", "Aslında diğer insanlara pek ilgi
     * duymam".
     */
    agreeableness: {
      poles: { low: 'Kendi işine odaklanır', high: 'Başkalarına zaman ayırır' },
      bands: {
        low: {
          student: {
            school: 'Grup çalışmasında duygulardan çok işin kendisine odaklanabilirsin.',
            friends: 'Düşündüğünü olduğu gibi söylemen, bazen farkında olmadan bir arkadaşını kırabilir.',
            home: 'Başkalarının sorunlarına karışmak yerine kendi işlerini yoluna koymayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında duygulardan çok işin kendisine odaklanabilir.',
            friends: 'Düşündüğünü olduğu gibi söylemesi, bazen farkında olmadan bir arkadaşını kırabilir.',
            home: 'Başkalarının sorunlarına karışmak yerine kendi işlerini yoluna koymayı seçebilir.',
          },
        },
        average: {
          student: {
            school: 'Grup çalışmasında arkadaşlarını gözetirken kendi fikrini de savunabilirsin.',
            friends: 'Bir arkadaşının derdini dinleyebilir, ama her soruna karışmak istemeyebilirsin.',
            home: 'Bazen evdekilere yardım etmek için işini bırakabilir, bazen önce kendi işini bitirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında arkadaşlarını gözetirken kendi fikrini de savunabilir.',
            friends: 'Bir arkadaşının derdini dinleyebilir, ama her soruna karışmak istemeyebilir.',
            home: 'Bazen evdekilere yardım etmek için işini bırakabilir, bazen önce kendi işini bitirebilir.',
          },
        },
        high: {
          student: {
            school: 'Grup çalışmasında herkesin rahat etmesini gözetebilir, üzgün bir sınıf arkadaşını hemen fark edebilirsin.',
            friends: 'Bir arkadaşın derdini anlatınca ona zaman ayırır, ne hissettiğini anlamaya çalışabilirsin.',
            home: 'Evdekilere yardım etmek isterken kendi işlerine zaman kalmayabilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında herkesin rahat etmesini gözetebilir, üzgün bir sınıf arkadaşını hemen fark edebilir.',
            friends: 'Bir arkadaşı derdini anlatınca ona zaman ayırır, ne hissettiğini anlamaya çalışabilir.',
            home: 'Evdekilere yardım etmek isterken kendi işlerine zaman kalmayabilir.',
          },
        },
      },
    },
    /*
     * Sorumluluk: "Her zaman hazırlıklı olurum", "Ayrıntılara dikkat ederim", "Yapmam gereken işleri hemen hallederim",
     * "Düzeni severim", "Bir plana ya da programa göre hareket ederim", "Yaptığım işte titizimdir"; ters: "Eşyalarımı
     * ortada bırakırım", "Kullandığım şeyleri yerine koymayı sık sık unuturum", "İşleri birbirine karıştırırım".
     */
    conscientiousness: {
      poles: { low: 'Anlık karar verir', high: 'Plana göre ilerler' },
      bands: {
        low: {
          student: {
            school: 'Ödevleri son güne bırakabilir ya da gereken bir şeyi evde unutabilirsin.',
            friends: 'Plan değişince kolayca uyum sağlayabilir, anlık bir öneriye hemen katılabilirsin.',
            home: 'Kullandığın eşyaları yerine koymayı unutabilir, sonra onları ararken zaman harcayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ödevleri son güne bırakabilir ya da gereken bir şeyi evde unutabilir.',
            friends: 'Plan değişince kolayca uyum sağlayabilir, anlık bir öneriye hemen katılabilir.',
            home: 'Kullandığı eşyaları yerine koymayı unutabilir, sonra onları ararken zaman harcayabilir.',
          },
        },
        average: {
          student: {
            school: 'Önemli bir sınavdan önce plan yapabilir, küçük ödevleri ise son güne bırakabilirsin.',
            friends: 'Bazen buluşmayı önceden planlar, bazen o an karar verebilirsin.',
            home: 'Eşyaların bazen derli toplu olur; yoğun günlerde ortada kalabilir.',
          },
          parent: {
            school: 'Çocuğunuz önemli bir sınavdan önce plan yapabilir, küçük ödevleri ise son güne bırakabilir.',
            friends: 'Bazen buluşmayı önceden planlar, bazen o an karar verebilir.',
            home: 'Eşyaları bazen derli toplu olur; yoğun günlerde ortada kalabilir.',
          },
        },
        high: {
          student: {
            school: 'Ödevlerini önceden hazırlayabilir, yaptığın işin ayrıntılarını dikkatle kontrol edebilirsin.',
            friends: 'Bir buluşmanın saatini ve yerini önceden ayarlamak isteyebilirsin. Son anda değişen planlar canını sıkabilir.',
            home: 'Kullandığın eşyaları yerine koymak ve düzeni korumak sana iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz ödevlerini önceden hazırlayabilir, yaptığı işin ayrıntılarını dikkatle kontrol edebilir.',
            friends: 'Bir buluşmanın saatini ve yerini önceden ayarlamak isteyebilir. Son anda değişen planlar canını sıkabilir.',
            home: 'Kullandığı eşyaları yerine koymak ve düzeni korumak ona iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Duygusal denge: "Çoğu zaman rahat ve sakinimdir", "Kendimi nadiren hüzünlü hissederim"; ters: "Kolayca strese girerim",
     * "Birçok şey için endişelenirim", "Kolayca huzursuz olurum", "Kolayca üzülürüm", "Ruh hâlim sık sık değişir", "Duygularım
     * gün içinde sık sık iniş çıkış yapar", "Sinirim çabuk bozulur", "Sık sık kendimi hüzünlü hissederim".
     */
    emotional_stability: {
      poles: { low: 'Duygularını yoğun yaşar', high: 'Çoğu zaman sakin kalır' },
      bands: {
        low: {
          student: {
            school: 'Bir sınav ya da sunum yaklaşırken içindeki gerginlik ve endişe artabilir.',
            friends: 'Bir anlaşmazlık seni uzun süre düşündürebilir; duygularını bir arkadaşınla paylaşınca hafifleyebilirsin.',
            home: 'Gün içinde ruh hâlin sık sık değişebilir; seni üzen şeyi güvendiğin biriyle konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Bir sınav ya da sunum yaklaşırken çocuğunuzun içindeki gerginlik ve endişe artabilir.',
            friends: 'Bir anlaşmazlık onu uzun süre düşündürebilir; duygularını bir arkadaşıyla paylaşınca hafifleyebilir.',
            home: 'Gün içinde ruh hâli sık sık değişebilir; onu üzen şeyi güvendiği biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          student: {
            school: 'Çoğu gün sakin olsan da önemli bir sınavdan önce gerilebilirsin.',
            friends: 'Bir tartışmada bazen sakin kalabilir, bazen sinirin bozulabilir.',
            home: 'Bazı günler moralin bozulabilir; çoğu zaman bu duygu uzun sürmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz çoğu gün sakin olsa da önemli bir sınavdan önce gerilebilir.',
            friends: 'Bir tartışmada bazen sakin kalabilir, bazen siniri bozulabilir.',
            home: 'Bazı günler morali bozulabilir; çoğu zaman bu duygu uzun sürmeyebilir.',
          },
        },
        high: {
          student: {
            school: 'Bir sınavdan önce de çoğu zaman sakin kalıp işine odaklanabilirsin.',
            friends: 'Bir anlaşmazlıkta sinirin çabuk bozulmayabilir; ortamı sakinleştiren kişi sen olabilirsin.',
            home: 'Seni üzen bir şey olduğunda bile sakin görünebilirsin; bu yüzden evdekiler bunu fark etmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavdan önce de çoğu zaman sakin kalıp işine odaklanabilir.',
            friends: 'Bir anlaşmazlıkta siniri çabuk bozulmayabilir; ortamı sakinleştiren kişi o olabilir.',
            home: 'Onu üzen bir şey olduğunda bile sakin görünebilir; bu yüzden siz bunu fark etmeyebilirsiniz.',
          },
        },
      },
    },
    /*
     * Merak ve hayal gücü: "Hayal gücüm çok canlıdır", "Çok iyi fikirler bulurum", "Aklım fikirlerle doludur", "Olaylar ve
     * fikirler üzerine düşünmeye zaman ayırırım", "Kelime dağarcığım zengindir"; ters: "Soyut fikirler ilgimi çekmez",
     * "Soyut fikirleri … anlamakta zorlanırım", "Hayal gücüm pek güçlü değildir".
     */
    intellect: {
      poles: { low: 'Somut ve pratik düşünür', high: 'Fikir ve hayal üretir' },
      bands: {
        low: {
          student: {
            school: 'Bir konu yalnızca kurallarla anlatılınca ilgin dağılabilir; somut bir örnek işini kolaylaştırabilir.',
            friends: 'Uzun bir fikir tartışması yerine arkadaşlarınla somut bir işi birlikte yapmak sana daha keyifli gelebilir.',
            home: 'Bir eşyayı onarmak ya da bir işi elinle yapmak gibi pratik uğraşlarda rahat edebilirsin.',
          },
          parent: {
            school: 'Bir konu yalnızca kurallarla anlatılınca çocuğunuzun ilgisi dağılabilir; somut bir örnek işini kolaylaştırabilir.',
            friends: 'Uzun bir fikir tartışması yerine arkadaşlarıyla somut bir işi birlikte yapmak ona daha keyifli gelebilir.',
            home: 'Bir eşyayı onarmak ya da bir işi eliyle yapmak gibi pratik uğraşlarda rahat edebilir.',
          },
        },
        average: {
          student: {
            school: 'Somut örneklerle anlatılan konularda da hayal gücü isteyen ödevlerde de rahat edebilirsin.',
            friends: 'Bazen yeni bir fikir ortaya atar, bazen bir arkadaşının fikrini geliştirmeyi seçebilirsin.',
            home: 'İlgini çeken bir konuyu düşünmeye zaman ayırabilir, ötekilerde pratik çözüme yönelebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz somut örneklerle anlatılan konularda da hayal gücü isteyen ödevlerde de rahat edebilir.',
            friends: 'Bazen yeni bir fikir ortaya atar, bazen bir arkadaşının fikrini geliştirmeyi seçebilir.',
            home: 'İlgisini çeken bir konuyu düşünmeye zaman ayırabilir, ötekilerde pratik çözüme yönelebilir.',
          },
        },
        high: {
          student: {
            school: 'Derste “Neden böyle?” diye sorabilir, bir konuya farklı açılardan bakabilirsin.',
            friends: 'Bir oyun ya da proje için ilk fikirleri ortaya atan kişi sen olabilirsin.',
            home: 'Hayallere ya da düşüncelere dalıp yapman gereken bir işi unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste “Neden böyle?” diye sorabilir, bir konuya farklı açılardan bakabilir.',
            friends: 'Bir oyun ya da proje için ilk fikirleri ortaya atan kişi o olabilir.',
            home: 'Hayallere ya da düşüncelere dalıp yapması gereken bir işi unutabilir.',
          },
        },
      },
    },
  },
};
