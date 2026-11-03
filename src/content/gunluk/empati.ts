import type { SurveyDaily } from './types';

/**
 * Empati: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: gelişim (lib/reports/daily-parts.ts, `scaleTone`):
 * örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz. Şablonun
 * (src/content/reports/empati.ts) maddeye dayanmayan iki yorumu bu yüzden örneklere taşınmadı: duygusal duyarlılığın düşük
 * ucunda "zor anlarda düşünerek davranmak", yüksek ucunda "başkalarının acısı seni yorabilir". Destek kutusu yoktur.
 * Hiçbir örnek kişiyi yargılamaz ("bencil", "duygusuz", "soğuk" yok) ve başkalarını ne kadar doğru anladığını söylemez:
 * test bunu ölçmez (Murphy ve Lilienfeld, 2019; şablonun ilkesi).
 *
 * Şablonun çelişmezlik ilkesi örneklerde de geçerlidir (aynı sayfada üç kart birlikte görünür):
 *  - "Zaman ayırma" iki ölçekte zıt yönde sorulur (sıcaklık war05, başkalarını düşünme und09); "ilgi" de iki ölçektedir
 *    (sıcaklık war01/war10, başkalarını düşünme und06/und07). Bu dört madde hiçbir örneğin dayanağı değildir.
 *  - Başkalarını düşünmenin düşük ve orta örnekleri duygulardan ve "sorunlar"dan söz etmez (duygusal duyarlılığın kartı
 *    "derdiyle dertlenme" der); bakış açısı (und05), yarar (und03) ve yardım (und04, und10) maddelerine dayanır.
 *  - Duygusal duyarlılığın düşük örnekleri yalnızca duygulanmayı anlatır, önemsemeyi değil.
 * "Başkalarını nasıl teselli edeceğimi bilirim" (war03) bir beceri gibi değil, davranış olarak yazılır ("teselli etmeye
 * çalışabilirsin"). "Nadiren gülümserim" (war11) kullanılmadı (kişiyi yargılar gibi okunabilir). Yetişkinin ev satırı
 * evdekilerden değil yakınlardan ve komşulardan söz eder (`adult.home`; yalnız yaşayan yetişkin). Her satırın dayandığı
 * maddeler `from`'dadır.
 */
export const empatiDaily: SurveyDaily = {
  kind: 'survey',
  version: 'empati-gunluk-1',
  scales: {
    /*
     * Başkalarını düşünme: und01 "Başkalarının duygularını anlar, onlara ortak olurum", und02 "Başkalarının duygularına saygı
     * gösteririm", und03 "Başkalarının yararını da düşünürüm", und04 "Başkalarına yardımcı olmayı severim", und05
     * "Başkalarının bakış açısına değer veririm"; ters: und06 "Başkalarının iyi olup olmaması beni pek ilgilendirmez", und07
     * "Başkalarının sorunları beni ilgilendirmez", und08 "Başkalarının ne hissettiği umurumda olmaz", und09 "Başkalarına
     * zaman ayırmam", und10 "Başkalarının ihtiyaçlarıyla uğraşmak istemem".
     */
    understanding: {
      poles: { low: 'Kendi işine odaklanır', high: 'Başkalarını da gözetir' },
      bands: {
        low: {
          from: { school: ['und03', 'und10'], friends: ['und05'], home: ['und04', 'und10'], work: ['und03', 'und10'] },
          student: {
            school: 'Grup çalışmasında başkalarının ne istediğinden çok kendi payına düşen işe odaklanabilirsin.',
            friends: 'Arkadaşlarınla bir konu tartışılırken onların bakış açısından çok kendi görüşüne odaklanabilirsin.',
            home: 'Biri evde yardım isteyince önce kendi işlerini bitirmeyi seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında başkalarının ne istediğinden çok kendi payına düşen işe odaklanabilir.',
            friends: 'Arkadaşlarıyla bir konu tartışılırken onların bakış açısından çok kendi görüşüne odaklanabilir.',
            home: 'Biri evde yardım isteyince çocuğunuz önce kendi işlerini bitirmeyi seçebilir.',
          },
          adult: {
            work: 'Ortak bir işte başkalarının ne istediğinden çok kendi payına düşen kısma odaklanabilirsin.',
            home: 'Bir yakının ya da komşun yardım isteyince önce kendi işlerini bitirmeyi seçebilirsin.',
          },
        },
        average: {
          from: { school: ['und03'], friends: ['und05'], home: ['und04', 'und10'], work: ['und03'] },
          student: {
            school: 'Grup çalışmasında bazen herkesin yararını gözetebilir, bazen önce kendi payını düşünebilirsin.',
            friends: 'Bir tartışmada bazen arkadaşlarının bakış açısını dinleyebilir, bazen kendi görüşünde kalabilirsin.',
            home: 'Biri evde yardım isteyince bazen hemen yardım edebilir, bazen önce kendi işini bitirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında bazen herkesin yararını gözetebilir, bazen önce kendi payını düşünebilir.',
            friends: 'Bir tartışmada bazen arkadaşlarının bakış açısını dinleyebilir, bazen kendi görüşünde kalabilir.',
            home: 'Biri evde yardım isteyince bazen hemen yardım edebilir, bazen önce kendi işini bitirebilir.',
          },
          adult: {
            work: 'Ortak bir işte bazen herkesin yararını gözetebilir, bazen önce kendi payını düşünebilirsin.',
            home: 'Bir yakının ya da komşun yardım isteyince bazen hemen yardım edebilir, bazen önce kendi işini bitirebilirsin.',
          },
        },
        high: {
          from: { school: ['und05', 'und03'], friends: ['und04', 'und10'], home: ['und02', 'und08'], work: ['und05', 'und03'] },
          student: {
            school: 'Grup çalışmasında başkalarının görüşüne değer verip herkesin yararını gözetebilirsin.',
            friends: 'Bir arkadaşının bir ihtiyacı olduğunda ona yardımcı olmak isteyebilirsin.',
            home: 'Evdeki bir konuda karar verilirken herkesin ne hissettiğini de hesaba katabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz grup çalışmasında başkalarının görüşüne değer verip herkesin yararını gözetebilir.',
            friends: 'Bir arkadaşının bir ihtiyacı olduğunda ona yardımcı olmak isteyebilir.',
            home: 'Evdeki bir konuda karar verilirken herkesin ne hissettiğini de hesaba katabilir.',
          },
          adult: {
            work: 'Ortak bir işte başkalarının görüşüne değer verip herkesin yararını gözetebilirsin.',
            home: 'Bir yakınınla ortak bir karar verirken onun ne hissettiğini de hesaba katabilirsin.',
          },
        },
      },
    },
    /*
     * Duygusal duyarlılık: aff01 "Başkalarının ne hissettiğini içimde hissederim", aff02 "Başkalarının derdiyle dertlenirim",
     * aff03 "Başkalarının başına gelen kötü şeylerden derinden etkilenirim", aff04 "Gözlerim kolayca dolar", aff05 "Kolay
     * ağlarım", aff06 "Duygularımı yoğun yaşarım", aff07 "Diğer insanlarla aramda derin bir bağ hissederim"; ters: aff08
     * "Duygusallaşan insanları anlamam", aff10 "Nadiren duygulanırım".
     */
    affective: {
      poles: { low: 'Kolay kolay duygulanmaz', high: 'Derinden duygulanır' },
      bands: {
        low: {
          from: { school: ['aff03', 'aff10'], friends: ['aff01', 'aff02'], home: ['aff10', 'aff04'], work: ['aff03', 'aff10'] },
          student: {
            school: 'Derste üzücü bir olay anlatılınca çoğu zaman sakin kalabilirsin.',
            friends: 'Bir arkadaşın sana derdini anlatırken onun duygusunu içinde pek hissetmeyebilirsin; bu, onu önemsemediğin anlamına gelmez.',
            home: 'Duygusal bir film izlerken pek duygulanmayabilirsin.',
          },
          parent: {
            school: 'Derste üzücü bir olay anlatılınca çocuğunuz çoğu zaman sakin kalabilir.',
            friends: 'Bir arkadaşı ona derdini anlatırken onun duygusunu içinde pek hissetmeyebilir; bu, onu önemsemediği anlamına gelmez.',
            home: 'Duygusal bir film izlerken pek duygulanmayabilir.',
          },
          adult: {
            work: 'Gün içinde biri başına gelen kötü bir şeyi anlatınca çoğu zaman sakin kalabilirsin.',
          },
        },
        average: {
          from: { school: ['aff03'], friends: ['aff01', 'aff02'], home: ['aff04', 'aff10'], work: ['aff03'] },
          student: {
            school: 'Derste üzücü bir olay anlatılınca bazen derinden etkilenebilir, bazen sakin kalabilirsin.',
            friends: 'Bir arkadaşının derdini bazen içinde hissedebilir, bazen daha uzaktan dinleyebilirsin.',
            home: 'Duygusal bir film izlerken bazen gözlerin dolabilir, bazen pek etkilenmeyebilirsin.',
          },
          parent: {
            school: 'Derste üzücü bir olay anlatılınca çocuğunuz bazen derinden etkilenebilir, bazen sakin kalabilir.',
            friends: 'Bir arkadaşının derdini bazen içinde hissedebilir, bazen daha uzaktan dinleyebilir.',
            home: 'Duygusal bir film izlerken bazen gözleri dolabilir, bazen pek etkilenmeyebilir.',
          },
          adult: {
            work: 'Gün içinde biri başına gelen kötü bir şeyi anlatınca bazen derinden etkilenebilir, bazen sakin kalabilirsin.',
          },
        },
        high: {
          from: { school: ['aff03'], friends: ['aff01', 'aff02'], home: ['aff04', 'aff05'], work: ['aff03', 'aff01'] },
          student: {
            school: 'Derste üzücü bir olay anlatılınca derinden etkilenebilirsin.',
            friends: 'Bir arkadaşın sana derdini anlatınca onun duygusunu içinde hissedip onunla dertlenebilirsin.',
            home: 'Duygusal bir film izlerken gözlerin kolayca dolabilir, ağlayabilirsin.',
          },
          parent: {
            school: 'Derste üzücü bir olay anlatılınca çocuğunuz derinden etkilenebilir.',
            friends: 'Bir arkadaşı ona derdini anlatınca onun duygusunu içinde hissedip onunla dertlenebilir.',
            home: 'Duygusal bir film izlerken gözleri kolayca dolabilir, ağlayabilir.',
          },
          adult: {
            work: 'Gün içinde biri başına gelen kötü bir şeyi anlatınca onun duygusunu içinde hissedebilirsin.',
          },
        },
      },
    },
    /*
     * Sıcaklık ve destek: war01 "İnsanlara ilgi duyarım", war02 "İnsanların yanımda rahat hissetmesini sağlarım", war03
     * "Başkalarını nasıl teselli edeceğimi bilirim", war04 "Başkalarının hâlini hatırını sorarım", war05 "Başkalarına zaman
     * ayırırım", war06 "İnsanlara iyi karşılandıklarını hissettiririm", war07 "Birine minnettar olduğumda bunu belli
     * ederim", war08 "Başkalarının kendilerini iyi hissetmelerini sağlarım"; ters: war10 "Aslında diğer insanlara pek ilgi
     * duymam", war11 "Nadiren gülümserim". Uçlar şablonun düşük düzey anlatımından: "sıcaklığını pek dışa vurmadığını".
     */
    warmth: {
      poles: { low: 'Sıcaklığını az gösterir', high: 'Sıcaklığını belli eder' },
      bands: {
        low: {
          from: { school: ['war06', 'war02'], friends: ['war03', 'war08'], home: ['war07'], work: ['war06', 'war02'] },
          student: {
            school: 'Derse ya da gruba yeni biri katılınca onu karşılamayı başkalarına bırakabilirsin.',
            friends: 'Üzgün bir arkadaşının yanında sıcaklığını pek dışa vurmayabilirsin.',
            home: 'Evdekilerden birine minnettar olduğunda bunu çoğu zaman sözle belli etmeyebilirsin.',
          },
          parent: {
            school: 'Derse ya da gruba yeni biri katılınca çocuğunuz onu karşılamayı başkalarına bırakabilir.',
            friends: 'Üzgün bir arkadaşının yanında sıcaklığını pek dışa vurmayabilir.',
            home: 'Evdekilerden birine minnettar olduğunda bunu çoğu zaman sözle belli etmeyebilir.',
          },
          adult: {
            work: 'Bir ortama yeni biri katılınca onu karşılamayı ve rahatlatmayı başkalarına bırakabilirsin.',
            home: 'Bir yakınına minnettar olduğunda bunu çoğu zaman sözle belli etmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['war06', 'war02'], friends: ['war03'], home: ['war07'], work: ['war02', 'war06'] },
          student: {
            school: 'Derse ya da gruba yeni biri katılınca onu bazen sıcak karşılayabilir, bazen uzaktan izleyebilirsin.',
            friends: 'Üzgün bir arkadaşını bazen teselli etmeye çalışabilir, bazen ne diyeceğini bilemeyebilirsin.',
            home: 'Evdekilerden birine minnettar olduğunda bunu bazen sözle belli edebilir, bazen içinde tutabilirsin.',
          },
          parent: {
            school: 'Derse ya da gruba yeni biri katılınca çocuğunuz onu bazen sıcak karşılayabilir, bazen uzaktan izleyebilir.',
            friends: 'Üzgün bir arkadaşını bazen teselli etmeye çalışabilir, bazen ne diyeceğini bilemeyebilir.',
            home: 'Evdekilerden birine minnettar olduğunda bunu bazen sözle belli edebilir, bazen içinde tutabilir.',
          },
          adult: {
            work: 'Bir ortama yeni biri katılınca onu bazen hemen rahatlatabilir, bazen ölçülü kalabilirsin.',
            home: 'Bir yakınına minnettar olduğunda bunu bazen sözle belli edebilir, bazen içinde tutabilirsin.',
          },
        },
        high: {
          from: { school: ['war06', 'war02'], friends: ['war03', 'war08'], home: ['war04', 'war07'], work: ['war02', 'war06'] },
          student: {
            school: 'Derse ya da gruba yeni biri katılınca onu sıcak karşılayıp rahat etmesini sağlayabilirsin.',
            friends: 'Üzgün bir arkadaşının yanına gidip onu teselli etmeye çalışabilirsin.',
            home: 'Evdekilerin hâlini hatırını sorabilir, birine minnettar olduğunda bunu belli edebilirsin.',
          },
          parent: {
            school: 'Derse ya da gruba yeni biri katılınca çocuğunuz onu sıcak karşılayıp rahat etmesini sağlayabilir.',
            friends: 'Üzgün bir arkadaşının yanına gidip onu teselli etmeye çalışabilir.',
            home: 'Evdekilerin hâlini hatırını sorabilir, birine minnettar olduğunda bunu belli edebilir.',
          },
          adult: {
            work: 'Bir ortama yeni biri katılınca onun rahat etmesini sağlayıp iyi karşılandığını hissettirebilirsin.',
            home: 'Yakınlarının hâlini hatırını sorabilir, birine minnettar olduğunda bunu belli edebilirsin.',
          },
        },
      },
    },
  },
};
