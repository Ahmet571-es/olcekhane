'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { resetPasswordAction, type FormState } from '../actions';

export function ResetForm({ token }: { token: string }) {
  const [state, action] = useActionState<FormState, FormData>(resetPasswordAction, {});
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage message={state.message} />
      {state.message && <Link href="/sifremi-unuttum">Yeni bağlantı iste</Link>}
      <Field id="password" label="Yeni şifre" error={state.errors?.password} hint="En az 10 karakter.">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className="input"
          aria-invalid={!!state.errors?.password}
          aria-describedby={describedBy('password', state.errors?.password, true)}
        />
      </Field>
      <SubmitButton pendingText="Kaydediliyor…">Şifremi kaydet</SubmitButton>
    </form>
  );
}
