'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { contactAction, type ContactState } from './actions';

export function ContactForm({ defaultTopic = '' }: { defaultTopic?: string }) {
  const [state, action] = useActionState<ContactState, FormData>(contactAction, {});
  const e = state.errors ?? {};
  const v = state.values ?? {};
  if (state.ok) return <FormMessage ok message={state.message} />;
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormMessage message={state.message} />
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Web siteniz</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id="topic" label="Konu" error={e.topic}>
        <select id="topic" name="topic" className="input" defaultValue={v.topic || defaultTopic} required aria-invalid={!!e.topic}>
          <option value="" disabled>
            Seçin
          </option>
          <option value="parent">Veli olarak soru soruyorum</option>
          <option value="school">Okulum için başvuru</option>
          <option value="kvkk">Kişisel veriler (KVKK) başvurusu</option>
          <option value="press">Basın</option>
          <option value="other">Diğer</option>
        </select>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Adınız soyadınız" error={e.name}>
          <input id="name" name="name" className="input" autoComplete="name" defaultValue={v.name} required aria-invalid={!!e.name} aria-describedby={describedBy('name', e.name)} />
        </Field>
        <Field id="email" label="E-posta" error={e.email}>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" className="input" defaultValue={v.email} required aria-invalid={!!e.email} aria-describedby={describedBy('email', e.email)} />
        </Field>
        <Field id="phone" label="Telefon (isteğe bağlı)">
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="input" defaultValue={v.phone} />
        </Field>
        <Field id="organization" label="Okul ya da kurum (isteğe bağlı)">
          <input id="organization" name="organization" className="input" defaultValue={v.organization} />
        </Field>
      </div>
      <Field id="message" label="Mesajınız" error={e.message}>
        <textarea id="message" name="message" rows={6} className="input" defaultValue={v.message} required aria-invalid={!!e.message} aria-describedby={describedBy('message', e.message)} />
      </Field>
      <p className="t-meta">
        Mesajınızı yalnızca size dönüş yapmak için kullanır, 1 yıl sonra sileriz. Çocuğunuza ait test sonuçlarını bu formla paylaşmayın.
        Ayrıntılar: <Link href="/yasal/aydinlatma-metni">KVKK aydınlatma metni</Link>
      </p>
      <div>
        <SubmitButton className="btn btn-primary btn-lg" pendingText="Gönderiliyor…">
          Mesajı gönder
        </SubmitButton>
      </div>
    </form>
  );
}
