export const SITE_NAME = 'Ölçekhane';
export const SITE_TAGLINE = 'Öğrenciler için bilimsel kişilik, ilgi ve öğrenme testleri';
export const SITE_DESCRIPTION =
  'Ölçekhane, öğrencilerin kişiliğini, ilgi alanlarını ve öğrenme becerilerini araştırmalarla desteklenmiş ölçeklerle inceler; sonuçları öğrenciye ve veliye ayrı ayrı, sade bir dille anlatır.';

export function siteUrl(path = ''): string {
  const base = (process.env.APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${path}`;
}

/**
 * Testi kendisi için çözen yetişkin (18 yaş ve üzeri): sınıf yerine bu değer seçilir. Yalnızca yetişkinlere de
 * uygun testlerde (`adults: true`) seçilebilir; yetişkine öğrenci ve veli raporu yerine tek, kişisel rapor hazırlanır.
 */
export const ADULT_GRADE = 14;
/** Çözme sayfasının adresinde yetişkin seçimi (`?sinif=yetiskin`). */
export const ADULT_PARAM = 'yetiskin';

export const GRADE_LABELS: Record<number, string> = {
  1: '1. sınıf', 2: '2. sınıf', 3: '3. sınıf', 4: '4. sınıf', 5: '5. sınıf', 6: '6. sınıf',
  7: '7. sınıf', 8: '8. sınıf', 9: '9. sınıf', 10: '10. sınıf', 11: '11. sınıf', 12: '12. sınıf',
  13: 'Mezun / üniversiteye hazırlık',
  [ADULT_GRADE]: 'Yetişkin',
};

/** Testin kimlere uygun olduğu: "6. sınıf ve üzeri", "5–8. sınıf", yetişkinlere de uygunsa "9. sınıftan yetişkinlere". */
export function gradeRangeLabel(min: number, max: number, adults = false): string {
  if (adults && max >= 13) return min === 13 ? 'mezunlar ve yetişkinler' : `${min}. sınıftan yetişkinlere`;
  if (min === max) return min === 13 ? 'mezun' : `${min}. sınıf`;
  const a = min === 13 ? 'mezun' : `${min}.`;
  if (max >= 13) return `${a} sınıf ve üzeri`;
  return `${a}–${max}. sınıf`;
}

/**
 * Çözme sayfasının adresindeki seçim (`?sinif=`): 1–13 arası bir sınıf düzeyi ya da `yetiskin`. Başka her değer
 * (ör. "14", "9.0", " 9") seçim yapılmamış sayılır.
 */
export function parseGradeParam(value: string | undefined): number | null {
  if (value === ADULT_PARAM) return ADULT_GRADE;
  return value !== undefined && /^(?:[1-9]|1[0-3])$/.test(value) ? Number(value) : null;
}

/** Test bu sınıf düzeyinde ya da (yetişkinlere de uygunsa) bir yetişkin tarafından çözülebilir mi? */
export function gradeAllowed(t: { minGrade: number; maxGrade: number; adults?: boolean }, grade: number): boolean {
  if (grade === ADULT_GRADE) return !!t.adults;
  return Number.isInteger(grade) && grade >= t.minGrade && grade <= t.maxGrade;
}

/**
 * Rapor türleri. Okul çağındaki biri için iki rapor hazırlanır: öğrenciye ikinci tekil şahısla, veliye çocuğunu
 * anlatarak. Yetişkine tek, kişisel rapor hazırlanır (ikinci tekil şahısla).
 */
export const AUDIENCE_LABELS = {
  student: { name: 'Öğrenci raporu', file: 'ogrenci' },
  parent: { name: 'Veli raporu', file: 'veli' },
  adult: { name: 'Kişisel rapor', file: 'kisisel' },
} as const;

export const DOMAIN_LABELS: Record<string, string> = {
  personality: 'Kişilik',
  career: 'İlgi ve meslek',
  academic: 'Öğrenme ve akademik beceriler',
  reading: 'Okuma',
  cognitive: 'Zekâ ve zihinsel beceriler',
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
