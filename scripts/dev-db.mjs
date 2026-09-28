// Yerel geliştirme için gömülü PostgreSQL sunucusu.
// Üretimde kullanılmaz; üretimde docker-compose içindeki postgres servisi çalışır.
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync, mkdirSync, chmodSync } from 'node:fs';
import path from 'node:path';

// Kök kullanıcıyla çalışırken gömülü PostgreSQL ayrı bir 'postgres' kullanıcısıyla başlar;
// bu yüzden veri klasörünü herkesin geçebildiği bir yerde tutuyoruz.
const baseDir = process.env.DEV_DB_DIR ?? '/tmp/olcekhane-pg';
mkdirSync(baseDir, { recursive: true });
try { chmodSync(baseDir, 0o777); } catch {}
const dataDir = path.join(baseDir, 'data');
const port = Number(process.env.DEV_DB_PORT ?? 54329);
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'olcekhane',
  password: 'olcekhane',
  port,
  persistent: true,
  onLog: () => {},
});

const fresh = !existsSync(path.join(dataDir, 'PG_VERSION'));
if (fresh) await pg.initialise();
await pg.start();
if (fresh) {
  await pg.createDatabase('olcekhane');
  await pg.createDatabase('olcekhane_test');
}
console.log(`PostgreSQL hazır: postgres://olcekhane:olcekhane@127.0.0.1:${port}/olcekhane`);

const stop = async () => { await pg.stop(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
setInterval(() => {}, 1 << 30);
