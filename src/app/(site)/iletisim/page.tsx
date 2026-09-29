import { PageHeader } from '@/components/site/page-header';
import { pageMeta } from '@/lib/seo';
import { getCompany } from '@/lib/site';

export const metadata = pageMeta({
  title: 'İletişim',
  description: 'Ölçekhane ile iletişime geçin: sorularınız, önerileriniz ve kişisel veri başvurularınız için e-posta adresimiz.',
  path: '/iletisim',
});

export default function ContactPage() {
  const c = getCompany();
  const kvkkEmail = c.kvkkEmail || c.email;
  const rows = [
    { k: 'Unvan', v: c.legalName },
    { k: 'Adres', v: c.address },
    { k: 'Telefon', v: c.phone },
    { k: 'KEP adresi', v: c.kepAddress },
    { k: 'MERSİS', v: c.mersisNo },
    { k: 'Vergi dairesi ve numarası', v: c.taxOffice && c.taxNo ? `${c.taxOffice}, ${c.taxNo}` : '' },
  ].filter((r) => r.v);

  return (
    <>
      <PageHeader title="İletişim" lede="Sorularınız, önerileriniz ve kişisel verilerinizle ilgili başvurularınız için bize e-postayla yazabilirsiniz." />
      <div className="container-page grid gap-14 py-14 md:py-16 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="eposta" className="flex flex-col gap-6">
          <div className="panel flex flex-col gap-3 p-6 md:p-8">
            <h2 id="eposta" className="t-meta">
              E-posta
            </h2>
            {c.email ? (
              <a href={`mailto:${c.email}`} className="break-words font-display text-[clamp(1.5rem,4vw,2.25rem)] font-bold">
                {c.email}
              </a>
            ) : (
              <p className="text-ink-2">E-posta adresimiz çok yakında burada yazacak.</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="t-h3">Yazmadan önce</h2>
            <ul className="measure flex list-disc flex-col gap-2 pl-5 text-ink-2">
              <li>
                Sitemizde iletişim formu, hesap ya da üyelik yok. E-postanız yalnızca e-posta kutumuzda bulunur ve yalnızca size yanıt vermek
                için kullanılır.
              </li>
              <li>
                Lütfen e-postanıza test cevaplarını, raporun PDF’ini ya da çocuğunuzun sağlığıyla ilgili ayrıntıları eklemeyin. Sorunuzu genel
                olarak anlatmanız yeterli.
              </li>
              <li>Test sonuçlarını biz saklamadığımız için bir raporu yeniden gönderemeyiz; raporun tek kopyası sizin indirdiğiniz PDF’tir.</li>
            </ul>
          </div>
        </section>
        <aside className="flex flex-col gap-6">
          <div className="panel p-6">
            <h2 className="t-h3 mb-2">Kişisel veri başvuruları</h2>
            <p className="t-small text-ink-2">
              KVKK’nın 11. maddesindeki haklarınızı kullanmak için
              {kvkkEmail ? ` ${kvkkEmail} adresine yazabilir` : ' bize e-postayla yazabilir'}
              {c.kepAddress ? ` ya da KEP adresimize (${c.kepAddress}) başvurabilirsiniz` : 'siniz'}. Başvurular en geç 30 gün içinde ücretsiz
              sonuçlandırılır. Sitemiz test cevaplarını ve raporları saklamadığı için bunlarla ilgili size ait bir kayıt bulunmaz.
            </p>
          </div>
          {rows.length > 0 && (
            <div className="panel p-6">
              <h2 className="t-h3 mb-4">Şirket bilgileri</h2>
              <dl className="flex flex-col gap-3">
                {rows.map((r) => (
                  <div key={r.k}>
                    <dt className="t-meta">{r.k}</dt>
                    <dd className="break-words">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
