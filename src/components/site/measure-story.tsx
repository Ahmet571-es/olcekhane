'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ScaleRuler } from '@/components/report/scale-ruler';
import { besFaktor } from '@/content/instruments/bes-faktor';
import { besFaktorReport } from '@/content/reports/bes-faktor';

/**
 * "Ölçüm nasıl işler?" anlatısı. Masaüstünde bölüm ekrana sabitlenir; kaydırdıkça dört adım sırayla
 * canlanır (soru → cevap → cetvel → rapor). Telefonda adımlar alt alta, her biri kendi görseliyle
 * gösterilir. Görseller örnektir; gerçek bir öğrenciye ait değildir.
 */

const STEPS = [
  {
    t: 'Soruyu okur',
    d: 'Öğrenci kendini anlatan kısa cümleleri okur. Cümleler yayımlanmış bir bilimsel ölçekten ya da bizim geliştirip belgelediğimiz bir görevden gelir.',
  },
  {
    t: 'Cevabını işaretler',
    d: 'Her cümleye ne kadar katıldığını seçer. Doğru ya da yanlış cevap yoktur; test tek seferde ve hesap açmadan çözülür.',
  },
  {
    t: 'Puan cetvele yerleşir',
    d: 'Cevaplar puana dönüşür ve cetvel üzerinde ölçüm payıyla birlikte gösterilir. Türkiye normu olmadığı için sonucu akranlarla karşılaştırmayız.',
  },
  {
    t: 'Rapor iki dilde gelir',
    d: 'Sonuç öğrenciye kendi diliyle, veliye ayrıca anlatılır. Rapor PDF olarak indirilir; biz hiçbir kopyasını saklamayız.',
  },
];

const ITEM = besFaktor.items.find((i) => i.key === 'E1')!;
const OPTIONS = besFaktor.options;
const SAMPLE = { value: 3.6, low: 3.2, high: 4.0 };
const REPORT = besFaktorReport.scales.extraversion.high!;

function QuestionCard({ selected, stacked }: { selected: boolean; stacked: boolean }) {
  return (
    <div className="relative">
      {stacked && (
        <>
          <div className="absolute inset-0 translate-x-5 translate-y-5 rotate-[3deg] rounded-[1.75rem] border border-rule bg-surface-2" />
          <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[1.5deg] rounded-[1.75rem] border border-rule bg-surface" />
        </>
      )}
      <div className="relative flex flex-col gap-5 rounded-[1.75rem] border border-rule bg-surface p-6 shadow-[var(--shadow)] md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="chip">{stacked ? '48 / 50' : '1 / 50'}</span>
          <span className="t-meta">Beş Faktör Kişilik Profili · örnek</span>
        </div>
        <p className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-bold leading-snug">{ITEM.text}</p>
        <ul className="flex flex-col gap-2">
          {OPTIONS.map((o) => {
            const on = selected && o.value === 4;
            return (
              <li
                key={o.value}
                className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-[0.95rem] transition-all duration-500 ${
                  on ? 'scale-[1.02] border-[color:var(--dim-ext)] bg-[color:color-mix(in_oklab,var(--dim-ext)_12%,var(--surface))] font-bold' : 'border-rule'
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-500 ${on ? 'border-[color:var(--dim-ext)] bg-[color:var(--dim-ext)]' : 'border-rule-strong'}`}
                  aria-hidden="true"
                >
                  {on && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                {o.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function RulerCard() {
  return (
    <div className="flex flex-col gap-6 rounded-[1.75rem] border border-rule bg-surface p-6 shadow-[var(--shadow)] md:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl font-bold">Dışadönüklük</p>
        <span className="chip">Örnek</span>
      </div>
      <ScaleRuler
        min={1}
        max={5}
        value={SAMPLE.value}
        ciLow={SAMPLE.low}
        ciHigh={SAMPLE.high}
        majorStep={1}
        minorStep={0.25}
        poles={{ low: 'Sakin', high: 'Sosyal' }}
        srLabel="Örnek: dışadönüklük puanı 5 üzerinden 3,6; ölçüm payı 3,2 ile 4,0 arası"
      />
      <dl className="grid grid-cols-2 gap-3 text-[0.95rem]">
        <div className="rounded-xl bg-surface-2 p-3">
          <dt className="t-meta">Puan</dt>
          <dd className="font-display text-2xl font-bold tabular">3,6 / 5</dd>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <dt className="t-meta">Ölçüm payı</dt>
          <dd className="font-display text-2xl font-bold tabular">±0,4</dd>
        </div>
      </dl>
    </div>
  );
}

/** Görsel olarak iki rapor: öğrenciye ve veliye (etkileşimli örnek ana sayfanın aşağısında). */
function ReportCard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 translate-x-6 translate-y-6 rotate-[2.5deg] rounded-[1.75rem] border border-rule bg-surface-2 p-6 md:p-8">
        <p className="t-meta">Veliye</p>
        <p className="mt-1 line-clamp-3 text-ink-3">{REPORT.parent}</p>
      </div>
      <div className="relative flex flex-col gap-4 rounded-[1.75rem] border border-rule bg-surface p-6 shadow-[var(--shadow)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-ink px-4 py-1.5 text-[0.95rem] font-bold text-paper">Öğrenciye</span>
          <span className="chip">PDF</span>
        </div>
        <div>
          <p className="t-meta">Dışadönüklük · örnek</p>
          <p className="font-display text-2xl font-bold">{REPORT.summary}</p>
          <p className="mt-2 text-ink-2">{REPORT.student}</p>
        </div>
      </div>
    </div>
  );
}

function Scene({ step }: { step: number }) {
  if (step <= 1) return <QuestionCard selected={step === 1} stacked={step === 1} />;
  if (step === 2) return <RulerCard />;
  return <ReportCard />;
}

/** Masaüstündeki sahne katmanları: ilk iki adım aynı kartta (seçim yerinde canlanır). */
const LAYERS = [
  { key: 'soru', steps: [0, 1] },
  { key: 'cetvel', steps: [2] },
  { key: 'rapor', steps: [3] },
];

export function MeasureStory() {
  const track = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty('--ilerleme', p.toFixed(4));
      const s = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      setStep((prev) => (prev === s ? prev : s));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el || !window.matchMedia('(min-width: 1024px)').matches) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / STEPS.length) * total, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="olcum-baslik" className="relative">
      <div ref={track} className="olcum-iz lg:h-[380vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center">
          <div className="container-page grid w-full gap-12 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-20 lg:py-0">
            <div className="flex flex-col">
              <p className="kicker">Ölçüm nasıl işler?</p>
              <h2 id="olcum-baslik" className="t-section mt-3">
                Tahmin değil, <span className="tayf-yazi">ölçüm.</span>
              </h2>
              <ol className="relative mt-10 flex flex-col gap-2 lg:mt-12">
                {/* İlerleme çizgisi (masaüstü) */}
                <span aria-hidden="true" className="absolute bottom-3 left-[1.15rem] top-3 hidden w-px bg-rule lg:block" />
                <span
                  aria-hidden="true"
                  className="absolute left-[1.15rem] top-3 hidden w-px origin-top bg-gradient-to-b from-[color:var(--dim-con)] via-[color:var(--dim-int)] to-[color:var(--dim-agr)] lg:block"
                  style={{ height: 'calc((100% - 1.5rem) * var(--ilerleme, 0))' } as CSSProperties}
                />
                {STEPS.map((s, i) => {
                  const active = i === step;
                  return (
                    <li key={s.t} className="relative lg:pl-14">
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        className={`olcum-adim flex w-full items-start gap-4 text-left lg:pointer-events-auto ${active ? 'is-active' : ''}`}
                        aria-current={active ? 'step' : undefined}
                      >
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full border-2 font-display text-base font-bold tabular transition-all duration-500 lg:absolute lg:left-0 ${
                            active ? 'border-transparent bg-ink text-paper' : 'border-rule-strong bg-paper text-ink-3'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="flex flex-col pt-0.5">
                          <span className={`font-display text-[1.45rem] font-bold leading-tight transition-colors duration-500 ${active ? 'text-ink' : 'lg:text-ink-3'}`}>
                            {s.t}
                          </span>
                          <span className={`olcum-aciklama text-ink-2 ${active ? 'is-open' : ''}`}>
                            <span className="block pt-2 measure">{s.d}</span>
                          </span>
                        </span>
                      </button>
                      {/* Telefonda her adımın görseli kendi altında */}
                      <div className="mt-6 mb-8 lg:hidden" aria-hidden="true" data-reveal>
                        <Scene step={i} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Masaüstünde sabit sahne: etkin adım öne çıkar */}
            <div className="relative hidden aspect-[1/1.02] lg:block" aria-hidden="true">
              <div className="absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--dim-int) 22%, transparent), transparent 60%), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--dim-ext) 18%, transparent), transparent 55%)' }} />
              {LAYERS.map((layer) => {
                const first = layer.steps[0];
                const last = layer.steps[layer.steps.length - 1];
                const durum = layer.steps.includes(step) ? 'etkin' : step > last ? 'gecti' : 'sirada';
                return (
                  <div key={layer.key} className="olcum-sahne absolute inset-0 flex items-center" data-durum={durum}>
                    <div className="w-full">
                      <Scene step={layer.steps.includes(step) ? step : step > last ? last : first} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
