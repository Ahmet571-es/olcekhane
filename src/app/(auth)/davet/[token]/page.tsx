import type { Metadata } from 'next';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { ROLE_LABELS } from '@/lib/school/access';
import { inviteDetails } from '@/lib/school/invites';
import { logoutAction } from '../../actions';
import { acceptInviteAction } from '../actions';
import { InviteRegisterForm } from './invite-register-form';

export const metadata: Metadata = { title: 'Okul ekibine davet', robots: { index: false, follow: false } };

export default async function InvitePage(props: PageProps<'/davet/[token]'>) {
  const { token } = await props.params;
  const inv = await inviteDetails(token);
  if (!inv) {
    return (
      <div className="w-full max-w-[30rem]">
        <h1 className="t-h1 mb-3">Davet bağlantısı geçersiz</h1>
        <p className="text-ink-2">
          Bağlantının süresi dolmuş, daha önce kullanılmış ya da davet geri alınmış olabilir. Okul yöneticinizden yeni bir davet
          isteyebilirsiniz.
        </p>
        <p className="mt-6">
          <Link href="/giris">Giriş sayfasına git</Link>
        </p>
      </div>
    );
  }
  const session = await getSession();
  const role = ROLE_LABELS[inv.role].toLocaleLowerCase('tr-TR');
  const intro = (
    <>
      <h1 className="t-h1 mb-3">{inv.orgName}</h1>
      <p className="mb-8 text-ink-2">
        Bu okulun Ölçekhane ekibine <strong className="text-ink">{role}</strong> olarak davet edildiniz. Davet {inv.email} adresine gönderildi.
      </p>
    </>
  );

  if (session?.kind === 'user') {
    if (session.user.email === inv.email) {
      return (
        <div className="w-full max-w-[30rem]">
          {intro}
          <form action={acceptInviteAction.bind(null, token)}>
            <button type="submit" className="btn btn-primary btn-lg w-full">
              Daveti kabul et
            </button>
          </form>
        </div>
      );
    }
    return (
      <div className="w-full max-w-[30rem]">
        {intro}
        <p className="notice notice-warn">
          Şu anda {session.user.email} hesabıyla giriş yapmış durumdasınız. Daveti kabul etmek için çıkış yapıp {inv.email} adresiyle giriş
          yapın ya da hesap açın.
        </p>
        <form action={logoutAction} className="mt-5">
          <button type="submit" className="btn btn-secondary">
            Çıkış yap
          </button>
        </form>
      </div>
    );
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, inv.email)).limit(1);
  if (existing) {
    return (
      <div className="w-full max-w-[30rem]">
        {intro}
        <p className="mb-5">Bu e-posta adresiyle bir hesabınız var. Daveti kabul etmek için giriş yapın.</p>
        <Link href={`/giris?sonra=${encodeURIComponent(`/davet/${token}`)}`} className="btn btn-primary btn-lg w-full">
          Giriş yap
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full max-w-[30rem]">
      {intro}
      <p className="mb-6">Daveti kabul etmek için hesabınızı oluşturun. E-posta adresiniz davet bağlantısıyla doğrulanmış sayılır.</p>
      <InviteRegisterForm token={token} email={inv.email} />
    </div>
  );
}
