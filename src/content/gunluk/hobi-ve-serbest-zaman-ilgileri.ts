import type { SurveyDaily } from './types';

/**
 * Hobi ve Serbest Zaman İlgileri: günlük hayatta nasıl görünür (7. sınıftan mezuna ve yetişkinlere). Ton: özellik (ilgi; iki
 * uç da eşit; lib/reports/daily-parts.ts). Bu test ilgiyi değil, 16 alandaki etkinliklerin son bir yılda ne sıklıkla
 * yapıldığını sorar (src/content/instruments/hobi-ilgileri.ts; ters madde yok): satırlar sıklığı ya da ayrılan zamanı söyler
 * ("sık sık … -ebilirsin", "seyrek yer alabilir"), sevmeyi ya da istemeyi değil (görev sayılan etkinlikler de var: evcil
 * hayvanı beslemek, küçük bir çocuğa bakmak). Düşük düzey "ilgin yok" demez ve açıklanmaz: yenilik, bilgi eksiği ya da ailenin
 * imkânı satırda söylenmez; sıklığın zamana, imkânlara ve yaşanan yere bağlı olduğunu ve az yapılan alana da ilgi
 * duyulabileceğini bölümün girişi söyler (yalnızca yere bağlı iki satır kalır: kültür ve sanatta "her yerde kolay bulunmaz",
 * evcil hayvanda "yakınında bir evcil hayvan olmayabilir"). Etkinlikler sahip olmaya bağlanmaz: bahçe, evcil hayvan, çalgı,
 * seyahat, kurs ve alışveriş varsayılmaz. Okulda zorunlu yapılanlar (ders, okul gezisi) sayılmaz: okul satırları "ders
 * dışında", "okul gezileri dışında", "ders aralarında" der; mezun da gördüğü için "sınıf" ve "teneffüs" yok. Kardeş, bahçe,
 * araç, iş ya da yakın arkadaş varsayılmaz. Her satırın dayandığı maddeler `from`'dadır; "Şiir yazmak" (h082) yaratıcı
 * etkinliklerin asıl maddesidir, yazma alanında kullanılmaz.
 * Maddeye doğrudan dayanmayan tek uzantı: yüksek sıklıkta etkinliğin boş zamanın büyük kısmını alabileceği ya da onunla
 * uğraşırken zamanın fark edilmeyebileceği (merak.ts'teki gibi). Düşük ucun bedeli yoktur (types.ts, ek kurallar).
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
            school: 'Derslerin dışında küçük çocuklarla oyun oynamak senin boş zamanında seyrek yer alabilir.',
            friends: 'Boş zamanını çoğu zaman arkadaşlarınla ya da başka uğraşlarla geçiriyor olabilirsin.',
            home: 'Küçük bir çocuğa masal anlatmak ya da ona göz kulak olmak son zamanlarda senin gününde seyrek yer almış olabilir.',
          },
          parent: {
            school: 'Derslerin dışında küçük çocuklarla oyun oynamak çocuğunuzun boş zamanında seyrek yer alabilir.',
            friends: 'Boş zamanını çoğu zaman arkadaşlarıyla ya da başka uğraşlarla geçiriyor olabilir.',
            home: 'Küçük bir çocuğa masal anlatmak ya da ona göz kulak olmak son zamanlarda çocuğunuzun gününde seyrek yer almış olabilir.',
          },
          adult: {
            work: 'Küçük çocuklarla vakit geçirmek şimdilik senin günlük hayatında pek yer almıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h014'], friends: ['h014'], home: ['h140', 'h112'], work: ['h014', 'h079'] },
          student: {
            school: 'Derslerin dışında ara sıra küçük bir çocukla oynayabilirsin.',
            friends: 'Bir buluşmada küçük bir çocuk olunca bazen onunla oynayabilir, bazen arkadaşlarınla kalmayı seçebilirsin.',
            home: 'Küçük bir çocuğa ara sıra hikâye okuyabilir ya da ona göz kulak olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derslerin dışında ara sıra küçük bir çocukla oynayabilir.',
            friends: 'Bir buluşmada küçük bir çocuk olunca bazen onunla oynayabilir, bazen arkadaşlarıyla kalmayı seçebilir.',
            home: 'Küçük bir çocuğa ara sıra hikâye okuyabilir ya da ona göz kulak olabilir.',
          },
          adult: {
            work: 'Ara sıra küçük bir çocukla oynamak ya da onu dışarı çıkarmak senin günlük hayatında yer alabilir.',
          },
        },
        high: {
          from: { school: ['h014'], friends: ['h014', 'h047'], home: ['h112', 'h079'], work: ['h140', 'h014'] },
          student: {
            school: 'Derslerin dışında küçük çocuklarla oyun oynamak senin gününde sık yer alabilir.',
            friends: 'Bir buluşmada küçük bir çocuk bulununca çoğu zaman onunla oynayabilir, oyunda kazanmasına da izin verebilirsin.',
            home: 'Küçük bir çocuğa göz kulak olmak ya da onu gezdirmek senin boş zamanının çoğunu alabilir.',
          },
          parent: {
            school: 'Derslerin dışında küçük çocuklarla oyun oynamak çocuğunuzun gününde sık yer alabilir.',
            friends: 'Bir buluşmada küçük bir çocuk bulununca çoğu zaman onunla oynayabilir, oyunda kazanmasına da izin verebilir.',
            home: 'Küçük bir çocuğa göz kulak olmak ya da onu gezdirmek boş zamanının çoğunu alabilir.',
          },
          adult: {
            work: 'Küçük bir çocuğa masal anlatmak ya da onunla oyun kurmak senin günlük hayatında sık yer alabilir.',
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
            school: 'Ders aralarında koleksiyonlar konuşulunca bu konu senin gündeminde pek olmayabilir.',
            friends: 'Arkadaşlarınla buluşunca takas ya da biriktirme yerine başka şeyler yapmayı seçebilirsin.',
            home: 'Bir şeyler biriktirmek yerine boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Ders aralarında koleksiyonlar konuşulunca bu konu çocuğunuzun gündeminde pek olmayabilir.',
            friends: 'Arkadaşlarıyla buluşunca takas ya da biriktirme yerine başka şeyler yapmayı seçebilir.',
            home: 'Bir şeyler biriktirmek yerine boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Bir koleksiyonla uğraşmak senin boş vaktinde pek yer almıyor olabilir.',
          },
        },
        average: {
          from: { school: ['h031'], friends: ['h089'], home: ['h031'], work: ['h031'] },
          student: {
            school: 'Ders aralarında biriyle topladığın şeyler hakkında ara sıra konuşabilirsin.',
            friends: 'Arkadaşlarınla ara sıra koleksiyonundan bir parçayı takas edebilirsin.',
            home: 'Koleksiyonunla bazen uzun uzun ilgilenebilir, bazen onu uzun süre kenara bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders aralarında biriyle topladığı şeyler hakkında ara sıra konuşabilir.',
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
            school: 'Biriktirdiğin şeyler hakkında okuduklarını ders aralarında sık sık anlatabilirsin.',
            friends: 'Arkadaşlarınla koleksiyonundaki parçaları sık sık takas edebilirsin.',
            home: 'Koleksiyonunu düzenlerken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz biriktirdiği şeyler hakkında okuduklarını ders aralarında sık sık anlatabilir.',
            friends: 'Arkadaşlarıyla koleksiyonundaki parçaları sık sık takas edebilir.',
            home: 'Koleksiyonunu düzenlerken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Boş anlarında sık sık koleksiyonun hakkında okuyabilir ya da ona yeni bir parça ekleyebilirsin.',
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
            school: 'Ders dışında bir şeyler çizmek ya da şiir karalamak şimdilik senin boş zamanında pek yer almıyor olabilir.',
            friends: 'Arkadaşların bir gösteri hazırlarken izleyici olmayı seçebilirsin.',
            home: 'Boş zamanında bir şeyler üretmek yerine çoğu zaman başka uğraşlara yönelebilirsin.',
          },
          parent: {
            school: 'Ders dışında bir şeyler çizmek ya da şiir karalamak şimdilik çocuğunuzun boş zamanında pek yer almıyor olabilir.',
            friends: 'Arkadaşları bir gösteri hazırlarken izleyici olmayı seçebilir.',
            home: 'Boş zamanında bir şeyler üretmek yerine çoğu zaman başka uğraşlara yönelebilir.',
          },
          adult: {
            work: 'Resim, müzik ya da şiirle uğraşmak son bir yılda senin günlerinde seyrek yer almış olabilir.',
          },
        },
        average: {
          from: { school: ['h050'], friends: ['h017'], home: ['h147'], work: ['h050'] },
          student: {
            school: 'Ders dışında ara sıra bir sanat çalışması yapabilir, bazen uzun süre ara verebilirsin.',
            friends: 'Arkadaşlarınla bazen ilk kez bir uğraşı deneyebilir, bazen bildiğin uğraşlara dönebilirsin.',
            home: 'Bazı haftalar boya ya da kalemle resim yapabilir, bazı haftalar başka şeylerle vakit geçirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında ara sıra bir sanat çalışması yapabilir, bazen uzun süre ara verebilir.',
            friends: 'Arkadaşlarıyla bazen ilk kez bir uğraşı deneyebilir, bazen bildiği uğraşlara dönebilir.',
            home: 'Bazı haftalar boya ya da kalemle resim yapabilir, bazı haftalar başka şeylerle vakit geçirebilir.',
          },
          adult: {
            work: 'Ara sıra resim, müzik ya da yazıyla bir şey üretebilir, bazı dönemler buna ara verebilirsin.',
          },
        },
        high: {
          from: { school: ['h200', 'h115'], friends: ['h017'], home: ['h147', 'h082'], work: ['h147', 'h178', 'h082'] },
          student: {
            school: 'Gösterilerde şarkı söylemek, çalgı çalmak ya da rol almak senin hayatında sık yer alabilir.',
            friends: 'Arkadaşlarınla sık sık ilk kez bir uğraşı deneyebilirsin.',
            home: 'Resim yaparken ya da şiir yazarken başka işleri unutabilirsin.',
          },
          parent: {
            school: 'Gösterilerde şarkı söylemek, çalgı çalmak ya da rol almak çocuğunuzun hayatında sık yer alabilir.',
            friends: 'Arkadaşlarıyla sık sık ilk kez bir uğraşı deneyebilir.',
            home: 'Resim yaparken ya da şiir yazarken başka işleri unutabilir.',
          },
          adult: {
            work: 'Günlük işlerin dışında sık sık resim yapabilir, çalgı çalabilir ya da şiir yazabilirsin.',
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
            school: 'Okul gezileri dışında müze ya da sergi gezmek şimdilik senin boş zamanında pek yer almıyor olabilir.',
            friends: 'Arkadaşların bir konsere ya da sergiye gitmeyi önerince başka bir planı seçebilirsin.',
            home: 'Bu tür etkinlikler her yerde kolay bulunmaz; boş zamanını başka yollarla geçiriyor olabilirsin.',
          },
          parent: {
            school: 'Okul gezileri dışında müze ya da sergi gezmek şimdilik çocuğunuzun boş zamanında pek yer almıyor olabilir.',
            friends: 'Arkadaşları bir konsere ya da sergiye gitmeyi önerince başka bir planı seçebilir.',
            home: 'Bu tür etkinlikler her yerde kolay bulunmaz; boş zamanını başka yollarla geçiriyor olabilir.',
          },
          adult: {
            work: 'Sergi ve konserler son bir yılda senin gündeminde pek yer almamış olabilir.',
          },
        },
        average: {
          from: { school: ['h072', 'h040'], friends: ['h137', 'h169'], home: ['h007'], work: ['h137', 'h169'] },
          student: {
            school: 'Okul gezileri dışında da ara sıra bir müzeye ya da sergiye gidebilirsin.',
            friends: 'Arkadaşlarınla bazen bir konsere ya da tiyatroya gidebilir, bazen başka bir buluşmayı seçebilirsin.',
            home: 'Bir söyleşi duyunca bazen gidebilir, bazen evde kalmayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okul gezileri dışında da ara sıra bir müzeye ya da sergiye gidebilir.',
            friends: 'Arkadaşlarıyla bazen bir konsere ya da tiyatroya gidebilir, bazen başka bir buluşmayı seçebilir.',
            home: 'Bir söyleşi duyunca bazen gidebilir, bazen evde kalmayı seçebilir.',
          },
          adult: {
            work: 'Yılda birkaç kez bir konsere ya da tiyatroya gidebilir, bazı dönemler buna ara verebilirsin.',
          },
        },
        high: {
          from: { school: ['h040', 'h072'], friends: ['h040', 'h169', 'h137'], home: ['h040', 'h169'], work: ['h040', 'h007', 'h137'] },
          student: {
            school: 'Okul gezileri dışında da sık sık müze ya da sergi gezebilirsin.',
            friends: 'Arkadaşlarınla sık sık bir sergiye, tiyatroya ya da konsere gidebilirsin.',
            home: 'Sergiler ve gösteriler senin boş zamanının büyük kısmını alabilir.',
          },
          parent: {
            school: 'Çocuğunuz okul gezileri dışında da sık sık müze ya da sergi gezebilir.',
            friends: 'Arkadaşlarıyla sık sık bir sergiye, tiyatroya ya da konsere gidebilir.',
            home: 'Sergiler ve gösteriler boş zamanının büyük kısmını alabilir.',
          },
          adult: {
            work: 'Günlük işlerin dışında sık sık bir sergiye, söyleşiye ya da konsere gidebilirsin.',
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
          from: { school: ['h104'], friends: ['h006', 'h196'], home: ['h168'], work: ['h104'] },
          student: {
            school: 'Ders saatleri dışında uzun süreli egzersiz şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşların koşuya ya da bir egzersiz programına çağırınca başka bir planı seçebilirsin.',
            home: 'Boş zamanında yoga gibi hareketlere seyrek yer veriyor olabilirsin.',
          },
          parent: {
            school: 'Ders saatleri dışında uzun süreli egzersiz şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşları koşuya ya da bir egzersiz programına çağırınca başka bir planı seçebilir.',
            home: 'Çocuğunuz boş zamanında yoga gibi hareketlere seyrek yer veriyor olabilir.',
          },
          adult: {
            work: 'Uzun süreli egzersiz son zamanlarda senin gününde seyrek yer almış olabilir.',
          },
        },
        average: {
          from: { school: ['h006'], friends: ['h129'], home: ['h168'], work: ['h196'] },
          student: {
            school: 'Ders saatleri dışında da ara sıra koşuya çıkabilirsin.',
            friends: 'Arkadaşlarınla bazen tempolu bir yürüyüşe çıkabilir, bazen oturup sohbet etmeyi seçebilirsin.',
            home: 'Bazı haftalar yoga gibi egzersizler yapabilir, bazı haftalar buna ara verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders saatleri dışında da ara sıra koşuya çıkabilir.',
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
            school: 'Ders saatleri dışında da sık sık koşabilir ya da bir egzersiz programına katılabilirsin.',
            friends: 'Arkadaşlarınla sık sık koşuya ya da tempolu bir yürüyüşe çıkabilirsin.',
            home: 'Egzersize çok zaman ayırırken dinlenmeye zaman ayırmayı unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders saatleri dışında da sık sık koşabilir ya da bir egzersiz programına katılabilir.',
            friends: 'Arkadaşlarıyla sık sık koşuya ya da tempolu bir yürüyüşe çıkabilir.',
            home: 'Egzersize çok zaman ayırırken dinlenmeye zaman ayırmayı unutabilir.',
          },
          adult: {
            work: 'Sık sık bir seferde kırk dakikadan uzun egzersiz yapabilirsin.',
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
            friends: 'Arkadaşlarınla buluşunca moda ve giyim çoğu zaman sohbetin konusu olmayabilir.',
            home: 'Moda dergilerine ya da kitaplarına seyrek göz atıyor olabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz sabah hazırlanırken ne giyeceğine çabucak karar verebilir.',
            friends: 'Arkadaşlarıyla buluşunca moda ve giyim çoğu zaman sohbetin konusu olmayabilir.',
            home: 'Moda dergilerine ya da kitaplarına seyrek göz atıyor olabilir.',
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
            home: 'Ara sıra bir moda dergisine göz atabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı sabahlar ne giyeceğini uzun düşünebilir, bazı sabahlar çabucak hazırlanabilir.',
            friends: 'Arkadaşlarıyla buluşmadan önce bazen kıyafetini uzun uzun seçebilir, bazen ilk eline geleni giyebilir.',
            home: 'Ara sıra bir moda dergisine göz atabilir.',
          },
          adult: {
            work: 'Önemli bir gün için ne giyeceğini bazen uzun uzun düşünebilir, sıradan günlerde çabucak karar verebilirsin.',
          },
        },
        high: {
          from: { school: ['h029'], friends: ['h067'], home: ['h094', 'h127'], work: ['h029', 'h094'] },
          student: {
            school: 'Sabahları ne giyeceğini düşünmek senin için sık sık on dakikayı geçebilir.',
            friends: 'Arkadaşlarınla buluşmadan önce ne giyeceğini seçmek bir saatten uzun sürebilir.',
            home: 'Moda dergilerine ya da kitaplarına sık sık göz atabilirsin.',
          },
          parent: {
            school: 'Sabahları ne giyeceğini düşünmek çocuğunuz için sık sık on dakikayı geçebilir.',
            friends: 'Arkadaşlarıyla buluşmadan önce ne giyeceğini seçmek bir saatten uzun sürebilir.',
            home: 'Moda dergilerine ya da kitaplarına sık sık göz atabilir.',
          },
          adult: {
            work: 'Kıyafetini özenle seçmek ve modayı takip etmek senin gününde sık yer alabilir.',
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
          from: { school: ['h151'], friends: ['h182', 'h086'], home: ['h054', 'h119'], work: ['h086'] },
          student: {
            school: 'Ders aralarında satranç oynayanlar olunca başka bir şey yapmayı seçebilirsin.',
            friends: 'Arkadaşlarınla buluşmalarda kutu ya da kart oyunları pek yer almıyor olabilir.',
            home: 'Yapboz ya da tavla senin evde seyrek açtığın oyunlar olabilir.',
          },
          parent: {
            school: 'Ders aralarında satranç oynayanlar olunca çocuğunuz başka bir şey yapmayı seçebilir.',
            friends: 'Arkadaşlarıyla buluşmalarda kutu ya da kart oyunları pek yer almıyor olabilir.',
            home: 'Yapboz ya da tavla çocuğunuzun evde seyrek açtığı oyunlar olabilir.',
          },
          adult: {
            work: 'Kart ya da masa oyunları senin boş vaktinde pek yer tutmuyor olabilir.',
          },
        },
        average: {
          from: { school: ['h151'], friends: ['h086'], home: ['h054'], work: ['h119'] },
          student: {
            school: 'Ders aralarında bazen bir satranç partisine oturabilir, bazen başka bir şey yapmayı seçebilirsin.',
            friends: 'Arkadaşlarınla buluşunca bazen bir kart oyunu açabilir, bazen sohbet etmeyi seçebilirsin.',
            home: 'Bir yapbozu bazen bir oturuşta bitirebilir, bazen günlerce yarım bırakabilirsin.',
          },
          parent: {
            school: 'Ders aralarında çocuğunuz bazen bir satranç partisine oturabilir, bazen başka bir şey yapmayı seçebilir.',
            friends: 'Arkadaşlarıyla buluşunca bazen bir kart oyunu açabilir, bazen sohbet etmeyi seçebilir.',
            home: 'Bir yapbozu bazen bir oturuşta bitirebilir, bazen günlerce yarım bırakabilir.',
          },
          adult: {
            work: 'Ara sıra tavla ya da bir kutu oyunu oynayabilirsin.',
          },
        },
        high: {
          from: { school: ['h151'], friends: ['h182'], home: ['h054'], work: ['h119', 'h086'] },
          student: {
            school: 'Ders aralarında sık sık bir satranç partisine oturabilirsin.',
            friends: 'Arkadaşlarınla sık sık daha önce oynamadığın bir kutu oyununu öğrenebilirsin.',
            home: 'Bir yapboza ya da oyuna dalınca zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders aralarında sık sık bir satranç partisine oturabilir.',
            friends: 'Arkadaşlarıyla sık sık daha önce oynamadığı bir kutu oyununu öğrenebilir.',
            home: 'Bir yapboza ya da oyuna dalınca zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Yakınlarınla tavla, kart ya da bir kutu oyunu oynamak günlük hayatında sık yer alabilir.',
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
          from: { school: ['h107'], friends: ['h139'], home: ['h009'], work: ['h139', 'h107'] },
          student: {
            school: 'Okuldaki etkinlikler dışında bitki dikmek senin için seyrek yapılan bir iş olabilir.',
            friends: 'Arkadaşlarınla dışarıdayken çiçek toplamak pek aklına gelmeyebilir.',
            home: 'Saksıdaki bir bitkiye bakmak şimdilik senin günlük işlerin arasında pek yer almıyor olabilir.',
          },
          parent: {
            school: 'Okuldaki etkinlikler dışında bitki dikmek çocuğunuz için seyrek yapılan bir iş olabilir.',
            friends: 'Arkadaşlarıyla dışarıdayken çiçek toplamak pek aklına gelmeyebilir.',
            home: 'Saksıdaki bir bitkiye bakmak şimdilik çocuğunuzun günlük işleri arasında pek yer almıyor olabilir.',
          },
          adult: {
            work: 'Çiçek almak ya da yeni bir bitki dikmek son bir yılda senin gündeminde pek yer almamış olabilir.',
          },
        },
        average: {
          from: { school: ['h107'], friends: ['h139'], home: ['h009'], work: ['h107'] },
          student: {
            school: 'Okuldaki etkinlikler dışında da ara sıra bir bitki dikebilirsin.',
            friends: 'Arkadaşlarınla dışarıdayken bazen çiçek toplayabilir, bazen bunu pek düşünmeyebilirsin.',
            home: 'Bir saksı bitkisine bazen düzenli bakabilir, bazen onu bir süre unutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okuldaki etkinlikler dışında da ara sıra bir bitki dikebilir.',
            friends: 'Arkadaşlarıyla dışarıdayken bazen çiçek toplayabilir, bazen bunu pek düşünmeyebilir.',
            home: 'Bir saksı bitkisine bazen düzenli bakabilir, bazen onu bir süre unutabilir.',
          },
          adult: {
            work: 'Bir bitkiyi daha büyük bir saksıya almak gibi işler ara sıra senin günlük işlerin arasında yer alabilir.',
          },
        },
        high: {
          from: { school: ['h107'], friends: ['h139'], home: ['h009'], work: ['h009', 'h107'] },
          student: {
            school: 'Okuldaki etkinlikler dışında da sık sık bitki dikebilir ya da saksı değiştirebilirsin.',
            friends: 'Arkadaşlarınla dışarıdayken sık sık çiçek toplayabilirsin.',
            home: 'Bitkilerin düzenli bakımı senin gününden her gün biraz zaman alabilir.',
          },
          parent: {
            school: 'Çocuğunuz okuldaki etkinlikler dışında da sık sık bitki dikebilir ya da saksı değiştirebilir.',
            friends: 'Arkadaşlarıyla dışarıdayken sık sık çiçek toplayabilir.',
            home: 'Bitkilerin düzenli bakımı gününden her gün biraz zaman alabilir.',
          },
          adult: {
            work: 'Saksıdaki bitkilere bakmak ya da yeni bir bitki dikmek senin günlük işlerin arasında sık yer alabilir.',
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
          from: { school: ['h111'], friends: ['h046', 'h078'], home: ['h013', 'h143'], work: ['h046', 'h078'] },
          student: {
            school: 'Okuldaki bir kutlamanın hazırlığını başkalarına bırakmayı seçebilirsin.',
            friends: 'Arkadaşlarınla kutlamalara ya da eğlencelere gitmek son zamanlarda seyrek olmuş olabilir.',
            home: 'Misafir ağırlamak şimdilik senin hayatında pek yer almıyor olabilir.',
          },
          parent: {
            school: 'Çocuğunuz okuldaki bir kutlamanın hazırlığını başkalarına bırakmayı seçebilir.',
            friends: 'Arkadaşlarıyla kutlamalara ya da eğlencelere gitmek son zamanlarda seyrek olmuş olabilir.',
            home: 'Misafir ağırlamak şimdilik çocuğunuzun hayatında pek yer almıyor olabilir.',
          },
          adult: {
            work: 'Kutlamalara ve davetlere katılmak son bir yılda senin hayatında seyrek yer almış olabilir.',
          },
        },
        average: {
          from: { school: ['h111'], friends: ['h078', 'h046'], home: ['h013'], work: ['h046', 'h013'] },
          student: {
            school: 'Okuldaki bir kutlamanın hazırlığına bazen katılabilir, bazen yalnızca eğlenmeyi seçebilirsin.',
            friends: 'Arkadaşlarınla ara sıra küçük ya da kalabalık bir kutlamaya gidebilirsin.',
            home: 'Ara sıra evde misafir ağırlayabilir, bazen sakin bir akşamı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okuldaki bir kutlamanın hazırlığına bazen katılabilir, bazen yalnızca eğlenmeyi seçebilir.',
            friends: 'Arkadaşlarıyla ara sıra küçük ya da kalabalık bir kutlamaya gidebilir.',
            home: 'Ara sıra evde misafir ağırlayabilir, bazen sakin bir akşamı seçebilir.',
          },
          adult: {
            work: 'Ara sıra küçük bir kutlamaya gidebilir ya da birkaç kişiyi yemeğe çağırabilirsin.',
          },
        },
        high: {
          from: { school: ['h111'], friends: ['h046', 'h078'], home: ['h143'], work: ['h111', 'h143'] },
          student: {
            school: 'Okuldaki kutlamaların hazırlığında sık sık görev alabilirsin.',
            friends: 'Arkadaşlarınla sık sık küçük ya da kalabalık kutlamalara gidebilirsin.',
            home: 'Kalabalık bir misafirliği hazırlarken saatlerce uğraşabilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Çocuğunuz okuldaki kutlamaların hazırlığında sık sık görev alabilir.',
            friends: 'Arkadaşlarıyla sık sık küçük ya da kalabalık kutlamalara gidebilir.',
            home: 'Kalabalık bir misafirliği hazırlarken saatlerce uğraşabilir; başka işler bekleyebilir.',
          },
          adult: {
            work: 'Sık sık bir kutlama düzenleyebilir ya da kalabalık bir misafir grubunu ağırlayabilirsin.',
          },
        },
      },
    },
    /* Evcil hayvanlar: h028 bir evcil hayvanla oynamak, h052 yemek vermek, h084 bakımını yapmak, h117 yıkamak ya da tüylerini
       taramak, h149 satın almak ya da sahiplenmek. Evcil hayvan varsayılmaz. */
    pets: {
      poles: { low: 'Hayvanlarla seyrek uğraşır', high: 'Hayvanlarla sık uğraşır' },
      bands: {
        low: {
          from: { school: ['h028', 'h084'], friends: ['h028'], home: ['h028'], work: ['h084'] },
          student: {
            school: 'Derslerin dışında bir hayvanla ilgilenmek şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla oynamak senin için seyrek yaşanan bir şey olabilir.',
            home: 'Yakınında bir evcil hayvan olmayabilir; boş zamanını başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Derslerin dışında bir hayvanla ilgilenmek şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla oynamak çocuğunuz için seyrek yaşanan bir şey olabilir.',
            home: 'Yakınında bir evcil hayvan olmayabilir; boş zamanını başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin arasında bir evcil hayvana bakmak senin için pek yer tutmuyor olabilir.',
          },
        },
        average: {
          from: { school: ['h028', 'h084'], friends: ['h028'], home: ['h052'], work: ['h084'] },
          student: {
            school: 'Derslerin dışında bir hayvanla ilgilenmek ara sıra senin gününde yer alabilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla ara sıra oynayabilirsin.',
            home: 'Yakınındaki bir evcil hayvana ara sıra yemek verebilirsin.',
          },
          parent: {
            school: 'Derslerin dışında bir hayvanla ilgilenmek ara sıra çocuğunuzun gününde yer alabilir.',
            friends: 'Bir arkadaşının evcil hayvanıyla ara sıra oynayabilir.',
            home: 'Yakınındaki bir evcil hayvana ara sıra yemek verebilir.',
          },
          adult: {
            work: 'Ara sıra bir evcil hayvanın bakımına yardım edebilirsin.',
          },
        },
        high: {
          from: { school: ['h028', 'h084'], friends: ['h028'], home: ['h052', 'h117'], work: ['h028', 'h084'] },
          student: {
            school: 'Derslerin dışında bir hayvanla ilgilenmek senin gününde sık yer alabilir.',
            friends: 'Arkadaşlarınla buluşunca sık sık bir evcil hayvanla oynayabilirsin.',
            home: 'Bir hayvanı beslemek, yıkamak ya da taramak senin gününden düzenli olarak zaman alabilir.',
          },
          parent: {
            school: 'Derslerin dışında bir hayvanla ilgilenmek çocuğunuzun gününde sık yer alabilir.',
            friends: 'Arkadaşlarıyla buluşunca sık sık bir evcil hayvanla oynayabilir.',
            home: 'Bir hayvanı beslemek, yıkamak ya da taramak gününden düzenli olarak zaman alabilir.',
          },
          adult: {
            work: 'Bir evcil hayvanla oynamak ve onun bakımını yapmak senin gününde sık yer alabilir.',
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
            school: 'Ders kitapları dışında bir kitap açmak şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarınla buluşmalarda kitaplardan çok başka konular öne çıkabilir.',
            home: 'Uyumadan önce kitap yerine başka şeylerle vakit geçirmeyi seçebilirsin.',
          },
          parent: {
            school: 'Ders kitapları dışında bir kitap açmak şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarıyla buluşmalarda kitaplardan çok başka konular öne çıkabilir.',
            home: 'Uyumadan önce kitap yerine başka şeylerle vakit geçirmeyi seçebilir.',
          },
          adult: {
            work: 'Bir kitap açmak son zamanlarda senin boş vaktinde pek yer almamış olabilir.',
          },
        },
        average: {
          from: { school: ['h113'], friends: ['h113'], home: ['h199'], work: ['h113'] },
          student: {
            school: 'Ders dışında bazen bir kitaba başlayabilir, bazen onu bir süre bekletebilirsin.',
            friends: 'Bir arkadaşının önerdiği bir kitabı bazen okuyabilir, bazen başka bir şeyi seçebilirsin.',
            home: 'Bazı akşamlar uyumadan önce kitap okuyabilir, bazı akşamlar başka şeylerle vakit geçirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında bazen bir kitaba başlayabilir, bazen onu bir süre bekletebilir.',
            friends: 'Bir arkadaşının önerdiği bir kitabı bazen okuyabilir, bazen başka bir şeyi seçebilir.',
            home: 'Bazı akşamlar uyumadan önce kitap okuyabilir, bazı akşamlar başka şeylerle vakit geçirebilir.',
          },
          adult: {
            work: 'Yoğun dönemlerde kitaplar bekleyebilir, sakin dönemlerde bir kitaba dalabilirsin.',
          },
        },
        high: {
          from: { school: ['h208', 'h113'], friends: ['h113'], home: ['h209', 'h199'], work: ['h208', 'h199'] },
          student: {
            school: 'Ders dışında da sık sık kütüphaneye gidebilir ya da yeni bir kitaba başlayabilirsin.',
            friends: 'Arkadaşlarınla okuduğun kitaplar hakkında sık sık konuşabilirsin.',
            home: 'Sevdiğin bir kitabı bir solukta bitirmek isterken uykunu erteleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında da sık sık kütüphaneye gidebilir ya da yeni bir kitaba başlayabilir.',
            friends: 'Arkadaşlarıyla okuduğu kitaplar hakkında sık sık konuşabilir.',
            home: 'Sevdiği bir kitabı bir solukta bitirmek isterken uykusunu erteleyebilir.',
          },
          adult: {
            work: 'Sık sık kütüphaneye gidebilir ya da uyumadan önce kitap okuyabilirsin.',
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
            school: 'Ders dışında ilgini çeken bir konuyu kendi başına araştırmak şimdilik senin gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarınla vakit geçirirken ilk kez bir şey öğrenmeye girişmek yerine bildiğin şeyleri yapmayı seçebilirsin.',
            home: 'Boş zamanını dinlenmeye ya da başka uğraşlara ayırıyor olabilirsin.',
          },
          parent: {
            school: 'Ders dışında ilgisini çeken bir konuyu kendi başına araştırmak şimdilik çocuğunuzun gününde pek yer almıyor olabilir.',
            friends: 'Arkadaşlarıyla vakit geçirirken ilk kez bir şey öğrenmeye girişmek yerine bildiği şeyleri yapmayı seçebilir.',
            home: 'Boş zamanını dinlenmeye ya da başka uğraşlara ayırıyor olabilir.',
          },
          adult: {
            work: 'Bir kursa yazılmak ya da kendini geliştirmeye yönelik bir kitaba göz atmak senin gündeminde seyrek yer alabilir.',
          },
        },
        average: {
          from: { school: ['h128'], friends: ['h160'], home: ['h063'], work: ['h160'] },
          student: {
            school: 'Ders dışında ilgini çeken bir konuyu bazen kendiliğinden çalışabilir, bazen ona ara verebilirsin.',
            friends: 'Arkadaşlarınla bazen birlikte bir şey öğrenmeye girişebilir, bazen bildiğin uğraşlara dönebilirsin.',
            home: 'Bir kişisel gelişim kitabını bazen sonuna kadar okuyabilir, bazen yarıda bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında ilgisini çeken bir konuyu bazen kendiliğinden çalışabilir, bazen ona ara verebilir.',
            friends: 'Arkadaşlarıyla bazen birlikte bir şey öğrenmeye girişebilir, bazen bildiği uğraşlara dönebilir.',
            home: 'Bir kişisel gelişim kitabını bazen sonuna kadar okuyabilir, bazen yarıda bırakabilir.',
          },
          adult: {
            work: 'Bir beceri edinmek bazen senin gündeminde olabilir, bazen geri planda kalabilir.',
          },
        },
        high: {
          from: { school: ['h128'], friends: ['h160'], home: ['h128', 'h160'], work: ['h160', 'h190'] },
          student: {
            school: 'Ders dışında ilgini çeken bir konuyu sık sık kendi isteğinle araştırabilirsin.',
            friends: 'Arkadaşlarınla sık sık birlikte yeni bir beceri öğrenmeye girişebilirsin.',
            home: 'Öğrenmek istediğin şeylerin listesi uzayınca hepsine zaman bulmak zor olabilir.',
          },
          parent: {
            school: 'Çocuğunuz ders dışında ilgisini çeken bir konuyu sık sık kendi isteğiyle araştırabilir.',
            friends: 'Arkadaşlarıyla sık sık birlikte yeni bir beceri öğrenmeye girişebilir.',
            home: 'Öğrenmek istediği şeylerin listesi uzayınca hepsine zaman bulmak zor olabilir.',
          },
          adult: {
            work: 'Günlük işlerin dışında sık sık yeni bir beceri öğrenebilir ya da bir kursa katılabilirsin.',
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
            school: 'Ders aralarında bir maç konuşulurken dinlemeyi ya da başka bir konuya geçmeyi seçebilirsin.',
            friends: 'Arkadaşların bir takım sporu oynarken izlemeyi ya da başka bir şey yapmayı seçebilirsin.',
            home: 'Ekranda bir maç varken çoğu zaman başka bir şeyle uğraşabilirsin.',
          },
          parent: {
            school: 'Ders aralarında bir maç konuşulurken çocuğunuz dinlemeyi ya da başka bir konuya geçmeyi seçebilir.',
            friends: 'Arkadaşları bir takım sporu oynarken izlemeyi ya da başka bir şey yapmayı seçebilir.',
            home: 'Ekranda bir maç varken çoğu zaman başka bir şeyle uğraşabilir.',
          },
          adult: {
            work: 'Çevrende bir maç konuşulurken sohbete katılmak yerine başka konulara geçebilirsin.',
          },
        },
        average: {
          from: { school: ['h004'], friends: ['h133', 'h100'], home: ['h035'], work: ['h035', 'h100'] },
          student: {
            school: 'Ders aralarında bazen bir maçı konuşabilir, bazen başka konuları seçebilirsin.',
            friends: 'Arkadaşlarınla bazen basketbol ya da başka bir takım sporu oynayabilir, bazen izlemeyi seçebilirsin.',
            home: 'Önemli bir maçı bazen ekrandan izleyebilir, bazen kaçırmayı dert etmeyebilirsin.',
          },
          parent: {
            school: 'Ders aralarında çocuğunuz bazen bir maçı konuşabilir, bazen başka konuları seçebilir.',
            friends: 'Arkadaşlarıyla bazen basketbol ya da başka bir takım sporu oynayabilir, bazen izlemeyi seçebilir.',
            home: 'Önemli bir maçı bazen ekrandan izleyebilir, bazen kaçırmayı dert etmeyebilir.',
          },
          adult: {
            work: 'Ara sıra bir maç izleyebilir ya da bir takım sporu oynayabilirsin.',
          },
        },
        high: {
          from: { school: ['h004'], friends: ['h100', 'h068'], home: ['h035'], work: ['h100', 'h035'] },
          student: {
            school: 'Ders aralarında sık sık maçları ve takımları konuşabilirsin.',
            friends: 'Arkadaşlarınla sık sık takım hâlinde top oynayabilir ya da bir maça gidebilirsin.',
            home: 'Önemli bir maç olduğunda başka işleri erteleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders aralarında sık sık maçları ve takımları konuşabilir.',
            friends: 'Arkadaşlarıyla sık sık takım hâlinde top oynayabilir ya da bir maça gidebilir.',
            home: 'Önemli bir maç olduğunda başka işleri erteleyebilir.',
          },
          adult: {
            work: 'Günlük işlerin dışında sık sık bir takımda oynayabilir ya da maç izleyebilirsin.',
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
            school: 'Ders dışındaki günlerde piknik ya da doğa yürüyüşü senin hayatında seyrek yer alabilir.',
            friends: 'Arkadaşlarınla vakit geçirirken açık havada yürümek yerine oturup sohbet etmeyi seçebilirsin.',
            home: 'Boş zamanını çoğu zaman kapalı yerlerde ya da evine yakın yerlerde geçiriyor olabilirsin.',
          },
          parent: {
            school: 'Ders dışındaki günlerde piknik ya da doğa yürüyüşü çocuğunuzun hayatında seyrek yer alabilir.',
            friends: 'Arkadaşlarıyla vakit geçirirken açık havada yürümek yerine oturup sohbet etmeyi seçebilir.',
            home: 'Boş zamanını çoğu zaman kapalı yerlerde ya da evine yakın yerlerde geçiriyor olabilir.',
          },
          adult: {
            work: 'Piknik ya da doğa yürüyüşü son bir yılda senin boş zamanında pek yer almamış olabilir.',
          },
        },
        average: {
          from: { school: ['h044', 'h011'], friends: ['h011'], home: ['h044'], work: ['h011', 'h044'] },
          student: {
            school: 'Okul gezileri dışında ara sıra bir doğa yürüyüşüne ya da pikniğe çıkabilirsin.',
            friends: 'Arkadaşlarınla bazen bir parkta piknik yapabilir, bazen kapalı bir yerde buluşmayı seçebilirsin.',
            home: 'Hava güzel olunca ara sıra yürüyüşe çıkabilir, bazen evde kalmayı seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okul gezileri dışında ara sıra bir doğa yürüyüşüne ya da pikniğe çıkabilir.',
            friends: 'Arkadaşlarıyla bazen bir parkta piknik yapabilir, bazen kapalı bir yerde buluşmayı seçebilir.',
            home: 'Hava güzel olunca ara sıra yürüyüşe çıkabilir, bazen evde kalmayı seçebilir.',
          },
          adult: {
            work: 'Ara sıra pikniğe ya da bir doğa yürüyüşüne çıkabilirsin.',
          },
        },
        high: {
          from: { school: ['h044'], friends: ['h011', 'h109', 'h194'], home: ['h044', 'h011'], work: ['h044', 'h076'] },
          student: {
            school: 'Okul gezileri dışında da sık sık doğa yürüyüşüne çıkabilirsin.',
            friends: 'Arkadaşlarınla sık sık pikniğe, yüzmeye ya da balık tutmaya gidebilirsin.',
            home: 'Açık hava etkinlikleri senin hafta sonlarının büyük kısmını alabilir.',
          },
          parent: {
            school: 'Çocuğunuz okul gezileri dışında da sık sık doğa yürüyüşüne çıkabilir.',
            friends: 'Arkadaşlarıyla sık sık pikniğe, yüzmeye ya da balık tutmaya gidebilir.',
            home: 'Açık hava etkinlikleri hafta sonlarının büyük kısmını alabilir.',
          },
          adult: {
            work: 'Boş günlerini sık sık doğada yürüyerek ya da kumsalda dolaşarak geçirebilirsin.',
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
          from: { school: ['h041', 'h008'], friends: ['h041'], home: ['h008'], work: ['h041'] },
          student: {
            school: 'Okul gezileri dışında yeni yerler görmek son bir yılda senin hayatında seyrek yer almış olabilir.',
            friends: 'Arkadaşlarınla çoğu zaman yaşadığın yerde ya da yakın çevrede buluşabilirsin.',
            home: 'Uzun bir yolculuğa çıkmak son bir yılda senin hayatında pek yer almamış olabilir.',
          },
          parent: {
            school: 'Okul gezileri dışında yeni yerler görmek son bir yılda çocuğunuzun hayatında seyrek yer almış olabilir.',
            friends: 'Arkadaşlarıyla çoğu zaman yaşadığı yerde ya da yakın çevrede buluşabilir.',
            home: 'Uzun bir yolculuğa çıkmak son bir yılda çocuğunuzun hayatında pek yer almamış olabilir.',
          },
          adult: {
            work: 'Görülmesi güzel bir yeri gezmek son bir yılda senin gündeminde seyrek yer almış olabilir.',
          },
        },
        average: {
          from: { school: ['h041'], friends: ['h041'], home: ['h008', 'h073'], work: ['h041'] },
          student: {
            school: 'Okul gezileri dışında da ara sıra yeni bir yer görebilirsin.',
            friends: 'Arkadaşlarına gezdiğin bir yeri ara sıra anlatabilirsin.',
            home: 'Ara sıra bir yolculuğa çıkabilir, dönünce çektiğin fotoğraflara bakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz okul gezileri dışında da ara sıra yeni bir yer görebilir.',
            friends: 'Arkadaşlarına gezdiği bir yeri ara sıra anlatabilir.',
            home: 'Ara sıra bir yolculuğa çıkabilir, dönünce çektiği fotoğraflara bakabilir.',
          },
          adult: {
            work: 'Yılda birkaç kez görülmesi güzel bir yeri gezebilirsin.',
          },
        },
        high: {
          from: { school: ['h041'], friends: ['h073'], home: ['h008'], work: ['h041', 'h138'] },
          student: {
            school: 'Okul gezileri dışında da sık sık yeni yerler görebilirsin.',
            friends: 'Gezdiğin yerlerde çektiğin fotoğrafları arkadaşlarına sık sık gösterebilirsin.',
            home: 'Bir yolculuğun hazırlığı ve dönüşü senin boş zamanının önemli bir kısmını alabilir.',
          },
          parent: {
            school: 'Çocuğunuz okul gezileri dışında da sık sık yeni yerler görebilir.',
            friends: 'Gezdiği yerlerde çektiği fotoğrafları arkadaşlarına sık sık gösterebilir.',
            home: 'Bir yolculuğun hazırlığı ve dönüşü boş zamanının önemli bir kısmını alabilir.',
          },
          adult: {
            work: 'Günlük işlerin dışında sık sık yeni yerler görebilir ya da trenle yolculuk edebilirsin.',
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
            school: 'Bir öğretmene ya da arkadaşa teşekkür notu yazmak şimdilik senin gününde seyrek yer alabilir.',
            friends: 'Arkadaşlarına kâğıda mektup yazmak yerine başka yollarla haberleşiyor olabilirsin.',
            home: 'Yaşadıklarını günlüğe yazmak ya da albümde biriktirmek yerine başka yollarla saklıyor olabilirsin.',
          },
          parent: {
            school: 'Bir öğretmene ya da arkadaşa teşekkür notu yazmak şimdilik çocuğunuzun gününde seyrek yer alabilir.',
            friends: 'Arkadaşlarına kâğıda mektup yazmak yerine başka yollarla haberleşiyor olabilir.',
            home: 'Yaşadıklarını günlüğe yazmak ya da albümde biriktirmek yerine başka yollarla saklıyor olabilir.',
          },
          adult: {
            work: 'Günlük tutmak ya da birine teşekkür notu yazmak senin gününde seyrek yer alabilir.',
          },
        },
        average: {
          from: { school: ['h110'], friends: ['h077', 'h045'], home: ['h012'], work: ['h174', 'h142'] },
          student: {
            school: 'Bazen bir teşekkür notu yazabilir, bazen teşekkürünü sözle söylemeyi seçebilirsin.',
            friends: 'Bir arkadaşına ara sıra elle birkaç satır yazabilirsin.',
            home: 'Günlüğüne bazen her gün yazabilir, bazen uzun süre ara verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazen bir teşekkür notu yazabilir, bazen teşekkürünü sözle söylemeyi seçebilir.',
            friends: 'Bir arkadaşına ara sıra elle birkaç satır yazabilir.',
            home: 'Günlüğüne bazen her gün yazabilir, bazen uzun süre ara verebilir.',
          },
          adult: {
            work: 'Önemli günlerin fotoğraflarını ya da biletlerini bazen bir deftere ya da albüme koyabilirsin.',
          },
        },
        high: {
          from: { school: ['h110'], friends: ['h077', 'h045'], home: ['h012', 'h174'], work: ['h012', 'h142'] },
          student: {
            school: 'Bir öğretmene ya da arkadaşa teşekkür için sık sık birkaç satır yazabilirsin.',
            friends: 'Bir arkadaşına sık sık kâğıda yazılmış bir mektup ya da kart gönderebilirsin.',
            home: 'Günlüğüne yazarken ya da hatıralarını bir deftere yapıştırırken zamanın nasıl geçtiğini fark etmeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir öğretmene ya da arkadaşa teşekkür için sık sık birkaç satır yazabilir.',
            friends: 'Bir arkadaşına sık sık kâğıda yazılmış bir mektup ya da kart gönderebilir.',
            home: 'Günlüğüne yazarken ya da hatıralarını bir deftere yapıştırırken zamanın nasıl geçtiğini fark etmeyebilir.',
          },
          adult: {
            work: 'Yaşadıklarını sık sık bir günlüğe yazabilir ya da fotoğrafları bir albümde biriktirebilirsin.',
          },
        },
      },
    },
  },
};
