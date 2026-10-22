import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Kişiliğin 10 Yönü rapor metinleri.
 * İlkeler (Beş Faktör ve Ayrıntılı Kişilik Profili ile aynı): kişilik boyutlarında ve yönlerinde "iyi" ya da "kötü" uç
 * yoktur; her tarzın güçlü yanı anlatılır. Etiketleme yapılmaz; sonuç öz bildirime dayandığı için öğrenciye
 * "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır. Nezaket ve şefkat gibi değer yüklü yönlerde düşük
 * düzey suçlamadan, gelişime açık bir dille anlatılır.
 * Her metin yalnızca kendi yönünün maddelerinin sorduğu davranışları anlatır (aynı sayfadaki öteki yönlerle çelişmesin
 * diye): ör. Çalışkanlık işe koyulmayı, bitirmeyi ve dikkati; Düzenlilik düzeni, programı ve ayrıntıyı anlatır.
 * Düşünsel merak zekâyı ölçmez; her düzeyde bu söylenir.
 * Destek kutusu: Duygusal Denge boyutu ya da İç rahatlık yönü (kaynakta Withdrawal: endişe, kuşku, hüzün) düşükse.
 * Yetişkin raporu öğrenci metinlerini kullanır; öğrenci metni okula ya da ergenliğe özgü olduğunda yetişkin metni
 * (`adult`) ayrıca yazılmıştır.
 *
 * Birlikte yorum (`insight`): bir boyutun iki yönünden biri yüksek, öteki düşükse (düzey grupları; yüksek ve çok yüksek →
 * yüksek, düşük ve çok düşük → düşük) bunun ne anlama gelebileceği anlatılır; hiçbir boyutta böyle bir ayrışma yoksa
 * kapanış cümlesi. Ayrışmaların anlamı DeYoung ve ark. (2007), DeYoung ve ark. (2013) ve DeYoung (2015) çalışmalarındaki
 * yön tanımlarına dayanır: coşku insanlarla yakınlık ve keyif, atılganlık öne çıkma ve etkileme; şefkat başkalarına duygusal
 * yakınlık, nezaket kırıcı ya da kural dışı dürtüleri frenleme; Volatility (Soğukkanlılık'ın tersi) olumsuz duyguların dışa
 * taşması, Withdrawal (İç rahatlık'ın tersi) içe dönük olumsuz duygular. Bunlar kuram ve yön tanımları olduğu için metinlerde
 * "Kişilik araştırmacılarına göre" denir. Kurallar yalnızca bir yön yüksek, öteki düşükken uyar: iki yönün farkı, yönlerin her
 * birinden daha az kesindir.
 *
 * Ayrışma (`facetSplit`): bir boyutun iki yönü ayrıştığında boyut kartında düzey metni yerine "İki yönü ayrışan" metni
 * gösterilir (düzey metni iki yönün davranışlarını birlikte anlattığı için yönlerden birinin kartıyla çelişirdi).
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

/** Bir boyutun iki yönünden biri yüksek, öteki düşükse. */
const split = (high: string, low: string, student: string, parent: string, adult?: string): InsightRule => ({
  when: { [high]: ['high'], [low]: ['low'] },
  text: { student, parent, ...(adult ? { adult } : {}) },
});

/**
 * Bir boyutun iki yönü ayrıştığında boyut kartında, boyutun düzey metni yerine (düzey metni iki yönün davranışlarını
 * birlikte anlattığı için yönlerden birinin kartıyla çelişirdi).
 */
const splitText = (pair: string) => ({
  summary: 'İki yönü ayrışan',
  student: `Bu boyutun iki yönü sende birbirinden ayrılıyor: ${pair} biri yüksek, öteki düşük. Bu yüzden boyut puanın seni tek başına iyi anlatmıyor; iki yönü aşağıda ayrı ayrı görebilirsin.`,
  parent: `Bu boyutun iki yönü çocuğunuzda birbirinden ayrılıyor: ${pair} biri yüksek, öteki düşük. Bu yüzden boyut puanı onu tek başına iyi anlatmıyor; iki yön aşağıda ayrı ayrı görülüyor.`,
});

export const kisiligin10YonuReport: ReportTemplate = {
  version: 'kisiligin-10-yonu-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  insight: {
    title: { you: 'Bir boyutun iki yönü', parent: 'Bir boyutun iki yönü' },
    pageNote: 'Bir boyutun iki yönü birbirinden ayrıldığında (biri yüksek, öteki düşük) bunun ne anlama gelebileceğini anlatan bölüm',
    lead: [
      {
        when: {},
        text: {
          student:
            'Bu testte beş boyutun her biri iki yöne ayrılır. Bir boyutun iki yönü birbiriyle ilişkilidir ama aynı şey değildir; biri yüksek, öteki düşük çıkabilir. O zaman boyut puanı tek başına seni iyi anlatmayabilir; iki yöne ayrı ayrı bakmak daha çok şey söyler.',
          parent:
            'Bu testte beş boyutun her biri iki yöne ayrılır. Bir boyutun iki yönü birbiriyle ilişkilidir ama aynı şey değildir; biri yüksek, öteki düşük çıkabilir. O zaman boyut puanı tek başına çocuğunuzu iyi anlatmayabilir; iki yöne ayrı ayrı bakmak daha çok şey söyler.',
        },
      },
    ],
    rules: [
      split(
        'enthusiasm',
        'assertiveness',
        'Coşku yönün yüksek, atılganlık yönün düşük. İnsanlara kolayca ısınıyor ve sevincini gösteriyorsun; ama bir grupta öne çıkıp yönlendirmek yerine geri planda kalıyorsun. Kişilik araştırmacılarına göre bu iki yön farklıdır: coşku insanlarla yakınlık ve keyifle, atılganlık ise öne çıkma ve başkalarını etkilemeyle ilgilidir.',
        'Çocuğunuzun coşku yönü yüksek, atılganlık yönü düşük. İnsanlara kolayca ısındığını ve sevincini gösterdiğini belirtiyor; ama bir grupta öne çıkıp yönlendirmek yerine geri planda kalıyor. Kişilik araştırmacılarına göre bu iki yön farklıdır: coşku insanlarla yakınlık ve keyifle, atılganlık ise öne çıkma ve başkalarını etkilemeyle ilgilidir.',
      ),
      split(
        'assertiveness',
        'enthusiasm',
        'Atılganlık yönün yüksek, coşku yönün düşük. Bir grupta idareyi ele alıp fikrini söylüyorsun; ama insanlara yavaş ısınıyor ve sevincini pek dışa vurmuyorsun. Yani öne çıkman, herkesle hemen yakınlaştığın anlamına gelmiyor; bu ikisi ayrı yönlerdir.',
        'Çocuğunuzun atılganlık yönü yüksek, coşku yönü düşük. Bir grupta idareyi ele alıp fikrini söylediğini belirtiyor; ama insanlara yavaş ısınıyor ve sevincini pek dışa vurmuyor. Yani öne çıkması, herkesle hemen yakınlaştığı anlamına gelmiyor; bu ikisi ayrı yönlerdir.',
      ),
      split(
        'compassion',
        'politeness',
        'Şefkat yönün yüksek, nezaket yönün düşük. Başkalarının duygularını önemsiyorsun; ama isteklerini savunurken çatışmadan çekinmiyor ve zaman zaman kırıcı olabiliyorsun. Kişilik araştırmacılarına göre şefkat başkalarına duygusal yakınlıkla, nezaket ise kırıcı söz ve davranışları frenleyebilmekle ilgilidir. Anlaşmazlık anlarında da kırmadan konuşursan, insanları ne kadar önemsediğin daha kolay anlaşılabilir.',
        'Çocuğunuzun şefkat yönü yüksek, nezaket yönü düşük. Başkalarının duygularını önemsediğini belirtiyor; ama isteklerini savunurken çatışmadan çekinmiyor ve zaman zaman kırıcı olabiliyor. Kişilik araştırmacılarına göre şefkat başkalarına duygusal yakınlıkla, nezaket ise kırıcı söz ve davranışları frenleyebilmekle ilgilidir.',
      ),
      split(
        'politeness',
        'compassion',
        'Nezaket yönün yüksek, şefkat yönün düşük. İnsanlara saygıyla davranıyor, onları kırmaktan ve çatışmadan kaçınıyorsun; ama başkalarının duygularına ve sorunlarına pek zaman ayırmıyorsun. Yani saygılı ve kibar olman, herkesle duygusal olarak yakın olduğun anlamına gelmiyor; bu ikisi ayrı yönlerdir.',
        'Çocuğunuzun nezaket yönü yüksek, şefkat yönü düşük. İnsanlara saygıyla davrandığını, onları kırmaktan ve çatışmadan kaçındığını belirtiyor; ama başkalarının duygularına ve sorunlarına pek zaman ayırmıyor. Yani saygılı ve kibar olması, herkesle duygusal olarak yakın olduğu anlamına gelmiyor.',
      ),
      split(
        'industriousness',
        'orderliness',
        'Çalışkanlık yönün yüksek, düzenlilik yönün düşük. İşe koyulup başladığını bitiriyorsun; ama düzen ve sıkı bir program sana pek gerekli gelmiyor. Yani işini bitirmek için her şeyin yerli yerinde olmasına ihtiyaç duymuyorsun. Kişilik araştırmacılarına göre çalışkanlık, anlık keyif yerine ileriki hedefler için çalışmayı seçmekle; düzenlilik ise kurallara ve düzene uymakla ilgilidir.',
        'Çocuğunuzun çalışkanlık yönü yüksek, düzenlilik yönü düşük. İşe koyulup başladığını bitirdiğini belirtiyor; ama düzen ve sıkı bir program ona pek gerekli gelmiyor. Yani işini bitirmek için her şeyin yerli yerinde olmasına ihtiyaç duymuyor; dağınıklığı tek başına bir sorun işareti saymamak gerekir.',
      ),
      split(
        'orderliness',
        'industriousness',
        'Düzenlilik yönün yüksek, çalışkanlık yönün düşük. Düzeni, programı ve ayrıntıları önemsiyorsun; ama işe koyulmakta ve dikkatini elindeki işte tutmakta zorlanabiliyorsun. Düzenli bir ortam kurmak ile işe başlayıp bitirmek ayrı becerilerdir. Planın hazırsa ondan sonraki ilk adımı ertelememek bu ikisini birleştirebilir.',
        'Çocuğunuzun düzenlilik yönü yüksek, çalışkanlık yönü düşük. Düzeni, programı ve ayrıntıları önemsediğini belirtiyor; ama işe koyulmakta ve dikkatini elindeki işte tutmakta zorlanabiliyor. Düzenli görünmesi, işlerini bitirmekte zorlanmadığı anlamına gelmeyebilir; yalnızca düzene değil, işin bitip bitmediğine de birlikte bakabilirsiniz.',
      ),
      split(
        'composure',
        'security',
        'Soğukkanlılık yönün yüksek, iç rahatlık yönün düşük. Kolay kolay öfkelenmiyor ve duygularını kontrol altında tutuyorsun; ama içinde sık sık endişe ve kuşku taşıyabiliyorsun. Dışarıdan sakin görünmen, içinin her zaman rahat olduğu anlamına gelmiyor; zorlandığında bunu çevrendekilere söylemen önemli.',
        'Çocuğunuzun soğukkanlılık yönü yüksek, iç rahatlık yönü düşük. Kolay kolay öfkelenmediğini ve duygularını kontrol altında tuttuğunu belirtiyor; ama içinde sık sık endişe ve kuşku taşıyabiliyor. Dışarıdan sakin görünmesi, içinin her zaman rahat olduğu anlamına gelmeyebilir; zorlandığı anları fark etmeye çalışın.',
      ),
      split(
        'security',
        'composure',
        'İç rahatlık yönün yüksek, soğukkanlılık yönün düşük. Kendinle barışıksın ve kolay kolay endişelenmiyorsun; ama çabuk öfkelenebiliyor ya da ruh hâlin hızla değişebiliyor. Kişilik araştırmacılarına göre bu iki yön farklıdır: soğukkanlılık öfke gibi duyguların ne kadar kolay dışa taştığıyla, iç rahatlık ise endişe ve kuşkunun ne kadar sık yaşandığıyla ilgilidir.',
        'Çocuğunuzun iç rahatlık yönü yüksek, soğukkanlılık yönü düşük. Kendisiyle barışık olduğunu ve kolay kolay endişelenmediğini belirtiyor; ama çabuk öfkelenebiliyor ya da ruh hâli hızla değişebiliyor. Kişilik araştırmacılarına göre bu iki yön farklıdır: soğukkanlılık öfke gibi duyguların ne kadar kolay dışa taştığıyla, iç rahatlık ise endişe ve kuşkunun ne kadar sık yaşandığıyla ilgilidir.',
      ),
      split(
        'intellect',
        'aesthetics',
        'Düşünsel merak yönün yüksek, sanat ve hayal gücü yönün düşük. Fikirlerle ve karmaşık sorunlarla uğraşmaktan hoşlanıyorsun; ama sanat, şiir ve hayal kurmak seni o kadar çekmiyor. İlgin daha çok fikirlerin ve sorunların dünyasında.',
        'Çocuğunuzun düşünsel merak yönü yüksek, sanat ve hayal gücü yönü düşük. Fikirlerle ve karmaşık sorunlarla uğraşmaktan hoşlandığını belirtiyor; ama sanat, şiir ve hayal kurmak onu o kadar çekmiyor. İlgisi daha çok fikirlerin ve sorunların dünyasında.',
      ),
      split(
        'aesthetics',
        'intellect',
        'Sanat ve hayal gücü yönün yüksek, düşünsel merak yönün düşük. Güzelliğe, müziğe ve hayal kurmaya açıksın; ama soyut tartışmalar ve okuması zor metinler seni o kadar çekmiyor. İlgin daha çok güzelliğin ve hayal gücünün dünyasında.',
        'Çocuğunuzun sanat ve hayal gücü yönü yüksek, düşünsel merak yönü düşük. Güzelliğe, müziğe ve hayal kurmaya açık olduğunu belirtiyor; ama soyut tartışmalar ve okuması zor metinler onu o kadar çekmiyor. İlgisi daha çok güzelliğin ve hayal gücünün dünyasında.',
      ),
    ],
    fallback: {
      student:
        'Senin sonucunda hiçbir boyutta bir yön yüksek, öteki düşük çıkmadı. Yine de bir boyutun iki yönü arasında daha küçük farklar olabilir; her yönün ayrıntısını aşağıda görebilirsin.',
      parent:
        'Çocuğunuzun sonucunda hiçbir boyutta bir yön yüksek, öteki düşük çıkmadı. Yine de bir boyutun iki yönü arasında daha küçük farklar olabilir; her yönün ayrıntısı aşağıda görülüyor.',
    },
  },
  facetSplit: {
    extraversion: splitText('coşku ve atılganlıktan'),
    agreeableness: splitText('şefkat ve nezaketten'),
    conscientiousness: splitText('çalışkanlık ve düzenlilikten'),
    emotional_stability: splitText('soğukkanlılık ve iç rahatlıktan'),
    openness: splitText('düşünsel merak ile sanat ve hayal gücünden'),
  },
  scales: {
    /* ---------- Boyutlar ----------
     * Boyut puanı iki yönün ortalamasıdır: yüksek bir boyutta yönlerden biri orta olabilir. Bu yüzden boyut metinleri iki
     * yönün davranışlarını tek tek saymaz, genel eğilimi anlatır ve hangi yönün belirgin olduğunu yön kartlarına bırakır
     * (yön kartlarıyla çelişmesin). İki yön ayrışınca (biri yüksek, öteki düşük) bu metinler yerine `facetSplit` gösterilir.
     */
    extraversion: {
      high: t(
        'Dışa dönük',
        'Cevaplarına göre bu boyutta genel eğilimin, insanlarla ilişkilerde canlı ve dışa dönük olmak yönünde: coşku ve atılganlık yönlerinin ortalaması yüksek. İki yönü aşağıda ayrı ayrı görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, insanlarla ilişkilerde canlı ve dışa dönük olmak yönünde: coşku ve atılganlık yönlerinin ortalaması yüksek. İki yön aşağıda ayrı ayrı görülüyor.',
      ),
      average: t(
        'İki uç arasında',
        'Cevaplarına göre bu boyutta iki uçtan birine yakın değilsin: coşku ve atılganlık yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bunu aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta iki uçtan birine yakın değil: coşku ve atılganlık yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bu aşağıda görülüyor.',
      ),
      low: t(
        'Sakin ve ölçülü',
        'Cevaplarına göre bu boyutta genel eğilimin, insanlarla ilişkilerde sakin ve ölçülü olmak yönünde: coşku ve atılganlık yönlerinin ortalaması düşük. Bu bir eksiklik değil; herkesin insanlarla ilişki kurma hızı ve biçimi farklıdır. Bunun daha çok hangi yönden geldiğini aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, insanlarla ilişkilerde sakin ve ölçülü olmak yönünde: coşku ve atılganlık yönlerinin ortalaması düşük. Bu bir eksiklik değildir; herkesin insanlarla ilişki kurma hızı ve biçimi farklıdır. Bunun daha çok hangi yönden geldiği aşağıda görülüyor.',
      ),
    },
    agreeableness: {
      high: t(
        'Uyumlu',
        'Cevaplarına göre bu boyutta genel eğilimin, başkalarını önemsemek ve onlarla iyi geçinmek yönünde: şefkat ve nezaket yönlerinin ortalaması yüksek. İki yönü aşağıda ayrı ayrı görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, başkalarını önemsemek ve onlarla iyi geçinmek yönünde: şefkat ve nezaket yönlerinin ortalaması yüksek. İki yön aşağıda ayrı ayrı görülüyor.',
      ),
      average: t(
        'İki uç arasında',
        'Cevaplarına göre bu boyutta iki uçtan birine yakın değilsin: şefkat ve nezaket yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bunu aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta iki uçtan birine yakın değil: şefkat ve nezaket yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bu aşağıda görülüyor.',
      ),
      low: t(
        'Kendi isteklerini öne alan',
        'Cevaplarına göre bu boyutta genel eğilimin, ilişkilerde önce kendi isteklerini gözetmek yönünde: şefkat ve nezaket yönlerinin ortalaması düşük. Bunun daha çok hangi yönden geldiğini aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, ilişkilerde önce kendi isteklerini gözetmek yönünde: şefkat ve nezaket yönlerinin ortalaması düşük. Bunun daha çok hangi yönden geldiği aşağıda görülüyor.',
      ),
    },
    conscientiousness: {
      high: t(
        'Planlı ve kararlı',
        'Cevaplarına göre bu boyutta genel eğilimin, işlerini sorumlulukla ve planlı yürütmek yönünde: çalışkanlık ve düzenlilik yönlerinin ortalaması yüksek. İki yönü aşağıda ayrı ayrı görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, işlerini sorumlulukla ve planlı yürütmek yönünde: çalışkanlık ve düzenlilik yönlerinin ortalaması yüksek. İki yön aşağıda ayrı ayrı görülüyor.',
      ),
      average: t(
        'İki uç arasında',
        'Cevaplarına göre bu boyutta iki uçtan birine yakın değilsin: çalışkanlık ve düzenlilik yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bunu aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta iki uçtan birine yakın değil: çalışkanlık ve düzenlilik yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bu aşağıda görülüyor.',
      ),
      low: t(
        'Esnek, kendi temposunda',
        'Cevaplarına göre işe koyulmak ya da işleri bir plana göre yürütmek (belki ikisi birden) sana pek kolay gelmiyor: çalışkanlık ve düzenlilik yönlerinin ortalaması düşük. Hangisinin daha belirgin olduğunu aşağıda görebilirsin. Önemli işlerde küçük hedefler ve hatırlatıcılar işini kolaylaştırabilir.',
        'Çocuğunuzun cevaplarına göre işe koyulmak ya da işleri bir plana göre yürütmek (belki ikisi birden) ona pek kolay gelmiyor: çalışkanlık ve düzenlilik yönlerinin ortalaması düşük. Hangisinin daha belirgin olduğu aşağıda görülüyor. Önemli işlerde birlikte küçük hedefler koymak ona destek olabilir.',
      ),
    },
    emotional_stability: {
      high: t(
        'Sakin, kolay sarsılmayan',
        'Cevaplarına göre bu boyutta genel eğilimin, zor anlarda dengeli kalmak yönünde: soğukkanlılık ve iç rahatlık yönlerinin ortalaması yüksek. İki yönü aşağıda ayrı ayrı görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, zor anlarda dengeli kalmak yönünde: soğukkanlılık ve iç rahatlık yönlerinin ortalaması yüksek. İki yön aşağıda ayrı ayrı görülüyor.',
      ),
      average: t(
        'İki uç arasında',
        'Cevaplarına göre bu boyutta iki uçtan birine yakın değilsin: soğukkanlılık ve iç rahatlık yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; hangi duyguların seni daha çok zorladığını aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta iki uçtan birine yakın değil: soğukkanlılık ve iç rahatlık yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; hangi duyguların onu daha çok zorladığı aşağıda görülüyor.',
      ),
      low: t(
        'Stresten kolay etkilenen',
        'Öfke, endişe ya da kuşku gibi duyguları sık yaşadığını ve stresli durumlardan kolayca etkilendiğini söylüyorsun: soğukkanlılık ve iç rahatlık yönlerinin ortalaması düşük. Bu duygularla baş etmeyi öğrenmek mümkün; hangisinin seni daha çok zorladığını aşağıdaki iki yönde görebilirsin.',
        'Çocuğunuz öfke, endişe ya da kuşku gibi duyguları sık yaşadığını ve stresli durumlardan kolayca etkilendiğini belirtiyor; soğukkanlılık ve iç rahatlık yönlerinin ortalaması düşük. Bu sonuç bir tanı değildir; ancak bu duyguların ne kadar süredir devam ettiğini ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir.',
        { support: true },
      ),
    },
    openness: {
      high: t(
        'Fikirlere ve güzelliğe açık',
        'Cevaplarına göre bu boyutta genel eğilimin, fikirlere, sanata ve hayal gücüne açık olmak yönünde: düşünsel merak ile sanat ve hayal gücü yönlerinin ortalaması yüksek. İki yönü aşağıda ayrı ayrı görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta genel eğilimi, fikirlere, sanata ve hayal gücüne açık olmak yönünde: düşünsel merak ile sanat ve hayal gücü yönlerinin ortalaması yüksek. İki yön aşağıda ayrı ayrı görülüyor.',
      ),
      average: t(
        'İki uç arasında',
        'Cevaplarına göre bu boyutta iki uçtan birine yakın değilsin: düşünsel merak ile sanat ve hayal gücü yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bunu aşağıda görebilirsin.',
        'Çocuğunuzun cevaplarına göre bu boyutta iki uçtan birine yakın değil: düşünsel merak ile sanat ve hayal gücü yönlerinin ortalaması orta düzeyde. İki yönün ikisi de orta olabilir ya da biri ötekinden daha belirgin olabilir; bu aşağıda görülüyor.',
      ),
      low: t(
        'İlgisi başka alanlarda',
        'Cevaplarına göre soyut fikirlerle uğraşmak ya da sanat ve hayal kurmak genel olarak seni pek çekmiyor: düşünsel merak ile sanat ve hayal gücü yönlerinin ortalaması düşük. Hangisinin daha belirgin olduğunu aşağıda görebilirsin. Herkesin merakı farklı yerlerde yoğunlaşır; ilgini başka alanlara yöneltmek de bir tercihtir.',
        'Çocuğunuzun cevaplarına göre soyut fikirlerle uğraşmak ya da sanat ve hayal kurmak genel olarak onu pek çekmiyor: düşünsel merak ile sanat ve hayal gücü yönlerinin ortalaması düşük. Herkesin merakı farklı yerlerde yoğunlaşır; onun neyle uğraşmaktan keyif aldığını fark etmek, ilgisini desteklemenin iyi bir yoludur.',
      ),
    },

    /* ---------- Dışadönüklük yönleri ---------- */
    enthusiasm: {
      high: t(
        'Sıcak ve neşeli',
        'İnsanlara çabuk ısındığını, kolayca arkadaş edindiğini ve sevincini dışa vurduğunu söylüyorsun. Çok güldüğünü ve eğlendiğini de anlatıyorsun; bu sıcaklık çevrendekilere de iyi gelebilir.',
        'Çocuğunuz insanlara çabuk ısındığını, kolayca arkadaş edindiğini ve sevincini dışa vurduğunu belirtiyor; çok güldüğünü ve eğlendiğini anlatıyor.',
      ),
      average: t(
        'Duruma göre coşkulu',
        'Bazı ortamlarda ve bazı insanlarla hemen ısındığını, bazılarında ise açılmak için zamana ihtiyaç duyduğunu söylüyorsun.',
        'Çocuğunuz bazı ortamlarda ve bazı insanlarla hemen ısındığını, bazılarında ise açılmak için zamana ihtiyaç duyduğunu belirtiyor.',
      ),
      low: t(
        'Zamanla açılan',
        'İnsanlara yavaş ısındığını, kendinle ilgili pek az şey anlattığını ve sevincini dışa pek vurmadığını söylüyorsun. Seni tanımak zaman alabilir; bu, ilişkilerinin daha az değerli olduğu anlamına gelmez.',
        'Çocuğunuz insanlara yavaş ısındığını, kendisiyle ilgili pek az şey anlattığını ve sevincini dışa pek vurmadığını belirtiyor; onu tanımak zaman alabilir.',
      ),
    },
    assertiveness: {
      high: t(
        'Öne çıkan ve yönlendiren',
        'İdareyi ele aldığını, başkalarını bir şeyler yapmaya ikna edebildiğini ve harekete ilk geçenlerden olduğunu söylüyorsun. Bu güç, başkalarını dinlemekle birleştiğinde daha da etkili olabilir.',
        'Çocuğunuz idareyi ele aldığını, başkalarını bir şeyler yapmaya ikna edebildiğini ve harekete ilk geçenlerden olduğunu belirtiyor.',
      ),
      average: t(
        'Gerektiğinde öne çıkan',
        'Gerektiğinde öne çıkıp fikrini söyleyebildiğini, bazen de yönlendirmeyi başkalarına bıraktığını söylüyorsun.',
        'Çocuğunuz gerektiğinde öne çıkıp fikrini söyleyebildiğini, bazen de yönlendirmeyi başkalarına bıraktığını belirtiyor.',
      ),
      low: t(
        'Geri planda kalan',
        'Yolu başkalarının göstermesini beklediğini ve fikirlerini çoğu zaman kendine sakladığını söylüyorsun. Fikrini önce küçük bir grupta ya da yazarak paylaşmak, sesini duyurmanın rahat bir yolu olabilir.',
        'Çocuğunuz yolu başkalarının göstermesini beklediğini ve fikirlerini çoğu zaman kendine sakladığını belirtiyor.',
      ),
    },

    /* ---------- Uyumluluk yönleri ---------- */
    compassion: {
      high: t(
        'Şefkatli',
        'Başkalarının duygularını içinde hissettiğini, onların hâlini hatırını sorduğunu ve onlar için bir şeyler yapmaktan hoşlandığını söylüyorsun. Başkalarına yardım ederken kendi ihtiyaçlarını da gözetmeyi unutma.',
        'Çocuğunuz başkalarının duygularını içinde hissettiğini, onların hâlini hatırını sorduğunu ve onlar için bir şeyler yapmaktan hoşlandığını belirtiyor.',
      ),
      average: t(
        'Duruma göre ilgilenen',
        'Başkalarının duygularını ve ihtiyaçlarını çoğu zaman önemsediğini, bazen de kendi işlerine odaklanmayı seçtiğini söylüyorsun.',
        'Çocuğunuz başkalarının duygularını ve ihtiyaçlarını çoğu zaman önemsediğini, bazen de kendi işlerine odaklanmayı seçtiğini belirtiyor.',
      ),
      low: t(
        'Kendi işine odaklanan',
        'Başkalarının sorunlarıyla ve duygularıyla pek ilgilenmediğini, onlara zaman ayırmak yerine kendi işlerine odaklandığını söylüyorsun. Çevrendekilerin nasıl olduğunu arada bir sormak, ilişkilerini güçlendirmenin küçük bir yolu olabilir.',
        'Çocuğunuz başkalarının sorunlarıyla ve duygularıyla pek ilgilenmediğini, onlara zaman ayırmak yerine kendi işlerine odaklandığını belirtiyor.',
      ),
    },
    politeness: {
      high: t(
        'Saygılı ve kırmayan',
        'İnsanlara saygı gösterdiğini; onları kırmaktan, kendi isteklerini onlara dayatmaktan ve çatışmadan kaçındığını söylüyorsun. Kendi fikrini saygılı bir dille savunmak da bu tarzın bir parçası olabilir.',
        'Çocuğunuz insanlara saygı gösterdiğini; onları kırmaktan, kendi isteklerini onlara dayatmaktan ve çatışmadan kaçındığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman saygılı',
        'Çoğu zaman saygılı ve uzlaşmacı davrandığını, bazen ise kendi isteklerini daha ısrarla savunabildiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman saygılı ve uzlaşmacı davrandığını, bazen ise kendi isteklerini daha ısrarla savunabildiğini belirtiyor.',
      ),
      low: t(
        'Çatışmadan çekinmeyen',
        'Çatışmadan çekinmediğini, kendi isteklerini ve çıkarını öne koyduğunu ve zaman zaman kırıcı olabildiğini söylüyorsun. Bunun karşındakileri nasıl etkilediğini düşünmek ilişkilerini güçlendirebilir.',
        'Çocuğunuz çatışmadan çekinmediğini, kendi isteklerini ve çıkarını öne koyduğunu ve zaman zaman kırıcı olabildiğini belirtiyor; bunu suçlamadan, farklı durumlar üzerinden birlikte konuşmanız yararlı olabilir.',
      ),
    },

    /* ---------- Sorumluluk yönleri ---------- */
    industriousness: {
      high: t(
        'İşini bitiren',
        'İşe kolayca koyulduğunu, başladığını bitirdiğini ve dikkatini elindeki işte tutabildiğini söylüyorsun. Bu kararlılık uzun soluklu hedeflerde sana güç verebilir.',
        'Çocuğunuz işe kolayca koyulduğunu, başladığını bitirdiğini ve dikkatini elindeki işte tutabildiğini belirtiyor.',
      ),
      average: t(
        'Çoğu zaman işine odaklanan',
        'Çoğu zaman işlerini bitirdiğini, bazen ise işe başlamakta zorlandığını ya da dikkatinin dağıldığını söylüyorsun.',
        'Çocuğunuz çoğu zaman işlerini bitirdiğini, bazen ise işe başlamakta zorlandığını ya da dikkatinin dağıldığını belirtiyor.',
      ),
      low: t(
        'İşe koyulmakta zorlanan',
        'İşe başlamakta zorlandığını, dikkatinin kolayca dağıldığını ve karar vermeyi ertelediğini söylüyorsun. Bu, üzerinde çalışılabilecek bir alan; bir işi bitirmek çoğu zaman ilk küçük adımla başlar.',
        'Çocuğunuz işe başlamakta zorlandığını, dikkatinin kolayca dağıldığını ve karar vermeyi ertelediğini belirtiyor. İşe koyulmak, üzerinde birlikte çalışılabilecek bir beceridir.',
      ),
    },
    orderliness: {
      high: t(
        'Düzenli ve titiz',
        'Düzeni sevdiğini, eşyalarını derli toplu tuttuğunu, bir programa göre hareket ettiğini ve ayrıntıları önemsediğini söylüyorsun. Her şeyin tam yerli yerinde olmasını istemek bazen yorabilir; önemli olanla olmayanı ayırmak bu titizliği daha da değerli kılabilir.',
        'Çocuğunuz düzeni sevdiğini, eşyalarını derli toplu tuttuğunu, bir programa göre hareket ettiğini ve ayrıntıları önemsediğini belirtiyor.',
      ),
      average: t(
        'Gerektiği kadar düzenli',
        'Düzene ve programa belli ölçüde önem verdiğini, bazı konularda ise dağınıklığa daha rahat bakabildiğini söylüyorsun.',
        'Çocuğunuz düzene ve programa belli ölçüde önem verdiğini, bazı konularda ise dağınıklığa daha rahat bakabildiğini belirtiyor.',
      ),
      low: t(
        'Esnek ve rahat',
        'Dağınıklığın seni pek rahatsız etmediğini, rutinden ve sıkı bir programdan hoşlanmadığını söylüyorsun. Önemli eşyalar ve işler için tek bir yer ya da liste belirlemek, esnekliğini korurken işini kolaylaştırabilir.',
        'Çocuğunuz dağınıklığın onu pek rahatsız etmediğini, rutinden ve sıkı bir programdan hoşlanmadığını belirtiyor.',
      ),
    },

    /* ---------- Duygusal Denge yönleri ---------- */
    composure: {
      high: t(
        'Sakin ve soğukkanlı',
        'Kolay kolay sinirlenmediğini, duygularını kontrol altında tuttuğunu ve soğukkanlılığını nadiren kaybettiğini söylüyorsun.',
        'Çocuğunuz kolay kolay sinirlenmediğini, duygularını kontrol altında tuttuğunu ve soğukkanlılığını nadiren kaybettiğini belirtiyor.',
      ),
      average: t(
        'Çoğu zaman sakin',
        'Çoğu zaman sakin kaldığını, bazı durumlarda ise çabuk sinirlenebildiğini ya da ruh hâlinin değişebildiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman sakin kaldığını, bazı durumlarda ise çabuk sinirlenebildiğini ya da ruh hâlinin değişebildiğini belirtiyor.',
      ),
      low: t(
        'Duyguları hızla yükselen',
        'Çabuk öfkelendiğini ya da küçük şeylere bozulduğunu, ruh hâlinin kolayca inip çıktığını söylüyorsun. Öfke yükseldiğinde konuşmayı biraz ertelemek, sakinleştikten sonra ne istediğini daha iyi anlatmana yardım edebilir.',
        'Çocuğunuz çabuk öfkelendiğini ya da küçük şeylere bozulduğunu, ruh hâlinin kolayca inip çıktığını belirtiyor. Öfkeli anlarda tartışmak yerine sakinleştikten sonra konuşmak ikinize de iyi gelebilir.',
      ),
    },
    security: {
      high: t(
        'İçi rahat',
        'Kendinle barışık olduğunu, kolay kolay endişeye ya da kuşkuya kapılmadığını ve cesaretinin kolay kırılmadığını söylüyorsun.',
        'Çocuğunuz kendisiyle barışık olduğunu, kolay kolay endişeye ya da kuşkuya kapılmadığını ve cesaretinin kolay kırılmadığını belirtiyor.',
      ),
      average: t(
        'Çoğu zaman rahat',
        'Çoğu zaman kendini rahat hissettiğini, bazı durumlarda ise endişelenebildiğini ya da cesaretinin kırılabildiğini söylüyorsun.',
        'Çocuğunuz çoğu zaman kendini rahat hissettiğini, bazı durumlarda ise endişelenebildiğini ya da cesaretinin kırılabildiğini belirtiyor.',
      ),
      low: t(
        'Endişe ve kuşkuya yatkın',
        'Birçok şey için endişelendiğini, içini sık sık kuşkuların kapladığını ve yaşadığın olaylar karşısında bunalabildiğini söylüyorsun. Bu duyguları yaşamak bir zayıflık değil; seni zorluyorsa güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz birçok şey için endişelendiğini, içini sık sık kuşkuların kapladığını ve yaşadığı olaylar karşısında bunalabildiğini belirtiyor. Endişelerini küçümsemeden dinlemek ve gerekirse okulun rehberlik servisinden destek almak iyi bir başlangıçtır.',
        {
          support: true,
          adult:
            'Birçok şey için endişelendiğini, içini sık sık kuşkuların kapladığını ve yaşadığın olaylar karşısında bunalabildiğini söylüyorsun. Bu duyguları yaşamak bir zayıflık değil; seni zorluyorsa güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
    },

    /* ---------- Deneyime Açıklık yönleri ---------- */
    intellect: {
      high: t(
        'Fikirlerle uğraşmayı seven',
        'Karmaşık problemleri çözmekten, soyut fikirlerle ve zor metinlerle uğraşmaktan hoşlandığını söylüyorsun. Bu yön zekâyı ölçmez; fikirlere duyduğun ilgiyi ve kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz karmaşık problemleri çözmekten, soyut fikirlerle ve zor metinlerle uğraşmaktan hoşlandığını belirtiyor. Bu yön zekâyı ölçmez; fikirlere duyduğu ilgiyi ve kendini nasıl gördüğünü gösterir.',
      ),
      average: t(
        'Konusuna göre meraklı',
        'Bazı konularda fikirlerle ve zor sorunlarla uğraşmaktan hoşlandığını, bazılarında ise daha az ilgi duyduğunu söylüyorsun. Bu yön zekâyı ölçmez; fikirlere duyduğun ilgiyi ve kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz bazı konularda fikirlerle ve zor sorunlarla uğraşmaktan hoşlandığını, bazılarında ise daha az ilgi duyduğunu belirtiyor. Bu yön zekâyı ölçmez; fikirlere duyduğu ilgiyi ve kendini nasıl gördüğünü gösterir.',
      ),
      low: t(
        'Soyut konulara az ilgi duyan',
        'Soyut fikirlerden, felsefi tartışmalardan ve okuması zor metinlerden pek hoşlanmadığını söylüyorsun. Bu yön zekâyı ölçmez; yalnızca hangi tür uğraşlardan hoşlandığını ve kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz soyut fikirlerden, felsefi tartışmalardan ve okuması zor metinlerden pek hoşlanmadığını belirtiyor. Bu yön zekâyı ölçmez; yalnızca hangi tür uğraşlardan hoşlandığını ve kendini nasıl gördüğünü gösterir.',
      ),
    },
    aesthetics: {
      high: t(
        'Güzelliğe duyarlı, hayal kuran',
        'Doğanın, sanatın ve müziğin güzelliğinden derinden etkilendiğini, hayal kurmayı ve düşüncelere dalmayı sevdiğini söylüyorsun. Yaratıcılığını ortaya koyabileceğin bir uğraş sana iyi gelebilir.',
        'Çocuğunuz doğanın, sanatın ve müziğin güzelliğinden derinden etkilendiğini, hayal kurmayı ve düşüncelere dalmayı sevdiğini belirtiyor.',
      ),
      average: t(
        'Ölçülü ilgi duyan',
        'Sanata, güzelliğe ve hayal kurmaya belli ölçüde ilgi duyduğunu; bazı alanların seni daha çok, bazılarının daha az etkilediğini söylüyorsun.',
        'Çocuğunuz sanata, güzelliğe ve hayal kurmaya belli ölçüde ilgi duyduğunu; bazı alanların onu daha çok, bazılarının daha az etkilediğini belirtiyor.',
      ),
      low: t(
        'Pek hayal kurmayan',
        'Pek hayal kurmadığını, düşüncelere dalıp gitmediğini ve şiire ya da resme pek ilgi duymadığını söylüyorsun. İlgilerinin başka alanlarda yoğunlaşması da bir tercihtir.',
        'Çocuğunuz pek hayal kurmadığını, düşüncelere dalıp gitmediğini ve şiire ya da resme pek ilgi duymadığını belirtiyor; ilgilerinin başka alanlarda yoğunlaşması da bir tercihtir.',
      ),
    },
  },
};
