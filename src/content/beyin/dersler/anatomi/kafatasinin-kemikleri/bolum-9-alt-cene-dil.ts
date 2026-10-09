import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** Dil kemiğinin sahnelerdeki rengi (yalnızca tanıtır). */
const DIL_KEMIGI_RENGI = '#e9c46a';

/** 9. bölüm: alt çene kemiği (mandibula) ve dil kemiği (hiyoid); Meckel kıkırdağı ve kulak kemikçikleri üzerine kısa not. */
export const altCeneVeDilKemigi: DersBolumu = {
  id: 'alt-cene-ve-dil-kemigi',
  baslik: 'Alt çene kemiği ve dil kemiği',
  bloklar: [
    // ——— Alt çene: temel ———
    {
      tur: 'metin',
      md: `**Alt çene kemiği** (*mandibula*), yüzün en büyük ve en güçlü kemiğidir; alt dişler onun içine yerleşir (Gray, 1918). Güncel bir özet onu kafatasının da en büyük kemiği sayar: çene hattını çizer ve yüzün alt üçte birinin biçimini verir (Breeland ve ark., 2023). Genel bakış dersinde kafatasının hareket eden tek kemiği olduğunu görmüştük; başka hiçbir kemikle değil, yalnızca iki yandaki şakak kemikleriyle eklem yapar (Gray, 1918).

Kemik iki ana kısımdan oluşur (Gray, 1918):

- **Gövde** (*corpus mandibulae*): önde kavis çizen, at nalı biçimli yatay kısım. Üst kenarı olan **alveol kısmı** (*pars alveolaris*) dişlerin oturduğu yuvaları taşır; Gray, derinlik ve büyüklükleri dişe göre değişen 16 yuva sayar.
- **Dal** (*ramus mandibulae*): gövdenin iki arka ucundan neredeyse dik açıyla yukarı kalkan, dörtgen biçimli yassı kısım. Gövde ile dalın birleştiği dış köşeye **alt çene açısı** (*angulus mandibulae*) denir (OpenStax 7.2).

Her dalın üst kenarında iki çıkıntı vardır. Öndeki ince, üçgen **koronoid çıkıntıya** (*processus coronoideus*) temporal kas ve masseter yapışır. Arkadaki **kondil çıkıntısı** iki kısımdır: eklem yüzünü taşıyan **kondil** (*caput mandibulae*) ve onu taşıyan daralmış **boyun** (*collum mandibulae*). İki çıkıntının arasındaki derin, yarım ay biçimli oyuk **mandibula çentiğidir** (*incisura mandibulae*) (Gray, 1918).`,
    },
    {
      tur: 'metin',
      md: `**Önden ve dıştan görülen işaretler.** Gövdenin ön yüzünün ortasında hafif bir sırt uzanır: burası, yaşamın başında ayrı olan iki yarının birleşme çizgisi, **simfizdir** (*symphysis mandibulae*). Sırt aşağıda ikiye ayrılarak üçgen biçimli **çene çıkıntısını** (*protuberantia mentalis*) sarar; çenenin ucundaki kabartı budur (Gray, 1918).

**Çene deliği** (*foramen mentale*) her iki yanda, ikinci küçük azı dişinin altında, gövdenin üst ve alt kenarlarının ortasında açılır; içinden **çene siniri** (*nervus mentalis*) ve damarları çıkar (Gray, 1918). Bu sinir alt dudağın derisini ve mukozasını, ağız vestibülünü (dudak ve yanak ile dişler arasındaki boşluk), birinci büyük azının önündeki diş etini ve çene derisini duyurur (Coban ve ark., 2025).

**İçten görülen işaretler.** Dalın iç yüzünün ortasında **mandibular delik** (*foramen mandibulae*) bulunur. **Alt alveoler sinir** (*nervus alveolaris inferior*) ve damarları buradan kemiğe girer ve gövdenin içinde, diş yuvalarının altından geçen **mandibular kanalda** ilerler (Gray, 1918). Deliğin önünde, adı “dilcik” anlamına gelen keskin bir kemik diken yükselir: **lingula** (*lingula mandibulae*). Diş hekimi alt dişleri uyuşturmak için ilacı, sinir bu deliğe girmeden önceki noktaya verir (OpenStax 7.2).`,
    },
    {
      tur: 'sahne',
      baslik: 'Alt çene soldan',
      aciklama:
        'Alt çeneye soldan bakıyoruz; kemik tek başına ve kendi renginde. Önde gövde, gövdenin ortasında çene deliği ve en önde çene çıkıntısı; arkada dikey dal, dalın tepesinde öndeki koronoid çıkıntı, arkadaki kondil başı ve ikisinin arasındaki mandibula çentiği görülür. Gövde ile dalın birleştiği köşe açıdır. Mandibular delik dalın iç yüzünde olduğu için bu bakıştan görünmez; “Bakış” düğmesiyle kemiği arkadan ya da yukarıdan görebilirsin.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['alt-cene-kemigi'],
        vurgula: ['alt-cene-kemigi'],
        boya: [{ secici: ['alt-cene-kemigi'], renk: KEMIK_RENGI.altCene }],
        noktalar: [
          { nokta: 'kondil-basi-sol' },
          { nokta: 'koronoid-cikinti-sol' },
          { nokta: 'alt-cene-centigi-sol' },
          { nokta: 'alt-cene-dali-sol' },
          { nokta: 'alt-cene-acisi-sol' },
          { nokta: 'alt-cene-govdesi-sol' },
          { nokta: 'cene-deligi-sol' },
          { nokta: 'cene-cikintisi' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'sayilar',
      baslik: 'Alt çenenin açısı yaşla değişir',
      ogeler: [
        { deger: '175°', aciklama: 'Doğumda: açı çok geniştir; kondil çıkıntısı neredeyse gövdeyle aynı hizadadır.' },
        { deger: '140°', aciklama: 'Dört yaş civarında: açı daralmıştır.' },
        { deger: '110–120°', aciklama: 'Erişkinde: dal neredeyse dikeydir.' },
        { deger: '≈140°', aciklama: 'Yaşlılıkta: dal yeniden eğikleşir, kondil boynu az çok arkaya bükülür.' },
      ],
      not: 'Kaynak: Gray (1918).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Kulağımızdaki iki kemik ve alt çene',
      md: 'Genel bakış dersinde kafatasına sayılmayan yedi kemikten söz etmiştik: dil kemiği ve kulak kemikçikleri. Kemikçiklerin ikisinin alt çeneyle ortak bir geçmişi var. Embriyoda her iki yanda **Meckel kıkırdağı** bulunur ve alt çene bu kıkırdağın dış yüzünü örten lifli zarda kemikleşir. Aynı kıkırdağın proksimal ucundan orta kulağın iki kemikçiği, **çekiç** (*malleus*) ve **örs** (*incus*) gelişir (Gray, 1918). Yani kulağımızdaki bu iki minik kemik ile alt çenemiz, embriyoda aynı kıkırdağın çevresinde biçimlenir.',
    },

    // ——— Alt çene: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gövdenin dış yüzü.** Çene çıkıntısının tabanı ortada çukur, iki yanda kabarıktır; bu iki kabartı **çene tüberkülleridir** (*tuberculum mentale*). Kesici dişlerin altındaki **kesici çukurdan** (Gray: *incisive fossa*) mentalis kası ve orbicularis oris’in küçük bir kısmı başlar. Her çene tüberkülünden arkaya ve yukarı hafif bir sırt, **eğik çizgi** (*linea obliqua*) uzanır ve dalın ön kenarına devam eder. Buraya Gray’in *quadratus labii inferioris* ve *triangularis* adıyla andığı kaslar tutunur, altına da platysma yapışır (Gray, 1918). *Triangularis*, bugün işlevini anlatan adıyla, ağız köşesini aşağı çeken kastır: *musculus depressor anguli oris* (FIPAT, 2019).

**Gövdenin iç yüzü.** Simfizin arka yüzünün alt kısmında iki küçük diken, **çene dikenleri** (Gray: *mental spines*; TA2: *spina mentalis superior*), genioglossus kaslarına başlangıç verir; hemen altlarındaki ikinci bir diken çifti (*spina mentalis inferior*) ya da daha sık görülen bir orta sırt geniohyoid kaslar içindir. Dikenler bazen tek bir kabartıda kaynaşır, bazen hiç yoktur. Üstlerinde bazen görülen küçük bir delik ve oluk, iki yarının birleşme çizgisini işaret eder. Dikenlerin altında, orta hattın iki yanında, digastrik kasın ön karnının tutunduğu oval **digastrik çukur** (*fossa digastrica*) yer alır (Gray, 1918).

Simfizin alt kısmından yukarı ve arkaya **milohyoid çizgi** (*linea mylohyoidea*) uzanır; ağız tabanını yapan milohyoid kas iki yanda bu çizgilere tutunur (Gray, 1918; OpenStax 7.2). Çizginin arka ucuna yutağın üst daraltıcı kasının küçük bir kısmı ve pterigomandibular rafe yapışır. Çizginin ön kısmının üstünde dil altı bezinin yaslandığı düz, üçgen bir alan; arka kısmının altında çene altı bezi için oval bir çukur vardır (Gray, 1918). Gray’in *submaxillary* dediği bu bez bugün *glandula submandibularis* adını taşır (FIPAT, 2019). Bazı kişilerde köpek dişinin arkasındaki dişler hizasında, alveol kısmının dil tarafındaki tabanında bir kemik kabartısı bulunur: **torus mandibularis** (FIPAT, 2019).

**Alveol kenarı.** Dış dudağına, birinci büyük azıya kadar, yanak kası buccinator tutunur (Gray, 1918).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dal** dörtgen biçimlidir; iki yüzü, dört kenarı ve iki çıkıntısı vardır. Dış yüzünün neredeyse tamamına masseter tutunur. İç yüzünün ortasındaki eğik mandibular deliğin önünde yükselen lingulaya **sfenomandibular bağ** yapışır. Deliğin arka-alt kenarındaki çentikten **milohyoid oluk** (*sulcus mylohyoideus*) aşağı ve öne iner; içinde milohyoid sinir ve damarlar uzanır. Oluğun arkasındaki pürüzlü alan medial pterigoid kasın yapışma yeridir (Gray, 1918). TA2 notu bu deliğe *foramen alveolare inferius* adını verir: alt çenede başka delikler de bulunduğu için delik, içinden geçen alt alveoler damar-sinir demetine göre adlandırılmıştır (FIPAT, 2019).

**Açı** içe ya da dışa dönük olabilir. İki yüzündeki pürüzlü eğik sırtlara dışta masseter, içte medial pterigoid yapışır; iki kasın arasına **stilomandibular bağ** tutunur. Dalın **arka kenarı** kalın, düzgün ve yuvarlaktır; üstünü kulak altı bezi (parotis) örter (Gray, 1918).

**Koronoid çıkıntı** ince, üçgen ve yandan basıktır; biçimi ve büyüklüğü kişiden kişiye değişir. Dış yüzüne temporal kas ve masseter yapışır; iç yüzündeki üçgen alanın üst kısmına temporal kas, alt kısmına buccinatorun bazı lifleri tutunur (Gray, 1918). FIPAT’a göre *processus coronoideus* bilgi vermeyen ve pek uygun olmayan bir terimdir; yalnızca çok yerleşik olduğu için korunmuştur (FIPAT, 2019).

**Kondil çıkıntısı** (Gray’in kitabında *processus condyloideus*, TA2’de *processus condylaris*) kondil ve boyundan oluşur. Kondilin eklem yüzü çene ekleminin diskiyle eklem yapar. Uzun ekseni içe ve hafifçe arkaya yönelir: iki kondilin eksenleri orta hatta uzatılırsa foramen magnumun ön kenarı yakınında buluşur. Kondilin dış ucundaki küçük tüberküle **temporomandibular bağ** tutunur (Gray, 1918). Boynun ön-iç yüzündeki **pterigoid çukurcuğa** (*fovea pterygoidea*) lateral pterigoid kasın hem üst hem alt karnı yapışır; bazı kişilerde üst karnın bir kısmı eklem kapsülüne de tutunur (de Oliveira ve ark., 2023).

**Mandibula çentiği** iki çıkıntıyı ayıran derin, yarım ay biçimli oyuktur; üzerinden masseter kasına giden damar ve sinir geçer (Gray, 1918). Bu terim anatomi terminolojisine 1961’de eklenmiştir (FIPAT, 2019).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Alt çenenin iç yüzü: arkadan bakış',
      aciklama:
        'Alt çeneye arkadan bakıyoruz; at nalının içi, yani dalların ve gövdenin dil tarafındaki yüzü görünür. Sol dalın iç yüzünde lingula ve hemen arkasında mandibular delik, dalın tepesinde kondil başı, aşağıda açı işaretli; gövdenin iç yüzünde öne ve aşağı inen milohyoid çizgi seçilir. Modelde mandibular delik sığ bir çukur olarak sadeleşmiştir, nokta ağzının yerini gösterir; milohyoid çizgi de ağda silik bir sırttır, nokta yaklaşık yerini verir. Çene dikenleri, digastrik çukur ve pterigoid çukurcuk modelde yoktur.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'arka',
        goster: ['alt-cene-kemigi'],
        vurgula: ['alt-cene-kemigi'],
        boya: [{ secici: ['alt-cene-kemigi'], renk: KEMIK_RENGI.altCene }],
        noktalar: [
          { nokta: 'lingula-sol' },
          { nokta: 'alt-cene-deligi-sol' },
          { nokta: 'milohyoid-cizgi-sol' },
          { nokta: 'kondil-basi-sol' },
          { nokta: 'alt-cene-acisi-sol' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Alt çenenin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        ['Simfiz', '*Symphysis mandibulae*', 'Ön orta hat', 'İki yarının birleşme çizgisi; ilk yılda kemikleşir'],
        [
          'Çene çıkıntısı ve tüberkülleri',
          '*Protuberantia mentalis*, *tuberculum mentale*',
          'Simfizin alt ucu, ön yüz',
          'Çenenin ucundaki üçgen kabartı ve iki yanındaki tüberküller',
        ],
        ['Kesici çukur', '—', 'Kesici dişlerin altı, dış yüz', 'Mentalis; orbicularis oris’in küçük bir kısmı'],
        ['Çene deliği', '*Foramen mentale*', 'İkinci küçük azının altı, gövde yüksekliğinin ortası', 'Çene siniri ve damarları'],
        [
          'Eğik çizgi',
          '*Linea obliqua*',
          'Çene tüberkülünden dalın ön kenarına',
          'Depressor anguli oris (Gray: triangularis), Gray’in quadratus labii inferioris’i; altında platysma',
        ],
        [
          'Çene dikenleri',
          '*Spina mentalis superior*, *spina mentalis inferior*',
          'Simfizin iç yüzü, alt kısım',
          'Üst çift genioglossus, alt çift ya da orta sırt geniohyoid',
        ],
        ['Digastrik çukur', '*Fossa digastrica*', 'Dikenlerin altı, orta hattın iki yanı', 'Digastrik kasın ön karnı'],
        [
          'Milohyoid çizgi',
          '*Linea mylohyoidea*',
          'İç yüz; simfizin altından yukarı ve arkaya',
          'Milohyoid kas; arka uçta üst yutak daraltıcısı ve pterigomandibular rafe',
        ],
        [
          'Bez çukurları',
          '*Fovea sublingualis*, *fovea submandibularis*',
          'Çizginin önünün üstü / arkasının altı',
          'Dil altı bezi / çene altı bezi',
        ],
        ['Alveol kısmı', '*Pars alveolaris*', 'Gövdenin üst kenarı', '16 diş yuvası; dışta birinci büyük azıya kadar buccinator'],
        [
          'Mandibular delik',
          '*Foramen alveolare inferius* (eşanlamlısı *foramen mandibulae*)',
          'Dalın iç yüzünün ortası',
          'Alt alveoler sinir ve damarlar (giriş)',
        ],
        ['Lingula', '*Lingula mandibulae*', 'Mandibular deliğin önü', 'Sfenomandibular bağ'],
        [
          'Milohyoid oluk',
          '*Sulcus mylohyoideus*',
          'Deliğin arka-alt çentiğinden aşağı ve öne',
          'Milohyoid sinir ve damarlar; arkasında medial pterigoid',
        ],
        [
          'Mandibular kanal',
          '*Canalis mandibulae*',
          'Dalda aşağı-öne eğik, gövdede yatay',
          'Alt alveoler sinir, arter, ven ve lenf damarları',
        ],
        [
          'Açı',
          '*Angulus mandibulae*',
          'Dalın alt ve arka kenarlarının birleşimi',
          'Dışta masseter, içte medial pterigoid; arada stilomandibular bağ',
        ],
        [
          'Koronoid çıkıntı',
          '*Processus coronoideus*',
          'Dalın üst kenarının önü',
          'Temporal kas ve masseter; iç yüzde buccinatorun bazı lifleri',
        ],
        [
          'Kondil ve boyun',
          '*Caput* ve *collum mandibulae*',
          'Dalın üst kenarının arkası',
          'Eklem diski; dış uçta temporomandibular bağ; boyunda pterigoid çukurcuk (lateral pterigoid)',
        ],
        ['Mandibula çentiği', '*Incisura mandibulae*', 'İki çıkıntının arası', 'Masseterik damar ve sinir'],
      ],
      not: 'Kaynaklar: Gray (1918); FIPAT (2019); Juodzbalys ve ark. (2010a); de Oliveira ve ark. (2023). Kesici çukur için Latince ad verilmedi.',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Mandibular kanalın yolu',
      md: `Mandibular kanal dalda aşağı ve öne eğik, gövdede ise yatay olarak öne ilerler. Gövdede diş yuvalarının altında yer alır ve küçük deliklerle onlara açılır; kesici dişlere ulaşınca geri dönerek çene deliğine açılır ve kesici dişlerin yuvalarına iki küçük kanal verir. Kemiğin arka üçte ikisinde iç yüze, ön üçte birinde dış yüze daha yakındır (Gray, 1918).

Modern çalışmalar bu tabloyu ayrıntılandırır. Kanalın içinde alt alveoler sinir; arter, ven ve lenf damarlarıyla birlikte bir demet hâlinde ilerler. Olguların %70’inde kanal gövde boyunca S biçiminde kıvrılır: büyük azılar hizasında dil yüzüne, öne doğru ise vestibül yüzüne yaklaşır. 105 kadavra alt çenesinde kanalın yatay kısmının ortalama çapı 2,6 mm bulunmuştur. Çene deliğinin önünde kanala **kesici kanal** denir (Juodzbalys ve ark., 2010a).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Çene eklemi** (*articulatio temporomandibularis*), alt çenenin iki yanda şakak kemikleriyle yaptığı eklemdir. Gray bu eklemi *ginglimo-artrodiyal*, yani menteşe ve kayma özelliklerini birleştiren bir eklem olarak sınıflar: üstte şakak kemiğinin çene çukurunun (*fossa mandibularis*) ön kısmı ile eklem tüberkülü, altta alt çenenin kondili eklemi yapar (Gray, 1918). FIPAT notu, eklem tüberkülü (*tuberculum articulare*) ile *eminentia articularis*’in ayrı yapılar olduğunu vurgular (FIPAT, 2019).

Kemik yüzlerin arasına **eklem diski** girer: iki yüzü de içbükey olan bir lifli kıkırdaktır; ön ve arka bantları ortadaki ara bölgeden kalındır (de Oliveira ve ark., 2023). Disk eklemi, her biri kendi sinovyal zarıyla döşeli iki boşluğa ayırır (Gray, 1918); normalde üst ve alt boşluk arasında bağlantı yoktur. Disk arkada, arka banda yapışan **bilaminer bölgeyle** (retrodiskal doku) sabitlenir (de Oliveira ve ark., 2023). Gray’in vurguladığı gibi burada aslında iki ayrı eklem vardır: biri kondil ile disk, öteki disk ile çene çukuru arasında (Gray, 1918). Sağ ve sol eklem eşgüdüm içinde çalışır; bu eşgüdüm hareketlerin iki yanda senkron olmasını sağlar (Bordoni ve Brizuela, 2025).

Eklemin çevresindeki bağlar alt çenenin kendi işaretlerine tutunur: **temporomandibular bağ** kondilin dış ucundaki tüberküle; **sfenomandibular bağ** kama kemiğinin dikeninden (Gray: *spina angularis*) inip genişleyerek lingulaya; **stilomandibular bağ** ise açıya (Gray, 1918). OpenStax, lingulaya yapışan bağın ağız açılıp kapanırken alt çeneyi sabitlediğini yazar (OpenStax 7.2).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      md: `- **Eklem:** Çene eklemi bozukluklarının araştırılmasında seçilecek yöntem MR’dır; eklemi ilgilendiren kırıkların değerlendirilmesinde ise BT tercih edilir (de Oliveira ve ark., 2023).
- **Mandibular kanalın yüksekliği:** 3.612 panoramik grafide kanalların %48’i yüksek, %49’u alçak seyirliydi; yalnızca %3’ü bu iki gruba sokulamadı (Juodzbalys ve ark., 2010a).
- **Ek çene delikleri:** Panoramik grafi aksesuar çene deliklerini çoğu kez göstermez. Bir çalışmada konik ışınlı bilgisayarlı tomografide (KIBT) saptanan aksesuar deliklerin yalnızca %15,79’u panoramik grafide de görülebildi (Pelé ve ark., 2021).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemikleşme.** Alt çene, embriyodaki Meckel kıkırdaklarının dış yüzünü örten lifli zarda kemikleşir. Her yarı, fetal yaşamın 6. haftası civarında çene deliğinin yakınında beliren tek bir merkezden oluşur. Daha sonra kondil çıkıntısında (dala doğru uzanan kama biçimli bir çekirdek), koronoid çıkıntının ön kenarında ve birkaç küçük yerde daha ek kıkırdak çekirdekleri belirir; bunların ayrı kemikleşme merkezi yoktur, çevredeki zar kemiği tarafından işgal edilip emilirler. Ayrı bir “splenial” merkezden geldiği söylenen iç alveol kenarı ise insanda ana kemik kitlesinden içeri doğru büyüyerek oluşur (Gray, 1918).

**Meckel kıkırdağının yazgısı.** Kıkırdağın proksimal ucundan orta kulağın çekiç ve örs kemikçikleri gelişir; ardından gelen ve lingulaya kadar uzanan parçası lifli dokuya dönüşür ve **sfenomandibular bağ** olarak kalır (Gray, 1918). Bağın lingulaya uzanması bu kökenle uyumludur.

**Simfiz.** Doğumda kemik, lifli bir simfizle bağlı iki parçadır; simfiz ilk yılda kemikleşir (Gray, 1918; OpenStax 7.2). Kaynaşma aşağıdan yukarı ilerler; ikinci yılın başında alveol kenarına yakın bir ayrılma izi hâlâ görülebilir (Gray, 1918).

*Tanım farkı:* OpenStax yüz kemiklerini kıkırdak taslağı üzerinden gelişen grupta sayar (OpenStax 7.5); Gray ise alt çenenin zarda kemikleştiğini ayrıntısıyla anlatır (Gray, 1918). Bu derste alt çene için Gray’in ayrıntısı esas alındı.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yaşla değişen yerler.** Doğumda yüz kısmı kranyumun hacminin ancak sekizde biri kadardır (erişkinde yarısı); başlıca nedenler üst ve alt çenenin henüz ilkel olması, dişlerin çıkmamış olması, maksiller sinüslerin ve burun boşluklarının küçüklüğüdür (Gray, 1918). Doğumda çene deliği birinci süt azısının yuvasının altında açılır; erişkinde gövdenin üst ve alt kenarlarının ortasına yerleşir (Gray, 1918).

Yaşlı kafatasının en çarpıcı özelliği, diş kaybı ve diş yuvası çıkıntılarının erimesiyle üst ve alt çenenin küçülmesidir. Alt çenede mandibular kanal ve ondan açılan çene deliği alveol kenarına yaklaşır (Gray, 1918). Diş çekimi ve kemik erimesinden sonra delik alveol tepesine yaklaşır; erimenin çok ileri olduğu durumlarda delik ve alt alveoler sinirin son kısmı kemiğin yüzeyinde, doğrudan diş etinin altında bulunabilir. Dişsiz çenede kesici kanal da daha seyrek seçilir: 105 kadavrada belirgin bir kesici kanal dişli 70 alt çenenin %92’sinde, dişsiz 30 alt çenenin ise yalnızca %31’inde görüldü (Juodzbalys ve ark., 2010b).

Cinsiyet farkı: kadın kafatasında yüz kemikleri daha düzgün; üst ve alt çene ile taşıdıkları dişler daha küçüktür (Gray, 1918).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Alt dudak neden uyuşur?',
      md: `Çene siniri alt dudağın, ağız mukozasının ve deliğinin önündeki çene derisinin duyusunu verir (Nguyen ve Duong, 2023). Bu yüzden alt dudakta ve çenede tek taraflı uyuşma, sinirin yolu boyunca bir sorunu düşündürür. Mandibular kanaldan geçen bir kırık alt alveoler siniri yaralayabilir ve alt dudakta, çenede ve alt dişlerde duyu kaybı yapabilir (Gómez Roselló ve ark., 2020).

Kanal dişlere de yakındır: üst sınırı birinci ve ikinci büyük azı köklerinin uçlarının 3,5–5,4 mm altındadır. Kanal bazı kişilerde dikey ya da yatay düzlemde ikiye ayrılır; bu çatallanmanın bildirilen sıklığı inceleme yöntemine göre %0,08 ile %65 arasında değişir (Juodzbalys ve ark., 2010a).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Mandibular delik:** alt alveoler sinir ve damarlar girer; önünde **lingula** (sfenomandibular bağ), arka-alt çentiğinden başlayan **milohyoid oluk** (milohyoid sinir ve damarlar).
- **Çene deliği:** ikinci küçük azının altında, gövde yüksekliğinin ortasında; çene siniri çıkar.
- **Kas yapışmaları:** koronoid → temporal kas ve masseter; pterigoid çukurcuk (kondil boynu) → lateral pterigoid; açı → dışta masseter, içte medial pterigoid; dalın dış yüzü → masseter.
- **Mandibula çentiği:** masseterik damar ve sinir geçer.
- **Milohyoid çizgi:** ön kısmının üstünde dil altı bezi, arka kısmının altında çene altı bezi çukuru.
- **Meckel kıkırdağı:** çekiç, örs ve sfenomandibular bağ; alt çenenin kendisi zarda kemikleşir.
- **Açı:** doğumda 175°, erişkinde 110–120°, yaşlılıkta yaklaşık 140°.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kırıklar.** Bir görüntüleme derlemesi alt çene kırıklarını acil servislerde en sık görülen yüz kırıkları arasında sayar ve oranlarını %60–70 olarak verir (Nardi ve ark., 2020). Başka bir derlemeye göre ameliyat gereken yüz travmalarında en sık kırılan kemik alt çenedir (%41,6–75,2); bütün acil hastaları birlikte düşünüldüğünde ise en sık kırık burun kemiğindedir (Gómez Roselló ve ark., 2020). Bu kırıklar en çok genç erkeklerde görülür ve yarısı kişiler arası şiddete bağlıdır (Breeland ve ark., 2023). Seriler arasındaki fark büyüktür: Ankara’da acil serviste yüz BT’si çekilen 754 hastada kırılan yüz kemiklerinin yalnızca %8,4’ü alt çeneydi (Arslan ve ark., 2014); bu seri yalnızca yüz BT’si çekilen hastaları kapsadığı ve yalnızca burun ya da diş-alveol kırığı olanları dışarıda bıraktığı için seçim yanlılığı taşır.

Kırığın yerini kemiğin yapısı belirler. **Kondil boynu** alt çenenin en zayıf yeridir; bu zayıflık darbenin enerjisini keserek orta kafa çukurunu korumaya yarar. Çenenin ucuna, simfize gelen bir darbede iki kondil boynunun birlikte kırılması sıktır. Gömük dişler ve köpek dişi gibi uzun köklü dişler de zayıflık çizgileri oluşturur. Açı kırıkları üçüncü büyük azının arkasında olur ve sıklıkla saldırıya bağlıdır (Nardi ve ark., 2020). İstanbul’da 158 hastanın KIBT ile çıkarılan kırık haritasında kırık çizgileri retromolar alanda, kondil boynunda, köpek dişi yuvasında ve çene deliği çevresinde kümelendi (Askin Ekinci ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Alt çene kırıkları nerede olur?',
      sutunlar: ['Bölge', 'Derlemedeki oran', 'Türk serileri ve notlar'],
      satirlar: [
        ['Simfiz / parasimfiz', '%30–50', 'Diyarbakır serisinde bütün hastalarda en sık bölge; erişkinlerde %36'],
        ['Gövde', '%21–36', 'Diyarbakır erişkinlerinde %20; uzun köklü köpek dişi zayıflık çizgisi oluşturur'],
        ['Açı', '%15–26', 'Üçüncü büyük azının arkasında, sıklıkla saldırıya bağlı; İstanbul serisinde açı/dal bölgesi en sık kırılan yer'],
        ['Dal', '%2–4', '—'],
        [
          'Kondil',
          '%20–26',
          'Diyarbakır serisinde çocuk ve ergenlerde en sık (%36), erişkinlerde %20; çeneye gelen darbede iki kondil boynu birlikte kırılabilir',
        ],
        ['Koronoid çıkıntı', '%1–2', '—'],
      ],
      not: 'Derleme oranları: Nardi ve ark. (2020). Türk serileri: Diyarbakır, 532 hasta ve 744 kırık (Atilgan ve ark., 2010); İstanbul, 158 hasta, KIBT ile kırık haritası (Askin Ekinci ve ark., 2026). Seriler hasta seçimi ve yöntem bakımından farklı olduğu için oranlar dikkatle karşılaştırılmalıdır.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Çenesinin ucuna yumruk alan genç adam',
      oyku: '24 yaşında bir erkek, bir kavgada çenesinin ucuna yumruk aldıktan sonra acile geliyor. İki kulağının hemen önünde ağrı var ve dişlerini eskisi gibi kapatamadığını söylüyor. Çenenin ucunda şişlik ve dokunmakla ağrı var; sol alt dudağında ve çenesinin sol yarısında uyuşma tarif ediyor.',
      soru: 'Bu darbede alt çenenin hangi bölgelerinde kırık beklenir, uyuşma neyi düşündürür ve eklem bölgesi hangi yöntemle görüntülenir?',
      cozum: `**Darbe yeri:** Simfiz/parasimfiz alt çene kırıklarının en sık yeridir (%30–50); Diyarbakır serisinde de erişkinlerde ilk sıradadır (%36) (Nardi ve ark., 2020; Atilgan ve ark., 2010).

**Uzaktaki kırık:** Yalnızca darbe yerine bakmak yetmez. Kondil boynu kemiğin en zayıf yeridir ve çenenin ucuna gelen darbede iki kondil boynunun birlikte kırılması sıktır (Nardi ve ark., 2020). Kulakların önündeki ağrı, kondilin şakak kemiğiyle eklem yaptığı bölgeye işaret eder.

**Uyuşma:** Alt dudak ve çene derisi çene sinirinin alanıdır (Nguyen ve Duong, 2023). Mandibular kanaldan geçen bir kırık alt alveoler siniri yaralayıp alt dudakta, çenede ve dişlerde duyu kaybı yapabilir (Gómez Roselló ve ark., 2020); çene deliği çevresi, kırık çizgilerinin kümelendiği yerlerden biridir (Askin Ekinci ve ark., 2026).

**Görüntüleme:** Çene eklemini ilgilendiren kırıklarda tercih edilen yöntem BT’dir (de Oliveira ve ark., 2023).

*Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Alt çene: uzman ———
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'Alt çene yukarıdan: blok iğnesinin hedefi',
      aciklama:
        'Alt çeneye yukarıdan bakıyoruz; yüz ekranın üst tarafında, at nalının açık ucu aşağıda. Sol dalın iç yüzünde lingula ve hemen arkasındaki mandibular delik, dalın tepesinde mandibula çentiği işaretli. Alt alveoler sinir bloğunda hedef, sinirin bu deliğe girmeden önceki kısmıdır. Modelde mandibular delik sığ bir çukur olarak sadeleşmiştir; nokta ağzının yerini gösterir.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'ust',
        goster: ['alt-cene-kemigi'],
        vurgula: ['alt-cene-kemigi'],
        boya: [{ secici: ['alt-cene-kemigi'], renk: KEMIK_RENGI.altCene }],
        noktalar: [{ nokta: 'lingula-sol' }, { nokta: 'alt-cene-deligi-sol' }, { nokta: 'alt-cene-centigi-sol' }],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Alt alveoler sinir bloğu: delik nerede?',
      md: `Bu blokta başarısızlık %15–20’dir; lokal anestezideki klinik başarısızlıklar içinde en yüksek orandır (Khalil, 2014). Bildirilen oranlar %13–57 arasında değişir ve başarısızlığın en önemli nedeni mandibular deliğin yerinin belirlenememesidir (Nalbantoğlu ve ark., 2024).

**Ağız içindeki işaretler.** En önemli iki klinik işaret koronoid çentik ile pterigomandibular rafedir; iğnenin tercih edilen giriş yeri bu ikisinin arasındadır (Khalil, 2014). Khalil koronoid çentiği, dalın üst kenarındaki mandibula (sigmoid) çentiğinden ayrı bir işaret olarak sayar.

**Anadolu’dan 115 kuru alt çene** (Nalbantoğlu ve ark., 2024):

- Deliklerin %50,23’ü okluzal düzlemin (diş kapanış düzlemi) altındaydı; düzlemin üstünde kalanlar ortalama 3,45 mm yukarıda, altında kalanlar 4,78 mm aşağıdaydı.
- Delik dalın ön kenarına 14,71 mm, arka kenarına 12,67 mm uzaktaydı; yani yaklaşık dalın ortasındaydı.
- Yazarların önerisi: iğne okluzal düzlemin 3–4 mm üstünden ve ön kenarın 1,5–2 mm arkasından girmeli.

**Başka toplumlar.** Kore’de 30 kişinin 58 deliğinin KIBT ile incelendiği çalışmada delik okluzal düzlemin hemen altındaydı (erkekte 0,1, kadında 0,8 mm) ve lingula erkekte 9,3, kadında 8,2 mm yüksekti (Ahn ve ark., 2020). Güney Hindistan’dan 204 kuru alt çenede deliğin ön kenara uzaklığı sağda 17,11, solda 17,41 mm idi ve alt çenelerin %32,36’sında **aksesuar mandibular delik** vardı (Shalini ve ark., 2016).

**Tehlike arkada.** İğne arkaya, dalın arka kenarına doğru yönelirse anestezik kulak altı bezinin bölgesinde birikir ve yüz felcine yol açabilir (Khalil, 2014); dalın arka kenarını parotis bezi örter (Gray, 1918).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Lingulanın biçimi (Tuli sınıflaması)',
      sutunlar: ['Tip', 'Kore KIBT serisi (58 taraf)', 'Not'],
      satirlar: [
        ['Nodüler', '%32,8', 'Bu seride en sık tip'],
        ['Üçgen', '%31,0', 'Tuli ve arkadaşlarının Hint örnekleminde en sık tip (%68,5)'],
        ['Kesik (trunkat)', '%25,9', '—'],
        ['Asimile', '%10,3', '—'],
      ],
      not: 'Kaynak: Ahn ve ark. (2020); Tuli ve arkadaşlarının sonucu bu makaleden aktarıldı. Makalede erkeklere ait sıralama metinde tutarsız verildiği için yalnızca toplam dağılım alındı.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Çene deliği çevresinde implant ve cerrahi',
      md: `**Konum.** Ordu’da 301 hastanın KIBT görüntülerinde çene deliği en sık ikinci küçük azının kök ucu hizasındaydı (sağda %45,4, solda %52,1); deliğin orta hatta uzaklığı kadınlarda ortalama 25,54, erkeklerde 26,7 mm idi (Coban ve ark., 2025). 72 KIBT çalışmasını derleyen sistematik incelemeye göre delik çoğunlukla iki küçük azının arasında (%50,4–61,95) ya da ikinci küçük azının kök ucu hizasındadır (%50,3–57,9). Dikeyde gövdenin yaklaşık ortasındadır; alt kenara uzaklığı ortalama 10–15 mm’dir. Ortalama çapı 2,08–4,44 mm arasında bildirilmiştir, çoğunlukla 3 mm civarındadır ve bütün çalışmalarda erkeklerde daha büyüktür. İki delik arasındaki uzaklık yaklaşık 46,5–51,4 mm’dir (Pelé ve ark., 2021).

**Ön halka.** Çene sinirinin deliğin önünde yaptığı **ön halka** (*anterior loop*) nedeniyle implant planlamasında deliğin en ön noktasından 4 mm güvenlik payı bırakılması önerilir. Mental kanalın deliğe çıkış yönü Kafkas ve Maori kafataslarında en sık arkaya doğrudur (Juodzbalys ve ark., 2010b).

**Dişsiz çene.** Kemik eridikçe delik alveol tepesine yaklaşır; ileri erimede delik ve sinirin son kısmı doğrudan diş etinin altında kalabilir (Juodzbalys ve ark., 2010b).

**Yüz destekleri.** Cerrahide yüz iskeleti dört çift yatay ve dört çift dikey destekle (*buttress*) basitleştirilir; dikey desteklerden biri arka mandibular destektir. Destek kemikleri yüzün geri kalanından kalındır ve dişleri, burun boşluğunu, sinüsleri ve göz çukurunu koruyan sağlam bir çatı oluşturur (Gómez Roselló ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Aksesuar çene deliği: sıklık yönteme bağlı',
      md: `Ana deliğin yanında bir ya da daha çok **aksesuar çene deliği** bulunabilir. Ordu serisinde 301 hastanın 39’unda (%13) toplam 42 aksesuar delik görüldü; en sık ana deliğin arka-altındaydı (%35,5) ve ana deliğe ortalama uzaklığı 7,83 mm (3,15–19,55 mm) idi. Türk toplumunda yapılan çalışmalarda sıklık %2–12,2, genel literatürde %2–14,3 olarak bildirilmiştir (Coban ve ark., 2025).

Sonucu yöntem belirler. KIBT çalışmalarında sıklık %2–26 arasındadır ve panoramik grafi bu deliklerin çoğunu göstermez (Pelé ve ark., 2021). Kuru alt çenelerde 27 çalışmayı ve 114 Yunan alt çenesini birleştiren meta-analizde birleşik sıklık %6,1 (%95 güven aralığı 4,8–7,6) bulundu; aksesuar delik bulunan olguların yalnızca %2,1’inde delik iki taraflıydı ve ana deliğe birleşik ortalama uzaklık 3,64 ± 2,29 mm idi (Thomaidi ve ark., 2025). Sawyer ve arkadaşlarının kafatası çalışmasında dört toplum grubunda sıklık %1,4 ile %9 arasında değişiyordu (Juodzbalys ve ark., 2010b).

Uzaklık değerleri de seriden seriye değişir (Ordu’da 7,83 mm, meta-analizde 3,64 mm). Thomaidi ve arkadaşlarının kendi birincil verisinde ortalama ile aralık birbirine uymadığı için burada meta-analiz değeri kullanıldı.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kırığın yerini ne belirler?',
      md: `Gömük dişler ve köpek dişi gibi uzun köklü dişler alt çenede zayıflık çizgileri oluşturur (Nardi ve ark., 2020). İstanbul serisinde (158 hasta) gömük alt yirmi yaş dişi, açı/dal kırıklarının daha sık görülmesiyle ilişkiliydi (olasılık oranı, OR 2,04); kondil kırıkları ise gömük yirmi yaş dişi olmayanlarda daha sıktı (OR 0,40). Aynı seride en sık neden saldırıydı (Askin Ekinci ve ark., 2026).

Yaş da dağılımı değiştirir: Diyarbakır serisinde çocuk ve ergenlerde en sık kırık yeri kondildi (%36), onu simfiz/parasimfiz izliyordu (%35); erişkinlerde ise simfiz/parasimfiz ilk sıradaydı (%36), kondil ve gövde %20 ile onu izliyordu (Atilgan ve ark., 2010).

Bu bulgular gözlemsel serilerden gelir. Diyarbakır serisinin makalesinde bazı demografik oranlar özet ile sonuçlar arasında tutarsız verildiği için burada yalnızca tabloyla uyumlu kırık yeri dağılımı kullanıldı.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Diş uyuşturulurken kapanmayan göz',
      oyku: '35 yaşında bir kadına sol alt büyük azı dişinin tedavisi için alt alveoler sinir bloğu yapılıyor. İlk enjeksiyondan sonra dişi tam uyuşmuyor; hekim ikinci denemede iğneyi daha derine ve arkaya yönlendiriyor. Birkaç dakika sonra hastanın sol göz kapağını tam kapatamadığı ve sol ağız köşesinin düştüğü fark ediliyor.',
      soru: 'İlk deneme neden başarısız olmuş olabilir, ikinci denemede ne oldu ve iğnenin hedefi alt çenenin hangi işaretlerine göre belirlenir?',
      cozum: `**İlk deneme:** Bu blok, lokal anestezide başarısızlığı en sık olan tekniktir (%15–20) (Khalil, 2014); bildirilen oranlar %13–57 arasındadır ve en önemli neden mandibular deliğin yerinin belirlenememesidir (Nalbantoğlu ve ark., 2024). Deliğin yüksekliği kişiden kişiye değişir: Anadolu serisinde deliklerin yarısı okluzal düzlemin altında, bir kısmı ise üstündeydi (Nalbantoğlu ve ark., 2024).

**İkinci deneme:** Öyküdeki bulgular yüzün sol yarısındaki kasların felcini gösterir. İğne arkaya, dalın arka kenarına doğru yönelirse anestezik kulak altı bezinin bölgesinde birikir ve yüz felcine yol açabilir (Khalil, 2014). Dalın arka kenarını parotis bezi örter (Gray, 1918).

**Hedef:** Ağız içindeki en önemli işaretler koronoid çentik ve pterigomandibular rafedir; iğne ikisinin arasından girer (Khalil, 2014). Anadolu’dan 115 kuru alt çenede delik dalın yaklaşık ortasındaydı (ön kenara 14,71 mm, arka kenara 12,67 mm); yazarlar iğnenin okluzal düzlemin 3–4 mm üstünden ve ön kenarın 1,5–2 mm arkasından girmesini önerir (Nalbantoğlu ve ark., 2024). Anestezik, sinir mandibular deliğe girmeden önce verilmelidir (OpenStax 7.2).

*Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Dil kemiği: temel ———
    {
      tur: 'metin',
      md: `**Dil kemiği** (*os hyoideum*) adını Yunanca “upsilon harfi biçiminde” anlamına gelen bir sözcükten alır (Garg ve ark., 2025). Boynun orta hattında, alt çenenin tabanının altında ve dördüncü boyun omurunun önünde durur; gırtlağın tiroid kıkırdağının hemen üstündedir (Garg ve ark., 2025). Genel bakış dersinde dilin ve gırtlağın dayanağı olduğunu görmüştük; burada parçalarına ve tutunan kaslara yakından bakacağız.

İskelette ilginç bir yeri vardır: hiçbir kemiğe dokunmaz. At nalı biçimindeki bu kemik, iki yanda şakak kemiklerinin **stiloid çıkıntılarının** uçlarından inen **stilohiyoid bağlarla** asılı durur (Gray, 1918). Beş parçadan oluşur (Gray, 1918):

- **Gövde** (*corpus ossis hyoidei*): öndeki dörtgen parça.
- İki **büyük boynuz** (*cornu majus*): gövdenin yan kenarlarından arkaya uzanır; U harfinin kollarıdır.
- İki **küçük boynuz** (*cornu minus*): gövde ile büyük boynuzun birleştiği köşedeki küçük, koni biçimli çıkıntılar; stilohiyoid bağ bunların tepesine tutunur.

Gövdenin ön yüzüne geniohyoid kas, ağız tabanını yapan milohyoid kas ve dil kası hyoglossusun bir kısmı tutunur; alt kenarına sternohyoid ve omohyoid kaslar yapışır (Gray, 1918; OpenStax 7.2). Yutkunurken ve konuşurken dil kemiğinin hareketleri dil, gırtlak ve yutağın hareketleriyle eşgüdümlüdür (OpenStax 7.2).`,
    },
    {
      tur: 'sahne',
      baslik: 'Dil kemiği önden',
      aciklama:
        'Dil kemiğine tek başına, önden bakıyoruz (sarı). Ortadaki dörtgen parça gövdedir; gövde ile büyük boynuzun birleştiği köşede küçük boynuz yükselir. Büyük boynuzlar arkaya uzandığı için önden kısa görünür; “Bakış” düğmesiyle yukarıdan bakınca kemiğin at nalı biçimi ve arkaya açılan kolları görülür.',
      sahne: {
        katmanlar: ['yuz'],
        renk: 'dogal',
        bakis: 'on',
        goster: ['dil-kemigi'],
        vurgula: ['dil-kemigi'],
        boya: [{ secici: ['dil-kemigi'], renk: DIL_KEMIGI_RENGI }],
        noktalar: [{ nokta: 'dil-kemigi-govdesi' }, { nokta: 'dil-kemigi-kucuk-boynuz-sol' }],
      },
      araclar: ['bakis'],
    },

    // ——— Dil kemiği: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Gövde** (Gray’de *basihyal*) dörtgendir. Ön yüzü dışbükeydir, öne ve yukarı bakar; üst yarısını hafifçe aşağı doğru kavisli, belirgin bir enine sırt geçer. Ön yüzün büyük kısmına, sırtın hem üstünde hem altında, geniohyoid yapışır; hyoglossus başlangıcının bir kısmı bu yapışma alanının yan kenarında bir çentik yapar. Sırtın altına milohyoid, sternohyoid ve omohyoid yapışır (Gray, 1918).

Arka yüz düz ve içbükeydir; epiglotten tirohyoid zar (Gray’de *hyothyroid membrane*) ve bir miktar gevşek bağ dokusuyla ayrılır, kemik ile zar arasında bir bursa bulunur. Üst kenara tirohyoid zar ve genioglossusun bazı aponevrotik lifleri; alt kenara içte sternohyoid, dışta omohyoid yapışır. Varsa *levator glandulae thyroideae* kası da alt kenara tutunur (Gray, 1918).

**Büyük boynuzlar** (Gray’de *tirohyaller*) gövdenin yan kenarlarından arkaya uzanır; her biri lateral tirohyoid bağın tutunduğu bir tüberkülle biter. Boynuz boyunca hyoglossus ve yutağın orta daraltıcı kası başlar; gövdeyle birleşim yerinin yakınına digastrik ve stilohiyoid kaslar küçük yapışmalar yapar (Gray, 1918).

**Küçük boynuzlar** (Gray’de *seratohyaller*) gövde ile büyük boynuzların birleşme açısındaki iki küçük, koni biçimli çıkıntıdır. Gövdeye lifli dokuyla bağlanırlar; büyük boynuzla aralarında bazen gerçek bir oynar (diartrodial) eklem bulunur. Bu eklem genellikle ömür boyu sürer, ara sıra kemikleşerek kaynaşır. Tepelerine stilohiyoid bağ, tabanlarının iç yüzüne kondroglossus kası tutunur (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Dil kemiği nereye asılır?',
      aciklama:
        'Sol yandan bakıyoruz: şakak kemiği yeşil, alt çene yarı saydam, dil kemiği sarı. Şakak kemiğinden aşağı uzanan ince stiloid çıkıntının ucundan dil kemiğinin küçük boynuzuna stilohiyoid bağ uzanır; bağ modelde yoktur, iki işaret noktasının arasını hayalinde birleştir. Büyük boynuz alt çene açısının altında arkaya doğru uzanır. Dil kemiği hiçbir kemiğe değmez. Kondil boynu, dış kulak yolu ve mastoid çıkıntı yön bulmak için işaretlendi.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'sol',
        goster: ['sakak-kemigi-sol', 'alt-cene-kemigi', 'dil-kemigi'],
        vurgula: ['sakak-kemigi-sol', 'dil-kemigi'],
        saydam: ['alt-cene-kemigi'],
        boya: [
          { secici: ['sakak-kemigi-sol'], renk: KEMIK_RENGI.sakak },
          { secici: ['alt-cene-kemigi'], renk: KEMIK_RENGI.altCene },
          { secici: ['dil-kemigi'], renk: DIL_KEMIGI_RENGI },
        ],
        noktalar: [
          { nokta: 'dis-kulak-yolu-sol' },
          { nokta: 'mastoid-cikinti-sol' },
          { nokta: 'stiloid-cikinti-sol' },
          { nokta: 'kondil-boynu-sol' },
          { nokta: 'alt-cene-acisi-sol' },
          { nokta: 'dil-kemigi-buyuk-boynuz-sol' },
          { nokta: 'dil-kemigi-kucuk-boynuz-sol' },
        ],
      },
      araclar: ['bakis', 'ayristir'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Dil kemiğinin işaretleri',
      sutunlar: ['Türkçe ad', 'Latince (TA)', 'Nerede', 'Ne geçer / ne tutunur'],
      satirlar: [
        [
          'Gövde',
          '*Corpus ossis hyoidei*',
          'Önde, orta hatta; dörtgen',
          'Ön yüz: geniohyoid, hyoglossus (bir kısmı); enine sırtın altı: milohyoid, sternohyoid, omohyoid. Üst kenar: tirohyoid zar, genioglossus lifleri. Alt kenar: sternohyoid (iç), omohyoid (dış)',
        ],
        [
          'Büyük boynuz',
          '*Cornu majus ossis hyoidei*',
          'Gövdenin yan kenarından arkaya',
          'Boydan boya hyoglossus ve orta yutak daraltıcısı; gövdeye yakın digastrik ve stilohiyoid; uçtaki tüberkülde lateral tirohyoid bağ',
        ],
        [
          'Küçük boynuz',
          '*Cornu minus ossis hyoidei*',
          'Gövde ile büyük boynuzun birleşme açısı',
          'Tepede stilohiyoid bağ; tabanın iç yüzünde kondroglossus',
        ],
        [
          'Stilohiyoid bağ',
          '*Ligamentum stylohyoideum*',
          'Stiloid çıkıntının ucundan küçük boynuza',
          'Ortasında sıklıkla biraz kıkırdak bulunur; çoğu kez kısmen kemikleşir',
        ],
      ],
      not: 'Kaynak: Gray (1918). Gray’in “hyothyroid membrane” ve “lateral hyothyroid ligament” terimleri bugün tirohyoid zar ve lateral tirohyoid bağ olarak kullanılır (de Bakker ve ark., 2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kemikleşme.** Dil kemiği altı merkezden kemikleşir: ikisi gövde için, birer tanesi her boynuz için. Kemikleşme büyük boynuzlarda fetal yaşamın sonuna doğru, gövdede kısa süre sonra, küçük boynuzlarda ise doğumdan sonraki birinci ya da ikinci yılda başlar (Gray, 1918).

**Hiyoid aparatus.** Stiloid çıkıntı, stilohiyoid bağ ve dil kemiğinin küçük boynuzu birlikte *hiyoid aparatusu* oluşturur; bu zincirin tamamı ikinci faringeal arkın kıkırdağından (Reichert kıkırdağı) gelişir (de Bakker ve ark., 2019). Bağın ortasında sıklıkla biraz kıkırdak bulunur ve bağ çoğu kez kısmen kemikleşir; birçok hayvanda bu bağ *epihyal* adlı ayrı bir kemiktir (Gray, 1918). Alt çene ile karşılaştırınca fark açıktır: alt çene Meckel kıkırdağının çevresindeki zarda kemikleşirken, stiloidden küçük boynuza uzanan zincir Reichert kıkırdağının ürünüdür.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Gövde ile büyük boynuz ne zaman kaynaşır?',
      md: `Gray, gövde ile büyük boynuzların erken yaşta kıkırdakla (sinkondroz), orta yaştan sonra ise genellikle kemikle birleştiğini yazar (Gray, 1918). Modern adli çalışmalar tabloyu daha değişken gösterir: gövde ile büyük boynuzlar genellikle 35–45 yaşlarına kadar kaynaşmaz, hiç kaynaşmayabilir de; 18–20 yaşından önce kaynaşma bildirilmemiştir. Kaynaşma bu kadar değişken olduğundan **yaş ya da cinsiyet tahmininde kullanılamaz** (de Bakker ve ark., 2019).

Biçimde ise cinsiyet farkı vardır: erkek dil kemiği genellikle daha büyüktür, büyük boynuzların uç kısımları ise kadınlarda anlamlı olarak daha uzundur (de Bakker ve ark., 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Uzun stiloid ve Eagle sendromu',
      md: `Stiloid çıkıntının normal uzunluğu genellikle 20–30 mm olarak verilir (de Bakker ve ark., 2019); bir derlemeye göre fizyolojik uzunluk 20–25 mm civarındadır ve 3 cm genellikle üst sınırdır. Uzun stiloid toplumda %4–10 oranında görülür, ama bunların yalnızca yaklaşık %4’ü belirti verir; bu yüzden belirti veren tablo, yani **Eagle sendromu**, toplumun %2’sinden azını ilgilendirir. Damar tipinde uzun stiloid, kafatası dışındaki iç karotis artere doğrudan bası yaparak geçici iskemik atağa (TİA) ya da inmeye, bazen de arter diseksiyonuna yol açabilir (Pagano ve ark., 2023).

Eagle sendromu ile kemikleşmiş (aberran) hiyoid aparatus aynı embriyolojik kökenin, ikinci arkın kıkırdak kalıntısının iki yüzü sayılır; bu yüzden ikisinin birlikte “ikinci faringeal ark kıkırdağı anomalileri” diye adlandırılması önerilmiştir (de Bakker ve ark., 2019). Bir uyarı: bazı kaynaklar sendromun kökeninde stilomandibular bağın kireçlenmesinden söz eder (Pagano ve ark., 2023); oysa stiloidi dil kemiğine bağlayan zincir **stilohiyoid** bağdır (Gray, 1918; de Bakker ve ark., 2019).`,
    },

    // ——— Dil kemiği: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Adli tıpta dil kemiği: varyant mı, kırık mı?',
      md: `Hollanda’da adli-radyolojik bir veri tabanına giren, ölmüş kişilerden çıkarılmış 284 hiyoid–gırtlak kompleksinin incelemesinde yalnızca %37’si standart anatomiye uydu; %63’ünde değişik derecelerde varyant vardı. Gövde ile büyük boynuzların kaynaşması %24,6’da iki taraflı, %11,6’da tek taraflıydı; tek taraflı kaynaşma sağda daha sık görüldü (yönü bilinen 27 olgunun 17’si sağda, 10’u solda) (de Bakker ve ark., 2019).

Hiyoid–gırtlak kırıkları boğmanın en iyi göstergelerinden biridir; ama asılma, trafik kazası, yaşlılık osteoporozu, spor kazası ve entübasyondan sonra da görülebilir. Dil kemiği çoğunlukla kaynaşmanın tamamlanmadığı gövde–büyük boynuz arasında ya da büyük boynuzun arka kısmında kırılır; kaynaşma yaşla ilerlediği için kırıklar 30 yaşın üstünde daha sıktır. Bazı varyantlar bu bölgede kırığı taklit eder: örneğin yoğun ve düzensiz kireçlenmiş bir **triticeal kıkırdak**, tiroid kıkırdağın üst boynuzunun kopma kırığıyla karıştırılmamalıdır (de Bakker ve ark., 2019).

Gray ile modern veriler arasındaki fark önemlidir: Gray’in “orta yaştan sonra genellikle kemikle birleşir” cümlesi (Gray, 1918), adli yaş tahmini için bir ölçüt olarak okunmamalıdır.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Hiyoiddeki aralık kırık mı?',
      oyku: 'Bir adli radyoloji toplantısında, trafik kazasında ölen bir kişiden çıkarılan hiyoid–gırtlak kompleksinin görüntüleri tartışılıyor. Solda büyük boynuz ile gövde arasında ince bir aralık görülüyor; sağda gövde ile büyük boynuz kaynaşmış. Gırtlağın yan tarafında, tiroid kıkırdağın üst boynuzu hizasında küçük, düzensiz, yoğun bir parça var. Bir katılımcı, sağdaki kaynaşmaya bakarak kişinin 45 yaşından büyük olduğunu, soldaki aralığın ise kesin bir kırık olduğunu öne sürüyor.',
      soru: 'Bu yorumlardan hangileri anatomiyle desteklenir, hangileri dikkatle ele alınmalıdır?',
      cozum: `**Kaynaşma ve yaş:** Gövde ile büyük boynuzlar genellikle 35–45 yaşlarına kadar kaynaşmaz, hiç kaynaşmayabilir de; kaynaşma o kadar değişkendir ki yaş ya da cinsiyet tahmininde kullanılamaz (de Bakker ve ark., 2019). Tek taraflı kaynaşma da olağan bir bulgudur: adli bir seride %11,6’da görüldü ve sağda daha sıktı (de Bakker ve ark., 2019). Bu bulguyla yaş hakkında hüküm verilmez.

**Soldaki aralık:** Dil kemiği gerçekten en çok, kaynaşmanın tamamlanmadığı gövde–büyük boynuz arasında ya da büyük boynuzun arka kısmında kırılır (de Bakker ve ark., 2019). Ama kaynaşmamış bir bağlantı da aynı yerde aralık olarak görünür; Gray’e göre gövde ile büyük boynuz başlangıçta kıkırdakla (sinkondroz) bağlıdır (Gray, 1918). Bazı varyantlar bu bölgede kırığı taklit eder (de Bakker ve ark., 2019); aralık tek başına kırık kanıtı sayılmaz.

**Yoğun parça:** Yoğun ve düzensiz kireçlenmiş bir triticeal kıkırdak, tiroid kıkırdağın üst boynuzunun kopma kırığıyla karıştırılmamalıdır (de Bakker ve ark., 2019).

**Bağlam:** Hiyoid–gırtlak kırıkları boğmanın en iyi göstergelerinden biridir, ama trafik kazasından sonra da görülebilir (de Bakker ve ark., 2019). Bulgu, olayın bağlamıyla birlikte yorumlanır.

*Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Özet: temel ———
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Alt çene = gövde + iki dal.** Dalın tepesinde önde koronoid çıkıntı, arkada kondil (eklem başı); aralarında mandibula çentiği. Gövde ile dalın birleştiği köşe açıdır.\n\n**İki önemli delik:** çene deliği (dışta, ikinci küçük azının altında; çene siniri çıkar) ve mandibular delik (dalın iç yüzünde; alt alveoler sinir girer, önünde lingula).\n\n**Dil kemiği = gövde + iki büyük boynuz + iki küçük boynuz.** Hiçbir kemikle eklem yapmaz; stiloid çıkıntılardan inen stilohiyoid bağlarla asılıdır.\n\n**Meckel kıkırdağı:** alt çene onun çevresindeki zarda kemikleşir; proksimal ucundan çekiç ve örs gelişir.',
    },
  ],
};
