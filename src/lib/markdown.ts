import MarkdownIt from 'markdown-it';

/** Ham HTML kapalı: metindeki olası HTML etiketleri kaçışlanır. */
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

export function renderMarkdown(src: string): string {
  return md.render(src);
}
