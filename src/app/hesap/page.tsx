import Link from 'next/link';
import { and, desc, eq, gt } from 'drizzle-orm';
import { ResendVerification } from '@/components/panel/resend-verification';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { requireUser } from '@/lib/auth/dal';
import { describeAgent, maskIp } from '@/lib/auth/devices';
import { getSession } from '@/lib/auth/session';
import { ROLE_LABELS, userOrgs } from '@/lib/school/access';
import { signOutOtherSessionsAction } from './actions';
import { CloseAccountForm, NameForm, PasswordForm } from './forms';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

const MESSAGES: Record<string, string> = {
  'sifre=yenilendi': 'Şifreniz yenilendi. Diğer cihazlardaki oturumlarınız kapatıldı.',
  'oturumlar=kapatildi': 'Diğer cihazlardaki oturumlarınız kapatıldı.',
};

export default async function AccountPage(props: PageProps<'/hesap'>) {
  const user = await requireUser('/hesap');
  const q = await props.searchParams;
  const s = await getSession();
  const [list, orgs] = await Promise.all([
    db
      .select({ id: sessions.id, userAgent: sessions.userAgent, ip: sessions.ip, lastSeenAt: sessions.lastSeenAt, createdAt: sessions.createdAt })
      .from(sessions)
      .where(and(eq(sessions.userId, user.id), gt(sessions.expiresAt, new Date())))
      .orderBy(desc(sessions.lastSeenAt)),
    userOrgs(user.id),
  ]);
  const msg = Object.entries(MESSAGES).find(([k]) => {
    const [key, val] = k.split('=');
    return q[key] === val;
  })?.[1];
  const currentId = s?.kind === 'user' ? s.sessionId : null;
  const others = list.filter((x) => x.id !== currentId).length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      {msg && (
        <p className="notice notice-ok" role="status">
          {msg}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Hesabım</h1>
        <p className="text-ink-2">Ad, şifre ve oturum ayarlarınız.</p>
      </div>

      <section className="panel flex flex-col gap-5 p-6 md:p-8" aria-labelledby="bilgiler">
        <h2 id="bilgiler" className="t-h3">
          Bilgileriniz
        </h2>
        <dl className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <dt className="t-meta">E-posta</dt>
          <dd className="flex flex-wrap items-center gap-2 break-all">
            {user.email}
            {user.emailVerified ? <span className="chip chip-ok">Doğrulandı</span> : <span className="chip chip-brass">Doğrulanmadı</span>}
          </dd>
          {orgs.length > 0 && (
            <>
              <dt className="t-meta">Okul görevleri</dt>
              <dd className="flex flex-col gap-1">
                {orgs.map((o) => (
                  <span key={o.id}>
                    <Link href={`/okul/${o.slug}`}>{o.name}</Link>{' '}
                    <span className="t-meta">· {o.roles.map((r) => ROLE_LABELS[r]).join(', ')}</span>
                  </span>
                ))}
              </dd>
            </>
          )}
        </dl>
        {!user.emailVerified && <ResendVerification email={user.email} />}
        <NameForm fullName={user.fullName} />
        <p className="t-meta">E-posta adresinizi değiştirmeniz gerekiyorsa bize iletişim sayfasından yazın; kimliğinizi doğruladıktan sonra değiştiririz.</p>
      </section>

      <section className="panel flex flex-col gap-5 p-6 md:p-8" aria-labelledby="sifre">
        <h2 id="sifre" className="t-h3">
          Şifre
        </h2>
        <PasswordForm />
      </section>

      <section className="panel flex flex-col gap-4 p-6 md:p-8" aria-labelledby="iki-asama">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="iki-asama" className="t-h3">
            İki aşamalı doğrulama
          </h2>
          {user.twoFactor ? <span className="chip chip-ok">Açık</span> : <span className="chip">Kapalı</span>}
        </div>
        <p className="t-small text-ink-2">
          {user.twoFactor
            ? 'Girişte şifrenizin yanında telefonunuzdaki kimlik doğrulama uygulamasının kodu da isteniyor.'
            : 'Şifrenizin yanında telefonunuzdaki bir kodla giriş yaparak hesabınızı daha güvenli hale getirin. Rehber öğretmenler ve platform yöneticileri için zorunludur.'}
        </p>
        <div>
          <Link href="/hesap/iki-asamali" className="btn btn-secondary">
            {user.twoFactor ? 'Ayarları aç' : 'Kurulumu başlat'}
          </Link>
        </div>
      </section>

      <section className="panel flex flex-col gap-5 p-6 md:p-8" aria-labelledby="oturumlar">
        <div className="flex flex-col gap-1">
          <h2 id="oturumlar" className="t-h3">
            Açık oturumlar
          </h2>
          <p className="t-small text-ink-2">Tanımadığınız bir cihaz görürseniz diğer oturumları kapatın ve şifrenizi değiştirin.</p>
        </div>
        <ul className="divide-y divide-rule rounded-lg border border-rule">
          {list.map((x) => {
            const ip = maskIp(x.ip);
            return (
              <li key={x.id} className="flex flex-wrap items-baseline justify-between gap-2 p-4">
                <span className="font-bold">
                  {describeAgent(x.userAgent)}
                  {x.id === currentId && <span className="chip chip-ok ml-2 align-middle">Bu cihaz</span>}
                </span>
                <span className="t-meta tabular">
                  Son etkinlik {timeFmt.format(x.lastSeenAt)}
                  {ip ? ` · ${ip}` : ''} · açılış {dateFmt.format(x.createdAt)}
                </span>
              </li>
            );
          })}
        </ul>
        {others > 0 && (
          <form action={signOutOtherSessionsAction}>
            <button type="submit" className="btn btn-secondary">
              Diğer {others} oturumu kapat
            </button>
          </form>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-xl border-[1.5px] border-danger/40 p-6 md:p-8" aria-labelledby="kapat">
        <h2 id="kapat" className="t-h3">
          Hesabı kapat
        </h2>
        <ul className="t-small flex list-disc flex-col gap-1.5 pl-5 text-ink-2">
          <li>Bu hesapla bir daha giriş yapılamaz; hesaptaki adınız ve e-posta adresiniz hemen silinir.</li>
          <li>Sizin açtığınız çocuk profilleri de silinir. Profillere ait ölçme verileri ve raporlar en geç 30 gün içinde kalıcı olarak silinir.</li>
          <li>Okulun eklediği öğrenci kayıtları okulda kalır; o kayıtlar için rızanızı okulun gönderdiği onay bağlantısından geri alabilirsiniz.</li>
          <li>Açık rıza kayıtları, KVKK’daki ispat yükümlülüğümüz nedeniyle erişime kapalı olarak saklanır.</li>
        </ul>
        {user.role === 'admin' ? (
          <p className="t-small">Platform yöneticisi hesabı buradan kapatılamaz.</p>
        ) : (
          <details>
            <summary className="cursor-pointer font-bold">Hesabımı kapatmak istiyorum</summary>
            <div className="mt-4">
              <CloseAccountForm />
            </div>
          </details>
        )}
      </section>
    </div>
  );
}
