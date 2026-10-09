import type { BandText, ReportTemplate } from './types';

/**
 * Çocuk Kişilik Profili (3–5. sınıf) rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı, çocuk diline göre):
 *  - Sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır;
 *    metinler boyutun cümlelerinin söylediğinin ötesine geçmez ve etiketleme yapılmaz.
 *  - Öğrenci metinleri 8–11 yaşındaki bir çocuğun okuyup anlayacağı kısa cümlelerle yazılır.
 *  - Uçlar iyi ya da kötü değildir; düşük düzey metinleri suçlamadan, küçük ve uygulanabilir bir öneriyle biter.
 *  - Merak ve hayal gücü metinleri, bu boyutun zekâyı ölçmediğini söyler (yüksek ve düşük düzeyde).
 *  - Sakinlik düşükken destek kutusu gösterilir; veli metni bunun bir tanı olmadığını ve ne zaman destek alınabileceğini
 *    söyler.
 * Öneri listeleri (kapsamlı rapor için) bu testte yazılmadı; veliye yaklaşım önerileri gelişim yol haritasındadır.
 */
const t = (summary: string, student: string, parent: string, support?: true): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(support ? { support } : {}),
});

export const cocukKisilikReport: ReportTemplate = {
  version: 'cocuk-kisilik-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır kişiliğinin bir yönünü gösteriyor. Beş yön ayrı ayrı puanlanır; toplam bir puan yoktur. Bir yönde düşük ya da yüksek çıkman iyi ya da kötü biri olduğun anlamına gelmez; her düzeyin kolaylaştırdığı ve zorlaştırdığı şeyler olabilir. Her yön altı cümleyle ölçüldüğü için sonuçlar yaklaşıktır. İnsanlar büyüdükçe değişir.',
    parent:
      'Her satır çocuğunuzun kişiliğinin bir boyutunu gösterir. Beş boyut ayrı ayrı puanlanır; toplam bir puan yoktur. Bir boyutta düşük ya da yüksek çıkması çocuğunuzun iyi ya da kötü olduğu anlamına gelmez; her düzeyin kolaylaştırdığı ve zorlaştırdığı şeyler olabilir. Her boyut altı cümleyle ölçüldüğü için sonuçlar yaklaşıktır ve kişilik çocuklukta gelişmeye devam eder; sonuç bir etiket olarak kullanılmamalıdır.',
  },
  scales: {
    extraversion: {
      high: t(
        'Konuşkan ve arkadaş canlısı',
        'Yeni tanıştığın çocuklarla konuşmayı çoğu zaman senin başlattığını, kolayca arkadaş edindiğini ve arkadaşlarınla birlikteyken ortamı neşelendirdiğini söylüyorsun. Bu, yeni bir ortama alışmanı kolaylaştırabilir. Konuşmayı sevenler için arkadaşlarını dinlemeye de zaman ayırmak, arkadaşlığı güçlendiren bir alışkanlıktır.',
        'Çocuğunuz yeni tanıştığı çocuklarla konuşmayı çoğu zaman kendisinin başlattığını, kolayca arkadaş edindiğini ve arkadaş ortamını neşelendirdiğini belirtiyor. Bu, yeni bir sınıfa ya da ortama alışmasını kolaylaştırabilir. Arkadaşlarını dinlemeye de zaman ayırmasını desteklemeniz, bu enerjisini dengelemesine yardım edebilir.',
      ),
      average: t(
        'Duruma göre konuşkan ya da sessiz',
        'Bazen arkadaşlarınla konuşmayı ve yeni arkadaşlıklar kurmayı sevdiğini, bazen de sessiz kalmayı tercih ettiğini söylüyorsun. Hem kalabalıkta hem de tek başına vakit geçirirken rahat edebilirsin.',
        'Çocuğunuz bazen arkadaşlarıyla konuşmayı ve yeni arkadaşlıklar kurmayı sevdiğini, bazen de sessiz kalmayı tercih ettiğini belirtiyor. Hem kalabalık ortamlarda hem de tek başına vakit geçirirken rahat edebilir.',
      ),
      low: t(
        'Sakin, dinlemeyi seven',
        'Kalabalıkta geride durmayı sevdiğini ve tanımadığın bir çocukla konuşmaya başlamanın sana zor geldiğini söylüyorsun. Sessiz olmak bir eksiklik değildir; iyi dinleyen ve düşünerek konuşan biri olabilirsin. Yeni bir ortamda bir çocuğa “Ne oynuyorsunuz?” diye sormak gibi küçük bir adım işini kolaylaştırabilir.',
        'Çocuğunuz kalabalıkta geride durmayı sevdiğini ve tanımadığı bir çocukla konuşmaya başlamanın kendisine zor geldiğini belirtiyor. Bu bir eksiklik değildir; sessiz çocuklar iyi dinleyici olabilir. Onu konuşmaya zorlamak yerine yeni ortamlara önceden hazırlamanız ve bir iki arkadaşla birlikte olabileceği fırsatlar sunmanız işini kolaylaştırabilir.',
      ),
    },
    agreeableness: {
      high: t(
        'Başkalarını önemseyen ve iyi geçinen',
        'Bir arkadaşın üzüldüğünde senin de üzüldüğünü, başkalarına yardım etmeyi sevdiğini ve neredeyse herkesle iyi geçindiğini söylüyorsun. Başkalarının ne hissettiğini önemsemek, iyi arkadaşlıklar kurmana yardım edebilir. Bazen “hayır” demek ya da ne istediğini söylemek de iyi geçinmenin bir parçasıdır.',
        'Çocuğunuz bir arkadaşı üzüldüğünde onun da üzüldüğünü, başkalarına yardım etmeyi sevdiğini ve neredeyse herkesle iyi geçindiğini belirtiyor. Başkalarının duygularını önemsemesi iyi arkadaşlıklar kurmasına yardım edebilir. Gerektiğinde “hayır” diyebilmesini ve kendi isteğini söyleyebilmesini desteklemeniz de önemlidir.',
      ),
      average: t(
        'Duruma göre başkalarını önemseyen',
        'Başkalarının duygularını önemsediğin ve yardım ettiğin zamanlar olduğunu, ama bunun duruma göre değiştiğini söylüyorsun. Bu, çoğu insan için olağandır.',
        'Çocuğunuz başkalarının duygularını önemsediği ve yardım ettiği zamanlar olduğunu, ama bunun duruma göre değiştiğini belirtiyor. Bu durum bu yaşta olağandır.',
      ),
      low: t(
        'Başkalarının duygularına daha az odaklanan',
        'Başkalarının dertlerini dinlemenin sana sıkıcı geldiğini ya da başkalarının ne hissettiğine pek dikkat etmediğini söylüyorsun. Başkalarının duygularını fark etmek zamanla öğrenilir. Bir arkadaşın üzgün görünüyorsa ona “Ne oldu?” diye sormak iyi bir başlangıç olabilir.',
        'Çocuğunuz başkalarının dertlerini dinlemenin kendisine sıkıcı geldiğini ya da başkalarının ne hissettiğine pek dikkat etmediğini belirtiyor. Başkalarının duygularını fark etmek zamanla öğrenilir. Günlük olaylarda onunla başkalarının ne hissedebileceğini konuşmanız, bu beceriyi desteklemenin kolay bir yoludur.',
      ),
    },
    conscientiousness: {
      high: t(
        'Düzenli ve işini özenle yapan',
        'Odanı ve eşyalarını toplu tutmayı sevdiğini, sana verilen işleri hemen ve özenle yaptığını söylüyorsun. Bu düzen, ödevlerini ve işlerini zamanında bitirmeni kolaylaştırabilir. Arada bir işler plana uymazsa kendine kızmadan devam edebilirsin.',
        'Çocuğunuz odasını ve eşyalarını toplu tutmayı sevdiğini, kendisine verilen işleri hemen ve özenle yaptığını belirtiyor. Bu düzen, ödevlerini ve işlerini zamanında bitirmesini kolaylaştırabilir. Her şeyin kusursuz olması gerekmediğini, hata yapmanın da öğrenmenin parçası olduğunu hatırlatmanız iyi gelebilir.',
      ),
      average: t(
        'Duruma göre düzenli',
        'Bazı işlerini hemen ve düzenli yaptığını, bazılarını ise sonraya bıraktığını söylüyorsun. Sevdiğin ya da önemli bulduğun işlerde daha düzenli olabilirsin.',
        'Çocuğunuz bazı işlerini hemen ve düzenli yaptığını, bazılarını ise sonraya bıraktığını belirtiyor. Sevdiği ya da önemli bulduğu işlerde daha düzenli olabilir.',
      ),
      low: t(
        'Düzene pek takılmayan',
        'Odanı ve eşyalarını dağınık bıraktığını, yapman gereken işleri bazen sonraya bıraktığını ya da yarım yamalak yaptığını söylüyorsun. Düzenli olmak, küçük adımlarla geliştirilebilen bir alışkanlıktır. Her akşam yatmadan önce çantanı hazırlamak gibi tek bir küçük işle başlayabilirsin.',
        'Çocuğunuz odasını ve eşyalarını dağınık bıraktığını, yapması gereken işleri bazen sonraya bıraktığını ya da yarım yamalak yaptığını belirtiyor. Düzen, küçük ve her gün tekrarlanan adımlarla geliştirilebilen bir alışkanlıktır. Her akşam çantasını hazırlamak gibi tek bir küçük işle başlamasına destek olabilirsiniz.',
      ),
    },
    emotional_stability: {
      high: t(
        'Genellikle sakin',
        'Çoğu zaman kendini sakin ve huzurlu hissettiğini, pek az kızdığını ve üzgün hissettiğin zamanların az olduğunu söylüyorsun. Sakin kalabilmek, zor bir durumda ne yapacağını düşünmene yardım edebilir. Yine de üzüldüğün ya da kızdığın zamanlarda bunu güvendiğin biriyle paylaşabilirsin.',
        'Çocuğunuz çoğu zaman kendini sakin ve huzurlu hissettiğini, pek az kızdığını ve üzgün hissettiği zamanların az olduğunu belirtiyor. Sakin kalabilmek zor durumlarda ona yardım edebilir. Yine de üzüldüğü ya da kızdığı zamanlarda duygularını sizinle paylaşabileceğini bilmesi önemlidir.',
      ),
      average: t(
        'Duruma göre sakin',
        'Bazı zamanlar sakin olduğunu, bazı durumlarda ise endişelendiğini, kızdığını ya da üzüldüğünü söylüyorsun. Bu herkes için olağandır. Seni en çok neyin üzdüğünü ya da kızdırdığını fark etmek, o anlarda ne yapacağını önceden düşünmeni sağlar.',
        'Çocuğunuz bazı zamanlar sakin olduğunu, bazı durumlarda ise endişelendiğini, kızdığını ya da üzüldüğünü belirtiyor. Bu herkes için olağandır. Onu en çok neyin zorladığını yargılamadan dinlemeniz, o anlarda ne yapabileceğini birlikte düşünmenizi kolaylaştırır.',
      ),
      low: t(
        'Duygularını yoğun yaşayan',
        'Birçok şey için endişelendiğini, çabuk kızdığını ya da çabuk üzüldüğünü söylüyorsun. Bu duyguları herkes zaman zaman yaşar; onlarla tek başına baş etmek zorunda değilsin. Nasıl hissettiğini ailene, öğretmenine ya da güvendiğin bir yetişkine anlatmak iyi gelebilir.',
        'Çocuğunuz birçok şey için endişelendiğini, çabuk kızdığını ya da çabuk üzüldüğünü belirtiyor. Bu sonuç bir tanı değildir; ancak bu duyguların ne zamandır sürdüğünü ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir. Bu duygular uzun süredir sürüyor ya da okulunu, uykusunu ya da arkadaşlıklarını etkiliyorsa okulun rehber öğretmeninden destek alabilirsiniz.',
        true,
      ),
    },
    intellect: {
      high: t(
        'Meraklı, hayal gücü güçlü',
        'Hayal gücünün güçlü olduğunu, aklına sık sık yeni fikirler geldiğini ve bir şeyi yapmanın yeni yollarını bulmayı sevdiğini söylüyorsun. Bu yön ne kadar zeki olduğunu ölçmez; merakını ve hayal kurmayı ne kadar sevdiğini gösterir. Aklına gelen fikirleri bir deftere yazmak, en sevdiklerini sonra denemene yardım eder.',
        'Çocuğunuz hayal gücünün güçlü olduğunu, aklına sık sık yeni fikirler geldiğini ve bir şeyi yapmanın yeni yollarını bulmayı sevdiğini belirtiyor. Bu boyut zekâyı ölçmez; merakını ve hayal kurmayı ne kadar sevdiğini gösterir. Sorularını ciddiye almanız ve cevapları birlikte aramanız bu merakı besleyebilir.',
      ),
      average: t(
        'Duruma göre meraklı',
        'Hayal kurmanın, yeni fikirler bulmanın ve bir konuyu araştırmanın sana bazen kolay ve keyifli, bazen de zor ya da sıkıcı geldiğini söylüyorsun. İlgini çeken konularda daha çok soru sorup araştırıyor olabilirsin.',
        'Çocuğunuz hayal kurmanın, yeni fikirler bulmanın ve bir konuyu araştırmanın kendisine bazen kolay ve keyifli, bazen de zor ya da sıkıcı geldiğini belirtiyor. İlgisini çeken konularda daha çok soru sorup araştırıyor olabilir.',
      ),
      low: t(
        'Somut ve bildiğini seven',
        'Hayal kurmanın sana zor geldiğini, bir konuyu ayrıntısıyla araştırmayı pek sevmediğini ve bilmediğin konulardaki kitaplardan uzak durduğunu söylüyorsun. Bu yön ne kadar zeki olduğunu ölçmez; bazı insanlar hayallerden çok somut ve elle tutulur işlerden hoşlanır. Sevdiğin bir konuda kısa ve kolay bir kitapla başlamak merakını besleyebilir.',
        'Çocuğunuz hayal kurmanın kendisine zor geldiğini, bir konuyu ayrıntısıyla araştırmayı pek sevmediğini ve bilmediği konulardaki kitaplardan uzak durduğunu belirtiyor. Bu boyut zekâyı ölçmez; bazı çocuklar hayallerden çok somut ve elle tutulur işlerden hoşlanır. Onun ilgi duyduğu bir konuda kısa ve kolay kitaplar ya da birlikte yapılan küçük deneyler merakını besleyebilir.',
      ),
    },
  },
};
