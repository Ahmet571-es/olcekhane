import type { BandText, ReportTemplate } from './types';

/**
 * 16 Faktörlü Kişilik Profili rapor metinleri.
 * İlkeler (öteki kişilik testleriyle aynı): puanlar bir not değildir; yüksek ya da düşük puan tek başına iyi ya da kötü
 * anlamına gelmez, her düzeyin işe yarayan ve dikkat edilecek yanları vardır. Etiketleme yapılmaz; sonuç öz bildirime
 * dayandığı için öğrenciye "Genel olarak ... söylüyorsun", veliye "Çocuğunuz genel olarak ... belirtiyor" dili
 * kullanılır. Metinler ölçeğin cümlelerinin söylediğinin ötesine geçmez. Değer yüklü uçlar (kurallara bağlılık düşük,
 * temkinlilik ve gerginlik yüksek gibi) suçlamadan, küçük ve uygulanabilir bir öneriyle anlatılır.
 * Düşünsel özgüven metinlerinin üçü de bu ölçeğin zekâyı ölçmediğini söyler.
 * Destek kutusu: Duygusal denge düşük ve Endişeye yatkınlık yüksek düzeydeyse gösterilir (öteki kişilik testlerindeki
 * Duygusal Denge ve kaygı alt özellikleriyle aynı). Bu iki metnin yetişkin sürümü "güvendiğin bir yetişkin" yerine
 * "güvendiğin biri ya da bir ruh sağlığı uzmanı" der; öteki metinler okula ya da ergenliğe özgü sözcük içermez ve
 * yetişkin raporunda da kullanılır.
 * Öneri listeleri (kapsamlı rapor için) bu testte yazılmadı; basit raporda gösterilmez. Veliye yaklaşım önerileri
 * gelişim yol haritasındadır.
 * Ölçekler raporun her yerinde "özellik" diye anılır: genel bakış, sonuç kartlarının başlığı (`itemsTitle`: "Özellikler")
 * ve yol haritası (`unit`). Genel bakışın açıklaması varsayılan grafik notunun yerine geçtiği için kırmızı işaretin
 * puanı gösterdiğini de söyler.
 */
const t = (summary: string, student: string, parent: string, extra?: { support?: boolean; adult?: string }): BandText => ({
  summary,
  student,
  parent,
  tipsStudent: [],
  tipsParent: [],
  ...(extra?.adult ? { adult: extra.adult } : {}),
  ...(extra?.support ? { support: true } : {}),
});

export const onAltiFaktorKisilikReport: ReportTemplate = {
  version: '16-faktorlu-kisilik-rapor-1',
  bandLabels: {
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
  },
  overview: {
    student:
      'Her satır bir özelliği gösteriyor; 16 özellik ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar bir not değildir: yüksek ya da düşük olması tek başına iyi ya da kötü anlamına gelmez; her düzeyin işe yarayan ve dikkat edilecek yanları vardır. Her özellik 7–13 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir özelliğe bakarak kesin sonuç çıkarma. Kırmızı işaret senin puanın.',
    parent:
      'Her satır bir özelliği gösterir; 16 özellik ayrı ayrı puanlanır, toplam bir puan yoktur. Puanlar bir not değildir: yüksek ya da düşük olması tek başına iyi ya da kötü anlamına gelmez; her düzeyin işe yarayan ve dikkat edilecek yanları vardır. Her özellik 7–13 cümleyle ölçüldüğü için sonuçlar yaklaşıktır; tek bir özelliğe bakarak kesin sonuç çıkarılmamalıdır. Kırmızı işaret puanı gösterir.',
  },
  itemsTitle: 'Özellikler',
  scales: {
    warmth: {
      high: t(
        'İnsanlarla sıcak ve ilgili',
        'Genel olarak insanlarla ilgilendiğini, başkalarının ne hissettiğini anladığını ve onları rahatlatmayı, moralini yükseltmeyi bildiğini söylüyorsun. Bu sıcaklık, insanların sana güvenmesini ve yakın ilişkiler kurmanı kolaylaştırabilir. Başkalarına zaman ayırırken kendine de zaman bırakmayı unutma.',
        'Çocuğunuz genel olarak insanlarla ilgilendiğini, başkalarının ne hissettiğini anladığını ve onları rahatlatmayı, moralini yükseltmeyi bildiğini belirtiyor. Bu sıcaklık, yakın ve güvene dayalı ilişkiler kurmasını kolaylaştırabilir.',
      ),
      average: t(
        'İlgisini duruma göre gösteren',
        'İnsanlarla çoğu zaman ilgilendiğini, ama her durumda başkalarının sorunlarının içine girmediğini söylüyorsun. Kime ve ne zaman vakit ayıracağını duruma göre seçiyor olabilirsin.',
        'Çocuğunuz insanlarla çoğu zaman ilgilendiğini, ama her durumda başkalarının sorunlarının içine girmediğini belirtiyor.',
      ),
      low: t(
        'Başkalarına mesafeli',
        'Genel olarak başkalarının sorunlarıyla ve hayatlarıyla pek ilgilenmediğini, insanlara biraz mesafeli durduğunu söylüyorsun. Herkes yakınlığını aynı biçimde göstermez; yine de zaman zaman yakın birine nasıl olduğunu sormak, aranızdaki bağı güçlendirebilir.',
        'Çocuğunuz genel olarak başkalarının sorunlarıyla ve hayatlarıyla pek ilgilenmediğini, insanlara biraz mesafeli durduğunu belirtiyor. Bu, ilgisini daha sessiz ve kendine özgü yollarla gösterdiği anlamına da gelebilir; yakınlarına ilgi gösterdiği anları fark etmeniz ona iyi gelebilir.',
      ),
    },
    intellect: {
      high: t(
        'Düşünme becerisine güvenen',
        'Genel olarak çabuk öğrendiğini, olayları çözümlemeyi sevdiğini ve bir işe girişmeden önce artılarını ve eksilerini tarttığını söylüyorsun. Düşünme becerine duyduğun bu güven, yeni ve zor konuların üstüne gitmeni kolaylaştırabilir. Bu ölçek zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz genel olarak çabuk öğrendiğini, olayları çözümlemeyi sevdiğini ve bir işe girişmeden önce artılarını ve eksilerini tarttığını belirtiyor. Bu ölçek zekâyı ölçmez; çocuğunuzun düşünme ve öğrenme konusunda kendini nasıl gördüğünü gösterir.',
      ),
      average: t(
        'Düşünme becerisine çoğu zaman güvenen',
        'Bazı konularda çabuk öğrendiğini ve iyi düşündüğünü, bazılarında ise kafanın karışabildiğini söylüyorsun. Bu ölçek zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
        'Çocuğunuz bazı konularda çabuk öğrendiğini ve iyi düşündüğünü, bazılarında ise kafasının karışabildiğini belirtiyor. Bu ölçek zekâyı ölçmez; kendini nasıl gördüğünü gösterir.',
      ),
      low: t(
        'Düşünme becerisine pek güvenmeyen',
        'Genel olarak kafanın kolayca karışabildiğini, kendini bu konuda sıradan biri olarak gördüğünü ve okurken zor kelimeleri atlayıp geçtiğini söylüyorsun. Bu ölçek zekâyı ölçmez; kendine bakışını gösterir. Bir konuyu anlamak çoğu zaman vakit ve çaba ister: zorlandığın bir konuyu küçük parçalara bölüp her birini kendi cümlelerinle anlatmaya çalışmak, ne kadar ilerlediğini görmeni sağlayabilir.',
        'Çocuğunuz genel olarak kafasının kolayca karışabildiğini, kendini bu konuda sıradan biri olarak gördüğünü ve okurken zor kelimeleri atlayıp geçtiğini belirtiyor. Bu ölçek zekâyı ölçmez; çocuğunuzun kendine bakışını gösterir. Zorlandığı bir konuyu küçük parçalara bölmesine ve ilerlediği adımları fark etmesine yardım etmek, öğrenme gücüne duyduğu güveni artırabilir.',
      ),
    },
    emotional_stability: {
      high: t(
        'Sakin ve kendiyle barışık',
        'Genel olarak çoğu zaman sakin olduğunu, kendinle barışık hissettiğini ve aksiliklerden sonra kolayca toparlandığını söylüyorsun. Bu denge, zor ve stresli dönemlerde sana güç verebilir.',
        'Çocuğunuz genel olarak çoğu zaman sakin olduğunu, kendisiyle barışık hissettiğini ve aksiliklerden sonra kolayca toparlandığını belirtiyor. Bu denge, zor ve stresli dönemlerde ona güç verebilir.',
      ),
      average: t(
        'Çoğu zaman dengeli',
        'Çoğu zaman dengeli olduğunu, bazı dönemlerde ise moralinin bozulabildiğini ya da aksiliklerden etkilenebildiğini söylüyorsun. Bu, çoğu insan için olağan bir durum.',
        'Çocuğunuz çoğu zaman dengeli olduğunu, bazı dönemlerde ise moralinin bozulabildiğini ya da aksiliklerden etkilenebildiğini belirtiyor. Bu, çoğu genç için olağan bir durumdur.',
      ),
      low: t(
        'Duyguları sık sık iniş çıkış yapan',
        'Genel olarak duygularının sık sık iniş çıkış yaptığını, kendini zaman zaman hüzünlü ya da çaresiz hissettiğini ve aksiliklerden sonra toparlanmakta zorlandığını söylüyorsun. Bu duygularla tek başına baş etmek zorunda değilsin; seni zorluyorsa güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz genel olarak duygularının sık sık iniş çıkış yaptığını, kendini zaman zaman hüzünlü ya da çaresiz hissettiğini ve aksiliklerden sonra toparlanmakta zorlandığını belirtiyor. Bu sonuç bir tanı değildir; ancak bu duyguların ne kadar süredir devam ettiğini ve günlük hayatını ne kadar etkilediğini onunla sakin bir anda konuşmanız önemlidir.',
        {
          support: true,
          adult:
            'Genel olarak duygularının sık sık iniş çıkış yaptığını, kendini zaman zaman hüzünlü ya da çaresiz hissettiğini ve aksiliklerden sonra toparlanmakta zorlandığını söylüyorsun. Bu duygularla tek başına baş etmek zorunda değilsin; seni zorluyorsa güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
    },
    assertiveness: {
      high: t(
        'Sözünü söyleyen ve yön veren',
        'Genel olarak düşündüğünü açıkça söylediğini, gerektiğinde itiraz edip eleştiri yapabildiğini ve işlerin başına geçmekten hoşlandığını söylüyorsun. Bu atılganlık, ortak bir işi yürütmeni ve kendini savunmanı kolaylaştırabilir. Başkalarının fikirlerine de yer açmak, sözünün daha iyi duyulmasını sağlar.',
        'Çocuğunuz genel olarak düşündüğünü açıkça söylediğini, gerektiğinde itiraz edip eleştiri yapabildiğini ve işlerin başına geçmekten hoşlandığını belirtiyor. Bu, ortak işleri yürütmesini ve kendini savunmasını kolaylaştırabilir.',
      ),
      average: t(
        'Duruma göre öne çıkan',
        'Bazı durumlarda sözünü söyleyip işlerin başına geçtiğini, bazılarında ise kararları başkalarına bırakmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda sözünü söyleyip işlerin başına geçtiğini, bazılarında ise kararları başkalarına bırakmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Kararları başkalarına bırakan',
        'Genel olarak yolu başkalarının göstermesini beklediğini, kararları onlara bıraktığını ve itiraz etmekte zorlandığını söylüyorsun. Uyumlu olmak birlikte çalışmayı kolaylaştırır; yine de senin için önemli bir konuda ne düşündüğünü sakin ve kısa bir cümleyle söylemek, sesinin duyulmasını sağlayabilir.',
        'Çocuğunuz genel olarak yolu başkalarının göstermesini beklediğini, kararları onlara bıraktığını ve itiraz etmekte zorlandığını belirtiyor. Görüşünü söylediği küçük anları fark etmeniz, kendini ifade etme cesaretini destekleyebilir.',
      ),
    },
    gregariousness: {
      high: t(
        'Şakacı ve hareketli',
        'Genel olarak çok şaka yaptığını, arkadaşlarını eğlendirdiğini ve kalabalık, hareketli ortamlardan hoşlandığını söylüyorsun. Bu neşe, bulunduğun ortama enerji katabilir. Odaklanman gereken işlerde dikkatini dağıtan şeyleri bir süreliğine uzaklaştırmak işine yarayabilir.',
        'Çocuğunuz genel olarak çok şaka yaptığını, arkadaşlarını eğlendirdiğini ve kalabalık, hareketli ortamlardan hoşlandığını belirtiyor. Bu neşe, bulunduğu ortama enerji katabilir.',
      ),
      average: t(
        'Duruma göre neşeli',
        'Bazen şakacı ve hareketli, bazen de sakin ve ciddi olduğunu söylüyorsun; kalabalık ortamları da sessiz ortamları da duruma göre sevebilirsin.',
        'Çocuğunuz bazen şakacı ve hareketli, bazen de sakin ve ciddi olduğunu belirtiyor.',
      ),
      low: t(
        'Sessiz ve ölçülü',
        'Genel olarak pek şaka yapmadığını, kalabalık ve gürültülü ortamlardan hoşlanmadığını, daha sessiz ve ciddi olduğunu söylüyorsun. Bu ölçülülük, dikkat ve özen gerektiren işlerde sana yardım edebilir. Sevdiğin insanlarla sakin ortamlarda vakit geçirmek hem sana iyi gelir hem de ilişkilerini besler.',
        'Çocuğunuz genel olarak pek şaka yapmadığını, kalabalık ve gürültülü ortamlardan hoşlanmadığını, daha sessiz ve ciddi olduğunu belirtiyor. Bu ölçülülük, dikkat ve özen gerektiren işlerde ona yardım edebilir; kalabalık ortamlara katılması için onu zorlamamak önemlidir.',
      ),
    },
    dutifulness: {
      high: t(
        'Kurallara bağlı',
        'Genel olarak kurallara uymaya çalıştığını, otoriteye saygı duyduğunu ve kuralları çiğnemekten kaçındığını söylüyorsun. Bu tutum, insanların sana güvenmesini ve ortak işlerin düzenli yürümesini kolaylaştırabilir. Bir kuralın neden konduğunu anlamaya çalışmak, değişen durumlara uyum sağlamanı da kolaylaştırır.',
        'Çocuğunuz genel olarak kurallara uymaya çalıştığını, otoriteye saygı duyduğunu ve kuralları çiğnemekten kaçındığını belirtiyor. Bu tutum, sorumluluk gerektiren işlerde ona güvenilmesini kolaylaştırabilir.',
      ),
      average: t(
        'Kurallara çoğu zaman uyan',
        'Kurallara çoğu zaman uyduğunu, ama bazen bazı kuralları sorguladığını ya da esnettiğini söylüyorsun.',
        'Çocuğunuz kurallara çoğu zaman uyduğunu, ama bazen bazı kuralları sorguladığını ya da esnettiğini belirtiyor.',
      ),
      low: t(
        'Kuralları sorgulayan',
        'Genel olarak kurallara ve otoriteye karşı çıkabildiğini, kuralları esnetmeyi ya da açığını bulmayı bildiğini söylüyorsun. Kuralları sorgulamak bağımsız düşünmenin bir parçası olabilir; yine de bir kurala uymamanın sana ve başkalarına neye mal olabileceğini önceden düşünmek, seçimini bilerek yapmanı sağlar.',
        'Çocuğunuz genel olarak kurallara ve otoriteye karşı çıkabildiğini, kuralları esnetmeyi ya da açığını bulmayı bildiğini belirtiyor. Kuralları sorgulamak bağımsız düşünmenin bir parçası olabilir; evdeki kuralların gerekçelerini onunla konuşmak ve bazı kuralları birlikte belirlemek, kurallara uymayı kolaylaştırabilir.',
      ),
    },
    friendliness: {
      high: t(
        'İnsanların arasında rahat',
        'Genel olarak insanların arasında rahat olduğunu, kolayca sohbet başlatıp arkadaş edindiğini ve ilgi odağı olmaktan çekinmediğini söylüyorsun. Bu rahatlık, yeni ortamlara uyum sağlamanı ve insanlarla tanışmanı kolaylaştırabilir.',
        'Çocuğunuz genel olarak insanların arasında rahat olduğunu, kolayca sohbet başlatıp arkadaş edindiğini ve ilgi odağı olmaktan çekinmediğini belirtiyor. Bu rahatlık, yeni ortamlara uyum sağlamasını kolaylaştırabilir.',
      ),
      average: t(
        'Duruma göre rahat',
        'Bazı durumlarda insanların arasında rahat olduğunu, bazılarında ise geri planda kalmayı tercih ettiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda insanların arasında rahat olduğunu, bazılarında ise geri planda kalmayı tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Yeni insanlarla tanışırken çekingen',
        'Genel olarak yeni insanlarla tanışırken ve kalabalıkta çekingen olduğunu, sohbet başlatmakta zorlandığını ve geri planda kalmayı tercih ettiğini söylüyorsun. Çekingenlik bir kusur değildir; insanlarla ilişkiler zamanla ve küçük adımlarla kolaylaşır. Tanıdığın birinin yanındayken yeni biriyle kısa bir sohbet başlatmayı denemek iyi bir adım olabilir.',
        'Çocuğunuz genel olarak yeni insanlarla tanışırken ve kalabalıkta çekingen olduğunu, sohbet başlatmakta zorlandığını ve geri planda kalmayı tercih ettiğini belirtiyor. Onu kalabalık ortamlara itmek yerine, ilgi duyduğu konularda küçük ve tanıdık gruplarda bulunmasına fırsat vermek kendini rahat hissetmesine yardım edebilir.',
      ),
    },
    sensitivity: {
      high: t(
        'İnce duygulu, sanattan etkilenen',
        'Genel olarak kitap okumayı, filmler ve kitaplar üzerine konuşmayı sevdiğini, şiirden ve sanattan etkilendiğini ve duygusal tepkilerini fark ettiğini söylüyorsun. Bu duyarlılık, insanları ve olayları farklı açılardan görmeni sağlayabilir.',
        'Çocuğunuz genel olarak kitap okumayı, filmler ve kitaplar üzerine konuşmayı sevdiğini, şiirden ve sanattan etkilendiğini ve duygusal tepkilerini fark ettiğini belirtiyor. Bu duyarlılık, insanları ve olayları farklı açılardan görmesini sağlayabilir.',
      ),
      average: t(
        'Duruma göre etkilenen',
        'Kitaplardan, filmlerden ve sanattan bazen etkilendiğini, bazen de pek ilgilenmediğini söylüyorsun; ilgin türe ve konuya göre değişebilir.',
        'Çocuğunuz kitaplardan, filmlerden ve sanattan bazen etkilendiğini, bazen de pek ilgilenmediğini belirtiyor.',
      ),
      low: t(
        'Sanattan ve edebiyattan pek etkilenmeyen',
        'Genel olarak şiir, roman ya da dans gösterisi gibi sanat ve edebiyat türlerinden pek hoşlanmadığını ve duygusal tepkilerinin üzerinde pek durmadığını söylüyorsun. İlgin daha çok başka alanlarda olabilir. Sevdiğin bir konuyu anlatan bir kitap ya da film seçmek, okumayı ve izlemeyi daha keyifli hâle getirebilir.',
        'Çocuğunuz genel olarak şiir, roman ya da dans gösterisi gibi sanat ve edebiyat türlerinden pek hoşlanmadığını ve duygusal tepkilerinin üzerinde pek durmadığını belirtiyor. İlgi duyduğu bir konuyu (spor, bilim ya da teknoloji gibi) anlatan kitapları ve filmleri önermek, okumayı ona daha çekici kılabilir.',
      ),
    },
    distrust: {
      high: t(
        'İnsanlara karşı temkinli',
        'Genel olarak insanların niyetlerinden kolayca kuşkulandığını, kolay kolay güvenmediğini ve affetmekte zorlandığını söylüyorsun. Temkinli olmak seni bazı hayal kırıklıklarından koruyabilir; yine de herkesi aynı ölçüyle değerlendirmemek ve güvenini zamanla hak eden insanlara fırsat vermek ilişkilerini güçlendirebilir.',
        'Çocuğunuz genel olarak insanların niyetlerinden kolayca kuşkulandığını, kolay kolay güvenmediğini ve affetmekte zorlandığını belirtiyor. İlişkilerinde onu neyin zorladığını yargılamadan dinlemek, hangi durumlarda güvendiğini anlamanıza yardım edebilir.',
      ),
      average: t(
        'Duruma göre güvenen',
        'İnsanlara çoğu zaman güvendiğini, ama bazı durumlarda ve bazı insanlara karşı temkinli davrandığını söylüyorsun.',
        'Çocuğunuz insanlara çoğu zaman güvendiğini, ama bazı durumlarda ve bazı insanlara karşı temkinli davrandığını belirtiyor.',
      ),
      low: t(
        'İnsanlara kolayca güvenen',
        'Genel olarak insanların iyi niyetli olduğuna inandığını, onların söylediklerine güvendiğini ve kolayca affedebildiğini söylüyorsun. Bu güven, insanlarla sıcak ilişkiler kurmanı kolaylaştırabilir. Yeni tanıdığın birine kişisel bilgilerini ya da önemli bir şeyini emanet etmeden önce biraz beklemek, bu güveni korumanın da bir yoludur.',
        'Çocuğunuz genel olarak insanların iyi niyetli olduğuna inandığını, onların söylediklerine güvendiğini ve kolayca affedebildiğini belirtiyor. Bu güven ilişkilerinde ona kolaylık sağlar; internette ve yeni tanıştığı kişilerle kişisel bilgilerini paylaşırken dikkatli olmayı onunla konuşabilirsiniz.',
      ),
    },
    imagination: {
      high: t(
        'Hayallere dalan, sıra dışı',
        'Genel olarak hayal kurmayı ve düşüncelere dalıp gitmeyi sevdiğini, alışılmışın dışında davranabildiğini ve çoğunluktan farklı görüşleri savunmaktan çekinmediğini söylüyorsun. Bu, yaratıcı fikirler üretmeni kolaylaştırabilir. Dikkat gerektiren işlerde aklının başka yerlere kaydığını fark edersen kısa notlar alarak fikirlerini sonraya saklayabilirsin.',
        'Çocuğunuz genel olarak hayal kurmayı ve düşüncelere dalıp gitmeyi sevdiğini, alışılmışın dışında davranabildiğini ve çoğunluktan farklı görüşleri savunmaktan çekinmediğini belirtiyor. Bu, yaratıcı fikirler üretmesini kolaylaştırabilir.',
      ),
      average: t(
        'Hayal ile gerçek arasında dengeli',
        'Zaman zaman hayallere daldığını ve farklı şeyler denediğini, çoğu zaman ise işleri alışılmış yoldan yaptığını söylüyorsun.',
        'Çocuğunuz zaman zaman hayallere daldığını ve farklı şeyler denediğini, çoğu zaman ise işleri alışılmış yoldan yaptığını belirtiyor.',
      ),
      low: t(
        'Ayakları yere basan',
        'Genel olarak pek hayal kurmadığını, düşüncelere dalıp gitmediğini ve işleri usulüne uygun yapmayı tercih ettiğini söylüyorsun. Bu gerçekçi bakış, adımları net işlerde ve ayrıntıya dikkat gerektiren durumlarda sana yardım edebilir. Zaman zaman bir işi farklı bir yoldan yapmayı denemek, yeni şeyler fark etmeni sağlayabilir.',
        'Çocuğunuz genel olarak pek hayal kurmadığını, düşüncelere dalıp gitmediğini ve işleri usulüne uygun yapmayı tercih ettiğini belirtiyor. Bu gerçekçi bakış, adımları net işlerde ona yardım edebilir.',
      ),
    },
    reserve: {
      high: t(
        'Duygularını kendine saklayan',
        'Genel olarak kendinden pek söz etmediğini, düşüncelerini ve duygularını kendine sakladığını ve seni tanımanın zaman aldığını söylüyorsun. Özel hayatını korumak doğal bir ihtiyaçtır; yine de zor bir şey yaşadığında bunu güvendiğin biriyle paylaşmak yükünü hafifletebilir.',
        'Çocuğunuz genel olarak kendinden pek söz etmediğini, düşüncelerini ve duygularını kendine sakladığını belirtiyor. Özel alanına saygı göstermek ve konuşmak istediğinde yanında olduğunuzu hissettirmek, size açılmasını kolaylaştırabilir.',
      ),
      average: t(
        'Duruma göre açılan',
        'Kendini bazı insanlara açtığını, bazılarına ise pek bir şey anlatmadığını söylüyorsun; kime ne kadar açılacağını seçiyor olabilirsin.',
        'Çocuğunuz kendini bazı insanlara açtığını, bazılarına ise pek bir şey anlatmadığını belirtiyor.',
      ),
      low: t(
        'Kendini kolayca açan',
        'Genel olarak kendinden, düşüncelerinden ve duygularından açıkça söz ettiğini söylüyorsun. Bu açıklık, insanların seni tanımasını ve sana yakınlık duymasını kolaylaştırabilir. Çok özel düşüncelerini paylaşacağın kişileri seçerken biraz zaman tanımak, bu açıklığı korumana yardım eder.',
        'Çocuğunuz genel olarak kendinden, düşüncelerinden ve duygularından açıkça söz ettiğini belirtiyor. Bu açıklık yakınlık kurmasını kolaylaştırabilir; çok özel şeyleri, özellikle internette, kimlerle paylaştığını onunla konuşabilirsiniz.',
      ),
    },
    anxiety: {
      high: t(
        'Kolayca endişelenen',
        'Genel olarak birçok şey için endişelendiğini, yanlış bir şey yapmaktan korktuğunu, geçmişteki hatalarını düşündüğünü ve kolayca kırılabildiğini söylüyorsun. Endişe çoğu insanın yaşadığı bir duygudur ve onunla baş etmeyi öğrenmek mümkündür; seni çok zorluyorsa güvendiğin bir yetişkinle konuşmak iyi gelir.',
        'Çocuğunuz genel olarak birçok şey için endişelendiğini, yanlış bir şey yapmaktan korktuğunu, geçmişteki hatalarını düşündüğünü ve kolayca kırılabildiğini belirtiyor. Bu sonuç bir tanı değildir. Onu en çok neyin endişelendirdiğini küçümsemeden dinleyin; endişeleri uzun süredir sürüyor ve günlük hayatını zorluyorsa destek almayı birlikte düşünebilirsiniz.',
        {
          support: true,
          adult:
            'Genel olarak birçok şey için endişelendiğini, yanlış bir şey yapmaktan korktuğunu, geçmişteki hatalarını düşündüğünü ve kolayca kırılabildiğini söylüyorsun. Endişe çoğu insanın yaşadığı bir duygudur ve onunla baş etmeyi öğrenmek mümkündür; seni çok zorluyorsa güvendiğin biriyle ya da bir ruh sağlığı uzmanıyla konuşmak iyi gelir.',
        },
      ),
      average: t(
        'Zaman zaman endişelenen',
        'Bazı konularda endişelendiğini ya da kırılabildiğini, çoğu zaman ise bunları fazla kafana takmadığını söylüyorsun. Bu, çoğu insan için olağan bir durum.',
        'Çocuğunuz bazı konularda endişelendiğini ya da kırılabildiğini, çoğu zaman ise bunları fazla kafasına takmadığını belirtiyor.',
      ),
      low: t(
        'Kolay kolay endişelenmeyen',
        'Genel olarak olup bitmiş şeyleri dert etmediğini, bir şeyleri kolay kolay kafana takmadığını ve başkalarının cesaretini kırmasına izin vermediğini söylüyorsun. Bu rahatlık, baskı altında soğukkanlı kalmana yardım edebilir. Önemli bir işten önce neyin ters gidebileceğini kısaca düşünmek, bu rahatlığı dikkatle birleştirmeni sağlar.',
        'Çocuğunuz genel olarak olup bitmiş şeyleri dert etmediğini, bir şeyleri kolay kolay kafasına takmadığını ve başkalarının cesaretini kırmasına izin vermediğini belirtiyor. Bu rahatlık, baskı altında soğukkanlı kalmasına yardım edebilir.',
      ),
    },
    complexity: {
      high: t(
        'Yeni fikirlere açık',
        'Genel olarak yeni fikirler duymaktan, soyut ve felsefi konular üzerine düşünmekten, işleri yeni yollarla yapmaktan ve çeşitlilikten hoşlandığını söylüyorsun. Bu açıklık, değişen durumlara uyum sağlamanı ve sorunlara farklı çözümler bulmanı kolaylaştırabilir.',
        'Çocuğunuz genel olarak yeni fikirler duymaktan, soyut ve felsefi konular üzerine düşünmekten, işleri yeni yollarla yapmaktan ve çeşitlilikten hoşlandığını belirtiyor. Bu açıklık, değişen durumlara uyum sağlamasını kolaylaştırabilir.',
      ),
      average: t(
        'Yeniye de alışılmışa da açık',
        'Yeni fikirlere ve değişikliğe çoğu zaman açık olduğunu, bazı konularda ise alışılmış ve denenmiş yolları tercih ettiğini söylüyorsun.',
        'Çocuğunuz yeni fikirlere ve değişikliğe çoğu zaman açık olduğunu, bazı konularda ise alışılmış ve denenmiş yolları tercih ettiğini belirtiyor.',
      ),
      low: t(
        'Alışılmış yolları seven',
        'Genel olarak soyut ve kuramsal tartışmalardan pek hoşlanmadığını, alışılmış yolları değişikliğe tercih ettiğini söylüyorsun. Bu, işe yarar ve uygulanabilir sonuçlara odaklanmana yardım edebilir. Bir konunun günlük hayatta nerede işe yaradığını sormak, soyut konuları da daha anlamlı hâle getirebilir.',
        'Çocuğunuz genel olarak soyut ve kuramsal tartışmalardan pek hoşlanmadığını, alışılmış yolları değişikliğe tercih ettiğini belirtiyor. Öğrendiği konuların günlük hayatta nerede işe yaradığını birlikte konuşmak ilgisini artırabilir.',
      ),
    },
    introversion: {
      high: t(
        'Kendi başına olmayı seven',
        'Genel olarak tek başına vakit geçirmekten, sessizlikten ve işleri kendi başına yapmaktan hoşlandığını söylüyorsun. Kendi başına kalabilmek, derinlemesine düşünmeni ve kendi işini kendin yürütmeni kolaylaştırabilir. Ortak işlerde kendi payına düşeni önce tek başına hazırlayıp sonra gruba katılmak sana uygun bir yol olabilir.',
        'Çocuğunuz genel olarak tek başına vakit geçirmekten, sessizlikten ve işleri kendi başına yapmaktan hoşlandığını belirtiyor. Kendine ait sakin bir zaman ve alan istemesi doğaldır; bu ihtiyaca saygı göstermek ona iyi gelebilir.',
      ),
      average: t(
        'Hem yalnız hem birlikte rahat',
        'Bazen tek başına kalmaktan, bazen de bir grubun içinde olmaktan hoşlandığını söylüyorsun; işe ve ruh hâline göre ikisini de seçebiliyorsun.',
        'Çocuğunuz bazen tek başına kalmaktan, bazen de bir grubun içinde olmaktan hoşlandığını belirtiyor.',
      ),
      low: t(
        'Grubun içinde olmayı seven',
        'Genel olarak bir grubun parçası olmaktan ve takım çalışmasından hoşlandığını, yanında birileri olmadan pek rahat edemediğini söylüyorsun. Bu, ortak işlerde uyum içinde çalışmanı kolaylaştırabilir. Tek başına yapman gereken işlerde kısa hedefler koymak ve ardından biriyle konuşacağın bir zaman ayırmak işini kolaylaştırabilir.',
        'Çocuğunuz genel olarak bir grubun parçası olmaktan ve takım çalışmasından hoşlandığını, yanında birileri olmadan pek rahat edemediğini belirtiyor. Bu, ortak işlerde uyum içinde çalışmasını kolaylaştırabilir.',
      ),
    },
    orderliness: {
      high: t(
        'Düzenli ve titiz',
        'Genel olarak düzeni sevdiğini, işleri hemen ve eksiksiz yapmaya çalıştığını ve her şey yerli yerinde olana kadar uğraştığını söylüyorsun. Bu titizlik, özen gerektiren işlerde işine yarayabilir. Her işin kusursuz olması gerekmediğini hatırlamak, zamanını ve enerjini korumana yardım edebilir.',
        'Çocuğunuz genel olarak düzeni sevdiğini, işleri hemen ve eksiksiz yapmaya çalıştığını ve her şey yerli yerinde olana kadar uğraştığını belirtiyor. Bu titizlik, özen gerektiren işlerde ona yardımcı olabilir.',
      ),
      average: t(
        'Gerektiğinde düzenli',
        'Bazı işlerde düzenli ve titiz olduğunu, bazılarında ise dağınıklığa ve ertelemeye göz yumduğunu söylüyorsun.',
        'Çocuğunuz bazı işlerde düzenli ve titiz olduğunu, bazılarında ise dağınıklığa ve ertelemeye göz yumduğunu belirtiyor.',
      ),
      low: t(
        'Esnek ve rahat',
        'Genel olarak dağınıklığın seni pek rahatsız etmediğini, eşyalarını ortada bırakabildiğini ve hoşuna gitmeyen işleri ertelediğini söylüyorsun. Bu rahatlık, değişen planlara kolay uyum sağlamana yardım edebilir. Gün sonunda eşyalarını yerleştirmeye beş dakika ayırmak, aradığını kolay bulmanı sağlar.',
        'Çocuğunuz genel olarak dağınıklığın onu pek rahatsız etmediğini, eşyalarını ortada bırakabildiğini ve hoşuna gitmeyen işleri ertelediğini belirtiyor. Bu rahatlık, değişen planlara kolay uyum sağlamasına yardım edebilir.',
      ),
    },
    emotionality: {
      high: t(
        'Çabuk sinirlenen',
        'Genel olarak sinirinin çabuk bozulduğunu, başkalarının hatalarına ve sana itiraz edilmesine katlanmakta zorlandığını ve insanları hemen yargılayabildiğini söylüyorsun. Bu, işlerin doğru yapılmasını önemsemenden de kaynaklanabilir. Sinirlendiğini fark ettiğin anda olaya bir de karşındakinin gözünden bakmaya çalışmak işine yarayabilir.',
        'Çocuğunuz genel olarak sinirinin çabuk bozulduğunu, başkalarının hatalarına ve kendisine itiraz edilmesine katlanmakta zorlandığını ve insanları hemen yargılayabildiğini belirtiyor. Sakin bir anda, onu en çok neyin sinirlendirdiğini ve o anlarda neyin işe yaradığını birlikte konuşmak yardımcı olabilir.',
      ),
      average: t(
        'Zaman zaman sinirlenen',
        'Bazı durumlarda sinirinin bozulabildiğini, çoğu zaman ise sakin ve hoşgörülü kalabildiğini söylüyorsun.',
        'Çocuğunuz bazı durumlarda sinirinin bozulabildiğini, çoğu zaman ise sakin ve hoşgörülü kalabildiğini belirtiyor.',
      ),
      low: t(
        'Sakin ve hoşgörülü',
        'Genel olarak kolay kolay sinirlenmediğini, başkalarının hatalarını affedip unutmaya çalıştığını ve herkes hakkında söyleyecek iyi bir sözün olduğunu söylüyorsun. Bu hoşgörü, insanlarla iyi geçinmeni kolaylaştırabilir. Seni gerçekten rahatsız eden bir durumu sakin bir dille söylemek de hoşgörünün bir parçasıdır.',
        'Çocuğunuz genel olarak kolay kolay sinirlenmediğini, başkalarının hatalarını affedip unutmaya çalıştığını ve herkes hakkında söyleyecek iyi bir sözü olduğunu belirtiyor. Bu hoşgörü, ilişkilerinde ona kolaylık sağlar.',
      ),
    },
  },
};
