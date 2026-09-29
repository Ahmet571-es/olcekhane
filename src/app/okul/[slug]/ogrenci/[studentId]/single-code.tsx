'use client';

import { useActionState } from 'react';
import { issueCodesAction, type CodesState } from '@/app/okul/actions';
import { FormMessage, SubmitButton } from '@/components/ui/form';

export function SingleCodeIssuer({ slug, classId, studentId }: { slug: string; classId: string; studentId: string }) {
  const [state, action] = useActionState<CodesState, FormData>(issueCodesAction.bind(null, slug, classId), {});
  const code = state.codes?.[0];
  if (code) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border-[1.5px] border-dashed border-rule-strong p-4">
        <p className="t-meta">{code.name} için yeni kod</p>
        <p className="font-mono text-2xl font-bold tracking-[0.12em] sm:text-3xl">{code.code}</p>
        <p className="t-small text-ink-2">Bu kodu şimdi öğrenciye iletin; sayfadan ayrılınca bir daha gösterilemez.</p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="mode" value="all" />
      <FormMessage message={state.message} />
      <div>
        <SubmitButton pendingText="Oluşturuluyor…" className="btn btn-secondary">
          Yeni kod üret
        </SubmitButton>
      </div>
    </form>
  );
}
