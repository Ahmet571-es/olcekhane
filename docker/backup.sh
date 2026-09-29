#!/usr/bin/env bash
# Günlük veritabanı yedeği: her gün BACKUP_TIME saatinde (varsayılan 03:15, TZ saat diliminde)
# sıkıştırılmış bir pg_dump alır ve BACKUP_KEEP_DAYS günden eski yedekleri siler.
#
# KVKK: rızası geri alınan ya da silinen verilerin en geç 30 gün içinde yedeklerden de çıkması için
# saklama süresi 30 günü aşamaz. Sunucu dışına kopyalanan yedekler şifrelenmeli ve aynı süreyle
# silinmelidir (bkz. KURULUM.md).
set -euo pipefail
umask 077

KEEP="${BACKUP_KEEP_DAYS:-14}"
TIME="${BACKUP_TIME:-03:15}"
DIR="${BACKUP_DIR:-/yedekler}"
if ! [[ "$KEEP" =~ ^[0-9]+$ ]] || [ "$KEEP" -lt 1 ] || [ "$KEEP" -gt 30 ]; then
  echo "[yedek] BACKUP_KEEP_DAYS 1 ile 30 arasında olmalı; 14 kullanılıyor." >&2
  KEEP=14
fi

backup() {
  local file="$DIR/olcekhane-$(date +%Y%m%d-%H%M%S).dump"
  if pg_dump --format=custom --compress=6 --no-owner --file="$file.part"; then
    mv "$file.part" "$file"
    echo "[yedek] alındı: $(basename "$file") ($(du -h "$file" | cut -f1))"
  else
    rm -f "$file.part"
    echo "[yedek] HATA: yedek alınamadı" >&2
  fi
  find "$DIR" -maxdepth 1 -name 'olcekhane-*.dump' -mtime +"$((KEEP - 1))" -print -delete | sed 's/^/[yedek] silindi: /'
}

if [ "${1:-}" = "simdi" ]; then
  backup
  exit 0
fi

echo "[yedek] her gün $TIME saatinde yedek alınacak; $KEEP gün saklanacak."
while true; do
  now=$(date +%s)
  next=$(date -d "today $TIME" +%s)
  [ "$next" -le "$now" ] && next=$(date -d "tomorrow $TIME" +%s)
  sleep $((next - now))
  backup
done
