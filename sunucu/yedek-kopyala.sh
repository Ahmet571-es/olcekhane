#!/bin/sh
# Günlük veritabanı yedeklerinin şifreli kopyasını sunucu dışına (Türkiye'deki bir depolama sunucusuna)
# gönderir (KURULUM.md, 9.3). Yedekler age ile, gizli anahtarı sunucuda BULUNMAYAN bir açık anahtara
# şifrelenir. Süresi dolup sunucudan silinen yedeğin kopyası karşı tarafta da silinir (rsync --delete);
# böylece saklama süresi her yerde aynıdır.
#
# Ayarlar /etc/olcekhane.conf dosyasından okunur: YEDEK_ALICI (age açık anahtarı), YEDEK_HEDEF
# (kullanici@sunucu:klasor/) ve YEDEK_SSH_ANAHTARI.
set -eu
. "${OLCEKHANE_CONF:-/etc/olcekhane.conf}"
: "${YEDEK_ALICI:?/etc/olcekhane.conf içinde YEDEK_ALICI tanımlı değil}"
: "${YEDEK_HEDEF:?/etc/olcekhane.conf içinde YEDEK_HEDEF tanımlı değil}"
: "${YEDEK_SSH_ANAHTARI:?/etc/olcekhane.conf içinde YEDEK_SSH_ANAHTARI tanımlı değil}"
BAGLAMA=${VERI_BAGLAMA:-/srv/olcekhane}
KAYNAK=${YEDEK_KAYNAK:-$BAGLAMA/uygulama/yedekler}
AYNA=${YEDEK_AYNA:-$BAGLAMA/yedek-kopya}
umask 077

# Şifreli disk bağlı değilse (sunucu yeniden başlamış, disk açılmamış) ya da hiç yedek yoksa hiçbir şey
# yapılmaz: boş bir klasörle eşitlemek karşıdaki bütün kopyaları silerdi.
if ! mountpoint -q "$BAGLAMA"; then
  echo "[yedek-kopya] veri diski bağlı değil ($BAGLAMA); kopyalama atlandı." >&2
  exit 1
fi
set -- "$KAYNAK"/olcekhane-*.dump
if [ ! -e "$1" ]; then
  echo "[yedek-kopya] $KAYNAK içinde yedek yok; kopyalama atlandı." >&2
  exit 1
fi

mkdir -p "$AYNA"
for f in "$@"; do
  a="$AYNA/$(basename "$f").age"
  if [ ! -e "$a" ]; then
    age -r "$YEDEK_ALICI" -o "$a.part" "$f"
    mv "$a.part" "$a"
  fi
done
for a in "$AYNA"/*; do
  [ -e "$a" ] || continue
  case "$a" in
    *.dump.age) [ -e "$KAYNAK/$(basename "$a" .age)" ] || rm -f "$a" ;;
    *) rm -f "$a" ;; # yarım kalmış şifreleme
  esac
done
rsync -a --delete -e "ssh -i $YEDEK_SSH_ANAHTARI -o BatchMode=yes" "$AYNA"/ "$YEDEK_HEDEF"
echo "[yedek-kopya] $(date '+%Y-%m-%d %H:%M'): $# yedek karşıyla eşitlendi."
