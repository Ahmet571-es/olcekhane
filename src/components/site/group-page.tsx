import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { AREA_INTROS, ageGroup, gradeChoiceMatters, groupDescription, testsForGroup, type AgeGroupKey } from '@/content/age-groups';
import { getInstrumentDef, publicInstruments } from '@/content/instruments';
import { DOMAIN_LABELS, gradeAllowed } from '@/lib/config';
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
    description: groupDescription(g),
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

  // Değerlendirmeyi bir yetişkinin yürüttüğü grupta sayfa yetişkine "siz" diye seslenir.
  const formal = !!g.adultLed;
  // Sınıf seçimi listeyi daraltıyorsa gösterilir; daraltmasa da (ör. lisede) seçilen sınıf testin başında hazır geldiği
  // için öğrencinin çözdüğü gruplarda kalır. Yetişkinin yürüttüğü grupta yalnızca listeyi daraltıyorsa gösterilir.
  const filters = gradeChoiceMatters(tests, g);
  const picker = filters || (!formal && g.grades.filter((grade) => tests.some((t) => gradeAllowed(t, grade))).length > 1);
  const only = tests.length === 1 ? tests[0] : null;

  const steps: string[] = [];
  if (filters) steps.push(formal ? 'Önce öğrencinin sınıfını seçin: yalnızca uygun testler görünür.' : 'Önce sınıfını seç: yalnızca sana uygun testler görünür.');
  else if (picker) steps.push('Önce sınıfını seç: test, sınıfın seçili olarak açılır.');
  if (sections.length > 1) steps.push(formal ? 'Aşağıdaki bölümlerden ilginizi çekeni seçin.' : 'Aşağıdaki bölümlerden ilgini çekeni seç.');
  else if (!only) steps.push(formal ? 'Aşağıdaki testlerden birini seçin.' : 'Aşağıdaki testlerden birini seç.');
  const which = only ? 'Aşağıdaki testin' : 'Testin';
  steps.push(
    formal
      ? `${which} adına basarsanız neyi ölçtüğünü okursunuz; “Çöz” düğmesine basarsanız test başlar.`
      : `${which} adına basarsan neyi ölçtüğünü okursun; “Çöz” düğmesine basarsan test başlar.`,
  );
  steps.push(formal ? 'Test bitince rapor ekranda açılır. Saklamak için PDF olarak indirin.' : 'Test bitince raporun ekranda açılır. Saklamak için PDF olarak indir.');
  const verb = formal ? 'yapılır' : 'çözülür';

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
          {only ? (
            <p>
              Burada {g.forWhom} uygun bir test var: <strong>{only.name}</strong>. Ücretsizdir, hesap açmadan {verb}; cevaplar hiçbir
              yere kaydedilmez.
            </p>
          ) : (
            <p>
              Burada {g.forWhom} uygun <strong>{tests.length} test</strong> var. Hepsi ücretsiz, hesap açmadan {verb}; cevaplar hiçbir
              yere kaydedilmez.
            </p>
          )}
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
        <GroupTests grades={g.grades} sections={sections} picker={picker} filters={filters} formal={formal} />
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
