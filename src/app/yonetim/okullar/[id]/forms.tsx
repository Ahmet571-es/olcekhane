'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { adminInviteAction, updateOrgAction, type AdminFormState } from '../../actions';

export function OrgSettingsForm({
  orgId,
  initial,
}: {
  orgId: string;
  initial: { name: string; city: string; district: string; minGroupSize: number };
}) {
  const [state, action] = useActionState<AdminFormState, FormData>(updateOrgAction.bind(null, orgId), {});
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="name" label="Okulun adı" error={e.name}>
        <input id="name" name="name" required maxLength={120} className="input" defaultValue={v.name ?? initial.name} aria-invalid={!!e.name} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="city" label="İl" error={e.city}>
          <input id="city" name="city" maxLength={60} className="input" defaultValue={v.city ?? initial.city} />
        </Field>
        <Field id="district" label="İlçe" error={e.district}>
          <input id="district" name="district" maxLength={60} className="input" defaultValue={v.district ?? initial.district} />
        </Field>
      </div>
      <Field
        id="minGroupSize"
        label="Grup raporları için en az öğrenci sayısı"
        error={e.minGroupSize}
        hint="Öğretmenler bu sayıdan küçük grupların özetini göremez. En az 5."
      >
        <input
          id="minGroupSize"
          name="minGroupSize"
          type="number"
          min={5}
          max={30}
          required
          className="input max-w-32"
          defaultValue={v.minGroupSize ?? initial.minGroupSize}
          aria-invalid={!!e.minGroupSize}
          aria-describedby={describedBy('minGroupSize', e.minGroupSize, true)}
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

export function AdminInviteForm({ orgId }: { orgId: string }) {
  const [state, action] = useActionState<AdminFormState, FormData>(adminInviteAction.bind(null, orgId), {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="invite-email" label="E-posta" error={e.email}>
        <input
          id="invite-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          required
          className="input"
          defaultValue={state.values?.email}
          aria-invalid={!!e.email}
          aria-describedby={describedBy('invite-email', e.email)}
        />
      </Field>
      <Field id="invite-role" label="Görevi" error={e.role}>
        <select id="invite-role" name="role" required className="input" defaultValue={state.values?.role ?? ''} aria-invalid={!!e.role}>
          <option value="" disabled>
            Seçin
          </option>
          <option value="org_admin">Okul yöneticisi</option>
          <option value="counselor">Rehber öğretmen</option>
          <option value="teacher">Öğretmen</option>
        </select>
      </Field>
      <div>
        <SubmitButton pendingText="Gönderiliyor…" className="btn btn-primary">
          Davet gönder
        </SubmitButton>
      </div>
    </form>
  );
}
