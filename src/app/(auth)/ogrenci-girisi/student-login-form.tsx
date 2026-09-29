'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton } from '@/components/ui/form';
import { studentLoginAction, type StudentLoginState } from './actions';

export function StudentLoginForm() {
  const [state, action] = useActionState<StudentLoginState, FormData>(studentLoginAction, {});
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage message={state.message} />
      <Field id="code" label="Giriş kodun">
        <input
          id="code"
          name="code"
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          inputMode="text"
          maxLength={14}
          placeholder="K7PXM-3QD2A"
          defaultValue={state.value}
          className="input text-center font-display text-2xl font-bold tracking-[0.2em] uppercase"
        />
      </Field>
      <SubmitButton pendingText="Giriş yapılıyor…">Giriş yap</SubmitButton>
    </form>
  );
}
