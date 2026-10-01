'use client';

import { useEffect, useRef, useState } from 'react';

/** İptal edilebilir bekleme: bileşen kaldırıldığında ya da görev değiştiğinde zamanlayıcılar durur. */
export function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('aborted', 'AbortError'));
    const t = window.setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(t);
        reject(new DOMException('aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

/** Uyaranın ekrana gerçekten çizildiği anın zaman damgası (iki animasyon karesi sonrası). */
export function afterPaint(): Promise<number> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame((t) => resolve(t))));
}

export const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

/** Görev sürerken sayfadan ayrılmaya çalışıldığında uyarı. */
export function useLeaveWarning(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [active]);
}

/**
 * Sayfa gizlenince (başka bir sekmeye ya da uygulamaya geçilince, ekran kilitlenince) çağrılır. Süreli görevler
 * bunu duraklamak için kullanır: gizli sayfada geçen denemeler ve süre ölçüme karışmasın.
 */
export function usePageHidden(active: boolean, onHidden: () => void) {
  const ref = useRef(onHidden);
  useEffect(() => {
    ref.current = onHidden;
  });
  useEffect(() => {
    if (!active) return;
    const on = () => {
      if (document.visibilityState === 'hidden') ref.current();
    };
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [active]);
}

/**
 * Ekrana geldikten kısa bir süre sonra çalışmaya başlayan düğme: görevdeki son basış ya da dokunuş, yanlışlıkla
 * bir sonraki adımı (asıl görevi, sonraki bölümü) başlatmasın.
 */
export function ArmedButton({ delayMs = 900, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { delayMs?: number }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        if (armed) onClick?.(e);
      }}
    />
  );
}

/** Görev duraklatıldığında gösterilen ekran. `cta`: düğmenin yazısı (görev baştan başlayacaksa ona göre). */
export function PausedScreen({
  note,
  onResume,
  autoFocus = true,
  cta = 'Kaldığın yerden devam et',
}: {
  note: string;
  onResume: () => void;
  autoFocus?: boolean;
  cta?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="t-h2">Görev duraklatıldı</h2>
      <p className="measure text-lg">Başka bir sekmeye ya da uygulamaya geçtiğin için görev durdu. {note}</p>
      <ArmedButton className="btn btn-primary btn-lg" autoFocus={autoFocus} onClick={onResume}>
        {cta}
      </ArmedButton>
    </div>
  );
}

/** Bölüm sıra adları: "Birinci bölüm bitti". */
export const ORDINALS = ['Birinci', 'İkinci', 'Üçüncü', 'Dördüncü', 'Beşinci', 'Altıncı'];
export const ordinal = (i: number) => ORDINALS[i] ?? `${i + 1}.`;

/** Fareyle yapılan basışlarda yalnızca sol tuş sayılır (sağ tık cevap sayılmaz). */
export const primaryPointer = (e: React.PointerEvent) => e.pointerType !== 'mouse' || e.button === 0;

/** Görev düğmeleri: dokunmatik ekranda çift dokunmayla yakınlaştırma ve gri dokunma parlaması olmasın. */
export const TOUCH_CLASSES = 'touch-manipulation select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]';

/** Klavye kısayolu dinleyicisi; en güncel işleyiciyi ref ile tutar. */
export function useKeys(active: boolean, handler: (e: KeyboardEvent) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      ref.current(e);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [active]);
}

/** 1–9 rakam tuş takımı; Sil ve Tamam düğmeleriyle. */
export function Keypad({
  onDigit,
  onDelete,
  onSubmit,
  canSubmit,
  disabled,
}: {
  onDigit: (d: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[20rem] grid-cols-3 gap-2.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(d)}
          className="tabular h-16 rounded-xl border-[1.5px] border-rule-strong bg-surface font-display text-2xl font-bold hover:border-ink active:translate-y-px disabled:opacity-40"
        >
          {d}
        </button>
      ))}
      <button type="button" disabled={disabled} onClick={onDelete} className="btn btn-secondary h-14">
        Sil
      </button>
      <button type="button" disabled={disabled || !canSubmit} onClick={onSubmit} className="btn btn-primary col-span-2 h-14">
        Tamam
      </button>
    </div>
  );
}

/** Görevin ekrandaki alanı: sabit yükseklikte, ortalanmış bir sahne. */
export function Stage({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative flex min-h-[15rem] items-center justify-center rounded-2xl border border-rule bg-surface p-6" aria-label={label}>
      {children}
    </div>
  );
}

export function SymbolGlyph({ d, size = 48, title }: { d: string; size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Ok görevindeki ok. */
export function Arrow({ dir, size = 56 }: { dir: 'L' | 'R'; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ transform: dir === 'L' ? 'scaleX(-1)' : undefined }}>
      <path d="M3 12h15M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Görev içi durum satırı: ekran okuyuculara da okunur. */
export function StatusLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="min-h-[1.75rem] text-center text-lg font-bold text-ink-2" aria-live="polite">
      {children}
    </p>
  );
}
