import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Test', robots: { index: false, follow: false } };

export default function RunnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-paper">{children}</div>;
}
