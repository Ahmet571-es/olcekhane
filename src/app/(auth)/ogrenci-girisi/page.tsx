import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AccountsClosed } from '@/components/site/accounts-closed';
import { getSession } from '@/lib/auth/session';
import { accountsOpen } from '@/lib/site';
import { StudentLoginForm } from './student-login-form';

export const metadata: Metadata = {
  title: 'Öğrenci girişi',
  description: 'Okulunun verdiği kısa kodla Ölçekhane’ye giriş yap.',
  robots: { index: false },
};

export default async function StudentLoginPage() {
  const s = await getSession();
  if (s?.kind === 'student') redirect('/ogrenci');
  if (!accountsOpen()) return <AccountsClosed title="Öğrenci girişi şu an kapalı" />;
  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="t-h1 mb-2">Öğrenci girişi</h1>
      <p className="mb-8 text-ink-2">Öğretmeninin verdiği kartta yazan kodu gir. Kodunu kimseyle paylaşma.</p>
      <StudentLoginForm />
      <p className="mt-8 text-[0.95rem] text-ink-2">
        Veli ya da öğretmen misiniz? <Link href="/giris">E-postayla giriş yapın</Link>
      </p>
    </div>
  );
}
