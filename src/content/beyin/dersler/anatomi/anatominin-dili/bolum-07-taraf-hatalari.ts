import type { DersBolumu } from '../../../types';

/** 07. bölüm: Sağ ile sol karışınca: radyoloji raporlarında ve ameliyatta taraf hataları, kontrol listesi ve taraf işaretleme, Türkiye’den çalışmalar. */
export const tarafHatalari: DersBolumu = {
  id: 'taraf-hatalari',
  baslik: 'Sağ ile sol karışınca: taraf hataları',
  bloklar: [
    // ——— Sağ ile sol neden karışır: temel ———
    {
      tur: 'metin',
      md: `Sağ ile solu karıştırmak sanıldığından yaygındır. Van der Ham ve arkadaşlarının geniş bir çalışmasında kişilerin %14,2’si sağı solu sık karıştırdığını söyledi (Thaler ve ark., 2026).

Bu beceri çocuklukta yavaş gelişir. Çoğu çocuk 7 yaşında kendi beden bölümlerini doğru taraf adıyla söyler. Ama sağ-sol ayrımı ancak 12 yaş dolaylarında erişkin düzeyine ulaşır (Thaler ve ark., 2026). 11 yaşındaki çocukların yarısı, karşısındaki kişinin sağını solunu doğru ayırır (Gormley ve ark., 2018).

Karşındakinin sağını bulmak neden zor? Çünkü o kişi sana dönüktür. Onun sağı, senin solunun tam karşısındadır. Bunu çözmek için onu zihninde döndürmen gerekir. Buna **zihinsel döndürme** denir (Gormley ve ark., 2018). Tıp öğrencilerini en çok zorlayan durum da budur. Karşılarındaki kişinin ya da standart bir röntgen filminin sağını solunu ayırmak onlara en zor gelir (Gormley ve ark., 2018).

İnsanlar küçük hileler de kullanır. İşaret parmağı ile başparmak dik açı yapınca, sol elde bir “L” harfi oluşur (Gormley ve ark., 2018). Bu tür hilelere karşın insanlar yine zorlanır (Gormley ve ark., 2018).`,
    },
    {
      tur: 'sahne',
      baslik: 'Hangisi sağ?',
      aciklama:
        'Beyne yukarıdan bakıyoruz; ön taraf ekranın üstünde. Bu bakışta hastanın sağı ekranın sağındadır, tıpkı nörolojik gösterimdeki gibi. İki yarımküre birbirinin aynadaki görüntüsüne çok benzer. Etiketler olmasa hangisinin sağ olduğunu söyleyemezdin. “Bakış” düğmesiyle alttan bak: ön yine üstte kalır, ama sağ ile sol yer değiştirir. Alttan bakış, radyolojik gösterimdeki ayak ucundan bakışa benzer. Renkler doğala yakındır.',
      sahne: {
        katmanlar: ['kabuk'],
        renk: 'dogal',
        bakis: 'ust',
        etiketler: [
          { yapi: 'ust-frontal-girus-sol', metin: 'Sol yarımküre' },
          { yapi: 'ust-frontal-girus-sag', metin: 'Sağ yarımküre' },
        ],
      },
      araclar: ['bakis'],
    },
    {
      tur: 'kutu',
      cesit: 'biliyor-muydun',
      baslik: 'Titanik ve sağ-sol',
      md: 'Sağ-sol karışıklığının tarihte de bir payı olabilir. Titanik’in batmasında bir sağ-sol yanılgısının rol oynamış olabileceği bile öne sürülmüştür (Gormley ve ark., 2018). Bu, kanıtlanmış bir bilgi değil, öne sürülmüş bir görüştür.',
    },

    // ——— Sağ ile sol neden karışır: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Sağ-sol ayrımının bilişsel temeli.** Sağ-sol ayrımı pek çok kişi için kendiliğinden ve sezgisel değildir (Gormley ve ark., 2018). Zihinsel döndürme işinin beynin alın ve yan kafa bölgesinden (frontoparyetal bölge) kaynaklandığı düşünülür (Gormley ve ark., 2018).

Bir çalışmada 290 tıp öğrencisinin sağ-sol ayırma becerisi ölçüldü. Ölçüm için Bergen Sağ-Sol Ayırma Testi kullanıldı (Gormley ve ark., 2018). Öğrenciler arasında geniş bir değişkenlik bulundu. Cerrahiyi düşünen öğrencilerin becerisi daha yüksek çıktı (Gormley ve ark., 2018). Kesintiler ve dikkat dağınıklığı bu beceriyi bozar (Gormley ve ark., 2018).

Gormley ve arkadaşlarının bir varsayımı da var. Nüfusun yaklaşık %90’ı sağ elini kullanır. Bu kişiler kendi sağ yanlarında, yani “akıcı” yanlarında iş yapmayı yeğleyebilir. Yazarlara göre bu eğilim, zaman baskısında yanlış tarafa kaymaya yol açabilir (Gormley ve ark., 2018).`,
    },

    // ——— Sağ ile sol neden karışır: uzman ———
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Sağ-sol karışıklığını ameliyathanede ölçmek',
      md: `Thaler ve arkadaşları sağ-sol karışıklığını ameliyathaneye benzeyen bir düzenekte ölçtü. Bir eğitim mankeni farklı konumlarda yatırıldı. Hata, yüzüstü konumda yan yatışlara göre en azdı. Sırtüstü konumda ise tepki süresi en kısaydı (Thaler ve ark., 2026).

Klasik sağ-sol testlerindeki hata oranları, bu uygulamalı testteki hatayı öngörmedi (Thaler ve ark., 2026). Yani masa başı bir testte başarılı olmak, ameliyathanede hata yapmamayı güvenceye almaz. Yazarlar karışıklığı iki bileşene ayırır (Thaler ve ark., 2026):

- zihinde uzaysal dönüşüm yapma becerisi,
- dile dayalı, sözel-anlamsal beceri.

Cinsiyetle ilgili veriler ise karışıktır. Wolf’un 1973 verisinde, hızlı karar gerektiren işlerde kadınların %17,5’i sağ-solu sık karıştırdığını söyledi. Erkeklerde bu oran %8,8’di (Thaler ve ark., 2026). Ama bu bir öz bildirimdir. Gormley ve arkadaşlarına göre sağ-sol ayırmada cinsiyet farkının kanıtı kesin değildir (Gormley ve ark., 2018).`,
    },

    // ——— Raporlarda ve ameliyatta taraf hatası: temel ———
    {
      tur: 'metin',
      md: `Sağlıkta bu karışıklığın bir adı vardır: **taraf hatası**. Radyoloji raporunda taraf hatası, sağdaki bir bulgunun solda yazılmasıdır. Ya da tam tersi (Landau ve ark., 2015). Böyle bir hata yanıltıcıdır. Yanlış tarafta bir girişime, hatta yanlış taraf ameliyatına yol açabilir (Weng ve ark., 2025).

Ameliyathanede de aynı tehlike vardır. Dünya Sağlık Örgütü (DSÖ), yanlış yerde yapılan ameliyatların tekrar tekrar bildirildiğini yazar. Bu bildirimler beyin ameliyatlarını da kapsar (DSÖ, 2009). Yanlış yer ameliyatı, iki taraflı yapılarda daha olasıdır (DSÖ, 2009). Beyin de iki yarımküreden oluşur.

İngiltere’de 2012–2020 arasında bildirilen 797 cerrahi “asla olmaması gereken olay” incelendi. Bunların 84’ü sağ ile solun karıştırılmasından kaynaklandı (Omar ve ark., 2021, aktaran Thaler ve ark., 2026). Bu sayılar ameliyat sayısı değil, bildirilen ağır olayların sayısıdır. “Asla olmaması gereken olay”, önlenebildiği için hiç yaşanmaması beklenen ağır bir hatadır.`,
    },

    // ——— Raporlarda taraf hatası: lisans ———
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Radyoloji raporlarında taraf hataları',
      sutunlar: ['Çalışma', 'Ne incelendi?', 'Bulgu'],
      satirlar: [
        [
          'Sangwaiya ve ark. (2009)',
          '2007 yılının 1.065.322 radyoloji raporu',
          'Sonradan ek raporla düzeltilen 88 taraf hatası; hataların çoğu (%70,9) klinik açıdan önemli sayıldı',
        ],
        [
          'Luetmer ve ark. (2013)',
          '2007–2011 arasındaki 2.923.094 rapor',
          '1607 raporda (%0,055) sonradan düzeltilmiş taraf hatası; 56 raporda (%0,0019) büyük hata; hiçbiri yanlış taraf ameliyatına yol açmadı',
        ],
        [
          'Landau ve ark. (2015)',
          'Rapor bitmeden taraf sözcüklerini öne çıkaran bir sistem, 7 ay',
          '32 hata yakalandı; özetteki oran %0,0007, paydası yazmaz; en yüksek oran BT’de',
        ],
        ['Lee ve ark. (2015)', 'Bir veri tabanındaki 29.257 inceleme, bir yazılımla tarandı', '14 incelemede (%0,048) taraf hatası'],
        [
          'Weng ve ark. (2025), Tayvan',
          '10.000 gerçek rapor',
          '120 raporda (%1,20) taraf hatası; birleşik raporlarda %1,47, birleşik olmayanlarda %0,57',
        ],
      ],
      not: 'Oranlar birbiriyle karşılaştırılamaz: kimi çalışma yalnızca sonradan düzeltilen hataları, kimi bir yazılımın yakaladıklarını sayar. Payda da rapor ya da inceleme sayısıdır; ameliyat ya da hasta sayısı değildir. Birleşik rapor, birden çok incelemeyi tek raporda toplar. Luetmer ve arkadaşlarına göre sesli yazdırma programı büyük hata oranını değiştirmedi. Sangwaiya, Luetmer, Landau ve Lee çalışmalarının yalnızca özeti okundu.',
    },
    {
      tur: 'vaka',
      duzey: 'lisans',
      baslik: 'Vaka: Ekranın sağındaki lezyon',
      oyku: `Gece nöbetinde bir radyoloji asistanı, baş ağrısıyla gelen bir hastanın kafa BT’sini raporluyor. Aksiyel kesitlerde ekranın sağ yarısında parlak bir alan var. Asistan yorgun ve aynı anda iki telefona bakıyor. Raporuna “sağ yarımkürede lezyon” yazıyor. Sabah raporu denetleyen uzman, görüntünün kenarındaki harflere bakıyor. Ekranın sağ kenarında “L” yazıyor.`,
      soru: 'Raporda nasıl bir hata var? Bu hata neden oldu ve nasıl önlenebilirdi?',
      cozum: `**Hata: taraf hatası.** Radyologlar görüntüye radyolojik gösterimle bakar: hastanın solu ekranın sağındadır (NiBabel, t.y.-c). Ekranın sağ kenarındaki “L” harfi de bunu söyler. Yani lezyon hastanın **sol** yarımküresindedir. Sağdaki bir bulgunun solda yazılmasına ya da tersine taraf hatası denir (Landau ve ark., 2015).

**Neden oldu?** Sağ ile sol, beyin görüntüsüne bakarak çoğu zaman ayırt edilemez (FSL, t.y.). Ekrandaki kesit, karşıdaki birine bakmak gibidir; bu da zihinsel döndürme ister (Gormley ve ark., 2018). Kesintiler ve dikkat dağınıklığı bu beceriyi bozar (Gormley ve ark., 2018). Gece nöbeti, yorgunluk ve iki telefon tam da böyle bir ortamdır.

**Neden önemli?** Rapordaki taraf hatası yanlış tarafta bir girişime, hatta yanlış taraf ameliyatına yol açabilir (Weng ve ark., 2025). Büyük taraf hataları seyrektir. Bir çalışmada yaklaşık 2,9 milyon raporun 56’sında görüldü, yani %0,0019’unda (Luetmer ve ark., 2013). Ama bedeli ağırdır.

**Nasıl önlenir?** Taraf yazmadan önce görüntüdeki R ve L işaretine bakılır (Simha ve ark., 2012). Teknoloji de yardım eder. Taraf sözcüklerini renklendirip ayrı bir pencerede gösteren bir sistem, 7 ayda 32 hatayı rapor sonuçlanmadan yakaladı (Landau ve ark., 2015). *Vaka eğitim için kurgulanmıştır.*`,
    },

    // ——— Ameliyatta taraf hatası: lisans ———
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Ameliyatta taraf hatası.** DSÖ’nün aktardığı bir tahmine göre ABD’de yanlış yer ya da yanlış hasta ameliyatı yaklaşık 50.000–100.000 işlemde bir görülür. Bu, yılda 1500–2500 olay demektir (DSÖ, 2009). Buradaki payda bütün ameliyatlardır, yalnızca beyin ameliyatları değil.

Beyin cerrahları arasında ulusal bir anket yapıldı. Cerrahlar bir önceki yılda yaptıkları ameliyatları ve yanlış yer ameliyatı olup olmadığını bildirdi. Katılan cerrahlar o yıl 10.203 kraniyotomi yapmıştı (Jhawar ve ark., 2007). Kraniyotomi, kafatasının bir parçası açılarak beyne ulaşılan ameliyattır. Cerrahlar üç etkeni hataya katkıda bulunan etken olarak gördü: yorgunluk, olağandışı zaman baskısı ve acil ameliyat (Jhawar ve ark., 2007).

**Yanlış yer kraniyotomisi.** Kafatasının yanlış yerden açılmasına yanlış yer kraniyotomisi (*wrong-site craniotomy*) denir. Cohen ve arkadaşları tıbbi, hukuki ve medya kaynaklarından 35 olgu topladı. Bu bir sıklık değil, olguların derlemesidir. Yazarlar katkıda bulunan etkenleri dört grupta topladı (Cohen ve ark., 2010):

1. iletişim kopukluğu,
2. ameliyat öncesi denetimlerin yetersizliği,
3. teknik etkenler ve görüntüleme,
4. insan hatası.

Yazarlara göre olguların hemen hepsi, kapsamlı protokollere sıkı uyulsaydı önlenebilirdi (Cohen ve ark., 2010). Beynin kendine özgü işlevleri yüzünden, yanlış yer kraniyotomisinin sonuçları öteki yanlış yer ameliyatlarından farklıdır (Cohen ve ark., 2010).`,
    },
    {
      tur: 'sayilar',
      duzey: 'lisans',
      baslik: 'Beyin cerrahisinde yanlış yer: bir ankete göre',
      ogeler: [
        {
          deger: '2,0',
          birim: '/ 10.000',
          aciklama: 'kraniyotomide yanlış yer ameliyatı; payda, cerrahların bir önceki yıl yaptığını bildirdiği 10.203 kraniyotomidir',
        },
        {
          deger: '%25',
          aciklama:
            'kariyerinde en az bir kez başın yanlış tarafında kesi yaptığını söyleyen beyin cerrahı; payda, ankete yanıt veren 138 cerrahtır',
        },
      ],
      not: '2,0: Jhawar ve ark. (2007), yalnızca özeti okundu; sayı cerrahların kendi bildirimine dayanır. %25: aynı anketi aktaran Stahel ve ark. (2009).',
    },
    {
      tur: 'tablo',
      duzey: 'lisans',
      baslik: 'Ameliyatta yanlış yer: farklı kaynaklar, farklı sayılar',
      sutunlar: ['Kaynak', 'Ne sayıldı?', 'Bulgu'],
      satirlar: [
        [
          'DSÖ (2009), ABD tahmini',
          'Bütün ameliyatlarda yanlış yer ve yanlış hasta ameliyatı',
          '50.000–100.000 işlemde bir; yılda 1500–2500 olay',
        ],
        [
          'Jhawar ve ark. (2007), beyin cerrahları anketi',
          'Cerrahların kendi bildirdiği yanlış yer ameliyatı',
          'Bir önceki yılın 10.203 kraniyotomisinde: 10.000’de 2,0',
        ],
        [
          'Neily ve ark. (2018), ABD Gaziler sağlık sistemi, 2010–2017',
          'Ameliyathanede bildirilen yanlış işlem olayları (ramak kala olaylar hariç)',
          'Beyin cerrahisinde 10.000 olguda 1,53; bütün dallarda 10.000 işlemde 0,53',
        ],
        [
          'Cohen ve ark. (2021), Kaliforniya, 2007–2017',
          'Hastanelere verilen cezaların raporlarındaki cerrahi “asla olayları”',
          '142 olay, 200.000 ameliyatta bir; 22’si yanlış yer ya da hasta, bunların 2’si beyin cerrahisi',
        ],
        [
          'Vacheron ve ark. (2023), Fransa, 2007–2017',
          'Bir sigorta şirketine yapılan 219 tazminat başvurusu: yanlış taraf, organ, kişi ya da işlem',
          'Başvuruların %14’ü beyin cerrahisinden; %39’u yanlış taraf',
        ],
        [
          'Omar ve ark. (2021), aktaran Thaler ve ark. (2026); İngiltere, 2012–2020',
          'Bildirilen cerrahi “asla olayları”',
          '797 olayın 84’ü sağ-sol karışıklığı',
        ],
      ],
      not: 'Tanımlar farklıdır: yanlış yer, taraf ya da hasta. Veri kaynakları farklıdır: bildirim, ceza raporu, tazminat ya da anket. Paydalar da farklıdır: işlem, olgu, olay ya da başvuru. Bu yüzden sayılar birbiriyle karşılaştırılamaz. Neily ve Vacheron verilerinde beyin cerrahisindeki olayların çoğu omurga ameliyatlarındandır.',
    },

    // ——— Ameliyatta taraf hatası: uzman ———
    {
      tur: 'kutu',
      cesit: 'cerrahi',
      baslik: 'Yanlış yer kraniyotomisi: zincir nerede kopar?',
      md: `- **Hata bazen hastaneden bile önce başlar.** Yanlış yer ve yanlış hasta işlemlerinin yaklaşık %20–30’u hasta hastaneye yatmadan önce başlar. Örnek: yanlış taraf yazılmış bir not ya da yanlış etiketlenmiş bir görüntü (Stahel ve ark., 2009).
- **Onam formu.** Kwaan ve arkadaşları omurga dışındaki 13 yanlış yer ameliyatını inceledi. Onam formuna bakılabilen olguların %66’sında yer ya da taraf yazılmamıştı (DSÖ, 2009).
- **Hiyerarşi.** Ameliyathanedeki katı hiyerarşi, hatayı önleyebilecek kişilerin konuşmaktan çekinmesine yol açar (DSÖ, 2009).
- **Cerrahi duraklama.** Kök neden analizi, bir olayın altında yatan nedenleri arayan incelemedir. ABD Gaziler sağlık sisteminde 277 olayın kök neden analizi 507 neden buldu. Bunların %28,4’ü cerrahi duraklamayla ilgiliydi: duraklama yanlış ya da eksik yapılmıştı (Neily ve ark., 2018).
- **Görüntünün kendisi.** Çekimde yanlış girilen yön bilgisi görüntü başlığına yazılır ve bütün hastaneye yayılır (Christensen ve ark., 2006). Yön hatası, beynin yanlış tarafında ameliyata yol açabilir (Nishimaki ve ark., 2025).
- **Beynin içi deriden kolayca işaretlenemez.** Beyin gibi gizli ameliyat yerleri, ameliyattan önce dışarıdan kolayca bulunup işaretlenemez. Bu yüzden BT, MR ya da anjiyografi gibi ek görüntüler gerekebilir (Stahel ve ark., 2009). Stahel ve arkadaşlarına göre beynin yanlış bölümüne yapılan girişimler düzenli aralıklarla bildirilmektedir (Stahel ve ark., 2009).`,
    },

    // ——— Önleme: temel ———
    {
      tur: 'metin',
      md: `Bu hataları önlemenin yolları basittir ve dünyanın her yerinde kullanılır. DSÖ’nün **Güvenli Cerrahi Kontrol Listesi** bunların başında gelir. Kılavuzun ilk hedefi açıktır: ekip doğru hastayı doğru yerden ameliyat edecektir (DSÖ, 2009).

- **Ameliyat yeri işaretlenir.** Bu, özellikle sağ-sol ayrımı olan işlemlerde önemlidir (DSÖ, 2009). İşareti ameliyatı yapacak cerrah koyar (DSÖ, 2009).
- **İşaret bir ok, imza ya da baş harflerdir; çarpı değil.** İşaretin türü hastanede seçilebilir: imza, baş harfler ya da yeri gösteren bir ok (DSÖ, 2009). Çarpı (X) ise kullanılmamalıdır. Çünkü “burası ameliyat edilmeyecek” diye yanlış anlaşılmıştır (DSÖ, 2009).
- **Kesiden önce kısa bir duraklama yapılır.** Ekip burada hastayı, işlemi ve ameliyat yerini bir kez daha doğrular. Bu duraklamaya **cerrahi duraklama** denir; İngilizce adı *time-out*’tur (DSÖ, 2009).`,
    },
    {
      tur: 'kutu',
      cesit: 'dikkat',
      baslik: 'Ok çiz, çarpı koyma',
      md: `İngiltere’deki öneri, deriye ameliyat yerini gösteren bir ok çizmektir (DSÖ, 2009). Çarpı (X) ise “burası değil” diye anlaşılabilir (DSÖ, 2009). Karşı tarafa “hayır” ya da “bu taraf değil” yazmak da artık önerilmez. Karışıklık yaratır ve yanlış taraf riskini artırır (Stahel ve ark., 2009).

İşaret silinmeyen bir kalemle yapılır ve açıkça görünür (DSÖ, 2009). Silinebilen kalem riski artırır. Cerrah, işaretin cilt temizliği sırasında silindiğini sanabilir (Stahel ve ark., 2009). Ameliyat edilmeyecek yer ise hiç işaretlenmez (DSÖ, 2009).`,
    },
    {
      tur: 'kutu',
      cesit: 'aklinda-kalsin',
      md: `**Taraf hatası:** sağdaki bir bulgunun solda yazılması ya da ameliyatın yanlış tarafta yapılması.

**Neden olur?** Beyin neredeyse simetriktir. Karşındakinin sağını bulmak zihinsel döndürme ister. Kesinti, dikkat dağınıklığı, yorgunluk ve acele hatayı artırır.

**Nasıl önlenir?** Ameliyat yeri silinmez kalemle, ok, imza ya da baş harflerle işaretlenir; çarpı kullanılmaz. Kesiden önce ekip duraklar ve hastayı, işlemi, yeri yeniden doğrular. Görüntüde taraf, R ve L işaretinden okunur.`,
    },

    // ——— Önleme: lisans ———
    {
      tur: 'kutu',
      cesit: 'klinik',
      baslik: 'Kontrol listesinde taraf nerede doğrulanır?',
      md: `- **Giriş** (anesteziden önce): Ekip, ameliyat yerinin işaretli olduğunu ya da işaretlemenin gerekmediğini sözlü olarak doğrular (DSÖ, 2009). Listede “taraf”, sağ-sol ayrımı anlamına gelir (DSÖ, 2009).
- **Cerrahi duraklama** (*time-out*, kesiden hemen önce): Hasta, işlem ve ameliyat yeri doğrulanır (DSÖ, 2009). Doğru hastaya ait temel görüntülerin ameliyathanede gösterildiği de doğrulanır (DSÖ, 2009).
- **Onam formu:** Yapılacak işlem ve ameliyat yeri, taraf ya da seviye dahil, açıkça yazılmalıdır (DSÖ, 2009).

Doğrulama ve işaretleme birbirini tamamlar. İkisi de sisteme bilerek bir yedek güvence katar. Yalnızca birinin yanlış yer ameliyatını azaltması olası değildir (DSÖ, 2009).

ABD’de Joint Commission’ın **Evrensel Protokolü** 1 Temmuz 2004’te zorunlu bir kalite standardı oldu (Stahel ve ark., 2009). Protokol üç adımlıdır. Her adım doğru hastanın, yerin ve işlemin doğrulanmasına bir güvence daha ekler (DSÖ, 2009).`,
    },
    {
      tur: 'metin',
      duzey: 'lisans',
      md: `**Türkiye’den çalışmalar.** Türkiye’de tıbbi hataların yaklaşık %43,6’sının ameliyathanede olduğu bildirilir (Kisacik ve Cigerci, 2019). Afyonkarahisar’da bir devlet ve bir üniversite hastanesinin ameliyathanelerinde çalışan 102 hemşireyle bir çalışma yapıldı (Kisacik ve Cigerci, 2019). Bu hemşirelerin 73’ü (%71,6) ameliyathanede bir cerrahi hataya tanık olmuştu (Kisacik ve Cigerci, 2019).

Aşağıdaki yüzdelerin paydası bu 73 hemşiredir. Sayılar olay sayısı değil, o hatayı gördüğünü söyleyen hemşire sayısıdır. Hemşireler birden çok hata türü işaretleyebildi (Kisacik ve Cigerci, 2019).

- 66’sı (%90,4), cerrahın ameliyat yerini işaretlemediği bir duruma tanık olmuştu (Kisacik ve Cigerci, 2019).
- 18’i (%24,7) yanlış yer ameliyatına tanık olmuştu (Kisacik ve Cigerci, 2019).

Uğur ve arkadaşlarının bir üniversite hastanesindeki geriye dönük çalışması da bir öneri getirdi. Öğrenme programları ve kolaylaştırılmış hata bildirimi, ameliyathanede hasta güvenliğini artırabilir (Uğur ve ark., 2016, aktaran Parmar ve ark., 2026). Bu dersin taradığı açık erişimli kaynaklarda, Türkiye’den yanlış yer ya da yanlış taraf kraniyotomisinin sıklığını veren bir çalışma bulunamadı.`,
    },
    {
      tur: 'kutu',
      cesit: 'sinav-notu',
      md: `- **Rapordaki taraf hatası:** sağdaki bulgunun solda yazılması ya da tersi (Landau ve ark., 2015).
- Yanlış yer ameliyatı iki taraflı yapılarda daha olasıdır (DSÖ, 2009).
- **İşaret:** ameliyatı yapacak cerrah koyar; kalıcı kalem; ok, imza ya da baş harf; çarpı değil (DSÖ, 2009).
- **Cerrahi duraklama** (*time-out*): kesiden hemen önce hasta, işlem ve yer doğrulanır; doğru hastanın görüntüleri ameliyathanede gösterilir (DSÖ, 2009).
- **Yanlış yer kraniyotomisinde dört etken grubu:** iletişim kopukluğu, yetersiz ameliyat öncesi denetim, teknik etkenler ve görüntüleme, insan hatası (Cohen ve ark., 2010).`,
    },

    // ——— Önleme: uzman ———
    {
      tur: 'metin',
      duzey: 'ileri',
      md: `**Kontrol listesi işe yarıyor mu?** DSÖ listesi sekiz şehirde sekiz hastanede denendi. Listeden önce 3733, sonra 3955 hasta izlendi. Ölüm oranı %1,5’ten %0,8’e indi. Hastane içi komplikasyonlar %11,0’dan %7,0’a geriledi (DSÖ, 2009).

Fransa’da liste 2010’da zorunlu oldu. Bir sigorta şirketine yapılan tazminat başvuruları incelendi: yanlış taraf, organ, kişi ya da işlem için olanlar. Yıllık başvuru sayısı ortalama %20 azaldı. 2007–2009’da yılda ortalama 22,0 başvuru vardı. 2010–2017’de bu sayı yılda 17,5’e indi (Vacheron ve ark., 2023).

ABD Gaziler sisteminde ameliyathanede bildirilen en ağır yanlış işlem olaylarına bakıldı. Bunlar hastaya zarar veren olaylardı. Oranları 2000–2017 arasında 100.000 işlemde 1,74’ten 0,47’ye düştü (Neily ve ark., 2018).

Kalıcı kalemle işaretleme yeni bir fikir değildir. Kanada Ortopedi Derneği bunu 1994’te önermişti (DSÖ, 2009).

**Ama liste kendiliğinden işlemez.** Nepal’de beyin cerrahisine özel bir merkezde, 2020 ve 2023’te ardışık 50’şer hastanın dosyası incelendi. Bunlar kafa ve omurga ameliyatlarıydı (Shrestha ve Medhasi, 2026). 2023’te 16 acil ameliyatın 6’sında (%38) liste hiç doldurulmamıştı. 2020’de bu sayı 19 acil ameliyatta 4’tü (%21) (Shrestha ve Medhasi, 2026). Listelerin doluluğuna bakılınca, acil ameliyatlarda yer işaretleme yalnızca %20 oranında yapılmıştı. Seçmeli ameliyatlarda ise işaretleme 2020’deki %61’den 2023’te %92’ye çıktı (Shrestha ve Medhasi, 2026).

Vücut üzerindeki işaretlere ve kontrol listelerine karşın taraf hataları sürüyor (Thaler ve ark., 2026). İngiltere’nin kamu sağlık kurumlarında (NHS) 2011–2013 arasında 504 cerrahi “asla olayı” bildirildi. Bunların 135’i (%28) yanlış yer ameliyatıydı (Moppett ve Moppett, 2016, aktaran Parmar ve ark., 2026).`,
    },
    {
      tur: 'kutu',
      cesit: 'arastirma',
      baslik: 'Kaynaklar neden birbirini tutmuyor?',
      md: `**Hastanın cinsiyeti.** Sangwaiya ve arkadaşları rapordaki taraf hatalarını kadın hastalarda daha sık buldu: 58’e karşı 30 (Sangwaiya ve ark., 2009). Landau ve arkadaşlarının özetine göre ise erkek hastalarda anlamlı olarak daha çok hata yakalandı (Landau ve ark., 2015). Bulgu tutarsızdır; bir genelleme yapılamaz.

**Sıklık.** Yanlış yer ameliyatı için verilen sayılar birbirinden çok farklıdır. DSÖ, ABD’deki bütün ameliyatlar için 50.000–100.000 işlemde bir der (DSÖ, 2009). Neily ve arkadaşları önceki bir tahmini aktarır: medyan 10.000 olguda 0,09, aralık 0–3,9 (Neily ve ark., 2018). Medyan, değerler sıraya dizilince ortaya düşen değerdir. Kendi verilerinde ise bütün dallar birlikte, ameliyathanede bildirilen yanlış işlem olayları 10.000 işlemde 0,53’tür (Neily ve ark., 2018). Jhawar anketinde cerrahların bildirdiği oran 10.000 kraniyotomide 2,0’dır (Jhawar ve ark., 2007). Fark üç yerden gelir. Tanım farklıdır: yer, taraf ya da hasta. Veri kaynağı farklıdır: bildirim, tazminat ya da anket. Payda da farklıdır: işlem, olgu ya da kraniyotomi.

**Kaynak içindeki tutarsızlıklar.** Vacheron ve arkadaşlarının başlığı “10 yıl” der. Yöntem bölümü ise 1 Ocak 2007–31 Aralık 2017 aralığını, yani 11 yılı verir (Vacheron ve ark., 2023). Özel kuruluşların payı özette %19, bulgularda %21’dir (Vacheron ve ark., 2023).

**Doğrulanamayan.** Stahel ve arkadaşları Jhawar anketini belli bir ülkenin beyin cerrahlarına bağlar ve 138 cerrahın yanıt verdiğini yazar (Stahel ve ark., 2009). Jhawar’ın özetinde ise ülke ve yanıtlayan sayısı yazmaz (Jhawar ve ark., 2007). Ülke bilgisi bu ders için açık kaynaklarda doğrulanamadı; bu yüzden yazılmadı.`,
    },
    {
      tur: 'vaka',
      duzey: 'ileri',
      baslik: 'Vaka: İki ekran, iki taraf',
      oyku: `Sol alın lobunda tümörü olan 54 yaşında bir kadın ameliyata alınıyor. Onam formunda “sol frontal kraniyotomi” yazıyor. Cerrah, hasta uyanıkken alnının sol yanına silinmez kalemle bir ok ve baş harflerini çizmiş. Cerrahi duraklamada ameliyathanede iki ekran açık. Hastanenin görüntü sisteminde tümör ekranın sağ yanında görünüyor. Planlama için kullanılan araştırma yazılımında ise aynı tümör ekranın sol yanında. Genç bir hemşire bunu fark ediyor, ama söylemekte duraksıyor.`,
      soru: 'Ekip ne yapmalı? İki ekran gerçekten birbiriyle çelişiyor mu?',
      cozum: `**Önce dur ve sor.** Cerrahi duraklama tam da bunun içindir. Kesiden önce hasta, işlem ve ameliyat yeri bir kez daha doğrulanır (DSÖ, 2009). Doğru hastaya ait temel görüntülerin ameliyathanede gösterildiği de doğrulanır (DSÖ, 2009). Hemşirenin duraksaması bir uyarıdır. Ameliyathanedeki katı hiyerarşi, hatayı önleyebilecek kişilerin konuşmaktan çekinmesine yol açar (DSÖ, 2009).

**İki ekran çelişmeyebilir.** Radyologlar radyolojik gösterimle bakar: hastanın solu ekranın sağındadır (NiBabel, t.y.-c). Bazı araştırma kaynakları ise nörolojik gösterimi kullanır. Örneğin MNI beyin atlası “sol soldur, sağ sağdır” der (MNI, t.y.). Orada hastanın solu ekranın solundadır. Yani iki ekran da doğru olabilir. Karar, her ekrandaki R ve L işaretine bakılarak verilir.

**İşaret yoksa ya da tutmuyorsa?** FSL belgesi, yön etiketleri yanlış ya da eksikse hiçbir analiz yapılmamasını ister (FSL, t.y.). Sağ-solun çevrildiğinden kuşkulanılırsa özgün DICOM başlıkları denetlenir (Nishimaki ve ark., 2025). Çekimde yanlış girilen yön bilgisi başlığa yazılır ve bütün hastaneye yayılır (Christensen ve ark., 2006). Bu yüzden görüntü, onam formu ve deri üzerindeki işaret birbirini doğrulamalıdır.

Cohen ve arkadaşları 35 yanlış yer kraniyotomisinde dört etken grubu buldu. Bunlar iletişim kopukluğu, yetersiz ameliyat öncesi denetim, teknik etkenler ve görüntüleme, insan hatasıdır (Cohen ve ark., 2010). Bu vakada iletişim ve görüntüleme aynı anda sınanıyor. *Vaka eğitim için kurgulanmıştır.*`,
    },
  ],
};
