import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from './bolum-1-genel';

/** 5. bölüm: göz çukuru, burun, sinüsler, damak, çene eklemi, dil kemiği ve ilk iki boyun omuru. */
export const yuzVeBoyun: DersBolumu = {
  id: 'yuz-sinusler-ve-boyun',
  baslik: 'Yüz, sinüsler ve kafatasının omurgaya oturuşu',
  bloklar: [
    {
      tur: 'metin',
      md: `Kafatasının ön ve alt kısmını yüz kemikleri yapar: üst ve alt çeneler, burun ve göz çukurları. Beyin cerrahisi açısından yüz uzak bir komşu değildir: göz çukurunun tavanı ön kafa çukurunun tabanıdır, sinüslerin bazıları kafatası tabanına dayanır.

**Göz çukuru** (*orbita*), göz küresini, onu hareket ettiren kasları ve üst göz kapağını kaldıran kası barındıran kemik yuvadır. Koni biçimlidir: arkası dar, önü geniş bir açıklıktır; gözü korumak için ön kenarları kalınlaşmıştır. İki göz çukurunun iç duvarları birbirine paraleldir, dış duvarları ise orta hattan 45° açıyla uzaklaşır; bu açılma yan görüşü genişletir. Duvarlarına **yedi kemik** katılır:

- **Tavan:** alın kemiği.
- **Dış duvar ve tabanın dış kısmı:** elmacık kemiği.
- **Tabanın iç kısmı:** çoğunlukla üst çene; küçük bir parçayı damak kemiği yapar.
- **İç duvar:** büyük ölçüde kalbur ve gözyaşı kemikleri.
- **Arka:** kama kemiği.

Göz çukurunun arkadaki tepesinde **optik kanal** ve onun dışında **üst orbital yarık** açılır; görme siniri ve göz kaslarının sinirleri buradan girer (OpenStax 7.2).`,
    },
    {
      tur: 'sahne',
      baslik: 'Göz çukurunu yapan yedi kemik',
      aciklama:
        'Önden bakıyoruz. Sol göz çukurunda turuncu alın kemiği tavanı, deniz yeşili elmacık kemiği dış duvarı, pembe üst çene tabanı yapar; iç duvarda sarı kalbur kemiği ve kahverengi gözyaşı kemiği, arkada kırmızı kama kemiği görülür. Damak kemiğinin göz çukuruna katkısı çok küçüktür, en arkada saklıdır.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'on',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['elmacik-kemigi'], renk: KEMIK_RENGI.elmacik },
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
          { secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur },
          { secici: ['gozyasi-kemigi'], renk: '#8d6e63' },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['damak-kemigi'], renk: '#577590' },
        ],
        etiketler: [
          { yapi: 'alin-kemigi' },
          { yapi: 'elmacik-kemigi-sol', metin: 'Elmacık kemiği' },
          { yapi: 'ust-cene-kemigi-sol', metin: 'Üst çene' },
          { yapi: 'gozyasi-kemigi-sol', metin: 'Gözyaşı kemiği' },
          { yapi: 'kama-kemigi' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Burun boşluğu** ortadan **burun bölmesiyle** (*septum nasi*) ikiye ayrılır. Bölmenin üst kısmını kalbur kemiğinin dik plağı, alt ve arka kısmını üçgen biçimli sapan kemiği (*vomer*), önünü esnek **bölme kıkırdağı** yapar. Burun boşluğunun yan duvarlarından içeri doğru kıvrık kemik çıkıntılar, **kavkalar** (*conchae*) uzanır: üst ve orta kavka kalbur kemiğinin parçasıdır, alt kavka ise ayrı bir kemiktir. **Sert damak** ağzın tavanı ve burun boşluğunun tabanıdır; ön dörtte üçünü üst çene kemiklerinin damak çıkıntıları, arka dörtte birini damak kemiklerinin yatay plakları yapar (OpenStax 7.2).

**Sinüsler** (*sinus paranasales*), bazı kafatası kemiklerinin içindeki hava boşluklarıdır. Hepsi burun boşluğuna açılır ve burun mukozasıyla döşelidir; kafatasını hafifletir, sese tını katarlar. Bulundukları kemiğin adını alırlar (OpenStax 7.2):

- **Frontal sinüs:** alın kemiğinde, kaşların hemen üstünde; en öndeki sinüs.
- **Maksiller sinüsler:** üst çene kemiklerinde, göz çukurlarının altında; en büyükleri.
- **Sfenoid sinüs:** kama kemiğinin gövdesinde, Türk eyerinin hemen önünde ve altında; en arkadaki sinüs.
- **Etmoid hava hücreleri:** kalbur kemiğinin iki yanında, göz çukurunun iç duvarı ile burun boşluğu arasında, ince duvarlarla ayrılmış çok sayıda küçük boşluk.

Nezle olunca mukoza şişer ve sinüslerle burun arasındaki dar geçitler tıkanabilir: sesimiz değişir, sinüsler sıvıyla dolup ağrı yapabilir. Maksiller sinüsün burna açılan ağzı iç duvarının yukarısında olduğu için zor boşalır; sinüs enfeksiyonlarında en sık tutulan sinüs budur (OpenStax 7.2).

**Çene eklemi** (*articulatio temporomandibularis*): alt çenenin oval kondili, şakak kemiğindeki çene çukuru ve hemen önündeki eklem tüberkülüyle eklem yapar; ağzı açıp kapamamızı sağlar. **Dil kemiği** (*os hyoideum*) ise boynun üst kısmında, alt çenenin alt kenarı düzeyinde duran U biçimli küçük bir kemiktir ve hiçbir kemikle eklem yapmaz. Üstte dilin tabanıdır, altta gırtlağa, arkada yutağa bağlanır; çevresindeki küçük kaslar onu yutarken ve konuşurken hareket ettirir (OpenStax 7.2).

**Kafatası omurgaya nasıl oturur?** Art kafa kemiğinin foramen magnumun iki yanındaki oval **kondilleri** birinci boyun omuruyla eklem yapar ve kafatasını omurganın üstünde taşır (OpenStax 7.2). Birinci omura **atlas** denir: Yunan mitolojisinde gökyüzünü omuzlarında taşıyan Atlas gibi o da kafatasını taşır. Gövdesi ve dikensi çıkıntısı yoktur; ön ve arka kemerden oluşan bir halkadır. İkinci omur **aksis**, başı sağa sola çevirirken dönme ekseni olduğu için bu adı alır. Gövdesinden yukarı uzanan diş biçimli çıkıntı, **dens**, atlasın ön kemerinin iç yüzüne oturur ve enine bağla yerinde tutulur (OpenStax 7.3).`,
    },
    {
      tur: 'sahne',
      baslik: 'Alttan bakış: dış kafa tabanı ve atlas',
      aciklama:
        'Kafatasına alttan bakıyoruz; alt çene ve aksis gizlendi, görüntünün üstü yüz tarafı. Ortadaki halka atlastır (açık mavi): art kafa kemiğinin (mor) kondilleriyle eklem yapar ve kafatasını taşır. Önde pembe üst çene ile mavi damak kemikleri sert damağı yapar; iki yanda yeşil şakak kemiklerinin çene çukurları, ortada kırmızı kama kemiği görülür. “Ayrıştır” ile atlası kafatasından ayırıp kondillerin oturduğu yüzeyleri görebilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'alt',
        gizle: ['alt-cene-kemigi', 'dil-kemigi', 'aksis'],
        boya: [
          { secici: ['atlas'], renk: KEMIK_RENGI.omur },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
          { secici: ['damak-kemigi'], renk: '#577590' },
        ],
        etiketler: [
          { yapi: 'atlas' },
          { yapi: 'art-kafa-kemigi' },
          { yapi: 'ust-cene-kemigi-sol', metin: 'Üst çene (sert damak)' },
          { yapi: 'damak-kemigi-sol', metin: 'Damak kemiği' },
          { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'katman', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Göz çukuru = 7 kemik:** alın, elmacık, üst çene, damak, kalbur, gözyaşı, kama.\n\n**Burun bölmesi:** kalbur kemiğinin dik plağı + sapan kemiği + bölme kıkırdağı.\n\n**Sinüsler:** frontal (en önde), maksiller (en büyük, en sık enfeksiyon), sfenoid (en arkada, hipofizin altında), etmoid hücreleri.\n\n**Atlas** kafatasını taşır, **aksis** başın dönme eksenidir.',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Yarık dudak ve yarık damak',
      md: `Gelişim sırasında üst dudağın sağ ve sol parçaları birleşir; ağzın içinde de üst çene kemiklerinin damak çıkıntıları ile damak kemiklerinin yatay plakları orta hatta kaynaşarak sert damağı yapar. Bu süreçte bir aksama olursa doğuştan **yarık dudak** ya da **yarık damak** oluşur (OpenStax 7.2).

Yarık dudak yaklaşık 1000 doğumda 1 görülür ve çoğu erkek bebektir; dudağın iki yarısı kısmen ya da tamamen birleşmez. Daha ağır olan yarık damak yaklaşık 2500 doğumda 1 görülür ve kızlarda daha sıktır: damağın iki yarısı orta hatta birleşmez ve ağız ile burun boşluğu arasında bir açıklık kalır. Ağır olgularda yarık üst çenenin ön dişleri taşıyan kısmına uzanır ve yarık dudak da eşlik eder. Ağız ile burun arasındaki bu açıklık bebeğin emmesini çok zorlaştırır ve beslenme yetersizliği riski doğurur; yarık damak cerrahiyle onarılır (OpenStax 7.2).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Göz çukurunun duvarları:** tavan alın; dış duvar elmacık; taban üst çene (dış kısmı elmacık, küçük bir parçası damak); iç duvar kalbur ve gözyaşı; arka kama (OpenStax 7.2).
- **Delikler:** supraorbital delik alın derisinin duyu sinirini, infraorbital delik burnun, üst dudağın ve yanağın ön kısmının duyu sinirini geçirir (OpenStax 7.2).
- **Göz çukurunun tavanı** aynı zamanda ön kafa çukurunun tabanıdır; kafa tabanı kırıkları alın kemiğinin bu göz çukuru plağını da tutabilir (Simon ve Newton, 2023).
- **Sert damak:** ön ¾ üst çenenin damak çıkıntıları, arka ¼ damak kemiğinin yatay plakları.
- **Sfenoid sinüs** Türk eyerinin önü-altındadır; arkasında klivus bulunur ve klivusun biçimi sinüsün ne kadar havalandığına göre değişir (Cheng ve ark., 2015).
- **Atlasın** gövdesi yoktur; **aksisin** densi atlasın ön kemerine oturur.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Burundan kafa tabanına: endoskopik koridorun işaretleri',
      md: `Hipofiz tümörlerine ve kafa tabanının birçok lezyonuna burun ve sinüslerin içinden, endoskopla ulaşılabilir; ilk transsfenoidal hipofiz tümörü ameliyatı 1906’da gösterilmiştir (Werner ve ark., 2023). Bu koridorun güvenliği sinüs anatomisinin çeşitliliğini bilmeye bağlıdır.

**Koku çukurunun derinliği (Keros):** Keros’un 1962 kadavra çalışmasından gelen sınıflamada koku çukuru tip I’de 1–3 mm, tip II’de 4–7 mm, tip III’te 8–16 mm derindir. Endoskopik sinüs cerrahisinde kafa tabanının en önemli kısımları fovea ethmoidalis ve kribriform plağın dış lamelidir; tip III bu lamelin yaralanma riskinin en yüksek olduğu tiptir (Almushayti ve ark., 2022).

**Ön etmoidal arter:** göz arterinden çıkar, göz çukurunun iç duvarındaki ön etmoidal delikten geçip ön etmoid hücrelerini aşarak ön kafa çukuruna ulaşır; kafa içi dalları ön çukurun zarlarını besler. Olguların %56,91’inde kafa tabanına gömülü ya da tabanla aynı düzeydedir; tabana ortalama uzaklığı 1,76 mm’dir. Yaralanması BOS sızıntısı, göz arkasında kanama (retro-orbital hematom) ve görme kaybıyla sonuçlanabilir. Arter kesilirse göz çukuruna doğru çekilip hematom yapabileceği için kesilmez; göz çukuru tarafında bipolar koterle yakılır ya da klipslenir (Szczepanek ve ark., 2024).

**Onarım: nazoseptal flep.** Kafa tabanı açıldıktan sonra delik, burun bölmesinin mukozasından hazırlanan ve sfenopalatin arterin arka septal dalıyla beslenen saplı bir **nazoseptal flep** (Hadad-Bassagasteguy flebi) ile kapatılır (Hadad ve ark., 2006; Werner ve ark., 2023). Önceden serbest greftlerle yapılan onarımlarda ameliyat sonrası BOS sızıntısı yaklaşık %20 idi. Bir hipofiz serisinde sızıntı flepte %3, greftte %12,5’ti; kafa tabanı menenjiyomlarında bildirilen sızıntı 2004’te %22’den 2020’de %4’e indi ve bu düşüş flebin yaygınlaşmasıyla eşzamanlıdır. Öğrenme eğrisi belirgindir: tek bir cerrahın ilk 25 hastasında sızıntı %24, son 200 hastasında %4’tü. Yüksek akımlı defektlerde randomize bir çalışmada lomber dren sızıntıyı %21,2’den %8,2’ye indirdi (Werner ve ark., 2023). İlk seride 43 hastanın 2’sinde (%5) sızıntı olmuş ve küçük yağ greftleriyle onarılmıştı (Hadad ve ark., 2006).

**Kondiller ve kraniovertebral bileşke:** Art kafa kondili ortalama 21,3 mm uzunluğunda, 10,5 mm genişliğinde ve 7,4 mm yüksekliğindedir. Kondilin bir kısmının alındığı yaklaşımlarda kesi hipoglossal kanalı aşmamalıdır: aşılırsa bileşkede dengesizlik, XII. sinir ve çıkan farengeal arterin meningeal dalının yaralanması söz konusudur (Thintharua ve Chentanez, 2023).`,
    },
  ],
};
