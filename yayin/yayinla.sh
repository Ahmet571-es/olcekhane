#!/usr/bin/env bash
# Ölçekhane yayını: GitHub'daki iş akışlarında (yayin.yml, bakim.yml, prova.yml) çalışır ve sunucuya SSH
# ile bağlanıp sunucu/kur.sh betiğini çalıştırır.
#
#   yayinla.sh kur      sunucuyu kurar/günceller ve uygulamayı yayına alır (GORUNTU gerekir)
#   yayinla.sh baslat   durmuş kapsayıcıları yeniden başlatır
#   yayinla.sh durum    durum özeti
#
# Ortam: ANA_SIFRE (zorunlu; sunucuya bağlanan SSH anahtarı bundan türetilir), SUNUCU_ROOT_SIFRE (yalnızca
# ilk kurulumda), GORUNTU (kur için: zstd ile sıkıştırılmış docker save çıktısı), AYARLAR (varsayılan
# yayin/ayarlar.env).
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

# Sunucudaki betiğin BILGI/UYARI/HATA satırlarını özet uyarılarına çevirir; hepsini de kayda yazar.
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
[[ "$SUNUCU" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]] || hata "yayin/ayarlar.env: SUNUCU_ADRESI bir IPv4 adresi olmalı ('$SUNUCU')."

IS=$(mktemp -d)
chmod 700 "$IS"
temizle() {
  local cm
  for cm in "$IS"/cm-*; do [ -S "$cm" ] && ssh -o ControlPath="$cm" -O exit x >/dev/null 2>&1 || true; done
  rm -rf "$IS"
}
trap temizle EXIT
# Gizli bilgilerin kutuya yanlış bir şey yapıştırılarak girildiği sık durumlar. Değerlerin kendisi yazılmaz.
yanlis_deger() { # ad değer — yalnızca bilinen yanlış değerleri adlandırır
  local d
  d=$(printf '%s' "$2" | tr -d '[:space:]')
  case "$d" in
    ANA_SIFRE | SUNUCU_ROOT_SIFRE) echo "$1 kutusuna şifre yerine bir gizli bilginin adı ($d) yapıştırılmış." ;;
    undefined | null) echo "$1 kutusuna '$d' yapıştırılmış: kopyalama çalışmamış." ;;
  esac
}
neden=$(yanlis_deger ANA_SIFRE "${ANA_SIFRE:-}")
[ -z "$neden" ] || hata "$neden Değeri GitHub Secrets'ta yeniden girin (yayin/REHBER.md)."
turet_cikti=$(python3 "$KOK/yayin/turet.py" "$IS/anahtar" 2>&1) ||
  hata "ANA_SIFRE okunamadı (GitHub Secrets: ANA_SIFRE): ${turet_cikti#HATA: }"
gh_not notice "Anahtarlar" "ANA_SIFRE parmak izi: $(cat "$IS/anahtar/parmak_izi") (değişmemeli; ANA_SIFRE'nin kendisi değildir)."

# Sunucunun SSH anahtarı: depoda kayıtlıysa yalnızca o kabul edilir; değilse ilk bağlantıda öğrenilir ve
# depoya eklenmek üzere özete yazılır.
KH=$IS/known_hosts
: > "$KH"
[ -f "$KOK/yayin/bilinen-sunucular" ] && grep -vE '^[[:space:]]*(#|$)' "$KOK/yayin/bilinen-sunucular" >> "$KH" || true
SSH=(ssh -i "$IS/anahtar/ssh_anahtari" -o IdentitiesOnly=yes -o UserKnownHostsFile="$KH" -o HashKnownHosts=no
  -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o ServerAliveInterval=20 -o ServerAliveCountMax=6
  -o BatchMode=yes -o ControlMaster=auto -o ControlPath="$IS/cm-%h" -o ControlPersist=20m)

# yonetici hesabına anahtarla bağlanır; olmazsa (ilk kurulum) root şifresiyle hesabı açar.
baglan() { # ip root_sifresi
  local ip=$1 sifre=$2 pub
  if "${SSH[@]}" "yonetici@$ip" 'sudo -n true' 2>/dev/null; then return 0; fi
  [ -n "$sifre" ] || hata "Sunucu ($ip): yayın anahtarıyla bağlanılamadı. Sunucu henüz kurulmadıysa GitHub Secrets'a root şifresini (SUNUCU_ROOT_SIFRE) girin; ilk kurulumdan sonra gerekmez. Sunucu daha önce kurulduysa ANA_SIFRE değiştirilmiş olabilir: eski değeri geri girin."
  local neden ipucu=""
  neden=$(yanlis_deger SUNUCU_ROOT_SIFRE "$sifre")
  [ -z "$neden" ] || hata "$neden Değeri GitHub Secrets'ta yeniden girin (yayin/REHBER.md)."
  # Ana Parola sayfasının ürettiği biçimde (64 onaltılık karakter) bir root şifresi büyük olasılıkla ANA_SIFRE'dir.
  [[ "$(printf '%s' "$sifre" | tr -d '[:space:]')" =~ ^[0-9a-fA-F]{64}$ ]] &&
    ipucu=" SUNUCU_ROOT_SIFRE, Ana Parola sayfasının ürettiği parolaya benziyor: iki gizli bilgi yer değiştirmiş olabilir."
  command -v sshpass >/dev/null || hata "sshpass kurulu değil."
  pub=$(cat "$IS/anahtar/ssh_anahtari.pub")
  gh_not notice "Sunucu" "$ip: ilk kurulum, root şifresiyle bağlanılıyor."
  # Bağlanılamazsa nedeni özete yazılır: sshpass 5 = şifre kabul edilmedi; diğer durumlarda ssh'nin son iletileri
  # (ör. "Connection timed out", "Permission denied (publickey)"). Bu iletilerde şifre yer almaz.
  local cikis=0 ssh_iletisi ayrinti
  ssh_iletisi=$(SSHPASS=$sifre sshpass -e ssh -o PubkeyAuthentication=no \
    -o PreferredAuthentications=password,keyboard-interactive -o UserKnownHostsFile="$KH" -o HashKnownHosts=no \
    -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 "root@$ip" bash -s 2>&1 >/dev/null <<EOF
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
  ) || cikis=$?
  if [ "$cikis" -ne 0 ]; then
    ayrinti=$(printf '%s\n' "$ssh_iletisi" | { grep -v '^Warning: Permanently added' || true; } | tail -n 3 | tr '\n' ' ' |
      sed 's/  */ /g; s/ $//')
    case "$cikis" in
      5) neden="sunucu root şifresini kabul etmedi: SUNUCU_ROOT_SIFRE, sunucunun root şifresiyle aynı değil" ;;
      *) neden="ssh çıkış kodu $cikis${ayrinti:+: $ayrinti}" ;;
    esac
    hata "Sunucu ($ip): ne yayın anahtarıyla ne de root şifresiyle bağlanılabildi ($neden). İlk kurulumsa şifreyi ve sağlayıcının root ile SSH girişine izin verdiğini denetleyin. Sunucu daha önce kurulduysa (root girişi artık kapalıdır) ANA_SIFRE değiştirilmiş olabilir: eski değeri geri girin.$ipucu"
  fi
  "${SSH[@]}" "yonetici@$ip" 'sudo -n true' || hata "Sunucu ($ip): hesap açıldı ama anahtarla bağlanılamadı."
}

sunucu_anahtarini_bildir() { # ip
  if ! grep -qE "^${1}[[:space:]]" "$KOK/yayin/bilinen-sunucular" 2>/dev/null; then
    gh_not notice "Sunucunun SSH anahtarı" "Depoya (yayin/bilinen-sunucular) eklenmeli:
$(grep -E "^${1}[[:space:]]" "$KH" || true)"
  fi
}

komut_kur() {
  [ -f "${GORUNTU:-}" ] || hata "Uygulama görüntüsü (GORUNTU) bulunamadı."
  baglan "$SUNUCU" "${SUNUCU_ROOT_SIFRE:-}"
  sunucu_anahtarini_bildir "$SUNUCU"
  tar -C "$KOK" -czf - sunucu/kur.sh docker-compose.yml docker/Caddyfile yayin/ayarlar.env |
    "${SSH[@]}" "yonetici@$SUNUCU" "rm -rf /var/tmp/olcekhane-kur && mkdir -m 700 /var/tmp/olcekhane-kur && tar -xzf - -C /var/tmp/olcekhane-kur"
  if [ "$AYARLAR" != "$KOK/yayin/ayarlar.env" ]; then
    "${SSH[@]}" "yonetici@$SUNUCU" 'cat > /var/tmp/olcekhane-kur/yayin/ayarlar.env' < "$AYARLAR"
  fi
  "${SSH[@]}" "yonetici@$SUNUCU" "sudo bash /var/tmp/olcekhane-kur/sunucu/kur.sh hazirla" | cevir "Sunucu kurulumu"
  gh_not notice "Görüntü" "Uygulama görüntüsü sunucuya aktarılıyor ($(du -h "$GORUNTU" | cut -f1))."
  "${SSH[@]}" "yonetici@$SUNUCU" 'zstd -dc | sudo docker load -q' < "$GORUNTU" >/dev/null
  "${SSH[@]}" "yonetici@$SUNUCU" "sudo bash /var/tmp/olcekhane-kur/sunucu/kur.sh yayinla" | cevir "Yayın"
  "${SSH[@]}" "yonetici@$SUNUCU" 'rm -rf /var/tmp/olcekhane-kur'
}

komut_baslat() {
  baglan "$SUNUCU" ""
  "${SSH[@]}" "yonetici@$SUNUCU" 'sudo olcekhane-kur baslat' | cevir "Uygulama"
}

komut_durum() {
  baglan "$SUNUCU" ""
  local cikti
  cikti=$("${SSH[@]}" "yonetici@$SUNUCU" 'sudo olcekhane-kur durum')
  printf '%s\n' "$cikti"
  gh_not notice "Sunucu durumu" "$cikti"
}

case "$KOMUT" in
  kur) komut_kur ;;
  baslat) komut_baslat ;;
  durum) komut_durum ;;
  *) echo "kullanım: yayinla.sh kur|baslat|durum" >&2; exit 2 ;;
esac
