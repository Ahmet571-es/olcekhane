/**
 * Hukuki metinler. {{owner.*}} yer tutucuları, site sahibinin bilgileriyle (OWNER_* ortam değişkenleri,
 * bkz. lib/site.ts) görüntüleme anında doldurulur; boş kalabilen alanları (KEP, vergi) anan satırlar bu
 * alanlar boşken gösterilmez. Metinler yayına alınmadan önce bir avukat tarafından gözden geçirilmelidir.
 * Bir metin değiştirildiğinde sürüm numarası artırılır.
 *
 * Metinler sitenin gerçek işleyişini anlatır: siteyi bir kişi bireysel olarak işletir; veritabanı, hesap,
 * iletişim formu ve çerez yoktur; test cevapları ve raporlar saklanmaz; sunucu Almanya'dadır (Hostinger).
 * İşleyiş değişirse (ör. ücretli rapor ve ödeme) metinler, değişiklik yayına alınmadan önce güncellenmelidir.
 */

export type LegalKind = 'privacy_notice' | 'terms' | 'cookie_policy';

export interface LegalDocDef {
  kind: LegalKind;
  version: number;
  slug: string;
  title: string;
  /** Arama sonuçlarında görünen kısa açıklama. */
  summary: string;
  bodyMd: string;
}

const privacyNotice = `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun ("KVKK") 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, Ölçekhane’yi ziyaret eden ve kullanan kişiler için hazırlanmıştır.

Bu metin bilgilendirme amaçlıdır; sizden onay istemez.

## Kısaca

- Sitemizde hesap, üyelik, iletişim formu ve veritabanı yoktur.
- Testleri çözerken sizden ya da çocuğunuzdan ad, e-posta, telefon ya da kimlik numarası istemiyoruz.
- Test cevapları yalnızca raporu hazırlamak için sunucumuza gönderilir; veritabanına, dosyaya ya da sunucu kayıtlarına yazılmaz ve işlem bitince sunucunun belleğinden silinir.
- Raporun tek kopyası, ekranınızda gösterilen ve indirdiğiniz PDF dosyasıdır. Sayfayı kapattıktan sonra raporu size yeniden gösteremeyiz.
- Sitemizin sunucusu Almanya’dadır (Avrupa Birliği).
- Çerez, reklam, izleme ya da ziyaretçi istatistiği (analiz) aracı kullanmıyoruz.
- Bize e-posta gönderirseniz e-postanızı yalnızca size yanıt vermek için kullanırız.

## 1. Veri sorumlusu

Ölçekhane’yi bir kişi bireysel olarak işletir; KVKK kapsamında veri sorumlusu sitenin sahibidir:

- Adı ve soyadı: {{owner.name}}
- Adres: {{owner.address}}
- E-posta: {{owner.kvkkEmail}}
- Telefon: {{owner.phone}}
- KEP adresi: {{owner.kepAddress}}

## 2. Test çözerken

Teste başlarken seçtiğiniz sınıf düzeyi test sayfasının adresinde yer alır (bu yüzden tarayıcınızın geçmişinde de görünür). Cevaplarınız ve cevap süreleri (dikkat ve bellek görevlerinde görevdeki performansınız) test bitene kadar yalnızca açık olan sayfada, cihazınızın belleğinde durur. Test bittiğinde sınıf düzeyiyle birlikte tek seferde sunucumuza gönderilir. Sunucu puanları ve raporu hesaplayıp size geri gönderir. Raporu her PDF olarak indirişinizde aynı bilgiler yeniden gönderilir; PDF sunucunun belleğinde hazırlanıp doğrudan size iletilir.

Bu bilgiler:

- veritabanına, dosyaya ya da sunucu kayıtlarına (günlüklere) yazılmaz; işlem bitince sunucunun belleğinden de silinir,
- IP adresiniz ya da cihazınız dahil hiçbir kimlik bilgisiyle eşleştirilmez,
- kimseyle paylaşılmaz; reklam, pazarlama, profil çıkarma ya da yapay zekâ modellerinin eğitimi için kullanılmaz.

Kimliğinizi sormadığımız ve cevapları saklamadığımız için test cevapları ve raporlarla ilgili size gösterebileceğimiz, düzeltebileceğimiz ya da silebileceğimiz bir kayıt bulunmaz.

Raporlar kişilik, duygular ya da beceriler hakkında bilgi içerebilir. İndirdiğiniz PDF dosyasını kimlerle paylaşacağınıza siz karar verirsiniz; dosyayı güvenli bir yerde saklamanızı öneririz.

## 3. Siteyi ziyaret ettiğinizde

Her internet sitesinde olduğu gibi tarayıcınız, sayfaları isterken IP adresinizi ve tarayıcı bilgilerinizi sunucumuza iletir.

- Ziyaretlerin kaydını tutmuyoruz: sunucumuzda erişim günlüğü kapalıdır; ziyaretçi istatistiği ya da analiz aracı kullanmıyoruz.
- Kötüye kullanımı önlemek için kısa sürede çok sayıda rapor isteği gönderen adresleri sınırlarız. Bunun için IP adresiniz yalnızca sunucunun belleğinde tutulur ve en geç 11 dakika içinde silinir.
- Çerez kullanmıyoruz; tarayıcınızın yerel depolama alanlarına da bir şey yazmıyoruz (bkz. Çerez Politikası).

## 4. Bize e-posta gönderdiğinizde

Sitemizde iletişim formu yoktur. Bize e-posta gönderirseniz e-posta adresiniz, e-postada yer verdiğiniz adınız ve diğer bilgiler, mesajınız ve gönderim tarihi e-posta kutumuzda bulunur. Bu bilgileri yalnızca size yanıt vermek ve başvurunuzu (KVKK başvuruları dahil) sonuçlandırmak için kullanırız. Lütfen e-postanıza test cevaplarını, raporun PDF’ini ya da sağlıkla ilgili ayrıntıları eklemeyin.

## 5. Hangi amaçlarla ve hangi hukuki sebeplerle işliyoruz?

| Amaç | Hukuki sebep |
|---|---|
| Test cevaplarını, kaydetmeden, raporu hazırlamak için işlemek | Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK m.5/2-c) |
| E-postayla gelen sorulara ve başvurulara yanıt vermek | Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK m.5/2-c) ve veri sorumlusunun meşru menfaati (KVKK m.5/2-f) |
| KVKK kapsamındaki başvuruları sonuçlandırmak | Hukuki yükümlülüğün yerine getirilmesi (KVKK m.5/2-ç) |
| Bilgi güvenliği ve kötüye kullanımın önlenmesi (bellekte tutulan IP adresiyle hız sınırı) | Veri sorumlusunun meşru menfaati (KVKK m.5/2-f) |
| Mevzuattan doğan yükümlülükler ve yetkili kurumların talepleri | Kanunlarda açıkça öngörülme ve hukuki yükümlülük (KVKK m.5/2-a ve m.5/2-ç) |

## 6. Verileri nasıl topluyoruz?

Veriler; sitedeki test ekranları ve tarayıcınızın her istekte gönderdiği bağlantı bilgileri aracılığıyla elektronik ortamda ve otomatik yollarla, bize gönderdiğiniz e-postalar aracılığıyla da elektronik ortamda toplanır.

## 7. Verileri kimlere aktarıyoruz?

- **Barındırma hizmeti (yurt dışı):** Sitemizin sunucusu, barındırma hizmeti aldığımız Hostinger’ın (Hostinger International Limited) Almanya’daki (Avrupa Birliği) veri merkezinde bulunur. Siteye gönderdiğiniz bilgiler (kaydedilmeden işlenen test cevapları ve bağlantı bilgileri) bu sunucuda işlendiği için yurt dışına aktarılmış olur. Sunucuyu biz yönetiriz; sunucuda veritabanı yoktur ve bu bilgiler sunucuya kaydedilmez. Barındırma sağlayıcısı, kendi ağının güvenliği için bağlantı bilgilerini işleyebilir.
- **E-posta hizmeti:** Bize gönderdiğiniz e-postalar, e-posta hizmeti aldığımız sağlayıcının sunucularında bulunur.
- **Yetkili kamu kurum ve kuruluşları:** yalnızca hukuken zorunlu olduğunda.

Kişisel verileri satmıyor, reklam ya da pazarlama amacıyla kimseyle paylaşmıyoruz.

## 8. Ne kadar süre saklıyoruz?

- Test cevapları ve raporlar: saklanmaz; işlem bitince sunucunun belleğinden silinir.
- IP adresi (hız sınırı): yalnızca sunucunun belleğinde, en geç 11 dakika.
- Bize gönderdiğiniz e-postalar: yazışma bittikten sonra en geç 1 yıl.

## 9. Haklarınız

KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK’nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini ve bu işlemlerin aktarıldığı kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.

Başvurunuzu şu yollardan biriyle iletebilirsiniz:

- E-postayla: {{owner.kvkkEmail}}
- KEP ile: {{owner.kepAddress}}
- Yazılı olarak (posta ya da elden): {{owner.address}}

Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. Başvurunuzun sonucunu yeterli bulmazsanız Kişisel Verileri Koruma Kurulu’na şikâyette bulunabilirsiniz.

Test cevaplarını ve raporları saklamadığımız için bunlarla ilgili bir başvuruda size gösterebileceğimiz bir kayıt bulunmaz.

## 10. Ücretli rapor

Ücretli kapsamlı rapor henüz sunulmamaktadır. Sunulduğunda, ödeme için işlenecek bilgiler (ör. fatura bilgileri) ve saklama süreleri bu metnin yeni bir sürümünde açıklanacak; yeni sürüm, uygulanmaya başlamadan önce bu sayfada yayımlanacaktır.`;

const terms = `Bu kullanım koşulları, Ölçekhane’yi ("Platform") kullanan herkes için geçerlidir. Platformu kullanarak bu koşulları kabul etmiş olursunuz.

## 1. Hizmetin niteliği

Platform, öğrencilerin kişilik, ilgi, öğrenme ve bilişsel beceriler gibi alanlarda bilimsel ölçme araçlarını çevrim içi olarak doldurmasını ve sonuçların öğrenci ve veli için sade bir dille raporlanmasını sağlar.

**Platform tanı koymaz.** Raporlar tıbbi, psikiyatrik ya da psikolojik bir teşhis, tedavi veya klinik değerlendirme değildir ve bunların yerine geçmez. Çocuğunuzun ruh sağlığı ya da gelişimiyle ilgili bir endişeniz varsa bir uzmana başvurun.

Testlerin Türkiye normları yoktur; sonuçlar bir norm grubuyla karşılaştırılmadan yorumlanır. "Pilot" olarak işaretlenen testler Ölçekhane tarafından geliştirilmiştir; güvenirlik ve geçerlik çalışmaları henüz yapılmamıştır. Her testin durumu test sayfasındaki bilim kartında ve raporunda açıkça belirtilir.

## 2. Testler ve raporlar

- Testler hesap açmadan ve ücretsiz çözülür. Cevaplar yalnızca raporu hazırlamak için kullanılır ve saklanmaz (ayrıntılar KVKK Aydınlatma Metni’nde).
- Rapor ekranda gösterilir ve PDF olarak indirilebilir. Raporu saklamak size aittir: sayfa kapatıldıktan sonra rapor yeniden üretilemez ve Platform’dan istenemez.
- 18 yaşından küçükler testleri velilerinin bilgisiyle çözmelidir. Test bir çocuk için çözülüyorsa bir yetişkinin yanında çözülmesini öneririz.

## 3. Kullanım kuralları

- Platformdaki test maddeleri, metinler ve raporlar telif hakkıyla ya da lisansla korunur. Kopyalanamaz, yayımlanamaz, başka bir yerde test olarak kullanılamaz.
- Testler, bir başkası adına ya da sonucu yanıltmak amacıyla çözülmemelidir.
- Platformun güvenliğini tehdit edecek ya da çalışmasını aksatacak girişimlerde bulunulamaz.

## 4. Sorumluluk

Raporlar, öğrencinin kendi cevaplarına ve görevlerdeki performansına dayanır; bu nedenle cevapların içtenliğinden ve uygulama koşullarından etkilenir. Raporlar, eğitim ve kariyer kararlarında tek başına dayanak olarak kullanılmamalıdır.

## 5. Ücretli hizmetler

Kapsamlı rapor gibi ücretli hizmetler henüz sunulmamaktadır. Sunulduğunda fiyat, içerik, teslim ve cayma hakkına ilişkin koşullar satın almadan önce açıkça gösterilir.

## 6. Değişiklikler

Bu koşullar güncellenebilir. Güncel metin her zaman bu sayfada yayımlanır.

## 7. Uygulanacak hukuk

Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Tüketici işlemlerinden doğan uyuşmazlıklarda, parasal sınırlar içinde tüketici hakem heyetleri, aşan durumlarda tüketici mahkemeleri yetkilidir.

## 8. İletişim

Platformu bir kişi bireysel olarak işletir:

- Adı ve soyadı: {{owner.name}}
- Adres: {{owner.address}}
- E-posta: {{owner.email}}
- Telefon: {{owner.phone}}

İletişim bilgilerinin tamamı [İletişim](/iletisim) sayfasındadır.`;

const cookiePolicy = `Ölçekhane çerez kullanmaz.

Siteyi gezerken, test çözerken ya da raporunuzu görüntülerken tarayıcınıza hiçbir çerez yerleştirilmez. Tarayıcınızın yerel depolama alanları (ör. localStorage) da kullanılmaz: test cevaplarınız yalnızca açık olan sayfanın belleğinde durur ve sayfayı kapattığınızda silinir.

Sitede başka sitelerden yüklenen yazı tipi, komut dosyası, reklam ya da ziyaretçi istatistiği (analiz) aracı yoktur; bu yüzden başka şirketlerin çerezleri de kullanılmaz. Çerez kullanmadığımız için çerez onay penceresi göstermiyoruz.

İleride bir çerez kullanmamız gerekirse bu politika, çerez kullanılmaya başlanmadan önce güncellenir; zorunlu olmayan çerezler için önce onayınız istenir.`;

export const LEGAL_DOCS: LegalDocDef[] = [
  {
    kind: 'privacy_notice',
    version: 4,
    slug: 'aydinlatma-metni',
    title: 'KVKK Aydınlatma Metni',
    summary: 'Ölçekhane’de hangi kişisel verilerin, hangi amaçla ve ne kadar süre işlendiği. Test cevapları ve raporlar saklanmaz; sunucu Almanya’dadır.',
    bodyMd: privacyNotice,
  },
  {
    kind: 'terms',
    version: 4,
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    summary: 'Ölçekhane’nin kullanım koşulları: testlerin niteliği, raporlar ve kullanım kuralları.',
    bodyMd: terms,
  },
  {
    kind: 'cookie_policy',
    version: 2,
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    summary: 'Ölçekhane çerez kullanmaz; reklam, izleme ya da analiz aracı da yoktur.',
    bodyMd: cookiePolicy,
  },
];

export function legalDocBySlug(slug: string): LegalDocDef | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
