import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/site/logo';
import { requireStudent } from '@/lib/auth/dal';
import { studentLogoutAction } from '../(auth)/ogrenci-girisi/actions';

export const metadata: Metadata = { title: 'Öğrenci sayfam', robots: { index: false, follow: false } };

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const student = await requireStudent('/ogrenci');
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-rule bg-surface print:hidden">
        <div className="container-page flex min-h-[4.25rem] items-center justify-between gap-4 py-2">
          <Link href="/ogrenci" className="no-underline" aria-label="Öğrenci sayfam">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="t-small hidden text-ink-2 sm:inline">{student.firstName}</span>
            <form action={studentLogoutAction}>
              <button type="submit" className="btn btn-secondary min-h-10 px-3.5">
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="icerik" className="container-page flex-1 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
