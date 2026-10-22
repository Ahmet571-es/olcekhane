import type { BandText, ReportTemplate } from './types';

/**
 * Duygusal Zekâ Bileşenleri rapor metinleri.
 * İlkeler: puanlar bir not değildir; yüksek ya da düşük puan tek başına iyi ya da kötü anlamına gelmez. Duygulara göre
 * karar verme ve üzücü olaylardan etkilenme ölçeklerinde iki ucun da işe yarayan ve dikkat edilecek yanları vardır.
 * Etiketleme yapılmaz; sonuç öz bildirime dayandığı için öğrenciye "Genel olarak ... söylüyorsun", veliye "Çocuğunuz
 * genel olarak ... belirtiyor" dili kullanılır; ölçek ortalaması tek tek maddeler gibi anlatılmaz. Faydalar kesin
 * sonuç gibi değil, olasılık olarak söylenir. Düşük düzey metinleri suçlamadan, küçük ve uygulanabilir bir öneriyle biter.
 * Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 * Destek kutusu bu testte hiçbir düzeyde gösterilmez: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez ve tarama aracı
 * değildir.
 * Öneri listeleri (kapsamlı rapor için) bu testte henüz yazılmadı; basit raporda gösterilmez.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

export const duygusalZekaBilesenleriReport: ReportTemplate = {
  version: 'duygusal-zeka-bilesenleri-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  itemsTitle: 'Bileşenler',
  overview: {
    student:
      'Her satır bir bileşeni gösteriyor; yedi bileşen ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar bir not değildir: yüksek ya da düşük olması tek başına iyi ya da kötü anlamına gelmez. Örneğin duygulara göre karar verme ve üzücü olaylardan etkilenme bileşenlerinde iki ucun da işe yarayan ve dikkat edilecek yanları vardır. Her bileşen 8–10 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir bileşene bakarak kesin sonuç çıkarma.',
    parent:
      'Her satır bir bileşeni gösterir; yedi bileşen ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar bir not değildir: yüksek ya da düşük olması tek başına iyi ya da kötü anlamına gelmez. Örneğin duygulara göre karar verme ve üzücü olaylardan etkilenme bileşenlerinde iki ucun da işe yarayan ve dikkat edilecek yanları vardır. Her bileşen 8–10 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir bileşene bakarak kesin sonuç çıkarılmamalıdır.',
  },
  scales: {
    positive_expressivity: {
      high: t(
        'Sevincini ve sevgisini gösteren',
        'Genel olarak sevindiğinde bunu açıkça gösterdiğini ve sevdiklerine onları önemsediğini kolayca belli ettiğini söylüyorsun. Duygularını böyle paylaşmak, insanlarla yakın bağlar kurmana yardım edebilir.',
        'Çocuğunuz genel olarak sevindiğinde bunu açıkça gösterdiğini ve sevdiklerine onları önemsediğini kolayca belli ettiğini belirtiyor.',
      ),
      average: t(
        'Sevincini duruma göre gösteren',
        'Sevincini ve sevgini bazı durumlarda ve bazı insanlarla açıkça gösterdiğini, bazen de içinde yaşamayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz sevincini ve sevgisini bazı durumlarda ve bazı insanlarla açıkça gösterdiğini, bazen de içinde yaşamayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Sevincini içinde yaşayan',
        'Genel olarak sevincini ve sevgini içinde yaşadığını, bunları göstermekte zorlanabildiğini söylüyorsun. Herkes duygularını aynı açıklıkla göstermez; yine de sevdiklerine onları önemsediğini küçük sözlerle ya da davranışlarla göstermek, bunu bilmelerini sağlayabilir.',
        'Çocuğunuz genel olarak sevincini ve sevgisini içinde yaşadığını, bunları göstermekte zorlanabildiğini belirtiyor. Sevgisini kendi yoluyla, örneğin küçük davranışlarla gösterdiğinde bunu fark etmeniz ona iyi gelebilir.',
      ),
    },
    negative_expressivity: {
      high: t(
        'Olumsuz duygularını saklamayan',
        'Genel olarak üzüldüğünde, korktuğunda ya da kızdığında bunu saklamadığını, duygularının kolayca anlaşıldığını söylüyorsun. Duygularını açıkça göstermek çevrendekilerin seni anlamasını kolaylaştırabilir; çok kızgın olduğun anlarda ise konuşmadan önce biraz sakinleşmek işine yarayabilir.',
        'Çocuğunuz genel olarak üzüldüğünde, korktuğunda ya da kızdığında bunu saklamadığını, duygularının kolayca anlaşıldığını belirtiyor. Duygularını açıkça göstermesi onu anlamanızı kolaylaştırabilir; öfkeli anlarda sakinleşmenin yollarını onunla birlikte konuşabilirsiniz.',
      ),
      average: t(
        'Olumsuz duygularını duruma göre gösteren',
        'Üzüntü, korku ya da öfke gibi duygularını bazı durumlarda açıkça gösterdiğini, bazı durumlarda ise kendine sakladığını söylüyorsun.',
        'Çocuğunuz üzüntü, korku ya da öfke gibi duygularını bazı durumlarda açıkça gösterdiğini, bazı durumlarda ise kendine sakladığını belirtiyor.',
      ),
      low: t(
        'Olumsuz duygularını kendine saklayan',
        'Genel olarak üzüntü, korku ve öfke gibi duygularını, ne kadar güçlü olurlarsa olsunlar, çoğu zaman kendine sakladığını söylüyorsun. Duygularını göstermemek bazı durumlarda işe yarayabilir; ama zor bir şey yaşadığında bunu güvendiğin biriyle paylaşmak yükünü hafifletebilir.',
        'Çocuğunuz genel olarak üzüntü, korku ve öfke gibi duygularını, ne kadar güçlü olurlarsa olsunlar, çoğu zaman kendine sakladığını belirtiyor. Zor bir şey yaşadığında bunu paylaşabileceği sakin ve güvenli anlar yaratmak ona iyi gelebilir.',
      ),
    },
    attending_emotions: {
      high: t(
        'Duygularını fark eden',
        'Genel olarak ne hissettiğini fark ettiğini, duygularına dikkat ettiğini ve nedenlerini düşündüğünü söylüyorsun. Duygularını tanımak, onlarla baş etmeyi kolaylaştırabilir.',
        'Çocuğunuz genel olarak ne hissettiğini fark ettiğini, duygularına dikkat ettiğini ve nedenlerini düşündüğünü belirtiyor.',
      ),
      average: t(
        'Çoğu zaman fark eden',
        'Duygularını çoğu zaman fark ettiğini, ama her zaman üzerinde durup düşünmediğini söylüyorsun.',
        'Çocuğunuz duygularını çoğu zaman fark ettiğini, ama her zaman üzerinde durup düşünmediğini belirtiyor.',
      ),
      low: t(
        'Duygularının üzerinde pek durmayan',
        'Genel olarak ne hissettiğinin üzerinde pek durmadığını, duygularını zaman zaman görmezden geldiğini söylüyorsun. Gün içinde kısa bir an durup “Şu an ne hissediyorum?” diye sormak, duygularını tanımanı kolaylaştırabilir.',
        'Çocuğunuz genel olarak ne hissettiğinin üzerinde pek durmadığını, duygularını zaman zaman görmezden geldiğini belirtiyor. Gün içinde neler hissettiğini sakin bir şekilde konuşmak, duygularını tanımasına yardım edebilir.',
      ),
    },
    emotion_decisions: {
      high: t(
        'Kalbinin sesini dinleyen',
        'Genel olarak önemli kararlar verirken ve hayatını planlarken mantıktan çok duygularına ve içinden gelene kulak verdiğini söylüyorsun. Duygular neyin senin için önemli olduğunu gösterebilir; büyük kararlarda bunları gerçeklerle de karşılaştırmak işine yarayabilir.',
        'Çocuğunuz genel olarak önemli kararlar verirken ve hayatını planlarken mantıktan çok duygularına ve içinden gelene kulak verdiğini belirtiyor. Büyük kararlarda duygularının yanında gerçekleri de birlikte gözden geçirmek ona destek olabilir.',
      ),
      average: t(
        'Hem aklını hem kalbini dinleyen',
        'Karar verirken hem mantığına hem duygularına kulak verdiğini, duruma göre birini daha çok dinlediğini söylüyorsun.',
        'Çocuğunuz karar verirken hem mantığına hem duygularına kulak verdiğini, duruma göre birini daha çok dinlediğini belirtiyor.',
      ),
      low: t(
        'Mantığına göre karar veren',
        'Genel olarak önemli kararları duygularına göre değil, mantığına ve gerçeklere göre verdiğini söylüyorsun. Bu yaklaşım kararlarını gerekçeli vermene yardım edebilir; duygularının da sana neyin önemli olduğunu gösterebileceğini unutmamak kararlarını daha da sağlamlaştırabilir.',
        'Çocuğunuz genel olarak önemli kararları duygularına göre değil, mantığına ve gerçeklere göre verdiğini belirtiyor. Kararlarında ona neyin gerçekten önemli geldiğini ve ne hissettiğini de sormak bu yaklaşımı tamamlayabilir.',
      ),
    },
    responsive_joy: {
      high: t(
        'Başkalarının sevincine ortak olan',
        'Genel olarak çevrendeki insanların neşesinden kolayca etkilendiğini ve onların sevincini paylaştığını söylüyorsun. Başkalarının sevincine ortak olmak ilişkileri güçlendirebilir.',
        'Çocuğunuz genel olarak çevresindeki insanların neşesinden kolayca etkilendiğini ve onların sevincini paylaştığını belirtiyor.',
      ),
      average: t(
        'Duruma göre ortak olan',
        'Başkalarının sevincine çoğu zaman ortak olduğunu, bazen de onların coşkusuna kapılmadan kendi hâlinde kaldığını söylüyorsun.',
        'Çocuğunuz başkalarının sevincine çoğu zaman ortak olduğunu, bazen de onların coşkusuna kapılmadan kendi hâlinde kaldığını belirtiyor.',
      ),
      low: t(
        'Kendi hâlinde kalan',
        'Genel olarak çevrendeki insanların neşesinden ve coşkusundan pek etkilenmediğini, kendi ruh hâlinde kaldığını söylüyorsun. İnsanlar sevinci farklı biçimlerde yaşar; yine de sevdiğin birinin sevincini fark edip bunu ona söylemek aranızdaki bağı güçlendirebilir.',
        'Çocuğunuz genel olarak çevresindeki insanların neşesinden ve coşkusundan pek etkilenmediğini, kendi ruh hâlinde kaldığını belirtiyor. Bu, sevinci kendi yoluyla yaşadığını gösterebilir; sevinçli anları birlikte paylaşmak için fırsatlar yaratabilirsiniz.',
      ),
    },
    responsive_distress: {
      high: t(
        'Üzücü olaylardan derinden etkilenen',
        'Genel olarak başkalarının acısından ve üzücü olaylardan derinden etkilendiğini, gergin anlarda sakin kalmakta zorlanabildiğini söylüyorsun. Bu duyarlılık başkalarını anlamana yardım edebilir; seni yorduğu zamanlarda kendine de iyi bakmak ve duygularını güvendiğin biriyle paylaşmak önemlidir.',
        'Çocuğunuz genel olarak başkalarının acısından ve üzücü olaylardan derinden etkilendiğini, gergin anlarda sakin kalmakta zorlanabildiğini belirtiyor. Bu duyarlılık başkalarını anlamasına yardım edebilir; onu yorduğu zamanlarda duygularını sizinle paylaşabilmesi önemlidir.',
      ),
      average: t(
        'Duruma göre etkilenen',
        'Üzücü olaylardan ve başkalarının acısından etkilendiğini, ama çoğu zaman sakinliğini koruyabildiğini söylüyorsun.',
        'Çocuğunuz üzücü olaylardan ve başkalarının acısından etkilendiğini, ama çoğu zaman sakinliğini koruyabildiğini belirtiyor.',
      ),
      low: t(
        'Kolay kolay sarsılmayan',
        'Genel olarak üzücü olaylardan ve başkalarının sıkıntılarından kolay kolay sarsılmadığını, gergin anlarda da sakin kalabildiğini söylüyorsun. Bu sakinlik zor durumlarda işine yarayabilir; başkaları zor bir şey yaşarken onları dinlemek ve ne hissettiklerini sormak da önemlidir.',
        'Çocuğunuz genel olarak üzücü olaylardan ve başkalarının sıkıntılarından kolay kolay sarsılmadığını, gergin anlarda da sakin kalabildiğini belirtiyor. Bu sakinlik zor durumlarda bir güç olabilir; başkalarının duygularını dinlemenin değerini de onunla konuşabilirsiniz.',
      ),
    },
    empathic_concern: {
      high: t(
        'Başkalarını önemseyen',
        'Genel olarak başkalarının, özellikle de zor durumdaki insanların iyiliğini önemsediğini ve onlara şefkat duyduğunu söylüyorsun. Bu duyarlılık, insanlara yardım etmeyi ve onlarla güvene dayalı ilişkiler kurmayı kolaylaştırabilir.',
        'Çocuğunuz genel olarak başkalarının, özellikle de zor durumdaki insanların iyiliğini önemsediğini ve onlara şefkat duyduğunu belirtiyor.',
      ),
      average: t(
        'Çoğu zaman önemseyen',
        'Başkalarının iyiliğini çoğu zaman önemsediğini, ama her durumda onların sorunlarıyla ilgilenmediğini söylüyorsun.',
        'Çocuğunuz başkalarının iyiliğini çoğu zaman önemsediğini, ama her durumda onların sorunlarıyla ilgilenmediğini belirtiyor.',
      ),
      low: t(
        'Başkalarının sorunlarına mesafeli',
        'Genel olarak başkalarının sorunlarıyla pek ilgilenmediğini ve zor durumdaki insanlara karşı mesafeli durduğunu söylüyorsun. Zaman zaman zor durumdaki birinin yerine kendini koymaya çalışmak, insanları ve olayları daha iyi anlamana yardım edebilir.',
        'Çocuğunuz genel olarak başkalarının sorunlarıyla pek ilgilenmediğini ve zor durumdaki insanlara karşı mesafeli durduğunu belirtiyor. Yardımlaşma gerektiren ortak işler ya da gönüllü çalışmalar, başkalarının yerine kendini koyma fırsatı sunabilir.',
      ),
    },
  },
};
