import type { DersBolumu } from '../../../types';
import { KEMIK_RENGI } from './bolum-1-genel';

/** 2. bölüm: kubbenin dikişleri, pterion ve kafatasındaki ölçüm noktaları. */
export const kubbeVeDikisler: DersBolumu = {
  id: 'kubbe-ve-dikisler',
  baslik: 'Kubbe ve dikişler: kemikler nasıl birleşir?',
  bloklar: [
    {
      tur: 'metin',
      md: `Kafatası kemikleri birbirine **dikiş** (*sutura*) denen eklemlerle bağlanır. Dikiş, iki kemiğin arasında kalan dar bir aralıktır ve bu aralığı sıkı, lifli bir bağ dokusu doldurur. Kemik kenarları kıvrıla kıvrıla birbirine geçer; bu girintili çıkıntılı çizgi kemikleri birbirine kilitler ve kafatasını sağlamlaştırır (OpenStax 7.2). Yetişkinde dikişler hareket etmeyen eklemler sayılır; bazıları yine de çok küçük kıpırdamalara izin verebilir (OpenStax 9.2).

Kafatası kubbesinde dört büyük dikiş vardır:

- **Koronal dikiş:** alın kemiğini sağ ve sol yan kafa kemiklerine bağlar; başın üstünü bir kulaktan öbür kulağa doğru aşar.
- **Sagittal dikiş:** iki yan kafa kemiğini tepede, tam orta hatta birleştirir.
- **Lambdoid dikiş:** art kafa kemiğini yan kafa ve şakak kemiklerine bağlar. Ters V biçimiyle Yunan alfabesinin büyük lambda harfine (Λ) benzer; adı da buradan gelir.
- **Skuamöz dikiş:** şakak kemiğinin yassı (skuamöz) kısmını yan kafa kemiğine bağlar.

Dikişlerin buluştuğu bazı noktaların özel adları vardır. Bunların en önemlisi **pterion**dur: şakakta dört kemiğin (alın, yan kafa, şakak ve kama kemiğinin büyük kanadı) buluştuğu, büyük H harfine benzeyen küçük bölge. Pterion kafatasının en zayıf yeridir ve tam iç yüzünde, kafatasını ve beyin zarlarını besleyen bir atardamarın büyük dalı geçer (OpenStax 7.2). Yerini kendi başında bulabilirsin: elmacık kemerinin yaklaşık iki parmak üstünde, elmacık kemiğinin yukarı yükselen kısmının bir başparmak arkasındadır.`,
    },
    {
      tur: 'sahne',
      baslik: 'Pterion: dört kemiğin buluştuğu yer',
      aciklama:
        'Soldan bakıyoruz. Turuncu alın kemiği, mavi yan kafa kemiği, yeşil şakak kemiği ve kırmızı kama kemiğinin büyük kanadı, elmacık kemerinin hemen üstünde bir noktada buluşur: bu nokta pterion’dur. Arkada mavi ile mor kemiğin (art kafa) birleştiği çizgi lambdoid dikiştir.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'sol',
        gizle: ['dil-kemigi', 'atlas', 'aksis'],
        boya: [
          { secici: ['alin-kemigi'], renk: KEMIK_RENGI.alin },
          { secici: ['yan-kafa-kemigi'], renk: KEMIK_RENGI.yanKafa },
          { secici: ['sakak-kemigi'], renk: KEMIK_RENGI.sakak },
          { secici: ['art-kafa-kemigi'], renk: KEMIK_RENGI.artKafa },
          { secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama },
        ],
        etiketler: [
          { yapi: 'alin-kemigi' },
          { yapi: 'yan-kafa-kemigi-sol', metin: 'Yan kafa kemiği' },
          { yapi: 'sakak-kemigi-sol', metin: 'Şakak kemiği' },
          { yapi: 'kama-kemigi', metin: 'Kama kemiği (büyük kanat)' },
          { yapi: 'art-kafa-kemigi' },
          { yapi: 'elmacik-kemigi-sol', metin: 'Elmacık kemiği' },
        ],
      },
      araclar: ['bakis', 'ayristir', 'liste'],
    },
    {
      tur: 'tablo',
      baslik: 'Kubbenin dikişleri',
      sutunlar: ['Dikiş', 'Latince adı', 'Birleştirdiği kemikler', 'Ne zaman kaynaşır?'],
      satirlar: [
        ['Koronal', '*Sutura coronalis*', 'Alın kemiği ile iki yan kafa kemiği', 'Erişkinlikte'],
        ['Sagittal', '*Sutura sagittalis*', 'Sağ ve sol yan kafa kemiği', 'Erişkinlikte (bir derlemeye göre ~22 yaşta)'],
        ['Lambdoid', '*Sutura lambdoidea*', 'Art kafa kemiği ile yan kafa ve şakak kemikleri', 'Erişkinlikte'],
        [
          'Skuamöz',
          '*Sutura squamosa*',
          'Şakak kemiğinin yassı kısmı ile yan kafa kemiği',
          'En geç kapananlardan (bir derlemeye göre ~60 yaşta)',
        ],
        [
          'Metopik',
          '*Sutura metopica*',
          'Bebekteki iki alın kemiği yarımı',
          'Bebeklikte: çoğunlukla ilk yıl içinde (bazı çalışmalarda 14–19. aya kadar)',
        ],
      ],
      not: 'Kaynaklar: OpenStax 7.2; Stanton ve ark. (2022); Vu ve ark. (2001); Pindrik ve ark. (2016). Erişkin dikişlerinin kapanma yaşı kaynaktan kaynağa ve kişiden kişiye değişir.',
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: '**Dört büyük dikiş:** koronal (alın ile yan kafa), sagittal (iki yan kafa), lambdoid (art kafa ile yan kafa), skuamöz (şakak ile yan kafa).\n\n**Pterion:** alın, yan kafa, şakak ve kama kemiklerinin buluştuğu H biçimli bölge; kafatasının en zayıf yeri. İç yüzünden orta meningeal arterin dalı geçer.',
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Bebekte alın kemiği iki yarımdır; aradaki **metopik dikiş** çoğu çocukta ilk yıl içinde kaynaşır. Bazı insanlarda ise hiç kapanmaz ve ömür boyu alnın ortasında bir çizgi olarak kalır; buna **metopizm** denir. Batı Türkiye’de 500 erişkin otopsisini inceleyen bir çalışmada tam metopizm 7 kişide (%1,4) bulundu; Türkiye’deki önceki çalışmalar %4,6 ile %9,3 arasında oranlar bildirmişti. Kapanmamış dikiş, adli olgularda alın kemiği kırığıyla karıştırılabilir (Karabağ ve ark., 2026).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Dikişler neden var, ne zaman kapanır?',
      md: `Dikişler yalnızca birleşme çizgisi değildir: kafatası ile beynin büyümesini eşgüdümler, küçük hareketlere izin verir ve darbeleri sönümler (Stanton ve ark., 2022). Kubbe dikişlerde üç yolla büyür: kemik kenarlarında yeni kemik dokusu (osteoid) birikir, kemik yüzeyinde yapım ve yıkım (yeniden biçimlenme) sürer ve büyüyen beyin kemikleri dışa doğru iter. Dikişin ne zaman kaynaşacağını büyük ölçüde altındaki **sert zar** (*dura mater*) düzenler (Kajdic ve ark., 2018).

Kubbe dikişlerinin çoğu, sinir kabartısı (nöral krest) ve mezoderm kökenli kemiklerin sınırındadır. İki istisna vardır: **metopik dikiş** iki nöral krest kökenli alın kemiğinin, **lambdoid dikiş** ise iki mezoderm kökenli kemiğin (yan kafa ve art kafa) arasındadır (Stanton ve ark., 2022).

**Metopik dikiş** ilk kapanandır. Üç boyutlu BT çalışmasında kapanmanın ilk belirtisi 3. ayda görüldü ve 9 aydan büyük bütün çocuklarda dikiş tamamen kapalıydı (Vu ve ark., 2001). Başka bir çalışmada dikişin kapalı olma oranı 3, 6 ve 9. aylarda sırasıyla %38,5, %69,2 ve %100’dü (Pindrik ve ark., 2016). Kaynaşmanın tamamlanma yaşının ortancası 8,24 ay, sağlıklı çocukların %95’inde 2–14 ay arasıdır (Bajwa ve ark., 2013). Öteki dikişler erişkinlikte kaynaşır: sagittal dikiş ~22, skuamöz dikiş ~60 yaşta (Stanton ve ark., 2022). Bir radyoloji derlemesine göre dikişler genel olarak arkadan öne ve yandan ortaya doğru kaynaşır; metopik dikiş ise önden arkaya kapanır (Kim ve ark., 2016). Kemiklerin kemik dokuyla birbirine kaynaşmasına **sinostoz** denir (OpenStax 9.2).

0–18 aylık sağlıklı çocukların %4’ünde alının ortasında, metopik dikiş boyunca ele gelen hafif bir kabarıklık (**metopik sırt**) bulunur; bu normal bir kapanma çeşididir (Kim ve ark., 2016). Dikişlerin ve bıngıldakların içinde bazen küçük ek kemikçikler olur: bunlara **Wormian (dikiş) kemikleri** denir (Johal ve ark., 2017).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kraniometrik noktalar: kafatasının adresleri',
      sutunlar: ['Nokta', 'Nerede?', 'Neden önemli?'],
      satirlar: [
        [
          'Nasion',
          'Alın ve burun kemiklerini birleştiren dikişin (frontonazal dikiş) orta noktası',
          'Nasion ile bregma arası yaklaşık 12–14 cm’dir.',
        ],
        [
          'Glabella',
          'Alın kemiğinin orta hattaki en ön noktası',
          'Glabella ile opistokranion (orta hattaki en arka belirgin nokta) arası kafatasının ön-arka boyudur: erişkinde yaklaşık 17 cm.',
        ],
        [
          'Bregma',
          'Koronal ve sagittal dikişlerin kesiştiği nokta',
          'Bebekteki ön bıngıldağın yeri. Erişkinde presantral girus (birincil motor kabuk) bregmanın yaklaşık 4,5 cm arkasındadır.',
        ],
        [
          'Lambda',
          'Sagittal ve lambdoid dikişlerin birleştiği nokta',
          'Bregma ile lambda arası, sagittal dikiş boyunca yaklaşık 13 cm’dir.',
        ],
        [
          'Pterion',
          'Alın, yan kafa, şakak ve kama kemiklerinin buluştuğu H biçimli bölge',
          'Kafatasının en zayıf yeri; altında orta meningeal arterin ön dalı. Yenidoğanda sfenoid (ön-yan) bıngıldağın yeri.',
        ],
        [
          'Asterion',
          'Lambdoid, parietomastoid ve oksipitomastoid dikişlerin birleştiği nokta (adı Yunanca “yıldızlı”)',
          'Transvers ve sigmoid sinüslerin birleşme yerinin yaklaşık işareti; arka çukura yandan yaklaşımda kraniotominin üst sınırı. Yenidoğanda mastoid (arka-yan) bıngıldağın yeri.',
        ],
        [
          'İnion',
          'Dış oksipital çıkıntının ele gelen, orta hattaki tepesi',
          'İnion ile asterion arasındaki çizgi transvers sinüsün yerine karşılık gelir.',
        ],
      ],
      not: 'Kaynaklar: Vigo ve ark. (2020); OpenStax 7.2; Uabundit ve ark. (2021); Triantafyllou ve ark. (2025c); Sharma ve ark. (2024); Cowan ve ark. (2023). Uzaklıklar yaklaşık erişkin değerleridir.',
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Kama kemiği: kafatasının kilit taşı',
      aciklama:
        'Kama kemiğine arkadan bakıyoruz; öteki kemikler saydamlaştırıldı. Ortadaki gövdeden iki yana kanatlar açılır ve aşağıya kanat biçimli (pterigoid) çıkıntılar sarkar; bu yüzden kelebeğe ya da yarasaya benzetilir. Büyük ve küçük kanatlar arasındaki yarıklar üst orbital yarıklardır. Kama kemiği alın, yan kafa, kalbur, elmacık, şakak, art kafa, damak ve sapan kemikleriyle eklem yapar (Jamil ve Callahan, 2023). “Bakış” ile alttan ya da üstten de bakabilirsin.',
      sahne: {
        katmanlar: ['kemik', 'yuz'],
        renk: 'dogal',
        bakis: 'arka',
        gizle: ['alt-cene-kemigi', 'dil-kemigi', 'atlas', 'aksis'],
        vurgula: ['kama-kemigi'],
        boya: [{ secici: ['kama-kemigi'], renk: KEMIK_RENGI.kama }],
        etiketler: [{ yapi: 'kama-kemigi' }],
      },
      araclar: ['bakis', 'ayristir', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Pterion ve epidural kanama',
      md: `**Orta meningeal arter** (*arteria meningea media*), dış karotis arterin devamı olan maksiller arterden çıkar, kafatasına foramen spinosumdan girer ve sert zarı besler (Natali ve ark., 2024). Dalları kemiğin iç yüzünde gözle görülen oluklar açar; bu oluklar foramen spinosuma kadar izlenebilir (OpenStax 7.2). Arter en sık pterion düzeyinde yırtılır ve tipik olarak **epidural hematoma** yol açar (Natali ve ark., 2024): kan sert zarın dış yaprağı ile kemiğin iç tablası arasındaki potansiyel boşlukta birikir (Khairat ve ark., 2025) ve BT’de mercek biçiminde görünür (Natali ve ark., 2024).

Bir meta-analizin aktardığı çalışmaya göre pterion merkezli 10 mm yarıçaplı bir daire olguların %68’inde arterin ön dalıyla örtüşür; akut travmatik epidural hematomun en sık nedeni de bu ön daldır (Triantafyllou ve ark., 2025c). Koreli erişkin kafataslarında pterion ortalama 3,19 mm, şakak kemiğinin yassı kısmının orta noktası ise yalnızca 1,96 mm kalınlıktaydı (Hwang ve ark., 1999).

Kemik bükülür ya da kırılırsa sert zar kemikten sıyrılır ve yırtılan damarlardan kanama olur; kanayan damar orta meningeal arter, orta meningeal ven ya da yırtılmış bir toplardamar sinüsü olabilir. Epidural hematom en sık 10–40 yaş arasında görülür; 60 yaşından sonra sert zar iç tablaya sıkıca yapıştığı için seyrektir (Bisen ve ark., 2023). Hematom genellikle sert zarın kemiğe tutunduğu dikişleri, özellikle koronal dikişi aşamaz (Khairat ve ark., 2025). Kanamanın beyni nasıl ittiğini birinci dersin [Kafa içi kanamalar](/beyin-akademisi/anatomi/sinir-sistemine-ilk-bakis?duzey=lisans#koruyanlar-ve-besleyenler) çiziminde görebilirsin.`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Pterion her kafada aynı değil',
      md: `Murphy’nin sınıflamasına göre pterionda kemikler dört biçimde birleşir: **sfenoparietal** (kama ve yan kafa kemikleri doğrudan değer), **frontotemporal** (alın ve şakak kemikleri değer), **stellat** (dört kemik tek noktada buluşur) ve **epipterik** (yan kafa kemiği ile kamanın büyük kanadı arasında küçük bir dikiş kemiği vardır) (Sharma ve ark., 2024). 79 çalışmayı ve 18.694 kafatası yarısını birleştiren meta-analizde sfenoparietal tip %78,54, epipterik %8,41, frontotemporal %5,74 ve stellat %4,26 oranında bulundu. Cinsiyet ve taraf tipi etkilemiyordu; epipterik, frontotemporal ve stellat tiplerin sıklığı ise toplumdan topluma anlamlı olarak değişiyordu (Triantafyllou ve ark., 2025c).

Aynı meta-analizde pterionun elmacık kemerinin orta noktasına uzaklığı ortalama 38,66 mm, frontozigomatik dikişe uzaklığı 31,31 mm idi. Pterionun derin komşuları orta meningeal arterin ön dalı, Broca alanı, insula ve lateral oluktur (Sylvius yarığı). Epipterik kemikler cerrahı yanıltabilir: dikişlerin en öndeki birleşimi yanlışlıkla pterion sanılabilir. Yenidoğanda pterion sfenoid (ön-yan) bıngıldağa karşılık gelir; bu bıngıldak doğumdan 3–6 ay sonra kaybolur (Triantafyllou ve ark., 2025c).

Tay kafataslarında pterion dikişinin tamamen kemikleşmesi (sinostoz) kafatası yarılarının %18,5’inde görüldü ve yalnızca erkeklerdeydi (Uabundit ve ark., 2021). Pterion, beyin cerrahisinde en çok kullanılan yaklaşım olan pterional kraniotominin de merkezidir; bu yaklaşım son bölümde anlatılıyor.`,
    },
  ],
};
