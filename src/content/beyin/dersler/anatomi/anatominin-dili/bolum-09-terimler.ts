import type { DersBolumu } from '../../../types';

/** 09. bölüm: terimin parçaları, adların kaynağı, tekil–çoğul, terminolojinin tarihi, eponimler, kurallar ve Türkçe anatomi dili. */
export const terimlerinKokeni: DersBolumu = {
  id: 'terimlerin-kokeni',
  baslik: 'Terimler nereden gelir, nasıl kurulur?',
  bloklar: [
    {
      tur: 'metin',
      md: `Anatomi terimlerinin büyük çoğunluğu Latince, bir kısmı Yunancadır (Ankara Üniversitesi, 2017). Yunanca terimler Eski Yunancadan gelir. Latince ve Eski Yunanca bugün gündelik konuşmada kullanılmaz. Bu yüzden sözcüklerinin anlamı zamanla kaymaz (OpenStax 1.6). **Terim**, bir bilim dalında belirli bir kavramı karşılayan sözcüktür (TDK, 2026). Terimleşen sözcük tek anlamlıdır. Anlamı kişiden kişiye değişmez (Şenel Tekin, t.y.).

Bu yüzden anatomi dilini yeni bir dil gibi öğrenmek işe yarar. Latince ve Yunanca adların çoğu yapının işine, yerine ya da görünüşüne dayanır (Sanders ve Taylor, 2025). Adın anlamını çözen, yapının kendisi hakkında da bir ipucu yakalar.`,
    },
    {
      tur: 'metin',
      md: `Bir terim üç tür parçadan kurulur: **kök**, **önek** ve **sonek**. Kök çoğunlukla bir organı, bir dokuyu ya da bir durumu anlatır. Önek ve sonek ise kökü niteler (OpenStax 1.6). Kök ile sonek arasına çoğu zaman bir **bağlayıcı ünlü** girer. Bu ünlü genellikle “o” harfidir ve söylemeyi kolaylaştırır (Ernstmeyer ve Christman, 2024). Türkçe bir tıbbi terminoloji ders notu da şunu yazar: iki kök çoğunlukla “o”, “e” ya da “i” ünlüsüyle birleştirilir. Örnek: *gastr-o-logy* (Şenel Tekin, t.y.).

Bir terimi çözerken sonekten başla (Ernstmeyer ve Christman, 2024). Örnek: **ensefalit**. Sonek *-itis* iltihap demektir. Kök *encephal/o* beyin demektir. Demek ki ensefalit, beyin iltihabıdır (Ernstmeyer ve Christman, 2024). **Nevralji** de aynı yolla çözülür. *Neur-* sinir, *-algia* ağrı demektir; nevralji sinir ağrısıdır (Ernstmeyer ve Christman, 2024).`,
    },
    {
      tur: 'tablo',
      baslik: 'Beyin terimlerinde sık geçen parçalar',
      sutunlar: ['Parça', 'Anlamı', 'Örnek'],
      satirlar: [
        ['*encephal/o*', 'beyin', 'ensefalit: beyin iltihabı'],
        ['*neur/o*', 'sinir', 'nevralji: sinir ağrısı'],
        ['*myel/o*', 'omurilik (Yunanca *myelos*: ilik)', 'Celsus, Yunanca *myelon*’u Latinceye *medulla* diye aktardı'],
        ['*-itis*', 'iltihap', 'ensefalit'],
        ['*-algia*', 'ağrı', 'nevralji'],
        ['*-plegia*', 'felç', 'hemipleji: bedenin bir yarısının felci'],
        ['*-paresis*', 'hafif felç, güçsüzlük', 'parezi: kısmi güç kaybı'],
        ['*hemi-*', 'yarım', 'hemipleji'],
        ['*sub-*', 'altında', '*subthalamus*: Forel’in 1877’de hipotalamus için kullandığı ad'],
        ['*super-*, *supra-*', 'üstünde', '*superior*: daha yukarıda olan'],
        ['*inter-*', 'arasında', '*foramen interventriculare*: karıncıklar arası delik'],
      ],
      not: 'Parçaların anlamı: Ernstmeyer ve Christman (2024). Örnekler: Pretterklieber (2024), Knierim (2026), Puelles (2019), García-Orozco ve ark. (2025), FIPAT (2019). Başka sık parçalar: *radicul/o* sinir kökü, *mening/o* beyin zarları; *epi-* üstünde, *peri-* çevresinde, *intra-* içinde, *infra-* altında; *-oma* tümör (Ernstmeyer ve Christman, 2024).',
    },
    {
      tur: 'metin',
      md: `Anatomik adlar çoğu zaman bir şeyi betimler. Bazıları yapının biçimini anlatır: *arachnoidea*, *hippocampus*, *uncus*. Bazıları da rengini anlatır: kara madde (*substantia nigra*) ve kırmızı çekirdek (*nucleus ruber*) böyledir (Strzelec ve ark., 2017). Beynin tabanındaki **mamiller cisimler**, adını Latincede “küçük meme” anlamına gelen sözcükten alır (Sanders ve Taylor, 2025).

Bazı adlar mitolojiden gelir. **Hipokampus** adı, Poseidon’un deniz kabuğu arabasını çeken hayvandan, yani deniz atından gelir (Pretterklieber, 2024). **Talamus** ise Yunancada “oda” demektir. Galenos onu beyin karıncıklarına açılan bir oda olarak tarif etmişti (García-Cabezas ve ark., 2021).`,
    },
    {
      tur: 'sahne',
      baslik: 'Adlar nereden geliyor?',
      aciklama:
        'Sağ yarı kaldırıldı. Sol yarının derin yapılarına içeriden bakıyoruz; ön taraf ekranın sağındadır. Mavi: talamus. Adı Yunanca “oda” demektir. Sarı: hipokampus. Adı mitolojideki deniz atından gelir. Kırmızı: mamiller cisimler. Adı Latince “küçük meme” demektir. Yeşil: karıncıklar arası delik. Bu deliğin yaygın kişi adı Monro deliğidir. Soluk yapılar (forniks ve üçüncü karıncık) yön bulmak için gösterildi. Bakış düğmesiyle yapılara başka yönlerden de bak.',
      sahne: {
        katmanlar: ['derin', 'karincik'],
        renk: 'yapi',
        goster: ['talamus', 'hipokampus', 'mamiller-cisimler', 'karinciklar-arasi-delik', 'forniks', 'ucuncu-karincik'],
        saydam: ['forniks', 'ucuncu-karincik'],
        boya: [
          { secici: ['talamus'], renk: '#4f7cf0' },
          { secici: ['hipokampus'], renk: '#f2b544' },
          { secici: ['mamiller-cisimler'], renk: '#ef5d7b' },
          { secici: ['karinciklar-arasi-delik'], renk: '#25a993' },
        ],
        yarim: 'sol',
        bakis: 'ic-sol',
        etiketler: [
          { yapi: 'talamus-sol', metin: 'Talamus: “oda”' },
          { yapi: 'hipokampus-sol', metin: 'Hipokampus: “deniz atı”' },
          { yapi: 'mamiller-cisimler', metin: 'Mamiller: “küçük meme”' },
          { yapi: 'karinciklar-arasi-delik', metin: 'Monro deliği' },
        ],
      },
      araclar: ['bakis', 'liste'],
    },
    {
      tur: 'metin',
      md: `Latince adlar tekil ve çoğulda biçim değiştirir. Bir kıvrım *gyrus*, birden çok kıvrım *gyri*’dir. Bir oluk *sulcus*, oluklar *sulci*’dir. TA2’nin başlıkları da çoğul biçimi kullanır: *gyri cerebri* (beyin kıvrımları) ve *sulci cerebri* (beyin olukları) (FIPAT, 2019). Bir çekirdek *nucleus*, çekirdekler *nuclei*’dir (Hutchins, t.y.). Bir düğüm *ganglion*, düğümler *ganglia*’dır (FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      md: `Anatomide ad koymanın tarihi çok eskidir. Batı’da Alkmaion’la başlar. Alkmaion MÖ 500–450 yıllarında yaşadı. Atardamar ile toplardamarı ilk ayıran kişi olarak anılır (Pretterklieber, 2024). Yüzyıllar boyunca aynı yapıya pek çok ad verildi. Eycleshymer 1917’de yaklaşık 5.000 yapıya 50.000’den fazla ad verildiğini yazdı (Eycleshymer, 1917).

Bu karmaşayı bitirmek için 1895’te Basel’de ilk resmî liste kabul edildi. Adı **BNA**’dır (*Basiliensia Nomina Anatomica*, Basel anatomi adları) (Barker, 1907). Bugünkü listenin adı **Terminologia Anatomica**’dır. İlk baskısı 1998’de çıktı (Whitmore, 1999). İkinci baskısı (TA2) 2019’da çevrim içi yayımlandı (Gobée ve ark., 2024).

Bazı yapılar bir kişinin adıyla anılır. Buna **eponim** denir. Örneğin merkezî oluğun eski bir adı “Rolando yarığı”dır (*fissure of Rolando*). Gray (1918) bu adı merkezî oluğun eş anlamlısı olarak verir. Bugünkü resmî adı *sulcus centralis*’tir. Kişi adı TA2’de yalnızca ilişkili terim olarak kalmıştır (FIPAT, 2019).`,
    },
    {
      tur: 'metin',
      md: `Türkçede bu bilimin adı **anatomi**dir. Sözcük Fransızca *anatomie*’den gelir. Eş anlamlısı **teşrih**’tir; bu sözcük Arapça kökenlidir (TDK, 2026). Türkçe basılmış ilk anatomi kitabı, 19. yüzyılda Şânîzâde Mehmed Atâullah Efendi’nin yazdığı *Mir’âtü’l-ebdân*’dır (TDV İslâm Ansiklopedisi, t.y.).

Terimleri değiştirme ve yeni terim ekleme yetkisi uluslararası bir kuruldadır (Ankara Üniversitesi, 2017). Bu kurulun bugünkü adı FIPAT’tır (Gobée ve ark., 2024). Türkçe ders sunuları Latince terimi Türkçe karşılığıyla birlikte verir: *nervus* (sinir), *arteria* (atardamar) gibi (Cömert, t.y.-a).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Latince terimler nasıl okunur?',
      md: `Latince yazılan terimler Türkçede belli kurallarla okunur (Şenel Tekin, t.y.):

- **c** harfi *a*, *o*, *u* önünde **k** okunur. *E*, *i*, *ae*, *oe*, *y* önünde ise **s** okunur. Bu yüzden *cortex* “korteks”, *cerebrum* “serebrum” diye okunur.
- **j** bir ünlüden önce **y** okunur.
- **q** “ku”, **x** “ks” okunur.

Kısaltmalara da dikkat et. *n.* sinir (*nervus*), *a.* atardamar (*arteria*), *v.* toplardamar (*vena*), *ggl.* düğüm (*ganglion*) demektir (Cömert, t.y.-a). Çoğulda harf ikilenir: *nn.* sinirler (*nervi*) demektir (Ankara Üniversitesi, 2017).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Terimin parçaları:** kök ne olduğunu, önek ve sonek nasıl ya da nerede olduğunu söyler. Çözmeye sonekten başla.

**Dil:** Terimlerin çoğu Latince, bir kısmı Eski Yunancadır. Bu diller artık konuşulmadığı için sözcüklerin anlamı kaymaz. Ama terim listeleri zamanla yenilenir. Bir terimin bilimsel tanımı da değişebilir.

**Çoğul:** *gyrus* → *gyri*, *sulcus* → *sulci*, *nucleus* → *nuclei*, *ganglion* → *ganglia*.

**Adların kaynağı:** biçim, renk, yer, bazen mitoloji (hipokampus) ya da kişi adı (eponim).

**Liste:** 1895’te BNA, bugün *Terminologia Anatomica* (TA2).`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      md: 'Antik Yunan hekimi Herophilos’un yapıtından bize kalan adlar arasında beyin için *enkephalon* vardır. Latinleşmiş biçimi *encephalon*’dur. Sinir anlamında *neuron* sözcüğünü kullanan da odur. Celsus bu Yunanca adlara Latince karşılıklar buldu: *enkephalon* için *cerebrum*, *neuron* için *nervus*, *myelon* için *medulla* (Pretterklieber, 2024).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Tekil ve çoğul: Latince kurallar',
      sutunlar: ['Tekil biter', 'Çoğulda olur', 'Örnek'],
      satirlar: [
        ['-us', '-i', '*nucleus* → *nuclei*; *sulcus* → *sulci*; *gyrus* → *gyri*'],
        ['-a', '-ae', '*lamina* → *laminae* (*laminae septi pellucidi*); *fissura* → *fissurae* (*fissurae cerebelli*)'],
        ['-um', '-a', '*septum* → *septa*'],
        ['-on', '-a', '*ganglion* → *ganglia*'],
        ['-is', '-es', '*canalis* → *canales*'],
        ['-us (bazı sözcükler)', 'değişmez', '*plexus* → *plexus*; *sinus* → *sinus*'],
        ['Yunanca *neuron*', '*neura*', '*neuron* → *neura*'],
        ['Kısaltma', 'harf ikilenir', '*n.* → *nn.*; *ggl.* → *ggll.*'],
      ],
      not: 'Kaynaklar: Hutchins (t.y.), Şenel Tekin (t.y.), Ankara Üniversitesi (2017), FIPAT (2019), Chmielewski (2020). Kuralların istisnaları vardır (Şenel Tekin, t.y.). TA2’de *plexus nervosi* (sinir ağları) ve *sinus venosi durales* (sert zarın toplardamar sinüsleri) biçimleri geçer (FIPAT, 2019). Bazı ders kaynakları “plexi” yazar (Hutchins, t.y.). TA2’de bu biçim hiç geçmez (FIPAT, 2019).',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Barker’a göre 1895 komisyonu çalışırken bazı ilkelere vardı. Bu ilkeler genel kural olarak işe yaradı, ama hiçbiri istisnasız uygulanamadı. Komisyon zaman zaman bunlardan ayrılmak zorunda kaldı. Başlıca kararlar şunlardı (Barker, 1907):

1. Her yapının yalnızca bir adı olacak.
2. Her terim Latince ve dil bilgisi bakımından doğru olacak.
3. Terimler olabildiğince kısa ve yalın olacak.
4. Terimler yalnızca hafıza işaretidir. Betimleme ya da kuram iddiası taşımaz.
5. Birbiriyle ilişkili terimler olabildiğince benzer olacak.
6. Sıfatlar genellikle zıt çiftler hâlinde düzenlenecek: *dexter–sinister*, *anterior–posterior*, *superficialis–profundus*.

Latincede sıfat, nitelediği isimden sonra gelir ve onunla birlikte çekilir (Ankara Üniversitesi, 2017). *Nucleus ruber* (kırmızı çekirdek) ve *substantia nigra* (kara madde) buna örnektir. Sıfatların dereceleri de vardır: *longus* uzun, *longior* daha uzun, *longissimus* en uzun. Bazıları düzensizdir: *magnus–major–maximus* (büyük), *parvus–minor–minimus* (küçük) (Ankara Üniversitesi, 2017). *Superior* da bir karşılaştırma sıfatıdır: “daha yukarıda” demektir. *Supremus* ise “en yukarıda” demektir. Bu üstünlük sıfatı genel terimler listesinde yoktur (García-Orozco ve ark., 2025).

Sıfat ekinde de bir kural vardır. Varsayılan ek *-alis*’tir. Kökte *l* harfi varsa ek *-aris* olur. Ama *l* ile ek arasına *r* girerse yine *-alis* kalır (Neumann ve ark., 2026). Bu yüzden *lateralis* yazılır.`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Adlandırmanın zaman çizelgesi',
      sutunlar: ['Yıl', 'Ne oldu?', 'Kaynak'],
      satirlar: [
        ['MÖ 500–450', 'Alkmaion: Batı’da anatomik adlandırmanın başlangıcı', 'Pretterklieber (2024)'],
        ['Antik çağ', 'Yunanca temel: Galenos ve öncülleri. Latince temel: Celsus', 'Eycleshymer (1917); Pretterklieber (2024)'],
        [
          '1543',
          'Vesalius Yunanca ve Arapça adları Latince adlarla değiştirdi; yapıları sıra numarasıyla ayırdı',
          'Pretterklieber (2024); Sakai (2007)',
        ],
        ['1889', 'Alman Anatomi Derneği (Anatomische Gesellschaft) adlandırma komisyonunu kurdu', 'Pretterklieber (2024)'],
        ['1895', 'BNA Basel’de kabul edildi: yaklaşık 4.500–5.000 terim', 'Barker (1907); Pretterklieber (2024)'],
        ['1933', 'İngiliz ve İrlanda Anatomi Derneği: Birmingham Revizyonu (BR)', 'Gobée ve ark. (2024); Pretterklieber (2024)'],
        [
          '1935 ya da 1936',
          'Jena listesi (JNA ya da INA); sonunda tutmadı',
          'Gobée ve ark. (2024); Pretterklieber (2024); Buklijas (2017)',
        ],
        [
          '1955',
          'Paris’te PNA: ilk resmî uluslararası liste. Kişi adları resmî Latince adlardan çıktı',
          'Pretterklieber (2024); Musil ve ark. (2026)',
        ],
        ['1960 ya da 1961 – 1983', '*Nomina Anatomica* 2.–5. baskılar', 'Kachlik ve ark. (2008); Pretterklieber (2024)'],
        ['1989', '6. baskı onaylanmadı; IFAA yeni bir kurul (FCAT) kurdu', 'Pretterklieber (2024); Whitmore (1999)'],
        ['1998', '*Terminologia Anatomica* (TA): Latince ve İngilizce adlar', 'Whitmore (1999)'],
        [
          '2016–2017',
          '*Terminologia Neuroanatomica* (TNA) onaylandı ve yayımlandı',
          'ten Donkelaar ve ark. (2017); Kachlík ve ark. (2020)',
        ],
        [
          '2019',
          'TA2 çevrim içi yayımlandı; IFAA onayı 2020 (çoğu kaynak) ya da 2021',
          'Gobée ve ark. (2024); Waschke (2024); Pretterklieber (2024)',
        ],
        ['2023', 'Alman Anatomi Derneği, TA98’e dayanan TA2023AG’yi kabul etti', 'Pretterklieber (2024)'],
      ],
      not: 'IFAA: Uluslararası Anatomistler Dernekleri Federasyonu. FCAT: Anatomi Terminolojisi Federatif Kurulu; bu kurul zamanla FICAT’a, sonra FIPAT’a dönüştü (Gobée ve ark., 2024). Kaynakların ayrıldığı yerlerde iki tarih birlikte verildi.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Listeler nasıl değişti?** Sakai’ye göre bu tarih beş evrede incelenebilir. Galenos, Vesalius, Sylvius ile Bauhin’in terim üretimi, ulusal dillerdeki ders kitapları ve 19. yüzyıl sonundaki uluslararası terminoloji bu evrelerdir (Sakai, 2007). Vesalius neredeyse hiç terim türetmedi. Onun yerine yapıları sıra numaralarıyla ayıran bir sistem kurdu (Sakai, 2007).

Sakai’ye göre 17. yüzyılda anatomi kitapları çoğunlukla Latince yazıldı. 18. ve 19. yüzyılda ise ulusal dillerde yazıldı. Aynı yapıyı farklı yazarlar farklı adlarla anlattı (Sakai, 2007). Pretterklieber’e göre bu dönemde yeni terimler de eklendi ve adlandırma daha karmaşık hâle geldi (Pretterklieber, 2024). Farklı okullardaki anatomistler ancak eş anlamlılar sözlüğüyle anlaşabiliyordu (Pretterklieber, 2024). Barker’a göre büyük bir ders kitabında 10.000 kadar terim vardı; bunların yarısı eş anlamlıydı (Barker, 1907). Hyrtl, terminolojiyi düzeltmek için dil bilen anatomistlerden bir kurul önerdi (Pretterklieber, 2024).

BNA’dan sonraki her liste eskisini düzeltti. Kaynaklar bu listelerin terim sayısını farklı verir:

- **Jena listesi.** Pretterklieber’e göre BNA’daki 5.291 terim bu listede 5.124’e indi. Ona göre 670 eski terim çıktı, 498 yeni terim girdi (Pretterklieber, 2024). Bu üç sayı birbirini tam tutmaz. Kaynak aradaki küçük farkı açıklamaz. Kachlík ve arkadaşları ise Jena listesinde 4.329 terim sayar (Kachlík ve ark., 2020).
- **1955 listesi.** Strzelec ve arkadaşları 5.640 terim verir (Strzelec ve ark., 2017). Kachlík ve arkadaşları ise 4.822 terim sayar (Kachlík ve ark., 2020). Strzelec ve arkadaşlarına göre bu terimlerin %76’sı BNA’dan değişmeden alınmıştı (Strzelec ve ark., 2017).

Latince adlandırmada tam uzlaşı bu 1955 listesiyle sağlandı (Kachlik ve ark., 2017). 1998’deki TA, İngilizce karşılıkları eksiksiz veren ilk listedir (Gobée ve ark., 2024). Doğru betimleyici adı bulmak için bir eponim dizini de içerir (Whitmore, 1999). Varyasyonlar, yani kişiden kişiye değişen yapılar için ayrılan terimler azdır. BNA’da 86 terim (%1,99), TA’da 149 terim, TNA’da 41 terim varyasyonlara ayrılmıştır (Kachlík ve ark., 2020).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Eponim**, bir yapıya kişi adı verilmesidir. Sözcük Yunancada “ad veren” demektir. Antik Yunan’da bir kent görevlisinin unvanıydı (Kucharz, 2020). Anatomistler eponimleri pek sevmez. Çünkü kişi adı, yapının yeri ya da özelliği hakkında bilgi vermez (Gobée ve ark., 2024). Ad çoğu zaman yapıyı gerçekten ilk bulanın adı da değildir. Üstelik ülkeden ülkeye değişir (Barker, 1907). Öte yandan kişi adları akılda kolay kalır (Barker, 1907).

BNA bir orta yol buldu. Her yapıya nesnel bir ad verdi. Yaygın kişi adlarını ise köşeli parantez içinde tuttu (Barker, 1907). Böylece eponimler tümden kalkmadı, ama 20’ye indi (Pretterklieber, 2024). 1955’te kişi adları resmî Latince adlandırmadan çıkarıldı (Musil ve ark., 2026). 1998’deki TA da kişi adlı terimleri bıraktı. Ama tanınsınlar diye bir eponim sütunu tuttu (Bacci ve ark., 2024). TA2 bugün eponimleri resmî ad yapmaz; yalnızca “ilişkili terim” olarak verir (FIPAT, 2019).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Kişi adı ve resmî ad',
      sutunlar: ['Yaygın kişi adlı ad', 'TA2’deki resmî ad', 'Türkçesi'],
      satirlar: [
        ['Rolando yarığı', '*sulcus centralis*', 'merkezî oluk'],
        ['Sylvius yarığı', '*sulcus lateralis*', 'lateral oluk'],
        ['Sylvius su yolu', '*aquaeductus mesencephali*', 'orta beyin su yolu'],
        ['Monro deliği', '*foramen interventriculare*', 'karıncıklar arası delik'],
        ['Magendie deliği', '*apertura mediana ventriculi quarti*', 'dördüncü karıncığın orta açıklığı'],
        ['Luschka deliği', '*apertura lateralis ventriculi quarti*', 'dördüncü karıncığın yan açıklığı'],
        ['Reil adası', '*insula*', 'insula'],
        ['Luys cismi', '*nucleus subthalamicus*', 'subtalamik çekirdek'],
      ],
      not: 'Kaynak: FIPAT (2019). TA2’de kişi adları resmî ad değil, ilişkili terimdir. Aynı kişi adı birden çok yapıda geçebilir. “Monro” adı hem karıncıklar arası deliğe hem hipotalamus oluğuna (*sulcus hypothalamicus*) verilmiştir. “Rolando” adı da hem merkezî oluğa hem omuriliğin jelatinimsi maddesine (*substantia gelatinosa*) verilmiştir (FIPAT, 2019).',
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Klinikte iki dil',
      md: 'Çekya’dan bir çalışmaya göre klinik tıp, sık değişen anatomik adlandırmaya yetişemedi. Bu yüzden farklı sürümlerden terimlerin karıştığı bir “klinik lehçe” doğdu (Kachlík ve ark., 2025). Nöroloji gibi alanlarda kişi adları hâlâ yaygındır. Son 30 yılda yeni eponimler de eklendi (Bacci ve ark., 2024). 2018’de Lima’da bir morfoloji kongresi ile bir terminoloji sempozyumu birlikte yapıldı. Orada bile rastgele seçilen 10 sözlü sunumun 6’sında eponim kullanıldı (Duque Parra ve ark., 2020). Belirsiz, hatalı ya da eskimiş terimler yanlış anlaşılma riskini artırır (Strzelec ve ark., 2017). Bu yüzden hem resmî adı hem yaygın kişi adını bil.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `Şânîzâde’nin *Mir’âtü’l-ebdân*’ı üzerine yapılan çalışmalar, terimlerin Türkçeye nasıl aktarıldığını gösterir. Bir çalışmaya göre Osmanlı’da kitaplar, İstanbul’da ilk matbaanın kurulduğu 1726’ya dek elle yazılıyordu. İlk resimli anatomi kitabı ise yaklaşık 100 yıl sonra basılabildi (Ortug ve ark., 2018). Kitabın 56 şeklinden 46’sı Jean Palfin’in kitabından alınmıştı (Ortug ve ark., 2018). Şânîzâde önce terimin Arapçasını, sonra Türkçesini verir. Bazen Yunanca ve Latincesini de ekler. Türkçe karşılık yoksa terimi açıklar (Acıduman ve Arda, 2013). Kitaptaki kemik adlarında Arapça, Türkçe, Yunanca ve Latince terimler bir arada geçer (Acıduman ve Arda, 2013).

1839’da açılan Mekteb-i Tıbbiye-i Şahane’de eğitim dili Fransızcaydı (Farımaz ve Aldur, 2026b). Hristo Stambolski bu okulda anatomiyi Osmanlı Türkçesiyle okutan ilk öğretmendir. 1867’de, daha öğrenciyken, anatominin Arapçadan Türkçeye çevrilmesi görevi ona verilmişti (Farımaz ve Aldur, 2026b). Stambolski’nin 1874 tarihli *Miftâh-ı Teşrîh*’i Fransızca bir atlastan çevrilmiştir (Farımaz ve Aldur, 2026a). Hasan Mazhar Paşa da Türkçe tıp eğitimini başlatanlardandır. Pek çok anatomi teriminin Türkçe karşılığını bulup yerleştirmiştir (Turamanlar ve ark., 2012).`,
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Büyük dedenin anatomi kitabı',
      oyku: 'Tıp fakültesine yeni başlayan bir öğrenci, evde 1918 basımı bir anatomi kitabı buluyor. Kitapta merkezî oluğun adının yanında “fissure of Rolando” yazıyor. Lateral oluk ise “lateral cerebral fissure” adıyla geçiyor; yanında “fissure of Sylvius” var. Hocası derste “merkezî oluk” ve “lateral oluk” diyor. Öğrenci TA2’de bu kişi adlarını resmî terim olarak bulamıyor.',
      soru: 'Kitaptaki adlar yanlış mı? Bu adlar bugün hangi resmî adlarla karşılanır ve neden değişti?',
      cozum: `**Adlar yanlış değil, eski.** Gray (1918) merkezî oluğu “central sulcus” başlığıyla verir. Yanına üç ad ekler: *sulcus centralis [Rolandi]*, “fissure of Rolando” ve “central fissure” (Gray, 1918). Lateral oluğa ise “lateral cerebral fissure” der ve yanına “fissure of Sylvius” adını koyar (Gray, 1918). Rolando ve Sylvius kişi adıdır; yani bu adlar eponimdir. Kişi adını köşeli parantez içinde tutmak, 1895 listesinin yöntemiydi (Barker, 1907).

**Bugünkü resmî adlar:** TA2 merkezî oluğa *sulcus centralis*, lateral oluğa *sulcus lateralis* der. “Fissure of Rolando” ve “sylvian fissure” yalnızca ilişkili terimdir (FIPAT, 2019). Gray’in “fissure” (yarık) dediği lateral oluğa TA2 “sulcus” (oluk) der.

**Neden değişti?** Kişi adları yapının yeri ya da özelliği hakkında bilgi vermez (Gobée ve ark., 2024). 1955’te resmî Latince adlandırmadan çıkarıldılar (Musil ve ark., 2026). Yine de nöroloji gibi alanlarda kişi adları hâlâ yaygındır (Bacci ve ark., 2024). Bu yüzden iki adı da bilmek gerekir. *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Adlandırma sayılarla',
      ogeler: [
        {
          deger: '50.000+',
          aciklama:
            'Yaklaşık 5.000 yapıya verilmiş ad sayısı. BNA eş anlamlıları eleyerek bunu kabaca 5.000’e indirdi (Eycleshymer, 1917; Pretterklieber, 2024).',
        },
        {
          deger: '4.500–5.000',
          aciklama:
            '1895’teki BNA listesindeki yaklaşık terim sayısı. Kaynaklar farklı sayılar verir (Barker, 1907; Pretterklieber, 2024).',
        },
        {
          deger: '7.635',
          aciklama: '1998’deki Terminologia Anatomica’nın madde sayısı (Strzelec ve ark., 2017).',
        },
        {
          deger: '7.200+',
          aciklama: 'Ders kitaplarında ve çevrim içi kaynaklarda bulunan anatomik ve tıbbi eponim sayısı (Bacci ve ark., 2024).',
        },
      ],
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- Terim = kök + önek ve sonek. Bağlayıcı ünlü çoğunlukla “o”dur. Çözmeye sonekten başla (Ernstmeyer ve Christman, 2024).
- Çoğullar: *gyrus–gyri*, *sulcus–sulci*, *nucleus–nuclei*, *ganglion–ganglia*, *plexus–plexus*, *neuron–neura*.
- BNA 1895 Basel; PNA 1955 Paris; TA 1998; TNA 2016–2017; TA2 2019 (onay 2020 ya da 2021).
- Eponimler 1955’ten beri resmî Latince ad değildir. TA2’de ilişkili terimdir (Musil ve ark., 2026; FIPAT, 2019).
- *Superior* karşılaştırma sıfatıdır (“daha yukarıda”). *Supremus* üstünlük derecesidir (“en yukarıda”) (García-Orozco ve ark., 2025).
- Sıfat eki: varsayılan *-alis*; kökte *l* varsa *-aris*; araya *r* girerse yine *-alis* (Neumann ve ark., 2026).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Terminolojinin tarihi kaynaktan kaynağa farklı yazılır. Farkların çoğu, neyin sayıldığından ya da hangi olayın tarih alındığından gelir:

- **BNA’daki terim sayısı.** Barker (1907) yaklaşık 4.500 terim der. Pretterklieber (2024) kabaca 5.000 der. Aynı yazar başka bir karşılaştırmada 5.291 terim verir. Kachlík ve arkadaşları (2020) ise 4.311 madde sayar. Strzelec ve arkadaşları (2017) terimi ve maddeyi ayrı sayar. Ama aynı 4.311 sayısını 1955 listesine verir: 5.640 terim, 4.311 madde. Kaynaklar bu farkı açıklamaz. Güvenli ifade: yaklaşık 4.500–5.000 terim.
- **Jena listesi.** Gobée ve arkadaşları (2024), Kachlik ve arkadaşları (2008) ve Buklijas (2017) 1935 der. Pretterklieber (2024) ise listenin 1936’da Jena’daki yıllık toplantıda kabul edildiğini yazar. Kısaltma da değişir: JNA ya da INA.
- **IANC’nin kuruluşu.** Uluslararası Anatomik Adlandırma Kurulu (IANC), Gobée ve arkadaşlarına (2024) göre 1936’da kuruldu. Pretterklieber’e (2024) göre ise 1950’deki Oxford kongresinde kuruldu.
- **Nomina Anatomica baskıları.** Gobée ve arkadaşları (2024) beş baskıyı 1956–1983 arasına koyar. Pretterklieber (2024) 2. baskıyı 1961’e koyar. Kachlik ve arkadaşları (2008) 2.–6. baskıları 1960–1989 arasında sayar.
- **TA2’nin onayı.** Çoğu kaynak IFAA onayını 2020 olarak verir (Gobée ve ark., 2024; Waschke, 2024; ten Donkelaar ve ark., 2024). Pretterklieber (2024) 2021 der. FIPAT taslağı 2016’da geçici olarak onaylamıştı (Chmielewski ve Domagała, 2020). Bir kaynak “ikinci baskı”yı 2011’e koyar (Chmielewski ve Strzelec, 2020). Bu, TA’nın 2011’de çevrim içi yayımlanan düzeltilmiş baskısı olabilir (Strzelec ve ark., 2017).
- **TNA’nın tarihi.** TNA, 22 Eylül 2016’da IFAA yürütme toplantısında onaylandı (ten Donkelaar ve ark., 2017). Kachlík ve arkadaşları (2020) onu “TNA (2017)” diye anar. Waschke (2024) ise 2019’da onaylandığını yazar. Dijital sürümü 2022’de çıktı (ten Donkelaar ve ark., 2024).
- **Galenos mu, Celsus mu?** Eycleshymer (1917), kapsamlı bir anatomi dilini ilk kuranın Galenos olduğunu yazar. Pretterklieber (2024) ise Latince terminolojinin babasının Celsus olduğunu savunur. Galenos Yunanca yazmıştı. Yani iki kaynak farklı şeyleri anlatıyor olabilir.`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'TA2 tartışması',
      md: `TA2 yeni kurallar getirdi. Bunlara **düzenli anatomik terim** kuralları denir. Bu kurallar bağlacı, edatı ve iki adın yan yana eklenmesini yasaklar. Sözcük sırasını da sabitler. 1895’teki “kısa ve yalın” kuralının uzantısı sayılır (Neumann, 2021). Her adda yalın hâlde tek bir isim bulunur. Sıfatlar niteledikleri ismin hemen ardından gelir (Pretterklieber, 2024). Waschke’ye göre TA2’deki bu kapsamlı düzeltme, sonunda 1998’deki TA’ya göre terimlerin %20–30’unu değiştirecekti (Waschke, 2024).

Eleştiriler de var. Agur ve Dalley’e göre TA2 tek bir tercih edilen ad yerine seçenekler sunar. Böylece uzlaşıya dayalı ortak standart hedefi kaybolur (Agur ve Dalley, 2024). ten Donkelaar ve arkadaşlarına göre, derste, kitapta ve atlasta geleneksel Latinceyi kullanan Avrupalı anatomistler TA98’i kullanmayı sürdürecek (ten Donkelaar ve ark., 2024). Alman Anatomi Derneği ders kitapları için TA98 ve TNA’ya dayanan TA2023AG’yi önerdi (ten Donkelaar ve ark., 2024). Bu liste Eylül 2023’te Würzburg’da kabul edildi (Pretterklieber, 2024). ten Donkelaar ve arkadaşları TA98’e dayanan daha geniş bir liste de hazırlıyor: *Terminologia Anatomica Humana* (ten Donkelaar ve ark., 2024).

TA2’nin bir artısı, herkesin onu çevrim içi ve kısıtlamasız kullanabilmesidir (Waschke, 2024). Ama TA2 kalıcı kimlik numaraları yerine satır numaraları kullanır. Pretterklieber bunun yanlış anlamalara yol açabileceğini yazar (Pretterklieber, 2024). FIPAT’ın iki listesi de tam örtüşmez. Waschke, TA2 ile TNA arasındaki tutarsızlıkların giderilmesi gerektiğini söyler (Waschke, 2024).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Liste nasıl düzeltilir?** Neumann ve arkadaşlarına göre düzeltmelere üç ilke yön verir. Yanlış olmadıkça bir ad değiştirilmez. Düzeltmeler bilgiçlik olmamalıdır. Her küçük yapıyı listeye almaya çalışılmaz (Neumann ve ark., 2020). Kachlik ve arkadaşları TA’nın zayıf yanlarını yedi grupta topladı: hatalar, tutarsızlıklar, terimlerin çoğaltılması, eş anlamlılar, farklı yapılara aynı ad, fazla uzun terimler ve eksik terimler (Kachlik ve ark., 2015). Genel anatominin ve varyasyonların adlandırması da en ihmal edilmiş kısımlardandır (Kachlik ve ark., 2016).

Düzeltme önerileri dünyanın her yerinden gelir. Latin Amerika’dan TA üzerine yazılmış 66 makale incelendi. Bunların 22’si mevcut terimlerde değişiklik, 15’i yeni terim eklenmesini önerdi (Casari ve ark., 2024). İspanyolca için ortak bir dil, İbero-Latin Amerika terminoloji sempozyumlarıyla (SILAT) kuruluyor (Ottone ve ark., 2024). İngilizce anatomi dilini standartlaştırma girişimleri 1887’de başladı. Bu süreç 2019’da TA2’nin yayımlanmasıyla doruğa ulaştı (Adds ve ark., 2024).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Sinir sistemi için ayrı bir liste de var: **Terminologia Neuroanatomica** (TNA). TNA, TA’nın merkezî ve çevresel sinir sistemi bölümleri birleştirilerek hazırlandı. Doku bilimi listesi *Terminologia Histologica* da bu birleştirmeye katıldı (ten Donkelaar ve ark., 2017). TNA 4.413 terim içerir (Kachlík ve ark., 2020). Ön beyni, embriyonun gelişimine dayanan prozomer modeline göre sınıflar (ten Donkelaar ve Puelles, 2019). Liste için yeni öneriler de yapıldı. Watson ve arkadaşlarına göre *pons* adı yalnızca köprünün taban bölümüne verilmelidir (Watson ve ark., 2019). Bu tür öneriler TNA’nın bir sonraki sürümünde değerlendirilecek (ten Donkelaar ve Puelles, 2019). TNA’da hem İngilizce hem Latince terimler resmîdir (ten Donkelaar ve ark., 2018). Unutulmuş küçük oluk adlarının bazıları beyin haritalama döneminde ve TNA’da yeniden kullanıma girdi (ten Donkelaar ve ark., 2018). TNA yalın *hippocampus* terimini almadı. Onun yerine *formatio hippocampi* (hipokampal oluşum) gibi türev adları kullanır. Bu, TA ile bir tutarsızlık yaratır (Duque-Colorado ve ark., 2025).

TA2 de beyinle ilgili bazı kararlar verdi. *Cerebrum* (büyük beyin) adını yeniden ön beynin erişkindeki karşılığı olarak tanımladı (FIPAT, 2019). Beyin sapı için *truncus encephali* terimi ise 1977’deki 4. baskıyla gelmişti (FIPAT, 2019). TA2’ye göre *archi-* kökü “eski” değil “önder” demektir. “Eski” anlamındaki doğru kök *archaeo-*’dur: *archaeocerebellum* gibi (FIPAT, 2019). Puelles’e göre “hipotalamus” da yeni sayılabilecek bir sözcüktür. His onu 1893’te getirdi; ad, Forel’in 1877’deki “subthalamus” adının yerini aldı (Puelles, 2019).`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Eponim tartışması bitmiş değil. Ders kitaplarında ve çevrim içi kaynaklarda 7.200’den fazla anatomik ve tıbbi eponim bulunur (Bacci ve ark., 2024). Anket yanıtlayan anatomi dergisi editörlerinin %81,3’ü (13 kişi), eponimlerin bu bilimin tarihinde önemli bir yeri olduğunu düşünüyor (Bacci ve ark., 2024). Buna karşılık IFAA, anatomik, histolojik ve embriyolojik yapılarda bütün eponimlerin bırakılmasını önerir (Kachlík ve ark., 2020). Bazı eponimler etik bakımdan da sorunludur. Bazı yazarlar, Nazi Almanyası ile iş birliği yapmış kişileri onurlandıran eponimlerin kullanılmasına karşı çıkar (Gobée ve ark., 2024). Bugün iyelik eki olmayan biçim önerilir: “Cushing’s disease” yerine “Cushing disease” (Kucharz, 2020).

Bir kişi adı birden çok yapıyı gösterebilir (Kachlík ve ark., 2020). İkinci bölümde Forel ve Meynert örneklerini gördük. Beyin karıncıklarının anlatımında da pek çok kişi adı geçer: Monro, Magendie, Luschka, Sylvius (Akdoğan ve ark., 2026). Mitolojiden gelen adlar da benzer bir sorun taşır. Hipokampus ve *cornu ammonis* yapıyı betimlemez. Yine de bu adlar ve türevleri TA, TNA ve *Terminologia Histologica*’da geçer (Duque-Colorado ve ark., 2025). Hyrtl yerleşik yanlış adlandırmaları listelemişti. Talamus için notu açıktı: “tepe değil, oda” (Pretterklieber, 2024). Yunanca *thalamos*’un ilk anlamı, evin kadınlara ya da geline ayrılmış iç odasıdır (García-Cabezas ve ark., 2021).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Hangi “pons”?',
      oyku: 'Bir araştırmacı, beyin sapındaki lezyonları bir atlasla eşleştiriyor. Atlas, Watson ve arkadaşlarının beyin sapı için önerdiği yeni adlarla etiketlenmiş. Klinik raporlardan birinde “ponsta, dördüncü karıncığın tabanına yakın küçük bir lezyon” yazıyor. Araştırmacı bu bölgeyi atlasta arıyor. Ama bölgenin atlasta “pons” etiketi taşımadığını görüyor.',
      soru: 'Rapor ile atlas neden aynı bölgeye farklı ad veriyor? Bu bölgeyi karışıklığa yer bırakmadan nasıl tarif edersin?',
      cozum: `**İki kaynak “pons” sözcüğünü farklı genişlikte kullanır.** Ders kitabı geleneğinde ponsun ortasından geçen kesitte iki bölüm ayrılır: tegmentum ve pons tabanı (Dafny, 2020). Beyin sapında tegmentum ortadaki çekirdekli bölümdür. Büyük lif kütlesi ise en ventralde, yani öndedir (Coulombe ve ark., 2021). TA2 de ponsun altında iki bölüm sayar: taban kısmı (*pars basilaris pontis*) ve tegmentum (*tegmentum pontis*) (FIPAT, 2019). Raporu yazan hekim “pons” sözcüğünü bu geniş anlamda kullanmıştır.

**Yeni öneri daha dar bakar.** Watson ve arkadaşları *pons* adını yalnızca köprünün taban bölümüne vermeyi önerir. Beyin sapını da gelişime dayalı yeni bölümlere ayırır (Watson ve ark., 2019). Bu yüzden dördüncü karıncığın tabanına yakın bölge, bu öneriye göre “pons” etiketi taşımaz. Bu öneri henüz resmî bir listenin kararı değildir. TNA’nın bir sonraki sürümünde değerlendirilecek (ten Donkelaar ve Puelles, 2019).

**Nasıl tarif edilir?** Bölümü açıkça adlandır: “ponsun tegmentumunda, dördüncü karıncığın tabanına yakın”. Hangi adlandırmaya göre yazdığını da belirt. Puelles’e göre terimler kuram ve varsayım taşır. Kuramlar değiştikçe terimlerin anlamı da değişebilir (Puelles, 2019). *Vaka eğitim için kurgulanmıştır.*`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `Türkiye’de tıbbi ve anatomik terminoloji üzerine araştırma sayısı azdır (Esersoy, 2020). Son yıllardaki birkaç çalışma bu boşluğu doldurmaya başladı:

- **Lise ders kitabı.** 11. sınıf biyoloji kitabında 575 ayrı anatomi terimi bulundu; terimler toplam 6.391 kez geçiyordu. Terimlerin %89’u Türkçe kullanım bakımından doğruydu. Ama yalnızca %14’ü Terminologia Anatomica ile uyumluydu. Başlıca nedenler Latince karşılığın verilmemesi, kişi adları ve standart terim yerine sadeleştirilmiş Türkçe anlatımdı (Toçoğlu ve ark., 2026).
- **Sinir sistemi terimlerindeki sıfatlar.** Tokat Gaziosmanpaşa Üniversitesi’ndeki bir tez, 1998’deki TA’nın sinir sistemi ve duyu organlarıyla ilgili 2.431 terimini inceledi. Bu terimlerde toplam 625 farklı sıfat buldu. Yalnızca sinir sistemi başlığındaki 1.924 terimde 492 farklı sıfat vardı. Bunların 386’sı Latince, 60’ı Yunanca, 46’sı iki dilden kökenliydi. Aynı 492 sıfatın 483’ü yalın derecede, yalnızca 6’sı karşılaştırma ve 3’ü üstünlük derecesindeydi (Aydın, 2023).
- **Hareket sistemi terimleri.** Erciyes Üniversitesi’ndeki bir tez, TA’nın hareket sistemiyle ilgili 2.282 terimini inceledi. Genel anatomi bölümünde 111 Latince ve 21 Yunanca kökenli sıfat buldu (Esersoy, 2020).
- **Kafa sinirlerindeki kişi adları.** Gaziantep Üniversitesi’ndeki bir tez, TA ve TNA’nın kafa sinirleri başlığında kişi adı taşıyan 17 terim saptadı. Web of Science’taki yayınlarda çoğunlukla Latince ya da İngilizce adlar kullanılıyordu (Emek, 2022).
- **Osmanlı’dan bir karşılaştırma.** Stambolski’nin *Miftâh-ı Teşrîh*’inde beyni saran kemiklerle ilgili 75 terim incelendi. Bunların %85,3’ü (64 terim) TA2 ile tam anlam karşılığı gösterdi (Farımaz ve Aldur, 2026a).

Başka ülkelerle karşılaştırmak yol gösterir. Polonya, Slovenya, Japonya, İspanya ve Macaristan kendi dillerinde resmî bir terminoloji kurdu. Çekya ve Slovakya’da ise henüz yok (Musil, 2024). Polonya’da BNA, 1897’de Krysiński tarafından ulusal terminolojiye aktarıldı (Strzelec ve ark., 2017). Yunanistan’da eskimiş ve belirsiz terimlerin sürmesi klinik risk yaratıyor. Bu yüzden bir ulusal kurul önerildi (Triantafyllou ve Piagkou, 2025).`,
    },
  ],
};
