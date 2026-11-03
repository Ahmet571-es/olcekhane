import type { SurveyDaily } from './types';

/**
 * Düşünme ve Çalışma Tarzı: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: özellik (uçların iyi ya da kötü
 * anlamı yoktur; lib/reports/daily-parts.ts, `scaleTone`). Her uçta bir kolaylık ve bir zorluk anlatılır; kişi etiketlenmez,
 * davranış anlatılır. Hiçbir örnek bir yetenek, yaratıcılık ya da zekâ söylemez; bir tarzı bir öğretme biçimiyle eşleştirmez.
 *
 * Şablonun çelişmezlik ilkesi (src/content/reports/dusunme-ve-calisma-tarzi.ts) örneklerde de geçerlidir: Enerji ve tempo
 * "Bir işe başlamam için birinin beni dürtmesi gerekir" (enl06) maddesini, Düzen ve plan "Zamanımı boşa harcarım" (org07)
 * maddesini, Yenilikçilik "Bir konunun derinine inmem" (inv09) maddesini anlatmaz. Ayrıca "Kelime dağarcığım zengindir"
 * (cpx02), "Sohbetin seviyesini yükseltirim" (inv04) ve "Çok iyi fikirler bulurum" (inv06) bir üstünlük ya da beceri gibi,
 * "Karmaşık insanlardan uzak durmaya çalışırım" (cpx07) insanları yargılayan bir örnek gibi, "Cesaretim çabuk kırılır"
 * (enl07) tempodan başka bir şey gibi okunabileceği için örneklere kaynak olmaz. Soyut konulara ilgi, şablondaki gibi sanatı
 * önemsemeyi ve şiiri sevmeyi anlatır; sanat ve şiir üzerine konuşmayı değil.
 *
 * Maddeye doğrudan dayanmayan, ucun doğal karşılığı olan uzantılar: soyut konulara ilginin düşük ucunda "gündelik konuları
 * konuşmak sana daha keyifli gelebilir" (cpx08'in öbür yüzü), yüksek ucunda "zamanın nasıl geçtiğini fark etmeyebilirsin"
 * (cpx10 ve cpx01'in bedeli); yenilikçiliğin yüksek ucunda "hepsini hayata geçirmek ise zor olabilir" (inv05'in bedeli);
 * başkalarının görüşüne önem vermenin düşük ucunda "bu bazen yanlış anlaşılabilir" (cpr07'nin bedeli), yüksek ucunda "uyum
 * içinde çalışabilirsin" (cpr02; şablondaki anlatım); enerji ve tempoda "acele etmeden, kendi temponda" (enl10; şablondaki
 * anlatım). Enerji ve tempo, Düzen ve plan kartıyla çelişmesin diye işlerin birikmesinden söz etmez (o kart işleri hemen
 * halletmeyi anlatır); düşük ucun zorluğu enl01'in öbür yüzüdür (aynı anda birkaç işle uğraşmak yorucu gelebilir).
 * Başkalarının görüşüne önem vermenin yüksek ucundaki ev satırı evdekilerden söz ettiği için yetişkine kendi ev satırı yazıldı
 * (`adult.home`, "yakınların": yalnız yaşayan yetişkin).
 */
export const dusunmeVeCalismaTarziDaily: SurveyDaily = {
  kind: 'survey',
  version: 'dusunme-ve-calisma-tarzi-gunluk-1',
  scales: {
    /*
     * Soyut ve felsefi konulara ilgi: cpx01 "Sanatın önemli olduğuna inanırım", cpx02 "Kelime dağarcığım zengindir"
     * (kullanılmadı), cpx03 "Kendimi ve hayatımı incelemekten hoşlanırım", cpx04 "Başkalarıyla filmler ve kitaplar hakkında
     * konuşmaktan hoşlanırım", cpx05 "Kendimi tarafsız bir gözle incelemeye çalışırım"; ters: cpx06 "Soyut fikirler ilgimi
     * çekmez", cpx07 "Karmaşık insanlardan uzak durmaya çalışırım" (kullanılmadı), cpx08 "Felsefi tartışmalardan kaçınırım",
     * cpx09 "Teorik tartışmalar ilgimi çekmez", cpx10 "Şiiri sevmem".
     */
    complexity: {
      poles: { low: 'Soyut konulara az ilgili', high: 'Soyut konulara çok ilgili' },
      bands: {
        low: {
          from: { school: ['cpx09'], friends: ['cpx08'], home: ['cpx10', 'cpx01'], work: ['cpx09'] },
          student: {
            school: 'Derste teorik bir tartışma başlayınca ilgin azalabilir.',
            friends: 'Arkadaşlarınla felsefi konular yerine gündelik konuları konuşmak sana daha keyifli gelebilir.',
            home: 'Şiir ya da resim gibi sanat dalları sana pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Derste teorik bir tartışma başlayınca çocuğunuzun ilgisi azalabilir.',
            friends: 'Arkadaşlarıyla felsefi konular yerine gündelik konuları konuşmak ona daha keyifli gelebilir.',
            home: 'Şiir ya da resim gibi sanat dalları ona pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'İşle ilgili teorik bir tartışma başlayınca ilgin azalabilir.',
          },
        },
        average: {
          from: { school: ['cpx06'], friends: ['cpx04'], home: ['cpx03'], work: ['cpx06'] },
          student: {
            school: 'Bazı derslerde soyut bir fikir seni düşündürebilir, bazılarında pek ilgini çekmeyebilir.',
            friends: 'Arkadaşlarınla bir film ya da kitap hakkında bazen uzun uzun konuşabilir, bazen kısa kesebilirsin.',
            home: 'Bazen kendini ve hayatını düşünmeye zaman ayırabilir, bazen bunu pek istemeyebilirsin.',
          },
          parent: {
            school: 'Bazı derslerde soyut bir fikir çocuğunuzu düşündürebilir, bazılarında pek ilgisini çekmeyebilir.',
            friends: 'Arkadaşlarıyla bir film ya da kitap hakkında bazen uzun uzun konuşabilir, bazen kısa kesebilir.',
            home: 'Bazen kendini ve hayatını düşünmeye zaman ayırabilir, bazen bunu pek istemeyebilir.',
          },
          adult: {
            work: 'İşle ilgili bazı soyut fikirler seni düşündürebilir, bazıları pek ilgini çekmeyebilir.',
          },
        },
        high: {
          from: { school: ['cpx09'], friends: ['cpx04'], home: ['cpx10', 'cpx01'], work: ['cpx09'] },
          student: {
            school: 'Derste bir konunun ardındaki teoriyi tartışmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla izlediğin bir film ya da okuduğun bir kitap üzerine uzun uzun konuşmak isteyebilirsin.',
            home: 'Bir şiire ya da bir sanat eserine dalıp zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Derste bir konunun ardındaki teoriyi tartışmak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla izlediği bir film ya da okuduğu bir kitap üzerine uzun uzun konuşmak isteyebilir.',
            home: 'Bir şiire ya da bir sanat eserine dalıp zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'İşinde bir konunun ardındaki teoriyi düşünmek ve tartışmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /*
     * Yenilikçilik: inv01 "İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim", inv02 "Canlı bir hayal gücüm vardır",
     * inv03 "Aklım fikirlerle doludur", inv04 "Sohbetin seviyesini yükseltirim" (kullanılmadı), inv05 "Cesur planlar
     * kurarım", inv06 "Çok iyi fikirler bulurum" (kullanılmadı); ters: inv07 "Hayal gücüm pek güçlü değildir", inv08 "Bir
     * şeyleri hayal etmekte zorlanırım", inv09 "Bir konunun derinine inmem" (kullanılmadı), inv10 "Yeni fikirler bulamam".
     * Test yaratıcılığı ölçmez: örnekler kişinin kendini nasıl gördüğünü anlatır ("aklının fikirlerle dolu olduğunu
     * hissedebilirsin"), fikirlerinin iyi olduğunu söylemez.
     */
    ingenuity: {
      poles: { low: 'Bilinen yolla ilerler', high: 'Yeni yollar arar' },
      bands: {
        low: {
          from: { school: ['inv10'], friends: ['inv05'], home: ['inv01'], work: ['inv01'] },
          student: {
            school: 'Bir proje için yeni bir fikir gerekince aklına pek bir şey gelmiyormuş gibi hissedebilirsin.',
            friends: 'Arkadaşlarınla plan yaparken cesur planlar yerine bilinen şeyleri seçebilirsin.',
            home: 'Bir işi yeni bir yol aramadan bildiğin yolla yapmak sana kolay gelebilir.',
          },
          parent: {
            school: 'Bir proje için yeni bir fikir gerekince çocuğunuz aklına pek bir şey gelmiyormuş gibi hissedebilir.',
            friends: 'Arkadaşlarıyla plan yaparken cesur planlar yerine bilinen şeyleri seçebilir.',
            home: 'Bir işi yeni bir yol aramadan bildiği yolla yapmak ona kolay gelebilir.',
          },
          adult: {
            work: 'İşleri yeni bir yol aramadan bilinen yöntemle yapmayı tercih edebilirsin.',
          },
        },
        average: {
          from: { school: ['inv03'], friends: ['inv03'], home: ['inv01'], work: ['inv03'] },
          student: {
            school: 'Bazı projelerde aklına pek çok fikir gelebilir, bazılarında hazır bir fikirle ilerleyebilirsin.',
            friends: 'Arkadaşlarınla bir etkinlik düşünürken bazen yeni bir fikir önerebilir, bazen başkasının fikrine katılabilirsin.',
            home: 'Bir ev işini bazen yeni bir yolla yapmayı deneyebilir, bazen bildiğin gibi yapabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun bazı projelerde aklına pek çok fikir gelebilir, bazılarında hazır bir fikirle ilerleyebilir.',
            friends: 'Arkadaşlarıyla bir etkinlik düşünürken bazen yeni bir fikir önerebilir, bazen başkasının fikrine katılabilir.',
            home: 'Bir ev işini bazen yeni bir yolla yapmayı deneyebilir, bazen bildiği gibi yapabilir.',
          },
          adult: {
            work: 'Bazı işlerde aklına yeni fikirler gelebilir, bazılarında bilinen yolu seçebilirsin.',
          },
        },
        high: {
          from: { school: ['inv03'], friends: ['inv05'], home: ['inv01'], work: ['inv01'] },
          student: {
            school: 'Bir proje için aklının fikirlerle dolu olduğunu hissedebilirsin.',
            friends: 'Arkadaşlarınla cesur planlar kurabilirsin; hepsini hayata geçirmek ise zor olabilir.',
            home: 'Bir ev işini yapmanın yeni bir yolunu düşünüp bulmak sana keyifli gelebilir.',
          },
          parent: {
            school: 'Bir proje için çocuğunuz aklının fikirlerle dolu olduğunu hissedebilir.',
            friends: 'Arkadaşlarıyla cesur planlar kurabilir; hepsini hayata geçirmek ise zor olabilir.',
            home: 'Bir ev işini yapmanın yeni bir yolunu düşünüp bulmak ona keyifli gelebilir.',
          },
          adult: {
            work: 'Bir işi yapmanın başka bir yolunu düşünüp bulmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /*
     * Başkalarının görüşüne önem verme: cpr01 "İnsanların hakkımda ne düşündüğünü kafama takarım", cpr02 "Başkalarının
     * görüşlerine uyarım", cpr03 "Başkalarının onayına ihtiyaç duyarım", cpr04 "Başkalarının gözünde özel biri olmak isterim",
     * cpr05 "Başkaları ne yapıyorsa onu yaparım"; ters: cpr06 "Başkalarının ne düşündüğünü umursamam", cpr07 "İyi bir izlenim
     * bırakma derdinde değilim", cpr08 "Bazı insanların beni sevmemesini doğal karşılarım", cpr09 "Kendi görüşlerimi kendim
     * oluşturmak isterim", cpr10 "Başkalarından farklı olmak isterim".
     */
    conformity: {
      poles: { low: 'Kendi görüşünü izler', high: 'Çevresinin görüşünü izler' },
      bands: {
        low: {
          from: { school: ['cpr09'], friends: ['cpr10', 'cpr05'], home: ['cpr07'], work: ['cpr09'] },
          student: {
            school: 'Bir konuda başkalarının ne dediğine bakmadan kendi görüşünü oluşturmak isteyebilirsin.',
            friends: 'Arkadaşların ne yaparsa onu yapmak yerine farklı olmayı seçebilirsin.',
            home: 'Eve gelen birinde iyi bir izlenim bırakmayı pek dert etmeyebilirsin; bu bazen yanlış anlaşılabilir.',
          },
          parent: {
            school: 'Çocuğunuz bir konuda başkalarının ne dediğine bakmadan kendi görüşünü oluşturmak isteyebilir.',
            friends: 'Arkadaşları ne yaparsa onu yapmak yerine farklı olmayı seçebilir.',
            home: 'Eve gelen birinde iyi bir izlenim bırakmayı pek dert etmeyebilir; bu bazen yanlış anlaşılabilir.',
          },
          adult: {
            work: 'Bir işte başkalarına bakmadan kendi görüşünü oluşturmak isteyebilirsin.',
          },
        },
        average: {
          from: { school: ['cpr02', 'cpr09'], friends: ['cpr05'], home: ['cpr01', 'cpr06'], work: ['cpr02', 'cpr09'] },
          student: {
            school: 'Bazı konularda çoğunluğun görüşüne uyabilir, bazılarında kendi görüşüne göre davranabilirsin.',
            friends: 'Arkadaşların bir şey yapınca bazen onlara katılabilir, bazen kendi bildiğini yapabilirsin.',
            home: 'İnsanların hakkında ne düşündüğünü bazen kafana takabilir, bazen pek önemsemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı konularda çoğunluğun görüşüne uyabilir, bazılarında kendi görüşüne göre davranabilir.',
            friends: 'Arkadaşları bir şey yapınca bazen onlara katılabilir, bazen kendi bildiğini yapabilir.',
            home: 'İnsanların hakkında ne düşündüğünü bazen kafasına takabilir, bazen pek önemsemeyebilir.',
          },
          adult: {
            work: 'Bazı konularda çevrendekilerin görüşüne uyabilir, bazılarında kendi görüşüne göre davranabilirsin.',
          },
        },
        high: {
          from: { school: ['cpr02'], friends: ['cpr05', 'cpr03'], home: ['cpr01'], work: ['cpr02'] },
          student: {
            school: 'Grup çalışmasında başkalarının görüşlerini dikkate alıp uyum içinde çalışabilirsin.',
            friends: 'Arkadaşların ne yapıyorsa ona katılmak ve onların onayını almak sana iyi gelebilir.',
            home: 'Misafirlerin ya da evdekilerin senin hakkında ne düşündüğünü kafana takabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında başkalarının görüşlerini dikkate alıp uyum içinde çalışabilir.',
            friends: 'Arkadaşları ne yapıyorsa ona katılmak ve onların onayını almak ona iyi gelebilir.',
            home: 'Misafirlerin ya da evdekilerin onun hakkında ne düşündüğünü kafasına takabilir.',
          },
          adult: {
            work: 'Ortak bir işte başkalarının görüşlerini dikkate alıp uyum içinde çalışabilirsin.',
            home: 'Misafirlerin ya da yakınlarının senin hakkında ne düşündüğünü kafana takabilirsin.',
          },
        },
      },
    },
    /*
     * Enerji ve tempo: enl01 "Aynı anda birçok şeyi idare edebilirim", enl02 "Hep bir şeylerle meşgulümdür", enl03 "Boş
     * zamanlarımda birçok şey yaparım", enl04 "Sürekli hareket hâlindeyim", enl05 "Çok iş çıkarırım"; ters: enl06 "Bir işe
     * başlamam için birinin beni dürtmesi gerekir" (kullanılmadı), enl07 "Cesaretim çabuk kırılır" (kullanılmadı), enl08
     * "Gereğinden az çalışırım", enl09 "Hiçbir şey yapmadan boş boş vakit geçiririm", enl10 "Hayatımın temposu yavaştır".
     */
    activity: {
      poles: { low: 'Sakin tempoda ilerler', high: 'Yoğun tempoda ilerler' },
      bands: {
        low: {
          from: { school: ['enl10'], friends: ['enl03'], home: ['enl01'], work: ['enl10'] },
          student: {
            school: 'Ödevlerini acele etmeden, kendi temponda yapmayı seçebilirsin.',
            friends: 'Arkadaşlarınla boş zamanında pek çok şey yapmak yerine sakin vakit geçirmek sana iyi gelebilir.',
            home: 'Aynı anda birkaç işle birden uğraşmak sana yorucu gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz ödevlerini acele etmeden, kendi temposunda yapmayı seçebilir.',
            friends: 'Arkadaşlarıyla boş zamanında pek çok şey yapmak yerine sakin vakit geçirmek ona iyi gelebilir.',
            home: 'Aynı anda birkaç işle birden uğraşmak ona yorucu gelebilir.',
          },
          adult: {
            work: 'İşlerini acele etmeden, kendi temponda yapmayı seçebilirsin.',
          },
        },
        average: {
          from: { school: ['enl05'], friends: ['enl03'], home: ['enl01', 'enl02'], work: ['enl05'] },
          student: {
            school: 'Bazı haftalar derslerde çok iş çıkarabilir, bazı haftalar daha sakin ilerleyebilirsin.',
            friends: 'Arkadaşlarınla boş zamanında bazen pek çok şey yapabilir, bazen sakin kalmayı seçebilirsin.',
            home: 'Bazen birkaç işi birden idare edebilir, bazen tek bir işle ilgilenebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı haftalar derslerde çok iş çıkarabilir, bazı haftalar daha sakin ilerleyebilir.',
            friends: 'Arkadaşlarıyla boş zamanında bazen pek çok şey yapabilir, bazen sakin kalmayı seçebilir.',
            home: 'Bazen birkaç işi birden idare edebilir, bazen tek bir işle ilgilenebilir.',
          },
          adult: {
            work: 'Bazı haftalar çok iş çıkarabilir, bazı haftalar daha sakin ilerleyebilirsin.',
          },
        },
        high: {
          from: { school: ['enl01'], friends: ['enl03'], home: ['enl04', 'enl09'], work: ['enl01', 'enl05'] },
          student: {
            school: 'Aynı hafta içinde birkaç ödevi ve etkinliği birlikte idare edebilirsin.',
            friends: 'Arkadaşlarınla boş zamanını pek çok etkinlikle doldurmak hoşuna gidebilir.',
            home: 'Uzun süre boş oturmak sana sıkıcı gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz aynı hafta içinde birkaç ödevi ve etkinliği birlikte idare edebilir.',
            friends: 'Arkadaşlarıyla boş zamanını pek çok etkinlikle doldurmak hoşuna gidebilir.',
            home: 'Uzun süre boş oturmak ona sıkıcı gelebilir.',
          },
          adult: {
            work: 'Aynı anda birkaç işi birlikte yürütüp çok iş çıkarabilirsin.',
          },
        },
      },
    },
    /*
     * Düzen ve plan: org01 "Yapmam gereken işleri hemen hallederim", org02 "Plan yapar ve planıma bağlı kalırım", org03 "Bir
     * plana ya da programa göre hareket ederim", org04 "Her şeyin tam yerli yerinde olmasını isterim", org05 "Düzeni severim";
     * ters: org06 "Kullandığım şeyleri yerine koymayı sık sık unuturum", org07 "Zamanımı boşa harcarım" (kullanılmadı), org08
     * "Eşyalarımı ortada bırakırım", org09 "Dağınıklık beni rahatsız etmez", org10 "Hoşa gitmeyen işleri ertelerim".
     */
    organization: {
      poles: { low: 'Düzene pek takılmaz', high: 'Düzenli ve planlı ilerler' },
      bands: {
        low: {
          from: { school: ['org10'], friends: ['org03'], home: ['org09', 'org08'], work: ['org10'] },
          student: {
            school: 'Hoşuna gitmeyen ödevleri sonraya bırakabilirsin.',
            friends: 'Arkadaşlarınla bir programa bağlı kalmak yerine günü akışına bırakmak sana uygun gelebilir.',
            home: 'Eşyaların ortada kalsa da dağınıklık seni pek rahatsız etmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz hoşuna gitmeyen ödevleri sonraya bırakabilir.',
            friends: 'Arkadaşlarıyla bir programa bağlı kalmak yerine günü akışına bırakmak ona uygun gelebilir.',
            home: 'Eşyaları ortada kalsa da dağınıklık onu pek rahatsız etmeyebilir.',
          },
          adult: {
            work: 'Hoşuna gitmeyen işleri sonraya bırakabilirsin.',
          },
        },
        average: {
          from: { school: ['org02', 'org10'], friends: ['org03'], home: ['org08', 'org05'], work: ['org02', 'org10'] },
          student: {
            school: 'Bazı ödevleri planlayıp hemen bitirebilir, bazılarını sonraya bırakabilirsin.',
            friends: 'Arkadaşlarınla bazen bir programa göre hareket edebilir, bazen günü akışına bırakabilirsin.',
            home: 'Eşyaların bazen yerli yerinde, bazen ortada olabilir.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevleri planlayıp hemen bitirebilir, bazılarını sonraya bırakabilir.',
            friends: 'Arkadaşlarıyla bazen bir programa göre hareket edebilir, bazen günü akışına bırakabilir.',
            home: 'Eşyaları bazen yerli yerinde, bazen ortada olabilir.',
          },
          adult: {
            work: 'Bazı işleri planlayıp hemen bitirebilir, bazılarını sonraya bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['org02', 'org01'], friends: ['org03'], home: ['org04', 'org05'], work: ['org02', 'org01'] },
          student: {
            school: 'Ödevlerini planlayıp plana bağlı kalabilir, yapman gerekenleri hemen halledebilirsin.',
            friends: 'Arkadaşlarınla bir şey yaparken önceden belli bir program olması hoşuna gidebilir.',
            home: 'Her şeyin yerli yerinde olmasını isteyebilirsin; bir eşya yerinde olmayınca canın sıkılabilir.',
          },
          parent: {
            school: 'Çocuğunuz ödevlerini planlayıp plana bağlı kalabilir, yapması gerekenleri hemen halledebilir.',
            friends: 'Arkadaşlarıyla bir şey yaparken önceden belli bir program olması hoşuna gidebilir.',
            home: 'Her şeyin yerli yerinde olmasını isteyebilir; bir eşya yerinde olmayınca canı sıkılabilir.',
          },
          adult: {
            work: 'İşlerini planlayıp plana bağlı kalabilir, yapman gerekenleri hemen halledebilirsin.',
          },
        },
      },
    },
  },
};
