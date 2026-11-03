import type { SurveyDaily } from './types';

/**
 * Duygusal Zekâ Bileşenleri: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: gelişim
 * (lib/reports/daily-parts.ts, `scaleTone`): örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca
 * uydurma bir zorluk yazılmaz. Şablon (src/content/reports/duygusal-zeka-bilesenleri.ts) yüksek ya da düşük puanın tek
 * başına iyi ya da kötü olmadığını söyler; duygulara göre karar verme ve üzücü olaylardan etkilenmede iki uç da eşittir. Bu
 * yüzden örnekler hiçbir ucu övmez ya da eksik göstermez: yalnızca maddelerin sorduğu davranışı anlatır. Gergin anda sakin
 * kalmak (rdis06, rdis10) ya da kararda gerçeklere bakmak (edec09) maddenin kendisidir, uydurma bir güçlü yan değildir.
 * Şablonun önerileri ve maddeye dayanmayan yorumları ("insanlarla yakın bağlar kurmana yardım edebilir", "konuşmadan önce
 * biraz sakinleşmek") örneklere taşınmadı. Destek kutusu yoktur.
 *
 * Kullanılmayan maddeler: evsizler, yoksullar ve işsizlerle ilgili üç madde (empc03, empc05, empc10; test bunları görüş
 * sormayan şefkat maddeleri sayar, ama günlük bir örnekte okuyanın kendi ailesine dokunabilir: yoksulluk ya da işsizlik), "İnsanların her türlü zayıflığını küçümserim" (empc08; kişiyi yargılar gibi okunur), "Yakın
 * arkadaşlarıma sarılırım" (pexp05; yakın arkadaş varsayılmaz), "Öfkelendiğimde bağırıp çağırırım" (nexp01; öfkeyi
 * gösterme, kızdığını karşısındakine gösterme maddesiyle, nexp07, anlatılır). Duygularına dikkat etmenin örnekleri bir beceri
 * gibi yazılmaz ("hemen fark edersin" yok): duygunun üzerinde durup düşünmeyi anlatır. Duyguyu dışa vurmak
 * (olumlu ve olumsuz duyguları gösterme) ile duyguyu fark etmek (duygularına dikkat etme) birbirine karışmaz. İki kart
 * aynı sahneyi kullanmaz (olumlu duyguları göstermenin arkadaş satırı kişinin kendi sevincini, sevince ortak olmanın
 * arkadaş satırı başkalarının gülmesini anlatır). Üzücü olaylardan etkilenmenin okul örneği bir sınav anı değildir: madde
 * genel bir gergin anı sorar ve ölçek kaygı ölçmez. Mezun okul satırlarını "Okulda ya da derslerde" başlığıyla gördüğü
 * için "sınıf" yerine "derste", "ders arkadaşı" denir; yetişkinin ev satırı evdekilerden değil yakınlardan ve sevdiklerden
 * söz eder (`adult.home`; yalnız yaşayan yetişkin). Her satırın dayandığı maddeler `from`'dadır.
 */
export const duygusalZekaBilesenleriDaily: SurveyDaily = {
  kind: 'survey',
  version: 'duygusal-zeka-bilesenleri-gunluk-1',
  scales: {
    /*
     * Olumlu duyguları gösterme: pexp01 "Sevgimi sarılarak ya da dokunarak gösteririm", pexp02 "Bir şey komikse kahkahayla
     * gülerim", pexp03 "Sevincimi bir çocuk gibi gösteririm", pexp04 "Bir şey okurken ya da izlerken bazen kahkahayla
     * gülerim", pexp05 "Yakın arkadaşlarıma sarılırım", pexp06 "Mutlu olduğumda duygularımı belli ederim"; ters: pexp07
     * "İnsanlara onları önemsediğimi göstermekte zorlanırım", pexp08 "Sevgimi göstermekte zorlanırım", pexp09 "Mutluluğumu
     * kendime saklarım".
     */
    positive_expressivity: {
      poles: { low: 'Sevincini içinde yaşar', high: 'Sevincini açıkça gösterir' },
      bands: {
        low: {
          from: { school: ['pexp06', 'pexp09'], friends: ['pexp07'], home: ['pexp08', 'pexp01'], work: ['pexp06', 'pexp09'] },
          student: {
            school: 'Sınavdan iyi bir not alınca sevincini çoğu zaman kendine saklayabilirsin.',
            friends: 'Arkadaşlarına onları önemsediğini göstermek sana zor gelebilir.',
            home: 'Evdekilere sevgini sarılarak göstermek sana kolay gelmeyebilir.',
          },
          parent: {
            school: 'Sınavdan iyi bir not alınca çocuğunuz sevincini çoğu zaman kendine saklayabilir.',
            friends: 'Arkadaşlarına onları önemsediğini göstermek ona zor gelebilir.',
            home: 'Evdekilere sevgisini sarılarak göstermek ona kolay gelmeyebilir.',
          },
          adult: {
            work: 'Bir işi iyi bitirince sevincini çoğu zaman kendine saklayabilirsin.',
            home: 'Sevdiklerine sevgini sarılarak göstermek sana kolay gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['pexp06', 'pexp09'], friends: ['pexp03', 'pexp09'], home: ['pexp08', 'pexp01'], work: ['pexp06', 'pexp09'] },
          student: {
            school: 'Sınavdan iyi bir not alınca sevincini bazen açıkça gösterebilir, bazen kendine saklayabilirsin.',
            friends: 'Arkadaşlarınla bir şeye sevindiğinde bunu bazen coşkuyla belli edebilir, bazen sessizce yaşayabilirsin.',
            home: 'Evdekilere sevgini bazen sarılarak gösterebilir, bazen içinde yaşayabilirsin.',
          },
          parent: {
            school: 'Sınavdan iyi bir not alınca çocuğunuz sevincini bazen açıkça gösterebilir, bazen kendine saklayabilir.',
            friends: 'Arkadaşlarıyla bir şeye sevindiğinde bunu bazen coşkuyla belli edebilir, bazen sessizce yaşayabilir.',
            home: 'Evdekilere sevgisini bazen sarılarak gösterebilir, bazen içinde yaşayabilir.',
          },
          adult: {
            work: 'Bir işi iyi bitirince sevincini bazen açıkça gösterebilir, bazen kendine saklayabilirsin.',
            home: 'Sevdiklerine sevgini bazen sarılarak gösterebilir, bazen içinde yaşayabilirsin.',
          },
        },
        high: {
          from: { school: ['pexp06'], friends: ['pexp03', 'pexp06'], home: ['pexp01', 'pexp08'], work: ['pexp06'] },
          student: {
            school: 'Sınavdan iyi bir not alınca sevincini çoğu zaman açıkça gösterebilirsin.',
            friends: 'Arkadaşlarınla bir şeye sevindiğinde bunu coşkuyla belli edebilirsin.',
            home: 'Evdekilere sevgini sarılarak ya da dokunarak gösterebilirsin.',
          },
          parent: {
            school: 'Sınavdan iyi bir not alınca çocuğunuz sevincini çoğu zaman açıkça gösterebilir.',
            friends: 'Arkadaşlarıyla bir şeye sevindiğinde bunu coşkuyla belli edebilir.',
            home: 'Evdekilere sevgisini sarılarak ya da dokunarak gösterebilir.',
          },
          adult: {
            work: 'Bir işi iyi bitirince sevincini çoğu zaman açıkça gösterebilirsin.',
            home: 'Sevdiklerine sevgini sarılarak ya da dokunarak gösterebilirsin.',
          },
        },
      },
    },
    /*
     * Olumsuz duyguları gösterme: nexp01 "Öfkelendiğimde bağırıp çağırırım", nexp02 "Kötü bir şey olduğunda elimde olmadan
     * üzgün görünürüm", nexp03 "Korktuğumu belli ederim", nexp04 "Üzgün olduğumda yüz ifademin beni ele verdiğini
     * düşünürüm", nexp05 "Üzüldüğümü belli ederim"; ters: nexp06 "Ne kadar mutsuz olursam olayım, duygularımı kendime
     * saklarım", nexp07 "Birine kızdığımda bunu ona göstermekte zorlanırım", nexp08 "Ne kadar korkarsam korkayım,
     * duygularımı kendime saklarım", nexp09 "Öfkemi nadiren belli ederim", nexp10 "Keşke olumsuz duygularımı daha kolay
     * gösterebilsem".
     */
    negative_expressivity: {
      poles: { low: 'Zor duygularını saklar', high: 'Zor duygularını gösterir' },
      bands: {
        low: {
          from: { school: ['nexp06', 'nexp05'], friends: ['nexp07', 'nexp09'], home: ['nexp08', 'nexp03'], work: ['nexp06', 'nexp05'] },
          student: {
            school: 'Kötü geçen bir sınavdan sonra ne kadar üzülsen de bunu kendine saklayabilirsin.',
            friends: 'Bir arkadaşına kızdığında bunu ona göstermek sana zor gelebilir.',
            home: 'Bir şeyden korktuğunda bunu evdekilere belli etmeyebilirsin.',
          },
          parent: {
            school: 'Kötü geçen bir sınavdan sonra çocuğunuz ne kadar üzülse de bunu kendine saklayabilir.',
            friends: 'Bir arkadaşına kızdığında bunu ona göstermek çocuğunuza zor gelebilir.',
            home: 'Bir şeyden korktuğunda bunu evdekilere belli etmeyebilir.',
          },
          adult: {
            work: 'Kötü geçen bir günün ardından ne kadar üzülsen de bunu kendine saklayabilirsin.',
            home: 'Bir şeyden korktuğunda bunu yakınlarına belli etmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['nexp05', 'nexp06'], friends: ['nexp07'], home: ['nexp03', 'nexp08'], work: ['nexp05', 'nexp06'] },
          student: {
            school: 'Kötü geçen bir sınavdan sonra üzüldüğünü bazen belli edebilir, bazen kendine saklayabilirsin.',
            friends: 'Bir arkadaşına kızdığında bunu bazen ona söyleyebilir, bazen içinde tutabilirsin.',
            home: 'Bir şeyden korktuğunda bunu bazen evdekilere belli edebilir, bazen kendine saklayabilirsin.',
          },
          parent: {
            school: 'Kötü geçen bir sınavdan sonra çocuğunuz üzüldüğünü bazen belli edebilir, bazen kendine saklayabilir.',
            friends: 'Bir arkadaşına kızdığında bunu bazen ona söyleyebilir, bazen içinde tutabilir.',
            home: 'Bir şeyden korktuğunda bunu bazen evdekilere belli edebilir, bazen kendine saklayabilir.',
          },
          adult: {
            work: 'Kötü geçen bir günün ardından üzüldüğünü bazen belli edebilir, bazen kendine saklayabilirsin.',
            home: 'Bir şeyden korktuğunda bunu bazen yakınlarına belli edebilir, bazen kendine saklayabilirsin.',
          },
        },
        high: {
          from: { school: ['nexp02', 'nexp04'], friends: ['nexp07'], home: ['nexp03'], work: ['nexp02', 'nexp04'] },
          student: {
            school: 'Kötü geçen bir sınavdan sonra üzüldüğün yüzünden kolayca anlaşılabilir.',
            friends: 'Bir arkadaşına kızdığında bunu ona açıkça gösterebilirsin.',
            home: 'Bir şeyden korktuğunda bunu evdekilere kolayca belli edebilirsin.',
          },
          parent: {
            school: 'Kötü geçen bir sınavdan sonra çocuğunuzun üzüldüğü yüzünden kolayca anlaşılabilir.',
            friends: 'Bir arkadaşına kızdığında bunu ona açıkça gösterebilir.',
            home: 'Bir şeyden korktuğunda bunu evdekilere kolayca belli edebilir.',
          },
          adult: {
            work: 'Kötü geçen bir günün ardından üzüldüğün yüzünden kolayca anlaşılabilir.',
            home: 'Bir şeyden korktuğunda bunu yakınlarına kolayca belli edebilirsin.',
          },
        },
      },
    },
    /*
     * Duygularına dikkat etme: atte01 "Duygularımın nedenlerini düşünürüm", atte02 "Ne hissettiğime çok dikkat ederim",
     * atte03 "Genellikle nasıl hissettiğimin farkındayım", atte04 "Duygularımı fark ederim", atte05 "Sık sık durup nasıl
     * hissettiğimi analiz ederim"; ters: atte06 "Nasıl hissettiğimi pek düşünmem", atte07 "Duygularımı pek analiz etmem",
     * atte08 "Kendi duygularımı pek tanımam", atte09 "Duygularımı sık sık görmezden gelirim", atte10 "Duygusal tepkilerimi
     * pek fark etmem".
     */
    attending_emotions: {
      poles: { low: 'Duygularını pek düşünmez', high: 'Duygularını düşünür' },
      bands: {
        low: {
          from: { school: ['atte01', 'atte06'], friends: ['atte10', 'atte06'], home: ['atte06', 'atte07'], work: ['atte01', 'atte06'] },
          student: {
            school: 'Bir derste canın sıkılınca bunun nedenini pek düşünmeyebilirsin.',
            friends: 'Arkadaşlarınla bir tartışmanın ardından o an ne hissettiğinin üzerinde pek durmayabilirsin.',
            home: 'Gün sonunda o gün neler hissettiğini pek düşünmeyebilirsin.',
          },
          parent: {
            school: 'Bir derste canı sıkılınca çocuğunuz bunun nedenini pek düşünmeyebilir.',
            friends: 'Arkadaşlarıyla bir tartışmanın ardından o an ne hissettiğinin üzerinde pek durmayabilir.',
            home: 'Gün sonunda o gün neler hissettiğini pek düşünmeyebilir.',
          },
          adult: {
            work: 'Gün içinde canın sıkılınca bunun nedenini pek düşünmeyebilirsin.',
          },
        },
        average: {
          from: { school: ['atte01'], friends: ['atte04', 'atte09'], home: ['atte05', 'atte06'], work: ['atte01'] },
          student: {
            school: 'Bir derste canın sıkılınca bunun nedenini bazen düşünebilir, bazen düşünmeden geçebilirsin.',
            friends: 'Arkadaşlarınla bir tartışmanın ardından o an ne hissettiğini bazen düşünebilir, bazen bir kenara bırakabilirsin.',
            home: 'Gün sonunda o gün neler hissettiğini bazen düşünebilir, bazen üzerinde durmayabilirsin.',
          },
          parent: {
            school: 'Bir derste canı sıkılınca çocuğunuz bunun nedenini bazen düşünebilir, bazen düşünmeden geçebilir.',
            friends: 'Arkadaşlarıyla bir tartışmanın ardından o an ne hissettiğini bazen düşünebilir, bazen bir kenara bırakabilir.',
            home: 'Gün sonunda o gün neler hissettiğini bazen düşünebilir, bazen üzerinde durmayabilir.',
          },
          adult: {
            work: 'Gün içinde canın sıkılınca bunun nedenini bazen düşünebilir, bazen düşünmeden geçebilirsin.',
          },
        },
        high: {
          from: { school: ['atte01', 'atte05'], friends: ['atte10', 'atte02'], home: ['atte05'], work: ['atte01', 'atte05'] },
          student: {
            school: 'Bir derste canın sıkılınca durup bunun nedenini düşünebilirsin.',
            friends: 'Arkadaşlarınla bir tartışmanın ardından o an ne hissettiğine dikkat edebilirsin.',
            home: 'Gün sonunda durup o gün neler hissettiğini düşünebilirsin.',
          },
          parent: {
            school: 'Bir derste canı sıkılınca çocuğunuz durup bunun nedenini düşünebilir.',
            friends: 'Arkadaşlarıyla bir tartışmanın ardından o an ne hissettiğine dikkat edebilir.',
            home: 'Gün sonunda durup o gün neler hissettiğini düşünebilir.',
          },
          adult: {
            work: 'Gün içinde canın sıkılınca durup bunun nedenini düşünebilirsin.',
          },
        },
      },
    },
    /*
     * Duygulara göre karar verme: edec01 "Önemli kararlar verirken duygularımı dinlerim", edec02 "Hayattaki hedeflerimi
     * mantık yerine ilhama göre belirlerim", edec03 "Hayatımı nasıl hissettiğime göre planlarım", edec04 "Duyguların hayata
     * yön verdiğine inanırım", edec05 "Aklımdan çok kalbimi dinlerim"; ters: edec06 "Hayatımı mantığa göre planlarım", edec07
     * "Önemli kararların mantığa dayanması gerektiğine inanırım", edec08 "Kalbimden çok aklımı dinlerim", edec09 "Duygulara
     * göre değil, gerçeklere göre karar veririm". İki uç da eşittir.
     */
    emotion_decisions: {
      poles: { low: 'Aklını dinler', high: 'Kalbini dinler' },
      bands: {
        low: {
          from: { school: ['edec09', 'edec07'], friends: ['edec08'], home: ['edec06', 'edec03'], work: ['edec09', 'edec07'] },
          student: {
            school: 'Hangi alanı ya da bölümü seçeceğine karar verirken çoğu zaman duygularından çok gerçeklere bakabilirsin.',
            friends: 'Arkadaşlarınla bir plan yaparken kalbinden çok aklını dinleyebilirsin.',
            home: 'Hafta sonunu çoğu zaman o an ne hissettiğine değil, mantığa göre planlayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz hangi alanı ya da bölümü seçeceğine karar verirken çoğu zaman duygularından çok gerçeklere bakabilir.',
            friends: 'Arkadaşlarıyla bir plan yaparken kalbinden çok aklını dinleyebilir.',
            home: 'Hafta sonunu çoğu zaman o an ne hissettiğine değil, mantığa göre planlayabilir.',
          },
          adult: {
            work: 'Önemli bir karar verirken çoğu zaman duygularından çok gerçeklere bakabilirsin.',
          },
        },
        average: {
          from: { school: ['edec01', 'edec07'], friends: ['edec05', 'edec08'], home: ['edec03', 'edec06'], work: ['edec01', 'edec07'] },
          student: {
            school: 'Hangi alanı ya da bölümü seçeceğine karar verirken hem gerçeklere hem duygularına kulak verebilirsin.',
            friends: 'Arkadaşlarınla bir plan yaparken bazen aklını, bazen kalbini dinleyebilirsin.',
            home: 'Hafta sonunu bazen o an ne hissettiğine, bazen mantığa göre planlayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz hangi alanı ya da bölümü seçeceğine karar verirken hem gerçeklere hem duygularına kulak verebilir.',
            friends: 'Arkadaşlarıyla bir plan yaparken bazen aklını, bazen kalbini dinleyebilir.',
            home: 'Hafta sonunu bazen o an ne hissettiğine, bazen mantığa göre planlayabilir.',
          },
          adult: {
            work: 'Önemli bir karar verirken hem gerçeklere hem duygularına kulak verebilirsin.',
          },
        },
        high: {
          from: { school: ['edec01', 'edec02'], friends: ['edec05'], home: ['edec03'], work: ['edec01'] },
          student: {
            school: 'Hangi alanı ya da bölümü seçeceğine karar verirken çoğu zaman içinden geleni dinleyebilirsin.',
            friends: 'Arkadaşlarınla bir plan yaparken aklından çok kalbini dinleyebilirsin.',
            home: 'Hafta sonunu çoğu zaman o an ne hissettiğine göre planlayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz hangi alanı ya da bölümü seçeceğine karar verirken çoğu zaman içinden geleni dinleyebilir.',
            friends: 'Arkadaşlarıyla bir plan yaparken aklından çok kalbini dinleyebilir.',
            home: 'Hafta sonunu çoğu zaman o an ne hissettiğine göre planlayabilir.',
          },
          adult: {
            work: 'Önemli bir karar verirken çoğu zaman duygularını dinleyebilirsin.',
          },
        },
      },
    },
    /*
     * Başkalarının sevincine ortak olma: rjoy01 "Küçük çocukları hediyelerini açarken izlemeyi severim", rjoy02 "Çevremdekiler
     * gülüyorsa genellikle ben de gülmeye başlarım", rjoy03 "Başkalarının sevincini ben de hissederim", rjoy04 "Başkaları
     * kutlama yaparken ben de o coşkuya kapılırım", rjoy05 "Başkalarının neşesinden çok etkilenirim", rjoy06 "Çevremdekiler
     * mutluysa uzun süre keyifsiz kalamam"; ters: rjoy07 "Üzgün olduğumda mutlu insanların yanında olmaktan hoşlanmam",
     * rjoy08 "Başkalarının mutluluğundan etkilenmem", rjoy09 "Çevremdeki coşkuya pek kapılmam", rjoy10 "Küçük çocukların
     * doğum günü partilerinden hoşlanmam". Düşük uç şablonun adıyla: "Kendi hâlinde kalan".
     */
    responsive_joy: {
      poles: { low: 'Kendi hâlinde kalır', high: 'Neşeye kolayca katılır' },
      bands: {
        low: {
          from: { school: ['rjoy09', 'rjoy04'], friends: ['rjoy02'], home: ['rjoy08', 'rjoy03'], work: ['rjoy09', 'rjoy04'] },
          student: {
            school: 'Derste bir arkadaşının başarısı kutlanırken o coşkuya pek kapılmayabilirsin.',
            friends: 'Arkadaşların bir şeye gülerken sen kendi hâlinde kalabilirsin.',
            home: 'Evdekilerden biri sevinçli bir haber verince bu sevinç sana pek geçmeyebilir.',
          },
          parent: {
            school: 'Derste bir arkadaşının başarısı kutlanırken çocuğunuz o coşkuya pek kapılmayabilir.',
            friends: 'Arkadaşları bir şeye gülerken o kendi hâlinde kalabilir.',
            home: 'Evdekilerden biri sevinçli bir haber verince bu sevinç ona pek geçmeyebilir.',
          },
          adult: {
            work: 'Bir kutlama yapılırken o coşkuya pek kapılmayabilirsin.',
            home: 'Bir yakının sevinçli bir haber verince bu sevinç sana pek geçmeyebilir.',
          },
        },
        average: {
          from: { school: ['rjoy04', 'rjoy09'], friends: ['rjoy02'], home: ['rjoy03', 'rjoy08'], work: ['rjoy04', 'rjoy09'] },
          student: {
            school: 'Derste bir arkadaşının başarısı kutlanırken bazen o coşkuya kapılabilir, bazen kendi hâlinde kalabilirsin.',
            friends: 'Arkadaşların bir şeye gülerken bazen sen de gülmeye başlayabilir, bazen gülmeden izleyebilirsin.',
            home: 'Evdekilerden biri sevinçli bir haber verince onun sevincini bazen sen de hissedebilir, bazen pek etkilenmeyebilirsin.',
          },
          parent: {
            school: 'Derste bir arkadaşının başarısı kutlanırken çocuğunuz bazen o coşkuya kapılabilir, bazen kendi hâlinde kalabilir.',
            friends: 'Arkadaşları bir şeye gülerken bazen o da gülmeye başlayabilir, bazen gülmeden izleyebilir.',
            home: 'Evdekilerden biri sevinçli bir haber verince onun sevincini bazen o da hissedebilir, bazen pek etkilenmeyebilir.',
          },
          adult: {
            work: 'Bir kutlama yapılırken bazen o coşkuya kapılabilir, bazen kendi hâlinde kalabilirsin.',
            home: 'Bir yakının sevinçli bir haber verince onun sevincini bazen sen de hissedebilir, bazen pek etkilenmeyebilirsin.',
          },
        },
        high: {
          from: { school: ['rjoy04'], friends: ['rjoy02'], home: ['rjoy03', 'rjoy06'], work: ['rjoy04'] },
          student: {
            school: 'Derste bir arkadaşının başarısı kutlanırken sen de o coşkuya kolayca kapılabilirsin.',
            friends: 'Arkadaşların bir şeye gülünce sen de çoğu zaman gülmeye başlayabilirsin.',
            home: 'Evdekilerden biri sevinçli bir haber verince onun sevincini sen de içinde hissedebilirsin.',
          },
          parent: {
            school: 'Derste bir arkadaşının başarısı kutlanırken çocuğunuz da o coşkuya kolayca kapılabilir.',
            friends: 'Arkadaşları bir şeye gülünce o da çoğu zaman gülmeye başlayabilir.',
            home: 'Evdekilerden biri sevinçli bir haber verince onun sevincini o da içinde hissedebilir.',
          },
          adult: {
            work: 'Bir kutlama yapılırken sen de o coşkuya kolayca kapılabilirsin.',
            home: 'Bir yakının sevinçli bir haber verince onun sevincini sen de içinde hissedebilirsin.',
          },
        },
      },
    },
    /*
     * Üzücü olaylardan etkilenme: rdis01 "Başkalarının başına gelen kötü şeylerden derinden etkilenirim", rdis02 "Gözlerim
     * kolayca dolar", rdis03 "Başkalarının derdiyle dertlenirim", rdis04 "Tanımadığım insanların başına gelen kötü şeylere
     * üzülürüm", rdis05 "Yaralı bir hayvan görsem üzülürdüm"; ters: rdis06 "Gergin durumlarda bile sakinimdir", rdis07
     * "Olaylar karşısında kolay kolay huzursuz olmam", rdis08 "Başkalarının acı çekmesinden etkilenmem", rdis09 "Hüzünlü
     * filmleri izlerken nadiren ağlarım", rdis10 "Acil durumlarda sakin kalırım". İki uç da eşittir.
     */
    responsive_distress: {
      poles: { low: 'Kolay kolay sarsılmaz', high: 'Derinden etkilenir' },
      bands: {
        low: {
          from: { school: ['rdis06', 'rdis07'], friends: ['rdis03', 'rdis08'], home: ['rdis09'], work: ['rdis10', 'rdis07'] },
          student: {
            school: 'Derste birden gergin bir an yaşanınca bile çoğu zaman sakin kalabilirsin.',
            friends: 'Bir arkadaşın sana derdini anlatınca bundan kolay kolay sarsılmayabilirsin.',
            home: 'Hüzünlü bir film izlerken çoğu zaman ağlamayabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste birden gergin bir an yaşanınca bile çoğu zaman sakin kalabilir.',
            friends: 'Bir arkadaşı ona derdini anlatınca bundan kolay kolay sarsılmayabilir.',
            home: 'Hüzünlü bir film izlerken çoğu zaman ağlamayabilir.',
          },
          adult: {
            work: 'Beklenmedik bir aksilik ya da acil bir durumda çoğu zaman sakin kalabilirsin.',
          },
        },
        average: {
          from: { school: ['rdis06', 'rdis07'], friends: ['rdis03'], home: ['rdis09', 'rdis02'], work: ['rdis10', 'rdis07'] },
          student: {
            school: 'Derste birden gergin bir an yaşanınca bazen sakin kalabilir, bazen huzursuz olabilirsin.',
            friends: 'Bir arkadaşın sana derdini anlatınca bazen onunla dertlenebilir, bazen sakin kalabilirsin.',
            home: 'Hüzünlü bir film izlerken bazen gözlerin dolabilir, bazen sakin izleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz derste birden gergin bir an yaşanınca bazen sakin kalabilir, bazen huzursuz olabilir.',
            friends: 'Bir arkadaşı ona derdini anlatınca bazen onunla dertlenebilir, bazen sakin kalabilir.',
            home: 'Hüzünlü bir film izlerken bazen gözleri dolabilir, bazen sakin izleyebilir.',
          },
          adult: {
            work: 'Beklenmedik bir aksilikte bazen sakin kalabilir, bazen huzursuz olabilirsin.',
          },
        },
        high: {
          from: { school: ['rdis06', 'rdis07'], friends: ['rdis03', 'rdis01'], home: ['rdis09', 'rdis02'], work: ['rdis06', 'rdis07'] },
          student: {
            school: 'Derste birden gergin bir an yaşanınca sakin kalmak sana zor gelebilir.',
            friends: 'Bir arkadaşın sana derdini anlatınca onunla birlikte derinden dertlenebilirsin.',
            home: 'Hüzünlü bir film izlerken çoğu zaman ağlayabilirsin.',
          },
          parent: {
            school: 'Derste birden gergin bir an yaşanınca sakin kalmak çocuğunuza zor gelebilir.',
            friends: 'Bir arkadaşı ona derdini anlatınca onunla birlikte derinden dertlenebilir.',
            home: 'Hüzünlü bir film izlerken çoğu zaman ağlayabilir.',
          },
          adult: {
            work: 'Gergin bir anda ya da beklenmedik bir olayda sakin kalmak sana zor gelebilir.',
          },
        },
      },
    },
    /*
     * Başkalarını önemseme: empc01 "Başkalarının iyi olup olmadığını önemserim", empc02 "Benden daha zor durumda olanlara
     * karşı şefkat duyarım", empc03 "Evsizlerin durumuna üzülürüm", empc05 "Yoksulların şefkatimizi hak ettiğine inanırım";
     * ters: empc06 "Başkalarının iyi olup olmaması beni pek ilgilendirmez", empc08 "İnsanların her türlü zayıflığını
     * küçümserim", empc09 "Başkalarının sorunlarıyla ilgilenmekten hoşlanmam", empc10 "İşsizlerin durumuna pek üzülmem".
     * empc03, empc05, empc08 ve empc10 kullanılmadı (dosyanın başındaki açıklama).
     */
    empathic_concern: {
      poles: { low: 'Dertlere mesafeli durur', high: 'Zor durumdakileri önemser' },
      bands: {
        low: {
          from: { school: ['empc09'], friends: ['empc06', 'empc01'], home: ['empc02'], work: ['empc09'] },
          student: {
            school: 'Ders arkadaşlarından birinin sorunuyla ilgilenmek sana pek çekici gelmeyebilir.',
            friends: 'Arkadaş ortamında başkalarının iyi olup olmadığı seni pek meşgul etmeyebilir.',
            home: 'Haberlerde zor durumdaki insanlar anlatılınca onlara mesafeli kalabilirsin.',
          },
          parent: {
            school: 'Ders arkadaşlarından birinin sorunuyla ilgilenmek çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Arkadaş ortamında başkalarının iyi olup olmadığı onu pek meşgul etmeyebilir.',
            home: 'Haberlerde zor durumdaki insanlar anlatılınca onlara mesafeli kalabilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın birinin sorunuyla ilgilenmek sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['empc09', 'empc01'], friends: ['empc01', 'empc06'], home: ['empc02'], work: ['empc09', 'empc01'] },
          student: {
            school: 'Ders arkadaşlarından birinin sorununu bazen önemseyebilir, bazen onunla ilgilenmek istemeyebilirsin.',
            friends: 'Arkadaş ortamında başkalarının iyi olup olmadığını bazen merak edebilir, bazen pek düşünmeyebilirsin.',
            home: 'Haberlerde zor durumdaki insanlar anlatılınca bazen onlara şefkat duyabilir, bazen mesafeli kalabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders arkadaşlarından birinin sorununu bazen önemseyebilir, bazen onunla ilgilenmek istemeyebilir.',
            friends: 'Arkadaş ortamında başkalarının iyi olup olmadığını bazen merak edebilir, bazen pek düşünmeyebilir.',
            home: 'Haberlerde zor durumdaki insanlar anlatılınca bazen onlara şefkat duyabilir, bazen mesafeli kalabilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın birinin sorununu bazen önemseyebilir, bazen onunla ilgilenmek istemeyebilirsin.',
          },
        },
        high: {
          from: { school: ['empc01', 'empc09'], friends: ['empc01'], home: ['empc02'], work: ['empc01', 'empc09'] },
          student: {
            school: 'Ders arkadaşlarından birinin bir sorunu olduğunu duyunca bunu önemseyebilirsin.',
            friends: 'Arkadaş ortamında başkalarının iyi olup olmadığını çoğu zaman merak edebilirsin.',
            home: 'Haberlerde zor durumdaki insanlar anlatılınca onlara şefkat duyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders arkadaşlarından birinin bir sorunu olduğunu duyunca bunu önemseyebilir.',
            friends: 'Arkadaş ortamında başkalarının iyi olup olmadığını çoğu zaman merak edebilir.',
            home: 'Haberlerde zor durumdaki insanlar anlatılınca onlara şefkat duyabilir.',
          },
          adult: {
            work: 'Birlikte iş yaptığın birinin bir sorunu olduğunu duyunca bunu önemseyebilirsin.',
          },
        },
      },
    },
  },
};
