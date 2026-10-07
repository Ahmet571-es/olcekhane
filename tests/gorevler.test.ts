import { describe, expect, it, vi } from 'vitest';
import { INSTRUMENTS, publicInstruments, solvableInstruments } from '@/content/instruments';
import { durGitGorevi } from '@/content/instruments/dur-git';
import { renkKelimeGorevi } from '@/content/instruments/renk-kelime';
import { siraylaBirlestirme } from '@/content/instruments/sirayla-birlestirme';
import { evaluate } from '@/lib/assessment/evaluate';
import { mirrorLayout, pathLength, segmentsCross, trailLayoutProblems } from '@/lib/instruments/sequences';
import type { ColorWordTask, GoNoGoTask, TrailTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { TaskInputError, scoreColorWord, scoreGoNoGo, scoreTrail } from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { colorWordBody, goNoGoBody, trailBody } from './helpers/bodies';

const rk = renkKelimeGorevi.tasks[0] as ColorWordTask;
const dg = durGitGorevi.tasks[0] as GoNoGoTask;
const sb = siraylaBirlestirme.tasks[0] as TrailTask;
const SLUGS = ['renk-kelime-gorevi', 'dur-git-gorevi', 'sirayla-birlestirme-gorevi'];
const all = (r: { items: { title: string; badge?: string; text: string }[]; cautions: string[] }) =>
  [...r.items.flatMap((i) => [i.title, i.badge ?? '', i.text]), ...r.cautions].join(' ');

describe('Renk-kelime uyaranları', () => {
  it('iki bölüm; her bölümde 24 uyumlu ve 24 uyumsuz, dengeli', () => {
    expect(rk.trials).toHaveLength(96);
    for (let b = 0; b < 2; b++) {
      const block = rk.trials.slice(b * 48, b * 48 + 48);
      const cong = block.filter((t) => t.word === t.ink);
      expect(cong).toHaveLength(24);
      for (let c = 0; c < 4; c++) {
        expect(cong.filter((t) => t.ink === c), `uyumlu ${c}`).toHaveLength(6);
        expect(block.filter((t) => t.ink === c), `renk ${c}`).toHaveLength(12);
        expect(block.filter((t) => t.word === c), `kelime ${c}`).toHaveLength(12);
        for (let w = 0; w < 4; w++) if (w !== c) expect(block.filter((t) => t.word === w && t.ink === c)).toHaveLength(2);
      }
      for (let i = 1; i < block.length; i++) {
        expect(block[i].ink, `bölüm ${b} deneme ${i}`).not.toBe(block[i - 1].ink);
        expect(block[i].word, `bölüm ${b} deneme ${i}`).not.toBe(block[i - 1].word);
      }
      for (let i = 3; i < block.length; i++) {
        const w = block.slice(i - 3, i + 1).map((t) => t.word === t.ink);
        expect(w.every((x) => x === w[0]), `bölüm ${b} deneme ${i}`).toBe(false);
      }
    }
    expect(rk.practice).toHaveLength(8);
    expect(rk.practice.filter((t) => t.word === t.ink)).toHaveLength(4);
  });

  it('renk denemesi: her renk iki kez, art arda aynı renk yok', () => {
    expect(rk.check).toHaveLength(8);
    for (let c = 0; c < 4; c++) expect(rk.check.filter((x) => x === c)).toHaveLength(2);
    for (let i = 1; i < rk.check.length; i++) expect(rk.check[i]).not.toBe(rk.check[i - 1]);
    expect(rk.checkLimit).toBe(2);
    expect(new Set(rk.colors.map((c) => c.ink.toLowerCase())).size).toBe(4);
  });
});

describe('Dur-git uyaranları', () => {
  it('iki bölüm; her bölümde 45 bas harfi ve 15 X; kurallara uygun sıra', () => {
    expect(dg.trials).toHaveLength(120);
    for (let b = 0; b < 2; b++) {
      const block = dg.trials.slice(b * 60, b * 60 + 60);
      expect(block.filter((t) => !t.go)).toHaveLength(15);
      expect(block.every((t) => t.go === (t.letter !== dg.stop))).toBe(true);
      expect(block.slice(0, 3).every((t) => t.go)).toBe(true);
      let run = 0;
      for (let i = 0; i < block.length; i++) {
        if (!block[i].go) expect(block[i - 1].go && block[i - 2].go, `X'ten önce iki bas harfi: ${b}/${i}`).toBe(true);
        if (i > 0 && block[i].go) expect(block[i].letter, `aynı harf art arda: ${b}/${i}`).not.toBe(block[i - 1].letter);
        run = block[i].go ? run + 1 : 0;
        expect(run).toBeLessThanOrEqual(8);
      }
      const counts = new Map<string, number>();
      for (const t of block.filter((x) => x.go)) counts.set(t.letter, (counts.get(t.letter) ?? 0) + 1);
      expect(counts.size).toBe(8);
      expect([...counts.values()].every((n) => n === 5 || n === 6)).toBe(true);
    }
    expect(dg.practice.filter((t) => !t.go)).toHaveLength(3);
    dg.practice.forEach((t, i) => {
      if (!t.go) expect(dg.practice[i - 1].go && dg.practice[i - 2].go).toBe(true);
    });
    expect(dg.stimulusMs).toBeLessThan(dg.responseMs);
  });
});

describe('Sırayla birleştirme yerleşimleri', () => {
  const layouts = sb.parts.flatMap((p) => [
    { name: `${p.key}`, labels: p.labels, points: p.points },
    { name: `${p.key}-alıştırma`, labels: p.practice.labels, points: p.practice.points },
  ]);

  it('birinci bölüm 1–16, ikinci bölüm 1-A-2-B … 8-G (Türk alfabesi sırası); iki bölümde eşit daire', () => {
    expect(sb.parts[0].labels).toEqual(Array.from({ length: 16 }, (_, i) => String(i + 1)));
    expect(sb.parts[1].labels.join('')).toBe('1A2B3C4Ç5D6E7F8G');
    expect(sb.parts[0].practice.labels).toHaveLength(sb.parts[1].practice.labels.length);
  });

  it('daireler kurallara uyar: kenara ve birbirine yakın değil, çizgiler dairelerin üstünden geçmez ve birbirini kesmez', () => {
    for (const l of layouts) {
      expect(l.points, l.name).toHaveLength(l.labels.length);
      expect(trailLayoutProblems(l.points), l.name).toEqual([]);
    }
  });

  it('ikinci bölüm birinci bölümün yansıması: yol uzunluğu ve adımlar birebir aynı', () => {
    const [a, b] = sb.parts;
    expect(b.points).toEqual(mirrorLayout(a.points));
    expect(b.practice.points).toEqual(mirrorLayout(a.practice.points));
    expect(pathLength(b.points)).toBeCloseTo(pathLength(a.points), 6);
    // Yansıma yerleşimi gerçekten değiştirir (aynı konumda daire yok denecek kadar az).
    const same = a.points.filter((p, i) => Math.hypot(p.x - b.points[i].x, p.y - b.points[i].y) < 5).length;
    expect(same).toBeLessThanOrEqual(2);
  });

  it('kesişme denetimi', () => {
    expect(segmentsCross({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 0 })).toBe(true);
    expect(segmentsCross({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 5 }, { x: 10, y: 5 })).toBe(false);
  });

  it('uyaranlar belirlenimci: yeniden yüklemede aynı', async () => {
    vi.resetModules();
    const a = await import('@/content/instruments/sirayla-birlestirme');
    const b = await import('@/content/instruments/renk-kelime');
    const c = await import('@/content/instruments/dur-git');
    expect(JSON.stringify(a.siraylaBirlestirme.tasks)).toBe(JSON.stringify(siraylaBirlestirme.tasks));
    expect(JSON.stringify(b.renkKelimeGorevi.tasks)).toBe(JSON.stringify(renkKelimeGorevi.tasks));
    expect(JSON.stringify(c.durGitGorevi.tasks)).toBe(JSON.stringify(durGitGorevi.tasks));
  });
});

describe('Görev puanlama', () => {
  const cwInput = (
    f: (t: { word: number; ink: number }, i: number) => { response: number | null; rtMs: number | null },
    check: (ink: number) => number | null = (ink) => ink + 1,
  ) => [
    ...rk.trials.map((t, index) => ({ index, ...f(t, index) })),
    ...rk.check.map((ink, k) => ({ index: rk.trials.length + k, response: check(ink), rtMs: 700 })),
  ];

  it('renk-kelime: doğruluk, tipik süre ve renk-kelime etkisi', () => {
    const { result } = scoreColorWord(rk, cwInput((t) => ({ response: t.ink + 1, rtMs: t.word === t.ink ? 600 : 750 })));
    expect(result).toMatchObject({ accuracy: 1, medianRtCongruent: 600, medianRtIncongruent: 750, interferenceMs: 150, checkErrors: 0, checkFlag: false });
    // Uyumsuzlarda hep kelimenin söylediği renge basılırsa (okuma): uyumsuz doğruluk sıfır, hepsi kelime hatası.
    const read = scoreColorWord(rk, cwInput((t) => ({ response: t.word + 1, rtMs: 500 }))).result;
    expect(read).toMatchObject({ accCongruent: 1, accIncongruent: 0, interferenceMs: null, wordErrors: 48, otherErrors: 0 });
    // Ne renge ne kelimeye basılan hatalar ayrı sayılır.
    const other = scoreColorWord(rk, cwInput((t) => ({ response: ([0, 1, 2, 3].find((c) => c !== t.ink && c !== t.word) as number) + 1, rtMs: 500 }))).result;
    expect(other).toMatchObject({ wordErrors: 0, otherErrors: 48, congruentErrors: 48 });
    // Çok erken ve süre aşımı doğru sayılmaz; süre dolduktan sonra gelen cevap da süre aşımıdır (hata vermez).
    const odd = scoreColorWord(rk, cwInput((t) => ({ response: t.ink + 1, rtMs: t.word === t.ink ? 120 : 3400 }))).result;
    expect(odd).toMatchObject({ accuracy: 0, anticipations: 48, timeouts: 48 });
  });

  it('renk-kelime: renk denemesindeki yanlışlar sayılır; iki ve üstü uyarı', () => {
    const wrongTwo = (ink: number) => (ink === 0 ? 3 : ink + 1); // kırmızıyı iki kez yeşil sanmak
    const r = scoreColorWord(rk, cwInput((t) => ({ response: t.ink + 1, rtMs: 600 }), wrongTwo)).result;
    expect(r).toMatchObject({ checkTrials: 8, checkErrors: 2, checkFlag: true });
    const one = scoreColorWord(rk, cwInput((t) => ({ response: t.ink + 1, rtMs: 600 }), (ink) => (ink === 1 ? null : ink + 1))).result;
    expect(one).toMatchObject({ checkErrors: 0, checkFlag: false });
  });

  it('renk-kelime: en az 10 doğru cevap olmadan tipik süre hesaplanmaz', () => {
    let incCorrect = 0;
    const few = scoreColorWord(
      rk,
      cwInput((t) => {
        if (t.word === t.ink) return { response: t.ink + 1, rtMs: 600 };
        incCorrect++;
        return { response: incCorrect <= 9 ? t.ink + 1 : t.word + 1, rtMs: 700 };
      }),
    ).result;
    expect(few.medianRtCongruent).toBe(600);
    expect(few.medianRtIncongruent).toBeNull();
    expect(few.interferenceMs).toBeNull();
  });

  it('renk-kelime: eksik ya da geçersiz cevap reddedilir', () => {
    const full = cwInput((t) => ({ response: t.ink + 1, rtMs: 600 }));
    expect(() => scoreColorWord(rk, full.slice(1))).toThrow(TaskInputError);
    expect(() => scoreColorWord(rk, full.slice(0, -1))).toThrow(TaskInputError);
    expect(() => scoreColorWord(rk, [{ ...full[0], response: 5 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreColorWord(rk, [{ ...full[0], rtMs: -5 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreColorWord(rk, [...full, { index: 200, response: 1, rtMs: 600 }])).toThrow(TaskInputError);
  });

  it('dur-git: durma oranı, basma oranı, tipik tepki süresi', () => {
    const input = (f: (t: { go: boolean }) => number | null) =>
      dg.trials.map((t, index) => {
        const rt = f(t);
        return { index, response: rt === null ? null : 1, rtMs: rt };
      });
    const good = scoreGoNoGo(dg, input((t) => (t.go ? 400 : null))).result;
    expect(good).toMatchObject({ goTrials: 90, stopTrials: 30, hits: 90, commissions: 0, omissions: 0, stopRate: 1, hitRate: 1, medianRt: 400 });
    const allPress = scoreGoNoGo(dg, input(() => 380)).result;
    expect(allPress.stopRate).toBe(0);
    expect(allPress.commissions).toBe(30);
    const early = scoreGoNoGo(dg, input((t) => (t.go ? 90 : null))).result;
    expect(early.anticipations).toBe(90);
    expect(early.hitRate).toBe(0);
    // Cevap penceresinden sonra gelen basış sayılmaz (hata vermez).
    const late = scoreGoNoGo(dg, input((t) => (t.go ? 400 : 5000))).result;
    expect(late).toMatchObject({ commissions: 0, stopRate: 1 });
    // Az sayıda doğru basıştan tipik süre hesaplanmaz.
    let n = 0;
    const few = scoreGoNoGo(dg, input((t) => (t.go && n++ < 9 ? 400 : null))).result;
    expect(few.hits).toBe(9);
    expect(few.medianRt).toBeNull();
    expect(() => scoreGoNoGo(dg, input(() => null).slice(2))).toThrow(TaskInputError);
    expect(() => scoreGoNoGo(dg, [{ index: 0, response: 2, rtMs: 300 }, ...input(() => null).slice(1)])).toThrow(TaskInputError);
    expect(() => scoreGoNoGo(dg, [{ index: 0, response: 1, rtMs: null }, ...input(() => null).slice(1)])).toThrow(TaskInputError);
  });

  it('sırayla birleştirme: süre, yanlış dokunuş, tamamlanmayan bölüm, oran ve fark', () => {
    const run = (taps: number[], step = 1000) => ({ taps, times: taps.map((_, i) => (i + 1) * step) });
    const a = sb.parts[0].labels.length;
    const b = sb.parts[1].labels.length;
    const seq = (n: number) => Array.from({ length: n }, (_, i) => i);
    const perfect = scoreTrail(sb, [
      { index: 0, response: run(seq(a)), rtMs: a * 1000 },
      { index: 1, response: run(seq(b), 2000), rtMs: b * 2000 },
    ]).result;
    expect(perfect.parts.map((p) => [p.completed, p.errors, p.timeMs])).toEqual([
      [true, 0, a * 1000],
      [true, 0, b * 2000],
    ]);
    expect(perfect.ratio).toBeCloseTo((b * 2000) / (a * 1000), 2);
    expect(perfect.diffMs).toBe(b * 2000 - a * 1000);
    // 0, 2 (yanlış), 1, 0 (önceki: yok sayılır), 2 …
    const withErrors = scoreTrail(sb, [
      { index: 0, response: run([0, 2, 1, 0, ...seq(a).slice(2)]), rtMs: 20_000 },
      { index: 1, response: run(seq(5)), rtMs: 120_000 },
    ]).result;
    expect(withErrors.parts[0]).toMatchObject({ completed: true, errors: 1, reached: a });
    expect(withErrors.parts[1]).toMatchObject({ completed: false, reached: 5, timeMs: sb.maxMs });
    expect(withErrors.ratio).toBeNull();
    expect(withErrors.diffMs).toBeNull();
    // Geriye giden zamanlar düzeltilir; en uzun süreden sonraki son dokunuş bölümü tamamlamaz.
    const shaky = scoreTrail(sb, [
      { index: 0, response: { taps: seq(a), times: seq(a).map((i) => (i === 3 ? 1500 : (i + 1) * 1000)) }, rtMs: a * 1000 },
      { index: 1, response: { taps: seq(b), times: seq(b).map((i) => (i === b - 1 ? sb.maxMs + 3000 : (i + 1) * 1000)) }, rtMs: sb.maxMs },
    ]).result;
    expect(shaky.parts[0]).toMatchObject({ completed: true, timeMs: a * 1000 });
    expect(shaky.parts[1]).toMatchObject({ completed: false, reached: b });
    expect(() => scoreTrail(sb, [{ index: 0, response: run([0, 99]), rtMs: 1 }, { index: 1, response: run([0]), rtMs: 1 }])).toThrow(TaskInputError);
    expect(() => scoreTrail(sb, [{ index: 0, response: { taps: [0, 1], times: [5] }, rtMs: 1 }, { index: 1, response: run([0]), rtMs: 1 }])).toThrow(
      TaskInputError,
    );
    expect(() => scoreTrail(sb, [{ index: 0, response: run(seq(a)), rtMs: 1 }])).toThrow(TaskInputError);
  });
});

describe('Görev raporları', () => {
  it('renk-kelime: süre grafiği ve üç sonuç; öğrenci ve veli ayrı', () => {
    const r = evaluate('renk-kelime-gorevi', colorWordBody());
    for (const rep of [r.student, r.parent]) {
      expect(rep.chart?.type).toBe('bars');
      const rows = rep.chart?.type === 'bars' ? rep.chart.rows : [];
      expect(rows.map((x) => x.label)).toEqual(['Kelime ile renk aynıyken', 'Kelime ile renk farklıyken']);
      expect(rows.map((x) => x.valueLabel)).toEqual(['0,65 sn', '0,80 sn']);
      expect(rep.items.map((i) => i.title)).toEqual(['Doğru cevaplar', 'Cevap hızı', 'Renk-kelime etkisi']);
      expect(rep.items[0].badge).toBe('%100 doğru');
      expect(rep.items[2].badge).toBe('Kelime ile renk farklıyken 0,15 sn daha yavaş');
      expect(rep.itemsTitle.startsWith('Sonuç')).toBe(true);
    }
    expect(r.student.items[0].text).toContain('her seferinde doğru buldun');
    expect(r.parent.items[2].text.toLocaleLowerCase('tr-TR')).toContain('çocuğunuz');
    expect(r.student.items.every((i) => !i.text.toLocaleLowerCase('tr-TR').includes('çocuğunuz'))).toBe(true);
    expect(r.student.cautions).toEqual([]);
    expect(all(r.parent)).not.toMatch(/herkes/);
  });

  it('renk-kelime: küçük fark "belirgin değil"; okuma hataları ile renk karışması ayrı yorumlanır', () => {
    const small = evaluate('renk-kelime-gorevi', colorWordBody((t) => ({ choice: t.ink, rtMs: t.word === t.ink ? 650 : 680 })));
    expect(small.student.items[2].badge).toBe('Belirgin bir fark görülmedi');
    // Uyumsuz denemelerin dörtte birinde kelimenin söylediği renge basılır: okuma alışkanlığı.
    const reading = evaluate('renk-kelime-gorevi', colorWordBody((t, i) => ({ choice: t.word !== t.ink && i % 4 === 1 ? t.word : t.ink, rtMs: 700 })));
    expect(reading.parent.items[0].text).toContain('okuma alışkanlığının');
    // Aynı sayıda hata ama başka renklere: okuma yorumu yapılmaz.
    const other = (t: { word: number; ink: number }) => [0, 1, 2, 3].find((c) => c !== t.ink && c !== t.word) as number;
    const mixed = evaluate('renk-kelime-gorevi', colorWordBody((t, i) => ({ choice: t.word !== t.ink && i % 4 === 1 ? other(t) : t.ink, rtMs: 700 })));
    expect(mixed.parent.items[0].text).not.toContain('okuma alışkanlığı');
    expect(mixed.parent.items[0].text).toContain('başka bir renge');
    expect(mixed.parent.cautions.join(' ')).toContain('ne yazının rengine ne de kelimeye');
    // Uyumsuzların yarısında kelimeye basılırsa (düşük doğruluk) da okuma yorumu yapılır.
    const low = evaluate('renk-kelime-gorevi', colorWordBody((t, i) => ({ choice: t.word !== t.ink && i % 2 ? t.word : t.ink, rtMs: 700 })));
    expect(low.student.items[0].text).toContain('kelimeyi okumak, yazının rengine bakmanın önüne geçti');
  });

  it('renk-kelime: renk denemesinde renkler karıştırılırsa uyarı ve okuma yorumu yok', () => {
    const r = evaluate(
      'renk-kelime-gorevi',
      colorWordBody(
        (t, i) => ({ choice: t.word !== t.ink && i % 2 ? t.word : t.ink, rtMs: 700 }),
        (ink) => (ink === 0 ? 2 : ink === 2 ? 0 : ink),
      ),
    );
    expect(r.parent.cautions.join(' ')).toContain('renk denemesinde 8 denemenin 4 tanesinde');
    expect(r.parent.items[0].text).not.toContain('okuma alışkanlığı');
    // Bütün hatalar kelime hatası: "başka bir renge basıldı" da denmez.
    expect(r.parent.items[0].text).not.toContain('başka bir renge');
    expect(r.parent.items[0].text).toContain('renk körlüğü');
    expect(r.student.items[0].text).toContain('renk denemesinde bazı renkleri birbirine karıştırdın');
  });

  it('renk-kelime: hata türü çoğunluğa göre söylenir (süre aşımı, kelime, başka renk)', () => {
    // Uyumsuz denemelerde 10 süre aşımı ve 1 kelime hatası: okuma yorumu yapılmaz, süre aşımı söylenir.
    let k = 0;
    const timeouts = evaluate(
      'renk-kelime-gorevi',
      colorWordBody((t) => {
        if (t.word === t.ink) return { choice: t.ink, rtMs: 650 };
        k++;
        return k <= 10 ? { choice: null, rtMs: null } : k === 11 ? { choice: t.word, rtMs: 700 } : { choice: t.ink, rtMs: 800 };
      }),
    );
    expect(timeouts.student.items[0].text).toContain('süre içinde cevap vermedin');
    expect(timeouts.student.items[0].text).not.toContain('kelimenin söylediği renge');
    // Uyumsuzların hiçbirinde cevap yok (düşük doğruluk): çoğunda süre aşımı.
    const none = evaluate('renk-kelime-gorevi', colorWordBody((t) => (t.word === t.ink ? { choice: t.ink, rtMs: 650 } : { choice: null, rtMs: null })));
    expect(none.parent.items[0].text).toContain('süre içinde cevap vermedi ya da kelimeye bakmadan çok erken bastı');
    expect(none.parent.items[0].text).not.toContain('rengini bulmakta zorlandı');
    expect(none.parent.items[0].text).not.toContain('başka bir renge');
    // Hiç doğru cevap yoksa "bir kısmında" değil "çoğunda" denir.
    const zero = evaluate('renk-kelime-gorevi', colorWordBody((t) => ({ choice: (t.ink + 1) % 4 === t.word ? (t.ink + 2) % 4 : (t.ink + 1) % 4, rtMs: 700 })));
    expect(zero.student.items[0].text).toContain('Denemelerin çoğunda yazının rengini bulmakta zorlandın');
  });

  it('renk-kelime: rastgele düğmelere basılırsa uyarı', () => {
    const r = evaluate('renk-kelime-gorevi', colorWordBody((t, i) => ({ choice: (t.ink + 1 + (i % 3)) % 4, rtMs: 700 })));
    expect(r.parent.cautions.join(' ')).toContain('Renk-kelime görevinde doğruluk düşük');
  });

  it('dur-git: oran grafiği ve üç sonuç; tam başarıda "her seferinde"', () => {
    const r = evaluate('dur-git-gorevi', goNoGoBody());
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => x.valueLabel)).toEqual(['%100', '%100']);
    expect(r.student.items.map((i) => i.badge)).toEqual(['Durma oranı %100', 'Basma oranı %100', 'Tipik tepki süresi 0,42 saniye']);
    expect(r.student.items[0].text).toContain('her seferinde durabildin');
    expect(r.student.items[1].text).toContain('hepsinde zamanında bastın');
    expect(all(r.parent)).not.toMatch(/herkes|son anda/);
  });

  it('dur-git: hız öne çıkan örüntü; erken basışlar ile kaçırmalar ayrı; az basışta durma oranı yorumlanmaz', () => {
    // Her harfte (X dahil) basan biri: durma oranı düşük, hız öne çıkar; X'lerde de basıldığı için uyarı.
    const fast = evaluate('dur-git-gorevi', goNoGoBody(() => 300));
    expect(fast.student.items[0].badge).toBe('Durma oranı %0');
    expect(fast.student.items[2].text).toContain('hız öne çıkıyor');
    expect(fast.parent.cautions.join(' ')).toContain('X harflerinin çoğunda da basılmış');
    // Bas harflerinin çoğunda harfe bakmadan erken basılır.
    const early = evaluate('dur-git-gorevi', goNoGoBody((t, i) => (t.go ? (i % 3 ? 90 : 420) : null)));
    expect(early.student.items[1].text).toContain('ona bakmadan bastın');
    expect(early.student.items[1].text).not.toContain('kaçırdın');
    expect(early.parent.cautions.join(' ')).toContain('çok erken basılmış');
    expect(early.student.items[0].text).toContain('tek başına bir şey söylemez');
    // Hiç basmayan biri: durma oranı %100 ama yorumlanmaz; tipik süre hesaplanamaz.
    const idle = evaluate('dur-git-gorevi', goNoGoBody(() => null));
    expect(idle.parent.items[0].text).toContain('tek başına yorumlanamaz: hiç basmayan');
    expect(idle.parent.items[1].text).toContain('çoğunu kaçırdı');
    expect(idle.parent.items[2].badge).toBe('Hesaplanamadı');
    expect(idle.parent.cautions.join(' ')).toContain('zamanında basılmamış; görev yarıda');
    // Her basış harfe bakmadan (90 ms): "hiç basmayan" gerekçesi yazılmaz, erken basış söylenir.
    const allEarly = evaluate('dur-git-gorevi', goNoGoBody(() => 90));
    expect(allEarly.student.items[0].text).toContain('çok erken bastığın için');
    expect(allEarly.student.items[0].text).not.toContain('hiç basmayan');
    expect(allEarly.student.items[1].text).toContain('harflerin çoğunda harf görünür görünmez');
    // 40 zamanında, 26 erken, 24 kaçırma: uyarı "yarısından çoğunda erken" demez.
    let i = 0;
    const split = evaluate(
      'dur-git-gorevi',
      goNoGoBody((t) => {
        if (!t.go) return null;
        i++;
        return i <= 40 ? 420 : i <= 66 ? 90 : null;
      }),
    );
    const note = split.parent.cautions.join(' ');
    expect(note).toContain('zamanında basılmamış; bunların çoğunda harfe bakılmadan');
    expect(note).not.toContain('yarısından çoğunda harfe bakılmadan');
  });

  it('sırayla birleştirme: bölüm süreleri, geçiş oranı ve fark', () => {
    const r = evaluate('sirayla-birlestirme-gorevi', trailBody(2000));
    const rows = r.parent.chart?.type === 'bars' ? r.parent.chart.rows : [];
    expect(rows.map((x) => x.label)).toEqual(['Sayılar', 'Sayılar ve harfler']);
    expect(rows.map((x) => x.valueLabel)).toEqual(['32,0 sn', '64,0 sn']);
    expect(r.parent.items.map((i) => i.badge)).toEqual(['32,0 saniye', '64,0 saniye', 'Birinci bölümün 2,0 katı']);
    expect(r.parent.items[2].text).toContain('Çocuğunuzun ikinci bölümü');
    expect(r.parent.items[2].text).toContain('32,0 saniye daha uzun');
    expect(all(r.parent)).not.toMatch(/herkes|kurallar arasında/);
  });

  it('sırayla birleştirme: fark yazılan sürelerden hesaplanır; ikinci bölüm kısaysa öyle yazılır', () => {
    const withTimes = (ta: number, tb: number) => {
      const body = trailBody(2000);
      const parts = (body.data as { blocks: Record<string, { response: { taps: number[]; times: number[] }; rtMs: number }[]> }).blocks.sirayla;
      for (const [p, end] of [
        [parts[0], ta],
        [parts[1], tb],
      ] as const) {
        const n = p.response.times.length;
        p.response.times = p.response.times.map((_, j) => Math.round(((j + 1) * end) / n));
        p.rtMs = end;
      }
      return evaluate('sirayla-birlestirme-gorevi', body);
    };
    const r = withTimes(30_149, 45_251);
    expect(r.parent.items[2].text).toContain('Birinci bölüm 30,1 sn · ikinci bölüm 45,3 sn · fark 15,2 sn.');
    expect(r.parent.items[0].badge).toBe('30,1 saniye');
    const shorter = withTimes(40_000, 24_000);
    expect(shorter.parent.items[2].badge).toBe('İkinci bölüm daha kısa sürdü');
    expect(shorter.parent.items[2].text).toContain('ikinci bölüm 16,0 sn daha kısa');
  });

  it('sırayla birleştirme: iki bölüm yaklaşık aynı sürerse öyle söylenir', () => {
    const body = trailBody(2000);
    const blocks = (body.data as { blocks: Record<string, { index: number; response: { taps: number[]; times: number[] }; rtMs: number }[]> }).blocks;
    const b = blocks.sirayla[1];
    b.response.times = b.response.times.map((t) => Math.round(t / 1.9));
    b.rtMs = b.response.times[b.response.times.length - 1];
    const r = evaluate('sirayla-birlestirme-gorevi', body);
    expect(r.student.items[2].badge).toBe('İki bölüm yaklaşık aynı sürdü');
  });

  it('PDF raporu üretilir (Türkçe harfler ve grafik)', async () => {
    for (const [slug, body] of [
      ['renk-kelime-gorevi', colorWordBody()],
      ['dur-git-gorevi', goNoGoBody()],
      ['sirayla-birlestirme-gorevi', trailBody()],
    ] as const) {
      const pdf = await renderSimpleReportPdf(evaluate(slug, body).parent, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString(), slug).toBe('%PDF-');
    }
  }, 60_000);

  it('pilot olarak yayında (site sahibinin 2026-10-07 kararı: hoca onayı beklenmeden): listelerde ve site haritasında', () => {
    for (const slug of SLUGS) {
      expect(INSTRUMENTS.find((i) => i.slug === slug)?.status, slug).toBe('pilot');
      expect(solvableInstruments().some((i) => i.slug === slug), slug).toBe(true);
      expect(publicInstruments().some((i) => i.slug === slug), slug).toBe(true);
      expect(sitemap().some((u) => u.url.endsWith(`/testler/${slug}`)), slug).toBe(true);
    }
  });
});
