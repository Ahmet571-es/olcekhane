import type { SurveyDaily } from './types';

/**
 * Merak: günlük hayatta nasıl görünür (9. sınıftan yetişkine).
 * Rapor metinlerindeki ilke burada da geçerlidir (src/content/reports/merak.ts): bilgi merakının örnekleri değişiklikten,
 * alışkanlıktan ve yemekten; yenilik merakının örnekleri okumadan, bilimden, tarihten ve siyasetten söz etmez. Hiçbir düzey
 * zekâ ya da bilgi gibi okunmaz; düşük uç da yüksek uç da bir kolaylık ve bir zorlukla anlatılır.
 */
export const merakDaily: SurveyDaily = {
  kind: 'survey',
  version: 'merak-gunluk-1',
  scales: {
    /*
     * Bilgi merakı: "Bir konunun derinine inmem" (ters), "Bilime ilgi duyarım", "Anlamak için kafa yormam gereken metinler
     * okumayı severim", "Okuması zor metinlerden kaçınırım" (ters), "Siyasi tartışmaları ilginç bulurum", "Siyasi ve
     * toplumsal sorunlara kafa yormam" (ters), "Zekâ oyunlarından hoşlanırım", "Tarih hakkında pek bir şey bilmem" (ters).
     */
    knowledge: {
      poles: { low: 'Temel bilgiyle yetinir', high: 'Konunun derinine iner' },
      bands: {
        low: {
          student: {
            school: 'Okuması zor, uzun bir metin ödev olarak verildiğinde başlamak sana zor gelebilir.',
            friends: 'Siyaset ya da toplumsal konular açılınca sohbete katılmak yerine dinlemeyi seçebilirsin.',
            home: 'Bir konunun işine yarayan kısmını öğrenip gerisini bırakabilirsin; bu sana zaman kazandırabilir.',
          },
          parent: {
            school: 'Okuması zor, uzun bir metin ödev olarak verildiğinde başlamak çocuğunuza zor gelebilir.',
            friends: 'Siyaset ya da toplumsal konular açılınca sohbete katılmak yerine dinlemeyi seçebilir.',
            home: 'Çocuğunuz bir konunun işine yarayan kısmını öğrenip gerisini bırakabilir; bu ona zaman kazandırabilir.',
          },
          adult: {
            work: 'Okuması zor, uzun bir metni okuman gerektiğinde başlamak sana zor gelebilir.',
          },
        },
        average: {
          student: {
            school: 'Bazı derslerde konunun ayrıntısına inmek isteyebilir, bazılarında temel bilgiyle yetinebilirsin.',
            friends: 'Bir tartışmanın konusu ilgini çekiyorsa katılır, çekmiyorsa dinlemeyi seçebilirsin.',
            home: 'Zorlayıcı bir yazıyı, konusu ilgini çektiğinde sonuna kadar okuyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde konunun ayrıntısına inmek isteyebilir, bazılarında temel bilgiyle yetinebilir.',
            friends: 'Bir tartışmanın konusu ilgisini çekiyorsa katılır, çekmiyorsa dinlemeyi seçebilir.',
            home: 'Zorlayıcı bir yazıyı, konusu ilgisini çektiğinde sonuna kadar okuyabilir.',
          },
          adult: {
            work: 'Bazı konularda işin ayrıntısına inmek isteyebilir, bazılarında temel bilgiyle yetinebilirsin.',
          },
        },
        high: {
          student: {
            school: 'Derste ilgini çeken bir konu çıkınca anlatılanla yetinmeyip ayrıntısını kendin araştırabilirsin.',
            friends: 'Arkadaşlarınla toplumsal bir konuyu tartışmak ya da bir zekâ oyunu oynamak sana keyifli gelebilir.',
            home: 'Merak ettiğin bir soruyu araştırırken zamanın nasıl geçtiğini fark etmeyebilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Derste ilgisini çeken bir konu çıkınca çocuğunuz ayrıntısını kendisi araştırabilir.',
            friends: 'Arkadaşlarıyla toplumsal bir konuyu tartışmak ya da bir zekâ oyunu oynamak ona keyifli gelebilir.',
            home: 'Merak ettiği bir soruyu araştırırken zamanın nasıl geçtiğini fark etmeyebilir; başka işler bekleyebilir.',
          },
          adult: {
            work: 'İşinde ilgini çeken bir konu çıkınca ayrıntısını kendin araştırmak isteyebilirsin.',
          },
        },
      },
    },
    /*
     * Yenilik merakı: "Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim", "Yeni yerler görmeyi severim", "Yeni
     * şeylere başlamayı severim", "Pek çok şeye ilgi duyarım"; ters: "Değişiklikten hoşlanmam", "Çoğu şeyi alıştığım
     * biçimde yaparım", "Tanımadığım yemekleri denemekten çekinirim", "Bildiğim şeylere bağlı kalmayı tercih ederim", "Bir
     * şeylerin değişecek olması canımı sıkar", "Alışılmış yöntemlere bağlıyım".
     */
    novelty: {
      poles: { low: 'Bildiği yolu seçer', high: 'Yeniyi dener' },
      bands: {
        low: {
          student: {
            school: 'Derslere hep aynı düzenle hazırlanmak sana güven verebilir.',
            friends: 'Arkadaşların yeni bir yer önerince bildiğiniz bir yere gitmeyi tercih edebilirsin.',
            home: 'Planlar birden değişince canın sıkılabilir; yeni düzene alışmak biraz zaman alabilir.',
          },
          parent: {
            school: 'Derslere hep aynı düzenle hazırlanmak çocuğunuza güven verebilir.',
            friends: 'Arkadaşları yeni bir yer önerince bildikleri bir yere gitmeyi tercih edebilir.',
            home: 'Planlar birden değişince canı sıkılabilir; yeni düzene alışması biraz zaman alabilir.',
          },
          adult: {
            work: 'İşleri alıştığın yöntemle yapmak sana güven verebilir.',
          },
        },
        average: {
          student: {
            school: 'Yeni bir kulübe ya da etkinliğe katılmadan önce biraz bakıp sonra karar verebilirsin.',
            friends: 'Arkadaşlarınla bazen yeni bir yer dener, bazen bildiğiniz yere gidebilirsiniz.',
            home: 'Tanımadığın bir yemeği bazen dener, bazen bildiğin yemeği seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir kulübe ya da etkinliğe katılmadan önce biraz bakıp sonra karar verebilir.',
            friends: 'Arkadaşlarıyla bazen yeni bir yer dener, bazen bildikleri yere gidebilirler.',
            home: 'Tanımadığı bir yemeği bazen dener, bazen bildiği yemeği seçebilir.',
          },
          adult: {
            work: 'Yeni bir yönteme geçmeden önce biraz bakıp sonra karar verebilirsin.',
          },
        },
        high: {
          student: {
            school: 'Yeni bir kulübe katılmak ya da yeni bir etkinliğe başlamak sana heyecan verici gelebilir.',
            friends: 'Hep aynı yere gitmek yerine arkadaşlarına yeni bir yer keşfetmeyi önerebilirsin.',
            home: 'Günler hep aynı düzende geçince çabuk sıkılabilirsin.',
          },
          parent: {
            school: 'Yeni bir kulübe katılmak ya da yeni bir etkinliğe başlamak çocuğunuza heyecan verici gelebilir.',
            friends: 'Hep aynı yere gitmek yerine arkadaşlarına yeni bir yer keşfetmeyi önerebilir.',
            home: 'Günler hep aynı düzende geçince çabuk sıkılabilir.',
          },
          adult: {
            work: 'Yeni bir işe ya da yeni bir yönteme başlamak sana heyecan verici gelebilir.',
          },
        },
      },
    },
  },
};
