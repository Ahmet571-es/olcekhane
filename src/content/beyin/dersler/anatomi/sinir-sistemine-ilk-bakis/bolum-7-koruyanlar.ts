import type { DersBolumu } from '../../../types';

const ON_DOLASIM = '#e5484d';
const ARKA_DOLASIM = '#8a6fd8';
const BAGLANTI = '#f2b544';

/** 7. bölüm: kafatası, zarlar, BOS, kafa içi basıncı, kanamalar, beyin dolaşımı. */
export const koruyanlarVeBesleyenler: DersBolumu = {
  id: 'koruyanlar-ve-besleyenler',
  baslik: 'Beyni koruyanlar ve besleyenler',
  bloklar: [
    {
      tur: 'metin',
      md: `Beyin vücudun en korunaklı organlarından biridir. Dışarıdan içeriye doğru:

- **Kafatası:** Beyni saran kemik kutuyu sekiz kemik oluşturur: alın kemiği, iki yan kafa kemiği, iki şakak kemiği, art kafa kemiği, kama kemiği ve kalbur kemiği.
- **Beyin zarları (meninksler):** En dışta kalın ve sağlam **sert zar** (dura mater), ortada ince **örümcek ağı zar** (araknoid mater), en içte kıvrımların ve olukların içine kadar uzanan ince **yumuşak zar** (pia mater).
- **Beyin-omurilik sıvısı:** Örümcek ağı zarın altındaki boşluğu doldurur ve beyni ile omuriliği bir sıvı yastık gibi sarar. Karıncıkların içinde, özel bir zar (koroid pleksus) tarafından yapılır.

Beyin çok kan ister: iki çift atardamar onu besler. Boynun iki yanından **iç karotis arterler**, omurların içinden yükselen **vertebral arterler**. Vertebral arterler birleşip **baziler arteri** oluşturur. İç karotis arterler ile baziler arterin dalları beynin tabanında birbirine bağlanarak bir halka oluşturur: **Willis halkası**. Bu konuların her biri Anatomi bölümünün sonraki derslerinde ayrıntılı işlenecek.`,
    },
    {
      tur: 'sahne',
      baslik: 'Kafatası ve beyin',
      aciklama:
        'Kafatası kemikleri ile beyin bir arada. "Kesit" düğmesiyle ikisini birlikte kesip kemiğin beyni nasıl sardığını görebilir, "Katmanlar" ile kafatasını kapatıp altındaki beyne bakabilirsin.',
      sahne: {
        katmanlar: ['kemik', 'kabuk', 'sap'],
        renk: 'dogal',
        bakis: 'sol',
        etiketler: [
          { yapi: 'alin-kemigi' },
          { yapi: 'yan-kafa-kemigi-sol', metin: 'Yan kafa kemiği' },
          { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
          { yapi: 'art-kafa-kemigi' },
        ],
      },
      araclar: ['bakis', 'katman', 'kesit', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Alttan bakış: beynin atardamarları',
      aciklama:
        'Beyin yarı saydam; atardamarlar kırmızı. Alttan bakınca iç karotis arterler, baziler arter ve beynin tabanındaki Willis halkası görünür.',
      sahne: {
        katmanlar: ['damar', 'kabuk', 'sap'],
        renk: 'dogal',
        saydam: ['katman:kabuk', 'katman:sap'],
        bakis: 'alt',
        etiketler: [
          { yapi: 'ic-karotis-arter-sol', metin: 'İç karotis arter' },
          { yapi: 'baziler-arter' },
          { yapi: 'vertebral-arter-sol', metin: 'Vertebral arter' },
          { yapi: 'orta-beyin-arteri-sol', metin: 'Orta beyin arteri' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin arteri' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: 'Beyni dışarıdan içeriye **kafatası**, **üç zar** (sert zar, örümcek ağı zar, yumuşak zar) ve **beyin-omurilik sıvısı** korur. Kanı **iç karotis** ve **vertebral** arterler getirir.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      duzey: 'temel',
      baslik: 'Beyin kansız kalırsa',
      md: 'Beyin fazla enerji depolamaz: enerjisinin hemen hepsini kanın sürekli getirdiği oksijen ve şekerden (glikoz) sağlar. Beynin kan akımı tamamen durursa 5–10 saniye içinde bilinç kaybolur; kan akımı birkaç dakika içinde yeniden başlamazsa kalıcı hasar oluşur. İnmede ise beynin yalnızca bir bölgesinin kan akımı durur ya da azalır: bazı beyin hücreleri hemen ölür, çevredeki birçok hücre saatlerce zarar görmüş ama henüz canlı durumda kalabilir. Kalıcı hasar dakikalar ya da saatler içinde oluşur; bu yüzden inme acil bir durumdur ve her dakika önemlidir.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Zarlar ve aralarındaki aralıklar',
      md: `**Sert zar** iki tabakadan oluşur: kafatasının iç yüzüne yapışık **periost (endost) tabakası** ve beyne bakan **meningeal tabaka**. Beynin toplardamar kanını toplayıp boyundaki iç juguler vene akıtan **dural venöz sinüsler** bu iki tabakanın arasındadır (Kekere ve Alsayouri, 2023; Joost ve ark., 2026). Meningeal tabaka içeri doğru kıvrılarak bölmeler yapar: iki yarımküreyi ayıran **beyin orağı** (falx cerebri), büyük beyin ile beyinciğin arasına raf gibi uzanan **beyincik çadırı** (tentorium cerebelli), **beyincik orağı** (falx cerebelli) ve hipofizi örten **diyafragma sella**. Güncel çalışmalar sert zarı üç tabakalı anlatır: periost tabakası, meningeal tabaka ve en içte **dural sınır hücre tabakası** (Ishikawa ve ark., 2026).

- **Epidural aralık:** Kafatasında normalde gerçek bir boşluk yoktur, olası (potansiyel) bir aralıktır; omurga kanalında ise yağ, sinirler ve damarlar içeren gerçek bir aralıktır (Shafique ve Rayi, 2023; Gala ve Aswani, 2016).
- **Subdural aralık:** Eski kitaplar sert zar ile örümcek ağı zar arasında olası bir aralık anlatır. Güncel görüşe göre sağlıklı beyinde gerçek bir subdural aralık yoktur: küçük bir travma ya da cerrahi, dural sınır hücre tabakasını yararak bu aralığı oluşturur (Joost ve ark., 2026; Ishikawa ve ark., 2026). Beyin orağı, subdural kanamayı tek yarımküreyle sınırlar (Ishikawa ve ark., 2026).
- **Subaraknoid aralık:** Gerçek bir aralıktır; beyin-omurilik sıvısını ve büyük atardamarlarla toplardamarları taşır (kılcal damar taşımaz). Yer yer genişleyerek **sarnıçları** (sisternalar) oluşturur (Shafique ve Rayi, 2023; Joost ve ark., 2026).`,
    },
    {
      tur: 'animasyon',
      ad: 'kafa-ici-kanamalar',
      duzey: 'lisans',
      baslik: 'Katmanlar ve kafa içindeki üç kanama',
      aciklama:
        'Kafatasının yanından alınmış şematik bir kesit. Önce katmanları tanı, sonra bir kanama seç: kanın hangi aralıkta toplandığını, biçimini ve kaynağını izle.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üç kanamanın karşılaştırması',
      sutunlar: ['Özellik', 'Epidural', 'Subdural', 'Subaraknoid'],
      satirlar: [
        ['Yer', 'Kemik ile sert zar arası', 'Sert zar ile örümcek ağı zar arası', 'Örümcek ağı zarın altında, BOS içinde'],
        [
          'Kaynak',
          'Çoğunlukla şakak kemiği kırığında yırtılan orta meningeal arter',
          'Yırtılan köprü venler',
          'En sık kafa travması; travma dışı olanların yaklaşık %85’inde yırtılan bir anevrizma',
        ],
        ['BT’de biçim', 'İki yanı dışbükey, mercek biçimli', 'Hilal biçimli', 'Oluklarda ve BOS aralığında kan'],
        [
          'Sınırları',
          'Genellikle sütürleri aşmaz; sert zar kıvrımlarını (orak, çadır) aşabilir',
          'Sütürleri aşabilir; sert zar kıvrımlarını (orak, çadır) aşamaz',
          'BOS’un dolaştığı aralık boyunca yayılır',
        ],
        [
          'Tipik öykü',
          'Kısa bilinç kaybı, "açık aralık", sonra hızlı kötüleşme (her hastada değil)',
          'İleri yaş, kan sulandırıcı ilaç, uzun süreli alkol kullanımı, sık düşme; akut, yarı akut ya da kronik',
          'Ani, "hayatımın en kötü baş ağrısı"',
        ],
        [
          'Sayılar',
          'Kafa travmalarının yaklaşık %2’sinde; %85’inde kafatası kırığı var',
          'Kronik subdural kanama yılda 100 binde 17,3; 85 yaş üstü erkeklerde 100 binde 350’yi aşar',
          'İnmelerin yaklaşık %3’ü',
        ],
      ],
      not: 'Kaynaklar: Stalons ve ark. (2022); Shetty ve ark. (2016); Pierre ve ark. (2026); Ziu ve ark. (2023); Griswold ve ark. (2022); MedlinePlus; NHLBI (2023).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 4: Kaykaydan düşen genç',
      oyku: `19 yaşında bir genç kaykaydan düşüp başının yan tarafını kaldırıma çarpıyor. Bir iki dakika bilinci kapalı kalıyor, sonra kalkıp arkadaşlarıyla konuşuyor; yalnızca baş ağrısından yakınıyor. İki saat sonra kusmaya başlıyor, uykuya meyli artıyor ve seslenince güçlükle uyanıyor.`,
      soru: 'Kafatasının içinde ne oluyor olabilir ve neden her dakika önemli?',
      cozum: `Öykü **epidural kanamayı** düşündürür. Şakak kemiğindeki bir kırık, altındaki **orta meningeal arteri** yırtabilir; atardamar basıncıyla toplanan kan sert zarı kemikten ayırır (Stalons ve ark., 2022). Kısa bir bilinç kaybından sonraki bu sakin döneme **açık aralık** denir; ardından hızlı bir kötüleşme gelebilir. Bu tablo her hastada görülmez (MedlinePlus, 2024). BT’de sütürlerle sınırlanmış, iki yanı dışbükey, mercek biçimli bir kan toplanması görülür (Shetty ve ark., 2016).

Kan biriktikçe kafatasındaki öteki içerikler (BOS ve toplardamar kanı) yer açar; bu tampon tükenince kafa içi basıncı hızla yükselir (aşağıdaki Monro–Kellie çizimine bak). Epidural kanama acil bir durumdur; kafa içi basıncı arttıysa basıncı düşürmek ve beyni daha fazla hasardan korumak için acil ameliyat gerekebilir. Hızlı cerrahi girişim yapılmazsa ölüm riski yüksektir (MedlinePlus, 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Beyin-omurilik sıvısının yolculuğu',
      md: `Beyin-omurilik sıvısını (BOS) büyük ölçüde karıncıklardaki **koroid pleksus** yapar; kaynaklar bu payı %75 ile %90 arasında verir, kalanı kan-beyin engelinden gelir (Khasawneh ve ark., 2018; Bothwell ve ark., 2019). Günde yaklaşık 500 mL yapılır (OpenStax 13.3), ama herhangi bir anda 125–150 mL kadar bulunur; toplam miktar yaklaşık 7,5 saatte bir yenilenir. Yatar durumda normal BOS basıncı 8–15 mmHg’dir (Margetis ve ark., 2025). Sıvının yolu (Bothwell ve ark., 2019; Khasawneh ve ark., 2018):

1. Yan karıncıklar → **karıncıklar arası delikler (Monro delikleri)** → üçüncü karıncık
2. Üçüncü karıncık → **beyin su yolu (Sylvius akuadüktü)** → dördüncü karıncık
3. Dördüncü karıncık → ortadaki **Magendie** ve yanlardaki **Luschka** açıklıkları → subaraknoid aralık
4. Subaraknoid aralık → **araknoid granülasyonlar** → üst sagital sinüs, yani toplardamar kanı

Son basamak tartışmalıdır: araknoid granülasyonların BOS’un geri emilmesindeki payı sorgulanıyor ve başka yolların da önemli katkısı olduğu düşünülüyor (Bothwell ve ark., 2019).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Karıncık sistemi',
      aciklama:
        'Beyin yarı saydam yapıldı; içteki karıncıklar renkli. Mavi yan karıncıklar, sarı karıncıklar arası delik (Monro), turkuaz üçüncü karıncık, mor beyin su yolu (Sylvius), pembe dördüncü karıncık. BOS bu sırayla akar ve dördüncü karıncıktan subaraknoid aralığa çıkar.',
      sahne: {
        katmanlar: ['kabuk', 'sap', 'karincik'],
        renk: 'bolge',
        saydam: ['katman:kabuk', 'katman:sap'],
        gizle: ['bolge:sinir'],
        vurgula: ['katman:karincik'],
        boya: [
          { secici: ['yan-karincik'], renk: '#4f8de0' },
          { secici: ['karinciklar-arasi-delik'], renk: '#f2b544' },
          { secici: ['ucuncu-karincik'], renk: '#25b9a3' },
          { secici: ['beyin-su-yolu'], renk: '#8a6fd8' },
          { secici: ['dorduncu-karincik'], renk: '#ee6a92' },
        ],
        bakis: 'egik',
        etiketler: [
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
          { yapi: 'karinciklar-arasi-delik', metin: 'Monro deliği' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'beyin-su-yolu', metin: 'Beyin su yolu' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Hidrosefali',
      md: `Karıncıklarda BOS birikmesine **hidrosefali** denir; hidrosefalilerin yaklaşık %95’i BOS akışının bozulmasından kaynaklanır (Bothwell ve ark., 2019). Dandy 1913’te iki türü ayırdı (Koleva ve De Jesus, 2023): akışın karıncıkların içinde ya da çıkışında engellendiği **iletişimsiz (tıkayıcı)** hidrosefali ve engelin büyük sarnıç (sisterna magna) ile BOS’un kafatasından çıktığı yerler arasında olduğu **iletişimli** hidrosefali (Hladky ve Barrand, 2024).

Yetişkinde en sık biçim **normal basınçlı hidrosefalidir**: önce yürüme bozukluğu başlar, ardından düşünme ve bellek güçlükleri ile idrar sıkışması ya da kaçırma eklenir; bu üçlüyü Salomon Hakim ve R. D. Adams 1965’te tanımladı. Geri döndürülebilir bir bunama nedenidir (Margetis ve ark., 2026; Damasceno, 2009). Tedavide fazla BOS bir **şantla** karın ya da göğüs boşluğuna akıtılır (ventrikülo-peritoneal şant); bazı hastalarda üçüncü karıncığın tabanında küçük bir delik açılır: **endoskopik üçüncü ventrikülostomi** (NINDS, 2026; MedlinePlus, 2026).`,
    },
    {
      tur: 'animasyon',
      ad: 'monro-kellie',
      duzey: 'ileri',
      baslik: 'Monro–Kellie ilkesi ve basınç–hacim eğrisi',
      aciklama:
        'Kaydırıcıyla kafatasına hacim ekle ya da kitleyi kendiliğinden büyüt. BOS ve kan nasıl yer açıyor, basınç ne zaman hızla yükseliyor, beyin perfüzyon basıncı nasıl düşüyor?',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kafa içi basıncı: ölçmek, yorumlamak, düşürmek',
      md: `- **Normal değerler:** Yetişkinde yatarken yaklaşık 7–15 mmHg; çocukta 3–6, term bebekte 1,5–6 mmHg (Canac ve ark., 2020). 20–25 mmHg’nin üstü genellikle patolojik sayılır (Pinto ve Adeyinka, 2025); 30 mmHg patolojik, 40 mmHg yaşamı tehdit eden bir düzeydir (Bothwell ve ark., 2019).
- **Perfüzyon basıncı:** Beyin perfüzyon basıncı = ortalama arter basıncı − kafa içi basıncı. Beyin Travması Vakfı kılavuzu, kafa travmasında kafa içi basıncı 22 mmHg’yi aşınca tedaviyi ve perfüzyon basıncının 60–70 mmHg arasında tutulmasını önerir (Schizodimos ve ark., 2020).
- **Ölçüm:** Karıncık içine yerleştirilen kateter en güvenilir yöntemdir (altın standart); esnekliği azalmış hastalarda bu kateterden 5–10 mL BOS boşaltmak bile basıncı belirgin düşürebilir (Schizodimos ve ark., 2020).
- **Monro–Kellie:** Kafatasındaki beyin, kan ve BOS’tan birinin hacmi artarsa ötekilerden biri ya da ikisi azalır; bu artık mümkün olmayınca basınç yükselir (Bothwell ve ark., 2019). Basınç–hacim eğrisi üsteldir: BOS’un ve toplardamar kanının yer değiştirmesiyle sağlanan tampon tükendikçe basınç giderek hızlanarak artar (Canac ve ark., 2020). İlke Monro (1783) ve Kellie’nin (1824) adını taşır; ilk anlatımlarda BOS’tan hiç söz edilmez, BOS’u ilkeye sonradan Burrows ekler (Wilson, 2016).
- **Plato dalgaları:** Basıncın aniden 50 mmHg’nin üstüne çıkıp 5 dakikadan uzun kaldığı dalgalar (Canac ve ark., 2020).
- **Herniasyon:** Basınç farkı beyin dokusunu orağın altından, çadırın çentiğinden ya da kafatası deliklerinden iter: orağın altından singulat girusun kaydığı subfalsin, unkal, santral (aşağı inen) transtentoryal, yukarı doğru transtentoryal ve beyincik tonsillerinin foramen magnumdan itildiği tonsiller herniasyon (Munakomi ve Das, 2026). Geç ve kötü bir belirti **Cushing üçlüsüdür**: ağır hipertansiyon, bradikardi ve düzensiz solunum; beyin sapının sıkıştığını gösterir (Schizodimos ve ark., 2020).
- **Cerrahi:** Dekompresif kraniyektomi kafa içi basıncını tek başına %15, sert zar da açılınca %70 düşürür. Geniş (masif) iskemik inmede ilk 48 saatte yapılan dekompresif hemikraniyektomi, üç randomize çalışmanın (DECIMAL, HAMLET, DESTINY) birleşik analizinde sağkalımı %29’dan %78’e çıkardı ve bir yıllık nörolojik sonucu iyileştirdi (Schizodimos ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Beynin kan akımı: sayılar ve eşikler',
      md: `- Beyin dakikada yaklaşık **750 mL** kan alır; bu kalp debisinin aşağı yukarı %15–20’sidir. 100 g doku başına ortalama **50 mL/dk** düşer; gri cevherde yaklaşık 80, beyaz cevherde 20 mL/100 g/dk (Khartabil ve ark., 2026; Khan Suheb ve Bordoni, 2026).
- Beyin vücut ağırlığının yaklaşık %2’si olduğu hâlde oksijenin %20’sini (de Castro ve ark., 2010), glikozun %25’ini kullanır (Siwicka-Gieroba ve ark., 2022).
- **Otoregülasyon:** Ortalama arter basıncı yaklaşık 50 ile 150 mmHg arasında değişse de beyin kan akımı sabit tutulur (Ungvari ve ark., 2025); bazı yazarlar bu aralığı perfüzyon basıncı için verir (Peterson ve ark., 2011).
- **İskemi eşikleri:** Kan akımı 10–20 mL/100 g/dk’ya düşünce hücrelerin işlevi durur ama yapıları sağlam kalır; daha da düşerse hücreler dakikalar içinde ölmeye başlar (Mangiardi ve ark., 2023). EEG değişiklikleri 25–35’te başlar; 17–18 kritik iskemi eşiği, 10–12 ve altı enfarkt eşiğidir (Foreman ve Claassen, 2012).
- Kan akımı tümüyle durursa bilinç 4–10 saniye içinde kaybolur, EEG 10–30 saniyede düzleşir (Sandroni ve ark., 2021).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Willis halkası: ön ve arka dolaşım',
      aciklama:
        'Yalnızca atardamarlar, alttan bakış; ön taraf ekranın üstünde. Kırmızı: iç karotisten beslenen ön dolaşım (ön ve orta beyin arterleri). Mor: vertebral ve baziler arterden beslenen arka dolaşım. Sarı: iki sistemi birbirine bağlayan ön ve arka bağlantı arterleri. Halkanın parçaları öne çıkarıldı; besleyen büyük arterler soluk.',
      sahne: {
        katmanlar: ['damar'],
        renk: 'dogal',
        vurgula: ['on-beyin-arteri', 'on-baglanti-arteri', 'arka-baglanti-arteri', 'arka-beyin-arteri', 'baziler-arter'],
        boya: [
          { secici: ['ic-karotis-arter', 'on-beyin-arteri', 'orta-beyin-arteri'], renk: ON_DOLASIM },
          { secici: ['vertebral-arter', 'baziler-arter', 'arka-beyin-arteri', 'ust-beyincik-arteri'], renk: ARKA_DOLASIM },
          { secici: ['on-baglanti-arteri', 'arka-baglanti-arteri'], renk: BAGLANTI },
        ],
        bakis: 'alt',
        etiketler: [
          { yapi: 'on-beyin-arteri-sol', metin: 'Ön beyin arteri (ACA)' },
          { yapi: 'on-baglanti-arteri', metin: 'Ön bağlantı arteri' },
          { yapi: 'arka-baglanti-arteri-sol', metin: 'Arka bağlantı arteri' },
          { yapi: 'arka-beyin-arteri-sol', metin: 'Arka beyin arteri (PCA)' },
          { yapi: 'baziler-arter', metin: 'Baziler arter' },
          { yapi: 'ic-karotis-arter-sag', metin: 'İç karotis arter' },
          { yapi: 'orta-beyin-arteri-sag', metin: 'Orta beyin arteri (MCA)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Willis halkası, atardamar alanları ve sınır bölgeleri',
      md: `İki iç karotis arterden beslenen **ön dolaşım** frontal ve parietal lobları ve temporal lobların yan yüzünü; iki vertebral arterden beslenen **arka dolaşım** beyin sapını, beyinciği, oksipital lobları, temporal lobların iç yüzünü ve talamusu besler (Rosner ve ark., 2023).

**Willis halkası** yedi arter parçasından oluşur: sağ ve sol ön beyin arterinin başlangıç bölümü, ön bağlantı arteri, sağ ve sol arka bağlantı arteri, sağ ve sol arka beyin arterinin başlangıç bölümü. İç karotisler ve baziler arter halkayı besleyen "giriş" arterleridir. Halka kişiden kişiye çok değişir: 1864 kişilik Tromsø çalışmasında eksiksiz halka yalnızca %11,9 kişide vardı; en sık görülen biçim (%27,8) iki arka bağlantı arterinin de olmadığı biçimdi (Hindenes ve ark., 2020). Arka beyin arterleri %70 baziler arterden, %20 arka bağlantı arterlerinden, %10 karışık kökenden çıkar (Javed ve ark., 2023).

**Atardamar alanları ve tıkanınca** (Hurford ve ark., 2020; sol yarımküre baskın kabul edilerek):

- **Ön beyin arteri (ACA):** İki yarımküre arasından, korpus kallozumun üstünden arkaya uzanır (Matos Casano ve ark., 2026). Tıkanması karşı bacakta uyuşukluk ve güçsüzlük yapar.
- **Orta beyin arteri (MCA):** Frontal, parietal ve temporal lobların yan yüzünü, bazal çekirdekleri ve iç kapsülü besler (Margetis ve Sánchez-Manso, 2025). Üst dalının tıkanması karşı yanda yüz ve kolda bacaktan belirgin güçsüzlük ve uyuşukluk ile ifade bozukluğu (Broca türü afazi), alt dalının tıkanması anlama bozukluğu (Wernicke türü afazi) yapar.
- **Arka beyin arteri (PCA):** Oksipital lobun büyük bölümünü besler (Javed ve ark., 2023); tıkanması karşı yanda homonim yarım görme kaybı yapar.

**Sınır (watershed) bölgeleri:** Birbirine bağlanmayan iki ana arter alanının arasında kalan bölgelerdir: kabukta ACA ile MCA ve MCA ile PCA arasında, derinde MCA’nın derin ve yüzeysel delici dalları arasında. Bu bölgelerdeki enfarktlara sınır bölge enfarktı denir (Li ve ark., 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'İnme: sayılar ve zaman',
      md: `İnmelerin çoğu iskemiktir. ABD Ulusal Kalp, Akciğer ve Kan Enstitüsü’ne göre inmelerin yaklaşık %87’si iskemik, %10’u beyin içi kanama, %3’ü subaraknoid kanamadır (NHLBI, 2023); NINDS iskemik payı yaklaşık %80 verir. Oranlar ülkeden ülkeye değişir: dünya genelinde yeni inmelerin %65,3’ü iskemik, %28,8’i beyin içi kanama, %5,8’i subaraknoid kanamadır; yüksek gelirli ülkelerde iskemik pay %74,9’dur (Feigin ve ark., 2025).

Saver (2006), tedavi edilmeyen büyük damar tıkanmasında her dakika ortalama **1,9 milyon nöron**, 14 milyar sinaps ve 12 km miyelinli lif yitirildiğini hesapladı; iskemik beyin her saat yaklaşık 3,6 yıl yaşlanır. Hesap 54 mL’lik bir enfarkt, 10 saatlik gelişim süresi ve ön beyinde 22 milyar nöron varsayımına dayanır. "Zaman beyindir" sözü bu hesaptan gelir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 5: Kahvaltıda düşen çay bardağı',
      oyku: `71 yaşında bir kadın kahvaltıda birden sağ elindeki çay bardağını düşürüyor. Torunu, ağzının sağ köşesinin düştüğünü ve konuşurken çok zorlandığını fark ediyor: kısa, kesik sözcüklerle derdini anlatmaya çalışıyor. Söyleneni büyük ölçüde anlıyor. Sağ kolu belirgin güçsüz, sağ bacağı daha az etkilenmiş. Alnını iki yanda da kırıştırabiliyor.`,
      soru: 'Hasar beynin hangi yanında ve hangi atardamarın alanında olabilir?',
      cozum: `**Yan:** Belirtiler sağda; hareket yolu omurilik soğanında çaprazlaştığı için hasar **sol yarımküredeki**. Yüzün yalnızca alt yarısının etkilenmesi, alnın korunması, kabuktan inen yolların hasarına uyar: yüzün üst yarısı iki yarımküreden birden komut alır (Neuroanatomy Online, UTHealth).

**Yer:** Kısa ve zorlanarak kurulan cümleler, anlamanın görece korunması **Broca afazisine** uyar; bu tablo frontal lob hasarında görülür ve çoğu kişide sol yarımküre etkilenir (NIDCD, 2025). Yüz ve kolun bacaktan daha çok etkilenmesi ve ifade bozukluğu, **sol orta beyin arterinin üst dalı** alanına uyar; ön beyin arterinin tıkanması ise asıl olarak bacağı etkilerdi (Hurford ve ark., 2020).

**Neden acil?** Tedavi edilmeyen büyük damar tıkanmasında her dakika ortalama 1,9 milyon nöron kaybedilir (Saver, 2006). İnme belirtileri fark edildiği an zaman kaybetmeden acil yardım çağrılmalıdır.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Anevrizma ve subaraknoid kanama',
      md: `Travma dışı subaraknoid kanamaların yaklaşık %85’i yırtılan bir kafa içi anevrizmadan kaynaklanır (Ziu ve ark., 2023); en sık tür kese biçimli (sakküler) anevrizmadır. Anevrizmalar küçük (11 mm’den küçük), büyük (11–25 mm) ve dev (25 mm’den büyük) diye ayrılır. Bazen anevrizma büyük yırtılmadan günler ya da haftalar önce az miktarda kan sızdırır (uyarıcı kanama, "sentinel bleed"); ama yırtılmadan önce bu baş ağrısını yaşayan az sayıda kişidir (NINDS, 2026).

Tanıda önce kontrastsız BT çekilir; normalse lomber ponksiyon yapılabilir (MedlinePlus, 2025). Tedavide anevrizma kraniyotomiyle mikrocerrahi **klipsle** kapatılır ya da damar içinden **platin sarmallarla** (koil) doldurulur; akım çevirici (flow diverter) yöntemler de kullanılır (NINDS, 2026). Kanamadan 3–14 gün sonra gelişebilen **gecikmiş beyin iskemisi** büyük bir tehlikedir; ağır nörolojik hasara ve ölüme yol açabilir (NINDS, 2026). Hemorajik inmede 30 günlük ölüm oranı %30–40 dolayındadır ve ölümlerin yarısı ilk 48 saatte olur (Unnithan ve Das, 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Kan-beyin engeli',
      md: `Kan-beyin engelinin asıl yeri beyin kılcallarının **endotel hücreleridir**: bu hücreler birbirine kesintisiz **sıkı bağlantılarla** kenetlenir. Endotelin çevresinde bazal zar, çok sayıda **perisit** ve **astrosit ayakçıkları** bulunur. Engelin endotelde olduğu Reese ve arkadaşlarının elektron mikroskobu çalışmalarıyla gösterildi (Dash, UTHealth).

Bazı küçük bölgelerde tipik bir engel yoktur: **çevre karıncık organları** (sirkumventriküler organlar). Bunların bir bölümü kandaki maddeleri algılayan duyusal organlardır (lamina terminalisin damarlı organı, subfornikal organ, area postrema), bir bölümü kana hormon veren salgı organlarıdır (median eminens, arka hipofiz, epifiz) (Miyata, 2022). Mannitol beyni ozmotik olarak susuz bırakarak kafa içi basıncını düşürür (Dash, UTHealth).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Sert zar: periost + meningeal tabaka; venöz sinüsler arada. Kıvrımlar: beyin orağı, beyincik çadırı, beyincik orağı, diyafragma sella.
- **Epidural:** orta meningeal arter, mercek biçimli, sütürü aşmaz. **Subdural:** köprü venler, hilal biçimli, sütürü aşar, orağı aşmaz. **Subaraknoid:** en sık travma; travma dışında %85 anevrizma.
- BOS: günde ~500 mL, aynı anda 125–150 mL. Yan karıncık → Monro → 3. karıncık → Sylvius akuadüktü → 4. karıncık → Magendie (orta) ve Luschka (yanlar) → subaraknoid aralık → araknoid granülasyonlar → üst sagital sinüs.
- Perfüzyon basıncı = ortalama arter basıncı − kafa içi basıncı; KİB normali 7–15 mmHg; Cushing üçlüsü: hipertansiyon, bradikardi, düzensiz solunum.
- Willis halkası: 2 ACA (A1) + AComA + 2 PComA + 2 PCA (P1) = 7 parça; eksiksiz halka azınlıkta.
- ACA tıkanması → karşı bacak; MCA → karşı yüz-kol, baskın yarımkürede afazi; PCA → karşı homonim hemianopi.`,
    },
  ],
};
