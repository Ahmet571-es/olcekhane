import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Veritabanıyla çalışan testler (npm run test:db). Bağlantı bilgisi .env.local’dan okunur.
// Testler veritabanına kayıt ekler ve temizlik görevini bütün veritabanında çalıştırır: yalnızca yerel
// geliştirme veritabanına izin verilir (başka bir sunucu için ALLOW_DB_TESTS=1 gerekir).
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const dbHost = (() => {
  try {
    return new URL(process.env.DATABASE_URL ?? '').hostname;
  } catch {
    return '';
  }
})();
if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(dbHost) && process.env.ALLOW_DB_TESTS !== '1') {
  throw new Error(`Veritabanı testleri yalnızca yerel veritabanında çalışır (DATABASE_URL sunucusu: ${dbHost || 'tanımsız'}).`);
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      'server-only': path.resolve(import.meta.dirname, 'tests/stubs/server-only.ts'),
    },
  },
  test: {
    include: ['tests/db/**/*.dbtest.ts'],
    environment: 'node',
    fileParallelism: false,
  },
});
