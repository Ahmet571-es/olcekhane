import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { getInstrumentDef, isSolvable, publicInstruments } from '@/content/instruments';
import { JsonLd } from '@/components/seo/json-ld';
import { GuideList } from '@/components/site/guide-list';
import { guidesForTest } from '@/content/rehber';
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
  // zihinde döndürme, tepki hızı).
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
              : null;
  const itemCount =
    def.engine === 'likert'
      ? `${def.items.length} ${likertItemNoun(def)}`
      : taskLength
        ? taskLength
        : def.engine === 'tasks'
          ? `${def.tasks.length} görev`
          : def.engine === 'quiz'
            ? `${def.forms[0].items.length} soru`
            : '1 metin, 8 soru';
  const scales = def.scales.filter((s) => s.key !== 'total');
  // Ayrıntılı profil: boyutlar (bileşik ölçekler) ve altlarındaki alt özellikler birlikte anlatılır.
  const composites = scales.filter((s) => s.of?.length);
  const facetCount = composites.reduce((n, d) => n + (d.of?.length ?? 0), 0);
  // Güvenirliği ve başvuru standart sapması bilinen ölçeklerde cetvelde ölçüm payı da gösterilir.
  const showsMargin = def.engine === 'likert' && def.scales.some((s) => s.alpha !== undefined && s.sdRef !== undefined);
  const solveUrl = `/testler/${def.slug}/coz`;
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

      <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="olcer">
        <h2 id="olcer" className="t-h2">
          Neyi ölçer?
        </h2>
        <div className="flex flex-col gap-6">
          <p className="measure text-ink-2">{sc.whatItMeasures}</p>
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
              {def.adults
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
            {def.engine === 'likert' && def.profile === 'facets' && (
              <>
                <li>
                  {`${NUMBER_WORDS[composites.length] ?? composites.length} boyutun${showsMargin ? ', puanın ölçüm payıyla birlikte' : ''} cetvel üzerinde gösterimi`}
                </li>
                <li>{`Her boyutun altında alt özelliklerinin (toplam ${facetCount}) cetveli ve her biri için kısa bir yorum`}</li>
              </>
            )}
            {def.engine === 'likert' && def.profile === 'circumplex' && (
              <>
                <li>{`${NUMBER_WORDS[scales.length] ?? scales.length} kişilerarası tarzın çember üzerinde gösterimi`}</li>
                <li>Her tarz için düzey ve sade bir açıklama</li>
              </>
            )}
            {def.engine === 'likert' && !def.profile && (
              <>
                <li>{showsMargin ? 'Her boyutun, puanın ölçüm payıyla birlikte cetvel üzerinde gösterimi' : 'Her boyutun cetvel üzerinde gösterimi'}</li>
                <li>Her boyut için düzey ve sade bir açıklama</li>
              </>
            )}
            {def.engine === 'reading' && <li>Okuma hızı, anlama oranı ve soru türlerine göre sonuç</li>}
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
            {single?.kind === 'n_back' && (
              <>
                <li>Bir geri ve iki geri bölümlerinde aynı harfleri yakalama ve aynı olmayan harflerde basmadan geçme oranları</li>
                <li>Akılda tutulacak harf sayısı birden ikiye çıkınca sonucun nasıl değiştiğinin açıklaması</li>
              </>
            )}
            {def.engine === 'tasks' && !single && <li>Her görevin sonucu ve ne anlama geldiği</li>}
            {def.engine === 'quiz' && (
              <>
                <li>Genel sonuç ve konu alanlarının her birinde “sağlam”, “pekiştirilmeli” ya da “öncelikli” değerlendirmesi</li>
                <li>Yanlış cevapların işaret ettiği hata türleri</li>
              </>
            )}
            <li>Sonucu dikkatle yorumlamayı gerektiren durumlar için uyarılar (ör. çok hızlı cevaplama)</li>
            <li>Norm durumu ve sonucun sınırları hakkında not</li>
          </ul>
          <p className="measure t-small text-ink-2">
            Cevaplar yalnızca raporu hazırlamak için kullanılır ve saklanmaz; raporun tek kopyası size verilen PDF’tir. Ayrıntılı açıklamaların
            ve evde, okulda işe yarayacak önerilerin yer alacağı kapsamlı rapor{def.adults ? ' öğrenciler ve veliler için' : ''} yakında sunulacak.
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
