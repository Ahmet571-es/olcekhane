import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Empati rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): düşük düzey bir kusur, yüksek düzey bir başarı notu gibi anlatılmaz; hiçbir
 * düzey kişiyi yargılamaz ("bencil", "duygusuz", "soğuk" gibi sözcükler kullanılmaz). Sonuç öz bildirime dayandığı için
 * öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır. Rapor, başkalarını ne kadar doğru
 * anladığını değil, kişinin kendini nasıl gördüğünü anlatır (Murphy ve Lilienfeld, 2019).
 * Metinler yalnızca kendi ölçeğinin maddelerinin sorduğunu anlatır ve aynı sayfadaki öteki kartlarla çelişmez:
 *  - "Zaman ayırma" iki ölçekte zıt yönde sorulur (sıcaklık: "Başkalarına zaman ayırırım"; başkalarını düşünme: "Başkalarına
 *    zaman ayırmam"); "ilgi" de iki ölçektedir (sıcaklık: "İnsanlara ilgi duyarım"; başkalarını düşünme: "Başkalarının
 *    sorunları beni ilgilendirmez"). Bu yüzden düşük ve orta düzey metinleri bu ikisinden söz etmez.
 *  - Başkalarını düşünmenin düşük ve orta düzeyi duygulardan ve "sorunlar"dan söz etmez (duygusal duyarlılığın yüksek kartı
 *    "derdiyle dertlenme" der); duygusal duyarlılığın düşük düzeyi "başkalarını önemsemediğin anlamına gelmez" der.
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim kartında:
 * iki yön, Davis, 1983 ve Jolliffe ve Farrington, 2006; ergenlikte başkasının gözünden bakabilme, Van der Graaff ve ark., 2014;
 * yardım etmeyle ilişki, Yin ve Wang, 2023; öz değerlendirme ile beceri arasındaki zayıf ilişki, Murphy ve Lilienfeld,
 * 2019; eğitimle gelişme, Teding van Berkhout ve Malouff, 2016); ardından ölçeklerin birleşimlerine göre cümleler. Bir
 * birleşimde en çok iki kural çıkar ve aynı fikri tekrar etmez (tests/empati.test.ts ortak söz öbeklerini arar). Üç yön
 * yüksekken başarı notu gibi, üçü düşükken eksiklik gibi anlatılmaz ve bir sonuç vaat edilmez.
 * Destek kutusu gösterilmez: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez.
 * Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır. Yalnızca birlikte
 * yorumun girişi (öğrenci metni gençlerle yapılan bir çalışmayı anar) yetişkine ayrı yazılır.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
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

const LEAD_START =
  'Empati, başkasının ne hissettiğini anlamak ve onun duygusunu bir ölçüde paylaşmaktır. Araştırmalarda iki yönü ayrılır: olaylara başkasının gözünden bakabilmek ve onun duygusundan etkilenmek. Bu testin üç yönü bu ikisiyle birebir örtüşmez; test, başkalarını önemsemeyi, duygulardan etkilenmeyi ve insanlara sıcak yaklaşmayı sorar.';
const LEAD_TEEN = '13 ile 18 yaş arasındaki gençleri yıllarca izleyen bir çalışmada olaylara başkasının gözünden bakabilme yaşla artmıştır.';
const LEAD_REST =
  'Empati, yardım etme ve paylaşma gibi davranışlarla ilişkili bulunmuştur. Kişinin başkalarını ne kadar iyi anladığına dair kendi görüşü ile başkalarının duygularını ve düşüncelerini ne kadar doğru tahmin ettiği arasındaki ilişki ise çok zayıftır. Empati çalışmayla gelişebilir: kontrollü deneyleri birleştiren bir incelemede empati eğitimlerinin orta büyüklükte bir etkisi bulunmuştur.';

export const empatiReport: ReportTemplate = {
  version: 'empati-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır empatinin bir yönünü gösteriyor; üç yön ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar başkalarını ne kadar doğru anladığını değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
    parent:
      'Her satır çocuğunuzun empatisinin bir yönünü gösterir; üç yön ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar çocuğunuzun başkalarını ne kadar doğru anladığını değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Birlikte bakınca: empati hakkında araştırmaların kısa özeti ve üç yönün birlikte ne anlatabileceği',
    lead: [
      {
        when: {},
        text: {
          student: `${LEAD_START} ${LEAD_TEEN} ${LEAD_REST}`,
          parent: `${LEAD_START} ${LEAD_TEEN} ${LEAD_REST}`,
          adult: `${LEAD_START} ${LEAD_REST}`,
        },
      },
    ],
    rules: [
      rule(
        { understanding: ['high'], affective: ['high'], warmth: ['high'] },
        'Üç yönde de puanın yüksek: başkalarını önemsediğini, onların duygularını içinde hissettiğini ve insanlara sıcak yaklaştığını söylüyorsun. İnsanları önemsemen, duygularından etkilenmen ve bunu sıcak bir tavırla göstermen birbirini tamamlayabilir.',
        'Çocuğunuzun puanı üç yönde de yüksek: başkalarını önemsediğini, onların duygularını içinde hissettiğini ve insanlara sıcak yaklaştığını belirtiyor. İnsanları önemsemesi, duygularından etkilenmesi ve bunu sıcak bir tavırla göstermesi birbirini tamamlayabilir.',
      ),
      rule(
        { affective: ['high'], warmth: ['low'] },
        'Başkalarının duygularından derinden etkilendiğini söylüyorsun; “Sıcaklık ve destek” yönünde ise puanın düşük. Bir duyguyu içinde yoğun yaşamak ile bunu karşındakine belli edip ona destek olmak aynı şey değildir; insan çok şey hissedip bunu az dışa vurabilir.',
        'Çocuğunuz başkalarının duygularından derinden etkilendiğini belirtiyor; “Sıcaklık ve destek” yönünde ise puanı düşük. Bir duyguyu içinde yoğun yaşamak ile bunu karşısındakine belli edip ona destek olmak aynı şey değildir; insan çok şey hissedip bunu az dışa vurabilir.',
      ),
      rule(
        { understanding: ['low'], affective: ['high'] },
        'Başkalarının duygularından derinden etkilendiğini söylüyorsun; “Başkalarını düşünme” yönünde ise puanın düşük. Birinin üzüntüsünü içinde hissetmek ile onun ihtiyaçlarıyla uğraşıp ona yardım etmek her zaman birlikte gitmez; ikisi aynı kişide farklı düzeylerde olabilir.',
        'Çocuğunuz başkalarının duygularından derinden etkilendiğini belirtiyor; “Başkalarını düşünme” yönünde ise puanı düşük. Birinin üzüntüsünü içinde hissetmek ile onun ihtiyaçlarıyla uğraşıp ona yardım etmek her zaman birlikte gitmez; ikisi aynı kişide farklı düzeylerde olabilir.',
        { not: { warmth: ['low'] } },
      ),
      rule(
        { understanding: ['high'], affective: ['low'] },
        'Başkalarını önemsediğini ve onlara yardımcı olmayı sevdiğini söylüyorsun; “Duygusal duyarlılık” yönünde ise puanın düşük. Birini önemsemek için onun duygusunu aynı yoğunlukta yaşamak gerekmez.',
        'Çocuğunuz başkalarını önemsediğini ve onlara yardımcı olmayı sevdiğini belirtiyor; “Duygusal duyarlılık” yönünde ise puanı düşük. Birini önemsemek için onun duygusunu aynı yoğunlukta yaşamak gerekmez.',
        { not: { warmth: ['low'] } },
      ),
      rule(
        { understanding: ['high'], affective: ['low'], warmth: ['low'] },
        'Başkalarını önemsediğini ve onlara saygı gösterdiğini söylüyorsun; “Duygusal duyarlılık” ve “Sıcaklık ve destek” yönlerinde ise puanın düşük. Bu birleşimde başkalarına verdiğin önem, duygudan ya da sıcak bir tavırdan çok saygılı ve düşünceli davranışlarında görülebilir.',
        'Çocuğunuz başkalarını önemsediğini ve onlara saygı gösterdiğini belirtiyor; “Duygusal duyarlılık” ve “Sıcaklık ve destek” yönlerinde ise puanı düşük. Bu birleşimde başkalarına verdiği önem, duygudan ya da sıcak bir tavırdan çok saygılı ve düşünceli davranışlarında görülebilir.',
      ),
      rule(
        { affective: ['low'], warmth: ['high'] },
        'İnsanlara sıcak yaklaştığını ve onları rahatlattığını söylüyorsun; “Duygusal duyarlılık” yönünde ise puanın düşük. Birine destek olmak için onun duygusunu aynı yoğunlukta yaşamak gerekmez; senin desteğin daha çok sıcak tavrından gelebilir.',
        'Çocuğunuz insanlara sıcak yaklaştığını ve onları rahatlattığını belirtiyor; “Duygusal duyarlılık” yönünde ise puanı düşük. Birine destek olmak için onun duygusunu aynı yoğunlukta yaşamak gerekmez; onun desteği daha çok sıcak tavrından gelebilir.',
        { not: { understanding: ['high'] } },
      ),
      rule(
        { understanding: ['high'], warmth: ['low'] },
        'Başkalarının duygularına ve görüşlerine saygı gösterdiğini söylüyorsun; “Sıcaklık ve destek” yönünde ise puanın düşük. İnsanları önemsemek ile bunu sıcak bir tavırla belli etmek her zaman birlikte gitmez.',
        'Çocuğunuz başkalarının duygularına ve görüşlerine saygı gösterdiğini belirtiyor; “Sıcaklık ve destek” yönünde ise puanı düşük. İnsanları önemsemek ile bunu sıcak bir tavırla belli etmek her zaman birlikte gitmez.',
        { not: { affective: ['high', 'low'] } },
      ),
      rule(
        { warmth: ['high'], understanding: ['low'] },
        'İnsanlara sıcak bir tavırla yaklaştığını söylüyorsun; “Başkalarını düşünme” yönünde ise puanın düşük. İnsanlara sıcak davranmak ile onların bakış açısını ve ihtiyaçlarını gözetmek her zaman birlikte gitmez.',
        'Çocuğunuz insanlara sıcak bir tavırla yaklaştığını belirtiyor; “Başkalarını düşünme” yönünde ise puanı düşük. İnsanlara sıcak davranmak ile onların bakış açısını ve ihtiyaçlarını gözetmek her zaman birlikte gitmez.',
        { not: { affective: ['low', 'high'] } },
      ),
      rule(
        { understanding: ['low'], affective: ['low'], warmth: ['low'] },
        'Üç yönde de puanın düşük: başkalarıyla ilgili bu cümlelerin çoğunun seni pek anlatmadığını söylüyorsun. Bu sonuç bugünkü bakışını yansıtır ve zamanla değişebilir; aşağıdaki kartlar her yönü ayrı ayrı anlatıyor.',
        'Çocuğunuzun puanı üç yönde de düşük: başkalarıyla ilgili bu cümlelerin çoğunun onu pek anlatmadığını belirtiyor. Bu sonuç onun bugünkü bakışını yansıtır ve zamanla değişebilir; bunu bir eksiklik gibi değil, onu tanımak için bir başlangıç olarak ele alabilirsiniz.',
      ),
    ],
    fallback: {
      student: 'Senin sonuçlarında üç yön arasında dikkat çeken bir birleşim yok; her yönün ayrıntısını aşağıda görebilirsin.',
      parent: 'Çocuğunuzun sonuçlarında üç yön arasında dikkat çeken bir birleşim yok; her yönün ayrıntısı aşağıda görülüyor.',
    },
  },
  scales: {
    understanding: {
      high: t(
        'Başkalarını düşünen ve yardımsever',
        'Genel olarak başkalarının duygularına saygı gösterdiğini, onların bakış açısına değer verdiğini ve yararını da düşündüğünü söylüyorsun. Başkalarının sorunlarını ve ihtiyaçlarını önemsiyor, onlara yardımcı olmayı seviyorsun. Bu özen, insanların sana güvenmesini kolaylaştırabilir.',
        'Çocuğunuz genel olarak başkalarının duygularına saygı gösterdiğini, onların bakış açısına değer verdiğini ve yararını da düşündüğünü belirtiyor. Başkalarının sorunlarını ve ihtiyaçlarını önemsiyor, onlara yardımcı olmayı seviyor. Bu özen, insanların ona güvenmesini kolaylaştırabilir.',
      ),
      average: t(
        'Kimi zaman başkalarını, kimi zaman kendini öne alan',
        'Başkalarının ihtiyaçlarını bazen ön plana aldığını, bazen de kendi işlerine ve önceliklerine yöneldiğini söylüyorsun. Birçok insan bu dengeyi kurar.',
        'Çocuğunuz başkalarının ihtiyaçlarını bazen ön plana aldığını, bazen de kendi işlerine ve önceliklerine yöneldiğini belirtiyor. Birçok insan bu dengeyi kurar.',
      ),
      low: t(
        'Kendi önceliklerine odaklanan',
        'Genel olarak başkalarının ihtiyaçlarından çok kendi işlerine ve önceliklerine odaklandığını söylüyorsun. Bu sonuç bir yargı değildir: yoğun ya da yorucu dönemlerde insanın başkalarına ayırabildiği güç azalabilir. Başkalarının bakış açısını merak edip sormak, ilişkilerinde işine yarayabilir.',
        'Çocuğunuz genel olarak başkalarının ihtiyaçlarından çok kendi işlerine ve önceliklerine odaklandığını belirtiyor. Bu sonuç bir yargı değildir: yoğun ya da yorucu dönemlerde insanın başkalarına ayırabildiği güç azalabilir. Başkalarının bakış açısını merak edip sorması, ilişkilerinde işine yarayabilir.',
      ),
    },
    affective: {
      high: t(
        'Duygulardan derinden etkilenen',
        'Genel olarak başkalarının duygularını içinde hissettiğini, onların derdiyle dertlendiğini ve kendi duygularını da yoğun yaşadığını söylüyorsun; gözlerin kolayca dolabilir. Bu duyarlılık, insanlara yakınlık duymanı kolaylaştırabilir. Başkalarının acısı seni yorduğunda biraz ara vermek ve kendine iyi bakmak da önemlidir.',
        'Çocuğunuz genel olarak başkalarının duygularını içinde hissettiğini, onların derdiyle dertlendiğini ve kendi duygularını da yoğun yaşadığını belirtiyor; gözleri kolayca dolabilir. Bu duyarlılık, insanlara yakınlık duymasını kolaylaştırabilir. Başkalarının acısı onu yorduğunda biraz ara vermesi ve kendine iyi bakması da önemlidir.',
      ),
      average: t(
        'Duruma göre duygulanan',
        'Bazı durumlarda başkalarının duygularından etkilendiğini, bazı durumlarda ise daha sakin kaldığını söylüyorsun; bu, yaşanan olaya ve kişiye göre değişebilir.',
        'Çocuğunuz bazı durumlarda başkalarının duygularından etkilendiğini, bazı durumlarda ise daha sakin kaldığını belirtiyor; bu, yaşanan olaya ve kişiye göre değişebilir.',
      ),
      low: t(
        'Duygulardan kolay kolay etkilenmeyen',
        'Genel olarak pek duygulanmadığını söylüyorsun; başkalarının başına gelen üzücü olaylar karşısında da sakin kalabilirsin. Bu, insanları önemsemediğin anlamına gelmez: duygulara kapılmamak, zor anlarda düşünerek davranmana yardım edebilir.',
        'Çocuğunuz genel olarak pek duygulanmadığını belirtiyor; başkalarının başına gelen üzücü olaylar karşısında da sakin kalabilir. Bu, insanları önemsemediği anlamına gelmez: duygulara kapılmamak, zor anlarda düşünerek davranmasına yardım edebilir.',
      ),
    },
    warmth: {
      high: t(
        'Sıcak ve destekleyici',
        'Genel olarak insanlara ilgi duyduğunu, insanların senin yanında rahat etmesini sağladığını, hâl hatır sorduğunu ve üzgün birini nasıl teselli edeceğini bildiğini söylüyorsun. Bu sıcaklık, çevrendeki insanlara iyi gelebilir.',
        'Çocuğunuz genel olarak insanlara ilgi duyduğunu, insanların onun yanında rahat etmesini sağladığını, hâl hatır sorduğunu ve üzgün birini nasıl teselli edeceğini bildiğini belirtiyor. Bu sıcaklık, çevresindeki insanlara iyi gelebilir.',
      ),
      average: t(
        'Duruma göre sıcak',
        'İnsanlara bazen sıcak ve yakın davrandığını, bazen de daha ölçülü kalmayı seçtiğini söylüyorsun; bu, kiminle ve hangi ortamda olduğuna göre değişebilir.',
        'Çocuğunuz insanlara bazen sıcak ve yakın davrandığını, bazen de daha ölçülü kalmayı seçtiğini belirtiyor; bu, kiminle ve hangi ortamda olduğuna göre değişebilir.',
      ),
      low: t(
        'Mesafeli ve ölçülü',
        'Genel olarak sıcaklığını pek dışa vurmadığını; insanlara yaklaşmakta, onları rahatlatmakta ve teselli etmekte daha ölçülü davrandığını söylüyorsun. Bu, insanlara değer vermediğin anlamına gelmez; insanlar değer verdiklerini farklı yollarla gösterebilir.',
        'Çocuğunuz genel olarak sıcaklığını pek dışa vurmadığını; insanlara yaklaşmakta, onları rahatlatmakta ve teselli etmekte daha ölçülü davrandığını belirtiyor. Bu, insanlara değer vermediği anlamına gelmez; insanlar değer verdiklerini farklı yollarla gösterebilir.',
      ),
    },
  },
};
