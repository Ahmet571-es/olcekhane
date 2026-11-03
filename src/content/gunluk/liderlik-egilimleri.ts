import type { SurveyDaily } from './types';

/**
 * Liderlik Eğilimleri: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: özellik (lib/reports/daily-parts.ts).
 * Rapor metinlerindeki ilkeler burada da geçerlidir (src/content/reports/liderlik-egilimleri.ts): örnekler eğilimleri
 * maddelerin söylediği gibi anlatır; liderlik becerisi, liderlik yeteneği ya da "lider olmaya uygun" olmak gibi bir şey
 * söylemez, kimseyi bir grupta sıraya koymaz ("ilk sen", "… kişi sen olabilirsin" yok); "lider", "liderlik" ve "beceri"
 * sözcükleri geçmez. Her yönün örnekleri yalnızca kendi maddelerinin konusundan söz eder: öne çıkıp yön vermenin örnekleri
 * topluluk önünde konuşmaktan ve işleri sürdürmekten, sosyal cesaretin örnekleri yön vermekten ve kararlardan, kararlılık ve
 * sorumluluğun örnekleri yön vermekten ve konuşmaktan söz etmez. "Liderlik yeteneğim var" (ces04) ve "Güçlü bir kişiliğim
 * var" (ces05) maddelerine dayanılmadı (yetenek ve kişi tanımı gibi okunmasın). Her satırın dayandığı maddeler `from`'dadır.
 * Maddeye doğrudan dayanmayan, raporun metninden gelen uzantılar: yönü başkalarına bırakırken "işe katkı vermek" (raporun
 * düşük düzey metni), idareyi ele almanın "işlerin harekete geçmesine yardım" etmesi (raporun yüksek düzey metni), ilgi
 * odağı olmaktan rahatsız olmayanda "sözü başkalarına bırakmak da iyi gelebilir" (raporun çok konuşma üzerine araştırma
 * notu).
 * Kararlılık ve sorumluluğun düşük ucu: maddelerin hepsi bu ucu zorluk olarak sorar; maddede olmayan bir güçlü yan
 * uydurulmadı. Bu uçta tek kolaylık, planı değiştirmenin rahatsız etmemesidir (kar02'nin düşük cevabı; Beş Faktör'deki
 * sorumluluğun düşük ucuyla aynı yorum).
 */
export const liderlikEgilimleriDaily: SurveyDaily = {
  kind: 'survey',
  version: 'liderlik-egilimleri-gunluk-1',
  scales: {
    /*
     * Öne çıkıp yön verme: yon01 "İdareyi ele alırım", yon02 "İşlerin başında ben olmak isterim", yon03 "Başkalarına
     * liderlik etmeye çalışırım", yon04 "Başkalarını bir şeyler yapmaya ikna edebilirim"; ters: yon05 "Yolu başkalarının
     * göstermesini beklerim", yon06 "Kararları başkalarına bırakırım".
     */
    lead: {
      poles: { low: 'Yönü başkalarına bırakan', high: 'Öne çıkıp yön veren' },
      bands: {
        low: {
          from: { school: ['yon05', 'yon06'], friends: ['yon06'], home: ['yon05'], work: ['yon05', 'yon06'] },
          student: {
            school: 'Bir grup ödevinde yönü başkalarının belirlemesine izin verip işe katkı verebilirsin.',
            friends: 'Arkadaşlarınla bir plan yapılırken kararı başkalarına bırakabilirsin; sonuç bazen senin istediğinden farklı olabilir.',
            home: 'Evdekilerle bir iş yapılırken yolu başkalarının göstermesini bekleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir grup ödevinde yönü başkalarının belirlemesine izin verip işe katkı verebilir.',
            friends: 'Arkadaşlarıyla bir plan yapılırken kararı başkalarına bırakabilir; sonuç bazen onun istediğinden farklı olabilir.',
            home: 'Evdekilerle bir iş yapılırken yolu başkalarının göstermesini bekleyebilir.',
          },
          adult: {
            work: 'Bir işte yönü başkalarına bırakıp üzerine düşeni yapabilirsin.',
          },
        },
        average: {
          from: { school: ['yon01', 'yon05'], friends: ['yon04', 'yon06'], home: ['yon02'], work: ['yon01', 'yon06'] },
          student: {
            school: 'Bazı grup ödevlerinde idareyi ele alabilir, bazılarında yönü başkalarına bırakabilirsin.',
            friends: 'Arkadaşlarınla plan yaparken bazen bir öneriyi kabul ettirebilir, bazen kararı başkalarına bırakabilirsin.',
            home: 'Evdeki bazı işlerin başında olmak isteyebilir, bazılarını başkalarına bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı grup ödevlerinde idareyi ele alabilir, bazılarında yönü başkalarına bırakabilir.',
            friends: 'Arkadaşlarıyla plan yaparken bazen bir öneriyi kabul ettirebilir, bazen kararı başkalarına bırakabilir.',
            home: 'Evdeki bazı işlerin başında olmak isteyebilir, bazılarını başkalarına bırakabilir.',
          },
          adult: {
            work: 'Bazı işlerde idareyi ele alabilir, bazılarında kararı başkalarına bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['yon01', 'yon02'], friends: ['yon04'], home: ['yon06'], work: ['yon01', 'yon02'] },
          student: {
            school: 'Bir grup ödevinde idareyi ele almak isteyebilirsin; bu işlerin harekete geçmesine yardım edebilir.',
            friends: 'Arkadaşlarını bir plana katılmaya ikna edebilirsin.',
            home: 'Evdekilerle bir plan yapılırken kararı başkalarına bırakmak sana zor gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz bir grup ödevinde idareyi ele almak isteyebilir; bu işlerin harekete geçmesine yardım edebilir.',
            friends: 'Arkadaşlarını bir plana katılmaya ikna edebilir.',
            home: 'Evdekilerle bir plan yapılırken kararı başkalarına bırakmak ona zor gelebilir.',
          },
          adult: {
            work: 'Bir işte idareyi ele almak isteyebilirsin; bu işlerin harekete geçmesine yardım edebilir.',
          },
        },
      },
    },
    /*
     * Sosyal cesaret: ces01 "Hazırlıksız konuşma yapmakta iyiyim", ces02 "İlgi odağı olmak beni rahatsız etmez", ces03
     * "İnsanların arasında kendimi rahat hissederim", ces04 "Liderlik yeteneğim var", ces05 "Güçlü bir kişiliğim var"; ters:
     * ces06 "Topluluk önünde konuşma yapmam gerekse korkardım", ces07 "Kalabalıkta geri planda kalmayı tercih ederim", ces08
     * "Başkalarının yanına gidip konuşmakta zorlanırım", ces09 "İlgi odağı olmaktan nefret ederim", ces10 "Genellikle
     * söyleyecek pek bir şeyim olmaz". Hazırlıksız konuşma (ces01) bir beceri gibi değil, kolay gelme ya da tedirgin etme
     * duygusu olarak anlatılır.
     */
    bold: {
      poles: { low: 'Geri planda kalmayı seven', high: 'Topluluk önünde rahat' },
      bands: {
        low: {
          from: { school: ['ces06', 'ces01'], friends: ['ces07', 'ces08'], home: ['ces09', 'ces07'], work: ['ces06', 'ces01'] },
          student: {
            school: 'Sınıfın önünde konuşmak ya da hazırlıksız söz almak seni tedirgin edebilir.',
            friends: 'Kalabalık bir grupta geri planda kalmayı seçebilir, tanımadığın birinin yanına gitmeyi zor bulabilirsin.',
            home: 'İlgi odağı olmadığın sakin bir ortam sana çoğu zaman iyi gelebilir.',
          },
          parent: {
            school: 'Sınıfın önünde konuşmak ya da hazırlıksız söz almak çocuğunuzu tedirgin edebilir.',
            friends: 'Kalabalık bir grupta geri planda kalmayı seçebilir, tanımadığı birinin yanına gitmeyi zor bulabilir.',
            home: 'İlgi odağı olmadığı sakin bir ortam ona çoğu zaman iyi gelebilir.',
          },
          adult: {
            work: 'Bir toplulukta söz almak ya da hazırlıksız konuşmak seni tedirgin edebilir.',
          },
        },
        average: {
          from: { school: ['ces06', 'ces01'], friends: ['ces08', 'ces03'], home: ['ces02', 'ces09'], work: ['ces06', 'ces01'] },
          student: {
            school: 'Bazı derslerde rahatça söz alabilir, kalabalık önünde konuşurken bazen gerilebilirsin.',
            friends: 'Tanıdığın kişilerin arasında rahat olabilir, tanımadığın birinin yanına gitmeyi bazen zor bulabilirsin.',
            home: 'Evdekilerle bir sohbette bazen ilgi odağı olabilir, bazen geri planda kalmayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde rahatça söz alabilir, kalabalık önünde konuşurken bazen gerilebilir.',
            friends: 'Tanıdığı kişilerin arasında rahat olabilir, tanımadığı birinin yanına gitmeyi bazen zor bulabilir.',
            home: 'Evdekilerle bir sohbette bazen ilgi odağı olabilir, bazen geri planda kalmayı seçebilir.',
          },
          adult: {
            work: 'Bazı topluluklarda rahatça söz alabilir, kalabalık önünde konuşurken bazen gerilebilirsin.',
          },
        },
        high: {
          from: { school: ['ces06', 'ces01'], friends: ['ces08', 'ces03'], home: ['ces02'], work: ['ces01', 'ces06'] },
          student: {
            school: 'Sınıfın önünde konuşmak seni çoğu zaman korkutmayabilir; hazırlıksız söz almak da sana kolay gelebilir.',
            friends: 'Tanımadığın birinin yanına gidip konuşmak sana zor gelmeyebilir.',
            home: 'Evdekilerin arasında ilgi odağı olmak seni rahatsız etmeyebilir; bazen sözü başkalarına bırakmak da iyi gelebilir.',
          },
          parent: {
            school: 'Sınıfın önünde konuşmak çocuğunuzu çoğu zaman korkutmayabilir; hazırlıksız söz almak da ona kolay gelebilir.',
            friends: 'Tanımadığı birinin yanına gidip konuşmak ona zor gelmeyebilir.',
            home: 'Evdekilerin arasında ilgi odağı olmak onu rahatsız etmeyebilir; bazen sözü başkalarına bırakmak da iyi gelebilir.',
          },
          adult: {
            work: 'Bir toplulukta hazırlıksız söz almak ya da herkesin önünde konuşmak sana çoğu zaman kolay gelebilir.',
          },
        },
      },
    },
    /*
     * Kararlılık ve sorumluluk: kar01 "Her zaman hazırlıklı olurum", kar02 "Yaptığım planları uygularım", kar03 "Hemen işe
     * koyulurum", kar04 "Dikkatim kolay kolay dağılmaz", kar05 "İşleri sorunsuz bir şekilde hallederim"; ters: kar06 "İşleri
     * birbirine karıştırırım", kar07 "Dikkatim kolayca dağılır", kar08 "İşleri yüzüme gözüme bulaştırırım", kar09
     * "Sorumluluklarımdan kaçarım", kar10 "İşleri sonuna kadar götürmem", kar11 "Yapmam gerekenleri son ana bırakırım", kar12
     * "Karar vermekte zorlanırım". Uçlar raporun kısa başlıklarından kısaltıldı.
     */
    purpose: {
      poles: { low: 'İşi sürdürmekte zorlanan', high: 'İşi sonuna götüren' },
      bands: {
        low: {
          from: { school: ['kar11', 'kar01'], friends: ['kar02'], home: ['kar12'], work: ['kar11', 'kar07'] },
          student: {
            school: 'Ödevlerini son ana bırakabilir, bir işe tam hazırlanmadan başlayabilirsin.',
            friends: 'Arkadaşlarınla yaptığın bir planı değiştirmek seni pek rahatsız etmeyebilir.',
            home: 'Evdekilerle bir şey seçerken karar vermek sana zor gelebilir.',
          },
          parent: {
            school: 'Çocuğunuz ödevlerini son ana bırakabilir, bir işe tam hazırlanmadan başlayabilir.',
            friends: 'Arkadaşlarıyla yaptığı bir planı değiştirmek onu pek rahatsız etmeyebilir.',
            home: 'Evdekilerle bir şey seçerken karar vermek ona zor gelebilir.',
          },
          adult: {
            work: 'Yapman gerekenleri son ana bırakabilirsin; iş sırasında dikkatin kolayca dağılabilir.',
          },
        },
        average: {
          from: { school: ['kar01', 'kar11'], friends: ['kar10'], home: ['kar04', 'kar07'], work: ['kar03', 'kar11'] },
          student: {
            school: 'Bazı ödevlere önceden hazırlanabilir, bazılarını son ana bırakabilirsin.',
            friends: 'Arkadaşlarına söz verdiğin işlerin bazılarını bitirebilir, bazılarını yarım bırakabilirsin.',
            home: 'Bir işe bazen uzun süre odaklanabilirsin, bazen dikkatin kolayca dağılabilir.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevlere önceden hazırlanabilir, bazılarını son ana bırakabilir.',
            friends: 'Arkadaşlarına söz verdiği işlerin bazılarını bitirebilir, bazılarını yarım bırakabilir.',
            home: 'Bir işe bazen uzun süre odaklanabilir, bazen dikkati kolayca dağılabilir.',
          },
          adult: {
            work: 'Bazı işlere hemen koyulabilir, bazılarını son ana bırakabilirsin.',
          },
        },
        high: {
          from: { school: ['kar01', 'kar11'], friends: ['kar10', 'kar09'], home: ['kar02'], work: ['kar03', 'kar05'] },
          student: {
            school: 'Ödevlerine önceden hazırlanabilir, yapman gerekenleri son ana bırakmayabilirsin.',
            friends: 'Bir arkadaşına söz verdiğin bir işi sonuna kadar götürebilirsin.',
            home: 'Bir günü planladığın gibi geçirmek isteyebilirsin; plan bozulunca canın sıkılabilir.',
          },
          parent: {
            school: 'Çocuğunuz ödevlerine önceden hazırlanabilir, yapması gerekenleri son ana bırakmayabilir.',
            friends: 'Bir arkadaşına söz verdiği bir işi sonuna kadar götürebilir.',
            home: 'Bir günü planladığı gibi geçirmek isteyebilir; plan bozulunca canı sıkılabilir.',
          },
          adult: {
            work: 'Bir işe hemen koyulup onu sorunsuz bir şekilde halledebilirsin.',
          },
        },
      },
    },
  },
};
