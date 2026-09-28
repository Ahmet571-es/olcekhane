import { Fragment } from 'react';

/**
 * Soru metinlerindeki matematik gösterimi.
 * - {3/4} kesri, {1 3/4} tam sayılı kesri alt alta yazılmış kesir olarak gösterir.
 * - Üçerli gruplanmış sayılar (ör. "102 045") satır sonunda bölünmesin diye dar boşlukla birleştirilir.
 * Ekran okuyucular için kesirler "3 bölü 4" biçiminde okunur.
 */

const TOKEN = /\{(?:(\d+) )?(\d+)\/(\d+)\}/g;
const GROUPED = /\b\d{1,3}(?: \d{3})+\b/g;

/** Üçerli gruplanmış sayılardaki boşlukları bölünmeyen dar boşlukla değiştirir. */
export function groupDigits(s: string): string {
  return s.replace(GROUPED, (m) => m.replace(/ /g, ' '));
}

/** Metni düz yazıya çevirir (ör. aria-label ve özetler için): {3/4} → "3/4", {1 3/4} → "1 tam 3/4". */
export function plainMath(s: string): string {
  return groupDigits(s.replace(TOKEN, (_m, whole: string | undefined, num: string, den: string) => (whole ? `${whole} tam ${num}/${den}` : `${num}/${den}`)));
}

function Fraction({ whole, num, den }: { whole?: string; num: string; den: string }) {
  return (
    <span className="frac">
      {whole && <span className="frac-whole">{whole}</span>}
      <span className="frac-stack" aria-hidden="true">
        <span className="frac-num">{num}</span>
        <span className="frac-den">{den}</span>
      </span>
      <span className="sr-only">
        {whole ? `${whole} tam ` : ''}
        {num} bölü {den}
      </span>
    </span>
  );
}

export function MathText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(<Fragment key={i++}>{groupDigits(text.slice(last, at))}</Fragment>);
    parts.push(<Fraction key={i++} whole={m[1]} num={m[2]} den={m[3]} />);
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{groupDigits(text.slice(last))}</Fragment>);
  return <>{parts}</>;
}
