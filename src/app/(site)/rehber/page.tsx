import { JsonLd } from '@/components/seo/json-ld';
import { GuideList } from '@/components/site/guide-list';
import { PageHeader } from '@/components/site/page-header';
import { GUIDE_CATEGORIES, guidesByCategory, type GuideCategory } from '@/content/rehber';
import { siteUrl } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';
import { PageGuide } from '@/components/site/page-guide';

export const metadata = pageMeta({
  title: 'Rehber: kişilik, öğrenme ve sınav kaygısı üzerine sade yazılar',
  description:
    'Kişilik, öz-saygı, sınav kaygısı, ders çalışma yöntemleri, okuma ve meslek seçimi üzerine araştırmalara dayanan, velilere ve öğrencilere yönelik sade yazılar.',
  path: '/rehber',
  ownImage: true,
});

const ORDER: GuideCategory[] = ['olcme', 'kisilik', 'iyi-olus', 'ogrenme', 'meslek'];

export default function GuidesPage() {
  const groups = ORDER.map((c) => ({ c, items: guidesByCategory(c) })).filter((g) => g.items.length > 0);
  const all = groups.flatMap((g) => g.items);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: all.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: siteUrl(`/rehber/${g.slug}`), name: g.title })),
  };
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Ana sayfa', path: '/' }, { name: 'Rehber', path: '/rehber' }])} />
      <JsonLd data={itemList} />
      <PageHeader
        title="Rehber"
        lede="Kişilik, öğrenme, sınav kaygısı ve meslek seçimi üzerine araştırmalara dayanan, sade yazılar. Her yazının sonunda dayandığı kaynakları bulabilirsiniz."
      >
        <PageGuide next={[{ href: '/testler', label: 'Testlere göz at' }]}>
          <p>
            Burada öğrenciler ve veliler için araştırmalara dayanan yazılar var. Aşağıdan bir konu seçin; her yazının başında ana fikirler,
            sonunda kaynaklar ve konuyla ilgili test bulunur.
          </p>
        </PageGuide>
        <nav aria-label="Konular">
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ c }) => (
              <li key={c}>
                <a href={`#${c}`} className="chip no-underline hover:border-ink">
                  {GUIDE_CATEGORIES[c]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <div className="container-page grid gap-x-14 gap-y-16 py-14 md:py-16 lg:grid-cols-2">
        {groups.map(({ c, items }) => (
          <section key={c} id={c} aria-labelledby={`${c}-baslik`} className="flex scroll-mt-24 flex-col gap-5">
            <h2 id={`${c}-baslik`} className="t-h2">
              {GUIDE_CATEGORIES[c]}
            </h2>
            <GuideList guides={items} showCategory={false} />
          </section>
        ))}
      </div>
    </>
  );
}
