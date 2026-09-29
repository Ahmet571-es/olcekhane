# Ölçekhane sunucu kurulumu

Bu rehber Ölçekhane'yi Türkiye'deki tek bir sunucuya Docker ile kurar. Kurulumun sonunda sunucuda dört
kapsayıcı çalışır:

| Kapsayıcı | Görevi |
|---|---|
| `app` | Ölçekhane uygulaması. Açılışta veritabanı şemasını günceller; günlük temizlik görevi bunun içinde çalışır. |
| `db` | PostgreSQL 18. Dışarıya açık değildir. |
| `caddy` | HTTPS: Let's Encrypt sertifikasını kendisi alır ve yeniler, istekleri uygulamaya iletir. |
| `yedek` | Her gece veritabanının yedeğini alır, süresi dolan yedekleri siler. |

Komutlar Ubuntu 24.04 LTS için yazıldı; Ubuntu 26.04 LTS'de de aynıdır. Kurulumu yapacak kişinin SSH ile
sunucuya bağlanabilmesi ve temel Linux komutlarını bilmesi yeterli. Komutlardaki `olcekhane.com` yerine
kendi alan adınızı yazın.

1. [Gerekenler](#1-gerekenler)
2. [Sunucunun hazırlanması](#2-sunucunun-hazırlanması)
3. [Docker](#3-docker)
4. [Şifreli veri diski](#4-şifreli-veri-diski)
5. [Uygulamanın kurulması](#5-uygulamanın-kurulması)
6. [Yönetici hesabı](#6-yönetici-hesabı)
7. [Yayına çıkmadan önce](#7-yayına-çıkmadan-önce)
8. [Günlük işletim](#8-günlük-işletim)
9. [Yedekleme ve geri yükleme](#9-yedekleme-ve-geri-yükleme)
10. [Güncelleme](#10-güncelleme)
11. [Sistemi izleme](#11-sistemi-izleme)
12. [Güvenlik notları](#12-güvenlik-notları)
13. [KVKK notları](#13-kvkk-notları)
14. [Sorun giderme](#14-sorun-giderme)

## 1. Gerekenler

**Türkiye'de bir sunucu.** Aydınlatma metni, sunucuların Türkiye'de olduğunu ve kişisel verilerin yurt
dışına aktarılmadığını söyler. Bu söz sunucu dışına alınan yedekleri ve e-posta gönderim hizmetini de
kapsar. Yurt dışındaki bir hizmet kullanmaya karar verirseniz KVKK'nın 9. maddesindeki yurt dışına
aktarım kuralları uygulanır ve aydınlatma metni de değişmelidir.

- En az 2 vCPU, 4 GB bellek, 40 GB SSD sistem diski
- Veriler için ayrı bir disk: en az 20 GB (sağlayıcılarda "ek disk" ya da "blok depolama" adıyla
  sunulur). Bu disk şifrelenecek ([bölüm 4](#4-şifreli-veri-diski)). Ek disk alınamıyorsa şifreli alan
  bir dosya olarak da oluşturulabilir.
- Ubuntu 24.04 LTS ya da 26.04 LTS

**Alan adı** ve DNS kayıtlarını düzenleme yetkisi.

**E-posta gönderim hizmeti (SMTP).** Doğrulama, şifre yenileme, okul daveti ve veli onayı e-postaları
bununla gider. E-postalarda veli ve öğretmen adresleri, bazılarında öğrencinin adı bulunur: sağlayıcının
sunucuları Türkiye'de olmalı. Gönderen adres kendi alan adınızda olmalı (ör. `bilgi@olcekhane.com`) ve
sağlayıcının verdiği SPF, DKIM ve DMARC kayıtları DNS'e eklenmeli; yoksa veli onayı e-postaları
istenmeyen klasörüne düşer.

**Şirket bilgileri:** ticaret unvanı, adres, MERSİS numarası, vergi dairesi ve numarası, telefon,
e-posta, KVKK başvuruları için e-posta ve KEP adresi. Aydınlatma metninde ve sitenin altbilgisinde
gösterilir.

**Bir parola yöneticisi.** Şifreli diskin parolası, uygulama anahtarı (`APP_SECRET`) ve yöneticilerin
kurtarma kodları burada saklanır. Disk parolası ile yedeklerin gizli anahtarını en az iki kişinin
erişebileceği, sunucudan ayrı bir yerde tutun.

## 2. Sunucunun hazırlanması

### 2.1 Güncellemeler

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades    # "Yes": güvenlik güncellemeleri kendiliğinden kurulur
```

### 2.2 Kullanıcı ve SSH

Sağlayıcı yalnızca `root` hesabı verdiyse kendinize bir kullanıcı açın:

```bash
adduser yonetici
usermod -aG sudo yonetici
```

Kendi bilgisayarınızdan SSH anahtarınızı bu kullanıcıya kopyalayın (`ssh-copy-id yonetici@SUNUCU_IP`).
Sağlayıcı `root` için zaten bir anahtar tanımladıysa onu taşıyabilirsiniz:
`rsync --archive --chown=yonetici:yonetici ~/.ssh /home/yonetici`.

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
sudo ufw enable
```

Docker'ın dışarı açtığı portlar UFW kurallarını atlar. `docker-compose.yml` yalnızca Caddy'nin 80 ve 443
portlarını açar; `db` ve `app` servislerine `ports:` eklemeyin.

### 2.4 Saat

```bash
timedatectl
```

Çıktıda `System clock synchronized: yes` görünmeli; görünmüyorsa `sudo timedatectl set-ntp true`. İki
aşamalı doğrulama kodları saate bağlıdır: sunucu saati yarım dakikadan fazla kayarsa kodlar reddedilmeye
başlar.

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
sudo usermod -aG docker $USER     # docker komutları sudo'suz çalışsın; çıkıp yeniden girin
```

`docker` grubu root yetkisine denktir: yalnızca sunucu yöneticilerini ekleyin.

## 4. Şifreli veri diski

Ölçme sonuçları sağlık verisi niteliği taşıyabileceği için aydınlatma metni bu verileri özel nitelikli
kişisel veri güvencesiyle korumayı taahhüt eder. KVKK Kurulunun 2018/10 sayılı kararı bu tür verilerin
kriptografik yöntemlerle saklanmasını ve anahtarların ayrı ortamda tutulmasını öngörür. Bu bölümde
veritabanı, yedekler ve gizli anahtarların bulunduğu `.env` dosyası LUKS ile şifrelenmiş bir diskte
tutulur; diskin parolası sunucuda değil, sizde durur.

Bedeli: sunucu her yeniden başladığında disk elle açılır (tek komut, [4.3](#43-yeniden-başlatmadan-sonra-olcekhane-ac)).
Sağlayıcının bakım için yaptığı yeniden başlatmaları kaçırmamak için izleme kurun ([bölüm 11](#11-sistemi-izleme)).

### 4.1 Diski şifreleme

```bash
lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS      # ek diskin adını bulun (ör. vdb): boş ve bağlanmamış olmalı
sudo apt install -y cryptsetup
sudo cryptsetup luksFormat /dev/vdb      # diskteki her şeyi siler; büyük harflerle YES yazın, parola belirleyin
sudo cryptsetup open /dev/vdb olcekhane-veri
sudo mkfs.ext4 -L olcekhane-veri /dev/mapper/olcekhane-veri
sudo mkdir -p /srv/olcekhane
sudo mount /dev/mapper/olcekhane-veri /srv/olcekhane
```

Uzun ve rastgele bir parola seçip parola yöneticisine kaydedin: parola kaybolursa verilere ulaşılamaz.

Ek disk yoksa önce bir dosya oluşturun (`sudo fallocate -l 30G /olcekhane-veri.img`) ve bu bölümdeki
bütün komutlarda `/dev/vdb` yerine `/olcekhane-veri.img` yazın.

Diskin başlığı bozulursa parola da işe yaramaz; başlığın yedeğini alıp sunucudan çıkarın:

```bash
sudo cryptsetup luksHeaderBackup /dev/vdb --header-backup-file ~/luks-baslik.img
sudo chown $USER: ~/luks-baslik.img
# kendi bilgisayarınızda: scp yonetici@SUNUCU_IP:luks-baslik.img .
shred -u ~/luks-baslik.img
```

Başlık yedeğini paroladan ayrı, güvenli bir yerde saklayın.

### 4.2 Docker verisini şifreli diske taşıma

```bash
sudo systemctl stop docker.service docker.socket
sudo mkdir -p /srv/olcekhane/docker
echo '{ "data-root": "/srv/olcekhane/docker" }' | sudo tee /etc/docker/daemon.json
sudo mkdir -p /etc/systemd/system/docker.service.d
printf '[Unit]\nConditionPathIsMountPoint=/srv/olcekhane\n' | sudo tee /etc/systemd/system/docker.service.d/sifreli-disk.conf
sudo systemctl daemon-reload
sudo systemctl disable docker.service docker.socket
sudo rm -rf /var/lib/docker
sudo systemctl start docker
docker info --format '{{.DockerRootDir}}'      # /srv/olcekhane/docker yazmalı
```

Veritabanı, Caddy'nin sertifikaları ve kapsayıcı günlükleri artık şifreli diskte (program kodundan ibaret
uygulama görüntüleri sistem diskinde kalır). Docker açılışta kendiliğinden başlamaz ve disk bağlı değilken
başlatılamaz; böylece boş bir veri klasörüyle yanlışlıkla açılmaz.

Bellek 4 GB ya da daha azsa uygulamanın derlenmesi için takas alanını (swap) da şifreli diskte açın:

```bash
sudo fallocate -l 2G /srv/olcekhane/swapfile
sudo chmod 600 /srv/olcekhane/swapfile
sudo mkswap /srv/olcekhane/swapfile
sudo swapon /srv/olcekhane/swapfile
```

`swapon --show` sistem diskinde başka bir takas alanı gösteriyorsa bellekteki veriler oraya şifresiz
yazılabilir: `sudo swapoff <ad>` ile kapatın ve `/etc/fstab` dosyasındaki satırını silin.

### 4.3 Yeniden başlatmadan sonra: `olcekhane-ac`

Uygulamanın kodunu indirdikten sonra ([5.1](#51-kodun-indirilmesi)) açma betiğini kurun:

```bash
cd /srv/olcekhane/uygulama
sudo install -m 700 sunucu/olcekhane-ac.sh /usr/local/sbin/olcekhane-ac
sudo install -m 644 sunucu/olcekhane.conf.example /etc/olcekhane.conf
sudo sed -i "s#^VERI_KAYNAK=.*#VERI_KAYNAK=/dev/disk/by-uuid/$(sudo cryptsetup luksUUID /dev/vdb)#" /etc/olcekhane.conf
grep VERI_ /etc/olcekhane.conf
```

Dosya kullandıysanız `/etc/olcekhane.conf` içinde `VERI_KAYNAK=/olcekhane-veri.img` yazın.

Sunucu yeniden başladığında SSH ile bağlanıp `sudo olcekhane-ac` çalıştırın: parola sorulur, disk
bağlanır ve Docker başlar. Kapsayıcılar `restart: unless-stopped` ayarı sayesinde kendiliğinden kalkar.

## 5. Uygulamanın kurulması

Bütün `docker compose` komutlarını `/srv/olcekhane/uygulama` klasöründe çalıştırın.

### 5.1 Kodun indirilmesi

```bash
sudo mkdir -p /srv/olcekhane/uygulama
sudo chown $USER: /srv/olcekhane/uygulama
git clone https://github.com/HESAP/DEPO.git /srv/olcekhane/uygulama
cd /srv/olcekhane/uygulama
```

Depo özelse sunucuya yalnızca okuma yetkisi olan bir dağıtım anahtarı (deploy key) tanımlayın:

```bash
ssh-keygen -t ed25519 -N '' -C olcekhane-sunucu -f ~/.ssh/olcekhane_deploy
cat ~/.ssh/olcekhane_deploy.pub
# GitHub'da depo → Settings → Deploy keys → Add deploy key (yazma izni vermeyin)
git clone -c core.sshCommand="ssh -i ~/.ssh/olcekhane_deploy" git@github.com:HESAP/DEPO.git /srv/olcekhane/uygulama
```

### 5.2 Ayarlar (`.env`)

```bash
cp .env.example .env
chmod 600 .env
openssl rand -hex 32     # POSTGRES_PASSWORD için
openssl rand -hex 32     # APP_SECRET için
nano .env
```

| Değişken | Değer |
|---|---|
| `SITE_DOMAIN` | Alan adı, `www` olmadan: `olcekhane.com` |
| `ACME_EMAIL` | Sertifika bildirimleri için e-posta |
| `APP_URL` | `https://olcekhane.com` (e-postalardaki bağlantılar ve site haritası bununla üretilir) |
| `POSTGRES_PASSWORD` | `openssl rand -hex 32` çıktısı (yalnızca harf ve rakam) |
| `APP_SECRET` | `openssl rand -hex 32` çıktısı. **Kurulumdan sonra değiştirmeyin** ve parola yöneticisine de kaydedin: öğrenci giriş kodları, kurtarma kodları ve iki aşamalı doğrulama sırları buna bağlıdır. |
| `SMTP_URL` | 465 portu: `smtps://kullanici:sifre@smtp.saglayici.com.tr:465` · 587 portu: `smtp://kullanici:sifre@smtp.saglayici.com.tr:587?requireTLS=true`. Kullanıcı adında ya da şifrede `@`, `:`, `/` varsa kodlayarak yazın (`%40`, `%3A`, `%2F`). |
| `MAIL_FROM` | `Ölçekhane <bilgi@olcekhane.com>` |
| `COMPANY_*` | Şirket bilgileri (hepsi zorunlu) |
| `ALLOW_INDEXING` | Hazırlık süresince `false`, yayına çıkarken `true` |
| `SCHEDULED_JOBS` | `true` kalmalı (günlük temizlik görevi) |
| `BACKUP_KEEP_DAYS` | Yedeklerin kaç gün saklanacağı: 1–28 (varsayılan 14) |
| `BACKUP_TIME` | Yedek saati, Türkiye saatiyle (varsayılan `03:15`) |

İçinde `#` geçen bir değeri tırnak içine yazın (`COMPANY_ADDRESS="..."`). `.env` değiştikten sonra
`docker compose up -d` çalıştırın; değişen kapsayıcılar yeniden oluşturulur. Sayfalar istek anında
üretildiği için şirket bilgileri, site adresi ve `ALLOW_INDEXING` yeniden derleme gerekmeden
aydınlatma metnine, altbilgiye, `robots.txt` ve site haritasına yansır.

### 5.3 DNS

`olcekhane.com` ve `www.olcekhane.com` için sunucunun IPv4 adresini gösteren **A** kayıtları ekleyin.
**AAAA (IPv6) kaydı eklemeyin:** kurulum yalnızca IPv4 ile yayın yapar. IPv6 bağlantıları kapsayıcılara
Docker'ın ağ geçidi üzerinden ulaşsaydı bütün IPv6 ziyaretçileri tek bir IP adresinden geliyormuş gibi
görünür, hatalı giriş sınırları hepsine birlikte uygulanırdı. Kaydın yayıldığını denetleyin:
`dig +short olcekhane.com` (komut yoksa `sudo apt install -y bind9-dnsutils`).

### 5.4 Başlatma

```bash
docker compose up -d --build --wait
```

İlk derleme 5–10 dakika sürer. Komut, uygulama sağlıklı olarak açılınca döner. Sonra:

```bash
docker compose ps                                    # app: healthy; diğerleri: running
docker compose logs app | tail -20                   # "Veritabanı güncel." ve hata satırı olmamalı
docker compose logs caddy | grep -i "certificate obtained"
curl -sS https://olcekhane.com/api/saglik            # {"durum":"ok"}
```

## 6. Yönetici hesabı

```bash
docker compose exec app node dist/create-admin.mjs
```

E-posta adresi ve şifre (en az 12 karakter; yazarken ekranda görünmez) sorulur. Sonra
`https://olcekhane.com/giris` adresinden girin: iki aşamalı doğrulamayı kurmanız istenir (Google
Authenticator, Microsoft Authenticator, 2FAS gibi bir uygulamayla). Kurulum şifrenizi bir kez daha
ister ve yalnızca başlattığınız oturumda görünür. Kurulumun sonunda gösterilen 10 kurtarma kodunu
parola yöneticisine kaydedin.

Bireysel sonuçlara ve yönetim paneline yalnızca kodla doğrulanmış oturumlar erişir. Kodla
doğrulanmamış bir oturum (ör. iki aşamalı doğrulama başka bir cihazda kurulurken açık kalmış bir
oturum) "Bu oturumu doğrulayın" sayfasına yönlendirilir.

En az iki yönetici hesabı açın (aynı komutla, herkes kendi e-postasıyla): biri telefonunu ve kurtarma
kodlarını kaybederse diğeri **Yönetim → Kullanıcılar** sayfasından onun iki aşamalı doğrulamasını
sıfırlayabilir. Tek yönetici kilitlenirse sunucudan sıfırlanır:

```bash
docker compose exec -e ADMIN_RESET_2FA=1 app node dist/create-admin.mjs
```

Bu komut şifreyi de yeniler ve hesabın bütün oturumlarını kapatır.

## 7. Yayına çıkmadan önce

- [ ] **Yönetim → Genel bakış** sayfasındaki yayına hazırlık listesinde "Eksik" satırı kalmadı.
- [ ] Şirket bilgileri eksiksiz; `https://olcekhane.com/yasal` altındaki metinlerde doğru görünüyor.
- [ ] Hukuki metinleri (aydınlatma metni, iki açık rıza metni, öğrenci bilgilendirme metni, kullanım
      koşulları, çerez politikası) bir hukukçu gözden geçirdi. Metinler `src/content/legal/index.ts`
      dosyasındadır. Yayından sonra bir metni değiştirirken sürüm numarasını artırın: onay kaydı bağlı
      olan bir sürümün üzerine yazılmaz. Mevcut rızalar metnin yeni sürümünde de geçerli sayılır; işleme
      amacını ya da kapsamını genişleten bir değişiklikte velilerden yeniden rıza almak gerekebilir ve
      platformda bunun için henüz bir akış yoktur.
- [ ] VERBİS kaydının gerekip gerekmediği değerlendirildi ([bölüm 13](#13-kvkk-notları)).
- [ ] Uzman kadrosu `src/content/experts.ts` dosyasına gerçek kişilerin bilgileriyle eklendi (liste
      boşken sitede uzman bölümleri görünmez).
- [ ] Ölçek kullanım izinleri tamam (hazırlık listesi, izni beklenen ölçek yayındaysa uyarır).
- [ ] E-posta çalışıyor: `https://olcekhane.com/sifremi-unuttum` sayfasından kendi adresinize bağlantı
      isteyin; e-postanın gelen kutusuna düştüğünü ve **Yönetim → E-postalar** sayfasında "Gönderildi"
      göründüğünü denetleyin.
- [ ] Elle bir yedek alındı ve deneme amaçlı geri yüklendi ([9.4](#94-deneme-geri-yüklemesi)).
- [ ] Sunucu dışı yedek kopyası kuruldu ([9.3](#93-sunucu-dışı-şifreli-kopya)).
- [ ] İzleme kuruldu ([bölüm 11](#11-sistemi-izleme)).
- [ ] Yayın günü: `.env` içinde `ALLOW_INDEXING=true`, sonra `docker compose up -d`. Google Search
      Console ve Bing Webmaster Tools'a siteyi ekleyip `https://olcekhane.com/sitemap.xml` adresini
      bildirin.

## 8. Günlük işletim

- **Yönetim paneli** (`/yonetim`): hazırlık listesi, okullar, kullanıcı desteği, gelen mesajlar,
  e-postalar (gönderilemeyenler yeniden denenebilir), denetim kaydı ve psikometri.
- **Okul eklemek:** **Yönetim → Okullar → Okul ekle**. Okulun adını, ilini, ilçesini ve ekibi kuracak
  ilk kişinin e-postasını girin; o kişiye davet gider.
- **Günlük temizlik görevi:** uygulamanın içinde, günde bir kez çalışır ve aydınlatma metnindeki saklama
  sürelerini uygular (rızası geri alınan öğrencilerin ölçme verileri, silinen profiller, süresi dolan
  kayıtlar). Son çalışmaları ve silinen kayıt sayıları **Yönetim → Genel bakış** sayfasındadır; son 36
  saatte başarılı bir çalışma yoksa hazırlık listesi uyarır. Aynı yerden elle de çalıştırılabilir.
- **Günlükler:** `docker compose logs --tail 200 app` (ya da `db`, `caddy`, `yedek`).

## 9. Yedekleme ve geri yükleme

### 9.1 Otomatik yedek

`yedek` kapsayıcısı her gün `BACKUP_TIME` saatinde veritabanının sıkıştırılmış bir kopyasını
`/srv/olcekhane/uygulama/yedekler` klasörüne yazar ve `BACKUP_KEEP_DAYS` günü dolan yedekleri siler.
Dosyaları yalnızca root okuyabilir. Eski yedekler yalnızca yeni yedek başarıyla alındıktan sonra silinir
ve en yeni yedek hiçbir zaman silinmez: yedek art arda alınamazsa eldeki yedekler kaybolmaz. Her çalışma
veritabanına kaydedilir; **Yönetim → Genel bakış** sayfasındaki hazırlık listesi son başarılı yedeği
gösterir ve 36 saatten eskiyse "Eksik" olarak işaretler.

```bash
sudo ls -lh yedekler/                                       # yedekler
docker compose logs yedek | tail                            # son yedeklerin kaydı
docker compose exec yedek bash /usr/local/bin/yedekle simdi # hemen bir yedek al
```

Saklama süresi en fazla 28 gündür: aydınlatma metni, silinen verilerin en geç 30 gün içinde silineceğini
söyler ve silinen veri, temizlik görevinden sonra yalnızca yedeklerde kalır.

### 9.2 Gizli anahtarlar

Yedekler veritabanının tamamını içerir ama `.env` dosyasını içermez. `APP_SECRET` olmadan geri yüklenen
bir veritabanında öğrenci giriş kodları ve iki aşamalı doğrulama kurulumları çalışmaz (yeniden
üretilmeleri gerekir). `.env` dosyasının bir kopyasını parola yöneticisinde tutun.

### 9.3 Sunucu dışı şifreli kopya

Sunucunun diski ya da kendisi kaybolursa yedekler de gider. `sunucu/yedek-kopyala.sh` betiği her gün
yedekleri **age** ile şifreler ve Türkiye'deki başka bir sunucuya gönderir. Şifreleme bir açık anahtarla
yapılır; yedeği açacak gizli anahtar sunucuda bulunmaz. Karşı taraftaki kopyalar da en fazla 28 gün
saklanır.

1. **Anahtar çifti** (kendi bilgisayarınızda, sunucuda değil):
   `age-keygen -o olcekhane-yedek.key`. Çıktıdaki `age1…` ile başlayan açık anahtarı not edin; anahtar
   dosyasını parola yöneticisine ve çevrim dışı bir yere kaydedin.
2. **Sunucuda bir SSH anahtarı:**

   ```bash
   sudo apt install -y age rsync
   sudo ssh-keygen -t ed25519 -N '' -C olcekhane-yedek -f /root/.ssh/olcekhane_yedek
   sudo cat /root/.ssh/olcekhane_yedek.pub
   ```

3. **Depolama sunucusunda** (Türkiye'de, `rsync` kurulu) yalnızca yedeğe ayrılmış bir kullanıcı açın ve
   anahtarı **yalnızca yazabilecek, silemeyecek** biçimde tanımlayın. Böylece Ölçekhane sunucusu ele
   geçirilse bile karşıdaki kopyalar silinemez; süresi dolanları depolama sunucusundaki bir görev siler:

   ```bash
   sudo adduser --disabled-password --comment '' yedek
   sudo -u yedek mkdir -p -m 700 /home/yedek/olcekhane /home/yedek/.ssh
   sudo -u yedek nano /home/yedek/.ssh/authorized_keys
   #   tek satır (sondaki anahtar, 2. adımdaki çıktı):
   #   command="/usr/bin/rrsync -wo -no-del /home/yedek/olcekhane",restrict ssh-ed25519 AAAA… olcekhane-yedek
   sudo crontab -u yedek -e
   #   30 6 * * * find /home/yedek/olcekhane -maxdepth 1 -name 'olcekhane-*.dump.age' -mtime +27 -delete
   ```

4. **Ölçekhane sunucusunda** ayarları yazın ve betiği kurun:

   ```bash
   sudo ssh -i /root/.ssh/olcekhane_yedek yedek@yedek.ornek.com.tr   # sunucu anahtarını bir kez onaylayın (komutun reddedilmesi beklenir)
   sudo nano /etc/olcekhane.conf      # YEDEK_ALICI=age1…, YEDEK_HEDEF=yedek@yedek.ornek.com.tr:, YEDEK_KARSIDA_SIL=hayir
   sudo install -m 700 sunucu/yedek-kopyala.sh /usr/local/sbin/olcekhane-yedek-kopyala
   sudo olcekhane-yedek-kopyala       # ilk kopya
   sudo install -m 644 sunucu/olcekhane.cron /etc/cron.d/olcekhane
   ```

Betik her gün 04:30'da çalışır (sunucu saatiyle); kaydı `/var/log/olcekhane-yedek-kopya.log`
dosyasındadır. Şifreli disk açık değilse ya da hiç yedek yoksa hiçbir şey yapmaz. Karşı sunucuda
yukarıdaki kısıtlamayı yapamıyorsanız `YEDEK_KARSIDA_SIL=evet` bırakın ve `YEDEK_HEDEF` olarak bir
klasör verin (`yedek@yedek.ornek.com.tr:olcekhane/`): o zaman süresi dolan kopyaları bu betik siler.
Bu kipte de yalnızca `olcekhane-*.dump.age` dosyalarına dokunulur, saklama süresi içindeki kopyalar
(yeni kurulmuş bir sunucuda karşılığı olmasa bile) silinmez ve bir çalışmada en fazla 10 dosya silinir.

Şifreli disk kullanmıyorsanız ayar dosyasını `sudo install -m 644 sunucu/olcekhane.conf.example
/etc/olcekhane.conf` ile kurun ve içine `VERI_BAGLAMA=/`,
`YEDEK_KAYNAK=/srv/olcekhane/uygulama/yedekler`, `YEDEK_AYNA=/srv/olcekhane/yedek-kopya` ve
`UYGULAMA_ENV=/srv/olcekhane/uygulama/.env` satırlarını ekleyin.

Karşıdaki bir kopyayı açmak için (kendi bilgisayarınızda):
`age -d -i olcekhane-yedek.key -o olcekhane-20261001-031500.dump olcekhane-20261001-031500.dump.age`.

### 9.4 Deneme geri yüklemesi

Yedeğin gerçekten açıldığını ayda bir denetleyin; asıl veritabanına dokunmaz:

```bash
docker compose exec yedek bash -c 'createdb olcekhane_deneme && pg_restore --no-owner -d olcekhane_deneme /yedekler/olcekhane-20261001-031500.dump && psql -d olcekhane_deneme -Atc "select count(*) from users" ; dropdb olcekhane_deneme'
```

### 9.5 Gerçek geri yükleme

Geri yükleme, yedeğin alındığı andan sonraki bütün değişiklikleri siler.

```bash
docker compose exec yedek bash /usr/local/bin/yedekle simdi     # önce bugünkü hâlin yedeği
docker compose stop app
docker compose exec yedek bash -c 'dropdb --force olcekhane && createdb olcekhane && pg_restore --no-owner -d olcekhane /yedekler/olcekhane-20261001-031500.dump'
docker compose start app
```

Sunucu dışındaki bir kopyayı geri yükleyecekseniz önce şifresini çözüp dosyayı `yedekler/` klasörüne
koyun. Uygulama açıldıktan sonra **Yönetim → Genel bakış** sayfasından temizlik görevini elle
çalıştırın.

**KVKK açısından dikkat:** yedek tarihinden sonra geri alınan rızalar, hesap kapatmaları ve silme
talepleri de geri yüklemeyle kaybolur. Bunları yeniden uygulayın: geri yüklemeden hemen önce aldığınız
yedek varsa onu ayrı bir veritabanına açıp o aralıktaki kayıtlara bakabilirsiniz; yoksa KVKK başvuru
e-postalarınızı ve e-posta sağlayıcınızın gönderim kayıtlarını inceleyin. Veri kaybına yol açan olayı
veri ihlali prosedürünüze göre değerlendirin ([bölüm 13](#13-kvkk-notları)).

### 9.6 Yeni sunucuya taşıma

Yeni sunucuyu bu rehberle kurun, eski `.env` dosyasını (özellikle aynı `APP_SECRET` değerini) kullanın,
son yedeği [9.5](#95-gerçek-geri-yükleme)'teki gibi geri yükleyin ve DNS kaydını yeni sunucuya çevirin.
Sunucu dışı kopyalamayı ([9.3](#93-sunucu-dışı-şifreli-kopya)) geri yüklemeden sonra kurun. Eski
sunucudaki diskleri ve yedekleri sağlayıcının güvenli silme yöntemiyle yok edin.

## 10. Güncelleme

```bash
cd /srv/olcekhane/uygulama
docker compose exec yedek bash /usr/local/bin/yedekle simdi   # önce yedek
git pull
docker compose pull --ignore-buildable                        # PostgreSQL ve Caddy'nin küçük sürüm güncellemeleri
docker compose up -d --build --wait
docker image prune -f && docker builder prune -f              # eski görüntüler ve derleme önbelleği
```

Veritabanı şeması uygulama açılırken kendiliğinden güncellenir. Yeni uygulama açılana kadar site birkaç
saniye yanıt vermeyebilir. PostgreSQL görüntüsü 18 sürümüne sabitlenmiştir; ana sürüm yükseltmesi
(19 gibi) yedekten geri yükleme gerektirir ve ayrıca planlanmalıdır.

Güvenlik güncellemeleri için ayda bir `git pull` ve `docker compose pull` yapın; sistem paketleri
`unattended-upgrades` ile kendiliğinden güncellenir (çekirdek güncellemesinden sonra sunucuyu uygun bir
saatte yeniden başlatıp diski açın).

## 11. Sistemi izleme

- Dışarıdan çalışan bir izleme hizmetiyle `https://olcekhane.com/api/saglik` adresini birkaç dakikada
  bir yoklayın. Uygulama ve veritabanı çalışıyorsa `200` ve `{"durum":"ok"}`, veritabanına
  ulaşılamıyorsa `503` döner; başka bilgi vermez. Sunucu yeniden başlayıp şifreli disk açılmayı
  beklerken de bu adres yanıt vermez ve uyarı gelir.
- Disk: `df -h / /srv/olcekhane` (yüzde 80'i geçmesin).
- Hazırlık listesi: temizlik görevi ya da veritabanı yedeği son 36 saatte başarıyla çalışmadıysa ya da
  `SMTP_URL` tanımlı değilse "Eksik" gösterir. Gönderilemeyen e-postalar **Yönetim → E-postalar**
  sayfasında görünür. Sunucu dışı kopyanın kaydı: `sudo tail /var/log/olcekhane-yedek-kopya.log`.

## 12. Güvenlik notları

- Dışarıya yalnızca 80 ve 443 portları, yalnızca IPv4 üzerinden açıktır ([5.3](#53-dns)). Veritabanı ve
  uygulama yalnızca iç Docker ağından erişilebilir.
- Hız sınırları ve güvenlik kayıtları istemcinin IP adresine dayanır; Caddy bu adresi kendi gördüğü
  bağlantıdan alır ve istemcinin gönderdiği `X-Forwarded-For` başlığını yok sayar. Sitenin önüne bir CDN
  ya da başka bir vekil sunucu koyarsanız bütün ziyaretçiler o sunucunun adresinden geliyormuş gibi
  görünür: böyle bir durumda `docker/Caddyfile` içinde `trusted_proxies` tanımlanmalı ve
  `X-Forwarded-For` başlığı `{remote_host}` yerine `{client_ip}` ile gönderilmelidir. Trafiği yurt
  dışında açan bir CDN ayrıca yurt dışına aktarım demektir.
- Caddy, alan adı ve bütün alt alan adları için bir yıllık HSTS başlığı gönderir: alt alan adlarınızın
  hepsi HTTPS ile çalışmalı.
- Erişim günlüğü bilerek kapalıdır (adreslerde tek kullanımlık bağlantılar bulunur). Kapsayıcı günlükleri
  kapsayıcı başına en fazla 30 MB tutulur ve kapsayıcı yeniden oluşturulunca (ör. görüntüsü
  güncellenince) silinir. Veritabanı sorgu hataları günlüğe parametreleri (e-posta, IP gibi) olmadan
  yazılır ve PostgreSQL hata kayıtlarına anahtar değerleri yazılmaz; yine de beklenmeyen hataların
  ayrıntılarında seyrek olarak kişisel veri bulunabilir. Günlükleri sunucu dışına kopyalamayın.
- İki aşamalı doğrulama platform yöneticileri ve rehber öğretmenler için zorunludur. Bireysel sonuçlara
  yalnızca ikinci adımı (kod ya da kurtarma kodu) doğrulanmış oturumlar erişir; kurulum şifre ister ve
  yalnızca başlatıldığı oturumda tamamlanabilir, yeni cihaza taşıma ayrıca şu anki cihazın kodunu ister.
- Sunucuya SSH ile erişebilen herkes bütün verilere erişebilir: bu kişileri az tutun ve KVKK yetki
  listenize yazın. Görevden ayrılanın SSH anahtarını `~/.ssh/authorized_keys` dosyasından hemen silin.

## 13. KVKK notları

Bu bölüm teknik bir özettir, hukuki görüş değildir; kararları hukuk danışmanınızla birlikte verin.

- **Veri konumu:** sunucu, sunucu dışı yedekler ve e-posta hizmeti Türkiye'de olmalı (aydınlatma
  metnindeki söz).
- **Saklama ve imha:** saklama süreleri aydınlatma metninde yazılıdır ve günlük temizlik göreviyle
  uygulanır; yedekler en fazla 28 gün tutulur. Saklama ve imha politikanıza bu görevi ve süreleri yazın.
- **Kurulun 2018/10 sayılı kararındaki önlemler:** şifreli saklama ve anahtarların ayrı tutulması
  ([bölüm 4](#4-şifreli-veri-diski) ve [9.3](#93-sunucu-dışı-şifreli-kopya)), uzaktan erişimde iki aşamalı
  doğrulama (uygulama zorunlu tutar; sunucu erişimi yalnızca SSH anahtarıyla), işlem kayıtları
  (**Yönetim → Denetim kaydı**, 2 yıl), güvenlik güncellemelerinin izlenmesi ([bölüm 10](#10-güncelleme)).
  Teknik olmayan önlemler size düşer: çalışanlara eğitim, gizlilik taahhütnameleri, yetki listesi ve
  görev değişikliğinde yetkilerin kaldırılması, düzenli güvenlik testi (sızma testi) ve sonuçlarının
  kaydı.
- **VERBİS:** Ana faaliyeti özel nitelikli kişisel veri işlemek olan veri sorumluları, yıllık çalışan
  sayısı 10'dan ve yıllık mali bilanço toplamı 10 milyon TL'den azsa kayıttan istisnadır (Kurul kararı
  2025/1572); diğerleri için eşik 50 çalışan ve 100 milyon TL'dir. Ölçme sonuçlarının sağlık verisi
  sayılıp sayılmayacağını ve hangi gruba girdiğinizi hukuk danışmanınızla değerlendirin.
- **Veri ihlali:** ihlali öğrendiğiniz andan itibaren en geç 72 saat içinde Kurula bildirim gerekir;
  etkilenen kişilere de en kısa sürede bilgi verilir. Önceden bir müdahale planı hazırlayın.
- **İlgili kişi başvuruları:** en geç 30 gün içinde yanıtlanır. Veliler çocuklarının verilerini veli
  panelinden görebilir, rızalarını geri alabilir ve silinmesini isteyebilir. Hesabını kapatan kullanıcının
  hesap bilgileri hemen anonimleştirilir; çocuk profilleri ve ölçme verileri temizlik göreviyle silinir.

## 14. Sorun giderme

| Belirti | Neden ve çözüm |
|---|---|
| Site açılmıyor, sertifika alınamıyor | DNS kaydı henüz yayılmadı ya da 80/443 kapalı. `docker compose logs caddy` çıktısına bakın. |
| `POSTGRES_PASSWORD .env dosyasında tanımlı olmalı` | `.env` dosyası yok ya da eksik; komutu `/srv/olcekhane/uygulama` içinde çalıştırın. |
| `app` sürekli yeniden başlıyor | `docker compose logs app`: `APP_SECRET` 32 karakterden kısa olabilir ya da veritabanına bağlanılamıyor olabilir. |
| Derleme `Killed` ya da 137 koduyla duruyor | Bellek yetmedi: şifreli diskte takas alanı açın ([4.2](#42-docker-verisini-şifreli-diske-taşıma)). |
| E-postalar gitmiyor | **Yönetim → E-postalar** sayfasındaki hata iletisine bakın; `SMTP_URL` içindeki özel karakterleri kodlayın, 465 için `smtps://`, 587 için `smtp://` kullanın. |
| E-postalar istenmeyen klasörüne düşüyor | SPF, DKIM ve DMARC kayıtlarını ve `MAIL_FROM` adresinin alan adını denetleyin. |
| İki aşamalı doğrulama kodu reddediliyor | Sunucunun (`timedatectl`) ve telefonun saati doğru mu? 15 dakikada 8 hatalı denemeden sonra 15 dakika, bir günde 20 hatalı denemeden sonra ertesi güne kadar beklenir. |
| "Bu oturumu doğrulayın" sayfası açılıyor | Oturum kodla doğrulanmamış (ör. iki aşamalı doğrulama başka bir cihazda kurulurken açık kalmış). Uygulamadaki kodu ya da bir kurtarma kodunu yazın ya da çıkıp yeniden girin. |
| Hazırlık listesinde "Veritabanı yedeği: Eksik" | `docker compose logs yedek` çıktısına bakın; elle denemek için `docker compose exec yedek bash /usr/local/bin/yedekle simdi`. |
| Sunucu yeniden başladı, site kapalı | `sudo olcekhane-ac` ile şifreli diski açın. |
| `Cannot connect to the Docker daemon` | Docker, şifreli disk bağlanmadan başlamaz: önce `sudo olcekhane-ac`. |
| Disk doluyor | `docker system df`, `docker image prune -f`, `docker builder prune -f`; `yedekler/` boyutunu ve `BACKUP_KEEP_DAYS` değerini denetleyin. |
