'use client';

import { useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { NO_FILTER, gradeOptions, isFiltered, matchesFilter, minuteOptions, type CatalogEntry, type CatalogFilter } from '@/lib/catalog';
import { DOMAIN_LABELS, GRADE_LABELS } from '@/lib/config';
import { DOMAIN_ORDER, domainColor } from '@/lib/domain-style';

/**
 * Seçenek sırası: telefonda tek satırda yana kaydırılır (süzgeçler kartları aşağı itmesin), geniş ekranda alt satıra
 * geçer. Dikey boşluk, klavye odağının çerçevesi kesilmesin diye.
 */
const ROW = '-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0';

/** Tek seçimli yuvarlak düğme (radyo düğmesi: klavyede Sekme ile gruba girilir, oklarla seçilir). */
function Choice({
  name,
  checked,
  onSelect,
  dot,
  inputRef,
  children,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  dot?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  children: ReactNode;
}) {
  return (
    <label className="relative shrink-0 cursor-pointer">
      <input ref={inputRef} type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span className="inline-flex min-h-10 items-center gap-2 rounded-full border-[1.5px] border-rule-strong bg-surface px-4 text-[0.9375rem] font-bold text-ink-2 transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
        {/* Yüksek karşıtlık modunda renkler kaybolur; seçili düğme orada bir işaretle ayrılır. */}
        {checked && (
          <span className="hidden forced-colors:inline" aria-hidden="true">
            ✓
          </span>
        )}
        {dot && <span className="size-2.5 shrink-0 rounded-full" style={{ background: dot }} aria-hidden="true" />}
        {children}
      </span>
    </label>
  );
}

/**
 * Test listesi ve süzgeçleri (alan, kimler için, süre). Kartlar sunucuda hazırlanır; süzgeç yalnızca uymayan
 * kartları gizler. Seçimler yalnızca bu sayfada durur: kaydedilmez, adrese yazılmaz, sunucuya gönderilmez.
 */
export function TestFinder({ items }: { items: { entry: CatalogEntry; card: ReactNode }[] }) {
  const [filter, setFilter] = useState<CatalogFilter>(NO_FILTER);
  const id = useId();
  const firstChoice = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<CatalogFilter>) => setFilter((f) => ({ ...f, ...patch }));
  // "Süzgeçleri temizle" düğmesi temizleyince kaybolur; klavye odağı süzgeçlerin başına taşınır.
  const clear = () => {
    setFilter(NO_FILTER);
    requestAnimationFrame(() => firstChoice.current?.focus());
  };

  const entries = items.map((i) => i.entry);
  const domains = DOMAIN_ORDER.filter((d) => entries.some((e) => e.domain === d));
  const grades = gradeOptions(entries);
  const minutes = minuteOptions(entries);
  const shown = entries.map((e) => matchesFilter(e, filter));
  const count = shown.filter(Boolean).length;
  const filtered = isFiltered(filter);

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Testleri süz" className="glass flex flex-col gap-4 rounded-[1.75rem] p-5 sm:gap-5 sm:p-6">
        {domains.length > 1 && (
          <fieldset className="flex min-w-0 flex-col gap-1">
            <legend className="mb-1.5 text-[0.875rem] font-bold text-ink-2">Alan</legend>
            <div className={ROW}>
              <Choice name={`${id}-alan`} checked={filter.domain === null} onSelect={() => set({ domain: null })} inputRef={firstChoice}>
                Hepsi
              </Choice>
              {domains.map((d) => (
                <Choice key={d} name={`${id}-alan`} checked={filter.domain === d} onSelect={() => set({ domain: d })} dot={domainColor(d)}>
                  {DOMAIN_LABELS[d] ?? d}
                </Choice>
              ))}
            </div>
          </fieldset>
        )}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,17rem)_1fr]">
          <div className="flex flex-col gap-2.5">
            <label htmlFor={`${id}-sinif`} className="text-[0.875rem] font-bold text-ink-2">
              Kimler için
            </label>
            <select
              id={`${id}-sinif`}
              className="input rounded-full"
              value={filter.grade ?? ''}
              onChange={(e) => set({ grade: e.target.value === '' ? null : Number(e.target.value) })}
            >
              <option value="">Hepsi</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {GRADE_LABELS[g] ?? `${g}. sınıf`}
                </option>
              ))}
            </select>
          </div>
          {minutes.length > 0 && (
            <fieldset className="flex min-w-0 flex-col gap-1">
              <legend className="mb-1.5 text-[0.875rem] font-bold text-ink-2">Süre</legend>
              <div className={ROW}>
                <Choice name={`${id}-sure`} checked={filter.maxMinutes === null} onSelect={() => set({ maxMinutes: null })}>
                  Hepsi
                </Choice>
                {minutes.map((m) => (
                  <Choice key={m} name={`${id}-sure`} checked={filter.maxMinutes === m} onSelect={() => set({ maxMinutes: m })}>
                    {m} dakikaya kadar
                  </Choice>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="t-small text-ink-2">
          {filtered ? `${count} test gösteriliyor (toplam ${entries.length})` : `${entries.length} test`}
        </p>
        {filtered && count > 0 && (
          <button type="button" className="btn btn-quiet min-h-10" onClick={clear}>
            Süzgeçleri temizle
          </button>
        )}
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ entry, card }, i) => (
          <li key={entry.slug} hidden={!shown[i]} data-reveal style={{ '--reveal-gecikme': `${(i % 4) * 70}ms` } as CSSProperties}>
            {card}
          </li>
        ))}
      </ul>

      {filtered && count === 0 && (
        <div className="notice notice-info flex flex-col items-start gap-3">
          <p>Bu seçimlere uyan bir test henüz yok. Süzgeçlerden birini değiştirebilir ya da hepsini temizleyebilirsiniz.</p>
          <button type="button" className="btn btn-secondary min-h-10" onClick={clear}>
            Süzgeçleri temizle
          </button>
        </div>
      )}
    </div>
  );
}
