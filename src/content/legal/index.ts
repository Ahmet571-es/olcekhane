/**
 * Hukuki metinler. {{company.*}} yer tutucuları, şirket bilgileriyle (COMPANY_* ortam değişkenleri)
 * görüntüleme anında doldurulur. Metinler yayına alınmadan önce bir avukat tarafından gözden
 * geçirilmelidir. Bir metin değiştirildiğinde sürüm numarası artırılır; eski onaylar kendi
 * sürümlerine bağlı kalır (bkz. lib/instruments/sync.ts).
 *
 * Aydınlatma metni ve kullanım koşulları hızlı test modunu (hesaplar kapalı, hiçbir test cevabı
 * saklanmaz, sunucu Almanya'da) anlatır. Hesap bölümü açılmadan önce (ACCOUNTS_ENABLED) bu iki metnin
 * hesaplarda işlenen verileri de anlatan yeni sürümleri yayımlanmalıdır. Açık rıza metinleri ve öğrenci
 * bilgilendirmesi yalnızca hesap bölümünde kullanılır; hesaplar kapalıyken sitede yayında değildir.
 */

export type LegalKind =
  | 'privacy_notice'
  | 'consent_assessment'
  | 'consent_research'
  | 'child_info'
  | 'terms'
  | 'cookie_policy';

export interface LegalDocDef {
  kind: LegalKind;
  version: number;
  slug: string;
  title: string;
  /** Arama sonuçlarında görünen kısa açıklama. */
  summary: string;
  bodyMd: string;
  /** Yalnızca hesap bölümünde kullanılan metin: hesaplar kapalıyken sitede yayımlanmaz. */
  accountsOnly?: boolean;
}

const privacyNotice = `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun ("KVKK") 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, Ölçekhane’yi ziyaret eden ve kullanan kişiler için hazırlanmıştır.

Bu metin bilgilendirme amaçlıdır; sizden onay istemez.

## Kısaca

- Testler hesap açmadan çözülür. Sizden ya da çocuğunuzdan ad, e-posta, telefon ya da kimlik numarası istemiyoruz.
- Test cevapları yalnızca raporu hazırlamak için kullanılır; veritabanına, dosyaya ya da sunucu kayıtlarına yazılmaz.
- Raporun tek kopyası, ekranınızda gösterilen ve indirdiğiniz PDF dosyasıdır. Sayfayı kapattıktan sonra raporu size yeniden gösteremeyiz.
- Sitemizin sunucusu Almanya’dadır (Avrupa Birliği).
- Reklam, izleme ya da ziyaretçi istatistiği (analiz) aracı kullanmıyoruz.

## 1. Veri sorumlusu

{{company.legalName}}
Adres: {{company.address}}
MERSİS No: {{company.mersisNo}}
E-posta: {{company.kvkkEmail}}
KEP: {{company.kepAddress}}

## 2. Hızlı test: hesap açmadan test çözme

Teste başlarken seçtiğiniz sınıf düzeyi test sayfasının adresinde yer alır (bu yüzden tarayıcınızın geçmişinde de görünür). Cevaplarınız ve cevap süreleri (dikkat ve bellek görevlerinde görevdeki performansınız) test bittiğinde sınıf düzeyiyle birlikte tek seferde sunucumuza gönderilir. Sunucu puanları ve raporu hesaplayıp size geri gönderir. Raporu her PDF olarak indirişinizde aynı bilgiler yeniden gönderilir; PDF sunucunun belleğinde hazırlanıp doğrudan size iletilir.

Bu bilgiler:

- veritabanına, dosyaya ya da sunucu kayıtlarına (günlüklere) yazılmaz; işlem bitince sunucunun belleğinden de silinir,
- IP adresiniz ya da cihazınız dahil hiçbir kimlik bilgisiyle eşleştirilmez,
- kimseyle paylaşılmaz; reklam, pazarlama, profil çıkarma ya da yapay zekâ modellerinin eğitimi için kullanılmaz.

Kimliğinizi sormadığımız ve cevapları saklamadığımız için hızlı test cevapları ve raporlar, kimliği belirli ya da belirlenebilir bir kişiyle ilişkilendirilmez. Bu nedenle bu cevaplarla ilgili size gösterebileceğimiz, düzeltebileceğimiz ya da silebileceğimiz bir kayıt da bulunmaz.

Raporlar kişilik, duygular ya da beceriler hakkında bilgi içerebilir. İndirdiğiniz PDF dosyasını kimlerle paylaşacağınıza siz karar verirsiniz; dosyayı güvenli bir yerde saklamanızı öneririz.

## 3. Siteyi ziyaret ettiğinizde

Her internet sitesinde olduğu gibi tarayıcınız, sayfaları isterken IP adresinizi ve tarayıcı bilgilerinizi sunucumuza iletir.

- Ziyaretlerin kaydını tutmuyoruz: sunucumuzda erişim günlüğü kapalıdır; ziyaretçi istatistiği ya da analiz aracı kullanmıyoruz.
- Kötüye kullanımı önlemek için kısa sürede çok sayıda istek gönderen adresleri sınırlarız. Hızlı testte bunun için IP adresiniz yalnızca sunucunun belleğinde tutulur ve en geç 11 dakika içinde silinir. İletişim formu ile giriş ve şifre yenileme sayfalarında aynı amaçla tutulan sayaçlar veritabanındadır ve en geç 3 gün içinde silinir.
- Hızlı testte çerez kullanılmaz; cevaplarınız tarayıcınızda da saklanmaz. Çerezler yalnızca giriş yapıldığında, oturumu açık tutmak için kullanılır (bkz. Çerez Politikası).

## 4. İletişim formu

Formu gönderdiğinizde adınız soyadınız, e-posta adresiniz, isteğe bağlı olarak telefon numaranız ve kurumunuz, seçtiğiniz konu, mesajınız, gönderim tarihi ve IP adresiniz veritabanımıza kaydedilir. Şirket e-posta adresimize yalnızca yeni bir mesaj geldiğini bildiren, mesajın içeriğini ve sizin bilgilerinizi içermeyen bir e-posta gider. Bu bilgileri size dönüş yapmak, başvurunuzu (KVKK başvuruları dahil) sonuçlandırmak ve formun kötüye kullanılmasını önlemek için kullanırız. Size e-postayla yanıt verdiğimizde bu yazışma şirket e-posta hesabımızda kalır.

## 5. Giriş sayfası

Veli, okul ve öğrenci hesapları şu an kapalıdır; giriş sayfası yalnızca platformu yöneten yetkililer içindir. Giriş sayfasında yapılan denemeler (yazılan e-posta adresi, IP adresi, tarih ve denemenin sonucu), hesapları izinsiz girişlere karşı korumak için kaydedilir. Giriş yapan yetkililerin oturumları IP adresi ve tarayıcı bilgisiyle, yaptıkları işlemler de denetim kaydına yazılır.

## 6. Hangi amaçlarla ve hangi hukuki sebeplerle işliyoruz?

| Amaç | Hukuki sebep |
|---|---|
| İletişim formundan gelen sorulara ve başvurulara dönüş yapmak | Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK m.5/2-c) ve veri sorumlusunun meşru menfaati (KVKK m.5/2-f) |
| KVKK kapsamındaki başvuruları sonuçlandırmak | Hukuki yükümlülüğün yerine getirilmesi (KVKK m.5/2-ç) |
| Bilgi güvenliği ve kötüye kullanımın önlenmesi (IP adresi, giriş denemeleri) | Veri sorumlusunun meşru menfaati (KVKK m.5/2-f) |
| Mevzuattan doğan yükümlülükler ve yetkili kurumların talepleri | Kanunlarda açıkça öngörülme ve hukuki yükümlülük (KVKK m.5/2-a ve m.5/2-ç) |

## 7. Verileri nasıl topluyoruz?

Veriler; sitedeki test ekranları, iletişim formu ve giriş sayfası ile tarayıcınızın her istekte gönderdiği bağlantı bilgileri aracılığıyla, elektronik ortamda ve otomatik yollarla toplanır.

## 8. Verileri kimlere aktarıyoruz?

- **Barındırma hizmeti (yurt dışı):** Sitemizin sunucusu, barındırma hizmeti aldığımız Hostinger’ın Almanya’daki (Avrupa Birliği) veri merkezinde bulunur. Siteye gönderdiğiniz bilgiler (iletişim formu mesajları, giriş denemeleri, bağlantı bilgileri ve kaydedilmeden işlenen hızlı test cevapları) bu sunucuda işlendiği için yurt dışına aktarılmış olur. Sunucuyu biz yönetiriz; veritabanı ve yedekleri sunucuda şifrelenmiş bir alanda tutulur. Barındırma sağlayıcısının sunucunun tamamından aldığı yedeklerde bu veriler yalnızca şifreli hâlleriyle bulunur.
- **E-posta hizmeti:** İletişim formuna yeni mesaj geldiğini (içeriği olmadan) şirket e-posta adresimize bildirmek, size yanıt vermek ve yetkililere hesap güvenliğiyle ilgili e-postalar göndermek için e-posta hizmeti sağlayıcımızı kullanırız.
- **Yetkili kamu kurum ve kuruluşları:** yalnızca hukuken zorunlu olduğunda.

Kişisel verileri satmıyor, reklam ya da pazarlama amacıyla kimseyle paylaşmıyoruz.

## 9. Ne kadar süre saklıyoruz?

- Hızlı test cevapları ve raporlar: saklanmaz.
- Hızlı testte IP adresi (hız sınırı): yalnızca sunucunun belleğinde, en geç 11 dakika.
- İletişim formu, giriş ve şifre yenileme sayfalarındaki hız sınırı sayaçları (IP adresi ya da yazılan e-posta adresiyle): en geç 3 gün.
- İletişim formu mesajları: 1 yıl.
- E-posta gönderim kayıtları (alıcı ve konu): 90 gün. Gönderilemeyen e-postaların içeriği (ör. şifre yenileme bağlantısı): en fazla 30 gün.
- Giriş denemeleri: 1 yıl.
- Yetkililerin oturum kayıtları (IP adresi ve tarayıcı bilgisiyle): çıkış yapılınca ya da en geç 31 gün içinde silinir.
- Şifre yenileme bağlantıları (e-posta adresiyle): en geç 31 gün.
- Denetim kayıtları (IP adresiyle): 2 yıl.
- Kendi aldığımız şifreli veritabanı yedekleri: en fazla 28 gün; silinen bir kayıt bu yedeklerden de bu süre içinde çıkar. Yedekleme aksarsa, yenisi alınana kadar son yedek korunur. Barındırma sağlayıcısının sunucu yedekleri, sağlayıcının saklama süresine tabidir ve verileri yalnızca şifreli olarak içerir.

Süresi dolan kayıtlar her gün çalışan otomatik bir görevle silinir.

## 10. Haklarınız

KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK’nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini ve bu işlemlerin aktarıldığı kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.

Başvurularınızı {{company.kvkkEmail}} adresine e-posta ile, {{company.kepAddress}} adresine KEP ile, {{company.address}} adresine yazılı olarak ya da sitedeki iletişim formundan "Kişisel veriler (KVKK) başvurusu" konusunu seçerek iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.

Hızlı test cevaplarını ve raporları saklamadığımız için bunlarla ilgili bir başvuruda size gösterebileceğimiz bir kayıt bulunmaz.

## 11. Hesaplar ve ücretli rapor

Veli, okul ve öğrenci hesapları ile ücretli kapsamlı rapor henüz kullanıma açık değildir. Açıldıklarında, orada işlenecek veriler (ör. hesap bilgileri, ödeme ve fatura kayıtları) ve saklama süreleri bu metnin yeni bir sürümünde açıklanacak; yeni sürüm, uygulanmaya başlamadan önce bu sayfada yayımlanacaktır.`;

const consentAssessment = `Bu metin, çocuğunuzun Ölçekhane’de test çözebilmesi için gereken açık rızanıza ilişkindir. Rıza vermek zorunda değilsiniz; ancak rıza verilmeden çocuğunuz test çözemez, çünkü testlerin tek amacı bu verileri işleyerek size rapor sunmaktır.

**Neye rıza veriyorsunuz?**

Velisi olduğum çocuğumun Ölçekhane’deki testlere verdiği cevapların, cevap sürelerinin ve görev performansının; bunlardan hesaplanan puanların ve raporların, psikolojik ölçme sonuçlarının özel nitelikli kişisel veri (sağlık verisi) niteliği taşıyabileceğini bilerek,

- çocuğumun güçlü yanlarını ve gelişim alanlarını anlamak,
- bana, çocuğuma ve (okul hesabı kullanılıyorsa) okulundaki rehber öğretmene rapor sunmak,
- çocuğumun zaman içindeki gelişimini karşılaştırabilmek

amaçlarıyla işlenmesine açık rıza veriyorum.

**Bilmeniz gerekenler**

- Testler tanı koymaz. Sonuçlar tıbbi ya da psikolojik bir teşhis değildir.
- Veriler yalnızca yukarıdaki amaçlarla işlenir; reklam, pazarlama ya da yapay zekâ modeli eğitimi için kullanılmaz.
- Rızanızı veli panelinden dilediğiniz zaman geri alabilirsiniz. Geri aldığınızda çocuğunuz yeni test çözemez ve mevcut ölçme verileri en geç 30 gün içinde silinir.
- Ayrıntılı bilgi için Aydınlatma Metni’ni okuyabilirsiniz.`;

const consentResearch = `Bu rıza isteğe bağlıdır. Vermemeniz, hizmetten yararlanmanızı hiçbir şekilde etkilemez.

**Neden istiyoruz?**

Bilimsel bir testin sonucunu doğru yorumlayabilmek için, o testin Türkiye’deki öğrencilerle yapılmış çalışmalardan elde edilen normlara ve geçerlik kanıtlarına ihtiyaç vardır. Platformdaki testlerin çoğu için bu çalışmalar henüz yapılmamıştır ve bunları sizin katkınızla oluşturuyoruz.

**Neye rıza veriyorsunuz?**

Çocuğumun test cevaplarının ve puanlarının; adı, soyadı ve diğer kimlik bilgilerinden ayrılarak kimliğiyle ilişkilendirilemeyecek biçimde anonimleştirildikten sonra, testlerin Türkiye normlarının oluşturulması, geçerlik ve güvenirlik çalışmalarının yapılması ve bu çalışmaların bilimsel olarak yayımlanması amacıyla kullanılmasına açık rıza veriyorum.

- Yayımlanan hiçbir sonuç çocuğunuzu tanımlayacak bilgi içermez; sonuçlar yalnızca grup düzeyinde (ör. "7. sınıf öğrencilerinin ortalaması") raporlanır.
- Rızanızı dilediğiniz zaman geri alabilirsiniz. Geri almanızdan sonra çocuğunuzun verileri yeni çalışmalara dahil edilmez.`;

const childInfo = `Merhaba!

Burada çözeceğin testler seni daha iyi tanımana yardım etmek için hazırlandı.

- **Bu bir sınav değil.** Not almayacaksın, doğru ya da yanlış cevap yok. (Okuma görevindeki sorular hariç; orada ne kadar anladığını görmek istiyoruz.)
- **Cevaplarını kimler görecek?** Ailen görebilir. Testi okulundan çözüyorsan okulundaki rehber öğretmenin de görebilir. Sınıf arkadaşların ve öğretmenlerin senin cevaplarını göremez.
- **İstediğin an durabilirsin.** Yorulursan ara verebilir, sonra kaldığın yerden devam edebilirsin. Test çözmek istemiyorsan bunu ailene söyleyebilirsin.
- **Anlamadığın bir şey olursa** bir büyüğüne sorabilirsin. Ama cevabı sen seç, çünkü sonuç seni anlatacak.

Hazırsan başlayabilirsin.`;

const terms = `Bu kullanım koşulları, Ölçekhane’yi ("Platform") kullanan herkes için geçerlidir. Platformu kullanarak bu koşulları kabul etmiş olursunuz.

## 1. Hizmetin niteliği

Platform, öğrencilerin kişilik, ilgi, öğrenme ve bilişsel beceriler gibi alanlarda bilimsel ölçme araçlarını çevrim içi olarak doldurmasını ve sonuçların öğrenci ve veli için sade bir dille raporlanmasını sağlar.

**Platform tanı koymaz.** Raporlar tıbbi, psikiyatrik ya da psikolojik bir teşhis, tedavi veya klinik değerlendirme değildir ve bunların yerine geçmez. Çocuğunuzun ruh sağlığı ya da gelişimiyle ilgili bir endişeniz varsa bir uzmana başvurun.

Bazı testler "pilot" olarak işaretlenmiştir. Bu testlerin Türkiye normları ve geçerlik çalışmaları henüz yapılmamıştır; raporlarında bu durum açıkça belirtilir.

## 2. Hızlı test

- Testler hesap açmadan ve ücretsiz çözülür. Cevaplar yalnızca raporu hazırlamak için kullanılır ve saklanmaz (ayrıntılar KVKK Aydınlatma Metni’nde).
- Rapor ekranda gösterilir ve PDF olarak indirilebilir. Raporu saklamak size aittir: sayfa kapatıldıktan sonra rapor yeniden üretilemez ve Platform’dan istenemez.
- 18 yaşından küçükler testleri velilerinin bilgisiyle çözmelidir. Test bir çocuk için çözülüyorsa bir yetişkinin yanında çözülmesini öneririz.

## 3. Hesaplar

Veli, okul ve öğrenci hesapları şu an kapalıdır. Açıldığında şu kurallar geçerli olur:

- Veli hesabını yalnızca 18 yaşını doldurmuş kişiler açabilir.
- Bir öğrenci için profil oluşturan kişi, o öğrencinin velisi ya da yasal temsilcisi olduğunu beyan eder.
- Hesap bilgilerinizin gizliliğinden siz sorumlusunuz. Hesabınızın izinsiz kullanıldığını düşünüyorsanız bize hemen bildirin.

## 4. Kullanım kuralları

- Platformdaki test maddeleri, metinler ve raporlar telif hakkıyla ya da lisansla korunur. Kopyalanamaz, yayımlanamaz, başka bir yerde test olarak kullanılamaz.
- Testler, bir başkası adına ya da sonucu yanıltmak amacıyla çözülmemelidir.
- Platformun güvenliğini tehdit edecek girişimlerde bulunulamaz.

## 5. Sorumluluk

Raporlar, öğrencinin kendi cevaplarına ve görevlerdeki performansına dayanır; bu nedenle cevapların içtenliğinden ve uygulama koşullarından etkilenir. Raporlar, eğitim ve kariyer kararlarında tek başına dayanak olarak kullanılmamalıdır.

## 6. Değişiklikler

Bu koşullar güncellenebilir. Güncel metin her zaman bu sayfada yayımlanır. Hesap bölümü açıldığında, önemli değişiklikler hesabı olan kullanıcılara ayrıca e-postayla bildirilir.

## 7. Uygulanacak hukuk

Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Tüketici işlemlerinden doğan uyuşmazlıklarda, parasal sınırlar içinde tüketici hakem heyetleri, aşan durumlarda tüketici mahkemeleri yetkilidir.

## 8. İletişim

{{company.legalName}} · {{company.address}} · {{company.email}}`;

const cookiePolicy = `Ölçekhane yalnızca platformun çalışması için zorunlu olan çerezleri kullanır. Hızlı test çözerken hiçbir çerez kullanılmaz ve cevaplarınız tarayıcınızda da saklanmaz; aşağıdaki çerezler yalnızca giriş yapıldığında ayarlanır.

| Çerez | Amaç | Süre |
|---|---|---|
| olc_oturum | Giriş yaptığınızda oturumunuzu açık tutar. | Veli ve personel için 30 gün, öğrenci için 8 saat ya da çıkış yapana kadar |
| olc_iki_asama | İki aşamalı doğrulama açıksa, şifrenizi girdikten sonra kodu girene kadar girişinizi bekletir. | En fazla 10 dakika |
| olc_var | Sitenin herkese açık sayfalarında "Giriş" yerine "Panelim" bağlantısını göstermek için giriş yaptığınızı belirtir; kişisel bilgi içermez. | 30 gün ya da çıkış yapana kadar |

Reklam, izleme ya da üçüncü taraf analiz çerezi kullanmıyoruz. Bu nedenle çerez onay penceresi göstermiyoruz. İleride zorunlu olmayan bir çerez eklenirse, kullanılmadan önce onayınız istenecektir.`;

export const LEGAL_DOCS: LegalDocDef[] = [
  {
    kind: 'privacy_notice',
    version: 2,
    slug: 'aydinlatma-metni',
    title: 'KVKK Aydınlatma Metni',
    summary: 'Ölçekhane’de hangi kişisel verilerin, hangi amaçla ve ne kadar süre işlendiği. Hızlı testte cevaplar saklanmaz; sunucu Almanya’dadır.',
    bodyMd: privacyNotice,
  },
  {
    kind: 'consent_assessment',
    version: 1,
    slug: 'acik-riza-olcme',
    title: 'Açık Rıza Metni: Ölçme Verilerinin İşlenmesi',
    summary: 'Öğrencinin test cevaplarının ve sonuçlarının işlenmesi için velinin verdiği açık rızanın metni.',
    bodyMd: consentAssessment,
    accountsOnly: true,
  },
  {
    kind: 'consent_research',
    version: 1,
    slug: 'acik-riza-arastirma',
    title: 'Açık Rıza Metni: Norm ve Geçerlik Çalışmaları (İsteğe Bağlı)',
    summary: 'Kimlik bilgilerinden arındırılmış test verilerinin Türkiye normları ve geçerlik çalışmalarında kullanılmasına ilişkin isteğe bağlı açık rıza metni.',
    bodyMd: consentResearch,
    accountsOnly: true,
  },
  {
    kind: 'child_info',
    version: 1,
    slug: 'ogrenci-bilgilendirme',
    title: 'Öğrenci için bilgilendirme',
    summary: 'Teste başlamadan önce öğrenciye kendi yaşına uygun bir dille yapılan bilgilendirme.',
    bodyMd: childInfo,
    accountsOnly: true,
  },
  {
    kind: 'terms',
    version: 2,
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    summary: 'Ölçekhane hizmetlerinin kullanım koşulları.',
    bodyMd: terms,
  },
  {
    kind: 'cookie_policy',
    version: 1,
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    summary: 'Ölçekhane’de kullanılan çerezler ve amaçları. Reklam ya da izleme çerezi kullanılmaz.',
    bodyMd: cookiePolicy,
  },
];

export function legalDocBySlug(slug: string): LegalDocDef | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
