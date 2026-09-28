import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetForm } from './reset-form';

export const metadata: Metadata = { title: 'Yeni şifre belirle', robots: { index: false } };

export default async function ResetPage(props: PageProps<'/sifre-yenile'>) {
  const q = await props.searchParams;
  const token = typeof q.t === 'string' ? q.t : '';
  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="t-h1 mb-2">Yeni şifre belirle</h1>
      {token ? (
        <>
          <p className="mb-8 text-ink-2">Yeni şifrenizi kaydettiğinizde diğer cihazlardaki oturumlarınız kapatılır.</p>
          <ResetForm token={token} />
        </>
      ) : (
        <p className="mb-8 text-ink-2">
          Bağlantı eksik. <Link href="/sifremi-unuttum">Yeni bir şifre yenileme bağlantısı isteyin.</Link>
        </p>
      )}
    </div>
  );
}
