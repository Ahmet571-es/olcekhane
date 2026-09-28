/**
 * Uzman kadrosu: rehber yazılarının yazarları ve hakemleri, bilim kurulu üyeleri.
 *
 * Google'ın sağlık ve psikoloji içeriklerinde aradığı "uzmanlık ve güvenilirlik" sinyalleri için
 * gerçek kişilerin adı, unvanı ve kısa özgeçmişi burada yer almalıdır. Liste boşken uzman
 * bölümleri sitede gösterilmez. Uydurma ya da temsilî uzman eklemeyin.
 *
 * Örnek:
 * {
 *   slug: 'ayse-demir',
 *   fullName: 'Dr. Ayşe Demir',
 *   title: 'Uzman Klinik Psikolog',
 *   role: 'Bilim kurulu üyesi',
 *   bio: 'Çocuk ve ergen ruh sağlığı alanında 12 yıldır çalışıyor...',
 *   credentials: ['Hacettepe Üniversitesi, Klinik Psikoloji Doktora (2014)'],
 *   links: [{ label: 'Akademik profil', url: 'https://...' }],
 * }
 */
export interface Expert {
  slug: string;
  fullName: string;
  title: string;
  role: string;
  bio: string;
  credentials: string[];
  links?: { label: string; url: string }[];
}

export const EXPERTS: Expert[] = [];

export function expertBySlug(slug: string | undefined): Expert | undefined {
  return slug ? EXPERTS.find((e) => e.slug === slug) : undefined;
}
