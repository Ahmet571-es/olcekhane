'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton } from '@/components/ui/form';
import { createNormSetAction, createPublishedNormAction, type NormFormState } from '../actions';

/** Platform verisinden ön norm (yalnızca araştırma rızalı ilk uygulamalar). */
export function NormCreateForm({ slug, gradeMin, gradeMax }: { slug: string; gradeMin: number; gradeMax: number }) {
  const [state, action] = useActionState<NormFormState, FormData>(createNormSetAction.bind(null, slug), {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="gradeMin" value={gradeMin} />
      <input type="hidden" name="gradeMax" value={gradeMax} />
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="norm-name" label="Adı (isteğe bağlı)" error={e.name}>
        <input id="norm-name" name="name" maxLength={120} className="input" placeholder="Boş bırakılırsa sınıf aralığı ve kişi sayısından üretilir" />
      </Field>
      <div>
        <SubmitButton pendingText="Hesaplanıyor…" className="btn btn-primary">
          Ön normu oluştur
        </SubmitButton>
      </div>
      <p className="t-meta">
        Platformu kullananlar Türkiye’yi temsil eden bir örneklem olmadığı için bu veriden yalnızca ön norm oluşturulur; raporlar bunu velilere
        açıkça söyler. Oluşturulan norm etkin başlamaz; etkinleştirdiğinizde yalnızca bundan sonraki uygulamalar bu normla puanlanır.
      </p>
    </form>
  );
}

/** Temsilî bir örneklem çalışmasının yayımlanmış norm istatistikleri (kesin norm). */
export function PublishedNormForm({ slug, scales, grades }: { slug: string; scales: { key: string; name: string; min: number; max: number }[]; grades: [number, number] }) {
  const [state, action] = useActionState<NormFormState, FormData>(createPublishedNormAction.bind(null, slug), {});
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pub-min" label="En küçük sınıf" error={e.gradeMin}>
          <input id="pub-min" name="gradeMin" type="number" min={1} max={13} required defaultValue={v.gradeMin ?? grades[0]} className="input" />
        </Field>
        <Field id="pub-max" label="En büyük sınıf" error={e.gradeMax}>
          <input id="pub-max" name="gradeMax" type="number" min={1} max={13} required defaultValue={v.gradeMax ?? grades[1]} className="input" />
        </Field>
      </div>
      <Field id="pub-name" label="Normun adı" error={e.name}>
        <input id="pub-name" name="name" maxLength={120} required defaultValue={v.name} className="input" placeholder="ör. Türkiye ortaokul normu (2027)" />
      </Field>
      <Field id="pub-source" label="Kaynak künyesi ve örneklem" error={e.source} hint="Yazarlar, yıl, başlık, yayın; örneklemin hangi illerden, okul türlerinden ve nasıl seçildiği.">
        <textarea id="pub-source" name="source" maxLength={400} rows={3} required defaultValue={v.source} className="input" />
      </Field>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9rem]">
          <thead>
            <tr className="text-ink-2">
              <th className="py-1.5 pr-3 font-bold">Ölçek (puan aralığı)</th>
              <th className="py-1.5 pr-3 font-bold">n</th>
              <th className="py-1.5 pr-3 font-bold">Ortalama</th>
              <th className="py-1.5 pr-3 font-bold">Standart sapma</th>
              <th className="py-1.5 font-bold">Güvenirlik (isteğe bağlı)</th>
            </tr>
          </thead>
          <tbody>
            {scales.map((s) => (
              <tr key={s.key} className="border-t border-rule align-top">
                <td className="py-1.5 pr-3">
                  {s.name}{' '}
                  <span className="t-meta">
                    ({s.min}–{s.max})
                  </span>
                </td>
                {(['n', 'mean', 'sd', 'rel'] as const).map((f) => {
                  const err = e[`${f}_${s.key}`];
                  return (
                    <td key={f} className="py-1.5 pr-3">
                      <input
                        name={`${f}_${s.key}`}
                        defaultValue={v[`${f}_${s.key}`]}
                        inputMode="decimal"
                        className="input min-h-10 w-28"
                        aria-label={`${s.name} ${f === 'n' ? 'kişi sayısı' : f === 'mean' ? 'ortalama' : f === 'sd' ? 'standart sapma' : 'güvenirlik'}`}
                        aria-invalid={!!err}
                      />
                      {err && <span className="field-error block">{err}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <SubmitButton pendingText="Kaydediliyor…" className="btn btn-secondary">
          Kesin normu kaydet
        </SubmitButton>
      </div>
    </form>
  );
}
