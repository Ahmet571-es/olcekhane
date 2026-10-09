import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** 5. bölüm: art kafa kemiği (os occipitale): kısımları, iç ve dış yüzü, kondiller ve kanallar, kemikleşme, klinik ve cerrahi önemi. */
export const artKafaKemigi: DersBolumu = {
  id: 'art-kafa-kemigi',
  baslik: 'Art kafa kemiği: başın arkası ve kafatasının omurgaya oturduğu yer',
  bloklar: [
    {
      tur: 'metin',
      md: `**Art kafa kemiği** (*os occipitale*) kafatasının arka ve alt kısmındadır. Yamuk biçimli, kendi üzerine kıvrılmış bir kemiktir. Ortasındaki büyük oval açıklık, **foramen magnum**, kafa boşluğunu omurga kanalına bağlar (Gray, 1918).

Kemik foramen magnumun çevresinde üç kısma ayrılır (Gray, 1918):

- **Pul kısmı** (*squama occipitalis*): deliğin arkasındaki kıvrık, geniş levha; başın arkasını yapar.
- **Baziler kısım** (*pars basilaris*): deliğin önündeki kalın, kabaca dörtgen parça; öne ve yukarı uzanarak kafatası tabanının ortasına katılır.
- **İki yan kısım** (*pars lateralis*): deliğin iki yanındaki parçalar. Alt yüzlerinde, birinci boyun omuruyla (atlas) eklem yapan **kondiller** bulunur.

Art kafa kemiği altı kemikle eklem yapar: iki yan kafa, iki şakak, kama kemiği ve atlas (Gray, 1918). Kafatasını omurgaya bağlayan kemik budur. Kondiller ile atlas arasındaki eklemin başlıca hareketi başı öne eğip geriye kaldırmaktır; yani “evet” der gibi yaptığımız hareket (Offiah ve Day, 2017).`,
    },
    {
      tur: 'sahne',
      baslik: 'Art kafa kemiği alttan',
      aciklama:
        'Art kafa kemiğini tek başına, alttan görüyoruz; görüntünün üstü yüz tarafı, ekranın sağı hastanın solu. Mor renk yalnızca kemiği tanıtır. Ortadaki büyük açıklık foramen magnumdur; iki yanındaki oval kabarıklıklar atlasla eklem yapan kondillerdir. Görüntünün üstünde öne ve yukarı uzanan kalın parça baziler kısım, altında geniş pul kısmı ve onun ortasında dış art kafa çıkıntısı görülür. “Bakış” ile kemiği arkadan, önden ya da yukarıdan inceleyebilirsin.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'alt',
        goster: ['art-kafa-kemigi'],
        vurgula: ['art-kafa-kemigi'],
        boya: [{ secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa }],
        noktalar: [
          { nokta: 'dis-art-kafa-cikintisi' },
          { nokta: 'buyuk-delik' },
          { nokta: 'art-kafa-kondili-sol' },
          { nokta: 'art-kafa-kondili-sag' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      md: `Başının arkasında, ensenin hemen üstünde orta hatta ele gelen çıkıntı **dış art kafa çıkıntısıdır** (*protuberantia occipitalis externa*); bu çıkıntıyla ilişkili ölçüm noktasının adı **inion**dur (FIPAT, 2019). Çıkıntı ensedeki bir bağa tutunma yeridir (OpenStax 7.2). Çıkıntıdan iki yana kavis çizerek uzanan **ense çizgileri** (*linea nuchalis*) ense kaslarına tutunma yeri verir (Gray, 1918).

Kemiğin içi derin bir çanak gibidir. İç yüzü **haç biçimli bir kabarıklıkla** dört çukura bölünür: üstteki iki çukurda beynin art kafa lobları, alttaki iki çukurda beyinciğin yarım küreleri oturur. Haçın kollarının kesiştiği yerde **iç art kafa çıkıntısı** vardır (Gray, 1918). Kemik sırtlarda, çıkıntılarda ve kondillerde kalındır; beyinciğin oturduğu alt çukurlarda ise incedir, yarı saydamdır (Gray, 1918).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla art kafa kemiği',
      ogeler: [
        { deger: '6', birim: 'kemik', aciklama: 'Eklem yaptığı kemikler: iki yan kafa, iki şakak, kama kemiği ve atlas.' },
        { deger: '3', birim: 'kısım', aciklama: 'Foramen magnumun çevresinde: pul kısmı, baziler kısım ve iki yan (kondil) kısım.' },
        { deger: '%50', aciklama: 'Baş ve boynun öne eğilmesinde art kafa–atlas ekleminin payı.' },
        { deger: '≈6', birim: 'yaş', aciklama: 'Gray’e göre art kafa kemiğinin parçalarının birleşip tek kemik olduğu yaş.' },
      ],
      not: 'Kaynaklar: Gray (1918); McAllister ve Sribnick (2026).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Art kafa kemiği = pul kısmı + baziler kısım + iki yan (kondil) kısım**; ortalarında **foramen magnum**.\n\n**Dışta:** dış art kafa çıkıntısı (inion), ense çizgileri, kondiller. **İçte:** haç biçimli kabarıklık, dört çukur (üstte art kafa lobları, altta beyincik), iç art kafa çıkıntısı.\n\n**Altı kemikle** eklem yapar: iki yan kafa, iki şakak, kama ve atlas. Art kafa–atlas ekleminin başlıca hareketi “evet” hareketidir.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: '“Telefon çıkıntısı” gerçek mi?',
      md: 'Son yıllarda gençlerde ensedeki kemik çıkıntının telefona eğik bakmaktan büyüdüğü ileri sürüldü. Fransa’da 18–30 yaşındaki kişilerin kafa BT’lerini inceleyen bir çalışmada dış art kafa çıkıntısının büyümesi 2011’de %44,9, 2019’da %44,2 oranındaydı; aradaki yıllarda genç kuşakta akıllı telefon sahipliği %35’ten %98’e çıktığı hâlde sıklık değişmemişti. Büyüme erkeklerde çok daha sıktı (%65,3’e karşı %17,2) (Jacques ve ark., 2020). Bu veriler “telefon çıkıntısı” iddiasını desteklemiyor; kuşaklar boyunca sıklığın sabit kaldığını gösteren çalışmalar bu varsayımla çelişir (Gong ve ark., 2026).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kısımlar ve gelişim.** Terminolojide üç kısım *squama occipitalis*, *pars basilaris ossis occipitalis* ve *pars lateralis ossis occipitalis* adlarını taşır (FIPAT, 2019). Gelişim açısından ise beş bileşen sayılır: baziler kısım, iki yan kısım ve pul kısmının **supraoksipital** ile **interparietal** parçaları. Baziler, yan ve supraoksipital parçalar kıkırdak içi (endokondral), interparietal parça zar içi (intramembranöz) kemikleşir (Han ve ark., 2025). Kemik önde klivustan arkada lambdoid dikişe kadar uzanır (Offiah ve Day, 2017).

**Pul kısmının dış yüzü** dışbükeydir; kemiğin tepesi ile foramen magnumun tam ortasında **dış art kafa çıkıntısı** bulunur (Gray, 1918). Çıkıntı üst ense çizgisi düzeyindedir ve **ense bağının** (*ligamentum nuchae*) yapışma yeridir (Jacques ve ark., 2020). Çıkıntıdan iki yana iki kavisli çizgi uzanır: üstteki, çoğu zaman silik **en üst ense çizgisine** (*linea nuchalis suprema*) kafa derisinin aponevrozu tutunur; alttaki **üst ense çizgisidir** (*linea nuchalis superior*) (Gray, 1918; FIPAT, 2019). En üst çizgilerin üstündeki **art kafa düzlemi** (*planum occipitale*) art kafa kasıyla örtülüdür; altındaki **ense düzlemi** pürüzlüdür ve birçok kasa tutunma yeri verir. Çıkıntıdan foramen magnuma inen, çoğu zaman silik **orta ense çizgisine** de ense bağı tutunur; orta çizginin ortasından iki yana **alt ense çizgisi** uzanır (Gray, 1918). Terminoloji bu orta sırtı *crista occipitalis externa* adıyla ve her kafatasında bulunmayan bir yapı olarak listeler; bazen dış art kafa çıkıntısının yerinde yalnızca kemik bir krista bulunur (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Ense çizgileri ve tutunan yapılar',
      sutunlar: ['Çizgi ya da alan', 'Latince (TA2)', 'Tutunan yapı'],
      satirlar: [
        ['En üst ense çizgisi', '*Linea nuchalis suprema*', 'Kafa derisi aponevrozu (*galea aponeurotica*)'],
        ['Art kafa düzlemi', '*Planum occipitale*', 'Art kafa kası (*musculus occipitalis*) örter'],
        [
          'Üst ense çizgisi',
          '*Linea nuchalis superior*',
          'Başlar: art kafa kası ve trapez kası (*m. trapezius*). Yapışır: sternokleidomastoid kas (*m. sternocleidomastoideus*) ve başın kayış kası (*m. splenius capitis*)',
        ],
        [
          'Üst ve alt çizgiler arası',
          '—',
          'Başın yarı dikensi kası (*m. semispinalis capitis*) ve başın üst eğik kası (*m. obliquus superior capitis*)',
        ],
        [
          'Alt ense çizgisi ve altı',
          '*Linea nuchalis inferior*',
          'Başın büyük ve küçük arka düz kasları (*m. rectus posterior major capitis* ve *minor capitis*)',
        ],
        ['Orta ense çizgisi', '*Crista occipitalis externa* (sabit değil)', 'Ense bağı (*ligamentum nuchae*)'],
        ['Foramen magnumun arka-yan kenarının hemen dışı', '—', 'Arka atlanto-oksipital zar'],
      ],
      not: 'Kaynak: Gray (1918); Latince adlar FIPAT (2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Pul kısmının iç yüzü** derin bir çukurdur; **haç biçimli kabarıklık** (*eminentia cruciformis*; Gray’de *eminentia cruciata*) onu dört çukura böler. Üstteki iki üçgen **beyin çukuru** (*fossa cerebralis*) art kafa loblarını, alttaki iki dörtgen **beyincik çukuru** (*fossa cerebellaris*) beyincik yarım kürelerini taşır. Dört kolun kesiştiği yer **iç art kafa çıkıntısıdır** (Gray, 1918; FIPAT, 2019).

- **Üst kol:** bir yanında (genellikle sağda) üst sagittal sinüsün arka kısmını taşıyan derin **sagittal oluk** vardır; oluğun kenarlarına beyin orağı tutunur (Gray, 1918).
- **Alt kol:** **iç art kafa kristasıdır**. Foramen magnuma yakın çatallanır ve beyincik orağına (*falx cerebelli*) tutunma yeri verir; orağın kemiğe tutunan kenarında bazen çift olan **art kafa sinüsü** (*sinus occipitalis*) bulunur. Kristanın üst kısmında bazen beyincik vermisinin bir bölümünü barındıran küçük bir **vermis çukuru** (*fossa vermiana*) görülür (Gray, 1918). Terminoloji foramen magnumun kenarında ayrıca bir **marjinal sinüs oluğu** listeler (FIPAT, 2019).
- **Yan kollar:** iki yandaki **transvers oluklar** transvers sinüsleri taşır; çıkıntılı kenarlarına beyincik çadırı (*tentorium cerebelli*) tutunur. Sağ oluk genellikle soldakinden büyüktür ve sagittal oluğun devamıdır; ama istisnalar az değildir: sol daha büyük olabilir ya da iki yan neredeyse eşittir (Gray, 1918).

Üst sagittal ve transvers sinüslerin birleştiği yere **sinüslerin birleşimi** (*confluens sinuum*) denir; eski adı *torcular Herophili*’dir. Yeri, iç çıkıntının bir yanındaki çukurlukla belli olur (Gray, 1918). *Torcular* Latincede şarap presi demektir: eskiden farklı yönlerden gelen kan sütunlarının burada birbirine bastırıldığı düşünülürdü (Gray, 1918). Gray, juguler deliğe kadar uzanan oluğun tamamını “transvers sinüs” diye anlatır; bugün oluğun son kısmı ayrı bir adla, sigmoid sinüs oluğu (*sulcus sinus sigmoidei*) olarak anılır (FIPAT, 2019).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Art kafa kemiği yukarıdan: iç yüz',
      aciklama:
        'Art kafa kemiğine yukarıdan, kafatasının içinden bakar gibi bakıyoruz; görüntünün üstü yüz tarafı. Önde öne ve yukarı uzanan baziler kısım klivusun alt bölümünü yapar; ortada foramen magnum, arkada iç yüzün çanağı ve haç biçimli kabarıklığın merkezindeki iç art kafa çıkıntısı görülür. Model sadeleştirildiği için transvers ve sagittal oluklar, iç kristanın çatalı ve dört çukurun sınırları silik görünebilir.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'ust',
        goster: ['art-kafa-kemigi'],
        vurgula: ['art-kafa-kemigi'],
        boya: [{ secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa }],
        noktalar: [{ nokta: 'klivus' }, { nokta: 'buyuk-delik' }, { nokta: 'ic-art-kafa-cikintisi' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kondiller.** Yan kısımların alt yüzündeki kondiller oval ya da böbrek biçimlidir. Ön uçları öne ve içe yönelir, birbirine arka uçlarından daha yakındır ve baziler kısma taşar; arka uçları foramen magnumun ortası düzeyine kadar uzanır. Eklem yüzleri önden arkaya ve yandan yana dışbükeydir, aşağı ve dışa bakar. Kenarlarına eklem kapsülleri, iç yanlarındaki pürüzlü tüberküle **kanat bağı** (*ligamentum alare*) tutunur (Gray, 1918). Kondillerin arkadan öne doğru içe ve aşağı açılanması atlanto-oksipital eklemde özellikle başın kendi ekseni çevresinde dönmesini kısıtlar (Offiah ve Day, 2017).

**Hipoglossal kanal.** Her kondilin tabanını kısa bir kanal deler: **hipoglossal kanal** (*canalis nervi hypoglossi*; Gray’de eski adıyla “ön kondil deliği”). Kanal kafa içinde foramen magnumun hemen üstünde başlar ve kondilin üstünden dışa ve öne gider; dil altı sinirini (XII) dışarı, çıkan farengeal atardamarın meningeal dalını içeri geçirir. Bir kemik çıkıntıyla kısmen ya da tamamen ikiye bölünebilir (Gray, 1918).

**Kondil çukuru ve kanalı.** Kondilin arkasındaki **kondil çukuru** (*fossa condylaris*), baş geriye eğilince atlasın üst eklem yüzünün arka kenarını alır. Çukurun tabanını bazen **kondil kanalı** (*canalis condylaris*) deler; buradan sigmoid sinüsten gelen bir emisser ven (*emissarium condylare*) geçer (Gray, 1918; FIPAT, 2019).

**Juguler çıkıntı ve tüberkül.** Kondilin arka yarısından dışa uzanan dörtgen levha **juguler çıkıntıdır**; önünü oyan **juguler çentik** kafatasında juguler deliğin arka kısmını yapar. Çentik, hipoglossal kanalın üstünde dışa uzanan **intrajuguler çıkıntıyla** ikiye bölünebilir. Juguler çıkıntının alt yüzüne başın yan düz kası (*m. rectus lateralis capitis*) ve yan atlanto-oksipital bağ tutunur; buradan bazen aşağıya, atlasın enine çıkıntısına ulaşıp onunla eklem yapabilecek uzunlukta bir **paramastoid çıkıntı** uzanır. Juguler çıkıntının dış yüzü şakak kemiğine bir kıkırdak levhayla bağlanır; bu levha 25 yaşından sonra kemikleşme eğilimindedir. Üst yüzündeki derin oluk sigmoid sinüsün son kısmını taşır ve kondil kanalı buraya açılır. Yan kısmın üst yüzündeki oval **juguler tüberkül** hipoglossal kanalın üstünü örter; tüberkülü bazen IX, X ve XI. sinirler için eğik bir oluk çaprazlar (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Art kafa kemiği önden: kondiller ve kanallar',
      aciklama:
        'Art kafa kemiğine önden bakıyoruz; ekranın sağı hastanın solu. Önde baziler kısmın yutağa bakan alt yüzü, aşağıda iki kondil, yanlarda juguler çıkıntılar, arkada pul kısmının iç yüzü görülür. Sol kondilin ön-üstündeki çukur hipoglossal kanalın ağzıdır; modelde kanal delinmemiştir, nokta ağzın yerini gösterir. İç yüzde haç biçimli kabarıklığın sol yan kolu boyunca uzanan oluk transvers sinüs oluğudur. Juguler çıkıntı, hipoglossal kanal ve transvers oluk yalnızca sol yanda işaretlendi.',
      sahne: {
        katmanlar: ['kemik'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['art-kafa-kemigi'],
        vurgula: ['art-kafa-kemigi'],
        boya: [{ secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa }],
        noktalar: [{ nokta: 'hipoglossal-kanal-sol' }, { nokta: 'juguler-cikinti-sol' }, { nokta: 'enine-sinus-olugu-sol' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Baziler kısım** foramen magnumdan öne ve yukarı uzanır. Gençte önündeki pürüzlü dörtgen alan kama kemiğinin gövdesine bir kıkırdak levhayla bağlıdır (Gray, 1918); bu bağlantının adı **sfeno-oksipital sinkondrozdur** (*synchondrosis sphenooccipitalis*) (FIPAT, 2019). **Klivus**, kama kemiğinin gövdesi ile art kafa kemiğinin baziler kısmından oluşur (Cheng ve ark., 2015). Baziler kısmın alt yüzünde, foramen magnumun yaklaşık 1 cm önünde yutağın lifli rafesinin tutunduğu **farengeal tüberkül** vardır; orta hattın iki yanına başın uzun kası (*m. longus capitis*) ve başın ön düz kası (*m. rectus anterior capitis*) yapışır, foramen magnumun hemen önüne ön atlanto-oksipital zar tutunur. Üst yüzündeki geniş, sığ oluk omurilik soğanını (*medulla oblongata*) taşır; foramen magnumun kenarına **örtü zarı** (*membrana tectoria*) tutunur; yan kenarlarında alt petrozal sinüslerin silik olukları vardır (Gray, 1918).

**Açılar ve kenarlar.** Üst açı yan kafa kemiklerinin art kafa köşeleriyle eklem yapar ve fetüste arka bıngıldağın yerine denk gelir. Alt açı kama kemiğinin gövdesiyle kaynaşmıştır. Yan açılar transvers olukların uçlarındadır ve yan kafa kemiğinin mastoid köşesi ile şakak kemiğinin mastoid kısmı arasına girer. Derin dişli üst kenarlar yan kafa kemikleriyle **lambdoid dikişi** yapar. Alt kenarın üst yarısı şakak kemiğinin mastoid kısmıyla, alt yarısı kayalık kısmıyla eklem yapar; ikisini juguler çıkıntı ayırır (Gray, 1918). Terminolojideki adları *margo lambdoideus ossis occipitalis* ve *margo mastoideus ossis occipitalis*’tir (FIPAT, 2019).

**Foramen magnum** ön-arka yönde uzun, oval bir açıklıktır; önde kondiller taştığı için arkada daha geniştir (Gray, 1918). Ölçüleri, içinden geçenler ve klinik önemi [genel bakış dersinde](/beyin-akademisi/anatomi/kafatasi?duzey=lisans#kafatasinin-tabani) anlatıldı.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Art kafa kemiğinin işaretleri',
      sutunlar: ['İşaret', 'Latince (TA2)', 'Nerede?', 'Ne geçer, ne tutunur?'],
      satirlar: [
        [
          'Dış art kafa çıkıntısı (inion)',
          '*Protuberantia occipitalis externa*',
          'Dış yüz, kemiğin tepesi ile foramen magnumun ortası',
          'Ense bağı',
        ],
        [
          'Ense çizgileri',
          '*Linea nuchalis suprema, superior, inferior*',
          'Çıkıntıdan iki yana',
          'Kafa derisi aponevrozu ve ense kasları (yukarıdaki tablo)',
        ],
        ['Haç biçimli kabarıklık', '*Eminentia cruciformis*', 'İç yüz', 'Dört çukuru (iki beyin, iki beyincik çukuru) ayırır'],
        ['İç art kafa çıkıntısı', '*Protuberantia occipitalis interna*', 'Kabarıklığın merkezi', 'Bir yanında sinüslerin birleşimi'],
        [
          'Sagittal oluk',
          '*Sulcus sinus sagittalis superioris*',
          'Kabarıklığın üst kolu, genellikle sağda',
          'Üst sagittal sinüs; kenarlarına beyin orağı',
        ],
        ['Transvers oluk', '*Sulcus sinus transversi*', 'Kabarıklığın yan kolları', 'Transvers sinüs; kenarlarına beyincik çadırı'],
        [
          'İç art kafa kristası',
          '*Crista occipitalis interna* (sabit değil)',
          'Kabarıklığın alt kolu; foramen magnuma yakın çatallanır',
          'Beyincik orağı; art kafa sinüsü',
        ],
        ['Vermis çukuru', '*Fossa vermiana* (sabit değil)', 'İç kristanın üst kısmı', 'Beyincik vermisinin bir bölümü'],
        [
          'Kondil',
          '*Condylus occipitalis*',
          'Yan kısmın alt yüzü',
          'Atlasın üst eklem yüzü; eklem kapsülü; iç yandaki tüberküle kanat bağı',
        ],
        [
          'Hipoglossal kanal',
          '*Canalis nervi hypoglossi*',
          'Kondilin tabanı; foramen magnumun hemen üstünden dışa-öne',
          'Dil altı siniri (XII); çıkan farengeal atardamarın meningeal dalı',
        ],
        [
          'Kondil çukuru ve kanalı',
          '*Fossa condylaris*; *canalis condylaris*',
          'Kondilin arkası',
          'Baş geriye eğilince atlasın eklem yüzünün arka kenarı; kondil emisser veni',
        ],
        [
          'Juguler çıkıntı ve çentik',
          '*Processus jugularis*; *incisura jugularis ossis occipitalis*',
          'Kondilin arka yarısından dışa',
          'Juguler deliğin arka kısmı; başın yan düz kası, yan atlanto-oksipital bağ',
        ],
        [
          'İntrajuguler çıkıntı',
          '*Processus intrajugularis ossis occipitalis*',
          'Juguler çentikte, hipoglossal kanalın üstü',
          'Çentiği ikiye bölebilir',
        ],
        [
          'Paramastoid çıkıntı',
          '*Processus paramastoideus* (sabit değil)',
          'Juguler çıkıntının alt yüzü',
          'Atlasın enine çıkıntısıyla eklem yapabilir',
        ],
        ['Juguler tüberkül', '*Tuberculum jugulare*', 'Yan kısmın üst yüzü', 'Hipoglossal kanalın üstü; bazen IX–XI için oluk'],
        ['Farengeal tüberkül', '*Tuberculum pharyngeum*', 'Baziler kısmın alt yüzü, foramen magnumun ~1 cm önü', 'Yutağın lifli rafesi'],
        ['Klivus (alt bölümü)', '*Clivus*', 'Baziler kısmın üst yüzü', 'Omurilik soğanı; foramen magnum kenarında örtü zarı'],
        ['Alt petrozal oluk', '*Sulcus sinus petrosi inferioris*', 'Baziler kısmın yan kenarları', 'Alt petrozal sinüs'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Cheng ve ark. (2015). Foramen magnumun ölçüleri ve içinden geçenler genel bakış dersinde.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemikleşme.** Pul kısmının üst bölümü, yani art kafa düzlemi zarda gelişir; kemiğin geri kalanı kıkırdakta gelişir. Art kafa düzlemi ömür boyu ayrı kalırsa **interparietal kemik** olur (Gray, 1918). Fetüslerde yapılan güncel bir MR çalışmasına göre kemikleşme yaklaşık 8. gebelik haftasında pul kısmının alt bölümünde başlar; ardından pul kısmının üst bölümü, sonra yan kısımlar kemikleşir ve 11. haftada baziler kısım da sürece katılır (Han ve ark., 2025). Gray’in verdiği sıra ve haftalar bundan farklıdır (uzman düzeyindeki tabloda). Gray’e göre yaklaşık 4 yaşında pul kısmı ile yan kısımlar birleşir, yaklaşık 6 yaşında kemik tek parça olur (Gray, 1918).

Art kafa kemiğinin kama kemiğiyle kaynaşma yaşı için Gray aynı bölümde hem “25 yaşına kadar” hem “18–25 yaş arası” der (Gray, 1918); bu derste güncel bir kaynakla doğrulanamadığı için kesin bir yaş verilmiyor.

**Eklemler.** Altı kemik: iki yan kafa kemiği (lambdoid dikiş), iki şakak kemiği (mastoid ve kayalık kısımlar), kama kemiğinin gövdesi (baziler kısım) ve atlas (kondiller) (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Üç kısım** (pul, baziler, iki yan) foramen magnumun çevresinde; gelişimde **beş bileşen**, interparietal parça zar içi, ötekiler kıkırdak içi kemikleşir (Han ve ark., 2025).
- **Altı kemik:** iki yan kafa, iki şakak, kama, atlas (Gray, 1918).
- **Hipoglossal kanal** kondilin tabanındadır, juguler tüberkülün altında; XII. siniri geçirir. **Kondil kanalı** kondilin arkasındadır, her kafatasında yoktur ve emisser ven geçirir (Gray, 1918).
- **Juguler çentik** juguler deliğin arka kısmını yapar (Gray, 1918).
- **İç yüz:** üstte art kafa lobları, altta beyincik; transvers oluklara beyincik çadırı, iç kristaya beyincik orağı tutunur; sinüslerin birleşimi iç çıkıntının yanındadır (Gray, 1918).
- **Klivus** = kama gövdesi + art kafa baziler kısmı (Cheng ve ark., 2015).
- **Kondillerin açılanması** dönmeyi kısıtlar; art kafa–atlas ekleminin başlıca hareketi öne-arkaya eğilmedir (Offiah ve Day, 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Art kafa kondili kırıkları',
      md: `**Art kafa kondili kırığını** ilk kez 1817’de Sir Charles Bell tanımladı. BT yaygınlaşmadan önce nadir sanılan bu kırık büyük olasılıkla az bildiriliyordu; bildirilen sıklık %4 ile %19 arasında değişir (Offiah ve Day, 2017). Brezilya’da bir travma merkezindeki 26 hastalık seride sıklığın travma hastalarında yılda binde 2’nin (%0,2) altında olduğu tahmin edildi; hastaların erkek/kadın oranı 4:1’di ve çoğu trafik kazası geçirmişti (Batista ve ark., 2021).

En çok kullanılan **Anderson–Montesano sınıflaması** yalnızca 6 hastaya dayanır ama dünyada hâlâ en yaygın sınıflamadır (Batista ve ark., 2021):

- **Tip I:** eksenel yüklenmeyle kondilin ezilmesi; kırık parçalıdır, parçalar az yer değiştirir ya da hiç değiştirmez. Kuvvet, birinci boyun omurunun Jefferson kırığını yapan kuvvete benzer (Kweh ve ark., 2026; Batista ve ark., 2021).
- **Tip II:** bir kafa tabanı kırığının kondile uzanması; genellikle başa doğrudan bir darbeyle olur (Kweh ve ark., 2026).
- **Tip III:** kondilin iç-alt kenarından aksisin densine doğru bir parçanın koparılması (kanat bağının kemiği koparması). En ağır ve dengesiz olabilecek tip sayılır (Batista ve ark., 2021; Kweh ve ark., 2026).

Hipoglossal kanal kondilin tabanını deler, juguler çentik juguler deliğin arka kısmını yapar (Gray, 1918); bu komşuluk nedeniyle kırıkta alt kafa sinirleri (IX–XII) etkilenebilir. Alt kafa sinirlerinin felci (dördünün birlikte tutulduğu Collet–Sicard sendromu dahil) olguların üçte ikisinde hemen başlar (Offiah ve Day, 2017). Kırık düz grafide kolayca gözden kaçar: çocuklarda düz grafi kullanan çalışmaların hepsinde kırık ilk grafide görülmemiş, BT kullanan 13 çalışmanın hepsinde ise saptanmıştır (Morcos ve ark., 2024). Bir derlemenin aktardığı bir çalışmada kondil kırığı olan hastaların %22’sinde, çoğu C1 ve C2 kırığı olmak üzere, boyun omurgası yaralanması vardı (Utheim ve ark., 2015).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Kırık ya da hastalık sanılabilecek yapılar',
      md: `- **İnka (interparietal) kemiği:** art kafa kemiğinin gelişim sırasında kaynaşmayan, kalıcı bir parçasıdır (Takasu, 2025); terminolojide sabit olmayan ek bir kafatası kemiği olarak geçer (*os interparietale*) (FIPAT, 2019). Kafa travmasında kırıktan ayırt edilmelidir (Takasu, 2025).
- **Üçüncü kondil** (*condylus tertius*): baziler kısmın alt ucunda, orta hatta kalan kemik bir kalıntıdır; travma BT’sinde basion kırığını taklit edebilir (Offiah ve Day, 2017).
- **Kondil kanalının toplardamarı:** bu kanalın normal veni BT ya da MR’de tümör ya da anormal bir lenf düğümü sanılmamalıdır (Alghamdi ve ark., 2022).
- **Büyümüş dış art kafa çıkıntısı:** çoğu zaman belirti vermez; rahatsızlık verebilir, nadiren ameliyatla alınacak kadar ağrılıdır ya da travmada kırılır (Jacques ve ark., 2020).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Ensesinde sert bir çıkıntı',
      oyku: `24 yaşında bir erkek, ensesinin hemen üstünde ele gelen sert bir çıkıntı fark etmiş; sırtüstü yatınca ya da kask takınca rahatsızlık veriyor. Sosyal medyada bunun telefona eğik bakmaktan oluştuğunu okumuş ve kaygılanmış. Muayenede orta hatta, dış art kafa çıkıntısının yerinde sert, hareketsiz, kemik bir çıkıntı var; nörolojik muayenesi normal.`,
      soru: 'Bu çıkıntı hangi yapıdır, ne kadar yaygındır ve telefon kullanımıyla ilişkisi konusunda kanıt ne söylüyor?',
      cozum: `**Yapı:** Dış art kafa çıkıntısı üst ense çizgisi düzeyindedir ve ense bağının yapışma yeridir. Biçimine göre düz (tip 1), krista (tip 2) ve diken (tip 3) olarak üçe ayrılır (Jacques ve ark., 2020); diken tipine **oksipital spur** da denir (Gong ve ark., 2026).

**Ne kadar yaygın?** Fransa’da 18–30 yaşındaki kişilerin BT’lerinde büyüme (tip 2 ve 3) %44 dolayındaydı; erkeklerde %65,3, kadınlarda %17,2 oranında görüldü (Jacques ve ark., 2020). Hindistan’da 18–24 yaşında 180 sefalometrik grafide, üç tipin hepsini “oksipital spur” diye sayan bir çalışmada çıkıntı %65 oranında görüldü; en sık biçim kristaydı (%41,6), diken tipi %6,1’di (Barhate ve ark., 2026). Diken tipi erkeklerde belirgin olarak daha sıktır (Gong ve ark., 2026).

**Telefonla ilişkisi:** Fransız serisinde büyümenin sıklığı 2011 ile 2019 arasında değişmedi; aynı dönemde genç kuşakta akıllı telefon sahipliği %35’ten %98’e çıkmıştı (Jacques ve ark., 2020). “Akıllı telefon çağı” varsayımı, kuşaklar boyunca sıklığın sabit kaldığını gösteren çalışmalarla çelişir (Gong ve ark., 2026); bu yüzden telefonun çıkıntıyı büyüttüğü kesin bir bilgi olarak söylenemez.

**Önemi:** Büyümüş çıkıntı çoğu zaman belirtisizdir; rahatsızlık verebilir, nadiren ameliyatla alınması gerekecek kadar ağrılıdır ya da bir travmada kırılır (Jacques ve ark., 2020). Oksipital spur dirençli oksipital nevraljiyle de ilişkilendirilmiştir (Gong ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Kondil kırığında karar: sınıflamalar ve denge',
      md: `Anderson–Montesano sınıflamasının zayıflığı, MR öncesi dönemde yapılmış olması ve 6 hastanın yalnızca 1’inin tip III olmasıdır (Kweh ve ark., 2026). **Tuli sınıflaması** tedaviyi dengeye göre ayırır: tip 1 yer değiştirmemiş, dengeli kırıktır ve hareketsizleştirme gerektirmez; tip 2A yer değiştirmiş ama bağları sağlam, dengeli kırıktır ve sert boyunlukla tedavi edilebilir; tip 2B bağ kopukluğuyla birlikte dengesiz yer değiştirmedir ve halo ya da cerrahi tespit gerektirir. Yeni **AO Spine** üst servikal sınıflamasında IA kondillerin izole kemik yaralanması, IB yer değiştirmemiş bağ yaralanması, IC yer değiştirmiş yaralanmadır (Kweh ve ark., 2026).

Seriler kondil kırıklarının çoğunda ameliyat gerekmediğini gösteriyor. 13.363 hastalık bir seride bulunan 46 kondil kırığının %59’una boyun omurgası yaralanması eşlik ediyordu ama hiçbiri kondil için ameliyat gerektirmedi; 24.745 travma hastasını kapsayan bir başka seride kondil ile C1 arasındaki aralığın 2,0 mm’den büyük olması (kafatası-boyun hizasının bozulması) tek önemli karar ölçütü bulundu (aktaran Kweh ve ark., 2026). Brezilya serisinde en sık tipler Anderson–Montesano II (%67,9) ve Tuli 1 (%89,3) idi ve bütün hastalar 3–6 ay boyunlukla tedavi edildi (Batista ve ark., 2021). Baziler kısmın kırıkları, nadir görülen klivus arkası (retroklival) epidural hematomla birlikte olabilir (Offiah ve Day, 2017).

**Çocuklar:** kondil kırıkları çocuklarda boyun omurgası yaralanmalarının %1–16’sıdır; 38 çocuğu kapsayan bir sistematik derlemede, tipi bildirilen 36 hastada en sık tip III’tü (%44,4) (Morcos ve ark., 2024). Kondillerin küçüklüğü ve eklemin daha yatay olması çocuğun kafatası-boyun bileşkesini daha az dengeli yapar (Offiah ve Day, 2017). Tip I’in tanımı kaynaklar arasında farklıdır; burada Anderson–Montesano’nun özgün tanımı (eksenel yüklenmeyle ezilme) kullanıldı.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kondil, kanallar ve kafatası-boyun bileşkesinde çeşitlilik',
      sutunlar: ['Yapı', 'Çeşitlilik', 'Sıklık ya da ölçü', 'Kaynak'],
      satirlar: [
        [
          'Kondil biçimi',
          'Oval, rombik, dörtgen, böbrek biçimli',
          '100 kondilde oval %53, rombik %15, dörtgen %7, böbrek %6',
          'Verma ve ark. (2016)',
        ],
        ['Kondil eklem yüzü', 'Dışbükey, düz, içbükey', 'Çoğu dışbükey; düz %10, içbükey %1', 'Verma ve ark. (2016)'],
        ['Kondiller arası uzaklık', 'Önde dar, arkada geniş', 'Önde 21,2 ± 3,4 mm; arkada 40,5 ± 4,1 mm', 'Verma ve ark. (2016)'],
        ['Kondil boyutları (sağ)', 'Uzunluk, genişlik, kalınlık', '23,2; 12,9; 11,2 mm (Kuzey Hindistan)', 'Verma ve ark. (2016)'],
        ['Hipoglossal kanal', 'Kemik bölmeyle ikiye ayrılma', 'Kafataslarının %34’ünde', 'Verma ve ark. (2016)'],
        [
          'Kondil kanalı',
          'Var ya da yok; tek ya da iki taraflı',
          'Kuzey Hindistan: iki taraflı %38, iki tarafta yok %22. Yunanistan (200 örnek): %81, bulunanların %45,1’inde iki taraflı. Türk kafatasları (aktarım): tek tarafta yok %27, iki tarafta yok %17',
          'Verma ve ark. (2016); Kostares ve ark. (2026); Alghamdi ve ark. (2022)',
        ],
        [
          'Art kafa emisser deliği (Sperino veni)',
          'Var ya da yok',
          '250 kafatasının %16’sında hiç yok; dıştan içe geçen gerçek kanal solda %10, sağda %8',
          'Campbell ve ark. (2026)',
        ],
        [
          'Parakondiler çıkıntı',
          'Juguler çıkıntı bölgesinden atlasa uzanan kemik',
          '930 boyun BT’sinde 5 olgu (%0,5), 2’si iki taraflı',
          'N. V. ve ark. (2019)',
        ],
        ['Atlas asimilasyonu', 'Atlasın art kafa kemiğiyle kısmi ya da tam kaynaşması', '%0,75–3,75', 'McAllister ve Sribnick (2026)'],
        ['İnka kemiği', 'Art kafa düzleminin ayrı kalması', 'Üç parçalı tip etnik gruba göre %0–7,27', 'Takasu (2025)'],
        [
          'Dış art kafa çıkıntısı, diken tipi',
          'Oksipital spur',
          'Miyelopati hasta grubunda %48,7; bir kadavra çalışmasında %6,5',
          'Gong ve ark. (2026)',
        ],
      ],
      not: 'Ölçüm yöntemleri ve örnekler farklı olduğu için seriler doğrudan karşılaştırılamaz. Genel bakış dersinde kondil boyutları (21,3 × 10,5 × 7,4 mm) ve hipoglossal kanalın bölünme sıklığı (%20–30) için başka seriler verildi.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Kemikleşme takvimi: Gray (1918) ve fetal MR',
      sutunlar: ['Parça', 'Gray (1918)', 'Fetal MR (Han ve ark., 2025)'],
      satirlar: [
        ['Pul kısmının alt bölümü (ense düzlemi)', 'İki merkez; ~7. hafta, kısa sürede birleşir', 'Kemikleşmenin başladığı yer, ~8. hafta'],
        [
          'Pul kısmının üst bölümü (art kafa düzlemi, zar içi)',
          'Genellikle dört çekirdek: ikisi ~2., ikisi ~3. ayda; Mall’a göre iki merkez',
          'Alt bölümden sonra',
        ],
        ['Pul kısmının iki bölümünün birleşmesi', 'Fetal 3. ay', '—'],
        ['Yan kısımlar', 'Her biri tek merkez, 8. hafta', 'Üst pul kısmından sonra'],
        ['Baziler kısım', 'İki merkez, ~6. hafta, hızla birleşir; Mall’a göre tek merkez', '~11. haftada katılır'],
        [
          'Kerckring merkezi',
          'Bazen, 5. ayda foramen magnumun arka kenarında; ayrı (bazen çift) kemikçik, doğumdan önce pul kısmına kaynaşır',
          '—',
        ],
        ['Tek kemik oluşu', 'Pul ve yan kısımlar ~4 yaş; tümü ~6 yaş', '—'],
      ],
      not: 'Gray kendi içinde Mall’ın farklı merkez sayılarını da verir. Güncel MR verisi Gray’in sırasıyla çelişir; güncel kaynak önce gelir. Terminoloji gelişimdeki kıkırdak eklemleri ayrıca adlandırır: arka intraoksipital (pul-yan) ve ön intraoksipital (baziler-yan) sinkondrozlar (FIPAT, 2019).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Arka çukura ve kafatası-boyun bileşkesine yaklaşırken',
      md: `- **Kemik kalınlığı:** art kafa kemiği sırtlarda, çıkıntılarda, kondillerde ve baziler kısmın önünde kalın; beyincik çukurlarında ise ince, yarı saydam ve diploesizdir (Gray, 1918).
- **Toplardamar işaretleri:** sinüslerin birleşiminin yeri iç çıkıntının bir yanındaki çukurlukla belli olur; transvers oluk genellikle sağda büyüktür ama sol büyük ya da iki yan eşit olabilir; beyincik orağındaki art kafa sinüsü bazen çifttir (Gray, 1918).
- **Emisser kanallar:** Yunanistan’da 200 örnekte (50 kafatası ve 150 BT) en sık emisser kanal arka kondil kanalıydı (%81); emisser delikler içinde en büyüğü de odur (Kostares ve ark., 2026). Aktarılan bir Türk çalışmasında kanal kafataslarının %27’sinde tek tarafta, %17’sinde iki tarafta yoktu; bu yüzden sabit bir cerrahi işaret sayılmamalıdır (Alghamdi ve ark., 2022). Art kafa emisser veni (Sperino veni) her zaman bulunmaz; bulunduğunda çoğunlukla transvers sinüse, sinüslerin birleşimine ya da art kafa sinüsüne katılır (Campbell ve ark., 2026).
- **Klivus ölçüleri:** normal klivus sfeno-oksipital sinkondrozdan basiona 3,2 cm’den uzundur; platibazide kısalabilir. Nasion, tuberculum sellae ve basion arasındaki açı (Welcker açısı) 130°’den küçük olmalıdır (Pang ve Thompson, 2011). Kondil hipoplazisinde iki atlanto-oksipital eklem arasındaki açı 127°’yi aşar (McAllister ve Sribnick, 2026).
- **Parakondiler çıkıntı:** doğuştan parakondiler çıkıntıya bağlı tortikolli (boyun eğriliği) olan ilk çocuk olgu, çıkıntının ameliyatla çıkarılmasıyla tedavi edilmiştir (Hey ve ark., 2024). Bu çıkıntı, proatlas somitinin art kafa kemiğine eksik katılımından doğan nadir bir gelişim anomalisidir (Hey ve ark., 2024).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Proatlas, üçüncü kondil ve adli tıp',
      md: `**Kafatası-boyun bileşkesinin gelişimi.** İlk üç art kafa somiti baziler kısmın ön bölümünü verir; dördüncü art kafa somiti birinci boyun somitinin baş tarafındaki yarısıyla birleşerek bileşkenin öncüsü olan **proatlası** yapar (Offiah ve Day, 2017). Proatlasın eksendeki bölgesi baziler kısmın alt ucunu (basion) ve densin tepe kısmını, yan yoğun bölgeleri ise kondilleri de içeren **ekzoksipital** kemikleri yapar (Pang ve Thompson, 2011; McAllister ve Sribnick, 2026); ekzoksipitaller foramen magnumun ön-yan kenarını da tamamlar (Pang ve Thompson, 2011). Proatlasın notokordun önündeki **hipokordal yayı** baziler kısmın ön yüzündeki ön klivus tüberkülünü verir (Pang ve Thompson, 2011). Bu yay kaynaşmazsa basionun alt ucunda **üçüncü kondil** (*condylus tertius*) denen kemik bir kalıntı görülebilir (Offiah ve Day, 2017); dens ya da atlasın ön kemeriyle eklem yapan bir yüz taşıyabilir (McAllister ve Sribnick, 2026). Hindistan’da 930 boyun BT’sinde üçüncü kondil yalnızca bir olguda görüldü (N. V. ve ark., 2019).

**Bozuk kemikleşmenin sonuçları.** Art kafa kemiğinin bozuk kemikleşmesi ve büyümesi foramen magnum darlığına (ör. tanatoforik displazide) ya da Chiari malformasyonu ve anensefali gibi bozukluklara eşlik edebilir (Han ve ark., 2025). Aynı MR çalışmasında 17–42 haftalık 40 fetüste yan ve baziler merkezlerin büyümesi doğrusal modelle en iyi açıklandı (Han ve ark., 2025).

**Adli tıp ve antropoloji.** Ense kristası, Walker yönteminde cinsiyet tahmini için kullanılan beş özellikten biridir ve bu özellikler içinde ilk olgunlaşanıdır (Houston ve ark., 2025); İtalyan bir örnekte gözlemciler arası tam uyum ense kristasında yalnızca %55,4’tü (Cappella ve ark., 2022). Dış art kafa çıkıntısının biçimiyle cinsiyet yaklaşık %79 doğrulukla tahmin edilebildiği aktarılır; diken tipi antropolojide Neandertallerle ilişkilendirilmiştir (Gong ve ark., 2026). Foramen magnum ve kondil ölçüleri ise cinsiyeti ayırmada %80’i aşamamıştır (Wang ve ark., 2024). Diken tipinin sıklığı çalışmalar arasında %6,5 ile %48,7 arasında değişir; bu fark yöntem ve örneklem farkından kaynaklanır (Gong ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Motosiklet kazasından sonra yutma güçlüğü',
      oyku: `28 yaşında bir motosiklet sürücüsü, kaskla yüksek hızda düşmüş. Acil serviste bilinci açık, boyun ağrısı var. Birkaç saat içinde sesi kısılıyor ve yutkunmakta zorlanıyor; dilini çıkarınca dil sola sapıyor, sol omzunu kaldırmakta güçlük çekiyor. Düz boyun grafisi normal yorumlanmış. İnce kesitli BT’de sol kondilin iç-alt kenarından kopmuş küçük bir kemik parçası foramen magnuma doğru yer değiştirmiş; kondil ile C1 arasındaki aralık 1,5 mm.`,
      soru: 'Bu kırık hangi tiptir, sinir bulguları kondilin hangi komşuluklarıyla açıklanır ve denge nasıl değerlendirilir?',
      cozum: `**Tip:** Kondilin iç-alt kenarından dense doğru kopan parça **Anderson–Montesano tip III** kırığıdır, yani kanat bağının kemiği koparmasıdır; en ağır ve dengesiz olabilecek tip sayılır (Batista ve ark., 2021; Kweh ve ark., 2026). Kanat bağı kondilin iç yanındaki pürüzlü tüberküle tutunur (Gray, 1918).

**Sinir bulguları:** Dilin sola sapması sol XII. sinirin, ses kısıklığı ve yutma güçlüğü IX ve X. sinirlerin, omuz güçsüzlüğü XI. sinirin tutulduğunu düşündürür; dördünün birlikte tutulması **Collet–Sicard sendromudur**. Kondil kırıklarında alt kafa sinirlerinin felci olguların üçte ikisinde hemen başlar (Offiah ve Day, 2017). Anatomi: hipoglossal kanal kondilin tabanını deler; juguler çentik juguler deliğin arka kısmını yapar; IX–XI juguler tüberkülün üstünden, bazen bir oluk içinde geçer (Gray, 1918).

**Görüntüleme:** Düz grafinin normal olması kırığı dışlamaz; çocuk serilerinde düz grafi kullanan çalışmaların hepsinde kırık ilk grafide görülmemiş, BT ise hepsinde saptamıştır (Morcos ve ark., 2024).

**Denge:** Tip tek başına kararı belirlemez. Tuli sınıflamasında bağ kopukluğuyla birlikte yer değiştirmiş kırık (2B) dengesizdir ve halo ya da cerrahi tespit gerektirir; AO Spine sınıflaması da bağ yaralanmasını ayrıca sınıflar (IB, IC). Büyük bir seride kondil ile C1 arasındaki aralığın 2,0 mm’den büyük olması tek önemli karar ölçütüydü (aktaran Kweh ve ark., 2026); bu hastada aralık 1,5 mm’dir. Kondil kırıklarının bir bölümüne C1 ve C2 kırıkları da eşlik ettiği için bileşkenin bütünüyle incelenmesi gerekir (Utheim ve ark., 2015). *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
