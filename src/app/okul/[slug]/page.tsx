import Link from 'next/link';
import { GRADE_LABELS } from '@/lib/config';
import { ROLE_LABELS, requireOrg } from '@/lib/school/access';
import { orgClasses, orgParticipation } from '@/lib/school/queries';

const nf = new Intl.NumberFormat('tr-TR');

const STEPS = [
  ['Sınıf oluşturun', 'Sınıfın adını ve düzeyini girin (ör. 7-A, 7. sınıf).'],
  ['Öğrenci listesini aktarın', 'Ad, soyad, okul numarası ve veli e-postasını tablodan kopyalayıp yapıştırın.'],
  ['Veli onayı isteyin', 'Rehber öğretmen velilere e-postayla onay bağlantısı gönderir; onay vermeyen velinin çocuğu test çözemez.'],
  ['Giriş kodlarını dağıtın', 'Rehber öğretmen her öğrenci için kısa bir kod üretir; kodları yazdırıp öğrencilere verin.'],
  ['Test atayın', 'Sınıf düzeyine uygun testleri atayın ve kimlerin tamamladığını izleyin.'],
];

export default async function OrgHome(props: PageProps<'/okul/[slug]'>) {
  const { slug } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireOrg(slug);
  const [list, part] = await Promise.all([orgClasses(ctx), orgParticipation(ctx.org.id)]);

  return (
    <div className="flex flex-col gap-10">
      {q.katildiniz === '1' && <p className="notice notice-ok">Ekibe katıldınız. Hoş geldiniz!</p>}
      {q.silindi === '1' && <p className="notice notice-ok">Sınıf silindi. Öğrenci kayıtları ve sonuçları korunur.</p>}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="t-h1">{ctx.org.name}</h1>
          <p className="text-ink-2">
            {[ctx.org.district, ctx.org.city].filter(Boolean).join(', ')}
            {ctx.org.city || ctx.org.district ? ' · ' : ''}
            {ctx.roles.map((r) => ROLE_LABELS[r]).join(', ')}
          </p>
        </div>
        {ctx.can.manageClasses && (
          <Link href={`/okul/${slug}/sinif/yeni`} className="btn btn-primary">
            Sınıf ekle
          </Link>
        )}
      </div>

      {ctx.can.seeAllClasses && (
        <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
          <div className="bg-surface p-5">
            <dt className="t-meta">Öğrenci</dt>
            <dd className="font-display text-3xl font-bold tabular">{nf.format(part.students)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="t-meta">Veli onayı verilen</dt>
            <dd className="font-display text-3xl font-bold tabular">{nf.format(part.consented)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="t-meta">Tamamlanan uygulama</dt>
            <dd className="font-display text-3xl font-bold tabular">{nf.format(part.completed)}</dd>
          </div>
        </dl>
      )}

      <section aria-labelledby="siniflar" className="flex flex-col gap-4">
        <h2 id="siniflar" className="t-h2">
          {ctx.can.seeAllClasses ? 'Sınıflar' : 'Sınıflarım'}
        </h2>
        {list.length === 0 ? (
          ctx.can.manageClasses ? (
            <div className="panel flex flex-col gap-5 p-6 md:p-8">
              <p className="font-bold">Başlamak için beş adım</p>
              <ol className="flex flex-col gap-4">
                {STEPS.map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[2.25rem_1fr] gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-ink font-bold" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold">{t}</p>
                      <p className="t-small text-ink-2">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div>
                <Link href={`/okul/${slug}/sinif/yeni`} className="btn btn-primary">
                  İlk sınıfı oluştur
                </Link>
              </div>
            </div>
          ) : (
            <p className="panel p-6 text-ink-2">
              Size henüz bir sınıf atanmadı. Rehber öğretmeninizden ya da okul yöneticinizden sizi sınıfınıza eklemesini isteyin.
            </p>
          )
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <li key={c.id}>
                <Link href={`/okul/${slug}/sinif/${c.id}`} className="panel flex h-full flex-col gap-3 p-5 no-underline hover:border-ink">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-2xl font-bold">{c.name}</span>
                    <span className="t-meta">{c.academicYear}</span>
                  </div>
                  <span className="t-meta">{GRADE_LABELS[c.grade]}</span>
                  <span className="t-small tabular text-ink-2">
                    {c.students} öğrenci · {c.consented} veli onayı · {c.openAssignments} açık test
                  </span>
                  {c.students > 0 && (
                    <span className="h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                      <span className="block h-full rounded-full bg-ok" style={{ width: `${Math.round((c.consented / c.students) * 100)}%` }} />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
