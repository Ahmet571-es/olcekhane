'use client';

import { useActionState } from 'react';
import { assignTestAction, sendConsentRequestsAction, type SchoolFormState } from '@/app/okul/actions';
import { FormMessage, SubmitButton } from '@/components/ui/form';

export function ConsentRequestForm({
  slug,
  classId,
  studentId,
  label = 'Onay bekleyen velilere istek gönder',
}: {
  slug: string;
  classId: string;
  studentId?: string;
  label?: string;
}) {
  const [state, action] = useActionState<SchoolFormState, FormData>(sendConsentRequestsAction.bind(null, slug, classId), {});
  return (
    <form action={action} className="flex flex-col gap-3">
      {studentId && <input type="hidden" name="studentId" value={studentId} />}
      <FormMessage ok={state.ok} message={state.message} />
      <div>
        <SubmitButton pendingText="Gönderiliyor…" className="btn btn-secondary">
          {label}
        </SubmitButton>
      </div>
    </form>
  );
}

export function AssignForm({ slug, classId, tests }: { slug: string; classId: string; tests: { slug: string; name: string; minutes: number }[] }) {
  const [state, action] = useActionState<SchoolFormState, FormData>(assignTestAction.bind(null, slug, classId), {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage ok={state.ok} message={state.message} />
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <div className="field">
          <label htmlFor="slug" className="field-label">
            Test
          </label>
          <select id="slug" name="slug" required className="input" defaultValue="">
            <option value="" disabled>
              Seçin
            </option>
            {tests.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name} (yaklaşık {t.minutes} dk)
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="dueAt" className="field-label">
            Son gün (isteğe bağlı)
          </label>
          <input id="dueAt" name="dueAt" type="date" className="input" />
        </div>
      </div>
      <div>
        <SubmitButton pendingText="Atanıyor…" className="btn btn-primary">
          Testi ata
        </SubmitButton>
      </div>
    </form>
  );
}
