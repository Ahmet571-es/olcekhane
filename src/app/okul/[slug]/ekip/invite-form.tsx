'use client';

import { useActionState } from 'react';
import { inviteMemberAction, type SchoolFormState } from '@/app/okul/actions';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';

const ROLES = [
  { value: 'counselor', label: 'Rehber öğretmen', hint: 'Bireysel raporları görür, test atar, velilerden onay ister.' },
  { value: 'teacher', label: 'Öğretmen', hint: 'Yalnızca bağlı olduğu sınıfların grup özetlerini görür.' },
  { value: 'org_admin', label: 'Okul yöneticisi', hint: 'Ekibi ve sınıfları yönetir; bireysel sonuç görmez.' },
] as const;

export function InviteForm({ slug }: { slug: string }) {
  const [state, action] = useActionState<SchoolFormState, FormData>(inviteMemberAction.bind(null, slug), {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="email" label="E-posta adresi" error={e.email} hint="Davet bağlantısı bu adrese gönderilir ve 14 gün geçerlidir.">
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          required
          className="input"
          defaultValue={state.values?.email}
          aria-invalid={!!e.email}
          aria-describedby={describedBy('email', e.email, true)}
        />
      </Field>
      <fieldset className="flex flex-col gap-3">
        <legend className="field-label mb-1">Görevi</legend>
        {ROLES.map((r) => (
          <label key={r.value} className="check items-start">
            <input type="radio" name="role" value={r.value} defaultChecked={state.values?.role === r.value} />
            <span>
              <span className="font-bold">{r.label}</span>
              <span className="t-small block text-ink-2">{r.hint}</span>
            </span>
          </label>
        ))}
        {e.role && (
          <p className="field-error" role="alert">
            {e.role}
          </p>
        )}
      </fieldset>
      <div>
        <SubmitButton pendingText="Gönderiliyor…" className="btn btn-primary">
          Davet gönder
        </SubmitButton>
      </div>
    </form>
  );
}
