'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { registerAction, type FormState } from '../actions';

export function RegisterForm({ next = '' }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(registerAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {next && <input type="hidden" name="sonra" value={next} />}
      <FormMessage ok={state.ok} message={state.message} />
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
      <Field id="email" label="E-posta" error={e.email} hint="Raporlarınız ve hesap bildirimleriniz bu adrese gelir.">
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className="input"
          defaultValue={state.values?.email}
          aria-invalid={!!e.email}
          aria-describedby={describedBy('email', e.email, true)}
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
      <div className="flex flex-col gap-3">
        <label className="check">
          <input type="checkbox" name="adult" required aria-invalid={!!e.adult} />
          <span>18 yaşını doldurdum.</span>
        </label>
        {e.adult && <p className="field-error">{e.adult}</p>}
        <label className="check">
          <input type="checkbox" name="notice" required aria-invalid={!!e.notice} />
          <span>
            <Link href="/yasal/kullanim-kosullari" target="_blank">Kullanım koşullarını</Link> ve{' '}
            <Link href="/yasal/aydinlatma-metni" target="_blank">KVKK aydınlatma metnini</Link> okudum, anladım.
          </span>
        </label>
        {e.notice && <p className="field-error">{e.notice}</p>}
      </div>
      <SubmitButton pendingText="Hesap açılıyor…">Hesabımı aç</SubmitButton>
      <p className="text-[0.95rem]">
        Zaten hesabınız var mı? <Link href={next ? `/giris?sonra=${encodeURIComponent(next)}` : '/giris'}>Giriş yapın</Link>
      </p>
    </form>
  );
}
