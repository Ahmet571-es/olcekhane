import type { SurveyDaily } from './types';

/**
 * Ayrıntılı Kişilik Profili: günlük hayatta nasıl görünür (9. sınıftan yetişkine).
 * Sonuç kartı olan ölçekler beş boyuttur (lib/reports/daily-parts.ts, dailyScales: ayrıntılı profilde alt özelliklerin kendi
 * kartı yoktur). Bir boyutun örnekleri onun alt özelliklerinin maddelerinden yazılır ve birkaç alt özelliğe yayılır; alt
 * özellikler ayrıştığında kart örnek göstermez. Madde anahtarları kaynaktaki sıra numarasıdır (k001–k120).
 * Dört boyut özellik tonundadır (src/content/reports/ayrintili-kisilik.ts): düşük ve yüksek düzeyin örneklerinden en az biri
 * bir kolaylık, en az biri yumuşak bir zorluk söyler. Duygusal Denge gelişim tonundadır (düşük düzeyi destek kutusunu açar):
 * düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz; zor anı anlatan her örneğin yanında bir dayanak
 * vardır; hassas maddelere ("Kendimden hoşlanmam", "Kolayca paniğe kapılırım", "baş edemeyeceğimi hissederim") ve aşırılık
 * maddelerine dayanılmadı. Başarı ve yetkinlik bildiren maddelere (yetkinlik duygusu, "Soyut fikirleri anlamakta zorlanırım")
 * ve tehlikeyi umursamama maddesine de dayanılmadı: örnekler beceri ya da risk önerisi gibi okunmasın. Temkinliliğin
 * "düşünmeden işlere atılırım" maddeleri düşük düzeyde bir kolaylık gibi anlatılmaz: arkadaşların ani önerisine katılmak
 * yalnızca "Bir işe acele edip hemen dalarım" (k090) maddesine dayanır.
 * Yetişkinin iş satırı `work`. Arkadaş ve ev satırlarında okul sözcüğü yoktur; evde başka biriyle yaşamayı varsayan ev
 * satırlarına ("evdekiler") yetişkin için ayrı bir satır (`adult.home`, "bir yakının", "yakınların") yazıldı.
 * Maddeye doğrudan dayanmayan uzantılar: uyumlulukta düşük düzeyde "düşündüğünü açıkça söyleyebilirsin" (k079'un olumlu
 * yanı) ve yüksek düzeyde "bu bazen işlerini geciktirebilir" (k014 ve k104'ün bedeli), sorumlulukta yüksek düzeyde "düzen
 * bozulunca canın sıkılabilir" (k010'un bedeli), deneyime açıklıkta yüksek düzeyde "düşüncelere dalıp işi unutabilirsin"
 * (k093'ün bedeli) ve duygusal dengedeki dayanaklar.
 */
export const ayrintiliKisilikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'ayrintili-kisilik-gunluk-1',
  scales: {
    /*
     * Dışadönüklük. Sıcakkanlılık: k002 "Kolayca arkadaş edinirim", k032; ters k062, k092 "İnsanlara karşı mesafeli
     * dururum". Kalabalık sevgisi: k007 "Kalabalık kutlamaları ve eğlenceleri çok severim", k037 "Kalabalık ortamlarda birçok
     * farklı kişiyle konuşurum"; ters k067 "Yalnız kalmayı tercih ederim", k097 "Kalabalıktan kaçarım". Liderlik: k012
     * "İdareyi ele alırım", k042 "Başkalarına liderlik etmeye çalışırım", k072 "İşlerin kontrolünü elime alırım"; ters k102
     * "Yolu başkalarının göstermesini beklerim". Tempo: k017 "Hep bir şeylerle meşgulümdür", k047 "Sürekli hareket
     * hâlindeyim", k077; ters k107 "Yavaş ve rahat bir tempoda yaşamayı severim". Heyecan arayışı: k022 "Heyecanı çok
     * severim", k052 (k082 ve k112 kullanılmadı). Neşe: k027, k057, k087, k117.
     */
    extraversion: {
      poles: { low: 'Sakin ortamları sever', high: 'Hareketli ortamları sever' },
      bands: {
        low: {
          from: { school: ['k102', 'k042'], friends: ['k097', 'k092'], home: ['k107'], work: ['k012', 'k102'] },
          student: {
            school: 'Grup çalışmasında liderlik etmek yerine yolu başkalarının göstermesini bekleyebilirsin.',
            friends: 'Kalabalık bir eğlence yerine az kişiyle buluşmayı seçebilirsin; yeni insanlara açılman zaman alabilir.',
            home: 'Boş zamanında yavaş ve rahat bir tempoda dinlenmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında liderlik etmek yerine yolu başkalarının göstermesini bekleyebilir.',
            friends: 'Kalabalık bir eğlence yerine az kişiyle buluşmayı seçebilir; yeni insanlara açılması zaman alabilir.',
            home: 'Boş zamanında yavaş ve rahat bir tempoda dinlenmek ona iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte idareyi ele almak yerine yolu başkalarının göstermesini bekleyebilirsin.',
          },
        },
        average: {
          from: { school: ['k012', 'k102'], friends: ['k007', 'k067'], home: ['k017', 'k107'], work: ['k072'] },
          student: {
            school: 'Bazı grup çalışmalarında idareyi alabilir, bazılarında başkasının yol göstermesini bekleyebilirsin.',
            friends: 'Bazen kalabalık bir kutlamaya katılmak, bazen yalnız kalmak isteyebilirsin.',
            home: 'Bazı günler bir sürü işle meşgul olabilir, bazı günler rahat bir tempoyu seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı grup çalışmalarında idareyi alabilir, bazılarında başkasının yol göstermesini bekleyebilir.',
            friends: 'Bazen kalabalık bir kutlamaya katılmak, bazen yalnız kalmak isteyebilir.',
            home: 'Bazı günler bir sürü işle meşgul olabilir, bazı günler rahat bir tempoyu seçebilir.',
          },
          adult: {
            work: 'Bazı işlerde kontrolü eline alabilir, bazılarında başkasının yönetmesine uyabilirsin.',
          },
        },
        high: {
          from: { school: ['k042', 'k012'], friends: ['k037', 'k022'], home: ['k107', 'k047'], work: ['k072', 'k042'] },
          student: {
            school: 'Grup çalışmasında idareyi ele alıp başkalarına yol göstermeye çalışabilirsin.',
            friends: 'Kalabalık bir ortamda pek çok farklı kişiyle konuşabilir, heyecanlı yeni bir etkinlik önerebilirsin.',
            home: 'Yavaş geçen, sakin bir günde canın sıkılabilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında idareyi ele alıp başkalarına yol göstermeye çalışabilir.',
            friends: 'Kalabalık bir ortamda pek çok farklı kişiyle konuşabilir, heyecanlı yeni bir etkinlik önerebilir.',
            home: 'Yavaş geçen, sakin bir günde canı sıkılabilir.',
          },
          adult: {
            work: 'Bir işte kontrolü eline alıp başkalarına yol göstermeye çalışabilirsin.',
          },
        },
      },
    },
    /*
     * Uyumluluk. İnsanlara güven: k004, k034 "İnsanların iyi niyetli olduğuna inanırım", k064 "İnsanların söylediklerine
     * güvenirim"; ters k094 "İnsanlara güvenmem". Adil davranma: dört maddesi de ters (k009, k039, k069, k099; kullanılmadı:
     * suçlayıcı okunmasın). Yardımseverlik: k014 "Başkalarına yardım etmeyi severim", k044 "Başkalarının iyi olup olmadığını
     * önemserim"; ters k074, k104 "Başkalarına zaman ayırmam". Uzlaşmacılık: dört maddesi de ters: k019, k049 "İnsanlara
     * bağırırım", k079 "Başkalarını kıracak sözler söylerim", k109. Alçakgönüllülük (k024, k054, k084, k114) ve şefkat
     * (k029, k059, k089, k119) kullanılmadı.
     */
    agreeableness: {
      poles: { low: 'Kendi görüşünü gözetir', high: 'Başkalarını gözetir' },
      bands: {
        low: {
          from: { school: ['k079'], friends: ['k094', 'k064'], home: ['k104', 'k014'], work: ['k079'] },
          student: {
            school: 'Bir tartışmada düşündüğünü açıkça söyleyebilirsin; bu bazen birini kırabilir.',
            friends: 'Yeni tanıştığın birinin söylediklerine hemen güvenmek yerine önce biraz bekleyebilirsin.',
            home: 'Evdekilere yardım etmek yerine önce kendi işlerini bitirmeyi seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir tartışmada düşündüğünü açıkça söyleyebilir; bu bazen birini kırabilir.',
            friends: 'Yeni tanıştığı birinin söylediklerine hemen güvenmek yerine önce biraz bekleyebilir.',
            home: 'Evdekilere yardım etmek yerine önce kendi işlerini bitirmeyi seçebilir.',
          },
          adult: {
            work: 'Bir işte karşı çıktığın bir şeyi açıkça söyleyebilirsin; bu bazen birini kırabilir.',
            home: 'Bir yakının yardım isteyince önce kendi işlerini bitirmeyi seçebilirsin.',
          },
        },
        average: {
          from: { school: ['k014', 'k104'], friends: ['k064', 'k094'], home: ['k079', 'k049'], work: ['k014', 'k104'] },
          student: {
            school: 'Grup çalışmasında bazen arkadaşlarına yardım edebilir, bazen önce kendi payını bitirmek isteyebilirsin.',
            friends: 'Bazı insanlara hemen güvenebilir, bazılarını önce biraz tanımak isteyebilirsin.',
            home: 'Evdekilerle bir anlaşmazlıkta çoğu zaman kırmadan konuşabilir, bazen sesini yükseltebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bazen arkadaşlarına yardım edebilir, bazen önce kendi payını bitirmek isteyebilir.',
            friends: 'Bazı insanlara hemen güvenebilir, bazılarını önce biraz tanımak isteyebilir.',
            home: 'Evdekilerle bir anlaşmazlıkta çoğu zaman kırmadan konuşabilir, bazen sesini yükseltebilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişilere bazen yardım edebilir, bazen önce kendi işini bitirmek isteyebilirsin.',
            home: 'Yakınlarınla bir anlaşmazlıkta çoğu zaman kırmadan konuşabilir, bazen sesini yükseltebilirsin.',
          },
        },
        high: {
          from: { school: ['k014', 'k044'], friends: ['k064', 'k034'], home: ['k014', 'k104'], work: ['k044', 'k014'] },
          student: {
            school: 'Grup çalışmasında arkadaşlarının iyi olup olmadığını önemseyip onlara yardım edebilirsin.',
            friends: 'İnsanların iyi niyetli olduğuna inanıp söylediklerine güvenebilirsin.',
            home: 'Evdekilerden biri yardım isteyince kendi işini hemen bırakabilirsin; bu bazen işlerini geciktirebilir.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında arkadaşlarının iyi olup olmadığını önemseyip onlara yardım edebilir.',
            friends: 'İnsanların iyi niyetli olduğuna inanıp söylediklerine güvenebilir.',
            home: 'Evdekilerden biri yardım isteyince kendi işini hemen bırakabilir; bu bazen işlerini geciktirebilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın birinin iyi olup olmadığını önemseyip ona yardım etmek isteyebilirsin.',
            home: 'Bir yakının yardım isteyince kendi işini hemen bırakabilirsin; bu bazen işlerini geciktirebilir.',
          },
        },
      },
    },
    /*
     * Sorumluluk. Düzenlilik: k010 "Ortalığı toplayıp düzenlemeyi severim"; ters k040, k070, k100 "Eşyalarımı ortada
     * bırakırım". Görev bilinci: k015 "Verdiğim sözleri tutarım", k045; ters k075, k105 "Sözümden dönerim". Çalışkanlık: k020
     * "Çok çalışırım", k050 "Benden beklenenden fazlasını yaparım"; ters k080 "Sadece idare edecek kadar çalışırım", k110.
     * Öz disiplin: k025 "Her zaman hazırlıklı olurum", k055 "Yaptığım planları uygularım"; ters k085, k115. Temkinlilik: dört
     * maddesi de ters: k030 "Düşünmeden işlere atılırım", k060 "Aceleci kararlar veririm", k090 "Bir işe acele edip hemen
     * dalarım", k120. Yetkinlik duygusu (k005, k035, k065, k095) kullanılmadı.
     */
    conscientiousness: {
      poles: { low: 'Akışına göre ilerler', high: 'Planlı ve düzenli ilerler' },
      bands: {
        low: {
          from: { school: ['k025', 'k055'], friends: ['k090'], home: ['k100', 'k040'], work: ['k025', 'k055'] },
          student: {
            school: 'Bir sınava son günlerde hazırlanabilir, yaptığın planı uygulamayı erteleyebilirsin.',
            friends: 'Arkadaşlarının ani bir önerisine çoğu zaman hemen katılabilirsin.',
            home: 'Eşyalarını ortada bırakabilir, sonra aradığını bulmak için zaman harcayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınava son günlerde hazırlanabilir, yaptığı planı uygulamayı erteleyebilir.',
            friends: 'Arkadaşlarının ani bir önerisine çoğu zaman hemen katılabilir.',
            home: 'Eşyalarını ortada bırakabilir, sonra aradığını bulmak için zaman harcayabilir.',
          },
          adult: {
            work: 'Bir işe son anda hazırlanabilir, planladığın adımları erteleyebilirsin.',
          },
        },
        average: {
          from: { school: ['k055'], friends: ['k060', 'k030'], home: ['k010', 'k100'], work: ['k020', 'k080'] },
          student: {
            school: 'Bazı günler yaptığın çalışma planını uygulayabilir, bazı günler erteleyebilirsin.',
            friends: 'Arkadaşlarınla plan yaparken bazen uzun uzun düşünebilir, bazen hemen karar verebilirsin.',
            home: 'Ortalığı bazen toplayıp düzenleyebilir, yoğun günlerde eşyalarını ortada bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı günler yaptığı çalışma planını uygulayabilir, bazı günler erteleyebilir.',
            friends: 'Arkadaşlarıyla plan yaparken bazen uzun uzun düşünebilir, bazen hemen karar verebilir.',
            home: 'Ortalığı bazen toplayıp düzenleyebilir, yoğun günlerde eşyalarını ortada bırakabilir.',
          },
          adult: {
            work: 'Bazı işlere çok emek verebilir, bazılarında idare edecek kadarını yapabilirsin.',
          },
        },
        high: {
          from: { school: ['k020', 'k050'], friends: ['k015', 'k105'], home: ['k010'], work: ['k050', 'k055'] },
          student: {
            school: 'Bir ödeve çok emek verip senden beklenenden fazlasını yapabilirsin.',
            friends: 'Arkadaşlarına verdiğin sözleri çoğu zaman tutabilirsin.',
            home: 'Ortalığı toplayıp düzenlemeyi sevebilirsin; düzen bozulunca canın sıkılabilir.',
          },
          parent: {
            school: 'Çocuğunuz bir ödeve çok emek verip kendisinden beklenenden fazlasını yapabilir.',
            friends: 'Arkadaşlarına verdiği sözleri çoğu zaman tutabilir.',
            home: 'Ortalığı toplayıp düzenlemeyi sevebilir; düzen bozulunca canı sıkılabilir.',
          },
          adult: {
            work: 'Bir işte planını uygulayıp senden beklenenden fazlasını yapmaya çalışabilirsin.',
          },
        },
      },
    },
    /*
     * Duygusal Denge (gelişim tonu; kaynakta Nevrotiklik, ters yönde puanlanır). Sakinlik: ters k001 "Birçok şey için
     * endişelenirim", k031, k061, k091 "Kolayca strese girerim". Sabırlılık: ters k006 "Çabuk öfkelenirim", k036 "Sinirim
     * çabuk bozulur", k066; k096 "Kolay kolay sinirlenmem". İç huzuru: ters k011 "Sık sık kendimi hüzünlü hissederim", k071
     * "Sık sık moralim bozuk olur" (k041 kullanılmadı); k101 "Kendimle barışığım". Sosyal rahatlık: ters k016 "Başkalarının
     * yanına gidip konuşmakta zorlanırım", k046, k076 "Yalnızca arkadaşlarımın yanında rahat ederim"; k106 "Zor ya da gergin
     * sosyal durumlar beni pek rahatsız etmez". Dayanıklılık: k116 "Baskı altında sakin kalırım" (k026, k056, k086
     * kullanılmadı). Ölçülülük (k021, k051, k081, k111) kullanılmadı. Düşük düzey "sık sık" demez.
     */
    emotional_stability: {
      poles: { low: 'Duygularını yoğun yaşar', high: 'Çoğu zaman sakin kalır' },
      bands: {
        low: {
          from: { school: ['k091', 'k001'], friends: ['k036', 'k006'], home: ['k071', 'k011'], work: ['k091', 'k116'] },
          student: {
            school: 'Sınav haftası yaklaşırken kolayca strese girebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            friends: 'Bir anlaşmazlıkta sinirin çabuk bozulabilir; sonra olanı sakin bir anda konuşmak rahatlatabilir.',
            home: 'Bazı günler moralin bozuk olabilir; seni üzen şeyi paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Sınav haftası yaklaşırken çocuğunuz kolayca strese girebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            friends: 'Bir anlaşmazlıkta siniri çabuk bozulabilir; sonra olanı sakin bir anda konuşmak onu rahatlatabilir.',
            home: 'Bazı günler morali bozuk olabilir; onu üzen şeyi paylaşmak iyi gelebilir.',
          },
          adult: {
            work: 'Baskılı bir iş gününde kolayca strese girebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['k116', 'k091'], friends: ['k076', 'k016'], home: ['k011', 'k101'], work: ['k116', 'k091'] },
          student: {
            school: 'Çoğu zaman sakin kalabilirsin; önemli bir sınavdan önce ise gerilebilirsin.',
            friends: 'Tanıdığın kişilerle rahat olabilir, yeni bir ortamda önce biraz gerilebilirsin.',
            home: 'Bazı günler hüzünlü hissedebilir, çoğu gün kendinle barışık olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz çoğu zaman sakin kalabilir; önemli bir sınavdan önce ise gerilebilir.',
            friends: 'Tanıdığı kişilerle rahat olabilir, yeni bir ortamda önce biraz gerilebilir.',
            home: 'Bazı günler hüzünlü hissedebilir, çoğu gün kendisiyle barışık olabilir.',
          },
          adult: {
            work: 'Çoğu iş gününde sakin kalabilir, sıkışık bir dönemde gerilebilirsin.',
          },
        },
        high: {
          from: { school: ['k116'], friends: ['k096', 'k106'], home: ['k101', 'k011'], work: ['k116'] },
          student: {
            school: 'Sınav gibi baskılı bir durumda da çoğu zaman sakin kalabilirsin.',
            friends: 'Gergin bir ortamda ya da bir tartışmada çoğu zaman kolay kolay sinirlenmeyebilirsin.',
            home: 'Çoğu gün kendinle barışık olabilirsin; yine de seni üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınav gibi baskılı bir durumda da çoğu zaman sakin kalabilir.',
            friends: 'Gergin bir ortamda ya da bir tartışmada çoğu zaman kolay kolay sinirlenmeyebilir.',
            home: 'Çoğu gün kendisiyle barışık olabilir; yine de onu üzen bir şeyi paylaşmak iyi gelebilir.',
          },
          adult: {
            work: 'Baskılı bir iş gününde de çoğu zaman sakin kalabilirsin.',
          },
        },
      },
    },
    /*
     * Deneyime Açıklık (Liberalizm çıkarıldı). Hayal gücü: k003, k033 "Uçsuz bucaksız hayallere dalmaktan hoşlanırım", k063,
     * k093 "Düşüncelere dalıp gitmeyi severim". Sanata ilgi: k008, k038; ters k068, k098 "Sanat sergilerini gezmekten
     * hoşlanmam". Duygulara açıklık: k013, k043; ters k073, k103 (kullanılmadı). Değişime açıklık: k018 "Hep aynı şeyleri
     * yapmak yerine çeşitliliği tercih ederim"; ters k048 "Bildiğim şeylere bağlı kalmayı tercih ederim", k078 "Değişiklikten
     * hoşlanmam", k108 "Alışılmış yöntemlere bağlıyım". Düşünsel merak: k023 "Anlamak için kafa yormam gereken metinler
     * okumayı severim"; ters k053 "Felsefi tartışmalardan kaçınırım", k083 (kullanılmadı), k113 "Teorik tartışmalar ilgimi
     * çekmez". Düşük ucun örnekleri ilgiyi anlatır.
     */
    openness: {
      poles: { low: 'Bildiği yolu seçer', high: 'Yeniye ve hayale açık' },
      bands: {
        low: {
          from: { school: ['k113', 'k053'], friends: ['k048'], home: ['k078'], work: ['k108', 'k048'] },
          student: {
            school: 'Derste teorik bir tartışma açılınca ilgin azalabilir; somut konular sana daha çekici gelebilir.',
            friends: 'Arkadaşlarınla buluşurken bildiğin ve sevdiğin bir yere gitmek sana güven verebilir.',
            home: 'Günlük düzenin birden değişince canın sıkılabilir.',
          },
          parent: {
            school: 'Derste teorik bir tartışma açılınca çocuğunuzun ilgisi azalabilir; somut konular ona daha çekici gelebilir.',
            friends: 'Arkadaşlarıyla buluşurken bildiği ve sevdiği bir yere gitmek ona güven verebilir.',
            home: 'Günlük düzeni birden değişince canı sıkılabilir.',
          },
          adult: {
            work: 'İşleri alışık olduğun yöntemle yapmak sana güven verebilir.',
          },
        },
        average: {
          from: { school: ['k113'], friends: ['k018', 'k048'], home: ['k093'], work: ['k108', 'k018'] },
          student: {
            school: 'Bazı teorik konular ilgini çekebilir, bazıları sana uzak gelebilir.',
            friends: 'Arkadaşlarınla bazen yeni bir etkinlik deneyebilir, bazen alışık olduğun şeyi seçebilirsin.',
            home: 'Bazen düşüncelere dalıp gidebilir, bazen hemen işe koyulabilirsin.',
          },
          parent: {
            school: 'Bazı teorik konular çocuğunuzun ilgisini çekebilir, bazıları ona uzak gelebilir.',
            friends: 'Arkadaşlarıyla bazen yeni bir etkinlik deneyebilir, bazen alışık olduğu şeyi seçebilir.',
            home: 'Bazen düşüncelere dalıp gidebilir, bazen hemen işe koyulabilir.',
          },
          adult: {
            work: 'Bazı işlerde yeni bir yöntem deneyebilir, bazılarında alışık olduğun yolu seçebilirsin.',
          },
        },
        high: {
          from: { school: ['k023', 'k113'], friends: ['k018', 'k098'], home: ['k093', 'k033'], work: ['k018', 'k108'] },
          student: {
            school: 'Anlamak için kafa yorman gereken bir metni ya da teorik bir konuyu ilginç bulabilirsin.',
            friends: 'Arkadaşlarına yeni bir yer ya da bir sanat sergisi gezmeyi önerebilirsin.',
            home: 'Düşüncelere dalıp yapman gereken bir işi unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz anlamak için kafa yorması gereken bir metni ya da teorik bir konuyu ilginç bulabilir.',
            friends: 'Arkadaşlarına yeni bir yer ya da bir sanat sergisi gezmeyi önerebilir.',
            home: 'Düşüncelere dalıp yapması gereken bir işi unutabilir.',
          },
          adult: {
            work: 'Bir işte alışılmış yöntem yerine yeni bir yol denemek sana heyecan verebilir.',
          },
        },
      },
    },
  },
};
