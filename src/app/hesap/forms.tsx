'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { changePasswordAction, closeAccountAction, updateNameAction, type AccountFormState } from './actions';

export function NameForm({ fullName }: { fullName: string }) {
  const [state, action] = useActionState<AccountFormState, FormData>(updateNameAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="fullName" label="Adınız soyadınız" error={e.fullName}>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          maxLength={120}
          className="input"
          defaultValue={state.values?.fullName ?? fullName}
          aria-invalid={!!e.fullName}
          aria-describedby={describedBy('fullName', e.fullName)}
        />
      </Field>
      <div>
        <SubmitButton pendingText="Kaydediliyor…" className="btn btn-secondary">
          Kaydet
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<AccountFormState, FormData>(changePasswordAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="current" label="Şu anki şifreniz" error={e.current}>
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          aria-invalid={!!e.current}
          aria-describedby={describedBy('current', e.current)}
        />
      </Field>
      <Field id="next" label="Yeni şifre" error={e.next} hint="En az 10 karakter. Birkaç kelimeden oluşan bir cümle hem güçlü hem akılda kalıcıdır.">
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          className="input"
          aria-invalid={!!e.next}
          aria-describedby={describedBy('next', e.next, true)}
        />
      </Field>
      <Field id="again" label="Yeni şifre (tekrar)" error={e.again}>
        <input
          id="again"
          name="again"
          type="password"
          autoComplete="new-password"
          required
          className="input"
          aria-invalid={!!e.again}
          aria-describedby={describedBy('again', e.again)}
        />
      </Field>
      <div>
        <SubmitButton pendingText="Değiştiriliyor…" className="btn btn-secondary">
          Şifreyi değiştir
        </SubmitButton>
      </div>
    </form>
  );
}

export function CloseAccountForm() {
  const [state, action] = useActionState<AccountFormState, FormData>(closeAccountAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage message={state.message} />
      <Field id="close-password" label="Onaylamak için şifreniz" error={e.password}>
        <input
          id="close-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          aria-invalid={!!e.password}
          aria-describedby={describedBy('close-password', e.password)}
        />
      </Field>
      <div className="flex flex-col gap-1">
        <label className="check">
          <input type="checkbox" name="confirm" aria-invalid={!!e.confirm} />
          <span>Hesabımın kapatılacağını ve bu işlemin geri alınamayacağını anladım.</span>
        </label>
        {e.confirm && (
          <p className="field-error" role="alert">
            {e.confirm}
          </p>
        )}
      </div>
      <div>
        <SubmitButton pendingText="Kapatılıyor…" className="btn btn-danger">
          Hesabımı kapat
        </SubmitButton>
      </div>
    </form>
  );
}
