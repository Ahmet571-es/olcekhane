import type { DersBolumu } from '../../../types';

/** 05. bölüm: MR ve BT görüntüsünde yön: radyolojik ve nörolojik gösterim, R ve L işaretleri, başvuru çizgileri, eğik kesitler, sağ-sol çevrilmeleri. */
export const goruntudeYon: DersBolumu = {
  id: 'goruntude-yon',
  baslik: 'MR ve BT görüntüsünde yön',
  bloklar: [
    // ——— Gösterim kuralları: temel ———
    {
      tur: 'metin',
      md: `Bilgisayarlı tomografi (BT) ve manyetik rezonans (MR) beynin içini kesit kesit gösterir. **Tomografi** zaten “kesitlerle görüntüleme” demektir (OpenStax 1.7). Düz bir röntgen filmi bedeni yalnızca tek bir açıdan ve iki boyutlu gösterir (OpenStax 1.7). BT’de ise hasta motorlu bir masada yatar. Tarayıcı onun çevresinde 360 derece döner ve X-ışını görüntüleri toplar (OpenStax 1.7). Bilgisayar bu görüntüleri iki boyutlu kesitlere dönüştürür (OpenStax 1.7). Kafa BT’si art arda dizilmiş enine kesitler olarak gösterilir (OpenStax 1.7). BT’nin bedeli ışındır: hasta düz röntgenden kat kat fazla doz alır (OpenStax 1.7). MR ise manyetik alan ve radyo dalgalarıyla çalışır. Bedene girmeden görüntü alır (OpenStax 1.7).

Her kesit iki yönü birlikte taşır (Becq ve ark., 2026):

- **Aksiyel** kesitte sağ-sol ve ön-arka vardır.
- **Koronal** kesitte sağ-sol ve alt-üst vardır.
- **Sagital** kesitte ön-arka ve alt-üst vardır. Bu kesitte sağ-sol yoktur.`,
    },
    {
      tur: 'metin',
      md: `Ekranda bir aksiyel kesit gördüğünü düşün. Ekranın bir sağı, bir solu vardır. Peki hastanın sağı hangi yanda? Bunu iki ayrı alışkanlık belirler:

- **Radyolojik gösterim:** Radyologlar hastanın solunu ekranın sağında görmeyi sever. Kesite sanki hastanın ayak ucundan bakarlar (NiBabel, t.y.-c).
- **Nörolojik gösterim:** Nörologlar hastanın sağını ekranın sağında görmeyi sever. Kesite sanki başın tepesinden bakarlar (NiBabel, t.y.-c).

İki gösterimde de görüntünün kendisi aynıdır. Değişen, ekrana nasıl konduğudur. Biri ötekinin aynadaki görüntüsüdür. Adlar, bu iki meslekten insanların alışkanlığından gelir (NiBabel, t.y.-c).`,
    },
    {
      tur: 'animasyon',
      ad: 'mr-gosterimi',
      baslik: 'Ayak ucundan mı, baş tarafından mı?',
      aciklama:
        'Yatan hastanın aksiyel kesitine iki yerden bakılabilir. Radyolojik gösterimde göz ayak ucundadır; hastanın sağı ekranın solunda görünür. Düğmeyle nörolojik gösterime geç: göz baş tarafına geçer ve kesit aynalanır. Kırmızı işaret hep hastanın sağ yarımküresindedir.',
    },
    {
      tur: 'metin',
      md: `Aynı kural öteki kesitlere de uzanır. Radyolojik gösterimde kesite, ilgilenilen düzlemin önünden bakılır. Nörolojik gösterimde ise arkasından bakılır (Becq ve ark., 2026). Bu ne demek?

- **Koronal kesit:** Radyolojik gösterimde kesite hastanın önünden bakılır (Becq ve ark., 2026). Karşında duran birine bakar gibisin. Onun sağı senin solunda kalır.
- **Sagital kesit:** Radyolojik gösterimde kesite hastanın sol yanından bakılır (Becq ve ark., 2026). Bu kesitte sağ-sol yoktur; ön ve arka vardır.
- **Nörolojik gösterim** hepsini tersinden gösterir. Koronal kesite arkadan, sagitale sağdan, aksiyele baş tarafından bakılır (Becq ve ark., 2026).

Aşağıdaki sahne, radyolojik gösterimdeki bir koronal kesiti üç boyutta kurar.`,
    },
    {
      tur: 'sahne',
      baslik: 'Koronal kesite önden bakmak',
      aciklama:
        'Beyni koronal bir kesitle ikiye böldük ve ön yarısını kaldırdık. Kesite önden bakıyoruz, radyolojik gösterimdeki gibi. Hastanın sağı ekranın solunda, solu ekranın sağında. Etiketlere bak: sağ talamus ve sağ hipokampus ekranın sol yanında. Renkler doğala yakındır. Kesitin yerini kaydırıcıyla değiştirebilirsin.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'koronal', konum: 0.05 },
        bakis: 'on',
        etiketler: [
          { yapi: 'talamus-sag', metin: 'Sağ talamus' },
          { yapi: 'talamus-sol', metin: 'Sol talamus' },
          { yapi: 'hipokampus-sag', metin: 'Sağ hipokampus' },
          { yapi: 'hipokampus-sol', metin: 'Sol hipokampus' },
        ],
      },
      araclar: ['kesit', 'liste'],
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Taraf, işarete bakılarak söylenir',
      md: `Beynin iki yarısı büyük ölçüde simetriktir (Glen ve ark., 2020). Bu yüzden sağ ile sol, beyin görüntüsüne bakarak çoğu zaman ayırt edilemez (FSL, t.y.). Ön ile arka ya da alt ile üst karışırsa hemen göze batar. Sağ ile solun karışması ise çok daha sinsidir (Glen ve ark., 2020).

Bu yüzden MR görüntüsünde sağ ya da sol taraf mutlaka işaretlenir (Simha ve ark., 2012). Hastanelerin görüntü sistemleri beyin MR’ını hep aynı yönde ve sağ-sol işaretleriyle gösterir (Nishimaki ve ark., 2025). Bir görüntüde taraf söylemeden önce kenardaki **R** (sağ) ve **L** (sol) harfine bak.`,
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Makalelerdeki küçük not',
      md: `Bilimsel yazılarda beyin görüntülerinin altında sık sık küçük bir not görürsün. Uluslararası Epilepsiyle Savaş Birliği’nin (ILAE) görüntüleme grubunun bir yazısında şöyle yazar: “Bütün şekillerdeki bütün görüntüler radyolojik yöndedir.” (Cohen ve ark., 2025)

MNI beyin atlasının sayfası ise okurunu tersine uyarır: “Görüntülere bakarken unutma: sol soldur, sağ sağdır!” (MNI, t.y.) Yani o atlas nörolojik gösterimi kullanır. Aynı bilim alanında iki kural yan yana yaşar.`,
    },

    // ——— Gösterim kuralları: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Üç kesit, iki gösterim',
      sutunlar: [
        'Kesit',
        'Radyolojik: nereden bakılır?',
        'Radyolojik: ekranın sağında',
        'Nörolojik: nereden bakılır?',
        'Nörolojik: ekranın sağında',
      ],
      satirlar: [
        ['Aksiyel', 'Ayak ucundan', 'Hastanın solu', 'Başın tepesinden', 'Hastanın sağı'],
        ['Koronal', 'Önden', 'Hastanın solu', 'Arkadan', 'Hastanın sağı'],
        ['Sagital', 'Sol yandan', 'Sağ-sol yok; ön ve arka var', 'Sağ yandan', 'Sağ-sol yok; ön ve arka var'],
      ],
      not: 'Kaynaklar: NiBabel (t.y.-c); Becq ve ark. (2026). “Ekranın sağında” sütunları bakış yönünden çıkarıldı. Bu dersin kaynakları arasında sagital kesitin hangi yandan gösterildiğini açıkça yazan yalnızca Becq ve arkadaşlarıdır.',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Hangi ortam hangi gösterimi kullanır?',
      sutunlar: ['Ortam', 'Gösterim', 'Kaynak'],
      satirlar: [
        ['Radyologlar', 'Radyolojik: hastanın solu ekranın sağında', 'NiBabel (t.y.-c)'],
        ['Nörologlar', 'Nörolojik: hastanın sağı ekranın sağında', 'NiBabel (t.y.-c)'],
        ['Hastanenin görüntü arşivi (PACS)', 'Hep aynı yönde, sağ ve sol işaretli', 'Nishimaki ve ark. (2025)'],
        ['İki MR tarayıcısının kendi yazılımı (bir deneyde)', 'Radyolojik', 'Becq ve ark. (2026)'],
        ['ILAE görüntüleme yazısındaki şekiller', 'Radyolojik', 'Cohen ve ark. (2025)'],
        ['MNI beyin atlası sayfası', 'Nörolojik (“sol soldur”)', 'MNI (t.y.)'],
        ['FSLeyes adlı araştırma görüntüleyicisi', 'Varsayılan: tarayıcının çektiği yön', 'FSL (t.y.)'],
        ['NIfTI dosyası açan programlar', 'Program seçer; iki yön de geçerli', 'FSL (t.y.)'],
      ],
      not: 'Tablo kaynaklardan derlendi. Hangi ortamda olursan ol, taraf yine görüntüdeki R ve L işaretlerinden okunur.',
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Aynı sözcük, iki anlam.** “Radyolojik” ve “nörolojik” sözcükleri dosyanın içi için de kullanılır. Bu kullanım kafa karıştırır. Görüntü dosyası beyni küçük hacim birimleri hâlinde saklar. Bunlara **voksel** denir. Vokseller dosyada belli bir sırayla dizilir. Sıranın adı, ilerlediği yönlerin baş harfleridir: R sağ, L sol, A ön, S üst.

Bazıları vokselleri RAS sırasında dizilmiş dosyaya “nörolojik düzen” der (NiBabel, t.y.-c). LAS sırasındaki dosyaya da aynı nedenle “radyolojik düzen” denir (NiBabel, t.y.-c). Oysa ekran kuralı, dosyanın diskte nasıl saklandığından bağımsızdır (NiBabel, t.y.-c). FSL belgesi bunu açıkça söyler: saklama düzenine radyolojik ya da nörolojik demek, ekrandaki yön hakkında hiçbir şey söylemez (FSL, t.y.). Geçerli bir NIfTI dosyası, programın seçtiği her iki yönde de gösterilebilir (FSL, t.y.).

NiBabel geliştiricileri bu iki sözcüğü dosya düzeni için kullanmaktan kaçınır. Çünkü sözcükler, voksel düzeni ile başvuru uzayını birbirine karıştırır (NiBabel, t.y.-c). Dosya düzenlerini ve koordinat sistemlerini bir sonraki bölümde ayrıntılı göreceğiz.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**R ve L işaretleri nereden gelir?** Hastane görüntüleri DICOM adlı ortak bir biçimde saklanır. DICOM, çekimle ilgili bilgileri görüntünün başlığına yazar. Hastanın cihaza nasıl girdiği bunlardan biridir:

- **Baş önde** (*Head First*): hastanın başı cihaza önce girer (NEMA, 2026a).
- **Sağ dekübitus:** hastanın sağ yanı aşağıdadır (NEMA, 2026a).
- **Taraf** (*Laterality*): çift organlar için ayrı bir alandır. İncelenen bölümün hangi yanda olduğunu söyler (NEMA, 2026a).

DICOM insan için altı yön harfi kullanır: A (ön), P (arka), R (sağ), L (sol), H (baş) ve F (ayak) (NEMA, 2026b). Görüntünün satırlarının ve sütunlarının hangi yöne ilerlediği de bu harflerle bildirilir (NEMA, 2026b).

Başlıktaki yön bilgisi sağ ile solu ayırmanın asıl yoludur. Çünkü beyne bakarak bu ayrım çoğu zaman yapılamaz (FSL, t.y.). Bilgi yanlışsa sağ ve sol yanlış atanır. O zaman bütün analiz sonuçları yanlış tarafta çıkar (FSL, t.y.). FSL belgesinin kuralı açıktır: görüntüleyicideki yön etiketleri yanlış ya da eksikse hiçbir analiz yapılmamalıdır (FSL, t.y.).`,
    },
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Yanlış girilen bir yön bilgisi',
      md: `Hasta MR cihazına yerleştirilirken yön bilgisi cihazın yazılımına yanlış girilebilir. Bu bir tıbbi hataya yol açabilir (Christensen ve ark., 2006). Yanlış bilgi görüntünün başlığına yazılır. Sonra görüntülerle birlikte bütün hastaneye yayılır (Christensen ve ark., 2006).

Yön hatasının sonucu ağır olabilir. Hastalık yanlış yerde sanılabilir. Beynin yanlış tarafı bile ameliyat edilebilir (Nishimaki ve ark., 2025). Taraf hatalarını bu dersin **Sağ ile sol karışınca** bölümünde ayrıntılı göreceğiz.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Radyolojik gösterim:** aksiyele ayak ucundan, koronale önden, sagitale soldan bakılır. Aksiyel ve koronalde hastanın solu ekranın sağındadır (NiBabel, t.y.-c; Becq ve ark., 2026).
- **Nörolojik gösterim:** aksiyele baş tarafından, koronale arkadan, sagitale sağdan bakılır. Hastanın sağı ekranın sağındadır (Becq ve ark., 2026).
- “Radyolojik düzen” ve “nörolojik düzen” dosya düzeninin adlarıdır. Ekrandaki yön hakkında bir şey söylemez (FSL, t.y.).
- DICOM yön harfleri: A, P, R, L, H, F (NEMA, 2026b).
- Yön etiketleri yanlış ya da eksikse analiz yapılmaz (FSL, t.y.).`,
    },

    // ——— Gösterim kuralları: uzman ———
    {
      tur: 'kutu',
      cesit: 'derinles',
      duzey: 'ileri',
      baslik: 'Çift anlamın geçmişi',
      md: `Dosya düzeni anlamının bir geçmişi var. Eski programların bir kısmı vokselleri yalnızca tek bir sırayla kabul ediyordu. Bu sıranın birkaç adı vardı: sol el ya da sağ el, radyolojik ya da nörolojik, RAS ya da LAS. Eski FSL sürümleri de böyleydi; artık değil (FSL, t.y.).

Zamanla tarayıcılar voksel eksenlerini başvuru eksenlerine göre hemen her yönde üretmeye başladı (NiBabel, t.y.-c). Böylece sözcüklerin dosya düzeni anlamı da zayıfladı. Bugün iki sözcüğü görünce ilk soru şudur: ekrandan mı söz ediliyor, dosyadan mı?`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Açık veri depolarında çevrilmiş beyinler',
      md: `Ön-arka ya da alt-üst ekseninde bir hata kolayca görülür. Sağ-sol çevrilmesi ise MR analizinde “ne yazık ki fazlasıyla sık” görülen bir hatadır (Becq ve ark., 2026). Glen ve arkadaşları baktıkları her büyük açık veri deposunda sistematik sağ-sol çevrilmeleri buldu: FCP, OpenFMRI ve ABIDE (Glen ve ark., 2020). Çevrilme, aynı kişinin işlevsel (EPI) görüntüleri ile anatomik görüntüleri arasındaydı. Nedeni eksik ya da yanlış başlık bilgisiydi (Glen ve ark., 2020).

**Nereden kaynaklanır?**

- Siemens’in mozaik biçiminde kesitler ters sırada istiflenebilir. Bu bilgi başlığın standart dışı bir yerindedir; dönüştürmede okunmayabilir (Glen ve ark., 2020).
- Eski Analyze-7.5 dosyalarında doğru yön bilgisi yoktur (Glen ve ark., 2020).
- NIfTI’de yön tanımı daha sıkıdır. Ama başlıktaki iki yön matrisi, sform ve qform, birbiriyle çelişebilir (Glen ve ark., 2020).
- Görüntüler araştırma için kimliksizleştirilirken yön bilgisi kaybolabilir (Nishimaki ve ark., 2025).
- Hastanın tarayıcıda sırtüstü mü yüzüstü mü yattığı çekimde doğru kaydedilmelidir (Glen ve ark., 2020).
- Elle düzeltmek de risklidir. FSL’nin yön araçlarında yapılan bir hata sağ-sol değişimine yol açabilir (FSL, t.y.).

Olasılık uzayı geniştir. Üç eksenin çevrilme ve yer değiştirme birleşimleri 8 × 6 = 48 olası yön düzeni verir (Becq ve ark., 2026; Rorden, t.y.-a).

**Yalnızca anatomiden sağı bulmak.** Glen ve arkadaşlarının AFNI denetimi, 178 insan katılımcının hepsinde doğru öneri verdi. Çevrilmiş 90 kişinin de, çevrilmemiş 88 kişinin de hepsi doğru sınıflandı (Glen ve ark., 2020). Daha simetrik makak beyninde başarı düştü: 19 olgunun 17’si doğruydu, yani %89 (Glen ve ark., 2020). Yöntemin bir sınırı var. İki görüntü arasındaki göreli çevrilmeyi bulur, ama hangisinin başlığının yanlış olduğunu söyleyemez (Glen ve ark., 2020).

Nishimaki ve arkadaşlarının derin öğrenme modeli sağ-solu %99,8 doğrulukla buldu (Nishimaki ve ark., 2025). Model en çok sağdaki *planum temporale*’ye (“şakak düzlüğü”) baktı. Bu bölge dil işlevleriyle ilişkili olarak genellikle solda daha büyüktür (Nishimaki ve ark., 2025). İnsan beyninde sık görülen bir başka asimetri *petalia*dır. Sağ yarımküre önde, sol yarımküre arkada daha çok çıkıntı yapar (Glen ve ark., 2020).

Doğruluk kusursuz değildir. Bu yüzden çevrildiğinden kuşkulanılan görüntüde özgün DICOM başlıkları da denetlenmelidir (Nishimaki ve ark., 2025). Görüntüde sağı soldan ayıracak bir işaret yoksa, elle düzeltme kolayca yanlış etikete varır (FSL, t.y.). En sağlam yol çekimde fiziksel bir işaret kullanmaktır. Örneğin hangi yana konduğu kaydedilmiş bir E vitamini kapsülü (Glen ve ark., 2020).`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: Sağa kaymış dil alanları',
      oyku: `Bir yüksek lisans öğrencisi, açık bir veri deposundan işlevsel MR verileri indiriyor. Dil görevinde etkinlik çoğu katılımcıda sol yarımkürede çıkıyor. Ama bir merkezden gelen 20 katılımcıda etkinlik düzenli olarak sağda. Bu kişilerin anatomik T1 görüntüleri öteki merkezlerinkine benziyor. Merkezin dosyaları önce Analyze biçiminde paylaşılmış, sonra NIfTI’ye çevrilmiş. Başlıktaki iki yön matrisi birbirini tutmuyor.`,
      soru: 'Bu bulgu gerçek bir beyin farkı mı, yoksa bir yön hatası mı olabilir? Nasıl denetlersin?',
      cozum: `**Önce yön hatasından kuşkulan.** Sağ-sol çevrilmeleri açık veri depolarında sanıldığından sıktır. Glen ve arkadaşları baktıkları her büyük depoda sistematik çevrilme buldu (Glen ve ark., 2020). Bu öyküde üç uyarı işareti var. Kayma tek bir merkezden geliyor. Eski Analyze dosyalarında doğru yön bilgisi yoktur. NIfTI başlığındaki sform ve qform bilgisi çelişebilir ve yanlış dönüşüme yol açabilir (Glen ve ark., 2020).

**Nasıl denetlenir?** İşlevsel ve anatomik görüntüler AFNI’nin denetimiyle karşılaştırılabilir. Bu yöntem 178 insan katılımcının hepsinde doğru öneri verdi (Glen ve ark., 2020). Ama yalnızca iki görüntü arasındaki göreli çevrilmeyi bulur; hangisinin yanlış olduğunu söylemez (Glen ve ark., 2020). Anatomiye bakan bir derin öğrenme modeli de yardımcı olabilir. Böyle bir model sağ-solu %99,8 doğrulukla buldu (Nishimaki ve ark., 2025). Doğruluk kusursuz olmadığından özgün DICOM başlıklarına da bakılmalıdır (Nishimaki ve ark., 2025).

**Gelecek için:** En sağlam yol, tarafı kaydedilmiş bir E vitamini kapsülü gibi fiziksel bir işarettir (Glen ve ark., 2020). Çevrilme dışlanmadan bulgu yorumlanmaz. FSL belgesinin kuralı da budur: yön etiketleri yanlış ya da eksikse analiz yapılmaz (FSL, t.y.). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Başvuru çizgileri ve eğik kesitler: temel ———
    {
      tur: 'metin',
      md: `Bir soru daha var: aksiyel kesit hangi açıyla alınır? Aksiyel, koronal ve sagital beyin kesitlerinin yönü için evrensel bir standart yoktur. Yönü çoğu zaman radyolog ya da tetkiki isteyen hekim belirler (Park ve ark., 2010).

Uygulamada iki tür başvuru çizgisi kullanılır:

- **Kafanın dışındaki çizgiler.** Göz çukurunun kenarı ile dış kulak yolu gibi noktalardan geçer. BT ve MR’da aksiyel kesitler için bu çizgiler kullanılmıştır (Park ve ark., 2010).
- **Beynin içindeki çizgi.** Ön komissür (AC) ile arka komissürü (PC) birleştirir. Komissür, beynin iki yanını birbirine bağlayan lif demetidir. Bu **AC–PC çizgisidir** (Selvaraj ve ark., 2026).

Bazen kesit, incelenecek bir yapıya göre bilerek eğik alınır. **Eğik düzlem**, üç ana düzlemin hiçbirine paralel ya da dik değildir (OpenStax 1.6). Örneğin epilepside hipokampusa dik kesitler alınır.

BT’de açının bir görevi daha vardır: gözü korumak. Gözün merceği, ışından korunmak istenen bir dokudur (Abay ve ark., 2023). Tarayıcının halka biçimli gövdesine **gantri** denir. Gantri biraz yatırılınca göz, ışının doğrudan yolundan çıkabilir (Katsunuma ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Radyolojik gösterim:** kesite ayak ucundan (aksiyel), önden (koronal) ve soldan (sagital) bakılır. Aksiyel ve koronal kesitte hastanın solu ekranın sağındadır.

**Nörolojik gösterim:** kesite baş tarafından, arkadan ve sağdan bakılır. Hastanın sağı ekranın sağındadır.

**Taraf:** Beyin neredeyse simetriktir. Taraf, görüntüdeki R ve L işaretlerine bakılarak söylenir.

**Kesitin açısı:** Evrensel bir standart yoktur. Kafanın dışındaki çizgiler, beynin içindeki AC–PC çizgisi ya da incelenecek yapı başvuru olur.`,
    },

    // ——— Başvuru çizgileri ve eğik kesitler: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Kafanın dışındaki çizgiler.** Aksiyel kesitin açısı uzun süre kafatasının birkaç noktasından geçen çizgilerle ayarlandı. Burada bu çizgileri yalnızca beyni görüntülemek için birer başvuru olarak anıyoruz.

- **Reid taban çizgisi:** Göz çukurunun (*orbita*) alt kenarından ve kulak noktasından geçer (Gray, 1918). Kulak noktası, dış kulak yolu ağzının merkezidir (Gray, 1918).
- **Frankfurt yatay düzlemi:** Üç noktadan geçer: soldaki orbitale ve iki yandaki porion (Park ve ark., 2020). Başka bir kaynağa göre göz çukurunun alt kenarından ve dış kulak yolunun üst kenarından geçer (Park ve ark., 2010). Düzlem 1884’te bir antropoloji toplantısında kabul edildi (Park ve ark., 2020).
- **Orbitomeatal çizgi:** Adı, göz çukuru ile dış kulak yolunu birleştirmesinden gelir. Bazı yazarlar onu Frankfurt çizgisiyle bir tutar (Park ve ark., 2020). Bu dersin taradığı BT gantri çalışmaları ise onu ayrı bir taban çizgisi olarak kullanır. Metinlerinde hangi iki noktadan geçtiğini yazmazlar (Katsunuma ve ark., 2026; Abay ve ark., 2023).
- **Kantomeatal çizgi:** Göz köşesi ile dış kulak yolunun ortası arasında uzanır. Radyologlar bu çizgiyi BT ile birlikte geliştirdi (Park ve ark., 2010). Radyolojik uygulamada daha sık kullanılmıştır (Choi ve ark., 2013).

Beyin travması için yapılmış bir öneride aksiyel dilimler orbitomeatal çizgiye paralel alınır. Kafatası tabanındaki büyük delikten (*foramen magnum*) Türk eyerine (*sella*) kadar 5 mm’lik dilimler önerilir. Eyerin üstünde dilimler 10 mm’dir (Liao ve ark., 2018).

Bu çizgilerin ortak bir sorunu var. Reid ve kantomeatal çizgiler beynin üzerinde çizilemez, özellikle beyin kafatasından ayrılmışsa. Bu yüzden beynin içinde başvuru noktaları gerekir (Park ve ark., 2010).`,
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Aksiyel kesit için başvuru çizgileri',
      sutunlar: ['Çizgi', 'Nereden nereye?', 'Nerede kullanılır?'],
      satirlar: [
        [
          'Reid taban çizgisi',
          'Göz çukurunun alt kenarı → kulak noktası (dış kulak yolu ağzının merkezi) (Gray, 1918)',
          'Klasik yüzey anatomisi',
        ],
        [
          'Frankfurt yatay düzlemi',
          'Sol orbitale ve iki porion (Park ve ark., 2020); bir kaynakta göz çukurunun alt kenarı → dış kulak yolunun üst kenarı (Park ve ark., 2010)',
          'Antropoloji; 1884’te kabul edildi (Park ve ark., 2020)',
        ],
        [
          'Orbitomeatal çizgi',
          'Tanım kaynağa göre değişir; Frankfurt çizgisiyle bir tutulabilir (Park ve ark., 2020)',
          'BT’de aksiyel dilimler ve gantri açısı (Liao ve ark., 2018; Katsunuma ve ark., 2026)',
        ],
        [
          'Kantomeatal çizgi',
          'Göz köşesi → dış kulak yolunun ortası (Park ve ark., 2010)',
          'BT ve MR’da aksiyel kesit (Park ve ark., 2010; Choi ve ark., 2013)',
        ],
        [
          'AC–PC çizgisi',
          'Ön komissür → arka komissür; beynin içinde',
          'MR’da aksiyel kesit (Selvaraj ve ark., 2026; Wattjes ve ark., 2026)',
        ],
      ],
      not: 'İlk dört çizgi kafatası noktalarına dayanır; burada yalnızca beyni görüntülemek için başvuru olarak verildi. Aynı ad kaynaktan kaynağa farklı noktaları anlatabilir. Bir yazıda çizginin adını görünce hangi iki noktadan geçtiğine bak.',
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      baslik: 'BT’de göz merceğini korumak',
      md: `Gantriyi orbitomeatal çizginin yaklaşık 10–12 derece üstüne yatırmak bir yöntem olarak öne çıktı. Bu, gözün doğrudan ışınlanmasını önlemenin etkili bir yolu sayılır (Katsunuma ve ark., 2026). Avrupa önerileri de olanak varsa bu açıyı önerir (Abay ve ark., 2023).

Birleşik Krallık Radyologlar Kraliyet Koleji daha da açık konuşur. Her beyin taraması, mercek ışın alanının dışında kalacak bir taban çizgisiyle yapılmalıdır (Abay ve ark., 2023). Yani kesitin açısı yalnızca görüntünün düzeni için değil, hastanın korunması için de seçilir.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**AC–PC’ye hizalı MR.** MR’da beynin kendisi görünür. Bu yüzden kesitler çoğu zaman beynin içindeki AC–PC çizgisine göre hizalanır (Selvaraj ve ark., 2026). Hizalamanın nasıl yapıldığını ve bu çizginin farklı tanımlarını bir sonraki bölümde göreceğiz.

**Hastalığa göre düzlem.** Kesitin yönü, sorulan soruya göre de seçilir:

- **Multipl skleroz (MS):** Alman Nöroradyoloji Derneği’nin kılavuzunda aksiyel kesitler iki çizgiden birine göre alınır. Biri korpus kallozumun altından geçen subkallozal düzlem, öteki AC–PC çizgisidir. Kılavuz sagital kesitleri de ister (Wattjes ve ark., 2026).
- **Epilepsi:** Kesitler hipokampusa göre eğik alınır. Bunu hemen aşağıda görüyoruz.`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Epilepside hipokampusa dik kesitler.** Epilepside kesitin açısı daha da önemlidir. ILAE’nin görüntüleme çalışma grubu HARNESS-MRI adlı bir protokol tanımladı. Protokolün merkezinde üç boyutlu çekimler vardır (Bernasconi ve ark., 2019). Bu çekimler çoğu MR cihazında bulunur. Bu yüzden protokol her ortamda ve her ülkede uygulanabilir (Bernasconi ve ark., 2019).

HARNESS üç çekimden oluşur (Cohen ve ark., 2025):

- vokseli 1 mm³ ya da daha küçük, üç boyutlu T1 ağırlıklı çekim,
- yüksek çözünürlüklü, üç boyutlu FLAIR,
- **hipokampusun uzun eksenine dik**, iki boyutlu koronal T2 çekimi.

Son çekim eğik bir koronal kesittir. İnsanda hipokampusun uzun ekseni önden arkaya uzanır (Vogel ve ark., 2020). Kesitler bu eksene dik olunca hipokampus, ekmeği dilimler gibi enine kesilir.

Neden bu kadar uğraşılır? MR’da bir hasar (lezyon) görülmesi önemlidir. Lezyon görülen MR, ameliyattan sonra nöbetsiz kalma olasılığının 2,5 kat yüksek olmasıyla ilişkilidir (Cohen ve ark., 2025).`,
    },
    {
      tur: 'sahne',
      duzey: 'lisans',
      baslik: 'Hipokampusun uzun ekseni',
      aciklama:
        'Sol yarımküreyi hipokampustan geçen bir sagital kesitle açtık. Soldan bakıyoruz; ön taraf ekranın solunda. Radyolojik gösterimde sagital kesite de soldan bakılır. Pembe: hipokampus. Turuncu: hemen önündeki amigdala. Hipokampus kesitte önden arkaya uzanan bir şerit gibi görünür. Epilepsi çekiminde koronal kesitler bu şeride dik olarak planlanır. Modelin kesit aracı yalnızca üç ana düzlemi keser; eğik kesiti hayalinde çiz.',
      sahne: {
        katmanlar: ['kabuk', 'beyaz', 'derin', 'karincik', 'sap'],
        renk: 'dogal',
        gizle: ['bolge:sinir'],
        kesit: { duzlem: 'sagital', konum: 0.39 },
        bakis: 'sol',
        boya: [
          { secici: ['hipokampus-sol'], renk: '#ee6a92' },
          { secici: ['amigdala-sol'], renk: '#f28a52' },
        ],
        etiketler: [
          { yapi: 'hipokampus-sol', metin: 'Hipokampus' },
          { yapi: 'amigdala-sol', metin: 'Amigdala' },
          { yapi: 'yan-karincik-sol', metin: 'Yan karıncık' },
        ],
      },
      araclar: ['kesit', 'liste'],
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: “Normal” çıkan MR',
      oyku: `19 yaşında bir genç iki yıldır nöbet geçiriyor. Nöbetler hep aynı biçimde başlıyor: önce midede yükselen garip bir his, sonra dalgınlık. İlaçlara rağmen nöbetler sürüyor. Bir ilçe hastanesinde çekilen beyin MR’ı “normal” diye raporlanmış. Çekimde yalnızca 5 mm kalınlığında aksiyel T1 ve T2 kesitler var. Hasta, ameliyat şansı değerlendirilsin diye bir epilepsi merkezine gönderiliyor.`,
      soru: 'Merkez yeni bir MR isteyecek. Kesitlerin yönü ve kalınlığı nasıl planlanmalı? Neden?',
      cozum: `**Hangi çekim?** ILAE’nin HARNESS-MRI protokolü üç çekimden oluşur (Cohen ve ark., 2025). Birincisi vokseli 1 mm³ ya da daha küçük, üç boyutlu T1’dir. İkincisi yüksek çözünürlüklü, üç boyutlu FLAIR’dır. Üçüncüsü hipokampusun uzun eksenine dik, iki boyutlu koronal T2’dir. Bu diziler çoğu MR cihazında vardır. Bu yüzden protokol bir ilçe hastanesinde de uygulanabilir (Bernasconi ve ark., 2019).

**Neden eğik koronal?** MR’da kesitler, önce alınan bir ön görüntü üzerinde planlanır (Simha ve ark., 2012). Koronal T2 kesitleri bu ön görüntüde hipokampusun uzun eksenine dik açılandırılır. Wellmer’in önerisinde de T2 ve FLAIR en az iki yönde ve hipokampal açıyla alınır. Kesit kalınlığı 3 mm’yi geçmez (Wellmer ve ark., 2013). Bu hastanın 5 mm’lik aksiyel kesitleri bu ölçütlerin dışındadır.

**Neden önemli?** Lezyon görülen MR, ameliyattan sonra nöbetsiz kalma olasılığının 2,5 kat yüksek olmasıyla ilişkilidir (Cohen ve ark., 2025). Yani doğru düzlem, tedavi kararını değiştirebilir. *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Başvuru çizgileri ve eğik kesitler: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Çizgiler arasındaki açılar.** Başvuru çizgileri birbirine paralel değildir. Bu yüzden aynı beynin aksiyel kesitleri, merkezden merkeze farklı açılarda alınabilir.

- Kantomeatal çizgi, Reid çizgisine göre yaklaşık 10 derece “burun yukarı”dır (Park ve ark., 2010).
- Tek bir kadavra başında AC–PC çizgisi kantomeatal çizgiye neredeyse paraleldi. Reid çizgisiyle ise yaklaşık 15 derece açı yapıyordu (Park ve ark., 2010).
- Kore’de 7 tesla MR ile 34 gönüllü incelendi. AC ve PC merkezlerini birleştiren çizgi ile kantomeatal çizgi arasında 10,1 derece ölçüldü (Choi ve ark., 2013).
- MR’da standart düzlemlerde kurulan aksiyel görüntüler, orbitomeatal çizgiye paralel BT görüntülerinden biraz farklı açılıdır (Liao ve ark., 2018).

İkinci ve üçüncü bulgu birbirini tutmaz gibi görünür. Fark tanımdan ve örneklemden gelebilir. Park ve arkadaşları tek bir kadavraya baktı. Choi ve arkadaşları canlı gönüllülerde, AC ve PC’nin merkezlerinden geçen çizgiyi ölçtü.

Kaynaklar adlarda da ayrılır. Gray, kulak noktasını dış kulak yolu ağzının merkezi sayar (Gray, 1918). Park ve arkadaşları (2010) ise Reid çizgisini Frankfurt düzlemiyle bir tutar. Çizgiyi dış kulak yolunun üst kenarından geçirir. Aynı yazı, 1884’te Reid çizgisinin kabul edildiğini söyler (Park ve ark., 2010). Oysa 1884’teki Frankfurt Anlaşması’yla kabul edilen Frankfurt düzlemidir (Park ve ark., 2020).`,
    },
    {
      tur: 'kutu',
      cesit: 'goruntuleme',
      duzey: 'ileri',
      baslik: 'Gantri açısının sayıları',
      md: `- Uluslararası Radyolojik Korunma Komisyonu (ICRP), 2011’de göz merceği için eşik dozu 0,5 Gy’e düşürdü. Bu, kesin (deterministik) etkilerin eşiğidir (Katsunuma ve ark., 2026).
- Uygun gantri açısı mercek dozunu %87’ye kadar azaltabilir. Ama bir ankette merkezlerin yalnızca %32’si gözü koruyan teknikleri düzenli kullanıyordu (Katsunuma ve ark., 2026).
- Harbron ve arkadaşları 668 kafa BT’sine baktı. Göz küreleri olguların %88’inde, mercekler %57’sinde tarama alanındaydı (Katsunuma ve ark., 2026).
- Çoğu BT tarayıcısı yaklaşık ±30 derece fiziksel açı verebilir. Boynu bükmek ya da germek daha büyük bir etkin açı sağlar (Katsunuma ve ark., 2026).
- Gantrisi eğilemeyen bir cihazda çocuk kafası modeliyle (fantom) çalışıldı. Tarama çizgisi, göz çukurunun üst kenarını büyük deliğin arka kenarına bağlayan çizgiye paralel tutuldu. Hizalama başın konumuyla sağlandı (Xu ve ark., 2025).
- Bu çalışmada baş eğimini −10 ile 0 derece arasında tutmak tarama uzunluğunu ve dozu azalttı. Görüntü kalitesi korundu (Xu ve ark., 2025).
- Çocuklarda başı standart konuma getirmek çoğu zaman zordur. Huzursuzluk, uyutma (sedasyon), ameliyat sonrası durum ya da solunum tüpü buna engel olabilir (Xu ve ark., 2025).
- Birleşik Krallık’ta Newham Üniversite Hastanesi’nde, kontrastsız kafa BT’lerinde merceği dışarıda bırakma oranı %0’dan %14,5’e çıktı (Abay ve ark., 2023). İyileşme belirgindi, ama denetim standardına ulaşmadı (Abay ve ark., 2023).
- Merceği içeren beş ya da daha fazla BT’si olanlarda, katarakt için düzeltilmiş tehlike oranı 2,12 bulundu (Abay ve ark., 2023). Tehlike oranı, olayın görülme hızını iki grup arasında karşılaştırır.`,
    },
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Hastalığa göre düzlem: ayrıntılar.**

- **MS izlemi:** Alman kılavuzu izlem çekimlerinin özdeş yapılmasını güçlü biçimde önerir. Başın aynı biçimde yeniden konumlandırılması da buna dahildir (Wattjes ve ark., 2026). Duyarlılık ağırlıklı görüntülemede (SWI) ise açı, mıknatısın koordinat sistemine göre tam aksiyel tutulur (Wattjes ve ark., 2026).
- **Ataksi:** Uzlaşı önerilerinde kesit bloğu, beyinciğin tamamını almak için AC–PC çizgisine göre tipik olarak 10–20 derece eğilir (Öz ve ark., 2024). Yapısal üç boyutlu T1 ve T2 görüntüler sagital yönde alınır (Öz ve ark., 2024).
- **Epilepsi:** Wellmer’in “temel 6” protokolüne göre T2 ve FLAIR, en az iki yönde ve hipokampal açıyla alınmalıdır (Wellmer ve ark., 2013). T1 ise 1 mm izotropik vokselli, üç boyutlu teknikle alınmalıdır (Wellmer ve ark., 2013).
- **Avrupa’daki uygulama:** EpiCARE ağındaki merkezlerin %79’u HARNESS-MRI’yı bütün epilepsi hastalarında uyguluyor (Adler ve ark., 2025). Önerilere uyum 2016’daki %50’den %79’a çıktı. Merkezlerin %87’si yüksek çözünürlüklü iki boyutlu koronal T2 çekiyor (Adler ve ark., 2025).
- **Hipokampusun alt alanları:** 7 tesla çalışmalarında eğik koronal dilimler hipokampusun uzun eksenine dik yönlendirilir. Düzlem içi çözünürlük 0,44 × 0,44 mm², dilim kalınlığı 1,0 mm’dir (Berron ve ark., 2017).
- **Doku atlaslarıyla eşleştirme:** Histoloji atlaslarının çoğu koronal düzlemde kesilmiştir. Hipokampus dışındaki bölgeler için uzun eksene dik kesilmiş histoloji verisi yoktur (Berron ve ark., 2017). MR’ı doku kesitiyle eşleştirirken bu düzlem farkı bir sorundur.
- **Yazılım:** FLAIR hipokampus eksenine göre eğik, T1 başka bir yönde alınmış olabilir. Yön bilgisini okuyan bir program ikisini doğru biçimde üst üste gösterir (Rorden, t.y.-a).`,
    },
  ],
};
