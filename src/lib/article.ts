import MarkdownIt from 'markdown-it';

/**
 * Rehber yazıları için Markdown işleyici: ham HTML kapalı, başlıklara Türkçe karakterlerden
 * arındırılmış kimlik (id) eklenir ve içindekiler listesi çıkarılır; dış bağlantılar yeni sekmede açılır.
 */

export function slugifyTr(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

md.core.ruler.push('heading_ids', (state) => {
  const used = new Map<string, number>();
  const tokens = state.tokens;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== 'heading_open' || (t.tag !== 'h2' && t.tag !== 'h3')) continue;
    const inline = tokens[i + 1];
    const text = inline?.children?.map((c) => c.content).join('') ?? inline?.content ?? '';
    let id = slugifyTr(text) || 'bolum';
    const n = used.get(id) ?? 0;
    used.set(id, n + 1);
    if (n > 0) id = `${id}-${n + 1}`;
    t.attrSet('id', id);
    t.meta = { ...(t.meta ?? {}), text };
  }
});

const defaultLinkOpen =
  md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = String(tokens[idx].attrGet('href') ?? '');
  if (/^https?:\/\//.test(href)) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

export interface TocItem {
  id: string;
  text: string;
}

export function renderArticle(src: string): { html: string; toc: TocItem[] } {
  const env = {};
  const tokens = md.parse(src, env);
  const toc: TocItem[] = tokens
    .filter((t) => t.type === 'heading_open' && t.tag === 'h2')
    .map((t) => ({ id: String(t.attrGet('id') ?? ''), text: (t.meta as { text?: string } | null)?.text ?? '' }));
  return { html: md.renderer.render(tokens, md.options, env), toc };
}

/** Türkçe metinde yaklaşık okuma süresi (dakikada ~180 kelime). */
export function readingMinutes(src: string): number {
  const words = src.replace(/[#*_>`\[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
