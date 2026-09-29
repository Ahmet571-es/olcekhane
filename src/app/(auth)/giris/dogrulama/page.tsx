import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { homeFor } from '@/lib/auth/home';
import { getSession } from '@/lib/auth/session';
import { pendingSecondStep } from '@/lib/auth/two-factor';
import { SecondStepForm } from './second-step-form';

export const metadata: Metadata = { title: 'İki aşamalı doğrulama', robots: { index: false } };

export default async function SecondStepPage() {
  const s = await getSession();
  if (s?.kind === 'user') redirect(await homeFor(s.user));
  const pending = await pendingSecondStep();
  if (!pending) {
    return (
      <div className="w-full max-w-[26rem]">
        <h1 className="t-h1 mb-3">Girişin süresi doldu</h1>
        <p className="mb-6 text-ink-2">Güvenliğiniz için ikinci adım 10 dakika içinde tamamlanmalı. Lütfen yeniden giriş yapın.</p>
        <Link href="/giris" className="btn btn-primary">
          Giriş sayfasına dön
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="t-h1 mb-2">İki aşamalı doğrulama</h1>
      <p className="mb-8 text-ink-2">
        Kimlik doğrulama uygulamanızdaki 6 haneli kodu yazın. Telefonunuz yanınızda değilse kurtarma kodlarınızdan birini kullanabilirsiniz.
      </p>
      <SecondStepForm />
    </div>
  );
}
