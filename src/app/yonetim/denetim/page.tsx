import Link from 'next/link';
import { and, desc, eq, ilike, like, type SQL } from 'drizzle-orm';
import { db } from '@/db';
import { auditLogs, students, users } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/dal';

const PAGE = 50;

const dateFmt = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Istanbul',
});

function escapeLike(v: string) {
  return v.replace(/[%_\\]/g, (c) => `\\${c}`);
}

export default async function AdminAudit(props: PageProps<'/yonetim/denetim'>) {
  await requireAdmin();
  const q = await props.searchParams;
  const action = typeof q.islem === 'string' ? q.islem.trim().slice(0, 60) : '';
  const entityId = typeof q.kayit === 'string' ? q.kayit.trim().slice(0, 80) : '';
  const actor = typeof q.kisi === 'string' ? q.kisi.trim().slice(0, 120) : '';
  const page = Math.max(1, Math.min(1000, Number(q.sayfa) || 1));

  const where: SQL[] = [];
  if (action) where.push(like(auditLogs.action, `${escapeLike(action)}%`));
  if (entityId) where.push(eq(auditLogs.entityId, entityId));
  if (actor) where.push(ilike(users.email, `%${escapeLike(actor)}%`));

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      meta: auditLogs.meta,
      ip: auditLogs.ip,
      createdAt: auditLogs.createdAt,
      userName: users.fullName,
      userEmail: users.email,
      studentName: students.firstName,
    })
    .from(auditLogs)
    .leftJoin(users, eq(users.id, auditLogs.actorUserId))
    .leftJoin(students, eq(students.id, auditLogs.actorStudentId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(auditLogs.id))
    .limit(PAGE + 1)
    .offset((page - 1) * PAGE);
  const hasNext = rows.length > PAGE;
  const list = rows.slice(0, PAGE);
  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (action) u.set('islem', action);
    if (entityId) u.set('kayit', entityId);
    if (actor) u.set('kisi', actor);
    if (p > 1) u.set('sayfa', String(p));
    const s = u.toString();
    return `/yonetim/denetim${s ? `?${s}` : ''}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Denetim kaydı</h1>
        <p className="measure text-ink-2">
          Kimin hangi kaydı ne zaman görüntülediği ya da değiştirdiği. Rapor görüntülemeleri, rıza kararları, girişler, davetler ve okul
          işlemleri burada tutulur.
        </p>
      </div>
      <form className="flex flex-wrap items-end gap-3" role="search">
        <div className="field">
          <label htmlFor="islem" className="field-label">
            İşlem (başlangıcı)
          </label>
          <input id="islem" name="islem" className="input" defaultValue={action} placeholder="ör. report., consent." />
        </div>
        <div className="field">
          <label htmlFor="kayit" className="field-label">
            Kayıt kimliği
          </label>
          <input id="kayit" name="kayit" className="input" defaultValue={entityId} />
        </div>
        <div className="field">
          <label htmlFor="kisi" className="field-label">
            Kişi (e-posta)
          </label>
          <input id="kisi" name="kisi" className="input" defaultValue={actor} />
        </div>
        <button type="submit" className="btn btn-secondary">
          Süz
        </button>
      </form>

      {list.length === 0 ? (
        <p className="text-ink-2">Kayıt yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-rule">
          <table className="w-full min-w-[56rem] border-collapse text-left text-[0.9rem]">
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="p-3">
                  Zaman
                </th>
                <th scope="col" className="p-3">
                  Kim
                </th>
                <th scope="col" className="p-3">
                  İşlem
                </th>
                <th scope="col" className="p-3">
                  Kayıt
                </th>
                <th scope="col" className="p-3">
                  Ayrıntı
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => {
                const meta = r.meta ? JSON.stringify(r.meta) : '';
                return (
                  <tr key={r.id} className="border-t border-rule align-top">
                    <td className="whitespace-nowrap p-3 tabular">{dateFmt.format(r.createdAt)}</td>
                    <td className="p-3">
                      {r.userEmail ? (
                        <span className="break-all">{r.userEmail}</span>
                      ) : r.studentName ? (
                        <span>Öğrenci: {r.studentName}</span>
                      ) : (
                        <span className="text-ink-3">Sistem / ziyaretçi</span>
                      )}
                      {r.ip && <span className="t-meta block">{r.ip}</span>}
                    </td>
                    <td className="p-3 font-mono text-[0.85rem]">{r.action}</td>
                    <td className="p-3">
                      <span className="t-meta block">{r.entity}</span>
                      {r.entityId && (
                        <Link href={`/yonetim/denetim?kayit=${encodeURIComponent(r.entityId)}`} className="break-all font-mono text-[0.8rem]">
                          {r.entityId}
                        </Link>
                      )}
                    </td>
                    <td className="max-w-[22rem] break-words p-3 font-mono text-[0.8rem] text-ink-2">{meta.length > 240 ? `${meta.slice(0, 240)}…` : meta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <nav aria-label="Sayfalar" className="flex gap-3">
        {page > 1 && (
          <Link href={qs(page - 1)} className="btn btn-secondary">
            Daha yeni
          </Link>
        )}
        {hasNext && (
          <Link href={qs(page + 1)} className="btn btn-secondary">
            Daha eski
          </Link>
        )}
      </nav>
    </div>
  );
}
