import type { BandText, ReportTemplate } from './types';

/**
 * Hobi ve Serbest Zaman İlgileri rapor metinleri.
 * İlkeler: puan, bir alandaki etkinliklerin son bir yılda ne sıklıkla yapıldığıdır; metinler "zaman ayırmışsın" der,
 * "ilgin var" ya da "ilgin yok" demez. Sıklık zamana, imkânlara ve yaşanan yere de bağlı olduğu için düşük düzey bir
 * ilgisizlik ya da eksiklik gibi anlatılmaz; isteğe bağlı, küçük bir başlangıç önerilir. Hiçbir alan iyi ya da kötü
 * değildir. Öğrenciye "Son bir yılda ... zaman ayırmışsın", veliye "Çocuğunuz son bir yılda ... belirtiyor" dili
 * kullanılır. Faydalar kesin sonuç gibi değil, olasılık olarak söylenir.
 * Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 * Destek kutusu yoktur: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez.
 * Öneri listeleri (kapsamlı rapor için) bu testte henüz yazılmadı; basit raporda gösterilmez.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

export const hobiIlgileriReport: ReportTemplate = {
  version: 'hobi-ilgileri-rapor-1',
  bandLabels: {
    low: 'Az',
    average: 'Ara sıra',
    high: 'Sık',
  },
  overview: {
    student:
      'Alanlar, o alandaki etkinlikleri son bir yılda ne sıklıkla yaptığına göre en sıktan en seyreğe sıralandı. Değerler, o alandaki cevaplarının ortalamasıdır: 1 hiç yapmadım, 2 son bir yılda yapmadım, 3 son bir yılda 1 ya da 2 kez, 4 son bir yılda 3 ile 10 kez arası, 5 son bir yılda 10 kezden fazla. Bu bir yetenek ya da başarı ölçümü değildir; iyi ya da kötü sonuç yoktur. Bir etkinliği ne sıklıkla yaptığın yalnızca ilgine değil, zamanına, imkânlarına ve yaşadığın yere de bağlıdır; az yaptığın bir alana da ilgi duyuyor olabilirsin. Test 16 alanı sorar: müzik dinlemek, televizyon izlemek, bilgisayar, telefon ve sosyal medya gibi uğraşlar bu listede yoktur. Her alan beş ile yedi etkinlikle ölçüldüğü için sonuçlar yaklaşıktır.',
    parent:
      'Alanlar, çocuğunuzun o alandaki etkinlikleri son bir yılda ne sıklıkla yaptığına göre en sıktan en seyreğe sıralandı. Değerler, o alandaki cevaplarının ortalamasıdır: 1 hiç yapmadım, 2 son bir yılda yapmadım, 3 son bir yılda 1 ya da 2 kez, 4 son bir yılda 3 ile 10 kez arası, 5 son bir yılda 10 kezden fazla. Bu bir yetenek ya da başarı ölçümü değildir; iyi ya da kötü sonuç yoktur. Bir etkinliğin ne sıklıkla yapıldığı yalnızca ilgiye değil, zamana, ailenin imkânlarına ve yaşanan yere de bağlıdır; çocuğunuz az yaptığı bir alana da ilgi duyuyor olabilir. Test 16 alanı sorar: müzik dinlemek, televizyon izlemek, bilgisayar, telefon ve sosyal medya gibi uğraşlar bu listede yoktur. Her alan beş ile yedi etkinlikle ölçüldüğü için sonuçlar yaklaşıktır.',
  },
  scales: {
    children: {
      high: t(
        'Küçük çocuklarla sık sık vakit geçiren',
        'Son bir yılda küçük çocuklarla sık sık vakit geçirmişsin: onlarla oyun oynamak, onlara hikâye okumak, onları gezmeye götürmek ya da onlara bakmak gibi. Bu etkinlikler sabır ve ilgi ister; hangilerinden keyif aldığını fark etmek kendini tanımana yardım edebilir.',
        'Çocuğunuz son bir yılda kendinden küçük çocuklarla sık sık vakit geçirdiğini belirtiyor: onlarla oyun oynamak, onlara hikâye okumak ya da onlara bakmak gibi. Bu etkinliklerdeki emeğini fark edip takdir etmeniz onu destekleyebilir.',
      ),
      average: t(
        'Küçük çocuklarla ara sıra vakit geçiren',
        'Son bir yılda küçük çocuklarla ara sıra vakit geçirmişsin; onlarla oyun oynamak ya da onlara bakmak gibi etkinlikler zaman zaman hayatında yer alıyor.',
        'Çocuğunuz son bir yılda kendinden küçük çocuklarla ara sıra vakit geçirdiğini belirtiyor.',
      ),
      low: t(
        'Küçük çocuklarla pek vakit geçirmeyen',
        'Son bir yılda küçük çocuklarla pek vakit geçirmemişsin. Bu, çevrende küçük çocuk olup olmamasıyla da ilgili olabilir; ilgi duymadığın anlamına gelmeyebilir.',
        'Çocuğunuz son bir yılda kendinden küçük çocuklarla pek vakit geçirmediğini belirtiyor. Bu, çevrede küçük çocuk bulunup bulunmamasıyla da ilgili olabilir.',
      ),
    },
    collecting: {
      high: t(
        'Koleksiyonuyla sık sık uğraşan',
        'Son bir yılda bir koleksiyonla sık sık uğraşmışsın: ona yeni parçalar eklemek, takas etmek ya da topladığın şeyler hakkında okumak gibi. Koleksiyon yapmak sabır, düzen ve bir konuyu derinlemesine tanımakla ilgili bir uğraştır.',
        'Çocuğunuz son bir yılda bir koleksiyonla sık sık uğraştığını belirtiyor: ona yeni parçalar eklemek, takas etmek ya da topladığı şeyler hakkında okumak gibi. Koleksiyonu hakkında soru sormanız ve onu anlatmasını dinlemeniz bu uğraşı destekleyebilir.',
      ),
      average: t(
        'Koleksiyonuyla ara sıra uğraşan',
        'Son bir yılda bir koleksiyonla ara sıra uğraşmışsın.',
        'Çocuğunuz son bir yılda bir koleksiyonla ara sıra uğraştığını belirtiyor.',
      ),
      low: t(
        'Koleksiyonla pek uğraşmayan',
        'Son bir yılda bir koleksiyonla pek uğraşmamışsın. Koleksiyon yapmak herkesin ilgisini çeken bir uğraş değildir; merak ettiğin bir konu varsa küçük bir koleksiyonla başlamak keyifli olabilir.',
        'Çocuğunuz son bir yılda bir koleksiyonla pek uğraşmadığını belirtiyor. Koleksiyon yapmak herkesin ilgisini çeken bir uğraş değildir.',
      ),
    },
    creativity: {
      high: t(
        'Yaratıcı etkinliklere sık sık zaman ayıran',
        'Son bir yılda yaratıcı etkinliklere sık sık zaman ayırmışsın: resim yapmak, şiir yazmak, bir tiyatro oyununda rol almak, müzik aleti çalmak ya da tamamen yeni bir şey denemek gibi. Kendini ifade etmenin yollarını bulmuş olabilirsin; ürettiklerini başkalarıyla paylaşmak sana yeni fırsatlar açabilir.',
        'Çocuğunuz son bir yılda yaratıcı etkinliklere sık sık zaman ayırdığını belirtiyor: resim yapmak, şiir yazmak, bir tiyatro oyununda rol almak ya da müzik aleti çalmak gibi. Ürettiklerine ilgi göstermeniz ve bu etkinlikler için zaman ve malzeme sağlamanız onu destekleyebilir.',
      ),
      average: t(
        'Yaratıcı etkinliklere ara sıra zaman ayıran',
        'Son bir yılda yaratıcı etkinliklere ara sıra zaman ayırmışsın; resim, müzik, yazı ya da sahne gibi alanlarda zaman zaman bir şeyler üretiyorsun.',
        'Çocuğunuz son bir yılda resim, müzik, yazı ya da sahne gibi yaratıcı etkinliklere ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Yaratıcı etkinliklere pek zaman ayırmayan',
        'Son bir yılda resim, müzik, yazı ya da sahne gibi yaratıcı etkinliklere pek zaman ayırmamışsın. Bu, yaratıcı olmadığın anlamına gelmez; yaratıcılık bir sorunu çözerken ya da bir şeyi düzenlerken de ortaya çıkabilir.',
        'Çocuğunuz son bir yılda resim, müzik, yazı ya da sahne gibi yaratıcı etkinliklere pek zaman ayırmadığını belirtiyor. Bu, yaratıcı olmadığı anlamına gelmez; yaratıcılık başka alanlarda da ortaya çıkabilir.',
      ),
    },
    culture: {
      high: t(
        'Kültür ve sanat etkinliklerine sık sık giden',
        'Son bir yılda kültür ve sanat etkinliklerine sık sık gitmişsin: müze ve sergi gezmek; konser, tiyatro, bale ya da opera izlemek ya da konferanslara katılmak gibi. Farklı sanat dallarını ve fikirleri yakından görmek ilgi alanlarını genişletebilir.',
        'Çocuğunuz son bir yılda kültür ve sanat etkinliklerine sık sık gittiğini belirtiyor: müze ve sergi gezmek ya da konser ve tiyatro izlemek gibi. Gördükleri hakkında onunla konuşmanız bu deneyimleri daha anlamlı kılabilir.',
      ),
      average: t(
        'Kültür ve sanat etkinliklerine ara sıra giden',
        'Son bir yılda müze, sergi, konser ya da tiyatro gibi kültür ve sanat etkinliklerine ara sıra gitmişsin.',
        'Çocuğunuz son bir yılda müze, sergi, konser ya da tiyatro gibi kültür ve sanat etkinliklerine ara sıra gittiğini belirtiyor.',
      ),
      low: t(
        'Kültür ve sanat etkinliklerine pek gitmeyen',
        'Son bir yılda kültür ve sanat etkinliklerine pek gitmemişsin. Bu tür etkinlikler her yerde kolay bulunmaz; merak ediyorsan yaşadığın yerdeki müzeler, sergiler ya da açık hava konserleri iyi bir başlangıç olabilir.',
        'Çocuğunuz son bir yılda kültür ve sanat etkinliklerine pek gitmediğini belirtiyor. Bu tür etkinlikler her yerde kolay bulunmaz; yaşadığınız yerdeki müzeler, sergiler ya da açık hava konserleri iyi bir başlangıç olabilir.',
      ),
    },
    exercise: {
      high: t(
        'Sık sık egzersiz yapan',
        'Son bir yılda sık sık egzersiz yapmışsın: koşu, ağırlık çalışması, yoga ya da bir egzersiz programı gibi. Düzenli hareket hem bedene hem zihne iyi gelebilir; dinlenmeye de zaman ayırmayı unutma.',
        'Çocuğunuz son bir yılda sık sık egzersiz yaptığını belirtiyor: koşu, ağırlık çalışması, yoga ya da bir egzersiz programı gibi. Düzenli hareket sağlığa iyi gelebilir; yeterli dinlenme ve beslenmeyle dengelenmesine dikkat etmeniz yeterli olur.',
      ),
      average: t(
        'Ara sıra egzersiz yapan',
        'Son bir yılda ara sıra egzersiz yapmışsın. Hoşuna giden bir hareket türünü bulmak, egzersizi düzenli hâle getirmeyi kolaylaştırabilir.',
        'Çocuğunuz son bir yılda ara sıra egzersiz yaptığını belirtiyor. Hoşlandığı bir hareket türünü bulması, egzersizi düzenli hâle getirmesini kolaylaştırabilir.',
      ),
      low: t(
        'Pek egzersiz yapmayan',
        'Son bir yılda koşu, ağırlık çalışması ya da yoga gibi egzersizlere pek zaman ayırmamışsın. Takım sporları, yürüyüş ya da dans gibi başka yollarla hareket ediyor olabilirsin; hiçbirine zaman bulamıyorsan, hoşlanacağın bir hareketle küçük bir başlangıç yapabilirsin.',
        'Çocuğunuz son bir yılda koşu, ağırlık çalışması ya da yoga gibi egzersizlere pek zaman ayırmadığını belirtiyor. Spor ya da yürüyüş gibi başka yollarla hareket ediyor olabilir; etmiyorsa, hoşlanacağı bir hareket türünü birlikte bulmanız faydalı olabilir.',
      ),
    },
    fashion: {
      high: t(
        'Modaya ve giyime sık sık zaman ayıran',
        'Son bir yılda moda ve giyime sık sık zaman ayırmışsın: ne giyeceğini düşünmek, moda hakkında okumak ya da modaya uygun kıyafetler almak gibi. Giyim kendini ifade etmenin bir yolu olabilir; tasarım ve renklerle ilgileniyorsan bu ilgi başka yaratıcı alanlara da uzanabilir.',
        'Çocuğunuz son bir yılda moda ve giyime sık sık zaman ayırdığını belirtiyor: ne giyeceğini düşünmek, moda hakkında okumak ya da modaya uygun kıyafetler almak gibi. Giyim kendini ifade etmenin yollarından biri olabilir; ilgisinin en çok neye (tasarım, renkler, alışveriş) yöneldiğini onunla konuşabilirsiniz.',
      ),
      average: t(
        'Modaya ve giyime ara sıra zaman ayıran',
        'Son bir yılda moda ve giyime ara sıra zaman ayırmışsın.',
        'Çocuğunuz son bir yılda moda ve giyime ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Modaya ve giyime pek zaman ayırmayan',
        'Son bir yılda moda ve giyime pek zaman ayırmamışsın; ne giyeceğin sana çok düşünmeye değer gelmiyor olabilir.',
        'Çocuğunuz son bir yılda moda ve giyime pek zaman ayırmadığını belirtiyor.',
      ),
    },
    games: {
      high: t(
        'Masa ve kart oyunlarını sık sık oynayan',
        'Son bir yılda masa ve kart oyunlarına sık sık zaman ayırmışsın: yapboz, satranç, dama, tavla, kutu ya da kart oyunları gibi. Bu oyunlar dikkat ve planlama ister; çoğu da başkalarıyla birlikte keyifli vakit geçirmenin bir yoludur.',
        'Çocuğunuz son bir yılda masa ve kart oyunlarına sık sık zaman ayırdığını belirtiyor: yapboz, satranç, dama, tavla, kutu ya da kart oyunları gibi. Ara sıra ona eşlik etmeniz hem birlikte vakit geçirmenin hem de onu tanımanın güzel bir yolu olabilir.',
      ),
      average: t(
        'Masa ve kart oyunlarını ara sıra oynayan',
        'Son bir yılda masa ve kart oyunlarına ara sıra zaman ayırmışsın.',
        'Çocuğunuz son bir yılda masa ve kart oyunlarına ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Masa ve kart oyunlarını pek oynamayan',
        'Son bir yılda masa ve kart oyunlarına pek zaman ayırmamışsın. Merak ediyorsan arkadaşlarınla ya da yakınlarınla yeni bir kutu oyunu denemek iyi bir başlangıç olabilir.',
        'Çocuğunuz son bir yılda masa ve kart oyunlarına pek zaman ayırmadığını belirtiyor.',
      ),
    },
    gardening: {
      high: t(
        'Bitkilerle sık sık uğraşan',
        'Son bir yılda bitkilerle sık sık uğraşmışsın: saksı bitkilerine bakmak, bitki dikmek, bahçe işleri yapmak ya da çiçek almak gibi. Bir şeyi büyütmek sabır ve düzenli bakım ister; doğayla iç içe bu uğraş sana keyif veriyor olabilir.',
        'Çocuğunuz son bir yılda bitkilerle sık sık uğraştığını belirtiyor: saksı bitkilerine bakmak, bitki dikmek ya da bahçe işleri yapmak gibi. Ona kendi sorumluluğunda bir bitki ya da küçük bir köşe vermeniz bu uğraşı destekleyebilir.',
      ),
      average: t(
        'Bitkilerle ara sıra uğraşan',
        'Son bir yılda bitkilerle ve bahçe işleriyle ara sıra uğraşmışsın.',
        'Çocuğunuz son bir yılda bitkilerle ve bahçe işleriyle ara sıra uğraştığını belirtiyor.',
      ),
      low: t(
        'Bitkilerle pek uğraşmayan',
        'Son bir yılda bitkilerle ve bahçe işleriyle pek uğraşmamışsın. Bahçesi olmayan evlerde bu çok olağandır; merak ediyorsan bir saksı bitkisiyle başlayabilirsin.',
        'Çocuğunuz son bir yılda bitkilerle ve bahçe işleriyle pek uğraşmadığını belirtiyor. Bahçesi olmayan evlerde bu çok olağandır.',
      ),
    },
    gatherings: {
      high: t(
        'Davetlere ve kutlamalara sık sık katılan',
        'Son bir yılda davetlere ve kutlamalara sık sık zaman ayırmışsın: kutlamalara ve eğlencelere gitmek, bunları düzenlemek ya da evinde misafir ağırlamak gibi. İnsanlarla bir araya gelmek sana keyif veriyor olabilir; bir buluşmayı düzenlemek planlama ve iletişim becerilerini de geliştirebilir.',
        'Çocuğunuz son bir yılda davetlere ve kutlamalara sık sık zaman ayırdığını belirtiyor: kutlamalara ve eğlencelere gitmek, bunları düzenlemek ya da evde misafir ağırlamak gibi. İnsanlarla bir araya gelmekten keyif alıyor olabilir.',
      ),
      average: t(
        'Davetlere ve kutlamalara ara sıra katılan',
        'Son bir yılda davetlere ve kutlamalara ara sıra zaman ayırmışsın.',
        'Çocuğunuz son bir yılda davetlere ve kutlamalara ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Davetlere ve kutlamalara pek katılmayan',
        'Son bir yılda davetlere ve kutlamalara pek zaman ayırmamışsın. Misafir ağırlamak ya da kutlama düzenlemek çoğu zaman evdeki imkânlara ve düzene bağlıdır; bazı insanlar da kalabalık buluşmalar yerine birkaç yakın arkadaşla vakit geçirmeyi tercih eder.',
        'Çocuğunuz son bir yılda davetlere ve kutlamalara pek zaman ayırmadığını belirtiyor. Misafir ağırlamak ya da kutlama düzenlemek bu yaşta çoğunlukla ailenin kararıdır; bazı çocuklar da kalabalık buluşmalar yerine birkaç yakın arkadaşla vakit geçirmeyi tercih eder.',
      ),
    },
    pets: {
      high: t(
        'Evcil hayvanlarla sık sık ilgilenen',
        'Son bir yılda evcil hayvanlarla sık sık ilgilenmişsin: onlarla oynamak, onlara yemek vermek ya da bakımlarını yapmak gibi. Bir hayvanın bakımını üstlenmek sorumluluk ve özen ister; hayvanlarla ilgilenmek sana keyif veriyor olabilir.',
        'Çocuğunuz son bir yılda evcil hayvanlarla sık sık ilgilendiğini belirtiyor: onlarla oynamak, onlara yemek vermek ya da bakımlarını yapmak gibi. Bakımda ona yaşına uygun sorumluluklar vermeniz bu uğraşı destekleyebilir.',
      ),
      average: t(
        'Evcil hayvanlarla ara sıra ilgilenen',
        'Son bir yılda evcil hayvanlarla ara sıra ilgilenmişsin.',
        'Çocuğunuz son bir yılda evcil hayvanlarla ara sıra ilgilendiğini belirtiyor.',
      ),
      low: t(
        'Evcil hayvanlarla pek vakit geçirmeyen',
        'Son bir yılda evcil hayvanlarla pek vakit geçirmemişsin. Bu, evde ya da yakın çevrende evcil hayvan olup olmamasıyla ilgili olabilir.',
        'Çocuğunuz son bir yılda evcil hayvanlarla pek vakit geçirmediğini belirtiyor. Bu, evde ya da yakın çevrede evcil hayvan olup olmamasıyla ilgili olabilir.',
      ),
    },
    reading: {
      high: t(
        'Sık sık kitap okuyan',
        'Son bir yılda kitap okumaya sık sık zaman ayırmışsın: kitap okumak ve almak, uyumadan önce okumak ya da kütüphaneye gitmek gibi. Okumak, bilgini ve kelime dağarcığını geliştirmenin yanında farklı hayatları ve fikirleri tanımanın da bir yoludur; okuduklarını başkalarıyla konuşmak bu keyfi artırabilir.',
        'Çocuğunuz son bir yılda kitap okumaya sık sık zaman ayırdığını belirtiyor. Okuduğu kitaplar hakkında onunla sohbet etmeniz ve yeni kitaplara ulaşmasını kolaylaştırmanız bu alışkanlığı destekleyebilir.',
      ),
      average: t(
        'Ara sıra kitap okuyan',
        'Son bir yılda kitap okumaya ara sıra zaman ayırmışsın. İlgini çeken konularda kitaplar seçmek okumayı daha keyifli hâle getirebilir.',
        'Çocuğunuz son bir yılda kitap okumaya ara sıra zaman ayırdığını belirtiyor. İlgisini çeken konularda kitaplar seçmesine yardım etmeniz okumayı daha keyifli hâle getirebilir.',
      ),
      low: t(
        'Pek kitap okumayan',
        'Son bir yılda kitap okumaya pek zaman ayırmamışsın. Okumak uzun romanlarla başlamak zorunda değildir; ilgini çeken bir konuda kısa bir kitap, çizgi roman ya da dergi iyi bir başlangıç olabilir.',
        'Çocuğunuz son bir yılda kitap okumaya pek zaman ayırmadığını belirtiyor. Zorlamak yerine ilgisini çeken konularda kısa kitaplar, çizgi romanlar ya da dergiler sunmanız ve evde birlikte okuma zamanları ayırmanız faydalı olabilir.',
      ),
    },
    self_improvement: {
      high: t(
        'Kendini geliştirmeye sık sık zaman ayıran',
        'Son bir yılda kendini geliştirmeye sık sık zaman ayırmışsın: yeni beceriler öğrenmek, bir konuyu kendi isteğinle çalışmak, kurslara katılmak ya da kişisel gelişim kitapları okumak gibi. Öğrenmeye açık olmak birçok alanda işine yarayabilir; öğrendiklerini kullanabileceğin küçük projeler bu isteği canlı tutabilir.',
        'Çocuğunuz son bir yılda kendini geliştirmeye sık sık zaman ayırdığını belirtiyor: yeni beceriler öğrenmek, bir konuyu kendi isteğiyle çalışmak ya da kurslara katılmak gibi. Neyi neden öğrenmek istediğini onunla konuşmanız bu isteği destekleyebilir.',
      ),
      average: t(
        'Kendini geliştirmeye ara sıra zaman ayıran',
        'Son bir yılda kendini geliştirmeye ara sıra zaman ayırmışsın; yeni bir şey öğrenmek ya da bir konuyu kendi isteğinle çalışmak zaman zaman gündeminde.',
        'Çocuğunuz son bir yılda kendini geliştirmeye ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Kendini geliştirmeye pek zaman ayırmayan',
        'Son bir yılda kurslar, kişisel gelişim kitapları ya da kendi isteğinle yeni bir beceri öğrenmek gibi etkinliklere pek zaman ayırmamışsın. Merak ettiğin bir konu varsa, onu küçük adımlarla öğrenmeye başlamak keyifli olabilir.',
        'Çocuğunuz son bir yılda kurslar, kişisel gelişim kitapları ya da kendi isteğiyle yeni bir beceri öğrenmek gibi etkinliklere pek zaman ayırmadığını belirtiyor. Merak ettiği konuları keşfetmesi için fırsat yaratmanız faydalı olabilir.',
      ),
    },
    sports: {
      high: t(
        'Sporla sık sık ilgilenen',
        'Son bir yılda sporla sık sık ilgilenmişsin: takım sporları, basketbol ya da tenis gibi sporlar yapmak, karşılaşmaları izlemek ya da spor üzerine sohbet etmek gibi. Spor hem hareket etmenin hem de başkalarıyla ortak bir tutkuyu paylaşmanın bir yolu olabilir.',
        'Çocuğunuz son bir yılda sporla sık sık ilgilendiğini belirtiyor: spor yapmak, karşılaşmaları izlemek ya da spor üzerine sohbet etmek gibi. Spor yapıyorsa, düzenli katılabileceği bir takım ya da kulüp bunu destekleyebilir.',
      ),
      average: t(
        'Sporla ara sıra ilgilenen',
        'Son bir yılda sporla ara sıra ilgilenmişsin; spor yapmak ya da karşılaşmaları izlemek zaman zaman hayatında yer alıyor.',
        'Çocuğunuz son bir yılda sporla ara sıra ilgilendiğini belirtiyor.',
      ),
      low: t(
        'Spora pek zaman ayırmayan',
        'Son bir yılda spor yapmaya, karşılaşmaları izlemeye ya da spor üzerine sohbet etmeye pek zaman ayırmamışsın. Takım sporları ve karşılaşmalar herkesin ilgisini çekmez; hareket etmenin yürüyüş, dans ya da egzersiz gibi başka yolları da vardır.',
        'Çocuğunuz son bir yılda spor yapmaya ya da karşılaşmaları izlemeye pek zaman ayırmadığını belirtiyor. Hareket etmenin yürüyüş, dans ya da egzersiz gibi başka yolları da vardır.',
      ),
    },
    outdoors: {
      high: t(
        'Açık havada sık sık vakit geçiren',
        'Son bir yılda açık hava etkinliklerine sık sık zaman ayırmışsın: piknik, doğa yürüyüşü, yüzme, kamp, tekne gezisi ya da balık tutma gibi. Doğada vakit geçirmek dinlendirici olabilir; yeni bir yürüyüş yolu ya da etkinlik denemek keyfini artırabilir.',
        'Çocuğunuz son bir yılda açık hava etkinliklerine sık sık zaman ayırdığını belirtiyor: piknik, doğa yürüyüşü, yüzme ya da kamp gibi. Ailece yapılabilecek doğa etkinlikleri bunu destekleyebilir.',
      ),
      average: t(
        'Açık havada ara sıra vakit geçiren',
        'Son bir yılda piknik, doğa yürüyüşü ya da yüzme gibi açık hava etkinliklerine ara sıra zaman ayırmışsın.',
        'Çocuğunuz son bir yılda piknik, doğa yürüyüşü ya da yüzme gibi açık hava etkinliklerine ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Açık havada pek vakit geçirmeyen',
        'Son bir yılda piknik, doğa yürüyüşü, yüzme ya da kamp gibi açık hava etkinliklerine pek zaman ayırmamışsın. Bu etkinlikler yaşanan yere ve imkânlara çok bağlıdır; yakınındaki bir park ya da yürüyüş yolu küçük bir başlangıç olabilir.',
        'Çocuğunuz son bir yılda piknik, doğa yürüyüşü, yüzme ya da kamp gibi açık hava etkinliklerine pek zaman ayırmadığını belirtiyor. Bu etkinlikler yaşanan yere ve imkânlara çok bağlıdır; yakındaki bir parkta birlikte yürüyüş yapmak küçük bir başlangıç olabilir.',
      ),
    },
    travel: {
      high: t(
        'Sık sık seyahat eden',
        'Son bir yılda sık sık seyahate çıkmışsın: yeni yerler görmek, gezdiğin yerlerde fotoğraf çekmek, otelde kalmak ya da trenle veya uçakla yolculuk etmek gibi. Farklı yerleri ve insanları tanımak bakış açını genişletebilir; gezdiğin yerler hakkında not tutmak ya da fotoğraflarını düzenlemek bu deneyimleri kalıcı kılabilir.',
        'Çocuğunuz son bir yılda sık sık seyahate çıktığını belirtiyor: yeni yerler görmek, otelde kalmak ya da trenle veya uçakla yolculuk etmek gibi. Gezilerin planlanmasına onu da katmanız bu deneyimleri onun için daha öğretici kılabilir.',
      ),
      average: t(
        'Ara sıra seyahat eden',
        'Son bir yılda ara sıra seyahate çıkmışsın.',
        'Çocuğunuz son bir yılda ara sıra seyahate çıktığını belirtiyor.',
      ),
      low: t(
        'Pek seyahat etmeyen',
        'Son bir yılda pek seyahate çıkmamışsın. Seyahat büyük ölçüde zamana ve imkânlara bağlıdır; yaşadığın yerin görmediğin köşelerini keşfetmek de yeni yerler tanımanın bir yoludur.',
        'Çocuğunuz son bir yılda pek seyahate çıkmadığını belirtiyor. Seyahat büyük ölçüde zamana ve imkânlara bağlıdır; yaşadığınız yerin görülmeye değer köşelerini birlikte keşfetmek de yeni yerler tanımanın bir yoludur.',
      ),
    },
    writing: {
      high: t(
        'Yazmaya ve anı biriktirmeye sık sık zaman ayıran',
        'Son bir yılda yazmaya ve anı biriktirmeye sık sık zaman ayırmışsın: günlük, mektup, kartpostal ya da şiir yazmak; fotoğrafları ve hatıraları albümde ya da defterde biriktirmek gibi. Yazmak, düşüncelerini ve yaşadıklarını düzenlemenin bir yolu olabilir.',
        'Çocuğunuz son bir yılda yazmaya ve anı biriktirmeye sık sık zaman ayırdığını belirtiyor: günlük, mektup ya da şiir yazmak, fotoğrafları ve hatıraları biriktirmek gibi. Yazdıklarını paylaşmak isterse ilgiyle dinlemeniz, istemezse günlüğünün özel kalmasına saygı göstermeniz önemlidir.',
      ),
      average: t(
        'Yazmaya ve anı biriktirmeye ara sıra zaman ayıran',
        'Son bir yılda yazmaya ve anı biriktirmeye ara sıra zaman ayırmışsın.',
        'Çocuğunuz son bir yılda yazmaya ve anı biriktirmeye ara sıra zaman ayırdığını belirtiyor.',
      ),
      low: t(
        'Yazmaya ve anı biriktirmeye pek zaman ayırmayan',
        'Son bir yılda günlük, mektup ya da şiir yazmaya ve anı biriktirmeye pek zaman ayırmamışsın. Kartpostal, elle yazılan mektup ve basılı fotoğraf albümü bugün eskisi kadar yaygın değil; yaşadıklarını başka yollarla, örneğin telefonundaki fotoğraflarla saklıyor olabilirsin.',
        'Çocuğunuz son bir yılda günlük, mektup ya da şiir yazmaya ve anı biriktirmeye pek zaman ayırmadığını belirtiyor. Kartpostal, elle yazılan mektup ve basılı fotoğraf albümü bugün eskisi kadar yaygın değildir.',
      ),
    },
  },
};
