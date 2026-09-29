'use client';

import { useActionState } from 'react';
import { issueCodesAction, type CodesState } from '@/app/okul/actions';
import { FormMessage, SubmitButton } from '@/components/ui/form';

export function CodesIssuer({ slug, classId, loginUrl }: { slug: string; classId: string; loginUrl: string }) {
  const [state, action] = useActionState<CodesState, FormData>(issueCodesAction.bind(null, slug, classId), {});

  if (state.codes && state.codes.length > 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="notice notice-warn flex flex-col gap-3 print:hidden">
          <p>
            <strong>{state.codes.length} öğrenci için kod oluşturuldu.</strong> Bu sayfadan ayrıldığınızda kodlar bir daha gösterilemez. Kartları
            şimdi yazdırın ya da “PDF olarak kaydet” seçeneğiyle saklayın.
          </p>
          <div>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Kartları yazdır
            </button>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-3">
          {state.codes.map((c) => (
            <li key={c.studentId} className="flex break-inside-avoid flex-col gap-2 rounded-xl border-[1.5px] border-dashed border-rule-strong bg-surface p-5">
              <p className="t-meta">
                Ölçekhane · {state.className}
              </p>
              <p className="font-display text-xl font-bold">{c.name}</p>
              <p className="font-mono text-2xl font-bold tracking-[0.12em] sm:text-3xl">{c.code}</p>
              <p className="t-small text-ink-2">
                <strong>{loginUrl}</strong> adresini aç ve bu kodu yaz. Kodunu kimseyle paylaşma.
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form action={action} className="panel flex flex-col gap-5 p-6 print:hidden">
      <FormMessage message={state.message} />
      <fieldset className="flex flex-col gap-3">
        <legend className="field-label mb-2">Hangi öğrenciler için?</legend>
        <label className="check">
          <input type="radio" name="mode" value="missing" defaultChecked />
          <span>Yalnızca kodu olmayan öğrenciler</span>
        </label>
        <label className="check">
          <input type="radio" name="mode" value="all" />
          <span>Bütün öğrenciler (eski kodlar geçersiz olur)</span>
        </label>
      </fieldset>
      <div>
        <SubmitButton pendingText="Oluşturuluyor…" className="btn btn-primary">
          Kodları oluştur
        </SubmitButton>
      </div>
    </form>
  );
}
