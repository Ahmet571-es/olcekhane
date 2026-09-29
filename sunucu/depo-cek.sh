#!/bin/sh
# DEPOLAMA SUNUCUSUNDA çalışır (KURULUM.md, 9.3): Ölçekhane sunucusundaki şifreli yedek aynasını çeker
# ve saklama süresi dolan kopyaları siler.
#
# Ölçekhane sunucusundaki hesap yalnızca okuyabilir (rrsync -ro -munge); bu sunucuya ait hiçbir anahtar
# Ölçekhane sunucusunda bulunmaz. Var olan kopyaların üzerine hiçbir zaman yazılmaz, bağlantılar
# (symlink) ve yedek adı taşımayan dosyalar alınmaz: Ölçekhane sunucusu ele geçirilse bile buradaki
# kopyalar silinemez ya da değiştirilemez.
#
# Ayarlar /etc/olcekhane-depo.conf dosyasından okunur:
#   DEPO_KAYNAK=yedekci@olcekhane.com:          (Ölçekhane sunucusundaki okuma hesabı)
#   DEPO_KLASOR=/srv/olcekhane-yedek            (kopyaların durduğu klasör)
#   DEPO_SSH_ANAHTARI=/root/.ssh/olcekhane_cek
#   DEPO_SAKLAMA_DK=37440                       (isteğe bağlı; 26 gün: aydınlatma metnindeki 30 günlük
#                                                silme sözü, temizlik görevi ve günlük çalışma payıyla)
set -eu
. "${DEPO_CONF:-/etc/olcekhane-depo.conf}"
: "${DEPO_KAYNAK:?/etc/olcekhane-depo.conf içinde DEPO_KAYNAK tanımlı değil}"
: "${DEPO_KLASOR:?/etc/olcekhane-depo.conf içinde DEPO_KLASOR tanımlı değil}"
: "${DEPO_SSH_ANAHTARI:?/etc/olcekhane-depo.conf içinde DEPO_SSH_ANAHTARI tanımlı değil}"
SAKLAMA_DK=${DEPO_SAKLAMA_DK:-37440}
case "$SAKLAMA_DK" in '' | *[!0-9]*) SAKLAMA_DK=37440 ;; esac
[ "$SAKLAMA_DK" -le 37440 ] || SAKLAMA_DK=37440
umask 077
mkdir -p "$DEPO_KLASOR"

set +e
rsync -rt --ignore-existing --no-links --include='olcekhane-*.dump.age' --exclude='*' \
  -e "ssh -i $DEPO_SSH_ANAHTARI -o BatchMode=yes" "$DEPO_KAYNAK" "$DEPO_KLASOR"/
rc=$?
set -e

# Saklama süresi dolan kopyalar, çekme başarısız olsa da silinir.
find "$DEPO_KLASOR" -maxdepth 1 -type f -name 'olcekhane-*.dump.age' -mmin +"$SAKLAMA_DK" -print -delete | sed 's/^/[depo] silindi: /'
if [ "$rc" -ne 0 ]; then
  echo "[depo] HATA: çekme $rc koduyla bitti." >&2
  exit "$rc"
fi
n=$(find "$DEPO_KLASOR" -maxdepth 1 -type f -name 'olcekhane-*.dump.age' | wc -l)
echo "[depo] $(date '+%Y-%m-%d %H:%M'): $n kopya (saklama $((SAKLAMA_DK / 1440)) gün)."
