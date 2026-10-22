import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicInstruments, solvableInstruments } from '@/content/instruments';
import { LOGIC_SPECS, mantiksalAkilYurutme } from '@/content/instruments/mantiksal-akil-yurutme';
import { sozelAkilYurutme } from '@/content/instruments/sozel-akil-yurutme';
import { TASK_ROADMAPS } from '@/content/roadmaps';
import { AssessmentError, evaluate, evaluateAdult, evaluateReports } from '@/lib/assessment/evaluate';
import { ADULT_GRADE } from '@/lib/config';
import { LOGIC_CATEGORICAL, LOGIC_CONDITIONAL, LOGIC_VALID, logicRapidMs } from '@/lib/instruments/logic';
import type { LogicForm, LogicalReasoningTask, VerbalReasoningTask } from '@/lib/instruments/types';
import { renderSimpleReportPdf } from '@/lib/pdf/simple-report';
import { LOGIC_GROUPS } from '@/lib/reports/build';
import type { SimpleReport } from '@/lib/reports/simple';
import {
  LOGIC_ABOVE_CHANCE,
  LOGIC_BELOW_CHANCE,
  LOGIC_GOOD,
  LOGIC_SAME_SIDE,
  LOGIC_WEAK,
  TaskInputError,
  logicBelowChance,
  logicRapid,
  logicRushed,
  logicSameSide,
  scoreLogic,
  type LogicTrialInput,
} from '@/lib/scoring/tasks';
import sitemap from '../src/app/sitemap';
import { logicBody, type LogicCell } from './helpers/bodies';
import { LOGIC_FORMAL, logicVerdict } from './helpers/logic-check';
import { schoolWords } from './helpers/school';

const SLUG = 'mantiksal-akil-yurutme';
const task = mantiksalAkilYurutme.tasks[0] as LogicalReasoningTask;
const TITLES = ['Doğru cevaplar', 'Eğer–ise çıkarımları', 'Bilgiler ve gerçek hayat', 'Çalışma biçimi'];
const text = (r: SimpleReport) =>
  [...r.items.flatMap((i) => [i.title, i.badge, i.text]), ...r.cautions, r.chartNote, ...r.keyFigures.flatMap((f) => [f.label, f.value, f.note])]
    .filter(Boolean)
    .join(' ');
const withoutRoadmap = (r: SimpleReport) => {
  const { roadmap, ...rest } = r;
  void roadmap;
  return JSON.stringify(rest);
};
const believable = (f: LogicForm) => f === 'vb' || f === 'ib';

describe('Mantıksal akıl yürütme: sorular', () => {
  it('32 soru: 16 koşullu (her türden 4) ve 16 kategorik (her hücreden 4); 3 alıştırma', () => {
    expect(task.items).toHaveLength(32);
    expect(task.practice.map((p) => p.key)).toEqual(['map1', 'map2', 'map3']);
    expect(task.items.map((it) => it.key)).toEqual(Array.from({ length: 32 }, (_, i) => `ma${String(i + 1).padStart(2, '0')}`));
    for (const f of [...LOGIC_CONDITIONAL, ...LOGIC_CATEGORICAL])
      expect(
        task.forms.filter((x) => x === f),
        f,
      ).toHaveLength(4);
    // Her yarıda her türden ikişer soru: yorgunluk türleri farklı etkilemez.
    for (const half of [task.forms.slice(0, 16), task.forms.slice(16)]) {
      for (const f of [...LOGIC_CONDITIONAL, ...LOGIC_CATEGORICAL])
        expect(
          half.filter((x) => x === f),
          f,
        ).toHaveLength(2);
    }
    expect(LOGIC_SPECS.map((s) => s.key)).toEqual(task.items.map((it) => it.key));
  });

  it('cevap anahtarı: geçerli türlerde evet, ötekilerde hayır; 16 evet, 16 hayır; art arda en çok üç aynı cevap', () => {
    task.forms.forEach((f, i) => expect(task.answers[i], task.items[i].key).toBe(LOGIC_VALID.includes(f) ? 1 : 2));
    expect(task.answers.filter((a) => a === 1)).toHaveLength(16);
    let run = 1;
    for (let i = 1; i < task.answers.length; i++) {
      run = task.answers[i] === task.answers[i - 1] ? run + 1 : 1;
      expect(run, task.items[i].key).toBeLessThanOrEqual(3);
    }
    expect(task.practice.map((p) => p.answer)).toEqual([1, 2, 1]);
  });

  it('her sorunun cevabı bağımsız denetleyiciyle doğrulanır: geçerlilerde sonuç kesin, geçersizlerde olabilir (yanlış değil)', () => {
    for (const [i, it] of task.items.entries()) {
      const { verdict, worlds } = logicVerdict(it.key);
      expect(worlds, it.key).toBeGreaterThan(0);
      expect(verdict, it.key).toBe(task.answers[i] === 1 ? 'kesin' : 'olabilir');
    }
    for (const p of task.practice) expect(logicVerdict(p.key).verdict, p.key).toBe(p.answer === 1 ? 'kesin' : 'olabilir');
    expect(Object.keys(LOGIC_FORMAL).sort()).toEqual([...task.practice, ...task.items].map((x) => x.key).sort());
  });

  it('denetleyici gerçekten ayırt eder: bilinen geçerli ve geçersiz biçimler', () => {
    // ma01 (koşul var) kesin; ma03 (sonuç var) kesin değil; ma17 (bütün-bütün) kesin; ma24 (ortak terim dağıtılmamış) kesin değil.
    expect(['ma01', 'ma03', 'ma17', 'ma24', 'ma20', 'ma09'].map((k) => logicVerdict(k).verdict)).toEqual([
      'kesin',
      'olabilir',
      'kesin',
      'olabilir',
      'olabilir',
      'kesin',
    ]);
  });

  it('metinler: koşullu sorular "Eğer" ile, kategorikler "Bütün", "Hiçbir" ya da "Bazı" ile başlar; Türkçe kesme işareti; cümleler noktayla biter', () => {
    for (const [i, it] of task.items.entries()) {
      const f = task.forms[i];
      expect(it.premises, it.key).toHaveLength(2);
      if (LOGIC_CONDITIONAL.includes(f)) expect(it.premises[0], it.key).toMatch(/^Eğer /);
      else expect(it.premises[0], it.key).toMatch(/^(Bütün|Hiçbir|Bazı) /);
      for (const x of [...it.premises, it.conclusion]) {
        expect(x, it.key).toMatch(/^[A-ZÇĞİÖŞÜ].*\.$/);
        expect(x, it.key).not.toContain("'");
        expect(x.length, it.key).toBeLessThanOrEqual(80);
      }
    }
  });

  it('içerikler Sözel Akıl Yürütme’nin çıkarım sorularından farklı; her kategorik sorunun ilk bilgisi tek', () => {
    const verbal = sozelAkilYurutme.tasks[0] as VerbalReasoningTask;
    const used = [...verbal.practice, ...verbal.items].filter((it) => it.type === 'deduction').flatMap((it) => it.stem);
    const mine = task.items.flatMap((it) => it.premises);
    for (const x of mine) expect(used, x).not.toContain(x);
    for (const w of ['hamsi', 'Maviş', 'ejderha', 'arı'])
      expect(mine.join(' ').toLocaleLowerCase('tr-TR'), w).not.toMatch(new RegExp(`\\b${w.toLocaleLowerCase('tr-TR')}\\b`));
    const firsts = task.items.filter((_, i) => LOGIC_CATEGORICAL.includes(task.forms[i])).map((it) => it.premises[0]);
    expect(new Set(firsts).size).toBe(firsts.length);
  });

  it('çok hızlı cevap sınırı soru uzunluğuna göre: yaklaşık 2,1–2,9 saniye', () => {
    const ms = task.items.map(logicRapidMs);
    expect(Math.min(...ms)).toBeGreaterThanOrEqual(2000);
    expect(Math.max(...ms)).toBeLessThanOrEqual(3000);
  });

  it('sorular sabit: sorular ya da cevap anahtarı değişirse testin sürüm numarası artırılmalı', () => {
    const hash = createHash('sha256')
      .update(
        JSON.stringify({
          items: task.items,
          practice: task.practice,
          answers: task.answers,
          forms: task.forms,
        }),
      )
      .digest('hex')
      .slice(0, 16);
    expect({ version: mantiksalAkilYurutme.version, hash }).toEqual({
      version: 1,
      hash: SORU_IZI,
    });
  });
});

/** Soruların izi (sürüm 1): sorular bilerek değiştirildiğinde sürümle birlikte güncellenir. */
const SORU_IZI = '6209a849cb359bec';

describe('Mantıksal akıl yürütme: puanlama', () => {
  const all = (fn: (i: number) => Partial<LogicTrialInput> = () => ({})): LogicTrialInput[] =>
    task.items.map((_, index) => ({
      index,
      response: task.answers[index],
      rtMs: 8000,
      ...fn(index),
    }));

  it('hatasız: 32 doğru; inandırıcılık etkisi 0, mantık etkisi 1; 16 evet', () => {
    const { result } = scoreLogic(task, all());
    expect([result.correct, result.accuracy, result.yes, result.beliefIndex, result.logicIndex, result.rapid, result.rapidCorrect]).toEqual([
      32, 1, 16, 0, 1, 0, 0,
    ]);
    expect([result.condValid, result.condInvalid, result.noConflict, result.conflict].map((g) => `${g.correct}/${g.n}`)).toEqual(['8/8', '8/8', '8/8', '8/8']);
    expect(Object.values(result.forms).map((g) => g.n)).toEqual([4, 4, 4, 4, 4, 4, 4, 4]);
  });

  it('inanca göre cevap veren: çatışan sorular 0/8, inandırıcılık etkisi 1, mantık etkisi 0', () => {
    const { result } = scoreLogic(
      task,
      all((i) => (LOGIC_CATEGORICAL.includes(task.forms[i]) ? { response: believable(task.forms[i]) ? 1 : 2 } : {})),
    );
    expect([result.conflict.correct, result.noConflict.correct, result.beliefIndex, result.logicIndex]).toEqual([0, 8, 1, 0]);
    expect([result.forms.vu.yes, result.forms.ib.yes]).toEqual([0, 4]);
  });

  it('kuralı iki yönlü düşünen: koşullu sorularda hep evet, kesin olmayanlar 0/8', () => {
    const { result } = scoreLogic(
      task,
      all((i) => (LOGIC_CONDITIONAL.includes(task.forms[i]) ? { response: 1 } : {})),
    );
    expect([result.condValid.correct, result.condInvalid.correct, result.conditional.yes, result.yes]).toEqual([8, 0, 16, 24]);
    expect(logicSameSide(result)).toBeNull();
  });

  it('hep aynı cevap ve çok hızlı cevaplar ayrı ayrı sayılır', () => {
    const yes = scoreLogic(
      task,
      all(() => ({ response: 1 })),
    ).result;
    expect([yes.yes, yes.correct, logicSameSide(yes)]).toEqual([32, 16, 'yes']);
    const no = scoreLogic(
      task,
      all(() => ({ response: 2 })),
    ).result;
    expect(logicSameSide(no)).toBe('no');
    expect(LOGIC_SAME_SIDE).toBe(28);
    // Çok hızlı cevap uyarısı: soruların en az dörtte biri hızlı ve bu cevapların dörtte üçünden azı doğru. Hızlı ama
    // doğru cevaplar soruların okunduğunu gösterir.
    const wrongIf = (i: number, wrong: boolean) => (wrong ? { response: task.answers[i] === 1 ? 2 : 1 } : {});
    const fast = scoreLogic(
      task,
      all((i) => ({ rtMs: i < 8 ? 1000 : 9000, ...wrongIf(i, i < 3) })),
    ).result;
    expect([fast.rapid, fast.rapidCorrect, logicRapid(fast)]).toEqual([8, 5, true]);
    const fastRight = scoreLogic(
      task,
      all((i) => ({ rtMs: i < 8 ? 1000 : 9000, ...wrongIf(i, i < 2) })),
    ).result;
    expect([fastRight.rapid, fastRight.rapidCorrect, logicRapid(fastRight)]).toEqual([8, 6, false]);
    expect(
      logicRapid(
        scoreLogic(
          task,
          all((i) => ({ rtMs: i < 7 ? 1000 : 9000, ...wrongIf(i, true) })),
        ).result,
      ),
    ).toBe(false);
    expect(
      logicRapid(
        scoreLogic(
          task,
          all(() => ({ rtMs: 900 })),
        ).result,
      ),
    ).toBe(false);
    // Rastgele seçimin de altı: en çok 10 doğru (hep aynı cevap verilmemişken).
    expect(LOGIC_BELOW_CHANCE).toBe(10);
    const reversed = scoreLogic(
      task,
      all((i) => wrongIf(i, true)),
    ).result;
    expect([reversed.correct, logicSameSide(reversed), logicBelowChance(reversed)]).toEqual([0, null, true]);
    expect(
      logicBelowChance(
        scoreLogic(
          task,
          all((i) => wrongIf(i, i < 21)),
        ).result,
      ),
    ).toBe(false);
    expect(
      logicBelowChance(
        scoreLogic(
          task,
          all((i) => wrongIf(i, i < 22)),
        ).result,
      ),
    ).toBe(true);
    expect(logicBelowChance(yes)).toBe(false);
    expect(
      scoreLogic(
        task,
        all(() => ({ rtMs: null })),
      ).result.medianRt,
    ).toBeNull();
  });

  it('eksik ya da geçersiz cevap reddedilir; aynı soru iki kez gelirse ilki sayılır; anahtarsız puanlama yapılamaz', () => {
    const ok = all();
    expect(() => scoreLogic(task, ok.slice(1))).toThrow(TaskInputError);
    for (const bad of [0, 3, 1.5, Number.NaN]) {
      expect(
        () =>
          scoreLogic(
            task,
            ok.map((t, i) => (i === 3 ? { ...t, response: bad } : t)),
          ),
        String(bad),
      ).toThrow(TaskInputError);
    }
    expect(() => scoreLogic(task, [...ok, { index: 32, response: 1, rtMs: 1 }])).toThrow(TaskInputError);
    expect(scoreLogic(task, [...ok, { index: 0, response: task.answers[0] === 1 ? 2 : 1, rtMs: 1 }]).result.correct).toBe(32);
    expect(() => scoreLogic({ ...task, answers: [], forms: [] }, ok)).toThrow(TaskInputError);
    const bad = logicBody();
    (bad.data as { blocks: Record<string, unknown[]> }).blocks[task.key] = [];
    expect(() => evaluate(SLUG, bad)).toThrow(AssessmentError);
  });
});

describe('Mantıksal akıl yürütme: rapor', () => {
  it('hatasız: dört kart, öne çıkan sayılar, grafik ve soru gruplarının üç boyutlu grafiği', () => {
    const r = evaluate(SLUG, logicBody());
    expect(r.student.items.map((i) => [i.title, i.badge])).toEqual([
      ['Doğru cevaplar', '32 soruda 32 doğru'],
      ['Eğer–ise çıkarımları', 'Kesin olanlar 8/8 · Kesin olmayanlar 8/8'],
      ['Bilgiler ve gerçek hayat', 'Çatışan sorular 8/8 · Çatışmayan sorular 8/8'],
      ['Çalışma biçimi', 'Soru başına tipik süre 8 saniye'],
    ]);
    expect(r.student.cautions).toEqual([]);
    expect(r.student.keyFigures.map((f) => [f.label, f.value])).toEqual([
      ['Doğru', '32/32'],
      ['Eğer–ise soruları', '16/16'],
      ['Gerçek hayatla çatışan sorular', '8/8'],
      ['Soru başına tipik süre', '8 saniye'],
    ]);
    const rm = r.student.roadmap!;
    expect(rm.bars.map((b) => [b.label, b.valueLabel])).toEqual(LOGIC_GROUPS.map((g) => [g.name, '8/8']));
    expect(rm.barsTitle).toBe('Soru gruplarına göre sonucun');
    expect(rm.standout.map((s) => s.title)).toEqual(TITLES);
    expect(text(r.student)).not.toContain('Çocuğunuz');
    expect(r.student.items[0].text).toMatch(/^Bütün sorularda doğru karar verdin: hem “eğer–ise” kurallarında/);
    expect(r.student.items[1].text).toContain('her soruda ayırt ettin');
    expect(r.student.items[2].text).toContain('her soruda yalnızca verilen bilgilere göre karar verdin');
    expect(r.student.items[2].text).toContain('Bir araştırmada çocukların bu sorulardaki başarısı genç yetişkinlerden düşük bulunmuştur.');
    // Türlerin sayıları kartların grafiğindedir; metinde yinelenmez.
    const rows = (i: number) => (r.student.items[i].visual?.type === 'bars' ? r.student.items[i].visual.rows.map((x) => `${x.label} ${x.valueLabel}`) : []);
    expect(rows(1)).toEqual([
      'Kesin: “A var, öyleyse B var” 4/4',
      'Kesin: “B yok, öyleyse A yok” 4/4',
      'Kesin değil: “B var, öyleyse A var” 4/4',
      'Kesin değil: “A yok, öyleyse B yok” 4/4',
    ]);
    expect(rows(2)).toEqual([
      'Çatışmayan: kesin ve gerçekte doğru 4/4',
      'Çatışmayan: kesin değil ve gerçekte yanlış 4/4',
      'Çatışan: kesin ama gerçekte yanlış 4/4',
      'Çatışan: kesin değil ama gerçekte doğru 4/4',
    ]);
    expect(text(r.student)).not.toMatch(/\d+ tanes/);
  });

  it('durumlar: inandırıcılık etkisi, kuralı iki yönlü düşünme, temkinli cevaplar, hep aynı cevap, çok hızlı', () => {
    const belief = evaluate(
      SLUG,
      logicBody((q) => ({
        response: LOGIC_CATEGORICAL.includes(q.form) ? (believable(q.form) ? 1 : 2) : q.answer,
        rtMs: 9000,
      })),
    );
    expect(belief.student.items[2].badge).toBe('Çatışan sorular 0/8 · Çatışmayan sorular 8/8');
    expect(belief.student.items[2].text).toContain(
      'Sonucun gerçek hayatla çatışmadığı sorularda, çatıştığı sorulardan daha çok doğru karar verdin. Çatışan sorularda yanıldığında, sonucu gerçek hayatta bildiklerine göre değerlendirmiş olabilirsin. Gerçek hayatta bilinenin kararı etkilemesine inandırıcılık etkisi denir.',
    );
    expect(belief.parent.items[2].text).toContain('Çocuğunuz sonucun gerçek hayatla çatışmadığı sorularda, çatıştığı sorulardan daha çok doğru karar verdi.');
    expect(belief.student.items[0].text).toBe('Soruların çoğunda doğru karar verdin. Hangi tür sorularda zorlandığını aşağıdaki kartlar gösterir.');
    // Yalnızca bir yönde yanılan (çatışmayanlar 8/8, çatışanlar 4/8): fark belirgin, etki anlatılır.
    const oneWay = evaluate(
      SLUG,
      logicBody((q) => ({
        response: q.form === 'ib' ? 1 : q.answer,
        rtMs: 9000,
      })),
    );
    expect(oneWay.student.items[2].text).toContain('inandırıcılık etkisi');
    // "Hem … hem de …" yalnızca dört grubun her birinde en çok bir yanlış varken.
    expect(oneWay.student.items[0].text).toBe('Soruların çoğunda doğru karar verdin. Hangi tür sorularda zorlandığını aşağıdaki kartlar gösterir.');
    // Küçük fark inandırıcılık etkisi diye anlatılmaz: çatışmayanlar 6/8, çatışanlar 5/8.
    const flip = (q: LogicCell) => (q.answer === 1 ? 2 : 1);
    const smallPick = (q: LogicCell) => ({
      response: (q.form === 'vb' || q.form === 'vu') && q.i < 10 ? flip(q) : q.form === 'ib' && q.i < 13 ? flip(q) : q.answer,
      rtMs: 9000,
    });
    const smallBody = logicBody(smallPick);
    const small = evaluate(SLUG, smallBody);
    const sm = scoreLogic(task, (smallBody.data as { blocks: Record<string, LogicTrialInput[]> }).blocks[task.key]).result;
    expect([sm.noConflict.correct, sm.conflict.correct]).toEqual([6, 5]);
    expect(small.student.items[2].text).not.toContain('inandırıcılık etkisi');
    expect(small.student.items[2].text).toContain('Ama iki grup arasındaki fark, gerçek hayat bilgisinin kararı etkilediğini söylemeye yetmez.');

    const twoWay = evaluate(
      SLUG,
      logicBody((q) => ({
        response: LOGIC_CONDITIONAL.includes(q.form) ? 1 : q.answer,
        rtMs: 9000,
      })),
    );
    expect(twoWay.student.items[1].badge).toBe('Kesin olanlar 8/8 · Kesin olmayanlar 0/8');
    expect(twoWay.student.items[1].text).toContain('karşı örnek');
    expect(twoWay.student.items[1].text).toContain('kesin olan sonuçların hepsini buldun. Ama kesin olmayan sonuçların hepsine de “evet” dedin.');

    const cautious = evaluate(
      SLUG,
      logicBody((q) => ({
        response: LOGIC_CONDITIONAL.includes(q.form) ? 2 : q.answer,
        rtMs: 9000,
      })),
    );
    expect(cautious.student.items[1].text).toContain('Kesin olmayan sonuçları her soruda fark ettin. Ama kesin olan sonuçların hepsine de “hayır” dedin. Her sonuca temkinli yaklaşmış olabilirsin.');

    const mt = evaluate(
      SLUG,
      logicBody((q) => ({
        response: q.form === 'mt' || (q.form === 'ac' && q.i < 10) ? (q.answer === 1 ? 2 : 1) : q.answer,
        rtMs: 9000,
      })),
    );
    // Yanlışlar "B yoksa A da yoktur" sorularında: genel bir temkin açıklaması yapılmaz.
    expect(mt.student.items[1].text).toContain('“B yoksa A da yoktur” çıkarımında zorlandın');
    expect(mt.student.items[1].text).not.toContain('temkinli');

    const yes = evaluate(
      SLUG,
      logicBody(() => ({ response: 1, rtMs: 9000 })),
    );
    expect(yes.student.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Soru başına tipik süre 9 saniye']);
    expect(yes.student.cautions).toEqual([
      'Mantıksal akıl yürütme testinde 32 sorunun hepsine “Evet, kesin olarak doğru” denmiş. Oysa soruların yarısının cevabı “evet”, yarısının “hayır”dır. Sorulara bakılmadan hep aynı cevap verilmiş ya da yönerge farklı anlaşılmış olabilir. Bu sonuç yorumlanmamalıdır.',
    ]);
    expect(yes.student.items[0].text).toMatch(/^Soruların hepsinde “Evet, kesin olarak doğru” dedin\./);
    expect(yes.student.items[0].text).not.toContain('acele');
    expect(yes.student.items[1].text).toBe('Cevapların hepsi aynı olduğu için bu sorulardaki sonuç yorumlanmadı.');
    expect(yes.student.items[3].text).not.toContain('Evet');
    expect(yes.student.roadmap!.bars).toEqual([]);
    expect(yes.student.chart).toBeNull();
    expect(yes.student.keyFigures.map((f) => f.value)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', '9 saniye']);

    // Hızlı ve çoğu yanlış: uyarı; hızlı ama hepsi doğru: uyarı yok.
    const fast = evaluate(
      SLUG,
      logicBody((q) => ({
        response: q.i % 2 ? q.answer : q.answer === 1 ? 2 : 1,
        rtMs: 900,
      })),
    );
    // Bütün sorular okunamayacak kadar hızlı ve cevapların yarısı doğru: sonuç yorumlanmaz.
    expect(fast.student.cautions).toEqual([
      'Mantıksal akıl yürütme testinde 32 sorunun hepsinde cevap, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verilmiş; bu cevapların yalnızca yarısı doğru. Bu sorularda okumadan seçilmiş olabilir. Bu sonuç yorumlanmamalıdır.',
    ]);
    expect(fast.student.items.map((i) => i.badge).slice(0, 3)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    expect(fast.student.items[0].text).toMatch(/^32 sorunun hepsinde cevabı, bilgileri ve sonucu okumaya yetmeyecek kadar kısa sürede verdin\./);
    expect(fast.student.items[3].text).not.toContain('hız tek başına');
    expect(fast.parent.items[0].text).toMatch(/^Çocuğunuz 32 sorunun hepsinde cevabı/);
    // Dokuz soruda hızlı ve yanlış: sonuç yorumlanır, kaç soruda olduğu söylenir.
    const someFast = evaluate(
      SLUG,
      logicBody((q) => (q.i < 9 ? { response: q.answer === 1 ? 2 : 1, rtMs: 900 } : { response: q.answer, rtMs: 9000 })),
    );
    expect(someFast.student.items[0].badge).toBe('32 soruda 23 doğru');
    expect(someFast.student.items[0].text).toContain('32 sorunun 9 tanesinde bilgileri okumadan seçmiş olabileceğin için');
    expect(someFast.student.cautions.join(' ')).toContain('bu cevapların hiçbiri doğru değil');
    const quick = evaluate(
      SLUG,
      logicBody((q) => ({ response: q.answer, rtMs: 900 })),
    );
    expect(quick.student.cautions).toEqual([]);

    // Rastgele seçimin de altı: yönerge ters anlaşılmış olabilir.
    const reversed = evaluate(
      SLUG,
      logicBody((q) => ({ response: q.answer === 1 ? 2 : 1, rtMs: 9000 })),
    );
    expect(reversed.student.items[0].text).toMatch(/^Hiçbir soruda doğru karar vermedin\. Bu, iki seçenek arasından rastgele seçimde beklenenden de az\./);
    expect(reversed.student.items[0].text).not.toContain('yarıya yakın');
    expect(reversed.student.items.slice(0, 3).map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
    expect(reversed.student.items[1].text).toBe('Doğru cevaplar rastgele seçimde beklenenden de az olduğu için bu sorulardaki sonuç yorumlanmadı.');
    expect(reversed.parent.cautions.join(' ')).toContain('32 sorunun hiçbiri doğru cevaplanmamış. Bu, iki seçenek arasından rastgele seçimde beklenenden de azdır.');
  });

  it('rastgele 1500 cevap düzeninde kartlar, uyarılar ve grafikler birbiriyle çelişmez', () => {
    let s = 20261009;
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    const groupOf = (g: (typeof LOGIC_GROUPS)[number]['key']): LogicForm[] =>
      ({
        condValid: ['mp', 'mt'],
        condInvalid: ['ac', 'da'],
        noConflict: ['vb', 'iu'],
        conflict: ['vu', 'ib'],
      })[g] as LogicForm[];
    let n = 0;
    for (let k = 0; k < 1500; k++) {
      // Her tür için bir doğru olma olasılığı (0, 0,25, 0,5, 0,75 ya da 1) ve süre düzeni; bazen hep aynı cevap.
      const p = Object.fromEntries([...LOGIC_CONDITIONAL, ...LOGIC_CATEGORICAL].map((f) => [f, Math.floor(rnd() * 5) / 4])) as Record<LogicForm, number>;
      const mode = k % 10 === 0 ? 'evet' : k % 10 === 1 ? 'hayir' : 'karisik';
      const timing = k % 7 === 0 ? 'hizli' : k % 7 === 1 ? 'yok' : 'normal';
      const pick = (q: LogicCell) => {
        const response = mode === 'evet' ? 1 : mode === 'hayir' ? 2 : rnd() < p[q.form] ? q.answer : q.answer === 1 ? 2 : 1;
        return {
          response,
          rtMs: timing === 'yok' ? null : timing === 'hizli' && q.i % 3 === 0 ? 1200 : 7000 + 300 * q.i,
        };
      };
      const body = logicBody(pick, 5 + (k % 9));
      const label = `${k}/${mode}/${timing}`;
      const res = evaluate(SLUG, body);
      const { result } = scoreLogic(task, (body.data as { blocks: Record<string, LogicTrialInput[]> }).blocks[task.key]);
      const adult = evaluateAdult(SLUG, { ...body, grade: ADULT_GRADE }).adult;
      const side = logicSameSide(result);
      const notRead = !!side || logicBelowChance(result) || logicRushed(result);
      const good = (x: { correct: number }) => x.correct >= LOGIC_GOOD;
      const weak = (x: { correct: number }) => x.correct <= LOGIC_WEAK;
      const nc = result.noConflict.correct;
      const cf = result.conflict.correct;
      const f = result.forms;
      const mtWeak = f.mt.correct <= 2 && f.mp.correct - f.mt.correct >= 2;
      for (const r of [res.student, res.parent, adult]) {
        const t = text(r);
        expect(t, label).not.toMatch(/undefined|NaN|null|\[object|  |\.\.|\s[,.;]/);
        expect(
          r.items.map((i) => i.title),
          label,
        ).toEqual(TITLES);
        for (const i of r.items) expect(i.text, `${label} ${i.title}`).toMatch(/[.!]$/);
        // Nicelik sözleri sayılarla uyuşur ("8 sorunun 8 tanesi", "0 tanesi", "1 tanesi" denmez).
        expect(`${t} ${r.cautions.join(' ')}`, label).not.toMatch(/\b(\d+) (sorunun|sonucun) \1 tanes|(^|\s)[01] tanes/);
        // Yorumlanmayan sonucun rozetleri, grafikleri ve öne çıkan sayıları sonuç gibi görünmez.
        expect(r.items[0].badge, label).toBe(notRead ? 'Yorumlanmadı' : `32 soruda ${result.correct} doğru`);
        expect(r.items[0].visual === undefined, label).toBe(notRead);
        expect(r.items[1].badge === 'Yorumlanmadı', label).toBe(notRead);
        expect(r.items[2].badge === 'Yorumlanmadı', label).toBe(notRead);
        expect(r.items[2].badge === 'Karşılaştırılamadı', label).toBe(!notRead && weak(result.noConflict));
        expect(r.roadmap!.bars.length, label).toBe(notRead ? 0 : 4);
        expect(r.keyFigures[0].value, label).toBe(notRead ? 'Yorumlanmadı' : `${result.correct}/32`);
        expect(
          r.cautions.some((c) => c.includes('denmiş. Oysa soruların yarısının')),
          label,
        ).toBe(!!side);
        const rapidNote = r.cautions.some((c) => c.includes('okumaya yetmeyecek kadar kısa'));
        expect(rapidNote, label).toBe(logicRapid(result));
        expect(r.items[3].text.includes('okumaya yetmeyecek kadar kısa'), label).toBe(rapidNote);
        expect(r.items[3].text.includes('hız tek başına'), label).toBe(!rapidNote && result.medianRt !== null);
        expect(r.cautions.some((c) => c.includes('yorumlanmamalıdır')), label).toBe(notRead);
        if (notRead) {
          expect(r.chart, label).toBeNull();
        } else {
          // Eğer–ise kartı: "karşı örnek" önerisi yalnızca kesinler çoğunlukla doğru, kesin olmayanlar zorken.
          expect(r.items[1].text.includes('karşı örnek'), label).toBe(good(result.condValid) && weak(result.condInvalid));
          expect(r.items[1].text.includes('temkinli'), label).toBe(weak(result.condValid) && good(result.condInvalid) && !(mtWeak && f.mp.correct >= 3));
          expect(r.items[1].text.includes('“B yoksa A da yoktur” çıkarımında zorland'), label).toBe(mtWeak);
          // Bilgiler ve gerçek hayat kartı: inandırıcılık etkisi yalnızca çatışmayanlar çoğunlukla doğru ve fark en az 3 iken.
          const beliefNamed = r.items[2].text.includes('inandırıcılık etkisi');
          expect(beliefNamed, label).toBe(good(result.noConflict) && !good(result.conflict) && nc - cf >= 3);
          expect(r.items[2].text.includes('söylemeye yetmez'), label).toBe(!weak(result.noConflict) && !good(result.conflict) && nc > cf && !beliefNamed);
          expect(r.items[2].text.includes('söylenemez'), label).toBe(weak(result.noConflict));
          // Rastgele seçim hatırlatması yalnızca rastgele seçimden belirgin biçimde ayrılmayan toplamda.
          expect(r.items[0].text.includes('yaklaşık yarısını doğru bulur'), label).toBe(result.correct < LOGIC_ABOVE_CHANCE);
          expect(r.items[0].text.includes('yarıya yakın'), label).toBe(result.correct < LOGIC_ABOVE_CHANCE && !logicRapid(result) && Math.abs(result.correct - 16) <= 4);
          expect(r.items[0].text.includes('hemen hepsinde'), label).toBe(result.correct >= 29 && result.correct < 32);
          // Grafik ve sütunlar kart başlıklarıyla aynı sayıları gösterir.
          expect(r.chart?.type === 'bars' ? r.chart.rows.map((row) => row.valueLabel) : [], label).toEqual(
            LOGIC_GROUPS.map((g) => `${groupOf(g.key).reduce((a, x) => a + f[x].correct, 0)}/8`),
          );
          const rows = r.items[1].visual?.type === 'bars' ? r.items[1].visual.rows.map((x) => x.valueLabel) : [];
          expect(rows, label).toEqual((['mp', 'mt', 'ac', 'da'] as LogicForm[]).map((x) => `${f[x].correct}/4`));
          expect(r.items[2].visual === undefined, label).toBe(weak(result.noConflict));
        }
      }
      expect(text(res.student), label).not.toContain('Çocuğunuz');
      expect(text(adult), label).not.toContain('Çocuğunuz');
      expect(text(res.parent), label).not.toMatch(/\b(buldun|verdin|ettin|dedin|zorlandın|reddettin|seçmiş olabileceğin)\b/);
      expect(schoolWords(withoutRoadmap(adult)), label).toEqual([]);
      n++;
    }
    expect(n).toBe(1500);
  }, 300_000);

  it('5. sınıftan itibaren; yetişkinler de çözebilir: kişisel rapor, okula özgü sözcük yok, veli yaklaşımı yok', () => {
    expect(() => evaluate(SLUG, logicBody(undefined, 4))).toThrow(AssessmentError);
    const r = evaluateReports(SLUG, logicBody(undefined, ADULT_GRADE));
    expect(Object.keys(r)).toEqual(['adult']);
    const adult = (r as { adult: SimpleReport }).adult;
    expect(adult.roadmap!.approach).toBeNull();
    expect(adult.roadmap!.settings!.items).toEqual(TASK_ROADMAPS[SLUG].facts.items.adult);
    const rmText = JSON.stringify({ ...adult.roadmap, sources: [] });
    expect(schoolWords(rmText)).toEqual([]);
    expect(rmText).not.toContain('Çocuğunuz');
    expect(
      schoolWords(
        [
          mantiksalAkilYurutme.intro.title,
          ...mantiksalAkilYurutme.intro.paragraphs,
          ...task.instructions,
          ...task.practice.map((p) => p.explain),
          ...task.items.flatMap((it) => [...it.premises, it.conclusion]),
        ].join(' '),
      ),
    ).toEqual([]);
  });

  it('yayındaki sitenin dış sınamasındaki örnek cevaplar testin güncel cevap anahtarıdır', () => {
    const yml = readFileSync(new URL('../.github/workflows/yayin.yml', import.meta.url), 'utf8');
    const m = /MA_GOVDE=.*?s=\[([\d, ]+)\]/.exec(yml);
    expect(m?.[1].split(',').map(Number)).toEqual(task.answers);
    const r = evaluate(
      SLUG,
      logicBody((q) => ({
        response: Number(m![1].split(',')[q.i]),
        rtMs: 9000 + 100 * q.i,
      })),
    );
    expect(r.student.items[0].badge).toBe('32 soruda 32 doğru');
    expect(r.parent.roadmap!.bars).toHaveLength(4);
    expect(r.parent.roadmap!.approach!.items).toHaveLength(3);
    expect(yml).toMatch(/ma_sayfa[\s\S]*\\"answers\\":\[\][\s\S]*\\"forms\\":\[\]/);
  });

  it('PDF raporu üretilir (öğrenci, veli, yetişkin)', async () => {
    const r = evaluate(
      SLUG,
      logicBody((q) => ({
        response: LOGIC_CATEGORICAL.includes(q.form) ? (believable(q.form) ? 1 : 2) : q.answer,
        rtMs: 9000,
      })),
    );
    for (const rep of [r.student, r.parent, evaluateAdult(SLUG, logicBody(undefined, ADULT_GRADE)).adult]) {
      const pdf = await renderSimpleReportPdf(rep, 'olcekhane.com');
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    }
  }, 90_000);

  it('pilot olarak yayında: listelerde ve site haritasında; adında "tanı" yok; kaynaklar DOI bağlantılı ve metinde anılıyor', () => {
    expect(mantiksalAkilYurutme.status).toBe('pilot');
    expect(solvableInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(publicInstruments().some((i) => i.slug === SLUG)).toBe(true);
    expect(sitemap().some((u) => u.url.endsWith(`/testler/${SLUG}`))).toBe(true);
    expect(mantiksalAkilYurutme.name.toLocaleLowerCase('tr-TR')).not.toContain('tanı');
    expect(mantiksalAkilYurutme.science.citations.every((c) => c.url?.startsWith('https://doi.org/'))).toBe(true);
    const body = JSON.stringify({
      ...mantiksalAkilYurutme.science,
      citations: [],
    });
    for (const a of [
      'Datsogianni ve ark., 2020',
      'De Neys ve Van Gelder, 2009',
      'Evans, Barston ve Pollard, 1983',
      'Evans, Thompson ve Over, 2015',
      'Trippas ve ark., 2018',
    ]) {
      expect(body, a).toContain(a);
    }
  });
});
