import Link from 'next/link';
import type { Roadmap } from '@/lib/reports/roadmap';
import { Profile3D } from './profile-3d';

/**
 * Gelişim yol haritası: raporun sonundaki öneri bölümleri. PDF'teki yol haritasıyla aynı içeriği gösterir.
 * Bağlantılar yeni sekmede açılır: rapor saklanmadığı için sayfadan ayrılmak raporu kaybettirir.
 */
export function RoadmapView({ roadmap: rm, you }: { roadmap: Roadmap; you: boolean }) {
  return (
    <article className="flex flex-col gap-10 border-t-2 border-ink pt-8" aria-labelledby="yol-haritasi">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-brass">Gelişim yol haritası</span>
          {rm.preview && <span className="chip">Önizleme · uzman incelemesinde</span>}
        </div>
        <h2 id="yol-haritasi" className="t-h1">
          {you ? 'Senin yol haritan' : 'Çocuğunuz için yol haritası'}
        </h2>
        <p className="measure text-ink-2">{rm.intro}</p>
        {rm.preview && (
          <p className="notice notice-info measure t-small">
            Bu bölüm uzman incelemesinde. Önizleme bağlantısıyla gösteriliyor; metinler incelemeden sonra değişebilir.
          </p>
        )}
      </header>

      {/* Tek boyutlu testte (ör. öz-saygı) üç boyutlu profil bir şey anlatmaz; puan raporun başında yazılıdır. */}
      {rm.bars.length >= 3 && (
        <section aria-labelledby="profil-3b" className="flex flex-col gap-4">
          <h3 id="profil-3b" className="t-h2">
            {you ? 'Profilin üç boyutlu' : 'Profil üç boyutlu'}
          </h3>
          <Profile3D bars={rm.bars} you={you} />
        </section>
      )}

      <section aria-labelledby="kisaca" className="flex flex-col gap-3">
        <h3 id="kisaca" className="t-h2">
          Kısaca
        </h3>
        {rm.standout.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {rm.standout.map((s) => (
              <li key={s.title} className="rounded-xl border border-rule bg-surface px-4 py-3">
                <p className="t-meta">{s.title}</p>
                <p className="font-display text-lg font-bold">{s.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="measure text-ink-2">{rm.standoutNote}</p>
        )}
      </section>

      {/* İlgi testinde öne çıkan alan yoksa keşif önerisi de yoktur; haftalık denemeler kalır. */}
      {rm.study.items.length > 0 && (
        <section aria-labelledby="calisma" className="flex flex-col gap-4">
          <h3 id="calisma" className="t-h2">
            {rm.study.title}
          </h3>
          <p className="measure text-ink-2">{rm.study.intro}</p>
          <ul className="grid gap-4 md:grid-cols-2">
            {rm.study.items.map((it) => (
              <li key={it.key} className="panel flex flex-col gap-2 border-t-4 p-5" style={{ borderTopColor: it.color }}>
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="font-display text-lg font-bold">{it.title}</span>
                  <span className="t-small font-bold text-brass-ink">{it.badge}</span>
                </p>
                <p className="text-ink-2">{it.text}</p>
              </li>
            ))}
          </ul>
          {rm.study.links.length > 0 && (
            <p className="t-small text-ink-2">
              Ayrıntılı bilgi:{' '}
              {rm.study.links.map((l, i) => (
                <span key={l.href}>
                  {i > 0 && ' · '}
                  <Link href={l.href} target="_blank" rel="noopener">
                    {l.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      {rm.settings && (
        <section aria-labelledby="ortamlar" className="flex flex-col gap-3">
          <h3 id="ortamlar" className="t-h2">
            {rm.settings.title}
          </h3>
          <p className="measure text-ink-2">{rm.settings.intro}</p>
          {rm.settings.items.length > 0 && (
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              {rm.settings.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <p className="notice notice-info measure t-small">{rm.settings.note}</p>
        </section>
      )}

      {rm.approach && rm.approach.items.length > 0 && (
        <section aria-labelledby="yaklasim" className="flex flex-col gap-3">
          <h3 id="yaklasim" className="t-h2">
            {rm.approach.title}
          </h3>
          <ul className="flex flex-col divide-y divide-rule border-y border-rule">
            {rm.approach.items.map((it) => (
              <li key={it.title} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <p className="font-bold">{it.title}</p>
                <p className="text-ink-2">{it.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="haftalar" className="flex flex-col gap-4">
        <h3 id="haftalar" className="t-h2">
          Dört haftalık küçük adımlar
        </h3>
        <ol className="relative flex flex-col gap-5 border-l-2 border-rule pl-6">
          {rm.weeks.map((w) => (
            <li key={w.label} className="relative flex flex-col gap-1">
              <span className="absolute -left-[2.05rem] top-1 size-4 rounded-full border-[3px] border-paper bg-ink" aria-hidden="true" />
              <p className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="t-meta font-bold uppercase tracking-[0.06em]">{w.label}</span>
                <span className="font-display text-lg font-bold">{w.title}</span>
              </p>
              <p className="measure text-ink-2">{w.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="yh-kaynaklar" className="flex flex-col gap-2">
        <h3 id="yh-kaynaklar" className="t-h3">
          Dayandığı araştırmalar
        </h3>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[0.9rem] text-ink-2">
          {rm.sources.map((s) => (
            <li key={s.text}>
              {s.text}{' '}
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all">
                  {s.url.replace(/^https:\/\//, '')}
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
