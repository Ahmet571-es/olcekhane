import { kafaYoranIsler } from './dusunmeyi-sevme-olcegi';
import type { DailyBand, ScaleDaily, SurveyDaily } from './types';

/**
 * Öğrenme ve Başarı Özellikleri: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: özellik (şablon
 * değerlendirici değildir ve destek kutusu yoktur; lib/reports/daily-parts.ts, `scaleTone`). Örnekler kişinin öğrenirken ve
 * çalışırken ne yapmaya yatkın olduğunu maddelerin söylediği kadar anlatır; bir düzeyi bir öğretme biçimiyle ya da "en iyi
 * öğrenme yolu"yla eşleştirmez, bir yetenek ya da başarı söylemez.
 *
 * Şablonun çelişmezlik ilkesi (src/content/reports/ogrenme-ve-basari.ts) örneklerde de geçerlidir: iş zorlaşınca bırakmak
 * yalnızca Çaba ve sebat'ta, zorluklar karşısında kendine güven yalnızca Zorlukla başa çıkma'da anlatılır. Bu yüzden Zorlukla
 * başa çıkma'nın "Kolayca pes ederim" (comp07), "İşleri sonuna kadar götürmem" (comp09) ve "Kendimi elimdeki işe veremem"
 * (comp08) maddeleri, Çaba ve sebat'ın "Bir işi yapmaya hemen başlarım" (dili02; İşe hemen koyulma'yla çakışır) maddesi,
 * Planlı ve dikkatli çalışma'nın "Düşünmeden işlere atılırım" (plan06; İşe hemen koyulma'nın düşük ucuyla çelişebilirdi)
 * maddesi örneklere kaynak olmaz. Öğrenmeye açıklık, Düşünmekten hoşlanma ile örtüşmesin diye soyut ve teorik tartışma
 * (open07, open08) ve derin anlam (open10) maddelerini değil; çeşitliliği, değişimi ve bilgiyi artırmayı anlatır. "Sohbetin
 * seviyesini yükseltirim" (open01) bir üstünlük gibi okunabileceği için kullanılmadı.
 *
 * Düşünmekten hoşlanma: Düşünmeyi Sevme Ölçeği'nin aynı on maddesidir (n01–n10 = ncog01–ncog10, aynı çeviri ve sıra); örnekler
 * ve gerekçeleri dusunmeyi-sevme-olcegi.ts'tedir, burada yalnızca madde anahtarları çevrilir.
 *
 * Özellik tonunda her uçta bir kolaylık ve bir zorluk aranır; maddelere dayanmayan bir güçlü yan uydurulmadı. Zorlukla başa
 * çıkma'nın düşük ucundaki kolaylık bir rahatlıktır ("güvendiğin işi seçmek sana daha rahat gelebilir"); öteki maddeler o
 * uçta bir güçlü yan söylemez. Maddeye doğrudan dayanmayan, ucun doğal karşılığı olan uzantılar: Çaba ve sebat'ta "kalan
 * zamanını başka şeylere ayırabilirsin" (dili06'nın kolay yanı) ve "yorulabilirsin" (dili01'in bedeli); İşe hemen koyulma'da
 * arkadaşların bir işi sonraya bırakmak istemesinin "pek uygun gelmeyebilir" oluşu (init02 ve init10'un öbür yüzü);
 * Planlı ve dikkatli çalışma'da "esneklik" (plan08'in kolay yanı; şablondaki "kendiliğindenlik bazı durumlarda işe yarar");
 * Zorlukla başa çıkma'da "hepsine yetişmek bazen zor olabilir" (comp02 ve comp03'ün bedeli).
 */

/** Düşünmeyi Sevme Ölçeği'nin anahtarları (n01) bu testte ncog01'dir. */
const ncog = (keys: string[]) => keys.map((k) => k.replace(/^n/, 'ncog'));
const ncogBand = (b: DailyBand): DailyBand => ({
  ...b,
  from: {
    school: ncog(b.from.school),
    friends: ncog(b.from.friends),
    home: ncog(b.from.home),
    ...(b.from.work ? { work: ncog(b.from.work) } : {}),
  },
});
const needForCognition: ScaleDaily = {
  poles: kafaYoranIsler.poles,
  bands: { low: ncogBand(kafaYoranIsler.bands.low), average: ncogBand(kafaYoranIsler.bands.average), high: ncogBand(kafaYoranIsler.bands.high) },
};

export const ogrenmeVeBasariDaily: SurveyDaily = {
  kind: 'survey',
  version: 'ogrenme-ve-basari-gunluk-1',
  scales: {
    /*
     * Çaba ve sebat: dili01 "Başarılı olmak için kendimi çok zorlarım", dili02 "Bir işi yapmaya hemen başlarım" (kullanılmadı),
     * dili03 "Yaptığım işte titizimdir", dili04 "Çok çalışırım", dili05 "Üstlendiğim işleri başarıyla tamamlarım"; ters: dili06
     * "Sadece idare edecek kadar çalışırım", dili07 "Yaptığım iş çok zorlaşınca bırakırım", dili08 "Gereğinden az çalışırım",
     * dili09 "Hiçbir şey yapmadan boş boş vakit geçiririm", dili10 "Başladığım işlere olan ilgimi çabuk kaybederim".
     */
    diligence: {
      poles: { low: 'Yetecek kadar çalışır', high: 'Çok çalışır, bırakmaz' },
      bands: {
        low: {
          from: { school: ['dili07'], friends: ['dili10'], home: ['dili06'], work: ['dili07'] },
          student: {
            school: 'Çalıştığın bir konu çok zorlaşınca onu yarıda bırakabilirsin.',
            friends: 'Arkadaşlarınla başladığın yeni bir uğraşa ilgin çabuk azalabilir.',
            home: 'Bir işin yetecek kadarını yapıp kalan zamanını başka şeylere ayırabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz çalıştığı bir konu çok zorlaşınca onu yarıda bırakabilir.',
            friends: 'Arkadaşlarıyla başladığı yeni bir uğraşa ilgisi çabuk azalabilir.',
            home: 'Bir işin yetecek kadarını yapıp kalan zamanını başka şeylere ayırabilir.',
          },
          adult: {
            work: 'Bir görev çok zorlaşınca onu yarıda bırakabilirsin.',
          },
        },
        average: {
          from: { school: ['dili04', 'dili06'], friends: ['dili07'], home: ['dili04', 'dili09'], work: ['dili04', 'dili06'] },
          student: {
            school: 'Bazı derslerde çok emek verebilir, bazılarında yetecek kadar çalışabilirsin.',
            friends: 'Arkadaşlarınla yaptığın bir iş zorlaşınca bazen sürdürebilir, bazen bırakabilirsin.',
            home: 'Bazı günler çok iş yapabilir, bazı günler pek bir şey yapmadan vakit geçirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde çok emek verebilir, bazılarında yetecek kadar çalışabilir.',
            friends: 'Arkadaşlarıyla yaptığı bir iş zorlaşınca bazen sürdürebilir, bazen bırakabilir.',
            home: 'Bazı günler çok iş yapabilir, bazı günler pek bir şey yapmadan vakit geçirebilir.',
          },
          adult: {
            work: 'Bazı işlerde çok emek verebilir, bazılarında yetecek kadarını yapabilirsin.',
          },
        },
        high: {
          from: { school: ['dili07', 'dili04'], friends: ['dili03', 'dili05'], home: ['dili01', 'dili03'], work: ['dili07', 'dili03'] },
          student: {
            school: 'Çalıştığın bir konu zorlaştığında da bırakmadan sürdürmeye çalışabilirsin.',
            friends: 'Arkadaşlarınla bir proje yaparken üstlendiğin kısmı titizlikle bitirmeye çalışabilirsin.',
            home: 'Bir ev işini de en iyi biçimde yapmak için kendini çok zorlayıp yorulabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz çalıştığı bir konu zorlaştığında da bırakmadan sürdürmeye çalışabilir.',
            friends: 'Arkadaşlarıyla bir proje yaparken üstlendiği kısmı titizlikle bitirmeye çalışabilir.',
            home: 'Bir ev işini de en iyi biçimde yapmak için kendini çok zorlayıp yorulabilir.',
          },
          adult: {
            work: 'Bir görev zorlaştığında da onu bırakmadan, titizlikle sürdürmeye çalışabilirsin.',
          },
        },
      },
    },
    /*
     * İşe hemen koyulma: init01 "İşleri çabuk bitiririm", init02 "Yapmam gereken işleri hemen hallederim", init03 "Hemen işe
     * koyulurum", init04 "İşlere bütün gönlümle dalarım", init05 "Görevlerimi kısa sürede tamamlarım", init06 "Görevlerime
     * vakit kaybetmeden başlarım"; ters: init07 "İşlere başlamakta zorlanırım", init08 "Bir işe başlamam için birinin beni
     * dürtmesi gerekir", init09 "Oturup çalışmaya başlamak bana zor gelir", init10 "Hoşa gitmeyen işleri ertelerim".
     * Düşük uçtaki kolaylık init08'den gelir: biri hatırlatınca işe koyulmak kolaylaşabilir.
     */
    initiative: {
      poles: { low: 'Başlamayı sonraya bırakır', high: 'Hemen işe koyulur' },
      bands: {
        low: {
          from: { school: ['init09'], friends: ['init08'], home: ['init10'], work: ['init07'] },
          student: {
            school: 'Oturup ders çalışmaya başlamak sana zor gelebilir.',
            friends: 'Bir arkadaşın “Hadi başlayalım” deyince işe koyulmak sana kolay gelebilir.',
            home: 'Hoşuna gitmeyen bir ev işini sonraya bırakabilirsin.',
          },
          parent: {
            school: 'Oturup ders çalışmaya başlamak çocuğunuza zor gelebilir.',
            friends: 'Bir arkadaşı “Hadi başlayalım” deyince işe koyulmak ona kolay gelebilir.',
            home: 'Hoşuna gitmeyen bir ev işini sonraya bırakabilir.',
          },
          adult: {
            work: 'Yapman gereken bir işe başlamak sana zor gelebilir.',
          },
        },
        average: {
          from: { school: ['init06', 'init10'], friends: ['init08'], home: ['init02', 'init10'], work: ['init03', 'init10'] },
          student: {
            school: 'Sevdiğin derslerin ödevine hemen başlayabilir, ötekileri sonraya bırakabilirsin.',
            friends: 'Bazen işe kendiliğinden koyulabilir, bazen bir arkadaşının seni harekete geçirmesini bekleyebilirsin.',
            home: 'Yapman gereken işlerin bir kısmını hemen halledip bir kısmını sonraya bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sevdiği derslerin ödevine hemen başlayabilir, ötekileri sonraya bırakabilir.',
            friends: 'Bazen işe kendiliğinden koyulabilir, bazen bir arkadaşının onu harekete geçirmesini bekleyebilir.',
            home: 'Yapması gereken işlerin bir kısmını hemen halledip bir kısmını sonraya bırakabilir.',
          },
          adult: {
            work: 'Hoşuna giden işlere hemen başlayabilir, ötekileri sonraya bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['init06'], friends: ['init02', 'init10'], home: ['init02'], work: ['init06'] },
          student: {
            school: 'Bir ödev verildiğinde ona vakit kaybetmeden başlayabilirsin.',
            friends: 'Arkadaşların ortak bir işi sonraya bırakmak isteyince bu sana pek uygun gelmeyebilir.',
            home: 'Yapman gereken ev işlerini çoğu zaman hemen halledebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir ödev verildiğinde ona vakit kaybetmeden başlayabilir.',
            friends: 'Arkadaşları ortak bir işi sonraya bırakmak isteyince bu ona pek uygun gelmeyebilir.',
            home: 'Yapması gereken ev işlerini çoğu zaman hemen halledebilir.',
          },
          adult: {
            work: 'Sana bir görev verildiğinde ona vakit kaybetmeden başlayabilirsin.',
          },
        },
      },
    },
    /*
     * Planlı ve dikkatli çalışma: plan01 "Önceden plan yapmayı severim", plan02 "İşleri usulüne uygun yaparım", plan04
     * "Ayrıntılara dikkat ederim", plan05 "Plan yapar ve planıma bağlı kalırım"; ters: plan06 "Düşünmeden işlere atılırım"
     * (kullanılmadı), plan07 "Aklıma estiği gibi davranmayı severim", plan08 "Planlarımı sık sık son dakikada yaparım", plan09
     * "Aceleci kararlar veririm", plan10 "İşleri birbirine karıştırırım".
     */
    planfulness: {
      poles: { low: 'Anına göre davranır', high: 'Planlı ve dikkatli ilerler' },
      bands: {
        low: {
          from: { school: ['plan08', 'plan10'], friends: ['plan07'], home: ['plan08'], work: ['plan08'] },
          student: {
            school: 'Bir projenin planını son dakikada yapabilir, işleri bazen birbirine karıştırabilirsin.',
            friends: 'Arkadaşların anlık bir öneride bulununca plansız da olsa hemen katılabilirsin.',
            home: 'Hafta sonu ne yapacağına çoğu zaman o an karar verebilirsin; bu sana esneklik sağlayabilir.',
          },
          parent: {
            school: 'Çocuğunuz bir projenin planını son dakikada yapabilir, işleri bazen birbirine karıştırabilir.',
            friends: 'Arkadaşları anlık bir öneride bulununca plansız da olsa hemen katılabilir.',
            home: 'Hafta sonu ne yapacağına çoğu zaman o an karar verebilir; bu ona esneklik sağlayabilir.',
          },
          adult: {
            work: 'Bir işin planını çoğu zaman son dakikada yapabilirsin.',
          },
        },
        average: {
          from: { school: ['plan01', 'plan08'], friends: ['plan01', 'plan07'], home: ['plan02', 'plan07'], work: ['plan01', 'plan08'] },
          student: {
            school: 'Önemli bir sınav için önceden plan yapabilir, küçük işlerin planını son dakikaya bırakabilirsin.',
            friends: 'Arkadaşlarınla buluşurken bazen önceden plan yapabilir, bazen o an karar verebilirsin.',
            home: 'Bazı işleri usulüne uygun, bazılarını aklına estiği gibi yapabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz önemli bir sınav için önceden plan yapabilir, küçük işlerin planını son dakikaya bırakabilir.',
            friends: 'Arkadaşlarıyla buluşurken bazen önceden plan yapabilir, bazen o an karar verebilir.',
            home: 'Bazı işleri usulüne uygun, bazılarını aklına estiği gibi yapabilir.',
          },
          adult: {
            work: 'Önemli işlerde önceden plan yapabilir, küçük işlerin planını son dakikaya bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['plan05', 'plan04'], friends: ['plan01', 'plan08'], home: ['plan09'], work: ['plan05', 'plan04'] },
          student: {
            school: 'Bir projeyi önceden planlayıp plana bağlı kalabilir, ayrıntılara dikkat edebilirsin.',
            friends: 'Arkadaşlarınla bir şeyi önceden planlamayı sevebilirsin; son anda yapılan planlar sana pek uymayabilir.',
            home: 'Önemli bir karar verirken acele etmeden düşünmeyi seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir projeyi önceden planlayıp plana bağlı kalabilir, ayrıntılara dikkat edebilir.',
            friends: 'Arkadaşlarıyla bir şeyi önceden planlamayı sevebilir; son anda yapılan planlar ona pek uymayabilir.',
            home: 'Önemli bir karar verirken acele etmeden düşünmeyi seçebilir.',
          },
          adult: {
            work: 'Bir işi önceden planlayıp plana bağlı kalabilir, ayrıntılara dikkat edebilirsin.',
          },
        },
      },
    },
    /*
     * Zorlukla başa çıkma: comp02 "Kendimi her işi yapabilecek güçte hissederim", comp03 "Birçok farklı işi yapabilirim",
     * comp04 "Zorlu görevleri kabul ederim", comp05 "Bildiklerimi nasıl uygulayacağımı bilirim", comp06 "Karşıma çıkan
     * zorlukların üstesinden gelirim"; ters (kullanılmadı, yukarıdaki gerekçeyle): comp07 "Kolayca pes ederim", comp08 "Kendimi
     * elimdeki işe veremem", comp09 "İşleri sonuna kadar götürmem". Örnekler bir beceriyi değil, kendine güveni anlatır.
     */
    competence: {
      poles: { low: 'Zor işe temkinli yaklaşır', high: 'Zor işe güvenle yaklaşır' },
      bands: {
        low: {
          from: { school: ['comp04'], friends: ['comp02', 'comp03'], home: ['comp06'], work: ['comp04'] },
          student: {
            school: 'Bir projede zor kısmı üstlenmek yerine güvendiğin kısmı seçmek sana daha rahat gelebilir.',
            friends: 'Arkadaşlarınla daha önce yapmadığın bir işe girişirken bunu yapabileceğinden emin olmayabilirsin.',
            home: 'Beklenmedik bir sorun çıkınca üstesinden gelebileceğinden pek emin olmayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir projede zor kısmı üstlenmek yerine güvendiği kısmı seçmeyi daha rahat bulabilir.',
            friends: 'Arkadaşlarıyla daha önce yapmadığı bir işe girişirken bunu yapabileceğinden emin olmayabilir.',
            home: 'Beklenmedik bir sorun çıkınca üstesinden gelebileceğinden pek emin olmayabilir.',
          },
          adult: {
            work: 'Zorlu bir görev yerine güvendiğin işleri üstlenmek sana daha rahat gelebilir.',
          },
        },
        average: {
          from: { school: ['comp04'], friends: ['comp02'], home: ['comp06'], work: ['comp04'] },
          student: {
            school: 'Bazı derslerde zorlu bir görevi hevesle üstlenebilir, bazılarında çekinebilirsin.',
            friends: 'Arkadaşlarınla yeni bir işe girişirken bazen kendine güvenebilir, bazen emin olamayabilirsin.',
            home: 'Karşına çıkan bazı sorunları çözebileceğine güvenebilir, bazılarında emin olamayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde zorlu bir görevi hevesle üstlenebilir, bazılarında çekinebilir.',
            friends: 'Arkadaşlarıyla yeni bir işe girişirken bazen kendine güvenebilir, bazen emin olamayabilir.',
            home: 'Karşısına çıkan bazı sorunları çözebileceğine güvenebilir, bazılarında emin olamayabilir.',
          },
          adult: {
            work: 'Bazı zorlu görevleri hevesle üstlenebilir, bazılarından çekinebilirsin.',
          },
        },
        high: {
          from: { school: ['comp04'], friends: ['comp02', 'comp03'], home: ['comp06'], work: ['comp04', 'comp06'] },
          student: {
            school: 'Zorlu bir proje ya da görev önerildiğinde onu üstlenmeye istekli olabilirsin.',
            friends: 'Arkadaşlarınla bir iş yaparken pek çok görevi birden üstlenebilirsin; hepsine yetişmek bazen zor olabilir.',
            home: 'Beklenmedik bir sorun çıkınca üstesinden gelebileceğine güvenebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz zorlu bir proje ya da görev önerildiğinde onu üstlenmeye istekli olabilir.',
            friends: 'Arkadaşlarıyla bir iş yaparken pek çok görevi birden üstlenebilir; hepsine yetişmek bazen zor olabilir.',
            home: 'Beklenmedik bir sorun çıkınca üstesinden gelebileceğine güvenebilir.',
          },
          adult: {
            work: 'Zorlu bir görev önerildiğinde onu üstlenmeye ve üstesinden gelmeye istekli olabilirsin.',
          },
        },
      },
    },
    need_for_cognition: needForCognition,
    /*
     * Öğrenmeye açıklık: open01 "Sohbetin seviyesini yükseltirim" (kullanılmadı), open02 "Pek çok şeye ilgi duyarım", open03
     * "Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim", open04 "Bilgimi artırmak isterim", open05 "Değişime
     * açığımdır"; ters: open06 "Bildiğim şeylere bağlı kalmayı tercih ederim", open07 "Soyut fikirler ilgimi çekmez", open08
     * "Teorik tartışmalar ilgimi çekmez", open10 "Olaylarda daha derin bir anlam pek aramam" (son üçü kullanılmadı).
     */
    openness: {
      poles: { low: 'Bildiğine bağlı kalır', high: 'Yeniyi öğrenmek ister' },
      bands: {
        low: {
          from: { school: ['open06'], friends: ['open03'], home: ['open05'], work: ['open06'] },
          student: {
            school: 'Derslerde bildiğin şeylere bağlı kalmak sana güven verebilir.',
            friends: 'Arkadaşların değişik bir etkinlik önerince alıştığın şeyleri yapmayı seçebilirsin.',
            home: 'Alıştığın düzen birden değişince buna alışmak biraz zaman alabilir.',
          },
          parent: {
            school: 'Derslerde bildiği şeylere bağlı kalmak çocuğunuza güven verebilir.',
            friends: 'Arkadaşları değişik bir etkinlik önerince alıştığı şeyleri yapmayı seçebilir.',
            home: 'Alıştığı düzen birden değişince buna alışması biraz zaman alabilir.',
          },
          adult: {
            work: 'İşinde bildiğin şeylere bağlı kalmak sana güven verebilir.',
          },
        },
        average: {
          from: { school: ['open04'], friends: ['open03'], home: ['open05'], work: ['open04'] },
          student: {
            school: 'Bazı derslerde konunun fazlasını öğrenmek isteyebilir, bazılarında bildiğin kadarı sana yetebilir.',
            friends: 'Arkadaşlarınla bazen değişik bir şey denemeyi, bazen alıştığın şeyleri yapmayı seçebilirsin.',
            home: 'Hayatındaki bazı değişiklikleri merakla karşılayabilir, bazılarını istemeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde konunun fazlasını öğrenmek isteyebilir, bazılarında bildiği kadarı ona yetebilir.',
            friends: 'Arkadaşlarıyla bazen değişik bir şey denemeyi, bazen alıştığı şeyleri yapmayı seçebilir.',
            home: 'Hayatındaki bazı değişiklikleri merakla karşılayabilir, bazılarını istemeyebilir.',
          },
          adult: {
            work: 'Bazı konularda bilgini artırmak isteyebilir, bazılarında bildiğin kadarı sana yetebilir.',
          },
        },
        high: {
          from: { school: ['open04'], friends: ['open02'], home: ['open03'], work: ['open04', 'open05'] },
          student: {
            school: 'Bir derste öğrendiğin konunun devamını merak edip bilgini artırmak isteyebilirsin.',
            friends: 'Arkadaşlarınla konuşurken pek çok farklı konu ilgini çekebilir.',
            home: 'Her gün aynı şeyleri yapmak sana çabuk sıkıcı gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir derste öğrendiği konunun devamını merak edip bilgisini artırmak isteyebilir.',
            friends: 'Arkadaşlarıyla konuşurken pek çok farklı konu ilgisini çekebilir.',
            home: 'Her gün aynı şeyleri yapmak ona çabuk sıkıcı gelebilir.',
          },
          adult: {
            work: 'İşinle ilgili yeni bilgiler öğrenmek ve yeni bir yöntemi denemek sana keyifli gelebilir.',
          },
        },
      },
    },
  },
};
