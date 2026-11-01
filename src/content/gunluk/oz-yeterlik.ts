import type { SurveyDaily } from './types';

/**
 * Öz-yeterlik: Kendine Güven: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: gelişim
 * (lib/reports/daily-parts.ts, `scaleTone`): örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca
 * uydurma bir zorluk yazılmaz. Test ne kadar başarılı ya da becerikli olunduğunu değil, kişinin kendine ne kadar güvendiğini
 * sorar: örnekler bir inancı anlatır ("bitirebileceğinden emin olmayabilirsin"), beceriyi değil ("bitiremeyebilirsin" yok).
 * İşlerde kendine güvenin düşük örneği şablonun kendi cümlesini taşır: "bu, yapamayacağın anlamına gelmez"
 * (src/content/reports/oz-yeterlik.ts). "Çoğu şeyi anlayamam" (tas08) bir yetenek yargısı gibi okunabileceği, "İnsanları
 * etkileme yeteneğim yoktur / doğal bir yeteneğim vardır" (soc05, soc07) "yetenek" dediği için örneklere taşınmadı.
 *
 * Şablonun çelişmezlik ilkesi örneklerde de geçerlidir: işlerdeki güvenin örnekleri insanlarla rahat olmaktan ve duygulardan,
 * insanlar arasındaki güvenin örnekleri işlerden ve zorluklardan, zor anlardaki güvenin örnekleri insanların arasında rahat
 * olmaktan söz etmez (arkadaş satırları da bir işi, bir planı ya da aksiliği anlatır). "Hızlı düşünürüm" (cop09) zor anlardaki
 * güvenin maddesidir; örnekler hızdan söz etmez.
 *
 * Zor anlarda kendine güvenin düşük düzeyi destek kutusu açar: örnekleri yumuşaktır, zor anın yanında bir dayanak söyler;
 * bu bölüm kutuyu anmaz. "Sık sık moralim bozuk olur" (cop02) hiçbir örneğin dayanağı değildir: bu cümle kutuyu açtıysa kart
 * örnek göstermez; açmadıysa kişi ona katılmamıştır ve "moralin sık sık bozulabilir" demek cevabıyla çelişirdi. "Birçok
 * şeyden korkarım" (cop04) da korkutucu okunmasın diye kullanılmadı. Yüksek ucun ev örneği şablonun cümlesini taşır: çok
 * zorlanınca yardım istemek bu güvenle çelişmez. Her satırın dayandığı maddeler `from`'dadır.
 */
export const ozYeterlikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'oz-yeterlik-gunluk-1',
  scales: {
    /*
     * İşlerde kendine güven: tas01 "Üstlendiğim işleri başarıyla tamamlarım", tas02 "Yaptığım işlerde çok başarılı olurum",
     * tas03 "İşleri sorunsuz bir şekilde hallederim", tas04 "Ne yaptığımı bildiğimden eminimdir", tas05 "İyi çözümler
     * bulurum", tas06 "İşleri nasıl yoluna koyacağımı bilirim"; ters: tas07 "Durumları yanlış değerlendiririm", tas08 "Çoğu
     * şeyi anlayamam", tas09 "Katkı sağlayabileceğim pek bir şey olmaz", tas10 "Bir şeyin neye yol açacağını önceden
     * kestiremem".
     */
    tasks: {
      poles: { low: 'İşlerde pek emin olmaz', high: 'İşlerde kendine güvenir' },
      bands: {
        low: {
          from: { school: ['tas01', 'tas04'], friends: ['tas09'], home: ['tas06'], work: ['tas01', 'tas04'] },
          student: {
            school: 'Bir ödevi ya da projeyi başarıyla bitirebileceğinden pek emin olmayabilirsin; bu, yapamayacağın anlamına gelmez.',
            friends: 'Arkadaşlarınla bir şey hazırlarken katkı sağlayabileceğin pek bir şey olmadığını düşünebilirsin.',
            home: 'Evdeki bir işi üstlenince onu nasıl yoluna koyacağından pek emin olmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevi ya da projeyi başarıyla bitirebileceğinden pek emin olmayabilir; bu, yapamayacağı anlamına gelmez.',
            friends: 'Arkadaşlarıyla bir şey hazırlarken katkı sağlayabileceği pek bir şey olmadığını düşünebilir.',
            home: 'Evdeki bir işi üstlenince onu nasıl yoluna koyacağından pek emin olmayabilir.',
          },
          adult: {
            work: 'Üstlendiğin bir işi başarıyla bitirebileceğinden pek emin olmayabilirsin; bu, yapamayacağın anlamına gelmez.',
          },
        },
        average: {
          from: { school: ['tas01'], friends: ['tas05'], home: ['tas06'], work: ['tas01'] },
          student: {
            school: 'Bazı ödevleri başarıyla bitirebileceğinden emin olabilir, bazılarında pek emin olmayabilirsin.',
            friends: 'Arkadaşlarınla bir şey hazırlarken iyi bir çözüm bulabileceğine bazen güvenebilir, bazen emin olamayabilirsin.',
            home: 'Evdeki bir işi nasıl yoluna koyacağından bazen emin olabilir, bazen emin olamayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevleri başarıyla bitirebileceğinden emin olabilir, bazılarında pek emin olmayabilir.',
            friends: 'Arkadaşlarıyla bir şey hazırlarken iyi bir çözüm bulabileceğine bazen güvenebilir, bazen emin olamayabilir.',
            home: 'Evdeki bir işi nasıl yoluna koyacağından bazen emin olabilir, bazen emin olamayabilir.',
          },
          adult: {
            work: 'Bazı işleri başarıyla bitirebileceğinden emin olabilir, bazılarında pek emin olmayabilirsin.',
          },
        },
        high: {
          from: { school: ['tas01', 'tas04'], friends: ['tas05'], home: ['tas06', 'tas03'], work: ['tas01', 'tas04'] },
          student: {
            school: 'Bir ödevi ya da projeyi başarıyla bitirebileceğinden çoğu zaman emin olabilirsin.',
            friends: 'Arkadaşlarınla bir şey hazırlarken iyi bir çözüm bulabileceğine güvenebilirsin.',
            home: 'Evdeki bir işi üstlenince onu nasıl yoluna koyacağını bildiğini düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevi ya da projeyi başarıyla bitirebileceğinden çoğu zaman emin olabilir.',
            friends: 'Arkadaşlarıyla bir şey hazırlarken iyi bir çözüm bulabileceğine güvenebilir.',
            home: 'Evdeki bir işi üstlenince onu nasıl yoluna koyacağını bildiğini düşünebilir.',
          },
          adult: {
            work: 'Üstlendiğin bir işi başarıyla bitirebileceğinden çoğu zaman emin olabilirsin.',
          },
        },
      },
    },
    /*
     * İnsanlar arasında kendine güven: soc01 "İnsanların arasında kendimi rahat hissederim", soc02 "İlgi odağı olmak beni
     * rahatsız etmez", soc03 "Hazırlıksız konuşma yapmakta iyiyim", soc04 "Kendimi kolayca ifade ederim", soc05 "İnsanları
     * etkileme konusunda doğal bir yeteneğim vardır"; ters: soc06 "İlgi odağı olmaktan nefret ederim", soc07 "İnsanları
     * etkileme yeteneğim yoktur", soc08 "Başkalarının yanında sık sık kendimi huzursuz hissederim", soc09 "Dikkatleri
     * üzerime çekmekten hoşlanmam", soc10 "Genellikle söyleyecek pek bir şeyim olmaz". "Hazırlıksız konuşmada iyiyim" bir
     * beceri gibi değil, rahatlık olarak yazılır.
     */
    social: {
      poles: { low: 'Kalabalıkta sessiz kalır', high: 'Kalabalıkta rahat olur' },
      bands: {
        low: {
          from: { school: ['soc03', 'soc09'], friends: ['soc01', 'soc08'], home: ['soc06', 'soc09'], work: ['soc03', 'soc09'] },
          student: {
            school: 'Derste birden söz verilince hazırlıksız konuşmak sana kolay gelmeyebilir.',
            friends: 'Kalabalık bir grubun içinde kendini pek rahat hissetmeyebilirsin.',
            home: 'Eve misafir gelince ilgi odağı olmak sana pek hoş gelmeyebilir.',
          },
          parent: {
            school: 'Derste birden söz verilince hazırlıksız konuşmak çocuğunuza kolay gelmeyebilir.',
            friends: 'Kalabalık bir grubun içinde kendini pek rahat hissetmeyebilir.',
            home: 'Eve misafir gelince ilgi odağı olmak ona pek hoş gelmeyebilir.',
          },
          adult: {
            work: 'Bir toplantıda birden söz verilince hazırlıksız konuşmak sana kolay gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['soc04'], friends: ['soc01', 'soc08'], home: ['soc02', 'soc06'], work: ['soc04'] },
          student: {
            school: 'Bazı derslerde kendini kolayca ifade edebilir, bazılarında sessiz kalmayı seçebilirsin.',
            friends: 'Tanıdığın kişilerin arasında rahat olabilir, kalabalık bir grupta biraz huzursuz hissedebilirsin.',
            home: 'Eve misafir gelince bazen ilgi odağı olmaktan hoşlanabilir, bazen geri planda kalabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde kendini kolayca ifade edebilir, bazılarında sessiz kalmayı seçebilir.',
            friends: 'Tanıdığı kişilerin arasında rahat olabilir, kalabalık bir grupta biraz huzursuz hissedebilir.',
            home: 'Eve misafir gelince bazen ilgi odağı olmaktan hoşlanabilir, bazen geri planda kalabilir.',
          },
          adult: {
            work: 'Bazı toplantılarda kendini kolayca ifade edebilir, bazılarında sessiz kalmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['soc03', 'soc02'], friends: ['soc01', 'soc04'], home: ['soc02', 'soc10'], work: ['soc03', 'soc02'] },
          student: {
            school: 'Derste birden söz verilince hazırlıksız konuşmak seni çoğu zaman rahatsız etmeyebilir.',
            friends: 'Kalabalık bir grubun içinde rahat olabilir, düşündüğünü kolayca söyleyebilirsin.',
            home: 'Eve misafir gelince sohbete rahatça katılıp ilgi odağı olmaktan çekinmeyebilirsin.',
          },
          parent: {
            school: 'Derste birden söz verilince hazırlıksız konuşmak çocuğunuzu çoğu zaman rahatsız etmeyebilir.',
            friends: 'Kalabalık bir grubun içinde rahat olabilir, düşündüğünü kolayca söyleyebilir.',
            home: 'Eve misafir gelince sohbete rahatça katılıp ilgi odağı olmaktan çekinmeyebilir.',
          },
          adult: {
            work: 'Bir toplantıda birden söz verilince hazırlıksız konuşmak seni çoğu zaman rahatsız etmeyebilir.',
          },
        },
      },
    },
    /*
     * Zor anlarda kendine güven: cop06 "Aksilikleri kolayca atlatırım", cop07 "Aynı anda birçok şeyi idare edebilirim",
     * cop08 "Her şeyin üstesinden gelebilirim", cop09 "Hızlı düşünürüm"; ters: cop01 "Yaşadığım olaylar karşısında
     * bunalırım", cop02 "Sık sık moralim bozuk olur", cop03 "Karşılaştığım zorluklarla baş edemeyeceğimi hissederim", cop04
     * "Birçok şeyden korkarım", cop05 "Başkalarının içimi rahatlatmasına ihtiyaç duyarım". cop02, cop04 ve cop09 hiçbir
     * örneğin dayanağı değildir (dosyanın başındaki açıklama).
     */
    coping: {
      poles: { low: 'Zor anlarda bunalır', high: 'Zorlukta kendine güvenir' },
      bands: {
        low: {
          from: { school: ['cop01', 'cop07'], friends: ['cop06'], home: ['cop05', 'cop03'], work: ['cop01', 'cop07'] },
          student: {
            school: 'Sınav haftasında işler üst üste gelince kendini bunalmış hissedebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            friends: 'Arkadaşlarınla bir plan son anda bozulunca bu aksiliği atlatmak sana zor gelebilir.',
            home: 'Evdeki bir sorun karşısında birinin içini rahatlatmasına ihtiyaç duyabilirsin; bunu evdekilerden istemek iyi gelebilir.',
          },
          parent: {
            school: 'Sınav haftasında işler üst üste gelince çocuğunuz kendini bunalmış hissedebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            friends: 'Arkadaşlarıyla bir plan son anda bozulunca bu aksiliği atlatmak ona zor gelebilir.',
            home: 'Evdeki bir sorun karşısında birinin içini rahatlatmasına ihtiyaç duyabilir; bunu evdekilerden istemek iyi gelebilir.',
          },
          adult: {
            work: 'Gün içinde işler üst üste gelince kendini bunalmış hissedebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['cop07', 'cop01'], friends: ['cop06', 'cop03'], home: ['cop05', 'cop03'], work: ['cop07', 'cop01'] },
          student: {
            school: 'Sınav haftasında birçok işi bazen rahatça idare edebilir, bazen bunalabilirsin.',
            friends: 'Arkadaşlarınla bir plan bozulunca bazen bunu kolayca atlatabilir, bazen baş etmekte zorlanabilirsin.',
            home: 'Evdeki bir sorun karşısında bazen kendin baş edebilir, bazen birinin içini rahatlatmasına ihtiyaç duyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınav haftasında birçok işi bazen rahatça idare edebilir, bazen bunalabilir.',
            friends: 'Arkadaşlarıyla bir plan bozulunca bazen bunu kolayca atlatabilir, bazen baş etmekte zorlanabilir.',
            home: 'Evdeki bir sorun karşısında bazen kendisi baş edebilir, bazen birinin içini rahatlatmasına ihtiyaç duyabilir.',
          },
          adult: {
            work: 'Gün içinde birçok işi bazen rahatça idare edebilir, bazen bunalabilirsin.',
          },
        },
        high: {
          from: { school: ['cop07', 'cop01'], friends: ['cop06'], home: ['cop03', 'cop08'], work: ['cop07', 'cop01'] },
          student: {
            school: 'Sınav haftasında işler üst üste gelse de çoğu zaman bunları idare edebileceğine güvenebilirsin.',
            friends: 'Arkadaşlarınla bir plan bozulunca bu aksiliği çoğu zaman kolayca atlatabilirsin.',
            home: 'Evdeki bir sorun karşısında çoğu zaman baş edebileceğini hissedebilirsin; çok zorlanırsan yardım istemek de bu güvenle çelişmez.',
          },
          parent: {
            school: 'Çocuğunuz sınav haftasında işler üst üste gelse de çoğu zaman bunları idare edebileceğine güvenebilir.',
            friends: 'Arkadaşlarıyla bir plan bozulunca bu aksiliği çoğu zaman kolayca atlatabilir.',
            home: 'Evdeki bir sorun karşısında çoğu zaman baş edebileceğini hissedebilir; çok zorlanırsa yardım istemek de bu güvenle çelişmez.',
          },
          adult: {
            work: 'Gün içinde işler üst üste gelse de çoğu zaman bunları idare edebileceğine güvenebilirsin.',
          },
        },
      },
    },
  },
};
