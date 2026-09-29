import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Veritabanıyla çalışan testler (npm run test:db). Bağlantı bilgisi .env.local’dan okunur.
if (existsSync('.env.local')) process.loadEnvFile('.env.local');

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
