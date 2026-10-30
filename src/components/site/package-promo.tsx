import Link from 'next/link';
import { PACKAGE_NAME, PACKAGE_PATH } from '@/content/paket';

/** Kendini Tanı Paketi'nin tanıtım kutusu (Testler sayfası ve paketin açık olduğu yaş grubu sayfaları). */
export function PackagePromo({ className = '' }: { className?: string }) {
  return (
    <aside aria-labelledby="paket-tanitim" className={`panel flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7 ${className}`}>
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="kicker">Yaklaşık bir saat · tek rapor</p>
        <h2 id="paket-tanitim" className="t-h3">
          Hepsi bir arada: {PACKAGE_NAME}
        </h2>
        <p className="text-ink-2">
          Kişilik, ilgi alanları, çalışma alışkanlıkları ve dört zihinsel beceri testi art arda. Sonunda kısa bir özet, her testin raporu ve tek PDF.
        </p>
      </div>
      <Link href={PACKAGE_PATH} className="btn btn-primary shrink-0 self-start md:self-auto">
        Pakete göz at
      </Link>
    </aside>
  );
}
