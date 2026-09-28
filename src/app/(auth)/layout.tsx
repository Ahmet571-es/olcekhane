import Link from 'next/link';
import { Logo } from '@/components/site/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-page flex h-[4.25rem] items-center">
        <Link href="/" className="no-underline" aria-label="Ölçekhane ana sayfa">
          <Logo />
        </Link>
      </header>
      <main id="icerik" className="container-page flex flex-1 items-start justify-center pb-16 pt-6 md:pt-12">
        {children}
      </main>
      <footer className="container-page flex flex-wrap gap-x-5 gap-y-2 pb-8 text-[0.8125rem] text-ink-3">
        <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
        <Link href="/yasal/kullanim-kosullari">Kullanım koşulları</Link>
        <Link href="/yasal/cerez-politikasi">Çerez politikası</Link>
      </footer>
    </div>
  );
}
