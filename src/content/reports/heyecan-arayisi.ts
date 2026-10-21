import type { BandText, InsightRule, ReportTemplate } from './types';

/**
 * Heyecan Arayışı rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): uçların iyi ya da kötü anlamı yoktur; düşük düzey korkaklık, yüksek düzey
 * sorun gibi anlatılmaz. Sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor"
 * dili kullanılır. Rapor riskli davranışı özendirmez: yüksek düzeylerde heyecan ihtiyacının eğitmen gözetiminde ve kuralları
 * belli ortamlarda karşılanması önerilir; hiçbir etkinlik "yap" diye önerilmez.
 * Metinler yalnızca kendi ölçeğinin maddelerinin sorduğunu anlatır ve aynı sayfadaki öteki kartlarla çelişmez:
 *  - "Risk" iki ölçekte de sorulur (anlık: "Risk alırım"; göze alma: "Risk almaya istekliyim"). Bu yüzden düşük düzey
 *    metinleri riskten söz etmez ("riskten uzak durur" denirse öteki ölçeğin yüksek kartıyla çelişebilirdi).
 *  - Korku iki ölçekte farklı anlamdadır: tehlikeli heyecanlarda korkutucu deneyimlerin çekiciliği, göze almada yükseklik,
 *    kötü hava ya da büyük köpek gibi şeylerden çekinme. Metinler bu ikisini karıştırmaz.
 *  - Anlık heyecan arayışının tek tek maddeleri (ör. "Saçma şeyler yapmaya kolayca ikna olurum") düzey metninde kesin bir
 *    söz gibi anlatılmaz: ortalama puan tek bir maddeye katılındığını göstermez.
 * Birlikte yorum ("Birlikte bakınca", `insight`): giriş her raporda araştırmaların kısa özetidir (kaynaklar bilim kartında);
 * ardından ölçeklerin birleşimlerine göre cümleler. Destek kutusu gösterilmez: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez.
 * Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır. Yalnızca birlikte yorumun
 * girişi (öğrenci metni ergenlikten söz eder) ve tehlikeli heyecan ile anlık heyecan arayışının birlikte yüksek olduğu kural
 * (arkadaş etkisi gençlerde bulunmuştur; Gardner ve Steinberg, 2005) yetişkine ayrı yazılır.
 * Girişteki bilgilerin kaynakları bilim kartındadır: tanım (Zuckerman, 1994), yaşla değişim (Steinberg ve ark., 2008, 2018),
 * dürtüsellikten farkı (Maples-Keller ve ark., 2016; Woodman ve ark., 2013), olumlu riskler (Duell ve Steinberg, 2020) ve
 * arkadaş etkisi (Gardner ve Steinberg, 2005).
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
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

export const heyecanArayisiReport: ReportTemplate = {
  version: 'heyecan-arayisi-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır heyecan arayışının bir yönünü gösteriyor; üç yön ayrı ayrı puanlanır, toplam bir puan yoktur. Uçlardan biri iyi, öteki kötü değil. Puanlar ne yaptığını değil, kendini nasıl tanımladığını gösterir.',
    parent:
      'Her satır çocuğunuzun heyecan arayışının bir yönünü gösterir; üç yön ayrı ayrı puanlanır, toplam bir puan yoktur. Uçlardan biri iyi, öteki kötü değildir. Puanlar çocuğunuzun ne yaptığını değil, kendini nasıl tanımladığını gösterir.',
  },
  insight: {
    title: { you: 'Birlikte bakınca', parent: 'Birlikte bakınca' },
    pageNote: 'Birlikte bakınca: heyecan arayışı hakkında araştırmaların kısa özeti ve üç yönün birlikte ne anlatabileceği',
    lead: [
      {
        when: {},
        text: {
          student:
            'Heyecan arayışı, yeni, değişik ve yoğun deneyimler arama eğilimidir. Araştırmalara göre bu eğilim ergenlikte artar, gençlik yıllarında en yüksek düzeyine ulaşır, sonra 20’li yaşlarda azalır; bu düzen ülkelerin çoğunda benzer bulunmuştur, ama her ülkede aynı değildir. Heyecan arayışı, düşünmeden hareket etmekle aynı şey değildir: heyecan arayan birçok kişi, heyecan verici bir etkinliğe başlamadan önce dikkatle plan yapar ve önlem alır. Bu eğilim yalnızca zararlı risklerle değil, bir takıma girmeyi denemek gibi olumlu risklerle de ilişkili bulunmuştur. Arkadaşların yanında risk almak kolaylaşabilir; bu etki gençlerde, 24 yaş ve üstündekilere göre daha güçlü bulunmuştur.',
          parent:
            'Heyecan arayışı, yeni, değişik ve yoğun deneyimler arama eğilimidir. Araştırmalara göre bu eğilim ergenlikte artar, gençlik yıllarında en yüksek düzeyine ulaşır, sonra 20’li yaşlarda azalır; bu düzen ülkelerin çoğunda benzer bulunmuştur, ama her ülkede aynı değildir. Heyecan arayışı, düşünmeden hareket etmekle aynı şey değildir: heyecan arayan birçok kişi, heyecan verici bir etkinliğe başlamadan önce dikkatle plan yapar ve önlem alır. Bu eğilim yalnızca zararlı risklerle değil, bir takıma girmeyi denemek gibi olumlu risklerle de ilişkili bulunmuştur. Arkadaşların yanında risk almak kolaylaşabilir; bu etki gençlerde, 24 yaş ve üstündekilere göre daha güçlü bulunmuştur.',
          adult:
            'Heyecan arayışı, yeni, değişik ve yoğun deneyimler arama eğilimidir. Araştırmalara göre bu eğilim gençlik yıllarında en yüksek düzeyine ulaşır, sonra 20’li yaşlarda azalır (bu araştırmalar 30 yaşına kadar olan kişileri kapsar); bu düzen ülkelerin çoğunda benzer bulunmuştur, ama her ülkede aynı değildir. Heyecan arayışı, düşünmeden hareket etmekle aynı şey değildir: heyecan arayan birçok kişi, heyecan verici bir etkinliğe başlamadan önce dikkatle plan yapar ve önlem alır. Gençlerle yapılan bir çalışmada bu eğilim yalnızca zararlı risklerle değil, bir takıma girmeyi denemek gibi olumlu risklerle de ilişkili bulunmuştur. Arkadaşların yanında risk alma eğiliminin gençlerde arttığı, 24 yaş ve üstündekilerde bu etkinin daha zayıf olduğu bulunmuştur.',
        },
      },
    ],
    rules: [
      rule(
        { danger: ['high'], impulsive: ['high'] },
        'Hem tehlikeli heyecanlara ilgin hem de anlık heyecan arayışın yüksek. Bu iki yön bir araya geldiğinde, heyecan verici bir fırsat çıktığında düşünmeye zaman ayırmadan “evet” demek kolaylaşabilir. Bu, böyle olacağı anlamına gelmez; yalnızca hangi anlara, özellikle de arkadaşlarınla birlikteyken, dikkat edebileceğini gösterir.',
        'Çocuğunuzun hem tehlikeli heyecanlara ilgisi hem de anlık heyecan arayışı yüksek. Bu iki yön bir araya geldiğinde, heyecan verici bir fırsat çıktığında düşünmeye zaman ayırmadan “evet” demek kolaylaşabilir. Bu, böyle olacağı anlamına gelmez; yalnızca hangi anlara, özellikle de arkadaşlarıyla birlikteyken, dikkat edilebileceğini gösterir.',
        {
          adult:
            'Hem tehlikeli heyecanlara ilgin hem de anlık heyecan arayışın yüksek. Bu iki yön bir araya geldiğinde, heyecan verici bir fırsat çıktığında düşünmeye zaman ayırmadan “evet” demek kolaylaşabilir. Bu, böyle olacağı anlamına gelmez; yalnızca hangi anlara dikkat edebileceğini gösterir.',
        },
      ),
      rule(
        { danger: ['high'], impulsive: ['low', 'average'] },
        'Tehlikeli heyecanlara ilgin yüksek, ama anlık heyecan arayışın yüksek değil. Bu iki yön her zaman birlikte gitmez: korkutucu bir deneyimi çekici bulmak, aklına estiği gibi davranmak demek değildir.',
        'Çocuğunuzun tehlikeli heyecanlara ilgisi yüksek, ama anlık heyecan arayışı yüksek değil. Bu iki yön her zaman birlikte gitmez: korkutucu bir deneyimi çekici bulmak, aklına estiği gibi davranmak demek değildir.',
      ),
      rule(
        { impulsive: ['high'], danger: ['low', 'average'] },
        'Anlık ve beklenmedik şeyler yapmayı sevdiğini söylüyorsun, ama tehlikeli heyecanlara ilgin yüksek değil. Senin heyecanın daha çok sürprizlerden ve eğlenceli anlardan geliyor olabilir.',
        'Çocuğunuz anlık ve beklenmedik şeyler yapmayı sevdiğini belirtiyor, ama tehlikeli heyecanlara ilgisi yüksek değil. Onun heyecanı daha çok sürprizlerden ve eğlenceli anlardan geliyor olabilir.',
        { not: { danger: ['low'], venture: ['high'] } },
      ),
      rule(
        { venture: ['high'], danger: ['low'] },
        'Yeni deneyimleri göze aldığını, ama korku ve tehlike içeren deneyimlerin sana pek çekici gelmediğini söylüyorsun. Yeni şeylere açık olmak ile heyecan için tehlike aramak farklı şeylerdir.',
        'Çocuğunuz yeni deneyimleri göze aldığını, ama korku ve tehlike içeren deneyimlerin ona pek çekici gelmediğini belirtiyor. Yeni şeylere açık olmak ile heyecan için tehlike aramak farklı şeylerdir.',
        { not: { impulsive: ['high'] } },
      ),
      rule(
        { danger: ['low'], impulsive: ['high'], venture: ['high'] },
        'Anlık ve beklenmedik şeyler yapmayı sevdiğini ve yeni deneyimleri göze aldığını söylüyorsun; ama korku ve tehlike içeren deneyimler sana pek çekici gelmiyor. Senin heyecanın daha çok sürprizlerden, yeni yerlerden ve yeni deneyimlerden geliyor olabilir.',
        'Çocuğunuz anlık ve beklenmedik şeyler yapmayı sevdiğini ve yeni deneyimleri göze aldığını belirtiyor; ama korku ve tehlike içeren deneyimler ona pek çekici gelmiyor. Onun heyecanı daha çok sürprizlerden, yeni yerlerden ve yeni deneyimlerden geliyor olabilir.',
      ),
      rule(
        { danger: ['high'], venture: ['low'] },
        'Tehlikeli heyecanların sana çekici geldiğini söylesen de göze alma ve keşifte puanın düşük. Bir deneyimi heyecanlı bulmak ile o anda kendini rahat hissetmek her zaman birlikte gitmez; ikisi aynı kişide bir arada olabilir.',
        'Çocuğunuz tehlikeli heyecanların ona çekici geldiğini belirtse de göze alma ve keşifte puanı düşük. Bir deneyimi heyecanlı bulmak ile o anda kendini rahat hissetmek her zaman birlikte gitmez; ikisi aynı kişide bir arada olabilir.',
      ),
      rule(
        { danger: ['low'], impulsive: ['low'], venture: ['low'] },
        'Üç yönde de puanın düşük: sakin, güvenli ve öngörülebilir deneyimleri seçen bir tarzın olabilir. Bu, heyecanı hiç sevmediğin anlamına gelmez; senin için heyecan, tehlike ya da sürpriz içermeyen yerlerden geliyor olabilir.',
        'Çocuğunuzun puanı üç yönde de düşük: sakin, güvenli ve öngörülebilir deneyimleri seçen bir tarzı olabilir. Bu, heyecanı hiç sevmediği anlamına gelmez; onun için heyecan, tehlike ya da sürpriz içermeyen yerlerden geliyor olabilir.',
      ),
    ],
    fallback: {
      student: 'Senin sonuçlarında üç yön arasında dikkat çeken bir birleşim yok; her yönün ayrıntısını aşağıda görebilirsin.',
      parent: 'Çocuğunuzun sonuçlarında üç yön arasında dikkat çeken bir birleşim yok; her yönün ayrıntısı aşağıda görülüyor.',
    },
  },
  scales: {
    danger: {
      high: t(
        'Tehlikeli heyecanlara ilgi duyan',
        'Genel olarak korku ve tehlike içeren deneyimlerin sana çekici geldiğini söylüyorsun: bungee jumping ya da paraşütle atlama gibi deneyimler ilgini çekebilir; sıkılmaktansa korkmayı tercih edebilirsin. Bu ilgi kendi başına bir sorun değildir. Bu tür etkinliklerin birçoğunda yaş sınırı ve sıkı güvenlik kuralları bulunur; heyecan ihtiyacını eğitmen gözetiminde yapılan, kuralları belli etkinliklerle karşılamak daha güvenli bir yoldur.',
        'Çocuğunuz genel olarak korku ve tehlike içeren deneyimlerin ona çekici geldiğini belirtiyor: bungee jumping ya da paraşütle atlama gibi deneyimler ilgisini çekebilir; sıkılmaktansa korkmayı tercih edebilir. Bu ilgi kendi başına bir sorun değildir. Bu tür etkinliklerin birçoğunda yaş sınırı ve sıkı güvenlik kuralları bulunur; heyecan ihtiyacını eğitmen gözetiminde yapılan, kuralları belli etkinliklerle karşılaması daha güvenli bir yoldur.',
      ),
      average: t(
        'Tehlikeli heyecanlara orta düzeyde ilgi duyan',
        'Korku ve tehlike içeren deneyimlere orta düzeyde ilgin olduğunu söylüyorsun: bazıları sana çekici gelebilir, bazılarından ise uzak durmayı tercih edebilirsin.',
        'Çocuğunuz korku ve tehlike içeren deneyimlere orta düzeyde ilgisi olduğunu belirtiyor: bazıları ona çekici gelebilir, bazılarından ise uzak durmayı tercih edebilir.',
      ),
      low: t(
        'Tehlikeli heyecanlara pek ilgi duymayan',
        'Korku ve tehlike içeren deneyimlerin sana pek çekici gelmediğini söylüyorsun: bungee jumping ya da fırtınada denize açılmak gibi şeyleri denemeyi istemeyebilirsin. Bu bir eksiklik değil; birçok insan tehlike içeren deneyimlere ilgi duymaz.',
        'Çocuğunuz korku ve tehlike içeren deneyimlerin ona pek çekici gelmediğini belirtiyor: bungee jumping ya da fırtınada denize açılmak gibi şeyleri denemeyi istemeyebilir. Bu bir eksiklik değildir; birçok insan tehlike içeren deneyimlere ilgi duymaz.',
      ),
    },
    impulsive: {
      high: t(
        'Anlık kararlarla macera arayan',
        'Genel olarak aklına estiği gibi davranmayı, beklenmedik ve çılgınca şeyler yapmayı sevdiğini; macera aradığını ve risk aldığını söylüyorsun. Bu canlılık hayatına renk katabilir. Hangi anlık kararlarının sonradan sana iyi geldiğini, hangilerinin gelmediğini fark etmek de işine yarayabilir.',
        'Çocuğunuz genel olarak aklına estiği gibi davranmayı, beklenmedik ve çılgınca şeyler yapmayı sevdiğini; macera aradığını ve risk aldığını belirtiyor. Bu canlılık onun hayatına renk katabilir. Hangi anlık kararlarının sonradan ona iyi geldiğini, hangilerinin gelmediğini fark etmesi de işine yarayabilir.',
      ),
      average: t(
        'Duruma göre anlık davranan',
        'Bazen anlık kararlarla beklenmedik şeyler yaptığını, bazen de ölçülü ve öngörülebilir davrandığını söylüyorsun.',
        'Çocuğunuz bazen anlık kararlarla beklenmedik şeyler yaptığını, bazen de ölçülü ve öngörülebilir davrandığını belirtiyor.',
      ),
      low: t(
        'Ölçülü ve öngörülebilir',
        'Genel olarak aklına estiği gibi davranmadığını; çılgınca ya da beklenmedik şeyler yapmaktan çok ölçülü ve öngörülebilir olmayı seçtiğini söylüyorsun. Bu tarz çevrendekilere güven verebilir.',
        'Çocuğunuz genel olarak aklına estiği gibi davranmadığını; çılgınca ya da beklenmedik şeyler yapmaktan çok ölçülü ve öngörülebilir olmayı seçtiğini belirtiyor. Bu tarz çevresindekilere güven verebilir.',
      ),
    },
    venture: {
      high: t(
        'Göze alan ve keşfetmeyi seven',
        'Genel olarak tehlike karşısında kendinden emin davrandığını, risk almaya istekli olduğunu, alışılmadık yerleri keşfetmek ve yeni deneyimler yaşamak istediğini söylüyorsun. Yükseklik ya da kötü hava gibi şeylerden pek çekinmeyebilirsin. Göze almak, gerekli önlemlerle birleştiğinde bir güç olabilir.',
        'Çocuğunuz genel olarak tehlike karşısında kendinden emin davrandığını, risk almaya istekli olduğunu, alışılmadık yerleri keşfetmek ve yeni deneyimler yaşamak istediğini belirtiyor. Yükseklik ya da kötü hava gibi şeylerden pek çekinmeyebilir. Göze almak, gerekli önlemlerle birleştiğinde bir güç olabilir.',
      ),
      average: t(
        'Duruma göre göze alan',
        'Bazı yeni deneyimleri göze aldığını, bazı durumlarda ise temkinli kalmayı seçtiğini söylüyorsun.',
        'Çocuğunuz bazı yeni deneyimleri göze aldığını, bazı durumlarda ise temkinli kalmayı seçtiğini belirtiyor.',
      ),
      low: t(
        'Temkinli',
        'Genel olarak yükseklik, kötü hava ya da büyük köpekler gibi bazı şeylerden çekindiğini; tehlike karşısında kendinden pek emin hissetmediğini söylüyorsun. Bu temkin, seni gereksiz tehlikelerden uzak tutabilir.',
        'Çocuğunuz genel olarak yükseklik, kötü hava ya da büyük köpekler gibi bazı şeylerden çekindiğini; tehlike karşısında kendinden pek emin hissetmediğini belirtiyor. Bu temkin, onu gereksiz tehlikelerden uzak tutabilir.',
      ),
    },
  },
};

