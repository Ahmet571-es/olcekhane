import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as { __olcekhaneSql?: postgres.Sql };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL tanımlı değil.');
  return postgres(url, {
    max: Number(process.env.DATABASE_POOL_SIZE ?? 10),
    idle_timeout: 30,
    connect_timeout: 10,
    prepare: true,
  });
}

// Geliştirme sırasında sıcak yeniden yüklemede bağlantı havuzu yeniden oluşturulmasın.
const sql = globalForDb.__olcekhaneSql ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForDb.__olcekhaneSql = sql;

export const db = drizzle(sql, { schema, casing: 'snake_case' });
export type DB = typeof db;
export { schema };
