import type { SurveyDaily } from './types';

/**
 * Öz-denetim: günlük hayatta nasıl görünür (9. sınıftan yetişkine). Ton: gelişim (lib/reports/daily-parts.ts, `scaleTone`):
 * örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca uydurma bir zorluk yazılmaz. Şablonun
 * (src/content/reports/oz-denetim.ts) maddeye dayanmayan yorumları bu yüzden örneklere taşınmadı: düşünerek davranmanın düşük
 * ucunda "anlık davranmak bazı anlara canlılık katabilir", öz-disiplinin düşük ucunda "başlangıcı küçük ve belirli hâle
 * getirmek" önerisi. Destek kutusu yoktur; hiçbir örnek kişiyi yargılamaz ("tembel", "iradesiz", "dürtüsel" yok).
 *
 * Şablonun çelişmezlik ilkesi örneklerde de geçerlidir: düşünerek davranmanın örnekleri işe başlamaktan ve isteklere
 * direnmekten, öz-disiplinin örnekleri acele kararlardan ve isteklerden, kendini tutabilmenin örnekleri işe başlamaktan ve
 * kararlardan söz etmez. Yemeyle ilgili maddeler testte sorulmadığı için (gençlerde hassas olabilir) kendini tutabilmenin
 * örnekleri de yemekten söz etmez; para, telefon, dizi ve oyun kullanılır (test 9. sınıftan başlar). Düşünerek davranmanın
 * örnekleri "hemen" demez ("düşünmeden" der): öz-disiplinin yüksek ucunda "hemen başlamak" vardır. Yetişkinin ev satırı
 * evde hatırlatacak birinin olduğunu varsaymaz (`adult.home`; yalnız yaşayan yetişkin). Her satırın dayandığı maddeler
 * `from`'dadır.
 */
export const ozDenetimDaily: SurveyDaily = {
  kind: 'survey',
  version: 'oz-denetim-gunluk-1',
  scales: {
    /*
     * Düşünerek davranma: dus01 "Hata yapmaktan kaçınırım", dus02 "Kelimelerimi özenle seçerim", dus03 "Seçtiğim yola bağlı
     * kalırım"; ters: dus04 "Düşünmeden işlere atılırım", dus05 "Aceleci kararlar veririm", dus06 "Aklıma estiği gibi
     * davranmayı severim", dus07 "Bir işe acele edip hemen dalarım", dus08 "Çılgınlıklar yaparım", dus09 "Düşünmeden hareket
     * ederim", dus10 "Planlarımı sık sık son dakikada yaparım".
     */
    deliberation: {
      poles: { low: 'Anlık davranmaya yatkın', high: 'Önce düşünüp davranır' },
      bands: {
        low: {
          from: { school: ['dus07', 'dus04'], friends: ['dus02', 'dus09'], home: ['dus10'], work: ['dus07', 'dus04'] },
          student: {
            school: 'Bir projeye ne yapacağını düşünmeden dalabilirsin.',
            friends: 'Arkadaşlarınla konuşurken aklına geleni kelimelerini pek seçmeden hemen söyleyebilirsin.',
            home: 'Hafta sonu ne yapacağına çoğu zaman son dakikada karar verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir projeye ne yapacağını düşünmeden dalabilir.',
            friends: 'Arkadaşlarıyla konuşurken aklına geleni kelimelerini pek seçmeden hemen söyleyebilir.',
            home: 'Hafta sonu ne yapacağına çoğu zaman son dakikada karar verebilir.',
          },
          adult: {
            work: 'Yeni bir işe nasıl yapacağını düşünmeden dalabilirsin.',
          },
        },
        average: {
          from: { school: ['dus07'], friends: ['dus02'], home: ['dus10', 'dus05'], work: ['dus07'] },
          student: {
            school: 'Bazı ödevlerde önce ne yapacağını düşünebilir, bazılarına düşünmeden dalabilirsin.',
            friends: 'Arkadaşlarınla konuşurken bazen kelimelerini özenle seçebilir, bazen aklına geleni hemen söyleyebilirsin.',
            home: 'Bazı planları önceden düşünüp yapabilir, bazılarına son dakikada karar verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevlerde önce ne yapacağını düşünebilir, bazılarına düşünmeden dalabilir.',
            friends: 'Arkadaşlarıyla konuşurken bazen kelimelerini özenle seçebilir, bazen aklına geleni hemen söyleyebilir.',
            home: 'Bazı planları önceden düşünüp yapabilir, bazılarına son dakikada karar verebilir.',
          },
          adult: {
            work: 'Bazı işlerde önce ne yapacağını düşünebilir, bazılarına düşünmeden dalabilirsin.',
          },
        },
        high: {
          from: { school: ['dus04', 'dus01'], friends: ['dus02'], home: ['dus05', 'dus10'], work: ['dus04', 'dus01'] },
          student: {
            school: 'Bir projede ne yapacağını önceden düşünüp hata yapmamaya özen gösterebilirsin.',
            friends: 'Arkadaşlarınla konuşurken kelimelerini çoğu zaman özenle seçebilirsin.',
            home: 'Önemli bir karar vermeden önce biraz düşünüp planını önceden yapabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bir projede ne yapacağını önceden düşünüp hata yapmamaya özen gösterebilir.',
            friends: 'Arkadaşlarıyla konuşurken kelimelerini çoğu zaman özenle seçebilir.',
            home: 'Önemli bir karar vermeden önce biraz düşünüp planını önceden yapabilir.',
          },
          adult: {
            work: 'Bir işte ne yapacağını önceden düşünüp hata yapmamaya özen gösterebilirsin.',
          },
        },
      },
    },
    /*
     * Öz-disiplin: dis01 "Yapmam gereken işleri hemen hallederim", dis02 "Her zaman hazırlıklı olurum", dis03 "Görevlerime
     * vakit kaybetmeden başlarım", dis04 "Hemen işe koyulurum", dis05 "Yaptığım planları uygularım"; ters: dis06 "Oturup
     * çalışmaya başlamak bana zor gelir", dis07 "Zamanımı boşa harcarım", dis08 "Bir işe başlamam için birinin beni dürtmesi
     * gerekir", dis09 "İşlere başlamakta zorlanırım", dis10 "Karar vermeyi ertelerim". dis10 kararlardan söz ettiği için
     * (düşünerek davranmanın konusu) kullanılmadı.
     */
    discipline: {
      poles: { low: 'İşe geç koyulur', high: 'İşe hemen koyulur' },
      bands: {
        low: {
          from: { school: ['dis06', 'dis09'], friends: ['dis05'], home: ['dis08', 'dis01'], work: ['dis09', 'dis06'] },
          student: {
            school: 'Ders çalışmak için oturup başlamak sana zor gelebilir.',
            friends: 'Arkadaşlarınla bir proje için plan yapsan da onu uygulamaya geçirmek sana zor gelebilir.',
            home: 'Evdeki bir işe başlamak için birinin sana hatırlatmasına ihtiyaç duyabilirsin.',
          },
          parent: {
            school: 'Ders çalışmak için oturup başlamak çocuğunuza zor gelebilir.',
            friends: 'Arkadaşlarıyla bir proje için plan yapsa da onu uygulamaya geçirmek ona zor gelebilir.',
            home: 'Evdeki bir işe başlamak için birinin ona hatırlatmasına ihtiyaç duyabilir.',
          },
          adult: {
            work: 'Yapman gereken bir işe oturup başlamak sana zor gelebilir.',
            home: 'Evdeki bir işe başlamak için bir şeyin ya da birinin seni dürtmesine ihtiyaç duyabilirsin.',
          },
        },
        average: {
          from: { school: ['dis03', 'dis09'], friends: ['dis05'], home: ['dis01', 'dis08'], work: ['dis03', 'dis09'] },
          student: {
            school: 'Bazı ödevlere hemen başlayabilir, bazılarına başlamak sana zor gelebilir.',
            friends: 'Arkadaşlarınla yaptığın planların bazılarını uygulayabilir, bazılarını uygulamaya geçirmeyebilirsin.',
            home: 'Evdeki işleri bazen hemen halledebilir, bazen birinin hatırlatmasını bekleyebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı ödevlere hemen başlayabilir, bazılarına başlamak ona zor gelebilir.',
            friends: 'Arkadaşlarıyla yaptığı planların bazılarını uygulayabilir, bazılarını uygulamaya geçirmeyebilir.',
            home: 'Evdeki işleri bazen hemen halledebilir, bazen birinin hatırlatmasını bekleyebilir.',
          },
          adult: {
            work: 'Bazı işlere hemen başlayabilir, bazılarına başlamak sana zor gelebilir.',
            home: 'Evdeki işleri bazen hemen halledebilir, bazen bir hatırlatma bekleyebilirsin.',
          },
        },
        high: {
          from: { school: ['dis03', 'dis02'], friends: ['dis05'], home: ['dis01'], work: ['dis03', 'dis02'] },
          student: {
            school: 'Bir ödev verildiğinde vakit kaybetmeden başlayabilir, derse çoğu zaman hazırlıklı gelebilirsin.',
            friends: 'Arkadaşlarınla bir plan yaptığında onu çoğu zaman uygulamaya geçirebilirsin.',
            home: 'Evdeki işlerini çoğu zaman hemen halledebilirsin.',
          },
          parent: {
            school: 'Bir ödev verildiğinde çocuğunuz vakit kaybetmeden başlayabilir, derse çoğu zaman hazırlıklı gelebilir.',
            friends: 'Arkadaşlarıyla bir plan yaptığında onu çoğu zaman uygulamaya geçirebilir.',
            home: 'Evdeki işlerini çoğu zaman hemen halledebilir.',
          },
          adult: {
            work: 'Yapman gereken bir işe vakit kaybetmeden başlayabilir, çoğu zaman hazırlıklı olabilirsin.',
          },
        },
      },
    },
    /*
     * Kendini tutabilme: tut06 "Nadiren aşırıya kaçarım", tut07 "Cazip gelen şeylere kolayca direnebilirim", tut08 "Canım
     * bir şeyi çok çektiğinde kendimi tutabilirim", tut09 "Paramın yettiğinden fazlasını asla harcamam", tut10 "Asla savurganca
     * para harcamam"; ters: tut02 "Yaptığım bazı şeyleri neden yaptığımı bilmiyorum", tut03 "Sonradan pişman olduğum şeyler
     * yaparım", tut04 "Kendimi kaptırıp aşırıya kaçarım".
     */
    restraint: {
      poles: { low: 'İsteklerine kolay kapılır', high: 'Kendini tutabilir' },
      bands: {
        low: {
          from: { school: ['tut07'], friends: ['tut10', 'tut09'], home: ['tut04', 'tut03'], work: ['tut07'] },
          student: {
            school: 'Ders çalışırken telefon gibi cazip gelen bir şeye direnmek sana zor gelebilir.',
            friends: 'Arkadaşlarınla dışarı çıkınca planladığından fazla para harcayabilirsin.',
            home: 'Sevdiğin bir diziye ya da oyuna kendini kaptırıp sonradan pişman olacağın kadar uzun süre devam edebilirsin.',
          },
          parent: {
            school: 'Ders çalışırken telefon gibi cazip gelen bir şeye direnmek çocuğunuza zor gelebilir.',
            friends: 'Arkadaşlarıyla dışarı çıkınca planladığından fazla para harcayabilir.',
            home: 'Sevdiği bir diziye ya da oyuna kendini kaptırıp sonradan pişman olacağı kadar uzun süre devam edebilir.',
          },
          adult: {
            work: 'Yapman gereken bir iş varken cazip gelen başka bir şeye direnmek sana zor gelebilir.',
          },
        },
        average: {
          from: { school: ['tut07'], friends: ['tut09', 'tut10'], home: ['tut04', 'tut06'], work: ['tut07'] },
          student: {
            school: 'Ders çalışırken telefon gibi cazip şeylere bazen direnebilir, bazen kapılabilirsin.',
            friends: 'Arkadaşlarınla dışarı çıkınca bazen harcamanı sınırlayabilir, bazen planladığından fazla harcayabilirsin.',
            home: 'Sevdiğin bir diziye ya da oyuna bazen zamanında ara verebilir, bazen kendini kaptırıp aşırıya kaçabilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders çalışırken telefon gibi cazip şeylere bazen direnebilir, bazen kapılabilir.',
            friends: 'Arkadaşlarıyla dışarı çıkınca bazen harcamasını sınırlayabilir, bazen planladığından fazla harcayabilir.',
            home: 'Sevdiği bir diziye ya da oyuna bazen zamanında ara verebilir, bazen kendini kaptırıp aşırıya kaçabilir.',
          },
          adult: {
            work: 'Yapman gereken bir iş varken cazip gelen başka şeylere bazen direnebilir, bazen kapılabilirsin.',
          },
        },
        high: {
          from: { school: ['tut07', 'tut08'], friends: ['tut09', 'tut10'], home: ['tut06', 'tut04'], work: ['tut07'] },
          student: {
            school: 'Ders çalışırken telefon gibi cazip gelen şeylere çoğu zaman kolayca direnebilirsin.',
            friends: 'Arkadaşlarınla dışarı çıkınca paranın yettiğinden fazlasını harcamamaya dikkat edebilirsin.',
            home: 'Sevdiğin bir diziye ya da oyuna çoğu zaman aşırıya kaçmadan zamanında ara verebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz ders çalışırken telefon gibi cazip gelen şeylere çoğu zaman kolayca direnebilir.',
            friends: 'Arkadaşlarıyla dışarı çıkınca parasının yettiğinden fazlasını harcamamaya dikkat edebilir.',
            home: 'Sevdiği bir diziye ya da oyuna çoğu zaman aşırıya kaçmadan zamanında ara verebilir.',
          },
          adult: {
            work: 'Yapman gereken bir iş varken cazip gelen başka şeylere çoğu zaman direnebilirsin.',
          },
        },
      },
    },
  },
};
