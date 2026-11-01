import type { SurveyDaily } from './types';

/**
 * Öz-saygı Ölçeği: günlük hayatta nasıl görünür (6. sınıftan mezuna; yetişkinlere açık değil). Ton: gelişim
 * (lib/reports/daily-parts.ts, `scaleTone`): örnekler bugünkü durumu anlatır; düşük uca uydurma bir güçlü yan, yüksek uca
 * uydurma bir zorluk yazılmaz. Şablonun üç düzeyi (src/content/reports/oz-saygi.ts) üç gruba denk gelir; düşük düzey
 * ("Kendine karşı eleştirel") destek kutusu açar: örnekleri çok yumuşaktır, belirti saymaz, zor anın yanında bir dayanak
 * söyler; bu bölüm destek kutusunu anmaz. Orta düzey "Dengeli"dir (kendini değerli gördüğü zamanlar da, kendinden şüphe
 * duyduğu zamanlar da): örnekleri iki yanı birlikte anlatır, "genel olarak olumlu" demez.
 *
 * Destek kutusunu açan iki madde (R6 "Bazen kendimi gerçekten işe yaramaz hissediyorum", R9 "Sonuçta kendimi başarısız biri
 * gibi görme eğilimindeyim") hiçbir örneğin dayanağı değildir: bu maddelerden biri kutuyu açtıysa kart örnek göstermez;
 * açmadıysa kişi o cümlelere katılmamıştır (ya da R6'ya yalnızca "Katılıyorum" demiştir) ve "işe yaramaz", "başarısız"
 * diyen bir örnek onunla çelişirdi. "Çoğu insan kadar" (R4) ve "En az diğer insanlar kadar" (R7) maddelerinin
 * karşılaştırması örneklere taşınmaz (başkalarıyla kıyas yok). 6. sınıftaki bir öğrencinin anlayacağı somut durumlar
 * (ders, sınav, arkadaşlar, akşam) kullanılır. Her satırın dayandığı maddeler `from`'dadır.
 */
export const ozSaygiDaily: SurveyDaily = {
  kind: 'survey',
  version: 'oz-saygi-gunluk-1',
  scales: {
    /*
     * Öz-saygı: R1 "Genel olarak kendimden memnunum", R3 "Birçok iyi özelliğim olduğunu düşünüyorum", R4 "Çoğu insan kadar
     * iyi iş çıkarabilirim", R7 "En az diğer insanlar kadar değerli biri olduğumu düşünüyorum", R10 "Kendime karşı olumlu
     * bir tutumum var"; ters: R2 "Bazen hiçbir işe yaramadığımı düşünürüm", R5 "Kendimde gurur duyacak pek bir şey
     * bulamıyorum", R6 "Bazen kendimi gerçekten işe yaramaz hissediyorum", R8 "Keşke kendime daha çok saygı duyabilsem",
     * R9 "Sonuçta kendimi başarısız biri gibi görme eğilimindeyim". Uçlar testin ve şablonun uçlarından: "Kendine karşı
     * eleştirel" ↔ "Kendine karşı olumlu". Orta düzeyin "kendinden şüphe" anlatımı şablonun kendi sözüdür (R2'nin yumuşak
     * karşılığı).
     */
    self_esteem: {
      poles: { low: 'Kendine eleştirel bakar', high: 'Kendine olumlu bakar' },
      bands: {
        low: {
          from: { school: ['R5'], friends: ['R3'], home: ['R1', 'R10'] },
          student: {
            school: 'Derste emek verdiğin bir işle gurur duymak sana zor gelebilir.',
            friends: 'Arkadaşlarınla birlikteyken kendi iyi özelliklerini görmek sana zor gelebilir; bunu güvendiğin biriyle konuşmak iyi gelebilir.',
            home: 'Akşam günü düşündüğünde kendinden memnun hissetmek sana kolay gelmeyebilir; bu duygu zamanla değişebilir.',
          },
          parent: {
            school: 'Derste emek verdiği bir işle gurur duymak çocuğunuza zor gelebilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendi iyi özelliklerini görmek ona zor gelebilir; bunu güvendiği biriyle konuşmak iyi gelebilir.',
            home: 'Akşam günü düşündüğünde kendinden memnun hissetmek ona kolay gelmeyebilir; bu duygu zamanla değişebilir.',
          },
        },
        average: {
          from: { school: ['R4', 'R2'], friends: ['R3'], home: ['R1', 'R10'] },
          student: {
            school: 'Bazı derslerde iyi iş çıkarabileceğine inanabilir, bazılarında kendinden şüphe duyabilirsin.',
            friends: 'Arkadaşlarınla birlikteyken bazen kendi iyi özelliklerini görebilir, bazen onlardan emin olamayabilirsin.',
            home: 'Bazı günler kendinden memnun olabilir, bazı günler kendini daha çok eleştirebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz bazı derslerde iyi iş çıkarabileceğine inanabilir, bazılarında kendinden şüphe duyabilir.',
            friends: 'Arkadaşlarıyla birlikteyken bazen kendi iyi özelliklerini görebilir, bazen onlardan emin olamayabilir.',
            home: 'Bazı günler kendinden memnun olabilir, bazı günler kendini daha çok eleştirebilir.',
          },
        },
        high: {
          from: { school: ['R4'], friends: ['R3', 'R7'], home: ['R1', 'R10'] },
          student: {
            school: 'Zor bir sınava iyi iş çıkarabileceğine inanarak hazırlanabilirsin.',
            friends: 'Arkadaşlarınla birlikteyken kendini birçok iyi özelliği olan, değerli biri olarak görebilirsin.',
            home: 'Gün sonunda kendinden genel olarak memnun hissedebilirsin.',
          },
          parent: {
            school: 'Çocuğunuz zor bir sınava iyi iş çıkarabileceğine inanarak hazırlanabilir.',
            friends: 'Arkadaşlarıyla birlikteyken kendini birçok iyi özelliği olan, değerli biri olarak görebilir.',
            home: 'Gün sonunda kendinden genel olarak memnun hissedebilir.',
          },
        },
      },
    },
  },
};
