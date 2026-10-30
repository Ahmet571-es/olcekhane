import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // Sunucu modüllerindeki saf fonksiyonları test edebilmek için.
      'server-only': path.resolve(import.meta.dirname, 'tests/stubs/server-only.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // Ağır testler (bütün durum birleşimleri, PDF) yerelde 3–5 sn sürüyor; GitHub'da öteki testlerle birlikte 5 sn'lik
    // varsayılan süreyi aşabiliyor (2026-10-30). Uzun süren testler kendi sürelerini ayrıca verir.
    testTimeout: 20_000,
  },
});
