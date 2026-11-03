import type { SurveyDaily } from './types';

/**
 * Heyecan Arayışı: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: özellik (üç yönün de iyi ya da kötü ucu
 * yoktur; lib/reports/daily-parts.ts). Rapor metinlerindeki ilke burada da geçerlidir (src/content/reports/heyecan-arayisi.ts):
 * örnekler riskli davranışı özendirmez. Maddelerdeki tehlikeli etkinlikler (bungee jumping, paraşütle atlama, fırtınada denize
 * açılmak, sert akıntıda kano) örnek olarak yazılmaz; örnekler maddelerin ortak konusunu (korku ve heyecan içeren deneyimler,
 * sıkılmak yerine heyecanı seçmek, anlık kararlar, yeni yerler ve deneyimler) güvenli günlük durumlarla anlatır. Tehlikeye ilgiyi
 * anlatan satırın yanında bir dayanak vardır ("Böyle bir isteği önce onlarla konuşmak", "önlemini almak"). "Risk" iki ölçekte
 * de sorulduğu için düşük düzeylerin örnekleri riskten söz etmez; korku iki ölçekte farklı anlamdadır (tehlikeli heyecanlarda
 * korkutucu deneyimlerin çekiciliği, göze almada kötü hava ve yükseklik karşısında çekinme). Her satırın dayandığı maddeler
 * `from`'dadır.
 * Maddeye doğrudan dayanmayan, sitedeki metinden gelen uzantılar: korkutucu bir film (dan02 "Korkutucu şeyler yapmayı
 * severim"in güvenli bir örneği), düşük tehlikeli heyecanda ve düşük göze almada "gereksiz tehlikelerden uzak tutabilir"
 * (raporun göze alma metni), düşük anlık heyecanda "çevrendekilere güven verebilir" (raporun metni), yüksek göze almada
 * önlem almak (raporun "gerekli önlemlerle birleştiğinde" anlatımı), yüksek tehlikeli heyecanda evdekilerle konuşmak.
 */
export const heyecanArayisiDaily: SurveyDaily = {
  kind: 'survey',
  version: 'heyecan-arayisi-gunluk-1',
  scales: {
    /*
     * Tehlikeli heyecanlara ilgi: dan01 "Tehlikeli durumları çok severim", dan02 "Korkutucu şeyler yapmayı severim", dan04
     * "Bungee jumping yapmayı denemek isterim", dan05 "Açık denizde kaybolmanın heyecanından hoşlanabilirdim", dan06 "Uçaktan
     * paraşütle atlayıp serbest düşüş yapmaktan hoşlanabilirdim", dan07 "Fırtınalı havada denizde bir yelkenlide olmaktan
     * hoşlanırdım", dan08 "Sıkılmaktansa korkmayı tercih ederim"; ters: dan09 "Suç oranı yüksek bir semtte yürümem gerekse
     * korkardım", dan10 "Yamaç paraşütü ya da bungee jumping asla yapmazdım". Örnekler dan02 ve dan08'den yazılır; tehlikeli
     * etkinlikler adıyla anılmaz.
     */
    danger: {
      poles: { low: 'Tehlikeye ilgi duymayan', high: 'Tehlikeye ilgi duyan' },
      bands: {
        low: {
          from: { school: ['dan08'], friends: ['dan02'], home: ['dan02', 'dan10'], work: ['dan08'] },
          student: {
            school: 'Sakin ve olaysız geçen bir ders günü seni pek rahatsız etmeyebilir.',
            friends: 'Arkadaşların korkutucu bir film önerince başka bir şey izlemeyi tercih edebilirsin.',
            home: 'Korku ve tehlike içeren deneyimler sana pek çekici gelmeyebilir; bu seni gereksiz tehlikelerden uzak tutabilir.',
          },
          parent: {
            school: 'Sakin ve olaysız geçen bir ders günü çocuğunuzu pek rahatsız etmeyebilir.',
            friends: 'Arkadaşları korkutucu bir film önerince başka bir şey izlemeyi tercih edebilir.',
            home: 'Korku ve tehlike içeren deneyimler ona pek çekici gelmeyebilir; bu onu gereksiz tehlikelerden uzak tutabilir.',
          },
          adult: {
            work: 'Sakin ve olaysız geçen bir iş günü seni pek rahatsız etmeyebilir.',
          },
        },
        average: {
          from: { school: ['dan08'], friends: ['dan02'], home: ['dan02'], work: ['dan08'] },
          student: {
            school: 'Bazı ders günlerinin sakin geçmesi sana iyi gelebilir, bazılarında biraz heyecan isteyebilirsin.',
            friends: 'Arkadaşlarınla bazen korkutucu bir film izlemek, bazen sakin bir şey seçmek isteyebilirsin.',
            home: 'Korku içeren bazı deneyimler sana çekici gelebilir, bazılarından uzak durmayı seçebilirsin.',
          },
          parent: {
            school: 'Bazı ders günlerinin sakin geçmesi çocuğunuza iyi gelebilir, bazılarında biraz heyecan isteyebilir.',
            friends: 'Arkadaşlarıyla bazen korkutucu bir film izlemek, bazen sakin bir şey seçmek isteyebilir.',
            home: 'Korku içeren bazı deneyimler ona çekici gelebilir, bazılarından uzak durmayı seçebilir.',
          },
          adult: {
            work: 'Bazı iş günlerinin sakin geçmesi sana iyi gelebilir, bazılarında biraz heyecan isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['dan08'], friends: ['dan02'], home: ['dan01', 'dan02'], work: ['dan08'] },
          student: {
            school: 'Tekdüze geçen bir ders gününde sıkılmak yerine biraz heyecan isteyebilirsin.',
            friends: 'Arkadaşlarınla korkutucu bir film izlemek sana keyifli gelebilir.',
            home: 'Evdekilerin tehlikeli bulduğu bir deneyim sana çekici gelebilir. Böyle bir isteği önce onlarla konuşmak iyi gelebilir.',
          },
          parent: {
            school: 'Tekdüze geçen bir ders gününde çocuğunuz sıkılmak yerine biraz heyecan isteyebilir.',
            friends: 'Arkadaşlarıyla korkutucu bir film izlemek ona keyifli gelebilir.',
            home: 'Evdekilerin tehlikeli bulduğu bir deneyim çocuğunuza çekici gelebilir. Böyle bir isteği onunla sakin bir anda konuşmak iyi gelebilir.',
          },
          adult: {
            work: 'Tekdüze geçen bir iş gününde sıkılmak yerine biraz heyecan isteyebilirsin.',
          },
        },
      },
    },
    /*
     * Anlık heyecan arayışı (hepsi düz): imp01 "Çılgınlıklar yaparım", imp02 "Çılgınca şeyler yaparım", imp03 "Beklenmedik
     * şeyler yaparım", imp04 "Aklıma estiği gibi davranmayı severim", imp05 "Saçma şeyler yapmaya kolayca ikna olurum", imp06
     * "Ne yapacağım belli olmaz; insanlar ne söyleyeceğimi asla kestiremez", imp07 "Uçsuz bucaksız hayallere dalmaktan
     * hoşlanırım", imp08 "Başkalarını gerçekten maceralı ya da çılgınca bir şey yapmaya ikna ettiğim olmuştur", imp09 "Macera
     * ararım", imp10 "Risk alırım". Düşük düzeyin örnekleri bu maddelerin düşük cevabını anlatır (anlık davranmamak, ne yapacağı
     * belli olmak); riskten söz etmez.
     */
    impulsive: {
      poles: { low: 'Ölçülü ve öngörülebilir', high: 'Anlık macera arayan' },
      bands: {
        low: {
          from: { school: ['imp06'], friends: ['imp04', 'imp01'], home: ['imp09'], work: ['imp06'] },
          student: {
            school: 'Çevrendekiler, derste senin ne yapacağını çoğu zaman önceden bilebilir; bu onlara güven verebilir.',
            friends: 'Arkadaşların anlık bir eğlence önerince hemen katılmak sana pek çekici gelmeyebilir.',
            home: 'Boş bir günde macera aramak yerine bildiğin bir düzende vakit geçirebilirsin.',
          },
          parent: {
            school: 'Çevresindekiler, derste çocuğunuzun ne yapacağını çoğu zaman önceden bilebilir; bu onlara güven verebilir.',
            friends: 'Arkadaşları anlık bir eğlence önerince hemen katılmak ona pek çekici gelmeyebilir.',
            home: 'Boş bir günde macera aramak yerine bildiği bir düzende vakit geçirebilir.',
          },
          adult: {
            work: 'Çevrendekiler, bir işte senin ne yapacağını çoğu zaman önceden bilebilir; bu onlara güven verebilir.',
          },
        },
        average: {
          from: { school: ['imp03'], friends: ['imp05', 'imp02'], home: ['imp04'], work: ['imp04', 'imp03'] },
          student: {
            school: 'Derste bazen beklenmedik bir şey söyleyebilir, çoğu zaman bildiğin düzende ilerleyebilirsin.',
            friends: 'Arkadaşların çılgınca bir şey önerince bazen katılabilir, bazen geri çevirebilirsin.',
            home: 'Bazı günleri aklına estiği gibi, bazılarını önceden planlayarak geçirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste bazen beklenmedik bir şey söyleyebilir, çoğu zaman bildiği düzende ilerleyebilir.',
            friends: 'Arkadaşları çılgınca bir şey önerince bazen katılabilir, bazen geri çevirebilir.',
            home: 'Bazı günleri aklına estiği gibi, bazılarını önceden planlayarak geçirebilir.',
          },
          adult: {
            work: 'Bazı işleri aklına estiği gibi, bazılarını alıştığın düzende yapabilirsin.',
          },
        },
        high: {
          from: { school: ['imp06', 'imp03'], friends: ['imp05', 'imp02'], home: ['imp04'], work: ['imp03', 'imp04'] },
          student: {
            school: 'Derste beklenmedik bir şey söyleyip çevrendekileri şaşırtabilirsin.',
            friends: 'Arkadaşların saçma ya da çılgınca bir şey önerince kolayca ikna olabilirsin.',
            home: 'Bir günü önceden planlamak yerine aklına estiği gibi geçirmek sana keyifli gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz derste beklenmedik bir şey söyleyip çevresindekileri şaşırtabilir.',
            friends: 'Arkadaşları saçma ya da çılgınca bir şey önerince kolayca ikna olabilir.',
            home: 'Bir günü önceden planlamak yerine aklına estiği gibi geçirmek ona keyifli gelebilir.',
          },
          adult: {
            work: 'Bir işi bazen beklenmedik bir yoldan, aklına estiği gibi yapabilirsin.',
          },
        },
      },
    },
    /*
     * Göze alma ve keşif: cal01 "Tehlike karşısında kendimden emin davranırım", cal02 "Risk almaya istekliyim", cal03 "Yanan
     * bir binadan insanları kurtarmakta başarılı olurdum", cal04 "Alışılmadık yerleri keşfetmeyi çok isterdim", cal05 "Yeni
     * deneyimlere açığım"; ters: cal06 "Fiziksel tehlike karşısında korkak biriyim", cal07 "Kanoyla sert akıntılı bir nehirden
     * aşağı asla inmezdim", cal08 "Hava kötü olduğunda içeride kalmaya çalışırım", cal09 "Yükseklikten korkarım", cal10 "Büyük
     * köpeklerden korkarım".
     */
    venture: {
      poles: { low: 'Güvenli olanı seçen', high: 'Göze alıp keşfeden' },
      bands: {
        low: {
          from: { school: ['cal05'], friends: ['cal04'], home: ['cal08', 'cal09'], work: ['cal02'] },
          student: {
            school: 'Yeni bir etkinliğe katılmadan önce onu biraz tanımak isteyebilirsin.',
            friends: 'Arkadaşların alışılmadık bir yeri keşfetmeyi önerince bildiğin bir yeri seçebilirsin.',
            home: 'Kötü havada ya da yüksek bir yerde temkinli olabilirsin; bu temkin seni gereksiz tehlikelerden uzak tutabilir.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir etkinliğe katılmadan önce onu biraz tanımak isteyebilir.',
            friends: 'Arkadaşları alışılmadık bir yeri keşfetmeyi önerince bildiği bir yeri seçebilir.',
            home: 'Kötü havada ya da yüksek bir yerde temkinli olabilir; bu temkin onu gereksiz tehlikelerden uzak tutabilir.',
          },
          adult: {
            work: 'Risk içeren yeni bir işe girişmeden önce daha güvenli bir yol arayabilirsin.',
          },
        },
        average: {
          from: { school: ['cal05'], friends: ['cal04'], home: ['cal08'], work: ['cal02'] },
          student: {
            school: 'Bazı yeni etkinlikleri hemen deneyebilir, bazılarında önce biraz bekleyebilirsin.',
            friends: 'Arkadaşlarınla bazen alışılmadık bir yeri keşfetmek, bazen bildiğin bir yere gitmek isteyebilirsin.',
            home: 'Kötü havada bazen dışarı çıkabilir, bazen evde kalmayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı yeni etkinlikleri hemen deneyebilir, bazılarında önce biraz bekleyebilir.',
            friends: 'Arkadaşlarıyla bazen alışılmadık bir yeri keşfetmek, bazen bildiği bir yere gitmek isteyebilir.',
            home: 'Kötü havada bazen dışarı çıkabilir, bazen evde kalmayı seçebilir.',
          },
          adult: {
            work: 'Bazı işlerde risk almayı göze alabilir, bazılarında temkinli kalmayı seçebilirsin.',
          },
        },
        high: {
          from: { school: ['cal05'], friends: ['cal04'], home: ['cal08'], work: ['cal02', 'cal05'] },
          student: {
            school: 'Daha önce denemediğin bir etkinliğe ya da kulübe katılmak ilgini çekebilir.',
            friends: 'Arkadaşlarınla alışılmadık bir yeri keşfetmek sana çekici gelebilir.',
            home: 'Hava kötüyken de evde kalmak yerine dışarı çıkmak isteyebilirsin; önlemini almak iyi gelebilir.',
          },
          parent: {
            school: 'Daha önce denemediği bir etkinliğe ya da kulübe katılmak çocuğunuzun ilgisini çekebilir.',
            friends: 'Arkadaşlarıyla alışılmadık bir yeri keşfetmek ona çekici gelebilir.',
            home: 'Hava kötüyken de evde kalmak yerine dışarı çıkmak isteyebilir; önlemini alması iyi gelebilir.',
          },
          adult: {
            work: 'Risk içeren yeni bir işi üstlenmeye istekli olabilirsin; önlemleri önceden düşünmek iyi gelebilir.',
          },
        },
      },
    },
  },
};
