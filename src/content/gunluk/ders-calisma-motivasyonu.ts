import type { SurveyDaily } from './types';

/**
 * Ders Çalışma Motivasyonu: günlük hayatta nasıl görünür (5. sınıftan mezuna; yetişkinlere açık değil). Motivasyon
 * profilinde kartı olan üç ölçek (`dailyScales`): iki bileşik ölçek (Kendi isteğiyle çalışma = merak ve keyif + önemini
 * görme; Baskıyla çalışma = iç baskı + dış baskı ve ödül) ve hiçbir bileşiğe girmeyen İsteksizlik. Ton (`scaleTone`):
 * bileşikler özellik, İsteksizlik gelişim tonundadır (kart bunu kendisi söyler).
 *
 * Örnekler ders çalışma nedenlerini maddelerin söylediği gibi anlatır; hiçbir nedeni iyi ya da kötü diye yargılamaz, bir
 * nedeni ötekine yeğlemez ve kişiyi başka öğrencilerle karşılaştırmaz (arkadaşlar yalnızca ortam olarak geçer: "arkadaşlarınla
 * bir sınavı konuşurken", "arkadaşların hazırlanırken" değil). Bileşik ölçeklerin özellik tonunda, kişilik testlerindeki gibi
 * her uca bir kolaylık ve bir zorluk yazılmadı: maddeler yalnızca bir nedenin ne kadar uyduğunu sorar; düşük uca bir güçlü
 * yan ya da yüksek uca bir bedel eklemek ya maddede olmayan bir iddia ya da bir nedeni yargılamak olurdu. İki uç da
 * tarafsız bir betimlemeyle anlatılır ("pek belirlemeyebilir" ↔ "seni çalışmaya itebilir"). Baskıyla çalışmanın yüksek ucu da bir kusur gibi
 * değil, kişiyi çalışmaya iten şey olarak anlatılır ("seni çalışmaya itebilir"). İsteksizlik bugünü anlatır ("şu sıralar");
 * suçlamaz, "tembel" ya da "başarısız" gibi bir ad koymaz. Rapor metinlerindeki araştırma bulguları ve öneriler (kaygı,
 * erteleme, rehber öğretmen) örneklere taşınmadı: hiçbir madde onları sormaz.
 *
 * Kartlar birbiriyle çelişmesin diye: Kendi isteğiyle çalışma "Öğrendiklerimin hayatta işime yarayacağını düşündüğüm için
 * çalışırım" (ID1) maddesini anlatmaz; aynı konu İsteksizlik'teki AM2'de ("…işime yaramayacağını düşünüyorum") anlatılır,
 * iki kart aynı konuyu iki yerden söylemez. "…kendimi yetersiz biri gibi hissedeceğim için" (IJ3) örneğe kaynak olmaz;
 * "Çevremdekilerin beni başarısız biri olarak görmesinden korktuğum için" (IJ4) yalnızca yumuşatılarak, bir etiket sözcüğü
 * kullanmadan anlatılır ("arkadaşlarının senin hakkında ne düşüneceği").
 *
 * Bileşik bir ölçeğin iki parçasından biri yüksek, öteki düşükse kart örnek göstermez (lib/reports/daily-parts.ts,
 * `motivationPartsSplit`): okul ve arkadaş satırları bir parçanın, ev satırı ötekinin maddelerinden yazıldığı için hangi
 * düzeyin örnekleri seçilse biri parçasının kendi kartıyla çelişirdi; profil yorumu bu farkı anlatır. Kapsayıcılık: "ailem" (EX1) yerine
 * "evdekiler"; telefon ya da harçlık (EX2, EX3) varsayılmaz, "bir ödül" denir.
 */
export const dersCalismaMotivasyonuDaily: SurveyDaily = {
  kind: 'survey',
  version: 'ders-calisma-motivasyonu-gunluk-1',
  scales: {
    /*
     * Kendi isteğiyle çalışma (merak ve keyif + önemini görme): IN1 "Bir konuyu öğrenirken iyi vakit geçirdiğim için ders
     * çalışırım", IN2 "Merak ettiğim bir şeyin cevabını bulmak bana keyif verdiği için çalışırım", IN3 "Zor bir konuyu sonunda
     * anladığımda aldığım zevk için çalışırım", IN4 "Derslerdeki konular ilgimi çektiği için çalışırım", IN5 "Çalışırken
     * konunun içine dalmaktan hoşlandığım için çalışırım"; ID1 "Öğrendiklerimin hayatta işime yarayacağını düşündüğüm için
     * çalışırım" (kullanılmadı), ID2 "Kendi seçtiğim bir hedefe (bir okul ya da meslek gibi) ulaşmak istediğim için çalışırım",
     * ID3 "Bilgili biri olmayı önemsediğim için çalışırım", ID4 "Derslerdeki konuları öğrenmenin beni geliştirdiğine inandığım
     * için çalışırım", ID5 "Ders çalışmayı kendim de önemli bulduğum için çalışırım". Bütün maddeler düz yönlüdür.
     */
    autonomous: {
      poles: { low: 'Kendi isteği az belirler', high: 'Kendi isteğiyle çalışır' },
      bands: {
        low: {
          from: { school: ['IN4'], friends: ['IN5'], home: ['ID2'] },
          student: {
            school: 'Derslerdeki konular şu sıralar ilgini pek çekmeyebilir.',
            friends: 'Arkadaşlarınla ders çalışırken konunun içine dalmak sana pek keyifli gelmeyebilir.',
            home: 'Ders çalışırken kendi seçtiğin bir hedef şu sıralar aklında pek olmayabilir.',
          },
          parent: {
            school: 'Derslerdeki konular şu sıralar çocuğunuzun ilgisini pek çekmeyebilir.',
            friends: 'Arkadaşlarıyla ders çalışırken konunun içine dalmak ona pek keyifli gelmeyebilir.',
            home: 'Ders çalışırken kendi seçtiği bir hedef şu sıralar aklında pek olmayabilir.',
          },
        },
        average: {
          from: { school: ['IN4'], friends: ['IN5'], home: ['ID2'] },
          student: {
            school: 'Bazı derslerin konuları ilgini çekebilir, bazıları pek çekmeyebilir.',
            friends: 'Arkadaşlarınla ders çalışırken bazı konuların içine dalabilir, bazılarını yalnızca bitirmek isteyebilirsin.',
            home: 'Bazı derslere kendi seçtiğin bir hedef için çalışabilir, bazılarında bu hedefi pek düşünmeyebilirsin.',
          },
          parent: {
            school: 'Bazı derslerin konuları çocuğunuzun ilgisini çekebilir, bazıları pek çekmeyebilir.',
            friends: 'Arkadaşlarıyla ders çalışırken bazı konuların içine dalabilir, bazılarını yalnızca bitirmek isteyebilir.',
            home: 'Bazı derslere kendi seçtiği bir hedef için çalışabilir, bazılarında bu hedefi pek düşünmeyebilir.',
          },
        },
        high: {
          from: { school: ['IN3'], friends: ['IN2'], home: ['ID2', 'ID5'] },
          student: {
            school: 'Zor bir konuyu sonunda anladığında bundan keyif alabilirsin.',
            friends: 'Arkadaşlarınla ders çalışırken merak ettiğin bir sorunun cevabını bulmak hoşuna gidebilir.',
            home: 'Kendi seçtiğin bir hedefe ulaşmak için ders çalışmayı önemli bulabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz zor bir konuyu sonunda anladığında bundan keyif alabilir.',
            friends: 'Arkadaşlarıyla ders çalışırken merak ettiği bir sorunun cevabını bulmak hoşuna gidebilir.',
            home: 'Kendi seçtiği bir hedefe ulaşmak için ders çalışmayı önemli bulabilir.',
          },
        },
      },
    },
    /*
     * Baskıyla çalışma (iç baskı + dış baskı ve ödül): IJ1 "Çalışmadığım zaman kendimi suçlu hissettiğim için çalışırım", IJ2
     * "Kötü bir not alırsam utanacağım için çalışırım", IJ3 "Notlarım kötü olursa kendimi yetersiz biri gibi hissedeceğim için
     * çalışırım" (kullanılmadı), IJ4 "Çevremdekilerin beni başarısız biri olarak görmesinden korktuğum için çalışırım", IJ5
     * "İçimden bir ses “çalışmalısın” dediği için çalışırım"; EX1 "Çalışmazsam ailemden azar işiteceğim için çalışırım", EX2
     * "İyi not alınca ödül (harçlık, hediye ya da izin gibi) kazandığım için çalışırım", EX3 "Notlarım düşerse bazı şeyler
     * (telefon, oyun ya da dışarı çıkmak gibi) yasaklanacağı için çalışırım", EX4 "Öğretmenlerim çalışıp çalışmadığımı kontrol
     * ettiği için çalışırım", EX5 "Başka seçeneğim olmadığı, zorunda olduğum için çalışırım". Bütün maddeler düz yönlüdür.
     */
    controlled: {
      poles: { low: 'Baskı az belirler', high: 'Baskı ve ödül belirler' },
      bands: {
        low: {
          from: { school: ['EX4'], friends: ['IJ4'], home: ['EX1', 'EX2'] },
          student: {
            school: 'Öğretmenlerinin kontrol edip etmemesi senin ders çalışıp çalışmamanı pek belirlemeyebilir.',
            friends: 'Arkadaşlarının senin hakkında ne düşüneceği, ders çalışma nedenlerin arasında pek olmayabilir.',
            home: 'Evdekilerin kızması ya da bir ödül alma ihtimali seni ders çalışmaya pek itmeyebilir.',
          },
          parent: {
            school: 'Öğretmenlerinin kontrol edip etmemesi çocuğunuzun ders çalışıp çalışmamasını pek belirlemeyebilir.',
            friends: 'Arkadaşlarının onun hakkında ne düşüneceği, ders çalışma nedenleri arasında pek olmayabilir.',
            home: 'Evdekilerin kızması ya da bir ödül alma ihtimali onu ders çalışmaya pek itmeyebilir.',
          },
        },
        average: {
          from: { school: ['IJ2', 'EX4'], friends: ['IJ4'], home: ['IJ5', 'IJ1'] },
          student: {
            school: 'Bazen kötü not alma düşüncesi, bazen öğretmenlerinin kontrolü seni çalışmaya itebilir.',
            friends: 'Arkadaşlarının senin hakkında ne düşüneceği bazen seni ders çalışmaya itebilir.',
            home: 'Bazen içinden gelen “Çalışmam gerek” düşüncesiyle çalışabilir, çalışmadığın günlerde kendini suçlu hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuzu bazen kötü not alma düşüncesi, bazen öğretmenlerinin kontrolü çalışmaya itebilir.',
            friends: 'Arkadaşlarının onun hakkında ne düşüneceği bazen onu ders çalışmaya itebilir.',
            home: 'Bazen içinden gelen “Çalışmam gerek” düşüncesiyle çalışabilir, çalışmadığı günlerde kendini suçlu hissedebilir.',
          },
        },
        high: {
          from: { school: ['IJ2', 'EX4'], friends: ['IJ4'], home: ['EX1', 'EX2'] },
          student: {
            school: 'Kötü bir not alırsan utanacağını düşünmek ya da öğretmenlerinin kontrol etmesi seni çalışmaya itebilir.',
            friends: 'Arkadaşlarının gözünde nasıl görüneceğini düşünmek seni ders çalışmaya itebilir.',
            home: 'Çalışmazsan evdekilerin kızacağını ya da iyi notla bir ödül kazanacağını düşünmek seni çalışmaya itebilir.',
          },
          parent: {
            school: 'Kötü bir not alırsa utanacağını düşünmek ya da öğretmenlerinin kontrol etmesi çocuğunuzu çalışmaya itebilir.',
            friends: 'Arkadaşlarının gözünde nasıl görüneceğini düşünmek onu ders çalışmaya itebilir.',
            home: 'Çalışmazsa evdekilerin kızacağını ya da iyi notla bir ödül kazanacağını düşünmek onu çalışmaya itebilir.',
          },
        },
      },
    },
    /*
     * İsteksizlik (gelişim tonu): AM1 "Ders çalışmak bana anlamsız geliyor", AM2 "Derslerde öğrendiklerimin hayatta işime
     * yaramayacağını düşünüyorum", AM3 "Çalışsam da çalışmasam da sonucun aynı olacağını düşünüyorum", AM4 "Ne kadar uğraşsam
     * da derslerde başarılı olamayacakmışım gibi geliyor", AM5 "Ders çalışmayı gereksiz buluyorum". Bütün maddeler düz
     * yönlüdür: düşük uç bu düşüncelerin pek uymadığını anlatır (uydurma bir güçlü yan değil, maddenin düşük cevabı).
     */
    amotivation: {
      poles: { low: 'Çalışmayı anlamsız bulmaz', high: 'Şu sıralar anlam göremez' },
      bands: {
        low: {
          from: { school: ['AM3'], friends: ['AM5', 'AM1'], home: ['AM2'] },
          student: {
            school: 'Bir sınava çalışmanın sonucu değiştirebileceğini düşünebilirsin.',
            friends: 'Arkadaşlarınla dersleri konuşurken ders çalışmanın bir anlamı olduğunu düşünebilirsin.',
            home: 'Derslerde öğrendiklerinin hayatta bir işe yarayabileceğini düşünebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir sınava çalışmanın sonucu değiştirebileceğini düşünebilir.',
            friends: 'Arkadaşlarıyla dersleri konuşurken ders çalışmanın bir anlamı olduğunu düşünebilir.',
            home: 'Derslerde öğrendiklerinin hayatta bir işe yarayabileceğini düşünebilir.',
          },
        },
        average: {
          from: { school: ['AM4'], friends: ['AM3'], home: ['AM5'] },
          student: {
            school: 'Bazı derslerde ne kadar uğraşsan da ilerleyemeyecekmişsin gibi gelebilir.',
            friends: 'Arkadaşlarınla bir sınavı konuşurken çalışsan da çalışmasan da sonucun değişmeyeceğini bazen düşünebilirsin.',
            home: 'Ders çalışma saati gelince çalışmak bazen sana gereksiz gelebilir.',
          },
          parent: {
            school: 'Çocuğunuza bazı derslerde ne kadar uğraşsa da ilerleyemeyecekmiş gibi gelebilir.',
            friends: 'Arkadaşlarıyla bir sınavı konuşurken çalışsa da çalışmasa da sonucun değişmeyeceğini bazen düşünebilir.',
            home: 'Ders çalışma saati gelince çalışmak bazen ona gereksiz gelebilir.',
          },
        },
        high: {
          from: { school: ['AM4'], friends: ['AM3'], home: ['AM1', 'AM2'] },
          student: {
            school: 'Şu sıralar ne kadar uğraşsan da derslerde istediğin sonucu alamayacakmışsın gibi gelebilir.',
            friends: 'Arkadaşlarınla bir sınavı konuşurken çalışsan da çalışmasan da sonucun aynı olacağını düşünebilirsin.',
            home: 'Ders çalışmak sana şu sıralar anlamsız gelebilir; öğrendiklerinin hayatta işine yarayacağını göremeyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuza şu sıralar ne kadar uğraşsa da derslerde istediği sonucu alamayacakmış gibi gelebilir.',
            friends: 'Arkadaşlarıyla bir sınavı konuşurken çalışsa da çalışmasa da sonucun aynı olacağını düşünebilir.',
            home: 'Ders çalışmak ona şu sıralar anlamsız gelebilir; öğrendiklerinin hayatta işine yarayacağını göremeyebilir.',
          },
        },
      },
    },
  },
};
