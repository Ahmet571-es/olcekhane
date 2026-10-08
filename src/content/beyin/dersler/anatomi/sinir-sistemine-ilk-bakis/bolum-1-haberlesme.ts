import type { DersBolumu } from '../../../types';

/** 1. bölüm: sinir sisteminin bölümleri, omurilik sinirleri, refleksler, otonom sistem. */
export const haberlesmeAgi: DersBolumu = {
  id: 'haberlesme-agi',
  baslik: 'Sinir sistemi: bedenin haberleşme ağı',
  bloklar: [
    {
      tur: 'metin',
      md: `Elindeki telefon titrediğinde neler olur? Parmak ucundaki duyu almaçları titreşimi fark eder, bu bilgi sinirlerle omuriliğe ve beyne ulaşır, beyin ne yapacağına karar verir ve kolundaki kaslara komut gönderir. Bu yolculuğun hepsi saniyenin küçük bir bölümünde tamamlanır. Bunu yöneten sistem **sinir sistemidir**.

Sinir sisteminin üç temel işi vardır:

- **Algılama:** Bedenin içinden ve dışından bilgi toplamak. Görme, işitme, dokunma, tat ve koku bunun en bilinen örnekleridir.
- **Birleştirme:** Gelen bilgiyi anılarla, o anki duygu durumuyla ve daha önce öğrenilenlerle bir araya getirip ne yapılacağına karar vermek.
- **Tepki:** Kasları kasmak ya da bezlere salgı yaptırmak.

Anatomistler sinir sistemini iki büyük bölüme ayırır:

- **Merkezî sinir sistemi (MSS):** beyin ve omurilik. Bilginin işlendiği ve kararların verildiği yer burasıdır.
- **Çevresel (periferik) sinir sistemi (ÇSS):** merkezî sinir sisteminin dışında kalan her şey. Beyinden çıkan **12 çift kafa siniri**, omurilikten çıkan **31 çift omurilik siniri** ve sinirlerin üzerindeki küçük nöron kümeleri olan **gangliyonlar** bu bölüme girer.

Bu sınır kesin bir duvar değildir: Çevresel sinir sisteminin bazı parçaları kafatasının ya da omurga kanalının içinde durur. Yine de bu ayrım, sinir sistemini öğrenmek için iyi bir başlangıç haritasıdır.

Sinir dokusunda iki büyük hücre ailesi vardır. **Nöronlar** sinir sisteminin hesaplamasını ve haberleşmesini yapar; elektrik ve kimyasal sinyalleri onlar taşır. **Glia hücreleri** ise nöronları destekler, besler ve korur. İkisini de 2. bölümün ilk derslerinde ayrıntılı göreceğiz.`,
    },
    {
      tur: 'animasyon',
      ad: 'sinir-sistemi-haritasi',
      baslik: 'Sinir sisteminin haritası',
      aciklama:
        'Mavi bölüm merkezî, sarı-turuncu bölüm çevresel sinir sistemidir. Başlat düğmesiyle bir uyarının bedende nasıl dolaştığını izle: algılama, iletim, birleştirme ve tepki.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Getirici ve götürücü: afferent ve efferent',
      md: `Sinirbilimde yön, merkezî sinir sistemine göre söylenir. **Afferent (getirici)** lifler sinyali merkezî sinir sistemine doğru taşır; çoğu duyu lifidir. **Efferent (götürücü)** lifler sinyali merkezî sinir sisteminden uzağa, kaslara ve bezlere taşır. Latince *ferre* "taşımak" demektir: *af-* "içeri doğru", *ef-* "dışarı doğru" anlamı katar.

Hedefe göre de iki ayrım yapılır. **Somatik** sistem iskelet kaslarını kasar ve bilinçli algıyı taşır. **Otonom (visseral)** sistem kalp kasını, iç organlardaki düz kasları ve bezleri yönetir.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Sinir liflerinin yedi işlevsel bileşeni',
      md: `Klasik nöroanatomi, bir sinir lifini üç soruyla sınıflar: getirici mi götürücü mü (afferent / efferent), beden duvarına mı iç organa mı ait (somatik / visseral), her yerde bulunan genel bir işlev mi yoksa yalnızca başta bulunan özel bir işlev mi (genel / özel). Bu sorulardan yedi **işlevsel bileşen** çıkar ve özellikle kafa sinirlerini anlamak için kullanılır (Kim ve ark., 2020):

| Bileşen | Kısaltma | Kafa sinirlerinden örnek |
| --- | --- | --- |
| Genel somatik afferent | GSA | V (yüzün genel duyusu), VII, X |
| Genel visseral afferent | GVA | VII, IX, X (iç organ duyusu) |
| Özel somatik afferent | SSA | II (görme), VIII (işitme ve denge) |
| Özel visseral afferent | SVA | I (koku); VII ve IX (tat) |
| Genel somatik efferent | GSE | III, XII (göz ve dil kasları) |
| Genel visseral efferent | GVE | III, VII, IX, X (otonom, parasempatik lifler) |
| Özel visseral efferent | SVE | V, VII, IX, X, XI |

Yüz sinirinin (VII) beş bileşen birden taşıması, bu sinirin hasarında neden hem mimik kaslarında felç hem tat ve tükürük bozukluğu görülebileceğini açıklar: yüz siniri hem mimik kaslarını yönetir hem tat duyusunun bir bölümünü taşır hem de tükürük yapımına katılır (OpenStax 13.4). Yeni kaynaklar "özel visseral efferent" yerine **branşiyal motor** terimini kullanır (Libreros-Jiménez ve ark., 2024).`,
    },
    {
      tur: 'metin',
      md: `Omurilikten çıkan sinirler omurganın bölgelerine göre adlandırılır. Her omurilik siniri omuriliğe iki kökle bağlanır: **arka (dorsal) kök** duyu bilgisini içeri getirir, **ön (ventral) kök** hareket komutunu dışarı götürür. İki kök birleşince ortaya çıkan omurilik siniri hem duyu hem hareket lifi taşır; bu yüzden bütün omurilik sinirleri **karma** sinirdir.`,
    },
    {
      tur: 'animasyon',
      ad: 'omurilik-sinirleri',
      baslik: 'Omurga, omurilik ve 31 çift sinir',
      aciklama:
        'Bir bölgeye dokunarak o bölgedeki omur ve sinir sayısını gör. Omuriliğin enine kesitinde sarı nokta arka kökten içeri giren duyu sinyalini, kırmızı nokta ön kökten çıkan hareket komutunu gösterir.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Omurilik omurga kadar uzun değildir. Gelişim sırasında omurga omurilikten çok daha hızlı uzar: omurilik bir-iki yaşından sonra pek uzamaz ama iskelet büyümeyi sürdürür (OpenStax 13.2; Dafny, 2026). Bu yüzden yetişkinde omurilik bel omurlarının üst hizasında biter; altındaki sinir demetine, at kuyruğuna benzediği için **at kuyruğu** (cauda equina) denir.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Omurilik bölümü ile omur aynı hizada değildir',
      md: `- **Çıkış kuralı:** İlk boyun siniri (C1) kafatası ile 1. boyun omuru arasından, C8 ise 7. boyun omuru ile 1. göğüs omuru arasından çıkar. Göğüs ve bel sinirlerinin her biri, aynı adı taşıyan omur ile bir alttaki omur arasından çıkar (OpenStax 13.4). Boyunda 7 omura karşılık 8 sinir olmasının sonucu budur.
- **Omuriliğin bittiği yer:** Yetişkinde omurilik çoğunlukla 1. ya da 2. bel omuru hizasında, sivri bir uçla biter: **konus medullaris** (*conus medullaris*) (Dafny, 2026). Bu hiza kişiden kişiye değişir; T12 ile L3 arasında olabilir (Kim, 2022). Konustan kuyruk sokumuna, sert zarın içinde ve dışında uzanan ince bağ dokusu şeridine **filum terminale** denir (Buloz-Osorio ve ark., 2025).
- **Kayma:** Omurga daha hızlı uzadığı için aşağı inildikçe her omurilik bölümü, aynı adı taşıyan omurun biraz daha yukarısında kalır. Göğüs ve üst bel bölgesinde bu fark üç bölüme kadar çıkar (Dafny, 2026).
- **Kabarıklıklar:** Kol ve bacak sinirlerinin çıktığı bölgelerde ön boynuzdaki hareket nöronları çoğaldığı için omurilik kalınlaşır: **boyun kabarıklığı** (C3–T1) ve **bel kabarıklığı** (L1–S2) (Dafny, 2026; Henley, 2021). Kolun ince hareketleri daha çok nöron istediği için boyun kabarıklığı daha belirgindir (OpenStax 14.3).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Bel ponksiyonu neden aşağıdan yapılır?',
      md: `Beyin-omurilik sıvısından örnek almak için iğne genellikle 3. ile 4. ya da 4. ile 5. bel omurları arasından girilir. Bu hiza konus medullarisin altındadır: omurilik buraya kadar inmediği için iğne omuriliğe zarar vermeden sıvıya ulaşır (OpenStax 13.3; Kim, 2022). Alman kılavuzu, 2. ile 3. bel omurları aralığının üstünden girilmemesini önerir; konus olguların %94’ünde 1.–2. bel omuru hizasına kadar uzanır (Tumani ve ark., 2020).

İki leğen kemiğinin tepelerini birleştiren **Tuffier çizgisi** omurgayı genellikle 4.–5. bel omurları hizasında keser ve yol göstermek için kullanılır. Ama kesin değildir: iğne amaçlanandan bir aralık yukarıdan girebilir (Kim, 2022).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Dermatomlar: muayenede yoklanan anahtar noktalar',
      sutunlar: ['Dermatom', 'Anahtar duyu noktası'],
      satirlar: [
        ['C6', 'Başparmağın ilk boğumunun (proksimal falanks) sırt yüzü'],
        ['C7', 'Orta parmağın ilk boğumunun sırt yüzü'],
        ['C8', 'Serçe parmağın ilk boğumunun sırt yüzü'],
        ['T4', '4. kaburgalar arası aralık, meme başı hizası'],
        ['T10', 'Göbek hizası'],
        ['T12', 'Kasık bağının orta noktası'],
        ['L3', 'Dizin hemen üstünde, uyluk kemiğinin iç topuzu (medial femoral kondil)'],
        ['L4', 'İç ayak bileği çıkıntısı (medial malleol)'],
        ['L5', 'Ayak sırtında, 3. tarak kemiği ile parmak arasındaki eklem'],
        ['S1', 'Topuk kemiğinin dış yüzü'],
        ['S2', 'Diz arkası çukurunun ortası'],
        ['S4–5', 'Anüs çevresi'],
      ],
      not: 'Dermatom, tek bir arka kök gangliyonundan gelen liflerin beslediği deri alanıdır; komşu dermatomlar birbiriyle örtüşür (Dafny, 2026). Noktalar Amerikan Omurilik Yaralanması Derneği’nin (ASIA) muayene standardından alındı.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Zona, bir dermatomun haritasını çizer',
      md: 'Su çiçeği virüsü iyileşmeden sonra arka kök gangliyonlarında ve kafa siniri gangliyonlarında uykuda kalır. Yeniden etkinleşince sinir boyunca o sinirin dermatomuna iner; orada iltihap ve su toplamış kabarcıklar yapar (Patil ve ark., 2022). Döküntü çoğunlukla omurgadan göğsün ya da karnın önüne uzanan dar bir şerittir (MedlinePlus, 2024). Şeridin sınırları, hangi arka kök gangliyonunun tutulduğunu gösterir.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Refleks yayı',
      md: `Bir germe refleksinin beş parçası vardır: **almaç** (kas iğciği), **getirici lif** (Ia lifi), **birleştirme merkezi** (omuriliğin ön boynuzu, IX. tabaka), **götürücü lif** ve **etkileyici** (kas) (Lin-Wei ve ark., 2021). Duyu lifi ile hareket nöronu arasında tek bir sinaps vardır; bu yüzden germe refleksi **monosinaptiktir** (Henley, 2021): kas iğciğinden gelen lif alfa hareket nöronunu doğrudan uyarır (Knierim, UTHealth).

Çekiçle bir kirişe vurulduğunda kas gerilir, refleks yayı kası kasar. Yanıt beklenenden zayıfsa yayın bir parçası (kök, sinir, kas) bozulmuş olabilir; abartılıysa üstten gelen frenleyici etki azalmış olabilir. Hangi refleksin hangi omurilik bölümünden geçtiğini bilmek, hasarın yerini daraltır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Derin tendon refleksleri ve geçtikleri bölümler',
      sutunlar: ['Refleks', 'Omurilik bölümü', 'Sinir'],
      satirlar: [
        ['Biseps', 'C5–C6', 'Muskulokutan sinir'],
        ['Brakioradyalis', 'C6', 'Radyal sinir'],
        ['Triseps', 'C7–C8', 'Radyal sinir'],
        ['Diz (patella)', 'L3–L4', 'Femoral sinir'],
        ['Aşil', 'S1–S2', 'Tibial sinir'],
      ],
      not: 'Kaynaklar bazı refleksleri bir bölüm farklı verir; tabloda Lin-Wei ve ark. (2021) izlendi. Aynı yazarlara göre iç arka uyluk (iç hamstring) refleksi, L5 kök hasarından kuşkulanıldığında işe yarayan tek derin tendon refleksidir.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üst motor nöron mu, alt motor nöron mu?',
      sutunlar: ['Bulgu', 'Üst motor nöron hasarı (beyin, beyin sapı ya da omurilik yolları)', 'Alt motor nöron hasarı (ön boynuz, kök, sinir)'],
      satirlar: [
        ['Güç', 'Azalır', 'Azalır'],
        ['Kas tonusu', 'Artar: spastisite, çakı bıçağı yanıtı', 'Azalır: gevşek (flask) felç'],
        ['Derin tendon refleksleri', 'Artar', 'Azalır ya da kaybolur'],
        ['Babinski belirtisi', 'Olumlu: ayak tabanı çizilince başparmak yukarı kalkar', 'Yok'],
        ['Kas erimesi (atrofi)', 'Seyrek', 'Belirgin'],
        ['Fasikülasyon (kasta seyirme)', 'Yok', 'Olur'],
      ],
      not: 'Babinski yanıtı ilk 2 yaşta normaldir. Hareket kabuğu hasarından hemen sonra karşı yanda önce gevşek felç görülebilir; spastisite sonra gelişir (Knierim, UTHealth; OpenStax 16.4).',
    },
    {
      tur: 'metin',
      md: 'Sinir sistemi bir de **yaptığı işe göre** bölümlere ayrılır:',
    },
    {
      tur: 'tablo',
      baslik: 'Sinir sisteminin işlevsel bölümleri',
      sutunlar: ['Bölüm', 'Ne yapar?', 'Örnek'],
      satirlar: [
        ['Somatik sinir sistemi', 'Bilinçli algıyı ve istemli hareketleri yönetir.', 'Bir topu görüp ona uzanmak'],
        [
          'Otonom sinir sistemi',
          'İstem dışı çalışır: kalp kasını, iç organlardaki düz kasları ve bezleri yönetir; vücudun iç dengesini korur.',
          'Koşarken kalbin hızlanması',
        ],
        [
          'Enterik sinir sistemi',
          'Sindirim kanalının kaslarını ve bezlerini yönetir. Çoğu zaman otonom sistemin bir parçası sayılır.',
          'Bağırsakların yiyeceği ilerletmesi',
        ],
      ],
      not: 'Somatik sistem de bazı refleksleri bilinçli bir karar vermeden yürütür.',
    },
    {
      tur: 'metin',
      md: 'Otonom sistemin iki kolu vardır. **Sempatik** kol "savaş ya da kaç" yanıtıyla, **parasempatik** kol "dinlen ve sindir" hâliyle anılır. İki kol çoğu organda birbirinin tersini yapar:',
    },
    {
      tur: 'animasyon',
      ad: 'otonom-terazi',
      baslik: 'Otonom sistemin iki kolu',
      aciklama: 'Düğmeyle kolu değiştir: göz bebeği, tükürük, hava yolları, kalp, sindirim ve mesane nasıl değişiyor?',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Otonom sistemin iki nöronlu yolu',
      md: `Somatik sistemde omurilikteki hareket nöronunun aksonu doğrudan kasa gider. Otonom sistemde ise yol **iki nöronludur**: gövdesi merkezî sinir sisteminde olan **preganglionik** nöron, gövdesi bir gangliyonda olan **postganglionik** nörona bağlanır; organa bu ikinci nöron ulaşır (OpenStax 15.1).

- **Sempatik (torakolomber) kol:** Preganglionik nöronlar omuriliğin göğüs ve üst bel bölümlerinin yan boynuzundadır: T1–L2 (Wulf ve Tom, 2023; Dafny, 2020). Bir kaynak bu sütunu C8–L3 arasında verir (Dafny, 2026); sınırlar kişiden kişiye ve kaynaktan kaynağa biraz değişir. Gangliyonlar omurganın iki yanındaki zincir (paravertebral) gangliyonları ya da kolateral (prevertebral) gangliyonlardır: çölyak, üst mezenterik ve alt mezenterik gangliyon. Zincirde her yanda genellikle 23 gangliyon vardır (OpenStax 15.1).
- **Parasempatik (kraniyosakral) kol:** Preganglionik nöronlar beyin sapında ve omuriliğin S2–S4 bölümlerindedir; beyin sapındakiler III, VII, IX ve X. kafa sinirleriyle çıkar (Wulf ve Tom, 2023). Gangliyonlar organın yanında ya da duvarının içindedir (terminal, intramural gangliyon). Bu yüzden preganglionik lif uzun, postganglionik lif kısadır; sempatik kolda tersidir (OpenStax 15.1).
- **Vagus siniri (X)** parasempatik etkinliğin yaklaşık %75’ini taşır (Pop-Busui, 2010).
- **Yaygın ve hedefli yanıt:** Tek bir sempatik preganglionik nöron 10–20 hedefe uzanabilir (OpenStax 15.1); sempatik yanıtın bedenin her yanına birden yayılması bundandır.`,
    },
    {
      tur: 'animasyon',
      ad: 'otonom-cikis',
      duzey: 'lisans',
      baslik: 'Çıkış düzeyleri, gangliyonlar ve haberci maddeler',
      aciklama:
        'Solda nöron gövdelerinin bulunduğu düzeyler, sağda iki nöronlu yol. Her sinapsta hangi haberci maddenin salındığını ve hangi almacın onu karşıladığını izle; ter bezi ve böbrek üstü bezi istisnalarına da bak.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Otonom sinapslar: haberci madde ve almaç',
      sutunlar: ['Lif', 'Salınan haberci', 'Karşılayan almaç'],
      satirlar: [
        ['Bütün preganglionik lifler (sempatik ve parasempatik)', 'Asetilkolin (ACh)', 'Nikotinik (gangliyon nöronunda)'],
        ['Parasempatik postganglionik lifler', 'ACh', 'Muskarinik'],
        ['Sempatik postganglionik liflerin çoğu', 'Noradrenalin', 'α ya da β adrenerjik'],
        ['Ter bezlerine ve iskelet kası damarlarına giden sempatik lifler', 'ACh', 'Muskarinik (ter bezlerinde)'],
        ['Böbrek üstü bezinin medullası (kromafin hücreler)', 'Adrenalin ve noradrenalin, kana', 'Hormon gibi: bütün bedende'],
      ],
      not: 'Kaynak: OpenStax 15.1–15.2. Ter bezlerine parasempatik lif gelmez.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Bağırsaktaki sinir ağı',
      md: `Sindirim kanalının duvarında iki sinir ağı vardır: kas katmanındaki **miyenterik (Auerbach) ağ** hareketi, mukoza altındaki **submukozal (Meissner) ağ** salgıları düzenler (OpenStax 23.1). Bu **enterik sinir sistemi** omurilikten daha çok nöron taşır (Dafny, 2020). Sayı kaynaktan kaynağa değişir: OpenStax yaklaşık 100 milyon nöron verirken güncel bir derleme 400–600 milyon nöron bildirir (Fleming ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**MSS** = beyin + omurilik.\n\n**ÇSS** = kafa sinirleri (12 çift) + omurilik sinirleri (31 çift) + gangliyonlar.\n\nOtonom sistem: **sempatik** "savaş ya da kaç", **parasempatik** "dinlen ve sindir".',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- 31 çift omurilik siniri: **8 boyun (C), 12 göğüs (T), 5 bel (L), 5 sağrı (S), 1 kuyruk (Co)**. Boyunda omur 7, sinir 8 çifttir; C8, C7 ile T1 omurları arasından çıkar.
- 12 çift kafa sinirinin 3'ü yalnız duyu, 5'i yalnız hareket, 4'ü karma sinirdir.
- **Arka kök duyu, ön kök hareket** taşır; duyu nöronlarının gövdeleri arka kök gangliyonundadır. Bütün omurilik sinirleri karmadır.
- Yetişkinde konus medullaris çoğunlukla L1–L2 hizasında; bel ponksiyonu L3–L4 ya da L4–L5 aralığından.
- Sempatik çıkış T1–L2 (torakolomber), parasempatik çıkış III, VII, IX, X ve S2–S4 (kraniyosakral).
- Bütün preganglionik lifler ACh → nikotinik; parasempatik postganglionik ACh → muskarinik; sempatik postganglionik çoğunlukla noradrenalin → adrenerjik; istisna ter bezleri (ACh → muskarinik).
- Üst motor nöron: spastisite, hiperrefleksi, Babinski. Alt motor nöron: gevşek felç, hiporefleksi, atrofi, fasikülasyon.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Hasarın yeri belirtiyi belirler',
      md: `Sinir sistemini öğrenmenin en önemli nedenlerinden biri, bir belirtiden hasarın yerini çıkarabilmektir. Örneğin omurilikten çıkıp omuza, kola ve ele giden sinir ağı (brakiyal pleksus) zarar görürse kol güçsüzleşebilir ya da felç olabilir; kolda ve elde his kaybı olabilir. Belirti, o sinirin hizmet ettiği bölgeyle sınırlıdır.

Beynin bir yarısı zarar gördüğünde ise vücudun **karşı** yanı etkilenir: Sağ yarımküreyi etkileyen bir inme sol kolda ve bacakta felce yol açabilir. Bu "yer belirleme" mantığı, Klinik Nörobilim bölümündeki nörolojik muayene dersinin temelidir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 1: Bel ağrısından sonra idrarını yapamayan hasta',
      oyku: `46 yaşında bir kadın, iki gündür süren şiddetli bel ağrısı ve iki bacağına yayılan ağrıyla acil servise geliyor. Sabahtan beri idrarını yapamadığını, kalçalarının iç yüzünde ve makat çevresinde "uyuşukluk" hissettiğini söylüyor. Muayenede iki bacakta ayak bileği gücü azalmış; Aşil refleksleri alınamıyor.`,
      soru: 'Hasar sinir sisteminin hangi bölümünde, ve bu hasta neden beklememeli?',
      cozum: `**Yer:** Bulgular omurilikten değil, omuriliğin bittiği yerin altındaki **at kuyruğu** köklerinden geliyor: iki yanlı kök ağrısı, refleks kaybı (alt motor nöron bulgusu), makat çevresinde his kaybı ("eyer anestezisi") ve mesane işlevinin bozulması. Bu tablo **kauda ekina sendromudur**: S2 ve aşağısındaki sağrı köklerinin bir ya da birkaçının işlev bozukluğu; mesane ya da bağırsak işlevi, eyer bölgesi duyusu ve cinsel işlev bozulur (Lavy ve ark., 2022).

**Neden acil?** En sık nedeni büyük bir bel diski fıtığıdır (Lavy ve ark., 2022). Kauda ekina sendromu cerrahi bir acildir: sinir köklerinin üzerindeki baskının ameliyatla kaldırılması (dekompresyon) gerekir ve birçok çalışma erken dekompresyonun daha iyi sonuç verdiğini gösterir (Mustafa ve ark., 2023). Ameliyatın ne kadar sürede yapılması gerektiği ise tartışmalıdır (aşağıdaki kutu).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kauda ekina sendromu: tanım ve zamanlama',
      md: `Lavy ve arkadaşlarının önerdiği tanımda belirleyici olan sağrı köklerinin işlev bozukluğudur: mesane ya da bağırsak işlevinde bozulma, eyer bölgesinde duyu azalması ya da cinsel işlev bozukluğundan en az biri. Bel ve bacak ağrısı, bacaklarda güç ve duyu değişiklikleri sıktır ama tanı için şart değildir (Lavy ve ark., 2022).

Sistematik bir derlemede çalışmaların %60,9’unda en sık neden disk fıtığıydı (Mustafa ve ark., 2023). Ameliyat zamanlaması uzun süredir tartışılır. Korse ve arkadaşları (2017), önceki çalışmalarda 48 saat içinde yapılan dekompresyonun daha sonra yapılandan anlamlı biçimde daha iyi sonuç verdiğine dair önemli kanıt bulunduğunu yazar; ama kendi uzun dönem hasta dizilerinde dekompresyona kadar geçen süre, mesane, bağırsak ve cinsel işlevin sonucuyla anlamlı biçimde ilişkili bulunmadı. Yazarlar bunu küçük hasta sayısına ve 48 saatten sonra ameliyat edilen hastaların azlığına bağlar. Bu yüzden kesin bir saat sınırından çok, gecikmeden değerlendirme ve ameliyat ilkesi öne çıkar (Mustafa ve ark., 2023).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka 2: Bir göz kapağı düşük, göz bebeği küçük',
      oyku: `52 yaşında bir erkek, ani başlayan sol boyun ağrısından bir gün sonra sol göz kapağının hafifçe düştüğünü fark ediyor. Muayenede sol göz bebeği sağdan küçük. Yüzündeki terleme iki yanda eşit.`,
      soru: 'Hangi yol bozulmuş ve terlemenin korunması hasarın yeri hakkında ne söyler?',
      cozum: `**Yol:** Göz kapağını kaldıran Müller kası ile göz bebeğini büyüten kası yöneten **göze giden sempatik yol**. Bu yol üç nöronludur: hipotalamustan omuriliğin C8–T2 bölümlerindeki silyospinal merkeze (Budge–Waller), oradan boyundaki üst servikal gangliyona, oradan da iç karotis arterin duvarı boyunca göze (Maamouri ve ark., 2023). Yolun herhangi bir yerinde kesilme **Horner sendromuna** yol açar: tek yanlı göz kapağı düşüklüğü (pitoz), küçük göz bebeği (miyozis) ve aynı yanda yüzde terleme azlığı (anhidroz).

**Terleme neden korunmuş?** Yüzün ter bezlerine giden sempatik lifler dış karotis arter boyunca ilerler. İç karotis arterin duvarındaki bir yırtılma (diseksiyon) yalnızca iç karotisi saran lifleri bozar: pitoz ve miyozis olur ama anhidroz olmaz (Kanagalingam ve Miller, 2015). Ani boyun ağrısıyla gelen, terlemenin korunduğu eksik bir Horner sendromu bu yüzden iç karotis diseksiyonunu düşündürür. Müller kası göz kapağını yalnızca 2–3 mm kaldırdığı için pitoz hafiftir; 450 hastalık bir dizide hastaların %98’inde miyozis, %88’inde pitoz, %4’ünde anhidroz saptandı (Maamouri ve ark., 2023).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      duzey: 'ileri',
      baslik: 'Omurilik yaralanmasında otonom sistem',
      md: 'Göğüs omurilik bölümlerinin üst kısmındaki bir yaralanma beyinden sempatik nöronlara inen denetimi keser. T6 bölümü ya da daha yukarısındaki yaralanmalarda ayağa kalkınca kan basıncı düşmesi (ortostatik hipotansiyon), ilk dönemde yavaş nabız ve **otonom disrefleksi** görülebilir (Wulf ve Tom, 2023). Yaralanma yükseldikçe disrefleksi sıklaşır: boyunda, C6 bölümünün üstündeki yaralanmalardan sonra hastaların yaklaşık %85’inde görülür (Dougherty, UTHealth). Kalbe giden sempatik preganglionik nöronlar T1–T4 bölümlerindedir (Wulf ve Tom, 2023); bu yüzden yaralanmanın düzeyi kalbin ve damarların ne kadar etkileneceğini belirler.',
    },
  ],
};
