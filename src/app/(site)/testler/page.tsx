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
    <div className="container-page py-14 md:py-20">
      <div className="mb-12 flex max-w-3xl flex-col gap-4">
        <h1 className="t-h1">Testler</h1>
        <p className="t-lede">
          Her test ya yayımlanmış bir bilimsel ölçeğe ya da bizim geliştirip belgelediğimiz özgün bir göreve dayanır. Testin adına
          tıklayarak neyi ölçtüğünü, kaynağını, güvenirliğini ve sınırlarını görebilirsiniz.
        </p>
      </div>
      <TestShelf headingLevel={2} />
    </div>
  );
}
