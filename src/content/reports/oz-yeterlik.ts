import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Öz-yeterlik: Kendine Güven rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): düşük düzey bir kusur, yüksek düzey bir başarı notu gibi anlatılmaz; hiçbir
 * düzey kişiyi yargılamaz ("özgüvensiz", "yetersiz", "başarısız", "utangaç", "ezik" gibi sözcükler kullanılmaz). Sonuç öz
 * bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır. Rapor, kişinin
 * gerçekte ne kadar başarılı olduğunu değil, kendine ne kadar güvendiğini anlatır.
 * Metinler yalnızca kendi ölçeğinin maddelerinin sorduğunu anlatır ve aynı sayfadaki öteki kartlarla çelişmez:
 *  - İşlerdeki güvenin kartları insanlardan ve duygulardan, insanlar arasındaki güvenin kartları işlerden ve zorluklardan,
 *    zor anlardaki güvenin kartları insanların arasında olmaktan söz etmez (tests/oz-yeterlik.test.ts denetler).
 *  - "Hızlı düşünürüm" maddesi zor anlardaki güvenin ölçeğindedir (kaynakta öyle); kartlar hızdan söz etmez.
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim
 * kartındadır); ardından ölçeklerin birleşimine göre en çok bir kural. Kurallar birbirini dışlar: bir alan yüksek, öteki
 * düşükken her zaman tam bir kural çıkar. Üç alan yüksekken başarı notu gibi, üçü düşükken eksiklik gibi anlatılmaz ve bir
 * sonuç vaat edilmez.
 * Destek kutusu: "Zor anlarda kendine güven" düşükse ya da "Sık sık moralim bozuk olur" cümlesine "Oldukça doğru" ya da
 * "Tamamen doğru" denirse gösterilir (`itemSupport` kutunun nedenini söyler).
 * Kartlar okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır. Yalnızca "güvendiğin bir
 * yetişkin" diyen kart ve okul araştırmalarını anan giriş paragrafı yetişkine ayrı yazılır. Giriş, araştırmaların okul
 * başarısıyla ilgili olduğunu ve en güçlü kaynağın "çoğu zaman" başarı deneyimi olduğunu söyler (kaynaktaki kayıtla).
 */
const t = (summary: string, student: string, parent: string, extra: { adult?: string; support?: boolean } = {}): BandText => ({
  summary,
  student,
  parent,
  ...(extra.adult ? { adult: extra.adult } : {}),
  tipsStudent: [],
  tipsParent: [],
  ...(extra.support ? { support: true } : {}),
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

const LEAD_START = {
  you: 'Öz-yeterlik, bir işi başarabileceğine olan güvendir: “Bunu yapabilir miyim?” sorusuna verdiğin cevap.',
  parent: 'Öz-yeterlik, bir işi başarabileceğine olan güvendir: “Bunu yapabilir miyim?” sorusuna verilen cevap.',
};
const LEAD_MIDDLE =
  'Kendini değerli görmekle (öz-saygı) ilişkilidir ama aynı şey değildir. Kendine güven alandan alana değişebilir; bu yüzden test onu üç alanda ayrı ayrı gösterir.';
/** Araştırmalar okul başarısıyla ilgilidir (bilim kartı); yetişkine "okul" denmez. */
const leadResearch = (field: string) =>
  `${field} ilgili araştırmalarda kendine güven ile başarı arasında bir ilişki bulunmuştur. Bu araştırmaları birleştiren bir incelemede iki yön karşılaştırılmıştır: başarının sonraki güvene etkisi, güvenin sonraki başarıya etkisinden büyük çıkmıştır. Yani insan bir işi başardıkça o işte kendine daha çok güvenebilir. Bu araştırmalarda kendine güveni çoğu zaman en çok besleyen de bir işi kendisi başarma deneyimidir.`;
const LEAD_END = {
  you: 'Kendine güvenmek bir işi iyi yapmayı tek başına sağlamaz; kendine pek güvenmemek de o işi yapamayacağın anlamına gelmez.',
  parent: 'Kendine güvenmek bir işi iyi yapmayı tek başına sağlamaz; kendine pek güvenmemek de o işi yapamayacağı anlamına gelmez.',
};
const SCHOOL_RESEARCH = leadResearch('Okul başarısıyla');
const ADULT_RESEARCH = leadResearch('Öğrenme ve başarıyla');

export const ozYeterlikReport: ReportTemplate = {
  version: 'oz-yeterlik-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır kendine güvenin bir alanını gösteriyor; üç alan ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar ne kadar başarılı olduğunu değil, kendine ne kadar güvendiğini gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
    parent:
      'Her satır çocuğunuzun kendine güveninin bir alanını gösterir; üç alan ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar çocuğunuzun ne kadar başarılı olduğunu değil, kendine ne kadar güvendiğini gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
  },
  itemSupport: {
    student: '“Sık sık moralim bozuk olur.” cümlesinin seni anlattığını söyledin. Bu duygu bir süredir sürüyorsa aşağıdakiler işine yarayabilir.',
    parent:
      'Çocuğunuz “Sık sık moralim bozuk olur.” cümlesinin onu anlattığını belirtmiş. Bu duygu bir süredir devam ediyorsa aşağıdaki yollardan destek alabilirsiniz.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Birlikte bakınca: kendine güven hakkında araştırmaların kısa özeti ve üç alanın birlikte ne anlatabileceği',
    lead: [
      {
        when: {},
        text: {
          student: `${LEAD_START.you} ${LEAD_MIDDLE} ${SCHOOL_RESEARCH} ${LEAD_END.you}`,
          parent: `${LEAD_START.parent} ${LEAD_MIDDLE} ${SCHOOL_RESEARCH} ${LEAD_END.parent}`,
          adult: `${LEAD_START.you} ${LEAD_MIDDLE} ${ADULT_RESEARCH} ${LEAD_END.you}`,
        },
      },
    ],
    rules: [
      rule(
        { tasks: ['high'], social: ['high'], coping: ['high'] },
        'Üç alanda da puanın yüksek: işlerde, insanlar arasında ve zor anlarda kendine güvendiğini söylüyorsun. Bu üç alan birbirini destekleyebilir: yeni bir ortama girerken hem yapılacak işe hem insanlara hem de çıkabilecek aksiliklere hazır hissedebilirsin.',
        'Çocuğunuzun puanı üç alanda da yüksek: işlerde, insanlar arasında ve zor anlarda kendine güvendiğini belirtiyor. Bu üç alan birbirini destekleyebilir: yeni bir ortama girerken hem yapılacak işe hem insanlara hem de çıkabilecek aksiliklere hazır hissedebilir.',
      ),
      rule(
        { tasks: ['high'], social: ['low'] },
        'İşlerde kendine güvendiğini söylüyorsun; “İnsanlar arasında kendine güven” alanında ise puanın düşük. Bir işi başarabileceğine güvenmek ile kalabalıkta rahat olmak ayrı şeylerdir. İşlerde kendine güvenmen, insanlar arasında küçük adımlar atarken sana dayanak olabilir.',
        'Çocuğunuz işlerde kendine güvendiğini belirtiyor; “İnsanlar arasında kendine güven” alanında ise puanı düşük. Bir işi başarabileceğine güvenmek ile kalabalıkta rahat olmak ayrı şeylerdir. İşlerdeki güveni, insanlar arasında küçük adımlar atarken ona dayanak olabilir.',
        { not: { coping: ['low'] } },
      ),
      rule(
        { tasks: ['high'], social: ['low'], coping: ['low'] },
        'İşlerde kendine güvendiğini söylüyorsun; “İnsanlar arasında” ve “Zor anlarda” kendine güven alanlarında ise puanın düşük. Bir işi yapabileceğine güvenen biri de kalabalıkta sessiz kalabilir, beklenmedik bir aksilikte bunalabilir. Bunaldığın anlarda daha önce başardığın işleri hatırlamak işine yarayabilir.',
        'Çocuğunuz işlerde kendine güvendiğini belirtiyor; “İnsanlar arasında” ve “Zor anlarda” kendine güven alanlarında ise puanı düşük. Bir işi yapabileceğine güvenen biri de kalabalıkta sessiz kalabilir, beklenmedik bir aksilikte bunalabilir. İşlerdeki güveni, bunaldığı anlarda ona bir dayanak olabilir.',
      ),
      rule(
        { social: ['high'], tasks: ['low'] },
        'İnsanların arasında rahat olduğunu söylüyorsun; “İşlerde kendine güven” alanında ise puanın düşük. İnsanlarla rahatça konuşabilmek ile bir işi başarabileceğine güvenmek her zaman birlikte gitmez. İnsanlar arasındaki rahatlığın, bir işte takıldığında yardım istemeyi ya da birlikte çalışmayı sana kolaylaştırabilir.',
        'Çocuğunuz insanların arasında rahat olduğunu belirtiyor; “İşlerde kendine güven” alanında ise puanı düşük. İnsanlarla rahatça konuşabilmek ile bir işi başarabileceğine güvenmek her zaman birlikte gitmez. İnsanlar arasındaki rahatlığı, bir işte takıldığında yardım istemeyi ya da birlikte çalışmayı ona kolaylaştırabilir.',
        { not: { coping: ['low'] } },
      ),
      rule(
        { social: ['high'], tasks: ['low'], coping: ['low'] },
        'İnsanların arasında rahat olduğunu söylüyorsun; “İşlerde” ve “Zor anlarda” kendine güven alanlarında ise puanın düşük. İnsanlarla rahat konuşabilen biri de bir işte ya da beklenmedik bir aksilikte kendinden şüphe edebilir. Zorlandığında, insanlar arasında rahat olman yardım istemeni kolaylaştırabilir.',
        'Çocuğunuz insanların arasında rahat olduğunu belirtiyor; “İşlerde” ve “Zor anlarda” kendine güven alanlarında ise puanı düşük. İnsanlarla rahat konuşabilen biri de bir işte ya da beklenmedik bir aksilikte kendinden şüphe edebilir. Zorlandığında, insanlar arasında rahat olması yardım istemesini kolaylaştırabilir.',
      ),
      rule(
        { coping: ['low'], tasks: ['high', 'average'], social: ['high', 'average'] },
        'Zor anlarda kolayca bunaldığını söylüyorsun; öteki alanlarda ise puanın daha yüksek. Bir işi yapabileceğine güvenen ya da insanlar arasında rahat olan biri de beklenmedik bir aksilik karşısında bunalabilir. Zorlandığın anlarda, öteki alanlarda nelerin iyi gittiğini hatırlamak işine yarayabilir.',
        'Çocuğunuz zor anlarda kolayca bunaldığını belirtiyor; öteki alanlarda ise puanı daha yüksek. Bir işi yapabileceğine güvenen ya da insanlar arasında rahat olan biri de beklenmedik bir aksilik karşısında bunalabilir. Öteki alanlardaki güveni, zor anlarda ona bir dayanak olabilir.',
        { not: { tasks: ['average'], social: ['average'] } },
      ),
      rule(
        { coping: ['high'], tasks: ['low', 'average'], social: ['low', 'average'] },
        'Zor anlarda kendine güvendiğini söylüyorsun; öteki alanlarda ise puanın daha düşük. Aksilikleri atlatabileceğine güvenmen, bir işte zorlandığında ya da yeni insanlarla tanışırken çekinmeden bir kez daha denemene yardım edebilir.',
        'Çocuğunuz zor anlarda kendine güvendiğini belirtiyor; öteki alanlarda ise puanı daha düşük. Aksilikleri atlatabileceğine güvenmesi, bir işte zorlandığında ya da yeni insanlarla tanışırken çekinmeden bir kez daha denemesine yardım edebilir.',
        { not: { tasks: ['average'], social: ['average'] } },
      ),
      rule(
        { tasks: ['low'], social: ['low'], coping: ['low'] },
        'Üç alanda da puanın düşük: işlerde, insanlar arasında ve zor anlarda kendine pek güvenmediğini söylüyorsun. Bu sonuç bugünkü bakışını yansıtır ve zamanla değişebilir; aşağıdaki kartlar her alanı ayrı ayrı anlatıyor.',
        'Çocuğunuzun puanı üç alanda da düşük: işlerde, insanlar arasında ve zor anlarda kendine pek güvenmediğini belirtiyor. Bu sonuç onun bugünkü bakışını yansıtır ve zamanla değişebilir; bunu bir eksiklik gibi değil, onu tanımak için bir başlangıç olarak ele alabilirsiniz.',
      ),
    ],
    fallback: {
      student: 'Üç alanı birlikte düşününce ayrıca eklenecek bir şey yok; her alanın ayrıntısını aşağıdaki kartlarda görebilirsin.',
      parent: 'Üç alanı birlikte düşününce ayrıca eklenecek bir şey yok; her alanın ayrıntısı aşağıdaki kartlarda.',
    },
  },
  scales: {
    tasks: {
      high: t(
        'İşlerde kendinden emin',
        'Genel olarak üstlendiğin işleri başarıyla tamamlayabileceğine, iyi çözümler bulabileceğine ve işleri nasıl yoluna koyacağını bildiğine güvendiğini söylüyorsun. Bu güven, zor bir işe girişmeyi ve takıldığında devam etmeyi kolaylaştırabilir.',
        'Çocuğunuz genel olarak üstlendiği işleri başarıyla tamamlayabileceğine, iyi çözümler bulabileceğine ve işleri nasıl yoluna koyacağını bildiğine güvendiğini belirtiyor. Bu güven, zor bir işe girişmeyi ve takıldığında devam etmeyi ona kolaylaştırabilir.',
      ),
      average: t(
        'Bazı işlerde emin, bazılarında değil',
        'Bazı işlerde kendinden emin olduğunu, bazılarında ise yapabileceğinden pek emin olmadığını söylüyorsun. Bu çok olağandır: kişi bir işte kendine güvenip başka bir işte güvenmeyebilir.',
        'Çocuğunuz bazı işlerde kendinden emin olduğunu, bazılarında ise yapabileceğinden pek emin olmadığını belirtiyor. Bu çok olağandır: kişi bir işte kendine güvenip başka bir işte güvenmeyebilir.',
      ),
      low: t(
        'İşlerde kendinden pek emin olmayan',
        'Genel olarak işleri başarıyla yapabileceğinden pek emin olmadığını, durumları yanlış değerlendirebileceğini ve katkı sağlayabileceğin pek bir şey olmadığını düşündüğünü söylüyorsun. Bu sonuç bir yetenek ölçümü değildir; kendine bugün nasıl baktığını gösterir ve zamanla değişebilir.',
        'Çocuğunuz genel olarak işleri başarıyla yapabileceğinden pek emin olmadığını, durumları yanlış değerlendirebileceğini ve katkı sağlayabileceği pek bir şey olmadığını düşündüğünü belirtiyor. Bu sonuç bir yetenek ölçümü değildir; kendine bugün nasıl baktığını gösterir ve zamanla değişebilir.',
      ),
    },
    social: {
      high: t(
        'İnsanlar arasında rahat ve kendinden emin',
        'Genel olarak insanların arasında rahat olduğunu, kendini kolayca ifade ettiğini, hazırlıksız konuşabildiğini ve ilgi odağı olmaktan çekinmediğini söylüyorsun. Bu rahatlık, yeni insanlarla tanışmayı ve bir toplulukta fikrini söylemeyi kolaylaştırabilir.',
        'Çocuğunuz genel olarak insanların arasında rahat olduğunu, kendini kolayca ifade ettiğini, hazırlıksız konuşabildiğini ve ilgi odağı olmaktan çekinmediğini belirtiyor. Bu rahatlık, yeni insanlarla tanışmayı ve bir toplulukta fikrini söylemeyi ona kolaylaştırabilir.',
      ),
      average: t(
        'Ortama göre rahat',
        'Bazı ortamlarda insanların arasında rahat olduğunu, bazılarında ise daha sessiz kaldığını söylüyorsun; bu, kiminle ve nerede olduğuna göre değişebilir.',
        'Çocuğunuz bazı ortamlarda insanların arasında rahat olduğunu, bazılarında ise daha sessiz kaldığını belirtiyor; bu, kiminle ve nerede olduğuna göre değişebilir.',
      ),
      low: t(
        'İnsanlar arasında sessiz ve temkinli',
        'Genel olarak insanların arasında kendini pek rahat hissetmediğini, ilgi odağı olmaktan hoşlanmadığını ve hazırlıksız konuşmanın sana kolay gelmediğini söylüyorsun. Bu, söyleyecek değerli bir şeyin olmadığı anlamına gelmez: bazı insanlar kalabalıkta sessiz kalır, birebir konuşmalarda ise rahattır.',
        'Çocuğunuz genel olarak insanların arasında kendini pek rahat hissetmediğini, ilgi odağı olmaktan hoşlanmadığını ve hazırlıksız konuşmanın ona kolay gelmediğini belirtiyor. Bu, söyleyecek değerli bir şeyi olmadığı anlamına gelmez: bazı insanlar kalabalıkta sessiz kalır, birebir konuşmalarda ise rahattır.',
      ),
    },
    coping: {
      high: t(
        'Zor anlarda kendinden emin',
        'Genel olarak aksilikleri kolayca atlattığını ve olaylar karşısında kolay kolay bunalmadığını söylüyorsun. Karşılaştığın zorluklarla baş edebileceğine ve aynı anda birçok şeyi idare edebileceğine güvendiğini de söylüyorsun. Bu güven, zor dönemlerde sakin kalmana yardım edebilir. Çok zorlandığında yardım istemek de bu güvenle çelişmez.',
        'Çocuğunuz genel olarak aksilikleri kolayca atlattığını ve olaylar karşısında kolay kolay bunalmadığını belirtiyor. Karşılaştığı zorluklarla baş edebileceğine ve aynı anda birçok şeyi idare edebileceğine güvendiğini de söylüyor. Bu güven, zor dönemlerde sakin kalmasına yardım edebilir.',
      ),
      average: t(
        'Zorluğa göre değişen',
        'Bazı zorlukları kolayca atlattığını, bazılarının ise seni bunaltabildiğini söylüyorsun; bu, olayın ne kadar büyük olduğuna ve o sıradaki durumuna göre değişebilir. Birçok insan böyledir.',
        'Çocuğunuz bazı zorlukları kolayca atlattığını, bazılarının ise onu bunaltabildiğini belirtiyor; bu, olayın ne kadar büyük olduğuna ve o sıradaki durumuna göre değişebilir. Birçok insan böyledir.',
      ),
      low: t(
        'Zor anlarda kolay bunalan',
        'Genel olarak yaşadığın olaylar karşısında kolayca bunaldığını, karşılaştığın zorluklarla baş edemeyeceğini hissettiğini ve birçok şeyden korktuğunu söylüyorsun. Bu duygular yorucu olabilir; zamanla ve destekle değişebilir. Seni zorluyorsa güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz genel olarak yaşadığı olaylar karşısında kolayca bunaldığını, karşılaştığı zorluklarla baş edemeyeceğini hissettiğini ve birçok şeyden korktuğunu belirtiyor. Bu sonuç bir tanı değildir; ancak bu duyguların ne kadar süredir devam ettiğini ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir.',
        {
          support: true,
          adult:
            'Genel olarak yaşadığın olaylar karşısında kolayca bunaldığını, karşılaştığın zorluklarla baş edemeyeceğini hissettiğini ve birçok şeyden korktuğunu söylüyorsun. Bu duygular yorucu olabilir; zamanla ve destekle değişebilir. Seni zorluyorsa güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
    },
  },
};
