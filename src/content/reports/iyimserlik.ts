import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * İyimserlik Ölçeği rapor metinleri.
 *
 * İlkeler:
 *  - Asıl sonuç on cümlenin ortalamasıdır (`iyimserlik`). Altındaki üç satır aynı cevapların konulara göre ortalamasıdır
 *    (hayata ve geleceğe bakış beş, kendine bakış iki, ruh hâli üç cümle): ayrı birer ölçek değildir, ölçüm payı yoktur.
 *    Metinleri "… cümleye verdiğin cevaplar …" diye başlar ve tek bir cümleye ne dendiğini kesin bir söz gibi anlatmaz
 *    (iki ya da üç cümlenin ortalaması da tek bir cümleye katılındığını göstermez).
 *  - Ölçek iyimserliği ölçer, ama on cümleden üçü ruh hâlini, ikisi kendine bakışı sorar. Bu yüzden düşük düzeylerde
 *    destek kutusu gösterilir: iyimserlik, hayata ve geleceğe bakış, kendine bakış ya da ruh hâli düşükse. Metinler tanı
 *    koymaz, korkutmaz, "depresyon" gibi bir ad vermez; zor bir dönemde destek almanın mümkün olduğunu söyler.
 *  - Yüksek iyimserlik bir başarı gibi, düşük iyimserlik bir kusur gibi anlatılmaz. Puanlar kişinin kendini nasıl
 *    tanımladığını gösterir: öğrenciye "… söylüyorsun", veliye "Çocuğunuz … belirtiyor" dili kullanılır.
 *  - Ortalama tek bir cevabı gizleyebilir. "Sık sık kendimi hüzünlü hissederim" ya da "Kendimden hoşlanmam" cümlesine
 *    "Oldukça doğru" ya da "Tamamen doğru" denirse destek kutusu her durumda açılır ve ilk satırı bunu söyler
 *    (`itemSupport`; ölçekte supportItems). Kendine bakış ya da ruh hâli cümlelerinin cevapları iki uca ayrışır ve ortalama
 *    düşük değilse kartta "Farklı cevaplar" yazar (`itemSplit`).
 *  - Toplam kartı yalnızca on cümlenin genel yönünü söyler; konular hakkında hüküm vermez (konu satırları başka yönde
 *    olabilir). Toplam ile hayata ve geleceğe bakış ayrıştığında bu, "Bilmekte yarar var"da ayrıca söylenir.
 *  - Öneriler raporda değil, yol haritasındadır. Metinler okula özgü sözcük içermez; yetişkin raporu öğrenci metinlerini
 *    kullanır (Öz-saygı Ölçeği yetişkinlere açık olmadığı için ondan söz eden kuralın yetişkin metni ayrıdır).
 */
const t = (summary: string, student: string, parent: string, support = false): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(support ? { support: true } : {}),
});

const rule = (
  when: InsightRule['when'],
  student: string,
  parent: string,
  extra: { adult?: string; not?: InsightRule['not'] } = {},
): InsightRule => ({
  when,
  ...(extra.not ? { not: extra.not } : {}),
  text: extra.adult ? { student, parent, adult: extra.adult } : { student, parent },
});

export const iyimserlikReport: ReportTemplate = {
  version: 'iyimserlik-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'İlk satır iyimserlik puanın: on cümlenin hepsine verdiğin cevapların ortalaması. Altındaki üç satır aynı cevapları cümlelerin sorduğu üç konuya göre ayırır: hayata ve geleceğe bakış (beş cümle), kendine bakış (iki cümle) ve ruh hâli (üç cümle). Bu üç satır ayrı birer ölçek değildir; cevaplarına yakından bakmanı sağlar. Puanlar ne yaşadığını değil, kendini nasıl tanımladığını gösterir.',
    parent:
      'İlk satır çocuğunuzun iyimserlik puanıdır: on cümlenin hepsine verdiği cevapların ortalaması. Altındaki üç satır aynı cevapları cümlelerin sorduğu üç konuya göre ayırır: hayata ve geleceğe bakış (beş cümle), kendine bakış (iki cümle) ve ruh hâli (üç cümle). Bu üç satır ayrı birer ölçek değildir; cevaplara yakından bakmayı sağlar. Puanlar çocuğunuzun ne yaşadığını değil, kendini nasıl tanımladığını gösterir.',
  },
  insight: {
    title: { you: 'Bilmekte yarar var', parent: 'Bilmekte yarar var' },
    pageNote: 'Bilmekte yarar var: iyimserliğin ne olduğu, neyle ilişkili bulunduğu ve değişip değişemeyeceği üzerine araştırmaların kısa özeti; üç konu birbirinden ayrıştığında ne anlama gelebileceği',
    lead: [
      {
        when: {},
        text: {
          student:
            'Araştırmacılar iyimserliği, geleceğe dair genel olarak iyi şeyler bekleme eğilimi olarak tanımlar. Bu testteki cümlelerin yalnızca yarısı geleceğe ve hayata bakışı sorar; ötekiler kendine bakışı ve ruh hâlini sorar. Bunun nedeni şu: cümleler, iyimserliği ölçen başka bir testle sonuçları en çok örtüşen cümleler arasından seçildi. İyimserlik ruh hâliyle ve kendine bakışla ilişkilidir, ama onlardan ayrı bir özelliktir. İyimser kişilerin zorluklarla karşılaşınca sorundan kaçmak yerine onunla uğraşmaya biraz daha yatkın olduğu bulunmuştur. İyimserlik kolay kolay değişmeyen bir eğilimdir, ama tamamen sabit değildir: yetişkinlerle yapılan çalışmalarda, en iyi olası geleceğini hayal edip yazmak gibi kısa çalışmaların iyimserliği biraz artırabildiği görülmüştür; bu artışın ne kadar sürdüğü ve gençlerde nasıl olduğu henüz yeterince bilinmiyor.',
          parent:
            'Araştırmacılar iyimserliği, geleceğe dair genel olarak iyi şeyler bekleme eğilimi olarak tanımlar. Bu testteki cümlelerin yalnızca yarısı geleceğe ve hayata bakışı sorar; ötekiler kendine bakışı ve ruh hâlini sorar. Bunun nedeni şu: cümleler, iyimserliği ölçen başka bir testle sonuçları en çok örtüşen cümleler arasından seçildi. İyimserlik ruh hâliyle ve kendine bakışla ilişkilidir, ama onlardan ayrı bir özelliktir. İyimser kişilerin zorluklarla karşılaşınca sorundan kaçmak yerine onunla uğraşmaya biraz daha yatkın olduğu bulunmuştur. İyimserlik kolay kolay değişmeyen bir eğilimdir, ama tamamen sabit değildir: yetişkinlerle yapılan çalışmalarda, en iyi olası geleceğini hayal edip yazmak gibi kısa çalışmaların iyimserliği biraz artırabildiği görülmüştür; bu artışın ne kadar sürdüğü ve gençlerde nasıl olduğu henüz yeterince bilinmiyor.',
          adult:
            'Araştırmacılar iyimserliği, geleceğe dair genel olarak iyi şeyler bekleme eğilimi olarak tanımlar. Bu testteki cümlelerin yalnızca yarısı geleceğe ve hayata bakışı sorar; ötekiler kendine bakışı ve ruh hâlini sorar. Bunun nedeni şu: cümleler, iyimserliği ölçen başka bir testle sonuçları en çok örtüşen cümleler arasından seçildi. İyimserlik ruh hâliyle ve kendine bakışla ilişkilidir, ama onlardan ayrı bir özelliktir. İyimser kişilerin zorluklarla karşılaşınca sorundan kaçmak yerine onunla uğraşmaya biraz daha yatkın olduğu bulunmuştur. İyimserlik kolay kolay değişmeyen bir eğilimdir, ama tamamen sabit değildir: en iyi olası geleceğini hayal edip yazmak gibi kısa çalışmaların iyimserliği biraz artırabildiği görülmüştür; bu artışın ne kadar sürdüğü henüz yeterince bilinmiyor.',
        },
      },
    ],
    rules: [
      rule(
        { ruh_hali: ['low'], iyimserlik: ['average', 'high'], gelecek: ['low', 'average'] },
        'Toplam puanın düşük olmasa da ruh hâli satırın düşük. Toplam puan, üç cümlelik bu konudaki cevapları gizleyebilir; bu yüzden ruh hâli satırını ayrıca okumakta yarar var.',
        'Çocuğunuzun toplam puanı düşük olmasa da ruh hâli satırı düşük. Toplam puan, üç cümlelik bu konudaki cevapları gizleyebilir; bu yüzden ruh hâli satırını ayrıca okumakta yarar var.',
      ),
      rule(
        { kendine_bakis: ['low'], iyimserlik: ['average', 'high'] },
        'Toplam puanın düşük olmasa da kendine bakışı soran iki cümlede olumsuz cevaplar ağır basıyor. Kendine bakışını daha ayrıntılı görmek istersen Öz-saygı Ölçeği’ni çözebilirsin.',
        'Çocuğunuzun toplam puanı düşük olmasa da kendine bakışı soran iki cümlede olumsuz cevaplar ağır basıyor. Kendine bakışını daha ayrıntılı görmek için Öz-saygı Ölçeği’ni çözmesini önerebilirsiniz.',
        { adult: 'Toplam puanın düşük olmasa da kendine bakışı soran iki cümlede olumsuz cevaplar ağır basıyor. Kendine nasıl baktığın, iyimserliğinden ayrı olarak da önemlidir.' },
      ),
      rule(
        { gelecek: ['low'], kendine_bakis: ['average', 'high'], ruh_hali: ['average', 'high'] },
        'Hayata ve geleceğe bakışı soran cümlelerde, kendine bakışı ve ruh hâlini soran cümlelere göre daha karamsar cevaplar vermişsin. Yol haritasındaki “En iyi olası gelecek” haftası, geleceğe bakışın üzerine düşünmek için bir başlangıç olabilir.',
        'Çocuğunuz hayata ve geleceğe bakışı soran cümlelerde, kendine bakışı ve ruh hâlini soran cümlelere göre daha karamsar cevaplar vermiş. Yol haritasındaki “En iyi olası gelecek” haftası, geleceğe bakışı üzerine düşünmesi için bir başlangıç olabilir.',
        { not: { iyimserlik: ['high'] } },
      ),
      rule(
        { gelecek: ['high'], ruh_hali: ['low'] },
        'Hayata ve geleceğe bakışı soran cümlelere verdiğin cevaplar umutlu, ama ruh hâli satırın düşük. Bu ikisi bir arada olabilir: geleceğe dair umudun zor günlerde sana destek olabilir; bugünkü ruh hâlin de ayrıca ilgilenmeyi hak eder.',
        'Çocuğunuzun hayata ve geleceğe bakışı soran cümlelere verdiği cevaplar umutlu, ama ruh hâli satırı düşük. Bu ikisi bir arada olabilir: geleceğe dair umudu zor günlerde ona destek olabilir; bugünkü ruh hâli de ayrıca ilgilenmeyi hak eder.',
      ),
      rule(
        { iyimserlik: ['high'], gelecek: ['low', 'average'] },
        'Toplam puanın yüksek olsa da hayata ve geleceğe bakışı soran beş cümleye verdiğin cevaplar daha az umutlu; yüksek toplam puan daha çok öteki cümlelerden geliyor.',
        'Çocuğunuzun toplam puanı yüksek olsa da hayata ve geleceğe bakışı soran beş cümleye verdiği cevaplar daha az umutlu; yüksek toplam puan daha çok öteki cümlelerden geliyor.',
      ),
      rule(
        { iyimserlik: ['low'], gelecek: ['average', 'high'] },
        'Toplam puanın düşük olsa da hayata ve geleceğe bakışı soran beş cümleye verdiğin cevaplar o kadar karamsar değil; düşük toplam puan daha çok öteki cümlelerden geliyor.',
        'Çocuğunuzun toplam puanı düşük olsa da hayata ve geleceğe bakışı soran beş cümleye verdiği cevaplar o kadar karamsar değil; düşük toplam puan daha çok öteki cümlelerden geliyor.',
      ),
    ],
  },
  itemSupport: {
    student: 'Cevaplarından en az birinde kendini sık sık hüzünlü hissettiğini ya da kendinden hoşlanmadığını söyledin.',
    parent: 'Çocuğunuz cevaplarından en az birinde kendini sık sık hüzünlü hissettiğini ya da kendinden hoşlanmadığını belirtmiş; bunu onunla konuşmaya değer.',
  },
  itemSplit: {
    kendine_bakis: {
      summary: 'Farklı cevaplar',
      student:
        'Kendine bakışı soran iki cümleye verdiğin cevaplar birbirinden farklı: birinde kendine olumlu, ötekinde olumsuz baktığını söylüyorsun. İki cevabın ortalaması bu farkı gizler; hangisinin seni daha sık anlattığını düşünmek, kendine bakışını daha iyi anlamana yardım edebilir.',
      parent:
        'Çocuğunuzun kendine bakışı soran iki cümleye verdiği cevaplar birbirinden farklı: birinde kendine olumlu, ötekinde olumsuz baktığını belirtiyor. İki cevabın ortalaması bu farkı gizler; kendisi hakkında nasıl konuştuğuna dikkat etmek, hangisinin daha sık olduğunu anlamanıza yardım edebilir.',
    },
    ruh_hali: {
      summary: 'Farklı cevaplar',
      student:
        'Ruh hâlini soran üç cümleye verdiğin cevaplar birbirinden farklı: en az birinde kendini hüzünlü ya da keyifsiz hissettiğini, en az bir başkasında ise bu duyguları seyrek yaşadığını söylüyorsun. Ortalama bu farkı gizleyebilir. Hüzünlü ya da keyifsiz anların sık oluyorsa, bunu yakın olduğun biriyle konuşmak iyi gelebilir.',
      parent:
        'Çocuğunuzun ruh hâlini soran üç cümleye verdiği cevaplar birbirinden farklı: en az birinde kendini hüzünlü ya da keyifsiz hissettiğini, en az bir başkasında ise bu duyguları seyrek yaşadığını belirtiyor. Ortalama bu farkı gizleyebilir. Onunla son zamanlarda nasıl hissettiğini konuşmak, hangisinin daha sık olduğunu anlamanıza yardım edebilir.',
    },
  },
  scales: {
    iyimserlik: {
      high: t(
        'Genel olarak iyimser',
        'On cümleye verdiğin cevaplar genel olarak iyimser ve olumlu. Bu, hiç zorluk yaşamadığın anlamına gelmez. Cevaplarının üç konuya göre dağılımını aşağıdaki satırlarda görebilirsin.',
        'Çocuğunuzun on cümleye verdiği cevaplar genel olarak iyimser ve olumlu. Bu, hiç zorluk yaşamadığı anlamına gelmez. Cevaplarının üç konuya göre dağılımını aşağıdaki satırlarda görebilirsiniz.',
      ),
      average: t(
        'Ne iyimser ne karamsar',
        'On cümleye verdiğin cevaplar ne çok iyimser ne çok karamsar. Bazı konularda daha umutlu, bazılarında daha temkinli cevaplar vermiş olabilirsin; hangi konuda nasıl cevap verdiğini aşağıdaki üç satırda görebilirsin.',
        'Çocuğunuzun on cümleye verdiği cevaplar ne çok iyimser ne çok karamsar. Bazı konularda daha umutlu, bazılarında daha temkinli cevaplar vermiş olabilir; hangi konuda nasıl cevap verdiğini aşağıdaki üç satırda görebilirsiniz.',
      ),
      low: t(
        'Daha çok karamsar',
        'On cümleye verdiğin cevaplar genel olarak karamsar. Böyle hissetmek zor olabilir; ama iyimserlik tamamen sabit bir özellik değildir, zamanla değişebilir. Aşağıdaki üç satır, karamsar cevaplarının daha çok hangi konuda olduğunu gösterir.',
        'Çocuğunuzun on cümleye verdiği cevaplar genel olarak karamsar. Bu bir tanı değildir; onu dinlemek ve bu karamsar bakışın ne zamandır sürdüğünü anlamaya çalışmak iyi bir başlangıç olabilir. Aşağıdaki üç satır, karamsar cevaplarının daha çok hangi konuda olduğunu gösterir.',
        true,
      ),
    },
    gelecek: {
      high: t(
        'Umutlu cevaplar',
        'Hayata ve geleceğe bakışı soran beş cümleye verdiğin cevaplarda umutlu olanlar ağır basıyor.',
        'Çocuğunuzun hayata ve geleceğe bakışı soran beş cümleye verdiği cevaplarda umutlu olanlar ağır basıyor.',
      ),
      average: t(
        'Ne umutlu ne karamsar',
        'Hayata ve geleceğe bakışı soran beş cümleye verdiğin cevaplar ne çok umutlu ne çok karamsar; ortalaması ikisinin arasında.',
        'Çocuğunuzun hayata ve geleceğe bakışı soran beş cümleye verdiği cevaplar ne çok umutlu ne çok karamsar; ortalaması ikisinin arasında.',
      ),
      low: t(
        'Karamsar cevaplar',
        'Hayata ve geleceğe bakışı soran beş cümleye verdiğin cevaplar genel olarak karamsar: geleceğe umutla bakmakta, hayatında bir yön görmekte ya da işlerin iyi tarafını görmekte zorlandığını söylüyorsun.',
        'Çocuğunuzun hayata ve geleceğe bakışı soran beş cümleye verdiği cevaplar genel olarak karamsar: geleceğe umutla bakmakta, hayatında bir yön görmekte ya da işlerin iyi tarafını görmekte zorlandığını belirtiyor.',
        true,
      ),
    },
    kendine_bakis: {
      high: t(
        'Olumlu cevaplar',
        'Kendine bakışı soran iki cümleye verdiğin cevaplar, kendine çoğunlukla olumlu baktığını söylüyor.',
        'Çocuğunuzun kendine bakışı soran iki cümleye verdiği cevaplar, kendine çoğunlukla olumlu baktığını belirtiyor.',
      ),
      average: t(
        'Ne olumlu ne olumsuz',
        'Kendine bakışı soran iki cümleye verdiğin cevaplar ne olumlu ne olumsuz: bu konuda kararsız kalmış olabilirsin ya da kendin hakkındaki düşüncelerin zamana göre değişiyor olabilir.',
        'Çocuğunuzun kendine bakışı soran iki cümleye verdiği cevaplar ne olumlu ne olumsuz: bu konuda kararsız kalmış olabilir ya da kendisi hakkındaki düşünceleri zamana göre değişiyor olabilir.',
      ),
      low: t(
        'Olumsuz cevaplar',
        'Kendine bakışı soran iki cümleye verdiğin cevaplar, kendinle barışık olmadığını ya da kendinden pek hoşlanmadığını söylüyor. Kendine karşı sert olmak yorucu olabilir.',
        'Çocuğunuzun kendine bakışı soran iki cümleye verdiği cevaplar, kendisiyle barışık olmadığını ya da kendinden pek hoşlanmadığını belirtiyor. Kendine karşı sert olmak onu yorabilir; bu konuyu yargılamadan konuşabileceğiniz bir an yaratmak işe yarayabilir.',
        true,
      ),
    },
    ruh_hali: {
      high: t(
        'Çoğunlukla keyifli',
        'Ruh hâlini soran üç cümleye verdiğin cevaplar, kendini genellikle hüzünlü ya da keyifsiz hissetmediğini söylüyor.',
        'Çocuğunuzun ruh hâlini soran üç cümleye verdiği cevaplar, kendini genellikle hüzünlü ya da keyifsiz hissetmediğini belirtiyor.',
      ),
      average: t(
        'Ne keyifli ne keyifsiz',
        'Ruh hâlini soran üç cümleye verdiğin cevaplar ne çok olumlu ne çok olumsuz. Herkes zaman zaman hüzünlü ya da keyifsiz hissedebilir; ruh hâlinin günden güne değişmesi olağandır.',
        'Çocuğunuzun ruh hâlini soran üç cümleye verdiği cevaplar ne çok olumlu ne çok olumsuz. Herkes zaman zaman hüzünlü ya da keyifsiz hissedebilir; ruh hâlinin günden güne değişmesi olağandır.',
      ),
      low: t(
        'Sık sık hüzünlü ya da keyifsiz',
        'Ruh hâlini soran üç cümleye verdiğin cevaplar, kendini sık sık hüzünlü ya da keyifsiz hissettiğini söylüyor. Bu duyguların sevdiğin şeylerden keyif almanı engelleyip engellemediğini fark etmek, ne zaman destek isteyeceğini anlamana yardım eder.',
        'Çocuğunuzun ruh hâlini soran üç cümleye verdiği cevaplar, kendini sık sık hüzünlü ya da keyifsiz hissettiğini belirtiyor. Bu duyguların sevdiği şeylerden keyif almasını engelleyip engellemediğine dikkat etmek iyi olur.',
        true,
      ),
    },
  },
};
