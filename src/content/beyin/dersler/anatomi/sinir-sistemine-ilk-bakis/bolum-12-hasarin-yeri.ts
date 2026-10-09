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
      md: `Bir nörolog hastasını dinleyip muayene ederken iki soruyu sırayla sorar: **Hasar nerede?** ve **Bu ne olabilir?** İkinci soru ancak birincinin cevabıyla anlam kazanır. Sinir sisteminin farklı düzeylerindeki hasarlar farklı belirtiler verir; hekim bu farklardan hasarın sistemin neresinde olduğunu çıkarır (Knierim, 2026). Bu derste öğrendiğin harita, klinikte her gün bu yüzden kullanılır.

Yer bulmanın birkaç basit ipucu vardır:

- **Hangi taraf?** Hareket komutunu taşıyan kortikospinal yol büyük ölçüde çaprazlaşır: sağ yarımkürenin hareket kabuğu vücudun sol yarısındaki kasları yönetir, sol yarımküreninki sağ yarısındakileri (OpenStax 14.3).
- **Duyu da etkilenmiş mi?** Bazı hastalıklar yalnızca hareketi bozar. Omurilikteki hareket nöronlarını (ön boynuz hücrelerini), sinir ile kas arasındaki bağlantıyı ya da kasın kendisini tutan hastalıklarda duyu kaybı olmaz (Quak ve ark., 2026).
- **Güçsüzlük nerede?** Sandalyeden kalkmakta ya da çamaşırı başının üstüne kaldırmakta zorlanmak gövdeye yakın (**proksimal**) kasların, kavanoz açmakta zorlanmak ya da ayağının takılması uçtaki (**distal**) kasların güçsüzlüğünü düşündürür (Quak ve ark., 2026).
- **Refleksler nasıl?** Beyinden inen yolların hasarında refleksler artar; omurilikten kasa giden son nöronun hasarında azalır ya da kaybolur (Knierim, 2026).`,
    },
    {
      tur: 'sahne',
      baslik: 'Hareket komutunun beyindeki yolu',
      aciklama:
        'Beyne önden, soldan ve yukarıdan bakıyoruz; büyük beynin geri kalanı soluk bırakıldı. Mavi: sol yarımkürenin hareket kabuğu (presantral girus); kortikospinal yolun üst motor nöronlarının bir bölümü buradadır, ötekiler başka kabuk alanlarındadır. Turuncu: hareket liflerinin kabuğun altından geçtiği iç kapsül. Mor: liflerin aşağı indiği beyin sapı (orta beyin, pons ve omurilik soğanı); lifler orta beyinde öndeki beyin ayağından (*crus cerebri*) geçer (OpenStax 14.3; FIPAT, 2019). Yeşil: arka çukurdaki beyincik. Modelde omurilik ve sinirler yoktur; yolun omurilikten kasa kadar olan basamakları aşağıdaki metinde ve tablolarda anlatılır.',
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
      md: `Kortikospinal yol iki basamaklıdır. **Üst motor nöronun** gövdesi beyin kabuğundadır; aksonu omurilikteki **alt motor nörona** kadar iner, alt motor nöronun aksonu da kasa ulaşır. Kabuktan beyin sapındaki hareket çekirdeklerine inen benzer yola ise kortikobulber yol denir (OpenStax 14.3). OpenStax üst motor nöronun gövdesini alın lobundaki birincil hareket kabuğuna yerleştirir (OpenStax 14.3); ama kortikospinal liflerin yalnızca yaklaşık %30’u buradan gelir, geri kalanı hareket öncesi (premotor) kabuk, ek motor alan, bedensel duyu kabuğu ve arka parietal kabuktan çıkar (Knierim, 2020). Bu iki basamağın hasarı, bazı bakımlardan birbirinin tersi belirtiler verir (Knierim, 2026):

- **Alt motor nöron** zarar görürse kas, besleyici (trofik) etkenleri sağlayan nöronunu kaybettiği için zamanla erir (**atrofi**). Hasarlı nöronlar kendiliğinden ateşleyip kasta gözle görülen seğirmelere (**fasikülasyon**) yol açabilir. Germe refleksi zayıflar ya da kaybolur (Knierim, 2026); kas gevşek kalır: **gevşek (flask) felç** (OpenStax 16.4).
- **Üst motor nöron** zarar görürse alt motor nöron yerinde kaldığı için kas pek erimez ve seğirme olmaz. Ama inen yolların frenleyici etkisi kalktığından germe refleksi abartılı olur; kas, pasif harekete hız arttıkça artan bir dirençle karşı koyar (**spastisite**); ayak tabanı çizilince başparmak yukarı kalkar ve öteki parmaklar yelpaze gibi açılır: **Babinski belirtisi** (Knierim, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Önce yer, sonra neden.** Hasarın yeri belirtilerin biçimini belirler.\n\n**Düzeyler, yukarıdan aşağı:** beyin kabuğu ve kabuk altı → beyin sapı ve beyincik → omurilik → ön boynuz hücresi → kök ve sinir ağı → çevresel sinir → sinir-kas kavşağı → kas.\n\n**Üst motor nöron hasarı:** refleks artışı, spastisite, Babinski; atrofi ve seğirme yok.\n\n**Alt motor nöron hasarı:** refleks azalması, gevşek felç, atrofi, fasikülasyon.\n\n**Duyu kaybı olmayan güçsüzlük:** ön boynuz hücresi, sinir-kas kavşağı ya da kas.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Bir bebeğin ayak tabanını çizdiğinde başparmağı yukarı kalkıyor ve öteki parmakları yelpaze gibi açılıyorsa bu bir hastalık belirtisi değildir: pozitif Babinski belirtisi yaşamın ilk iki yılında normaldir (Knierim, 2026). Yetişkinde aynı yanıt, beyinden omuriliğe inen kortikospinal yolun hasarını gösteren klasik bir işarettir (Knierim, 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Ani başlayan kayıp beklemez',
      md: 'Nöronlar oksijensizliğe çok duyarlıdır: 1–2 dakika içinde bozulmaya başlar, birkaç saat içinde kalıcı hasar (hücre ölümü) gelişebilir (OpenStax 16.1). **FAST** kısaltması (yüz, kol, konuşma, zaman), birdenbire başlayan nörolojik işlev kayıplarında neye bakılacağını hatırlatır (OpenStax 13.3). Bu bölümdeki bilgiler eğitim amaçlıdır; belirtisi olan biri tanı için hemen bir hekime başvurmalıdır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Lokalizasyon düzeyleri.** Klinik nöroloji eğitimi için hazırlanan temel müfredat, öğrencinin birbirinden ayırması gereken düzeyleri sayar: beyin kabuğu ve kabuk altı yapılar; arka çukur (beyin sapı ve beyincik); omurilik; ön boynuz hücresi; sinir kökü ve sinir ağı (pleksus); çevresel sinir (mononöropati, polinöropati ve mononöropati multipleks); sinir-kas kavşağı; kas (Safdieh ve ark., 2019). Aynı müfredata göre ayırıcı tanı, lezyonun yerine, belirtilerin zaman içindeki seyrine ve ilgili öykü ile epidemiyolojik özelliklere göre kurulur; bazı eğitimciler özellikle **odaksal** ile **yaygın** hastalık süreçlerinin ayrımını öne çıkarır (Safdieh ve ark., 2019).

Merdivenin her basamağı kendine özgü bir bulgu birleşimi verir. Yeri bulmak için tek bir bulgu yetmez; asıl ipucu bulguların birlikte oluşturduğu desendir: hangi taraf, hangi kaslar, duyu var mı, refleksler artmış mı azalmış mı?`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Lokalizasyon merdiveni: düzey ve ipuçları',
      sutunlar: ['Düzey', 'Düşündüren bulgular (örnekler)', 'Kaynak'],
      satirlar: [
        [
          'Beyin kabuğu ve kabuk altı',
          'Karşı tarafta hemiparezi; ön dolaşım infarktlarında kabuk bulgularıyla ya da onlarsız',
          'OpenStax 14.3; Quak ve ark., 2026',
        ],
        [
          'Arka çukur (beyin sapı ve beyincik)',
          'Kafa siniri bulgularıyla birlikte karşı tarafta hemiparezi: çapraz hemiparezi',
          'Quak ve ark., 2026',
        ],
        [
          'Omurilik',
          'Duyu seviyesi; sfinkter bozukluğu (gevşek anal tonus); iki yanlı bacak güçsüzlüğü (akut evrede gevşek). Boyun düzeyinde dört ekstremite, servikal genişlemenin altında yalnız bacaklar',
          'Quak ve ark., 2026; Knierim, 2026',
        ],
        [
          'Ön boynuz hücresi',
          'Duyu kaybı olmadan güçsüzlük (ör. poliomiyelit); ALS’de dilde ve ekstremitelerde fasikülasyon, karışık üst ve alt motor nöron bulguları',
          'Quak ve ark., 2026',
        ],
        [
          'Kök ve sinir ağı',
          'Sınırlı bir kas grubunda güçsüzlük; kol ağının üst bölümünde Erb, alt bölümünde Klumpke felci',
          'Knierim, 2026; NINDS, t.y.',
        ],
        [
          'Çevresel sinir',
          'Diyabetik polinöropatide uzunluğa bağımlı duyu kaybı ve refleks azalması; vaskülitik nöropatide asimetrik mononöropati multipleks; Guillain–Barré sendromunda simetrik güçsüzlük, refleks kaybı ve yukarı çıkan duyu kaybı',
          'Quak ve ark., 2026',
        ],
        [
          'Sinir-kas kavşağı',
          'Göz (çift görme, pitoz), bulber, boyun, solunum ve proksimal kaslarda güçsüzlük; yorulabilirlik; duyu kaybı yok',
          'Quak ve ark., 2026',
        ],
        ['Kas', 'Proksimal, genellikle simetrik güçsüzlük; nesnel duyu kaybı yok', 'Quak ve ark., 2026'],
      ],
      not: 'Düzeyler Safdieh ve ark. (2019) müfredatındaki sırayla verildi. Bulgular yalnızca örnektir; aynı düzeydeki farklı hastalıklar farklı tablolar verebilir.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Arka çukur: beyin sapı ve beyincik',
      aciklama:
        'Beyin sapı ve beyincik tek başına, soldan görülüyor; ön taraf solda, renkler her yapıyı ayrı tanıtır. Beyin sapında (orta beyin, pons, omurilik soğanı) kafa sinirlerinin hareket çekirdekleri gibi alt motor nöronlar ile omuriliğe inen üst motor nöron lifleri bir aradadır. Bu yüzden buradaki küçük bir hasar bir yanda kafa siniri bulgusu, öteki yanda kol ve bacak güçsüzlüğü yapabilir. Kafa sinirleri ve omurilik modelde yoktur.',
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
      md: `**Üst motor nöron: hangi tanım?** Kaynaklar üst motor nöronu farklı genişlikte tanımlar. OpenStax, yukarıda anlatıldığı gibi, kortikospinal yolu iki nöronlu anlatır ve üst motor nöronu kabuktaki nöron olarak tanımlar (OpenStax 14.3). Knierim ise alt motor nöron olarak yalnızca omurilik ve beyin sapındaki alfa motor nöronları sayar; hiyerarşide bunların üstündeki bütün hareket sistemi nöronlarını üst motor nöron kabul eder (Knierim, 2026). Gray’in klinik ayrımı da benzerdir: üst motor nöronlar kabuktaki hareket hücreleri ve hareket sinirlerinin çekirdeklerine kadar inen lifleridir; alt motor nöronlar kafa sinirlerinin hareket çekirdeklerindeki ya da omuriliğin ön kolonundaki hücrelerdir (Gray, 1918). Klinikteki **üst motor nöron sendromu** geniş tanıma dayanır: alfa motor nöronların üstündeki herhangi bir düzeyin (yan devreler hariç) hasarı bu sendromu verir (Knierim, 2026).

**Çaprazlaşmanın istisnaları.** Kortikospinal aksonların yaklaşık %90’ı piramidal çaprazlaşmada (*decussatio pyramidum*) karşı tarafa geçip yan kortikospinal yolu yapar; yan yol uçtaki (distal) kasları, ön kortikospinal yol gövdeye yakın (proksimal) kasları denetler (Knierim, t.y.). Gövde hareketleri iki yanı birlikte ilgilendirdiği için ön kortikospinal yol tümüyle karşı taraflı değildir (OpenStax 14.3). Bir yandaki hareket alanını tutan lezyonun karşı yandaki kasları felç etmesi bu çaprazlaşmayla açıklanır (Gray, 1918).

**Germe refleksi başlıca testtir.** Germe refleksi, bir hareket bozukluğunun üst mü alt motor nörondan mı kaynaklandığını gösteren başlıca klinik testtir (Knierim, 2026). OpenStax’e göre üst motor nöron lezyonunu düşündüren bulgular güçsüzlük, güçlü derin tendon refleksleri, hareket denetiminde azalma ya da yavaşlık, pronatör kayma, pozitif Babinski, spastisite ve çakı bıçağı yanıtıdır; alt motor nöron lezyonunun öteki işaretleri ise kasın sinirsiz kalmasından doğan fibrilasyon, fasikülasyon ve azalmış ya da kaybolmuş reflekslerdir (OpenStax 16.4).`,
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
          'Nadir: alfa motor nöronlar kasa trofik destek vermeyi sürdürür',
          'Olur: kas trofik etkenlerden yoksun kalır',
        ],
        ['Fasikülasyon, fibrilasyon', 'Fasikülasyon yok', 'Olur'],
        ['Germe (derin tendon) refleksi', 'Abartılı (hiperrefleksi)', 'Zayıf ya da yok'],
        [
          'Tonus',
          'Spastisite: pasif harekete hıza bağlı direnç; çakı bıçağı yanıtı',
          'Gevşek (flask) felç: tonus tümüyle ya da kısmen kaybolur',
        ],
        ['Ayak tabanı yanıtı', 'Ekstansör yanıt: pozitif Babinski (ilk 2 yaşta normal)', '—'],
        ['Diğer', 'Pronatör kayma; hareket denetiminde azalma ya da yavaşlık', '—'],
      ],
      not: 'Kaynaklar: Knierim (2026); OpenStax 16.4. Akut evrede güçsüz ekstremitede üst motor nöron bulguları henüz belirgin olmayabilir (Quak ve ark., 2026). Spastisitenin tersine rijidite pasif hareketin hızına bağlı değildir (Knierim, 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Lokalizasyon düzeyleri: kabuk ve kabuk altı, arka çukur, omurilik, ön boynuz hücresi, kök ve ağ, çevresel sinir (mono-, poli-, multipleks), sinir-kas kavşağı, kas (Safdieh ve ark., 2019).
- Germe refleksi, hareket bozukluğunun üst mü alt motor nörondan mı kaynaklandığını gösteren başlıca klinik testtir (Knierim, 2026).
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
      md: 'Kol sinir ağı (*plexus brachialis*), omuriliğin üst bölümlerinden omuza, kola ve ele sinyal taşıyan bir sinir ağıdır. Ağın üst bölümündeki hasara bağlı uyuşukluk ve felce **Erb felci** denir; alt bölümün hasarında el bileği ve elde duyu kaybıyla seyreden felce **Klumpke felci** denir (NINDS, t.y.). Hasarın ağın hangi bölümünde olduğu, kolun hangi kısmının etkileneceğini belirler. Kol ve bacak sinir ağları ünitenin 3. ve 4. derslerinde ayrıntılı işlenecek.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Akşamları düşen göz kapağı',
      oyku: `34 yaşında bir kadın, iki aydır akşamüstleri çift gördüğünü, sağ göz kapağının düştüğünü, merdiven çıkmakta ve saçını tararken kollarını kaldırmakta zorlandığını anlatıyor; sabahları daha iyi hissediyor. Muayenede duyu normal. Bir süre yukarı bakması istenince sağ göz kapağı belirgin biçimde düşüyor; göz kapağının üstüne buz torbası konunca düşüklük azalıyor.`,
      soru: 'Hasar, lokalizasyon merdiveninin hangi basamağındadır ve hangi bulgular bunu destekler?',
      cozum: `**Yer: sinir-kas kavşağı.** Tablo **myastenia gravis** ile uyumludur. Myastenia gravis tipik olarak göz kaslarını (çift görme, pitoz), bulber, boyun, solunum ve proksimal ekstremite kaslarını tutar ve **duyu kaybı yapmaz**. Yorulabilirlik, pitoz ve proksimal kas gücü muayene edilirken ortaya çıkarılabilir; pitoz soğukla düzelir, bu yüzden göz kapağına buz torbası konarak sınanabilir (Quak ve ark., 2026).

**Neden kas değil?** Kas hastalığı da proksimal, genellikle simetrik ve nesnel duyu kaybı olmayan güçsüzlük yapar (Quak ve ark., 2026). Bu hastada göz kaslarının tutulması, yorulabilirliğin muayenede gösterilebilmesi ve soğukla düzelen pitoz ise kavşağı düşündürür (Quak ve ark., 2026). Myastenide solunum kasları da tutulabildiği için (Quak ve ark., 2026) nefes darlığı yakınması ciddiye alınır. Sinir-kas kavşağı Hücreden Sinyale bölümünün **Sinir-kas kavşağı** dersinde ayrıntılı işlenecek. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Seğiren dil, canlı refleksler',
      oyku: `58 yaşında bir erkek, altı aydır sağ elinde güçsüzlük olduğunu, düğme iliklemekte zorlandığını, son haftalarda konuşmasının da bozulduğunu söylüyor. Muayenede sağ el kaslarında belirgin erime, dilde ve iki kolda yer yer seğirmeler görülüyor. Diz refleksleri canlı, sağda Babinski belirtisi pozitif. Duyu muayenesi normal.`,
      soru: 'Bulgulardan hangileri üst, hangileri alt motor nörona aittir ve bu birleşim hasarın nerede olduğunu düşündürür?',
      cozum: `**Alt motor nöron bulguları:** el kaslarında erime (atrofi) ve seğirmeler (fasikülasyon). Atrofi, alfa motor nöronları ölen kasın trofik etkenlerden yoksun kalmasıyla; fasikülasyon, hasarlı nöronların kendiliğinden ateşlemesiyle açıklanır (Knierim, 2026).

**Üst motor nöron bulguları:** canlı refleksler ve pozitif Babinski. İnen yolların frenleyici etkisi kalkınca germe refleksi abartılı olur; ekstansör taban yanıtı kortikospinal yol hasarının klasik işaretidir (Knierim, 2026).

**Yer ve olası tanı:** Duyu kaybı olmadan güçsüzlük, dilde ve ekstremitelerde fasikülasyon ve karışık üst ve alt motor nöron bulguları **amiyotrofik lateral sklerozu** (ALS), yani bir ön boynuz hücresi (motor nöron) hastalığını düşündürür (Quak ve ark., 2026). Bu örnekte lokalizasyon tek bir noktaya değil, hareket sisteminin iki basamağını birlikte tutan bir hastalığa götürür. Karşılaştırma için: poliomiyelit de ön boynuz hücrelerini tutar ve duyu kaybı olmadan güçsüzlük yapar; ALS’yi ayıran, alt motor nöron bulgularına üst motor nöron bulgularının eşlik etmesidir (Quak ve ark., 2026). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Omurilik hasarı alt motor nöron bozukluğu mudur?',
      md: `Omuriliğin kesilmesi lezyonun altını felç eder; ama alfa motor nöronların kendisi doğrudan hasar görmediği için bu durum alt motor nöron bozukluğu sayılmaz (Knierim, 2026). Boyun düzeyindeki hasar dört ekstremiteyi (kuadripleji), servikal genişlemenin altındaki hasar yalnızca bacakları (parapleji) felç eder (Knierim, 2026).

Akut evrede tablo yanıltıcı olabilir. Güçsüz ekstremitede üst motor nöron bulguları ancak sonra belirginleşebilir; akut omurilik lezyonu sfinkter bozukluğu (gevşek anal tonus) ve spinal duyu seviyesiyle birlikte **gevşek** iki yanlı bacak güçsüzlüğüyle gelebilir; akut miyelitte de duyu seviyesi ve sfinkter bozukluğuyla birlikte paraparezi görülebilir (Quak ve ark., 2026). Omurilik hasarında duyu türleri arasındaki ayrım hasarın düzeyini bulmaya yardım eder; duyu muayenesi, postsantral girustaki duyu kabuğuna bağlanan deri alanları olan dermatomlarla başlar (OpenStax 16.4). Dermatomlar ünitenin 2. dersinde ayrıntılı işlenecek.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Yukarı tırmanan güçsüzlük',
      oyku: `42 yaşında bir erkek, üç gündür ayak parmaklarından başlayıp dizlerine doğru yükselen karıncalanma ve iki bacakta artan güçsüzlükle başvuruyor; bugün kollarını kaldırmakta da zorlanıyor. Muayenede dört ekstremitede simetrik, gevşek güçsüzlük var; derin tendon refleksleri alınamıyor. Duyu ayaklardan dizlere doğru azalmış ama gövdede belirli bir duyu seviyesi yok; idrar ve dışkı denetimi ile anal tonus normal.`,
      soru: 'Gevşek güçsüzlük omurilikten mi, çevresel sinirlerden mi kaynaklanıyor; hangi bulgular ikisini ayırır?',
      cozum: `**Neden zor?** Gevşek güçsüzlük ve refleks kaybı tek başına alt motor nöronu ya da çevresel siniri gösteriyor gibi görünür. Oysa akut omurilik lezyonu da gevşek iki yanlı bacak güçsüzlüğüyle gelebilir ve akut evrede üst motor nöron bulguları henüz belirgin olmayabilir (Quak ve ark., 2026).

**Ayırt ettiren bulgular:** Akut omurilik lezyonunda sfinkter bozukluğu (gevşek anal tonus) ve spinal bir duyu seviyesi beklenir (Quak ve ark., 2026). Bu hastada ikisi de yok. Üstelik kollar da tutulmuş: omurilikte bunu açıklayacak hasar boyun düzeyinde olmalıydı (Knierim, 2026). Kol ve bacakların simetrik tutulması, refleks kaybı ve yukarı doğru çıkan duyu kaybı ise **Guillain–Barré sendromunun** tipik desenidir (Quak ve ark., 2026); bu sendrom çevresel sinir sisteminin demiyelinizan bir hastalığıdır (OpenStax 12.2).

**Ders:** Refleks kaybı tek başına omuriliği dışlamaz; duyu seviyesi ve sfinkter işlevi mutlaka sorgulanır. Yerin doğru konması, hangi incelemenin isteneceğini de belirler. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      duzey: 'ileri',
      baslik: 'Beyin ölümü: nörolojik ölçütlerle ölüm',
      md: `Kanada’nın 2023 klinik uygulama kılavuzu ölümü **beyin işlevinin kalıcı olarak durması** diye tanımlar: işlev kaybolmuştur, kendiliğinden geri dönmeyecek ve hiçbir girişimle geri getirilemeyecektir. Bu durum bilincin (uyanıklık ve farkındalık) her biçiminin ve kendi kendine soluma dahil beyin sapı reflekslerinin tümüyle yokluğuyla tanınır (Shemie ve ark., 2023).

Kılavuza göre nörolojik ölçütlerle ölüm belirlemesi esasen klinik bir değerlendirmedir ve şu üç koşulun üçünü de ister: (1) uyaranlara uyanıklık ve farkındalık yanıtının olmamasıyla gösterilen **bilinç yokluğu**, (2) kafa sinirleri testiyle gösterilen **beyin sapı işlevi yokluğu**, (3) resmî apne testiyle gösterilen **soluma kapasitesi yokluğu**. Apne testinde arter kanındaki karbondioksit kısmi basıncı (PaCO₂) için ≥60 mm Hg ve başlangıç değerinin ≥20 mm Hg üstü eşiği önerilir; bu zayıf bir öneridir ve kanıtın kesinliği çok düşüktür (Shemie ve ark., 2023).

Lokalizasyon açısından tanım öğreticidir: muayene bilinci ve beyin sapı işlevini (kafa siniri refleksleri ve kendi kendine soluma kapasitesi) ayrı ayrı sınar. Temel nöroloji müfredatı beyin ölümünü “hızlı yanıt gerektiren durumlar” arasında sayar (Safdieh ve ark., 2019). Burada yalnızca açık erişimli Kanada kılavuzunun söyledikleri özetlendi; Türkiye’deki mevzuat ve uygulama bu derste ele alınmadı.`,
    },
    {
      tur: 'metin',
      md: `**Ne kadar yaygın?** Küresel Hastalık Yükü (GBD) 2021 çalışmasına göre 2021’de 3,40 milyar kişi, yani dünya nüfusunun %43,1’i sinir sistemini etkileyen bir hastalıkla yaşıyordu; bu hastalıklar 11,1 milyon ölüme yol açtı (GBD 2021 Nervous System Disorders Collaborators, 2024). Dünya Sağlık Örgütü’ne (DSÖ) göre nörolojik hastalıklar artık dünyada sağlık kaybının ve engelliliğin önde gelen nedenidir (DSÖ, 2024). Yaşa göre standartlaştırılmış sağlık kaybına göre 2021’in ilk on durumu şunlardı: inme, yenidoğan ensefalopatisi, migren, Alzheimer hastalığı ve diğer demanslar, diyabetik nöropati, menenjit, epilepsi, erken doğuma bağlı nörolojik komplikasyonlar, otizm spektrum bozukluğu ve sinir sistemi kanserleri (GBD 2021 Nervous System Disorders Collaborators, 2024).

Listenin başındaki **inmede** dünyada her yıl yaklaşık 12 milyon yeni olgu görülür ve 25 yaşın üstündeki her dört kişiden biri yaşamı boyunca inme geçirecektir (Feigin ve ark., 2025). İnme büyük ölçüde önlenebilir: 2021’deki inme yükünün %84’ü 23 değiştirilebilir risk etkenine bağlanır (Feigin ve ark., 2025). İnme için en büyük risk etkeni payı yüksek sistolik kan basıncınındır (GBD 2021 Nervous System Disorders Collaborators, 2024).`,
    },
    {
      tur: 'sayilar',
      baslik: 'Sayılarla sinir sistemi hastalıkları',
      ogeler: [
        { deger: '%43,1', aciklama: '2021’de sinir sistemini etkileyen bir hastalıkla yaşayan dünya nüfusu payı: 3,40 milyar kişi.' },
        { deger: '11,1', birim: 'milyon', aciklama: '2021’de sinir sistemi hastalıklarına bağlı ölüm.' },
        { deger: '≈12', birim: 'milyon', aciklama: 'Dünyada her yıl görülen yeni inme.' },
        { deger: '4’te 1', aciklama: '25 yaşın üstündekilerden yaşamı boyunca inme geçirecek olanların oranı.' },
      ],
      not: 'Kaynaklar: GBD 2021 Nervous System Disorders Collaborators (2024); Feigin ve ark. (2025).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Yükün ayrıntısı.** GBD 2021 analizi sinir sistemini etkileyen 37 ayrı durumu kapsar. Bu durumlar 2021’de 168 milyon engellilikle geçen yıla (YLD) ve 275 milyon erken ölümle kaybedilen yaşam yılına (YLL) yol açtı; toplam 443 milyon engellilikle düzeltilmiş yaşam yılı (DALY) ile bu genişletilmiş sinir sistemi kategorisi küresel DALY’nin ve YLL’nin birinci kaynağıydı. İnme dünyada ve 21 GBD bölgesinin 19’unda en büyük katkıyı yapıyordu (GBD 2021 Nervous System Disorders Collaborators, 2024).

Mutlak sayılar büyüdü, yaşa göre standart hızlar küçüldü: 1990–2021 arasında bu durumlara bağlı küresel DALY sayısı %18,2 arttı; aynı dönemde yaşa göre standart ölüm hızı %33,6, yaşa göre standart DALY hızı %27,0 azaldı (GBD 2021 Nervous System Disorders Collaborators, 2024). DSÖ’ye göre mutlak sayılardaki artış esas olarak nüfus yapısındaki değişimden ve insanların daha uzun yaşamasından kaynaklanır; bazı durumlara bağlı yük ise aşılar dahil daha iyi korunma, bakım ve araştırma sayesinde 1990’dan beri %25 ya da daha fazla azaldı (DSÖ, 2024). Buna karşılık diyabetik nöropatili kişi sayısı 1990’dan beri üç katından fazla artarak 2021’de 206 milyona ulaştı (DSÖ, 2024).

Yük eşit dağılmaz. Ölümlerin %81,9’u ve DALY’lerin %84,7’si düşük ve orta gelirli ülkelerdedir; beş yaşından küçük çocuklarda DALY hızı Batı Sahra Altı Afrika’da Avustralasya’dakinin yaklaşık 18 katıdır (GBD 2021 Nervous System Disorders Collaborators, 2024). Yüksek gelirli ülkelerde 100.000 kişi başına düşen nörolojik sağlık çalışanı, düşük ve orta gelirli ülkelerdekinin 70 katına kadar çıkar (DSÖ, 2024). Erkeklerde DALY, kadınlarda yaygınlık daha yüksektir; yaygınlık farkı çoğunlukla migren ve gerilim tipi baş ağrısından gelir. Kadın/erkek oranı en yüksek üç durum COVID-19’a bağlı bilişsel bozulma ya da Guillain–Barré sendromu (1,84), multipl skleroz (1,80) ve migrendir (1,62) (GBD 2021 Nervous System Disorders Collaborators, 2024). Dünya Sağlık Asamblesi 2022’de Epilepsi ve Diğer Nörolojik Bozukluklar Sektörlerarası Küresel Eylem Planı 2022–2031’i (IGAP) kabul etti (DSÖ, 2024).`,
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
          'GBD: 2021’de 3. (iskemik kalp hastalığı ve COVID-19’dan sonra). DSÖ: 2023’te 2. (6,8 milyon; ölümlerin ~%11’i). WSO: 2.',
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
          '890 milyar ABD dolarından fazla (küresel GSYH’nin %0,66’sı); 2050’ye kadar neredeyse iki katına çıkması bekleniyor',
          'Feigin ve ark., 2025',
        ],
      ],
      not: 'Sıralamadaki fark yıldan ve yöntemden gelir: GBD’nin 2021 listesinde COVID-19 ikinci sıradaydı. “İnme ikinci ölüm nedenidir” gibi bir cümle kaynak ve yıl belirtilmeden kurulmamalıdır.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Türkiye’de inme.** GBD 2021’e göre Türkiye’de 2021’de 98.000 yeni inme, 59.000 inme ölümü, 927.000 prevalan inme olgusu ve 1.185.000 DALY vardı; 1990–2021 arasında yaşa göre standart hızlar insidansta %37,9, ölümde %50,2, yaygınlıkta %30,1, DALY’de %56,9 azaldı (GBD 2021 Stroke Risk Factor Collaborators, 2024).

Toplum temelli veriler azdır ve şehirden şehre değişir. Karabük’te 44 yaşın üstündeki 3131 kişinin kapı kapı tarandığı çalışmada 129 kişi daha önce inme geçirmişti: 44 yaş üstünde yaygınlık %4,12. İnme geçirenlerin %72,1’inde hipertansiyon vardı, erkek/kadın oranı 0,72’ydi; inmelerin %86’sı iskemik, %14’ü hemorajikti (Padir Şensöz ve ark., 2018). Aynı makalenin aktardığı, Denizli’de kentsel bir bölgede 2010–2011’de yapılan önceki saha çalışması 44 yaş üstünde %0,9 yaygınlık bulmuştu (Padir Şensöz ve ark., 2018). Bu kadar büyük bir fark, tek bir şehrin verisinin Türkiye geneline genellenemeyeceğini gösterir.

Hastane kayıtları da inme türlerinin dağılımını verir. Ağrı Devlet Hastanesi kayıtlarına dayanan çalışmada inmelerin %74,6’sı iskemik, %25,3’ü hemorajikti (%5,1 subaraknoid kanama, %20,1 beyin içi kanama); Türk Çok Merkezli İnme Çalışması ise %71 iskemi, %29 kanama bildirmişti (Kehaya, 2021). Hizmet tarafında “Akut İnmeli Hastalara Verilecek Sağlık Hizmetleri Hakkında Yönerge” 18 Temmuz 2019’da yayımlandı ve Mart 2021’de yürürlüğe girdi; bu dönemde 57 kapsamlı ve 51 birincil inme merkezi sertifikalandırıldı ve bu birimler nüfusun yaklaşık %85’ini kapsar (Topcuoglu ve Ozdemir, 2023). İnme, Klinik Nörobilim bölümünün **İnme** dersinde ayrıntılı işlenecek.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Yük sayılarını okurken',
      md: `**Sıralama kaynağa göre değişir.** GBD 2021 inmeyi 2021’de üçüncü ölüm nedeni sayar (GBD 2021 Stroke Risk Factor Collaborators, 2024); DSÖ’nün 2023 verisinde ve Dünya İnme Örgütü’nün (WSO) bilgi notunda inme ikinci ölüm nedenidir (DSÖ, 2026; Feigin ve ark., 2025). Fark, yıldan (COVID-19’un 2021’deki payı) ve yöntemden gelir.

**Risk etkeni payları kapsamla değişir.** Sinir sistemi analizinde inme DALY’lerinin %84,2’si 18 risk etkenine bağlanır ve en büyük nüfus payı yüksek sistolik kan basıncınındır (%57,3) (GBD 2021 Nervous System Disorders Collaborators, 2024). İnme analizinde ise 2021’deki inme DALY’lerinin %84,1’i incelenen 23 risk etkenine bağlanır (GBD 2021 Stroke Risk Factor Collaborators, 2024); WSO metni bunu %84 diye yuvarlar (Feigin ve ark., 2025). Her pay kendi kaynağıyla birlikte verilmelidir.

**Neyi saymıyor?** GBD sinir sistemi analizi travmatik beyin ve omurilik yaralanmasına bağlı ölümleri hesaba katmadı. Aynı analizde kurşuna maruziyet, idiyopatik zihinsel yetersizliğe bağlı DALY’lerin %63,1’ini açıklar; diyabetik nöropati nörolojik durumlar arasında yaşa göre standart DALY’de beşinci sıraya çıkmıştır (GBD 2021 Nervous System Disorders Collaborators, 2024).

**Türkiye’deki saha verileri.** Karabük’teki %4,12 ile Denizli’deki %0,9 (ikisi de 44 yaş üstü, kapı kapı tarama) arasındaki fark büyüktür. Karabük çalışmasının yazarları yüksek oranın, kentteki çelik fabrikasının yol açtığı belgelenmiş hava kirliliğiyle ilişkili olabileceğini tartışır (Padir Şensöz ve ark., 2018). Tek bir şehrin oranı, ülkenin oranı yerine kullanılmamalıdır.`,
    },
  ],
};
