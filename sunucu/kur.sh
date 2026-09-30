#!/usr/bin/env bash
# Ölçekhane sunucu kurulumu ve işletimi. GitHub'daki yayın iş akışı (yayin/yayinla.sh) SSH ile çalıştırır;
# KURULUM.md'deki elle kurulumun otomatik karşılığıdır. Her komut tekrar tekrar çalıştırılabilir: yalnızca
# eksik olan yapılır.
#
#   kur.sh hazirla   paketler, güvenlik duvarı, takasın ve bellek dökümlerinin kapatılması, Docker, ayarlar
#                    (.env), betikler
#   kur.sh yayinla   yüklenmiş uygulama görüntüsüyle kapsayıcıları başlatır ya da günceller
#   kur.sh baslat    kapsayıcıları (durmuşlarsa) yeniden başlatır
#   kur.sh durum     durum özeti (disk, kapsayıcılar, güncellemeler)
#
# Sitede veritabanı yoktur ve hiçbir şey saklanmaz; bu yüzden sunucuda gizli değer (parola, anahtar)
# tutulmaz. Ayarlar kurulum paketindeki yayin/ayarlar.env dosyasından okunur (gizli bilgi içermez).
#
# Çıktıdaki "BILGI:", "UYARI:" ve "HATA:" ile başlayan satırlar yayın iş akışında özet olarak gösterilir.
set -Eeuo pipefail
umask 022
export DEBIAN_FRONTEND=noninteractive LC_ALL=C.UTF-8

UYGULAMA=/srv/olcekhane
PAKET=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

bilgi() { echo "BILGI: $*"; }
uyari() { echo "UYARI: $*"; }
hata() { echo "HATA: $*"; exit 1; }
trap 'echo "HATA: kur.sh ${KOMUT:-?} satır $LINENO: \"$BASH_COMMAND\" başarısız oldu (çıkış $?)."' ERR

[ "$(id -u)" -eq 0 ] || { echo "HATA: root olarak çalıştırılmalı (sudo)."; exit 1; }

# --- Ayarlar ------------------------------------------------------------------------------------------

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
  apt_kur ca-certificates curl ufw zstd jq unattended-upgrades cron
  # Güvenlik güncellemeleri kendiliğinden kurulur. Çekirdek güncellemesi gibi yeniden başlatma gerektiren
  # bir güncelleme olursa sunucu gece 04:30'da (Türkiye saati) kendiliğinden yeniden başlar; Docker ve
  # kapsayıcılar açılışta kendiliğinden başlar.
  cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
  cat > /etc/apt/apt.conf.d/52olcekhane-unattended <<'EOF'
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:30";
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

# Güvenlik duvarı: yalnızca SSH, HTTP ve HTTPS. Engellenen bağlantılar günlüğe yazılmaz (aydınlatma metni:
# ziyaretlerin ve bağlantıların kaydı tutulmaz).
guvenlik_duvari() {
  ufw allow OpenSSH >/dev/null
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw allow 443/udp >/dev/null
  ufw logging off >/dev/null
  ufw --force enable >/dev/null
}

# Takas alanı kapatılır: uygulama işlediği test cevaplarını yalnızca bellekte tutar; takas açık olsaydı
# bellek sayfaları diske yazılabilirdi. Sitenin bellek ihtiyacı küçüktür (yaklaşık 200 MB).
takas_kapat() {
  local ad
  while read -r ad; do
    [ -z "$ad" ] && continue
    swapoff "$ad"
    uyari "Takas alanı kapatıldı: $ad"
  done < <(swapon --show=NAME --noheadings)
  if grep -qE '^[^#]*[[:space:]]swap[[:space:]]' /etc/fstab; then
    sed -i -E '/^[^#]*[[:space:]]swap[[:space:]]/s/^/# olcekhane (takas kapatıldı): /' /etc/fstab
  fi
  # Bazı sağlayıcı görüntülerinde takas, systemd birimiyle ya da açılış betikleriyle açılır.
  systemctl mask --now swap.target >/dev/null 2>&1 || true
}

# Bir süreç çökerse belleğinin dökümü (core dump; içinde işlenmekte olan test cevapları olabilir) diske
# yazılmaz: dökümler bir boru üzerinden hiçbir şey yapmayan bir programa verilir. Ubuntu'nun çökme raporlayıcısı
# (apport) açılışta bu ayarı değiştirdiği için kapatılır.
bellek_dokumu_kapat() {
  systemctl disable --now apport.service >/dev/null 2>&1 || true
  systemctl mask apport.service >/dev/null 2>&1 || true
  printf 'kernel.core_pattern=|/bin/false\nfs.suid_dumpable=0\n' > /etc/sysctl.d/60-olcekhane.conf
  sysctl -q -p /etc/sysctl.d/60-olcekhane.conf
  [ "$(cat /proc/sys/kernel/core_pattern)" = '|/bin/false' ] ||
    uyari "Bellek dökümü ayarı uygulanamadı: $(cat /proc/sys/kernel/core_pattern)"
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
  # Açılışta kendiliğinden başlar; kapsayıcılar da (restart: unless-stopped) onunla birlikte açılır.
  systemctl enable --now docker.service docker.socket >/dev/null 2>&1 || systemctl start docker
}

# --- Uygulama dosyaları ---------------------------------------------------------------------------------

uygulama_dosyalari() {
  install -d -m 755 "$UYGULAMA" "$UYGULAMA/docker"
  install -m 644 "$PAKET/docker-compose.yml" "$UYGULAMA/docker-compose.yml"
  install -m 644 "$PAKET/docker/Caddyfile" "$UYGULAMA/docker/Caddyfile"
  install -m 755 "$PAKET/sunucu/kur.sh" /usr/local/sbin/olcekhane-kur
}

env_yaz() {
  local alan site gecici i
  site=$(ayar SITE_DOMAIN)
  [[ "$site" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] || hata "SITE_DOMAIN geçersiz: '$site'"
  [ -n "$(ayar ACME_EMAIL)" ] || hata "ayarlar.env: ACME_EMAIL boş."
  # Site sahibinin bilgileri (src/lib/site.ts). İlk dördü yasa gereği (5651 sayılı Kanun'a dayanan yönetmelik,
  # m.5) İletişim sayfasında gösterilir: bunlar boşken site arama motorlarına açılmaz.
  local -a sahip=(OWNER_NAME OWNER_ADDRESS OWNER_PHONE OWNER_EMAIL OWNER_KVKK_EMAIL OWNER_KEP OWNER_TAX_OFFICE
    OWNER_TAX_NO)
  local eksik=""
  for alan in "${sahip[@]:0:4}"; do
    [ -n "$(ayar "$alan")" ] || eksik="$eksik $alan"
  done
  if [ -n "$eksik" ]; then
    # Uygulama "false" dışındaki her değeri "arama motorlarına açık" sayar (src/lib/seo.ts).
    local indeksleme
    indeksleme=$(ayar ALLOW_INDEXING false)
    [ "${indeksleme,,}" = false ] ||
      hata "ayarlar.env: site sahibinin bilgileri eksik, site arama motorlarına açılamaz (ALLOW_INDEXING=$indeksleme):$eksik"
    uyari "Site sahibinin bilgileri eksik (yasa gereği İletişim sayfasında gösterilir):$eksik"
  fi

  local -a adlar=(SITE_DOMAIN ACME_EMAIL APP_URL "${sahip[@]}" ALLOW_INDEXING CADDY_GENEL_AYAR)
  local -a degerler=("$site" "$(ayar ACME_EMAIL)" "https://$site")
  for alan in "${sahip[@]}"; do
    degerler+=("$(ayar "$alan")")
  done
  degerler+=("$(ayar ALLOW_INDEXING false)" "$(ayar CADDY_GENEL_AYAR)")
  for i in "${!adlar[@]}"; do
    tirnaklanabilir "${degerler[$i]}" ||
      hata "ayarlar.env: ${adlar[$i]} hem tek tırnak hem de \", \$, \\ ya da \` içeriyor; bu karakterlerden birini çıkarın."
  done

  gecici=$(mktemp "$UYGULAMA/.env.XXXXXX")
  chmod 600 "$gecici"
  {
    echo "# Bu dosya yayın iş akışı tarafından yazılır; elle yapılan değişiklikler sonraki yayında kaybolur."
    for i in "${!adlar[@]}"; do
      echo "${adlar[$i]}=$(env_deger "${degerler[$i]}")"
    done
  } > "$gecici"
  mv "$gecici" "$UYGULAMA/.env"
}

# --- Komutlar -------------------------------------------------------------------------------------------

komut_hazirla() {
  ayarlari_oku
  paketler
  ssh_sertlestir
  guvenlik_duvari
  takas_kapat
  bellek_dokumu_kapat
  docker_kur
  uygulama_dosyalari
  env_yaz
  bilgi "Sunucu hazır: $(. /etc/os-release && echo "$PRETTY_NAME"), $(nproc) çekirdek, $(awk '/MemTotal/ {printf "%.1f GB bellek", $2/1024/1024}' /proc/meminfo)."
}

compose() { (cd "$UYGULAMA" && docker compose "$@"); }

uygulama_sagligi() { # saniye
  local i
  for ((i = 0; i < $1; i += 5)); do
    # Takılmış bir uygulama denetimi de bekletmesin: istek 5, komutun tamamı 15 saniyede kesilir.
    if (cd "$UYGULAMA" && timeout 15 docker compose exec -T app node -e \
      "fetch('http://127.0.0.1:3000/api/saglik',{signal:AbortSignal.timeout(5000)}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))") >/dev/null 2>&1; then
      return 0
    fi
    sleep 5
  done
  return 1
}

komut_yayinla() {
  systemctl is-active --quiet docker || systemctl start docker
  docker image inspect olcekhane-app:latest >/dev/null 2>&1 || hata "Uygulama görüntüsü yüklenmemiş."
  compose pull --quiet caddy
  if ! compose up -d --no-build --remove-orphans --wait --wait-timeout 300; then
    compose ps || true
    compose logs --no-color --tail 60 app 2>&1 | sed 's/^/  app: /' || true
    hata "Kapsayıcılar sağlıklı olarak açılmadı."
  fi
  uygulama_sagligi 120 || hata "Uygulama sağlık denetimine yanıt vermiyor."
  docker image prune -f >/dev/null 2>&1 || true
  bilgi "Uygulama çalışıyor: $(docker image inspect olcekhane-app:latest --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' 2>/dev/null | cut -c1-7)"
}

# Durmuş kapsayıcıları açar; uygulama çalıştığı hâlde yanıt vermiyorsa (takıldıysa) yeniden başlatır.
komut_baslat() {
  [ -f "$UYGULAMA/docker-compose.yml" ] || hata "Uygulama henüz kurulmamış."
  systemctl is-active --quiet docker || { systemctl start docker; bilgi "Docker başlatıldı."; }
  compose up -d --no-build >/dev/null 2>&1 || uyari "Kapsayıcılar açılırken hata oluştu: $(compose up -d --no-build 2>&1 | tail -n 3 | tr '\n' ' ')"
  if uygulama_sagligi 60; then
    bilgi "Uygulama çalışıyor."
    return 0
  fi
  uyari "Uygulama yanıt vermiyor; uygulama ve Caddy yeniden başlatılıyor."
  compose restart app caddy >/dev/null 2>&1 || true
  if uygulama_sagligi 120; then bilgi "Uygulama yeniden başlatıldı ve çalışıyor."; else hata "Uygulama yeniden başlatıldı ama sağlık denetimine yanıt vermiyor."; fi
}

komut_durum() {
  echo "docker=$(systemctl is-active docker 2>/dev/null || true)"
  if systemctl is-active --quiet docker && [ -f "$UYGULAMA/docker-compose.yml" ]; then
    compose ps --format '{{.Service}}={{.State}}{{if .Health}}/{{.Health}}{{end}}' 2>/dev/null | sed 's/^/kapsayici_/' || true
  fi
  echo "takas=$(swapon --show=NAME --noheadings | wc -l | tr -d ' ') alan"
  echo "bellek_dokumu=$(cat /proc/sys/kernel/core_pattern)"
  echo "sistem_diski_kullanim=$(df --output=pcent / | tail -n1 | tr -d ' ')"
  echo "yeniden_baslatma_gerekli=$([ -f /var/run/reboot-required ] && echo evet || echo hayir)"
  echo "calisma_suresi=$(uptime -p 2>/dev/null || true)"
}

KOMUT=${1:-}
shift || true
case "$KOMUT" in
  hazirla) komut_hazirla ;;
  yayinla) komut_yayinla ;;
  baslat) komut_baslat ;;
  durum) komut_durum ;;
  *) echo "kullanım: kur.sh hazirla|yayinla|baslat|durum" >&2; exit 2 ;;
esac
