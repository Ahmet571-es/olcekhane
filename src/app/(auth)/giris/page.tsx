import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Giriş yap', robots: { index: false } };

export default async function LoginPage(props: PageProps<'/giris'>) {
  const s = await getSession();
  if (s?.kind === 'user') redirect('/panel');
  const q = await props.searchParams;
  const next = typeof q.sonra === 'string' ? q.sonra : '';
  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="t-h1 mb-2">Giriş yap</h1>
      <p className="mb-8 text-ink-2">Veli, öğretmen ve okul hesapları için.</p>
      <LoginForm next={next} />
    </div>
  );
}
