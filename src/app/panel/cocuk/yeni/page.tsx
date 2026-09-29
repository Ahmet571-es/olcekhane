import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAccountsOpen, requireUser } from '@/lib/auth/dal';
import { currentDocument } from '@/lib/consent';
import { renderMarkdown } from '@/lib/markdown';
import { fillCompany } from '@/lib/site';
import { ChildForm } from './child-form';

export const metadata: Metadata = { title: 'Çocuk profili oluştur' };

export default async function NewChildPage() {
  requireAccountsOpen();
  await requireUser('/panel/cocuk/yeni');
  const [assessment, research] = await Promise.all([
    currentDocument('consent_assessment'),
    currentDocument('consent_research'),
  ]);
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <Link href="/panel" className="t-small">
          Çocuklarım
        </Link>
        <h1 className="t-h1 mt-2">Çocuk profili oluştur</h1>
        <p className="measure mt-2 text-ink-2">
          Yalnızca raporlar ve yaşa uygun testler için gereken bilgileri istiyoruz. Çocuğunuzun e-posta adresine ya da kimlik numarasına
          ihtiyacımız yok.
        </p>
      </div>
      <ChildForm
        assessmentHtml={renderMarkdown(fillCompany(assessment.bodyMd))}
        assessmentTitle={assessment.title}
        researchHtml={renderMarkdown(fillCompany(research.bodyMd))}
        researchTitle={research.title}
      />
    </div>
  );
}
