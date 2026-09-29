import Link from 'next/link';
import { desc, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/dal';
import { setMessageHandledAction } from '../actions';

const TOPICS: Record<string, string> = {
  parent: 'Veli',
  school: 'Okul başvurusu',
  press: 'Basın',
  kvkk: 'KVKK başvurusu',
  other: 'Diğer',
};

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

export default async function AdminMessages(props: PageProps<'/yonetim/mesajlar'>) {
  await requireAdmin();
  const q = await props.searchParams;
  const all = q.goster === 'tumu';
  const rows = await db
    .select()
    .from(contactMessages)
    .where(all ? undefined : isNull(contactMessages.handledAt))
    .orderBy(desc(contactMessages.createdAt))
    .limit(200);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Mesajlar</h1>
        <p className="measure text-ink-2">
          İletişim formundan gelenler. KVKK başvuruları yasal olarak en geç 30 gün içinde yanıtlanmalıdır; yanıtladıktan sonra “İşlendi” olarak
          işaretleyin.
        </p>
      </div>
      <nav aria-label="Mesaj süzgeci" className="inline-flex self-start rounded-lg border border-rule-strong p-1">
        <Link
          href="/yonetim/mesajlar"
          aria-current={!all ? 'page' : undefined}
          className={`rounded-md px-3.5 py-1.5 text-[0.95rem] font-bold no-underline ${!all ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
        >
          Bekleyenler
        </Link>
        <Link
          href="/yonetim/mesajlar?goster=tumu"
          aria-current={all ? 'page' : undefined}
          className={`rounded-md px-3.5 py-1.5 text-[0.95rem] font-bold no-underline ${all ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
        >
          Tümü
        </Link>
      </nav>
      {rows.length === 0 ? (
        <p className="text-ink-2">{all ? 'Henüz mesaj yok.' : 'Bekleyen mesaj yok.'}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((m) => {
            const kvkkDue = m.topic === 'kvkk' && !m.handledAt ? new Date(m.createdAt.getTime() + 30 * 86400_000) : null;
            return (
              <li key={m.id} className="panel flex flex-col gap-3 p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold">
                      {m.name}
                      {m.organization && <span className="font-normal text-ink-2"> · {m.organization}</span>}
                    </p>
                    <p className="t-small break-all text-ink-2">
                      <a href={`mailto:${m.email}`}>{m.email}</a>
                      {m.phone && ` · ${m.phone}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={m.topic === 'kvkk' ? 'chip chip-brass' : 'chip'}>{TOPICS[m.topic] ?? m.topic}</span>
                    {m.handledAt && <span className="chip chip-ok">İşlendi</span>}
                  </div>
                </div>
                <p className="whitespace-pre-wrap break-words">{m.message}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="t-meta">
                    {dateFmt.format(m.createdAt)}
                    {kvkkDue && ` · yasal yanıt süresi ${dateFmt.format(kvkkDue)} tarihinde doluyor`}
                  </p>
                  <form action={setMessageHandledAction}>
                    <input type="hidden" name="messageId" value={m.id} />
                    <input type="hidden" name="handled" value={m.handledAt ? '0' : '1'} />
                    <button type="submit" className="btn btn-secondary min-h-10">
                      {m.handledAt ? 'Yeniden aç' : 'İşlendi olarak işaretle'}
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
