import { sql } from 'drizzle-orm';
import { db } from '@/db';

/**
 * Sağlık denetimi (Docker ve çalışma süresi izleme için): uygulama ayakta ve veritabanına
 * ulaşabiliyorsa 200, ulaşamıyorsa 503. Başka bilgi vermez.
 */
export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ durum: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ durum: 'veritabanı' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
