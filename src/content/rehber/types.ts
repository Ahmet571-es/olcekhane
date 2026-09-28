export type GuideCategory = 'kisilik' | 'ogrenme' | 'meslek' | 'iyi-olus' | 'olcme';

export const GUIDE_CATEGORIES: Record<GuideCategory, string> = {
  kisilik: 'Kişilik',
  ogrenme: 'Öğrenme ve ders çalışma',
  meslek: 'İlgi ve meslek seçimi',
  'iyi-olus': 'İyi oluş',
  olcme: 'Testler ve ölçme',
};

export interface GuideSource {
  /** APA biçiminde künye. */
  text: string;
  url?: string;
}

export interface Guide {
  slug: string;
  /** Sayfadaki ana başlık (H1). */
  title: string;
  /** Arama sonuçlarındaki başlık; verilmezse title kullanılır. */
  metaTitle?: string;
  /** Arama sonuçlarındaki açıklama (en fazla ~155 karakter). */
  description: string;
  category: GuideCategory;
  /** "Kısaca" kutusunda gösterilen 3–4 ana fikir. */
  keyPoints: string[];
  /** Markdown gövde. Başlıklar ## ile başlar; ilk düzey başlık kullanılmaz. */
  body: string;
  sources: GuideSource[];
  /** İlgili testlerin kısa adları (slug). */
  relatedTests?: string[];
  publishedAt: string;
  updatedAt: string;
  /** src/content/experts.ts içindeki uzman kısa adı. Boşsa yazar "Ölçekhane Editörlüğü" görünür. */
  authorSlug?: string;
  reviewerSlug?: string;
  /** Sağlıkla ilgili konularda sayfanın sonunda uyarı gösterilir. */
  healthNotice?: boolean;
}
