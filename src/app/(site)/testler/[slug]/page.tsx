import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { getInstrumentDef, isSolvable, publicInstruments } from '@/content/instruments';
import { JsonLd } from '@/components/seo/json-ld';
import { GuideList } from '@/components/site/guide-list';
import { PageGuide } from '@/components/site/page-guide';
import { guidesForTest } from '@/content/rehber';
import { REPORT_TEMPLATES } from '@/content/reports';
import { hasPublicRoadmap, roadmapSummary } from '@/content/roadmaps';
import { DOMAIN_LABELS, gradeRangeLabel } from '@/lib/config';
import { domainColor } from '@/lib/domain-style';
import { likertItemNoun } from '@/lib/instruments/nouns';
import { breadcrumbLd, pageMeta } from '@/lib/seo';

/** Cümle başında sayıların yazıyla gösterimi ("Beş boyutun…"). */
const NUMBER_WORDS: Record<number, string> = { 2: 'İki', 3: 'Üç', 4: 'Dört', 5: 'Beş', 6: 'Altı', 7: 'Yedi', 8: 'Sekiz' };

export function generateStaticParams() {
  return publicInstruments().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<'/testler/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const def = getInstrumentDef(slug);
  if (!isSolvable(def)) return {};
  const meta = pageMeta({
    title: `${def.name}${def.isFree ? ' (ücretsiz)' : ''}`,
    ogTitle: def.name,
    description: `${def.tagline} ${def.estimatedMinutes} dakika sürer, ${
      def.adults ? `${def.minGrade}. sınıftan itibaren öğrenciler ve yetişkinler için` : `${gradeRangeLabel(def.minGrade, def.maxGrade)} öğrenciler için`
    }. Bilimsel dayanağı, güvenirliği ve sınırları açıkça yazılı.`,
    path: `/testler/${slug}`,
    ownImage: true,
  });
  // Uzman incelemesindeki test arama motorlarına kapalıdır.
  return def.status === 'review' ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function TestPage(props: PageProps<'/testler/[slug]'>) {
  const { slug } = await props.params;
  const def = getInstrumentDef(slug);
  if (!isSolvable(def)) notFound();
  const inReview = def.status === 'review';
  const sc = def.science;
  const guides = guidesForTest(slug);
  // Tek görevli bilişsel testler (harf işaretleme, renk-kelime, dur-git, sırayla birleştirme, geriye dönük hatırlama,
  // zihinde döndürme, tepki hızı, şekil akıl yürütme, sayı dizileri, sözel akıl yürütme, kâğıt katlama).
  const single = def.engine === 'tasks' && def.tasks.length === 1 ? def.tasks[0] : null;
  const cancellation = single?.kind === 'cancellation' ? single : null;
  const taskLength = !single
    ? null
    : single.kind === 'cancellation'
      ? `${single.sections} bölüm, her biri ${Math.round(single.sectionMs / 1000)} saniye`
      : single.kind === 'color_word' || single.kind === 'go_nogo' || single.kind === 'mental_rotation'
        ? `${single.trials.length} deneme, ${single.blocks} bölüm`
        : single.kind === 'trail'
          ? new Set(single.parts.map((p) => p.labels.length)).size === 1
            ? `${single.parts.length} bölüm, her birinde ${single.parts[0].labels.length} daire`
            : `${single.parts.length} bölüm: ${single.parts.map((p) => p.labels.length).join(' ve ')} daire`
          : single.kind === 'n_back'
            ? `${single.blocks.length} bölüm, toplam ${single.blocks.reduce((s, b) => s + b.letters.length, 0)} harf`
            : single.kind === 'reaction_time'
              ? single.parts.map((p) => `${p.trials.length} ${p.boxes === 1 ? 'basit' : 'seçmeli'}`).join(', ') + ' deneme'
              : single.kind === 'matrix_reasoning' || single.kind === 'number_series' || single.kind === 'letter_series'
                ? `${single.items.length} soru, ${single.levels.length} düzey`
                : single.kind === 'verbal_reasoning' || single.kind === 'vocabulary'
                  ? `${single.items.length} soru, ${single.levels.length} düzey, 4 soru türü`
                  : single.kind === 'paper_folding'
                    ? `${single.items.length} soru, ${single.levels.length} düzey`
                    : single.kind === 'rule_switch'
                      ? `${single.trials.length} deneme, 4 bölüm`
                      : single.kind === 'word_list'
                        ? `${single.listA.length} kelimelik iki liste, 5 hatırlama ve 1 tanıma bölümü`
                        : single.kind === 'logical_reasoning'
                          ? `${single.items.length} soru, 2 soru türü`
                          : single.kind === 'numerical_reasoning'
                            ? `${single.items.length} soru, 3 soru grubu`
                            : single.kind === 'cube_net' || single.kind === 'hidden_figures' || single.kind === 'figural_analogy'
                              ? `${single.items.length} soru, ${single.levels.length} düzey`
                              : single.kind === 'cognitive_reflection'
                                ? `${single.items.length} kısa soru, dört seçenekli`
                                : single.kind === 'tower'
                                  ? `${single.items.length} problem, ${Math.min(...single.items.map((i) => i.minMoves))}–${Math.max(...single.items.map((i) => i.minMoves))} hamle`
                                  : single.kind === 'mental_rotation_3d'
                                    ? `${single.items.length} soru, ${single.parts.length} bölüm`
                                    : single.kind === 'complex_span'
                                      ? `${single.sets.length} dizi: ${single.sets.reduce((s, x) => s + x.letters.length, 0)} harf ve ${single.sets.reduce((s, x) => s + x.ops.length, 0)} işlem`
                                      : single.kind === 'perspective'
                                        ? `${single.items.length} soru, ${single.practice.length} alıştırma`
                                        : single.kind === 'pattern_memory'
                                          ? `${single.levels[0].cells}–${single.levels[single.levels.length - 1].cells} kareli desenler, her büyüklükte 3 desen`
                                          : single.kind === 'letter_number'
                                            ? `${single.levels[0].length}–${single.levels[single.levels.length - 1].length} öğeli diziler, her uzunlukta 3 dizi`
                                            : single.kind === 'symbol_search'
                                              ? `${single.practice.length} alıştırma, ${Math.round(single.durationMs / 60_000)} dakikalık süreli bölüm`
                : null;
  // Zihinden hesaplama: her işlem ayrı, süreli bir görevdir (bölüm).
  const arith = def.engine === 'tasks' && def.tasks.length > 0 && def.tasks.every((t) => t.kind === 'mental_arithmetic') ? def.tasks : null;
  const itemCount =
    arith
      ? `${arith.length} bölüm, her biri ${Math.round(arith[0].durationMs / 1000)} saniye`
      : def.engine === 'likert'
      ? `${def.items.length} ${likertItemNoun(def)}`
      : taskLength
        ? taskLength
        : def.engine === 'tasks'
          ? `${def.tasks.length} görev`
          : def.engine === 'quiz'
            ? `${def.forms[0].items.length} soru`
            : def.engine === 'oral'
              ? '1 metin: sesli okuma, anlatma ve 5–8 soru'
              : '1 metin, 8 soru';
  const scales = def.scales.filter((s) => s.key !== 'total');
  /** Bileşik olmayan ölçekler (motivasyon profilinde türler). */
  const simpleScales = scales.filter((s) => !s.of);
  // Ayrıntılı profil: boyutlar (bileşik ölçekler) ve altlarındaki alt özellikler birlikte anlatılır.
  const composites = scales.filter((s) => s.of?.length);
  const facetCount = composites.reduce((n, d) => n + (d.of?.length ?? 0), 0);
  const loose = simpleScales.filter((s) => !composites.some((c) => c.of?.includes(s.key)));
  // Güvenirliği ve başvuru standart sapması bilinen ölçeklerde cetvelde ölçüm payı da gösterilir.
  const showsMargin = def.engine === 'likert' && def.scales.some((s) => s.alpha !== undefined && s.sdRef !== undefined);
  const solveUrl = `/testler/${def.slug}/coz`;
  const roadmap = hasPublicRoadmap(def.slug);
  const color = domainColor(def.domain);

  const jsonLd = breadcrumbLd([
    { name: 'Ana sayfa', path: '/' },
    { name: 'Testler', path: '/testler' },
    { name: def.name, path: `/testler/${slug}` },
  ]);

  const facts = [
    { k: 'Süre', v: `yaklaşık ${def.estimatedMinutes} dakika` },
    { k: 'Kimler için', v: gradeRangeLabel(def.minGrade, def.maxGrade, def.adults) },
    { k: 'Uzunluk', v: itemCount },
    { k: 'Ücret', v: def.isFree ? 'Ücretsiz, hesap gerekmez' : 'Ücretli' },
  ];

  return (
    <article className="container-page py-12 md:py-16">
      <JsonLd data={jsonLd} />
      {inReview && (
        <p className="notice notice-warn mb-8">
          <strong>Bu test uzman incelemesinde.</strong> Henüz yayında değildir; bu sayfa yalnızca bağlantıyı bilenler tarafından
          açılabilir ve arama motorlarında görünmez. İnceleme bitince maddeler ve rapor metinleri son hâlini alır.
        </p>
      )}
      <nav aria-label="Konum" className="t-small mb-8 text-ink-3">
        <Link href="/testler">Testler</Link> <span aria-hidden="true">/</span> {DOMAIN_LABELS[def.domain]}
      </nav>
      <header className="relative isolate grid gap-10 border-b border-rule pb-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div
          aria-hidden="true"
          className="test-sekil pointer-events-none absolute -right-28 -top-48 -z-10 size-[30rem]"
          style={{ '--vurgu': color } as CSSProperties}
        />
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1 text-[0.8125rem] font-bold text-ink-2">
              <span className="size-2 rounded-full" style={{ background: color }} aria-hidden="true" />
              {DOMAIN_LABELS[def.domain]}
            </span>
            {inReview ? (
              <span className="chip chip-brass">Uzman incelemesinde</span>
            ) : def.status === 'pilot' ? (
              <span className="chip chip-brass">Pilot</span>
            ) : (
              <span className="chip chip-ok">Yayında</span>
            )}
          </div>
          <h1 className="t-section text-[clamp(2.3rem,4.8vw,4.1rem)]">{def.name}</h1>
          <p className="t-lede measure">{def.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={solveUrl} className="btn btn-primary btn-lg btn-tayf" data-magnet>
              {def.isFree ? 'Ücretsiz çöz' : 'Testi çöz'}
            </Link>
            <a href="#bilim-karti" className="btn btn-secondary btn-lg">
              Bilimsel dayanağı
            </a>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {facts.map((f) => (
            <div key={f.k} className="glass rounded-2xl p-4">
              <dt className="t-meta">{f.k}</dt>
              <dd className="font-bold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <PageGuide
        className="mt-10"
        steps={[
          `“${def.isFree ? 'Ücretsiz çöz' : 'Testi çöz'}” düğmesine basın.`,
          def.adults ? 'Testi kimin çözdüğünü seçin: sınıf ya da “Yetişkinim”.' : 'Testi çözecek öğrencinin sınıfını seçin.',
          `Testi tek seferde bitirin; yaklaşık ${def.estimatedMinutes} dakika sürer.`,
          'Raporu ekranda okuyun ve PDF olarak indirin.',
        ]}
        next={[{ href: solveUrl, label: 'Teste başla' }]}
      >
        <p>Bu sayfada testin neyi ölçtüğünü, raporda neler bulacağınızı ve bilimsel dayanağını okuyabilirsiniz. Testi çözmek dört adımdır:</p>
      </PageGuide>

      <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="olcer">
        <h2 id="olcer" className="t-h2">
          Neyi ölçer?
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {sc.whatItMeasures.split('\n\n').map((para) => (
              <p key={para.slice(0, 40)} className="measure text-ink-2">
                {para}
              </p>
            ))}
          </div>
          {composites.length > 0 ? (
            <ul className="divide-y divide-rule border-y border-rule">
              {composites.map((d) => (
                <li key={d.key} className="grid gap-3 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <p className="font-bold">{d.name}</p>
                  <div className="flex flex-col gap-3">
                    <p>{d.plain}</p>
                    <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {(d.of ?? []).flatMap((k) => scales.filter((f) => f.key === k)).map((f) => (
                        <li key={f.key} className="flex flex-col">
                          <span className="text-[0.975rem] font-bold">{f.name}</span>
                          <span className="t-small text-ink-2">{f.plain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
              {/* Bileşik ölçeklere girmeyen ölçekler (ör. motivasyon testinde isteksizlik). */}
              {loose.map((s) => (
                <li key={s.key} className="grid gap-3 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <p className="font-bold">{s.name}</p>
                  <p>{s.plain}</p>
                </li>
              ))}
            </ul>
          ) : (
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
          )}
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
          Ücretsiz raporda neler var?
        </h2>
        <div className="flex flex-col gap-5">
          <ul className="measure flex list-disc flex-col gap-2 pl-5">
            <li>
              {def.engine === 'oral'
                ? 'Öğrenciye ve yetişkine (veli ya da öğretmen) ayrı ayrı yazılmış iki rapor; ikisi de PDF olarak indirilebilir'
                : def.adults
                ? 'Öğrenciye ve veliye ayrı ayrı yazılmış iki rapor; testi kendisi için çözen yetişkine ise ona yazılmış tek bir rapor. Raporlar PDF olarak indirilebilir'
                : 'Öğrenciye ve veliye ayrı ayrı yazılmış iki rapor; ikisi de PDF olarak indirilebilir'}
            </li>
            {def.engine === 'likert' && def.profile === 'riasec' && (
              <>
                <li>Altı ilgi alanının Holland altıgeni üzerinde gösterimi ve üç harfli ilgi kodu</li>
                <li>En belirgin üç ilgi alanının açıklaması</li>
              </>
            )}
            {def.engine === 'likert' && def.profile === 'interests' && (
              <>
                <li>Sekiz ilgi alanının en yüksekten en düşüğe sıralanması</li>
                <li>En belirgin ilgi alanlarının açıklaması ve bu ilgilerle ilişkili okul ve meslek alanlarına örnekler</li>
              </>
            )}
            {def.engine === 'likert' && def.profile === 'activities' && (
              <>
                <li>{`${scales.length} serbest zaman alanının, etkinliklerin son bir yılda ne sıklıkla yapıldığına göre sıralanması`}</li>
                <li>En sık uğraşılan alanların açıklaması ve öteki alanların düzeyi</li>
              </>
            )}
            {def.engine === 'likert' && def.profile === 'values' && (
              <>
                <li>{`${NUMBER_WORDS[scales.length] ?? scales.length} çalışma değerinin en önemliden en az önemliye sıralanması`}</li>
                <li>En önem verilen değerlerin açıklaması, birbiriyle yarışabilecek değerler ve daha az önem verilen değerler</li>
              </>
            )}
            {def.engine === 'likert' && def.profile === 'facets' && (
              <>
                <li>
                  {`${NUMBER_WORDS[composites.length] ?? composites.length} boyutun${showsMargin ? ', puanın ölçüm payıyla birlikte' : ''} cetvel üzerinde gösterimi`}
                </li>
                <li>{`Her boyutun altında ${def.facetTerms?.ofDomain ?? 'alt özelliklerinin'} (toplam ${facetCount}) cetveli ve her biri için kısa bir yorum`}</li>
                {REPORT_TEMPLATES[def.slug]?.insight && <li>{REPORT_TEMPLATES[def.slug].insight!.pageNote}</li>}
              </>
            )}
            {def.engine === 'likert' && def.profile === 'circumplex' && (
              <>
                <li>{`${NUMBER_WORDS[scales.length] ?? scales.length} kişilerarası tarzın çember üzerinde gösterimi`}</li>
                <li>Her tarz için düzey ve sade bir açıklama</li>
              </>
            )}
            {def.engine === 'likert' && def.profile === 'motivation' && (
              <>
                <li>Motivasyon haritası: kendi isteğiyle ve baskıyla çalışmanın birlikte gösterimi ve araştırmalardaki dört motivasyon profiline göre yorumu</li>
                <li>{`${NUMBER_WORDS[simpleScales.length] ?? simpleScales.length} motivasyon türünün cetvel üzerinde gösterimi ve her biri için sade bir açıklama`}</li>
              </>
            )}
            {def.engine === 'likert' && !def.profile && (
              <>
                {composites.length === 1 && loose.length === 0 ? (
                  // Tek bir toplam puan ve onun maddelerinin konulara göre ayrılmış ortalamaları (ör. iyimserlik).
                  <>
                    <li>{`${composites[0].name} puanının${showsMargin ? ', ölçüm payıyla birlikte' : ''} cetvel üzerinde gösterimi; düzeyi ve sade bir açıklaması`}</li>
                    <li>{`Cümlelerin sorduğu ${(NUMBER_WORDS[facetCount] ?? String(facetCount)).toLocaleLowerCase('tr-TR')} konuda (${(composites[0].of ?? []).flatMap((k) => scales.filter((f) => f.key === k)).map((f) => f.name.toLocaleLowerCase('tr-TR')).join(', ')}) cevapların ayrı ayrı gösterimi ve her biri için kısa bir açıklama`}</li>
                  </>
                ) : scales.length === 1 ? (
                  <>
                    <li>{showsMargin ? 'Puanın, ölçüm payıyla birlikte cetvel üzerinde gösterimi' : 'Puanın cetvel üzerinde gösterimi'}</li>
                    <li>Düzey ve sade bir açıklama</li>
                  </>
                ) : (
                  <>
                    <li>{showsMargin ? 'Her boyutun, puanın ölçüm payıyla birlikte cetvel üzerinde gösterimi' : 'Her boyutun cetvel üzerinde gösterimi'}</li>
                    <li>Her boyut için düzey ve sade bir açıklama</li>
                  </>
                )}
                {REPORT_TEMPLATES[def.slug]?.insight && <li>{REPORT_TEMPLATES[def.slug].insight!.pageNote}</li>}
              </>
            )}
            {def.engine === 'reading' && <li>Okuma hızı, anlama oranı ve soru türlerine göre sonuç</li>}
            {def.engine === 'oral' && (
              <>
                <li>Metnin öğrenci için düzeyi: rahat, destekle ya da şimdilik zor; doğru okuma ve anlamaya göre</li>
                <li>Dakikada doğru okunan kelime, doğru okuma oranı ve okuma süresi</li>
                <li>İşaretlenmiş metin: hangi kelimede hangi hata yapıldı; hata türleri, kendi düzeltmeleri ve yanlış okunan kelimeler</li>
                <li>Okumanın ritmi: kayıttan ölçülen duraklamalar</li>
                <li>Akıcılık (vurgu ve tonlama, öbekleme, düzgünlük, tempo), soru türlerine göre anlama ve yeniden anlatma</li>
                <li>Bir sonraki değerlendirme için öneri: aynı, bir alt ya da bir üst sınıfın metni</li>
              </>
            )}
            {cancellation && (
              <>
                <li>Çalışma hızı, bulunan ve atlanan harfler, yanlış işaretlemeler ve net doğru sayısı</li>
                <li>Bölümler ilerledikçe dikkatin korunup korunmadığını gösteren bölüm bölüm grafik</li>
              </>
            )}
            {single?.kind === 'color_word' && (
              <>
                <li>Doğru cevap oranı ve tipik cevap süresi; kelime ile renk aynıyken ve farklıyken ayrı ayrı</li>
                <li>Kelime ile renk farklıyken cevapların ne kadar yavaşladığını (renk-kelime etkisi) gösteren grafik ve açıklaması</li>
              </>
            )}
            {single?.kind === 'go_nogo' && (
              <>
                <li>{`${single.stop} harfinde durabilme ve diğer harflere kaçırmadan tepki verme oranları`}</li>
                <li>Tipik tepki süresi ve hız ile durabilme arasındaki dengenin açıklaması</li>
              </>
            )}
            {single?.kind === 'trail' && (
              <>
                <li>İki bölümün süreleri ve yanlış dokunuş sayıları</li>
                <li>Sayılar ile harfler arasında geçiş yapmanın ne kadar ek süre getirdiğinin açıklaması</li>
              </>
            )}
            {single?.kind === 'mental_rotation' && (
              <>
                <li>Doğru cevap oranı; aynı şekillerde ve ayna görüntülerinde ayrı ayrı</li>
                <li>Döndürme açısına göre tipik karar süresi grafiği ve şekil daha çok döndürüldüğünde karar süresinin nasıl değiştiğinin açıklaması</li>
              </>
            )}
            {single?.kind === 'reaction_time' && (
              <>
                <li>Basit ve seçmeli bölümlerde tipik tepki süresi ve tepkilerin ne kadar tutarlı olduğu</li>
                <li>Seçmeli bölümde doğru taraftaki düğmeye basma ve seçim yapmanın tepkiyi ne kadar uzattığının açıklaması</li>
              </>
            )}
            {single?.kind === 'matrix_reasoning' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Hangi tür kuralların daha kolay bulunduğu (üç boyutlu grafikle) ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'paper_folding' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Ortadan, kenardan ve çapraz katlamalardan hangilerinin daha kolay geldiği (üç boyutlu grafikle), yanlış cevapların neyi düşündürdüğü ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'rule_switch' && (
              <>
                <li>Doğruluk ve hataların türü (iki kuralın farklı düğmeyi istediği şekillerde öteki kurala göre basmak)</li>
                <li>Kural değiştiğinde ve iki kural karıştığında cevabın ne kadar yavaşladığı (tipik süreler grafiğiyle) ve görevin nasıl yapıldığı</li>
              </>
            )}
            {single?.kind === 'logical_reasoning' && (
              <>
                <li>Doğru cevap sayısı ve soru gruplarına göre doğru cevaplar grafiği</li>
                <li>“Eğer–ise” kurallarında kesin olanla olmayanın ayırt edilip edilmediği ve sonuç gerçek hayatta doğru ya da yanlış göründüğünde bu bilginin kararı etkileyip etkilemediği (üç boyutlu grafikle)</li>
              </>
            )}
            {single?.kind === 'numerical_reasoning' && (
              <>
                <li>Doğru cevap sayısı ve soru gruplarına göre doğru cevaplar (grafik ve üç boyutlu grafikle)</li>
                <li>Orantılı ve orantılı olmayan durumların ayırt edilip edilmediği, eşittir işaretinin nasıl okunduğu ve görülen yanılgılar</li>
              </>
            )}
            {single?.kind === 'cube_net' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Yalnızca yüzlerin yerinin önemli olduğu sorularla şekillerin yönünün de önemli olduğu soruların karşılaştırması, yanlış cevaplarda öne çıkan yanılgılar (karşılıklı yüzleri yan yana görmek, köşedeki sırayı ters görmek, şeklin yönünü yanlış görmek) ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'hidden_figures' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Yanlış cevaplarda şeklin döndürülmüş ya da ters çevrilmiş biçiminin mi, bir köşesi farklı benzerinin mi seçildiği ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'figural_analogy' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>
                  Renk ve büyüklük, döndürme ve ayna görüntüsü, yer ve sayı değişikliklerinin ayrı ayrı ne kadar doğru uygulandığı (üç boyutlu grafikle); yanlış cevaplarda
                  değişikliklerin hiç uygulanmadığı, bir kısmının uygulandığı, yanlış uygulandığı ya da fazladan bir değişikliğin yapıldığı şekillerden birinin öne
                  çıkıp çıkmadığı ve sorulara nasıl çalışıldığı
                </li>
              </>
            )}
            {single?.kind === 'pattern_memory' && (
              <>
                <li>Bütün kareleriyle doğru hatırlanan en büyük desen (desen aralığı) ve desen büyüklüğüne göre doğru hatırlanan desenler grafiği</li>
                <li>Yanlış hatırlanan desenlerde karelerin unutulup unutulmadığı, fazladan kare işaretlenip işaretlenmediği, yanlış karelerin doğru yerin yanında olup olmadığı ve desenlere nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'letter_number' && (
              <>
                <li>Bütün öğeleri doğru sırada girilen en uzun dizi ve dizi uzunluğuna göre doğru sıralanan diziler grafiği</li>
                <li>
                  Yanlış dizilerde öğelerin mi unutulduğu yoksa bütün öğeler hatırlanıp sıranın mı karıştığı, sayıların ve harflerin ayrı ayrı ne kadar hatırlanıp
                  sıraya konduğu ve dizilere nasıl çalışıldığı
                </li>
              </>
            )}
            {single?.kind === 'symbol_search' && (
              <>
                <li>İki dakikada verilen doğru kararlar, bir kararın tipik süresi (her doğru kararın süresiyle) ve 30 saniyelik bölümlere göre doğru kararlar grafiği</li>
                <li>
                  Doğruluk ve yanlışların türü (sıradaki simgenin gözden kaçması ya da sırada olmayan bir simgenin görülmesi), aranan simgeye çok benzeyen simgelerin
                  etkisi, “Var” ve “Yok” kararlarının süresi ve en hızlı kararlarla daha uzun düşünülen kararların doğruluğu
                </li>
              </>
            )}
            {single?.kind === 'cognitive_reflection' && (
              <>
                <li>Soruların kaçında doğru cevaba ulaşıldığı (sayısal ve sözel sorular ayrı; grafik ve üç boyutlu grafikle)</li>
                <li>Yanlışların türü, benzer soru çiftlerinin karşılaştırılması ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'mental_rotation_3d' && (
              <>
                <li>Kaç soruda döndürülmüş iki şeklin de bulunduğu ve seçilen şekillerin kaçının doğru olduğu</li>
                <li>Yalnızca dik bir eksen çevresinde döndürülmüş şekillerle ayrıca yan yatırılmış şekillerin karşılaştırması (grafikle), yanlış cevaplarda ayna görüntülerinin nasıl seçildiği ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'perspective' && (
              <>
                <li>Gösterilen yönlerin doğru yönden ortalama kaç derece saptığı ve kendini zihinde az ya da çok döndürmeyi gerektiren soruların karşılaştırması (grafikle)</li>
                <li>Yanlış gösterilen yönlerde sağ ile solun karıştırılıp karıştırılmadığı, yönün haritaya yukarıdan bakar gibi gösterilip gösterilmediği ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'complex_span' && (
              <>
                <li>İşlemlerin arasında gösterilen harflerin kaç tanesinin doğru yerde hatırlandığı ve diziler uzadıkça sonucun nasıl değiştiği (3 harften 7 harfe; grafik ve üç boyutlu grafikle)</li>
                <li>İşlemlerin ne kadarının süresi içinde doğru cevaplandığı ve doğru yerde olmayan harflerin türü (yeri karışan, dizide olmayan ya da boş bırakılan)</li>
              </>
            )}
            {single?.kind === 'tower' && (
              <>
                <li>Problemlerin kaçının en az hamlede çözüldüğü (3 hamleden 7 hamleye her uzunlukta ayrı; grafik ve üç boyutlu grafikle)</li>
                <li>Problemler uzadıkça sonucun nasıl değiştiği, fazla hamleyle çözülen ve hedefe ulaşılamayan problemler, ilk hamleye başlamadan önce ne kadar düşünüldüğü</li>
              </>
            )}
            {single?.kind === 'word_list' && (
              <>
                <li>Aynı liste üç kez gösterildiğinde her seferinde hatırlanan kelimeler (grafikle) ve araya yeni bir liste girdikten sonra öğrenilenin ne kadar korunduğu</li>
                <li>Kelimeleri görünce tanıma, yanlışlıkla tanınan kelimelerin türü ve listenin başından, ortasından ve sonundan ne kadar hatırlandığı (üç boyutlu grafikle)</li>
              </>
            )}
            {single?.kind === 'vocabulary' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Eş anlam, zıt anlam, cümlede anlam ve deyim sorularından hangilerinin daha kolay geldiği (üç boyutlu grafikle), yanlış cevapların neyi düşündürdüğü ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'verbal_reasoning' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Hangi soru türlerinin daha kolay geldiği (üç boyutlu grafikle), yanlış cevapların neyi düşündürdüğü ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'letter_series' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Hangi tür kuralların daha kolay bulunduğu (üç boyutlu grafikle), yanlış cevapların neyi düşündürdüğü ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'number_series' && (
              <>
                <li>Doğru cevap sayısı, düzeylere göre doğru cevaplar grafiği ve ulaşılan düzeyin ne anlama geldiği</li>
                <li>Hangi tür kuralların daha kolay bulunduğu (üç boyutlu grafikle), yanlış cevapların neyi düşündürdüğü ve sorulara nasıl çalışıldığı</li>
              </>
            )}
            {single?.kind === 'n_back' && (
              <>
                <li>Bir geri ve iki geri bölümlerinde aynı harfleri yakalama ve aynı olmayan harflerde basmadan geçme oranları</li>
                <li>Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun nasıl değiştiğinin açıklaması</li>
              </>
            )}
            {arith && (
              <>
                <li>Her işlemde 60 saniyede doğru yapılan işlem sayısı ve düzeylere göre doğru işlemler grafiği</li>
                <li>Doğruluk, yanlışların türü (ör. eldeyi atlamak, çarpım tablosunda başka bir sonucu yazmak) ve temel işlemlerde doğru cevap başına tipik süre</li>
              </>
            )}
            {def.engine === 'tasks' && !single && !arith && <li>Her görevin sonucu ve ne anlama geldiği</li>}
            {def.engine === 'quiz' && (
              <>
                <li>Genel sonuç ve konu alanlarının her birinde “sağlam”, “pekiştirilmeli” ya da “öncelikli” değerlendirmesi</li>
                <li>Yanlış cevapların işaret ettiği hata türleri</li>
              </>
            )}
            <li>Sonucu dikkatle yorumlamayı gerektiren durumlar için uyarılar (ör. çok hızlı cevaplama)</li>
            <li>Norm durumu ve sonucun sınırları hakkında not</li>
            {roadmap && (
              <li>
                <strong>Gelişim yol haritası:</strong> {roadmapSummary(def.slug)}
              </li>
            )}
          </ul>
          <p className="measure t-small text-ink-2">
            Cevaplar yalnızca raporu hazırlamak için kullanılır ve saklanmaz; raporun tek kopyası size verilen PDF’tir.
            {def.engine === 'oral' && ' Ses kaydı yalnızca cihazınızda kalır; sunucuya ya da başka bir yere gönderilmez.'}
            {!roadmap && def.engine !== 'oral' && (
              <>
                {' '}
                Ayrıntılı açıklamaların ve evde, okulda işe yarayacak önerilerin yer alacağı kapsamlı rapor
                {def.adults ? ' öğrenciler ve veliler için' : ''} yakında sunulacak.
              </>
            )}
          </p>
        </div>
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
            <p className="opacity-85">Hesap açmadan çözün. Cevaplarınız saklanmaz; rapor ekranda gösterilir ve PDF olarak size verilir.</p>
          </div>
          <Link href={solveUrl} className="btn bg-paper text-ink hover:bg-surface-2">
            Testi çöz
          </Link>
        </div>
      </section>
    </article>
  );
}
