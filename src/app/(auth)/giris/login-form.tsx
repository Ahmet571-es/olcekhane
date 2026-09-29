'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { loginAction, type FormState } from '../actions';

export function LoginForm({ next, accounts }: { next: string; accounts: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="sonra" value={next} />
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="email" label="E-posta" error={state.errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          className="input"
          defaultValue={state.values?.email}
          aria-invalid={!!state.errors?.email}
          aria-describedby={describedBy('email', state.errors?.email)}
        />
      </Field>
      <Field id="password" label="Şifre" error={state.errors?.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          aria-invalid={!!state.errors?.password}
          aria-describedby={describedBy('password', state.errors?.password)}
        />
      </Field>
      <SubmitButton pendingText="Giriş yapılıyor…">Giriş yap</SubmitButton>
      <div className="flex flex-wrap justify-between gap-3 text-[0.95rem]">
        <Link href="/sifremi-unuttum">Şifremi unuttum</Link>
        {accounts && <Link href={next ? `/kayit?sonra=${encodeURIComponent(next)}` : '/kayit'}>Hesabınız yok mu? Ücretsiz kaydolun</Link>}
      </div>
      {accounts && (
        <p className="t-meta">
          Okulunuzun verdiği öğrenci koduyla giriş için <Link href="/ogrenci-girisi">öğrenci girişi</Link> sayfasını kullanın.
        </p>
      )}
    </form>
  );
}
