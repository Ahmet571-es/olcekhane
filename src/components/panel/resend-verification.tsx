'use client';

import { useActionState } from 'react';
import { resendVerificationAction, type FormState } from '@/app/(auth)/actions';
import { SubmitButton } from '@/components/ui/form';

export function ResendVerification({ email }: { email: string }) {
  const [state, action] = useActionState<FormState, FormData>(async () => resendVerificationAction(), {});
  return (
    <div className="notice notice-warn flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p>
        {state.message ?? (
          <>
            E-posta adresinizi henüz doğrulamadınız. Testlere başlamak için <strong>{email}</strong> adresine gönderdiğimiz bağlantıyı açın.
          </>
        )}
      </p>
      {!state.ok && (
        <form action={action}>
          <SubmitButton className="btn btn-secondary shrink-0" pendingText="Gönderiliyor…">
            Bağlantıyı yeniden gönder
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
