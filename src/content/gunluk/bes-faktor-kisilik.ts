import type { SurveyDaily } from './types';

/**
 * Beş Faktör Kişilik Profili: günlük hayatta nasıl görünür (6. sınıftan mezuna; yetişkinlere açık değil).
 * Şablonun beş düzeyi üç gruba toplanır: belirgin biçimde düşük ve düşük → düşük, orta → orta, yüksek ve belirgin biçimde
 * yüksek → yüksek. Kişilik boyutlarında iyi ya da kötü uç yoktur (src/content/reports/bes-faktor.ts): dört boyut özellik
 * tonundadır, her uç bir kolaylık ve bir zorlukla anlatılır; kişi etiketlenmez, davranış anlatılır. Duygusal denge gelişim
 * tonundadır (düşük ucu destek kutusunu açabilir; lib/reports/daily-parts.ts, scaleTone): düşük uca uydurma bir güçlü yan,
 * yüksek uca uydurma bir zorluk yazılmaz; belirti sayılmaz, zor anın yanında bir dayanak söylenir. Merak ve hayal gücünün
 * örnekleri zekâ, kavrama hızı ya da bir öğretme biçimi gibi okunmaz ("Bir şeyleri çabuk kavrarım" maddesine, I7, bilerek
 * dayanılmadı). Her satırın dayandığı maddeler `from`'dadır.
 * Maddeye doğrudan dayanmayan, testin kendi metninden gelen uzantılar: dışadönüklükte yalnız kalmanın ya da insanlarla
 * konuşmanın iyi gelmesi (testteki "İnsanların arasında enerji bulma" anlatımı), uyumlulukta "düşündüğünü olduğu gibi
 * söyleyebilirsin" (A3'ün olumlu yanı) ve "kendi fikrini savunabilirsin" (testteki uç anlatımı), hayal gücünde "dalıp işi
 * unutabilirsin" (I3'ün bedeli).
 */
export const besFaktorDaily: SurveyDaily = {
  kind: 'survey',
  version: 'bes-faktor-gunluk-1',
  scales: {
    /*
     * Dışadönüklük: E1 "Arkadaş ortamlarında havayı canlandıran kişi genellikle benim", E3 "İnsanların arasında kendimi rahat
     * hissederim", E5 "Sohbeti genellikle ben başlatırım", E7 "Kalabalık ortamlarda birçok farklı kişiyle konuşurum", E9 "İlgi
     * odağı olmak beni rahatsız etmez"; ters: E2 "Çok konuşmam", E4 "Kalabalıkta geri planda kalmayı tercih ederim", E6
     * "Genellikle söyleyecek pek bir şeyim olmaz", E8 "Dikkatleri üzerime çekmekten hoşlanmam", E10 "Tanımadığım insanların
     * yanında sessiz olurum".
     */
    extraversion: {
      poles: { low: 'Önce dinler', high: 'Sohbeti başlatır' },
      bands: {
        low: {
          from: { school: ['E2', 'E8'], friends: ['E4', 'E10', 'E5'], home: ['E3', 'E7'] },
          student: {
            school: 'Sınıfta söz almak yerine çoğu zaman dinlemeyi seçebilirsin.',
            friends: 'Kalabalık bir grup yerine az kişiyle vakit geçirmek sana daha rahat gelebilir. Tanımadığın biriyle sohbete başlamak ise zor gelebilir.',
            home: 'Kalabalık bir günün ardından kendi başına sakin bir zaman geçirmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta söz almak yerine çoğu zaman dinlemeyi seçebilir.',
            friends: 'Kalabalık bir grup yerine az kişiyle vakit geçirmek ona daha rahat gelebilir. Tanımadığı biriyle sohbete başlamak ise zor gelebilir.',
            home: 'Kalabalık bir günün ardından kendi başına sakin bir zaman geçirmek ona iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['E2', 'E5'], friends: ['E10', 'E3'], home: ['E3', 'E4'] },
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
          from: { school: ['E9', 'E2'], friends: ['E5', 'E7'], home: ['E3'] },
          student: {
            school: 'Sınıfta söz almak ya da herkesin önünde konuşmak seni çoğu zaman rahatsız etmeyebilir.',
            friends: 'Yeni tanıştığın biriyle sohbeti sen başlatabilir, kalabalıkta pek çok kişiyle konuşabilirsin.',
            home: 'Uzun süre tek başına kalınca canın sıkılabilir; birileriyle konuşmak seni canlandırabilir.',
          },
          parent: {
            school: 'Sınıfta söz almak ya da herkesin önünde konuşmak çocuğunuzu çoğu zaman rahatsız etmeyebilir.',
            friends: 'Yeni tanıştığı biriyle sohbeti o başlatabilir, kalabalıkta pek çok kişiyle konuşabilir.',
            home: 'Uzun süre tek başına kalınca canı sıkılabilir; birileriyle konuşmak onu canlandırabilir.',
          },
        },
      },
    },
    /*
     * Uyumluluk: A2 "İnsanlara ilgi duyarım", A4 "Başkalarının duygularını anlar, onlara ortak olurum", A6 "Yufka yürekli
     * biriyim", A8 "Başkalarına zaman ayırırım", A9 "Başkalarının ne hissettiğini içimde hissederim", A10 "İnsanların yanımda
     * rahat hissetmesini sağlarım"; ters: A1 "Başkalarının iyi olup olmaması beni pek ilgilendirmez", A3 "Başkalarını kıracak
     * sözler söylerim", A5 "Başkalarının sorunları beni ilgilendirmez", A7 "Aslında diğer insanlara pek ilgi duymam".
     */
    agreeableness: {
      poles: { low: 'Kendi işine odaklanır', high: 'Başkalarına zaman ayırır' },
      bands: {
        low: {
          from: { school: ['A4', 'A10'], friends: ['A3'], home: ['A5', 'A1'] },
          student: {
            school: 'Grup çalışmasında duygulardan çok işin kendisine odaklanabilirsin.',
            friends: 'Düşündüğünü olduğu gibi söyleyebilirsin; bu bazen farkında olmadan bir arkadaşını kırabilir.',
            home: 'Başkalarının dertleriyle ilgilenmek yerine önce kendi işlerini yoluna koymayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında duygulardan çok işin kendisine odaklanabilir.',
            friends: 'Düşündüğünü olduğu gibi söyleyebilir; bu bazen farkında olmadan bir arkadaşını kırabilir.',
            home: 'Başkalarının dertleriyle ilgilenmek yerine önce kendi işlerini yoluna koymayı seçebilir.',
          },
        },
        average: {
          from: { school: ['A10', 'A3'], friends: ['A5', 'A8'], home: ['A8'] },
          student: {
            school: 'Grup çalışmasında arkadaşlarını gözetirken kendi fikrini de savunabilirsin.',
            friends: 'Bir arkadaşının derdini dinleyebilir ama her sorununu üstlenmek istemeyebilirsin.',
            home: 'Bazen evdekilere yardım etmek için işini bırakabilir, bazen önce kendi işini bitirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında arkadaşlarını gözetirken kendi fikrini de savunabilir.',
            friends: 'Bir arkadaşının derdini dinleyebilir ama her sorununu üstlenmek istemeyebilir.',
            home: 'Bazen evdekilere yardım etmek için işini bırakabilir, bazen önce kendi işini bitirebilir.',
          },
        },
        high: {
          from: { school: ['A10', 'A4'], friends: ['A8', 'A9'], home: ['A8'] },
          student: {
            school: 'Grup çalışmasında herkesin rahat etmesini gözetebilir, üzgün bir sınıf arkadaşının yanına gidebilirsin.',
            friends: 'Bir arkadaşın derdini anlatınca ona zaman ayırır, ne hissettiğini anlamaya çalışabilirsin.',
            home: 'Evdekilere yardım ederken kendi işlerine zaman ayırmayı unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında herkesin rahat etmesini gözetebilir, üzgün bir sınıf arkadaşının yanına gidebilir.',
            friends: 'Bir arkadaşı derdini anlatınca ona zaman ayırır, ne hissettiğini anlamaya çalışabilir.',
            home: 'Evdekilere yardım ederken kendi işlerine zaman ayırmayı unutabilir.',
          },
        },
      },
    },
    /*
     * Sorumluluk: C1 "Her zaman hazırlıklı olurum", C3 "Ayrıntılara dikkat ederim", C5 "Yapmam gereken işleri hemen
     * hallederim", C7 "Düzeni severim", C9 "Bir plana ya da programa göre hareket ederim", C10 "Yaptığım işte titizimdir";
     * ters: C2 "Eşyalarımı ortada bırakırım", C4 "İşleri birbirine karıştırırım", C6 "Kullandığım şeyleri yerine koymayı sık
     * sık unuturum", C8 "Sorumluluklarımdan kaçarım". Uçlar planı ve düzeni birlikte anlatır.
     */
    conscientiousness: {
      poles: { low: 'Akışına göre ilerler', high: 'Planlı ve düzenli ilerler' },
      bands: {
        low: {
          from: { school: ['C5', 'C1'], friends: ['C9'], home: ['C6', 'C2'] },
          student: {
            school: 'Ödevleri son güne bırakabilir ya da gereken bir şeyi evde unutabilirsin.',
            friends: 'Plan son anda değişince bu seni pek rahatsız etmeyebilir; anlık bir öneriye hemen katılabilirsin.',
            home: 'Kullandığın eşyaları yerine koymayı unutabilir, sonra onları ararken zaman harcayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ödevleri son güne bırakabilir ya da gereken bir şeyi evde unutabilir.',
            friends: 'Plan son anda değişince bu onu pek rahatsız etmeyebilir; anlık bir öneriye hemen katılabilir.',
            home: 'Kullandığı eşyaları yerine koymayı unutabilir, sonra onları ararken zaman harcayabilir.',
          },
        },
        average: {
          from: { school: ['C9', 'C5'], friends: ['C9'], home: ['C2', 'C7'] },
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
          from: { school: ['C1', 'C3', 'C10'], friends: ['C9'], home: ['C6', 'C7'] },
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
     * Duygusal denge (gelişim tonu): ES2 "Çoğu zaman rahat ve sakinimdir", ES4 "Kendimi nadiren hüzünlü hissederim"; ters: ES1
     * "Kolayca strese girerim", ES3 "Birçok şey için endişelenirim", ES5 "Kolayca huzursuz olurum", ES6 "Kolayca üzülürüm", ES7
     * "Ruh hâlim sık sık değişir", ES8 "Duygularım gün içinde sık sık iniş çıkış yapar", ES9 "Sinirim çabuk bozulur", ES10 "Sık
     * sık kendimi hüzünlü hissederim". Yüksek ucun örnekleri gerçekten sakin kalmayı anlatır (duyguyu saklamayı değil).
     */
    emotional_stability: {
      poles: { low: 'Duygularını yoğun yaşar', high: 'Çoğu zaman sakin kalır' },
      bands: {
        low: {
          from: { school: ['ES1', 'ES3'], friends: ['ES6', 'ES9'], home: ['ES7', 'ES8', 'ES10'] },
          student: {
            school: 'Bir sınav ya da sunum yaklaşırken kendini gergin ve endişeli hissedebilirsin.',
            friends: 'Bir anlaşmazlıkta çabuk üzülebilir ya da sinirlenebilirsin; sonra duygularını paylaşmak seni rahatlatabilir.',
            home: 'Gün içinde ruh hâlin sık sık değişebilir; seni üzen şeyi güvendiğin biriyle konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Bir sınav ya da sunum yaklaşırken çocuğunuz kendini gergin ve endişeli hissedebilir.',
            friends: 'Bir anlaşmazlıkta çabuk üzülebilir ya da sinirlenebilir; sonra duygularını paylaşmak onu rahatlatabilir.',
            home: 'Gün içinde ruh hâli sık sık değişebilir; onu üzen şeyi güvendiği biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['ES2', 'ES1'], friends: ['ES9', 'ES2'], home: ['ES10', 'ES4'] },
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
          from: { school: ['ES1', 'ES2'], friends: ['ES9', 'ES2'], home: ['ES2', 'ES4'] },
          student: {
            school: 'Bir sınavdan önce de çoğu zaman sakin kalıp işine odaklanabilirsin.',
            friends: 'Bir anlaşmazlıkta sinirin çabuk bozulmayabilir; olanı sakin bir şekilde konuşabilirsin.',
            home: 'Zor bir günde de çoğu zaman sakin kalabilirsin; yine de seni üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavdan önce de çoğu zaman sakin kalıp işine odaklanabilir.',
            friends: 'Bir anlaşmazlıkta siniri çabuk bozulmayabilir; olanı sakin bir şekilde konuşabilir.',
            home: 'Çocuğunuz zor bir günde de çoğu zaman sakin kalabilir; yine de onu üzen bir şeyi paylaşmak iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Merak ve hayal gücü: I1 "Kelime dağarcığım zengindir", I3 "Hayal gücüm çok canlıdır", I5 "Çok iyi fikirler bulurum", I8
     * "Konuşurken zor ve az bilinen kelimeler kullanırım", I9 "Olaylar ve fikirler üzerine düşünmeye zaman ayırırım", I10
     * "Aklım fikirlerle doludur"; ters: I2 "Soyut fikirleri … anlamakta zorlanırım", I4 "Soyut fikirler ilgimi çekmez", I6
     * "Hayal gücüm pek güçlü değildir". I7 "Bir şeyleri çabuk kavrarım" kullanılmadı (kavrama hızı gibi okunmasın). Düşük ucun
     * örnekleri ilgiyi anlatır, beceriyi değil.
     */
    intellect: {
      poles: { low: 'Somut konuları tercih eder', high: 'Fikir ve hayal üretir' },
      bands: {
        low: {
          from: { school: ['I4', 'I2'], friends: ['I4', 'I9'], home: ['I3', 'I6'] },
          student: {
            school: 'Derste soyut fikirler konuşulunca ilgin azalabilir; somut konular sana daha çekici gelebilir.',
            friends: 'Arkadaşlarınla uzun bir fikir tartışması sana pek çekici gelmeyebilir.',
            home: 'Hayallere dalmak yerine çoğu zaman o an yaptığın işle ilgilenebilirsin.',
          },
          parent: {
            school: 'Derste soyut fikirler konuşulunca çocuğunuzun ilgisi azalabilir; somut konular ona daha çekici gelebilir.',
            friends: 'Arkadaşlarıyla uzun bir fikir tartışması ona pek çekici gelmeyebilir.',
            home: 'Hayallere dalmak yerine çoğu zaman o an yaptığı işle ilgilenebilir.',
          },
        },
        average: {
          from: { school: ['I4'], friends: ['I5', 'I10'], home: ['I9'] },
          student: {
            school: 'Bazı derslerde soyut fikirler ilgini çekebilir, bazılarında somut konuları daha çok sevebilirsin.',
            friends: 'Bazen yeni bir fikir ortaya atar, bazen bir arkadaşının fikrini geliştirmeyi seçebilirsin.',
            home: 'İlgini çeken bir konuyu düşünmeye zaman ayırabilir, ötekilerde doğrudan işe koyulabilirsin.',
          },
          parent: {
            school: 'Bazı derslerde soyut fikirler çocuğunuzun ilgisini çekebilir, bazılarında somut konuları daha çok sevebilir.',
            friends: 'Bazen yeni bir fikir ortaya atar, bazen bir arkadaşının fikrini geliştirmeyi seçebilir.',
            home: 'İlgisini çeken bir konuyu düşünmeye zaman ayırabilir, ötekilerde doğrudan işe koyulabilir.',
          },
        },
        high: {
          from: { school: ['I9', 'I4'], friends: ['I5', 'I10'], home: ['I3', 'I9'] },
          student: {
            school: 'Derste “Neden böyle?” diye sorabilir, bir konuya farklı açılardan bakabilirsin.',
            friends: 'Bir oyun ya da proje için pek çok fikir bulabilirsin.',
            home: 'Hayallere ya da düşüncelere dalıp yapman gereken bir işi unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste “Neden böyle?” diye sorabilir, bir konuya farklı açılardan bakabilir.',
            friends: 'Bir oyun ya da proje için çocuğunuz pek çok fikir bulabilir.',
            home: 'Hayallere ya da düşüncelere dalıp yapması gereken bir işi unutabilir.',
          },
        },
      },
    },
  },
};
