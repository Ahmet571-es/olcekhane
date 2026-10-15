import type { Soru } from '../../../types';

/** Bölüm sırasıyla temel, lisans ve uzman sorular. Doğru şıklar her düzeyin içinde dört yere dengeli dağıtılmıştır. */
export const sorular: Soru[] = [
  {
    soru: 'Beyni saran zarların dıştan içe doğru sırası hangisidir?',
    secenekler: [
      'Yumuşak zar, örümcek ağı zar, sert zar',
      'Sert zar, yumuşak zar, örümcek ağı zar',
      'Sert zar, örümcek ağı zar, yumuşak zar',
      'Örümcek ağı zar, sert zar, yumuşak zar',
    ],
    dogru: 2,
    aciklama:
      'Dıştan içe sıra sert zar, örümcek ağı zar ve yumuşak zardır. Sert zar kafatasına yapışıktır; yumuşak zar ise beynin yüzeyine sıkıca tutunur ve her oluğa iner.',
    seviye: 'temel',
  },
  {
    soru: 'Sağlıklı bir insanın kafasında, içi beyin-omurilik sıvısıyla dolu gerçek boşluk hangisidir?',
    secenekler: ['Subaraknoid boşluk', 'Epidural boşluk', 'Subdural boşluk', 'Sert zarın iki katı arası'],
    dogru: 0,
    aciklama:
      'Subaraknoid boşluk örümcek ağı zar ile yumuşak zar arasındadır ve BOS ile doludur. Kafa içinde epidural ve subdural boşluk normalde yoktur; ancak kanama ya da yaralanmayla açılır.',
    seviye: 'temel',
  },
  {
    soru: 'Kafatasının içinde sert zarın iki görevi nedir?',
    secenekler: [
      'Beyin-omurilik sıvısını yapmak ve emmek',
      'Beyin kabuğunu beslemek ve sinyal iletmek',
      'Kemiklerin iç kemik zarı olmak ve beyni korumak',
      'Kafatasına tutunan kasları taşımak ve oynatmak',
    ],
    dogru: 2,
    aciklama:
      'Gray’e göre kafatasındaki sert zar hem kafatası kemiklerinin iç kemik zarıdır hem de beyni koruyan bir örtüdür. Sert zar beyin-omurilik sıvısını yapmaz ve beyin kabuğunu beslemez.',
    seviye: 'temel',
  },
  {
    soru: 'Klasik anlatımda sert zarın iki katı hangi yerlerde birbirinden ayrılır?',
    secenekler: [
      'Toplardamar sinüslerinin olduğu yerlerde ve kıvrımlarda',
      'Yalnızca alın bölgesinde, dikişlerin hemen altında',
      'Hiçbir yerde ayrılmaz, her yerde sıkıca kaynaşıktır',
      'Her yerde ayrıdır, aralarında sıvı dolu bir boşluk vardır',
    ],
    dogru: 0,
    aciklama:
      'Endosteal ve meningeal kat çoğu yerde sıkıca kaynaşıktır. Yalnızca toplardamar sinüslerinin bulunduğu yerlerde ve meningeal katın içeri doğru kıvrıldığı yerlerde birbirinden ayrılır.',
    seviye: 'temel',
  },
  {
    soru: 'Beyincik çadırı kafatasının içini hangi iki bölmeye ayırır?',
    secenekler: ['Sağ ve sol bölme', 'Çadır üstü ve çadır altı bölme', 'Ön ve orta kafa çukuru', 'Karıncık içi ve karıncık dışı bölme'],
    dogru: 1,
    aciklama:
      'Çadır büyük beyni beyincikten ayırır ve kafatasının içini iki kata böler: çadır üstü (supratentoryal) ve çadır altı (infratentoryal). Sağ ve sol bölmeleri ise beyin orağı ayırır.',
    seviye: 'temel',
  },
  {
    soru: 'Çadır çentiğinden beyin sapının hangi bölümü geçer?',
    secenekler: ['Omurilik soğanı', 'Köprünün (pons) alt bölümü', 'Ara beyin (talamus)', 'Orta beyin'],
    dogru: 3,
    aciklama:
      'Çadırın ön kenarı serbesttir ve çadır çentiği denen oval bir açıklığı çevreler. Beyin sapının üst bölümü olan orta beyin bu çentikten geçer. Köprü ve omurilik soğanı çadırın altında kalır.',
    seviye: 'temel',
  },
  {
    soru: 'Sert zarın toplardamar sinüsleri nerede uzanır?',
    secenekler: [
      'Örümcek ağı zar ile yumuşak zar arasındaki BOS dolu boşlukta',
      'Sert zarın iki katı ayrıldığında aralarında kalan kanallarda',
      'Kafatası kemiğinin süngerimsi orta katının (diploe) içinde',
      'Burun çevresindeki hava boşluklarının ince duvarlarında',
    ],
    dogru: 1,
    aciklama:
      'Sert zarın kemiğe yapışan dış katı ile beyne bakan iç katı sinüslerin olduğu yerde ayrılır. Aradaki kanalı endotel döşer. Diploe içinde diploik toplardamarlar, örümcek ağı zarın altında ise BOS bulunur. Burun çevresindeki “sinüsler” hava boşluklarıdır, kan taşımaz.',
    seviye: 'temel',
  },
  {
    soru: 'Kan, ana yol boyunca üst sagital sinüsten sonra hangi sırayla ilerler?',
    secenekler: [
      'Alt sagital sinüs → düz sinüs → kavernöz sinüs',
      'Kavernöz sinüs → alt petrozal sinüs → juguler delik',
      'Düz sinüs → alt sagital sinüs → oksipital sinüs',
      'Birleşim yeri → enine sinüs → sigmoid sinüs',
    ],
    dogru: 3,
    aciklama:
      'Üst sagital sinüs arkada sinüslerin birleşim yerinde genişler. Kan oradan enine sinüse geçer, sonra S biçimli sigmoid sinüsten juguler deliğe ve iç juguler toplardamara iner. Alt sagital sinüs ise düz sinüse açılır.',
    seviye: 'temel',
  },
  {
    soru: 'Sert zarı besleyen en büyük atardamar hangisidir ve kafatasına nereden girer?',
    secenekler: [
      'İç karotis atardamarı; karotis kanalından girer',
      'Vertebral atardamar; büyük delikten girer',
      'Ön meningeal dal; küçük kanadın üstünden geçer',
      'Orta meningeal atardamar; dikensi delikten girer',
    ],
    dogru: 3,
    aciklama:
      'Orta meningeal atardamar sert zarı besleyen atardamarların en büyüğüdür. Maksiller atardamardan çıkar ve dikensi delikten (foramen spinosum) kafatasına girer. En sık pterionda yırtılır.',
    seviye: 'temel',
  },
  {
    soru: 'Uyanık beyin ameliyatlarındaki klasik gözlem hangisidir?',
    secenekler: [
      'Beynin yüzeyine dokunmak her zaman çok şiddetli ve uzun süren bir ağrı yapar',
      'Sert zar damarları uyarılınca baş ağrısı olur, beyin yüzeyi uyarılınca olmaz',
      'Sert zarın hiçbir bölgesi uyarıldığında ağrı ya da başka bir duyu oluşmaz',
      'Ağrı her zaman tam uyarılan noktada duyulur, başka bir yere hiç yansımaz',
    ],
    dogru: 1,
    aciklama:
      'Klasik gözlemlerde sert zarın damarlarının uyarılması başta yansıyan ağrı yaptı, beyin yüzeyinin uyarılması yapmadı. Ağrı çoğu kez başka bir yerde, örneğin göz çevresinde ya da şakakta duyuldu.',
    seviye: 'temel',
  },
  {
    soru: 'Örümcek ağı zar beynin oluklarına inmez, üstlerinden köprü gibi geçer. Bu kuralın tek istisnası hangi yarıktır?',
    secenekler: ['Yan yarık (Sylvius yarığı)', 'Merkezî oluk', 'Boylamsal yarık', 'Beyincik ile beyin arasındaki enine yarık'],
    dogru: 2,
    aciklama:
      'Örümcek ağı zar olukların üstünden köprü kurar. Yalnızca iki yarımküreyi ayıran boylamsal yarığın içine girer. Yan yarığın üstünden ise köprü gibi geçer; altında Sylvius sisternası kalır.',
    seviye: 'temel',
  },
  {
    soru: 'Araknoid trabeküllerin beyin için önemli bir görevi nedir?',
    secenekler: [
      'Beyni sıvının içinde asılı tutar ve darbede beynin kaymasını sönümler',
      'Beyin-omurilik sıvısını yapar ve onu karıncıkların içine salgılar',
      'Sert zarı kafatasının iç yüzüne her yerde sıkıca yapıştırır',
      'Beyne giden büyük atardamarların duvarındaki kas katını oluşturur',
    ],
    dogru: 0,
    aciklama:
      'Trabeküller örümcek ağı zarı yumuşak zara bağlayan ince kollajen ipliklerdir. Beyin onlar sayesinde subaraknoid boşluktaki sıvının içinde asılı durur. Darbede beynin kafatasına göre kaymasını da sönümlerler. BOS’u ise koroid pleksus yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Beyni saran üç zardan hangisi her oluğun içine iner ve beyin yüzeyine sıkıca yapışır?',
    secenekler: ['Sert zar', 'Yumuşak zar', 'Örümcek ağı zar', 'Beyin orağı'],
    dogru: 1,
    aciklama:
      'Yumuşak zar (pia mater) en içteki zardır. Beyin kıvrımlarını ve oluklarını birebir izler ve sinir dokusuna sıkıca tutunur. Örümcek ağı zar ise olukların üstünden köprü kurar; beyin orağı sert zarın bir kıvrımıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Damar çevresi boşluk (Virchow–Robin boşluğu) nedir?',
    secenekler: [
      'Sert zar ile kafatasının iç yüzü arasında kalan dar, kanla dolu aralık',
      'Yan karıncıkları üçüncü karıncığa bağlayan küçük, sıvı dolu delikler',
      'Örümcek ağı zarın toplardamar sinüslerinin içine uzanan küçük çıkıntıları',
      'Beyne dalan damarın duvarı ile zar kılıfı arasındaki sıvı dolu aralık',
    ],
    dogru: 3,
    aciklama:
      'Yumuşak zar beynin içine giren ve çıkan damarların çevresine bir kılıf gibi iner. Damar duvarı ile bu kılıf arasında sıvı dolu bir aralık kalır. MR’da nokta ya da çizgi gibi görünür ve sağlıklı kişilerde de görülür.',
    seviye: 'temel',
  },
  {
    soru: 'Sağlıklı bir insanın kafasının içinde, aşağıdaki boşluklardan hangisi gerçekten vardır?',
    secenekler: [
      'Kafatası ile sert zar arasındaki epidural boşluk',
      'Sert zar ile örümcek ağı zar arasındaki subdural boşluk',
      'Örümcek ağı zar ile yumuşak zar arasındaki subaraknoid boşluk',
      'Sert zarın iki katı arasındaki yağ dolu bir boşluk',
    ],
    dogru: 2,
    aciklama:
      'TA2’nin notuna göre normalde örümcek ağı zar sert zara, sert zar da kafatasına yapışıktır; bu sınırlarda doğal boşluk yoktur. Kafanın içindeki gerçek boşluk, BOS dolu subaraknoid boşluktur. Yağ dolu epidural boşluk yalnızca omurilikte bulunur.',
    seviye: 'temel',
  },
  {
    soru: 'Bel delmede iğne neden omuriliğe zarar vermez?',
    secenekler: [
      'Omurilik belde kalın bir kemik kılıfla ayrıca korunur',
      'Omurilik üst bel omurlarında biter; altında sinir kökleri ve BOS vardır',
      'İğne yalnızca epidural boşluğa kadar ilerletilir, zarlara girmez',
      'BOS belde omuriliğin önünde, ayrı bir torbada toplanır',
    ],
    dogru: 1,
    aciklama:
      'Omurilik üst bel omurları hizasında biter, ama örümcek ağı zar 2. sağrı omuruna kadar iner. Böylece 2. bel omurunun altında bel sisternası kalır. İğne sert zarı ve örümcek ağı zarı geçip bu sisternaya girer; burada yalnızca at kuyruğunun sinir kökleri vardır.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin zarlarındaki lenf damarları için hangisi doğrudur?',
    secenekler: [
      'Yalnızca farede vardır, insanda hiç görülmemiştir',
      'Beyin dokusunun içinde, sinir hücrelerinin arasında uzanır',
      'Sert zarda, toplardamar sinüslerinin yanında uzanır',
      'Yalnızca ölüm sonrası dokuda görülür, MR’da görülemez',
    ],
    dogru: 2,
    aciklama:
      'Zar lenf damarları sert zarda, özellikle üst sagital ve enine sinüslerin yanında uzanır. Farede 2015’te gösterildi; 2017’de insanda ve marmoset maymununda MR ile canlıda görüntülendi. Farede beyin dokusunda ve yumuşak zarda lenf damarı görülmedi.',
    seviye: 'temel',
  },
  {
    soru: '2023’te önerilen SLYM (“dördüncü zar”) için bugün en doğru ifade hangisidir?',
    secenekler: [
      'Bütün araştırmacıların kabul ettiği dördüncü bir zardır',
      'Sert zarın kemiğe yapışan dış katının yeni adıdır',
      'Yalnızca menenjit sırasında oluşan bir iltihap zarıdır',
      'Varlığı ve görevi hâlâ tartışılan, önerilmiş bir yapıdır',
    ],
    dogru: 3,
    aciklama:
      'SLYM’i tanımlayanlar onu subaraknoid boşluğu bölen dördüncü bir zar olarak sundu. Eleştirmenlere göre ise örümcek ağı zarın bir parçasıdır ve “dış boşluk” yapaydır. 2026 tarihli bir derlemeye göre konu hâlâ yoğun biçimde tartışılıyor.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin zarlarının taslağı olan ilkel zar, döllenmeden sonra yaklaşık ne zaman oluşmaya başlar?',
    secenekler: ['Doğumdan hemen önce', '22–24. günlerde', '12. haftada', 'Doğumdan sonraki ilk yılda'],
    dogru: 1,
    aciklama:
      'Ishikawa ve arkadaşlarına göre 22–24. günlerde ara doku hücreleri sinir borusunun çevresine göç eder ve ilkel zarı oluşturur. İlkel zar 33–36. günlerde bütün beyni sarar.',
    seviye: 'temel',
  },
  {
    soru: '“Dura mater” adındaki “mater” sözcüğü nereden gelir?',
    secenekler: [
      'Latincede “madde” anlamındaki bir sözcükten',
      'Yunanca “zar” anlamındaki meninx sözcüğünden',
      'Zarı ilk tanımlayan anatomistin soyadından',
      'Arapçada zar için kullanılan “ana” sözcüğünden',
    ],
    dogru: 3,
    aciklama:
      'Arapçada “zar” karşılığı bir sözcük yoktu; zarlar “ana” sözcüğüyle anlatıldı. Sert zar “sert ana” oldu. Bu ad Latinceye dura mater olarak geçti.',
    seviye: 'temel',
  },
  {
    soru: 'Epidural kanama BT’de neden çoğunlukla mercek biçimli görünür?',
    secenekler: [
      'Sert zar dikişlere sıkı yapışır, kan dikişleri aşamaz',
      'Kan BOS’a karışır ve beynin oluklarına doğru yayılır',
      'Beyin orağı kanı iki yarımküreye eşit olarak paylaştırır',
      'Kan yumuşak zarın altında, kabuğun içinde birikir',
    ],
    dogru: 0,
    aciklama:
      'Epidural kan, kafatası ile sert zar arasında toplanır. Sert zar dikiş yerlerinde kemiğe sıkıca tutunur. Bu yüzden kan önce en yakın dikişe kadar yayılır, sonra derine şişer. Sonuçta iki yanı dışbükey, mercek biçimli bir görüntü oluşur.',
    seviye: 'temel',
  },
  {
    soru: 'Akut subdural kanamada kan çoğunlukla hangi damarlardan gelir?',
    secenekler: [
      'Orta meningeal atardamardan',
      'Beyin tabanındaki bir anevrizmadan',
      'Köprü toplardamarlarından',
      'Koroid pleksusun damarlarından',
    ],
    dogru: 2,
    aciklama:
      'Köprü toplardamarları, beyin yüzeyinden sert zar sinüslerine giderken sert zar ile örümcek ağı zar arasındaki düzlemi aşar. Bu ince duvarlı toplardamarlar zıt yönlü kuvvetlerle yırtılınca kan bu düzleme dolar. Orta meningeal atardamar daha çok epidural kanamanın, anevrizma ise subaraknoid kanamanın kaynağıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Orak altı fıtıklaşmada beyin orağının altından karşı tarafa kayan yapı hangisidir?',
    secenekler: ['Beyincik bademciği', 'Unkus', 'Omurilik soğanı', 'Kuşak kıvrımı'],
    dogru: 3,
    aciklama:
      'Orak altı fıtıklaşmada kuşak kıvrımı (gyrus cinguli), beyin orağının serbest alt kenarının altından karşı tarafa kayar. Unkus çadır çentiğinden aşağı, beyincik bademcikleri ise büyük delikten aşağı fıtıklaşır.',
    seviye: 'temel',
  },
  {
    soru: 'Menenjiyom için hangisi doğrudur?',
    secenekler: [
      'Beyin dokusunun içinden çıkar ve çoğu kötü huyludur.',
      'Beyin zarlarından çıkar ve çoğu iyi huyludur.',
      'Yalnızca çocuklarda görülen, çok nadir bir tümördür.',
      'Erkeklerde kadınlardan çok daha sık görülür.',
    ],
    dogru: 1,
    aciklama:
      'Menenjiyom beyin ya da omurilik zarlarından gelişir ve çoğu iyi huyludur (Alruwaili ve Hall, 2026). En sık birincil beyin tümörüdür ve kadınlarda daha sıktır (Price ve ark., 2024).',
    seviye: 'temel',
  },
  {
    soru: 'Kafa içi düşük basınçta en tipik baş ağrısı nasıldır?',
    secenekler: [
      'Gece uykuda başlar, sabah kalkınca geçer.',
      'Yalnızca öksürünce başlar ve birkaç saniye sürer.',
      'Başın tek yanında zonklar ve ışıkla artar.',
      'Ayağa kalkınca başlar ya da artar, uzanınca geçer.',
    ],
    dogru: 3,
    aciklama:
      'Buna duruşa bağlı (ortostatik) baş ağrısı denir. Kendiliğinden düşük basınçta hastaların %92’sinde görülür (D’Antona ve ark., 2021). Sert zardaki bir delikten BOS sızınca beyin desteğini kaybeder ve aşağı yer değiştirir (Nouri ve ark., 2021).',
    seviye: 'temel',
  },
  {
    soru: 'İngiltere’nin kılavuzu bakteriyel menenjit için hangi dört belirtinin birlikte görülmesini “kırmızı bayrak” sayar?',
    secenekler: [
      'Ateş, baş ağrısı, ense sertliği ve bilinç bozukluğu',
      'Ateş, baş ağrısı, kas ağrısı ve halsizlik',
      'Baş ağrısı, bulantı, baş dönmesi ve ışıktan rahatsızlık',
      'Ateş, öksürük, boğaz ağrısı ve ense ağrısı',
    ],
    dogru: 0,
    aciklama:
      'NICE kılavuzu ateş, baş ağrısı, ense sertliği ve bilinçte ya da düşünmede bozulmanın birlikte görülmesini kırmızı bayrak sayar. Bebekte ateş ve ense sertliği daha az görülür (NICE, 2024).',
    seviye: 'temel',
  },
  {
    soru: 'Kontrast madde verilince sağlıklı sert zar MR’da neden biraz boyanır?',
    secenekler: [
      'Sert zar kafatası kemiğinden yapıldığı için',
      'Sert zarda kan-beyin engeli bulunmadığı için',
      'Sert zarın içinde sürekli BOS dolaştığı için',
      'Sert zar beyin dokusunun derinine girdiği için',
    ],
    dogru: 1,
    aciklama:
      'Sert zarda kan-beyin engeli yoktur. Kontrast madde sert zarın damarlarından dokuya sızar; bu yüzden sağlıklı sert zar da ince, düzgün ve kesik kesik boyanır. Beyin dokusunda ise kan-beyin engeli kontrast maddeyi geçirmez.',
    seviye: 'temel',
  },
  {
    soru: 'FLAIR’de bir oluğun içi parlak görünüyor. Aşağıdakilerden hangisi hastalık olmadan da bu görüntüye yol açabilir?',
    secenekler: [
      'Subaraknoid boşluğa kan sızması',
      'Bakterilerin zarlara yerleşmesi',
      'Yüksek oranda oksijen solunması',
      'Kanser hücrelerinin BOS’a yayılması',
    ],
    dogru: 2,
    aciklama:
      'Kan, menenjit ve kanserin BOS’a yayılması oluk içi parlaklığın en bilinen nedenleridir; üçü de hastalıktır. Yüksek oranda oksijen solunması ve propofol verilmesi ise hastaya yapılan işlemden doğan nedenlerdir. BOS’un boşaltılması da aynı görüntüyü verebilir.',
    seviye: 'temel',
  },
  {
    soru: 'Gazi Yaşargil beynin derinine ulaşırken hangi doğal yolları izlemeyi savundu?',
    secenekler: [
      'Örümcek ağı zarın sisternalarını ve beynin yarıklarını',
      'Karıncıkların içinden geçen dar ve uzun su kanallarını',
      'Kafatası kemiklerinin arasındaki dikiş çizgilerini',
      'Beyin dokusunun içinden açılan düz ve kısa tünelleri',
    ],
    dogru: 0,
    aciklama:
      'Mikroskop altında beyin; oluklar, yarıklar ve sisternalardan oluşan düzenli bir ağ olarak görünür. İnce damarlar da bu yolları izler. Yaşargil diseksiyonun bu doğal düzlemler boyunca yapılmasını savundu ve sisternalar yoluyla yaklaşımlar geliştirdi.',
    seviye: 'temel',
  },
  {
    soru: 'TA2’ye göre ince zarlar (leptomeninges) hangi zarlardan oluşur?',
    secenekler: [
      'Sert zar ile örümcek ağı zar',
      'Yalnızca yumuşak zar',
      'Sert zarın meningeal katı ile yumuşak zar',
      'Örümcek ağı zar ile yumuşak zar',
    ],
    dogru: 3,
    aciklama:
      'TA2 beyin zarlarını iki dala ayırır: sert zar (dura) ve ince zarlar (leptomeninges). İnce zarlar örümcek ağı zar ile yumuşak zardır. Sert zarın öteki adı pachymeninx, yani kalın zardır.',
    seviye: 'lisans',
  },
  {
    soru: 'TA2, kafa içi epidural boşluğu ve subdural boşluğu nasıl işaretler?',
    secenekler: ['“Yalnızca çocuklarda bulunan”', '“Her zaman bulunmayan”', '“Kullanımdan kaldırılmış”', '“Her zaman bulunan”'],
    dogru: 1,
    aciklama:
      'TA2 iki terimi de “her zaman bulunmayan” (inconstant) diye işaretler. Resmî notuna göre normalde örümcek ağı zar sert zara, sert zar da kafatasına yapışıktır. Bu boşluklar travma ya da hastalıkla açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Sert zarın sınır hücre katmanı için hangisi doğrudur?',
    secenekler: [
      'Kolajenden en zengin kattır ve kemiğe sıkıca yapışır',
      'Kafatasının dış kemik zarına kesintisiz biçimde devam eder',
      'Yalnızca omurilik sert zarında bulunan özel bir kattır',
      'Hücreleri sıkı bağlantı içermez ve bu kat kolayca yarılır',
    ],
    dogru: 3,
    aciklama:
      'Sınır hücre katmanı sert zarın en iç katıdır. 10 µm’den incedir, kolajeni çok azdır ve hücreleri sıkı bağlantılarla kenetlenmez. Bu yüzden mekanik olarak zayıftır; “subdural” denen yarık bu katmanda açılır. Omurilik sert zarında da vardır.',
    seviye: 'lisans',
  },
  {
    soru: 'Sağlıklı bir kişinin kontrastlı MR’ında sert zarın ince ve kesintili boyanması neden görülür?',
    secenekler: [
      'Sert zar beyin-omurilik sıvısını kendisi yaptığı için',
      'Sert zarın damarları pencereli ve engelsiz olduğu için',
      'Sert zarın içinde ince bir kemik dokusu bulunduğu için',
      'Sert zarda sıkı bağlantılı engel hücreleri olduğu için',
    ],
    dogru: 1,
    aciklama:
      'Sert zarın damarları pencerelidir ve hücreleri sıkı bağlantılarla kenetlenmez. Sert zarda, beyin damarlarındaki gibi bir engel yoktur. Bu yüzden kontrast madde sert zarı normalde boyar. Normal boyanma ince, düzgün ve kesintilidir.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e göre beyin orağı önde nereye tutunur?',
    secenekler: [
      'Horoz ibiğine (crista galli)',
      'Türk eyerinin arka duvarına',
      'İç art kafa çıkıntısının üstüne',
      'Ön klinoid çıkıntının ucuna',
    ],
    dogru: 0,
    aciklama:
      'Beyin orağı önde dardır ve horoz ibiğine tutunur. Arkada genişler ve beyincik çadırının üst yüzüne bağlanır. Üst kenarı orta hat boyunca iç art kafa çıkıntısına dek uzanır.',
    seviye: 'lisans',
  },
  {
    soru: 'Rai ve arkadaşlarına göre çadır çentiğinin serbest kenarının hemen üstünde hangi yapılar durur?',
    secenekler: [
      'Kuşak kıvrımı ve ön beyin atardamarı',
      'Beyincik bademcikleri ve vertebral atardamar',
      'Parahipokampal kıvrım ve arka beyin atardamarı',
      'Görme sinirlerinin çaprazı ve iç karotis atardamarı',
    ],
    dogru: 2,
    aciklama:
      'Serbest kenarın üstünde parahipokampal (hipokampus çevresi) kıvrım ve arka beyin atardamarı bulunur. Bu komşuluk, beynin çentikten aşağı kaydığı fıtıklaşmada önemlidir: kenarın üzerinden kayan kıvrım göz hareket sinirini sıkıştırabilir.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray (1918) ve TA2 sigmoid sinüsü nasıl ele alır?',
    secenekler: [
      'Gray onu enine sinüsün mastoid oluğundaki kısmı sayar; TA2 ayrı bir sinüs olarak verir',
      'Gray onu ayrı bir sinüs sayar; TA2 ise onu enine sinüsün mastoid oluktaki parçası olarak verir',
      'İkisi de onu kavernöz sinüsün kafa tabanı boyunca arkaya uzanan kısmı olarak verir',
      'İkisi de onu iç juguler toplardamarın kafatası içinde kalan ilk ve en geniş bölümü sayar',
    ],
    dogru: 0,
    aciklama:
      'Gray, mastoid oluktaki kısma “bazen sigmoid sinüs denir” der ve onu enine sinüsün parçası sayar. TA2 ise sigmoid sinüsü ayrı bir sinüs olarak listeler; bu terim listeye 1955’te eklenmiştir.',
    seviye: 'lisans',
  },
  {
    soru: 'Köprü toplardamarlarının sinüse girişini inceleyen bir çalışmada hangi tipin duvarı en inceydi?',
    secenekler: [
      'Sinüse hiç dolanmadan, doğrudan giren tip A',
      'Sinüsün yan cebi üzerinde ilerleyen tip C',
      'Sert zarın altında bir süre ilerleyen tip B',
      'Üç tipin duvar kalınlığı birbirine hemen hemen eşitti',
    ],
    dogru: 2,
    aciklama:
      'Ye ve arkadaşlarının (2024) ölçümlerinde en ince duvar tip B’deydi: 53 ± 34 µm. Tip A’da duvar 238 ± 63 µm, tip C’de 333 ± 77 µm idi. Tip B ve C, bregma ile lambda arasında toplanır.',
    seviye: 'lisans',
  },
  {
    soru: 'Spinosus siniri hangi daldan çıkar ve nasıl bir yol izler?',
    secenekler: [
      'Alt çene dalından (V3); oval delikten çıkıp dikensi delikten geri girer',
      'Göz dalından (V1); kavernöz sinüste çıkıp arkaya doğru çadıra kıvrılır',
      'Vagus sinirinden; juguler gangliyondan çıkıp arka çukura dağılır',
      'Üst çene dalından (V2); gangliyonun yanında ayrılıp ön çukura gider',
    ],
    dogru: 0,
    aciklama:
      'Spinosus siniri alt çene dalının meningeal dalıdır. Oval delikten çıkar, orta meningeal atardamarla birlikte dikensi delikten geri girer. Bu “geri dönen” düzen sert zar sinirlerinde sık görülür. Kavernöz sinüste çıkan dal ise Arnold’un çadır siniridir.',
    seviye: 'lisans',
  },
  {
    soru: 'Klasik deneylerde orta meningeal atardamar uyarılınca ağrı nerede duyuldu?',
    secenekler: ['Alında ve göz çevresinde', 'Art kafada ve ensede', 'Yan kafada ve şakakta', 'Boyunda ve omuzlarda'],
    dogru: 2,
    aciklama:
      'Ray ile Wolff’un ve Penfield ile McNaughton’un deneylerinde orta meningeal atardamar uyarılınca ağrı yan kafada ve şakakta duyuldu. Üst sagital sinüs göz çevresine, arka çukur yapıları ise art kafaya ağrı yansıttı.',
    seviye: 'lisans',
  },
  {
    soru: 'Liliequist zarının diensefalik yaprağı hangi iki sisternayı birbirinden ayırır?',
    secenekler: [
      'İnterpedinküler sisterna ile prepontin sisterna',
      'Büyük sisterna ile bel sisternası',
      'Ambiens sisterna ile kuadrigeminal sisterna',
      'Kiazma sisternası ile interpedinküler sisterna',
    ],
    dogru: 3,
    aciklama:
      'Liliequist zarı eyer sırtından başlar ve iki yaprağa ayrılır. Üstteki diensefalik yaprak mamiller cisimlerin yakınına tutunur ve kiazma sisternasını interpedinküler sisternadan ayırır. İnterpedinküler sisternayı alttaki prepontin sisternadan ayıran ise mezensefalik yapraktır.',
    seviye: 'lisans',
  },
  {
    soru: 'Kana verilen boyalar sert zarı boyar ama örümcek ağı zarı boyamaz. Bu gözlem neyi gösterir?',
    secenekler: [
      'Sert zarın damarlarında boyayı tutan sıkı bağlantıların bulunduğunu',
      'Kanla gelen maddeleri BOS’tan uzak tutan engelin örümcek ağı zarda olduğunu',
      'Örümcek ağı zarın kendi kan damarlarıyla beslenen damarlı bir zar olduğunu',
      'Sert zar ile örümcek ağı zar arasında BOS dolu gerçek bir boşluk bulunduğunu',
    ],
    dogru: 1,
    aciklama:
      'Sert zarın damarları pencerelidir ve sıkı bağlantı taşımaz; maddeler bu damarlardan sızar. Örümcek ağı zarın dış yüzündeki engel hücreleri ise sıkı bağlantılarla kenetlidir. Boyanın orada durması, kanla gelen maddeleri subaraknoid boşluğun dışında tutanın örümcek ağı zar olduğunu gösterir.',
    seviye: 'lisans',
  },
  {
    soru: 'Potter ölçeğine göre MR’da görülen bir damar çevresi boşluğun kesit çapı hangi sınırın altındadır?',
    secenekler: ['1 mm', '15 mm', '3 mm', '10 mm'],
    dogru: 2,
    aciklama:
      'Potter ve arkadaşlarına göre damar çevresi boşluk BOS sinyalinde ve keskin sınırlıdır. Kesit çapı 3 mm’den küçüktür ve delici damarın yolunu izler. Ölçek bazal ganglionları ve yarımküre ak maddesini 0–4 arası puanlar. Orta beyne ise yalnızca 0 (yok) ya da 1 (var) verir. 15 mm ise bazı yazarlarda dev boşluğun eşiğidir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bazal ganglionlarda MR’da görülen küçük boşluklar daha çok nerede yer alıyorsa damar çevresi boşluğu düşündürür?',
    secenekler: [
      'Alt üçte birde, ön komissüre yakın',
      'Üst üçte ikide, düzensiz biçimde',
      'Yalnızca bir yanda ve kabuğun içinde',
      'Beyin sapında, çevresinde parlak halka ile',
    ],
    dogru: 0,
    aciklama:
      'Bazal ganglionlardaki damar çevresi boşluklar MR’da daha çok alt üçte birde ve ön komissüre yakın görülür. Laküner enfarktlar ise daha çok üst üçte ikide yer alır, genellikle daha büyüktür (3–15 mm) ve simetrik olmama eğilimindedir.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’in (1918) tanımına göre Willis halkası hangi sisternanın içindedir?',
    secenekler: ['Büyük sisterna', 'Kuadrigeminal sisterna', 'Bel sisternası', 'İnterpedinküler sisterna'],
    dogru: 3,
    aciklama:
      'Gray interpedinküler sisternayı (bazal sisterna) geniş tanımlar: iki şakak lobu arasında uzanır, serebral pedinkülleri sarar ve Willis halkasını içerir. Bugünkü cerrahi anatomi ise halkanın parçalarını karotis, lamina terminalis ve interpedinküler sisternalara dağıtır. Büyük beyin toplardamarı kuadrigeminal sisternadadır.',
    seviye: 'lisans',
  },
  {
    soru: 'Haines’e (1991) göre “subdural boşluk” neden “olası boşluk” bile sayılmaz?',
    secenekler: [
      'Orada her zaman ince bir BOS katmanı bulunduğu için',
      'Oradaki yarık ancak doku hasarıyla oluştuğu için',
      'Sert zar ile örümcek ağı zar arasında yağ bulunduğu için',
      'Yarık yalnızca omurilikte oluşup kafada oluşmadığı için',
    ],
    dogru: 1,
    aciklama:
      'Haines, örümcek ağı zarın engel hücre katmanı ile sert zarın sınır hücre katmanı arasında bir boşluğa dair kanıt bulmadı. Ona göre bu bölgede yarık ancak doku hasarıyla açılır. Bu yüzden “potansiyel boşluk” sözü de yanlıştır; boşluk oluşursa ayrı bir hücre katmanının içindedir.',
    seviye: 'lisans',
  },
  {
    soru: 'Absinta ve arkadaşları (2017) MR’da gördükleri yapının lenf damarı olduğunu nasıl destekledi?',
    secenekler: [
      'Yapı iki kontrast maddeyle de aynı ölçüde parladı',
      'Yapı sızan gadobutrolle parladı, kanda kalan gadofosvesetle parlamadı',
      'Yapı kontrast verilmeden görüldü, kontrast verilince kayboldu',
      'Yapı yalnızca BT’de görüldü, MR’da hiçbir dizide görülmedi',
    ],
    dogru: 1,
    aciklama:
      'Gadobutrol damardan dokuya kolay sızar; gadofosveset ise kan havuzunda kalır. Lenf damarları yalnızca gadobutrolle parladı. Bu, görülen yapının kan damarı değil, dokuya sızan maddeyi toplayan lenf damarı olduğunu destekler.',
    seviye: 'lisans',
  },
  {
    soru: 'Canlı farede damar çevresi boşluktaki BOS akımı için hangisi bulundu?',
    secenekler: [
      'Akım kalp atımıyla aynı sıklıkta ve kan akımıyla aynı yöndeydi',
      'Akım solunumla aynı sıklıktaydı ve kan akımına ters yöndeydi',
      'Boşlukta hiç akım yoktu; boncuklar yerlerinde titreşiyordu',
      'Yüksek tansiyonda akım yaklaşık iki kat hızlanıp düzenlendi',
    ],
    dogru: 0,
    aciklama:
      'Büyük sisternaya verilen mikrokürelerle yapılan izlemde akım kalp atımıyla eş zamanlı ve kan akımıyla aynı yöndeydi. Yüksek tansiyon akımı yaklaşık %40 azalttı. Yazarlar itici gücün atardamar duvarı olduğunu öne sürdü (damar çevresi pompalama); bu görüş tartışmalıdır.',
    seviye: 'lisans',
  },
  {
    soru: 'Fare çalışmalarına göre ön beyin zarlarındaki fibroblastlar hangi kaynaktan gelir?',
    secenekler: ['Sinir krestinden', 'Mezodermden', 'Endodermden', 'Sinir borusunun iç yüzünden'],
    dogru: 0,
    aciklama:
      'Ön beyin zarlarının fibroblastları sinir krestinden gelir. Orta beyin, arka beyin ve omurilik zarlarınınkiler ise mezodermdendir. Zar damarlarının iç yüzü her bölgede mezoderm kökenlidir.',
    seviye: 'lisans',
  },
  {
    soru: 'Granülasyonların BOS emilimindeki rolüne karşı ileri sürülen erken itirazlardan biri hangisiydi?',
    secenekler: [
      'Yalnızca yetişkin kadınlarda bulunmaları',
      'Omurilikte beyindekinden çok daha sık olmaları',
      'Alt omurgalılarda ve bebeklerde bulunamamaları',
      'Kafatası kemiğinde hiçbir iz bırakmamaları',
    ],
    dogru: 2,
    aciklama:
      'Proulx’a göre granülasyonların alt omurgalılarda ve insan bebeklerinde bulunamaması erken bir tartışma konusuydu. Gray de onların bebeklikte görülmediğini yazmıştı. Güncel bir MR çalışmasında yenidoğanların %85’inde görünür granülasyon yoktu.',
    seviye: 'lisans',
  },
  {
    soru: 'Unkal fıtıklaşmada aynı taraftaki göz bebeğinin genişlemesi en iyi hangisiyle açıklanır?',
    secenekler: [
      'Karşı beyin sapı ayağının çadıra çarpması',
      'Göz hareket sinirinin (III) sıkışması',
      'Baziler atardamarın delici dallarının yırtılması',
      'Görme sinirleri çaprazının basılması',
    ],
    dogru: 1,
    aciklama:
      'Şakak lobunun iç-ön kısmı çadır çentiğinden aşağı itilince aynı taraftaki göz hareket sinirini (III) sıkıştırır ve göz bebeği genişler. Karşı beyin sapı ayağının çadır kenarına çarpması Kernohan–Woltman çentiğini, delici dalların yırtılması ise Duret kanamasını anlatır.',
    seviye: 'lisans',
  },
  {
    soru: 'NICE kılavuzuna (2022) göre şimşek gibi baş ağrısı başladıktan 6 saat içinde çekilen BT radyologca temiz bulunursa ne önerilir?',
    secenekler: [
      'Bel delme hemen ve mutlaka yapılır',
      'BT ertesi gün yinelenir',
      'Bel delme en az 24 saat sonra yapılır',
      'Rutin olarak bel delme yapılmaz',
    ],
    dogru: 3,
    aciklama:
      'Kanada’daki büyük bir çalışmada ilk 6 saatte çekilen BT, radyolog yorumuyla bütün kanamaları gösterdi. NICE bu yüzden 6 saat içinde çekilen temiz BT’den sonra rutin bel delme önermez. BT 6 saatten sonra çekildiyse bel delme düşünülür ve belirtilerden en az 12 saat sonra yapılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Kronik subdural kanamayı akut subdural kanamadan ayıran biyolojik özellik hangisidir?',
    secenekler: [
      'Kanın atardamar basıncıyla hızla ve bir kerede birikmesi',
      'Kanın BOS’a karışıp beynin tabanındaki sisternalara yayılması',
      'Yeni zarlar ve damarlarla süren iltihaplı bir süreç olması',
      'Kanın sert zarın kemiğe tutunduğu dikişlerde durması',
    ],
    dogru: 2,
    aciklama:
      'Kronik subdural kanama iltihaplı bir “yeni zar” hastalığıdır. Yeni damar oluşumu, pıhtının fazla erimesi ve tekrarlayan küçük kanamalarla sürer. Dış zarın sızdıran damarları birikintiyi büyütür. Bu yüzden haftalar içinde yavaş büyür ve nüks edebilir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bir meta-analize göre Kernig ve Brudzinski işaretleri için hangisi doğrudur?',
    secenekler: [
      'Duyarlılıkları %90’ın üstündedir; olumsuzsa menenjit dışlanır.',
      'Hem duyarlılıkları hem özgüllükleri %50 civarındadır.',
      'Duyarlılıkları düşük (%20–30), özgüllükleri yüksektir (%85–95).',
      'Yalnızca viral menenjitte olumlu çıkarlar.',
    ],
    dogru: 2,
    aciklama:
      'Bu işaretlerin duyarlılığı %20–30, özgüllüğü %85–95 bulundu. Menenjitli hastaların yaklaşık yarısında tipik zar işaretleri yoktur; bu yüzden olumsuz bir işaret menenjiti dışlamaz (Akaishi ve ark., 2019).',
    seviye: 'lisans',
  },
  {
    soru: 'Simpson derece I, II ve III arasındaki fark nedir?',
    secenekler: [
      'Üçünde de tümör tamamen çıkar; fark tutulan sert zara ne yapıldığıdır.',
      'Fark, tümörün ne kadarının geride bırakıldığıdır.',
      'Fark, tümörün mikroskoptaki DSÖ derecesine göre belirlenir.',
      'Fark, ameliyattan sonra verilen ışın dozuna göre belirlenir.',
    ],
    dogru: 0,
    aciklama:
      'Tam çıkarımda sert zar da çıkarılırsa derece I, yerinde yakılırsa derece II, olduğu gibi bırakılırsa derece III denir (Wang ve ark., 2024). Tümörün bir kısmı kalırsa derece IV olur (Chotai ve Schwartz, 2022).',
    seviye: 'lisans',
  },
  {
    soru: 'Borden sınıflamasına göre tip II sert zar fistülünde kan nereye akar?',
    secenekler: [
      'Yalnızca toplardamar sinüsüne akar; geri akım yoktur.',
      'Sinüse uğramadan doğrudan beyin yüzeyi toplardamarlarına akar.',
      'Omuriliğin çevresindeki toplardamarlara akar.',
      'Sinüse akar; ayrıca kortikal toplardamarlara geri akım vardır.',
    ],
    dogru: 3,
    aciklama:
      'Borden tip I doğrudan sinüse, tip II sinüse ve geriye doğru subaraknoid (kortikal) toplardamarlara, tip III doğrudan kortikal toplardamarlara akar. Kalıcı kortikal geri akım saldırgan seyrin işaretidir (Baharvahdat ve ark., 2020).',
    seviye: 'lisans',
  },
  {
    soru: 'Kalın zar (pakimeningeal) ve ince zar (leptomeningeal) boyanmasını ayıran anatomik temel nedir?',
    secenekler: [
      'Sert zar oluklara iner; yumuşak zar yalnızca beynin tabanında bulunur',
      'Örümcek ağı zar beyin dokusuna girer; sert zar ise dokuya hiç girmez',
      'İki zar aynı yolu izler; fark yalnızca verilen kontrastın dozundan gelir',
      'Yumuşak zar olukları izler; örümcek ağı zar ise kıvrımdan kıvrıma geçer',
    ],
    dogru: 3,
    aciklama:
      'Yumuşak zar beyin yüzeyine yapışıktır ve olukların dibine kadar iner; bu yüzden ince zar boyanması oluk diplerine inen dalgalı bir çizgidir. Örümcek ağı zar ise sert zara yaslanır ve kıvrımdan kıvrıma köprü kurar. Bu yüzden kalın zar boyanması kafatasının iç yüzünü izler.',
    seviye: 'lisans',
  },
  {
    soru: 'Planlı çadır üstü kraniyotomilerde sert zar asma dikişini sınayan 490 hastalık randomize çalışma ne buldu?',
    secenekler: [
      'Dikiş koymamak, epidural kanama için yeniden ameliyatta daha kötü değildi',
      'Dikişler epidural kanamayı anlamlı biçimde onda bir oranına indirdi',
      'Dikiş konmayan grupta BOS kaçağının anlamlı biçimde arttığı bulundu',
      'Dikişlerin yararı yalnızca kafa tabanı ameliyatlarında gösterilebildi',
    ],
    dogru: 0,
    aciklama:
      'Asma dikişlerini Walter Dandy tanıttı; epidural kanamayı önledikleri iddiası kanıta dayanmıyordu. Çalışmada epidural kanama için yeniden ameliyat dikiş konmayanlarda %0,8, konanlarda %0,4 idi ve dikiş koymamak aşağı kalmadı. BOS kaçağındaki fark da çoklu karşılaştırma için yapılan düzeltmeden sonra anlamlı değildi.',
    seviye: 'lisans',
  },
  {
    soru: 'Kadavradan alınan sert zar yamalarının kullanımı son 30 yılda neden kısıtlanmıştır?',
    secenekler: [
      'Vücut onları birkaç gün içinde eritip tamamen yok ettiği için',
      'MR’da görüntüyü bozup zarların değerlendirilmesini zorlaştırdıkları için',
      'Creutzfeldt–Jakob hastalığı bulaşmasıyla ilişkilendirildikleri için',
      'Kafatası kemiğine tutunamayıp ameliyattan sonra yerinden kaydıkları için',
    ],
    dogru: 2,
    aciklama:
      'Kadavra sert zarı yamaları, ameliyatla bulaşan (iatrojenik) Creutzfeldt–Jakob hastalığı ve prion benzeri amiloid birikimiyle ilişkilendirildi. İdeal bir yama, hastalık yapan proteinleri kafa içine taşımamalıdır.',
    seviye: 'lisans',
  },
  {
    soru: 'Klinikte “subdural” denen yarık en çok hangi katmanın içinde açılır?',
    secenekler: [
      'Örümcek ağı zarın engel hücre katmanında',
      'Sert zarın sınır hücre katmanında',
      'Sert zarın kemiğe bakan endosteal katında',
      'Yumuşak zar ile glia limitans arasında',
    ],
    dogru: 1,
    aciklama:
      'Sınır hücre katmanı 10 µm’den incedir. Hücreleri arasında sıkı bağlantı yoktur ve kolajen azdır. Küçük kesme kuvvetleri onu yararak sert zarın içinde bir ayrılma düzlemi açar.',
    seviye: 'ileri',
  },
  {
    soru: 'Yumuşak zar damarları sıkı bağlantılı olduğu hâlde neden kan-beyin engelinin aynısı sayılmaz?',
    secenekler: [
      'Çevrelerinde astrosit ayakları ve sinir-damar birimi yoktur',
      'Kana verilen 44 kD’lik işaretleyiciyi kolayca geçirirler',
      'Hepsi subaraknoid boşlukta uzanan ince kılcal damarlardır',
      'Duvarlarında sert zar damarlarındaki gibi pencereler vardır',
    ],
    dogru: 0,
    aciklama:
      'Yumuşak zar damarları sıkı bağlantılıdır ve 44 kD’lik işaretleyiciyi geçirmez. Ama çevrelerinde astrosit ayakları yoktur. Kan-beyin engelini tamamlayan sinir-damar birimi subaraknoid boşlukta bulunmaz. Bu boşlukta kılcal damar da yoktur. Pencereli damarlar ise sert zardadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Ishikawa ve arkadaşlarına göre sert zarın meningeal katı yaklaşık kaç lif tabakasından (lamel) oluşur?',
    secenekler: ['3–8', '78–82', '4–5', '100–300'],
    dogru: 1,
    aciklama:
      'Ishikawa ve arkadaşlarına göre meningeal kat, demetlenmiş kolajen liflerinden yapılmış yaklaşık 78–82 lif tabakasından oluşur. 3–8, sınır hücre katmanındaki hücre sırasının sayısıdır. 4–5 ise Zu ve arkadaşlarının bütün kafatası sert zarında saydığı iç içe lif tabakası sayısıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Sert zarın kalınlığı ile yaş arasındaki ilişki için kaynaklar ne gösterir?',
    secenekler: [
      'Şakakta zayıf bir kalınlaşma, kafa tabanında ise incelme',
      'Her bölgede yaşla belirgin ve düzenli bir incelme görülür',
      'Kalınlık hiçbir bölgede yaşla değişmez, hep aynı kalır',
      'Yalnızca kadınlarda yaşla belirgin bir kalınlaşma olur',
    ],
    dogru: 0,
    aciklama:
      'Zwirner ve arkadaşları şakak sert zarında yaşla zayıf bir kalınlaşma buldu (r = 0,288). Fam ve arkadaşları kafa tabanında yaşlılarda daha ince sert zar buldu. Bir derlemeye göre bu fark çelişki değildir; bölgelerin yaşla farklı yollardan yeniden biçimlenmesini yansıtır.',
    seviye: 'ileri',
  },
  {
    soru: 'Adler ve Milhorat’ın 100 otopsilik çalışmasında beyin sapı çadır çentiğinde hangi sıklıkta öne yerleşikti?',
    secenekler: ['%7', '%28', '%36', '%15'],
    dogru: 1,
    aciklama:
      'Beyin sapı olguların %28’inde öne yerleşik, %36’sında arkaya yerleşik, %36’sında orta konumluydu. %7, sekiz çentik tipinden “karışık” tipin sıklığıdır; %15 ise dar ve uzun tiplerin her birinin sıklığıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Vatansever ve arkadaşlarının 594 kişilik BT anjiyografi çalışmasından hangi sonuç çıkar?',
    secenekler: [
      'Çadır açısı yaşla birlikte belirgin biçimde daralıyordu',
      'Kadınlarda çadır erkeklerden anlamlı olarak daha uzundu',
      'En sık kafa biçimi uzun kafa (dolikosefal) biçimiydi',
      'Çadır erkekte uzundu, ama farkların klinik yararı azdı',
    ],
    dogru: 3,
    aciklama:
      'Çadırın uzunluğu erkeklerde 3,95 ± 0,65 cm, kadınlarda 3,72 ± 0,6 cm idi. Yaşla çadır açısı arasında yalnızca çok zayıf bir ilişki bulundu. Kişilerin çoğu (%70,5) kısa-geniş kafalıydı. Yazarlara göre farklar ve ilişkiler zayıftır; klinik yararları büyük olasılıkla sınırlıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Üst sagital sinüsün “çapı” için tek bir sayı vermek neden yanıltıcıdır?',
    secenekler: [
      'Sinüsün çapı ancak ölümden sonra, kadavrada güvenilir biçimde ölçülebildiği için',
      'Bütün çalışmalar aynı değeri bulduğu için ayrıca sayı vermeye gerek olmadığı için',
      'Sinüs arkaya doğru genişlediği, değer ölçüm yerine ve yönteme göre değiştiği için',
      'Sinüs yalnızca çocuklarda ölçülebildiği, erişkinde ise hiç görüntülenemediği için',
    ],
    dogru: 2,
    aciklama:
      'Kadavrada ortanca genişlik nasion–bregma ortasında 7,3 mm iken inionda 15,6 mm’dir. BT anjiyografide bregmada 5,2, lambdada 8,6 mm; Nepal MR venografisinde 6,4 mm; Sakarya MR’ında 4,8 mm bulundu. Bir derleme ise 3,0–4,5 mm verir.',
    seviye: 'ileri',
  },
  {
    soru: 'Sfenoparietal sinüs tartışmasında 2023’teki kadavra çalışması ne buldu?',
    secenekler: [
      'Tarafların %70’inde belirgin bir sinüs vardı ve hepsi kavernöz sinüse açılıyordu',
      'Sinüs hiçbir tarafta bulunamadı; yapı iki ayrı damarın yapay birleşimi çıktı',
      'Sinüs her tarafta yüzeyel orta beyin toplardamarını alıp enine sinüse açılıyordu',
      'Sinüs yalnızca çocuklarda vardı ve dokusu toplardamar yapısındaydı',
    ],
    dogru: 0,
    aciklama:
      'Posey ve arkadaşları (2023) 20 tarafın %70’inde sinüs buldu; hepsi kavernöz sinüse açılıyordu ve incelenen örneklerin %85’i sinüs yapısındaydı. San Millán Ruíz ve arkadaşları (2004) ise onu iki yapının yapay birleşimi saymıştı.',
    seviye: 'ileri',
  },
  {
    soru: 'Orta meningeal atardamar göz (oftalmik) atardamarından çıkıyorsa, bu atardamarı tıkamak neden risklidir?',
    secenekler: [
      'Beyin dokusunda kanama riski taşıdığı için',
      'Görme kaybı riski taşıdığı için',
      'Kalp ritmini bozma riski taşıdığı için',
      'İşitme kaybı riski taşıdığı için',
    ],
    dogru: 1,
    aciklama:
      'Oftalmik kökenli orta meningeal atardamar anjiyografi serilerinin %0,5–2’sinde bildirilir. Bu varyantta embolizasyon görme kaybı riski taşır. Ön daldaki meningolakrimal bağlantı da geriye akışta retinada kansızlık riski yaratır.',
    seviye: 'ileri',
  },
  {
    soru: 'CGRP için hangisi doğrudur?',
    secenekler: [
      'Trigeminal lifleri doğrudan uyararak ağrıyı her zaman kendisi başlatır',
      'Yalnızca beyin sapında salınır, zar dokusunda ise hiç bulunmaz',
      'Migren ataklarında iç juguler toplardamarın kanında düzeyi belirgin düşer',
      'Zarda ve beyin sapındaki ilk sinapsta salınır, atardamarları genişletir',
    ],
    dogru: 3,
    aciklama:
      'Messlinger’e (2018) göre CGRP’nin büyük kısmı trigeminal liflerden hem zar dokusunda hem de beyin sapındaki ilk sinapsta salınır. Atardamarları genişletir ama trigeminal lifleri doğrudan uyarmaz. Migren ataklarında iç juguler toplardamar kanında düzeyi artar.',
    seviye: 'ileri',
  },
  {
    soru: 'Zagreb’deki MR çalışmasına göre 60 yaşından sonra araknoid granülasyonlar en çok nerede bulunur?',
    secenekler: [
      'Üst sagital sinüsün çevresindeki kafatası kemiğinde',
      'Enine ve sigmoid sinüslerin içinde',
      'Trigeminal sinirin çevresindeki Meckel boşluğunda',
      'Yan karıncıkların içinde, koroid pleksusun yanında',
    ],
    dogru: 0,
    aciklama:
      'Radoš ve arkadaşları kemik içindeki granülasyonları yalnızca üst sagital sinüs çevresinde ve ilk kez 10 yaşında gördü. 60 yaşından sonra granülasyonlar kemikte, sinüstekinden daha çoktu. Enine ve sigmoid sinüslerde granülasyonu olanların oranı hiçbir yaşta %40 ve %25’i geçmedi.',
    seviye: 'ileri',
  },
  {
    soru: 'Enine sinüste görülen bir dolma kusurunu sinüs trombozundan ayırmada hangi özellik dev granülasyonu düşündürür?',
    secenekler: [
      'Kusurun bütün bir sinüs bölümünü doldurması',
      'Kusurun korteks toplardamarlarına doğru uzanması',
      'Kusurun odaksal, sınırları belli ve düğümsü olması',
      'Kusurun birden çok sinüsü aynı anda tutması',
    ],
    dogru: 2,
    aciklama:
      'Tromboz genellikle bir sinüs bölümünün tamamını ya da birden çok sinüsü tutar ve korteks toplardamarlarına uzanabilir. Granülasyon ise odaksal, sınırları belli, düğümsü bir kusur yapar. Enine sinüste en sık sinüsün orta ve dış üçte birinin birleştiği yerde görülür. İç sinyali BOS’a benzeyebilir. Ama bir seride çoğunda T1 ve FLAIR’de BOS’tan farklıydı.',
    seviye: 'ileri',
  },
  {
    soru: 'Hutchings ve Weller damar çevresi boşlukların subaraknoid boşluğa açılmadığını hangi gözleme dayandırdı?',
    secenekler: [
      'Boşlukların MR’da bütün dizilerde ve her yaşta BOS ile aynı sinyalde görülmesine',
      'Canlı farede boşluk alanının atardamar alanından daha büyük ölçülmüş olmasına',
      'Bel bölgesine verilen kontrast maddenin bazal ganglion boşluklarına geçmesine',
      'Kan hücrelerinin ve Çin mürekkebinin subaraknoid boşluktan oraya geçmemesine',
    ],
    dogru: 3,
    aciklama:
      'Hutchings ve Weller yeni subaraknoid kanaması olan beyinlerde kırmızı kan hücrelerinin damar çevresi boşluklara girmediğini gördü. Ölüm sonrası subaraknoid boşluğa verilen Çin mürekkebi de geçmedi. Kontrastın geçtiği olguları ise Saylisoy ve arkadaşları bildirdi; tartışma bugün de açıktır.',
    seviye: 'ileri',
  },
  {
    soru: 'Mestre ve arkadaşlarının fare çalışmasına göre doku sabitlemesi damar çevresi boşluğu nasıl etkiler?',
    secenekler: [
      'Boşluğu genişletir; boşluk/atardamar alan oranı 0,14’ten 1,4’e çıkar',
      'Boşluğu çökertir; boşluk/atardamar alan oranı 1,4’ten 0,14’e iner',
      'Boşluğu değiştirmez; alan oranı canlıda ve sabitlenmiş dokuda aynı kalır',
      'Boşluğu subaraknoid boşlukla birleştirir ve iki bölmeyi tek bölme yapar',
    ],
    dogru: 1,
    aciklama:
      'Canlı farede damar çevresi boşluğun kesit alanı atardamarınkinin ortalama 1,4 katıdır. Doku sabitlenince bu oran 0,14’e düşer; boşluk çöker. Bu yüzden ölü dokuda yapılan çalışmalar boşluğu olduğundan dar gösterebilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Ishikawa ve arkadaşlarına göre omurilikteki epidural boşluk kafa içinde neyin karşılığı sayılabilir?',
    secenekler: [
      'Endosteal ve meningeal katlar arasındaki interdural düzlemin',
      'Sert zarın sınır hücre katmanında açılan yarığın',
      'Örümcek ağı zar ile yumuşak zar arasındaki boşluğun',
      'Yumuşak zar ile beyin dokusu arasındaki pia altı boşluğun',
    ],
    dogru: 0,
    aciklama:
      'Kafa içi sert zarın endosteal katı büyük delikte dışa döner. Bu yüzden omurilik sert zarı yalnızca meningeal kattan ve sınır hücre katmanından oluşur. Omurilikteki epidural boşluk da kafa içinde iki kat arasındaki interdural düzlemin karşılığı sayılır.',
    seviye: 'ileri',
  },
  {
    soru: 'Li ve arkadaşlarının (2023) önerdiği “oksipito-atlantal sisterna” için hangisi doğrudur?',
    secenekler: [
      'TA2’de büyük sisternanın resmî eş anlamlısı olarak yer alır',
      'Köprünün önünde uzanır ve baziler atardamarı içerir',
      'Büyük delikten 2. boyun omurunun üst kenarına uzanır',
      'Önden arkaya çapı aşağı doğru genişler, aksiste en büyüktür',
    ],
    dogru: 2,
    aciklama:
      'Yazarlar, büyük delikten 2. boyun omurunun üst kenarına uzanan geniş arka subaraknoid boşluğa bu adı önerdi. 60 MR’da çap büyük delikte 15,92 mm iken aksiste 2,88 mm’ye iniyordu. Ad bir öneridir; TA2’nin sisterna listesinde yoktur.',
    seviye: 'ileri',
  },
  {
    soru: 'Siegenthaler ve Betsholtz’un (2024) SLYM’e itirazlarından biri hangisidir?',
    secenekler: [
      'SLYM yalnızca insanda vardır, farede hiç gösterilmemiştir',
      'SLYM’in kalınlığı sert zarınkinden birkaç kat fazladır',
      'SLYM ilk kez 1875’te Key ve Retzius tarafından tanımlanmıştır',
      'Ayırmak için kullanılan Claudin-11 sert zar fibroblastlarında da bulunur',
    ],
    dogru: 3,
    aciklama:
      'Eleştirmenler SLYM’in örümcek ağı zarın bir parçası olduğunu ve “dış subaraknoid boşluğun” yapay olduğunu savunur. Ayrıca SLYM’i engel katmanından ayırmak için kullanılan Claudin-11’in geni sert zar fibroblastlarında da çalışır; bu yüzden işaret sınırlıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'İnsanda kafatası ile zarlar arasındaki kanallar için hangisi bildirilmiştir?',
    secenekler: [
      'Kanallar fareninkilerle aynı genişliktedir, yaklaşık 20 μm',
      'Kanallar yalnızca yenidoğanda vardır, yetişkinde kapanır',
      'Genişlikleri 40–90 μm’dir; bazıları 150 μm’yi aşar',
      'Kanallar beyin dokusunu geçip doğrudan karıncıklara açılır',
    ],
    dogru: 2,
    aciklama:
      'Liu ve arkadaşlarının derlemesine göre insan kanalları fareninkilerden daha karmaşıktır. Genişlikleri 40–90 μm’dir, bazıları 150 μm’yi aşar; farede ise yaklaşık 18–25 μm’dir. İnsan kanalları sert zarı delip araknoid granülasyonlara bağlanabilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Ishikawa ve arkadaşlarına göre embriyoda büyük beyin ile ara beyin arasında ne gelişir?',
    secenekler: [
      'Beyin orağının horoz ibiğine tutunan ön ucu',
      'Sert zarın çift katlı ikinci büyük kıvrımı',
      'Yumuşak zarın bir katlantısı olan koroid tela',
      'Örümcek ağı zarın kalınlaşmış bir perdesi',
    ],
    dogru: 2,
    aciklama:
      'Bu iki bölüm arasında sert zar kıvrımı oluşmaz. Onun yerine yumuşak zar içeri katlanır ve koroid tela (tela choroidea) gelişir.',
    seviye: 'ileri',
  },
  {
    soru: 'Key ve Retzius’un 1875’te yayımlanan boya deneyleri sonradan neden eleştirildi?',
    secenekler: [
      'Deneyler yalnızca soğukkanlı hayvanlarda yapıldığı için',
      'Boya yerine ışınlı bir izleyici madde kullanıldığı için',
      'Sonuçları uzun yıllar hiçbir dergide yayımlanmadığı için',
      'Yüksek enjeksiyon basıncı zarları yırtmış olabileceği için',
    ],
    dogru: 3,
    aciklama:
      'Mantovani ve arkadaşlarına göre enjeksiyon basıncı 60 mmHg’nin üstündeydi ve villusları yırtmış olabilir. Proulx da sonraki araştırmacıların yüksek basınç kullanılmasını eleştirdiğini yazar.',
    seviye: 'ileri',
  },
  {
    soru: 'Kernohan–Woltman çentiğinde güçsüzlük neden kitleyle aynı tarafta görülür?',
    secenekler: [
      'Karşı beyin sapı ayağı çadırın serbest kenarına çarpar',
      'Aynı taraftaki göz hareket siniri klivusa takılır',
      'Bademcikler omurilik soğanını aşağıdan sıkıştırır',
      'Kuşak kıvrımı orağın altından karşı tarafa geçer',
    ],
    dogru: 0,
    aciklama:
      'Büyük kitle beyin sapını yana iter. Karşı taraftaki beyin sapı ayağı (crus cerebri) çadırın serbest kenarına çarpar. Bu ayağın sıkışması vücudun öteki yarısında, yani kitleyle aynı tarafta güçsüzlük yapar. Bu, yanıltıcı bir yer belirtisidir.',
    seviye: 'ileri',
  },
  {
    soru: 'Üç randomize çalışmanın meta-analizinde (Gillespie ve ark., 2025) orta meningeal atardamar embolizasyonu hangi grupta ilerlemeyi anlamlı olarak azalttı?',
    secenekler: [
      'Yalnızca ameliyat edilen hastalarda',
      'Akut subdural kanaması olan gençlerde',
      'Ameliyatsız izlenen hastalarda',
      'Bütün hastalarda kesin bir farkla',
    ],
    dogru: 2,
    aciklama:
      'Meta-analizde 1432 hasta vardı. Ameliyatsız izlenenlerde embolizasyon ilerlemeyi azalttı (RR 0,36). Ameliyat edilenlerde nüks anlamlı azalmadı (RR 0,60). Genel etki anlamlılık sınırındaydı (p = 0,058). Bu yüzden yöntemin yeri henüz kesinleşmedi.',
    seviye: 'ileri',
  },
  {
    soru: 'Duret kanamasında hangi damarlar gerilip yırtılır?',
    secenekler: [
      'Beyin yüzeyindeki köprü toplardamarları',
      'Baziler atardamarın delici dalları',
      'Orta meningeal atardamarın ön dalı',
      'Üst sagital sinüsün dış duvarı',
    ],
    dogru: 1,
    aciklama:
      'Beyin sapı hızla aşağı kayınca baziler atardamarın orta hat yakınındaki delici dalları gerilip yırtılır. Kanama orta beyin ve köprünün ön ve orta hat yakınındadır. Tarihsel olarak çok kötü sonuçla özdeşti, ama bilinci ve bağımsızlığı geri gelen hastalar da bildirildi.',
    seviye: 'ileri',
  },
  {
    soru: 'Bern puanında 2’şer puan alan üç “büyük” MR bulgusu hangileridir?',
    secenekler: [
      'Subdural sıvı, prepontin sisternanın daralması, mamillopontin uzaklığın kısalması',
      'Kalın zar boyanması, toplardamar sinüsü dolgunluğu, suprasellar sisternanın silinmesi',
      'Hipofiz büyümesi, bademciklerin aşağı inmesi, FLAIR’de oluk parlaklığı',
      'Kalın zar boyanması, hipofiz büyümesi, subdural sıvı toplanması',
    ],
    dogru: 1,
    aciklama:
      'Büyük bulgular kalın zar boyanması, sinüs dolgunluğu ve suprasellar sisternanın 4,0 mm ya da altına inmesidir. Subdural sıvı, prepontin sisternanın 5,0 mm ya da altına inmesi ve mamillopontin uzaklığın 6,5 mm ya da altına inmesi 1’er puandır. Toplam 5 ve üstü yüksek kaçak olasılığı demektir (Dobrocky ve ark., 2019).',
    seviye: 'ileri',
  },
  {
    soru: 'Sert zar kuyruğu üzerine yapılan 18 çalışmalık sistematik derleme ne buldu?',
    secenekler: [
      'Kuyrukların hiçbirinde tümör yoktu; hepsi tepkisel kalınlaşmaydı.',
      'Kuyruk yalnızca derece 3 menenjiyomlarda ve çocuklarda görüldü.',
      'Kuyrukların %70,9’unda tümör vardı; kuyruğu olmayanların %40’ında da.',
      'Kuyruk görülünce tanı kesinleşir; başka tümörde görülmez.',
    ],
    dogru: 2,
    aciklama:
      'Radyolojik kuyrukların %70,9’unda mikroskopla tümör sızması bulundu. Kuyruğu olmayan, yani sert zarı görüntüde normal olan hastaların %40’ında da sızma vardı (Cordia ve ark., 2025). Kuyruk tanı koydurmaz; metastaz ve lenfoma gibi başka kitlelerde de görülür (Doddamani ve ark., 2018).',
    seviye: 'ileri',
  },
  {
    soru: 'Menenjiyomda gen değişikliği ile tümörün yeri arasındaki ilişki için hangisi doğrudur?',
    secenekler: [
      'NF2 kaybı olanlar beyin kubbesinde ve arka-yan kafa tabanında toplanır.',
      'NF2 kaybı olanlar yalnızca ön kafa tabanında ve orak boyunca görülür.',
      'TRAF7 mutasyonlu menenjiyomlar en çok beyin kubbesinde görülür.',
      'Gen değişikliği ile tümörün yeri arasında bir ilişki bulunmamıştır.',
    ],
    dogru: 0,
    aciklama:
      'NF2 kaybı olan menenjiyomlar kubbede ve arka-yan kafa tabanında, NF2 dışı mutasyonlu olanlar (TRAF7, SMO, SUFU, PRKAR1A) ön kafa tabanında görülür. NF2 ile SMARCB1 birlikteliği ön orak boyuncadır (Wang ve ark., 2024).',
    seviye: 'ileri',
  },
  {
    soru: 'Arka çukur ameliyatlarını karşılaştıran bir meta-analizde kemik kapağın yerine konmaması psödomeningoseli nasıl etkiledi?',
    secenekler: [
      'Psödomeningosel kraniyektomide daha sık görüldü; ama kanıtın yanlılık riski yüksekti',
      'Psödomeningosel kraniyotomide daha sık görüldü; çünkü kemik kapağın altında sıvı birikti',
      'İki yöntemde psödomeningosel sıklığı aynıydı; kemiğin yerine konması bir fark yaratmadı',
      'Psödomeningosel yalnızca sert zarı yamayla kapatılanlarda görüldü; kemiğin etkisi yoktu',
    ],
    dogru: 0,
    aciklama:
      'Alhantoobi ve arkadaşlarının meta-analizinde psödomeningosel kraniyotomide %7,40 (338 ameliyatın 25’i), kraniyektomide %23,36 (214 ameliyatın 50’si) idi ve fark anlamlıydı. Kemik kapağın yerine konması kemik ve deri kusurunu azaltarak riski düşürebilir. Ama çalışmaların yanlılık riski yüksekti.',
    seviye: 'ileri',
  },
  {
    soru: 'Üst sagital sinüsün arka üçte birinin tıkanması neden özellikle tehlikelidir?',
    secenekler: [
      'Bu bölümün duvarında kas bulunur; kasılınca beyindeki toplardamar kanı geri akar',
      'Bu bölüm BOS’un emildiği tek yerdir; tıkanınca birkaç dakikada hidrosefali gelişir',
      'Bu bölümden orta meningeal atardamar geçer; tıkanınca sert zar beslenemez olur',
      'Bu bölümün yan dolaşımı azdır; tıkanınca iki yanda toplardamar enfarktı gelişir',
    ],
    dogru: 3,
    aciklama:
      'Levin-Carrion ve arkadaşlarına göre üst sagital sinüsün arka üçte birinin yan dolaşımı azdır. Bu bölüm tıkanırsa iki yanda yan kafa ve alın loblarında toplardamar enfarktları olur. Sinüslerin kas duvarı ve kapakçığı da yoktur; bu yüzden yırtılınca büyük kanama yaparlar.',
    seviye: 'ileri',
  },
  {
    soru: 'Ağır kafa travmasında bazal sisternostomi için kanıt bugün ne durumdadır?',
    secenekler: [
      'Randomize çalışmalarda ölümü anlamlı biçimde yarıya indirdiği gösterildi',
      'Kılavuzlar onu her ağır kafa travmasında kesin olarak ilk işlem sayar',
      'İyi sonucu anlamlı artırmadı; seçilmiş hastalarda yardımcı işlem sayılır',
      'Yalnızca hayvan deneylerinde denendi; insanda henüz hiç yapılmadı',
    ],
    dogru: 2,
    aciklama:
      'Sistematik derlemede dekompresyona eklenen sisternostomi iyi sonucu anlamlı artırmadı (OR 2,50; p = 0,06). Hindistan’dan bir randomize çalışmada ölüm %64’e karşı %48 idi; fark anlamlı değildi. WFNS nörotravma komitesi onu, belirgin travmatik subaraknoid kanaması olan seçilmiş hastalarda yardımcı işlem olarak tanımladı.',
    seviye: 'ileri',
  },
];
