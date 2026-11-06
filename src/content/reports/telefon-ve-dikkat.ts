import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Ders Çalışırken Telefon ve Dikkat: rapor metinleri.
 *
 * Dayanaklar (araştırma cümlelerinin her biri bunlardan birine dayanır; künyeler bilim kartında):
 *  - Stothart ve ark. (2015): bildirime bakmayan katılımcılar da dikkat isteyen bir işte daha çok hata yaptı.
 *  - Rosen ve ark. (2013): evde 15 dakika çalışırken gözlenen ortaokul, lise ve üniversite öğrencileri ortalama altı dakikadan
 *    kısa sürede başka bir şeye geçti; en sık nedenler mesajlar, sosyal medya ve işler arasında geçmeyi sevmekti.
 *  - Parry ve ark. (2021): insanların telefon kullanımına ilişkin kendi bildirimi cihaz kayıtlarıyla yalnızca orta düzeyde
 *    örtüşür (girişteki "çoğu zaman tam kestiremez").
 * İlkeler: telefon kullanımı bir kusur gibi, az kullanım bir başarı notu gibi anlatılmaz; "bağımlılık" ya da klinik bir sözcük
 * yoktur. Sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır.
 * Kartlar sonucu anlatır, öneri vermez (öneriler yol haritasındadır). Bir araştırma bulgusu bir raporda bir kez anılır.
 * Destek kutusu yoktur. Metinler okula özgü sözcük taşımaz; yetişkine öğrenci metinleri gösterilir (yalnızca bir araştırma
 * cümlesinin yetişkin metni ayrıdır: "öğrenciler" yerine "gençler").
 *
 * Birlikte yorum ("Birlikte bakınca"): giriş her raporda aynıdır (telefon bir araç da olabilir; sonuç öz bildirime dayanır).
 * Ardından bölünmenin üç yanından yüksek olan her biri için bir cümle (bildirimler, geçiş, dönme isteği); hiçbiri yüksek
 * değilse üçü de düşükken bir, öteki durumlarda bir cümle. Sonra kendini durdurma yolları: bölünmenin bir yanı yüksekken
 * yollar düşük ya da yüksekse birer cümle; hiçbiri yüksek değilken yollar yüksekse bir cümle, dört alan da düşükse (telefonu
 * olmayan biri gibi) bir cümle (tests/telefon-ve-dikkat.test.ts bütün 81 birleşimde denetler).
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

const rule = (when: InsightRule['when'], student: string, parent: string, not?: InsightRule['not'], adult?: string): InsightRule => ({
  when,
  ...(not ? { not } : {}),
  text: { student, parent, ...(adult ? { adult } : {}) },
});

const NOT_HIGH = ['low', 'average'] as const;
/** Bölünmenin üç yanından hiçbiri yüksek değil (`not` ile: en az biri yüksek). */
const NONE_HIGH = { notify: [...NOT_HIGH], switching: [...NOT_HIGH], pull: [...NOT_HIGH] };
const ALL_LOW = { notify: ['low' as const], switching: ['low' as const], pull: ['low' as const] };

const OVERVIEW =
  'Her satır bir alan. İlk üç satır telefonun ve ekranların çalışmayı bölmesinin yanlarıdır: puan 5’e yaklaştıkça bölünme daha sık yaşanıyor. Son satır kendini durdurma yollarıdır: puan 5’e yaklaştıkça bu yollar daha sık kullanılıyor. Değerler 1 (hiçbir zaman) ile 5 (her zaman) arasındadır; bu bir başarı puanı değildir.';

const LEAD =
  'Telefon çalışırken işe yarayan bir araç da olabilir, dikkati bölen bir şey de. Bu rapor telefonun ve ekranların çalışmanı ne sıklıkla böldüğünü ve bunun önüne geçmek için hangi yolları kullandığını anlatır. Sonuçlar kendi gözlemine dayanır: insanlar telefona ne sıklıkla baktıklarını çoğu zaman tam kestiremez.';
const LEAD_PARENT =
  'Telefon çalışırken işe yarayan bir araç da olabilir, dikkati bölen bir şey de. Bu rapor telefonun ve ekranların çocuğunuzun çalışmasını ne sıklıkla böldüğünü ve bunun önüne geçmek için hangi yolları kullandığını anlatır. Sonuçlar onun kendi gözlemine dayanır: insanlar telefona ne sıklıkla baktıklarını çoğu zaman tam kestiremez.';

const OBSERVED =
  'ortalama altı dakikadan kısa sürede başka bir şeye geçmiştir. En sık nedenler mesajlar, sosyal medya ve işler arasında geçmeyi sevmektir.';

export const telefonVeDikkatReport: ReportTemplate = {
  version: 'telefon-ve-dikkat-rapor-1',
  bandLabels: { low: 'Düşük', average: 'Orta', high: 'Yüksek' },
  overview: { student: OVERVIEW, parent: OVERVIEW },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote:
      'Alanların birlikte yorumu: telefonun çalışmayı hangi yoldan böldüğü, araştırmaların bu konuda ne bulduğu ve kendini durdurma yollarının buna nasıl eşlik ettiği',
    lead: [{ when: {}, text: { student: LEAD, parent: LEAD_PARENT } }],
    rules: [
      // Bölünmenin yüksek olan her yanı için bir cümle; hiçbiri yüksek değilse üçü düşükken ya da öteki durumlarda bir cümle.
      rule(
        { notify: ['high'] },
        'Bildirimlerin çekimi puanın yüksek. Bir deneyde, telefonlarına gelen bildirime bakmayan katılımcılar da dikkat isteyen bir işte daha çok hata yapmıştır: bildirimin kendisi de dikkati bölebilir.',
        'Çocuğunuzun bildirimlerin çekimi puanı yüksek. Bir deneyde, telefonlarına gelen bildirime bakmayan katılımcılar da dikkat isteyen bir işte daha çok hata yapmıştır: bildirimin kendisi de dikkati bölebilir.',
      ),
      rule(
        { switching: ['high'] },
        `Ekranlar arası geçiş puanın yüksek. Bir araştırmada evlerinde çalışırken dakika dakika gözlenen öğrenciler ${OBSERVED}`,
        `Çocuğunuzun ekranlar arası geçiş puanı yüksek. Bir araştırmada evlerinde çalışırken dakika dakika gözlenen öğrenciler ${OBSERVED}`,
        undefined,
        `Ekranlar arası geçiş puanın yüksek. Bir araştırmada evlerinde çalışırken dakika dakika gözlenen gençler ${OBSERVED}`,
      ),
      rule(
        { pull: ['high'] },
        'Telefona dönme isteği puanın yüksek: bildirim gelmeden de telefona uzandığını söylüyorsun. Bu istek zamanla oluşmuş bir alışkanlık olabilir; alışkanlıklar küçük adımlarla değişebilir.',
        'Çocuğunuzun telefona dönme isteği puanı yüksek: bildirim gelmeden de telefona uzandığını belirtiyor. Bu istek zamanla oluşmuş bir alışkanlık olabilir; alışkanlıklar küçük adımlarla değişebilir.',
      ),
      rule(
        ALL_LOW,
        'Bildirimlerde, ekranlar arası geçişte ve telefona dönme isteğinde puanın düşük: telefon ve ekranlar çalışmanı genellikle bölmüyor gibi görünüyor.',
        'Çocuğunuzun puanı bildirimlerde, ekranlar arası geçişte ve telefona dönme isteğinde düşük: telefon ve ekranlar onun çalışmasını genellikle bölmüyor gibi görünüyor.',
      ),
      rule(
        NONE_HIGH,
        'Bildirimlerde, ekranlar arası geçişte ve telefona dönme isteğinde puanın yüksek değil. Telefon ve ekranlar çalışmanı zaman zaman bölse de bu sık yaşanmıyor gibi görünüyor.',
        'Çocuğunuzun puanı bildirimlerde, ekranlar arası geçişte ve telefona dönme isteğinde yüksek değil. Telefon ve ekranlar onun çalışmasını zaman zaman bölse de bu sık yaşanmıyor gibi görünüyor.',
        ALL_LOW,
      ),
      // Kendini durdurma yolları: bölünmenin en az bir yanı yüksekken düşük ya da yüksek; hiçbiri yüksek değilken yüksek;
      // dört alan da düşükken.
      rule(
        { control: ['low'] },
        'Kendini durdurma yollarını az kullandığını söylüyorsun. Bu yollar öğrenilebilir; sayfanın sonundaki öneriler küçük bir başlangıç olabilir.',
        'Çocuğunuz kendini durdurma yollarını az kullandığını belirtiyor. Bu yollar öğrenilebilir; sayfanın sonundaki öneriler ona nasıl eşlik edebileceğinizi anlatıyor.',
        NONE_HIGH,
      ),
      rule(
        { control: ['high'] },
        'Kendini durdurma yollarını sık kullandığını da söylüyorsun; yine de telefon ya da ekranlar araya girebiliyor. Bu puan yolların ne sıklıkla kullanıldığını gösterir, ne kadar işe yaradığını göstermez.',
        'Çocuğunuz kendini durdurma yollarını sık kullandığını da belirtiyor; yine de telefon ya da ekranlar araya girebiliyor. Bu puan yolların ne sıklıkla kullanıldığını gösterir, ne kadar işe yaradığını göstermez.',
        NONE_HIGH,
      ),
      rule(
        { control: ['high'], ...NONE_HIGH },
        'Kendini durdurma yollarını da sık kullandığını söylüyorsun; bu yollar telefonun çalışmanı bölmemesine yardım ediyor olabilir.',
        'Çocuğunuz kendini durdurma yollarını da sık kullandığını belirtiyor; bu yollar telefonun onun çalışmasını bölmemesine yardım ediyor olabilir.',
      ),
      rule(
        { control: ['low'], ...ALL_LOW },
        'Kendini durdurma yollarını da az kullandığını söylüyorsun. Çalışman pek bölünmüyorsa ya da yanında telefon veya tablet olmuyorsa bu beklenen bir durumdur.',
        'Çocuğunuz kendini durdurma yollarını da az kullandığını belirtiyor. Çalışması pek bölünmüyorsa ya da yanında telefon veya tablet olmuyorsa bu beklenen bir durumdur.',
      ),
    ],
  },
  scales: {
    notify: {
      high: t(
        'Bildirimler sık bölüyor',
        'Çalışırken gelen bildirimlerin seni sık sık işinden kopardığını söylüyorsun: sesi duyunca ya da ekran yanınca telefona bakabiliyor, bakmasan da aklın bir süre ona gidebiliyor. Mesajlara hemen cevap vermen gerektiğini hissetmek de bunu artırabilir.',
        'Çocuğunuz çalışırken gelen bildirimlerin onu sık sık işinden kopardığını belirtiyor: sesi duyunca ya da ekran yanınca telefona bakabiliyor, bakmasa da aklı bir süre ona gidebiliyor. Mesajlara hemen cevap vermesi gerektiğini hissetmek de bunu artırabilir.',
      ),
      average: t(
        'Bildirimler bazen bölüyor',
        'Bildirimlerin işini bazen böldüğünü, bazen de aklının işinde kaldığını söylüyorsun. Bu, bildirimin kimden geldiğine ya da o an işine ne kadar daldığına göre değişebilir.',
        'Çocuğunuz bildirimlerin işini bazen böldüğünü, bazen de aklının işinde kaldığını belirtiyor. Bu, bildirimin kimden geldiğine ya da o an işine ne kadar daldığına göre değişebilir.',
      ),
      low: t(
        'Bildirimler pek bölmüyor',
        'Çalışırken gelen bildirimlerin seni genellikle işinden koparmadığını, aklının çoğu zaman işinde kaldığını söylüyorsun. Telefonun sessizdeyse ya da yanında değilse de bu alanda puan düşük çıkabilir.',
        'Çocuğunuz çalışırken gelen bildirimlerin onu genellikle işinden koparmadığını, aklının çoğu zaman işinde kaldığını belirtiyor. Telefonu sessizdeyse ya da yanında değilse de bu alanda puan düşük çıkabilir.',
      ),
    },
    switching: {
      high: t(
        'Ekranlar arasında sık geçiş',
        'Çalışırken sık sık telefona ya da başka bir ekrana geçtiğini söylüyorsun; okurken ya da yazarken mesajlaşmak da bunlardan biri olabilir. Her geçişten sonra nerede kaldığını bulmak biraz zaman alabilir; bu yüzden çalışma uzayabilir.',
        'Çocuğunuz çalışırken sık sık telefona ya da başka bir ekrana geçtiğini belirtiyor; okurken ya da yazarken mesajlaşmak da bunlardan biri olabilir. Her geçişten sonra nerede kaldığını bulmak biraz zaman alabilir; bu yüzden çalışma uzayabilir.',
      ),
      average: t(
        'Ara sıra geçiş',
        'Bazen bir süre yalnızca işinle ilgilendiğini, bazen de araya telefonu ya da başka bir ekranı soktuğunu söylüyorsun. Bu, işin ne kadar ilgini çektiğine göre değişebilir.',
        'Çocuğunuz bazen bir süre yalnızca işiyle ilgilendiğini, bazen de araya telefonu ya da başka bir ekranı soktuğunu belirtiyor. Bu, işin ne kadar ilgisini çektiğine göre değişebilir.',
      ),
      low: t(
        'Dikkat genellikle işte',
        'Çalışırken genellikle mola verene kadar elindeki işle ilgilendiğini, başka ekranlara pek geçmediğini söylüyorsun.',
        'Çocuğunuz çalışırken genellikle mola verene kadar elindeki işle ilgilendiğini, başka ekranlara pek geçmediğini belirtiyor.',
      ),
    },
    pull: {
      high: t(
        'Telefona sık uzanma',
        'Bildirim gelmese de sık sık telefonu eline aldığını, aklına bir şey gelince hemen ona baktığını ya da zorlanınca ona uzandığını söylüyorsun. Telefon pek çok şeyi bir arada sunduğundan bu isteği duymak şaşırtıcı değildir.',
        'Çocuğunuz bildirim gelmese de sık sık telefonu eline aldığını, aklına bir şey gelince hemen ona baktığını ya da zorlanınca ona uzandığını belirtiyor. Telefon pek çok şeyi bir arada sunduğundan bu isteği duyması şaşırtıcı değildir.',
      ),
      average: t(
        'Ara sıra telefona uzanma',
        'Bazen bildirim gelmeden de telefona uzandığını, bazen ise telefonu düşünmeden işine dalabildiğini söylüyorsun. Bu istek işin zorluğuna ya da o günkü yorgunluğuna göre değişebilir.',
        'Çocuğunuz bazen bildirim gelmeden de telefona uzandığını, bazen ise telefonu düşünmeden işine dalabildiğini belirtiyor. Bu istek işin zorluğuna ya da o günkü yorgunluğuna göre değişebilir.',
      ),
      low: t(
        'Telefon pek akla gelmiyor',
        'Çalışırken telefonu pek aklına getirmediğini, bildirim gelmedikçe ona uzanmadığını söylüyorsun.',
        'Çocuğunuz çalışırken telefonu pek aklına getirmediğini, bildirim gelmedikçe ona uzanmadığını belirtiyor.',
      ),
    },
    control: {
      high: t(
        'Yolları sık kullanıyor',
        'Çalışmadan önce telefonu sessize almak, görmeyeceğin bir yere koymak ya da ne zaman bakacağını önceden belirlemek gibi yolları sık kullandığını söylüyorsun.',
        'Çocuğunuz çalışmadan önce telefonu sessize almak, görmeyeceği bir yere koymak ya da ne zaman bakacağını önceden belirlemek gibi yolları sık kullandığını belirtiyor.',
      ),
      average: t(
        'Yolları bazen kullanıyor',
        'Bu yollardan bazılarını bazen kullandığını söylüyorsun; hangisine ne zaman başvurduğun işe ya da güne göre değişebilir.',
        'Çocuğunuz bu yollardan bazılarını bazen kullandığını belirtiyor; hangisine ne zaman başvurduğu işe ya da güne göre değişebilir.',
      ),
      low: t(
        'Yolları az kullanıyor',
        'Telefonu sessize almak, uzağa koymak ya da ne zaman bakacağını belirlemek gibi yolları az kullandığını söylüyorsun. Telefon çalışmanı pek bölmüyorsa bunlara daha az ihtiyaç duyuyor olabilirsin.',
        'Çocuğunuz telefonu sessize almak, uzağa koymak ya da ne zaman bakacağını belirlemek gibi yolları az kullandığını belirtiyor. Telefon çalışmasını pek bölmüyorsa bunlara daha az ihtiyaç duyuyor olabilir.',
      ),
    },
  },
};
