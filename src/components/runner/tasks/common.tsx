'use client';

import { useEffect, useRef } from 'react';

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
