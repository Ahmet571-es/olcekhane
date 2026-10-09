import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from '../kafatasi/bolum-1-genel';

/** 1. bölüm: kemiklerin dili (işaret türleri), dersin haritası, terimlerin kaynağı ve kemikleşmenin iki yolu. */
export const kemikDili: DersBolumu = {
  id: 'kemik-dili',
  baslik: 'Önce dil: bir kemik nasıl okunur?',
  bloklar: [
    {
      tur: 'metin',
      md: `Genel bakış dersinde kafatasının 22 kemiğini tanıdık: beyni saran 8 kemik ve yüzü yapan 14 kemik. Bu derste her kemiği **tek tek** ele alıyoruz: nerede durduğunu, hangi parçalardan oluştuğunu, üzerindeki çıkıntıları, delikleri ve çukurları, hangi kemiklerle birleştiğini, nasıl kemikleştiğini ve hekimlerin, cerrahların bu kemikte nelere dikkat ettiğini.

Bir kemiği okumak bir haritayı okumaya benzer. Haritada dağlar, vadiler ve geçitler vardır; kemikte de **çıkıntılar**, **çukurlar** ve **delikler** vardır. Bu işaretlerin her birinin bir adı ve çoğu zaman bir görevi vardır: kirişler ve bağlar çıkıntılara tutunur, damarlar ve sinirler deliklerden geçer, iki kemik eklem yüzlerinde buluşur (OpenStax 6.3). Bu yüzden işaretin adını öğrenmek, orada ne olduğunu da öğrenmek demektir.`,
    },
    {
      tur: 'animasyon',
      ad: 'kemik-isaretleri',
      baslik: 'Kemik işaretlerinin dili',
      aciklama:
        'Üç sınıf: eklem yüzleri, çıkıntılar, delikler ve çukurlar. Bir terime dokun: şematik çizimini, tanımını ve kafatasındaki örneğini görürsün. Örneklerin çoğu bu dersin üç boyutlu sahnelerinde işaretli.',
    },
    {
      tur: 'metin',
      md: `Kemik yüzeyindeki işaretler üç büyük sınıfa ayrılır (OpenStax 6.3):

- **Eklem yüzleri:** iki kemiğin buluştuğu yerler. Birbirine uyacak biçimdedir; biri yuvarlaksa öteki çoğu zaman çanak gibidir. Örnek: art kafa kemiğinin **kondilleri** (*condyli occipitales*).
- **Çıkıntılar:** yüzeyden yükselen bölümler. Kirişler ve bağlar bunlara tutunur; çıkıntının büyüklüğü ve biçimi oraya binen kuvvetin bir göstergesidir. Örnek: kulağın arkasındaki **mastoid çıkıntı** (*processus mastoideus*).
- **Delikler ve çukurlar:** kemikteki açıklıklar ve oluklar. Damarlar ve sinirler buralardan geçer; deliğin büyüklüğü ve biçimi içinden geçen yapının büyüklüğünü yansıtır. Örnek: kafatasının en büyük deliği **foramen magnum**.

Türkçe anatomi dilinde bu terimlerin çoğu Latince adlarıyla da kullanılır: delik (*foramen*), çukur (*fossa*), oluk (*sulcus*), kanal (*canalis*), yarık (*fissura*), yol (*meatus*), çıkıntı (*processus*), diken (*spina*), sırt (*crista*). Bu derste her yapının Türkçe adını ve yanında italik olarak güncel Latince adını göreceksin.`,
    },
    {
      tur: 'sahne',
      baslik: 'İşaretleri kafatasında bul',
      aciklama:
        'Kafatasına soldan bakıyoruz. Koyu merkezli beyaz halkalar kemik işaretleridir: dış kulak yolu bir “yol” (meatus), mastoid ve stiloid birer “çıkıntı”, çene deliği bir “delik”, alt çene açısı bir “açı”, pterion ise dört kemiğin buluştuğu köşedir. Kafatasını döndürünce önü kapanan noktanın etiketi gizlenir; o noktayı görmek için başka yönden bak.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'sol',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['alt-cene-kemigi'], renk: KEMIK_RENGI.altCene },
          { secici: ['ust-cene-kemigi'], renk: KEMIK_RENGI.ustCene },
        ],
        noktalar: [
          { nokta: 'dis-kulak-yolu-sol' },
          { nokta: 'mastoid-cikinti-sol' },
          { nokta: 'stiloid-cikinti-sol' },
          { nokta: 'cene-deligi-sol', metin: 'Çene deliği' },
          { nokta: 'alt-cene-acisi-sol', metin: 'Alt çene açısı' },
          { nokta: 'yan-kafa-kama-kosesi-sol', metin: 'Pterion' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Üç sınıf:** eklem yüzü (kondil, baş), çıkıntı (çıkıntı, diken, tümsek, sırt, çizgi), delik ve çukur (delik, kanal, yarık, yol, çukur, oluk, sinüs).\n\n**Kural:** çıkıntıya bir şey **tutunur**, delikten bir şey **geçer**, çukura bir şey **oturur**.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Modelin sınırları',
      md: 'Üç boyutlu sahnelerdeki kemikler gerçek bir insan taramasından hazırlanmış, ama telefonda da hızlı açılsın diye **çok sadeleştirilmiş** modellerdir. Noktalar modelin yüzeyinde ölçülerek yerleştirildi. Bazı küçük yapılar sadeleştirmede kaybolmuştur: örneğin foramen spinosum, göz üstü deliği, mastoid delik, pterigoid kanal ve büyük damak deliği modelde yoktur; optik kanal ile üst göz çukuru yarığı arasındaki ince kemik köprü kaybolmuştur; sinüs boşlukları da modelde yoktur, kemiklerin içi dolu çizilmiştir. Bu yapıları metinde ve tablolarda anlatıyoruz, sahnede işaretli gibi göstermiyoruz.',
    },
    {
      tur: 'tablo',
      baslik: 'Bu derste kemikler',
      sutunlar: ['Kemik', 'Sayı', 'Nerede?', 'Bölüm'],
      satirlar: [
        ['Alın kemiği (frontal)', 'Tek', 'Alın ve göz çukurlarının tavanı', 'Alın kemiği'],
        ['Yan kafa kemiği (parietal)', 'Çift', 'Kafatasının tavanı ve yan duvarları', 'Yan kafa kemikleri'],
        ['Şakak kemiği (temporal)', 'Çift', 'Yan duvarın alt kısmı ve kafa tabanı; kulak', 'Şakak kemiği'],
        ['Art kafa kemiği (oksipital)', 'Tek', 'Kafatasının arkası ve tabanı', 'Art kafa kemiği'],
        ['Kama kemiği (sfenoid)', 'Tek', 'Kafa tabanının ortası', 'Kama kemiği'],
        ['Kalbur kemiği (etmoid)', 'Tek', 'Burun boşluğunun tavanı, göz çukurlarının arası', 'Kalbur kemiği'],
        [
          'Üst çene, elmacık, burun, gözyaşı, damak kemikleri ve alt burun kavkası',
          'Her biri çift',
          'Yüzün orta katı, sert damak, göz çukuru ve burun duvarları',
          'Yüz kemikleri',
        ],
        ['Sapan kemiği (vomer)', 'Tek', 'Burun bölmesinin arka-alt kısmı', 'Yüz kemikleri'],
        ['Alt çene (mandibula)', 'Tek', 'Çene; kafatasının hareket eden tek kemiği', 'Alt çene ve dil kemiği'],
        ['Dil kemiği (hiyoid)', 'Tek', 'Boynun üst kısmı; kafatasına sayılmaz', 'Alt çene ve dil kemiği'],
      ],
      not: 'Kemiklerin kafatası içindeki yerleri ve dikişler genel bakış dersinde; kafatasına beş yönden bakış, delikler ve kafa tabanı çukurları, kafatası–boyun bileşkesi, gelişim ve travma ünitenin sonraki derslerinde.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Terimler nereden geliyor?** Bu derste klasik anlatımın temeli olarak Henry Gray’in *Anatomy of the Human Body* kitabının 1918 baskısını kullanıyoruz; güncel Latince adlar ise *Terminologia Anatomica*’nın ikinci baskısından (TA2) ve gerektiğinde 1998 tarihli ilk baskısından (TA98) alınmıştır (Gray, 1918; FIPAT, 2019; FCAT, 1998). Yüz yıl içinde birçok ad değişti: Gray’in “condyloid” dediği yapı bugün *condylaris*, “semilunar ganglion” dediği yapı *ganglion trigeminale* adını taşır. Eski ad farklıysa metinde “Gray’in kitabında eski adıyla” diye belirtiyoruz.

Sınıflama da her zaman aynı olmadı. Gray kafatasını 8 beyin kutusu ve 14 yüz kemiği olarak sayar, ama o dönemin Basel adlandırmasının (BNA) burun kapsülüyle birlikte gelişen alt burun kavkası, gözyaşı kemiği, burun kemiği ve sapan kemiğini yüz kemiği değil **kafatası (kranyal) kemiği** saydığını not eder (Gray, 1918). OpenStax gibi güncel ders kitapları da bu dört kemiği yüz kemikleri arasında sayar (OpenStax 7.2); bu dersin sayımı da buna göredir.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**İki kemikleşme yolu.** Kemik iki yolla oluşur. **Zar içi (intramembranöz) kemikleşmede** bağ dokusu hücreleri kümelenir, kemikleşme merkezleri oluşur ve kemik doğrudan bu zarın içinde yapılır; yüzün yassı kemikleri, kafatası kemiklerinin çoğu ve köprücük kemikleri böyle oluşur. **Kıkırdak içi (endokondral) kemikleşme** önce bir kıkırdak modelinin kurulmasını gerektirir, daha uzun sürer; kafa tabanının kemikleri ve uzun kemikler böyle oluşur (OpenStax 6.4). Doğumda kafatası henüz tam kemikleşmemiştir ve dikişleri açıktır (OpenStax 6.4); Gray’e göre art kafa, şakak, kama, alın kemikleri ve alt çene doğumda birden çok parçadan oluşur (Gray, 1918). Her kemiğin kemikleşme merkezlerini ve kaynaşma zamanlarını kendi bölümünde veriyoruz.`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Kaynaklar bu konuda ayrışıyor',
      md: 'OpenStax 6.4 yüzün yassı kemiklerini zar içi kemikleşmeyle oluşan grupta sayar; aynı kitabın 7.5 bölümü ise yüz kemiklerini kıkırdak modeli üzerinden gelişen grupta anar. Gray 1918 kemik kemik daha ayrıntılı bilgi verir: üst çene, damak kemiği, sapan kemiği ve alt çene zarda kemikleşir; alt burun kavkası ise burun kapsülünün kıkırdak duvarında kemikleşir (Gray, 1918; OpenStax 6.4; OpenStax 7.5). Bu derste kemik kemik Gray’in ayrıntısını izliyoruz.',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: '- **Delik mi, kanal mı, yol mu?** Delik (*foramen*) kemiği geçer; kanal (*canalis*) kemiğin içinde uzunca bir tüneldir; yol (*meatus*) bir kanala açılan ağızdır: dış ve iç kulak yolu.\n- **Kondil ve baş:** ikisi de yuvarlak eklem yüzüdür; alt çenenin eklem yapan ucu “kondil başı” (*caput mandibulae*) diye anılır.\n- **Tek mi, çift mi?** Beyin kutusunda yan kafa ve şakak kemikleri çifttir; alın, art kafa, kama ve kalbur tektir.',
    },
  ],
};
