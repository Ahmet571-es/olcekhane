import { describe, expect, it } from 'vitest';
import { getInstrumentDef } from '@/content/instruments';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import type { AudienceText, TaskRoadmapTemplate } from '@/content/roadmaps/types';
import { parentTitle } from '@/content/roadmaps/veli-basliklari';
import { evaluate } from '@/lib/assessment/evaluate';
import type { TaskInstrument } from '@/lib/instruments/types';
import { EXCLUDED } from './helpers/gunluk-excluded';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * Zihinsel görevlerin yol haritası (src/content/roadmaps/gorevler.ts) testin "Günlük hayatta nerede kullanılır" örnekleriyle
 * uyumludur: testin sınırlılıklarında "bilgi vermez" dediği, bir kardeş testin ölçtüğü ya da testin çözülüş biçimine uymayan
 * işlere dayanmaz (tests/helpers/gunluk-excluded.ts, `EXCLUDED`; günlük hayat örnekleri de aynı tabloyla denetlenir). Yol
 * haritasında örüntünün kabul edildiği yerler tabloda `roadmap` ile, nedeniyle birlikte yazılır.
 *
 * Denetlenmeyen: "Bir sonraki adım" cümlesi (`nextPurpose` ve önerilen testlerin adları). Orada kardeş testin ölçtüğü beceri
 * bilerek anılır: o testi neden önerdiğini söyler (ör. Harf Dizileri'nden sonra "sayılarla ve şekillerle akıl yürütmeyi de
 * görmek"). Kaynak künyeleri de denetlenmez.
 */

type Who = 'student' | 'parent' | 'adult';
interface Place {
  /** Metnin yol haritasındaki yeri: `supports.<anahtar>.text`, `weeks.<sıra>.title`, `facts.items.<sıra>` … */
  where: string;
  who: Who;
  text: string;
}

const pickFor = (t: AudienceText, who: Who) => (who === 'parent' ? t.parent : who === 'adult' ? (t.adult ?? t.student) : t.student);

/** Yol haritasında okura görünen bütün metinler, her kitle için ayrı (yetişkin yalnızca test yetişkinlere açıksa). */
function places(t: TaskRoadmapTemplate, adults: boolean): Place[] {
  const out: Place[] = [];
  for (const who of ['student', 'parent', ...(adults ? (['adult'] as const) : [])] as const) {
    const add = (where: string, text: string) => out.push({ where, who, text });
    const title = (x: string) => (who === 'parent' ? parentTitle(x) : x);
    add('what', pickFor(t.what, who));
    add('what.summary', t.what.summary);
    add('studyTitle', who === 'parent' ? t.studyTitle.parent : t.studyTitle.you);
    add('studyIntro', pickFor(t.studyIntro, who));
    for (const s of t.supports) {
      add(`supports.${s.key}.title`, title(s.title));
      add(`supports.${s.key}.text`, pickFor(s.text, who));
    }
    add('facts.title', t.facts.title);
    add('facts.intro', pickFor(t.facts.intro, who));
    const items = who === 'parent' ? t.facts.items.parent : who === 'adult' ? (t.facts.items.adult ?? t.facts.items.student) : t.facts.items.student;
    items.forEach((x, i) => add(`facts.items.${i}`, x));
    add('facts.note', pickFor(t.facts.note, who));
    if (who === 'parent') {
      t.approach.forEach((x, i) => {
        add(`approach.${i}.title`, x.title);
        add(`approach.${i}.text`, x.text);
      });
    }
    t.weeks.forEach((w, i) => {
      add(`weeks.${i}.title`, title(w.title));
      add(`weeks.${i}.text`, pickFor(w.text, who));
    });
    add('lastWeek', pickFor(t.lastWeek, who));
    t.links.forEach((l, i) => add(`links.${i}`, l.label));
  }
  return out;
}

/** Yer, izin verilen yerlerden biri ya da onun alt yeri mi (`supports.ayna`, `supports.ayna.text`'i de kapsar). */
const within = (where: string, allowed: string[]) => allowed.some((w) => where === w || where.startsWith(`${w}.`));

const adultsOf = (slug: string) => !!(getInstrumentDef(slug) as TaskInstrument).adults;

/**
 * 1–4. sınıfa açık testlerde öğrenciye yazılan metin çocuğun telefonu, mesajı ya da bildirimi olduğunu varsaymaz ("telefon
 * numarası" bir cihaz varsaymaz). Veliye yazılan metinde evdeki telefon ve televizyon dikkat dağıtıcı olarak anılabilir;
 * çocuğun kendi telefonu ve mesajları anılmaz. "Bilmekte yarar var" maddeleri testin çözüldüğü cihazdan ve bilgisayar
 * alıştırma programlarından söz eder: denetlenmez.
 */
const STUDENT_DEVICES = /(?<!\p{L})(?:telefon(?! numara)\p{L}*|mesaj\p{L}*|bildirim\p{L}*|tablet\p{L}*|internet\p{L}*|sosyal medya|bilgisayar\p{L}*)/iu;
const PARENT_DEVICES = /(?<!\p{L})(?:mesaj\p{L}*|bildirim\p{L}*|tablet\p{L}*|internet\p{L}*|sosyal medya|telefonu(?:nu|na|nda)(?!\p{L}))/iu;

describe('zihinsel görevlerin yol haritası: günlük hayat örnekleriyle uyum', () => {
  it('yol haritası, testin günlük hayat örneklerinin dayanamayacağı işlere dayanmaz (her kitlede)', () => {
    const problems: string[] = [];
    for (const [slug, t] of Object.entries(TASK_ROADMAPS)) {
      const all = places(t, adultsOf(slug));
      for (const x of EXCLUDED[slug] ?? []) {
        const allowed = x.roadmap?.where ?? [];
        for (const p of all) {
          if (x.pattern.test(p.text) && !within(p.where, allowed)) problems.push(`${slug} ${p.where} (${p.who}) ${x.pattern}: ${p.text}`);
        }
        // İzin verilen her yerde örüntü gerçekten geçer: metin değişince kullanılmayan izin kalmaz.
        for (const w of allowed) {
          if (!all.some((p) => within(p.where, [w]) && x.pattern.test(p.text))) problems.push(`${slug} ${x.pattern}: “${w}” izni kullanılmıyor`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('yol haritasındaki izinler yalnızca zihinsel görevlerde ve gerekçeleriyle', () => {
    for (const [slug, list] of Object.entries(EXCLUDED)) {
      for (const x of list) {
        if (!x.roadmap) continue;
        expect(TASK_ROADMAPS[slug], `${slug}: yol haritası izni ama görev yol haritası yok`).toBeDefined();
        expect(x.roadmap.where.length, `${slug} ${x.pattern}`).toBeGreaterThan(0);
        expect(new Set(x.roadmap.where).size, `${slug} ${x.pattern}`).toBe(x.roadmap.where.length);
        expect(x.roadmap.why.length, `${slug} ${x.pattern}: gerekçe`).toBeGreaterThan(40);
      }
    }
  });

  it('1–4. sınıfa açık testlerde yol haritası çocuğun telefonu ya da mesajı olduğunu varsaymaz', () => {
    const problems: string[] = [];
    for (const [slug, t] of Object.entries(TASK_ROADMAPS)) {
      if ((getInstrumentDef(slug) as TaskInstrument).minGrade > 4) continue;
      for (const p of places(t, false)) {
        if (p.where.startsWith('facts.items')) continue;
        const re = p.who === 'parent' ? PARENT_DEVICES : STUDENT_DEVICES;
        if (re.test(p.text)) problems.push(`${slug} ${p.where} (${p.who}): ${p.text}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('Dikkat ve Bellek raporu: tersten sayı dizisi, kutu dizisi ve sembol eşleştirme kartları kardeş testlerin örneklerini kullanmaz', () => {
    const d = getInstrumentDef('dikkat-ve-bellek') as TaskInstrument;
    const names = ['digit_backward', 'spatial', 'speed'].map((k) => d.scales.find((s) => s.key === k)!.name);
    for (const [variant, make] of Object.entries(TASK_VARIANTS['dikkat-ve-bellek'])) {
      const r = evaluate('dikkat-ve-bellek', make());
      for (const who of ['student', 'parent'] as const) {
        const cards = r[who].items.filter((i) => names.includes(i.title));
        expect(cards.length, `${variant} ${who}`).toBe(3);
        for (const c of cards) {
          for (const x of EXCLUDED['dikkat-ve-bellek']) expect(c.text, `${variant} ${who} ${c.title}: ${x.pattern}`).not.toMatch(x.pattern);
          // Tahtadan deftere geçirmek yazma hızına da dayanır.
          expect(c.text, `${variant} ${who} ${c.title}`).not.toMatch(/tahtadan|deftere|yol(?:u|unu)? (?:hatırla|bul)/iu);
        }
      }
    }
  });
});
