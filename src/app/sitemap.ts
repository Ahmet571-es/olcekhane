import type { MetadataRoute } from 'next';
import { liveGroups } from '@/content/age-groups';
import { EXPERTS } from '@/content/experts';
import { publicInstruments } from '@/content/instruments';
import { LEGAL_DOCS } from '@/content/legal';
import { allGuides } from '@/content/rehber';
import { siteUrl } from '@/lib/config';

// APP_URL sunucu çalışırken okunur (derleme anında değil).
export const dynamic = 'force-dynamic';

/**
 * Site haritası yalnızca herkese açık, dizine eklenmesi istenen sayfaları içerir.
 * Güncelleme tarihi yalnızca gerçekten bilinen sayfalarda (rehber yazıları) verilir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    '/',
    '/testler',
    '/okuma',
    '/rehber',
    '/veliler-icin',
    '/bilimsel-yaklasim',
    '/hakkimizda',
    '/iletisim',
  ].map((p) => ({ url: siteUrl(p) }));

  // Yaş grubu sayfaları: yalnızca yayında testi olan gruplar (testi olmayan grubun sayfası açılmaz).
  const groups = liveGroups().map(({ group }) => ({ url: siteUrl(group.path) }));
  const tests = publicInstruments().map((t) => ({ url: siteUrl(`/testler/${t.slug}`) }));
  const guides = allGuides().map((g) => ({ url: siteUrl(`/rehber/${g.slug}`), lastModified: g.updatedAt }));
  const legal = LEGAL_DOCS.map((d) => ({ url: siteUrl(`/yasal/${d.slug}`) }));
  const experts = EXPERTS.length
    ? [{ url: siteUrl('/uzmanlar') }, ...EXPERTS.map((e) => ({ url: siteUrl(`/uzmanlar/${e.slug}`) }))]
    : [];

  return [...pages, ...groups, ...tests, ...guides, ...experts, ...legal];
}
