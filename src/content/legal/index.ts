/**
 * Hukuki metinler (sürüm 1). {{company.*}} yer tutucuları, yönetim panelindeki şirket bilgileriyle
 * görüntüleme anında doldurulur. Metinler yayına alınmadan önce bir avukat tarafından gözden
 * geçirilmelidir. Bir metin değiştirildiğinde yeni sürüm olarak eklenir; eski onaylar kendi
 * sürümlerine bağlı kalır.
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
  bodyMd: string;
}

const privacyNotice = `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun ("KVKK") 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, Ölçekhane platformunu kullanan veliler, öğretmenler ve öğrenciler için hazırlanmıştır.

Bu metin bilgilendirme amaçlıdır; sizden onay istemez. Çocuğunuzun test verilerinin işlenmesi için gereken açık rıza, ayrı bir metinle ve ayrı bir beyanla alınır.

## 1. Veri sorumlusu

{{company.legalName}}
Adres: {{company.address}}
MERSİS No: {{company.mersisNo}}
E-posta: {{company.kvkkEmail}}
KEP: {{company.kepAddress}}

## 2. Hangi verileri işliyoruz?

**Veli ve okul personeli hesapları için**
- Kimlik ve iletişim: ad soyad, e-posta adresi, isteğe bağlı telefon numarası
- Hesap ve işlem bilgileri: şifrenin geri döndürülemez özeti, oluşturulan öğrenci profilleri, atanan testler, onay kayıtları
- İşlem güvenliği: oturum kayıtları, IP adresi, tarayıcı bilgisi, önemli işlemlere ait denetim kayıtları

**Öğrenciler için**
- Kimlik: ad, isteğe bağlı soyadı, sınıf düzeyi, isteğe bağlı doğum yılı ve cinsiyet
- Ölçme verileri: testlerdeki cevaplar, cevap süreleri, görevlerdeki performans kayıtları, bunlardan hesaplanan puanlar ve raporlar

Öğrencilerin e-posta adresini ya da T.C. kimlik numarasını istemiyoruz.

Psikolojik ölçme sonuçları sağlık verisi niteliği taşıyabileceğinden, öğrencilere ait ölçme verilerini KVKK’nın 6. maddesindeki özel nitelikli kişisel veri güvencesiyle koruyoruz.

## 3. Hangi amaçlarla ve hangi hukuki sebeplerle işliyoruz?

| Amaç | Hukuki sebep |
|---|---|
| Hesabın açılması, girişin sağlanması, hizmetin sunulması | Sözleşmenin kurulması ve ifası (KVKK m.5/2-c) |
| Öğrencinin testleri çözmesi, puanların hesaplanması ve raporların hazırlanması | Velinin açık rızası (KVKK m.6/2 ve m.6/3) |
| Anonimleştirilmiş verilerle Türkiye normlarının ve geçerlik çalışmalarının yapılması | Velinin ayrıca verdiği, isteğe bağlı açık rıza |
| Bilgi güvenliği, kötüye kullanımın önlenmesi, hataların giderilmesi | Veri sorumlusunun meşru menfaati (KVKK m.5/2-f) |
| Mevzuattan doğan yükümlülükler (ör. vergi ve elektronik ticaret mevzuatı) | Kanunlarda açıkça öngörülme ve hukuki yükümlülük (KVKK m.5/2-a ve m.5/2-ç) |

Öğrenci verilerini reklam, pazarlama ya da profil satışı amacıyla kullanmayız. Öğrenci verilerini yapay zekâ modellerinin eğitimi için kullanmayız.

## 4. Verileri nasıl topluyoruz?

Veriler; platformdaki formlar, test ekranları ve sistem kayıtları aracılığıyla elektronik ortamda, otomatik yollarla toplanır. Okul aracılığıyla kullanılan hesaplarda öğrencinin adı ve sınıfı okul tarafından platforma girilir.

## 5. Verileri kimlere aktarıyoruz?

- **Okul hesaplarında:** öğrencinin raporunu, velinin onayıyla, öğrencinin okulundaki rehber öğretmen (psikolojik danışman) görebilir. Öğretmenler ve okul yöneticileri bireysel sonuç göremez; yalnızca en az beş öğrenciden oluşan grupların özetlerini görebilir.
- **Hizmet sağlayıcılar:** barındırma (sunucular Türkiye’dedir) ve e-posta gönderim hizmeti sağlayıcıları, yalnızca hizmetin gerektirdiği ölçüde ve gizlilik yükümlülüğü altında.
- **Yetkili kamu kurum ve kuruluşları:** yalnızca hukuken zorunlu olduğunda.

Kişisel veriler yurt dışına aktarılmaz.

## 6. Ne kadar süre saklıyoruz?

- Hesap ve öğrenci verileri: hesap açık kaldığı sürece. Hesap kapatıldığında ya da veli silinmesini istediğinde, yasal saklama zorunluluğu olmayan veriler en geç 30 gün içinde silinir veya anonimleştirilir.
- Açık rıza geri alındığında: ilgili öğrencinin ölçme verileri en geç 30 gün içinde silinir.
- İşlem güvenliği kayıtları: 2 yıl.
- Ödeme ve fatura kayıtları: vergi mevzuatı gereği 10 yıl.

## 7. Haklarınız

KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK’nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini ve bu işlemlerin aktarıldığı kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.

Başvurularınızı {{company.kvkkEmail}} adresine e-posta ile, {{company.kepAddress}} adresine KEP ile veya {{company.address}} adresine yazılı olarak iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.

Veli panelinden çocuğunuza ait verileri görüntüleyebilir, açık rızanızı geri alabilir ve silme talebinde bulunabilirsiniz.`;

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

const terms = `Bu kullanım koşulları, Ölçekhane platformunu ("Platform") kullanan herkes için geçerlidir. Platformu kullanarak bu koşulları kabul etmiş olursunuz.

## 1. Hizmetin niteliği

Platform, öğrencilerin kişilik, ilgi, öğrenme ve bilişsel beceriler gibi alanlarda bilimsel ölçme araçlarını çevrim içi olarak doldurmasını ve sonuçların öğrenci, veli ve öğretmenler için sade bir dille raporlanmasını sağlar.

**Platform tanı koymaz.** Raporlar tıbbi, psikiyatrik ya da psikolojik bir teşhis, tedavi veya klinik değerlendirme değildir ve bunların yerine geçmez. Çocuğunuzun ruh sağlığı ya da gelişimiyle ilgili bir endişeniz varsa bir uzmana başvurun.

Bazı testler "pilot" olarak işaretlenmiştir. Bu testlerin Türkiye normları ve geçerlik çalışmaları sürmektedir; raporlarında bu durum açıkça belirtilir.

## 2. Hesaplar

- Veli hesabını yalnızca 18 yaşını doldurmuş kişiler açabilir.
- Bir öğrenci için profil oluşturan kişi, o öğrencinin velisi ya da yasal temsilcisi olduğunu beyan eder.
- Hesap bilgilerinizin gizliliğinden siz sorumlusunuz. Hesabınızın izinsiz kullanıldığını düşünüyorsanız bize hemen bildirin.

## 3. Kullanım kuralları

- Platformdaki test maddeleri, metinler ve raporlar telif hakkıyla ya da lisansla korunur. Kopyalanamaz, yayımlanamaz, başka bir yerde test olarak kullanılamaz.
- Testler, bir başkası adına ya da sonucu yanıltmak amacıyla çözülmemelidir.
- Platformun güvenliğini tehdit edecek girişimlerde bulunulamaz.

## 4. Sorumluluk

Raporlar, öğrencinin kendi cevaplarına ve görevlerdeki performansına dayanır; bu nedenle cevapların içtenliğinden ve uygulama koşullarından etkilenir. Raporlar, eğitim ve kariyer kararlarında tek başına dayanak olarak kullanılmamalıdır.

## 5. Değişiklikler

Bu koşullar güncellenebilir. Önemli değişiklikler kayıtlı e-posta adresinize bildirilir.

## 6. Uygulanacak hukuk

Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Tüketici işlemlerinden doğan uyuşmazlıklarda, parasal sınırlar içinde tüketici hakem heyetleri, aşan durumlarda tüketici mahkemeleri yetkilidir.

## 7. İletişim

{{company.legalName}} · {{company.address}} · {{company.email}}`;

const cookiePolicy = `Ölçekhane yalnızca platformun çalışması için zorunlu olan tek bir çerez kullanır.

| Çerez | Amaç | Süre |
|---|---|---|
| olc_oturum | Giriş yaptığınızda oturumunuzu açık tutar. | Veli ve personel için 30 gün, öğrenci için 8 saat ya da çıkış yapana kadar |

Reklam, izleme ya da üçüncü taraf analiz çerezi kullanmıyoruz. Bu nedenle çerez onay penceresi göstermiyoruz. İleride zorunlu olmayan bir çerez eklenirse, kullanılmadan önce onayınız istenecektir.`;

export const LEGAL_DOCS: LegalDocDef[] = [
  { kind: 'privacy_notice', version: 1, slug: 'aydinlatma-metni', title: 'KVKK Aydınlatma Metni', bodyMd: privacyNotice },
  { kind: 'consent_assessment', version: 1, slug: 'acik-riza-olcme', title: 'Açık Rıza Metni: Ölçme Verilerinin İşlenmesi', bodyMd: consentAssessment },
  { kind: 'consent_research', version: 1, slug: 'acik-riza-arastirma', title: 'Açık Rıza Metni: Norm ve Geçerlik Çalışmaları (İsteğe Bağlı)', bodyMd: consentResearch },
  { kind: 'child_info', version: 1, slug: 'ogrenci-bilgilendirme', title: 'Öğrenci için bilgilendirme', bodyMd: childInfo },
  { kind: 'terms', version: 1, slug: 'kullanim-kosullari', title: 'Kullanım Koşulları', bodyMd: terms },
  { kind: 'cookie_policy', version: 1, slug: 'cerez-politikasi', title: 'Çerez Politikası', bodyMd: cookiePolicy },
];

export function legalDocBySlug(slug: string): LegalDocDef | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
