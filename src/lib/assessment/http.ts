import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { jsonError, sameOrigin } from '@/lib/api-guard';
import { ADULT_GRADE, AUDIENCE_LABELS, GRADE_LABELS, siteUrl } from '@/lib/config';
import { errorSummary } from '@/lib/log';
import { memoryRateLimit } from '@/lib/memory-rate-limit';
import { clientIpBucket } from '@/lib/request';
import type { Audience } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import { AssessmentError, evaluateReports } from './evaluate';
import { answersBody, packagePdfBody, pdfBody } from './schemas';
import { PACKAGE_AREAS, packageTests } from '@/content/paket';
import type { PackageEntry } from '@/lib/reports/package';

/**
 * Rapor uçlarının ortak işleyişi. İstek gövdesi (cevaplar) hiçbir yere yazılmaz: ne diske ne günlüğe.
 * Hatalarda günlüğe yalnızca hatanın türü ve iletisi yazılır. Hız sınırı için IP adresi yalnızca
 * bellekte tutulur ve en geç 11 dakikada silinir (bkz. memory-rate-limit).
 */

/** Bir test en çok birkaç bin cevap içerir; bundan büyük gövde okunmadan reddedilir. */
const MAX_BODY_BYTES = 512 * 1024;
/** Kendini Tanı Paketi'nin PDF isteği paketteki bütün testlerin cevaplarını taşır. */
const MAX_PACKAGE_BYTES = 2 * 1024 * 1024;

async function readJson(req: NextRequest, max = MAX_BODY_BYTES): Promise<unknown> {
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (declared > max) return null;
  if (!req.body) return null;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
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

/** Cevapları puanlayıp basit raporları döndürür: öğrenci ve veli raporu ya da yetişkinin kişisel raporu. */
export async function reportResponse(req: NextRequest, slug: string) {
  if (!sameOrigin(req)) return jsonError(403, 'İstek reddedildi.');
  if (await limited('rapor')) return jsonError(429, 'Çok sık istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
  const parsed = answersBody.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  try {
    return NextResponse.json(evaluateReports(slug, parsed.data), { headers: { 'Cache-Control': 'no-store' } });
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
    // Yetişkine yalnızca kişisel rapor, okul çağındakine yalnızca öğrenci ve veli raporu: uyuşmayan istek puanlanmadan reddedilir.
    if ((audience === 'adult') !== (body.grade === ADULT_GRADE)) return jsonError(400, 'Geçersiz istek.');
    const reports: Partial<Record<Audience, SimpleReport>> = evaluateReports(slug, body);
    const report = reports[audience];
    if (!report) return jsonError(400, 'Geçersiz istek.');
    const { renderSimpleReportPdf } = await import('@/lib/pdf/simple-report');
    const pdf = await renderSimpleReportPdf(report, new URL(siteUrl()).host);
    const file = `olcekhane-${slug}-${AUDIENCE_LABELS[audience].file}-raporu.pdf`;
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

/**
 * Kendini Tanı Paketi'nin tek PDF'i. Her testin raporu aynı cevaplardan yeniden hazırlanır (tek testin PDF'indeki gibi);
 * başta özet sayfası. Yalnızca o sınıfın paketindeki testler, her biri bir kez kabul edilir. Hiçbir şey kaydedilmez.
 */
export async function packagePdfResponse(req: NextRequest) {
  if (!sameOrigin(req)) return jsonError(403, 'İstek reddedildi.');
  if (await limited('pdf')) return jsonError(429, 'Çok sık istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
  const parsed = packagePdfBody.safeParse(await readJson(req, MAX_PACKAGE_BYTES));
  if (!parsed.success) return jsonError(400, 'Geçersiz istek.');
  const { grade, audience, tests, skipped } = parsed.data;
  if ((audience === 'adult') !== (grade === ADULT_GRADE)) return jsonError(400, 'Geçersiz istek.');
  const plan = packageTests(grade);
  const inPlan = new Set(plan.map((p) => p.def.slug));
  const solved = new Map(tests.map((t) => [t.slug, t.data]));
  if (solved.size !== tests.length || tests.some((t) => !inPlan.has(t.slug))) return jsonError(400, 'Geçersiz istek.');
  if (skipped.some((slug) => !inPlan.has(slug) || solved.has(slug))) return jsonError(400, 'Geçersiz istek.');
  try {
    const now = new Date();
    const entries: PackageEntry[] = plan.flatMap((p) => {
      const data = solved.get(p.def.slug);
      if (!data) return [];
      const reports: Partial<Record<Audience, SimpleReport>> = evaluateReports(p.def.slug, { grade, data }, now);
      const report = reports[audience];
      if (!report) throw new AssessmentError('invalid', 'Geçersiz istek.');
      const areaName = PACKAGE_AREAS.find((a) => a.key === p.slot.area)!.name;
      return [{ slug: p.def.slug, skill: p.slot.skill, areaName, report }];
    });
    const skippedNames = plan.filter((p) => skipped.includes(p.def.slug)).map((p) => p.def.name);
    const { renderPackageReportPdf } = await import('@/lib/pdf/simple-report');
    const pdf = await renderPackageReportPdf(
      { entries, skipped: skippedNames, gradeLabel: GRADE_LABELS[grade] ?? `${grade}. sınıf`, completedAt: now },
      new URL(siteUrl()).host,
    );
    const file = `olcekhane-kendini-tani-paketi-${AUDIENCE_LABELS[audience].file}-raporu.pdf`;
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (err instanceof AssessmentError) return assessmentError(err);
    return unexpected('paket-pdf', err);
  }
}
