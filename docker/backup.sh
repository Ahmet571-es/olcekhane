#!/usr/bin/env bash
# Günlük veritabanı yedeği: her gün BACKUP_TIME saatinde (varsayılan 03:15, TZ saat diliminde)
# sıkıştırılmış bir pg_dump alır ve BACKUP_KEEP_DAYS günü dolan yedekleri siler.
#
# KVKK: aydınlatma metni, rızası geri alınan ya da silinen verilerin en geç 30 gün içinde silineceğini
# söyler. Silinen veri, günlük temizlik görevinden (en geç bir gün) sonra yalnızca yedeklerde kalır; bu
# yüzden saklama süresi 28 günü aşamaz. Sunucu dışına kopyalanan yedekler şifrelenmeli ve aynı süreyle
# silinmelidir (bkz. KURULUM.md).
#
# Güvenlik ağı: eski yedekler yalnızca yeni yedek başarıyla alındıktan sonra silinir ve en yeni yedek
# hiçbir zaman silinmez; yedek art arda alınamazsa eldeki yedekler kaybolmaz. Her çalışma veritabanındaki
# görev kaydına (job_runs, "yedek") yazılır; yönetim panelindeki hazırlık listesi son başarılı yedeği
# gösterir ve 36 saatten eskiyse uyarır.
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

# Çalışmayı görev kaydına yazar. Yazılamazsa (veritabanı kapalı) yalnızca uyarır; yedekleme sürer.
record() { # $1 başarılı mı (true/false), $2 başlangıç (epoch), $3 bayt, $4 hata
  psql -X -q -v ON_ERROR_STOP=1 -v ok="$1" -v started="$2" -v bytes="$3" -v err="$4" -v trig="$TRIGGER" >/dev/null <<'SQL' ||
insert into job_runs (job, trigger, started_at, finished_at, ok, report, error)
values ('yedek', :'trig', to_timestamp(:'started'), now(), :'ok'::boolean,
        case when :'bytes' = '' then null else jsonb_build_object('bayt', nullif(:'bytes', '')::bigint) end,
        nullif(:'err', ''));
SQL
    echo "[yedek] UYARI: çalışma kaydı veritabanına yazılamadı" >&2
}

# Süresi dolan yedekler: KEEP gün eksi bir saatlik pay (böylece KEEP gün önce aynı saatte alınan yedek bir
# gün daha beklemeden silinir). En yeni yedek her durumda kalır.
prune() {
  local newest
  newest="$(find "$DIR" -maxdepth 1 -name 'olcekhane-*.dump' -printf '%f\n' | sort | tail -n 1)"
  find "$DIR" -maxdepth 1 -name 'olcekhane-*.dump' ! -name "${newest:-yok}" -mmin +$((KEEP * 1440 - 60)) -print -delete | sed 's/^/[yedek] silindi: /'
  # Yarıda kalmış yedek dosyaları (kapsayıcı yedek alınırken durdurulduysa).
  find "$DIR" -maxdepth 1 -name 'olcekhane-*.dump.part' -mmin +720 -print -delete | sed 's/^/[yedek] yarım dosya silindi: /'
}

backup() {
  local started file bytes err
  started="$(date +%s)"
  file="$DIR/olcekhane-$(date +%Y%m%d-%H%M%S).dump"
  if err="$(pg_dump --format=custom --compress=6 --no-owner --file="$file.part" 2>&1)"; then
    mv "$file.part" "$file"
    bytes="$(stat -c %s "$file")"
    echo "[yedek] alındı: $(basename "$file") ($(du -h "$file" | cut -f1))"
    prune
    record true "$started" "$bytes" ""
  else
    rm -f "$file.part"
    echo "[yedek] HATA: yedek alınamadı; eski yedekler silinmedi. $err" >&2
    record false "$started" "" "$(printf '%s' "$err" | tail -c 500)"
  fi
}

if [ "${1:-}" = "simdi" ]; then
  TRIGGER="yönetici"
  backup
  exit 0
fi

TRIGGER="zamanlayıcı"
echo "[yedek] her gün $TIME saatinde yedek alınacak; $KEEP gün saklanacak."
while true; do
  now=$(date +%s)
  next=$(date -d "today $TIME" +%s)
  [ "$next" -le "$now" ] && next=$(date -d "tomorrow $TIME" +%s)
  sleep $((next - now))
  backup
done
