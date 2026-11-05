import type { CSSProperties } from 'react';

/**
 * Ana sayfadaki "sözümüz": sitenin üç kalıcı vaadi, büyük yazıyla. Kaydırdıkça kelimeler sırayla solgundan koyuya
 * dolar (okuma hızında bir ilerleme; components/site/site-effects, [data-soz] → --p). JS yokken ya da hareket
 * azaltılmışken bütün kelimeler baştan koyudur. Metin sitenin başka yerlerinde söylediklerinin aynısıdır: tanı koymaz,
 * hesap ve kayıt yoktur, rapor iki kişiye ayrı yazılır.
 */

const LINES = ['Tanı koymaz, tanımaya yardım eder.', 'Hesap açtırmaz, cevap saklamaz.', 'Her sonucu iki dilde anlatır: öğrenciye ve veliye.'];

export function Manifesto() {
  const words = LINES.map((l) => l.split(' '));
  const total = words.reduce((n, w) => n + w.length, 0);
  let i = 0;
  return (
    <section className="container-page py-20 md:py-32" aria-labelledby="soz-baslik" data-soz style={{ '--n': total } as CSSProperties}>
      <h2 id="soz-baslik" className="sr-only">
        Sözümüz
      </h2>
      <p className="soz mx-auto max-w-[24ch] text-center">
        {words.map((line, li) => (
          <span key={li} className="block">
            {line.map((w) => {
              const k = i++;
              return (
                <span key={k} className="soz-kelime" style={{ '--w': k } as CSSProperties}>
                  {w}{' '}
                </span>
              );
            })}
          </span>
        ))}
      </p>
    </section>
  );
}
