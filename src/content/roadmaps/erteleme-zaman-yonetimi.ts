import { KAYNAK } from './kaynaklar';
import type { AudienceText, RoadmapTemplate } from './types';

/**
 * Erteleme ve Zaman Yönetimi: gelişim yol haritası metinleri.
 *
 * İlkeler:
 *  - Öneriler araştırmalarda ertelemeyle ilişkili bulunan alanlara dayanır (Steel, 2007): işi küçültmek ve tatsızlığını
 *    azaltmak, yakın ara hedefler, dikkat dağıtıcıları ortamdan uzaklaştırmak, enerjinin düşük olduğu saatte zor işe
 *    başlamamak; "ne zaman, nerede" planları ve engel planları (Gollwitzer ve Sheeran, 2006); süre tahmininde geçmiş deneyimi
 *    yeni işin tahminine bağlamak (yalnızca hatırlamak yetmiyor: Buehler, Griffin ve Ross, 1994); dinlenmeyi de planlamak
 *    (zaman yönetimi başarıdan biraz daha güçlü biçimde iyi oluşla ilişkili: Aeon, Faber ve Panaccio, 2021).
 *  - Giriş, ilk ve son hafta ertelemeyi varsaymaz (işlere zamanında başlayan için de doğru okunur).
 *  - 2. hafta planlama; 3. hafta zamanın kontrolü düşükse ona, değilse en düşük puanlı alana ayrılır.
 *  - Öğrenci metinleri okula özgü değildir ("iş", "çalışma"): yetişkine de aynen gösterilir. Ortamlar bölümü yoktur.
 *  - Aynı sayfada bir öneri bir kez verilir (2026-10-22 incelemesi): rapordaki kartlar çalışma kartındaki öneriyi
 *    söylemez; "Bu hafta dene" ve veliye yaklaşım, kartlarda ve çalışma kartlarında söylenmeyen bir adım önerir.
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

export const ertelemeZamanYonetimiRoadmap: RoadmapTemplate = {
  version: 'erteleme-zaman-yonetimi-yol-haritasi-1',
  planningScale: 'planning',
  planningTitle: 'Planlama',
  thirdWeek: 'lowest',
  wellbeing: { scale: 'control', group: 'low', link: null },
  unit: { one: 'alan', toPlural: 'alanlara' },
  balancedNote: t(
    'Beş alanda da puanın ortada: hiçbiri belirgin biçimde öne çıkmıyor ya da geride kalmıyor.',
    'Çocuğunuzun beş alanda da puanı ortada: hiçbiri belirgin biçimde öne çıkmıyor ya da geride kalmıyor.',
  ),
  studyIntro: t(
    'Zamanı iyi kullanmanın herkese uyan tek bir yolu yoktur; işe yarayan adım, hangi alanın sende güçlü, hangisinin geliştirilebilir olduğuna bağlıdır. Aşağıda her alan için bir sonraki küçük adım var; hepsini birden değil, birer birer dene.',
    'Zamanı iyi kullanmanın herkese uyan tek bir yolu yoktur; işe yarayan adım, hangi alanın güçlü, hangisinin geliştirilebilir olduğuna bağlıdır. Aşağıda çocuğunuzun her alanı için bir sonraki küçük adım var; hepsini birden değil, birer birer denemesine destek olun.',
  ),
  firstWeek: t(
    'Raporundaki beş alana bak. Bu hafta her akşam, o gün bir işe nasıl başladığını ya da bir işi neden ertelediğini (sıkıcı mı, zor mu, belirsiz mi, dikkatin mi dağıldı) bir kâğıda kısaca yaz.',
    'Raporu çocuğunuzla birlikte okuyun ve hangi cümlelerin onu anlattığını sorun. Bu hafta yalnızca gözlem yapın: işlere nasıl başlıyor, hangi işleri erteliyor?',
  ),
  lastWeek: t(
    'Dört haftada yazdıklarına bak: hangi adımlar işine yaradı? İşe yarayanı sürdür.',
    'Dört haftada neyin işe yaradığını çocuğunuzla konuşun; işe yarayanı sürdürün, yaramayanı bırakın.',
  ),
  nextTests: ['ders-calisma-motivasyonu', 'calisma-aliskanliklari', 'ogrenme-ve-basari-ozellikleri'],
  nextPurpose: { you: 'neden ve nasıl çalıştığını da görmek', parent: 'çocuğunuzun neden ve nasıl çalıştığını da görmek' },
  approach: {
    start: {
      low: 'Ertelediği bir işi hatırlatırken sesinizi sakin tutun; “Neden hâlâ başlamadın?” yerine “İlk adım ne olabilir?” diye sorun.',
      average: 'Ertelediği bir işe başladığında, bitirmesini beklemeden başlamasını fark edip söyleyin.',
      high: 'Zor bir işe başlarken yardım isteyip istemediğini sorun; istemiyorsa düzenine karışmayın.',
    },
    planning: {
      low: 'Haftanın başında birlikte kısa bir yapılacaklar listesi hazırlayın.',
      average: 'Planını sizinle paylaştığında ilgiyle dinleyin; planı onun yerine yapmayın.',
      high: 'Planına uymadığı bir günde onu eleştirmek yerine ertesi gün yeniden başlamasını destekleyin.',
    },
    estimation: {
      low: 'Süreyi kısa tahmin ettiğinde bunu bir kusur gibi değil, herkesin yaşadığı bir yanılgı gibi konuşun.',
      average: 'Bir iş beklediğinden uzun sürdüğünde onu acele ettirmek yerine kalan işi birlikte yeniden planlayın.',
      high: 'Gerçekçi planlarını fark ettiğinizi söyleyin.',
    },
    focus: {
      low: 'Telefonu elinden almak yerine kuralı onunla birlikte koyun; siz de o saatlerde telefonu bir kenara bırakarak örnek olun.',
      average: 'Onun çalıştığı saatlerde evdeki gürültüyü ve araya giren işleri azaltmaya çalışın.',
      high: 'Çalışırken onu bölmemeye özen gösterin.',
    },
    control: {
      low: 'Ondan yeni bir iş istemeden önce elindeki işleri birlikte gözden geçirin; gerekirse bazılarını erteleyin ya da paylaşın.',
      average: 'Yoğun dönemlerde ondan beklediğiniz ek işleri hafifletin.',
      high: 'Dinlenmeye ayırdığı zamana saygı gösterin.',
    },
  },
  scales: {
    start: {
      color: '#ee6a36',
      study: {
        low: t(
          'Ertelediğin bir işe başlamanın en kolay yolu onu çok küçültmek: “Bu işin ilk beş dakikasında ne yapacağım?” sorusunun cevabını yaz ve yalnızca onu yap. İşi küçültmek, onun verdiği kötü duyguyu da küçültebilir.',
          'Ertelenen bir işe başlamanın en kolay yolu onu çok küçültmektir: çocuğunuzla “Bu işin ilk beş dakikasında ne yapacaksın?” sorusunun cevabını birlikte bulun. İşi küçültmek, onun verdiği kötü duyguyu da küçültebilir.',
        ),
        average: t(
          'Sıkıcı işi sevdiğin bir şeyin hemen öncesine koymak, zor işi parçalara bölmek, belirsiz işin ilk adımını yazmak işe yarayabilir.',
          'Çocuğunuzun sıkıcı işi sevdiği bir şeyin hemen öncesine koyması, zor işi parçalara bölmesi, belirsiz işin ilk adımını yazması işe yarayabilir.',
        ),
        high: t(
          'İşlere zamanında başlama alışkanlığın var. Zor ya da sıkıcı işlerde de bu alışkanlığı sürdürmek için onları günün, enerjinin yüksek olduğu bir saatine koyabilirsin.',
          'Çocuğunuzun işlere zamanında başlama alışkanlığı var. Zor ya da sıkıcı işlerde de bunu sürdürmek için o işleri günün, enerjisinin yüksek olduğu bir saatine koyabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her gün ertelediğin bir işin yalnızca ilk beş dakikasını yap; beş dakika dolunca istersen bırak.',
          'Bu hafta çocuğunuzla, her gün ertelediği bir işin yalnızca ilk beş dakikasını yapmasını kararlaştırın; beş dakika dolunca isterse bırakabilir.',
        ),
        average: t(
          'Bu hafta ertelediğin işlerden birini parçalara böl ve her gün yalnızca bir parçasını yap.',
          'Bu hafta çocuğunuz ertelediği işlerden birini parçalara bölsün ve her gün yalnızca bir parçasını yapsın.',
        ),
        high: t(
          'Bu hafta en sıkıcı bulduğun işi, enerjinin en yüksek olduğu saate koy.',
          'Bu hafta çocuğunuz en sıkıcı bulduğu işi, enerjisinin en yüksek olduğu saate koysun.',
        ),
      },
    },
    planning: {
      color: '#d28a14',
      study: {
        low: t(
          'Planın uzun olması gerekmez. Bir işi ne zaman ve nerede yapacağını tek cümleyle yaz: “Akşam yemeği bitince masama oturup bu işe başlayacağım.” Araştırmalarda “şu olunca şunu yapacağım” biçimindeki bu planlar hedefe ulaşmayı belirgin biçimde kolaylaştırıyor.',
          'Planın uzun olması gerekmez. Çocuğunuz bir işi ne zaman ve nerede yapacağını tek cümleyle yazabilir: “Akşam yemeği bitince masama oturup bu işe başlayacağım.” Araştırmalarda “şu olunca şunu yapacağım” biçimindeki bu planlar hedefe ulaşmayı belirgin biçimde kolaylaştırıyor.',
        ),
        average: t(
          'Uzun işlere ara hedefler ve tarihler koy: uzak bir son tarihi yakın adımlara çevirmek başlamayı kolaylaştırabilir.',
          'Çocuğunuzun uzun işlere ara hedefler ve tarihler koyması, uzak bir son tarihi yakın adımlara çevirerek başlamayı kolaylaştırabilir.',
        ),
        high: t(
          'Haftanın sonunda planının ne kadarının gerçekleştiğine bak ve bir sonraki haftanın planını buna göre kur; gerçekçi bir planı sürdürmek daha kolaydır.',
          'Çocuğunuz haftanın sonunda planının ne kadarının gerçekleştiğine bakıp bir sonraki haftanın planını buna göre kurabilir; gerçekçi bir planı sürdürmek daha kolaydır.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her akşam, ertesi gün yapacağın tek bir işin ne zaman ve nerede yapılacağını yaz.',
          'Bu hafta her akşam çocuğunuzla, ertesi gün yapacağı tek bir işin ne zaman ve nerede yapılacağını kararlaştırın.',
        ),
        average: t(
          'Bu hafta her sabah yapılacakları yaz ve en önemli üç işi işaretle.',
          'Bu hafta çocuğunuz her sabah yapılacakları yazsın ve en önemli üç işi işaretlesin.',
        ),
        high: t(
          'Bu hafta planına her gün en az bir dinlenme zamanı ekle.',
          'Bu hafta çocuğunuzun planına her gün en az bir dinlenme zamanı eklemesini önerin.',
        ),
      },
    },
    estimation: {
      color: '#7a4ee6',
      study: {
        low: t(
          'Bir işe başlamadan önce süresini tahmin et ve bir kenara yaz; iş bitince gerçek süreyle karşılaştır. Birkaç hafta sonra kendi tahmin yanılgını tanıyabilirsin. Tahmin ederken “Geçen sefer benzer bir iş ne kadar sürmüştü?” diye sorup cevabı yeni işin tahminine katmak, araştırmalarda iyimser tahmini azaltmış; yalnızca hatırlamak yetmemiş.',
          'Çocuğunuz bir işe başlamadan önce süresini tahmin edip yazabilir ve iş bitince gerçek süreyle karşılaştırabilir. Birkaç hafta sonra kendi tahmin yanılgısını tanıyabilir. Tahmin ederken “Geçen sefer benzer bir iş ne kadar sürmüştü?” diye sorup cevabı yeni işin tahminine katmak, araştırmalarda iyimser tahmini azaltmış; yalnızca hatırlamak yetmemiş.',
        ),
        average: t(
          'Uzun ya da yeni işlerde tahmin ettiğin süreye pay ekle ve iş bitince gerçek süreyle karşılaştır.',
          'Uzun ya da yeni işlerde çocuğunuz tahmin ettiği süreye pay ekleyip iş bitince gerçek süreyle karşılaştırabilir.',
        ),
        high: t(
          'Süreleri gerçekçi tahmin edebiliyorsun. Bu beceriyi uzun işleri adımlara bölerken kullan: her adıma gerçekçi bir süre vermek, son tarihe sıkışmadan ulaşmanı kolaylaştırabilir.',
          'Çocuğunuz süreleri gerçekçi tahmin edebiliyor. Bu beceriyi uzun işleri adımlara bölerken kullanabilir: her adıma gerçekçi bir süre vermek, son tarihe sıkışmadan ulaşmasını kolaylaştırabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her gün bir işin süresini önceden tahmin et, sonra gerçek süreyi ölç ve ikisini yan yana yaz.',
          'Bu hafta çocuğunuzla her gün bir işin süresini önceden tahmin edip sonra gerçek süreyi ölçün.',
        ),
        average: t(
          'Bu hafta uzun bir işin süresini tahmin ederken benzer bir işin daha önce ne kadar sürdüğünü hesaba kat.',
          'Bu hafta çocuğunuz uzun bir işin süresini tahmin ederken benzer bir işin daha önce ne kadar sürdüğünü hesaba katsın.',
        ),
        high: t(
          'Bu hafta uzun bir işi adımlara böl ve her adıma bir süre ver.',
          'Bu hafta çocuğunuz uzun bir işi adımlara bölsün ve her adıma bir süre versin.',
        ),
      },
    },
    focus: {
      color: '#2f5ce0',
      study: {
        low: t(
          'Dikkat dağıtıcıya her seferinde direnmek zordur; onu ortamdan uzaklaştırmak daha kolay olabilir. Bir işe başlamadan telefonunu başka bir odaya koy, bildirimleri kapat ve masanda yalnızca o işe gereken şeyleri bırak.',
          'Dikkat dağıtıcıya her seferinde direnmek zordur; onu ortamdan uzaklaştırmak daha kolay olabilir. Çocuğunuzun çalışma saatlerinde telefonunun başka bir odada durması, bildirimlerin kapalı olması ve masada yalnızca o işe gereken şeylerin bulunması yardımcı olabilir.',
        ),
        average: t(
          'Dikkatinin en çok ne zaman dağıldığını fark et ve o durumlar için önceden karar ver; örneğin bir işle uğraşırken telefonun başka odada durması gibi.',
          'Çocuğunuzun dikkatinin en çok ne zaman dağıldığını birlikte fark edin ve o durumlar için önceden bir karar alın; örneğin bir işle uğraşırken telefonun başka odada durması gibi.',
        ),
        high: t(
          'Odağını koruyabiliyorsun. Uzun işlerde dikkatini korumak için işi bölümlere ayırıp aralara kısa molalar koyabilirsin.',
          'Çocuğunuz odağını koruyabiliyor. Uzun işlerde işi bölümlere ayırıp aralara kısa molalar koyması dikkatini korumasına yardım edebilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta bir işe oturduğunda 25 dakikalık bir süre tut; süre bitene kadar telefona bakmamayı dene ve kaç kez bakmak istediğini bir kâğıda işaretle.',
          'Bu hafta çocuğunuzla 25 dakikalık telefonsuz çalışma süreleri deneyin; süre bitince birlikte kısa bir mola verin.',
        ),
        average: t(
          'Bu hafta dikkatinin dağıldığı anları bir kâğıda işaretle; hafta sonunda en sık ne olduğuna bak.',
          'Bu hafta çocuğunuz dikkatinin dağıldığı anları bir kâğıda işaretlesin; hafta sonunda birlikte bakın.',
        ),
        high: t(
          'Bu hafta uzun bir işi bölümlere ayır ve aralara kısa molalar koy.',
          'Bu hafta çocuğunuz uzun bir işi bölümlere ayırsın ve aralara kısa molalar koysun.',
        ),
      },
    },
    control: {
      color: '#0e9c8c',
      study: {
        low: t(
          'İşlerin altında ezildiğini hissettiğinde bütün işleri bir kâğıda yaz; zihninde dönen işler kâğıtta görünür olur. Sonra yalnızca en önemli tek işi seç ve ona başla. Dinlenmeyi de listeye koy: araştırmalarda zaman yönetimi, başarıdan biraz daha güçlü biçimde kendini iyi hissetmeyle ilişkili bulunmuş.',
          'Çocuğunuz işlerin altında ezildiğini hissettiğinde bütün işleri birlikte bir kâğıda yazın; zihninde dönen işler kâğıtta görünür olur. Sonra en önemli tek işi seçip ona başlamasına yardım edin. Dinlenmeyi de listeye koyun: araştırmalarda zaman yönetimi, başarıdan biraz daha güçlü biçimde kendini iyi hissetmeyle ilişkili bulunmuş.',
        ),
        average: t(
          'İşlerin üst üste bindiği günlerde hepsini aynı anda düşünmek yerine yalnızca sıradaki işe bak; bitince bir sonrakine geç. Her gün kendine ayırdığın küçük bir zamanı korumak da kontrol duygusunu güçlendirebilir.',
          'İşlerin üst üste bindiği günlerde çocuğunuzun hepsini aynı anda düşünmek yerine yalnızca sıradaki işe bakması işini kolaylaştırabilir. Her gün kendine ayırdığı küçük bir zamanın korunması da kontrol duygusunu güçlendirebilir.',
        ),
        high: t(
          'Yoğun bir dönem yaklaşırken o dönemin takvimini önceden çıkar: neyin ne zaman yapılacağını görmek bu dengeyi korumana yardım edebilir.',
          'Çocuğunuzun yoğun bir dönem yaklaşırken o dönemin takvimini önceden çıkarması, neyin ne zaman yapılacağını görmesini ve bu dengeyi korumasını kolaylaştırabilir.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her gün kendine 20 dakikalık, yalnızca dinlenmeye ya da sevdiğin bir şeye ayrılmış bir zaman koy ve onu bir iş gibi koru.',
          'Bu hafta çocuğunuzun her gün 20 dakikalık, yalnızca dinlenmeye ya da sevdiği bir şeye ayrılmış bir zamanı olsun; bu zamanı birlikte koruyun.',
        ),
        average: t(
          'Bu hafta en yoğun gününün akşamında, o gün seni en çok neyin sıkıştırdığını tek cümleyle yaz.',
          'Bu hafta çocuğunuzla, en yoğun gününün akşamında onu en çok neyin sıkıştırdığını konuşun.',
        ),
        high: t(
          'Bu hafta her gün sevdiğin bir şey için kendine zaman ayır.',
          'Bu hafta çocuğunuzun her gün sevdiği bir şey için zaman ayırmasını destekleyin.',
        ),
      },
    },
  },
  sources: [KAYNAK.steel, KAYNAK.gollwitzer, KAYNAK.buehler, KAYNAK.aeon],
};
