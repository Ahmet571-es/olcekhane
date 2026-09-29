import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GRADE_LABELS } from '@/lib/config';
import { requireClass, requireOrg } from '@/lib/school/access';
import { ImportForm } from './import-form';

export default async function ImportPage(props: PageProps<'/okul/[slug]/sinif/[classId]/aktar'>) {
  const { slug, classId } = await props.params;
  const ctx = await requireOrg(slug);
  if (!ctx.can.manageClasses) redirect(`/okul/${slug}`);
  const cls = await requireClass(ctx, classId);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href={`/okul/${slug}/sinif/${classId}`} className="t-small">
        {cls.name}
      </Link>
      <h1 className="t-h1">Öğrenci listesini aktar</h1>
      <div className="flex flex-col gap-3 text-ink-2">
        <p>
          Listeyi Excel, e-Okul çıktısı ya da Google E-Tablolar’dan kopyalayıp aşağıdaki kutuya yapıştırın. Her satır bir öğrenci olmalı. Öğrenciler{' '}
          {GRADE_LABELS[cls.grade]} olarak kaydedilir.
        </p>
        <ul className="list-disc pl-5">
          <li>
            Sütunlar: <strong className="text-ink">ad, soyad, okul numarası, veli e-postası</strong>. Okul numarası ve veli e-postası isteğe bağlıdır;
            sütun sırası önemli değildir. e-Okul listelerindeki sıra numarası, cinsiyet ve şube sütunları yok sayılır.
          </li>
          <li>Veli e-postası, onay bağlantısı göndermek için kullanılır. Onay çevrim içi alınmadan öğrenci test çözemez.</li>
          <li>Aynı listeyi yeniden aktarırsanız öğrenciler tekrar eklenmez; okul numarası ya da ad-soyad ile eşleştirilip güncellenir.</li>
          <li>Öğrencinin e-posta adresi, telefonu ya da T.C. kimlik numarası istenmez; lütfen eklemeyin.</li>
        </ul>
      </div>
      <ImportForm slug={slug} classId={classId} />
    </div>
  );
}
