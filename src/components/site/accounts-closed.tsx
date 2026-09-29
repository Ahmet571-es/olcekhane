import Link from 'next/link';

/**
 * Hesaplar kapalıyken (hızlı test modu) kayıt, öğrenci girişi, okul daveti gibi sayfaların yerine
 * gösterilir. Ziyaretçiyi hesap gerektirmeyen hızlı teste yönlendirir.
 */
export function AccountsClosed({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-[34rem] flex-col gap-5">
      <h1 className="t-h1">{title}</h1>
      <p className="t-lede">
        Veli, okul ve öğrenci hesapları şu an kapalı. Testleri hesap açmadan ve ücretsiz çözebilirsiniz: ad, e-posta ya da telefon
        istemiyoruz, cevaplarınız hiçbir yere kaydedilmez.
      </p>
      {children}
      <div className="flex flex-wrap gap-3">
        <Link href="/testler" className="btn btn-primary btn-lg">
          Ücretsiz test çöz
        </Link>
        <Link href="/okullar-icin" className="btn btn-secondary btn-lg">
          Okullar için
        </Link>
      </div>
    </div>
  );
}
