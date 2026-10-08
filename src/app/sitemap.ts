import type { MetadataRoute } from 'next';
import { liveGroups } from '@/content/age-groups';
import { EXPERTS } from '@/content/experts';
import { publicInstruments } from '@/content/instruments';
import { LEGAL_DOCS } from '@/content/legal';
import { BEYIN_YOLU, DALLAR, hazirDersler } from '@/content/beyin';
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
  // Beyin Akademisi: ana sayfa, gezgin, iki dal ve yalnızca hazır dersler.
  const beyin = [
    { url: siteUrl(BEYIN_YOLU) },
    { url: siteUrl(`${BEYIN_YOLU}/beyin-gezgini`) },
    ...DALLAR.map((d) => ({ url: siteUrl(`${BEYIN_YOLU}/${d.id}`) })),
    ...hazirDersler().map((d) => ({ url: siteUrl(`${BEYIN_YOLU}/${d.dal}/${d.slug}`), lastModified: d.guncelleme })),
  ];
  const experts = EXPERTS.length
    ? [{ url: siteUrl('/uzmanlar') }, ...EXPERTS.map((e) => ({ url: siteUrl(`/uzmanlar/${e.slug}`) }))]
    : [];

  return [...pages, ...groups, ...tests, ...guides, ...beyin, ...experts, ...legal];
}
