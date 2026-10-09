import type { DersBolumu } from '../../../types';

/** Sahnelerdeki renkler yalnızca bölgeleri tanıtır; anlam taşımaz. Dorsal ve ventral renkleri yön pusulasındakilerle aynıdır. */
const ON_BEYIN = '#5b84f2';
const BEYIN_SAPI = '#a98cf6';
const BEYINCIK = '#f2b544';
const KOMISSUR = '#f2b544';
const BOSLUK = '#5b84f2';
const DORSAL = '#ef5d7b';
const VENTRAL = '#25a993';
const KAUDAT = '#f28a52';
const HIPOKAMPUS = '#25b9a3';
/** Talamus rengi, koordinatlar bölümündeki “Hedeflerin mahallesi” sahnesindekiyle aynıdır. */
const TALAMUS = '#ee6a92';

/** 02. bölüm: sinir ekseni (nöraksis), bükülmesi, Forel ve Meynert eksenleri, beyin sapında ve ara beyinde yön, embriyodaki bükülmeler, eksenin gelişimsel kökeni ve kaynaklar arası farklar. */
export const sinirEkseni: DersBolumu = {
  id: 'sinir-ekseni',
  baslik: 'Beynin ekseni: rostral, kaudal, dorsal, ventral',
  bloklar: [
    {
      tur: 'metin',
      md: `İlk derste kısaca gördük: sinir sisteminde dört yön terimi çok sık geçer. **Rostral** ve **kaudal**, **dorsal** ve **ventral**. Bu dört terim bedene göre değil, bir çizgiye göre söylenir. O çizgi sinir sisteminin kendi eksenidir. Adı **sinir ekseni** ya da **nöraksistir** (*neuraxis*).

Bu eksen embriyoda kurulur. Nöral tüp, sinir sisteminin ön–arka boyutunu belirler. Bu boyutun adı nöraksistir (OpenStax 13.1). Köpek gibi dört ayaklı bir hayvanı düşün. Onun nöral tüpü, burundan kuyruğa uzanan bir eksen boyunca dizilir (OpenStax 13.1). Merkezî sinir sisteminin ortasından geçen hayalî çizgi orada düzdür. Bu yüzden dorsal ve ventral, beyinde de omurilikte de aynı yönü gösterir (Henley, 2021a).

Memelilerde embriyonun sinir sistemi standart bir düzene sahiptir. İnsan iki ayağı üstünde durarak bu düzeni karmaşıklaştırır (OpenStax 13.1). OpenStax bir benzetme önerir. Dört ayaklı bir hayvanı iki ayağı üstüne kaldırdığını düşün. Beyin sapında ve boynun üst ucunda bir bükülme olmasaydı, hayvan öne değil, dümdüz yukarı bakardı (OpenStax 13.1). İnsanda beyin sapı ile ara beyin arasında bir bükülme vardır. Boyunda da bir bükülme vardır. Böylece gözler ve yüz öne bakar (OpenStax 13.1). Henley bu bükülmeyi orta beyin hizasına koyar. Ona göre dik duruş, sinir eksenini orada yaklaşık 90 derece büker (Henley, 2021a).`,
    },
    {
      tur: 'animasyon',
      ad: 'yon-pusulasi',
      baslik: 'Pusulayı eksen boyunca kaydır',
      aciklama:
        'Pusulayı beyinden omuriliğe taşı. Eksen orta beyin hizasında aşağı döner; pusula da onunla birlikte döner. Okların bedendeki yönü değişir, eksene göre yönü değişmez. Üçüncü düğme, önden bakınca iç (medial) ve dış (lateral) yönleri gösterir.',
    },
    {
      tur: 'metin',
      md: `Henley’in sözlüğü dört terimi iki bölge için ayrı ayrı tanımlar (Henley, 2021a):

- **Dorsal:** beynin üstüne ya da omuriliğin arkasına doğru.
- **Ventral:** beynin altına ya da omuriliğin önüne doğru.
- **Rostral:** beynin önüne ya da omuriliğin üstüne doğru.
- **Kaudal:** beynin arkasına ya da omuriliğin altına doğru.

Ekseni bir yol gibi düşün. Yol omuriliğin ucunda, aşağıda başlar. Yukarı çıkar, sonra öne döner ve beynin önünde biter (OpenStax 13.1). Rostral, bu yolda hep beynin ön ucuna doğru gitmektir. Kaudal ise geri dönmektir. Dorsal hep yolun sırt tarafı, ventral hep karın tarafıdır. Yol döndüğü için bu yönlerin bedendeki karşılığı da döner.

Bazı terimler ise hiç dönmez. **Üst** (*superior*) ve **alt** (*inferior*) bütün bedende aynı anlamı taşır (Henley, 2021a). **Ön** (*anterior*) ve **arka** (*posterior*) da insanın anatomik duruşuna göre söylenir (FIPAT, 2019). Bunlar eksenle birlikte dönmez.`,
    },
    {
      tur: 'sahne',
      baslik: 'Eksenin büküldüğü yer',
      aciklama:
        'Beynin sağ yarısı kaldırıldı. Sol yarıya içeriden, orta hattan bakıyoruz; ön taraf ekranın sağında. Mavi: ön beyin (uç beyin ve ara beyin). Mor: beyin sapı (orta beyin, pons ve omurilik soğanı). Sarı: beyincik. Ön beyinde eksen önden arkaya, yani ekranda sağdan sola uzanır. Orta beyinde eksen aşağı döner ve beyin sapı boyunca omuriliğe iner. Bu yüzden rostral, ön beyinde ekranın sağını (önü), beyin sapında yukarıyı gösterir. Dorsal ise ön beyinde yukarıyı, beyin sapında ekranın solunu (arkayı) gösterir. Model eksen çizgisini çizmez; onu yapılar boyunca hayal et.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'sap'],
        renk: 'bolge',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        bakis: 'ic-sol',
        boya: [
          { secici: ['bolge:serebrum', 'bolge:diensefalon'], renk: ON_BEYIN },
          { secici: ['bolge:beyin-sapi'], renk: BEYIN_SAPI },
          { secici: ['beyincik'], renk: BEYINCIK },
        ],
        etiketler: [
          { yapi: 'korpus-kallozum', metin: 'Ön beyin: rostral öne, dorsal yukarı' },
          { yapi: 'orta-beyin', metin: 'Orta beyin: eksen burada bükülür' },
          { yapi: 'pons', metin: 'Beyin sapı: rostral yukarı, dorsal arkaya' },
          { yapi: 'omurilik-sogani', metin: 'Eksen omuriliğe iner' },
        ],
      },
      araclar: ['bakis', 'yarim', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: '“Rostral” nereden gelir?',
      md: 'Rostral sözcüğü Latince *rostrum*’dan gelir. Terminologia Anatomica’nın (TA2) bir notu bu sözcüğün tarihini anlatır. Rostrum, vücut ekseninin baş ucudur. Gelişmiş bir vücutta burnun ya da gaganın kenarında durur. Sözcüğü bu anlamda 1895’teki ilk resmî anatomi listesine Wilhelm His önerdi. His onu dile önemli bir kazanç saydı (FIPAT, 2019). Bugün *rostralis*, baş içinde rostruma yakın ya da ona doğru bir konumu bildirir (FIPAT, 2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Eksene göre terimler, bedene göre terimler.** Henley yön terimlerini iki gruba ayırır. Dorsal ve ventral gibi bazıları merkezî sinir sisteminin eksenine göredir. Bu terimler beyinde başka, bedenin geri kalanında başka yönü gösterir. Üst ve alt gibi ötekiler ise bütün bedende anlamını korur (Henley, 2021a). Dafny farkın kökenini hatırlatır. Bazı terimler dört ayaklıların sinir sistemini anlatmak için geliştirildi. Bunlar iki ayaklıda biraz farklı anlam kazanabilir. Örneğin dört ayaklının omuriliğindeki ventral yüz, insanın ön (anterior) yüzüne karşılık gelir (Dafny, 2020).

TA2 de bu ikiliği tanır ve iki ayrı başlangıç duruşu tanımlar. Birincisi insanın anatomik duruşudur (*positio anatomica*). TA2 onu iki ayak üstünde, dik duruşla ilişkilendirir. İkincisi karşılaştırmalı anatomik duruştur (*positio anatomica comparativa*). Bu da dört ayaklı duruşla ilişkilidir (FIPAT, 2019). Beyin üzerine yazılmış bir metinde iki tür terim yan yana kullanılır. Bu yüzden her terimin bedene mi, eksene mi göre söylendiğine bak.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Aynı terim, dört yerde',
      sutunlar: ['Terim', 'Dört ayaklıda', 'İnsan ön beyninde', 'İnsan beyin sapında', 'İnsan omuriliğinde'],
      satirlar: [
        ['Rostral', 'Burna doğru', 'Öne, yüze doğru', 'Yukarı, ara beyne doğru', 'Yukarı, beyne doğru'],
        ['Kaudal', 'Kuyruğa doğru', 'Beynin arkasına doğru', 'Aşağı, omuriliğe doğru', 'Aşağı'],
        [
          'Dorsal',
          'Sırta doğru; beyinde ve omurilikte aynı yön',
          'Yukarı, beynin tepesine',
          'Arkaya; ör. orta beynin tavanı (tektum)',
          'Arkaya, sırta',
        ],
        [
          'Ventral',
          'Karına doğru; beyinde ve omurilikte aynı yön',
          'Aşağı, beynin alt yüzüne',
          'Öne; ör. orta beynin tabanı',
          'Öne, karına',
        ],
        [
          'Örnek',
          '—',
          'Korpus kallozumun genu’su en rostral, splenium’u en kaudal kısmıdır',
          'Omurilik soğanı rostralde ponsla, kaudalde omurilikle komşudur',
          'Arka (dorsal) boynuz, ön (ventral) boynuz',
        ],
      ],
      not: 'Kaynaklar: dört ayaklıda eksen burundan kuyruğa düz uzanır ve terimler her yerde aynı yönü gösterir (OpenStax 13.1; Henley, 2021a). Ön beyin ve omurilik sütunları Henley’in sözlüğündendir (Henley, 2021a). Beyin sapı: orta beyinde tektum arkada, taban öndedir. Orta beyin rostralde ara beyinle, kaudalde ponsla süreklidir (Dafny, 2020). TA2, üst vestibüler çekirdek için ilişkili ad olarak *cranialis* ve *rostralis*’i de verir (FIPAT, 2019). Yani beyin sapında “üst” ile “rostral” aynı yere bakar. Örnekler: korpus kallozum ve omurilik soğanı (Dafny, 2020). Boynuzların TA2’deki resmî adları *cornu posterius* ve *cornu anterius*’tur. İngilizce eş anlamlıları dorsal ve ventral boynuzdur (FIPAT, 2019).',
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Eksene göre terimler (rostral, kaudal, dorsal, ventral) bölgeye göre yön değiştirir. Bedene göre terimler (üst, alt) değiştirmez (Henley, 2021a).
- Ön beyinde dorsal = üst, rostral = ön (Henley, 2021a). Beyin sapında dorsal = arka (tektum), ventral = ön (taban) (Dafny, 2020).
- Omurilikte iki çift eş anlamlıdır: dorsal = arka, ventral = ön. TA2’nin resmî adı *cornu posterius*’tur (arka boynuz). İngilizce eş anlamlısı dorsal boynuzdur (FIPAT, 2019).
- Korpus kallozumun en rostral kısmı **genu**, kaudal ucu **splenium**dur (Dafny, 2020).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Eksen terimlerinin tarihi.** Bir önceki bölümde Gray’in ön ile ventrali eş tuttuğunu ve 1895 komisyonunun tartışmasını gördük. Bu eşleme gövde için doğrudur. Beyinde ise tutmaz, çünkü orada dorsal ve rostral eksenle birlikte döner (Henley, 2021a). TA2’nin notu, Kölliker’in önerisinin gerekçesini de verir: *anterior* ve *posterior* yalnızca insanın dik duruşuna uyar (FIPAT, 2019). *Rostral* ise başka bir yoldan geldi. Aynı notlara göre bu sözcük, gelişimle ilgili (ontogenetik) bir ifade olarak vazgeçilmez görüldü (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'TA2’de eksen ile beden çatışınca',
      md: `Bir önceki bölümde üst medüller velum örneğini gördük. Dördüncü karıncığın tavanındaki bu ince yaprağın eski adı *velum medullare anterius*’tu. TA2’nin notuna göre bu ad morfolojik gerekçeye dayanır, ama insanda yanıltıcıdır. Bu yüzden TA2 bugün *velum medullare superius* adını kullanır (FIPAT, 2019). Bu, eksene göre ad ile bedene göre ad arasındaki çatışmanın resmî bir örneğidir.

TA2 bazen eksen terimini tanımın içinde kullanır. Bir notu, orta beyin tegmentumunu beyin pedinküllerinin dorsal kısmı diye tanımlar. Tegmentum her yanda kara maddeden (*substantia nigra*) orta beyin su yolunun düzeyine uzanır (FIPAT, 2019). Buradaki “dorsal” bedene göre değil, eksene göredir. Orta beyinde dorsal taraf arkadır (Dafny, 2020).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bükülme tam nerede ve kaç derece?** Kaynaklar yeri biraz farklı söyler. Henley bükülmeyi orta beyin hizasına koyar ve açısını “kabaca 90 derece” diye verir (Henley, 2021a). OpenStax bükülmeyi beyin sapı ile ara beyin arasına yerleştirir. Erişkindeki bu büyük eğriliğe **sefalik fleksura** der (OpenStax 13.1). Puelles’in şemasında eksen, orta beynin altında, sefalik fleksurada karın tarafına (ventrale) bükülür. Eksen pons düzeyinde de daha hafif, sırta doğru (dorsale) bir bükülme gösterir (Puelles, 2024). Üç anlatım aynı bölgeden söz eder. Ama bükülmeyi biraz farklı yere koyar.

Açı için bu dersin taradığı açık kaynaklarda yalnızca Henley’in “kabaca 90 derece” ifadesi bulundu. Yetişkin beyninde ölçülmüş bir eksen açısı bulunamadı. Bu yüzden 90 dereceyi ölçülmüş bir değer gibi değil, kaynağın dediği gibi kaba bir değer olarak oku. İlk derste gördüğümüz gibi Gray aynı adı (sefalik fleksura) embriyodaki ilk bükülmeye verir. OpenStax ise erişkindeki eğriliğe verir.`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Fetüste bir “beyin açısı”',
      md: 'Türkiye’den bir çalışma, fetüste ara beyin–orta beyin bölgesi ile beyin sapı arasında bir açı ölçtü. Yazarlar İstanbul ve Niğde’deki kurumlardandır. Çalışmaya gebeliğin 11+0 ile 13+6. haftaları arasındaki 560 fetüs katıldı. Bu fetüsler trizomi 21 (Down sendromu) açısından yüksek risk grubundaydı. Fetüslerin 45’inde (%8) trizomi 21 bulundu (Karslı ve ark., 2022). Açının bir kolu, talamus ile orta beynin üst (kranial) sınırına teğet geçen çizgidir. Öteki kolu, beyin sapının alt sınırından geçen çizgidir. Yazarlar buna “beyin açısı” dedi. Bu yüksek riskli grupta, açı 94 derece ya da daha büyükken trizomi 21 için duyarlılık %97,8, özgüllük %100 bulundu (Karslı ve ark., 2022). Duyarlılık, hastalığı olanları yakalama oranıdır. Özgüllük, olmayanları doğru ayırma oranıdır. Bu bilgiler yalnızca çalışmanın özetinden alındı.',
    },
    {
      tur: 'metin',
      md: `**Bir değil, iki eksen.** Eksen büküldüğü için beyni tek bir düz çizgiyle anlatamayız. Ön beyinde eksen önden arkaya uzanır (Henley, 2021a). Beyin sapında ise aşağı, omuriliğe doğru iner (OpenStax 13.1). Bu yüzden uzmanlar iki ayrı eksen kullanır. Ön beynin eksenine **Forel ekseni** denir (Rusche ve ark., 2021). Beyin sapının uzun eksenine **Meynert ekseni** denir (Shi ve ark., 2024). Kesitlerin adları da bu eksenlere göre konabilir (Grinberg ve ark., 2011; Coulombe ve ark., 2021).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Forel ekseni: AC’den PC’ye.** Bir lif yolu çalışması, yapıların üç boyutlu yönünü ön beyin eksenine göre verdi. Bu eksene Forel ekseni dedi ve onu Forel ile arkadaşlarının 1875 tarihli çalışmasına dayandırdı. Yönler için rostral–kaudal ve dorsal–ventral terimlerini kullandı (Rusche ve ark., 2021). Aynı çalışma koordinatları milimetre olarak verdi; sıfır noktası ön komissürdü (Rusche ve ark., 2021). Başka bir yazı bu ekseni “Forel’in interkomissural ekseni” diye anar (Grinberg ve ark., 2011). İnterkomissural, iki komissürün arası demektir. Komissür, beynin iki yarısını bağlayan lif demetidir. Burada kastedilen ikisi ön komissür (AC) ve arka komissürdür (PC). Yani Forel ekseni, AC ile PC’yi birleştiren çizginin doğrultusudur.

**Meynert ekseni: beyin sapının boyu.** Bir fetal MR çalışması Meynert eksenini “fetal beyin sapının uzun ekseni” diye tanımladı. Çalışmanın difüzyon tensör görüntüleme (DTI) çekimleri bu eksene dik, aksiyel kesitlerle alındı. Rutin T2 ağırlıklı baş çekimleri ise üç dik düzlemde yapıldı (Shi ve ark., 2024). Beyin sapı atlaslarının bazıları da bu eksene göre kesildi. Olszewski ve Baxter 1954’te insan beyin sapının hücre yapısını ilk kez kapsamlı biçimde anlattı. Kesitleri beyin sapının uzun eksenine enine alınmıştı (Coulombe ve ark., 2021).

Kısacası ön beyin (uç beyin ve ara beyin) Forel eksenine, beyin sapı Meynert eksenine göre tarif edilir. Stereotaksi üzerine bir çalışma da bunu önerdi. Ona göre ön beyin ve arka beyin eksen sistemleri birbirinden bağımsız kullanılmalıdır (Gerdes ve ark., 1975).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'İki eksenin buluştuğu yer',
      aciklama:
        'Sağ yarım kaldırıldı. Derin yapılara ve beyin sapına içeriden bakıyoruz; ön taraf ekranın sağında. Sarı: ön komissür (AC) ve arka komissür (PC). İkisini birleştiren hayalî çizgi ön beyin eksenidir (Forel ekseni). Mor: beyin sapı. Onun uzun ekseni Meynert eksenidir; omuriliğe doğru aşağı iner. Mavi: karıncık sisteminin boşlukları (üçüncü karıncık, orta beyin su yolu, dördüncü karıncık). Pembe: talamus. Talamus ve korpus kallozum yer bulmaya yardım eder; öteki yapılar soluk. Model eksen çizgilerini çizmez. İki çizgiyi yapıların üstünde hayal et ve aralarındaki açıya bak.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik'],
        renk: 'yapi',
        goster: [
          'on-komissur',
          'arka-komissur',
          'talamus',
          'hipotalamus',
          'mamiller-cisimler',
          'epifiz',
          'korpus-kallozum',
          'bolge:beyin-sapi',
          'ucuncu-karincik',
          'beyin-su-yolu',
          'dorduncu-karincik',
        ],
        vurgula: [
          'on-komissur',
          'arka-komissur',
          'talamus',
          'korpus-kallozum',
          'bolge:beyin-sapi',
          'ucuncu-karincik',
          'beyin-su-yolu',
          'dorduncu-karincik',
        ],
        boya: [
          { secici: ['on-komissur', 'arka-komissur'], renk: KOMISSUR },
          { secici: ['bolge:beyin-sapi'], renk: BEYIN_SAPI },
          { secici: ['ucuncu-karincik', 'beyin-su-yolu', 'dorduncu-karincik'], renk: BOSLUK },
          { secici: ['talamus'], renk: TALAMUS },
        ],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'on-komissur', metin: 'Ön komissür (AC)' },
          { yapi: 'arka-komissur', metin: 'Arka komissür (PC)' },
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'orta-beyin', metin: 'Orta beyin: eksen burada döner' },
          { yapi: 'pons', metin: 'Beyin sapı ekseni (Meynert)' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Hangi bölge, hangi eksen, hangi kesit?',
      sutunlar: ['Bölge', 'Tarifte kullanılan eksen', 'Eksene dik kesitin adı', 'Kaynak'],
      satirlar: [
        [
          'Uç beyin ve ara beyin',
          'Ön beyin ekseni (Forel; AC–PC doğrultusu)',
          'Frontal ya da koronal kesit',
          'Grinberg ve ark., 2011; Dafny, 2020',
        ],
        [
          'Talamus',
          'AC–PC çizgisi (interkomissural çizgi)',
          'Koronal kesit; Mai ve Majtanik’in karşılaştırdığı atlasların dördü dışında hepsinde bu çizgiye aşağı yukarı dik',
          'Mai ve Majtanik, 2019',
        ],
        ['Beyin sapı', 'Beyin sapının uzun ekseni (Meynert)', 'Transvers (enine) kesit', 'Coulombe ve ark., 2021; Shi ve ark., 2024'],
        ['Omurilik', 'Omuriliğin uzun ekseni', 'Transvers kesit; başın horizontal düzlemine düşer', 'Dafny, 2020'],
      ],
      not: 'UTHealth ders kitabının örnek kesitleri bu düzeni izler. Omurilikte ve beyin sapında transvers, uç beyin ve ara beyinde koronal kesitler kullanılır. Orta beyin ile ara beynin birleşiminden geçen kesitte kitap, kesit düzleminin öncekilerden farklı olduğunu ayrıca belirtir (Dafny, 2020). Forel eksenine dik bir frontal kesit, orta beynin rostral kısmını da gösterebilir (Grinberg ve ark., 2011).',
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Aynı kesite iki ad',
      md: 'Beyin sapı kesitlerinin adı kaynaktan kaynağa değişir. Gray ponsun üst kısmından geçen bir kesite “koronal kesit” der. Aynı kitap orta beyin pedinkülü için “transvers kesit” ifadesini kullanır (Gray, 1918). UTHealth’in nöroanatomi laboratuvarı sitesi, bütün beyin dilimi dizisinde pons ile omurilik soğanının birleşiminden geçen kesite de “koronal” der (Byrne ve Dafny, 2026). UTHealth ders kitabı ise beyin sapı kesitlerine “transvers” der (Dafny, 2020). Olszewski–Baxter geleneği de kesitleri beyin sapının uzun eksenine enine alır (Coulombe ve ark., 2021). Bu yüzden kesitin adına değil, hangi eksene dik alındığına bak. Bütün beyni koronal dilimleyen bir dizide “koronal” adlı kesit, beyin sapını kendi eksenine dik kesmeyebilir.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Eponim eksenler ve tanım farkları.** Forel ve Meynert eksenleri TA2’de yer almaz. Kişi adıyla anılan (eponim) kullanımlardır. Özgün tanımları veren eski metinler bu ders için açık erişimde bulunamadı. Bu eksenleri, onları kullanan güncel çalışmalardan tanıyoruz. Bu çalışmalar da ekseni farklı adlarla anar. Rusche ve arkadaşları “ön beyin ekseni” der (Rusche ve ark., 2021). Grinberg ve arkadaşları “interkomissural eksen” der (Grinberg ve ark., 2011). İki yazı da aynı kişinin adını kullanır. Ama ekseni belirleyen AC–PC çizgisinin bile atlastan atlasa farklı tanımları vardır. Bu farklar beyin cerrahisi ile beyin görüntüleme toplulukları arasında tutarsızlığa yol açar (Selvaraj ve ark., 2026). Tanımları bu dersin koordinat sistemleri bölümünde ayrıntılı göreceğiz.

Ön beynin içinde de her yapı aynı eksene uymaz. Talamusun ana ekseni güçlü biçimde kıvrıktır. Bu yüzden ana (kardinal) düzlemlerdeki kesitlerde komşu çekirdekler eğik kesilir. Yan çekirdekler üst üste biniyormuş gibi görünür (Mai ve Majtanik, 2019).

Mai ve Majtanik birçok talamus atlasının koronal kesitlerini yan yana koydu. Dördü dışında hepsinde kesitler AC–PC çizgisine aşağı yukarı diktir. O dört atlasta kesitler bu düzleme göre 22 dereceye kadar eğiktir: Hopf, Feremutsch–Simma, Hirai–Jones ve Ding (Mai ve Majtanik, 2019). Makaledeki Ding atlası, Ding ve arkadaşlarının 2016 tarihli atlasıdır (Mai ve Majtanik, 2019). Coulombe ve arkadaşları bu atlası Allen insan beyni atlası diye anar. Onlara göre bu atlasın kesitleri AC–PC düzlemine diktir (Coulombe ve ark., 2021). Yani iki kaynak bu atlasın kesit düzleminde ayrılır.`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Forel ve Meynert adlarını karıştırma',
      sutunlar: ['Ad', 'Neyi anlatır?', 'Kaynak'],
      satirlar: [
        ['Forel ekseni', 'Ön beyin ekseni; interkomissural (AC–PC) eksen', 'Rusche ve ark., 2021; Grinberg ve ark., 2011'],
        [
          'Forel alanları (H, H1, H2)',
          'Lif alanları. TA2 aralarındaki hücre gruplarına *nuclei campi perizonalis* der; “fields of Forel” ilişkili addır',
          'FIPAT, 2019',
        ],
        ['Forel çaprazlaşması', 'Ön tegmental çaprazlaşma (*decussatio tegmentalis anterior*)', 'FIPAT, 2019'],
        ['Forel’in “subthalamus”u, 1877', 'Bugünkü “hipotalamus” adının öncülü; hipotalamus adını His 1893’te getirdi', 'Puelles, 2019'],
        ['Meynert ekseni', 'Beyin sapının uzun ekseni', 'Shi ve ark., 2024'],
        ['Meynert çaprazlaşması', 'Arka tegmental çaprazlaşma (*decussatio tegmentalis posterior*)', 'FIPAT, 2019'],
        ['Meynert çekirdeği', 'Bazal çekirdek (*nucleus basalis*); Ch4 kolinerjik hücre grubu', 'FIPAT, 2019'],
      ],
      not: 'Forel ve Meynert eksenleri TA2’de ayrı birer terim değildir. Öteki kişi adları TA2’de eş anlamlı ya da ilişkili ad olarak geçer (FIPAT, 2019).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Beyin sapına kendi düzlemi: PMJ.** Coulombe ve arkadaşları bir beyin sapı atlası hazırladı. Atlası, ponto-mezensefalik bileşke düzlemine (PMJ) göre kestiler. Bu düzlem, pons ile orta beynin birleştiği yerden geçer ve iki noktayı birleştirir. Arkadaki nokta, dört tepeciğin oluşturduğu plağın alt yüzüdür. Öndeki nokta, iki pedinkül arasındaki çukurda bulunan kör deliktir (*foramen caecum*) (Coulombe ve ark., 2021). Yazarlar açı farklarını da tahmin etti. PMJ düzlemi ile AC–PC düzlemi arasında yaklaşık 10 derece fark vardır. PMJ ile Paxinos ve arkadaşlarının 2020 tarihli atlasının düzlemi arasında ise 20 derece fark vardır (Coulombe ve ark., 2021). Kısacası beyin sapı ile ön beyin aynı düzleme göre kesilmez. Atlasların düzlemleri de birbirini tutmaz.

Bu atlas tek bir beyne dayanır: 61 yaşında bir kadının 1328 g’lık beyni. Beyin sapı orta hattın 1 mm yanından sagital olarak ayrıldı. Bloklar 50 mikrometre kalınlığında kesildi. Plaklar arasındaki ortalama aralık 1,1 mm’dir (Coulombe ve ark., 2021). Yazarlar doku büzülmesini yaklaşık %4 buldu. Bireyler arasındaki farkların dikkatle hesaba katılması gerektiğini de vurgular (Coulombe ve ark., 2021).`,
    },
    {
      tur: 'sayilar',
      duzey: 'ileri',
      baslik: 'Eksenler ve düzlemler arasındaki açılar',
      ogeler: [
        { deger: '~90', birim: 'derece', aciklama: 'İnsanda sinir ekseninin orta beyin hizasındaki bükülmesi (kaba değer; Henley, 2021a)' },
        { deger: '~10', birim: 'derece', aciklama: 'PMJ düzlemi ile AC–PC düzlemi arasındaki fark (tahmin; Coulombe ve ark., 2021)' },
        {
          deger: '~20',
          birim: 'derece',
          aciklama: 'PMJ düzlemi ile Paxinos ve arkadaşlarının 2020 atlasının düzlemi arasındaki fark (tahmin; Coulombe ve ark., 2021)',
        },
        {
          deger: '22',
          birim: 'dereceye kadar',
          aciklama: 'Dört talamus atlasında kesitlerin interkomissural düzleme eğimi (Mai ve Majtanik, 2019)',
        },
      ],
      not: 'Kolumnar ve prozomerik modeller de ön beynin rostral kısmında ekseni kabaca 90 derece farkla tanımlar (Puelles, 2019).',
    },
    {
      tur: 'animasyon',
      ad: 'eksen-acilari',
      duzey: 'ileri',
      baslik: 'Eksenler ve kesit düzlemleri şemada',
      aciklama:
        'Forel ve Meynert eksenlerini, bunlara dik kesitleri, PMJ ile AC–PC düzlemi arasındaki açıyı ve embriyodaki üç bükülmeyi şemada gör.',
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Atlaslar hangi eksene göre kesildi?',
      sutunlar: ['Atlas', 'Kesit düzlemi', 'Not', 'Kaynak'],
      satirlar: [
        [
          'Olszewski–Baxter atlası, 1954',
          'Beyin sapının uzun eksenine enine',
          'Stereotaksik koordinat yok; bu yüzden birçok cerrah Schaltenbrand atlasına dayandı',
          'Coulombe ve ark., 2021',
        ],
        [
          'Paxinos–Huang atlası, 1995',
          'Beyin sapının uzun eksenine dik',
          'Stereotaksik atlas; 64 histolojik kesit. 2020’deki gözden geçirilmiş baskısında 159 plaka vardır',
          'Coulombe ve ark., 2021',
        ],
        [
          'Afshar ve arkadaşları, 1978',
          'Dördüncü karıncığın tabanı, orta hat ve fastigium (karıncık tavanının tepesi) hizasında tabana dik bir düzlem',
          'Beyin sapı ve beyincik çekirdekleri için stereotaksik başvuru',
          'Coulombe ve ark., 2021',
        ],
        [
          'Schaltenbrand–Bailey atlası, 1959',
          'Koronal, sagital ve horizontal kesitler',
          'Gerdes ve arkadaşları atlasın sagital şemalarını inceledi; şemalar Meynert ekseninin konumunda uç bir çeşitlemeyi gösterir',
          'Antonios ve ark., 2026; Gerdes ve ark., 1975',
        ],
        [
          'Coulombe ve arkadaşları, 2021',
          'PMJ düzlemi',
          'Tek beyin; AC–PC’den ~10°, Paxinos ve arkadaşlarının 2020 atlasının düzleminden ~20° farklı',
          'Coulombe ve ark., 2021',
        ],
        [
          'Mai ve Majtanik’in karşılaştırdığı talamus atlasları',
          'AC–PC çizgisine aşağı yukarı dik koronal',
          'Dört atlas dışında böyle; o dördünde 22°’ye kadar eğik. Coulombe ve arkadaşları bunlardan Ding’in Allen atlasını AC–PC düzlemine dik sayar',
          'Mai ve Majtanik, 2019; Coulombe ve ark., 2021',
        ],
      ],
      not: 'Schaltenbrand atlasları için 111 beyin incelendi (Selvaraj ve ark., 2026; Antonios ve ark., 2026). Ama 1977 tarihli Schaltenbrand–Wahren atlasının kesitleri yalnızca iki beyinden yapıldı (Conti ve ark., 2023; Antonios ve ark., 2026). Beyin görüntüleme topluluğu büyük ölçüde MNI uzayına geçti. Beyin cerrahları ise büyük ölçüde Schaltenbrand uzayına dayanmayı sürdürüyor (Selvaraj ve ark., 2026). Gerdes ve arkadaşlarının çalışması yalnızca özetinden okundu.',
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Stereotakside iki eksen sistemi',
      md: `Gerdes ve arkadaşlarının 1975 tarihli çalışması, beynin röntgen incelemelerini stereotaksiye temel yapmayı amaçladı. Yazarlar Schaltenbrand–Bailey atlasının sagital şemalarını inceledi. Bu şemaların, Meynert ekseninin konumunda uç bir çeşitlemeyi temsil ettiğini buldular. Arka beyin için ayrı bir eksen sistemi seçtiler. Dördüncü karıncığın yapıları için de bağımsız bir eksen sistemi kurdular. Bu sistem iki çizgiden oluşur: dördüncü karıncığın tabanı ve ponsun üst kenarına teğet bir çizgi. Önerileri açıktı: stereotaksik işlemlerde ön beyin ve arka beyin eksen sistemleri birbirinden bağımsız kullanılmalıdır (Gerdes ve ark., 1975).

Aynı çalışma bir hata kaynağı da bildirdi. Hava girdiğinde, sırtüstü yatan hastada bütün yapılar birkaç milimetre art kafaya (oksipitale) doğru kayabilir (Gerdes ve ark., 1975). Bu bilgiler çalışmanın yalnızca özetinden alındı.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Atlas plakası MR’a oturmuyor',
      oyku: 'Beyin cerrahisi asistanı Kerem, beyin sapında küçük bir hedefe ulaşmayı planlıyor. Hastanın MR’ı, AC–PC çizgisine hizalanmış aksiyel kesitlerden oluşuyor. Kerem, ponto-mezensefalik bileşke (PMJ) düzlemine göre kesilmiş bir beyin sapı atlasını açıyor. Atlas plakasını MR kesitinin üstüne koyunca çekirdeklerin sınırları kayıyor. Plakadaki bir çekirdek, MR’da iki komşu kesite dağılmış görünüyor.',
      soru: 'Uyuşmazlığın en olası nedeni nedir ve Kerem ne yapmalıdır?',
      cozum:
        'İki görüntü farklı eksenlere göre kesilmiş. MR kesitleri ön beynin eksenine, yani AC–PC çizgisine göre alınmış. Atlas ise beyin sapının kendi düzlemine, PMJ düzlemine göre kesilmiş. Atlasın yazarları iki düzlem arasında yaklaşık 10 derece fark tahmin eder. PMJ ile Paxinos ve arkadaşlarının 2020 tarihli atlasının düzlemi arasındaki fark ise 20 dereceye çıkar (Coulombe ve ark., 2021). Birbirine eğik iki düzlem aynı çekirdeği farklı biçimde keser. Bu yüzden plaka ile kesit üst üste oturmaz. Gerdes ve arkadaşları da stereotakside ön beyin ve arka beyin eksen sistemlerinin bağımsız kullanılmasını önermişti (Gerdes ve ark., 1975). Kerem önce atlasın hangi düzleme göre kesildiğine bakmalıdır. Sonra MR’ı o düzleme göre yeniden dilimlemeli ya da aynı düzlemi kullanan bir atlas seçmelidir. Bir şeyi de unutmamalıdır: bu atlas tek bir beyne dayanır. Bireyler arası farklar dikkatle hesaba katılmalıdır (Coulombe ve ark., 2021). *Vaka eğitim için kurgulanmıştır.*',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Beyin sapında yön.** Yukarıdaki “Aynı terim, dört yerde” tablosunda beyin sapının parçalarının eksen boyunca sıralandığını gördük. Orta beyin rostralde ara beyinle, kaudalde ponsla süreklidir. Yaklaşık 2 cm uzunluğundadır ve beyin sapının en küçük parçasıdır (Dafny, 2020). Dorsal–ventral doğrultuda beyin sapı üç kata ayrılır. En dorsalde, karıncık sisteminin dorsalinde bir tavan vardır: tektum. Onun altında merkezî bir öz bulunur: tegmentum. En ventralde büyük bir lif kütlesi uzanır (Coulombe ve ark., 2021). Orta beyinde tektum arkada, taban öndedir (Dafny, 2020). Yani beyin sapında dorsal arkaya, ventral öne bakar. Bunun nedeni eksenin kendisidir. Beyin sapının uzun ekseni aşağı, omuriliğe doğru iner (OpenStax 13.1). Ona dik olan dorsal–ventral doğrultu da bedende arka–ön doğrultusuna düşer.

**Ara beyinde yön.** Ara beyin hangi eksene uyar? Bu soru, ara beynin nereye sayıldığına da bağlıdır. UTHealth ders kitabına göre ara beyin, beyin sapının en rostral yapısıdır. Büyük beynin alt yüzüne gömülüdür. Arka komissür, ara beyin ile orta beyin arasındaki sınır işaretidir (Dafny, 2020). TA2 ise ara beyni beyin sapına koymaz. TA2’de beyin sapı (*truncus encephali*) omurilik soğanı, pons ve orta beyinden oluşur. Ara beyin büyük beynin (*cerebrum*) parçasıdır (FIPAT, 2019). Bu ders TA2’yi izler. Ara beyin kesitleri de genellikle ön beyin eksenine göre alınır. Mai ve Majtanik’in karşılaştırdığı talamus atlaslarında da koronal kesitler, dördü dışında, AC–PC çizgisine aşağı yukarı diktir (Mai ve Majtanik, 2019).

**C biçimli yapılar.** Bazı yapılarda “rostral” yerel olarak yön değiştirir. Kaudat çekirdek, ara beynin rostral ucundan kaudal ucuna bir yay çizer. Kuyruğu önce aşağı, sonra yeniden rostrale döner (Byrne ve Dafny, 2026). Kuyruğun ucundaki “rostral”, başındaki “rostral” ile bedende aynı yöne bakmaz.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Beyin sapında dorsal arkadır',
      aciklama:
        'Büyük beyin ve beyincik kaldırıldı. Beyin sapına soldan bakıyoruz; ön taraf ekranın solunda. Pembe: orta beynin tavanı (tektum), yani üst ve alt tepecikler. Yeşil: beyin ayakları; modelin listesi bunlara serebral pedinkül der. Tavan arkada, ayaklar öndedir. Yani beyin sapında dorsal arkaya, ventral öne bakar. Eksen yukarıdan aşağı uzanır: rostral uçta talamus (ara beyin), kaudal uçta omurilik soğanı vardır. Mavi: orta beyin su yolu ve dördüncü karıncık. Pembe ve yeşil, yön pusulasındaki dorsal ve ventral oklarının renkleridir.',
      sahne: {
        katmanlar: ['derin', 'sap', 'karincik'],
        renk: 'yapi',
        goster: ['bolge:beyin-sapi', 'talamus', 'beyin-su-yolu', 'dorduncu-karincik'],
        boya: [
          { secici: ['ust-tepecik', 'alt-tepecik'], renk: DORSAL },
          { secici: ['serebral-pedinkul'], renk: VENTRAL },
          { secici: ['beyin-su-yolu', 'dorduncu-karincik'], renk: BOSLUK },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'ust-tepecik-sol', metin: 'Tektum: dorsal, arkada' },
          { yapi: 'serebral-pedinkul-sol', metin: 'Beyin ayağı: ventral, önde' },
          { yapi: 'talamus-sol', metin: 'Talamus: rostral uçta' },
          { yapi: 'pons', metin: 'Pons' },
          { yapi: 'omurilik-sogani', metin: 'Omurilik soğanı: kaudal uçta' },
          { yapi: 'dorduncu-karincik', metin: 'Dördüncü karıncık' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Orta beynin dorsali nerede?',
      oyku: 'Tıp fakültesi öğrencisi Elif, nöroloji stajında bir MR raporu okuyor. Raporda “orta beynin dorsalinde küçük bir odak” yazıyor. Elif, ön beyinde dorsalin yukarı demek olduğunu hatırlıyor. Bu yüzden odağı orta beynin en üst ucunda, ara beyne yakın yerde arıyor.',
      soru: 'Elif odağı nerede aramalıydı?',
      cozum:
        'Orta beyin beyin sapının parçasıdır. İnsanda sinir ekseni orta beyin hizasında kabaca 90 derece bükülür (Henley, 2021a). Eksen burada aşağı, omuriliğe doğru döner (OpenStax 13.1). Bu yüzden beyin sapında dorsal arkayı gösterir. Orta beyinde tavan (tektum) arkada, taban öndedir (Dafny, 2020). Tektum, karıncık sisteminin dorsalindeki tavandır (Coulombe ve ark., 2021). Tepecikler (kollikuluslar) tektumu oluşturur ve orta beyin su yolunun arkasında durur (Byrne ve Dafny, 2026). Yani Elif odağı su yolunun arkasında, tepeciklerin bulunduğu tavan bölgesinde aramalıydı. Orta beynin ara beyne yakın ucu ise rostral ucudur. Orta beyin orada ara beyinle sürer (Dafny, 2020). *Vaka eğitim için kurgulanmıştır.*',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Bükülmeler embriyoda başlar.** İlk derste üç bükülmeyi adlarıyla gördük. Burada eksene ne yaptıklarına bakalım. Gray’e göre beyin, nöral tüpün ön ucundan gelişir. Bu uç erken dönemde üç birincil kesecik hâlinde genişler. Bölümler eşit hızda büyümez. Bu yüzden üç bükülme oluşur ve embriyonun beyni kendi üstüne zikzak çizerek kıvrılır (Gray, 1918). İlk iki bükülme karın tarafına (ventrale) içbükeydir. Bütün başın benzer bükülmeleriyle birlikte oluşur (Gray, 1918).

İlk bükülme orta beyin bölgesinde belirir. Gray buna ventral sefalik fleksura der. Bu bükülmede ön beyin, notokordun ön ucunun ve ön bağırsağın çevresinde karın tarafına kıvrılır. Notokord, embriyonun sırt boyunca uzanan destek çubuğudur. Sonunda ön beynin tabanı, arka beynin tabanına neredeyse paralel olur (Gray, 1918). Bu bükülme bir süre orta beyni beynin en çıkıntılı parçası yapar. Çünkü orta beynin dorsal yüzü eğrinin dış (dışbükey) yüzüne denk gelir (Gray, 1918).

İkinci bükülme arka beyin ile omuriliğin birleştiği yerdedir: servikal fleksura. Gray’e göre beşinci haftadan sonra baş dikleşir. Bu bükülme de azalır ve kaybolur (Gray, 1918). Üçüncüsü gelecekteki pons bölgesindeki pontin fleksuradır. Ötekilerden iki yönden ayrılır: dışbükeyliği öne bakar ve başı etkilemez (Gray, 1918). Puelles’in şemasında da eksen pons düzeyinde hafifçe dorsale bükülür (Puelles, 2024).

Yetişkinde ne kalır? Henley’e göre erişkin insanda eksen orta beyin hizasında kabaca 90 derece kırılır (Henley, 2021a). OpenStax da insanda boyunda bir bükülme anlatır (OpenStax 13.1). Gray’in kaybolduğunu söylediği servikal fleksura ise embriyodaki arka beyin–omurilik açısıdır. İki kaynak farklı dönemleri anlatır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üç bükülme ve eksen',
      sutunlar: ['Bükülme', 'Yeri', 'Yönü', 'Sonrası', 'Kaynak'],
      satirlar: [
        [
          'Sefalik (Gray’de ventral sefalik)',
          'Orta beyin bölgesi',
          'Ventrale içbükey; ön beyin notokordun ucunun çevresinde aşağı kıvrılır',
          'Bir süre orta beyin en çıkıntılı kısımdır; ön ve arka beynin tabanları neredeyse paraleldir',
          'Gray, 1918',
        ],
        [
          'Servikal',
          'Arka beyin ile omuriliğin birleşimi',
          'Ventrale içbükey; 5. haftanın sonunda neredeyse dik açı',
          'Baş dikleşince azalır ve kaybolur',
          'Gray, 1918',
        ],
        ['Pontin', 'Gelecekteki pons bölgesi', 'Dışbükeyliği öne bakar', 'Başın biçimini etkilemez', 'Gray, 1918'],
      ],
      not: 'Haftalar Gray’in dönemindeki yaşlandırmaya dayanır. Erişkinde eksen orta beyin hizasında kabaca 90 derece kırılır (Henley, 2021a). OpenStax bu erişkin kırılmasına da sefalik fleksura der (OpenStax 13.1). Puelles’e göre sefalik fleksura bütün omurgalı beyinlerinin değişmez bir özelliğidir (Puelles, 2019).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Eksen bükülür, harita bozulmaz.** His’in klasik şemasında belirgin bir sefalik fleksura vardır. Nöral tüpün uzun şeritleri, yani taban, bazal, alar ve tavan plakları, bu bükülmenin çevresinde kıvrılır. Bu, beynin uzun ekseninin de büküldüğünü gösterir (Puelles, 2019). Moleküler işaretler de aynı şeyi söyler. Nkx2.2 genini ifade eden bir şerit, nöral plak evresinde belirir. Bu, nöral tüpün ekseni bükülmeye başlamadan öncedir. Sefalik fleksura oluşurken şeridin komşuluk düzeni (topolojisi) değişmez (Puelles ve Rubenstein, 2015). Yani bükülme biçimi değiştirir, komşulukları değiştirmez.

Puelles’e göre sefalik fleksura bütün omurgalı beyinlerinin değişmez bir özelliğidir (Puelles, 2019). Bu, “dört ayaklıda eksen düzdür” anlatımıyla ilk bakışta çelişir (Henley, 2021a). Farkın bir nedeni, eksenin nasıl tanımlandığıdır. Henley merkezî sinir sisteminin ortasından geçen hayalî bir çizgiyi anlatır. Prozomerik model ise uzun eksenini orta hattaki taban plağına dayandırır. Taban plağının oluşmasını erken dönemde notokord tetikler (Puelles, 2024). Herrick’in 1910’da önerdiği kolumnar modelde de eksen düz varsayılmıştı. Puelles’e göre bu varsayım sefalik fleksurayla açıkça çelişir. Üstelik o eksen, görünür bir işarete dayanmayan kuramsal bir yapıydı (Puelles, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Embriyoda büyümeyi ölçmek',
      md: 'Gray bükülmeleri bölümlerin eşit olmayan büyümesine bağlar (Gray, 1918). Bugün insan embriyoları MR ile ölçülebiliyor. Kyoto Koleksiyonu’ndaki embriyolardan alınan 177 MR verisi incelendi. Carnegie evresi 17 ile 23 arasında beyin keseciklerinin uzunluğu ölçüldü. Carnegie evreleri, embriyoyu görünüşüne göre basamaklara ayıran bir sıralamadır. Uzunluk evre 17’de 29,83 ± 2,52 mm, evre 23’te 49,31 ± 6,66 mm idi. Uzama hızı sırt (dorsal) yüzde, karın (ventral) yüzdekinden yaklaşık 4,2 kat yüksekti (Nakashima ve ark., 2012). Başka bir çalışma, evre 13 ile 23 arasındaki 101 embriyoda beyin dokusunun hacmini ölçtü. Hacim evre 13’te 1,15 ± 0,43 mm³ idi. Evre 23’te 189,10 ± 36,91 mm³ oldu; bu, 164,4 katlık bir artıştır. Evre 23’te ön beynin ve arka beynin taban (bazal) bölgeleri, sırt bölgelerinden kalındı (Shiraishi ve ark., 2015). İki çalışmanın yalnızca özetleri okundu. Özetler, ölçülen büyüme farkını bükülmelere bağlamaz.',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Bir bükülme daha: uç beyin.** González-López ve arkadaşları bir bükülme daha anlatır: yarımkürelerin bükülmesi, yani telensefalik fleksura. Erken embriyoda yarımküreler arkada önce aşağıya (ventrale), sonra öne (rostrale) bükülür. Böylece “C” biçimini alır. Temporal lob, ilkel uç beynin arka kutbundan gelişir (González-López ve ark., 2022). Bu kıvrılma operkulumu (Latince “kapak”) ve ileride oluşacak Sylvius yarığını yapar (González-López ve ark., 2022). Sonunda yarımkürelerin iç ve alt bölgeleri, ara beyni ve beyin sapının üst kısımlarını örter (González-López ve ark., 2022).

C biçimli yapılarda eksen dili de zorlaşır. Bu yapılarda “rostral” yerel olarak döner. Kaudat çekirdeğin kuyruğu buna örnektir (Byrne ve Dafny, 2026).

Türler arasında başka bir ad farkı da var. Hipokampusun uzun eksenine kemirgende genellikle ventral–dorsal eksen denir. İnsanda buna karşılık gelen değişimin ön–arka eksen boyunca olduğu düşünülür (Vogel ve ark., 2020). Kemirgen beyniyle karşılaştırmayı bu dersin ilerleyen bir bölümünde göreceğiz.`,
    },
    {
      tur: 'sahne',
      duzey: 'ileri',
      baslik: 'Uç beynin C biçimli yapıları',
      aciklama:
        'Sol yarımküreye soldan bakıyoruz; ön taraf ekranın solunda. Kabuk gizlendi; derin yapılar görünüyor. Turuncu: kaudat çekirdek. Başı önde durur, gövdesi arkaya uzanır, kuyruğu aşağı ve yeniden öne döner. Mavi: yan karıncık. Turkuaz: hipokampus; uzun ekseni önden arkaya uzanır. Soluk yapılar yer bulmak için gösterildi. Kaudat çekirdeğin yayını baştan kuyruğa izle: kuyruğun ucundaki “rostral”, başındakiyle bedende aynı yöne bakmaz.',
      sahne: {
        katmanlar: ['derin', 'karincik'],
        renk: 'yapi',
        gizle: ['bolge:sinir'],
        yarim: 'sol',
        vurgula: ['kaudat-cekirdek-sol', 'hipokampus-sol', 'yan-karincik-sol'],
        boya: [
          { secici: ['kaudat-cekirdek'], renk: KAUDAT },
          { secici: ['hipokampus'], renk: HIPOKAMPUS },
          { secici: ['yan-karincik'], renk: BOSLUK },
        ],
        bakis: 'sol',
        etiketler: [
          { yapi: 'kaudat-cekirdek-sol', metin: 'Kaudat çekirdek: kuyruğu aşağı ve öne döner' },
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
          { yapi: 'hipokampus-sol', metin: 'Hipokampus: uzun ekseni önden arkaya' },
        ],
      },
      araclar: ['bakis', 'katman', 'liste'],
    },
    {
      tur: 'metin',
      md: `**Dorsal ve ventral nereden gelir?** Nöral tüpün yalnızca ön–arka boyutu yoktur. Bir de sırt–karın, yani dorsal–ventral boyutu vardır. Tüp yüzeydeki ektodermden ayrılırken yüzeye yakın tarafı dorsal olur. Derindeki tarafı ventral olur (OpenStax 13.1). Yani dorsal ve ventral, en baştan tüpün kendi yüzlerine verilmiş adlardır. Tüp büküldükçe bu yüzler de onunla birlikte bükülür (Puelles, 2019). Ad değişmez, bedendeki yönü değişir. Ön beyinde dorsal yüz yukarı, omurilikte arkaya bakar (Henley, 2021a).

Bükülme de embriyoda başlar. Gelişen beynin bölümleri eşit hızda büyümez. Bu yüzden embriyonun beyni, ilk haftalarda kendi üstüne zikzak çizerek kıvrılır (Gray, 1918). Bükülmelerin adlarını ilk derste görmüştük.

İlk derste gördüğümüz gibi bu iki yüzün işi de farklıdır. Omurilik gelişirken dorsal dokular duyuyla, ventral dokular hareketle ilişkili olur (OpenStax 13.1).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sınır oluğu: dorsal ile ventralin sınırı.** Gray’e göre nöral tüpün yan duvarları kalınlaşır. Sırt ve karın bölümleri ince kalır; bunlara tavan ve taban plağı denir (Gray, 1918). Kanalın en geniş yeri, yan duvarı ikiye ayırır: dorsalde alar, ventralde bazal lamina (Gray, 1918). His’in modelinde bu dört şerit, yani taban, bazal, alar ve tavan plakları, bütün nöral tüp boyunca paralel uzanır. Eksenin bükülmelerine de uyar (Puelles, 2024).

TA2’de aktarılan bir His notu bu sınırı çekirdeklerle ilişkilendirir. Sınır oluğu (*sulcus limitans*), tüpün ventral ve dorsal yarısını ayırır. Bütün hareket (motor) çekirdekleri bu oluğun ventralinde ya da iç (medial) yanındadır. Duyu yapıları ise dorsalinde ya da dış (lateral) yanındadır (FIPAT, 2019). Notun iki yönü birlikte andığına dikkat et: ventral ile iç, dorsal ile dış. TA2 sınır oluğunu bugün dördüncü karıncığın tabanındaki eşkenar dörtgen çukurun (*fossa rhomboidea*) bir yapısı olarak listeler (FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Dorsal–ventral örüntü: karşıt kutuplardan gelen sinyaller.** Omurgalı nöral tüpünde örüntü, karşıt kutuplardan yayılan molekül eğimlerine (gradyan) dayanır. Meyve sineğinin (*Drosophila*) erken embriyosunda da durum aynıdır (Briscoe ve Small, 2015). Nöral tüpte öncül hücre alanları dorsal–ventral eksen boyunca sıralanır: p0–p3, pMN ve pd1–pd6 (Briscoe ve Small, 2015). Shh adlı sinyal, hücrelerde bir Gli etkinlik eğimi oluşturur. Bu eğime yanıt olarak ventral transkripsiyon etkenleri açılır: Nkx6.1, Olig2, Nkx2.2. Dorsal olanlar ise baskılanır: Pax3, Pax7, Pax6, Msx1, Irx3 (Briscoe ve Small, 2015). Transkripsiyon etkeni, genleri açıp kapatan proteindir. Notokord, taban ve bazal plağın oluşmasını tetikleyen (indükleyen) bilinen etkendir. Böylece nöral duvarın ventral kısmı ventralleşir (Puelles ve Rubenstein, 2015).

**Rostral–kaudal örüntü: nöromerler.** Merkezî sinir sisteminin gelişiminde kritik bir olay, nöral tüpün ön–arka ekseni boyunca nöromerlere bölünmesidir. Nöromerler, enine daralmalarla birbirinden ayrılan biçim birimleridir (Hidalgo-Sánchez ve ark., 2022). Otx2 geni gelişen sinir sistemine ön konum kimliği verir (Hidalgo-Sánchez ve ark., 2022). Prozomerik modelde ön beyin alanları Otx2’nin denetimindedir. İstmus (r0) ve r1, FGF8 ile Gbx2’nin etkisindedir. Pontin, retropontin ve medüller rombomerler ile omurilik ise Hox genlerinin sinyallerine uyar (Puelles, 2024). Fgf8 başlangıçta yalnızca istmik rombomerde (r0) ifade edilir. Bu, arka beynin en rostral birimidir ve orta beyinle sınır yapar (Puelles, 2024). İstmik nöromer, beyinciğin orta hattaki bölümünü, yani vermisi de oluşturur (Puelles, 2024).`,
    },
    {
      tur: 'tablo',
      duzey: 'ileri',
      baslik: 'Eksen boyunca kimlik veren sinyaller',
      sutunlar: ['Eksen', 'Bölge', 'Sinyal ya da gen', 'Kaynak'],
      satirlar: [
        ['Rostral–kaudal', 'Ön beyin alanları', 'Otx2 (ön konum kimliği)', 'Puelles, 2024; Hidalgo-Sánchez ve ark., 2022'],
        ['Rostral–kaudal', 'İstmus (r0) ve r1', 'FGF8 ve Gbx2; Fgf8 başlangıçta yalnızca r0’da', 'Puelles, 2024'],
        [
          'Rostral–kaudal',
          'Pontin (r2–r4), retropontin (r5, r6), medüller (r7–r11) rombomerler ve omurilik',
          'Hox genleri',
          'Puelles, 2024',
        ],
        [
          'Dorsal–ventral',
          'Ventral (taban ve bazal plak)',
          'Notokordun etkisi; Shh’nin Gli eğimiyle Nkx6.1, Olig2, Nkx2.2 açılır',
          'Puelles ve Rubenstein, 2015; Briscoe ve Small, 2015',
        ],
        ['Dorsal–ventral', 'Dorsal', 'Pax3, Pax7, Pax6, Msx1, Irx3; Gli eğimine yanıt olarak baskılanır', 'Briscoe ve Small, 2015'],
      ],
      not: 'Gen adlarının yazımı kaynaklardaki gibidir. Prozomerik modelde temel gelişim birimleri, ön–arka nöromer dizisi ile dorsal–ventral şeritlerin dama tahtası gibi kesişimleridir (Puelles, 2024).',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Eksen nerede biter? Kolumnar ve prozomerik model.** Beyin uzun bir yapıdır. Bu yüzden konum tariflerini ve kesit düzlemlerini yönlendiren bir uzun eksen tanımlanmalı ve gerekçelendirilmelidir (Puelles, 2024). İki model bu ekseni farklı çizer. Herrick 1910’da amfibi ve sürüngenler için kolumnar modeli önerdi. Kuhlenbeck modeli genişletti (Puelles, 2019). Herrick’e göre beynin uzun ekseni ve onun işareti olan sınır oluğu, preoptik girintide değil, uç beyinde biter (Puelles, 2019). Preoptik girinti, üçüncü karıncığın önündeki küçük bir ceptir.

Prozomerik model ise eksen için molekülce tanımlanmış taban plağını ve alar–bazal sınırını kullanır (Puelles, 2019). Puelles ve Rubenstein’a göre kolumnar model ön beyne uygulandığında yanlıştır. Çünkü eksenin uç beyinde bittiği varsayımı keyfidir (Puelles ve Rubenstein, 2015). İki model yan yana konunca, ön beynin rostral kısmında eksen tanımları kabaca 90 derece ayrılır. Orta beynin sınırları da farklı çizilir (Puelles, 2019).

Bu fark yön terimlerini doğrudan etkiler. Puelles’e göre ön beyindeki dorsal, ventral, rostral, kaudal, ön ve arka gibi tanımlayıcılar farklı eksene göre yeniden ayarlanmalıdır (Puelles, 2019). Prozomerik modelde ara beyin tümüyle hipotalamusun kaudalindedir. Bazal plak da uç beyne uzanmaz (Puelles, 2019). Örneğin subtalamik çekirdek bu modelde bazal hipotalamusta yer alır. Mamiller cisimlerin kaudalindeki (retromamiller) bölgeden gelir. Klasik anlatım ise onu ara beyne koyar (Puelles, 2019). Adlar bile eski bakışı taşır. “Hipotalamus” sözcüğünü His 1893’te getirdi. Daha önce Forel’in 1877’de kullandığı “subthalamus” adı geçerliydi (Puelles, 2019). İki ad da bölgeyi talamusun “altına” koyar.

Model, birimleri bir dama tahtası gibi tanımlar. Ön–arka nöromer dizisi ile dorsal–ventral şeritler kesişir. Her kesişim temel bir gelişim birimidir (Puelles, 2024). Her nöromerin kendi tavan, alar, bazal ve taban şeridi vardır (Puelles ve Rubenstein, 2015). Bu kesişim en az 4 × 20 = 80 temel birim verir. Omuriliğin nöromerleri bu sayıya dahil değildir. Puelles bunların insanda 30’dan fazla olduğunu yazar (Puelles, 2024).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Beyin sapına yeni bakış.** Beyin sapı geleneksel olarak üçe bölünür: orta beyin, pons ve omurilik soğanı. Watson ve arkadaşlarına göre bu bölme yalnızca insan beyin sapının dış görünüşüne dayanır. Yazarlar en önemli hataları şöyle sıralar (Watson ve ark., 2019):

- ponsun arka beynin üst yarısını kapladığı inancı,
- istmusun arka beynin ilk segmenti olarak tanınmaması,
- ara beyin yapılarının orta beyne katılması.

Onlara göre beyin sapının doğal anatomisini anlamanın yolu, rostral–kaudal segment düzenini kavramaktır. Dorsal–ventral farklılaşma da unutulmamalıdır (Watson ve ark., 2019).

Bu bakışta beyin sapı iki mezomer, istmus ve 11 rombomerden oluşur. Bu segmentlerin sınırları, farklı kesit düzlemlerinde ilk kez kapsamlı olarak Puelles ve arkadaşlarının 2007 tarihli civciv atlasında gösterildi (Watson ve ark., 2019). Bazı segmentler “imza” çekirdekleriyle tanınır. Örneğin istmusta troklear çekirdek, r5’te abdusens çekirdeği bulunur (Watson ve ark., 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Prozomer modeline itirazlar',
      md: `Prozomerik model tek görüş değildir. Manning ve arkadaşlarına göre ön beynin gelişimsel düzeni tartışmalıdır. Bulguları, yaygın kabul gören prozomer modeline meydan okur. Ön beynin ön kısmının segmentlere ayrıldığını da desteklemez (Manning ve ark., 2025). Yazarlara göre model büyük ölçüde fare embriyosundaki gen ifade örüntülerine dayanır. Gerçek segment sınırlarının klasik bir özelliği soy kısıtlamasıdır. Bu, sınırın iki yanındaki hücre soylarının birbirine karışmaması demektir. Talamus içi sınır bölgesinin (*zona limitans intrathalamica*, ZLI) önündeki varsayılan prozomer sınırlarında böyle bir kısıtlama gösterilmemiştir (Manning ve ark., 2025). Yazarlar ekseni de farklı tanımladı. Ön–arka ekseni hipotalamustaki NKX2-2 ifade alanına paralel, dorsal–ventral ekseni ona dik aldılar (Manning ve ark., 2025).

Aynı ekibin bir derlemesi de benzer şeyi söyler. Moleküler genetik ve görüntülemedeki ilerlemeler, açık segment sınırlarının varlığını ve ön beyin eksenlerinin konumunu sorgulatmıştır. Yazarlar yerine “üç parçalı hipotalamus” modelini önerir (Place ve ark., 2026). Bu derlemenin yalnızca özeti okundu.

Puelles de terimlerin kalıcı olmadığını kabul eder. Ona göre terimler kuram, varsayım ve kabuller taşır. Veri tabanları tanımlayıcıların anlamını sonsuza dek sabitlememelidir (Puelles, 2019). Bu ders anatomi kitaplarının klasik yön dilini kullanır. Gelişim biyolojisinde ise eksenin ön beyinde nasıl uzandığı hâlâ tartışılıyor.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kaynaklar nerede ayrılıyor?',
      sutunlar: ['Konu', 'Bir kaynak', 'Öteki kaynak', 'Nasıl okumalı?'],
      satirlar: [
        [
          'Ara beyin beyin sapında mı?',
          'UTHealth: beyin sapının en rostral yapısı (Dafny, 2020)',
          'TA2: büyük beynin parçası; beyin sapı orta beyin, pons ve omurilik soğanıdır (FIPAT, 2019)',
          'Bu ders TA2’yi izler',
        ],
        [
          'Ön = ventral mi?',
          'Gray: eş anlamlı (Gray, 1918)',
          'Beyinde ventral aşağıyı gösterir (Henley, 2021a)',
          'Gövde için doğru, beyin için değil',
        ],
        [
          'Rostral = ön mü?',
          'UTHealth: rostral ve ön, yüze ve buruna doğrudur (Dafny, 2020)',
          'Omurilikte rostral yukarı, başa doğrudur (Henley, 2021a)',
          'Beyin için doğru, omurilik için değil',
        ],
        [
          '“Sefalik fleksura” neyin adı?',
          'Gray: embriyoda orta beyin bölgesindeki ilk bükülme (Gray, 1918)',
          'OpenStax: erişkinde beyin sapı ile ön beyin arasındaki eğrilik (OpenStax 13.1)',
          'Hangi dönemden söz edildiğine bak',
        ],
        [
          'Bükülme nerede?',
          'Henley: orta beyin hizasında (Henley, 2021a)',
          'OpenStax: beyin sapı ile ara beyin arasında (OpenStax 13.1); Puelles: orta beynin altında (Puelles, 2024)',
          'Aynı bölge, biraz farklı sınır',
        ],
        [
          'Beyin sapı kesitinin adı',
          'Gray: hem koronal hem transvers (Gray, 1918); UTHealth laboratuvar sitesi: koronal (Byrne ve Dafny, 2026)',
          'UTHealth ders kitabı: transvers (Dafny, 2020)',
          'Kesitin hangi eksene dik olduğuna bak',
        ],
      ],
      not: 'Bir kaynağı okurken önce şunu sor: bu kaynak bedene mi, eksene mi göre konuşuyor? Hangi dönemi, embriyoyu mu erişkini mi anlatıyor?',
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Resmî listenin içinde bile.** TA2 beyin sapı için *truncus encephali* terimini kullanır. TA2 bu terimin notunu 1977 tarihli eski bir listeden aktarır: Nomina Anatomica’nın 4. baskısından (NA4). Nota göre terim, “beyin sapı” kavramı için o baskıda yeni getirilmişti. Terim omurilik soğanını, ponsu ve orta beyni kapsar (FIPAT, 2019). Ama TA2’nin bir başka notu yetişkin beynini *cerebrum*, *truncus cerebri* ve *cerebellum* diye böler (FIPAT, 2019). Yani aynı kavram için iki Latince ad geçer. Resmî listede bile durum buysa, her metinde hangi bölgenin, hangi eksenin ve hangi tanımın kullanıldığını ayrıca kontrol etmek gerekir.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Sinir ekseni (nöraksis):** omuriliğin ucundan başlar, orta beyin hizasında kabaca 90° öne döner ve beynin önünde biter.

**Rostral ve kaudal** eksen boyunca ön ve arka uçtur. **Dorsal ve ventral**, nöral tüpün sırt ve karın yüzüdür. Eksen döndüğü için bedendeki karşılıkları da döner: ön beyinde dorsal yukarı, beyin sapında ve omurilikte arkaya bakar.

**Üst, alt, ön ve arka** dönmez; insanın anatomik duruşuna göre söylenir.

**İki eksen:** ön beyin için Forel ekseni, beyin sapı için Meynert ekseni (beyin sapının uzun ekseni).`,
    },
  ],
};
