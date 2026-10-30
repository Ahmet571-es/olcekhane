import { publicInstruments } from '@/content/instruments';
import { ADULT_GRADE, gradeAllowed } from '@/lib/config';
import type { InstrumentDef } from '@/lib/instruments/types';

/**
 * Kendini Tanı Paketi (site sahibinin 2026-10-30 isteği; DURUM.md'deki büyük planın 5. basamağındaki "Kendini Tanı
 * Paketi"): kişilik, ilgi, çalışma alışkanlıkları ve dört zihinsel beceri testi art arda, tek oturumda çözülür; sonunda
 * tek raporda başta bir özet, ardından her testin kendi raporu ve tek PDF verilir. Site sahibinin seçimleri: geniş paket
 * (yaklaşık bir saat); özet testleri birbirine bağlayan yeni bir yorum eklemez, yalnızca testlerin kendi sonuçlarını
 * yan yana koyar.
 *
 * Hiçbir şey saklanmaz: cevaplar ve raporlar yalnızca açık sayfada durur (tek tek testlerdeki gibi).
 *
 * Her yuva (kişilik, ilgi, ...) için adaylardan sınıfa uygun ilk yayındaki test seçilir. Paket 5. sınıftan başlar: daha
 * küçük çocuklar için bir saatlik art arda test uygun değildir.
 */

export const PACKAGE_PATH = '/kendini-tani-paketi';
export const PACKAGE_NAME = 'Kendini Tanı Paketi';
export const PACKAGE_MIN_GRADE = 5;

export type PackageArea = 'kisilik' | 'ilgi' | 'calisma' | 'zihinsel';

export const PACKAGE_AREAS: { key: PackageArea; name: string }[] = [
  { key: 'kisilik', name: 'Kişilik' },
  { key: 'ilgi', name: 'İlgi alanları' },
  { key: 'calisma', name: 'Çalışma alışkanlıkları' },
  { key: 'zihinsel', name: 'Zekâ ve zihinsel beceriler' },
];

export interface PackageSlot {
  key: string;
  area: PackageArea;
  /** Yuvanın kısa adı ("Akıl yürütme"); özette ve test listesinde testin adının yanında. */
  skill: string;
  /** Neden pakette: plan ekranında bir cümle. */
  why: string;
  /** Sırayla denenen testler: sınıfa uygun ilk yayındaki test seçilir. */
  candidates: string[];
}

export const PACKAGE_SLOTS: PackageSlot[] = [
  {
    key: 'kisilik',
    area: 'kisilik',
    skill: 'Kişilik',
    why: 'Kişiliğin temel boyutlarında kendini nasıl gördüğünü gösterir.',
    // 5. sınıfta Çocuk Kişilik Profili, 6. sınıftan mezuna Beş Faktör, yetişkinde Ayrıntılı Kişilik Profili.
    candidates: ['bes-faktor-kisilik', 'cocuk-kisilik-profili', 'ayrintili-kisilik-profili'],
  },
  {
    key: 'ilgi',
    area: 'ilgi',
    skill: 'İlgi alanları',
    why: 'Hangi alanlara ve etkinliklere ilgi duyduğunu gösterir.',
    // 9. sınıftan yetişkine Meslek İlgi Alanları, 8. sınıfta Mesleki İlgi Profili, 7. sınıfta serbest zaman ilgileri;
    // 5 ve 6. sınıfa uygun ilgi testi yoktur.
    candidates: ['meslek-ilgi-alanlari', 'mesleki-ilgi-profili', 'hobi-ve-serbest-zaman-ilgileri'],
  },
  {
    key: 'calisma',
    area: 'calisma',
    skill: 'Çalışma alışkanlıkları',
    why: 'Nasıl çalıştığını ve zamanını nasıl kullandığını gösterir.',
    candidates: ['calisma-aliskanliklari', 'ders-calisma-motivasyonu', 'erteleme-ve-zaman-yonetimi'],
  },
  {
    key: 'akil',
    area: 'zihinsel',
    skill: 'Akıl yürütme',
    why: 'Şekiller arasındaki kuralı bulmayı ölçer.',
    candidates: ['sekil-akil-yurutme'],
  },
  {
    key: 'sozel',
    area: 'zihinsel',
    skill: 'Sözel beceri',
    why: 'Kelimelerin anlamlarını ne kadar iyi bildiğini ölçer.',
    candidates: ['kelime-bilgisi'],
  },
  {
    key: 'uzamsal',
    area: 'zihinsel',
    skill: 'Uzamsal beceri',
    why: 'Şekilleri zihninde döndürmeyi ya da katlamayı ölçer.',
    // Zihinde Döndürme yetişkinlere açık değildir; yetişkinde Kâğıt Katlama.
    candidates: ['zihinde-dondurme', 'kagit-katlama'],
  },
  {
    key: 'bellek',
    area: 'zihinsel',
    skill: 'Görsel bellek',
    why: 'Gördüğün desenleri kısa süre aklında tutmayı ölçer.',
    candidates: ['desen-hatirlama'],
  },
];

export interface PackageTest {
  slot: PackageSlot;
  def: InstrumentDef;
}

/** Sınıfa (ya da yetişkine) göre paketin testleri, paketteki sırayla. 5. sınıftan küçükse boş. */
export function packageTests(grade: number): PackageTest[] {
  if (grade < PACKAGE_MIN_GRADE || grade > ADULT_GRADE) return [];
  const live = publicInstruments();
  return PACKAGE_SLOTS.flatMap((slot) => {
    for (const slug of slot.candidates) {
      const def = live.find((d) => d.slug === slug);
      if (def && gradeAllowed(def, grade)) return [{ slot, def }];
    }
    return [];
  });
}

/** Paketin açık olduğu sınıflar (ve yetişkin): en az üç testi olanlar. */
export function packageGrades(): number[] {
  return [...Array.from({ length: 13 - PACKAGE_MIN_GRADE + 1 }, (_, i) => PACKAGE_MIN_GRADE + i), ADULT_GRADE].filter((g) => packageTests(g).length >= 3);
}

export const packageMinutes = (tests: PackageTest[]) => tests.reduce((sum, t) => sum + t.def.estimatedMinutes, 0);

/** Yaş grubunda paket açık mı (grubun en az bir sınıfında). */
export const packageOpenFor = (grades: number[]) => grades.some((g) => packageGrades().includes(g));
