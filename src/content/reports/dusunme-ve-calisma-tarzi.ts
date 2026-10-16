import type { BandText, ReportTemplate } from './types';

/**
 * Düşünme ve Çalışma Tarzı rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): uçların iyi ya da kötü anlamı yoktur, her tarzın güçlü yanı anlatılır;
 * etiketleme yapılmaz. Sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye "Çocuğunuz ... belirtiyor"
 * dili kullanılır. Metinler ölçeğin cümlelerinin sorduğunun ötesine geçmez: ör. soyut konulara ilgi sanat ve şiir üzerine
 * konuşmayı değil, sanatı önemsemeyi ve şiiri sevmeyi sorar; düzen ve plan esnekliği ölçmez.
 * Aynı sayfada yan yana okunan kartlar çelişmesin diye her metin yalnızca kendi ölçeğine özgü davranışları anlatır:
 *  - Enerji ve tempo, "Bir işe başlamam için birinin beni dürtmesi gerekir" maddesini anlatmaz (düzen ve plandaki
 *    "Yapmam gereken işleri hemen hallederim" ile çelişebilirdi); tempoyu, meşguliyeti ve iş miktarını anlatır.
 *  - Düzen ve plan, "Zamanımı boşa harcarım" maddesini anlatmaz (enerji ve tempodaki "Hep bir şeylerle meşgulümdür"
 *    ile çelişebilirdi); düzeni, planı, eşyaları ve işleri hemen halletmeyi anlatır.
 *  - Yenilikçilik, "Bir konunun derinine inmem" maddesini anlatmaz (soyut konulara ilgiyle çelişebilirdi).
 * Orta düzey metinleri bir zaman içinde değişimden söz etmez (maddeler bunu sormaz); düzeyin ortada olduğunu söyler.
 * Soyut konulara ilgi metinlerinin üçü de zekâyı, yenilikçilik metinlerinin üçü de yaratıcılığı ya da zekâyı ölçmediğini
 * söyler. Metinler okula ya da ergenliğe özgü sözcük içermez; yetişkin raporu öğrenci metinlerini kullanır.
 * Destek kutusu gösterilmez: ölçeklerin hiçbiri sıkıntı ya da kaygı ölçmez. Öneri listeleri yazılmadı; öneriler ve veliye
 * yaklaşım gelişim yol haritasındadır ve bu metinleri tekrar etmez (tests/dusunme-ve-calisma-tarzi.test.ts denetler).
 */
const t = (summary: string, student: string, parent: string): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
});

export const dusunmeVeCalismaTarziReport: ReportTemplate = {
  version: 'dusunme-ve-calisma-tarzi-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır düşünme ve çalışma tarzının bir özelliğini gösteriyor; beş özellik ayrı ayrı puanlanır, toplam bir puan yoktur. Uçlardan biri iyi, öteki kötü değil; her tarzın kendine özgü güçlü yanları var. Puanlar bir yeteneği ölçmez: düşünürken ve çalışırken kendini nasıl gördüğünü gösterir. Her özellik 10 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir özelliğe bakarak kesin bir sonuç çıkarma.',
    parent:
      'Her satır çocuğunuzun düşünme ve çalışma tarzının bir özelliğini gösterir; beş özellik ayrı ayrı puanlanır, toplam bir puan yoktur. Uçlardan biri iyi, öteki kötü değildir; her tarzın kendine özgü güçlü yanları vardır. Puanlar bir yeteneği ölçmez: çocuğunuzun düşünürken ve çalışırken kendini nasıl gördüğünü gösterir. Her özellik 10 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir özelliğe bakarak kesin bir sonuç çıkarılmamalıdır.',
  },
  scales: {
    complexity: {
      high: t(
        'Soyut ve felsefi konuları seven',
        'Soyut fikirlerin, felsefi ve teorik tartışmaların ilgini çektiğini söylüyorsun; kendini ve hayatını incelemekten, film ve kitaplar üzerine konuşmaktan hoşlandığını, sanatı önemsediğini ve şiiri sevdiğini de anlatıyorsun. Bu ilgi, bir konunun ardındaki “neden”leri sormanı ve farklı bakış açılarını tartmanı kolaylaştırabilir. Bu özellik zekâyı ölçmez; neye ilgi duyduğunu gösterir.',
        'Çocuğunuz soyut fikirlerin, felsefi ve teorik tartışmaların ilgisini çektiğini belirtiyor; kendini ve hayatını incelemekten, film ve kitaplar üzerine konuşmaktan hoşlandığını, sanatı önemsediğini ve şiiri sevdiğini söylüyor. Bu ilgi, bir konunun ardındaki “neden”leri sormasını kolaylaştırabilir. Bu özellik zekâyı ölçmez; çocuğunuzun neye ilgi duyduğunu gösterir.',
      ),
      average: t(
        'Soyut konulara orta düzeyde ilgi duyan',
        'Soyut ve felsefi konulara orta düzeyde ilgi duyduğunu söylüyorsun: bazı fikirler, tartışmalar ya da sanat dalları seni düşündürürken bazıları pek ilgini çekmiyor olabilir. Üzerine uzun uzun düşündüğün konular, ilgini derinleştirebileceğin yerleri gösterebilir. Bu özellik zekâyı ölçmez; neye ilgi duyduğunu gösterir.',
        'Çocuğunuz soyut ve felsefi konulara orta düzeyde ilgi duyduğunu belirtiyor: bazı fikirler, tartışmalar ya da sanat dalları onu düşündürürken bazıları pek ilgisini çekmiyor olabilir. Bu özellik zekâyı ölçmez; çocuğunuzun neye ilgi duyduğunu gösterir.',
      ),
      low: t(
        'Soyut konulara az ilgi duyan',
        'Soyut fikirlerin, felsefi ve teorik tartışmaların ilgini pek çekmediğini söylüyorsun; şiir ve sanat da sana pek hitap etmeyebilir. İnsanların ilgisi farklı yerlerde yoğunlaşır ve bu sonuç senin hakkında bir yargı değildir. Bu özellik zekâyı ölçmez; neye ilgi duyduğunu gösterir.',
        'Çocuğunuz soyut fikirlerin, felsefi ve teorik tartışmaların ilgisini pek çekmediğini belirtiyor; şiir ve sanat da ona pek hitap etmeyebilir. İnsanların ilgisi farklı yerlerde yoğunlaşır ve bu sonuç onun hakkında bir yargı değildir. Bu özellik zekâyı ölçmez; çocuğunuzun neye ilgi duyduğunu gösterir.',
      ),
    },
    ingenuity: {
      high: t(
        'Yeni fikirler ve yollar arayan',
        'Aklının fikirlerle dolu olduğunu, işleri yapmanın yeni yollarını düşünüp bulmayı sevdiğini ve cesur planlar kurduğunu söylüyorsun; hayal gücünün de canlı olduğunu düşünüyorsun. Yeni fikirler bulmaktan hoşlanmak, bir sorunu farklı yönlerden ele almana yardım edebilir. Bu özellik yaratıcılığı ya da zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz aklının fikirlerle dolu olduğunu, işleri yapmanın yeni yollarını düşünüp bulmayı sevdiğini ve cesur planlar kurduğunu belirtiyor; hayal gücünün de canlı olduğunu düşünüyor. Yeni fikirler bulmaktan hoşlanmak, bir sorunu farklı yönlerden ele almasına yardım edebilir. Bu özellik yaratıcılığı ya da zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir.',
      ),
      average: t(
        'Yer yer yeni fikir arayan',
        'Yeni fikirler ve yollar bulmak konusunda kendini orta düzeyde gördüğünü söylüyorsun: bazı işlerde aklına yeni fikirler gelirken bazılarında bilinen yollar sana daha yakın gelebilir. Hayal gücün ve fikir bulma isteğin konuya göre değişebilir. Bu özellik yaratıcılığı ya da zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz yeni fikirler ve yollar bulmak konusunda kendini orta düzeyde gördüğünü belirtiyor: bazı işlerde aklına yeni fikirler gelirken bazılarında bilinen yollar ona daha yakın gelebilir. Bu özellik yaratıcılığı ya da zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir.',
      ),
      low: t(
        'Yeni fikir aramaya az yönelen',
        'Aklına yeni fikirlerin pek gelmediğini ve bir şeyleri hayal etmekte zaman zaman zorlandığını söylüyorsun; işleri yapmanın yeni yollarını aramak da sana pek çekici gelmeyebilir. Bir işi bilinen yollarla iyi yapmak da değerli bir beceridir; fikirler de çoğu zaman başkalarıyla konuşurken ya da bir şeyi denerken ortaya çıkabilir. Bu özellik yaratıcılığı ya da zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz aklına yeni fikirlerin pek gelmediğini ve bir şeyleri hayal etmekte zaman zaman zorlandığını belirtiyor. Bir işi bilinen yollarla iyi yapmak da değerli bir beceridir. Bu özellik yaratıcılığı ya da zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir.',
      ),
    },
    conformity: {
      high: t(
        'Başkalarının görüşüne önem veren',
        'İnsanların hakkında ne düşündüğünü önemsediğini, onların onayına ihtiyaç duyduğunu ve çoğu zaman başkalarının görüşlerine uyduğunu söylüyorsun; başkalarının gözünde özel biri olmak da senin için önemli. Çevrendekilerin görüşüne önem vermek, onlarla uyum içinde hareket etmeni ve ne beklediklerini fark etmeni kolaylaştırabilir. Önemli bir seçim yaparken kendi isteğini de hesaba katmak, sana en uygun kararı vermene yardım eder.',
        'Çocuğunuz insanların hakkında ne düşündüğünü önemsediğini, onların onayına ihtiyaç duyduğunu ve çoğu zaman başkalarının görüşlerine uyduğunu belirtiyor. Çevresindekilerin görüşüne önem vermek, onlarla uyum içinde hareket etmesini kolaylaştırabilir. Önemli bir seçim yaparken kendi isteğini de rahatça söyleyebileceği bir ortam, neyi gerçekten istediğini fark etmesine yardım eder.',
      ),
      average: t(
        'Konuya göre çevresine uyan',
        'Başkalarının görüşüne ve onayına orta düzeyde önem verdiğini söylüyorsun: bazı konularda çevrendekilere uyarken bazılarında kendi görüşüne göre hareket ediyorsun. Hangi konularda başkalarının görüşünü, hangilerinde kendi görüşünü öne koyduğunu görmek, kararlarını daha bilinçli vermene yardım edebilir.',
        'Çocuğunuz başkalarının görüşüne ve onayına orta düzeyde önem verdiğini belirtiyor: bazı konularda çevresindekilere uyarken bazılarında kendi görüşüne göre hareket ediyor.',
      ),
      low: t(
        'Kendi görüşüne göre hareket eden',
        'Kendi görüşlerini kendin oluşturmak istediğini, başkalarının ne düşündüğünü pek dert etmediğini ve bazı insanların seni sevmemesini doğal karşıladığını söylüyorsun; başkalarından farklı olmak istediğini de anlatıyorsun. Kendi görüşüne göre hareket etmek, çevrenin baskısıyla karar vermemeni kolaylaştırabilir. Başkalarının görüşlerini de dinlemek, kararlarını gözden geçirmene yardım eder.',
        'Çocuğunuz kendi görüşlerini kendisi oluşturmak istediğini, başkalarının ne düşündüğünü pek dert etmediğini ve bazı insanların onu sevmemesini doğal karşıladığını belirtiyor. Kendi görüşüne göre hareket etmek, çevresinin baskısıyla karar vermemesini kolaylaştırabilir. Farklı görüşleri de dinlemesi, kararlarını gözden geçirmesine yardım eder.',
      ),
    },
    activity: {
      high: t(
        'Hareketli ve yoğun tempolu',
        'Hep bir şeylerle meşgul olduğunu, aynı anda birçok şeyi idare edebildiğini ve çok iş çıkardığını söylüyorsun; boş zamanlarını da dolu dolu geçirdiğini anlatıyorsun. Bu enerji, yapmak istediğin pek çok şeye zaman bulmanı kolaylaştırabilir. Yoğun bir tempoda dinlenmeye de yer açmak, bu enerjiyi uzun süre korumana yardım eder.',
        'Çocuğunuz hep bir şeylerle meşgul olduğunu, aynı anda birçok şeyi idare edebildiğini ve çok iş çıkardığını belirtiyor; boş zamanlarını da dolu dolu geçirdiğini söylüyor. Bu enerji, yapmak istediği pek çok şeye zaman bulmasını kolaylaştırabilir; yoğun tempoda dinlenmeye de zaman kalması önemlidir.',
      ),
      average: t(
        'Orta tempolu',
        'Kendini ne çok yoğun tempolu ne de çok sakin biri olarak gördüğünü söylüyorsun: ne her zaman bir şeylerle meşgulsün ne de çoğu zaman boş duruyorsun. Ne kadar iş çıkardığın, işin türüne ve o günkü enerjine göre değişebilir.',
        'Çocuğunuz kendini ne çok yoğun tempolu ne de çok sakin biri olarak gördüğünü belirtiyor. Ne kadar iş çıkardığı, işin türüne ve o günkü enerjisine göre değişebilir.',
      ),
      low: t(
        'Sakin bir tempoda ilerleyen',
        'Hayatının temposunun yavaş olduğunu, her zaman bir şeylerle meşgul olmadığını ve kendini çok iş çıkaran biri olarak pek görmediğini söylüyorsun. Sakin bir tempo bir eksiklik değildir; işleri acele etmeden yapmana da yardım edebilir.',
        'Çocuğunuz hayatının temposunun yavaş olduğunu, her zaman bir şeylerle meşgul olmadığını ve kendini çok iş çıkaran biri olarak pek görmediğini belirtiyor. Sakin bir tempo bir eksiklik değildir; işleri acele etmeden yapmasına da yardım edebilir.',
      ),
    },
    organization: {
      high: t(
        'Düzenli ve planlı',
        'Düzeni sevdiğini, plan yapıp planına bağlı kaldığını ve yapman gereken işleri hemen hallettiğini söylüyorsun; eşyalarını da yerli yerinde tuttuğunu anlatıyorsun. Bu düzen, işlerini zamanında ve rahatça bitirmene yardım edebilir. Planlar her zaman tutmayabilir; bir şey değiştiğinde planını yeniden düzenleyebilmek de işine yarar.',
        'Çocuğunuz düzeni sevdiğini, plan yapıp planına bağlı kaldığını ve yapması gereken işleri hemen hallettiğini belirtiyor; eşyalarını da yerli yerinde tuttuğunu söylüyor. Bu düzen, işlerini zamanında bitirmesine yardım edebilir.',
      ),
      average: t(
        'Bazı işlerde düzenli',
        'Bazı işlerde düzenli ve planlı olduğunu, bazılarını ise sonraya bıraktığını söylüyorsun. Eşyalarını yerli yerinde tutmak ve bir programa göre hareket etmek de sende işten işe değişiyor olabilir. Düzenli olduğun işlerde neyin işe yaradığını görmek, aynı yolu başka işlerde denemeni kolaylaştırabilir.',
        'Çocuğunuz bazı işlerde düzenli ve planlı olduğunu, bazılarını ise sonraya bıraktığını belirtiyor. Eşyalarını yerli yerinde tutmak ve bir programa göre hareket etmek de onda işten işe değişiyor olabilir.',
      ),
      low: t(
        'Düzene pek takılmayan',
        'Dağınıklığın seni pek rahatsız etmediğini, eşyalarını zaman zaman ortada bıraktığını ve hoşa gitmeyen işleri ertelediğini söylüyorsun; bir plana ya da programa uymak da sana pek uygun gelmiyor. Bu bir karakter kusuru değil; düzen küçük alışkanlıklarla kurulabilir ve istediğin zaman bunu adım adım deneyebilirsin.',
        'Çocuğunuz dağınıklığın onu pek rahatsız etmediğini, eşyalarını zaman zaman ortada bıraktığını ve hoşa gitmeyen işleri ertelediğini belirtiyor; bir plana ya da programa uymak da ona pek uygun gelmiyor. Bu bir karakter kusuru değildir; düzen küçük alışkanlıklarla kurulabilir.',
      ),
    },
  },
};
