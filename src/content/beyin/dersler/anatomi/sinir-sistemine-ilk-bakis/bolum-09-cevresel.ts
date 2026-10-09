import type { DersBolumu } from '../../../types';

/** 9. bölüm: çevresel sinir sisteminin haritası: kafa sinirleri, omurilik sinirlerinin oluşumu, sinir ağları, dermatomlar, gangliyonlar. */
export const cevreselSinirSistemi: DersBolumu = {
  id: 'cevresel-sinir-sistemi',
  baslik: 'Çevresel sinir sistemi: kafa ve omurilik sinirlerinin haritası',
  bloklar: [
    {
      tur: 'metin',
      md: `Merkezî sinir sistemi beyin ve omurilikten oluşur. Onun dışında kalan her şey **çevresel sinir sistemidir** (*systema nervosum periphericum*) (OpenStax 13.4). Bu tanım “dışarıda kalan” üzerinden yapılır. Bu yüzden çevresel sistemin sınırları, merkezî sistem kadar derli toplu değildir (OpenStax 13.4). UTHealth kitabı çevresel sistemin parçalarını şöyle sayar: 31 çift omurilik siniri, 12 çift kafa siniri, otonom sinir sistemi ve bunlarla ilişkili gangliyonlar (Dafny, 2020). Gray (1918) her yanda 43 sinir sayar: beyne bağlı 12 kafa siniri ve omuriliğe bağlı 31 omurilik siniri.

Bu haritanın iki yapı taşı vardır. **Sinir** (*nervus*), çevredeki akson demetidir. **Gangliyon** (*ganglion*) ise çevredeki nöron gövdesi kümesidir (OpenStax 12.1). Bu bölümde sırayla şunlara bakacağız: kafa sinirleri, omurilik sinirlerinin nasıl kurulduğu, sinir ağları, dermatomlar ve gangliyon türleri.

“Çevresel” sözcüğü yanıltmasın. Çevresel sistemin bazı parçaları kafatasının ya da omurga kanalının içindedir (OpenStax 12.1). Örneğin trigeminal sinir yüzün duyusunu taşır. Bu sinirin gangliyonu kafatasının içinde, sert zarın oluşturduğu bir boşlukta durur (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `**On iki çift kafa siniri** beyne bağlanır ve kafatası tabanındaki deliklerden geçer (Gray, 1918). Roma rakamlarıyla I’den XII’ye numaralanır (OpenStax 13.4). Ders kitapları onları basitçe üç gruba ayırır (OpenStax 13.4):

- **Üçü yalnızca duyu lifi taşır:** I koku, II görme, VIII işitme ve denge.
- **Beşi yalnızca hareket lifi taşır:** göz hareketlerinin sinirleri III, IV ve VI ile XI ve XII.
- **Dördü karmadır,** yani hem duyu hem hareket lifi taşır: V, VII, IX ve X.

Bu sınıflamada görünmeyen bir şey daha var. III, VII ve IX, otonom (istem dışı çalışan) sistemin gangliyonlarına giden lifler de taşır. Vagus siniri (X) ise esas olarak göğüs ve üst karın boşluğundaki otonom gangliyonlara gider (OpenStax 13.4). Kafa sinirleri tek tek Anatomi bölümünün “Kafa sinirleri I” ve “Kafa sinirleri II” derslerinde işlenir. Geçtikleri delikler “Kafatası 3: Delikler, kanallar ve derin çukurlar” dersindedir.`,
    },
    {
      tur: 'tablo',
      baslik: 'On iki kafa siniri: tür, kafatasından çıkış ve başlıca görev',
      sutunlar: ['No.', 'Sinir', 'Tür', 'Kafatasından çıkış', 'Başlıca görev'],
      satirlar: [
        ['I', 'Koku siniri (*nervus olfactorius*)', 'Duyu', 'Kalbur kemiğinin delikli (kribriform) plağı', 'Koku'],
        ['II', 'Görme siniri (*nervus opticus*)', 'Duyu', 'Optik kanal', 'Görme; dokusu merkezî sinir sistemine aittir'],
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
      not: 'Tür sütunu, ders kitabının öğretim için yaptığı sınıflamadır (3 duyu, 5 hareket, 4 karma). “+ parasempatik”, sinirin otonom gangliyonlara lif taşıdığını gösterir (OpenStax 13.4). Kaynaklar: çıkış yerleri ve IV, VI, XI, XII’nin hedefleri Romano ve ark. (2019); öteki görevler OpenStax 13.4; Latince adlar FIPAT (2019). TA2 bu on iki çiftin yanında bir sinir daha listeler: terminal sinir (*nervus terminalis*). Bu sinirin eş adı “0. kafa siniri”dir (uzman kutusu).',
    },
    {
      tur: 'sahne',
      baslik: 'Kafa sinirlerinin kafatasından çıkış kapıları',
      aciklama:
        'Kafatasının tepesi kaldırıldı. Tabana yukarıdan, beynin oturduğu taraftan bakıyoruz. Görüntünün üstü yüz tarafıdır; işaretler sol yarıdadır. Öndeki orta hat çıkıntısı horoz ibiğidir. Koku lifleri (I), onun hemen iki yanındaki kalbur levhadan geçer. Ortadaki çukur Türk eyeridir. Sol yanda oval delikten trigeminal sinirin üçüncü dalı (V3) geçer. İç kulak yolundan VII ve VIII geçer. Arkadaki foramen magnumda omurilik soğanı omuriliğe devam eder. Öteki kapılar bu sahnede işaretlenmedi: optik kanal, üst orbital yarık, yuvarlak delik, juguler delik, hipoglossal kanal. Yerleri yukarıdaki tablodadır. Modelde sinirler yoktur; yalnızca kemikteki kapıları görürüz. “Kesit” sürgüsüyle düzlemi kaydırabilirsin.',
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
      md: `**Çevresel sinir sistemi** = 12 çift kafa siniri + 31 çift omurilik siniri + gangliyonlar (otonom sistemin çevredeki kısmı dahil).

**Sinir** = çevredeki akson demeti; **gangliyon** = çevredeki nöron gövdesi kümesi.

**Kafa sinirleri:** 3 duyu (I, II, VIII), 5 hareket (III, IV, VI, XI, XII), 4 karma (V, VII, IX, X). III, VII, IX ve X parasempatik lif de taşır.

**Omurilik siniri:** arka kök duyu getirir, ön kök hareket götürür. İkisi birleşince karma sinir olur.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Koku sinirinin nöronları kendini yeniler. Bu duyu nöronları burnun içindeki koku dokusunda (koku epiteli) bulunur. Yaklaşık bir ile dört ay yaşarlar ve düzenli olarak yenileri yapılır (OpenStax 13.4). Aksonları yaklaşık yirmi ince dal hâlinde kalbur kemiğinin delikli plağını (kribriform plak) geçer (Gray, 1918). Sonra kafatasının içinde koku soğanında sonlanır (Romano ve ark., 2019). Gray (1918) bu liflerin miyelinsiz olduğunu da yazar.',
    },
    {
      tur: 'metin',
      md: `**Omurilik sinirleri** omurganın iki yanındaki deliklerden çıkar. Her omurilik siniri hem duyu hem hareket aksonu taşır. Omuriliğe iki kökle bağlanır. Duyu aksonları **arka (dorsal) kökle** girer. Hareket lifleri **ön (ventral) kökle** çıkar. Bunlar hem iskelet kaslarına giden (somatik) lifler hem de otonom liflerdir (OpenStax 13.4). Duyu nöronlarının gövdeleri, arka kökün üzerindeki bir şişkinlikte durur: **arka kök gangliyonu**. İki kök, gangliyonun hemen ötesinde birleşir. Oluşan omurilik siniri omurlar arası delikten çıkar. Kısa süre sonra bir **arka dala** ve bir **ön dala** ayrılır. İki dal da her iki kökten lif alır (Gray, 1918).

Göğüs bölgesinde ön dallar birbirinden bağımsız ilerler. T2–T11 sinirleri bir ağa katılmaz; kaburgalar arasındaki sinirleri verir (OpenStax 13.4). Boyun, bel ve sağrı bölgesinde ise ön dallar, çıktıkları yerin yakınında birleşir. Böylece **sinir ağları** (pleksus) kurarlar (Gray, 1918). Dört büyük ağ vardır (OpenStax 13.4):

- **Boyun ağı:** ensenin ve başın arka kısmının sinirleri. Ayrıca soluk almanın ana kası olan diyaframı yöneten frenik sinir.
- **Kol ağı (brakiyal pleksus):** kolun sinirleri.
- **Bel ağı:** leğen bölgesinin ve bacağın ön yüzünün sinirleri. Büyük sinirlerinden biri femoral sinirdir.
- **Sağrı ağı:** en büyük siniri siyatik sinirdir. Siyatik sinir, tibial ve fibular sinirlerin birleşimidir.

Bir arka kök gangliyonundan gelen lifler, derinin belli bir alanının duyusunu taşır. Bu deri alanına **dermatom** denir. Komşu dermatomlar birbiriyle örtüşür (Dafny, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Dermatom haritası bir ipucudur, keskin bir sınır değil',
      md: 'Kitaplarda bedeni şerit şerit bölen renkli dermatom haritaları görürsün. Bu haritalar muayenede yol gösterir, ama birbirini tutmaz. Ders kitaplarındaki haritalar arasında belirgin farklar vardır (Downs ve Laporte, 2011). Kanıta dayalı bir derleme, standart haritaların hatalı olduğunu gösterdi (Lee ve ark., 2008). Komşu dermatomlar örtüşür ve kişiden kişiye fark büyüktür. Bir haritadaki çizgiyi, deride gerçekten var olan bir sınır gibi okuma.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İki köken.** Kafa sinirlerinin hareket lifleri, beynin içindeki çekirdeklerden çıkar. Çekirdek, beyin içindeki bir nöron gövdesi kümesidir. Duyu lifleri ise beynin dışındaki gangliyonlardan ya da duyu organlarındaki hücrelerden çıkar (Gray, 1918). Bu yüzden her sinir için iki ayrı “köken”den söz edilir (Gray, 1918):

- **Görünür (yüzeysel) köken:** sinir kökünün beynin yüzeyinden çıktığı yer.
- **Gerçek (derin) köken:** liflerin içeride izlenebildiği gri cevher.

**I ve II: iki özel sinir.** Koku almaçları (reseptörleri) burnun iç zarındadır (mukoza). Aksonları (*fila olfactoria*) kalbur kemiğinin delikli plağını geçip kafatasının ön çukuruna girer. Orada koku soğanında sonlanır (Romano ve ark., 2019).

Görme siniri adına rağmen, dokusu bakımından merkezî sinir sisteminin bir uzantısıdır. Miyelin kılıfını Schwann hücreleri değil, oligodendrositler yapar (Romano ve ark., 2019). Hatırla: miyelini merkezî sistemde oligodendrositler, çevrede Schwann hücreleri yapar. Gray (1918) de görme sinirinin, öteki kafa sinirlerinden çok beyin içindeki bir lif yoluna karşılık geldiğini yazar.

Görme siniri yaklaşık 50 mm uzunluğundadır. Dört kesimi vardır (Romano ve ark., 2019):

- göz içinde 1 mm,
- göz çukurunda 25 mm,
- optik kanalda 9 mm,
- kiazmadan önce 16 mm.

Yani görme sinirinin kiazmadan önce kafa içinde de bir kesimi vardır. Optik kiazma, iki görme sinirinin birleştiği yerdir. Aynı aksonlar kiazmaya kadar “görme siniri” adını taşır. Kiazmadan sonra adları “optik yol”dur (*tractus opticus*). Yani ad kiazmada değişir (OpenStax 12.1; Romano ve ark., 2019).

**Göz hareketleri ve trigeminal.** Okülomotor sinir dört göz kasını yönetir (OpenStax 13.4). Troklear sinir üst eğik kası, abdusens sinir dış düz kası sinirlendirir (Romano ve ark., 2019). Troklear sinir, kökü beyin sapının arka yüzünden çıkan tek kafa siniridir (Romano ve ark., 2019). Gray’e (1918) göre alt tepeciğin, yani orta beynin arka yüzündeki alttaki küçük tümseğin hemen arkasından çıkar. Çıktığı yer ince bir zar levhadır (üst medüller yelken). Trigeminal sinir en büyük kafa siniridir. Bir duyu kökü, bir de hareket kökü vardır (Romano ve ark., 2019). Üç dalı kafatasını üç ayrı kapıdan terk eder (tablo ve sahne).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Omurilik sinirinin kuruluşu.** Ön kök, omuriliğin ön yüzünden çok sayıda ince iplik olarak çıkar (kökçük, *fila radicularia*) (Gray, 1918). Arka kökün gangliyonu (*ganglion spinale*) çoğunlukla omurlar arası deliktedir. Köklerin sert zarı deldiği yerin hemen dışında durur. Sağrı sinirlerinin gangliyonları ise omurga kanalının içindedir (Gray, 1918). Ön ve arka kök, gangliyonun hemen ötesinde birleşir.

Delikten çıkan sinir önce küçük bir **meningeal dal** verir. Bu dal, delikten omurga kanalına geri girer. Omurları ve bağlarını, omuriliğin ve zarlarının damarlarını sinirlendirir (Gray, 1918). TA2’de bu dalın adı *ramus meningeus nervi spinalis*’tir. Eş adı rekürren (geri dönen) daldır. İlişkili bir adı daha vardır: **sinüvertebral sinir** (FIPAT, 2019). Sinir sonra arka ve ön dala ayrılır (Gray, 1918).

**Bağlantı dalları.** Omurganın iki yanında, sempatik gövde denen bir gangliyon zinciri uzanır. Her omurilik siniri, yanındaki sempatik gövde gangliyonundan bir **gri bağlantı dalı** (*ramus communicans griseus*) alır. **Beyaz bağlantı dalını** (*ramus communicans albus*) ise yalnızca göğüs sinirleri ile ilk bel sinirleri verir (Gray, 1918). Gray bu sınırı bir yerde T1–L2, başka bir yerde T1–L1 diye verir (Gray, 1918). Beyaz dallar miyelinli oldukları için beyazdır. Gri dallar miyelinsiz aksonlardır (OpenStax 15.1). Otonom sistemdeki rolleri, otonom ve enterik sistem bölümündedir.

**Kökler ve lif türleri.** Klasik kurala göre arka kökte yalnızca duyu nöronlarının aksonları vardır. Ön kökte ise yalnızca hareket nöronlarının aksonları vardır (OpenStax 14.1). Otonom sistemin gangliyon öncesi (preganglionik) lifleri de ön kökle çıkar (OpenStax 13.4). Gray’e (1918) göre tipik bir omurilik siniri en az dört tür lif taşır:

- **Somatik getirici lifler:** beden duvarından duyu getirir.
- **Visseral getirici lifler:** iç organlardan duyu getirir.
- **Somatik götürücü lifler:** iskelet kasına gider.
- **Visseral götürücü (preganglionik) lifler:** otonom yolun ilk basamağıdır.

Gray visseral lifleri, kendi döneminin adlandırmasıyla “sempatik” lifler diye anar.`,
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
          'Psödounipolar (yalancı tek kutuplu): tek uzantı kısa bir yoldan sonra T biçiminde ikiye ayrılır',
          'Omurlar arası delikte, köklerin sert zarı deldiği yerin hemen dışında; sağrı sinirlerinde omurga kanalının içinde',
        ],
        [
          'Kafa siniri duyu gangliyonları',
          'V (trigeminal), VII (genikulat), IX ve X’un duyu gangliyonları',
          'Arka kök gangliyonunun kafadaki karşılığı',
          'Trigeminal gangliyon kafatasının içinde, sert zarın oluşturduğu boşlukta',
        ],
        [
          'VIII’in gangliyonları',
          'Spiral (koklear) ve vestibüler (Scarpa) gangliyon',
          'Bipolar (iki kutuplu)',
          'Spiral gangliyon kokleada',
        ],
        [
          'Sempatik zincir (paravertebral) gangliyonları',
          'Her yanda tipik olarak 23: 3 boyun, 12 göğüs, 4 bel, 4 sağrı; altta tek ganglion impar',
          'Multipolar (çok kutuplu)',
          'Omurganın iki yanında; ganglion impar kuyruk sokumunun önünde',
        ],
        [
          'Prevertebral (kollateral) gangliyonlar',
          'Çölyak, üst mezenterik ve alt mezenterik gangliyon',
          'Multipolar (çok kutuplu)',
          'Omurganın önünde',
        ],
        [
          'Terminal (intramural) gangliyonlar',
          'Parasempatik; ör. okülomotor sinirle ilişkili siliyer gangliyon',
          'Multipolar (çok kutuplu)',
          'Hedef organın yanında ya da duvarının içinde',
        ],
        [
          'Enterik gangliyonlar',
          'Miyenterik ve submukozal ağların binlerce küçük gangliyonu',
          '—',
          'Sindirim kanalının duvarında (otonom ve enterik sistem bölümü)',
        ],
      ],
      not: 'Gangliyonlar çoğunlukla ikiye ayrılır: duyu gangliyonları ve otonom gangliyonlar (OpenStax 13.4). TA2 duyu gangliyonlarını “ganglia sensoria craniospinalia” eş adıyla toplar (FIPAT, 2019). Duyu ve otonom gangliyonlarda nöron gövdelerini uydu (satelit) hücreler sarar (OpenStax 12.2). İnsanda gerçek tek kutuplu (unipolar) nöron yoktur. Duyu gangliyonlarındaki tek uzantılı hücreler yalancı tek kutupludur, yani psödounipolardır (OpenStax 12.2). İstisna VIII’in gangliyonlarıdır. Spiral ve vestibüler gangliyonlardaki hücreler iki kutupludur, yani bipolardır (Gray, 1918). Kaynaklar: Gray (1918); OpenStax 13.4 ve 15.1; Furness ve ark. (2014). İlgili satırların ayrıntıları metindedir.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Dört büyük sinir ağı ve kökleri',
      sutunlar: ['Ağ', 'Klasik kökler', 'Ders kitabındaki geniş kökler', 'Başlıca sinir ve görev', 'Ayrıntı'],
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
          'Kolun sinirleri. Kökler üst, orta ve alt gövdeyi yapar. Her gövde köprücük kemiğinin altında ön ve arka bölüme ayrılır',
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
      not: 'Ders kitabının geniş değerleri, ağa katkı yapan komşu sinirleri de sayar. Derste klasik değerler esas alınır; katkılar ayrıca belirtilir. Gray (1918) bel ve sağrı ağlarını birlikte de anlatır: lumbosakral ağ. Onu üçe ayırır: bel, sağrı ve pudendal ağ. S3’ün ön dalının alt kolu pudendal ağa gider. Gray (1918) iki ağ arasında bölünen bel sinirine *nervus furcalis* (çatal sinir) der. Çoğu olguda bu sinir L4’tür. TA2 ise *nervus furcalis*’i bel sinirleri arasında, her zaman bulunmayan (*inconstant*) bir sinir olarak listeler (FIPAT, 2019). Kol ağında C4 genellikle C5’e bir dal verir. T1 de sıklıkla T2’den dal alır (Gray, 1918).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: '“Pleksus” her zaman aynı şeyi anlatmaz',
      md: `Omurilik sinirlerinin ağlarına “pleksus” denir. Burada sözcük, hücre gövdesi içermeyen bir sinir lifi ağı demektir (OpenStax 13.4). Bu ağlarda dallar birbirine karışır. Ağdan çıkan her dal, ağı kuran bütün ana gövdelerden lif taşıyabilir. Ama tek tek lifler kaynaşmaz, ayrı kalır (Gray, 1918). Yani ağdan çıkan bir sinir, birden çok omurilik bölümünden gelen lifleri bir arada taşıyabilir.

Otonom sistemde ise aynı sözcük gangliyon içeren ağlar için de kullanılır. Gray (1918) böyle üç büyük ağ anlatır: göğüsteki kalp ağı, karındaki solar (epigastrik) ağ ve leğendeki hipogastrik ağ. Bunların içinde omurganın önündeki (prevertebral) gangliyonlar bulunur. Sindirim kanalının duvarındaki **enterik ağ** da binlerce küçük gangliyondan oluşur (Furness ve ark., 2014). Bir metinde “pleksus” geçtiğinde, içinde nöron gövdesi olup olmadığına bak.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Frenik sinir: boyundaki yaralanmanın düzeyi neden önemli?',
      md: 'Frenik sinir, soluk almanın ana kası olan diyaframı yönetir. Omuriliğe C3–C5 düzeylerinde bağlanır (OpenStax 15.2). Gray (1918) sinirin esas olarak C4’ten çıktığını, C3 ve C5’ten birer dal aldığını yazar. Bu yüzden boyun ortasının altındaki bir omurilik hasarı, soluk almayı durdurarak ölüme yol açmaz (OpenStax 15.2). Çünkü diyaframın sinir bağlantısı hasarın üstünde kalır. C3–C5 düzeyini ya da daha yukarısını tutan bir hasar ise bu bağlantıyı etkileyebilir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dermatom haritalarının tarihi ve tartışması.** Klasik haritaları şu araştırmacılar çizdi: Sir Henry Head, Sir Charles Sherrington, Otfrid Foerster ile Jay Keegan ve Frederic Garrett. Bu haritaların çizilme yöntemleri bugün daha çok tarih açısından ilgi çeker (Greenberg, 2003). Keegan ve Garrett 1948’de ötekilerden kökten farklı bir harita yayımladı. Bu haritadaki dermatomlar uzun ve kıvrımlıydı. Harita büyük ölçüde, disk fıtığının (omurlar arası diskin taşmasının) arka köke yaptığı baskı incelenerek çıkarılmıştı (Downs ve Laporte, 2011). Ders kitaplarında görülen haritalar birbiriyle tutarsızdır (Downs ve Laporte, 2011).

Kanıta dayalı bir derleme üç şey yazdı. Standart anatomi kitaplarındaki haritalar arasında önemli farklar vardır. Güncel haritalar hatalıdır. Bu haritalar kusurlu çalışmalara dayanır. Yazarlar en iyi kanıtlardan yeni bir harita çizdi. Bu harita, çoğu insanda her arka köke ait en tutarlı dokunma alanlarını gösterir. Yazarlar, dermatomların örtüşmesinin ve değişkenliğinin daha çok vurgulanması gerektiğini de belirtti (Lee ve ark., 2008).

Klinik veriler de haritanın sınırlarını gösterir. Bir çalışmada kök ağrısı olan 169 hastada 226 sinir kökü incelendi. Ağrı şu oranlarda dermatom düzenine uymuyordu: boyun köklerinde olguların %69,7’sinde, bel köklerinde %64,1’inde. Olası istisna S1 köküydü (Murphy ve ark., 2009). Başka bir çalışmada boyun sinir kökü hastalığı (boyun radikülopatisi) olan 227 hasta incelendi. Tanıları ameliyatla doğrulanmıştı. Bu hastaların %62,6’sında standart dermatom düzeni görüldü (Hong ve Nam, 2022). Kol ağının yapısı kişiden kişiye değişebilir (varyasyon). Bu da deri sinir alanlarının geleneksel haritadan sapmasına yol açabilir (Patel ve Smith, 2023). Dermatom, kök düzeyini kestirmek için yararlı bir ipucudur. Ama öteki bulgularla birlikte yorumlanmalıdır.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Kafa sinirleri:** 3 duyu (I, II, VIII), 5 hareket (III, IV, VI, XI, XII), 4 karma (V, VII, IX, X). Parasempatik lif: III, VII, IX, X.
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
      oyku: `45 yaşında bir erkek üç haftadır yakınıyor. Boynundan sağ koluna yayılan bir ağrısı var. Elinin dış yüzüne doğru uyuşma da var. Muayeneyi yapan öğrenci ders kitabındaki dermatom haritasına bakıyor. Hangi kökün sıkıştığını “kesin” olarak söyleyebileceğini düşünüyor.`,
      soru: 'Dermatom haritası tek başına hangi kökün etkilendiğini kesin olarak gösterebilir mi?',
      cozum: `**Hayır. Harita güçlü bir ipucudur, ama kesin değildir.** Dermatom, tek bir arka kök gangliyonundan gelen liflerin duyusunu taşıdığı deri alanıdır. Komşu dermatomlar birbiriyle örtüşür (Dafny, 2026). Ders kitaplarındaki haritalar birbiriyle tutarsızdır (Downs ve Laporte, 2011). Kanıta dayalı bir derlemeye göre standart haritalar hatalıdır ve kusurlu çalışmalara dayanır (Lee ve ark., 2008).

**Klinik veriler:** 169 hastalık bir çalışmada, boyun köklerine bağlı ağrı olguların %69,7’sinde dermatom düzenine uymuyordu (Murphy ve ark., 2009). Başka bir çalışmada boyun radikülopatisi olan 227 hasta incelendi; tanıları ameliyatla doğrulanmıştı. Hastaların %62,6’sında standart dermatom düzeni görüldü. Kas güçsüzlüğü olan 110 hastanın %67,3’ünde güçsüzlük standart miyotom düzenine uyuyordu. Miyotom, tek bir kökün yönettiği kas grubudur. Yazarlar, insanda dermatom ve miyotomların kişiden kişiye değiştiğini vurgular. Bu değişkenlik özellikle C6 kökünün sıkışmasına bağlı güçsüzlükte yüksektir (Hong ve Nam, 2022). Kol ağının yapısındaki farklılıklar (varyasyonlar) da deri sinir alanlarını klasik haritadan saptırabilir (Patel ve Smith, 2023).

**Sonuç:** Uyuşmanın dağılımı bir kök düzeyini düşündürür. Ama karar, kas güçsüzlüğünün düzeni ve öteki bulgularla birlikte verilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: '“Sıfırıncı” sinir ve sınıflamanın sınırları',
      md: `**Terminal sinir.** TA2, on iki çiftin yanında bir sinir daha listeler: **terminal sinir** (*nervus terminalis*). İngilizce eş adı “cranial nerve 0”dır, yani “sıfırıncı kafa siniri” (FIPAT, 2019). Sinir ilk kez 1878’de kıkırdaklı balıklarda (köpekbalıkları ve vatozlar) bulundu. İnsan embriyosunda 1913’te, yetişkin insanda bir yıl sonra tanımlandı (Ruqa ve ark., 2024). Kaşifinin adı başka bir kaynakla doğrulanamadı; bu yüzden burada verilmedi.

**Görme siniri.** İşlevi ve dokusu bakımından merkezî bir lif yoludur (Gray, 1918; Romano ve ark., 2019). Beyin zarlarıyla kılıflanır: sert zarın iç katı (meningeal dura) sinir boyunca ilerler ve göz akına (sklera) devam eder (Ishikawa ve ark., 2026). Terim listesinde ise kafa sinirleri arasında, çevresel sinir sistemi başlığında durur (FIPAT, 2019). Bu bir çelişki değildir. Ad bir şeyi, doku yapısı başka bir şeyi anlatır.

**3–5–4 sınıflamasının ötesi.** Ders kitabının “3 duyu, 5 hareket, 4 karma” sınıflaması öğretimi kolaylaştırmak içindir. III, VII, IX ve X’un parasempatik lifleri bu sınıflamada görünmez (OpenStax 13.4). Ayrıntılı anlatımda lifler, yaptıkları işe göre gruplanır (işlevsel bileşenler; bu dersin ilk bölümündeki uzman kutusu).

**Eskimiş bir görüş.** Trigeminal sinirin dallarına bağlı dört küçük gangliyon vardır:

- siliyer gangliyon (*ganglion ciliare*),
- sfenopalatin gangliyon; bugünkü adı pterigopalatin gangliyondur (*ganglion pterygopalatinum*),
- otik gangliyon (*ganglion oticum*),
- submandibular gangliyon (*ganglion submandibulare*).

Bu gangliyonların hücreleri çok kutupludur. Gray’in döneminde bu yüzden “sempatik sistemin kafadaki parçası” sayılıyorlardı (Gray, 1918). Bugün bu dört gangliyon, parasempatik sistemin kafa kısmında sınıflanır (FIPAT, 2019). Trigeminal gangliyonun kendisi ise duyu kökünün gangliyonudur. Gray (1918) de onu böyle anlatır, TA2 de duyu kökünün altında listeler (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Cerrahın gözüyle çevresel sinirler',
      md: `- **Trigeminal gangliyon kafatasının içindedir.** Şakak kemiğinin (temporal kemik) kayalık kısmının tepesine yakın yatar. Sert zarın oluşturduğu bir boşluktadır (Gray, 1918). TA2 bu boşluğa *cavum trigeminale* (Meckel boşluğu) der (FIPAT, 2019). “Kafa siniri gangliyonları kafatasının dışındadır” genellemesi bu yüzden yanlıştır.
- **Kökler:** C1’in arka kökü ön kökünden küçüktür. Olguların %8’inde hiç yoktur. Sağrı sinirlerinin gangliyonları omurga kanalının içindedir (Gray, 1918). Meningeal dal (sinüvertebral sinir), omurlar arası delikten kanala geri girer (Gray, 1918; FIPAT, 2019).
- **Kol ağının değişkenliği:** Güncel bir derlemeye göre gövdelerin düzeni olguların yaklaşık %84’ünde klasiktir. Kordonların düzeni %96’sında klasiktir. Uç dallar daha değişkendir; klasik düzen yaklaşık %75’tir (Patel ve Smith, 2023). Bir seride 200 fetüsün kol ağı incelendi. Ağların %71,5’i C5–T1’den oluşuyordu. Köklerin yukarı kaydığı “prefikse” ağ %25,5, aşağı kaydığı “postfikse” ağ %2,5 oranındaydı (Uysal ve ark., 2003). Ankara’da Gülhane’de 11 fetal kadavradaki 20 kol ağı mikroskop altında incelendi. Ağların yarısı prefikse, %15’i postfikse bulundu. Ama postfikse sayılan bütün ağlarda prefikse yapı da bildirildi. Yani iki terim aynı ağ için birlikte kullanıldı (Kirik ve ark., 2018). Aynı yazarların aktardığı önceki çalışmalarda prefikse ağ sıklığı %24, %21,7 ve %48’dir (Kirik ve ark., 2018). Sayıların bu kadar dağınık olması, tanımların çalışmadan çalışmaya değiştiğini düşündürür.
- **Bel-sağrı bileşkesi:** Çoğu olguda L4 iki ağ arasında bölünür. Gray (1918) bu sinire *nervus furcalis* der. Lumbosakral gövde, L4’ün bir kısmı ile L5’in tamamından oluşur (Gray, 1918). TA2 *nervus furcalis*’i her zaman bulunmayan (*inconstant*) bir bel siniri olarak listeler (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kitaplarda yanlış ya da eksik yazılanlar ve doğrusu',
      sutunlar: ['Konu', 'Kaynakta ne yazıyor?', 'Doğrusu ya da güncel bilgi'],
      satirlar: [
        [
          'Kafa siniri gangliyonları',
          '“Kökler kafatası içinde, gangliyonlar kafatası dışındadır” (OpenStax 13.4)',
          'Trigeminal gangliyon kafatasının içinde, Meckel boşluğundadır (Gray, 1918; FIPAT, 2019)',
        ],
        [
          'Kafa siniri gangliyon nöronları',
          'Bütün kafa siniri gangliyonlarının nöronları tek kutupludur (OpenStax 13.4)',
          'Spiral ve vestibüler gangliyonların nöronları iki kutupludur (Gray, 1918)',
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
          'Bir yerde “kökün”, başka yerde “omurilik sinirinin” şişkinliği denir (OpenStax 13.4)',
          'Gangliyon arka kökün üzerindedir; iki kök gangliyonun ötesinde birleşir (Gray, 1918)',
        ],
      ],
      not: 'Bu ifadeler, yanlış bilgi olarak öğretilmesin diye listelendi. Derste her konuda sağ sütundaki bilgi kullanıldı.',
    },
  ],
};
