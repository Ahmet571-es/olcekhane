'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { importStudentsAction, type SchoolFormState } from '@/app/okul/actions';
import { FormMessage, SubmitButton } from '@/components/ui/form';

const EXAMPLE = `Ayşe Yılmaz\t1523\tayse.veli@ornek.com
Mehmet Can\tDemir\t1524\tdemir.aile@ornek.com
Zeynep\tKaya\t1525`;

export function ImportForm({ slug, classId }: { slug: string; classId: string }) {
  const [state, action] = useActionState<SchoolFormState, FormData>(importStudentsAction.bind(null, slug, classId), {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage ok={state.ok} message={state.message} />
      {state.lines && state.lines.length > 0 && (
        <div className="notice notice-warn">
          <p className="font-bold">Aktarılamayan satırlar</p>
          <ul className="mt-1 list-disc pl-5">
            {state.lines.slice(0, 20).map((l) => (
              <li key={`${l.line}-${l.message}`}>
                {l.line > 0 ? `${l.line}. satır: ` : ''}
                {l.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="field">
        <label htmlFor="list" className="field-label">
          Öğrenci listesi
        </label>
        <textarea
          id="list"
          name="list"
          rows={12}
          className="input font-mono text-[0.9rem]"
          placeholder={EXAMPLE}
          defaultValue={state.values?.list}
          key={state.ok ? `ok-${state.message}` : 'form'}
          spellCheck={false}
        />
        <p className="field-hint">Örnek biçim kutunun içinde gri olarak görünüyor. Başlık satırı varsa otomatik atlanır.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pendingText="Aktarılıyor…" className="btn btn-primary">
          Listeyi aktar
        </SubmitButton>
        {state.ok && (
          <Link href={`/okul/${slug}/sinif/${classId}`} className="btn btn-secondary">
            Sınıfa dön
          </Link>
        )}
      </div>
    </form>
  );
}
