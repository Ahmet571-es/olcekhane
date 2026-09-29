#!/usr/bin/env bash
# Günlük veritabanı yedeği: her gün BACKUP_TIME saatinde (varsayılan 03:15, TZ saat diliminde)
# sıkıştırılmış bir pg_dump alır ve BACKUP_KEEP_DAYS günü dolan yedekleri siler.
#
# KVKK: aydınlatma metni, rızası geri alınan ya da silinen verilerin en geç 30 gün içinde silineceğini
# söyler. Silinen veri, günlük temizlik görevinden (en geç bir gün) sonra yalnızca yedeklerde kalır; bu
# yüzden saklama süresi 28 günü aşamaz. Sunucu dışına kopyalanan yedekler şifrelenmeli ve aynı süreyle
# silinmelidir (bkz. KURULUM.md).
#
# Elle yedek: docker compose exec yedek bash /usr/local/bin/yedekle simdi
set -euo pipefail
umask 077

KEEP="${BACKUP_KEEP_DAYS:-14}"
TIME="${BACKUP_TIME:-03:15}"
DIR="${BACKUP_DIR:-/yedekler}"
if ! [[ "$KEEP" =~ ^[0-9]+$ ]] || [ "$KEEP" -lt 1 ] || [ "$KEEP" -gt 28 ]; then
  echo "[yedek] BACKUP_KEEP_DAYS 1 ile 28 arasında olmalı; 14 kullanılıyor." >&2
  KEEP=14
fi

prune() {
  # Süresi dolan yedekler: KEEP gün eksi bir saatlik pay, böylece KEEP gün önce aynı saatte alınan
  # yedek bir gün daha beklemeden silinir.
  find "$DIR" -maxdepth 1 -name 'olcekhane-*.dump' -mmin +$((KEEP * 1440 - 60)) -print -delete | sed 's/^/[yedek] silindi: /'
  # Yarıda kalmış yedek dosyaları (kapsayıcı yedek alınırken durdurulduysa).
  find "$DIR" -maxdepth 1 -name 'olcekhane-*.dump.part' -mmin +720 -print -delete | sed 's/^/[yedek] yarım dosya silindi: /'
}

backup() {
  local file="$DIR/olcekhane-$(date +%Y%m%d-%H%M%S).dump"
  if pg_dump --format=custom --compress=6 --no-owner --file="$file.part"; then
    mv "$file.part" "$file"
    echo "[yedek] alındı: $(basename "$file") ($(du -h "$file" | cut -f1))"
  else
    rm -f "$file.part"
    echo "[yedek] HATA: yedek alınamadı" >&2
  fi
  prune
}

if [ "${1:-}" = "simdi" ]; then
  backup
  exit 0
fi

echo "[yedek] her gün $TIME saatinde yedek alınacak; $KEEP gün saklanacak."
prune
while true; do
  now=$(date +%s)
  next=$(date -d "today $TIME" +%s)
  [ "$next" -le "$now" ] && next=$(date -d "tomorrow $TIME" +%s)
  sleep $((next - now))
  backup
done
