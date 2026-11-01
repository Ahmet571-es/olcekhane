import type { SurveyDaily } from './types';

/**
 * Merak: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: özellik (iki uç da eşit; lib/reports/daily-parts.ts).
 * Rapor metinlerindeki ilke burada da geçerlidir (src/content/reports/merak.ts): bilgi merakının örnekleri değişiklikten,
 * alışkanlıktan ve yemekten; yenilik merakının örnekleri okumadan, bilimden, tarihten ve siyasetten söz etmez. Hiçbir düzey
 * zekâ ya da bilgi gibi okunmaz; düşük uç da yüksek uç da bir kolaylık ve bir zorlukla anlatılır. Her satırın dayandığı
 * maddeler `from`'dadır.
 * Maddeye doğrudan dayanmayan, sitedeki metinden gelen tek uzantı: yüksek bilgi merakında "zamanın nasıl geçtiğini fark
 * etmeyebilirsin" (bil10'un derinine inme isteğinin bedeli olarak).
 */
export const merakDaily: SurveyDaily = {
  kind: 'survey',
  version: 'merak-gunluk-1',
  scales: {
    /*
     * Bilgi merakı: bil01 "Bilime ilgi duyarım", bil02 "Alışılmadık yerleri keşfetmeyi çok isterdim", bil03 "Zekâ
     * oyunlarından hoşlanırım", bil04 "Anlamak için kafa yormam gereken metinler okumayı severim", bil05 "Siyasi tartışmaları
     * ilginç bulurum", bil06 "Kelime dağarcığım zengindir"; ters: bil07 "Tarih hakkında pek bir şey bilmem", bil08 "Okuması
     * zor metinlerden kaçınırım", bil09 "Siyasi ve toplumsal sorunlara kafa yormam", bil10 "Bir konunun derinine inmem".
     * Uçlar bütün ölçeği anlatır: "İşine yarayanı öğrenir" ↔ "Bilginin peşine düşer".
     */
    knowledge: {
      poles: { low: 'İşine yarayanı öğrenir', high: 'Bilginin peşine düşer' },
      bands: {
        low: {
          from: { school: ['bil08', 'bil04'], friends: ['bil05', 'bil09'], home: ['bil10'], work: ['bil08', 'bil04'] },
          student: {
            school: 'Okuması zor, uzun bir metin ödev olarak verildiğinde onu okumak sana pek çekici gelmeyebilir.',
            friends: 'Siyaset ya da toplumsal konular açılınca sohbete katılmak yerine dinlemeyi seçebilirsin.',
            home: 'Bir konunun işine yarayan kısmını öğrenip gerisini bırakabilirsin; bu sana zaman kazandırabilir.',
          },
          parent: {
            school: 'Okuması zor, uzun bir metin ödev olarak verildiğinde onu okumak çocuğunuza pek çekici gelmeyebilir.',
            friends: 'Siyaset ya da toplumsal konular açılınca sohbete katılmak yerine dinlemeyi seçebilir.',
            home: 'Çocuğunuz bir konunun işine yarayan kısmını öğrenip gerisini bırakabilir; bu ona zaman kazandırabilir.',
          },
          adult: {
            work: 'Okuması zor, uzun bir metni okuman gerektiğinde bu sana pek çekici gelmeyebilir.',
          },
        },
        average: {
          from: { school: ['bil10'], friends: ['bil05', 'bil09'], home: ['bil04', 'bil08'], work: ['bil10'] },
          student: {
            school: 'Bazı derslerde konunun ayrıntısına inmek isteyebilir, bazılarında ana noktaları öğrenmeyi yeterli bulabilirsin.',
            friends: 'Bir tartışmanın konusu ilgini çekiyorsa katılır, çekmiyorsa dinlemeyi seçebilirsin.',
            home: 'Konusu ilgini çektiğinde zorlayıcı bir yazıyı da sonuna kadar okuyabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde konunun ayrıntısına inmek isteyebilir, bazılarında ana noktaları öğrenmeyi yeterli bulabilir.',
            friends: 'Bir tartışmanın konusu ilgisini çekiyorsa katılır, çekmiyorsa dinlemeyi seçebilir.',
            home: 'Konusu ilgisini çektiğinde zorlayıcı bir yazıyı da sonuna kadar okuyabilir.',
          },
          adult: {
            work: 'Bazı konularda işin ayrıntısına inmek isteyebilir, bazılarında ana noktaları bilmeyi yeterli bulabilirsin.',
          },
        },
        high: {
          from: { school: ['bil10', 'bil01'], friends: ['bil05', 'bil03'], home: ['bil10', 'bil04'], work: ['bil10'] },
          student: {
            school: 'Derste ilgini çeken bir konu çıkınca ayrıntısını kendin araştırmak isteyebilirsin.',
            friends: 'Arkadaşlarınla toplumsal bir konuyu tartışmak ya da bir zekâ oyunu oynamak sana keyifli gelebilir.',
            home: 'Merak ettiğin bir soruyu araştırırken zamanın nasıl geçtiğini fark etmeyebilirsin; başka işler bekleyebilir.',
          },
          parent: {
            school: 'Derste ilgisini çeken bir konu çıkınca çocuğunuz ayrıntısını kendisi araştırmak isteyebilir.',
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
     * Yenilik merakı: yen01 "Hep aynı şeyleri yapmak yerine çeşitliliği tercih ederim", yen02 "Yeni yerler görmeyi severim",
     * yen03 "Pek çok şeye ilgi duyarım", yen04 "Yeni şeylere başlamayı severim"; ters: yen05 "Bildiğim şeylere bağlı kalmayı
     * tercih ederim", yen06 "Değişiklikten hoşlanmam", yen07 "Bir şeylerin değişecek olması canımı sıkar", yen08 "Çoğu şeyi
     * alıştığım biçimde yaparım", yen09 "Tanımadığım yemekleri denemekten çekinirim", yen10 "Alışılmış yöntemlere bağlıyım".
     */
    novelty: {
      poles: { low: 'Bildiği yolu seçer', high: 'Yeniyi dener' },
      bands: {
        low: {
          from: { school: ['yen08', 'yen10'], friends: ['yen02', 'yen05'], home: ['yen07', 'yen06'], work: ['yen08', 'yen10'] },
          student: {
            school: 'Derslere hep aynı düzenle hazırlanmak sana güven verebilir.',
            friends: 'Arkadaşların yeni bir yer önerince zaten bildiğin bir yere gitmeyi tercih edebilirsin.',
            home: 'Planlar birden değişince canın sıkılabilir; yeni düzene alışmak biraz zaman alabilir.',
          },
          parent: {
            school: 'Derslere hep aynı düzenle hazırlanmak çocuğunuza güven verebilir.',
            friends: 'Arkadaşları yeni bir yer önerince zaten bildiği bir yere gitmeyi tercih edebilir.',
            home: 'Planlar birden değişince canı sıkılabilir; yeni düzene alışması biraz zaman alabilir.',
          },
          adult: {
            work: 'İşleri alıştığın yöntemle yapmak sana güven verebilir.',
          },
        },
        average: {
          from: { school: ['yen04', 'yen05'], friends: ['yen02', 'yen05'], home: ['yen09'], work: ['yen10', 'yen04'] },
          student: {
            school: 'Yeni bir kulübe ya da etkinliğe katılmadan önce biraz bakıp sonra karar verebilirsin.',
            friends: 'Arkadaşlarınla bazen yeni bir yer denemeyi, bazen bildiğin bir yere gitmeyi seçebilirsin.',
            home: 'Tanımadığın bir yemeği bazen dener, bazen bildiğin yemeği seçebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz yeni bir kulübe ya da etkinliğe katılmadan önce biraz bakıp sonra karar verebilir.',
            friends: 'Arkadaşlarıyla bazen yeni bir yer denemeyi, bazen bildiği bir yere gitmeyi seçebilir.',
            home: 'Tanımadığı bir yemeği bazen dener, bazen bildiği yemeği seçebilir.',
          },
          adult: {
            work: 'Yeni bir yönteme geçmeden önce biraz bakıp sonra karar verebilirsin.',
          },
        },
        high: {
          from: { school: ['yen04', 'yen03'], friends: ['yen02', 'yen01'], home: ['yen01'], work: ['yen04', 'yen10'] },
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
