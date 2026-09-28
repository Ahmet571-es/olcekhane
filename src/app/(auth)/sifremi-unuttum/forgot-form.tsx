'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { forgotPasswordAction, type FormState } from '../actions';

export function ForgotForm() {
  const [state, action] = useActionState<FormState, FormData>(forgotPasswordAction, {});
  if (state.ok) {
    return (
      <div className="flex flex-col gap-5">
        <FormMessage ok message={state.message} />
        <Link href="/giris">Giriş sayfasına dön</Link>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage message={state.message} />
      <Field id="email" label="E-posta" error={state.errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className="input"
          defaultValue={state.values?.email}
          aria-invalid={!!state.errors?.email}
          aria-describedby={describedBy('email', state.errors?.email)}
        />
      </Field>
      <SubmitButton pendingText="Gönderiliyor…">Bağlantı gönder</SubmitButton>
      <Link href="/giris" className="text-[0.95rem]">Giriş sayfasına dön</Link>
    </form>
  );
}
