import type { SurveyDaily } from './types';

/**
 * Zihniyet: Zekâ ve Öğrenme İnançları: günlük hayatta nasıl görünür (5. sınıftan yetişkine). Ton: gelişim (bütün ölçekler;
 * lib/reports/daily-parts.ts, `GROWTH_SLUGS`): örnekler bugünkü inancın günlük hayatta nasıl görünebileceğini anlatır;
 * düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz; hiçbir örnek suçlamaz ya da gelişim zihniyetini
 * bir "doğru cevap" gibi sunmaz. Rapor metinlerindeki ilke burada da geçerlidir (src/content/reports/zihniyet.ts): zihniyet
 * abartılmaz; örnekler bir başarı ya da gelişme sözü vermez, inancın bir notu ya da sonucu değiştireceğini söylemez.
 *
 * Maddeler inançları sorar; örnekler o inancın zorlanılan bir anda akla gelen düşünce ya da yapılan seçim olarak nasıl
 * görünebileceğini, maddelerin kendi sözlerine yakın anlatır ("Benim kafam buna çalışmıyor" ← "insanın ya kafası çalışır ya
 * çalışmaz"). "Zekâ" ve "yetenek" sözcükleri günlük hayat örneklerinde kullanılmaz (kişi hakkında bir yetenek ya da zekâ
 * yargısı gibi okunmasın); "akıl", "kafa" ve "bana göre değil" denir. Zekâya bakış'ın örnekleri oyun anmaz: oyunla
 * "aklın açılması" bir beyin çalıştırma inancı gibi okunurdu (sitede böyle bir vaat verilmez). "Beceriksiz görünmek"
 * (G5) "acemi görünmek", "başarısız olmak" (H2, H6) "yapamamak", "kaybetmek" diye anlatılır.
 *
 * Kartlar birbiriyle çelişmesin diye: Zekâya bakış aklın gelişip gelişmeyeceğini (Z2–Z6), Çabaya bakış çok çalışmak
 * gerekmesinin ne anlama geldiğini ve emeğin karşılığını (C1–C6), Hataya bakış hatanın ve kaybetmenin anlamını (H1–H6),
 * Zorluğa yaklaşım zorlayıcı işi seçmeyi (G1–G6) anlatır; bir başkasının başarısını doğuştan gelene ya da çalışmaya bağlama
 * yalnızca Çabaya bakış'ta (C3, C6) geçer. Okul satırları ders ve sınavdan söz eder, sınıfa özgü bir yer söylemez: sınava
 * hazırlanan bir mezun için de anlamlıdır. Çabaya bakış'ın düşük ucundaki ev satırı evde başkalarını varsaydığı için
 * yetişkinin kendi ev satırı vardır (`adult.home`).
 */
export const zihniyetDaily: SurveyDaily = {
  kind: 'survey',
  version: 'zihniyet-gunluk-1',
  scales: {
    /*
     * Zekâya bakış: Z2 "İnsan, zorlandığı işlerle uğraştıkça daha zeki hâle gelebilir", Z4 "Çalıştıkça benim zekâm da
     * gelişebilir", Z6 "Bugün kendini pek zeki bulmayan biri, yıllar içinde çok daha zeki hâle gelebilir"; ters: Z1 "Kimin ne
     * kadar zeki olacağı daha doğarken bellidir", Z3 "Zekâ boy gibidir: çalışarak artırılamaz", Z5 "Matematik ya da yabancı
     * dil gibi bazı alanlarda insanın ya kafası çalışır ya çalışmaz".
     */
    intelligence: {
      poles: { low: 'Aklı doğuştan belli sayar', high: 'Aklı gelişebilir sayar' },
      bands: {
        low: {
          from: { school: ['Z5'], friends: ['Z1', 'Z3'], home: ['Z3'], work: ['Z5'] },
          student: {
            school: 'Matematikte ya da yabancı dilde zorlanınca “Benim kafam buna çalışmıyor” diye düşünebilirsin.',
            friends: 'Arkadaşlarınla konuşurken insanın aklının doğuştan belli olduğunu, sonradan pek değişmeyeceğini söyleyebilirsin.',
            home: 'Yeni bir şeyi öğrenmekte zorlanınca “Ben böyleyim, bu değişmez” diye düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz matematikte ya da yabancı dilde zorlanınca “Benim kafam buna çalışmıyor” diye düşünebilir.',
            friends: 'Arkadaşlarıyla konuşurken insanın aklının doğuştan belli olduğunu, sonradan pek değişmeyeceğini söyleyebilir.',
            home: 'Yeni bir şeyi öğrenmekte zorlanınca “Ben böyleyim, bu değişmez” diye düşünebilir.',
          },
          adult: {
            work: 'Yeni bir beceri gereken bir işte “Benim kafam buna çalışmıyor” diye düşünebilirsin.',
          },
        },
        average: {
          from: { school: ['Z4', 'Z5'], friends: ['Z2'], home: ['Z4', 'Z3'], work: ['Z4', 'Z5'] },
          student: {
            school: 'Bazı derslerde çalıştıkça gelişebileceğini, bazılarında kafanın buna çalışmadığını düşünebilirsin.',
            friends: 'Arkadaşlarınla konuşurken insanın uğraştıkça aklının gelişebileceğini bazen söyleyebilir, bazen buna pek inanmayabilirsin.',
            home: 'Bir şeyi öğrenmeye çalışırken bazen “Çalışırsam gelişirim”, bazen “Ben böyleyim” diye düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde çalıştıkça gelişebileceğini, bazılarında kafasının buna çalışmadığını düşünebilir.',
            friends: 'Arkadaşlarıyla konuşurken insanın uğraştıkça aklının gelişebileceğini bazen söyleyebilir, bazen buna pek inanmayabilir.',
            home: 'Bir şeyi öğrenmeye çalışırken bazen “Çalışırsam gelişirim”, bazen “Ben böyleyim” diye düşünebilir.',
          },
          adult: {
            work: 'Bazı işlerde çalıştıkça gelişebileceğini, bazılarında kafanın buna çalışmadığını düşünebilirsin.',
          },
        },
        high: {
          from: { school: ['Z4'], friends: ['Z2'], home: ['Z6'], work: ['Z4'] },
          student: {
            school: 'Zorlandığın bir derste “Çalıştıkça aklım da gelişir” diye düşünebilirsin.',
            friends: 'Arkadaşlarınla konuşurken insanın zorlandığı işlerle uğraştıkça aklının gelişebileceğini söyleyebilirsin.',
            home: 'Bugün zorlandığın bir şeyde yıllar içinde çok gelişebileceğine inanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz zorlandığı bir derste “Çalıştıkça aklım da gelişir” diye düşünebilir.',
            friends: 'Arkadaşlarıyla konuşurken insanın zorlandığı işlerle uğraştıkça aklının gelişebileceğini söyleyebilir.',
            home: 'Bugün zorlandığı bir şeyde yıllar içinde çok gelişebileceğine inanabilir.',
          },
          adult: {
            work: 'Zorlandığın yeni bir işte “Çalıştıkça aklım da gelişir” diye düşünebilirsin.',
          },
        },
      },
    },
    /*
     * Çabaya bakış: C1 "Emek verdiğim konularda bunun karşılığını alırım", C3 "Bir alanda çok iyi olan insanlar, o noktaya
     * çoğunlukla çalışarak gelmiştir", C5 "Bir konuda takıldığımda yeni bir yol denemek beni ilerletir"; ters: C2 "Bir konu için
     * çok çalışmam gerekiyorsa, o konuda yeteneğim yok demektir", C4 "Bir şeyi başkalarından daha geç öğreniyorsam, o iş bana
     * göre değildir", C6 "Doğuştan yetenekli olanların çalışmasına pek gerek yoktur". C4'ün karşılaştırması örneğe taşınmadı:
     * örnek "öğrenmen uzun sürünce" der, başkalarıyla kıyaslamaz.
     */
    effort: {
      poles: { low: 'Çabayı kötü işaret sayar', high: 'Çabayı ilerleme sayar' },
      bands: {
        low: {
          from: { school: ['C2', 'C4'], friends: ['C4'], home: ['C6', 'C3'], work: ['C2', 'C4'] },
          student: {
            school: 'Bir konu için çok çalışman gerekince “Bu iş bana göre değil” diye düşünebilirsin.',
            friends: 'Arkadaşlarınla yeni bir oyunu öğrenmen uzun sürünce o oyunun sana göre olmadığını düşünebilirsin.',
            home: 'Evdekilerden biri bir işi çok iyi yapınca bunun çalışmadan, doğuştan geldiğini düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir konu için çok çalışması gerekince “Bu iş bana göre değil” diye düşünebilir.',
            friends: 'Arkadaşlarıyla yeni bir oyunu öğrenmesi uzun sürünce o oyunun ona göre olmadığını düşünebilir.',
            home: 'Evdekilerden biri bir işi çok iyi yapınca bunun çalışmadan, doğuştan geldiğini düşünebilir.',
          },
          adult: {
            work: 'Bir konu için çok uğraşman gerekince “Bu iş bana göre değil” diye düşünebilirsin.',
            // Öğrencinin ev satırı evde başkalarını varsayar; yalnız yaşayan bir yetişkin için kendi ev satırı.
            home: 'Bir ev işini çok iyi yapan birini görünce bunun çalışmadan, doğuştan geldiğini düşünebilirsin.',
          },
        },
        average: {
          from: { school: ['C1'], friends: ['C4'], home: ['C5'], work: ['C1'] },
          student: {
            school: 'Bazı derslerde emeğinin karşılığını alabileceğini, bazılarında çalışmanın pek fark yaratmayacağını düşünebilirsin.',
            friends: 'Arkadaşlarınla yeni bir oyunu öğrenmen uzun sürünce bazen “Biraz daha uğraşırsam öğrenirim”, bazen “Bu bana göre değil” diyebilirsin.',
            home: 'Bir işte takılınca yeni bir yol denemenin bazen işe yarayacağını, bazen yaramayacağını düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde emeğinin karşılığını alabileceğini, bazılarında çalışmanın pek fark yaratmayacağını düşünebilir.',
            friends: 'Arkadaşlarıyla yeni bir oyunu öğrenmesi uzun sürünce bazen “Biraz daha uğraşırsam öğrenirim”, bazen “Bu bana göre değil” diyebilir.',
            home: 'Bir işte takılınca yeni bir yol denemenin bazen işe yarayacağını, bazen yaramayacağını düşünebilir.',
          },
          adult: {
            work: 'Bazı işlerde emeğinin karşılığını alabileceğini, bazılarında çalışmanın pek fark yaratmayacağını düşünebilirsin.',
          },
        },
        high: {
          from: { school: ['C2'], friends: ['C3'], home: ['C5'], work: ['C2'] },
          student: {
            school: 'Bir ders için çok çalışman gerekmesini, o dersi öğrenmenin bir parçası sayabilirsin.',
            friends: 'Bir oyunda ya da sporda çok iyi olan bir arkadaşının oraya çalışarak geldiğini düşünebilirsin.',
            home: 'Bir işte takılınca yeni bir yol denemenin seni ilerleteceğini düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ders için çok çalışması gerekmesini, o dersi öğrenmenin bir parçası sayabilir.',
            friends: 'Bir oyunda ya da sporda çok iyi olan bir arkadaşının oraya çalışarak geldiğini düşünebilir.',
            home: 'Bir işte takılınca yeni bir yol denemenin onu ilerleteceğini düşünebilir.',
          },
          adult: {
            work: 'Bir iş için çok uğraşman gerekmesini, o işi öğrenmenin bir parçası sayabilirsin.',
          },
        },
      },
    },
    /*
     * Hataya bakış: H1 "Yaptığım hatalar, neyi öğrenmem gerektiğini gösterir", H3 "Kötü giden bir işten sonra neyi farklı
     * yapabileceğimi düşünürüm", H5 "Başarısızlık, daha iyi olma yolunda normal bir adımdır"; ters: H2 "Bir işte başarısız
     * olmak, o işte ilerleme şansımı azaltır", H4 "Bir hata yaptığımda, o işi aslında yapamayacağımı düşünürüm", H6 "Başarısız
     * olduğum bir şeyi bir daha düşünmek bile istemem".
     */
    failure: {
      poles: { low: 'Hatayı engel görür', high: 'Hatayı öğretici görür' },
      bands: {
        low: {
          from: { school: ['H4'], friends: ['H6'], home: ['H2'], work: ['H4'] },
          student: {
            school: 'Bir sınavda hata yapınca o konuyu aslında öğrenemeyeceğini düşünebilirsin.',
            friends: 'Arkadaşlarınla oynadığın bir oyunu kaybedince onu bir daha düşünmek istemeyebilirsin.',
            home: 'Bir ev işini ilk denemede yapamayınca o işte ilerleme şansının azaldığını düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavda hata yapınca o konuyu aslında öğrenemeyeceğini düşünebilir.',
            friends: 'Arkadaşlarıyla oynadığı bir oyunu kaybedince onu bir daha düşünmek istemeyebilir.',
            home: 'Bir ev işini ilk denemede yapamayınca o işte ilerleme şansının azaldığını düşünebilir.',
          },
          adult: {
            work: 'Bir işte hata yapınca o işi aslında yapamayacağını düşünebilirsin.',
          },
        },
        average: {
          from: { school: ['H1', 'H2'], friends: ['H6'], home: ['H3'], work: ['H1', 'H2'] },
          student: {
            school: 'Bir sınavdaki hatanın bazen neyi öğrenmen gerektiğini gösterdiğini, bazen seni geri götürdüğünü düşünebilirsin.',
            friends: 'Arkadaşlarınla kaybettiğin bir oyunu bazen yeniden düşünebilir, bazen aklından çıkarmak isteyebilirsin.',
            home: 'Bir iş istediğin gibi gitmeyince bazen neyi farklı yapabileceğini düşünebilir, bazen üzerinde durmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavdaki hatanın bazen neyi öğrenmesi gerektiğini gösterdiğini, bazen onu geri götürdüğünü düşünebilir.',
            friends: 'Arkadaşlarıyla kaybettiği bir oyunu bazen yeniden düşünebilir, bazen aklından çıkarmak isteyebilir.',
            home: 'Bir iş istediği gibi gitmeyince bazen neyi farklı yapabileceğini düşünebilir, bazen üzerinde durmayabilir.',
          },
          adult: {
            work: 'Bir işteki hatanın bazen neyi öğrenmen gerektiğini gösterdiğini, bazen seni geri götürdüğünü düşünebilirsin.',
          },
        },
        high: {
          from: { school: ['H1'], friends: ['H5', 'H6'], home: ['H3'], work: ['H1'] },
          student: {
            school: 'Bir sınavdaki hatalarının neyi öğrenmen gerektiğini gösterdiğini düşünebilirsin.',
            friends: 'Arkadaşlarınla oynadığın bir oyunu kaybedince bunu öğrenmenin bir adımı sayabilirsin.',
            home: 'Bir iş istediğin gibi gitmeyince bir dahaki sefere neyi farklı yapabileceğini düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavdaki hatalarının neyi öğrenmesi gerektiğini gösterdiğini düşünebilir.',
            friends: 'Arkadaşlarıyla oynadığı bir oyunu kaybedince bunu öğrenmenin bir adımı sayabilir.',
            home: 'Bir iş istediği gibi gitmeyince bir dahaki sefere neyi farklı yapabileceğini düşünebilir.',
          },
          adult: {
            work: 'Bir işte yaptığın hataların neyi öğrenmen gerektiğini gösterdiğini düşünebilirsin.',
          },
        },
      },
    },
    /*
     * Zorluğa yaklaşım: G1 "Kolay işler yerine beni zorlayacak işleri seçerim", G3 "Hemen çözemediğim sorular ilgimi çeker", G5
     * "Yeni bir şey öğrenirken başta beceriksiz görünmek beni rahatsız etmez"; ters: G2 "Hata yapma ihtimalim yüksekse o işe
     * girişmem", G4 "Başkalarının önünde zorlanacağım bir işi denemekten kaçınırım", G6 "Zaten iyi olduğum şeylerle uğraşmayı,
     * yeni şeyler denemeye tercih ederim".
     */
    challenge: {
      poles: { low: 'Bildiği işi seçer', high: 'Zorlayan işi seçer' },
      bands: {
        low: {
          from: { school: ['G4'], friends: ['G6'], home: ['G2'], work: ['G4'] },
          student: {
            school: 'Derste herkesin önünde zorlanabileceğin bir şeyi denemek istemeyebilirsin.',
            friends: 'Arkadaşlarınla yeni bir oyun yerine zaten iyi olduğun bir oyunu seçebilirsin.',
            home: 'Hata yapabileceğin yeni bir ev işine girişmek istemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste herkesin önünde zorlanabileceği bir şeyi denemek istemeyebilir.',
            friends: 'Arkadaşlarıyla yeni bir oyun yerine zaten iyi olduğu bir oyunu seçebilir.',
            home: 'Hata yapabileceği yeni bir ev işine girişmek istemeyebilir.',
          },
          adult: {
            work: 'Başkalarının önünde zorlanabileceğin bir işi denemek istemeyebilirsin.',
          },
        },
        average: {
          from: { school: ['G1'], friends: ['G6'], home: ['G3'], work: ['G1'] },
          student: {
            school: 'Bazı derslerde zorlayıcı soruları, bazılarında kolay olanları seçebilirsin.',
            friends: 'Arkadaşlarınla bazen yeni bir oyun denemeyi, bazen iyi olduğun bir oyunu seçebilirsin.',
            home: 'Hemen çözemediğin bir bulmaca bazen ilgini çekebilir, bazen seni bıktırabilir.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde zorlayıcı soruları, bazılarında kolay olanları seçebilir.',
            friends: 'Arkadaşlarıyla bazen yeni bir oyun denemeyi, bazen iyi olduğu bir oyunu seçebilir.',
            home: 'Hemen çözemediği bir bulmaca bazen ilgisini çekebilir, bazen onu bıktırabilir.',
          },
          adult: {
            work: 'Bazı işlerde zorlayıcı görevleri, bazılarında kolay olanları seçebilirsin.',
          },
        },
        high: {
          from: { school: ['G3', 'G1'], friends: ['G4'], home: ['G5'], work: ['G1'] },
          student: {
            school: 'Hemen çözemediğin bir soru ilgini çekebilir; kolay sorular yerine zorlayıcı olanları seçebilirsin.',
            friends: 'Arkadaşlarının önünde zorlanabileceğin yeni bir oyunu denemekten çekinmeyebilirsin.',
            home: 'Bir şeyi öğrenmeye yeni başladığında acemi görünmek seni pek rahatsız etmeyebilir.',
          },
          parent: {
            school: 'Hemen çözemediği bir soru çocuğunuzun ilgisini çekebilir; kolay sorular yerine zorlayıcı olanları seçebilir.',
            friends: 'Arkadaşlarının önünde zorlanabileceği yeni bir oyunu denemekten çekinmeyebilir.',
            home: 'Bir şeyi öğrenmeye yeni başladığında acemi görünmek onu pek rahatsız etmeyebilir.',
          },
          adult: {
            work: 'Kolay işler yerine seni zorlayacak işleri seçebilirsin.',
          },
        },
      },
    },
  },
};
