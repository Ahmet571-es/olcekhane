import Link from 'next/link';
import { requireStudent } from '@/lib/auth/dal';
import { hasActiveConsent } from '@/lib/consent';
import { studentAssignments, studentCompleted, studentOrgName } from '@/lib/school/student';
import { startAssignedTestAction } from './actions';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });

const ERRORS: Record<string, string> = {
  atanmamis: 'Bu test sınıfına atanmamış.',
  no_consent: 'Bu testi çözebilmen için velinin onayı gerekiyor. Onay gelince testlerin burada açılacak.',
  grade: 'Bu test sınıf düzeyine uygun değil.',
  not_available: 'Bu test şu anda uygulanmıyor.',
  no_entitlement: 'Bu test için kullanım hakkı bulunmuyor. Öğretmenine söyleyebilirsin.',
};

export default async function StudentHome(props: PageProps<'/ogrenci'>) {
  const student = await requireStudent('/ogrenci');
  const q = await props.searchParams;
  const [assigned, completed, consent, orgName] = await Promise.all([
    studentAssignments(student.id, student.grade),
    studentCompleted(student.id),
    hasActiveConsent(student.id, 'consent_assessment'),
    studentOrgName(student.orgId),
  ]);
  const error = typeof q.hata === 'string' ? ERRORS[q.hata] : undefined;
  const todo = assigned.filter((a) => a.state !== 'done');

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-2">
        {orgName && <p className="t-meta">{orgName}</p>}
        <h1 className="t-h1">Merhaba {student.firstName}!</h1>
        <p className="text-ink-2">
          {todo.length > 0
            ? 'Aşağıda sana atanmış testler var. Her birini sakin bir ortamda, acele etmeden çöz.'
            : 'Şu anda çözmen gereken bir test yok.'}
        </p>
      </div>
      {error && <p className="notice notice-danger">{error}</p>}
      {!consent && assigned.length > 0 && (
        <p className="notice notice-info">
          Testleri çözebilmen için velinin çevrim içi onayı gerekiyor. Okulun velinize e-postayla bir bağlantı gönderdi; onay gelince testler
          açılacak.
        </p>
      )}

      {assigned.length > 0 && (
        <section aria-labelledby="testlerim" className="flex flex-col gap-4">
          <h2 id="testlerim" className="t-h2">
            Testlerim
          </h2>
          <ul className="panel divide-y divide-rule">
            {assigned.map((a) => (
              <li key={a.assignmentId} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-display text-xl font-bold">{a.name}</p>
                  <p className="t-meta">
                    yaklaşık {a.estimatedMinutes} dakika
                    {a.dueAt && ` · son gün ${dateFmt.format(a.dueAt)}`}
                  </p>
                </div>
                {a.state === 'done' ? (
                  <span className="chip chip-ok justify-self-start">Tamamlandı</span>
                ) : (
                  <form action={startAssignedTestAction}>
                    <input type="hidden" name="slug" value={a.slug} />
                    <button type="submit" className="btn btn-primary" disabled={!consent} aria-disabled={!consent}>
                      {a.state === 'started' ? 'Kaldığın yerden devam et' : 'Başla'}
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="raporlarim" className="flex flex-col gap-4">
        <h2 id="raporlarim" className="t-h2">
          Raporlarım
        </h2>
        {!consent ? (
          <p className="text-ink-2">Raporların velinin onayı olduğunda burada görünür.</p>
        ) : completed.length === 0 ? (
          <p className="text-ink-2">Bir testi bitirdiğinde raporun burada görünecek.</p>
        ) : (
          <ul className="panel divide-y divide-rule">
            {completed.map((c) => (
              <li key={c.id}>
                <Link href={`/ogrenci/rapor/${c.id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 no-underline hover:bg-surface-2">
                  <span className="font-bold">{c.name}</span>
                  <span className="t-meta">{c.completedAt ? dateFmt.format(c.completedAt) : ''}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
