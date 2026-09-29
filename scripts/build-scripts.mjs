// Docker görüntüsü için sunucu betiklerini (veritabanı geçişi, yönetici oluşturma) tek dosyaya derler;
// böylece çalışma görüntüsünde geliştirme bağımlılıkları gerekmez. Çalıştırma: npm run build:scripts
import { build } from 'esbuild';

const common = {
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  // Paketlerdeki CommonJS require çağrıları ESM çıktıda da çalışsın.
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  logLevel: 'info',
};
await build({ ...common, entryPoints: ['scripts/migrate.mjs'], outfile: 'dist/migrate.mjs' });
// Argon2 yerel (native) bir modüldür: paketlenmez, uygulamanın node_modules klasöründen yüklenir.
await build({ ...common, entryPoints: ['scripts/create-admin.mjs'], outfile: 'dist/create-admin.mjs', external: ['@node-rs/argon2'] });
