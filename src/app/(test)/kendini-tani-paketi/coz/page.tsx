import type { Metadata } from 'next';
import Link from 'next/link';
import { PackageSession, type PackageClientTest } from '@/components/paket/package-session';
import { LogoMark } from '@/components/site/logo';
import { PageGuide } from '@/components/site/page-guide';
import { PACKAGE_AREAS, PACKAGE_NAME, PACKAGE_PATH, packageGrades, packageMinutes, packageTests } from '@/content/paket';
import { payloadFor } from '@/lib/assessment/payload';
import { ADULT_GRADE, ADULT_PARAM, GRADE_LABELS, parseGradeParam, siteUrl } from '@/lib/config';

export const metadata: Metadata = { title: `${PACKAGE_NAME}: başla` };

/**
 * Kendini Tanı Paketi'nin çözme sayfası: önce sınıf (ya da "Yetişkinim") seçilir, sonra paketin testleri bu sayfada art
 * arda çözülür. Test sayfaları gibi arama motorlarına kapalıdır ((test) düzeni).
 */
export default async function PackageSolvePage(props: PageProps<'/kendini-tani-paketi/coz'>) {
  const q = await props.searchParams;
  const grade = parseGradeParam(typeof q.sinif === 'string' ? q.sinif : undefined);
  const grades = packageGrades();
  const ready = grade !== null && grades.includes(grade);
  const preset = parseGradeParam(typeof q.secili === 'string' ? q.secili : undefined);
  const presetValue = preset !== null && grades.includes(preset) ? (preset === ADULT_GRADE ? ADULT_PARAM : String(preset)) : '';

  const tests: PackageClientTest[] = ready
    ? packageTests(grade).map(({ slot, def }) => ({
        slug: def.slug,
        name: def.name,
        skill: slot.skill,
        areaName: PACKAGE_AREAS.find((a) => a.key === slot.area)!.name,
        minutes: def.estimatedMinutes,
        why: slot.why,
        pilot: def.status === 'pilot',
        payload: payloadFor(def, grade, { sessionNote: false }),
      }))
    : [];
  const longest = Math.max(...grades.map((g) => packageMinutes(packageTests(g))));
  const shortest = Math.min(...grades.map((g) => packageMinutes(packageTests(g))));

  return (
    <>
      <header className="border-b border-rule bg-surface">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark size={28} />
            <span className="truncate font-bold">{PACKAGE_NAME}</span>
          </div>
          {/* Tam sayfa geçişi: paket sürerken ayrılmak cevapları sildiği için uyarı çıksın. */}
          <a href={PACKAGE_PATH} className="btn btn-quiet min-h-10">
            Vazgeç
          </a>
        </div>
      </header>
      <main id="icerik" className="container-page flex flex-1 flex-col py-8 md:py-12">
        {ready ? (
          <PackageSession
            grade={grade}
            gradeLabel={GRADE_LABELS[grade] ?? `${grade}. sınıf`}
            adult={grade === ADULT_GRADE}
            tests={tests}
            siteUrl={siteUrl()}
            packagePath={PACKAGE_PATH}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
            <div className="flex flex-col gap-3">
              <p className="t-meta">
                Ücretsiz · yaklaşık {shortest === longest ? longest : `${shortest}–${longest}`} dakika · 5. sınıftan yetişkinlere
              </p>
              <h1 className="t-h1">{PACKAGE_NAME}</h1>
              <p className="t-lede">Kişilik, ilgi alanları, çalışma alışkanlıkları ve dört zihinsel beceri testi art arda; sonunda tek rapor.</p>
            </div>

            <PageGuide plain title="Nasıl ilerler?">
              <p>Paket üç adımda biter:</p>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-ink-2">
                <li>Paketi kimin çözdüğünü seç ve “Pakete başla” düğmesine bas: testler sınıfa göre seçilir.</li>
                <li>İstemediğin testi paketten çıkar, sonra testleri sırayla çöz; aralarda mola verebilirsin.</li>
                <li>Son test bitince özet ve bütün raporlar açılır. Saklamak için tek PDF olarak indir.</li>
              </ol>
            </PageGuide>

            <div className="notice notice-ok flex flex-col gap-2">
              <p className="font-bold">Hiçbir bilgin saklanmaz.</p>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                <li>Hesap açman gerekmez; ad, e-posta ya da telefon istemiyoruz.</li>
                <li>Cevapların yalnızca raporları hazırlamak için kullanılır, hiçbir yere kaydedilmez.</li>
                <li>Cevapların ve raporların yalnızca açık sayfada durur. Sayfayı kapatınca kaybolur; saklamak istersen PDF’i indir.</li>
              </ul>
              <p className="t-small">
                Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
              </p>
            </div>

            <form method="get" className="panel flex flex-col gap-5 p-6">
              <div className="field">
                <label htmlFor="sinif" className="field-label">
                  Paketi kim çözüyor?
                </label>
                <select id="sinif" name="sinif" className="input" defaultValue={presetValue} required aria-describedby="sinif-ipucu">
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
                  {grades.includes(ADULT_GRADE) && <option value={ADULT_PARAM}>Yetişkinim (18 yaş ve üzeri)</option>}
                </select>
                <p id="sinif-ipucu" className="field-hint">
                  Okula gidiyorsan ya da mezun olup üniversiteye hazırlanıyorsan sınıfını seç: sana ve veline ayrı ayrı yazılmış raporlar hazırlanır. 18
                  yaşını doldurduysan ve paketi kendin için çözüyorsan “Yetişkinim”i seç: sana yazılmış tek bir rapor hazırlanır.
                </p>
              </div>
              <div>
                <button type="submit" className="btn btn-primary btn-lg">
                  Pakete başla
                </button>
              </div>
            </form>

            <p className="t-small text-ink-2">
              Paket bir çocuk içinse bir yetişkinin yanında çözmesini öneririz. Paket bir tanı koymaz; her testin bilimsel dayanağı kendi sayfasında
              ve raporunda yazıyor. <Link href={PACKAGE_PATH}>Pakette neler var?</Link>
            </p>
          </div>
        )}
      </main>
    </>
  );
}
