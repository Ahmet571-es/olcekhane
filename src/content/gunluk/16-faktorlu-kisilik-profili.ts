import type { SurveyDaily } from './types';

/**
 * 16 Faktörlü Kişilik Profili: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Uçlar testin kendi `poles` metninden
 * 2–4 sözcüğe kısaltıldı (düşünsel özgüvende "Düşünme becerisine…" sığmadığı için "Düşünme gücüne…"; sosyal rahatlıkta
 * "Tanışırken çekingen"); yeni uç yazılmadı. Ton (lib/reports/daily-parts.ts, scaleTone): duygusal denge ve endişeye yatkınlık
 * (şablonda destek kutusu açabilen düzeyler), gerginlik (maddelerin hepsi yüksek ucu zorluk olarak sorar; aynı maddeler öteki
 * kişilik testlerinde duygusal dengenin maddesidir) ve düşünsel özgüven (düşünme konusunda kendine güven; öz-yeterlikle aynı
 * aile) "gelişim" tonundadır: sıkıntılı ucun örnekleri bugünkü durumu anlatır, belirti sıralamaz, yanında bir dayanak söyler;
 * sakin uca uydurma bir zorluk ya da öğüt, sıkıntılı uca uydurma bir güçlü yan yazılmaz. Öteki 12 özellik "özellik" tonundadır:
 * iki uç da eşittir.
 * Rapor metinlerindeki ilkeler burada da geçerlidir (src/content/reports/16-faktorlu-kisilik.ts): düşünsel özgüvenin örnekleri
 * zekâ, kavrama hızı ya da bir öğretme biçimi gibi okunmaz ("Çabuk öğrenirim", "Birçok sorunun cevabını bilirim", "Kendimi
 * ortalama biri sayarım" ve "Sıradan biri olduğumu biliyorum" maddelerine bilerek dayanılmadı); örnekler düşünme biçimini
 * anlatır (çözümlemek, artıları ve eksileri tartmak, kafa karışıklığı). Ağır ya da hassas maddelere (c08 "Kendimden
 * hoşlanmam", c09 "Kendimi çaresiz hissederim", o02 "Kendimi kolayca tehdit altında hissederim", o07 "Aksilikler karşısında
 * kendimi yıkılmış hissederim", h07 "Başkalarının yanında sık sık kendimi huzursuz hissederim", a10 "İhtiyaç sahiplerini
 * düşünmemeye çalışırım", g08 "Küfürlü konuşurum", l06 "İnsanların özünde kötü olduğuna inanırım", q4_07 "İnsanları dış
 * görünüşlerine göre yargılarım") dayanılmadı. Her satırın dayandığı maddeler `from`'dadır.
 * Maddeye doğrudan dayanmayan uzantılar: sıcaklıkta "kendine zaman bırakmayı unutabilirsin" (raporun metni); atılganlıkta
 * "uyum içinde katkı" ve "başkalarının fikrine de yer açmak" (raporun metni); neşe ve canlılıkta sessiz bir akşamın çekici
 * gelmemesi (kalabalık ve gürültülü ortamları sevmenin öbür yüzü); kurallara bağlılıkta bir kurala karşı çıkmanın tartışmaya
 * yol açabilmesi ve kuralı esneten birinin rahatsız etmesi; sosyal rahatlıkta "sözü başkalarına bırakmak da iyi gelebilir"
 * (Liderlik Eğilimleri raporunun çok konuşma üzerine araştırma notu); temkinlilikte "hayal kırıklıklarından koruyabilir",
 * "yakınlık kurmayı kolaylaştırabilir" (raporun metni) ve "bazen önce sorgulamak iyi gelebilir" (l05'in düşük cevabı);
 * kendini kolay açmamada "kendine ait bir alan" ve "yükünü hafifletebilir" (raporun metni); düzen ve titizlikte mükemmellik
 * için uğraşmanın işi uzatması; gerginlikte "biraz durup sakinleşmek"; endişeye yatkınlıkta "kendine biraz zaman tanımak".
 * Kurallara bağlılıkta g10 ("Kuralların açığını bulmayı bilirim") hile gibi okunmasın diye "boşlukları fark etmek" diye yazılır.
 * Yetişkin evde yalnız yaşıyor olabilir: evdekilerden söz eden ev satırlarının yerine yetişkine kendi satırı (`adult.home`:
 * "yakınların", "yaşadığın yer") yazılır; misafir gelmesi ve evdeki bir plan herkese uyduğu için ortak kalır. Mezun (13.
 * sınıf) okul satırlarını "Okulda ya da derslerde" başlığıyla gördüğü için o satırlarda "sınıf" yoktur ("derste", "ders
 * arkadaşı", "yeni bir grup").
 */
export const onAltiFaktorDaily: SurveyDaily = {
  kind: 'survey',
  version: '16-faktorlu-kisilik-profili-gunluk-1',
  scales: {
    /*
     * Sıcaklık: a01 "Başkalarını nasıl teselli edeceğimi bilirim", a02 "İnsanları bir araya getirmekten hoşlanırım", a03
     * "Başkalarının ne hissettiğini içimde hissederim", a04 "Başka insanların hayatlarına ilgi duyarım", a05 "İnsanların
     * moralini yükseltirim", a06 "İnsanların yanımda rahat hissetmesini sağlarım", a07 "Başkalarına zaman ayırırım"; ters: a08
     * "Başkalarının sorunlarıyla ilgilenmekten hoşlanmam", a09 "Aslında diğer insanlara pek ilgi duymam", a10 "İhtiyaç
     * sahiplerini düşünmemeye çalışırım".
     */
    warmth: {
      poles: { low: 'Başkalarına mesafeli duran', high: 'İnsanlarla sıcak ve ilgili' },
      bands: {
        low: {
          from: { school: ['a08'], friends: ['a04', 'a09'], home: ['a07'], work: ['a08'] },
          student: {
            school: 'Grup çalışmasında başkalarının sorunlarından çok işin kendisine odaklanabilirsin.',
            friends: 'Arkadaşlarının hayatında olup bitenler sana pek ilgi çekici gelmeyebilir.',
            home: 'Evdekilere uzun zaman ayırmak yerine kendi işlerine öncelik verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında başkalarının sorunlarından çok işin kendisine odaklanabilir.',
            friends: 'Arkadaşlarının hayatında olup bitenler ona pek ilgi çekici gelmeyebilir.',
            home: 'Evdekilere uzun zaman ayırmak yerine kendi işlerine öncelik verebilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişilerin sorunlarına girmeden işine odaklanabilirsin.',
            home: 'Yakınlarına uzun zaman ayırmak yerine kendi işlerine öncelik verebilirsin.',
          },
        },
        average: {
          from: { school: ['a05'], friends: ['a04'], home: ['a07'], work: ['a07'] },
          student: {
            school: 'Bazen üzgün bir ders arkadaşının moralini yükseltmeye çalışabilir, bazen kendi işine dönebilirsin.',
            friends: 'Bazı arkadaşlarının hayatıyla yakından ilgilenebilir, bazılarıyla daha az ilgilenebilirsin.',
            home: 'Evdekilere bazen uzun zaman ayırabilir, yoğun günlerde kendi işine öncelik verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazen üzgün bir ders arkadaşının moralini yükseltmeye çalışabilir, bazen kendi işine dönebilir.',
            friends: 'Bazı arkadaşlarının hayatıyla yakından ilgilenebilir, bazılarıyla daha az ilgilenebilir.',
            home: 'Evdekilere bazen uzun zaman ayırabilir, yoğun günlerde kendi işine öncelik verebilir.',
          },
          adult: {
            work: 'Bazı günler başkalarına zaman ayırabilir, bazı günler kendi işine öncelik verebilirsin.',
            home: 'Yakınlarına bazen uzun zaman ayırabilir, yoğun günlerde kendi işine öncelik verebilirsin.',
          },
        },
        high: {
          from: { school: ['a05', 'a01'], friends: ['a02'], home: ['a07'], work: ['a06', 'a07'] },
          student: {
            school: 'Üzgün bir ders arkadaşının moralini yükseltmeye çalışabilirsin.',
            friends: 'Arkadaşlarını bir araya getirmek sana keyifli gelebilir.',
            home: 'Evdekilere zaman ayırırken kendine zaman bırakmayı unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz üzgün bir ders arkadaşının moralini yükseltmeye çalışabilir.',
            friends: 'Arkadaşlarını bir araya getirmek çocuğunuzun hoşuna gidebilir.',
            home: 'Evdekilere zaman ayırırken kendine zaman bırakmayı unutabilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişilerin senin yanında rahat hissetmesi için çaba gösterebilirsin.',
            home: 'Yakınlarına zaman ayırırken kendine zaman bırakmayı unutabilirsin.',
          },
        },
      },
    },
    /*
     * Düşünsel özgüven: b01 "Yerinde ve derin yorumlar yaparım", b02 "Birçok sorunun cevabını bilirim", b03 "Olayları analiz
     * etme eğilimindeyim", b04 "Aklımı kullanırım", b05 "Çabuk öğrenirim", b06 "Başkalarının öne sürdüğü görüşlere karşı görüş
     * getiririm", b07 "Bir şey yapmadan önce üzerinde düşünürüm", b08 "Bir şeyin artılarını ve eksilerini tartarım"; ters: b09
     * "Kendimi ortalama biri sayarım", b10 "Kafam çabuk karışır", b11 "Sıradan biri olduğumu biliyorum", b12 "Kelime
     * dağarcığım dardır", b13 "Okurken zor kelimeleri atlarım". Uçlar zekâ değil, kişinin düşünme gücüne güvenini anlatır.
 * Gelişim tonu: düşük uca kolaylık (ör. artıları ve eksileri tartmamayı "hemen karar vermek" diye), yüksek uca bedel yazılmaz.
     */
    intellect: {
      poles: { low: 'Düşünme gücüne az güvenen', high: 'Düşünme gücüne güvenen' },
      bands: {
        low: {
          from: { school: ['b10'], friends: ['b01'], home: ['b13'], work: ['b10'] },
          student: {
            school: 'Derste yeni bir konu anlatılırken bazen kafanın karıştığını hissedebilirsin.',
            friends: 'Arkadaşlarınla bir konuyu konuşurken yorumlarının yerinde olduğundan pek emin olmayabilirsin.',
            home: 'Okurken zor bir kelimeye takılınca onu atlayıp devam edebilirsin.',
          },
          parent: {
            school: 'Derste yeni bir konu anlatılırken çocuğunuz bazen kafasının karıştığını hissedebilir.',
            friends: 'Arkadaşlarıyla bir konuyu konuşurken yorumlarının yerinde olduğundan pek emin olmayabilir.',
            home: 'Okurken zor bir kelimeye takılınca onu atlayıp devam edebilir.',
          },
          adult: {
            work: 'Bir işte yeni ve karışık bir konuyla karşılaşınca kafanın karıştığını hissedebilirsin.',
          },
        },
        average: {
          from: { school: ['b03', 'b10'], friends: ['b06'], home: ['b07'], work: ['b08'] },
          student: {
            school: 'Bazı konuları ayrıntısıyla incelemek isteyebilir, bazılarında kafanın karıştığını hissedebilirsin.',
            friends: 'Bir tartışmada bazen karşı görüş getirebilir, bazen arkadaşlarının görüşünü dinlemeyi seçebilirsin.',
            home: 'Bazı işlere önce üzerinde düşünüp başlayabilir, bazılarına hemen girişebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı konuları ayrıntısıyla incelemek isteyebilir, bazılarında kafasının karıştığını hissedebilir.',
            friends: 'Bir tartışmada bazen karşı görüş getirebilir, bazen arkadaşlarının görüşünü dinlemeyi seçebilir.',
            home: 'Bazı işlere önce üzerinde düşünüp başlayabilir, bazılarına hemen girişebilir.',
          },
          adult: {
            work: 'Bazı kararlarda artıları ve eksileri tartabilir, bazılarını hemen verebilirsin.',
          },
        },
        high: {
          from: { school: ['b03', 'b06'], friends: ['b08'], home: ['b07'], work: ['b08', 'b03'] },
          student: {
            school: 'Derste bir konuyu ayrıntısıyla incelemek hoşuna gidebilir. Bir görüşe karşı görüş de getirebilirsin.',
            friends: 'Arkadaşlarınla bir plan seçerken artılarını ve eksilerini tartmak isteyebilirsin.',
            home: 'Bir işe girişmeden önce üzerinde düşünmeyi seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bir konuyu ayrıntısıyla incelemekten hoşlanabilir. Bir görüşe karşı görüş de getirebilir.',
            friends: 'Arkadaşlarıyla bir plan seçerken artılarını ve eksilerini tartmak isteyebilir.',
            home: 'Bir işe girişmeden önce üzerinde düşünmeyi seçebilir.',
          },
          adult: {
            work: 'Bir işte karar vermeden önce artılarını ve eksilerini tartabilirsin.',
          },
        },
      },
    },
    /*
     * Duygusal denge (gelişim tonu): c01 "Kendimi nadiren hüzünlü hissederim", c02 "Kendimle barışığım", c03 "Aksilikleri
     * kolayca atlatırım", c04 "Çoğu zaman rahat ve sakinimdir", c05 "İşler yolunda gitmediğinde kolay kolay bunalmam"; ters:
     * c06 "Duygularım gün içinde sık sık iniş çıkış yapar", c07 "Sık sık kendimi hüzünlü hissederim", c08 "Kendimden
     * hoşlanmam", c09 "Kendimi çaresiz hissederim", c10 "Cesaretim çabuk kırılır". Düşük düzeyin her satırında bir dayanak
     * vardır; yüksek düzey gerçekten sakin kalmayı anlatır.
     */
    emotional_stability: {
      poles: { low: 'Duyguları iniş çıkış yapan', high: 'Sakin ve dengeli' },
      bands: {
        low: {
          from: { school: ['c10', 'c05'], friends: ['c06'], home: ['c03'], work: ['c10', 'c05'] },
          student: {
            school: 'Bir sınavda işler yolunda gitmeyince cesaretin çabuk kırılabilir; bunu birine anlatmak sana iyi gelebilir.',
            friends: 'Arkadaşlarınla geçen bir günde duyguların iniş çıkış yapabilir; bunları paylaşmak seni rahatlatabilir.',
            home: 'Bir aksilikten sonra toparlanmak zaman alabilir; seni üzen şeyi güvendiğin biriyle konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Bir sınavda işler yolunda gitmeyince çocuğunuzun cesareti çabuk kırılabilir; bunu birine anlatmak ona iyi gelebilir.',
            friends: 'Arkadaşlarıyla geçen bir günde duyguları iniş çıkış yapabilir; bunları paylaşmak onu rahatlatabilir.',
            home: 'Bir aksilikten sonra toparlanması zaman alabilir; onu üzen şeyi güvendiği biriyle konuşmak iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte aksilik olunca cesaretin çabuk kırılabilir; güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['c05', 'c04'], friends: ['c03'], home: ['c02', 'c07'], work: ['c05', 'c03'] },
          student: {
            school: 'Derslerde çoğu gün sakin olabilir, işler ters gidince bazen bunalabilirsin.',
            friends: 'Arkadaşlarınla bir aksilik yaşayınca bazen moralin bozulabilir, çoğu zaman çabuk toparlanabilirsin.',
            home: 'Bazı günler kendini hüzünlü hissedebilir, çoğu gün kendinle barışık olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derslerde çoğu gün sakin olabilir, işler ters gidince bazen bunalabilir.',
            friends: 'Arkadaşlarıyla bir aksilik yaşayınca bazen morali bozulabilir, çoğu zaman çabuk toparlanabilir.',
            home: 'Bazı günler kendini hüzünlü hissedebilir, çoğu gün kendisiyle barışık olabilir.',
          },
          adult: {
            work: 'Bir işte bir şey ters gidince bazen bunalabilir, çoğu zaman yeniden toparlanabilirsin.',
          },
        },
        high: {
          from: { school: ['c04', 'c05'], friends: ['c03'], home: ['c02', 'c01'], work: ['c05'] },
          student: {
            school: 'Zor bir sınav haftasında da çoğu zaman sakin kalabilirsin.',
            friends: 'Arkadaşlarınla yaşadığın bir aksiliği çoğu zaman kolayca atlatabilirsin.',
            home: 'Çoğu gün kendinle barışık hissedebilirsin; hüzünlü günlerin seyrek olabilir.',
          },
          parent: {
            school: 'Çocuğunuz zor bir sınav haftasında da çoğu zaman sakin kalabilir.',
            friends: 'Arkadaşlarıyla yaşadığı bir aksiliği çoğu zaman kolayca atlatabilir.',
            home: 'Çoğu gün kendisiyle barışık hissedebilir; hüzünlü günleri seyrek olabilir.',
          },
          adult: {
            work: 'İşler yolunda gitmediğinde de çoğu zaman kolay kolay bunalmayabilirsin.',
          },
        },
      },
    },
    /*
     * Atılganlık: e01 "İdareyi ele alırım", e02 "İşlerin başında ben olmak isterim", e03 "Ne düşünüyorsam onu söylerim", e04
     * "Eleştiri yapmaktan korkmam", e05 "İşlerin kontrolünü elime alırım", e06 "Gerektiğinde sert kararlar alabilirim"; ters:
     * e07 "Yolu başkalarının göstermesini beklerim", e08 "Hiçbir şeye itiraz etmem", e09 "Kararları başkalarına bırakırım",
     * e10 "Başkalarının bana patronluk taslamasına izin veririm".
     */
    assertiveness: {
      poles: { low: 'Kararı başkalarına bırakan', high: 'Sözünü söyleyip yön veren' },
      bands: {
        low: {
          from: { school: ['e09', 'e07'], friends: ['e08'], home: ['e09'], work: ['e09', 'e07'] },
          student: {
            school: 'Bir grup ödevinde kararları başkalarına bırakıp işe uyum içinde katkı verebilirsin.',
            friends: 'Arkadaşlarının bir kararına katılmasan da itiraz etmeyebilirsin.',
            home: 'Evdekiler senin yerine bir karar verdiğinde buna çoğu zaman ses çıkarmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir grup ödevinde kararları başkalarına bırakıp işe uyum içinde katkı verebilir.',
            friends: 'Arkadaşlarının bir kararına katılmasa da itiraz etmeyebilir.',
            home: 'Evdekiler onun yerine bir karar verdiğinde buna çoğu zaman ses çıkarmayabilir.',
          },
          adult: {
            work: 'Bir işte kararları başkalarına bırakıp verilen yöne uyabilirsin.',
            home: 'Yakınların senin yerine bir karar verdiğinde buna çoğu zaman ses çıkarmayabilirsin.',
          },
        },
        average: {
          from: { school: ['e03'], friends: ['e05', 'e09'], home: ['e08'], work: ['e01', 'e07'] },
          student: {
            school: 'Bazı derslerde düşündüğünü açıkça söyleyebilir, bazılarında sessiz kalmayı seçebilirsin.',
            friends: 'Arkadaşlarınla bazen işlerin kontrolünü eline alabilir, bazen kararı başkalarına bırakabilirsin.',
            home: 'Evdekilerin bir kararına bazen itiraz edebilir, bazen sesini çıkarmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde düşündüğünü açıkça söyleyebilir, bazılarında sessiz kalmayı seçebilir.',
            friends: 'Arkadaşlarıyla bazen işlerin kontrolünü eline alabilir, bazen kararı başkalarına bırakabilir.',
            home: 'Evdekilerin bir kararına bazen itiraz edebilir, bazen sesini çıkarmayabilir.',
          },
          adult: {
            work: 'Bazı işlerde idareyi ele alabilir, bazılarında yolu başkalarının göstermesini bekleyebilirsin.',
            home: 'Yakınlarının bir kararına bazen itiraz edebilir, bazen sesini çıkarmayabilirsin.',
          },
        },
        high: {
          from: { school: ['e03', 'e04'], friends: ['e05', 'e02'], home: ['e09'], work: ['e01', 'e06'] },
          student: {
            school: 'Derste ne düşünüyorsan söyleyebilir, gerektiğinde eleştiri yapmaktan çekinmeyebilirsin.',
            friends: 'Arkadaşlarınla bir plan yaparken işlerin kontrolünü eline almak isteyebilirsin.',
            home: 'Evdekilerle bir karar verirken kendi fikrini öne koyabilirsin; başkalarının fikrine de yer açmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz derste ne düşünüyorsa söyleyebilir, gerektiğinde eleştiri yapmaktan çekinmeyebilir.',
            friends: 'Arkadaşlarıyla bir plan yaparken işlerin kontrolünü eline almak isteyebilir.',
            home: 'Evdekilerle bir karar verirken kendi fikrini öne koyabilir; başkalarının fikrine de yer açmak iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte idareyi ele alabilir, gerektiğinde sert kararlar alabilirsin.',
            home: 'Yakınlarınla bir karar verirken kendi fikrini öne koyabilirsin; başkalarının fikrine de yer açmak iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Neşe ve canlılık: f01 "Arkadaş ortamlarında havayı canlandıran kişi genellikle benim" (grupta bir rol söylediği için
     * kullanılmadı), f02 "Kalabalık kutlamaları ve eğlenceleri çok severim", f03 "Çok şaka yaparım", f04 "Gürültülü bir
     * kalabalığın içinde olmaktan hoşlanırım", f05 "Arkadaşlarımı eğlendiririm", f06 "Çılgınca şeyler yaparım"; ters: f07 "Pek
     * şaka yapmam", f08 "Kalabalık etkinlikleri sevmem", f09 "Şakalara kolay kolay gülmem", f10 "Yüksek sesli müzikten
     * hoşlanmam".
     */
    gregariousness: {
      poles: { low: 'Sessiz ve ölçülü', high: 'Şakacı ve hareketli' },
      bands: {
        low: {
          from: { school: ['f07'], friends: ['f08', 'f04'], home: ['f10'], work: ['f07'] },
          student: {
            school: 'Ders arasında şaka yapmak yerine sakin bir sohbeti seçebilirsin.',
            friends: 'Kalabalık ve gürültülü bir eğlence yerine az kişiyle sakin bir buluşma sana daha iyi gelebilir.',
            home: 'Evdekiler yüksek sesle müzik açınca bu seni rahatsız edebilir.',
          },
          parent: {
            school: 'Çocuğunuz ders arasında şaka yapmak yerine sakin bir sohbeti seçebilir.',
            friends: 'Kalabalık ve gürültülü bir eğlence yerine az kişiyle sakin bir buluşma ona daha iyi gelebilir.',
            home: 'Evdekiler yüksek sesle müzik açınca bu onu rahatsız edebilir.',
          },
          adult: {
            work: 'İş arasında şakalaşmak yerine sakin ve ciddi bir ortamı seçebilirsin.',
            home: 'Yüksek sesle müzik çalan bir ortamda kısa sürede rahatsız olabilirsin.',
          },
        },
        average: {
          from: { school: ['f03'], friends: ['f02', 'f08'], home: ['f10'], work: ['f03', 'f07'] },
          student: {
            school: 'Ders arasında bazen şaka yapıp güldürebilir, bazen sakin kalmayı seçebilirsin.',
            friends: 'Bazen kalabalık bir eğlenceden keyif alabilir, bazen az kişiyle buluşmayı seçebilirsin.',
            home: 'Bazı günler yüksek sesli müzikten hoşlanabilir, bazı günler sessizlik isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders arasında bazen şaka yapıp güldürebilir, bazen sakin kalmayı seçebilir.',
            friends: 'Bazen kalabalık bir eğlenceden keyif alabilir, bazen az kişiyle buluşmayı seçebilir.',
            home: 'Bazı günler yüksek sesli müzikten hoşlanabilir, bazı günler sessizlik isteyebilir.',
          },
          adult: {
            work: 'Bazı günler iş arasında şakalaşabilir, bazı günler ciddi kalmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['f03'], friends: ['f05', 'f03'], home: ['f04', 'f10'], work: ['f03'] },
          student: {
            school: 'Ders arasında çok şaka yapmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarını şakalarınla eğlendirmek hoşuna gidebilir.',
            home: 'Sessiz bir akşam sana bir süre sonra pek çekici gelmeyebilir; müzik ya da kalabalık isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders arasında çok şaka yapmaktan keyif alabilir.',
            friends: 'Arkadaşlarını şakalarıyla eğlendirmek hoşuna gidebilir.',
            home: 'Sessiz bir akşam ona bir süre sonra pek çekici gelmeyebilir; müzik ya da kalabalık isteyebilir.',
          },
          adult: {
            work: 'İş arasında şaka yapmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /*
     * Kurallara bağlılık (yedi madde): g02 "Kurallara uymaya çalışırım", g04 "Otoriteye saygı duyarım"; ters: g06 "Otoriteye
     * direnirim", g07 "Kuralları çiğnerim", g08 "Küfürlü konuşurum", g09 "Otoriteye karşı çıkarım", g10 "Kuralların açığını
     * bulmayı bilirim".
     */
    dutifulness: {
      poles: { low: 'Kuralları sorgulayan', high: 'Kurallara bağlı' },
      bands: {
        low: {
          from: { school: ['g06', 'g09'], friends: ['g10'], home: ['g06', 'g09'], work: ['g09'] },
          student: {
            school: 'Bir öğretmenin koyduğu kuralı olduğu gibi kabul etmek yerine sorgulayabilirsin.',
            friends: 'Bir oyunun kurallarındaki boşlukları fark etmek sana keyifli gelebilir.',
            home: 'Evdekilerin koyduğu bir kurala karşı çıkabilirsin; bu bazen tartışmaya yol açabilir.',
          },
          parent: {
            school: 'Çocuğunuz bir öğretmenin koyduğu kuralı olduğu gibi kabul etmek yerine sorgulayabilir.',
            friends: 'Bir oyunun kurallarındaki boşlukları fark etmek ona keyifli gelebilir.',
            home: 'Evdekilerin koyduğu bir kurala karşı çıkabilir; bu bazen tartışmaya yol açabilir.',
          },
          adult: {
            work: 'Bir işte yukarıdan gelen bir karara karşı çıkabilir, onu sorgulayabilirsin.',
            home: 'Yaşadığın yerde konan bir kurala karşı çıkabilirsin; bu bazen tartışmaya yol açabilir.',
          },
        },
        average: {
          from: { school: ['g02', 'g09'], friends: ['g07'], home: ['g04', 'g06'], work: ['g02'] },
          student: {
            school: 'Derste konan kurallara çoğu zaman uyabilir, bazen birini sorgulayabilirsin.',
            friends: 'Bir oyunda kurallara çoğu zaman uyabilir, bazen onları esnetebilirsin.',
            home: 'Evdekilerin kurallarına çoğu zaman uyabilir, bazılarına karşı çıkabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste konan kurallara çoğu zaman uyabilir, bazen birini sorgulayabilir.',
            friends: 'Bir oyunda kurallara çoğu zaman uyabilir, bazen onları esnetebilir.',
            home: 'Evdekilerin kurallarına çoğu zaman uyabilir, bazılarına karşı çıkabilir.',
          },
          adult: {
            work: 'Bir işte kurallara çoğu zaman uyabilir, bazen bir kuralı esnetebilirsin.',
            home: 'Yaşadığın yerdeki kurallara çoğu zaman uyabilir, bazılarına karşı çıkabilirsin.',
          },
        },
        high: {
          from: { school: ['g02', 'g07'], friends: ['g07'], home: ['g04'], work: ['g02', 'g04'] },
          student: {
            school: 'Derste konan kurallara uymaya çalışabilir, kuralları çiğnemekten uzak durabilirsin.',
            friends: 'Bir oyunda biri kuralı esnetmek isteyince bu seni rahatsız edebilir.',
            home: 'Evdekilerin koyduğu kurallara saygı gösterebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste konan kurallara uymaya çalışabilir, kuralları çiğnemekten uzak durabilir.',
            friends: 'Bir oyunda biri kuralı esnetmek isteyince bu onu rahatsız edebilir.',
            home: 'Evdekilerin koyduğu kurallara saygı gösterebilir.',
          },
          adult: {
            work: 'Bir işte kurallara uymaya çalışabilir, sorumlu kişilere saygı gösterebilirsin.',
            home: 'Yaşadığın yerde konan kurallara saygı gösterebilirsin.',
          },
        },
      },
    },
    /*
     * Sosyal rahatlık: h01 "İnsanların arasında kendimi rahat hissederim", h02 "Kalabalık ortamlarda birçok farklı kişiyle
     * konuşurum", h03 "İlgi odağı olmak beni rahatsız etmez", h04 "Kolayca arkadaş edinirim", h05 "Sohbeti genellikle ben
     * başlatırım"; ters: h06 "Başkalarının yanına gidip konuşmakta zorlanırım", h07 "Başkalarının yanında sık sık kendimi
     * huzursuz hissederim", h08 "Genellikle söyleyecek pek bir şeyim olmaz", h09 "Tanımadığım insanların yanında sessiz
     * olurum", h10 "Kalabalıkta geri planda kalmayı tercih ederim".
     */
    friendliness: {
      poles: { low: 'Tanışırken çekingen', high: 'İnsanların arasında rahat' },
      bands: {
        low: {
          from: { school: ['h09', 'h06'], friends: ['h10'], home: ['h05'], work: ['h06', 'h09'] },
          student: {
            school: 'Yeni bir grupta tanımadığın kişilerin yanında sessiz kalabilir, onlara yaklaşmayı zor bulabilirsin.',
            friends: 'Kalabalık bir grupta geri planda kalıp olanları izlemek sana daha rahat gelebilir.',
            home: 'Eve misafir gelince sohbeti başkasının başlatmasını bekleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir grupta tanımadığı kişilerin yanında sessiz kalabilir, onlara yaklaşmayı zor bulabilir.',
            friends: 'Kalabalık bir grupta geri planda kalıp olanları izlemek ona daha rahat gelebilir.',
            home: 'Eve misafir gelince sohbeti başkasının başlatmasını bekleyebilir.',
          },
          adult: {
            work: 'Yeni bir iş ortamında tanımadığın kişilerin yanına gidip konuşmak sana zor gelebilir.',
          },
        },
        average: {
          from: { school: ['h05', 'h09'], friends: ['h02', 'h10'], home: ['h03'], work: ['h04', 'h06'] },
          student: {
            school: 'Tanıdığın ders arkadaşlarınla rahatça sohbet edebilir, tanımadıklarının yanında önce sessiz kalabilirsin.',
            friends: 'Kalabalık bir ortamda bazen pek çok kişiyle konuşabilir, bazen geri planda kalmayı seçebilirsin.',
            home: 'Eve misafir gelince bazen ilgi odağı olabilir, bazen bir köşede dinlemeyi seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz tanıdığı ders arkadaşlarıyla rahatça sohbet edebilir, tanımadıklarının yanında önce sessiz kalabilir.',
            friends: 'Kalabalık bir ortamda bazen pek çok kişiyle konuşabilir, bazen geri planda kalmayı seçebilir.',
            home: 'Eve misafir gelince bazen ilgi odağı olabilir, bazen bir köşede dinlemeyi seçebilir.',
          },
          adult: {
            work: 'Bazı ortamlarda kolayca tanışabilir, bazılarında birinin yanına gitmek için zaman isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['h04', 'h05'], friends: ['h02'], home: ['h03'], work: ['h05', 'h02'] },
          student: {
            school: 'Yeni bir grupta sohbeti başlatıp kolayca arkadaş edinebilirsin.',
            friends: 'Kalabalık bir ortamda pek çok farklı kişiyle konuşmak sana rahat gelebilir.',
            home: 'Eve misafir gelince ilgi odağı olmak seni rahatsız etmeyebilir; bazen sözü başkalarına bırakmak da iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir grupta sohbeti başlatıp kolayca arkadaş edinebilir.',
            friends: 'Kalabalık bir ortamda pek çok farklı kişiyle konuşmak ona rahat gelebilir.',
            home: 'Eve misafir gelince ilgi odağı olmak onu rahatsız etmeyebilir; bazen sözü başkalarına bırakmak da iyi gelebilir.',
          },
          adult: {
            work: 'Yeni bir iş ortamında sohbeti başlatmak ve pek çok kişiyle konuşmak sana rahat gelebilir.',
          },
        },
      },
    },
    /*
     * Duyarlılık: i01 "Kitap okumayı severim", i02 "Başkalarıyla filmler ve kitaplar hakkında konuşmaktan hoşlanırım", i03 "Çok
     * kitap okurum", i04 "Aksiyon filmlerini sevmem", i05 "Film izlerken ağlarım", i06 "Çiçekleri çok severim"; ters: i07 "Dans
     * gösterilerini izlemekten keyif almam", i08 "Şiiri sevmem", i09 "Roman, hikâye gibi kurgusal eserlerden hoşlanmam", i10
     * "Duygusal tepkilerimi pek fark etmem".
     */
    sensitivity: {
      poles: { low: 'Sanattan pek etkilenmeyen', high: 'Sanattan etkilenen' },
      bands: {
        low: {
          from: { school: ['i08', 'i09'], friends: ['i04'], home: ['i01', 'i03'], work: ['i10'] },
          student: {
            school: 'Edebiyat dersinde şiir ya da roman sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla bir aksiyon filmi izlemek sana keyifli gelebilir.',
            home: 'Boş bir akşamda kitap okumak yerine başka bir şey yapmayı seçebilirsin.',
          },
          parent: {
            school: 'Edebiyat dersinde şiir ya da roman çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla bir aksiyon filmi izlemek ona keyifli gelebilir.',
            home: 'Boş bir akşamda kitap okumak yerine başka bir şey yapmayı seçebilir.',
          },
          adult: {
            work: 'Gün içinde verdiğin duygusal tepkilerin üzerinde pek durmayabilirsin.',
          },
        },
        average: {
          from: { school: ['i08'], friends: ['i02', 'i04'], home: ['i05'], work: ['i10'] },
          student: {
            school: 'Edebiyat dersinde bazı şiirler seni etkileyebilir, bazıları pek ilgini çekmeyebilir.',
            friends: 'Arkadaşlarınla bazen bir kitap hakkında konuşabilir, bazen bir aksiyon filmini seçebilirsin.',
            home: 'Bazı duygusal filmlerde gözlerin dolabilir, bazıları seni pek etkilemeyebilir.',
          },
          parent: {
            school: 'Edebiyat dersinde bazı şiirler çocuğunuzu etkileyebilir, bazıları pek ilgisini çekmeyebilir.',
            friends: 'Arkadaşlarıyla bazen bir kitap hakkında konuşabilir, bazen bir aksiyon filmini seçebilir.',
            home: 'Bazı duygusal filmlerde gözleri dolabilir, bazıları onu pek etkilemeyebilir.',
          },
          adult: {
            work: 'Bazı günler duygusal tepkilerini fark edebilir, bazı günler pek üzerinde durmayabilirsin.',
          },
        },
        high: {
          from: { school: ['i08', 'i09'], friends: ['i04'], home: ['i05', 'i02'], work: ['i10'] },
          student: {
            school: 'Edebiyat dersinde bir şiir ya da hikâye seni derinden etkileyebilir.',
            friends: 'Arkadaşların bir aksiyon filmi seçince bu sana pek çekici gelmeyebilir.',
            home: 'Evdekilerle izlediğin duygusal bir filmde gözlerin dolabilir; sonra film hakkında konuşmak hoşuna gidebilir.',
          },
          parent: {
            school: 'Edebiyat dersinde bir şiir ya da hikâye çocuğunuzu derinden etkileyebilir.',
            friends: 'Arkadaşları bir aksiyon filmi seçince bu ona pek çekici gelmeyebilir.',
            home: 'Evdekilerle izlediği duygusal bir filmde gözleri dolabilir; sonra film hakkında konuşmak hoşuna gidebilir.',
          },
          adult: {
            work: 'Gün içinde verdiğin duygusal tepkileri çoğu zaman fark edebilirsin.',
            home: 'Duygusal bir film izlerken gözlerin dolabilir; sonra film hakkında biriyle konuşmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /*
     * Temkinlilik: l01 "Başkalarını affetmekte zorlanırım", l02 "Başkalarının gizli niyetleri olduğundan şüphelenirim", l03
     * "Başkalarına karşı temkinli davranırım", l04 "İnsanlara güvenmem", l05 "İnsanların gerçeğin tamamını pek söylemediğine
     * inanırım", l06 "İnsanların özünde kötü olduğuna inanırım"; ters: l07 "İnsanların söylediklerine güvenirim", l08
     * "Başkalarına güvenirim", l09 "İnsanların iyi niyetli olduğuna inanırım", l10 "İnsanların temelde ahlaklı olduğuna
     * inanırım".
     */
    distrust: {
      poles: { low: 'İnsanlara kolayca güvenen', high: 'İnsanlara karşı temkinli' },
      bands: {
        low: {
          from: { school: ['l07'], friends: ['l01'], home: ['l07', 'l05'], work: ['l07', 'l08'] },
          student: {
            school: 'Yeni bir ders arkadaşının söylediklerine kolayca güvenebilirsin; bu yakınlık kurmayı kolaylaştırabilir.',
            friends: 'Bir arkadaşın seni kırsa da onu affedebilirsin.',
            home: 'Duyduğun bir sözü çoğu zaman hemen doğru kabul edebilirsin; bazen önce sorgulamak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir ders arkadaşının söylediklerine kolayca güvenebilir; bu yakınlık kurmayı kolaylaştırabilir.',
            friends: 'Bir arkadaşı onu kırsa da affedebilir.',
            home: 'Duyduğu bir sözü çoğu zaman hemen doğru kabul edebilir; bazen önce sorgulamak iyi gelebilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişilerin söylediklerine kolayca güvenebilirsin.',
          },
        },
        average: {
          from: { school: ['l03', 'l08'], friends: ['l01'], home: ['l05', 'l07'], work: ['l03', 'l08'] },
          student: {
            school: 'Ders arkadaşlarından bazılarına hemen güvenebilir, bazılarına karşı temkinli kalabilirsin.',
            friends: 'Bir arkadaşını bazen kolayca affedebilir, bazen affetmek için zaman isteyebilirsin.',
            home: 'Duyduğun sözlerin bazılarına hemen inanabilir, bazılarını önce sorgulayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders arkadaşlarından bazılarına hemen güvenebilir, bazılarına karşı temkinli kalabilir.',
            friends: 'Bir arkadaşını bazen kolayca affedebilir, bazen affetmek için zaman isteyebilir.',
            home: 'Duyduğu sözlerin bazılarına hemen inanabilir, bazılarını önce sorgulayabilir.',
          },
          adult: {
            work: 'Bazı iş arkadaşlarına hemen güvenebilir, bazılarına temkinli yaklaşabilirsin.',
          },
        },
        high: {
          from: { school: ['l03', 'l02'], friends: ['l01'], home: ['l07', 'l05'], work: ['l02', 'l03'] },
          student: {
            school: 'Yeni bir grupta tanıştığın birine önce temkinli yaklaşabilirsin; bu seni bazı hayal kırıklıklarından koruyabilir.',
            friends: 'Bir arkadaşın seni kırınca onu affetmek sana zor gelebilir.',
            home: 'Duyduğun bir sözü hemen doğru kabul etmek yerine önce sorgulayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir grupta tanıştığı birine önce temkinli yaklaşabilir; bu onu bazı hayal kırıklıklarından koruyabilir.',
            friends: 'Bir arkadaşı onu kırınca affetmek ona zor gelebilir.',
            home: 'Duyduğu bir sözü hemen doğru kabul etmek yerine önce sorgulayabilir.',
          },
          adult: {
            work: 'Yeni çalışmaya başladığın kişilere önce temkinli yaklaşabilirsin.',
          },
        },
      },
    },
    /*
     * Hayal gücü: m01 "Başkalarının garip bulduğu şeyler yaparım", m02 "Düşüncelere dalıp gitmeyi severim", m03 "Uçsuz bucaksız
     * hayallere dalmaktan hoşlanırım", m04 "Hayal kurmayı çok severim", m05 "Çoğunluğa uymak yerine akıntıya karşı yüzerim",
     * m06 "Aykırı görüşler savunurum", m07 "Beklenmedik şeyler yaparım"; ters: m08 "İşleri usulüne uygun yaparım", m09 "Pek
     * hayal kurmam", m10 "Pek düşüncelere dalıp gitmem".
     */
    imagination: {
      poles: { low: 'Ayakları yere basan', high: 'Hayallere dalan, sıra dışı' },
      bands: {
        low: {
          from: { school: ['m08'], friends: ['m05', 'm06'], home: ['m09'], work: ['m08'] },
          student: {
            school: 'Bir ödevi usulüne uygun, adım adım yapmak sana iyi gelebilir.',
            friends: 'Arkadaşlarınla bir konuşmada aykırı bir görüş savunmak yerine çoğunluğa katılabilirsin.',
            home: 'Boş bir anda hayal kurmak yerine bir işle uğraşmayı seçebilirsin.',
          },
          parent: {
            school: 'Bir ödevi usulüne uygun, adım adım yapmak çocuğunuza iyi gelebilir.',
            friends: 'Arkadaşlarıyla bir konuşmada aykırı bir görüş savunmak yerine çoğunluğa katılabilir.',
            home: 'Boş bir anda hayal kurmak yerine bir işle uğraşmayı seçebilir.',
          },
          adult: {
            work: 'İşlerini usulüne uygun, bilinen yoldan yapmayı seçebilirsin.',
          },
        },
        average: {
          from: { school: ['m06'], friends: ['m07'], home: ['m04'], work: ['m08', 'm07'] },
          student: {
            school: 'Derste bazen farklı bir görüş savunabilir, bazen çoğunluğun görüşüne katılabilirsin.',
            friends: 'Arkadaşlarınla bazen beklenmedik bir şey yapabilir, çoğu zaman alışılmış yoldan gidebilirsin.',
            home: 'Bazen hayal kurmaya dalabilir, bazen hemen işe koyulabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bazen farklı bir görüş savunabilir, bazen çoğunluğun görüşüne katılabilir.',
            friends: 'Arkadaşlarıyla bazen beklenmedik bir şey yapabilir, çoğu zaman alışılmış yoldan gidebilir.',
            home: 'Bazen hayal kurmaya dalabilir, bazen hemen işe koyulabilir.',
          },
          adult: {
            work: 'Bazı işleri usulüne uygun, bazılarını beklenmedik bir yoldan yapabilirsin.',
          },
        },
        high: {
          from: { school: ['m06', 'm05'], friends: ['m01', 'm07'], home: ['m02', 'm04'], work: ['m05', 'm08'] },
          student: {
            school: 'Derste çoğunluktan farklı bir görüşü savunmaktan çekinmeyebilirsin.',
            friends: 'Arkadaşlarının garip bulabileceği, beklenmedik şeyler yapabilirsin.',
            home: 'Hayal kurarken ya da düşüncelere dalınca zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste çoğunluktan farklı bir görüşü savunmaktan çekinmeyebilir.',
            friends: 'Arkadaşlarının garip bulabileceği, beklenmedik şeyler yapabilir.',
            home: 'Hayal kurarken ya da düşüncelere dalınca zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Bir işi usulüne göre değil, kendi bulduğun farklı bir yoldan yapmak isteyebilirsin.',
          },
        },
      },
    },
    /*
     * Kendini kolay açmama: n01 "Kendimle ilgili pek az şey anlatırım", n02 "Beni tanımak zordur", n03 "Çok konuşmam", n04
     * "Duygularımı içime atarım", n05 "Düşüncelerimi kendime saklarım"; ters: n06 "Kendimle ilgili şeyleri başkalarına açıkça
     * anlatırım", n07 "Duygularım konusunda açık biriyim", n08 "En özel düşüncelerimi paylaşırım", n09 "Duygularımı belli
     * ederim", n10 "Kendim hakkında konuşmaktan çekinmem".
     */
    reserve: {
      poles: { low: 'Kendini kolayca açan', high: 'Kendini kolay açmayan' },
      bands: {
        low: {
          from: { school: ['n10', 'n06'], friends: ['n08'], home: ['n09', 'n07'], work: ['n06', 'n10'] },
          student: {
            school: 'Derste kendinle ilgili bir şeyi anlatmaktan çekinmeyebilirsin.',
            friends: 'En özel düşüncelerini yeni tanıştığın birine de anlatabilirsin; biraz beklemek iyi gelebilir.',
            home: 'Evdekilere duygularını açıkça gösterebilirsin; bu yakınlık kurmayı kolaylaştırabilir.',
          },
          parent: {
            school: 'Çocuğunuz derste kendisiyle ilgili bir şeyi anlatmaktan çekinmeyebilir.',
            friends: 'En özel düşüncelerini yeni tanıştığı birine de anlatabilir; biraz beklemesi iyi gelebilir.',
            home: 'Evdekilere duygularını açıkça gösterebilir; bu yakınlık kurmayı kolaylaştırabilir.',
          },
          adult: {
            work: 'Birlikte çalıştığın kişilere kendinle ilgili şeyleri açıkça anlatabilirsin.',
            home: 'Sevdiğin kişilere duygularını açıkça gösterebilirsin; bu yakınlık kurmayı kolaylaştırabilir.',
          },
        },
        average: {
          from: { school: ['n10', 'n05'], friends: ['n06'], home: ['n09', 'n04'], work: ['n01', 'n10'] },
          student: {
            school: 'Derste bazen kendinden söz edebilir, bazen düşüncelerini kendine saklayabilirsin.',
            friends: 'Kendini bazı arkadaşlarına açabilir, bazılarına pek bir şey anlatmayabilirsin.',
            home: 'Evdekilere bazen duygularını belli edebilir, bazen onları içine atabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bazen kendinden söz edebilir, bazen düşüncelerini kendine saklayabilir.',
            friends: 'Kendini bazı arkadaşlarına açabilir, bazılarına pek bir şey anlatmayabilir.',
            home: 'Evdekilere bazen duygularını belli edebilir, bazen onları içine atabilir.',
          },
          adult: {
            work: 'Bazı iş arkadaşlarına kendinden söz edebilir, bazılarına pek bir şey anlatmayabilirsin.',
            home: 'Yakınlarına bazen duygularını belli edebilir, bazen onları içine atabilirsin.',
          },
        },
        high: {
          from: { school: ['n01', 'n05'], friends: ['n02'], home: ['n04'], work: ['n05', 'n01'] },
          student: {
            school: 'Derste kendinle ilgili pek az şey anlatabilirsin; bu sana kendine ait bir alan bırakabilir.',
            friends: 'Yeni tanıştığın kişilerin seni tanıması zaman alabilir.',
            home: 'Seni üzen bir şeyi içine atabilirsin; güvendiğin biriyle paylaşmak yükünü hafifletebilir.',
          },
          parent: {
            school: 'Çocuğunuz derste kendisiyle ilgili pek az şey anlatabilir; bu ona kendine ait bir alan bırakabilir.',
            friends: 'Yeni tanıştığı kişilerin onu tanıması zaman alabilir.',
            home: 'Onu üzen bir şeyi içine atabilir; güvendiği biriyle paylaşmak yükünü hafifletebilir.',
          },
          adult: {
            work: 'Bir işte düşüncelerini çoğu zaman kendine saklayabilir, kendinden pek söz etmeyebilirsin.',
          },
        },
      },
    },
    /*
     * Endişeye yatkınlık (gelişim tonu; düşük = sakin, yüksek = sıkıntılı uç): o01 "Yanlış bir şey yapacağım diye korkarım",
     * o02 "Kendimi kolayca tehdit altında hissederim", o03 "Gönlüm çabuk kırılır", o04 "Birçok şey için endişelenirim", o05
     * "Geçmişteki hatalarımı düşünerek zaman geçiririm", o06 "“Hayır” dediğimde kendimi suçlu hissederim", o07 "Aksilikler
     * karşısında kendimi yıkılmış hissederim"; ters: o08 "Olup bitmiş şeyleri dert etmem", o09 "Bir şeyleri kolay kolay kafama
     * takmam", o10 "Başkalarının cesaretimi kırmasına izin vermem". Yüksek düzeyin her satırında bir dayanak vardır.
     */
    anxiety: {
      poles: { low: 'Kolay kolay endişelenmeyen', high: 'Kolayca endişelenen' },
      bands: {
        low: {
          from: { school: ['o09', 'o08'], friends: ['o10'], home: ['o08'], work: ['o09'] },
          student: {
            school: 'Bir sınavda olan bir aksiliği çoğu zaman kolay kolay kafana takmayabilirsin.',
            friends: 'Biri cesaretini kırmaya çalışınca buna çoğu zaman izin vermeyebilirsin.',
            home: 'Olup bitmiş şeyleri dert etmeyip önündeki işe dönebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavda olan bir aksiliği çoğu zaman kolay kolay kafasına takmayabilir.',
            friends: 'Biri cesaretini kırmaya çalışınca buna çoğu zaman izin vermeyebilir.',
            home: 'Olup bitmiş şeyleri dert etmeyip önündeki işe dönebilir.',
          },
          adult: {
            work: 'Bir işte bir şey ters gidince bunu kolay kolay kafana takmayabilirsin.',
          },
        },
        average: {
          from: { school: ['o04'], friends: ['o03'], home: ['o06'], work: ['o05', 'o08'] },
          student: {
            school: 'Bazı sınavlar için endişelenebilir, çoğu zaman bunları fazla kafana takmayabilirsin.',
            friends: 'Bir arkadaşının sözü bazen seni kırabilir; çoğu zaman bu duygu çabuk geçebilir.',
            home: 'Evdekilere “hayır” dediğinde bazen kendini suçlu hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlar için endişelenebilir, çoğu zaman bunları fazla kafasına takmayabilir.',
            friends: 'Bir arkadaşının sözü bazen çocuğunuzu kırabilir; çoğu zaman bu duygu çabuk geçebilir.',
            home: 'Evdekilere “hayır” dediğinde bazen kendini suçlu hissedebilir.',
          },
          adult: {
            work: 'Bir işteki hatanı bazen düşünebilir, çoğu zaman olup biteni geride bırakabilirsin.',
            home: 'Yakınlarına “hayır” dediğinde bazen kendini suçlu hissedebilirsin.',
          },
        },
        high: {
          from: { school: ['o01'], friends: ['o03'], home: ['o09', 'o05'], work: ['o01', 'o04'] },
          student: {
            school: 'Derste bir soruya cevap verirken yanlış yapmaktan korkabilirsin. Bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            friends: 'Bir arkadaşının sözü seni çabuk kırabilir; bu kırgınlık zamanla hafifleyebilir.',
            home: 'Olup bitmiş bir şeyi bir süre kafana takabilirsin; kendine biraz zaman tanımak iyi gelebilir.',
          },
          parent: {
            school: 'Derste bir soruya cevap verirken çocuğunuz yanlış yapmaktan korkabilir. Bunu güvendiği biriyle konuşmak iyi gelebilir.',
            friends: 'Bir arkadaşının sözü çocuğunuzu çabuk kırabilir; bu kırgınlık zamanla hafifleyebilir.',
            home: 'Olup bitmiş bir şeyi bir süre kafasına takabilir; kendine biraz zaman tanıması iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte yanlış bir şey yapmaktan korkabilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Yeniliğe açıklık: q1_01 "Sanatın önemli olduğuna inanırım", q1_02 "İşleri yapmanın yeni yollarını düşünüp bulmayı çok
     * severim", q1_03 "Yeni fikirler duymaktan hoşlanırım", q1_04 "Sohbetin seviyesini yükseltirim", q1_05 "Hep aynı şeyleri
     * yapmak yerine çeşitliliği tercih ederim"; ters: q1_06 "Felsefi tartışmalardan kaçınırım", q1_07 "Olaylarda daha derin bir
     * anlam pek aramam", q1_08 "Teorik tartışmalar ilgimi çekmez", q1_09 "Soyut fikirler ilgimi çekmez", q1_10 "Karmaşık
     * insanlardan uzak durmaya çalışırım". Düşük ucun örnekleri ilgiyi anlatır, kavrama becerisini değil.
     */
    complexity: {
      poles: { low: 'Alışılmış yolları seven', high: 'Yeni fikirlere açık' },
      bands: {
        low: {
          from: { school: ['q1_09', 'q1_08'], friends: ['q1_06'], home: ['q1_05'], work: ['q1_02'] },
          student: {
            school: 'Derste soyut ya da kuramsal bir tartışma uzayınca ilgin dağılabilir.',
            friends: 'Arkadaşlarınla felsefi bir tartışma yerine gündelik konuları konuşmayı seçebilirsin.',
            home: 'Alıştığın bir düzende ilerlemek sana iyi gelebilir.',
          },
          parent: {
            school: 'Derste soyut ya da kuramsal bir tartışma uzayınca çocuğunuzun ilgisi dağılabilir.',
            friends: 'Arkadaşlarıyla felsefi bir tartışma yerine gündelik konuları konuşmayı seçebilir.',
            home: 'Alıştığı bir düzende ilerlemek ona iyi gelebilir.',
          },
          adult: {
            work: 'İşleri alışılmış ve denenmiş bir yoldan yapmayı seçebilirsin.',
          },
        },
        average: {
          from: { school: ['q1_09'], friends: ['q1_06', 'q1_03'], home: ['q1_05'], work: ['q1_02'] },
          student: {
            school: 'Derste bazı soyut konular ilgini çekebilir, bazıları sana uzak gelebilir.',
            friends: 'Arkadaşlarınla bazen felsefi bir sohbete katılabilir, bazen gündelik konuları seçebilirsin.',
            home: 'Bazen yeni bir şey denemek, bazen alıştığın düzeni sürdürmek isteyebilirsin.',
          },
          parent: {
            school: 'Derste bazı soyut konular çocuğunuzun ilgisini çekebilir, bazıları ona uzak gelebilir.',
            friends: 'Arkadaşlarıyla bazen felsefi bir sohbete katılabilir, bazen gündelik konuları seçebilir.',
            home: 'Bazen yeni bir şey denemek, bazen alıştığı düzeni sürdürmek isteyebilir.',
          },
          adult: {
            work: 'Bazı işlerde yeni yollar arayabilir, bazılarında bildiğin yoldan gidebilirsin.',
          },
        },
        high: {
          from: { school: ['q1_09', 'q1_08'], friends: ['q1_03'], home: ['q1_05'], work: ['q1_02'] },
          student: {
            school: 'Derste soyut ya da felsefi bir konu açılınca ilgin artabilir.',
            friends: 'Arkadaşlarından yeni bir fikir duymak sana keyifli gelebilir.',
            home: 'Hep aynı şeyleri yapmak sana bir süre sonra sıkıcı gelebilir.',
          },
          parent: {
            school: 'Derste soyut ya da felsefi bir konu açılınca çocuğunuzun ilgisi artabilir.',
            friends: 'Arkadaşlarından yeni bir fikir duymak ona keyifli gelebilir.',
            home: 'Hep aynı şeyleri yapmak ona bir süre sonra sıkıcı gelebilir.',
          },
          adult: {
            work: 'Bir işi yapmanın yeni bir yolunu düşünüp bulmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /*
     * Kendi başına olmayı sevme: q2_01 "Yalnız bırakılmak isterim", q2_02 "İşleri tek başıma yapmayı tercih ederim", q2_03 "Tek
     * başıma vakit geçirmekten hoşlanırım", q2_04 "Sessiz, sakin ortamlar ararım", q2_05 "Tek başıma yemek yemek beni rahatsız
     * etmez", q2_06 "Sessizlikten hoşlanırım", q2_07 "Kendi özel alanımda olmaktan hoşlanırım"; ters: q2_08 "Bir grubun parçası
     * olmaktan keyif alırım", q2_09 "Takım çalışmasından hoşlanırım", q2_10 "Yanımda birileri olmadan yapamam".
     */
    introversion: {
      poles: { low: 'Grup içinde olmayı seven', high: 'Kendi başına olmayı seven' },
      bands: {
        low: {
          from: { school: ['q2_09'], friends: ['q2_08'], home: ['q2_10'], work: ['q2_09', 'q2_02'] },
          student: {
            school: 'Takım çalışması gereken bir ödev sana keyifli gelebilir.',
            friends: 'Bir grubun parçası olmak ve arkadaşlarınla birlikte bir şey yapmak hoşuna gidebilir.',
            home: 'Uzun süre tek başına kalmak sana zor gelebilir.',
          },
          parent: {
            school: 'Takım çalışması gereken bir ödev çocuğunuza keyifli gelebilir.',
            friends: 'Bir grubun parçası olmak ve arkadaşlarıyla birlikte bir şey yapmak hoşuna gidebilir.',
            home: 'Uzun süre tek başına kalmak ona zor gelebilir.',
          },
          adult: {
            work: 'Bir işi tek başına değil, başkalarıyla birlikte yürütmek sana iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['q2_02', 'q2_09'], friends: ['q2_03', 'q2_08'], home: ['q2_06'], work: ['q2_09'] },
          student: {
            school: 'Bazı ödevleri tek başına, bazılarını bir grupla yapmayı seçebilirsin.',
            friends: 'Bazen arkadaşlarınla bir arada olmak, bazen tek başına vakit geçirmek isteyebilirsin.',
            home: 'Bazı günler sessizlik, bazı günler evdekilerle sohbet isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevleri tek başına, bazılarını bir grupla yapmayı seçebilir.',
            friends: 'Bazen arkadaşlarıyla bir arada olmak, bazen tek başına vakit geçirmek isteyebilir.',
            home: 'Bazı günler sessizlik, bazı günler evdekilerle sohbet isteyebilir.',
          },
          adult: {
            work: 'Bazı işlerde takım çalışmasından hoşlanabilir, bazılarında tek başına çalışmayı seçebilirsin.',
            home: 'Bazı günler sessizlik, bazı günler yakınlarınla sohbet isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['q2_09'], friends: ['q2_05', 'q2_03'], home: ['q2_06', 'q2_04'], work: ['q2_02'] },
          student: {
            school: 'Takım çalışması gereken bir ödev sana pek keyifli gelmeyebilir.',
            friends: 'Arkadaşların meşgulken tek başına vakit geçirmek seni rahatsız etmeyebilir.',
            home: 'Sessiz ve sakin bir köşede vakit geçirmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Takım çalışması gereken bir ödev çocuğunuza pek keyifli gelmeyebilir.',
            friends: 'Arkadaşları meşgulken tek başına vakit geçirmek onu rahatsız etmeyebilir.',
            home: 'Sessiz ve sakin bir köşede vakit geçirmek ona iyi gelebilir.',
          },
          adult: {
            work: 'Bir işi tek başına yürütmeyi tercih edebilirsin; ortak işler sana daha az keyifli gelebilir.',
          },
        },
      },
    },
    /*
     * Düzen ve titizlik: q3_01 "Her şeyin tam yerli yerinde olmasını isterim", q3_02 "Yapmam gereken işleri hemen hallederim",
     * q3_03 "Düzeni severim", q3_04 "Her şey mükemmel olana kadar devam ederim", q3_05 "Yaptığım işte titizimdir"; ters: q3_06
     * "Dağınık insanlar beni rahatsız etmez", q3_07 "Dağınıklık beni rahatsız etmez", q3_08 "Odamı dağınık bırakırım" (kendi
     * odası varsayılmasın diye kullanılmadı), q3_09 "Eşyalarımı ortada bırakırım", q3_10 "Hoşa gitmeyen işleri ertelerim".
     */
    orderliness: {
      poles: { low: 'Esnek ve rahat', high: 'Düzenli ve titiz' },
      bands: {
        low: {
          from: { school: ['q3_10'], friends: ['q3_06'], home: ['q3_09'], work: ['q3_07', 'q3_10'] },
          student: {
            school: 'Hoşuna gitmeyen bir ödevi son ana erteleyebilirsin.',
            friends: 'Ortak bir işte etrafın dağınık olması seni pek rahatsız etmeyebilir.',
            home: 'Eşyalarını ortada bırakabilir, sonra aradığını bulmak için zaman harcayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz hoşuna gitmeyen bir ödevi son ana erteleyebilir.',
            friends: 'Ortak bir işte etrafın dağınık olması onu pek rahatsız etmeyebilir.',
            home: 'Eşyalarını ortada bırakabilir, sonra aradığını bulmak için zaman harcayabilir.',
          },
          adult: {
            work: 'Dağınıklık seni pek rahatsız etmeyebilir; hoşuna gitmeyen işleri erteleyebilirsin.',
          },
        },
        average: {
          from: { school: ['q3_02', 'q3_10'], friends: ['q3_06'], home: ['q3_03', 'q3_09'], work: ['q3_05'] },
          student: {
            school: 'Bazı ödevleri hemen halledebilir, hoşuna gitmeyenleri erteleyebilirsin.',
            friends: 'Ortak bir işte dağınıklık bazen seni rahatsız edebilir, bazen pek önemsemeyebilirsin.',
            home: 'Bazı günler düzeni korumak isteyebilir, bazı günler eşyalarını ortada bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevleri hemen halledebilir, hoşuna gitmeyenleri erteleyebilir.',
            friends: 'Ortak bir işte dağınıklık bazen onu rahatsız edebilir, bazen pek önemsemeyebilir.',
            home: 'Bazı günler düzeni korumak isteyebilir, bazı günler eşyalarını ortada bırakabilir.',
          },
          adult: {
            work: 'Bazı işlerde titiz olabilir, bazılarında daha rahat davranabilirsin.',
          },
        },
        high: {
          from: { school: ['q3_02', 'q3_05'], friends: ['q3_06'], home: ['q3_04'], work: ['q3_05', 'q3_04'] },
          student: {
            school: 'Ödevlerini hemen halledip yaptığın işi titizlikle bitirebilirsin.',
            friends: 'Ortak bir işte etrafı dağıtan biri seni rahatsız edebilir.',
            home: 'Her şey mükemmel olana kadar uğraşabilirsin; bu bir işi uzatabilir.',
          },
          parent: {
            school: 'Çocuğunuz ödevlerini hemen halledip yaptığı işi titizlikle bitirebilir.',
            friends: 'Ortak bir işte etrafı dağıtan biri onu rahatsız edebilir.',
            home: 'Her şey mükemmel olana kadar uğraşabilir; bu bir işi uzatabilir.',
          },
          adult: {
            work: 'Bir işi mükemmel olana kadar titizlikle sürdürebilirsin; bu zaman alabilir.',
          },
        },
      },
    },
    /*
     * Gerginlik: q4_01 "Sinirim çabuk bozulur", q4_02 "Çabuk öfkelenirim", q4_03 "Başkalarını hemen yargılarım", q4_04
     * "Başkalarının hataları beni sinirlendirir", q4_05 "Ufak şeylere çabuk bozulurum", q4_06 "Söylediklerime itiraz edilmesine
     * dayanamam", q4_07 "İnsanları dış görünüşlerine göre yargılarım"; ters: q4_08 "Kolay kolay sinirlenmem", q4_09 "Affedip
     * unutmaya çalışırım", q4_10 "Herkes hakkında söyleyecek iyi bir sözüm vardır".
     */
    emotionality: {
      poles: { low: 'Sakin ve hoşgörülü', high: 'Çabuk sinirlenen' },
      bands: {
        low: {
          from: { school: ['q4_08'], friends: ['q4_09'], home: ['q4_10'], work: ['q4_08', 'q4_09'] },
          student: {
            school: 'Grup çalışmasında bir arkadaşın hata yapınca kolay kolay sinirlenmeyebilirsin.',
            friends: 'Bir arkadaşınla tartıştıktan sonra affedip unutmaya çalışabilirsin.',
            home: 'Evdekilerin her biri hakkında iyi bir söz söyleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bir arkadaşı hata yapınca kolay kolay sinirlenmeyebilir.',
            friends: 'Bir arkadaşıyla tartıştıktan sonra affedip unutmaya çalışabilir.',
            home: 'Evdekilerin her biri hakkında iyi bir söz söyleyebilir.',
          },
          adult: {
            work: 'Bir işte biri hata yapınca kolay kolay sinirlenmeyip affetmeye çalışabilirsin.',
            home: 'Yakınlarının her biri hakkında iyi bir söz söyleyebilirsin.',
          },
        },
        average: {
          from: { school: ['q4_04'], friends: ['q4_06', 'q4_09'], home: ['q4_05'], work: ['q4_01', 'q4_08'] },
          student: {
            school: 'Grup çalışmasında bir arkadaşının hatası bazen sinirini bozabilir, çoğu zaman sakin kalabilirsin.',
            friends: 'Bir tartışmada itiraz edilince bazen sinirlenebilir, sonra affedip unutmaya çalışabilirsin.',
            home: 'Ufak şeyler bazen canını sıkabilir, çoğu zaman bunları önemsemeyebilirsin.',
          },
          parent: {
            school: 'Grup çalışmasında bir arkadaşının hatası bazen çocuğunuzun sinirini bozabilir, çoğu zaman sakin kalabilir.',
            friends: 'Bir tartışmada itiraz edilince bazen sinirlenebilir, sonra affedip unutmaya çalışabilir.',
            home: 'Ufak şeyler bazen canını sıkabilir, çoğu zaman bunları önemsemeyebilir.',
          },
          adult: {
            work: 'Bazı günler sinirin çabuk bozulabilir, çoğu zaman sakin kalabilirsin.',
          },
        },
        high: {
          from: { school: ['q4_04'], friends: ['q4_06'], home: ['q4_05', 'q4_01'], work: ['q4_04', 'q4_06'] },
          student: {
            school: 'Grup çalışmasında bir arkadaşının hatası seni çabuk sinirlendirebilir.',
            friends: 'Bir tartışmada söylediklerine itiraz edilmesi sana zor gelebilir.',
            home: 'Ufak bir şey sinirini çabuk bozabilir; o an biraz durup sakinleşmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Grup çalışmasında bir arkadaşının hatası çocuğunuzu çabuk sinirlendirebilir.',
            friends: 'Bir tartışmada söylediklerine itiraz edilmesi ona zor gelebilir.',
            home: 'Ufak bir şey sinirini çabuk bozabilir; o an biraz durup sakinleşmek ona iyi gelebilir.',
          },
          adult: {
            work: 'Bir işte başkalarının hataları ya da sana itiraz edilmesi sinirini çabuk bozabilir.',
          },
        },
      },
    },
  },
};
