import Link from 'next/link';
import { UPCOMING } from '@/content/roadmap';
import { publicInstruments } from '@/content/instruments';
import { DOMAIN_LABELS, gradeRangeLabel } from '@/lib/config';

const DOMAIN_ORDER = ['personality', 'career', 'academic', 'cognitive', 'wellbeing', 'skills'] as const;
export const DOMAIN_ANCHORS: Record<string, string> = {
  personality: 'kisilik',
  career: 'ilgi-ve-meslek',
  academic: 'ogrenme',
  cognitive: 'bilissel',
  wellbeing: 'iyi-olus',
  skills: 'beceriler',
};

/**
 * Ölçek rafı: testler alanlarına göre, kaynağı ve durumuyla birlikte listelenir.
 * Yayındaki testlere bağlantı verilir; hazırlananlar dürüstçe "Hazırlanıyor" olarak gösterilir.
 */
export function TestShelf({ showUpcoming = true, headingLevel = 3 }: { showUpcoming?: boolean; headingLevel?: 2 | 3 }) {
  const live = publicInstruments();
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="flex flex-col gap-10">
      {DOMAIN_ORDER.map((domain) => {
        const liveHere = live.filter((t) => t.domain === domain);
        const soon = showUpcoming ? UPCOMING.filter((u) => u.domain === domain) : [];
        if (liveHere.length + soon.length === 0) return null;
        return (
          <section key={domain} id={DOMAIN_ANCHORS[domain]} className="scroll-mt-24">
            <H className="t-h3 mb-3">{DOMAIN_LABELS[domain]}</H>
            <div className="overflow-x-auto rounded-xl border border-rule bg-surface">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule-strong text-[0.8125rem] text-ink-3">
                    <th scope="col" className="w-[26%] px-5 py-3 font-bold">Test</th>
                    <th scope="col" className="w-[30%] px-5 py-3 font-bold">Ne ölçer?</th>
                    <th scope="col" className="w-[26%] px-5 py-3 font-bold">Dayandığı kaynak</th>
                    <th scope="col" className="px-5 py-3 font-bold">Sınıf</th>
                    <th scope="col" className="px-5 py-3 font-bold">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {liveHere.map((t) => (
                    <tr key={t.slug} className="border-b border-rule align-top last:border-0">
                      <th scope="row" className="px-5 py-4 font-normal">
                        <Link href={`/testler/${t.slug}`} className="font-bold">
                          {t.name}
                        </Link>
                        <p className="t-meta mt-0.5">yaklaşık {t.estimatedMinutes} dakika</p>
                      </th>
                      <td className="t-small px-5 py-4 text-ink-2">{t.tagline}</td>
                      <td className="t-small px-5 py-4 text-ink-2">{t.science.basedOn}</td>
                      <td className="t-small whitespace-nowrap px-5 py-4">{gradeRangeLabel(t.minGrade, t.maxGrade)}</td>
                      <td className="px-5 py-4">
                        {t.status === 'pilot' ? (
                          <span className="chip chip-brass">Pilot, ücretsiz</span>
                        ) : (
                          <span className="chip chip-ok">{t.isFree ? 'Yayında, ücretsiz' : 'Yayında'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {soon.map((u) => (
                    <tr key={u.key} className="border-b border-rule align-top last:border-0">
                      <th scope="row" className="px-5 py-4 font-bold text-ink-2">
                        {u.name}
                      </th>
                      <td className="t-small px-5 py-4 text-ink-3">{u.measures}</td>
                      <td className="t-small px-5 py-4 text-ink-3">{u.basedOn}</td>
                      <td className="t-small whitespace-nowrap px-5 py-4 text-ink-3">{u.grades}</td>
                      <td className="px-5 py-4">
                        <span className="chip">Hazırlanıyor</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
