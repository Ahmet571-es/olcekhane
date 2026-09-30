import { PageHeader } from '@/components/site/page-header';
import { TestCards } from '@/components/site/test-cards';
import { TestShelf } from '@/components/site/test-shelf';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Testler: kişilik, ilgi, okuma ve öğrenme testleri',
  description:
    'Öğrenciler için bilimsel kişilik, öz-saygı, okuma hızı ve anlama testleri. Her testin dayandığı ölçek, Türkçe sürümü, güvenirliği ve sınırları açıkça yazılı.',
  path: '/testler',
  ownImage: true,
});

export default function TestsPage() {
  return (
    <>
      <PageHeader
        title="Testler"
        lede="Her test ya yayımlanmış bir bilimsel ölçeğe ya da bizim geliştirip belgelediğimiz özgün bir göreve dayanır. Teste tıklayarak neyi ölçtüğünü, kaynağını, güvenirliğini ve sınırlarını görebilirsiniz."
      >
        <p className="measure text-ink-2">
          Bütün testler ücretsiz ve hesap açmadan çözülür. Cevaplar saklanmaz; rapor ekranda gösterilir ve PDF olarak size verilir.
        </p>
      </PageHeader>

      <section className="container-page py-14 md:py-20" aria-labelledby="yayindakiler">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="yayindakiler" className="t-h2">
            Yayındaki testler
          </h2>
          <a href="#karsilastir" className="font-bold">
            Kaynaklarıyla karşılaştırın ↓
          </a>
        </div>
        <TestCards showUpcoming={false} filterable />
      </section>

      <section className="border-t border-rule bg-surface-2/55" aria-labelledby="karsilastir">
        <div className="container-page py-14 md:py-20">
          <div className="mb-10 flex max-w-3xl flex-col gap-3" data-reveal>
            <h2 id="karsilastir" className="t-h2 scroll-mt-28">
              Kaynaklarıyla birlikte
            </h2>
            <p className="text-ink-2">
              Her testin neyi ölçtüğü, dayandığı kaynak, kimler için uygun olduğu ve durumu alan alan. Hazırlanan testler de burada.
            </p>
          </div>
          <TestShelf />
        </div>
      </section>
    </>
  );
}
