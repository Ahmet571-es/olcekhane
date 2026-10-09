import type { DersBolumu, Sahne } from '../../../types';

const KESIT_KATMANLARI: Sahne['katmanlar'] = ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'];

/**
 * 03. bölüm: düzlemler ve kesitler: üç düzlem ve median düzlem, TA2 adları, adların kafatası dikişlerinden gelmesi,
 * "aksiyel" ve "transvers" sözcükleri, eğik düzlem, kesite hangi yönden bakıldığı, omurilik ve beyin sapı kesitleri,
 * seri kesitler ve büyük atlaslar, kesitsel anatomi eğitimi. Eksenler 2. bölümde, görüntülerdeki gösterim kuralları
 * 5. bölümde işlenir.
 */
export const duzlemlerVeKesitler: DersBolumu = {
  id: 'duzlemler-ve-kesitler',
  baslik: 'Düzlemler ve kesitler',
  bloklar: [
    // ——— Üç düzlem: temel ———
    {
      tur: 'metin',
      md: `Beynin içini görmek için onu ince dilimlere ayırırız. Dilimin kesilen yüzüne **kesit** denir. Kesit, üç boyutlu bir yapının iki boyutlu bir yüzüdür (OpenStax 1.6). Bugün beyni kesmeden de kesit alabiliyoruz. Manyetik rezonans (MR) ve bilgisayarlı tomografi (BT) cihazları canlı bedenden “sanal kesitler” üretir (OpenStax 1.6).

Kesiti hayalî, dümdüz bir yüzey belirler. Bu yüzeye **düzlem** denir. Bir kesit görüntüsü ancak hangi düzlemde alındığı bilinirse doğru okunur (OpenStax 1.6). Bir yapıyı farklı düzlemlerde bulabilmek, onun devrelere nasıl bağlandığını anlamanın da ilk adımıdır (Henley, 2021b).

Anatomide üç ana düzlem vardır:

- **Sagital düzlem** dikeydir. Beyni **sağ ve sol** parçalara ayırır (OpenStax 1.6).
- **Koronal düzlem** de dikeydir, ama beyni **ön ve arka** parçalara ayırır. Ona **frontal düzlem** de denir (OpenStax 1.6). İki göze ya da iki kulağa paralel uzanır (Henley, 2021a).
- **Transvers düzlem** beyni **üst ve alt** parçalara ayırır (OpenStax 1.6). Yere paralel uzandığı için ona **horizontal**, yani yatay düzlem de denir (Henley, 2021a). Bu düzlemdeki kesitlere **enine kesit** de denir (OpenStax 1.6).

Sagital düzlem tam ortadan geçerse adı **orta sagital düzlem** ya da **median düzlem** olur (OpenStax 1.6). Bu düzlem iki yarımküre arasındaki derin yarıktan geçer. Beyni sağ ve sol yarıma ayırır (Henley, 2021b). Aşağıda aynı beyni üç düzlemde kestik.`,
    },
    {
      tur: 'sahne',
      baslik: 'Koronal kesit: önden bakış',
      aciklama:
        'Beyin, ön komissür hizasından koronal düzlemle kesildi. Ön parça kaldırıldı ve kesite önden bakıyoruz. Bu yüzden hastanın sağı ekranın solunda kalır. Renkler doğala yakındır: kesilen yüzeyde gri cevher koyu, beyaz cevher açık görünür. Ortada iki yan karıncığın ön bölümü, çevrelerinde derin çekirdekler kesilmiştir. Kaydırıcıyla kesiti öne ya da arkaya taşıyabilir, düzlemi değiştirebilirsin.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'koronal', konum: 0.26 },
        bakis: 'on',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
          { yapi: 'yan-karincik-sag', metin: 'Yan karıncık' },
          { yapi: 'kaudat-cekirdek-sol', metin: 'Kaudat çekirdek' },
          { yapi: 'putamen-sol', metin: 'Putamen' },
          { yapi: 'on-komissur', metin: 'Ön komissür' },
        ],
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Transvers (aksiyel) kesit: üstten bakış',
      aciklama:
        'Aynı beyin bu kez yatay düzlemle kesildi. Kesit talamus ve bazal çekirdekler hizasından geçer. Üst parça kaldırıldı ve kesite yukarıdan bakıyoruz. Ön taraf ekranın üstünde, hastanın sağı ekranın sağındadır. Ortada iki talamus görünür. Onların önünde ve yanında kaudat çekirdek, putamen ve iç kapsül kesilmiştir. Renkler doğala yakındır.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'aksiyel', konum: 0.12 },
        bakis: 'ust',
        etiketler: [
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'kaudat-cekirdek-sag', metin: 'Kaudat çekirdek' },
          { yapi: 'putamen-sol', metin: 'Putamen' },
          { yapi: 'ic-kapsul-sag', metin: 'İç kapsül' },
        ],
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'Sagital kesit: median düzlem',
      aciklama:
        'Bu kez beyin tam orta hattan, median düzlemle kesildi. Sol yarımküre kaldırıldı ve kesite soldan bakıyoruz: ön taraf ekranın solunda. Gördüğün, sağ yarımkürenin iç yüzüdür. Orta hatta tek olan yapılar ise ortadan ikiye kesilmiştir: korpus kallozum, üçüncü karıncık, beyin sapı ve beyinciğin orta kısmı (vermis). Kaydırıcıyla kesiti orta hattın yanına taşıyabilirsin. O zaman sagital kesit bir yarımkürenin içinden geçer.',
      sahne: {
        katmanlar: KESIT_KATMANLARI,
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'sagital', konum: 0 },
        bakis: 'sol',
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
          { yapi: 'singulat-girus-sag', metin: 'Kuşak kıvrımı (singulat girus)' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık' },
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: `Üç kesite birlikte bak. Aynı yapı her düzlemde başka bir biçimde görünür. Örneğin karıncıklar hem sagital hem koronal kesitlerde görülür (Henley, 2021b). Ama biçimleri her kesitte farklıdır. Bu yüzden bir yapıyı iyi tanımak için onu birkaç düzlemde izlemek gerekir. Bir nöroanatomi laboratuvarı da talamusun bazal çekirdeklerle komşuluğunu hem yatay hem koronal dilimlerde izletir (Byrne ve Dafny, 2026).

Üç ana düzlemin dışında da düzlem vardır. Bir açıyla kesen, ana düzlemlerin hiçbirine paralel ya da dik olmayan düzleme **eğik düzlem** denir (OpenStax 1.6). Bazı yapılar en iyi böyle bir düzlemde görünür. Hipokampus örneğini görüntülerde yön bulmayı anlatan bölümde göreceğiz.

Bir kesite iki yandan bakılabilir. Koronal bir dilime önden bakarsan hastanın sağı senin solunda kalır. Arkadan bakarsan hastanın sağı senin sağında olur. Yani bir kesit görüntüsünü okumak için iki şeyi bilmek gerekir: düzlemi ve bakış yönünü. Bu dersteki sahnelerin açıklamaları ikisini de söyler. MR ve BT ekranlarında sağın ve solun nasıl gösterildiği ayrı bir kuraldır. Onu da görüntülerde yön bulmayı anlatan bölümde işleyeceğiz.`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '“Enine” her zaman “yatay” demek değildir',
      md: `Görüntülemede yatay kesitlere çoğu zaman **aksiyel kesit** denir (Dafny, 2020). “Transvers” ya da “enine” kesit ise bir yapıyı enlemesine keser. Ama hangi yapının eksenine göre?

Bir önceki bölümde sinir ekseninin orta beyin hizasında kabaca 90 derece büküldüğünü gördük (Henley, 2021a). Bu yüzden enine kesit her yerde aynı yöne düşmez. Omuriliğin enine kesiti başın yatay düzlemindedir (Dafny, 2020). Beyin sapının enine kesiti ise beyin sapının uzun eksenine dik alınır (Coulombe ve ark., 2021). Bir kesitin adını okurken hangi yapının ekseninin esas alındığına bak.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Kesit**, bir yapının düzlemle kesilmiş yüzüdür. Görüntüyü okumak için önce düzlemi, sonra bakış yönünü bil.

**Sagital** sağ ile solu, **koronal** (frontal) ön ile arkayı, **transvers** (horizontal, aksiyel) üst ile altı ayırır. Tam ortadan geçen sagital düzlem **median** düzlemdir.

**Eğik düzlem** ana düzlemlerin hiçbirine paralel ya da dik değildir.

**Enine kesit** omurilikte başın yatay düzlemine düşer. Beyin sapında ise beyin sapının uzun eksenine diktir.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: '7404 dilimlik beyin',
      md: `Bir insan beyni 7404 ince dilime kesildi. Her dilim 20 mikrometre kalınlığındaydı. Bu, bir milimetrenin ellide biri demektir. Dilimler hücre gövdelerini gösteren bir boyayla boyandı ve bilgisayara aktarıldı (Paquola ve ark., 2021). Sonra dilimler yeniden üst üste dizildi. Böylece neredeyse hücre ölçeğinde, üç boyutlu bir beyin modeli kuruldu. Adı **BigBrain**’dir (Amunts ve ark., 2013).`,
    },

    // ——— Üç düzlem: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Düzlemlerin resmî adları.** Uluslararası anatomi terimlerinin listesi Terminologia Anatomica’dır. Bugünkü 2. baskısına kısaca TA2 denir. TA2 düzlemleri “başvuru düzlemleri” (*plana referentiae*) başlığında toplar. Bu başlıkta iki aile vardır. **Boylamsal düzlemler** (*plana longitudinalia*) dikey düzlemlerdir. Sagital ve koronal düzlemler bu ailededir. Öteki aile yatay **transvers düzlemlerdir** (*plana transversa*) (FIPAT, 2019).

TA2 sagital düzlemleri ikiye ayırır. Tam ortadakinin adı **median düzlemdir** (*planum medianum*). Ona paralel öteki düzlemlerin adı **paramedian düzlemdir** (*planum paramedianum*). TA2’nin notuna göre median düzleme paralel sınırsız sayıda düzlem vardır (FIPAT, 2019). Ders kitapları bunlara çoğu zaman **parasagital düzlem** der. OpenStax, beyni eşit olmayan sağ ve sol parçalara ayıran düzleme parasagital düzlem der (OpenStax 1.6). TA2’de ise “parasagital” yalnızca ilişkili bir addır (FIPAT, 2019).

İki kaynak bir sözcükte daha ayrılır. OpenStax’e göre parasagital kesite seyrek olarak “boylamsal kesit” de denir (OpenStax 1.6). TA2’de “boylamsal” ise hem sagital hem koronal düzlemleri kapsayan üst başlıktır (FIPAT, 2019). “Koronal mı, frontal mi?” sorusunun cevabı da kaynağa göre değişir. TA2 koronal düzlemi ana ad, frontal düzlemi eş anlamlı olarak verir (FIPAT, 2019). Gray’in kitabı ise önce “frontal” der, “bazen koronal” diye ekler (Gray, 1918). İkisi aynı düzlemdir.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'TA2’deki başvuru düzlemleri',
      sutunlar: ['Türkçe', 'TA2 adı (kimlik)', 'Eş anlamlı ya da ilişkili adlar', 'Neyi ayırır?'],
      satirlar: [
        [
          'Boylamsal (dikey) düzlemler',
          '*plana longitudinalia* (47)',
          'Eş anlamlı: *plana verticales*',
          'Üst başlık: sagital ve koronal düzlemler',
        ],
        ['Koronal düzlemler', '*plana coronalia* (48)', 'Eş anlamlı: *plana frontalia* (frontal düzlemler)', 'Ön ve arka'],
        ['Sagital düzlemler', '*plana sagittalia* (49)', '—', 'Sağ ve sol'],
        [
          'Median düzlem',
          '*planum medianum* (50)',
          'Eş anlamlı: median sagittal plane; ilişkili: midsagittal plane',
          'Tam ortadan: iki yarım',
        ],
        [
          'Paramedian düzlem',
          '*planum paramedianum* (51)',
          'Eş anlamlı: paramedian sagittal plane; ilişkili: parasagittal plane',
          'Ortanın yanından: eşit olmayan sağ ve sol',
        ],
        [
          'Transvers düzlemler',
          '*plana transversa* (52)',
          'Eş anlamlı: *plana horizontalia*; ilişkili: *plana transversalia*, axial planes',
          'Üst ve alt',
        ],
      ],
      not: 'Kaynak: (FIPAT, 2019). TA2 bu düzlemleri “başvuru düzlemleri” (plana referentiae, 46) başlığında toplar. TA2’de genel sıfatlar da ayrı kimlik taşır: coronalis (5), sagittalis (6), horizontalis (3), verticalis (2), axialis (28). “Neyi ayırır?” sütunu OpenStax 1.6’ya göredir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Adlar kafatasından gelir.** Gray’in 1918 baskısı düzlem adlarının kökenini kafatasıyla açıklar. Median düzlem, gövdenin ortasından geçen, dikey ve önden arkaya uzanan düzlemdir. Bu düzlem kabaca kafatasının **sagital dikişinden** geçer. Bu yüzden ona paralel her düzleme sagital düzlem denir (Gray, 1918). Median düzleme dik dikey bir düzlem ise kabaca **koronal dikişin** orta kısmından geçer. Gray buna frontal ya da bazen koronal düzlem der (Gray, 1918). Median ve frontal düzlemlerin ikisine de dik olan düzlem transvers düzlemdir (Gray, 1918).

Dikiş, kafatası kemiklerinin birleştiği çizgidir. Kafatasının kendisi bu dersin konusu değildir. Burada onu yalnızca adların kökeni için anıyoruz.

Bir Kore çalışması kesit anatomisini dört hayalî düzleme dayandırır: aksiyel (horizontal), median (orta sagital), sagital ve koronal. Sagital düzlem median düzleme paraleldir. Koronal düzlem sagital düzleme dik, dikey bir düzlemdir. Aksiyel düzlem ise hem sagital hem koronal düzleme diktir (Park ve ark., 2010).`,
    },

    // ——— Aksiyel, transvers, horizontal: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dört sözcük, iki dil.** Anatomi ve görüntüleme aynı düzlemlere farklı adlar verir. UTHealth’in ders kitabı başa göre konuşur. Koronal kesit dikey düzleme paraleldir. Ortadan geçen bir koronal kesit başı ön ve arka yarıya ayırır. Horizontal kesite **aksiyel** de denir. Ortadan geçen bir horizontal kesit başı üst ve alt yarıya ayırır (Dafny, 2020). Elektromanyetik görüntüleme yöntemlerinin çoğu beyni bu üç düzlemde gösterir: koronal, horizontal (aksiyel) ve sagital (Dafny, 2020).

TA2’de “aksiyel” ayrı bir genel sıfattır (*axialis*). Ama “aksiyel düzlemler”, transvers düzlemlerin yalnızca ilişkili adıdır (FIPAT, 2019). Yani radyolojideki “aksiyel kesit”, anatomideki transvers düzlemin günlük adıdır.

“Transvers” sözcüğü ise bölgeye göre başka bir eksene dik demektir. Omurilikte enine kesit dikey eksene dik alınır; bu, başın horizontal düzlemidir (Dafny, 2020). Beyin sapında enine kesit, beyin sapının uzun eksenine dik alınır (Coulombe ve ark., 2021). UTHealth de örnek kesitlerini bu mantıkla seçer. Omurilik ve beyin sapından transvers, uç beyin (telensefalon) ve ara beyinden (diensefalon) koronal kesitler gösterir (Dafny, 2020). Ön beyin ve beyin sapı eksenlerini (Forel ve Meynert eksenleri) bir önceki bölümde ayrıntılı gördük.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Her yapının en iyi göründüğü düzlem.** Bazı yapılar bir düzlemde ötekilerden daha iyi okunur. İç kapsül, derin çekirdeklerin arasından geçen kalın bir beyaz cevher bandıdır. Kabuktan aşağı inen lifler bu banttan geçer (Byrne ve Dafny, 2026). Üç parçası vardır: ön bacak, dirsek (*genu*) ve arka bacak. Bu üç parça en iyi horizontal kesitlerde görülür (Byrne ve Dafny, 2026). Koronal kesitlerde de dirsek kolayca tanınır, çünkü iç kapsülün orta hatta en yakın parçasıdır (Byrne ve Dafny, 2026). Aşağıdaki sahnede bu üç parçayı yatay bir kesitte bul.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'İç kapsülün üç parçası',
      aciklama:
        'Yalnızca derin yapılar gösteriliyor. Talamus ve bazal çekirdekler hizasından yatay bir kesit alındı. Kesite yukarıdan bakıyoruz: ön taraf ekranın üstünde, hastanın sağı ekranın sağında. Beyaz: iç kapsül. Mavi: kaudat çekirdek. Turuncu: putamen. Sarı: globus pallidus. Pembe: talamus. İç kapsül iki yanda birer açık V harfi çizer. Ön bacak kaudat çekirdek ile putamen arasında uzanır. Arka bacak ise talamus ile globus pallidus ve putamen arasındadır. İkisinin birleştiği köşe dirsektir.',
      sahne: {
        katmanlar: ['derin'],
        renk: 'yapi',
        goster: ['ic-kapsul', 'kaudat-cekirdek', 'putamen', 'globus-pallidus', 'talamus'],
        boya: [
          { secici: ['ic-kapsul'], renk: '#f1ede4' },
          { secici: ['kaudat-cekirdek'], renk: '#5aa9e6' },
          { secici: ['putamen'], renk: '#f28a52' },
          { secici: ['globus-pallidus'], renk: '#f2b544' },
          { secici: ['talamus'], renk: '#ee6a92' },
        ],
        kesit: { duzlem: 'aksiyel', konum: 0.18 },
        bakis: 'ust',
        etiketler: [
          { yapi: 'ic-kapsul-sol', metin: 'İç kapsül' },
          { yapi: 'kaudat-cekirdek-sol', metin: 'Kaudat çekirdek' },
          { yapi: 'putamen-sag', metin: 'Putamen' },
          { yapi: 'globus-pallidus-sag', metin: 'Globus pallidus' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
        ],
      },
      araclar: ['kesit', 'bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Bebekte beyin ultrasonu: iki düzlem kuralı',
      md: `Yenidoğanın kafatasında ön bıngıldak henüz açıktır. Beyin ultrasonu çoğu zaman bu açıklıktan yapılır. Standart olarak altı koronal ve beş sagital düzlemde görüntü kaydedilir. Bu standart düzlemlerin yanında bütün beyin de taranır ve genel bir görünüm elde edilir (Dudink ve ark., 2020).

Kural açıktır: şüpheli bir bozukluk her iki düzlemde de gösterilmelidir (Dudink ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'Kaç düzlem, hangi açı?',
      md: `- **Fetüs MR’ı:** Uluslararası kılavuz, fetüsün beyni ve bedeni için en az üç dik düzlemde T2 bilgisi ister (Prayer ve ark., 2023).
- **Yeni BT cihazları:** Her yönde eşit boyutlu hacim birimleri (izotropik voksel) toplayabilir. Böylece görüntü, çözünürlük kaybı olmadan her anatomik düzlemde yeniden kurulabilir (Liao ve ark., 2018).
- **Bir dilimden üç düzlem:** Visible Korean projesi bir kadavra başını yalnızca aksiyel düzlemde dilimledi. Bilgisayarda bütün aksiyel görüntülerin sütunları üst üste dizilince sagital, satırları dizilince koronal görüntüler elde edildi (Park ve ark., 2010).`,
    },

    // ——— Bakış yönü ve sıralama: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Seriler ve şekil açıklamaları.** Kesitler çoğu zaman sırayla, seri hâlinde gösterilir. Sıranın da bir kuralı vardır. UTHealth’in nöroanatomi laboratuvarında koronal serilerin ilk görüntüsü en rostral, yani en öndeki kesittir. Horizontal serilerin ilk görüntüsü ise en alttaki kesittir (Byrne ve Dafny, 2026). Allen insan beyni atlası da plakalarını önden arkaya sıralar (Ding ve ark., 2016). Şekil açıklamaları da yönü söylemelidir. Örneğin bir derleme, yandan görünen beyin için “rostral uç solda, kaudal uç sağda” diye yazar (Stiles ve Jernigan, 2010).

Anatomik kesit fotoğrafları da bir gösterim kuralına uydurulabilir. Visible Korean projesinin seri kesit görüntüleri ters çevrildi. Böylece başın sağ yanı görüntünün soluna geldi ve radyolojideki kurala uyuldu (Park ve ark., 2010). Bu kuralı görüntülerde yön bulmayı anlatan bölümde işleyeceğiz.`,
    },

    // ——— Omurilik ve beyin sapı kesitleri: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Omuriliğin enine kesiti.** Omurilik alışkanlıkla bir dizi transvers kesitle incelenir (FIPAT, 2019). Bu kesitte dışta beyaz cevher, içte gri cevher bulunur. Ortada beyin-omurilik sıvısıyla (BOS) dolu çok küçük bir kanal vardır (Dafny, 2026). Gri cevher “H” harfine ya da bir kelebeğe benzer (Dafny, 2026). Gray her yarıdaki gri cevheri virgüle ya da hilale benzetir. Hilalin çukur yüzü yana bakar (Gray, 1918). Merkez kanaldan geçen hayalî bir koronal düzlem, her hilali bir ön (ventral) ve bir arka (dorsal) sütuna ayırır (Gray, 1918). Görüyorsun: düzlem fikri bir organın içinde de işe yarar.

Gri sütunlar omuriliğin uzun ekseni boyunca uzanır. Bu yüzden ancak boylamsal kesitlerde bir bütün olarak görülür. Transvers kesitte ise her sütun bir **boynuz** (*cornu*) gibi görünür (FIPAT, 2019). Yani “ön boynuz” ve “arka boynuz” adları, kesitin düzleminden doğmuştur.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beyin sapının enine kesitleri.** UTHealth ders kitabı beyin sapını transvers kesitlerle tanıtır (Dafny, 2020). Her düzeyin kendine özgü işaret yapıları vardır.

Üst omurilik soğanından geçen kesitin işaret yapıları şunlardır (Dafny, 2020):

- dördüncü karıncık,
- dil altı sinirinin çekirdeği (hipoglossal çekirdek),
- alt beyincik sapı,
- alt zeytin çekirdek kümesi,
- piramitler.

Ponsun ortasından geçen kesitte ise dördüncü karıncık, ponsun tegmentumu, ponsun tabanı ve orta beyincik sapları görülür. Tegmentum, beyin sapının ortadaki çekirdekli bölümüdür (Coulombe ve ark., 2021). Bu düzeyde abdusens sinirinin çekirdeklerini içerir (Dafny, 2020). Ponsun tabanında enine kesilmiş görünen boylamsal lifler, kabuktan aşağı inen liflerdir. Bunlara kortikofugal lifler denir (Byrne ve Dafny, 2026).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kesitten düzeyi tanımak',
      sutunlar: ['Kesit', 'Düzlem', 'İşaret yapıları'],
      satirlar: [
        ['Omurilik', 'Transvers', 'Dışta beyaz, içte H ya da kelebek biçimli gri cevher; ortada küçük merkez kanal (Dafny, 2026)'],
        ['Omurilik, göğüs ve bel düzeyleri', 'Transvers', 'Yan boynuz yalnızca bu düzeylerde bulunur (Byrne ve Dafny, 2026)'],
        [
          'Omurilik, T6’nın üstü',
          'Transvers',
          'Arka ara oluk yalnızca bu düzeyde bulunur ve arka beyaz sütunu ikiye böler (Byrne ve Dafny, 2026)',
        ],
        [
          'Üst omurilik soğanı',
          'Transvers',
          'Dördüncü karıncık, hipoglossal çekirdek, alt beyincik sapı, alt zeytin çekirdek kümesi, piramitler (Dafny, 2020)',
        ],
        [
          'Ponsun ortası',
          'Transvers',
          'Dördüncü karıncık, abdusens çekirdeklerini içeren tegmentum, pons tabanı, orta beyincik sapları (Dafny, 2020)',
        ],
        [
          'Orta beyin ile ara beynin birleşimi',
          'Koronal',
          'Kitaba göre bu kesitin düzlemi, kitaptaki önceki örnek kesitlerinkinden farklıdır (Dafny, 2020)',
        ],
        ['Uç beyin ve ara beyin', 'Koronal', 'Ders kitabının örnek kesitleri bu düzlemdedir (Dafny, 2020)'],
      ],
      not: 'Omurilik ve beyin sapı kesitleri yapının kendi uzun eksenine dik alınır. Bu yüzden ikisinde de transvers kesit adı kullanılır (Dafny, 2020; Coulombe ve ark., 2021).',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Kesitte hangi düzey?',
      oyku: 'Nöroanatomi laboratuvarında bir öğrenciye boyanmış bir beyin sapı kesiti veriliyor. Kesitin arka yüzünde geniş, sığ bir boşluk var. Ön yüzde, orta hattın iki yanında iki kalın lif demeti uzanıyor. Bu demetlerin hemen yanında büyük bir çekirdek kümesi görülüyor. Sınav kâğıdında kesitin düzeyi ve düzlemi soruluyor.',
      soru: 'Bu kesit büyük olasılıkla hangi düzeyden geçer ve düzlemi nasıl adlandırılır?',
      cozum:
        'Görünüm, UTHealth ders kitabının üst omurilik soğanı kesitine uyar. O kesitin işaret yapıları dördüncü karıncık, hipoglossal çekirdek, alt beyincik sapı, alt zeytin çekirdek kümesi ve piramitlerdir (Dafny, 2020). Beyin sapında karıncık sistemi dorsalde, büyük lif kütlesi en ventralde durur (Coulombe ve ark., 2021). Yani arkadaki boşluk dördüncü karıncık, öndeki iki demet piramitlerdir. Yanlarındaki büyük küme alt zeytin çekirdek kümesidir. Ponsun ortasından geçen bir kesitte ise önde büyük bir pons tabanı ve yanlarda orta beyincik sapları görülürdü (Dafny, 2020). Kesit beyin sapının uzun eksenine dik alındığı için adı transvers kesittir (Coulombe ve ark., 2021). *Vaka eğitim için kurgulanmıştır.*',
    },

    // ——— Omurilik ve beyin sapı kesitleri: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Adı kesitten gelen terimler',
      md: `**Sütun mu, boynuz mu?** TA2’nin notuna göre gri sütunlar (*columnae griseae*) ile boynuzlar (*cornua*) aslında eş anlamlıdır. “Boynuz” sözü genellikle omuriliğin transvers kesitindeki görünüm için kullanılır. Notun yazarı “sütun” sözünü her durumda belki daha uygun bulur (FIPAT, 2019).

**Kesitin çarpıcı özelliği.** Piramit lifleri, kabuktan inen hareket yolunun lifleridir. Bu yola kortikospinal yol da denir (Knierim, t.y.). TA2’nin bir notuna göre bu liflerin çaprazlaşmasının çoğu omurilik soğanının içinde olur. Bu yüzden çaprazlaşma, piramidin altından alınan transvers kesitlerin çarpıcı bir özelliğidir (FIPAT, 2019).

**Kaç lif karşıya geçer?** TA2 bu notu 1955 tarihli eski bir listeden (PNA) aktarır. Nota göre inen piramit liflerinin yaklaşık üçte ikisi karşı tarafa geçer (FIPAT, 2019). Bu, tarihsel bir değerdir. Güncel bir ders kitabına göre ise liflerin yaklaşık %90’ı piramit çaprazlaşmasında karşı tarafa geçer (Knierim, t.y.).

**İki “enine”.** 1895 tarihli Basel terim listesinde (BNA) iki ayrı sözcük vardı. *Transversalis* “vücut eksenine enine”, *transversus* “ilgili organın eksenine enine” demekti. Bugün bu ayrım gözetilmez. Bu yüzden *transversalis* genel terim olarak listeden çıkarıldı (FIPAT, 2019). Bugün beyin sapında ve omurilikte “transvers kesit”, organın kendi eksenine dik kesittir (Dafny, 2020; Coulombe ve ark., 2021). Bu kullanım, BNA’daki *transversus* tanımına uyar.`,
    },

    // ——— Seri kesitler ve atlaslar: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Seri kesitler.** Atlasların çoğu bir beyni art arda ince dilimlere keser. Sonra dilimleri boyar, fotoğraflar ve sırayla dizer. Bu dilimlere **seri kesit** denir. Kesit düzlemi, dilim kalınlığı ve dilimler arasındaki aralık, atlasın neyi gösterebileceğini belirler.

**BigBrain** 65 yaşında bir erkeğin beyninden hazırlandı. Beyin 20 µm kalınlıkta 7404 kesite ayrıldı. Kesitler hücre gövdesi boyasıyla boyandı ve sayısallaştırıldı (Paquola ve ark., 2021). Özgün kesit düzlemi koronaldir (Wagstyl ve ark., 2020). Üç boyutlu yeniden kurulumu 40 µm ile 1000 µm arasında çeşitli çözünürlüklerde çevrimiçi sunulur (Paquola ve ark., 2021). µm, mikrometre demektir: milimetrenin binde biri.

**Allen insan beyni atlası** 34 yaşında, nörolojik hastalık öyküsü olmayan bir kadının beynine dayanır (Ding ve ark., 2016). Beyin orta hattan ikiye ayrıldı. Her yarımküre önden arkaya kesildi; sonuçta 2 cm kalınlığında sekiz dilim elde edildi. Her blok koronal düzlemde 50 µm kalınlıkta kesildi. Hiçbir kesit atılmadan hepsi sırayla toplandı (Ding ve ark., 2016).

**Visible Korean** projesi bir kadavra başını tepeden çeneye 0,1 mm aralıkla kesti. Böylece 2.343 seri kesit görüntüsü elde edildi (Park ve ark., 2010). Her görüntünün bir pikseli 0,1 mm’dir (Park ve ark., 2010).

Olszewski–Baxter atlası gibi beyin sapı atlaslarının kesit düzlemini bir önceki bölümde gördük.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üç büyük seri kesit kaynağı',
      sutunlar: ['Kaynak', 'Kimden?', 'Kesit düzlemi', 'Kalınlık ya da aralık', 'Kesit sayısı'],
      satirlar: [
        ['BigBrain', '65 yaşında bir erkek', 'Koronal (Wagstyl ve ark., 2020)', '20 µm', '7404 (Paquola ve ark., 2021)'],
        [
          'Allen insan beyni atlası',
          '34 yaşında bir kadın',
          'Koronal',
          '50 µm; Nissl boyası için her dördüncü kesit (200 µm aralık)',
          '1.356 kesit sayısallaştırıldı; 106 atlas plakası (Ding ve ark., 2016)',
        ],
        [
          'Visible Korean (baş)',
          'Bir kadavra başı',
          'Aksiyel; sagital ve koronal görüntüler bilgisayarda kuruldu',
          '0,1 mm aralık',
          '2.343 görüntü (Park ve ark., 2010)',
        ],
      ],
      not: 'Allen atlasında sol yarımküre, bağlı beyin sapı ve beyinciğiyle birlikte koronal 2 cm’lik dilimlere ayrıldı. Kesitler bilgisayara piksel başına 1 µm çözünürlükte aktarıldı (Ding ve ark., 2016).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Türkiye’den: kesit okumayı öğrenmek',
      md: `Akdeniz Üniversitesi Tıp Fakültesinde kesitsel anatomi için özel çalışma modülleri düzenlendi. 2018–2022 yılları arasında bu modüllere katılan 100 öğrencinin geri bildirimleri 11 soruluk bir anketle toplandı (Ogut ve ark., 2025). Öğrenciler modülleri değerli buldu. Öğrencilere göre modüller, kesit görüntülerinde yapıları tanımalarını kolaylaştırdı. Farklı düzey ve bölgelerden alınmış kesitleri ayırt etmelerine de yardım etti (Ogut ve ark., 2025). Öğrencilerin yaklaşık %74’ü modülün en önemli yararı olarak bilgilerin klinik uygulamayla bütünleşmesini gösterdi (Ogut ve ark., 2025). Bunlar öğrencilerin kendi görüşleridir. Yazarlar da çalışmada karşılaştırma için bir kontrol grubu olmadığını belirtir (Ogut ve ark., 2025).`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- TA2: koronal düzlem *plana coronalia* (eş: *plana frontalia*); median düzlem *planum medianum*; parasagital düzlemin resmî adı *planum paramedianum*; transvers düzlem *plana transversa* (eş: *plana horizontalia*) (FIPAT, 2019).
- Gray 1918: sagital düzlem adını sagital dikişten, koronal düzlem adını koronal dikişten alır (Gray, 1918).
- Radyolojide aksiyel = horizontal (Dafny, 2020). TA2’de “axial planes”, transvers düzlemlerin ilişkili adıdır (FIPAT, 2019).
- Omurilikte transvers kesit başın horizontal düzlemindedir. Beyin sapında transvers kesit uzun eksene diktir (Dafny, 2020; Coulombe ve ark., 2021).
- İç kapsülün üç parçası en iyi horizontal kesitte görülür. Dirsek, orta hatta en yakın parçadır (Byrne ve Dafny, 2026).
- Omuriliğin transvers kesitinde gri cevher H ya da kelebek biçimlidir. Sütunlar bu kesitte boynuz adını alır (Dafny, 2026; FIPAT, 2019).
- UTHealth laboratuvarında koronal seriler en öndeki, horizontal seriler en alttaki kesitle başlar (Byrne ve Dafny, 2026).`,
    },

    // ——— Seri kesitler ve atlaslar: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kesit atlaslarının sınırları',
      md: `- **Doku değişir:** Allen atlasında beyni sabitleyen hazırlık, beyinde hafif bir uzamaya yol açtı (Ding ve ark., 2016).
- **Her kesit çizilmez:** Allen atlasında ayrıntılı çizim için 679 Nissl kesitinden 106’sı seçildi. Örnekleme aralığı 0,4 mm ile 3,4 mm arasında değişti (Ding ve ark., 2016). Atlas plakaları arasındaki aralık bu yüzden her yerde aynı değildir.
- **Tek kesit yetmez:** BigBrain’de kabuğun altı katmanı, yapay bir sinir ağıyla bölütlendi. Ağ, üç boyutlu histoloji hacminden çıkarılan yoğunluk profillerine uygulandı. Profiller kabuğun dış yüzeyi ile beyaz cevher arasında çizildi. Kesit düzlemine göre eğiktiler, ama kabuğun sütunlarına yakın bir doğrultudaydılar (Wagstyl ve ark., 2020). Özgün koronal kesitte kabuk bir kıvrımı eğik kesebilir. O zaman kıvrımın yalnızca bir parçası görünür ve katmanların çoğu seçilemez (Wagstyl ve ark., 2020).
- **Bir beyin, birçok beyin:** Julich-Brain’in üç boyutlu olasılık atlası, BigBrain dahil 23 ölüm sonrası beyinden üretildi (Paquola ve ark., 2021). Allen’ın gen ifadesi atlası ise iki kişide yaklaşık 900 alt bölümün profilini çıkardı (Hawrylycz ve ark., 2012).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Koronal kesitte kaybolan katmanlar',
      oyku: 'Bir doktora öğrencisi BigBrain’in özgün koronal kesitlerinde kabuğun altı katmanını elle ölçmek istiyor. Bazı kıvrımlarda katmanları rahatça seçiyor. Ama başka yerlerde kabuk kesitte geniş ve bulanık görünüyor; katmanların sınırları kayboluyor. Öğrenci, bu bölgelerde kabuğun gerçekten daha kalın olduğunu düşünmeye başlıyor.',
      soru: 'Öğrencinin gözlemi neden yanıltıcı olabilir ve kalınlığı nasıl ölçmek gerekir?',
      cozum:
        'BigBrain’in özgün kesit düzlemi koronaldir (Wagstyl ve ark., 2020). Kabuk ise her yerde bu düzleme dik durmaz. Kesit bir kıvrımı eğik keserse kıvrımın yalnızca bir parçası görünür ve katmanların çoğu seçilemez (Wagstyl ve ark., 2020). İki boyutlu kalınlık ölçümleri bu yüzden eğik kesmeden doğan hatalar taşır (Wagstyl ve ark., 2020). MR’da da kabuğun yüzeyi ana eksenlerden hiçbirine dik değilse, elle yapılan kalınlık ölçümü hatalı olur (Fischl ve Dale, 2000). Wagstyl ve arkadaşları bu yüzden katmanları üç boyutlu hacimde bölütledi. Kullandıkları yoğunluk profilleri kesit düzlemine bağlı kalmadı. Profiller kabuğun dış yüzeyinden beyaz cevhere, kabuğun sütunlarına yakın bir doğrultuda çıkarıldı (Wagstyl ve ark., 2020). Öğrenci de ölçümü tek bir koronal kesitte değil, üç boyutlu hacimde ve kabuğa dik doğrultuda yapmalıdır. *Vaka eğitim için kurgulanmıştır.*',
    },
  ],
};
