import type { SurveyDaily } from './types';

/**
 * Altı Boyutlu Kişilik Profili (HEXACO): günlük hayatta nasıl görünür (9. sınıftan yetişkine).
 * Sonuç kartı olan ölçekler altı boyuttur (lib/reports/daily-parts.ts, dailyScales: alt özelliklerin kendi kartı yoktur).
 * Bir boyutun örnekleri onun dört alt özelliğinin maddelerinden yazılır; alt özellikler ayrıştığında kart örnek göstermez.
 * Boyutlar kaynaktaki yönleriyle anlatılır (src/content/reports/alti-boyutlu-kisilik.ts):
 *  - Dürüstlük-Alçakgönüllülük özellik tonundadır. Düşük uç suçlanmaz: hırsızlık, dolandırıcılık ve kandırma maddelerine
 *    dayanılmadı; düşük ucun kolaylığı iyi yönlerini anlatmaktan çekinmemek (mode10'un olumlu yanı) ve konum isteğinin
 *    çalışmaya yöneltmesidir, zorluğu bir oyunda kuralları esnetmenin çekici gelmesidir. Yüksek ucun yumuşak zorluğu iyi
 *    yaptığı bir işi anlatmanın rahat gelmemesidir (alçakgönüllülük maddelerinin bedeli). Uçlar birbirinin aynası olarak
 *    yazılır ("Öne çıkmayı önemser" ↔ "Sade kalmayı önemser"); yüksek uç "içten" demez, düşük uç da içten değilmiş gibi
 *    okunmasın.
 *  - Duygusallık gelişim tonundadır (Endişelenme alt özelliği yüksekse destek kutusu açılır). Bu boyutta yüksek puan
 *    duyguları daha yoğun yaşamak demektir; öteki testlerdeki Duygusal Denge'nin tersi gibi okunmaz. Zor anı anlatan uç
 *    yüksek uçtur: oraya uydurma bir güçlü yan, sakin uca (düşük uç) uydurma bir zorluk yazılmaz. Yüksek ucun örnekleri
 *    endişeyi, başkalarının üzüntüsünden etkilenmeyi ve destek istemeyi olduğu gibi anlatır; endişe örneğinin yanında bir
 *    dayanak vardır. Tehlikeden çekinme alt özelliğine (korku ve risk maddeleri) dayanılmadı: düşük uç risk alma önerisi
 *    gibi okunmasın; "Kolayca paniğe kapılırım" ve "Duygusallaşan insanları anlamam" maddelerine de dayanılmadı.
 *  - Dışadönüklük, Uyumluluk (bu modelde öfke ve sabır buradadır), Sorumluluk ve Deneyime Açıklık özellik tonundadır: düşük
 *    ve yüksek düzeyin örneklerinden en az biri bir kolaylık, en az biri yumuşak bir zorluk söyler.
 * Beceri bildiren maddelere ("Hazırlıksız konuşma yapmakta iyiyim", "Liderlik yeteneğim var", "Çok iyi fikirler bulurum",
 * "Çoğu insandan daha yetenekliyim") ve sağlık bildirenlere (kondisyon, dinçlik, "Çabuk yorulurum") dayanılmadı.
 * Yetişkinin iş satırı `work`; iş satırları bir büro işi varsaymaz ("toplantı" yerine bir grup ya da birlikte iş yapılan
 * kişiler). Arkadaş ve ev satırlarında okul sözcüğü yoktur; evde başka biriyle yaşamayı varsayan ev satırlarına
 * ("evdekiler") yetişkin için ayrı bir satır (`adult.home`, "yakınların") yazıldı.
 * Maddeye doğrudan dayanmayan uzantılar: dürüstlük-alçakgönüllülükte düşük düzeyde "seni çalışmaya yöneltebilir" (gree05 ve
 * mode05'in olumlu yanı; raporun metni), dışadönüklükte yüksek düzeyde "uzun süre yalnız kalınca canın sıkılabilir" (soci01'in
 * bedeli), uyumlulukta yüksek düzeyde "bazen bunu söylemek de iyi gelebilir" (gent01'in bedeli), sorumlulukta yüksek
 * düzeyde "bu bazen işi uzatabilir" (perf02'nin bedeli), deneyime açıklıkta düşük düzeyde "bu sana zaman kazandırabilir"
 * (crea05'in düşük ucu) ve duygusallıktaki dayanaklar.
 */
export const altiBoyutluKisilikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'alti-boyutlu-kisilik-gunluk-1',
  scales: {
    /*
     * Dürüstlük-Alçakgönüllülük. İçtenlik: sinc01 "Olduğumdan fazlasıymışım gibi davranmam"; ters sinc02–sinc10 (ör. sinc06
     * "İnsanları etkilemek için rol yaparım"). Adil davranma: fair03 "Kasiyer para üstünü yanlışlıkla fazla verirse fazlasını
     * geri veririm", fair05 "Kurallara uymaya çalışırım"; ters fair07 "Öne geçmek için hile yaparım" (çalma ve kandırma
     * maddeleri kullanılmadı). Sadelik: gree02 "Şık görünmek için uğraşmam"; ters gree03 "Lüksü çok severim", gree04 "Güç
     * sahibi olmaya büyük ihtiyaç duyarım", gree05 "Statü peşinde koşarım", gree10 "Kendi çıkarımın peşinde koşarım".
     * Alçakgönüllülük: mode01–mode04; ters mode05 "Başkalarından daha güçlü bir konumda olmak isterim", mode07 "Dikkat
     * çekmeyi severim", mode10 "İyi yönlerimle övünürüm".
     */
    honesty_humility: {
      poles: { low: 'Öne çıkmayı önemser', high: 'Sade kalmayı önemser' },
      bands: {
        low: {
          from: { school: ['mode10', 'mode07'], friends: ['fair07', 'fair05'], home: ['gree02', 'gree03'], work: ['gree05', 'mode05'] },
          student: {
            school: 'Başardığın bir işi ve iyi yönlerini başkalarına anlatmaktan çekinmeyebilirsin.',
            friends: 'Bir oyunda öne geçmek için kuralları biraz esnetmek sana çekici gelebilir.',
            home: 'Giyinirken şık görünmeye özen gösterebilir, lüks şeylere ilgi duyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz başardığı bir işi ve iyi yönlerini başkalarına anlatmaktan çekinmeyebilir.',
            friends: 'Bir oyunda öne geçmek için kuralları biraz esnetmek ona çekici gelebilir.',
            home: 'Giyinirken şık görünmeye özen gösterebilir, lüks şeylere ilgi duyabilir.',
          },
          adult: {
            work: 'Bir işte daha yüksek bir konuma gelmek ve söz sahibi olmak seni çalışmaya yöneltebilir.',
          },
        },
        average: {
          from: { school: ['fair05', 'gree10'], friends: ['mode07'], home: ['gree03', 'gree02'], work: ['gree05', 'gree04'] },
          student: {
            school: 'Derste çoğu zaman kurallara uyabilir, bazen kendi çıkarını öne alabilirsin.',
            friends: 'Arkadaş ortamında bazen dikkat çekmekten hoşlanabilir, bazen geri durmayı seçebilirsin.',
            home: 'Bazen şık ve güzel şeylere ilgi duyabilir, bazen sade olanı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste çoğu zaman kurallara uyabilir, bazen kendi çıkarını öne alabilir.',
            friends: 'Arkadaş ortamında bazen dikkat çekmekten hoşlanabilir, bazen geri durmayı seçebilir.',
            home: 'Bazen şık ve güzel şeylere ilgi duyabilir, bazen sade olanı seçebilir.',
          },
          adult: {
            work: 'Bir işte bazen konumunu yükseltmeyi önemseyebilir, bazen bunu pek dert etmeyebilirsin.',
          },
        },
        high: {
          from: { school: ['fair05', 'fair07'], friends: ['sinc01', 'sinc06'], home: ['mode10', 'mode07'], work: ['fair03'] },
          student: {
            school: 'Bir sınavda ya da yarışmada hile yapmak yerine kurallara uymayı önemseyebilirsin.',
            friends: 'Arkadaşlarının yanında olduğundan farklı görünmeye çalışmadan doğal davranabilirsin.',
            home: 'İyi yaptığın bir işi evdekilere anlatmak sana pek rahat gelmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavda ya da yarışmada hile yapmak yerine kurallara uymayı önemseyebilir.',
            friends: 'Arkadaşlarının yanında olduğundan farklı görünmeye çalışmadan doğal davranabilir.',
            home: 'İyi yaptığı bir işi evdekilere anlatmak ona pek rahat gelmeyebilir.',
          },
          adult: {
            work: 'Bir alışverişte sana yanlışlıkla fazla para verilirse bunu geri vermeyi önemseyebilirsin.',
            home: 'İyi yaptığın bir işi yakınlarına anlatmak sana pek rahat gelmeyebilir.',
          },
        },
      },
    },
    /*
     * Duygusallık (gelişim tonu; yüksek puan = duyguları daha yoğun yaşamak). Endişelenme: anxi02 "Birçok şey için
     * endişelenirim", anxi03 "Kolayca strese girerim"; ters anxi06 "Nadiren endişelenirim", anxi08 "Olaylar karşısında kolay
     * kolay huzursuz olmam", anxi09 "Baskı altında sakin kalırım", anxi10 "Olup bitmiş şeyleri dert etmem". Destek ihtiyacı
     * (on maddesi de düz): depe05 "Sık sık yardıma ihtiyaç duyarım", depe06 "Üzüldüğümü belli ederim", depe08 "Destek
     * ararım". Duygusal duyarlılık: sent02 "Üzücü bir olay duyduğumda hemen hüzünlenirim", sent03 "Film izlerken ağlarım",
     * sent05 "Başkalarının başına gelen kötü şeylerden derinden etkilenirim"; ters sent06 "Hüzünlü filmleri izlerken nadiren
     * ağlarım". Tehlikeden çekinme (fear01–fear10) kullanılmadı.
     */
    emotionality: {
      poles: { low: 'Olayları sakin karşılar', high: 'Duygularını yoğun yaşar' },
      bands: {
        low: {
          from: { school: ['anxi09', 'anxi06'], friends: ['anxi10'], home: ['depe05', 'depe08'], work: ['anxi09'] },
          student: {
            school: 'Sınav gibi baskılı bir durumda da çoğu zaman sakin kalabilirsin.',
            friends: 'Arkadaşlarınla yaşadığın bir anlaşmazlığı, bittikten sonra çoğu zaman dert etmeyebilirsin.',
            home: 'Bir sorun çıkınca çoğu zaman önce kendi başına çözmeyi deneyebilirsin; gerektiğinde destek istemek de iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınav gibi baskılı bir durumda da çoğu zaman sakin kalabilir.',
            friends: 'Arkadaşlarıyla yaşadığı bir anlaşmazlığı, bittikten sonra çoğu zaman dert etmeyebilir.',
            home: 'Bir sorun çıkınca çoğu zaman önce kendi başına çözmeyi deneyebilir; gerektiğinde destek istemek de iyi gelebilir.',
          },
          adult: {
            work: 'Baskılı bir iş gününde de çoğu zaman sakin kalıp işine odaklanabilirsin.',
          },
        },
        average: {
          from: { school: ['anxi06', 'anxi02'], friends: ['sent03', 'sent06'], home: ['depe08', 'depe05'], work: ['anxi08', 'anxi03'] },
          student: {
            school: 'Bazı sınavlardan önce endişelenebilir, bazılarını sakin karşılayabilirsin.',
            friends: 'Arkadaşlarınla hüzünlü bir film izlerken bazen gözlerin dolabilir, bazen pek etkilenmeyebilirsin.',
            home: 'Zor bir işte bazen yardım isteyebilir, bazen işin içinden kendin çıkabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlardan önce endişelenebilir, bazılarını sakin karşılayabilir.',
            friends: 'Arkadaşlarıyla hüzünlü bir film izlerken bazen gözleri dolabilir, bazen pek etkilenmeyebilir.',
            home: 'Zor bir işte bazen yardım isteyebilir, bazen işin içinden kendisi çıkabilir.',
          },
          adult: {
            work: 'Bir işte bazı aksiliklerde kolayca strese girebilir, bazılarını sakin karşılayabilirsin.',
          },
        },
        high: {
          from: { school: ['anxi03', 'anxi02'], friends: ['sent02', 'sent05'], home: ['depe06', 'depe08'], work: ['anxi03', 'anxi02'] },
          student: {
            school: 'Bir sınav yaklaşırken kolayca strese girebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            friends: 'Bir arkadaşının başına üzücü bir şey gelince bundan derinden etkilenebilirsin.',
            home: 'Zor bir günde üzüldüğünü belli edip birinden destek isteyebilirsin.',
          },
          parent: {
            school: 'Bir sınav yaklaşırken çocuğunuz kolayca strese girebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            friends: 'Bir arkadaşının başına üzücü bir şey gelince bundan derinden etkilenebilir.',
            home: 'Zor bir günde üzüldüğünü belli edip birinden destek isteyebilir.',
          },
          adult: {
            work: 'Bir işte belirsiz bir durum olunca kolayca strese girebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Dışadönüklük. Kendini ifade etme: expr01 "Çok konuşurum"; ters expr08 "Az konuşurum" (expr09 "Duygularımı içime
     * atarım" kullanılmadı). Sosyal cesaret: socb02 "İlgi odağı olmak beni rahatsız etmez"; ters socb06 "Topluluk önünde
     * konuşma yapmam gerekse korkardım", socb07 "Kalabalıkta geri planda kalmayı tercih ederim", socb09 "İlgi odağı olmaktan
     * nefret ederim". Sosyallik: soci01 "Boş zamanımı genellikle başkalarıyla geçirmeyi severim", soci02 "Kalabalık
     * ortamlarda birçok farklı kişiyle konuşurum", soci03 "Sohbet etmeyi çok severim", soci04 "Kolayca arkadaş edinirim",
     * soci05 "Bir grubun parçası olmaktan keyif alırım". Canlılık: live01 "Gün boyunca enerjimi yüksek tutarım", live03 "Genellikle
     * aktif ve enerji dolu biriyim" (live09 "Çabuk yorulurum" ve live10 "Sık sık kendimi hüzünlü hissederim" kullanılmadı).
     */
    extraversion: {
      poles: { low: 'Sakin ortamları sever', high: 'Sohbetten enerji alır' },
      bands: {
        low: {
          from: { school: ['socb06', 'socb09'], friends: ['soci02', 'socb07'], home: ['soci01'], work: ['socb06', 'socb07'] },
          student: {
            school: 'Derste herkesin önünde konuşmak ya da ilgi odağı olmak sana zor gelebilir.',
            friends: 'Kalabalık bir grup yerine az kişiyle sakin bir sohbet sana daha keyifli gelebilir.',
            home: 'Boş zamanını kendi başına sakin geçirmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Derste herkesin önünde konuşmak ya da ilgi odağı olmak çocuğunuza zor gelebilir.',
            friends: 'Kalabalık bir grup yerine az kişiyle sakin bir sohbet ona daha keyifli gelebilir.',
            home: 'Boş zamanını kendi başına sakin geçirmek ona iyi gelebilir.',
          },
          adult: {
            work: 'İşle ilgili bir konuyu bir grubun önünde anlatmak yerine geri planda kalmayı seçebilirsin.',
          },
        },
        average: {
          from: { school: ['socb02', 'socb07'], friends: ['soci05', 'soci01'], home: ['live03', 'live01'], work: ['expr01', 'expr08'] },
          student: {
            school: 'Bazen derste söz alıp öne çıkabilir, bazen geri planda kalmayı seçebilirsin.',
            friends: 'Bazen bir grubun içinde olmaktan keyif alabilir, bazen kendi başına kalmak isteyebilirsin.',
            home: 'Bazı günler enerji dolu olabilir, bazı günler daha sakin bir tempoyu seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazen derste söz alıp öne çıkabilir, bazen geri planda kalmayı seçebilir.',
            friends: 'Bazen bir grubun içinde olmaktan keyif alabilir, bazen kendi başına kalmak isteyebilir.',
            home: 'Bazı günler enerji dolu olabilir, bazı günler daha sakin bir tempoyu seçebilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın kişilerle bazen çok konuşabilir, bazen az konuşup dinleyebilirsin.',
          },
        },
        high: {
          from: { school: ['socb02', 'socb06'], friends: ['soci03', 'soci04'], home: ['soci01'], work: ['socb07', 'expr01'] },
          student: {
            school: 'Derste herkesin önünde konuşmak ya da ilgi odağı olmak seni çoğu zaman rahatsız etmeyebilir.',
            friends: 'Sohbet etmeyi sevebilir, yeni bir ortamda kolayca arkadaş edinebilirsin.',
            home: 'Boş zamanını başkalarıyla geçirmeyi sevebilirsin; uzun süre yalnız kalınca canın sıkılabilir.',
          },
          parent: {
            school: 'Derste herkesin önünde konuşmak ya da ilgi odağı olmak çocuğunuzu çoğu zaman rahatsız etmeyebilir.',
            friends: 'Sohbet etmeyi sevebilir, yeni bir ortamda kolayca arkadaş edinebilir.',
            home: 'Boş zamanını başkalarıyla geçirmeyi sevebilir; uzun süre yalnız kalınca canı sıkılabilir.',
          },
          adult: {
            work: 'Bir grup işi konuşulurken geri planda kalmak yerine söz alıp konuşmayı seçebilirsin.',
          },
        },
      },
    },
    /*
     * Uyumluluk (bu modelde öfke ve sabır buradadır). Bağışlayıcılık: forg02 "Affedip unutmaya çalışırım", forg03
     * "Başkalarını affetmeye yatkınım"; ters forg05 "Başkalarını affetmekte zorlanırım", forg06 "Kin tutarım". Hoşgörü: gent01
     * "Nadiren şikâyet ederim", gent03 "İnsanları oldukları gibi kabul ederim"; ters gent05, gent06 "Başkalarını hemen
     * yargılarım", gent10 "Başkalarının eksiklerini eleştiririm". Esneklik: flex02 "Tavsiyelere kulak vermeyi bilirim"; ters
     * flex06 "Beni ikna etmek zordur", flex07 "Başkalarının hataları beni sinirlendirir", flex08 "Söylediklerime itiraz
     * edilmesine dayanamam", flex10 "Bana laf anlatmak zordur". Sabırlılık: pati03 "Genellikle sabırlı biriyim", pati04
     * "Sinirim nadiren bozulur"; ters pati06 "Kolayca sinirlenirim".
     */
    agreeableness: {
      poles: { low: 'Tepkisini açıkça gösterir', high: 'Tepkisini yumuşatır' },
      bands: {
        low: {
          from: { school: ['gent10'], friends: ['forg05', 'forg06'], home: ['flex06', 'flex10'], work: ['flex07', 'gent05'] },
          student: {
            school: 'Bir grup çalışmasında gördüğün eksikleri açıkça söyleyebilirsin; bu bazen bir arkadaşını kırabilir.',
            friends: 'Seni kıran bir arkadaşını affetmek sana zaman alabilir.',
            home: 'Evdekilerle bir konuşmada kendi görüşünü kolay kolay bırakmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir grup çalışmasında gördüğü eksikleri açıkça söyleyebilir; bu bazen bir arkadaşını kırabilir.',
            friends: 'Onu kıran bir arkadaşını affetmek ona zaman alabilir.',
            home: 'Evdekilerle bir konuşmada kendi görüşünü kolay kolay bırakmayabilir.',
          },
          adult: {
            work: 'Bir işte başkalarının hataları canını sıkabilir ve bunu açıkça gösterebilirsin.',
            home: 'Yakınlarınla bir konuşmada kendi görüşünü kolay kolay bırakmayabilirsin.',
          },
        },
        average: {
          from: { school: ['flex02', 'flex06'], friends: ['forg02', 'forg06'], home: ['pati06', 'pati03'], work: ['flex02', 'flex08'] },
          student: {
            school: 'Derste bazı tavsiyelere kulak verebilir, bazılarında kendi bildiğini savunabilirsin.',
            friends: 'Bir arkadaşınla yaşadığın küçük kırgınlıkları çabuk affedebilir, bazılarını uzun süre unutmayabilirsin.',
            home: 'Evdekilere karşı çoğu zaman sabırlı olabilir, bazen küçük bir şeye sinirlenebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bazı tavsiyelere kulak verebilir, bazılarında kendi bildiğini savunabilir.',
            friends: 'Bir arkadaşıyla yaşadığı küçük kırgınlıkları çabuk affedebilir, bazılarını uzun süre unutmayabilir.',
            home: 'Evdekilere karşı çoğu zaman sabırlı olabilir, bazen küçük bir şeye sinirlenebilir.',
          },
          adult: {
            work: 'Bir işte bazen tavsiyelere kulak verebilir, bazen görüşünde ısrar edebilirsin.',
            home: 'Yakınlarına karşı çoğu zaman sabırlı olabilir, bazen küçük bir şeye sinirlenebilirsin.',
          },
        },
        high: {
          from: { school: ['gent03', 'gent06'], friends: ['forg03', 'forg02'], home: ['gent01'], work: ['pati03', 'pati04'] },
          student: {
            school: 'Ders arkadaşlarını oldukları gibi kabul edip onları hemen yargılamamaya çalışabilirsin.',
            friends: 'Seni kıran bir arkadaşını affedip olanı geride bırakabilirsin.',
            home: 'Evdekilerle ilgili canını sıkan bir şey için çoğu zaman şikâyet etmeyebilirsin; bazen bunu söylemek de iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz ders arkadaşlarını oldukları gibi kabul edip onları hemen yargılamamaya çalışabilir.',
            friends: 'Onu kıran bir arkadaşını affedip olanı geride bırakabilir.',
            home: 'Evdekilerle ilgili canını sıkan bir şey için çoğu zaman şikâyet etmeyebilir; bazen bunu söylemek de iyi gelebilir.',
          },
          adult: {
            work: 'İşler aksadığında da çoğu zaman sabırlı kalabilirsin.',
            home: 'Yakınlarınla ilgili canını sıkan bir şey için çoğu zaman şikâyet etmeyebilirsin; bazen bunu söylemek de iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Sorumluluk. Düzenlilik: orga01 "Eşyalarımı derli toplu tutarım", orga02 "Yapmam gereken işleri hemen hallederim"; ters
     * orga07 "Eşyalarımı ortada bırakırım", orga10 "Dağınıklık beni rahatsız etmez". Çalışkanlık: dili02 "Bir işi yapmaya hemen
     * başlarım", dili03 "Yaptığım işte titizimdir", dili04 "Çok çalışırım"; ters dili06 "Sadece idare edecek kadar
     * çalışırım", dili07 "Yaptığım iş çok zorlaşınca bırakırım", dili10 "Başladığım işlere olan ilgimi çabuk kaybederim".
     * Özenlilik: perf01 "Ayrıntılara dikkat ederim", perf02 "Her şey mükemmel olana kadar devam ederim", perf05 "Kusurlu
     * işlerden hoşlanmam", perf08 "Kalite konusunda ısrarcıyım"; ters perf09 "Ayrıntılara gereğinden az dikkat ederim", perf10
     * "İşleri oluruna bırakmayı tercih ederim". Temkinlilik: prud02 "Plan yapar ve planıma bağlı kalırım", prud03 "İşleri bir
     * plana göre yaparım"; ters prud06 "Aceleci kararlar veririm".
     */
    conscientiousness: {
      poles: { low: 'Akışına göre ilerler', high: 'Planlı ve özenli ilerler' },
      bands: {
        low: {
          from: { school: ['dili07', 'dili10'], friends: ['perf10'], home: ['orga07', 'orga10'], work: ['dili02', 'orga02'] },
          student: {
            school: 'Bir ödev çok zorlaşınca ya da ilgini kaybedince onu yarım bırakabilirsin.',
            friends: 'Arkadaşlarınla bir etkinlikte her ayrıntıya takılmadan işleri oluruna bırakabilirsin.',
            home: 'Eşyalarını ortada bırakabilirsin; dağınıklık seni pek rahatsız etmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir ödev çok zorlaşınca ya da ilgisini kaybedince onu yarım bırakabilir.',
            friends: 'Arkadaşlarıyla bir etkinlikte her ayrıntıya takılmadan işleri oluruna bırakabilir.',
            home: 'Eşyalarını ortada bırakabilir; dağınıklık onu pek rahatsız etmeyebilir.',
          },
          adult: {
            work: 'Bir işe başlamayı ya da yapman gereken işleri halletmeyi sonraya bırakabilirsin.',
          },
        },
        average: {
          from: { school: ['dili04', 'dili06'], friends: ['prud02', 'prud06'], home: ['orga01', 'orga07'], work: ['perf01', 'perf09'] },
          student: {
            school: 'Bazı derslere çok çalışabilir, bazılarında idare edecek kadarını yapabilirsin.',
            friends: 'Arkadaşlarınla bazen plan yapıp ona bağlı kalabilir, bazen o an karar verebilirsin.',
            home: 'Eşyalarını bazen derli toplu tutabilir, bazen ortada bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslere çok çalışabilir, bazılarında idare edecek kadarını yapabilir.',
            friends: 'Arkadaşlarıyla bazen plan yapıp ona bağlı kalabilir, bazen o an karar verebilir.',
            home: 'Eşyalarını bazen derli toplu tutabilir, bazen ortada bırakabilir.',
          },
          adult: {
            work: 'Bazı işlerde ayrıntılara dikkat edebilir, bazılarında genel hatlarıyla bitirmeyi seçebilirsin.',
          },
        },
        high: {
          from: { school: ['dili03', 'perf01'], friends: ['prud02', 'prud03'], home: ['perf02', 'perf05'], work: ['perf08', 'dili03'] },
          student: {
            school: 'Bir ödevi titizlikle yapıp ayrıntılarını dikkatle kontrol edebilirsin.',
            friends: 'Arkadaşlarınla bir etkinliği önceden planlayıp plana bağlı kalmak isteyebilirsin.',
            home: 'Bir işi mükemmel olana kadar sürdürmek isteyebilirsin; bu bazen işi uzatabilir.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevi titizlikle yapıp ayrıntılarını dikkatle kontrol edebilir.',
            friends: 'Arkadaşlarıyla bir etkinliği önceden planlayıp plana bağlı kalmak isteyebilir.',
            home: 'Bir işi mükemmel olana kadar sürdürmek isteyebilir; bu bazen işi uzatabilir.',
          },
          adult: {
            work: 'Bir işte kalite konusunda ısrarcı olup ayrıntılara dikkat edebilirsin.',
          },
        },
      },
    },
    /*
     * Deneyime Açıklık. Sanata ve güzelliğe ilgi: aesa02 "Kendimi müziğe tamamen kaptırırım"; ters aesa06 "Sanatı sevmem",
     * aesa09 "Konserleri sevmem". Merak: inqu01 "Bilime ilgi duyarım", inqu04 "Anlamak için kafa yormam gereken metinler
     * okumayı severim"; ters inqu10 "Bir konunun derinine inmem". Yaratıcılık: crea02 "Yeni bir şeyler düşünüp bulurum", crea04
     * "Aklım fikirlerle doludur", crea05 "İşleri yapmanın yeni yollarını düşünüp bulmayı çok severim". Sıra dışılık: unco02
     * "Fikirlerimin bazen insanları şaşırttığını bilirim", unco03 "Başkalarının garip bulduğu şeyler yaparım", unco05
     * "Çoğunluğa uymak yerine akıntıya karşı yüzerim"; ters unco08 "Düzgün ve alışılmış kalıplara uygun biri olarak görülmeyi
     * severim". Düşük ucun örnekleri ilgiyi anlatır.
     */
    openness: {
      poles: { low: 'Bilinen yolu tercih eder', high: 'Yeniyi ve farklıyı arar' },
      bands: {
        low: {
          from: { school: ['inqu10', 'inqu04'], friends: ['aesa09', 'aesa06'], home: ['crea05'], work: ['crea05', 'unco08'] },
          student: {
            school: 'Bir konunun ana noktalarını öğrenmek sana yeterli gelebilir; derinine inmek pek çekici gelmeyebilir.',
            friends: 'Arkadaşların bir sergi ya da konser önerdiğinde bu sana pek çekici gelmeyebilir.',
            home: 'Bir işi yeni bir yolla yapmak yerine bildiğin yolu seçebilirsin; bu sana zaman kazandırabilir.',
          },
          parent: {
            school: 'Bir konunun ana noktalarını öğrenmek çocuğunuza yeterli gelebilir; derinine inmek ona pek çekici gelmeyebilir.',
            friends: 'Arkadaşları bir sergi ya da konser önerdiğinde bu ona pek çekici gelmeyebilir.',
            home: 'Bir işi yeni bir yolla yapmak yerine bildiği yolu seçebilir; bu ona zaman kazandırabilir.',
          },
          adult: {
            work: 'Bir işte yeni bir yol aramak yerine bildiğin ve denenmiş yolla ilerleyebilirsin.',
          },
        },
        average: {
          from: { school: ['inqu01'], friends: ['aesa02'], home: ['crea02', 'crea05'], work: ['crea05', 'unco08'] },
          student: {
            school: 'Bilimle ilgili bazı konular ilgini çekebilir, bazıları sana uzak gelebilir.',
            friends: 'Arkadaşlarınla müzik dinlerken bazen kendini kaptırabilir, bazen pek etkilenmeyebilirsin.',
            home: 'Bazen bir işi yapmanın yeni bir yolunu deneyebilir, bazen bildiğin yolu seçebilirsin.',
          },
          parent: {
            school: 'Bilimle ilgili bazı konular çocuğunuzun ilgisini çekebilir, bazıları ona uzak gelebilir.',
            friends: 'Arkadaşlarıyla müzik dinlerken bazen kendini kaptırabilir, bazen pek etkilenmeyebilir.',
            home: 'Bazen bir işi yapmanın yeni bir yolunu deneyebilir, bazen bildiği yolu seçebilir.',
          },
          adult: {
            work: 'Bazı işlerde yeni bir yol deneyebilir, bazılarında alışılmış yöntemi seçebilirsin.',
          },
        },
        high: {
          from: { school: ['inqu04', 'inqu01'], friends: ['unco02', 'crea04'], home: ['unco03', 'crea05'], work: ['crea05'] },
          student: {
            school: 'Bilime ya da anlamak için kafa yorman gereken metinlere ilgi duyabilirsin.',
            friends: 'Arkadaşlarınla konuşurken bazen onları şaşırtan fikirler ortaya atabilirsin.',
            home: 'Evdeki bir işi alışılmadık bir yolla yapabilirsin; bu bazen başkalarına garip gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bilime ya da anlamak için kafa yorması gereken metinlere ilgi duyabilir.',
            friends: 'Arkadaşlarıyla konuşurken bazen onları şaşırtan fikirler ortaya atabilir.',
            home: 'Evdeki bir işi alışılmadık bir yolla yapabilir; bu bazen başkalarına garip gelebilir.',
          },
          adult: {
            work: 'Bir işi yapmak için yeni bir yöntem düşünüp bulmak sana keyifli gelebilir.',
          },
        },
      },
    },
  },
};
