import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { jsonError, sameOrigin } from '@/lib/api-guard';
import { siteUrl } from '@/lib/config';
import { errorSummary } from '@/lib/log';
import { memoryRateLimit } from '@/lib/memory-rate-limit';
import { clientIpBucket } from '@/lib/request';
import { AssessmentError, evaluate } from './evaluate';
import { answersBody, pdfBody } from './schemas';

/**
 * Rapor uçlarının ortak işleyişi. İstek gövdesi (cevaplar) hiçbir yere yazılmaz: ne diske ne günlüğe.
 * Hatalarda günlüğe yalnızca hatanın türü ve iletisi yazılır. Hız sınırı için IP adresi yalnızca
 * bellekte tutulur ve en geç 11 dakikada silinir (bkz. memory-rate-limit).
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
  console.error(`[rapor] ${where}: ${errorSummary(err)}`);
  return jsonError(500, 'Rapor hazırlanamadı. Lütfen biraz sonra tekrar deneyin.');
}

/**
 * Hız sınırları. Aynı IP adresini paylaşan pek çok kişi olabilir (mobil operatörlerin ortak adresleri, okul
 * ve ev ağları); bu yüzden kişi başına sınırlar cömerttir. Asıl koruma sunucunun tamamı için konan PDF
 * sınırıdır: PDF üretimi işlemci ister.
 */
export const RATE_LIMITS = {
  /** Bir IP adresinden 10 dakikada en çok bu kadar rapor. */
  reportPerIp: 120,
  /** Bir IP adresinden 10 dakikada en çok bu kadar PDF. */
  pdfPerIp: 60,
  /** Sunucunun tamamında dakikada en çok bu kadar PDF. */
  pdfTotalPerMinute: 120,
} as const;

async function limited(kind: 'rapor' | 'pdf'): Promise<boolean> {
  const ip = await clientIpBucket();
  const perIp = kind === 'rapor' ? RATE_LIMITS.reportPerIp : RATE_LIMITS.pdfPerIp;
  if (!memoryRateLimit(`${kind}:${ip}`, perIp, 600)) return true;
  if (kind === 'pdf' && !memoryRateLimit('pdf:toplam', RATE_LIMITS.pdfTotalPerMinute, 60)) return true;
  return false;
}

/** Cevapları puanlayıp öğrenci ve veli için basit raporu döndürür. */
export async function reportResponse(req: NextRequest, slug: string) {
  if (!sameOrigin(req)) return jsonError(403, 'İstek reddedildi.');
  if (await limited('rapor')) return jsonError(429, 'Çok sık istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
  const parsed = answersBody.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    return NextResponse.json(evaluate(slug, parsed.data), { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    if (err instanceof AssessmentError) return assessmentError(err);
    return unexpected('rapor', err);
  }
}

/** Aynı cevaplardan raporun PDF'ini üretir; dosya bellekte hazırlanıp doğrudan gönderilir. */
export async function pdfResponse(req: NextRequest, slug: string) {
  if (!sameOrigin(req)) return jsonError(403, 'İstek reddedildi.');
  if (await limited('pdf')) return jsonError(429, 'Çok sık istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
  const parsed = pdfBody.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    const { audience, ...body } = parsed.data;
    const result = evaluate(slug, body);
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
