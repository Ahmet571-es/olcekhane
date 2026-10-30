import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Merak rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): düşük düzey bir kusur, yüksek düzey bir başarı notu gibi anlatılmaz; hiçbir
 * düzey kişiyi yargılamaz ("ilgisiz", "meraksız", "tutucu", "sıkıcı", "kafası çalışmayan" gibi sözcükler kullanılmaz) ve
 * puan zekâ ya da bilgi gibi okunmaz. Sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ...
 * belirtiyor" dili kullanılır.
 * Metinler yalnızca kendi ölçeğinin maddelerinin sorduğunu anlatır ve aynı sayfadaki öteki kartla çelişmez: bilgi merakının
 * kartları değişiklikten, alışkanlıktan ve yemekten; yenilik merakının kartları okumadan, bilimden, tarihten ve siyasetten söz
 * etmez (tests/merak.test.ts denetler). Kartlar tek bir cümlenin cevabını kesin bilgi gibi söylemez; birkaç cümlenin ortak
 * konusunu anlatır.
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim kartındadır):
 * merakın tanımı, bilgideki bir boşlukla başlaması, birden çok yüzü olması; öğrenci ve veliye merak ile notlar arasındaki
 * küçük ilişki ve okul yıllarında ilginin ortalamada biraz azalması, yetişkine merak anketlerinin sonucunun gerçek bilgi arama
 * davranışıyla her zaman örtüşmemesi (Jach ve ark., 2024). Ardından iki yönün birleşimine göre en çok bir kural. Kurallar birbirini dışlar: bir yön yüksek, öteki
 * düşükken her zaman tam bir kural çıkar. İki yön yüksekken başarı notu gibi, ikisi düşükken eksiklik gibi anlatılmaz ve bir
 * sonuç vaat edilmez.
 * Kartlar okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

const rule = (when: InsightRule['when'], student: string, parent: string): InsightRule => ({ when, text: { student, parent } });

const LEAD_START = {
  you: 'Merak, bilmediğin bir şeyi öğrenme ya da yeni bir şeyi deneme isteğidir; bu test onu iki yönde ayrı ayrı gösterir: bilgi merakı ve yenilik merakı.',
  parent:
    'Merak, kişinin bilmediği bir şeyi öğrenme ya da yeni bir şeyi deneme isteğidir; bu test onu iki yönde ayrı ayrı gösterir: bilgi merakı ve yenilik merakı.',
};
const LEAD_RESEARCH =
  'Etkili bir açıklamaya göre merak, bilgide bir boşluk fark edilince başlar: bir şeyi biraz bilmek, gerisini merak ettirir. Merakın birden çok yüzü vardır; bir yönü yüksek olan birinin öteki yönü düşük olabilir.';
const LEAD_YOUNG =
  'Gençlerle yapılan çalışmalarda merak ile okul notları arasında küçük bir ilişki bulunmuştur; bu, meraklı olmanın tek başına notları belirlediği anlamına gelmez. Okul yılları boyunca ilgi ve içten gelen istek ortalamada biraz azalır.';
const LEAD_ADULT =
  'Merak anketlerinin sonucu, insanların gerçekte nasıl bilgi aradığıyla her zaman örtüşmez. Merak konuya ve duruma göre de farklılaşır.';
const LEAD_END = {
  you: 'Senin sonucun da kalıcı bir yargı değil, bugünün bir resmidir.',
  parent: 'Çocuğunuzun sonucu da kalıcı bir yargı değil, bugünün bir resmidir.',
};

export const merakReport: ReportTemplate = {
  version: 'merak-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır merakının bir yönünü gösteriyor; iki yön ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar ne kadar zeki ya da bilgili olduğunu değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
    parent:
      'Her satır çocuğunuzun merakının bir yönünü gösterir; iki yön ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar çocuğunuzun ne kadar zeki ya da bilgili olduğunu değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Birlikte bakınca: merak hakkında araştırmaların kısa özeti ve iki yönün birlikte ne anlatabileceği',
    lead: [
      {
        when: {},
        text: {
          student: `${LEAD_START.you} ${LEAD_RESEARCH} ${LEAD_YOUNG} ${LEAD_END.you}`,
          parent: `${LEAD_START.parent} ${LEAD_RESEARCH} ${LEAD_YOUNG} ${LEAD_END.parent}`,
          adult: `${LEAD_START.you} ${LEAD_RESEARCH} ${LEAD_ADULT} ${LEAD_END.you}`,
        },
      },
    ],
    rules: [
      rule(
        { knowledge: ['high'], novelty: ['high'] },
        'İki yönde de puanın yüksek: hem yeni bilgiler öğrenmeye hem de yeni deneyimlere ve değişikliğe ilgi duyduğunu söylüyorsun. Bu iki merak birbirini besleyebilir: gittiğin yeni bir yer aklına yeni sorular getirebilir, öğrendiğin bir bilgi de denemek istediğin bir şeye dönüşebilir. Merakın pek çok yöne açıldığında hangi soruların peşine düşeceğini seçmek de işine yarayabilir.',
        'Çocuğunuzun puanı iki yönde de yüksek: hem yeni bilgiler öğrenmeye hem de yeni deneyimlere ve değişikliğe ilgi duyduğunu belirtiyor. Bu iki merak birbirini besleyebilir: gittiği yeni bir yer aklına yeni sorular getirebilir, öğrendiği bir bilgi de denemek istediği bir şeye dönüşebilir. Merakı pek çok yöne açıldığında hangi soruların peşine düşeceğini seçmek de işine yarayabilir.',
      ),
      rule(
        { knowledge: ['high'], novelty: ['low'] },
        'Yeni bilgiler öğrenmeye ilgi duyduğunu söylüyorsun; “Yenilik merakı” yönünde ise puanın düşük. Bu iki yön birbirinden ayrıdır: bir konuyu derinlemesine merak eden biri günlük hayatında alıştığı düzeni sevebilir. Merakını tanıdık bir düzenin içinde sürdürmek, örneğin her akşam ilgini çeken bir konuya kısa bir zaman ayırmak sana uygun gelebilir.',
        'Çocuğunuz yeni bilgiler öğrenmeye ilgi duyduğunu belirtiyor; “Yenilik merakı” yönünde ise puanı düşük. Bu iki yön birbirinden ayrıdır: bir konuyu derinlemesine merak eden biri günlük hayatında alıştığı düzeni sevebilir. Merakını tanıdık bir düzenin içinde sürdürmek, örneğin her akşam ilgisini çeken bir konuya kısa bir zaman ayırmak ona uygun gelebilir.',
      ),
      rule(
        { knowledge: ['low'], novelty: ['high'] },
        'Yeni deneyimlerden ve değişiklikten hoşlandığını söylüyorsun; “Bilgi merakı” yönünde ise puanın düşük. Yeni şeyler denemek ile bir konuyu derinlemesine öğrenmek istemek ayrı şeylerdir. Denediğin yeni bir şey hakkında tek bir soru sormak (“Bu nasıl çalışıyor?” gibi), yenilik merakını bilgi merakına bağlamanın bir yolu olabilir.',
        'Çocuğunuz yeni deneyimlerden ve değişiklikten hoşlandığını belirtiyor; “Bilgi merakı” yönünde ise puanı düşük. Yeni şeyler denemek ile bir konuyu derinlemesine öğrenmek istemek ayrı şeylerdir. Denediği yeni bir şey hakkında tek bir soru sormak (“Bu nasıl çalışıyor?” gibi), onun yenilik merakını bilgi merakına bağlamanın bir yolu olabilir.',
      ),
      rule(
        { knowledge: ['low'], novelty: ['low'] },
        'İki yönde de puanın düşük: şu sıralar yeni bilgilere de yeni deneyimlere de pek yönelmediğini söylüyorsun. Aşağıdaki kartlar iki yönü tek tek anlatıyor; sayfanın sonundaki öneriler de küçük başlangıç noktaları sunuyor.',
        'Çocuğunuzun puanı iki yönde de düşük: şu sıralar yeni bilgilere de yeni deneyimlere de pek yönelmediğini belirtiyor. Bu sonucu onu daha iyi tanımak için bir başlangıç olarak ele alabilirsiniz; sayfanın sonundaki öneriler ona nasıl yaklaşabileceğinizi anlatıyor.',
      ),
    ],
    fallback: {
      student: 'İki yönü birlikte düşününce ayrıca eklenecek bir şey yok; her yönün ayrıntısını aşağıdaki kartlarda görebilirsin.',
      parent: 'İki yönü birlikte düşününce ayrıca eklenecek bir şey yok; her yönün ayrıntısı aşağıdaki kartlarda.',
    },
  },
  scales: {
    knowledge: {
      high: t(
        'Bilgi peşine düşen',
        'Genel olarak yeni bilgiler öğrenmeye ilgi duyduğunu söylüyorsun. Bilim ya da toplumsal konular gibi alanlar ve anlamak için kafa yormayı gerektiren işler sana çekici geliyor. Bu ilgi, merak ettiğin bir soruyu kendi başına araştırmayı sana keyifli kılabilir.',
        'Çocuğunuz genel olarak yeni bilgiler öğrenmeye ilgi duyduğunu belirtiyor. Bilim ya da toplumsal konular gibi alanlar ve anlamak için kafa yormayı gerektiren işler ona çekici geliyor. Bu ilgi, merak ettiği bir soruyu kendi başına araştırmayı ona keyifli kılabilir.',
      ),
      average: t(
        'Konuya göre meraklanan',
        'Bazı konularda yeni şeyler öğrenmeye merak duyduğunu, bazılarına ise pek ilgi duymadığını söylüyorsun. Bu çok olağandır: çoğu insan ilgi duyduğu konularda ayrıntıya iner, ötekilerde temel bilgiyle yetinir.',
        'Çocuğunuz bazı konularda yeni şeyler öğrenmeye merak duyduğunu, bazılarına ise pek ilgi duymadığını belirtiyor. Bu çok olağandır: çoğu insan ilgi duyduğu konularda ayrıntıya iner, ötekilerde temel bilgiyle yetinir.',
      ),
      low: t(
        'Bilgi peşine pek düşmeyen',
        'Genel olarak bilim ya da toplumsal konular gibi alanlara pek ilgi duymadığını ve kafa yoran işlerden uzak durduğunu söylüyorsun. Bu sonuç bir değer yargısı değildir ve zekâyı göstermez; ilgi duyulan bir alandan gelen bir soru da bilgi merakını uyandırabilir.',
        'Çocuğunuz genel olarak bilim ya da toplumsal konular gibi alanlara pek ilgi duymadığını ve kafa yoran işlerden uzak durduğunu belirtiyor. Bu sonuç bir değer yargısı değildir ve zekâyı göstermez; ilgi duyulan bir alandan gelen bir soru da bilgi merakını uyandırabilir.',
      ),
    },
    novelty: {
      high: t(
        'Yeniyi ve değişikliği seven',
        'Genel olarak çeşitlilikten, yeni şeyler denemekten ve değişiklikten hoşlandığını söylüyorsun. Alıştığın yolların dışına çıkmak sana çoğu zaman yorucu değil, canlandırıcı gelebilir.',
        'Çocuğunuz genel olarak çeşitlilikten, yeni şeyler denemekten ve değişiklikten hoşlandığını belirtiyor. Alıştığı yolların dışına çıkmak ona çoğu zaman yorucu değil, canlandırıcı gelebilir.',
      ),
      average: t(
        'Yeniyle alışılmış arasında',
        'Bazı durumlarda yeni şeyleri denemekten, bazılarında ise alıştığın düzeni sürdürmekten hoşlandığını söylüyorsun. Pek çok insan hayatının bazı alanlarında yenilik arar, bazılarında bildiği yolu seçer.',
        'Çocuğunuz bazı durumlarda yeni şeyleri denemekten, bazılarında ise alıştığı düzeni sürdürmekten hoşlandığını belirtiyor. Pek çok insan hayatının bazı alanlarında yenilik arar, bazılarında bildiği yolu seçer.',
      ),
      low: t(
        'Alıştığı düzeni seven',
        'Genel olarak alıştığın düzeni ve bildiğin şeyleri sürdürmeyi tercih ettiğini, değişiklikten pek hoşlanmadığını söylüyorsun. Alışkanlıklar günlük hayatı öngörülebilir ve rahat kılar; birçok insan için bildiği yolu sürdürmek bir güven kaynağıdır.',
        'Çocuğunuz genel olarak alıştığı düzeni ve bildiği şeyleri sürdürmeyi tercih ettiğini, değişiklikten pek hoşlanmadığını belirtiyor. Alışkanlıklar günlük hayatı öngörülebilir ve rahat kılar; birçok insan için bildiği yolu sürdürmek bir güven kaynağıdır.',
      ),
    },
  },
};
