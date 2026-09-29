import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentAcademicYear, requireOrg } from '@/lib/school/access';
import { NewClassForm } from './new-class-form';

export default async function NewClassPage(props: PageProps<'/okul/[slug]/sinif/yeni'>) {
  const { slug } = await props.params;
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) redirect(`/okul/${slug}`);
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link href={`/okul/${slug}`} className="t-small">
        Sınıflar
      </Link>
      <h1 className="t-h1">Sınıf ekle</h1>
      <NewClassForm slug={slug} year={currentAcademicYear()} />
    </div>
  );
}
