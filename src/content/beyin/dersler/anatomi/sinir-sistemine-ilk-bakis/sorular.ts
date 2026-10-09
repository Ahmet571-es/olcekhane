import type { Soru } from '../../../types';

/** Bölüm sırasıyla temel, lisans ve uzman sorular. Doğru şıklar her düzeyin içinde dört yere dengeli dağıtılmıştır. */
export const sorular: Soru[] = [
  {
    soru: 'Ders kitapları sinir sisteminin işini hangi üç adımla özetler?',
    secenekler: ['Duyu, bütünleştirme, yanıt', 'Solunum, dolaşım, sindirim', 'Büyüme, onarım, üreme', 'Görme, işitme, dokunma'],
    dogru: 0,
    aciklama:
      'Sinir sistemi uyaranı fark eder (duyu), onu öteki duyularla, anılarla, duygu durumuyla ve öğrenilenlerle birleştirir (bütünleştirme) ve kasları ya da bezleri çalıştırır (yanıt).',
    seviye: 'temel',
  },
  {
    soru: 'Merkezî sinir sisteminde nöron gövdelerinin oluşturduğu kümeye ne ad verilir?',
    secenekler: ['Gangliyon', 'Yol (traktus)', 'Sinir', 'Çekirdek (nukleus)'],
    dogru: 3,
    aciklama:
      'MSS’deki nöron gövdesi kümesine çekirdek, ÇSS’dekine gangliyon denir. Akson demetinin adı ise MSS’de yol (traktus), ÇSS’de sinirdir.',
    seviye: 'temel',
  },
  {
    soru: 'Bir yapı beyinde “dorsal” diye tanımlanıyorsa nereye doğrudur?',
    secenekler: ['Beynin önüne doğru', 'Beynin tepesine (yukarıya) doğru', 'Orta hatta doğru', 'Beynin alt yüzüne doğru'],
    dogru: 1,
    aciklama:
      'İnsanda sinir ekseni orta beyin hizasında yaklaşık 90 derece bükülür. Bu yüzden dorsal beyinde yukarıyı (beynin tepesini), omurilikte ise sırtı gösterir.',
    seviye: 'temel',
  },
  {
    soru: 'Beyni sağ ve sol diye iki parçaya ayıran düzlem hangisidir?',
    secenekler: ['Koronal düzlem', 'Horizontal (aksiyel) düzlem', 'Sagital düzlem', 'Frontal düzlem'],
    dogru: 2,
    aciklama:
      'Sagital düzlem dikeydir ve beyni sağ ve sol diye ayırır; tam orta hattan geçene orta sagital düzlem denir. Koronal (frontal) düzlem ön–arka, horizontal (aksiyel) düzlem üst–alt ayırır.',
    seviye: 'temel',
  },
  {
    soru: 'Bir nöronun içinde bilgi hangi yönde akar?',
    secenekler: [
      'Aksondan dendritlere, oradan gövdeye',
      'Gövdeden dendritlere, oradan aksona',
      'Her yöne eşit olarak',
      'Dendritlerden gövdeye, oradan aksona',
    ],
    dogru: 3,
    aciklama:
      'Nöron kutuplu bir hücredir: bilgi dendritlerden hücre gövdesine, oradan aksona doğru akar; akson da sinyali hedef hücrelere taşır.',
    seviye: 'temel',
  },
  {
    soru: 'Doğrudan sayım yöntemine göre erişkin bir erkek beyninde ortalama kaç nöron vardır?',
    secenekler: ['Yaklaşık 1 trilyon', 'Yaklaşık 86 milyar', 'Tam 100 milyar, bunun on katı da glia', 'Yaklaşık 16 milyar'],
    dogru: 1,
    aciklama:
      'İzotropik fraksiyonatörle yapılan sayımda ortalama 86,1 ± 8,1 milyar nöron ve aşağı yukarı aynı sayıda nöron olmayan hücre bulundu. “100 milyar nöron, on kat glia” kaynaksız bir efsanedir; 16 milyar ise yalnızca büyük beyin kabuğundaki nöron sayısıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin vücut kütlesinin yaklaşık %2’si kadardır. Vücudun enerji bütçesinin yaklaşık ne kadarını kullanır?',
    secenekler: ['Yaklaşık %2’sini', 'Yaklaşık %5’ini', 'Yaklaşık %20’sini', 'Yarısından fazlasını'],
    dogru: 2,
    aciklama:
      'Beyin vücut kütlesinin %2’siyle enerji bütçesinin yaklaşık %20’sini tüketir; glikozun %25’ini, oksijenin yaklaşık %20’sini kullanır. Herculano-Houzel’e göre bunun nedeni insan beynindeki nöronların çokluğudur.',
    seviye: 'temel',
  },
  {
    soru: 'Yaşam boyu MR eğrilerine göre toplam kabuk (kortikal) gri cevheri hacmi yaklaşık hangi yaşta en yüksektir?',
    secenekler: ['Doğumda', 'Yaklaşık 6 yaşında', 'Yaklaşık 29 yaşında', 'Yaklaşık 50 yaşında'],
    dogru: 1,
    aciklama:
      '101.457 kişinin MR taramalarına göre toplam kabuk gri cevheri hacmi 5,9 yaşında zirve yapar ve sonra neredeyse doğrusal azalır. Yaklaşık 29 yaş ise beyaz cevher hacminin zirvesidir; derin (subkortikal) gri cevher hacmi 14,4 yaşında zirve yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin sapı hangi üç bölümden oluşur?',
    secenekler: [
      'Talamus, hipotalamus ve pons',
      'Orta beyin, pons ve omurilik soğanı',
      'Beyincik, pons ve orta beyin',
      'Kabuk, talamus ve omurilik',
    ],
    dogru: 1,
    aciklama:
      'Beyin sapı yukarıdan aşağıya orta beyin, pons ve omurilik soğanından oluşur. Talamus ve hipotalamus ara beyne aittir; beyincik metensefalondan gelse de beyin sapına sayılmaz.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin kütlesinin yalnızca onda biri kadar olduğu hâlde nöronların çoğunu taşıyan bölüm hangisidir?',
    secenekler: ['Büyük beyin kabuğu', 'Beyin sapı', 'Ara beyin', 'Beyincik'],
    dogru: 3,
    aciklama:
      'Beyincik beyin kütlesinin yaklaşık %10’udur ama 86 milyar nöronun yaklaşık 69 milyarını taşır. Büyük beyin kabuğunda yaklaşık 16 milyar nöron vardır; eski bir derlemeye göre beyin sapında 1 milyardan az nöron bulunur.',
    seviye: 'temel',
  },
  {
    soru: 'Frontal lobu parietal lobdan ayıran oluk hangisidir?',
    secenekler: ['Merkezî oluk', 'Lateral oluk', 'Parieto-oksipital oluk', 'Uzunlamasına yarık'],
    dogru: 0,
    aciklama:
      'Merkezî oluk frontal lobu parietal lobdan ayırır; önünde presantral (hareket), arkasında postsantral (bedensel duyu) girus bulunur. Lateral oluk temporal lobun üst sınırıdır, uzunlamasına yarık iki yarımküreyi ayırır.',
    seviye: 'temel',
  },
  {
    soru: 'Birincil görme kabuğu hangi lobdadır?',
    secenekler: ['Frontal lob', 'Parietal lob', 'Temporal lob', 'Oksipital lob'],
    dogru: 3,
    aciklama:
      'Birincil görme kabuğu (Brodmann 17) oksipital lobda, kalkarin yarığın iki yanındadır. Oksipital lob birincil ve üst düzey görme kabuğunu birlikte içerir.',
    seviye: 'temel',
  },
  {
    soru: 'Sinir sisteminin nöronlarını yapacak nöral plak hangi germ yaprağından gelişir?',
    secenekler: ['Endoderm', 'Mezoderm', 'Ektoderm', 'Notokord'],
    dogru: 2,
    aciklama:
      'Döllenmeden 16 gün sonra embriyonun hücreleri üç germ yaprağına ayrılmıştır; en dıştaki ektoderm hem deriyi hem de sinir sistemini yapar (OpenStax 13.1) ve nöral plak ektodermden ayrılan nöroektodermden gelişir (Catala, 2021). Notokord ise borunun karın tarafını yönlendiren sinyaller salgılar. Mikroglia bir istisna olabilir: büyük olasılıkla mezodermal kökenlidir (Waymire, 2026).',
    seviye: 'temel',
  },
  {
    soru: 'Beş kesecik evresinde hangi birincil kesecik daha ince bölümlere ayrılmaz?',
    secenekler: ['Orta beyin (mezensefalon)', 'Ön beyin (prosensefalon)', 'Arka beyin (rombensefalon)', 'Hepsi ikiye ayrılır'],
    dogru: 0,
    aciklama:
      'Ön beyin uç beyin ve ara beyne, arka beyin metensefalon ve miyelensefalona ayrılır; orta beyin bölünmez ve yetişkinde de orta beyin olarak kalır (OpenStax 13.1).',
    seviye: 'temel',
  },
  {
    soru: 'Yetişkinde omurilik çoğunlukla hangi hizada biter?',
    secenekler: ['Kafatası tabanında', '7. boyun omurunda', '1.–2. bel omuru dolayında', 'Sağrı kemiğinin ucunda'],
    dogru: 2,
    aciklama:
      'Omurilik foramen magnumda başlar ve yetişkinde çoğunlukla 1. ya da 2. bel omuru hizasında konus medullaris ile biter. Konusun altında omurga kanalında yalnızca sinir kökleri vardır.',
    seviye: 'temel',
  },
  {
    soru: 'Konus medullarisin altında omurga kanalında aşağı doğru uzanan bel ve sağrı kökleri demetine ne ad verilir?',
    secenekler: ['At kuyruğu (cauda equina)', 'Boyun genişlemesi', 'Filum terminale', 'Sempatik gövde'],
    dogru: 0,
    aciklama:
      'Bu uzun kök demeti, görünüşü ve uzunluğu yüzünden at kuyruğu (cauda equina) adını almıştır. Filum terminale ise konustan aşağı uzanan ince bir ipliktir; sinir kökü değildir.',
    seviye: 'temel',
  },
  {
    soru: 'Aşağıdaki kafa sinirlerinden hangisi yalnızca duyu lifi taşır?',
    secenekler: ['Okülomotor sinir (III)', 'Vestibulokoklear sinir (VIII)', 'Fasiyal sinir (VII)', 'Hipoglossal sinir (XII)'],
    dogru: 1,
    aciklama:
      'Ders kitabı sınıflamasında I, II ve VIII yalnızca duyu lifi taşır. III ve XII hareket siniridir; VII ise karmadır ve parasempatik lif de taşır.',
    seviye: 'temel',
  },
  {
    soru: 'Bir omurilik sinirinin arka (dorsal) kökü ne taşır?',
    secenekler: [
      'Duyu aksonlarını omuriliğe getirir',
      'Yalnızca otonom hareket liflerini dışarı taşır',
      'İskelet kaslarına giden hareket komutlarını taşır',
      'Beyin-omurilik sıvısını omurga dışına taşır',
    ],
    dogru: 0,
    aciklama:
      'Duyu aksonları arka kökle girer; gövdeleri arka kök gangliyonundadır. Somatik ve otonom hareket lifleri ön kökle çıkar. İki kök birleşince karma omurilik siniri oluşur.',
    seviye: 'temel',
  },
  {
    soru: 'Kalbi yavaşlatan ve sindirimi artıran otonom kol hangisidir?',
    secenekler: ['Sempatik kol', 'Somatik sinir sistemi', 'Parasempatik kol', 'Hiçbiri; bunlar istemli hareketlerdir'],
    dogru: 2,
    aciklama:
      'Parasempatik kol “dinlen ve sindir” hâlini yönetir: kalbi dinlenme hızına yavaşlatır, sindirim salgısını ve hareketini artırır. Sempatik kol bunların tersini yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Otonom işlevin merkezî denetiminin çoğu hangi beyin bölgesinden gelir?',
    secenekler: ['Hipotalamus', 'Beyincik', 'Oksipital lob', 'Korpus kallozum'],
    dogru: 0,
    aciklama:
      'Otonom denetimin çoğu ara beyindeki hipotalamustan gelir; merkezî otonom ağın en önemli hipotalamus çekirdeği paraventriküler çekirdektir.',
    seviye: 'temel',
  },
  {
    soru: 'Beyni saran üç zarın dıştan içe doğru sırası hangisidir?',
    secenekler: [
      'Yumuşak zar, örümcek ağı zar, sert zar',
      'Örümcek ağı zar, sert zar, yumuşak zar',
      'Sert zar, örümcek ağı zar, yumuşak zar',
      'Sert zar, yumuşak zar, örümcek ağı zar',
    ],
    dogru: 2,
    aciklama:
      'Dıştan içe sert zar (dura mater), örümcek ağı zar (arachnoidea mater) ve yumuşak zar (pia mater) gelir. BOS, örümcek ağı zar ile yumuşak zar arasındaki subaraknoid aralıkta dolaşır.',
    seviye: 'temel',
  },
  {
    soru: 'Yetişkinde herhangi bir anda yaklaşık 150 mL BOS bulunur. Günde yaklaşık ne kadar BOS yapılır?',
    secenekler: ['Yaklaşık 50 mL', 'Yaklaşık 150 mL', 'Yaklaşık 5 litre', 'Yaklaşık 500 mL'],
    dogru: 3,
    aciklama:
      'BOS dakikada 0,3–0,4 mL, günde yaklaşık 430–530 mL yapılır. Aynı anda bulunan miktar ~150 mL olduğu için BOS bir günde 3–4 kez yenilenir.',
    seviye: 'temel',
  },
  {
    soru: 'Willis halkasının beyin için en önemli yararı nedir?',
    secenekler: [
      'Beyin-omurilik sıvısını yapmak',
      'Bir parçası daralsa ya da tıkansa bile beynin beslenmesini sürdürebilmek',
      'Beynin toplardamar kanını iç juguler venlere taşımak',
      'Kan-beyin engelini kurmak',
    ],
    dogru: 1,
    aciklama:
      'Willis halkası beynin tabanında iç karotis ve vertebral–baziler sistemleri birbirine bağlayan bir atardamar kavşağıdır; bir parçası daralsa ya da tıkansa bile kanlanmayı sürdürebilir. Gerçekte halkanın bir ya da birkaç parçası çoğu insanda ince ya da eksiktir; oran tanıma göre değişir.',
    seviye: 'temel',
  },
  {
    soru: 'Sağ yarımküredeki hareket kabuğu hasar görürse kol ve bacak güçsüzlüğü en çok nerede beklenir?',
    secenekler: ['Sağ kol ve bacakta', 'Sol kol ve bacakta', 'Yalnızca yüzde', 'İki yanda eşit olarak'],
    dogru: 1,
    aciklama:
      'Kortikospinal yol büyük ölçüde çaprazlaşır: sağ yarımkürenin hareket kabuğu vücudun sol yarısındaki kasları yönetir, sol yarımküreninki sağ yarısındakileri (OpenStax 14.3).',
    seviye: 'temel',
  },
  {
    soru: 'Hangisi alt motor nöron hasarının bulgusudur?',
    secenekler: ['Pozitif Babinski belirtisi', 'Abartılı refleksler', 'Hıza bağlı spastisite', 'Kasta erime ve seğirmeler (fasikülasyon)'],
    dogru: 3,
    aciklama:
      'Alt motor nöron hasarında kas trofik destekten yoksun kalıp erir, hasarlı nöronlar seğirmelere yol açar ve refleksler azalır. Babinski, abartılı refleksler ve spastisite üst motor nöron hasarının bulgularıdır (Knierim, 2026).',
    seviye: 'temel',
  },
  {
    soru: 'Konnektom nedir?',
    secenekler: [
      'Nöronlar arasındaki bağlantıların haritası',
      'Beyin dalgalarının kaydı',
      'Beyin kabuğunun loblara bölünmüş haritası',
      'Bir hücrenin okuduğu genlerin listesi',
    ],
    dogru: 0,
    aciklama:
      'Konnektom, nöronlar arasındaki bağlantıların haritasıdır; elektron mikroskobu görüntüleri toplanıp çözümlenerek çıkarılır (Dorkenwald ve ark., 2024).',
    seviye: 'temel',
  },
  {
    soru: 'FlyWire projesinde hangi canlının bütün beyninin bağlantı şeması çıkarıldı?',
    secenekler: ['Fare', 'İnsan', 'Meyve sineği', 'Marmoset'],
    dogru: 2,
    aciklama:
      'FlyWire, bir dişi meyve sineğinin (Drosophila melanogaster) bütün beyninde 139.255 nöronu yeniden kurdu (Dorkenwald ve ark., 2024). Farede ve insanda şimdilik milimetreküplük parçalar yeniden kuruldu.',
    seviye: 'temel',
  },
  {
    soru: 'Retina aksonları gözden optik kiazmaya kadar “optik sinir”, kiazmadan sonra “optik yol” adını alır. Optik sinir için hangisi doğrudur?',
    secenekler: [
      'Dokusu tümüyle ÇSS’dir; miyelinini Schwann hücreleri yapar',
      'TA2 onu MSS’nin yolları arasında sayar',
      'Adı sinirdir ama dokusu MSS’nin uzantısıdır; miyelinini oligodendrositler yapar',
      'Nöron gövdelerinden oluşan bir gangliyondur',
    ],
    dogru: 2,
    aciklama:
      'Optik sinir histolojik olarak MSS’nin uzantısıdır ve oligodendrositlerle miyelinlenir (Romano ve ark., 2019); TA2 ise onu kafa sinirleri arasında, ÇSS başlığı altında sınıflar. Adı ile dokusu ayrışan bir örnektir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bir sinir kökçüğündeki MSS–ÇSS geçiş bölgesi için hangisi doğrudur?',
    secenekler: [
      'Merkez tarafında miyelini oligodendrositler, çevre tarafında Schwann hücreleri yapar; kafa sinirlerinde bu geçişe Obersteiner–Redlich bölgesi denir',
      'Yalnızca omurilik köklerinde bulunur; kafa sinirlerinde böyle bir geçiş yoktur',
      'Omurilikte yalnızca ön köklerin çıkış noktalarında bulunur; arka köklerde yoktur',
      'Merkez tarafında miyelini Schwann hücreleri, çevre tarafında oligodendrositler yapar',
    ],
    dogru: 0,
    aciklama:
      'Geçiş bölgesinin merkez tarafında miyelini oligodendrositler yapar ve destek dokusu astrositiktir; çevre tarafında miyelini endonöryumla sarılı Schwann hücreleri yapar (Fraher, 2000). Omurilikte bu sınır hem ön köklerin motor çıkış noktalarında hem arka kök giriş bölgelerinde bulunur (Fontenas, 2023); kafa sinirlerindeki aynı geçişe Obersteiner–Redlich bölgesi denir (Okuhata ve ark., 2026).',
    seviye: 'lisans',
  },
  {
    soru: 'Radyolojik gösterimle sunulan aksiyel bir MR kesitinde ekranın sağ yanında hastanın hangi tarafı görünür?',
    secenekler: ['Hastanın sol tarafı', 'Hastanın sağ tarafı', 'Hastanın ön tarafı', 'Görüntüye göre değişir, kural yoktur'],
    dogru: 0,
    aciklama:
      'Radyolojik gösterimde kesite hastanın ayak ucundan bakılıyormuş gibidir: hastanın solu ekranın sağındadır. Nörolojik gösterimde ise hastanın sağı ekranın sağındadır. Bu yüzden R ve L işaretlerine bakılmadan taraf söylenmez.',
    seviye: 'lisans',
  },
  {
    soru: 'Omurilikte “rostral” hangi yönü gösterir?',
    secenekler: ['Karına doğru (ön)', 'Sırta doğru (arka)', 'Omuriliğin alt ucuna doğru (aşağı)', 'Başa doğru (yukarı)'],
    dogru: 3,
    aciklama:
      'Rostral beyinde öne, omurilikte başa (yukarıya) doğrudur. Fark, insanda dik duruşun sinir eksenini orta beyin hizasında yaklaşık 90 derece bükmesinden gelir.',
    seviye: 'lisans',
  },
  {
    soru: 'Çevresel sinir sisteminde miyelini hangi hücre yapar ve bu hücre kaç akson segmentini sarar?',
    secenekler: [
      'Schwann hücresi; tek bir aksonun yalnızca bir segmentini',
      'Oligodendrosit; birçok aksonun birçok segmentini',
      'Schwann hücresi; birçok aksonun birçok segmentini',
      'Satellit hücre; gangliyondaki bütün aksonları',
    ],
    dogru: 0,
    aciklama:
      'ÇSS’de miyelini Schwann hücresi yapar ve tek bir aksonun yalnızca bir segmentini sarar. MSS’de miyelini yapan oligodendrosit ise aynı ya da ayrı aksonların birden çok segmentine miyelin verir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bir çevresel sinirde fasikülleri saran ve endonöryum ile dış dokular arasındaki ana difüzyon bariyerini oluşturan kılıf hangisidir?',
    secenekler: ['Epinöryum', 'Endonöryum', 'Perinöryum', 'Miyelin kılıfı'],
    dogru: 2,
    aciklama:
      'Perinöryum akson–Schwann hücresi birimlerini fasiküllere ayırır ve ana difüzyon bariyeridir. Epinöryum çoğunlukla kollajendir ve sinire gerilme dayanıklılığı verir ama bariyer yapmaz; endonöryum tek tek aksonları saran gevşek bağ dokusudur.',
    seviye: 'lisans',
  },
  {
    soru: 'Genç erişkinler için önerilen beyin ağırlığı başvuru aralıkları (ör. kadında 1033–1404 g) 80 yaşındaki bir kişiye neden doğrudan uygulanamaz?',
    secenekler: [
      'Bu aralıklar yalnızca MR ile ölçülmüştür',
      'Beyin ağırlığı yaşla artar',
      'Aralıklar 18–35 yaş arası kişilerden elde edilmiştir ve beyin yaşla hafifler',
      'Beyin ağırlığı cinsiyete göre değişmez',
    ],
    dogru: 2,
    aciklama:
      'Molina ve DiMaio’nun aralıkları ani travmatik ölümle kaybedilen 18–35 yaş arası kişilerden gelir. Beyin ağırlığında azalma 45–50 yaş dolayında başlar ve her yıl birkaç gram sürer; bu yüzden yaşa, cinsiyete ve boya uygun bir değerle karşılaştırma gerekir.',
    seviye: 'lisans',
  },
  {
    soru: 'Miyelinleşmenin takvimi için hangisi doğrudur?',
    secenekler: [
      'Anne karnında omurilikte başlar; ilişkilendirme yollarının çoğunda 20’li yaşlarda da sürer',
      'Doğumda bütünüyle tamamlanmıştır',
      'İlk miyelinlenen yer kabuğun kendi içindeki liflerdir',
      'Ergenlikten sonra beyaz cevherde hiçbir değişiklik olmaz',
    ],
    dogru: 0,
    aciklama:
      'Bir derlemeye göre miyelinleşme omurilikte gebeliğin 12–14. haftasında başlar (başka bir derleme başlangıcı 16. hafta olarak verir); en hızlı dönemi gebelik ortasından doğum sonrası 2. yılın sonuna kadardır ve ilişkilendirme yollarının çoğunda 20’li yaşlarda da sürer. Kabuk içi lifler en son miyelinlenir ve beyaz cevher yaşla küçülür.',
    seviye: 'lisans',
  },
  {
    soru: 'Hangi kafa sinirlerinin çekirdekleri ponsun tegmentumundadır?',
    secenekler: ['III ve IV', 'V, VI, VII ve VIII', 'IX ve X', 'XI ve XII'],
    dogru: 1,
    aciklama:
      'Ponsun tegmentumunda V, VI, VII ve VIII. sinirlerin çekirdekleri bulunur. III ve IV (ve V’in bir bölümü) orta beyinde, IX–XII omurilik soğanındadır.',
    seviye: 'lisans',
  },
  {
    soru: 'Striatum hangi yapılardan oluşur?',
    secenekler: ['Talamus ve hipotalamus', 'Putamen ve globus pallidus', 'Hipokampus ve amigdala', 'Kaudat çekirdek ve putamen'],
    dogru: 3,
    aciklama:
      'Kaudat çekirdek ile putamen birlikte striatum adını alır; bazal çekirdeklerin kabuktan gelen bütün girdisi striatuma ulaşır. Globus pallidusun ise dış ve iç iki bölümü vardır.',
    seviye: 'lisans',
  },
  {
    soru: 'Postsantral girustaki birincil bedensel duyu kabuğu hangi Brodmann alanlarına karşılık gelir?',
    secenekler: ['17', '41 ve 42', '1, 2 ve 3', '4'],
    dogru: 2,
    aciklama:
      'Postsantral girus birincil bedensel duyu kabuğudur: Brodmann 1, 2 ve 3. Alan 4 birincil hareket, 41 ve 42 birincil işitme, 17 birincil görme kabuğudur.',
    seviye: 'lisans',
  },
  {
    soru: 'Ayak ve bacak kaslarını yöneten nöronlar hareket kabuğunun neresindedir?',
    secenekler: [
      'Presantral girusun iç (medial) duvarında',
      'Presantral girusun lateral oluğa yakın alt ucunda',
      'Postsantral girusta',
      'Oksipital lobda',
    ],
    dogru: 0,
    aciklama:
      'Hareket kabuğu somatotopiktir; ayak ve bacağın temsili presantral girusun iç duvarındadır. İnce hareketler yapan el ve yüzün temsili ise orantısız büyüktür. Bu duvarla sınırlı bir hasar en çok karşı bacağı etkiler.',
    seviye: 'lisans',
  },
  {
    soru: 'Açık spina bifida ile deriyle örtülü (kapalı) alt sağrı-kuyruk sokumu disrafizmi arasındaki gelişimsel fark hangisidir?',
    secenekler: [
      'İkisi de ön nöroporun kapanmamasından doğar',
      'Açık spina bifida birincil nörülasyonun kapanma kusurundan, kapalı disrafizm ikincil nörülasyonun bozulmasından doğar',
      'Açık spina bifida ikincil, kapalı disrafizm birincil nörülasyonla ilişkilidir',
      'İkisi de nöral krista göçünün bozulmasıdır',
    ],
    dogru: 1,
    aciklama:
      'Açık spina bifida (miyelomeningosel) çoğunlukla bel ve üst sağrı düzeyinde birincil borunun kapanma kusurundan doğar; deriyle örtülü disrafik durumlar ise alt sağrı ve kuyruk sokumu düzeyinde, nöral kıvrım oluşmadan boru yapan ikincil nörülasyonun bozulmasından kaynaklanır (Santos ve ark., 2024).',
    seviye: 'lisans',
  },
  {
    soru: 'Hangisi nöral kristadan değil, kafa plakodlarından gelişir?',
    secenekler: [
      'Arka kök gangliyonunun duyu nöronları',
      'Böbrek üstü bezinin kromafin hücreleri',
      'Enterik sinir sistemi',
      'Göz merceği ve ön hipofiz',
    ],
    dogru: 3,
    aciklama:
      'Kafa plakodları ön hipofizi, koku epitelini, göz merceğini ve V, VII, IX, X gangliyonlarındaki büyük nöronları yapar (Zine ve Fritzsch, 2023). Arka kök gangliyonları ve kromafin hücreler gövde nöral kristasından, enterik sinir sistemi vagal nöral kristadan gelir (Simões-Costa ve Bronner, 2013).',
    seviye: 'lisans',
  },
  {
    soru: 'Boyunda 7 omur olduğu hâlde neden 8 çift boyun siniri vardır?',
    secenekler: [
      'Atlasın iki ayrı siniri vardır',
      'C8 göğüs omuriliğinden çıkıp boyna döner',
      'Boyun omurlarından ikisi doğumdan sonra kaynaşır',
      'C1 kafatası ile atlas arasından, C8 ise C7 ile T1 omurları arasından çıkar',
    ],
    dogru: 3,
    aciklama:
      'İlk boyun siniri kafatası ile atlas arasından çıkar; C8 ise 7. boyun omuru ile 1. göğüs omuru arasından çıkar. Göğüs ve bel sinirleri aynı adlı omurun altından çıktığı için sayılar orada eşitlenir.',
    seviye: 'lisans',
  },
  {
    soru: 'Ankara’da Hacettepe Üniversitesi’nde 639 kişinin lomber MR’ında konus medullaris en sık hangi düzeyde bulundu?',
    secenekler: ['T10–T11 diski', 'T12–L1 diski', 'L3–L4 diski', 'L5 omuru'],
    dogru: 1,
    aciklama:
      'Hacettepe serisinde konus en sık T12–L1 diski hizasındaydı ve yaşla değişmiyordu. Düzce serisinde ise en sık düzey kadınlarda L1–L2, erkeklerde T12–L1 diskiydi.',
    seviye: 'lisans',
  },
  {
    soru: 'Trigeminal sinirin ikinci dalı (V2) kafatasını hangi delikten terk eder?',
    secenekler: ['Oval delik', 'Juguler delik', 'İç kulak yolu', 'Yuvarlak delik (foramen rotundum)'],
    dogru: 3,
    aciklama:
      'V1 üst orbital yarıktan, V2 yuvarlak delikten, V3 oval delikten çıkar. Juguler delikten IX, X ve XI; iç kulak yolundan VII ve VIII geçer.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e (1918) ve güncel bir derlemeye göre kol ağının (brakiyal pleksus) klasik kök değeri hangisidir?',
    secenekler: ['C1–C4', 'C5–T1', 'C3–C5', 'L4–S3'],
    dogru: 1,
    aciklama:
      'Kol ağı C5–C8 ile T1’in ön dallarından oluşur. Bir ders kitabının verdiği C4–T1 değeri ağa katkı yapan komşu sinirleri de sayar; C4 genellikle C5’e bir dal verir.',
    seviye: 'lisans',
  },
  {
    soru: 'Sempatik gövdede her yanda tipik olarak kaç gangliyon bulunur?',
    secenekler: ['12', '31', '23', '43'],
    dogru: 2,
    aciklama:
      'Her yanda tipik olarak 23 gangliyon vardır: 3 boyun, 12 göğüs, 4 bel ve 4 sağrı. İki gövde aşağıda kuyruk sokumunun önündeki ganglion imparda birleşir.',
    seviye: 'lisans',
  },
  {
    soru: 'Ter bezlerine giden sempatik postganglionik lifler hangi haberciyi salar?',
    secenekler: ['Noradrenalin', 'Asetilkolin', 'Adrenalin', 'Dopamin'],
    dogru: 1,
    aciklama:
      'Sempatik postganglionik liflerin çoğu noradrenalin salar; ter bezlerine ve iskelet kası damarlarına gidenler ise asetilkolin salar. Bütün preganglionik lifler de asetilkolin salar.',
    seviye: 'lisans',
  },
  {
    soru: 'Enterik sinir sistemi için hangisi doğrudur?',
    secenekler: [
      'Submukozal ağ mide ve yemek borusunda da bulunur',
      'Bütün sindirim kanalında hareketi ağırlıkla MSS yönetir',
      'Nöron sayısı birkaç milyonla sınırlıdır',
      'Miyenterik ağ yemek borusunun üst kısmından iç anal büzgene kadar kesintisiz uzanır',
    ],
    dogru: 3,
    aciklama:
      'Miyenterik (Auerbach) ağ yemek borusunun üst kısmından iç anal büzgene kadar uzanır; submukozal (Meissner) ağ ise ince ve kalın bağırsakta vardır, mide ve yemek borusunda yoktur. Güncel derlemeler 200–600 milyon ya da daha fazla enterik nöron bildirir; ince ve kalın bağırsakta enterik sistem tam refleks devreleri taşır (Furness ve ark., 2014).',
    seviye: 'lisans',
  },
  {
    soru: 'Koroid pleksusta kan-BOS engelini hangi yapı kurar?',
    secenekler: [
      'Koroid pleksusun epitel hücreleri ve aralarındaki sıkı bağlantılar',
      'Koroid pleksus kılcallarının endoteli',
      'Karıncıkları döşeyen ependim',
      'Yumuşak zar',
    ],
    dogru: 0,
    aciklama:
      'Koroid pleksusun kılcalları pencerelidir ve kandan gelen moleküllerin geçişine izin verir; engeli onları saran epitel hücreleri, tepe yüzlerindeki sıkı bağlantılarla kurar. Ependim yetişkinde bir difüzyon engeli değildir; yumuşak zarda sıkı bağlantı yoktur.',
    seviye: 'lisans',
  },
  {
    soru: 'Lomber ponksiyonla alınan BOS’ta aşağıdakilerden hangisi başvuru değerlerinin dışındadır?',
    secenekler: ['Berrak ve renksiz görünüm', 'Mikrolitrede 3 çekirdekli hücre', 'Toplam protein 900 mg/L', 'BOS/serum glikoz oranı 0,65'],
    dogru: 2,
    aciklama:
      'Başvuru değerleri: berrak ve renksiz, mikrolitrede 5’ten az çekirdekli hücre, toplam protein 500 mg/L’nin altı, BOS/serum glikoz oranı 0,50’nin üstü. 900 mg/L protein üst sınırın belirgin üstündedir.',
    seviye: 'lisans',
  },
  {
    soru: 'Nicel EEG çalışmalarına göre nöronların zar gradyanlarını yitirmeye başladığı kritik iskemi eşiği yaklaşık kaçtır?',
    secenekler: ['Yaklaşık 50 mL/100 g/dk', 'Yaklaşık 17–18 mL/100 g/dk', 'Yaklaşık 25–35 mL/100 g/dk', 'Yaklaşık 80 mL/100 g/dk'],
    dogru: 1,
    aciklama:
      '50 normal ortalama akım, 80 genç yetişkinde gri cevherin akımıdır. 25–35’te EEG hızlı dalgalarını yitirir; 17–18 kritik iskemi eşiğidir ve bu düzeyde enfarkt saatlerce gecikebilir; 10–12 ve altı enfarkt eşiğidir.',
    seviye: 'lisans',
  },
  {
    soru: 'Göz kapağı düşüklüğü, çift görme ve gün içinde artan proksimal güçsüzlüğü olan, duyu kaybı olmayan bir hastada hasarın en olası yeri neresidir?',
    secenekler: ['Sinir-kas kavşağı', 'Omurilik', 'Kol sinir ağı', 'Beyin kabuğu'],
    dogru: 0,
    aciklama:
      'Myastenia gravis gibi sinir-kas kavşağı hastalıkları tipik olarak göz, bulber, boyun, solunum ve proksimal kasları tutar; yorulabilirlik vardır ve duyu kaybı olmaz (Quak ve ark., 2026).',
    seviye: 'lisans',
  },
  {
    soru: 'Kafa siniri bulgularıyla birlikte karşı tarafta hemiparezi (çapraz hemiparezi) hangi düzeyi düşündürür?',
    secenekler: ['Beyin kabuğu', 'Omurilik', 'Beyin sapı', 'Çevresel sinir'],
    dogru: 2,
    aciklama:
      'Beyin sapında kafa sinirlerinin hareket çekirdekleri (alt motor nöronlar) ile omuriliğe inen kortikospinal lifler bir aradadır; kafa siniri bulgusu ile karşı tarafta hemiparezinin birlikteliği beyin sapını düşündürür (Quak ve ark., 2026).',
    seviye: 'lisans',
  },
  {
    soru: 'BigBrain için hangisi doğrudur?',
    secenekler: [
      'Binlerce kişinin MR görüntüsünün ortalamasıdır',
      'Bir fare beyninin elektron mikroskobu modelidir',
      'Yalnızca beyin kabuğunun iki boyutlu haritasıdır',
      '7404 doku kesitinden kurulmuş, yaklaşık 20 µm çözünürlükte üç boyutlu bir insan beyni modelidir',
    ],
    dogru: 3,
    aciklama:
      'BigBrain, 7404 histolojik kesitten yeniden kurulmuş, hücre düzeyine yakın, yaklaşık 20 mikrometre çözünürlükte üç boyutlu bir insan beyni modelidir (Amunts ve ark., 2013).',
    seviye: 'lisans',
  },
  {
    soru: 'İnsan beyni hücre atlasında (Siletti ve ark., 2023) kümeler büyük ölçüde neye göre düzenleniyordu?',
    secenekler: ['Donörün yaşına göre', 'Gelişimsel kökenlerine göre', 'Hücrenin büyüklüğüne göre', 'Kan damarlarına uzaklığa göre'],
    dogru: 1,
    aciklama:
      '3 milyondan fazla çekirdekte bulunan 461 küme ve 3313 alt küme büyük ölçüde gelişimsel kökenlerine göre düzenleniyordu; orta beyin ve arka beyin nöronlarında çeşitlilik yüksekti (Siletti ve ark., 2023).',
    seviye: 'lisans',
  },
  {
    soru: 'Peker ve arkadaşlarının (2006) trigeminal sinir ölçümlerine göre hangisi doğrudur?',
    secenekler: [
      'Merkezi miyelin sinirin bütün sisternal kesimini kaplar',
      'Kök giriş bölgesi ile geçiş bölgesi her zaman aynı noktadır',
      'Merkezi miyelin ponstan iç yüzde ortalama 1,13 mm, dış yüzde 2,47 mm uzanır ve sinir boyunun yalnızca ilk dörtte birini kaplar',
      'Geçiş bölgesi trigeminal sinirde beyin sapına vagustakinden daha yakındır',
    ],
    dogru: 2,
    aciklama:
      'İstanbul’da 100 trigeminal sinirde merkezi miyelin iç yüzde ortalama 1,13 mm, dış yüzde 2,47 mm (en çok 6,75 mm) uzanıyor ve sinir boyunun ilk dörtte birini kaplıyordu; yani kök giriş bölgesi ile geçiş bölgesi aynı yer değildir. Guclu ve arkadaşlarına (2011) göre geçiş bölgesinin beyin sapına en uzak noktası trigeminalde (4,19 mm) vagustakinden (1,63 mm) daha uzaktadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Gray’e (1918) göre tipik bir omurilik sinirinde en az hangi dört lif türü bulunur?',
    secenekler: [
      'Somatik duyusal, visseral afferent, somatik motor ve visseral efferent (pregangliyoner)',
      'Koku, görme, işitme ve tat lifleri',
      'Yalnızca somatik motor ve somatik duyusal lifler',
      'Pregangliyoner, postgangliyoner, enterik ve kortikospinal lifler',
    ],
    dogru: 0,
    aciklama:
      'Gray tipik bir omurilik sinirinde somatik duyusal, (onun deyişiyle sempatik) visseral afferent, somatik motor ve visseral efferent (pregangliyoner) lifler sayar. Kafa sinirlerinde bunlara ek olarak koku, görme, işitme, denge ve tat gibi özel duyuların sinirleri bulunur.',
    seviye: 'ileri',
  },
  {
    soru: 'Talairach uzayında koordinatların başlangıç noktası (0, 0, 0) neresidir?',
    secenekler: ['Arka komissür (PC)', 'Ön komissür (AC)', 'Talamusun orta noktası', 'Nasion'],
    dogru: 1,
    aciklama:
      'Talairach uzayında başlangıç noktası ön komissürdür (AC) ve Y ekseni arka komissürden (PC) geçer. MNI uzayında da başlangıç, MNI şablon beyninde ön komissürün orta hattı kestiği noktadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Nörogörüntüleme dosyalarında yaygın RAS+ kuralı ile DICOM’un LPS+ kuralı arasındaki fark nedir?',
    secenekler: [
      'Yalnızca z ekseninin yönü terstir',
      'Üç eksenin de yönü terstir',
      'x ve y eksenlerinin yönü terstir; z ekseni ikisinde de yukarı doğru artar',
      'İki kural aynıdır; yalnızca adları farklıdır',
    ],
    dogru: 2,
    aciklama:
      'RAS+ kuralında x sağa, y öne, z yukarı doğru artar; LPS+ kuralında x sola, y arkaya doğru artar. Hangi kuralın kullanıldığı bilinmeden yapılan dönüşüm sağı ve solu karıştırabilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Glia ile nöronların oranı için hangisi doğrudur?',
    secenekler: [
      'Bütün beyinde glia nöronlardan on kat fazladır',
      'Bütün beyinde oran 1:1’den küçüktür; ama talamusta nöron başına 17 glia vardır, beyincikte ise nöronlar gliadan en az 25 kat fazladır',
      'Oran beynin her bölgesinde aynıdır',
      'Omurilikte nöronlar gliadan fazladır',
    ],
    dogru: 1,
    aciklama:
      'İzotropik fraksiyonatör bütün beyinde glia–nöron oranının 1:1’in altında olduğunu gösterdi. Oran bölgeye göre çok değişir: talamusta 17, kabuk gri cevherinde 2’den az, omurilikte 5,6–7,1; beyincikte ise nöronlar gliadan en az 25 kat fazladır.',
    seviye: 'ileri',
  },
  {
    soru: 'Gray’in 1918 baskısındaki hangi görüş bugün geçerli değildir?',
    secenekler: [
      'Omurilik sinirlerinin arka köklerinde gangliyon bulunur',
      'Beyin ve omurilikteki miyelinli liflerde Schwann kılıfı (nörilemma) yoktur',
      'Kesilen bir sinir lifinin çevredeki ucu bütün boyunca yıkılır',
      'Neuroglia yalnızca beyin ve omurilikte bulunur',
    ],
    dogru: 3,
    aciklama:
      'Gray glianın yalnızca beyin ve omurilikte bulunduğunu yazmıştı; bugün ÇSS’de de glia olduğu biliniyor: Schwann hücreleri ve satellit hücreler. Öteki üç ifade bugünkü bilgiyle uyumludur.',
    seviye: 'ileri',
  },
  {
    soru: 'Howarth ve arkadaşlarının (2012) güncellenmiş enerji bütçesine göre beyin kabuğunda sinyal enerjisinin en büyük kalemi hangisidir?',
    secenekler: ['Aksiyon potansiyelleri', 'Dinlenim potansiyeli', 'Sinaps sonrası glutamat almaçları', 'Haberci maddenin geri dönüşümü'],
    dogru: 2,
    aciklama:
      'Güncel bütçede sinyal enerjisinin %50’si sinaps sonrası glutamat almaçlarına, %21’i aksiyon potansiyellerine, %20’si dinlenim potansiyeline gider. Aksiyon potansiyellerini en büyük kalem (%47) sayan 2001 bütçesi kemirgen gri cevheri içindi; aksiyon potansiyelinin daha verimli olduğu anlaşılınca güncellendi.',
    seviye: 'ileri',
  },
  {
    soru: 'Beyin kabuğunun yüzey alanıyla ilgili hangisi doğrudur?',
    secenekler: [
      'Dış (pial) yüzey, gri-beyaz cevher sınırında ölçülen yüzeyden yaklaşık 1,2 kat büyüktür',
      'Açılıp yayıldığında yaklaşık 1 m² tutar',
      'Beyincik kabuğunun yüzeyi neokorteksinkinin yaklaşık onda biridir',
      'Yüzeyin yalnızca onda biri oluklarda gizlidir',
    ],
    dogru: 0,
    aciklama:
      'Pial yüzey, gri-beyaz cevher sınırında ölçülen yüzeyin yaklaşık 1,2 katıdır (MR’a dayalı bir hesapla kadınlarda ~2038 cm²). Ölçümler ve tahminler 1 m² değil 0,16–0,2 m² verir; beyincik kabuğu neokorteks yüzeyinin %78’i kadardır ve kabuk yüzeyinin üçte ikisi oluklardadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Terminologia Anatomica 2’ye (TA2) göre "serebrum" teriminin kapsamı nedir?',
    secenekler: [
      'Yalnızca telensefalon',
      'Beyin sapı dahil bütün beyin',
      'Telensefalon ve beyincik',
      'Telensefalon ve diensefalon, yani ön beynin erişkindeki karşılığı',
    ],
    dogru: 3,
    aciklama:
      'TA2 serebrumu ön beynin (prosensefalon) erişkin karşılığı olarak tanımlar ve erişkin beynini serebrum, beyin sapı ve beyincik diye üçe ayırır. OpenStax ise serebrumu telensefalonla eş tutar; okurken hangi tanımın kullanıldığına bakmak gerekir.',
    seviye: 'ileri',
  },
  {
    soru: 'Göz bebeğinin ışık refleksinin merkezi neresidir?',
    secenekler: ['Hipotalamus', 'Ara beyin–orta beyin sınırındaki pretektal alan', 'Omurilik soğanı', 'Beyincik'],
    dogru: 1,
    aciklama:
      'Pretektal alan aksonlarının çoğunu arka komissürden iki yana, Edinger–Westphal çekirdeklerine gönderir; bu yüzden ışığa yanıt iki göz bebeğinde birden görülür. UTHealth pretektal alanı orta beyinde anlatır, TA2 ara beyne katar. İki taraflı pretektal hasar Argyll Robertson göz bebeklerine yol açar. Refleksi hipotalamusa bağlayan ders kitabı ifadesi kullanılmamalıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Birincil hareket kabuğunun katman yapısı için hangisi doğrudur?',
    secenekler: [
      'Dört katmanlıdır',
      'IV. (granüler) katmanı en kalın katmanıdır',
      'Hiç katmanı yoktur',
      'Altı katmanlıdır ama hücreden zengin IV. katmanı yoktur; en belirgin katmanı Betz hücrelerini taşıyan V. katmandır',
    ],
    dogru: 3,
    aciklama:
      'Birincil hareket kabuğu altı katmanlı neokortekstir ama birincil duyu alanlarından farklı olarak agranülerdir: hücreden zengin IV. katmanı yoktur. Kabukta dört katman sayan bilgi Gray’in döneminden kalmadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Kortikospinal yolun lifleri nereden gelir?',
    secenekler: [
      'Yaklaşık %30’u birincil hareket kabuğundan; kalanı premotor kabuk ve ek motor alandan, bedensel duyu kabuğundan ve arka parietal kabuktan',
      'Yalnızca Betz hücrelerinden',
      'Tamamı birincil hareket kabuğundan',
      'Çoğu beyincikten',
    ],
    dogru: 0,
    aciklama:
      'Birincil hareket kabuğunun projeksiyon nöronları (Betz hücreleri dahil) liflerin yalnızca ~%30’unu verir; ~%30’u premotor kabuk ve ek motor alandan, ~%30’u bedensel duyu kabuğundan, ~%10’u arka parietal kabuktan gelir.',
    seviye: 'ileri',
  },
  {
    soru: 'Sınır oluğunun (sulcus limitans) uzanımı için hangisi doğrudur?',
    secenekler: [
      'Bütün kaynaklar onun omurilikten uç beyne kadar kesintisiz uzandığında birleşir',
      'Terminologia Anatomica onu yalnızca üçüncü karıncığın duvarında tanımlar',
      'Nieuwenhuys’a göre karıncık yüzünde rombensefalonla sınırlıdır; Puelles ise His’e dayanarak oluğun optik kiazma yakınına kadar izlenebildiğini yazar',
      'Prosomerik modelde alar ve bazal plak ayrımı yoktur',
    ],
    dogru: 2,
    aciklama:
      'Nieuwenhuys (2011) karıncık yüzündeki sınır oluğunu rombensefalonla sınırlı bulur; Puelles (2024) His’e dayanarak oluğun bükümleri aşıp optik kiazma yakınında bittiğini yazar. TA2 oluğu yalnızca dördüncü karıncığın tabanında (fossa rhomboidea) tanımlar; prosomerik modelde de bazal plak hareket nöronlarını üretir.',
    seviye: 'ileri',
  },
  {
    soru: 'Santos ve ark. (2024) insan embriyolarında ikincil nörülasyon için ne buldu?',
    secenekler: [
      'Evre 13’ten itibaren tek bir lümenle ilerlediğini ve birincilden ikincile bir geçiş bölgesine dair kanıt olmadığını',
      'Civcivdeki gibi birden çok boşluğun birleşmesiyle ilerlediğini',
      'Döllenmeden sonraki 45–53. günlerde başladığını',
      'Arka nöroporun hiçbir embriyoda evre 18’den önce kapanmadığını',
    ],
    dogru: 0,
    aciklama:
      'Carnegie evre 10–18 arasındaki 108 insan embriyosunu inceleyen çalışmada (kaudal gelişim evre 13–18’deki 37 embriyoda incelendi) ikincil nörülasyon evre 13’ten (~28. gün) itibaren, faredeki gibi tek bir lümenle ilerliyordu; geçiş bölgesine dair kanıt yoktu ve arka nöropor embriyoların çoğunda evre 13’te kapalıydı (Santos ve ark., 2024). 45–53. gün aralığı bu gözlemlerle uyuşmaz.',
    seviye: 'ileri',
  },
  {
    soru: 'Doğu Afrika’daki 331 hastalık MR serisine göre iğne L1–L2 aralığından girilseydi omuriliklerin yaklaşık ne kadarı olası bir yaralanma riskiyle karşılaşırdı?',
    secenekler: ['Yaklaşık %2', 'Yaklaşık üçte biri', 'Yaklaşık dörtte üçü', 'Hiçbiri'],
    dogru: 1,
    aciklama:
      'Çalışmanın hesabına göre L1–L2 aralığında omuriliklerin %33,5’i, L2–L3 aralığında %2,1’i risk altındaydı; konusların %97,9’u L2 omurunda ya da üstünde bitiyordu.',
    seviye: 'ileri',
  },
  {
    soru: 'Gray’in (1918) “omurilik doğumda 3. bel omuru hizasında biter” bilgisi bugün nasıl değerlendirilir?',
    secenekler: [
      'Eskimiştir; güncel veriler doğumda konusun yaklaşık L2’de olduğunu ve doğumdan sonra çok az yükseldiğini gösterir',
      'Doğrudur; konus bütün çocukluk boyunca yükselerek L1’e ulaşır',
      'Yalnızca kız bebekler için geçerlidir',
      'Yalnızca üçüncü trimester fetüsleri için doğrudur, doğumda ise konus L4’tedir',
    ],
    dogru: 0,
    aciklama:
      'Fetüs meta-analizinde konusun L2’de ya da üstünde bulunma sıklığı 33. haftadan doğuma kadar %82’dir ve yazarlar doğumdaki yeri yaklaşık L2 kabul eder; yenidoğanla erişkin arasındaki fark yaklaşık çeyrek omurdur ve çocuk MR’ı konusun çocukluk boyunca yükselmediğini gösterir.',
    seviye: 'ileri',
  },
  {
    soru: 'Cerrahiyle doğrulanmış 227 boyun radikülopatisi hastasında standart dermatom düzenine uyan hastaların oranı yaklaşık ne kadardı?',
    secenekler: ['%25', '%90', '%63', '%100'],
    dogru: 2,
    aciklama:
      'Hastaların %62,6’sında standart dermatom düzeni görüldü; kas güçsüzlüğü olan 110 hastanın %67,3’ünde güçsüzlük standart miyotom düzenine uyuyordu. Dermatom haritası yararlı bir ipucudur ama kök düzeyini tek başına kesin göstermez.',
    seviye: 'ileri',
  },
  {
    soru: 'Trigeminal gangliyon hakkında hangisi doğrudur?',
    secenekler: [
      'Kafatasının dışında, boyunda bulunur',
      'Nöronları bipolardır',
      'Bir parasempatik gangliyondur',
      'Kafatasının içinde, sert zarın oluşturduğu boşlukta (Meckel boşluğu) bulunur',
    ],
    dogru: 3,
    aciklama:
      'Trigeminal gangliyon temporal kemiğin kayalık kısmının tepesine yakın, sert zarın oluşturduğu boşlukta yatan bir duyu gangliyonudur (TA2: cavum trigeminale). “Kafa siniri gangliyonları kafatası dışındadır” genellemesi bu yüzden yanlıştır.',
    seviye: 'ileri',
  },
  {
    soru: 'Sindirim kanalının hangi bölümünde hareketleri büyük ölçüde merkezî sinir sistemindeki örüntü üreteçleri belirler?',
    secenekler: [
      'Çizgili kaslı yemek borusu',
      'İnce bağırsak',
      'Kalın bağırsak',
      'Hiçbiri; bütün kanalı enterik sistem tek başına yönetir',
    ],
    dogru: 0,
    aciklama:
      'Çizgili kaslı yemek borusunun hareketlerini merkezî örüntü üreteçleri, midenin kasılması ve asit salgısını büyük ölçüde vago-vagal refleksler belirler; ince ve kalın bağırsakta ise enterik sistem tam refleks devreleri taşır. “İkinci beyin” bağımsızlığı bölgeye göre sınırlıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Beyaz bağlantı dalları yalnızca göğüs ve ilk bel sinirlerinden çıktığı hâlde sempatik gövdenin boyun bölümünde üç gangliyon vardır. Bundan ne çıkar?',
    secenekler: [
      'Boyun gangliyonları hiç preganglionik lif almaz',
      'Boyun gangliyonları parasempatik gangliyonlardır',
      'Boyun sinirleri de beyaz bağlantı dalı verir',
      'Baş ve boyna giden sempatik lifler üst göğüs omuriliğinden çıkıp gövde içinde yukarı ilerler',
    ],
    dogru: 3,
    aciklama:
      'Sempatik preganglionik nöronlar göğüs ve üst bel omuriliğindedir ve gövdeye beyaz dallarla girer. Boyun gangliyonlarına ulaşan lifler bu yüzden gövde içinde yukarı tırmanır; Horner sendromunda hasarın bu uzun zincirin herhangi bir halkasında aranması bundandır.',
    seviye: 'ileri',
  },
  {
    soru: 'Güncel anatomiye göre “subdural aralık” için hangisi doğrudur?',
    secenekler: [
      'Sert zar ile kafatası arasında sağlıklı insanda da bulunan bir boşluktur',
      'BOS ile dolu, sürekli açık bir aralıktır',
      'Yumuşak zar ile beyin dokusu arasındaki aralıktır',
      'Sağlıklı insanda yoktur; travma ya da kanamayla sert zarın en iç (dural sınır hücre) katmanında açılan bir yarıktır',
    ],
    dogru: 3,
    aciklama:
      'Dural sınır hücre katmanı 10 μm’den ince, 3–8 sıra yassı hücreden oluşan kırılgan bir katmandır; küçük kesme kuvvetleri onu yarabilir ve klinikte “subdural aralık” diye görülen düzlem açılır. TA2 de subdural aralığı “sabit olmayan” diye işaretler.',
    seviye: 'ileri',
  },
  {
    soru: 'SLYM’i (“dördüncü zar”) eleştirenlerin ana savı hangisidir?',
    secenekler: [
      'SLYM ayrı bir zar değil, iç (retiküler) araknoidin parçasıdır; “dış subaraknoid aralık” doku işleminin yarattığı yapay bir görüntüdür',
      'SLYM sert zarın dış (periostal) katmanıdır',
      'SLYM yalnızca omurilikte bulunur, beyinde yoktur',
      'SLYM kan-beyin engelinin asıl yeridir',
    ],
    dogru: 0,
    aciklama:
      'Neuhuber’e göre ayrı “dış” ve “iç” subaraknoid aralıklar tespit ve kireçten arındırma sırasında hiperozmotik stresin ürünü olabilir; Siegenthaler ve Betsholtz’a göre zar örümcek ağı zarın parçasıdır ve engel özelliği araknoid engel katmanına aittir. Tanımlayan grup da SLYM’in klasik literatürdeki iç araknoid olduğunu kabul eder; tartışma sürmektedir.',
    seviye: 'ileri',
  },
  {
    soru: 'Willis halkasında “tam halka” oranlarının seriler arasında %8 ile %85,4 arasında değişmesinin başlıca nedeni nedir?',
    secenekler: [
      'Türk toplumunun öteki toplumlardan kesin olarak farklı olması',
      'Kadavra çalışmalarının görüntülemeden her zaman daha doğru olması',
      'Tam halkanın ve hipoplazinin farklı tanımlanması (ör. 1 mm eşiği ya da yalnızca ageneziyi saymak)',
      'Halkanın yaşla hiç değişmemesi',
    ],
    dogru: 2,
    aciklama:
      'İzmir kadavra serisi hipoplaziyi de sayınca tipik halka %8, Tromsø 1 mm eşiğiyle %11,9, yalnızca ageneziyi sayan Muğla serisi %85,4 “normal” buldu. Derlemeler bu genişliği tanım ve hipoplazi ölçütü farkına bağlar; toplumlar arası fark olup olmadığı tartışmalıdır. Tromsø’da yaşla eksik parça sayısı artma eğilimindeydi.',
    seviye: 'ileri',
  },
  {
    soru: 'Kanada 2023 kılavuzuna göre nörolojik ölçütlerle ölüm belirlemesinin üç klinik koşulundan biri hangisi değildir?',
    secenekler: [
      'Uyaranlara uyanıklık ve farkındalık yanıtının olmaması (bilinç yokluğu)',
      'Kafa siniri testleriyle gösterilen beyin sapı işlevi yokluğu',
      'Resmî apne testiyle gösterilen soluma kapasitesi yokluğu',
      'Germe reflekslerinin alınamaması',
    ],
    dogru: 3,
    aciklama:
      'Kılavuza göre belirleme esasen klinik bir değerlendirmedir ve şu üç koşulun üçünü de ister: bilinç yokluğu, kafa siniri testleriyle gösterilen beyin sapı işlevi yokluğu ve resmî apne testiyle gösterilen soluma kapasitesi yokluğu (Shemie ve ark., 2023).',
    seviye: 'ileri',
  },
  {
    soru: 'İnmenin ölüm nedenleri arasındaki sırası için hangisi doğrudur?',
    secenekler: [
      'Bütün kaynaklarda birinci sıradadır',
      'GBD 2021’de üçüncü (iskemik kalp hastalığı ve COVID-19’dan sonra), DSÖ’nün 2023 verisinde ikincidir',
      'GBD 2021’de ikinci, DSÖ’nün 2023 verisinde dördüncüdür',
      'Hiçbir kaynakta ilk beşte değildir',
    ],
    dogru: 1,
    aciklama:
      'GBD 2021 inmeyi 2021’de üçüncü ölüm nedeni sayar (GBD 2021 Stroke Risk Factor Collaborators, 2024); DSÖ’nün 2023 verisinde ve WSO’da inme ikinci ölüm nedenidir (DSÖ, 2026; Feigin ve ark., 2025). Fark yıldan ve yöntemden gelir.',
    seviye: 'ileri',
  },
  {
    soru: 'H01 örneğinde bulunan “glia nöronların iki katı” oranı için hangisi doğru bir yorumdur?',
    secenekler: [
      'Bütün insan beyni için geçerli kesin orandır',
      'Tek bir milimetreküplük temporal kabuk parçasına aittir; bütün beyin oranlarıyla karıştırılmamalıdır',
      'Fare görme kabuğunda ölçülmüştür',
      'Meyve sineği beyninden elde edilmiştir',
    ],
    dogru: 1,
    aciklama:
      'H01, epilepsi ameliyatında çıkarılan bir milimetreküplük insan temporal kabuğudur; içindeki glia–nöron oranı (2:1) bu parçaya aittir ve bütün beyin için verilen oranlarla karıştırılmamalıdır (Shapson-Coe ve ark., 2024).',
    seviye: 'ileri',
  },
  {
    soru: 'FlyWire’da sinaps yoğunluğu memeli kabuğuyla karşılaştırıldığında nasıldır?',
    secenekler: [
      'Memeli kabuğuyla aynıdır',
      'Memeli kabuğunun onda biri kadardır',
      'Mikrometreküpte 7,4 sinapsla memeli kabuğundakinden (1’den az) çok yüksektir',
      'Yoğunluk ölçülmemiştir',
    ],
    dogru: 2,
    aciklama:
      'Görüntülerde otomatik saptanan sinapslara göre sinek beyni 0,0175 mm³ nöropilde yaklaşık 130 milyon sinaps içerir: mikrometreküpte 7,4 sinaps; memeli kabuğunda bu değer 1’in altındadır (Dorkenwald ve ark., 2024).',
    seviye: 'ileri',
  },
];
