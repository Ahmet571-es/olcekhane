import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GroupReportView } from '@/components/report/group-report';
import { PrintButton } from '@/components/report/print-button';
import { getInstrumentDef } from '@/content/instruments';
import { currentVersion } from '@/lib/assessment/service';
import { audit } from '@/lib/audit';
import { requireClass, requireOrg } from '@/lib/school/access';
import { RELEASE_MIN_CHANGE, buildGroupReport, releasedGroupReport } from '@/lib/school/group';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });

function dateRange(a: Date, b: Date) {
  const x = dateFmt.format(a);
  const y = dateFmt.format(b);
  return x === y ? x : `${x} – ${y}`;
}

export default async function GroupReportPage(props: PageProps<'/okul/[slug]/sinif/[classId]/grup/[test]'>) {
  const { slug, classId, test } = await props.params;
  const ctx = await requireOrg(slug);
  if (!ctx.can.seeGroupReports) notFound();
  const cls = await requireClass(ctx, classId);
  const def = getInstrumentDef(test);
  const cv = def ? await currentVersion(test) : null;
  if (!def || !cv) notFound();
  // Rehber öğretmen bireysel sonuçları zaten gördüğü için güncel raporu görür; öğretmenlere fark
  // almaya karşı yayımlanmış rapor gösterilir.
  const view = ctx.can.seeIndividual
    ? ({ state: 'report', report: await buildGroupReport(def, cv.instrumentId, classId, ctx.org.minGroupSize), releasedAt: null, pending: 0 } as const)
    : await releasedGroupReport(def, cv.instrumentId, classId, ctx.org.minGroupSize);
  await audit({
    actorUserId: ctx.user.id,
    action: 'group_report.view',
    entity: 'class',
    entityId: classId,
    meta: { slug: test, n: view.state === 'report' ? view.report.n : view.n, released: !ctx.can.seeIndividual },
  });
  if (view.state === 'updating') {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link href={`/okul/${slug}/sinif/${classId}`} className="t-small">
          {cls.name}
        </Link>
        <h1 className="t-h1">{def.name}</h1>
        <p className="notice notice-info">
          Grup raporu güncelleniyor. Sınıftaki sonuçlarda az sayıda değişiklik oldu (bir sonuç eklendi, çıkarıldı ya da yenilendi). Öncesi ve
          sonrası karşılaştırılarak tek bir öğrencinin sonucu anlaşılmasın diye rapor, en az {RELEASE_MIN_CHANGE} öğrencilik değişiklik
          birikince yeniden yayımlanır.
        </p>
      </div>
    );
  }
  const report = view.report;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/okul/${slug}/sinif/${classId}`} className="t-small">
          {cls.name}
        </Link>
        {!report.insufficient && <PrintButton />}
      </div>
      <header className="flex flex-col gap-3 border-b border-rule pb-8">
        <div className="flex flex-wrap gap-2">
          <span className="chip">Grup raporu</span>
          {def.status === 'pilot' && <span className="chip chip-brass">Pilot test</span>}
        </div>
        <h1 className="t-h1">{def.name}</h1>
        <p className="text-ink-2">
          {cls.name} · {report.n} öğrencinin en son sonucu
          {report.firstCompleted && report.lastCompleted && ` · ${dateRange(report.firstCompleted, report.lastCompleted)}`}
        </p>
        {view.releasedAt && !report.insufficient && (
          <p className="t-meta">
            Bu rapor {dateFmt.format(view.releasedAt)} tarihinde yayımlandı.
            {view.pending > 0 &&
              ` Sonrasında tamamlanan ${view.pending} sonuç, gizlilik için en az ${RELEASE_MIN_CHANGE} yeni sonuç birikince rapora eklenecek.`}
          </p>
        )}
      </header>

      {report.insufficient ? (
        <p className="notice notice-info">
          Grup raporu, kimlik gizliliği için en az {report.minGroupSize} öğrenci testi tamamladığında gösterilir. Şu anda {report.n} öğrencinin sonucu
          var.
        </p>
      ) : (
        <>
          <p className="notice notice-info">
            Bu rapor öğrencilerin kimliğini içermez. Bir ya da iki öğrencilik düzeyler, kimin olduğu tahmin edilmesin diye komşu düzeyle
            birleştirilerek gösterilir. Grup sonuçları sınıfın genel eğilimini anlatır; tek tek öğrenciler hakkında sonuç çıkarmak için
            kullanılmamalıdır.
          </p>
          <GroupReportView report={report} />
        </>
      )}
    </div>
  );
}
