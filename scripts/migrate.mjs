// Veritabanı şemasını en son sürüme getirir. Üretimde uygulama başlamadan önce çalışır.
//
// Veritabanı kapsayıcısı ilk açılışta ya da sunucu yeniden başlarken kısa bir süre bağlantı kabul etmez
// ("the database system is starting up", bağlantı reddi, ad çözümlenemedi). Bu geçici durumlarda
// bağlantı MIGRATE_WAIT_SECONDS (varsayılan 90) saniye boyunca yeniden denenir; başka her hata hemen
// bildirilir.
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL tanımlı değil.');
  process.exit(1);
}

const GECICI = new Set(['57P03', 'ECONNREFUSED', 'ECONNRESET', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'CONNECT_TIMEOUT']);
const beklemeSn = Number(process.env.MIGRATE_WAIT_SECONDS ?? 90);
const sonTarih = Date.now() + (Number.isFinite(beklemeSn) && beklemeSn >= 0 ? beklemeSn : 90) * 1000;

async function baglan() {
  for (let deneme = 1; ; deneme++) {
    const sql = postgres(url, { max: 1, onnotice: () => {}, connect_timeout: 10 });
    try {
      await sql`select 1`;
      return sql;
    } catch (err) {
      await sql.end({ timeout: 1 }).catch(() => {});
      const kod = err?.code ?? err?.cause?.code;
      if (!GECICI.has(kod) || Date.now() >= sonTarih) throw err;
      console.log(`Veritabanı henüz hazır değil (${kod}); yeniden deneniyor.`);
      await new Promise((r) => setTimeout(r, Math.min(1000 * deneme, 5000)));
    }
  }
}

const sql = await baglan();
await migrate(drizzle(sql), { migrationsFolder: './drizzle' });
await sql.end();
console.log('Veritabanı güncel.');
