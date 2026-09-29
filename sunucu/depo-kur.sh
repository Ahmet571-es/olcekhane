#!/usr/bin/env bash
# DEPOLAMA SUNUCUSUNUN kurulumu (KURULUM.md, 9.3'ün otomatik karşılığı). Yayın iş akışı SSH ile çalıştırır:
#   depo-kur.sh <ana sunucunun IP adresi>
# Standart girdi: ana sunucunun SSH sunucu anahtarı satırları (known_hosts biçiminde).
# Tekrar çalıştırılabilir. Çıktının son satırı: ACIK_ANAHTAR=<bu sunucunun yedek çekme anahtarı>
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive LC_ALL=C.UTF-8
trap 'echo "HATA: depo-kur.sh satır $LINENO: \"$BASH_COMMAND\" başarısız oldu (çıkış $?)."' ERR
bilgi() { echo "BILGI: $*"; }
uyari() { echo "UYARI: $*"; }
hata() { echo "HATA: $*"; exit 1; }

[ "$(id -u)" -eq 0 ] || hata "root olarak çalıştırılmalı (sudo)."
ANA=${1:-}
[[ "$ANA" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]] || hata "ana sunucunun IP adresi geçersiz: '$ANA'"
PAKET=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
KLASOR=/srv/olcekhane-yedek
ANAHTAR=/root/.ssh/olcekhane_cek

apt-get -o DPkg::Lock::Timeout=900 -q update >/dev/null
apt-get -o DPkg::Lock::Timeout=900 -y -q -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold \
  install rsync ufw cron unattended-upgrades openssh-client >/dev/null
printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n' > /etc/apt/apt.conf.d/20auto-upgrades
timedatectl set-timezone Europe/Istanbul 2>/dev/null || true
timedatectl set-ntp true 2>/dev/null || true

# SSH yalnızca anahtarla; dışarıya yalnızca SSH açık.
mkdir -p /etc/ssh/sshd_config.d
printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin no\n' > /etc/ssh/sshd_config.d/10-olcekhane.conf.yeni
if ! cmp -s /etc/ssh/sshd_config.d/10-olcekhane.conf.yeni /etc/ssh/sshd_config.d/10-olcekhane.conf; then
  mv /etc/ssh/sshd_config.d/10-olcekhane.conf.yeni /etc/ssh/sshd_config.d/10-olcekhane.conf
  sshd -t || hata "SSH ayarları geçersiz."
  systemctl reload ssh 2>/dev/null || systemctl reload sshd
  bilgi "Depolama sunucusu: SSH yalnızca anahtarla."
else
  rm -f /etc/ssh/sshd_config.d/10-olcekhane.conf.yeni
fi
ufw allow OpenSSH >/dev/null
ufw --force enable >/dev/null

install -m 700 "$PAKET/depo-cek.sh" /usr/local/sbin/olcekhane-depo-cek
install -d -m 700 /root/.ssh "$KLASOR"
[ -f "$ANAHTAR" ] || ssh-keygen -q -t ed25519 -N '' -C olcekhane-depo -f "$ANAHTAR"

# Ana sunucunun anahtarı: yalnızca yayın iş akışının bağlandığı anahtar kabul edilir.
satirlar=$(grep -E "^${ANA}[[:space:]]" || true)
[ -n "$satirlar" ] || hata "ana sunucunun SSH anahtarı verilmedi."
touch /root/.ssh/known_hosts
ssh-keygen -q -R "$ANA" -f /root/.ssh/known_hosts >/dev/null 2>&1 || true
rm -f /root/.ssh/known_hosts.old
printf '%s\n' "$satirlar" >> /root/.ssh/known_hosts
chmod 600 /root/.ssh/known_hosts

cat > /etc/olcekhane-depo.conf <<EOF
DEPO_KAYNAK=yedekci@$ANA:
DEPO_KLASOR=$KLASOR
DEPO_SSH_ANAHTARI=$ANAHTAR
EOF
chmod 644 /etc/olcekhane-depo.conf
echo '0 6 * * * root /usr/local/sbin/olcekhane-depo-cek >> /var/log/olcekhane-depo.log 2>&1' > /etc/cron.d/olcekhane-depo
chmod 644 /etc/cron.d/olcekhane-depo
bilgi "Depolama sunucusu hazır: her gün 06:00'da ana sunucudan ($ANA) şifreli yedek kopyalarını çeker; $KLASOR."
echo "ACIK_ANAHTAR=$(cat "$ANAHTAR.pub")"
