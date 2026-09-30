# Ölçekhane sunucu kurulumu

Bu rehber Ölçekhane'yi tek bir sunucuya Docker ile elle kurar. Aynı adımları GitHub'daki **Yayın** iş akışı
kendiliğinden yapar (`yayin/yayinla.sh` → `sunucu/kur.sh`); otomatik kurulum için
[yayin/REHBER.md](yayin/REHBER.md) yeterlidir. Bu belge otomasyonun ne yaptığını anlatır ve elle kurulum ya
da sorun giderme için başvuru kaynağıdır.

Kurulumun sonunda sunucuda iki kapsayıcı çalışır:

| Kapsayıcı | Görevi |
|---|---|
| `app` | Ölçekhane uygulaması. Salt okunur dosya sistemiyle çalışır: diske hiçbir şey yazamaz. |
| `caddy` | HTTPS: Let's Encrypt sertifikasını kendisi alır ve yeniler, istekleri uygulamaya iletir. |

Sitede veritabanı yoktur ve hiçbir veri saklanmaz: yedek, şifreli disk ya da sitede bir yönetim paneli gerekmez.
Sunucu kaybolsa bile kaybolacak bir veri yoktur; site yeni bir sunucuya aynı adımlarla yeniden kurulur.

Komutlar Ubuntu 24.04 LTS için yazıldı. Komutlardaki `olcekhane.com` yerine kendi alan adınızı yazın.

## 1. Gerekenler

**Bir sunucu (şu anki karar: Hostinger VPS, Almanya).** Aydınlatma metni sunucunun Hostinger'ın Almanya'daki
veri merkezinde olduğunu ve siteye gönderilen bilgilerin (kaydedilmeden işlenen test cevapları, bağlantı
bilgileri) bu yüzden yurt dışına aktarıldığını söyler. Başka bir sağlayıcı ya da ülke seçerseniz önce
aydınlatma metnini (`src/content/legal/index.ts`) değiştirin. Sunucu yurt dışında olduğu için KVKK'nın 9.
maddesindeki yurt dışına aktarım kuralları uygulanır: yeterlilik kararı yoksa genellikle Kurulun
yayımladığı standart sözleşme sağlayıcıyla imzalanır ve imzadan sonra 5 iş günü içinde Kurula bildirilir.
Bu adımı hukuk danışmanınızla birlikte yapın.

- En az 1 vCPU ve 2 GB bellek (PDF üretimi işlemci kullanır; trafik arttıkça 2 vCPU önerilir), 20 GB disk
- Ubuntu 24.04 LTS

**Alan adı** ve DNS kayıtlarını düzenleme yetkisi.

**Bir e-posta kutusu** (yalnızca gelen e-postalar için; site e-posta göndermez). Adresi iletişim sayfasında
ve aydınlatma metninde görünür. Sağlayıcının sunucuları yurt dışındaysa bu da yurt dışına aktarımdır.

**Site sahibinin bilgileri.** Ölçekhane'yi bir kişi bireysel olarak işletir. 5651 sayılı Kanun'a dayanan
yönetmeliğin 5. maddesi gereği adı ve soyadı, adresi, telefonu ve e-postası İletişim sayfasında ve aydınlatma
metninde gösterilir (bu dördü zorunludur); yer sağlayıcının (Hostinger) bilgileri de altbilgide ve İletişim
sayfasında yer alır (`src/lib/site.ts`). İsteğe bağlı olarak KVKK başvuruları için ayrı bir e-posta ve KEP
adresi; ücretli rapor satışına başlamadan önce yapılacak vergi kaydından sonra vergi dairesi ve numarası.

## 2. Sunucunun hazırlanması

### 2.1 Güncellemeler

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades    # "Yes": güvenlik güncellemeleri kendiliğinden kurulur
sudo tee /etc/apt/apt.conf.d/52olcekhane-unattended >/dev/null <<'EOF'
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:30";
EOF
sudo timedatectl set-timezone Europe/Istanbul
```

Yeniden başlatma gerektiren bir güncelleme olursa sunucu gece 04:30'da yeniden başlar; Docker ve
kapsayıcılar açılışta kendiliğinden başlar.

### 2.2 Kullanıcı ve SSH

Sağlayıcı yalnızca `root` hesabı verdiyse kendinize bir kullanıcı açın:

```bash
adduser yonetici
usermod -aG sudo yonetici
```

Kendi bilgisayarınızdan SSH anahtarınızı bu kullanıcıya kopyalayın (`ssh-copy-id yonetici@SUNUCU_IP`).
Sonra şifreyle ve `root` hesabıyla girişi kapatın:

```bash
sudo tee /etc/ssh/sshd_config.d/10-olcekhane.conf >/dev/null <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
EOF
sudo sshd -t && sudo systemctl reload ssh
sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '    # ikisi de "no" olmalı
```

Bu oturumu kapatmadan önce yeni bir terminalden anahtarla girebildiğinizi deneyin.

### 2.3 Güvenlik duvarı

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp     # HTTP/3
sudo ufw logging off       # engellenen bağlantılar (IP adresleriyle) günlüğe yazılmasın
sudo ufw enable
```

Docker'ın dışarı açtığı portlar UFW kurallarını atlar. `docker-compose.yml` yalnızca Caddy'nin 80 ve 443
portlarını açar; `app` servisine `ports:` eklemeyin.

### 2.4 Takas alanının ve bellek dökümlerinin kapatılması

Uygulama işlediği test cevaplarını yalnızca bellekte tutar. Takas alanı açık olursa bellek sayfaları, bir
süreç çökerse de belleğinin dökümü (core dump) diske yazılabilir; bu yüzden ikisi de kapatılır (sitenin
bellek ihtiyacı yaklaşık 200 MB'tır):

```bash
sudo swapoff -a
sudo sed -i -E '/^[^#]*[[:space:]]swap[[:space:]]/s/^/# olcekhane (takas kapatıldı): /' /etc/fstab
sudo systemctl mask swap.target
swapon --show        # çıktı boş olmalı

sudo systemctl disable --now apport.service; sudo systemctl mask apport.service
printf 'kernel.core_pattern=|/bin/false\nfs.suid_dumpable=0\n' | sudo tee /etc/sysctl.d/60-olcekhane.conf
sudo sysctl -p /etc/sysctl.d/60-olcekhane.conf
cat /proc/sys/kernel/core_pattern    # |/bin/false
```

## 3. Docker

Docker'ın kendi paket deposundan kurun (güncel komutlar:
[docs.docker.com/engine/install/ubuntu](https://docs.docker.com/engine/install/ubuntu/)):

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER     # docker komutları sudo'suz çalışsın; çıkıp yeniden girin
```

`docker` grubu root yetkisine denktir: yalnızca sunucu yöneticilerini ekleyin.

## 4. Uygulamanın kurulması

Bütün `docker compose` komutlarını `/srv/olcekhane` klasöründe çalıştırın.

### 4.1 Kodun indirilmesi

```bash
sudo mkdir -p /srv/olcekhane
sudo chown $USER: /srv/olcekhane
git clone https://github.com/HESAP/DEPO.git /srv/olcekhane
cd /srv/olcekhane
```

Depo özelse sunucuya yalnızca okuma yetkisi olan bir dağıtım anahtarı (deploy key) tanımlayın:

```bash
ssh-keygen -t ed25519 -N '' -C olcekhane-sunucu -f ~/.ssh/olcekhane_deploy
cat ~/.ssh/olcekhane_deploy.pub
# GitHub'da depo → Settings → Deploy keys → Add deploy key (yazma izni vermeyin)
git clone -c core.sshCommand="ssh -i ~/.ssh/olcekhane_deploy" git@github.com:HESAP/DEPO.git /srv/olcekhane
```

### 4.2 Ayarlar (`.env`)

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

| Değişken | Değer |
|---|---|
| `SITE_DOMAIN` | Alan adı, `www` olmadan: `olcekhane.com` |
| `ACME_EMAIL` | Sertifika bildirimleri için e-posta |
| `APP_URL` | `https://olcekhane.com` (site haritası, PDF raporların alt bilgisi ve paylaşım kartları bununla üretilir) |
| `OWNER_*` | Site sahibinin bilgileri: `OWNER_NAME`, `OWNER_ADDRESS`, `OWNER_PHONE`, `OWNER_EMAIL` zorunlu; `OWNER_KVKK_EMAIL`, `OWNER_KEP`, `OWNER_TAX_OFFICE`, `OWNER_TAX_NO` isteğe bağlı |
| `ALLOW_INDEXING` | Hazırlık süresince `false`, yayına çıkarken `true` |

Gizli bir değer (parola, anahtar) yoktur. İçinde `#` geçen bir değeri tırnak içine yazın
(`OWNER_ADDRESS="..."`). `.env` değiştikten sonra `docker compose up -d` çalıştırın. Sayfalar istek anında
üretildiği için site sahibinin bilgileri, site adresi ve `ALLOW_INDEXING` yeniden derleme gerekmeden
aydınlatma metnine, İletişim sayfasına, `robots.txt` ve site haritasına yansır.

### 4.3 DNS

`olcekhane.com` ve `www.olcekhane.com` için sunucunun IPv4 adresini gösteren **A** kayıtları ekleyin.
**AAAA (IPv6) kaydı eklemeyin:** kurulum yalnızca IPv4 ile yayın yapar. IPv6 bağlantıları kapsayıcılara
Docker'ın ağ geçidi üzerinden ulaşsaydı bütün IPv6 ziyaretçileri tek bir IP adresinden geliyormuş gibi
görünür, hız sınırı hepsine birlikte uygulanırdı. Kaydın yayıldığını denetleyin: `dig +short olcekhane.com`
(komut yoksa `sudo apt install -y bind9-dnsutils`).

### 4.4 Başlatma

```bash
docker compose up -d --build --wait
```

İlk derleme 5–10 dakika sürer. Komut, uygulama sağlıklı olarak açılınca döner. Sonra:

```bash
docker compose ps                                    # app: healthy; caddy: running
docker compose logs caddy | grep -i "certificate obtained"
curl -sS https://olcekhane.com/api/saglik            # {"durum":"ok"}
```

## 5. Yayına çıkmadan önce

- Site sahibinin bilgileri `.env` dosyasında eksiksiz; İletişim sayfası (`/iletisim`), aydınlatma metni
  (`/yasal/aydinlatma-metni`) ve altbilgi doğru görünüyor. (Yayın iş akışı, zorunlu bilgiler boşken
  `ALLOW_INDEXING=true` yapılmasına izin vermez.)
- Aydınlatma metni ve kullanım koşulları bir hukukçuya okutuldu; yurt dışına aktarım için standart
  sözleşme imzalandı ve Kurula bildirildi.
- "Hiçbir şey saklanmaz" denetimi:

```bash
docker inspect -f '{{.HostConfig.ReadonlyRootfs}}' "$(docker compose ps -q app)"   # true
swapon --show                                                                     # boş
cat /proc/sys/kernel/core_pattern                                                 # |/bin/false
docker compose logs app caddy | grep -c remote_ip                                 # 0
```

- `ALLOW_INDEXING=true` yapıldı ve site Google Search Console'a eklendi.

## 6. Güncelleme

```bash
cd /srv/olcekhane
git pull
docker compose pull --ignore-buildable        # Caddy'nin küçük sürüm güncellemeleri
docker compose up -d --build --wait
docker image prune -f && docker builder prune -f
```

Yeni uygulama açılana kadar site birkaç saniye yanıt vermeyebilir. Sistem paketleri `unattended-upgrades`
ile kendiliğinden güncellenir.

## 7. Sistemi izleme

- Dışarıdan çalışan bir izleme hizmetiyle (ya da GitHub'daki **Bakım** iş akışıyla) `https://olcekhane.com/api/saglik`
  adresini düzenli olarak yoklayın. Uygulama çalışıyorsa `200` ve `{"durum":"ok"}` döner; başka bilgi vermez.
- Disk: `df -h /` (yüzde 80'i geçmesin). Kapsayıcı günlükleri kapsayıcı başına en fazla 30 MB tutulur.

## 8. Güvenlik ve gizlilik notları

- Dışarıya yalnızca 80 ve 443 portları, yalnızca IPv4 üzerinden açıktır ([4.3](#43-dns)). Uygulama yalnızca
  iç Docker ağından erişilebilir.
- Hız sınırı istemcinin IP adresine dayanır ve yalnızca bellekte tutulur (en geç 11 dakika). Caddy bu adresi
  kendi gördüğü bağlantıdan alır ve istemcinin gönderdiği `X-Forwarded-For` başlığını yok sayar. Sitenin
  önüne bir CDN ya da başka bir vekil sunucu koyarsanız bütün ziyaretçiler o sunucunun adresinden
  geliyormuş gibi görünür: böyle bir durumda `docker/Caddyfile` içinde `trusted_proxies` tanımlanmalı ve
  `X-Forwarded-For` başlığı `{remote_host}` yerine `{client_ip}` ile gönderilmelidir. Trafiği yurt dışında
  açan bir CDN ayrıca yurt dışına aktarım demektir ve aydınlatma metnine yazılmalıdır.
- Caddy, alan adı ve bütün alt alan adları için bir yıllık HSTS başlığı gönderir: alt alan adlarınızın
  hepsi HTTPS ile çalışmalı.
- Günlükler: Caddy'nin erişim günlüğü kapalıdır ve günlüğüne yalnızca ayar, yönetim ve sertifika iletileri
  yazılır (izin listesi, `docker/Caddyfile`). Caddy'nin isteği IP adresi ve başlıklarıyla birlikte yazan
  iletileri (ör. istek hataları `http.log.error`, yarıda kalan yanıtlar `http.handlers.reverse_proxy`) bu
  yüzden yazılmaz. Uygulama günlüğe yalnızca hata özeti yazar; istek gövdesi, test cevapları ve IP adresi
  yazılmaz. Güvenlik duvarının günlüğü kapalıdır.
- Uygulama kapsayıcısı salt okunur çalışır; geçici klasörleri yalnızca bellekte durur (tmpfs). Takas alanı
  ve bellek dökümleri (core dump) kapalıdır ([2.4](#24-takas-alanının-ve-bellek-dökümlerinin-kapatılması)).
- Sunucuya SSH ile erişebilen kişileri az tutun; görevden ayrılanın SSH anahtarını `~/.ssh/authorized_keys`
  dosyasından hemen silin.

## 9. KVKK notları

Bu bölüm teknik bir özettir, hukuki görüş değildir; kararları hukuk danışmanınızla birlikte verin.

- **Veri konumu:** aydınlatma metni sunucunun Almanya'da (Hostinger) olduğunu söyler. Yurt dışında
  sunuculu bir e-posta hizmeti kullanılıyorsa bu da metne yazılmalıdır. Yurt dışına aktarım için standart
  sözleşme ve Kurula bildirim gerekir ([bölüm 1](#1-gerekenler)).
- **Saklanan veri yoktur:** test cevapları ve raporlar hiçbir yere yazılmaz (veritabanı, dosya, günlük);
  hız sınırı için IP adresi yalnızca bellekte, en geç 11 dakika tutulur. Bu davranışı değiştiren her
  geliştirmede (ör. ücretli rapor, ödeme) aydınlatma metni önce güncellenmelidir.
- **E-postalar:** ziyaretçilerin size gönderdiği e-postalar e-posta kutunuzda durur. Aydınlatma metni,
  yazışma bittikten sonra en geç 1 yıl içinde silindiklerini söyler; bunu düzenli olarak uygulayın.
- **VERBİS:** Ana faaliyeti özel nitelikli kişisel veri işlemek olan veri sorumluları, yıllık çalışan
  sayısı 10'dan ve yıllık mali bilanço toplamı 10 milyon TL'den azsa kayıttan istisnadır (Kurul kararı
  2025/1572); diğerleri için eşik 50 çalışan ve 100 milyon TL'dir. Hangi gruba girdiğinizi hukuk
  danışmanınızla değerlendirin.
- **Veri ihlali:** ihlali öğrendiğiniz andan itibaren en geç 72 saat içinde Kurula bildirim gerekir.
- **İlgili kişi başvuruları:** en geç 30 gün içinde yanıtlanır. Test cevapları ve raporlar saklanmadığı
  için bunlarla ilgili gösterilecek bir kayıt yoktur.

## 10. Sorun giderme

| Belirti | Neden ve çözüm |
|---|---|
| Site açılmıyor, sertifika alınamıyor | DNS kaydı henüz yayılmadı ya da 80/443 kapalı. `docker compose logs caddy` çıktısına bakın. |
| `SITE_DOMAIN .env dosyasında tanımlı olmalı` | `.env` dosyası yok ya da eksik; komutu `/srv/olcekhane` içinde çalıştırın. |
| `app` sürekli yeniden başlıyor | `docker compose logs app` çıktısına bakın. |
| Derleme `Killed` ya da 137 koduyla duruyor | Derleme sırasında bellek yetmedi. Görüntüyü GitHub'da derleyip yükleyen otomatik yayını kullanın ya da daha fazla bellekli bir sunucu seçin. |
| Sunucu yeniden başladı, site kapalı | Docker açılışta kendiliğinden başlar; birkaç dakika bekleyin. Açılmazsa `docker compose up -d`. |
| Disk doluyor | `docker system df`, `docker image prune -f`, `docker builder prune -f`. |
