import type { SurveyDaily } from './types';

/**
 * İyimserlik Ölçeği: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: gelişim (lib/reports/daily-parts.ts,
 * `scaleTone`): örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz.
 * Dört kartın da düşük düzeyi destek kutusu açar (src/content/reports/iyimserlik.ts): düşük örnekler çok yumuşaktır, belirti
 * saymaz, zor anın yanında bir dayanak söyler; dayanaklar birbirini yinelemez ve bu bölüm destek kutusunu anmaz.
 *
 * Kartlar:
 *  - Toplam (iyimserlik) kartında örnek yok, yönlendirme var (`pointer`; types.ts, denetim listesinin 5. maddesi). On
 *    maddenin her biri bir konunun kartında örneklenir. Toplamın kendi örnekleri ya bir konunun maddelerine dayanırdı (toplam
 *    ile o konu ayrı gruplara düşünce kişinin kendi cevaplarıyla çelişirdi; "Bilmekte yarar var" da toplamın öteki
 *    cümlelerden geldiğini söyleyebilir) ya da ruh hâli ve kendine bakış maddelerine (destek kutusunu açan cevap konu
 *    kartına düşer, toplam işaretlenmez; kutunun yanında "çoğu gün keyifli olabilirsin" gibi bir örnek kalırdı).
 *  - Hayata ve geleceğe bakış kartı geleceği soran üç maddeye (o01, o05, o06) dayanır.
 *  - Kendine bakış: örnekler yalnızca "Kendimle barışığım" (o02) maddesine dayanır (types.ts, denetim listesinin 4. maddesi:
 *    destek kutusunu açan madde satıra dayanak olmaz). Bu kartta örnek yalnızca "Kendimden hoşlanmam" (o07) maddesine
 *    "Oldukça doğru" ya da "Tamamen doğru" denmediyse görünür; o zaman o07'nin cevabı en çok ortadadır (düşük düzeyde o02 = 1
 *    iken "Pek doğru değil" de olabilir: ayrışma kuralı düşük düzeye uygulanmaz). "Kendinden hoşlanmayabilirsin" demek bu
 *    cevaplarla çelişirdi.
 *  - Ruh hâli: aynı nedenle düşük düzeyin örnekleri "sık sık hüzünlü" demez (o08 işaretli değilse cevabı en çok ortadadır);
 *    bütün düzeylerin örnekleri o03 ("Kendimi nadiren hüzünlü hissederim") ve o10 ("Sık sık keyifsiz olurum") maddelerine
 *    dayanır.
 * Mezun (13. sınıf) okul satırlarını "Okulda ya da derslerde" başlığıyla gördüğü için "sınıf" yerine "derste" denir;
 * yetişkinin ev satırı evdekilerden söz etmez (yalnız yaşayan yetişkin; geleceğe bakışın düşük düzeyinde `adult.home`).
 * Maddeye doğrudan dayanmayan tek uzantı dayanak cümleleridir (destek kutusunun ilk cümlesinin yumuşak bir yankısı). Her
 * satırın dayandığı maddeler `from`'dadır.
 */
export const iyimserlikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'iyimserlik-gunluk-1',
  scales: {
    /*
     * İyimserlik (on maddenin ortalaması): örnek yerine yönlendirme (dosyanın başındaki açıklama). Uçlar bütün ölçeği
     * anlatır (testin uçları "Daha karamsar" ↔ "Daha iyimser").
     */
    iyimserlik: {
      poles: { low: 'Çoğu zaman karamsar bakar', high: 'Çoğu zaman umutla bakar' },
      pointer: {
        student: 'Bu toplam puanın örnekleri aşağıdaki üç konunun kartlarında.',
        parent: 'Bu toplam puanın örnekleri aşağıdaki üç konunun kartlarında.',
      },
    },
    /*
     * Hayata ve geleceğe bakış. Örnekler: o01 "Başarılı biri olacağımı biliyorum"; ters: o05 "Geleceğe karamsar bakarım",
     * o06 "Hayatımın belli bir yönü olmadığını hissederim". (o04 ve o09'a dayanılmadı: üç madde geleceği daha doğrudan sorar.)
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
            home: 'Geleceğini düşündüğünde başarılı biri olacağından emin olmayabilirsin.',
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
     * Kendine bakış. o02 "Kendimle barışığım"; ters: o07 "Kendimden hoşlanmam" (destek kutusunu açar). Bütün düzeylerin
     * örnekleri yalnızca o02'ye dayanır (dosyanın başındaki açıklama). Orta düzey, o02'nin cevabının ortada olduğu durumdur.
     */
    kendine_bakis: {
      poles: { low: 'Kendine eleştirel bakar', high: 'Kendine olumlu bakar' },
      bands: {
        low: {
          from: { school: ['o02'], friends: ['o02'], home: ['o02'], work: ['o02'] },
          student: {
            school: 'Derste kendini olduğun gibi kabul etmek sana zor gelebilir.',
            friends: 'Arkadaşlarınla birlikteyken kendinle barışık hissetmeyebilirsin; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            home: 'Kendi başına kaldığında kendinle barışık hissetmek sana kolay gelmeyebilir.',
          },
          parent: {
            school: 'Derste kendini olduğu gibi kabul etmek çocuğunuza zor gelebilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendisiyle barışık hissetmeyebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            home: 'Kendi başına kaldığında kendisiyle barışık hissetmek ona kolay gelmeyebilir.',
          },
          adult: {
            work: 'Gün içinde işlerini yaparken kendini olduğun gibi kabul etmek sana zor gelebilir.',
          },
        },
        average: {
          from: { school: ['o02'], friends: ['o02'], home: ['o02'], work: ['o02'] },
          student: {
            school: 'Bazı günler derste kendinle barışık hissedebilir, bazı günler bundan emin olamayabilirsin.',
            friends: 'Arkadaşlarınla birlikteyken bazen kendin gibi davranmak sana rahat gelebilir, bazen gelmeyebilir.',
            home: 'Kendin hakkındaki düşüncelerin günden güne değişebilir.',
          },
          parent: {
            school: 'Çocuğunuz bazı günler derste kendisiyle barışık hissedebilir, bazı günler bundan emin olamayabilir.',
            friends: 'Arkadaşlarıyla birlikteyken bazen kendisi gibi davranmak ona rahat gelebilir, bazen gelmeyebilir.',
            home: 'Çocuğunuzun kendisi hakkındaki düşünceleri günden güne değişebilir.',
          },
          adult: {
            work: 'Bazı günler işlerini yaparken kendinle barışık hissedebilir, bazı günler bundan emin olamayabilirsin.',
          },
        },
        high: {
          from: { school: ['o02'], friends: ['o02'], home: ['o02'], work: ['o02'] },
          student: {
            school: 'Derste kendini çoğu zaman olduğun gibi kabul edebilirsin.',
            friends: 'Arkadaşlarınla birlikteyken çoğu zaman kendin gibi davranmak sana rahat gelebilir.',
            home: 'Kendi başına kaldığında da çoğu zaman kendinle barışık hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste kendini çoğu zaman olduğu gibi kabul edebilir.',
            friends: 'Arkadaşlarıyla birlikteyken çoğu zaman kendisi gibi davranmak ona rahat gelebilir.',
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
     * keyifsiz olurum". Örnekler o03 ve o10'a dayanır; o08 destek kutusunu açtığı için hiçbir satırın dayanağı değildir
     * (dosyanın başındaki açıklama).
     */
    ruh_hali: {
      poles: { low: 'Sık sık keyifsiz olur', high: 'Çoğu zaman keyifli olur' },
      bands: {
        low: {
          from: { school: ['o10', 'o03'], friends: ['o10'], home: ['o03'], work: ['o10', 'o03'] },
          student: {
            school: 'Derste kendini keyifsiz ya da hüzünlü hissettiğin anlar olabilir; bunu yakın olduğun biriyle konuşmak iyi gelebilir.',
            friends: 'Arkadaşlarınla birlikteyken de keyfin pek yerinde olmayabilir.',
            home: 'Evdeyken hüzünlü hissettiğin zamanlar olabilir.',
          },
          parent: {
            school: 'Çocuğunuz derste kendini keyifsiz ya da hüzünlü hissettiği anlar yaşayabilir; bunu yakın olduğu biriyle konuşmak iyi gelebilir.',
            friends: 'Arkadaşlarıyla birlikteyken de keyfi pek yerinde olmayabilir.',
            home: 'Evdeyken hüzünlü hissettiği zamanlar olabilir.',
          },
          adult: {
            work: 'Gün içinde işlerini yaparken kendini keyifsiz ya da hüzünlü hissettiğin zamanlar olabilir; bunu yakın olduğun biriyle konuşmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['o10'], friends: ['o03'], home: ['o03'], work: ['o10'] },
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
          from: { school: ['o10'], friends: ['o03'], home: ['o03', 'o10'], work: ['o10'] },
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
