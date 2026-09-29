import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Hızlı test', robots: { index: false, follow: false } };

export default function QuickLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-paper">{children}</div>;
}
