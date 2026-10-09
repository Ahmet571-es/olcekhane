import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** 2. bölüm: alın kemiği (os frontale): kısımları, işaretleri, frontal sinüs, kemikleşme, klinik ve cerrahi önemi. */
export const alinKemigi: DersBolumu = {
  id: 'alin-kemigi',
  baslik: 'Alın kemiği: alın, kaşlar ve göz çukurlarının tavanı',
  bloklar: [
    {
      tur: 'metin',
      md: `**Alın kemiği** (*os frontale*) kafatasının ön duvarıdır. Alnımızı yapar, kaşlarımızın altındaki sert kenarlarla gözlerimizi yukarıdan korur ve içeri doğru uzanarak iki göz çukuruna tavan olur. Gray’in klasik anatomi kitabı kemiğin biçimini bir kalp midyesi kabuğuna benzetir ve onu iki kısımda anlatır: alnı yapan dik **pul kısmı** (*squama frontalis*) ile göz çukurlarının ve burun boşluğunun tavanına katılan yatay **göz çukuru kısmı** (*pars orbitalis*) (Gray, 1918). Güncel uluslararası terminoloji, iki göz çukuru arasında kalan küçük bölgeyi üçüncü bir kısım olarak ayırır: **burun kısmı** (*pars nasalis*) (FIPAT, 2019).

Alın kemiği tektir ama tam **on iki kemikle** eklem yapar: kama ve kalbur kemikleri, iki yan kafa, iki burun, iki üst çene, iki gözyaşı ve iki elmacık kemiği (Gray, 1918). Alnı yapıp göz çukurlarının ve burun boşluğunun tavanına katılsa da sınıflamada beyin kutusunun sekiz kemiğinden biri sayılır (OpenStax 7.2).`,
    },
    {
      tur: 'sahne',
      baslik: 'Alın kemiği önden',
      aciklama:
        'Alın kemiğini tek başına, önden görüyoruz; turuncu renk yalnızca kemiği tanıtır. Yukarıda alın tümseği, onun altında kaş kemeri, aşağıda göz çukurunun üst kenarı ve dışta elmacık kemiğine uzanan elmacık çıkıntısı işaretli; orta hatta iki kaşın arasında glabella, onun altında burun kemikleriyle birleşilen nasion var. Çift yapılar yalnızca sol yanda işaretlendi. Model sadeleştirildiği için kaş kemeri ve glabella ayrı bir kabarıklık olarak seçilmez, noktalar tipik yerlerini gösterir; supraorbital çentik ya da delik de modelde yoktur. “Bakış” ile kemiği alttan, yandan ya da arkadan (iç yüzünden) görebilirsin.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['alin-kemigi'],
        vurgula: ['alin-kemigi'],
        boya: [{ secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin }],
        noktalar: [
          { nokta: 'alin-tumsegi-sol' },
          { nokta: 'kas-kemeri-sol' },
          { nokta: 'glabella' },
          { nokta: 'supraorbital-kenar-sol' },
          { nokta: 'alin-elmacik-cikintisi-sol' },
          { nokta: 'nasion' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      md: `Alnın dış yüzündeki başlıca işaretler şunlardır:

- **Alın tümsekleri** (*eminentia frontalis*): göz çukurunun üst kenarının yaklaşık 3 cm üstünde, iki yanda birer yuvarlak kabarıklık. Büyüklükleri kişiden kişiye değişir, bazen iki yan eşit değildir; genç kafataslarında özellikle belirgindir (Gray, 1918).
- **Kaş kemerleri** (*arcus superciliaris*): tümseklerin altında uzanan iki kavisli kabarıklık. İç uçlarında belirgindir ve ortada **glabella** denen düz bir kabarıklıkla birbirine bağlanır (Gray, 1918).
- **Göz çukurunun üst kenarı** (*margo supraorbitalis*): kaş kemerinin altındaki kavisli kenar. Dış kısmı keskin ve çıkıktır, gözü bu yönden gelen darbelere karşı korur; iç kısmı yuvarlaktır (Gray, 1918). Kenarın iç üçte biri ile dış üçte ikisinin birleştiği yerde küçük bir **çentik ya da delik** bulunur: **supraorbital çentik ya da delik** (Kabakcı ve Bozkır, 2025); buradan alnın derisini duyuran sinir geçer (OpenStax 7.2).
- **Elmacık çıkıntısı** (*processus zygomaticus ossis frontalis*): üst kenarın dış ucundaki güçlü çıkıntı; elmacık kemiğiyle eklem yapar (Gray, 1918).
- **Nasion**: alın kemiği ile burun kemiklerini birleştiren dikişin (frontonazal dikiş) orta noktası (Gray, 1918).

Kemiğin içinde, kaş kemerlerinin arkasında, iki kemik tablası arasında **frontal sinüs** denen hava boşlukları bulunur. Bebek bu sinüslerle doğmaz: havalanma yaklaşık 2 yaşında başlar, sinüs yaklaşık 8 yaşında grafide görünür hâle gelir ve erken ergenlikte erişkin boyutuna ulaşır. Erişkinlerin yaklaşık %4’ünde frontal sinüs hiç yoktur, yaklaşık %10’unda yalnızca bir yanda gelişmiştir (Hsieh ve ark., 2026). Kaynaklar bu takvimi biraz farklı verir; birine göre sinüs son biçimini ancak 20 yaş dolayında alır (Kalkan ve Kalkan, 2026).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla alın kemiği',
      ogeler: [
        { deger: '12', birim: 'kemik', aciklama: 'Alın kemiğinin eklem yaptığı kemik sayısı.' },
        { deger: '≈3', birim: 'cm', aciklama: 'Alın tümseklerinin göz çukurunun üst kenarından yüksekliği.' },
        { deger: '%4', aciklama: 'Frontal sinüsü hiç olmayan erişkinlerin yaklaşık oranı.' },
        {
          deger: '0,1–4,8',
          birim: 'mm',
          aciklama: 'Frontal sinüsün beyne bakan arka duvarının kalınlığı; alnı yapan ön duvar 4–12 mm’dir.',
        },
      ],
      not: 'Kaynaklar: Gray (1918); Hsieh ve ark. (2026).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Alın kemiği = pul kısmı (alın) + göz çukuru kısmı (göz çukurlarının tavanı) + küçük burun kısmı.**\n\n**Önden işaretler:** alın tümsekleri, kaş kemerleri, glabella, göz çukurunun üst kenarı (supraorbital çentik ya da delik), elmacık çıkıntısı, nasion.\n\n**Frontal sinüs** doğumda yoktur, çocuklukta gelişir. Alın kemiği **on iki kemikle** eklem yapar.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Frontal sinüsün biçimi kişiden kişiye o kadar farklıdır ki bazı araştırmacılar ona **“kafa ve yüz iskeletinin parmak izi”** der (Kalkan ve Kalkan, 2026). Adli tıpta kimliği bilinmeyen birinin grafisi, ölmeden önce çekilmiş grafileriyle frontal sinüsün biçimi üzerinden karşılaştırılabilir. Frontal sinüsü hiç gelişmemiş kişilerde bu yöntem kullanılamaz; o zaman kama kemiğindeki sinüs öteki standart yöntemlerle birlikte kullanılabilir (Assiri ve Alroqi, 2021).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '“Sinüs” sözcüğünün iki anlamı',
      md: 'Anatomide **sinüs** iki ayrı şeyi anlatır. Alın, kama, kalbur ve üst çene kemiklerindeki sinüsler kemiğin içindeki **hava boşluklarıdır**. Kafatasının içinde, kemiklerin iç yüzünde oluk açan sinüsler ise **toplardamar kanallarıdır** (Gray, 1918). Alın kemiğinde ikisi de vardır: önde, kaşların arkasında hava dolu frontal sinüs; içte, orta hattaki oluğunda ise üst sagittal (toplardamar) sinüs.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Pul kısmının dış yüzü.** Orta hattın alt kısmında çoğu zaman **frontal (metopik) dikişin** kalıntısı görülür. Bebeklikte bu dikiş kemiği iki yarıma ayırır; bazı kafataslarında ömür boyu sürer ve orta hat boyunca bregmaya kadar uzanır (Gray, 1918). Terminoloji bu kalıcı dikişi sabit olmayan bir yapı olarak *sutura frontalis persistens* adıyla listeler (FIPAT, 2019); Türkiye’deki sıklık verileri [genel bakış dersinde](/beyin-akademisi/anatomi/kafatasi#kubbe-ve-dikisler) anlatıldı. Kaş kemerleri erkekte daha büyüktür ve ne kadar belirgin oldukları kısmen frontal sinüslerin büyüklüğüne bağlıdır (Gray, 1918).

**Göz çukurunun üst kenarı** tamamen pul kısmından yapılır (Kabakcı ve Bozkır, 2025) ve pul kısmını göz çukuru kısmından ayırır (Gray, 1918); terminolojideki adı *pars frontalis marginis orbitalis*’tir (FIPAT, 2019). Kenardaki **supraorbital çentik ya da delikten** (*incisura supraorbitalis* / *foramen supraorbitale*) supraorbital damarlar ve sinir geçer; çentiğin üst kısmındaki küçük bir delikten diploenin bir toplardamarı supraorbital vene katılır (Gray, 1918). Bunun iç yanında, her kafatasında bulunmayan **frontal çentik ya da delik** (*incisura frontalis* / *foramen frontale*) vardır; bazen supratroklear sinir buradan geçer (FIPAT, 2019).

Kenar dışta elmacık çıkıntısıyla biter. Bu çıkıntıdan yukarı ve geriye uzanan **şakak çizgisi** (*linea temporalis*) üst ve alt şakak çizgilerine ayrılır ve yan kafa kemiğindeki çizgilerle devam eder. Çizginin altında ve arkasında kalan **şakak yüzü** (*facies temporalis ossis frontalis*) şakak çukurunun ön kısmını yapar ve şakak kasına (*musculus temporalis*) başlangıç yeri verir (Gray, 1918; FIPAT, 2019).

**Burun kısmı.** Pürüzlü **burun çentiği** ortada burun kemikleriyle, yanlarda üst çenenin alın çıkıntısı ve gözyaşı kemiğiyle eklem yapar. Çentiğin ortasından aşağı ve öne inen çıkıntı burun kemiklerinin arkasına uzanır ve burun kemerini destekler. Ucundaki **burun dikeni** (*spina nasalis ossis frontalis*; Gray’de eski adıyla “frontal diken”) burun bölmesine katılır: önde burun kemiklerinin kristasıyla, arkada kalbur kemiğinin dik levhasıyla eklem yapar. Dikenin iki yanındaki oluklu küçük yüzler burun boşluğunun tavanına katılır (Gray, 1918; FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Alın kemiğinin işaretleri',
      sutunlar: ['İşaret', 'Latince (TA2)', 'Nerede?', 'Ne geçer, ne tutunur?'],
      satirlar: [
        [
          'Alın tümseği',
          '*Eminentia frontalis* (*tuber frontale*)',
          'Göz çukuru üst kenarının ~3 cm üstü',
          'Büyüklüğü kişiye göre değişir; gençte belirgin',
        ],
        ['Kaş kemeri', '*Arcus superciliaris*', 'Tümseklerin altı; içte belirgin', 'Belirginliği kısmen frontal sinüsün büyüklüğüne bağlı'],
        ['Glabella', '*Glabella*', 'İki kaş kemeri arası, burun kökünün üstü', 'Kaş kemerlerini birleştiren düz kabarıklık'],
        [
          'Göz çukurunun üst kenarı',
          '*Pars frontalis marginis orbitalis* (*margo supraorbitalis*)',
          'Pul kısmı ile göz çukuru kısmının sınırı',
          'Dışta keskin ve çıkık, içte yuvarlak',
        ],
        [
          'Supraorbital çentik ya da delik',
          '*Incisura supraorbitalis* / *foramen supraorbitale*',
          'Üst kenarın iç 1/3’ü ile dış 2/3’ünün birleşimi; yüz orta hattından ~2,3 cm',
          'Supraorbital sinir ve damarlar; çentiğin üstündeki küçük delikten diploe toplardamarı',
        ],
        [
          'Frontal çentik ya da delik',
          '*Incisura frontalis* / *foramen frontale* (sabit değil)',
          'Supraorbital çentiğin iç yanı',
          'Bazen supratroklear sinir',
        ],
        ['Elmacık çıkıntısı', '*Processus zygomaticus ossis frontalis*', 'Üst kenarın dış ucu', 'Elmacık kemiğiyle eklem'],
        [
          'Şakak çizgisi ve şakak yüzü',
          '*Linea temporalis*; *facies temporalis ossis frontalis*',
          'Elmacık çıkıntısından yukarı-geriye',
          'Çizgi üst ve alt dala ayrılır; altı ve arkası şakak kasının başlangıcı',
        ],
        [
          'Burun çentiği ve nasion',
          '*Margo nasalis ossis frontalis*; *nasion*',
          'İki göz çukuru arası; frontonazal dikişin ortası',
          'Burun kemikleri, üst çenenin alın çıkıntısı, gözyaşı kemiği',
        ],
        [
          'Burun dikeni',
          '*Spina nasalis ossis frontalis*',
          'Burun çıkıntısının ucu',
          'Burun bölmesi: burun kemiklerinin kristası ve kalbur kemiğinin dik levhası',
        ],
        [
          'Sagittal oluk ve alın kristası',
          '*Sulcus sinus sagittalis superioris*; *crista frontalis*',
          'İç yüz, orta hat',
          'Üst sagittal sinüs; oluğun kenarlarına ve kristaya beyin orağı (*falx cerebri*)',
        ],
        [
          'Kör delik',
          '*Foramen caecum ossis frontalis*',
          'Kristanın alt ucu; kalbur kemiğiyle tamamlanır',
          'Çoğu zaman kapalı; açıksa burundan üst sagittal sinüse bir toplardamar',
        ],
        ['Granüler çukurcuklar', '*Foveolae granulares*', 'İç yüz, sagittal oluğun iki yanı', 'Araknoid granülasyonlar'],
        ['Gözyaşı bezi çukuru', '*Fossa glandulae lacrimalis*', 'Göz çukuru tavanı, dışta, elmacık çıkıntısının altında', 'Gözyaşı bezi'],
        [
          'Troklear çukur (bazen diken)',
          '*Fovea trochlearis*; *spina trochlearis* (sabit değil)',
          'Göz çukuru tavanı, içte, burun kısmına yakın',
          'Üst eğik göz kasının (*musculus obliquus superior bulbi oculi*) kıkırdak makarası',
        ],
        [
          'Etmoid çentiği',
          '*Incisura ethmoidea*',
          'İki göz çukuru levhası arası',
          'Kalbur kemiğinin kribriform levhası; kenarındaki yarım hücreler etmoid hücrelerini tamamlar',
        ],
        [
          'Ön ve arka etmoid kanalları',
          '— (kalbur kemiğiyle tamamlanır)',
          'Etmoid çentiğinin kenarları; göz çukurunun iç duvarına açılır',
          'Ön: nazosiliyer sinir ve ön etmoid damarlar. Arka: arka etmoid sinir ve damarlar',
        ],
        [
          'Frontal sinüs',
          '*Sinus ossis frontalis*; *septum sinuum frontalium*',
          'İki tabla arası, kaş kemerlerinin arkası',
          'Hava; ağzı (*apertura sinus frontalis*) etmoid çentiğinin önünde, frontonazal kanalla burun boşluğuna açılır',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Kabakcı ve Bozkır (2025). Latince adlar Terminologia Anatomica 2. baskıdandır; Gray’in eski adı farklıysa ayraç içinde verildi.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Pul kısmının iç yüzü.** Orta hattın üst kısmında dikey bir **sagittal oluk** uzanır; oluğun kenarları aşağıda birleşerek **alın kristasını** (*crista frontalis*) yapar. Oluk üst sagittal sinüsü taşır; kenarlarına ve kristaya beyin orağı tutunur. Krista aşağıda küçük bir çentikle biter; bu çentik kalbur kemiğiyle birleşince **kör delik** (*foramen caecum*) olur. Deliğin büyüklüğü kişiden kişiye değişir ve çoğu zaman kapalıdır; açıksa burundan üst sagittal sinüse bir toplardamar geçirir (Gray, 1918). İç yüzde ayrıca orta meningeal damarların ön dalları için çok sayıda küçük oluk ve sagittal oluğun iki yanında araknoid granülasyonların yerleştiği küçük, düzensiz çukurlar görülür (Gray, 1918).

**Göz çukuru kısmı** iki ince üçgen levhadır: göz çukurlarının tavanını yapar ve ortada dörtgen bir boşlukla, **etmoid çentiğiyle** birbirinden ayrılır. Kafatası bir araya getirildiğinde bu çentiği kalbur kemiğinin kribriform levhası doldurur. Levhaların alt (göz çukuru) yüzünde dışta, elmacık çıkıntısının altında sığ **gözyaşı bezi çukuru**, içte burun kısmına yakın **troklear çukur** bulunur; troklear çukura üst eğik göz kasının kıkırdak makarası tutunur, bazen burada küçük bir diken vardır (Gray, 1918). Bu diken terminolojide sabit olmayan bir yapıdır (FIPAT, 2019). Levhaların üst (beyin) yüzü dışbükeydir; frontal lobların kıvrımlarının izlerini ve etmoid damarların meningeal dalları için silik olukları taşır (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Alın kemiği alttan: göz çukurlarının tavanı',
      aciklama:
        'Alın kemiğine alttan bakıyoruz; görüntünün üstü yüz tarafı, ekranın sağı hastanın solu. İki yanda göz çukurlarının tavanını yapan ince üçgen levhalar, ortada kafatasında kalbur kemiğinin doldurduğu dörtgen etmoid çentiği, önde burun bölmesine katılan burun dikeni görülür. Model sadeleştirildiği için gözyaşı bezi çukuru, troklear çukur ve etmoid kanalları ayrı ayrı seçilmez. “Bakış”tan “Arka”yı seçersen kemiğin iç yüzünü ve orta hattaki alın kristasını görürsün.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'alt',
        goster: ['alin-kemigi'],
        vurgula: ['alin-kemigi'],
        boya: [{ secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin }],
        noktalar: [{ nokta: 'orbita-tavani-sol' }, { nokta: 'alin-burun-dikeni' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Etmoid çentiğinin kenarları.** Kenarlardaki **yarım hücreler**, kalbur kemiğinin üst yüzündeki karşılıklarıyla birleşerek etmoid hava hücrelerini tamamlar. Kenarları enine çaprazlayan iki oluk, kalbur kemiğiyle birlikte **ön ve arka etmoid kanallarına** dönüşür ve göz çukurunun iç duvarına açılır: ön kanaldan nazosiliyer sinir ve ön etmoid damarlar, arka kanaldan arka etmoid sinir ve damarlar geçer. Göz çukurunun tavanını önde alın kemiğinin göz çukuru levhası, arkada kama kemiğinin küçük kanadı yapar (Gray, 1918).

**Kenarlar ve yapı.** Pul kısmının kenarı kalın ve güçlü dişlidir: üstte, yan kafa kemiklerinin üstüne oturduğu yerde iç tablası, yanlarda dış tablası eğik kesilmiştir; aşağıda kama kemiğinin büyük kanadıyla eklem yapan üçgen, pürüzlü bir yüzeye devam eder. Göz çukuru levhalarının arka kenarları ince ve dişlidir, kama kemiğinin küçük kanatlarıyla eklem yapar. Pul kısmı ve elmacık çıkıntıları kalındır: iki sert tabla arasında süngerimsi diploe taşır; frontal sinüslerin bulunduğu yerde diploe yoktur. Göz çukuru kısmı ise ince, yarı saydam ve tamamen sert (kompakt) kemikten yapılmıştır (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Alın kemiği hangi kemiklerle eklem yapar?',
      sutunlar: ['Komşu kemik', 'Alın kemiğinin eklem yapan kısmı', 'Not'],
      satirlar: [
        ['Yan kafa kemikleri (2)', 'Pul kısmının arka-üst kenarı', 'Koronal dikiş; alın kemiği burada yan kafa kemiklerinin üstüne oturur'],
        ['Kama kemiği', 'Pul kenarının alt ucundaki üçgen yüz; göz çukuru levhalarının arka kenarları', 'Büyük kanat ve küçük kanatlar'],
        [
          'Kalbur kemiği',
          'Etmoid çentiğinin kenarları; burun dikeni',
          'Kribriform levha çentiği doldurur; dik levha dikenin arkasına dayanır',
        ],
        ['Burun kemikleri (2)', 'Burun çentiğinin ortası; burun dikeni', 'Nasion bu dikişin orta noktasıdır'],
        ['Üst çene kemikleri (2)', 'Burun çentiğinin yanları', 'Üst çenenin alın çıkıntısı'],
        ['Gözyaşı kemikleri (2)', 'Burun çentiğinin yanları', '—'],
        ['Elmacık kemikleri (2)', 'Elmacık çıkıntısı', 'Göz çukurunun üst kenarının dış ucu'],
      ],
      not: 'Kaynak: Gray (1918). Toplam on iki kemik. Alın kemiğinin şakak kemiğinin pul kısmıyla eklem yaptığı kafataslarında kama ile yan kafa kemiği arasındaki dikiş hiç yoktur (Gray, 1918); pterionun bu ve öteki tipleri genel bakış dersinde. Dikişlerin ayrıntıları ve kraniometrik noktalar ünitenin 2. dersinde.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Alın kemiği ve on iki komşusu',
      aciklama:
        'Kafatasına önden ve soldan, eğik bakıyoruz. Turuncu alın kemiği; onunla eklem yapan kemikler kendi renklerinde boyandı: mavi yan kafa kemikleri, kırmızı kama, sarı kalbur, pembe üst çene, deniz yeşili elmacık, koyu bej burun ve gözyaşı kemikleri. Fildişi (doğal) renkte kalan şakak, art kafa, alt çene ve öteki yüz kemikleri genellikle alın kemiğine değmez; yalnızca bazı kafataslarında pterionda alın kemiği şakak kemiğiyle birleşir. Kalbur ve gözyaşı kemikleri göz çukurunun iç duvarında, derinde durur; “Ayrıştır” ile kemikleri birbirinden uzaklaştırınca daha iyi görünürler.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'egik',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['yan-kafa-kemigi'], renk: KEMIK_RENGI.yanKafa },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['kalbur-kemigi'], renk: KEMIK_RENGI.kalbur },
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
          { secici: ['elmacik-kemigi'], renk: KEMIK_RENGI.elmacik },
          { secici: ['burun-kemigi', 'gozyasi-kemigi'], renk: KEMIK_RENGI.kucukYuz },
        ],
        etiketler: [
          { yapi: 'alin-kemigi' },
          { yapi: 'yan-kafa-kemigi-sol', metin: 'Yan kafa kemiği' },
          { yapi: 'kama-kemigi', metin: 'Kama kemiği' },
          { yapi: 'elmacik-kemigi-sol', metin: 'Elmacık kemiği' },
          { yapi: 'ust-cene-kemigi-sol', metin: 'Üst çene' },
          { yapi: 'burun-kemigi-sol', metin: 'Burun kemiği' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemikleşme.** Alın kemiği zar içinde (intramembranöz), iki birincil merkezden kemikleşir: her yarım için bir merkez, fetal hayatın ikinci ayının sonuna doğru her göz çukurunun üst kenarının üstünde belirir. Her merkezden kemikleşme yukarıya doğru pul kısmının o yarısını, geriye doğru da göz çukuru levhasını yapacak biçimde yayılır. Burun dikeni orta hattın iki yanındaki bir çift ikincil merkezden kemikleşir; burun kısmında ve elmacık çıkıntılarında da benzer merkezler belirir. Doğumda kemik, frontal dikişle ayrılmış iki parçadır (Gray, 1918). Gray’in bu dikiş için verdiği kapanma yaşı güncel BT verileriyle uyuşmaz; güncel veriler [genel bakış dersinde](/beyin-akademisi/anatomi/kafatasi?duzey=lisans#kubbe-ve-dikisler).

**Frontal sinüsün gelişimi.** Sinüsün başlangıç yeri gebeliğin 3.–4. ayında mukozada tanınabilir; ama doğumda kemikte sinüs yoktur (Çakur ve ark., 2011). Kaynaklar sonraki takvimi biraz farklı verir. Bir derlemeye göre havalanma yaklaşık 2 yaşında ön etmoid hücrelerinin alın kemiğine uzanmasıyla başlar, sinüs yaklaşık 8 yaşında grafide görünür ve erken ergenlikte erişkin boyutuna ulaşır (Hsieh ve ark., 2026). Bir başka çalışmaya göre sinüs ortalama 6 yaşına kadar alın kemiğine yükselmez; 8 yaşında tepesi göz çukuru tavanı düzeyine, 10 yaşında alın kemiğinin dik kısmına ulaşır (Çakur ve ark., 2011). Bir üçüncü kaynak gelişimin 5–6 yaşında başladığını ve sinüsün yaklaşık 20 yaşında son biçimini aldığını yazar (Kalkan ve Kalkan, 2026). Gray de sinüslerin tam boyuta ancak ergenlikten sonra ulaştığını belirtir (Gray, 1918). Ortak nokta şudur: havalanma erken çocuklukta başlar, sinüs okul çağında görünür hâle gelir ve büyüme ergenlik boyunca sürer.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Frontal sinüsün anatomisi',
      md: `İki frontal sinüs, kafatasının iki tablası arasında geriye, yukarıya ve dışa doğru değişken uzaklıklara uzanan düzensiz boşluklardır. Aralarındaki ince kemik bölme çoğu zaman bir yana kayar; bu yüzden sinüsler nadiren simetriktir. Erkeklerde daha büyüktür. Mukozayla döşelidir ve her biri **frontonazal kanal** denen bir geçitle aynı taraftaki burun boşluğuna açılır (Gray, 1918). Gray’e göre kafataslarının yarısından biraz fazlasında bu geçit yukarıda gerçek bir kanal olarak sinüse devam eder (Gray, 1918). Sinüsün hacmi 0 ile 37 cm³ arasında değişir, ortalaması 10 cm³ dolayındadır (Çakur ve ark., 2011).

**Duvarlar:** sinüsün tabanı göz çukurunun tavanı, arka duvarı ön kafa çukurudur; ön duvar alnı ve glabellayı yapar. Ön duvar görece kalındır (4–12 mm), arka duvar ise yalnızca 0,1–4,8 mm’dir. Sinüsün boşaldığı yol kum saati biçimindedir; en dar yeri olan asıl ağız 3–8 mm çaplıdır (Hsieh ve ark., 2026).

**Yokluk ve küçüklük:** erişkinlerin yaklaşık %4’ünde sinüs yoktur, %5’inde yalnızca küçük hava hücreleri, %10’unda tek taraflı bir sinüs vardır (Hsieh ve ark., 2026). Kalıcı metopik dikişi olanlarda frontal sinüsler küçüktür ya da hiç yoktur (Çakur ve ark., 2011). Toplumlara göre sıklıklar uzman düzeyindeki tabloda.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **On iki kemik:** kama, kalbur, iki yan kafa, iki burun, iki üst çene, iki gözyaşı, iki elmacık (Gray, 1918).
- **Zar içi kemikleşme, iki birincil merkez** (2. ayın sonu); doğumda kemik iki yarımdır (Gray, 1918).
- **Supraorbital çentik ya da delik:** üst kenarın iç 1/3’ü ile dış 2/3’ünün birleşimi; supraorbital sinir ve damarlar (Kabakcı ve Bozkır, 2025; Gray, 1918).
- **Etmoid kanalları:** ön kanal → nazosiliyer sinir ve ön etmoid damarlar; arka kanal → arka etmoid sinir ve damarlar (Gray, 1918).
- **Göz çukuru tavanı:** önde alın kemiğinin göz çukuru levhası, arkada kamanın küçük kanadı; etmoid çentiğini kribriform levha doldurur (Gray, 1918).
- **Frontal sinüs:** doğumda yok; tabanı göz çukuru tavanı, arka duvarı ön kafa çukuru; arka duvar çok ince (0,1–4,8 mm) (Hsieh ve ark., 2026).
- **Kör delik** çoğu zaman kapalıdır; açıksa burundan üst sagittal sinüse bir toplardamar geçirir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Supraorbital çentik mi, delik mi?',
      md: `Supraorbital sinirin çıktığı yer bazı kafataslarında açık bir **çentik**, bazılarında kemikle çevrili bir **delik**tir. Adana’da yapılan bir çalışmada 28 kadavrada çıkışların %57,1’i delik, %42,9’u çentikti; 38 kuru kafatasında ise oran tersineydi: %47,4 delik, %52,6 çentik (Kabakcı ve Bozkır, 2025). Sri Lanka’da 58 kafatasında (116 taraf) çentik %72,4, delik %27,6 oranında bulundu; kafataslarının %55,1’inde iki yanda çentik, %8,6’sında iki yanda delik, %36,3’ünde bir yanda çentik öbür yanda delik vardı ve %18,9’unda ek bir supraorbital delik görüldü (Nanayakkara ve ark., 2018). Bosna-Hersek’te iki taraflı çentik %58,3 oranında bildirilmiştir (Kabakcı ve Bozkır, 2025). 1955’te terminolojiye yazılan “delik çentikten çok daha sıktır” notu (FIPAT, 2019) güncel verilerle desteklenmez; oran topluma ve incelenen örneğin türüne göre değişir.

**Neden önemli?** Supraorbital sinir duyu siniridir: üst göz kapağından alına ve kafa derisinde lambdoid dikişe kadar uzanan geniş bir alanı duyurur, bu yüzden bölgesel sinir bloğu için iyi bir hedeftir (Nanayakkara ve ark., 2018). Çıkış yeri kadavralarda yüz orta hattının ortalama 2,31 cm (1,5–4,3 cm) dışındadır (Kabakcı ve Bozkır, 2025); Sri Lanka serisinin erkek kafataslarında bu uzaklık 23,64 mm’dir (Nanayakkara ve ark., 2018). Polonya’da 50 yarım baş ve 25 kafatasında üst kenarda tek bir geçiş, yaş örneklerin %80’inde ve kuru kafatası göz çukurlarının %78’inde görüldü; frontal sinir supraorbital ve supratroklear sinirlere olguların %58’inde göz çukurunun arka yarısında ayrılıyordu (Haładaj ve ark., 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kırıklar ve Pott’un kabarık tümörü',
      md: `Alın kemiği kırıkları bütün travmatik yüz kırıklarının yaklaşık %5–15’ini oluşturur. Kemik frontal sinüse, beyne ve göz çukuruna komşu olduğu için bir kırık ya da enfeksiyon BOS sızıntısına, göz çukuru yaralanmalarına ve kafa içi tutuluma yol açabilir (Singh ve Varacallo, 2025). Frontal sinüs kırıklarında mukosel, sinüzit ve kafa içi enfeksiyon gibi sorunların çoğu aylar, hatta yıllar sonra ortaya çıkabilir (Hsieh ve ark., 2026).

**Pott’un kabarık tümörü**, frontal sinüsün ön duvarında kemik iltihabıyla (osteomiyelit) birlikte görülen, kemik zarının altında biriken bir apsedir; adındaki “tümör” bir ur değil, şişlik anlamındadır. İlk kez 1775’te Sir Percivall Pott tarafından frontal sinüzitin bir komplikasyonu olarak tanımlandı. Zaman zaman menenjit, epidural apse, subdural ampiyem, beyin apsesi ve sert zar sinüslerinin pıhtılı iltihabı (tromboflebit) gibi ağır kafa içi sorunlara yol açar. Gençlerde daha sık görülür; bunun nedeni olarak sinüsün henüz tam gelişmemiş olması ya da ergenlikte diploe toplardamarlarındaki artmış kan akımı gösterilir (Pendolino ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Görüntülemede alın kemiği',
      md: `**Hiperostozis frontalis interna:** alın kemiğinin iç tablasının beyne bakan yüzünde aşırı kemik yapımıdır. Genel nüfusun %5–12’sinde bildirilir ve en sık menopoz sonrası kadınlarda görülür. Düzensiz kalınlaşma çoğunlukla alın kemiğiyle sınırlıdır ama yan kafa ve şakak kemiklerinin ön kısımlarına uzanabilir (Gökçe ve Beyhan, 2025).

**Frontal sinüs yokluğu (aplazi):** BT’de alın kemiğinde hiç havalanma olmaması ve göz çukurunun üst kenarının üstüne uzanan etmoid hücresi bulunmaması diye tanımlanır (Assiri ve Alroqi, 2021). Bir yandaki sinüs gelişmemişse öbür yandaki sinüs büyüyüp orta hattı geçebilir; görüntü iki sinüs varmış gibi yanıltıcı olur (Çakur ve ark., 2011).

**Kırık:** frontal sinüs kırıklarının tanısında altın standart 0,625 mm’lik ince kesitli BT’dir (Hsieh ve ark., 2026). Karar için ön duvar, arka duvar ile sert zar ve sinüsün boşalma yolu ayrı ayrı değerlendirilir (uzman düzeyinde ayrıntılı).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Alnında şişlik olan genç',
      oyku: `16 yaşında bir erkek, bir haftadır süren burun tıkanıklığı ve alın ağrısından sonra alnının ortasında giderek büyüyen, yumuşak, ağrılı bir şişlik ve ateşle başvuruyor. Şişliğin üstündeki deri kızarık ve sıcak. Bilinci açık, nörolojik muayenesi normal, ense sertliği yok.`,
      soru: 'Şişlik hangi kemik yapıdan kaynaklanıyor olabilir, bu yaşta neden daha sık görülür ve neden ciddiye alınmalıdır?',
      cozum: `**Olası tablo:** Frontal sinüzitin ardından alında ortaya çıkan, ateşli, yumuşak şişlik **Pott’un kabarık tümörünü** düşündürür: frontal sinüsün ön duvarında kemik iltihabı (osteomiyelit) ve kemik zarının altında apse (Pendolino ve ark., 2020).

**Anatomi:** Frontal sinüs alın kemiğinin iki tablası arasındadır; ön duvarı alnı yapar, arka duvarı ön kafa çukuruna bakar ve 0,1–4,8 mm kadar incedir (Hsieh ve ark., 2026). Sinüsün bulunduğu yerde diploe yoktur (Gray, 1918). Enfeksiyon ön duvardan dışarı taşınca alında şişlik, arka duvarı aşınca kafa içi sorunlar ortaya çıkabilir.

**Neden gençlerde?** Sinüsün henüz tam gelişmemiş olması ya da ergenlikte diploe toplardamarlarındaki kan akımının artması öne sürülür (Pendolino ve ark., 2020); frontal sinüs erişkin boyutuna ancak erken ergenlikte ulaşır (Hsieh ve ark., 2026).

**Neden ciddi?** Tablo menenjit, epidural apse, subdural ampiyem, beyin apsesi ve sert zar sinüslerinin tromboflebitiyle ilerleyebilir (Pendolino ve ark., 2020). Bu yüzden alındaki şişliğin yalnızca deriyle ilgili olmadığı akılda tutulmalı, kafa içine yayılım düşünülmelidir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Frontal sinüs kırığında karar: üç soru',
      md: `Güncel bir derleme tedavi kararını üç unsura dayandırır: **ön duvar**, **arka duvar ile sert zarın bütünlüğü** (BOS sızıntısı dahil) ve **burun-frontal boşalma yolu** (Hsieh ve ark., 2026).

- **Ön duvar:** yer değiştirme hafif (<4 mm), orta (4–6 mm) ve ağır (>6 mm) diye ayrılır. Hafif yer değiştirmede izlem yeterlidir: Kim ve arkadaşlarının 51 hastalık serisinde hafif yer değiştirmiş 44 kırığın hiçbirinde kontur bozukluğu gelişmedi (aktaran Hsieh ve ark., 2026). Orta yer değiştirmede bekleme önerilir; yazarların deneyiminde hastaların yaklaşık %75’i sonunda ameliyattan vazgeçer.
- **Arka duvar:** klasik ameliyat ölçütü 2 mm’den fazla ya da duvar kalınlığından fazla yer değiştirmedir; ama bu eşikler güncel kanıtla güçlü biçimde desteklenmez. BOS sızıntısı varsa kafa tabanı önlemleriyle 5–7 gün izlenir, çünkü sızıntıların çoğu kendiliğinden durur. Yaygın yer değiştirme, parçalanma ve kafa içinde hava (pnömosefali) olan ağır yaralanmalar ise neredeyse her zaman açık onarım ve sinüsün **kranializasyonunu** gerektirir.
- **Boşalma yolu:** eskiden bu yolun hasarının mutlaka mukosele yol açacağı düşünülür ve sinüs kapatılırdı (obliterasyon). Güncel verilere göre hafif-orta hasarlı sinüslerin %80–90’ı tutucu tedaviyle yeniden havalanır; yazarlar artık rutin obliterasyon yapmıyor, sinüsün işlevini koruyan sinüsotomiyi yeğliyor.

**Teknik ayrıntılar:** kranializasyonda sinüsün burunla bağlantısı katman katman kapatılır: mukoza ters çevrilerek yol tıkanır, üstüne küçük bir şakak kası grefti ve yaklaşık 5 × 5 mm’lik bir kemik kama konur. Ön duvarın kaldırılıp sinüsün yok edildiği **Riedel ablasyonu** yalnızca yaygın osteomiyelitte ya da implant enfeksiyonunda yapılır. Burundan yapılan endoskopik **Draf III** ameliyatında diseksiyonun arka sınırı ilk koku nöronudur. Açık cerrahide supraorbital ve supratroklear damar-sinir demetleri korunmalıdır. Sinüs ağzının önünde agger nasi hücresi, arkasında ön etmoid arter, dışında göz çukuru bulunur (Hsieh ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Frontal sinüs yokluğu: toplumlara göre',
      sutunlar: ['Toplum ve örnek', 'İki taraflı yokluk', 'Tek taraflı yokluk', 'Kaynak'],
      satirlar: [
        ['Türkiye, 410 kişi (dental hacimsel tomografi)', '%0,73', '%1,22', 'Çakur ve ark. (2011)'],
        ['Türkiye, 1200 olgu (aktarım)', 'Kadın %5,1; erkek %1,3', 'Kadın %5,9; erkek %3,8', 'Assiri ve Alroqi (2021)'],
        ['Umman, 610 hasta, 1220 sinüs (BT)', '%2', 'Sağda %2,1; solda %1,8 (taraf bazında)', 'Al Hatmi ve ark. (2023)'],
        ['Suudi Arabistan, 449 hasta (BT)', '%3,3', 'Sağda %5,1; solda %1,3', 'Assiri ve Alroqi (2021)'],
        ['Çeşitli toplumlar', '%3–4 ile %10 arası', '—', 'Çakur ve ark. (2011)'],
        [
          'Kanada İnuitleri; Alaska yerlileri (aktarım)',
          'Erkek %43, kadın %40; erkek %25, kadın %36',
          '—',
          'Çakur ve ark. (2011); Al Hatmi ve ark. (2023)',
        ],
      ],
      not: 'Oranlar yönteme, örneğin türüne ve tanıma göre değişir. Çakur ve arkadaşlarının çalışmasını aktaran başka bir makale iki taraflı yokluğu %0,37 olarak verir (Assiri ve Alroqi, 2021); Türkiye için tek bir sayı yerine %1’in altından kadınlarda %5’e kadar uzanan bir aralık düşünmek daha doğrudur. Arktik toplumlardaki yüksek oranlar aşırı soğuk iklimin etkisine bağlanmıştır; bu bir varsayımdır (Al Hatmi ve ark., 2023).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Ameliyatta alın kemiğinin tuzakları',
      md: `- **Sinüsün sınırları dışarıdan kestirilemez.** Kaş kemerlerinin belirginliği kısmen sinüsün büyüklüğüne bağlıdır ama belirgin kemerler bazen küçük sinüslerle birliktedir (Gray, 1918). Çok büyük sinüsler göz çukuru kısmına doğru geriye uzanabilir (Gray, 1918). Tek taraflı yoklukta karşı sinüsün orta hattı geçmesi iki sinüs varmış izlenimi verir (Çakur ve ark., 2011). Frontal sinüsün çeşitliliği pterional ve supraorbital kraniotomi yapan beyin cerrahları için kritik olabilir (Çakur ve ark., 2011).
- **Göz çukuru tavanı incedir.** Göz çukuru kısmı ince, yarı saydam ve tamamen sert kemik olduğu için göz çukurundan sokulan aletler bu yoldan kolayca kafa boşluğuna girebilir (Gray, 1918).
- **Halo pinleri tam öne konmaz**, çünkü orada frontal sinüs ve supraorbital sinir bulunur (Bauer ve ark., 2024).
- **Supraorbital sinirin derin dalı** alnın yan kısmında kafa derisi aponevrozu (*galea aponeurotica*) ile kemik zarı arasında seyreder ve alın-yan kafa bölgesinin derisini duyurur (Haładaj ve ark., 2019).
- **Kör delik** çoğu zaman kapalıdır; açık kaldığında burundan üst sagittal sinüse bir toplardamar geçirir (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Tanımlar, adli tıp ve açık sorular',
      md: `**Glabella’nın üç anlamı.** Bu sözcük kimi zaman kaş kemerlerinin üstündeki alan, kimi zaman kaş kemerleri ile alın tümseği arasındaki alan, kimi zaman da burun kökünün üstünde iki kaş kemeri arasındaki alan için kullanılmıştır; resmî terminoloji son anlamı benimser (FIPAT, 2019). Ölçüm çalışmalarını karşılaştırırken hangi tanımın kullanıldığına bakmak gerekir.

**Sinüs ne zaman başlar?** Gray’in döneminde bile tartışmalıydı: genel görüş frontal sinüsün gelişiminin birinci yılın sonunda ya da ikinci yılın başında başladığı yönündeydi, Onodi’nin araştırmaları ise başlangıcı doğuma yerleştiriyordu (Gray, 1918). Güncel kaynaklar da takvimi farklı verir (yukarıda lisans düzeyinde).

**Cinsiyet tahmini.** Adli antropolojide yaygın Walker yönteminin beş özelliğinden ikisi alın kemiğindedir: glabella ve göz çukurunun üst kenarı; öbürleri ense kristası, mastoid çıkıntı ve çene çıkıntısıdır. Her özellik 1’den (en kadınsı) 5’e (en erkeksi) puanlanır (Houston ve ark., 2025). İtalyan bir örnekte gözlemciler arası tam uyum glabellada yalnızca %65,5’ti (Cappella ve ark., 2022). Frontal sinüs tek başına cinsiyeti yaklaşık %68,3 doğrulukla ayırmıştır (iki çalışmanın aktarımı; Wang ve ark., 2024); Gaziantep’te 150 BT’de sinüs ölçüleri alt çene dalının ölçüleriyle birleşince doğruluk %86,5’e çıktı ve sinüsün derinliği yaşla arttı (Kalkan ve Kalkan, 2026). Yani frontal sinüs tek başına güçlü bir cinsiyet göstergesi değildir.

**Sinüs yokluğu ve yüz.** Antalya’da 3000 paranazal sinüs BT’si taranarak frontal ve/veya maksiller sinüs hipoplazisi ya da aplazisi olan 117 erişkin bulundu; 46’sında tek taraflı, 55’inde iki taraflı frontal sinüs değişkenliği vardı. Frontal sinüsü gelişmemiş gruplarda göz çukuru ve üst yüz genişlikleri grup olarak biraz daha küçüktü; ama yazarlara göre bu milimetrik farklar tek bir hastada radyolojik yorumu ya da cerrahi kararı kendi başına değiştirmez (Taga Şenirli ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Kazadan sonra alında çökme',
      oyku: `34 yaşında bir kadın, emniyet kemeri takılı değilken yaptığı trafik kazasında alnını direksiyona çarpmış. Bilinci açık. Alnın ortasında şişlik ve küçük bir kesi var; burnundan berrak sıvı gelmiyor. İnce kesitli BT’de frontal sinüsün ön duvarında 3 mm çökme görülüyor; arka duvar sağlam, kafa içinde hava yok, sinüsün boşalma yolu açık.`,
      soru: 'Bu kırık güncel yaklaşıma göre nasıl değerlendirilir ve hangi tedavi seçeneği kanıta en uygundur?',
      cozum: `**Değerlendirme üç unsura göre yapılır:** ön duvar, arka duvar ile sert zarın bütünlüğü ve boşalma yolu (Hsieh ve ark., 2026).

- **Ön duvar:** 3 mm çökme hafif (<4 mm) gruptadır. Bir seride hafif yer değiştirmiş 44 ön duvar kırığının hiçbirinde kontur bozukluğu gelişmemiştir; bu nedenle izlem yeterlidir (Hsieh ve ark., 2026).
- **Arka duvar ve sert zar:** sağlam; BOS sızıntısı ve kafa içinde hava yok. Açık onarım ya da kranializasyon gerekmez. Arka duvar yaygın yer değiştirmiş, parçalı ve pnömosefaliyle birlikte olsaydı karar neredeyse her zaman açık onarım ve kranializasyon olurdu (Hsieh ve ark., 2026).
- **Boşalma yolu:** açık. Hasar görmüş olsaydı bile hafif-orta hasarlı sinüslerin %80–90’ı tutucu tedaviyle yeniden havalanır; rutin obliterasyon artık önerilmiyor (Hsieh ve ark., 2026).

**İzlem neden sürmeli?** Frontal sinüs kırıklarında mukosel, sinüzit ve kafa içi enfeksiyon gibi sorunların çoğu aylar ya da yıllar sonra ortaya çıkabilir (Hsieh ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
