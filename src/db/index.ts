import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as { __olcekhaneSql?: postgres.Sql };

function createClient(): postgres.Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL tanımlı değil.');
  return postgres(url, {
    max: Number(process.env.DATABASE_POOL_SIZE ?? 10),
    idle_timeout: 30,
    connect_timeout: 10,
    prepare: true,
  });
}

function createDb() {
  // Geliştirme sırasında sıcak yeniden yüklemede bağlantı havuzu yeniden oluşturulmasın.
  const sql = globalForDb.__olcekhaneSql ?? createClient();
  if (process.env.NODE_ENV !== 'production') globalForDb.__olcekhaneSql = sql;
  return drizzle(sql, { schema, casing: 'snake_case' });
}

export type DB = ReturnType<typeof createDb>;

let instance: DB | undefined;

/**
 * Veritabanı bağlantısı ilk kullanımda kurulur. Derleme sırasında (Docker görüntüsünde) veritabanı
 * adresi yoktur ve modüller yine de yüklenir; adres yalnızca gerçekten sorgu yapılırken gerekir.
 */
export const db: DB = new Proxy({} as DB, {
  get(_, prop) {
    instance ??= createDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

/** Bir veritabanı işlemi (transaction). */
export type Tx = Parameters<Parameters<DB['transaction']>[0]>[0];
/** Sorgu çalıştırabilen her şey: doğrudan bağlantı ya da süren bir işlem. Yardımcılar ikisiyle de çalışır. */
export type Exec = DB | Tx;
export { schema };
