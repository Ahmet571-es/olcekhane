import { PageHeader } from '@/components/site/page-header';
import { pageMeta } from '@/lib/seo';
import { HOSTING_PROVIDER, getOwner, taxLine } from '@/lib/site';

export const metadata = pageMeta({
  title: 'İletişim',
  description:
    'Ölçekhane ile iletişim: sorularınız, önerileriniz ve kişisel veri başvurularınız için e-posta adresi; sitenin sahibi ve barındırma hizmeti sağlayıcısı.',
  path: '/iletisim',
});

/*
 * 5651 sayılı Kanun'a dayanan yönetmeliğin 5. maddesi gereği site sahibinin adı ve soyadı, adresi, telefonu
 * ve e-postası ile yer sağlayıcının bilgileri bu sayfada, "İletişim" başlığı altında gösterilir. Sayfaya
 * ana sayfadaki altbilgiden doğrudan ulaşılır (bkz. lib/site.ts).
 */
export default function ContactPage() {
  const o = getOwner();
  const ownerRows = [
    { k: 'Adı ve soyadı', v: o.name },
    { k: 'Adres', v: o.address },
    { k: 'Telefon', v: o.phone, href: o.phone ? `tel:${o.phone.replace(/[^\d+]/g, '')}` : undefined },
    { k: 'E-posta', v: o.email, href: o.email ? `mailto:${o.email}` : undefined },
    { k: 'KEP adresi', v: o.kepAddress },
    { k: 'Vergi dairesi ve numarası', v: taxLine(o) },
  ].filter((r) => r.v);
  const applyRows = [
    { k: 'E-postayla', v: o.kvkkEmail },
    { k: 'KEP ile', v: o.kepAddress },
    { k: 'Yazılı olarak (posta ya da elden)', v: o.address },
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
            {o.email ? (
              <a href={`mailto:${o.email}`} className="break-words font-display text-[clamp(1.5rem,4vw,2.25rem)] font-bold">
                {o.email}
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
            <h2 className="t-h3 mb-2">Site sahibi</h2>
            <p className="t-small mb-4 text-ink-2">Ölçekhane’yi bir kişi bireysel olarak işletir; KVKK kapsamında veri sorumlusu da odur.</p>
            {ownerRows.length > 0 ? (
              <Rows rows={ownerRows} />
            ) : (
              <p className="t-small text-ink-2">Site sahibinin bilgileri çok yakında burada yer alacak.</p>
            )}
          </div>
          <div className="panel p-6">
            <h2 className="t-h3 mb-2">Kişisel veri başvuruları</h2>
            <p className="t-small mb-4 text-ink-2">
              KVKK’nın 11. maddesindeki haklarınızı kullanmak için başvurunuzu {applyRows.length > 1 ? 'şu yollardan biriyle' : 'bize'} iletebilirsiniz.
              Başvurular en geç 30 gün içinde ücretsiz sonuçlandırılır. Sitemiz test cevaplarını ve raporları saklamadığı için bunlarla ilgili size
              ait bir kayıt bulunmaz.
            </p>
            {applyRows.length > 0 && <Rows rows={applyRows} />}
          </div>
          <div className="panel p-6">
            <h2 className="t-h3 mb-2">Yer sağlayıcı</h2>
            <p className="t-small mb-4 text-ink-2">Sitemizin sunucusu bu şirketten barındırma hizmeti olarak kiralanır.</p>
            <Rows
              rows={[
                { k: 'Unvan', v: HOSTING_PROVIDER.name },
                { k: 'Adres', v: HOSTING_PROVIDER.address },
                { k: 'İnternet sitesi', v: HOSTING_PROVIDER.website.replace(/^https:\/\/(www\.)?/, ''), href: HOSTING_PROVIDER.website },
                { k: 'Sunucunun bulunduğu yer', v: HOSTING_PROVIDER.serverLocation },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}

function Rows({ rows }: { rows: { k: string; v: string; href?: string }[] }) {
  return (
    <dl className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.k}>
          <dt className="t-meta">{r.k}</dt>
          <dd className="break-words">{r.href ? <a href={r.href}>{r.v}</a> : r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
