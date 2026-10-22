import type { BandText, ReportTemplate } from './types';

/**
 * Altı Boyutlu Kişilik Profili rapor metinleri.
 * İlkeler (Ayrıntılı Kişilik Profili ile aynı): kişilik boyutlarında "iyi" ya da "kötü" uç yoktur; her tarzın güçlü
 * yanı anlatılır. Etiketleme yapılmaz; sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye
 * "Çocuğunuz ... belirtiyor" dili kullanılır. İçtenlik, adil davranma ve sadelik gibi değer yüklü alt özelliklerde
 * düşük düzey suçlamadan, gelişime açık bir dille anlatılır.
 * Duygusallık boyutu kaynaktaki yönüyle anlatılır: yüksek puan duyguları daha yoğun yaşamak demektir, bir sorun
 * belirtisi değildir. Endişelenme alt özelliği bir tarama aracı değildir.
 * Boyut metinleri iki üç cümle, alt özellik metinleri bir iki cümledir. Öneri listeleri (kapsamlı rapor için) bu testte
 * henüz yazılmadı; basit raporda gösterilmez.
 * Destek kutusu: Endişelenme alt özelliği yüksek düzeydeyse gösterilir.
 * Yetişkin raporu öğrenci metinlerini kullanır; öğrenci metni okula ya da ergenliğe özgü olduğunda yetişkin metni
 * (`adult`) ayrıca yazılmıştır.
 * Yüksek uç bir başarı ("sana güç verir"), düşük uç bir eksiklik diye anlatılmaz; orta düzey de yükseğe yaslanmaz
 * ("Çoğu zaman planlı" yerine "Duruma göre planlı").
 *
 * Ayrışma (`facetSplit`): bir boyutun alt özelliklerinden biri yüksek, bir başkası düşükse boyut kartında düzey metni
 * yerine "Alt özellikleri ayrışan" metni gösterilir. Boyutun düzey metni bütün alt özelliklerin davranışlarını birlikte
 * anlattığı için ayrışmada bir alt özelliğin kartıyla çelişirdi (ör. "Yüksek · Hoşgörülü ve sabırlı" Uyumluluk kartının
 * altında "Düşük · Çabuk sinirlenen" Sabırlılık kartı). Yol haritası da ayrışan boyut için orta düzeyin önerilerini verir
 * (lib/reports/build.ts: split).
 */
const t = (summary: string, student: string, parent: string, extra?: { support?: boolean; adult?: string }): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(extra?.adult ? { adult: extra.adult } : {}),
  ...(extra?.support ? { support: true } : {}),
});

/**
 * Bir boyutun alt özellikleri ayrıştığında (en az biri yüksek, en az biri düşük) boyut kartında, boyutun düzey metni
 * yerine gösterilen metin; `facets` alt özelliklerin adlarıdır.
 */
const splitText = (facets: string) => ({
  summary: 'Alt özellikleri ayrışan',
  student: `Bu boyutun alt özellikleri (${facets}) sende birbirinden ayrılıyor: aralarında yüksek olan da var, düşük olan da. Bu yüzden boyut puanın seni tek başına iyi anlatmıyor; alt özelliklerini aşağıda tek tek görebilirsin.`,
  parent: `Bu boyutun alt özellikleri (${facets}) çocuğunuzda birbirinden ayrılıyor: aralarında yüksek olan da var, düşük olan da. Bu yüzden boyut puanı onu tek başına iyi anlatmıyor; alt özellikleri aşağıda tek tek görülüyor.`,
});

export const altiBoyutluKisilikReport: ReportTemplate = {
  version: 'alti-boyutlu-kisilik-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  facetSplit: {
    honesty_humility: splitText('içtenlik, adil davranma, sadelik ve alçakgönüllülük'),
    emotionality: splitText('tehlikeden çekinme, endişelenme, destek ihtiyacı ve duygusal duyarlılık'),
    extraversion: splitText('kendini ifade etme, sosyal cesaret, sosyallik ve canlılık'),
    agreeableness: splitText('bağışlayıcılık, hoşgörü, esneklik ve sabırlılık'),
    conscientiousness: splitText('düzenlilik, çalışkanlık, özenlilik ve temkinlilik'),
    openness: splitText('sanata ve güzelliğe ilgi, merak, yaratıcılık ve sıra dışılık'),
  },
  scales: {
    /* ---------- Boyutlar ---------- */
    honesty_humility: {
      high: t(
        'İçten ve alçakgönüllü',
        'Genel olarak insanlarla içten ilişkiler kurduğunu, çıkarın için başkalarını kullanmadığını ve kendini başkalarından üstün görmediğini söylüyorsun.',
        'Çocuğunuz genel olarak insanlarla içten ilişkiler kurduğunu, çıkarı için başkalarını kullanmadığını ve kendini başkalarından üstün görmediğini belirtiyor.',
      ),
      average: t(
        'Duruma göre içten ve ölçülü',
        'Bazı durumlarda içten ve adil davranmayı, bazı durumlarda kendi çıkarını ya da başkalarının gözündeki yerini daha çok gözettiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda içten ve adil davranmayı, bazı durumlarda kendi çıkarını ya da başkalarının gözündeki yerini daha çok gözettiğini belirtiyor.',
      ),
      low: t(
        'Kendi çıkarını ve konumunu önemseyen',
        'Genel olarak kendi çıkarını, başkalarının gözündeki yerini ve öne çıkmayı önemsediğini söylüyorsun. Hedeflerin için çabalamak değerli; bunu yaparken insanlarla içten ve adil ilişkiler kurmak, uzun vadede sana güvenilmesini sağlar.',
        'Çocuğunuz genel olarak kendi çıkarını, başkalarının gözündeki yerini ve öne çıkmayı önemsediğini belirtiyor. Hedefleri için çabalamasını desteklerken içtenliğin ve adil davranmanın insanlar arasında nasıl güven oluşturduğunu onunla konuşabilirsiniz.',
      ),
    },
    emotionality: {
      high: t(
        'Duygularını yoğun yaşayan',
        'Genel olarak duygularını yoğun yaşadığını söylüyorsun: tehlike ve belirsizlik karşısında kolayca endişelenebiliyor, zor zamanlarda başkalarının desteğini arıyor ve sevdiklerine derinden bağlanıyorsun. Bu duyarlılık, başkalarını anlamana ve onlarla yakın bağlar kurmana yardım eder.',
        'Çocuğunuz genel olarak duygularını yoğun yaşadığını belirtiyor: tehlike ve belirsizlik karşısında kolayca endişelenebiliyor, zor zamanlarda başkalarının desteğini arıyor ve sevdiklerine derinden bağlanıyor. Bu duyarlılık, başkalarını anlamasına ve onlarla yakın bağlar kurmasına yardım eder.',
      ),
      average: t(
        'Duruma göre duygusal',
        'Duygularını bazı durumlarda yoğun yaşadığını, bazı durumlarda ise daha sakin karşıladığını söylüyorsun.',
        'Çocuğunuz duygularını bazı durumlarda yoğun yaşadığını, bazı durumlarda ise daha sakin karşıladığını belirtiyor.',
      ),
      low: t(
        'Sakin, kendi ayakları üzerinde duran',
        'Genel olarak tehlike ve stres karşısında sakin kaldığını, zorluklarla çoğunlukla kendi başına baş ettiğini ve duygularını çok yoğun yaşamadığını söylüyorsun. Bu sakinlik zor anlarda işine yarayabilir.',
        'Çocuğunuz genel olarak tehlike ve stres karşısında sakin kaldığını, zorluklarla çoğunlukla kendi başına baş ettiğini ve duygularını çok yoğun yaşamadığını belirtiyor.',
      ),
    },
    extraversion: {
      high: t(
        'Sosyal ve enerjik',
        'Genel olarak insanlarla bir arada olmaktan, konuşmaktan ve topluluk içinde öne çıkmaktan enerji aldığını söylüyorsun.',
        'Çocuğunuz genel olarak insanlarla bir arada olmaktan, konuşmaktan ve topluluk içinde öne çıkmaktan enerji aldığını belirtiyor.',
      ),
      average: t(
        'Duruma göre sosyal',
        'İnsanlarla bir arada olmakla kendi başına kalmak arasında dengeli bir yerdesin; duruma göre ikisinden de keyif alabiliyorsun.',
        'Çocuğunuz insanlarla bir arada olmakla kendi başına kalmak arasında dengeli bir tarz tanımlıyor; duruma göre ikisinden de keyif alabildiğini belirtiyor.',
      ),
      low: t(
        'Sakin, kendi alanını seven',
        'Genel olarak kalabalık ve hareketli ortamlar yerine sakin ortamları ya da az sayıda insanla bir arada olmayı tercih ettiğini söylüyorsun. Bu bir eksiklik değil; birçok insan sakin ortamlarda daha iyi odaklanır ve düşünür.',
        'Çocuğunuz genel olarak kalabalık ve hareketli ortamlar yerine sakin ortamları ya da az sayıda insanla bir arada olmayı tercih ettiğini belirtiyor. Bu bir eksiklik değildir; birçok kişi sakin ortamlarda daha iyi odaklanır.',
      ),
    },
    agreeableness: {
      high: t(
        'Hoşgörülü ve sabırlı',
        'Genel olarak insanların hatalarını kolayca bağışladığını, onlara hoşgörüyle yaklaştığını, uzlaşmaya açık ve sabırlı olduğunu söylüyorsun.',
        'Çocuğunuz genel olarak insanların hatalarını kolayca bağışladığını, onlara hoşgörüyle yaklaştığını, uzlaşmaya açık ve sabırlı olduğunu belirtiyor.',
      ),
      average: t(
        'Duruma göre uzlaşan',
        'Hoşgörülü ve sabırlı olmakla kendi doğrularını savunmak arasında dengeli bir yerdesin; duruma göre uzlaşabiliyor, gerektiğinde itiraz edebiliyorsun.',
        'Çocuğunuz hoşgörülü ve sabırlı olmakla kendi doğrularını savunmak arasında dengeli bir tarz tanımlıyor; duruma göre uzlaşabildiğini, gerektiğinde itiraz edebildiğini belirtiyor.',
      ),
      low: t(
        'Tepkilerini saklamayan',
        'Genel olarak kötü davranışları kolay kolay unutmadığını, insanların hatalarına ve eleştirilere çabuk tepki verdiğini ve kendi doğrularında ısrar ettiğini söylüyorsun. Düşündüğünü söyleyebilmek değerli; bunu yaparken karşındakinin bakış açısını da dinlemek ilişkilerini güçlendirir.',
        'Çocuğunuz genel olarak kötü davranışları kolay kolay unutmadığını, insanların hatalarına ve eleştirilere çabuk tepki verdiğini ve kendi doğrularında ısrar ettiğini belirtiyor. Karşısındakinin bakış açısını dinlemesi için onu desteklemek ilişkilerini güçlendirebilir.',
      ),
    },
    conscientiousness: {
      high: t(
        'Planlı ve kararlı',
        'Genel olarak düzenli, çalışkan ve özenli olduğunu, işlerini düşünüp planlayarak yaptığını söylüyorsun. Bu eğilim okulda ve hedeflerine ulaşırken işine yarayabilir.',
        'Çocuğunuz genel olarak düzenli, çalışkan ve özenli olduğunu, işlerini düşünüp planlayarak yaptığını belirtiyor.',
        {
          adult:
            'Genel olarak düzenli, çalışkan ve özenli olduğunu, işlerini düşünüp planlayarak yaptığını söylüyorsun. Bu eğilim işinde, eğitiminde ve hedeflerine ulaşırken sana yardımcı olabilir.',
        },
      ),
      average: t(
        'Duruma göre planlı',
        'Bazı durumlarda düzenli ve planlı, bazı durumlarda daha esnek ve anlık davrandığını söylüyorsun.',
        'Çocuğunuz bazı durumlarda düzenli ve planlı, bazı durumlarda daha esnek ve anlık davrandığını belirtiyor.',
      ),
      low: t(
        'Esnek, anlık hareket eden',
        'Genel olarak planlara ve düzene bağlı kalmak yerine esnek ve anlık hareket etmeyi tercih ettiğini söylüyorsun. Bu esneklik bazı durumlarda avantaj olabilir; önemli işlerde küçük planlar ve hatırlatıcılar ise işini epey kolaylaştırır.',
        'Çocuğunuz genel olarak planlara ve düzene bağlı kalmak yerine esnek ve anlık hareket etmeyi tercih ettiğini belirtiyor. Ödev ve sınav gibi önemli işlerde birlikte küçük planlar yapmak ona destek olabilir.',
      ),
    },
    openness: {
      high: t(
        'Meraklı ve yeniliğe açık',
        'Genel olarak sanata ve güzelliğe, bilgiye, yeni fikirlere ve alışılmışın dışındaki yollara ilgi duyduğunu söylüyorsun. Bu merak öğrenmede ve yaratıcı işlerde işine yarayabilir.',
        'Çocuğunuz genel olarak sanata ve güzelliğe, bilgiye, yeni fikirlere ve alışılmışın dışındaki yollara ilgi duyduğunu belirtiyor. Bu merak öğrenmede ve yaratıcı işlerde ona yardımcı olabilir.',
      ),
      average: t(
        'Yeniyle bilineni dengeleyen',
        'Yeni fikirlerle bildiğin yollar arasında dengeli bir yerdesin: bazı alanlarda meraklı ve yaratıcısın, bazılarında ise alışık olduğun yolları tercih ediyorsun.',
        'Çocuğunuz yeni fikirlere ve deneyimlere belli ölçüde açık olduğunu, bazı alanlarda ise alışık olduğu yolları tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Somut ve pratik',
        'Genel olarak soyut fikirler ve sıra dışı yollar yerine somut, pratik ve bildiğin konuları tercih ettiğini söylüyorsun. Gerçekçi ve ayağı yere basan bir bakış birçok alanda işe yarar.',
        'Çocuğunuz genel olarak soyut fikirler ve sıra dışı yollar yerine somut, pratik ve bildiği konuları tercih ettiğini belirtiyor. Gerçekçi ve ayağı yere basan bu tarz birçok alanda işe yarar.',
      ),
    },

    /* ---------- Dürüstlük-Alçakgönüllülük alt özellikleri ---------- */
    sincerity: {
      high: t(
        'İçten ve samimi',
        'İnsanları etkilemek ya da onlardan bir şey elde etmek için rol yapmadığını, yağcılığa başvurmadığını söylüyorsun.',
        'Çocuğunuz insanları etkilemek ya da onlardan bir şey elde etmek için rol yapmadığını, yağcılığa başvurmadığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman içten',
        'Çoğu zaman olduğun gibi davrandığını, bazen de istediğini elde etmek ya da iyi görünmek için sözlerini ve tavrını ayarladığını söylüyorsun.',
        'Çocuğunuz çoğu zaman olduğu gibi davrandığını, bazen de istediğini elde etmek ya da iyi görünmek için sözlerini ve tavrını ayarladığını belirtiyor.',
      ),
      low: t(
        'Ortama göre rol yapabilen',
        'İstediğini elde etmek ya da iyi bir izlenim bırakmak için zaman zaman rol yapabildiğini ya da insanlara duymak istedikleri şeyleri dile getirebildiğini söylüyorsun; olduğun gibi davrandığında insanlar seni gerçekten tanıma fırsatı bulur.',
        'Çocuğunuz istediğini elde etmek ya da iyi bir izlenim bırakmak için zaman zaman rol yapabildiğini ya da insanlara duymak istedikleri şeyleri dile getirebildiğini belirtiyor. Olduğu gibi davranmanın ilişkilerine neler kattığını, suçlamadan ve günlük örnekler üzerinden onunla konuşabilirsiniz.',
      ),
    },
    fairness: {
      high: t(
        'Hakka ve kurala saygılı',
        'Başkasının hakkına dokunmadığını, hile yapmadığını ve kurallara uymaya çalıştığını söylüyorsun.',
        'Çocuğunuz başkasının hakkına dokunmadığını, hile yapmadığını ve kurallara uymaya çalıştığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman adil',
        'Çoğu zaman adil ve kurallara uygun davrandığını, bazı durumlarda ise kendi çıkarını öne alabildiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman adil ve kurallara uygun davrandığını, bazı durumlarda ise kendi çıkarını öne alabildiğini belirtiyor.',
      ),
      low: t(
        'Kuralları esnetebilen',
        'Kendi çıkarın söz konusu olduğunda kuralları esnetebildiğini ya da kurnazca yollara başvurabildiğini söylüyorsun; kuralların herkes için aynı işlemesi aslında seni de korur.',
        'Çocuğunuz kendi çıkarı söz konusu olduğunda kuralları esnetebildiğini ya da kurnazca yollara başvurabildiğini belirtiyor. Bunun sonuçlarını suçlamadan, açık bir dille onunla konuşmanız faydalı olabilir.',
      ),
    },
    greed_avoidance: {
      high: t(
        'Lükse ve statüye önem vermeyen',
        'Lükse, paraya ve statüye pek önem vermediğini, sade bir yaşamla yetinebildiğini söylüyorsun.',
        'Çocuğunuz lükse, paraya ve statüye pek önem vermediğini, sade bir yaşamla yetinebildiğini belirtiyor.',
      ),
      average: t(
        'Ölçülü istekleri olan',
        'Lükse ve statüye bir ölçüde ilgi duyduğunu, ama bu ilginin çok güçlü olmadığını söylüyorsun.',
        'Çocuğunuz lükse ve statüye bir ölçüde ilgi duyduğunu, ama bu ilginin çok güçlü olmadığını belirtiyor.',
      ),
      low: t(
        'Lükse ve statüye ilgi duyan',
        'Lüks bir yaşama, paraya ve toplumda saygın bir konuma ilgi duyduğunu söylüyorsun; bu istekler seni çalışmaya yöneltebilir, onlara ulaşırken neye değer verdiğini de gözden kaçırmamak önemli.',
        'Çocuğunuz lüks bir yaşama, paraya ve toplumda saygın bir konuma ilgi duyduğunu belirtiyor. Bu istekler onu çalışmaya yöneltebilir; neye değer verdiğini ve hedeflerini onunla konuşmak faydalı olabilir.',
      ),
    },
    modesty: {
      high: t(
        'Alçakgönüllü',
        'Kendini başkalarından üstün görmediğini, övünmekten ve dikkat çekmekten kaçındığını söylüyorsun; alçakgönüllü olmak, kendi değerini görmene engel olmamalı.',
        'Çocuğunuz kendini başkalarından üstün görmediğini, övünmekten ve dikkat çekmekten kaçındığını belirtiyor.',
      ),
      average: t(
        'Kendini çoğu zaman başkalarıyla bir tutan',
        'Kendini çoğu zaman diğer insanlarla bir tuttuğunu, bazı konularda ise yeteneklerini ön plana çıkarmaktan hoşlandığını söylüyorsun.',
        'Çocuğunuz kendini çoğu zaman diğer insanlarla bir tuttuğunu, bazı konularda ise yeteneklerini ön plana çıkarmaktan hoşlandığını belirtiyor.',
      ),
      low: t(
        'Kendini öne çıkaran',
        'Kendini birçok insandan daha yetenekli gördüğünü ve dikkat çekmekten hoşlandığını söylüyorsun; yeteneklerinin farkında olmak değerli, başkalarının katkısını da görmek ilişkilerini güçlendirir.',
        'Çocuğunuz kendini birçok insandan daha yetenekli gördüğünü ve dikkat çekmekten hoşlandığını belirtiyor. Yeteneklerinin farkında olmasını desteklerken başkalarının katkılarını da fark etmesine yardımcı olabilirsiniz.',
      ),
    },

    /* ---------- Duygusallık alt özellikleri ---------- */
    fearfulness: {
      high: t(
        'Tehlikeden uzak duran',
        'Fiziksel tehlike ve risk karşısında kolayca korktuğunu, bu tür durumlardan uzak durmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz fiziksel tehlike ve risk karşısında kolayca korktuğunu, bu tür durumlardan uzak durmayı tercih ettiğini belirtiyor.',
      ),
      average: t(
        'Ölçülü risk alan',
        'Bazı riskleri göze alabildiğini, gerçekten tehlikeli durumlardan ise uzak durduğunu söylüyorsun.',
        'Çocuğunuz bazı riskleri göze alabildiğini, gerçekten tehlikeli durumlardan ise uzak durduğunu belirtiyor.',
      ),
      low: t(
        'Cesur, riskten çekinmeyen',
        'Tehlike ve risk karşısında kolay kolay korkmadığını, heyecan veren riskli şeyler yapmaktan hoşlandığını söylüyorsun; cesaret değerlidir, ama güvenliğini de gözetmek önemli.',
        'Çocuğunuz tehlike ve risk karşısında kolay kolay korkmadığını, riskli şeyler yapmaktan hoşlandığını belirtiyor. Bu cesareti spor ya da eğitmen eşliğinde doğa etkinlikleri gibi güvenli alanlara yöneltmesine destek olabilirsiniz.',
      ),
    },
    anxiety: {
      high: t(
        'Kolay endişelenen',
        'Günlük sorunlar ve belirsizlik karşısında sık sık endişelendiğini ve kolayca strese girdiğini söylüyorsun. Endişeyle baş etmeyi öğrenmek mümkün; seni zorluyorsa güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz günlük sorunlar ve belirsizlik karşısında sık sık endişelendiğini ve kolayca strese girdiğini belirtiyor. Bu sonuç bir tanı değildir; ancak bu endişelerin ne kadar süredir devam ettiğini ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir.',
        {
          support: true,
          adult:
            'Günlük sorunlar ve belirsizlik karşısında sık sık endişelendiğini ve kolayca strese girdiğini söylüyorsun. Endişeyle baş etmeyi öğrenmek mümkün; seni zorluyorsa güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
      average: t(
        'Zaman zaman endişelenen',
        'Bazı durumlarda endişelenip strese girdiğini, çoğu zaman ise sakin kalabildiğini söylüyorsun; zaman zaman endişelenmek herkesin yaşadığı bir şey.',
        'Çocuğunuz bazı durumlarda endişelenip strese girdiğini, çoğu zaman ise sakin kalabildiğini belirtiyor.',
      ),
      low: t(
        'Sakin, kolay kolay endişelenmeyen',
        'Kolay kolay endişelenmediğini ve baskı altında bile sakin kalabildiğini söylüyorsun.',
        'Çocuğunuz kolay kolay endişelenmediğini ve baskı altında bile sakin kalabildiğini belirtiyor.',
      ),
    },
    dependence: {
      high: t(
        'Desteğe değer veren',
        'Zor zamanlarda başkalarının desteğine, onayına ve yakınlığına ihtiyaç duyduğunu söylüyorsun; destek istemek güçlü ilişkilerin bir parçasıdır.',
        'Çocuğunuz zor zamanlarda başkalarının desteğine, onayına ve yakınlığına ihtiyaç duyduğunu belirtiyor.',
      ),
      average: t(
        'Gerektiğinde destek arayan',
        'Bazı durumlarda başkalarının desteğini aradığını, bazılarında ise işin içinden kendi başına çıkabildiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda başkalarının desteğini aradığını, bazılarında ise işin içinden kendi başına çıkabildiğini belirtiyor.',
      ),
      low: t(
        'Kendi başının çaresine bakan',
        'Sorunlarınla çoğunlukla kendi başına baş ettiğini ve başkalarının onayına pek ihtiyaç duymadığını söylüyorsun; gerektiğinde yardım istemek de bir güçtür.',
        'Çocuğunuz sorunlarıyla çoğunlukla kendi başına baş ettiğini ve başkalarının onayına pek ihtiyaç duymadığını belirtiyor. Gerektiğinde yardım istemenin de bir güç olduğunu ona hatırlatabilirsiniz.',
      ),
    },
    sentimentality: {
      high: t(
        'Duyguları derinden hisseden',
        'Başkalarının duygularını derinden hissettiğini, üzücü olaylardan ve hikâyelerden kolayca etkilendiğini söylüyorsun.',
        'Çocuğunuz başkalarının duygularını derinden hissettiğini, üzücü olaylardan ve hikâyelerden kolayca etkilendiğini belirtiyor.',
      ),
      average: t(
        'Duygulara orta düzeyde duyarlı',
        'Başkalarının duygularına duyarlı olduğunu, ama üzücü olaylardan her zaman derinden etkilenmediğini söylüyorsun.',
        'Çocuğunuz başkalarının duygularına duyarlı olduğunu, ama üzücü olaylardan her zaman derinden etkilenmediğini belirtiyor.',
      ),
      low: t(
        'Duygulara mesafeli',
        'Üzücü olaylar ve hikâyeler karşısında kolay kolay duygulanmadığını söylüyorsun; bu, zor durumlarda soğukkanlı kalmana yardım edebilir.',
        'Çocuğunuz üzücü olaylar ve hikâyeler karşısında kolay kolay duygulanmadığını belirtiyor; bu, zor durumlarda soğukkanlı kalmasına yardım edebilir.',
      ),
    },

    /* ---------- Dışadönüklük alt özellikleri ---------- */
    expressiveness: {
      high: t(
        'Konuşkan, duygularını dışa vuran',
        'Çok konuştuğunu, duygularını ve düşüncelerini açıkça dışa vurduğunu söylüyorsun.',
        'Çocuğunuz çok konuştuğunu, duygularını ve düşüncelerini açıkça dışa vurduğunu belirtiyor.',
      ),
      average: t(
        'Duruma göre konuşkan',
        'Bazı ortamlarda çok konuşup kendini rahatça ifade ettiğini, bazılarında ise daha sessiz kalmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı ortamlarda çok konuşup kendini rahatça ifade ettiğini, bazılarında ise daha sessiz kalmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Az konuşan, sakin',
        'Az konuştuğunu ve duygularını çoğu zaman kendine sakladığını söylüyorsun; dinlemek de iletişimin önemli bir parçasıdır.',
        'Çocuğunuz az konuştuğunu ve duygularını çoğu zaman kendine sakladığını belirtiyor. Duygularını paylaşabileceği sakin ve güvenli anlar yaratmak ona iyi gelebilir.',
      ),
    },
    social_boldness: {
      high: t(
        'Topluluk önünde rahat',
        'Topluluk önünde konuşmaktan ve ilgi odağı olmaktan çekinmediğini, gerektiğinde öne çıkabildiğini söylüyorsun.',
        'Çocuğunuz topluluk önünde konuşmaktan ve ilgi odağı olmaktan çekinmediğini, gerektiğinde öne çıkabildiğini belirtiyor.',
      ),
      average: t(
        'Gerektiğinde öne çıkan',
        'Bazı durumlarda öne çıkıp söz alabildiğini, bazılarında ise geri planda kalmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda öne çıkıp söz alabildiğini, bazılarında ise geri planda kalmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Geri planda kalmayı seven',
        'Topluluk önünde konuşmaktan ve ilgi odağı olmaktan çekindiğini, geri planda kalmayı tercih ettiğini söylüyorsun; istersen küçük ve güvenli ortamlarda söz alarak zamanla daha rahat hissedebilirsin.',
        'Çocuğunuz topluluk önünde konuşmaktan ve ilgi odağı olmaktan çekindiğini, geri planda kalmayı tercih ettiğini belirtiyor. Küçük ve güvenli ortamlarda söz almasını desteklemek zamanla rahatlamasına yardım edebilir.',
      ),
    },
    sociability: {
      high: t(
        'İnsanlarla bir arada olmayı seven',
        'Boş zamanını insanlarla geçirmekten, sohbet etmekten ve bir grubun parçası olmaktan hoşlandığını söylüyorsun.',
        'Çocuğunuz boş zamanını insanlarla geçirmekten, sohbet etmekten ve bir grubun parçası olmaktan hoşlandığını belirtiyor.',
      ),
      average: t(
        'Hem insanlarla hem kendi başına',
        'İnsanlarla vakit geçirmekten de kendi başına kalmaktan da duruma göre keyif alabildiğini söylüyorsun.',
        'Çocuğunuz insanlarla vakit geçirmekten de kendi başına kalmaktan da duruma göre keyif alabildiğini belirtiyor.',
      ),
      low: t(
        'Kendi başına kalmayı seven',
        'Çoğu zaman kendi başına vakit geçirmeyi ya da az sayıda yakın insanla bir arada olmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman kendi başına vakit geçirmeyi ya da az sayıda yakın insanla bir arada olmayı tercih ettiğini belirtiyor.',
      ),
    },
    liveliness: {
      high: t(
        'Enerjik ve neşeli',
        'Gün boyu enerjik olduğunu, sık sık güldüğünü ve kendini dinç hissettiğini söylüyorsun.',
        'Çocuğunuz gün boyu enerjik olduğunu, sık sık güldüğünü ve kendini dinç hissettiğini belirtiyor.',
      ),
      average: t(
        'Çoğu zaman canlı',
        'Çoğu zaman enerjik ve keyifli olduğunu, bazı günlerde ise daha yorgun ya da durgun hissettiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman enerjik ve keyifli olduğunu, bazı günlerde ise daha yorgun ya da durgun hissettiğini belirtiyor.',
      ),
      low: t(
        'Daha az coşkulu',
        'Kendini çoğu zaman enerjik ya da coşkulu biri olarak görmediğini, çabuk yorulabildiğini söylüyorsun. Yorgunluk uykudan, sağlıktan ve yoğun dönemlerden de etkilenir; bu hâl uzun zamandır devam edip seni zorluyorsa güvendiğin biriyle konuşmak iyi gelir.',
        'Çocuğunuz kendini çoğu zaman enerjik ya da coşkulu biri olarak görmediğini, çabuk yorulabildiğini belirtiyor. Uyku düzenini ve günlük yoğunluğunu birlikte gözden geçirmek faydalı olabilir; bu hâl uzun zamandır devam ediyorsa onunla sakin bir anda konuşmanız önemlidir.',
      ),
    },

    /* ---------- Uyumluluk alt özellikleri ---------- */
    forgiveness: {
      high: t(
        'Kolayca bağışlayan',
        'Sana kötü davranan birini bile affedebildiğini, kin tutmadığını ve insanlara yeniden güvenebildiğini söylüyorsun.',
        'Çocuğunuz kendisine kötü davranan birini bile affedebildiğini, kin tutmadığını ve insanlara yeniden güvenebildiğini belirtiyor.',
      ),
      average: t(
        'Zamanla bağışlayan',
        'Kırıldığında affetmenin biraz zaman aldığını, ama çoğu zaman insanlara yeniden şans verdiğini söylüyorsun.',
        'Çocuğunuz kırıldığında affetmenin biraz zaman aldığını, ama çoğu zaman insanlara yeniden şans verdiğini belirtiyor.',
      ),
      low: t(
        'Kolay kolay unutmayan',
        'Sana kötü davranıldığında bunu kolay kolay unutmadığını ve insanlara yeniden güvenmekte zorlandığını söylüyorsun; affetmek, önce senin içini rahatlatabilir.',
        'Çocuğunuz kendisine kötü davranıldığında bunu kolay kolay unutmadığını ve insanlara yeniden güvenmekte zorlandığını belirtiyor. Kırgınlıklarını konuşabileceği bir ortam, affetmeyi kolaylaştırabilir.',
      ),
    },
    gentleness: {
      high: t(
        'Hoşgörülü ve yumuşak',
        'İnsanları oldukları gibi kabul ettiğini, onları çabucak yargılamadığını ve eleştirirken yumuşak davrandığını söylüyorsun.',
        'Çocuğunuz insanları oldukları gibi kabul ettiğini, onları çabucak yargılamadığını ve eleştirirken yumuşak davrandığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman hoşgörülü',
        'Çoğu zaman hoşgörülü olduğunu, bazen de insanların eksiklerini açıkça eleştirdiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman hoşgörülü olduğunu, bazen de insanların eksiklerini açıkça eleştirdiğini belirtiyor.',
      ),
      low: t(
        'Eleştirel bakan',
        'İnsanların eksiklerini kolayca fark edip açıkça eleştirdiğini söylüyorsun; eleştirinin yanında iyi yanları da dile getirmek, söylediklerinin daha kolay kabul görmesini sağlar.',
        'Çocuğunuz insanların eksiklerini kolayca fark edip açıkça eleştirdiğini belirtiyor. Eleştirirken karşısındakinin iyi yanlarını da dile getirmesini teşvik edebilirsiniz.',
      ),
    },
    flexibility: {
      high: t(
        'Uzlaşmaya açık',
        'Başkalarına kolayca uyum sağladığını, tavsiyelere kulak verdiğini ve uzlaşabildiğini söylüyorsun.',
        'Çocuğunuz başkalarına kolayca uyum sağladığını, tavsiyelere kulak verdiğini ve uzlaşabildiğini belirtiyor.',
      ),
      average: t(
        'Duruma göre esnek',
        'Bazı konularda kolayca uzlaşabildiğini, bazılarında ise kendi bildiğinden şaşmadığını söylüyorsun.',
        'Çocuğunuz bazı konularda kolayca uzlaşabildiğini, bazılarında ise kendi bildiğinden şaşmadığını belirtiyor.',
      ),
      low: t(
        'Kendi bildiğinde ısrarcı',
        'Kendi bildiğinden kolay kolay vazgeçmediğini, eleştiriye ve itiraza sert tepki verebildiğini söylüyorsun; farklı görüşleri dinlemek bazen yeni çözümler bulmanı sağlar.',
        'Çocuğunuz kendi bildiğinden kolay kolay vazgeçmediğini, eleştiriye ve itiraza sert tepki verebildiğini belirtiyor. Farklı görüşleri dinleme konusunda ona örnek olmak faydalı olabilir.',
      ),
    },
    patience: {
      high: t(
        'Sabırlı ve sakin',
        'Kolay kolay öfkelenmediğini, öfkelendiğinde de kendini kontrol edebildiğini söylüyorsun.',
        'Çocuğunuz kolay kolay öfkelenmediğini, öfkelendiğinde de kendini kontrol edebildiğini belirtiyor.',
      ),
      average: t(
        'Çoğu zaman sabırlı',
        'Çoğu zaman sabırlı olduğunu, bazı durumlarda ise çabuk sinirlenebildiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman sabırlı olduğunu, bazı durumlarda ise çabuk sinirlenebildiğini belirtiyor.',
      ),
      low: t(
        'Çabuk sinirlenen',
        'Çabuk sinirlendiğini ve öfkeni kontrol etmekte zaman zaman zorlandığını söylüyorsun; öfkelendiğini fark ettiğin anda kısa bir ara vermek işine yarayabilir.',
        'Çocuğunuz çabuk sinirlendiğini ve öfkesini kontrol etmekte zaman zaman zorlandığını belirtiyor. Öfkelendiği anlarda sakinleşmenin yollarını onunla birlikte bulmak faydalı olabilir.',
      ),
    },

    /* ---------- Sorumluluk alt özellikleri ---------- */
    organization: {
      high: t(
        'Düzenli ve derli toplu',
        'Eşyalarını ve çevreni derli toplu tuttuğunu, düzeni sevdiğini söylüyorsun.',
        'Çocuğunuz eşyalarını ve çevresini derli toplu tuttuğunu, düzeni sevdiğini belirtiyor.',
      ),
      average: t(
        'Çoğu zaman düzenli',
        'Çoğu zaman düzenli olduğunu, bazen de ortalığın dağılmasına aldırmadığını söylüyorsun.',
        'Çocuğunuz çoğu zaman düzenli olduğunu, bazen de ortalığın dağılmasına aldırmadığını belirtiyor.',
      ),
      low: t(
        'Dağınıklığa aldırmayan',
        'Düzen konusuna pek kafa yormadığını, eşyalarını zaman zaman ortada bıraktığını söylüyorsun; sık kullandığın şeyler için sabit birer yer belirlemek aradığını bulmanı kolaylaştırır.',
        'Çocuğunuz düzen konusuna pek kafa yormadığını, eşyalarını zaman zaman ortada bıraktığını belirtiyor. Sık kullandığı eşyalar için birlikte sabit yerler belirlemek işini kolaylaştırabilir.',
      ),
    },
    diligence: {
      high: t(
        'Çalışkan ve azimli',
        'Çok çalıştığını, işlere hemen başladığını ve zorlandığında bile bırakmadığını söylüyorsun.',
        'Çocuğunuz çok çalıştığını, işlere hemen başladığını ve zorlandığında bile bırakmadığını belirtiyor.',
      ),
      average: t(
        'Gerektiğinde çalışkan',
        'Önemli bulduğun işlerde çok çalıştığını, bazı işlerde ise gerektiği kadarını yapmakla yetindiğini söylüyorsun.',
        'Çocuğunuz önemli bulduğu işlerde çok çalıştığını, bazı işlerde ise gerektiği kadarını yapmakla yetindiğini belirtiyor.',
      ),
      low: t(
        'Zorlanınca bırakabilen',
        'İşler zorlaştığında ya da ilgini kaybettiğinde bırakabildiğini söylüyorsun; büyük işleri küçük parçalara bölmek ve her parçayı bitirdiğinde bunu fark etmek devam etmeni kolaylaştırır.',
        'Çocuğunuz işler zorlaştığında ya da ilgisini kaybettiğinde bırakabildiğini belirtiyor. Büyük işleri küçük parçalara bölmek ve her adımı fark etmek devam etmesini kolaylaştırabilir.',
      ),
    },
    perfectionism: {
      high: t(
        'Ayrıntılara özen gösteren',
        'Ayrıntılara dikkat ettiğini ve yaptığın işin hatasız, kaliteli olmasını istediğini söylüyorsun; bazen “bu kadarı yeterince iyi” diyebilmek de zamanını korumana yardım eder.',
        'Çocuğunuz ayrıntılara dikkat ettiğini ve yaptığı işin hatasız, kaliteli olmasını istediğini belirtiyor. Bu özen değerlidir; aşırıya kaçtığında zaman kaybına ve gerginliğe yol açabileceğini de onunla konuşabilirsiniz.',
      ),
      average: t(
        'Önemli işlerde özenli',
        'Önemli bulduğun işlerde ayrıntılara özen gösterdiğini, bazı işlerde ise ayrıntılara takılmadığını söylüyorsun.',
        'Çocuğunuz önemli bulduğu işlerde ayrıntılara özen gösterdiğini, bazı işlerde ise ayrıntılara takılmadığını belirtiyor.',
      ),
      low: t(
        'Ayrıntılara takılmayan',
        'Ayrıntılara pek takılmadığını, işleri oluruna bırakmayı tercih ettiğini söylüyorsun; önemli işlerde son bir kez gözden geçirmek küçük hataları yakalamanı sağlar.',
        'Çocuğunuz ayrıntılara pek takılmadığını, işleri oluruna bırakmayı tercih ettiğini belirtiyor. Önemli işlerde son bir kez gözden geçirme alışkanlığı kazanması faydalı olabilir.',
      ),
    },
    prudence: {
      high: t(
        'Düşünerek hareket eden',
        'Karar vermeden ve harekete geçmeden önce düşündüğünü, plan yapıp ona bağlı kaldığını söylüyorsun.',
        'Çocuğunuz karar vermeden ve harekete geçmeden önce düşündüğünü, plan yapıp ona bağlı kaldığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman temkinli',
        'Çoğu zaman düşünerek hareket ettiğini, bazen de anlık kararlar verdiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman düşünerek hareket ettiğini, bazen de anlık kararlar verdiğini belirtiyor.',
      ),
      low: t(
        'Anlık hareket eden',
        'Çoğu zaman düşünmeden, anlık kararlarla hareket ettiğini söylüyorsun; önemli kararlarda kısa bir süre durup sonuçlarını düşünmek işine yarar.',
        'Çocuğunuz çoğu zaman düşünmeden, anlık kararlarla hareket ettiğini belirtiyor. Önemli kararlarda kısa bir süre durup sonuçları düşünmesi için onu destekleyebilirsiniz.',
      ),
    },

    /* ---------- Deneyime Açıklık alt özellikleri ---------- */
    aesthetic_appreciation: {
      high: t(
        'Sanata ve güzelliğe duyarlı',
        'Sanattan, müzikten, edebiyattan ve doğanın güzelliğinden derinden etkilendiğini söylüyorsun.',
        'Çocuğunuz sanattan, müzikten, edebiyattan ve doğanın güzelliğinden derinden etkilendiğini belirtiyor.',
      ),
      average: t(
        'Bazı sanatlara ilgili',
        'Sanatın bazı türleri ilgini çekiyor; bazıları ise sana pek hitap etmiyor.',
        'Çocuğunuz sanatın bazı türlerine ilgi duyduğunu, bazılarının ise ona pek hitap etmediğini belirtiyor.',
      ),
      low: t(
        'Sanata pek ilgi duymayan',
        'Sanatın, şiirin, konserlerin ve dans gösterilerinin sana pek hitap etmediğini söylüyorsun; ilgilerin başka alanlarda olabilir.',
        'Çocuğunuz sanatın, şiirin, konserlerin ve dans gösterilerinin ona pek hitap etmediğini belirtiyor; ilgileri başka alanlarda olabilir.',
      ),
    },
    inquisitiveness: {
      high: t(
        'Meraklı ve bilgiye aç',
        'Bilime, tarihe, farklı yerlere ve derin konulara merak duyduğunu, bir konunun derinine inmekten hoşlandığını söylüyorsun.',
        'Çocuğunuz bilime, tarihe, farklı yerlere ve derin konulara merak duyduğunu, bir konunun derinine inmekten hoşlandığını belirtiyor.',
      ),
      average: t(
        'Konuya göre meraklı',
        'İlgini çeken konularda meraklı olduğunu, her konuya ise aynı ilgiyi duymadığını söylüyorsun.',
        'Çocuğunuz ilgisini çeken konularda meraklı olduğunu, her konuya ise aynı ilgiyi duymadığını belirtiyor.',
      ),
      low: t(
        'Bilime ve tarihe pek ilgi duymayan',
        'Bilime, tarihe ve okuması zor metinlere pek ilgi duymadığını söylüyorsun; ilgilerin daha çok günlük hayatta işine yarayan konularda olabilir.',
        'Çocuğunuz bilime, tarihe ve okuması zor metinlere pek ilgi duymadığını belirtiyor; ilgileri daha çok günlük hayatta işine yarayan konularda olabilir.',
      ),
    },
    creativity: {
      high: t(
        'Yaratıcı ve fikir dolu',
        'Aklının fikirlerle dolu olduğunu, bir şeyleri yapmanın yeni yollarını bulmaktan hoşlandığını söylüyorsun.',
        'Çocuğunuz aklının fikirlerle dolu olduğunu, bir şeyleri yapmanın yeni yollarını bulmaktan hoşlandığını belirtiyor.',
      ),
      average: t(
        'Zaman zaman yaratıcı',
        'Bazen yeni fikirler bulduğunu, bazen de denenmiş yolları kullanmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazen yeni fikirler bulduğunu, bazen de denenmiş yolları kullanmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Denenmiş yolları seven',
        'Yeni fikirler üretmek yerine denenmiş ve bilinen yolları kullanmayı tercih ettiğini söylüyorsun; bu tarz, düzen ve güvenilirlik isteyen işlerde yararlı olabilir.',
        'Çocuğunuz yeni fikirler üretmek yerine denenmiş ve bilinen yolları kullanmayı tercih ettiğini belirtiyor; bu tarz, düzen ve güvenilirlik isteyen işlerde yararlı olabilir.',
      ),
    },
    unconventionality: {
      high: t(
        'Kendi yolundan giden',
        'Alışılmış kalıpların dışına çıkmaktan, farklı ve sıra dışı görülmekten çekinmediğini söylüyorsun.',
        'Çocuğunuz alışılmış kalıpların dışına çıkmaktan, farklı ve sıra dışı görülmekten çekinmediğini belirtiyor.',
      ),
      average: t(
        'Yer yer farklı',
        'Bazı konularda alışılmışın dışına çıktığını, bazılarında ise herkes gibi davranmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı konularda alışılmışın dışına çıktığını, bazılarında ise herkes gibi davranmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Alışılmış yolları seçen',
        'Alışılmış yolları ve toplumun beklentilerine uygun davranmayı tercih ettiğini, farklı ya da tuhaf görülmekten hoşlanmadığını söylüyorsun.',
        'Çocuğunuz alışılmış yolları ve toplumun beklentilerine uygun davranmayı tercih ettiğini, farklı görülmekten hoşlanmadığını belirtiyor.',
      ),
    },
  },
};
