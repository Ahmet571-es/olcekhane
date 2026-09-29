#!/usr/bin/env bash
# Ölçekhane sunucu kurulumu ve işletimi. GitHub'daki yayın iş akışı (yayin/yayinla.sh) SSH ile çalıştırır;
# KURULUM.md'deki elle kurulumun otomatik karşılığıdır. Her komut tekrar tekrar çalıştırılabilir: yalnızca
# eksik olan yapılır, var olan veri hiçbir zaman silinmez ya da yeniden biçimlendirilmez.
#
#   kur.sh hazirla   paketler, güvenlik duvarı, Docker, şifreli veri alanı, ayarlar (.env), betikler
#   kur.sh yayinla   yüklenmiş uygulama görüntüsüyle kapsayıcıları başlatır/günceller, yöneticiyi açar
#   kur.sh ac        sunucu yeniden başladıktan sonra şifreli veri alanını açar ve uygulamayı başlatır
#   kur.sh durum     durum özeti (disk, kapsayıcılar, son yedek, güncellemeler)
#   kur.sh okuyucu   depolama sunucusunun yedek çekme anahtarını tanımlar (stdin: açık anahtar)
#
# Gizli değerler komut satırından değil standart girdiden, satır satır AD=değer olarak okunur:
#   hazirla: DISK_PAROLASI, APP_SECRET, POSTGRES_PASSWORD, YEDEK_ALICI, SMTP_URL (isteğe bağlı)
#   ac:      DISK_PAROLASI
# Gizli olmayan ayarlar kurulum paketindeki yayin/ayarlar.env dosyasından okunur.
#
# Çıktıdaki "BILGI:", "UYARI:" ve "HATA:" ile başlayan satırlar yayın iş akışında özet olarak gösterilir.
set -Eeuo pipefail
umask 022
export DEBIAN_FRONTEND=noninteractive LC_ALL=C.UTF-8

BAGLAMA=/srv/olcekhane
UYGULAMA=$BAGLAMA/uygulama
ESLEME=olcekhane-veri
# Ek disk yoksa şifreli alan bu dosyada tutulur (boyutu: sistem diskindeki boş alanın %60'ı, en fazla
# 200 GB). Deneme kurulumlarında OLCEKHANE_VERI_DOSYASI ve OLCEKHANE_VERI_GB ile değiştirilebilir.
VERI_DOSYASI=${OLCEKHANE_VERI_DOSYASI:-/var/lib/olcekhane/veri.img}
CONF=/etc/olcekhane.conf
PAKET=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

bilgi() { echo "BILGI: $*"; }
uyari() { echo "UYARI: $*"; }
hata() { echo "HATA: $*"; exit 1; }
trap 'echo "HATA: kur.sh ${KOMUT:-?} satır $LINENO: \"$BASH_COMMAND\" başarısız oldu (çıkış $?)."' ERR

[ "$(id -u)" -eq 0 ] || { echo "HATA: root olarak çalıştırılmalı (sudo)."; exit 1; }

# --- Girdi --------------------------------------------------------------------------------------------

declare -A GIZLI=()
gizlileri_oku() { # izin verilen adlar
  local satir ad deger izinli=" $* "
  while IFS= read -r satir || [ -n "$satir" ]; do
    [ -z "$satir" ] && continue
    ad=${satir%%=*}
    deger=${satir#*=}
    [[ "$izinli" == *" $ad "* ]] || hata "beklenmeyen girdi: $ad"
    GIZLI[$ad]=$deger
  done
}
gerekli() { [ -n "${GIZLI[$1]:-}" ] || hata "$1 verilmedi."; }

# ayarlar.env: yalnızca AD=değer satırları; değerler tırnaksız ya da tek/çift tırnaklı olabilir.
declare -A AYAR=()
ayarlari_oku() {
  local dosya=$PAKET/yayin/ayarlar.env satir ad deger
  [ -f "$dosya" ] || hata "yayin/ayarlar.env kurulum paketinde yok."
  while IFS= read -r satir || [ -n "$satir" ]; do
    satir=${satir%$'\r'}
    [[ "$satir" =~ ^[[:space:]]*(#|$) ]] && continue
    [[ "$satir" =~ ^([A-Z][A-Z0-9_]*)=(.*)$ ]] || hata "ayarlar.env okunamadı: $satir"
    ad=${BASH_REMATCH[1]}
    deger=${BASH_REMATCH[2]}
    if [[ "$deger" =~ ^\'(.*)\'$ ]] || [[ "$deger" =~ ^\"(.*)\"$ ]]; then deger=${BASH_REMATCH[1]}; fi
    AYAR[$ad]=$deger
  done < "$dosya"
}
ayar() { printf '%s' "${AYAR[$1]:-${2:-}}"; }

# .env değeri: Docker Compose'un .env okuyucusu için tırnaklama. Tek tırnak içindeki değer olduğu gibi okunur;
# tek tırnak içeren değer çift tırnağa alınır (bu durumda ", $, \ ve ` içeremez: tirnaklanabilir denetler).
tirnaklanabilir() {
  [[ "$1" != *"'"* ]] || [[ "$1" != *'"'* && "$1" != *'$'* && "$1" != *'\'* && "$1" != *'`'* ]]
}
env_deger() {
  if [[ "$1" != *"'"* ]]; then printf "'%s'" "$1"; else printf '"%s"' "$1"; fi
}

# --- Paketler ve temel güvenlik ----------------------------------------------------------------------

apt_kur() {
  apt-get -o DPkg::Lock::Timeout=900 -y -q -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold install "$@" >/dev/null
}

paketler() {
  . /etc/os-release
  case "${ID:-}:${VERSION_ID:-}" in
    ubuntu:24.04 | ubuntu:26.04) ;;
    ubuntu:22.04) uyari "Ubuntu 22.04 kullanılıyor; 24.04 LTS önerilir." ;;
    *) uyari "Denenmemiş işletim sistemi: ${PRETTY_NAME:-bilinmiyor}. Ubuntu 24.04 LTS önerilir." ;;
  esac
  [ "$(dpkg --print-architecture)" = amd64 ] || hata "Uygulama görüntüsü amd64 için derleniyor; bu sunucunun mimarisi $(dpkg --print-architecture)."
  apt-get -o DPkg::Lock::Timeout=900 -q update >/dev/null
  apt_kur ca-certificates curl cryptsetup ufw age rsync zstd jq unattended-upgrades cron
  # Güvenlik güncellemeleri kendiliğinden kurulur; sunucu kendiliğinden yeniden başlatılmaz (şifreli
  # veri alanı her açılışta parolayla açılmalı: yeniden başlatma bakım iş akışıyla planlanır).
  cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
  cat > /etc/apt/apt.conf.d/52olcekhane-unattended <<'EOF'
Unattended-Upgrade::Automatic-Reboot "false";
EOF
  systemctl enable --now unattended-upgrades.service >/dev/null 2>&1 || true
  timedatectl set-ntp true 2>/dev/null || uyari "Saat eşitlemesi açılamadı (timedatectl)."
  timedatectl set-timezone Europe/Istanbul 2>/dev/null || true
}

# SSH yalnızca anahtarla, root girişi kapalı. Bu betik yonetici hesabının anahtarıyla çalıştırıldığı için
# anahtarla girişin çalıştığı zaten bellidir. Sağlayıcının web konsolu (yerel giriş) etkilenmez.
ssh_sertlestir() {
  local d=/etc/ssh/sshd_config.d/10-olcekhane.conf
  grep -qE '^[[:space:]]*Include[[:space:]]+/etc/ssh/sshd_config\.d/\*\.conf' /etc/ssh/sshd_config ||
    uyari "sshd_config, sshd_config.d klasörünü okumuyor; SSH ayarları uygulanmamış olabilir."
  mkdir -p /etc/ssh/sshd_config.d
  printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin no\n' > "$d.yeni"
  if cmp -s "$d.yeni" "$d"; then
    rm -f "$d.yeni"
  else
    mv "$d.yeni" "$d"
    sshd -t || hata "SSH ayarları geçersiz."
    systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || systemctl restart ssh
    bilgi "SSH: şifreyle ve root hesabıyla giriş kapatıldı (yalnızca anahtar)."
  fi
  if [ "$(sshd -T 2>/dev/null | grep -cE '^(passwordauthentication|permitrootlogin) no$')" != 2 ]; then
    uyari "SSH ayarları beklendiği gibi değil: $(sshd -T 2>/dev/null | grep -E '^(passwordauthentication|permitrootlogin) ' | tr '\n' ' ')"
  fi
}

guvenlik_duvari() {
  ufw allow OpenSSH >/dev/null
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw allow 443/udp >/dev/null
  ufw --force enable >/dev/null
}

docker_kur() {
  if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    . /etc/os-release
    cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: ${UBUNTU_CODENAME:-$VERSION_CODENAME}
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
    apt-get -o DPkg::Lock::Timeout=900 -q update >/dev/null
    apt_kur docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    bilgi "Docker kuruldu: $(docker --version)"
  fi
}

# --- Şifreli veri alanı --------------------------------------------------------------------------------

# Boş ek disk: kök diskten farklı, en az 20 GB, bölümü ve dosya sistemi imzası olmayan, bağlanmamış bir disk.
ek_disk_bul() {
  local kok ad tur boyut
  kok=$(lsblk -no PKNAME "$(findmnt -no SOURCE /)" 2>/dev/null | head -n1)
  while read -r ad tur boyut; do
    [ "$tur" = disk ] || continue
    [ "$ad" = "$kok" ] && continue
    case "$ad" in loop* | sr* | ram* | zram* | fd*) continue ;; esac
    [ "$boyut" -ge $((20 * 1024 * 1024 * 1024)) ] || continue
    [ "$(lsblk -n "/dev/$ad" | wc -l)" -eq 1 ] || continue
    [ -z "$(wipefs -n "/dev/$ad" 2>/dev/null | tail -n +2)" ] || continue
    findmnt -S "/dev/$ad" >/dev/null && continue
    echo "/dev/$ad"
    return 0
  done < <(lsblk -dbn -o NAME,TYPE,SIZE)
  return 1
}

conf_yaz() { # ad değer
  touch "$CONF"
  if grep -q "^$1=" "$CONF"; then sed -i "s#^$1=.*#$1=$2#" "$CONF"; else echo "$1=$2" >> "$CONF"; fi
}

veri_alani() {
  local kaynak="" yeni=0 bos boyut
  mkdir -p "$BAGLAMA"
  if [ -f "$CONF" ]; then kaynak=$(sed -n 's/^VERI_KAYNAK=//p' "$CONF" | tail -n1); fi
  if [ -z "$kaynak" ]; then
    if kaynak=$(ek_disk_bul); then
      bilgi "Şifreli veri alanı için boş ek disk kullanılıyor: $kaynak"
    else
      kaynak=$VERI_DOSYASI
    fi
  fi
  if [ "$kaynak" = "$VERI_DOSYASI" ] && [ ! -e "$kaynak" ]; then
    mkdir -p "$(dirname "$kaynak")"
    chmod 700 "$(dirname "$kaynak")"
    bos=$(df --output=avail -B1G "$(dirname "$kaynak")" | tail -n1 | tr -d ' ')
    boyut=${OLCEKHANE_VERI_GB:-$((bos * 6 / 10))}
    [ "$boyut" -gt 200 ] && boyut=200
    [ "$boyut" -ge "${OLCEKHANE_VERI_EN_AZ_GB:-15}" ] || hata "Sistem diskinde yeterli boş alan yok (${bos} GB boş; şifreli veri alanı için en az 25 GB gerekir)."
    fallocate -l "${boyut}G" "$kaynak"
    chmod 600 "$kaynak"
    bilgi "Şifreli veri alanı dosyası oluşturuldu: $kaynak (${boyut} GB)"
  fi
  [ -e "$kaynak" ] || hata "Şifreli veri alanı bulunamadı: $kaynak"
  if ! cryptsetup isLuks "$kaynak"; then
    # Yalnızca imzası olmayan (boş) bir kaynak biçimlendirilir: veri taşıyan hiçbir şeyin üzerine yazılmaz.
    if [ -n "$(wipefs -n "$kaynak" 2>/dev/null | tail -n +2)" ]; then
      hata "$kaynak boş değil ve LUKS değil; üzerine yazılmadı. Elle inceleyin."
    fi
    printf '%s' "${GIZLI[DISK_PAROLASI]}" | cryptsetup luksFormat --type luks2 --batch-mode --key-file=- "$kaynak"
    yeni=1
  fi
  if [ ! -e "/dev/mapper/$ESLEME" ]; then
    printf '%s' "${GIZLI[DISK_PAROLASI]}" | cryptsetup open --key-file=- "$kaynak" "$ESLEME" 2>/dev/null ||
      hata "Şifreli veri alanı açılamadı: parola uyuşmuyor. ANA_SIFRE kurulumdan sonra değiştirilmiş olabilir."
  fi
  if [ "$yeni" = 1 ]; then
    mkfs.ext4 -q -L "$ESLEME" "/dev/mapper/$ESLEME"
    bilgi "Şifreli veri alanı biçimlendirildi (LUKS2)."
  fi
  mountpoint -q "$BAGLAMA" || mount "/dev/mapper/$ESLEME" "$BAGLAMA"
  # Dosyada tutulan alan dosya yoluyla, disk ise LUKS kimliğiyle kaydedilir (dosyanın döngü aygıtı
  # yeniden başlatmadan sonra yoktur; kimlik bağlantısı yalnızca disk için kalıcıdır).
  if [ -f "$kaynak" ]; then
    conf_yaz VERI_KAYNAK "$kaynak"
  else
    conf_yaz VERI_KAYNAK "/dev/disk/by-uuid/$(cryptsetup luksUUID "$kaynak")"
  fi
  conf_yaz VERI_BAGLAMA "$BAGLAMA"
  chmod 644 "$CONF"

  # Takas alanı: bellek azsa şifreli alanda; sistem diskindeki şifresiz takas kapatılır.
  local ad
  while read -r ad; do
    [ -z "$ad" ] || [ "$ad" = "$BAGLAMA/swapfile" ] && continue
    swapoff "$ad"
    sed -i -E '/^[^#]*[[:space:]]swap[[:space:]]/s/^/# olcekhane (şifresiz takas kapatıldı): /' /etc/fstab
    uyari "Sistem diskindeki şifresiz takas alanı kapatıldı: $ad"
  done < <(swapon --show=NAME --noheadings)
  if [ "$(awk '/MemTotal/ {print int($2/1024/1024 + 0.5)}' /proc/meminfo)" -le 6 ] && [ ! -f "$BAGLAMA/swapfile" ]; then
    fallocate -l 2G "$BAGLAMA/swapfile"
    chmod 600 "$BAGLAMA/swapfile"
    mkswap -q "$BAGLAMA/swapfile" >/dev/null
    bilgi "Şifreli alanda 2 GB takas alanı açıldı."
  fi
  if [ -f "$BAGLAMA/swapfile" ] && ! swapon --show=NAME --noheadings | grep -qx "$BAGLAMA/swapfile"; then
    swapon "$BAGLAMA/swapfile"
  fi
}

docker_ayarla() {
  local istenen degisti=0
  istenen='{ "data-root": "/srv/olcekhane/docker", "features": { "containerd-snapshotter": false } }'
  mkdir -p /etc/docker "$BAGLAMA/docker"
  if [ ! -f /etc/docker/daemon.json ] || [ "$(jq -cS . /etc/docker/daemon.json 2>/dev/null)" != "$(echo "$istenen" | jq -cS .)" ]; then
    echo "$istenen" | jq . > /etc/docker/daemon.json
    degisti=1
  fi
  mkdir -p /etc/systemd/system/docker.service.d
  printf '[Unit]\nConditionPathIsMountPoint=%s\n' "$BAGLAMA" > /etc/systemd/system/docker.service.d/sifreli-disk.conf
  systemctl daemon-reload
  # Docker açılışta kendiliğinden başlamaz: veri alanı açılmadan boş bir klasörle açılmasın.
  systemctl disable docker.service docker.socket >/dev/null 2>&1 || true
  if [ "$degisti" = 1 ]; then
    systemctl stop docker.service docker.socket 2>/dev/null || true
    if [ -d /var/lib/docker ] && [ "$(readlink -f /var/lib/docker)" != "$BAGLAMA/docker" ]; then
      rm -rf /var/lib/docker
    fi
  fi
  systemctl start docker
  local kok
  kok=$(docker info --format '{{.DockerRootDir}}')
  [ "$kok" = "$BAGLAMA/docker" ] || hata "Docker verisi şifreli alanda değil: $kok"
}

# --- Uygulama dosyaları ---------------------------------------------------------------------------------

uygulama_dosyalari() {
  install -d -m 755 "$UYGULAMA" "$UYGULAMA/docker"
  install -d -m 700 "$UYGULAMA/yedekler"
  install -m 644 "$PAKET/docker-compose.yml" "$UYGULAMA/docker-compose.yml"
  install -m 644 "$PAKET/docker/Caddyfile" "$UYGULAMA/docker/Caddyfile"
  install -m 644 "$PAKET/docker/backup.sh" "$UYGULAMA/docker/backup.sh"
  install -m 755 "$PAKET/sunucu/kur.sh" /usr/local/sbin/olcekhane-kur
  install -m 700 "$PAKET/sunucu/olcekhane-ac.sh" /usr/local/sbin/olcekhane-ac
  install -m 700 "$PAKET/sunucu/yedek-kopyala.sh" /usr/local/sbin/olcekhane-yedek-kopyala
  install -m 644 "$PAKET/sunucu/olcekhane.cron" /etc/cron.d/olcekhane
}

env_yaz() {
  local alan site smtp gecici i
  site=$(ayar SITE_DOMAIN)
  [[ "$site" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] || hata "SITE_DOMAIN geçersiz: '$site'"
  [ -n "$(ayar ACME_EMAIL)" ] || hata "ayarlar.env: ACME_EMAIL boş."
  [ -n "$(ayar MAIL_FROM)" ] || hata "ayarlar.env: MAIL_FROM boş."
  local eksik=""
  for alan in COMPANY_LEGAL_NAME COMPANY_ADDRESS COMPANY_MERSIS COMPANY_TAX_OFFICE COMPANY_TAX_NO COMPANY_PHONE \
    COMPANY_EMAIL COMPANY_KVKK_EMAIL COMPANY_KEP; do
    [ -n "$(ayar "$alan")" ] || eksik="$eksik $alan"
  done
  [ -z "$eksik" ] || uyari "Şirket bilgileri eksik (aydınlatma metninde ve site altbilgisinde gösterilir):$eksik"
  smtp=${GIZLI[SMTP_URL]:-}
  [ -n "$smtp" ] || uyari "SMTP bilgileri girilmedi: e-postalar gönderilmez, yalnızca yönetim panelindeki e-posta kutusuna yazılır."

  local -a adlar=(SITE_DOMAIN ACME_EMAIL APP_URL SMTP_URL MAIL_FROM COMPANY_LEGAL_NAME COMPANY_ADDRESS COMPANY_MERSIS
    COMPANY_TAX_OFFICE COMPANY_TAX_NO COMPANY_PHONE COMPANY_EMAIL COMPANY_KVKK_EMAIL COMPANY_KEP ALLOW_INDEXING
    BACKUP_KEEP_DAYS BACKUP_TIME MAIL_RATE_PER_HOUR MAIL_RATE_PER_DAY CADDY_GENEL_AYAR)
  local -a degerler=("$site" "$(ayar ACME_EMAIL)" "https://$site" "$smtp")
  for alan in MAIL_FROM COMPANY_LEGAL_NAME COMPANY_ADDRESS COMPANY_MERSIS COMPANY_TAX_OFFICE COMPANY_TAX_NO \
    COMPANY_PHONE COMPANY_EMAIL COMPANY_KVKK_EMAIL COMPANY_KEP; do
    degerler+=("$(ayar "$alan")")
  done
  degerler+=("$(ayar ALLOW_INDEXING false)" "$(ayar BACKUP_KEEP_DAYS 14)" "$(ayar BACKUP_TIME 03:15)"
    "$(ayar MAIL_RATE_PER_HOUR 90)" "$(ayar MAIL_RATE_PER_DAY 900)" "$(ayar CADDY_GENEL_AYAR)")
  for i in "${!adlar[@]}"; do
    tirnaklanabilir "${degerler[$i]}" ||
      hata "ayarlar.env: ${adlar[$i]} hem tek tırnak hem de \", \$, \\ ya da \` içeriyor; bu karakterlerden birini çıkarın."
  done

  gecici=$(mktemp "$UYGULAMA/.env.XXXXXX")
  chmod 600 "$gecici"
  {
    echo "# Bu dosya yayın iş akışı tarafından yazılır; elle yapılan değişiklikler sonraki yayında kaybolur."
    echo "POSTGRES_PASSWORD=${GIZLI[POSTGRES_PASSWORD]}"
    echo "APP_SECRET=${GIZLI[APP_SECRET]}"
    echo "SCHEDULED_JOBS=true"
    for i in "${!adlar[@]}"; do
      echo "${adlar[$i]}=$(env_deger "${degerler[$i]}")"
    done
  } > "$gecici"
  # Uygulama anahtarı kurulumdan sonra değişmemeli: değişirse öğrenci kodları ve iki aşamalı doğrulama bozulur.
  if [ -f "$UYGULAMA/.env" ]; then
    local eski
    eski=$(sed -n 's/^APP_SECRET=//p' "$UYGULAMA/.env" | tail -n1)
    if [ -n "$eski" ] && [ "$eski" != "${GIZLI[APP_SECRET]}" ]; then
      rm -f "$gecici"
      hata "Sunucudaki uygulama anahtarı yeni türetilenden farklı: ANA_SIFRE değişmiş. Yayın durduruldu; eski ANA_SIFRE'yi geri girin."
    fi
  fi
  mv "$gecici" "$UYGULAMA/.env"
}

yedek_kopyasi_ayarla() {
  conf_yaz YEDEK_ALICI "${GIZLI[YEDEK_ALICI]}"
  conf_yaz YEDEK_OKUYUCU yedekci
  if ! id yedekci >/dev/null 2>&1; then
    useradd --system --create-home --home-dir /home/yedekci --shell /bin/sh yedekci
  fi
  install -d -o root -g root -m 755 /home/yedekci/.ssh
  [ -f /home/yedekci/.ssh/authorized_keys ] || install -o root -g root -m 644 /dev/null /home/yedekci/.ssh/authorized_keys
  # Ayna klasörüne giden yol, okuma hesabının geçebileceği izinlerde olmalı.
  chmod 755 "$BAGLAMA"
}

# --- Komutlar -------------------------------------------------------------------------------------------

komut_hazirla() {
  gizlileri_oku DISK_PAROLASI APP_SECRET POSTGRES_PASSWORD YEDEK_ALICI SMTP_URL
  for a in DISK_PAROLASI APP_SECRET POSTGRES_PASSWORD YEDEK_ALICI; do gerekli "$a"; done
  [[ "${GIZLI[POSTGRES_PASSWORD]}" =~ ^[A-Za-z0-9]+$ ]] || hata "POSTGRES_PASSWORD yalnızca harf ve rakamdan oluşmalı."
  [[ "${GIZLI[YEDEK_ALICI]}" =~ ^age1[a-z0-9]+$ ]] || hata "YEDEK_ALICI geçersiz."
  ayarlari_oku
  paketler
  ssh_sertlestir
  guvenlik_duvari
  docker_kur
  veri_alani
  docker_ayarla
  uygulama_dosyalari
  env_yaz
  yedek_kopyasi_ayarla
  bilgi "Sunucu hazır: $(. /etc/os-release && echo "$PRETTY_NAME"), $(nproc) çekirdek, $(awk '/MemTotal/ {printf "%.1f GB bellek", $2/1024/1024}' /proc/meminfo)."
}

compose() { (cd "$UYGULAMA" && docker compose "$@"); }

uygulama_sagligi() { # saniye
  local i
  for ((i = 0; i < $1; i += 5)); do
    if compose exec -T app node -e "fetch('http://127.0.0.1:3000/api/saglik').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
      return 0
    fi
    sleep 5
  done
  return 1
}

komut_yayinla() {
  ayarlari_oku
  mountpoint -q "$BAGLAMA" || hata "Şifreli veri alanı açık değil."
  systemctl is-active --quiet docker || systemctl start docker
  docker image inspect olcekhane-app:latest >/dev/null 2>&1 || hata "Uygulama görüntüsü yüklenmemiş."
  if compose ps --status running --services 2>/dev/null | grep -qx yedek; then
    if compose exec -T yedek bash /usr/local/bin/yedekle simdi >/dev/null 2>&1; then
      bilgi "Güncellemeden önce veritabanı yedeği alındı."
    else
      uyari "Güncellemeden önce yedek alınamadı; yayına devam edildi."
    fi
  fi
  compose pull --quiet db caddy yedek
  if ! compose up -d --no-build --remove-orphans --wait --wait-timeout 300; then
    compose ps || true
    compose logs --no-color --tail 60 app 2>&1 | sed 's/^/  app: /' || true
    hata "Kapsayıcılar sağlıklı olarak açılmadı."
  fi
  uygulama_sagligi 120 || hata "Uygulama sağlık denetimine yanıt vermiyor."

  local eposta ad sayi
  eposta=$(ayar ADMIN_EMAIL | tr 'A-Z' 'a-z')
  if [ -n "$eposta" ]; then
    [[ "$eposta" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]] || hata "ADMIN_EMAIL geçersiz: $eposta"
    sayi=$(compose exec -T db psql -U olcekhane -d olcekhane -At -v e="$eposta" <<'SQL'
select count(*) from users where email = :'e' and deleted_at is null;
SQL
)
    if [ "$sayi" = 0 ]; then
      ad=$(ayar ADMIN_NAME 'Platform Yöneticisi')
      # Şifre rastgele üretilir ve hiçbir yere yazılmaz: yönetici "Şifremi unuttum" ile kendi şifresini belirler.
      compose exec -T -e ADMIN_EMAIL="$eposta" -e ADMIN_PASSWORD="$(openssl rand -hex 24)" -e ADMIN_NAME="$ad" \
        app node dist/create-admin.mjs >/dev/null
      bilgi "Yönetici hesabı açıldı: $eposta. Şifre belirlemek için sitede \"Şifremi unuttum\" bağlantısını kullanın."
    fi
  fi
  docker image prune -f >/dev/null 2>&1 || true
  bilgi "Uygulama çalışıyor: $(docker image inspect olcekhane-app:latest --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' 2>/dev/null | cut -c1-7)"
}

komut_ac() {
  gizlileri_oku DISK_PAROLASI
  gerekli DISK_PAROLASI
  [ -f "$CONF" ] || hata "$CONF yok: sunucu henüz kurulmamış."
  local kaynak degisti=0
  kaynak=$(sed -n 's/^VERI_KAYNAK=//p' "$CONF" | tail -n1)
  if [ ! -e "/dev/mapper/$ESLEME" ]; then
    printf '%s' "${GIZLI[DISK_PAROLASI]}" | cryptsetup open --key-file=- "$kaynak" "$ESLEME" 2>/dev/null ||
      hata "Şifreli veri alanı açılamadı: parola uyuşmuyor."
    bilgi "Şifreli veri alanı açıldı."
    degisti=1
  fi
  if ! mountpoint -q "$BAGLAMA"; then
    mount "/dev/mapper/$ESLEME" "$BAGLAMA"
    degisti=1
  fi
  if [ -f "$BAGLAMA/swapfile" ] && ! swapon --show=NAME --noheadings | grep -qx "$BAGLAMA/swapfile"; then
    swapon "$BAGLAMA/swapfile"
  fi
  if ! systemctl is-active --quiet docker; then
    systemctl start docker
    bilgi "Docker başlatıldı."
    degisti=1
  fi
  # Veri alanı zaten açık ve Docker çalışıyorsa kapsayıcılara dokunulmaz (sürmekte olan bir yayını bozmamak için).
  if [ "$degisti" = 1 ] && [ -f "$UYGULAMA/docker-compose.yml" ]; then
    compose up -d --no-build --wait --wait-timeout 300 >/dev/null 2>&1 || true
  fi
  if [ -f "$UYGULAMA/docker-compose.yml" ]; then
    if uygulama_sagligi 180; then bilgi "Uygulama çalışıyor."; else hata "Veri alanı açık ama uygulama sağlık denetimine yanıt vermiyor."; fi
  fi
}

komut_durum() {
  echo "disk=$(mountpoint -q "$BAGLAMA" && echo acik || echo kapali)"
  echo "docker=$(systemctl is-active docker 2>/dev/null || true)"
  if mountpoint -q "$BAGLAMA" && systemctl is-active --quiet docker; then
    compose ps --format '{{.Service}}={{.State}}{{if .Health}}/{{.Health}}{{end}}' 2>/dev/null | sed 's/^/kapsayici_/' || true
    local son
    son=$(find "$UYGULAMA/yedekler" -maxdepth 1 -name 'olcekhane-*.dump' -printf '%T@ %f\n' 2>/dev/null | sort -n | tail -n1 || true)
    if [ -n "$son" ]; then
      echo "son_yedek=${son#* } ($(( ($(date +%s) - ${son%%.*}) / 3600 )) saat önce)"
    else
      echo "son_yedek=yok"
    fi
    echo "veri_alani_kullanim=$(df --output=pcent "$BAGLAMA" | tail -n1 | tr -d ' ')"
  fi
  echo "sistem_diski_kullanim=$(df --output=pcent / | tail -n1 | tr -d ' ')"
  echo "yeniden_baslatma_gerekli=$([ -f /var/run/reboot-required ] && echo evet || echo hayir)"
  echo "calisma_suresi=$(uptime -p 2>/dev/null || true)"
}

# Depolama sunucusunun çekme anahtarı: yalnızca o sunucunun adresinden, yalnızca şifreli yedek aynasını
# okumak için kullanılabilir (KURULUM.md, 9.3).
komut_okuyucu() {
  local ip=${1:?depolama sunucusunun IP adresi} anahtar rrsync
  [[ "$ip" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]] || hata "Geçersiz IP adresi: $ip"
  IFS= read -r anahtar
  [[ "$anahtar" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+( [^[:space:]]+)?$ ]] || hata "Geçersiz açık anahtar."
  rrsync=$(command -v rrsync || true)
  if [ -z "$rrsync" ]; then
    for f in /usr/share/doc/rsync/scripts/rrsync /usr/share/doc/rsync/scripts/rrsync.gz; do
      [ -e "$f" ] || continue
      case "$f" in *.gz) gzip -dc "$f" > /usr/local/bin/rrsync ;; *) cp "$f" /usr/local/bin/rrsync ;; esac
      chmod 755 /usr/local/bin/rrsync
      rrsync=/usr/local/bin/rrsync
      break
    done
  fi
  [ -n "$rrsync" ] || hata "rrsync bulunamadı (rsync paketi)."
  mkdir -p "$BAGLAMA/yedek-kopya"
  chgrp yedekci "$BAGLAMA/yedek-kopya"
  chmod 750 "$BAGLAMA/yedek-kopya"
  printf 'from="%s",command="%s -ro -munge %s",restrict %s\n' "$ip" "$rrsync" "$BAGLAMA/yedek-kopya" "$anahtar" > /home/yedekci/.ssh/authorized_keys
  chmod 644 /home/yedekci/.ssh/authorized_keys
  bilgi "Depolama sunucusunun ($ip) yedek çekme anahtarı tanımlandı."
}

KOMUT=${1:-}
shift || true
case "$KOMUT" in
  hazirla) komut_hazirla ;;
  yayinla) komut_yayinla ;;
  ac) komut_ac ;;
  durum) komut_durum ;;
  okuyucu) komut_okuyucu "$@" ;;
  *) echo "kullanım: kur.sh hazirla|yayinla|ac|durum|okuyucu" >&2; exit 2 ;;
esac
