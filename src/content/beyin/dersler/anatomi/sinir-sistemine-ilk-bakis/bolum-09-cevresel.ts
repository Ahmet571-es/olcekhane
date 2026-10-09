import type { DersBolumu } from '../../../types';

/** 9. bölüm: çevresel sinir sisteminin haritası: kafa sinirleri, omurilik sinirlerinin oluşumu, sinir ağları, dermatomlar, gangliyonlar. */
export const cevreselSinirSistemi: DersBolumu = {
  id: 'cevresel-sinir-sistemi',
  baslik: 'Çevresel sinir sistemi: kafa ve omurilik sinirlerinin haritası',
  bloklar: [
    {
      tur: 'metin',
      md: `Merkezî sinir sistemi beyin ve omurilikten oluşur; onun dışında kalan her şey **çevresel sinir sistemidir** (*systema nervosum periphericum*) (OpenStax 13.4). Tanım “dışarıda kalan” üzerinden yapıldığı için çevresel sistemin sınırları merkezî sistem kadar derli toplu değildir (OpenStax 13.4). UTHealth kitabı onu şöyle sayar: 31 çift omurilik siniri, 12 çift kafa siniri, otonom sinir sistemi ve bunlarla ilişkili gangliyonlar (Dafny, 2020). Gray (1918) her yanda 43 sinir sayar: beyne bağlı 12 kafa siniri ve omuriliğe bağlı 31 omurilik siniri.

Bu haritanın iki yapı taşı **sinir** (*nervus*, çevredeki akson demeti) ve **gangliyon**dur (*ganglion*, çevredeki nöron gövdesi kümesi) (OpenStax 12.1). Bu bölümde sırayla kafa sinirlerine, omurilik sinirlerinin nasıl kurulduğuna, sinir ağlarına, dermatomlara ve gangliyon türlerine bakacağız. “Çevresel” sözcüğü yanıltmasın: çevresel sistemin bazı parçaları kafatasının ya da omurga kanalının içindedir (OpenStax 12.1). Örneğin yüzün duyusunu taşıyan trigeminal sinirin gangliyonu kafatasının içinde, sert zarın oluşturduğu bir boşlukta durur (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `**On iki çift kafa siniri** beyne bağlanır ve kafatası tabanındaki deliklerden geçer (Gray, 1918). Roma rakamlarıyla I’den XII’ye numaralanır (OpenStax 13.4). Ders kitaplarının basit sınıflamasına göre üçü yalnızca duyu lifi taşır (I koku, II görme, VIII işitme ve denge), beşi yalnızca hareket lifi taşır (göz hareketlerinin sinirleri III, IV ve VI ile XI ve XII), dördü ise karmadır (V, VII, IX ve X) (OpenStax 13.4).

Bu sınıflamanın görünmeyen bir katmanı da vardır: III, VII ve IX otonom gangliyonlara giden lifler de taşır; vagus siniri (X) ise esas olarak göğüs ve üst karın boşluğundaki otonom gangliyonlara gider (OpenStax 13.4). Kafa sinirlerinin hepsi tek tek Anatomi bölümünün “Kafa sinirleri I” ve “Kafa sinirleri II” derslerinde, geçtikleri delikler “Kafatası 3: Delikler, kanallar ve derin çukurlar” dersinde işlenir.`,
    },
    {
      tur: 'tablo',
      baslik: 'On iki kafa siniri: tür, kafatasından çıkış ve başlıca görev',
      sutunlar: ['No.', 'Sinir', 'Tür', 'Kafatasından çıkış', 'Başlıca görev'],
      satirlar: [
        ['I', 'Koku siniri (*nervus olfactorius*)', 'Duyu', 'Kalbur kemiğinin kribriform plağı', 'Koku'],
        ['II', 'Görme siniri (*nervus opticus*)', 'Duyu', 'Optik kanal', 'Görme; dokusu merkezî sinir sistemidir'],
        [
          'III',
          'Okülomotor sinir (*nervus oculomotorius*)',
          'Hareket + parasempatik',
          'Üst orbital yarık',
          'Dört göz kası; göz bebeğine giden parasempatik lifler',
        ],
        ['IV', 'Troklear sinir (*nervus trochlearis*)', 'Hareket', 'Üst orbital yarık', 'Üst eğik kas (süperiyor oblik)'],
        [
          'V',
          'Trigeminal sinir (*nervus trigeminus*)',
          'Karma',
          'V1 üst orbital yarık; V2 yuvarlak delik; V3 oval delik',
          'Yüz derisinin duyusu; çiğneme kasları',
        ],
        ['VI', 'Abdusens sinir (*nervus abducens*)', 'Hareket', 'Üst orbital yarık', 'Dış düz kas (lateral rektus)'],
        [
          'VII',
          'Fasiyal (yüz) sinir (*nervus facialis*)',
          'Karma + parasempatik',
          'İç kulak yolu ve yüz siniri kanalı',
          'Mimik kasları; tadın ve tükürük yapımının bir kısmı',
        ],
        ['VIII', 'Vestibulokoklear sinir (*nervus vestibulocochlearis*)', 'Duyu', 'İç kulak yolu', 'İşitme ve denge'],
        [
          'IX',
          'Glossofaringeal sinir (*nervus glossopharyngeus*)',
          'Karma + parasempatik',
          'Juguler delik',
          'Ağız ve üst boğaz kasları; tadın ve tükürük yapımının bir kısmı',
        ],
        [
          'X',
          'Vagus siniri (*nervus vagus*)',
          'Karma + parasempatik',
          'Juguler delik',
          'Göğüs ve üst karın organlarının iç dengesine katkı',
        ],
        ['XI', 'Aksesuar sinir (*nervus accessorius*)', 'Hareket', 'Juguler delik', 'Sternokleidomastoid ve trapez kası'],
        ['XII', 'Hipoglossal (dil altı) sinir (*nervus hypoglossus*)', 'Hareket', 'Hipoglossal kanal', 'Dil kasları'],
      ],
      not: 'Tür sütunu ders kitabının öğretim sınıflamasıdır (3 duyu, 5 hareket, 4 karma); “+ parasempatik”, sinirin otonom gangliyonlara lif taşıdığını gösterir (OpenStax 13.4). Çıkış yerleri ve IV, VI, XI, XII’nin hedefleri Romano ve ark. (2019); öteki görevler OpenStax 13.4; Latince adlar FIPAT (2019). TA2 bu on iki çiftin yanında terminal siniri (*nervus terminalis*) de “0. kafa siniri” eş adıyla listeler (uzman kutusu).',
    },
    {
      tur: 'sahne',
      baslik: 'Kafa sinirlerinin kafatasından çıkış kapıları',
      aciklama:
        'Kafatasının tepesi kaldırıldı; tabana yukarıdan, beynin oturduğu taraftan bakıyoruz (görüntünün üstü yüz tarafı, işaretler sol yarıda). Öndeki orta hat çıkıntısı horoz ibiğidir; koku lifleri (I) onun hemen iki yanındaki kalbur levhadan geçer. Ortadaki çukur Türk eyeridir. Sol yanda oval delikten trigeminalin üçüncü dalı (V3), iç kulak yolundan VII ve VIII geçer; arkadaki foramen magnumda omurilik soğanı omuriliğe devam eder. Öteki kapılar (optik kanal, üst orbital yarık, yuvarlak delik, juguler delik, hipoglossal kanal) bu sahnede işaretlenmedi; yerleri yukarıdaki tabloda. Modelde sinirler yoktur; yalnızca kemikteki kapıları görürüz. “Kesit” sürgüsüyle düzlemi kaydırabilirsin.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ust',
        kesit: { duzlem: 'aksiyel', konum: 0 },
        noktalar: [
          { nokta: 'horoz-ibigi', metin: 'Horoz ibiği: iki yanında kalbur levha (I)' },
          { nokta: 'turk-eyeri', metin: 'Türk eyeri' },
          { nokta: 'oval-delik-sol', metin: 'V3: oval delik' },
          { nokta: 'ic-kulak-yolu-sol', metin: 'VII, VIII: iç kulak yolu' },
          { nokta: 'buyuk-delik', metin: 'Foramen magnum' },
        ],
      },
      araclar: ['bakis', 'kesit'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Çevresel sinir sistemi** = 12 çift kafa siniri + 31 çift omurilik siniri + gangliyonlar (otonom sistemin çevredeki kısmı dahil).\n\n**Sinir** = çevredeki akson demeti; **gangliyon** = çevredeki nöron gövdesi kümesi.\n\n**Kafa sinirleri:** 3 duyu (I, II, VIII), 5 hareket (III, IV, VI, XI, XII), 4 karma (V, VII, IX, X); III, VII, IX ve X parasempatik lif de taşır.\n\n**Omurilik siniri:** arka kök duyu getirir, ön kök hareket götürür; birleşince karma sinir olur.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Koku sinirinin nöronları kendini yeniler: burnun koku epitelindeki duyu nöronları yaklaşık bir ile dört ay yaşar ve düzenli olarak yenileri yapılır (OpenStax 13.4). Bu nöronların aksonları yaklaşık yirmi ince dal hâlinde kalbur kemiğinin kribriform plağını deler (Gray, 1918) ve kafatasının içinde koku soğanında sonlanır (Romano ve ark., 2019). Gray (1918) bu liflerin miyelinsiz olduğunu da yazar.',
    },
    {
      tur: 'metin',
      md: `**Omurilik sinirleri** omurganın iki yanındaki deliklerden çıkar. Her omurilik siniri hem duyu hem hareket aksonu taşır ve omuriliğe iki kökle bağlanır: duyu aksonları **arka (dorsal) kökle** girer, somatik ve otonom hareket lifleri **ön (ventral) kökle** çıkar (OpenStax 13.4). Duyu nöronlarının gövdeleri arka kökün üzerindeki şişkinlikte, **arka kök gangliyonunda** durur. İki kök gangliyonun hemen ötesinde birleşir; oluşan omurilik siniri omurlar arası delikten çıkar ve kısa süre sonra bir **arka dala** ve bir **ön dala** ayrılır; iki dal da her iki kökten lif alır (Gray, 1918).

Göğüs bölgesinde ön dallar birbirinden bağımsız ilerler: T2–T11 sinirleri bir ağa katılmaz, kaburgalar arasındaki sinirleri verir (OpenStax 13.4). Boyun, bel ve sağrı bölgesinde ise ön dallar çıktıkları yerin yakınında birleşip **sinir ağları** (pleksus) kurar (Gray, 1918). Dört büyük ağ vardır (OpenStax 13.4):

- **Boyun ağı:** ensenin ve başın arka kısmının sinirleri ile diyaframı yöneten frenik sinir.
- **Kol ağı (brakiyal pleksus):** kolun sinirleri.
- **Bel ağı:** leğen bölgesi ve bacağın ön yüzü; büyük sinirlerinden biri femoral sinirdir.
- **Sağrı ağı:** en büyük siniri, tibial ve fibular sinirlerin birleşimi olan siyatik sinirdir.

Bir arka kök gangliyonundan gelen liflerin beslediği deri alanına **dermatom** denir; komşu dermatomlar birbiriyle örtüşür (Dafny, 2026). Kökler, dallar ve dermatomlar ünitenin 2. dersinde; boyun ve kol ağları 3. dersinde; bel ve sağrı ağları 4. dersinde ayrıntılı işlenir.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Dermatom haritası bir ipucudur, keskin bir sınır değil',
      md: 'Kitaplarda bedeni şerit şerit bölen renkli dermatom haritaları görürsün. Bu haritalar muayenede yol gösterir, ama birbirini tutmaz: ders kitaplarındaki haritalar arasında belirgin farklar vardır (Downs ve Laporte, 2011) ve kanıta dayalı bir derleme standart haritaların hatalı olduğunu gösterdi (Lee ve ark., 2008). Komşu dermatomlar örtüşür ve kişiden kişiye fark büyüktür. Bir haritadaki çizgiyi, deride gerçekten var olan bir sınır gibi okuma.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İki köken.** Kafa sinirlerinin hareket lifleri beynin içindeki çekirdeklerden, duyu lifleri beynin dışındaki gangliyonlardan ya da duyu organlarındaki hücrelerden çıkar (Gray, 1918). Bu yüzden her sinir için iki ayrı “köken” konuşulur: sinir kökünün beynin yüzeyinden çıktığı yer **görünür (yüzeysel) köken**, liflerinin izlenebildiği gri cevher ise **gerçek (derin) köken**dir (Gray, 1918).

**I ve II: iki özel sinir.** Koku reseptörleri burun mukozasındadır; aksonları (*fila olfactoria*) kribriform plağı geçerek ön kafa çukuruna girer ve koku soğanında sonlanır (Romano ve ark., 2019). Görme siniri ise adına rağmen dokusu bakımından merkezî sinir sisteminin uzantısıdır: miyelinini Schwann hücreleri değil oligodendrositler yapar (Romano ve ark., 2019). Gray (1918) de görme sinirinin öteki kafa sinirlerinden çok beyin içindeki bir lif yoluna karşılık geldiğini yazar. Sinir yaklaşık 50 mm uzunluğundadır: göz içinde 1, göz çukurunda 25, optik kanalda 9 ve kiazmadan önce 16 mm (Romano ve ark., 2019). Yani görme sinirinin kiazmadan önce kafa içinde de bir kesimi vardır. Aynı aksonlar kiazmaya kadar “görme siniri”, kiazmadan sonra “optik yol” (*tractus opticus*) adını alır: ad, iki sinirin birleştiği optik kiazmada değişir (OpenStax 12.1; Romano ve ark., 2019).

**Göz hareketleri ve trigeminal.** Okülomotor sinir dört göz kasını yönetir (OpenStax 13.4); troklear sinir üst eğik kası, abdusens dış düz kası sinirlendirir (Romano ve ark., 2019). Troklear sinir, kökü beyin sapının arka yüzünden çıkan tek kafa siniridir (Romano ve ark., 2019); Gray’e (1918) göre alt tepeciğin hemen arkasından, ince bir zar levhanın (üst medüller yelken) yüzeyinden çıkar. Trigeminal sinir en büyük kafa siniridir ve bir duyu, bir hareket kökü vardır (Romano ve ark., 2019); üç dalı kafatasını üç ayrı kapıdan terk eder (tablo ve sahne).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Omurilik sinirinin kuruluşu.** Ön kök, omuriliğin ön yüzünden çok sayıda kökçük (*fila radicularia*) olarak çıkar (Gray, 1918). Arka kökün gangliyonu (*ganglion spinale*) çoğunlukla omurlar arası delikte, köklerin sert zarı deldiği yerin hemen dışındadır; sağrı sinirlerinin gangliyonları ise omurga kanalının içindedir (Gray, 1918). Ön ve arka kök gangliyonun hemen ötesinde birleşir. Delikten çıkan sinir önce küçük bir **meningeal dal** verir; bu dal delikten omurga kanalına geri girer; omurları ve bağlarını, omuriliğin ve zarlarının damarlarını sinirlendirir (Gray, 1918). TA2’de bu dal *ramus meningeus nervi spinalis* adını taşır; eş adı rekürren dal, ilişkili adı **sinüvertebral sinirdir** (FIPAT, 2019). Sinir sonra arka ve ön dala ayrılır (Gray, 1918).

**Bağlantı dalları.** Her omurilik siniri yanındaki sempatik gövde gangliyonundan bir **gri bağlantı dalı** (*ramus communicans griseus*) alır; **beyaz bağlantı dalını** (*ramus communicans albus*) ise yalnızca göğüs sinirleri ile ilk bel sinirleri verir (Gray, 1918). Gray bu sınırı bir yerde T1–L2, başka bir yerde T1–L1 diye verir (Gray, 1918). Beyaz dallar miyelinli oldukları için beyazdır; gri dallar miyelinsiz aksonlardır (OpenStax 15.1). Otonom sistemdeki rolleri otonom ve enterik sistem bölümünde.

**Kökler ve lif türleri.** Klasik kurala göre arka kökte yalnızca duyu nöronlarının, ön kökte yalnızca hareket nöronlarının aksonları vardır (OpenStax 14.1); otonom sistemin preganglionik lifleri de ön kökle çıkar (OpenStax 13.4). Gray’e (1918) göre tipik bir omurilik siniri en az dört tür lif taşır: beden duvarından duyu getiren somatik getirici lifler, iç organlardan duyu getiren visseral getirici lifler, iskelet kasına giden somatik götürücü lifler ve otonom yolun ilk basamağı olan visseral götürücü (preganglionik) lifler. Gray visseral lifleri, kendi döneminin adlandırmasıyla, “sempatik” lifler diye anar.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Gangliyon türleri',
      sutunlar: ['Tür', 'Örnek', 'Nöron biçimi', 'Nerede?'],
      satirlar: [
        [
          'Arka kök (omurilik) gangliyonu',
          'Her omurilik sinirinin arka kökü',
          'Psödounipolar: tek uzantı kısa bir yoldan sonra T biçiminde ikiye ayrılır',
          'Omurlar arası delikte, köklerin sert zarı deldiği yerin hemen dışında; sağrı sinirlerinde omurga kanalının içinde',
        ],
        [
          'Kafa siniri duyu gangliyonları',
          'V (trigeminal), VII (genikulat), IX ve X’un duyu gangliyonları',
          'Arka kök gangliyonunun kafadaki karşılığı',
          'Trigeminal gangliyon kafatasının içinde, sert zarın oluşturduğu boşlukta',
        ],
        ['VIII’in gangliyonları', 'Spiral (koklear) ve vestibüler (Scarpa) gangliyon', 'Bipolar', 'Spiral gangliyon kokleada'],
        [
          'Sempatik zincir (paravertebral) gangliyonları',
          'Her yanda tipik olarak 23: 3 boyun, 12 göğüs, 4 bel, 4 sağrı; altta tek ganglion impar',
          'Multipolar',
          'Omurganın iki yanında; ganglion impar kuyruk sokumunun önünde',
        ],
        ['Prevertebral (kollateral) gangliyonlar', 'Çölyak, üst mezenterik ve alt mezenterik gangliyon', 'Multipolar', 'Omurganın önünde'],
        [
          'Terminal (intramural) gangliyonlar',
          'Parasempatik; ör. okülomotor sinirle ilişkili siliyer gangliyon',
          'Multipolar',
          'Hedef organın yanında ya da duvarının içinde',
        ],
        [
          'Enterik gangliyonlar',
          'Miyenterik ve submukozal ağların binlerce küçük gangliyonu',
          '—',
          'Sindirim kanalının duvarında (otonom ve enterik sistem bölümü)',
        ],
      ],
      not: 'Gangliyonlar çoğunlukla duyusal ya da otonom diye ikiye ayrılır (OpenStax 13.4); TA2 duyu gangliyonlarını “ganglia sensoria craniospinalia” eş adıyla toplar (FIPAT, 2019). Duyu ve otonom gangliyonlarda nöron gövdelerini satelit hücreler sarar (OpenStax 12.2). İnsanda gerçek tek kutuplu (unipolar) nöron yoktur; duyu gangliyonlarındaki tek uzantılı hücreler psödounipolardır (OpenStax 12.2). İstisna VIII’in gangliyonlarıdır: spiral ve vestibüler gangliyonlardaki hücreler bipolardır (Gray, 1918). Kaynaklar: Gray (1918); OpenStax 13.4 ve 15.1; Furness ve ark. (2014); ilgili satırlardaki ayrıntılar metinde.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Dört büyük sinir ağı ve kök değerleri',
      sutunlar: ['Ağ', 'Klasik kök değeri', 'Ders kitabındaki geniş değer', 'Başlıca sinir ve görev', 'Ayrıntı'],
      satirlar: [
        [
          'Boyun ağı (*plexus cervicalis*)',
          'C1–C4 (Gray, 1918)',
          'C1–C5 (OpenStax 13.4)',
          'Ense ve başın arkası; frenik sinir (diyafram): esas olarak C4’ten çıkar, C3 ve C5’ten dal alır',
          'Ünitenin 3. dersi',
        ],
        [
          'Kol ağı (*plexus brachialis*)',
          'C5–T1 ön dalları (Gray, 1918; Patel ve Smith, 2023)',
          'C4–T1 (OpenStax 13.4)',
          'Kolun sinirleri; kökler üst, orta ve alt gövdeyi yapar, her gövde köprücük kemiğinin altında ön ve arka bölüme ayrılır',
          'Ünitenin 3. dersi',
        ],
        [
          'Bel ağı (*plexus lumbalis*)',
          'L1–L3 ve L4’ün büyük kısmı; L1 sıklıkla T12’den dal alır (Gray, 1918)',
          'Bütün bel sinirleri (OpenStax 13.4)',
          'Leğen bölgesi ve bacağın ön yüzü; femoral sinir',
          'Ünitenin 4. dersi',
        ],
        [
          'Sağrı ağı (*plexus sacralis*)',
          'Lumbosakral gövde (L4’ün bir kısmı ve L5’in tamamı), S1 ve S2–S3’ün bir kısmı (Gray, 1918)',
          'L4–S4 (OpenStax 13.4)',
          'Siyatik sinir (tibial ve fibular sinirlerin birleşimi)',
          'Ünitenin 4. dersi',
        ],
        ['Göğüs sinirleri', 'T2–T11 ağ yapmaz (OpenStax 13.4)', '—', 'Kaburgalar arası (interkostal) sinirler', 'Ünitenin 2. dersi'],
      ],
      not: 'Ders kitabının geniş değerleri ağa katkı yapan komşu sinirleri de içine alır; derste klasik değerler esas alınır, katkılar ayrıca belirtilir. Gray (1918) bel ve sağrı ağlarını birlikte lumbosakral ağ olarak da anlatır ve onu bel, sağrı ve pudendal ağlara ayırır: S3’ün ön dalının alt kolu pudendal ağa gider. Gray (1918) iki ağ arasında bölünen bel sinirine *nervus furcalis* (çatal sinir) der; çoğu olguda bu sinir L4’tür. TA2 ise *nervus furcalis*’i bel sinirleri arasında, her zaman bulunmayan (*inconstant*) bir sinir olarak listeler (FIPAT, 2019). Kol ağında C4 genellikle C5’e bir dal verir, T1 de sıklıkla T2’den dal alır (Gray, 1918).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: '“Pleksus” her zaman aynı şeyi anlatmaz',
      md: `Omurilik sinirlerinin ağları için kullanılan “pleksus”, hücre gövdesi içermeyen bir sinir lifi ağı demektir (OpenStax 13.4). Bu ağlarda dallar birbirine karışır: bir ağdan çıkan her dal, ağı kuran bütün ana gövdelerden lif taşıyabilir; ama tek tek lifler kaynaşmaz, ayrı kalır (Gray, 1918). Yani ağdan çıkan bir sinir, birden çok omurilik bölümünden gelen lifleri bir arada taşıyabilir.

Otonom sistemde ise aynı sözcük gangliyon içeren ağlar için de kullanılır. Gray (1918) göğüsteki kalp ağını, karındaki solar (epigastrik) ağı ve leğendeki hipogastrik ağı, içlerinde prevertebral gangliyonlar bulunan üç büyük ağ olarak anlatır. Sindirim kanalının duvarındaki **enterik ağ** da binlerce küçük gangliyondan oluşur (Furness ve ark., 2014). Bir metinde “pleksus” geçtiğinde, içinde nöron gövdesi olup olmadığına bakmak gerekir.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Frenik sinir: boyundaki yaralanmanın düzeyi neden önemli?',
      md: 'Diyaframı yöneten frenik sinir omuriliğe C3–C5 düzeylerinde bağlanır (OpenStax 15.2); Gray (1918) sinirin esas olarak C4’ten çıktığını, C3 ve C5’ten birer dal aldığını yazar. Bu yüzden boyun ortasının altındaki bir omurilik hasarı, solunumu olanaksız kılarak ölüme yol açmaz (OpenStax 15.2): diyaframın sinir bağlantısı hasarın üstünde kalır. C3–C5 düzeyini ya da daha yukarısını tutan bir hasar ise bu bağlantıyı etkileyebilir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dermatom haritaları: tarih ve tartışma.** Klasik haritalar Sir Henry Head, Sir Charles Sherrington, Otfrid Foerster ile Jay Keegan ve Frederic Garrett’e aittir; çizilme yöntemleri bugün daha çok tarihsel ilgi taşır (Greenberg, 2003). Keegan ve Garrett 1948’de uzun, kıvrımlı dermatomlardan oluşan, ötekilerden kökten farklı bir harita yayımladı; bu harita büyük ölçüde disk fıtığının arka köke basısı incelenerek çıkarılmıştı (Downs ve Laporte, 2011). Ders kitaplarında görülen haritalar birbiriyle tutarsızdır (Downs ve Laporte, 2011).

Kanıta dayalı bir derleme, standart anatomi kitaplarındaki haritalar arasında önemli farklar bulunduğunu, güncel haritaların hatalı olduğunu ve kusurlu çalışmalara dayandığını yazdı. Yazarlar en iyi kanıtlardan, çoğu bireyde her arka köke ait en tutarlı dokunma alanlarını gösteren yeni bir harita çizdi ve dermatomların örtüşmesi ile değişkenliğinin daha çok vurgulanması gerektiğini belirtti (Lee ve ark., 2008).

Klinik veriler de haritanın sınırlarını gösterir. Kök ağrısı olan 169 hastada 226 sinir kökü incelendiğinde ağrı, boyun köklerinde olguların %69,7’sinde, bel köklerinde %64,1’inde dermatom düzenine uymuyordu; olası istisna S1 köküydü (Murphy ve ark., 2009). Cerrahiyle doğrulanmış 227 boyun radikülopatisi hastasının %62,6’sında standart dermatom düzeni görüldü (Hong ve Nam, 2022). Kol ağının varyasyonları da deri sinir alanlarının geleneksel haritadan sapmasına yol açabilir (Patel ve Smith, 2023). Dermatom, kök düzeyini kestirmek için yararlı bir ipucudur; ama öteki bulgularla birlikte yorumlanmalıdır.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Kafa sinirleri:** 3 duyu (I, II, VIII), 5 hareket (III, IV, VI, XI, XII), 4 karma (V, VII, IX, X); parasempatik lif: III, VII, IX, X.
- **Çıkışlar:** I kribriform plak; II optik kanal; III, IV, V1, VI üst orbital yarık; V2 yuvarlak delik; V3 oval delik; VII ve VIII iç kulak yolu; IX, X, XI juguler delik; XII hipoglossal kanal.
- **Omurilik siniri:** kökler → gangliyonun ötesinde birleşir → meningeal dal → arka ve ön dal. Gri dal her sinire; beyaz dal göğüs ve ilk bel sinirlerinden.
- **Ağlar (klasik):** boyun C1–C4, kol C5–T1, bel L1–L4, sağrı L4–S3; T2–T11 ağ yapmaz.
- **Frenik sinir:** C3–C5 (esas olarak C4).
- **Nöron biçimi:** arka kök gangliyonu psödounipolar; VIII’in gangliyonları bipolar; otonom gangliyonlar multipolar.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Kola yayılan ağrı ve dermatom haritası',
      oyku: `45 yaşında bir erkek, üç haftadır boynundan sağ koluna yayılan ağrı ve elinin dış yüzüne doğru uyuşmadan yakınıyor. Muayeneyi yapan öğrenci, ders kitabındaki dermatom haritasına bakıp hangi kökün sıkıştığını “kesin” olarak söyleyebileceğini düşünüyor.`,
      soru: 'Dermatom haritası tek başına hangi kökün etkilendiğini kesin olarak gösterebilir mi?',
      cozum: `**Hayır; harita güçlü bir ipucudur, ama kesin değildir.** Dermatom, tek bir arka kök gangliyonundan gelen liflerin beslediği deri alanıdır ve komşu dermatomlar birbiriyle örtüşür (Dafny, 2026). Ders kitaplarındaki haritalar birbiriyle tutarsızdır (Downs ve Laporte, 2011); kanıta dayalı bir derleme standart haritaların hatalı olduğunu ve kusurlu çalışmalara dayandığını gösterdi (Lee ve ark., 2008).

**Klinik veriler:** 169 hastalık bir çalışmada boyun köklerine bağlı ağrı olguların %69,7’sinde dermatom düzenine uymuyordu (Murphy ve ark., 2009). Cerrahiyle doğrulanmış 227 boyun radikülopatisi hastasının %62,6’sında standart dermatom düzeni görüldü; kas güçsüzlüğü olan 110 hastanın %67,3’ünde ise güçsüzlük standart miyotom düzenine uyuyordu. Yazarlar insan dermatom ve miyotomlarındaki değişkenliğin, özellikle C6 kök basısına bağlı güçsüzlükte yüksek olduğunu vurgular (Hong ve Nam, 2022). Kol ağının varyasyonları da deri sinir alanlarını klasik haritadan saptırabilir (Patel ve Smith, 2023).

**Sonuç:** Uyuşmanın dağılımı bir kök düzeyini düşündürür; ama karar, kas güçsüzlüğünün düzeni ve öteki bulgularla birlikte verilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: '“Sıfırıncı” sinir ve sınıflamanın sınırları',
      md: `**Terminal sinir.** TA2, on iki çiftin yanında **terminal siniri** (*nervus terminalis*) de kafa sinirleri arasında listeler; İngilizce eş adı “cranial nerve 0”dır (FIPAT, 2019). Sinir ilk kez 1878’de kıkırdaklı balıklarda (köpekbalıkları ve vatozlar) bulundu; insan embriyosunda 1913’te, yetişkin insanda bir yıl sonra tanımlandı (Ruqa ve ark., 2024). Kaşifinin adı başka bir kaynakla doğrulanamadığı için burada verilmedi.

**Görme siniri.** İşlevi ve dokusu bakımından merkezî bir lif yoludur (Gray, 1918; Romano ve ark., 2019); beyin zarlarıyla kılıflanır ve meningeal dura sinir boyunca ilerleyerek göz akına (sklera) devam eder (Ishikawa ve ark., 2026). Terminolojide ise kafa sinirleri arasında, çevresel sinir sistemi başlığında durur (FIPAT, 2019). Bu bir çelişki değil, adlandırma ile doku yapısı arasındaki farktır.

**3–5–4 sınıflamasının ötesi.** Ders kitabının “3 duyu, 5 hareket, 4 karma” sınıflaması bir öğretim kolaylığıdır; III, VII, IX ve X’un parasempatik lifleri bu sınıflamada görünmez (OpenStax 13.4). Ayrıntılı anlatımda lifler işlevsel bileşenlerine göre sınıflanır (bu dersin ilk bölümündeki uzman kutusu).

**Eskimiş görüş.** Gray’in döneminde trigeminal sinirin dallarına bağlı dört küçük gangliyon, yani siliyer (*ganglion ciliare*), sfenopalatin (bugünkü adıyla pterigopalatin, *ganglion pterygopalatinum*), otik (*ganglion oticum*) ve submandibular (*ganglion submandibulare*) gangliyonlar, çok kutuplu hücreleri yüzünden “sempatik sistemin kafadaki parçası” sayılıyordu (Gray, 1918). Bugün bu dört gangliyon parasempatik sistemin kafa kısmında sınıflanır (FIPAT, 2019). Trigeminal gangliyonun kendisi ise duyu kökünün gangliyonudur: Gray (1918) de onu böyle anlatır, TA2 de duyu kökünün altında listeler (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Cerrahın gözüyle çevresel sinirler',
      md: `- **Trigeminal gangliyon kafatasının içindedir:** temporal kemiğin kayalık kısmının tepesine yakın, sert zarın oluşturduğu bir boşlukta yatar (Gray, 1918); TA2 bu boşluğu *cavum trigeminale* (Meckel boşluğu) adıyla verir (FIPAT, 2019). “Kafa siniri gangliyonları kafatasının dışındadır” genellemesi bu yüzden yanlıştır.
- **Kökler:** C1’in arka kökü ön kökünden küçüktür ve olguların %8’inde hiç yoktur; sağrı sinirlerinin gangliyonları omurga kanalının içindedir (Gray, 1918). Meningeal dal (sinüvertebral sinir) omurlar arası delikten geri girer (Gray, 1918; FIPAT, 2019).
- **Kol ağının değişkenliği:** Güncel bir derlemeye göre gövdelerin düzeni olguların yaklaşık %84’ünde, kordonların düzeni %96’sında klasiktir; uç dallar daha değişkendir ve klasik düzen yaklaşık %75’tir (Patel ve Smith, 2023). 200 fetal kol ağının incelendiği bir seride ağların %71,5’i C5–T1’den oluşuyordu; “prefikse” ağ %25,5, “postfikse” ağ %2,5 oranındaydı (Uysal ve ark., 2003). Ankara’da Gülhane’de 11 fetal kadavradaki 20 ağın mikroskop altında incelendiği seride ağların yarısı prefikse, %15’i postfikse bulundu; ancak postfikse sayılan bütün ağlarda prefikse yapı da bildirildi, yani iki terim aynı ağ için birlikte kullanıldı (Kirik ve ark., 2018). Aynı yazarların aktardığı literatürde prefikse ağ sıklığı %24, %21,7 ve %48’dir (Kirik ve ark., 2018). Sayıların bu kadar dağınık olması, tanımların çalışmadan çalışmaya değiştiğini düşündürür.
- **Bel-sağrı bileşkesi:** Çoğu olguda L4 iki ağ arasında bölünür ve Gray (1918) bu sinire *nervus furcalis* der; lumbosakral gövde L4’ün bir kısmı ile L5’in tamamından oluşur (Gray, 1918). TA2 *nervus furcalis*’i her zaman bulunmayan (*inconstant*) bir bel siniri olarak listeler (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kaynaklardaki yanlışlar ve tanım farkları',
      sutunlar: ['Konu', 'Kaynaktaki ifade', 'Doğrusu ya da güncel bilgi'],
      satirlar: [
        [
          'Kafa siniri gangliyonları',
          '“Kökler kafatası içinde, gangliyonlar kafatası dışındadır” (OpenStax 13.4)',
          'Trigeminal gangliyon kafatasının içinde, Meckel boşluğundadır (Gray, 1918; FIPAT, 2019)',
        ],
        [
          'Kafa siniri gangliyon nöronları',
          'Bütün kafa siniri gangliyonlarının nöronları tek kutupludur (OpenStax 13.4)',
          'Spiral ve vestibüler gangliyonların nöronları bipolardır (Gray, 1918)',
        ],
        [
          'IX ve XII (ders kitabı tablosu)',
          'IX için “genikulat gangliyon”; XII için “gırtlak ve alt yutak kasları” (OpenStax 13.4)',
          'Genikulat gangliyon VII’ye aittir (aynı tablonun VII satırı); XII dil kaslarını sinirlendirir (Romano ve ark., 2019)',
        ],
        [
          'Troklear sinirin çıkışı',
          '“Ponstan çıktıktan sonra” (Romano ve ark., 2019)',
          'Alt tepeciğin hemen arkasından, üst medüller yelkenden çıkar (Gray, 1918)',
        ],
        [
          'Omurilik sinirlerinin çıkışı',
          '“İlki dışındaki bütün sinirler omurlarının altından çıkar” (Dafny, 2026)',
          'C1–C7 omurlarının üstünden, C8 C7’nin altından çıkar (aynı paragraf; OpenStax 13.4)',
        ],
        [
          'Dermatomlar',
          '“Vücut yüzeyinde kesin olarak haritalanabilir” (Dafny, 2026)',
          'Haritalar tutarsız ve kusurlu çalışmalara dayalı; örtüşme ve değişkenlik büyük (Lee ve ark., 2008; Downs ve Laporte, 2011)',
        ],
        [
          'Sinir ağlarının kökleri',
          'Boyun C1–C5, kol C4–T1, sağrı L4–S4 (OpenStax 13.4)',
          'Klasik değerler C1–C4, C5–T1, L4–S3; geniş değerler katkıları da sayar (Gray, 1918)',
        ],
        [
          'Arka kök gangliyonu',
          'Bir yerde “kökün”, başka yerde “omurilik sinirinin” genişlemesi (OpenStax 13.4)',
          'Gangliyon arka kökün üzerindedir; iki kök gangliyonun ötesinde birleşir (Gray, 1918)',
        ],
      ],
      not: 'Bu ifadeler yanlış bilgi olarak öğretilmesin diye listelendi; derste her konuda sağ sütundaki bilgi kullanıldı.',
    },
  ],
};
