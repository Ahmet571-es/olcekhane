import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { ORAIS_ADAPTED } from '@/content/instruments/hobi-ilgileri';
import { REPORT_TEMPLATES } from '@/content/reports';
import { evaluate, evaluateAdult } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import type { LikertInstrument } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { scoreLikert } from '@/lib/scoring/likert';
import sitemap from '../src/app/sitemap';
import { def } from './helpers/bodies';
import { schoolWords } from './helpers/school';

const SLUG = 'hobi-ve-serbest-zaman-ilgileri';
const d = def<LikertInstrument>(SLUG);

/**
 * IPIP anahtar sayfasındaki (ipip.ori.org/newORAISKey.htm) 33 alan: kaynaktaki ad → [sitedeki ölçek ya da null (alınmadı),
 * α, madde numaraları]. Anket sayfasıyla (newORAISSurvey.htm) karşılaştırıldı.
 */
const KEY: Record<string, [string | null, string, number[]]> = {
  'Being Alone': [null, '.73', [23, 49, 88, 121, 153, 184]],
  'Child-Related': ['children', '.86', [14, 47, 79, 112, 140, 175]],
  Collecting: ['collecting', '.84', [31, 64, 89, 136, 161]],
  Computing: [null, '.89', [3, 34, 60, 80, 93, 132]],
  Creativity: ['creativity', '.69', [17, 50, 82, 115, 147, 178, 200]],
  Culture: ['culture', '.82', [7, 40, 72, 105, 137, 169]],
  Drinking: [null, '.84', [27, 62, 92, 125, 157]],
  Exercise: ['exercise', '.85', [6, 39, 71, 104, 129, 168, 196]],
  Fashion: ['fashion', '.76', [29, 67, 94, 127, 159]],
  Financial: [null, '.75', [16, 56, 81, 114, 146, 177]],
  'Food-Related': [null, '.64', [24, 57, 96, 122, 154, 185, 204]],
  Gambling: [null, '.79', [37, 69, 102, 134, 166, 198]],
  'Game-Playing': ['games', '.65', [54, 86, 119, 151, 182]],
  Gardening: ['gardening', '.85', [9, 42, 74, 107, 139, 171]],
  'Green Activities': [null, '.52', [22, 55, 87, 120, 152, 192, 203]],
  Housekeeping: [null, '.75', [5, 38, 70, 103, 135, 167, 191]],
  Music: [null, '.77', [1, 32, 65, 97, 130, 162, 183, 207]],
  Partying: ['gatherings', '.82', [13, 46, 78, 111, 143]],
  Pets: ['pets', '.84', [28, 52, 84, 117, 149]],
  'Political/Organizational': [null, '.70', [18, 51, 83, 116, 144, 188, 201]],
  Reading: ['reading', '.xx', [113, 176, 199, 209, 208]],
  'Religious/Spiritual Practices': [null, '.89', [2, 33, 66, 98, 131, 163, 193]],
  Romance: [null, '.57', [20, 53, 85, 118, 150, 181]],
  'Self-Improvement': ['self_improvement', '.66', [63, 95, 128, 160, 190]],
  Shopping: [null, '.66', [19, 61, 99, 126, 158, 179, 206]],
  'Social-Networking': [null, '.69', [10, 43, 75, 108, 148]],
  Sports: ['sports', '.79', [4, 35, 68, 100, 133, 165]],
  'Summer Activities': ['outdoors', '.74', [11, 44, 76, 109, 141, 173, 194]],
  Travel: ['travel', '.79', [8, 41, 73, 106, 138, 170]],
  TV: [null, '.61', [25, 58, 90, 123, 155, 186, 205]],
  Understanding: [null, '.61', [15, 30, 36, 48, 101, 145]],
  Vehicles: [null, '.50', [59, 91, 124, 156]],
  'Writing/Remembering': ['writing', '.69', [12, 45, 77, 82, 110, 142, 174]],
};

/** Kullanılan 92 maddenin İngilizce aslı (anahtar ve anket sayfalarında aynı). */
const SOURCE: Record<number, string> = {
  4: 'Discussed sports.', 6: 'Went running or jogging.', 7: 'Attended a public lecture.', 8: 'Took a trip.',
  9: 'Cared for a potted plant.', 11: 'Went on a picnic.', 12: 'Made an entry in a diary or journal.',
  13: 'Had someone over for dinner.', 14: 'Played with a child.', 17: 'Tried something completely new.',
  28: 'Played with a pet animal.', 29: 'Spent more than 10 minutes thinking about what to wear.', 31: 'Worked on my collection.',
  35: 'Watched a televised sports event.', 39: 'Lifted weights.', 40: 'Visited an art exhibition.', 41: 'Went sightseeing.',
  42: 'Gardened.', 44: 'Went on a hike.', 45: 'Wrote a postcard.', 46: 'Went to a small party.', 47: 'Let a child win a game.',
  50: 'Produced a work of art.', 52: 'Fed a pet animal.', 54: 'Worked on a jigsaw puzzle.', 63: 'Read a self-help book.',
  64: 'Bought something for my collection.', 67: 'Spent more than an hour thinking about what to wear.',
  68: 'Attended an athletic event.', 71: 'Used an exercise machine.', 72: 'Visited a museum.', 73: 'Took travel photographs.',
  74: 'Did yard work.', 76: 'Walked on a beach.', 77: 'Wrote a handwritten letter.', 78: 'Went to a large party.',
  79: 'Took a child on an outing.', 82: 'Wrote poetry.', 84: 'Cared for a pet animal.', 86: 'Played cards.',
  89: 'Traded something in my collection.', 94: 'Read a fashion-related magazine.', 95: 'Bought a self-help book.',
  100: 'Played a team sport.', 104: 'Exercised for 40 minutes or longer.', 105: 'Attended a ballet performance.',
  106: 'Stayed in a hotel, motel, or resort.', 107: 'Planted or transplanted a plant.', 109: 'Went swimming.',
  110: 'Wrote a thank-you note.', 111: 'Planned a party.', 112: 'Served as a baby sitter.', 113: 'Read a book.',
  115: 'Acted in a play.', 117: 'Bathed or groomed a pet animal.', 119: 'Played a board game.', 127: 'Read a fashion-related book.',
  128: 'Studied some subject.', 129: 'Did aerobic exercise.', 133: 'Played basketball.', 136: 'Read a book about the things that I collect.',
  137: 'Attended an opera or a concert.', 138: 'Traveled by train or plane.', 139: 'Bought or picked flowers.',
  140: 'Read a story to a child.', 141: 'Went backpacking or camping.', 142: 'Put pictures in a photo album.',
  143: 'Entertained six or more people.', 147: 'Painted a picture.', 149: 'Purchased a pet animal.', 151: 'Played chess or checkers.',
  159: 'Bought a fashionable item of clothing.', 160: 'Learned a new skill.', 161: 'Bought a book about the things that I collect.',
  165: 'Played tennis or golf.', 168: 'Did yoga or other movement exercises.', 169: 'Attended a stage play or musical.',
  170: 'Went on a cruise or tour.', 171: 'Bought plants for a garden or yard.', 173: 'Went boating or rafting.',
  174: 'Worked on a scrap book.', 175: 'Read the comics to a child.', 176: 'Bought a book.', 178: 'Played a musical instrument.',
  182: 'Learned a new board or card game.', 190: 'Enrolled in a course of study.', 194: 'Went fishing or hunting.',
  196: 'Participated in an exercise program.', 199: 'Read in bed before going to sleep.', 200: 'Sang or played an instrument in public.',
  208: 'Visited a public library.', 209: 'Read an entire book in one sitting.',
};

/** Ölçeklerin sitedeki adları (kaynaktaki sırayla). */
const NAMES = [
  'Çocuklarla ilgilenme',
  'Koleksiyon',
  'Yaratıcı etkinlikler',
  'Kültür ve sanat',
  'Egzersiz',
  'Moda ve giyim',
  'Masa ve kart oyunları',
  'Bahçe ve bitkiler',
  'Davetler ve kutlamalar',
  'Evcil hayvanlar',
  'Kitap okuma',
  'Kendini geliştirme',
  'Spor',
  'Açık hava etkinlikleri',
  'Gezi ve seyahat',
  'Yazma ve anı biriktirme',
];

const num = (key: string) => Number(key.slice(1));

/** Ölçeğe göre aynı cevabı veren gövde (ölçek seçilmezse `other`). */
function body(grade: number, level: Record<string, number>, other = 3) {
  return {
    grade,
    data: { engine: 'likert' as const, answers: Object.fromEntries(d.items.map((it) => [it.key, { value: level[it.scale] ?? other, rtMs: 2600 }])) },
  };
}

describe('Hobi ve Serbest Zaman İlgileri (ORAIS) tanımı', () => {
  it('kaynakta 33 alan, 200 madde yuvası ve 199 madde; 16 alan kullanılır', () => {
    expect(Object.keys(KEY)).toHaveLength(33);
    expect(Object.values(KEY).reduce((n, [, , items]) => n + items.length, 0)).toBe(200);
    expect(new Set(Object.values(KEY).flatMap(([, , items]) => items)).size).toBe(199);
    const kept = Object.values(KEY).filter(([scale]) => scale);
    expect(kept).toHaveLength(16);
    expect(d.scales.map((s) => s.key).sort()).toEqual(kept.map(([scale]) => scale).sort());
    expect(d.scales.map((s) => s.name)).toEqual(NAMES);
  });

  it('92 madde: kaynaktaki numara sırasıyla, İngilizce aslı ve alanı anahtarla aynı; hepsi düz yönlü', () => {
    const scaleOf = new Map<number, string[]>();
    for (const [scale, , items] of Object.values(KEY)) if (scale) for (const n of items) scaleOf.set(n, [...(scaleOf.get(n) ?? []), scale]);
    expect(d.items).toHaveLength(92);
    expect(d.items.map((it) => num(it.key))).toEqual([...scaleOf.keys()].sort((a, b) => a - b));
    for (const it of d.items) {
      const n = num(it.key);
      expect(it.key, it.key).toBe(`h${String(n).padStart(3, '0')}`);
      expect(it.source, it.key).toBe(SOURCE[n]);
      expect([it.scale, ...(it.alsoScales ?? [])], it.key).toEqual(scaleOf.get(n));
      expect(it.reverse, it.key).toBeUndefined();
    }
    // Yalnızca "Wrote poetry" iki alanda: bir kez sorulur, iki alanda puanlanır.
    expect(d.items.filter((it) => it.alsoScales).map((it) => [it.key, it.scale, it.alsoScales])).toEqual([['h082', 'creativity', ['writing']]]);
  });

  it('maddeler etkinlik adı biçiminde, Türkçe ve birbirinden farklı; parti ve kâğıt oynamak yok', () => {
    expect(new Set(d.items.map((i) => i.text)).size).toBe(92);
    for (const it of d.items) {
      expect(it.text, it.key).toMatch(/(mak|mek)$/);
      expect(it.text, it.key).not.toMatch(/[.]$/);
      expect(it.text, it.key).not.toMatch(/\bparti/i);
      expect(it.text, it.key).not.toMatch(/kâğıt|kağıt/i);
    }
    // Çocuklarla ilgili maddeler küçük bir çocuğu anlatır (cevap veren de çocuk olabilir).
    for (const it of d.items.filter((i) => i.scale === 'children')) expect(it.text.toLocaleLowerCase('tr-TR'), it.key).toContain('küçük bir çocu');
    // Uyarlanan maddeler: Türkiye'ye ya da bugüne uygun karşılıklar.
    const text = (n: number) => d.items.find((it) => num(it.key) === n)!.text;
    const adapted: Record<number, string> = {
      35: 'internette',
      46: 'kutlamaya ya da eğlenceye',
      76: 'Kumsalda',
      78: 'kutlamaya ya da eğlenceye',
      86: 'Kart oyunu',
      106: 'pansiyonda',
      111: 'kutlama ya da eğlence',
      119: 'Tavla',
      149: 'sahiplenmek',
      171: 'balkon',
      175: 'çizgi roman',
    };
    expect(ORAIS_ADAPTED).toEqual(Object.keys(adapted).map(Number));
    for (const [n, word] of Object.entries(adapted)) expect(text(Number(n)), n).toContain(word);
    expect(text(112)).toBe('Anne babası yanında değilken küçük bir çocuğa bakmak');
  });

  it('alınmayan alanların maddeleri testte yok (din, siyaset, alkol, kumar, flört ve ötekiler)', () => {
    const used = new Set(d.items.map((it) => num(it.key)));
    for (const [name, [scale, , items]] of Object.entries(KEY)) {
      if (scale) continue;
      for (const n of items) if (n !== 82) expect(used.has(n), `${name} ${n}`).toBe(false);
    }
    expect(d.items.some((it) => /dua|ibadet|kilise|cami|içki|alkol|bahis|kumar|randevu|flört|siyas|seçim/i.test(it.text))).toBe(false);
  });

  it('cevaplar kaynaktaki beş sıklık seçeneği; yönerge zorunlu olarak yapılanları saymamasını söyler', () => {
    expect(d.options.map((o) => o.value)).toEqual([1, 2, 3, 4, 5]);
    expect(d.options.map((o) => o.label)).toEqual([
      'Hayatımda hiç yapmadım',
      'Daha önce yaptım, son bir yılda yapmadım',
      'Son bir yılda 1 ya da 2 kez',
      'Son bir yılda 3 ile 10 kez arası',
      'Son bir yılda 10 kezden fazla',
    ]);
    expect(d.prompt).toBe('Bunu ne sıklıkla yaptın?');
    expect(d.intro.paragraphs.join(' ')).toContain('92 etkinlik');
    expect(d.intro.paragraphs.join(' ')).toContain('Zorunlu olarak yaptıklarını');
    expect(d.intro.paragraphs.join(' ')).toContain('evde üstlendiğin işler');
    expect(d.intro.paragraphs.join(' ')).toContain('ikinci seçeneği');
    expect(d.description).toContain('92 etkinliği');
    expect(d.minGrade).toBe(7);
    expect(d.adults).toBe(true);
  });

  it('düzey sınırları sıklık cevaplarına göre: "sık" için etkinliklerin çoğu son bir yılda 3–10 kez', () => {
    expect(d.anchoredBands.thresholds.map((t) => [t.band, t.min])).toEqual([
      ['very_low', 1],
      ['low', 2],
      ['average', 2.8],
      ['high', 3.8],
      ['very_high', 4.4],
    ]);
    const band = (values: number[]) => {
      const items = d.items.filter((it) => it.scale === 'reading');
      const answers = Object.fromEntries(d.items.map((it) => [it.key, { value: 1, rtMs: 2600 }]));
      items.forEach((it, i) => (answers[it.key] = { value: values[i], rtMs: 2600 }));
      return scoreLikert(d, answers).find((s) => s.scaleKey === 'reading')!.band;
    };
    expect(band([4, 4, 3, 3, 3])).toBe('average'); // çoğu 1–2 kez: ara sıra
    expect(band([4, 4, 4, 4, 3])).toBe('high');
    expect(band([3, 3, 3, 2, 2])).toBe('low'); // ikisi son bir yılda hiç yapılmamış: az
    expect(band([3, 3, 3, 3, 2])).toBe('average');
  });

  it('her alan kendi etkinliklerinin ortalamasıyla puanlanır; "Şiir yazmak" iki alanın puanına da katılır', () => {
    const scores = scoreLikert(d, body(9, { creativity: 5, writing: 1 }).data.answers);
    const byKey = new Map(scores.map((s) => [s.scaleKey, s]));
    const counts = Object.fromEntries(Object.values(KEY).flatMap(([scale, , items]) => (scale ? [[scale, items.length]] : [])));
    for (const s of scores) expect(s.nItems, s.scaleKey).toBe(counts[s.scaleKey]);
    expect(byKey.get('creativity')!.mean).toBe(5);
    // Yazma alanının yedi maddesinden biri (şiir) yaratıcı etkinliklerin cevabını (5) taşır: (6 × 1 + 5) / 7.
    expect(byKey.get('writing')!.mean).toBeCloseTo(11 / 7, 3);
    for (const s of scores) expect(s.ciLow, s.scaleKey).toBeUndefined();
  });

  it('her alanın düşük, ara sıra ve sık düzey metni öğrenci ve veli için yazılmış; destek kutusu yok', () => {
    const t = REPORT_TEMPLATES[SLUG];
    expect(t.bandLabels).toEqual({ low: 'Az', average: 'Ara sıra', high: 'Sık' });
    for (const s of d.scales) {
      for (const band of ['low', 'average', 'high'] as const) {
        const bt = t.scales[s.key]?.[band];
        expect(bt, `${s.key}/${band}`).toBeDefined();
        expect(bt!.summary.length, `${s.key}/${band}`).toBeGreaterThan(3);
        expect(bt!.student, `${s.key}/${band}`).toMatch(/^Son bir yılda /);
        expect(bt!.parent, `${s.key}/${band}`).toMatch(/^Çocuğunuz son bir yılda /);
        expect(bt!.parent, `${s.key}/${band}`).toContain('belirtiyor');
        expect(bt!.support, `${s.key}/${band}`).toBeUndefined();
        expect(bt!.adult, `${s.key}/${band}`).toBeUndefined();
      }
    }
    expect(Object.keys(t.scales).sort()).toEqual(d.scales.map((s) => s.key).sort());
    for (const v of [t.overview!.student, t.overview!.parent]) {
      expect(v).toContain('yetenek ya da başarı ölçümü değildir');
      expect(v).toContain('beş ile yedi etkinlikle');
      expect(v).not.toContain('Sarı bant');
    }
  });

  it('bilim kartı: kullanılan alanlar, alınmayanlar ve güvenirlik açıkça yazılı', () => {
    expect(d.estimatedMinutes).toBe(10);
    expect(d.science.basedOn).toContain('33 alandan 16’sı');
    expect(d.science.basedOn).toContain('Din ve siyaset');
    expect(d.science.basedOn).toContain('ön ölçekler');
    expect(d.science.turkishVersion).toContain('zorunlu olarak yapılan etkinliklerin sayılmaması');
    expect(d.science.limitations.join(' ')).toContain('bugün eskisi kadar yaygın değildir');
    expect(d.science.reliability).toContain('.65 ile .86');
    expect(d.science.reliability).toContain('Kitap okuma alanı için değer verilmemiştir');
    expect(d.science.turkishVersion).toContain('ulaşılamadı');
    expect(d.science.ageNote).toContain('yetişkinler de çözebilir');
    expect(d.science.limitations.join(' ')).toContain('ilginin kendisini doğrudan ölçmez');
    expect(d.science.citations.map((c) => c.url)).toContain('https://ipip.ori.org/newORAISKey.htm');
  });
});

describe('Hobi ve Serbest Zaman İlgileri raporu', () => {
  it('alanlar en sıktan en seyreğe; en sık uğraşılan alanlar açıklanır, ötekiler düzeyleriyle listelenir', () => {
    const r = evaluate(SLUG, body(7, { sports: 5, exercise: 4, games: 4, outdoors: 4, culture: 1, fashion: 2 }));
    for (const rep of [r.student, r.parent]) {
      expect(rep.chart?.type).toBe('rulers');
      const rows = rep.chart?.type === 'rulers' ? rep.chart.rows : [];
      expect(rows).toHaveLength(16);
      expect(rows[0].label).toBe('Spor');
      expect(rows.at(-1)?.label).toBe('Kültür ve sanat');
      expect(rows.map((x) => x.value)).toEqual([...rows.map((x) => x.value)].sort((a, b) => b! - a!));
      expect(rep.items.map((i) => i.title)).toEqual(['1. Spor', '2. Egzersiz', '3. Masa ve kart oyunları', rep.audience === 'parent' ? 'Diğer alanlar' : 'Diğer alanların']);
      expect(rep.items[0].badge).toBe('Sık');
      expect(rep.items[3].text).toContain('Açık hava etkinlikleri (sık)');
      expect(rep.items[3].text).toContain('Kültür ve sanat (az)');
      expect(rep.items[3].text).not.toContain('meslek');
      expect(rep.keyFigures[0].value).toBe('Spor');
      expect(rep.support).toBeNull();
      expect(rep.cautions).toEqual([]);
    }
    expect(r.student.chartTitle).toBe('Serbest zaman etkinliklerin');
    expect(r.student.keyFigures[0].label).toBe('En sık uğraştığın alan');
    expect(r.student.itemsTitle).toBe('En sık uğraştığın alanlar');
    expect(r.parent.chartTitle).toBe('Serbest zaman etkinlikleri');
    expect(r.parent.keyFigures[0].label).toBe('En sık uğraşılan alan');
    expect(r.parent.itemsTitle).toBe('En sık uğraşılan alanlar');
    expect(r.parent.chartNote).toContain('ailenin imkânlarına');
    // Testin sormadığı yaygın uğraşlar grafiğin açıklamasında anılır.
    for (const rep of [r.student, r.parent]) expect(rep.chartNote).toContain('sosyal medya gibi uğraşlar bu listede yoktur');
    expect(r.parent.items[0].text).toMatch(/^Çocuğunuz/);
  });

  it('sık yapılan alan yoksa yalnızca ara sıra yapılan alanlar öne çıkar; az yapılan alan "en sık" diye gösterilmez', () => {
    const none = evaluate(SLUG, body(8, { reading: 3, travel: 3 }, 2));
    expect(none.student.items.map((i) => i.title)).toEqual(['1. Kitap okuma', '2. Gezi ve seyahat', 'Diğer alanların']);
    expect(none.student.itemsTitle).toBe('En yüksek çıkan alanların');
    expect(none.student.cautions.join(' ')).toContain('ara sıra yapılan iki alanı');
    // Tek bir alan ara sıra, ötekiler az: yalnızca o alan.
    const one = evaluate(SLUG, body(8, { reading: 3 }, 2));
    expect(one.student.items.map((i) => i.title)).toEqual(['1. Kitap okuma', 'Diğer alanların']);
    expect(one.student.keyFigures[0].note).toBeUndefined();
    expect(one.parent.cautions.join(' ')).toContain('ara sıra yapılan alan yer alıyor');
    // Bütün alanlar az: öne çıkan alan yok; imkânları anlatan not.
    const low = evaluate(SLUG, body(8, { reading: 2 }, 1));
    expect(low.student.keyFigures).toEqual([]);
    expect(low.student.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
    expect(low.student.cautions.join(' ')).toContain('ilgi duymadığın anlamına gelmeyebilir');
    expect(low.parent.cautions.join(' ')).toContain('fırsat yaratmanızı');
    // Her etkinliğe aynı cevap: sıralama anlamsız, öne çıkan alan yok.
    const same = evaluate(SLUG, body(8, {}, 3));
    expect(same.student.keyFigures).toEqual([]);
    expect(same.student.itemsTitle).toBe('Alanların');
    expect(same.parent.itemsTitle).toBe('Alanlar');
    expect(same.student.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
    expect(same.student.cautions.join(' ')).not.toContain('iki alan');
    expect(same.student.cautions.join(' ')).toContain('hiçbir alan ötekilerden belirgin biçimde ayrılmıyor');
  });

  it('"hiç yapmadım" ya da "son bir yılda yapmadım" cevaplarının üst üste gelmesi düz çizgi sayılmaz; öteki cevaplarınki sayılır', () => {
    const run = (value: number) => evaluate(SLUG, body(9, {}, value)).student.cautions.join(' ');
    expect(run(1)).not.toContain('hep aynı seçenek');
    expect(run(2)).not.toContain('hep aynı seçenek');
    expect(run(3)).toContain('hep aynı seçenek');
    expect(run(5)).toContain('hep aynı seçenek');
    // Çok hızlı cevaplar: maddeler "etkinlik" diye anılır.
    const fast = evaluate(SLUG, {
      grade: 9,
      data: { engine: 'likert', answers: Object.fromEntries(d.items.map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 300 }])) },
    });
    expect(fast.student.cautions.join(' ')).toContain('bazı etkinlikler okunmadan');
  });

  it('yeterince cevaplanmayan alan sıralamanın sonunda "Hesaplanamadı"; rapor ve PDF yine hazırlanır', async () => {
    const skipped = new Set(['h054', 'h086', 'h119']); // masa ve kart oyunlarından üçü (5 maddenin %75'i karşılanmaz)
    const r = evaluate(SLUG, {
      grade: 9,
      data: { engine: 'likert', answers: Object.fromEntries(d.items.filter((it) => !skipped.has(it.key)).map((it, i) => [it.key, { value: (i % 5) + 1, rtMs: 2600 }])) },
    });
    const rows = r.student.chart?.type === 'rulers' ? r.student.chart.rows : [];
    expect(rows.at(-1)).toMatchObject({ label: 'Masa ve kart oyunları', value: null });
    expect(r.student.items.flatMap((i) => i.title)).not.toContain('Masa ve kart oyunları');
    const pdf = await renderSimpleReportPdf(r.parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('yetişkine tek, kişisel rapor; okula özgü sözcük yok', () => {
    for (const other of [1, 3, 5]) {
      const adult = evaluateAdult(SLUG, { ...body(ADULT_GRADE, { travel: 5, culture: 1 }, other), grade: ADULT_GRADE }).adult;
      expect(adult.audience).toBe('adult');
      expect(adult.chartTitle).toBe('Serbest zaman etkinliklerin');
      expect(JSON.stringify(adult)).not.toContain('Çocuğunuz');
      expect(schoolWords(JSON.stringify(adult)), String(other)).toEqual([]);
    }
  });

  it('uzman incelemesinde: bağlantıyla çözülür, listelerde ve site haritasında yok', () => {
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(false);
    expect(sitemap().some((u) => u.url.includes(`/testler/${SLUG}`))).toBe(false);
  });
});
