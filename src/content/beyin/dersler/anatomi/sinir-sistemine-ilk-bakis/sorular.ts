import type { Soru } from '../../../types';

/** Bölüm sırasıyla temel, lisans ve uzman sorular. Doğru şıklar her düzeyin içinde dört yere dengeli dağıtılmıştır. */
export const sorular: Soru[] = [
  {
    soru: 'Ders kitapları sinir sisteminin işini hangi üç adımla özetler?',
    secenekler: ['Duyu, bütünleştirme, yanıt', 'Solunum, dolaşım, sindirim', 'Büyüme, onarım, üreme', 'Görme, işitme, dokunma'],
    dogru: 0,
    aciklama:
      'Sinir sistemi önce uyaranı fark eder (duyu). Sonra onu öteki duyularla, anılarla, duygu durumuyla ve öğrenilenlerle birleştirir (bütünleştirme). En sonda kasları ya da bezleri çalıştırır (yanıt).',
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
    soru: 'Beyinde “dorsal” denen yön nereye doğrudur?',
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
      'Sagital düzlem dikeydir ve beyni sağ ve sol diye ayırır. Tam orta hattan geçene orta sagital düzlem denir. Koronal (frontal) düzlem ön ve arkayı, horizontal (aksiyel) düzlem üst ve altı ayırır.',
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
      'Nöron kutuplu bir hücredir. Bilgi dendritlerden hücre gövdesine, oradan aksona doğru akar. Akson da sinyali hedef hücrelere taşır.',
    seviye: 'temel',
  },
  {
    soru: 'Doğrudan sayım yöntemine göre erişkin bir erkek beyninde ortalama kaç nöron vardır?',
    secenekler: ['Yaklaşık 1 trilyon', 'Yaklaşık 86 milyar', 'Tam 100 milyar, bunun on katı da glia', 'Yaklaşık 16 milyar'],
    dogru: 1,
    aciklama:
      'Hücreleri doğrudan sayan bir yöntemle (izotropik fraksiyonatör) ortalama 86,1 ± 8,1 milyar nöron bulundu. Nöron olmayan hücreler de aşağı yukarı aynı sayıdaydı. “100 milyar nöron, on kat glia” kaynaksız bir efsanedir. 16 milyar ise yalnızca büyük beyin kabuğundaki nöron sayısıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Beyin vücut kütlesinin yaklaşık %2’si kadardır. Vücudun enerji bütçesinin yaklaşık ne kadarını kullanır?',
    secenekler: ['Yaklaşık %2’sini', 'Yaklaşık %5’ini', 'Yaklaşık %20’sini', 'Yarısından fazlasını'],
    dogru: 2,
    aciklama:
      'Beyin vücut kütlesinin %2’si kadardır, ama enerji bütçesinin yaklaşık %20’sini tüketir. Glikozun %25’ini, oksijenin yaklaşık %20’sini kullanır. Herculano-Houzel’e göre bunun nedeni, insan beyninde çok sayıda nöron olmasıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Yaşam boyu MR eğrilerine bakalım. Kabuktaki (kortikal) toplam gri cevher hacmi yaklaşık kaç yaşında en yüksektir?',
    secenekler: ['Doğumda', 'Yaklaşık 6 yaşında', 'Yaklaşık 29 yaşında', 'Yaklaşık 50 yaşında'],
    dogru: 1,
    aciklama:
      '101.457 kişinin MR taramalarına göre kabuktaki toplam gri cevher hacmi 5,9 yaşında en yüksektir. Sonra neredeyse düz bir çizgiyle azalır. Yaklaşık 29 yaş ise beyaz cevher hacminin en yüksek olduğu yaştır. Derin (subkortikal) gri cevher hacmi 14,4 yaşında en yüksektir.',
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
      'Beyin sapı yukarıdan aşağıya orta beyin, pons ve omurilik soğanından oluşur. Talamus ve hipotalamus ara beyne aittir. Beyincik metensefalondan gelir, ama beyin sapına sayılmaz.',
    seviye: 'temel',
  },
  {
    soru: 'Hangi bölüm beyin kütlesinin yalnızca onda biri kadardır, ama nöronların çoğunu taşır?',
    secenekler: ['Büyük beyin kabuğu', 'Beyin sapı', 'Ara beyin', 'Beyincik'],
    dogru: 3,
    aciklama:
      'Beyincik beyin kütlesinin yaklaşık %10’udur. Ama 86 milyar nöronun yaklaşık 69 milyarını taşır. Büyük beyin kabuğunda yaklaşık 16 milyar nöron vardır. Eski bir derlemeye göre beyin sapında 1 milyardan az nöron bulunur.',
    seviye: 'temel',
  },
  {
    soru: 'Frontal lobu parietal lobdan ayıran oluk hangisidir?',
    secenekler: ['Merkezî oluk', 'Lateral oluk', 'Parieto-oksipital oluk', 'Uzunlamasına yarık'],
    dogru: 0,
    aciklama:
      'Merkezî oluk frontal lobu parietal lobdan ayırır. Önünde presantral (hareket) girus, arkasında postsantral (bedensel duyu) girus bulunur. Lateral oluk temporal lobun üst sınırıdır. Uzunlamasına yarık ise iki yarımküreyi ayırır.',
    seviye: 'temel',
  },
  {
    soru: 'Birincil görme kabuğu hangi lobdadır?',
    secenekler: ['Frontal lob', 'Parietal lob', 'Temporal lob', 'Oksipital lob'],
    dogru: 3,
    aciklama:
      'Birincil görme kabuğu (Brodmann 17) oksipital lobda, kalkarin yarığın iki yanındadır. Oksipital lob hem birincil hem üst düzey görme kabuğunu içerir.',
    seviye: 'temel',
  },
  {
    soru: 'Sinir sisteminin nöronlarını yapacak nöral plak hangi germ yaprağından gelişir?',
    secenekler: ['Endoderm', 'Mezoderm', 'Ektoderm', 'Notokord'],
    dogru: 2,
    aciklama:
      'Döllenmeden 16 gün sonra embriyonun hücreleri üç germ yaprağına ayrılmıştır. En dıştaki ektoderm hem deriyi hem de sinir sistemini yapar (OpenStax 13.1). Nöral plak, ektodermden ayrılan nöroektodermden gelişir (Catala, 2021). Notokord ise borunun karın tarafını yönlendiren sinyaller salgılar. Mikroglia bir istisna olabilir: büyük olasılıkla mezodermden gelir (Waymire, 2026).',
    seviye: 'temel',
  },
  {
    soru: 'Beş kesecik evresinde hangi birincil kesecik daha ince bölümlere ayrılmaz?',
    secenekler: ['Orta beyin (mezensefalon)', 'Ön beyin (prosensefalon)', 'Arka beyin (rombensefalon)', 'Hepsi ikiye ayrılır'],
    dogru: 0,
    aciklama:
      'Ön beyin, uç beyin ve ara beyne ayrılır. Arka beyin de metensefalon ve miyelensefalona ayrılır. Orta beyin ise bölünmez; yetişkinde de orta beyin olarak kalır (OpenStax 13.1).',
    seviye: 'temel',
  },
  {
    soru: 'Yetişkinde omurilik çoğunlukla hangi hizada biter?',
    secenekler: ['Kafatası tabanında', '7. boyun omurunda', '1.–2. bel omuru dolayında', 'Sağrı kemiğinin ucunda'],
    dogru: 2,
    aciklama:
      'Omurilik foramen magnumda başlar. Yetişkinde çoğunlukla 1. ya da 2. bel omuru hizasında, konus medullaris denen uçla biter. Konusun altında omurga kanalında yalnızca sinir kökleri vardır.',
    seviye: 'temel',
  },
  {
    soru: 'Omuriliğin ucunun (konus medullaris) altında bel ve sağrı kökleri aşağı doğru uzanır. Bu kök demetine ne ad verilir?',
    secenekler: ['At kuyruğu (cauda equina)', 'Boyun genişlemesi', 'Filum terminale', 'Sempatik gövde'],
    dogru: 0,
    aciklama:
      'Bu uzun kök demeti, görünüşü ve uzunluğu yüzünden at kuyruğu (cauda equina) adını almıştır. Filum terminale ise konustan aşağı uzanan ince bir ipliktir. Sinir kökü değildir.',
    seviye: 'temel',
  },
  {
    soru: 'Aşağıdaki kafa sinirlerinden hangisi yalnızca duyu lifi taşır?',
    secenekler: ['Okülomotor sinir (III)', 'Vestibulokoklear sinir (VIII)', 'Fasiyal sinir (VII)', 'Hipoglossal sinir (XII)'],
    dogru: 1,
    aciklama:
      'Ders kitabı sınıflamasında I, II ve VIII yalnızca duyu lifi taşır. III ve XII hareket siniridir. VII ise karmadır ve parasempatik lif de taşır.',
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
      'Duyu aksonları arka kökle girer. Gövdeleri arka kök gangliyonundadır. Hareket lifleri (somatik ve otonom) ön kökle çıkar. İki kök birleşince karma omurilik siniri oluşur.',
    seviye: 'temel',
  },
  {
    soru: 'Kalbi yavaşlatan ve sindirimi artıran otonom kol hangisidir?',
    secenekler: ['Sempatik kol', 'Somatik sinir sistemi', 'Parasempatik kol', 'Hiçbiri; bunlar istemli hareketlerdir'],
    dogru: 2,
    aciklama:
      'Parasempatik kol “dinlen ve sindir” hâlini yönetir. Kalbi dinlenme hızına yavaşlatır, sindirim salgısını ve hareketini artırır. Sempatik kol bunların tersini yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Otonom işlevlerin merkezî denetiminin çoğu hangi beyin bölgesinden gelir?',
    secenekler: ['Hipotalamus', 'Beyincik', 'Oksipital lob', 'Korpus kallozum'],
    dogru: 0,
    aciklama:
      'Otonom denetimin çoğu ara beyindeki hipotalamustan gelir. Merkezî otonom ağın en önemli hipotalamus çekirdeği paraventriküler çekirdektir.',
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
      'Dıştan içe sıra şöyledir: sert zar (dura mater), örümcek ağı zar (arachnoidea mater), yumuşak zar (pia mater). BOS, örümcek ağı zar ile yumuşak zar arasındaki subaraknoid aralıkta dolaşır.',
    seviye: 'temel',
  },
  {
    soru: 'Yetişkinde herhangi bir anda yaklaşık 150 mL BOS bulunur. Günde yaklaşık ne kadar BOS yapılır?',
    secenekler: ['Yaklaşık 50 mL', 'Yaklaşık 150 mL', 'Yaklaşık 5 litre', 'Yaklaşık 500 mL'],
    dogru: 3,
    aciklama:
      'BOS dakikada 0,3–0,4 mL, günde yaklaşık 430–530 mL yapılır. Bir anda ise ~150 mL BOS bulunur. Bu yüzden BOS bir günde 3–4 kez yenilenir.',
    seviye: 'temel',
  },
  {
    soru: 'Willis halkasının beyin için en önemli yararı nedir?',
    secenekler: [
      'Karıncıklarda beyin-omurilik sıvısını yapmak',
      'Bir parçası daralsa ya da tıkansa bile beynin beslenmesini sürdürebilmek',
      'Beynin toplardamar kanını iç juguler venlere taşımak',
      'Beyin kılcallarında kan-beyin engelini kurmak',
    ],
    dogru: 1,
    aciklama:
      'Willis halkası beynin tabanında bir atardamar kavşağıdır. İç karotis ve vertebral–baziler sistemleri birbirine bağlar. Bir parçası daralsa ya da tıkansa bile kanlanmayı sürdürebilir. Gerçekte halkanın bir ya da birkaç parçası çoğu insanda ince ya da eksiktir. Bu oran tanıma göre değişir.',
    seviye: 'temel',
  },
  {
    soru: 'Sağ yarımküredeki hareket kabuğu hasar görürse kol ve bacak güçsüzlüğü en çok nerede beklenir?',
    secenekler: ['Sağ kol ve bacakta', 'Sol kol ve bacakta', 'Yalnızca yüzde', 'İki yanda eşit olarak'],
    dogru: 1,
    aciklama:
      'Kortikospinal yol büyük ölçüde karşı tarafa geçer (çaprazlaşır). Sağ yarımkürenin hareket kabuğu vücudun sol yarısındaki kasları yönetir. Sol yarımküreninki de sağ yarısındakileri yönetir (OpenStax 14.3).',
    seviye: 'temel',
  },
  {
    soru: 'Hangisi alt motor nöron hasarının bulgusudur?',
    secenekler: ['Pozitif Babinski belirtisi', 'Abartılı refleksler', 'Hıza bağlı spastisite', 'Kasta erime ve seğirme'],
    dogru: 3,
    aciklama:
      'Alt motor nöron hasarında kas, besleyici (trofik) destekten yoksun kalır ve erir. Hasarlı nöronlar seğirmelere (fasikülasyon) yol açar. Refleksler de azalır. Babinski, abartılı refleksler ve spastisite ise üst motor nöron hasarının bulgularıdır (Knierim, 2026).',
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
      'Konnektom, nöronlar arasındaki bağlantıların haritasıdır. Elektron mikroskobu görüntüleri toplanıp çözümlenerek çıkarılır (Dorkenwald ve ark., 2024).',
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
      'TA2 onu kafa sinirleri arasında değil, MSS’nin yolları arasında sayar',
      'Adı sinirdir ama dokusu MSS’nin uzantısıdır; miyelinini oligodendrositler yapar',
      'Nöron gövdelerinden oluşan bir gangliyondur; içinde akson bulunmaz',
    ],
    dogru: 2,
    aciklama:
      'Optik sinir, dokusu bakımından (histolojik olarak) MSS’nin uzantısıdır. Oligodendrositlerle miyelinlenir (Romano ve ark., 2019). TA2 ise onu kafa sinirleri arasında, ÇSS başlığı altında sınıflar. Adı ile dokusu uyuşmayan bir örnektir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bir sinir kökçüğündeki MSS–ÇSS geçiş bölgesi için hangisi doğrudur?',
    secenekler: [
      'Merkez tarafında miyelini oligodendrositler, çevre tarafında Schwann hücreleri yapar',
      'Yalnızca omurilik köklerinde bulunur; kafa sinirlerinde böyle bir geçiş yoktur',
      'Omurilikte yalnızca ön köklerin çıkış noktalarında bulunur; arka köklerde yoktur',
      'Merkez tarafında miyelini Schwann hücreleri, çevre tarafında oligodendrositler yapar',
    ],
    dogru: 0,
    aciklama:
      'Geçiş bölgesinin merkez tarafında miyelini oligodendrositler yapar. Destek dokusu astrositlerden oluşur. Çevre tarafında miyelini, endonöryumla sarılı Schwann hücreleri yapar (Fraher, 2000). Omurilikte bu sınır iki yerde bulunur: ön köklerin motor çıkış noktalarında ve arka kök giriş bölgelerinde (Fontenas, 2023). Kafa sinirlerindeki aynı geçişe Obersteiner–Redlich bölgesi denir (Okuhata ve ark., 2026).',
    seviye: 'lisans',
  },
  {
    soru: 'Radyolojik gösterimdeki aksiyel bir MR kesitinde, ekranın sağında hastanın hangi tarafı görünür?',
    secenekler: ['Hastanın sol tarafı', 'Hastanın sağ tarafı', 'Hastanın ön tarafı', 'Görüntüye göre değişir, kural yoktur'],
    dogru: 0,
    aciklama:
      'Radyolojik gösterimde kesite hastanın ayak ucundan bakılıyormuş gibidir. Hastanın solu ekranın sağındadır. Nörolojik gösterimde ise hastanın sağı ekranın sağındadır. Bu yüzden R ve L işaretlerine bakılmadan taraf söylenmez.',
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
      'ÇSS’de miyelini Schwann hücresi yapar ve tek bir aksonun yalnızca bir segmentini sarar. MSS’de miyelini oligodendrosit yapar. O ise aynı ya da ayrı aksonların birden çok segmentine miyelin verir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bir çevresel sinirde fasikülleri saran ve ana difüzyon engelini oluşturan kılıf hangisidir?',
    secenekler: ['Epinöryum', 'Endonöryum', 'Perinöryum', 'Miyelin kılıfı'],
    dogru: 2,
    aciklama:
      'Perinöryum, akson–Schwann hücresi birimlerini fasiküllere ayırır. Endonöryum ile dış dokular arasındaki ana difüzyon engeli odur. Epinöryum çoğunlukla kollajendir. Sinire gerilmeye karşı dayanıklılık verir ama engel oluşturmaz. Endonöryum, tek tek aksonları saran gevşek bağ dokusudur.',
    seviye: 'lisans',
  },
  {
    soru: 'Genç erişkinler için beyin ağırlığının başvuru aralıkları önerilmiştir (ör. kadında 1033–1404 g). Bu aralıklar 80 yaşındaki bir kişiye neden doğrudan uygulanamaz?',
    secenekler: [
      'Bu aralıklar yalnızca MR ile ölçülmüştür',
      'Beyin ağırlığı yaşla birlikte artar',
      'Aralıklar 18–35 yaştakilerden gelir ve beyin yaşla hafifler',
      'Beyin ağırlığı cinsiyete göre değişmez',
    ],
    dogru: 2,
    aciklama:
      'Molina ve DiMaio’nun aralıkları 18–35 yaş arası kişilerden gelir. Bu kişiler bir yaralanmayla aniden ölmüştü. Beyin ağırlığı 45–50 yaş dolayında azalmaya başlar ve her yıl birkaç gram hafifler. Bu yüzden yaşa, cinsiyete ve boya uygun bir değerle karşılaştırmak gerekir.',
    seviye: 'lisans',
  },
  {
    soru: 'Miyelinleşmenin takvimi için hangisi doğrudur?',
    secenekler: [
      'Anne karnında omurilikte başlar; çoğu ilişkilendirme yolunda 20’li yaşlarda da sürer',
      'Doğumda bütünüyle tamamlanmış olur',
      'İlk miyelinlenen yer kabuğun kendi içindeki liflerdir',
      'Ergenlikten sonra beyaz cevherde hiçbir değişiklik olmaz',
    ],
    dogru: 0,
    aciklama:
      'Bir derlemeye göre miyelinleşme omurilikte, gebeliğin 12–14. haftasında başlar. Başka bir derleme başlangıcı 16. hafta olarak verir. En hızlı dönem, gebelik ortasından doğum sonrası 2. yılın sonuna kadardır. Çoğu ilişkilendirme yolunda miyelinleşme 20’li yaşlarda da sürer. Kabuk içi lifler en son miyelinlenir. Beyaz cevher de yaşla küçülür.',
    seviye: 'lisans',
  },
  {
    soru: 'Hangi kafa sinirlerinin çekirdekleri ponsun tegmentumundadır?',
    secenekler: ['III ve IV', 'V, VI, VII ve VIII', 'IX ve X', 'XI ve XII'],
    dogru: 1,
    aciklama:
      'Ponsun tegmentumunda V, VI, VII ve VIII. sinirlerin çekirdekleri bulunur. III ve IV (ve V’in bir bölümü) orta beyindedir. IX–XII ise omurilik soğanındadır.',
    seviye: 'lisans',
  },
  {
    soru: 'Striatum hangi yapılardan oluşur?',
    secenekler: ['Talamus ve hipotalamus', 'Putamen ve globus pallidus', 'Hipokampus ve amigdala', 'Kaudat çekirdek ve putamen'],
    dogru: 3,
    aciklama:
      'Kaudat çekirdek ile putamene birlikte striatum denir. Bazal çekirdeklerin kabuktan gelen bütün girdisi striatuma ulaşır. Globus pallidusun ise dış ve iç iki bölümü vardır.',
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
      'Hareket kabuğunda beden bir harita gibi dizilidir (somatotopi). Ayak ve bacağın temsili presantral girusun iç duvarındadır. İnce hareketler yapan el ve yüzün temsili ise orantısız büyüktür. Yalnızca bu duvarı tutan bir hasar en çok karşı bacağı etkiler.',
    seviye: 'lisans',
  },
  {
    soru: 'İki durum var: açık spina bifida ve deriyle örtülü (kapalı) alt sağrı-kuyruk sokumu disrafizmi. Aralarındaki gelişimsel fark hangisidir?',
    secenekler: [
      'İkisi de ön nöroporun kapanmamasından doğar',
      'Açık olan birincil, kapalı olan ikincil nörülasyondaki bir kusurdan doğar',
      'Açık olan ikincil, kapalı olan birincil nörülasyondaki bir kusurdan doğar',
      'İkisi de nöral krista hücrelerinin göçü bozulduğu için doğar',
    ],
    dogru: 1,
    aciklama:
      'Açık spina bifida (miyelomeningosel) çoğunlukla bel ve üst sağrı düzeyinde olur. Birincil borunun kapanma kusurundan doğar. Deriyle örtülü disrafik durumlar ise alt sağrı ve kuyruk sokumu düzeyinde görülür. Bunlar ikincil nörülasyonun bozulmasından kaynaklanır; bu süreç boruyu nöral kıvrım oluşmadan yapar (Santos ve ark., 2024).',
    seviye: 'lisans',
  },
  {
    soru: 'Hangisi nöral kristadan değil, kafa plakodlarından gelişir?',
    secenekler: [
      'Arka kök gangliyonunun duyu nöronları',
      'Böbrek üstü bezinin kromafin hücreleri',
      'Bağırsağın sinir sistemi (enterik sinir sistemi)',
      'Göz merceği ve ön hipofiz',
    ],
    dogru: 3,
    aciklama:
      'Kafa plakodları ön hipofizi, koku epitelini ve göz merceğini yapar. V, VII, IX ve X gangliyonlarındaki büyük nöronlar da plakodlardan gelir (Zine ve Fritzsch, 2023). Arka kök gangliyonları ve kromafin hücreler ise gövde nöral kristasından gelir. Enterik sinir sistemi de vagal nöral kristadan gelir (Simões-Costa ve Bronner, 2013).',
    seviye: 'lisans',
  },
  {
    soru: 'Boyunda 7 omur olduğu hâlde neden 8 çift boyun siniri vardır?',
    secenekler: [
      'Atlasın iki ayrı siniri vardır',
      'C8 göğüs omuriliğinden çıkıp boyna döner',
      'Boyun omurlarından ikisi doğumdan sonra kaynaşır',
      'C1 kafatası–atlas arasından, C8 de C7–T1 arasından çıkar',
    ],
    dogru: 3,
    aciklama:
      'İlk boyun siniri kafatası ile atlas arasından çıkar. C8 ise 7. boyun omuru ile 1. göğüs omuru arasından çıkar. Göğüs ve bel sinirleri aynı adlı omurun altından çıkar. Bu yüzden sayılar orada eşitlenir.',
    seviye: 'lisans',
  },
  {
    soru: 'Ankara’da Hacettepe Üniversitesi’nde 639 kişinin bel MR’ı incelendi. Konus medullaris en sık hangi düzeyde bulundu?',
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
      'V1 üst orbital yarıktan, V2 yuvarlak delikten, V3 oval delikten çıkar. Juguler delikten IX, X ve XI geçer. İç kulak yolundan VII ve VIII geçer.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e (1918) ve güncel bir derlemeye göre kol ağının (brakiyal pleksus) klasik kök aralığı hangisidir?',
    secenekler: ['C1–C4', 'C5–T1', 'C3–C5', 'L4–S3'],
    dogru: 1,
    aciklama:
      'Kol ağı C5–C8 ile T1’in ön dallarından oluşur. Bir ders kitabının verdiği C4–T1 değeri, ağa katkı yapan komşu sinirleri de sayar. C4 genellikle C5’e bir dal verir.',
    seviye: 'lisans',
  },
  {
    soru: 'Sempatik gövdede her yanda tipik olarak kaç gangliyon bulunur?',
    secenekler: ['12', '31', '23', '43'],
    dogru: 2,
    aciklama:
      'Her yanda tipik olarak 23 gangliyon vardır: 3 boyun, 12 göğüs, 4 bel ve 4 sağrı. İki gövde aşağıda, kuyruk sokumunun önündeki ganglion imparda birleşir.',
    seviye: 'lisans',
  },
  {
    soru: 'Ter bezlerine giden sempatik postganglionik lifler hangi haberciyi salar?',
    secenekler: ['Noradrenalin', 'Asetilkolin', 'Adrenalin', 'Dopamin'],
    dogru: 1,
    aciklama:
      'Sempatik postganglionik liflerin çoğu noradrenalin salar. Ter bezlerine ve iskelet kası damarlarına gidenler ise asetilkolin salar. Bütün preganglionik lifler de asetilkolin salar.',
    seviye: 'lisans',
  },
  {
    soru: 'Enterik sinir sistemi için hangisi doğrudur?',
    secenekler: [
      'Submukozal ağ mide ve yemek borusunda da bulunur',
      'Bütün sindirim kanalında hareketi ağırlıkla MSS yönetir',
      'Nöron sayısı birkaç milyonla sınırlıdır',
      'Miyenterik ağ, üst yemek borusundan iç anal büzgene uzanır',
    ],
    dogru: 3,
    aciklama:
      'Miyenterik (Auerbach) ağ yemek borusunun üst kısmından iç anal büzgene kadar uzanır. Submukozal (Meissner) ağ ise ince ve kalın bağırsakta vardır; mide ve yemek borusunda yoktur. Güncel derlemeler 200–600 milyon ya da daha fazla enterik nöron bildirir. İnce ve kalın bağırsakta enterik sistem tam refleks devreleri taşır (Furness ve ark., 2014).',
    seviye: 'lisans',
  },
  {
    soru: 'Koroid pleksusta kan-BOS engelini hangi yapı kurar?',
    secenekler: [
      'Koroid pleksusun epitel hücreleri ve aralarındaki sıkı bağlantılar',
      'Koroid pleksus kılcallarının endotel hücreleri',
      'Karıncıkları döşeyen ependim hücreleri',
      'Beyin yüzeyini örten yumuşak zar',
    ],
    dogru: 0,
    aciklama:
      'Koroid pleksusun kılcalları pencerelidir; kandan gelen moleküllerin geçişine izin verir. Engeli, kılcalları saran epitel hücreleri kurar. Bu hücreler tepe yüzlerinde sıkı bağlantılarla kenetlenir. Ependim yetişkinde bir difüzyon engeli değildir. Yumuşak zarda da sıkı bağlantı yoktur.',
    seviye: 'lisans',
  },
  {
    soru: 'Lomber ponksiyonla alınan BOS’ta aşağıdakilerden hangisi başvuru değerlerinin dışındadır?',
    secenekler: ['Berrak ve renksiz görünüm', 'Mikrolitrede 3 çekirdekli hücre', 'Toplam protein 900 mg/L', 'BOS/serum glikoz oranı 0,65'],
    dogru: 2,
    aciklama:
      'Başvuru değerleri şunlardır: berrak ve renksiz görünüm, mikrolitrede 5’ten az çekirdekli hücre, 500 mg/L’nin altında toplam protein, 0,50’nin üstünde BOS/serum glikoz oranı. 900 mg/L protein üst sınırın belirgin üstündedir.',
    seviye: 'lisans',
  },
  {
    soru: 'Kritik iskemi eşiğinde nöronlar zar gradyanlarını, yani zarlarının iki yanındaki iyon farkını yitirmeye başlar. Nicel EEG çalışmalarına göre bu eşik yaklaşık kaçtır?',
    secenekler: ['Yaklaşık 50 mL/100 g/dk', 'Yaklaşık 17–18 mL/100 g/dk', 'Yaklaşık 25–35 mL/100 g/dk', 'Yaklaşık 80 mL/100 g/dk'],
    dogru: 1,
    aciklama:
      '50, normal ortalama akımdır. 80, genç yetişkinde gri cevherin akımıdır. 25–35’te EEG hızlı dalgalarını yitirir. 17–18 kritik iskemi eşiğidir; bu düzeyde enfarkt saatlerce gecikebilir. 10–12 ve altı ise enfarkt eşiğidir.',
    seviye: 'lisans',
  },
  {
    soru: 'Bir hastada göz kapağı düşüklüğü, çift görme ve gün içinde artan güçsüzlük var. Güçsüzlük gövdeye yakın kaslarda; duyu kaybı yok. Hasarın en olası yeri neresidir?',
    secenekler: ['Sinir-kas kavşağı', 'Omurilik', 'Kol sinir ağı', 'Beyin kabuğu'],
    dogru: 0,
    aciklama:
      'Myastenia gravis gibi sinir-kas kavşağı hastalıkları tipik olarak şu kasları tutar: göz, yutma-konuşma (bulber), boyun, solunum ve gövdeye yakın (proksimal) kaslar. Kaslar kullandıkça yorulur (yorulabilirlik). Duyu kaybı olmaz (Quak ve ark., 2026).',
    seviye: 'lisans',
  },
  {
    soru: 'Kafa siniri bulgularıyla birlikte karşı tarafta hemiparezi (çapraz hemiparezi) hangi düzeyi düşündürür?',
    secenekler: ['Beyin kabuğu', 'Omurilik', 'Beyin sapı', 'Çevresel sinir'],
    dogru: 2,
    aciklama:
      'Beyin sapında iki yapı bir aradadır: kafa sinirlerinin hareket çekirdekleri (alt motor nöronlar) ve omuriliğe inen kortikospinal lifler. Bu yüzden kafa siniri bulgusu ile karşı tarafta hemiparezi birlikte görülürse akla beyin sapı gelir (Quak ve ark., 2026).',
    seviye: 'lisans',
  },
  {
    soru: 'BigBrain için hangisi doğrudur?',
    secenekler: [
      'Binlerce kişinin MR görüntüsünden üretilmiş ortalama bir beyindir',
      'Bir fare beyninin elektron mikroskobuyla çıkarılmış modelidir',
      'Yalnızca beyin kabuğunu gösteren iki boyutlu bir haritadır',
      '7404 kesitten kurulmuş, ~20 µm çözünürlükte üç boyutlu insan beynidir',
    ],
    dogru: 3,
    aciklama:
      'BigBrain, üç boyutlu bir insan beyni modelidir. 7404 doku (histolojik) kesitinden yeniden kurulmuştur. Çözünürlüğü yaklaşık 20 mikrometredir; bu, hücre düzeyine yakındır (Amunts ve ark., 2013).',
    seviye: 'lisans',
  },
  {
    soru: 'İnsan beyni hücre atlasında (Siletti ve ark., 2023) kümeler büyük ölçüde neye göre düzenleniyordu?',
    secenekler: ['Donörün yaşına göre', 'Gelişimsel kökenlerine göre', 'Hücrenin büyüklüğüne göre', 'Kan damarlarına uzaklığa göre'],
    dogru: 1,
    aciklama:
      'Atlasta 3 milyondan fazla çekirdek incelendi; 461 küme ve 3313 alt küme bulundu. Bu kümeler büyük ölçüde gelişimsel kökenlerine göre düzenleniyordu. Orta beyin ve arka beyin nöronlarında çeşitlilik yüksekti (Siletti ve ark., 2023).',
    seviye: 'lisans',
  },
  {
    soru: 'Peker ve arkadaşlarının (2006) trigeminal sinir ölçümlerine göre hangisi doğrudur?',
    secenekler: [
      'Merkezi miyelin, sinirin sıvı dolu sarnıçta uzanan bütün kesimini kaplar',
      'Kök giriş bölgesi ile geçiş bölgesi her zaman aynı noktadadır',
      'Merkezi miyelin ponstan iç yüzde ortalama 1,13 mm, dış yüzde 2,47 mm uzanır',
      'Geçiş bölgesi trigeminal sinirde beyin sapına, vagustakinden daha yakındır',
    ],
    dogru: 2,
    aciklama:
      'İstanbul’da 100 trigeminal sinir ölçüldü. Merkezi miyelin iç yüzde ortalama 1,13 mm, dış yüzde 2,47 mm (en çok 6,75 mm) uzanıyordu. Sinir boyunun yalnızca ilk dörtte birini kaplıyordu. Yani kök giriş bölgesi ile geçiş bölgesi aynı yer değildir. Guclu ve arkadaşlarının (2011) ölçümleri de vardır. Geçiş bölgesinin beyin sapına en uzak noktası, trigeminalde (4,19 mm) vagustakinden (1,63 mm) daha uzaktadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Gray’e (1918) göre tipik bir omurilik sinirinde en az hangi dört lif türü bulunur?',
    secenekler: [
      'Somatik duyusal, visseral afferent, somatik motor ve visseral efferent (pregangliyoner)',
      'Koku, görme, işitme ve tat gibi özel duyuların lifleri',
      'Yalnızca somatik motor ve somatik duyusal lifler; visseral lif yoktur',
      'Pregangliyoner, postgangliyoner, enterik ve kortikospinal lifler',
    ],
    dogru: 0,
    aciklama:
      'Gray tipik bir omurilik sinirinde dört lif türü sayar: somatik duyusal, visseral afferent, somatik motor ve visseral efferent (pregangliyoner). Gray visseral liflere “sempatik” der. Kafa sinirlerinde bunlara ek olarak özel duyuların sinirleri bulunur: koku, görme, işitme, denge ve tat.',
    seviye: 'ileri',
  },
  {
    soru: 'Talairach uzayında koordinatların başlangıç noktası (0, 0, 0) neresidir?',
    secenekler: ['Arka komissür (PC)', 'Ön komissür (AC)', 'Talamusun orta noktası', 'Nasion'],
    dogru: 1,
    aciklama:
      'Talairach uzayında başlangıç noktası ön komissürdür (AC). Y ekseni arka komissürden (PC) geçer. MNI uzayında da başlangıç, MNI şablon beyninde ön komissürün orta hattı kestiği noktadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Beyin görüntüleme dosyalarında yaygın RAS+ kuralı ile DICOM’un LPS+ kuralı arasındaki fark nedir?',
    secenekler: [
      'Yalnızca z ekseninin yönü terstir; x ve y aynıdır',
      'x, y ve z eksenlerinin üçünün de yönü terstir',
      'x ve y eksenlerinin yönü terstir; z aynıdır',
      'İki kural aynıdır; yalnızca adları farklıdır',
    ],
    dogru: 2,
    aciklama:
      'RAS+ kuralında x sağa, y öne, z yukarı doğru artar. LPS+ kuralında x sola, y arkaya doğru artar; z ekseni ikisinde de yukarı doğru artar. Hangi kuralın kullanıldığı bilinmeden dönüşüm yapılırsa sağ ve sol karışabilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Glia ile nöronların oranı için hangisi doğrudur?',
    secenekler: [
      'Bütün beyinde glia nöronlardan on kat fazladır; bu oran her bölgede geçerlidir',
      'Bütün beyinde oran 1:1’den küçüktür; talamusta 17’dir, beyincikte nöronlar en az 25 kat fazladır',
      'Oran beynin her bölgesinde aynıdır; bölgeler arasında hiçbir fark yoktur',
      'Omurilikte nöronlar gliadan fazladır; omurilikteki hücrelerin çoğu nörondur',
    ],
    dogru: 1,
    aciklama:
      'İzotropik fraksiyonatör, bütün beyinde glia–nöron oranının 1:1’in altında olduğunu gösterdi. Oran bölgeye göre çok değişir: talamusta 17, kabuk gri cevherinde 2’den az, omurilikte 5,6–7,1. Beyincikte ise nöronlar gliadan en az 25 kat fazladır.',
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
      'Gray, glianın yalnızca beyin ve omurilikte bulunduğunu yazmıştı. Bugün ÇSS’de de glia olduğu biliniyor: Schwann hücreleri ve satellit hücreler. Öteki üç ifade bugünkü bilgiyle uyumludur.',
    seviye: 'ileri',
  },
  {
    soru: 'Howarth ve arkadaşları (2012) enerji bütçesini güncelledi. Bu bütçeye göre beyin kabuğunda sinyal enerjisinin en büyük kalemi hangisidir?',
    secenekler: ['Aksiyon potansiyelleri', 'Dinlenim potansiyeli', 'Sinaps sonrası glutamat almaçları', 'Haberci maddenin geri dönüşümü'],
    dogru: 2,
    aciklama:
      'Güncel bütçede sinyal enerjisinin %50’si sinaps sonrası glutamat almaçlarına gider. %21’i aksiyon potansiyellerine, %20’si dinlenim potansiyeline gider. 2001 bütçesi ise aksiyon potansiyellerini en büyük kalem sayıyordu (%47). O bütçe kemirgen gri cevheri içindi. Aksiyon potansiyelinin daha verimli olduğu anlaşılınca güncellendi.',
    seviye: 'ileri',
  },
  {
    soru: 'Beyin kabuğunun yüzey alanıyla ilgili hangisi doğrudur?',
    secenekler: [
      'Dış (pial) yüzey, gri-beyaz cevher sınırındaki yüzeyden yaklaşık 1,2 kat büyüktür',
      'Açılıp yayılınca yaklaşık 1 m² tutar',
      'Beyincik kabuğunun yüzeyi neokorteksinkinin yaklaşık onda biridir',
      'Yüzeyin yalnızca onda biri oluklarda gizlidir',
    ],
    dogru: 0,
    aciklama:
      'Dış (pial) yüzey, gri-beyaz cevher sınırındaki yüzeyin yaklaşık 1,2 katıdır (MR’a dayalı bir hesapla kadınlarda ~2038 cm²). Ölçümler ve tahminler 1 m² değil, 0,16–0,2 m² verir. Beyincik kabuğu, neokorteks yüzeyinin %78’i kadardır. Kabuk yüzeyinin üçte ikisi oluklardadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Terminologia Anatomica 2’ye (TA2) göre "serebrum" neleri kapsar?',
    secenekler: ['Yalnızca telensefalonu', 'Beyin sapı dahil bütün beyni', 'Telensefalon ve beyinciği', 'Telensefalon ve diensefalonu'],
    dogru: 3,
    aciklama:
      'TA2 serebrumu ön beynin (prosensefalon) erişkindeki karşılığı olarak tanımlar. Yani serebrum telensefalon ve diensefalonu kapsar. Bu listeye göre erişkin beyni de serebrum, beyin sapı ve beyincik diye üçe ayrılır. OpenStax ise serebrumu telensefalonla bir tutar. Okurken hangi tanımın kullanıldığına bak.',
    seviye: 'ileri',
  },
  {
    soru: 'Göz bebeğinin ışık refleksinin merkezi neresidir?',
    secenekler: [
      'Talamusun altındaki hipotalamus',
      'Ara beyin–orta beyin sınırındaki pretektal alan',
      'Beyin sapının en altındaki omurilik soğanı',
      'Beyin sapının arkasındaki beyincik',
    ],
    dogru: 1,
    aciklama:
      'Pretektal alan aksonlarının çoğunu arka komissürden iki yana gönderir. Aksonlar Edinger–Westphal çekirdeklerine ulaşır. Bu yüzden ışığa yanıt iki göz bebeğinde birden görülür. UTHealth pretektal alanı orta beyinde anlatır, TA2 ise ara beyne katar. İki taraflı pretektal hasar Argyll Robertson göz bebeklerine yol açar. Refleksi hipotalamusa bağlayan ders kitabı ifadesini kullanma.',
    seviye: 'ileri',
  },
  {
    soru: 'Birincil hareket kabuğunun katman yapısı için hangisi doğrudur?',
    secenekler: [
      'Dört hücre katmanı vardır',
      'IV. (granüler) katmanı en kalın katmanıdır',
      'Hiç katmanı yoktur',
      'Altı katmanlıdır ama IV. katmanı yoktur',
    ],
    dogru: 3,
    aciklama:
      'Birincil hareket kabuğu altı katmanlı neokortekstir. Ama birincil duyu alanlarından farklı olarak agranülerdir: hücreden zengin IV. katmanı yoktur. En belirgin katmanı, Betz hücrelerini taşıyan V. katmandır. Kabukta dört katman sayan bilgi Gray’in döneminden kalmadır.',
    seviye: 'ileri',
  },
  {
    soru: 'Kortikospinal yolun lifleri nereden gelir?',
    secenekler: [
      'Yaklaşık %30’u birincil hareket kabuğundan, kalanı başka kabuk alanlarından',
      'Yalnızca hareket kabuğundaki Betz hücrelerinden',
      'Tamamı birincil hareket kabuğundan',
      'Çoğu beyincikten ve beyin sapından',
    ],
    dogru: 0,
    aciklama:
      'Birincil hareket kabuğunun projeksiyon nöronları (Betz hücreleri dahil) liflerin yalnızca ~%30’unu verir. Kalanın kaynağı şöyledir: premotor kabuk ve ek motor alan (~%30), bedensel duyu kabuğu (~%30), arka parietal kabuk (~%10).',
    seviye: 'ileri',
  },
  {
    soru: 'Sınır oluğunun (sulcus limitans) nereye kadar uzandığı için hangisi doğrudur?',
    secenekler: [
      'Bütün kaynaklara göre omurilikten uç beyne kadar hiç kesilmeden uzanır',
      'Terminologia Anatomica onu yalnızca üçüncü karıncığın duvarında tanımlar',
      'Nieuwenhuys’a göre arka beyinle sınırlı, Puelles’e göre optik kiazma yakınına uzanır',
      'Prosomerik modelde alar ve bazal plak diye bir ayrım hiç yapılmaz',
    ],
    dogru: 2,
    aciklama:
      'Nieuwenhuys (2011), karıncık yüzündeki sınır oluğunu arka beyinle (rombensefalon) sınırlı bulur. Puelles (2024) ise His’e dayanır. Ona göre oluk bükümleri aşar ve optik kiazma yakınında biter. Terminologia Anatomica (TA2) oluğu yalnızca dördüncü karıncığın tabanında (fossa rhomboidea) tanımlar. Prosomerik modelde de bazal plak hareket nöronlarını üretir; yani bu modelde de alar ve bazal plak ayrılır.',
    seviye: 'ileri',
  },
  {
    soru: 'Santos ve ark. (2024) insan embriyolarında ikincil nörülasyon için ne buldu?',
    secenekler: [
      'Evre 13’ten itibaren tek bir boşlukla ilerlediğini; geçiş bölgesi olmadığını',
      'Civcivdeki gibi birden çok boşluğun birleşmesiyle ilerlediğini',
      'Döllenmeden sonraki 45–53. günlerde başladığını',
      'Arka nöroporun hiçbir embriyoda evre 18’den önce kapanmadığını',
    ],
    dogru: 0,
    aciklama:
      'Çalışma Carnegie evre 10–18 arasındaki 108 insan embriyosunu inceledi. Alt uçtaki (kaudal) gelişime evre 13–18’deki 37 embriyoda bakıldı. İkincil nörülasyon evre 13’ten (~28. gün) itibaren tek bir boşlukla (lümen) ilerliyordu, faredeki gibi. Birincilden ikincile bir geçiş bölgesine dair kanıt yoktu. Arka nöropor da embriyoların çoğunda evre 13’te kapalıydı (Santos ve ark., 2024). 45–53. gün aralığı bu gözlemlerle uyuşmaz.',
    seviye: 'ileri',
  },
  {
    soru: 'Doğu Afrika’da 331 hastanın MR’ı incelendi. İğne L1–L2 aralığından girilseydi, omuriliklerin yaklaşık ne kadarı olası bir yaralanma riski altında olurdu?',
    secenekler: ['Yaklaşık %2', 'Yaklaşık üçte biri', 'Yaklaşık dörtte üçü', 'Hiçbiri'],
    dogru: 1,
    aciklama:
      'Çalışmanın hesabına göre L1–L2 aralığında omuriliklerin %33,5’i risk altındaydı. L2–L3 aralığında bu oran %2,1’di. Konusların %97,9’u L2 omurunda ya da üstünde bitiyordu.',
    seviye: 'ileri',
  },
  {
    soru: 'Gray’in (1918) “omurilik doğumda 3. bel omuru hizasında biter” bilgisi bugün nasıl değerlendirilir?',
    secenekler: [
      'Eskimiştir; doğumda konus yaklaşık L2’dedir ve sonra çok az yükselir',
      'Doğrudur; konus bütün çocukluk boyunca yükselerek L1’e ulaşır',
      'Yalnızca kız bebekler için geçerlidir',
      'Yalnızca gebeliğin son üç ayındaki fetüsler için doğrudur; doğumda konus L4’tedir',
    ],
    dogru: 0,
    aciklama:
      'Fetüs çalışmalarını birleştiren analizde (meta-analiz), 33. haftadan doğuma kadar konusların %82’si L2’de ya da üstündedir. Yazarlar doğumdaki yeri yaklaşık L2 kabul eder. Yenidoğanla erişkin arasındaki fark yaklaşık çeyrek omurdur. Çocuk MR’ı da konusun çocukluk boyunca yükselmediğini gösterir.',
    seviye: 'ileri',
  },
  {
    soru: 'Boyun sinir kökü hastalığı (radikülopati) olan 227 hastanın tanısı ameliyatla doğrulandı. Bunların yaklaşık ne kadarında standart dermatom düzeni görüldü?',
    secenekler: ['%25', '%90', '%63', '%100'],
    dogru: 2,
    aciklama:
      'Hastaların %62,6’sında standart dermatom düzeni görüldü. Kas güçsüzlüğü olan 110 hastanın %67,3’ünde güçsüzlük standart miyotom düzenine uyuyordu. Dermatom haritası yararlı bir ipucudur, ama kök düzeyini tek başına kesin göstermez.',
    seviye: 'ileri',
  },
  {
    soru: 'Trigeminal gangliyon hakkında hangisi doğrudur?',
    secenekler: [
      'Kafatasının dışında, boyunda bulunur',
      'Nöronları iki kutupludur (bipolar)',
      'Bir parasempatik gangliyondur',
      'Kafatasının içinde, Meckel boşluğunda bulunur',
    ],
    dogru: 3,
    aciklama:
      'Trigeminal gangliyon bir duyu gangliyonudur. Şakak kemiğinin kayalık kısmının tepesine yakın yatar. Sert zarın oluşturduğu bir boşluktadır: Meckel boşluğu (TA2: cavum trigeminale). “Kafa siniri gangliyonları kafatası dışındadır” genellemesi bu yüzden yanlıştır.',
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
      'Çizgili kaslı yemek borusunun hareketlerini merkezî örüntü üreteçleri belirler. Midenin kasılmasını ve asit salgısını büyük ölçüde vago-vagal refleksler belirler. İnce ve kalın bağırsakta ise enterik sistem tam refleks devreleri taşır. Yani “ikinci beyin”in bağımsızlığı bölgeye göre sınırlıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Beyaz bağlantı dalları yalnızca göğüs ve ilk bel sinirlerinden çıkar. Ama sempatik gövdenin boyun bölümünde de üç gangliyon vardır. Bundan ne çıkar?',
    secenekler: [
      'Boyun gangliyonları hiç preganglionik lif almaz',
      'Boyun gangliyonları parasempatik gangliyonlardır',
      'Boyun sinirleri de beyaz bağlantı dalı verir',
      'Baş ve boyna giden lifler üst göğüs omuriliğinden çıkıp yukarı ilerler',
    ],
    dogru: 3,
    aciklama:
      'Sempatik preganglionik nöronlar göğüs ve üst bel omuriliğindedir. Gövdeye beyaz dallarla girerler. Boyun gangliyonlarına ulaşan lifler bu yüzden gövde içinde yukarı tırmanır. Horner sendromunda hasarın bu uzun zincirin herhangi bir halkasında aranması bundandır.',
    seviye: 'ileri',
  },
  {
    soru: 'Güncel anatomiye göre “subdural aralık” için hangisi doğrudur?',
    secenekler: [
      'Sert zar ile kafatası arasında sağlıklı insanda da bulunan bir boşluktur',
      'BOS ile dolu, sağlıklı insanda da sürekli açık bir aralıktır',
      'Yumuşak zar ile beyin dokusu arasında bulunan doğal bir aralıktır',
      'Sağlıklı insanda yoktur; travma ya da kanama sert zarın en iç katmanını yarınca açılır',
    ],
    dogru: 3,
    aciklama:
      'Sert zarın en iç katmanı dural sınır hücre katmanıdır. 10 μm’den incedir ve 3–8 sıra yassı hücreden oluşur. Bu kırılgan katmanı küçük kesme kuvvetleri bile yarabilir. O zaman klinikte “subdural aralık” diye görülen düzlem açılır. TA2 de subdural aralığı “sabit olmayan” diye işaretler.',
    seviye: 'ileri',
  },
  {
    soru: 'SLYM’i (“dördüncü zar”) eleştirenlerin ana savı hangisidir?',
    secenekler: [
      'SLYM ayrı bir zar değil, iç araknoidin parçasıdır; ayrı görünmesi doku işleminin ürünüdür',
      'SLYM, sert zarın kemiğe bakan dış (periostal) katmanıdır',
      'SLYM yalnızca omurilikte bulunur, beyinde hiç yoktur',
      'SLYM, kan-beyin engelinin asıl kurulduğu yerdir',
    ],
    dogru: 0,
    aciklama:
      'Neuhuber’e göre ayrı “dış” ve “iç” subaraknoid aralıklar yapay olabilir. Bunları, doku tespit edilirken ve kireçten arındırılırken oluşan hiperozmotik stres yaratabilir. Siegenthaler ve Betsholtz’a göre zar, örümcek ağı zarın parçasıdır. Engel özelliği de araknoid engel katmanına aittir. Tanımlayan grup da SLYM’in klasik yayınlardaki iç araknoid olduğunu kabul eder. Tartışma sürmektedir.',
    seviye: 'ileri',
  },
  {
    soru: 'Willis halkasında “tam halka” oranı seriden seriye %8 ile %85,4 arasında değişir. Bunun başlıca nedeni nedir?',
    secenekler: [
      'Türk toplumunun öteki toplumlardan kesin olarak farklı olması',
      'Kadavra çalışmalarının görüntülemeden her zaman daha doğru olması',
      'Tam halkanın ve hipoplazinin farklı tanımlanması (ör. 1 mm eşiği ya da yalnızca ageneziyi saymak)',
      'Halkanın yapısının yaş ilerledikçe hiç değişmemesi',
    ],
    dogru: 2,
    aciklama:
      'Seriler farklı tanımlar kullandı. İzmir kadavra serisi hipoplaziyi de saydı ve tipik halkayı %8 buldu. Tromsø, 1 mm eşiğiyle %11,9 buldu. Yalnızca ageneziyi sayan Muğla serisi %85,4 “normal” buldu. Derlemeler bu genişliği tanım ve hipoplazi ölçütü farkına bağlar. Toplumlar arasında fark olup olmadığı ise tartışmalıdır. Tromsø’da yaşla eksik parça sayısı artma eğilimindeydi.',
    seviye: 'ileri',
  },
  {
    soru: 'Kanada 2023 kılavuzu, nörolojik ölçütlerle ölüm belirlemesi için üç klinik koşul ister. Hangisi bu koşullardan biri değildir?',
    secenekler: [
      'Uyaranlara uyanıklık ve farkındalık yanıtı olmaması (bilinç yokluğu)',
      'Kafa siniri testleriyle gösterilen beyin sapı işlevi yokluğu',
      'Resmî apne testiyle gösterilen soluma kapasitesi yokluğu',
      'Muayenede germe (derin tendon) reflekslerinin alınamaması',
    ],
    dogru: 3,
    aciklama:
      'Kılavuza göre belirleme esasen klinik bir değerlendirmedir. Üç koşulun üçü de gerekir: bilinç yokluğu, beyin sapı işlevi yokluğu ve soluma kapasitesi yokluğu. Beyin sapı işlevi kafa siniri testleriyle, soluma kapasitesi resmî apne testiyle gösterilir (Shemie ve ark., 2023). Germe refleksleri bu koşullar arasında yoktur.',
    seviye: 'ileri',
  },
  {
    soru: 'İnmenin ölüm nedenleri arasındaki sırası için hangisi doğrudur?',
    secenekler: [
      'Bütün kaynaklarda birinci sıradadır',
      'GBD 2021’de üçüncü, DSÖ’nün 2023 verisinde ikincidir',
      'GBD 2021’de ikinci, DSÖ’nün 2023 verisinde dördüncüdür',
      'Hiçbir kaynakta ilk beşte değildir',
    ],
    dogru: 1,
    aciklama:
      'GBD 2021 inmeyi 2021’de üçüncü ölüm nedeni sayar; inme iskemik kalp hastalığı ve COVID-19’dan sonra gelir (GBD 2021 Stroke Risk Factor Collaborators, 2024). DSÖ’nün 2023 verisinde ve Dünya İnme Örgütü’nde (WSO) inme ikinci ölüm nedenidir (DSÖ, 2026; Feigin ve ark., 2025). Fark yıldan ve yöntemden gelir.',
    seviye: 'ileri',
  },
  {
    soru: 'H01 örneğinde bulunan “glia nöronların iki katı” oranı için hangisi doğru bir yorumdur?',
    secenekler: [
      'Bütün insan beyni için geçerli olan kesin bir orandır',
      'Yalnızca ölçülen küçük parçaya aittir; bütün beyne genellenmez',
      'Bir farenin görme kabuğunda ölçülmüş bir orandır',
      'Bir meyve sineğinin beyninden elde edilmiş bir orandır',
    ],
    dogru: 1,
    aciklama:
      'H01, epilepsi ameliyatında çıkarılan bir milimetreküplük insan temporal kabuğudur. İçindeki glia–nöron oranı (2:1) yalnızca bu parçaya aittir. Bütün beyin için verilen oranlarla karıştırılmamalıdır (Shapson-Coe ve ark., 2024).',
    seviye: 'ileri',
  },
  {
    soru: 'FlyWire’da sinaps yoğunluğu memeli kabuğuyla karşılaştırıldığında nasıldır?',
    secenekler: [
      'Memeli kabuğundaki yoğunlukla hemen hemen aynıdır',
      'Memeli kabuğundaki yoğunluğun ancak onda biri kadardır',
      'Çok yüksektir: mikrometreküpte 7,4; memelide 1’den az',
      'Bu çalışmada sinaps yoğunluğu hiç ölçülmemiştir',
    ],
    dogru: 2,
    aciklama:
      'Sinapslar görüntülerde otomatik olarak saptandı. Bu sayıma göre sinek beyni 0,0175 mm³ nöropilde yaklaşık 130 milyon sinaps içerir. Bu, mikrometreküpte 7,4 sinaps demektir. Memeli kabuğunda bu değer 1’in altındadır (Dorkenwald ve ark., 2024).',
    seviye: 'ileri',
  },
];
