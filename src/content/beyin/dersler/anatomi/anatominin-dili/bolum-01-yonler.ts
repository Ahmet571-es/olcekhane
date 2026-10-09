import type { DersBolumu } from '../../../types';

/** 01. bölüm: anatomik duruş, yatış biçimleri, zıt yön çiftleri ve TA2 adları, Türkçe karşılıklar, taraf terimleri, yaygın karışıklıklar. */
export const durusVeYonler: DersBolumu = {
  id: 'durus-ve-yonler',
  baslik: 'Anatomik duruş ve yön terimleri',
  bloklar: [
    {
      tur: 'metin',
      md: `İlk derste yön dilini kısaca gördük. Bu bölümde onu baştan ve ayrıntılı kuruyoruz. Önce bir soru: “Kulağın üstünde bir şişlik var” denince şişlik tam olarak nerededir? Kulağın hemen üstünde mi, yoksa başın tepesinde mi? Gündelik dil böyle durumlarda belirsiz kalır.

Anatomi dili bu belirsizliği gidermek için vardır. Amacı kafa karıştırmak değildir. Amacı, söyleneni kesinleştirmek ve tıbbi hataları azaltmaktır (OpenStax 1.6). Haritalarda kuzey çoğunlukla yukarıdadır. Bu sayede herkes haritayı aynı biçimde okur. Anatomide de herkes aynı başlangıç duruşunu kullanır. Bu duruşa **anatomik duruş** denir (OpenStax 1.6).`,
    },
    {
      tur: 'metin',
      md: `Anatomik duruşta kişi dik durur. Başı diktir, gözleri karşıya bakar. Kolları yanlarındadır ve avuç içleri öne dönüktür (Gray, 1918; Ankara Üniversitesi, 2017). Kaynaklar ayrıntıda biraz ayrılır. Örneğin OpenStax kolları iki yana açık çizer. Ayakları da omuz genişliğinde ve paralel tarif eder (OpenStax 1.6). Bir Türkçe ders notu ise topukları bitişik tarif eder (Ankara Üniversitesi, 2017). Ortak çekirdek hep aynıdır: dik duruş, yüz önde, avuç içleri önde.

Uluslararası anatomi terimlerinin listesi *Terminologia Anatomica*’dır. Bugünkü 2. baskısına kısaca **TA2** denir. TA2’de bu duruşun resmî adı *positio anatomica*’dır (FIPAT, 2019). Türkçe ders kaynakları ona **normal anatomik pozisyon** da der (Cömert, t.y.-b). Bütün anatomik tanımlar, bu duruştaki bir insana göre yapılır (Ankara Üniversitesi, 2017).`,
    },
    {
      tur: 'metin',
      md: `Beden gerçekte nasıl durursa dursun, yön terimleri onu anatomik duruştaymış gibi anlatır (OpenStax 1.6). Bir örnek düşün. Hasta MR cihazında sırtüstü yatıyor ve alnı tavana bakıyor. Yine de alın tarafına **ön** denir, tavan tarafına değil. Ense tarafı da **arka**dır, yatak tarafı değil.

Yatan bedeni anlatan iki ayrı terim vardır. **Yüzüstü** yatışta (*positio prona*) yüz aşağı bakar. **Sırtüstü** yatışta (*positio supina*) yüz yukarı bakar (OpenStax 1.6; FIPAT, 2019). Türk Dil Kurumu yüzüstüyü “yüzü yere gelecek biçimde” diye tanımlar. Sırtüstü ise “sırtı yerde olmak üzere” demektir (TDK, 2026). Bu terimler bazen muayenede ve ameliyatta hastanın konumunu anlatmak için kullanılır (OpenStax 1.6). Hasta yan yatıyorsa buna **yan yatış** denir (Ernstmeyer ve Christman, 2024). Kısacası yatışın adı değişir, yönlerin adı değişmez.`,
    },
    {
      tur: 'sahne',
      baslik: 'Yönleri modelde dene',
      aciklama:
        'Beyne soldan bakıyoruz. Ön (anterior) taraf ekranın solunda, arka (posterior) taraf sağındadır. Yukarısı üst (superior), aşağısı alt (inferior) yöndür. Renkler lobları birbirinden ayırır. Bakış düğmeleriyle beyni önden, arkadan, üstten ve alttan gör. Her bakışta alın tarafını ve ense tarafını bul. Görüntü dönse de yönlerin adı değişmez: yönler ekrana göre değil, bedene göre söylenir.',
      sahne: {
        katmanlar: ['kabuk', 'sap'],
        renk: 'lob',
        bakis: 'sol',
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: `Yön terimleri çoğunlukla zıt çiftler hâlinde gelir. İlk resmî anatomi terimleri listesi 1895’te kabul edildi. O listenin kurallarından biri de sıfatları birbirinin karşıtı olarak sıralamaktı (Barker, 1907). En sık kullanılan çiftler ve beyinden örnekleri şunlardır:

- **Üst** (*superior*) daha yukarıda, başa doğru demektir. **Alt** (*inferior*) daha aşağıda, ayaklara doğru demektir (OpenStax 1.6; Henley, 2021a). Orta beynin arka yüzündeki iki tümsek çiftinin adı bu çiftten gelir: **üst tepecik** (*colliculus superior*) ve **alt tepecik** (*colliculus inferior*) (FIPAT, 2019).
- **Ön** (*anterior*) yüze, **arka** (*posterior*) sırta doğrudur (OpenStax 1.6; Henley, 2021a). **Orta beyin su yolu** (*aquaeductus mesencephali*), orta beyinden geçen dar bir kanaldır (Gray, 1918; FIPAT, 2019). Tepecikler bu kanalın arkasında durur (Byrne ve Dafny, 2026).
- **İç yan** (*medialis*) orta hatta, **dış yan** (*lateralis*) yana doğrudur (OpenStax 1.6). İç kapsül, beyin kabuğuna gelen ve kabuktan çıkan liflerin geçtiği yoğun bir beyaz cevher demetidir. Kabuktan beyin sapına ve omuriliğe inen lifler de buradan geçer (Byrne ve Dafny, 2026). Onun orta hatta en yakın kısmına dirsek (*genu*) denir (Byrne ve Dafny, 2026).
- **Orta hatta** (*medianus*) olan yapı, bedeni sağ ve sol yarıya ayıran orta düzlemin üstündedir (Gray, 1918; FIPAT, 2019). Üçüncü karıncık ve epifiz bezi böyle orta hat yapılarıdır (Liao ve ark., 2018).
- **Yüzeysel** (*superficialis*) bedenin yüzeyine yakın, **derin** (*profundus*) yüzeyden uzak demektir. Örneğin beyin, kafatasına göre derindedir (OpenStax 1.6).
- **Yakın** (*proximalis*) ve **uzak** (*distalis*), uzuvlarda bir noktanın uzvun bağlandığı uca olan uzaklığını anlatır (Gray, 1918).
- **Merkezî** (*centralis*) ve **çevresel** (*periphericus*) de bir çifttir (FIPAT, 2019). Merkezî sinir sistemi ve çevresel sinir sistemi adları bu çiftten gelir.
- **Sağ** (*dexter*) ve **sol** (*sinister*) de bir çifttir (FIPAT, 2019; Ankara Üniversitesi, 2017). Sağ, kişinin kendi sağıdır. Ona bakan kişinin sağı değildir. Beyin görüntülemesiyle uğraşanların çoğu da “sağ” derken hep hastanın sağını kasteder (NiBabel, t.y.-a).`,
    },
    {
      tur: 'metin',
      md: `Bu çiftleri beynin içinde görmek için kabuğu saydam yapalım. İlk derste gördüğümüz gibi, büyük beynin yüzeyini gri cevherden bir kabuk örter. Kabuğun altında, beyaz cevherin derininde gri adacıklar vardır: kabuk altı çekirdekler. Yani kabuk yüzeyseldir, bu çekirdekler derindir. Aşağıdaki sahnede çekirdeklere yukarıdan bak. Hangisi orta hatta yakın, hangisi uzak?`,
    },
    {
      tur: 'sahne',
      baslik: 'Yüzeyden derine, orta hattan yana',
      aciklama:
        'Beyne yukarıdan bakıyoruz: ön taraf ekranın üstünde, hastanın sağı ekranın sağındadır. Etiketler sol yarıdadır, yani ekranın solunda. Kabuk saydam yapıldı; yüzeydedir (yüzeysel). İçinde derin çekirdekler görünür (derin). Mavi: talamus. Orta hatta yakındır, iç yanda kalır (medial). Turuncu: putamen. Talamusun dış yanında kalır (lateral). Yeşil: kaudat çekirdek; öne doğru uzanır. Sarı: üçüncü karıncık. İki talamusun arasında, tam orta hattadır. Bakış düğmesiyle beyne önden ve yandan da bak.',
      sahne: {
        katmanlar: ['kabuk', 'derin', 'karincik'],
        renk: 'dogal',
        goster: ['katman:kabuk', 'talamus', 'putamen', 'kaudat-cekirdek', 'ucuncu-karincik'],
        saydam: ['katman:kabuk'],
        boya: [
          { secici: ['talamus'], renk: '#4f7cf0' },
          { secici: ['putamen'], renk: '#f28a52' },
          { secici: ['kaudat-cekirdek'], renk: '#25a993' },
          { secici: ['ucuncu-karincik'], renk: '#f2b544' },
        ],
        bakis: 'ust',
        etiketler: [
          { yapi: 'ust-frontal-girus-sol', metin: 'Kabuk: yüzeysel' },
          { yapi: 'talamus-sol', metin: 'Talamus: medial' },
          { yapi: 'putamen-sol', metin: 'Putamen: lateral' },
          { yapi: 'kaudat-cekirdek-sol', metin: 'Kaudat çekirdek' },
          { yapi: 'ucuncu-karincik', metin: 'Üçüncü karıncık: orta hat' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: `Beyinle ilgili belirtilerde taraf çok önemlidir. Taraf için üç kavram kullanılır (Ernstmeyer ve Christman, 2024):

- **Aynı taraf** (*ipsilateral*): bir şeyle aynı yanda olan.
- **Karşı taraf** (*kontralateral*): öbür yanda olan.
- **Tek yanlı** (*unilateral*) ve **iki yanlı** (*bilateral*): bir bulgunun bedenin yalnızca bir yanında mı, iki yanında birden mi olduğunu söyler.

İlk derste hareket komutunu taşıyan yolun büyük ölçüde karşı tarafa geçtiğini görmüştük. Bu yüzden nörolojik muayenede sağ ile sol karşılaştırılır. Sağ ve sol yan arasındaki bir güç farkı, iki hareket yolundan birinin bozulduğunu düşündürür (OpenStax 16.4).`,
    },
    {
      tur: 'animasyon',
      ad: 'yon-ciftleri',
      baslik: 'Zıt yön çiftleri beyinde',
      aciklama:
        'Çizimde beş görünüm var. Dördünde zıt yön çiftlerini görürsün: üst–alt ile ön–arka, iç yan–dış yan, yüzeysel–derin, aynı taraf–karşı taraf. Beşincisinde hasta sırtüstü yatar: yön adlarının değişmediğini gör.',
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Türkçede “iç” iki anlama gelir',
      md: `Türkçe ders kaynakları iki ayrı Latince terimi aynı sözcükle karşılar. *Medialis* “içte olan”, *internus* ise “iç” diye çevrilir (Ankara Üniversitesi, 2017). Oysa ikisi farklı şeyler anlatır:

- *Medialis*: orta hatta daha yakın olan. Türk Dil Kurumu da “iç” sözcüğüne “merkeze daha yakın olan” anlamını verir (TDK, 2026).
- *Internus*: iç olan. Gray, *internus* ve *externus*’u neredeyse yalnızca boşlukların ve içi boş organların duvarları için kullanır (Gray, 1918).

**İç kapsül** (*capsula interna*) ve **dış kapsül** (*capsula externa*) adlarında da *internus* ve *externus* geçer (FIPAT, 2019). Ama bu iki ad kuralın dışında kalır. İki kapsül de bir boşluğun duvarı değil, beyaz cevherden birer tabakadır. Mercek biçimli çekirdek (*nucleus lentiformis*) beynin derinindeki bir gri adacıktır. İç kapsül bu çekirdeğin iç yanında, dış kapsül dış yanında durur (Gray, 1918; Byrne ve Dafny, 2026). Karışıklığı önlemek için *medialis* yerine **iç yan**, *lateralis* yerine **dış yan** de. Ya da doğrudan **medial** ve **lateral** de.`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Anatomik duruş:** dik duruş, baş dik, avuç içleri önde. Yönler hep bu duruşa göre söylenir. Hasta nasıl yatarsa yatsın bu kural değişmez.

**Yatış:** yüzüstü (*prona*) ve sırtüstü (*supina*) yalnızca yatış biçimini anlatır. Yönlerin adını değiştirmez.

**Çiftler:** üst–alt, ön–arka, iç yan–dış yan, yüzeysel–derin, yakın–uzak, merkezî–çevresel, sağ–sol. Tam orta hat: *medianus*.

**Taraf:** aynı taraf (ipsilateral), karşı taraf (kontralateral), tek yanlı ve iki yanlı (bilateral).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Barclay 1803’te yalnızca konum ve yön terimleri üzerine bir kitap yazdı. Ona göre “üst” ve “alt” sözcükleri ancak bedenin hep aynı konumda durduğu varsayılırsa işe yarar (Barclay, 1803). 1881’de Wilder çarpıcı bir benzetme yaptı. Yerçekimine dayanan yön sözcüklerini ölçüt almayı, bir evin yerini Jüpiter gezegenine göre tarif etmeye benzetti (Wilder, 1881).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Anatomik duruş: kaynaklar neyi farklı söyler?',
      sutunlar: ['Kaynak', 'Kollar ve avuçlar', 'Ayaklar', 'Baş ve bakış'],
      satirlar: [
        ['Gray (1918)', 'Yanlara sarkık; avuç içleri öne dönük', '—', '— (yalnızca dik duruş)'],
        ['OpenStax 1.6', 'İki yana açık; avuç içleri öne dönük', 'Omuz genişliğinde, paralel; parmaklar önde', '—'],
        ['OpenStax 9.5 (aynı kitap)', 'Gövdenin yanında; avuç içleri öne dönük', '—', '—'],
        ['Open RN (Ernstmeyer ve Christman, 2024)', 'İki yana açık; avuç içleri öne dönük', 'Omuz genişliğinde, paralel', '—'],
        [
          'Ankara Üniversitesi ders notu (2017)',
          'Aşağı sarkık; avuç içleri öne dönük',
          'Topuklar bitişik',
          'Baş dik; gözler öne ve karşıya bakar',
        ],
        [
          'TA2 (FIPAT, 2019)',
          'Tanım metni yok',
          'Tanım metni yok',
          'İlişkili terimler: iki ayak üstünde (*positura bipedalis*) ve dik (*positura erecta*) duruş',
        ],
      ],
      not: '— : bu kaynakta söz edilmez. Ortak çekirdek: dik duruş, yüz önde, avuç içleri önde. Aynı kitabın iki bölümü bile kolları farklı çizer (OpenStax 1.6; OpenStax 9.5). TA2 duruşu bir tanım metniyle değil, adı ve ilişkili terimleriyle verir.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `TA2’de “insan bedeninin duruşları” başlığı altında yalnızca dört terim vardır. Bunlar anatomik duruş, karşılaştırmalı anatomik duruş, yüzüstü ve sırtüstü yatıştır (FIPAT, 2019). **Karşılaştırmalı anatomik duruş** (*positio anatomica comparativa*), TA2’de dört ayaklı duruşla (*positura quadrupedalis*) ilişkilendirilir. TA2 onun için bir tanım metni vermez. Adı ve ilişkili terimi, karşılaştırmalı anatomiye işaret eder (FIPAT, 2019). Yan yatış ise TA2’nin duruş terimleri arasında yoktur.

TA2, ön–arka ve üst–alt çiftleri için ayrı birer not düşer. Bu terimler standart, geleneksel dik insan duruşuna göredir (FIPAT, 2019). Yani adın kaynağı hep dik insandır. Muayene masasında yatan hasta da, MR cihazındaki hasta da bu dik insana göre anlatılır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Zıt çiftler: TA2 adları ve beyinden örnekler',
      sutunlar: ['Türkçe', 'TA2 (kimlik no.)', 'İngilizce', 'Beyinden örnek'],
      satirlar: [
        ['Üst / alt', '*superior* (18) / *inferior* (19)', 'superior / inferior', 'Üst ve alt tepecik (*colliculus superior / inferior*)'],
        [
          'Ön / arka (“önde olan” / “arkada olan”)',
          '*anterior* (12) / *posterior* (13)',
          'anterior / posterior',
          'Ön ve arka komissür (*commissura anterior / posterior*)',
        ],
        [
          'Karın tarafı / sırt tarafı',
          '*ventralis* (14) / *dorsalis* (15)',
          'ventral / dorsal',
          'Beyinde dorsal “yukarı”, omurilikte “arka” demektir',
        ],
        [
          'Baş tarafı / kuyruk tarafı',
          '*cranialis* (20) / *caudalis* (21)',
          'cranial / caudal',
          'Üst vestibüler çekirdeğin ilişkili adları: *cranialis*, *rostralis*',
        ],
        ['Buruna doğru', '*rostralis* (22)', 'rostral', 'Beyinde “öne doğru”'],
        [
          'İç yan / dış yan (“içte olan” / “dışta olan”)',
          '*medialis* (10) / *lateralis* (11)',
          'medial / lateral',
          'Medial ve lateral genikulat cisim',
        ],
        ['Orta hatta (“ortada bulunan”)', '*medianus* (4)', 'median', 'Dördüncü karıncığın orta açıklığı (*apertura mediana*)'],
        ['Ara (“iki şey arasında olan”: iç yan ile dış yan arası)', '*intermedius* (9)', 'intermediate', '—'],
        ['Orta (ön ile arka ya da iç ile dış arası)', '*medius* (25)', 'middle', '—'],
        [
          'İç / dış',
          '*internus* (30) / *externus* (29)',
          'internal / external',
          'İç ve dış kapsül (*capsula interna / externa*); kuralın istisnası',
        ],
        [
          'Yüzeysel / derin (“yüzeyel” / “derin”)',
          '*superficialis* (32) / *profundus* (33)',
          'superficial / deep',
          'Beyin kafatasına göre derindir',
        ],
        [
          'Yakın / uzak (“vücut merkezine yakın / uzak”)',
          '*proximalis* (34) / *distalis* (35)',
          'proximal / distal',
          'Uzuvlar için konmuş bir çift',
        ],
        ['Merkezî / çevresel', '*centralis* (36) / *periphericus* (37)', 'central / peripheral', 'Merkezî ve çevresel sinir sistemi'],
        ['Sağ / sol', '*dexter* (7) / *sinister* (8)', 'right / left', 'Kişinin kendi sağı ve solu'],
        ['Aynı taraf / karşı taraf', 'Genel terimler listesinde yok', 'ipsilateral / contralateral', 'Belirtinin hasara göre yanı'],
      ],
      not: 'Kaynaklar: Latince ve İngilizce adlar ile örnek yapı adları FIPAT (2019). Tırnak içindeki Türkçe karşılıklar Ankara Üniversitesi (2017) ders notundandır; öteki Türkçe karşılıklar bu dersindir. Beyin ve omurilikteki anlamlar Henley (2021a); “kişinin kendi sağı” NiBabel (t.y.-a). İç ve dış kapsül, Gray’in (1918) kuralının istisnasıdır. TA2 kimlik numaraları, TA2’nin satır numaralarıdır. Bu numaralar kalıcı değildir; başka sürümlerle eşleştirirken dikkat gerekir (Pretterklieber, 2024). TA2’nin genel terimler başlığında 44 terim vardır (García-Orozco ve ark., 2025).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `TA2, bazı yön terimlerinin yanına tarihî notlar ekler. Bu notlar terimlerin neden böyle seçildiğini anlatır:

- **Intermedius** (ara), iç yan ile dış yan arasındaki konum içindir. 1895 listesi bu sözcüğü bilerek seçti. Amaç, sesleri birbirine benzeyen *medius* ile *medialis*’in yan yana gelmesini önlemekti (FIPAT, 2019).
- **Medius** (orta) ise ön ile arka arasındaki ya da iç (*internus*) ile dış (*externus*) arasındaki konumu gösterir (FIPAT, 2019).
- **Ventralis** ve **dorsalis**’i Kölliker önerdi. Amacı, karşılaştırmalı anatomiyle bağ kurmaktı. 1895 komisyonu öneriyi benimsemedi. Ama sonraki kurullar bu iki sözcüğün yapı adlarının eş anlamlılarında kullanılmasını kabul etti (FIPAT, 2019).
- **Cranialis** ve **caudalis**’i 1895 komisyonu insan yapılarına ad vermede “hantal” buldu. Yine de karşılaştırmalı anatomi gereken yerde, gövdede yön bildirmek için onayladı (FIPAT, 2019).
- **Rostralis**, genellikle başın içinde burna ya da gagaya (*rostrum*) yakın bir konumu bildirir (FIPAT, 2019).
- **Transversalis** genel terimlerden çıkarıldı. 1895’te bu sözcük beden eksenine dik, *transversus* ise organın eksenine dik demekti. Ayrım uygulamada gözetilmediği için TA2 onu bıraktı (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'derinles',
      baslik: 'Az bilinen genel terimler',
      md: 'TA2’nin genel terimleri yalnızca zıt çiftlerden ibaret değildir. *Frontalis* (alın tarafı) ve *occipitalis* (ense tarafı) da genel yön sıfatı olarak listelenir (FIPAT, 2019). *Apicalis* (tepeyle ilgili), *basalis* (tabanla ilgili), *axialis* (eksenle ilgili) ve *luminalis* (iç boşluğa bakan) da bu listededir (FIPAT, 2019). *Basilaris* ise artık ayrı bir genel terim değildir. TA2 onu *basalis*’in eş anlamlısı sayar. Bu sözcük en çok beynin dışındaki taban adlarında geçer. Beyindeki bir örneği ponsun taban kısmının adıdır: *pars basilaris pontis* (FIPAT, 2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Ön ile ventral aynı şey mi?** Gövdede çoğunlukla evet. Gray (1918) ön (*anterior*) ile karın tarafını (*ventral*), arka (*posterior*) ile sırt tarafını (*dorsal*) eş anlamlı kullanır. TA2 de omurilik sinirinin ön köküne *radix anterior* der. *Radix ventralis* bu kökün eş anlamlı adıdır (FIPAT, 2019). Ama beyinde bu eşitlik bozulur. Dorsal ve ventral, merkezî sinir sisteminin eksenine göre tanımlanır. Bu yüzden dorsal beyinde “yukarı”, omurilikte “arka” demektir (Henley, 2021a). Nedeni, insanda sinir ekseninin orta beyin hizasında yaklaşık 90° bükülmesidir (Henley, 2021a). Ayrıntısını bir sonraki bölümde göreceğiz.

**Üst ile kranial aynı şey mi?** Ders kitapları üstü (*superior*) kranial ile, altı (*inferior*) kaudal ile eş tutar (OpenStax 1.6). TA2 ise farklı bakar. Bu çift ancak karşılaştırmalı anatomi gerektiğinde, gövdede yön bildirmek için onaylandı (FIPAT, 2019). Beyinde de iki çift ayrı davranır. Üst ve alt bütün bedende aynı anlamı korur. Rostral ve kaudal ise beyinde “öne” ve “arkaya”, omurilikte “yukarı” ve “aşağı” demektir (Henley, 2021a).

TA2 de beyin sapındaki bazı yapılara “superior” adını verir. Eksene dayanan adlar ise yalnızca ilişkili terim olarak kalır. Örneğin üst vestibüler çekirdeğin (*nucleus vestibularis superior*) ilişkili adları *nucleus vestibularis cranialis* ve *nucleus vestibularis rostralis*’tir (FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Beyindeki pek çok yapının adı, yerini içinde taşır. TA2’de üst ve alt tepecik (*colliculus superior* ve *inferior*) böyledir. Medial ve lateral genikulat cisim (*corpus geniculatum mediale* ve *laterale*) de öyledir. Ön ve arka komissür (*commissura anterior* ve *posterior*) de bu türden bir çifttir (FIPAT, 2019). Adı okumak, yapının yerini kestirmeye yardım eder.

TA2 bazı adların yanına eksene dayanan ilişkili adlar da koyar. Üst tepeciğin ilişkili adları *colliculus rostralis* ve *colliculus cranialis*’tir. Alt tepeciğinki ise *colliculus caudalis*’tir (FIPAT, 2019). Bu eşleme beyin sapında tutarlıdır. Çünkü orta beyin rostral yönde ara beyinle, kaudal yönde ponsla sürer (Dafny, 2020). Yani beyin sapında rostral, ara beyne doğru olan yukarı yöndür. Kaudal ise ponsa doğru olan aşağı yöndür.`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Adı yerini söyleyen yapılar',
      aciklama:
        'Büyük beyin ve beyincik gizlendi. Beyin sapına ve talamusların arka yüzüne arkadan bakıyoruz: hastanın solu ekranın solundadır. Etiketler sol yandadır. Yeşil: üst ve alt tepecikler; adları biri yukarıda, öbürü aşağıda olduğunu söyler. Mavi: medial genikulat cisim; iç yanda kalır. Kırmızı: lateral genikulat cisim; dış yanda kalır. Sarı: epifiz bezi; tam orta hattadır. Bakış düğmesiyle yapılara başka yönlerden de bak.',
      sahne: {
        katmanlar: ['derin', 'sap'],
        renk: 'dogal',
        goster: ['bolge:beyin-sapi', 'talamus', 'epifiz', 'medial-genikulat-cisim', 'lateral-genikulat-cisim'],
        boya: [
          { secici: ['ust-tepecik', 'alt-tepecik'], renk: '#25a993' },
          { secici: ['medial-genikulat-cisim'], renk: '#4f7cf0' },
          { secici: ['lateral-genikulat-cisim'], renk: '#ef5d7b' },
          { secici: ['epifiz'], renk: '#f2b544' },
        ],
        bakis: 'arka',
        etiketler: [
          { yapi: 'talamus-sol', metin: 'Talamus' },
          { yapi: 'epifiz', metin: 'Epifiz (orta hat)' },
          { yapi: 'ust-tepecik-sol', metin: 'Üst tepecik' },
          { yapi: 'alt-tepecik-sol', metin: 'Alt tepecik' },
          { yapi: 'medial-genikulat-cisim-sol', metin: 'Medial genikulat cisim' },
          { yapi: 'lateral-genikulat-cisim-sol', metin: 'Lateral genikulat cisim' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Muayenede yön ve taraf dili',
      md: `Nörolojik muayenede güç kaybı derecesiyle, yanıyla ve yaygınlığıyla adlandırılır:

- **Parezi** kısmi güç kaybıdır. **Pleji** (felç) ise tam kayıptır. Omurilikte ve beyin sapında iskelet kaslarını doğrudan uyaran hareket nöronları vardır. Bunlara **alt motor nöron** denir. Hareket sisteminde bunların üstündeki bütün nöronlar **üst motor nöron** sayılır (Knierim, 2026). Üst motor nöron bozukluğu, derecesi değişebilen kısmi bir güçsüzlük (parezi) yapar. Bu, kas etkinliğinin tümden kaybolduğu felçten (pleji) farklıdır (Knierim, 2026).
- **Hemipleji** bedenin bir yarısının, **monopleji** tek bir uzvun felcidir (Knierim, 2026).
- Omurilik boyun düzeyinde kesilirse dört uzuv da felç olur: **kuadripleji**. Hasar omuriliğin boyundaki kalınlaşmasının altındaysa yalnızca bacaklar tutulur: **parapleji** (Knierim, 2026).
- Sağ ve sol yan arasındaki güç farkı, iki kortikospinal yoldan birinin bozulduğunu düşündürür (OpenStax 16.4). Kortikospinal yol, beyin kabuğundan omuriliğe inen hareket yoludur.
- Hareket yolu büyük ölçüde karşı tarafa geçer. Güncel bir ders kitabına göre liflerinin yaklaşık %90’ı piramit çaprazlaşmasında karşı tarafa geçer. Bu çaprazlaşma omurilik soğanının alt kısmındadır (Knierim, t.y.). Eski kaynaklar daha düşük oranlar verir. TA2’de korunan 1955 tarihli bir not “yaklaşık üçte iki” der (FIPAT, 2019). Gray (1918) ise liflerin “üçte iki ya da dörtte üçünün” omurilik soğanında çaprazlaştığını yazar (Gray, 1918).

Bu adlardaki parçalar (hemi-, -pleji, -parezi) “Terimler nereden gelir, nasıl kurulur?” bölümünde ayrıca ele alınacak.`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Tavana bakan lezyon',
      oyku: 'Bir stajyer öğrenci, beyin MR’ı çekilen bir hastanın notunu yazıyor. Hasta çekim sırasında cihazda sırtüstü yatıyordu. Öğrenci şöyle yazıyor: “Lezyon sol yarımkürenin üst yüzünde, tavana bakan tarafta; alın lobunun en uç kısmında.” Asistan hekim notu okuyunca yön sözcüklerinin düzeltilmesini istiyor.',
      soru: 'Öğrencinin yön tarifinde yanlış olan nedir? Doğru tarifte hangi yön sözcüğü kullanılmalıdır?',
      cozum: `**Yanlış olan, yönü hastanın yatışına göre vermek.** Yön terimleri, beden gerçekte nasıl durursa dursun anatomik duruşa göre söylenir (OpenStax 1.6). TA2 de ön–arka ve üst–alt çiftlerini standart dik insan duruşuna bağlar (FIPAT, 2019).

**Doğru yön:** Sırtüstü yatışta yüz yukarı bakar (OpenStax 1.6). Bu yüzden hastanın alnı tavana bakıyordu. Ama anatomik duruşta alın öndedir. Demek ki “tavana bakan taraf” burada **ön** (*anterior*) taraftır, “üst” değil. Beyinde **rostral** sözcüğü de öne, burna doğru yönü gösterir (Henley, 2021a). Doğru tarif: “Lezyon sol frontal lobun ön ucunda.”

**Bu sorun yeni değil.** Wilder 1881’de şunu yazdı: ölçü alınan duruş dik insandır. Ama insanlar ve hayvanlar çoğu zaman sırtüstü yatarken incelenir (Wilder, 1881). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Yön dili sayılarla',
      ogeler: [
        {
          deger: '44',
          aciklama:
            'TA2’nin “genel terimler” başlığındaki terim sayısı. Çoğu zıt çiftler hâlinde düzenlenmiş sıfatlardır (García-Orozco ve ark., 2025).',
        },
        {
          deger: '4',
          aciklama:
            'TA2’de insan bedeninin duruşları için ayrılan terim sayısı: anatomik, karşılaştırmalı, yüzüstü, sırtüstü (FIPAT, 2019).',
        },
        {
          deger: '8',
          aciklama: 'Barclay’in 1803’te saydığı yön adı: üst, alt, arka, ön, dış, iç, sağ, sol (Barclay, 1803).',
        },
        {
          deger: '~90°',
          aciklama:
            'İnsanda sinir ekseninin orta beyin hizasındaki bükülmesi. Dorsal ve rostral bu yüzden beyinde anlam değiştirir (Henley, 2021a).',
        },
      ],
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Anatomik duruş TA2’de *positio anatomica*’dır. TA2’nin duruş başlığında dört terim vardır (FIPAT, 2019).
- Yönler, hasta nasıl yatarsa yatsın anatomik duruşa göre söylenir (OpenStax 1.6).
- *Medialis* = iç yan (orta hatta yakın). *Internus* = iç (boşluğun duvarına göre). *Medianus* = tam orta hat (FIPAT, 2019; Gray, 1918).
- *Intermedius* iç yan ile dış yan arasıdır. *Medius* ön ile arka ya da iç ile dış arasıdır (FIPAT, 2019).
- Gövdede ön = ventral, arka = dorsal. Beyinde değil: beyinde dorsal = yukarı, rostral = ön (Gray, 1918; Henley, 2021a).
- İpsilateral, kontralateral ve bilateral, TA2’nin genel terimler listesinde yoktur.
- Parezi kısmi, pleji tam güç kaybıdır. Hemi-, mono-, para-, kuadri- tutulan bölgeyi söyler (Knierim, 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Yön dili nasıl kuruldu?',
      md: `**Barclay (1803).** Barclay, anatomistlerin her organa sekiz yön yakıştırdığını yazdı: üst, alt, arka, ön, dış, iç, sağ, sol. Ona göre üst ve alt ancak beden hep aynı konumda varsayılırsa işe yarar. Anatomistlerin seçtiği konum da dik duruştur (Barclay, 1803). Barclay yeni sözcükler önerdi. Orta düzleme *mesion* dedi. Ona doğru yöne *mesial*, ondan uzağa *lateral* dedi. Üst ve alt yerine *atlantal* ve *sacral*, ön ve arka yerine *sternal* ve *dorsal* önerdi (Barclay, 1803). Bu önerilerin çoğu tutmadı. Ama *dorsal* ve *lateral* bugün de TA2’nin genel terimleri arasındadır. Barclay’in organlar için önerdiği *central–peripheral* çifti de öyledir (FIPAT, 2019; Barclay, 1803). Uzuvlar için önerdiği *proximal* ve *distal* de öyledir. Barclay bu iki sözcüğü gündelik dilde geçmedikleri için seçmişti (Barclay, 1803).

**Henle ve Schulze.** Barker’a göre sagittal, frontal, medial ve lateral gibi yön terimlerini getiren ve tutarlı kullanan Henle’dir (Barker, 1907). Oysa Barclay *lateral* sözcüğünü bu anlamda 1803’te önermişti (Barclay, 1803). 1893’te Schulze bütün hayvanlar için bir ek sistemi önerdi. *-an* çevredeki konumu, *-ad* yönü, *-al* genel bölgeyi bildiriyordu. Örneğin *dorsan* sırtta, *dorsad* sırta doğru, *dorsal* sırt bölgesinde demekti. BNA bunu benimsemedi. His’in itirazı pratikti: insanlar son heceyi yutar ve birbirine benzeyen *-ad*, *-al*, *-an* kolayca karışır (Eycleshymer, 1917).

**1895 komisyonu.** Kölliker, karşılaştırmalı anatomi gereken yerde ön ve arka yerine ventral ve dorsal demeyi önerdi. Gerekçesi şuydu: ön ve arka yalnızca dik duran insana uyar (Eycleshymer, 1917). Bu öneriye göre omurilik sinirlerinin “ön ve arka kökleri” yerine “ventral ve dorsal kökleri” denebilirdi. Beynin “ön ucu” ve “arka ucu” ise kalabilirdi, çünkü bu ifadeler dört ayaklıda da aynı anlamı taşır (Eycleshymer, 1917). Komisyon bu katı kullanımın değerini küçümsemedi, ama onu benimsemedi. Dik insan duruşuna bağlı geleneksel kullanımdan kesin olarak kopulup kopulmayacağının kararını zamana bıraktı (Eycleshymer, 1917). Kimura’ya göre 1977’deki 4. *Nomina Anatomica* baskısından sonra şu görülür: baş bölgesinde *coronalis* yer, *frontalis* ise yön bildirmek için kullanılır (Kimura, 2004).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Kaynaklar yön dilinde birkaç yerde birbirinden ayrılır. Bunları bilmek, eski bir metni ya da farklı ülkeden bir raporu doğru okumayı kolaylaştırır:

- **Proksimalin tanımı.** Gray (1918) ve OpenStax’a göre proksimal, uzvun gövdeye ya da bağlandığı yere yakın olandır (OpenStax 1.6). Bir Türkçe ders notu ise “vücut merkezine yakın” der (Ankara Üniversitesi, 2017). İkinci anlatım daha belirsizdir.
- **Sefalik mi, kranial mi?** Gray (1918) üst için *cephalic* sözcüğünü de kullanır. TA2’nin genel terimlerinde ise *cranialis* vardır (FIPAT, 2019).
- **Aynı kitapta iki tarif.** OpenStax’ın 1.6 bölümü kolları iki yana açık çizer. Aynı kitabın 9.5 bölümü ise kolları gövdenin yanında tarif eder (OpenStax 1.6; OpenStax 9.5).
- **Ventral mi, ön mü?** Gray (1918) ikisini eş anlamlı kullanır. Mori ve arkadaşları ise başka bir kurala dikkat çeker. Anatominin temel kurallarına göre kraniyal, kaudal, ventral ve dorsal yerine üst, alt, ön ve arka denmelidir (Mori ve ark., 2019). TA2’nin notuna göre ise *ventralis* ve *dorsalis*, yapı adlarının eş anlamlılarında kabul edilir (FIPAT, 2019).`,
    },
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Adlar sabit kalır, beyin kayabilir',
      md: 'Yön terimleri hastanın yatışıyla değişmez. Ama beynin kendisi yatışla biraz yer değiştirebilir. Gerdes ve arkadaşları stereotaksi için çekilmiş röntgenleri inceledi. Stereotaksi, beynin derinindeki bir noktaya koordinatla ulaşma yöntemidir. Sert zarda açılan delikten hava girerse beyin geriye çökebilir. Bu durumda sırtüstü yatan hastada bütün yapılar birkaç milimetre ense tarafına kayabilir (Gerdes ve ark., 1975). Yazarlar bunu bir hata kaynağı olarak bildirdi (Gerdes ve ark., 1975). Yani yatış yön adlarını değiştirmez. Ama koordinatla hedefe ulaşırken yatışın beyne etkisi bir hata kaynağı olabilir.',
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: “Ön” örtü mü, “üst” örtü mü?',
      oyku: 'Bir patoloji raporu, dördüncü karıncığın çatısında küçük bir lezyon bildiriyor. Dördüncü karıncık, beyin sapı ile beyincik arasındaki sıvı dolu boşluktur. Raporda yerin adı “velum medullare anterius” (ön medüller örtü) diye geçiyor. Raporu okuyan iki asistan tartışıyor. Biri, lezyonun “arka” medüller örtünün önünde olduğunu söylüyor. Öbürü ise onun epey yukarısında olduğunu savunuyor.',
      soru: 'Bu adın içindeki “anterius” neyi anlatır? TA2 bu yapıya bugün hangi adı verir ve neden?',
      cozum: `**“Anterius” adı yanıltıcıdır.** TA2’de korunan 1955 tarihli bir not var. Bu nota göre sıfat, biçime dayalı (morfolojik) bir gerekçeyle konmuştur. Oysa bu örtü, karşıdaki alt medüller örtünün (*velum medullare inferius*) epey üstündedir. Onun önünde ise yalnızca çok azdır (FIPAT, 2019).

**TA2’deki ad:** *velum medullare superius* (üst medüller örtü). Eski ad *velum medullare anterius* yalnızca ilişkili terim olarak kalır. Not, bu örtünün dördüncü karıncığın çatısının en üst bölümünü oluşturduğunu da yazar (FIPAT, 2019). Yani anatomik duruşa göre ikinci asistan haklıdır.

**Ders:** Biçime ya da eksene göre konmuş eski adlar, anatomik duruşa göre yeniden adlandırılabilir. Karşıdaki örtü de bugün *inferius* (alt) adını taşır. Notta geçen eski adı *posterius* yalnızca ilişkili ad olarak kalır (FIPAT, 2019). Aynı eğilim beyin sapının başka adlarında da görülür. Üst vestibüler çekirdeğin resmî adı *superior*’dur; *cranialis* ve *rostralis* yalnızca ilişkili adlardır (FIPAT, 2019). Raporda eski bir ad görürsen TA2’deki karşılığına bak. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
