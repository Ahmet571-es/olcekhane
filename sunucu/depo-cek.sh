#!/bin/sh
# DEPOLAMA SUNUCUSUNDA çalışır (KURULUM.md, 9.3): Ölçekhane sunucusundaki şifreli yedek aynasını çeker
# ve saklama süresi dolan kopyaları siler.
#
# Ölçekhane sunucusundaki hesap yalnızca okuyabilir (rrsync -ro -munge); bu sunucuya ait hiçbir anahtar
# Ölçekhane sunucusunda bulunmaz. Var olan kopyaların üzerine hiçbir zaman yazılmaz; bağlantılar
# (symlink), yedek adı taşımayan dosyalar ve adındaki tarih saklama aralığı dışında (ör. gelecekte)
# olan dosyalar alınmaz. Saklama süresi dosyanın değiştirilme zamanına değil adındaki tarihe göre
# uygulanır. Böylece Ölçekhane sunucusu ele geçirilse bile buradaki kopyalar silinemez, değiştirilemez,
# gelecekteki yedeklerin adları da önceden kapılamaz.
#
# Ayarlar /etc/olcekhane-depo.conf dosyasından okunur:
#   DEPO_KAYNAK=yedekci@olcekhane.com:          (Ölçekhane sunucusundaki okuma hesabı)
#   DEPO_KLASOR=/srv/olcekhane-yedek            (kopyaların durduğu klasör)
#   DEPO_SSH_ANAHTARI=/root/.ssh/olcekhane_cek
#   DEPO_SAKLAMA_GUN=26                         (isteğe bağlı, en fazla 26: aydınlatma metnindeki 30 günlük
#                                                silme sözü, temizlik görevi ve günlük çalışma payıyla)
set -eu
. "${DEPO_CONF:-/etc/olcekhane-depo.conf}"
: "${DEPO_KAYNAK:?/etc/olcekhane-depo.conf içinde DEPO_KAYNAK tanımlı değil}"
: "${DEPO_KLASOR:?/etc/olcekhane-depo.conf içinde DEPO_KLASOR tanımlı değil}"
: "${DEPO_SSH_ANAHTARI:?/etc/olcekhane-depo.conf içinde DEPO_SSH_ANAHTARI tanımlı değil}"
GUN=${DEPO_SAKLAMA_GUN:-26}
case "$GUN" in '' | *[!0-9]*) GUN=26 ;; esac
[ "$GUN" -ge 1 ] && [ "$GUN" -le 26 ] || GUN=26
umask 077
mkdir -p "$DEPO_KLASOR"
BUGUN=$(date +%Y%m%d)
SINIR=$(date -d "-$GUN days" +%Y%m%d)

# Yalnızca saklama aralığındaki günlerin (SINIR..BUGÜN) yedek adları alınır.
KURALLAR=$(mktemp)
trap 'rm -f "$KURALLAR"' EXIT
i=0
while [ "$i" -le "$GUN" ]; do
  echo "+ olcekhane-$(date -d "-$i days" +%Y%m%d)-*.dump.age" >> "$KURALLAR"
  i=$((i + 1))
done
echo '- *' >> "$KURALLAR"

set +e
rsync -rt --ignore-existing --no-links --filter=". $KURALLAR" \
  -e "ssh -i $DEPO_SSH_ANAHTARI -o BatchMode=yes" "$DEPO_KAYNAK" "$DEPO_KLASOR"/
rc=$?
set -e

# Saklama: adındaki tarih SINIR'dan eski (ya da bugünden ileri, ya da okunamayan) kopyalar silinir; çekme
# başarısız olsa da.
n=0
for f in "$DEPO_KLASOR"/olcekhane-*.dump.age; do
  [ -e "$f" ] || [ -L "$f" ] || continue
  ad=$(basename "$f")
  gun=${ad#olcekhane-}
  gun=${gun%%-*}
  case "$gun" in
    [0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]) ;;
    *) gun=0 ;;
  esac
  if [ -L "$f" ] || [ ! -f "$f" ] || [ "$gun" -lt "$SINIR" ] || [ "$gun" -gt "$BUGUN" ]; then
    rm -f "$f"
    echo "[depo] silindi: $ad"
  else
    n=$((n + 1))
  fi
done
if [ "$rc" -ne 0 ]; then
  echo "[depo] HATA: çekme $rc koduyla bitti." >&2
  exit "$rc"
fi
echo "[depo] $(date '+%Y-%m-%d %H:%M'): $n kopya (saklama $GUN gün)."
