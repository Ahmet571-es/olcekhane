import { publicInstruments } from '@/content/instruments';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import { DOMAIN_ORDER } from '@/lib/domain-style';
import type { InstrumentDef } from '@/lib/instruments/types';

/**
 * Yaş grupları: siteye gelen kişi önce kim olduğunu seçer, testler o gruba göre bölüm bölüm listelenir. Her sınıf
 * düzeyi tam olarak bir gruptadır (tests/age-groups.test.ts). Seçim hiçbir yere kaydedilmez; grup yalnızca hangi
 * sayfanın açıldığıdır.
 */
export type AgeGroupKey = 'ilkokul12' | 'ilkokul' | 'ortaokul' | 'lise' | 'yetiskin';

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
   * Değerlendirmeyi öğrenci değil bir yetişkin (öğretmen ya da veli) yürütür: sayfa öğrenciye "sen" diye değil,
   * yetişkine "siz" diye seslenir.
   */
  adultLed?: boolean;
  /**
   * İlk kez gelenlere önerilen testler, sırayla. Her biri gruptaki her sınıfa uygun olmalıdır (tests/age-groups.test.ts).
   * Yalnızca yayındakiler gösterilir: incelemedeki bir test onaylanınca kendiliğinden görünür.
   */
  starters: { slug: string; why: string }[];
}

export const AGE_GROUPS: AgeGroup[] = [
  {
    key: 'ilkokul12',
    path: '/ilkokul-1-2',
    name: 'İlkokul 1–2',
    range: '1. ve 2. sınıf',
    forWhom: '1. ve 2. sınıf öğrencilerine',
    grades: [1, 2],
    color: 'var(--dim-emo)',
    lede: '1. ve 2. sınıf öğrencilerine uygun değerlendirmeler. Bu yaşta değerlendirmeyi bir yetişkin (öğretmen ya da veli) yapar: Öğrenci okur, anlatır ve soruları cevaplar; yetişkin dinleyerek değerlendirir.',
    parentNote:
      'Değerlendirmeyi çocuğunuzla birlikte yaparsınız: Çocuğunuz kısa bir metni sesli okur, siz kaydı dinleyerek değerlendirirsiniz. Ses kaydı yalnızca sizin cihazınızda kalır; hiçbir yere gönderilmez.',
    adultLed: true,
    starters: [
      {
        slug: 'sesli-okuma-degerlendirmesi',
        why: 'Çocuğunuz kısa bir metni sesli okur; siz kaydı dinleyerek doğru okumayı, akıcılığı ve okuduğunu anlamayı değerlendirirsiniz.',
      },
    ],
  },
  {
    key: 'ilkokul',
    path: '/ilkokul',
    name: 'İlkokul 3–4',
    range: '3. ve 4. sınıf',
    forWhom: '3. ve 4. sınıf öğrencilerine',
    grades: [3, 4],
    color: 'var(--dim-agr)',
    lede: '3. ve 4. sınıf öğrencilerine uygun testler. Bu yaşta testi bir yetişkinin yanında çözmek en iyisidir.',
    parentNote:
      'Yönergeleri çocuğunuzla birlikte okuyun, ama cevapları onun yerine vermeyin. Testi sakin bir yerde ve tek seferde bitirin. Raporda size ayrı yazılmış bir veli raporu da bulunur.',
    starters: [
      {
        slug: 'sesli-okuma-degerlendirmesi',
        why: 'Öğrenci sınıfına uygun bir metni sesli okur; öğretmen ya da veli kaydı dinleyerek okumayı ayrıntılı değerlendirir.',
      },
      { slug: 'okuma-hizi-ve-anlama', why: 'Okuma hızını ve okuduğunu anlamayı birlikte gösterir; metin sınıfa göre seçilir.' },
      { slug: 'surekli-dikkat', why: 'Harf bulma görevi: dikkatin birkaç dakika boyunca nasıl sürdüğünü gösterir.' },
      {
        slug: 'cocuk-kisilik-profili',
        why: 'Çocuk diliyle yazılmış 30 kısa cümleyle, kişiliğin beş temel boyutunda kendini nasıl gördüğünü gösterir.',
      },
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
      { slug: 'okuma-hizi-ve-anlama', why: 'Kısa bir metinle okuma hızını ve okuduğunu anlamayı birlikte gösterir; metin sınıfına göre seçilir.' },
      { slug: 'dikkat-ve-bellek', why: 'Beş kısa görevle çalışma belleğini, seçici dikkati ve işlem hızını ayrı ayrı gösterir.' },
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
      { slug: 'sekil-akil-yurutme', why: 'Şekillerle kurulmuş bulmacalarla akıl yürütmeyi kolaydan zora beş düzeyde gösterir; zekâ puanı vermez.' },
    ],
  },
];

/** Bölümlerin kısa tanıtımı (yaş grubu sayfalarında bölüm başlığının altında). */
export const AREA_INTROS: Record<string, string> = {
  personality: 'Nasıl biri olduğunu; insanlarla, işlerle ve duygularla nasıl ilişki kurduğunu anlatır.',
  career: 'Hangi etkinliklerden hoşlandığını ve bunlara uyan alanları, meslekleri gösterir.',
  academic: 'Ders konuları ve ders çalışma yöntemleri: neyin sağlam olduğunu, neyin geliştirilebileceğini gösterir.',
  reading:
    'Sesli ve sessiz okuma: kelimeleri doğru ve akıcı okumayı, okuma hızını ve okuduğunu anlamayı gösterir. Sesli okumayı bir öğretmen ya da veli dinleyerek değerlendirir.',
  cognitive:
    'Dikkat, bellek, hız ve algı gibi becerileri kısa görevlerle ölçer. Zekâ puanı (IQ) verilmez; her beceri ayrı ayrı anlatılır.',
  wellbeing: 'Kendini nasıl hissettiğini ve gündelik hayatta nelerin iyi geldiğini anlatır.',
  skills: 'Duyguları anlama, ilişkiler ve iş birliği gibi becerileri anlatır.',
};

/** Bölümlerin cümle içindeki kısa adları: "kişilik, okuma ve ilgi testleri" (grup sayfalarının açıklaması). */
export const AREA_SHORT: Record<string, string> = {
  personality: 'kişilik',
  cognitive: 'zihinsel beceri',
  reading: 'okuma',
  academic: 'akademik beceri',
  career: 'ilgi',
  wellbeing: 'iyi oluş',
  skills: 'sosyal-duygusal beceri',
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

/**
 * Sınıf seçimi listeyi değiştirir mi? Gruptaki her sınıfa aynı testler uyuyorsa "Kaçıncı sınıftasın?" seçimi
 * gösterilmez (ör. İlkokul 1–2'deki tek değerlendirme iki sınıfa da uyar).
 */
export function gradeChoiceMatters(list: Pick<InstrumentDef, 'minGrade' | 'maxGrade' | 'adults'>[], g: AgeGroup): boolean {
  const options = g.grades.filter((grade) => list.some((t) => gradeAllowed(t, grade)));
  return options.length > 1 && options.some((grade) => list.some((t) => !gradeAllowed(t, grade)));
}

/** Grup sayfasının arama motorlarına giden açıklaması: yalnızca grupta yayında testi olan bölümler anılır. */
export function groupDescription(g: AgeGroup): string {
  const tests = testsForGroup(publicInstruments(), g);
  const how = `Hesap açmadan ${g.adultLed ? 'yapılır' : 'çözülür'}; cevaplar saklanmaz, rapor PDF olarak verilir.`;
  if (tests.length === 1) return `${g.range} için ücretsiz ${tests[0].name}. ${tests[0].tagline} ${how}`;
  const areas = DOMAIN_ORDER.filter((d) => tests.some((t) => t.domain === d)).map((d) => AREA_SHORT[d]);
  const list = areas.length > 1 ? `${areas.slice(0, -1).join(', ')} ve ${areas[areas.length - 1]}` : areas[0];
  return `${g.range} için ücretsiz ${list} testleri${areas.length > 1 ? ', bölüm bölüm' : ''}. ${how}`;
}

/** Yayında en az bir testi olan yaş grupları ve test sayıları. Testi olmayan grup ne gösterilir ne de açılır. */
export function liveGroups(): { group: AgeGroup; count: number }[] {
  const live = publicInstruments();
  return AGE_GROUPS.map((group) => ({ group, count: testsForGroup(live, group).length })).filter((x) => x.count > 0);
}
