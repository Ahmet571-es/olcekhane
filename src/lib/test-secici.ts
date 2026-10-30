import { SECICI_GOALS, SECICI_MAX_TESTS, type GoalKey, type SeciciGoal } from '@/content/test-secici';
import { ADULT_GRADE, ADULT_PARAM, gradeAllowed } from '@/lib/config';

/**
 * "Hangi test bana uygun?" önerisinin hesabı (content/test-secici.ts). Sayfa bütün testlerin maddelerini tarayıcıya
 * göndermesin diye hesap yalnızca testlerin adı, süresi ve sınıf aralığıyla yapılır (`SeciciTest`; sunucu hazırlar).
 * Saf bir işlevdir: aynı seçimler hep aynı öneriyi verir.
 */

export interface SeciciTest {
  slug: string;
  name: string;
  minutes: number;
  minGrade: number;
  maxGrade: number;
  adults: boolean;
}

export interface SeciciPick {
  test: SeciciTest;
  goal: GoalKey;
  skill: string;
  why: string;
}

export interface SeciciResult {
  picks: SeciciPick[];
  /** Önerilen testlerin toplam süresi (dakika). */
  minutes: number;
  /** İlk test tek başına seçilen süreyi aşıyorsa (daha kısa uygun test yoksa) true. */
  overBudget: boolean;
  /** Seçilen amaçlardan bu sınıfa uygun hiçbir testi olmayanlar. */
  missing: GoalKey[];
  /** Süreye sığmadığı için önerilemeyen uygun bir test var mı (daha çok vakit seçilirse önerilir). */
  moreWithTime: boolean;
  /** Seçilen alanlarda önerilmeyen başka uygun testler var mı (Testler sayfasında bulunur). */
  more: boolean;
}

/**
 * Seçilen amaçların yuvaları sırayla dolaşılır: önce her amacın ilk yuvası, sonra ikincisi... Her yuvada, daha önce
 * seçilmemiş, sınıfa uygun ve kalan süreye sığan ilk aday seçilir. Hiçbir test sığmazsa en kısa uygun test önerilir
 * (`overBudget`). En çok `SECICI_MAX_TESTS` test.
 */
export function recommend(catalog: SeciciTest[], goals: GoalKey[], grade: number, budget: number): SeciciResult {
  const bySlug = new Map(catalog.map((t) => [t.slug, t]));
  const chosen = SECICI_GOALS.filter((g) => goals.includes(g.key));
  const ok = (slug: string) => {
    const t = bySlug.get(slug);
    return t && gradeAllowed(t, grade) ? t : undefined;
  };
  const eligible = (g: SeciciGoal) => g.slots.flatMap((s) => s.candidates.map(ok).filter((t): t is SeciciTest => !!t));
  const missing = chosen.filter((g) => eligible(g).length === 0).map((g) => g.key);

  const picks: SeciciPick[] = [];
  const used = new Set<string>();
  let left = budget;
  let moreWithTime = false;
  const rounds = Math.max(0, ...chosen.map((g) => g.slots.length));
  for (let r = 0; r < rounds; r++) {
    for (const g of chosen) {
      const slot = g.slots[r];
      if (!slot || picks.length >= SECICI_MAX_TESTS) continue;
      const options = slot.candidates.map(ok).filter((t): t is SeciciTest => !!t && !used.has(t.slug));
      if (options.length === 0) continue;
      const fit = options.find((t) => t.minutes <= left);
      if (!fit) {
        moreWithTime = true;
        continue;
      }
      picks.push({ test: fit, goal: g.key, skill: slot.skill, why: slot.why });
      used.add(fit.slug);
      left -= fit.minutes;
    }
  }
  // Hiçbir test sığmadıysa: amaçların ilk uygun yuvasındaki en kısa test.
  let overBudget = false;
  if (picks.length === 0) {
    for (const g of chosen) {
      for (const slot of g.slots) {
        const options = slot.candidates.map(ok).filter((t): t is SeciciTest => !!t);
        if (options.length === 0) continue;
        const shortest = options.reduce((a, b) => (b.minutes < a.minutes ? b : a));
        picks.push({ test: shortest, goal: g.key, skill: slot.skill, why: slot.why });
        overBudget = shortest.minutes > budget;
        break;
      }
      if (picks.length) break;
    }
    moreWithTime = false;
  }
  const more = chosen.some((g) => eligible(g).some((t) => !picks.some((p) => p.test.slug === t.slug)));
  return {
    picks,
    minutes: picks.reduce((a, p) => a + p.test.minutes, 0),
    overBudget,
    missing,
    moreWithTime: moreWithTime && picks.length < SECICI_MAX_TESTS,
    more,
  };
}

/** Paket önerilir mi: "Hepsinden biraz" ya da paketin alanlarından en az ikisi seçilmiş ve vakit en az bir saat. */
export const PACKAGE_GOALS: GoalKey[] = ['kisilik', 'ilgi', 'calisma', 'zihinsel'];
export const suggestPackage = (goals: GoalKey[], budget: number) =>
  budget >= 60 && (goals.includes('genel') || goals.filter((g) => PACKAGE_GOALS.includes(g)).length >= 2);

/** Çözme sayfasının adresi: sınıf ya da yetişkin seçili açılır. */
export const solvePath = (slug: string, grade: number) => `/testler/${slug}/coz?sinif=${grade === ADULT_GRADE ? ADULT_PARAM : grade}`;
