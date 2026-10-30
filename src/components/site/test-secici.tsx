'use client';

import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';
import { SECICI_GOALS, SECICI_TIMES, type GoalKey } from '@/content/test-secici';
import { ADULT_GRADE, GRADE_LABELS } from '@/lib/config';
import { recommend, solvePath, suggestPackage, type SeciciTest } from '@/lib/test-secici';

/** Paketin bu sayfada gösterilmesi için gerekenler (sunucu hazırlar: tarayıcıya testlerin maddeleri gitmez). */
export interface PackageInfo {
  path: string;
  name: string;
  /** Paketin açık olduğu sınıflar ve her sınıfta yaklaşık süresi (dakika). */
  minutes: Record<number, number>;
}

/** Yuvarlak seçenek düğmesi (radyo ya da onay kutusu; klavyeyle de seçilir). */
function Chip({ type, name, checked, onChange, children }: { type: 'radio' | 'checkbox'; name: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="relative cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-full min-h-11 flex-col justify-center gap-0.5 rounded-2xl border-[1.5px] border-rule-strong bg-surface px-4 py-2.5 transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
        {checked && (
          <span className="hidden forced-colors:inline" aria-hidden="true">
            ✓
          </span>
        )}
        {children}
      </span>
    </label>
  );
}

const gradeLabel = (g: number) => (g === ADULT_GRADE ? 'yetişkinler' : g === 13 ? 'mezunlar' : `${g}. sınıf`);

/**
 * "Hangi test bana uygun?": kimin çözeceği, ne öğrenilmek istendiği ve vakit seçilir; öneriler seçim değiştikçe
 * yenilenir. Seçimler yalnızca bu sayfada durur: kaydedilmez, adrese yazılmaz, sunucuya gönderilmez.
 */
export function TestSecici({ catalog, grades, pkg }: { catalog: SeciciTest[]; grades: number[]; pkg: PackageInfo }) {
  const id = useId();
  const [grade, setGrade] = useState<number | null>(null);
  const [goals, setGoals] = useState<GoalKey[]>([]);
  const [budget, setBudget] = useState(30);
  const toggle = (k: GoalKey) => setGoals((gs) => (gs.includes(k) ? gs.filter((x) => x !== k) : [...gs, k]));

  const ready = grade !== null && goals.length > 0;
  const result = ready ? recommend(catalog, goals, grade, budget) : null;
  const pkgMinutes = grade !== null ? pkg.minutes[grade] : undefined;
  const showPackage = ready && pkgMinutes !== undefined && suggestPackage(goals, budget);
  const goalName = (k: GoalKey) => SECICI_GOALS.find((g) => g.key === k)!.name;

  return (
    <div className="flex flex-col gap-8">
      <div className="glass flex flex-col gap-7 rounded-[1.75rem] p-5 sm:p-7">
        <div className="field max-w-sm">
          <label htmlFor={`${id}-sinif`} className="field-label">
            1. Testi kim çözecek?
          </label>
          <select
            id={`${id}-sinif`}
            className="input"
            value={grade ?? ''}
            onChange={(e) => setGrade(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="" disabled>
              Seç
            </option>
            {grades
              .filter((g) => g !== ADULT_GRADE)
              .map((g) => (
                <option key={g} value={g}>
                  {GRADE_LABELS[g] ?? `${g}. sınıf`}
                </option>
              ))}
            {grades.includes(ADULT_GRADE) && <option value={ADULT_GRADE}>Yetişkinim (18 yaş ve üzeri)</option>}
          </select>
          {grade !== null && grade <= 2 && (
            <p className="t-small text-ink-2">1. ve 2. sınıfta değerlendirmeyi öğretmen ya da veli yapar.</p>
          )}
        </div>

        <fieldset className="flex min-w-0 flex-col gap-3">
          <legend className="field-label mb-3">2. Ne öğrenmek istiyorsun? Birden çok seçebilirsin.</legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {SECICI_GOALS.map((g) => (
              <Chip key={g.key} type="checkbox" name={`${id}-amac`} checked={goals.includes(g.key)} onChange={() => toggle(g.key)}>
                <span className="font-bold">{g.name}</span>
                <span className="t-small opacity-80">{g.hint}</span>
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex min-w-0 flex-col gap-3">
          <legend className="field-label mb-3">3. Ne kadar vaktin var?</legend>
          <div className="flex flex-wrap gap-2.5">
            {SECICI_TIMES.map((t) => (
              <Chip key={t.minutes} type="radio" name={`${id}-sure`} checked={budget === t.minutes} onChange={() => setBudget(t.minutes)}>
                <span className="font-bold">{t.label}</span>
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <section aria-labelledby={`${id}-oneri`} className="flex flex-col gap-5">
        <h2 id={`${id}-oneri`} className="t-h2">
          Önerilen testler
        </h2>
        {/* Ekran okuyucuya yalnızca kısa bir özet okunur (bütün kartlar her seçimde yeniden okunmasın). */}
        <p className="sr-only" aria-live="polite">
          {result ? (result.picks.length ? `${result.picks.length} test önerildi, toplam yaklaşık ${result.minutes} dakika.` : 'Bu seçimlere uygun test yok.') : ''}
        </p>
        {!ready && <p className="text-ink-2">Önce testi kimin çözeceğini ve ne öğrenmek istediğini seç; öneriler burada belirir.</p>}

        {result && grade !== null && (
          <>
            {result.picks.length > 0 && (
              <>
                <p className="text-ink-2">
                  {result.picks.length === 1
                    ? `Önerilen test yaklaşık ${result.minutes} dakika sürer. Sonunda bir rapor ve PDF alırsın.`
                    : `Bu sırayla çözebilirsin: ${result.picks.length} test, toplam yaklaşık ${result.minutes} dakika. Her testin sonunda ayrı bir rapor ve PDF alırsın; testlerin arasında mola verebilirsin.`}
                </p>
                <ol className="grid gap-4 md:grid-cols-2">
                  {result.picks.map((p, i) => (
                    <li key={p.test.slug} className="panel flex flex-col gap-3 p-5">
                      <p className="kicker">
                        {i + 1}. {p.skill} · yaklaşık {p.test.minutes} dakika
                      </p>
                      <h3 className="font-display text-xl font-bold">
                        <Link href={`/testler/${p.test.slug}`}>{p.test.name}</Link>
                      </h3>
                      <p className="text-ink-2">{p.why}</p>
                      <div className="mt-auto flex flex-wrap gap-2.5">
                        <Link href={solvePath(p.test.slug, grade)} className="btn btn-primary">
                          Başla
                        </Link>
                        <Link href={`/testler/${p.test.slug}`} className="btn btn-secondary">
                          Testi tanı
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {result.overBudget && (
              <p className="t-small text-ink-2">Bu alanda seçtiğin süreye sığan bir test yok; en kısası yukarıda.</p>
            )}
            {result.moreWithTime && budget < 60 ? (
              <p className="t-small text-ink-2">Daha çok vakit seçersen bu alanlarda başka testler de önerilir.</p>
            ) : (
              result.more && (
                <p className="t-small text-ink-2">
                  Bu alanlarda başka testler de var; hepsini <Link href="/testler">Testler</Link> sayfasında bulabilirsin.
                </p>
              )
            )}
            {result.missing.map((k) => (
              <p key={k} className="t-small text-ink-2">
                “{goalName(k)}” alanında {gradeLabel(grade)} için uygun bir test henüz yok.
              </p>
            ))}
            {showPackage && (
              <aside className="panel flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                  <p className="kicker">Hepsi bir arada · yaklaşık {pkgMinutes} dakika</p>
                  <p className="font-bold">{pkg.name}</p>
                  <p className="text-ink-2">
                    Kişilik, ilgi, çalışma alışkanlıkları ve zihinsel beceri testleri art arda; sonunda kısa bir özet ve tek PDF.
                  </p>
                </div>
                <Link href={pkg.path} className="btn btn-secondary shrink-0 self-start md:self-auto">
                  Pakete göz at
                </Link>
              </aside>
            )}
            <p className="t-small text-ink-2">
              Öneri yalnızca seçimlerine göre hazırlanır; listedeki başka bir testi de seçebilirsin. Testler tanı koymaz, zekâ puanı vermez.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
