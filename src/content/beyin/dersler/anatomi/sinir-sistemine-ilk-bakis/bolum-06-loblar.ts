import type { DersBolumu } from '../../../types';

/** İşlev haritası sahnesinin renkleri (yalnızca tanıtır; iyi ya da kötü anlamı yoktur). */
const HAREKET = '#e5484d';
const DUYU = '#4f8de0';
const BROCA = '#f2b544';
const ISITME = '#25b98f';
const GORME = '#ee6a92';

/** 6. bölüm: büyük beynin yüzü — kıvrımlar, oluklar, büyük yarıklar, loblar (4 mü 6 mı?), işlev haritası, Brodmann ve yeni haritalar. */
export const yariklarVeLoblar: DersBolumu = {
  id: 'yariklar-ve-loblar',
  baslik: 'Büyük beynin yüzü: yarıklar, oluklar, loblar ve işlev haritası',
  bloklar: [
    {
      tur: 'metin',
      md: `Büyük beynin yüzü kıvrım kıvrımdır. Her kabarık kıvrıma **girus** (*gyrus*; çoğulu *gyri*) denir. İki kıvrım arasındaki oyuğa **sulkus** (*sulcus*) ya da oluk denir (OpenStax 13.2). Derin oluklara **yarık** (*fissura*) da denir (Dafny, 2020). Kıvrılma, sınırlı kafatası hacmine daha çok gri cevher sığdırır (OpenStax 13.2). Kabuk yüzeyinin yaklaşık üçte ikisi olukların içinde gizlidir (Lee, 2019).

Yüzeyi haritalamak için dört büyük işaret yeter:

- **Uzunlamasına yarık** (*fissura longitudinalis cerebri*) iki yarımküreyi birbirinden ayırır (OpenStax 13.2).
- **Lateral oluk** (*sulcus lateralis*) temporal lobu öteki bölgelerden ayırır. Sylvius yarığı diye de anılır. Üstünde frontal ve parietal loblar bulunur (OpenStax 13.2).
- **Merkezî oluk** (*sulcus centralis*) frontal lobu parietal lobdan ayırır (OpenStax 13.2).
- **Parieto-oksipital oluk** (*sulcus parietooccipitalis*) beynin iç yüzünde parietal lobu oksipital lobdan ayırır (OpenStax 13.2).

Bu işaretlere göre kabuk dört büyük loba ayrılır: **frontal** (alın), **parietal** (yan kafa), **temporal** (şakak) ve **oksipital** (art kafa) lob (OpenStax 13.2).

Gray’e göre iki bölge daha vardır. Lateral oluğun tabanında **insula** (*insula*) bulunur. Çevresindeki loblar onu örter, bu yüzden dışarıdan görünmez. İç yüzde ise **limbik lob** (*lobus limbicus*) vardır. Bu lob singulat ve hipokampal kıvrımları kapsar (Gray, 1918).`,
    },
    {
      tur: 'sahne',
      baslik: 'Dört lob ve merkezî oluğun iki yanı',
      aciklama:
        'Sol yarımküreye yandan bakıyoruz; ön taraf solda. Her lob ayrı renkte: mavi frontal, sarı parietal, yeşil temporal, pembe oksipital. Merkezî oluk, presantral ve postsantral girusların arasından yukarıdan aşağı iner. Lateral oluk, yeşil temporal lobun üst sınırını çizer. Bakış düğmesiyle beyni üstten de incele: uzunlamasına yarık iki yarımküreyi ayırır.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'lob',
        bakis: 'sol',
        etiketler: [
          { yapi: 'orta-frontal-girus-sol', metin: 'Frontal lob' },
          { yapi: 'ust-parietal-lobul-sol', metin: 'Parietal lob' },
          { yapi: 'orta-temporal-girus-sol', metin: 'Temporal lob' },
          { yapi: 'oksipital-lob-sol', metin: 'Oksipital lob' },
          { yapi: 'presantral-girus-sol', metin: 'Presantral girus' },
          { yapi: 'postsentral-girus-sol', metin: 'Postsantral girus' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'sahne',
      baslik: 'İç yüz: limbik kıvrımlar ve korpus kallozum',
      aciklama:
        'Sağ yarımküre kaldırıldı. Sol yarımkürenin iç yüzüne bakıyoruz; ön taraf bu kez sağda. Turuncu renk, modelin limbik lob diye grupladığı kıvrımları gösterir. Biri singulat girustur: korpus kallozumun hemen üstünde kavis çizer. Öteki parahipokampal girustur: temporal lobun iç yüzündedir. Krem renkli kemer korpus kallozumdur. Pembe oksipital lob ile sarı parietal lob arasındaki sınır, iç yüzdeki parieto-oksipital oluktur.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'lob',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'singulat-girus-sol', metin: 'Singulat girus' },
          { yapi: 'parahipokampal-girus-sol', metin: 'Parahipokampal girus' },
          { yapi: 'korpus-kallozum', metin: 'Korpus kallozum' },
          { yapi: 'ust-frontal-girus-sol', metin: 'Frontal lob' },
          { yapi: 'ust-parietal-lobul-sol', metin: 'Parietal lob' },
          { yapi: 'oksipital-lob-sol', metin: 'Oksipital lob' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `- **Dört büyük işaret:** uzunlamasına yarık (sağ–sol), lateral oluk (temporal lobun üstü), merkezî oluk (frontal–parietal), parieto-oksipital oluk (iç yüzde, parietal–oksipital).
- **Merkezî oluğun iki yanı:** önde presantral girus = birincil hareket kabuğu. Arkada postsantral girus = birincil bedensel duyu kabuğu.
- **Lob sayısı:** dört (frontal, parietal, temporal, oksipital) ya da insula ve limbik lobla birlikte altı. Hangisini saydığın kaynağa bağlıdır.
- **Karşı taraf kuralı:** bir yarımkürenin hareket kabuğu vücudun karşı yarısını yönetir.`,
    },
    {
      tur: 'metin',
      md: `**Kabuğun haritası.** Kabuğun bazı bölgeleri belirli işlerde uzmanlaşmıştır:

- **Birincil hareket kabuğu** frontal lobdaki presantral girustadır (OpenStax 13.2). Bir yandaki hareket alanında hasar olursa vücudun **karşı yanında** felç olur (Gray, 1918).
- **Birincil bedensel duyu kabuğu** parietal lobdaki postsantral girustadır. Dokunma, basınç, ağrı, kaşıntı ve titreşim gibi duyular burada işlenir. Vücudun konum ve hareket duyusu da burada işlenir (OpenStax 13.2).
- **Birincil işitme kabuğu** temporal lobdadır. Yeri enine temporal girustur (Heschl girusu). Bu kıvrım temporal lobun üst yüzünde, lateral oluğun içine uzanır (Dafny, 2020).
- **Birincil görme kabuğu** oksipital lobdadır. Oksipital lob hem birincil hem üst düzey görme kabuğunu içerir (Dafny, 2020).
- **Broca alanı** dilin üretiminden, yani konuşma hareketlerinin denetiminden sorumludur. İnsanların büyük çoğunluğunda yalnızca sol yarımkürededir (OpenStax 13.2).
- Hareket alanlarının önünde **prefrontal bölge** bulunur. Kişiliğin, kısa süreli belleğin ve bilincin temelindeki zihinsel (bilişsel) işlevlere hizmet eder (OpenStax 13.2).

Birincil alanlar kabuğun yalnızca bir bölümüdür. Çevrelerinde üst düzey alanlar bulunur. Örneğin birincil görme kabuğunu çizgi dışı görme alanları sarar (Dragoi, 2020a). Kabukta bilgileri birleştiren **ilişkilendirme (asosiyasyon) alanları** da vardır. Ön ve temporal ilişkilendirme alanları, birincil duyu alanlarından daha geç olgunlaşır (Bethlehem ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: '"Sağ beyinli" ya da "sol beyinli" insan',
      md: 'İki yarımkürenin bazı işlerde özelleştiği doğrudur. Örneğin Broca alanı çoğu insanda yalnızca soldadır (OpenStax 13.2). Ama insanları "sağ beyinli" ya da "sol beyinli" diye ayırmak, bu önemli bilgiyi aşırı basitleştirir (OpenStax 13.2). İki yarımküre korpus kallozumla sürekli haberleşir. Bu bant yaklaşık 200 milyon akson taşır (Spielman ve ark., 2020).',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: '"Limbik lob" terimini Broca getirmiştir. Singulat ve hipokampal girusları bu adla bir araya toplamıştır (Gray, 1918). Konuşmanın üretimiyle ilgili **Broca alanı** da onun adını taşır. Broca, sol alt frontal girusu konuşmanın merkezi olarak tanımlamıştı. Bu yüzden Gray bu kıvrıma "Broca girusu" der (Gray, 1918).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Dört mü, altı mı?** OpenStax kabuğu dört loba ayırır (OpenStax 13.2). Gray ise her yarımküreyi altı loba böler: frontal, parietal, temporal, oksipital, limbik lob ve insula (Gray, 1918). UTHealth ders kitabı da altı lob sayar. Ama insula ile limbik lobun "gerçek lob" olmadığını ekler (Dafny, 2020).

Uluslararası terim listesi Terminologia Anatomica 2 de insula ve limbik lobu ayrı terimler olarak verir. Limbik lob terimi kullanılmazsa, onun parçaları üç lobun iç (medial) bölümleri sayılır: frontal, parietal ve temporal lob (FIPAT, 2019). Hangi sayının kullanıldığı bir tanım meselesidir. Sınavda kaynağın tanımına uy. Loblardan en büyüğü frontal lobdur (Dafny, 2020).

**Gizli lob nasıl gizlenir?** Gray’e göre kabuğun kıvrımlarının çoğu, anne karnındaki 6.–7. aylarda belirir (Gray, 1918). Gelişim takvimi bu dersin Sinir borusundan beyne bölümünde. Lateral (Sylvius) yarık ise gelişim biçimiyle bütün öteki yarıklardan ayrılır. Tabanındaki insulayı, çevresindeki lobların kapakçıkları örter. Bu kapakçıklara operkulum denir (Gray, 1918). Bu yüzden insula ancak kapakçıklar aralanınca ya da kaldırılınca görünür (Gray, 1918; Dafny, 2020). Yarımkürelerin yüzleri ve bütün olukları Anatomi bölümünün Büyük beyin: yarımküreler, yarıklar, kıvrımlar dersinde işlenecek.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Loblar: sınırları, başlıca alanları ve işleri',
      sutunlar: ['Lob', 'Sınırları', 'Başlıca alanlar (Brodmann)', 'Başlıca işleri'],
      satirlar: [
        [
          '**Frontal** (*lobus frontalis*)',
          'Merkezî oluğun önü, lateral oluğun üstü',
          'Birincil hareket kabuğu (4; presantral girus); premotor kabuk ve ek motor alan; Broca alanı (çoğunlukla solda); prefrontal bölge',
          'İstemli hareket; konuşmanın üretimi; kişilik, kısa süreli bellek ve bilincin temelindeki zihinsel işlevler. En büyük lob',
        ],
        [
          '**Parietal** (*lobus parietalis*)',
          'Merkezî oluğun arkası, lateral oluğun üstü; iç yüzde parieto-oksipital oluğun önü',
          'Birincil bedensel duyu kabuğu (3, 1, 2; postsantral girus)',
          'Dokunma, basınç, ağrı, titreşim; vücudun konum ve hareket duyusu',
        ],
        [
          '**Temporal** (*lobus temporalis*)',
          'Lateral oluğun altı',
          'Birincil işitme kabuğu (41, 42; enine temporal girus, Heschl); Wernicke alanının bir bölümü (üst temporal girusun arka ucu)',
          'İşitme; dilin anlaşılması',
        ],
        [
          '**Oksipital** (*lobus occipitalis*)',
          'İç yüzde parieto-oksipital oluğun arkası',
          'Birincil görme kabuğu (17; çizgili kabuk, kalkarin yarığın iki yanı); çevresinde 18 ve 19',
          'Birincil ve üst düzey görme; retinotopik düzen',
        ],
        [
          '**İnsula** (*insula*)',
          'Lateral oluğun tabanında; operkulumlarla örtülü',
          '—',
          'Ağrı algısı ve otonom düzenlemeyle ilişkili olduğuna dair kanıt var',
        ],
        [
          '**Limbik lob** (*lobus limbicus*)',
          'İç yüzde; singulat ve hipokampal girus',
          '—',
          'Bellek ve öğrenme, dürtüyle ilgili davranış, duygu',
        ],
      ],
      not: 'Kaynaklar: OpenStax 13.2; Dafny (2020); Knierim (2020); Dragoi (2020a); Gray (1918); Spielman ve ark. (2020). Wernicke alanının yeri aynı kaynakta bile farklı yazılır. Bu derste üst temporal girusun arka ucunu kapsayan tanım kullanıldı.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Gizli lob: insula',
      aciklama:
        'Sol yarımkürede lateral oluğu örten başlıca kıvrımlar kaldırıldı: alt frontal girus, üst temporal girus ve supramarjinal girus. Altlarındaki mor insula görünür hâle geldi. Kaldırılan kıvrımların yerinde krem renkli beyaz cevher görünür. Gerçek beyinde insulayı örten kapakçıklara operkulum denir. Gray bunları dört parça olarak sayar: orbital, frontal, frontoparietal ve temporal operkulum. Modelde yalnızca başlıca kısımları kaldırıldı.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'sap'],
        renk: 'lob',
        gizle: ['alt-frontal-girus-sol', 'ust-temporal-girus-sol', 'supramarjinal-girus-sol'],
        bakis: 'sol',
        etiketler: [{ yapi: 'insula-sol', metin: 'İnsula' }],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'İşlev haritası: birincil alanlar ve dil',
      aciklama:
        'Sol yarımküreye yandan bakıyoruz. Kırmızı: birincil hareket kabuğunu taşıyan presantral girus (alan 4). Mavi: birincil bedensel duyu kabuğunu taşıyan postsantral girus (3, 1, 2). Sarı: sol alt frontal girus. Broca alanı bu kıvrımın operküler ve triangüler kısımlarındadır (pars opercularis ve pars triangularis). Yeşil: üst temporal girus. Birincil işitme kabuğu (41, 42) bu kıvrımın lateral oluğa bakan üst yüzündedir ve dışarıdan görünmez. Kıvrımın arka ucu Wernicke alanının bir bölümüdür. Pembe: oksipital lob. Birincil görme kabuğu (17) kalkarin yarığın iki yanındadır. Oksipital kutbun çevresinden dolanıp dış yüze de uzanır. Boyanan kıvrımlar işlev alanlarının yaklaşık yerini gösterir, sınırlarını değil.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'lob',
        bakis: 'sol',
        vurgula: ['presantral-girus-sol', 'postsentral-girus-sol', 'alt-frontal-girus-sol', 'ust-temporal-girus-sol', 'oksipital-lob-sol'],
        boya: [
          { secici: ['presantral-girus'], renk: HAREKET },
          { secici: ['postsentral-girus'], renk: DUYU },
          { secici: ['alt-frontal-girus'], renk: BROCA },
          { secici: ['ust-temporal-girus'], renk: ISITME },
          { secici: ['oksipital-lob'], renk: GORME },
        ],
        etiketler: [
          { yapi: 'presantral-girus-sol', metin: 'Hareket kabuğu (4)' },
          { yapi: 'postsentral-girus-sol', metin: 'Bedensel duyu (3, 1, 2)' },
          { yapi: 'alt-frontal-girus-sol', metin: 'Broca alanı' },
          { yapi: 'ust-temporal-girus-sol', metin: 'Üst temporal girus' },
          { yapi: 'oksipital-lob-sol', metin: 'Görme (17, 18, 19)' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beden haritası.** Hareket kabuğunda beden bir harita gibi dizilidir. Buna somatotopik düzen denir. El ve yüz ince, hassas hareketler yapar. Gövde ve bacak ise kaba hareketler yapar. Kabukta el ve yüzün kapladığı yer, gövde ve bacağınkinden orantısız büyüktür (Knierim, 2020). Ayak ve bacak kaslarını yöneten nöronlar presantral girusun iç (medial) duvarındadır (OpenStax 14.3).

Hareket kabuğu yalnızca birincil hareket kabuğundan (Brodmann 4) ibaret değildir. Premotor kabuğu ve ek motor alanı da kapsar (Knierim, 2020). Bu kabuktan kaslara giden yol iki derste işlenecek: Hareket kabuğu ve hareketin planlanması ile İnen hareket yolları.

**Görme ve işitme.** Birincil görme kabuğu (V1, çizgili kabuk) Brodmann 17. alandır. Kalkarin yarığın iki yanındaki kabuğu içerir. Oksipital kutbun çevresinden dolanır ve oksipital lobun arka ucunun dış yüzüne uzanır. Çevresindeki 18 ve 19. alanlar çizgi dışı (ekstrastriat) görme kabuğudur (Dragoi, 2020a). Oksipital kabuk retinotopik düzenlidir. Yani bir nesnenin görme alanındaki yeri ile kabukta temsil edildiği yer yakından ilişkilidir (Spielman ve ark., 2020).

Birincil işitme kabuğu enine temporal girustadır (Heschl). Bu kıvrım, üst temporal girusun lateral oluğa uzanan üst yüzündedir. Brodmann 41 ve 42. alanlara karşılık gelir (Dafny, 2020; OpenStax 13.2).

**Dil.** Broca alanı, alt frontal girusun iki kısmından oluşur: operküler (*pars opercularis*) ve triangüler (*pars triangularis*) kısım (Dafny, 2020). Konuşma üretimini yönetir ve çoğu insanda yalnızca soldadır (OpenStax 13.2). Üst temporal girusun arka ucu parietal kabuğa doğru uzanır. Bu uç, Wernicke alanının bir bölümünü oluşturur. Wernicke alanı kısmen işitsel bilginin işlenmesiyle ilgilidir. Dilin anlaşılmasında önemlidir (Dafny, 2020). Ayrıntılar Frontal lob, Temporal lob ve Dil derslerinde.

**Katmanlar.** Kabuk yüzeyinin %90’ından fazlası altı katmanlı neokortekstir (Lee, 2019). Birincil hareket kabuğu da altı katmanlıdır. Ama birincil duyu alanlarından farklı olarak hücreden zengin IV. (granüler) katmanı yoktur. Bu yüzden ona **agranüler** kabuk denir. En belirgin katmanı, dev Betz hücrelerini taşıyan V. katmandır (Knierim, 2020). Kabuk nöronlarının yaklaşık %80’i piramidal nöronlardır. Bunlar uyarıcıdır ve uzun bağlantılar kurar (Lee, 2019). Katmanların ayrıntısı Beyin kabuğunun yapısı dersinde.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Sınırlar:** uzunlamasına yarık (sağ–sol), lateral oluk (temporal lobun üstü), merkezî oluk (frontal–parietal), parieto-oksipital oluk (iç yüzde parietal–oksipital).
- **Brodmann:** 4 = birincil hareket (presantral girus). 3, 1, 2 = birincil bedensel duyu (postsantral girus). 41, 42 = birincil işitme (Heschl). 17 = birincil görme (çizgili kabuk). 18, 19 = çizgi dışı görme.
- **Dil:** Broca alanı sol alt frontal girusun operküler ve triangüler kısımlarındadır, konuşma üretimini yönetir (Dafny, 2020). Wernicke alanının bir bölümü üst temporal girusun arka ucundadır, dilin anlaşılmasında rol alır.
- **Somatotopi:** el ve yüz geniş yer tutar. Ayak ve bacak presantral girusun iç duvarındadır.
- **Agranüler kabuk:** birincil hareket kabuğu (IV. katman yok, V. katmanda Betz hücreleri).
- **Lob sayısı:** 4 (OpenStax) ya da 6 (Gray: insula ve limbik lob dahil).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Haritadan hastaya',
      md: `- Bir yandaki hareket alanında hasar olursa vücudun **karşı yanında** felç olur (Gray, 1918). Ayak ve bacağın temsili presantral girusun iç duvarındadır (OpenStax 14.3). Bu yüzden yalnızca bu duvarı tutan bir hasar en çok bacağı etkiler.
- Hareket kabuğunda ya da ondan inen yolda bir hasar **üst motor nöron** bulguları verir. **Babinski testi**, kortikospinal yol hasarının klasik testidir (Knierim, 2026). Üst ve alt motor nöron bulgularının karşılaştırmasını bu dersin Belirtiden yere: hasar nerede? bölümünde bulursun.
- Broca alanı çoğu insanda yalnızca soldadır (OpenStax 13.2). Bu yüzden muayenede konuşma üretiminde bir bozukluk görülürse önce sol frontal lob akla gelir.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Yalnızca sağ bacakta güçsüzlük',
      oyku: `61 yaşında bir kadın sabah kalkınca sağ ayağını sürüdüğünü fark ediyor. Muayenede sağ bacakta belirgin güçsüzlük var. Sağ kolun ve yüzün gücü neredeyse normal. Konuşması akıcı ve anlaşılır. Sağ ayak tabanı uyarılınca başparmak yukarı kalkıyor (Babinski bulgusu). Sol tarafında bir yakınma yok.`,
      soru: 'Hasar hangi yarımkürede ve hareket kabuğunun hangi bölümünde olabilir? Hangi bulgular bu yeri destekler?',
      cozum: `**Hangi yarımküre?** Bir yandaki hareket alanının hasarı, karşı yandaki kaslarda felce yol açar (Gray, 1918). Sağ bacaktaki güçsüzlük bu yüzden **sol** yarımküreyi düşündürür.

**Kabuğun neresi?** Hareket kabuğunda beden bir harita gibi dizilidir, yani somatotopik düzenlidir (Knierim, 2020). Ayak ve bacak kaslarını yöneten nöronlar presantral girusun **iç (medial) duvarındadır** (OpenStax 14.3). Kolun ve yüzün gücü korunmuş. Bu, hasarın bacağın temsil edildiği bu iç duvarla sınırlı olabileceğini düşündürür.

**Üst motor nöron mu?** Babinski testi kortikospinal yol hasarının klasik testidir (Knierim, 2026). Bulgunun olması, sorunun üst motor nöronda olduğunu destekler: yani kabukta ya da kabuktan inen yolda.

**Neler etkilenmemiş?** Konuşma akıcı. Bu, Broca alanının etkilenmediğini düşündürür. Broca alanı çoğu insanda soldadır (OpenStax 13.2).

**Sonraki adım:** Hasarın yeri beyin görüntülemesiyle doğrulanmalıdır. Hareket kabuğunun iç duvarını besleyen atardamar, Atardamar alanları ve toplardamarlar dersinde işlenecek. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Brodmann’dan MR atlaslarına',
      md: `Korbinian Brodmann 20. yüzyılın başında kabuğu 52 ayrı bölgeye ayırdı. Bunu yaparken dokunun mikroskop altındaki yapısına baktı (OpenStax 13.2). Bugün kabuk, MR görüntülerinden otomatik olarak bölgelere ayrılıp ölçülür. Kalınlığı MR’dan otomatik ölçen yöntemler buna bir örnektir (Fischl ve Dale, 2000). Beyinciğin yaprakçıklarına kadar inen, çok ayrıntılı yüzey modelleri de öyle (Sereno ve ark., 2020).

Böyle bölgesel ölçümler, kabuğun her yerinin aynı takvimle olgunlaşmadığını gösterdi. 34 kabuk alanında gri cevher hacmi en yüksek değerine yaklaşık 2 ile 10 yaş arasında ulaşır. Birincil duyu alanları en erken zirve yapar. Ön ve temporal ilişkilendirme alanları daha geç zirve yapar (Bethlehem ve ark., 2022). Kalınlıkta da birçok bölge çocuklukta zirve yapar ve sonra incelir. Ama entorinal, temporopolar ve ön singulat kabuk bu genel örüntünün dışında kalır (Frangou ve ark., 2022).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kaynaklar ne diyor, hangisi eskidi?',
      md: `**Kortikospinal lifler nereden gelir?** Kortikospinal yol, kabuktan omuriliğe inen hareket yoludur. Knierim’e göre liflerinin yalnızca yaklaşık %30’u birincil hareket kabuğundan gelir. Bunlar oradaki projeksiyon nöronlarının lifleridir (Betz hücreleri dahil). Yaklaşık %30’u premotor kabuk ve ek motor alandan, yaklaşık %30’u bedensel duyu kabuğundan gelir. Yaklaşık %10’u ise arka parietal kabuktan gelir (Knierim, 2020). Bazı ders kitapları yolu yalnızca Betz hücreleriyle anlatır (OpenStax 14.3). Bu anlatım bu yüzden eksiktir.

**Kaynaklar nerede ayrılıyor?**
- **Görme kabuğu:** OpenStax birincil görme algısından 17 ve 18. alanları sorumlu tutar (OpenStax 13.2). UTHealth’e göre ise birincil görme kabuğu yalnızca 17. alandır. 18 ve 19 çizgi dışı alanlardır (Dragoi, 2020a).
- **Wernicke alanı:** UTHealth’in aynı bölümü onu iki farklı yerde tanımlar. Bir yerde alt parietal girus der, başka bir yerde üst temporal girusun arka ucu der (Dafny, 2020). Bu derste ikinci tanım kullanıldı.
- **Gray’in dönemi:** Gray hareket alanına presantral girusun yanında frontal girusları ve parasantral lobülü de katar. Cajal’a dayanarak kabukta dört hücre katmanı sayar (Gray, 1918). Bugün birincil hareket kabuğu Brodmann 4. alan olarak tanımlanır. Premotor kabuk ve ek motor alan ondan ayrı tutulur. Neokorteks de altı katmanlı anlatılır (Knierim, 2020). Gray tat alanını da yalnızca "büyük olasılıkla" unkus ve hipokampal girusa bağlar (Gray, 1918). Bu, kendi döneminde bile kesin olmayan bir görüştü. Tat kabuğunun bugünkü yeri Tat ve koku dersinde güncel kaynaklarla işlenecek.
- **Kabuğun yüzeyi:** "Açılınca 1 m²" bilgisi ölçümlerle uyuşmaz. Ölçümler ve MR’a dayanan tahminler 0,16–0,2 m² verir (bkz. Sayılarla sinir sistemi bölümü).`,
    },
  ],
};
