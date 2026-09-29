import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { emailOutbox } from '@/db/schema';
import { audit } from '@/lib/audit';
import { requireAdmin } from '@/lib/auth/dal';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

/**
 * Yalnızca gönderilmemiş (SMTP yokken kaydedilmiş ya da gönderilememiş) e-postaların metni gösterilir.
 * Metinde tek kullanımlık bağlantılar bulunabileceği için her görüntüleme denetim kaydına yazılır.
 */
export default async function AdminEmailView(props: PageProps<'/yonetim/eposta/[id]'>) {
  const admin = await requireAdmin();
  const { id } = await props.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [m] = await db.select().from(emailOutbox).where(eq(emailOutbox.id, id)).limit(1);
  if (!m || (m.status !== 'logged' && m.status !== 'failed')) notFound();
  await audit({ actorUserId: admin.id, action: 'email.view', entity: 'email', entityId: id });
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/yonetim/eposta" className="t-small">
        E-postalar
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="t-h2">{m.subject}</h1>
        <p className="t-meta break-all">
          Alıcı: {m.toEmail} · {dateFmt.format(m.createdAt)}
        </p>
      </div>
      <p className="notice notice-warn">
        Bu metindeki bağlantılar alıcıya özeldir. Yalnızca alıcıya iletmeniz gerekiyorsa kullanın; başkasıyla paylaşmayın.
      </p>
      <pre className="panel overflow-x-auto whitespace-pre-wrap break-words p-5 font-body text-[0.95rem] leading-relaxed">{m.text}</pre>
    </div>
  );
}
