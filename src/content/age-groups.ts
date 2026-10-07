import { publicInstruments } from '@/content/instruments';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { InstrumentDef } from '@/lib/instruments/types';

/**
 * Yaş grupları: siteye gelen kişi önce kim olduğunu seçer, testler o gruba göre bölüm bölüm listelenir. Her sınıf
 * düzeyi tam olarak bir gruptadır (tests/age-groups.test.ts). Seçim hiçbir yere kaydedilmez; grup yalnızca hangi
 * sayfanın açıldığıdır.
 */
export type AgeGroupKey = 'ilkokul' | 'ortaokul' | 'lise' | 'yetiskin';

export interface AgeGroup {
  key: AgeGroupKey;
  /** Sayfanın adresi. */
  path: string;
  name: string;
  /** Kimler için, kısaca: "3. ve 4. sınıf". */
  range: string;
  /** Cümle içinde kimlere uygun olduğu: "Burada … uygun 3 test var." */
  forWhom: string;
  /** Gruptaki sınıf düzeyleri (1–12, 13: mezun) ya da yetişkin (ADULT_GRADE). */
  grades: number[];
  /** Grubu tanıtan renk (globals.css: --dim-*); puanla ya da iyi/kötü anlamıyla ilgisi yoktur. */
  color: string;
  /** Sayfanın giriş cümlesi. */
  lede: string;
  /** Veliye kısa not (yetişkin grubunda yok). */
  parentNote?: string;
  /**
   * İlk kez gelenlere önerilen testler, sırayla. Yalnızca yayındakiler gösterilir: incelemedeki bir test onaylanınca
   * kendiliğinden görünür.
   */
  starters: { slug: string; why: string }[];
}

export const AGE_GROUPS: AgeGroup[] = [
  {
    key: 'ilkokul',
    path: '/ilkokul',
    name: 'İlkokul',
    range: '3. ve 4. sınıf',
    forWhom: '3. ve 4. sınıf öğrencilerine',
    grades: [3, 4],
    color: 'var(--dim-agr)',
    lede: '3. ve 4. sınıf öğrencilerine uygun testler. Bu yaşta testi bir yetişkinin yanında çözmek en iyisidir.',
    parentNote:
      'Yönergeleri çocuğunuzla birlikte okuyun, ama cevapları onun yerine vermeyin. Testi sakin bir yerde ve tek seferde bitirin. Raporda size ayrı yazılmış bir veli raporu da bulunur.',
    starters: [
      { slug: 'okuma-hizi-ve-anlama', why: 'Okuma hızını ve okuduğunu anlamayı birlikte gösterir; metin sınıfa göre seçilir.' },
      { slug: 'surekli-dikkat', why: 'Harf bulma görevi: dikkatin birkaç dakika boyunca nasıl sürdüğünü gösterir.' },
    ],
  },
  {
    key: 'ortaokul',
    path: '/ortaokul',
    name: 'Ortaokul',
    range: '5–8. sınıf',
    forWhom: 'ortaokul öğrencilerine',
    grades: [5, 6, 7, 8],
    color: 'var(--dim-con)',
    lede: '5, 6, 7 ve 8. sınıf öğrencilerine uygun testler. Kişilik, zihinsel beceriler, okuma, dersler ve ilgiler bölüm bölüm aşağıda.',
    parentNote:
      'Testi çocuğunuzla birlikte seçin; çözen o olsun. Raporda size ayrı yazılmış bir veli raporu da bulunur; raporu birlikte okumanızı öneririz.',
    starters: [
      { slug: 'oz-saygi', why: 'En kısa test: kendine genel bakışını yaklaşık 3 dakikada gösterir.' },
      { slug: 'calisma-aliskanliklari', why: 'Ders çalışırken hangi yöntemleri ne sıklıkla kullandığını gösterir.' },
      { slug: 'matematik-konu-tarama-testi', why: 'Bir önceki sınıfın matematik konularında neyin sağlam, neyin eksik olduğunu gösterir.' },
    ],
  },
  {
    key: 'lise',
    path: '/lise',
    name: 'Lise ve mezun',
    range: '9–12. sınıf ve mezunlar',
    forWhom: 'lise öğrencilerine ve mezunlara',
    grades: [9, 10, 11, 12, 13],
    color: 'var(--dim-int)',
    lede: 'Lise öğrencilerine ve liseden mezun olup üniversiteye hazırlananlara uygun testler. Alan ve meslek seçimine hazırlanırken kendini her yönüyle görmen için.',
    parentNote:
      'Raporda size ayrı yazılmış bir veli raporu da bulunur. Alan ve meslek seçimi gibi kararlarda raporu çocuğunuzla birlikte okuyup konuşmanızı öneririz.',
    starters: [
      { slug: 'mesleki-ilgi-profili', why: 'Alan ve meslek seçerken ilgilerini altı alanda, örnek mesleklerle gösterir.' },
      { slug: 'bes-faktor-kisilik', why: 'Kişiliğinin en çok araştırılmış beş boyutunu yaklaşık 8 dakikada gösterir.' },
      { slug: 'calisma-aliskanliklari', why: 'Sınavlara hazırlanırken hangi çalışma yöntemlerini kullandığını gösterir.' },
    ],
  },
  {
    key: 'yetiskin',
    path: '/yetiskin',
    name: 'Üniversite ve yetişkin',
    range: '18 yaş ve üzeri',
    forWhom: '18 yaşını doldurmuş herkese',
    grades: [ADULT_GRADE],
    color: 'var(--dim-ext)',
    lede: '18 yaşını doldurmuş ve testi kendisi için çözen herkese uygun testler. Yetişkinlere tek, kişisel bir rapor hazırlanır.',
    starters: [
      { slug: 'meslek-ilgi-alanlari', why: 'Meslek ve bölüm seçerken sekiz ilgi alanını sıralı olarak gösterir.' },
      { slug: 'ayrintili-kisilik-profili', why: 'Kişiliğin beş boyutunu ve alt özelliklerini ayrıntılı gösterir.' },
    ],
  },
];

/** Bölümlerin kısa tanıtımı (yaş grubu sayfalarında bölüm başlığının altında). */
export const AREA_INTROS: Record<string, string> = {
  personality: 'Nasıl biri olduğunu; insanlarla, işlerle ve duygularla nasıl ilişki kurduğunu anlatır.',
  career: 'Hangi etkinliklerden hoşlandığını ve bunlara uyan alanları, meslekleri gösterir.',
  academic: 'Okuma, ders konuları ve ders çalışma yöntemleri: neyin sağlam olduğunu, neyin geliştirilebileceğini gösterir.',
  cognitive:
    'Dikkat, bellek, hız ve algı gibi becerileri kısa görevlerle ölçer. Zekâ puanı (IQ) verilmez; her beceri ayrı ayrı anlatılır.',
  wellbeing: 'Kendini nasıl hissettiğini ve gündelik hayatta nelerin iyi geldiğini anlatır.',
  skills: 'Duyguları anlama, ilişkiler ve iş birliği gibi becerileri anlatır.',
};

export function ageGroup(key: AgeGroupKey): AgeGroup {
  const g = AGE_GROUPS.find((x) => x.key === key);
  if (!g) throw new Error(`Bilinmeyen yaş grubu: ${key}`);
  return g;
}

/** Test bu gruptaki en az bir sınıf düzeyine (ya da yetişkine) uygun mu? */
export function fitsGroup(t: Pick<InstrumentDef, 'minGrade' | 'maxGrade' | 'adults'>, g: AgeGroup): boolean {
  return g.grades.some((grade) => gradeAllowed(t, grade));
}

/** Listedeki testlerden bu gruba uygun olanlar (sıra korunur). */
export function testsForGroup<T extends Pick<InstrumentDef, 'minGrade' | 'maxGrade' | 'adults'>>(list: T[], g: AgeGroup): T[] {
  return list.filter((t) => fitsGroup(t, g));
}

/** Yayında en az bir testi olan yaş grupları ve test sayıları. Testi olmayan grup ne gösterilir ne de açılır. */
export function liveGroups(): { group: AgeGroup; count: number }[] {
  const live = publicInstruments();
  return AGE_GROUPS.map((group) => ({ group, count: testsForGroup(live, group).length })).filter((x) => x.count > 0);
}
