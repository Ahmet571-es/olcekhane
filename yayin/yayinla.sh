#!/usr/bin/env bash
# Ölçekhane yayını: GitHub'daki iş akışlarında (yayin.yml, bakim.yml, prova.yml) çalışır ve sunuculara
# SSH ile bağlanıp sunucu/kur.sh ile sunucu/depo-kur.sh betiklerini çalıştırır.
#
#   yayinla.sh kur     ana sunucuyu kurar/günceller ve uygulamayı yayına alır (GORUNTU gerekir)
#   yayinla.sh ac      yeniden başlayan sunucunun şifreli veri alanını açar
#   yayinla.sh durum   durum özeti
#   yayinla.sh depo    depolama sunucusunu kurar ve ana sunucuya yedek çekme yetkisi tanımlar
#
# Ortam: ANA_SIFRE (zorunlu), SUNUCU_ROOT_SIFRE ve DEPO_ROOT_SIFRE (ilk kurulumda), SMTP_KULLANICI ve
# SMTP_SIFRE, GORUNTU (kur için: zstd ile sıkıştırılmış docker save çıktısı), AYARLAR (varsayılan
# yayin/ayarlar.env), SUNUCU_ORTAM (sunucuda kur.sh'e verilecek ek ortam; yalnızca prova için).
set -Eeuo pipefail
KOK=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
AYARLAR=${AYARLAR:-$KOK/yayin/ayarlar.env}
KOMUT=${1:-}

gh_not() { # tür başlık ileti — GitHub'da özet uyarısı (çalışma kayıtlarına erişilemese de görünür)
  local ileti=${3//'%'/'%25'}
  ileti=${ileti//$'\n'/'%0A'}
  echo "::$1 title=$2::$ileti"
}
hata() { gh_not error "Yayın" "$*"; exit 1; }
trap 'gh_not error "Yayın" "yayinla.sh $KOMUT satır $LINENO: \"$BASH_COMMAND\" başarısız oldu."' ERR

# Sunucudaki betiklerin BILGI/UYARI/HATA satırlarını özet uyarılarına çevirir; hepsini de kayda yazar.
cevir() {
  local satir
  while IFS= read -r satir; do
    printf '%s\n' "$satir"
    case "$satir" in
      BILGI:*) gh_not notice "$1" "${satir#BILGI: }" ;;
      UYARI:*) gh_not warning "$1" "${satir#UYARI: }" ;;
      HATA:*) gh_not error "$1" "${satir#HATA: }" ;;
    esac
  done
}

declare -A AYAR=()
while IFS= read -r satir || [ -n "$satir" ]; do
  satir=${satir%$'\r'}
  [[ "$satir" =~ ^[[:space:]]*(#|$) ]] && continue
  [[ "$satir" =~ ^([A-Z][A-Z0-9_]*)=(.*)$ ]] || hata "ayarlar.env okunamadı: $satir"
  ad=${BASH_REMATCH[1]}
  deger=${BASH_REMATCH[2]}
  if [[ "$deger" =~ ^\'(.*)\'$ ]] || [[ "$deger" =~ ^\"(.*)\"$ ]]; then deger=${BASH_REMATCH[1]}; fi
  AYAR[$ad]=$deger
done < "$AYARLAR"
SUNUCU=${AYAR[SUNUCU_ADRESI]:-}
DEPO=${AYAR[DEPO_ADRESI]:-}
ip_mi() { [[ "$1" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]]; }
ip_mi "$SUNUCU" || hata "yayin/ayarlar.env: SUNUCU_ADRESI bir IPv4 adresi olmalı ('$SUNUCU')."

IS=$(mktemp -d)
chmod 700 "$IS"
temizle() {
  local cm
  for cm in "$IS"/cm-*; do [ -S "$cm" ] && ssh -o ControlPath="$cm" -O exit x >/dev/null 2>&1 || true; done
  rm -rf "$IS"
}
trap temizle EXIT
python3 "$KOK/yayin/turet.py" "$IS/anahtar" || hata "ANA_SIFRE okunamadı (GitHub Secrets: ANA_SIFRE)."
gh_not notice "Anahtarlar" "ANA_SIFRE parmak izi: $(cat "$IS/anahtar/parmak_izi") (değişmemeli; ANA_SIFRE'nin kendisi değildir)."

# Sunucuların SSH anahtarları: depoda kayıtlıysa yalnızca onlar kabul edilir; değilse ilk bağlantıda
# öğrenilir ve depoya eklenmek üzere özete yazılır.
KH=$IS/known_hosts
: > "$KH"
[ -f "$KOK/yayin/bilinen-sunucular" ] && grep -vE '^[[:space:]]*(#|$)' "$KOK/yayin/bilinen-sunucular" >> "$KH" || true
SSH=(ssh -i "$IS/anahtar/ssh_anahtari" -o IdentitiesOnly=yes -o UserKnownHostsFile="$KH" -o HashKnownHosts=no
  -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o ServerAliveInterval=20 -o ServerAliveCountMax=6
  -o BatchMode=yes -o ControlMaster=auto -o ControlPath="$IS/cm-%h" -o ControlPersist=20m)

# yonetici hesabına anahtarla bağlanır; olmazsa (ilk kurulum) root şifresiyle hesabı açar.
baglan() { # ip root_sifresi ad
  local ip=$1 sifre=$2 ad=$3 pub
  if "${SSH[@]}" "yonetici@$ip" 'sudo -n true' 2>/dev/null; then return 0; fi
  [ -n "$sifre" ] || hata "$ad ($ip): yayın anahtarıyla bağlanılamadı. Sunucu henüz kurulmadıysa GitHub Secrets'a root şifresini girin (ilk kurulumdan sonra gerekmez). Sunucu daha önce kurulduysa ANA_SIFRE değiştirilmiş olabilir: eski değeri geri girin."
  command -v sshpass >/dev/null || hata "sshpass kurulu değil."
  pub=$(cat "$IS/anahtar/ssh_anahtari.pub")
  gh_not notice "$ad" "$ip: ilk kurulum, root şifresiyle bağlanılıyor."
  SSHPASS=$sifre sshpass -e ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password,keyboard-interactive \
    -o UserKnownHostsFile="$KH" -o HashKnownHosts=no -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 \
    "root@$ip" bash -s <<EOF || hata "$ad ($ip): ne yayın anahtarıyla ne de root şifresiyle bağlanılabildi. İlk kurulumsa şifreyi ve sağlayıcının root ile SSH girişine izin verdiğini denetleyin. Sunucu daha önce kurulduysa (root girişi artık kapalıdır) ANA_SIFRE değiştirilmiş olabilir: eski değeri geri girin."
set -e
id yonetici >/dev/null 2>&1 || useradd --create-home --shell /bin/bash yonetici
install -d -m 700 -o yonetici -g yonetici /home/yonetici/.ssh
echo '$pub' > /home/yonetici/.ssh/authorized_keys
chown yonetici:yonetici /home/yonetici/.ssh/authorized_keys
chmod 600 /home/yonetici/.ssh/authorized_keys
echo 'yonetici ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/90-olcekhane-yonetici
chmod 440 /etc/sudoers.d/90-olcekhane-yonetici
visudo -cqf /etc/sudoers.d/90-olcekhane-yonetici
EOF
  "${SSH[@]}" "yonetici@$ip" 'sudo -n true' || hata "$ad ($ip): hesap açıldı ama anahtarla bağlanılamadı."
}

sunucu_anahtarini_bildir() { # ip ad
  if ! grep -qE "^${1}[[:space:]]" "$KOK/yayin/bilinen-sunucular" 2>/dev/null; then
    gh_not notice "$2 SSH anahtarı" "Depoya (yayin/bilinen-sunucular) eklenmeli:
$(grep -E "^${1}[[:space:]]" "$KH" || true)"
  fi
}

paket_yukle() { # ip hedef_klasör dosyalar...
  local ip=$1 hedef=$2
  shift 2
  tar -C "$KOK" -czf - "$@" | "${SSH[@]}" "yonetici@$ip" "rm -rf $hedef && mkdir -m 700 $hedef && tar -xzf - -C $hedef"
}

smtp_url() {
  [ -n "${SMTP_KULLANICI:-}" ] && [ -n "${SMTP_SIFRE:-}" ] || return 0
  SMTP_SUNUCU=${AYAR[SMTP_SUNUCU]:-} SMTP_PORT=${AYAR[SMTP_PORT]:-465} python3 - <<'EOF'
import os
from urllib.parse import quote
k, s = os.environ["SMTP_KULLANICI"].strip(), os.environ["SMTP_SIFRE"]
h, p = os.environ["SMTP_SUNUCU"].strip(), os.environ["SMTP_PORT"].strip()
if not h or not p.isdigit():
    raise SystemExit("SMTP_SUNUCU ya da SMTP_PORT geçersiz")
sema = "smtps" if p == "465" else "smtp"
url = f"{sema}://{quote(k, safe='')}:{quote(s, safe='')}@{h}:{p}"
print(url + ("?requireTLS=true" if p == "587" else ""))
EOF
}

komut_kur() {
  [ -f "${GORUNTU:-}" ] || hata "Uygulama görüntüsü (GORUNTU) bulunamadı."
  baglan "$SUNUCU" "${SUNUCU_ROOT_SIFRE:-}" "Ana sunucu"
  sunucu_anahtarini_bildir "$SUNUCU" "Ana sunucu"
  paket_yukle "$SUNUCU" /var/tmp/olcekhane-kur sunucu docker-compose.yml docker/Caddyfile docker/backup.sh yayin/ayarlar.env
  if [ "$AYARLAR" != "$KOK/yayin/ayarlar.env" ]; then
    "${SSH[@]}" "yonetici@$SUNUCU" 'cat > /var/tmp/olcekhane-kur/yayin/ayarlar.env' < "$AYARLAR"
  fi
  local url
  url=$(smtp_url) || hata "SMTP bilgileri okunamadı."
  {
    cat "$IS/anahtar/gizli.env"
    echo "YEDEK_ALICI=$(cat "$IS/anahtar/yedek.pub")"
    [ -z "$url" ] || echo "SMTP_URL=$url"
  } | "${SSH[@]}" "yonetici@$SUNUCU" "sudo ${SUNUCU_ORTAM:-} bash /var/tmp/olcekhane-kur/sunucu/kur.sh hazirla" | cevir "Sunucu kurulumu"
  gh_not notice "Görüntü" "Uygulama görüntüsü sunucuya aktarılıyor ($(du -h "$GORUNTU" | cut -f1))."
  "${SSH[@]}" "yonetici@$SUNUCU" 'zstd -dc | sudo docker load -q' < "$GORUNTU" >/dev/null
  "${SSH[@]}" "yonetici@$SUNUCU" "sudo bash /var/tmp/olcekhane-kur/sunucu/kur.sh yayinla" | cevir "Yayın"
  "${SSH[@]}" "yonetici@$SUNUCU" 'rm -rf /var/tmp/olcekhane-kur'
}

komut_ac() {
  baglan "$SUNUCU" "" "Ana sunucu"
  sed -n 's/^DISK_PAROLASI=/DISK_PAROLASI=/p' "$IS/anahtar/gizli.env" |
    "${SSH[@]}" "yonetici@$SUNUCU" 'sudo olcekhane-kur ac' | cevir "Veri alanı"
}

komut_durum() {
  baglan "$SUNUCU" "" "Ana sunucu"
  local cikti
  cikti=$("${SSH[@]}" "yonetici@$SUNUCU" 'sudo olcekhane-kur durum')
  printf '%s\n' "$cikti"
  gh_not notice "Sunucu durumu" "$cikti"
  case "$cikti" in *yeniden_baslatma_gerekli=evet*) gh_not warning "Sunucu durumu" "Güvenlik güncellemeleri için sunucunun yeniden başlatılması gerekiyor; uygun bir saatte yeniden başlatıp Bakım iş akışıyla veri alanını açın." ;; esac
}

komut_depo() {
  ip_mi "$DEPO" || hata "yayin/ayarlar.env: DEPO_ADRESI bir IPv4 adresi olmalı ('$DEPO')."
  baglan "$SUNUCU" "" "Ana sunucu"
  baglan "$DEPO" "${DEPO_ROOT_SIFRE:-}" "Depolama sunucusu"
  sunucu_anahtarini_bildir "$DEPO" "Depolama sunucusu"
  paket_yukle "$DEPO" /var/tmp/olcekhane-depo -C sunucu depo-kur.sh depo-cek.sh
  local cikti anahtar
  cikti=$(grep -E "^${SUNUCU}[[:space:]]" "$KH" | "${SSH[@]}" "yonetici@$DEPO" "sudo bash /var/tmp/olcekhane-depo/depo-kur.sh $SUNUCU")
  printf '%s\n' "$cikti" | grep -v '^ACIK_ANAHTAR=' | cevir "Depolama sunucusu"
  anahtar=$(printf '%s\n' "$cikti" | sed -n 's/^ACIK_ANAHTAR=//p')
  [ -n "$anahtar" ] || hata "Depolama sunucusunun çekme anahtarı alınamadı."
  printf '%s\n' "$anahtar" | "${SSH[@]}" "yonetici@$SUNUCU" "sudo olcekhane-kur okuyucu $DEPO" | cevir "Depolama sunucusu"
  # İlk kopyalar: ana sunucuda ayna hazırlanır (yedek yoksa atlanır), depolama sunucusu çeker.
  "${SSH[@]}" "yonetici@$SUNUCU" 'sudo olcekhane-yedek-kopyala' 2>&1 | sed 's/^/ana: /' || true
  if "${SSH[@]}" "yonetici@$DEPO" 'sudo olcekhane-depo-cek' 2>&1 | sed 's/^/depo: /'; then
    gh_not notice "Depolama sunucusu" "Şifreli yedek kopyaları çekildi: $("${SSH[@]}" "yonetici@$DEPO" 'sudo ls /srv/olcekhane-yedek | wc -l') dosya."
  else
    hata "Depolama sunucusu ana sunucudan yedek çekemedi."
  fi
  "${SSH[@]}" "yonetici@$DEPO" 'rm -rf /var/tmp/olcekhane-depo'
}

case "$KOMUT" in
  kur) komut_kur ;;
  ac) komut_ac ;;
  durum) komut_durum ;;
  depo) komut_depo ;;
  *) echo "kullanım: yayinla.sh kur|ac|durum|depo" >&2; exit 2 ;;
esac
