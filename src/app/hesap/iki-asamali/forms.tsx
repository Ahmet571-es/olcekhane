'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { Field, FormMessage, SubmitButton, describedBy } from '@/components/ui/form';
import {
  cancelSetupAction,
  confirmSetupAction,
  disableAction,
  regenerateCodesAction,
  startSetupAction,
  verifySessionAction,
  type TwoFactorState,
} from './actions';

/** Kurtarma kodları yalnızca üretildikleri anda gösterilir. */
function RecoveryCodes({ codes, next }: { codes: string[]; next?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <p className="notice notice-warn">
        Bu kurtarma kodlarını şimdi güvenli bir yere kaydedin (ör. parola yöneticisi ya da basılı bir kâğıt). Telefonunuza erişemezseniz her
        kod bir kez girişte kullanılabilir. Kodlar bir daha gösterilmez.
      </p>
      <ol className="grid grid-cols-2 gap-2 rounded-lg border border-rule bg-surface p-4 font-mono text-[1.05rem] tabular sm:grid-cols-2">
        {codes.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            navigator.clipboard
              .writeText(codes.join('\n'))
              .then(() => setCopied(true))
              .catch(() => setCopied(false));
          }}
        >
          {copied ? 'Kopyalandı' : 'Kodları kopyala'}
        </button>
        {next && (
          <Link href={next} className="btn btn-primary">
            Kodları kaydettim, devam et
          </Link>
        )}
      </div>
    </div>
  );
}

function Hidden({ zorunlu, next }: { zorunlu: boolean; next?: string }) {
  return (
    <>
      {zorunlu && <input type="hidden" name="zorunlu" value="1" />}
      {next && <input type="hidden" name="sonra" value={next} />}
    </>
  );
}

/**
 * Kurulumu (ya da yeni cihaza taşımayı) başlatma formu: şifre, taşımada ayrıca şu anki cihazdaki kod
 * ya da bir kurtarma kodu istenir.
 */
export function StartSetupForm({ moving, zorunlu, next }: { moving: boolean; zorunlu: boolean; next?: string }) {
  const [state, action] = useActionState<TwoFactorState, FormData>(startSetupAction, {});
  const e = state.errors ?? {};
  const id = moving ? 'tasi' : 'baslat';
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Hidden zorunlu={zorunlu} next={next} />
      <FormMessage ok={state.ok} message={state.message} />
      <Field id={`${id}-password`} label="Şifreniz" error={e.password}>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input max-w-sm"
          aria-invalid={!!e.password}
          aria-describedby={describedBy(`${id}-password`, e.password)}
        />
      </Field>
      {moving && (
        <Field id={`${id}-code`} label="Şu anki cihazdaki kod ya da bir kurtarma kodu" error={e.code}>
          <input
            id={`${id}-code`}
            name="code"
            autoComplete="one-time-code"
            maxLength={16}
            required
            className="input max-w-[16rem] font-mono tracking-widest"
            aria-invalid={!!e.code}
            aria-describedby={describedBy(`${id}-code`, e.code)}
          />
        </Field>
      )}
      <div>
        <SubmitButton pendingText="Hazırlanıyor…" className={moving ? 'btn btn-secondary' : 'btn btn-primary'}>
          {moving ? 'Yeni cihazda kur' : 'Kurulumu başlat'}
        </SubmitButton>
      </div>
    </form>
  );
}

/** Kodla doğrulanmamış bir oturumu doğrulama formu. */
export function VerifySessionForm({ zorunlu, next }: { zorunlu: boolean; next?: string }) {
  const [state, action] = useActionState<TwoFactorState, FormData>(verifySessionAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Hidden zorunlu={zorunlu} next={next} />
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="dogrula-code" label="Doğrulama kodu ya da kurtarma kodu" error={e.code}>
        <input
          id="dogrula-code"
          name="code"
          autoComplete="one-time-code"
          maxLength={16}
          required
          className="input max-w-[16rem] font-mono tracking-widest"
          aria-invalid={!!e.code}
          aria-describedby={describedBy('dogrula-code', e.code)}
        />
      </Field>
      <div>
        <SubmitButton pendingText="Doğrulanıyor…" className="btn btn-primary">
          Oturumu doğrula
        </SubmitButton>
      </div>
    </form>
  );
}

/**
 * Kurulum paneli: karekod, anahtar ve doğrulama formu. Kod doğrulanınca aynı yerde kurtarma kodları
 * gösterilir; sayfa bu sırada yeniden çizilmez (kodlar yalnızca bu yanıtta vardır).
 */
export function SetupPanel({
  qr,
  secretKey,
  email,
  moving,
  zorunlu,
  next,
}: {
  qr: string;
  secretKey: string;
  email: string;
  moving: boolean;
  zorunlu: boolean;
  next?: string;
}) {
  const [state, action] = useActionState<TwoFactorState, FormData>(confirmSetupAction, {});
  if (state.ok && state.codes) {
    return (
      <section className="panel flex flex-col gap-5 p-6 md:p-8" aria-labelledby="kurulum">
        <h2 id="kurulum" className="t-h3">
          {moving ? 'Yeni cihaz hazır' : 'İki aşamalı doğrulama açıldı'}
        </h2>
        <p className="notice notice-ok" role="status">
          {moving ? 'Yeni cihazınız kuruldu; eski cihazdaki kodlar artık geçerli değil.' : 'İki aşamalı doğrulama açıldı.'} Diğer cihazlardaki
          oturumlarınız kapatıldı.
        </p>
        <RecoveryCodes codes={state.codes} next={next ?? '/hesap'} />
      </section>
    );
  }
  const e = state.errors ?? {};
  return (
    <section className="panel flex flex-col gap-6 p-6 md:p-8" aria-labelledby="kurulum">
      <h2 id="kurulum" className="t-h3">
        {moving ? 'Yeni cihaza taşı' : 'Kurulum'}
      </h2>
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-ink-2">
        <li>Telefonunuza bir kimlik doğrulama uygulaması kurun (ör. Google Authenticator, Microsoft Authenticator).</li>
        <li>Uygulamada “hesap ekle”yi seçip aşağıdaki karekodu okutun ya da anahtarı elle girin.</li>
        <li>Uygulamanın gösterdiği 6 haneli kodu yazın.</li>
      </ol>
      <div className="flex flex-wrap items-start gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- sunucuda üretilen karekod (data: adresi) */}
        <img src={qr} alt="Kimlik doğrulama uygulamasıyla okutulacak karekod" width={184} height={184} className="rounded-lg border border-rule bg-white p-2" />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="t-meta">Karekodu okutamıyorsanız anahtar</p>
          <p className="break-all font-mono text-[1.05rem] tracking-wider">{secretKey}</p>
          <p className="t-meta break-all">Hesap: {email} · Tür: zamana dayalı (TOTP)</p>
        </div>
      </div>
      <form action={action} className="flex flex-col gap-4" noValidate>
        <Hidden zorunlu={zorunlu} next={next} />
        <FormMessage ok={state.ok} message={state.message} />
        <Field id="code" label="Uygulamadaki 6 haneli kod" error={e.code}>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]*"
            maxLength={7}
            required
            className="input max-w-[12rem] font-mono tracking-widest"
            aria-invalid={!!e.code}
            aria-describedby={describedBy('code', e.code)}
          />
        </Field>
        <div>
          <SubmitButton pendingText="Doğrulanıyor…" className="btn btn-primary">
            Doğrula ve aç
          </SubmitButton>
        </div>
      </form>
      <form action={cancelSetupAction}>
        <Hidden zorunlu={zorunlu} next={next} />
        <button type="submit" className="btn btn-quiet">
          Kurulumdan vazgeç
        </button>
      </form>
    </section>
  );
}

export function RegenerateCodesForm() {
  const [state, action] = useActionState<TwoFactorState, FormData>(regenerateCodesAction, {});
  if (state.ok && state.codes) return <RecoveryCodes codes={state.codes} />;
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="regen-code" label="Uygulamadaki 6 haneli kod" error={e.code}>
        <input
          id="regen-code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          required
          className="input max-w-[12rem] font-mono tracking-widest"
          aria-invalid={!!e.code}
          aria-describedby={describedBy('regen-code', e.code)}
        />
      </Field>
      <div>
        <SubmitButton pendingText="Oluşturuluyor…" className="btn btn-secondary">
          Yeni kurtarma kodları oluştur
        </SubmitButton>
      </div>
    </form>
  );
}

export function DisableForm() {
  const [state, action] = useActionState<TwoFactorState, FormData>(disableAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage ok={state.ok} message={state.message} />
      <Field id="disable-password" label="Şifreniz" error={e.password}>
        <input
          id="disable-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input max-w-sm"
          aria-invalid={!!e.password}
          aria-describedby={describedBy('disable-password', e.password)}
        />
      </Field>
      <Field id="disable-code" label="Doğrulama kodu ya da kurtarma kodu" error={e.code}>
        <input
          id="disable-code"
          name="code"
          autoComplete="one-time-code"
          maxLength={16}
          required
          className="input max-w-[16rem] font-mono tracking-widest"
          aria-invalid={!!e.code}
          aria-describedby={describedBy('disable-code', e.code)}
        />
      </Field>
      <div>
        <SubmitButton pendingText="Kapatılıyor…" className="btn btn-danger">
          İki aşamalı doğrulamayı kapat
        </SubmitButton>
      </div>
    </form>
  );
}
