#!/bin/sh
# Sunucu yeniden başladıktan sonra şifreli veri diskini açar ve Ölçekhane'yi başlatır (KURULUM.md, 4.3):
#   sudo olcekhane-ac
# Ayarlar /etc/olcekhane.conf dosyasından okunur: VERI_KAYNAK (şifreli disk ya da dosya).
set -eu
[ "$(id -u)" -eq 0 ] || { echo "sudo ile çalıştırın: sudo olcekhane-ac" >&2; exit 1; }
# shellcheck source=/dev/null
. "${OLCEKHANE_CONF:-/etc/olcekhane.conf}"
: "${VERI_KAYNAK:?/etc/olcekhane.conf içinde VERI_KAYNAK tanımlı değil}"
AD=olcekhane-veri
BAGLAMA=${VERI_BAGLAMA:-/srv/olcekhane}

[ -e "/dev/mapper/$AD" ] || cryptsetup open "$VERI_KAYNAK" "$AD"
mountpoint -q "$BAGLAMA" || mount "/dev/mapper/$AD" "$BAGLAMA"
if [ -f "$BAGLAMA/swapfile" ] && ! swapon --show=NAME --noheadings | grep -qx "$BAGLAMA/swapfile"; then
  swapon "$BAGLAMA/swapfile"
fi
systemctl start docker
echo "Veri diski açık; kapsayıcılar başlıyor. Durum için: cd $BAGLAMA/uygulama && docker compose ps"
