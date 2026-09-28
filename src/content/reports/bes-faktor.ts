import type { ReportTemplate } from './types';

/**
 * Beş Faktör Kişilik Profili rapor metinleri.
 * İlkeler: kişilik boyutlarında "iyi" ya da "kötü" uç yoktur; her tarzın güçlü yanı anlatılır.
 * Etiketleme yapılmaz ("içe dönük bir çocuk" yerine "sakin ortamları tercih ettiğini belirtiyor").
 * Sonuç öz bildirime dayandığı için veliye "çocuğunuz ... olduğunu belirtiyor" dili kullanılır.
 */
export const besFaktorReport: ReportTemplate = {
  version: 'bes-faktor-rapor-1',
  bandLabels: {
    very_low: 'Belirgin biçimde düşük',
    low: 'Düşük',
    average: 'Orta',
    high: 'Yüksek',
    very_high: 'Belirgin biçimde yüksek',
  },
  scales: {
    extraversion: {
      very_high: {
        summary: 'Çok sosyal ve enerjik',
        student:
          'Kendini çok sosyal ve enerjik biri olarak görüyorsun. Kalabalık ortamlar, yeni insanlar ve hareket seni canlandırıyor. Grup çalışmalarında ortamı canlandırman büyük bir güç.',
        parent:
          'Çocuğunuz kendini çok sosyal ve enerjik biri olarak tanımlıyor. İnsanlarla birlikteyken enerji topluyor ve grup etkinliklerinde öne çıkmaktan hoşlanıyor.',
        tipsStudent: [
          'Sessiz arkadaşlarına da söz hakkı bırakmayı dene; onların fikirleri seni şaşırtabilir.',
          'Tek başına çalışman gereken işler için kısa ve hareketli molalar planla.',
        ],
        tipsParent: [
          'Takım sporları, drama ya da münazara gibi sosyal etkinlikler bu enerjiye iyi bir alan açar.',
          'Tek başına ders çalışırken kısa sosyal molalar ya da bir arkadaşıyla birlikte çalışma saati motivasyonunu korumasına yardım edebilir.',
        ],
      },
      high: {
        summary: 'Sosyal ve rahat',
        student:
          'İnsanlarla vakit geçirmekten hoşlandığını ve sosyal ortamlarda rahat olduğunu söylüyorsun. Yeni arkadaşlıklar kurmak ve fikirlerini paylaşmak sana genellikle kolay geliyor.',
        parent:
          'Çocuğunuz sosyal ortamlarda rahat olduğunu ve insanlarla birlikte olmaktan hoşlandığını belirtiyor.',
        tipsStudent: [
          'Grup ödevlerinde sunum ya da koordinasyon gibi görevleri üstlenebilirsin.',
          'Dikkat gerektiren işleri sessiz ve sosyal ortamdan uzak bir yerde yapmayı dene.',
        ],
        tipsParent: [
          'Arkadaşlarıyla birlikte yapabileceği öğrenme etkinlikleri (çalışma grubu, kulüp) ona iyi gelebilir.',
          'Ders çalışma ortamındaki telefon ve sohbet gibi dikkat dağıtıcıları birlikte sınırlamayı konuşabilirsiniz.',
        ],
      },
      average: {
        summary: 'Dengeli',
        student:
          'Sosyal ortamlarla kendi başına kalmak arasında dengeli bir yerdesin. Duruma göre hem kalabalıktan hem de sakin anlardan keyif alabiliyorsun.',
        parent:
          'Çocuğunuz sosyal ortamlarla yalnız geçirilen zaman arasında dengeli bir tarz tanımlıyor; duruma göre uyum sağlayabiliyor.',
        tipsStudent: [
          'Hangi ortamda daha verimli olduğunu fark etmeye çalış: bazı işler grupla, bazıları yalnız daha iyi gider.',
          'Enerjin düştüğünde seni neyin yeniden canlandırdığını gözlemle: arkadaşlar mı, sessizlik mi?',
        ],
        tipsParent: [
          'Hem grup hem de bireysel etkinliklere yer açmak bu dengeyi destekler.',
          'Hangi ortamda daha iyi odaklandığını onunla birlikte keşfedin.',
        ],
      },
      low: {
        summary: 'Sakin, dinlemeyi seven',
        student:
          'Kalabalık yerine küçük gruplarda ya da tek başına olmayı tercih ettiğini söylüyorsun. Konuşmadan önce düşünmek ve dinlemek senin güçlü yanların.',
        parent:
          'Çocuğunuz sakin ortamları, küçük grupları ve dinlemeyi tercih ettiğini belirtiyor. Bu bir eksiklik değildir; derinlemesine düşünme ve dikkatli dinleme gibi güçlü yanlarla birlikte gelir.',
        tipsStudent: [
          'Sınıfta söz almak zor geliyorsa söyleyeceklerini önceden not almak işini kolaylaştırabilir.',
          'Sosyal etkinliklerden sonra kendine dinlenme zamanı ayırmak normal ve sağlıklı.',
        ],
        tipsParent: [
          'Onu kalabalık ortamlara zorlamak yerine ilgi duyduğu küçük grupları (atölye, kulüp) önerin.',
          'Sosyal bir etkinlikten sonra yalnız kalma ihtiyacına saygı gösterin.',
        ],
      },
      very_low: {
        summary: 'Çok sakin, kendi dünyasında',
        student:
          'Sessiz ve sakin ortamlarda kendini en iyi hissettiğini, kalabalıkta öne çıkmaktan kaçındığını söylüyorsun. Tek başına derinlemesine çalışabilmek senin için doğal bir güç.',
        parent:
          'Çocuğunuz kendini oldukça sakin ve içe dönük biri olarak tanımlıyor. Bu kişilik tarzı yaygındır; odaklanma ve dinleme gibi güçlü yanlarla birlikte gelir.',
        tipsStudent: [
          'Güvendiğin bir iki arkadaşla bağlarını güçlü tutmak yeterli ve değerli.',
          'Sunum gibi görevler zor geliyorsa küçük adımlarla pratik yap: önce bir arkadaşına, sonra küçük bir gruba anlat.',
        ],
        tipsParent: [
          'Birkaç yakın arkadaşlığı desteklemek, geniş bir sosyal çevreden daha önemlidir.',
          'Yalnızlık ya da insanlardan kaçınma çocuğunuzu üzüyorsa bunu okulun rehber öğretmeniyle konuşabilirsiniz.',
        ],
      },
    },
    agreeableness: {
      very_high: {
        summary: 'Çok şefkatli ve yardımsever',
        student:
          'Başkalarının duygularına çok önem veriyor, yardım etmekten mutluluk duyuyorsun. İnsanlar yanında kendilerini rahat hissediyor.',
        parent: 'Çocuğunuz başkalarının duygularına çok duyarlı ve yardımsever olduğunu belirtiyor.',
        tipsStudent: [
          'Başkalarına yardım ederken kendi ihtiyaçlarını da unutma; bazen "hayır" demek de bir iyiliktir.',
          'Arabuluculuk ve takım çalışması senin doğal alanın; bunu grup çalışmalarında kullan.',
        ],
        tipsParent: [
          'Bu duyarlılığı gönüllülük ya da akranlarına destek olabileceği etkinliklerle besleyebilirsiniz.',
          'Başkalarını memnun etmek için kendi isteklerinden vazgeçip geçmediğine dikkat edin; sınır koymayı birlikte konuşun.',
        ],
      },
      high: {
        summary: 'Anlayışlı ve uzlaşmacı',
        student:
          'İnsanlara karşı ilgili ve yardımseversin; tartışmalarda uzlaşma yolu aramaya eğilimlisin.',
        parent:
          'Çocuğunuz insanlarla yumuşak ve uyumlu ilişkiler kurduğunu, başkalarının duygularını önemsediğini belirtiyor.',
        tipsStudent: [
          'Farklı düşündüğünde bunu nazikçe ama açıkça söylemek de ilişkileri güçlendirir.',
          'Grup çalışmalarında herkesin katılmasını sağlayan kişi olabilirsin.',
        ],
        tipsParent: [
          'Kendi görüşünü savunmasını destekleyen konuşmalar yapın.',
          'Takım çalışması gerektiren etkinlikler ona uygun olabilir.',
        ],
      },
      average: {
        summary: 'Dengeli',
        student:
          'Hem başkalarını önemsiyor hem de gerektiğinde kendi görüşünü savunabiliyorsun. Bu denge ilişkilerde işine yarar.',
        parent:
          'Çocuğunuz başkalarını önemsemekle kendi görüşlerini savunmak arasında dengeli bir tarz tanımlıyor.',
        tipsStudent: [
          'Hangi durumlarda daha anlayışlı, hangilerinde daha kararlı olduğunu fark et.',
          'Bir tartışmada karşı tarafı dinlemek seni daha güçlü bir savunucu yapar.',
        ],
        tipsParent: [
          'Farklı görüşleri rahatça tartışabildiğiniz aile sohbetleri bu dengeyi güçlendirir.',
          'Hem empati hem kararlılık gerektiren durumlarda onu destekleyin.',
        ],
      },
      low: {
        summary: 'Doğrudan ve bağımsız',
        student:
          'Düşündüğünü açıkça söyleyen, kendi görüşünü savunan birisin. Kolay ikna olmaman eleştirel düşünme için bir güç.',
        parent:
          'Çocuğunuz doğrudan konuşan, kendi görüşünü savunan bir tarz tanımlıyor. Bu, eleştirel düşünme ve bağımsızlık için bir güçtür.',
        tipsStudent: [
          'Görüşlerini söylerken karşındakinin duygularını da hesaba katmak sözünün daha çok dinlenmesini sağlar.',
          'Bir arkadaşın sıkıntısını anlatırken önce dinlemeyi, sonra çözüm önermeyi dene.',
        ],
        tipsParent: [
          'Empatiyi, karakterlerin duygularını konuştuğunuz kitaplar ve filmler üzerinden destekleyebilirsiniz.',
          'Tartışmalarda hem kendi görüşünü hem de karşı tarafın bakışını ifade etmesini isteyin.',
        ],
      },
      very_low: {
        summary: 'Kendi yolunu izleyen',
        student:
          'Başkalarının ne düşündüğünden çok kendi yoluna odaklandığını söylüyorsun. Bağımsız düşünmek bir güç; ilişkilerde karşındakinin duygularını fark etmek ise işini kolaylaştırır.',
        parent:
          'Çocuğunuz başkalarının ihtiyaçlarına pek odaklanmadığını ve kendi yolunu izlediğini belirtiyor. Ergenlikte bu tarz sık görülür ve zamanla değişebilir.',
        tipsStudent: [
          'Bir sorun yaşadığında karşı tarafın ne hissettiğini tahmin etmeye çalış.',
          'Takım çalışmalarında küçük bir teşekkür ya da takdir bile ilişkileri güçlendirir.',
        ],
        tipsParent: [
          'Empatiyi öğütle değil, birlikte yaşanan deneyimlerle (gönüllülük, bir canlının bakımını üstlenme) destekleyin.',
          'Arkadaş ilişkilerinde sürekli çatışma yaşıyorsa okulun rehber öğretmeniyle görüşebilirsiniz.',
        ],
      },
    },
    conscientiousness: {
      very_high: {
        summary: 'Çok planlı ve kararlı',
        student: 'Çok planlı, düzenli ve kararlısın. Bir işe başladığında onu bitirmek senin için önemli.',
        parent: 'Çocuğunuz kendini çok düzenli, planlı ve kararlı biri olarak tanımlıyor.',
        tipsStudent: [
          'Plan bozulduğunda esnek olabilmek de bir beceri; her şeyin kusursuz olması gerekmez.',
          'Dinlenmeyi de programına yaz; kararlılığını uzun süre korumana yardım eder.',
        ],
        tipsParent: [
          'Sonucu değil emeği övmek, mükemmeliyetçi baskıyı azaltır.',
          'Dinlenmenin ve serbest zamanın da önemli olduğunu gösterin.',
        ],
      },
      high: {
        summary: 'Sorumluluk sahibi',
        student:
          'Sorumluluklarını ciddiye alıyor, işlerini planlı yürütüyorsun. Bu, derslerde ve sınav hazırlığında büyük bir avantaj.',
        parent: 'Çocuğunuz sorumluluklarını ciddiye aldığını ve işlerini planlı yürüttüğünü belirtiyor.',
        tipsStudent: [
          'Büyük hedefleri küçük adımlara bölmeye devam et.',
          'Kendine koyduğun hedefler fazla ağırlaşırsa bir büyüğünle konuş.',
        ],
        tipsParent: [
          'Kendi çalışma planını hazırlamasına fırsat verin; takibini de ona bırakın.',
          'Hedeflerini gerçekçi tutmasına destek olun.',
        ],
      },
      average: {
        summary: 'Duruma göre planlı',
        student:
          'Bazen çok planlı, bazen daha kendiliğinden davranıyorsun. İlgi duyduğun işlerde düzenli olmak sana daha kolay geliyor.',
        parent: 'Çocuğunuz duruma göre planlı ya da kendiliğinden davranabildiğini belirtiyor.',
        tipsStudent: [
          'Önemli işler için basit bir yapılacaklar listesi tut.',
          'Ödevleri küçük parçalara ayır ve ilk parçaya hemen başla.',
        ],
        tipsParent: [
          'Birlikte basit bir haftalık plan hazırlayabilirsiniz.',
          'Düzenli olduğu alanları fark edip övün; bu alışkanlığı diğer alanlara taşımasına yardım edin.',
        ],
      },
      low: {
        summary: 'Esnek ve kendiliğinden',
        student:
          'Planlara bağlı kalmaktan çok anlık karar vermeyi ve esnek olmayı seviyorsun. Esneklik bir güç; ama ödev ve sınav gibi işlerde küçük sistemler hayatını kolaylaştırabilir.',
        parent:
          'Çocuğunuz planlılıktan çok esnekliği tercih ettiğini, işlerini bazen son ana bıraktığını belirtiyor. Bu, ergenlikte yaygın ve öğrenilebilir bir beceri alanıdır.',
        tipsStudent: [
          'Telefonuna hatırlatıcı kurmak ya da çantanı akşamdan hazırlamak gibi küçük alışkanlıklarla başla.',
          '25 dakika çalışıp 5 dakika mola vermek gibi kısa bloklar işe başlamayı kolaylaştırır.',
        ],
        tipsParent: [
          'Suçlamak yerine birlikte basit sistemler kurun: sabit bir ders saati, herkesin görebileceği bir takvim.',
          'Küçük başarıları fark edip takdir edin.',
        ],
      },
      very_low: {
        summary: 'Düzen ve planlama zor geliyor',
        student:
          'Düzen ve planlama sana zor geliyor gibi görünüyor. Bu bir karakter kusuru değil; planlama pratikle gelişen bir beceri.',
        parent:
          'Çocuğunuz düzen, planlama ve görevleri bitirme konusunda zorlandığını belirtiyor. Bu beceriler öğretilebilir ve gelişir.',
        tipsStudent: [
          'Her gün yalnızca bir önemli işi seçip onu bitirmeyi hedefle.',
          'Ödevlerini bir arkadaşınla aynı saatte yapmak başlamanı kolaylaştırabilir.',
        ],
        tipsParent: [
          'Uzun ödevleri küçük adımlara bölmesine yardım edin ve her adımı birlikte işaretleyin.',
          'Dikkat ve düzen zorlukları okul başarısını belirgin biçimde etkiliyorsa okulun rehber öğretmeniyle görüşün.',
        ],
      },
    },
    emotional_stability: {
      very_high: {
        summary: 'Çok sakin, kolay sarsılmayan',
        student:
          'Zor durumlarda bile sakin kalabildiğini, kolay kolay strese girmediğini söylüyorsun. Bu, sınav gibi baskılı anlarda büyük bir avantaj.',
        parent: 'Çocuğunuz kendini zor durumlarda sakin kalabilen, kolay sarsılmayan biri olarak tanımlıyor.',
        tipsStudent: [
          'Sakinliğin, çevrendeki gergin arkadaşlarına da iyi gelebilir.',
          'Sorunları görmezden gelmek yerine sakince çözmeye devam et.',
        ],
        tipsParent: [
          'Bu sakinliği sınav ve yarışma gibi durumlarda bir güç olarak ona hatırlatın.',
          'Yine de içinden geçenleri paylaşabileceği bir ortam sunmaya devam edin.',
        ],
      },
      high: {
        summary: 'Genelde sakin',
        student: 'Genelde sakinsin ve stresle başa çıkabiliyorsun. Zaman zaman gerilsen de çabuk toparlanıyorsun.',
        parent: 'Çocuğunuz genel olarak sakin olduğunu ve stresle başa çıkabildiğini belirtiyor.',
        tipsStudent: [
          'Seni rahatlatan şeyleri (spor, müzik, yürüyüş) bilmek zor günlerde işine yarar.',
          'Sınav öncesi kısa nefes egzersizleri sakinliğini korumana yardım eder.',
        ],
        tipsParent: [
          'Stresli dönemlerde düzenli uykuyu ve hareketi destekleyin.',
          'İşe yarayan başa çıkma yollarını fark edip ona hatırlatın.',
        ],
      },
      average: {
        summary: 'Çoğu zaman dengeli',
        student:
          'Çoğu zaman dengelisin; bazı durumlar seni daha çok strese sokabiliyor. Bu herkes için normal.',
        parent: 'Çocuğunuz çoğu zaman dengeli olduğunu, bazı durumlarda ise strese girebildiğini belirtiyor.',
        tipsStudent: [
          'Seni en çok neyin strese soktuğunu fark etmek önceden hazırlanmanı sağlar.',
          'Duygularını bir arkadaşınla ya da ailenle paylaşmak yükünü hafifletir.',
        ],
        tipsParent: [
          'Hangi durumların onu zorladığını yargılamadan dinleyin.',
          'Zor dönemlerde uyku, yemek ve hareket rutinlerini korumak dengeyi destekler.',
        ],
      },
      low: {
        summary: 'Duyguları yoğun yaşayan',
        student:
          'Duyguları yoğun yaşadığını, stresli durumlardan kolayca etkilendiğini söylüyorsun. Duyguları derin yaşamak bir hassasiyet; onları yönetmeyi öğrenmek de mümkün.',
        parent:
          'Çocuğunuz duyguları yoğun yaşadığını ve stresli durumlardan kolayca etkilendiğini belirtiyor. Bu ergenlikte sık görülür ve destekle gelişebilir.',
        tipsStudent: [
          'Gergin hissettiğinde 4 saniye nefes al, 4 saniye tut, 6 saniyede ver; birkaç kez tekrarla.',
          'Seni üzen şeyleri güvendiğin bir yetişkinle konuşmak iyi gelir.',
        ],
        tipsParent: [
          'Duygularını küçümsemeden dinleyin: "Bunda üzülecek ne var" yerine "Seni üzdüğünü anlıyorum" deyin.',
          'Uyku düzeni, hareket ve ekran süresi duygusal dengeyi doğrudan etkiler.',
        ],
      },
      very_low: {
        summary: 'Sık sık stresli ya da üzgün hissettiğini belirtiyor',
        student:
          'Sık sık stresli, endişeli ya da üzgün hissettiğini söylüyorsun. Bunu fark etmen önemli bir adım. Bu duygularla tek başına baş etmek zorunda değilsin.',
        parent:
          'Çocuğunuz kendini sık sık stresli, endişeli ya da üzgün hissettiğini belirtiyor. Bu sonuç bir tanı değildir; ancak bu duyguların ne zamandır sürdüğünü ve günlük hayatı ne kadar etkilediğini onunla konuşmanız önemlidir.',
        tipsStudent: [
          'Güvendiğin bir yetişkinle (ailen ya da rehber öğretmenin) nasıl hissettiğini konuş.',
          'Kendini çok kötü hissettiğin anlarda yardım istemek güçlü olmanın bir parçasıdır.',
        ],
        tipsParent: [
          'Onunla sakin bir anda konuşun ve yargılamadan dinleyin.',
          'Bu duygular uzun süredir devam ediyorsa ya da okul, uyku ve arkadaşlıklar etkileniyorsa okulun rehber öğretmeninden ya da bir çocuk ve ergen ruh sağlığı uzmanından destek almanızı öneririz.',
        ],
        support: true,
      },
    },
    intellect: {
      very_high: {
        summary: 'Çok meraklı ve yaratıcı',
        student:
          'Fikirlerle oynamayı, hayal kurmayı ve yeni şeyler öğrenmeyi çok seviyorsun. Soyut konular ve "neden" soruları ilgini çekiyor.',
        parent: 'Çocuğunuz kendini meraklı, hayal gücü güçlü ve fikir dolu biri olarak tanımlıyor.',
        tipsStudent: [
          'Merakını derinleştirebileceğin projeler seç: bilim şenliği, yazarlık ya da kodlama gibi.',
          'Fikirlerini bir deftere not et; en iyilerini hayata geçirmeyi dene.',
        ],
        tipsParent: [
          'Sorularını ciddiye alın ve cevapları birlikte arayın.',
          'Kütüphane, müze ve atölye gibi merakını besleyecek ortamlar sunun.',
        ],
      },
      high: {
        summary: 'Meraklı ve açık',
        student: 'Yeni fikirlere açıksın, hayal gücün güçlü ve öğrenmeyi seviyorsun.',
        parent: 'Çocuğunuz yeni fikirlere açık olduğunu ve öğrenmeyi sevdiğini belirtiyor.',
        tipsStudent: [
          'İlgi duyduğun bir konuyu okul dışında da araştırmaya zaman ayır.',
          'Yaratıcı fikirlerini somut bir ürüne dönüştür: bir yazı, bir model ya da bir sunum.',
        ],
        tipsParent: [
          'İlgi alanlarını keşfetmesine fırsat verin.',
          'Farklı alanlarda denemeler yapmasına alan tanıyın.',
        ],
      },
      average: {
        summary: 'Dengeli',
        student:
          'Hem pratik hem de hayal gücü gerektiren işlerde rahat edebiliyorsun. İlgini çeken konularda merakın artıyor.',
        parent: 'Çocuğunuz somut ve pratik düşünmeyle hayal gücü arasında dengeli bir tarz tanımlıyor.',
        tipsStudent: [
          'Seni gerçekten meraklandıran konuları fark etmeye çalış.',
          'Bir konuyu farklı açılardan düşünmeyi alışkanlık hâline getir.',
        ],
        tipsParent: [
          'İlgisini çeken konuları gözlemleyip o yönde fırsatlar sunun.',
          'Günlük sorunlara birlikte farklı çözümler üretmeyi deneyin.',
        ],
      },
      low: {
        summary: 'Somut ve pratik',
        student:
          'Somut, pratik ve işe yarar şeylere odaklanmayı tercih ediyorsun. Soyut tartışmalardan çok uygulama seni çekiyor.',
        parent:
          'Çocuğunuz soyut fikirlerden çok somut ve pratik konuları tercih ettiğini belirtiyor. Uygulamaya dönük düşünme değerli bir güçtür.',
        tipsStudent: [
          'Soyut konuları gerçek hayattan örneklerle çalışmak sana daha kolay gelebilir.',
          'Yaparak öğrenebileceğin etkinlikler seç: deney, yapım, uygulama.',
        ],
        tipsParent: [
          'Soyut konuları günlük hayattan örneklerle anlatmak işini kolaylaştırır.',
          'Elle yapılan etkinlikler ve uygulamalı projeler ona uygun olabilir.',
        ],
      },
      very_low: {
        summary: 'Alışık olduğu konuları tercih eden',
        student:
          'Yeni ve soyut fikirler yerine bildiğin, somut şeylerle uğraşmayı çok daha çok seviyorsun.',
        parent: 'Çocuğunuz alışık olduğu, somut konularla uğraşmayı tercih ettiğini belirtiyor.',
        tipsStudent: [
          'Merak ettiğin tek bir konu seç ve onu biraz daha derinlemesine keşfet.',
          'Soru sormaktan çekinme; soru sormak öğrenmenin en iyi yollarından biri.',
        ],
        tipsParent: [
          'İlgi duyduğu somut alanlardan başlayarak merakını genişletin.',
          'Başarı yaşayabileceği uygulamalı etkinlikler sunun.',
        ],
      },
    },
  },
};
