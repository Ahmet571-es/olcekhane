import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { tepkiHizi } from '@/content/instruments/tepki-hizi';
import { AssessmentError, evaluate, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { REACTION_WAIT_BINS, reactionTrials, waitBin } from '@/lib/instruments/reaction';
import { rng } from '@/lib/instruments/sequences';
import type { ReactionTimeTask, ReactionTrial } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { visualDescription } from '@/lib/reports/visuals';
import { TaskInputError, scoreReaction } from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { reactionBody, type ReactionCell } from './helpers/bodies';

const SLUG = 'tepki-hizi';
const task = tepkiHizi.tasks[0] as ReactionTimeTask;
const all = (r: { items: { title: string; badge?: string; text: string }[]; cautions: string[] }) =>
  [...r.items.flatMap((i) => [i.title, i.badge ?? '', i.text]), ...r.cautions].join(' ');
type Pick = (t: ReactionCell, index: number) => { choice: 1 | 2 | null; rtMs: number | null };
/** Varsayılan tepki: doğru taraf, basit bölümde 280–356 ms, seçmelide 420–537 ms. */
const right = (t: ReactionCell) => ({ choice: (t.box + 1) as 1 | 2, rtMs: t.part === 'simple' ? 280 + 4 * t.i : 420 + 3 * t.i });
/** Bölüme göre seçici: verilen bölümde `f`, ötekinde doğru tepki. */
const only =
  (part: 'simple' | 'choice', f: Pick): Pick =>
  (t, i) =>
    t.part === part ? f(t, i) : right(t);

/** Sıra kurallarına uymayan yerler. */
function orderProblems(list: ReactionTrial[]): string[] {
  const out: string[] = [];
  list.forEach((t, i) => {
    if (i >= 2 && [1, 2].every((k) => waitBin(list[i - k].waitMs) === waitBin(t.waitMs))) out.push(`${i}: aynı bekleme aralığı 3 kez art arda`);
    if (t.waitMs < 1000 || t.waitMs >= 3000 || t.waitMs % 10) out.push(`${i}: bekleme ${t.waitMs} ms`);
    if (i >= 3 && [1, 2, 3].every((k) => list[i - k].box === t.box) && new Set(list.map((x) => x.box)).size > 1) out.push(`${i}: aynı kutu 4 kez art arda`);
  });
  return out;
}

describe('Tepki hızı: denemeler', () => {
  it('basit bölüm 20 deneme (tek kutu), seçmeli bölüm 40 deneme (her kutuda 20); bekleme aralıkları dengeli', () => {
    const [simple, choice] = task.parts;
    expect([simple.key, simple.boxes, simple.trials.length]).toEqual(['simple', 1, 20]);
    expect([choice.key, choice.boxes, choice.trials.length]).toEqual(['choice', 2, 40]);
    expect(simple.trials.every((t) => t.box === 0)).toBe(true);
    for (const bin of REACTION_WAIT_BINS) {
      expect(simple.trials.filter((t) => waitBin(t.waitMs) === bin)).toHaveLength(5);
      for (const box of [0, 1]) expect(choice.trials.filter((t) => waitBin(t.waitMs) === bin && t.box === box)).toHaveLength(5);
    }
    // Bekleme, aralığın içinde değişir: dairenin ne zaman belireceği kestirilemez.
    expect(new Set([...simple.trials, ...choice.trials].map((t) => t.waitMs)).size).toBeGreaterThan(30);
    expect(orderProblems(simple.trials)).toEqual([]);
    expect(orderProblems(choice.trials)).toEqual([]);
    expect(task.timeoutMs).toBe(2000);
  });

  it('üretim kuralı farklı tohumlarla da çalışır', () => {
    for (let seed = 1; seed <= 40; seed++) {
      expect(orderProblems(reactionTrials(1, 5, rng(seed)))).toEqual([]);
      expect(orderProblems(reactionTrials(2, 5, rng(seed)))).toEqual([]);
    }
  });

  it('alıştırma: basitte 5, seçmelide 6 deneme (her kutuda 3); beklemeler 1–3 saniye', () => {
    const [simple, choice] = task.parts;
    expect(simple.practice).toHaveLength(5);
    expect(choice.practice).toHaveLength(6);
    expect(choice.practice.filter((t) => t.box === 1)).toHaveLength(3);
    expect([...simple.practice, ...choice.practice].every((t) => t.waitMs >= 1000 && t.waitMs < 3000)).toBe(true);
  });

  it('yayın denetimindeki örnek cevaplar seçmeli bölümün güncel kutu sırasını kullanır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /TH_GOVDE=.*?s="([01]+)"/.exec(yml);
    expect(m?.[1]).toBe(task.parts[1].trials.map((t) => t.box).join(''));
  });

  it('uyaranlar belirlenimci: yeniden yüklemede aynı', async () => {
    vi.resetModules();
    const again = await import('@/content/instruments/tepki-hizi');
    expect(JSON.stringify(again.tepkiHizi.tasks)).toBe(JSON.stringify(tepkiHizi.tasks));
  });
});

describe('Tepki hızı: puanlama', () => {
  const input = (pick?: Pick) =>
    (reactionBody(pick).data as { blocks: Record<string, { index: number; response: number | null; rtMs: number | null }[]> }).blocks[task.key];

  it('hatasız: tipik süre, ortadaki yarı ve seçimin etkisi', () => {
    const r = scoreReaction(task, input()).result;
    expect(r.simple).toMatchObject({ n: 20, answered: 20, correct: 20, wrong: 0, early: 0, misses: 0, medianRt: 318, midLow: 300, midHigh: 336 });
    expect(r.choice).toMatchObject({ n: 40, answered: 40, correct: 40, wrong: 0, early: 0, misses: 0, medianRt: 479, midLow: 450, midHigh: 507 });
    expect(r.choiceCostMs).toBe(161);
  });

  it('çok erken (daire belirmeden ya da 100 ms içinde), süre aşımı ve öteki taraf ayrı sayılır', () => {
    const r = scoreReaction(
      task,
      input((t) =>
        t.part === 'simple'
          ? t.i < 2
            ? { choice: 1, rtMs: 0 }
            : t.i < 4
              ? { choice: 1, rtMs: 99 }
              : t.i < 6
                ? { choice: null, rtMs: null }
                : t.i === 6
                  ? { choice: 1, rtMs: 2400 }
                  : right(t)
          : t.i < 5
            ? { choice: (2 - t.box) as 1 | 2, rtMs: 400 }
            : right(t),
      ),
    ).result;
    expect(r.simple).toMatchObject({ answered: 13, correct: 13, early: 4, misses: 3 });
    expect(r.choice).toMatchObject({ answered: 40, correct: 35, wrong: 5, early: 0, misses: 0 });
    // Süreler yalnızca doğru tepkilerden: öteki taraftaki 400 ms'lik basışlar karışmaz.
    expect(r.choice.medianRt).toBe(Math.round((420 + 3 * 22 + 420 + 3 * 22) / 2));
  });

  it('yeterince doğru tepki yoksa süre hesaplanmaz', () => {
    const r = scoreReaction(task, input(only('simple', (t) => (t.i < 11 ? { choice: null, rtMs: null } : right(t))))).result;
    expect(r.simple.medianRt).toBeNull();
    expect(r.simple.midLow).toBeNull();
    expect(r.choiceCostMs).toBeNull();
  });

  it('eksik ya da geçersiz deneme reddedilir; aynı denemenin ikinci cevabı yok sayılır', () => {
    const full = input();
    expect(() => scoreReaction(task, full.slice(1))).toThrow(TaskInputError);
    // Basit bölümde tek düğme var: 2 geçersiz.
    expect(() => scoreReaction(task, [{ ...full[0], response: 2 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreReaction(task, [...full.slice(0, 20), { ...full[20], response: 3 }, ...full.slice(21)])).toThrow(TaskInputError);
    expect(() => scoreReaction(task, [{ ...full[0], rtMs: -1 }, ...full.slice(1)])).toThrow(TaskInputError);
    expect(() => scoreReaction(task, [...full, { index: 60, response: 1, rtMs: 300 }])).toThrow(TaskInputError);
    const dup = scoreReaction(task, [...full, { ...full[0], rtMs: 0 }]).result;
    expect(dup.simple.early).toBe(0);
  });
});

describe('Tepki hızı: rapor', () => {
  it('hatasız: üç kart ve iki çubuk; öğrenci ve veli ayrı', () => {
    const r = evaluate(SLUG, reactionBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Basit tepki', 'Tipik tepki süresi 0,32 saniye'],
      ['Seçmeli tepki', 'Tipik tepki süresi 0,48 saniye'],
      ['Seçimin etkisi', 'Seçmeli bölümde 0,16 sn daha uzun'],
    ]);
    expect(r.student.items[0].text).toContain('hesaba katılan tepkilerinin en az yarısı 0,30 ile 0,34 saniye arasındaydı. Bu aralık ne kadar darsa');
    expect(r.parent.items[0].text).toContain('Bu aralığın darlığı, tepkilerin ne kadar tutarlı olduğunu gösterir.');
    expect(r.student.items[1].text).toContain('40 denemenin hepsinde dairenin olduğu taraftaki düğmeye basıldı.');
    // İki bölümün süreleri seçimin etkisi kartının grafiğindedir.
    const farkRows = r.student.items[2].visual?.type === 'bars' ? r.student.items[2].visual.rows : [];
    expect(farkRows.map((x) => `${x.label} ${x.valueLabel}`)).toEqual(['Basit tepki 0,32 sn', 'Seçmeli tepki 0,48 sn']);
    expect(r.parent.items[2].text).toContain('(Hick, 1952)');
    // Kart grafiğinin açıklaması değeri yinelemez; aralık iki ondalıkla ve ne olduğu yazılır.
    expect(visualDescription(r.student.items[0].visual!)).toBe('Tepki süresi: Tipik 0,32 sn; tepkilerin en az yarısı 0,30–0,34 sn arasında.');
    expect(r.parent.items[0].text).not.toContain('Akranlarla');
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => [x.label, x.valueLabel, x.value, x.max])).toEqual([
      ['Basit tepki', '0,32 sn', 320, 500],
      ['Seçmeli tepki', '0,48 sn', 480, 500],
    ]);
    expect(r.student.chartTitle).toBe('Bölümlere göre tipik tepki süresi');
    expect(r.student.cautions).toEqual([]);
    expect(all(r.student)).not.toContain('Çocuğunuz');
    expect(all(r.parent)).not.toMatch(/basman|bastın|basmadın|süren |tepkini/);
    expect(all(r.student) + all(r.parent)).not.toMatch(/herkes/i);
  });

  it('erken basış, süre aşımı ve öteki taraf sayılarla söylenir ve hesaba katılmaz', () => {
    const r = evaluate(
      SLUG,
      reactionBody((t) => (t.part === 'simple' && t.i < 2 ? { choice: 1, rtMs: 0 } : t.part === 'choice' && t.i < 3 ? { choice: (2 - t.box) as 1 | 2, rtMs: 400 } : t.part === 'choice' && t.i === 3 ? { choice: null, rtMs: null } : right(t))),
    );
    expect(r.student.items[0].text).toContain('20 denemenin 2 tanesinde daire belirmeden ya da belirir belirmez bastın; bu denemeler hesaba katılmadı.');
    expect(r.parent.items[1].text).toContain('Çocuğunuz 40 denemenin birinde süre içinde basmadı, 3 tanesinde öteki taraftaki düğmeye bastı; bu denemeler hesaba katılmadı.');
    expect(r.parent.items[1].text).toContain('40 denemenin 36 tanesinde dairenin olduğu taraftaki düğmeye basıldı.');
  });

  it('seçimin etkisi: 0,05 saniyeden küçük fark belirgin sayılmaz; tersi ayrı söylenir', () => {
    const flat = evaluate(SLUG, reactionBody((t) => ({ choice: (t.box + 1) as 1 | 2, rtMs: t.part === 'simple' ? 400 : 440 })));
    expect(flat.student.items[2].badge).toBe('Belirgin bir fark yok');
    const flatRows = flat.student.items[2].visual?.type === 'bars' ? flat.student.items[2].visual.rows : [];
    expect(flatRows.map((x) => x.valueLabel)).toEqual(['0,40 sn', '0,44 sn']);
    const edge = evaluate(SLUG, reactionBody((t) => ({ choice: (t.box + 1) as 1 | 2, rtMs: t.part === 'simple' ? 400 : 450 })));
    expect(edge.student.items[2].badge).toBe('Seçmeli bölümde 0,05 sn daha uzun');
    const reverse = evaluate(SLUG, reactionBody((t) => ({ choice: (t.box + 1) as 1 | 2, rtMs: t.part === 'simple' ? 500 : 420 })));
    expect(reverse.student.items[2].badge).toBe('Seçmeli bölümde daha kısa');
    expect(reverse.student.items[2].text).toContain('genellikle bunun tersi olur');
  });

  it('süre içinde basılmayan bölüm hesaplanmaz; uyarı ve grafik aynı şeyi söyler', () => {
    const r = evaluate(SLUG, reactionBody(only('simple', () => ({ choice: null, rtMs: null }))));
    expect(r.student.items[0].badge).toBe('Hesaplanamadı');
    expect(r.student.items[0].text).toContain('Hiçbir denemede süre içinde basmadın');
    expect(r.student.items[1].badge).toBe('Tipik tepki süresi 0,48 saniye');
    expect(r.student.items[2].text).toBe('Basit bölümde tepki süresi hesaplanamadığı için karşılaştırma yapılamadı.');
    expect(r.parent.cautions.join(' ')).toContain('Tepki hızı görevinin basit bölümünde denemelerin yarısından çoğunda süre içinde basılmamış');
    const rows = r.student.chart?.type === 'bars' ? r.student.chart.rows : [];
    expect(rows.map((x) => x.valueLabel)).toEqual(['hesaplanamadı', '0,48 sn']);
    expect(r.student.chartNote).toContain('Süresi yazmayan bölümün nedeni, o bölümün kartında açıklanır.');
  });

  it('çoğunda daire belirmeden basılan bölüm yorumlanmaz (süre hesaplanabilse de)', () => {
    const r = evaluate(SLUG, reactionBody(only('choice', (t) => (t.i < 30 ? { choice: 1, rtMs: 0 } : right(t)))));
    expect(r.parent.items[1].badge).toBe('Yorumlanmadı');
    expect(r.parent.items[1].text).toContain('denemelerin yarısından çoğunda daire belirmeden ya da belirir belirmez bastı; bu yüzden tepki süresi yorumlanmadı.');
    expect(r.parent.items[2].text).toBe('Seçmeli bölümde tepki süresi yorumlanmadığı için karşılaştırma yapılmadı.');
    const rows = r.parent.chart?.type === 'bars' ? r.parent.chart.rows : [];
    expect(rows.map((x) => x.valueLabel)).toEqual(['0,32 sn', 'yorumlanmadı']);
    expect(r.parent.cautions.join(' ')).toContain('seçmeli bölümünde denemelerin yarısından çoğunda daire belirmeden');
  });

  it('seçmeli bölümde öteki tarafa sık basılırsa süre yorumlanmaz: ters, rastgele, sık yanlış', () => {
    const reversed = evaluate(SLUG, reactionBody(only('choice', (t) => ({ choice: (2 - t.box) as 1 | 2, rtMs: 400 }))));
    expect(reversed.student.items[1].badge).toBe('Hesaplanamadı');
    expect(reversed.student.items[1].text).toContain('Cevaplarının hepsinde dairenin olmadığı taraftaki düğmeye bastın; yönergeyi ters anlamış olabilirsin.');
    expect(reversed.student.items[1].text).toContain('40 denemenin hiçbirinde dairenin olduğu taraftaki düğmeye basılmadı.');
    expect(reversed.student.items[2].text).toBe('Seçmeli bölümde öteki taraftaki düğmeye sık basıldığı için karşılaştırma yapılmadı.');
    expect(reversed.parent.cautions.join(' ')).toContain('cevapların çoğunda dairenin olmadığı taraftaki düğmeye basılmış');
    const rows = reversed.student.chart?.type === 'bars' ? reversed.student.chart.rows : [];
    expect(rows.map((x) => x.valueLabel)).toEqual(['0,32 sn', 'hesaplanamadı']);
    // Hep sol düğme: aynı düğme.
    const left = evaluate(SLUG, reactionBody(only('choice', () => ({ choice: 1, rtMs: 400 }))));
    expect(left.parent.items[1].badge).toBe('Yorumlanmadı');
    expect(left.parent.items[1].text).toContain('cevaplarının hepsinde dairenin hangi tarafta olduğuna bakmadan aynı düğmeye bastı (40 cevabın hepsinde sol düğmeye)');
    // Grafik hangi düğmeye kaç kez basıldığını gösterir.
    const sides = left.parent.items[1].visual?.type === 'stack' ? left.parent.items[1].visual.parts : [];
    expect(sides.slice(0, 2).map((x) => [x.label, x.value])).toEqual([
      ['Sol düğmeye basıldı', 40],
      ['Sağ düğmeye basıldı', 0],
    ]);
    expect(left.parent.items[2].text).toBe('Seçmeli bölümde cevapların çoğunda aynı düğmeye basıldığı için karşılaştırma yapılmadı.');
    expect(left.parent.cautions.join(' ')).toContain('seçmeli bölümünde cevapların çoğunda aynı düğmeye basılmış');
    // İki tarafa karışık basılıyor, doğru taraf yarı yarıya.
    let k = 0;
    const random = evaluate(SLUG, reactionBody(only('choice', (t) => ({ choice: (k++ % 4 < 2 ? t.box + 1 : 2 - t.box) as 1 | 2, rtMs: 400 }))));
    expect(random.parent.items[1].text).toContain('rastgele basan biri de yaklaşık yarısını doğru bulur');
    expect(random.parent.cautions.join(' ')).toContain('cevapların yarıya yakınında basılmış');
    // 40 denemenin 12'sinde öteki taraf (%70 doğru).
    const errors = evaluate(SLUG, reactionBody(only('choice', (t) => (t.i < 12 ? { choice: (2 - t.box) as 1 | 2, rtMs: 400 } : right(t)))));
    expect(errors.student.items[1].text).toContain('Cevap verdiğin 40 denemenin 12 tanesinde öteki taraftaki düğmeye bastın.');
    expect(errors.parent.cautions.join(' ')).toContain('öteki taraftaki düğmeye sık basılmış');
    expect(all(errors.parent)).not.toMatch(/rastgele/);
  });

  it('erken basış ve süre aşımı birlikte yarıyı geçerse bölüm yorumlanmaz; sayılar söylenir', () => {
    const r = evaluate(SLUG, reactionBody(only('simple', (t) => (t.i < 6 ? { choice: 1, rtMs: 0 } : t.i < 11 ? { choice: null, rtMs: null } : right(t)))));
    expect(r.student.items[0].text).toBe(
      'Denemelerin yarısından çoğu tepki sayılmadı: 20 denemenin 6 tanesinde daire belirmeden ya da belirir belirmez bastın, 5 tanesinde süre içinde basmadın. Bu yüzden tepki süren hesaplanamadı.',
    );
    expect(r.parent.items[0].text).toBe(
      'Denemelerin yarısından çoğu tepki sayılmadı: çocuğunuz 20 denemenin 6 tanesinde daire belirmeden ya da belirir belirmez bastı, 5 tanesinde süre içinde basmadı. Bu yüzden tepki süresi hesaplanamadı.',
    );
    expect(r.parent.cautions).toEqual([
      'Tepki hızı görevinin basit bölümünde denemelerin yarısından çoğunda ya daire belirmeden ya da belirir belirmez basılmış ya da süre içinde basılmamış. Bu bölümün sonucu yorumlanmamalıdır.',
    ]);
    // Yarısı (10/20) erken: süre hesaplanır, ama uyarı "birçoğunda" der.
    const half = evaluate(SLUG, reactionBody(only('simple', (t) => (t.i < 10 ? { choice: 1, rtMs: 0 } : right(t)))));
    expect(half.parent.items[0].badge).toBe('Tipik tepki süresi 0,34 saniye');
    expect(half.parent.cautions.join(' ')).toContain('denemelerin birçoğunda daire belirmeden ya da belirir belirmez basılmış; sonuç dikkatle yorumlanmalıdır.');
  });

  it('seçmeli bölüm fareyle yapıldıysa seçimin etkisi yorumlanmaz', () => {
    const body = reactionBody();
    const trials = (body.data as { blocks: Record<string, Record<string, unknown>[]> }).blocks[task.key];
    trials.forEach((t, i) => {
      if (i >= 20 && i % 2) t.input = 'mouse';
      else t.input = i < 20 ? 'touch' : 'key';
    });
    const r = evaluate(SLUG, body);
    expect(r.student.items[1].badge).toBe('Tipik tepki süresi 0,48 saniye');
    expect(r.student.items[1].text).toContain('Bu bölümde fareyle bastığın için bu süreye imlecin iki düğme arasındaki yolu da eklendi');
    expect(r.student.items[2].text).toBe('Seçmeli bölümde fare kullanıldığı için karşılaştırma yapılmadı: süreye imlecin iki düğme arasındaki yolu da eklendi.');
    expect(r.parent.cautions.join(' ')).toContain('seçmeli bölümünde cevapların bir kısmı fareyle verilmiş');
    // Basit bölümde fare süreyi bozmaz: imleç düğmenin üstünde durur.
    trials.forEach((t, i) => (t.input = i < 20 ? 'mouse' : 'key'));
    expect(evaluate(SLUG, body).student.items[2].badge).toBe('Seçmeli bölümde 0,16 sn daha uzun');
  });

  it('3. sınıftan itibaren; yetişkinlere açık değil', () => {
    expect(() => evaluate(SLUG, reactionBody(undefined, 2))).toThrow(AssessmentError);
    expect(() => evaluateReports(SLUG, reactionBody(undefined, ADULT_GRADE))).toThrow(AssessmentError);
    expect(evaluate(SLUG, reactionBody(undefined, 3)).parent.items).toHaveLength(3);
    expect(evaluate(SLUG, reactionBody(undefined, 13)).parent.items).toHaveLength(3);
  });

  it('PDF raporu üretilir', async () => {
    const pdf = await renderSimpleReportPdf(evaluate(SLUG, reactionBody()).parent, 'olcekhane.com');
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  }, 60_000);

  it('pilot olarak yayında (site sahibinin 2026-10-07 kararı: hoca onayı beklenmeden): listelerde ve site haritasında; adında "tanı" yok', () => {
    expect(tepkiHizi.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(tepkiHizi.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(tepkiHizi.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
  });
});
