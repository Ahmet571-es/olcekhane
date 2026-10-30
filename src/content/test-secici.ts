/**
 * "Hangi test bana uygun?" (site sahibinin 2026-10-30 isteği): ziyaretçi testi kimin çözeceğini (sınıf ya da yetişkin),
 * ne öğrenmek istediğini ve ne kadar vakti olduğunu seçer; sayfa ona uygun testleri sırasıyla önerir. Öneri yalnızca
 * tarayıcıda hesaplanır: seçimler hiçbir yere kaydedilmez, adrese yazılmaz, sunucuya gönderilmez.
 *
 * Her amaç (kişilik, ilgi, ...) birkaç yuvadan oluşur; her yuva bir beceriyi ya da özelliği temsil eder ve adaylarından
 * sınıfa uygun, kalan süreye sığan ilk yayındaki test seçilir (lib/test-secici.ts). Yuvaların cümleleri hem kişinin kendisi
 * hem de çocuğu için seçim yapan bir yetişkin için okunabilecek biçimde yazılır ("kendini nasıl gördüğünü") ve yetişkinlere
 * de açık testlerin yuvalarında okula özgü sözcük geçmez (tests/test-secici.test.ts denetler).
 *
 * Yayındaki her test en az bir yuvanın adayıdır: yeni bir test eklenince uygun yuvaya yazılır (test denetler).
 */

export const SECICI_PATH = '/hangi-test';
export const SECICI_NAME = 'Hangi test bana uygun?';

export type GoalKey = 'genel' | 'kisilik' | 'ilgi' | 'calisma' | 'zihinsel' | 'okuma' | 'duygular' | 'dikkat';

export interface SeciciSlot {
  /** Yuvanın kısa adı ("Uzamsal beceri"); öneri kartında testin adının üstünde. */
  skill: string;
  /** Neden öneriliyor: bir cümle (testin ne gösterdiği). */
  why: string;
  /** Sırayla denenen testler: sınıfa uygun ve kalan süreye sığan ilk yayındaki test seçilir. */
  candidates: string[];
}

export interface SeciciGoal {
  key: GoalKey;
  /** Seçenek düğmesindeki ad. */
  name: string;
  /** Düğmenin altındaki kısa açıklama. */
  hint: string;
  slots: SeciciSlot[];
}

const KISILIK: SeciciSlot = {
  skill: 'Kişilik',
  why: 'Kişiliğin beş temel boyutunda kendini nasıl gördüğünü gösterir.',
  // 3–5. sınıfta Çocuk Kişilik Profili, 6. sınıftan mezuna Beş Faktör, yetişkinde Ayrıntılı Kişilik Profili; vakit
  // azsa Hızlı Kişilik Testi (9. sınıftan yetişkine, 3 dakika).
  candidates: ['bes-faktor-kisilik', 'cocuk-kisilik-profili', 'ayrintili-kisilik-profili', 'hizli-kisilik-testi'],
};
const ILGI: SeciciSlot = {
  skill: 'İlgi alanları',
  why: 'Hangi alanlara ve işlere ilgi duyduğunu ve bu ilgilerle ilişkili alan örneklerini gösterir.',
  candidates: ['meslek-ilgi-alanlari', 'mesleki-ilgi-profili', 'hobi-ve-serbest-zaman-ilgileri'],
};
const AKIL: SeciciSlot = {
  skill: 'Akıl yürütme',
  why: 'Şekillerle ya da harflerle kurulmuş sorularda kuralı bulup uygulayabilmeyi, yani akıl yürütmeyi ölçer.',
  candidates: ['sekil-akil-yurutme', 'sekil-benzetmeleri', 'harf-dizileri'],
};
const BELLEK: SeciciSlot = {
  skill: 'Bellek',
  why: 'Gösterilen bilgiyi kısa bir süre akılda tutup kullanabilmeyi ya da öğrenip hatırlayabilmeyi ölçer.',
  candidates: ['desen-hatirlama', 'harf-sayi-siralama', 'kelime-listesi-hatirlama', 'hesapla-ve-hatirla', 'geriye-donuk-hatirlama'],
};
const CALISMA: SeciciSlot = {
  skill: 'Çalışma alışkanlıkları',
  why: 'Araştırmalarda etkisi gösterilmiş çalışma yöntemlerini ne sıklıkla kullandığını gösterir.',
  candidates: ['calisma-aliskanliklari'],
};

export const SECICI_GOALS: SeciciGoal[] = [
  {
    key: 'genel',
    name: 'Hepsinden biraz',
    hint: 'Kişilik, ilgi, çalışma ve zihinsel becerilerden birer test; uygunsa hepsi bir arada paket.',
    slots: [KISILIK, ILGI, AKIL, CALISMA, BELLEK],
  },
  {
    key: 'kisilik',
    name: 'Kişilik',
    hint: 'Nasıl biri olduğunu, insanlarla ilişkilerini.',
    slots: [
      KISILIK,
      {
        skill: 'İnsan ilişkileri',
        why: 'İnsanlarla ilişkilerdeki tarzı bir çember üzerinde gösterir: öne çıkan ya da geri planda kalan, sıcak ya da mesafeli.',
        candidates: ['kisilerarasi-tarz'],
      },
      {
        skill: 'Kişiliğin ayrıntıları',
        why: 'Kişiliği daha çok özellikle, ayrıntılı biçimde gösterir.',
        candidates: ['kisiligin-10-yonu', '16-faktorlu-kisilik-profili', 'alti-boyutlu-kisilik-profili'],
      },
      {
        skill: 'Heyecan arayışı',
        why: 'Yeni ve heyecanlı deneyimlere ne kadar ilgi duyduğunu üç yönde gösterir.',
        candidates: ['heyecan-arayisi'],
      },
    ],
  },
  {
    key: 'ilgi',
    name: 'İlgi alanları ve meslek yönü',
    hint: 'Hangi alanlardan hoşlandığını, bir işte neye önem verdiğini.',
    slots: [
      ILGI,
      {
        skill: 'Çalışma değerleri',
        why: 'Bir işte neye önem verdiğini sıralar: kazanç, güvence, öğrenme, insanlara yardım gibi.',
        candidates: ['calisma-degerleri'],
      },
      {
        skill: 'Serbest zaman ilgileri',
        why: 'Boş zamanını hangi etkinliklere ayırdığını 16 alanda gösterir.',
        candidates: ['hobi-ve-serbest-zaman-ilgileri'],
      },
    ],
  },
  {
    key: 'calisma',
    name: 'Öğrenme ve çalışma',
    hint: 'Nasıl çalıştığını, neden çalıştığını, erteleme ve zaman.',
    slots: [
      CALISMA,
      {
        skill: 'Erteleme ve zaman',
        why: 'İşleri ne kadar ertelediğini ve zamanını nasıl yönettiğini gösterir.',
        candidates: ['erteleme-ve-zaman-yonetimi'],
      },
      {
        skill: 'Motivasyon',
        why: 'Neden ders çalıştığını gösterir: merak ve istekle mi, baskıyla mı?',
        candidates: ['ders-calisma-motivasyonu'],
      },
      {
        skill: 'Öğrenme inançları',
        why: 'Zekâ, çaba, hata ve zorluk hakkında neye inandığını gösterir.',
        candidates: ['zihniyet'],
      },
      {
        skill: 'Öğrenmeyle ilişkili özellikler',
        why: 'Çaba ve sebat, planlı çalışma, düşünmekten hoşlanma ve öğrenmeye açıklık gibi özellikleri gösterir.',
        candidates: ['ogrenme-ve-basari-ozellikleri', 'dusunme-ve-calisma-tarzi', 'dusunmeyi-sevme-olcegi'],
      },
      {
        skill: 'Matematik',
        why: 'Bir önceki sınıfın temel matematik konularında neyin sağlam, neyin eksik olduğunu gösterir.',
        candidates: ['matematik-konu-tarama-testi'],
      },
    ],
  },
  {
    key: 'zihinsel',
    name: 'Zihinsel güçlü yanlar',
    hint: 'Akıl yürütme, sözel, uzamsal, bellek ve sayısal beceriler; zekâ puanı yok.',
    slots: [
      AKIL,
      {
        skill: 'Sözel beceri',
        why: 'Kelimelerin anlamını bilmeyi ya da sözcüklerle akıl yürütebilmeyi ölçer.',
        candidates: ['kelime-bilgisi', 'sozel-akil-yurutme'],
      },
      {
        skill: 'Uzamsal beceri',
        why: 'Şekilleri zihinde canlandırıp döndürebilmeyi ve parçayı bütünün içinde görebilmeyi ölçer.',
        candidates: ['kagit-katlama', 'zihinde-dondurme', 'kup-acinimi', 'uc-boyutlu-zihinde-dondurme', 'bakis-acisi-alma', 'gizli-sekiller'],
      },
      BELLEK,
      {
        skill: 'Sayısal beceri',
        why: 'Sayılar arasındaki kuralı ve ilişkiyi bulabilmeyi ölçer.',
        candidates: ['sayi-dizileri', 'sayisal-akil-yurutme', 'zihinden-hesaplama-hizi'],
      },
      {
        skill: 'Planlama ve karar verme',
        why: 'Adımları önceden düşünerek plan yapabilmeyi ya da verilen bilgiden kesin sonucu çıkarabilmeyi ölçer.',
        candidates: ['planlama-kule-gorevi', 'mantiksal-akil-yurutme', 'dusunerek-karar-verme'],
      },
    ],
  },
  {
    key: 'okuma',
    name: 'Okuma',
    hint: 'Doğru ve akıcı okuma, okuma hızı, anlama ve kelime bilgisi.',
    slots: [
      {
        skill: 'Sesli okuma',
        why: 'Sınıfına uygun bir metni sesli okuma: doğru okuma, hız, akıcılık ve anlama birlikte değerlendirilir.',
        candidates: ['sesli-okuma-degerlendirmesi'],
      },
      {
        skill: 'Okuma hızı ve anlama',
        why: 'Sınıfına uygun bir metni ne kadar hızlı okuyup ne kadarını anladığını birlikte ölçer.',
        candidates: ['okuma-hizi-ve-anlama'],
      },
      {
        skill: 'Kelime bilgisi',
        why: 'Türkçe kelimelerin ve deyimlerin anlamlarını ne kadar bildiğini ölçer.',
        candidates: ['kelime-bilgisi'],
      },
    ],
  },
  {
    key: 'duygular',
    name: 'Duygular ve ilişkiler',
    hint: 'Kendine bakış, kendine güven, empati, iyimserlik.',
    slots: [
      {
        skill: 'Kendine bakış',
        why: 'Kendine genel olarak nasıl baktığını gösterir.',
        candidates: ['oz-saygi'],
      },
      {
        skill: 'Kendine güven',
        why: 'Kendine güveni üç alanda gösterir: işlerde, insanlar arasında ve zor anlarda.',
        candidates: ['oz-yeterlik'],
      },
      {
        skill: 'Empati',
        why: 'Başkalarını düşünmeyi, duygusal duyarlılığı ve destek olmayı gösterir.',
        candidates: ['empati'],
      },
      {
        skill: 'Duygular',
        why: 'Duyguları fark etme ve gösterme, karar verirken duygulara kulak verme gibi eğilimleri gösterir.',
        candidates: ['duygusal-zeka-bilesenleri'],
      },
      {
        skill: 'İyimserlik',
        why: 'Geleceğe, hayata ve kendine ne kadar umutla baktığını gösterir.',
        candidates: ['iyimserlik'],
      },
    ],
  },
  {
    key: 'dikkat',
    name: 'Dikkat ve kendini yönetme',
    hint: 'Dikkati sürdürme, durabilme, kurallar arasında geçiş, hız.',
    slots: [
      {
        skill: 'Dikkat',
        why: 'Dikkati uzun süre sürdürebilmeyi ve dikkatli çalışmayı ölçer.',
        candidates: ['surekli-dikkat', 'dikkat-ve-bellek'],
      },
      {
        skill: 'Durabilme',
        why: 'Alışkanlıkla gelen tepkiyi durdurup doğru tepkiyi verebilmeyi ölçer.',
        candidates: ['dur-git-gorevi', 'renk-kelime-gorevi'],
      },
      {
        skill: 'Esneklik',
        why: 'Bir kuraldan ötekine geçebilmeyi ve işler arasında hızla geçiş yapabilmeyi ölçer.',
        candidates: ['kural-degistirme', 'sirayla-birlestirme-gorevi'],
      },
      {
        skill: 'Öz-denetim',
        why: 'Düşünerek davranmayı, işe koyulmayı ve isteklere karşı kendini tutabilmeyi gösterir.',
        candidates: ['oz-denetim'],
      },
      {
        skill: 'Tepki hızı',
        why: 'Ekranda beliren şeylere ne kadar hızlı tepki verebildiğini ölçer.',
        candidates: ['tepki-hizi'],
      },
    ],
  },
];

/** Vakit seçenekleri (dakika): öneriler toplamı bu süreyi geçmeyecek biçimde seçilir. */
export const SECICI_TIMES: { minutes: number; label: string }[] = [
  { minutes: 15, label: 'Yaklaşık 15 dakika' },
  { minutes: 30, label: 'Yaklaşık yarım saat' },
  { minutes: 60, label: 'Bir saat ya da daha çok' },
];

/** En çok bu kadar test önerilir (uzun bir listeden seçmek zorlaşmasın). */
export const SECICI_MAX_TESTS = 5;
