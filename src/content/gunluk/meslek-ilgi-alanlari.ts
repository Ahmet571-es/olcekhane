import type { SurveyDaily } from './types';

/**
 * Meslek İlgi Alanları: günlük hayatta nasıl görünür (9. sınıftan mezuna ve yetişkinlere). Ton: özellik (ilgi; iki uç da
 * eşit; lib/reports/daily-parts.ts). Maddeler bir işi ya da etkinliği yapmaktan ne kadar hoşlanılacağını sorar
 * (src/content/instruments/meslek-ilgi-alanlari.ts; ters madde yok): örnekler bir işin çekici gelip gelmeyeceğini anlatır,
 * yapabilmeyi ya da bir mesleği değil. Maddelerdeki meslek adları (kimyager, subay …) satırlarda geçmez; satır o maddenin
 * etkinliğini bugünkü hayattan bir örnekle anlatır. Düşük ilgi bir eksiklik gibi anlatılmaz (src/content/reports/
 * meslek-ilgi-alanlari.ts: "Bu bir eksiklik değil"); zaman başka işlere ayrılabilir. Etkinlikler sahip olmaya bağlanmaz
 * (bahçe, araç, hayvan, çalgı yok) ve hiçbir alan bir cinsiyetle eşleştirilmez. Yetişkin iş satırları okul sözcüğü içermez;
 * arkadaş ve ev satırları öğrencininkidir. Her satırın dayandığı maddeler `from`'dadır (anahtar: o + kaynaktaki numara).
 * Maddeye doğrudan dayanmayan uzantılar: yüksek ilgide sevilen işle uğraşırken zamanın nasıl geçtiğinin fark edilmeyebileceği,
 * başka işlerin bekleyebileceği (merak.ts'teki gibi ilginin yumuşak bedeli); Macera ve Hareket'te düşük ucun sakin uğraşları
 * seçmesi ("sakin ve güvenli ortamları tercih ettiğini gösterir", rapor metni) ve yüksek ucun hareketsiz bir günde
 * sıkılabilmesi (o15'in bedeli).
 */
export const meslekIlgiAlanlariDaily: SurveyDaily = {
  kind: 'survey',
  version: 'meslek-ilgi-alanlari-gunluk-1',
  scales: {
    /* Liderlik ve İkna: o01 önemli işlerin gerçekleşmesini sağlamak, o09 liderlik etmek, o33 seçim kampanyası, o41 sunuculuk,
       o49 reklam kampanyası planlamak, o57 açık bir toplantıda tartışmak, o65 ikna etmek, o81 aday olmak, o86 karar vermek. */
    leadership: {
      poles: { low: 'Yönetme, ikna geri planda', high: 'Yönetip ikna etmeyi sever' },
      bands: {
        low: {
          from: { school: ['o81', 'o41'], friends: ['o09'], home: ['o65'], work: ['o41', 'o09'] },
          student: {
            school: 'Bir seçime aday olmak ya da bir törende sunuculuk yapmak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla bir şey planlarken yönetmeyi başkasına bırakıp işin kendisiyle ilgilenmeyi seçebilirsin.',
            home: 'Bir konuda yakınlarını kendi görüşüne ikna etmeye uğraşmak sana pek keyifli gelmeyebilir.',
          },
          parent: {
            school: 'Bir seçime aday olmak ya da bir törende sunuculuk yapmak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla bir şey planlarken yönetmeyi başkasına bırakıp işin kendisiyle ilgilenmeyi seçebilir.',
            home: 'Bir konuda yakınlarını kendi görüşüne ikna etmeye uğraşmak ona pek keyifli gelmeyebilir.',
          },
          adult: {
            work: 'Bir toplantıda sunuculuk yapmak ya da bir ekibi yönetmek sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o09'], friends: ['o65', 'o57'], home: ['o86'], work: ['o09'] },
          student: {
            school: 'Bir proje grubunda bazen yön vermek isteyebilir, bazen başkasının planıyla çalışabilirsin.',
            friends: 'Bir tartışmada bazen görüşünü savunup ikna etmeye çalışabilir, bazen dinlemeyi seçebilirsin.',
            home: 'Ortak bir karar verilirken bazen söz almak isteyebilir, bazen kararı başkalarına bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir proje grubunda bazen yön vermek isteyebilir, bazen başkasının planıyla çalışabilir.',
            friends: 'Bir tartışmada bazen görüşünü savunup ikna etmeye çalışabilir, bazen dinlemeyi seçebilir.',
            home: 'Ortak bir karar verilirken bazen söz almak isteyebilir, bazen kararı başkalarına bırakabilir.',
          },
          adult: {
            work: 'Bir işte bazen sorumluluğu üstlenmek isteyebilir, bazen başkasının yönettiği bir ekipte çalışabilirsin.',
          },
        },
        high: {
          from: { school: ['o81', 'o41'], friends: ['o65', 'o09'], home: ['o49', 'o33'], work: ['o86', 'o65', 'o09'] },
          student: {
            school: 'Bir seçime aday olmak ya da bir törende sunuculuk yapmak sana heyecan verici gelebilir.',
            friends: 'Arkadaşlarını bir fikre ikna etmek ya da bir grubu bir hedefte toplamak sana keyifli gelebilir.',
            home: 'Bir kampanya ya da etkinlik planlarken saatlerce uğraşabilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Bir seçime aday olmak ya da bir törende sunuculuk yapmak çocuğunuza heyecan verici gelebilir.',
            friends: 'Arkadaşlarını bir fikre ikna etmek ya da bir grubu bir hedefte toplamak ona keyifli gelebilir.',
            home: 'Bir kampanya ya da etkinlik planlarken saatlerce uğraşabilir; başka işler bekleyebilir.',
          },
          adult: {
            work: 'Bir işi yönetmek, karar vermek ve insanları bir hedefe ikna etmek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Düzen ve Organizasyon: o18 bütçe planlamak, o34 dosyalama düzeni kurmak, o58 zaman çizelgesi, o66 harcamaları izlemek,
       o82 stok takibi, o87 veri tabanı, o90 ayrıntılı kayıt tutmak (ötekiler meslek ve şirket işleri). */
    organization: {
      poles: { low: 'Kayıt, hesap geri planda', high: 'Plan ve düzeni sever' },
      bands: {
        low: {
          from: { school: ['o58'], friends: ['o66'], home: ['o34', 'o90'], work: ['o18', 'o90', 'o82'] },
          student: {
            school: 'Bir proje için ayrıntılı bir zaman çizelgesi hazırlamak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla ortak bir harcamanın hesabını tutmayı başkasına bırakmayı seçebilirsin.',
            home: 'Kayıtları ve dosyaları düzenlemek yerine zamanını ilgini çeken başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Bir proje için ayrıntılı bir zaman çizelgesi hazırlamak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla ortak bir harcamanın hesabını tutmayı başkasına bırakmayı seçebilir.',
            home: 'Kayıtları ve dosyaları düzenlemek yerine zamanını ilgisini çeken başka işlere ayırabilir.',
          },
          adult: {
            work: 'Bütçe, kayıt ya da stok takibi gibi işler sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o58'], friends: ['o18'], home: ['o34'], work: ['o90'] },
          student: {
            school: 'Bir çalışma çizelgesi hazırlamak bazen hoşuna gidebilir, bazen kısa bir listeyle başlayabilirsin.',
            friends: 'Bir etkinliğin bütçesini planlamak bazen ilgini çekebilir, bazen bu işi bir arkadaşına bırakabilirsin.',
            home: 'Belgelerini bir düzene koymak bazen sana keyifli gelebilir, bazen pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Bir çalışma çizelgesi hazırlamak bazen çocuğunuzun hoşuna gidebilir, bazen kısa bir listeyle başlayabilir.',
            friends: 'Bir etkinliğin bütçesini planlamak bazen ilgisini çekebilir, bazen bu işi bir arkadaşına bırakabilir.',
            home: 'Belgelerini bir düzene koymak bazen ona keyifli gelebilir, bazen pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Bir işin kayıtlarını tutmak bazen sana uygun gelebilir, bazen bu işi başkasına bırakmak isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['o58'], friends: ['o18', 'o66'], home: ['o90'], work: ['o18', 'o90', 'o82'] },
          student: {
            school: 'Bir proje için zaman çizelgesi hazırlamak ve işleri sıraya koymak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla bir etkinlik düzenlerken bütçeyi planlamak ve harcamaları izlemek hoşuna gidebilir.',
            home: 'Kayıt tutarken her ayrıntıyı yazmak için uzun süre uğraşabilirsin.',
          },
          parent: {
            school: 'Bir proje için zaman çizelgesi hazırlamak ve işleri sıraya koymak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla bir etkinlik düzenlerken bütçeyi planlamak ve harcamaları izlemek hoşuna gidebilir.',
            home: 'Kayıt tutarken her ayrıntıyı yazmak için uzun süre uğraşabilir.',
          },
          adult: {
            work: 'Bir işin bütçesini, kayıtlarını ya da stoklarını takip etmek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Yardım ve Destek: o03 başkalarının yeni fikirler öğrenmesine yardım, o11 hasta insanlara bakmak, o43 yardıma ihtiyacı
       olanlara danışmanlık, o75 teselli ve destek vermek, o83 yardım etkinlikleri, o88 meslek kararına yardım (ötekiler meslek). */
    altruism: {
      poles: { low: 'Bakım, destek geri planda', high: 'Destek olmayı sever' },
      bands: {
        low: {
          from: { school: ['o03'], friends: ['o83'], home: ['o11', 'o43'], work: ['o03'] },
          student: {
            school: 'Bir arkadaşının yeni bir konuyu öğrenmesine yardım etmek sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla bir etkinlik seçerken yardım etkinlikleri yerine başka uğraşları seçebilirsin.',
            home: 'Bakım ve danışmanlık gibi işler yerine ilgini çeken başka işlere zaman ayırabilirsin.',
          },
          parent: {
            school: 'Bir arkadaşının yeni bir konuyu öğrenmesine yardım etmek çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla bir etkinlik seçerken yardım etkinlikleri yerine başka uğraşları seçebilir.',
            home: 'Bakım ve danışmanlık gibi işler yerine ilgisini çeken başka işlere zaman ayırabilir.',
          },
          adult: {
            work: 'İş yerinde birine yeni bir şey öğretmek sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o03'], friends: ['o83'], home: ['o88'], work: ['o75'] },
          student: {
            school: 'Bir arkadaşına bir konuyu öğretmek bazen hoşuna gidebilir, bazen kendi işine dönmeyi seçebilirsin.',
            friends: 'Arkadaşlarınla bir yardım etkinliğine bazen katılmak isteyebilir, bazen başka bir uğraşı seçebilirsin.',
            home: 'Bir yakınının bir karar vermesine yardım etmek bazen ilgini çekebilir, bazen çekmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir arkadaşına bir konuyu öğretmekten bazen hoşlanabilir, bazen kendi işine dönmeyi seçebilir.',
            friends: 'Arkadaşlarıyla bir yardım etkinliğine bazen katılmak isteyebilir, bazen başka bir uğraşı seçebilir.',
            home: 'Bir yakınının bir karar vermesine yardım etmek bazen ilgisini çekebilir, bazen çekmeyebilir.',
          },
          adult: {
            work: 'Bir işte insanlara destek olmak bazen sana anlamlı gelebilir, bazen başka görevleri seçebilirsin.',
          },
        },
        high: {
          from: { school: ['o03'], friends: ['o75'], home: ['o11'], work: ['o43', 'o75', 'o03'] },
          student: {
            school: 'Bir arkadaşının yeni bir konuyu öğrenmesine yardım etmek sana anlamlı gelebilir.',
            friends: 'Zor bir gün geçiren bir arkadaşına teselli ve destek vermek sana önemli gelebilir.',
            home: 'Birinin bakımına yardım ederken kendi işlerine zaman ayırmayı unutabilirsin.',
          },
          parent: {
            school: 'Bir arkadaşının yeni bir konuyu öğrenmesine yardım etmek çocuğunuza anlamlı gelebilir.',
            friends: 'Zor bir gün geçiren bir arkadaşına teselli ve destek vermek ona önemli gelebilir.',
            home: 'Birinin bakımına yardım ederken kendi işlerine zaman ayırmayı unutabilir.',
          },
          adult: {
            work: 'Bir işte insanlara destek olmak ya da onlara yol göstermek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Sanat ve Yaratıcılık: o04 sanat eseri, o20 dans, o28 öykü ya da roman yazmak, o44 dekorasyonu yenilemek, o60 şarkı
       söylemek, o68 oyunculuk, o84 tiyatroda rol, o85 internet sayfası tasarlamak, o89 şarkı yazmak, o92 resim ya da çizim. */
    creativity: {
      poles: { low: 'Sanat işleri geri planda', high: 'Yaratıcı işleri sever' },
      bands: {
        low: {
          from: { school: ['o92', 'o84'], friends: ['o89', 'o68'], home: ['o44'], work: ['o85'] },
          student: {
            school: 'Derste resim yapmak ya da bir oyunda rol almak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla şarkı yazmak ya da bir gösteri hazırlamak yerine başka uğraşları seçebilirsin.',
            home: 'Bir odanın düzenini değiştirmek yerine zamanını başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Derste resim yapmak ya da bir oyunda rol almak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla şarkı yazmak ya da bir gösteri hazırlamak yerine başka uğraşları seçebilir.',
            home: 'Bir odanın düzenini değiştirmek yerine zamanını başka işlere ayırabilir.',
          },
          adult: {
            work: 'Bir internet sayfası tasarlamak gibi işler sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o92', 'o28'], friends: ['o84'], home: ['o44'], work: ['o85'] },
          student: {
            school: 'Bir resim ya da öykü çalışması bazen hoşuna gidebilir, bazen başka bir görevi seçebilirsin.',
            friends: 'Arkadaşlarınla bir oyun sahnelemek bazen ilgini çekebilir, bazen çekmeyebilir.',
            home: 'Bir odayı yeniden düzenleme fikri bazen sana keyifli gelebilir, bazen pek önemli gelmeyebilir.',
          },
          parent: {
            school: 'Bir resim ya da öykü çalışması bazen çocuğunuzun hoşuna gidebilir, bazen başka bir görevi seçebilir.',
            friends: 'Arkadaşlarıyla bir oyun sahnelemek bazen ilgisini çekebilir, bazen çekmeyebilir.',
            home: 'Bir odayı yeniden düzenleme fikri bazen ona keyifli gelebilir, bazen pek önemli gelmeyebilir.',
          },
          adult: {
            work: 'Bir internet sayfasının görünüşüyle uğraşmak bazen sana keyifli gelebilir, bazen başka işleri seçebilirsin.',
          },
        },
        high: {
          from: { school: ['o84', 'o60'], friends: ['o89', 'o20', 'o92'], home: ['o92', 'o28'], work: ['o85', 'o28'] },
          student: {
            school: 'Bir tiyatro oyununda rol almak ya da şarkı söylemek sana çok keyifli gelebilir.',
            friends: 'Arkadaşlarınla şarkı yazmak, dans etmek ya da bir şeyler çizmek hoşuna gidebilir.',
            home: 'Bir resim ya da öykü üzerinde çalışırken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Bir tiyatro oyununda rol almak ya da şarkı söylemek çocuğunuza çok keyifli gelebilir.',
            friends: 'Arkadaşlarıyla şarkı yazmak, dans etmek ya da bir şeyler çizmek hoşuna gidebilir.',
            home: 'Bir resim ya da öykü üzerinde çalışırken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Bir işte bir sayfa tasarlamak ya da bir metin yazmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Bilim ve Analiz: o13 laboratuvar deneyi tasarlamak, o29 bilimsel kavramları açıklamak, o45 tıp araştırması, o61
       karmaşık bulmacalar, o69 bilgisayar programı geliştirmek, o77 istatistik (ötekiler meslek). */
    analysis: {
      poles: { low: 'Bilim işleri geri planda', high: 'Araştırıp çözmeyi sever' },
      bands: {
        low: {
          from: { school: ['o13'], friends: ['o61'], home: ['o69'], work: ['o77', 'o13'] },
          student: {
            school: 'Derste bir deney tasarlamak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla karmaşık bir bulmaca çözmek yerine başka bir oyunu seçebilirsin.',
            home: 'Bir bilgisayar programı yazmak yerine boş zamanını sevdiğin başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Derste bir deney tasarlamak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla karmaşık bir bulmaca çözmek yerine başka bir oyunu seçebilir.',
            home: 'Bir bilgisayar programı yazmak yerine boş zamanını sevdiği başka işlere ayırabilir.',
          },
          adult: {
            work: 'Verilerle ya da deneylerle uğraşılan işler sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o13'], friends: ['o61'], home: ['o29'], work: ['o77'] },
          student: {
            school: 'Bazı deneyler ilgini çekebilir, bazıları sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla zor bir bulmaca çözmek bazen keyifli gelebilir, bazen başka bir oyunu seçebilirsin.',
            home: 'Bilimsel bir konuyu birine açıklamak bazen hoşuna gidebilir, bazen bunu başkasına bırakabilirsin.',
          },
          parent: {
            school: 'Bazı deneyler çocuğunuzun ilgisini çekebilir, bazıları ona pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla zor bir bulmaca çözmek bazen keyifli gelebilir, bazen başka bir oyunu seçebilir.',
            home: 'Bilimsel bir konuyu birine açıklamak bazen hoşuna gidebilir, bazen bunu başkasına bırakabilir.',
          },
          adult: {
            work: 'Bir işte verileri incelemek bazen ilgini çekebilir, bazen başka görevleri seçebilirsin.',
          },
        },
        high: {
          from: { school: ['o13', 'o29'], friends: ['o61'], home: ['o69', 'o61'], work: ['o77', 'o69', 'o13'] },
          student: {
            school: 'Bir deney tasarlamak ya da bilimsel bir kavramı arkadaşlarına açıklamak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla karmaşık bir bulmacayı çözmeye uğraşmak hoşuna gidebilir.',
            home: 'Bir program ya da bulmaca üzerinde çalışırken saatlerin nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Bir deney tasarlamak ya da bilimsel bir kavramı arkadaşlarına açıklamak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla karmaşık bir bulmacayı çözmeye uğraşmak hoşuna gidebilir.',
            home: 'Bir program ya da bulmaca üzerinde çalışırken saatlerin nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Bir işte verileri incelemek, bir program geliştirmek ya da bir deney tasarlamak sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Doğa ve Üretim: o22 bina yapmak, o30 orman, o38 bitki yetiştirmek, o46 doğa yürüyüşü, o54 ahşap işleri, o62 çiçek
       yetiştirmek, o78 alet ve makinelerle çalışmak (o06, o14, o70 hayvan, çiftçilik ve araç tamiri: kullanılmadı). */
    production: {
      poles: { low: 'Elle işler geri planda', high: 'Doğayı, el işlerini sever' },
      bands: {
        low: {
          from: { school: ['o54', 'o78'], friends: ['o46'], home: ['o38', 'o62'], work: ['o78', 'o38'] },
          student: {
            school: 'Bir proje için ahşapla ya da aletlerle bir şey yapmak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşların bir doğa yürüyüşü önerince başka bir etkinliği seçebilirsin.',
            home: 'Bitki ya da çiçek yetiştirmek yerine zamanını ilgini çeken başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Bir proje için ahşapla ya da aletlerle bir şey yapmak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşları bir doğa yürüyüşü önerince başka bir etkinliği seçebilir.',
            home: 'Bitki ya da çiçek yetiştirmek yerine zamanını ilgisini çeken başka işlere ayırabilir.',
          },
          adult: {
            work: 'Alet ve makinelerle ya da toprakla yapılan işler sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o54', 'o78'], friends: ['o46'], home: ['o62'], work: ['o78'] },
          student: {
            school: 'Ahşapla ya da aletlerle yapılan bir iş bazen ilgini çekebilir, bazen başka bir görevi seçebilirsin.',
            friends: 'Arkadaşlarınla bir doğa yürüyüşüne bazen katılmak isteyebilir, bazen başka bir planı seçebilirsin.',
            home: 'Bir saksıda çiçek yetiştirmek bazen sana keyifli gelebilir, bazen pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Ahşapla ya da aletlerle yapılan bir iş bazen çocuğunuzun ilgisini çekebilir, bazen başka bir görevi seçebilir.',
            friends: 'Arkadaşlarıyla bir doğa yürüyüşüne bazen katılmak isteyebilir, bazen başka bir planı seçebilir.',
            home: 'Bir saksıda çiçek yetiştirmek bazen ona keyifli gelebilir, bazen pek çekici gelmeyebilir.',
          },
          adult: {
            work: 'Bir aletle ya da makineyle çalışmak bazen hoşuna gidebilir, bazen başka işleri seçebilirsin.',
          },
        },
        high: {
          from: { school: ['o54', 'o78'], friends: ['o46'], home: ['o38', 'o54'], work: ['o78', 'o30'] },
          student: {
            school: 'Bir proje için ahşaptan bir şey yapmak ya da aletlerle çalışmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla doğa yürüyüşüne çıkmak hoşuna gidebilir.',
            home: 'Bir bitkiyle ya da ahşap bir işle uğraşırken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Bir proje için ahşaptan bir şey yapmak ya da aletlerle çalışmak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla doğa yürüyüşüne çıkmak hoşuna gidebilir.',
            home: 'Bir bitkiyle ya da ahşap bir işle uğraşırken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Doğada ya da aletlerle yapılan somut işler sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Macera ve Hareket: o15 heyecan verici maceralar, o23 vahşi doğada hayatta kalmak, o39 fiziksel tehlike, o55 spor
       yarışmaları, o63 ekstrem sporlar (ötekiler meslek). */
    adventure: {
      poles: { low: 'Sakin uğraşları seçer', high: 'Heyecanı, hareketi sever' },
      bands: {
        low: {
          from: { school: ['o55'], friends: ['o15', 'o63'], home: ['o39', 'o15'], work: ['o39'] },
          student: {
            school: 'Bir spor yarışmasına katılmak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşların heyecanlı ya da riskli bir etkinlik önerince daha sakin bir plan seçebilirsin.',
            home: 'Tehlike içeren maceralar yerine sakin uğraşlarla vakit geçirmek sana iyi gelebilir.',
          },
          parent: {
            school: 'Bir spor yarışmasına katılmak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşları heyecanlı ya da riskli bir etkinlik önerince daha sakin bir plan seçebilir.',
            home: 'Tehlike içeren maceralar yerine sakin uğraşlarla vakit geçirmek ona iyi gelebilir.',
          },
          adult: {
            work: 'Fiziksel risk içeren işler sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o55'], friends: ['o15'], home: ['o63'], work: ['o15'] },
          student: {
            school: 'Bir spor yarışmasına bazen katılmak isteyebilir, bazen izlemeyi seçebilirsin.',
            friends: 'Arkadaşlarınla heyecanlı bir etkinlik bazen keyifli gelebilir, bazen sakin bir planı seçebilirsin.',
            home: 'Dağcılık gibi sporlar bazen ilgini çekebilir, bazen sana fazla riskli gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir spor yarışmasına bazen katılmak isteyebilir, bazen izlemeyi seçebilir.',
            friends: 'Arkadaşlarıyla heyecanlı bir etkinlik bazen keyifli gelebilir, bazen sakin bir planı seçebilir.',
            home: 'Dağcılık gibi sporlar bazen ilgisini çekebilir, bazen ona fazla riskli gelebilir.',
          },
          adult: {
            work: 'Bir işte heyecan ve hareket bazen sana keyifli gelebilir, bazen sakin bir çalışmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['o55'], friends: ['o63', 'o15'], home: ['o15'], work: ['o15', 'o39'] },
          student: {
            school: 'Bir spor yarışmasına katılmak sana heyecan verici gelebilir.',
            friends: 'Arkadaşlarınla dağcılık gibi heyecanlı bir etkinlik denemek hoşuna gidebilir.',
            home: 'Uzun süre hareketsiz kalınca canın sıkılabilir.',
          },
          parent: {
            school: 'Bir spor yarışmasına katılmak çocuğunuza heyecan verici gelebilir.',
            friends: 'Arkadaşlarıyla dağcılık gibi heyecanlı bir etkinlik denemek hoşuna gidebilir.',
            home: 'Uzun süre hareketsiz kalınca canı sıkılabilir.',
          },
          adult: {
            work: 'Hareket, heyecan ve biraz risk içeren işler sana canlandırıcı gelebilir.',
          },
        },
      },
    },
    /* Dil ve Edebiyat: o08 çeviri, o32 kelime bulmacaları hazırlamak, o40 gazete editörlüğü, o48 birçok dil bilmek, o64 her
       konuda akıcı konuşabilmek, o72 çok sayıda kitap okumak, o80 günlük tutmak (o56 kullanılmadı: yurt dışı). */
    erudition: {
      poles: { low: 'Okuma, yazma geri planda', high: 'Okumayı, dilleri sever' },
      bands: {
        low: {
          from: { school: ['o48', 'o72'], friends: ['o32'], home: ['o80'], work: ['o08', 'o40'] },
          student: {
            school: 'Yeni bir dil öğrenmek ya da çok sayıda kitap okumak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla kelime oyunları yerine başka oyunları seçebilirsin.',
            home: 'Günlük tutmak yerine zamanını ilgini çeken başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Yeni bir dil öğrenmek ya da çok sayıda kitap okumak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla kelime oyunları yerine başka oyunları seçebilir.',
            home: 'Günlük tutmak yerine zamanını ilgisini çeken başka işlere ayırabilir.',
          },
          adult: {
            work: 'Çeviri, yazı ya da metin düzeltme işleri sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['o72'], friends: ['o32'], home: ['o80'], work: ['o40'] },
          student: {
            school: 'Bir kitabı bazen keyifle okuyabilir, bazen yalnızca gerekeni okumayı seçebilirsin.',
            friends: 'Arkadaşlarınla kelime oyunları bazen hoşuna gidebilir, bazen başka oyunları seçebilirsin.',
            home: 'Günlük tutmak bazen sana iyi gelebilir, bazen uzun süre ara verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir kitabı bazen keyifle okuyabilir, bazen yalnızca gerekeni okumayı seçebilir.',
            friends: 'Arkadaşlarıyla kelime oyunları bazen hoşuna gidebilir, bazen başka oyunları seçebilir.',
            home: 'Günlük tutmak bazen ona iyi gelebilir, bazen uzun süre ara verebilir.',
          },
          adult: {
            work: 'Bir metni yazmak ya da düzeltmek bazen sana keyifli gelebilir, bazen bu işi başkasına bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['o48', 'o72'], friends: ['o32', 'o64'], home: ['o72'], work: ['o08', 'o40'] },
          student: {
            school: 'Yeni bir dil öğrenmek ya da çok sayıda kitap okumak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla kelime bulmacaları hazırlamak ya da bir konuyu uzun uzun konuşmak hoşuna gidebilir.',
            home: 'Bir kitaba dalınca zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Yeni bir dil öğrenmek ya da çok sayıda kitap okumak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla kelime bulmacaları hazırlamak ya da bir konuyu uzun uzun konuşmak hoşuna gidebilir.',
            home: 'Bir kitaba dalınca zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Bir metni çevirmek, yazmak ya da düzenlemek sana keyifli gelebilir.',
          },
        },
      },
    },
  },
};
