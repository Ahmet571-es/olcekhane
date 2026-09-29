'use client';

import { useActionState } from 'react';
import { createClassAction, type SchoolFormState } from '@/app/okul/actions';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';

export function NewClassForm({ slug, year }: { slug: string; year: string }) {
  const [state, action] = useActionState<SchoolFormState, FormData>(createClassAction.bind(null, slug), {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="panel flex flex-col gap-5 p-6" noValidate>
      <FormMessage message={state.message} />
      <Field id="name" label="Sınıfın adı" error={e.name} hint="Okulunuzda kullanılan ad: 7-A, 9/C gibi.">
        <input
          id="name"
          name="name"
          required
          maxLength={40}
          className="input"
          defaultValue={state.values?.name}
          aria-invalid={!!e.name}
          aria-describedby={describedBy('name', e.name, true)}
        />
      </Field>
      <Field id="grade" label="Sınıf düzeyi" error={e.grade}>
        <select id="grade" name="grade" required className="input" defaultValue={state.values?.grade ?? ''} aria-invalid={!!e.grade}>
          <option value="" disabled>
            Seçin
          </option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>
              {g}. sınıf
            </option>
          ))}
        </select>
      </Field>
      <Field id="academicYear" label="Öğretim yılı" error={e.academicYear}>
        <input
          id="academicYear"
          name="academicYear"
          required
          className="input"
          defaultValue={state.values?.academicYear ?? year}
          aria-invalid={!!e.academicYear}
          aria-describedby={describedBy('academicYear', e.academicYear)}
        />
      </Field>
      <SubmitButton pendingText="Oluşturuluyor…" className="btn btn-primary self-start">
        Sınıfı oluştur
      </SubmitButton>
    </form>
  );
}
