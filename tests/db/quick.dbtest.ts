import { sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { quickPdfResponse, quickReportResponse } from '@/lib/assessment/quick-http';
import { quickReports } from '@/lib/assessment/quick';
import type { QuickBody } from '@/lib/assessment/schemas';
import { resetMemoryRateLimit } from '@/lib/memory-rate-limit';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { cancellationBody, likertBody, memoryTasksBody, quizBody, readingBody } from '../helpers/quick-bodies';

// Veritabanı gerektirir: npm run test:db. Hızlı testin "hiçbir şey saklanmaz" sözü: bütün motorlarla
// rapor ve PDF üretilir, HTTP uçları çağrılır; veritabanındaki hiçbir tablo değişmez.

/** Her tablonun satır sayısı ve içeriğinin özeti. Ekleme, güncelleme ve silme hepsi özeti değiştirir. */
async function snapshot(): Promise<Record<string, string>> {
  const tables = await db.execute<{ t: string }>(
    sql`select table_name as t from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by 1`,
  );
  const out: Record<string, string> = {};
  for (const { t } of tables) {
    const [r] = await db.execute<{ n: number; h: string }>(
      sql.raw(`select count(*)::int as n, md5(coalesce(string_agg(x::text, '|' order by x::text), '')) as h from "${t.replace(/"/g, '""')}" x`),
    );
    out[t] = `${r.n}:${r.h}`;
  }
  return out;
}

const BODIES: [string, QuickBody][] = [
  ['bes-faktor-kisilik', likertBody('bes-faktor-kisilik', 8, (i) => (i * 3) % 5)],
  ['oz-saygi', likertBody('oz-saygi', 9, (i) => i % 4)],
  ['mesleki-ilgi-profili', likertBody('mesleki-ilgi-profili', 10, (i) => i % 5)],
  ['calisma-aliskanliklari', likertBody('calisma-aliskanliklari', 7, (i) => (i + 1) % 5)],
  ['okuma-hizi-ve-anlama', readingBody(6)],
  ['matematik-tani-testi', quizBody(7, 3)],
  ['surekli-dikkat', cancellationBody()],
  ['dikkat-ve-bellek', memoryTasksBody()],
];

function post(url: string, body: unknown) {
  return new NextRequest(url, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000', host: 'localhost:3000' }, body: JSON.stringify(body) });
}

describe('hızlı test hiçbir şeyi saklamaz', () => {
  let before: Record<string, string> = {};
  beforeAll(async () => {
    resetMemoryRateLimit();
    before = await snapshot();
    expect(Object.keys(before).length).toBeGreaterThan(20);
  });

  it('bütün motorlarla rapor ve PDF üretilir; veritabanı değişmez', async () => {
    for (const [slug, body] of BODIES) {
      const r = await quickReports(slug, body);
      expect(r.student.items.length, slug).toBeGreaterThan(0);
      const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString(), slug).toBe('%PDF-');
    }
    expect(await snapshot()).toEqual(before);
  }, 120_000);

  it('HTTP uçları: rapor JSON, PDF dosyası; veritabanı değişmez, yanıt önbelleğe alınmaz', async () => {
    const body = likertBody('oz-saygi', 8, (i) => i % 4);
    const res = await quickReportResponse(post('http://localhost:3000/api/hizli-test/oz-saygi', body), 'oz-saygi');
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const json = (await res.json()) as { student: { items: unknown[] }; parent: { items: unknown[] } };
    expect(json.student.items.length).toBeGreaterThan(0);

    const pdf = await quickPdfResponse(post('http://localhost:3000/api/hizli-test/oz-saygi/pdf', { ...body, audience: 'student' }), 'oz-saygi');
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get('content-type')).toBe('application/pdf');
    expect(pdf.headers.get('content-disposition')).toContain('olcekhane-oz-saygi-ogrenci-raporu.pdf');
    expect(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString()).toBe('%PDF-');

    // Başka bir siteden gönderilen istek ve geçersiz gövde reddedilir.
    const foreign = new NextRequest('http://localhost:3000/api/hizli-test/oz-saygi', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://baska.example', host: 'localhost:3000' },
      body: JSON.stringify(body),
    });
    expect((await quickReportResponse(foreign, 'oz-saygi')).status).toBe(403);
    expect((await quickReportResponse(post('http://localhost:3000/api/hizli-test/oz-saygi', { grade: 8, data: { engine: 'likert' } }), 'oz-saygi')).status).toBe(400);
    expect((await quickReportResponse(post('http://localhost:3000/api/hizli-test/yok', body), 'yok')).status).toBe(404);

    expect(await snapshot()).toEqual(before);
  }, 60_000);
});
