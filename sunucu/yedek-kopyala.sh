#!/bin/sh
# Günlük veritabanı yedeklerinin şifreli kopyası (KURULUM.md, 9.3). Yedekler age ile, gizli anahtarı
# sunucuda BULUNMAYAN bir açık anahtara şifrelenip bir aynaya (YEDEK_AYNA) yazılır; aynadaki kopya,
# yerel yedek silinince silinir.
#
# Kopyaların sunucu dışına çıkışı iki yoldan biriyle olur:
#   Çekme (önerilen, YEDEK_HEDEF boş): depolama sunucusu aynayı kendisi çeker. Bu sunucu için ayrılan
#     kullanıcının anahtarı yalnızca okumaya izin verir (rrsync -ro -munge); depolama sunucusuna ait
#     hiçbir anahtar bu sunucuda bulunmaz. Bu sunucu ele geçirilse bile depodaki kopyalar silinemez ya
#     da değiştirilemez. Saklama süresini depolama sunucusundaki görev uygular.
#   Gönderme (YEDEK_HEDEF dolu): bu betik kopyaları rsync ile gönderir ve saklama süresi dolanları
#     karşıda siler. Yalnızca olcekhane-*.dump.age dosyalarına dokunulur; saklama süresi içindeki
#     kopyalar, sunucuda karşılığı olmasa da (ör. yeni kurulmuş sunucu) silinmez; bir çalışmada en fazla
#     10 dosya silinir. Bu sunucunun anahtarı karşıda yazma ve silme yetkisine sahip olduğu için sunucu
#     ele geçirilirse karşıdaki kopyalar da silinebilir.
#
# Ayarlar /etc/olcekhane.conf dosyasından okunur: YEDEK_ALICI (age açık anahtarı); çekmede YEDEK_OKUYUCU
# (depolama sunucusunun bağlandığı kullanıcının grubu); göndermede YEDEK_HEDEF (kullanici@sunucu:klasor/)
# ve YEDEK_SSH_ANAHTARI.
set -eu
# shellcheck source=/dev/null
. "${OLCEKHANE_CONF:-/etc/olcekhane.conf}"
: "${YEDEK_ALICI:?/etc/olcekhane.conf içinde YEDEK_ALICI tanımlı değil}"
BAGLAMA=${VERI_BAGLAMA:-/srv/olcekhane}
KAYNAK=${YEDEK_KAYNAK:-$BAGLAMA/uygulama/yedekler}
AYNA=${YEDEK_AYNA:-$BAGLAMA/yedek-kopya}
GECICI=${YEDEK_GECICI:-$BAGLAMA/.yedek-kopya-gecici}
UYGULAMA_ENV=${UYGULAMA_ENV:-$BAGLAMA/uygulama/.env}
HEDEF=${YEDEK_HEDEF:-}
OKUYUCU=${YEDEK_OKUYUCU:-}
umask 077

# Şifreli disk bağlı değilse (sunucu yeniden başlamış, disk açılmamış) ya da hiç yedek yoksa hiçbir şey
# yapılmaz.
if ! mountpoint -q "$BAGLAMA"; then
  echo "[yedek-kopya] veri diski bağlı değil ($BAGLAMA); atlandı." >&2
  exit 1
fi
set -- "$KAYNAK"/olcekhane-*.dump
if [ ! -e "$1" ]; then
  echo "[yedek-kopya] $KAYNAK içinde yedek yok; atlandı." >&2
  exit 1
fi

# Ayna: yeni yedekler şifrelenir (önce geçici klasöre, sonra tek adımda aynaya: çeken taraf yarım dosya
# görmez); yerelde silinmiş yedeklerin kopyası aynadan da silinir.
mkdir -p "$AYNA" "$GECICI"
if [ -n "$OKUYUCU" ]; then
  chgrp "$OKUYUCU" "$AYNA"
  chmod 750 "$AYNA"
fi
for f in "$@"; do
  a="$AYNA/$(basename "$f").age"
  [ -e "$a" ] && continue
  t="$GECICI/$(basename "$a")"
  age -r "$YEDEK_ALICI" -o "$t" "$f"
  if [ -n "$OKUYUCU" ]; then
    chgrp "$OKUYUCU" "$t"
    chmod 640 "$t"
  fi
  mv "$t" "$a"
done
# Yalnızca yedek kopyası adındaki dosyalara dokunulur (ayar yanlışlıkla başka bir klasörü gösterse de
# oradaki dosyalar silinmez).
rm -f "$GECICI"/olcekhane-*.dump.age
for a in "$AYNA"/olcekhane-*.dump.age; do
  [ -e "$a" ] || [ -L "$a" ] || continue
  if [ -L "$a" ] || [ ! -e "$KAYNAK/$(basename "$a" .age)" ]; then rm -f "$a"; fi
done

if [ -z "$HEDEF" ]; then
  echo "[yedek-kopya] $(date '+%Y-%m-%d %H:%M'): $# yedek aynada; depolama sunucusu çekecek."
  exit 0
fi

# Gönderme kipi.
: "${YEDEK_SSH_ANAHTARI:?/etc/olcekhane.conf içinde YEDEK_SSH_ANAHTARI tanımlı değil}"
# Saklama süresi uygulamanın ayarından (BACKUP_KEEP_DAYS, 1–28, varsayılan 14) okunur.
KEEP=$(sed -n 's/^BACKUP_KEEP_DAYS=\([0-9][0-9]*\).*/\1/p' "$UYGULAMA_ENV" 2>/dev/null | tail -n 1)
case "$KEEP" in '' | *[!0-9]*) KEEP=14 ;; esac
[ "$KEEP" -ge 1 ] && [ "$KEEP" -le 28 ] || KEEP=14

# rsync kuralları: saklama süresi içindeki günlerin kopyaları korunur (P), yalnızca yedek kopyaları
# aktarılır ve silinebilir (+), karşı klasördeki başka hiçbir dosyaya dokunulmaz (-).
KURALLAR=$(mktemp)
trap 'rm -f "$KURALLAR"' EXIT
i=0
while [ "$i" -lt "$KEEP" ]; do
  echo "P olcekhane-$(date -d "-$i days" +%Y%m%d)-*" >> "$KURALLAR"
  i=$((i + 1))
done
printf '%s\n' '+ olcekhane-*.dump.age' '- *' >> "$KURALLAR"

set +e
rsync -rt --delete --max-delete=10 --filter=". $KURALLAR" -e "ssh -i $YEDEK_SSH_ANAHTARI -o BatchMode=yes" "$AYNA"/ "$HEDEF"
rc=$?
set -e
if [ "$rc" -eq 25 ]; then
  echo "[yedek-kopya] UYARI: bu çalışmada silme sınırına (10 dosya) ulaşıldı; kalan eski kopyalar sonraki çalışmalarda silinecek." >&2
elif [ "$rc" -ne 0 ]; then
  echo "[yedek-kopya] HATA: rsync $rc koduyla bitti." >&2
  exit "$rc"
fi
echo "[yedek-kopya] $(date '+%Y-%m-%d %H:%M'): $# yedek karşıyla eşitlendi (saklama $KEEP gün)."
