import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { AREA_INTROS, ageGroup, testsForGroup, type AgeGroupKey } from '@/content/age-groups';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { DOMAIN_LABELS } from '@/lib/config';
import { DOMAIN_ORDER, domainColor } from '@/lib/domain-style';
import { breadcrumbLd, pageMeta } from '@/lib/seo';
import { GroupPicker } from './group-picker';
import { GroupTests, type GroupSection } from './group-tests';
import { PageHeader } from './page-header';
import { PageGuide } from './page-guide';
import { cardInfo } from './test-card';
import { DOMAIN_ANCHORS } from './test-shelf';

export function groupMeta(key: AgeGroupKey) {
  const g = ageGroup(key);
  return pageMeta({
    title: `${g.name} için testler (${g.range})`,
    description: `${g.range} için ücretsiz kişilik, zihinsel beceri, okuma ve ilgi testleri, bölüm bölüm. Hesap açmadan çözülür; cevaplar saklanmaz, rapor PDF olarak verilir.`,
    path: g.path,
  });
}

/**
 * Yaş grubu sayfası: gruba uygun yayındaki testler bölüm bölüm, en başta yol gösterici kutu ve "Nereden
 * başlamalı?" önerileri. Grupta yayında hiç test yoksa sayfa açılmaz (site haritasında da yer almaz).
 */
export function GroupPage({ groupKey }: { groupKey: AgeGroupKey }) {
  const g = ageGroup(groupKey);
  const tests = testsForGroup(publicInstruments(), g);
  if (tests.length === 0) notFound();

  const sections: GroupSection[] = DOMAIN_ORDER.map((domain) => ({
    domain,
    id: DOMAIN_ANCHORS[domain] ?? domain,
    title: DOMAIN_LABELS[domain] ?? domain,
    intro: AREA_INTROS[domain] ?? '',
    color: domainColor(domain),
    tests: tests.filter((t) => t.domain === domain).map(cardInfo),
  })).filter((s) => s.tests.length > 0);

  const starters = g.starters
    .map((s) => ({ ...s, def: getInstrumentDef(s.slug) }))
    .filter((s) => s.def && tests.includes(s.def));

  const steps = [
    sections.length > 1 ? 'Aşağıdaki bölümlerden ilgini çekeni seç.' : 'Aşağıdaki testlerden birini seç.',
    'Testin adına basarsan neyi ölçtüğünü okursun; “Çöz” düğmesine basarsan test başlar.',
    'Test bitince raporun ekranda açılır. Saklamak için PDF olarak indir.',
  ];
  if (g.grades.length > 1) steps.unshift('Önce sınıfını seç: yalnızca sana uygun testler görünür.');

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Ana sayfa', path: '/' },
          { name: 'Testler', path: '/testler' },
          { name: g.name, path: g.path },
        ])}
      />
      <PageHeader kicker={`Grubuna göre testler · ${g.range}`} title={g.name} lede={g.lede}>
        <PageGuide steps={steps}>
          <p>
            Burada {g.forWhom} uygun{' '}
            <strong>{tests.length} test</strong> var. Hepsi ücretsiz, hesap açmadan çözülür; cevaplar hiçbir yere kaydedilmez.
          </p>
        </PageGuide>
      </PageHeader>

      {(starters.length > 0 || g.parentNote) && (
        <section className="container-page grid gap-8 pt-14 md:pt-20 lg:grid-cols-[1.6fr_1fr]" aria-labelledby="baslangic">
          {starters.length > 0 && (
            <div className="flex flex-col gap-5">
              <h2 id="baslangic" className="t-h2">
                Nereden başlamalı?
              </h2>
              <ol className="flex flex-col gap-3">
                {starters.map((s, i) => (
                  <li key={s.slug} className="panel flex items-start gap-4 p-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full font-display text-lg font-bold text-white" style={{ background: g.color }} aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Link href={`/testler/${s.slug}`} className="font-display text-xl font-bold">
                        {s.def!.name}
                      </Link>
                      <p className="text-ink-2">{s.why}</p>
                      <p className="t-meta">yaklaşık {s.def!.estimatedMinutes} dakika</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {g.parentNote && (
            <aside className="notice notice-info flex flex-col gap-3 self-start" aria-labelledby="veliye">
              <h2 id="veliye" className="t-h3">
                Veliyseniz
              </h2>
              <p>{g.parentNote}</p>
              <Link href="/veliler-icin" className="font-bold">
                Veliler için rehber →
              </Link>
            </aside>
          )}
        </section>
      )}

      <section className="container-page py-14 md:py-20" aria-label="Testler">
        {sections.length > 1 && (
          <nav aria-label="Bölümler" className="mb-8 flex flex-wrap items-center gap-2">
            <span className="t-small mr-1 font-bold text-ink-2">Bölümler:</span>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="chip no-underline hover:border-ink">
                <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                {s.title}
              </a>
            ))}
          </nav>
        )}
        <GroupTests grades={g.grades} sections={sections} />
      </section>

      <section className="border-t border-rule bg-surface-2/55" aria-labelledby="diger-gruplar">
        <div className="container-page flex flex-col gap-5 py-14">
          <h2 id="diger-gruplar" className="t-h3">
            Başka bir grup mu arıyorsunuz?
          </h2>
          <GroupPicker current={g.key} compact />
          <p className="t-small text-ink-2">
            Bütün testleri alan, sınıf ve süreye göre süzmek için <Link href="/testler">Testler</Link> sayfasına bakın.
          </p>
        </div>
      </section>
    </>
  );
}
