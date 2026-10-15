/** Üç boyutlu modelin kaynağı ve lisansı (CC BY 4.0 atıf koşulu) ile modelin sınırları. */
export function ModelNotu({ kisa = false }: { kisa?: boolean }) {
  return (
    <section aria-labelledby="model-hakkinda" className="beyin-kutu measure flex flex-col gap-2 text-[0.95rem]">
      <h2 id="model-hakkinda" className="font-bold">
        Üç boyutlu model hakkında
      </h2>
      <p className="text-ink-2">
        Model: BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International (Japonya Yaşam Bilimleri
        Veri Merkezi;{' '}
        <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noopener noreferrer">
          kaynak
        </a>
        ,{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/deed.tr" target="_blank" rel="noopener noreferrer">
          lisans
        </a>
        ). Yalnızca beyin, beyincik çadırı, damarlar, kafatası ve yüz kemikleri, dil kemiği, omurlar (sağrı kemiği dahil) ve omurlar arası
        diskler alındı; eksenleri ve merkezi değiştirildi, dosyalar sitede hızlı açılsın diye sıkıştırıldı. Modelde beyincik çadırının
        yalnızca sağ yarısı gerçek veriden gelir; sol yarısı onun aynalanmış kopyasıdır ve beyinciğin üstünde kalsın diye yer yer birkaç
        milimetre yukarı alınmıştır. Türkçe adlar, renkler ve açıklamalar Ölçekhane’nindir.
      </p>
      {!kisa && (
        <p className="text-ink-2">
          Model, yetişkin bir erkeğin üç boyutlu bütün vücut modelinden alınmış bir başvuru modelidir (Mitsuhashi ve ark., 2009). Her beyin
          biraz farklıdır; kıvrımların biçimi kişiden kişiye değişir. Bu sayfalar eğitim içindir, tanı ya da tedavi için kullanılmaz.
        </p>
      )}
      <p className="t-meta">
        Mitsuhashi, N., Fujieda, K., Tamura, T., Kawamoto, S., Takagi, T., & Okubo, K. (2009). BodyParts3D: 3D structure database for
        anatomical concepts. Nucleic Acids Research, 37(Database issue), D782–D785.{' '}
        <a href="https://doi.org/10.1093/nar/gkn613" target="_blank" rel="noopener noreferrer" className="break-all">
          doi.org/10.1093/nar/gkn613
        </a>
      </p>
    </section>
  );
}
