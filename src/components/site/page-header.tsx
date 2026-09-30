/**
 * Tanıtım sayfalarının başlığı. Sağ üstte tayf renginde, yavaşça nefes alan bir şekil durur (yalnızca süs;
 * ekran okuyuculardan gizli).
 */
export function PageHeader({
  title,
  lede,
  kicker,
  children,
}: {
  title: string;
  lede?: React.ReactNode;
  kicker?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-rule">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="sayfa-sekil" />
      </div>
      <div className="container-page relative flex flex-col gap-5 py-16 md:py-24">
        {kicker && <p className="kicker">{kicker}</p>}
        <h1 className="t-section max-w-4xl">{title}</h1>
        {lede && <p className="t-lede measure">{lede}</p>}
        {children}
      </div>
    </header>
  );
}

/** İki sütunlu içerik bölümü: solda başlık, sağda metin. */
export function Section({
  id,
  title,
  intro,
  children,
  className = '',
}: {
  id?: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-baslik` : undefined} className={`scroll-mt-24 ${className}`}>
      <div className="container-page grid gap-8 py-14 md:py-16 lg:grid-cols-[1fr_1.7fr] lg:gap-14" data-reveal>
        <div className="flex flex-col gap-3">
          <h2 id={id ? `${id}-baslik` : undefined} className="t-h2">
            {title}
          </h2>
          {intro && <p className="text-ink-2">{intro}</p>}
        </div>
        <div className="flex min-w-0 flex-col gap-5">{children}</div>
      </div>
    </section>
  );
}
