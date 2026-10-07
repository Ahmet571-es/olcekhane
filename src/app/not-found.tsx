import type { Metadata } from 'next';
import { GroupPicker } from '@/components/site/group-picker';
import { SiteEffects } from '@/components/site/site-effects';
import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';
import { PageGuide } from '@/components/site/page-guide';
import { PageHeader } from '@/components/site/page-header';

export const metadata: Metadata = { title: 'Sayfa bulunamadı', robots: { index: false, follow: true } };

/** Bulunamayan sayfa: ziyaretçiyi boş bırakmaz, nereye gidebileceğini gösterir. */
export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="icerik">
        <PageHeader title="Bu sayfa bulunamadı" lede="Aradığınız sayfa taşınmış ya da hiç olmamış olabilir. Aşağıdan devam edebilirsiniz.">
          <PageGuide
            next={[
              { href: '/', label: 'Ana sayfa' },
              { href: '/testler', label: 'Bütün testler' },
              { href: '/rehber', label: 'Rehber' },
            ]}
          >
            <p>Test arıyorsanız önce grubunuzu seçin; size uygun testler bölüm bölüm açılır.</p>
            <GroupPicker compact />
          </PageGuide>
        </PageHeader>
      </main>
      <SiteFooter />
      <SiteEffects />
    </div>
  );
}
