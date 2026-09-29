#!/bin/sh
# Uygulama kapsayıcısı: önce veritabanı şemasını en son sürüme getirir, sonra sunucuyu başlatır.
# Test tanımları ve hukuki metinler sunucu açılışında eşitlenir; günlük temizlik görevi sunucu içinde çalışır.
set -e
if [ "${#APP_SECRET}" -lt 32 ]; then
  echo "HATA: APP_SECRET tanımlı değil ya da 32 karakterden kısa (.env dosyasına bakın: openssl rand -hex 32)." >&2
  exit 1
fi
node dist/migrate.mjs
exec node server.js
