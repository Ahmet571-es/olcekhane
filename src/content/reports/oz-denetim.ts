import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Öz-denetim rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): düşük düzey bir kusur, yüksek düzey bir başarı notu gibi anlatılmaz; hiçbir
 * düzey kişiyi yargılamaz ("tembel", "iradesiz", "sorumsuz", "dürtüsel", "disiplinsiz" gibi sözcükler kullanılmaz). Sonuç öz
 * bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır.
 * Metinler yalnızca kendi ölçeğinin maddelerinin sorduğunu anlatır ve aynı sayfadaki öteki kartlarla çelişmez:
 *  - Düşünerek davranmanın kartları işe başlamaktan ve isteklere direnmekten, öz-disiplinin kartları acele kararlardan ve
 *    isteklerden, kendini tutabilmenin kartları işe başlamaktan ve kararlardan söz etmez (tests/oz-denetim.test.ts denetler).
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim kartındadır):
 * öz-denetimin tanımı, her zaman dişini sıkmak demek olmadığı (alışkanlık ve ortam) ve "iradenin tükenmesi" düşüncesinin
 * büyük tekrar çalışmalarında desteklenmediği. Ardından ölçeklerin birleşimine göre en çok bir kural. Kurallar birbirini
 * dışlar: bir alan yüksek, öteki düşükken her zaman tam bir kural çıkar. Üç alan yüksekken başarı notu gibi, üçü düşükken
 * eksiklik gibi anlatılmaz ve bir sonuç vaat edilmez.
 * Kartlar okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır. Gençlik yıllarındaki
 * gelişimden ya da "güvendiğin bir yetişkin"den söz eden metinler yetişkine ayrı yazılır.
 */
const t = (summary: string, student: string, parent: string, extra: { adult?: string } = {}): BandText => ({
  summary,
  student,
  parent,
  ...(extra.adult ? { adult: extra.adult } : {}),
  tipsStudent: [],
  tipsParent: [],
});

const rule = (
  when: InsightRule['when'],
  student: string,
  parent: string,
  extra: { adult?: string; not?: InsightRule['not'] } = {},
): InsightRule => ({
  when,
  ...(extra.not ? { not: extra.not } : {}),
  text: extra.adult ? { student, parent, adult: extra.adult } : { student, parent },
});

const LEAD_START = {
  you: 'Öz-denetim, o an cazip gelen ile uzun vadede senin için daha değerli olan arasında ikincisini seçebilmektir; bu test onu üç alanda ayrı ayrı gösterir.',
  parent: 'Öz-denetim, kişinin o an cazip gelen ile uzun vadede onun için daha değerli olan arasında ikincisini seçebilmesidir; bu test onu üç alanda ayrı ayrı gösterir.',
};
const LEAD_RESEARCH =
  'Araştırmalarda öz-denetimi yüksek olanlar, gündelik hayatta istekleriyle hedefleri arasında daha seyrek çatışma yaşadıklarını bildirmiştir. Bunun bir nedeni, iyi alışkanlıklar kurmaları ve ortamlarını önceden düzenlemeleri olabilir; yani öz-denetim her zaman dişini sıkmak demek değildir. İradenin kullandıkça tükenen bir yakıt olduğu düşüncesi ise büyük tekrar çalışmalarında desteklenmemiştir.';
const LEAD_END = {
  you: 'Öz-denetim yirmili yaşların ortasına kadar gelişmeye devam eder; bu sonuç kalıcı bir yargı değil, bugünün bir resmidir.',
  parent: 'Öz-denetim yirmili yaşların ortasına kadar gelişmeye devam eder; bu sonuç kalıcı bir yargı değil, bugünün bir resmidir.',
  adult: 'Öz-denetimin bir kısmı alışkanlıklara ve ortama bağlıdır; bunlar değiştikçe davranış da değişebilir. Bu sonuç kalıcı bir yargı değil, bugünün bir resmidir.',
};

export const ozDenetimReport: ReportTemplate = {
  version: 'oz-denetim-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır öz-denetimin bir alanını gösteriyor; üç alan ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar ne kadar başarılı olduğunu değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
    parent:
      'Her satır çocuğunuzun öz-denetiminin bir alanını gösterir; üç alan ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar çocuğunuzun ne kadar başarılı olduğunu değil, kendini nasıl tanımladığını gösterir. Düşük bir puan bir kusur, yüksek bir puan da bir başarı notu değildir.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Birlikte bakınca: öz-denetim hakkında araştırmaların kısa özeti ve üç alanın birlikte ne anlatabileceği',
    lead: [
      {
        when: {},
        text: {
          student: `${LEAD_START.you} ${LEAD_RESEARCH} ${LEAD_END.you}`,
          parent: `${LEAD_START.parent} ${LEAD_RESEARCH} ${LEAD_END.parent}`,
          adult: `${LEAD_START.you} ${LEAD_RESEARCH} ${LEAD_END.adult}`,
        },
      },
    ],
    rules: [
      rule(
        { deliberation: ['high'], discipline: ['high'], restraint: ['high'] },
        'Üç alanda da puanın yüksek: bir şeyi yapmadan önce düşündüğünü, yapılacak işlere vakit kaybetmeden koyulduğunu ve cazip gelen şeylere karşı kendini tutabildiğini söylüyorsun. Bu üç alan bir hedefe giderken birbirini destekleyebilir; yine de herkes gibi senin de zorlandığın anlar olabilir ve bu olağandır.',
        'Çocuğunuzun puanı üç alanda da yüksek: bir şeyi yapmadan önce düşündüğünü, yapılacak işlere vakit kaybetmeden koyulduğunu ve cazip gelen şeylere karşı kendini tutabildiğini belirtiyor. Bu üç alan bir hedefe giderken birbirini destekleyebilir; yine de herkes gibi onun da zorlandığı anlar olabilir ve bu olağandır.',
      ),
      rule(
        { discipline: ['high'], deliberation: ['low'] },
        'İşlere vakit kaybetmeden koyulduğunu söylüyorsun; “Düşünerek davranma” alanında ise puanın düşük. Bir işe hızla başlamak ile bir şeyi yapmadan önce durup düşünmek ayrı şeylerdir. Bir karar vermeden önce kendine “Bunun sonucu ne olur?” diye sormak, hızını korurken aceleyle verilen kararları azaltabilir.',
        'Çocuğunuz işlere vakit kaybetmeden koyulduğunu belirtiyor; “Düşünerek davranma” alanında ise puanı düşük. Bir işe hızla başlamak ile bir şeyi yapmadan önce durup düşünmek ayrı şeylerdir. Bir karar vermeden önce kendine “Bunun sonucu ne olur?” diye sorması, hızını korurken aceleyle verilen kararları azaltabilir.',
        { not: { restraint: ['low'] } },
      ),
      rule(
        { discipline: ['high'], deliberation: ['low'], restraint: ['low'] },
        'İşlere vakit kaybetmeden koyulduğunu söylüyorsun; “Düşünerek davranma” ve “Kendini tutabilme” alanlarında ise puanın düşük. Bir işe hemen başlayabilen biri de anlık isteklere ve aceleci kararlara kolayca kapılabilir. İşe koyulmadaki kararlılığını, zor anlar için yaptığın planları uygulamakta da kullanabilirsin.',
        'Çocuğunuz işlere vakit kaybetmeden koyulduğunu belirtiyor; “Düşünerek davranma” ve “Kendini tutabilme” alanlarında ise puanı düşük. Bir işe hemen başlayabilen biri de anlık isteklere ve aceleci kararlara kolayca kapılabilir. İşe koyulmadaki kararlılığı, zor anlar için yaptığı planları uygularken ona dayanak olabilir.',
      ),
      rule(
        { deliberation: ['high'], discipline: ['low'] },
        'Bir şeyi yapmadan önce düşündüğünü söylüyorsun; “Öz-disiplin” alanında ise puanın düşük. Dikkatle düşünmek ile işe hemen koyulmak her zaman birlikte gitmez: uzun uzun düşünmek bazen başlamayı geciktirebilir. Düşünmeye bir süre koymak (“On dakika düşüneceğim, sonra ilk adımı atacağım.” gibi) düşündüklerini hayata geçirmeni kolaylaştırabilir.',
        'Çocuğunuz bir şeyi yapmadan önce düşündüğünü belirtiyor; “Öz-disiplin” alanında ise puanı düşük. Dikkatle düşünmek ile işe hemen koyulmak her zaman birlikte gitmez: uzun uzun düşünmek bazen başlamayı geciktirebilir. Düşünmeye bir süre koymak (“On dakika düşüneceğim, sonra ilk adımı atacağım.” gibi) düşündüklerini hayata geçirmesini kolaylaştırabilir.',
        { not: { restraint: ['low'] } },
      ),
      rule(
        { deliberation: ['high'], discipline: ['low'], restraint: ['low'] },
        'Bir şeyi yapmadan önce düşündüğünü söylüyorsun; “Öz-disiplin” ve “Kendini tutabilme” alanlarında ise puanın düşük. Kararlarını düşünerek veren biri de işe başlamakta zorlanabilir ve cazip gelen şeylere kapılabilir. Önceden düşünme alışkanlığını, işe başlayacağın zamanı ve yeri belirlemek için kullanmak işine yarayabilir.',
        'Çocuğunuz bir şeyi yapmadan önce düşündüğünü belirtiyor; “Öz-disiplin” ve “Kendini tutabilme” alanlarında ise puanı düşük. Kararlarını düşünerek veren biri de işe başlamakta zorlanabilir ve cazip gelen şeylere kapılabilir. Önceden düşünme alışkanlığı, işe başlayacağı zamanı ve yeri belirlerken ona dayanak olabilir.',
      ),
      rule(
        { restraint: ['low'], deliberation: ['high', 'average'], discipline: ['high', 'average'] },
        'Cazip gelen şeylere karşı kendini tutmakta zorlandığını söylüyorsun; öteki alanlarda ise puanın daha yüksek. Bu üç alan birbirinden ayrıdır; biri yüksekken öteki daha düşük olabilir. Öteki alanlardaki güçlü yanların burada da işine yarayabilir: isteklerinin hangi durumlarda güçlendiğini fark edip o durumlar için önceden bir plan yapmak sana kolay gelebilir.',
        'Çocuğunuz cazip gelen şeylere karşı kendini tutmakta zorlandığını belirtiyor; öteki alanlarda ise puanı daha yüksek. Bu üç alan birbirinden ayrıdır; biri yüksekken öteki daha düşük olabilir. Öteki alanlardaki güçlü yanları burada da ona yardım edebilir: isteklerinin hangi durumlarda güçlendiğini fark edip o durumlar için önceden bir plan yapmak ona kolay gelebilir.',
        { not: { deliberation: ['average'], discipline: ['average'] } },
      ),
      rule(
        { restraint: ['high'], deliberation: ['low', 'average'], discipline: ['low', 'average'] },
        'Cazip gelen şeylere karşı kendini tutabildiğini söylüyorsun; öteki alanlarda ise puanın daha düşük. Bir isteğe “şimdi değil” diyebilmek, bir işe başlarken ya da bir karar verirken de işine yarayabilir: o zaman da kısaca durup ne yapmak istediğini düşünebilirsin.',
        'Çocuğunuz cazip gelen şeylere karşı kendini tutabildiğini belirtiyor; öteki alanlarda ise puanı daha düşük. Bir isteğe “şimdi değil” diyebilmek, bir işe başlarken ya da bir karar verirken de ona yardım edebilir: o zaman da kısaca durup ne yapmak istediğini düşünebilir.',
        { not: { deliberation: ['average'], discipline: ['average'] } },
      ),
      rule(
        { deliberation: ['low'], discipline: ['low'], restraint: ['low'] },
        'Üç alanda da puanın düşük: işlere çoğu zaman düşünmeden atıldığını, başlamakta zorlandığını ve cazip gelen şeylere kolayca kapıldığını söylüyorsun. Aşağıdaki kartlar her alanı ayrı ayrı anlatıyor; her birinde küçük bir başlangıç noktası bulabilirsin.',
        'Çocuğunuzun puanı üç alanda da düşük: işlere çoğu zaman düşünmeden atıldığını, başlamakta zorlandığını ve cazip gelen şeylere kolayca kapıldığını belirtiyor. Bunu bir eksiklik gibi değil, onu tanımak için bir başlangıç olarak ele alabilirsiniz; aşağıdaki kartlar her alanı ayrı ayrı anlatıyor.',
      ),
    ],
    fallback: {
      student: 'Üç alanı birlikte düşününce ayrıca eklenecek bir şey yok; her alanın ayrıntısını aşağıdaki kartlarda görebilirsin.',
      parent: 'Üç alanı birlikte düşününce ayrıca eklenecek bir şey yok; her alanın ayrıntısı aşağıdaki kartlarda.',
    },
  },
  scales: {
    deliberation: {
      high: t(
        'Düşünerek davranan',
        'Genel olarak bir şeyi yapmadan önce düşündüğünü, aceleci kararlar vermediğini ve işlere düşünmeden atılmadığını söylüyorsun. Bu, bir davranışın sonuçlarını önceden görmeni kolaylaştırabilir.',
        'Çocuğunuz genel olarak bir şeyi yapmadan önce düşündüğünü, aceleci kararlar vermediğini ve işlere düşünmeden atılmadığını belirtiyor. Bu, bir davranışın sonuçlarını önceden görmesini kolaylaştırabilir.',
      ),
      average: t(
        'Duruma göre düşünerek davranan',
        'Bazı durumlarda düşünerek, bazılarında ise anlık davrandığını söylüyorsun. Bu çok olağandır: insanlar önemli gördükleri konularda daha uzun düşünür, gündelik işlerde ise daha hızlı davranır.',
        'Çocuğunuz bazı durumlarda düşünerek, bazılarında ise anlık davrandığını belirtiyor. Bu çok olağandır: insanlar önemli gördükleri konularda daha uzun düşünür, gündelik işlerde ise daha hızlı davranır.',
      ),
      low: t(
        'Anlık davranmaya yatkın',
        'Genel olarak bir şeylere düşünmeden atıldığını, hızlı karar verdiğini ve aklına estiği gibi davranmayı sevdiğini söylüyorsun. Anlık davranmak bazı anlara canlılık katabilir; etkisi uzun sürecek kararlarda ise acele etmemek işine yarayabilir.',
        'Çocuğunuz genel olarak bir şeylere düşünmeden atıldığını, hızlı karar verdiğini ve aklına estiği gibi davranmayı sevdiğini belirtiyor. Anlık davranmak bazı anlara canlılık katabilir; etkisi uzun sürecek kararlarda ise acele etmemesi ona yardım edebilir.',
      ),
    },
    discipline: {
      high: t(
        'İşe hemen koyulan',
        'Genel olarak yapman gereken işlere vakit kaybetmeden başladığını, hazırlıklı olduğunu ve yaptığın planları uyguladığını söylüyorsun. Bu, işlerin birikmesini önlemeyi ve bir hedefe adım adım ilerlemeyi kolaylaştırabilir.',
        'Çocuğunuz genel olarak yapması gereken işlere vakit kaybetmeden başladığını, hazırlıklı olduğunu ve yaptığı planları uyguladığını belirtiyor. Bu, işlerin birikmesini önlemeyi ve bir hedefe adım adım ilerlemeyi ona kolaylaştırabilir.',
      ),
      average: t(
        'Bazen hemen, bazen geç başlayan',
        'Bazı işlere hemen koyulduğunu, bazılarına ise başlamakta zorlandığını söylüyorsun. Bu, çoğu insanda işin ne kadar ilgi çekici ya da zor olduğuna göre değişir.',
        'Çocuğunuz bazı işlere hemen koyulduğunu, bazılarına ise başlamakta zorlandığını belirtiyor. Bu, çoğu insanda işin ne kadar ilgi çekici ya da zor olduğuna göre değişir.',
      ),
      low: t(
        'İşe başlamakta zorlanan',
        'Genel olarak işlere başlamakta zorlandığını, başlamak için birinin seni dürtmesine ihtiyaç duyduğunu ve zamanını boşa harcadığını düşündüğünü söylüyorsun. Bu sonuç bir değer yargısı değildir; işe başlamak irade gücünden çok, başlangıcı küçük ve belirli hâle getirmekle kolaylaşabilir.',
        'Çocuğunuz genel olarak işlere başlamakta zorlandığını, başlamak için birinin onu dürtmesine ihtiyaç duyduğunu ve zamanını boşa harcadığını düşündüğünü belirtiyor. Bu sonuç bir değer yargısı değildir; işe başlamak irade gücünden çok, başlangıcı küçük ve belirli hâle getirmekle kolaylaşabilir.',
      ),
    },
    restraint: {
      high: t(
        'Kendini tutabilen',
        'Genel olarak cazip gelen şeylere kolayca direnebildiğini, canın bir şeyi çok çektiğinde kendini tutabildiğini ve nadiren aşırıya kaçtığını söylüyorsun. Bu, anlık isteklerin uzun vadeli hedeflerinle çatıştığı anlarda işine yarayabilir.',
        'Çocuğunuz genel olarak cazip gelen şeylere kolayca direnebildiğini, canı bir şeyi çok çektiğinde kendini tutabildiğini ve nadiren aşırıya kaçtığını belirtiyor. Bu, anlık isteklerin uzun vadeli hedefleriyle çatıştığı anlarda ona yardım edebilir.',
      ),
      average: t(
        'Duruma göre kendini tutabilen',
        'Bazı isteklere karşı kendini tutabildiğini, bazılarına ise kapıldığını söylüyorsun; bu, isteğin ne kadar güçlü olduğuna ve o sıradaki durumuna göre değişebilir.',
        'Çocuğunuz bazı isteklere karşı kendini tutabildiğini, bazılarına ise kapıldığını belirtiyor; bu, isteğin ne kadar güçlü olduğuna ve o sıradaki durumuna göre değişebilir.',
      ),
      low: t(
        'İsteklerine kolay kapılan',
        'Genel olarak cazip gelen şeylere direnmekte zorlandığını, kendini kaptırıp aşırıya kaçtığını ve sonradan pişman olduğun şeyler yaptığını söylüyorsun. Bu yorucu olabilir; birçok insan için kendini tutmak, isteği uyandıran durumları baştan değiştirdikçe kolaylaşabilir. Bir alışkanlığın kontrolden çıktığını düşünüyorsan güvendiğin bir yetişkinle konuşmak iyi gelebilir.',
        'Çocuğunuz genel olarak cazip gelen şeylere direnmekte zorlandığını, kendini kaptırıp aşırıya kaçtığını ve sonradan pişman olduğu şeyler yaptığını belirtiyor. Birçok insan için kendini tutmak, isteği uyandıran durumları baştan değiştirdikçe kolaylaşabilir. Bu sonuç bir tanı değildir; ancak bir alışkanlığın kontrolden çıktığını düşünüyorsanız onunla sakin bir anda konuşmanız ve gerekirse bir uzmandan destek almanız iyi olur.',
        {
          adult:
            'Genel olarak cazip gelen şeylere direnmekte zorlandığını, kendini kaptırıp aşırıya kaçtığını ve sonradan pişman olduğun şeyler yaptığını söylüyorsun. Bu yorucu olabilir; birçok insan için kendini tutmak, isteği uyandıran durumları baştan değiştirdikçe kolaylaşabilir. Bir alışkanlığın kontrolden çıktığını düşünüyorsan güvendiğin biriyle ya da bir uzmanla konuşmak iyi gelebilir.',
        },
      ),
    },
  },
};
