'use client';

import { useId, useState, type CSSProperties } from 'react';
import { ADULT_GRADE, ADULT_PARAM, GRADE_LABELS, gradeAllowed } from '@/lib/config';
import { TestCard, type TestCardInfo } from './test-card';

export interface GroupSection {
  domain: string;
  /** Sayfa içi bağlantı adı (#kisilik). */
  id: string;
  title: string;
  intro: string;
  color: string;
  tests: TestCardInfo[];
}

/** Çözme sayfasında seçili gelecek sınıf (`?secili=`): öğrenci yine onaylayıp başlatır. */
function solveHref(slug: string, grade: number | null): string | undefined {
  if (grade === null) return undefined;
  return `/testler/${slug}/coz?secili=${grade === ADULT_GRADE ? ADULT_PARAM : grade}`;
}

/**
 * Yaş grubu sayfasındaki testler, bölüm bölüm. Grupta birden çok sınıf varsa üstte "Kaçıncı sınıftasın?" seçimi
 * durur: seçilince yalnızca o sınıfa uygun testler görünür ve "Çöz" düğmesi sınıfı seçili getirir. Seçim yalnızca
 * bu sayfada durur: kaydedilmez, adrese yazılmaz, sunucuya gönderilmez.
 */
export function GroupTests({ grades, sections }: { grades: number[]; sections: GroupSection[] }) {
  const id = useId();
  const single = grades.length === 1 ? grades[0] : null;
  const [picked, setPicked] = useState<number | null>(null);
  const grade = single ?? picked;
  const all = sections.flatMap((s) => s.tests);
  // Yalnızca en az bir testin uyduğu sınıflar seçilebilir.
  const options = grades.filter((g) => all.some((t) => gradeAllowed(t, g)));
  const fits = (t: TestCardInfo) => grade === null || gradeAllowed(t, grade);
  const count = all.filter(fits).length;

  return (
    <div className="flex flex-col gap-10">
      {single === null && options.length > 1 && (
        <fieldset className="glass flex min-w-0 flex-col gap-3 rounded-[1.75rem] p-5 sm:p-6">
          <legend className="sr-only">Kaçıncı sınıftasın?</legend>
          <p className="font-display text-xl font-bold" aria-hidden="true">
            Kaçıncı sınıftasın?
          </p>
          <div className="flex flex-wrap gap-2">
            {[null, ...options].map((g) => (
              <label key={g ?? 'hepsi'} className="relative shrink-0 cursor-pointer">
                <input type="radio" name={`${id}-sinif`} checked={picked === g} onChange={() => setPicked(g)} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-rule-strong bg-surface px-4 text-[0.9375rem] font-bold text-ink-2 transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                  {picked === g && (
                    <span className="mr-1 hidden forced-colors:inline" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {g === null ? 'Hepsini göster' : (GRADE_LABELS[g] ?? `${g}. sınıf`)}
                </span>
              </label>
            ))}
          </div>
          <p className="t-small text-ink-2" aria-live="polite">
            {grade === null
              ? 'Sınıfını seçersen yalnızca sana uygun testler görünür ve test, sınıfın seçili olarak açılır. Seçimin hiçbir yere kaydedilmez.'
              : `${GRADE_LABELS[grade] ?? `${grade}. sınıf`} için ${count} test gösteriliyor.`}
          </p>
        </fieldset>
      )}

      {/* Uymayan kartlar kaldırılmaz, gizlenir: kaydırınca belirme ve eğilme efektleri kartlarda kalır. */}
      {sections.map((s) => (
        <section key={s.domain} id={s.id} aria-labelledby={`${s.id}-baslik`} className="scroll-mt-28" hidden={!s.tests.some(fits)}>
          <div className="mb-5 flex max-w-3xl flex-col gap-2">
            <h2 id={`${s.id}-baslik`} className="t-h2 flex items-center gap-3">
              <span className="size-3.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              {s.title}
            </h2>
            <p className="text-ink-2">{s.intro}</p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {s.tests.map((t, i) => (
              <li key={t.slug} hidden={!fits(t)} data-reveal style={{ '--reveal-gecikme': `${(i % 3) * 70}ms` } as CSSProperties}>
                <TestCard t={t} solveHref={solveHref(t.slug, grade)} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
