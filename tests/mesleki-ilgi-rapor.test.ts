import { describe, expect, it } from 'vitest';
import { RIASEC_ORDER, RIASEC_TYPES } from '@/content/careers/riasec';
import { meslekiIlgi } from '@/content/instruments/mesleki-ilgi';
import { evaluate } from '@/lib/assessment/evaluate';
import type { AnswersBody } from '@/lib/assessment/schemas';

/**
 * Mesleki İlgi Profili raporu: öne çıkan alanlar, Holland kodu, örnek meslekler ve eğitim yolları puanın düzeyine göre
 * seçilir. Bütün düzey birleşimleri tek tek denenir: düşük ilgili alan hiçbir zaman "belirgin ilgi" diye gösterilmez.
 */
const SLUG = 'mesleki-ilgi-profili';
const SCALES = RIASEC_ORDER.map((k) => RIASEC_TYPES[k].scaleKey);
const NAMES = RIASEC_ORDER.map((k) => RIASEC_TYPES[k].name);
const HIGH_LABELS = ['Yüksek ilgi', 'Çok yüksek ilgi'];
const OK_LABELS = ['Orta düzeyde ilgi', ...HIGH_LABELS];

/** Her alandaki 8 maddeye verilecek cevaplar (alan sırası: R, I, A, S, E, C). */
function body(perScale: number[][], grade = 10): AnswersBody {
  const idx = new Map<string, number>();
  return {
    grade,
    data: {
      engine: 'likert',
      answers: Object.fromEntries(
        meslekiIlgi.items.map((it) => {
          const s = SCALES.indexOf(it.scale);
          const i = idx.get(it.scale) ?? 0;
          idx.set(it.scale, i + 1);
          return [it.key, { value: perScale[s][i % perScale[s].length], rtMs: 2600 }];
        }),
      ),
    },
  };
}
const flat = (v: number) => [v];

const shown1 = (v: number) => Math.round(v * 10) / 10;
const band = (m: number) => (shown1(m) >= 3.4 ? 'high' : shown1(m) >= 2.6 ? 'average' : 'low');

/**
 * Beklenen öne çıkan alanlar ve kod (build.ts'teki kuralın bağımsız yazımı): en az orta düzeydeki alanlar puana göre
 * (eşitlikte altıgen sırası); yüksek alan varsa en çok üç, yoksa iki. Gösterilen puanı aynı alanlar bölünmez: kesim eşit
 * puanlı bir grubun içine düşerse grup bir alan fazlasına kadar alınır. Kod, bir harfi belirleyen eşitlikten önce kesilir.
 */
function expected(means: number[]) {
  const allSame = means.every((m) => m === means[0]);
  const anyHigh = means.some((m) => band(m) === 'high');
  const eligible = allSame ? [] : RIASEC_ORDER.map((k, i) => ({ k, i, m: means[i] })).filter((x) => band(x.m) !== 'low').sort((a, b) => b.m - a.m || a.i - b.i);
  const cap = anyHigh ? 3 : 2;
  const same = (a: number, b: number) => shown1(a) === shown1(b);
  let n = Math.min(cap, eligible.length);
  if (n > 0 && n < eligible.length && same(eligible[n - 1].m, eligible[n].m)) {
    let end = n;
    while (end < eligible.length && same(eligible[n - 1].m, eligible[end].m)) end++;
    if (end <= cap + 1) n = end;
  }
  const top = eligible.slice(0, n);
  let codeLen = anyHigh ? Math.min(cap, n) : 0;
  if (codeLen > 0 && eligible.length > codeLen && same(eligible[codeLen - 1].m, eligible[codeLen].m)) {
    let start = codeLen - 1;
    while (start > 0 && same(eligible[start - 1].m, eligible[codeLen].m)) start--;
    codeLen = start;
  }
  const flat = Math.max(...means) - Math.min(...means) < 0.8;
  return { top, code: top.slice(0, codeLen).map((x) => x.k).join(''), flat, anyHigh };
}

function check(levels: number[][], label: string) {
  const r = evaluate(SLUG, body(levels));
  const means = levels.map((xs) => {
    const all = Array.from({ length: 8 }, (_, i) => xs[i % xs.length]);
    return all.reduce((a, b) => a + b, 0) / 8;
  });
  const exp = expected(means);
  for (const audience of ['student', 'parent'] as const) {
    const rep = r[audience];
    const code = rep.keyFigures.find((f) => f.label === 'İlgi kodu');
    const jobs = rep.items.find((i) => /örnek meslekler/.test(i.title));
    const tops = rep.items.filter((i) => /^\d\. /.test(i.title));
    const where = `${label} ${audience}`;
    // Öne çıkan alanlar ve kod beklenenle aynı; kod yalnızca en az bir alan yüksekken. Örnek meslekler yalnızca kod varken
    // ve profil belirginleşmişken (farklar küçük değilken).
    expect(tops.map((t) => t.title.slice(3)), where).toEqual(exp.top.map((x) => RIASEC_TYPES[x.k].name));
    expect(code?.value ?? '', where).toBe(exp.code);
    expect(!!jobs, where).toBe(!!exp.code && !exp.flat);
    if (code) expect(code.note, where).toContain('Harfler, alanların uluslararası kullanılan İngilizce adlarının baş harfleridir.');
    // Öne çıkan alan hiçbir zaman orta düzeyin altında değildir; birebir eşit puanlılar aynı numarayı ve "eşit puan" rozetini
    // alır.
    const shownOf = (t: (typeof tops)[number]) => shown1(means[NAMES.indexOf(t.title.slice(3))]);
    for (const t of tops) {
      const [lvl, tie] = t.badge!.split(' · ');
      expect(OK_LABELS, `${where}: ${t.title}`).toContain(lvl);
      const tied = tops.filter((x) => shownOf(x) === shownOf(t)).length > 1;
      expect(tie, `${where}: ${t.title}`).toBe(tied ? 'eşit puan' : undefined);
      expect(Number(t.title[0]), `${where}: ${t.title}`).toBe(1 + tops.filter((x) => shownOf(x) > shownOf(t)).length);
    }
    if (code) {
      expect(code.value, where).toMatch(/^[RIASEC]{1,3}$/);
      expect(HIGH_LABELS, where).toContain(tops[0].badge!.split(' · ')[0]);
      // Kod öne çıkan alanlardan kısaysa (eşitlik bir harfi belirledi) not bunu söyler.
      if (code.value.length < Math.min(3, tops.length)) expect(rep.cautions.join(' '), where).toContain('ilgi kodunda yalnızca');
    } else {
      expect(tops.length, where).toBeLessThanOrEqual(exp.anyHigh ? 4 : 3);
      if (exp.anyHigh && tops.length) expect(rep.cautions.join(' '), where).toContain('ilgi kodu ve örnek meslekler verilmedi');
    }
    // Başlık: kod varken ve profil belirginken "en belirgin", değilse "en yüksek çıkan"; tek alanda tekil.
    if (tops.length) expect(rep.itemsTitle, where).toMatch(code && !exp.flat ? /^En belirgin ilgi alan/ : /^En yüksek çıkan alan/);
    if (tops.length === 1) expect(rep.itemsTitle, where).toMatch(/alan(ın|ı)?$/);
    if (rep.chart?.type === 'hexagon') {
      expect(rep.chart.highlight.length, where).toBe(tops.length);
    }
    // Öne çıkan alan yoksa bütün alanlar düzeyleriyle listelenir; varsa öteki alanlar ayrı satırdadır.
    const restItem = rep.items.find((i) => i.title === 'Bütün alanlar' || /^Diğer alan/.test(i.title));
    if (tops.length < 6) expect(restItem, where).toBeDefined();
    // Yol haritası raporla aynı alanları öne çıkarır; eğitim yolları yalnızca yüksek düzeydeki alanlar içindir.
    const rm = rep.roadmap!;
    expect(rm.standout.map((s) => s.title), where).toEqual(tops.map((t) => t.title.slice(3)));
    if (rm.settings) {
      expect(exp.anyHigh, where).toBe(true);
      for (const line of rm.settings.items) {
        const name = NAMES.find((n) => line.startsWith(`${n}:`))!;
        const t = tops.find((x) => x.title.endsWith(name));
        expect(t && HIGH_LABELS.includes(t.badge!.split(' · ')[0]), `${where}: ${line.slice(0, 40)}`).toBe(true);
      }
    } else {
      expect(exp.anyHigh && tops.some((t) => HIGH_LABELS.includes(t.badge!.split(' · ')[0])), where).toBe(false);
    }
    // Belirgin olmayan bir alanın kartı sözlük tanımı değil, orta düzeyde ilgiyi söyleyen cümledir.
    for (const t of tops.filter((x) => x.badge!.startsWith('Orta'))) {
      expect(t.text, where).toMatch(audience === 'parent' ? /^Çocuğunuz bu alandaki işlere orta düzeyde ilgi duyduğunu belirtiyor \(.+\)\.$/ : /^Bu alandaki işlere orta düzeyde ilgi duyuyorsun \(.+\)\.$/);
    }
    expect(JSON.stringify(rep), where).not.toMatch(/undefined|NaN/);
  }
  return r;
}

describe('Mesleki İlgi Profili raporu: öne çıkan alanlar düzeye göre', () => {
  it('bütün düzey birleşimlerinde kod, meslek, kartlar ve yol haritası birbiriyle tutarlı', () => {
    const levels = [1, 3, 5];
    let n = 0;
    for (let c = 0; c < levels.length ** 6; c++) {
      const combo = SCALES.map((_, i) => levels[Math.floor(c / levels.length ** i) % levels.length]);
      check(combo.map(flat), combo.join(''));
      n++;
    }
    expect(n).toBe(729);
  }, 300_000);

  it('hiçbir etkinlikten hoşlanmayana ilgi kodu ve meslek verilmez', () => {
    const r = check(SCALES.map(() => flat(1)), 'hepsi 1');
    expect(r.student.items.map((i) => i.title)).toEqual(['Bütün alanlar']);
    expect(r.student.cautions.join(' ')).toContain('ilgi kodu ve örnek meslekler verilmedi');
    // Yol haritasının notu kendi başına okunur (özne var) ve raporla çelişmez.
    expect(r.student.roadmap!.standoutNote).toBe(
      'Etkinliklerin çoğundan pek hoşlanmayacağını belirttiğin için hiçbir alan öne çıkarılmadı. Bu olağan bir durum; aşağıdaki haftalarda farklı alanları denemen için küçük adımlar var.',
    );
    expect(r.parent.roadmap!.standoutNote).toMatch(/^Çocuğunuz etkinliklerin çoğundan/);
    expect(r.parent.roadmap!.standoutNote).not.toContain('ayrışmamış');
  });

  it('her etkinliğe aynı orta cevap: öne çıkan alan yok', () => {
    const r = check(SCALES.map(() => flat(3)), 'hepsi 3');
    expect(r.student.keyFigures).toEqual([]);
    expect(r.student.cautions.join(' ')).toContain('Bütün alanlarda aynı puan çıktı');
  });

  it('hiçbir alan yüksek değilken en yüksek iki orta alan gösterilir, kod ve yol verilmez', () => {
    // R ortalaması 3,25; I 3,0; geri kalanlar düşük.
    const r = check([[3, 3, 3, 3, 3, 3, 4, 4], flat(3), flat(1), flat(2), flat(1), flat(2)], 'orta');
    expect(r.student.keyFigures[0].label).toBe('En yüksek çıkan alanın');
    expect(r.student.items.slice(0, 2).map((i) => i.title)).toEqual(['1. Gerçekçi', '2. Araştırmacı']);
    expect(r.student.roadmap!.settings).toBeNull();
    expect(r.student.cautions.join(' ')).toContain('Hiçbir alanda belirgin (yüksek düzeyde) bir ilgi çıkmadı');
  });

  it('tek yüksek alan: kod tek harf olabilir, düşük alanlar koda girmez', () => {
    const r = check([flat(5), flat(1), flat(1), flat(2), flat(1), flat(2)], 'tek');
    expect(r.student.keyFigures[0]).toMatchObject({ label: 'İlgi kodu', value: 'R' });
    expect(r.student.roadmap!.settings!.items).toHaveLength(1);
  });

  it('eşit puanlar açıkça söylenir; birebir eşitlik bir harfi belirliyorsa kod eşitlikten önce kesilir', () => {
    // S ve C eşit (5,0), sonra A: kodun harfleri belli, yalnızca S ile C'nin sırası yer değiştirebilir.
    const sc = check([flat(2), flat(2), flat(4), flat(5), flat(2), flat(5)], 'S=C');
    expect(sc.student.keyFigures[0].value).toBe('SCA');
    expect(sc.student.keyFigures[0].note).toBe('Sosyal (S) · Düzenli (C) · Sanatçı (A). Harfler, alanların uluslararası kullanılan İngilizce adlarının baş harfleridir.');
    expect(sc.student.cautions).toContain('Sosyal ve Düzenli alanlarındaki puanların aynı ya da neredeyse aynı; ilgi kodunda bu alanların sırası yer değiştirebilir.');
    expect(sc.student.items.slice(0, 3).map((i) => [i.title, i.badge])).toEqual([
      ['1. Sosyal', 'Çok yüksek ilgi · eşit puan'],
      ['1. Düzenli', 'Çok yüksek ilgi · eşit puan'],
      ['3. Sanatçı', 'Yüksek ilgi'],
    ]);
    // R, I, A ve C eşit (4,0): dördü de gösterilir; birinci harf bile eşitliğe dayandığı için kod ve meslek verilmez.
    const four = check([flat(4), flat(4), flat(4), flat(2), flat(2), flat(4)], 'RIAC');
    expect(four.student.keyFigures).toEqual([{ label: 'En yüksek çıkan alanların', value: 'Gerçekçi · Araştırmacı · Sanatçı · Düzenli', note: 'eşit puanla' }]);
    expect(four.parent.cautions.join(' ')).toContain(
      'Gerçekçi, Araştırmacı, Sanatçı ve Düzenli alanlarındaki puanlar aynı ya da neredeyse aynıdır; bu yüzden ilgi kodu ve örnek meslekler verilmedi; bu alanların hepsi birlikte düşünülebilir.',
    );
    // Üçüncü ile dördüncü alan eşit (3,0): ikisi de gösterilir, kod iki harfle kalır.
    const third = check([flat(5), flat(4), flat(3), flat(3), flat(1), flat(1)], '3=4');
    expect(third.student.keyFigures[0].value).toBe('RI');
    expect(third.student.items.slice(0, 4).map((i) => i.title)).toEqual(['1. Gerçekçi', '2. Araştırmacı', '3. Sanatçı', '3. Sosyal']);
    expect(third.student.cautions).toContain(
      'Sanatçı ve Sosyal alanlarındaki puanların aynı ya da neredeyse aynı; bu yüzden ilgi kodunda yalnızca ilk iki harf verildi; bu alanların hepsini birlikte düşünebilirsin.',
    );
    // Neredeyse eşit (3,875 ve 3,75): üçüncü alan bu alanlardan herhangi biri olabilir; kod üç harfli kalır.
    const near = check([flat(5), [5, 4], [4, 4, 4, 4, 4, 4, 4, 3], [4, 4, 4, 4, 4, 4, 3, 3], flat(1), flat(1)], 'yakın');
    expect(near.student.keyFigures[0].value).toBe('RIA');
    expect(near.student.cautions).toContain('Sanatçı ve Sosyal alanlarındaki puanların aynı ya da neredeyse aynı; üçüncü alanını bu alanlardan herhangi biri olarak düşünebilirsin.');
  });

  it('profil belirginleşmemişse (farklar küçük) kod gösterilir ama "en belirgin" denmez ve meslek listesi verilmez', () => {
    // Puanlar 4,0–4,5: hepsi yüksek, farklar küçük.
    const r = check([[4, 4, 4, 5], [4, 5], [4, 4, 5, 5, 5, 5, 5, 5], flat(4), [4, 5, 5, 5], [4, 4, 4, 4, 4, 4, 4, 5]], 'düz');
    for (const rep of [r.student, r.parent]) {
      expect(rep.keyFigures[0].label).toBe('İlgi kodu');
      expect(rep.items.some((i) => /örnek meslekler/.test(i.title))).toBe(false);
      expect(rep.itemsTitle).toMatch(/^En yüksek çıkan alan/);
      expect(rep.cautions.join(' ')).toContain('Farklar küçük olduğu için örnek meslek listesi verilmedi.');
    }
  });

  it('meslek listesinin başlığı ilişkiyi söyler, bir uygunluk yargısı vermez; grafiğin notu ilginin yetenek olmadığını hatırlatır', () => {
    const r = check([flat(5), flat(1), flat(4), flat(2), flat(1), flat(3)], 'meslek');
    expect(r.student.items.find((i) => /örnek meslekler/.test(i.title))!.title).toBe('İlgilerinle ilişkili örnek meslekler');
    expect(r.parent.items.find((i) => /örnek meslekler/.test(i.title))!.title).toBe('Bu ilgilerle ilişkili örnek meslekler');
    expect(r.student.chartNote).toBe(
      'Altıgende yan yana duran alanlar birbirine benzer. Değerler 1 (hiç hoşlanmam) ile 5 (çok hoşlanırım) arasındadır. İlgi, yetenek demek değildir: sonuç neyi yapabileceğini değil, neyi yapmaktan hoşlandığını gösterir.',
    );
    expect(r.parent.chartNote).toContain('sonuç çocuğunuzun neyi yapabileceğini değil');
    // Cevap seçeneklerinin adları grafiğin notuyla aynı.
    expect(meslekiIlgi.options.map((o) => o.label.toLocaleLowerCase('tr-TR'))).toEqual(expect.arrayContaining(['hiç hoşlanmam', 'çok hoşlanırım']));
    expect(RIASEC_TYPES.R.student).toMatch(/^Ellerinle bir şey yapmaktan/);
    expect(meslekiIlgi.tagline).toContain('bu ilgilerle ilişkili örnek meslekleri');
  });

  it('mezun (13. sınıf): eğitim yollarında lise yolları ve okul anılmaz', () => {
    const levels = [flat(5), flat(1), flat(4), flat(2), flat(1), flat(3)];
    const grad = evaluate(SLUG, body(levels, 13));
    const tenth = evaluate(SLUG, body(levels, 10));
    for (const audience of ['student', 'parent'] as const) {
      const g = grad[audience].roadmap!.settings!;
      expect(g.title).toBe('Eğitim ve meslek planı için');
      for (const line of g.items) {
        expect(line).not.toContain('Lise:');
        expect(line).toMatch(/^[^:]+: Üniversite: /);
      }
      expect(g.note).toContain('bir rehberlik uzmanıyla');
      expect(g.note).not.toMatch(/öğretmen|okul/);
      const t = tenth[audience].roadmap!.settings!;
      expect(t.title).toBe('Okul ve meslek planı için');
      expect(t.items[0]).toContain('Lise: ');
    }
  });

  it('yol haritası: keşif önerileri "en belirgin" demez; veliye ilk hafta ilgileri gözlemlemeyi önerir', () => {
    const r = check([flat(3), flat(1), flat(3), flat(2), flat(1), flat(2)], 'orta-orta');
    expect(r.student.roadmap!.study.intro).toContain('en üstte çıkan ilgi alanların');
    expect(r.parent.roadmap!.study.intro).toContain('çocuğunuzun en üstte çıkan ilgi alanları');
    expect(r.parent.roadmap!.weeks[0].text).toBe(
      'Raporu çocuğunuzla birlikte okuyun ve hangi alanların ona uyduğunu sorun. Bu hafta onu en çok hangi etkinliklerin heyecanlandırdığını birlikte gözlemleyin.',
    );
  });
});
