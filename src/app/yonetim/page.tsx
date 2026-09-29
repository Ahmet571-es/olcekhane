import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { readinessChecks, type CheckStatus } from '@/lib/admin/readiness';
import { requireAdmin } from '@/lib/auth/dal';

const nf = new Intl.NumberFormat('tr-TR');

const STATUS: Record<CheckStatus, { label: string; chip: string }> = {
  ok: { label: 'Hazır', chip: 'chip chip-ok' },
  warn: { label: 'Dikkat', chip: 'chip chip-brass' },
  fail: { label: 'Eksik', chip: 'chip chip-danger' },
  info: { label: 'Bilgi', chip: 'chip' },
};

export default async function AdminHome() {
  await requireAdmin();
  const [[c], checks] = await Promise.all([
    db.execute<{
      parents: number;
      orgs: number;
      students: number;
      completed: number;
      completed30: number;
      messages: number;
      failedMail: number;
      research: number;
    }>(sql`
      select
        (select count(*)::int from users where role = 'parent' and deleted_at is null) as parents,
        (select count(*)::int from organizations where is_active and deleted_at is null) as orgs,
        (select count(*)::int from students where deleted_at is null) as students,
        (select count(*)::int from attempts where status = 'completed') as completed,
        (select count(*)::int from attempts where status = 'completed' and completed_at > now() - interval '30 days') as "completed30",
        (select count(*)::int from contact_messages where handled_at is null) as messages,
        (select count(*)::int from email_outbox where status = 'failed') as "failedMail",
        (select count(distinct cr.subject_student_id)::int from consent_records cr join legal_documents d on d.id = cr.document_id
          where d.kind = 'consent_research' and cr.granted and cr.revoked_at is null) as research
    `),
    readinessChecks(),
  ]);
  const failing = checks.filter((x) => x.status === 'fail').length;

  const tiles: [string, number, string?][] = [
    ['Veli hesabı', c.parents],
    ['Etkin okul', c.orgs, '/yonetim/okullar'],
    ['Öğrenci profili', c.students],
    ['Tamamlanan uygulama', c.completed, '/yonetim/psikometri'],
    ['Son 30 günde', c.completed30],
    ['Araştırma rızası olan öğrenci', c.research, '/yonetim/psikometri'],
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Genel bakış</h1>
        <p className="text-ink-2">Platformun durumu ve yayına hazırlık listesi.</p>
      </div>

      {(c.messages > 0 || c.failedMail > 0) && (
        <div className="flex flex-wrap gap-3">
          {c.messages > 0 && (
            <Link href="/yonetim/mesajlar" className="notice notice-info no-underline">
              {c.messages} yanıt bekleyen mesaj var.
            </Link>
          )}
          {c.failedMail > 0 && (
            <Link href="/yonetim/eposta?durum=failed" className="notice notice-danger no-underline">
              {c.failedMail} e-posta gönderilemedi.
            </Link>
          )}
        </div>
      )}

      <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(([label, value, href]) => (
          <div key={label} className="bg-surface p-5">
            <dt className="t-meta">{href ? <Link href={href}>{label}</Link> : label}</dt>
            <dd className="font-display text-3xl font-bold tabular">{nf.format(value)}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="hazirlik" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="hazirlik" className="t-h2">
            Yayına hazırlık
          </h2>
          <p className="t-small text-ink-2">{failing === 0 ? 'Zorunlu maddelerin hepsi tamam.' : `${failing} zorunlu madde eksik.`}</p>
        </div>
        <ul className="panel divide-y divide-rule">
          {checks.map((x) => (
            <li key={x.key} className="grid gap-2 p-5 sm:grid-cols-[6rem_1fr] sm:gap-5">
              <span>
                <span className={STATUS[x.status].chip}>{STATUS[x.status].label}</span>
              </span>
              <div className="min-w-0">
                <p className="font-bold">{x.label}</p>
                <p className="t-small break-words text-ink-2">{x.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-meta">Ortam değişkenleri sunucudaki .env dosyasından okunur; değiştirdikten sonra uygulamayı yeniden başlatın.</p>
      </section>
    </div>
  );
}
