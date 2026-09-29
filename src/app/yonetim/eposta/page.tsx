import Link from 'next/link';
import { and, desc, eq, ilike, sql, type SQL } from 'drizzle-orm';
import { db } from '@/db';
import { emailOutbox } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/dal';
import { retryEmailAction } from '../actions';

const STATUS: Record<string, { label: string; chip: string }> = {
  sent: { label: 'Gönderildi', chip: 'chip chip-ok' },
  logged: { label: 'Yalnızca kayıt', chip: 'chip chip-brass' },
  failed: { label: 'Gönderilemedi', chip: 'chip chip-danger' },
  queued: { label: 'Sırada', chip: 'chip chip-brass' },
};

const RETRY: Record<string, { ok: boolean; text: string }> = {
  sent: { ok: true, text: 'E-posta gönderildi.' },
  queued: { ok: true, text: 'E-posta sıraya alındı: gönderim sınırı dolduğu ya da geçici bir hata olduğu için birazdan yeniden denenecek.' },
  failed: { ok: false, text: 'E-posta yine gönderilemedi. Hata ayrıntısına bakın.' },
  no_smtp: { ok: false, text: 'SMTP tanımlı olmadığı için yeniden denenemedi.' },
  not_found: { ok: false, text: 'E-posta bulunamadı ya da zaten gönderilmiş.' },
};

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

export default async function AdminOutbox(props: PageProps<'/yonetim/eposta'>) {
  await requireAdmin();
  const q = await props.searchParams;
  const status = typeof q.durum === 'string' && q.durum in STATUS ? (q.durum as keyof typeof STATUS) : null;
  const to = typeof q.alici === 'string' ? q.alici.trim().slice(0, 200) : '';
  const where: SQL[] = [];
  if (status) where.push(eq(emailOutbox.status, status as 'sent' | 'logged' | 'failed' | 'queued'));
  if (to) where.push(ilike(emailOutbox.toEmail, `%${to.replace(/[%_\\]/g, (c) => `\\${c}`)}%`));
  const rows = await db
    .select({
      id: emailOutbox.id,
      toEmail: emailOutbox.toEmail,
      subject: emailOutbox.subject,
      status: emailOutbox.status,
      error: emailOutbox.error,
      attempts: emailOutbox.attempts,
      nextAttemptAt: emailOutbox.nextAttemptAt,
      due: sql<boolean>`coalesce(${emailOutbox.nextAttemptAt} <= now(), true)`,
      createdAt: emailOutbox.createdAt,
    })
    .from(emailOutbox)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(emailOutbox.createdAt))
    .limit(100);
  const retry = typeof q.deneme === 'string' ? RETRY[q.deneme] : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">E-postalar</h1>
        <p className="measure text-ink-2">
          Platformun gönderdiği son 100 e-posta. Gönderilen e-postaların içeriği güvenlik için saklanmaz; SMTP tanımlı değilken yalnızca
          kaydedilen e-postaların içeriği burada açılabilir. E-posta sağlayıcısının gönderim sınırı dolunca e-postalar sırada bekler ve
          sınır açıldıkça gönderilir; geçici hatalarda iki güne kadar artan aralıklarla yeniden denenir.
        </p>
      </div>
      {retry && (
        <p className={`notice ${retry.ok ? 'notice-ok' : 'notice-danger'}`} role="status">
          {retry.text}
        </p>
      )}
      <form className="flex flex-wrap items-end gap-3" role="search">
        <div className="field">
          <label htmlFor="alici" className="field-label">
            Alıcı
          </label>
          <input id="alici" name="alici" type="search" className="input" defaultValue={to} placeholder="e-posta adresi" />
        </div>
        <div className="field">
          <label htmlFor="durum" className="field-label">
            Durum
          </label>
          <select id="durum" name="durum" className="input" defaultValue={status ?? ''}>
            <option value="">Hepsi</option>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-secondary">
          Süz
        </button>
      </form>
      {rows.length === 0 ? (
        <p className="text-ink-2">E-posta yok.</p>
      ) : (
        <ul className="panel divide-y divide-rule">
          {rows.map((r) => (
            <li key={r.id} className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <p className="font-bold">
                  {r.status === 'logged' || r.status === 'failed' ? <Link href={`/yonetim/eposta/${r.id}`}>{r.subject}</Link> : r.subject}
                </p>
                <p className="t-meta break-all">
                  {r.toEmail} · {dateFmt.format(r.createdAt)}
                </p>
                {r.status === 'queued' && (
                  <p className="t-small text-ink-2">
                    {r.attempts > 0 ? `${r.attempts}. deneme başarısız; ` : 'Gönderim sınırı nedeniyle bekliyor; '}
                    {r.nextAttemptAt && !r.due ? `sıradaki deneme ${dateFmt.format(r.nextAttemptAt)}` : 'ilk fırsatta gönderilecek'}.
                  </p>
                )}
                {r.error && <p className="t-small break-words text-danger">{r.error}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={STATUS[r.status]?.chip ?? 'chip'}>{STATUS[r.status]?.label ?? r.status}</span>
                {r.status === 'failed' && (
                  <form action={retryEmailAction}>
                    <input type="hidden" name="emailId" value={r.id} />
                    <button type="submit" className="btn btn-secondary min-h-10">
                      Yeniden dene
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
