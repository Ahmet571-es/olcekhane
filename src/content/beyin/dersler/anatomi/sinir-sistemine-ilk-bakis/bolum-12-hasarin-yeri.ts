import type { DersBolumu } from '../../../types';

/** Hasar düzeylerinin renkleri (yalnızca tanıtır, anlam taşımaz). */
const KABUK_DUZEYI = '#5b84f2';
const KABUK_ALTI = '#f2a65a';
const BEYIN_SAPI = '#a98cf6';
const BEYINCIK = '#36c48f';

/** 12. bölüm: belirtiden yere; lokalizasyonun mantığı, üst ve alt motor nöron, sinir sistemi hastalıklarının yükü, beyin ölümü. */
export const hasarinYeri: DersBolumu = {
  id: 'hasar-nerede',
  baslik: 'Belirtiden yere: hasar nerede?',
  bloklar: [
    {
      tur: 'metin',
      md: `Bir nörolog hastasını dinler ve muayene eder. Bunu yaparken iki soruyu sırayla sorar: **Hasar nerede?** ve **Bu ne olabilir?** İkinci soru, ancak birincinin cevabıyla anlam kazanır. Sinir sisteminin farklı düzeylerindeki hasarlar farklı belirtiler verir. Hekim bu farklara bakarak hasarın sistemin neresinde olduğunu çıkarır (Knierim, 2026). Bu derste öğrendiğin harita, klinikte her gün bu yüzden kullanılır.

Yer bulmanın birkaç basit ipucu vardır:

- **Hangi taraf?** Hareket komutunu taşıyan yola kortikospinal yol denir. Bu yol büyük ölçüde karşı tarafa geçer (çaprazlaşır). Sağ yarımkürenin hareket kabuğu vücudun sol yarısındaki kasları yönetir. Sol yarımküreninki de sağ yarısındakileri yönetir (OpenStax 14.3).
- **Duyu da etkilenmiş mi?** Bazı hastalıklar yalnızca hareketi bozar. Bunlar üç yerden birini tutar: omurilikteki hareket nöronlarını (ön boynuz hücreleri), sinir ile kas arasındaki bağlantıyı ya da kasın kendisini. Bu hastalıklarda duyu kaybı olmaz (Quak ve ark., 2026).
- **Güçsüzlük nerede?** Bazı zorluklar gövdeye yakın (**proksimal**) kasların güçsüzlüğünü düşündürür. Sandalyeden kalkmak ya da çamaşırı başının üstüne kaldırmak bunlara örnektir. Kavanoz açmakta zorlanmak ya da ayağın takılması ise uçtaki (**distal**) kasların güçsüzlüğünü düşündürür (Quak ve ark., 2026).
- **Refleksler nasıl?** Beyinden inen yollar hasar görürse refleksler artar. Omurilikten kasa giden son nöron hasar görürse refleksler azalır ya da kaybolur (Knierim, 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Hareket komutunun beyindeki yolu',
      aciklama:
        'Beyne önden, soldan ve yukarıdan bakıyoruz. Büyük beynin geri kalanı soluk bırakıldı. Mavi, sol yarımkürenin hareket kabuğudur (presantral girus). Kortikospinal yolun üst motor nöronlarının bir bölümü buradadır; ötekiler başka kabuk alanlarındadır. Turuncu, iç kapsüldür: hareket lifleri kabuğun altından buradan geçer. Mor, beyin sapıdır (orta beyin, pons ve omurilik soğanı); lifler buradan aşağı iner. Orta beyinde lifler öndeki beyin ayağından (*crus cerebri*) geçer (OpenStax 14.3; FIPAT, 2019). Yeşil, arka çukurdaki beyinciktir. Modelde omurilik ve sinirler yoktur. Yolun omurilikten kasa kadar olan basamakları aşağıdaki metinde ve tablolarda anlatılır.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        vurgula: ['presantral-girus-sol', 'ic-kapsul-sol', 'bolge:beyin-sapi', 'beyincik'],
        boya: [
          { secici: ['presantral-girus-sol'], renk: KABUK_DUZEYI },
          { secici: ['ic-kapsul-sol'], renk: KABUK_ALTI },
          { secici: ['bolge:beyin-sapi'], renk: BEYIN_SAPI },
          { secici: ['beyincik'], renk: BEYINCIK },
        ],
        bakis: 'egik',
        etiketler: [
          { yapi: 'presantral-girus-sol', metin: 'Hareket kabuğu' },
          { yapi: 'ic-kapsul-sol', metin: 'İç kapsül' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Beyin ayağı' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: `Kortikospinal yol iki basamaklıdır. İlk basamak **üst motor nörondur**; gövdesi beyin kabuğundadır. Aksonu, omurilikteki **alt motor nörona** kadar iner. Alt motor nöronun aksonu da kasa ulaşır. Kabuktan beyin sapındaki hareket çekirdeklerine inen benzer bir yol daha vardır: kortikobulber yol (OpenStax 14.3). OpenStax, üst motor nöronun gövdesini alın lobundaki birincil hareket kabuğuna yerleştirir (OpenStax 14.3). Ama kortikospinal liflerin yalnızca yaklaşık %30’u buradan gelir. Geri kalanı başka kabuk alanlarından çıkar: hareket öncesi (premotor) kabuk, ek motor alan, bedensel duyu kabuğu ve arka parietal kabuk (Knierim, 2020). Bu iki basamağın hasarı, bazı bakımlardan birbirinin tersi belirtiler verir (Knierim, 2026):

- **Alt motor nöron** zarar görürse kas zamanla erir (**atrofi**). Çünkü kas, onu besleyen (trofik) etkenleri sağlayan nöronunu kaybetmiştir. Hasarlı nöronlar kendiliğinden ateşleyebilir. Bu da kasta gözle görülen seğirmelere (**fasikülasyon**) yol açar. Germe refleksi zayıflar ya da kaybolur (Knierim, 2026). Kas gevşek kalır: **gevşek (flask) felç** (OpenStax 16.4).
- **Üst motor nöron** zarar görürse alt motor nöron yerinde kalır. Bu yüzden kas pek erimez ve seğirme olmaz. Ama inen yollar normalde refleksleri frenler. Bu fren kalkınca germe refleksi abartılı olur. Hekim kası pasif olarak, yani hastanın yardımı olmadan oynatınca bir dirençle karşılaşır. Hareket hızlandıkça bu direnç de artar (**spastisite**). Ayak tabanı çizilince başparmak yukarı kalkar, öteki parmaklar yelpaze gibi açılır: **Babinski belirtisi** (Knierim, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Önce yer, sonra neden.** Hasarın yeri, belirtilerin biçimini belirler.\n\n**Düzeyler, yukarıdan aşağı:** beyin kabuğu ve kabuk altı → beyin sapı ve beyincik → omurilik → ön boynuz hücresi → kök ve sinir ağı → çevresel sinir → sinir-kas kavşağı → kas.\n\n**Üst motor nöron hasarı:** refleks artışı, spastisite, Babinski. Kas erimesi (atrofi) ve seğirme yoktur.\n\n**Alt motor nöron hasarı:** refleks azalması, gevşek felç, kas erimesi (atrofi), seğirme (fasikülasyon).\n\n**Duyu kaybı olmayan güçsüzlük nerede olur?** Ön boynuz hücresinde, sinir-kas kavşağında ya da kasta.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Bir bebeğin ayak tabanını çizdiğini düşün. Başparmağı yukarı kalkıyor, öteki parmakları yelpaze gibi açılıyor. Bu bir hastalık belirtisi değildir. Pozitif Babinski belirtisi yaşamın ilk iki yılında normaldir (Knierim, 2026). Yetişkinde ise aynı yanıt klasik bir işarettir. Beyinden omuriliğe inen kortikospinal yolun hasarını gösterir (Knierim, 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Ani başlayan kayıp beklemez',
      md: 'Nöronlar oksijensizliğe çok duyarlıdır. Oksijensiz kalınca 1–2 dakika içinde bozulmaya başlarlar. Birkaç saat içinde kalıcı hasar (hücre ölümü) gelişebilir (OpenStax 16.1). **FAST** kısaltması neye bakılacağını hatırlatır: yüz, kol, konuşma, zaman. Birdenbire başlayan nörolojik işlev kayıplarında işe yarar (OpenStax 13.3). Bu bölümdeki bilgiler eğitim amaçlıdır. Belirtisi olan biri tanı için hemen bir hekime başvurmalıdır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Hasarın yerini bulmak.** Hekimler buna lokalizasyon der. Klinik nöroloji eğitimi için hazırlanmış temel bir müfredat vardır. Bu müfredat, öğrencinin birbirinden ayırması gereken düzeyleri sayar:

- beyin kabuğu ve kabuk altı yapılar,
- arka çukur (beyin sapı ve beyincik),
- omurilik,
- ön boynuz hücresi,
- sinir kökü ve sinir ağı (pleksus),
- çevresel sinir: tek bir sinir (mononöropati), birçok sinir birden (polinöropati) ya da dağınık tek tek sinirler (mononöropati multipleks),
- sinir-kas kavşağı,
- kas (Safdieh ve ark., 2019).

Aynı müfredata göre ayırıcı tanı, yani hastalığın ne olabileceğine dair olasılıklar listesi, birkaç şeye dayanır. Bunlar lezyonun yeri, belirtilerin zaman içindeki seyri, ilgili öykü ve epidemiyolojik özelliklerdir. Bazı eğitimciler özellikle bir ayrımı öne çıkarır: **odaksal** (tek bir yerde) ve **yaygın** hastalık süreçleri (Safdieh ve ark., 2019).

Bu düzeyleri bir merdiven gibi düşünebilirsin. Merdivenin her basamağı kendine özgü bir bulgu birleşimi verir. Yeri bulmak için tek bir bulgu yetmez. Asıl ipucu, bulguların birlikte oluşturduğu desendir. Hangi taraf? Hangi kaslar? Duyu var mı? Refleksler artmış mı, azalmış mı?`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Yer bulma merdiveni: düzeyler ve ipuçları',
      sutunlar: ['Düzey', 'Düşündüren bulgular (örnekler)', 'Kaynak'],
      satirlar: [
        [
          'Beyin kabuğu ve kabuk altı',
          'Karşı tarafta vücudun yarısında güçsüzlük (hemiparezi); ön dolaşım infarktlarında kabuk bulguları olabilir ya da olmayabilir',
          'OpenStax 14.3; Quak ve ark., 2026',
        ],
        [
          'Arka çukur (beyin sapı ve beyincik)',
          'Kafa siniri bulgularıyla birlikte karşı tarafta hemiparezi: çapraz hemiparezi',
          'Quak ve ark., 2026',
        ],
        [
          'Omurilik',
          'Duyu seviyesi; sfinkter bozukluğu (gevşek anal tonus); iki bacakta güçsüzlük (akut evrede gevşek). Boyun düzeyinde dört kol-bacak, servikal genişlemenin altında yalnız bacaklar',
          'Quak ve ark., 2026; Knierim, 2026',
        ],
        [
          'Ön boynuz hücresi',
          'Duyu kaybı olmadan güçsüzlük (ör. çocuk felci, poliomiyelit); ALS’de dilde ve kol-bacaklarda seğirme (fasikülasyon), üst ve alt motor nöron bulguları bir arada',
          'Quak ve ark., 2026',
        ],
        [
          'Kök ve sinir ağı',
          'Sınırlı bir kas grubunda güçsüzlük; kol ağının üst bölümünde Erb, alt bölümünde Klumpke felci',
          'Knierim, 2026; NINDS, t.y.',
        ],
        [
          'Çevresel sinir',
          'Diyabetik polinöropati: en uzun sinirlerden başlayan (uzunluğa bağımlı) duyu kaybı, refleks azalması. Vaskülitik nöropati: asimetrik mononöropati multipleks. Guillain–Barré sendromu: simetrik güçsüzlük, refleks kaybı, yukarı çıkan duyu kaybı',
          'Quak ve ark., 2026',
        ],
        [
          'Sinir-kas kavşağı',
          'Göz (çift görme, göz kapağı düşüklüğü yani pitoz), yutma-konuşma (bulber), boyun, solunum ve gövdeye yakın kaslarda güçsüzlük; yorulabilirlik; duyu kaybı yok',
          'Quak ve ark., 2026',
        ],
        ['Kas', 'Gövdeye yakın (proksimal), genellikle iki yanda eşit güçsüzlük; nesnel duyu kaybı yok', 'Quak ve ark., 2026'],
      ],
      not: 'Düzeyler Safdieh ve ark. (2019) müfredatındaki sırayla verildi. Bulgular yalnızca örnektir. Aynı düzeydeki farklı hastalıklar farklı tablolar verebilir.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Arka çukur: beyin sapı ve beyincik',
      aciklama:
        'Beyin sapı ve beyincik tek başına, soldan görülüyor. Ön taraf solda; renkler her yapıyı ayrı tanıtır. Beyin sapı; orta beyin, pons ve omurilik soğanından oluşur. Burada iki tür yapı bir aradadır. Biri alt motor nöronlardır, örneğin kafa sinirlerinin hareket çekirdekleri. Öteki, omuriliğe inen üst motor nöron lifleridir. Bu yüzden buradaki küçük bir hasar iki bulgu birden verebilir: bir yanda kafa siniri bulgusu, öteki yanda kol ve bacak güçsüzlüğü. Kafa sinirleri ve omurilik modelde yoktur.',
      sahne: {
        katmanlar: ['sap'],
        renk: 'yapi',
        bakis: 'sol',
        etiketler: [
          { yapi: 'orta-beyin', metin: 'Orta beyin' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Beyin ayağı' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
          { yapi: 'beyincik', metin: 'Beyincik' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Üst motor nöron hangi nörondur?** Kaynaklar bu adı farklı genişlikte kullanır. OpenStax, yukarıda anlattığımız gibi, kortikospinal yolu iki nöronlu anlatır. Ona göre üst motor nöron kabuktaki nörondur (OpenStax 14.3). Knierim daha geniş bir tanım kullanır. Ona göre alt motor nöronlar yalnızca omurilik ve beyin sapındaki alfa motor nöronlardır. Alfa motor nöron, kas liflerini doğrudan uyaran nörondur. Hiyerarşide bunların üstündeki bütün hareket sistemi nöronları ise üst motor nörondur (Knierim, 2026). Gray’in klinik ayrımı da buna benzer. Üst motor nöronlar, kabuktaki hareket hücreleri ve bunların lifleridir; lifler hareket sinirlerinin çekirdeklerine kadar iner. Alt motor nöronlar ise kafa sinirlerinin hareket çekirdeklerindeki ya da omuriliğin ön kolonundaki hücrelerdir (Gray, 1918). Klinikteki **üst motor nöron sendromu** geniş tanıma dayanır. Alfa motor nöronların üstündeki herhangi bir düzeyin hasarı bu sendromu verir; yan devreler bunun dışındadır (Knierim, 2026).

**Çaprazlaşma ve istisnası.** Kortikospinal aksonların yaklaşık %90’ı piramidal çaprazlaşmada (*decussatio pyramidum*) karşı tarafa geçer. Karşıya geçen aksonlar yan kortikospinal yolu yapar. Yan yol, uçtaki (distal) kasları denetler. Ön kortikospinal yol ise gövdeye yakın (proksimal) kasları denetler (Knierim, t.y.). Gövde hareketleri iki yanı birlikte ilgilendirir. Bu yüzden ön kortikospinal yol tümüyle karşı taraflı değildir (OpenStax 14.3). Bir yandaki hareket alanında lezyon varsa karşı yandaki kaslar felç olur. Bunu açıklayan da bu çaprazlaşmadır (Gray, 1918).

**Başlıca test: germe refleksi.** Bir hareket bozukluğu üst motor nörondan mı, alt motor nörondan mı geliyor? Bunu gösteren başlıca klinik test germe refleksidir (Knierim, 2026). OpenStax’e göre şu bulgular üst motor nöron lezyonunu düşündürür:

- güçsüzlük,
- güçlü derin tendon refleksleri,
- hareket denetiminde azalma ya da yavaşlık,
- pronatör kayma (öne uzatılan kolun içe dönüp aşağı kayması),
- pozitif Babinski,
- spastisite,
- çakı bıçağı yanıtı (direncin birden çözülmesi).

Alt motor nöron lezyonunun öteki işaretleri, kasın sinirsiz kalmasından doğar. Bunlar fibrilasyon, fasikülasyon ve azalmış ya da kaybolmuş reflekslerdir (OpenStax 16.4). Fibrilasyon, tek tek kas liflerinin kendiliğinden kasılmasıdır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üst motor nöron mu, alt motor nöron mu?',
      sutunlar: ['Bulgu', 'Üst motor nöron hasarı', 'Alt motor nöron hasarı'],
      satirlar: [
        ['Güç', 'Azalır', 'Azalır; sınırlı hasarda (omurilikte ya da ön kökte) yalnızca sınırlı bir kas grubunda'],
        [
          'Kas erimesi (atrofi)',
          'Nadir: alfa motor nöronlar kası beslemeyi (trofik destek) sürdürür',
          'Olur: kas, besleyici (trofik) etkenlerden yoksun kalır',
        ],
        ['Fasikülasyon, fibrilasyon', 'Fasikülasyon yok', 'Olur'],
        ['Germe (derin tendon) refleksi', 'Abartılı (hiperrefleksi)', 'Zayıf ya da yok'],
        [
          'Kas gerginliği (tonus)',
          'Spastisite: pasif harekete, hız arttıkça artan direnç; çakı bıçağı yanıtı',
          'Gevşek (flask) felç: tonus tümüyle ya da kısmen kaybolur',
        ],
        ['Ayak tabanı yanıtı', 'Başparmak yukarı kalkar (ekstansör yanıt): pozitif Babinski (ilk 2 yaşta normal)', '—'],
        ['Diğer', 'Pronatör kayma; hareket denetiminde azalma ya da yavaşlık', '—'],
      ],
      not: 'Kaynaklar: Knierim (2026); OpenStax 16.4. Hasarın ilk (akut) döneminde güçsüz kol ya da bacakta üst motor nöron bulguları henüz belirgin olmayabilir (Quak ve ark., 2026). Kas katılığı (rijidite) ise spastisiteden farklıdır: pasif hareketin hızına bağlı değildir (Knierim, 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Yer bulma (lokalizasyon) düzeyleri: kabuk ve kabuk altı, arka çukur, omurilik, ön boynuz hücresi, kök ve ağ, çevresel sinir (mono-, poli-, multipleks), sinir-kas kavşağı, kas (Safdieh ve ark., 2019).
- Hareket bozukluğu üst motor nörondan mı, alt motor nörondan mı? Bunu gösteren başlıca klinik test germe refleksidir (Knierim, 2026).
- **Üst motor nöron:** hiperrefleksi, hıza bağlı spastisite, Babinski; atrofi nadir, fasikülasyon yok. **Alt motor nöron:** hipo- ya da arefleksi, gevşek felç, atrofi, fasikülasyon, fibrilasyon (Knierim, 2026; OpenStax 16.4).
- **Duyu kaybı olmayan güçsüzlük:** ön boynuz hücresi, sinir-kas kavşağı, kas (Quak ve ark., 2026).
- **Çapraz hemiparezi** (kafa siniri bulgusu + karşı tarafta hemiparezi) → beyin sapı (Quak ve ark., 2026).
- Boyun düzeyinde omurilik hasarı → kuadripleji; servikal genişlemenin altı → parapleji (Knierim, 2026).
- Kortikospinal aksonların ~%90’ı piramidal çaprazlaşmada karşıya geçer (Knierim, t.y.). Pozitif Babinski ilk 2 yaşta normaldir (Knierim, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kol ağı: Erb ve Klumpke felci',
      md: 'Kol sinir ağı (*plexus brachialis*) bir sinir ağıdır. Omuriliğin üst bölümlerinden omuza, kola ve ele sinyal taşır. Ağın üst bölümü hasar görürse uyuşukluk ve felç olur; buna **Erb felci** denir. Alt bölüm hasar görürse el bileğinde ve elde duyu kaybıyla birlikte felç olur; buna **Klumpke felci** denir (NINDS, t.y.). Yani hasarın ağdaki yeri, kolun hangi kısmının etkileneceğini belirler.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Akşamları düşen göz kapağı',
      oyku: `34 yaşında bir kadın iki aydır süren yakınmalarını anlatıyor. Akşamüstleri çift görüyor ve sağ göz kapağı düşüyor. Merdiven çıkmakta zorlanıyor. Saçını tararken kollarını kaldırmakta da zorlanıyor. Sabahları daha iyi hissediyor. Muayenede duyu normal. Bir süre yukarı bakması istenince sağ göz kapağı belirgin biçimde düşüyor. Göz kapağının üstüne buz torbası konunca düşüklük azalıyor.`,
      soru: 'Hasar, yer bulma merdiveninin hangi basamağındadır? Hangi bulgular bunu destekler?',
      cozum: `**Yer: sinir-kas kavşağı.** Tablo **myastenia gravis** ile uyumludur. Bu hastalık tipik olarak göz kaslarını tutar: çift görme ve göz kapağı düşüklüğü (pitoz) olur. Yutma ve konuşma kaslarını (bulber kaslar) da tutar. Boyun ve solunum kasları ile kol-bacakların gövdeye yakın (proksimal) kasları da tutulur. **Duyu kaybı yapmaz.** Yorulabilirlik, yani kasın kullandıkça güçsüzleşmesi, muayenede ortaya çıkarılabilir. Bu hem göz kapağında hem gövdeye yakın kaslarda sınanır. Pitoz soğukla düzelir. Bu yüzden göz kapağına buz torbası konarak sınanabilir (Quak ve ark., 2026).

**Neden kas değil?** Kas hastalığı da benzer bir güçsüzlük yapar: gövdeye yakın, genellikle iki yanda eşit ve nesnel duyu kaybı olmadan (Quak ve ark., 2026). Bu hastada ise üç bulgu kavşağı düşündürür: göz kaslarının tutulması, yorulabilirliğin muayenede gösterilmesi ve soğukla düzelen pitoz (Quak ve ark., 2026). Myastenide solunum kasları da tutulabilir (Quak ve ark., 2026). Bu yüzden nefes darlığı yakınması ciddiye alınır. Sinir-kas kavşağını Hücreden Sinyale bölümünün **Sinir-kas kavşağı** dersinde ayrıntılı göreceğiz. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Seğiren dil, canlı refleksler',
      oyku: `58 yaşında bir erkek, altı aydır sağ elinde güçsüzlük olduğunu söylüyor. Düğme iliklemekte zorlanıyor. Son haftalarda konuşması da bozulmuş. Muayenede sağ el kaslarında belirgin erime var. Dilde ve iki kolda yer yer seğirmeler görülüyor. Diz refleksleri canlı, sağda Babinski belirtisi pozitif. Duyu muayenesi normal.`,
      soru: 'Bulgulardan hangileri üst, hangileri alt motor nörona aittir? Bu birleşim, hasarın yeri için ne düşündürür?',
      cozum: `**Alt motor nöron bulguları:** el kaslarında erime (atrofi) ve seğirmeler (fasikülasyon). Atrofinin nedeni şudur: alfa motor nöronları ölen kas, besleyici (trofik) etkenlerden yoksun kalır. Fasikülasyonun nedeni ise hasarlı nöronların kendiliğinden ateşlemesidir (Knierim, 2026).

**Üst motor nöron bulguları:** canlı refleksler ve pozitif Babinski. İnen yolların frenleyici etkisi kalkınca germe refleksi abartılı olur. Başparmağın yukarı kalktığı taban yanıtı (ekstansör yanıt) da kortikospinal yol hasarının klasik işaretidir (Knierim, 2026).

**Yer ve olası tanı:** Şu bulgular bir arada **amiyotrofik lateral sklerozu** (ALS) düşündürür: duyu kaybı olmadan güçsüzlük, dilde ve kol-bacaklarda seğirme, üst ve alt motor nöron bulgularının karışımı. ALS bir ön boynuz hücresi (motor nöron) hastalığıdır (Quak ve ark., 2026). Bu örnekte yer bulma tek bir noktaya götürmez. Hareket sisteminin iki basamağını birlikte tutan bir hastalığa götürür. Karşılaştırma için çocuk felcine (poliomiyelit) bak. O da ön boynuz hücrelerini tutar ve duyu kaybı olmadan güçsüzlük yapar. ALS’yi ayıran, alt motor nöron bulgularına üst motor nöron bulgularının eşlik etmesidir (Quak ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Omurilik hasarı alt motor nöron bozukluğu mudur?',
      md: `Omurilik kesilirse lezyonun altı felç olur. Ama bu durum alt motor nöron bozukluğu sayılmaz. Çünkü alfa motor nöronların kendisi doğrudan hasar görmemiştir (Knierim, 2026). Boyun düzeyindeki hasar dört kol-bacağı felç eder (kuadripleji). Omuriliğin boyundaki kalın bölümünün (servikal genişleme) altındaki hasar ise yalnızca bacakları felç eder (parapleji) (Knierim, 2026).

Hasarın ilk (akut) döneminde tablo yanıltıcı olabilir. Güçsüz kol ya da bacakta üst motor nöron bulguları ancak sonra belirginleşebilir. Akut omurilik lezyonu **gevşek** bir güçsüzlükle gelebilir: iki bacak birden güçsüzdür. Buna sfinkter bozukluğu (gevşek anal tonus) eşlik edebilir. Omurilik kaynaklı bir duyu seviyesi de eşlik edebilir; yani gövdede belli bir çizginin altında duyu azalır. Akut miyelitte, yani omuriliğin ani iltihabında da benzer bir tablo görülebilir: iki bacakta kısmi güçsüzlük (paraparezi), duyu seviyesi ve sfinkter bozukluğu (Quak ve ark., 2026). Omurilik hasarında duyu türleri arasındaki ayrım, hasarın düzeyini bulmaya yardım eder. Duyu muayenesi dermatomlarla başlar. Dermatomlar, postsantral girustaki duyu kabuğuna bağlanan deri alanlarıdır (OpenStax 16.4).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Yukarı tırmanan güçsüzlük',
      oyku: `42 yaşında bir erkek hastaneye başvuruyor. Üç gündür ayak parmaklarında başlayan bir karıncalanma var; karıncalanma dizlerine doğru yükseliyor. İki bacağındaki güçsüzlük de artıyor. Bugün kollarını kaldırmakta da zorlanıyor. Muayenede dört kol-bacakta iki yanda eşit, gevşek güçsüzlük var. Derin tendon refleksleri alınamıyor. Duyu ayaklardan dizlere doğru azalmış. Ama gövdede belirli bir duyu seviyesi yok. İdrar ve dışkı denetimi ile anal tonus normal.`,
      soru: 'Gevşek güçsüzlük omurilikten mi, çevresel sinirlerden mi kaynaklanıyor? Hangi bulgular ikisini ayırır?',
      cozum: `**Neden zor?** Gevşek güçsüzlük ve refleks kaybı, ilk bakışta alt motor nöronu ya da çevresel siniri gösterir gibidir. Oysa akut omurilik lezyonu da iki bacakta gevşek güçsüzlükle gelebilir. İlk (akut) dönemde üst motor nöron bulguları henüz belirgin olmayabilir (Quak ve ark., 2026).

**Ayırt ettiren bulgular:** Akut omurilik lezyonunda iki şey beklenir: sfinkter bozukluğu (gevşek anal tonus) ve omurilik kaynaklı bir duyu seviyesi (Quak ve ark., 2026). Bu hastada ikisi de yok. Üstelik kollar da tutulmuş. Bunu omurilikte açıklamak için hasarın boyun düzeyinde olması gerekirdi (Knierim, 2026). Şu desen ise **Guillain–Barré sendromunun** tipik desenidir: kol ve bacakların iki yanda eşit tutulması, refleks kaybı ve yukarı doğru çıkan duyu kaybı (Quak ve ark., 2026). Bu sendrom, çevresel sinirlerin miyelin kılıfını bozan (demiyelinizan) bir hastalıktır (OpenStax 12.2).

**Ders:** Refleks kaybı tek başına omuriliği dışlamaz. Duyu seviyesi ve sfinkter işlevi mutlaka sorgulanır. Yerin doğru konması, hangi incelemenin isteneceğini de belirler. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      duzey: 'ileri',
      baslik: 'Beyin ölümü: nörolojik ölçütlerle ölüm',
      md: `Kanada’nın 2023 klinik uygulama kılavuzu ölümü şöyle tanımlar: **beyin işlevinin kalıcı olarak durması**. İşlev kaybolmuştur. Kendiliğinden geri dönmeyecektir. Hiçbir girişimle de geri getirilemeyecektir. Bu durum iki yoklukla tanınır. Birincisi, bilincin (uyanıklık ve farkındalık) her biçiminin yokluğudur. İkincisi, beyin sapı reflekslerinin tümüyle yokluğudur; kendi kendine soluma da bu reflekslere dahildir (Shemie ve ark., 2023).

Kılavuza göre nörolojik ölçütlerle ölüm belirlemesi esasen klinik bir değerlendirmedir. Şu üç koşulun üçü de gerekir:

1. **Bilinç yokluğu:** uyaranlara uyanıklık ve farkındalık yanıtı yoktur.
2. **Beyin sapı işlevi yokluğu:** kafa sinirleri testiyle gösterilir.
3. **Soluma kapasitesi yokluğu:** resmî apne testiyle gösterilir.

Apne testi için bir eşik önerilir. Eşik, atardamar kanındaki karbondioksit kısmi basıncı (PaCO₂) içindir: ≥60 mm Hg ve başlangıç değerinin ≥20 mm Hg üstü. Bu zayıf bir öneridir. Kanıtın kesinliği de çok düşüktür (Shemie ve ark., 2023).

Yer bulma açısından bu tanım öğreticidir. Muayene iki şeyi ayrı ayrı sınar: bilinci ve beyin sapı işlevini. Beyin sapı işlevi denince kafa siniri refleksleri ve kendi kendine soluma kapasitesi kastedilir. Temel nöroloji müfredatı beyin ölümünü “hızlı yanıt gerektiren durumlar” arasında sayar (Safdieh ve ark., 2019). Burada yalnızca açık erişimli Kanada kılavuzunun söyledikleri özetlendi. Türkiye’deki mevzuat ve uygulama bu derste ele alınmadı.`,
    },
    {
      tur: 'metin',
      md: `**Ne kadar yaygın?** Küresel Hastalık Yükü (GBD) 2021 çalışmasına göre, 2021’de 3,40 milyar kişi sinir sistemini etkileyen bir hastalıkla yaşıyordu. Bu, dünya nüfusunun %43,1’i demektir. Bu hastalıklar 11,1 milyon ölüme yol açtı (GBD 2021 Nervous System Disorders Collaborators, 2024). Dünya Sağlık Örgütü’ne (DSÖ) göre nörolojik hastalıklar artık dünyada sağlık kaybının ve engelliliğin önde gelen nedenidir (DSÖ, 2024).

Hastalıkları sağlık kaybına göre sıralamak da mümkündür. Bunun için yaşa göre standartlaştırılmış sağlık kaybı kullanılır. Bu ölçü, nüfusun yaş yapısındaki farkları hesaba katar. Bu ölçüye göre 2021’in ilk on durumu sırasıyla şunlardı. İlk beşi: inme, yenidoğan ensefalopatisi, migren, Alzheimer hastalığı ve diğer demanslar, diyabetik nöropati. Sonraki beşi: menenjit, epilepsi, erken doğuma bağlı nörolojik komplikasyonlar, otizm spektrum bozukluğu ve sinir sistemi kanserleri (GBD 2021 Nervous System Disorders Collaborators, 2024).

Listenin başında **inme** var. Dünyada her yıl yaklaşık 12 milyon yeni inme olgusu görülür. 25 yaşın üstündeki her dört kişiden biri yaşamı boyunca inme geçirecektir (Feigin ve ark., 2025). İnme büyük ölçüde önlenebilir. 2021’deki inme yükünün %84’ü, değiştirilebilir 23 risk etkenine bağlanır (Feigin ve ark., 2025). İnmenin risk etkenleri arasında en büyük pay, yüksek sistolik kan basıncınındır (GBD 2021 Nervous System Disorders Collaborators, 2024). Sistolik basınç, halk arasında “büyük tansiyon” denen değerdir.`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla sinir sistemi hastalıkları',
      ogeler: [
        {
          deger: '%43,1',
          aciklama: 'Dünya nüfusunun bu kadarı 2021’de sinir sistemini etkileyen bir hastalıkla yaşıyordu: 3,40 milyar kişi.',
        },
        { deger: '11,1', birim: 'milyon', aciklama: '2021’de sinir sistemi hastalıkları bu kadar ölüme yol açtı.' },
        { deger: '≈12', birim: 'milyon', aciklama: 'Dünyada her yıl görülen yeni inme sayısı.' },
        { deger: '4’te 1', aciklama: '25 yaşın üstündekilerin bu kadarı yaşamı boyunca inme geçirecek.' },
      ],
      not: 'Kaynaklar: GBD 2021 Nervous System Disorders Collaborators (2024); Feigin ve ark. (2025).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yükün ayrıntısı.** GBD 2021 analizi, sinir sistemini etkileyen 37 ayrı durumu kapsar. Hastalık yükü burada üç ölçüyle verilir:

- Engellilikle geçen yıllar (YLD): 2021’de 168 milyon.
- Erken ölümle kaybedilen yaşam yılları (YLL): 275 milyon.
- İkisinin toplamı, engellilikle düzeltilmiş yaşam yılı (DALY): 443 milyon.

Bu genişletilmiş sinir sistemi kategorisi, dünyadaki DALY’nin ve YLL’nin birinci kaynağıydı. İnme, dünyada ve 21 GBD bölgesinin 19’unda en büyük katkıyı yapıyordu (GBD 2021 Nervous System Disorders Collaborators, 2024).

Mutlak sayılar büyüdü, ama yaşa göre standart hızlar küçüldü. Yaşa göre standart hız, nüfusun yaş yapısı hesaba katılmış hızdır. 1990–2021 arasında bu durumlara bağlı küresel DALY sayısı %18,2 arttı. Aynı dönemde yaşa göre standart ölüm hızı %33,6 azaldı. Yaşa göre standart DALY hızı da %27,0 azaldı (GBD 2021 Nervous System Disorders Collaborators, 2024). Peki mutlak sayılar neden arttı? DSÖ’ye göre başlıca nedenler şunlardır: nüfus yapısı değişti ve insanlar daha uzun yaşıyor. Bazı durumlara bağlı yük ise 1990’dan beri %25 ya da daha fazla azaldı. Bunu sağlayan, aşılar dahil daha iyi korunma, bakım ve araştırmadır (DSÖ, 2024). Buna karşılık diyabetik nöropatili kişi sayısı 1990’dan beri üç katından fazla arttı. Bu sayı 2021’de 206 milyona ulaştı (DSÖ, 2024).

Yük eşit dağılmaz. Ölümlerin %81,9’u ve DALY’lerin %84,7’si düşük ve orta gelirli ülkelerdedir. Beş yaşından küçük çocuklara bakalım: DALY hızı Batı Sahra Altı Afrika’da, Avustralasya’dakinin yaklaşık 18 katıdır (GBD 2021 Nervous System Disorders Collaborators, 2024). Nörolojik sağlık çalışanı sayısı da çok farklıdır. Yüksek gelirli ülkelerde 100.000 kişiye düşen sayı, düşük ve orta gelirli ülkelerdekinin 70 katına kadar çıkar (DSÖ, 2024). Erkeklerde DALY daha yüksektir, kadınlarda ise yaygınlık. Yaygınlıktaki fark çoğunlukla migren ve gerilim tipi baş ağrısından gelir. Kadın/erkek oranı en yüksek üç durum şunlardır: COVID-19’a bağlı bilişsel bozulma ya da Guillain–Barré sendromu (1,84), multipl skleroz (1,80) ve migren (1,62) (GBD 2021 Nervous System Disorders Collaborators, 2024). Dünya Sağlık Asamblesi 2022’de bir eylem planı kabul etti. Adı, Epilepsi ve Diğer Nörolojik Bozukluklar Sektörlerarası Küresel Eylem Planı 2022–2031’dir (IGAP) (DSÖ, 2024).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'İnme: dünyadaki sayılar ve sıralama',
      sutunlar: ['Gösterge', 'Değer', 'Kaynak'],
      satirlar: [
        ['İnme sonrası yaşayanlar (2021)', '93,8 milyon', 'GBD 2021 Stroke Risk Factor Collaborators, 2024'],
        ['Yeni inme (2021)', '11,9 milyon; %65,3’ü (7,8 milyon) iskemik inme', 'GBD 2021 Stroke Risk Factor Collaborators, 2024'],
        ['İnme ölümü (2021)', '7,3 milyon; bütün ölümlerin %10,7’si', 'GBD 2021 Stroke Risk Factor Collaborators, 2024'],
        [
          'Ölüm nedenleri arasındaki sırası',
          'GBD: 2021’de 3. (iskemik kalp hastalığı ve COVID-19’dan sonra). DSÖ: 2023’te 2. (6,8 milyon; ölümlerin ~%11’i). WSO (Dünya İnme Örgütü): 2.',
          'GBD 2021 Stroke Risk Factor Collaborators, 2024; DSÖ, 2026; Feigin ve ark., 2025',
        ],
        ['Ölüm ve engellilik toplamında (DALY) sırası', 'WSO: 3.; ayrıca demansın başlıca nedenlerinden biri', 'Feigin ve ark., 2025'],
        [
          'DALY’lerde inme türleri',
          'Mutlak DALY’de beyin içi kanama (%49,6) iskemik inmeyi geçer',
          'GBD 2021 Stroke Risk Factor Collaborators, 2024',
        ],
        ['Düşük ve alt-orta gelirli ülkelerin payı', 'Ölümlerin %87,2’si, DALY’lerin %89,4’ü', 'Feigin ve ark., 2025'],
        [
          'Yıllık maliyet',
          '890 milyar ABD dolarından fazla (dünya ekonomisinin, yani küresel GSYH’nin %0,66’sı); 2050’ye kadar neredeyse iki katına çıkması bekleniyor',
          'Feigin ve ark., 2025',
        ],
      ],
      not: 'Sıralamadaki fark yıldan ve yöntemden gelir. GBD’nin 2021 listesinde COVID-19 ikinci sıradaydı. Bu yüzden “İnme ikinci ölüm nedenidir” derken kaynağı ve yılı da söylemek gerekir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Türkiye’de inme.** GBD 2021’e göre Türkiye’de 2021’de şu sayılar vardı: 98.000 yeni inme, 59.000 inme ölümü ve 927.000 inme geçirmiş olarak yaşayan kişi (yaygın, yani prevalan olgu). İnmeye bağlı DALY 1.185.000’di. 1990–2021 arasında yaşa göre standart hızlar azaldı. Yeni olgu sıklığı (insidans) %37,9, ölüm %50,2, yaygınlık %30,1 ve DALY %56,9 düştü (GBD 2021 Stroke Risk Factor Collaborators, 2024).

Toplumdan doğrudan toplanan veriler azdır ve şehirden şehre değişir. Karabük’te bir çalışmada 44 yaşın üstündeki 3131 kişi kapı kapı tarandı. Bunların 129’u daha önce inme geçirmişti. Yani 44 yaş üstünde yaygınlık %4,12’ydi. İnme geçirenlerin %72,1’inde yüksek tansiyon (hipertansiyon) vardı. Erkek/kadın oranı 0,72’ydi. İnmelerin %86’sı iskemikti, yani damar tıkanmasına bağlıydı. %14’ü ise kanamaya bağlıydı (hemorajik) (Padir Şensöz ve ark., 2018). Aynı makale, Denizli’deki önceki bir saha çalışmasını da aktarır. Bu çalışma 2010–2011’de kentsel bir bölgede yapılmıştı. 44 yaş üstünde %0,9 yaygınlık bulmuştu (Padir Şensöz ve ark., 2018). Fark çok büyüktür. Bu, tek bir şehrin verisinin bütün Türkiye’ye genellenemeyeceğini gösterir.

Hastane kayıtları da inme türlerinin dağılımını verir. Ağrı Devlet Hastanesi kayıtlarına dayanan bir çalışmada inmelerin %74,6’sı iskemikti. %25,3’ü kanamalıydı (hemorajik): %5,1 subaraknoid kanama, %20,1 beyin içi kanama. Türk Çok Merkezli İnme Çalışması ise %71 iskemi, %29 kanama bildirmişti (Kehaya, 2021). Hizmet tarafında da bir yönerge çıktı: “Akut İnmeli Hastalara Verilecek Sağlık Hizmetleri Hakkında Yönerge”. Yönerge 18 Temmuz 2019’da yayımlandı ve Mart 2021’de yürürlüğe girdi. Bu dönemde 57 kapsamlı ve 51 birincil inme merkezi sertifika aldı. Bu birimler nüfusun yaklaşık %85’ini kapsar (Topcuoglu ve Ozdemir, 2023). İnmeyi Klinik Nörobilim bölümünün **İnme** dersinde ayrıntılı göreceğiz.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Yük sayılarını okurken',
      md: `**Sıralama kaynağa göre değişir.** GBD 2021 inmeyi 2021’de üçüncü ölüm nedeni sayar (GBD 2021 Stroke Risk Factor Collaborators, 2024). DSÖ’nün 2023 verisinde ise inme ikinci ölüm nedenidir. Dünya İnme Örgütü’nün (WSO) bilgi notunda da öyledir (DSÖ, 2026; Feigin ve ark., 2025). Fark, yıldan (COVID-19’un 2021’deki payı) ve yöntemden gelir.

**Risk etkeni payları, neyin incelendiğine göre değişir.** Sinir sistemi analizinde inme DALY’lerinin %84,2’si 18 risk etkenine bağlanır. En büyük nüfus payı yüksek sistolik kan basıncınındır (%57,3) (GBD 2021 Nervous System Disorders Collaborators, 2024). İnme analizinde ise 23 risk etkeni incelenir. 2021’deki inme DALY’lerinin %84,1’i bunlara bağlanır (GBD 2021 Stroke Risk Factor Collaborators, 2024). WSO metni bunu %84 diye yuvarlar (Feigin ve ark., 2025). Her payı kendi kaynağıyla birlikte ver.

**Neyi saymıyor?** GBD sinir sistemi analizi, travmatik beyin ve omurilik yaralanmasına bağlı ölümleri hesaba katmadı. Aynı analizden iki bulgu daha var. Kurşuna maruz kalmak, nedeni bilinmeyen (idiyopatik) zihinsel yetersizliğe bağlı DALY’lerin %63,1’ini açıklar. Diyabetik nöropati de nörolojik durumlar arasında beşinci sıraya çıkmıştır; bu sıra yaşa göre standart DALY’ye göredir (GBD 2021 Nervous System Disorders Collaborators, 2024).

**Türkiye’deki saha verileri.** Karabük’te %4,12, Denizli’de %0,9 bulundu. İkisi de 44 yaş üstünde, kapı kapı taramayla ölçüldü. Aradaki fark büyüktür. Karabük çalışmasının yazarları bir olasılığı tartışır. Kentte, çelik fabrikasının yol açtığı belgelenmiş bir hava kirliliği vardır. Yüksek oran bu kirlilikle ilişkili olabilir (Padir Şensöz ve ark., 2018). Tek bir şehrin oranını ülkenin oranı yerine kullanma.`,
    },
  ],
};
