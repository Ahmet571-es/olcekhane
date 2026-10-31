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
 * (tests/liderlik-egilimleri.test.ts denetler).
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim kartındadır):
 * testin üç eğilimi; liderlikle en tutarlı ilişkili özelliğin dışadönüklük olduğu, sorumluluğun da ilişkili olduğu ve bu
 * ilişkilerin orta büyüklükte olduğu (Judge ve ark., 2002); liderliğin yalnızca başkanlık ya da kaptanlık olmadığı (Fransen ve
 * ark., 2014). Ardından üç eğilimin birleşimine göre en çok bir kural. Kurallar birbirini dışlar: bir eğilim yüksek, öteki
 * düşükken her zaman tam bir kural çıkar; üçü yüksekken başarı notu gibi, üçü düşükken eksiklik gibi anlatılmaz ve bir sonuç
 * vaat edilmez. Kurallardaki araştırma bilgileri: atılganlığın orta düzeyinin daha iyi değerlendirilmesi (Ames ve Flynn,
 * 2007), liderlik becerilerinin bir kısmının öğrenilebilmesi (Lacerenza ve ark., 2017), içedönük liderlerin girişken ekiplerle
 * iyi sonuç alması (Grant, Gino ve Hofmann, 2011).
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

const LEAD_START =
  'Bu test, araştırmalarda liderlikle ilişkili bulunan üç kişilik eğilimini ayrı ayrı gösterir: “Öne çıkıp yön verme”, “Sosyal cesaret” ve “Kararlılık ve sorumluluk”.';
const LEAD_RESEARCH =
  'Araştırmalarda liderlikle en tutarlı ilişkili kişilik özelliği dışadönüklüktür; sorumluluk da ilişkilidir. Ama bu ilişkiler orta büyüklüktedir: kişilik, kimin lider olacağını tek başına belirlemez.';
const LEAD_YOUNG =
  'Liderlik yalnızca sınıf başkanı ya da takım kaptanı olmak değildir; bir gruptaki farklı roller de liderliğin parçasıdır.';
const LEAD_ADULT = 'Liderlik yalnızca yönetici olmak değildir; bir gruptaki farklı roller de liderliğin parçasıdır.';
const LEAD_END = {
  you: 'Bu sonuç senin hakkında kalıcı bir yargı değil, bugünün bir resmidir.',
  parent: 'Bu sonuç çocuğunuz hakkında kalıcı bir yargı değil, bugünün bir resmidir.',
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
          student: `${LEAD_START} ${LEAD_RESEARCH} ${LEAD_YOUNG} ${LEAD_END.you}`,
          parent: `${LEAD_START} ${LEAD_RESEARCH} ${LEAD_YOUNG} ${LEAD_END.parent}`,
          adult: `${LEAD_START} ${LEAD_RESEARCH} ${LEAD_ADULT} ${LEAD_END.you}`,
        },
      },
    ],
    rules: [
      rule(
        { lead: ['high'], bold: ['high'], purpose: ['high'] },
        'Üç eğilimde de puanın yüksek: bir grupta idareyi ele almaktan hoşlandığını, insanlar arasında rahat olduğunu ve üstlendiğin işleri bitirdiğini söylüyorsun. Bu eğilimler bir işi başlatıp sonuna götürmeyi kolaylaştırabilir. Araştırmalarda atılganlığın orta düzeyi, çok fazlasından daha iyi değerlendirilmiştir; ne zaman geri durman gerektiğini fark etmek de işine yarayabilir.',
        'Çocuğunuzun puanı üç eğilimde de yüksek: bir grupta idareyi ele almaktan hoşlandığını, insanlar arasında rahat olduğunu ve üstlendiği işleri bitirdiğini belirtiyor. Bu eğilimler bir işi başlatıp sonuna götürmeyi kolaylaştırabilir. Araştırmalarda atılganlığın orta düzeyi, çok fazlasından daha iyi değerlendirilmiştir; ne zaman geri durması gerektiğini fark etmek de ona yardım edebilir.',
      ),
      rule(
        { lead: ['low'], bold: ['low'], purpose: ['low'] },
        'Üç eğilimde de puanın düşük: şu sıralar bir grupta geri planda kalmayı, yönü başkalarına bırakmayı seçtiğini ve işleri sürdürmekte zorlandığını söylüyorsun. Araştırmalara göre liderlik becerilerinin bir kısmı sonradan öğrenilebilir. Sayfanın sonundaki öneriler küçük başlangıç noktaları sunuyor.',
        'Çocuğunuzun puanı üç eğilimde de düşük: şu sıralar bir grupta geri planda kalmayı, yönü başkalarına bırakmayı seçtiğini ve işleri sürdürmekte zorlandığını belirtiyor. Araştırmalara göre liderlik becerilerinin bir kısmı sonradan öğrenilebilir. Sayfanın sonundaki öneriler ona nasıl yaklaşabileceğinizi anlatıyor.',
      ),
      rule(
        { lead: ['high'], purpose: ['low'] },
        'Bir grupta idareyi ele almaktan hoşlandığını söylüyorsun; “Kararlılık ve sorumluluk” eğiliminde ise puanın düşük. Yön vermek ile üstlenilen işi bitirmek ayrı şeylerdir. İkisi bir araya geldiğinde, başkalarının sana güvenmesi kolaylaşabilir.',
        'Çocuğunuz bir grupta idareyi ele almaktan hoşlandığını belirtiyor; “Kararlılık ve sorumluluk” eğiliminde ise puanı düşük. Yön vermek ile üstlenilen işi bitirmek ayrı şeylerdir. İkisi bir araya geldiğinde, başkalarının ona güvenmesi kolaylaşabilir.',
      ),
      rule(
        { bold: ['high'], purpose: ['low'], lead: ['low', 'average'] },
        'İnsanlar arasında rahat olduğunu ve söz almaktan çekinmediğini söylüyorsun; “Kararlılık ve sorumluluk” eğiliminde ise puanın düşük. Rahat konuşmak ile işleri sürdürmek ayrı becerilerdir. Bir grupta söz verdiğin işleri bir yere yazmak, ikisini birleştirmene yardım edebilir.',
        'Çocuğunuz insanlar arasında rahat olduğunu ve söz almaktan çekinmediğini belirtiyor; “Kararlılık ve sorumluluk” eğiliminde ise puanı düşük. Rahat konuşmak ile işleri sürdürmek ayrı becerilerdir. Bir grupta söz verdiği işleri bir yere yazmak, ikisini birleştirmesine yardım edebilir.',
      ),
      rule(
        { purpose: ['high'], lead: ['low'], bold: ['low'] },
        'Üstlendiğin işleri sonuna götürdüğünü söylüyorsun; “Öne çıkıp yön verme” ve “Sosyal cesaret” eğilimlerinde ise puanın düşük. Araştırmalar sessiz kişilerin de iyi liderlik yapabildiğini gösteriyor. Örneğin ekipteki fikirleri dinleyen liderler, girişken ekiplerde iyi sonuç alabiliyor.',
        'Çocuğunuz üstlendiği işleri sonuna götürdüğünü belirtiyor; “Öne çıkıp yön verme” ve “Sosyal cesaret” eğilimlerinde ise puanı düşük. Araştırmalar sessiz kişilerin de iyi liderlik yapabildiğini gösteriyor. Örneğin ekipteki fikirleri dinleyen liderler, girişken ekiplerde iyi sonuç alabiliyor.',
      ),
      rule(
        { purpose: ['high'], lead: ['low'], bold: ['average', 'high'] },
        'Üstlendiğin işleri sonuna götürdüğünü söylüyorsun; “Öne çıkıp yön verme” eğiliminde ise puanın düşük. Yönü başkalarına bırakmak ile üstlenilen işi bitirmek ayrı şeylerdir. Hazırlıklı ve planlı çalışman, bir gün yön vermek istediğinde sana dayanak olabilir.',
        'Çocuğunuz üstlendiği işleri sonuna götürdüğünü belirtiyor; “Öne çıkıp yön verme” eğiliminde ise puanı düşük. Yönü başkalarına bırakmak ile üstlenilen işi bitirmek ayrı şeylerdir. Hazırlıklı ve planlı çalışması, bir gün yön vermek istediğinde ona dayanak olabilir.',
      ),
      rule(
        { purpose: ['high'], bold: ['low'], lead: ['average', 'high'] },
        'Üstlendiğin işleri sonuna götürdüğünü söylüyorsun; “Sosyal cesaret” eğiliminde ise puanın düşük. Topluluk önünde rahat olmamak, bir grupta güvenilen biri olmana engel değildir. Söz almak istediğinde, söyleyeceklerini önceden birkaç maddeyle not etmek işini kolaylaştırabilir.',
        'Çocuğunuz üstlendiği işleri sonuna götürdüğünü belirtiyor; “Sosyal cesaret” eğiliminde ise puanı düşük. Topluluk önünde rahat olmamak, bir grupta güvenilen biri olmasına engel değildir. Söz almak istediğinde, söyleyeceklerini önceden birkaç maddeyle not etmek işini kolaylaştırabilir.',
      ),
      rule(
        { lead: ['high'], bold: ['low'], purpose: ['average'] },
        'Bir grupta yön vermek istediğini söylüyorsun; “Sosyal cesaret” eğiliminde ise puanın düşük. Yön vermek her zaman kalabalık önünde konuşmayı gerektirmez. Küçük bir grupla ya da birebir konuşarak da işleri yönlendirebilirsin.',
        'Çocuğunuz bir grupta yön vermek istediğini belirtiyor; “Sosyal cesaret” eğiliminde ise puanı düşük. Yön vermek her zaman kalabalık önünde konuşmayı gerektirmez. Küçük bir grupla ya da birebir konuşarak da işleri yönlendirebilir.',
      ),
      rule(
        { lead: ['low'], bold: ['high'], purpose: ['average'] },
        'Topluluk içinde rahat olduğunu söylüyorsun; “Öne çıkıp yön verme” eğiliminde ise puanın düşük. Rahat konuşmak ile bir grubu yönlendirmek istemek ayrı eğilimlerdir. Bu rahatlık, başkasının yürüttüğü bir işi desteklerken de işe yarar.',
        'Çocuğunuz topluluk içinde rahat olduğunu belirtiyor; “Öne çıkıp yön verme” eğiliminde ise puanı düşük. Rahat konuşmak ile bir grubu yönlendirmek istemek ayrı eğilimlerdir. Bu rahatlık, başkasının yürüttüğü bir işi desteklerken de işe yarar.',
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
        'Genel olarak bir grupta idareyi ele almaktan ve işlerin başında olmaktan hoşlandığını söylüyorsun. Başkalarını bir şey yapmaya ikna edebildiğini de düşünüyorsun. Bu istek, bir işin başlamasını ve yürümesini kolaylaştırabilir.',
        'Çocuğunuz genel olarak bir grupta idareyi ele almaktan ve işlerin başında olmaktan hoşlandığını belirtiyor. Başkalarını bir şey yapmaya ikna edebildiğini de düşünüyor. Bu istek, bir işin başlamasını ve yürümesini kolaylaştırabilir.',
      ),
      average: t(
        'Duruma göre yön veren',
        'Bazı durumlarda idareyi ele aldığını, bazılarında ise yönü başkalarına bıraktığını söylüyorsun. Bu çok olağandır: pek çok insan bazı işlerde yön verir, bazılarında başkasının yön vermesini tercih eder.',
        'Çocuğunuz bazı durumlarda idareyi ele aldığını, bazılarında ise yönü başkalarına bıraktığını belirtiyor. Bu çok olağandır: pek çok insan bazı işlerde yön verir, bazılarında başkasının yön vermesini tercih eder.',
      ),
      low: t(
        'Yönü başkalarına bırakan',
        'Genel olarak bir grupta yolu başkalarının göstermesini beklediğini ve kararları onlara bıraktığını söylüyorsun. Bir grupta herkesin yön vermesi gerekmez; başkasının önerisini destekleyip işe katkı vermek de grubun işini yürütür.',
        'Çocuğunuz genel olarak bir grupta yolu başkalarının göstermesini beklediğini ve kararları onlara bıraktığını belirtiyor. Bir grupta herkesin yön vermesi gerekmez; başkasının önerisini destekleyip işe katkı vermek de grubun işini yürütür.',
      ),
    },
    bold: {
      high: t(
        'Topluluk önünde rahat',
        'Genel olarak insanların arasında rahat olduğunu, ilgi odağı olmaktan çekinmediğini ve topluluk önünde konuşabildiğini söylüyorsun. Bu rahatlık bir grupta söz almanı kolaylaştırabilir. Çok konuşan kişi daha sık lider sayılır; ama çok konuşmak, iyi liderlik demek değildir.',
        'Çocuğunuz genel olarak insanların arasında rahat olduğunu, ilgi odağı olmaktan çekinmediğini ve topluluk önünde konuşabildiğini belirtiyor. Bu rahatlık bir grupta söz almasını kolaylaştırabilir. Çok konuşan kişi daha sık lider sayılır; ama çok konuşmak, iyi liderlik demek değildir.',
      ),
      average: t(
        'Duruma göre söz alan',
        'Bazı ortamlarda rahatça söz aldığını, bazılarında ise geri planda kalmayı tercih ettiğini söylüyorsun. İnsanın rahatlığı ortama ve yanındaki kişilere göre değişebilir; bu olağandır.',
        'Çocuğunuz bazı ortamlarda rahatça söz aldığını, bazılarında ise geri planda kalmayı tercih ettiğini belirtiyor. İnsanın rahatlığı ortama ve yanındaki kişilere göre değişebilir; bu olağandır.',
      ),
      low: t(
        'Geri planda kalmayı seven',
        'Genel olarak kalabalıkta geri planda kalmayı tercih ettiğini, ilgi odağı olmaktan ve topluluk önünde konuşmaktan çekindiğini söylüyorsun. Topluluk önünde rahat olmak, kişinin söyleyecek değerli bir şeyi olup olmadığını göstermez.',
        'Çocuğunuz genel olarak kalabalıkta geri planda kalmayı tercih ettiğini, ilgi odağı olmaktan ve topluluk önünde konuşmaktan çekindiğini belirtiyor. Topluluk önünde rahat olmak, kişinin söyleyecek değerli bir şeyi olup olmadığını göstermez.',
      ),
    },
    purpose: {
      high: t(
        'Üstlendiğini sonuna götüren',
        'Genel olarak hazırlıklı olduğunu, yaptığın planları uyguladığını ve üstlendiğin işleri sonuna kadar götürdüğünü söylüyorsun. Dikkatini toplayıp işe hemen koyulabildiğini de düşünüyorsun. Bu, başkalarının sana bir iş emanet etmesini kolaylaştırabilir.',
        'Çocuğunuz genel olarak hazırlıklı olduğunu, yaptığı planları uyguladığını ve üstlendiği işleri sonuna kadar götürdüğünü belirtiyor. Dikkatini toplayıp işe hemen koyulabildiğini de düşünüyor. Bu, başkalarının ona bir iş emanet etmesini kolaylaştırabilir.',
      ),
      average: t(
        'İşe göre sürdüren',
        'Bazı işlerde hazırlıklı ve odaklı olduğunu, bazılarında ise işleri son ana bıraktığını söylüyorsun. Pek çok insan önemsediği işleri kolayca sürdürür, ötekilerde daha çok zorlanır.',
        'Çocuğunuz bazı işlerde hazırlıklı ve odaklı olduğunu, bazılarında ise işleri son ana bıraktığını belirtiyor. Pek çok insan önemsediği işleri kolayca sürdürür, ötekilerde daha çok zorlanır.',
      ),
      low: t(
        'İşleri sürdürmekte zorlanan',
        'Genel olarak dikkatinin kolayca dağıldığını, işleri son ana bıraktığını ve üstlendiğin işleri sonuna götürmekte zorlandığını söylüyorsun. Bu bir değer yargısı değildir; alışkanlıklar ve çevre düzeni değiştikçe bu da değişebilir.',
        'Çocuğunuz genel olarak dikkatinin kolayca dağıldığını, işleri son ana bıraktığını ve üstlendiği işleri sonuna götürmekte zorlandığını belirtiyor. Bu bir değer yargısı değildir; alışkanlıklar ve çevre düzeni değiştikçe bu da değişebilir.',
      ),
    },
  },
};
