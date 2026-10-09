import type { DersBolumu } from '../../../types';

/** 06. bölüm: koordinatlar; voksel ve afin; DICOM LPS ve NIfTI RAS+; qform/sform; Talairach ve MNI uzayları; AC–PC tanımları; stereotaksik çerçeveler ve hedef koordinatları. */
export const koordinatSistemleri: DersBolumu = {
  id: 'koordinat-sistemleri',
  baslik: 'Beynin adresi: koordinat sistemleri',
  bloklar: [
    {
      tur: 'metin',
      md: `Bir yerin adresini nasıl söylersin? Önce bir başlangıç noktası seçersin, örneğin bir meydan. Sonra yönü ve uzaklığı söylersin: “Meydandan 300 adım kuzeye, 200 adım doğuya.” Beyindeki bir nokta için de aynısı yapılır. Ama beynin içinde sokak tabelası yoktur. Adres üç sayıyla söylenir: sağ–sol, ön–arka ve alt–üst.

Bu üç sayının bir anlam taşıması için üç şeyi bilmek gerekir (BIDS, t.y.):

- **Başlangıç noktası:** Sayılar hangi noktadan ölçülüyor? Bu noktanın adresi (0, 0, 0)’dır.
- **Eksenlerin anlamı:** Her sayı hangi yönü gösteriyor? Büyüyünce nereye gidiyor?
- **Birim:** Sayılar milimetre mi, yoksa başka bir ölçü mü?

Biri eksikse aynı üç sayı farklı yerleri gösterebilir. Yönler hep **hastaya göre** söylenir. Örneğin yaygın bir kuralda hastanın solundaki bir nokta eksi bir x değeri alır (BIDS, t.y.).

Manyetik rezonans (MR) ve bilgisayarlı tomografi (BT) görüntüleri küçük küplerden oluşur. Her küpe **voksel** denir: hacmi olan bir piksel (NiBabel, t.y.-a). Dosya, her vokselin parlaklığını bir sıra içinde saklar. Ama bir vokselin sıra numarası, beynin neresinde olduğunu tek başına söylemez (NiBabel, t.y.-a). Aşağıdaki çizimde iki yaygın kuralı ve voksel sırasını karşılaştırabilirsin.`,
    },
    {
      tur: 'animasyon',
      ad: 'koordinat-eksenleri',
      baslik: 'Aynı nokta, iki kural',
      aciklama:
        'Başa yukarıdan bakıyoruz: burun yukarıda, hastanın sağı ekranın sağında. Sarı nokta hastanın 30 mm solunda, 20 mm önünde ve 10 mm yukarısında. RAS+ kuralında x sağa, y öne doğru büyür. LPS+ kuralında x sola, y arkaya doğru büyür. Bu yüzden aynı noktanın x ve y sayılarının işareti iki kuralda terstir. Üçüncü düğme dosyanın içindeki voksel sırasını gösterir.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Sağ, hastanın sağıdır',
      md: 'Koordinatlarda “sağ” hastanın sağıdır, bakanın sağı değil. Nörogörüntüleme topluluğunun çoğu bu sözcüğü hep bu anlamda kullanır (NiBabel, t.y.-a). Hastaya karşıdan bakınca onun sağı senin solunda kalır. Bu yüzden bir görüntüde ya da bir sayı listesinde “sağ” sözcüğünü görünce kimin sağı olduğunu düşün.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Görüntülemede üç koordinat sistemi birbirinden ayrılır: dünya, anatomik ve görüntü koordinat sistemi (3D Slicer, t.y.).

- **Görüntü (voksel) koordinatı** vokselin dizideki sırasıdır: (i, j, k). Bu sıra, verinin tarayıcının neresinden geldiğini neredeyse hiç söylemez. Ek bilgi olmadan vokselin beynin solunda mı sağında mı olduğu bilinemez (NiBabel, t.y.-a).
- **Dünya (tarayıcı) koordinatı** cihazın kendi eksenleridir. Başlangıç noktası mıknatısın tam ortasıdır; buna **izomerkez** denir. Üç eksen de bu noktadan geçer ve birim milimetredir (NiBabel, t.y.-a).
- **Anatomik koordinat** eksenleri hastanın yönlerine bağlar. Hasta yüzü yukarı, başı önde yatıyorsa tarayıcının sağ–sol ekseni, hastanın başının sağ–sol eksenidir. Nörogörüntülemede en yaygın hasta merkezli sistem “tarayıcı RAS”tır: sağ, ön, üst (NiBabel, t.y.-a).

Voksel sırasını milimetrelik bir adrese çeviren bilgiye **afin matris** (*affine*) denir. Afin matris, dizideki voksel koordinatları ile başvuru uzayındaki koordinatlar arasındaki ilişkiyi saklar (NiBabel, t.y.-a). Onu bir çeviri tablosu gibi düşünebilirsin: “Dizideki şu küp, hastanın şu milimetresindedir.”`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Bir noktanın üç adresi',
      sutunlar: ['Koordinat', 'Başlangıç (0, 0, 0)', 'Birim', 'Ne söyler?'],
      satirlar: [
        ['Voksel sırası (i, j, k)', 'Dizideki ilk vokselin merkezi', 'Voksel', 'Dosyadaki sırayı; tek başına sağı solu söylemez'],
        ['Dünya (tarayıcı) koordinatı', 'Mıknatısın izomerkezi', 'mm', 'Noktanın cihazın içindeki yerini'],
        [
          'Standart uzay (Talairach, MNI)',
          'Talairach’ta ön komissür; MNI’de şablonun başlangıcı',
          'mm',
          'Farklı beyinleri ortak bir haritada karşılaştırmayı',
        ],
      ],
      not: 'Kaynaklar: NiBabel (t.y.-a); BIDS (t.y.); Selvaraj ve ark. (2026). Standart uzaylar bu bölümün ilerisinde anlatılıyor.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Voksel uzayında (0, 0, 0), dizideki ilk vokselin merkezidir; eksenlerin birimi de voksellerdir (NiBabel, t.y.-a). Afin matrisin tersi öbür yönde çalışır: tarayıcı RAS+ koordinatını voksel koordinatına çevirir (NiBabel, t.y.-a).

DICOM (tıbbi görüntülerin standart dosya biçimi) dosyasında bu çeviri iki alandan kurulur. **Görüntü Konumu** (0020,0032), görüntünün sol üst köşesinin x, y, z koordinatıdır. Bu nokta, ilk gönderilen vokselin merkezidir (NEMA, 2026c). **Görüntü Yönü** (0020,0037), ilk satırın ve ilk sütunun hastaya göre doğrultu kosinüslerini verir (NEMA, 2026c). Doğrultu kosinüsü, bir doğrunun eksenlere göre yönünü sayıyla söyler. İki alan ise konum için güvenilir değildir. **Kesit Konumu** (0020,1041), belirtilmemiş ve üreticiye özgü bir noktaya göre verilir (NEMA, 2026c). **Hasta Konumu** (0018,5100) yalnızca açıklama içindir. Hasta ile cihaz arasında kesin bir matematiksel ilişki vermez (NEMA, 2026a).

İki küçük tuzak daha var. DICOM formülündeki (i, j) vokseli, piksel dizisinde [j, i] konumundadır; satır ile sütun yer değiştirir (NiBabel, t.y.-b). Çoğu biçim veriyi sol üst köşeden başlayarak saklar. Eski Analyze biçimi ise sağ alt köşeden başlar (Rorden, t.y.-b). Sonuçta üç uzaysal boyut 48 farklı dik yönde saklanabilir (Rorden, t.y.-a). Sayı şuradan gelir: eksenlerin 6 farklı dizilişi ve 8 farklı çevrilme birleşimi vardır. Bu da 8 × 6 = 48 düzen eder (Becq ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Görüntü dosyaları iki büyük kurala göre yazılır. İlk derste ikisini kısaca gördük; burada nasıl kurulduklarına bakalım.

**DICOM**, tıbbi görüntüler için kullanılan standart dosya biçimidir. DICOM’un hasta koordinat sisteminde x ekseni hastanın **soluna**, y ekseni **arkasına**, z ekseni **başına** doğru artar (NEMA, 2026c). Kısa adı bu yüzden **LPS**’dir: sol (*left*), arka (*posterior*), üst (*superior*). DICOM insan için şu yön harflerini kullanır: A (ön), P (arka), R (sağ), L (sol), H (baş), F (ayak) (NEMA, 2026b).

Bu eksenleri akılda tutmanın bir yolu var. Hekim, yatağın ayak ucundan hastaya bakar ve sağ elini Örümcek Adam gibi tutar. Başparmağı kendi sağını, yani hastanın solunu gösterir. İşaret parmağı aşağıyı, orta parmağı hastayı gösterir (NiBabel, t.y.-b). NiBabel bu yüzden DICOM sistemine “doktor temelli koordinat sistemi” demeyi daha uygun bulur (NiBabel, t.y.-b).

**NIfTI** 2000’lerin başında doğdu. O yıllarda bütün büyük yazılımların okuyup yazabileceği tek bir MR biçimine gerek duyuldu (AFNI, t.y.-b). NIfTI’de eksenler şöyledir: +x sağ, +y ön, +z üst (NIfTI Çalışma Grubu, t.y.). Kısa adı **RAS+**’tır. Buradaki “+”, sağın, önün ve üstün artı değer aldığını söyler (NiBabel, t.y.-a). NiBabel aynı yazımla DICOM’un sistemine de **LPS+** der (NiBabel, t.y.-a). İki kural arasındaki tek fark ilk iki koordinatın işaretidir (3D Slicer, t.y.). İkisi de eşit derecede mantıklıdır; önemli olan görüntünün hangisine göre yazıldığını bilmektir (3D Slicer, t.y.). NIfTI’nin yön kuralı bilerek MNI152 ve Talairach uzaylarınınkiyle aynı seçildi (FSL, t.y.).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Koordinat kuralları yan yana',
      sutunlar: ['Kural', 'x büyüyünce', 'y büyüyünce', 'z büyüyünce', 'Not'],
      satirlar: [
        ['DICOM hasta sistemi (LPS)', 'sola', 'arkaya', 'başa', 'Tarayıcıdan çıkan dosyalar; çoğu tıbbi yazılım veriyi böyle saklar'],
        ['NIfTI (RAS+)', 'sağa', 'öne', 'yukarı', 'Nörogörüntüleme yazılımlarının ortak biçimi'],
        ['Talairach ve MNI uzayları', 'sağa', 'öne', 'yukarı', 'Atlas koordinatları bu yönle yazılır'],
        ['BIDS “ACPC”', 'sağa', 'öne', 'yukarı', 'Başlangıç ön komissür; eksi y ekseni arka komissürden geçer'],
        ['3D Slicer', 'sağa', 'öne', 'yukarı', 'Program içinde RAS; dosyaları, aksi yazmadıkça, LPS sayar'],
        ['AFNI “RAI”', 'sola', 'arkaya', 'yukarı', 'Harfler eksenin başladığı yönü söyler; yön DICOM’unkiyle aynıdır'],
        ['Eski ANALYZE 7.5', 'sola', 'öne', 'yukarı', 'Sol el sistemi; bu dosyalarda doğru yön bilgisi yoktur'],
      ],
      not: 'Tablo, kaynaklardaki tanımlardan bizim derlememizdir; kaynaklar bu kuralları kendi aralarında karşılaştırmaz. BIDS, beyin görüntüleme verilerini düzenleme standardıdır; AFNI ve 3D Slicer görüntü analiz yazılımlarıdır. Kaynaklar: NEMA (2026c); NIfTI Çalışma Grubu (t.y.); Selvaraj ve ark. (2026); BIDS (t.y.); 3D Slicer (t.y.); AFNI (t.y.-a); Glen ve ark. (2020).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Bir koordinatı okumak için üç şey gerekir: başlangıç noktası, eksenlerin anlamı ve birim (BIDS, t.y.).
- **DICOM = LPS:** x sola, y arkaya, z başa. **NIfTI = RAS+:** x sağa, y öne, z yukarı. Fark yalnızca ilk iki eksenin işaretindedir (3D Slicer, t.y.).
- Voksel sırası tek başına sağı solu söylemez. Sırayı milimetreye **afin matris** çevirir (NiBabel, t.y.-a).
- Talairach ve MNI uzaylarında +x sağ, +y ön, +z üsttür (Selvaraj ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Aynı harfler, zıt anlamlar',
      md: `“RAS” adı bile tek anlamlı değildir. NiBabel harfleri eksenin **bittiği** yön olarak okur. Bazıları ise eksenin **başladığı** yön olarak okur. Bu okumayla “RAS” denen sistem, NiBabel’in “LPI” dediği sistemdir. NiBabel karışıklığı önlemek için “RAS+” yazar (NiBabel, t.y.-a). Kimileri “sağ” sözcüğünü de başka anlamda kullanır: tarayıcının ayak ucunda duran gözlemcinin sağı (NiBabel, t.y.-a).

AFNI’nin yeğlediği kural **“RAI”**dir: X sağdan sola, Y önden arkaya, Z aşağıdan yukarı büyür (AFNI, t.y.-a). Ad “nereden” yönüyle konmuştur. Yani AFNI’nin “RAI”si, NIfTI okunuşuyla LPS’dir; DICOM’un yönüdür. Bir yazılımdan ötekine koordinat taşırken harflere değil, eksenin hangi yöne büyüdüğüne bak.

Bu çeşitliliğin bir tarihi var. Tarihsel olarak GE cihazları RAS, Siemens ve öteki üreticiler LPS kullanıyordu (3D Slicer, t.y.). 3D Slicer program içinde RAS kullanır, çünkü ilk katkıcıları arasında GE araştırmacıları vardı (3D Slicer, t.y.). DICOM’un öncüsü ACR/NEMA 2.0’ın standart başvuru uzayı “tarayıcı XYZ” idi (NiBabel, t.y.-a). 1985 ve 1988 sürümlerinde konum ve yön cihaza bağlı bir sisteme göre verilirdi. O sistem tam tanımlı değildi ve belirsizlikler taşıyordu. Yerini hasta temelli sisteme bıraktı (NEMA, 2026c).

BIDS üç düzeyi birbirinden ayırır. Cihaz koordinatları, dosya biçimi koordinatları (DICOM) ve “baş” koordinatları (NIfTI) aynı olmak zorunda değildir (BIDS, t.y.). Beynin manyetik alanını ölçen MEG cihazlarında başka düzenler de vardır. Örneğin CTF sisteminde yön ALS’dir ve başlangıç iki kulağın arasındadır (BIDS, t.y.).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `NIfTI, nörogörüntüleme yazılımlarının birlikte çalışması için kurulmuş bir çalışma grubunun adıdır. Grubu ABD Ulusal Sağlık Enstitüleri (NIH) destekledi (AFNI, t.y.-b). Biçimin baş mimarı ve ilk yazarı, AFNI yazılımını başlatan Bob Cox’tur (AFNI, t.y.-b). Amaç, çok daha eski ANALYZE 7.5 biçimini güncellemek ve belirsizliği gidermekti (AFNI, t.y.-c). NIfTI-1 başlığı toplam 348 bayttır (AFNI, t.y.-c). 2011’de NIfTI-2 geldi. Boyutlar artık 16 bitlik değil, 64 bitlik tamsayılarla yazıldı; böylece daha büyük veriler saklanabildi. NIfTI-2 başlığı 540 bayttır (AFNI, t.y.-c).

ANALYZE 7.5’te +x sol, +y ön, +z üsttü; bu bir **sol el** sistemiydi. NIfTI-1 bu “tersliği” kabul etmedi ve fonksiyonel nörogörüntülemede en yaygın düzeni seçti (NIfTI Çalışma Grubu, t.y.). NIfTI’nin sistemi de DICOM’unki gibi bir **sağ el** sistemidir (NIfTI Çalışma Grubu, t.y.; NEMA, 2026c). NIfTI’de (x, y, z) koordinatı vokselin **merkezini** gösterir (NIfTI Çalışma Grubu, t.y.).

NIfTI, vokselleri uzaya yerleştirmenin üç yolunu tanımlar:

- **Yöntem 1** yalnızca ANALYZE 7.5 dosyalarıyla uyum içindir ve önerilmez (NIfTI Çalışma Grubu, t.y.).
- **Yöntem 2 (qform)** tarayıcının bildirdiği konumları taşır. Bilgisini DICOM başlığındaki konum, yön, piksel aralığı ve kesit kalınlığı alanlarından alır. MR’da başlangıç noktası genellikle gradyan bobininin, yani cihazın içindeki bobinlerden birinin merkezidir (NIfTI Çalışma Grubu, t.y.).
- **Yöntem 3 (sform)** vokselleri bir standart uzayda konumlandırır. Örneğin Talairach koordinat sisteminde (0, 0, 0) ön komissürdür (NIfTI Çalışma Grubu, t.y.).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'qform ve sform',
      sutunlar: ['', 'qform (yöntem 2)', 'sform (yöntem 3)'],
      satirlar: [
        ['Ne taşır?', 'Tarayıcının bildirdiği voksel konumları', 'Vokselin bir standart uzaydaki yeri'],
        [
          'Bilgi nereden gelir?',
          'DICOM başlığındaki konum, yön, piksel aralığı ve kesit kalınlığı',
          'Görüntüyü standart uzaya taşıyan dönüşüm',
        ],
        ['Başlangıç (0, 0, 0)', 'Tarayıcınınki; MR’da genellikle gradyan bobininin merkezi', 'Uzaya göre; Talairach’ta ön komissür'],
        [
          'Dönüşüm',
          'Döndürme ve kaydırma; kayma (shear: eksenlerin birbirine göre eğilmesi) saklayamaz',
          'Ölçekleme ve kayma da içerebilir; keyfi afin dönüşüm buraya yazılır',
        ],
        ['NiBabel hangisini okur?', 'sform kodu 0 ise bunu', 'Kodu 0 değilse önce bunu'],
      ],
      not: 'Kaynaklar: NIfTI Çalışma Grubu (t.y.); FSL (t.y.); NiBabel (t.y.-d).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Başlıktaki matrislerin ne anlattığını bir **kod** söyler. sform kodu 3 ise koordinatlar Talairach atlas uzayında, 4 ise MNI atlas uzayında RAS+’tır (NiBabel, t.y.-d). AFNI’ye göre kod 3, başlangıcı ön komissür olan Talairach–Tournoux atlasına hizalı koordinatlardır (AFNI, t.y.-d). Kod 5 her türlü standart şablon uzayı içindir ve 8 Mart 2019’da eklendi. Kod 2 (“hizalı”) ise belirsizdir: verinin standart uzayda olup olmadığını söylemez. AFNI bunu bir sorun sayar (AFNI, t.y.-d). AFNI’deki “+tlrc” eki de tarihsel bir kalıntıdır; yalnızca Talairach uzayını göstermez (AFNI, t.y.-d).

Analiz yazılımı FSL’nin belgesine göre iki matrisin amacı farklıydı. Biri tarayıcının içindeki gerçek uzayı, öbürü MNI152 gibi standart uzayın koordinatlarını izleyecekti (FSL, t.y.). Tarayıcı uzayına geçiş yalnızca döndürme ve kaydırmadır. Standart uzaya geçiş ise ölçekleme ve kayma da içerir; amaç beyni şablona “sığdırmaktır” (FSL, t.y.).

İki matris birbiriyle çelişebilir. NiBabel önce sform’a bakar. sform kodu 0 ise qform’u, o da 0 ise yedek bir matrisi kullanır (NiBabel, t.y.-d). Yedek matriste NiBabel, SPM adlı analiz programı gibi, LAS+ voksel yönünü varsayar (NiBabel, t.y.-d). qform’daki qfac sayısı yalnızca 1 ya da −1 olabilir; sol el düzenindeki voksel ızgarasını karşılamak içindir (NIfTI Çalışma Grubu, t.y.). Çelişen sform ve qform bilgisi yanlış dönüştürmeye yol açabilir (Glen ve ark., 2020).`,
    },
    {
      tur: 'metin',
      md: `Her beynin boyu ve biçimi biraz farklıdır. Bir beyindeki noktayı ötekinde bulmak için ortak bir harita gerekir. Bu haritanın başvuru noktaları beynin derinindeki iki küçük yapıdır: **ön komissür** (*commissura anterior*, AC) ve **arka komissür** (*commissura posterior*, PC). Komissür, beynin iki yanını birbirine bağlayan lif demetidir. İkisi de beyni tam ortadan bölen orta sagital düzlemde durur (Conti ve ark., 2023).

Jean Talairach ve arkadaşları 1957’de bu iki yapıyı beyin içi işaret olarak kullanan bir koordinat sistemi getirdi (Antonios ve ark., 2026). İki komissürü birleştiren çizgiye **AC–PC çizgisi** ya da komissürler arası çizgi denir. Talairach’ın çalışmasıyla stereotaksinin standart başvuru sistemi bu çizgiye dayanır hâle geldi (Conti ve ark., 2023). Stereotaksi, beynin derinindeki bir noktaya üç boyutlu koordinatla ulaşma yöntemidir (Antonios ve ark., 2026). Bölümün sonunda ayrıca anlatılıyor.

Talairach’ın en önemli fikri **orantıdır**. Milimetre gibi mutlak ölçüler yerine beynin kendi uzunluklarının oranları kullanılır (Conti ve ark., 2023). Bunu bir lastik harita gibi düşünebilirsin: büyük bir beyinde gerilir, küçük bir beyinde büzülür. Talairach, derindeki çekirdeklerin AC–PC çizgisiyle genellikle tutarlı bir ilişki koruduğunu gösterdi (Conti ve ark., 2023). Talairach uzayında başlangıç noktası (0, 0, 0) ön komissürdür (BIDS, t.y.).`,
    },
    {
      tur: 'sahne',
      baslik: 'Başvuru noktaları: ön ve arka komissür',
      aciklama:
        'Sağ yarım kaldırıldı; sol yarıma orta hattan, içeriden bakıyoruz. Ön taraf ekranın sağında. Sarı: ön komissür (AC) ve arka komissür (PC). AC–PC çizgisi ikisini birleştirir; Talairach uzayının başlangıcı AC’dir. Mavi ve yarı saydam: üçüncü karıncık. Pembe: talamus. Öteki yapılar yer bulmaya yardım etsin diye soluk gösterildi.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik'],
        renk: 'yapi',
        goster: [
          'on-komissur',
          'arka-komissur',
          'talamus',
          'ucuncu-karincik',
          'karinciklar-arasi-delik',
          'epifiz',
          'habenula',
          'korpus-kallozum',
          'forniks',
          'forniks-komissuru',
          'hipotalamus',
          'orta-beyin',
          'pons',
        ],
        vurgula: ['on-komissur', 'arka-komissur', 'talamus', 'ucuncu-karincik'],
        saydam: ['ucuncu-karincik'],
        boya: [
          { secici: ['on-komissur', 'arka-komissur'], renk: '#f2b544' },
          { secici: ['talamus'], renk: '#ee6a92' },
          { secici: ['ucuncu-karincik'], renk: '#5b9bd5' },
        ],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'on-komissur', metin: 'Ön komissür (AC)' },
          { yapi: 'arka-komissur', metin: 'Arka komissür (PC)' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'epifiz', metin: 'Epifiz bezi' },
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `İlk derste Horsley–Clarke aygıtını ve Spiegel ile Wycis’i kısaca gördük. İnsanda stereotaksi 20. yüzyılın ortasında, 1947’de Spiegel ve arkadaşlarıyla başladı (Antonios ve ark., 2026). Horsley ile Clarke’ın 1908 çalışmasına dayanıyordu (Antonios ve ark., 2026). Erken yöntemler **dolaylı hedeflemeye** dayanıyordu, çünkü derin yapılar o günün görüntülerinde görünmüyordu (Antonios ve ark., 2026). MR ve BT’den önce AC ile PC, **ventrikülografiyle** gösteriliyordu. Bu yöntemde karıncıklara kontrast madde ya da hava verilip film çekilir (Antonios ve ark., 2026).

Talairach önemli bir şey gösterdi. İşlevsel cerrahide hedeflenen derin çekirdekler, AC–PC çizgisiyle ve ondan türeyen düzlemlerle genellikle tutarlı bir ilişki korur (Conti ve ark., 2023). Talairach ile Tournoux’nun 1988 atlası **tek bir kadavra beyninden** hazırlandı (Selvaraj ve ark., 2026). Atlas iki yarımkürenin simetrik olduğunu da varsaydı (Selvaraj ve ark., 2026). Talairach–Tournoux uzayı, bir kişinin beyni bu 1988 atlasına **parça parça doğrusal** ölçeklenerek kurulur; başlangıç AC’dir (BIDS, t.y.). Yani beyin AC ve PC’den geçen düzlemlerle bölümlere ayrılır ve her bölüm kendi oranıyla gerilir. Atlası hastaya uydurmak için çoğunlukla AC–PC uzunluğuna ve üçüncü karıncığın genişliğine dayanan doğrusal ölçekleme kullanılır (Conti ve ark., 2023).

Conti ve arkadaşlarına göre Talairach atlası, nörogörüntülemede koordinat bildirmenin en yaygın sistemi olmayı sürdürür. Ama atlasın yapıldığı özgün beynin üç boyutlu bir görüntüsü yoktur (Conti ve ark., 2023). Selvaraj ve arkadaşlarının anlatımı farklıdır: nörogörüntüleme araştırmacılarının çoğu MNI uzayına geçti. Beyin cerrahları ise büyük ölçüde Schaltenbrand’ın stereotaksik atlasına dayanan uzayı kullanmayı sürdürür. Bu uzayda başlangıç noktası AC–PC çizgisinin ortasıdır (Selvaraj ve ark., 2026). İki kaynak farklı toplulukları anlatıyor olabilir. Güvenli özet şudur: araştırmada MNI, cerrahide AC–PC’ye dayalı Schaltenbrand uzayı yaygındır.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Talairach dönüşümü sekiz noktaya dayanır. İkisi orta sagital düzlemdeki AC ve PC’dir. Altısı beynin ön, arka, sol, sağ, üst ve alt uçlarını belirleyen kabuk noktalarıdır (Conti ve ark., 2023). Dönüşüm görüntüyü parça parça doğrusal biçimde ve 13 serbestlik derecesiyle eğip büker (Conti ve ark., 2023). AFNI, elle yapılan Talairach işlemini 12 parçalı bir dönüşüm olarak saklar (AFNI, t.y.-e). Ön–arka yöndeki uyarlama AC ile PC’ye dayanır. Yan ve üst–alt yöndeki uyarlama ise beyin kabuğunun genel boyutuna göre yapılır (Conti ve ark., 2023).

Atlasların kökeni de karışıktır. Schaltenbrand ve Bailey’nin 1959 atlası 111 beyne dayanıyordu; bunların yedisi ayrıntılı incelendi (Antonios ve ark., 2026). Conti ve arkadaşları da 111 beyni başlangıç malzemesi sayar. Schaltenbrand–Wahren mikroserileri ise yalnızca iki beyinden (üç yarımküre) yapıldı (Conti ve ark., 2023). Kısacası 111 beyin incelendi, ama atlas kesitleri iki beyindendir. Andrew ve Watkins ise 1969’da değişkenliği ölçmek için 38 yarımküreyi 1 mm aralıklarla kesti. Kesitler, Monro deliği (*foramen interventriculare*) ile PC’den geçen düzleme dikti (Antonios ve ark., 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Talairach’ın orantılı ızgarası',
      sutunlar: ['Yön', 'Her yarımkürede parsel', 'Neye göre bölünür?'],
      satirlar: [
        [
          'Boy (ön–arka; A–I)',
          '9',
          'Önde 4: her biri AC’den ön kutba uzaklığın dörtte biri. Ortada 1: AC ile PC arasının tamamı (kendi içinde üçe bölünür). Arkada 4: her biri PC’den arka kutba uzaklığın dörtte biri',
        ],
        [
          'En (sağ–sol; a–d)',
          '4 (her yarımkürede)',
          'Her biri orta hattan kabuğun en dış noktasına (yan-arka bölgede) uzaklığın dörtte biri',
        ],
        [
          'Yükseklik (1–12)',
          '12',
          'AC–PC çizgisinin üstünde 8: her biri en yüksek tepe (parietal) noktasına uzaklığın sekizde biri. Altında 4: her biri en alçak şakak (temporal) noktasına uzaklığın dörtte biri',
        ],
      ],
      not: 'Kaynak: Conti ve ark. (2023). Izgaranın dik düzlemleri orta hat, komissürler arası düzlem ve AC ile PC’den geçen iki dikey (“verticofrontal”) düzlemdir. Her kutu sabit bir uzaklığı değil, beynin sabit bir oranını temsil eder.',
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Atlasın az bilinen yüzü',
      md: `İlk başvuru noktası komissürler değildi. Spiegel ve Wycis kafatası işaretleri yerine beyin işaretlerine geçti. İlk başvuru, düz röntgen filminde görülen **kireçlenmiş epifiz bezi** oldu (Conti ve ark., 2023). Ama epifizin yeri ön–arka yönde 12 mm ya da daha fazla değişiyordu. İki kulak arası yönde değişkenlik 16 mm’ye varıyordu. Bu yüzden bırakıldı (Conti ve ark., 2023). İlk atlasları, PC’nin merkezini köprü ile omurilik soğanı arasındaki oluğa bağlayan “CP–PO” çizgisine dayanıyordu (Conti ve ark., 2023).

Talairach’ın özgün çizgisi (CA–CP), AC’nin **üst kenarından** ve PC’nin **alt kenarından** geçer. Dikey VCA çizgisi AC’nin arka kenarından geçer (Conti ve ark., 2023). CA–CP çizgisi subtalamik çekirdeğin (*nucleus subthalamicus*) hemen üstünden geçer. Talamusun sentromedyan çekirdeğini kırmızı çekirdekten (*nucleus ruber*) ayırır (Conti ve ark., 2023).

Atlasın kendisinde şaşırtıcı ayrıntılar var. AC ve PC işaretleri kendi yapılarının dışında kalır. Başlangıç noktası AC olduğu hâlde, başlangıçtan geçen koronal levha (CA = 0) AC’yi içermez. Komissürler arası düzlemin levhası atlasta hiç yoktur (Conti ve ark., 2023). Üç düzlem karşılaştırıldığında atlasın tutarlılığı %27,4, tutarsızlığı %37,7 bulundu. En tutarlı yapı talamustu: %85,7 tutarlılık (Conti ve ark., 2023). Schaltenbrand atlasının aksiyel levhaları da tam komissürler arası düzlemde değildir. Saat yönünde 7 derece dönüktür (Conti ve ark., 2023).`,
    },
    {
      tur: 'metin',
      md: `Tek bir beyinden yapılan atlas, o kişinin özelliklerini de taşır. Bu sorunu çözmek için **ortalama beyinler** yapıldı. Montreal Nöroloji Enstitüsü’nün (MNI) şablonlarından biri MNI305’tir. Bu şablon, 305 yüksek çözünürlüklü MR görüntüsüyle ortak bir uzay kurmak için geliştirildi (Selvaraj ve ark., 2026).

İlk derste gördüğümüz MNI-ICBM152 şablonu, 152 genç yetişkinin MR görüntülerinden kuruldu (Manera ve ark., 2020). Çok sayıda kişiden yapıldığı için toplumun ortalama anatomisini temsil eder. Tek kişiden yapılmış modellerin yanlılığını taşımaz (Manera ve ark., 2020).

Araştırmalar bulduklarını çoğunlukla MNI ya da Talairach koordinatlarıyla bildirir (Laird ve ark., 2010). Bunun için her beyin önce şablona uydurulur. Böylece farklı şehirlerdeki çalışmaların sonuçları aynı haritada karşılaştırılabilir.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Aynı sayılar, farklı yerler',
      md: 'Talairach ve MNI uzaylarında x, y ve z aynı yönlere büyür (Selvaraj ve ark., 2026). Ama başvuru beyinleri farklıdır. MNI şablonu Talairach beyninden daha uzun ve daha yüksektir; şakak lobları da daha büyüktür (Conti ve ark., 2023). Bu yüzden aynı üç sayı iki uzayda biraz farklı yerleri gösterir. Fark bazı ön bölgelerde 1 cm’yi aşar (Lancaster ve ark., 2007). Bir koordinat okurken hangi uzaya ait olduğuna mutlaka bak.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'MNI şablonlarının soyağacı',
      sutunlar: ['Şablon', 'Nasıl yapıldı?', 'Not'],
      satirlar: [
        [
          'MNI305',
          '305 yüksek çözünürlüklü MR; AC, PC ve başka işaretler elle bulunup Talairach’ın AC–PC uzayına yaklaşık hizalandı',
          'İlk ortak uzay denemesi',
        ],
        [
          'ICBM152 doğrusal',
          'MNI grubundaki her kişi MNI305’e doğrusal olarak kaydedildi',
          'Kontrastı daha iyi; beynin tepesini ve beyinciğin altını daha iyi kapsar',
        ],
        [
          'ICBM152 NLin6',
          '152 T1 görüntü; doğrusal ve 6 yinelemeli doğrusal olmayan kayıt',
          'Simetrik; FSL analiz yazılımının şablonu, A. Janke’nin yaptığı asimetrik bir türevidir (NLin6Asym)',
        ],
        [
          'ICBM 2009 doğrusal olmayan şablonlar',
          '40 yinelemeli kayıt; her yinelemede kişiler bir önceki ortalamaya uydurulur; işlem doğrusal MNI152’den başlar',
          '2009b sürümleri 0,5 mm çözünürlüklüdür; yalnızca T1, T2 ve PD görüntüleri içerir',
        ],
        [
          'Colin 27 (yan dal)',
          'Tek bir kişi (CJH) 27 kez tarandı; görüntülerin ortalaması 1998’de alındı',
          'Bölütleme için yapıldı, stereotaksi için değil; tek beyin olduğu için değişkenliği yansıtmaz',
        ],
      ],
      not: 'Kaynaklar: Selvaraj ve ark. (2026); BIC (2012a, 2012b, 2012c); BIDS (t.y.); MNI (t.y.). Kayıt, bir görüntüyü şablona uydurmaktır. Doğrusal (afin) kayıt 12 parametre kullanır; doğrusal olmayan kayıt binlerce parametreyle bölgesel şekil farklarını da düzeltebilir (Conti ve ark., 2023). PD: proton yoğunluğu ağırlıklı görüntü.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Bir uyarı: “MNI uzayı” da tek anlamlı değildir. Adı MNI ile başlayan bütün şablonlar ortak bir şemsiye adla “MNI uzayı” diye anılır (BIDS, t.y.). Oysa tablodaki şablonlar farklı yollarla yapıldı. Bu yüzden bir koordinat bildirilirken şablonun tam adı da yazılmalıdır.

Nörogörüntülemede iki yaygın başvuru çerçevesi vardır. Biri SPM yazılımının kullandığı MNI uzayıdır. Öbürü Talairach ve Tournoux atlaslarının Talairach uzayıdır (Rorden, t.y.-b). SPM yaygın bir analiz programıdır. Rorden’in anlatımına göre SPM’de **normalleştirilmiş** görüntülerin merkezi, ön komissürün merkezidir (Rorden, t.y.-b). Normalleştirme, bir beyni şablona uydurma işlemidir. Alanyazındaki sonuçlar bazen MNI, bazen Talairach koordinatıyla bildirilir. Aradaki fark çalışmaları karşılaştırmayı zorlaştırır (Laird ve ark., 2010).

İki uzay arasında köprü kurmak için dönüşümler yazıldı. Brett ve arkadaşlarının “mni2tal” dönüşümü MNI’yi Talairach’a iki doğrusal matrisle eşler. Ama yazarlar bunun yalnızca bir yaklaşık olduğunu belirtti (Conti ve ark., 2023). Laird ve arkadaşları, farkı azaltmak için Lancaster dönüşümünün topluluk standardı olmasını önerdi (Laird ve ark., 2010).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: İki makale, aynı sayılar',
      oyku: `Bir psikoloji yüksek lisans öğrencisi, dikkatle ilgili beyin görüntüleme çalışmalarını derliyor. İki makale aynı bölgede etkinlik bildirmiş gibi görünüyor. Birinci makale tepe noktasını (40, 20, 30) olarak veriyor ve “Talairach koordinatları” diyor. İkinci makale de (40, 20, 30) yazıyor, ama “MNI uzayı” diyor. Öğrenci iki sonucu aynı noktaya ait sayıp tablosuna tek satır olarak yazmak istiyor.`,
      soru: 'Aynı üç sayı iki makalede beyinde aynı yeri mi gösterir? Öğrenci ne yapmalıdır?',
      cozum: `**Aynı yeri göstermeyebilir.** İki uzayda da x sağa, y öne, z yukarı doğru büyür (Selvaraj ve ark., 2026). Ama başvuru beyinleri farklıdır. MNI şablonu Talairach beyninden daha uzun ve daha yüksektir; şakak lobları da daha büyüktür (Conti ve ark., 2023). Bu yüzden aynı sayılar biraz farklı anatomik yerlere düşer. Fark beynin her yerinde aynı da değildir. Sol yarımkürenin derinindeki bir noktada sıfırdır, bazı ön bölgelerde 1 cm’yi aşar (Lancaster ve ark., 2007).

**Ne yapmalı?** Önce iki koordinat aynı uzaya çevrilmelidir. Brett’in “mni2tal” dönüşümü yalnızca bir yaklaşıktır (Conti ve ark., 2023). Laird ve arkadaşları bu iş için Lancaster dönüşümünü önerir (Laird ve ark., 2010). İkinci olarak “MNI uzayı” bir şablon ailesinin şemsiye adıdır (BIDS, t.y.). Makalenin hangi şablonu kullandığına bakılmalıdır. Elde görüntü dosyası varsa NIfTI başlığındaki kod da yol gösterir: sform kodu 3 Talairach, 4 MNI uzayını bildirir (NiBabel, t.y.-d). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'MNI ile Talairach arasındaki fark ne kadar?',
      md: `Lancaster ve arkadaşları aynı beyinleri iki şablona uydurdu. ICBM-152’ye uydurulan beyinler, Talairach’a uydurulanlara göre sistematik olarak daha büyük çıktı. Ayrıca daha “burnu aşağı” dönüktüler ve biraz aşağı kaymışlardı (Lancaster ve ark., 2007). İki koordinat arasındaki fark beyinde elips biçimli bir desen çizer. Sol yarımkürenin derinindeki bir noktada sıfırdır; bazı ön bölgelerde 1 cm’yi aşar (Lancaster ve ark., 2007).

Brett’in mni2tal dönüşümü alt bölgelerde farkı genellikle azalttı. Ama ön, arka ve üst bölgelerde farkı artırdı (Lancaster ve ark., 2007). SPM2 ve FSL için ayarlanmış Lancaster dönüşümleri ise grup ortalama farkını 5–13 mm’den 1–2 mm’ye indirdi. Bu iyileşme hem derin hem yüzeyel bölgelerde görüldü (Lancaster ve ark., 2007).

Başlangıç noktaları da aynı değildir. Selvaraj ve arkadaşlarına göre MNI’nin başlangıç noktası, özgün Talairach başlangıcının 3,5 mm üstündedir (Selvaraj ve ark., 2026). Bu, Lancaster’ın “biraz aşağı kayma” bulgusuyla aynı şey değildir. Biri başlangıç noktasının tanımıdır, öbürü şablona uydurulan beyinlerin konumudur.

Rorden ise SPM’de normalleştirilmiş görüntülerin merkezini ön komissürün merkezi olarak anlatır (Rorden, t.y.-b). Bu iki anlatım tam örtüşmez. Talairach başlangıcı, AC’nin üst kenarına teğet çizgi ile arka kenarından inen dikeyin kesiştiği noktadır (Selvaraj ve ark., 2026; Conti ve ark., 2023). Yani ön komissürün üst-arka köşesindedir. Ondan 3,5 mm yukarıdaki bir nokta, komissürün merkezinde olamaz. Rorden’in cümlesi kaba bir tarif olabilir.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `ICBM (Uluslararası Beyin Haritalama Konsorsiyumu) 1992’de başladı. Amaç, insan beyni için dört boyutlu, olasılığa dayalı bir atlas ve başvuru sistemi kurmaktı (Mazziotta ve ark., 2001). Toplanan veri 18–90 yaş arasında 7000 kişiyi ve 342 tek ya da çift yumurta ikizini kapsıyordu (Mazziotta ve ark., 2001). 2001’de üç merkez (MNI, UCLA, UTHSCSA) normal genç yetişkinlerden yaklaşık 150’şer MR görüntüsü topladı (BIC, 2012b). MNI152 verisi Montreal Nöroloji Enstitüsü’nde, Philips 1,5 T bir tarayıcıyla toplandı (Manera ve ark., 2020).

Örneklemin özellikleri kaynaktan kaynağa biraz değişir. MNI’nin sayfası yaşı ortalama 25,02 yıl verir; standart sapma (SS) 4,90, aralık 18–44 yıldır. Örneklemde 86 erkek ve 66 kadın vardır (MNI, t.y.). Manera ve arkadaşları aralığı 18,5–43,5 yıl olarak yazar (Manera ve ark., 2020). Aynı sayfadaki köken dağılımı 129 Kafkas, 15 Asyalı ve 1 karışıktır; toplamı 152’yi tutmaz (MNI, t.y.).

Şablon seçimi, kimin incelendiğine de bağlıdır. Erişkin şablonu MNI305 çocuk beyinleri için en uygun seçenek değildir; yaşa uygun şablonlar gerekir (Fonov ve ark., 2011). AFNI “uzay” sözcüğünü gevşek bir anlamda kullanır: bir şablonla aynı “ayakkabı kutusuna” sığmak. AFNI’de TLRC, MNI, MNI_ANAT ve ORIG gibi uzaylar vardır (AFNI, t.y.-e).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `AC–PC uzayında koordinatlar sabit bir başlangıca göre verilir. Bu başlangıç AC, PC ya da ikisinin tam ortası olabilir. Bu orta noktaya **orta komissürel nokta** (*midcommissural point*, MCP) denir (Selvaraj ve ark., 2026). BIDS’in “ACPC” sisteminde başlangıç AC’dir ve eksi y ekseni PC’den geçer. Artı z ekseni yukarıda, iki yarımkürenin ortasındaki bir noktadan geçer (BIDS, t.y.).

Bir görüntüyü AC–PC’ye hizalamak iki adımdır. Önce orta sagital düzlem hizalanır; beyin simetrik ve doğru duruşta olsun diye. Sonra AC–PC çizgisi ön–arka eksene oturtulur (Selvaraj ve ark., 2026).

Ama bir sorun var: aynı adla anılan birkaç çizgi vardır. Talairach, Schaltenbrand ve MNI152 uzaylarının birlikte kullanılması klinik nörobilimde tutarsızlıklara yol açtı (Selvaraj ve ark., 2026). Çizgi ve başlangıç noktası tanımdan tanıma değişir. Bir hedef koordinatı okurken önce hangi tanımın kullanıldığına bakılır.`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'AC–PC’ye göre kesit',
      md: `Doğru hizalanmış bir MR’da AC ile PC aynı aksiyel kesitte görülür. Bu kesitte üçüncü karıncık tipik bir **anahtar deliği** görünümü alır (Selvaraj ve ark., 2026).

AC–PC çizgisi ölçüm yapılacak kesiti seçmek için de kullanılır. Ankara’dan bir çalışma normal basınçlı hidrosefaliyi, yani beyin-omurilik sıvısının karıncıklarda biriktiği bir durumu inceledi. Bu çalışmada iki ölçüm, AC–PC çizgisine dik koronal kesitlerde yapıldı. Kallozal açı PC’den, z-Evans indeksi AC’den geçen kesitte ölçüldü (Emrahoğlu ve ark., 2026).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'AC–PC ne kadar uzun?',
      ogeler: [
        { deger: '24', birim: 'mm', aciklama: 'Schaltenbrand’ın bildirdiği ortalama AC–PC uzaklığı (Selvaraj ve ark., 2026).' },
        { deger: '22', birim: 'mm', aciklama: 'Kesitlere ayrılmış tek bir kadavra başında ölçülen uzaklık (Park ve ark., 2010).' },
        {
          deger: '24,33',
          birim: 'mm',
          aciklama:
            'İstanbul’da derin beyin uyarımı yapılan 101 Parkinson hastasının ortalaması. En kısası 19,90, en uzunu 28,60 mm (Hasimoglu ve ark., 2025).',
        },
      ],
      not: 'AC–PC uzunluğu kişiden kişiye değişir. Tek bir sayı yerine aralığı akılda tut.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Bir çizgi, dört tanım',
      sutunlar: ['Tanım', 'Çizgi nereden nereye?', 'Başlangıç (0, 0, 0)', 'Ölçekleme'],
      satirlar: [
        [
          'Talairach',
          'AC’nin üst kenarından PC’nin alt kenarına (teğet çizgi)',
          'Bu çizginin, AC’nin arka kenarından inen dikeyle kesiştiği nokta',
          'Parça parça doğrusal',
        ],
        ['Schaltenbrand', 'AC’nin merkezinden PC’nin merkezine', 'Çizginin ortası (MCP)', 'Yok'],
        ['Klinik (cerrahi)', 'AC’nin arka kenarından PC’nin ön kenarına', 'Atlas hedef koordinatlarında MCP (ör. STN)', '—'],
        ['MNI', 'Açık bir AC–PC tanımı gerekmez', 'Özgün Talairach başlangıcının 3,5 mm üstü', 'Doğrusal'],
      ],
      not: 'Kaynaklar: Selvaraj ve ark. (2026); Conti ve ark. (2023); Hasimoglu ve ark. (2025). Üç uzayda da +x sağ, +y ön, +z üsttür (Selvaraj ve ark., 2026).',
    },
    {
      tur: 'animasyon',
      ad: 'ac-pc-izgarasi',
      duzey: 'ileri',
      baslik: 'AC–PC çizgisi, dört tanımı ve ızgara',
      aciklama:
        'Sol yarıma orta hattan bakış: ön sağda, tepe yukarıda. Düğmeler AC–PC çizgisini, çizginin dört tanımını ve Talairach’ın orantılı ızgarasını gösterir.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Klinik tanım bir gereklilikten doğdu: ölüm sonrası yapılmış bir atlası canlı görüntülere uyarlamak. Bu sorun MR’dan önce, örneğin ventrikülografide, özellikle belirgindi (Selvaraj ve ark., 2026). Kenar tanımlarında dikkat gerekir. AC ve PC’nin biçimi yuvarlaktan elipse değişebilir. Bu yüzden üst ve alt kenara dayanan tanım güvenilmez ve hataya açık olur (Selvaraj ve ark., 2026). Park ve arkadaşlarına göre iki merkezden geçen çizgi, yapılar ne kadar büyük olursa olsun, her bireyde oldukça tutarlıdır (Park ve ark., 2010). Choi ve arkadaşları 7 tesla MR’da bu çizgiye “merkezî komissürler arası çizgi” (CIL) dedi. Bu çizginin tekrarlanabilir bir başvuru olduğunu gösterdiler (Choi ve ark., 2013).

Tanım farkı küçük bir ayrıntı değildir. Nowinski’nin karşılaştırmasında bir mesafe tanımı özgün Talairach uzaklığına yalnızca %0,5 hatayla yaklaşır. Merkez ve teğet tanımlarda bu hata %10 dolayındadır. Ama iç ya da merkez uzaklık kullanılırsa kabukta yer kayması 11 mm’ye varabilir. Teğet uzaklık ise yalnızca 1 mm kaydırır (Conti ve ark., 2023). Yani en iyi tanım, işin ne olduğuna göre değişir.

İşaretlemenin kendisi ise oldukça kesindir. Uzmanlar AC ve PC’yi, kılavuzla da kılavuzsuz da, 1 mm’den küçük hatayla işaretledi (Selvaraj ve ark., 2026). En çok hata, başın öne–arkaya eğimi (*pitch*), yani X ekseni çevresindeki dönmede görüldü. Kılavuz yokken üç dönme koşulunda en büyük sapmalar 1,12° ile 1,79° arasındaydı (Selvaraj ve ark., 2026). Klinik AC–PC düzlemine hizalamayı doğrularken en önemli denetim bu eğimdir (Selvaraj ve ark., 2026). Orta düzlemi tanımlamak için aynı doğru üzerinde olmayan en az üç nokta gerekir. Selvaraj ve arkadaşları bunun için dört orta hat noktası önerir. İkisi köprünün üst çentiği ve dördüncü karıncığın tepesidir (fastigium). Öteki ikisi beyin orağının (*falx cerebri*) ön ve arka noktalarıdır (Selvaraj ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Komissürler nokta değildir',
      md: `AC–PC çizgisi temel stereotaksik başvuru olmayı sürdürüyor. Ama komissürler sabit noktalar değil, kişiden kişiye değişen üç boyutlu yapılardır (Esen Aydin ve ark., 2026). Bu bulgu, İstanbul’daki Bakırköy Eğitim ve Araştırma Hastanesi’nin beyin cerrahisi kliniğinden bir ekipten gelir. Ekip dört erişkin kadavra beyninde arka komissürü ve habenular komissürü (*commissura habenularum*) inceledi (Esen Aydin ve ark., 2026).

PC, beyin gelişiminde en erken oluşan komissür lif sistemlerindendir. Ara beyin ile orta beynin birleştiği yerde temel bir işarettir (Esen Aydin ve ark., 2026). Üçüncü karıncığın arka bölümündeki pineal girinti (*recessus pinealis*) önde habenular komissürle, arkada PC ile sınırlanır (Esen Aydin ve ark., 2026). İnce komissürleri görüntüde görmek de kolay değildir. Büyük bir araştırma projesinin (HCP) 1,25 mm’lik difüzyon şablonuyla yapılan lif izleme, habenular komissürü gösteremedi (Esen Aydin ve ark., 2026).

Ölçülerde de kaynaklar farklı şeyleri ölçer. Schaltenbrand’a göre sagital düzlemde ortalama çap AC için 3 mm, PC için 2 mm’dir (Selvaraj ve ark., 2026). Gray ise AC’nin sagital kesitte oval olduğunu ve dikey uzun çapının yaklaşık 5 mm olduğunu yazar (Gray, 1918). Biri ortalama çaptır, öbürü uzun çaptır.`,
    },
    {
      tur: 'metin',
      md: `**Stereotaksi** sözcüğü Yunanca “katı” (*stereo*) ve “düzenleme” (*takse*) sözcüklerinden gelir. Vücudun içindeki bir dokunun yerini bulup ona müdahale etmek için geliştirildi (Jensen ve ark., 2025b). Victor Horsley ile Robert Clarke 1908’de hayvan beyninde hedef bulmak için ilk stereotaksik çerçeveyi yaptı (Guevara ve ark., 2026). Çerçeve x, y ve z eksenli (Kartezyen) koordinatlar kullanıyordu. İnsanda ilk kullanım 1947’de geldi (Guevara ve ark., 2026).

Yöntemin özü şudur. Hastanın anatomisine sabitlenmiş, görüntüde açıkça görünen işaretler kullanılır; bunlara **fidüsyel** denir. Hasta bu işaretlerle birlikte görüntülenir. Böylece beynin her noktası üç boyutlu bir koordinat sistemine yerleşir (Jensen ve ark., 2025b). Leksell çerçevesinde bu işaretler, çerçevenin iki yanındaki N biçimli levhalardır (Shi ve ark., 2025).

Bazen hedef görüntüde seçilemez. O zaman görüntüde görünen bir yapı, örneğin ön komissür, başvuru olarak kullanılır. Görünmeyen hedefin yeri ona göre bulunur. Buna **dolaylı hedefleme** denir ve sık başvurulan bir yoldur (Jensen ve ark., 2025b). **Derin beyin uyarımında** (DBU) beynin derinine bir elektrot yerleştirilir. Elektrodun hedeflerinden biri subtalamik çekirdektir. Atlaslar bu çekirdeğin yerini AC–PC çizgisinin orta noktasına göre verir (Hasimoglu ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Titremede derin beyin uyarımının yolu bir gözlemle açıldı. 1960’larda esansiyel tremor (nedeni bilinmeyen titreme) için talamusta küçük yıkımlar yapılıyordu; buna talamotomi denir. Bu ameliyatlar sırasında araştırmacılar bir şey fark etti. Talamusun ventral ara çekirdeği (Vim) yüksek frekansla (100 Hz) uyarılınca titreme belirgin biçimde azalıyordu. Bu bulgu talamusun derin beyin uyarımına götürdü (Chopra ve ark., 2013).',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Bir koordinat** üç sayıdır. Anlamı başlangıç noktasına, eksenlerin yönüne ve birime bağlıdır.

**RAS+ ve LPS:** Araştırma dosyaları (NIfTI) ve atlaslar RAS+ kullanır: x sağa, y öne, z yukarı. DICOM dosyaları LPS kullanır: x sola, y arkaya, z yukarı.

**Talairach uzayı** beynin içindeki iki işarete dayanır: ön ve arka komissür. Başlangıç noktası ön komissürdür ve sistem orantılıdır.

**MNI uzayı** çok sayıda beynin ortalamasından yapılmış şablonlara dayanır. Talairach ve MNI sayıları birebir aynı yeri göstermez.

**Stereotaksi**, görüntüde görünen işaretlerle beyne koordinatla ulaşır. Görünmeyen hedefler çoğu zaman ön ve arka komissür gibi görünen işaretlere göre bulunur.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Spiegel ve Wycis 1947’de beyin yapılarını röntgen filmleriyle bulan ilk klinik stereotaksik çerçeveyi tasarladı (Jensen ve ark., 2025b). Tarihsel olarak ventrikülografi AC ile PC’yi gösterdi. Bu noktalarla, AC–PC çizgisinin eksenlerden biri olduğu bir Kartezyen sistem kuruldu. Hedefler de birçok hastanın ortalama koordinatlarına göre seçildi (Jensen ve ark., 2025b). Lars Leksell 1951’de Börje Larsson ile **radyocerrahi** kavramını getirdi. Bu yöntemde beyindeki kesin tanımlı bir hedef, açık cerrahi olmadan, tek ve odaklanmış bir ışın dozuyla yok edilir (Guevara ve ark., 2026).

Görüntüde çerçevenin yerini bulmak için **N biçimli işaretleyici** (N-lokalizör) kullanılır. 1978’de geliştirildi. 1979’dan başlayarak yedi farklı stereotaksik çerçeve onu kullandı (Brown ve Nelson, 2016). Leksell çerçevesinde hedef Kartezyen koordinatlarla (x, y, z) ayarlanır. İğnenin izleyeceği yol (yörünge) ise iki açıyla ayarlanır: **yay** ve **halka** açıları. Bu açılar küresel koordinatların kutup ve azimut açılarına karşılık gelir (Jensen ve ark., 2025b).

Çerçeveler dönme merkezine göre ikiye ayrılır. Leksell gibi **hedef merkezli** sistemlerde yörünge hedeften bağımsızdır; hedefe en uygun yoldan ulaşılabilir. Giriş noktası çevresinde dönen sistemlerde (ör. Nexframe, ClearPoint) ise giriş noktasındaki hata hedefte büyür (Jensen ve ark., 2025b).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Derin beyin uyarımında hedefler',
      md: `Esansiyel tremorda en sık kullanılan derin beyin uyarımı hedefi, talamusun **Vim** çekirdeğidir (Chopra ve ark., 2013). Benabid ve arkadaşlarının Vim’i hedefleyen öncü çalışmasından beri DBU, Parkinson hastalığının tedavisinde temel bir yöntem oldu (Anderson ve ark., 2017).

Parkinson’da hedeflerden biri **subtalamik çekirdektir** (*nucleus subthalamicus*, STN). Atlas ortalamalarına göre STN, AC–PC çizgisinin orta noktasından yaklaşık 12 mm yandadır. Ayrıca 2–3 mm arkada ve 3–4 mm aşağıdadır (Hasimoglu ve ark., 2025). Bu sayılar birçok kişinin ortalamasıdır. Yazarlara göre bu ortalamaların hata payları çoğu zaman kabul edilebilir sınırı aşar (Hasimoglu ve ark., 2025).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Hedeflerin mahallesi: yukarıdan bakış',
      aciklama:
        'Derin yapılara yukarıdan bakıyoruz: ön taraf ekranın üstünde, hastanın sağı ekranın sağında. Bölümün başındaki “Aynı nokta, iki kural” çiziminde de baş bu yönden görülür. Sarı: ön ve arka komissür; aralarındaki çizgi orta hatta önden arkaya uzanır. AC–PC uzayında sağdaki yapılar artı, soldakiler eksi x alır. Pembe: talamus. Turuncu: globus pallidus. Mavi: üçüncü karıncık. Talamus ve üçüncü karıncık yarı saydamdır; altlarındaki arka komissür görünsün diye. Arka komissür bu yarı saydam yapıların altından turuncumsu görünür. Onu globus pallidusla karıştırma. Subtalamik çekirdek bu modelde ayrı bir parça olarak yoktur.',
      sahne: {
        katmanlar: ['derin', 'karincik'],
        renk: 'yapi',
        goster: ['on-komissur', 'arka-komissur', 'talamus', 'globus-pallidus', 'putamen', 'kaudat-cekirdek', 'ucuncu-karincik'],
        vurgula: ['on-komissur', 'arka-komissur', 'talamus', 'globus-pallidus', 'ucuncu-karincik'],
        boya: [
          { secici: ['on-komissur', 'arka-komissur'], renk: '#f2b544' },
          { secici: ['talamus'], renk: '#ee6a92' },
          { secici: ['globus-pallidus'], renk: '#f28a52' },
          { secici: ['ucuncu-karincik'], renk: '#5b9bd5' },
        ],
        saydam: ['talamus', 'ucuncu-karincik'],
        bakis: 'ust',
        etiketler: [
          { yapi: 'on-komissur', metin: 'AC' },
          { yapi: 'arka-komissur', metin: 'PC' },
          { yapi: 'talamus-sag', metin: 'Talamus' },
          { yapi: 'globus-pallidus-sol', metin: 'Globus pallidus' },
          { yapi: 'putamen-sag', metin: 'Putamen' },
          { yapi: 'kaudat-cekirdek-sol', metin: 'Kaudat çekirdek' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Leksell çerçevesinin merkezi (100, 100, 100) kabul edilir. Başlangıç noktası (0, 0, 0) ise çerçevenin **üst–arka–sağ** köşesindedir (Shi ve ark., 2025). Eksenlerin RAS+ ile ilişkisi şöyledir (Shi ve ark., 2025):

- **X**, sağ eksenin ters yönündedir: hastanın **soluna** doğru artar.
- **Y**, ön eksenle aynı yöndedir: **öne** doğru artar.
- **Z**, üst eksenin ters yönündedir: **aşağı** doğru artar.

Başlangıcı çerçevenin merkezine taşınmış bir RAS+ koordinatı (R, A, S) olsun. Leksell koordinatına geçiş basittir: **X = 100 − R, Y = 100 + A, Z = 100 − S** (Shi ve ark., 2025). Çerçevenin iki yanındaki N biçimli işaret levhaları 120 mm yüksekliktedir. Aralarında 190 mm vardır (Shi ve ark., 2025). Klinik planlamada Leksell yazılımı hedefi [X, Y, Z, yay, halka] olarak verir. Yay açısının 0°’si hastanın sağ yanındadır (Lee ve ark., 2024).

Dikkat et: Leksell X’i, DICOM’daki x gibi sola doğru büyür. Leksell Y ise DICOM’un tersine öne doğru büyür. Z de iki kuralın tersine aşağı doğru büyür. Kaynaklar bu üç düzeni yan yana koymaz; aşağıdaki tablo bizim derlememizdir.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Aynı nokta, üç kural',
      sutunlar: ['Kural', 'x büyüyünce', 'y büyüyünce', 'z büyüyünce', 'Örnek nokta'],
      satirlar: [
        ['RAS+ (çerçeve merkezli)', 'sağa', 'öne', 'yukarı', '(−10, 5, 20)'],
        ['LPS (DICOM yönü, aynı merkez)', 'sola', 'arkaya', 'yukarı', '(10, −5, 20)'],
        ['Leksell', 'sola', 'öne', 'aşağı', '(110, 105, 80)'],
      ],
      not: 'Örnek nokta çerçeve merkezinin 10 mm solunda, 5 mm önünde ve 20 mm üstündedir. Leksell değeri X = 100 − R, Y = 100 + A, Z = 100 − S ile hesaplandı (Shi ve ark., 2025). Eksen yönleri: NEMA (2026c); NIfTI Çalışma Grubu (t.y.); Shi ve ark. (2025). Tablo bizim derlememizdir.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'AC–PC’ye göre hedef koordinatları',
      sutunlar: ['Hedef', 'Başvuru noktası', 'Koordinat (mm)', 'Not'],
      satirlar: [
        ['STN, atlas ortalaması', 'MCP', 'x ±12; y −2 ile −3; z −3 ile −4', 'Dolaylı hedefleme (Hasimoglu ve ark., 2025)'],
        ['STN, İstanbul: planlanan hedef', 'MCP', 'x ±12,36; y −1,95; z −4,09', '101 hasta, 202 STN; ortalama (Hasimoglu ve ark., 2025)'],
        [
          'STN, İstanbul: ameliyat sonrası',
          'MCP',
          'x ±10,99; y −4,16; z −6,85',
          'Elektrot ucunun yeri; hedef noktasıyla aynı şey değildir (Hasimoglu ve ark., 2025)',
        ],
        ['Dorsolateral STN “sıcak noktası”', 'Medial STN sınırı', '2,8 yanda; 1,1 önde; 2,2 üstte', 'Hollanda’dan (Bolier ve ark., 2025)'],
        [
          'Vim, dolaylı',
          'PC ve orta hat',
          'PC’nin, AC–PC uzunluğunun dörtte biri kadar önü; orta hattan 14 mm',
          'Odaklanmış ultrasonla talamotomi (Aibar-Duran ve ark., 2025)',
        ],
        [
          'Vim, doğrudan: ilk ultrason noktası',
          'Üçüncü karıncık duvarı, PC, komissürler arası düzlem',
          'Duvarın 11 yanı; PC’nin 6,5–7 önü; düzlemin 1,5–2 üstü',
          'Tipik değerler (Aibar-Duran ve ark., 2025)',
        ],
      ],
      not: 'İşaret kuralı RAS+’tır: eksi y arkayı, eksi z aşağıyı gösterir. “±x” iki yanı birden anlatır: sağda artı, solda eksi. Bu sayılar ortalama ya da tipik değerlerdir; hastadan hastaya değişir (Hasimoglu ve ark., 2025; Aibar-Duran ve ark., 2025).',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'İstanbul kohortu: hedef neden kayar?',
      md: `Türkiye’den önemli bir çalışma, İstanbul’daki Başakşehir Çam ve Sakura Şehir Hastanesi’nden gelir. Ekip Sağlık Bilimleri Üniversitesi Hamidiye Tıp Fakültesi’ndendir (Hasimoglu ve ark., 2025). Çalışmaya iki yanlı STN uyarımı ameliyatı olan 101 Parkinson hastası alındı: 49 kadın, 52 erkek. Toplam 202 STN incelendi (Hasimoglu ve ark., 2025). AC–PC çizgisi klinik tanımla çizildi: AC’nin hemen arkasından PC’nin hemen önüne (Hasimoglu ve ark., 2025). Ameliyattan sonra AC–PC çizgisine paralel 1 mm’lik BT kesitleri alındı. Bu kesitler ameliyat öncesi MR ile birleştirildi (Hasimoglu ve ark., 2025).

Sonuçlar, AC–PC’ye göre verilen bir hedefin bile kişiye göre kaydığını gösterir. AC–PC uzunluğundaki her 1 mm artış, STN koordinatını x ekseninde 0,124 mm yana kaydırdı. Aynı artış z ekseninde 0,074 mm’lik bir kayma getirdi. Kaynak bunu “negatif kayma” diye verir, ama yönünü açıkça yazmaz (Hasimoglu ve ark., 2025). Yaşın her yılı da STN’yi x ekseninde yaklaşık 0,046 mm yana kaydırdı (Hasimoglu ve ark., 2025). Yazarlara göre atlas koordinatları birçok hedefin ortalamasıdır ve hata payları çoğu zaman kabul edilebilir sınırı aşar (Hasimoglu ve ark., 2025).

Başka başvurular da kullanılır. STN’nin dolaylı hedeflenmesinde kırmızı çekirdeğin yan kenarı ile STN arasındaki uzaklığa da bakılır. Bu uzaklık değişkendir, ama 3 mm dolayındadır (Jensen ve ark., 2025b). Hollanda’daki bir çalışma MCP yerine **medial STN sınırını** başvuru aldı. Bu sınır, kırmızı çekirdeğin en geniş aksiyel kesitinde ön sınırından çizilen çizgiyle (Bejjani çizgisi) belirlenir. Bu başvuruyla bulunan sıcak nokta, hareketteki düzelmeyle anlamlı biçimde ilişkiliydi (Bolier ve ark., 2025).

Vim’de de benzer bir durum var. Kimi merkezler PC’nin önünde, AC–PC uzunluğunun %25’i kadar ileriyi sabit hedef alır. Kimileri hastaya özgü düzeltmeler yapar. Merkezler arasındaki bu değişkenlik büyük bir sorundur (Aibar-Duran ve ark., 2025). Karıncıkları genişlemiş ya da beyni küçülmüş (atrofik) hastalarda dolaylı koordinatların doğruluğu bozulabilir (Aibar-Duran ve ark., 2025).`,
    },
    {
      tur: 'sayilar',
      duzey: 'ileri',
      baslik: 'Ne kadar kesin?',
      ogeler: [
        {
          deger: '≤ 2',
          birim: 'mm',
          aciklama:
            'Stereotakside kabul gören doğruluk ölçütü: hedef ile varılan nokta arasındaki düz çizgi (Öklid) uzaklığı (Jensen ve ark., 2025a).',
        },
        {
          deger: '0,72',
          birim: 'mm',
          aciklama:
            'Bir deney modelinde (fantom) Leksell çerçevesiyle ölçülen ortalama hedef noktası hatası. Robotta bu hata 0,53 mm idi (Spyrantis ve ark., 2022).',
        },
        {
          deger: '0,5',
          birim: 'mm',
          aciklama:
            'Leksell G çerçevesinde, 90 N gibi büyük ama olası bir kuvvet altında üst–alt yönde görülebilen en büyük kayma (Weidlich ve ark., 2025).',
        },
        {
          deger: '11',
          birim: 'mm',
          aciklama:
            'AC–PC uzaklığının hangi tanımla ölçüldüğüne bağlı olarak kabukta varılabilen en büyük yer kayması (Conti ve ark., 2023).',
        },
      ],
      not: 'Kullanıcılar çerçevelerin, üreticiye göre, 0,2–0,3 mm’den daha iyi çalıştığını varsayar (Weidlich ve ark., 2025). Beyin-omurilik sıvısı kaybı ve kafa içine hava girmesi, beynin çerçeveye göre yerini değiştirebilir (Jensen ve ark., 2025a).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Türkiye’den çerçeveli ve çerçevesiz stereotaksi sonuçları da var. Erzurum Şehir Hastanesi’nden bir ekip, kliniklerinde 2014–2022 arasında 142 hastaya 143 stereotaksik biyopsi (doku örneği alma) yaptığını bildirdi (Jubran ve Ucar, 2025). Bütün işlemler çerçeve ve MR ile, X, Y, Z eksenlerinde üç boyutlu hesapla yapıldı. MR ile uyumlu Leksell çerçevesiyle yapılan bu biyopsilerde doğru tanı oranı %91,6’ydı (Jubran ve Ucar, 2025).

İstanbul’daki bir çalışmada çerçevesiz robotik biyopsi ile çerçeveli biyopsinin hedefleme doğruluğu arasında anlamlı fark yoktu (Özgen ve ark., 2026). Robotik grupta navigasyon yazılımının hesapladığı ortalama uç hatası 0,42 ± 0,19 mm idi. Çerçeveli biyopside ameliyat sonrası BT ile ölçülen hedefleme hatası ortalama 0,51 ± 0,23 mm idi (Özgen ve ark., 2026). Kayseri’de (Erciyes Üniversitesi) çerçevesiz VarioGuide sistemiyle 58 biyopsi yapıldı; tanı verimi %94,8’di (Ulutabanca ve ark., 2026).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Sol STN’nin Leksell adresi',
      oyku: `62 yaşında bir erkek Parkinson hastası için iki yanlı subtalamik çekirdek uyarımı planlanıyor. Ameliyat sabahı başına Leksell çerçevesi takılıyor ve BT çekiliyor. Planlama yazılımı BT’yi ameliyat öncesi MR ile birleştiriyor ve görüntüyü AC–PC’ye hizalıyor. Orta komissürel nokta (MCP), çerçeve merkezli RAS+ uzayında (3, −8, 12) mm’de. Ekip sol STN için atlas ortalamasıyla başlıyor: MCP’ye göre 12 mm yan, 2 mm arka, 4 mm aşağı. Bu alıştırmada AC–PC eksenlerinin çerçeve eksenlerine paralel olduğunu varsayalım.`,
      soru: 'Sol STN hedefinin Leksell koordinatları (X, Y, Z) nedir? Aynı nokta LPS yönünde yazılmış bir listeden alınıp RAS+ sanılırsa ne olur?',
      cozum: `**1. MCP’ye göre RAS+.** RAS+’ta x sağa doğru artar; sol taraf eksidir. Hedef (−12, −2, −4) mm’dir. Atlas ortalaması x ±12, y −2 ile −3, z −3 ile −4 mm’dir (Hasimoglu ve ark., 2025).

**2. Çerçeve merkezli RAS+.** MCP’nin koordinatı eklenir: (3 − 12, −8 − 2, 12 − 4) = (−9, −10, 8).

**3. Leksell.** X = 100 − R, Y = 100 + A, Z = 100 − S (Shi ve ark., 2025). Sonuç X = 109, Y = 90, Z = 92’dir. Hızlı denetim: Leksell X’i sola doğru artar, bu yüzden sol hedefte X 100’den büyüktür. Y öne doğru artar; merkezin arkasındaki hedefte 100’den küçüktür. Z aşağı doğru artar; merkezin üstündeki hedefte 100’den küçüktür.

**4. Tuzak.** Aynı merkezli LPS’de nokta (9, 10, 8) diye yazılır, çünkü ilk iki eksenin işareti terstir (3D Slicer, t.y.). Bu sayılar RAS+ sanılırsa X = 100 − 9 = 91, Y = 100 + 10 = 110 çıkar. Hedef sağ yarımküreye ve 20 mm öne kayar: sağ–sol ve ön–arka birlikte yanlış olur. Bu yüzden her koordinat listesinde kuralın adı açıkça yazılmalı ve hedef görüntü üzerinde gözle de denetlenmelidir.

**5. Ortalama, hedef değildir.** Atlas koordinatları birçok hastanın ortalamasıdır. Hata payları çoğu zaman kabul edilebilir sınırı aşar (Hasimoglu ve ark., 2025). Bu yüzden atlas değeri yalnızca bir başlangıçtır. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
