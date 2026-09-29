import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { sameOrigin, jsonError } from '@/lib/api-guard';
import { siteUrl } from '@/lib/config';
import { errorSummary } from '@/lib/log';
import { memoryRateLimit } from '@/lib/memory-rate-limit';
import { clientIpBucket } from '@/lib/request';
import { AssessmentError } from './service';
import { quickReports } from './quick';
import { quickBody, quickPdfBody } from './schemas';

/**
 * Hızlı test uçlarının ortak işleyişi. İstek gövdesi (cevaplar) hiçbir yere yazılmaz: ne veritabanına
 * ne günlüğe. Hatalarda günlüğe yalnızca hatanın türü ve iletisi yazılır. Hız sınırı bellekte tutulur;
 * istemci adresi veritabanına düşmez.
 */

/** Bir test en çok birkaç bin cevap içerir; bundan büyük gövde okunmadan reddedilir. */
const MAX_BODY_BYTES = 512 * 1024;

async function readJson(req: NextRequest): Promise<unknown> {
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY_BYTES) return null;
  if (!req.body) return null;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function assessmentError(err: AssessmentError) {
  return jsonError(err.code === 'not_found' ? 404 : 400, err.message);
}

function unexpected(where: string, err: unknown) {
  console.error(`[hızlı test] ${where}: ${errorSummary(err)}`);
  return jsonError(500, 'Rapor hazırlanamadı. Lütfen biraz sonra tekrar deneyin.');
}

async function limited(kind: 'rapor' | 'pdf'): Promise<boolean> {
  const ip = await clientIpBucket();
  // Kişi başına: 10 dakikada 30 istek. Sunucunun tamamı için: dakikada 120 PDF (PDF üretimi işlemci ister).
  if (!memoryRateLimit(`hizli-${kind}:${ip}`, 30, 600)) return true;
  if (kind === 'pdf' && !memoryRateLimit('hizli-pdf:toplam', 120, 60)) return true;
  return false;
}

/** Cevapları puanlayıp öğrenci ve veli için basit raporu döndürür. */
export async function quickReportResponse(req: NextRequest, slug: string) {
  if (!sameOrigin(req)) return jsonError(403, 'İstek reddedildi.');
  if (await limited('rapor')) return jsonError(429, 'Çok sık istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
  const parsed = quickBody.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    const result = await quickReports(slug, parsed.data);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    if (err instanceof AssessmentError) return assessmentError(err);
    return unexpected('rapor', err);
  }
}

/** Aynı cevaplardan raporun PDF'ini üretir; dosya bellekte hazırlanıp doğrudan gönderilir. */
export async function quickPdfResponse(req: NextRequest, slug: string) {
  if (!sameOrigin(req)) return jsonError(403, 'İstek reddedildi.');
  if (await limited('pdf')) return jsonError(429, 'Çok sık istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
  const parsed = quickPdfBody.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    const { audience, ...body } = parsed.data;
    const result = await quickReports(slug, body);
    const { renderSimpleReportPdf } = await import('@/lib/pdf/simple-report');
    const pdf = await renderSimpleReportPdf(result[audience], new URL(siteUrl()).host);
    const file = `olcekhane-${slug}-${audience === 'student' ? 'ogrenci' : 'veli'}-raporu.pdf`;
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (err instanceof AssessmentError) return assessmentError(err);
    return unexpected('pdf', err);
  }
}
