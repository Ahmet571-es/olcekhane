import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { homeFor, safeNextPath } from '@/lib/auth/home';
import { getSession } from '@/lib/auth/session';
import { accountsOpen } from '@/lib/site';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Giriş yap', robots: { index: false } };

export default async function LoginPage(props: PageProps<'/giris'>) {
  const s = await getSession();
  const q = await props.searchParams;
  const next = safeNextPath(q.sonra) ?? '';
  // Oturumu açık olan kullanıcı doğrudan gideceği yere (ya da kendi paneline) gönderilir.
  if (s?.kind === 'user') redirect(next || (await homeFor(s.user)));
  const accounts = accountsOpen();
  return (
    <div className="w-full max-w-[26rem]">
      {q.hesap === 'kapatildi' && (
        <p className="notice notice-ok mb-6" role="status">
          Hesabınız kapatıldı. Bilgilendirme e-postası gönderdik.
        </p>
      )}
      <h1 className="t-h1 mb-2">Giriş yap</h1>
      {accounts ? (
        <p className="mb-8 text-ink-2">Veli, öğretmen ve okul hesapları için.</p>
      ) : (
        <p className="mb-8 text-ink-2">
          Yönetici girişi. Veli, okul ve öğrenci hesapları şu an kapalı; testleri hesap açmadan çözebilirsiniz:{' '}
          <Link href="/testler">Testler</Link>
        </p>
      )}
      <LoginForm next={next} accounts={accounts} />
    </div>
  );
}
