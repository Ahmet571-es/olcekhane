import { KAYNAK } from './kaynaklar';
import type { AudienceText, RoadmapTemplate } from './types';

/**
 * Ders Çalışırken Telefon ve Dikkat: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öneriler araştırmalarda yararlı bulunan küçük adımlardır: bildirimi baştan durdurmak (bakılmayan bildirim de dikkati
 *    böler: Stothart ve ark., 2015, rapordaki birlikte yorumda anılır; bildirimleri kapatıp telefonu uzağa koyan haftada
 *    dikkat daha az dağıldı: Kushlev ve ark., 2016), bildirimleri çalışma bitince toplu okumak (hiç görmemek bazılarında
 *    huzursuzluk yaratabilir: Fitz ve ark., 2019), çalışmayı yalnızca işe ayrılmış kısa parçalara bölmek (geçişler zaman alır: Rosen ve ark., 2013; May ve Elder,
 *    2018), isteğin doğacağı durumu önceden düzenlemek (Duckworth ve ark., 2016) ve "şu olursa şunu yapacağım" planı
 *    (Gollwitzer ve Sheeran, 2006). Telefonu yasaklamak, elinden almak ya da cezalandırmak önerilmez; "dikkatin artar" ya da
 *    "notların yükselir" vaadi verilmez. Kendini durdurma yollarının önerileri "telefon çalışmanı bölüyorsa" diye koşulludur:
 *    telefonu çalışmasını pek bölmeyen (ya da telefonu olmayan) biri bu yollara ihtiyaç duymayabilir (kart da bunu söyler).
 *  - 2. hafta kendini durdurma yolları ("Odaklı çalışma düzeni"); 3. hafta bölünmenin ortadan en uzak yanı. Bölünmenin düşük
 *    olduğu bir yan 3. haftaya seçilmez (üzerinde çalışmayı gerektirmez); üçü de düşükse 3. hafta "Odağını koru" denemesidir.
 *  - Aynı sayfada bir öneri bir kez verilir: sessize alıp sonra toplu bakmak yalnızca bildirimlerde, kısa çalışma parçaları
 *    yalnızca geçişte, eğer-o zaman planı ve telefonu görmeyeceği bir yere koymanın gerekçesi yalnızca dönme isteğinde, bir
 *    yolu seçip denemek yalnızca kendini durdurma yollarında. Rapordaki kartlar öneri vermez.
 *  - Öğrenci metinleri okula özgü değildir ("çalışırken", "işin"): yetişkine de aynen gösterilir. Telefon ya da mesaj anan
 *    öneriler telefonu olan biri içindir; telefonu olmayan birinin dört alanı da düşük çıkar ve önerileri buna uyar.
 */
const t = (student: string, parent: string, adult?: string): AudienceText => ({ student, parent, ...(adult ? { adult } : {}) });

export const telefonVeDikkatRoadmap: RoadmapTemplate = {
  version: 'telefon-ve-dikkat-yol-haritasi-1',
  planningScale: 'control',
  planningTitle: 'Odaklı çalışma düzeni',
  standoutFirst: [
    { scale: 'notify', group: 'high' },
    { scale: 'switching', group: 'high' },
    { scale: 'pull', group: 'high' },
  ],
  thirdWeekSkip: [
    { scale: 'notify', group: 'low' },
    { scale: 'switching', group: 'low' },
    { scale: 'pull', group: 'low' },
  ],
  extraWeek: {
    title: 'Odağını koru',
    text: t(
      'Bu hafta telefonun çalışmanı bölmediği zamanlarda neyin işe yaradığını fark et ve bir cümleyle yaz.',
      'Bu hafta çocuğunuzla, telefonun çalışmasını bölmediği zamanlarda neyin işe yaradığını konuşun.',
    ),
  },
  unit: { one: 'alan', toPlural: 'alanlara' },
  balancedNote: t(
    'Dört alanda da puanın ortada: ne bölünmenin bir yanı ne de kendini durdurma yolları belirgin biçimde öne çıkıyor.',
    'Çocuğunuzun dört alanda da puanı ortada: ne bölünmenin bir yanı ne de kendini durdurma yolları belirgin biçimde öne çıkıyor.',
  ),
  studyIntro: t(
    'Aşağıda her alan için bir sonraki küçük adım var. Araştırmalara göre isteğin doğacağı durumu önceden düzenlemek, istek doğduktan sonra ona direnmekten daha kolay olabilir. Önerilerin hepsini birden değil, birer birer dene.',
    'Aşağıda çocuğunuzun her alanı için bir sonraki küçük adım var. Araştırmalara göre isteğin doğacağı durumu önceden düzenlemek, istek doğduktan sonra ona direnmekten daha kolay olabilir. Önerileri birer birer denemesine destek olun.',
  ),
  firstWeek: t(
    'Raporundaki dört alana bak. Bu hafta iki çalışmada yanındaki telefonun ya da ekranların nerede durduğunu ve onlara kaç kez baktığını kısaca not et.',
    'Raporu çocuğunuzla birlikte okuyun ve hangi cümlelerin onu anlattığını sorun. Bu hafta kendinize bakın: o çalışırken siz ona yazıyor ya da onu çağırıyor musunuz? Telefonun nerede durduğunu ona sorabilirsiniz.',
  ),
  lastWeek: t(
    'Dört haftada yazdıklarına bak: hangi yol işine yaradı, hangisi yaramadı? İşe yarayanı sürdür.',
    'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  ),
  nextTests: ['erteleme-ve-zaman-yonetimi', 'calisma-aliskanliklari', 'oz-denetim'],
  nextPurpose: {
    you: 'çalışmanla ilgili başka yönlerini de görmek',
    parent: 'çocuğunuzun çalışmasıyla ilgili başka yönlerini de görmek',
    general: true,
  },
  approach: {
    notify: {
      low: 'Çalışırken ona yazmanız gerekiyorsa acil olmayan mesajları çalışması bitince gönderin.',
      average: 'Hangi bildirimlerin onu böldüğünü birlikte konuşun; sizin mesajlarınızın da bunlardan biri olup olmadığını sorun.',
      high: 'Çalışırken telefonu sessize almayı bir yasak gibi değil, birlikte kararlaştırılan bir düzen gibi konuşun.',
    },
    switching: {
      low: 'Uzun süre işinde kalabildiğini fark ettiğinizde bunu ona söyleyin.',
      average: 'Hangi sayfaların açık olduğunu denetlemek yerine, çalışma bitince nasıl geçtiğini sorun.',
      high: 'Çalışırken onu sık sık bölmemeye özen gösterin; molada telefona bakmasını olağan karşılayın.',
    },
    pull: {
      low: 'Sizin de bir işe odaklanırken telefonu bir kenara koyduğunuzu görmesi bu alışkanlığı destekleyebilir.',
      average: 'Telefona uzandığı anları eleştirmek yerine, çalışma bitince hangi anların ona zor geldiğini sorun.',
      high: 'Telefonu elinden almak yerine, çalışırken telefonun nerede duracağına birlikte karar verin; siz de aynı kurala uyun.',
    },
    control: {
      low: 'Telefon çalışmasını bölüyorsa kendini durdurma yollarından birini onunla birlikte seçin ve bir hafta denemesine destek olun; bölmüyorsa bu yollara ihtiyaç duymayabilir.',
      average: 'İşe yarayan bir yolu kullandığını fark ettiğinizde bunu ona söyleyin.',
      high: 'Kendi düzenini kurduğunu takdir edin; telefonla ilgili kuralları onun yerine değil, onunla birlikte güncelleyin.',
    },
  },
  scales: {
    notify: {
      color: '#df4777',
      study: {
        low: t(
          'Bildirimlerin seni pek bölmemesi çalışırken işine yarıyor. Önemli ve uzun bir işe otururken bildirimleri yine de kapatmak bu rahatlığı korumana yardım edebilir.',
          'Bildirimlerin çocuğunuzu pek bölmemesi çalışırken işine yarıyor. Önemli ve uzun bir işe otururken bildirimleri yine de kapatması bu rahatlığı korumasına yardım edebilir.',
        ),
        average: t(
          'Hangi bildirimlerin seni böldüğünü fark et: arkadaşlarından gelen mesajlar mı, oyun ya da uygulama bildirimleri mi? Çalışırken yalnızca gerçekten beklediğin bildirimleri açık bırakabilirsin.',
          'Çocuğunuz hangi bildirimlerin onu böldüğünü fark edebilir: arkadaşlarından gelen mesajlar mı, oyun ya da uygulama bildirimleri mi? Çalışırken yalnızca gerçekten beklediği bildirimleri açık bırakabilir.',
        ),
        high: t(
          'Bildirimleri çalışmaya başlamadan durdurmak işe yarayabilir: telefonu sessize almak, “rahatsız etme” özelliğini açmak ya da ekranı aşağı bakacak biçimde koymak gibi.',
          'Bildirimleri çalışmaya başlamadan durdurmak çocuğunuzun işine yarayabilir: telefonu sessize almak, “rahatsız etme” özelliğini açmak ya da ekranı aşağı bakacak biçimde koymak gibi.',
        ),
      },
      action: {
        low: t(
          'Bu hafta bildirimlerin seni bölmediği bir çalışmada telefonun nerede ve nasıl durduğunu fark et ve bir cümleyle yaz.',
          'Bu hafta çocuğunuzla, bildirimlerin onu bölmediği bir çalışmada telefonun nerede ve nasıl durduğunu konuşun.',
        ),
        average: t(
          'Bu hafta bir çalışmada seni bölen her bildirim için kâğıda bir çizgi çiz; sonunda hangilerinin çalışma bitene kadar bekleyebileceğine bak.',
          'Bu hafta çocuğunuz bir çalışmada onu bölen her bildirim için kâğıda bir çizgi çizsin; sonunda hangilerinin bekleyebileceğine birlikte bakın.',
        ),
        high: t(
          'Bu hafta her çalışmanın başında telefonu sessize al ve bildirimlere çalışma bitince toplu olarak bak. Bildirimleri hiç görmemek seni huzursuz ediyorsa aralarda kısa bir bakış için zaman ayırabilirsin.',
          'Bu hafta çocuğunuz her çalışmanın başında telefonu sessize alsın ve bildirimlere çalışma bitince toplu olarak baksın. Bildirimleri hiç görmemek onu huzursuz ediyorsa aralarda kısa bir bakış için zaman ayırabilir.',
        ),
      },
    },
    switching: {
      color: '#2f5ce0',
      study: {
        low: t(
          'Mola verene kadar işinde kalabilmen sana kolaylık sağlıyor. Uzun bir işte araları önceden belirlemek bu alışkanlığı korumanı kolaylaştırabilir.',
          'Çocuğunuzun mola verene kadar işinde kalabilmesi ona kolaylık sağlıyor. Uzun bir işte araları önceden belirlemesi bu alışkanlığı korumasını kolaylaştırabilir.',
        ),
        average: t(
          'Hangi işlerde ekranlara geçtiğini fark et: sıkıldığında mı, takıldığında mı? Bunu bilmek, araya giren geçişleri azaltmak için nereden başlayacağını gösterebilir.',
          'Çocuğunuz hangi işlerde ekranlara geçtiğini fark edebilir: sıkıldığında mı, takıldığında mı? Bunu bilmek, araya giren geçişleri azaltmak için nereden başlanacağını gösterebilir.',
        ),
        high: t(
          'Aynı anda iki iş yapmak çoğu zaman iki iş arasında hızla gidip gelmektir ve her dönüşte toparlanmak zaman alır. Çalışmayı yalnızca işe ayrılmış kısa parçalara bölmek, geçişleri aralara taşımana yardım edebilir.',
          'Aynı anda iki iş yapmak çoğu zaman iki iş arasında hızla gidip gelmektir ve her dönüşte toparlanmak zaman alır. Çalışmayı yalnızca işe ayrılmış kısa parçalara bölmek, çocuğunuzun geçişleri aralara taşımasına yardım edebilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta bir çalışmada kaç dakika boyunca yalnızca işinle ilgilendiğini not et.',
          'Bu hafta çocuğunuz bir çalışmada kaç dakika boyunca yalnızca işiyle ilgilendiğini not etsin.',
        ),
        average: t(
          'Bu hafta bilgisayarda ya da tablette çalışırken yalnızca işinle ilgili sayfaları açık tut; ötekileri kapat.',
          'Bu hafta çocuğunuz bilgisayarda ya da tablette çalışırken yalnızca işiyle ilgili sayfaları açık tutsun; ötekileri kapatsın.',
        ),
        high: t(
          'Bu hafta 20 dakikalık parçalar hâlinde çalış: parça bitene kadar yalnızca işinle ilgilen, sonra beş dakika ara ver.',
          'Bu hafta çocuğunuz 20 dakikalık parçalar hâlinde çalışsın: parça bitene kadar yalnızca işiyle ilgilensin, sonra beş dakika ara versin.',
        ),
      },
    },
    pull: {
      color: '#7a4ee6',
      study: {
        low: t(
          'Telefonu pek aklına getirmeden çalışabilmen dikkatini işinde tutmanı kolaylaştırıyor. Bir işte zorlandığında telefon yerine kısa bir ara vermek bu alışkanlığı koruyabilir.',
          'Çocuğunuzun telefonu pek aklına getirmeden çalışabilmesi dikkatini işinde tutmasını kolaylaştırıyor. Bir işte zorlandığında telefon yerine kısa bir ara vermesi bu alışkanlığı koruyabilir.',
        ),
        average: t(
          'Telefona ne zaman uzandığını fark et: zor bir yere geldiğinde mi, sıkıldığında mı? İsteğin geldiği anı bilmek, onu beklemeyi kolaylaştırabilir.',
          'Çocuğunuz telefona ne zaman uzandığını fark edebilir: zor bir yere geldiğinde mi, sıkıldığında mı? İsteğin geldiği anı bilmek, onu beklemesini kolaylaştırabilir.',
        ),
        high: t(
          'Telefona uzanma isteği çoğu zaman telefonu görünce ya da işte zorlanınca gelebilir. Telefonu görmeyeceğin bir yere koymak bu isteği baştan zayıflatabilir.',
          'Telefona uzanma isteği çoğu zaman telefonu görünce ya da işte zorlanınca gelebilir. Telefonu görmeyeceği bir yere koymak çocuğunuzun bu isteğini baştan zayıflatabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta telefonu aklına getirmeden çalıştığın bir zamanı fark et: neredeydin, ne yapıyordun?',
          'Bu hafta çocuğunuzla, telefonu aklına getirmeden çalıştığı bir zamanı konuşun: neredeydi, ne yapıyordu?',
        ),
        average: t(
          'Bu hafta telefona uzanmak istediğin anlarda kendine “Önce şu adımı bitireyim” de; sonra nasıl hissettiğini yaz.',
          'Bu hafta çocuğunuz telefona uzanmak istediği anlarda kendine “Önce şu adımı bitireyim” desin; sonra nasıl hissettiğini konuşun.',
        ),
        high: t(
          'Bu hafta bir “şu olursa şunu yapacağım” planı yaz: “Telefona uzanmak istersem önce elimdeki adımı bitireceğim.” Planı çalıştığın yerde görebileceğin bir yere koy.',
          'Bu hafta çocuğunuz bir “şu olursa şunu yapacağım” planı yazsın: “Telefona uzanmak istersem önce elimdeki adımı bitireceğim.” Planı çalıştığı yerde görebileceği bir yere koysun.',
        ),
      },
    },
    control: {
      color: '#0e9c8c',
      study: {
        low: t(
          'Telefon ya da ekranlar çalışmanı bölüyorsa kullanabileceğin birkaç yol var: telefonu sessize almak, görmeyeceğin bir yere koymak, ne zaman bakacağını önceden belirlemek. Yalnızca birini seçerek başla; çalışman pek bölünmüyorsa bunlara ihtiyaç duymayabilirsin.',
          'Telefon ya da ekranlar çocuğunuzun çalışmasını bölüyorsa kullanabileceği birkaç yol var: telefonu sessize almak, görmeyeceği bir yere koymak, ne zaman bakacağını önceden belirlemek. Yalnızca birini seçerek başlayabilir; çalışması pek bölünmüyorsa bunlara ihtiyaç duymayabilir.',
        ),
        average: t(
          'Hangi yolun işine yaradığını fark et: telefonu uzağa koymak mı, ne zaman bakacağını belirlemek mi? İşe yarayanı her çalışmanın başında bir alışkanlık hâline getirebilirsin.',
          'Çocuğunuz hangi yolun işine yaradığını fark edebilir: telefonu uzağa koymak mı, ne zaman bakacağını belirlemek mi? İşe yarayanı her çalışmanın başında bir alışkanlık hâline getirebilir.',
        ),
        high: t(
          'Bu yolları sık kullandığını söylüyorsun. Hangisinin hangi durumda en çok işine yaradığını not etmek, yoğun bir dönemde ona öncelik vermeni kolaylaştırabilir.',
          'Çocuğunuz bu yolları sık kullandığını belirtiyor. Hangisinin hangi durumda en çok işine yaradığını not etmesi, yoğun bir dönemde ona öncelik vermesini kolaylaştırabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta telefon ya da bir ekran çalışmanı bölüyorsa bir yol seç ve her çalışmada kullan; örneğin telefonu sessize al ya da çantaya koy. Nasıl geçtiğini bir cümleyle yaz.',
          'Bu hafta telefon ya da bir ekran çocuğunuzun çalışmasını bölüyorsa bir yol seçip her çalışmada kullansın; örneğin telefonu sessize alsın ya da çantaya koysun. Nasıl geçtiğini konuşun.',
        ),
        average: t(
          'Bu hafta en çok işine yarayan yolu her çalışmanın başında kullan; kaç gün kullandığını işaretle.',
          'Bu hafta çocuğunuz en çok işine yarayan yolu her çalışmanın başında kullansın; kaç gün kullandığını işaretlesin.',
        ),
        high: t(
          'Bu hafta en çok işine yarayan yolu yeni bir duruma taşı; örneğin arkadaşlarınla birlikte çalışırken de kullan.',
          'Bu hafta çocuğunuz en çok işine yarayan yolu yeni bir duruma taşısın; örneğin arkadaşlarıyla birlikte çalışırken de kullansın.',
        ),
      },
    },
  },
  sources: [KAYNAK.stothart2015, KAYNAK.kushlev2016, KAYNAK.fitz2019, KAYNAK.rosen2013, KAYNAK.mayElder2018, KAYNAK.duckworth2016, KAYNAK.gollwitzer],
};
