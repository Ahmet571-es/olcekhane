'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { registerFromInviteAction, type InviteFormState } from '../actions';

export function InviteRegisterForm({ token, email }: { token: string; email: string }) {
  const [state, action] = useActionState<InviteFormState, FormData>(registerFromInviteAction.bind(null, token), {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage message={state.message} />
      <Field id="email" label="E-posta">
        <input id="email" className="input" value={email} readOnly aria-readonly="true" />
      </Field>
      <Field id="fullName" label="Adınız soyadınız" error={e.fullName}>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          className="input"
          defaultValue={state.values?.fullName}
          aria-invalid={!!e.fullName}
          aria-describedby={describedBy('fullName', e.fullName)}
        />
      </Field>
      <Field id="password" label="Şifre" error={e.password} hint="En az 10 karakter. Kolay hatırlanan ama tahmin edilmesi zor bir cümle iyi bir seçimdir.">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className="input"
          aria-invalid={!!e.password}
          aria-describedby={describedBy('password', e.password, true)}
        />
      </Field>
      <label className="check">
        <input type="checkbox" name="notice" required aria-invalid={!!e.notice} />
        <span>
          <Link href="/yasal/kullanim-kosullari" target="_blank">
            Kullanım koşullarını
          </Link>{' '}
          ve{' '}
          <Link href="/yasal/aydinlatma-metni" target="_blank">
            KVKK aydınlatma metnini
          </Link>{' '}
          okudum, anladım.
        </span>
      </label>
      {e.notice && <p className="field-error">{e.notice}</p>}
      <SubmitButton pendingText="Hesap açılıyor…">Hesabımı aç ve daveti kabul et</SubmitButton>
    </form>
  );
}
