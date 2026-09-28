'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import { GRADE_LABELS } from '@/lib/config';
import { createChildAction, type ActionState } from '../../actions';

export function ChildForm({
  assessmentHtml,
  assessmentTitle,
  researchHtml,
  researchTitle,
}: {
  assessmentHtml: string;
  assessmentTitle: string;
  researchHtml: string;
  researchTitle: string;
}) {
  const [state, action] = useActionState<ActionState, FormData>(createChildAction, {});
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => thisYear - 6 - i);

  return (
    <form action={action} className="flex flex-col gap-10" noValidate>
      <FormMessage message={state.message} />
      <fieldset className="panel grid gap-5 p-6 md:grid-cols-2 md:p-8">
        <legend className="sr-only">Çocuğun bilgileri</legend>
        <Field id="firstName" label="Adı" error={e.firstName}>
          <input id="firstName" name="firstName" required className="input" defaultValue={v.firstName} autoComplete="off" aria-invalid={!!e.firstName} aria-describedby={describedBy('firstName', e.firstName)} />
        </Field>
        <Field id="lastName" label="Soyadı (isteğe bağlı)" hint="Raporda görünmesini istemiyorsanız boş bırakın." error={e.lastName}>
          <input id="lastName" name="lastName" className="input" defaultValue={v.lastName} autoComplete="off" aria-describedby={describedBy('lastName', e.lastName, true)} />
        </Field>
        <Field id="grade" label="Sınıfı" hint="Testler ve okuma metni sınıf düzeyine göre seçilir." error={e.grade}>
          <select id="grade" name="grade" required className="input" defaultValue={v.grade ?? ''} aria-invalid={!!e.grade} aria-describedby={describedBy('grade', e.grade, true)}>
            <option value="" disabled>
              Seçin
            </option>
            {Object.entries(GRADE_LABELS).map(([g, label]) => (
              <option key={g} value={g}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="birthYear" label="Doğum yılı (isteğe bağlı)" error={e.birthYear}>
          <select id="birthYear" name="birthYear" className="input" defaultValue={v.birthYear ?? ''}>
            <option value="">Belirtmek istemiyorum</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
        <Field id="gender" label="Cinsiyet (isteğe bağlı)" hint="Yalnızca norm çalışmalarında grup karşılaştırması için kullanılır.">
          <select id="gender" name="gender" className="input" defaultValue={v.gender ?? ''} aria-describedby="gender-ipucu">
            <option value="">Belirtmek istemiyorum</option>
            <option value="female">Kız</option>
            <option value="male">Erkek</option>
          </select>
        </Field>
        <Field id="relation" label="Çocuğa yakınlığınız" error={e.relation}>
          <select id="relation" name="relation" required className="input" defaultValue={v.relation ?? ''} aria-invalid={!!e.relation}>
            <option value="" disabled>
              Seçin
            </option>
            <option value="mother">Annesi</option>
            <option value="father">Babası</option>
            <option value="legal_guardian">Yasal vasisi</option>
            <option value="other">Diğer yasal temsilcisi</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <label className="check">
            <input type="checkbox" name="guardian" required aria-invalid={!!e.guardian} />
            <span>Bu çocuğun velisi ya da yasal temsilcisi olduğumu beyan ederim.</span>
          </label>
          {e.guardian && <p className="field-error mt-1">{e.guardian}</p>}
        </div>
      </fieldset>

      <section aria-labelledby="riza-baslik" className="flex flex-col gap-4">
        <div>
          <h2 id="riza-baslik" className="t-h2">
            Açık rızanız
          </h2>
          <p className="measure mt-2 text-ink-2">
            Psikolojik ölçme sonuçları sağlık verisi niteliği taşıyabildiği için KVKK gereği açık rızanızı ayrıca istiyoruz. Aşağıdaki metni
            okuyun; rıza vermezseniz profil oluşturulur ama çocuğunuz rıza verene kadar test çözemez. Rızanızı istediğiniz zaman geri alabilirsiniz.
          </p>
        </div>
        <div className="panel max-h-80 overflow-y-auto p-6" tabIndex={0} aria-label={assessmentTitle}>
          <h3 className="t-h3 mb-3">{assessmentTitle}</h3>
          <div className="prose-olc t-small" dangerouslySetInnerHTML={{ __html: assessmentHtml }} />
        </div>
        <label className="check">
          <input type="checkbox" name="consentAssessment" />
          <span>
            Açık rıza metnini okudum. Çocuğumun ölçme verilerinin bu metinde belirtilen amaçlarla işlenmesine <strong>açık rıza veriyorum</strong>.
          </span>
        </label>

        <details className="panel p-6">
          <summary className="cursor-pointer font-bold">İsteğe bağlı: Türkiye normlarının oluşturulmasına katkı</summary>
          <div className="mt-4 flex flex-col gap-4">
            <div className="prose-olc t-small" dangerouslySetInnerHTML={{ __html: researchHtml }} />
            <label className="check">
              <input type="checkbox" name="consentResearch" />
              <span>{researchTitle} kapsamında, anonimleştirilmiş verilerin norm ve geçerlik çalışmalarında kullanılmasına açık rıza veriyorum.</span>
            </label>
          </div>
        </details>
        <p className="t-meta">
          Verilerin nasıl işlendiğini <Link href="/yasal/aydinlatma-metni" target="_blank">KVKK aydınlatma metninde</Link> okuyabilirsiniz.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <SubmitButton className="btn btn-primary btn-lg" pendingText="Kaydediliyor…">
          Profili oluştur
        </SubmitButton>
        <Link href="/panel" className="btn btn-secondary btn-lg">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
