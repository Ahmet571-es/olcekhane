'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton } from '@/components/ui/form';
import { GRADE_LABELS } from '@/lib/config';
import { updateChildAction, type ActionState } from '../../actions';

export function EditChildForm(props: { studentId: string; firstName: string; lastName: string; grade: number }) {
  const [state, action] = useActionState<ActionState, FormData>(updateChildAction, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="studentId" value={props.studentId} />
      <FormMessage ok={state.ok} message={state.message} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="e-firstName" label="Adı">
          <input id="e-firstName" name="firstName" className="input" defaultValue={props.firstName} required />
        </Field>
        <Field id="e-lastName" label="Soyadı">
          <input id="e-lastName" name="lastName" className="input" defaultValue={props.lastName} />
        </Field>
      </div>
      <Field id="e-grade" label="Sınıfı" hint="Yeni öğretim yılında sınıfını güncellemeyi unutmayın.">
        <select id="e-grade" name="grade" className="input" defaultValue={props.grade} aria-describedby="e-grade-ipucu">
          {Object.entries(GRADE_LABELS).map(([g, label]) => (
            <option key={g} value={g}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <div>
        <SubmitButton className="btn btn-secondary" pendingText="Kaydediliyor…">
          Kaydet
        </SubmitButton>
      </div>
    </form>
  );
}
