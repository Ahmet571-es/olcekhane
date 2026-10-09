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
 */
const t = (student: string, parent: string): AudienceText => ({ student, parent });

export const ertelemeZamanYonetimiRoadmap: RoadmapTemplate = {
  version: 'erteleme-zaman-yonetimi-yol-haritasi-1',
  planningScale: 'planning',
  planningTitle: 'Planlama',
  thirdWeek: 'lowest',
  wellbeing: { scale: 'control', group: 'low', link: null },
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
      low: 'Ertelediği için suçlamak yerine işin ilk küçük adımını birlikte belirleyin.',
      average: 'Hangi işleri ertelediğini yargılamadan birlikte konuşun.',
      high: 'Zamanında başlama çabasını fark ettiğinizi ona söyleyin.',
    },
    planning: {
      low: 'Haftanın başında birlikte kısa bir yapılacaklar listesi hazırlayın.',
      average: 'Yoğun dönemlerde neyin önce yapılacağını birlikte konuşun.',
      high: 'Planlarının esnek olabileceğini, aksayan günlerin de olağan olduğunu hatırlatın.',
    },
    estimation: {
      low: 'Bir işin ne kadar süreceğini birlikte tahmin edip sonra gerçek süreyle karşılaştırın.',
      average: 'Uzun işlerde süreyi birlikte, pay bırakarak planlayın.',
      high: 'Gerçekçi planlarını fark ettiğinizi söyleyin.',
    },
    focus: {
      low: 'Çalışma saatlerinde telefonun başka bir odada durmasını birlikte kararlaştırın.',
      average: 'Dikkatinin ne zaman dağıldığını yargılamadan birlikte gözlemleyin.',
      high: 'Çalışırken onu bölmemeye özen gösterin.',
    },
    control: {
      low: 'İşlerini birlikte yazıya döküp en önemli tek işi seçmesine yardım edin; yük çok ağırsa okulun rehberlik servisine başvurun.',
      average: 'Yoğun dönemlerde işleri birlikte önem sırasına koyun.',
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
          'Ertelediğin işlerin ortak yanını bul: sıkıcı mı, zor mu, belirsiz mi? Sıkıcı işi sevdiğin bir şeyin hemen öncesine koymak, zor işi parçalara bölmek, belirsiz işin ilk adımını yazmak işe yarayabilir.',
          'Çocuğunuzun ertelediği işlerin ortak yanını birlikte bulun: sıkıcı mı, zor mu, belirsiz mi? Sıkıcı işi sevdiği bir şeyin hemen öncesine koymak, zor işi parçalara bölmek, belirsiz işin ilk adımını yazmak işe yarayabilir.',
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
          'Bu hafta ertelediğin işleri bir yere not et; hafta sonunda ortak yanlarına bak.',
          'Bu hafta çocuğunuz ertelediği işleri not etsin; hafta sonunda ortak yanlarına birlikte bakın.',
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
          'Yoğun dönemlerde güne başlarken yapılacakları yaz ve en önemli üç işi işaretle. Uzun işlere ara hedefler ve tarihler koymak, uzak bir son tarihi yakın adımlara çevirir.',
          'Yoğun dönemlerde çocuğunuz güne başlarken yapılacakları yazıp en önemli üç işi işaretleyebilir. Uzun işlere ara hedefler ve tarihler koymak, uzak bir son tarihi yakın adımlara çevirir.',
        ),
        high: t(
          'Plan yapma becerin güçlü. Planına dinlenme ve beklenmedik işler için boş zaman da ekle; esnek bir planı sürdürmek daha kolay olabilir.',
          'Çocuğunuzun plan yapma becerisi güçlü. Planına dinlenme ve beklenmedik işler için boş zaman da eklemesi, planı sürdürmesini kolaylaştırabilir.',
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
          'Bu hafta her işe başlamadan önce telefonunu başka bir odaya koy.',
          'Bu hafta çocuğunuzla, her işe başlamadan önce telefonun başka bir odaya konmasını kararlaştırın.',
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
          'Yoğun dönemlerde işleri yazıya dökmek ve önem sırasına koymak kontrol duygusunu güçlendirebilir. Her gün kendine ayırdığın küçük bir zamanı korumayı da unutma.',
          'Yoğun dönemlerde işleri yazıya dökmek ve önem sırasına koymak çocuğunuzun kontrol duygusunu güçlendirebilir. Her gün kendine ayırdığı küçük bir zamanın korunması da önemlidir.',
        ),
        high: t(
          'Zamanını yönettiğini hissediyorsun. Bu dengeyi korumak için dinlenme zamanını da planının bir parçası olarak gör.',
          'Çocuğunuz zamanını yönettiğini hissediyor. Bu dengeyi korumak için dinlenme zamanını da planının bir parçası olarak görmesini destekleyin.',
        ),
      },
      action: {
        low: t(
          'Bu hafta her akşam ertesi günün en önemli tek işini seç ve sabah ilk ona başla.',
          'Bu hafta her akşam çocuğunuzla ertesi günün en önemli tek işini seçin; sabah ilk ona başlasın.',
        ),
        average: t(
          'Bu hafta yoğun günlerde işlerini yazıya dök ve önem sırasına koy.',
          'Bu hafta yoğun günlerde çocuğunuz işlerini yazıya döksün ve önem sırasına koysun.',
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
