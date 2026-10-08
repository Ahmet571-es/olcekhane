import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DersIcerigi, dersSuresi, hedefBilgisi, KATMAN_ADI } from '@/components/beyin/ders-icerigi';
import { KendiniDene } from '@/components/beyin/kendini-dene';
import { ModelNotu } from '@/components/beyin/model-notu';
import { OkumaDuzeyiSaglayici, OkumaDuzeyiSecici } from '@/components/beyin/okuma-duzeyi';
import { JsonLd } from '@/components/seo/json-ld';
import { PageGuide } from '@/components/site/page-guide';
import { BEYIN_YOLU, SEVIYE_ADLARI, dalBul, dersBul, hazirDersler, komsuDersler } from '@/content/beyin';
import { SITE_NAME, siteUrl } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return hazirDersler().map((d) => ({ dal: d.dal, ders: d.slug }));
}

export async function generateMetadata(props: PageProps<'/beyin-akademisi/[dal]/[ders]'>): Promise<Metadata> {
  const { dal, ders } = await props.params;
  const d = dersBul(dal, ders);
  if (!d) return {};
  return pageMeta({
    title: `${d.baslik} | ${dalBul(d.dal)!.ad}`,
    ogTitle: d.baslik,
    description: d.aciklama,
    path: `${BEYIN_YOLU}/${d.dal}/${d.slug}`,
    type: 'article',
    publishedTime: d.yayin,
    modifiedTime: d.guncelleme,
  });
}

const tarihBicimi = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
const tarih = (iso: string) => tarihBicimi.format(new Date(`${iso}T12:00:00+03:00`));

export default async function DersPage(props: PageProps<'/beyin-akademisi/[dal]/[ders]'>) {
  const { dal, ders } = await props.params;
  const d = dersBul(dal, ders);
  if (!d) notFound();
  const dalBilgisi = dalBul(d.dal)!;
  const { onceki, sonraki } = komsuDersler(d);
  const sonrakiProgram = dalBilgisi.program.find((p) => p.sira === d.sira + 1);
  const yol = `${BEYIN_YOLU}/${d.dal}/${d.slug}`;
  const sureler = { temel: dersSuresi(d.bolumler, 'temel'), lisans: dersSuresi(d.bolumler, 'lisans'), ileri: dersSuresi(d.bolumler, 'ileri') };
  const hedefler = d.hedefler.map(hedefBilgisi);

  return (
    <article className="container-page py-10 md:py-14">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Beyin Akademisi', path: BEYIN_YOLU },
          { name: dalBilgisi.ad, path: `${BEYIN_YOLU}/${d.dal}` },
          { name: d.baslik, path: yol },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: d.baslik,
          description: d.aciklama,
          url: siteUrl(yol),
          inLanguage: 'tr-TR',
          isAccessibleForFree: true,
          learningResourceType: 'Ders',
          teaches: hedefler.map((h) => h.metin),
          datePublished: d.yayin,
          dateModified: d.guncelleme,
          isPartOf: { '@type': 'Course', name: dalBilgisi.ad, url: siteUrl(`${BEYIN_YOLU}/${d.dal}`) },
          publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl('/') },
          citation: d.kaynaklar.map((k) => k.metin),
        }}
      />

      <nav aria-label="Konum" className="t-small mb-6 text-ink-3">
        <Link href={BEYIN_YOLU}>Beyin Akademisi</Link> <span aria-hidden="true">/</span>{' '}
        <Link href={`${BEYIN_YOLU}/${d.dal}`}>{dalBilgisi.ad}</Link>
      </nav>

      <header className="flex max-w-4xl flex-col gap-5 border-b border-rule pb-10">
        <p className="kicker">
          {dalBilgisi.sira}. bölüm: {dalBilgisi.kisaAd} · Ders {d.sira} / {dalBilgisi.program.length}
        </p>
        <h1 className="t-h1 font-display font-bold">{d.baslik}</h1>
        <p className="t-lede measure">{d.giris}</p>
        <p className="t-meta flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="beyin-seviye">Başlangıç: {SEVIYE_ADLARI[d.seviye]}</span>
          <span className="beyin-seviye">Üç katman: Temel · Lisans · Uzman</span>
          <span>
            Okuma: temel {sureler.temel} dk, tamamı {sureler.ileri} dk
          </span>
          <span>
            Güncelleme: <time dateTime={d.guncelleme}>{tarih(d.guncelleme)}</time>
          </span>
          <span>Uzman incelemesi bekliyor</span>
        </p>
        <PageGuide
          next={[
            ...(sonraki ? [{ href: `${BEYIN_YOLU}/${d.dal}/${sonraki.slug}`, label: 'Sonraki derse geç' }] : []),
            { href: `${BEYIN_YOLU}/${d.dal}`, label: 'Bütün dersler' },
          ]}
        >
          <p>
            Dersi baştan sona oku. Üç boyutlu sahneleri parmağınla ya da fareyle döndür, iki parmakla yakınlaştır; bir yapıya
            dokununca adı ve görevi açılır. Sonunda kendini dene.
          </p>
        </PageGuide>
      </header>

      <OkumaDuzeyiSaglayici className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
        <div className="flex min-w-0 flex-col gap-16">
          <section aria-labelledby="hedefler" className="beyin-kutu beyin-kutu-aklinda-kalsin measure">
            <h2 id="hedefler" className="mb-3 font-bold">
              Bu derste öğreneceklerin
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              {hedefler.map((h) => (
                <li key={h.metin} className={h.duzey === 'temel' ? undefined : `katman-${h.duzey}`}>
                  {h.metin}
                  {h.duzey !== 'temel' && <span className="beyin-seviye ml-2 align-middle">{KATMAN_ADI[h.duzey]}</span>}
                </li>
              ))}
            </ul>
          </section>

          <OkumaDuzeyiSecici sureler={sureler} />

          <DersIcerigi bolumler={d.bolumler} />

          {d.ucep && d.ucep.length > 0 && (
            <section aria-labelledby="ucep-baslik" className="beyin-kutu katman-lisans measure flex flex-col gap-3">
              <p className="kicker">Tıp öğrencileri için</p>
              <h2 id="ucep-baslik" className="font-bold">
                Ulusal Çekirdek Eğitim Programı (UÇEP 2020) ile ilişkisi
              </h2>
              <p className="t-small text-ink-2">
                Bu dersin temel bilgisi, UÇEP 2020’deki şu çekirdek hastalık ve klinik problemlerin anlaşılmasında kullanılır
                (Sinir–Davranış sistemi; harfler mezun hekimden beklenen öğrenme düzeyidir):
              </p>
              <ul className="flex flex-col gap-1.5">
                {d.ucep.map((u) => (
                  <li key={u.no}>
                    <b>
                      {u.no}. {u.ad}
                    </b>{' '}
                    <span className="text-ink-2">({u.duzey})</span>
                  </li>
                ))}
              </ul>
              <p className="t-meta">
                A: acil durumu tanımlayıp ilk tedaviyi yapabilmeli · ÖnT: ön tanı koyup uzmana yönlendirebilmeli · T: tanı koyup
                tedavi hakkında bilgi sahibi olmalı · TT: tanı koyup tedavi edebilmeli · İ: izlem yapabilmeli · K: korunma
                önlemlerini uygulayabilmeli.
              </p>
            </section>
          )}

          <section id="sozluk" aria-labelledby="sozluk-baslik" className="flex scroll-mt-24 flex-col gap-5">
            <h2 id="sozluk-baslik" className="t-h2 font-display font-bold">
              Sözlük
            </h2>
            <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
              {d.sozluk.map((t) => (
                <div key={t.terim} className="flex flex-col gap-0.5 border-b border-rule pb-3">
                  <dt className="font-bold">
                    {t.terim}
                    {t.latince && (
                      <span className="font-normal text-ink-3">
                        {' '}
                        · <i lang="la">{t.latince}</i>
                      </span>
                    )}
                  </dt>
                  <dd className="text-ink-2">{t.tanim}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="kendini-dene" aria-labelledby="kendini-dene-baslik" className="flex scroll-mt-24 flex-col gap-5">
            <h2 id="kendini-dene-baslik" className="t-h2 font-display font-bold">
              Kendini dene
            </h2>
            <KendiniDene sorular={d.sorular} />
          </section>

          <nav aria-label="Dersler arasında" className="grid gap-3 sm:grid-cols-2">
            {onceki ? (
              <Link href={`${BEYIN_YOLU}/${d.dal}/${onceki.slug}`} className="panel flex flex-col gap-1 p-5 no-underline hover:border-ink">
                <span className="t-meta">← Önceki ders</span>
                <span className="font-bold">{onceki.baslik}</span>
              </Link>
            ) : (
              <span />
            )}
            {sonraki ? (
              <Link href={`${BEYIN_YOLU}/${d.dal}/${sonraki.slug}`} className="panel flex flex-col gap-1 p-5 text-right no-underline hover:border-ink">
                <span className="t-meta">Sonraki ders →</span>
                <span className="font-bold">{sonraki.baslik}</span>
              </Link>
            ) : (
              sonrakiProgram && (
                <div className="flex flex-col gap-1 rounded-xl border border-dashed border-rule-strong p-5 text-right">
                  <span className="t-meta">Sonraki ders hazırlanıyor</span>
                  <span className="font-bold text-ink-2">{sonrakiProgram.baslik}</span>
                </div>
              )
            )}
          </nav>

          <section id="kaynaklar" aria-labelledby="kaynaklar-baslik" className="measure flex scroll-mt-24 flex-col gap-4">
            <h2 id="kaynaklar-baslik" className="t-h3 font-bold">
              Kaynaklar
            </h2>
            <ol className="flex list-decimal flex-col gap-3 pl-5 text-[0.95rem] text-ink-2">
              {d.kaynaklar.map((k) => (
                <li key={k.metin}>
                  {k.metin}{' '}
                  {k.url && (
                    <a href={k.url} target="_blank" rel="noopener noreferrer" className="break-all">
                      {k.url.replace(/^https:\/\//, '')}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <ModelNotu />
        </div>

        <aside className="hidden lg:block" aria-label="Bu derste">
          <nav className="sticky top-24 flex flex-col gap-3 border-l border-rule pl-5">
            <p className="t-meta font-bold uppercase tracking-[0.06em]">Bu derste</p>
            <ol className="flex flex-col gap-2 text-[0.9375rem]">
              {d.bolumler.map((b, i) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} className="text-ink-2 no-underline hover:text-ink hover:underline">
                    {i + 1}. {b.baslik}
                  </a>
                </li>
              ))}
              <li>
                <a href="#sozluk" className="text-ink-2 no-underline hover:text-ink hover:underline">
                  Sözlük
                </a>
              </li>
              <li>
                <a href="#kendini-dene" className="text-ink-2 no-underline hover:text-ink hover:underline">
                  Kendini dene
                </a>
              </li>
            </ol>
          </nav>
        </aside>
      </OkumaDuzeyiSaglayici>
    </article>
  );
}
