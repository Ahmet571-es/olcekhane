import Link from 'next/link';
import { BeyinSahnesi } from '@/components/beyin/beyin-sahnesi';
import { ModelNotu } from '@/components/beyin/model-notu';
import { JsonLd } from '@/components/seo/json-ld';
import { PageGuide } from '@/components/site/page-guide';
import { BEYIN_YOLU } from '@/content/beyin';
import { BOLGE_ADLARI, type Bolge, LOB_ADLARI, YAPILAR, type Yapi } from '@/content/beyin/yapilar';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Beyin gezgini: üç boyutlu beyin atlası',
  description:
    'Beynin bütün yapıları tek sayfada: üç boyutlu modeli döndür, katmanları aç-kapa, istediğin yerden kes. Her yapının Türkçe ve Latince adı ve görevi.',
  path: `${BEYIN_YOLU}/beyin-gezgini`,
});

const SIRA: Bolge[] = ['serebrum', 'diensefalon', 'beyin-sapi', 'beyincik', 'karincik', 'sinir', 'damar', 'kemik'];

/** Sol ve sağ eşler dizinde tek satır olur. */
function tekle(ys: Yapi[]): Yapi[] {
  const goruldu = new Set<string>();
  return ys.filter((y) => {
    const k = y.id.replace(/-(sol|sag)$/, '');
    if (goruldu.has(k)) return false;
    goruldu.add(k);
    return true;
  });
}

function grupAdi(y: Yapi): string {
  if (y.bolge === 'serebrum' && y.katman === 'kabuk' && y.lob) return `${BOLGE_ADLARI.serebrum}: ${LOB_ADLARI[y.lob]}`;
  if (y.bolge === 'serebrum') return `${BOLGE_ADLARI.serebrum}: derin yapılar ve beyaz cevher`;
  return BOLGE_ADLARI[y.bolge];
}

export default function BeyinGezginiPage() {
  const gruplar = new Map<string, Yapi[]>();
  for (const b of SIRA) {
    for (const y of tekle(YAPILAR.filter((x) => x.bolge === b))) {
      const g = grupAdi(y);
      gruplar.set(g, [...(gruplar.get(g) ?? []), y]);
    }
  }

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Beyin Akademisi', path: BEYIN_YOLU },
          { name: 'Beyin gezgini', path: `${BEYIN_YOLU}/beyin-gezgini` },
        ])}
      />
      <div className="container-page flex flex-col gap-8 py-10 md:py-14">
        <nav aria-label="Konum" className="t-small text-ink-3">
          <Link href={BEYIN_YOLU}>Beyin Akademisi</Link>
        </nav>
        <header className="flex max-w-4xl flex-col gap-4">
          <p className="kicker">Üç boyutlu atlas</p>
          <h1 className="t-h1 font-display font-bold">Beyin gezgini</h1>
          <p className="t-lede measure">
            Beynin {tekle(YAPILAR).length} yapısı tek bir modelde. Döndür, yakınlaştır, katmanları aç-kapa, istediğin
            yerden kes ya da parçalara ayır. Bir yapıya dokununca adı, Latince adı ve görevi açılır.
          </p>
          <PageGuide next={[{ href: `${BEYIN_YOLU}/anatomi`, label: 'Anatomi derslerine git' }]}>
            <p>
              Alttaki düğmelerle bakış açısını, katmanları, kesiti ve renkleri değiştir. Sayfanın sonunda bütün yapıların
              açıklamalı dizini var.
            </p>
          </PageGuide>
        </header>

        <BeyinSahnesi
          sahne={{ katmanlar: ['kabuk', 'derin', 'sap'], renk: 'lob', gizle: [], bakis: 'egik' }}
          araclar={['bakis', 'katman', 'kesit', 'ayristir', 'renk', 'yarim', 'liste']}
          buyuk
          basliksiz
        />

        <section aria-labelledby="dizin" className="flex flex-col gap-8 pt-6">
          <h2 id="dizin" className="t-h2 font-display font-bold">
            Yapı dizini
          </h2>
          {[...gruplar].map(([grup, ys]) => (
            <section key={grup} aria-label={grup} className="flex flex-col gap-3">
              <h3 className="t-h3 font-bold">{grup}</h3>
              <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                {ys.map((y) => (
                  <div key={y.id} className="flex flex-col gap-0.5 border-b border-rule pb-3">
                    <dt className="font-bold">
                      {y.ad}
                      {y.sade && <span className="font-normal text-ink-2"> ({y.sade})</span>}
                      <span className="font-normal text-ink-3">
                        {' '}
                        · <i lang="la">{y.latince}</i>
                      </span>
                    </dt>
                    <dd className="text-ink-2">{y.gorev}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </section>

        <ModelNotu />
      </div>
    </>
  );
}
