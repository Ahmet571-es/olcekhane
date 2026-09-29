import type { Metadata } from 'next';

/** Test çözme sayfaları: sitenin üst ve alt bölümü yoktur, öğrenci yalnızca teste odaklanır. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-paper">{children}</div>;
}
