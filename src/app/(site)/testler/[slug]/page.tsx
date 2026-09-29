import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { JsonLd } from '@/components/seo/json-ld';
import { GuideList } from '@/components/site/guide-list';
import { guidesForTest } from '@/content/rehber';
import { DOMAIN_LABELS, gradeRangeLabel } from '@/lib/config';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return publicInstruments().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<'/testler/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const def = getInstrumentDef(slug);
  if (!def) return {};
  return pageMeta({
    title: `${def.name}${def.isFree ? ' (ücretsiz)' : ''}`,
    ogTitle: def.name,
    description: `${def.tagline} ${def.estimatedMinutes} dakika sürer, ${gradeRangeLabel(def.minGrade, def.maxGrade)} öğrenciler için. Bilimsel dayanağı, güvenirliği ve sınırları açıkça yazılı.`,
    path: `/testler/${slug}`,
    ownImage: true,
  });
}

export default async function TestPage(props: PageProps<'/testler/[slug]'>) {
  const { slug } = await props.params;
  const def = getInstrumentDef(slug);
  if (!def || (def.status !== 'active' && def.status !== 'pilot')) notFound();
  const sc = def.science;
  const guides = guidesForTest(slug);
  const cancellation = def.engine === 'tasks' && def.tasks.length === 1 && def.tasks[0].kind === 'cancellation' ? def.tasks[0] : null;
  const itemCount =
    def.engine === 'likert'
      ? `${def.items.length} ${def.profile === 'riasec' ? 'etkinlik' : 'cümle'}`
      : cancellation
        ? `${cancellation.sections} bölüm, her biri ${Math.round(cancellation.sectionMs / 1000)} saniye`
        : def.engine === 'tasks'
          ? `${def.tasks.length} görev`
          : def.engine === 'quiz'
            ? `${def.forms[0].items.length} soru`
            : '1 metin, 8 soru';
  const scales = def.scales.filter((s) => s.key !== 'total');

  const jsonLd = breadcrumbLd([
    { name: 'Ana sayfa', path: '/' },
    { name: 'Testler', path: '/testler' },
    { name: def.name, path: `/testler/${slug}` },
  ]);

  const facts = [
    { k: 'Süre', v: `yaklaşık ${def.estimatedMinutes} dakika` },
    { k: 'Kimler için', v: gradeRangeLabel(def.minGrade, def.maxGrade) },
    { k: 'Uzunluk', v: itemCount },
    { k: 'Ücret', v: def.isFree ? 'Ücretsiz' : 'Ücretli' },
  ];

  return (
    <article className="container-page py-12 md:py-16">
      <JsonLd data={jsonLd} />
      <nav aria-label="Konum" className="t-small mb-8 text-ink-3">
        <Link href="/testler">Testler</Link> <span aria-hidden="true">/</span> {DOMAIN_LABELS[def.domain]}
      </nav>
      <header className="grid gap-10 border-b border-rule pb-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {def.status === 'pilot' ? <span className="chip chip-brass">Pilot</span> : <span className="chip chip-ok">Yayında</span>}
          </div>
          <h1 className="t-h1">{def.name}</h1>
          <p className="t-lede measure">{def.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/kayit" className="btn btn-primary btn-lg">
              {def.isFree ? 'Ücretsiz başla' : 'Başla'}
            </Link>
            <a href="#bilim-karti" className="btn btn-secondary btn-lg">
              Bilimsel dayanağı
            </a>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule">
          {facts.map((f) => (
            <div key={f.k} className="bg-surface p-4">
              <dt className="t-meta">{f.k}</dt>
              <dd className="font-bold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="olcer">
        <h2 id="olcer" className="t-h2">
          Neyi ölçer?
        </h2>
        <div className="flex flex-col gap-6">
          <p className="measure text-ink-2">{sc.whatItMeasures}</p>
          <ul className="divide-y divide-rule border-y border-rule">
            {scales.map((s) => (
              <li key={s.key} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <p className="font-bold">{s.name}</p>
                <div>
                  <p>{s.plain}</p>
                  {s.poles && (
                    <p className="t-meta mt-1">
                      Bir uçta: {s.poles.low.toLocaleLowerCase('tr-TR')}. Öbür uçta: {s.poles.high.toLocaleLowerCase('tr-TR')}.
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {def.engine === 'quiz' && (
        <section className="grid gap-10 border-t border-rule py-14 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="formlar">
          <div className="flex flex-col gap-3">
            <h2 id="formlar" className="t-h2">
              Hangi sınıf hangi soruları çözer?
            </h2>
            <p className="text-ink-2">
              Her öğrenci, bulunduğu sınıftan bir önceki sınıfın konularını yoklayan formu çözer. Böylece test yılın her döneminde adil olur.
            </p>
          </div>
          <ul className="divide-y divide-rule border-y border-rule">
            {def.forms.map((f) => (
              <li key={f.key} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <p className="font-bold">
                  {f.grade}. sınıf öğrencileri
                  <span className="block text-[0.9375rem] font-normal text-ink-3">{f.contentGrade}. sınıf konuları</span>
                </p>
                <p>{f.domains.map((d) => d.name).join(' · ')}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-10 border-t border-rule py-14 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="rapor">
        <h2 id="rapor" className="t-h2">
          Raporda neler var?
        </h2>
        <ul className="measure flex list-disc flex-col gap-2 pl-5">
          <li>Öğrenciye ve veliye ayrı ayrı yazılmış iki rapor</li>
          {def.engine === 'likert' && def.profile === 'riasec' && (
            <>
              <li>Altı ilgi alanının Holland altıgeni üzerinde gösterimi ve üç harfli ilgi kodu</li>
              <li>En belirgin üç alan için açıklamalar, keşif önerileri, lise ve üniversite yolları</li>
              <li>Profile uyan örnek meslekler</li>
            </>
          )}
          {def.engine === 'likert' && !def.profile && (
            <>
              <li>Her boyut için sade bir açıklama ve gündelik hayatta işe yarayacak öneriler</li>
              <li>Puanın ölçüm payıyla birlikte cetvel üzerinde gösterimi</li>
            </>
          )}
          {def.engine === 'reading' && <li>Okuma hızı, anlama oranı ve soru türlerine göre sonuç</li>}
          {cancellation && (
            <>
              <li>Çalışma hızı, bulunan ve atlanan harfler, yanlış işaretlemeler ve net doğru sayısı</li>
              <li>Bölümler ilerledikçe dikkatin korunup korunmadığını gösteren bölüm bölüm grafik</li>
              <li>Evde ve okulda işe yarayacak somut öneriler</li>
            </>
          )}
          {def.engine === 'tasks' && !cancellation && (
            <>
              <li>Her görevde ulaşılan dizi uzunluğu, doğruluk ve tepki süresi</li>
              <li>Görevlerin ölçtüğü becerilerin gündelik okul hayatındaki karşılığı</li>
              <li>Evde ve okulda işe yarayacak somut öneriler</li>
            </>
          )}
          {def.engine === 'quiz' && (
            <>
              <li>Genel sonuç ve beş konu alanının her birinde “sağlam”, “pekiştirilmeli” ya da “öncelikli” değerlendirmesi</li>
              <li>Yanlış cevapların işaret ettiği hata türleri ve her biri için somut öneriler</li>
              <li>Yanlış yapılan soruların doğru cevapları ve kısa açıklamaları</li>
            </>
          )}
          <li>Sonucu dikkatle yorumlamayı gerektiren durumlar için uyarılar (ör. çok hızlı cevaplama)</li>
          <li>Testin bilimsel dayanağı ve sınırları</li>
        </ul>
      </section>

      <section id="bilim-karti" className="scroll-mt-24 border-t border-rule py-14" aria-labelledby="bilim">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-3">
            <h2 id="bilim" className="t-h2">
              Bilim kartı
            </h2>
            <p className="text-ink-2">Bu testin arkasında hangi araştırmaların durduğu ve nerede sınırlı olduğu.</p>
          </div>
          <dl className="panel grid gap-x-8 gap-y-5 p-6 md:grid-cols-[11rem_1fr] md:p-8">
            <dt className="font-bold">Dayandığı ölçek</dt>
            <dd>{sc.basedOn}</dd>
            <dt className="font-bold">Türkçe sürüm</dt>
            <dd>{sc.turkishVersion}</dd>
            <dt className="font-bold">Güvenirlik</dt>
            <dd>{sc.reliability}</dd>
            <dt className="font-bold">Norm durumu</dt>
            <dd>{sc.normNote}</dd>
            <dt className="font-bold">Yaş ve sınıf</dt>
            <dd>{sc.ageNote}</dd>
            <dt className="font-bold">Kullanım izni</dt>
            <dd>
              {sc.license}
              {sc.licenseUrl && (
                <>
                  {' '}
                  <a href={sc.licenseUrl} target="_blank" rel="noopener noreferrer">
                    Kaynağı gör
                  </a>
                </>
              )}
            </dd>
            <dt className="font-bold">Sınırlılıklar</dt>
            <dd>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                {sc.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </dd>
            <dt className="font-bold">Kaynakça</dt>
            <dd>
              <ul className="flex flex-col gap-2 text-[0.95rem]">
                {sc.citations.map((c) => (
                  <li key={c.text}>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.text}
                      </a>
                    ) : (
                      c.text
                    )}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        </div>
      </section>

      {guides.length > 0 && (
        <section className="grid gap-10 border-t border-rule py-14 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="okuyun">
          <h2 id="okuyun" className="t-h2">
            Bu konuda okuyun
          </h2>
          <GuideList guides={guides} />
        </section>
      )}

      <section className="border-t border-rule pt-14">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-ink p-8 text-paper md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="font-display text-2xl font-bold">{def.isFree ? 'Bu test ücretsiz.' : def.name}</p>
            <p className="opacity-85">Veli hesabınızı açın, çocuğunuzun profilini oluşturun ve testi birlikte başlatın.</p>
          </div>
          <Link href="/kayit" className="btn bg-paper text-ink hover:bg-surface-2">
            Ücretsiz veli hesabı aç
          </Link>
        </div>
      </section>
    </article>
  );
}
