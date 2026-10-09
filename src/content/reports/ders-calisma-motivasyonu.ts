import type { ReportTemplate } from './types';

/**
 * Ders Çalışma Motivasyonu: rapor metinleri.
 *
 * Dayanaklar (metinlerdeki her araştırma cümlesi bunlardan birine dayanır):
 *  - Ryan ve Deci (2000): türlerin tanımları; motivasyonsuzluğun nedenleri (bir işe değer vermemek, onu yapabileceğine
 *    inanmamak, bir sonuç getireceğini beklememek); başarıya bağlı somut ödüllerin ve tehdit, baskılı değerlendirme gibi
 *    uygulamaların iç motivasyonu azalttığı; anlamlı gerekçe ile özerklik ve yakınlık desteğinin benimsemeyi artırdığı.
 *  - Ryan ve Connell (1989; 3–6. sınıf): dört neden türü arasında kaygı en çok iç baskıyla (içe atılmış düzenleme)
 *    ilişkili; iç baskı çabayla da ilişkili, dış baskı değil.
 *  - Vansteenkiste ve ark. (2009; Belçika, 7–12. sınıf ve üniversite): dört profil (öbekleme). İyi nitelikli (istek yüksek,
 *    baskı düşük): en az erteleme, öğrenme yöntemlerinde en iyi gruplardan (yüksek miktarlı grupla birlikte), baskısı
 *    yüksek gruplardan daha az sınav kaygısı, 7–12. sınıfta en yüksek not ortalaması. Yüksek miktarda (ikisi de yüksek):
 *    yöntem kullanımı iyi, ama iki çalışmada da iyi nitelikli gruptan daha fazla sınav kaygısı. Düşük nitelikli (istek
 *    düşük, baskı yüksek): en çok erteleme, iyi nitelikli gruptan daha fazla kaygı; baskının motivasyonsuzluğa göre bir
 *    yararı görülmedi. Düşük miktarda (ikisi de düşük): yöntem kullanımı en düşükler arasında.
 *  - Howard ve ark. (2021, 344 örneklem): merak ve keyif başarı ve iyi oluşla; önemini görme özellikle sebatla (vazgeçmeden
 *    sürdürme); iç baskı sebatla ama iyi olmama göstergeleriyle de; dış baskı başarı ve sebatla değil, daha düşük iyi
 *    oluşla; motivasyonsuzluk olumsuz sonuçlarla ilişkili.
 *  - Bureau ve ark. (2022): kendini yeterli hissetmek, kendi isteğiyle çalışmanın en güçlü yordayıcısı ve
 *    motivasyonsuzluğun (ters yönde) en güçlü yordayıcısı; öğretmenin özerklik desteği bunları besliyor.
 * Bulgular ilişkiseldir: metinler "neden olur" ya da "yarar" demez; "ilişkili", "birlikte görülüyor" der. Öneriler
 * "-abilir" diye yazılır; söz verilmez.
 *
 * Tutarlılık: profil metinleri yalnızca bileşik ölçekleri ("kendi isteğine dayalı nedenler", "baskıya dayalı nedenler")
 * "genel olarak" anlatır; bir alt türün durumunu söylemez. Bileşik ölçek yüksek değilken alt türlerinden biri yüksekse
 * `hidden`, değilse alt türler arasında belirgin fark varsa `lean` cümlesi eklenir. Grup metinleri tanımdır, kişi hakkında
 * hüküm vermez. Hiçbir metin öğrenciyi suçlamaz; motivasyon kalıcı bir özellik değildir, ortama göre değişir. Destek
 * kutusu (acil durum numarası) gösterilmez: motivasyon bir kriz değildir; iç baskı ve isteksizlik yüksekken metinler bir
 * rehber öğretmenle (psikolojik danışmanla) konuşmayı önerir. 13 mezunları da kapsar: "okulundaki" denmez.
 */

const p = (summary: string, student: string, parent: string, tipsStudent: string[], tipsParent: string[]) => ({
  summary,
  student,
  parent,
  tipsStudent,
  tipsParent,
});

export const dersCalismaMotivasyonuReport: ReportTemplate = {
  version: 'ders-calisma-motivasyonu-1',
  bandLabels: { low: 'Düşük', average: 'Orta', high: 'Yüksek' },
  motivation: {
    x: 'autonomous',
    y: 'controlled',
    alone: 'amotivation',
    chartNote: {
      student:
        'Yatay eksen kendi isteğinle çalışmayı (merak ve keyif ile önemini görme), dikey eksen baskıyla çalışmayı (iç baskı ile dış baskı ve ödül) gösterir; kırmızı nokta senin yerin. Kesikli çizgiler düşük, orta ve yüksek düzeylerin sınırıdır. Köşelerdeki adlar, araştırmalarda öğrenciler arasında bulunan dört motivasyon profilidir; en olumlu sonuçlarla ilişkili olan, sağ alttaki isteğe dayalı motivasyondur. Haritada yer almayan isteksizlik aşağıda ayrıca gösterilir.',
      parent:
        'Yatay eksen kendi isteğiyle çalışmayı (merak ve keyif ile önemini görme), dikey eksen baskıyla çalışmayı (iç baskı ile dış baskı ve ödül) gösterir; kırmızı nokta çocuğunuzun yeridir. Kesikli çizgiler düşük, orta ve yüksek düzeylerin sınırıdır. Köşelerdeki adlar, araştırmalarda öğrenciler arasında bulunan dört motivasyon profilidir; en olumlu sonuçlarla ilişkili olan, sağ alttaki isteğe dayalı motivasyondur. Haritada yer almayan isteksizlik aşağıda ayrıca gösterilir.',
    },
    groupText: {
      autonomous: {
        student:
          'Merak ve keyif ile önemini görme birlikte: ders çalışmanın nedeninin kişinin kendi isteğinden gelmesi. Kuramdaki adı özerk motivasyon; araştırmalarda başarı, vazgeçmeden sürdürme ve kendini iyi hissetmeyle en olumlu ilişkili motivasyon budur.',
        parent:
          'Merak ve keyif ile önemini görme birlikte: ders çalışmanın nedeninin kişinin kendi isteğinden gelmesi. Kuramdaki adı özerk motivasyondur; araştırmalarda başarı, vazgeçmeden sürdürme ve kendini iyi hissetmeyle en olumlu ilişkili motivasyon budur.',
      },
      controlled: {
        student:
          'İç baskı ile dış baskı ve ödül birlikte: ders çalışmanın nedeninin bir baskı ya da beklenti olması. Bu baskı içten (suçluluk, utanç, kendini kanıtlama) ya da dışarıdan (ödül, ceza, denetim) gelebilir. Kuramdaki adı kontrollü motivasyon; araştırmalarda kaygıyla birlikte görülüyor.',
        parent:
          'İç baskı ile dış baskı ve ödül birlikte: ders çalışmanın nedeninin bir baskı ya da beklenti olması. Bu baskı içten (suçluluk, utanç, kendini kanıtlama) ya da dışarıdan (ödül, ceza, denetim) gelebilir. Kuramdaki adı kontrollü motivasyondur; araştırmalarda kaygıyla birlikte görülüyor.',
      },
      amotivation: {
        student: 'Ders çalışmak için bir neden görememe ya da çabanın bir sonuç getirmeyeceğini düşünme. Kuramdaki adı motivasyonsuzluk.',
        parent: 'Ders çalışmak için bir neden görememe ya da çabanın bir sonuç getirmeyeceğini düşünme. Kuramdaki adı motivasyonsuzluktur.',
      },
    },
    patterns: {
      'high-low': {
        name: 'İsteğe dayalı motivasyon',
        student:
          'Ders çalışma nedenlerin çoğunlukla kendi isteğine dayanıyor: konuları ilginç buluyor ya da öğrenmenin sana ne kazandırdığını görüyorsun. Baskıya dayalı nedenlerin ise genel olarak az. Araştırmalarda bu düzen “iyi nitelikli motivasyon” diye anılıyor: bu düzendeki öğrenciler öğrenme yöntemlerini en iyi kullanan gruplar arasında, en az erteleyen grup oluyor ve baskısı yüksek olan öğrencilere göre daha az sınav kaygısı yaşıyor; 7–12. sınıf öğrencileriyle yapılan bir araştırmada not ortalamaları da en yüksekti. Bu, her konuda her zaman istekli olacağın anlamına gelmez; isteğin azaldığı dönemlerde neden çalıştığını hatırlamak işini kolaylaştırabilir.',
        parent:
          'Çocuğunuzun ders çalışma nedenleri çoğunlukla kendi isteğine dayanıyor: konuları ilginç buluyor ya da öğrenmenin kendisine ne kazandırdığını görüyor. Baskıya dayalı nedenleri ise genel olarak az. Araştırmalarda bu düzen “iyi nitelikli motivasyon” diye anılıyor: bu düzendeki öğrenciler öğrenme yöntemlerini en iyi kullanan gruplar arasında, en az erteleyen grup oluyor ve baskısı yüksek olan öğrencilere göre daha az sınav kaygısı yaşıyor; 7–12. sınıf öğrencileriyle yapılan bir araştırmada not ortalamaları da en yüksekti. Bu motivasyon, görüşlerine alan bırakan, yapabildiklerini fark eden ve ona yakın duran bir ortamda daha kolay korunabilir.',
      },
      'high-average': {
        name: 'İstek önde, biraz baskı',
        student:
          'Ders çalışma nedenlerin çoğunlukla kendi isteğine dayanıyor; baskıya dayalı nedenlerin ise genel olarak orta düzeyde (içinden gelen bir “çalışmalıyım” sesi ya da çevrenin beklentisi gibi). Bu birçok öğrencide görülebilir. Araştırmalarda istekle birlikte baskısı da yüksek olan öğrencilerin, yalnızca istekle çalışanlara göre daha fazla sınav kaygısı yaşadığı görülüyor. İsteğin zaten güçlü; neden çalıştığını kendi cümlelerinle hatırlamak baskının payını azaltabilir.',
        parent:
          'Çocuğunuzun ders çalışma nedenleri çoğunlukla kendi isteğine dayanıyor; baskıya dayalı nedenleri ise genel olarak orta düzeyde (içten gelen bir “çalışmalıyım” sesi ya da çevrenin beklentisi gibi). Bu birçok öğrencide görülebilir. Araştırmalarda istekle birlikte baskısı da yüksek olan öğrencilerin, yalnızca istekle çalışanlara göre daha fazla sınav kaygısı yaşadığı görülüyor. Beklentileri baskı yerine anlamlı gerekçelerle paylaşmak baskının payını azaltabilir.',
      },
      'high-high': {
        name: 'Hem istek hem baskı',
        student:
          'Hem kendi isteğine dayalı nedenlerin hem de baskıya dayalı nedenlerin güçlü: konuları önemsiyor ya da ilginç buluyorsun; aynı zamanda suçluluk, utanç, ödül ya da ceza gibi baskılar da seni çalıştırıyor. Araştırmalarda bu düzen “yüksek miktarda motivasyon” diye anılıyor. Bu düzendeki öğrenciler öğrenme yöntemlerini iyi kullanıyor; ama yalnızca isteğiyle çalışan öğrencilere göre daha fazla sınav kaygısı yaşıyor. Yani bu araştırmalarda baskının isteğe bir yarar eklediği görülmedi. İsteğin zaten güçlü; baskının payını azaltmak işini kolaylaştırabilir.',
        parent:
          'Çocuğunuzun hem kendi isteğine dayalı nedenleri hem de baskıya dayalı nedenleri güçlü: konuları önemsiyor ya da ilginç buluyor; aynı zamanda suçluluk, utanç, ödül ya da ceza gibi baskılar da onu çalıştırıyor. Araştırmalarda bu düzen “yüksek miktarda motivasyon” diye anılıyor. Bu düzendeki öğrenciler öğrenme yöntemlerini iyi kullanıyor; ama yalnızca isteğiyle çalışan öğrencilere göre daha fazla sınav kaygısı yaşıyor. Yani bu araştırmalarda baskının isteğe bir yarar eklediği görülmedi. İsteği zaten güçlü; ödül, ceza ve karşılaştırma yerine anlamlı gerekçeler ve sakin bir tutum baskının payını azaltabilir.',
      },
      'average-low': {
        name: 'Biraz istek, az baskı',
        student:
          'Kendi isteğine dayalı nedenlerin genel olarak orta düzeyde; baskıya dayalı nedenlerin ise genel olarak az. İstek var ama henüz çok güçlü değil. Bu durumda isteği büyütmek iyi bir yol olabilir: bir konunun sana ne kazandıracağını kendi cümlelerinle bulmak, ilgini çeken bir yanını keşfetmek ve küçük başarılarını fark etmek. Araştırmalarda kendini yeterli hissetmek, kendi isteğiyle çalışmayla en güçlü ilişkili etkenlerden biri.',
        parent:
          'Çocuğunuzun kendi isteğine dayalı nedenleri genel olarak orta düzeyde; baskıya dayalı nedenleri ise genel olarak az. İstek var ama henüz çok güçlü değil. Bu durumda isteği büyütmek iyi bir yol olabilir: bir konunun ne kazandıracağını birlikte konuşmak, ilgisini çeken yanlarını keşfetmesine fırsat vermek ve küçük başarılarını fark etmek. Araştırmalarda kendini yeterli hissetmek, kendi isteğiyle çalışmayla en güçlü ilişkili etkenlerden biri.',
      },
      'average-average': {
        name: 'Karışık nedenler',
        student:
          'Ders çalışma nedenlerin karışık: kendi isteğine dayalı nedenler de baskıya dayalı nedenler de genel olarak orta düzeyde; ikisi de belirgin biçimde öne çıkmıyor. Bu birçok öğrencide görülebilir ve derse ya da döneme göre değişebilir. Hangi derslerde isteğinle, hangilerinde baskıyla çalıştığını fark etmek iyi bir başlangıç olur. Araştırmalarda en olumlu sonuçlarla ilişkili olan düzen, isteğin güçlü, baskının az olmasıdır.',
        parent:
          'Çocuğunuzun ders çalışma nedenleri karışık: kendi isteğine dayalı nedenler de baskıya dayalı nedenler de genel olarak orta düzeyde; ikisi de belirgin biçimde öne çıkmıyor. Bu birçok öğrencide görülebilir ve derse ya da döneme göre değişebilir. Hangi derslerde isteğiyle, hangilerinde baskıyla çalıştığını onunla konuşmak iyi bir başlangıç olur. Araştırmalarda en olumlu sonuçlarla ilişkili olan düzen, isteğin güçlü, baskının az olmasıdır.',
      },
      'average-high': {
        name: 'Baskı önde, biraz istek',
        student:
          'Baskıya dayalı nedenlerin (suçluluk, utanç, ödül, ceza ya da denetim gibi) güçlü; kendi isteğine dayalı nedenlerin ise genel olarak orta düzeyde. Bazı konuları önemsiyor ya da ilginç buluyorsun, ama seni çalıştıran şey çoğu zaman bir baskı. Araştırmalarda baskıya dayalı çalışma kaygıyla ve ertelemeyle birlikte görülüyor. İsteğin payını büyütmek (bir konunun sana ne kazandıracağını kendin bulmak, ilgini çeken yanlarını keşfetmek) çalışmayı kolaylaştırabilir.',
        parent:
          'Çocuğunuzun baskıya dayalı nedenleri (suçluluk, utanç, ödül, ceza ya da denetim gibi) güçlü; kendi isteğine dayalı nedenleri ise genel olarak orta düzeyde. Bazı konuları önemsiyor ya da ilginç buluyor, ama onu çalıştıran şey çoğu zaman bir baskı. Araştırmalarda baskıya dayalı çalışma kaygıyla ve ertelemeyle birlikte görülüyor. Ödül, ceza ve denetimi azaltıp yerine anlamlı gerekçeler koymak, onun görüşüne alan bırakmak ve yapabildiklerini fark etmek isteğin payını büyütebilir.',
      },
      'low-low': {
        name: 'Az istek, az baskı',
        student:
          'Hem kendi isteğine hem de baskıya dayalı nedenler sana genel olarak pek uymuyor. Araştırmalarda bu düzen “düşük miktarda motivasyon” diye anılıyor; bu düzendeki öğrencilerin öğrenme yöntemlerini daha az kullandığı görülüyor. Bu kalıcı bir durum değil ve değişebilir. Kurama göre bir işe karşı isteksizlik; ona değer vermemekten, onu yapabileceğine inanmamaktan ya da çabanın bir sonuç getirmeyeceğini düşünmekten doğabilir. Küçük ve başarabileceğin hedeflerle başlamak, yapabildiğini görmene yardım edebilir. Ders çalışmak sana genel olarak anlamsız geliyorsa bunu güvendiğin bir yetişkinle ya da bir rehber öğretmenle konuşabilirsin.',
        parent:
          'Hem kendi isteğine hem de baskıya dayalı nedenler çocuğunuza genel olarak pek uymuyor. Araştırmalarda bu düzen “düşük miktarda motivasyon” diye anılıyor; bu düzendeki öğrencilerin öğrenme yöntemlerini daha az kullandığı görülüyor. Bu bir tembellik işareti değildir; kalıcı bir durum da değildir ve değişebilir. Kurama göre bir işe karşı isteksizlik; ona değer vermemekten, onu yapabileceğine inanmamaktan ya da çabanın bir sonuç getirmeyeceğini düşünmekten doğabilir. Başarabileceği küçük hedefler ve çabasının fark edilmesi iyi bir başlangıç olabilir. Bu durum uzun sürüyorsa okulun rehberlik servisiyle ya da bir psikolojik danışmanla görüşebilirsiniz.',
      },
      'low-average': {
        name: 'Az istek, biraz baskı',
        student:
          'Kendi isteğine dayalı nedenlerin genel olarak az; baskıya dayalı nedenlerin ise genel olarak orta düzeyde. Çalıştığında bunu daha çok zorunda olduğun ya da çalışmazsan kötü hissedeceğin için yapıyor olabilirsin. Araştırmalarda baskıya dayalı çalışma kaygıyla ve ertelemeyle birlikte görülüyor. İsteği büyütmek için küçük adımlar işe yarayabilir: bir konunun sana ne kazandıracağını kendin bulmak, ilgini çeken bir yanını keşfetmek ve başardığın küçük şeyleri fark etmek.',
        parent:
          'Çocuğunuzun kendi isteğine dayalı nedenleri genel olarak az; baskıya dayalı nedenleri ise genel olarak orta düzeyde. Çalıştığında bunu daha çok zorunda olduğu ya da çalışmazsa kötü hissedeceği için yapıyor olabilir. Araştırmalarda baskıya dayalı çalışma kaygıyla ve ertelemeyle birlikte görülüyor. İsteği büyütmek için küçük adımlar işe yarayabilir: bir konunun ne kazandıracağını birlikte konuşmak, ilgisini çeken yanlarını keşfetmesine fırsat vermek ve küçük başarılarını fark etmek.',
      },
      'low-high': {
        name: 'Baskıya dayalı motivasyon',
        student:
          'Ders çalışma nedenlerin şu sıralar çoğunlukla bir baskı: suçluluk ya da utanç duygusu, çevrenin beklentisi, ödül ya da ceza gibi. Kendi isteğine dayalı nedenlerin ise genel olarak az. Araştırmalarda bu düzen “düşük nitelikli motivasyon” diye anılıyor; bu ad motivasyonun miktarını değil, nereden geldiğini anlatır. Bu düzendeki öğrenciler en çok erteleyen grup oluyor ve isteğe dayalı çalışanlara göre daha fazla sınav kaygısı yaşıyor; baskının tek başına öğrenmeye bir yararı da görülmüyor. Bu senin bir kusurun değil; motivasyon ortama göre de değişir. Bir konunun sana ne kazandıracağını kendi cümlelerinle bulmak, başarabileceğin küçük hedefler koymak ve bu baskıyı güvendiğin biriyle konuşmak iyi başlangıçlar olabilir.',
        parent:
          'Çocuğunuzun ders çalışma nedenleri şu sıralar çoğunlukla bir baskı: suçluluk ya da utanç duygusu, çevrenin beklentisi, ödül ya da ceza gibi. Kendi isteğine dayalı nedenleri ise genel olarak az. Araştırmalarda bu düzen “düşük nitelikli motivasyon” diye anılıyor; bu ad motivasyonun miktarını değil, nereden geldiğini anlatır. Bu düzendeki öğrenciler en çok erteleyen grup oluyor ve isteğe dayalı çalışanlara göre daha fazla sınav kaygısı yaşıyor; baskının tek başına öğrenmeye bir yararı da görülmüyor. Bu onun bir kusuru değildir; motivasyon ortama göre de değişir. Ödül, ceza ve karşılaştırmayı azaltmak; yerine anlamlı gerekçeler koymak, onun görüşüne alan bırakmak ve başarabileceği küçük hedefler koymasına yardım etmek iyi başlangıçlar olabilir.',
      },
    },
    lean: {
      intrinsic: {
        student:
          'Kendi isteğine dayalı iki neden arasında belirgin bir fark var: merak ve keyif, önemini görmekten daha güçlü. Konuların ilgini çekmesi seni önemlerinden daha çok çalıştırıyor; ilgini çekmeyen derslerde o dersin sana ne kazandırabileceğini bulmak işini kolaylaştırabilir.',
        parent:
          'Kendi isteğine dayalı iki neden arasında belirgin bir fark var: merak ve keyif, önemini görmekten daha güçlü. Konuların ilgisini çekmesi onu önemlerinden daha çok çalıştırıyor; ilgisini çekmeyen dersler için o dersin ne kazandırabileceğini birlikte konuşmak işini kolaylaştırabilir.',
      },
      identified: {
        student:
          'Kendi isteğine dayalı iki neden arasında belirgin bir fark var: önemini görme, merak ve keyiften daha güçlü. Konulardan aldığın keyiften çok, onların sana ne kazandıracağı seni çalıştırıyor; keyif almadığın konularda da sürdürmeni kolaylaştırabilecek bir neden bu.',
        parent:
          'Kendi isteğine dayalı iki neden arasında belirgin bir fark var: önemini görme, merak ve keyiften daha güçlü. Konulardan aldığı keyiften çok, onların kendisine ne kazandıracağı onu çalıştırıyor; keyif almadığı konularda da sürdürmesini kolaylaştırabilecek bir neden bu.',
      },
      introjected: {
        student:
          'Baskıya dayalı iki neden arasında belirgin bir fark var: iç baskı, dış baskı ve ödülden daha güçlü. Hissettiğin baskı daha çok içinden geliyor (suçluluk, utanç, kendini kanıtlama); iç baskı aşağıda ayrıca anlatılıyor.',
        parent:
          'Baskıya dayalı iki neden arasında belirgin bir fark var: iç baskı, dış baskı ve ödülden daha güçlü. Hissettiği baskı daha çok içten geliyor (suçluluk, utanç, kendini kanıtlama); iç baskı aşağıda ayrıca anlatılıyor.',
      },
      external: {
        student:
          'Baskıya dayalı iki neden arasında belirgin bir fark var: dış baskı ve ödül, iç baskıdan daha güçlü. Hissettiğin baskı daha çok dışarıdan geliyor (ödül, ceza, denetim). Böyle bir neden çalışmayı ödüle ya da cezaya bağlayabilir; kendi nedenini bulmak bu yüzden önemli.',
        parent:
          'Baskıya dayalı iki neden arasında belirgin bir fark var: dış baskı ve ödül, iç baskıdan daha güçlü. Hissettiği baskı daha çok dışarıdan geliyor (ödül, ceza, denetim). Böyle bir neden çalışmayı ödüle ya da cezaya bağlayabilir; kendi nedenini bulması bu yüzden önemli.',
      },
    },
    hidden: {
      intrinsic: {
        student:
          'Kendi isteğine dayalı nedenlerin genel olarak {düzey} görünse de merak ve keyif tek başına yüksek: önemini görmek daha geride kalıyor. İlgini çekmeyen derslerde o dersin sana ne kazandırabileceğini bulmak işini kolaylaştırabilir.',
        parent:
          'Kendi isteğine dayalı nedenleri genel olarak {düzey} görünse de merak ve keyif tek başına yüksek: önemini görmek daha geride kalıyor. İlgisini çekmeyen dersler için o dersin ne kazandırabileceğini birlikte konuşmak işini kolaylaştırabilir.',
      },
      identified: {
        student:
          'Kendi isteğine dayalı nedenlerin genel olarak {düzey} görünse de önemini görme tek başına yüksek: konulardan aldığın keyiften çok, onların sana ne kazandıracağı seni çalıştırıyor.',
        parent:
          'Kendi isteğine dayalı nedenleri genel olarak {düzey} görünse de önemini görme tek başına yüksek: konulardan aldığı keyiften çok, onların kendisine ne kazandıracağı onu çalıştırıyor.',
      },
      introjected: {
        student:
          'Baskıya dayalı nedenlerin genel olarak {düzey} görünse de iç baskı tek başına yüksek: suçluluk, utanç ya da kendini kanıtlama isteği seni çalıştırıyor. İç baskı aşağıda ayrıca anlatılıyor.',
        parent:
          'Baskıya dayalı nedenleri genel olarak {düzey} görünse de iç baskı tek başına yüksek: suçluluk, utanç ya da kendini kanıtlama isteği onu çalıştırıyor. İç baskı aşağıda ayrıca anlatılıyor.',
      },
      external: {
        student:
          'Baskıya dayalı nedenlerin genel olarak {düzey} görünse de dış baskı ve ödül tek başına yüksek: ödül, ceza ya da denetim seni çalıştırıyor. Dış baskı ve ödül aşağıda ayrıca anlatılıyor.',
        parent:
          'Baskıya dayalı nedenleri genel olarak {düzey} görünse de dış baskı ve ödül tek başına yüksek: ödül, ceza ya da denetim onu çalıştırıyor. Dış baskı ve ödül aşağıda ayrıca anlatılıyor.',
      },
    },
    contradiction: {
      student:
        'Kendi isteğinle çalıştığını söyleyen cümlelerin bir kısmına da, ders çalışmanın anlamsız olduğunu söyleyen cümlelere de çoğunlukla “uyuyor” dedin. Bu iki tür cümle birbirine ters düşüyor. Derslere göre farklı hissetmen bunu açıklayabilir; cümlelerin bir kısmını dikkatle okumamış olman da olası. Sonucunu bu gözle oku.',
      parent:
        'Kendi isteğiyle çalıştığını söyleyen cümlelerin bir kısmına da, ders çalışmanın anlamsız olduğunu söyleyen cümlelere de çoğunlukla “uyuyor” denmiş. Bu iki tür cümle birbirine ters düşüyor. Çocuğunuzun derslere göre farklı hissetmesi bunu açıklayabilir; cümlelerin bir kısmının dikkatle okunmamış olması da olasıdır. Sonuç bu gözle yorumlanmalıdır.',
    },
  },
  scales: {
    intrinsic: {
      low: p(
        'Merak ve keyif şu sıralar az belirleyici',
        'Ders çalışırken merak ya da keyif şu sıralar pek belirleyici değil. Bu birçok öğrencide görülebilir: birçok konu ilk bakışta uzak ya da sıkıcı görünebilir. Merak, bir konuyu biraz anlamaya başlayınca ve onu gündelik hayatla ilişkilendirince gelebilir. Keyif almadığın konularda da o konunun sana ne kazandıracağını görerek çalışabilirsin.',
        'Çocuğunuzun ders çalışmasında merak ya da keyif şu sıralar pek belirleyici değil. Bu birçok öğrencide görülebilir: birçok konu ilk bakışta uzak ya da sıkıcı görünebilir. Merak, bir konu biraz anlaşılmaya başlayınca ve gündelik hayatla ilişkilendirilince gelebilir. Araştırmalara göre başarıya bağlı ödüller, tehditler ve baskılı değerlendirmeler merakı ve keyfi azaltabilir.',
        ['İlgini çeken bir konuyla sıkıcı bulduğun bir konu arasında bağ kurmaya çalış.'],
        ['Çocuğunuzun ilgi duyduğu konuları sorun ve dinleyin; ders konularıyla bağ kurmasına yardım edin.'],
      ),
      average: p(
        'Bazı konularda merak ve keyif',
        'Bazı konuları ilginç buluyor ve onları çalışmaktan keyif alıyorsun; bazılarında ise bu keyif yok. Merak duyduğun konular, çalışmaya başlamanın daha kolay olabileceği yerlerdir. Bu merakı öteki konulara köprü kurmak için kullanabilirsin: “Bu konu, sevdiğim konuyla nasıl ilişkili?” diye sormak gibi.',
        'Çocuğunuz bazı konuları ilginç buluyor ve onları çalışmaktan keyif alıyor; bazılarında ise bu keyif yok. Merak duyduğu konular, çalışmaya başlamanın daha kolay olabileceği yerlerdir. Onun hangi konulara merak duyduğunu sormak ve bu merakı ciddiye almak, merakın öteki konulara da yayılmasına yardım edebilir.',
        ['Sevdiğin bir konuyla sevmediğin bir konu arasındaki bağı bul.'],
        ['Merak ettiği soruları ciddiye alın; cevabı birlikte arayın.'],
      ),
      high: p(
        'Öğrenmekten keyif alma',
        'Ders çalışmanın önemli bir nedeni merak ve keyif: yeni bir şey öğrenmek, zor bir konuyu sonunda anlamak hoşuna gidiyor. Araştırmalarda bu tür motivasyon başarıyla ve kendini iyi hissetmeyle birlikte görülüyor. Merakını beslemeye devam et; ilgini çeken konularda soru sormaktan ve daha fazlasını araştırmaktan çekinme.',
        'Çocuğunuz için ders çalışmanın önemli bir nedeni merak ve keyif: yeni bir şey öğrenmek, zor bir konuyu sonunda anlamak hoşuna gidiyor. Araştırmalarda bu tür motivasyon başarıyla ve kendini iyi hissetmeyle birlikte görülüyor. Bu merak, ilgisinin ciddiye alınmasıyla daha kolay korunabilir; başarıya bağlı ödüller ise merakı azaltabilir.',
        ['İlgini çeken bir konuda bir adım daha ileri git: bir kitap, bir belgesel ya da bir soru.'],
        ['Merakını ödülle değil, ilgiyle karşılayın: ne öğrendiğini sorun ve dinleyin.'],
      ),
    },
    identified: {
      low: p(
        'Çalışmanın anlamı şu sıralar net değil',
        'Ders çalışmanın sana ne kazandıracağını şu sıralar pek göremiyorsun. Araştırmalarda önemini görmek, vazgeçmeden sürdürmekle en çok ilişkili nedenlerden biri bulunmuş; bu yüzden bu anlamı bulmak değerli bir adım. Bir konunun sana ne kazandırabileceğini başkalarının değil, kendi cümlelerinle bulmaya çalış.',
        'Çocuğunuz ders çalışmanın kendisine ne kazandıracağını şu sıralar pek göremiyor. Araştırmalarda önemini görmek, vazgeçmeden sürdürmekle en çok ilişkili nedenlerden biri bulunmuş; bu yüzden bu anlamı bulması değerli bir adım. Araştırmalara göre anlamlı bir gerekçe sunmak ve kişinin kendi bakışına alan bırakmak, bir işin benimsenmesine yardım eder.',
        ['“Bu konu bana ne kazandırabilir?” sorusuna kendi cevabını yaz.'],
        ['Bir dersin neden önemli olduğunu anlamlı bir gerekçeyle paylaşın ve onun ne düşündüğünü sorun.'],
      ),
      average: p(
        'Bazı konularda önemini görme',
        'Bazı derslerin ya da konuların önemini görüyorsun, bazılarının ise sana ne kazandıracağı net değil. Önemini gördüğün derslerde çalışmak daha kolay gelebilir. Önemini göremediğin bir derste kendine “Bu bana ne kazandırabilir: bir beceri, bir hedef, bir bakış açısı?” diye sormak işe yarayabilir.',
        'Çocuğunuz bazı derslerin önemini görüyor, bazılarının ise kendisine ne kazandıracağını net göremiyor. Önemini gördüğü derslerde çalışmak ona daha kolay gelebilir. Önemini göremediği dersler için anlamlı bir gerekçe paylaşmak ve onun bu konudaki düşüncesini dinlemek, o dersin anlamını bulmasına yardım edebilir.',
        ['Önemini göremediğin bir ders için kendine bir neden bul ve not et.'],
        ['Önemini göremediği bir ders hakkında, onu ikna etmeye çalışmadan düşüncesini sorun.'],
      ),
      high: p(
        'Çalışmanın önemini kendisi görme',
        'Ders çalışmanın önemini kendin görüyor ve bunu kendi hedeflerinle ilişkilendiriyorsun. Araştırmalarda bu tür motivasyon, vazgeçmeden sürdürmekle en çok ilişkili nedenlerden biri. Sıkıcı bulduğun konularda bile neden çalıştığını bilmek sana güç verebilir; hedeflerin değiştikçe bu nedenleri yeniden düşünmek de iyi olur.',
        'Çocuğunuz ders çalışmanın önemini kendisi görüyor ve bunu kendi hedefleriyle ilişkilendiriyor. Araştırmalarda bu tür motivasyon, vazgeçmeden sürdürmekle en çok ilişkili nedenlerden biri. Hedeflerini onunla konuşmak ve bu hedeflerin onun kendi seçimi olduğunu hissettirmek bu motivasyonu korumaya yardım edebilir.',
        ['Hedeflerini ara sıra yeniden yaz; neden çalıştığını hatırlamak güç verebilir.'],
        ['Hedeflerini onunla konuşun; seçimlerin onun olduğunu hissettirin.'],
      ),
    },
    introjected: {
      low: p(
        'İç baskı az',
        'Çalışmanın nedeni pek suçluluk, utanç ya da kendini kanıtlama gereği değil. Bu iyi bir haber: araştırmalarda ders çalışma nedenleri arasında kaygıyla en çok ilişkili olan iç baskı. Kendine baskı yapmadan çalışabilmek, kötü bir not aldığında da sakin kalmanı kolaylaştırabilir.',
        'Çocuğunuz için çalışmanın nedeni pek suçluluk, utanç ya da kendini kanıtlama gereği değil. Bu iyi bir haberdir: araştırmalarda ders çalışma nedenleri arasında kaygıyla en çok ilişkili olan iç baskı. Kötü bir notu onun değeriyle ilişkilendirmeden, öğrenmenin bir parçası olarak konuşmak bu durumu korumaya yardım edebilir.',
        ['Kötü bir notta kendine sakin davranmayı sürdür.'],
        ['Notları onun değeriyle karıştırmadan konuşmayı sürdürün.'],
      ),
      average: p(
        'Zaman zaman iç baskı',
        'Bazen suçluluk, utanç ya da “başarılı görünmeliyim” düşüncesiyle çalışıyorsun. Bu duygular çalıştırabilir; ama araştırmalarda iç baskı kaygıyla ilişkili bulunmuş. Bir notun senin değerini değil, bir konuyu ne kadar öğrendiğini gösterdiğini hatırlamak bu baskıyı hafifletebilir.',
        'Çocuğunuz bazen suçluluk, utanç ya da “başarılı görünmeliyim” düşüncesiyle çalışıyor. Bu duygular çalıştırabilir; ama araştırmalarda iç baskı kaygıyla ilişkili bulunmuş. Notları onun değeriyle karıştırmadan konuşmak ve notları ne olursa olsun onun sizin için değerli olduğunu hissettirmek bu baskıyı hafifletebilir.',
        ['Bir notun yalnızca bir konuyu ne kadar öğrendiğini gösterdiğini hatırla.'],
        ['Notları onun değeriyle karıştırmadan konuşun.'],
      ),
      high: p(
        'Güçlü bir iç baskı',
        'Ders çalışmanın önemli bir nedeni iç baskı: çalışmazsan suçluluk duyuyor, kötü bir notta utanıyor ya da kendi değerini notlarına bağlıyor olabilirsin. Bu baskı çok çalıştırabilir; ama araştırmalarda ders çalışma nedenleri arasında kaygıyla en çok ilişkili olan iç baskı. Senin değerin notlarına bağlı değil. Neden çalıştığını kendi cümlelerinle hatırlamak (“Bunu öğrenmek bana ne kazandırır?”) baskının yerine anlamı koymana yardım edebilir. Bu baskı seni çok yoruyorsa güvendiğin bir yetişkinle ya da bir rehber öğretmenle konuşmak iyi gelebilir.',
        'Çocuğunuz için ders çalışmanın önemli bir nedeni iç baskı: çalışmazsa suçluluk duyuyor, kötü bir notta utanıyor ya da kendi değerini notlarına bağlıyor olabilir. Bu baskı çok çalıştırabilir; ama araştırmalarda ders çalışma nedenleri arasında kaygıyla en çok ilişkili olan iç baskı. Notları onun değeriyle karıştırmadan konuşmak, hatalarına sakin yaklaşmak ve notları ne olursa olsun onun sizin için değerli olduğunu hissettirmek bu baskıyı hafifletebilir. Kaygısı günlük hayatını zorlaştırıyorsa okulun rehberlik servisinden ya da bir psikolojik danışmandan destek alabilirsiniz.',
        ['Kötü bir notta, notun senin değerini değil bir konuyu ne kadar öğrendiğini gösterdiğini hatırla.'],
        ['Hatalarına sakin yaklaşın; notları onun değeriyle karıştırmayın.'],
      ),
    },
    external: {
      low: p(
        'Ödül ve ceza az belirleyici',
        'Çalışmanın nedeni pek ödül, ceza ya da başkalarının denetimi değil. Araştırmalarda dış baskı ve ödülün başarı ve vazgeçmeden sürdürmeyle ilişkili olmadığı görülüyor; bu yüzden onların az olması bir eksiklik değil.',
        'Çocuğunuz için çalışmanın nedeni pek ödül, ceza ya da denetim değil. Araştırmalarda dış baskı ve ödülün başarı ve vazgeçmeden sürdürmeyle ilişkili olmadığı görülüyor; bu yüzden onların az olması bir eksiklik değildir. Onu çalıştırabilecek olan, kendi bulduğu nedenlerdir.',
        ['Kendi nedenlerini bulmaya devam et.'],
        ['Ödül ve ceza yerine anlamlı gerekçeler paylaşmayı sürdürün.'],
      ),
      average: p(
        'Zaman zaman ödül ya da ceza',
        'Bazen ödül almak, ceza almamak ya da büyüklerin istediği için çalışıyorsun. Bu birçok öğrencide görülebilir. Böyle bir neden, çalışmayı ödüle ya da cezaya bağlayabilir. Aynı çalışmayı kendi nedeninle yapmak (“Bu bana ne kazandırır?”) onu senin işin hâline getirebilir.',
        'Çocuğunuz bazen ödül almak, ceza almamak ya da büyükleri istediği için çalışıyor. Bu birçok öğrencide görülebilir. Böyle bir neden, çalışmayı ödüle ya da cezaya bağlayabilir. Araştırmalara göre başarıya bağlı ödüller merakı azaltabilir; anlamlı bir gerekçe paylaşmak ve onun görüşüne alan bırakmak ise bir işin benimsenmesine yardım eder.',
        ['Ödül ya da ceza için yaptığın bir çalışmaya kendi nedenini ekle.'],
        ['Ödül yerine anlamlı bir gerekçe paylaşmayı deneyin.'],
      ),
      high: p(
        'Ödül, ceza ya da denetim belirleyici',
        'Ders çalışmanın önemli bir nedeni dışarıdan gelen baskı: ödül almak, ceza almamak, denetlendiğin ya da başka seçeneğin olmadığı için çalışıyorsun. Araştırmalarda bu tür motivasyonun başarı ve vazgeçmeden sürdürmeyle ilişkili olmadığı, kendini daha az iyi hissetmeyle ise ilişkili olduğu görülüyor. Aynı çalışmayı kendi nedeninle yapmak mümkün: bir konunun sana ne kazandıracağını kendin bulmak, çalışmayı senin işin hâline getirebilir.',
        'Çocuğunuz için ders çalışmanın önemli bir nedeni dışarıdan gelen baskı: ödül almak, ceza almamak, denetlendiği ya da başka seçeneği olmadığı için çalışıyor. Araştırmalarda bu tür motivasyonun başarı ve vazgeçmeden sürdürmeyle ilişkili olmadığı, kendini daha az iyi hissetmeyle ise ilişkili olduğu görülüyor. Ödül ve cezayı azaltıp yerine anlamlı gerekçeleri, onun görüşüne alan bırakmayı ve yapabildiklerini fark etmeyi koymak, çalışmayı kendi işi olarak görmesine yardım edebilir.',
        ['Bu hafta bir çalışmayı ödül ya da ceza için değil, kendi nedenin için yap.'],
        ['Ödül ve cezayı azaltıp yerine anlamlı gerekçeler koymayı deneyin.'],
      ),
    },
    amotivation: {
      low: p(
        'Çalışmayı anlamsız bulmama',
        'Ders çalışmanın anlamsız olduğu düşüncesi sana pek uymuyor. Bu, motivasyonun üzerine kurulabileceği bir zemin.',
        'Ders çalışmanın anlamsız olduğu düşüncesi çocuğunuza pek uymuyor. Bu, motivasyonun üzerine kurulabileceği bir zemindir.',
        ['Ders çalışmanın sana kazandırabileceklerini ara sıra hatırla.'],
        ['Ders çalışmanın ona kazandırabileceklerini onunla ara sıra konuşun.'],
      ),
      average: p(
        'Zaman zaman anlamı sorgulama',
        'Bazen ders çalışmanın anlamsız olduğunu ya da ne kadar uğraşsan da sonucun değişmeyeceğini düşünüyorsun. Bu duygu birçok öğrencide zaman zaman görülebilir. Araştırmalarda bu duygu en çok, kendini derslerde yeterli hissetmemekle ilişkili bulunmuş; bu yüzden küçük ve başarabileceğin hedefler koyup yapabildiklerini görmek iyi bir başlangıç olabilir.',
        'Çocuğunuz bazen ders çalışmanın anlamsız olduğunu ya da ne kadar uğraşsa da sonucun değişmeyeceğini düşünüyor. Bu duygu birçok öğrencide zaman zaman görülebilir. Araştırmalarda bu duygu en çok, kendini derslerde yeterli hissetmemekle ilişkili bulunmuş; başarabileceği küçük hedefler koyması ve yapabildiklerinin fark edilmesi iyi bir başlangıç olabilir.',
        ['Bu hafta kesinlikle başarabileceğin küçük bir hedef koy.'],
        ['Yapabildiği küçük şeyleri fark edin ve ona söyleyin.'],
      ),
      high: p(
        'Çalışmanın anlamını şu sıralar görememe',
        'Ders çalışmak sana şu sıralar anlamsız geliyor ya da ne kadar uğraşsan da sonucun değişmeyeceğini düşünüyorsun. Bu duygu değişmez bir özelliğin değil; motivasyon ortama göre de değişebilir. Araştırmalarda bu duygu en çok, kendini derslerde yeterli hissetmemekle ilişkili bulunmuş. Küçük ve başarabileceğin hedeflerle başlamak ve bu duyguyu güvendiğin bir yetişkinle ya da bir rehber öğretmenle konuşmak iyi bir adım olabilir.',
        'Çocuğunuz ders çalışmayı şu sıralar anlamsız buluyor ya da ne kadar uğraşsa da sonucun değişmeyeceğini düşünüyor. Bu bir tembellik işareti ya da değişmez bir özellik değildir; motivasyon ortama göre de değişebilir. Araştırmalarda bu duygu en çok, kendini derslerde yeterli hissetmemekle ilişkili bulunmuş. Başarabileceği küçük hedefler, çabasının fark edilmesi ve sakin bir konuşma yardımcı olabilir. Bu durum uzun sürüyorsa ya da genel bir isteksizlik ve mutsuzlukla birlikte görülüyorsa okulun rehberlik servisiyle ya da bir psikolojik danışmanla görüşmenizi öneririz.',
        ['Bu duyguyu güvendiğin bir yetişkinle ya da bir rehber öğretmenle konuş.'],
        ['Onu yargılamadan dinleyin; gerekirse okulun rehberlik servisiyle görüşün.'],
      ),
    },
  },
};
