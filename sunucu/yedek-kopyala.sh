#!/bin/sh
# Günlük veritabanı yedeklerinin şifreli kopyasını sunucu dışına (Türkiye'deki bir depolama sunucusuna)
# gönderir (KURULUM.md, 9.3). Yedekler age ile, gizli anahtarı sunucuda BULUNMAYAN bir açık anahtara
# şifrelenir.
#
# Karşı taraftaki kopyaların silinmesi (YEDEK_KARSIDA_SIL):
#   evet  (varsayılan) Saklama süresi dolan kopyalar bu betikle silinir. Yalnızca olcekhane-*.dump.age
#         dosyalarına dokunulur; saklama süresi içindeki kopyalar, sunucuda karşılığı olmasa da (ör. yeni
#         kurulmuş sunucu) silinmez; bir çalışmada en fazla 10 dosya silinir.
#   hayir Betik yalnızca ekler, hiçbir şey silmez. Karşı sunucuda anahtar yalnızca yazmaya izin verecek
#         biçimde kısıtlanır (rrsync -wo -no-del) ve süresi dolan kopyaları orada çalışan bir görev siler;
#         bu sunucu ele geçirilse bile karşıdaki kopyalar silinemez.
#
# Ayarlar /etc/olcekhane.conf dosyasından okunur: YEDEK_ALICI (age açık anahtarı), YEDEK_HEDEF
# (kullanici@sunucu:klasor/), YEDEK_SSH_ANAHTARI, isteğe bağlı YEDEK_KARSIDA_SIL.
set -eu
. "${OLCEKHANE_CONF:-/etc/olcekhane.conf}"
: "${YEDEK_ALICI:?/etc/olcekhane.conf içinde YEDEK_ALICI tanımlı değil}"
: "${YEDEK_HEDEF:?/etc/olcekhane.conf içinde YEDEK_HEDEF tanımlı değil}"
: "${YEDEK_SSH_ANAHTARI:?/etc/olcekhane.conf içinde YEDEK_SSH_ANAHTARI tanımlı değil}"
BAGLAMA=${VERI_BAGLAMA:-/srv/olcekhane}
KAYNAK=${YEDEK_KAYNAK:-$BAGLAMA/uygulama/yedekler}
AYNA=${YEDEK_AYNA:-$BAGLAMA/yedek-kopya}
UYGULAMA_ENV=${UYGULAMA_ENV:-$BAGLAMA/uygulama/.env}
umask 077

# Şifreli disk bağlı değilse (sunucu yeniden başlamış, disk açılmamış) ya da hiç yedek yoksa hiçbir şey
# yapılmaz.
if ! mountpoint -q "$BAGLAMA"; then
  echo "[yedek-kopya] veri diski bağlı değil ($BAGLAMA); kopyalama atlandı." >&2
  exit 1
fi
set -- "$KAYNAK"/olcekhane-*.dump
if [ ! -e "$1" ]; then
  echo "[yedek-kopya] $KAYNAK içinde yedek yok; kopyalama atlandı." >&2
  exit 1
fi

# Saklama süresi uygulamanın ayarından (BACKUP_KEEP_DAYS, 1–28, varsayılan 14) okunur.
KEEP=$(sed -n 's/^BACKUP_KEEP_DAYS=\([0-9][0-9]*\).*/\1/p' "$UYGULAMA_ENV" 2>/dev/null | tail -n 1)
case "$KEEP" in '' | *[!0-9]*) KEEP=14 ;; esac
[ "$KEEP" -ge 1 ] && [ "$KEEP" -le 28 ] || KEEP=14

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

SSH="ssh -i $YEDEK_SSH_ANAHTARI -o BatchMode=yes"
set +e
if [ "${YEDEK_KARSIDA_SIL:-evet}" = "hayir" ]; then
  rsync -a --filter=". $KURALLAR" -e "$SSH" "$AYNA"/ "$YEDEK_HEDEF"
else
  rsync -a --delete --max-delete=10 --filter=". $KURALLAR" -e "$SSH" "$AYNA"/ "$YEDEK_HEDEF"
fi
rc=$?
set -e
if [ "$rc" -eq 25 ]; then
  echo "[yedek-kopya] UYARI: bu çalışmada silme sınırına (10 dosya) ulaşıldı; kalan eski kopyalar sonraki çalışmalarda silinecek." >&2
elif [ "$rc" -ne 0 ]; then
  echo "[yedek-kopya] HATA: rsync $rc koduyla bitti." >&2
  exit "$rc"
fi
echo "[yedek-kopya] $(date '+%Y-%m-%d %H:%M'): $# yedek karşıyla eşitlendi (saklama $KEEP gün)."
