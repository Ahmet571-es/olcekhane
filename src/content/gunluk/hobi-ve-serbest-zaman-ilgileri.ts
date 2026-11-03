import type { SurveyDaily } from './types';

/**
 * Hobi ve Serbest Zaman İlgileri: günlük hayatta nasıl görünür (7. sınıftan mezuna ve yetişkinlere). Ton: özellik (ilgi; iki
 * uç da eşit; lib/reports/daily-parts.ts). Bu test ilgiyi değil, 16 alandaki etkinliklerin son bir yılda ne sıklıkla
 * yapıldığını sorar (src/content/instruments/hobi-ilgileri.ts; ters madde yok): örnekler bir alanın boş zamanda ne kadar yer
 * tutabileceğini anlatır. Düşük düzey "ilgin yok" demez (rapor metni: "az yaptığın bir alana da ilgi duyuyor olabilirsin");
 * sıklık zamana, imkânlara ve yaşanan yere de bağlıdır (girişte de söylenir). Etkinlikler sahip olmaya bağlanmaz: bahçe,
 * evcil hayvan, çalgı, seyahat, kurs ve alışveriş yalnızca o alanda sık yapılan etkinlik olarak anılır, varsayılmaz; düşük
 * düzeyde gerekirse imkânın da rol oynadığı söylenir (rapor metninden: evcil hayvan, bitkiler, kültür ve sanat, seyahat,
 * açık hava). Okulda zorunlu yapılanlar (ders, okul gezisi) sayılmaz; okul satırları alanın okulda nasıl görünebileceğini
 * anlatır (anlatacak bir deneyim, bir kulüp ya da teneffüs sohbeti). Kardeş, bahçe, araç ya da yakın arkadaş varsayılmaz.
 * Her satırın dayandığı maddeler `from`'dadır; "Şiir yazmak" (h082) yaratıcı etkinliklerin asıl maddesidir, yazma alanında
 * kullanılmaz.
 * Maddeye doğrudan dayanmayan uzantılar: yüksek sıklıkta etkinliğin boş zamanın büyük kısmını alabileceği ya da onunla
 * uğraşırken zamanın fark edilmeyebileceği (merak.ts'teki gibi); düşük sıklıkta etkinliğin yeni ya da az tanıdık gelebileceği
 * (sık yapılmamasının doğal sonucu; bir beceri eksiği olarak yazılmaz).
 */
export const hobiIlgileriDaily: SurveyDaily = {
  kind: 'survey',
  version: 'hobi-ve-serbest-zaman-ilgileri-gunluk-1',
  scales: {
    /* Çocuklarla ilgilenme: h014 küçük bir çocukla oyun, h047 oyunda kazanmasına izin vermek, h079 gezmeye götürmek, h112
       anne babası yanında değilken bakmak, h140 hikâye okumak, h175 çizgi roman okumak. */
    children: {
      poles: { low: 'Küçüklerle seyrek oynar', high: 'Küçüklerle sık ilgilenir' },
      bands: {
        low: {
          from: { school: ['h014'], friends: ['h014'], home: ['h140', 'h112'], work: ['h014'] },
          student: {
            school: 'Küçük sınıflarla yapılan bir etkinlikte görev almak sana yeni bir deneyim olabilir.',
            friends: 'Boş zamanını çoğu zaman arkadaşlarınla ya da başka uğraşlarla geçiriyor olabilirsin.',
            home: 'Küçük bir çocuğa hikâye okumak ya da ona bakmak sana yeni bir iş gibi gelebilir.',
          },
          parent: {
            school: 'Küçük sınıflarla yapılan bir etkinlikte görev almak çocuğunuz için yeni bir deneyim olabilir.',
            friends: 'Boş zamanını çoğu zaman arkadaşlarıyla ya da başka uğraşlarla geçiriyor olabilir.',
            home: 'Küçük bir çocuğa hikâye okumak ya da ona bakmak ona yeni bir iş gibi gelebilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında küçük çocuklarla vakit geçirmek için sana pek fırsat kalmayabilir.',
          },
        },
        average: {
          from: { school: ['h014'], friends: ['h014'], home: ['h140', 'h112'], work: ['h079', 'h112'] },
          student: {
            school: 'Küçük sınıflarla yapılan bir etkinlikte bazen görev almak isteyebilir, bazen başka bir işi seçebilirsin.',
            friends: 'Bir buluşmada küçük bir çocuk olunca bazen onunla oynayabilir, bazen arkadaşlarınla kalmayı seçebilirsin.',
            home: 'Küçük bir çocuğa ara sıra hikâye okumak ya da ona göz kulak olmak sana tanıdık gelebilir.',
          },
          parent: {
            school: 'Küçük sınıflarla yapılan bir etkinlikte çocuğunuz bazen görev almak isteyebilir, bazen başka bir işi seçebilir.',
            friends: 'Bir buluşmada küçük bir çocuk olunca bazen onunla oynayabilir, bazen arkadaşlarıyla kalmayı seçebilir.',
            home: 'Küçük bir çocuğa ara sıra hikâye okumak ya da ona göz kulak olmak ona tanıdık gelebilir.',
          },
          adult: {
            work: 'Ara sıra küçük bir çocuğu gezmeye götürmek ya da ona bakmak senin günlük işlerin arasında yer alabilir.',
          },
        },
        high: {
          from: { school: ['h014'], friends: ['h014', 'h047'], home: ['h112', 'h079'], work: ['h140', 'h014'] },
          student: {
            school: 'Küçük sınıflarla yapılan bir etkinlikte onlarla oyun kurmak sana tanıdık bir iş gibi gelebilir.',
            friends: 'Bir buluşmada küçük bir çocuk olunca onunla oynamak ya da oyunda onun kazanmasına izin vermek isteyebilirsin.',
            home: 'Küçük bir çocuğa bakmak ya da onu gezdirmek senin boş zamanının çoğunu alabilir.',
          },
          parent: {
            school: 'Küçük sınıflarla yapılan bir etkinlikte onlarla oyun kurmak çocuğunuza tanıdık bir iş gibi gelebilir.',
            friends: 'Bir buluşmada küçük bir çocuk olunca onunla oynamak ya da oyunda onun kazanmasına izin vermek isteyebilir.',
            home: 'Küçük bir çocuğa bakmak ya da onu gezdirmek boş zamanının çoğunu alabilir.',
          },
          adult: {
            work: 'Küçük bir çocuğa hikâye okumak ya da onunla oyun oynamak senin günlük hayatında sık yer alabilir.',
          },
        },
      },
    },
    /* Koleksiyon: h031 koleksiyonla uğraşmak, h064 koleksiyon için bir şey satın almak, h089 takas etmek, h136 koleksiyonla
       ilgili kitap okumak, h161 böyle bir kitap satın almak. */
    collecting: {
      poles: { low: 'Koleksiyonla az uğraşır', high: 'Koleksiyonla sık uğraşır' },
      bands: {
        low: {
          from: { school: ['h031'], friends: ['h089'], home: ['h031'], work: ['h031'] },
          student: {
            school: 'Teneffüste biri koleksiyonunu anlatınca bu sana yeni bir uğraş gibi gelebilir.',
            friends: 'Arkadaşlarınla buluşunca takas ya da biriktirme yerine başka şeyler yapmayı seçebilirsin.',
            home: 'Bir şeyler biriktirmek yerine boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Teneffüste biri koleksiyonunu anlatınca bu çocuğunuza yeni bir uğraş gibi gelebilir.',
            friends: 'Arkadaşlarıyla buluşunca takas ya da biriktirme yerine başka şeyler yapmayı seçebilir.',
            home: 'Bir şeyler biriktirmek yerine boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında bir koleksiyonla uğraşmaya pek zaman ayırmıyor olabilirsin.',
          },
        },
        average: {
          from: { school: ['h031'], friends: ['h089'], home: ['h031'], work: ['h031'] },
          student: {
            school: 'Teneffüste biriyle topladığın şeyler hakkında ara sıra konuşabilirsin.',
            friends: 'Arkadaşlarınla ara sıra koleksiyonundan bir parçayı takas edebilirsin.',
            home: 'Koleksiyonunla bazen uzun uzun ilgilenebilir, bazen onu uzun süre kenara bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz teneffüste biriyle topladığı şeyler hakkında ara sıra konuşabilir.',
            friends: 'Arkadaşlarıyla ara sıra koleksiyonundan bir parçayı takas edebilir.',
            home: 'Koleksiyonuyla bazen uzun uzun ilgilenebilir, bazen onu uzun süre kenara bırakabilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde koleksiyonun bekleyebilir, sakin günlerde ona dönebilirsin.',
          },
        },
        high: {
          from: { school: ['h136'], friends: ['h089'], home: ['h031'], work: ['h136', 'h064'] },
          student: {
            school: 'Biriktirdiğin şeyler hakkında okuduklarını teneffüste anlatmak isteyebilirsin.',
            friends: 'Arkadaşlarınla koleksiyonundaki parçaları takas etmek sana keyifli gelebilir.',
            home: 'Koleksiyonunu düzenlerken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz biriktirdiği şeyler hakkında okuduklarını teneffüste anlatmak isteyebilir.',
            friends: 'Arkadaşlarıyla koleksiyonundaki parçaları takas etmek ona keyifli gelebilir.',
            home: 'Koleksiyonunu düzenlerken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Boş bir anında koleksiyonun hakkında okumak ya da ona yeni bir parça eklemek isteyebilirsin.',
          },
        },
      },
    },
    /* Yaratıcı etkinlikler: h017 tamamen yeni bir şey denemek, h050 sanat çalışması, h082 şiir yazmak, h115 tiyatroda rol,
       h147 resim yapmak, h178 müzik aleti çalmak, h200 topluluk önünde şarkı söylemek ya da çalgı çalmak. */
    creativity: {
      poles: { low: 'Sanata az zaman ayırır', high: 'Sık sık üretir, dener' },
      bands: {
        low: {
          from: { school: ['h147', 'h082'], friends: ['h115', 'h200'], home: ['h050'], work: ['h147', 'h178', 'h082'] },
          student: {
            school: 'Ders dışında resim yapmak ya da şiir yazmak şimdilik senin boş zamanında pek yer almıyor olabilir.',
            friends: 'Arkadaşların bir gösteri hazırlarken izleyici olmayı seçebilirsin.',
            home: 'Boş zamanını başka uğraşlara ayırıyor olabilirsin; yaratıcılık bu uğraşlarda da görünebilir.',
          },
          parent: {
            school: 'Ders dışında resim yapmak ya da şiir yazmak şimdilik çocuğunuzun boş zamanında pek yer almıyor olabilir.',
            friends: 'Arkadaşları bir gösteri hazırlarken izleyici olmayı seçebilir.',
            home: 'Boş zamanını başka uğraşlara ayırıyor olabilir; yaratıcılık bu uğraşlarda da görünebilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında resim, müzik ya da yazıya sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h050'], friends: ['h017'], home: ['h147'], work: ['h050'] },
          student: {
            school: 'Bir sanat çalışmasına ara sıra katılmak isteyebilir, bazen başka bir etkinliği seçebilirsin.',
            friends: 'Arkadaşlarınla bazen yeni bir şey denemek isteyebilir, bazen bildiğin uğraşlara dönebilirsin.',
            home: 'Bazı günler resim yapmak sana keyifli gelebilir, bazı günler başka şeyler yapmayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sanat çalışmasına ara sıra katılmak isteyebilir, bazen başka bir etkinliği seçebilir.',
            friends: 'Arkadaşlarıyla bazen yeni bir şey denemek isteyebilir, bazen bildiği uğraşlara dönebilir.',
            home: 'Bazı günler resim yapmak ona keyifli gelebilir, bazı günler başka şeyler yapmayı seçebilir.',
          },
          adult: {
            work: 'Yoğun günlerde yaratıcı uğraşlar bekleyebilir, sakin günlerde bir şey üretmek isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['h200', 'h115'], friends: ['h017'], home: ['h147', 'h082'], work: ['h147', 'h178', 'h082'] },
          student: {
            school: 'Bir gösteride şarkı söylemek, çalgı çalmak ya da rol almak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla tamamen yeni bir şey denemeyi önerebilirsin.',
            home: 'Resim yaparken ya da şiir yazarken başka işleri unutabilirsin.',
          },
          parent: {
            school: 'Bir gösteride şarkı söylemek, çalgı çalmak ya da rol almak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla tamamen yeni bir şey denemeyi önerebilir.',
            home: 'Resim yaparken ya da şiir yazarken başka işleri unutabilir.',
          },
          adult: {
            work: 'Yoğun bir günün ardından resim, müzik ya da yazıyla bir şey üretmek isteyebilirsin.',
          },
        },
      },
    },
    /* Kültür ve sanat: h007 konferans ya da söyleşi, h040 sanat sergisi, h072 müze, h105 bale, h137 opera ya da konser, h169
       tiyatro ya da müzikal. */
    culture: {
      poles: { low: 'Sergiye, konsere az gider', high: 'Sergiye, konsere sık gider' },
      bands: {
        low: {
          from: { school: ['h072', 'h040'], friends: ['h137', 'h040'], home: ['h040', 'h137'], work: ['h040', 'h137'] },
          student: {
            school: 'Derste bir müze ya da sergi anlatılınca bunlar sana yeni gelebilir.',
            friends: 'Arkadaşların bir konsere ya da sergiye gitmeyi önerince başka bir planı seçebilirsin.',
            home: 'Bu tür etkinlikler her yerde kolay bulunmaz; boş zamanını başka yollarla geçiriyor olabilirsin.',
          },
          parent: {
            school: 'Derste bir müze ya da sergi anlatılınca bunlar çocuğunuza yeni gelebilir.',
            friends: 'Arkadaşları bir konsere ya da sergiye gitmeyi önerince başka bir planı seçebilir.',
            home: 'Bu tür etkinlikler her yerde kolay bulunmaz; boş zamanını başka yollarla geçiriyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında sergi ya da konser gibi etkinliklere sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h072', 'h040'], friends: ['h137', 'h169'], home: ['h007'], work: ['h137', 'h169'] },
          student: {
            school: 'Bir müze ya da sergi gezisine bazen istekle katılabilir, bazen başka bir planı seçebilirsin.',
            friends: 'Arkadaşlarınla bazen bir konsere ya da tiyatroya gitmek isteyebilir, bazen başka bir buluşmayı seçebilirsin.',
            home: 'Bir söyleşi duyunca bazen gitmek isteyebilir, bazen evde kalmayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir müze ya da sergi gezisine bazen istekle katılabilir, bazen başka bir planı seçebilir.',
            friends: 'Arkadaşlarıyla bazen bir konsere ya da tiyatroya gitmek isteyebilir, bazen başka bir buluşmayı seçebilir.',
            home: 'Bir söyleşi duyunca bazen gitmek isteyebilir, bazen evde kalmayı seçebilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde konser ya da tiyatro bekleyebilir, sakin dönemlerde bir gösteriye gitmek isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['h040', 'h072'], friends: ['h040', 'h169', 'h137'], home: ['h040', 'h169'], work: ['h040', 'h007', 'h137'] },
          student: {
            school: 'Derste bir sanat eseri ya da müze anlatılınca bu konular sana tanıdık gelebilir.',
            friends: 'Arkadaşlarınla bir sergiye, bir tiyatro oyununa ya da konsere gitmek sana keyifli gelebilir.',
            home: 'Görmek istediğin sergiler ve gösteriler boş zamanının büyük kısmını alabilir.',
          },
          parent: {
            school: 'Derste bir sanat eseri ya da müze anlatılınca bu konular çocuğunuza tanıdık gelebilir.',
            friends: 'Arkadaşlarıyla bir sergiye, bir tiyatro oyununa ya da konsere gitmek ona keyifli gelebilir.',
            home: 'Görmek istediği sergiler ve gösteriler boş zamanının büyük kısmını alabilir.',
          },
          adult: {
            work: 'İş dışındaki zamanında bir sergiye, söyleşiye ya da konsere gitmek isteyebilirsin.',
          },
        },
      },
    },
    /* Egzersiz: h006 koşu, h039 ağırlık çalışmak, h071 spor aleti, h104 bir seferde en az 40 dakika egzersiz, h129 tempolu
       yürüyüş, bisiklet ya da ip atlama, h168 yoga, h196 egzersiz programı. Beden eğitimi dersi sayılmaz (yönerge). */
    exercise: {
      poles: { low: 'Egzersize az zaman ayırır', high: 'Sık sık egzersiz yapar' },
      bands: {
        low: {
          from: { school: ['h104'], friends: ['h006', 'h196'], home: ['h104'], work: ['h104'] },
          student: {
            school: 'Beden eğitimi dışında egzersiz şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşların koşuya ya da bir egzersiz programına çağırınca başka bir planı seçebilirsin.',
            home: 'Boş zamanını egzersiz yerine başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Beden eğitimi dışında egzersiz şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşları koşuya ya da bir egzersiz programına çağırınca başka bir planı seçebilir.',
            home: 'Boş zamanını egzersiz yerine başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında egzersize sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h006', 'h129'], friends: ['h129'], home: ['h168'], work: ['h196'] },
          student: {
            school: 'Beden eğitimi dışında da ara sıra koşmak ya da ip atlamak isteyebilirsin.',
            friends: 'Arkadaşlarınla bazen tempolu bir yürüyüşe çıkabilir, bazen oturup sohbet etmeyi seçebilirsin.',
            home: 'Bazı haftalar yoga gibi egzersizler yapabilir, bazı haftalar buna ara verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz beden eğitimi dışında da ara sıra koşmak ya da ip atlamak isteyebilir.',
            friends: 'Arkadaşlarıyla bazen tempolu bir yürüyüşe çıkabilir, bazen oturup sohbet etmeyi seçebilir.',
            home: 'Bazı haftalar yoga gibi egzersizler yapabilir, bazı haftalar buna ara verebilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde egzersize ara verebilir, sakin dönemlerde yeniden başlayabilirsin.',
          },
        },
        high: {
          from: { school: ['h006', 'h196'], friends: ['h006', 'h129'], home: ['h104'], work: ['h104'] },
          student: {
            school: 'Beden eğitimi dışında da koşmak ya da bir egzersiz programına katılmak sana iyi gelebilir.',
            friends: 'Arkadaşlarınla koşuya ya da tempolu bir yürüyüşe çıkmayı önerebilirsin.',
            home: 'Egzersize çok zaman ayırırken dinlenmeye zaman ayırmayı unutabilirsin.',
          },
          parent: {
            school: 'Beden eğitimi dışında da koşmak ya da bir egzersiz programına katılmak çocuğunuza iyi gelebilir.',
            friends: 'Arkadaşlarıyla koşuya ya da tempolu bir yürüyüşe çıkmayı önerebilir.',
            home: 'Egzersize çok zaman ayırırken dinlenmeye zaman ayırmayı unutabilir.',
          },
          adult: {
            work: 'Yoğun bir günün ardından en az kırk dakika egzersiz yapmak isteyebilirsin.',
          },
        },
      },
    },
    /* Moda ve giyim: h029 ne giyeceğini 10 dakikadan fazla düşünmek, h067 bir saatten fazla düşünmek, h094 moda dergisi
       okumak, h127 moda kitabı okumak, h159 modaya uygun bir kıyafet satın almak. */
    fashion: {
      poles: { low: 'Giyime az zaman ayırır', high: 'Giyime sık zaman ayırır' },
      bands: {
        low: {
          from: { school: ['h029'], friends: ['h094'], home: ['h094', 'h127'], work: ['h029'] },
          student: {
            school: 'Sabah hazırlanırken ne giyeceğine çabucak karar verebilirsin.',
            friends: 'Arkadaşların yeni bir giyim tarzından söz edince bu sana pek tanıdık gelmeyebilir.',
            home: 'Moda üzerine okumak yerine boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sabah hazırlanırken ne giyeceğine çabucak karar verebilir.',
            friends: 'Arkadaşları yeni bir giyim tarzından söz edince bu ona pek tanıdık gelmeyebilir.',
            home: 'Moda üzerine okumak yerine boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Bir işe ya da bir davete hazırlanırken ne giyeceğine çabucak karar verebilirsin.',
          },
        },
        average: {
          from: { school: ['h029'], friends: ['h067'], home: ['h094'], work: ['h067', 'h029'] },
          student: {
            school: 'Bazı sabahlar ne giyeceğini uzun düşünebilir, bazı sabahlar çabucak hazırlanabilirsin.',
            friends: 'Arkadaşlarınla buluşmadan önce bazen kıyafetini uzun uzun seçebilir, bazen ilk eline geleni giyebilirsin.',
            home: 'Bir moda dergisine ara sıra göz atmak isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sabahlar ne giyeceğini uzun düşünebilir, bazı sabahlar çabucak hazırlanabilir.',
            friends: 'Arkadaşlarıyla buluşmadan önce bazen kıyafetini uzun uzun seçebilir, bazen ilk eline geleni giyebilir.',
            home: 'Bir moda dergisine ara sıra göz atmak isteyebilir.',
          },
          adult: {
            work: 'Önemli bir gün için ne giyeceğini bazen uzun uzun düşünebilir, sıradan günlerde çabucak karar verebilirsin.',
          },
        },
        high: {
          from: { school: ['h029'], friends: ['h067'], home: ['h094', 'h127'], work: ['h029', 'h094'] },
          student: {
            school: 'Sabah ne giyeceğini düşünmek sana keyifli gelebilir; giyim kendini ifade etmenin bir yolu olabilir.',
            friends: 'Arkadaşlarınla buluşmadan önce ne giyeceğini seçmek bir saatten uzun sürebilir.',
            home: 'Moda dergilerine ya da kitaplarına göz atmak sana keyifli gelebilir.',
          },
          parent: {
            school: 'Sabah ne giyeceğini düşünmek çocuğunuza keyifli gelebilir; giyim kendini ifade etmenin bir yolu olabilir.',
            friends: 'Arkadaşlarıyla buluşmadan önce ne giyeceğini seçmek bir saatten uzun sürebilir.',
            home: 'Moda dergilerine ya da kitaplarına göz atmak ona keyifli gelebilir.',
          },
          adult: {
            work: 'Bir gün için kıyafetini özenle seçmek ve modayı takip etmek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Masa ve kart oyunları: h054 yapboz, h086 kart oyunu, h119 tavla ya da kutu oyunu, h151 satranç ya da dama, h182 yeni
       bir masa ya da kart oyunu öğrenmek. */
    games: {
      poles: { low: 'Masa oyununu az oynar', high: 'Masa oyununu sık oynar' },
      bands: {
        low: {
          from: { school: ['h151'], friends: ['h182'], home: ['h054', 'h119'], work: ['h086'] },
          student: {
            school: 'Teneffüste satranç ya da dama oynayanlar olunca başka bir şey yapmayı seçebilirsin.',
            friends: 'Arkadaşlarınla yeni bir kutu oyununun kurallarını öğrenmek biraz zaman alabilir.',
            home: 'Yapboz ya da tavla yerine boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Teneffüste satranç ya da dama oynayanlar olunca çocuğunuz başka bir şey yapmayı seçebilir.',
            friends: 'Arkadaşlarıyla yeni bir kutu oyununun kurallarını öğrenmek biraz zaman alabilir.',
            home: 'Yapboz ya da tavla yerine boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında kart ya da masa oyunlarına sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h151'], friends: ['h086'], home: ['h054'], work: ['h119'] },
          student: {
            school: 'Teneffüste bazen satranç ya da dama oynamak isteyebilir, bazen başka bir şey yapmayı seçebilirsin.',
            friends: 'Arkadaşlarınla buluşunca bazen bir kart oyunu açabilir, bazen sohbet etmeyi seçebilirsin.',
            home: 'Bir yapbozu bazen bir oturuşta bitirmek isteyebilir, bazen günlerce yarım bırakabilirsin.',
          },
          parent: {
            school: 'Teneffüste çocuğunuz bazen satranç ya da dama oynamak isteyebilir, bazen başka bir şey yapmayı seçebilir.',
            friends: 'Arkadaşlarıyla buluşunca bazen bir kart oyunu açabilir, bazen sohbet etmeyi seçebilir.',
            home: 'Bir yapbozu bazen bir oturuşta bitirmek isteyebilir, bazen günlerce yarım bırakabilir.',
          },
          adult: {
            work: 'Yorucu bir günün ardından ara sıra bir masa oyunu oynamak sana iyi gelebilir.',
          },
        },
        high: {
          from: { school: ['h151'], friends: ['h182'], home: ['h054'], work: ['h119', 'h086'] },
          student: {
            school: 'Teneffüste satranç ya da dama oynamak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla yeni bir kutu ya da kart oyunu öğrenmek sana heyecan verici gelebilir.',
            home: 'Bir yapboza ya da oyuna dalınca zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Teneffüste satranç ya da dama oynamak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla yeni bir kutu ya da kart oyunu öğrenmek ona heyecan verici gelebilir.',
            home: 'Bir yapboza ya da oyuna dalınca zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Yakınlarınla tavla, kart ya da kutu oyunu oynamak günlük hayatında sık yer alabilir.',
          },
        },
      },
    },
    /* Bahçe ve bitkiler: h009 saksıdaki bir bitkinin bakımı, h042 bitkilerle uğraşmak, h074 yaprak toplama gibi işler, h107
       bitki dikmek ya da saksısını değiştirmek, h139 çiçek almak ya da toplamak, h171 bitki satın almak. Bahçe varsayılmaz. */
    gardening: {
      poles: { low: 'Bitkilerle az uğraşır', high: 'Bitkilerle sık uğraşır' },
      bands: {
        low: {
          from: { school: ['h107'], friends: ['h139'], home: ['h009'], work: ['h009'] },
          student: {
            school: 'Bir fidan dikme etkinliği sana yeni bir deneyim olabilir.',
            friends: 'Arkadaşlarınla dışarıdayken çiçek toplamak pek aklına gelmeyebilir.',
            home: 'Bitki yetiştirmek yaşanan yere ve imkânlara da bağlıdır; boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Bir fidan dikme etkinliği çocuğunuz için yeni bir deneyim olabilir.',
            friends: 'Arkadaşlarıyla dışarıdayken çiçek toplamak pek aklına gelmeyebilir.',
            home: 'Bitki yetiştirmek yaşanan yere ve imkânlara da bağlıdır; boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında bir saksı bitkisine bakmaya sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h107'], friends: ['h139'], home: ['h009'], work: ['h107'] },
          student: {
            school: 'Bir fidan dikme etkinliğine bazen katılmak isteyebilir, bazen başka bir etkinliği seçebilirsin.',
            friends: 'Arkadaşlarınla dışarıdayken bazen çiçek toplayabilir, bazen bunu pek düşünmeyebilirsin.',
            home: 'Bir saksı bitkisine bazen düzenli bakabilir, bazen onu bir süre unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir fidan dikme etkinliğine bazen katılmak isteyebilir, bazen başka bir etkinliği seçebilir.',
            friends: 'Arkadaşlarıyla dışarıdayken bazen çiçek toplayabilir, bazen bunu pek düşünmeyebilir.',
            home: 'Bir saksı bitkisine bazen düzenli bakabilir, bazen onu bir süre unutabilir.',
          },
          adult: {
            work: 'Bir bitkinin saksısını değiştirmek gibi işler ara sıra senin günlük işlerin arasında yer alabilir.',
          },
        },
        high: {
          from: { school: ['h107'], friends: ['h139'], home: ['h009'], work: ['h009', 'h107'] },
          student: {
            school: 'Derste bitkilerin nasıl büyüdüğü anlatılınca bu konu sana tanıdık gelebilir.',
            friends: 'Arkadaşlarına bir bitki ya da çiçek götürmek isteyebilirsin.',
            home: 'Bitkilerin düzenli bakımı senin gününden her gün biraz zaman alabilir.',
          },
          parent: {
            school: 'Derste bitkilerin nasıl büyüdüğü anlatılınca bu konu çocuğunuza tanıdık gelebilir.',
            friends: 'Arkadaşlarına bir bitki ya da çiçek götürmek isteyebilir.',
            home: 'Bitkilerin düzenli bakımı gününden her gün biraz zaman alabilir.',
          },
          adult: {
            work: 'Saksıdaki bitkilere bakmak ya da yeni bir bitki dikmek sana günlük işlerin keyifli bir parçası gibi gelebilir.',
          },
        },
      },
    },
    /* Davetler ve kutlamalar: h013 akşam yemeğine misafir çağırmak, h046 az kişilik bir kutlama, h078 kalabalık bir kutlama,
       h111 bir kutlama düzenlemek, h143 altı ya da daha fazla misafir ağırlamak. */
    gatherings: {
      poles: { low: 'Davetlere az katılır', high: 'Davetlere sık katılır' },
      bands: {
        low: {
          from: { school: ['h111'], friends: ['h078'], home: ['h013', 'h143'], work: ['h046', 'h078'] },
          student: {
            school: 'Sınıfta bir kutlama düzenlenirken hazırlığı başkalarına bırakmayı seçebilirsin.',
            friends: 'Kalabalık bir eğlence yerine az kişiyle sakin bir buluşma sana daha rahat gelebilir.',
            home: 'Misafir ağırlamak evdeki imkânlara da bağlıdır; şimdilik senin hayatında pek yer almıyor olabilir.',
          },
          parent: {
            school: 'Sınıfta bir kutlama düzenlenirken çocuğunuz hazırlığı başkalarına bırakmayı seçebilir.',
            friends: 'Kalabalık bir eğlence yerine az kişiyle sakin bir buluşma ona daha rahat gelebilir.',
            home: 'Misafir ağırlamak evdeki imkânlara da bağlıdır; şimdilik onun hayatında pek yer almıyor olabilir.',
          },
          adult: {
            work: 'Yoğun günlerin arasında kutlamalara ve davetlere sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h111'], friends: ['h078', 'h046'], home: ['h013'], work: ['h046', 'h013'] },
          student: {
            school: 'Sınıfta bir kutlama düzenlenirken bazen hazırlığa katılmak isteyebilir, bazen yalnızca eğlenmeyi seçebilirsin.',
            friends: 'Arkadaşlarınla bazen kalabalık bir eğlenceye gitmek isteyebilir, bazen az kişiyle buluşmayı seçebilirsin.',
            home: 'Yemeğe misafir çağırma fikri bazen sana keyifli gelebilir, bazen sakin bir akşamı seçebilirsin.',
          },
          parent: {
            school: 'Sınıfta bir kutlama düzenlenirken çocuğunuz bazen hazırlığa katılmak isteyebilir, bazen yalnızca eğlenmeyi seçebilir.',
            friends: 'Arkadaşlarıyla bazen kalabalık bir eğlenceye gitmek isteyebilir, bazen az kişiyle buluşmayı seçebilir.',
            home: 'Yemeğe misafir çağırma fikri bazen ona keyifli gelebilir, bazen sakin bir akşamı seçebilir.',
          },
          adult: {
            work: 'Ara sıra küçük bir kutlamaya gitmek ya da birkaç kişiyi ağırlamak sana iyi gelebilir.',
          },
        },
        high: {
          from: { school: ['h111'], friends: ['h046', 'h078'], home: ['h143'], work: ['h111', 'h143'] },
          student: {
            school: 'Sınıfta bir kutlama düzenlenirken hazırlıkta görev almak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla küçük ya da kalabalık kutlamalara gitmek sana keyifli gelebilir.',
            home: 'Kalabalık bir misafirliği hazırlarken saatlerce uğraşabilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Sınıfta bir kutlama düzenlenirken hazırlıkta görev almak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla küçük ya da kalabalık kutlamalara gitmek ona keyifli gelebilir.',
            home: 'Kalabalık bir misafirliği hazırlarken saatlerce uğraşabilir; başka işler bekleyebilir.',
          },
          adult: {
            work: 'Bir kutlama düzenlemek ya da altı kişiden fazla misafir ağırlamak sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Evcil hayvanlar: h028 bir evcil hayvanla oynamak, h052 yemek vermek, h084 bakımını yapmak, h117 yıkamak ya da tüylerini
       taramak, h149 satın almak ya da sahiplenmek. Evcil hayvan varsayılmaz. */
    pets: {
      poles: { low: 'Hayvanlarla az ilgilenir', high: 'Hayvanlarla sık ilgilenir' },
      bands: {
        low: {
          from: { school: ['h084'], friends: ['h028'], home: ['h028'], work: ['h084'] },
          student: {
            school: 'Derste bir hayvanın bakımı anlatılınca bu konu sana yeni gelebilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla oynamak sana yeni bir deneyim olabilir.',
            home: 'Yakınında bir evcil hayvan olmayabilir; boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Derste bir hayvanın bakımı anlatılınca bu konu çocuğunuza yeni gelebilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla oynamak onun için yeni bir deneyim olabilir.',
            home: 'Yakınında bir evcil hayvan olmayabilir; boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında bir evcil hayvana bakmak senin için pek yer tutmuyor olabilir.',
          },
        },
        average: {
          from: { school: ['h084'], friends: ['h028'], home: ['h052'], work: ['h028', 'h052'] },
          student: {
            school: 'Derste bir hayvanın bakımı anlatılınca anlatacak birkaç şey bulabilirsin.',
            friends: 'Bir arkadaşının evcil hayvanıyla ara sıra oynamak sana keyifli gelebilir.',
            home: 'Bir evcil hayvana yemek vermek gibi işleri bazen üstlenebilir, bazen başkasına bırakabilirsin.',
          },
          parent: {
            school: 'Derste bir hayvanın bakımı anlatılınca çocuğunuz anlatacak birkaç şey bulabilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla ara sıra oynamak ona keyifli gelebilir.',
            home: 'Bir evcil hayvana yemek vermek gibi işleri bazen üstlenebilir, bazen başkasına bırakabilir.',
          },
          adult: {
            work: 'Ara sıra bir evcil hayvanla oynamak ya da ona yemek vermek sana iyi gelebilir.',
          },
        },
        high: {
          from: { school: ['h084'], friends: ['h028'], home: ['h052', 'h117'], work: ['h028'] },
          student: {
            school: 'Derste bir hayvanın bakımı anlatılınca kendi deneyimlerini anlatmak isteyebilirsin.',
            friends: 'Arkadaşlarınla bir evcil hayvanla oynamak sana keyifli gelebilir.',
            home: 'Bir hayvanı beslemek, yıkamak ya da taramak senin gününden düzenli olarak zaman alabilir.',
          },
          parent: {
            school: 'Derste bir hayvanın bakımı anlatılınca çocuğunuz kendi deneyimlerini anlatmak isteyebilir.',
            friends: 'Arkadaşlarıyla bir evcil hayvanla oynamak ona keyifli gelebilir.',
            home: 'Bir hayvanı beslemek, yıkamak ya da taramak gününden düzenli olarak zaman alabilir.',
          },
          adult: {
            work: 'Yoğun bir günün sonunda bir evcil hayvanla ilgilenmek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Kitap okuma: h113 kitap okumak, h176 kitap satın almak, h199 uyumadan önce yatakta okumak, h208 halk ya da belediye
       kütüphanesine gitmek, h209 bir kitabı tek oturuşta okumak. */
    reading: {
      poles: { low: 'Kitaba az zaman ayırır', high: 'Sık sık kitap okur' },
      bands: {
        low: {
          from: { school: ['h113'], friends: ['h113'], home: ['h199'], work: ['h113'] },
          student: {
            school: 'Ders kitapları dışında kitap okumak şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarınla buluşmalarda kitaplardan çok başka konular öne çıkabilir.',
            home: 'Uyumadan önce kitap yerine başka şeylerle vakit geçirmeyi seçebilirsin.',
          },
          parent: {
            school: 'Ders kitapları dışında kitap okumak şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarıyla buluşmalarda kitaplardan çok başka konular öne çıkabilir.',
            home: 'Uyumadan önce kitap yerine başka şeylerle vakit geçirmeyi seçebilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında kitap okumaya sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h113'], friends: ['h113'], home: ['h199'], work: ['h113'] },
          student: {
            school: 'Ders dışında bazen bir kitaba başlayabilir, bazen onu bir süre bekletebilirsin.',
            friends: 'Bir arkadaşının önerdiği bir kitabı bazen okumak isteyebilir, bazen başka bir şeyi seçebilirsin.',
            home: 'Bazı akşamlar uyumadan önce kitap okuyabilir, bazı akşamlar başka şeylerle vakit geçirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında bazen bir kitaba başlayabilir, bazen onu bir süre bekletebilir.',
            friends: 'Bir arkadaşının önerdiği bir kitabı bazen okumak isteyebilir, bazen başka bir şeyi seçebilir.',
            home: 'Bazı akşamlar uyumadan önce kitap okuyabilir, bazı akşamlar başka şeylerle vakit geçirebilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde kitaplar bekleyebilir, sakin dönemlerde bir kitaba dalabilirsin.',
          },
        },
        high: {
          from: { school: ['h208', 'h113'], friends: ['h113'], home: ['h209', 'h199'], work: ['h208', 'h199'] },
          student: {
            school: 'Ders dışında da kütüphaneye gitmek ya da yeni bir kitaba başlamak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla okuduğun kitaplar hakkında konuşmak sana keyifli gelebilir.',
            home: 'Sevdiğin bir kitabı tek oturuşta bitirmek isterken uykunu erteleyebilirsin.',
          },
          parent: {
            school: 'Ders dışında da kütüphaneye gitmek ya da yeni bir kitaba başlamak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla okuduğu kitaplar hakkında konuşmak ona keyifli gelebilir.',
            home: 'Sevdiği bir kitabı tek oturuşta bitirmek isterken uykusunu erteleyebilir.',
          },
          adult: {
            work: 'İş dışındaki zamanında kütüphaneye gitmek ya da uyumadan önce okumak sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Kendini geliştirme: h063 kişisel gelişim kitabı okumak, h095 böyle bir kitap satın almak, h128 merak edilen bir konuyu
       kendi isteğiyle çalışmak, h160 yeni bir beceri öğrenmek, h190 bir kursa kaydolmak. Kurs varsayılmaz. */
    self_improvement: {
      poles: { low: 'Yeni beceriye az yönelir', high: 'Yeni beceriye sık yönelir' },
      bands: {
        low: {
          from: { school: ['h128'], friends: ['h160'], home: ['h128'], work: ['h190', 'h063'] },
          student: {
            school: 'Ders dışında kendi isteğinle bir konu çalışmak şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarınla vakit geçirirken yeni bir beceri öğrenmek yerine bildiğin şeyleri yapmayı seçebilirsin.',
            home: 'Boş zamanını dinlenmeye ya da başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Ders dışında kendi isteğiyle bir konu çalışmak şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarıyla vakit geçirirken yeni bir beceri öğrenmek yerine bildiği şeyleri yapmayı seçebilir.',
            home: 'Boş zamanını dinlenmeye ya da başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında bir kursa ya da kişisel gelişim kitabına sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h128'], friends: ['h160'], home: ['h063'], work: ['h160'] },
          student: {
            school: 'Ders dışında merak ettiğin bir konuyu bazen kendi isteğinle çalışabilir, bazen ona ara verebilirsin.',
            friends: 'Arkadaşlarınla bazen yeni bir beceri öğrenmeyi deneyebilir, bazen bildiğin uğraşlara dönebilirsin.',
            home: 'Bir kişisel gelişim kitabını bazen merakla okuyabilir, bazen yarıda bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında merak ettiği bir konuyu bazen kendi isteğiyle çalışabilir, bazen ona ara verebilir.',
            friends: 'Arkadaşlarıyla bazen yeni bir beceri öğrenmeyi deneyebilir, bazen bildiği uğraşlara dönebilir.',
            home: 'Bir kişisel gelişim kitabını bazen merakla okuyabilir, bazen yarıda bırakabilir.',
          },
          adult: {
            work: 'Yeni bir beceri öğrenmek bazen senin gündeminde olabilir, bazen geri planda kalabilir.',
          },
        },
        high: {
          from: { school: ['h128'], friends: ['h160', 'h190'], home: ['h128', 'h160'], work: ['h160', 'h190'] },
          student: {
            school: 'Ders dışında merak ettiğin bir konuyu kendi isteğinle araştırmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla yeni bir beceri öğrenmek ya da bir kursa birlikte katılmak sana keyifli gelebilir.',
            home: 'Öğrenmek istediğin şeylerin listesi uzayınca hepsine zaman bulmak zor olabilir.',
          },
          parent: {
            school: 'Ders dışında merak ettiği bir konuyu kendi isteğiyle araştırmak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla yeni bir beceri öğrenmek ya da bir kursa birlikte katılmak ona keyifli gelebilir.',
            home: 'Öğrenmek istediği şeylerin listesi uzayınca hepsine zaman bulmak zor olabilir.',
          },
          adult: {
            work: 'İş dışındaki zamanında yeni bir beceri öğrenmek ya da bir kursa katılmak sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Spor: h004 spor hakkında sohbet, h035 televizyonda ya da internette maç izlemek, h068 bir maçı izlemeye gitmek, h100
       takım sporu, h133 basketbol, h165 tenis ya da golf. */
    sports: {
      poles: { low: 'Spora az zaman ayırır', high: 'Sporla sık ilgilenir' },
      bands: {
        low: {
          from: { school: ['h004'], friends: ['h100'], home: ['h035'], work: ['h004'] },
          student: {
            school: 'Teneffüste bir maç konuşulurken dinlemeyi ya da başka bir konuya geçmeyi seçebilirsin.',
            friends: 'Arkadaşların bir takım sporu oynarken izlemeyi ya da başka bir şey yapmayı seçebilirsin.',
            home: 'Bir maçı izlemek yerine boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Teneffüste bir maç konuşulurken çocuğunuz dinlemeyi ya da başka bir konuya geçmeyi seçebilir.',
            friends: 'Arkadaşları bir takım sporu oynarken izlemeyi ya da başka bir şey yapmayı seçebilir.',
            home: 'Bir maçı izlemek yerine boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'İş arkadaşların bir maçı konuşurken bu sohbet sana pek tanıdık gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['h004'], friends: ['h133', 'h100'], home: ['h035'], work: ['h035', 'h100'] },
          student: {
            school: 'Teneffüste bazen bir maçı konuşmak isteyebilir, bazen başka konuları seçebilirsin.',
            friends: 'Arkadaşlarınla bazen basketbol ya da başka bir takım sporu oynayabilir, bazen izlemeyi seçebilirsin.',
            home: 'Önemli bir maçı bazen ekrandan izlemek isteyebilir, bazen kaçırmayı dert etmeyebilirsin.',
          },
          parent: {
            school: 'Teneffüste çocuğunuz bazen bir maçı konuşmak isteyebilir, bazen başka konuları seçebilir.',
            friends: 'Arkadaşlarıyla bazen basketbol ya da başka bir takım sporu oynayabilir, bazen izlemeyi seçebilir.',
            home: 'Önemli bir maçı bazen ekrandan izlemek isteyebilir, bazen kaçırmayı dert etmeyebilir.',
          },
          adult: {
            work: 'Yoğun bir haftada spor bekleyebilir, sakin günlerde bir maç izlemek ya da oynamak isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['h004'], friends: ['h100', 'h068'], home: ['h035'], work: ['h100', 'h035'] },
          student: {
            school: 'Teneffüste maçları ve takımları konuşmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla bir takım sporu oynamak ya da bir maça gitmek sana heyecan verici gelebilir.',
            home: 'Önemli bir maç olduğunda başka işleri ertelemek isteyebilirsin.',
          },
          parent: {
            school: 'Teneffüste maçları ve takımları konuşmak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla bir takım sporu oynamak ya da bir maça gitmek ona heyecan verici gelebilir.',
            home: 'Önemli bir maç olduğunda başka işleri ertelemek isteyebilir.',
          },
          adult: {
            work: 'İş dışındaki zamanında bir takımda oynamak ya da maçları izlemek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Açık hava etkinlikleri: h011 piknik, h044 doğa yürüyüşü, h076 kumsalda yürümek, h109 yüzme, h141 birkaç günlük doğa
       gezisi ya da kamp, h173 tekne gezintisi ya da rafting, h194 balık tutmak ya da ava gitmek. */
    outdoors: {
      poles: { low: 'Açık havaya az çıkar', high: 'Açık havaya sık çıkar' },
      bands: {
        low: {
          from: { school: ['h044', 'h011'], friends: ['h044'], home: ['h011', 'h044'], work: ['h011', 'h044'] },
          student: {
            school: 'Bir doğa gezisi ya da piknik etkinliği sana yeni bir deneyim olabilir.',
            friends: 'Arkadaşlarınla vakit geçirirken açık havada yürümek yerine oturup sohbet etmeyi seçebilirsin.',
            home: 'Bu tür etkinlikler yaşanan yere ve imkânlara bağlıdır; boş zamanını yakın yerlerde geçiriyor olabilirsin.',
          },
          parent: {
            school: 'Bir doğa gezisi ya da piknik etkinliği çocuğunuz için yeni bir deneyim olabilir.',
            friends: 'Arkadaşlarıyla vakit geçirirken açık havada yürümek yerine oturup sohbet etmeyi seçebilir.',
            home: 'Bu tür etkinlikler yaşanan yere ve imkânlara bağlıdır; boş zamanını yakın yerlerde geçiriyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında piknik ya da doğa yürüyüşüne sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h044'], friends: ['h011'], home: ['h109'], work: ['h044'] },
          student: {
            school: 'Bir doğa gezisine bazen istekle katılabilir, bazen başka bir etkinliği seçebilirsin.',
            friends: 'Arkadaşlarınla bazen pikniğe gitmek isteyebilir, bazen şehir içinde buluşmayı seçebilirsin.',
            home: 'Sıcak günlerde ara sıra yüzmeye gitmek isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir doğa gezisine bazen istekle katılabilir, bazen başka bir etkinliği seçebilir.',
            friends: 'Arkadaşlarıyla bazen pikniğe gitmek isteyebilir, bazen şehir içinde buluşmayı seçebilir.',
            home: 'Sıcak günlerde ara sıra yüzmeye gitmek isteyebilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde doğaya çıkmak bekleyebilir, sakin günlerde bir yürüyüş yapmak isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['h044'], friends: ['h011', 'h109', 'h194'], home: ['h044', 'h011'], work: ['h044', 'h076'] },
          student: {
            school: 'Bir doğa gezisinde uzun bir yürüyüş yapmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarınla piknik yapmak, yüzmek ya da balık tutmak sana keyifli gelebilir.',
            home: 'Hava güzel olunca içeride kalmak sana zor gelebilir.',
          },
          parent: {
            school: 'Bir doğa gezisinde uzun bir yürüyüş yapmak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarıyla piknik yapmak, yüzmek ya da balık tutmak ona keyifli gelebilir.',
            home: 'Hava güzel olunca içeride kalmak ona zor gelebilir.',
          },
          adult: {
            work: 'Hafta sonunu doğada yürüyerek ya da kumsalda dolaşarak geçirmek sana iyi gelebilir.',
          },
        },
      },
    },
    /* Gezi ve seyahat: h008 seyahate çıkmak, h041 görülmeye değer yerleri gezmek, h073 seyahatte fotoğraf çekmek, h106 otelde
       ya da pansiyonda kalmak, h138 trenle ya da uçakla yolculuk, h170 gemi gezisi ya da tur. Seyahat varsayılmaz. */
    travel: {
      poles: { low: 'Seyahate az çıkar', high: 'Seyahate sık çıkar' },
      bands: {
        low: {
          from: { school: ['h041'], friends: ['h041'], home: ['h008'], work: ['h008'] },
          student: {
            school: 'Derste başka şehirler anlatılınca bu yerler sana yeni gelebilir.',
            friends: 'Arkadaşlarınla yakın çevredeki yerleri gezmek de yeni yerler tanımanın bir yolu olabilir.',
            home: 'Seyahat büyük ölçüde zamana ve imkânlara bağlıdır; boş zamanını yaşadığın yerde geçiriyor olabilirsin.',
          },
          parent: {
            school: 'Derste başka şehirler anlatılınca bu yerler çocuğunuza yeni gelebilir.',
            friends: 'Arkadaşlarıyla yakın çevredeki yerleri gezmek de yeni yerler tanımanın bir yolu olabilir.',
            home: 'Seyahat büyük ölçüde zamana ve imkânlara bağlıdır; boş zamanını yaşadığı yerde geçiriyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında uzun bir yolculuğa sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h041'], friends: ['h041'], home: ['h073'], work: ['h008'] },
          student: {
            school: 'Derste bir yer anlatılınca bazen orayı gördüğünü hatırlayabilir, bazen ilk kez duyabilirsin.',
            friends: 'Arkadaşlarınla gezdiğin bir yeri ara sıra anlatmak isteyebilirsin.',
            home: 'Bir yolculuktan sonra çektiğin fotoğraflara bazen bakmak isteyebilirsin.',
          },
          parent: {
            school: 'Derste bir yer anlatılınca çocuğunuz bazen orayı gördüğünü hatırlayabilir, bazen ilk kez duyabilir.',
            friends: 'Arkadaşlarıyla gezdiği bir yeri ara sıra anlatmak isteyebilir.',
            home: 'Bir yolculuktan sonra çektiği fotoğraflara bazen bakmak isteyebilir.',
          },
          adult: {
            work: 'Ara sıra bir yolculuğa çıkmak, yoğun günlerin arasında sana iyi gelebilir.',
          },
        },
        high: {
          from: { school: ['h041'], friends: ['h073'], home: ['h008'], work: ['h041', 'h138'] },
          student: {
            school: 'Derste bir şehir ya da ülke anlatılınca oraya dair anlatacak bir şey bulabilirsin.',
            friends: 'Arkadaşlarınla gezdiğin yerlerin fotoğraflarını paylaşmak sana keyifli gelebilir.',
            home: 'Bir yolculuğun hazırlığı ve dönüşü senin boş zamanının önemli bir kısmını alabilir.',
          },
          parent: {
            school: 'Derste bir şehir ya da ülke anlatılınca çocuğunuz oraya dair anlatacak bir şey bulabilir.',
            friends: 'Arkadaşlarıyla gezdiği yerlerin fotoğraflarını paylaşmak ona keyifli gelebilir.',
            home: 'Bir yolculuğun hazırlığı ve dönüşü boş zamanının önemli bir kısmını alabilir.',
          },
          adult: {
            work: 'İş dışındaki zamanında yeni yerler görmek ya da trenle yolculuk etmek sana keyifli gelebilir.',
          },
        },
      },
    },
    /* Yazma ve anı biriktirme: h012 günlük yazmak, h045 kartpostal, h077 elle mektup, h110 teşekkür notu ya da kartı, h142
       fotoğrafları albüme yerleştirmek, h174 hatıraları bir deftere yapıştırmak (h082 "Şiir yazmak" yaratıcı etkinliklerde). */
    writing: {
      poles: { low: 'Yazmaya az zaman ayırır', high: 'Sık sık yazıp biriktirir' },
      bands: {
        low: {
          from: { school: ['h110'], friends: ['h077'], home: ['h012', 'h142'], work: ['h012', 'h110'] },
          student: {
            school: 'Bir teşekkür kartı yazma etkinliği sana yeni bir deneyim olabilir.',
            friends: 'Arkadaşlarına elle mektup yazmak yerine başka yollarla haberleşiyor olabilirsin.',
            home: 'Yaşadıklarını günlüğe yazmak ya da albümde biriktirmek yerine başka yollarla saklıyor olabilirsin.',
          },
          parent: {
            school: 'Bir teşekkür kartı yazma etkinliği çocuğunuz için yeni bir deneyim olabilir.',
            friends: 'Arkadaşlarına elle mektup yazmak yerine başka yollarla haberleşiyor olabilir.',
            home: 'Yaşadıklarını günlüğe yazmak ya da albümde biriktirmek yerine başka yollarla saklıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında günlük tutmaya ya da not yazmaya sana pek zaman kalmıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h110'], friends: ['h077', 'h045'], home: ['h012'], work: ['h174', 'h142'] },
          student: {
            school: 'Bir teşekkür notu yazmak bazen sana keyifli gelebilir, bazen teşekkürünü sözle söylemeyi seçebilirsin.',
            friends: 'Bir arkadaşına ara sıra elle bir not ya da kart yazmak isteyebilirsin.',
            home: 'Günlüğüne bazen her gün yazabilir, bazen uzun süre ara verebilirsin.',
          },
          parent: {
            school: 'Bir teşekkür notu yazmak bazen çocuğunuza keyifli gelebilir, bazen teşekkürünü sözle söylemeyi seçebilir.',
            friends: 'Bir arkadaşına ara sıra elle bir not ya da kart yazmak isteyebilir.',
            home: 'Günlüğüne bazen her gün yazabilir, bazen uzun süre ara verebilir.',
          },
          adult: {
            work: 'Önemli günlerin fotoğraflarını ya da biletlerini bazen bir deftere ya da albüme koymak isteyebilirsin.',
          },
        },
        high: {
          from: { school: ['h110'], friends: ['h077', 'h045'], home: ['h012', 'h174'], work: ['h012', 'h142'] },
          student: {
            school: 'Bir teşekkür notu ya da kart yazmak sana keyifli gelebilir.',
            friends: 'Arkadaşlarına elle mektup ya da kartpostal yazmak sana keyifli gelebilir.',
            home: 'Günlüğüne yazarken ya da anı defterini düzenlerken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Bir teşekkür notu ya da kart yazmak çocuğunuza keyifli gelebilir.',
            friends: 'Arkadaşlarına elle mektup ya da kartpostal yazmak ona keyifli gelebilir.',
            home: 'Günlüğüne yazarken ya da anı defterini düzenlerken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Yaşadıklarını bir günlüğe yazmak ya da fotoğrafları bir albümde biriktirmek sana iyi gelebilir.',
          },
        },
      },
    },
  },
};
