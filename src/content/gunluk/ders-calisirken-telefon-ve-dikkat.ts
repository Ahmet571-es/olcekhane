import type { SurveyDaily } from './types';

/**
 * Ders Çalışırken Telefon ve Dikkat: günlük hayatta nasıl görünür (5. sınıftan yetişkine). Ton: gelişim (bütün ölçekler;
 * lib/reports/daily-parts.ts, `GROWTH_SLUGS`). Bölünmenin üç yanında (bildirimler, geçiş, dönme isteği) zor uç yüksek uçtur,
 * kendini durdurma yollarında düşük uçtur. Rahat uca uydurma bir zorluk, zor uca uydurma bir güçlü yan yazılmaz; telefon
 * kullanımı bir kusur, az kullanım bir başarı gibi anlatılmaz; "bağımlılık" ya da klinik bir sözcük yoktur.
 *
 * Telefon ve mesaj (denetim listesinin 15. maddesi): telefonu olmayan biri de her düzeye düşebilir; bu yüzden telefonu ya da
 * mesajlaşmayı anan her satır koşulludur ("Yanında telefon varsa", "Telefonun varsa", "Mesajlaşıyorsan"). Bildirim ve ekran
 * telefon varsaymaz ("bir cihazdan bildirim sesi", "bir ekran").
 *
 * Ortamlar: okul satırları soru çözmeyi, bir konuyu tekrar etmeyi, sınava hazırlanmayı ve bir proje için araştırmayı anlatır
 * (sınıfa özgü bir yer yok: sınava hazırlanan bir mezun için de anlamlıdır; okulda telefon kullanımı varsayılmaz); arkadaş
 * satırları arkadaşlarla mesajlaşmayı ya da birlikte çalışmayı; ev satırları akşam çalışmayı. Yetişkinin iş satırı odaklanması
 * gereken bir işi ya da bilgisayarda yapılan bir işi anlatır. Arkadaş ve ev satırları evde başka birini varsaymaz ve okula özgü
 * değildir: yetişkine de aynen gösterilir.
 *
 * Kartlar birbiriyle çelişmesin diye: bildirimler gelen bildirime ne olduğunu (N1–N6), geçiş iş ile ekranlar arasında gidip
 * gelmeyi (S1–S6), dönme isteği bildirim gelmeden telefona uzanmayı (R1–R6), kendini durdurma yolları çalışmadan önce ve
 * çalışırken yapılanları (K1–K6) anlatır.
 */
export const telefonVeDikkatDaily: SurveyDaily = {
  kind: 'survey',
  version: 'telefon-ve-dikkat-gunluk-1',
  scales: {
    /*
     * Bildirimlerin çekimi: N1 "Çalışırken bir bildirim sesi duyunca elimdeki işi bırakıp telefona bakarım", N2 "Çalışırken
     * gelen bir bildirime bakmasam da aklım bir süre ona gider", N3 "Çalışırken gelen mesajlara hemen cevap vermem gerektiğini
     * hissederim", N4 "Çalışırken telefonumun ekranı yanınca gözüm ona kayar", N5 "Bir bildirime bakmak için telefonu elime
     * alınca başka şeylere de bakmaya başlarım"; ters: N6 "Çalışırken bir bildirim gelse de aklım işimde kalır".
     */
    notify: {
      poles: { low: 'Bildirimler pek bölmez', high: 'Bildirimler sık böler' },
      bands: {
        low: {
          from: { school: ['N6'], friends: ['N3'], home: ['N1'], work: ['N6'] },
          student: {
            school: 'Yanında telefon varsa, soru çözerken gelen bildirimler çoğu zaman aklını sorudan koparmayabilir.',
            friends: 'Arkadaşlarınla mesajlaşıyorsan, çalışırken onlara cevap vermeyi işin bitene kadar bekletebilirsin.',
            home: 'Akşam bir iş üzerindeyken bir cihazdan bildirim sesi gelse de çoğu zaman işini sürdürebilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon varsa, soru çözerken gelen bildirimler çoğu zaman aklını sorudan koparmayabilir.',
            friends: 'Arkadaşlarıyla mesajlaşıyorsa, çalışırken onlara cevap vermeyi işi bitene kadar bekletebilir.',
            home: 'Akşam bir iş üzerindeyken bir cihazdan bildirim sesi gelse de çoğu zaman işini sürdürebilir.',
          },
          adult: {
            work: 'Odaklanman gereken bir işteyken gelen bildirimler çoğu zaman aklını işten koparmayabilir.',
          },
        },
        average: {
          from: { school: ['N4'], friends: ['N3'], home: ['N2'], work: ['N1'] },
          student: {
            school: 'Yanında telefon varsa, bir konuyu tekrar ederken ekran yanınca gözünün bazen ona kaydığını fark edebilirsin.',
            friends: 'Mesajlaşıyorsan, arkadaşlarından biri yazınca bazen hemen cevap vermek isteyebilirsin, bazen de bekletebilirsin.',
            home: 'Akşam çalışırken bakmadığın bir bildirim bazen bir süre aklını kurcalayabilir.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon varsa, bir konuyu tekrar ederken ekran yanınca bazen gözü ona kayabilir.',
            friends: 'Mesajlaşıyorsa, arkadaşlarından biri yazdığında çocuğunuz bazen hemen cevap vermek isteyebilir, bazen de bekletebilir.',
            home: 'Akşam çalışırken bakmadığı bir bildirim bazen bir süre onun aklını kurcalayabilir.',
          },
          adult: {
            work: 'Bir iş üzerindeyken bildirim sesi duyunca bazen hemen bakmak isteyebilir, bazen işini sürdürebilirsin.',
          },
        },
        high: {
          from: { school: ['N1'], friends: ['N3'], home: ['N5'], work: ['N4'] },
          student: {
            school: 'Yanında telefon varsa, soru çözerken bildirim sesi gelince çoğu zaman soruyu bırakıp bakabilirsin.',
            friends: 'Mesajlaşıyorsan, arkadaşların yazınca cevabı bekletmek sana zor gelebilir.',
            home: 'Yanında telefon varsa, akşam bir mesaja göz atmak isteyince kendini uzun süre başka şeylerde bulabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon varsa, soru çözerken bildirim sesi gelince çoğu zaman soruyu bırakıp bakabilir.',
            friends: 'Mesajlaşıyorsa, arkadaşları yazınca cevabı bekletmek ona zor gelebilir.',
            home: 'Yanında telefon varsa, akşam bir mesaja göz atmak isteyince kendini uzun süre başka şeylerde bulabilir.',
          },
          adult: {
            work: 'Yanında telefon varsa, odaklanman gereken bir işteyken ekran yanınca gözün sık sık oraya kayabilir.',
          },
        },
      },
    },
    /*
     * Ekranlar arası geçiş: S1 "Çalışırken işimle telefon ya da başka bir ekran arasında gidip gelirim", S2 "Çalışırken bir
     * yandan mesajlaşırım", S3 "Bilgisayarda ya da tablette çalışırken işimle ilgisi olmayan sayfalara geçerim", S4 "Çalışırken
     * bir yandan işimle ilgisi olmayan bir video ya da dizi izlerim", S5 "Telefona bakıp işime döndüğümde nerede kaldığımı bulmam
     * zaman alır"; ters: S6 "Çalışırken ekranlara ancak mola verince bakarım".
     */
    switching: {
      poles: { low: 'Dikkati işte kalır', high: 'Ekranlara sık geçer' },
      bands: {
        low: {
          from: { school: ['S6'], friends: ['S2'], home: ['S4'], work: ['S3'] },
          student: {
            school: 'Bir proje için araştırma yaparken çoğu zaman araya başka bir ekran sokmadan molaya kadar çalışabilirsin.',
            friends: 'Mesajlaşıyorsan, bir metni okurken yazışmayı çoğu zaman okuma bitene kadar erteleyebilirsin.',
            home: 'Akşam çalışırken arkada bir video açmadan işine odaklanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir proje için araştırma yaparken çoğu zaman araya başka bir ekran sokmadan molaya kadar çalışabilir.',
            friends: 'Mesajlaşıyorsa, bir metni okurken yazışmayı çoğu zaman okuma bitene kadar erteleyebilir.',
            home: 'Akşam çalışırken arkada bir video açmadan işine odaklanabilir.',
          },
          adult: {
            work: 'Bilgisayarda bir iş yaparken çoğu zaman yalnızca o işin sayfalarını açık tutabilirsin.',
          },
        },
        average: {
          from: { school: ['S1'], friends: ['S2'], home: ['S4'], work: ['S3'] },
          student: {
            school: 'Soru çözerken bazen ara ara bir ekrana göz atabilir, bazen uzun süre sorularda kalabilirsin.',
            friends: 'Mesajlaşıyorsan, arkadaşlarınla birlikte çalışırken bazen bir yandan yazışabilir, bazen yalnızca işe dönebilirsin.',
            home: 'Akşam çalışırken bazen arkada bir dizi açık kalabilir, bazen sessizce çalışabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz soru çözerken bazen ara ara bir ekrana göz atabilir, bazen uzun süre sorularda kalabilir.',
            friends: 'Mesajlaşıyorsa, arkadaşlarıyla birlikte çalışırken bazen bir yandan yazışabilir, bazen yalnızca işe dönebilir.',
            home: 'Akşam çalışırken bazen arkada bir dizi açık kalabilir, bazen sessizce çalışabilir.',
          },
          adult: {
            work: 'Bilgisayarda çalışırken bazen işle ilgisiz bir sayfaya geçebilir, sonra işine dönebilirsin.',
          },
        },
        high: {
          from: { school: ['S1'], friends: ['S2'], home: ['S5'], work: ['S3'] },
          student: {
            school: 'Bir konuyu tekrar ederken sık sık bir ekrana geçip sonra yeniden konuya dönebilirsin.',
            friends: 'Mesajlaşıyorsan, bir metni okurken çoğu zaman bir yandan arkadaşlarınla yazışabilirsin.',
            home: 'Akşam bir ekrana göz atıp okuduğun sayfaya dönünce hangi satırda kaldığını aramak biraz vakit alabilir.',
          },
          parent: {
            school: 'Çocuğunuz bir konuyu tekrar ederken sık sık bir ekrana geçip sonra yeniden konuya dönebilir.',
            friends: 'Mesajlaşıyorsa, bir metni okurken çoğu zaman bir yandan arkadaşlarıyla yazışabilir.',
            home: 'Akşam bir ekrana göz atıp okuduğu sayfaya dönünce hangi satırda kaldığını aramak biraz vakit alabilir.',
          },
          adult: {
            work: 'Bilgisayarda bir iş yaparken sık sık işle ilgisiz sayfalara geçebilirsin.',
          },
        },
      },
    },
    /*
     * Telefona dönme isteği: R1 "Çalışırken bir bildirim gelmese de “Bir bakayım” diye telefonu elime alırım", R2 "Çalışırken
     * bir de bakarım ki telefonu elime almışım", R3 "Çalışırken telefonumda yeni bir şey olup olmadığını merak ederim", R4
     * "Çalışırken işimle ilgisi olmayan bir şey aklıma gelince hemen telefondan bakarım", R5 "Çalışırken zorlandığım bir yere
     * gelince telefona uzanırım"; ters: R6 "Çalışırken telefon aklıma gelmez".
     */
    pull: {
      poles: { low: 'Telefon pek akla gelmez', high: 'Telefona sık uzanır' },
      bands: {
        low: {
          from: { school: ['R6'], friends: ['R3'], home: ['R1'], work: ['R6'] },
          student: {
            school: 'Yanında telefon olsa bile, soru çözerken onu aklına getirmeden sorulara dalabilirsin.',
            friends: 'Telefonun varsa, çalışırken arkadaşlarından yeni bir şey gelip gelmediğini pek merak etmeyebilirsin.',
            home: 'Yanında telefon varsa, akşam çalışırken onu çoğu zaman yalnızca bir mola verdiğinde eline alabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon olsa bile, soru çözerken onu aklına getirmeden sorulara dalabilir.',
            friends: 'Telefonu varsa, çalışırken arkadaşlarından yeni bir şey gelip gelmediğini pek merak etmeyebilir.',
            home: 'Yanında telefon varsa, akşam çalışırken onu çoğu zaman yalnızca bir mola verdiğinde eline alabilir.',
          },
          adult: {
            work: 'Yanında telefon varsa, odaklanman gereken bir işte onu uzun süre aklına getirmeden çalışabilirsin.',
          },
        },
        average: {
          from: { school: ['R5'], friends: ['R3'], home: ['R4'], work: ['R2'] },
          student: {
            school: 'Yanında telefon varsa, zor bir soruya gelince bazen ona uzanmak isteyebilirsin.',
            friends: 'Telefonun varsa, çalışırken arkadaşlarının yeni bir şey yazıp yazmadığını bazen merak edebilirsin.',
            home: 'Yanında telefon varsa, akşam çalışırken aklına bir şey takılınca bazen hemen ona bakmak isteyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon varsa, zor bir soruya gelince bazen ona uzanmak isteyebilir.',
            friends: 'Telefonu varsa, çalışırken arkadaşlarının yeni bir şey yazıp yazmadığını bazen merak edebilir.',
            home: 'Yanında telefon varsa, akşam çalışırken aklına bir şey takılınca bazen hemen ona bakmak isteyebilir.',
          },
          adult: {
            work: 'Yanında telefon varsa, bir iş üzerindeyken bazen ne zaman aldığını fark etmeden onu elinde bulabilirsin.',
          },
        },
        high: {
          from: { school: ['R5'], friends: ['R3'], home: ['R1'], work: ['R4'] },
          student: {
            school: 'Yanında telefon varsa, bir soruda takıldığında sık sık ona uzanmak isteyebilirsin.',
            friends: 'Telefonun varsa, çalışırken arkadaşlarının ne yazdığını sık sık merak edebilirsin.',
            home: 'Yanında telefon varsa, akşam çalışırken ortada bir bildirim yokken de sık sık ona uzanabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon varsa, bir soruda takılınca sık sık ona uzanmak isteyebilir.',
            friends: 'Telefonu varsa, çalışırken arkadaşlarının ne yazdığını sık sık merak edebilir.',
            home: 'Yanında telefon varsa, akşam çalışırken ortada bir bildirim yokken de sık sık ona uzanabilir.',
          },
          adult: {
            work: 'Yanında telefon varsa, bir işin ortasında aklına gelen bir şeyi sık sık telefondan aramak isteyebilirsin.',
          },
        },
      },
    },
    /*
     * Kendini durdurma yolları: K1 "Çalışırken telefonumu sessizde tutarım", K2 "Çalışırken telefonumu göremeyeceğim bir yere
     * (çantaya, başka bir odaya) koyarım", K3 "Telefona ne zaman bakacağımı önceden belirlerim, örneğin bir bölümü bitirince",
     * K4 "Çalışmaya başlamadan önce dikkatimi dağıtabilecek ekranları kapatırım", K5 "Çalışırken beni oyalayan uygulamalar için
     * bir süre sınırı ya da ayar kullanırım"; ters: K6 "Çalışırken telefonum yanımda, elimin altında durur".
     */
    control: {
      poles: { low: 'Bu yolları az kullanır', high: 'Bu yolları sık kullanır' },
      bands: {
        low: {
          from: { school: ['K1'], friends: ['K3'], home: ['K6'], work: ['K4'] },
          student: {
            school: 'Yanında telefon varsa, soru çözmeye otururken çoğu zaman onu sessize almadan başlayabilirsin.',
            friends: 'Telefonun varsa, arkadaşlarınla birlikte çalışırken ona ne zaman bakacağını çoğu zaman önceden belirlemeyebilirsin.',
            home: 'Telefonun varsa, akşam çalışırken onu çoğu zaman elinin altında tutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun yanında telefon varsa, soru çözmeye otururken çoğu zaman onu sessize almadan başlayabilir.',
            friends: 'Telefonu varsa, arkadaşlarıyla birlikte çalışırken ona ne zaman bakacağını çoğu zaman önceden belirlemeyebilir.',
            home: 'Telefonu varsa, akşam çalışırken onu çoğu zaman elinin altında tutabilir.',
          },
          adult: {
            work: 'Odaklanman gereken bir işe başlarken dikkat dağıtan ekranları çoğu zaman açık bırakabilirsin.',
          },
        },
        average: {
          from: { school: ['K3'], friends: ['K1'], home: ['K2'], work: ['K5'] },
          student: {
            school: 'Telefonun varsa, sınava hazırlandığın bazı günlerde ona bakmak için kendine bir ara saati koyabilirsin.',
            friends: 'Telefonun varsa, arkadaşlarınla birlikte çalışırken onu bazen sessize alabilir, bazen açık bırakabilirsin.',
            home: 'Telefonun varsa, akşam çalışırken onu bazen çantana koyabilir, bazen yanında tutabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun telefonu varsa, sınava hazırlandığı bazı günlerde ona bakmak için kendine bir ara saati koyabilir.',
            friends: 'Telefonu varsa, arkadaşlarıyla birlikte çalışırken onu bazen sessize alabilir, bazen açık bırakabilir.',
            home: 'Telefonu varsa, akşam çalışırken onu bazen çantasına koyabilir, bazen yanında tutabilir.',
          },
          adult: {
            work: 'Telefonun varsa, vakit alan uygulamalara bazen süre sınırı koyabilir, bazen bunu atlayabilirsin.',
          },
        },
        high: {
          from: { school: ['K1'], friends: ['K3'], home: ['K2'], work: ['K4'] },
          student: {
            school: 'Telefonun varsa, soru çözmeye oturmadan önce onu çoğu zaman sessize alabilirsin.',
            friends: 'Telefonun varsa, arkadaşlarınla çalışırken ona ancak bir bölüm bitince bakmayı seçebilirsin.',
            home: 'Telefonun varsa, akşam çalışırken onu çoğu zaman göremeyeceğin bir yere bırakabilirsin.',
          },
          parent: {
            school: 'Çocuğunuzun telefonu varsa, soru çözmeye oturmadan önce onu çoğu zaman sessize alabilir.',
            friends: 'Telefonu varsa, arkadaşlarıyla çalışırken ona ancak bir bölüm bitince bakmayı seçebilir.',
            home: 'Telefonu varsa, akşam çalışırken onu çoğu zaman göremeyeceği bir yere bırakabilir.',
          },
          adult: {
            work: 'Odaklanman gereken bir işe oturunca çoğu zaman önce açık duran sekmeleri ve ekranları kapatabilirsin.',
          },
        },
      },
    },
  },
};
