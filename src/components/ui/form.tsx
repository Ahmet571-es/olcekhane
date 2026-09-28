'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  pendingText,
  className = 'btn btn-primary btn-lg w-full',
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {pending ? (pendingText ?? 'Gönderiliyor…') : children}
    </button>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-ipucu`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-hata`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p className={`notice ${ok ? 'notice-ok' : 'notice-danger'}`} role={ok ? 'status' : 'alert'}>
      {message}
    </p>
  );
}

export function describedBy(id: string, error?: string, hint?: boolean): string | undefined {
  if (error) return `${id}-hata`;
  return hint ? `${id}-ipucu` : undefined;
}
