import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { requireAdmin } from '@/lib/auth/dal';
import { STATUS_LABELS } from '@/lib/config';
import { activeConsentSql } from '@/lib/school/queries';

const nf = new Intl.NumberFormat('tr-TR');

const ENGINE: Record<string, string> = {
  likert: 'Ölçek',
  quiz: 'Akademik tanı',
  reading: 'Okuma',
  tasks: 'Bilişsel görevler',
};

export default async function PsychometricsHome() {
  await requireAdmin();
  const rows = await db.execute<{
    slug: string;
    name: string;
    status: string;
    engine: string;
    version: number;
    completed: number;
    research: number;
    active_norms: number;
  }>(sql`
    select i.slug, i.name, i.status, i.engine, v.version,
      (select count(*)::int from attempts a where a.version_id = v.id and a.status = 'completed') as completed,
      (select count(distinct a.student_id)::int from attempts a
        join students s on s.id = a.student_id and s.deleted_at is null
        where a.version_id = v.id and a.status = 'completed'
          and ${activeConsentSql(sql`a.student_id`)} and ${activeConsentSql(sql`a.student_id`, 'consent_research')}) as research,
      (select count(*)::int from norm_sets n where n.version_id = v.id and n.is_active) as active_norms
    from instruments i
    join instrument_versions v on v.instrument_id = i.id and v.is_current
    order by i.sort_order
  `);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Psikometri</h1>
        <p className="measure text-ink-2">
          Madde analizi, güvenirlik ve norm çalışmaları. Analizlere yalnızca velisi hem ölçme hem araştırma rızası vermiş öğrencilerin, testin
          şu anki sürümündeki ilk uygulaması girer; rızasını geri alanların verisi yeni analizlere alınmaz.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-rule">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="p-4">
                Test
              </th>
              <th scope="col" className="p-4">
                Tür
              </th>
              <th scope="col" className="p-4 text-right">
                Tamamlanan
              </th>
              <th scope="col" className="p-4 text-right">
                Araştırma örneklemi
              </th>
              <th scope="col" className="p-4">
                Norm
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-rule">
                <th scope="row" className="p-4 font-normal">
                  <Link href={`/yonetim/psikometri/${r.slug}`} className="font-bold">
                    {r.name}
                  </Link>
                  <span className="t-meta block">
                    Sürüm {r.version} · {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </th>
                <td className="p-4">{ENGINE[r.engine] ?? r.engine}</td>
                <td className="p-4 text-right tabular">{nf.format(r.completed)}</td>
                <td className="p-4 text-right tabular">{nf.format(r.research)}</td>
                <td className="p-4">
                  {r.engine === 'quiz' || r.engine === 'reading' ? (
                    <span className="t-meta">Ölçüt dayanaklı</span>
                  ) : r.engine === 'tasks' ? (
                    <span className="t-meta">Betimsel istatistik</span>
                  ) : r.active_norms > 0 ? (
                    <span className="chip chip-ok">Etkin norm var</span>
                  ) : (
                    <span className="chip">Norm yok</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-meta measure">
        Akademik tanı testi ve okuma soruları öğrenciyi akranlarıyla değil, sorulardaki ölçütlerle değerlendirir; bu testler için norm yerine
        madde ve güvenirlik analizi yapılır. Bilişsel görevlerin puanlaması henüz norm kullanmıyor; bu görevler için sınıf düzeyine göre
        betimsel istatistikler ve yarılama güvenirliği gösterilir.
      </p>
    </div>
  );
}
