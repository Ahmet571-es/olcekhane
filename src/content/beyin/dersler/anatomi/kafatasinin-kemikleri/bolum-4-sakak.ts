import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/**
 * 4. bölüm: şakak kemiği. Gray’in beş parçası ve TA2’nin üç kısmı; dış ve alt yüzün işaretleri; mastoid hücreler,
 * antrum ve Macewen üçgeni; kayalık kısmın yüzleri, kenarları ve tepesi; iç kulak yolunun dibi; karotis kanalı ve
 * juguler bulbus; timpanik kısım ve Huschke deliği; stiloid çıkıntı; yüz siniri kanalı; kemikleşme, eklemler,
 * varyasyonlar, görüntüleme ve cerrahi anatomi.
 */
export const sakakKemigi: DersBolumu = {
  id: 'sakak-kemigi',
  baslik: 'Şakak kemiği',
  bloklar: [
    // ——— Genel bakış ———
    {
      tur: 'metin',
      md: `**Şakak kemiği** (*os temporale*) kafatasının iki yanında ve tabanında yer alan çift kemiktir (Gray, 1918). Kulak kepçesinin çevresindeki kemik duvar odur: elini kulağının hemen üstüne ve arkasına koyduğunda bu kemiğin üzerindesin. Küçük bir alana çok iş sığdırır:

- **Kulağı içinde taşır.** Orta kulağın ve iç kulağın yapıları kemiğin kayalık kısmının içindeki küçük boşluklardadır (OpenStax 7.2).
- **Çene eklemine yuva olur.** Alt çenenin kondili, dış kulak yolunun hemen önündeki çukurla eklem yapar (Gray, 1918).
- **Büyük damarlara geçit verir.** Beyni besleyen büyük atardamarlardan biri olan iç karotis arter, kafatasına bu kemiğin içinden geçen zikzak bir tünelle girer (OpenStax 7.2). Boyundaki iç juguler venin başlangıçtaki genişlemesi (bulbus) de kemiğin alt yüzündeki bir çukura oturur (Gray, 1918).
- **Yüz sinirine tünel olur.** Yüz siniri kemiğin içinde yaklaşık 30 mm yol alır ve kulağın arka-altındaki küçük bir delikten kafatasını terk eder (Ryu ve Kim, 2016; Gray, 1918).
- **Kaslara tutunma yeri sağlar.** Şakak kası pul kısmına, sternokleidomastoid kas mastoid çıkıntıya tutunur (Gray, 1918).

Şakak kemiği beş kemikle eklem yapar: art kafa, yan kafa, kama, elmacık kemiği ve alt çene (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Şakak kemiği kafatasında',
      aciklama:
        'Kafatasına soldan bakıyoruz; yeşil boyalı kemik sol şakak kemiği, öteki kemikler doğal renginde. Şakak kemiği dış kulak yolunun çevresinde yan duvarın alt kısmını yapar: üstünde yan kafa kemiği, arkasında art kafa kemiği, önünde kama kemiğinin büyük kanadı ve elmacık kemiği, altında alt çene vardır. Etiketler eklem yaptığı beş komşuyu gösterir. “Ayrıştır” ile kemikleri birbirinden uzaklaştırıp sınırlarını görebilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'sol',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [{ secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak }],
        etiketler: [
          { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
          { yapi: 'yan-kafa-kemigi-sol', metin: 'Yan kafa kemiği' },
          { yapi: 'art-kafa-kemigi' },
          { yapi: 'kama-kemigi' },
          { yapi: 'elmacik-kemigi-sol', metin: 'Elmacık kemiği' },
          { yapi: 'alt-cene-kemigi', metin: 'Alt çene' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'metin',
      md: `Gray’in klasik anlatımında şakak kemiği **beş parçadan** oluşur (Gray, 1918):

- **Pul kısmı** (*pars squamosa*): ön-üstteki geniş, ince, balık pulu gibi yarı saydam levha. Dış yüzü şakak çukurunun bir parçasıdır (Gray, 1918).
- **Kayalık kısım** (*pars petrosa*): kafatasının tabanına doğru içe ve öne uzanan piramit biçimli bölüm. Kemiğin en yoğun ve en sert yeridir; işitme organının temel bölümlerini içinde taşır (Gray, 1918).
- **Mastoid kısım:** kemiğin arka bölümü. Aşağıda konik **mastoid çıkıntıyla** (*processus mastoideus*) biter. İçi süngerimsidir ve çoğu kişide havayla dolu küçük odacıklar içerir (Gray, 1918).
- **Timpanik kısım** (*pars tympanica*): pul kısmının altında, mastoid çıkıntının önünde kıvrık bir levha; kemik dış kulak yolunun ön duvarını ve tabanını yapar (Gray, 1918).
- **Stiloid çıkıntı** (*processus styloideus*): alt yüzden aşağı ve öne uzanan ince, sivri bir çubuk (Gray, 1918). OpenStax’e göre adını eskilerin yazı kalemi *stylus*’a benzemesinden alır (OpenStax 7.2).

Güncel uluslararası anatomi terimlerinde (TA2) ayrı bir mastoid kısım yoktur: mastoid bölge kayalık kısmın arka ucu sayılır (FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İki sayım, tek kemik.** Gray beş parça sayar (Gray, 1918). *Terminologia Anatomica*’nın ikinci baskısı (TA2) ise kemiği üç kısma ayırır: *pars petrosa*, *pars tympanica* ve *pars squamosa*. Gerekçe 1955 tarihli bir terim notunda yazılıdır: kemiğin en arka bölümü gelişim bakımından kayalık kısmın parçası olduğundan ayrı bir mastoid kısım adlandırmanın nedeni yoktur. Bu yüzden mastoid çıkıntı, mastoid antrum, mastoid çentik ve mastoid delik TA2’de kayalık kısmın altında sıralanır; kayalık kısmın ilişkili adlarından biri de *pars petromastoidea*’dır (FIPAT, 2019). Doğum öncesinde ise kemik gerçekten beş ayrı parça (skuamöz, stiloid, mastoid, timpanik ve petröz) hâlinde gelişir (Grzonkowska ve ark., 2023). Bu bölümde anlaşılır olsun diye “mastoid kısım” deyişini koruyoruz.

**Biçim ve yön.** Şakak kemiği, devrilmiş ve tepesi kama kemiğinin sinüsüne bakan bir piramide benzetilir (Dublin ve Al-Dhahir, 2023). Kayalık kısım kafa tabanında kama ile art kafa kemiği arasına sıkışır; içe, öne ve biraz yukarı yönelir. Gray’e göre bir tabanı, bir tepesi, üç yüzü ve üç açısı vardır: tabanı pul ve mastoid kısımların iç yüzleriyle kaynaşmıştır, pürüzlü tepesi kama kemiğinin büyük kanadının arka kenarı ile art kafa kemiğinin baziler kısmı arasındaki açıya girer (Gray, 1918).

**Yapı.** Pul kısmı öteki kafatası kemikleri gibi iki tabla ve aradaki süngerimsi dokudan oluşur; mastoid kısım süngerimsi, kayalık kısım yoğun ve serttir (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Gray’in adları ve bugünkü karşılıkları',
      sutunlar: ['Gray (1918)', 'Güncel ad (TA2)', 'Not'],
      satirlar: [
        [
          'Beş parça: squama, petrous, mastoid, tympanic, styloid',
          '*Pars squamosa*, *pars petrosa*, *pars tympanica*; ayrı *pars mastoidea* yok',
          'Mastoid bölge gelişim bakımından kayalık kısmın parçasıdır.',
        ],
        [
          'Pyramis; üst, arka ve ön “açılar”',
          '*Apex partis petrosae*; *crista petrosa*; *margo posterior partis petrosae*',
          'BNA’nın “piramit” ve üç “açı” terimleri listeden çıkarıldı.',
        ],
        [
          'Hiatus of the facial canal',
          '*Hiatus canalis nervi petrosi majoris*',
          'Eski ad yanıltıcı bulundu; yeni ad buradan büyük petrozal sinirin çıktığını söyler.',
        ],
        ['Greater / lesser superficial petrosal nerve', '*N. petrosus major / minor*', '—'],
        ['Semilunar ganglion; impressio trigemini', '*Ganglion trigeminale*; *impressio trigeminalis*', 'İlişkili eponim: Meckel oluğu.'],
        ['Crista falciformis', '*Crista transversa*', 'İç kulak yolunun dibini üst ve alt bölmelere ayırır.'],
        ['Adsız dikey sırt', '*Crista verticalis*', 'Klinikteki adı “Bill çubuğu”.'],
        ['Area cribrosa superior / media', '*Area vestibularis superior / inferior*', '—'],
        [
          'Aquaeductus vestibuli / cochleae',
          '*Canaliculus vestibuli / cochleae*',
          'Klinikte “vestibüler / koklear akuedük” denmeye devam eder.',
        ],
        [
          'Acoustic nerve; internal auditory branch of the basilar artery',
          '*N. vestibulocochlearis*; *a. labyrinthi*',
          'TA2 labirent arterini ön alt serebellar arterin dalı olarak listeler.',
        ],
        ['Sigmoid oluk “transvers sinüsün bir bölümünü” taşır', '*Sulcus sinus sigmoidei*', 'Bugün sigmoid sinüs ayrı adlandırılır.'],
        ['Articular tubercle (eminentia articularis)', '*Tuberculum articulare* ve *eminentia articularis*', 'TA2’ye göre iki ayrı yapı.'],
        [
          'Septum canalis musculotubarii (processus cochleariformis)',
          '*Septum canalis musculotubarii*; *processus cochleariformis* ayrı terim',
          'TA2’de kokleariform çıkıntı orta kulağın labirent duvarındadır.',
        ],
        [
          'Suprameatal spine (timpanik kısımla anlatılır)',
          '*Spina suprameatalis* (sabit değil)',
          'Kökeni pul kısmı olduğu için oraya taşındı.',
        ],
        [
          'Internal maxillary artery’nin timpanik dalı',
          '*A. tympanica anterior* (*a. maxillaris*’in dalı)',
          'Petrotimpanik yarıktan geçer.',
        ],
        ['Mastoöccipital, mastoparietal sutures', '*Sutura occipitomastoidea*, *sutura parietomastoidea*', '—'],
        ['Sekiz kemikleşme merkezi', '—', 'Güncel bir fetüs çalışması 10 birincil merkez sayar.'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Grzonkowska ve ark. (2023). TA2 terimleri TA2 görüntüleyicisinin terim ağacından ve notlarından alındı.',
    },

    // ——— Dış yüz: pul kısmı, çene eklemi, Macewen üçgeni ———
    {
      tur: 'sahne',
      baslik: 'Sol şakak kemiği dışarıdan',
      aciklama:
        'Sol şakak kemiği tek başına; soldan, yani dış yüzüne bakıyoruz (ekranın solu ön, sağı arka). Üstteki geniş levha pul kısmı; ondan öne uzanan kol elmacık çıkıntısı. Ortadaki açıklık dış kulak yolu; arkasında aşağı sarkan mastoid çıkıntı, altında öne-aşağı uzanan ince stiloid çıkıntı görülür. Macewen üçgeninin noktası yaklaşıktır: model sadeleştirildiği için bu çukurluğun ağda yalnızca sığ bir izi var, Henle dikeni ise modelde yok.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['sakak-kemigi-sol'],
        vurgula: ['sakak-kemigi-sol'],
        boya: [{ secici: ['sakak-kemigi-sol'], renk: KEMIK_RENGI.sakak }],
        noktalar: [
          { nokta: 'sakak-pul-kismi-sol' },
          { nokta: 'sakak-elmacik-cikintisi-sol' },
          { nokta: 'dis-kulak-yolu-sol' },
          { nokta: 'suprameatal-ucgen-sol', metin: 'Macewen üçgeni (yaklaşık)' },
          { nokta: 'mastoid-cikinti-sol' },
          { nokta: 'stiloid-cikinti-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      md: `Dışarıdan bakınca öne çıkan işaretler şunlardır:

- **Dış kulak yolu** (*meatus acusticus externus*): kafatasının yan yüzünde kulakla ilişkili büyük açıklık (OpenStax 7.2). Kemik kanalın dış kenarına kulak yolunun kıkırdak bölümü tutunur (Gray, 1918).
- **Elmacık çıkıntısı** (*processus zygomaticus*): pul kısmının alt bölümünden öne uzanır; elmacık kemiğinin şakak çıkıntısıyla birleşerek yanaktaki **elmacık kemerini** yapar (OpenStax 7.2).
- **Çene eklem çukuru** (*fossa mandibularis*) ve **eklem tümseği** (*tuberculum articulare*): dış kulak yolunun hemen önündeki derin, oval çukur ve onun hemen önündeki düz sırt (OpenStax 7.2). Çukurun ön kısmı alt çenenin kondiliyle eklem yapar (Gray, 1918). Bu ikisi aşağıdaki alttan bakışta daha iyi görünür.
- **Mastoid çıkıntı:** kulağın arkasında aşağı uzanan konik çıkıntı. Boyu ve biçimi kişiden kişiye değişir, erkeklerde daha büyüktür; doğumda henüz gelişmemiştir (Gray, 1918).
- **Stiloid çıkıntı:** üç küçük kas (stiloglossus, stilohiyoid, stilofarengeus) ve iki bağ tutunur (Gray, 1918); stiloide tutunan kaslara “Riolan buketi” denir (Assiri Ahmed ve ark., 2023).
- **Macewen üçgeni:** dış kulak yolunun arka-üstündeki küçük çukurluk. Kulak cerrahları için mastoidin içindeki en büyük hava boşluğuna, **mastoid antruma**, giden kapıdır (Tayebi Meybodi ve ark., 2023; Khan ve ark., 2022).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Pul kısmının dış yüzü** şakak çukurunun bir parçasıdır ve şakak kasına tutunma yeri verir; arka bölümünde orta temporal arter için dikey bir oluk (*sulcus arteriae temporalis mediae*) bulunur (Gray, 1918; FIPAT, 2019). Arka bölümünü kavisli **supramastoid krista** (*crista supramastoidea*; Gray’de şakak çizgisi) çaprazlar: şakak fasyası buraya tutunur ve şakak kasının başlangıcı burada sınırlanır (Gray, 1918).

**Elmacık çıkıntısı** önce dışa yönelir, sonra kendi üzerine içe bükülmüş gibi öne uzanır. Uzun, ince ve keskin üst kenarına şakak fasyası; kısa, kalın ve kavisli alt kenarına masseter kasının bazı lifleri tutunur. Dış yüzü deri altındadır, iç yüzüne masseter tutunur; derin dişli ön ucu elmacık kemiğiyle eklem yapar (Gray, 1918). Çıkıntı iki kökle başlar: belirgin **arka kök** dış kulak yolunun üstünden geçip supramastoid kristaya devam eder; kısa, geniş ve güçlü **ön kök** içe döner ve yuvarlak **eklem tümseğiyle** biter. Tümsek çene eklem çukurunun ön sınırıdır ve canlıda kıkırdakla örtülüdür (Gray, 1918).

**Çene eklem çukuru** önde eklem tümseği, arkada timpanik kısımla sınırlanır; timpanik kısım çukuru dış kulak yolundan ayırır. Çukuru dar bir yarık, **petrotimpanik (Glaser) yarığı** (*fissura petrotympanica*) ikiye böler. Pul kısmına ait ön bölüm düzdür, canlıda kıkırdakla örtülüdür ve alt çenenin kondiliyle eklem yapar; timpanik kısma ait arka bölüm eklem yapmaz ve bazen tükürük bezinin (parotis) bir parçasını barındırır (Gray, 1918). Yarık orta kulağa açılır: malleusun ön çıkıntısını barındırır ve maksiller arterin ön timpanik dalını (*a. tympanica anterior*; Gray’de “iç maksiller arterin timpanik dalı”) geçirir. Korda timpani siniri yarığın ön kenarından ince bir kemik pulla ayrılan **Huguier kanalından** geçer (Gray, 1918; FIPAT, 2019).

**İç yüz ve kenarlar.** Pul kısmının iç yüzünde temporal lobun kıvrımlarına uyan çukurluklar ve orta meningeal damarların dalları için oluklar vardır (Gray, 1918). İnce üst kenarı iç tablası aleyhine eğik kesilmiştir; yan kafa kemiğinin kenarının üstüne binerek **skuamöz dikişi** yapar ve arkada mastoid kısımla **parietal çentiği** (*incisura parietalis*) oluşturur. Kalın, dişli ön-alt kenarı kama kemiğinin büyük kanadıyla eklem yapar (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Suprameatal (Macewen) üçgeni**, dış kulak yolunun arka duvarı ile elmacık çıkıntısının arka kökü arasındaki alandır; Gray buradan bir aletle antruma ulaşılabileceğini yazar (Gray, 1918). Kavramı 1893’te Sir William MacEwen ortaya koydu (Bento ve Fonseca, 2013). Üçgenin önünü elmacık çıkıntısının arka kökü, altını dış kulak yolunun arka-üst kemik bölümü sınırlar; arkada hayali dikey bir çizgi üçgeni kapatır (Bento ve Fonseca, 2013). Üçgen supramastoid kristanın hemen altında, dış kulak yolunun arka-üstündedir (Tayebi Meybodi ve ark., 2023). TA2’deki adı *foveola suprameatalis*’tir (FIPAT, 2019).

Dış kulak yolu ağzının üst sınırını elmacık çıkıntısının arka kökü yapar; hemen altında bazen küçük bir diken, **suprameatal (Henle) dikeni** (*spina suprameatalis*) görülür (Gray, 1918). TA2 bu dikeni sabit olmayan bir yapı olarak sayar ve kökeni pul kısmı olduğu için onu timpanik kısımdan pul kısmına taşımıştır (FIPAT, 2019).

**Antrum nerede?** Mastoid antrum Henle dikeninin arkasında, şakak çizgisinin altında, bu üçgenin derinindedir (Ostrander ve ark., 2026). Yeri tutarlıdır ve dışında önemli bir yapı yoktur; bu yüzden mastoidektominin ilk evresinin en önemli işaretidir (Ryu ve Kim, 2016). Kronik orta kulak iltihabı olan 60 hastada ameliyat sırasında yapılan ölçümde, üçgenin üstündeki dış korteksten lateral yarım daire kanalının kabarıklığına kadar ortalama derinlik **17,27 mm** bulundu (Khan ve ark., 2022). Şakak çizgisi orta kafa çukurunun tabanını tahmin etmek için de kullanılır: taban bu çizginin ortalama yaklaşık 5 mm üstündedir (Ostrander ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Pul kısmının ince ayrıntıları.** Pul kısmı ile mastoid kısım arasındaki özgün dikişin izleri supramastoid kristanın yaklaşık 1 cm altındadır (Gray, 1918). Eklem tümseğinin önündeki küçük üçgen alan infratemporal çukura katılır; ön kökün elmacık çıkıntısıyla birleştiği yerde temporomandibular bağ için bir çıkıntı vardır. Çene eklem çukurunun eklem yapan ön (pul) kısmının hemen arkasındaki küçük konik kabartı, bazı memelilerde kondilin arkasına inen belirgin bir tüberkülün insandaki karşılığıdır; timpanik kısmın üst kenarı dışta bu postglenoid çıkıntının arkasıyla kaynaşır, içte petrotimpanik yarığı sınırlar (Gray, 1918). Gray eklem tüberkülünü *eminentia articularis* ile eş tutar; TA2 notuna göre ise eklem tüberkülü ve eklem kabartısı ayrı yapılardır (FIPAT, 2019). Timpanoskuamöz yarık içe doğru izlendiğinde petrotimpanik ve petroskuamöz yarıklarla devam eder (FIPAT, 2019).

**Havalı eklem tümseği.** Şakak kemiğinin elmacık uzantısında hava hücreleri bulunmasına **pnömatize eklem tüberkülü** (PAT) denir. PAT çene eklem çukurunun tavanını zayıflatır; enfeksiyon, tümör ve kırık bu kırılgan eklemde daha kolay ilerleyebilir (Adışen ve Aydoğdu, 2022). Panoramik grafide sıklığı %1,03–6,2 olarak bildirilir; aktarılan tek bir çalışma panoramik grafide %1,96, konik ışınlı BT’de (KIBT) %12,5 bildirmiştir. PAT’lı hastalarda mastoid hava hacmi ortalama 6,31 cm³, PAT’sızlarda 3,25 cm³’tü; yani eklem tümseğindeki hava, mastoidin de yaygın havalandığına işaret edebilir (Adışen ve Aydoğdu, 2022).`,
    },

    // ——— Mastoid bölge, hücreler ve antrum ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Mastoid kısmın dış yüzü** pürüzlüdür; art kafa kası (*m. occipitalis*) ve arka kulak kası (*m. auricularis posterior*) tutunur. Arka kenarına yakın **mastoid delik** (*foramen mastoideum*), Gray’e göre sinüse giden bir veni ve oksipital arterin sert zara giden küçük bir dalını geçirir (Gray, 1918); bu ven bugünkü adıyla mastoid emisser vendir (*emissarium mastoideum*) (FIPAT, 2019). Deliğin yeri ve boyu çok değişir: her zaman bulunmaz, bazen art kafa kemiğinde ya da iki kemik arasındaki dikiştedir (Gray, 1918).

**Mastoid çıkıntıya** sternokleidomastoid, splenius capitis ve longissimus capitis kasları tutunur. Çıkıntının iç yanındaki derin oluk **mastoid çentiktir** (*incisura mastoidea*; Gray’de digastrik çukur) ve digastrik kasın tutunma yeridir; onun da içinde oksipital arteri taşıyan sığ **oksipital arter oluğu** (*sulcus arteriae occipitalis*) bulunur (Gray, 1918; FIPAT, 2019).

**İç yüzde** derin, kıvrık bir oluk vardır: **sigmoid sinüs oluğu** (*sulcus sinus sigmoidei*). Gray bu oluğun “transvers sinüsün bir bölümünü” taşıdığını yazar; bugün bu kesim ayrı adla sigmoid sinüstür (Gray, 1918; FIPAT, 2019). Oluğu en içteki mastoid hücrelerinden çok ince bir kemik levha ayırır ve bu levha kısmen eksik bile olabilir (Gray, 1918). Mastoid kısmın geniş, dişli üst kenarı yan kafa kemiğinin mastoid açısıyla; dişli arka kenarı art kafa kemiğinin alt kenarıyla, yan açı ile juguler çıkıntı arasında eklem yapar (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Mastoid hücreler** (*cellulae mastoideae*). Mastoid çıkıntının kesiti, boyutu ve sayısı akla gelebilecek her çeşitlilikte boşluklar gösterir. Üst-ön bölümde hücreler büyük, düzensiz ve havalıdır; aşağı doğru küçülür; uçtakiler çoğu zaman çok küçüktür ve ilik içerir. Bazen hiç hücre yoktur ve mastoid baştan sona sağlam kemiktir (Gray, 1918). Bugün havalanma üç tipe ayrılır: **hücresel** (tam), **diploik** (kısmi) ve **sklerotik** (havalanma yok) (Khan ve ark., 2022).

**Mastoid antrum** (*antrum mastoideum*; Gray’de timpanik antrum), kemiğin üst-ön bölümündeki büyük, düzensiz boşluktur. Hücreler gibi havayla doludur, orta kulak mukozasının uzantısıyla döşelidir ve orta kulakla bağlantılıdır (Gray, 1918). Sınırları (Gray, 1918):

- **Üstte** ince bir kemik levha, **tegmen tympani**; antrumu orta kafa çukurundan ayırır.
- **Altta** mastoid çıkıntı; **dışta** şakak çizgisinin hemen altındaki pul kısmı.
- **İçte** boşluğa doğru kabaran lateral yarım daire kanalı.
- **Önde** orta kulağın “çatı katına” (epitimpanik reses, attik) açılır.

**Gelişim.** Antrum gebeliğin yaklaşık 24. haftasında görülebilen tek hava hücresidir (Aladeyelu ve ark., 2022) ve yaklaşık 35. haftada erişkin boyutuna ulaşır; hücrelerin havalanması 33. haftada başlar ve 8–9 yaşına kadar sürer (Khan ve ark., 2022). Gray’e göre hücreler antrumun cepleridir; doğumda ya da daha önce belirmeye başlar, 5 yaşında belirgindir ve gelişimleri ergenliğe doğru tamamlanır (Gray, 1918). Bir derlemeye göre havalı boşlukların yüzey alanı ve hacmi 4 yaşından önce iki katına çıkar ve hacim geç ergenlikte (14–15 yaş) erişkin ortalamasına ulaşır (Aladeyelu ve ark., 2022). Kaynakların farklı yaşlar vermesi farklı şeyleri ölçmelerindendir: antrumun görülmesi, hücrelerin havalanması ve toplam hacim ayrı süreçlerdir.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Dış yüz, mastoid bölge, timpanik kısım ve stiloidin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA2)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        ['Orta temporal arter oluğu', '*Sulcus arteriae temporalis mediae*', 'Pul kısmının dış yüzü, arkada', 'Orta temporal arter'],
        [
          'Supramastoid krista',
          '*Crista supramastoidea*',
          'Pul kısmının arka bölümü; elmacık arka kökünün devamı',
          'Şakak fasyası; şakak kasının başlangıç sınırı',
        ],
        [
          'Elmacık çıkıntısı',
          '*Processus zygomaticus ossis temporalis*',
          'Pul kısmının alt bölümünden öne',
          'Üst kenar: şakak fasyası; alt kenar ve iç yüz: masseter; ön uç: elmacık kemiği',
        ],
        ['Eklem tümseği', '*Tuberculum articulare*', 'Elmacık ön kökünün ucu', 'Çene eklem çukurunun ön sınırı; canlıda kıkırdakla örtülü'],
        [
          'Çene eklem çukuru',
          '*Fossa mandibularis*',
          'Eklem tümseği ile timpanik kısım arası',
          'Ön (pul) bölüm: alt çene kondili; arka (timpanik) bölüm: bazen parotisin bir parçası',
        ],
        [
          'Petrotimpanik (Glaser) yarığı',
          '*Fissura petrotympanica*',
          'Çene eklem çukurunun içinde',
          'Malleusun ön çıkıntısı; ön timpanik arter; ön kenarındaki Huguier kanalından korda timpani',
        ],
        [
          'Parietal çentik',
          '*Incisura parietalis*',
          'Pul kısmının üst kenarının arka ucu',
          'Orta çukur sert zarını bulmada cerrahi işaret',
        ],
        ['Macewen üçgeni', '*Foveola suprameatalis*', 'Dış kulak yolunun arka-üstü', 'Mastoid antruma cerrahi kapı'],
        ['Henle dikeni', '*Spina suprameatalis* (sabit değil)', 'Dış kulak yolu ağzının arka-üst kenarı', 'Antrum bunun arkasındadır'],
        ['Mastoid çıkıntı', '*Processus mastoideus*', 'Kulağın arkası', 'Sternokleidomastoid, splenius capitis, longissimus capitis'],
        ['Mastoid çentik', '*Incisura mastoidea*', 'Mastoid çıkıntının iç yanı', 'Digastrik kas'],
        ['Oksipital arter oluğu', '*Sulcus arteriae occipitalis*', 'Mastoid çentiğin içi', 'Oksipital arter'],
        [
          'Mastoid delik',
          '*Foramen mastoideum*',
          'Arka kenara yakın; bazen art kafa kemiğinde ya da dikişte',
          'Mastoid emisser ven; oksipital arterin sert zar dalı',
        ],
        ['Sigmoid sinüs oluğu', '*Sulcus sinus sigmoidei*', 'Mastoid kısmın iç yüzü', 'Sigmoid sinüs'],
        ['Mastoid antrum', '*Antrum mastoideum*', 'Mastoidin üst-ön bölümü', 'Hava; orta kulak mukozasının uzantısı'],
        [
          'Kemik dış kulak yolu',
          '*Meatus acusticus externus cranii*',
          'Önü ve tabanı timpanik kısım, tavanı pul kısmı',
          'Dış kenarına kulak yolunun kıkırdak bölümü tutunur',
        ],
        ['Timpanik oluk', '*Sulcus tympanicus*', 'Timpanik kısmın iç ucu', 'Kulak zarının çevresi'],
        [
          'Huschke deliği',
          '— (TA2’de ayrı terim yok)',
          'Timpanik kısmın ortası: kulak yolunun ön-alt duvarı',
          'Normalde çocuklukta kapanır',
        ],
        [
          'Vajinal çıkıntı',
          '*Vagina processus styloidei*',
          'Timpanik kısmın alt kenarı; karotis kanalından geriye',
          'Stiloidin kökünü kılıf gibi sarar',
        ],
        [
          'Stiloid çıkıntı',
          '*Processus styloideus ossis temporalis*',
          'Alt yüz, stilomastoid deliğin hemen önü',
          'Stilohiyoid ve stilomandibular bağlar; stiloglossus, stilohiyoid, stilofarengeus kasları',
        ],
        ['Stilomastoid delik', '*Foramen stylomastoideum*', 'Stiloid ile mastoid arası', 'Yüz siniri; stilomastoid arter'],
        [
          'Timpanomastoid yarık',
          '*Fissura tympanomastoidea*',
          'Timpanik kısım ile mastoid arası',
          'Vagusun kulak dalının (Arnold siniri) çıkışı',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Bento ve Fonseca (2013); Motta ve ark. (2024); Ostrander ve ark. (2026); Hasani ve ark. (2022); Assiri Ahmed ve ark. (2023).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Mastoidin komşuları: iltihap nereye yayılır?',
      md: `Mastoidin klinik önemi komşularından gelir: arka ve orta kafa çukuru, sigmoid ve lateral sinüsler, yüz siniri kanalı, yarım daire kanalları ve kayalık kısmın ucu (Malik ve ark., 2019). Orta kulak iltihabı kafa içine önceden var olan yollardan, kan yoluyla ya da orta kulaktan veya mastoidden doğrudan komşuluk yoluyla yayılabilir (Malik ve ark., 2019).

Antibiyotiklerin kullanıma girmesiyle kafa içi komplikasyonlarda ölüm oranı %35’ten %5’e indi (Malik ve ark., 2019). Yine de orta kulak iltihabı komplikasyonlarının %30’u kafa içidir ve bunların %5–26’sı ölümle sonuçlanır (Penido ve ark., 2016). 51 hastalık bir seride kafa içi komplikasyonların %78’i beyin apsesi ve menenjit, %13’ü lateral sinüs trombozuydu; ölüm %7,8, işitme kaybı %90, kalıcı nörolojik iz %29 oranında görüldü (Penido ve ark., 2016).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 1: Kulaktan boyna inen şişlik',
      oyku: `27 yaşında bir erkek, üç haftadır süren sağ kulak ağrısı ve akıntı için iki kez kısa süreli antibiyotik kullanmış. Son günlerde ateşi yükselmiş; sağ kulağının arkasından boynuna doğru inen ağrılı bir şişlik başlamış ve başını sola çevirmekte zorlanıyor. Muayenede kulak arkası kızarık ve hassas; şişlik mastoid ucunun altından boynun yan tarafı boyunca aşağı uzanıyor.`,
      soru: 'İrin kulaktan boyna hangi kemik yoldan ulaşmış olabilir ve bu tablo neden küçük çocuklarda nadirdir?',
      cozum: `Tablo bir **Bezold apsesine** uyar: irinli mastoiditin bir komplikasyonudur ve ilk kez 1881’de Alman kulak hekimi Friedrich Bezold tanımlamıştır (Malik ve ark., 2019).

**Yol:** Mastoid hücreleri antrumun cepleridir ve antrum orta kulakla bağlantılıdır (Gray, 1918); orta kulaktaki iltihap bu yolla mastoide ulaşır. Bezold apsesinde irin mastoid çıkıntının **iç duvarını** delerek iç yandaki **mastoid (digastrik) çentiğe** akar ve boyunda bir irin birikimi oluşturur (Malik ve ark., 2019). Bu çentik digastrik kasın, çıkıntının dış yüzü de sternokleidomastoid kasın tutunma yeridir (Gray, 1918); bu yüzden şişlik kulak arkasında değil, boynun yan tarafında kaslar boyunca belirir.

**Neden küçük çocuklarda nadir?** Mastoidin havalanması kemik duvarları inceltir ve apseye zemin hazırlar; bebeklik ve erken çocuklukta havalanma tamamlanmadığı için Bezold apsesi nadirdir (Malik ve ark., 2019). Doğumda mastoid çıkıntının kendisi de henüz gelişmemiştir (Gray, 1918).

**Komşuluklar:** Mastoidin komşuları arka ve orta kafa çukuru, sigmoid sinüs, yüz siniri kanalı, yarım daire kanalları ve kayalık uçtur (Malik ve ark., 2019); orta kulak iltihabı komplikasyonlarının %30’u kafa içidir (Penido ve ark., 2016). Bu yüzden böyle bir hasta kafa içi komplikasyonlar yönünden de değerlendirilir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Mastoidektomi: korteksten antruma',
      md: `- **İlk kesiler:** Şakak kemiği diseksiyonunda ilk kesi şakak çizgisi boyunca geriye, sinodural açıya doğru yapılır; ikinci kesi dış kulak yolunun arka duvarının arkasından mastoid ucuna dik iner. İki kesi Macewen üçgenini tanımlar (Motta ve ark., 2024).
- **Orta çukurun sert zarı** çoğunlukla şakak çizgisinin üstündedir, özellikle iyi havalanmış mastoidlerde; aşağıda yerleşmiş sert zar daha nadirdir ve kötü havalanmış mastoidle ilişkili olabilir. Arkada çalışırken parietal çentik daha kesin bir işarettir (Motta ve ark., 2024). Orta çukurun tabanı arkaya doğru yükselir ve aşağı yukarı supramastoid krista düzeyine ulaşır; bu düzeyde orta çukuru orta kulaktan tegmen tympani ayırır (Tayebi Meybodi ve ark., 2023).
- **Sigmoid sinüs** genellikle mastoid korteksin birkaç milimetre altındadır (Motta ve ark., 2024). Sinüsün konumu çok değişkendir; elverişli (geride) konum büyük ve iyi havalanmış mastoidle birliktedir (Singh ve ark., 2019). Önde ya da dışta yerleşmiş sigmoid sinüs ve yüksek juguler bulbus çalışma alanını daraltır; nadiren kanal duvarını alan ya da başka yaklaşımlar gerekir (Ostrander ve ark., 2026).
- **Sklerotik mastoid:** az havalanma ya da sklerozis işaretleri körleştirir ve alanı daraltır. Büzüşen mastoidde tegmen sarkıp orta çukurun tabanını alçaltabilir; tegmen yaralanması sert zar yırtığına, BOS sızıntısına, temporal lob hasarına ya da ensefalosele yol açabilir (Ostrander ve ark., 2026). Antrum açılırken yapılan hatalar havalanmamış mastoidlerde anlamlı olarak daha sıktır; antrum küçük, tegmen alçaktır (Motta ve ark., 2024).
- **Trautmann üçgeni:** alt köşesini juguler bulbus, üst tabanını sinodural açı yapar; ön sınırı arka yarım daire kanalıdır (Tudose ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Retrosigmoid yaklaşımda hava hücreleri',
      md: `Arka kafa çukuruna kulağın arkasından yapılan retrosigmoid yaklaşımda mastoid hücrelerinin nerede bittiğini bilmek önemlidir. Bir seride mastoid delik olguların %99,4’ünde, mastoid emisser ven kanalı %88’inde en arkadaki mastoid hücresinin arkasındaydı; ikisi de hücrelerin sınırı için güvenilir işaretlerdir. Havalanma derecesi yaşla ters ilişkiliydi. Ameliyatta hücre açılması %5,6 oranında oldu; bunların hepsinde havalanma en yüksek derecedeydi (Han 4. derece) ve emisser ven kanalı hücrelerin “içinden” geçiyordu (Donofrio ve ark., 2026).

Vestibüler schwannom ameliyatında BOS sızıntısı gelişenlerde şakak kemiğinin havalanma hacmi daha büyüktü (sol tarafta ortanca 13,65 cm³’e karşı 10,65 cm³); sızıntıyla en güçlü ilişkili bölge petröz apeks havalanmasıydı (Zaczkowski ve ark., 2024). Asterion ve transvers-sigmoid bileşkesiyle ilgili işaretler ünitenin genel bakış dersinde anlatıldı.`,
    },

    // ——— Alt yüz ve kayalık kısım ———
    {
      tur: 'sahne',
      baslik: 'Sol şakak kemiği alttan',
      aciklama:
        'Aynı kemiğe alttan bakıyoruz (görüntünün üstü ön, yani yüz tarafı; sağı dış yan). Önde çene eklem çukuru ve onun önündeki eklem tümseği; ortada aşağı uzanan stiloid çıkıntı; onun arkasında stilomastoid delik ve dışta mastoid çıkıntı. İçe doğru uzanan sivri kol kayalık kısımdır: üzerinde karotis kanalının yuvarlak ağzı ve onun arkasında juguler çukur, en içte kayalık kısmın tepesi görülür. Stilomastoid delik, karotis kanalı ve juguler çukur noktaları yaklaşıktır: modelde kanallar kapalı, noktalar ağızlarının yerini gösterir.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'alt',
        goster: ['sakak-kemigi-sol'],
        vurgula: ['sakak-kemigi-sol'],
        boya: [{ secici: ['sakak-kemigi-sol'], renk: KEMIK_RENGI.sakak }],
        noktalar: [
          { nokta: 'eklem-tumsegi-sol' },
          { nokta: 'cene-eklem-cukuru-sol' },
          { nokta: 'stiloid-cikinti-sol' },
          { nokta: 'stilomastoid-delik-sol' },
          { nokta: 'mastoid-cikinti-sol' },
          { nokta: 'karotis-kanali-dis-agzi-sol' },
          { nokta: 'juguler-cukur-sol' },
          { nokta: 'kayalik-tepe-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      md: `Alttan bakınca kemiğin kafa tabanına katılan yüzü görünür. Küçük bir alana önemli kapılar sığar:

- **Karotis kanalı** (*canalis carotidis*): büyük, yuvarlak dış ağzından giren kanal önce dikey yükselir, sonra dirsek yapıp öne ve içe doğru yatay ilerler; iç karotis arteri ve çevresindeki sinir ağını kafatasına taşır (Gray, 1918).
- **Juguler çukur** (*fossa jugularis*): karotis kanalının arkasındaki derin çukur; iç juguler venin bulbusunu barındırır. Derinliği kafatasından kafatasına değişir (Gray, 1918).
- **Stilomastoid delik** (*foramen stylomastoideum*): stiloid ile mastoid çıkıntılar arasındadır; yüz siniri kemiğin içindeki kanalını burada bitirip dışarı çıkar (Gray, 1918).
- **Kayalık kısmın tepesi** (*apex partis petrosae*): kama kemiğinin büyük kanadı ile art kafa kemiği arasındaki açıya girer (Gray, 1918).

Kemiğin beyne bakan arka yüzünde bir delik daha vardır: **iç kulak yolu** (*meatus acusticus internus*). Yaklaşık 1 cm uzunluğundaki bu kısa kanal, yüz siniri ile işitme-denge sinirini kemiğin içine alır (Gray, 1918; FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Beş parça (Gray):** pul kısmı, kayalık kısım, mastoid kısım, timpanik kısım, stiloid çıkıntı.

**Dışarıdan:** dış kulak yolu, elmacık çıkıntısı, çene eklem çukuru ve eklem tümseği, mastoid çıkıntı, stiloid çıkıntı, Macewen üçgeni.

**Alttan ve içeriden:** karotis kanalı (iç karotis arter), juguler çukur (iç juguler venin bulbusu), stilomastoid delik (yüz sinirinin çıkışı), iç kulak yolu (yüz siniri ve işitme-denge siniri).

**Beş komşu:** art kafa, yan kafa, kama, elmacık kemiği, alt çene.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: `İç kulağı saran kemik kapsül vücudun **en sert ve en yoğun kemiğidir** (Ostrander ve ark., 2026). Kafatası doğumdan 7 yaşına kadar hızla büyür; bu yaşa gelindiğinde şakak kemiklerinin kayalık kısımları erişkin boyutuna ulaşmıştır (Gray, 1918). Mastoid çıkıntı ise doğumda henüz gelişmemiştir; içindeki hava odacıkları çocukluk boyunca gelişir ve 5 yaşında belirginleşir (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kayalık kısmın ön yüzü** orta kafa çukurunun arka bölümünü yapar ve pul kısmının iç yüzüyle devam eder; ikisini birleştiren petroskuamöz dikişin izi ileri yaşa kadar seçilir (Gray, 1918). Gray bu yüzde altı işaret sayar (Gray, 1918):

1. Ortaya yakın **arkuat kabarıklık** (*eminentia arcuata*): üst yarım daire kanalının yerini gösterir. TA2’de bu kanalın adı ön yarım daire kanalıdır (*canalis semicircularis anterior*) (FIPAT, 2019).
2. Kabarıklığın önünde ve dışında, orta kulak boşluğunun üstündeki son derece ince kemik: **tegmen tympani**.
3. **Büyük petrozal sinir hiatusu:** büyük petrozal sinir ile orta meningeal arterin petrozal dalının geçtiği açıklık. Gray’in “fasiyal kanal hiatusu” dediği bu açıklığın TA2’deki adı *hiatus canalis nervi petrosi majoris*’tir; eski ad yanıltıcı bulunmuştur (FIPAT, 2019).
4. Onun dışında bazen görülen, küçük petrozal sinir için daha küçük bir açıklık (*hiatus canalis nervi petrosi minoris*).
5. Tepeye yakın, karotis kanalının sonlandığı yer; kanalın ön duvarı burada eksiktir.
6. Bu kanalın üstünde trigeminal gangliyonu barındıran sığ **trigeminal çukurluk** (*impressio trigeminalis*). Gray gangliyonu eski adıyla “yarımay gangliyonu” diye anar (FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Arka yüz** arka kafa çukurunun ön bölümünü yapar ve mastoid kısmın iç yüzüyle devam eder. Ortasına yakın **iç kulak yolunun ağzı** (*porus acusticus internus*) bulunur: boyu kişiden kişiye çok değişir, kenarları düzgün ve yuvarlaktır, yaklaşık 1 cm uzunluğunda, dışa doğru giden kısa bir kanala açılır. Gray’e göre kanaldan yüz siniri, “akustik” sinir ve baziler arterin iç işitme dalı geçer (Gray, 1918); bugünkü adlarıyla işitme-denge siniri (*n. vestibulocochlearis*) ve labirent arteri (*a. labyrinthi*). TA2 labirent arterini ön alt serebellar arterin dalı olarak listeler (FIPAT, 2019). Ağzın arkasında ince bir kemik levhanın neredeyse gizlediği bir yarık **vestibüler akuedüğe** (TA2: *canaliculus vestibuli*) açılır; içinden endolenfatik kanal ile küçük bir arter ve ven geçer. İki açıklığın üstünde ve arasında, sert zarın bir uzantısını ve küçük bir veni barındıran düzensiz bir çukurluk vardır (Gray, 1918).

**Alt yüz** pürüzlüdür ve dış kafa tabanına katılır; Gray burada on bir yapı sayar: tepeye yakın dörtgen pürüzlü alan (levator veli palatini kası ve östaki borusunun kıkırdak bölümü kısmen buraya tutunur), karotis kanalının dış ağzı, koklear akuedüğün ağzı, juguler çukur, alt timpanik kanalcık, mastoid kanalcık, juguler yüz, vajinal çıkıntı, stiloid çıkıntı, stilomastoid delik ve timpanomastoid yarık (Gray, 1918). Ayrıntıları aşağıdaki tablolarda.

**Kenarlar.** Gray’in “üst açısı” bugün **kayalık sırttır** (*crista petrosa*): en uzun kenardır, üst petrozal sinüs için oluk taşır, beyincik çadırı (*tentorium cerebelli*) buraya tutunur ve iç ucundaki çentikte trigeminal sinir yatar (Gray, 1918; FIPAT, 2019). Arka kenarın iç yarısındaki oluk, art kafa kemiğindeki karşılığıyla alt petrozal sinüsün kanalını; dış yarısındaki juguler çukur da art kafa kemiğinin juguler çentiğiyle **juguler deliği** yapar. Ön kenarın iç bölümü kama kemiğinin dikensi çıkıntısıyla eklem yapar; dış bölümü pul kısmına petroskuamöz dikişle bağlanır (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Sol şakak kemiği içeriden',
      aciklama:
        'Sol şakak kemiğine beyin tarafından, yani iç yüzünden bakıyoruz (ekranın sağı ön). Üstte pul kısmının iç yüzü; altta çapraz uzanan kalın sırt kayalık kısımdır ve tepesi öne-içe uzanır. Kayalık kısmın arka yüzündeki delik iç kulak yolunun ağzıdır; üst yüzündeki kabarıklık arkuat kabarıklıktır. Arkada mastoid kısmın iç yüzündeki geniş oluk sigmoid sinüsü taşır. Arkuat kabarıklık ve sigmoid oluk noktaları yaklaşıktır: sadeleştirilmiş modelde kabarıklığın sınırı belirsiz, oluk geniş ve sığdır.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ic-sol',
        goster: ['sakak-kemigi-sol'],
        vurgula: ['sakak-kemigi-sol'],
        boya: [{ secici: ['sakak-kemigi-sol'], renk: KEMIK_RENGI.sakak }],
        noktalar: [
          { nokta: 'kayalik-tepe-sol' },
          { nokta: 'arkuat-kabariklik-sol', metin: 'Arkuat kabarıklık (yaklaşık)' },
          { nokta: 'ic-kulak-yolu-sol' },
          { nokta: 'sigmoid-olugu-sol', metin: 'Sigmoid sinüs oluğu (yaklaşık)' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kayalık kısım kama ile art kafa kemiği arasında',
      aciklama:
        'Kafatası tabanının bir parçasına yukarıdan bakıyoruz (görüntünün üstü yüz tarafı). Yeşil sol şakak kemiğinin kayalık kısmı, kırmızı kama kemiği ile mor art kafa kemiği arasına kama gibi girer; tepesi öne ve içe uzanır. Kayalık kısmın üst kenarı orta kafa çukurunu arka kafa çukurundan ayıran kayalık sırttır: önündeki yüzde arkuat kabarıklık, arkasındaki yüzde iç kulak yolunun ağzı bulunur. Arkuat kabarıklık ve sigmoid oluk noktaları yaklaşıktır (modelde sınırları silik). “Ayrıştır” ile üç kemiği birbirinden uzaklaştırabilirsin.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ust',
        goster: ['sakak-kemigi-sol', 'kama-kemigi', 'art-kafa-kemigi'],
        vurgula: ['sakak-kemigi-sol', 'kama-kemigi', 'art-kafa-kemigi'],
        boya: [
          { secici: ['sakak-kemigi-sol'], renk: KEMIK_RENGI.sakak },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
        ],
        etiketler: [{ yapi: 'kama-kemigi' }, { yapi: 'art-kafa-kemigi' }],
        noktalar: [
          { nokta: 'kayalik-tepe-sol' },
          { nokta: 'arkuat-kabariklik-sol', metin: 'Arkuat kabarıklık (yaklaşık)' },
          { nokta: 'ic-kulak-yolu-sol' },
          { nokta: 'sigmoid-olugu-sol', metin: 'Sigmoid sinüs oluğu (yaklaşık)' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kayalık kısmın işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA2)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        ['Arkuat kabarıklık', '*Eminentia arcuata*', 'Ön yüzün ortası', 'Altında üst (TA2’de ön) yarım daire kanalı'],
        ['Tegmen tympani', '*Tegmen tympani*', 'Ön yüz; kabarıklığın önü-dışı', 'Orta kulak boşluğu ve antrumun tavanı'],
        [
          'Büyük petrozal sinir hiatusu ve oluğu',
          '*Hiatus canalis nervi petrosi majoris*; *sulcus nervi petrosi majoris*',
          'Ön yüz',
          'Büyük petrozal sinir; orta meningeal arterin petrozal dalı',
        ],
        [
          'Küçük petrozal sinir hiatusu ve oluğu',
          '*Hiatus canalis nervi petrosi minoris*; *sulcus nervi petrosi minoris*',
          'Büyük hiatusun dışı (her zaman görülmez)',
          'Küçük petrozal sinir',
        ],
        ['Trigeminal çukurluk', '*Impressio trigeminalis*', 'Tepeye yakın ön yüz', 'Trigeminal gangliyon'],
        [
          'Kayalık sırt',
          '*Crista petrosa*',
          'Orta ve arka kafa çukurlarının sınırı',
          'Üst petrozal sinüs oluğu; beyincik çadırı; iç uçtaki çentikte trigeminal sinir',
        ],
        [
          'İç kulak yolu',
          '*Porus* ve *meatus acusticus internus*',
          'Arka yüzün ortası',
          'Yüz siniri, işitme-denge siniri, labirent arteri',
        ],
        ['Vestibüler akuedük', '*Canaliculus vestibuli*', 'İç kulak yolu ağzının arkası', 'Endolenfatik kanal; küçük arter ve ven'],
        ['Subarkuat çukur', '*Fossa subarcuata*', 'İç kulak yolu ağzının üstü-arkası', 'Sert zar uzantısı; küçük ven'],
        ['Dörtgen pürüzlü alan', '—', 'Alt yüz, tepeye yakın', 'Levator veli palatini kası; östaki borusunun kıkırdak bölümü'],
        [
          'Karotis kanalı',
          '*Canalis carotidis* (*apertura externa / interna*)',
          'Alt yüzdeki dış ağızdan tepedeki iç ağza',
          'İç karotis arter; karotis sinir ağı',
        ],
        [
          'Koklear akuedük',
          '*Canaliculus cochleae*',
          'Juguler çukurun önü',
          'Perilenf boşluğunu subaraknoid boşluğa bağlayan sert zar uzantısı; kokleadan iç juguler vene giden ven',
        ],
        [
          'Juguler çukur',
          '*Fossa jugularis*',
          'Alt yüz, karotis kanalının arkası',
          'İç juguler venin bulbusu (*bulbus superior venae jugularis internae*)',
        ],
        [
          'Alt timpanik kanalcık',
          '*Canaliculus tympanicus inferior*',
          'Karotis kanalını juguler çukurdan ayıran sırt',
          'IX. sinirin timpanik dalı (Jacobson siniri)',
        ],
        ['Mastoid kanalcık', '*Canaliculus mastoideus*', 'Juguler çukurun dış bölümü', 'Vagusun kulak dalı (Arnold siniri) girer'],
        ['Juguler yüz', '—', 'Juguler çukurun arkası', 'Art kafa kemiğinin juguler çıkıntısıyla kıkırdaklı eklem'],
        [
          'Muskulotubal kanal',
          '*Canalis musculotubarius*',
          'Kayalık kısım ile pul kısmının birleşme açısı',
          'Üstte tensor tympani kası; altta östaki borusunun kemik bölümü',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019). Gray’in alt yüzde saydığı on bir yapının geri kalanı (vajinal çıkıntı, stiloid, stilomastoid delik, timpanomastoid yarık) önceki tablodadır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Karotis kanalı.** Kanal alt yüzdeki büyük yuvarlak ağızdan girer, önce dikey yükselir, sonra dirsek yapıp öne ve içe yatay ilerler (Gray, 1918). Kayalık kısmın içinde iç karotis arterin seyrine uyan bir arka dikey bölüm, bir arka dirsek ve bir yatay bölüm ayırt edilir (Tayebi Meybodi ve ark., 2023). İç ağzı kayalık kısmın tepesindedir; tepe aynı zamanda foramen lacerumun arka-dış sınırını yapar (Gray, 1918).

**Juguler çukur ve bulbus.** **Juguler bulbus** (*bulbus superior venae jugularis internae*), sigmoid sinüsü iç juguler vene bağlayan ve orta kulak boşluğunun tabanına doğru kubbe gibi uzanan genişlemedir (Tudose ve ark., 2024; FIPAT, 2019). Bulbusun oturduğu juguler çukurun derinliği ve büyüklüğü kafatasından kafatasına değişir; çukurun ortasından bazen bir çıkıntı uzanıp juguler deliği ikiye böler (Gray, 1918), TA2’deki adıyla *processus intrajugularis ossis temporalis* (FIPAT, 2019). Bulbus büyük, kemik örtüsü eksik (dehisan) ya da cepli (divertikül) olabilir (Ostrander ve ark., 2026). Dehisan bulbus, sigmoid kemik levhasındaki bir açıklıktan orta kulağa uzanır ve yalnızca ince bir mukozayla örtülüdür (Tudose ve ark., 2024).

**Muskulotubal kanal.** Kayalık kısım ile pul kısmının birleştiği açıda, ince bir kemik bölmeyle ayrılmış, üst üste iki kanal vardır: üstteki tensor tympani kasını taşır, alttaki östaki borusunun kemik bölümüdür (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kulakta nabız sesi',
      md: `Kalp atışıyla eş zamanlı duyulan kulak çınlamasına **pulsatil tinnitus** denir. Nedenleri çoktur; en sık ve tedavi edilebilir nedeni sigmoid sinüsün cep yapması ya da oluğun kemik duvarının eksik olmasıdır (**sigmoid sinüs divertikülü ve/veya dehisansı**). Bazı çalışmalara göre pulsatil tinnitusun %20’ye varan kısmından bu durum sorumludur. Önerilen mekanizmaya göre sinüsteki akımın sesi ya da duvarın titreşimi, eksik kemik levha ve şakak kemiğindeki hava hücreleri yoluyla iç kulağa iletilir (Wenjuan ve ark., 2015). Gray’in “sinüs oluğunu en içteki mastoid hücrelerinden ayıran ince levha kısmen eksik olabilir” gözlemi bu tablonun anatomik temelidir (Gray, 1918). Yüksek yerleşimli juguler bulbusun en sık belirtisi de kulak çınlamasıdır (Tudose ve ark., 2024).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**İç kulak yolunun ölçüleri.** İç ağız (porus) ön-arka 8,6 mm, dikey 5,6 mm; dip (fundus) ön-arka 2,5 mm, dikey 4,0 mm’dir; yani kanal huni gibi daralır (Tayebi Meybodi ve ark., 2023). Ağız kayalık sırtın yaklaşık 5 mm altında, trigeminal çukurluğun arka dudağının 5 mm arkasındadır (Tayebi Meybodi ve ark., 2023).

**Dipteki bölmeler.** Kanalın dış ucunu dikey bir kemik levha kapatır. Yatay bir krista (Gray’de *crista falciformis*, TA2’de *crista transversa*) levhayı iki eşit olmayan bölüme ayırır; her bölüm de dikey bir sırtla ön ve arka parçalara bölünür (Gray, 1918; FIPAT, 2019). Üst bölmeyi bölen ince dikey kristaya (*crista verticalis*), William House onuruna **Bill çubuğu** denir (Tayebi Meybodi ve ark., 2023). Yatay krista yüz sinirini alttaki koklear sinirden, Bill çubuğu ise arkadaki üst vestibüler sinirden ayırır; yüz siniri kanalın ön-üst çeyreğinde seyreder (Gupta ve ark., 2013).

**Vestibüler akuedük** endolenfatik kanalın istmus ve rugoz bölümlerini içeren kemik kanaldır. J harfi gibi arkaya ve dışa uzanır ve operkulum denen dış ağzıyla kemiğin arka yüzünden arka kafa çukuruna açılır (Roesch ve ark., 2021). Genişlemiş vestibüler akuedük en sık saptanan iç kulak malformasyonudur (Roesch ve ark., 2021); ölçütleri görüntüleme kutusunda.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'İç kulak yolunun dibi (fundus)',
      sutunlar: ['Bölme', 'TA2 adı (Gray’in adı)', 'İçinden geçen'],
      satirlar: [
        ['Ön-üst', '*Area nervi facialis* (area facialis)', 'Yüz siniri: yüz siniri kanalının başlangıcındaki büyük delik'],
        [
          'Arka-üst',
          '*Area vestibularis superior* (area cribrosa superior)',
          'Utrikül ile üst ve lateral yarım daire kanallarına giden sinirler (üst vestibüler sinir)',
        ],
        [
          'Ön-alt',
          '*Area cochlearis*; *tractus spiralis foraminosus*',
          'Koklear sinir: kokleanın merkez kanalını çevreleyen sarmal dizilmiş delikçiklerden',
        ],
        ['Arka-alt', '*Area vestibularis inferior* (area cribrosa media)', 'Sakküle giden sinirler'],
        ['Arka-alt alanın altı ve arkası', '*Foramen singulare*', 'Arka yarım daire kanalına giden sinir'],
        [
          'Bölmeleri ayıranlar',
          '*Crista transversa* (crista falciformis); *crista verticalis* (Bill çubuğu)',
          'Yatay krista üst ve alt bölmeleri; dikey krista üst bölmede yüz sinirini üst vestibüler sinirden ayırır',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Gupta ve ark. (2013); Tayebi Meybodi ve ark. (2023).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Orta çukurdan kayalık kısma',
      md: `- **Duvarlar ve taban:** orta kafa çukurunu iki kemik yapar: kama ve şakak kemiği. Çukurun dış duvarını arkada pul kısmı, önde kama kemiğinin büyük kanadı yapar; aralarında sfenoskuamöz dikiş vardır. Taban önde neredeyse elmacık kemeri düzeyindedir, arkaya doğru yükselir (Tayebi Meybodi ve ark., 2023).
- **Arkuat kabarıklık** orta çukurların %85’inde belirgin, kalanında neredeyse yoktur. Dış ucu hemen her zaman üst yarım daire kanalının dış kolunun üstündedir; iç ucu kanalın iç kolundan genellikle arkaya sapar, öne asla sapmaz. Tepesi koronal düzlemde kafatası iç tablasının ortalama 22 mm (18–25) içinde ve hemen her zaman elmacık arka kökünün koronal düzleminin arkasındadır; ortalama olarak kanal tepesinin 4,2 mm üstünde, 5,3 mm dışında, 6,3 mm arkasındadır. Fisch bu kanalı orta çukur cerrahisinde iç kulak yolunu bulmak için sabit bir işaret olarak kullandı (Tayebi Meybodi ve ark., 2023).
- **Büyük petrozal sinir oluğu** tam biçimde yalnızca orta çukurların %10’unda V3’ün arka kenarına, foramen ovalenin ortalama 7,5 ± 2,9 mm (3,0–12,0) arkasına kadar uzanır; olguların %65’inde eksik, %25’inde yoktur (Tayebi Meybodi ve ark., 2023).
- **Genikulat gangliyon:** kemik örtüsü örneklerin %15–25’inde eksik ya da yoktur ve sert zar kaldırılırken zedelenebilir (Tayebi Meybodi ve ark., 2023); başka bir kaynağa göre olguların %18’e varanında gangliyon doğrudan orta çukurun sert zarına değer (Gupta ve ark., 2013).
- **İç kulak yolunun üstü:** trigeminal kabarıklık ile arkuat kabarıklık arasındaki hafif **meatal çukurluk** iç kulak yolunun üstüne düşer. Kanal boyunca dışa gidildikçe üstteki kemik incelir ve yüz sinirinin labirent segmentinin üstünde milimetrenin altına iner (Tayebi Meybodi ve ark., 2023).
- **Kayalık sırt:** tepenin hemen arkasında sırttaki hafif çukurluk trigeminal siniri barındırır. Sırt geride transvers-sigmoid bileşkenin üstünde küçük bir çıkıntı yapar ve pul kısmına “arka petröz nokta”da ulaşır (Tayebi Meybodi ve ark., 2023).
- **Tegmen tympani** son derece incedir (Gray, 1918). Kabarıklığın tipleri ve iç kulak yolunu bulma açısı ünitenin genel bakış dersinde anlatıldı.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kayalık kısmın ucu (petröz apeks)** şakak kemiğinin en iç bölümüdür; sıkı kemik ve kemik iliğinden oluşur. Havalanması mastoid hücrelerinden içe doğru gelişen arka-üst ve arka-iç hücre yollarıyla olur ve şakak kemiğinin öteki bölümlerinden bağımsız bir süreç olabilir (Lee ve ark., 2015). Erişkinlerin yaklaşık üçte birinde apeks hiç havalanmamıştır (Lee ve ark., 2015). İtalya’da 200 BT’de havalanma apekste %20–32, çene eklem çukurunda %29–40, labirent altında %20–40 oranında bulundu; apeks ve labirent altı havalanması erkeklerde kadınlardan fazlaydı (Gibelli ve ark., 2021). Şakak kemiğinin havalanması beş bölgede incelenir: orta kulak, mastoid, labirent çevresi, petröz apeks ve pul, elmacık, art kafa ve stiloid uzantıları (Adışen ve Aydoğdu, 2022). En geniş havalanmada (III. derece) hücreler bütün mastoidi ve ucunu doldurur, yarım daire kanallarının çevresine ve lateral sinüsün sınırlarının ötesine geçer, hatta karotis kanalını sarar (Whyte-Orozco ve ark., 2024).

**Apeksin “hastalıkları”.** Asimetrik havalanma görüntülemede gerçek bir lezyon sanılabilir (Lee ve ark., 2015). Apeksteki bulguların en sık olanları asimetrik havalanma ve sıvıdır; bunlar sayıca kolesterol granülomunu geçer, granülomun görülme sıklığı ise milyonda 0,6’dır (Li ve ark., 2020). 34 kolesterol granülomu hastasının ortalama 7,1 yıllık izleminde belirgin büyüme %14,7 oranında görüldü; bekle-izle grubunda büyüme %9,5, yakınmalarda artış %9,5, yeni yakınma %4,8 oranındaydı (de Bock ve ark., 2023). Kayalık uca yayılan iltihabın yaptığı Gradenigo sendromu ünitenin genel bakış dersinde vaka olarak işlendi.

**Karotis kanalının komşuları.** Karotis kanalı insan vücudundaki en uzun ve en geniş kemik kanaldır. Östaki borusu kanala paralel ve onun hemen dışında uzanır; ikisini genellikle yaklaşık 2 mm kalınlığında ince bir kemik ayırır. Koklea ile iç karotis arter arasındaki en kısa mesafe kokleanın bazal turu ile arterin arka dirseği arasındadır (ortalama 1,9 mm). Tensor tympani kası olguların %72’sinde östaki borusunun üstündedir, ama önünde ya da arkasında da olabilir; kas orta kulağın önündeki ince bir kemik çıkıntının (trokleariform çıkıntı) çevresinden keskin dönüp tendona dönüşür ve malleus sapına yapışır (Tayebi Meybodi ve ark., 2023).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Juguler bulbusun çeşitliliği.** Bulbus çapı için ≤5 mm hipoplazi, ≥15 mm hiperplazi sınırları önerilmiştir (Tudose ve ark., 2024). “Yüksek juguler bulbus”un sıklığı tanıma ve yönteme göre %0 ile %46 arasında değişir; kuru kafataslarında iç kulak yolu ile bulbus arasında en çok 2 mm kalmasını ölçüt alan bir çalışmada %46 bulunmuştur (Tudose ve ark., 2024).

Benzer tanım kullanıldığında bile sayılar çok farklı çıkabilir: bulbusun iç kulak yolunun alt kenarından yüksekte olmasını ölçüt alan iki seriden Aksoy ve arkadaşları belirtisiz çocuklarda BT ile %42,8, Atmaca ve arkadaşları yüksek çözünürlüklü BT ile %15,2 bildirmiştir. Atilla ve arkadaşlarının serisinde 142 yüksek bulbusun 27’si dehisandı; olguların %74’ü sağda, %26’sı soldaydı ve %7’si iki taraflıydı. Bir çalışmada yüksek bulbus en sık 35–45 yaş grubunda görüldü (%17,6) (Tudose ve ark., 2024’ün aktarımı).

Ani sensörinöral işitme kaybında tedavinin toplam etkinliği yüksek bulbusu olanlarda %54,8, olmayanlarda %87,1’di (Wanting ve ark., 2025). Kulak cerrahisinde yüksek bulbus ve önde yerleşmiş sigmoid sinüs alanı daraltır (Ostrander ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka 2: Kendi sesini kulağının içinde duyan öğretmen',
      oyku: `46 yaşında bir öğretmen, bir yıldır sol kulağında kendi sesini rahatsız edici biçimde yüksek duyduğunu (otofoni), ara ara baş dönmesi yaşadığını ve sol kulağıyla eskisi kadar iyi duymadığını anlatıyor. Kulak muayenesi normal. Yüksek çözünürlüklü BT raporunda sol arkuat kabarıklığın tepesinde, üst yarım daire kanalının üstündeki kemik örtüde yaklaşık 1 mm’lik bir kesinti bildiriliyor; aynı tarafta orta kulak tavanının yer yer çok ince olduğu ve mastoidin iyi havalandığı da not edilmiş.`,
      soru: 'BT bulgusu bu yakınmaları açıklayabilir mi ve tanıya karar vermeden önce hangi anatomik ve görüntüleme ayrıntıları göz önüne alınmalıdır?',
      cozum: `**Anatomi:** Arkuat kabarıklık, üst yarım daire kanalının kayalık kısmın ön yüzünde yaptığı kabarıklıktır (Gray, 1918; Ostrander ve ark., 2026). Kanalın üstündeki kemik örtünün eksikliğine **üst yarım daire kanalı dehisansı** denir; sendromu ilk kez 1998’de Minor ve arkadaşları tanımladı (Lazarou ve ark., 2025). Otofoni, işitme yakınmaları ve baş dönmesi bu tablonun yakınmalarıdır: cerrahi onarım yapılan 350 hastalık bir seride otofoni %74,9, işitme %62,9, baş dönmesi %54,6 oranında düzelmiştir (Lazarou ve ark., 2025’in aktarımı).

**Görüntüleme yanılgısı:** Carey ve arkadaşlarının 1000 kadavra şakak kemiğini mikroskopla incelediği çalışmada tam dehisans %0,5, kemiğin ≤0,1 mm olduğu “neredeyse dehisans” %1,4 bulunmuştur; oysa yüksek çözünürlüklü BT çalışmaları %3–9 bildirir, yani BT aşırı tanı koyabilir (Al Shaili ve ark., 2025). Umman’da belirtisiz 470 kulakta radyolojik dehisans %4,1 (GA %2,1–8,1), ortalama defekt 1,3 mm idi; aktarılan başka bir seride sıklık belirtisizlerde %2,0, belirtililerde %13,6’dır (Al Shaili ve ark., 2025). 0,5–0,6 mm kesitler tanının duyarlılığını %50’den %93’e çıkarır ve yanlış pozitifleri azaltır (Lazarou ve ark., 2025); kanala paralel Pöschl ve Stenvers düzlemleri kanalı en iyi gösterir (Ostrander ve ark., 2026). Bu yüzden BT bulgusu tek başına değil, yakınmalarla birlikte yorumlanır.

**Eşlik edenler:** Mastoid havalanması arttıkça kanalın üstündeki kemik incelir ve dehisans riski artar; kemik duvar kadınlarda daha ince olsa da sıklık iki cinsiyette eşittir (Lazarou ve ark., 2025). Tegmen tympani dehisansı olan 124 olgunun %28,2’sinde üst yarım daire kanalı dehisansı da vardı; biri saptanınca öteki de aranmalıdır, özellikle kulak kökenli menenjit ya da iletim tipi işitme kaybı varsa (Whyte-Orozco ve ark., 2024). Bu hastanın raporundaki ince orta kulak tavanı bu açıdan da değerlendirilmelidir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Timpanik kısım ve dış kulak yolu ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Timpanik kısım** pul kısmının altında, mastoid çıkıntının önünde kıvrık bir kemik levhadır. İçbükey arka-üst yüzü kemik dış kulak yolunun ön duvarını, tabanını ve arka duvarının bir bölümünü yapar; içte dar **timpanik oluğa** (*sulcus tympanicus*) kulak zarı tutunur (Gray, 1918). Ön-alt yüzü çene eklem çukurunun arka sınırıdır ve parotis bezinin çene arkasındaki bölümüne değer. Serbest ve pürüzlü dış kenarına kulak yolunun kıkırdak bölümü tutunur. Alt kenarın iç bölümü ince ve keskindir; dış bölümü ikiye ayrılıp stiloid çıkıntının kökünü sarar; bu kılıfa **vajinal çıkıntı** denir (TA2: *vagina processus styloidei*) (Gray, 1918; FIPAT, 2019). Timpanik halkadaki çentiğin TA2’deki adı *incisura tympanica*’dır (Rivinus çentiği) (FIPAT, 2019).

**Kemik dış kulak yolu** içe ve hafif öne yönelir; hafifçe kıvrılır ve tabanı yukarı doğru dışbükeydir. Ön duvarı, tabanı ve arka duvarının alt bölümü timpanik kısımdan; tavanı ve arka duvarının üst bölümü pul kısmından yapılır (Gray, 1918). Gray kanalın uzunluğunu “yaklaşık 2 cm” diye verir, ama bunun yalnızca kemik bölümü mü yoksa bütün kanalı mı anlattığı metinde açık değildir (Gray, 1918).

**Huschke deliği.** Timpanik kısmın orta bölümü incedir ve Gray’e göre kafataslarının “önemli bir yüzdesinde” bir delikle delinmiştir: **Huschke deliği** (Gray, 1918). Delik dış kulak yolunun ön-alt duvarında, çene ekleminin arka-içinde yer alır (Hasani ve ark., 2022). Nasıl oluştuğu aşağıda, kemikleşme bölümünde anlatılıyor.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka 3: Çiğnerken kıpırdayan kulak',
      oyku: `34 yaşında bir kadın, aylardır süren sol kulak ağrısı ve ara ara gelen akıntıyla başvuruyor. Birkaç kez kulak damlası kullanmış, yakınması geçmemiş. Otoskopide sol dış kulak yolunun ön-alt duvarında küçük, yumuşak bir kabarıklık görülüyor; ağzını açıp kapaması istenince kabarıklığın da yer değiştirdiği dikkati çekiyor. Kulak zarı sağlam.`,
      soru: 'Kulak yolundaki kabarıklık neden çene hareketiyle oynuyor ve bu durumun gelişimsel temeli nedir?',
      cozum: `**Anatomi:** Dış kulak yolunun ön duvarını ve tabanını timpanik kısım yapar; bu levhanın orta bölümü incedir ve bazen **Huschke deliğiyle** delinmiştir (Gray, 1918). Delik kulak yolunun ön-alt duvarında, çene ekleminin hemen arka-içindedir (Hasani ve ark., 2022). Kulak yolu ile çene eklemi bölgesi arasında açık bir geçit bulunduğundan çene hareketi kulak yoluna yansıyabilir.

**Gelişim:** Timpanik halkanın ön ve arka uzantıları büyüyüp birleşirken kulak yolunun tabanında bir süre bir delik kalır; delik genellikle 5 yaş dolayında kapanır ama ömür boyu açık kalabilir (Gray, 1918). Güncel kaynak da halkanın doğumda eksik olduğunu, ön ve arka çıkıntıların ilk 5 yılda kaynaştığını yazar (Macielak ve ark., 2022). Mastoid büyüyüp timpanik kısmı öne ittiğinden, deliği taşıyan eski taban erişkinde kulak yolunun ön duvarında bulunur (Gray, 1918).

**Klinik:** Belirtili kalıcı Huschke deliği olan hastaları anlatan bir seride kulak ağrısı ve akıntı öne çıkıyordu ve muayenede çene hareketiyle kulak yolunda yer değiştiren bir kitle tipikti (Macielak ve ark., 2022). Rastlantısal kalıcı Huschke deliği şakak kemiği görüntülemesi yapılanların %11,5–20’sinde bildirilirken, konik ışınlı BT ile yapılan başka bir seride sıklık çene eklemi bozukluğu olanlarda %3,4, olmayanlarda %0,8’dir (Macielak ve ark., 2022; Hasani ve ark., 2022); sayılar yönteme göre çok farklıdır. Deliğin bir önemi daha vardır: çene eklemi artroskopisinde 3 mm’den ince endoskoplar bu delikten geçip kulak zarını delebilir, örsü yerinden oynatabilir ve yüz sinirinin timpanik segmentine zarar verebilir (Hasani ve ark., 2022). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Stiloid çıkıntı ———
    {
      tur: 'kutu',
      cesit: 'dikkat',
      md: `Bir görüntüleme raporunda “stiloid çıkıntı uzun” yazması tek başına hastalık anlamına gelmez. 30 mm’yi aşan stiloide “uzamış” denir; 104 çalışmayı birleştiren bir meta-analizde yarım boyunların yaklaşık dörtte birinde (%25) uzamış stiloid bulundu (Triantafyllou ve ark., 2025). Baş ağrısı, kulak ağrısı ve kulak çınlaması gibi yakınmalarla seyreden **Eagle sendromu** ise uzamış stiloidi olanların yalnızca %4–10,3’ünde görülür (Assiri Ahmed ve ark., 2023).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Stiloid çıkıntı** ince, sivri ve uzunluğu değişken bir çıkıntıdır; şakak kemiğinin alt yüzünden aşağı ve öne uzanır (Gray, 1918). Stilomastoid deliğin hemen önünde, kayalık kısmın alt yüzünden çıkar (Assiri Ahmed ve ark., 2023). Kökü (timpanohiyal bölüm) vajinal çıkıntının kılıfı içindedir; geri kalanına (stilohiyal bölüm) stilohiyoid ve stilomandibular bağlar ile stiloglossus, stilohiyoid ve stilofarengeus kasları tutunur. **Stilohiyoid bağ** çıkıntının ucundan dil kemiğinin küçük boynuzuna uzanır; bazı kişilerde kısmen, bazılarında tamamen kemikleşir (Gray, 1918). Stiloid–stilohiyoid zincir ikinci faringeal arkın kıkırdağından (Reichert kıkırdağı) gelişir (Assiri Ahmed ve ark., 2023; Bănică ve ark., 2026).

**Komşuluklar.** Boyunda iç ve dış karotis arterleri ile iç juguler venin arasında uzanır (Assiri Ahmed ve ark., 2023); iç ve dış karotis arterleri arasından, IX–XII. kafa sinirleri ve sempatik zincirin yanından geçer (Bănică ve ark., 2026). Bu komşuluk, uzun ya da açılı bir stiloidin neden damar ve sinir yakınmalarına yol açabildiğini açıklar.

**Uzunluk.** Güncel kaynaklarda olağan uzunluk 25–30 mm’dir ve 30 mm’yi aşan çıkıntı “uzamış” sayılır (Triantafyllou ve ark., 2025); 250 kuru kafatasında ortalama uzunluk 26,57 mm (SS 7,40) ölçülmüştür (Bănică ve ark., 2026). Gray 1918’de stiloidi “yaklaşık 2,5 cm” diye verir (Gray, 1918). Uzamış stiloidin bildirilen sıklığı yönteme ve topluma göre %3,3 ile %84,4 arasında çok geniş değişir; Barselona’daki bir panoramik grafi serisinde %72,75 bulunmuştur (Assiri Ahmed ve ark., 2023).

**Eagle sendromu** baş ağrısı, kulak çınlaması, kulak ağrısı ve trigeminal nevralji gibi baş-boyun ağrılarıyla seyreder (Assiri Ahmed ve ark., 2023). Klasik tipi neredeyse yalnızca bademcik ameliyatından ya da yutak travmasından sonra görülür (Bănică ve ark., 2026).`,
    },

    // ——— Yüz siniri kanalı ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yüz siniri kanalı** (*canalis facialis*; eski adıyla Fallop kanalı) iç kulak yolunun dibindeki ön-üst bölmeden, büyük bir delikle başlar (Gray, 1918; FIPAT, 2019). Sinirin şakak kemiği içindeki toplam yolu yaklaşık 30 mm’dir (Ryu ve Kim, 2016). Kemik kanal üç segmentten oluşur: **labirent**, **timpanik** (yatay) ve **mastoid** (dikey) segment; sinir stilomastoid delikten çıkar (Gupta ve ark., 2013; Ostrander ve ark., 2026).

- **Labirent segmenti** sinirin hem en dar (<0,7 mm çap) hem en kısa (3–5 mm) kesimidir (Gupta ve ark., 2013).
- **Timpanik segment** yatay uzanır; kemik örtüdeki doğal açıklıklar (dehisans) en sık bu segmentte, insanların %41–75’inde görülür (Gupta ve ark., 2013).
- **İkinci dirsekte**, piramidal çıkıntı hizasında, timpanik segment 95°–125° açıyla aşağı döner ve **mastoid segment** olur. Bu segment dış kulak yolu boyunca arka-içte aşağı iner ve erişkinde yaklaşık 13 mm sonra stilomastoid delikte biter (Gupta ve ark., 2013).

Kanalın dirseğine TA2’de *geniculum canalis facialis* denir (FIPAT, 2019). Büyük petrozal sinir kayalık kısmın ön yüzüne kendi adını taşıyan hiatustan çıkar (Gray, 1918; FIPAT, 2019). Korda timpani ise kanaldan arka timpanik kanalcıkla orta kulağa girer, ön timpanik kanalcıkla petrotimpanik yarığa ulaşır (FIPAT, 2019).`,
    },
    {
      tur: 'animasyon',
      duzey: 'lisans',
      ad: 'yuz-siniri-kanali',
      baslik: 'Yüz siniri kanalı adım adım',
      aciklama:
        'İç kulak yolundan stilomastoid deliğe: labirent kesimi, kanalın dirseği ve büyük petrozal sinir, timpanik kesim, ikinci dirsek, mastoid kesim ve korda timpani. Bir kesime dokun: uzunluğunu ve cerrahi önemini okursun.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yüz siniri kanalının kesimleri',
      sutunlar: ['Kesim', 'Uzunluk', 'Akılda tutulacak özellik'],
      satirlar: [
        ['İç kulak yolu içinde', '—', 'Sinir kanalın ön-üst çeyreğindedir; yüz siniri kanalı dipteki ön-üst bölmeden başlar.'],
        ['Labirent segmenti', '3–5 mm; 50 kemiklik diseksiyonda ortalama 4,1 mm', 'En kısa ve en dar kesim (<0,7 mm).'],
        ['Timpanik (yatay) segment', 'Diseksiyonda ortalama 9,34 mm', 'Kemik örtüdeki doğal açıklıklar en sık burada.'],
        ['İkinci dirsek', '—', 'Piramidal çıkıntı hizasında 95°–125° açıyla aşağı döner.'],
        [
          'Mastoid (dikey) segment',
          'Erişkinde ~13 mm; diseksiyonda 12,8 mm; bir kadavra kaynağında ~15 mm',
          'Dış kulak yolunun arka-içinde aşağı iner, stilomastoid delikte biter.',
        ],
      ],
      not: 'Uzunluklar farklı çalışmalardan ve farklı başlangıç-bitiş noktalarıyla ölçülmüştür; aralık olarak okunmalıdır. Kaynaklar: Gray (1918); Gupta ve ark. (2013); Kalaiarasi ve ark. (2018); Ryu ve Kim (2016).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Yüz siniri ve şakak kemiği',
      md: `- **Kırıklarda:** yüz siniri yaralanması enine kırıklarda (%38–50) uzunlamasına kırıklardan (%20) daha sıktır (Gupta ve ark., 2013). Kırık türleri ünitenin 6. dersinde ayrıntılı işleniyor.
- **Kulak ameliyatlarında:** ilk timpanomastoidektomide yüz sinirinin istemeden yaralanması %0,6–3,7, tekrar ameliyatlarda %4–10 oranında bildirilir (Kalaiarasi ve ark., 2018).
- **Dehisans:** kemik kanalda yaklaşık 0,4 mm ve daha büyük, hastalığa bağlı olmayan kesintiye dehisans, daha küçüklerine mikrodehisans denir (Kalaiarasi ve ark., 2018). Bu açıklıklar sık olduğundan cerrah kanalın her yerde kemikle örtülü olduğunu varsayamaz.
- **Bebekte:** bebek ile erişkin arasındaki tek fark stilomastoid delik bölgesindedir: mastoid ucu geliştikçe kafatası dışındaki sinir daha aşağıda ve daha içte konumlanır (Gupta ve ark., 2013). Mastoid ucu henüz gelişmemiş bebekte sinir bu yüzden daha yüzeyeldir.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Mastoid cerrahisinde yüz sinirini korumak',
      md: `- **İşaretler:** sinirin yerini bulmanın büyük işaretleri lateral yarım daire kanalı, örsün kısa çıkıntısı ve kemik dış kulak yolunun arka duvarıdır; küçük işaretler digastrik sırt, kokleariform çıkıntı ve oval penceredir (Ryu ve Kim, 2016).
- **Ölçüler:** 50 şakak kemiğinin diseksiyonunda ikinci dirsek kemik korteksten ortalama 19,12 mm (±1,8) derindeydi; korda timpani stilomastoid deliğin 2–6 mm (ortalama 4,4 mm) üstünden ayrılıyordu (Kalaiarasi ve ark., 2018). Mastoid segmentin alt üçte biri digastrik sırtın 2–5 mm ön-içindedir (Ryu ve Kim, 2016).
- **Fasiyal resesus** nadiren 3 mm’den geniştir; bu yüzden küçük frezler gerekir (Motta ve ark., 2024). Koklear implantta genişliğin (yüz siniri ile kulak zarı halkası arası, kokleanın bazal turu ve yuvarlak pencere düzeyinde) 2 mm’den büyük olması arka timpanotomiyle kolay erişimle ilişkilidir (Ostrander ve ark., 2026).
- **Yaralanma yeri:** mastoid cerrahisinde istemeden oluşan felcin en sık yeri ikinci dirsektir. Kore’den 14 yaralanmalık bir seride yaralanmaların %43’ü timpanik segmentte, %28,5’i ikinci dirsek ile timpanik segmentte birlikte, %28,5’i mastoid segmentteydi (Ryu ve Kim, 2016).
- **Sarkan sinir:** oval pencereye doğru içe sarkan yüz siniri mastoidektomi, stapedektomi ve koklear implantasyonda yaralanma riskini artırır (Ostrander ve ark., 2026).
- **Dehisans sıklığı:** timpanik segmentte %41–75 (Gupta ve ark., 2013); aktarılan bir çalışmada toplumun %57’sinde kanal dehisansı vardı ve bunların %74’ü oval pencere bölgesindeydi; 50 kemiklik diseksiyonda ise timpanik segment dehisansı %6’ydı (Kalaiarasi ve ark., 2018). Ameliyat sırasında saptanan dehisans literatürde %0,5–74 arasında verilir (Ryu ve Kim, 2016). Aralığın genişliği tanım ve yöntem farkını yansıtır.`,
    },

    // ——— Kemikleşme ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemikleşme merkezleri.** Güncel bir fetüs çalışmasına göre şakak kemiği toplam **10 birincil kemikleşme merkezinden** gelişir (Grzonkowska ve ark., 2023). Gray 1918 ise iç kulak ve kemikçikler dışında **sekiz** merkez sayar: pul kısmı (elmacık çıkıntısıyla) için 1, timpanik kısım için 1, kayalık-mastoid kısım için 4 ve stiloid çıkıntı için 2 (Gray, 1918). Gray’e göre (Gray, 1918):

- **Pul kısmı** zarda, 2. ay dolayında elmacık çıkıntısının kökü yakınında beliren tek çekirdekten kemikleşir.
- **Timpanik halka** (*anulus tympanicus*) eksik bir çemberdir; iç yüzündeki oluğa kulak zarının çevresi tutunur. Halka genişleyerek timpanik kısmı yapar ve 3. ay dolayında beliren tek merkezden zarda kemikleşir.
- **Kayalık-mastoid kısım** kıkırdaktan yapılmış kulak kapsülünde, 5.–6. aylarda beliren dört merkezden gelişir.
- **Stiloid çıkıntı** ikinci (dil kemiği) faringeal arkın kıkırdağının yakın (proksimal) bölümünden iki merkezle gelişir: kökteki timpanohiyal merkez doğumdan önce, geri kalanı yapan stilohiyal merkez doğumdan sonra belirir.

**Kaynaşma.** Timpanik halka doğumdan kısa süre önce pul kısmıyla birleşir; kayalık-mastoid kısım ile pul kısmı ilk yılda, stiloidin timpanohiyal bölümü de aşağı yukarı aynı zamanda kaynaşır. Stilohiyal bölüm ergenlikten sonra kaynaşır, bazı kafataslarında hiç kaynaşmaz (Gray, 1918).

**Huschke deliği nasıl oluşur?** Timpanik halkanın ön ve arka uzantıları büyüyüp birleşirken kulak yolunun tabanında bir süre bir delik kalır; delik genellikle 5 yaş dolayında kapanır ama ömür boyu açık kalabilir (Gray, 1918). Güncel kaynak da halkanın doğumda eksik olduğunu, ön ve arka çıkıntıların ilk 5 yılda kaynaştığını yazar (Macielak ve ark., 2022).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kayalık-mastoid kısmın dört merkezi.** Gray dört merkezi ayrı adlarla anlatır (Gray, 1918): **proötik** merkez arkuat kabarıklığın çevresinde belirir, iç kulak yolunun önü ve üstü boyunca tepeye yayılır; **opistotik** merkez orta kulağın iç duvarındaki promontoryumda belirir ve yuvarlak pencereyi çevreler; **pterotik** merkez orta kulak boşluğu ile antrumun tavanını yapar; **epiotik** merkez arka yarım daire kanalı yakınında belirip mastoid çıkıntıyı oluşturur.

**Doğumdan sonraki değişiklikler** (Gray, 1918). Çene eklem çukuru başlangıçta çok sığdır ve yana da bakar; derinleşir ve sonunda aşağı yönelir. Mastoid kısım önce düzdür; stilomastoid delik ve stiloidin taslağı timpanik halkanın hemen arkasındadır. Delik sonradan kemiğin alt yüzüne iner ve bu iniş yüz siniri kanalının uzamasıyla birlikte olur. Mastoid büyüyüp timpanik kısmı öne ittiğinden, Huschke deliğini taşıyan eski kulak yolu tabanı sonunda ön duvarda bulunur. Bebekte iç kulak yolunun üstündeki çukurluk, üst yarım daire kanalının altına kör bir tünel gibi uzanan büyük **subarkuat çukurdur** (*fossa subarcuata*); sonra dolar ve neredeyse kaybolur.`,
    },

    // ——— Eklemler, sayılar, sınav ve görüntüleme ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Şakak kemiğinin eklemleri',
      sutunlar: ['Komşu kemik', 'Şakak kemiğinin kenarı ya da yüzü', 'Eklem ya da dikiş'],
      satirlar: [
        [
          'Yan kafa kemiği',
          'Pul kısmının ince, iç tablası aleyhine eğik üst kenarı; mastoid kısmın geniş, dişli üst kenarı',
          'Skuamöz dikiş (pul kısmı yan kafa kemiğinin kenarının üstüne biner); parietomastoid dikiş (Gray’de “mastoparietal”), yan kafa kemiğinin mastoid açısıyla',
        ],
        [
          'Art kafa kemiği',
          'Mastoid kısmın dişli arka kenarı; kayalık kısmın arka kenarı ve juguler yüzü',
          'Oksipitomastoid dikiş (Gray’de “mastoöccipital”), yan açı ile juguler çıkıntı arasında; juguler yüz juguler çıkıntıyla kıkırdaklı eklem yapar; juguler çukur ile juguler çentik juguler deliği, iki oluk alt petrozal sinüs kanalını yapar',
        ],
        [
          'Kama kemiği',
          'Pul kısmının kalın, dişli ön-alt kenarı; kayalık kısmın ön kenarının iç bölümü ve tepesi',
          'Sfenoskuamöz dikiş (büyük kanatla); dikensi çıkıntıyla eklem; tepe büyük kanat ile art kafanın baziler kısmı arasındaki açıya girer',
        ],
        [
          'Elmacık kemiği',
          'Elmacık çıkıntısının derin dişli ön ucu',
          'Elmacık kemerini elmacık çıkıntısı ile elmacık kemiğinin şakak çıkıntısı birlikte yapar',
        ],
        [
          'Alt çene',
          'Çene eklem çukurunun ön (pul) bölümü ve eklem tümseği; ikisi de canlıda kıkırdakla örtülü',
          'Çene eklemi (temporomandibular eklem): alt çene kondili ile',
        ],
      ],
      not: 'Kaynaklar: Gray (1918); OpenStax 7.2; Tayebi Meybodi ve ark. (2023); FIPAT (2019).',
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Sayılarla şakak kemiği',
      ogeler: [
        { deger: '≈30', birim: 'mm', aciklama: 'Yüz sinirinin şakak kemiği içindeki toplam yolu.' },
        { deger: '<0,7', birim: 'mm', aciklama: 'Labirent segmentinin çapı: yüz sinirinin kemik içindeki en dar geçidi.' },
        {
          deger: '17,27',
          birim: 'mm',
          aciklama: 'Macewen üçgeninin üstündeki korteksten lateral yarım daire kanalının kabarıklığına ortalama derinlik (60 hasta).',
        },
        {
          deger: '1,9',
          birim: 'mm',
          aciklama: 'Kokleanın bazal turu ile iç karotis arterin arka dirseği arasındaki ortalama en kısa mesafe.',
        },
      ],
      not: 'Kaynaklar: Ryu ve Kim (2016); Gupta ve ark. (2013); Khan ve ark. (2022); Tayebi Meybodi ve ark. (2023).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Antrumun sınırları:** üstte tegmen tympani, altta mastoid çıkıntı, dışta şakak çizgisinin altındaki pul kısmı, içte lateral yarım daire kanalı; önde attiğe açılır (Gray, 1918).
- **Macewen üçgeni:** önde elmacık çıkıntısının arka kökü, altta dış kulak yolunun arka-üst duvarı; antrum bunun derinindedir (Bento ve Fonseca, 2013; Ostrander ve ark., 2026).
- **Stilomastoid delik:** yüz siniri ve stilomastoid arter (Gray, 1918).
- **Petrotimpanik (Glaser) yarığı:** malleusun ön çıkıntısı ve ön timpanik arter; korda timpani ön kenarındaki Huguier kanalından geçer (Gray, 1918; FIPAT, 2019).
- **Jacobson ve Arnold:** IX’un timpanik dalı (Jacobson) alt timpanik kanalcıktan geçer; X’un kulak dalı (Arnold) juguler çukurdaki mastoid kanalcıktan girer, timpanomastoid yarıktan çıkar (Gray, 1918; FIPAT, 2019).
- **Muskulotubal kanal:** üstte tensor tympani kası, altta östaki borusunun kemik bölümü (Gray, 1918).
- **Juguler delik:** şakak kemiğinin juguler çukuru + art kafa kemiğinin juguler çentiği (Gray, 1918).
- **Yüz siniri kanalı:** labirent (en kısa ve en dar) → timpanik → mastoid segment; ikinci dirsek piramidal çıkıntı hizasında (Gupta ve ark., 2013).
- **TA2’de mastoid kısım yok:** mastoid çıkıntı ve antrum kayalık kısmın altında sayılır (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      md: `- **Havalanma simetrisi:** insanların %72–99’unda iki taraf simetriktir; BT’de asimetri varsa az havalanmış taraf hastalık yönünden şüphelidir (Khan ve ark., 2022). Kayalık uçtaki asimetrik havalanma ise gerçek bir lezyon sanılabilir (Lee ve ark., 2015).
- **Üst yarım daire kanalı:** 0,5–0,6 mm kesit kalınlığı dehisans tanısında duyarlılığı %50’den %93’e çıkarır (Lazarou ve ark., 2025); kanala paralel Pöschl ve Stenvers düzlemleri kanalı en iyi gösterir (Ostrander ve ark., 2026).
- **Vestibüler akuedük:** Valvassori–Clemis ölçütüne göre orta noktadaki ön-arka genişlik ≥1,5 mm; Cincinnati ölçütüne göre orta nokta >0,9 mm ya da operkulum >1,9 mm ise akuedük genişlemiş sayılır (Roesch ve ark., 2021).
- **Juguler bulbus:** çap ≤5 mm hipoplazi, ≥15 mm hiperplazi olarak önerilmiştir (Tudose ve ark., 2024).
- **Yöntem farkı:** aynı çalışmada eklem tümseğindeki hava hücreleri panoramik grafide %1,96, KIBT’de %12,5 oranında bildirilmiştir (Adışen ve Aydoğdu, 2022’nin aktarımı). Sıklıklar karşılaştırılırken görüntüleme yöntemine bakılmalıdır.
- **Ameliyat öncesi BT:** sarkan ya da kemik örtüsü eksik yüz siniri, önde ya da dışta sigmoid sinüs, yüksek ya da dehisan juguler bulbus cerrahi riski artıran bulgulardır; kalıcı stapedial arter stapes cerrahisine ve çoğu kemikçik onarımına mutlak engeldir (Ostrander ve ark., 2026).`,
    },

    // ——— Uzman: varyasyonlar ve araştırma ———
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Şakak kemiğinde çeşitlilik: sayılar',
      sutunlar: ['Yapı', 'Çeşitlilik', 'Sıklık ya da ölçü', 'Neden önemli?'],
      satirlar: [
        [
          'Yüz siniri kanalı',
          'Kemik örtüde açıklık (dehisans; ≥ ~0,4 mm)',
          'Timpanik segmentte %41–75; aktarılan bir seride toplumun %57’si; 50 kemiklik diseksiyonda %6; ameliyatta %0,5–74',
          'Kulak cerrahisinde sinirin korunması; sayılar tanıma ve yönteme göre çok farklı',
        ],
        [
          'Genikulat gangliyon',
          'Orta çukur tabanında kemik örtünün eksikliği',
          'Örtü %15–25’inde eksik ya da yok; %18’e varanında gangliyon sert zara değer',
          'Orta çukur yaklaşımında sert zar kaldırılırken yaralanma',
        ],
        [
          'Büyük petrozal sinir oluğu',
          'Tam, eksik ya da yok',
          'Tam %10, eksik %65, yok %25',
          'Oluk her olguda izlenebilecek bir işaret değildir',
        ],
        ['Arkuat kabarıklık', 'Belirgin ya da neredeyse yok', 'Orta çukurların %85’inde belirgin', 'İç ucu kanaldan arkaya sapabilir'],
        [
          'Üst yarım daire kanalı',
          'Kemik örtünün eksikliği (dehisans)',
          'Kadavra mikroskopisinde %0,5 (+%1,4 neredeyse dehisans); BT’de %3–9; Umman’da 470 kulakta %4,1',
          'BT aşırı tanı koyabilir',
        ],
        [
          'Tegmen tympani',
          'Dehisans; kanal dehisansıyla birliktelik',
          '124 tegmen dehisansının %28,2’sinde ikisi birlikte',
          'Biri bulununca öteki aranır',
        ],
        [
          'Juguler bulbus',
          'Yüksek, büyük, dehisan ya da divertiküllü',
          'Yüksek bulbus tanıma göre %0–46; aynı tanımı kullanan iki BT serisinde %15,2 ve %42,8',
          'Orta kulak ve mastoid cerrahisinde kanama ve dar alan; kulak çınlaması',
        ],
        [
          'Sigmoid sinüs',
          'Önde ya da dışta yerleşim; oluk duvarında dehisans ya da divertikül',
          'Divertikül/dehisans pulsatil tinnitusun %20’ye varan kısmından sorumlu',
          'Mastoidektomide alanı daraltır; tedavi edilebilir tinnitus nedeni',
        ],
        [
          'Petröz apeks',
          'Havalanma yok, simetrik ya da asimetrik',
          'Erişkinlerin ~üçte birinde havalanma yok; İtalya’da %20–32 havalı',
          'Asimetrik havalanma lezyon sanılabilir; havalanma BOS sızıntısıyla ilişkili',
        ],
        [
          'Eklem tümseği',
          'Hava hücresi içermesi (PAT)',
          'Panoramik grafide %1,03–6,2; aynı çalışmada panoramikte %1,96, KIBT’de %12,5',
          'Çene eklem çukurunun tavanını zayıflatır; mastoidin yaygın havalanmasına işaret edebilir',
        ],
        [
          'Stiloid çıkıntı',
          'Uzama (>30 mm); tek parça, yalancı eklemli ya da parçalı',
          '%25,03 (GA 21,23–29,03); iki taraflı %16,04; Langlais tip I %16,35, tip II %4,39, tip III %3,89; ortalama 28,91 mm',
          'Eagle sendromu uzamış stiloidi olanların %4–10,3’ünde',
        ],
        [
          'Huschke deliği',
          'Timpanik kısımda kalıcı delik',
          'KIBT’de %0,8–3,4; şakak kemiği görüntülemesinde %11,5–20',
          'Kulak ağrısı ve akıntı; çene eklemi artroskopisinde risk',
        ],
        ['Tensor tympani kası', 'Östaki borusuna göre konum', '%72’sinde borunun üstünde', 'Önünde ya da arkasında da olabilir'],
        [
          'Mastoid havalanması',
          'Hücresel, diploik, sklerotik; simetri',
          '%72–99’unda iki taraf simetrik',
          'Asimetride az havalanan taraf hastalık yönünden şüpheli',
        ],
      ],
      not: 'Kaynaklar: Gupta ve ark. (2013); Kalaiarasi ve ark. (2018); Ryu ve Kim (2016); Tayebi Meybodi ve ark. (2023); Al Shaili ve ark. (2025); Whyte-Orozco ve ark. (2024); Tudose ve ark. (2024); Wenjuan ve ark. (2015); Lee ve ark. (2015); Gibelli ve ark. (2021); Zaczkowski ve ark. (2024); Adışen ve Aydoğdu (2022); Triantafyllou ve ark. (2025); Assiri Ahmed ve ark. (2023); Hasani ve ark. (2022); Macielak ve ark. (2022); Khan ve ark. (2022). Sıklıklar tanıma, örneğe ve görüntüleme yöntemine göre çok değişir; tek bir sayı olarak ezberlenmemelidir. Stiloid meta-analizinde ortalamanın güven aralığı kaynakta hatalı yazıldığı için yalnızca ortalama verildi.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      md: `- **Havalanmayı ne belirler?** Mastoid havalanmasının derecesini genlerin mi, yoksa çocukluktaki orta kulak iltihapları gibi çevresel etkenlerin mi belirlediği tartışmalıdır (Khan ve ark., 2022). Petröz apeksin havalanması şakak kemiğinin öteki bölümlerinden bağımsız bir süreç olabilir (Lee ve ark., 2015).
- **Arkuat kabarıklığı ne biçimlendirir?** Bugünkü görüşe göre yalnızca üst yarım daire kanalı değil, kayalık kemiğin havalanması ve temporal lobun alt yüzündeki oksipitotemporal oluk birlikte biçimlendirir (Tayebi Meybodi ve ark., 2023).
- **Sigmoid sinüs ve tinnitus:** sesin dehisanslı sinüs levhası ve hava hücreleri yoluyla iç kulağa iletildiği görüşü önerilmiş bir mekanizmadır (Wenjuan ve ark., 2015).
- **Kemikten cinsiyet tahmini:** Düzce’de 200 erişkinin BT’sinde sağ mastoid segment erkeklerde ortalama 12,49 mm, kadınlarda 10,63 mm ölçüldü; sağ labirent segmentinin ortancası erkeklerde 4,9 mm’ydi. Yüz siniri kanalı ölçüleriyle kurulan makine öğrenmesi modelleri %97’ye varan doğrulukla cinsiyeti ayırt etti; en etkili ölçü ikinci dirsek açısıydı (Secgin ve ark., 2025).
- **Stiloid: uzunluk yetmez.** 17 çalışma 30 mm yerine 25, 33 ya da 40 mm eşiği kullanmıştır; BT çalışmaları uzamış stiloidi kemik koleksiyonlarından daha sık yakalar (olağan stiloid osteolojik çalışmalarda %85,17, BT’de %69,33) (Triantafyllou ve ark., 2025). Sıkıştırma yalnızca uzunlukla belirlenmez; üç boyutlu açılanma, sapma ve damara uzaklık daha ayırt edicidir. Stilokarotid tipte çıkıntı, bademcik ameliyatından bağımsız olarak iç ya da dış karotis artere ve çevresindeki sempatik ağa doğrudan baskı yapar. Uzun stiloidin ilk cerrahi çıkarılışı 1872’de Weinlechner’e atfedilir (Bănică ve ark., 2026).`,
    },
  ],
};
