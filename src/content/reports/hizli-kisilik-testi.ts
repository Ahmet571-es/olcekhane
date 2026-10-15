import type { BandText, ReportTemplate } from './types';

/**
 * Hızlı Kişilik Testi rapor metinleri.
 * İlkeler (Beş Faktör ve Kişiliğin 10 Yönü ile aynı): kişilik boyutlarında "iyi" ya da "kötü" uç yoktur; her tarzın
 * güçlü yanı anlatılır. Etiketleme yapılmaz; sonuç öz bildirime dayandığı için öğrenciye "... söylüyorsun", veliye
 * "Çocuğunuz ... belirtiyor" dili kullanılır.
 * Her metin yalnızca kendi boyutunun dört maddesinin sorduğu davranışları anlatır (Mini-IPIP'in maddeleri Beş Faktör'ün
 * 50 maddesinden dar bir dilimdir): Dışadönüklük kalabalıkta konuşkan ve görünür olmayı; Uyumluluk başkalarının duygularına
 * ve sorunlarına ilgiyi; Sorumluluk işleri hemen halletmeyi ve düzeni; Duygusal Denge çoğu zaman rahat olmayı, duyguların
 * sık sık inip çıkmamasını, küçük şeylere bozulmamayı ve nadiren hüzünlü hissetmeyi; Merak ve Hayal Gücü hayal gücünü ve soyut
 * fikirlere ilgiyi.
 * Düzeyler üçtür (düşük, orta, yüksek): dört maddelik ölçekte daha ince bir ayrım ölçüm payının içinde kalırdı.
 * Merak ve Hayal Gücü zekâyı ölçmez; her düzeyde bu söylenir ("Soyut fikirleri anlamakta zorlanırım" maddesi yüzünden).
 * Destek kutusu: Duygusal Denge düşükse (ortalama 2,5 ya da altı; Kişiliğin 10 Yönü gibi). Düşük düzey "sık sık" demez:
 * 3, 3, 2, 2 gibi cevaplar da bu düzeye düşer. Öneriler (rapordaki ipuçları) yazılmadı; öneriler yol haritasındadır.
 * Yetişkin raporu öğrenci metinlerini kullanır; öğrenci metinleri okula ya da ergenliğe özgü sözcük içermez.
 */
const t = (summary: string, student: string, parent: string, extra?: { support?: boolean }): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(extra?.support ? { support: true } : {}),
});

export const hizliKisilikTestiReport: ReportTemplate = {
  version: 'hizli-kisilik-testi-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır kişiliğinin bir boyutunu gösteriyor; beş boyut ayrı ayrı puanlanır, toplam bir puan yoktur. Uçlardan biri iyi, öteki kötü değil; her tarzın kendine özgü güçlü yanları var. Her boyut yalnızca dört cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir boyuta bakarak kesin bir sonuç çıkarma. Kırmızı işaret senin puanın.',
    parent:
      'Her satır çocuğunuzun kişiliğinin bir boyutunu gösterir; beş boyut ayrı ayrı puanlanır, toplam bir puan yoktur. Uçlardan biri iyi, öteki kötü değildir; her tarzın kendine özgü güçlü yanları vardır. Her boyut yalnızca dört cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir boyuta bakarak kesin bir sonuç çıkarılmamalıdır. Kırmızı işaret çocuğunuzun puanıdır.',
  },
  scales: {
    extraversion: {
      high: t(
        'Konuşkan ve canlı',
        'Arkadaş ortamlarında konuşkan olduğunu ve kalabalıkta birçok farklı kişiyle sohbet ettiğini söylüyorsun. Ortamı canlandıran kişi çoğu zaman sensin; geri planda kalmayı pek tercih etmiyorsun. İnsanlarla kolayca sohbet açabilmek yeni bir ortama alışmayı kolaylaştırabilir. Sessiz kalan birine de konuşma fırsatı vermek, sohbeti herkes için daha keyifli yapar.',
        'Çocuğunuz arkadaş ortamlarında konuşkan olduğunu ve kalabalıkta birçok farklı kişiyle sohbet ettiğini belirtiyor. Ortamı canlandıran kişinin çoğu zaman kendisi olduğunu, geri planda kalmayı pek tercih etmediğini söylüyor. İnsanlarla kolayca sohbet açabilmek yeni bir ortama alışmasını kolaylaştırabilir.',
      ),
      average: t(
        'Bazen konuşkan, bazen sessiz',
        'Kalabalık ortamlarda bazen konuşkan ve canlı, bazen daha sessiz olduğunu söylüyorsun. Bu, ortama ve yanındaki insanlara göre değişebilir: bir yerde ortamı canlandırırken başka bir yerde geri planda kalmayı seçebilirsin. Hangi ortamlarda kendini daha rahat hissettiğini fark etmek işine yarar.',
        'Çocuğunuz kalabalık ortamlarda bazen konuşkan ve canlı, bazen daha sessiz olduğunu belirtiyor. Bu, ortama ve yanındaki insanlara göre değişebilir: bir yerde ortamı canlandırırken başka bir yerde geri planda kalmayı seçebiliyor.',
      ),
      low: t(
        'Sakin, geri planda kalan',
        'Çok konuşmadığını ve kalabalıkta geri planda kalmayı tercih ettiğini söylüyorsun. Ortamı canlandıran kişi olmak sana pek göre değil; kalabalıkta birçok kişiyle sohbet etmek yerine az kişiyle konuşmayı seçebilirsin. Bu bir eksiklik değil: dinlemek ve konuşmadan önce düşünmek de değerli güçlerdir. Kalabalıkta sessiz kalmak, insanlarla yakın ilişkiler kurmaya engel değildir.',
        'Çocuğunuz çok konuşmadığını ve kalabalıkta geri planda kalmayı tercih ettiğini belirtiyor. Ortamı canlandıran kişi olmak ona pek göre değil; kalabalıkta birçok kişiyle sohbet etmek yerine az kişiyle konuşmayı seçebiliyor. Bu bir eksiklik değildir; sakin ve az konuşan insanlar da yakın ve güçlü arkadaşlıklar kurabilir.',
      ),
    },
    agreeableness: {
      high: t(
        'Başkalarının duygularına yakın',
        'Başkalarının duygularını anladığını, onların sevincini ve üzüntüsünü içinde hissettiğini söylüyorsun. İnsanlara ve onların sorunlarına ilgi duyuyorsun. Bu duyarlılık arkadaşlıklarında güven ve yakınlık kurmana yardım edebilir. Başkalarının üzüntüsünü bu kadar yakından hissetmek bazen yorucu olabilir; kendi duygularına da zaman ayırmayı unutma.',
        'Çocuğunuz başkalarının duygularını anladığını, onların sevincini ve üzüntüsünü içinde hissettiğini belirtiyor; insanlara ve onların sorunlarına ilgi duyduğunu söylüyor. Bu duyarlılık arkadaşlıklarında güven ve yakınlık kurmasına yardım edebilir. Başkalarının üzüntüsünü bu kadar yakından hissetmek zaman zaman onu yorabilir.',
      ),
      average: t(
        'Duruma göre ilgilenen',
        'Başkalarının duygularına ve sorunlarına orta düzeyde ilgi gösterdiğini söylüyorsun: bazen onların ne hissettiğini içinde hissediyor, bazen daha mesafeli kalıyorsun. Bu, kişiye ve duruma göre değişebilir. Kimin duygularına daha yakın olduğunu fark etmek ilişkilerini anlamana yardım eder.',
        'Çocuğunuz başkalarının duygularına ve sorunlarına orta düzeyde ilgi gösterdiğini belirtiyor: bazen onların ne hissettiğini içinde hissediyor, bazen daha mesafeli kalıyor. Bu, kişiye ve duruma göre değişebilir.',
      ),
      low: t(
        'Başkalarının sorunlarına mesafeli',
        'Başkalarının sorunlarıyla pek ilgilenmediğini, onların ne hissettiğini de içinde pek hissetmediğini söylüyorsun. Bu sonuç senin hakkında bir yargı değil; insanlar başkalarına farklı ölçüde yakınlık gösterir. Yine de bir arkadaşın zor bir gün geçirdiğinde ona nasıl olduğunu sormak, ilişkilerini güçlendirmenin küçük bir yolu olabilir.',
        'Çocuğunuz başkalarının sorunlarıyla pek ilgilenmediğini, onların ne hissettiğini de içinde pek hissetmediğini belirtiyor. Bu sonuç onun hakkında bir yargı değildir; insanlar başkalarına farklı ölçüde yakınlık gösterir. Bunu suçlamadan, gündelik durumlar üzerinden konuşmanız daha yararlı olur.',
      ),
    },
    conscientiousness: {
      high: t(
        'Düzenli, işini hemen yapan',
        'Yapman gereken işleri hemen hallettiğini ve düzeni sevdiğini söylüyorsun. Kullandığın şeyleri yerine koyduğunu ve işleri birbirine karıştırmadığını da anlatıyorsun. Bu düzen işlerini zamanında ve rahatça bitirmene yardım edebilir. İşler her zaman düzenli gitmeyebilir; bir şey ters gittiğinde esnek olabilmek de bir beceridir.',
        'Çocuğunuz yapması gereken işleri hemen hallettiğini ve düzeni sevdiğini belirtiyor; kullandığı şeyleri yerine koyduğunu ve işleri birbirine karıştırmadığını söylüyor. Bu düzen işlerini zamanında bitirmesine yardım edebilir.',
      ),
      average: t(
        'Duruma göre düzenli',
        'Bazı işleri hemen hallettiğini, bazılarını ise sonraya bıraktığını söylüyorsun. Eşyalarını yerli yerinde tutmak ve düzeni korumak konusunda da duruma göre değişen bir tarzın var. Hangi işlerde düzenli olduğunu fark etmek, o alışkanlığı başka işlere taşımana yardım edebilir.',
        'Çocuğunuz bazı işleri hemen hallettiğini, bazılarını ise sonraya bıraktığını belirtiyor. Eşyalarını yerli yerinde tutmak ve düzeni korumak konusunda da duruma göre değişen bir tarz anlatıyor.',
      ),
      low: t(
        'Esnek, düzene pek takılmayan',
        'Yapman gereken işleri çoğu zaman hemen halletmediğini ve kullandığın şeyleri yerine koymayı unutabildiğini söylüyorsun. Düzen sana pek önemli gelmiyor ve işlerin zaman zaman birbirine karışabiliyor. Bu bir karakter kusuru değil; küçük adımlarla değişebilir. Kullandığın bir şeyi işin biter bitmez yerine koymak gibi küçük bir alışkanlık, düzeni korumayı kolaylaştırabilir.',
        'Çocuğunuz yapması gereken işleri çoğu zaman hemen halletmediğini ve kullandığı şeyleri yerine koymayı unutabildiğini belirtiyor. Düzen ona pek önemli gelmiyor ve işleri zaman zaman birbirine karışabiliyor. Bu bir karakter kusuru değildir; küçük alışkanlıklarla değişebilen bir alandır.',
      ),
    },
    emotional_stability: {
      high: t(
        'Çoğu zaman rahat ve sakin',
        'Çoğu zaman rahat ve sakin olduğunu, duygularının gün içinde pek inip çıkmadığını söylüyorsun. Küçük şeylere kolay kolay bozulmadığını ve kendini nadiren hüzünlü hissettiğini de anlatıyorsun. Bu iç rahatlık zor günlerde sana dayanak olabilir. Yine de herkes zaman zaman üzülür; böyle anlarda bunu paylaşmak da güçlü olmanın bir parçasıdır.',
        'Çocuğunuz çoğu zaman rahat ve sakin olduğunu, duygularının gün içinde pek inip çıkmadığını belirtiyor; küçük şeylere kolay kolay bozulmadığını ve kendini nadiren hüzünlü hissettiğini söylüyor. Sakin görünen gençler de zaman zaman üzülür; çocuğunuzun içinden geçenleri paylaşabileceği bir ortamı korumak önemlidir.',
      ),
      average: t(
        'Bazen sakin, bazen çabuk etkilenen',
        'Bazen rahat ve sakin, bazen daha çabuk etkilenen biri olduğunu söylüyorsun. Duyguların zaman zaman inip çıkabiliyor, küçük şeylere de bozulabiliyorsun; pek çok insan için durum böyledir. Seni en çok neyin etkilediğini fark etmek, o anlara hazırlıklı olmana yardım eder.',
        'Çocuğunuz bazen rahat ve sakin, bazen daha çabuk etkilenen biri olduğunu belirtiyor. Duygularının zaman zaman inip çıktığını ve küçük şeylere bazen bozulabildiğini söylüyor; bu pek çok insanda görülen bir durumdur.',
      ),
      low: t(
        'Duygularından çabuk etkilenen',
        'Duygularının gün içinde inip çıkabildiğini ve küçük şeylere kolayca bozulabildiğini söylüyorsun. Kendini her zaman rahat hissetmediğini ve hüzünlü anlarının az olmadığını da anlatıyorsun. Bunu fark etmen önemli bir adım; duygularla baş etmeyi öğrenmek mümkün.',
        'Çocuğunuz duygularının gün içinde inip çıkabildiğini ve küçük şeylere kolayca bozulabildiğini belirtiyor; kendini her zaman rahat hissetmediğini ve hüzünlü anlarının az olmadığını söylüyor. Bu sonuç bir tanı değildir; ancak bu duyguların ne kadar süredir devam ettiğini ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir.',
        { support: true },
      ),
    },
    intellect: {
      high: t(
        'Hayal gücü canlı, fikirlere meraklı',
        'Hayal gücünün canlı olduğunu ve soyut fikirlerin, yani adalet ya da sonsuzluk gibi elle tutulamayan kavramların ilgini çektiğini söylüyorsun. Bu tür fikirleri anlamakta zorlanmadığını da anlatıyorsun. Hayal gücü ve fikirlere merak, yeni şeyler düşünmenin güçlü bir kaynağı olabilir. Bu boyut zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz hayal gücünün canlı olduğunu ve soyut fikirlerin ilgisini çektiğini belirtiyor; bu tür fikirleri anlamakta zorlanmadığını söylüyor. Bu boyut zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir.',
      ),
      average: t(
        'Konusuna göre meraklı',
        'Hayal gücünün ve soyut fikirlere ilginin orta düzeyde olduğunu söylüyorsun: bazı konularda fikirlerle uğraşmaktan hoşlanırken bazılarında somut ve pratik şeyleri tercih edebilirsin. Seni gerçekten meraklandıran konuları fark etmek, ilgini derinleştirmenin iyi bir yoludur. Bu boyut zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz hayal gücünün ve soyut fikirlere ilgisinin orta düzeyde olduğunu belirtiyor: bazı konularda fikirlerle uğraşmaktan hoşlanırken bazılarında somut ve pratik şeyleri tercih edebiliyor. Bu boyut zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir.',
      ),
      low: t(
        'Somut ve pratik',
        'Soyut fikirlerin ilgini pek çekmediğini ve onları anlamakta zaman zaman zorlandığını söylüyorsun; hayal gücünün de pek güçlü olmadığını düşünüyorsun. Bu boyut zekâyı ölçmez; kendini nasıl gördüğünü gösterir. İnsanların ilgisi farklı yerlerde yoğunlaşır; senin neyle uğraşmaktan keyif aldığını fark etmek de değerlidir.',
        'Çocuğunuz soyut fikirlerin ilgisini pek çekmediğini ve onları anlamakta zaman zaman zorlandığını belirtiyor; hayal gücünün de pek güçlü olmadığını düşünüyor. Bu boyut zekâyı ölçmez; çocuğunuzun kendini nasıl gördüğünü gösterir. İnsanların ilgisi farklı yerlerde yoğunlaşır; onun neyle uğraşmaktan keyif aldığını fark etmek, ilgisini desteklemenin iyi bir yoludur.',
      ),
    },
  },
};
