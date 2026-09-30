#!/usr/bin/env python3
"""Ölçekhane yayını: sunucuya bağlanan SSH anahtarını tek bir ana paroladan (ANA_SIFRE) türetir.

GitHub'daki yayın iş akışı çalışırken kullanılır; türetilen anahtar yalnızca o çalışmanın geçici
klasörüne yazılır. Türetme HMAC-SHA256 ile yapılır: ANA_SIFRE bilinmeden anahtar hesaplanamaz, anahtar
ele geçse de ANA_SIFRE bulunamaz. Aynı ANA_SIFRE her zaman aynı anahtarı verir; böylece anahtar hiçbir
yerde saklanmadan her yayında yeniden üretilir.

Sitede veritabanı ve saklanan veri olmadığı için başka gizli değer (disk parolası, veritabanı şifresi,
yedek anahtarı) yoktur. ANA_SIFRE kurulumdan sonra değiştirilirse yayın iş akışı sunucuya bağlanamaz;
eski değer geri girilmelidir.

Kullanım: ANA_SIFRE=... python3 turet.py <klasör>
Yazılan dosyalar (hepsi yalnızca sahibince okunabilir):
  ssh_anahtari, ssh_anahtari.pub  sunucuya bağlanan SSH anahtarı (Ed25519)
  parmak_izi                      ANA_SIFRE'nin kısa parmak izi (gizli değildir; değişip değişmediğini
                                  anlamak için)
"""
import hashlib
import hmac
import os
import sys

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey


# Parolanın neye benzediğini göstermek için sohbette yazılan örnekler. Herkesin görebildiği yerde yazıldıkları
# için gizli değildirler; biri yanlışlıkla ANA_SIFRE olarak girilirse yayın durur.
ORNEK_PAROLALAR = {
    "7f3a9c2e1b8d4f60a5e2c9b73d1f8e04c6b2a9175e8d3f0a9b4c7e21d0f6a8b3",
}


def main() -> int:
    if len(sys.argv) != 2:
        print("kullanım: ANA_SIFRE=... turet.py <klasör>", file=sys.stderr)
        return 2
    # Kâğıttan geri yazılırken yapılabilecek farklar yok sayılır: boşluklar atılır; parola yalnızca onaltılık
    # rakamlardan oluşuyorsa (parola üretme sayfasının verdiği biçim) büyük/küçük harf farkı da önemsenmez.
    ana = "".join(os.environ.get("ANA_SIFRE", "").split())
    if ana and all(c in "0123456789abcdefABCDEF" for c in ana):
        ana = ana.lower()
    if ana in ORNEK_PAROLALAR:
        print(
            "HATA: ANA_SIFRE, Claude'un sohbette biçimini göstermek için yazdığı örnek parola; bu parola gizli "
            "değildir. Ana Parola sayfasında kendi parolanızı üretip GitHub'a yeniden girin.",
            file=sys.stderr,
        )
        return 1
    if len(ana) < 32:
        # Değerin kendisi yazılmaz; yalnızca uzunluğu ve karakter türü (yanlış kutuya yapıştırılan bir değeri
        # ya da çalışmayan bir kopyalamayı ayırt etmek için).
        if not ana:
            neden = "tanımlı değil"
        else:
            tur = "yalnızca 0-9 ve a-f" if all(c in "0123456789abcdef" for c in ana) else "başka karakterler de"
            neden = (
                f"{len(ana)} karakter ({tur} içeriyor); en az 32 olmalı. Ana Parola sayfasının ürettiği "
                "parola 64 karakterdir"
            )
        print(
            f"HATA: ANA_SIFRE {neden}. GitHub'da depo ayarlarındaki Secrets bölümüne rehberdeki gibi yeniden girin.",
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
    yaz("parmak_izi", turet("parmak-izi").hex()[:12] + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
