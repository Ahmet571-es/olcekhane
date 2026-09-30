# Ölçekhane'yi yayına alma rehberi

Bu rehber yazılım bilgisi gerektirmez. Kurulumun kendisini GitHub'daki **Yayın** iş akışı yapar: sunucuyu
hazırlar, uygulamayı kurar ve her güncellemede yeniden yayına alır. Sizden yalnızca aşağıdaki birkaç
kopyala-yapıştır işi beklenir.

Teknik ayrıntılar ve elle kurulum: [KURULUM.md](../KURULUM.md). Otomasyonun kendisi: `yayin/yayinla.sh`,
`sunucu/kur.sh`, `.github/workflows/`.

Sitede veritabanı, hesap ve iletişim formu yoktur; hiçbir veri saklanmaz. Bu yüzden yedek, şifreli disk ya
da sitede bir yönetim paneli yoktur: sunucu kaybolsa bile kaybolacak bir veri yoktur, site yenisine dakikalar
içinde yeniden kurulur.

## 1. Satın alınacaklar

Aydınlatma metni sunucunun **Hostinger'ın Almanya'daki veri merkezinde** olduğunu söyler. Başka bir
sağlayıcı ya da ülke seçilirse önce metnin değişmesi gerekir.

| Kalem | Seçilen | Not |
|---|---|---|
| Sunucu | Hostinger VPS **KVM 2**, veri merkezi **Almanya** | İşletim sistemi **Ubuntu 24.04**, eklentisiz ("Plain OS"). Site az kaynak kullanır; KVM 1 de yeter, gerekirse sonradan yükseltilir. |
| Alan adı | `olcekhane.com` (Namecheap) | DNS kayıtlarını düzenleyebilmelisiniz. |
| E-posta kutusu | Yalnızca gelen e-postalar için tek adres, ör. `bilgi@olcekhane.com` | Site e-posta göndermez. Ziyaretçiler size bu adrese yazar; adres iletişim sayfasında görünür. |

Sunucunun **root şifresini** Hostinger'da kurulum sırasında siz belirlersiniz. Bu şifreyi kimseyle
paylaşmayın; yalnızca 3. adımda GitHub'a gireceksiniz.

> **KVKK:** Sunucu yurt dışında olduğu için siteye gönderilen bilgiler (kaydedilmeden işlenen test
> cevapları ve IP adresleri) yurt dışına aktarılmış sayılır. Bunun için genellikle Kişisel Verileri Koruma
> Kurulunun yayımladığı standart sözleşmenin Hostinger ile imzalanması ve imzadan sonra 5 iş günü içinde
> Kurula bildirilmesi gerekir. Bu adımı bir hukukçuyla birlikte yapın; aydınlatma metni ve kullanım
> koşulları da yayından önce bir hukukçuya okutulmalıdır.

## 2. Ana parola (ANA_SIFRE)

GitHub'daki yayın iş akışının sunucuya bağlandığı SSH anahtarı bu paroladan üretilir; anahtar hiçbir yerde
saklanmaz.

1. Uzun ve rastgele bir parola üretin (Claude'un verdiği parola üretme sayfasını kullanabilirsiniz; parola
   yalnızca sizin tarayıcınızda üretilir, hiçbir yere gönderilmez).
2. Parolayı güvenli bir yere kaydedin (ör. bir parola yöneticisi).

> Parola kurulumdan sonra değiştirilirse yayın iş akışı sunucuya bağlanamaz ve durur; eski değeri geri
> girmek yeter. Parola kaybolursa sunucu Hostinger panelinden sıfırlanıp yeni bir root şifresi ve yeni bir
> ANA_SIFRE ile yeniden kurulur; saklanan veri olmadığı için hiçbir şey kaybolmaz.

## 3. GitHub'a gizli bilgileri girme

Her biri için: [github.com/Ahmet571-es/olcekhane/settings/secrets/actions/new](https://github.com/Ahmet571-es/olcekhane/settings/secrets/actions/new)
adresini açın, **Name** kutusuna adı, **Secret** kutusuna değeri yapıştırın, **Add secret**'a basın.

| Name | Secret (değer) |
|---|---|
| `ANA_SIFRE` | 2. adımdaki parola |
| `SUNUCU_ROOT_SIFRE` | Sunucunun root şifresi (ilk kurulumdan sonra silinebilir) |

Girilen değerler GitHub'da bir daha görüntülenemez; yanlış girildiyse aynı adla yeniden girin. Daha önce
`DEPO_ROOT_SIFRE`, `SMTP_KULLANICI` ya da `SMTP_SIFRE` girdiyseniz artık kullanılmıyorlar; silebilirsiniz.

İlk kurulumdan sonra Claude, sunucunun SSH anahtarını depoya (`yayin/bilinen-sunucular`) ekler; böylece yayın
iş akışı yalnızca bu sunucuya bağlanır. Ardından `SUNUCU_ROOT_SIFRE`'yi silin: kurulum root hesabıyla şifreli
girişi zaten kapatır ve şifre bir daha gerekmez.

## 4. Claude'a yazılacaklar (gizli değildir)

Bunlar sitede ve depoda görünebilir; `yayin/ayarlar.env` dosyasına işlenir:

- Sunucunun **IP adresi** (IPv4)
- Sertifika bildirimleri için bir **e-posta adresi** (sitenin e-postası olabilir)
- **Site sahibinin bilgileri** (siteyi bireysel olarak işleten kişi): adı ve soyadı, adresi, telefonu ve
  e-postası. Yasa gereği sitenin İletişim sayfasında herkese açık görünür. İsteğe bağlı: KVKK başvuruları
  için ayrı bir e-posta ve KEP adresi. Vergi dairesi ve numarası, ücretli rapor satışına başlamadan önce
  yapılacak vergi kaydından sonra eklenir.

## 5. DNS kayıtları

Alan adı panelinde (Namecheap → Domain List → Manage → Advanced DNS):

| Tür | Ad (Host) | Değer |
|---|---|---|
| A | `@` | Sunucunun IP adresi |
| A | `www` | Sunucunun IP adresi |

**AAAA (IPv6) kaydı eklemeyin.** E-posta kutusu için sağlayıcının verdiği MX ve SPF (TXT) kayıtları da
buraya eklenir; değerleri Claude sağlayıcının belgelerine göre tek tek yazar.

## 6. Yayın

IP adresi ve gizli bilgiler girildiğinde yayın kendiliğinden başlar (GitHub → **Actions** → **Yayın**).
İlk kurulum 10–15 dakika sürer. Site açılınca yapmanız gereken başka bir şey yoktur: giriş yapılacak bir
yönetim paneli yoktur.

Site ilk açıldığında arama motorlarına kapalıdır (`ALLOW_INDEXING=false`). Her şey hazır olduğunda (site
sahibinin bilgileri, KVKK adımları) bu ayar açılır ve site Google Search Console'a eklenir (sahiplik
doğrulaması için DNS'e bir TXT kaydı girilir). Site sahibinin zorunlu bilgileri boşken yayın iş akışı bu
ayarın açılmasına izin vermez.

## 7. Sonrası

- **Güncellemeler:** GitHub'a gönderilen her değişiklik testlerden geçince kendiliğinden yayına alınır.
- **Güvenlik güncellemeleri:** sistem paketleri her gün, Docker görüntüleri her pazartesi kendiliğinden
  güncellenir. Güncelleme yeniden başlatma gerektirirse sunucu gece 04:30'da kendiliğinden yeniden başlar;
  site birkaç dakika içinde kendiliğinden açılır.
- **İzleme:** **Bakım** iş akışı üç saatte bir siteyi denetler; site yanıt vermiyorsa uygulamayı yeniden
  başlatır. Elle yeniden başlatmak için: GitHub → **Actions** → **Yayın** → **Run workflow** → `baslat`.
- **Uyarılar:** bir iş akışı başarısız olursa GitHub size e-posta gönderir.
- **E-postalar:** size gelen e-postaları, yazışma bittikten sonra en geç 1 yıl içinde silin (aydınlatma
  metni bu süreyi söyler).
