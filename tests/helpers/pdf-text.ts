import { inflateSync } from 'node:zlib';

/**
 * Sitenin PDF'lerinden (react-pdf, pdfkit) yazıyı çıkarır: yalnızca testler için. Gömülü yazı tipleri (Type0, Identity-H)
 * `ToUnicode` tablosuyla, basit yazı tipleri latin1 ile çözülür. Satır ve boşluk düzeni korunmaz: karşılaştırmada boşluklar
 * atılır (`pdfFlat`).
 */
interface PdfObject {
  dict: string;
  data?: Buffer;
}

function objectsOf(pdf: Buffer): Map<number, PdfObject> {
  const src = pdf.toString('latin1');
  const out = new Map<number, PdfObject>();
  const head = /(\d+) 0 obj\s*/g;
  for (let m = head.exec(src); m; m = head.exec(src)) {
    const start = m.index + m[0].length;
    const end = src.indexOf('endobj', start);
    const s = src.indexOf('stream', start);
    if (s >= 0 && s < end) {
      const dict = src.slice(start, s);
      const length = Number(/\/Length (\d+)/.exec(dict)?.[1] ?? 0);
      const at = s + 'stream'.length + (src[s + 6] === '\r' ? 2 : 1);
      const raw = pdf.subarray(at, at + length);
      out.set(Number(m[1]), { dict, data: /\/FlateDecode/.test(dict) ? inflateSync(raw) : raw });
      head.lastIndex = at + length;
    } else out.set(Number(m[1]), { dict: src.slice(start, end) });
  }
  return out;
}

const utf16 = (hex: string) => {
  let s = '';
  for (let i = 0; i + 4 <= hex.length; i += 4) s += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
  return s;
};

function cmapOf(text: string): Map<number, string> {
  const map = new Map<number, string>();
  for (const block of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g))
    for (const m of block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) map.set(parseInt(m[1], 16), utf16(m[2]));
  for (const block of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g))
    for (const m of block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(<[0-9a-fA-F]+>|\[[^\]]*\])/g)) {
      const lo = parseInt(m[1], 16);
      const hi = parseInt(m[2], 16);
      if (m[3].startsWith('[')) [...m[3].matchAll(/<([0-9a-fA-F]+)>/g)].forEach((x, i) => map.set(lo + i, utf16(x[1])));
      else {
        const base = m[3].slice(1, -1);
        for (let c = lo; c <= hi; c++) map.set(c, utf16((parseInt(base, 16) + c - lo).toString(16).padStart(base.length, '0')));
      }
    }
  return map;
}

const ref = (dict: string, key: string) => Number(new RegExp(`/${key} (\\d+) 0 R`).exec(dict)?.[1] ?? NaN);

/** Kaçışlı yazı dizisi: "(…)" içi. */
const literal = (s: string) =>
  s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (_, e: string) =>
    /^[0-7]/.test(e) ? String.fromCharCode(parseInt(e, 8)) : ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' } as Record<string, string>)[e] ?? e,
  );

/** PDF'teki bütün yazılar, sayfa sırasıyla. */
export function pdfText(pdf: Buffer): string {
  const objs = objectsOf(pdf);
  const fontCache = new Map<number, Map<number, string> | null>();
  const fontOf = (n: number) => {
    if (!fontCache.has(n)) {
      const to = ref(objs.get(n)?.dict ?? '', 'ToUnicode');
      const data = objs.get(to)?.data;
      fontCache.set(n, data ? cmapOf(data.toString('latin1')) : null);
    }
    return fontCache.get(n)!;
  };
  const out: string[] = [];
  const pages = [...objs.values()].filter((o) => /\/Type \/Page\b/.test(o.dict));
  for (const page of pages) {
    const resDict = objs.get(ref(page.dict, 'Resources'))?.dict ?? page.dict;
    const fontBlock = /\/Font\s*<<([\s\S]*?)>>/.exec(resDict)?.[1] ?? '';
    const fonts = new Map([...fontBlock.matchAll(/\/(\S+) (\d+) 0 R/g)].map((m) => [m[1], Number(m[2])]));
    const contents = /\/Contents \[([^\]]*)\]/.exec(page.dict)?.[1] ?? /\/Contents (\d+ 0 R)/.exec(page.dict)?.[1] ?? '';
    for (const c of contents.matchAll(/(\d+) 0 R/g)) {
      const stream = objs.get(Number(c[1]))?.data?.toString('latin1') ?? '';
      let cmap: Map<number, string> | null = null;
      const show = (part: string) => {
        if (part.startsWith('<')) {
          const hex = part.slice(1, -1);
          if (cmap) for (let i = 0; i + 4 <= hex.length; i += 4) out.push(cmap.get(parseInt(hex.slice(i, i + 4), 16)) ?? '');
          else for (let i = 0; i + 2 <= hex.length; i += 2) out.push(String.fromCharCode(parseInt(hex.slice(i, i + 2), 16)));
        } else out.push(literal(part.slice(1, -1)));
      };
      const ops = /\/(\S+)\s+[-\d.]+\s+Tf|\[((?:<[0-9a-fA-F]*>|\((?:[^)\\]|\\.)*\)|[-\d.\s])*)\]\s*TJ|(<[0-9a-fA-F]*>|\((?:[^)\\]|\\.)*\))\s*Tj|\b(ET|Td|TD|Tm|T\*)\b/g;
      for (const m of stream.matchAll(ops)) {
        if (m[1] !== undefined) {
          const f = fonts.get(m[1]);
          cmap = f === undefined ? null : fontOf(f);
        } else if (m[2] !== undefined) for (const p of m[2].matchAll(/<[0-9a-fA-F]*>|\((?:[^)\\]|\\.)*\)/g)) show(p[0]);
        else if (m[3] !== undefined) show(m[3]);
        else out.push(' ');
      }
    }
    out.push('\n');
  }
  return out.join('');
}

/** Boşlukları atılmış yazı: satır bölünmeleri ve yazı parçalarının sınırları karşılaştırmayı bozmasın. */
export const pdfFlat = (s: string) => s.replace(/\s+/g, '');
