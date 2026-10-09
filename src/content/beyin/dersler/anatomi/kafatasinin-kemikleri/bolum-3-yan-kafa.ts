import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** 3. bölüm: yan kafa kemikleri (ossa parietalia): yüzler, kenarlar, köşeler, delikler, oluklar ve çeşitlilik. */
export const yanKafaKemikleri: DersBolumu = {
  id: 'yan-kafa-kemikleri',
  baslik: 'Yan kafa kemikleri: kafatasının tavanı ve yan duvarları',
  bloklar: [
    {
      tur: 'metin',
      md: `Başının tepesine elini koyduğunda dokunduğun kemiğin çoğu **yan kafa kemikleridir** (*os parietale*). Sağda ve solda birer tane vardır; ikisi tepede birleşerek kafatasının yan duvarlarını ve tavanını yapar (Gray, 1918).

Her yan kafa kemiği kabaca dörtgen, hafifçe kubbeli bir levhadır: **iki yüzü** (dış ve iç), **dört kenarı** ve **dört köşesi** vardır (Gray, 1918). Kenarları komşu kemiklerle dikiş yapar; alt kenarı hem şakak hem kama kemiğine değdiği için yan kafa kemiği toplam **beş kemikle** eklem yapar: karşı taraftaki yan kafa kemiği, art kafa, alın, şakak ve kama kemikleri (Gray, 1918). Dört köşenin her biri kafatasının önemli bir buluşma noktasına denk gelir: önde-üstteki **alın köşesi** bregmaya, arkada-üstteki **art kafa köşesi** lambdaya, önde-alttaki **kama köşesi** pteriona, arkada-alttaki **mastoid köşesi** asteriona (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Sol yan kafa kemiği dışarıdan',
      aciklama:
        'Sol yan kafa kemiğini tek başına, soldan (dış yüzünden) görüyoruz; ön taraf solda, mavi renk yalnızca kemiği tanıtır. Ortadaki en kabarık bölge yan kafa tümseğidir; model sadeleştirildiği için tümseğin tek bir tepesi yoktur, nokta en kabarık bölgeyi gösterir. Köşelerden önde-alttaki pteriona, arkada-alttaki asteriona denk gelir; önde-üstteki bregma köşesi yukarıdan, arkada-üstteki lambda köşesi arkadan bakınca görünür. Şakak çizgileri ve küçük yan kafa deliği modelde seçilmez. “Bakış” ile kemiği arkadan ya da içten görebilirsin.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['yan-kafa-kemigi-sol'],
        vurgula: ['yan-kafa-kemigi-sol'],
        boya: [{ secici: ['yan-kafa-kemigi-sol'], renk: KEMIK_RENGI.yanKafa }],
        noktalar: [{ nokta: 'yan-kafa-tumsegi-sol' }, { nokta: 'yan-kafa-kama-kosesi-sol' }, { nokta: 'yan-kafa-mastoid-kosesi-sol' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      md: `Yan kafa kemiğinin dış yüzünde şu işaretler vardır:

- **Yan kafa tümseği** (*eminentia parietalis*): dış yüzün ortasına yakın en kabarık bölge. Kemikleşme bu noktadan başlar (Gray, 1918).
- **Şakak çizgileri** (*linea temporalis superior* ve *inferior*): kemiğin ortasından kavis çizerek geçen iki çizgi. Üsttekine şakak kasını örten zar (şakak fasyası) tutunur; alttaki, şakak kasının başladığı alanın üst sınırıdır (Gray, 1918).
- **Yan kafa deliği** (*foramen parietale*): arka kısımda, tepedeki dikişe yakın küçük bir delik. Kafatası içindeki büyük toplardamar kanalına, üst sagittal sinüse giden bir toplardamarı geçirir (Gray, 1918). Her kafatasında bulunmaz: çapı genellikle 1–2 mm’dir ve insanların %60–70’inde vardır (Gökçe ve Beyhan, 2025). İki yandaki delik ile aralarından geçen sagittal dikiş birlikte Yunanca **obelos** (÷) işaretine benzetilir; dikişin delikler hizasındaki noktasına bu yüzden **obelion** denir (Sağlam ve ark., 2025; Gray, 1918).

İç yüzde, beyin kıvrımlarının bıraktığı çukurlukların yanında **orta meningeal damarların** dallarının açtığı, ağaç dalı gibi ayrılan oluklar görülür. Üst kenar boyunca uzanan sığ oluk, karşı taraftaki kemiğin oluğuyla birleşerek üst sagittal sinüsün yatağını yapar (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Yukarıdan: kafatasının tavanı',
      aciklama:
        'Kafatasına yukarıdan bakıyoruz; görüntünün üstü yüz tarafı. İki mavi yan kafa kemiği tepede, orta hattaki sagittal dikişte birleşir ve tavanın büyük kısmını yapar. Önde turuncu alın kemiğiyle koronal dikişte, arkada mor art kafa kemiğiyle lambdoid dikişte buluşurlar; koronal ve sagittal dikişlerin kesiştiği nokta bregmadır. “Ayrıştır” ile kemikleri birbirinden uzaklaştırabilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'ust',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['yan-kafa-kemigi'], renk: KEMIK_RENGI.yanKafa },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
        ],
        etiketler: [
          { yapi: 'yan-kafa-kemigi-sol', metin: 'Sol yan kafa kemiği' },
          { yapi: 'yan-kafa-kemigi-sag', metin: 'Sağ yan kafa kemiği' },
          { yapi: 'alin-kemigi' },
        ],
        noktalar: [{ nokta: 'yan-kafa-alin-kosesi-sol', metin: 'Bregma' }],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla yan kafa kemiği',
      ogeler: [
        { deger: '5', birim: 'kemik', aciklama: 'Eklem yaptığı kemikler: karşı yan kafa, alın, art kafa, şakak ve kama kemikleri.' },
        { deger: '4', birim: 'köşe', aciklama: 'Bregma, lambda, pterion ve asterion bölgelerine denk gelen köşeler.' },
        { deger: '%60–70', aciklama: 'Küçük yan kafa deliği bulunan insanların oranı; deliğin çapı genellikle 1–2 mm.' },
        { deger: '8.', birim: 'hafta', aciklama: 'Fetüste yan kafa kemiğinin tek kemikleşme merkezinin belirdiği zaman.' },
      ],
      not: 'Kaynaklar: Gray (1918); Gökçe ve Beyhan (2025); Kilic Safak ve ark. (2025).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Yan kafa kemiği: çift, dörtgen; 2 yüz, 4 kenar, 4 köşe.**\n\n**Köşeler:** alın köşesi → bregma, art kafa köşesi → lambda, kama köşesi → pterion, mastoid köşesi → asterion.\n\n**Eklem yaptığı 5 kemik:** karşı yan kafa, alın, art kafa, şakak, kama.\n\n**Dış yüz:** yan kafa tümseği, şakak çizgileri, her kafatasında olmayan yan kafa deliği. **İç yüz:** orta meningeal damar olukları, sagittal oluğun yarısı.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Yan kafa kemiği tek bir noktadan, ortasındaki tümsekten kemikleşmeye başlar ve kemikleşme oradan ışın gibi dışa yayılır. Bu yüzden kemiğin en son oluşan yerleri köşeleridir; bebekteki **bıngıldaklar** da tam bu köşelerde bulunur (Gray, 1918). Bregma bölgesi fetüste ve doğumdan sonra yaklaşık bir buçuk yıl zar hâlindedir: bu **ön bıngıldaktır**. Lambda bölgesi de fetüste zar hâlindedir: **arka bıngıldak** (Gray, 1918).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dış yüz.** Gray’in kitabında *tuber parietale* adıyla geçen **yan kafa tümseği** bugün *eminentia parietalis* adını taşır (FIPAT, 2019). Kemiğin ortasından geçen iki kavisli çizgiden **üst şakak çizgisine** şakak fasyası tutunur; **alt şakak çizgisi** şakak kasının başladığı alanın üst sınırını gösterir (Gray, 1918). Terminoloji de üst çizgiyi “fasya çizgisi” (*linea temporalis fascialis*) ile ilişkilendirir (FIPAT, 2019). Çizgilerin üstündeki kemiği kafa derisinin aponevrozu (*galea aponeurotica*) örter; altındaki kısım şakak çukurunun bir parçasıdır ve şakak kasına tutunma yeri verir (Gray, 1918).

**Yan kafa deliği** kemiğin arka kısmında, sagittal kenara yakındır; üst sagittal sinüse giden bir toplardamarı ve bazen art kafa atardamarının (*arteria occipitalis*) küçük bir dalını geçirir. Her kafatasında yoktur ve büyüklüğü çok değişir (Gray, 1918); çoğu zaman bir ya da iki yanda bulunmaz. Kafatası bu deliklerin çevresinde çoğu zaman biraz basıktır (Gray, 1918). Delikten geçen kapakçıksız **parietal emisser ven** (*emissarium parietale*) kafa derisinin toplardamarlarını üst sagittal sinüse bağlar (Sağlam ve ark., 2025; FIPAT, 2019).

**İç yüz.** Beyin kıvrımlarına karşılık gelen çukurlukların yanında **orta meningeal damarların** dalları için çok sayıda oluk (*sulcus arteriae meningeae mediae*) vardır; bu oluklar kama köşesinden ve pul kenarının orta-arka kısmından yukarı ve geriye uzanır (Gray, 1918; FIPAT, 2019). Üst kenar boyunca uzanan sığ oluk, karşı kemiğinkiyle birlikte üst sagittal sinüsün **sagittal oluğunu** yapar; oluğun kenarlarına beyin orağı (*falx cerebri*) tutunur. Oluğun yakınında, en çok yaşlıların kafataslarında belirgin olan, **araknoid granülasyonların** (Pacchioni cisimcikleri) yerleştiği çukurlar bulunur (Gray, 1918); bugünkü adları **granüler çukurcuklardır** (*foveolae granulares*) (FIPAT, 2019). Mastoid köşenin iç yüzündeki geniş, sığ oluk transvers sinüsün bir bölümünü taşır (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yan kafa kemiğinin yüzlerindeki işaretler',
      sutunlar: ['İşaret', 'Latince (TA2)', 'Nerede?', 'Ne geçer, ne tutunur?'],
      satirlar: [
        ['Yan kafa tümseği', '*Eminentia parietalis* (*tuber parietale*)', 'Dış yüzün ortasına yakın', 'Kemikleşmenin başladığı nokta'],
        ['Üst şakak çizgisi', '*Linea temporalis superior*', 'Dış yüz, kavisli', 'Şakak fasyası'],
        ['Alt şakak çizgisi', '*Linea temporalis inferior*', 'Üst çizginin altı', 'Şakak kasının başladığı alanın üst sınırı'],
        [
          'Yan kafa deliği',
          '*Foramen parietale*',
          'Arka kısım; sagittal dikişe ~7 mm, lambdanın ~3,5 cm önü',
          'Parietal emisser ven (*emissarium parietale*); bazen art kafa atardamarının küçük bir dalı',
        ],
        ['Obelion', '—', 'Sagittal dikişte deliklerin hizası', 'Kraniometrik nokta'],
        [
          'Orta meningeal arter olukları',
          '*Sulcus arteriae meningeae mediae*',
          'İç yüz; kama köşesinden ve pul kenarından yukarı-geriye',
          'Orta meningeal damarlar',
        ],
        [
          'Sagittal oluk (yarısı)',
          '*Sulcus sinus sagittalis superioris*',
          'İç yüz, üst kenar boyunca',
          'Üst sagittal sinüs; kenarlarına beyin orağı',
        ],
        ['Granüler çukurcuklar', '*Foveolae granulares*', 'Sagittal oluğun yakını', 'Araknoid granülasyonlar'],
        ['Transvers sinüs oluğunun bir bölümü', '—', 'Mastoid köşenin iç yüzü', 'Transvers sinüs'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Sağlam ve ark. (2025); Kilic Safak ve ark. (2025).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yan kafa kemiğinin kenarları ve köşeleri',
      sutunlar: ['Kenar ya da köşe', 'Latince (TA2)', 'Özelliği', 'Komşusu, dikişi ya da noktası'],
      satirlar: [
        [
          'Sagittal kenar',
          '*Margo sagittalis ossis parietalis*',
          'En uzun ve en kalın kenar; dişli',
          'Karşı yan kafa kemiği: sagittal dikiş',
        ],
        [
          'Alın kenarı',
          '*Margo frontalis ossis parietalis*',
          'Derin dişli; üstte dış, altta iç tablası eğik kesilmiş',
          'Alın kemiği: koronal dikişin yarısı',
        ],
        ['Art kafa kenarı', '*Margo occipitalis ossis parietalis*', 'Derin dişli', 'Art kafa kemiği: lambdoid dikişin yarısı'],
        [
          'Pul kenarı, ön kısım',
          '*Margo squamosus ossis parietalis*',
          'İnce ve sivri; dış tablası eğik kesilmiş',
          'Kama kemiğinin büyük kanadının ucu bu kenarın üstüne biner',
        ],
        [
          'Pul kenarı, orta kısım',
          '*Margo squamosus ossis parietalis*',
          'Kavisli; dış tablası eğik kesilmiş',
          'Şakak kemiğinin pul kısmı bu kenarın üstüne biner (skuamöz dikiş)',
        ],
        ['Pul kenarı, arka kısım', '*Margo squamosus ossis parietalis*', 'Kalın ve dişli', 'Şakak kemiğinin mastoid kısmı'],
        [
          'Alın köşesi',
          '*Angulus frontalis ossis parietalis*',
          'Neredeyse dik açı',
          'Bregma; fetüste ve doğumdan sonra ~1,5 yıl ön bıngıldak',
        ],
        [
          'Kama köşesi',
          '*Angulus sphenoideus ossis parietalis*',
          'İnce ve sivri; iç yüzünde orta meningeal arterin ön dalları için derin oluk, bazen kanal',
          'Alın kemiği ile kamanın büyük kanadı arasına girer; pterion bölgesi',
        ],
        ['Art kafa köşesi', '*Angulus occipitalis ossis parietalis*', 'Yuvarlak', 'Lambda; fetüste arka bıngıldak'],
        [
          'Mastoid köşesi',
          '*Angulus mastoideus ossis parietalis*',
          'Kesik uçlu; iç yüzünde transvers sinüs oluğunun bir bölümü',
          'Art kafa ve şakak kemiğinin mastoid kısmı; asterion',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019).',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sol yan kafa kemiği içeriden',
      aciklama:
        'Sol yan kafa kemiğine içeriden, beyne bakan yüzünden bakıyoruz; ön taraf (alın yönü) bu kez görüntünün sağında. Kama köşesinden yukarı ve geriye doğru giden oluk, orta meningeal arterin ön dalının oluğudur; model sadeleştirildiği için yalnızca bu oluk seçilir, dallanmaları görünmez. Üst kenar boyunca sagittal oluğun yarısı, arka-alt köşede transvers sinüs oluğunun bir bölümü uzanır; bu ayrıntılar modelde silik olabilir.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ic-sol',
        goster: ['yan-kafa-kemigi-sol'],
        vurgula: ['yan-kafa-kemigi-sol'],
        boya: [{ secici: ['yan-kafa-kemigi-sol'], renk: KEMIK_RENGI.yanKafa }],
        noktalar: [{ nokta: 'orta-meninks-oluk-sol' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemikleşme.** Yan kafa kemiği zar içinde, **tek bir merkezden** kemikleşir; merkez fetal hayatın yaklaşık 8. haftasında yan kafa tümseğinin yerinde belirir (Gray, 1918; Kilic Safak ve ark., 2025). Kemikleşme ışınsal yayıldığı için köşeler en son oluşur ve bıngıldaklar bu köşelerdedir (Gray, 1918). Normal gelişimde kubbenin iki yanındaki küçük açıklıklar genellikle gebeliğin 5. ayına kadar bulunur (Seltzer ve ark., 2026). Yan kafa delikleri, sagittal dikiş üzerindeki “sagittal (üçüncü) bıngıldaktan” gelişir (Sağlam ve ark., 2025); Gray de obelion bölgesinde sagittal dikişte bazen ek bir bıngıldak görüldüğünü yazar (Gray, 1918). Bu bıngıldağın sıklığı [genel bakış dersinde](/beyin-akademisi/anatomi/kafatasi#bebeklikten-yasliliga) verildi.

**Yan kafa deliğinin sıklığı** serilere göre değişir. İstanbul’da 174 erişkin yan kafa kemiğinin %64,3’ünde delik vardı; deliklerin %90,7’si tek, %6,8’i çift, %2,5’i üçlüydü ve bulunan 118 deliğin 8’i doğrudan sagittal dikişin üzerindeydi (Sağlam ve ark., 2025). Adana’da 40 kafatasının %47,5’inde hiç delik yoktu; %25’inde tek, %27,5’inde iki taraflıydı (Kilic Safak ve ark., 2025). Toplumlar arasında görülme %50 (ABD) ile %86 (Tayland) arasında bildirilir (Sağlam ve ark., 2025). İstanbul serisinin kemik başına, Adana serisinin kafatası başına sayım yaptığına dikkat: oranlar doğrudan karşılaştırılamaz.

**Eklemler.** Yan kafa kemiği beş kemikle eklem yapar: karşı yan kafa kemiği (sagittal dikiş), alın kemiği (koronal dikişin yarısı), art kafa kemiği (lambdoid dikişin yarısı), şakak kemiği (pul ve mastoid kısımları) ve kama kemiğinin büyük kanadı (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Tek merkez, zar içi kemikleşme**, ~8. hafta, yan kafa tümseğinde; köşeler en son oluşur (Gray, 1918).
- **Köşe → nokta:** alın → bregma (ön bıngıldak), art kafa → lambda (arka bıngıldak), kama → pterion, mastoid → asterion (Gray, 1918).
- **Kama köşesinin iç yüzü:** orta meningeal arterin ön dalları için derin oluk, bazen kemik kanal (Gray, 1918).
- **Mastoid köşesinin iç yüzü:** transvers sinüs oluğunun bir bölümü (Gray, 1918).
- **Üst şakak çizgisi** şakak fasyasına, **alt şakak çizgisi** şakak kasının başlangıç sınırına karşılık gelir (Gray, 1918).
- **Yan kafa deliği:** parietal emisser ven; sagittal dikişe ~7 mm, lambdanın ~3,5 cm önünde (Sağlam ve ark., 2025; Kilic Safak ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Yan kafa deliği ve emisser ven',
      md: `Yan kafa deliğinden geçen emisser ven kapakçıksızdır ve kafa derisinin toplardamarlarını doğrudan üst sagittal sinüse bağlar. Bu yol, bir yaralanma ya da ameliyat sırasında kafa derisindeki bir enfeksiyonun sert zar sinüslerine yayılmasına aracılık edebilir (Sağlam ve ark., 2025). Delik görüntülemede üst sagittal sinüsü bulmak için bir işaret noktası olarak da kullanılır (Sağlam ve ark., 2025).

Delik sagittal dikişe ortalama 6,8–7,4 mm uzaklıktadır (Sağlam ve ark., 2025; Kilic Safak ve ark., 2025) ve lambdanın yaklaşık 3,5 cm önündedir. İstanbul serisinde ortalama çap 1,7 mm, deliğin art kafa köşesine uzaklığı 33,8 mm, sagittal dikişin uzunluğu 108,9 mm’ydi; dikiş uzunluğunun bu uzaklığa oranı yaklaşık 3:1’dir, yani delik dikişin arka üçte birindedir. Çap genellikle 1–2 mm’dir, 5 mm’ye kadar çıkabilir; 5 mm’den büyük delik “büyümüş” sayılır (Sağlam ve ark., 2025). Yunanistan’da 200 örnekte (50 kafatası ve 150 BT) yan kafa emisser deliği %68,5 oranında bulundu (Kostares ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Kırık ya da hastalık sanılmaması gerekenler',
      md: `Yan kafa kemiğinde birkaç normal yapı ya da zararsız değişiklik görüntülemede kırık ya da hastalık gibi görünebilir:

- **Yan kafa delikleri:** küçük (1–2 mm) delikler zar içi kemikleşmenin olağan boşluklarıdır (Gökçe ve Beyhan, 2025).
- **Toplardamar gölleri:** kemik içinde genişlemiş toplardamar kanallarıdır; hastaların yaklaşık %15’inde bulunur, yaş ve cinsiyetle ilişkisizdir ve bazen kırık ya da dikişle karıştırılır (Gökçe ve Beyhan, 2025).
- **Araknoid granülasyonlar:** görülme sıklığı %0,3 ile %55 arasında bildirilir; yaşla artar, cinsiyet farkı yoktur. Kemiğe gömülenler iç tablayı oyabilir, biçimini değiştirebilir ya da aşındırabilir (Gökçe ve Beyhan, 2025). Kemikte bıraktıkları çukurlar en çok alın-yan kafa bölgesinde, üst sagittal sinüs boyuncadır (Guduri ve ark., 2023). Üst sagittal sinüs çevresindeki kemikte boyları milimetrenin altından 15–20 mm çapa kadar değişir (Radoš ve ark., 2021); bu büyüklükteki bir çukur kemiği eriten bir hastalık sanılabilir.
- **Bölünmüş yan kafa kemiği:** nadiren kemik ön-arka yönde uzanan bir dikişle üst ve alt iki parçaya ayrılır (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'İki taraflı yan kafa incelmesi',
      md: `**İki taraflı yan kafa incelmesi** (biparietal incelme) nüfusun %0,25–0,8’inde görülür (Pallua ve ark., 2024); başka bir kaynak 60 yaşın üstünde %0,4–2,37 sıklık verir (Tonina ve ark., 2022). İncelme sagittal dikiş ile yan kafa tümseği arasında, yan kafa deliklerinin önünde yer alır. En sık yaşlı (menopoz sonrası) kadınlarda görülür ama erkekte ve çocukta da olabilir (Pallua ve ark., 2024). Dış tabla ve diploe kaybolana kadar incelir, iç tabla genellikle korunur (Tonina ve ark., 2022). İlk kez 1783’te tanımlanmıştır ve nedeni hâlâ bilinmiyor. Kemiğin yoğunluğu ve kalitesi düştüğü için kafatası kırığı riskini artırır (Pallua ve ark., 2024); ilerleyen incelmede beyni korumak için kafatasının onarımı (kranioplasti) gerekebilir (Gökçe ve Beyhan, 2025).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Grafide iki yuvarlak açıklık',
      oyku: `7 yaşında bir kız çocuğu, okulda başını çarptıktan sonra çekilen kafa grafisinde başın tepesine yakın, orta hattın iki yanında simetrik, yaklaşık 2,5 cm çaplı, kenarları düzgün iki yuvarlak açıklık görülüyor. Çocuğun bir yakınması yok, muayenesi normal. Babası, kendi başının arka-üst kısmında da “yumuşak yerler” olduğunu çocukken doktorların söylediğini anlatıyor.`,
      soru: 'Bu açıklıklar büyük olasılıkla nedir, nasıl oluşur ve hangi ek incelemenin yeri vardır?',
      cozum: `**Olası tanı:** Orta hattın iki yanında, yan kafa deliklerinin yerinde, simetrik ve kenarları düzgün geniş açıklıklar; aile öyküsü de olunca **büyümüş yan kafa delikleri** (*foramina parietalia permagna*) düşünülür. 5 mm’den büyük yan kafa deliği büyümüş sayılır (Sağlam ve ark., 2025). Durum eksik penetranslı otozomal baskın kalıtılır ve olguların çoğunda aile öyküsü vardır (Seltzer ve ark., 2026).

**Nasıl oluşur?** Normal fetüste kubbenin iki yanındaki bu açıklıklar gebeliğin 5. ayına kadar bulunur. Mikro-BT ve doku bulguları büyümüş deliğin bir erime değil, doğuştan yerel bir kemikleşme kusuru olduğunu destekler (Seltzer ve ark., 2026). Olguların yaklaşık %80’inde *MSX2* ya da *ALX4* genlerinde değişiklik bildirilmiştir (Gökçe ve Beyhan, 2025).

**Ne yapılır?** Çoğu kişi belirtisizdir; bazılarında nöbet, baş ağrısı, bulantı-kusma ya da bastırınca ağrı olur (Seltzer ve ark., 2026). Bu deliklere derin beyin toplardamarlarının kalıcı bir falsin sinüs yoluyla sagittal sinüse boşalması eşlik edebilir (Seltzer ve ark., 2026); eşlik eden toplardamar, korteks ve zar anomalilerini göstermek için tercih edilen yöntem MR’dir (Gökçe ve Beyhan, 2025). Onarım ancak gerektiğinde, kişinin kendi kafatası kemiğinden alınan greftle ya da hidroksiapatit plakla yapılır (Seltzer ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kama köşesinde orta meningeal arterin kemik kanalı',
      md: `Gray, orta meningeal arterin ön dalının yan kafa kemiğinin kama köşesine yükseldiğini ve burada bazen bir kemik kanala dönüştüğünü yazar (Gray, 1918). Güncel çalışmalarda arterin alın (ön) dalı hastaların %49–75’inde tam ya da kısmi bir kemik kanaldan geçer. Shimizu ve arkadaşlarının serisinde bu tünel olguların %75,6’sında, çoğunlukla iki taraflı bulunmuştur; tünelin uzunluğu 3–23 mm (ortalama 12,2 mm), üst orbital yarığa uzaklığı 11–33 mm’dir (ortalama 18,9 mm). 68 hastanın üç boyutlu BT’sinde %77’den fazlasında ön dal kısmen ya da tamamen kemikle çevriliydi (Chuang-Hong ve ark., 2024).

Moyamoya hastalığında yapılan revaskülarizasyon ameliyatlarında bu dalın korunması amaçlanır. Arterin yeri ameliyattan önce BT ve sanal gerçeklik modeliyle belirlendiğinde, ameliyat tarafında ön dalın korunma oranı %68,2’den %91,7’ye çıkmıştır (Chuang-Hong ve ark., 2024). Pterion ile epidural kanama ilişkisi [genel bakış dersinde](/beyin-akademisi/anatomi/kafatasi?duzey=lisans#kubbe-ve-dikisler) anlatıldı.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Büyümüş yan kafa delikleri',
      md: `5 mm’den büyük yan kafa deliklerine **büyümüş yan kafa delikleri** (*foramina parietalia permagna*) denir. Görülme sıklığı 15.000’de 1 ile 50.000’de 1 arasında bildirilir; kalıtım eksik penetranslı otozomal baskındır (Seltzer ve ark., 2026; Gökçe ve Beyhan, 2025). 250 erişkin kafatasından oluşan bir koleksiyonda 2 kafatasında (%0,8) iki taraflı dev delik bulundu; çapları ortalama 3,2 cm’ydi (2–4,3 cm). Mikro-BT ve doku incelemesinde kenarlar düzgün ve kortekslidir (Seltzer ve ark., 2026). Koleksiyondaki oranın nüfustaki sıklıktan çok yüksek olması, koleksiyonun seçilerek oluşturulmasıyla ilgili olabilir.

**Cerrahi açıdan:** bu deliklere derin beyin toplardamarlarının kalıcı bir falsin pleksus (sinüs) yoluyla sagittal sinüse boşalması eşlik edebilir (Seltzer ve ark., 2026). Bölgede yapılacak bir girişimde bu toplardamar düzeni hesaba katılmalıdır; eşlik eden toplardamar, korteks ve zar anomalilerini göstermede tercih edilen yöntem MR’dir (Gökçe ve Beyhan, 2025). Onarım gerektiğinde kişinin kendi kafatası kemiğinden alınan greftle ya da hidroksiapatit plaklarla deliklerin kapatılması ve çevrelerinin güçlendirilmesi yoluyla yapılır (Seltzer ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Granülasyonlar, incelme ve tanım farkları',
      md: `**Araknoid granülasyonlar ne iş yapar?** Granülasyonlar araknoid zarın sert zar sinüslerine doğru yaptığı çıkıntılardır; ilk ayrıntılı tanımını 18. yüzyılın başında Pacchioni yapmıştır (Radoš ve ark., 2021). Doğumda yoktur, yaklaşık 18. ayda gözle seçilebilir hâle gelir (Guduri ve ark., 2023). Bir MR çalışmasında ise yenidoğanların ve 2 yaşındaki çocukların %85’inde sinüslerde ya da kemikte görünür granülasyon yoktu; kemikteki granülasyonlar yalnızca üst sagittal sinüs çevresinde, ilk kez 10 yaşında görüldü ve sayıları yaşla belirgin biçimde arttı; 60 yaşından sonra kemikte sinüslerdekinden çok granülasyon vardı. Bu, Gray’in “yaşlıların kafataslarında en belirgin” gözlemiyle uyumludur. Aynı çalışmanın yazarları, granülasyonların genel kabulün aksine beyin-omurilik sıvısının emiliminde temel bir rol oynamadığını öne sürer (Radoš ve ark., 2021); bu nedenle granülasyonları “BOS’u emen yapı” diye kesin bir dille anlatmak doğru olmaz. Granüler çukurcuklar yalnızca sagittal sinüs boyunca da değildir: 110 kafatasında sigmoid sinüs oluğunda tarafların %3,6’sında bulundu (Guduri ve ark., 2023).

**İki taraflı incelmenin geçmişi.** Bugün nadir olan bu incelme eski Mısır’da çok sıktı: Teb nekropolündeki bir mezarda 312 erişkinin %30’una kadarında görüldüğü aktarılır. Kuzey İtalya’da bir Orta Çağ mezarlığından çıkan bir kadın kafatasında yan kafa kemiği sağda 0,75 mm’ye kadar incelmişti (Tonina ve ark., 2022). Arkeolojik örnekler bugünkü toplumla doğrudan karşılaştırılamaz; nedeni hâlâ bilinmiyor (Pallua ve ark., 2024).

**Üst şakak çizgisine ne tutunur?** Gray ve terminoloji üst şakak çizgisini şakak fasyasının tutunduğu çizgi olarak tanımlar (Gray, 1918; FIPAT, 2019); bir mikrocerrahi anatomi derlemesi ise onu şakak kasının tutunma çizgisi olarak anlatır (Tayebi Meybodi ve ark., 2023). Bu derste Gray ve terminolojinin tanımı esas alındı.`,
    },
  ],
};
