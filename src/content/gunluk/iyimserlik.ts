import type { SurveyDaily } from './types';

/**
 * İyimserlik Ölçeği: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: gelişim (lib/reports/daily-parts.ts,
 * `scaleTone`): örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz.
 * Dört kartın da düşük düzeyi destek kutusu açar (src/content/reports/iyimserlik.ts): düşük örnekler çok yumuşaktır, belirti
 * saymaz, zor anın yanında bir dayanak söyler ("güvendiğin biriyle konuşmak iyi gelebilir"); bu bölüm destek kutusunu anmaz.
 *
 * Kartların dayandığı maddeler bilerek ayrıldı:
 *  - Toplam (iyimserlik) kartı yalnızca hayata bakışı soran iki maddeye (o04, o09: iyi taraf ve zorluk) dayanır. Bu kart
 *    hiçbir zaman örneksiz kalmaz (madde işareti konu satırına düşer: "Sık sık kendimi hüzünlü hissederim" ruh hâline,
 *    "Kendimden hoşlanmam" kendine bakışa); ruh hâli ya da kendine bakış maddelerine dayansaydı, destek kutusu açıkken
 *    "çoğu gün keyifli olabilirsin" gibi bir örnek kutuyla çelişebilirdi.
 *  - Hayata ve geleceğe bakış kartı geleceği soran üç maddeye (o01, o05, o06) dayanır; iki kart aynı şeyi yinelemez.
 *  - Kendine bakış: düşük düzeyin örnekleri yalnızca "Kendimle barışığım" (o02) maddesine dayanır. Bu kartta örnek yalnızca
 *    "Kendimden hoşlanmam" (o07) maddesine "Oldukça doğru" ya da "Tamamen doğru" denmediyse ve iki cevap iki uca ayrılmadıysa
 *    görünür; o zaman o07'nin cevabı ortadadır ("Ne doğru ne yanlış"). "Kendinden hoşlanmayabilirsin" demek bu cevapla
 *    çelişirdi.
 *  - Ruh hâli: aynı nedenle düşük düzeyin örnekleri "sık sık hüzünlü" demez (o08 işaretli değilse cevabı en çok ortadadır);
 *    o03 ("Kendimi nadiren hüzünlü hissederim") ve o10 ("Sık sık keyifsiz olurum") maddelerine dayanır.
 * Maddeye doğrudan dayanmayan tek uzantı dayanak cümleleridir (destek kutusunun ilk cümlesinin yumuşak bir yankısı). Her
 * satırın dayandığı maddeler `from`'dadır.
 */
export const iyimserlikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'iyimserlik-gunluk-1',
  scales: {
    /*
     * İyimserlik (on maddenin ortalaması). Örnekler: o04 "Hayatın iyi tarafından bakarım"; ters: o09 "Her şeyde bir zorluk
     * görürüm". Uçlar bütün ölçeği anlatır (testin uçları "Daha karamsar" ↔ "Daha iyimser").
     */
    iyimserlik: {
      poles: { low: 'Çoğu zaman karamsar bakar', high: 'Çoğu zaman umutla bakar' },
      bands: {
        low: {
          from: { school: ['o09'], friends: ['o09', 'o04'], home: ['o04'], work: ['o09'] },
          student: {
            school: 'Yeni bir proje ya da ödev verildiğinde önce onun zorluklarını görebilirsin.',
            friends: 'Arkadaşlarınla bir plan yaparken her adımda bir zorluk görebilirsin.',
            home: 'Evdeki bir aksilikten sonra işin iyi tarafını görmek sana zor gelebilir; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Yeni bir proje ya da ödev verildiğinde çocuğunuz önce onun zorluklarını görebilir.',
            friends: 'Arkadaşlarıyla bir plan yaparken her adımda bir zorluk görebilir.',
            home: 'Evdeki bir aksilikten sonra işin iyi tarafını görmek ona zor gelebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
          },
          adult: {
            work: 'Yeni bir görev verildiğinde önce onun zorluklarını görebilirsin.',
          },
        },
        average: {
          from: { school: ['o09', 'o04'], friends: ['o04'], home: ['o09'], work: ['o09', 'o04'] },
          student: {
            school: 'Yeni bir projeye bazen umutla başlayabilir, bazen önce zorluklarını görebilirsin.',
            friends: 'Arkadaşlarınla bir plan aksayınca bazen işin iyi tarafını görebilir, bazen karamsar kalabilirsin.',
            home: 'Evdeki bir aksilik bazı günler sana küçük, bazı günler büyük bir zorluk gibi görünebilir.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir projeye bazen umutla başlayabilir, bazen önce zorluklarını görebilir.',
            friends: 'Arkadaşlarıyla bir plan aksayınca bazen işin iyi tarafını görebilir, bazen karamsar kalabilir.',
            home: 'Evdeki bir aksilik bazı günler ona küçük, bazı günler büyük bir zorluk gibi görünebilir.',
          },
          adult: {
            work: 'Yeni bir işe bazen umutla başlayabilir, bazen önce zorluklarını görebilirsin.',
          },
        },
        high: {
          from: { school: ['o09', 'o04'], friends: ['o04'], home: ['o09'], work: ['o09', 'o04'] },
          student: {
            school: 'Zor bir proje verildiğinde de çoğu zaman işin iyi tarafını görebilirsin.',
            friends: 'Arkadaşlarınla bir plan aksadığında da olanlara iyi tarafından bakabilirsin.',
            home: 'Evdeki küçük aksilikler sana çoğu zaman büyük bir zorluk gibi görünmeyebilir.',
          },
          parent: {
            school: 'Zor bir proje verildiğinde de çocuğunuz çoğu zaman işin iyi tarafını görebilir.',
            friends: 'Arkadaşlarıyla bir plan aksadığında da olanlara iyi tarafından bakabilir.',
            home: 'Evdeki küçük aksilikler ona çoğu zaman büyük bir zorluk gibi görünmeyebilir.',
          },
          adult: {
            work: 'Zor bir görev verildiğinde de çoğu zaman işin iyi tarafını görebilirsin.',
          },
        },
      },
    },
    /*
     * Hayata ve geleceğe bakış. Örnekler: o01 "Başarılı biri olacağımı biliyorum"; ters: o05 "Geleceğe karamsar bakarım",
     * o06 "Hayatımın belli bir yönü olmadığını hissederim". (o04 ve o09 toplam kartının örneklerindedir.)
     */
    gelecek: {
      poles: { low: 'Geleceğe karamsar bakar', high: 'Geleceğe umutla bakar' },
      bands: {
        low: {
          from: { school: ['o06'], friends: ['o05'], home: ['o01'], work: ['o06'] },
          student: {
            school: 'Hangi alanı ya da bölümü seçeceğini düşündüğünde hayatının belli bir yönü yokmuş gibi hissedebilirsin.',
            friends: 'Arkadaşlarınla gelecek planları konuşulunca geleceğine karamsar bakabilirsin; bunu güvendiğin biriyle paylaşmak iyi gelebilir.',
            home: 'Evdekiler geleceğinden söz edince başarılı biri olacağından emin olmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz hangi alanı ya da bölümü seçeceğini düşündüğünde hayatının belli bir yönü yokmuş gibi hissedebilir.',
            friends: 'Arkadaşlarıyla gelecek planları konuşulunca geleceğine karamsar bakabilir; bunu güvendiği biriyle paylaşmak iyi gelebilir.',
            home: 'Evdekiler geleceğinden söz edince çocuğunuz başarılı biri olacağından emin olmayabilir.',
          },
          adult: {
            work: 'Günlük işlerini yaparken hayatının belli bir yönü yokmuş gibi hissedebilirsin.',
          },
        },
        average: {
          from: { school: ['o01'], friends: ['o05'], home: ['o06'], work: ['o01'] },
          student: {
            school: 'Sınav dönemlerinde ileride başarılı biri olacağına bazen inanabilir, bazen emin olmayabilirsin.',
            friends: 'Arkadaşlarınla geleceği konuşurken bazen umutlu, bazen karamsar olabilirsin.',
            home: 'Gelecek planlarını düşünürken hayatının yönünü bazen net, bazen belirsiz görebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınav dönemlerinde ileride başarılı biri olacağına bazen inanabilir, bazen emin olmayabilir.',
            friends: 'Arkadaşlarıyla geleceği konuşurken bazen umutlu, bazen karamsar olabilir.',
            home: 'Gelecek planlarını düşünürken hayatının yönünü bazen net, bazen belirsiz görebilir.',
          },
          adult: {
            work: 'Yaptığın işlerde ileride başarılı biri olacağına bazı dönemler inanabilir, bazı dönemler emin olmayabilirsin.',
          },
        },
        high: {
          from: { school: ['o01'], friends: ['o05'], home: ['o06'], work: ['o01'] },
          student: {
            school: 'Zorlu bir sınav döneminde de ileride başarılı biri olacağına inanabilirsin.',
            friends: 'Arkadaşlarınla gelecek planlarını konuşurken çoğu zaman umutlu olabilirsin.',
            home: 'Gelecek planlarını düşündüğünde hayatının belli bir yönü olduğunu hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz zorlu bir sınav döneminde de ileride başarılı biri olacağına inanabilir.',
            friends: 'Arkadaşlarıyla gelecek planlarını konuşurken çoğu zaman umutlu olabilir.',
            home: 'Gelecek planlarını düşündüğünde hayatının belli bir yönü olduğunu hissedebilir.',
          },
          adult: {
            work: 'Yeni bir işe başlarken ileride başarılı biri olacağına inanabilirsin.',
          },
        },
      },
    },
    /*
     * Kendine bakış. o02 "Kendimle barışığım"; ters: o07 "Kendimden hoşlanmam". Düşük düzeyin örnekleri yalnızca o02'ye
     * dayanır (dosyanın başındaki açıklama). Orta düzey, iki cevabın da ortada olduğu durumdur ("Ne doğru ne yanlış").
     */
    kendine_bakis: {
      poles: { low: 'Kendine olumsuz bakar', high: 'Kendine olumlu bakar' },
      bands: {
        low: {
          from: { school: ['o02'], friends: ['o02'], home: ['o02'], work: ['o02'] },
          student: {
            school: 'Sınıfta kendini olduğun gibi kabul etmek sana zor gelebilir.',
            friends: 'Arkadaşlarınla birlikteyken kendinle barışık hissetmeyebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            home: 'Kendi başına kaldığında kendinle barışık hissetmek sana kolay gelmeyebilir; bu duygu zamanla değişebilir.',
          },
          parent: {
            school: 'Sınıfta kendini olduğu gibi kabul etmek çocuğunuza zor gelebilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendisiyle barışık hissetmeyebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            home: 'Kendi başına kaldığında kendisiyle barışık hissetmek ona kolay gelmeyebilir; bu duygu zamanla değişebilir.',
          },
          adult: {
            work: 'Gün içinde işlerini yaparken kendini olduğun gibi kabul etmek sana zor gelebilir.',
          },
        },
        average: {
          from: { school: ['o02'], friends: ['o07'], home: ['o02', 'o07'], work: ['o02'] },
          student: {
            school: 'Bazı günler sınıfta kendinle barışık hissedebilir, bazı günler bundan emin olamayabilirsin.',
            friends: 'Arkadaşlarınla birlikteyken kendinin bazı yanlarından hoşlanabilir, bazılarından hoşlanmayabilirsin.',
            home: 'Kendin hakkındaki düşüncelerin günden güne değişebilir.',
          },
          parent: {
            school: 'Çocuğunuz bazı günler sınıfta kendisiyle barışık hissedebilir, bazı günler bundan emin olamayabilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendisinin bazı yanlarından hoşlanabilir, bazılarından hoşlanmayabilir.',
            home: 'Çocuğunuzun kendisi hakkındaki düşünceleri günden güne değişebilir.',
          },
          adult: {
            work: 'Bazı günler işlerini yaparken kendinle barışık hissedebilir, bazı günler bundan emin olamayabilirsin.',
          },
        },
        high: {
          from: { school: ['o02'], friends: ['o07'], home: ['o02'], work: ['o02'] },
          student: {
            school: 'Sınıfta kendini çoğu zaman olduğun gibi kabul edebilirsin.',
            friends: 'Arkadaşlarınla birlikteyken kendinden hoşnut hissedebilirsin.',
            home: 'Kendi başına kaldığında da çoğu zaman kendinle barışık hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta kendini çoğu zaman olduğu gibi kabul edebilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendisinden hoşnut hissedebilir.',
            home: 'Kendi başına kaldığında da çoğu zaman kendisiyle barışık hissedebilir.',
          },
          adult: {
            work: 'Gün içinde işlerini yaparken kendini çoğu zaman olduğun gibi kabul edebilirsin.',
          },
        },
      },
    },
    /*
     * Ruh hâli. o03 "Kendimi nadiren hüzünlü hissederim"; ters: o08 "Sık sık kendimi hüzünlü hissederim", o10 "Sık sık
     * keyifsiz olurum". Düşük düzeyin örnekleri o03 ve o10'a dayanır (dosyanın başındaki açıklama).
     */
    ruh_hali: {
      poles: { low: 'Sık sık keyifsiz olur', high: 'Çoğu zaman keyifli olur' },
      bands: {
        low: {
          from: { school: ['o10', 'o03'], friends: ['o10'], home: ['o03'], work: ['o10', 'o03'] },
          student: {
            school: 'Derste kendini keyifsiz ya da hüzünlü hissettiğin anlar olabilir; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            friends: 'Arkadaşlarınla birlikteyken de keyfin yerinde olmayabilir; bu durum zamanla değişebilir.',
            home: 'Evdeyken hüzünlü hissettiğin zamanlar olabilir; nasıl hissettiğini evdekilerden birine anlatmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz derste kendini keyifsiz ya da hüzünlü hissettiği anlar yaşayabilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            friends: 'Arkadaşlarıyla birlikteyken de keyfi yerinde olmayabilir; bu durum zamanla değişebilir.',
            home: 'Evdeyken hüzünlü hissettiği zamanlar olabilir; nasıl hissettiğini evdekilerden birine anlatmak ona iyi gelebilir.',
          },
          adult: {
            work: 'Gün içinde işlerini yaparken kendini keyifsiz ya da hüzünlü hissettiğin zamanlar olabilir; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['o10'], friends: ['o03', 'o08'], home: ['o03'], work: ['o10'] },
          student: {
            school: 'Bazı ders günlerinde keyifli, bazılarında keyifsiz olabilirsin.',
            friends: 'Arkadaşlarınla birlikteyken bazen keyifli, bazen biraz hüzünlü hissedebilirsin.',
            home: 'Evdeyken ruh hâlin bazı günler hüzünlü, bazı günler neşeli olabilir.',
          },
          parent: {
            school: 'Çocuğunuz bazı ders günlerinde keyifli, bazılarında keyifsiz olabilir.',
            friends: 'Arkadaşlarıyla birlikteyken bazen keyifli, bazen biraz hüzünlü hissedebilir.',
            home: 'Evdeyken ruh hâli bazı günler hüzünlü, bazı günler neşeli olabilir.',
          },
          adult: {
            work: 'Bazı günler işlerini yaparken keyifli, bazı günler keyifsiz olabilirsin.',
          },
        },
        high: {
          from: { school: ['o10'], friends: ['o03', 'o08'], home: ['o03', 'o10'], work: ['o10'] },
          student: {
            school: 'Yoğun bir ders gününde de çoğu zaman keyifli olabilirsin.',
            friends: 'Arkadaşlarınla birlikteyken kendini nadiren hüzünlü hissedebilirsin.',
            home: 'Evdeyken de çoğu gün keyifli hissedebilirsin; üzüldüğün bir şey olursa onu paylaşmak yine iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz yoğun bir ders gününde de çoğu zaman keyifli olabilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendini nadiren hüzünlü hissedebilir.',
            home: 'Evdeyken de çoğu gün keyifli hissedebilir; üzüldüğü bir şey olursa onu paylaşmak yine iyi gelebilir.',
          },
          adult: {
            work: 'Yoğun bir günde de işlerini yaparken çoğu zaman keyifli olabilirsin.',
          },
        },
      },
    },
  },
};
