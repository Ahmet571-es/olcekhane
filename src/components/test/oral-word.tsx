import type { ReactNode } from 'react';
import type { OralMarkedToken } from '@/lib/scoring/oral';

/**
 * Sesli okuma metninde bir kelime ve üzerindeki işaretler. İşaretleme ekranında düğme olarak, raporda düz metin olarak
 * kullanılır. Hata sayılan işaretler kırmızı, hata sayılmayan gözlemler sarı gösterilir; otomatik analizde net
 * anlaşılamayan kelimeler gri, noktalı alt çizgiyle gösterilir (hata sayılmaz). Renk görmeyenler için her işaretin adı
 * kelimenin üstünde yazılıdır.
 */

export const MARK_TAGS = {
  sub: 'yanlış',
  omit: 'atladı',
  help: 'yardım',
  self: 'düzeltti',
  unclear: 'net değil',
  rep: 'tekrar',
  syl: 'hece',
  hes: 'durak',
} as const;

export function markTags(t: Omit<OralMarkedToken, 'text'>): string[] {
  const tags: string[] = [];
  if (t.s) tags.push(MARK_TAGS[t.s]);
  if (t.hes) tags.push(MARK_TAGS.hes);
  if (t.syl) tags.push(MARK_TAGS.syl);
  if (t.rep) tags.push(MARK_TAGS.rep);
  return tags;
}

export function isError(t: Omit<OralMarkedToken, 'text'>): boolean {
  return t.s === 'sub' || t.s === 'omit' || t.s === 'help';
}

export function WordBody({ t }: { t: OralMarkedToken }) {
  const tags = markTags(t);
  const error = isError(t);
  const marked = tags.length > 0;
  // Net anlaşılamayan kelime: gri, noktalı alt çizgi; üstünde ayrıca bir gözlem (ör. duraksama) varsa sarı zemin.
  const unclear = t.s === 'unclear';
  const observed = tags.length > (unclear ? 1 : 0);
  return (
    <>
      {marked && (
        <span
          className={`pointer-events-none absolute -top-[0.95em] left-0 whitespace-nowrap text-[0.6rem] font-bold leading-none tracking-wide ${
            error ? 'text-danger' : observed ? 'text-warn' : 'text-ink-3'
          }`}
          aria-hidden="true"
        >
          {tags.join(' · ')}
        </span>
      )}
      <span
        className={`rounded-[0.3em] px-[0.12em] ${
          error
            ? `bg-danger-bg text-danger decoration-2 ${t.s === 'omit' ? 'line-through' : 'underline underline-offset-4'}`
            : unclear
              ? `text-ink-2 underline decoration-ink-3 decoration-dotted decoration-2 underline-offset-4 ${observed ? 'bg-warn-bg' : ''}`
              : marked
                ? 'bg-warn-bg'
                : ''
        }`}
      >
        {t.text}
      </span>
      {t.ins ? (
        <span className="ml-0.5 rounded bg-danger-bg px-1 text-[0.7em] font-bold text-danger" aria-hidden="true">
          +{t.ins}
        </span>
      ) : null}
      {marked || t.ins ? <span className="sr-only">{` (${[...tags, ...(t.ins ? [`${t.ins} ekleme`] : [])].join(', ')})`}</span> : null}
    </>
  );
}

/** Otomatik analizde net anlaşılamayan kelimelerin gösterge örneği (raporda işaretli metnin altında). */
export function UnclearSample({ children }: { children: ReactNode }) {
  return <span className="rounded-[0.3em] px-[0.12em] text-ink-2 underline decoration-ink-3 decoration-dotted decoration-2 underline-offset-4">{children}</span>;
}

/** Raporda işaretli metin (etkileşimsiz). */
export function MarkedText({ paragraphs, className = '' }: { paragraphs: OralMarkedToken[][]; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className="leading-[2.4]">
          {p.map((t, j) => (
            <span key={j}>
              <span className="relative inline-block">
                <WordBody t={t} />
              </span>{' '}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
