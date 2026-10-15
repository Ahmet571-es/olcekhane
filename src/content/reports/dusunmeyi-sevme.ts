import type { BandText, ReportTemplate } from './types';

/**
 * Düşünmeyi Sevme Ölçeği rapor metinleri.
 * İlkeler: uçlardan biri iyi, öteki kötü değildir; düşük düzey bir eksiklik gibi anlatılmaz. Her düzeyde ölçeğin zekâyı
 * ölçmediği söylenir (dört cümle kişinin bir şeyleri ne kadar kolay ve çabuk kavradığını düşündüğünü sorar). Metinler
 * yalnızca maddelerin sorduğu davranışları anlatır: hoşlanma ya da kaçınma için karmaşık problemler, yeni yollar, kafa yoran
 * metinler ve felsefi tartışmalar (soyut fikirler değil: o madde kavramayı sorar). Düşük ve orta düzeyde kavrama hakkındaki
 * dört cümleye değinilmez: "bir şeyleri geç kavradığını düşünüyorsun" gibi bir cümle gerçek beceri hakkında bir hüküm gibi
 * okunabilir. Yüksek düzeyde de "kaçınmıyorsun" gibi kesin söylenmez, kişinin kendi söylediği anlatılır. Öğrenciye
 * "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor" dili kullanılır. Öneriler (ipuçları) raporda değil, yol
 * haritasındadır. Destek kutusu yoktur. Düzey adları Öğrenme ve Başarı Özellikleri'ndekilerle aynı anlamdadır.
 *
 * "Bilmekte yarar var" (`insight`): araştırmaların kısa özeti, her raporda. Kaynaklar bilim kartındadır: meta-analizler
 * (Liu ve Nesbit, 2024: okul başarısıyla r = .20, "küçük", büyüklüğü çalışmaya göre değişir; Schweitzer ve ark., 2025:
 * zekâ ile "küçük ile orta") ve ergenlikteki kararlılık (Lavrijsen ve ark., 2024: 7. ve 11. sınıf arası r = .50, beş temel
 * kişilik özelliğine benzer; yazarlar "görece yüksek" der). Nedensel bir etki söylenmez ("öğrenmeyi kolaylaştırır" denmez):
 * kaynakların hepsi ilişki gösterir. Yetişkine kararlılık için kaynak olmadığından "kalıcı bir etiket değildir" denir.
 * Yetişkin metninde okula özgü sözcük yoktur.
 */
const t = (summary: string, student: string, parent: string, adult?: string): BandText => ({
  summary,
  student,
  parent,
  ...(adult ? { adult } : {}),
  tipsStudent: [],
  tipsParent: [],
});

export const dusunmeyiSevmeReport: ReportTemplate = {
  version: 'dusunmeyi-sevme-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  insight: {
    title: { you: 'Bilmekte yarar var', parent: 'Bilmekte yarar var' },
    pageNote: 'Bilmekte yarar var: düşünmeyi sevmenin zekâ ve başarıyla ilişkisi ve zamanla değişip değişmediği üzerine araştırmaların kısa özeti',
    lead: [
      {
        when: {},
        text: {
          student:
            'Araştırmacılar, düşünmeyi gerektiren işlere girişme ve bunlardan keyif alma eğilimine “bilişsel ihtiyaç” der. Bu eğilim zekâ ile aynı şey değildir: ikisi arasındaki ilişki küçük ile orta arasındadır. Ders başarısıyla da küçük bir ilişkisi vardır; yani düşünmeyi sevmek başarıyı tek başına belirlemez. Gençlik yıllarında bu eğilim görece kararlıdır, ama değişebilir.',
          parent:
            'Araştırmacılar, düşünmeyi gerektiren işlere girişme ve bunlardan keyif alma eğilimine “bilişsel ihtiyaç” der. Bu eğilim zekâ ile aynı şey değildir: ikisi arasındaki ilişki küçük ile orta arasındadır. Ders başarısıyla da küçük bir ilişkisi vardır; yani düşünmeyi sevmek başarıyı tek başına belirlemez. Gençlik yıllarında bu eğilim görece kararlıdır, ama değişebilir.',
          adult:
            'Araştırmacılar, düşünmeyi gerektiren işlere girişme ve bunlardan keyif alma eğilimine “bilişsel ihtiyaç” der. Bu eğilim zekâ ile aynı şey değildir: ikisi arasındaki ilişki küçük ile orta arasındadır. Eğitimdeki başarıyla da küçük bir ilişkisi vardır; yani düşünmeyi sevmek başarıyı tek başına belirlemez. Bu eğilim kalıcı bir etiket değildir; zamanla değişebilir.',
        },
      },
    ],
    rules: [],
  },
  scales: {
    need_for_cognition: {
      high: t(
        'Kafa yoran işlerden hoşlanan',
        'Genel olarak karmaşık problemleri çözmekten, işleri yapmanın yeni yollarını düşünmekten ve anlamak için kafa yorman gereken metinler okumaktan hoşlandığını söylüyorsun. Bir şeyleri çabuk kavradığını ve çok bilgiyle başa çıkabildiğini de düşünüyorsun. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir.',
        'Çocuğunuz genel olarak karmaşık problemleri çözmekten, işleri yapmanın yeni yollarını düşünmekten ve anlamak için kafa yorması gereken metinler okumaktan hoşlandığını belirtiyor. Bir şeyleri çabuk kavradığını ve çok bilgiyle başa çıkabildiğini de düşünüyor. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir.',
      ),
      average: t(
        'Konuya göre düşünmeye istekli',
        'Bazı kafa yoran işlerden hoşlandığını, bazılarından ise uzak durduğunu söylüyorsun. Örneğin karmaşık bir problemle uğraşmayı sevip zor bir metni okumaktan kaçınabilir ya da tersini yapabilirsin. Düşünme isteğin konuya ve o anki ilgine göre değişebilir. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir.',
        'Çocuğunuz bazı kafa yoran işlerden hoşlandığını, bazılarından ise uzak durduğunu belirtiyor. Düşünme isteği konuya ve o anki ilgisine göre değişebilir. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir.',
      ),
      low: t(
        'Kafa yoran işlere daha az istekli',
        'Karmaşık problemler, okuması zor metinler ve felsefi tartışmalar gibi kafa yoran işlerden genel olarak pek hoşlanmadığını söylüyorsun. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir. Araştırmacılar, kafa yoran işlerde başarılı olmanın ve bundan keyif almanın bu isteği artırabileceğini düşünüyor.',
        'Çocuğunuz karmaşık problemler, okuması zor metinler ve felsefi tartışmalar gibi kafa yoran işlerden genel olarak pek hoşlanmadığını belirtiyor. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir. Araştırmacılar, kafa yoran işlerde başarılı olmanın ve bundan keyif almanın, en azından gençlerde, bu isteği artırabileceğini düşünüyor.',
        'Karmaşık problemler, okuması zor metinler ve felsefi tartışmalar gibi kafa yoran işlerden genel olarak pek hoşlanmadığını söylüyorsun. Bu ölçek zekâyı ölçmez; düşünmeyi gerektiren işlere ne kadar istekle yaklaştığını gösterir. Araştırmacılar, kafa yoran işlerde başarılı olmanın ve bundan keyif almanın, en azından gençlerde, bu isteği artırabileceğini düşünüyor.',
      ),
    },
  },
};
