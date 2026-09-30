import { SiteEffects } from '@/components/site/site-effects';
import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="icerik">{children}</main>
      <SiteFooter />
      <SiteEffects />
    </div>
  );
}
