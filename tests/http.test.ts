import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RATE_LIMITS, pdfResponse, reportResponse } from '@/lib/assessment/http';
import { memoryRateLimitSize, resetMemoryRateLimit } from '@/lib/memory-rate-limit';
import { likertBody } from './helpers/bodies';

// İstek başlıkları: uygulama Caddy'nin arkasında çalışır, Caddy X-Forwarded-For'a istemcinin adresini ekler.
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '198.51.100.23' }),
}));

const SITE = 'http://localhost:3000';

function post(path: string, body: unknown, origin = SITE) {
  return new NextRequest(`${SITE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin, host: 'localhost:3000' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('rapor uçları', () => {
  const logs: unknown[][] = [];
  beforeEach(() => {
    resetMemoryRateLimit();
    logs.length = 0;
    for (const m of ['log', 'info', 'warn', 'error', 'debug'] as const) {
      vi.spyOn(console, m).mockImplementation((...args: unknown[]) => void logs.push(args));
    }
  });
  afterEach(() => vi.restoreAllMocks());

  it('rapor JSON olarak, PDF dosya olarak döner; yanıtlar önbelleğe alınmaz ve günlüğe hiçbir şey yazılmaz', async () => {
    const body = likertBody('oz-saygi', 8, (i) => i % 4);
    const res = await reportResponse(post('/api/rapor/oz-saygi', body), 'oz-saygi');
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const json = (await res.json()) as { student: { items: unknown[] }; parent: { items: unknown[] } };
    expect(json.student.items.length).toBeGreaterThan(0);
    expect(json.parent.items.length).toBeGreaterThan(0);

    const pdf = await pdfResponse(post('/api/rapor/oz-saygi/pdf', { ...body, audience: 'parent' }), 'oz-saygi');
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get('content-type')).toBe('application/pdf');
    expect(pdf.headers.get('cache-control')).toBe('no-store');
    expect(pdf.headers.get('content-disposition')).toContain('olcekhane-oz-saygi-veli-raporu.pdf');
    expect(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString()).toBe('%PDF-');

    expect(logs).toEqual([]);
  }, 60_000);

  it('yetişkine yalnızca kişisel rapor ve onun PDF’i; yetişkinlere açık olmayan testte yetişkin seçimi reddedilir', async () => {
    const slug = 'ayrintili-kisilik-profili';
    const body = { ...likertBody(slug, 10, (i) => i % 5), grade: 14 };
    const res = await reportResponse(post(`/api/rapor/${slug}`, body), slug);
    expect(res.status).toBe(200);
    const json = (await res.json()) as Record<string, { audience: string }>;
    expect(Object.keys(json)).toEqual(['adult']);
    expect(json.adult.audience).toBe('adult');

    const pdf = await pdfResponse(post(`/api/rapor/${slug}/pdf`, { ...body, audience: 'adult' }), slug);
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get('content-disposition')).toContain(`olcekhane-${slug}-kisisel-raporu.pdf`);
    expect(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString()).toBe('%PDF-');
    // Yetişkin için veli raporu, okul çağındaki için kişisel rapor hazırlanmaz.
    expect((await pdfResponse(post(`/api/rapor/${slug}/pdf`, { ...body, audience: 'parent' }), slug)).status).toBe(400);
    expect((await pdfResponse(post(`/api/rapor/${slug}/pdf`, { ...body, grade: 10, audience: 'adult' }), slug)).status).toBe(400);
    const oz = { ...likertBody('oz-saygi', 8, () => 1), grade: 14 };
    expect((await reportResponse(post('/api/rapor/oz-saygi', oz), 'oz-saygi')).status).toBe(400);
    expect(logs).toEqual([]);
  }, 60_000);

  it('başka siteden gelen istek, bozuk gövde ve bilinmeyen test reddedilir', async () => {
    const body = likertBody('oz-saygi', 8, () => 1);
    expect((await reportResponse(post('/api/rapor/oz-saygi', body, 'https://baska.example'), 'oz-saygi')).status).toBe(403);
    expect((await reportResponse(post('/api/rapor/oz-saygi', '{bozuk'), 'oz-saygi')).status).toBe(400);
    expect((await reportResponse(post('/api/rapor/oz-saygi', { ...body, grade: 3 }), 'oz-saygi')).status).toBe(400);
    expect((await reportResponse(post('/api/rapor/yok', body), 'yok')).status).toBe(404);
    expect((await pdfResponse(post('/api/rapor/oz-saygi/pdf', body), 'oz-saygi')).status).toBe(400);
    expect(logs).toEqual([]);
  });

  it('hız sınırı IP adresine göre bellekte sayılır; sınır aşılınca reddeder', async () => {
    const body = likertBody('oz-saygi', 8, () => 2);
    for (let i = 0; i < RATE_LIMITS.reportPerIp; i++) {
      expect((await reportResponse(post('/api/rapor/oz-saygi', body), 'oz-saygi')).status).toBe(200);
    }
    expect((await reportResponse(post('/api/rapor/oz-saygi', body), 'oz-saygi')).status).toBe(429);
    // Tek sayaç: bu istemcinin rapor sayacı. Sayaç yalnızca bellektedir ve süresi dolunca silinir.
    expect(memoryRateLimitSize()).toBe(1);
  });

  it('beklenmeyen hatada günlüğe yalnızca hatanın türü yazılır; cevaplar yazılmaz', async () => {
    const pdfModule = await import('@/lib/pdf/simple-report');
    vi.spyOn(pdfModule, 'renderSimpleReportPdf').mockRejectedValue(new TypeError('yazı tipi yüklenemedi'));
    const body = likertBody('oz-saygi', 8, (i) => i % 4);
    const res = await pdfResponse(post('/api/rapor/oz-saygi/pdf', { ...body, audience: 'student' }), 'oz-saygi');
    expect(res.status).toBe(500);
    expect(logs).toHaveLength(1);
    const line = String(logs[0][0]);
    expect(line).toBe('[rapor] pdf: TypeError: yazı tipi yüklenemedi');
    expect(line).not.toContain('answers');
  });
});
