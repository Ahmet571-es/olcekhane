import type { SurveyDaily } from './types';

/**
 * Çalışma Alışkanlıkları Envanteri: günlük hayatta nasıl görünür (6. sınıftan mezuna; yetişkinlere açık değil). Ton:
 * gelişim (şablon değerlendiricidir; lib/reports/daily-parts.ts, `scaleTone`): örnekler bugün ne sıklıkla yapıldığını
 * anlatır; düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz; hiçbir örnek suçlamaz, utandırmaz ve
 * bir gelişme sözü vermez. Uçlarda düşük uç "Henüz" diye başlar.
 *
 * Maddeler etkili bulunan çalışma yöntemlerini sorar; bu yöntemler herkes için aynı anlatılır. Hiçbir örnek bir düzeyi bir
 * "öğrenme stili"yle ya da kişiye özel bir öğrenme yoluyla eşleştirmez; yalnızca o yöntemin ne sıklıkla kullanıldığını
 * maddelerin söylediği kadar anlatır. Kapsayıcılık: kendi odası, kendi masası, telefon ya da özel ders varsayılmaz.
 * Mesajlar yalnızca maddenin kendisi sorduğu yerde (Odaklanma, F2) ve koşullu geçer ("Yanında telefon varsa"): telefonu
 * olmayan biri de Odaklanma'da her düzeye düşebilir. "Dikkatini dağıtan şeylerin olmadığı bir yer" maddenin (F3) sözüdür,
 * ayrı bir oda demek değildir; F3'ün düşük ucu evde sessiz bir yer olmamasından da gelebileceği için kişinin bir yer seçtiğini
 * varsaymaz ve onu suçlamaz ("Ders çalıştığın yerde çoğu zaman dikkatini dağıtan şeyler olabilir"). "Ailem" (H5) yerine "evdekiler" de kullanılmadı: örnekler yalnızca
 * arkadaşlardan yardım istemeyi anlatır.
 *
 * Kartlar birbiriyle çelişmesin diye: Anlayarak çalışma "Anlamadığım bir yeri atlamak yerine anlayana kadar üzerinde
 * dururum" (U5) maddesini anlatmaz; çünkü Hatalardan öğrenme ve yardım isteme'nin düşük ucu, anlamadığı bir şeyi sormadan
 * geçmeyi (H3) anlatır. Bir okul satırı sınava hazırlanan bir mezun için de anlamlıdır (ders çalışma, sınav, ödev).
 */
export const calismaAliskanliklariDaily: SurveyDaily = {
  kind: 'survey',
  version: 'calisma-aliskanliklari-gunluk-1',
  scales: {
    /*
     * Planlama: P1 "Ders çalışmaya başlamadan önce o gün neyi çalışacağımı belirlerim", P2 "Haftalık bir çalışma planım vardır
     * ve ona uymaya çalışırım", P3 "Sınavlara son güne bırakmadan, günler öncesinden hazırlanmaya başlarım", P5 "Büyük bir
     * ödevi küçük parçalara bölüp her birine bir zaman ayırırım"; ters: P4 "Ödevlerimi çoğu zaman son dakikaya bırakırım".
     */
    planning: {
      poles: { low: 'Henüz plan yapmadan başlar', high: 'Önceden plan yapar' },
      bands: {
        low: {
          from: { school: ['P3'], friends: ['P5'], home: ['P1'] },
          student: {
            school: 'Bir sınava hazırlanmaya çoğu zaman son günlerde başlayabilirsin.',
            friends: 'Arkadaşlarınla ortak bir ödevde işi parçalara bölmeden doğrudan başlayabilirsin.',
            home: 'Ders çalışmaya oturunca o gün neyi çalışacağına o an karar verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınava hazırlanmaya çoğu zaman son günlerde başlayabilir.',
            friends: 'Arkadaşlarıyla ortak bir ödevde işi parçalara bölmeden doğrudan başlayabilir.',
            home: 'Ders çalışmaya oturunca o gün neyi çalışacağına o an karar verebilir.',
          },
        },
        average: {
          from: { school: ['P3'], friends: ['P5'], home: ['P2'] },
          student: {
            school: 'Bazı sınavlara günler öncesinden, bazılarına son günlerde hazırlanmaya başlayabilirsin.',
            friends: 'Arkadaşlarınla ortak bir ödevde işi bazen parçalara bölebilir, bazen doğrudan başlayabilirsin.',
            home: 'Haftalık bir çalışma planın olabilir; bazı haftalar bu plana uymakta zorlanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlara günler öncesinden, bazılarına son günlerde hazırlanmaya başlayabilir.',
            friends: 'Arkadaşlarıyla ortak bir ödevde işi bazen parçalara bölebilir, bazen doğrudan başlayabilir.',
            home: 'Haftalık bir çalışma planı olabilir; bazı haftalar bu plana uymakta zorlanabilir.',
          },
        },
        high: {
          from: { school: ['P3'], friends: ['P5'], home: ['P1', 'P2'] },
          student: {
            school: 'Bir sınava çalışmaya son günü beklemeden, birkaç gün önceden başlayabilirsin.',
            friends: 'Arkadaşlarınla ortak bir ödevde işi küçük adımlara ayırıp her adıma bir zaman verebilirsin.',
            home: 'Çalışmaya oturmadan önce o gün neyi çalışacağını belirleyebilir, haftalık planına uymaya çalışabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınava çalışmaya son günü beklemeden, birkaç gün önceden başlayabilir.',
            friends: 'Arkadaşlarıyla ortak bir ödevde işi küçük adımlara ayırıp her adıma bir zaman verebilir.',
            home: 'Çalışmaya oturmadan önce o gün neyi çalışacağını belirleyebilir, haftalık planına uymaya çalışabilir.',
          },
        },
      },
    },
    /*
     * Kendini sınama ve tekrar: T1 "Bir konuyu çalıştıktan sonra kitaba bakmadan neler hatırladığımı kontrol ederim", T2
     * "Öğrendiğim konuları birkaç gün sonra yeniden tekrar ederim", T4 "Soru çözerek ya da soru kartlarıyla kendimi sınarım",
     * T5 "Sınavdan önce kendime sınavda çıkabilecek sorular sorarım"; ters: T3 "Bir konuyu tekrar etmek için genellikle
     * yalnızca notlarımı yeniden okurum".
     */
    retrieval: {
      poles: { low: 'Henüz okuyarak tekrar eder', high: 'Kendini sınayarak çalışır' },
      bands: {
        low: {
          from: { school: ['T5'], friends: ['T4', 'T3'], home: ['T3'] },
          student: {
            school: 'Bir sınavdan önce kendine sınavda çıkabilecek soruları pek sormayabilirsin.',
            friends: 'Arkadaşlarınla çalışırken soru çözmek yerine notları birlikte okumayı seçebilirsin.',
            home: 'Bir konuyu tekrar ederken çoğu zaman notlarını yeniden okuyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavdan önce kendine sınavda çıkabilecek soruları pek sormayabilir.',
            friends: 'Arkadaşlarıyla çalışırken soru çözmek yerine notları birlikte okumayı seçebilir.',
            home: 'Bir konuyu tekrar ederken çoğu zaman notlarını yeniden okuyabilir.',
          },
        },
        average: {
          from: { school: ['T5', 'T3'], friends: ['T4'], home: ['T2'] },
          student: {
            school: 'Bazı sınavlardan önce kendine soru sorabilir, bazılarında yalnızca notlarını okuyabilirsin.',
            friends: 'Arkadaşlarınla çalışırken bazen soru çözebilir, bazen yalnızca konuyu birlikte okuyabilirsin.',
            home: 'Bazı konulara birkaç gün sonra dönüp tekrar edebilir, bazılarını bir kez çalışıp bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sınavlardan önce kendine soru sorabilir, bazılarında yalnızca notlarını okuyabilir.',
            friends: 'Arkadaşlarıyla çalışırken bazen soru çözebilir, bazen yalnızca konuyu birlikte okuyabilir.',
            home: 'Bazı konulara birkaç gün sonra dönüp tekrar edebilir, bazılarını bir kez çalışıp bırakabilir.',
          },
        },
        high: {
          from: { school: ['T5'], friends: ['T4'], home: ['T1'] },
          student: {
            school: 'Bir sınavdan önce kendine sınavda çıkabilecek sorular sorabilirsin.',
            friends: 'Arkadaşlarınla çalışırken soru kartlarıyla ya da soru çözerek kendini sınayabilirsin.',
            home: 'Çalışmayı bitirince kitabı kapatıp aklında neler kaldığını kendine sorabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınavdan önce kendine sınavda çıkabilecek sorular sorabilir.',
            friends: 'Arkadaşlarıyla çalışırken soru kartlarıyla ya da soru çözerek kendini sınayabilir.',
            home: 'Çalışmayı bitirince kitabı kapatıp aklında neler kaldığını kendine sorabilir.',
          },
        },
      },
    },
    /*
     * Anlayarak çalışma: U1 "Yeni öğrendiğim bir bilgiyi daha önce bildiklerimle ilişkilendirmeye çalışırım", U2 "Bir konuyu
     * çalışırken “Bu neden böyle?” diye kendime sorarım", U3 "Öğrendiğim bir konuyu kendi cümlelerimle anlatmaya çalışırım",
     * U5 "Anlamadığım bir yeri atlamak yerine anlayana kadar üzerinde dururum" (kullanılmadı, yukarıdaki gerekçeyle); ters:
     * U4 "Konuları anlamadan ezberlemeye çalışırım".
     */
    understanding: {
      poles: { low: 'Henüz ezberleyerek çalışır', high: 'Anlayarak çalışır' },
      bands: {
        low: {
          from: { school: ['U4'], friends: ['U3'], home: ['U2'] },
          student: {
            school: 'Bir konuyu çoğu zaman anlamadan ezberlemeye çalışabilirsin.',
            friends: 'Öğrendiğin bir konuyu bir arkadaşına kendi cümlelerinle anlatmayı pek denemeyebilirsin.',
            home: 'Bir konuyu çalışırken kendine “Bu neden böyle?” diye pek sormayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir konuyu çoğu zaman anlamadan ezberlemeye çalışabilir.',
            friends: 'Öğrendiği bir konuyu bir arkadaşına kendi cümleleriyle anlatmayı pek denemeyebilir.',
            home: 'Bir konuyu çalışırken kendine “Bu neden böyle?” diye pek sormayabilir.',
          },
        },
        average: {
          from: { school: ['U4'], friends: ['U3'], home: ['U2'] },
          student: {
            school: 'Bazı konuları anlayarak, bazılarını ezberleyerek çalışabilirsin.',
            friends: 'Bir arkadaşın sorunca öğrendiğin konuyu bazen kendi cümlelerinle anlatabilir, bazen kitaptaki gibi tekrarlayabilirsin.',
            home: 'Bazı konularda “Bu neden böyle?” diye sorabilir, bazılarında konuyu olduğu gibi kabul edebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı konuları anlayarak, bazılarını ezberleyerek çalışabilir.',
            friends: 'Bir arkadaşı sorunca öğrendiği konuyu bazen kendi cümleleriyle anlatabilir, bazen kitaptaki gibi tekrarlayabilir.',
            home: 'Bazı konularda “Bu neden böyle?” diye sorabilir, bazılarında konuyu olduğu gibi kabul edebilir.',
          },
        },
        high: {
          from: { school: ['U1'], friends: ['U3'], home: ['U2'] },
          student: {
            school: 'Yeni öğrendiğin bir bilgiyi daha önce bildiklerinle ilişkilendirmeye çalışabilirsin.',
            friends: 'Öğrendiğin bir konuyu bir arkadaşına kendi cümlelerinle anlatmaya çalışabilirsin.',
            home: 'Bir konuyu çalışırken kendine “Bu neden böyle?” diye sorabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yeni öğrendiği bir bilgiyi daha önce bildikleriyle ilişkilendirmeye çalışabilir.',
            friends: 'Öğrendiği bir konuyu bir arkadaşına kendi cümleleriyle anlatmaya çalışabilir.',
            home: 'Bir konuyu çalışırken kendine “Bu neden böyle?” diye sorabilir.',
          },
        },
      },
    },
    /*
     * Odaklanma: F1 "Ders çalışırken telefonumu başka bir odaya koyar ya da sessize alırım" (kullanılmadı: telefon ve ayrı
     * oda varsayardı), F3 "Ders çalışmak için dikkatimi dağıtan şeylerin olmadığı bir yer seçerim", F4 "Uzun süre
     * çalışacaksam arada kısa molalar veririm"; ters: F2 "Ders çalışırken sık sık sosyal medyaya ya da mesajlarıma bakarım",
     * F5 "Ders çalışırken aklım başka şeylere kayar ve bunu uzun süre fark etmem".
     */
    focus: {
      poles: { low: 'Henüz dikkati çabuk kayar', high: 'Dikkatini işte tutar' },
      bands: {
        low: {
          from: { school: ['F5'], friends: ['F2'], home: ['F3'] },
          student: {
            school: 'Ders çalışırken aklın başka şeylere kayabilir ve bunu geç fark edebilirsin.',
            friends: 'Ders çalışırken yanında telefon varsa arkadaşlarından gelen mesajlara sık sık bakabilirsin.',
            home: 'Ders çalıştığın yerde çoğu zaman dikkatini dağıtan şeyler olabilir.',
          },
          parent: {
            school: 'Çocuğunuz ders çalışırken aklı başka şeylere kayabilir ve bunu geç fark edebilir.',
            friends: 'Ders çalışırken yanında telefon varsa arkadaşlarından gelen mesajlara sık sık bakabilir.',
            home: 'Ders çalıştığı yerde çoğu zaman dikkatini dağıtan şeyler olabilir.',
          },
        },
        average: {
          from: { school: ['F5'], friends: ['F2'], home: ['F4'] },
          student: {
            school: 'Ders çalışırken bazen dikkatini toplayabilir, bazen aklının başka şeylere kaydığını görebilirsin.',
            friends: 'Yanında telefon varsa ders çalışırken mesajlara bazen bakmadan durabilir, bazen ara ara göz atabilirsin.',
            home: 'Uzun süre çalışırken bazen kısa molalar verebilir, bazen ara vermeden devam edebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders çalışırken bazen dikkatini toplayabilir, bazen aklı başka şeylere kayabilir.',
            friends: 'Yanında telefon varsa ders çalışırken mesajlara bazen bakmadan durabilir, bazen ara ara göz atabilir.',
            home: 'Uzun süre çalışırken bazen kısa molalar verebilir, bazen ara vermeden devam edebilir.',
          },
        },
        high: {
          from: { school: ['F5'], friends: ['F2'], home: ['F3', 'F4'] },
          student: {
            school: 'Ders çalışırken dikkatini çoğu zaman işin üzerinde tutabilirsin.',
            friends: 'Yanında telefon varsa ders çalışırken mesajlara bakmayı çoğu zaman sonraya bırakabilirsin.',
            home: 'Ders çalışmak için dikkatini çeken şeylerden uzak bir yer seçebilir, arada kısa molalar verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders çalışırken dikkatini çoğu zaman işin üzerinde tutabilir.',
            friends: 'Yanında telefon varsa ders çalışırken mesajlara bakmayı çoğu zaman sonraya bırakabilir.',
            home: 'Ders çalışmak için dikkatini çeken şeylerden uzak bir yer seçebilir, arada kısa molalar verebilir.',
          },
        },
      },
    },
    /*
     * Hatalardan öğrenme ve yardım isteme: H1 "Anlamadığım bir konuyu öğretmenime sorarım", H2 "Sınavda ya da ödevde yaptığım
     * yanlışları inceleyip neden yanlış yaptığımı anlamaya çalışırım", H4 "Bir konuyu anlamak için farklı kaynaklara (kitap,
     * video, soru bankası) başvururum" (kullanılmadı: kaynaklara erişim herkeste aynı değildir), H5 "Takıldığımda
     * arkadaşlarımdan ya da ailemden yardım isterim"; ters: H3 "Anlamadığım bir şey olduğunda kimseye sormadan geçerim".
     */
    help: {
      poles: { low: 'Henüz sormadan geçer', high: 'Sorar, hatasından öğrenir' },
      bands: {
        low: {
          from: { school: ['H1', 'H3'], friends: ['H5'], home: ['H2'] },
          student: {
            school: 'Derste anlamadığın bir konuyu öğretmenine sormadan geçebilirsin.',
            friends: 'Bir ödevde takıldığında arkadaşlarından yardım istemeyi pek düşünmeyebilirsin.',
            home: 'Bir sınavda yaptığın yanlışlara sonradan pek bakmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste anlamadığı bir konuyu öğretmenine sormadan geçebilir.',
            friends: 'Bir ödevde takıldığında arkadaşlarından yardım istemeyi pek düşünmeyebilir.',
            home: 'Bir sınavda yaptığı yanlışlara sonradan pek bakmayabilir.',
          },
        },
        average: {
          from: { school: ['H1', 'H3'], friends: ['H5'], home: ['H2'] },
          student: {
            school: 'Anlamadığın bir konuyu bazen öğretmenine sorabilir, bazen sormadan geçebilirsin.',
            friends: 'Takıldığında bazen bir arkadaşından yardım isteyebilir, bazen kendi başına uğraşabilirsin.',
            home: 'Bazı sınavlardaki yanlışlarını inceleyebilir, bazılarına pek bakmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz anlamadığı bir konuyu bazen öğretmenine sorabilir, bazen sormadan geçebilir.',
            friends: 'Takıldığında bazen bir arkadaşından yardım isteyebilir, bazen kendi başına uğraşabilir.',
            home: 'Bazı sınavlardaki yanlışlarını inceleyebilir, bazılarına pek bakmayabilir.',
          },
        },
        high: {
          from: { school: ['H1'], friends: ['H5'], home: ['H2'] },
          student: {
            school: 'Anlamadığın bir konuyu öğretmenine sorabilirsin.',
            friends: 'Bir ödevde takıldığında arkadaşlarından yardım isteyebilirsin.',
            home: 'Bir sınavdaki yanlışlarını inceleyip neden yanlış yaptığını anlamaya çalışabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz anlamadığı bir konuyu öğretmenine sorabilir.',
            friends: 'Bir ödevde takıldığında arkadaşlarından yardım isteyebilir.',
            home: 'Bir sınavdaki yanlışlarını inceleyip neden yanlış yaptığını anlamaya çalışabilir.',
          },
        },
      },
    },
  },
};
