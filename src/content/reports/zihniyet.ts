import type { InsightRule, ReportTemplate } from './types';

/**
 * Zihniyet: Zekâ ve Öğrenme İnançları: rapor metinleri.
 *
 * Dayanaklar (araştırma cümlelerinin her biri bunlardan birine dayanır):
 *  - Burnette ve ark. (2013, meta-analiz, 113 örneklem): zekânın gelişebileceği inancı öğrenme hedefleriyle (r = .19),
 *    performans hedefleriyle ters yönde (r = −.15), ustalık odaklı yollarla (r = .23) ve çaresizlik yollarıyla ters yönde
 *    (r = −.24) ilişkili; başarıyla ilişkisi küçük (r = .10). Kişinin kendini sınanmış hissettiği durumlarda (zorlanma,
 *    başarısızlık) yalnızca hedeflerle ve kullanılan yollarla ilişkiler güçleniyor; duygu ve beklentiyle ilişkiler değil.
 *    Sabit görenler yeteneğini kanıtlamayı, gelişebilir görenler geliştirmeyi önemsiyor.
 *  - Blackwell, Trzesniewski ve Dweck (2007): 373 yedinci sınıf öğrencisi; zekâyı gelişebilir görenlerin matematik notları
 *    iki yıl boyunca yükseldi, sabit görenlerinki yerinde saydı; bu ilişkide öğrenme hedefleri, çabaya olumlu bakış ve
 *    çaresizlik yerine çözüm arama aracı rol oynadı. Zekânın gelişebileceğini öğreten bir çalışma, notlardaki düşüşü
 *    tersine çevirdi.
 *  - Haimovitz ve Dweck (2016): çocukların zekâ inançlarıyla anne babanın zekâ inancı değil, başarısızlığa bakışı ilişkili;
 *    başarısızlığı engelleyici görenler çocuğun hatasına yetenek kaygısıyla, öğrenmeyi daha az destekleyerek tepki verdi.
 *  - Sisk ve ark. (2018, iki meta-analiz): zihniyet ile akademik başarı r = .10 (çocuklarda .19, ergenlerde .15,
 *    üniversite öğrencileri gibi erişkinlerde .02, anlamsız); kısa zihniyet çalışmalarının ortalama etkisi d = .08 ("çok
 *    küçük"), az sayıda çalışmada düşük gelirli ailelerden gelen öğrencilerde d = .34.
 *  - Burgoyne, Hambrick ve Macnamara (2020): üniversite öğrencileriyle; kuramın altı öncülünden yalnızca ikisi desteklendi
 *    (ör. gelişim zihniyeti ile zorlukta sebat etme ilişkisi anlamlı değildi).
 *  - Yeager ve ark. (2019; yalnızca bilim kartında): bir saatten kısa çevrim içi çalışma, notları düşük öğrencilerin
 *    notlarını biraz yükseltti (yaklaşık 0,1 not puanı); etkisi akran ortamı mesajla uyumluyken görüldü. Raporda anılmaz:
 *    okuyanın notlarının düşük olduğunu ve zihniyet değişince notların yükseldiğini ima ederdi; hemen ardından gelen "Bir
 *    not" de kısa çalışmaların etkisinin çok küçük olduğunu söyler (2026-10-22 incelemesi).
 *  - Dunlosky ve ark. (2013): bakmadan hatırlamaya çalışmak ve tekrarları günlere yaymak en yararlı bulunan iki yöntem.
 * İlkeler: zihniyet abartılmaz (başarıyla ilişkisi küçüktür, erişkinlerde neredeyse yoktur); gelişim zihniyeti bir
 * "doğru cevap" ya da etiket gibi sunulmaz; inanç ile davranışın örtüşmeyebileceği söylenir. Bulgular ilişkiseldir;
 * öneriler "-abilir" diye yazılır. Aynı araştırma bulgusu bir raporda bir kez anılır ("başarısız olunan anlarda görülüyor"
 * yalnızca Hataya bakışta, anne babanın hatalara bakışı yalnızca veli metninde Hataya bakışta). Öğrenci metni okula
 * özgüyse ya da erişkin için yanlış olursa yetişkine ayrı metin yazılır.
 * Kartlar sonucu anlatır, öneri vermez (2026-10-22 incelemesi): öneriler yol haritasındadır (çalışma kartları, veliye
 * yaklaşım, haftalar); kartta da söylenince aynı öneri bir sayfada üç dört kez okunuyordu. "Birlikte bakınca" kuralları
 * kartlardaki cümleleri tekrar etmez; yalnızca hangi alanın düşük olduğunu söyler.
 */

const p = (
  summary: string,
  student: string,
  parent: string,
  tipsStudent: string[],
  tipsParent: string[],
  adult?: string,
) => ({ summary, student, parent, tipsStudent, tipsParent, ...(adult ? { adult } : {}) });

const r = (when: InsightRule['when'], student: string, parent: string, adult?: string, not?: InsightRule['not']): InsightRule => ({
  when,
  ...(not ? { not } : {}),
  text: { student, parent, ...(adult ? { adult } : {}) },
});

const NOT_HIGH = ['low', 'average'] as const;
const NOT_LOW = ['average', 'high'] as const;

const OVERVIEW =
  'Her satır bir alan. Değerler 1 ile 5 arasındadır: 5’e yaklaştıkça gelişim yönündeki inanç (“gelişim zihniyeti”), 1’e yaklaştıkça sabitlik yönündeki inanç (“sabit zihniyet”) güçlüdür. “Zekâ boy gibidir: çalışarak artırılamaz” gibi cümlelere katılmamak puanı yükseltir. Bu bir yetenek puanı değildir.';

export const zihniyetReport: ReportTemplate = {
  version: 'zihniyet-1',
  bandLabels: { low: 'Düşük', average: 'Orta', high: 'Yüksek' },
  overview: { student: OVERVIEW, parent: OVERVIEW },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Alanların birlikte yorumu: zekâ hakkındaki inançla çaba, hata ve zorluk karşısındaki bakışın örtüşüp örtüşmediği',
    lead: [
      r(
        { intelligence: ['low'] },
        'Zekâya bakış puanın düşük: zekâyı büyük ölçüde sabit görüyorsun, yani sabit zihniyete daha yakınsın.',
        'Çocuğunuzun zekâya bakış puanı düşük: zekâyı büyük ölçüde sabit görüyor, yani sabit zihniyete daha yakın.',
      ),
      r(
        { intelligence: ['average'] },
        'Zekâya bakış puanın orta: ne sabit zihniyete ne de gelişim zihniyetine belirgin biçimde yakınsın. Zorlandığın anlarda nasıl davrandığına dair en çok ipucunu, hataya bakış ve zorluğa yaklaşım sonuçların verebilir.',
        'Çocuğunuzun zekâya bakış puanı orta: ne sabit zihniyete ne de gelişim zihniyetine belirgin biçimde yakın. Zorlandığı anlarda nasıl davrandığına dair en çok ipucunu, hataya bakış ve zorluğa yaklaşım sonuçları verebilir.',
      ),
      r(
        { intelligence: ['high'] },
        'Zekâya bakış puanın yüksek: zekânın gelişebileceğine inanıyorsun, yani gelişim zihniyetine daha yakınsın.',
        'Çocuğunuzun zekâya bakış puanı yüksek: zekânın gelişebileceğine inanıyor, yani gelişim zihniyetine daha yakın.',
      ),
    ],
    rules: [
      // Zekâyı gelişebilir görüp başka bir alanda sabit bakış: inanç ile davranış her zaman örtüşmez.
      r(
        { intelligence: ['high'], effort: ['low'] },
        'Ancak çabaya bakış puanın düşük. Bu iki düşünce birbiriyle pek uyuşmuyor: zekâ gelişebiliyorsa, emek vermek ve yöntem değiştirmek o gelişmenin yollarıdır.',
        'Ancak çabaya bakış puanı düşük. Bu iki düşünce birbiriyle pek uyuşmuyor: zekâ gelişebiliyorsa, emek vermek ve yöntem değiştirmek o gelişmenin yollarıdır.',
      ),
      r(
        { intelligence: ['high'], failure: ['low'] },
        'Öte yandan hataya bakış puanın düşük. Zekânın gelişebileceğine inanan biri için hatalar, neyin henüz öğrenilmediğini gösteren işaretler olabilir; bu yüzden hataya bakış, üzerinde durmanın en çok işine yarayabileceği alan olabilir.',
        'Öte yandan hataya bakış puanı düşük. Zekânın gelişebileceğine inanan biri için hatalar, neyin henüz öğrenilmediğini gösteren işaretler olabilir; bu yüzden hataya bakış, üzerinde durmanın ona en çok yarar sağlayabileceği alan olabilir.',
      ),
      r(
        { intelligence: ['high'], challenge: ['low'] },
        'Buna karşın zorluğa yaklaşım puanın düşük. İnanç ile davranışın örtüşmemesi şaşırtıcı değil: araştırmalarda zihniyetle zorluk karşısındaki davranışlar arasındaki ilişkiler küçük bulunmuş. “Nasıl çalışabilirsin?” bölümünde zorluğa yaklaşım için önerilen küçük adım, inancını davranışa çevirmene yardım edebilir.',
        'Buna karşın zorluğa yaklaşım puanı düşük. İnanç ile davranışın örtüşmemesi şaşırtıcı değil: araştırmalarda zihniyetle zorluk karşısındaki davranışlar arasındaki ilişkiler küçük bulunmuş. “Çocuğunuz nasıl çalışabilir?” bölümünde zorluğa yaklaşım için önerilen küçük adım, inancını davranışa çevirmesine yardım edebilir.',
      ),
      r(
        { intelligence: ['high'], effort: ['high'], failure: ['high'], challenge: ['high'] },
        'Dört alanda da gelişim yönünde düşünüyorsun. Bu bakışı, zorlandığın anlarda gerçekten yeni yollar deneyerek davranışa çevirmeyi sürdürmek işine yarayabilir.',
        'Çocuğunuz dört alanda da gelişim yönünde düşünüyor. Bu bakışı, zorlandığı anlarda gerçekten yeni yollar deneyerek davranışa çevirmeyi sürdürmesi ona yarar sağlayabilir.',
      ),
      r(
        { intelligence: ['high'], effort: [...NOT_LOW], failure: [...NOT_LOW], challenge: [...NOT_LOW] },
        'Çaba, hata ve zorluk konusundaki bakışın da bu inançla örtüşüyor ya da ona yakın; orta çıkan alanlar, bu inancı davranışa daha çok yansıtabileceğin yerler.',
        'Çocuğunuzun çaba, hata ve zorluk konusundaki bakışı da bu inançla örtüşüyor ya da ona yakın; orta çıkan alanlar, bu inancı davranışa daha çok yansıtabileceği yerler.',
        undefined,
        { effort: ['high'], failure: ['high'], challenge: ['high'] },
      ),
      // Zekâ konusunda orta: diğer üç alana göre.
      r(
        { intelligence: ['average'], effort: ['high'], failure: ['high'], challenge: ['high'] },
        'Çaba, hata ve zorluk konusunda ise gelişim yönünde düşünüyorsun. Zekâ hakkındaki görüşün ne olursa olsun, bu üç alandaki bakışın zorlandığın anlarda işine yarayabilir.',
        'Çocuğunuz çaba, hata ve zorluk konusunda ise gelişim yönünde düşünüyor. Zekâ hakkındaki görüşü ne olursa olsun, bu üç alandaki bakışı zorlandığı anlarda ona yarar sağlayabilir.',
      ),
      r(
        { intelligence: ['average'] },
        'Çaba, hata ve zorluk alanlarından düşük çıkanlarda sabitlik yönünde düşünüyorsun. “Nasıl çalışabilirsin?” bölümünde bu alanlar için önerilen küçük adımlar iyi bir başlangıç olabilir.',
        'Çocuğunuz çaba, hata ve zorluk alanlarından düşük çıkanlarda sabitlik yönünde düşünüyor. “Çocuğunuz nasıl çalışabilir?” bölümünde bu alanlar için önerilen küçük adımlar iyi bir başlangıç olabilir.',
        undefined,
        { effort: [...NOT_LOW], failure: [...NOT_LOW], challenge: [...NOT_LOW] },
      ),
      // Zekâyı sabit görüp başka bir alanda gelişim yönünde bakış.
      r(
        { intelligence: ['low'] },
        'Yine de çaba, hata ve zorluk alanlarından en az birinde gelişime açık bir bakışın var. Yani zekâ hakkındaki inancın, zorlandığında nasıl davrandığını tek başına belirlemiyor olabilir; araştırmalarda da zihniyetle davranışlar arasındaki ilişkiler küçük bulunmuş.',
        'Yine de çaba, hata ve zorluk alanlarından en az birinde gelişime açık bir bakışı var. Yani zekâ hakkındaki inancı, zorlandığında nasıl davrandığını tek başına belirlemiyor olabilir; araştırmalarda da zihniyetle davranışlar arasındaki ilişkiler küçük bulunmuş.',
        undefined,
        { effort: [...NOT_HIGH], failure: [...NOT_HIGH], challenge: [...NOT_HIGH] },
      ),
      r(
        { intelligence: ['low'], effort: [...NOT_HIGH], failure: [...NOT_HIGH], challenge: [...NOT_HIGH] },
        'Çaba, hata ve zorluk konusunda da gelişim yönünde belirgin bir bakış görünmüyor; bu durumda zorlanınca “Bende bu yetenek yok” deyip vazgeçmek daha kolay olabilir. Bu düşünceyi fark etmek, vazgeçmek yerine başka bir yol denemene yardım edebilir. “Nasıl çalışabilirsin?” bölümünde zekâya bakış için önerilen adım iyi bir başlangıç olabilir.',
        'Çaba, hata ve zorluk konusunda da gelişim yönünde belirgin bir bakış görünmüyor; bu durumda zorlanınca “Bende bu yetenek yok” deyip vazgeçmek daha kolay olabilir. Bu düşünceyi fark etmek, vazgeçmek yerine başka bir yol denemesine yardım edebilir. “Çocuğunuz nasıl çalışabilir?” bölümünde zekâya bakış için önerilen adım iyi bir başlangıç olabilir.',
      ),
      // Her raporda: zihniyet abartılmaz.
      r(
        {},
        'Bir not: zihniyet başarının küçük bir parçasıdır. Araştırmalarda zihniyetle okul başarısı arasındaki ilişki küçük bulunmuş ve kısa zihniyet çalışmalarının çoğu öğrencide etkisi çok küçük kalmış. Bu yüzden bu sonuç bir etiket değil; zorlandığın anlarda kendine sorabileceğin bir sorudur.',
        'Bir not: zihniyet başarının küçük bir parçasıdır. Araştırmalarda zihniyetle okul başarısı arasındaki ilişki küçük bulunmuş ve kısa zihniyet çalışmalarının çoğu öğrencide etkisi çok küçük kalmış. Bu yüzden bu sonuç çocuğunuz için bir etiket değil; zorlandığı anlarda birlikte konuşabileceğiniz bir konudur.',
        'Bir not: zihniyet tek başına belirleyici değildir. Araştırmalarda zihniyetle akademik başarı arasındaki ilişki çocuklarda ve gençlerde küçük, üniversitede okuyanlar gibi erişkinlerde ise neredeyse yok bulunmuş. Bu yüzden bu sonuç bir etiket değil; zorlandığın anlarda kendine sorabileceğin bir sorudur.',
      ),
    ],
  },
  scales: {
    intelligence: {
      low: p(
        'Zekâyı sabit görme',
        'Zekânın büyük ölçüde doğuştan belli olduğunu ve pek değişmediğini düşünüyorsun. Bu düşünce, zorlandığın anlarda “Demek ki yapamıyorum” sonucuna varmayı kolaylaştırabilir. Bir araştırmada, zekânın gelişebileceğine inanan yedinci sınıf öğrencilerinin matematik notlarının iki yıl boyunca yükseldiği, sabit olduğuna inananlarınkinin ise yerinde saydığı görülmüş.',
        'Çocuğunuz zekânın büyük ölçüde doğuştan belli olduğunu ve pek değişmediğini düşünüyor. Bu düşünce, zorlandığı anlarda “Demek ki yapamıyorum” sonucuna varmayı kolaylaştırabilir. Bir araştırmada, zekânın gelişebileceğine inanan yedinci sınıf öğrencilerinin matematik notlarının iki yıl boyunca yükseldiği, sabit olduğuna inananlarınkinin ise yerinde saydığı görülmüş.',
        ['Bir ay önce zorlandığın ama şimdi daha iyi yaptığın bir şeyi düşün.'],
        ['Zorlandığı ama sonra öğrendiği bir şeyi ona hatırlatın.'],
        'Zekânın büyük ölçüde doğuştan belli olduğunu ve pek değişmediğini düşünüyorsun. Bu düşünce, zorlandığın anlarda “Demek ki yapamıyorum” sonucuna varmayı kolaylaştırabilir.',
      ),
      average: p(
        'Zekâya iki yönden bakma',
        'Zekâ konusunda iki görüşe de yakınsın: bazen gelişebileceğini, bazen doğuştan belli olduğunu düşünüyorsun.',
        'Çocuğunuz zekâ konusunda iki görüşe de yakın: bazen gelişebileceğini, bazen doğuştan belli olduğunu düşünüyor.',
        ['Zorlandığında aklına gelen düşünceyi fark et.'],
        ['Zorlandığında neler düşündüğünü sorun ve dinleyin.'],
      ),
      high: p(
        'Zekânın gelişebileceğine inanma',
        'Zekânın ve zihinsel becerilerin öğrenerek gelişebileceğine inanıyorsun. Araştırmalarda bu inanç, öğrenmeyi hedefleme ve zorlanınca vazgeçmek yerine yöntem değiştirme ile küçük de olsa ilişkili bulunmuş. Yine de inanç ile davranış her zaman örtüşmez.',
        'Çocuğunuz zekânın ve zihinsel becerilerin öğrenerek gelişebileceğine inanıyor. Araştırmalarda bu inanç, öğrenmeyi hedefleme ve zorlanınca vazgeçmek yerine yöntem değiştirme ile küçük de olsa ilişkili bulunmuş. Yine de inanç ile davranış her zaman örtüşmez.',
        ['Takıldığında yeni bir yol dene.'],
        ['Çabasını ve yöntem değiştirmesini fark ettiğinizi söyleyin.'],
      ),
    },
    effort: {
      low: p(
        'Çabayı yeteneksizlik işareti görme',
        'Bir konuda çok çalışmak gerekmesini, o konuda yeteneğin olmadığının işareti gibi görüyorsun. Bu bakış, zorlanınca vazgeçmeyi kolaylaştırabilir. Zorlandığında “Yeteneğim yok” yerine “Henüz doğru yolu bulamadım” diye düşünmek işine yarayabilir.',
        'Çocuğunuz bir konuda çok çalışmak gerekmesini, o konuda yeteneği olmadığının işareti gibi görüyor. Bu bakış, zorlanınca vazgeçmeyi kolaylaştırabilir.',
        ['Zorlandığında “Henüz doğru yolu bulamadım” de.'],
        ['Yeteneğini değil, çabasını ve denediği yolları övün.'],
      ),
      average: p(
        'Çabaya iki yönden bakma',
        'Çabanın ilerlettiğini düşünüyorsun ama bazen çok çalışmak gerekmesi sana yeteneksizlik gibi gelebiliyor.',
        'Çocuğunuz çabanın ilerlettiğini düşünüyor ama bazen çok çalışmak gerekmesi ona yeteneksizlik gibi gelebiliyor.',
        ['Takıldığında aynı şeyi tekrarlamak yerine yöntem değiştir.'],
        ['Takıldığında başka bir yol denemesini cesaretlendirin.'],
      ),
      high: p(
        'Çabanın ilerlettiğine inanma',
        'Emeğin ve yeni yollar denemenin seni ilerlettiğine inanıyorsun; çok çalışmak gerekmesini yeteneksizlik saymıyorsun.',
        'Çocuğunuz emeğin ve yeni yollar denemenin onu ilerlettiğine inanıyor; çok çalışmak gerekmesini yeteneksizlik saymıyor.',
        ['Çabanı bakmadan hatırlama gibi etkili yöntemlerle birleştir.'],
        ['Çabasını etkili yöntemlerle birleştirmesini destekleyin.'],
      ),
    },
    failure: {
      low: p(
        'Hatayı engel görme',
        'Hataları ve başarısızlığı öğrenmeyi engelleyen, seni geri götüren şeyler olarak görüyorsun. Bu bakış, hata ihtimali olan işlerden uzak durmayı kolaylaştırabilir. Araştırmalarda zihniyet ile davranış arasındaki bağ en çok başarısız olunan anlarda görülüyor: zekânın gelişebileceğini düşünenler bu anlarda vazgeçmek yerine yöntem değiştirmeye daha yatkın.',
        'Çocuğunuz hataları ve başarısızlığı öğrenmeyi engelleyen, onu geri götüren şeyler olarak görüyor. Bu bakış, hata ihtimali olan işlerden uzak durmayı kolaylaştırabilir. Bir araştırmada, anne babanın hatalara bakışının çocuğun zekâ hakkındaki inancıyla ilişkili olduğu görülmüş.',
        ['Bir hatanın ardından “Bu bana ne öğretti?” diye sor.'],
        ['Hatalarına “Bundan ne öğrendin?” diye yaklaşın.'],
      ),
      average: p(
        'Hataya iki yönden bakma',
        'Hataların bazen öğrettiğini, bazen seni geri götürdüğünü düşünüyorsun. Hangi durumlarda hatayı bir işaret, hangilerinde bir başarısızlık olarak gördüğünü fark etmek işine yarayabilir.',
        'Çocuğunuz hataların bazen öğrettiğini, bazen onu geri götürdüğünü düşünüyor.',
        ['Bir hatayı bir işaret olarak okumayı dene.'],
        ['Hatalarına öğrenmeye odaklanarak tepki verin.'],
      ),
      high: p(
        'Hatayı öğretici görme',
        'Hataları ve başarısızlığı öğrenmenin normal bir parçası, neyi öğrenmen gerektiğini gösteren işaretler olarak görüyorsun. Araştırmalarda zihniyet ile davranış arasındaki bağ en çok zorlanılan ve başarısız olunan anlarda görülüyor; bu bakış o anlarda işine yarayabilir.',
        'Çocuğunuz hataları ve başarısızlığı öğrenmenin normal bir parçası olarak görüyor. Bir araştırmaya göre çocukların zekâ hakkındaki inançları, anne babanın hatalara bakışıyla ilişkili.',
        ['Hatalarından öğrendiklerini not etmeyi sürdür.'],
        ['Hatalarına öğrenmeye odaklanarak tepki vermeyi sürdürün.'],
      ),
    },
    challenge: {
      low: p(
        'Zorluktan kaçınma',
        'Hata yapma ihtimali olan ya da başkalarının önünde zorlanacağın işlerden kaçınma eğilimindesin; iyi olduğun şeylerde kalmayı tercih ediyorsun. Bu seni o an rahat ettirebilir ama yeni şeyler öğrenme fırsatlarını azaltabilir. Araştırmalarda zekânın sabit olduğuna inananların daha çok yeteneğini kanıtlamayı, gelişebileceğine inananların daha çok yeteneğini geliştirmeyi önemsediği görülmüş.',
        'Çocuğunuz hata yapma ihtimali olan ya da başkalarının önünde zorlanacağı işlerden kaçınma eğiliminde; iyi olduğu şeylerde kalmayı tercih ediyor. Bu onu o an rahat ettirebilir ama yeni şeyler öğrenme fırsatlarını azaltabilir. Araştırmalarda zekânın sabit olduğuna inananların daha çok yeteneğini kanıtlamayı, gelişebileceğine inananların daha çok yeteneğini geliştirmeyi önemsediği görülmüş.',
        ['Bu hafta zorlanacağını bildiğin küçük bir işi dene.'],
        ['Sonucu değil, denemesini takdir edin.'],
      ),
      average: p(
        'Bazen zorluğu seçme',
        'Bazen zorlayıcı işleri seçiyor, bazen bildiğin işlerde kalmayı tercih ediyorsun.',
        'Çocuğunuz bazen zorlayıcı işleri seçiyor, bazen bildiği işlerde kalmayı tercih ediyor.',
        ['Zorluktan hangi durumlarda kaçındığını fark et.'],
        ['Hangi durumlarda zorluktan kaçındığını birlikte konuşun.'],
      ),
      high: p(
        'Zorluğu arama',
        'Zorlayıcı işleri seçiyor, iyi görünmek yerine öğrenmeyi önemsiyorsun. Araştırmalarda öğrenmeyi hedefleyen bu yaklaşım, zekânın gelişebileceği inancıyla birlikte görülüyor.',
        'Çocuğunuz zorlayıcı işleri seçiyor, iyi görünmek yerine öğrenmeyi önemsiyor. Araştırmalarda öğrenmeyi hedefleyen bu yaklaşım, zekânın gelişebileceği inancıyla birlikte görülüyor.',
        ['Zorlayıcı işleri seçmeyi sürdür.'],
        ['Denemelerini ve öğrendiklerini takdir edin.'],
      ),
    },
  },
};
