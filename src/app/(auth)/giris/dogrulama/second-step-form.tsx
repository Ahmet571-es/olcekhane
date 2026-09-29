'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { cancelSecondStepAction, secondStepAction, type FormState } from '../../actions';

export function SecondStepForm() {
  const [state, action] = useActionState<FormState, FormData>(secondStepAction, {});
  return (
    <div className="flex flex-col gap-5">
      <form action={action} className="flex flex-col gap-5" noValidate>
        <FormMessage ok={state.ok} message={state.message} />
        <Field id="code" label="Doğrulama kodu" error={state.errors?.code} hint="6 haneli kod ya da XXXXX-XXXXX biçiminde kurtarma kodu">
          <input
            id="code"
            name="code"
            type="text"
            autoComplete="one-time-code"
            autoCapitalize="characters"
            spellCheck={false}
            required
            maxLength={16}
            className="input font-mono tracking-widest"
            aria-invalid={!!state.errors?.code}
            aria-describedby={describedBy('code', state.errors?.code, true)}
          />
        </Field>
        <SubmitButton pendingText="Doğrulanıyor…">Doğrula ve giriş yap</SubmitButton>
      </form>
      <form action={cancelSecondStepAction}>
        <button type="submit" className="btn btn-quiet">
          Vazgeç
        </button>
      </form>
    </div>
  );
}
