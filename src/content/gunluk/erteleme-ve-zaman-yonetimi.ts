import type { SurveyDaily } from './types';

/**
 * Erteleme ve Zaman Yönetimi: günlük hayatta nasıl görünür (6. sınıftan yetişkine). Ton: gelişim (şablon
 * değerlendiricidir; lib/reports/daily-parts.ts, `scaleTone`): örnekler bugün ne sıklıkla olduğunu anlatır; düşük uca
 * uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz; hiçbir örnek suçlamaz ("tembel" yok), bir gelişme sözü
 * vermez. Uçlarda düşük uç "Henüz" diye başlar. Rapor metinlerindeki araştırma bulguları ve öneriler (ilk beş dakika,
 * telefonu başka odaya koymak, yapılacaklar listesi, rehber öğretmen) örneklere taşınmadı.
 *
 * Maddeler okula özgü değildir ("iş" kişinin sorumluluğundaki her şeyi kapsar): öğrenci satırları ödev ve sınavdan,
 * yetişkinin iş satırları işten ve günlük işlerden söz eder; arkadaş ve ev satırları okul sözcüğü içermez, yetişkin de
 * onları görür. Telefon ve ekran yalnızca maddenin kendisi sorduğu yerde (F1) ve cevap onları gerektirdiğinde geçer
 * (Odağı koruma'nın düşük ve orta düzeyi).
 *
 * Alanlar birlikte okunur (şablondaki "Birlikte bakınca"): her kart yalnızca kendi alanının maddelerini anlatır, böylece
 * örneğin işlere zamanında başlayıp plan yapmayan biri iki kartta çelişen bir şey okumaz.
 */
export const ertelemeZamanYonetimiDaily: SurveyDaily = {
  kind: 'survey',
  version: 'erteleme-ve-zaman-yonetimi-gunluk-1',
  scales: {
    /*
     * Ertelemeden başlama: S4 "Bana bir iş verildiğinde ona aynı gün başlarım", S5 "Yapmam gereken işlere, zamanı geldiğinde
     * hemen başlarım"; ters: S1 "Bir işi, sonra sıkışacağımı bile bile ertelerim", S2 "Yapmam gereken bir iş varken “önce şunu
     * da halledeyim” diyerek vakit geçiririm", S3 "Teslimine bol zaman olan bir işi son güne bırakırım".
     */
    start: {
      poles: { low: 'Henüz işleri sık erteler', high: 'İşlere zamanında başlar' },
      bands: {
        low: {
          from: { school: ['S3'], friends: ['S1'], home: ['S2'], work: ['S3'] },
          student: {
            school: 'Teslimine bol zaman olan bir ödevi son güne bırakabilirsin.',
            friends: 'Arkadaşlarınla buluşmadan önce bitirmen gereken bir işi, sonra sıkışacağını bilsen de erteleyebilirsin.',
            home: 'Yapman gereken bir iş varken “Önce şunu da halledeyim” deyip başka şeylerle vakit geçirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz teslimine bol zaman olan bir ödevi son güne bırakabilir.',
            friends: 'Arkadaşlarıyla buluşmadan önce bitirmesi gereken bir işi, sonra sıkışacağını bilse de erteleyebilir.',
            home: 'Yapması gereken bir iş varken “Önce şunu da halledeyim” deyip başka şeylerle vakit geçirebilir.',
          },
          adult: {
            work: 'Teslimine bol zaman olan bir işi son güne bırakabilirsin.',
          },
        },
        average: {
          from: { school: ['S4', 'S3'], friends: ['S5'], home: ['S2'], work: ['S4', 'S3'] },
          student: {
            school: 'Bazı ödevlere verildiği gün başlayabilir, bazılarını son güne bırakabilirsin.',
            friends: 'Arkadaşlarınla ortak bir işte kendi kısmına bazen hemen başlayabilir, bazen sonraya bırakabilirsin.',
            home: 'Bazen bir işe hemen başlayabilir, bazen önce başka şeylerle oyalanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevlere verildiği gün başlayabilir, bazılarını son güne bırakabilir.',
            friends: 'Arkadaşlarıyla ortak bir işte kendi kısmına bazen hemen başlayabilir, bazen sonraya bırakabilir.',
            home: 'Bazen bir işe hemen başlayabilir, bazen önce başka şeylerle oyalanabilir.',
          },
          adult: {
            work: 'Bazı işlere verildiği gün başlayabilir, bazılarını son güne bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['S4'], friends: ['S5'], home: ['S5', 'S2'], work: ['S4'] },
          student: {
            school: 'Bir ödev verildiğinde ona çoğu zaman aynı gün başlayabilirsin.',
            friends: 'Arkadaşlarınla ortak bir işte kendi kısmına zamanı gelince hemen başlayabilirsin.',
            home: 'Yapman gereken bir işe zamanı gelince başka şeylerle oyalanmadan başlayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödev verildiğinde ona çoğu zaman aynı gün başlayabilir.',
            friends: 'Arkadaşlarıyla ortak bir işte kendi kısmına zamanı gelince hemen başlayabilir.',
            home: 'Yapması gereken bir işe zamanı gelince başka şeylerle oyalanmadan başlayabilir.',
          },
          adult: {
            work: 'Sana bir iş verildiğinde ona çoğu zaman aynı gün başlayabilirsin.',
          },
        },
      },
    },
    /*
     * Planlama ve öncelik: P1 "Yapacaklarımı aklımda tutmaya çalışmak yerine bir yere not ederim", P2 "Yapacaklarımı ne kadar
     * önemli ve acil olduklarına göre sıraya koyarım", P3 "Uzun süren bir iş için kendime ara hedefler ve tarihler koyarım",
     * P4 "Bir işi ne zaman ve nerede yapacağımı önceden kararlaştırırım"; ters: P5 "Güne bir plan yapmadan, aklıma estiği gibi
     * başlarım".
     */
    planning: {
      poles: { low: 'Henüz plansız ilerler', high: 'Plan yapıp sıraya koyar' },
      bands: {
        low: {
          from: { school: ['P3'], friends: ['P4'], home: ['P1'], work: ['P3'] },
          student: {
            school: 'Uzun bir proje ödevine ara hedefler ve tarihler koymadan başlayabilirsin.',
            friends: 'Arkadaşlarınla bir işin ne zaman ve nerede yapılacağını önceden pek kararlaştırmayabilirsin.',
            home: 'Yapacaklarını bir yere not etmek yerine aklında tutmaya çalışabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz uzun bir proje ödevine ara hedefler ve tarihler koymadan başlayabilir.',
            friends: 'Arkadaşlarıyla bir işin ne zaman ve nerede yapılacağını önceden pek kararlaştırmayabilir.',
            home: 'Yapacaklarını bir yere not etmek yerine aklında tutmaya çalışabilir.',
          },
          adult: {
            work: 'Uzun süren bir işe ara hedefler ve tarihler koymadan başlayabilirsin.',
          },
        },
        average: {
          from: { school: ['P3'], friends: ['P4'], home: ['P2'], work: ['P3'] },
          student: {
            school: 'Bazı uzun ödevlere ara hedefler koyabilir, bazılarına plansız başlayabilirsin.',
            friends: 'Arkadaşlarınla bir işin ne zaman yapılacağını bazen önceden kararlaştırabilir, bazen o an karar verebilirsin.',
            home: 'Yapacaklarını bazen önem sırasına koyabilir, bazen aklına geldiği sırayla yapabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı uzun ödevlere ara hedefler koyabilir, bazılarına plansız başlayabilir.',
            friends: 'Arkadaşlarıyla bir işin ne zaman yapılacağını bazen önceden kararlaştırabilir, bazen o an karar verebilir.',
            home: 'Yapacaklarını bazen önem sırasına koyabilir, bazen aklına geldiği sırayla yapabilir.',
          },
          adult: {
            work: 'Bazı uzun işlere ara hedefler koyabilir, bazılarına plansız başlayabilirsin.',
          },
        },
        high: {
          from: { school: ['P3'], friends: ['P4'], home: ['P1', 'P2'], work: ['P3'] },
          student: {
            school: 'Uzun süren bir ödev için kendine ara hedefler ve tarihler koyabilirsin.',
            friends: 'Arkadaşlarınla bir işin ne zaman ve nerede yapılacağını önceden kararlaştırmak isteyebilirsin.',
            home: 'Yapacaklarını bir yere not edip önem ve aciliyetine göre sıraya koyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz uzun süren bir ödev için kendine ara hedefler ve tarihler koyabilir.',
            friends: 'Arkadaşlarıyla bir işin ne zaman ve nerede yapılacağını önceden kararlaştırmak isteyebilir.',
            home: 'Yapacaklarını bir yere not edip önem ve aciliyetine göre sıraya koyabilir.',
          },
          adult: {
            work: 'Uzun süren bir iş için kendine ara hedefler ve tarihler koyabilirsin.',
          },
        },
      },
    },
    /*
     * Süreyi tahmin etme: E1 "Bir işin ne kadar süreceğini isabetli tahmin ederim", E3 "Bir işe ayıracağım zamanı planlarken
     * benzer işlerin daha önce ne kadar sürdüğünü hesaba katarım", E4 "Bir işe ayıracağım süreye, beklenmedik durumlar için
     * biraz pay eklerim"; ters: E2 "İşlerim tahmin ettiğimden uzun sürer", E5 "Gün içinde zamanın nereye gittiğini anlamadan
     * akşam olur".
     */
    estimation: {
      poles: { low: 'Henüz süreyi kısa sanar', high: 'Süreyi doğru tahmin eder' },
      bands: {
        low: {
          from: { school: ['E2'], friends: ['E1'], home: ['E5'], work: ['E2'] },
          student: {
            school: 'Yarım saat sürer diye düşündüğün bir ödev daha uzun sürebilir.',
            friends: 'Arkadaşlarınla ortak bir işin ne kadar süreceğini isabetli tahmin etmek sana zor gelebilir.',
            home: 'Hafta sonu zamanın nereye gittiğini anlamadan akşam olduğunu fark edebilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yarım saat sürer diye düşündüğü bir ödev daha uzun sürebilir.',
            friends: 'Arkadaşlarıyla ortak bir işin ne kadar süreceğini isabetli tahmin etmek ona zor gelebilir.',
            home: 'Hafta sonu zamanın nereye gittiğini anlamadan akşam olduğunu fark edebilir.',
          },
          adult: {
            work: 'Yarım saat sürer diye düşündüğün bir iş daha uzun sürebilir.',
          },
        },
        average: {
          from: { school: ['E1', 'E2'], friends: ['E3'], home: ['E5'], work: ['E1', 'E2'] },
          student: {
            school: 'Bazı ödevlerin süresini isabetli tahmin edebilir, bazılarında yanılabilirsin.',
            friends: 'Arkadaşlarınla bir iş planlarken benzer işlerin ne kadar sürdüğünü bazen hesaba katabilir, bazen atlayabilirsin.',
            home: 'Bazı günler zamanın nereye gittiğinin farkında olabilir, bazı günler akşamın nasıl olduğunu anlamayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevlerin süresini isabetli tahmin edebilir, bazılarında yanılabilir.',
            friends: 'Arkadaşlarıyla bir iş planlarken benzer işlerin ne kadar sürdüğünü bazen hesaba katabilir, bazen atlayabilir.',
            home: 'Bazı günler zamanın nereye gittiğinin farkında olabilir, bazı günler akşamın nasıl olduğunu anlamayabilir.',
          },
          adult: {
            work: 'Bazı işlerin süresini isabetli tahmin edebilir, bazılarında yanılabilirsin.',
          },
        },
        high: {
          from: { school: ['E1'], friends: ['E3', 'E4'], home: ['E5'], work: ['E1'] },
          student: {
            school: 'Bir ödevin ne kadar süreceğini çoğu zaman isabetli tahmin edebilirsin.',
            friends: 'Arkadaşlarınla bir iş planlarken benzer işlerin ne kadar sürdüğünü hesaba katıp biraz pay bırakabilirsin.',
            home: 'Gün içinde zamanın nereye gittiğinin çoğu zaman farkında olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevin ne kadar süreceğini çoğu zaman isabetli tahmin edebilir.',
            friends: 'Arkadaşlarıyla bir iş planlarken benzer işlerin ne kadar sürdüğünü hesaba katıp biraz pay bırakabilir.',
            home: 'Gün içinde zamanın nereye gittiğinin çoğu zaman farkında olabilir.',
          },
          adult: {
            work: 'Bir işin ne kadar süreceğini çoğu zaman isabetli tahmin edebilirsin.',
          },
        },
      },
    },
    /*
     * Odağı koruma: F4 "Bir işe oturduğumda, bitirene kadar dikkatimi dağıtan şeyleri uzak tutarım", F5 "Sıkıcı bir işte de
     * dikkatimi işin üzerinde tutarım"; ters: F1 "Bir işle uğraşırken kendimi telefona, tablete ya da başka bir ekrana bakarken
     * bulurum", F2 "Bir işin ortasında aklıma gelen başka bir şeye geçiveririm", F3 "Daha eğlenceli bir şey çıkınca yaptığım
     * işi yarıda bırakırım".
     */
    focus: {
      poles: { low: 'Henüz odağı çabuk kayar', high: 'Odağını korur' },
      bands: {
        low: {
          from: { school: ['F2'], friends: ['F3'], home: ['F1'], work: ['F2'] },
          student: {
            school: 'Bir ödevin ortasında aklına gelen başka bir şeye geçiverebilirsin.',
            friends: 'Arkadaşların eğlenceli bir şey önerince yaptığın işi yarıda bırakabilirsin.',
            home: 'Bir işle uğraşırken kendini bir ekrana bakarken bulabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödevin ortasında aklına gelen başka bir şeye geçiverebilir.',
            friends: 'Arkadaşları eğlenceli bir şey önerince yaptığı işi yarıda bırakabilir.',
            home: 'Bir işle uğraşırken kendini bir ekrana bakarken bulabilir.',
          },
          adult: {
            work: 'Bir işin ortasında aklına gelen başka bir şeye geçiverebilirsin.',
          },
        },
        average: {
          from: { school: ['F5'], friends: ['F3'], home: ['F1', 'F4'], work: ['F5'] },
          student: {
            school: 'Sevdiğin ödevlerde dikkatini toplayabilir, sıkıcı bulduklarında dikkatin dağılabilir.',
            friends: 'Arkadaşların eğlenceli bir şey önerince bazen işini bitirip katılabilir, bazen işi yarıda bırakabilirsin.',
            home: 'Bir işle uğraşırken bazen ekranları uzak tutabilir, bazen kendini onlara bakarken bulabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sevdiği ödevlerde dikkatini toplayabilir, sıkıcı bulduklarında dikkati dağılabilir.',
            friends: 'Arkadaşları eğlenceli bir şey önerince bazen işini bitirip katılabilir, bazen işi yarıda bırakabilir.',
            home: 'Bir işle uğraşırken bazen ekranları uzak tutabilir, bazen kendini onlara bakarken bulabilir.',
          },
          adult: {
            work: 'Sevdiğin işlerde dikkatini toplayabilir, sıkıcı bulduklarında dikkatin dağılabilir.',
          },
        },
        high: {
          from: { school: ['F5'], friends: ['F3'], home: ['F4'], work: ['F5'] },
          student: {
            school: 'Sıkıcı bulduğun bir ödevde de dikkatini çoğu zaman işin üzerinde tutabilirsin.',
            friends: 'Arkadaşların eğlenceli bir şey önerse de önce elindeki işi bitirmeyi seçebilirsin.',
            home: 'Bir işe oturduğunda bitirene kadar dikkatini dağıtan şeyleri uzak tutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sıkıcı bulduğu bir ödevde de dikkatini çoğu zaman işin üzerinde tutabilir.',
            friends: 'Arkadaşları eğlenceli bir şey önerse de önce elindeki işi bitirmeyi seçebilir.',
            home: 'Bir işe oturduğunda bitirene kadar dikkatini dağıtan şeyleri uzak tutabilir.',
          },
          adult: {
            work: 'Sıkıcı bulduğun bir işte de dikkatini çoğu zaman işin üzerinde tutabilirsin.',
          },
        },
      },
    },
    /*
     * Zamanın kontrolü: C1 "Gün içinde işlerimi ben yönlendiririm", C3 "Önemli işlerime yetecek zamanı bulurum", C5 "Yapmam
     * gerekenlerin yanında dinlenmeye ve sevdiğim şeylere de zaman ayırırım"; ters: C2 "Yetiştirmem gereken işlerin altında
     * ezildiğimi hissederim", C4 "İşler üst üste binince ne yapacağımı şaşırırım". Düşük uç bir duyguyu anlatır; örnekler onu
     * büyütmeden, maddenin sözüyle söyler.
     */
    control: {
      poles: { low: 'Henüz zamanı dar hisseder', high: 'Zamanına hâkim hisseder' },
      bands: {
        low: {
          from: { school: ['C2'], friends: ['C5'], home: ['C4'], work: ['C2'] },
          student: {
            school: 'Sınav haftalarında yetiştirmen gereken işlerin altında ezildiğini hissedebilirsin.',
            friends: 'Yapacakların çok olduğu için arkadaşlarınla sevdiğin şeylere zaman ayırmak zor gelebilir.',
            home: 'İşler üst üste binince hangisinden başlayacağını şaşırabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınav haftalarında yetiştirmesi gereken işlerin altında ezildiğini hissedebilir.',
            friends: 'Yapacakları çok olduğu için arkadaşlarıyla sevdiği şeylere zaman ayırmak ona zor gelebilir.',
            home: 'İşler üst üste binince hangisinden başlayacağını şaşırabilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde yetiştirmen gereken işlerin altında ezildiğini hissedebilirsin.',
          },
        },
        average: {
          from: { school: ['C3', 'C4'], friends: ['C5'], home: ['C1'], work: ['C3', 'C4'] },
          student: {
            school: 'Bazı haftalar önemli ödevlerine yetecek zamanı bulabilir, bazı haftalar işlerin üst üste bindiğini hissedebilirsin.',
            friends: 'Arkadaşlarınla sevdiğin şeylere bazen zaman ayırabilir, bazen işlerin buna izin vermeyebilir.',
            home: 'Bazı günler işlerini sen yönlendirebilir, bazı günler işlerin seni yönlendirdiğini hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı haftalar önemli ödevlerine yetecek zamanı bulabilir, bazı haftalar işlerin üst üste bindiğini hissedebilir.',
            friends: 'Arkadaşlarıyla sevdiği şeylere bazen zaman ayırabilir, bazen işleri buna izin vermeyebilir.',
            home: 'Bazı günler işlerini kendisi yönlendirebilir, bazı günler işlerin onu yönlendirdiğini hissedebilir.',
          },
          adult: {
            work: 'Bazı haftalar önemli işlerine yetecek zamanı bulabilir, bazı haftalar işlerin üst üste bindiğini hissedebilirsin.',
          },
        },
        high: {
          from: { school: ['C3'], friends: ['C5'], home: ['C1'], work: ['C3'] },
          student: {
            school: 'Yoğun haftalarda da önemli ödevlerine yetecek zamanı bulabilirsin.',
            friends: 'Yapacaklarının yanında arkadaşlarınla sevdiğin şeylere de zaman ayırabilirsin.',
            home: 'Gün içinde işlerini çoğu zaman sen yönlendirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yoğun haftalarda da önemli ödevlerine yetecek zamanı bulabilir.',
            friends: 'Yapacaklarının yanında arkadaşlarıyla sevdiği şeylere de zaman ayırabilir.',
            home: 'Gün içinde işlerini çoğu zaman kendisi yönlendirebilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde de önemli işlerine yetecek zamanı bulabilirsin.',
          },
        },
      },
    },
  },
};
