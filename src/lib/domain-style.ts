/**
 * Ölçüm alanlarının tanıtım sayfalarındaki vurgu rengi (globals.css: --dim-*). Renk yalnızca alanı
 * tanıtır; puanlarla ya da iyi/kötü anlamıyla ilgisi yoktur.
 */
export const DOMAIN_COLOR: Record<string, string> = {
  personality: 'var(--dim-int)',
  career: 'var(--dim-ext)',
  academic: 'var(--dim-con)',
  cognitive: 'var(--dim-emo)',
  wellbeing: 'var(--dim-agr)',
  skills: 'var(--dim-agr)',
};

export function domainColor(domain: string): string {
  return DOMAIN_COLOR[domain] ?? 'var(--ink)';
}
