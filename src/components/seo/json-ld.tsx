/** Yapılandırılmış veri (schema.org) betiği. "<" karakteri kaçışlanır; içerik kullanıcıdan gelmez. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
