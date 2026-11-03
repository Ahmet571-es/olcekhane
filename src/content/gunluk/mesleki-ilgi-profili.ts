import type { SurveyDaily } from './types';

/**
 * Mesleki İlgi Profili: günlük hayatta nasıl görünür (8. sınıftan mezuna; yetişkinlere açık değil). Ton: özellik (ilgi; iki uç
 * da eşit; lib/reports/daily-parts.ts). Maddeler bir etkinlikten ne kadar hoşlanılacağını sorar (src/content/instruments/
 * mesleki-ilgi.ts): örnekler bir etkinliğin çekici gelip gelmeyeceğini anlatır, yapabilmeyi ya da bir mesleği değil ("İlgi,
 * yetenek demek değildir"). Düşük ilgi bir eksiklik gibi anlatılmaz: bu tür işler pek çekici gelmeyebilir, zaman başka işlere
 * ayrılabilir. Etkinlikler sahip olmaya bağlanmaz (bahçe, araç, alet, müzik aleti yok); "Gerçekçi" ya da "Sosyal" gibi alanlar
 * hiçbir cinsiyetle eşleştirilmez. Okul satırı sınava hazırlanan bir mezun için de anlamlıdır (ders, proje, bir etkinlik).
 * Her satırın dayandığı maddeler `from`'dadır.
 * Maddeye doğrudan dayanmayan tek uzantı (merak.ts'teki gibi): yüksek ilgide sevilen işle uğraşırken zamanın nasıl geçtiğinin
 * fark edilmeyebileceği, başka işlerin bekleyebileceği (ilginin yumuşak bedeli olarak).
 * Maddeler: R1 tamir, R2 mobilya ya da maket birleştirmek, R3 fide dikmek, R4 bisiklet ya da motorun nasıl çalıştığını
 * kurcalamak, R5 tahtadan, metalden, kumaştan bir şey yapmak, R6 kamp, yön bulmak, R7 robot ya da devre kurmak, R8 araç bakımı;
 * I1 deney tasarlamak, I2 zor bir problem üzerinde uzun süre düşünmek, I3 hastalıkların yayılması, I4 mikroskop, I5 uzay ve
 * yıldızlar, I6 bir programdaki hatayı bulmak, I7 kaynakları karşılaştırıp bilginin doğruluğunu araştırmak, I8 tablodaki
 * verilerde örüntü; A1 resim, çizim, A2 öykü, şiir, senaryo, A3 müzik aleti, beste, A4 tiyatroda ya da kısa filmde rol, A5
 * afiş, logo, internet sayfası tasarlamak, A6 fotoğraf, A7 oda dekorasyonu, A8 kıyafet, aksesuar tasarımı; S1 arkadaşına bir
 * konuyu anlatmak, S2 küçük çocuklarla oyun, S3 yardım kampanyasında gönüllü, S4 üzgün bir arkadaşı dinlemek, S5 yaşlı ya da
 * hasta birinin bakımına yardım, S6 anlaşmazlığın çözülmesine yardım, S7 yeni gelen birinin alışmasına yardım, S8 sağlıklı
 * yaşam bilgisi vermek; E1 etkinlik düzenlemek, E2 grubun liderliği, E3 ürettiğini satmak, E4 tartışmada ikna, E5 küçük bir
 * iş için plan, E6 seçimde aday olmak, E7 satış planı, E8 toplantı yönetmek; C1 bütçe ve harcama takibi, C2 dosya, belge,
 * fotoğraf düzenlemek, C3 hesap tablosuna veri girmek, C4 yazım ve noktalama hatalarını düzeltmek, C5 kitapları sınıflandırmak,
 * C6 ayrıntılı plan ve takvim, C7 sayım ve kayıt, C8 bir formun eksiksiz doldurulduğunu kontrol etmek.
 */
export const meslekiIlgiDaily: SurveyDaily = {
  kind: 'survey',
  version: 'mesleki-ilgi-profili-gunluk-1',
  scales: {
    realistic: {
      poles: { low: 'Yapım işleri geri planda', high: 'Elle yapıp kurmayı sever' },
      bands: {
        low: {
          from: { school: ['R2', 'R7'], friends: ['R6'], home: ['R1'] },
          student: {
            school: 'Derste bir maket ya da devre kurmak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla açık havada çadır kurmak ya da yön bulmak yerine başka etkinlikleri seçebilirsin.',
            home: 'Bozulan bir eşyayı kurcalamak yerine zamanını ilgini çeken başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Derste bir maket ya da devre kurmak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla açık havada çadır kurmak ya da yön bulmak yerine başka etkinlikleri seçebilir.',
            home: 'Bozulan bir eşyayı kurcalamak yerine zamanını ilgisini çeken başka işlere ayırabilir.',
          },
        },
        average: {
          from: { school: ['R2', 'R7'], friends: ['R6'], home: ['R1'] },
          student: {
            school: 'Bir maket ya da devre kurmak bazen ilgini çekebilir, bazen başka işleri seçebilirsin.',
            friends: 'Arkadaşlarınla açık havada yön bulmak gibi işler bazen hoşuna gidebilir, bazen gitmeyebilir.',
            home: 'Bozulan bir eşyayı bazen kendin kurcalamak isteyebilir, bazen onu başkasına bırakabilirsin.',
          },
          parent: {
            school: 'Bir maket ya da devre kurmak bazen çocuğunuzun ilgisini çekebilir, bazen başka işleri seçebilir.',
            friends: 'Arkadaşlarıyla açık havada yön bulmak gibi işler bazen hoşuna gidebilir, bazen gitmeyebilir.',
            home: 'Bozulan bir eşyayı bazen kendisi kurcalamak isteyebilir, bazen onu başkasına bırakabilir.',
          },
        },
        high: {
          from: { school: ['R2', 'R7'], friends: ['R5'], home: ['R4', 'R1'] },
          student: {
            school: 'Derste bir maket, robot ya da devre kurmak sana çok keyifli gelebilir.',
            friends: 'Arkadaşlarınla tahtadan ya da kumaştan bir şey yapmak hoşuna gidebilir.',
            home: 'Bir şeyin nasıl çalıştığını söküp kurcalarken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Derste bir maket, robot ya da devre kurmak çocuğunuza çok keyifli gelebilir.',
            friends: 'Arkadaşlarıyla tahtadan ya da kumaştan bir şey yapmak hoşuna gidebilir.',
            home: 'Bir şeyin nasıl çalıştığını söküp kurcalarken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
        },
      },
    },
    investigative: {
      poles: { low: 'Araştırma geri planda', high: 'Araştırıp çözmeyi sever' },
      bands: {
        low: {
          from: { school: ['I2', 'I1'], friends: ['I5'], home: ['I8'] },
          student: {
            school: 'Bir problem üzerinde uzun süre düşünmek ya da deney tasarlamak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla uzay ya da yıldızlar üzerine uzun sohbetler sana pek ilginç gelmeyebilir.',
            home: 'Bir tablodaki sayılarla uğraşmak yerine boş zamanını sevdiğin başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Bir problem üzerinde uzun süre düşünmek ya da deney tasarlamak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla uzay ya da yıldızlar üzerine uzun sohbetler ona pek ilginç gelmeyebilir.',
            home: 'Bir tablodaki sayılarla uğraşmak yerine boş zamanını sevdiği başka işlere ayırabilir.',
          },
        },
        average: {
          from: { school: ['I1', 'I2'], friends: ['I5'], home: ['I7'] },
          student: {
            school: 'Bazı deneyler ve problemler ilgini çekebilir, bazıları sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla uzay ya da bilim konuşmak bazen keyifli gelebilir, bazen başka konuları seçebilirsin.',
            home: 'Duyduğun bir bilginin doğru olup olmadığını bazen araştırabilir, bazen üzerinde durmayabilirsin.',
          },
          parent: {
            school: 'Bazı deneyler ve problemler çocuğunuzun ilgisini çekebilir, bazıları ona pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla uzay ya da bilim konuşmak bazen keyifli gelebilir, bazen başka konuları seçebilir.',
            home: 'Duyduğu bir bilginin doğru olup olmadığını bazen araştırabilir, bazen üzerinde durmayabilir.',
          },
        },
        high: {
          from: { school: ['I1', 'I4'], friends: ['I5', 'I3'], home: ['I2'] },
          student: {
            school: 'Derste bir deney tasarlamak ya da mikroskopla bir şey incelemek sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla gezegenler ya da hastalıkların nasıl yayıldığı üzerine konuşmak hoşuna gidebilir.',
            home: 'Zor bir problemle uğraşırken saatlerin nasıl geçtiğini fark etmeyebilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Derste bir deney tasarlamak ya da mikroskopla bir şey incelemek çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla gezegenler ya da hastalıkların nasıl yayıldığı üzerine konuşmak hoşuna gidebilir.',
            home: 'Zor bir problemle uğraşırken saatlerin nasıl geçtiğini fark etmeyebilir; başka işler bekleyebilir.',
          },
        },
      },
    },
    artistic: {
      poles: { low: 'Sanat işleri geri planda', high: 'Yaratıp tasarlamayı sever' },
      bands: {
        low: {
          from: { school: ['A5', 'A4'], friends: ['A1', 'A2'], home: ['A2'] },
          student: {
            school: 'Bir afiş tasarlamak ya da bir oyunda rol almak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla bir şey yaparken çizmek ya da yazmak yerine başka uğraşları seçebilirsin.',
            home: 'Öykü ya da şiir yazmak yerine boş zamanını ilgini çeken başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Bir afiş tasarlamak ya da bir oyunda rol almak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla bir şey yaparken çizmek ya da yazmak yerine başka uğraşları seçebilir.',
            home: 'Öykü ya da şiir yazmak yerine boş zamanını ilgisini çeken başka işlere ayırabilir.',
          },
        },
        average: {
          from: { school: ['A5'], friends: ['A4'], home: ['A1', 'A6'] },
          student: {
            school: 'Bir afiş tasarlamak bazen hoşuna gidebilir, bazen başka bir görevi seçebilirsin.',
            friends: 'Arkadaşlarınla bir kısa film ya da oyun hazırlamak bazen ilgini çekebilir, bazen çekmeyebilir.',
            home: 'Resim yapmak ya da fotoğraf çekmek bazı günler sana keyifli gelebilir, bazı günler gelmeyebilir.',
          },
          parent: {
            school: 'Bir afiş tasarlamak bazen çocuğunuzun hoşuna gidebilir, bazen başka bir görevi seçebilir.',
            friends: 'Arkadaşlarıyla bir kısa film ya da oyun hazırlamak bazen ilgisini çekebilir, bazen çekmeyebilir.',
            home: 'Resim yapmak ya da fotoğraf çekmek bazı günler ona keyifli gelebilir, bazı günler gelmeyebilir.',
          },
        },
        high: {
          from: { school: ['A5'], friends: ['A4', 'A3'], home: ['A1', 'A2'] },
          student: {
            school: 'Bir afiş ya da logo tasarlamak sana çok keyifli gelebilir.',
            friends: 'Arkadaşlarınla kısa bir film çekmek, şarkı yazmak ya da bir oyunda rol almak hoşuna gidebilir.',
            home: 'Bir resim ya da öykü üzerinde çalışırken başka işleri unutabilirsin.',
          },
          parent: {
            school: 'Bir afiş ya da logo tasarlamak çocuğunuza çok keyifli gelebilir.',
            friends: 'Arkadaşlarıyla kısa bir film çekmek, şarkı yazmak ya da bir oyunda rol almak hoşuna gidebilir.',
            home: 'Bir resim ya da öykü üzerinde çalışırken başka işleri unutabilir.',
          },
        },
      },
    },
    social: {
      poles: { low: 'Öğretme, bakım geri planda', high: 'Öğretmeyi, yardımı sever' },
      bands: {
        low: {
          from: { school: ['S1'], friends: ['S6'], home: ['S2'] },
          student: {
            school: 'Bir arkadaşına anlamadığı bir konuyu anlatmak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlar arasındaki bir anlaşmazlıkta arabuluculuk yapmayı başkasına bırakmayı seçebilirsin.',
            home: 'Küçük çocuklarla oyun kurmak yerine zamanını ilgini çeken başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Bir arkadaşına anlamadığı bir konuyu anlatmak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlar arasındaki bir anlaşmazlıkta arabuluculuk yapmayı başkasına bırakmayı seçebilir.',
            home: 'Küçük çocuklarla oyun kurmak yerine zamanını ilgisini çeken başka işlere ayırabilir.',
          },
        },
        average: {
          from: { school: ['S1'], friends: ['S3'], home: ['S2'] },
          student: {
            school: 'Bir arkadaşına bir konuyu bazen keyifle anlatabilir, bazen kendi işine dönmeyi seçebilirsin.',
            friends: 'Arkadaşlarının başlattığı bir yardım kampanyasına bazen katılmak isteyebilir, bazen başka bir etkinliği seçebilirsin.',
            home: 'Küçük çocuklarla oyun oynamak bazen sana keyifli gelebilir, bazen istemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir arkadaşına bir konuyu bazen keyifle anlatabilir, bazen kendi işine dönmeyi seçebilir.',
            friends: 'Arkadaşlarının başlattığı bir yardım kampanyasına bazen katılmak isteyebilir, bazen başka bir etkinliği seçebilir.',
            home: 'Küçük çocuklarla oyun oynamak bazen ona keyifli gelebilir, bazen istemeyebilir.',
          },
        },
        high: {
          from: { school: ['S7', 'S1'], friends: ['S4', 'S6'], home: ['S5'] },
          student: {
            school: 'Yeni gelen birinin alışmasına yardım etmek ya da bir arkadaşına konu anlatmak sana keyifli gelebilir.',
            friends: 'Üzgün bir arkadaşını dinlemek ya da bir anlaşmazlığın çözülmesine yardım etmek sana anlamlı gelebilir.',
            home: 'Yaşlı ya da hasta birine yardım etmek sana anlamlı gelebilir; bu bazen kendi işlerini bekletebilir.',
          },
          parent: {
            school: 'Yeni gelen birinin alışmasına yardım etmek ya da bir arkadaşına konu anlatmak çocuğunuza keyifli gelebilir.',
            friends: 'Üzgün bir arkadaşını dinlemek ya da bir anlaşmazlığın çözülmesine yardım etmek ona anlamlı gelebilir.',
            home: 'Yaşlı ya da hasta birine yardım etmek ona anlamlı gelebilir; bu bazen kendi işlerini bekletebilir.',
          },
        },
      },
    },
    enterprising: {
      poles: { low: 'Yönetme, ikna geri planda', high: 'Yönetip ikna etmeyi sever' },
      bands: {
        low: {
          from: { school: ['E6', 'E1'], friends: ['E2'], home: ['E4'] },
          student: {
            school: 'Bir seçimde aday olmak ya da bir etkinliği yönetmek sana pek çekici gelmeyebilir.',
            friends: 'Bir grup işinde yönetmeyi başkasına bırakıp kendi görevine odaklanmayı seçebilirsin.',
            home: 'Bir konuda evdekileri kendi görüşüne ikna etmeye uğraşmak sana pek keyifli gelmeyebilir.',
          },
          parent: {
            school: 'Bir seçimde aday olmak ya da bir etkinliği yönetmek çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Bir grup işinde yönetmeyi başkasına bırakıp kendi görevine odaklanmayı seçebilir.',
            home: 'Bir konuda evdekileri kendi görüşüne ikna etmeye uğraşmak ona pek keyifli gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['E1'], friends: ['E2'], home: ['E3', 'E5'] },
          student: {
            school: 'Bir etkinliği düzenlemede bazen görev almak isteyebilir, bazen yalnızca katılmayı seçebilirsin.',
            friends: 'Bir grup işinde bazen yön vermek isteyebilir, bazen başkasının yönettiği bir planla çalışabilirsin.',
            home: 'Kendi yaptığın bir şeyi satmak ya da bir iş fikri planlamak bazen ilgini çekebilir, bazen çekmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir etkinliği düzenlemede bazen görev almak isteyebilir, bazen yalnızca katılmayı seçebilir.',
            friends: 'Bir grup işinde bazen yön vermek isteyebilir, bazen başkasının yönettiği bir planla çalışabilir.',
            home: 'Kendi yaptığı bir şeyi satmak ya da bir iş fikri planlamak bazen ilgisini çekebilir, bazen çekmeyebilir.',
          },
        },
        high: {
          from: { school: ['E1', 'E6'], friends: ['E4', 'E2'], home: ['E5', 'E7'] },
          student: {
            school: 'Bir etkinliği baştan sona düzenlemek ya da bir seçimde aday olmak sana heyecan verici gelebilir.',
            friends: 'Bir tartışmada arkadaşlarını kendi görüşüne ikna etmek ya da bir grubu yönetmek sana keyifli gelebilir.',
            home: 'Bir iş fikri için plan yaparken saatlerce uğraşabilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Bir etkinliği baştan sona düzenlemek ya da bir seçimde aday olmak çocuğunuza heyecan verici gelebilir.',
            friends: 'Bir tartışmada arkadaşlarını kendi görüşüne ikna etmek ya da bir grubu yönetmek ona keyifli gelebilir.',
            home: 'Bir iş fikri için plan yaparken saatlerce uğraşabilir; başka işler bekleyebilir.',
          },
        },
      },
    },
    conventional: {
      poles: { low: 'Kayıt, düzen geri planda', high: 'Düzen kurmayı sever' },
      bands: {
        low: {
          from: { school: ['C4'], friends: ['C1'], home: ['C2'] },
          student: {
            school: 'Bir yazıdaki yazım ve noktalama hatalarını tek tek düzeltmek sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla bir etkinlik düzenlerken harcamaları tutma işini başka birine bırakabilirsin.',
            home: 'Fotoğrafları ya da belgeleri sistemli biçimde düzenlemek yerine zamanını başka işlere ayırabilirsin.',
          },
          parent: {
            school: 'Bir yazıdaki yazım ve noktalama hatalarını tek tek düzeltmek çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla bir etkinlik düzenlerken harcamaları tutma işini başka birine bırakabilir.',
            home: 'Fotoğrafları ya da belgeleri sistemli biçimde düzenlemek yerine zamanını başka işlere ayırabilir.',
          },
        },
        average: {
          from: { school: ['C6'], friends: ['C1'], home: ['C2'] },
          student: {
            school: 'Ayrıntılı bir plan ve takvim hazırlamak bazen hoşuna gidebilir, bazen kısa bir planla başlamayı seçebilirsin.',
            friends: 'Bir etkinliğin bütçesini hesaplamak bazen ilgini çekebilir, bazen bu işi bir arkadaşına bırakabilirsin.',
            home: 'Dosyaları ya da fotoğrafları düzenlemek bazı günler sana keyifli gelebilir, bazı günler pek çekici gelmeyebilir.',
          },
          parent: {
            school: 'Ayrıntılı bir plan ve takvim hazırlamak bazen çocuğunuzun hoşuna gidebilir, bazen kısa bir planla başlamayı seçebilir.',
            friends: 'Bir etkinliğin bütçesini hesaplamak bazen ilgisini çekebilir, bazen bu işi bir arkadaşına bırakabilir.',
            home: 'Dosyaları ya da fotoğrafları düzenlemek bazı günler ona keyifli gelebilir, bazı günler pek çekici gelmeyebilir.',
          },
        },
        high: {
          from: { school: ['C4', 'C8'], friends: ['C1'], home: ['C2'] },
          student: {
            school: 'Bir yazıdaki yazım hatalarını bulup düzeltmek ya da bir formu kontrol etmek sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla bir etkinlik düzenlerken bütçeyi hesaplayıp harcamaları takip etmek hoşuna gidebilir.',
            home: 'Belgeleri ya da fotoğrafları düzenlerken her şeyi yerli yerine koymak için uzun süre uğraşabilirsin.',
          },
          parent: {
            school: 'Bir yazıdaki yazım hatalarını bulup düzeltmek ya da bir formu kontrol etmek çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla bir etkinlik düzenlerken bütçeyi hesaplayıp harcamaları takip etmek hoşuna gidebilir.',
            home: 'Belgeleri ya da fotoğrafları düzenlerken her şeyi yerli yerine koymak için uzun süre uğraşabilir.',
          },
        },
      },
    },
  },
};
