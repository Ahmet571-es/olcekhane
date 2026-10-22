import { describe, expect, it, vi } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { zihindeDondurme } from '@/content/instruments/zihinde-dondurme';
import { AssessmentError, evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { DISPARITIES, disparity, isAsymmetric, rotationBlocks, shapePath, shapeRadius } from '@/lib/instruments/rotation';
import { rng } from '@/lib/instruments/sequences';
import type { MentalRotationTask, RotationTrial } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { TaskInputError, scoreRotation } from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { rotationBody } from './helpers/bodies';

const SLUG = 'zihinde-dondurme';
const task = zihindeDondurme.tasks[0] as MentalRotationTask;
const all = (r: { items: { title: string; badge?: string; text: string }[]; cautions: string[] }) =>
  [...r.items.flatMap((i) => [i.title, i.badge ?? '', i.text]), ...r.cautions].join(' ');

/** Şeklin bütün dönüş ve yansımalarının ortak biçimi: iki şekil yalnızca döndürme/yansıtmayla birbirine dönüşüyorsa aynı çıkar. */
function canonical(cells: readonly (readonly [number, number])[]): string {
  const forms: string[] = [];
  const c = cells.map(([x, y]) => [x, y] as [number, number]);
  for (const mirror of [false, true]) {
    let cur = mirror ? c.map(([x, y]) => [-x, y] as [number, number]) : c;
    for (let i = 0; i < 4; i++) {
      const mx = Math.min(...cur.map(([x]) => x));
      const my = Math.min(...cur.map(([, y]) => y));
      forms.push(
        cur
          .map(([x, y]) => [x - mx, y - my])
          .sort((a, b) => a[0] - b[0] || a[1] - b[1])
          .join(';'),
      );
      cur = cur.map(([x, y]) => [-y, x] as [number, number]);
    }
  }
  return forms.sort()[0];
}

/** Sıra kurallarına uymayan yerler. */
function orderProblems(list: RotationTrial[]): string[] {
  const out: string[] = [];
  if (list.length && disparity(list[0].angle) !== 90) out.push('0: bölümün ilk denemesi 90 derece değil');
  list.forEach((t, i) => {
    if (i > 0 && list[i - 1].shape === t.shape) out.push(`${i}: aynı şekil art arda`);
    if (i >= 3 && [1, 2, 3].every((k) => list[i - k].mirror === t.mirror)) out.push(`${i}: aynı cevap 4 kez art arda`);
    if (i >= 2 && [1, 2].every((k) => disparity(list[i - k].angle) === disparity(t.angle))) out.push(`${i}: aynı açı 3 kez art arda`);
  });
  return out;
}

describe('Zihinde döndürme: şekiller ve denemeler', () => {
  it('sekiz özgün heksomino: simetrisiz, birbirinden farklı; alıştırma şekli ayrı', () => {
    expect(task.shapes).toHaveLength(8);
    for (const s of task.shapes) {
      expect(s.cells).toHaveLength(6);
      expect(isAsymmetric(s.cells)).toBe(true);
      expect(shapeRadius(s.cells)).toBeLessThanOrEqual(2.75);
      expect(shapePath(s.cells)).toMatch(/^M[-\d. L]+Z$/);
    }
    const forms = task.shapes.map((s) => canonical(s.cells));
    expect(new Set(forms).size).toBe(8);
    expect(isAsymmetric(task.practiceShape.cells)).toBe(true);
    expect(forms).not.toContain(canonical(task.practiceShape.cells));
    expect(shapeRadius(task.practiceShape.cells)).toBeLessThanOrEqual(2.75);
  });

  it('simetri denetimi ve dış çizgi', () => {
    // S dörtlüsü 180 derece döndürmede kendisi; T dörtlüsünün ayna simetrisi var; L beşlisinin hiç simetrisi yok.
    expect(isAsymmetric([[1, 0], [2, 0], [0, 1], [1, 1]])).toBe(false);
    expect(isAsymmetric([[0, 0], [1, 0], [2, 0], [1, 1]])).toBe(false);
    expect(isAsymmetric([[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]])).toBe(true);
    // 2×1 dikdörtgenin dış çizgisi dört köşedir; ortak kenar çizilmez.
    expect(shapePath([[0, 0], [1, 0]])).toBe('M-1 -0.5L1 -0.5L1 0.5L-1 0.5Z');
    expect(() => shapePath([[0, 0], [1, 1]])).toThrow();
    expect([0, 45, -45, 315, 90, -90, 135, -135, 180, -180, 360].map(disparity)).toEqual([0, 45, 45, 45, 90, 90, 135, 135, 180, 180, 0]);
  });

  it('80 deneme, iki bölüm: her şekil her açıda bir kez aynı, bir kez ayna görüntüsü; bölümler dengeli', () => {
    expect(task.trials).toHaveLength(80);
    expect(task.blocks).toBe(2);
    const seen = new Set(task.trials.map((t) => `${t.shape}/${disparity(t.angle)}/${t.mirror}`));
    expect(seen.size).toBe(80);
    for (const block of [task.trials.slice(0, 40), task.trials.slice(40)]) {
      for (const d of DISPARITIES) {
        const here = block.filter((t) => disparity(t.angle) === d);
        expect(here.filter((t) => !t.mirror)).toHaveLength(4);
        expect(here.filter((t) => t.mirror)).toHaveLength(4);
        if (d !== 0 && d !== 180) {
          for (const mirror of [false, true]) {
            const g = here.filter((t) => t.mirror === mirror);
            expect(g.filter((t) => t.angle > 0)).toHaveLength(2);
          }
        }
      }
      expect(orderProblems(block)).toEqual([]);
    }
    // Bir şeklin aynı açıdaki iki denemesi ayrı bölümlerde ve ters yönlerde.
    for (let s = 0; s < 8; s++) {
      for (const d of [45, 90, 135]) {
        const pair = task.trials.map((t, i) => ({ ...t, block: i < 40 ? 0 : 1 })).filter((t) => t.shape === s && disparity(t.angle) === d);
        expect(pair.map((t) => t.block).sort()).toEqual([0, 1]);
        expect(pair[0].angle).toBe(-pair[1].angle);
      }
    }
  });

  it('üretim kuralı farklı tohumlarla da çalışır', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const [a, b] = rotationBlocks(8, rng(seed));
      expect(a).toHaveLength(40);
      expect(orderProblems(a)).toEqual([]);
      expect(orderProblems(b)).toEqual([]);
    }
    expect(() => rotationBlocks(6, rng(1))).toThrow();
  });

  it('alıştırma: 3 aynı, 3 ayna görüntüsü; 0 ile 180 derece arası', () => {
    expect(task.practice.filter((p) => p.mirror)).toHaveLength(3);
    expect(new Set(task.practice.map((p) => disparity(p.angle)))).toEqual(new Set([0, 45, 90, 135, 180]));
  });

  it('uyaranlar belirlenimci: yeniden yüklemede aynı', async () => {
    vi.resetModules();
    const again = await import('@/content/instruments/zihinde-dondurme');
    expect(JSON.stringify(again.zihindeDondurme.tasks)).toBe(JSON.stringify(zihindeDondurme.tasks));
  });
});

describe('Zihinde döndürme: puanlama', () => {
  const input = (pick: Parameters<typeof rotationBody>[0]) =>
    (rotationBody(pick).data as { blocks: Record<string, { index: number; response: number | null; rtMs: number | null }[]> }).blocks[task.key];

  it('hatasız: doğruluk, açıya göre süre, az ve çok döndürülmüş şekiller', () => {
    const r = scoreRotation(task, input(undefined)).result;
    expect(r).toMatchObject({ n: 80, correct: 80, accuracy: 1, accSame: 1, accMirror: 1, timeouts: 0, anticipations: 0, sameShare: 0.5, sameSaidMirror: 0, mirrorSaidSame: 0 });
    expect(r.byAngle.map((a) => [a.angle, a.n, a.accuracy, a.medianRt])).toEqual([
      [0, 16, 1, 1200],
      [45, 16, 1, 1425],
      [90, 16, 1, 1650],
      [135, 16, 1, 1875],
      [180, 16, 1, 2100],
    ]);
    expect(r.medianRt).toBe(1650);
    expect([r.rtSmall, r.rtLarge, r.rotationCostMs]).toEqual([1313, 1988, 675]);
  });

  it('süre aşımı ve çok erken cevap doğru sayılmaz; süreler yalnızca doğru "aynı" denemelerden', () => {
    const r = scoreRotation(task, input((t) => (t.disparity === 180 ? { choice: null, rtMs: null } : t.disparity === 0 ? { choice: t.mirror ? 2 : 1, rtMs: 120 } : { choice: t.mirror ? 2 : 1, rtMs: 7600 }))).result;
    expect(r.timeouts).toBe(16 + 48);
    expect(r.anticipations).toBe(16);
    expect(r.correct).toBe(0);
    expect(r.medianRt).toBeNull();
    expect(r.byAngle.every((a) => a.medianRt === null)).toBe(true);
    // Ayna görüntülerinde yanlış cevaplar süreleri etkilemez; hep "Aynı" basmak doğruluğu yarıya indirir.
    const same = scoreRotation(task, input((t) => ({ choice: 1, rtMs: 900 + t.disparity }))).result;
    expect(same).toMatchObject({ accuracy: 0.5, accSame: 1, accMirror: 0, sameShare: 1, mirrorSaidSame: 40, sameSaidMirror: 0 });
    // Aynı şekle "Ayna görüntüsü" denenler ve bunların 135–180 derecede olanları ayrıca sayılır.
    const big = scoreRotation(task, input((t) => ({ choice: t.mirror ? 2 : t.disparity >= 135 ? 2 : 1, rtMs: 1500 }))).result;
    expect(big).toMatchObject({ sameSaidMirror: 16, sameSaidMirrorLarge: 16, mirrorSaidSame: 0 });
    expect(same.byAngle[4].medianRt).toBe(1080);
  });

  it('eksik ya da geçersiz deneme reddedilir', () => {
    const full = input(undefined);
    expect(() => scoreRotation(task, full.slice(1))).toThrow(TaskInputError);
    expect(() => scoreRotation(task, [{ ...full[0], response: 3 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreRotation(task, [{ ...full[0], rtMs: -1 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreRotation(task, [...full, { index: 80, response: 1, rtMs: 900 }])).toThrow(TaskInputError);
    const dup = scoreRotation(task, [...full, { ...full[0], response: full[0].response === 1 ? 2 : 1 }]).result;
    expect(dup.accuracy).toBe(1);
  });
});

describe('Zihinde döndürme: rapor', () => {
  it('hatasız: grafik açıdan açıya, üç kart; öğrenci ve veli ayrı', () => {
    const r = evaluate(SLUG, rotationBody());
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => x.label)).toEqual(['0° (döndürülmemiş)', '45°', '90°', '135°', '180°']);
    expect(rows.map((x) => x.valueLabel)).toEqual(['1,20 sn', '1,43 sn', '1,65 sn', '1,88 sn', '2,10 sn']);
    expect(rows[0].max).toBe(2500);
    expect(r.student.chartTitle).toBe('Döndürme açısına göre tipik karar süresi');
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '%100 doğru'],
      ['Karar süresi', 'Tipik karar süresi 1,65 saniye'],
      ['Döndürme etkisi', 'Çok döndürülmüş şekillerde 0,68 sn daha uzun'],
    ]);
    expect(r.student.items[0].text).toContain('her seferinde doğru buldun');
    // Süreler kartın grafiğindedir (metinde yinelenmez).
    expect(r.student.items[2].visual?.type === 'bars' ? r.student.items[2].visual.rows.map((x) => `${x.label} ${x.valueLabel}`) : []).toEqual([
      'Az döndürülmüş (0–45°) 1,31 sn',
      'Çok döndürülmüş (135–180°) 1,99 sn',
    ]);
    expect(r.student.items[2].text).not.toContain('1,31');
    expect(r.parent.items[2].text).toContain('(Shepard ve Metzler, 1971)');
    expect(r.student.cautions).toEqual([]);
    expect(all(r.student)).not.toContain('Çocuğunuz');
    expect(all(r.parent)).not.toMatch(/buldun|verdin|sürdü\. Bu çoğu|dedin/);
    expect(all(r.student) + all(r.parent)).not.toMatch(/herkes/i);
  });

  it('belirgin fark yok ve tersi ayrı söylenir; 0,25 saniyeden küçük fark belirgin sayılmaz', () => {
    const flat = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 2 : 1, rtMs: 1500 + t.disparity })));
    expect(flat.student.items[2].badge).toBe('Belirgin bir fark yok');
    const reverse = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 2 : 1, rtMs: 2500 - 4 * t.disparity })));
    expect(reverse.student.items[2].badge).toBe('Çok döndürülmüş şekillerde daha kısa');
    expect(reverse.student.items[2].text).toContain('genellikle bunun tersi olur');
  });

  it('doğruluk düzeyleri ve hata türü: yanlış cevaplar türüne göre söylenir', () => {
    let k = 0;
    // Ayna görüntülerinin yarısında "Aynı": doğruluk %75, yanlışlar ayna görüntülerinde.
    const mirrorErr = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? (k++ % 2 ? 1 : 2) : 1, rtMs: 1500 })));
    expect(mirrorErr.student.items[0].badge).toBe('%75 doğru');
    expect(mirrorErr.student.items[0].text).toContain('çoğu zaman doğru buldun. Yanıldığın denemelerin çoğunda ayna görüntüsüne “Aynı” dedin');
    expect(mirrorErr.student.items[0].visual?.type === 'bars' ? mirrorErr.student.items[0].visual.rows.map((x) => `${x.label} ${x.valueLabel}`) : []).toEqual([
      'Aynı şekiller %100',
      'Ayna görüntüleri %50',
    ]);
    // Aynı şekillerde çok döndürülmüşken "Ayna görüntüsü": bunların çok döndürülmüş şekillerde olduğu söylenir.
    const bigErr = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 2 : t.disparity >= 135 ? 2 : 1, rtMs: 1500 })));
    expect(bigErr.student.items[0].text).toContain('aynı şekle “Ayna görüntüsü” dedin; bunların çoğu çok döndürülmüş şekillerdeydi');
    // Hatalar 0 ve 45 derecedeyse "çok döndürülmüş" denmez.
    const smallErr = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 2 : t.disparity <= 45 ? 2 : 1, rtMs: 1500 })));
    expect(smallErr.student.items[0].text).toContain('aynı şekle “Ayna görüntüsü” dedin.');
    expect(smallErr.student.items[0].text).not.toContain('çok döndürülmüş');
  });

  it('yalnızca süre aşımıyla doğru sayılmayan denemeler "yanıldın" diye anlatılmaz', () => {
    // Ayna görüntülerinin 14'ünde süre doluyor, hiç yanlış cevap yok.
    let m = 0;
    const r = evaluate(SLUG, rotationBody((t) => (t.mirror && m++ < 14 ? { choice: null, rtMs: null } : { choice: t.mirror ? 2 : 1, rtMs: 1500 })));
    expect(r.student.items[0].badge).toBe('%83 doğru');
    expect(r.student.items[0].text).toContain('çoğu zaman doğru buldun. Doğru sayılmayan denemelerin çoğunda süre (7 saniye) dolmadan cevap vermedin');
    expect(r.student.items[0].text).not.toMatch(/yanıldın|dedin/);
    // Yavaş ve dikkatli: 135–180 derecedeki aynı ve ayna denemelerinin çoğunda süre doluyor; "acele" denmez.
    const slow = evaluate(SLUG, rotationBody((t) => (t.disparity >= 135 ? { choice: null, rtMs: null } : { choice: t.mirror ? 2 : 1, rtMs: 2500 })));
    expect(slow.student.items[0].badge).toBe('%60 doğru');
    expect(slow.student.items[0].text).toContain('süre (7 saniye) dolmadan cevap vermedin');
    expect(slow.student.items[0].text).not.toContain('acele');
    expect(slow.student.items[2].badge).toBe('Karşılaştırılamadı');
  });

  it('düşük doğrulukta durumlar ayrılır: rastgele, ters düğme, süre aşımı, çok erken basış', () => {
    // Rastgele: her türde denemelerin yarısı doğru (doğruluk %50).
    const n = { same: 0, mirror: 0 };
    const random = evaluate(
      SLUG,
      rotationBody((t) => {
        const right = (t.mirror ? n.mirror++ : n.same++) % 2 === 0;
        return { choice: (t.mirror === right ? 2 : 1) as 1 | 2, rtMs: 1500 };
      }),
    );
    expect(random.parent.items[0].badge).toBe('%50 doğru');
    expect(random.parent.items[0].text).toContain('rastgele basan biri de yaklaşık yarısını doğru bulur');
    expect(random.parent.items[1].badge).toBe('Hesaplanamadı');
    expect(random.parent.items[2].badge).toBe('Karşılaştırılamadı');
    expect(random.parent.cautions.join(' ')).toContain('doğru cevaplar yarıya yakın');
    const rows = random.parent.chart?.type === 'bars' ? random.parent.chart.rows : [];
    expect(rows.every((x) => x.valueLabel === 'yetersiz')).toBe(true);
    expect(random.parent.chartNote).toContain('açılara göre süreler gösterilmedi');
    // Düğmeler ters basılmış: "yarıya yakın" denmez.
    const swapped = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 1 : 2, rtMs: 1500 })));
    expect(swapped.parent.items[0].badge).toBe('%0 doğru');
    expect(swapped.parent.items[0].text).toContain('düğmeleri birbirine karıştırılmış olabilir');
    expect(swapped.parent.cautions.join(' ')).toContain('düğmeleri birbirine karıştırılmış olabilir');
    expect(swapped.parent.cautions.join(' ')).not.toContain('yarıya yakın');
    // Yarısında süre doluyor, verilen cevapların hepsi doğru: "rastgele" denmez.
    const half = evaluate(SLUG, rotationBody((t, i) => (i % 2 ? { choice: null, rtMs: null } : { choice: t.mirror ? 2 : 1, rtMs: 1500 })));
    expect(half.parent.items[0].badge).toBe('%50 doğru');
    expect(half.parent.items[0].text).toContain('süre (7 saniye) dolmadan cevap vermedi');
    expect(all(half.parent)).not.toMatch(/rastgele/);
    // Hep çok erken basılmış.
    const early = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 2 : 1, rtMs: 150 })));
    expect(early.student.items[0].text).toContain('şekillere bakmadan, çok erken bastın');
    expect(early.student.cautions.join(' ')).toContain('cevapların çoğu şekiller görünür görünmez');
    expect(early.student.cautions.join(' ')).not.toContain('yarıya yakın');
    // Hep "Aynı": uyarı; aynı şekillerin hepsi doğru olduğu için "doğru bulunan aynı şekil az" denmez.
    const allSame = evaluate(SLUG, rotationBody(() => ({ choice: 1, rtMs: 1500 })));
    expect(allSame.parent.cautions.join(' ')).toContain('cevapların çoğunda aynı düğmeye basılmış');
    expect(allSame.parent.chartNote).toBe('Doğru cevaplar yarıya yakın ya da daha az olduğu için açılara göre süreler gösterilmedi.');
    expect(allSame.parent.items[1].text).toBe('Doğru cevaplar yarıya yakın ya da daha az olduğu için karar süresi yorumlanmadı.');
  });

  it('süre aşımı ile çok erken basış birlikte çoğunluktaysa ikisi birlikte söylenir; uyarılar kartla çelişmez', () => {
    const answer = (t: { mirror: boolean }, kind: 'timeout' | 'early' | 'wrong' | 'right') =>
      kind === 'timeout'
        ? { choice: null, rtMs: null }
        : { choice: ((kind === 'wrong') === t.mirror ? 1 : 2) as 1 | 2, rtMs: kind === 'early' ? 150 : 1500 };
    // Doğruluk %85: 4 süre aşımı, 3 çok erken, 5 yanlış. İkisi de tek başına çoğunluk değil.
    const mixed = evaluate(SLUG, rotationBody((t, i) => answer(t, i < 4 ? 'timeout' : i < 7 ? 'early' : i < 12 ? 'wrong' : 'right')));
    expect(mixed.student.items[0].badge).toBe('%85 doğru');
    expect(mixed.student.items[0].text).toContain(
      'Doğru sayılmayan denemelerin çoğunda ya süre (7 saniye) dolmadan cevap vermedin ya da şekillere bakmadan, çok erken bastın.',
    );
    expect(mixed.parent.items[0].text).toContain('ya süre (7 saniye) dolmadan cevap vermedi ya da şekillere bakmadan, çok erken bastı.');
    // Doğruluk %50: 12 süre aşımı, 10 çok erken, 18 yanlış.
    const lowMixed = evaluate(SLUG, rotationBody((t, i) => answer(t, i < 12 ? 'timeout' : i < 22 ? 'early' : i < 40 ? 'wrong' : 'right')));
    expect(lowMixed.parent.items[0].badge).toBe('%50 doğru');
    expect(lowMixed.parent.items[0].text).toMatch(/^Çocuğunuz doğru sayılmayan denemelerin çoğunda ya süre \(7 saniye\) dolmadan cevap vermedi ya da/);
    expect(lowMixed.parent.cautions.join(' ')).toContain('doğru sayılmayan denemelerin çoğunda ya süre içinde cevap verilmemiş ya da çok erken basılmış');
    expect(all(lowMixed.parent)).not.toMatch(/rastgele|karıştırılmış/);
    // Doğruluk %25: 35 çok erken, 25 yanlış. Kart erken basışı söyler; uyarılar da düğmelerin karıştırıldığını söylemez.
    const lowEarly = evaluate(SLUG, rotationBody((t, i) => answer(t, i < 35 ? 'early' : i < 60 ? 'wrong' : 'right')));
    expect(lowEarly.student.items[0].text).toContain('denemelerin birçoğunda şekillere bakmadan, çok erken bastın');
    expect(lowEarly.student.cautions.join(' ')).toContain('bazı cevaplar şekiller görünür görünmez');
    expect(all(lowEarly.student)).not.toMatch(/rastgele|karıştırılmış/);
    expect(lowEarly.student.cautions.join(' ')).not.toContain('yarıya yakın');
  });

  it('çok döndürülmüş şekillerde tahmin edilmişse süreler karşılaştırılmaz', () => {
    let k = 0;
    const r = evaluate(SLUG, rotationBody((t) => (t.disparity >= 135 ? { choice: (k++ % 2 ? 1 : 2) as 1 | 2, rtMs: 900 } : { choice: t.mirror ? 2 : 1, rtMs: 1300 })));
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.items[2].text).toContain('Çok döndürülmüş şekillerde doğru cevaplar az');
  });

  it('süre içinde cevap verilmeyen görev yorumlanmaz', () => {
    const r = evaluate(SLUG, rotationBody(() => ({ choice: null, rtMs: null })));
    expect(r.student.items[0].text).toContain('denemelerin çoğunda süre içinde cevap vermedin');
    expect(r.student.items[1].badge).toBe('Hesaplanamadı');
    expect(r.student.items[2].badge).toBe('Karşılaştırılamadı');
    expect(r.student.chartNote).toBe('Denemelerin çoğunda süre içinde cevap verilmediği için açılara göre süreler gösterilmedi.');
    expect(r.student.items[2].text).toBe('Denemelerin çoğunda süre içinde cevap verilmediği için karar süreleri karşılaştırılmadı.');
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.every((x) => x.valueLabel === 'yetersiz' && x.value === 0)).toBe(true);
    expect(r.parent.cautions.join(' ')).toContain('yarısından çoğunda süre içinde cevap verilmemiş');
  });

  it('bir açıda yeterince doğru "aynı" cevap yoksa o çubuk "yetersiz"', () => {
    const r = evaluate(SLUG, rotationBody((t) => ({ choice: t.mirror ? 2 : t.disparity === 180 ? 2 : 1, rtMs: 1200 + 5 * t.disparity })));
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => x.valueLabel)).toEqual(['1,20 sn', '1,43 sn', '1,65 sn', '1,88 sn', 'yetersiz']);
    expect(r.student.chartNote).toContain('“Yetersiz”: o açıda doğru bulunan aynı şekil sayısı yetersiz.');
    expect(r.student.items[2].badge).toBe('Çok döndürülmüş şekillerde 0,57 sn daha uzun');
  });

  it('5. sınıftan itibaren; yetişkinlere açık değil', () => {
    expect(() => evaluate(SLUG, rotationBody(undefined, 4))).toThrow(AssessmentError);
    expect(() => evaluateReports(SLUG, rotationBody(undefined, ADULT_GRADE))).toThrow(AssessmentError);
    expect(evaluate(SLUG, rotationBody(undefined, 13)).parent.items).toHaveLength(3);
  });

  it('PDF raporu üretilir', async () => {
    const pdf = await renderSimpleReportPdf(evaluate(SLUG, rotationBody()).parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('pilot olarak yayında (site sahibinin 2026-10-07 kararı: hoca onayı beklenmeden): listelerde ve site haritasında; adında "tanı" yok', () => {
    expect(zihindeDondurme.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(zihindeDondurme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(zihindeDondurme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
  });
});
