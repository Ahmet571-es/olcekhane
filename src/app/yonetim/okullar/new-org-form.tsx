'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { createOrgAction, type AdminFormState } from '../actions';

export function NewOrgForm() {
  const [state, action] = useActionState<AdminFormState, FormData>(createOrgAction, {});
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage message={state.message} />
      <Field id="name" label="Okulun adı" error={e.name}>
        <input id="name" name="name" required maxLength={120} className="input" defaultValue={v.name} aria-invalid={!!e.name} aria-describedby={describedBy('name', e.name)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="city" label="İl" error={e.city}>
          <input id="city" name="city" maxLength={60} className="input" defaultValue={v.city} aria-invalid={!!e.city} />
        </Field>
        <Field id="district" label="İlçe" error={e.district}>
          <input id="district" name="district" maxLength={60} className="input" defaultValue={v.district} aria-invalid={!!e.district} />
        </Field>
      </div>
      <Field id="email" label="İlk davet edilecek kişinin e-postası" error={e.email} hint="Okulun ekibini bu kişi kuracak.">
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          required
          className="input"
          defaultValue={v.email}
          aria-invalid={!!e.email}
          aria-describedby={describedBy('email', e.email, true)}
        />
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="field-label mb-1">Görevi</legend>
        <label className="check">
          <input type="radio" name="role" value="org_admin" defaultChecked={v.role !== 'counselor'} />
          <span>Okul yöneticisi (ekibi kurar, sınıfları yönetir)</span>
        </label>
        <label className="check">
          <input type="radio" name="role" value="counselor" defaultChecked={v.role === 'counselor'} />
          <span>Rehber öğretmen (sınıfları kurar, test atar, bireysel raporları görür)</span>
        </label>
        {e.role && (
          <p className="field-error" role="alert">
            {e.role}
          </p>
        )}
      </fieldset>
      <p className="t-meta">
        Rehber öğretmen olarak davet edilen kişi ekip yönetemez; okulun ayrıca bir yöneticisi olacaksa onu da daveti kabul edildikten sonra
        okulun sayfasından davet edin.
      </p>
      <div>
        <SubmitButton pendingText="Oluşturuluyor…" className="btn btn-primary">
          Okulu oluştur ve davet gönder
        </SubmitButton>
      </div>
    </form>
  );
}
