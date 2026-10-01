import type { BandText, ReportTemplate } from './types';

/**
 * Kişilerarası Tarz rapor metinleri.
 * İlkeler: her tarz, kişinin kendini nasıl tanımladığını anlatır; etiketleme yapılmaz. Her tarz kendi dört maddesiyle ayrı
 * ölçüldüğü için (karşı karşıya duran iki tarz aynı raporda ikisi de düşük çıkabilir) düşük düzey metinleri maddelerin
 * söylediğinin ötesine geçmez: "ilgi odağı olmayı aramadığını" der, "geri planda kaldığını" demez. Öğrenciye "Genel olarak ...
 * söylüyorsun", veliye "Çocuğunuz genel olarak ... belirtiyor" dili kullanılır. Sert ve mesafeli tarzların yüksek düzeyi
 * suçlamadan, küçük ve uygulanabilir bir öneriyle anlatılır; sessiz ve geri planda kalan tarzlar bir eksiklik gibi
 * anlatılmaz. Faydalar kesin sonuç gibi değil, olasılık olarak söylenir.
 * Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 * Destek kutusu yoktur: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez.
 * Öneri listeleri (kapsamlı rapor için) bu testte henüz yazılmadı; basit raporda gösterilmez.
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

export const kisilerarasiTarzReport: ReportTemplate = {
  version: 'kisilerarasi-tarz-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Çember, sekiz kişilerarası tarzı gösterir: yan yana duran tarzlar birbirine benzer, karşı karşıya duranlar birbirinin tersidir. Üst yarıdaki tarzlar öne çıkmayı, alt yarıdakiler geri planda kalmayı; sağ yarıdakiler sıcaklığı, sol yarıdakiler mesafeyi anlatır. Değerler 1 ile 5 arasındadır. Her tarz kendi dört cümlesiyle ayrı ölçüldüğü için karşı karşıya duran iki tarz birlikte yüksek ya da birlikte düşük çıkabilir ve sonuçlar yaklaşıktır; tek bir tarza bakarak kesin sonuç çıkarma. Ölçeğin geliştirildiği çalışmada katılımcılar sıcak ve uysal tarzların cümlelerine, sert ve mesafeli tarzlarınkinden çok daha fazla katılmıştı; bu yüzden şeklin sağa doğru uzaması tek başına seni başkalarından ayıran bir özellik olmayabilir.',
    parent:
      'Çember, sekiz kişilerarası tarzı gösterir: yan yana duran tarzlar birbirine benzer, karşı karşıya duranlar birbirinin tersidir. Üst yarıdaki tarzlar öne çıkmayı, alt yarıdakiler geri planda kalmayı; sağ yarıdakiler sıcaklığı, sol yarıdakiler mesafeyi anlatır. Değerler 1 ile 5 arasındadır. Her tarz kendi dört cümlesiyle ayrı ölçüldüğü için karşı karşıya duran iki tarz birlikte yüksek ya da birlikte düşük çıkabilir ve sonuçlar yaklaşıktır; tek bir tarza bakarak kesin sonuç çıkarılmamalıdır. Ölçeğin geliştirildiği çalışmada katılımcılar sıcak ve uysal tarzların cümlelerine, sert ve mesafeli tarzlarınkinden çok daha fazla katılmıştı; bu yüzden şeklin sağa doğru uzaması tek başına çocuğunuzu başkalarından ayıran bir özellik olmayabilir.',
  },
  scales: {
    assured_dominant: {
      high: t(
        'İlgi odağı olmayı seven',
        'Genel olarak sohbetlerde sözü ele aldığını, yüksek sesle konuştuğunu ve ilgi odağı olmaktan hoşlandığını söylüyorsun. Kendini ortaya koyabilmek bir güç olabilir; başkalarına da söz bırakmak, onların fikirlerini duymanı sağlayabilir.',
        'Çocuğunuz genel olarak sohbetlerde sözü ele aldığını, yüksek sesle konuştuğunu ve ilgi odağı olmaktan hoşlandığını belirtiyor. Başkalarına da söz bırakmanın değerini onunla konuşabilirsiniz.',
      ),
      average: t(
        'Duruma göre öne çıkan',
        'Bazı ortamlarda sözü ele alıp öne çıktığını, bazılarında ise ilgiyi başkalarına bıraktığını söylüyorsun.',
        'Çocuğunuz bazı ortamlarda sözü ele alıp öne çıktığını, bazılarında ise ilgiyi başkalarına bıraktığını belirtiyor.',
      ),
      low: t(
        'İlgi odağı olmayı aramayan',
        'Genel olarak ilgi odağı olmayı aramadığını ve sohbetlerde en çok konuşan kişi olmadığını söylüyorsun.',
        'Çocuğunuz genel olarak ilgi odağı olmayı aramadığını ve sohbetlerde en çok konuşan kişi olmadığını belirtiyor.',
      ),
    },
    gregarious_extraverted: {
      high: t(
        'Sosyal ve girişken',
        'Genel olarak insanların arasında rahat olduğunu, sohbetleri çoğu zaman senin başlattığını ve kalabalık ortamlardan hoşlandığını söylüyorsun.',
        'Çocuğunuz genel olarak insanların arasında rahat olduğunu, sohbetleri çoğu zaman kendisinin başlattığını ve kalabalık ortamlardan hoşlandığını belirtiyor.',
      ),
      average: t(
        'Duruma göre sosyal',
        'Bazı ortamlarda sohbet başlatıp kalabalıktan keyif aldığını, bazılarında ise daha sakin kalmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı ortamlarda sohbet başlatıp kalabalıktan keyif aldığını, bazılarında ise daha sakin kalmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Kalabalığı pek aramayan',
        'Genel olarak kalabalık ortamlardan pek hoşlanmadığını ve sohbet başlatmakta acele etmediğini söylüyorsun. Bu bir eksiklik değil; birçok insan az sayıda kişiyle bir arada olmayı tercih eder.',
        'Çocuğunuz genel olarak kalabalık ortamlardan pek hoşlanmadığını ve sohbet başlatmakta acele etmediğini belirtiyor. Bu bir eksiklik değildir; birçok kişi az sayıda insanla bir arada olmayı tercih eder.',
      ),
    },
    warm_agreeable: {
      high: t(
        'Sıcak ve uyumlu',
        'Genel olarak insanlara ilgi duyduğunu, onların hâlini hatırını sorduğunu, içlerini rahatlattığını ve başkalarıyla iyi geçindiğini söylüyorsun. Bu sıcaklık, insanlarla güvene dayalı ilişkiler kurmayı kolaylaştırabilir.',
        'Çocuğunuz genel olarak insanlara ilgi duyduğunu, onların hâlini hatırını sorduğunu, içlerini rahatlattığını ve başkalarıyla iyi geçindiğini belirtiyor.',
      ),
      average: t(
        'Duruma göre sıcak',
        'Bazı durumlarda insanlarla yakından ilgilendiğini, bazılarında ise bu ilgiyi daha az gösterdiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda insanlarla yakından ilgilendiğini, bazılarında ise bu ilgiyi daha az gösterdiğini belirtiyor.',
      ),
      low: t(
        'İnsanlarla az ilgilenen',
        'Genel olarak insanlara pek ilgi göstermediğini ve onların hâlini hatırını pek sormadığını söylüyorsun. Zaman zaman çevrendeki birinin hâlini sormak, ilişkilerini güçlendirebilir.',
        'Çocuğunuz genel olarak insanlara pek ilgi göstermediğini ve onların hâlini hatırını pek sormadığını belirtiyor. Birlikte yapılan etkinlikler, insanlarla bağ kurması için fırsat sunabilir.',
      ),
    },
    unassuming_ingenuous: {
      high: t(
        'Hoşgörülü ve uysal',
        'Genel olarak başkalarının pek çok davranışına katlandığını, olayları geldiği gibi karşıladığını ve önce başkalarını düşündüğünü söylüyorsun. Bu hoşgörü ilişkilerine iyi gelebilir; kendi isteklerini de dile getirmek, kendi ihtiyaçlarını da gözetmeni sağlayabilir.',
        'Çocuğunuz genel olarak başkalarının pek çok davranışına katlandığını, olayları geldiği gibi karşıladığını ve önce başkalarını düşündüğünü belirtiyor. Kendi isteklerini de dile getirmesi için onu destekleyebilirsiniz.',
      ),
      average: t(
        'Duruma göre hoşgörülü',
        'Bazı durumlarda başkalarına hoşgörüyle katlandığını, bazılarında ise kendi isteklerini öne koyduğunu söylüyorsun.',
        'Çocuğunuz bazı durumlarda başkalarına hoşgörüyle katlandığını, bazılarında ise kendi isteklerini öne koyduğunu belirtiyor.',
      ),
      low: t(
        'Her şeye katlanmayan',
        'Genel olarak başkalarının her davranışına katlanmadığını ve her zaman önce başkalarını düşünmediğini söylüyorsun. Kendini korumak önemli; başkalarının ihtiyaçlarını da gözetmek ilişkilerini güçlendirebilir.',
        'Çocuğunuz genel olarak başkalarının her davranışına katlanmadığını ve her zaman önce başkalarını düşünmediğini belirtiyor. Başkalarının ihtiyaçlarını da gözetmenin değerini onunla konuşabilirsiniz.',
      ),
    },
    unassured_submissive: {
      high: t(
        'Geri planda kalan',
        'Genel olarak alçak sesle konuştuğunu, sözü başkalarına bıraktığını, kendini pek övmediğini ve ilgi odağı olmaktan hoşlanmadığını söylüyorsun. Dinlemeyi bilmek değerli; istediğinde düşünceni de dile getirmek, fikirlerinin fark edilmesini sağlayabilir.',
        'Çocuğunuz genel olarak alçak sesle konuştuğunu, sözü başkalarına bıraktığını, kendini pek övmediğini ve ilgi odağı olmaktan hoşlanmadığını belirtiyor. Dinlemeyi bilmesi değerlidir; düşüncelerini dile getirmesi için onu cesaretlendirebilirsiniz.',
      ),
      average: t(
        'Duruma göre geri planda',
        'Bazı ortamlarda geri planda kalıp dinlemeyi, bazılarında ise kendini ortaya koymayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı ortamlarda geri planda kalıp dinlemeyi, bazılarında ise kendini ortaya koymayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Geri planda kalmayan',
        'Genel olarak alçak sesle konuşmadığını, kendini övmekten çekinmediğini ve ilgi odağı olmaktan rahatsızlık duymadığını söylüyorsun.',
        'Çocuğunuz genel olarak alçak sesle konuşmadığını, kendini övmekten çekinmediğini ve ilgi odağı olmaktan rahatsızlık duymadığını belirtiyor.',
      ),
    },
    aloof_introverted: {
      high: t(
        'Sessiz ve içe dönük',
        'Genel olarak az konuştuğunu, tanımadığın insanların yanında sessiz kaldığını ve özel hayatını pek kimseyle paylaşmadığını söylüyorsun. Bu bir eksiklik değil; güvendiğin birkaç kişiye açılmak ise yakın bağlar kurmanı kolaylaştırabilir.',
        'Çocuğunuz genel olarak az konuştuğunu, tanımadığı insanların yanında sessiz kaldığını ve özel hayatını pek kimseyle paylaşmadığını belirtiyor. Bu bir eksiklik değildir; güvendiği birkaç kişiyle yakın bağlar kurmasını destekleyebilirsiniz.',
      ),
      average: t(
        'Duruma göre konuşkan',
        'Bazı ortamlarda rahatça konuşup kendini açtığını, bazılarında ise sessiz kalmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı ortamlarda rahatça konuşup kendini açtığını, bazılarında ise sessiz kalmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Konuşmaktan çekinmeyen',
        'Genel olarak tanımadığın insanların yanında sessiz kalmadığını ve özel hayatını paylaşmaktan çekinmediğini söylüyorsun.',
        'Çocuğunuz genel olarak tanımadığı insanların yanında sessiz kalmadığını ve özel hayatını paylaşmaktan çekinmediğini belirtiyor.',
      ),
    },
    cold_hearted: {
      high: t(
        'Başkalarının derdine mesafeli',
        'Genel olarak herkesin kendi başının çaresine bakması gerektiğini düşündüğünü ve başkalarının sorunlarına mesafeli durduğunu söylüyorsun. Kendi işine odaklanmak bazen faydalı olabilir; yine de zor durumdaki birini dinlemek, aranızdaki güveni güçlendirebilir.',
        'Çocuğunuz genel olarak herkesin kendi başının çaresine bakması gerektiğini düşündüğünü ve başkalarının sorunlarına mesafeli durduğunu belirtiyor. Yardımlaşma gerektiren ortak işler, kendini başkalarının yerine koyma fırsatı sunabilir.',
      ),
      average: t(
        'Duruma göre ilgilenen',
        'Bazı durumlarda başkalarının sorunlarıyla ilgilendiğini, bazılarında ise mesafeli durduğunu söylüyorsun.',
        'Çocuğunuz bazı durumlarda başkalarının sorunlarıyla ilgilendiğini, bazılarında ise mesafeli durduğunu belirtiyor.',
      ),
      low: t(
        'Başkalarının derdine kayıtsız kalmayan',
        'Genel olarak başkalarının sorunlarına kayıtsız kalmadığını ve herkesin kendi başının çaresine bakması gerektiğini düşünmediğini söylüyorsun.',
        'Çocuğunuz genel olarak başkalarının sorunlarına kayıtsız kalmadığını ve herkesin kendi başının çaresine bakması gerektiğini düşünmediğini belirtiyor.',
      ),
    },
    arrogant_calculating: {
      high: t(
        'Sert ve eleştirel',
        'Genel olarak başkalarına sık sık karşı çıktığını, onları sert bir dille eleştirebildiğini ve zaman zaman insanlara terslendiğini söylüyorsun. Düşündüğünü açıkça söylemek değerli; bunu kırıcı olmadan yapmak, sözlerinin daha kolay kabul görmesini sağlayabilir.',
        'Çocuğunuz genel olarak başkalarına sık sık karşı çıktığını, onları sert bir dille eleştirebildiğini ve zaman zaman insanlara terslendiğini belirtiyor. Düşüncelerini kırıcı olmadan söylemenin yollarını onunla birlikte konuşabilirsiniz.',
      ),
      average: t(
        'Duruma göre eleştirel',
        'Bazı durumlarda başkalarına karşı çıkıp onları eleştirdiğini, bazılarında ise yumuşak bir dil kullandığını söylüyorsun.',
        'Çocuğunuz bazı durumlarda başkalarına karşı çıkıp onları eleştirdiğini, bazılarında ise yumuşak bir dil kullandığını belirtiyor.',
      ),
      low: t(
        'Yumuşak dilli',
        'Genel olarak başkalarını sert bir dille eleştirmediğini ve onlara terslenmediğini söylüyorsun.',
        'Çocuğunuz genel olarak başkalarını sert bir dille eleştirmediğini ve onlara terslenmediğini belirtiyor.',
      ),
    },
  },
};
