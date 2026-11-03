import type { SurveyDaily } from './types';

/**
 * Çocuk Kişilik Profili: günlük hayatta nasıl görünür (3–5. sınıf; yetişkinlere açık değil).
 * Öğrenci metni 8–9 yaşındaki bir çocuğun anlayacağı kadar somut ve kısadır: teneffüs, oyun, okul çantası, sofra, misafir.
 * Telefon, mesaj ya da kendi odası varsayılmaz (C1 ve C2 maddeleri "odamı" der; örnekler yalnızca eşyalardan söz eder).
 * Sakinliğin okul örnekleri "sınav ya da gösteri" der: 1–4. sınıfta yazılı sınav yapılmaz (MEB Ölçme ve Değerlendirme
 * Yönetmeliği, 2023; incelemenin notu), test 5. sınıfa da açıktır.
 * Dört boyut özellik tonundadır (src/content/reports/cocuk-kisilik.ts: uçlar iyi ya da kötü değildir): düşük ve yüksek
 * düzeyin örneklerinden en az biri bir kolaylık, en az biri yumuşak bir zorluk söyler. Sakinlik gelişim tonundadır (düşük
 * düzeyi destek kutusunu açar; lib/reports/daily-parts.ts, scaleTone): düşük uca uydurma bir güçlü yan, yüksek uca uydurma
 * bir zorluk yazılmaz; zor anı anlatan her örneğin yanında bir dayanak vardır. Merak ve hayal gücünün örnekleri ilgi ve
 * tercihi anlatır, zekâ ya da beceri gibi okunmaz: "Bir şeyi hayal etmek bana zor gelir" (I2) maddesine bilerek
 * dayanılmadı. "Arkadaşlarımla birlikteyken ortamı ben neşelendiririm" (E5) maddesi gruptaki bir rol gibi yazılmaz:
 * örnekler çok konuşup şaka yapmaktan hoşlanmayı anlatır. "Yarım yamalak" (C6) yerine "aceleyle bitirmek" denir. Her
 * satırın dayandığı maddeler `from`'dadır.
 * Maddeye doğrudan dayanmayan, testin ya da raporun kendi metninden gelen uzantılar: başkalarını önemsemede düşük düzeyde
 * "düşündüğünü olduğu gibi söyleyebilirsin" (A4'ün olumlu yanı) ve yüksek düzeyde "kendi oyununa ya da ödevine zaman
 * ayırmayı unutabilirsin" (A3'ün bedeli; raporun yüksek düzey metni de kendi isteğini söyleyebilmeyi önerir), düzende yüksek
 * düzeyde "ortalık karışınca canın sıkılabilir" (C1'in bedeli), merakta "hayallere dalıp işi unutabilirsin" (I1'in bedeli)
 * ve sakinlikteki dayanaklar (raporun "birkaç derin nefes almak", "güvendiğin biriyle paylaşmak" önerileri).
 */
export const cocukKisilikDaily: SurveyDaily = {
  kind: 'survey',
  version: 'cocuk-kisilik-gunluk-1',
  scales: {
    /*
     * Sosyallik: E1 "Yeni tanıştığım bir çocukla konuşmayı ilk ben başlatırım", E3 "Kolayca yeni arkadaş edinirim", E5
     * "Arkadaşlarımla birlikteyken ortamı ben neşelendiririm"; ters: E2 "Tanımadığım bir çocukla konuşmaya başlamak bana zor
     * gelir", E4 "Kalabalık bir grupta geride durmayı severim", E6 "Çoğu zaman az konuşurum".
     */
    extraversion: {
      poles: { low: 'Az konuşur, dinler', high: 'Konuşur, sohbet başlatır' },
      bands: {
        low: {
          from: { school: ['E6'], friends: ['E2'], home: ['E4'] },
          student: {
            school: 'Sınıfta söz almak yerine çoğu zaman arkadaşlarını dinlemeyi seçebilirsin.',
            friends: 'Teneffüste tanımadığın bir çocukla konuşmayı başlatmak sana zor gelebilir.',
            home: 'Kalabalık bir misafirlikte geride durmak sana daha rahat gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta söz almak yerine çoğu zaman arkadaşlarını dinlemeyi seçebilir.',
            friends: 'Teneffüste tanımadığı bir çocukla konuşmayı başlatmak ona zor gelebilir.',
            home: 'Kalabalık bir misafirlikte geride durmak ona daha rahat gelebilir.',
          },
        },
        average: {
          from: { school: ['E1', 'E2'], friends: ['E5', 'E4'], home: ['E6'] },
          student: {
            school: 'Sınıfa yeni gelen biriyle bazen konuşmayı sen başlatabilir, bazen onun yanına gelmesini bekleyebilirsin.',
            friends: 'Arkadaşlarınla oynarken bazen çok konuşup şakalar yapabilir, bazen geride durmayı seçebilirsin.',
            home: 'Kalabalık bir sofrada bazen çok konuşabilir, bazen sessiz kalabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınıfa yeni gelen biriyle bazen konuşmayı kendisi başlatabilir, bazen onun yanına gelmesini bekleyebilir.',
            friends: 'Arkadaşlarıyla oynarken bazen çok konuşup şakalar yapabilir, bazen geride durmayı seçebilir.',
            home: 'Kalabalık bir sofrada bazen çok konuşabilir, bazen sessiz kalabilir.',
          },
        },
        high: {
          from: { school: ['E3'], friends: ['E5', 'E6'], home: ['E4', 'E6'] },
          student: {
            school: 'Yeni bir sınıfa geçince kısa sürede yeni arkadaşlar edinebilirsin.',
            friends: 'Arkadaşlarınla birlikteyken çok konuşup şakalar yapmak sana keyifli gelebilir.',
            home: 'Kalabalık bir misafirlikte geride sessizce oturmak sana sıkıcı gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir sınıfa geçince kısa sürede yeni arkadaşlar edinebilir.',
            friends: 'Arkadaşlarıyla birlikteyken çok konuşup şakalar yapmak ona keyifli gelebilir.',
            home: 'Kalabalık bir misafirlikte geride sessizce oturmak ona sıkıcı gelebilir.',
          },
        },
      },
    },
    /*
     * Başkalarını önemseme: A1 "Bir arkadaşım üzüldüğünde ben de onun için üzülürüm", A3 "Başkalarına yardım etmeyi
     * severim", A5 "Neredeyse herkesle iyi geçinirim"; ters: A2 "Başkalarının ne hissettiğine pek aldırmam", A4 "Bazen
     * arkadaşlarımı kıracak sözler söylerim", A6 "Başkalarının dertlerini dinlemek bana sıkıcı gelir".
     */
    agreeableness: {
      poles: { low: 'Kendi işine odaklanır', high: 'Başkalarına yardım eder' },
      bands: {
        low: {
          from: { school: ['A6'], friends: ['A4'], home: ['A2'] },
          student: {
            school: 'Teneffüste bir arkadaşın derdini uzun uzun anlatınca dinlemek sana sıkıcı gelebilir.',
            friends: 'Düşündüğünü olduğu gibi söyleyebilirsin; bu bazen bir arkadaşını kırabilir.',
            home: 'Evdekilerin ne hissettiğine takılmadan kendi işine devam edebilirsin.',
          },
          parent: {
            school: 'Teneffüste bir arkadaşı derdini uzun uzun anlatınca dinlemek çocuğunuza sıkıcı gelebilir.',
            friends: 'Düşündüğünü olduğu gibi söyleyebilir; bu bazen bir arkadaşını kırabilir.',
            home: 'Evdekilerin ne hissettiğine takılmadan kendi işine devam edebilir.',
          },
        },
        average: {
          from: { school: ['A3'], friends: ['A1', 'A2'], home: ['A5', 'A4'] },
          student: {
            school: 'Sınıfta bazen bir arkadaşına yardım edebilir, bazen önce kendi işini bitirmek isteyebilirsin.',
            friends: 'Bir arkadaşın üzülünce bazen sen de üzülebilir, bazen oyuna devam edebilirsin.',
            home: 'Evdekilerle çoğu zaman iyi geçinebilirsin; bazen ağzından kırıcı bir söz kaçabilir.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta bazen bir arkadaşına yardım edebilir, bazen önce kendi işini bitirmek isteyebilir.',
            friends: 'Bir arkadaşı üzülünce bazen o da üzülebilir, bazen oyuna devam edebilir.',
            home: 'Evdekilerle çoğu zaman iyi geçinebilir; bazen ağzından kırıcı bir söz kaçabilir.',
          },
        },
        high: {
          from: { school: ['A3'], friends: ['A1'], home: ['A3'] },
          student: {
            school: 'Sınıfta yardıma ihtiyacı olan bir arkadaşına seve seve yardım edebilirsin.',
            friends: 'Bir arkadaşın üzülünce sen de onun için üzülebilir, yanında kalmak isteyebilirsin.',
            home: 'Evdekilere yardım ederken kendi oyununa ya da ödevine zaman ayırmayı unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sınıfta yardıma ihtiyacı olan bir arkadaşına seve seve yardım edebilir.',
            friends: 'Bir arkadaşı üzülünce o da onun için üzülebilir, yanında kalmak isteyebilir.',
            home: 'Evdekilere yardım ederken kendi oyununa ya da ödevine zaman ayırmayı unutabilir.',
          },
        },
      },
    },
    /*
     * Düzen ve sorumluluk: C1 "Odamı ve eşyalarımı toplu tutmayı severim", C3 "Bana verilen işleri hemen yaparım", C5 "Okul
     * çantamı bir gün önceden hazırlarım"; ters: C2 "Odamı ve eşyalarımı dağınık bırakırım", C4 "Yapmam gereken işlerden
     * kaçmaya çalışırım", C6 "İşlerimi yarım yamalak yaparım". Kişi "dağınık" diye anılmaz; davranış anlatılır.
     */
    conscientiousness: {
      poles: { low: 'Düzene pek takılmaz', high: 'Düzenli, işini hemen yapar' },
      bands: {
        low: {
          from: { school: ['C5'], friends: ['C1', 'C2'], home: ['C3', 'C6'] },
          student: {
            school: 'Okul çantanı sabah son anda hazırlayabilir, bazen bir şeyi evde unutabilirsin.',
            friends: 'Arkadaşlarınla oynarken ortalık biraz karışınca bu seni pek rahatsız etmeyebilir.',
            home: 'Sana verilen bir işi sonraya bırakabilir ya da aceleyle bitirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okul çantasını sabah son anda hazırlayabilir, bazen bir şeyi evde unutabilir.',
            friends: 'Arkadaşlarıyla oynarken ortalık biraz karışınca bu onu pek rahatsız etmeyebilir.',
            home: 'Kendisine verilen bir işi sonraya bırakabilir ya da aceleyle bitirebilir.',
          },
        },
        average: {
          from: { school: ['C5'], friends: ['C1', 'C2'], home: ['C3'] },
          student: {
            school: 'Okul çantanı bazen bir gün önceden, bazen sabah hazırlayabilirsin.',
            friends: 'Arkadaşlarınla oynadıktan sonra ortalığı bazen toplayabilir, bazen olduğu gibi bırakabilirsin.',
            home: 'Sevdiğin işleri hemen yapabilir, ötekileri sonraya bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okul çantasını bazen bir gün önceden, bazen sabah hazırlayabilir.',
            friends: 'Arkadaşlarıyla oynadıktan sonra ortalığı bazen toplayabilir, bazen olduğu gibi bırakabilir.',
            home: 'Sevdiği işleri hemen yapabilir, ötekileri sonraya bırakabilir.',
          },
        },
        high: {
          from: { school: ['C5'], friends: ['C1'], home: ['C3', 'C6'] },
          student: {
            school: 'Okul çantanı çoğu zaman bir gün önceden hazırlayabilirsin.',
            friends: 'Arkadaşlarınla oynarken ortalık karışınca canın sıkılabilir.',
            home: 'Sana verilen bir işi hemen ve özenle yapmaya çalışabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okul çantasını çoğu zaman bir gün önceden hazırlayabilir.',
            friends: 'Arkadaşlarıyla oynarken ortalık karışınca canı sıkılabilir.',
            home: 'Kendisine verilen bir işi hemen ve özenle yapmaya çalışabilir.',
          },
        },
      },
    },
    /*
     * Sakinlik (gelişim tonu): ES1 "Pek az kızarım", ES3 "Çoğu zaman kendimi sakin ve huzurlu hissederim", ES5 "Üzgün
     * hissettiğim zamanlar azdır"; ters: ES2 "Çabuk kızarım", ES4 "Birçok şey için endişelenirim", ES6 "Çabuk üzülürüm".
     * Düşük düzeyin her örneği bir dayanakla biter; yüksek düzey gerçekten sakin kalmayı anlatır (duyguyu saklamayı değil).
     */
    emotional_stability: {
      poles: { low: 'Duygularını yoğun yaşar', high: 'Çoğu zaman sakin kalır' },
      bands: {
        low: {
          from: { school: ['ES4'], friends: ['ES2', 'ES6'], home: ['ES6', 'ES5'] },
          student: {
            school: 'Bir sınav ya da gösteri yaklaşırken endişelenebilirsin; bunu öğretmenine söylemek iyi gelebilir.',
            friends: 'Bir oyunda işler ters gidince çabuk kızabilir ya da üzülebilirsin; birkaç derin nefes almak iyi gelebilir.',
            home: 'Çabuk üzülebilirsin; seni üzen şeyi güvendiğin bir büyüğüne anlatmak iyi gelebilir.',
          },
          parent: {
            school: 'Bir sınav ya da gösteri yaklaşırken çocuğunuz endişelenebilir; bunu öğretmenine söylemek iyi gelebilir.',
            friends: 'Bir oyunda işler ters gidince çabuk kızabilir ya da üzülebilir; birkaç derin nefes almak iyi gelebilir.',
            home: 'Çabuk üzülebilir; onu üzen şeyi güvendiği bir büyüğüne anlatmak iyi gelebilir.',
          },
        },
        average: {
          from: { school: ['ES3', 'ES4'], friends: ['ES1', 'ES2'], home: ['ES5', 'ES6'] },
          student: {
            school: 'Çoğu gün sakin olabilirsin; bazen bir sınav ya da gösteri için endişelenebilirsin.',
            friends: 'Bir oyunda işler ters gidince bazen sakin kalabilir, bazen kızabilirsin.',
            home: 'Bazı günler üzgün hissedebilirsin; çoğu zaman bu duygu uzun sürmeyebilir.',
          },
          parent: {
            school: 'Çocuğunuz çoğu gün sakin olabilir; bazen bir sınav ya da gösteri için endişelenebilir.',
            friends: 'Bir oyunda işler ters gidince bazen sakin kalabilir, bazen kızabilir.',
            home: 'Bazı günler üzgün hissedebilir; çoğu zaman bu duygu uzun sürmeyebilir.',
          },
        },
        high: {
          from: { school: ['ES3', 'ES4'], friends: ['ES1', 'ES2'], home: ['ES5', 'ES3'] },
          student: {
            school: 'Bir sınav ya da gösteri öncesinde de çoğu zaman sakin ve huzurlu kalabilirsin.',
            friends: 'Bir oyunda işler ters gidince çoğu zaman kızmadan oynamaya devam edebilirsin.',
            home: 'Çoğu gün huzurlu olabilirsin; yine de üzüldüğünde bunu paylaşmak iyi gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir sınav ya da gösteri öncesinde de çoğu zaman sakin ve huzurlu kalabilir.',
            friends: 'Bir oyunda işler ters gidince çoğu zaman kızmadan oynamaya devam edebilir.',
            home: 'Çoğu gün huzurlu olabilir; yine de üzüldüğünde bunu paylaşmak iyi gelebilir.',
          },
        },
      },
    },
    /*
     * Merak ve hayal gücü: I1 "Hayal gücüm çok geniştir", I3 "Bir şeyi yapmanın yeni yollarını bulmayı severim", I5 "Aklıma
     * sık sık yeni fikirler gelir"; ters: I2 "Bir şeyi hayal etmek bana zor gelir" (kullanılmadı: beceri gibi okunmasın), I4
     * "Bir konuyu ayrıntısıyla araştırmak bana sıkıcı gelir", I6 "Bilmediğim konulardaki kitaplardan uzak dururum". Düşük
     * ucun örnekleri ilgiyi ve tercihi anlatır.
     */
    intellect: {
      poles: { low: 'Bildiği konuları sever', high: 'Merak eder, hayal kurar' },
      bands: {
        low: {
          from: { school: ['I4'], friends: ['I3'], home: ['I1'] },
          student: {
            school: 'Derste bir konunun ayrıntılarını araştırmak sana pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarınla yeni bir oyun uydurmak yerine bildiğin bir oyunu oynamak sana keyifli gelebilir.',
            home: 'Hayal kurmak yerine çoğu zaman o an yaptığın işe odaklanabilirsin.',
          },
          parent: {
            school: 'Derste bir konunun ayrıntılarını araştırmak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaşlarıyla yeni bir oyun uydurmak yerine bildiği bir oyunu oynamak ona keyifli gelebilir.',
            home: 'Hayal kurmak yerine çoğu zaman o an yaptığı işe odaklanabilir.',
          },
        },
        average: {
          from: { school: ['I4'], friends: ['I5'], home: ['I1'] },
          student: {
            school: 'İlgini çeken bir konuyu araştırmak isteyebilir, ötekileri kısaca öğrenmeyi seçebilirsin.',
            friends: 'Bir oyunda bazen yeni bir fikir bulabilir, bazen arkadaşının fikrine katılabilirsin.',
            home: 'Bazen hayallere dalabilir, bazen o an yaptığın işle ilgilenebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ilgisini çeken bir konuyu araştırmak isteyebilir, ötekileri kısaca öğrenmeyi seçebilir.',
            friends: 'Bir oyunda bazen yeni bir fikir bulabilir, bazen arkadaşının fikrine katılabilir.',
            home: 'Bazen hayallere dalabilir, bazen o an yaptığı işle ilgilenebilir.',
          },
        },
        high: {
          from: { school: ['I4', 'I6'], friends: ['I5', 'I3'], home: ['I1'] },
          student: {
            school: 'Merak ettiğin bir konunun ayrıntılarını araştırmak ya da onunla ilgili bir kitap okumak isteyebilirsin.',
            friends: 'Oyun oynarken çoğu zaman yeni fikirler ya da yeni kurallar bulabilirsin.',
            home: 'Hayallere dalıp yapman gereken bir işi unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz merak ettiği bir konunun ayrıntılarını araştırmak ya da onunla ilgili bir kitap okumak isteyebilir.',
            friends: 'Oyun oynarken çoğu zaman yeni fikirler ya da yeni kurallar bulabilir.',
            home: 'Hayallere dalıp yapması gereken bir işi unutabilir.',
          },
        },
      },
    },
  },
};
