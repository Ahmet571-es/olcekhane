#!/usr/bin/env python3
"""Ölçekhane yayını: kurulumun bütün anahtarlarını tek bir ana paroladan (ANA_SIFRE) türetir.

GitHub'daki yayın iş akışı çalışırken kullanılır; türetilen değerler yalnızca o çalışmanın geçici
klasörüne yazılır. Türetme HMAC-SHA256 ile yapılır: ANA_SIFRE bilinmeden hiçbiri hesaplanamaz, biri
ele geçse diğerleri ya da ANA_SIFRE bulunamaz. Aynı ANA_SIFRE her zaman aynı değerleri verir; böylece
sunucu kaybolsa da yenisi aynı anahtarlarla kurulabilir ve yedekler açılabilir.

ANA_SIFRE KURULUMDAN SONRA DEĞİŞTİRİLMEMELİ: uygulama anahtarı (öğrenci giriş kodları, iki aşamalı
doğrulama), şifreli diskin parolası ve yedeklerin anahtarı ona bağlıdır.

Kullanım: ANA_SIFRE=... python3 turet.py <klasör>
Yazılan dosyalar (hepsi yalnızca sahibince okunabilir):
  ssh_anahtari, ssh_anahtari.pub  sunuculara bağlanan SSH anahtarı (Ed25519)
  gizli.env                       DISK_PAROLASI, APP_SECRET, POSTGRES_PASSWORD
  yedek.key, yedek.pub            yedek kopyalarının age anahtarı (gizli) ve alıcısı (açık)
  parmak_izi                      ANA_SIFRE'nin kısa parmak izi (gizli değildir; değişip değişmediğini
                                  anlamak için)
"""
import hashlib
import hmac
import os
import sys

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

BECH32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"


def _polymod(values):
    gen = (0x3B6A57B2, 0x26508E6D, 0x1EA119FA, 0x3D4233DD, 0x2A1462B3)
    chk = 1
    for v in values:
        top = chk >> 25
        chk = (chk & 0x1FFFFFF) << 5 ^ v
        for i in range(5):
            chk ^= gen[i] if (top >> i) & 1 else 0
    return chk


def _bech32(hrp: str, data: bytes) -> str:
    """BIP-173 bech32 (age anahtarlarının biçimi; age uzunluk sınırı uygulamaz)."""
    acc = bits = 0
    five = []
    for b in data:
        acc = (acc << 8) | b
        bits += 8
        while bits >= 5:
            bits -= 5
            five.append((acc >> bits) & 31)
    if bits:
        five.append((acc << (5 - bits)) & 31)
    expanded = [ord(c) >> 5 for c in hrp] + [0] + [ord(c) & 31 for c in hrp]
    pm = _polymod(expanded + five + [0] * 6) ^ 1
    checksum = [(pm >> 5 * (5 - i)) & 31 for i in range(6)]
    return hrp + "1" + "".join(BECH32[d] for d in five + checksum)


def main() -> int:
    if len(sys.argv) != 2:
        print("kullanım: ANA_SIFRE=... turet.py <klasör>", file=sys.stderr)
        return 2
    ana = os.environ.get("ANA_SIFRE", "").strip()
    if len(ana) < 32:
        print(
            "HATA: ANA_SIFRE tanımlı değil ya da 32 karakterden kısa. GitHub'da depo ayarlarındaki "
            "Secrets bölümüne rehberdeki gibi girin.",
            file=sys.stderr,
        )
        return 1
    out = sys.argv[1]
    os.makedirs(out, mode=0o700, exist_ok=True)
    os.umask(0o077)

    def turet(etiket: str) -> bytes:
        return hmac.new(ana.encode(), f"olcekhane/{etiket}".encode(), hashlib.sha256).digest()

    def yaz(ad: str, icerik: str) -> None:
        yol = os.path.join(out, ad)
        with open(yol, "w", encoding="utf-8") as f:
            f.write(icerik)
        os.chmod(yol, 0o600)

    ssh = Ed25519PrivateKey.from_private_bytes(turet("ssh"))
    yaz(
        "ssh_anahtari",
        ssh.private_bytes(
            serialization.Encoding.PEM, serialization.PrivateFormat.OpenSSH, serialization.NoEncryption()
        ).decode(),
    )
    yaz(
        "ssh_anahtari.pub",
        ssh.public_key().public_bytes(serialization.Encoding.OpenSSH, serialization.PublicFormat.OpenSSH).decode()
        + " olcekhane-yayin\n",
    )

    yaz(
        "gizli.env",
        f"DISK_PAROLASI={turet('disk').hex()}\n"
        f"APP_SECRET={turet('app-secret').hex()}\n"
        f"POSTGRES_PASSWORD={turet('postgres').hex()}\n",
    )

    age_gizli = turet("age")
    age_acik = X25519PrivateKey.from_private_bytes(age_gizli).public_key().public_bytes(
        serialization.Encoding.Raw, serialization.PublicFormat.Raw
    )
    yaz("yedek.key", _bech32("age-secret-key-", age_gizli).upper() + "\n")
    yaz("yedek.pub", _bech32("age", age_acik) + "\n")

    yaz("parmak_izi", turet("parmak-izi").hex()[:12] + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
