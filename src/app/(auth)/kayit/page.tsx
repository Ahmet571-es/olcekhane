import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountsClosed } from '@/components/site/accounts-closed';
import { homeFor, safeNextPath } from '@/lib/auth/home';
import { getSession } from '@/lib/auth/session';
import { accountsOpen } from '@/lib/site';
import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: 'Ücretsiz veli hesabı aç',
  description: 'Ölçekhane veli hesabı ücretsizdir. Çocuğunuzun profilini oluşturun, ücretsiz testlerle başlayın.',
  robots: { index: false },
};

const STEPS = [
  { t: 'E-postanızı doğrulayın', d: 'Hesabınızın size ait olduğunu ve raporlara ulaşabileceğinizi doğrularız.' },
  { t: 'Çocuğunuzun profilini oluşturun', d: 'Yalnızca adı ve sınıfı yeterli. Test verilerinin işlenmesi için açık rızanızı ayrıca istiyoruz.' },
  { t: 'Testi birlikte başlatın', d: 'Çocuğunuz testi çözer; öğrenciye ve veliye özel iki rapor hemen hazırlanır.' },
];

export default async function RegisterPage(props: PageProps<'/kayit'>) {
  const s = await getSession();
  const q = await props.searchParams;
  const next = safeNextPath(q.sonra) ?? '';
  if (s?.kind === 'user') redirect(next || (await homeFor(s.user)));
  if (!accountsOpen()) return <AccountsClosed title="Hesap açma şu an kapalı" />;
  return (
    <div className="grid w-full max-w-5xl gap-12 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-16">
      <div>
        <h1 className="t-h1 mb-2">Veli hesabı aç</h1>
        <p className="mb-8 text-ink-2">Hesap ücretsizdir. Ücretsiz testler için ödeme bilgisi istemiyoruz.</p>
        <RegisterForm next={next} />
      </div>
      <aside className="hidden md:block">
        <div className="panel p-8">
          <h2 className="t-h3 mb-6">Kayıttan sonra</h2>
          <ol className="flex flex-col gap-6">
            {STEPS.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[2.25rem_1fr] gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rule-strong font-display text-lg font-bold tabular" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{s.t}</p>
                  <p className="t-small text-ink-2">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="t-meta mt-5 max-w-[46ch]">
          Çocuğunuzun verileri reklam, pazarlama ya da yapay zekâ eğitimi için kullanılmaz. Ayrıntılar aydınlatma metninde.
        </p>
      </aside>
    </div>
  );
}
