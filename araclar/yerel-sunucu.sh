#!/usr/bin/env bash
# Siteyi üretimdeki gibi derleyip bu ortamda açar: http://127.0.0.1:3100 (Docker'sız, Next.js standalone çıktısı;
# sunucudaki kapsayıcıyla aynı başlatma: node server.js). Bash aracında zaman aşımı 300000 ms verilir.
#
#   bash araclar/yerel-sunucu.sh                 derle ve aç (site sahibi bilgileri boş: canlıdaki şimdiki durum)
#   ORNEK_SAHIP=1 bash araclar/yerel-sunucu.sh   site sahibi bilgileri örnek değerlerle dolu (İletişim, yasal metinler)
#   bash araclar/yerel-sunucu.sh --derlemeden    son derlemeyi yeniden aç
#   bash araclar/yerel-sunucu.sh durdur
#
# Ardından: node araclar/tarayici-dene.mjs / /testler ...   (telefon ve masaüstü genişliğinde gerçek tarayıcı)
# Kurulum depo dışındadır (${TMPDIR:-/tmp}/olcekhane-yerel); depoda yalnızca .next/ değişir (git'e girmez).
set -euo pipefail

KOK=$(cd "$(dirname "$0")/.." && pwd)
YER=${OLCEKHANE_YEREL:-${TMPDIR:-/tmp}/olcekhane-yerel}
mkdir -p "$YER"
YER=$(cd "$YER" && pwd -P)
PORT=${PORT:-3100}
PID_DOSYASI=$YER/sunucu.pid
GUNLUK=$YER/sunucu.log

kapi_dolu() { curl -s -o /dev/null -m 2 "http://127.0.0.1:$PORT/"; }

# Bu betiğin açtığı sunucuyu durdurur: PID dosyasındaki süreç ve çalışma klasörü $YER/uygulama olan her süreç.
durdur() {
  local pidler="" p pid kalan
  [ -f "$PID_DOSYASI" ] && pidler=$(cat "$PID_DOSYASI")
  for p in /proc/[0-9]*; do
    [ "$(readlink "$p/cwd" 2>/dev/null)" = "$YER/uygulama" ] && pidler="$pidler ${p#/proc/}"
  done
  for pid in $pidler; do kill "$pid" 2>/dev/null || true; done
  for _ in $(seq 1 40); do
    kalan=0
    for pid in $pidler; do kill -0 "$pid" 2>/dev/null && kalan=1; done
    [ "$kalan" = 0 ] && break
    sleep 0.25
  done
  rm -f "$PID_DOSYASI"
}

DERLE=1
case "${1:-}" in
  durdur)
    durdur
    if kapi_dolu; then
      echo "$PORT kapısında hâlâ bir sunucu yanıt veriyor (bu betiğin açmadığı bir süreç olabilir)." >&2
      exit 1
    fi
    echo "Yerel sunucu durduruldu."
    exit 0 ;;
  --derlemeden) DERLE=0 ;;
  "") ;;
  *) echo "Bilinmeyen seçenek: $1 (kullanım: başındaki açıklama)" >&2; exit 2 ;;
esac

if [ "$DERLE" = 1 ]; then
  for f in "$KOK"/.env*; do
    [ -e "$f" ] || continue
    case "$(basename "$f")" in
      .env.example) ;;
      *) echo "Uyarı: $(basename "$f") derlemeye girer (Denetim'de bu dosya yoktur); sonuç üretimden biraz farklı olabilir." >&2 ;;
    esac
  done
  echo "Derleniyor (npm run build; bir iki dakika sürer)..."
  # Denetim'deki gibi ortam değişkeni olmadan: derleme hiçbir gizli değere ya da ayara dayanmamalı.
  if ! (cd "$KOK" && env -i PATH="$PATH" HOME="$HOME" NEXT_TELEMETRY_DISABLED=1 npm run build) > "$YER/derleme.log" 2>&1; then
    tail -n 40 "$YER/derleme.log"
    echo "Derleme başarısız (tamamı: $YER/derleme.log)." >&2
    exit 1
  fi
fi
[ -f "$KOK/.next/standalone/server.js" ] || { echo "Derleme çıktısı yok: --derlemeden olmadan çalıştırın." >&2; exit 1; }

durdur
if kapi_dolu; then
  echo "$PORT kapısını başka bir süreç kullanıyor ve bu betik onu durduramadı." >&2
  echo "Başka bir kapıyla açın ve denemede aynı kapıyı verin: PORT=3101 bash araclar/yerel-sunucu.sh," >&2
  echo "ADRES=http://127.0.0.1:3101 node araclar/tarayici-dene.mjs ..." >&2
  exit 1
fi

# Dockerfile'daki gibi: standalone çıktı + .next/static + public.
rm -rf "$YER/uygulama" "$YER/gecici"
mkdir -p "$YER/uygulama/.next" "$YER/gecici"
cp -R "$KOK/.next/standalone/." "$YER/uygulama/"
cp -R "$KOK/.next/static" "$YER/uygulama/.next/static"
[ -d "$KOK/public" ] && cp -R "$KOK/public" "$YER/uygulama/public"
rm -f "$YER/uygulama"/.env*

ORTAM=(
  PATH="$PATH" HOME="$HOME" NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 TZ=Europe/Istanbul
  HOSTNAME=127.0.0.1 PORT="$PORT" APP_URL="http://127.0.0.1:$PORT" ALLOW_INDEXING="${ALLOW_INDEXING:-true}"
  TMPDIR="$YER/gecici"
)
if [ "${ORNEK_SAHIP:-0}" = 1 ]; then
  # Gerçek kişi değildir; yalnızca bu bilgilerin sayfalarda nasıl göründüğünü denemek için.
  ORTAM+=(
    OWNER_NAME='Örnek Site Sahibi' OWNER_ADDRESS='Deneme Mah. Örnek Sok. No: 1, 06000 Çankaya/Ankara'
    OWNER_PHONE='+90 555 000 00 00' OWNER_EMAIL='bilgi@olcekhane.test'
  )
fi
# exec: alt kabuk node sürecine dönüşür; PID dosyasındaki numara doğrudan sunucunundur.
( cd "$YER/uygulama" && exec nohup env -i "${ORTAM[@]}" node server.js ) > "$GUNLUK" 2>&1 &
echo $! > "$PID_DOSYASI"

for _ in $(seq 1 120); do
  if curl -fsS -m 2 -o /dev/null "http://127.0.0.1:$PORT/api/saglik" 2>/dev/null; then
    echo "Yerel sunucu hazır: http://127.0.0.1:$PORT  (günlük: $GUNLUK; durdurmak için: bash araclar/yerel-sunucu.sh durdur)"
    exit 0
  fi
  kill -0 "$(cat "$PID_DOSYASI")" 2>/dev/null || break
  sleep 0.5
done
tail -n 30 "$GUNLUK" >&2 || true
echo "Yerel sunucu açılmadı." >&2
exit 1
