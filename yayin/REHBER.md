# Ölçekhane'yi yayına alma rehberi

Bu rehber yazılım bilgisi gerektirmez. Kurulumun kendisini GitHub'daki **Yayın** iş akışı yapar: sunucuyu
hazırlar, uygulamayı kurar ve her güncellemede yeniden yayına alır. Sizden yalnızca aşağıdaki birkaç
kopyala-yapıştır işi beklenir.

Teknik ayrıntılar ve elle kurulum: [KURULUM.md](../KURULUM.md). Otomasyonun kendisi: `yayin/yayinla.sh`,
`sunucu/kur.sh`, `.github/workflows/`.

## 1. Satın alınacaklar

Aydınlatma metni sunucunun **Hostinger'ın Almanya'daki veri merkezinde** olduğunu söyler. Başka bir
sağlayıcı ya da ülke seçilirse önce metnin değişmesi gerekir.

| Kalem | Seçilen | Not |
|---|---|---|
| Ana sunucu | Hostinger VPS **KVM 2**, veri merkezi **Almanya** (2 çekirdek / 8 GB bellek / 100 GB disk) | İşletim sistemi **Ubuntu 24.04**, eklentisiz ("Plain OS"). Veriler sistem diskinde şifreli bir alanda tutulur. |
| Yedek sunucusu | İsteğe bağlı, şimdilik yok | Yedeklerin şifreli bir kopyasını ayrı bir yerde tutmak için. Eklenirse konumu aydınlatma metnine yazılır. |
| Alan adı | `olcekhane.com` (Namecheap) | DNS kayıtlarını düzenleyebilmelisiniz. |
| E-posta gönderimi | SMTP destekli kurumsal e-posta | Tek adres yeter: `bilgi@olcekhane.com`. Hesaplar kapalıyken yalnızca iletişim formu bildirimleri ve yönetici e-postaları için kullanılır. |

Ana sunucunun **root şifresini** Hostinger'da kurulum sırasında siz belirlersiniz. Bu şifreyi kimseyle
paylaşmayın; yalnızca 3. adımda GitHub'a gireceksiniz.

> **KVKK:** Sunucu yurt dışında olduğu için siteye gönderilen bilgiler (iletişim formu mesajları, giriş
> denemeleri, IP adresleri) yurt dışına aktarılmış sayılır. Bunun için genellikle Kişisel Verileri Koruma
> Kurulunun yayımladığı standart sözleşmenin Hostinger ile imzalanması ve imzadan sonra 5 iş günü içinde
> Kurula bildirilmesi gerekir. Bu adımı bir hukukçuyla birlikte yapın.

Site **hızlı test modunda** açılır: veli, okul ve öğrenci hesapları kapalıdır (`yayin/ayarlar.env` →
`ACCOUNTS_ENABLED=false`), testler hesap açmadan çözülür ve cevaplar hiçbir yere kaydedilmez.

## 2. Ana parola (ANA_SIFRE)

Kurulumun bütün anahtarları (sunuculara bağlanan anahtar, şifreli diskin parolası, uygulama anahtarı,
yedeklerin anahtarı) bu tek paroladan üretilir.

1. Uzun ve rastgele bir parola üretin (Claude'un verdiği parola üretme sayfasını kullanabilirsiniz; parola
   yalnızca sizin tarayıcınızda üretilir, hiçbir yere gönderilmez).
2. Parolayı **iki ayrı güvenli yere** kaydedin (ör. bir parola yöneticisi ve kâğıda yazılıp kasada).

> **Bu parola hiçbir zaman değiştirilmemeli ve kaybedilmemeli.** Kaybolursa sunucudaki şifreli veriler
> ve yedekler açılamaz; değiştirilirse yayın kendini durdurur.

## 3. GitHub'a gizli bilgileri girme

Her biri için: [github.com/Ahmet571-es/olcekhane/settings/secrets/actions/new](https://github.com/Ahmet571-es/olcekhane/settings/secrets/actions/new)
adresini açın, **Name** kutusuna adı, **Secret** kutusuna değeri yapıştırın, **Add secret**'a basın.

| Name | Secret (değer) |
|---|---|
| `ANA_SIFRE` | 2. adımdaki parola |
| `SUNUCU_ROOT_SIFRE` | Ana sunucunun root şifresi (ilk kurulumdan sonra silinebilir) |
| `DEPO_ROOT_SIFRE` | Yalnızca yedek sunucusu alınırsa: onun root şifresi (ilk kurulumdan sonra silinebilir) |
| `SMTP_KULLANICI` | E-posta adresi, ör. `bilgi@olcekhane.com` |
| `SMTP_SIFRE` | O e-posta adresinin şifresi |

Girilen değerler GitHub'da bir daha görüntülenemez; yanlış girildiyse aynı adla yeniden girin.

## 4. Claude'a yazılacaklar (gizli değildir)

Bunlar sitede ve depoda görünebilir; `yayin/ayarlar.env` dosyasına işlenir:

- Ana sunucunun (ve alınırsa yedek sunucusunun) **IP adresi**
- Alan adı ve yönetici hesabı açılacak **e-posta adresi**
- Şirket bilgileri: ticaret unvanı, adres, MERSİS numarası, vergi dairesi ve numarası, telefon, e-posta,
  KVKK başvuruları için e-posta, KEP adresi

## 5. DNS kayıtları

Alan adı panelinde (ör. Namecheap → Domain List → Manage → Advanced DNS):

| Tür | Ad (Host) | Değer |
|---|---|---|
| A | `@` | Ana sunucunun IP adresi |
| A | `www` | Ana sunucunun IP adresi |

**AAAA (IPv6) kaydı eklemeyin.** E-posta için sağlayıcının verdiği MX, SPF (TXT), DKIM (TXT) ve DMARC
(TXT) kayıtları da buraya eklenir; değerleri Claude sağlayıcının belgelerine göre tek tek yazar.

## 6. Yayın

IP adresleri ve gizli bilgiler girildiğinde yayın kendiliğinden başlar (GitHub → **Actions** → **Yayın**).
İlk kurulum 10–20 dakika sürer. Site açılınca:

1. `https://olcekhane.com/sifremi-unuttum` adresine yönetici e-postanızı yazın; gelen bağlantıyla
   şifrenizi belirleyin.
2. Giriş yapın; iki aşamalı doğrulamayı telefonunuzdaki doğrulama uygulamasıyla (Google Authenticator,
   Microsoft Authenticator, 2FAS) kurun ve verilen **kurtarma kodlarını** güvenli bir yere kaydedin.
3. **Yönetim → Genel bakış** sayfasındaki hazırlık listesine bakın.

## 7. Sonrası

- **Güncellemeler:** GitHub'a gönderilen her değişiklik testlerden geçince kendiliğinden yayına alınır.
  Güncellemeden önce veritabanının yedeği alınır.
- **Güvenlik güncellemeleri:** sistem paketleri her gün, Docker görüntüleri her pazartesi kendiliğinden
  güncellenir.
- **Sunucu yeniden başlarsa:** şifreli disk kapalı kalır ve site açılmaz. **Bakım** iş akışı üç saatte
  bir siteyi denetler ve diski kendiliğinden açar. Beklemek istemezseniz: GitHub → **Actions** →
  **Yayın** → **Run workflow** → `diski-ac` → **Run workflow**.
- **Uyarılar:** bir iş akışı başarısız olursa GitHub size e-posta gönderir.
- **Yedekler:** her gece alınır, 14 gün saklanır; yedek sunucusu kurulduysa şifreli kopyaları her sabah
  oraya çekilir.
