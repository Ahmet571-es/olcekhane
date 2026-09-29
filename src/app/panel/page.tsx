import Link from 'next/link';
import { ResendVerification } from '@/components/panel/resend-verification';
import { requireUser } from '@/lib/auth/dal';
import { GRADE_LABELS } from '@/lib/config';
import { listChildren } from '@/lib/panel/queries';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const MESSAGES: Record<string, { ok: boolean; text: string }> = {
  'hosgeldiniz=1': { ok: true, text: 'Hesabınız açıldı. Şimdi çocuğunuzun profilini oluşturabilirsiniz.' },
  'dogrulama=tamam': { ok: true, text: 'E-posta adresiniz doğrulandı.' },
  'dogrulama=gecersiz': { ok: false, text: 'Doğrulama bağlantısının süresi dolmuş ya da daha önce kullanılmış. Aşağıdan yeni bir bağlantı isteyebilirsiniz.' },
  'sifre=yenilendi': { ok: true, text: 'Şifreniz yenilendi.' },
  'silindi=1': { ok: true, text: 'Profil silindi. Profile ait veriler en geç 30 gün içinde kalıcı olarak silinecek.' },
  'kaldirildi=1': { ok: true, text: 'Öğrenci veli panelinizden kaldırıldı. Okuldaki kaydı değişmedi.' },
};

export default async function PanelHome(props: PageProps<'/panel'>) {
  const user = await requireUser('/panel');
  const q = await props.searchParams;
  const msg = Object.entries(MESSAGES).find(([k]) => {
    const [key, val] = k.split('=');
    return q[key] === val;
  })?.[1];
  const children = await listChildren(user.id);

  return (
    <div className="flex flex-col gap-8">
      {msg && <p className={`notice ${msg.ok ? 'notice-ok' : 'notice-danger'}`}>{msg.text}</p>}
      {!user.emailVerified && <ResendVerification email={user.email} />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h1">Çocuklarım</h1>
          <p className="mt-1 text-ink-2">Her çocuk için ayrı bir profil oluşturun; testler ve raporlar profilde toplanır.</p>
        </div>
        {children.length > 0 && (
          <Link href="/panel/cocuk/yeni" className="btn btn-primary">
            Çocuk ekle
          </Link>
        )}
      </div>

      {children.length === 0 ? (
        <div className="panel flex flex-col items-start gap-4 p-8 md:p-10">
          <h2 className="t-h2">İlk profili oluşturun</h2>
          <p className="measure text-ink-2">
            Çocuğunuzun adını ve sınıfını girmeniz yeterli. Ardından sınıfına uygun testleri görecek ve ilkini hemen başlatabileceksiniz.
            Kişilik profili, öz-saygı ve okuma testleri ücretsizdir.
          </p>
          <Link href="/panel/cocuk/yeni" className="btn btn-primary btn-lg">
            Çocuğumun profilini oluştur
          </Link>
        </div>
      ) : (
        <ul className="panel divide-y divide-rule">
          {children.map((c) => (
            <li key={c.id}>
              <Link
                href={`/panel/cocuk/${c.id}`}
                className="grid gap-2 p-5 no-underline hover:bg-surface-2 sm:grid-cols-[1fr_auto] sm:items-center md:p-6"
              >
                <div>
                  <p className="font-display text-xl font-bold">
                    {c.firstName} {c.lastName ?? ''}
                  </p>
                  <p className="t-meta">
                    {GRADE_LABELS[c.grade]}
                    {c.orgName && ` · ${c.orgName}`}
                    {c.completed > 0
                      ? ` · ${c.completed} test tamamlandı, son test ${dateFmt.format(new Date(c.lastCompletedAt!))}`
                      : ' · Henüz test çözülmedi'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {c.hasConsent ? (
                    <span className="chip chip-ok">Açık rıza verildi</span>
                  ) : (
                    <span className="chip chip-brass">Açık rıza bekleniyor</span>
                  )}
                  <span className="t-small font-bold">Profili aç</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
