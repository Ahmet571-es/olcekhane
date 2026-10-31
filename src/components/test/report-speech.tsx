'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { SimpleReport } from '@/lib/reports/simple';
import { SpeechPlayer, type PlayerEnv, type SynthLike, type UtteranceLike } from '@/lib/speech/player';
import { reportSpeech, utterancesOf } from '@/lib/speech/report-text';
import { pickTurkishVoice } from '@/lib/speech/voice';

/**
 * Raporu sesli dinle (site sahibinin 2026-10-31 isteği): küçük çocuklar ve okumakta zorlananlar raporu dinleyebilsin.
 * Ses cihazın kendi konuşma özelliğinin Türkçe sesiyle üretilir (`localService`; lib/speech/voice.ts); kendini ağdan
 * çalışan diye bildiren seslere ve başka dillere geçilmez. Böyle bir ses yoksa (ya da sonradan kaybolursa) oynatıcı
 * görünmez. Site metni hiçbir yere göndermez; ayarlar yalnızca bu sayfada durur.
 *
 * Önce sonuçlar okunur; bitince (varsa) "Yol haritasını da dinle" önerilir: rapor uzun olduğu için çocuk her şeyi tek
 * seferde dinlemek zorunda kalmasın. Okuma kuyruğu lib/speech/player.ts'tedir.
 */

const RATES = { normal: 1, yavas: 0.8 } as const;
type Rate = keyof typeof RATES;

const synthesis = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null;

/**
 * Cihazdaki Türkçe ses; yoksa (ya da henüz bilinmiyorsa) null. Sesler tarayıcıda geç yüklenir ve sonradan değişebilir:
 * `voiceschanged` olayıyla ve (bu olayı göndermeyen tarayıcılar için) birkaç kez yeniden bakılır; ses kaybolursa null olur.
 */
function useTurkishVoice(): SpeechSynthesisVoice | null {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    const synth = synthesis();
    if (!synth) return;
    const look = () => setVoice(pickTurkishVoice(synth.getVoices()));
    synth.addEventListener('voiceschanged', look);
    const timers = [0, 300, 1200, 3000].map((ms) => window.setTimeout(look, ms));
    return () => {
      synth.removeEventListener('voiceschanged', look);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);
  return voice;
}

function browserEnv(synth: SpeechSynthesis): PlayerEnv<SpeechSynthesisVoice> {
  return {
    synth: synth as unknown as SynthLike<SpeechSynthesisVoice>,
    utterance: (text) => new window.SpeechSynthesisUtterance(text) as unknown as UtteranceLike<SpeechSynthesisVoice>,
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    clearTimeout: (id) => window.clearTimeout(id as number),
    now: () => performance.now(),
  };
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
  const lists = useMemo(() => {
    const t = reportSpeech(report);
    return { results: utterancesOf(t.results), roadmap: utterancesOf(t.roadmap) };
  }, [report]);
  if (!voice || lists.results.length === 0) return null;
  // Ses değişirse oynatıcı yeniden kurulur (eski oynatıcı susar).
  return <Player key={voice.voiceURI || `${voice.name}|${voice.lang}`} voice={voice} lists={lists} you={you} />;
}

function Player({ voice, lists, you }: { voice: SpeechSynthesisVoice; lists: Parameters<SpeechPlayer<SpeechSynthesisVoice>['setLists']>[0]; you: boolean }) {
  const [player] = useState(() => new SpeechPlayer(browserEnv(window.speechSynthesis), lists, voice));
  const state = useSyncExternalStore(player.subscribe, player.getState, player.getState);
  const [rate, setRate] = useState<Rate>('normal');
  const main = useRef<HTMLButtonElement>(null);
  const labelId = useId();

  useEffect(() => player.setLists(lists), [player, lists]);
  useEffect(() => () => player.destroy(), [player]);

  // Sayfa gizlenince (başka sekme, ekran kilidi) ya da sayfadan çıkılırken okuma duraklar.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') player.hide();
    };
    const onLeave = () => player.hide();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onLeave);
    };
  }, [player]);

  const hasRoadmap = lists.roadmap.length > 0;
  const { status, part, current } = state;
  const v = (s: string, p: string) => (you ? s : p);

  // Ana düğme her durumda aynı düğmedir (odak yerinde kalır); yazısı ve işi duruma göre değişir.
  const mainAction: { label: string; icon: boolean; run: () => void } =
    status === 'playing'
      ? { label: 'Duraklat', icon: false, run: () => player.pause() }
      : status === 'paused'
        ? { label: v('Devam et', 'Devam edin'), icon: true, run: () => player.resume() }
        : status === 'error'
          ? { label: v('Yeniden dene', 'Yeniden deneyin'), icon: true, run: () => player.resume() }
          : status === 'done' && part === 'results' && hasRoadmap
            ? { label: v('Yol haritasını da dinle', 'Yol haritasını da dinleyin'), icon: true, run: () => player.play('roadmap') }
            : status === 'done'
              ? { label: v('Baştan dinle', 'Baştan dinleyin'), icon: true, run: () => player.play('results') }
              : { label: v('Raporu sesli dinle', 'Raporu sesli dinleyin'), icon: true, run: () => player.play('results') };
  const second: 'stop' | 'again' | null =
    status === 'playing' || status === 'paused' ? 'stop' : status === 'done' && part === 'results' && hasRoadmap ? 'again' : null;
  // Durdurunca odak ana düğmeye döner (ikinci düğme kaybolur).
  function onSecond() {
    if (second === 'stop') {
      player.stop();
      main.current?.focus();
    } else player.play('results');
  }

  // Ekran okuyucuya yalnızca durum değişiklikleri bildirilir; "Okunuyor" satırı bildirilmez (sesle üst üste binmesin).
  const notice =
    status === 'paused'
      ? 'Duraklatıldı.'
      : status === 'error'
        ? v('Rapor bu cihazda seslendirilemedi. Yeniden dene.', 'Rapor bu cihazda seslendirilemedi. Yeniden deneyin.')
        : status === 'done'
          ? part === 'results' && hasRoadmap
            ? v('Sonuçlar bitti. İstersen yol haritasını da dinleyebilirsin.', 'Sonuçlar bitti. İsterseniz yol haritasını da dinleyebilirsiniz.')
            : 'Rapor bitti.'
          : '';

  return (
    <section aria-labelledby={labelId} className="panel flex flex-col gap-3 p-4 sm:p-5">
      <h2 id={labelId} className="sr-only">
        Raporu sesli dinle
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <>
          <button key="ana" ref={main} type="button" className="btn btn-primary inline-flex items-center gap-2" onClick={mainAction.run}>
            {mainAction.icon && <SpeakerIcon />}
            {mainAction.label}
          </button>
          {second && (
            <button key="ikinci" type="button" className="btn btn-secondary" onClick={onSecond}>
              {second === 'stop' ? 'Durdur' : v('Sonuçları baştan dinle', 'Sonuçları baştan dinleyin')}
            </button>
          )}
        </>
        <div className="inline-flex items-center gap-2" role="group" aria-label="Okuma hızı">
          <span className="t-small text-ink-2">Hız:</span>
          {(['normal', 'yavas'] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={rate === r}
              onClick={() => {
                setRate(r);
                player.setRate(RATES[r]);
              }}
              className={`rounded-md border px-3 py-1.5 text-[0.9rem] font-bold ${rate === r ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface text-ink-2 hover:bg-surface-2'}`}
            >
              {r === 'normal' ? 'Normal' : 'Yavaş'}
            </button>
          ))}
        </div>
      </div>
      <p className="t-small min-h-[1.25rem] text-ink-2">{status === 'playing' && current ? `Okunuyor: ${current}` : notice}</p>
      <p className="sr-only" aria-live="polite">
        {notice}
      </p>
      <p className="t-small text-ink-3">
        {v(
          'Site raporunu hiçbir yere göndermez; ses, cihazının kendi konuşma özelliğiyle üretilir. Ses Türkçe değilse cihazının ayarlarından Türkçe konuşma sesini indir.',
          'Site raporu hiçbir yere göndermez; ses, cihazınızın kendi konuşma özelliğiyle üretilir. Ses Türkçe değilse cihazınızın ayarlarından Türkçe konuşma sesini indirin.',
        )}
      </p>
    </section>
  );
}
