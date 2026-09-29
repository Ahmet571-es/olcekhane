import Link from 'next/link';
import { redirect } from 'next/navigation';
import { siteUrl } from '@/lib/config';
import { requireClass, requireOrg } from '@/lib/school/access';
import { CodesIssuer } from './codes-issuer';

export default async function CodesPage(props: PageProps<'/okul/[slug]/sinif/[classId]/kodlar'>) {
  const { slug, classId } = await props.params;
  const ctx = await requireOrg(slug);
  if (!ctx.can.issueCodes) redirect(`/okul/${slug}`);
  const cls = await requireClass(ctx, classId);
  const loginUrl = siteUrl('/ogrenci-girisi').replace(/^https?:\/\//, '');
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link href={`/okul/${slug}/sinif/${classId}`} className="t-small print:hidden">
        {cls.name}
      </Link>
      <div className="flex flex-col gap-3 print:hidden">
        <h1 className="t-h1">Giriş kodları</h1>
        <p className="measure text-ink-2">
          Her öğrenci, kendisine özel 10 karakterlik bir kodla giriş yapar; e-posta adresi gerekmez. Güvenlik için kodun kendisi saklanmaz,
          yalnızca geri çevrilemeyen bir özeti tutulur; bu yüzden kodlar <strong className="text-ink">yalnızca oluşturulduğu anda bir kez gösterilir</strong>.
          Kodları oluşturduktan sonra kartları hemen yazdırın ya da PDF olarak kaydedin. Kodu kaybolan öğrenci için yeni kod üretebilirsiniz; eski
          kod ve o kodla açılmış oturumlar geçersiz olur.
        </p>
      </div>
      <CodesIssuer slug={slug} classId={classId} loginUrl={loginUrl} />
    </div>
  );
}
