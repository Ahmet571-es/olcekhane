import { PageHeader } from '@/components/site/page-header';
import { pageMeta } from '@/lib/seo';
import { getCompany } from '@/lib/site';
import { ContactForm } from './contact-form';

export const metadata = pageMeta({
  title: 'İletişim',
  description: 'Ölçekhane ile iletişime geçin: veli soruları, okul başvuruları ve kişisel veri başvuruları.',
  path: '/iletisim',
});

export default async function ContactPage(props: PageProps<'/iletisim'>) {
  const q = await props.searchParams;
  const c = getCompany();
  const topic = typeof q.konu === 'string' && ['parent', 'school', 'press', 'kvkk', 'other'].includes(q.konu) ? q.konu : '';
  const rows = [
    { k: 'Unvan', v: c.legalName },
    { k: 'Adres', v: c.address },
    { k: 'Telefon', v: c.phone },
    { k: 'E-posta', v: c.email },
    { k: 'KVKK başvuruları', v: c.kvkkEmail },
    { k: 'KEP adresi', v: c.kepAddress },
    { k: 'MERSİS', v: c.mersisNo },
    { k: 'Vergi dairesi ve numarası', v: c.taxOffice && c.taxNo ? `${c.taxOffice}, ${c.taxNo}` : '' },
  ].filter((r) => r.v);

  return (
    <>
      <PageHeader title="İletişim" lede="Sorularınızı, okul başvurularınızı ve kişisel verilerinizle ilgili taleplerinizi bu formla iletebilirsiniz." />
      <div className="container-page grid gap-14 py-14 md:py-16 lg:grid-cols-[1.5fr_1fr]">
        <ContactForm defaultTopic={topic} />
        <aside className="flex flex-col gap-6">
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
          <div className="panel p-6">
            <h2 className="t-h3 mb-2">Kişisel veri başvuruları</h2>
            <p className="t-small text-ink-2">
              KVKK’nın 11. maddesindeki haklarınızı kullanmak için formda “Kişisel veriler (KVKK) başvurusu” konusunu
              {c.kvkkEmail ? ` seçebilir ya da ${c.kvkkEmail} adresine yazabilirsiniz` : ' seçebilirsiniz'}. Başvurular en geç 30 gün içinde
              ücretsiz sonuçlandırılır.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
