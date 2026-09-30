export const SITE_NAME = 'Ölçekhane';
export const SITE_TAGLINE = 'Öğrenciler için bilimsel kişilik, ilgi ve öğrenme testleri';
export const SITE_DESCRIPTION =
  'Ölçekhane, öğrencilerin kişiliğini, ilgi alanlarını ve öğrenme becerilerini araştırmalarla desteklenmiş ölçeklerle inceler; sonuçları öğrenciye ve veliye ayrı ayrı, sade bir dille anlatır.';

export function siteUrl(path = ''): string {
  const base = (process.env.APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${path}`;
}

export const GRADE_LABELS: Record<number, string> = {
  1: '1. sınıf', 2: '2. sınıf', 3: '3. sınıf', 4: '4. sınıf', 5: '5. sınıf', 6: '6. sınıf',
  7: '7. sınıf', 8: '8. sınıf', 9: '9. sınıf', 10: '10. sınıf', 11: '11. sınıf', 12: '12. sınıf',
  13: 'Mezun / üniversiteye hazırlık',
};

export function gradeRangeLabel(min: number, max: number): string {
  if (min === max) return min === 13 ? 'mezun' : `${min}. sınıf`;
  const a = min === 13 ? 'mezun' : `${min}.`;
  if (max >= 13) return `${a} sınıf ve üzeri`;
  return `${a}–${max}. sınıf`;
}

export const DOMAIN_LABELS: Record<string, string> = {
  personality: 'Kişilik',
  career: 'İlgi ve meslek',
  academic: 'Öğrenme ve akademik beceriler',
  cognitive: 'Bilişsel beceriler',
  wellbeing: 'İyi oluş',
  skills: 'Sosyal-duygusal beceriler',
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Yayında',
  pilot: 'Pilot',
  draft: 'Hazırlanıyor',
  review: 'Uzman incelemesinde',
  retired: 'Kullanımdan kalktı',
};
