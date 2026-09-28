import { describe, expect, it, vi } from 'vitest';
import { dikkatBellek } from '@/content/instruments/dikkat-bellek';
import type { DigitSpanTask, FlankerTask, SpatialSpanTask, SymbolMatchTask } from '@/lib/instruments/types';
import { TaskInputError, scoreFlanker, scoreSpan, scoreSymbol, spanStimulus, taskQualityNotes } from '@/lib/scoring/tasks';

const task = <T>(key: string) => dikkatBellek.tasks.find((t) => t.key === key) as T;
const forward = task<DigitSpanTask>('sayi-ileri');
const backward = task<DigitSpanTask>('sayi-geri');
const spatial = task<SpatialSpanTask>('kutu');
const flanker = task<FlankerTask>('ok');
const symbol = task<SymbolMatchTask>('sembol');

describe('Görev uyaranları', () => {
  it('rakam dizilerinde tekrar ve ardışık sayı yok', () => {
    for (const t of [forward, backward]) {
      t.sequences.forEach((pair, i) => {
        for (const seq of pair) {
          expect(seq).toHaveLength(t.startLength + i);
          expect(new Set(seq).size).toBe(seq.length);
          for (let k = 1; k < seq.length; k++) expect(Math.abs(seq[k] - seq[k - 1])).not.toBe(1);
        }
        expect(pair[0].join()).not.toBe(pair[1].join());
      });
    }
  });

  it('kutu dizileri geçerli kutular kullanıyor', () => {
    for (const pair of spatial.sequences)
      for (const seq of pair) {
        expect(new Set(seq).size).toBe(seq.length);
        for (const b of seq) expect(b).toBeGreaterThanOrEqual(0), expect(b).toBeLessThan(spatial.boxes.length);
      }
  });

  it('ok görevi dengeli ve dört kez art arda aynı cevap yok', () => {
    const count = (dir: string, c: boolean) => flanker.trials.filter((t) => t.dir === dir && t.congruent === c).length;
    expect(count('L', true)).toBe(12);
    expect(count('R', false)).toBe(12);
    for (let i = 3; i < flanker.trials.length; i++) {
      const w = flanker.trials.slice(i - 3, i + 1);
      expect(w.every((t) => t.dir === w[0].dir)).toBe(false);
    }
  });

  it('sembol sırasında art arda aynı sembol yok', () => {
    for (let i = 1; i < symbol.sequence.length; i++) expect(symbol.sequence[i]).not.toBe(symbol.sequence[i - 1]);
  });

  it('uyaranlar belirlenimci: yeniden yüklemede aynı', async () => {
    vi.resetModules();
    const again = await import('@/content/instruments/dikkat-bellek');
    expect(JSON.stringify(again.dikkatBellek.tasks)).toBe(JSON.stringify(dikkatBellek.tasks));
  });
});

describe('Dizi görevi puanlama', () => {
  const answer = (t: DigitSpanTask | SpatialSpanTask, length: number, index: number, right: boolean) => {
    const stim = spanStimulus(t, length, index)!;
    const exp = t.kind === 'digit_span' && t.direction === 'backward' ? [...stim].reverse() : stim;
    return { length, index, response: right ? exp : [...exp].reverse(), rtMs: 3000 };
  };

  it('her uzunlukta en az bir doğru varsa ilerler, ikisi de yanlışsa durur', () => {
    const input = [answer(forward, 3, 0, true), answer(forward, 3, 1, true), answer(forward, 4, 0, false), answer(forward, 4, 1, true), answer(forward, 5, 0, false), answer(forward, 5, 1, false)];
    const { result } = scoreSpan(forward, input);
    expect(result.span).toBe(4);
    expect(result.correctTrials).toBe(3);
    expect(result.ladder.map((l) => l.results)).toEqual([[true, true], [false, true], [false, false]]);
  });

  it('geri dizide ters sıra doğru sayılır', () => {
    const { result } = scoreSpan(backward, [answer(backward, 2, 0, true), answer(backward, 2, 1, false)]);
    expect(result.span).toBe(2);
  });

  it('en kısa düzeyde başarı yoksa span 0 ve belowFloor', () => {
    const { result } = scoreSpan(forward, [answer(forward, 3, 0, false), answer(forward, 3, 1, false)]);
    expect(result.span).toBe(0);
    expect(result.belowFloor).toBe(true);
  });

  it('tarayıcı doğruluk bildiremez; geçersiz cevap reddedilir', () => {
    expect(() => scoreSpan(forward, [{ length: 3, index: 0, response: [0, 12], rtMs: 1 }])).toThrow(TaskInputError);
    expect(() => scoreSpan(forward, [{ length: 30, index: 0, response: [1], rtMs: 1 }])).toThrow(TaskInputError);
  });
});

describe('Ok görevi puanlama', () => {
  it('doğruluk, tahmin ve süre aşımını ayırır', () => {
    const input = flanker.trials.map((t, index) => ({
      index,
      response: index === 0 ? null : index === 1 ? (t.dir === 'L' ? 'R' : 'L') : t.dir,
      rtMs: index === 0 ? null : index === 2 ? 90 : t.congruent ? 500 : 600,
    })) as { index: number; response: 'L' | 'R' | null; rtMs: number | null }[];
    const { result } = scoreFlanker(flanker, input);
    expect(result.n).toBe(48);
    expect(result.timeouts).toBe(1);
    expect(result.anticipations).toBe(1);
    expect(result.accuracy).toBeCloseTo(45 / 48, 3);
    expect(result.meanRtCongruent).toBe(500);
    expect(result.meanRtIncongruent).toBe(600);
  });
});

describe('Sembol eşleştirme puanlama', () => {
  it('dakikada doğru sayısını hesaplar', () => {
    const input = symbol.sequence.slice(0, 60).map((s, index) => ({ index, response: index % 10 === 0 ? ((s + 1) % 9) + 1 : s + 1, rtMs: 1400 }));
    const { result } = scoreSymbol(symbol, input);
    expect(result.attempted).toBe(60);
    expect(result.errors).toBe(6);
    expect(result.correct).toBe(54);
    expect(result.perMinute).toBe(36);
  });

  it('kalite notları', () => {
    expect(taskQualityNotes({ symbol: { attempted: 4, correct: 4, errors: 0, accuracy: 1, perMinute: 2.7, medianRt: 900 } })).toHaveLength(1);
  });
});
