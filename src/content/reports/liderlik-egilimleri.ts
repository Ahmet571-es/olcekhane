import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Liderlik Eğilimleri rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): düşük düzey bir kusur, yüksek düzey bir başarı notu gibi anlatılmaz; hiçbir
 * düzey kişiyi yargılamaz ("lider ruhlu", "doğuştan lider", "pasif", "çekingen biri", "sorumsuz", "tembel" gibi sözcükler
 * kullanılmaz) ve puan liderlik becerisi ya da potansiyeli gibi okunmaz. Sonuç öz bildirime dayandığı için öğrenciye
 * "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır.
 * Metinler yalnızca kendi ölçeğinin maddelerinin sorduğunu anlatır ve aynı sayfadaki öteki kartlarla çelişmez: öne çıkıp yön
 * vermenin kartları topluluk önünde konuşmaktan ve işleri sürdürmekten, sosyal cesaretin kartları yön vermekten, kararlardan ve
 * işleri sürdürmekten, kararlılık ve sorumluluğun kartları yön vermekten ve konuşmaktan söz etmez
 * (tests/liderlik-egilimleri.test.ts denetler). Kartlar tek bir cümlenin cevabını kesin bilgi gibi söylemez; birkaç cümlenin
 * ortak konusunu anlatır. Kartlarda "lider" sözcüğü yalnızca bir araştırmanın bulgusu olarak geçer; "beceri" sözcüğü kartlarda
 * ve kurallarda kullanılmaz (genel bakış yalnızca testin beceri ölçmediğini söyler).
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim kartındadır):
 * liderlikle en tutarlı ilişkili özelliğin dışadönüklük olduğu, sorumluluğun da ilişkili olduğu ve bu ilişkilerin çok güçlü
 * olmadığı (Judge ve ark., 2002); liderliğin yalnızca başkanlık ya da kaptanlık olmadığı (Fransen ve ark., 2014). Üç eğilim
 * genel bakışta anlatıldığı için girişte yinelenmez. Ardından üç eğilimin birleşimine göre en çok bir kural. Kurallar
 * birbirini dışlar: bir eğilim yüksek, öteki düşükken her zaman tam bir kural çıkar; üçü yüksekken başarı notu gibi, üçü
 * düşükken eksiklik gibi anlatılmaz ve bir sonuç vaat edilmez; düşük bir eğilimi anan kuralda "güven" sözü geçmez.
 * Kurallardaki araştırma bilgileri: iş arkadaşlarının orta düzeyde atılgan olanları daha iyi lider olarak görmesi (Ames ve
 * Flynn, 2007); ekip üyeleri girişkenken sakin davranan liderlerin ekiplerinin daha iyi sonuç alması (Grant, Gino ve Hofmann,
 * 2011; ekip edilgenken sonuç tersine döndüğü için genellenmez). Liderlik becerilerinin bir kısmının yetişkinlerde eğitimle
 * öğrenilebilmesi (Lacerenza ve ark., 2017) yalnızca bilim kartındadır; gençlere uygulanmaz.
 * Kartlar okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

const rule = (when: InsightRule['when'], student: string, parent: string, extra: { not?: InsightRule['not'] } = {}): InsightRule => ({
  when,
  ...(extra.not ? { not: extra.not } : {}),
  text: { student, parent },
});

const LEAD_RESEARCH =
  'Araştırmalarda liderlikle en tutarlı ilişkili kişilik özelliği dışadönüklüktür: insanlarla birlikte olmaktan hoşlanma, girişken ve canlı olma eğilimi. Planlı ve özenli olma özelliği olan sorumluluk da ilişkilidir; testteki “Kararlılık ve sorumluluk” buna yakın ama daha dar bir eğilimdir. Yine de bu ilişkiler çok güçlü değildir: kişilik, kimin lider olacağını tek başına belirlemez.';
const LEAD_YOUNG =
  'Liderlik yalnızca sınıf başkanı ya da takım kaptanı olmak değildir; bir gruptaki farklı roller de liderliğin parçasıdır.';
const LEAD_ADULT = 'Liderlik yalnızca yönetici olmak değildir; bir gruptaki farklı roller de liderliğin parçasıdır.';
const LEAD_END = {
  you: 'Testin sonucu senin hakkında kalıcı bir yargı değil, bugünün bir resmidir.',
  parent: 'Testin sonucu çocuğunuz hakkında kalıcı bir yargı değil, bugünün bir resmidir.',
};

export const liderlikEgilimleriReport: ReportTemplate = {
  version: 'liderlik-egilimleri-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır liderlikle ilişkili bir eğilimini gösteriyor; üç eğilim ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar liderlik becerini ya da iyi bir lider olup olmadığını değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
    parent:
      'Her satır çocuğunuzun liderlikle ilişkili bir eğilimini gösterir; üç eğilim ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar çocuğunuzun liderlik becerisini ya da iyi bir lider olup olmadığını değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Birlikte bakınca: liderlik hakkında araştırmaların kısa özeti ve üç eğilimin birlikte ne anlatabileceği',
    lead: [
      {
        when: {},
        text: {
          student: `${LEAD_RESEARCH} ${LEAD_YOUNG} ${LEAD_END.you}`,
          parent: `${LEAD_RESEARCH} ${LEAD_YOUNG} ${LEAD_END.parent}`,
          adult: `${LEAD_RESEARCH} ${LEAD_ADULT} ${LEAD_END.you}`,
        },
      },
    ],
    rules: [
      rule(
        { lead: ['high'], bold: ['high'], purpose: ['high'] },
        'Üç eğilimde de puanın yüksek: bir grupta idareyi ele almaktan hoşlandığını, insanlar arasında rahat olduğunu ve üstlendiğin işleri bitirdiğini söylüyorsun. Üçünün birlikte yüksek olması, her grupta öne çıkman gerektiği anlamına gelmez. Bir araştırmada iş arkadaşları, orta düzeyde atılgan olanları çok fazla atılgan olanlardan daha iyi lider olarak görmüştür.',
        'Çocuğunuzun puanı üç eğilimde de yüksek: bir grupta idareyi ele almaktan hoşlandığını, insanlar arasında rahat olduğunu ve üstlendiği işleri bitirdiğini belirtiyor. Üçünün birlikte yüksek olması, her grupta öne çıkması gerektiği anlamına gelmez. Bir araştırmada iş arkadaşları, orta düzeyde atılgan olanları çok fazla atılgan olanlardan daha iyi lider olarak görmüştür.',
      ),
      rule(
        { lead: ['low'], bold: ['low'], purpose: ['low'] },
        'Üç eğilimde de puanın düşük: şu sıralar bir grupta geri planda kalmayı, yönü başkalarına bırakmayı seçtiğini ve işleri sürdürmekte zorlandığını söylüyorsun. Bu eğilimler birbirinden ayrıdır; birinde küçük bir adım denemek istersen ötekilerini beklemen gerekmez. Sayfanın sonundaki öneriler bunun için birkaç fikir veriyor.',
        'Çocuğunuzun puanı üç eğilimde de düşük: şu sıralar bir grupta geri planda kalmayı, yönü başkalarına bırakmayı seçtiğini ve işleri sürdürmekte zorlandığını belirtiyor. Bu eğilimler birbirinden ayrıdır; çocuğunuz birinde küçük bir adım denemek isterse ötekilerini beklemesi gerekmez. Sayfanın sonundaki öneriler ona nasıl yaklaşabileceğinizi anlatıyor.',
      ),
      rule(
        { lead: ['high'], purpose: ['low'] },
        'Bir grupta idareyi ele almaktan hoşlandığını söylüyorsun; “Kararlılık ve sorumluluk” eğiliminde ise puanın düşük. Yön vermek ile üstlenilen işi bitirmek ayrı eğilimlerdir. Bir işi başlatırken kimin neyi bitireceğini de konuşmak, işin yarım kalmamasına yardım edebilir.',
        'Çocuğunuz bir grupta idareyi ele almaktan hoşlandığını belirtiyor; “Kararlılık ve sorumluluk” eğiliminde ise puanı düşük. Yön vermek ile üstlenilen işi bitirmek ayrı eğilimlerdir. Bir işi başlatırken kimin neyi bitireceğini de konuşması, işin yarım kalmamasına yardım edebilir.',
      ),
      rule(
        { bold: ['high'], purpose: ['low'], lead: ['low', 'average'] },
        'İnsanlar arasında rahat olduğunu ve söz almaktan çekinmediğini söylüyorsun; “Kararlılık ve sorumluluk” eğiliminde ise puanın düşük. Rahat konuşmak ile işleri sürdürmek ayrı eğilimlerdir. Bir grupta söz verdiğin işleri bir yere yazmak, ikisini birleştirmene yardım edebilir.',
        'Çocuğunuz insanlar arasında rahat olduğunu ve söz almaktan çekinmediğini belirtiyor; “Kararlılık ve sorumluluk” eğiliminde ise puanı düşük. Rahat konuşmak ile işleri sürdürmek ayrı eğilimlerdir. Bir grupta söz verdiği işleri bir yere yazması, ikisini birleştirmesine yardım edebilir.',
      ),
      rule(
        { purpose: ['high'], lead: ['low'], bold: ['low'] },
        'Üstlendiğin işleri sonuna götürdüğünü söylüyorsun; “Öne çıkıp yön verme” ve “Sosyal cesaret” eğilimlerinde ise puanın düşük. Bir araştırmada, ekip üyeleri girişkenken sakin davranan liderlerin ekipleri daha iyi sonuç almıştır. Bu liderler, ekibin önerilerine daha açık görülmüştür.',
        'Çocuğunuz üstlendiği işleri sonuna götürdüğünü belirtiyor; “Öne çıkıp yön verme” ve “Sosyal cesaret” eğilimlerinde ise puanı düşük. Bir araştırmada, ekip üyeleri girişkenken sakin davranan liderlerin ekipleri daha iyi sonuç almıştır. Bu liderler, ekibin önerilerine daha açık görülmüştür.',
      ),
      rule(
        { purpose: ['high'], lead: ['low'], bold: ['average', 'high'] },
        'Üstlendiğin işleri sonuna götürdüğünü söylüyorsun; “Öne çıkıp yön verme” eğiliminde ise puanın düşük. Yönü başkalarına bırakmak ile üstlenilen işi bitirmek ayrı şeylerdir. Hazırlıklı ve planlı çalışman, bir gün yön vermek istersen sana dayanak olabilir.',
        'Çocuğunuz üstlendiği işleri sonuna götürdüğünü belirtiyor; “Öne çıkıp yön verme” eğiliminde ise puanı düşük. Yönü başkalarına bırakmak ile üstlenilen işi bitirmek ayrı şeylerdir. Hazırlıklı ve planlı çalışması, bir gün yön vermek isterse ona dayanak olabilir.',
      ),
      rule(
        { purpose: ['high'], bold: ['low'], lead: ['average', 'high'] },
        'Üstlendiğin işleri sonuna götürdüğünü söylüyorsun; “Sosyal cesaret” eğiliminde ise puanın düşük. Bir gruba katkı vermek için her zaman topluluk önünde konuşmak gerekmez. Söz almak istediğinde, söyleyeceklerini önceden birkaç maddeyle not etmek işini kolaylaştırabilir.',
        'Çocuğunuz üstlendiği işleri sonuna götürdüğünü belirtiyor; “Sosyal cesaret” eğiliminde ise puanı düşük. Bir gruba katkı vermek için her zaman topluluk önünde konuşmak gerekmez. Çocuğunuz söz almak istediğinde, söyleyeceklerini önceden birkaç maddeyle not etmesi işini kolaylaştırabilir.',
      ),
      rule(
        { lead: ['high'], bold: ['low'], purpose: ['average'] },
        'Bir grupta yön vermek istediğini söylüyorsun; “Sosyal cesaret” eğiliminde ise puanın düşük. Yön vermek her zaman kalabalık önünde konuşmayı gerektirmez. Küçük bir grupla ya da birebir konuşarak da işleri yönlendirebilirsin.',
        'Çocuğunuz bir grupta yön vermek istediğini belirtiyor; “Sosyal cesaret” eğiliminde ise puanı düşük. Yön vermek her zaman kalabalık önünde konuşmayı gerektirmez. Küçük bir grupla ya da birebir konuşarak da işleri yönlendirebilir.',
      ),
      rule(
        { lead: ['low'], bold: ['high'], purpose: ['average'] },
        'Topluluk içinde rahat olduğunu söylüyorsun; “Öne çıkıp yön verme” eğiliminde ise puanın düşük. Rahat konuşmak ile bir grubu yönlendirmek istemek ayrı eğilimlerdir. Bu rahatlığı, bir grubun fikirlerini başkalarına anlatmak gibi yön vermeyi gerektirmeyen işlerde de kullanabilirsin.',
        'Çocuğunuz topluluk içinde rahat olduğunu belirtiyor; “Öne çıkıp yön verme” eğiliminde ise puanı düşük. Rahat konuşmak ile bir grubu yönlendirmek istemek ayrı eğilimlerdir. Bu rahatlığı, bir grubun fikirlerini başkalarına anlatmak gibi yön vermeyi gerektirmeyen işlerde de kullanabilir.',
      ),
    ],
    fallback: {
      student: 'Üç eğilimi birlikte düşününce ayrıca eklenecek bir şey yok; her eğilimin ayrıntısını aşağıdaki kartlarda görebilirsin.',
      parent: 'Üç eğilimi birlikte düşününce ayrıca eklenecek bir şey yok; her eğilimin ayrıntısı aşağıdaki kartlarda.',
    },
  },
  scales: {
    lead: {
      high: t(
        'Öne çıkıp yön veren',
        'Genel olarak yönü belirleyen ve idareyi üstlenen kişi olmak istediğini söylüyorsun. Bu istek, bir grupta işlerin harekete geçmesine yardım edebilir.',
        'Çocuğunuz genel olarak yönü belirleyen ve idareyi üstlenen kişi olmak istediğini belirtiyor. Bu istek, bir grupta işlerin harekete geçmesine yardım edebilir.',
      ),
      average: t(
        'Duruma göre yön veren',
        'Kimi zaman yönü belirlemeyi üstlendiğini, kimi zaman bunu başkalarına bıraktığını söylüyorsun. Bu seçimde işin türü ve o anki grup belirleyici olabilir.',
        'Çocuğunuz kimi zaman yönü belirlemeyi üstlendiğini, kimi zaman bunu başkalarına bıraktığını belirtiyor. Bu seçimde işin türü ve o anki grup belirleyici olabilir.',
      ),
      low: t(
        'Yönü başkalarına bırakan',
        'Genel olarak yönü belirlemeyi başkalarına bırakmayı tercih ettiğini söylüyorsun. Bir grupta herkesin yön vermesi gerekmez; başkasının önerisini destekleyip işe katkı vermek de grubun işini yürütür.',
        'Çocuğunuz genel olarak yönü belirlemeyi başkalarına bırakmayı tercih ettiğini belirtiyor. Bir grupta herkesin yön vermesi gerekmez; başkasının önerisini destekleyip işe katkı vermek de grubun işini yürütür.',
      ),
    },
    bold: {
      high: t(
        'Topluluk önünde rahat',
        'Genel olarak insanların arasında rahat olduğunu, ilgi odağı olmaktan çekinmediğini ve topluluk önünde konuşabildiğini söylüyorsun. Bu rahatlık bir grupta söz almanı kolaylaştırabilir. Bir araştırmada, küçük gruplarda daha çok konuşan kişi daha sık lider olarak görülmüştür; ama çok konuşmak, iyi liderlik demek değildir.',
        'Çocuğunuz genel olarak insanların arasında rahat olduğunu, ilgi odağı olmaktan çekinmediğini ve topluluk önünde konuşabildiğini belirtiyor. Bu rahatlık bir grupta söz almasını kolaylaştırabilir. Bir araştırmada, küçük gruplarda daha çok konuşan kişi daha sık lider olarak görülmüştür; ama çok konuşmak, iyi liderlik demek değildir.',
      ),
      average: t(
        'Duruma göre söz alan',
        'Bazen rahatça söz aldığını, bazen de geri planda kalmayı seçtiğini söylüyorsun. Bu rahatlık, yanındaki kişilere ve konunun ne kadar tanıdık olduğuna göre değişebilir.',
        'Çocuğunuz bazen rahatça söz aldığını, bazen de geri planda kalmayı seçtiğini belirtiyor. Bu rahatlık, yanındaki kişilere ve konunun ne kadar tanıdık olduğuna göre değişebilir.',
      ),
      low: t(
        'Geri planda kalmayı seven',
        'Genel olarak kalabalıkta geri planda kalmayı tercih ettiğini, ilgi odağı olmaktan ve topluluk önünde konuşmaktan çekindiğini söylüyorsun. Böyle durumlarda rahat olmamak, kişinin söyleyecek değerli bir şeyi olup olmadığını göstermez. Buradaki “cesaret” yalnızca topluluk içindeki rahatlığı anlatır, cesaretin bütününü değil.',
        'Çocuğunuz genel olarak kalabalıkta geri planda kalmayı tercih ettiğini, ilgi odağı olmaktan ve topluluk önünde konuşmaktan çekindiğini belirtiyor. Böyle durumlarda rahat olmamak, kişinin söyleyecek değerli bir şeyi olup olmadığını göstermez. Buradaki “cesaret” yalnızca topluluk içindeki rahatlığı anlatır, çocuğunuzun cesaretinin bütününü değil.',
      ),
    },
    purpose: {
      high: t(
        'Üstlendiğini sonuna götüren',
        'Genel olarak hazırlıklı olduğunu ve üstlendiğin işleri planladığın gibi sonuna götürdüğünü söylüyorsun. Bu eğilim, başkalarının sana bir iş emanet etmesini kolaylaştırabilir.',
        'Çocuğunuz genel olarak hazırlıklı olduğunu ve üstlendiği işleri planladığı gibi sonuna götürdüğünü belirtiyor. Bu eğilim, başkalarının ona bir iş emanet etmesini kolaylaştırabilir.',
      ),
      average: t(
        'İşe göre sürdüren',
        'Bazı işlerde hazırlıklı ve odaklı olduğunu, bazılarında ise işleri sürdürmekte zorlandığını söylüyorsun. İşin ilgini çekmesi ya da ne kadar uzun sürdüğü bu farkı etkileyebilir.',
        'Çocuğunuz bazı işlerde hazırlıklı ve odaklı olduğunu, bazılarında ise işleri sürdürmekte zorlandığını belirtiyor. İşin ilgisini çekmesi ya da ne kadar uzun sürdüğü bu farkı etkileyebilir.',
      ),
      low: t(
        'İşleri sürdürmekte zorlanan',
        'Genel olarak işleri planladığın gibi sürdürmekte ve sonuna götürmekte zorlandığını söylüyorsun. Bu anlatım bir değer yargısı değildir; çalışma düzeni ve alışkanlıklar değiştikçe bu eğilim de değişebilir.',
        'Çocuğunuz genel olarak işleri planladığı gibi sürdürmekte ve sonuna götürmekte zorlandığını belirtiyor. Bu anlatım bir değer yargısı değildir; çalışma düzeni ve alışkanlıklar değiştikçe bu eğilim de değişebilir.',
      ),
    },
  },
};
