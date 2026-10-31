'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { SimpleReport } from '@/lib/reports/simple';
import { reportSpeech, utterancesOf } from '@/lib/speech/report-text';
import { pickTurkishVoice } from '@/lib/speech/voice';

/**
 * Raporu sesli dinle (site sahibinin 2026-10-31 isteği): küçük çocuklar ve okumakta zorlananlar raporu dinleyebilsin.
 * Ses yalnızca cihazın kendi Türkçe sesiyle üretilir (`localService`; lib/speech/voice.ts); metni bir sunucuya gönderen
 * seslere ve başka dillere geçilmez. Böyle bir ses yoksa oynatıcı gösterilmez. Hiçbir şey saklanmaz: ayarlar yalnızca
 * bu sayfada durur.
 *
 * Önce sonuçlar okunur; bitince (varsa) "Yol haritasını da dinle" önerilir: rapor uzun olduğu için çocuk her şeyi tek
 * seferde dinlemek zorunda kalmasın. Duraklatma, okunan cümleyi kesip kaldığı yeri tutar; "Devam et" o cümlenin başından
 * sürer (bazı tarayıcılarda konuşmayı duraklatma güvenilir çalışmadığı için).
 */

type Part = 'results' | 'roadmap';
type Status = 'idle' | 'playing' | 'paused' | 'done' | 'error';

const RATES = { normal: 1, yavas: 0.8 } as const;
type Rate = keyof typeof RATES;

/** Tarayıcıda tek bir konuşma kuyruğu var: sayfadaki oynatıcılardan yalnızca biri konuşur (pakette birden çok rapor). */
let owner: symbol | null = null;
const owners = new Set<() => void>();
function claim(id: symbol) {
  owner = id;
  for (const l of owners) l();
}

const synthesis = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null;

/**
 * Cihazdaki Türkçe ses; yoksa (ya da henüz bilinmiyorsa) null. Sesler tarayıcıda geç yüklenir: `voiceschanged` olayıyla ve
 * (bu olayı göndermeyen tarayıcılar için) birkaç kez yeniden bakılarak bulunur.
 */
function useTurkishVoice(): SpeechSynthesisVoice | null {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    const synth = synthesis();
    if (!synth) return;
    let found = false;
    const look = () => {
      if (found) return;
      const v = pickTurkishVoice(synth.getVoices());
      if (v) {
        found = true;
        setVoice(v);
      }
    };
    synth.addEventListener('voiceschanged', look);
    const timers = [0, 300, 1200, 3000].map((ms) => window.setTimeout(look, ms));
    return () => {
      synth.removeEventListener('voiceschanged', look);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);
  return voice;
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ReportSpeech({ report, you }: { report: SimpleReport; you: boolean }) {
  const voice = useTurkishVoice();
  const text = useMemo(() => reportSpeech(report), [report]);
  const lists = useMemo(() => ({ results: utterancesOf(text.results), roadmap: utterancesOf(text.roadmap) }), [text]);
  const [part, setPart] = useState<Part>('results');
  const [status, setStatus] = useState<Status>('idle');
  const [current, setCurrent] = useState<string | null>(null);
  const [rate, setRate] = useState<Rate>('normal');
  const [id] = useState(() => Symbol('rapor-sesi'));
  const labelId = useId();
  /** Okunan parçanın sırası; duraklatınca buradan sürer. */
  const index = useRef(0);
  /** Her başlatmada artar: iptal edilen konuşmanın geç gelen olayları yok sayılır. */
  const generation = useRef(0);
  /** Okunan parça (bazı tarayıcılarda başvurusu tutulmazsa "bitti" olayı gelmez). */
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  const halt = useCallback(() => {
    generation.current++;
    utterance.current = null;
    const synth = synthesis();
    if (synth && owner === id) synth.cancel();
  }, [id]);

  const play = useCallback(
    (p: Part, from: number, r: Rate) => {
      const synth = synthesis();
      const list = lists[p];
      if (!synth || !voice || list.length === 0) return;
      const gen = ++generation.current;
      claim(id);
      if (synth.speaking || synth.pending) synth.cancel();
      setPart(p);
      setStatus('playing');
      const step = (k: number) => {
        if (gen !== generation.current) return;
        if (k >= list.length) {
          utterance.current = null;
          index.current = 0;
          setCurrent(null);
          setStatus('done');
          return;
        }
        index.current = k;
        setCurrent(list[k].segment);
        const u = new SpeechSynthesisUtterance(list[k].text);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = RATES[r];
        u.onend = () => step(k + 1);
        u.onerror = (e) => {
          if (gen !== generation.current || e.error === 'interrupted' || e.error === 'canceled') return;
          generation.current++;
          utterance.current = null;
          setCurrent(null);
          setStatus('error');
        };
        utterance.current = u;
        synth.speak(u);
      };
      step(from);
    },
    [id, lists, voice],
  );

  // Başka bir oynatıcı konuşmaya başlayınca bu oynatıcı duraklar.
  useEffect(() => {
    const onOwner = () => {
      if (owner !== id) {
        generation.current++;
        utterance.current = null;
        setStatus((s) => (s === 'playing' ? 'paused' : s));
      }
    };
    owners.add(onOwner);
    return () => {
      owners.delete(onOwner);
    };
  }, [id]);

  // Sayfa gizlenince (başka sekme, ekran kilidi) duraklar; sayfadan çıkınca ya da sekme (rapor türü) değişince susar.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden' && owner === id && generation.current > 0) {
        halt();
        setStatus((s) => (s === 'playing' ? 'paused' : s));
      }
    };
    const onLeave = () => halt();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onLeave);
      halt();
    };
  }, [halt, id]);

  if (!voice || lists.results.length === 0) return null;

  const hasRoadmap = lists.roadmap.length > 0;
  const stop = () => {
    halt();
    index.current = 0;
    setCurrent(null);
    setStatus('idle');
    setPart('results');
  };
  const pause = () => {
    halt();
    setStatus('paused');
  };
  const changeRate = (r: Rate) => {
    setRate(r);
    // Okurken hız değişirse okunan cümle yeni hızla baştan okunur.
    if (status === 'playing') play(part, index.current, r);
  };

  const statusText =
    status === 'playing' && current
      ? `Okunuyor: ${current}`
      : status === 'paused'
        ? 'Duraklatıldı.'
        : status === 'error'
          ? you
            ? 'Sesli okuma bu cihazda başlatılamadı. Yeniden dene.'
            : 'Sesli okuma bu cihazda başlatılamadı. Yeniden deneyin.'
          : status === 'done'
            ? part === 'results' && hasRoadmap
              ? you
                ? 'Sonuçlar bitti. İstersen yol haritasını da dinleyebilirsin.'
                : 'Sonuçlar bitti. İsterseniz yol haritasını da dinleyebilirsiniz.'
              : 'Rapor bitti.'
            : '';

  return (
    <section aria-labelledby={labelId} className="panel flex flex-col gap-3 p-4 sm:p-5">
      <h2 id={labelId} className="sr-only">
        Raporu sesli dinle
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        {status === 'playing' ? (
          <>
            <button type="button" className="btn btn-secondary" onClick={pause}>
              Duraklat
            </button>
            <button type="button" className="btn btn-secondary" onClick={stop}>
              Durdur
            </button>
          </>
        ) : status === 'paused' ? (
          <>
            <button type="button" className="btn btn-primary inline-flex items-center gap-2" onClick={() => play(part, index.current, rate)}>
              <SpeakerIcon />
              {you ? 'Devam et' : 'Devam edin'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={stop}>
              Durdur
            </button>
          </>
        ) : status === 'done' && part === 'results' && hasRoadmap ? (
          <>
            <button type="button" className="btn btn-primary inline-flex items-center gap-2" onClick={() => play('roadmap', 0, rate)}>
              <SpeakerIcon />
              {you ? 'Yol haritasını da dinle' : 'Yol haritasını da dinleyin'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => play('results', 0, rate)}>
              Sonuçları baştan dinle
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary inline-flex items-center gap-2" onClick={() => play('results', 0, rate)}>
            <SpeakerIcon />
            {status === 'done' ? 'Baştan dinle' : you ? 'Raporu sesli dinle' : 'Raporu sesli dinleyin'}
          </button>
        )}
        <div className="inline-flex items-center gap-2" role="group" aria-label="Okuma hızı">
          <span className="t-small text-ink-2">Hız:</span>
          {(['normal', 'yavas'] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={rate === r}
              onClick={() => changeRate(r)}
              className={`rounded-md border px-3 py-1.5 text-[0.9rem] font-bold ${rate === r ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface text-ink-2 hover:bg-surface-2'}`}
            >
              {r === 'normal' ? 'Normal' : 'Yavaş'}
            </button>
          ))}
        </div>
      </div>
      <p className="t-small min-h-[1.25rem] text-ink-2" aria-live="polite">
        {statusText}
      </p>
      <p className="t-small text-ink-3">
        {you
          ? 'Ses bu cihazda üretilir; raporun hiçbir yere gönderilmez.'
          : 'Ses bu cihazda üretilir; rapor hiçbir yere gönderilmez.'}
      </p>
    </section>
  );
}

