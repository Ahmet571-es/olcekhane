import type { Soru } from '../../../types';

/** Bölüm sırasıyla temel, lisans ve uzman sorular. Doğru şıklar her düzeyin içinde dört yere dengeli dağıtılmıştır. */
export const sorular: Soru[] = [
  {
    soru: 'Kemiği boydan boya geçen ve damarların, sinirlerin geçtiği açıklığa ne denir?',
    secenekler: ['Delik (foramen)', 'Çukur (fossa)', 'Oluk (sulcus)', 'Çıkıntı (processus)'],
    dogru: 0,
    aciklama:
      'Delik (foramen) kemiği boydan boya geçen açıklıktır; en büyük örneği art kafa kemiğindeki foramen magnumdur. Çukur çanak gibi bir çukurluk, oluk yüzeyde uzanan uzun, dar bir oyuktur.',
    seviye: 'temel',
  },
  {
    soru: 'Dış kulak yolu hangi işaret türüne örnektir?',
    secenekler: ['Yol (meatus)', 'Krista', 'Kondil', 'Tüberkül'],
    dogru: 0,
    aciklama:
      'Yol (meatus) bir kanala açılan ağızdır; dış ve iç kulak yolu bunun kafatasındaki örnekleridir. Kondil eklem yüzü, krista sırt, tüberkül küçük yuvarlak çıkıntıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Frontal sinüs için hangisi doğrudur?',
    secenekler: [
      'Doğumda erişkin boyutundadır',
      'Doğumda yoktur; çocuklukta gelişmeye başlar',
      'Kama kemiğinin gövdesindedir',
      'Beyinden dönen kanı taşıyan bir toplardamar kanalıdır',
    ],
    dogru: 1,
    aciklama:
      'Frontal sinüs alın kemiğinin iki tablası arasındaki bir hava boşluğudur ve doğumda yoktur: havalanma yaklaşık 2 yaşında başlar, sinüs 8 yaş dolayında grafide görünür ve ergenlikte erişkin boyutuna ulaşır. Kafatasının içindeki toplardamar kanalları ise başka bir anlamda “sinüs” diye adlandırılır.',
    seviye: 'temel',
  },
  {
    soru: 'Alın kemiği kaç kemikle eklem yapar?',
    secenekler: ['Beş', 'Altı', 'Sekiz', 'On iki'],
    dogru: 3,
    aciklama:
      'Gray’e göre alın kemiği on iki kemikle eklem yapar: kama, kalbur, iki yan kafa, iki burun, iki üst çene, iki gözyaşı ve iki elmacık kemiği.',
    seviye: 'temel',
  },
  {
    soru: 'Yan kafa kemiğinin hangi köşesi bregmaya denk gelir?',
    secenekler: ['Alın köşesi', 'Art kafa köşesi', 'Kama köşesi', 'Mastoid köşesi'],
    dogru: 0,
    aciklama:
      'Alın köşesi koronal ve sagittal dikişlerin buluştuğu bregmadadır; bebekte burası ön bıngıldaktır. Art kafa köşesi lambdaya, kama köşesi pteriona, mastoid köşesi asteriona denk gelir.',
    seviye: 'temel',
  },
  {
    soru: 'Yan kafa deliğinden ne geçer?',
    secenekler: [
      'Görme siniri',
      'Orta meningeal atardamar',
      'Kafa derisinin toplardamarlarını üst sagittal sinüse bağlayan bir toplardamar',
      'Dil altı siniri',
    ],
    dogru: 2,
    aciklama:
      'Her kafatasında bulunmayan yan kafa deliğinden parietal emisser ven geçer; bu kapakçıksız toplardamar kafa derisinin toplardamarlarını kafatası içindeki üst sagittal sinüse bağlar.',
    seviye: 'temel',
  },
  {
    soru: 'Aşağıdakilerden hangisi şakak kemiğinin bir parçası değildir?',
    secenekler: ['Mastoid çıkıntı', 'Stiloid çıkıntı', 'Kayalık kısım', 'Kribriform plak'],
    dogru: 3,
    aciklama:
      'Gray’e göre şakak kemiği pul, kayalık, mastoid ve timpanik kısımlar ile stiloid çıkıntıdan oluşur. Elek gibi delikli kribriform plak kalbur kemiğinin parçasıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Yüz siniri kafatasını hangi delikten terk eder?',
    secenekler: ['İç kulak yolu', 'Stilomastoid delik', 'Karotis kanalı', 'Dış kulak yolu'],
    dogru: 1,
    aciklama:
      'Yüz siniri şakak kemiğine iç kulak yolundan girer, kemiğin içindeki yaklaşık 30 mm’lik kanalını izler ve stiloid ile mastoid çıkıntılar arasındaki stilomastoid delikten çıkar.',
    seviye: 'temel',
  },
  {
    soru: 'Alt çene şakak kemiğinin neresiyle eklem yapar?',
    secenekler: ['Mastoid çıkıntıyla', 'Juguler çukurla', 'Çene eklem çukuru ve eklem tümseğiyle', 'Stiloid çıkıntıyla'],
    dogru: 2,
    aciklama:
      'Alt çenenin kondili dış kulak yolunun hemen önündeki çene eklem çukurunun ön kısmına oturur; çukurun önündeki eklem tümseğiyle birlikte çene eklemini yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Art kafa kemiğinin kondilleri hangi kemikle eklem yapar?',
    secenekler: ['Aksis', 'Şakak kemiği', 'Alt çene', 'Atlas'],
    dogru: 3,
    aciklama:
      'Kondiller birinci boyun omuru olan atlasın üst eklem yüzleriyle eklem yapar. Bu eklemin başlıca hareketi başı öne eğip geriye kaldırmaktır (“evet” hareketi).',
    seviye: 'temel',
  },
  {
    soru: 'Art kafa kemiğinin iç yüzündeki alt iki çukurda ne oturur?',
    secenekler: ['Art kafa lobları', 'Beyinciğin yarım küreleri', 'Hipofiz bezi', 'Şakak lobları'],
    dogru: 1,
    aciklama:
      'Haç biçimli kabarıklık iç yüzü dört çukura böler: üstteki iki çukurda beynin art kafa lobları, alttaki iki çukurda beyinciğin yarım küreleri oturur.',
    seviye: 'temel',
  },
  {
    soru: 'Hipofiz bezi kama kemiğinin hangi yapısında oturur?',
    secenekler: ['Optik kanalda', 'Türk eyerinin hipofiz çukurunda', 'Pterigoid çukurda', 'Üst orbital yarıkta'],
    dogru: 1,
    aciklama:
      'Hipofiz bezi kama gövdesinin üst yüzündeki Türk eyerinin en derin yerinde, hipofiz çukurunda oturur. Pterigoid çukurda kaslar bulunur; optik kanal ve üst orbital yarık sinirlerin geçtiği açıklıklardır.',
    seviye: 'temel',
  },
  {
    soru: 'Kama kemiğinin dört ana kısmı hangileridir?',
    secenekler: [
      'Gövde, küçük kanatlar, büyük kanatlar ve pterigoid çıkıntılar',
      'Pul, kayalık, mastoid ve timpanik kısım',
      'Kribriform levha, dik levha ve iki labirent',
      'Gövde, dal, açı ve kondil',
    ],
    dogru: 0,
    aciklama:
      'Kama kemiği ortadaki gövde, iki küçük kanat, iki büyük kanat ve aşağı inen iki pterigoid çıkıntıdan oluşur. Öteki seçenekler sırasıyla şakak kemiğinin, kalbur kemiğinin ve alt çenenin kısımlarıdır.',
    seviye: 'temel',
  },
  {
    soru: 'Sfenoid sinüs için hangisi doğrudur?',
    secenekler: [
      'Alın kemiğinin içindedir',
      'Doğumda erişkin boyutundadır',
      'Kama gövdesinde, bir bölmeyle ayrılan iki boşluktur',
      'Orta burun yoluna açılır',
    ],
    dogru: 2,
    aciklama:
      'Sfenoid sinüsler kama gövdesinin içinde, çoğu kez bir yana eğik bir bölmeyle ayrılan iki boşluktur ve sfenoetmoidal girintiye açılır. Doğumda çok küçüktür; havalanma çoğu çocukta 3–5 yaşında saptanabilir.',
    seviye: 'temel',
  },
  {
    soru: 'Koku sinirinin lifleri kafatasına hangi yapıdan geçerek girer?',
    secenekler: ['Optik kanal', 'Foramen caecum', 'Kalbur kemiğinin dik levhası', 'Kalbur kemiğinin kribriform levhası'],
    dogru: 3,
    aciklama:
      'Kribriform (kalbur) levha elek gibi deliklidir; koku sinirinin lifleri bu deliklerden geçerek levhanın üstündeki koku soğancığına ulaşır.',
    seviye: 'temel',
  },
  {
    soru: 'Hangi burun kavkaları kalbur kemiğinin parçasıdır?',
    secenekler: ['Yalnızca alt kavka', 'Orta ve alt kavka', 'Üst ve orta kavka', 'Üç kavkanın hepsi'],
    dogru: 2,
    aciklama: 'Üst ve orta burun kavkaları kalbur kemiğinin labirentinden sarkar. Alt kavka ayrı bir yüz kemiğidir.',
    seviye: 'temel',
  },
  {
    soru: 'Alt çeneden sonra yüzün en büyük kemiği hangisidir?',
    secenekler: ['Elmacık kemiği', 'Üst çene kemiği', 'Sapan kemiği', 'Damak kemiği'],
    dogru: 1,
    aciklama:
      'Üst çene (maksilla) alt çeneden sonra yüzün en büyük kemiğidir; sağ ve sol üst çene birleşerek üst çenenin tamamını yapar ve gövdesinde maksiller sinüs bulunur.',
    seviye: 'temel',
  },
  {
    soru: 'Yüzün en küçük ve en kırılgan kemiği hangisidir?',
    secenekler: ['Burun kemiği', 'Alt burun kavkası', 'Damak kemiği', 'Gözyaşı kemiği'],
    dogru: 3,
    aciklama:
      'Gözyaşı kemiği göz çukurunun iç duvarının önünde durur; üst çenenin alın çıkıntısıyla birlikte gözyaşı kesesinin yuvasını yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Damak kemiğinin biçimi hangi harfe benzer?',
    secenekler: ['L', 'S', 'T', 'O'],
    dogru: 0,
    aciklama:
      'Damak kemiği yatay ve dikey iki kısımdan oluştuğu için L harfine benzer: yatay plak sert damağın arka dörtte birini, dik plak burun boşluğunun yan duvarının arka kısmını yapar.',
    seviye: 'temel',
  },
  {
    soru: 'Elmacık kemeri hangi iki kemiğin birleşmesiyle oluşur?',
    secenekler: [
      'Elmacık kemiği ve üst çene',
      'Elmacık kemiği ve alın kemiği',
      'Elmacık kemiği ve şakak kemiği',
      'Şakak kemiği ve alt çene',
    ],
    dogru: 2,
    aciklama:
      'Elmacık kemiğinin şakak çıkıntısı ile şakak kemiğinin elmacık çıkıntısı eğik bir dikişle birleşerek elmacık kemerini yapar; kemerin alt kenarından ve iç yüzünden çiğneme kası (masseter) başlar.',
    seviye: 'temel',
  },
  {
    soru: 'Alt alveoler sinir ve damarlar alt çeneye hangi delikten girer?',
    secenekler: ['Çene deliği (foramen mentale)', 'Mandibular delik', 'Mandibula çentiği', 'Juguler delik'],
    dogru: 1,
    aciklama:
      'Alt alveoler sinir ve damarlar dalın iç yüzünün ortasındaki mandibular delikten girer ve mandibular kanalda ilerler. Çene deliği ise gövdenin dış yüzünde, çene sinirinin çıktığı yerdir.',
    seviye: 'temel',
  },
  {
    soru: 'Dil kemiğini yerinde tutan yapı hangisidir?',
    secenekler: [
      'Alt çeneyle yaptığı eklem',
      'Birinci boyun omuruyla yaptığı eklem',
      'Stiloid çıkıntılardan inen stilohiyoid bağlar',
      'Kafatası tabanına kaynaşmış kısa bir kemik çubuk',
    ],
    dogru: 2,
    aciklama:
      'Dil kemiği hiçbir kemikle eklem yapmaz; şakak kemiklerinin stiloid çıkıntılarının uçlarından inen stilohiyoid bağlarla asılı durur.',
    seviye: 'temel',
  },
  {
    soru: 'Alt çene dalının tepesindeki iki çıkıntıdan hangisi çene eklemine katılır?',
    secenekler: ['Kondil çıkıntısı', 'Koronoid çıkıntı', 'Çene çıkıntısı', 'Lingula'],
    dogru: 0,
    aciklama:
      'Arkadaki kondil çıkıntısının başı (kondil) eklem diski aracılığıyla şakak kemiğiyle çene eklemini yapar. Öndeki koronoid çıkıntıya temporal kas ve masseter yapışır.',
    seviye: 'temel',
  },
  {
    soru: 'Kafatasının en ince bölgesi neresidir?',
    secenekler: ['Tam arkası (art kafa)', 'Tam önü (alın)', 'Tepesi', 'Tam yanı, şakak çukuru boyunca'],
    dogru: 3,
    aciklama:
      'Kafatası en kalın tam arkada ve tam önde, en ince tam yanda, şakak çukuru boyuncadır. Gray bunu kaslarla örtülü yerlerin ince kalmasıyla açıklar.',
    seviye: 'temel',
  },
  {
    soru: 'Gray 1918’in not ettiği Basel adlandırması (BNA) hangi kemikleri yüz kemiği değil kafatası (kranyal) kemiği sayıyordu?',
    secenekler: [
      'Alt çene ve dil kemiği',
      'Üst çene ve elmacık kemiği',
      'Kama ve kalbur kemiği',
      'Alt burun kavkası, gözyaşı kemiği, burun kemiği ve sapan kemiği',
    ],
    dogru: 3,
    aciklama:
      'Gray kafatasını 8 beyin kutusu ve 14 yüz kemiği olarak sayar; ama Basel adlandırmasının burun kapsülüyle birlikte gelişen alt burun kavkası, gözyaşı, burun ve sapan kemiklerini kranyal kemik saydığını not eder. Gray’in sayımında ve OpenStax gibi güncel ders kitaplarında bu dört kemik yüz kemikleri arasındadır.',
    seviye: 'lisans',
  },
  {
    soru: 'OpenStax 6.4’e göre kafa tabanı kemikleri hangi yolla kemikleşir?',
    secenekler: [
      'Kıkırdak içi (endokondral) kemikleşmeyle',
      'Zar içi (intramembranöz) kemikleşmeyle',
      'Doğumdan sonra kas kirişlerinin içinde',
      'Hiç kemikleşmez, kıkırdak kalır',
    ],
    dogru: 0,
    aciklama:
      'Kafa tabanı kemikleri ve uzun kemikler önce kıkırdak modeli kurulan, daha uzun süren endokondral yolla oluşur. Yüzün yassı kemikleri ve kafatası kemiklerinin çoğu ise zar içi kemikleşmeyle oluşur.',
    seviye: 'lisans',
  },
  {
    soru: 'Alın kemiğindeki ön etmoid kanalından hangisi geçer?',
    secenekler: ['Supraorbital sinir ve damarlar', 'Koku sinirinin lifleri', 'Nazosiliyer sinir ve ön etmoid damarlar', 'Görme siniri'],
    dogru: 2,
    aciklama:
      'Etmoid çentiğinin kenarındaki oluklar kalbur kemiğiyle birlikte ön ve arka etmoid kanallarını yapar. Ön kanaldan nazosiliyer sinir ve ön etmoid damarlar, arka kanaldan arka etmoid sinir ve damarlar geçer.',
    seviye: 'lisans',
  },
  {
    soru: 'Supraorbital çentik ya da delik göz çukurunun üst kenarında nerede bulunur?',
    secenekler: [
      'Kenarın tam ortasında',
      'Kenarın iç üçte biri ile dış üçte ikisinin birleştiği yerde',
      'Elmacık çıkıntısının ucunda',
      'Nasionun hemen yanında, orta hatta',
    ],
    dogru: 1,
    aciklama:
      'Üst kenarın keskin dış 2/3’ü ile yuvarlak iç 1/3’ünün birleştiği yerdedir; yüz orta hattından ortalama 2,3 cm uzaktadır ve supraorbital sinir ile damarları geçirir.',
    seviye: 'lisans',
  },
  {
    soru: 'Orta meningeal arterin ön dalları için derin bir oluk, bazen bir kemik kanal, yan kafa kemiğinin hangi köşesinin iç yüzündedir?',
    secenekler: ['Alın köşesi', 'Art kafa köşesi', 'Mastoid köşesi', 'Kama köşesi'],
    dogru: 3,
    aciklama:
      'Kama köşesi alın kemiği ile kamanın büyük kanadı arasına giren ince, sivri köşedir; iç yüzünde orta meningeal arterin ön dalları için derin bir oluk, bazen kanal bulunur. Mastoid köşesinin iç yüzünde ise transvers sinüs oluğunun bir bölümü vardır.',
    seviye: 'lisans',
  },
  {
    soru: 'Yan kafa kemiğinin kemikleşmesi için hangisi doğrudur?',
    secenekler: [
      'Zar içinde tek merkezden kemikleşir; merkez yaklaşık 8. haftada yan kafa tümseğinde belirir',
      'Kıkırdak içinde iki merkezden kemikleşir',
      'Kemikleşme doğumdan sonra başlar',
      'Önce köşeleri, en son ortası kemikleşir',
    ],
    dogru: 0,
    aciklama:
      'Yan kafa kemiği zar içinde, yan kafa tümseğindeki tek bir merkezden kemikleşir. Kemikleşme ışınsal yayıldığı için köşeler en son oluşur; bıngıldaklar da bu köşelerdedir.',
    seviye: 'lisans',
  },
  {
    soru: 'Mastoid antrumun tavanını hangi yapı oluşturur?',
    secenekler: ['Tegmen tympani', 'Lateral yarım daire kanalı', 'Mastoid çıkıntı', 'Sigmoid sinüs oluğu'],
    dogru: 0,
    aciklama:
      'Antrumun üstünde ince tegmen tympani vardır ve onu orta kafa çukurundan ayırır. Altta mastoid çıkıntı, dışta pul kısmı, içte lateral yarım daire kanalı bulunur; önde antrum attiğe açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Petrotimpanik (Glaser) yarığı için hangisi doğrudur?',
    secenekler: [
      'Vagusun kulak dalı buradan dışarı çıkar',
      'IX. sinirin timpanik dalı buradan geçer',
      'Stiloid çıkıntının kökünü kılıf gibi sarar',
      'Malleusun ön çıkıntısını barındırır ve ön timpanik arteri geçirir',
    ],
    dogru: 3,
    aciklama:
      'Yarık çene eklem çukurunu ikiye böler, orta kulağa açılır, malleusun ön çıkıntısını barındırır ve ön timpanik arteri geçirir; korda timpani hemen yanındaki Huguier kanalından geçer. Vagusun kulak dalı timpanomastoid yarıktan çıkar, IX’un timpanik dalı alt timpanik kanalcıktan geçer; stiloidin kökünü vajinal çıkıntı sarar.',
    seviye: 'lisans',
  },
  {
    soru: 'Macewen (suprameatal) üçgeninin ön sınırını hangi yapı oluşturur?',
    secenekler: ['Mastoid çıkıntının ucu', 'Elmacık çıkıntısının arka kökü', 'Sigmoid sinüs oluğu', 'Stiloid çıkıntı'],
    dogru: 1,
    aciklama:
      'Üçgen dış kulak yolunun arka duvarı ile elmacık çıkıntısının arka kökü arasındadır; altını dış kulak yolunun arka-üst kemik bölümü sınırlar. Mastoid antrum bu üçgenin derinindedir ve mastoidektominin ilk hedefidir.',
    seviye: 'lisans',
  },
  {
    soru: 'Hipoglossal kanal için hangisi doğrudur?',
    secenekler: [
      'Kondilin arkasındaki çukuru deler ve bir emisser ven geçirir',
      'Kondilin tabanını deler, juguler tüberkülün altındadır ve dil altı sinirini geçirir',
      'Juguler çentikte yer alır; IX, X ve XI. sinirleri geçirir',
      'Baziler kısmın ortasında, klivusun üstündedir',
    ],
    dogru: 1,
    aciklama:
      'Hipoglossal kanal kondilin tabanını deler, foramen magnumun hemen üstünde başlar ve dışa-öne gider; juguler tüberkül üstünü örter. Dil altı sinirini (XII) geçirir. Kondilin arkasındaki kanal ise emisser ven geçiren kondil kanalıdır.',
    seviye: 'lisans',
  },
  {
    soru: 'Art kafa düzlemi (planum occipitale) ömür boyu ayrı kalırsa ortaya çıkan kemiğin adı nedir?',
    secenekler: ['Üçüncü kondil', 'Parakondiler çıkıntı', 'İnka (interparietal) kemiği', 'Kerckring kemikçiği'],
    dogru: 2,
    aciklama:
      'Art kafa düzlemi zar içinde kemikleşir; ayrı kalırsa interparietal (İnka) kemiği olur. Kafa travmasında kırıktan ayırt edilmesi gerekir.',
    seviye: 'lisans',
  },
  {
    soru: 'Optik kanal kama kemiğinin neresindedir ve içinden ne geçer?',
    secenekler: [
      'Büyük kanatta; maksiller sinir',
      'Küçük kanadın iki kökü arasında; görme siniri ve oftalmik arter',
      'Gövde ile büyük kanat arasında; okülomotor sinir',
      'Pterigoid çıkıntının kökünde; vidian siniri',
    ],
    dogru: 1,
    aciklama:
      'Küçük kanat gövdeye iki kökle bağlanır; optik kanal bu iki kökün arasındadır ve görme siniri ile oftalmik arteri göz çukuruna geçirir. Kanalı üst orbital yarıktan ayıran arka köke cerrahlar optik payanda der.',
    seviye: 'lisans',
  },
  {
    soru: 'Pterigopalatin çukurun arka duvarında yukarıdan aşağıya hangi açıklıklar sıralanır?',
    secenekler: [
      'Oval delik, dikenli delik, foramen lacerum',
      'Optik kanal, üst orbital yarık, yuvarlak delik',
      'Yuvarlak delik, pterigoid kanal, farinks kanalı',
      'Vesalius deliği, oval delik, yuvarlak delik',
    ],
    dogru: 2,
    aciklama:
      'Gray’e göre pterigopalatin çukurun arka duvarında yukarıdan aşağıya ve içe doğru yuvarlak delik (V2), pterigoid (vidian) kanal ve farinks kanalı açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Tensor veli palatini kasının tendonu hangi kemik çıkıntının çevresinde kayar?',
    secenekler: ['Kama dikeni', 'Ön klinoid çıkıntı', 'Dış pterigoid levha', 'Pterigoid çengel'],
    dogru: 3,
    aciklama:
      'İç pterigoid levhanın alt ucu çengel biçimli pterigoid çengelde (hamulus) biter; tensor veli palatini tendonu bu çengelin çevresinde kayar. Kas skafoid çukurdan başlar; kama dikenine de tutunur.',
    seviye: 'lisans',
  },
  {
    soru: 'Arka etmoid hücreleri nereye açılır?',
    secenekler: ['Üst burun yoluna', 'Orta burun yolundaki etmoid hunisine', 'Alt burun yoluna', 'Doğrudan maksiller sinüse'],
    dogru: 0,
    aciklama:
      'Arka hücreler üst kavkanın altında üst burun yoluna (bazen en üst burun yoluna ya da sfenoid sinüse) açılır. Ön hücreler etmoid hunisi yoluyla, orta hücreler etmoid kabarcığının üstünde orta burun yoluna açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Yarım ay yarığını (hiatus semilunaris) aşağıdan ve yukarıdan hangi yapılar sınırlar?',
    secenekler: [
      'Aşağıda alt kavka, yukarıda orta kavka',
      'Aşağıda dik levha, yukarıda horoz ibiği',
      'Aşağıda maksiller sinüs ağzı, yukarıda frontal sinüs ağzı',
      'Aşağıda çengel çıkıntı, yukarıda etmoid kabarcığı',
    ],
    dogru: 3,
    aciklama:
      'Yarım ay yarığının alt sınırı çengel çıkıntının keskin, içbükey kenarı, üst sınırı etmoid kabarcığıdır; yarık kıvrık bir kanal olan etmoid hunisine açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e göre üst çene kaç kemikle eklem yapar?',
    secenekler: ['4', '6', '9', '12'],
    dogru: 2,
    aciklama:
      'Dokuz kemikle: alın ve kalbur kemikleri ile burun, elmacık, gözyaşı ve damak kemikleri, alt burun kavkası, sapan kemiği ve karşı üst çene.',
    seviye: 'lisans',
  },
  {
    soru: 'Burun-gözyaşı kanalı burun boşluğunun neresine açılır?',
    secenekler: ['Alt burun yoluna', 'Orta burun yoluna', 'Üst burun yoluna', 'Koanaya'],
    dogru: 0,
    aciklama:
      'Kanalı üst çenenin gözyaşı oluğu, gözyaşı kemiğinin inen çıkıntısı ve alt kavkanın gözyaşı çıkıntısı yapar; kanal alt burun yolunun ön kısmına açılır. Maksiller sinüs ise orta burun yoluna açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Aşağıdaki kemiklerden hangisi kıkırdak burun kapsülünün yan duvarında kemikleşir?',
    secenekler: ['Üst çene', 'Damak kemiği', 'Sapan kemiği', 'Alt burun kavkası'],
    dogru: 3,
    aciklama:
      'Gray’e göre alt burun kavkası fetal 5. ayda kıkırdak burun kapsülünün yan duvarında kemikleşir; üst çene, damak ve sapan kemikleri ise zarda kemikleşir.',
    seviye: 'lisans',
  },
  {
    soru: 'Sfenopalatin delik nasıl oluşur?',
    secenekler: [
      'Üst çenenin alın ve elmacık çıkıntıları arasında kalır',
      'Damak kemiğinin göz çukuru ve kama çıkıntıları arasındaki çentik, kama gövdesiyle kapanır',
      'Sapan kemiğinin kanatları ile kama gagası arasında kalır',
      'Gözyaşı kemiği ile alt burun kavkası arasında kalır',
    ],
    dogru: 1,
    aciklama:
      'Sfenopalatin çentik kama kemiği gövdesinin alt yüzüyle deliğe dönüşür; delik pterigopalatin çukurdan üst burun yolunun arkasına açılır ve sfenopalatin damarları, üst burun sinirlerini ve nazopalatin siniri geçirir.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e göre Meckel kıkırdağının lingulaya kadar uzanan parçası erişkinde neye dönüşür?',
    secenekler: ['Stilohiyoid bağa', 'Örs kemikçiğine', 'Stilomandibular bağa', 'Sfenomandibular bağa'],
    dogru: 3,
    aciklama:
      'Meckel kıkırdağının proksimal ucundan çekiç ve örs gelişir; lingulaya kadarki parçası lifli dokuya dönüşerek sfenomandibular bağ olarak kalır. Stilohiyoid bağ ise ikinci arkın (Reichert) kıkırdağından gelir.',
    seviye: 'lisans',
  },
  {
    soru: 'Lateral pterigoid kas alt çenede nereye yapışır?',
    secenekler: [
      'Açının iç yüzündeki pürüzlü alana',
      'Kondil boynunun ön-iç yüzündeki pterigoid çukurcuğa',
      'Koronoid çıkıntının dış yüzüne',
      'Milohyoid çizgiye',
    ],
    dogru: 1,
    aciklama:
      'Lateral pterigoidin üst ve alt karnı kondil boynundaki pterigoid çukurcuğa yapışır; bazı kişilerde üst karnın bir kısmı eklem kapsülüne de tutunur. Açının iç yüzüne medial pterigoid yapışır.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray’e göre erişkin alt çenesinde gövde ile dal arasındaki açı kaç derecedir?',
    secenekler: ['Yaklaşık 175°', 'Yaklaşık 140°', '110–120°', 'Yaklaşık 90°'],
    dogru: 2,
    aciklama:
      'Erişkinde dal neredeyse dikeydir ve açı 110–120° arasındadır. Açı doğumda 175°, dört yaş civarında 140°’dir; yaşlılıkta yeniden yaklaşık 140°’ye açılır.',
    seviye: 'lisans',
  },
  {
    soru: 'Walker yönteminde cinsiyet tahmini için puanlanan beş özellikten biri hangisidir?',
    secenekler: ['Mastoid çıkıntı', 'Foramen magnumun çapı', 'Dil kemiğinin kaynaşması', 'Burun kemiğinin uzunluğu'],
    dogru: 0,
    aciklama:
      'Walker yöntemi glabella, göz çukurunun üst kenarı, ense kristası, mastoid çıkıntı ve çene çıkıntısını 1 ile 5 arasında puanlar. Foramen magnum ölçüleri cinsiyeti %80’in üstünde ayıramamıştır; dil kemiğinin kaynaşması ve burun kemiğinin uzunluğu Walker yönteminin özellikleri arasında değildir.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray 1918’e göre doğumdan 7 yaşına kadar hangi yapılar erişkin boyutuna ulaşır?',
    secenekler: [
      'Frontal ve maksiller sinüsler',
      'Foramen magnum ve şakak kemiklerinin kayalık kısımları',
      'Mastoid çıkıntılar',
      'Kaş kemerleri ve glabella',
    ],
    dogru: 1,
    aciklama:
      'Gray, kafatasının 7 yaşına kadar hızla büyüdüğünü ve bu yaşta foramen magnum ile kayalık kısımların erişkin boyutuna ulaştığını yazar. Sinüsler ve yüz ergenlikteki ikinci büyüme atağında belirginleşir; mastoid ve kaş kemerleri doğumda gelişmemiştir.',
    seviye: 'lisans',
  },
  {
    soru: 'Gray 1918’e göre hangi kemikler doğumda birden çok parçadan oluşur?',
    secenekler: [
      'Yalnızca yan kafa kemikleri',
      'Art kafa, şakak, kama, alın kemikleri ve alt çene',
      'Burun ve gözyaşı kemikleri',
      'Damak kemikleri ve alt burun kavkaları',
    ],
    dogru: 1,
    aciklama:
      'Gray doğumda art kafa, şakak, kama ve alın kemikleri ile alt çenenin birden çok parçadan oluştuğunu yazar. Bu parçaların kaynaşma zamanları her kemiğin kendi bölümünde verilir.',
    seviye: 'ileri',
  },
  {
    soru: 'Gray’in kitabındaki “semilunar ganglion” bugünkü Latince adlandırmada hangi adla geçer?',
    secenekler: ['Ganglion geniculi', 'Ganglion ciliare', 'Ganglion trigeminale', 'Ganglion oticum'],
    dogru: 2,
    aciklama:
      'Gray’in semilunar ganglion dediği yapı bugün trigeminal gangliondur (ganglion trigeminale); kayalık kısmın tepesine yakın izi de impressio trigeminalis adını taşır.',
    seviye: 'ileri',
  },
  {
    soru: 'Frontal sinüsün ön duvarında 3 mm çökme var; arka duvar sağlam, BOS sızıntısı yok, boşalma yolu açık. Güncel bir derlemeye göre en uygun yaklaşım hangisidir?',
    secenekler: ['İzlem', 'Kranializasyon', 'Riedel ablasyonu', 'Sinüs obliterasyonu'],
    dogru: 0,
    aciklama:
      '4 mm’den az yer değiştirme hafif sayılır; bir seride hafif yer değiştirmiş 44 ön duvar kırığının hiçbirinde kontur bozukluğu gelişmedi. Kranializasyon ağır arka duvar yaralanmalarına, Riedel ablasyonu yaygın osteomiyelite ayrılır; rutin obliterasyon artık önerilmiyor.',
    seviye: 'ileri',
  },
  {
    soru: 'Frontal sinüsün kranializasyonunda sinüsün burunla bağlantısı nasıl kapatılır?',
    secenekler: [
      'Yalnızca kemik mumuyla',
      'Sinüsün içi yağ greftiyle doldurularak',
      'Supraorbital damar-sinir demeti bağlanarak',
      'Ters çevrilen mukoza, küçük bir şakak kası grefti ve yaklaşık 5 × 5 mm’lik bir kemik kamayla, katman katman',
    ],
    dogru: 3,
    aciklama:
      'Kranializasyonda boşalma yolu katman katman kapatılır: mukoza ters çevrilerek yol tıkanır, üstüne küçük bir şakak kası grefti ve yaklaşık 5 × 5 mm’lik bir kemik kama konur. Supraorbital ve supratroklear damar-sinir demetleri ise korunmalıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Büyümüş yan kafa delikleri (foramina parietalia permagna) için hangisi doğrudur?',
    secenekler: [
      'Sonradan gelişen bir kemik erimesidir',
      'Her zaman nöbete yol açar',
      'Çapı 5 mm’den büyüktür, otozomal baskın kalıtılır ve mikro-BT bulguları doğuştan bir kemikleşme kusurunu destekler',
      'Eşlik eden toplardamar anomalilerini göstermede tercih edilen yöntem düz grafidir',
    ],
    dogru: 2,
    aciklama:
      '5 mm’den büyük yan kafa delikleri eksik penetranslı otozomal baskın kalıtılır; kenarları düzgün ve kortekslidir, bu da erime değil doğuştan bir kusur olduğunu destekler. Çoğu kişi belirtisizdir; eşlik eden anomaliler için tercih edilen yöntem MR’dir.',
    seviye: 'ileri',
  },
  {
    soru: 'İki taraflı yan kafa incelmesinde hangi katman genellikle korunur?',
    secenekler: ['Dış tabla', 'İç tabla', 'Diploe', 'Hiçbiri; üç katman birlikte incelir'],
    dogru: 1,
    aciklama:
      'Biparietal incelmede dış tabla ve diploe kaybolana kadar incelir, iç tabla genellikle korunur. En sık menopoz sonrası kadınlarda görülür ve kafatası kırığı riskini artırır.',
    seviye: 'ileri',
  },
  {
    soru: 'İç kulak yolunun dibinde (fundus) yüz siniri hangi bölmede bulunur?',
    secenekler: ['Ön-alt', 'Arka-üst', 'Ön-üst', 'Arka-alt'],
    dogru: 2,
    aciklama:
      'Yatay krista (crista transversa) dibi üst ve alt bölmelere, Bill çubuğu (crista verticalis) üst bölmeyi öne ve arkaya ayırır. Yüz siniri ön-üstte; koklear sinir ön-altta, üst vestibüler sinir arka-üstte, sakküle giden sinirler arka-altta bulunur.',
    seviye: 'ileri',
  },
  {
    soru: 'Üst yarım daire kanalı dehisansı için hangisi doğrudur?',
    secenekler: [
      'Kadınlarda erkeklerden belirgin olarak daha sık görülür',
      'Mastoid havalanması arttıkça kanalın üstündeki kemik kalınlaşır',
      'Kalın BT kesitleri ince kesitlerden daha duyarlıdır',
      'Kadavra mikroskopisinde %0,5, BT çalışmalarında %3–9 bulunur; BT aşırı tanı koyabilir',
    ],
    dogru: 3,
    aciklama:
      'Kemik duvar kadınlarda daha ince olsa da sıklık iki cinsiyette eşittir; havalanma arttıkça örtü incelir ve risk artar. 0,5–0,6 mm’lik kesitler duyarlılığı %50’den %93’e çıkarır. Histoloji ile BT arasındaki fark BT’nin aşırı tanı koyabildiğini gösterir.',
    seviye: 'ileri',
  },
  {
    soru: 'Mastoid cerrahisinde yüz sinirinin istemeden yaralanmasının en sık yeri neresidir?',
    secenekler: ['İkinci dirsek', 'Labirent segmenti', 'İç kulak yolu', 'Stilomastoid deliğin dışı'],
    dogru: 0,
    aciklama:
      'Mastoid cerrahisinde istemeden oluşan yüz felcinin en sık yeri ikinci dirsektir. Dirsek korteksten ortalama 19 mm derindedir; lateral yarım daire kanalı, örsün kısa çıkıntısı ve dış kulak yolunun arka duvarı yüz sinirini bulmanın başlıca işaretleridir.',
    seviye: 'ileri',
  },
  {
    soru: 'Anderson–Montesano sınıflamasında tip III art kafa kondili kırığı hangisidir?',
    secenekler: [
      'Eksenel yüklenmeyle kondilin parçalı ezilmesi',
      'Bir kafa tabanı kırığının kondile uzanması',
      'Kondilin iç-alt kenarından dense doğru bir parçanın koparılması',
      'Kondilin ön-arka yönde ikiye ayrılması',
    ],
    dogru: 2,
    aciklama:
      'Tip III, kanat bağının kondilin iç-alt kenarından bir parçayı koparmasıdır; en ağır ve dengesiz olabilecek tip sayılır. Tip I eksenel yüklenmeyle ezilme, tip II kafa tabanı kırığının kondile uzanmasıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Üçüncü kondil (condylus tertius) için hangisi doğrudur?',
    secenekler: [
      'Hipokordal yayın kaynaşmamasıyla basionun alt ucunda kalan kemik bir kalıntıdır ve basion kırığını taklit edebilir',
      'Juguler çıkıntıdan atlasın enine çıkıntısına uzanan kemiktir',
      'Art kafa düzleminin ayrı kalmasıyla oluşur',
      'Her erişkinde bulunan normal bir yapıdır',
    ],
    dogru: 0,
    aciklama:
      'Proatlasın hipokordal yayı kaynaşmazsa basionun alt ucunda üçüncü kondil kalabilir; dens ya da atlasın ön kemeriyle eklem yapabilir ve travma BT’sinde basion kırığını taklit eder. Juguler çıkıntıdan atlasa uzanan kemik parakondiler (paramastoid) çıkıntıdır.',
    seviye: 'ileri',
  },
  {
    soru: 'Sfenoid sinüste iç karotis arter protrüzyonu farklı serilerde %7,9 ile %50 arasında bildirilir. Bunun başlıca nedeni hangisidir?',
    secenekler: [
      'Protrüzyonun yaşla artması',
      'Tanım farkı: herhangi bir kabarıklığın mı, yapının çevresinin yarısından fazlasının mı sayıldığı',
      'BT’nin sinüs duvarındaki kemiği hiç gösterememesi',
      'Arterin çocuklukta sinüsün öbür yanına geçmesi',
    ],
    dogru: 1,
    aciklama:
      'Bazı çalışmalar herhangi bir kabarıklığı sayar, bazıları yapının çevresinin %50’sinden fazlasının sinüse açık olmasını şart koşar; bu terim farklılığı oranlardaki büyük farkın başlıca nedenlerindendir. Bir Türk serisinde kabarıklık yaşla artmıyor, azalıyordu.',
    seviye: 'ileri',
  },
  {
    soru: 'Vidian (pterigoid) kanal tipleri için hangisi doğrudur?',
    secenekler: [
      'Bütün sınıflamalarda tip 1 sinüsün içindeki kanaldır',
      'Kanal hiçbir zaman sinüse çıkıntı yapmaz',
      'Kanal yuvarlak deliğin içinden geçer',
      'Açar ve arkadaşlarının şemasında tip 1 gövdenin içindeki kanaldır; Yegin şemasında tip 1 tamamen sinüs içindedir',
    ],
    dogru: 3,
    aciklama:
      'İki şema ters numaralanır: Açar ve ark. (2019) tip 1’i gövdenin içindeki kanal (%55,6), Yegin ise tamamen sinüs içindeki kanal olarak tanımlar. Bu yüzden raporda tip numarası yerine kanalın yerini tarif etmek daha güvenlidir.',
    seviye: 'ileri',
  },
  {
    soru: 'Postseller tipte ve geniş yan havalanması olan bir sfenoid sinüste hangisi beklenir?',
    secenekler: [
      'Eyerin ön duvarı ve tabanı genellikle 1 mm’den incedir; optik kanal ve karotis kabarıklığı daha sıktır',
      'Transsfenoidal yaklaşım için en elverişsiz tiptir, çünkü kalın kemik delinmelidir',
      'Havalanma eyerin ön duvarının önünde biter',
      'Optik kanal kabarıklığı bu tipte hiç görülmez',
    ],
    dogru: 0,
    aciklama:
      'Seller ve postseller tiplerde eyerin ön duvarı ve tabanı tipik olarak 1 mm’den incedir; postseller tip ile tip IV–V yan uzanım optik kanal, yuvarlak delik, vidian ve karotis kanalı kabarıklığı ve dehisensiyle en sık birlikte görülür. Kalın kemiğin delinmesini gerektiren tipler konkal ve havalanmamış tiplerdir.',
    seviye: 'ileri',
  },
  {
    soru: 'Vinciguerra ve arkadaşlarının 37 iyatrojenik BOS kaçağında defekt en sık nerede bulundu?',
    secenekler: [
      'Lateral lamelde',
      'Sfenoid sinüsün yan duvarında',
      'Kribriform levhada ve etmoid tavanında',
      'Frontal sinüsün arka duvarında',
    ],
    dogru: 2,
    aciklama:
      'Defekt %45,9 oranında kribriform levhada, %37,8 oranında etmoid tavanındaydı; lateral lamelde yalnızca %8,1 idi. Kafa tabanı asimetrisi kaçak olanlarda belirgin biçimde sıktı.',
    seviye: 'ileri',
  },
  {
    soru: 'Onodi hücresi için hangisi doğrudur?',
    secenekler: [
      'Sfenoid sinüsün içindeki bir bölmedir',
      'Sfenoid sinüsün üstüne uzanan, görme siniri ya da iç karotise komşu bir arka etmoid hücresidir',
      'En öndeki etmoid hücresidir ve frontal girintinin ön sınırını belirler',
      'Göz çukurunun tabanına gelişen etmoid hücresidir',
    ],
    dogru: 1,
    aciklama:
      'Onodi (sfenoetmoidal) hücresi sfenoid sinüsün üstünde yer alan, en az bir görme sinirine ya da iç karotis artere yakın arka etmoid hücresidir; sinüs sanılırsa yön kaybına yol açabilir. En öndeki hücre agger nasi, göz çukuru tabanındaki hücre Haller hücresidir.',
    seviye: 'ileri',
  },
  {
    soru: '75 çalışmayı birleştiren meta-analize göre büyük damak deliği en sık hangi dişin karşısındadır?',
    secenekler: ['Birinci büyük azı', 'İkinci küçük azı', 'İkinci büyük azı', 'Üçüncü büyük azı'],
    dogru: 3,
    aciklama:
      'Delik olguların %64,9’unda üçüncü büyük azının, %19,3’ünde ikinci ile üçüncü büyük azının arasının karşısındadır; orta hattaki damak dikişine ortalama 15,22 mm uzaklıktadır (Kim ve ark., 2023).',
    seviye: 'ileri',
  },
  {
    soru: 'Kuru kafatası ölçümlerinde göz altı deliğinin göz altı kenarına ortalama uzaklığı yaklaşık ne kadardır?',
    secenekler: ['2 mm', '6–7 mm', '15 mm', '25 mm'],
    dogru: 1,
    aciklama:
      'Hindistan ve Sri Lanka serilerinde ortalama 6,1–7,3 mm bulundu; Hindistan serisinde aralık 2–11,5 mm idi; ders kitaplarındaki “yaklaşık 1 cm” bilgisi ölçümlerden büyüktür.',
    seviye: 'ileri',
  },
  {
    soru: 'Türkiye’deki 272 hastalık KIBT serisinde maksiller sinüs septaları için hangisi doğrudur?',
    secenekler: [
      'Sinüs yarılarının %58’inde vardı ve çoğu orta bölgedeydi',
      'Hiçbir sinüste görülmedi',
      'Yalnızca dişsiz hastalarda görüldü',
      'Sinüs yarılarının %5’inde vardı ve hepsi ön bölgedeydi',
    ],
    dogru: 0,
    aciklama:
      'Orhan ve ark. (2013) septayı sinüs yarılarının %58’inde, septaların %69,1’ini orta bölgede buldu; önceki çalışmalardaki %16–33’ten yüksek oranı ince kesitli KIBT’ye bağladı. Septalar sinüs tabanı yükseltmede zar yırtılması riskini artırır.',
    seviye: 'ileri',
  },
  {
    soru: 'Mikro-BT kadavra çalışmasına (Kawata ve ark., 2024) göre elmacık-yüz deliği için hangisi doğrudur?',
    secenekler: [
      'Her kemikte tam olarak bir tane bulunur',
      'Çoğu şakak çıkıntısı bölgesindedir',
      'Hiç olmayabilir ya da 1–4 tane olabilir; kadınlarda sayısı daha fazladır',
      'Çapı göz altı deliğinden büyüktür',
    ],
    dogru: 2,
    aciklama:
      'Delik hiç olmayabilir ya da bir kemikte 1–4 tane olabilir; erkekte en sık 1, kadında en sık 2 delik vardı. Deliklerin yaklaşık %78–79’u gövde bölgesindeydi, şakak çıkıntısında hiç yoktu; ortalama çapı yaklaşık 1 mm’dir.',
    seviye: 'ileri',
  },
  {
    soru: 'Anadolu’dan 115 kuru alt çenede mandibular deliğin konumu için hangisi doğrudur?',
    secenekler: [
      'Deliklerin yarısı okluzal düzlemin altındaydı ve delik dalın yaklaşık ortasındaydı',
      'Bütün delikler okluzal düzlemin en az 10 mm üstündeydi',
      'Delik dalın arka kenarına bitişikti',
      'Delik gövdenin dış yüzünde, ikinci küçük azının altındaydı',
    ],
    dogru: 0,
    aciklama:
      'Deliklerin %50,23’ü okluzal düzlemin altındaydı; ön kenara uzaklık 14,71 mm, arka kenara 12,67 mm olduğundan delik yaklaşık dalın ortasındaydı. Yazarlar iğneyi okluzal düzlemin 3–4 mm üstünden, ön kenarın 1,5–2 mm arkasından önerir.',
    seviye: 'ileri',
  },
  {
    soru: 'Dil kemiğinin gövdesi ile büyük boynuzlarının kaynaşması için hangisi doğrudur?',
    secenekler: [
      'Kaynaşma 18 yaşından önce tamamlanır ve yaş tahmininde güvenilir bir ölçüttür',
      'Kaynaşma yalnızca kadınlarda görülür',
      'Kaynaşma genellikle 35–45 yaşından önce olmaz, hiç olmayabilir; yaş ya da cinsiyet tahmininde kullanılamaz',
      'Kaynaşma her zaman iki taraflıdır',
    ],
    dogru: 2,
    aciklama:
      'Adli çalışmalara göre kaynaşma genellikle 35–45 yaşlarına kadar olmaz, hiç olmayabilir ve 18–20 yaşından önce bildirilmemiştir. Çok değişken olduğu için yaş ya da cinsiyet göstergesi olarak kullanılamaz; tek taraflı kaynaşma da sık görülür.',
    seviye: 'ileri',
  },
  {
    soru: 'Aksesuar çene deliği ile ilgili hangisi doğrudur?',
    secenekler: [
      'Panoramik grafi KIBT’de görülen aksesuar deliklerin neredeyse tamamını gösterir',
      'Kuru kemik meta-analizinde birleşik sıklık %40 bulunmuştur',
      'Aksesuar delikler çoğunlukla iki taraflıdır',
      'Ordu’daki 301 hastalık KIBT serisinde hastaların %13’ünde görüldü; bildirilen sıklık yönteme göre değişir',
    ],
    dogru: 3,
    aciklama:
      'Ordu serisinde 301 hastanın 39’unda (%13) aksesuar delik vardı. KIBT çalışmalarında sıklık %2–26, kuru kemik meta-analizinde %6,1’dir; panoramik grafi bu deliklerin çoğunu göstermez ve iki taraflı olanlar yalnızca %2,1’dir.',
    seviye: 'ileri',
  },
  {
    soru: 'Japonya’daki halo serisinde pinin kafatasını delmesiyle en çok ilişkili ölçü hangisiydi?',
    secenekler: ['Toplam kafatası kalınlığı', 'Dış tablanın kalınlığı', 'Diploenin kalınlığı', 'Kafa derisinin kalınlığı'],
    dogru: 1,
    aciklama:
      'Belirleyici olan toplam kalınlık değil tablaların kalınlığıydı: sağ önde dış tabla delinen grupta 1,58 mm, delinmeyen grupta 2,12 mm’ydi. Delinme ileri yaş, kadın cinsiyet ve osteoporozla ilişkiliydi.',
    seviye: 'ileri',
  },
  {
    soru: 'Kafatasından cinsiyet tahmini için hangi öneri yapılmıştır?',
    secenekler: [
      '55 yaşın üstündeki kadınlarda kafatasından cinsiyet tahmini yapılmamalıdır',
      'Walker denklemleri her toplumda aynı doğrulukla kullanılabilir',
      'Kafa tabanı, yüzden daha güçlü cinsiyet farkı taşır',
      'Mastoid çıkıntı Walker özelliklerinin ilk olgunlaşanıdır',
    ],
    dogru: 0,
    aciklama:
      'Menopozdan sonra özellikler erkeksi yöne kaydığı için 55 yaş üstü kadınlarda kafatasıyla cinsiyet tahmini önerilmez. Walker denklemleri İtalyan kadınlarında yalnızca %56–78 doğruydu; kafa tabanı yüzden önce olgunlaştığı için farkı daha zayıftır; ense kristası ilk olgunlaşır, mastoid çıkıntı en son olgunlaşanlardandır.',
    seviye: 'ileri',
  },
];
