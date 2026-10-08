'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { analyzeRecording, type AudioAnalysis } from '@/lib/oral/audio';
import { ORAL_MAX_WPM } from '@/lib/scoring/oral';
import { ProgressRuler } from '../likert-runner';
import { useLeaveWarning } from '../tasks/common';
import { AsrClient } from './asr-client';
import { analysisErrorKind, runAutoAnalysis, wipeAudio, type AnalysisErrorKind, type AutoAnalysisResult } from './auto-analysis';
import { MIC_HELP, MicCheck, MicLevel, ModelStatus, ProgressBar, type ModelState } from './mic-check';
import { clock } from './player';
import { MicError, MicRecorder, micSupported, type MicErrorKind } from './recorder';
import type { OralClientPassage, OralFinish } from './types';

/**
 * Sesli okuma, öğrencinin tek başına yaptığı sürüm: öğrenci metni seçer, mikrofonu dener, metni sesli okur ve isterse
 * okumasını bu cihazdaki yapay zekâ inceler; inceleme sürerken soruları cevaplar. Kaydı hiçbir yetişkin dinlemez.
 * Ses yalnızca bu sayfanın belleğinde durur: hiçbir yere gönderilmez, inceleme bitince (ya da öğrenci "Hayır" deyince)
 * sıfırlanıp bırakılır. Rapor için yalnızca kelime işaretleri, süreler, cevaplar ve sesten cihazda hesaplanan özet
 * sayılar gönderilir.
 */

type Step = 'intro' | 'passage' | 'mic' | 'ready' | 'reading' | 'check' | 'consent' | 'declined' | 'questions' | 'waiting' | 'failed';

const PARTS: { name: string; steps: Step[] }[] = [
  { name: 'Hazırlık', steps: ['intro', 'passage', 'mic'] },
  { name: 'Okuma', steps: ['ready', 'reading', 'check', 'consent', 'declined'] },
  { name: 'Sorular', steps: ['questions', 'waiting', 'failed'] },
];

const STEP_TITLES: Record<Step, string> = {
  intro: 'Başlarken',
  passage: 'Metin seçimi',
  mic: 'Mikrofon denemesi',
  ready: 'Sesli okuma',
  reading: 'Sesli okuma',
  check: 'Kayıt denetimi',
  consent: 'İnceleme',
  declined: 'İnceleme',
  questions: 'Sorular',
  waiting: 'Rapor',
  failed: 'Rapor',
};

/** Ekrandaki adım sırası (okuma ile hazır ekranı, izin ile vazgeçme, bekleme ile hata birer adım sayılır). */
const ORDER: Step[] = ['intro', 'passage', 'mic', 'ready', 'check', 'consent', 'questions', 'waiting'];
const SHOWN: Partial<Record<Step, Step>> = { reading: 'ready', declined: 'consent', failed: 'waiting' };

const MAX_READING_MS = 10 * 60_000;
/** "Bitirdim"e kayıt başladıktan hemen sonra (ör. çift dokunuşla) basılırsa yok sayılır. */
const TAP_GUARD_MS = 1500;
/** Okuma sırasında mikrofonun kopup kopmadığı bu aralıkla denetlenir. */
const LOST_POLL_MS = 500;

const LEAVE_TEXT = 'Sayfadan ayrılırsan okuman ve cevapların silinir; hiçbir yere kaydedilmez. Yine de ayrılmak istiyor musun?';

/** Sınıfa göre okuma metninin yazı boyutu: küçük sınıflarda daha iri ve seyrek (yetişkinli sürümle aynı). */
function fontFor(grade: number): string {
  if (grade <= 2) return 'text-[1.6rem] sm:text-[1.85rem]';
  if (grade <= 4) return 'text-[1.4rem] sm:text-[1.55rem]';
  return 'text-[1.25rem] sm:text-[1.375rem]';
}

const subscribeNever = () => () => {};
/** Bu cihaz hem ses kaydını hem de yapay zekâyı çalıştırabilir mi (sunucuda bilinemez; sayfa açılınca denetlenir). */
const deviceCapable = () => micSupported() && AsrClient.supported();

interface Reading {
  analysis: AudioAnalysis;
  durationMs: number;
  interrupted: boolean;
  autoStopped: boolean;
}

type Issue = 'silent' | 'interrupted' | 'fast' | 'quiet' | 'noisy' | 'clipped';
/** Bu sorunlarda okuma incelenmez: yeniden okunmalı. Ötekilerde (ses kısık, gürültülü, yüksek) yine de devam edilebilir. */
const HARD: Issue[] = ['silent', 'interrupted', 'fast'];

/** Okuma kaydında incelemeyi bozacak bir sorun var mı: ses yok, kesinti, metnin tamamı için çok kısa süre ya da ses kalitesi. */
function readingIssue(r: Reading, passage: OralClientPassage): Issue | null {
  const a = r.analysis;
  if (a.quality === 'silent' || a.speechStartMs === null || a.speechEndMs === null || a.speechMs < 1000) return 'silent';
  if (r.interrupted) return 'interrupted';
  const ms = a.speechEndMs - a.speechStartMs >= 1000 ? a.speechEndMs - a.speechStartMs : r.durationMs;
  if (!r.autoStopped && passage.words / (ms / 60_000) > ORAL_MAX_WPM) return 'fast';
  if (a.quality !== 'good') return a.quality;
  return null;
}

const ISSUE_TEXT: Record<Issue, { title: string; text: string }> = {
  silent: { title: 'Sesini duyamadık', text: 'Kayıtta sesin yok gibi görünüyor. Mikrofonu yeniden deneyelim, sonra yeniden okursun.' },
  interrupted: {
    title: 'Kayıt kesildi',
    text: 'Okurken kayıt kesildi: Ekran kapanmış, başka bir uygulamaya geçilmiş ya da mikrofon kesilmiş olabilir. Okurken ekranı açık tut ve bu sayfada kal.',
  },
  fast: {
    title: 'Okuman çok kısa sürdü',
    text: 'Bu metni bu kadar kısa sürede okumak çok zor. Metnin tamamını okumamış ya da “Bitirdim”e erken basmış olabilirsin.',
  },
  quiet: { title: 'Sesin kısık geldi', text: 'Yapay zekâ kısık sesi iyi anlayamayabilir. Cihaza biraz yaklaşıp biraz daha yüksek sesle yeniden okuyabilirsin.' },
  noisy: { title: 'Arka planda gürültü vardı', text: 'Gürültü, okumanın doğru incelenmesini zorlaştırır. Daha sessiz bir yerde yeniden okuyabilirsin.' },
  clipped: { title: 'Sesin çok yüksek geldi', text: 'Ses cızırtılı olmuş olabilir. Cihazı biraz uzaklaştırıp yeniden okuyabilirsin.' },
};

const ANALYSIS_HELP: Record<AnalysisErrorKind, string> = {
  memory: 'İnceleme sırasında cihazın belleği yetmedi. Öteki uygulamaları ve sekmeleri kapatıp yeniden dene. Metni yeniden okuman gerekmez.',
  network: 'Yapay zekâ yeniden indirilemedi: İnternet bağlantını kontrol edip yeniden dene. Metni yeniden okuman gerekmez.',
  unsupported: 'Bu cihaz incelemeyi yapamıyor. Bir bilgisayarda ya da başka bir cihazda yeniden deneyebilirsin.',
  unknown: 'Okumanı incelerken bir sorun çıktı. Yeniden dene; metni yeniden okuman gerekmez.',
  nomatch:
    'Yapay zekâ okumanı yeterince anlayamadı. Sesin kısık ya da ortam gürültülü olmuş olabilir. Daha sessiz bir yerde, cihaza yakın ve net bir sesle yeniden okuyabilirsin.',
};

type Job =
  | { status: 'idle' }
  | { status: 'running'; ratio: number; preparing: boolean }
  | { status: 'done'; result: AutoAnalysisResult }
  | { status: 'error'; kind: AnalysisErrorKind };

function Stepper({ step }: { step: Step }) {
  const shown = SHOWN[step] ?? step;
  const n = ORDER.indexOf(shown) + 1;
  const part = PARTS.find((p) => p.steps.includes(step))!;
  return (
    <div className="flex flex-col gap-2.5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] font-bold" aria-label="Bölümler">
        {[...PARTS.map((p) => p.name), 'Rapor'].map((name, i, all) => (
          <li key={name} className="flex items-center gap-2">
            <span className={name === part.name ? 'rounded-full bg-ink px-2.5 py-0.5 text-paper' : 'text-ink-3'} aria-current={name === part.name ? 'step' : undefined}>
              {name}
            </span>
            {i < all.length - 1 && (
              <span className="text-ink-3" aria-hidden="true">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
      <ProgressRuler total={ORDER.length} done={n - 1} current={n - 1} />
      <p className="t-small tabular text-ink-3">
        Adım {n} / {ORDER.length}: {STEP_TITLES[step]}
      </p>
    </div>
  );
}

/** Kayıt sürerken görünen gösterge: kırmızı nokta, geçen süre ve ses düzeyi. */
function RecordingBadge({ recorder, startedAt }: { recorder: MicRecorder; startedAt: number }) {
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const t = window.setInterval(() => setNow(performance.now()), 250);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-danger/40 bg-danger-bg px-4 py-3" role="status">
      <p className="flex items-center gap-2 font-bold text-danger">
        <span className="size-3 animate-pulse rounded-full bg-danger" aria-hidden="true" />
        Kayıt sürüyor · <span className="tabular">{clock(now - startedAt)}</span>
      </p>
      <MicLevel recorder={recorder} compact quietAfterMs={8000} />
    </div>
  );
}

/** İnceleme sürerken ekranın kararmasını önler (desteklenen tarayıcılarda); sayfaya dönülünce yeniden ister. */
function useScreenAwake(active: boolean) {
  useEffect(() => {
    if (!active) return;
    type Lock = { release: () => Promise<void> };
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<Lock> } };
    let lock: Lock | null = null;
    let gone = false;
    const acquire = async () => {
      try {
        const l = (await nav.wakeLock?.request('screen')) ?? null;
        if (gone) void l?.release().catch(() => {});
        else lock = l;
      } catch {
        // izin verilmedi ya da desteklenmiyor: inceleme yine sürer
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void acquire();
    };
    void acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      gone = true;
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release().catch(() => {});
    };
  }, [active]);
}

export function OralAutoRunner(props: {
  intro: { title: string };
  grade: number;
  passages: OralClientPassage[];
  onFinish: (data: OralFinish) => Promise<void>;
}) {
  const { grade } = props;
  const simple = grade <= 2;
  const capable = useSyncExternalStore(subscribeNever, deviceCapable, () => true);
  const [step, setStep] = useState<Step>('intro');
  const [passageKey, setPassageKey] = useState<string | null>(null);
  const passage = props.passages.find((p) => p.key === passageKey) ?? null;

  const [recorder, setRecorder] = useState<MicRecorder | null>(null);
  const [micError, setMicError] = useState<MicErrorKind | null>(null);
  const [opening, setOpening] = useState(false);
  // Mikrofon denemesi her kapanıp açılışta baştan başlar (bileşen bu sayıyla yeniden kurulur).
  const [micRound, setMicRound] = useState(0);
  const [micPassed, setMicPassed] = useState(false);

  // Bir çalıştırıcıda tek yapay zekâ istemcisi: mikrofon adımında oluşturulur, sayfadan çıkınca kapatılır.
  const [client, setClient] = useState<AsrClient | null>(null);
  const clientRef = useRef<AsrClient | null>(null);
  const [model, setModel] = useState<ModelState>({ status: 'idle' });

  const [recStart, setRecStart] = useState(0);
  const [reading, setReading] = useState<Reading | null>(null);
  // Okuma kaydının sesi yalnızca burada durur (ekrana çizilmez); silinince sıfırlanır.
  const vault = useRef<{ samples: Float32Array | null }>({ samples: null });
  const autoStop = useRef<number | null>(null);
  const starting = useRef(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);
  const [questionsDone, setQuestionsDone] = useState(false);
  const [job, setJob] = useState<Job>({ status: 'idle' });
  const [jobFails, setJobFails] = useState(0);
  const jobId = useRef(0);
  const [audioGone, setAudioGone] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const sent = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useLeaveWarning(step !== 'intro' && step !== 'passage' && step !== 'declined' && step !== 'failed', LEAVE_TEXT);
  useScreenAwake(job.status === 'running');

  // Her adımda sayfanın başına dön ve başlığa odaklan (ekran okuyucular yeni adımı duyurur).
  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [step, qIndex]);

  // Sayfadan çıkınca mikrofonu ve yapay zekâyı kapat, bellekteki sesi sil.
  useEffect(() => () => recorder?.close(), [recorder]);
  useEffect(() => () => client?.dispose(), [client]);
  useEffect(() => {
    const v = vault.current;
    return () => {
      if (autoStop.current) window.clearTimeout(autoStop.current);
      wipeAudio(v.samples);
      v.samples = null;
    };
  }, []);

  /* ---------- Yapay zekâ ---------- */

  /** Yeni bir istemci açıp modeli indirir ve kurar; hazır olunca istemciyi döndürür. */
  function startModel(): Promise<AsrClient> {
    if (!AsrClient.supported()) {
      setModel({ status: 'error', kind: 'unsupported' });
      return Promise.reject(Object.assign(new Error('unsupported'), { kind: 'unsupported' }));
    }
    const c = new AsrClient();
    clientRef.current = c;
    setClient(c);
    setModel({ status: 'loading', stage: 'download', ratio: 0 });
    let shown = '';
    return c
      .load((p) => {
        if (clientRef.current !== c) return;
        const key = `${p.stage}:${Math.floor(p.ratio * 100)}`;
        if (key === shown) return;
        shown = key;
        setModel({ status: 'loading', stage: p.stage, ratio: p.ratio, loadedBytes: p.loadedBytes, totalBytes: p.totalBytes });
      })
      .then(
        () => {
          if (clientRef.current === c) setModel({ status: 'ready' });
          return c;
        },
        (err: unknown) => {
          if (clientRef.current === c) setModel({ status: 'error', kind: analysisErrorKind(err) });
          throw err;
        },
      );
  }

  function retryModel() {
    startModel().catch(() => {
      // hata ekranda gösteriliyor
    });
  }

  /* ---------- Mikrofon ---------- */

  async function openMic() {
    setOpening(true);
    setMicError(null);
    try {
      setRecorder(await MicRecorder.open());
    } catch (err) {
      setMicError(err instanceof MicError ? err.kind : 'unknown');
    } finally {
      setOpening(false);
    }
  }

  /** Mikrofonu kapatır; deneme baştan başlar. `kind` verilirse mikrofon adımında nedeni gösterilir. */
  function resetMic(kind: MicErrorKind | null) {
    recorder?.close();
    setRecorder(null);
    setMicError(kind);
    setMicPassed(false);
    setMicRound((n) => n + 1);
  }

  function toMic(kind: MicErrorKind | null = null) {
    resetMic(kind);
    setStep('mic');
  }

  function fromPassage() {
    if (micPassed && recorder && !recorder.lost && model.status === 'ready') {
      setStep('ready');
      return;
    }
    if (!clientRef.current) retryModel();
    // Deneme geçilmişti ama mikrofon koptu ya da yapay zekâ hazır değil: deneme baştan yapılır.
    if (micPassed || recorder?.lost) resetMic(recorder?.lost ? 'lost' : null);
    setStep('mic');
  }

  /* ---------- Okuma ---------- */

  function discardReading() {
    wipeAudio(vault.current.samples);
    vault.current.samples = null;
    setReading(null);
  }

  async function startReading() {
    if (!recorder || starting.current || recorder.isRecording) return;
    starting.current = true;
    try {
      if (!(await recorder.wake())) {
        toMic(recorder.lost ? 'lost' : 'busy');
        return;
      }
      discardReading();
      await recorder.start();
      setRecStart(performance.now());
      setStep('reading');
      if (autoStop.current) window.clearTimeout(autoStop.current);
      autoStop.current = window.setTimeout(() => stopReading(true), MAX_READING_MS);
    } finally {
      starting.current = false;
    }
  }

  function stopReading(auto = false) {
    if (!recorder?.isRecording || !passage) return;
    if (!auto && performance.now() - recStart < TAP_GUARD_MS) return;
    if (autoStop.current) window.clearTimeout(autoStop.current);
    autoStop.current = null;
    const rec = recorder.stop();
    const r: Reading = { analysis: analyzeRecording(rec.samples, rec.sampleRate), durationMs: rec.durationMs, interrupted: rec.interrupted, autoStopped: auto };
    wipeAudio(vault.current.samples);
    vault.current.samples = rec.samples;
    setReading(r);
    setAudioGone(false);
    setStep(readingIssue(r, passage) ? 'check' : 'consent');
  }

  // Okurken mikrofon koparsa (ör. kulaklık çıkarıldı) kayıt silinir ve mikrofon denemesine dönülür.
  useEffect(() => {
    if (step !== 'reading' || !recorder) return;
    const t = window.setInterval(() => {
      if (!recorder.lost) return;
      window.clearInterval(t);
      if (autoStop.current) window.clearTimeout(autoStop.current);
      autoStop.current = null;
      if (recorder.isRecording) wipeAudio(recorder.stop().samples);
      recorder.close();
      setRecorder(null);
      setMicError('lost');
      setMicPassed(false);
      setMicRound((n) => n + 1);
      setStep('mic');
    }, LOST_POLL_MS);
    return () => window.clearInterval(t);
  }, [step, recorder]);

  function readAgain() {
    discardReading();
    if (recorder && !recorder.lost) setStep('ready');
    else toMic(recorder ? 'lost' : null);
  }

  function otherPassage() {
    discardReading();
    setPassageKey(null);
    setStep('passage');
  }

  /* ---------- İnceleme ve sorular ---------- */

  /** Kaydı inceler; bittiğinde sesi hemen siler. Model kapanmışsa (ör. bellek hatasından sonra) önce yeniden kurulur. */
  function startJob() {
    const samples = vault.current.samples;
    const c = clientRef.current;
    if (!samples || !c || !passage || !reading) {
      setJob({ status: 'error', kind: 'unknown' });
      return;
    }
    const id = ++jobId.current;
    const r = reading;
    const paragraphs = passage.paragraphs;
    let shown = '';
    setJob({ status: 'running', ratio: 0, preparing: false });
    runAutoAnalysis({
      client: c,
      paragraphs,
      samples,
      analysis: r.analysis,
      onProgress: (ratio, preparing) => {
        if (jobId.current !== id) return;
        const key = `${preparing}:${Math.floor(ratio * 100)}`;
        if (key === shown) return;
        shown = key;
        setJob({ status: 'running', ratio, preparing });
      },
    }).then(
      (result) => {
        if (jobId.current !== id) return;
        wipeAudio(samples);
        if (vault.current.samples === samples) vault.current.samples = null;
        setAudioGone(true);
        setJob({ status: 'done', result });
      },
      (err: unknown) => {
        if (jobId.current !== id) return;
        const kind = analysisErrorKind(err);
        // Okuma metinle eşleşmediyse yeniden incelemek sonucu değiştirmez: ses hemen silinir.
        if (kind === 'nomatch') {
          wipeAudio(samples);
          if (vault.current.samples === samples) vault.current.samples = null;
          setAudioGone(true);
        }
        setJobFails((n) => n + 1);
        setJob({ status: 'error', kind });
      },
    );
  }

  function analyse() {
    // Kayıt bitti: mikrofon kapatılır (tarayıcıdaki kayıt simgesi söner).
    recorder?.close();
    setRecorder(null);
    setMicPassed(false);
    setMicRound((n) => n + 1);
    setAnswers({});
    setQIndex(0);
    setQuestionsDone(false);
    setSendError(null);
    setJobFails(0);
    sent.current = false;
    startJob();
    setStep('questions');
  }

  function decline() {
    discardReading();
    setAudioGone(true);
    recorder?.close();
    setRecorder(null);
    setMicPassed(false);
    setMicRound((n) => n + 1);
    setStep('declined');
  }

  function giveUp() {
    jobId.current++;
    discardReading();
    setAudioGone(true);
    setJob({ status: 'idle' });
    setStep('failed');
  }

  function restart() {
    setPassageKey(null);
    setQuestionsDone(false);
    setJob({ status: 'idle' });
    setStep('passage');
  }

  async function send(result: AutoAnalysisResult) {
    if (!passage || !reading) return;
    const a = reading.analysis;
    const data: OralFinish = {
      auto: true,
      passageKey: passage.key,
      recordMs: Math.round(reading.durationMs),
      readingMs: result.readingMs,
      timingAuto: result.timingAuto,
      audio:
        a.quality === 'silent'
          ? null
          : {
              quality: a.quality,
              pauses: a.pauses.slice(0, 1000).map(([s, e]) => [Math.round(s), Math.round(e)] as [number, number]),
              speechMs: Math.round(a.speechMs),
              contour: a.contour,
              interrupted: reading.interrupted,
            },
      marks: result.marks,
      listened: 1,
      retell: null,
      answers,
      prosody: null,
    };
    try {
      await props.onFinish(data);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Rapor hazırlanamadı. Lütfen tekrar dene.');
    }
  }

  // Sorular bitip inceleme de bitince rapor istenir (hangisi sonra biterse).
  useEffect(() => {
    if (!questionsDone || job.status !== 'done' || sent.current) return;
    sent.current = true;
    void send(job.result);
  });

  const title = (text: string) => (
    <h1 ref={heading} tabIndex={-1} className="t-h1 outline-none">
      {text}
    </h1>
  );

  const shell = (children: React.ReactNode) => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
      <Stepper step={step} />
      {children}
    </div>
  );

  /* ---------- Hazırlık ---------- */

  if (step === 'intro') {
    return shell(
      <>
        {title(props.intro.title)}
        <p className="text-lg">
          {simple
            ? 'Bir metni sesli okuyacaksın. Sonra birkaç soru cevaplayacaksın.'
            : 'Bir metni sesli okuyacaksın. Okuman bitince birkaç soruyu cevaplayacaksın; sonunda raporun ekranda açılacak.'}
        </p>
        <section className="flex flex-col gap-3" aria-labelledby="nasil">
          <h2 id="nasil" className="t-h3">
            Neler olacak?
          </h2>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-lg">
            <li>Bir metin seçeceksin.</li>
            <li>Mikrofonu birlikte deneyeceğiz.</li>
            <li>Metni sesli okuyacaksın. Bitince “Bitirdim”e basacaksın.</li>
            <li>İstersen okumanı yapay zekâ inceleyecek. Bu sırada sen soruları cevaplayacaksın.</li>
            <li>Sonunda raporun ekranda açılacak.</li>
          </ol>
        </section>
        <div className="notice notice-ok flex flex-col gap-1.5">
          <p className="font-bold">Kaydını kimse dinlemez.</p>
          <p>
            {simple
              ? 'Okumanı bu cihazdaki yapay zekâ inceler. Kaydın hiçbir yere gitmez. İnceleme bitince silinir.'
              : 'Okumanı bu cihazdaki yapay zekâ inceler. Ses kaydın hiçbir yere gönderilmez ve saklanmaz; inceleme bitince hemen silinir.'}
          </p>
        </div>
        <section className="panel flex flex-col gap-3 p-6" aria-labelledby="gerekenler">
          <h2 id="gerekenler" className="t-h3">
            Neler gerekiyor?
          </h2>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>Sessiz bir oda ve yaklaşık 15 dakika.</li>
            <li>Mikrofonu olan bir telefon, tablet ya da bilgisayar. Bilgisayarda inceleme daha hızlı biter.</li>
            <li>İnternet: Yapay zekâ ilk seferde yaklaşık 250 MB indirir. Mümkünse Wi-Fi kullan. Hazırlık ve inceleme birkaç dakika sürebilir.</li>
            <li>Daha önce okumadığın bir metin.</li>
          </ul>
        </section>
        {simple && <p className="notice notice-info">Bir büyüğün düğmelere basmana yardım edebilir. Ama okurken sana kelime söylemesin.</p>}
        {!capable && (
          <div className="notice notice-danger flex flex-col gap-1.5" role="alert">
            <p className="font-bold">Bu cihazda okuma incelemesi yapılamıyor.</p>
            <p>
              Bu cihaz ya da tarayıcı, ses kaydını ya da okumayı inceleyen yapay zekâyı çalıştıramıyor. Bir bilgisayarda ya da daha yeni bir cihazda,
              Chrome, Edge ya da Safari’nin güncel sürümüyle yeniden dene.
            </p>
          </div>
        )}
        <div>
          <button type="button" className="btn btn-primary btn-lg" disabled={!capable} onClick={() => setStep('passage')}>
            Başlayalım
          </button>
        </div>
      </>,
    );
  }

  if (step === 'passage') {
    const own = props.passages.filter((p) => p.grade === grade);
    const other = props.passages.filter((p) => p.grade !== grade).sort((a, b) => a.grade - b.grade);
    const card = (p: OralClientPassage) => {
      const on = passageKey === p.key;
      return (
        <li key={p.key}>
          <button
            type="button"
            aria-pressed={on}
            onClick={() => setPassageKey(p.key)}
            className={`flex w-full flex-col items-start gap-1 rounded-xl border-[1.5px] p-4 text-left transition-colors ${on ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface hover:border-ink'}`}
          >
            <span className="font-display text-xl font-bold">{p.title}</span>
            <span className={`t-small ${on ? 'text-paper/80' : 'text-ink-2'}`}>
              {p.grade}. sınıf · {p.genre === 'narrative' ? 'Öykü' : 'Bilgi veren metin'} · {p.words} kelime
            </span>
          </button>
        </li>
      );
    };
    return shell(
      <>
        {title('Bir metin seç')}
        <p className="text-lg">{simple ? 'Daha önce okumadığın bir metin seç.' : `Kendi sınıfının (${grade}. sınıf) metinlerinden, daha önce okumadığın birini seç.`}</p>
        <ul className="flex flex-col gap-2.5">{own.map(card)}</ul>
        {other.length > 0 && (
          <details className="flex flex-col gap-3" open={!!passageKey && !own.some((p) => p.key === passageKey)}>
            <summary className="cursor-pointer font-bold">Başka sınıfların metinleri</summary>
            <p className="t-small mt-2 mb-3 text-ink-2">
              Kendi sınıfının metinleri çok zor ya da çok kolay gelirse bir alt ya da bir üst sınıfın metnini seçebilirsin.
            </p>
            <ul className="flex flex-col gap-2.5">{other.map(card)}</ul>
          </details>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" disabled={!passage} onClick={fromPassage}>
            Bu metinle devam et
          </button>
        </div>
      </>,
    );
  }

  if (step === 'mic') {
    const unsupported = model.status === 'error' && model.kind === 'unsupported';
    return shell(
      <>
        {title('Mikrofonu deneyelim')}
        <p className="text-lg">
          {simple
            ? 'Sesini net duymamız gerekiyor. Üç kısa adım var.'
            : 'Okumanı iyi inceleyebilmemiz için sesini net duymamız gerekiyor. Üç kısa adım var; hepsi tamam olunca okumaya geçersin.'}
        </p>
        <ModelStatus model={model} onRetry={retryModel} />
        {unsupported ? (
          <div>
            <button type="button" className="btn btn-quiet" onClick={() => setStep('passage')}>
              Geri
            </button>
          </div>
        ) : (
          <MicCheck
            key={micRound}
            grade={grade}
            recorder={recorder}
            opening={opening}
            micError={micError}
            onOpen={openMic}
            onLost={(kind) => resetMic(kind)}
            client={client}
            modelReady={model.status === 'ready'}
            onContinue={() => {
              setMicPassed(true);
              setStep('ready');
            }}
            onBack={() => setStep('passage')}
          />
        )}
      </>,
    );
  }

  /* ---------- Okuma ---------- */

  if (step === 'ready' && passage) {
    return shell(
      <>
        <p className="t-meta">Okuyacağın metin</p>
        {title(passage.title)}
        <ul className="flex list-disc flex-col gap-2 pl-6 text-xl leading-relaxed">
          {simple ? (
            <>
              <li>Düğmeye bas. Metin açılacak.</li>
              <li>Metni sesli oku.</li>
              <li>Bilmediğin kelimede elinden geleni yap.</li>
              <li>Bitince “Bitirdim”e bas.</li>
            </>
          ) : (
            <>
              <li>Düğmeye basınca metin açılacak ve kayıt başlayacak.</li>
              <li>Metni baştan sona sesli oku. Her zamanki gibi oku: ne çok hızlı ne çok yavaş.</li>
              <li>Bilmediğin bir kelimede elinden geleni yap ve devam et.</li>
              <li>Son kelimeyi okuyunca “Bitirdim” düğmesine bas.</li>
              <li>Okurken metni anlamaya çalış: Sonra sorular gelecek.</li>
            </>
          )}
        </ul>
        <p className="notice notice-info">Okurken kimse sana kelime söylemesin ya da yardım etmesin. Kaydını kimse dinlemez.</p>
        {micError && <p className="notice notice-danger">{MIC_HELP[micError]}</p>}
        <div>
          <button type="button" className="btn btn-primary btn-lg" onClick={startReading}>
            Başla
          </button>
        </div>
      </>,
    );
  }

  if (step === 'reading' && passage && recorder) {
    return (
      <article className="mx-auto flex w-full max-w-[44rem] flex-col gap-6 pb-28">
        <h1 ref={heading} tabIndex={-1} className="sr-only outline-none">
          {passage.title}: sesli okuma, kayıt sürüyor
        </h1>
        <RecordingBadge recorder={recorder} startedAt={recStart} />
        <div className={`flex flex-col gap-6 leading-[1.9] ${fontFor(passage.grade)}`}>
          {passage.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="sticky bottom-4 mt-4">
          <button type="button" className="btn btn-primary btn-lg w-full shadow-[var(--shadow)]" onClick={() => stopReading()}>
            Bitirdim
          </button>
        </div>
      </article>
    );
  }

  if (step === 'check' && reading && passage) {
    const issue = readingIssue(reading, passage);
    const hard = !issue || HARD.includes(issue);
    const info = issue ? ISSUE_TEXT[issue] : { title: 'Kayıt denetimi', text: 'Kayıt iyi görünüyor.' };
    return shell(
      <>
        {title(info.title)}
        <p className={`notice ${hard ? 'notice-danger' : 'notice-warn'}`} role="alert">
          {info.text}
        </p>
        {issue !== 'silent' && <p className="t-small text-ink-2">Aynı metni ikinci kez okumak daha kolaydır. İstersen başka bir metin seçebilirsin.</p>}
        <div className="flex flex-wrap gap-3">
          {issue === 'silent' ? (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                discardReading();
                toMic(recorder?.lost ? 'lost' : null);
              }}
            >
              Mikrofonu yeniden dene
            </button>
          ) : (
            <button type="button" className="btn btn-primary btn-lg" onClick={readAgain}>
              Yeniden oku
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={otherPassage}>
            Başka metin seç
          </button>
        </div>
        {!hard && (
          <div className="flex flex-col gap-2 border-t border-rule pt-5">
            <p className="t-small text-ink-2">Yine de devam edersen inceleme daha az doğru olabilir.</p>
            <div>
              <button type="button" className="btn btn-quiet" onClick={() => setStep('consent')}>
                Yine de devam et
              </button>
            </div>
          </div>
        )}
      </>,
    );
  }

  if (step === 'consent' && reading && passage) {
    return shell(
      <>
        {title('Okumanı analiz etmemizi ister misin?')}
        {reading.autoStopped && (
          <p className="notice notice-info">10 dakika dolduğu için kayıt kendiliğinden durdu. Okuyabildiğin kadarını inceleyeceğiz.</p>
        )}
        <p className="text-lg">
          {simple
            ? 'Evet dersen okumanı bu cihazdaki yapay zekâ inceler. Kaydın hiçbir yere gitmez, kimse dinlemez. İnceleme bitince kaydın silinir. Hayır dersen kaydın hemen silinir.'
            : 'Evet dersen okumanı bu cihazdaki yapay zekâ inceler: Okuduğun kelimeleri metinle karşılaştırır, hızını ve duraklarını ölçer. Ses kaydın hiçbir yere gönderilmez ve kimse dinlemez; inceleme bitince hemen silinir. Sen bu sırada soruları cevaplarsın. Hayır dersen kaydın hemen silinir.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" onClick={analyse}>
            Evet, analiz et
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={decline}>
            Hayır
          </button>
        </div>
      </>,
    );
  }

  if (step === 'declined') {
    return shell(
      <>
        {title('Tamam, kaydın silindi')}
        <p className="text-lg">Okuman hiçbir yere gönderilmedi ve kimse dinlemedi. İstersen metni yeniden okuyabilirsin.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => toMic()}>
            Yeniden oku
          </button>
          <Link href="/testler" className="btn btn-secondary btn-lg">
            Testlerden çık
          </Link>
        </div>
      </>,
    );
  }

  /* ---------- Sorular ve inceleme ---------- */

  const jobNote =
    job.status === 'done'
      ? '✓ Okumanın incelemesi bitti. Ses kaydın silindi.'
      : job.status === 'error'
        ? 'İncelemede bir sorun çıktı. Soruları bitirince yeniden deneyebilirsin.'
        : 'Sen soruları cevaplarken okumanı inceliyoruz.';

  if (step === 'questions' && passage) {
    const qs = passage.questions;
    const q = qs[qIndex];
    if (!q) {
      return shell(
        <>
          {title('Sorular bitti')}
          <div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                setQuestionsDone(true);
                setStep('waiting');
              }}
            >
              Devam
            </button>
          </div>
        </>,
      );
    }
    const chosen = answers[q.key];
    const isLast = qIndex === qs.length - 1;
    const done = qs.every((x) => answers[x.key]);
    return shell(
      <>
        <div className="flex flex-col gap-1">
          <p className="t-meta">
            Soru {qIndex + 1} / {qs.length}
          </p>
          {simple && <p className="t-small text-ink-3">Soruyu ve seçenekleri bir büyüğün sesli okuyabilir; cevabı sen seç.</p>}
        </div>
        <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(1.45rem,3.6vw,2rem)] font-bold leading-tight outline-none">
          {q.text}
        </h1>
        <fieldset className="flex flex-col gap-2.5">
          <legend className="sr-only">{q.text}</legend>
          {q.options.map((o) => {
            const sel = chosen === o.key;
            return (
              <button
                key={o.key}
                type="button"
                aria-pressed={sel}
                onClick={() => setAnswers((x) => ({ ...x, [q.key]: o.key }))}
                className={`flex min-h-[3.4rem] items-center gap-4 rounded-xl border-[1.5px] px-4 py-3 text-left text-[1.125rem] transition-colors ${
                  sel ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface hover:border-ink'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold uppercase ${sel ? 'border-paper/60' : 'border-rule-strong text-ink-3'}`}
                  aria-hidden="true"
                >
                  {o.key}
                </span>
                {o.text}
              </button>
            );
          })}
        </fieldset>
        <div className="flex items-center justify-between gap-3">
          <button type="button" className="btn btn-quiet" disabled={qIndex === 0} onClick={() => setQIndex(qIndex - 1)}>
            Önceki soru
          </button>
          {isLast ? (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!done}
              onClick={() => {
                setQuestionsDone(true);
                setStep('waiting');
              }}
            >
              Soruları bitir
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={!chosen} onClick={() => setQIndex(qIndex + 1)}>
              Sonraki soru
            </button>
          )}
        </div>
        {isLast && !done && <p className="t-meta">Bitirmek için bütün soruları cevapla.</p>}
        <p className="t-small border-t border-rule pt-4 text-ink-3" role="status">
          {jobNote}
        </p>
      </>,
    );
  }

  if (step === 'waiting') {
    if (job.status === 'error') {
      const nomatch = job.kind === 'nomatch';
      const giveUpNow = !nomatch && (jobFails >= 2 || job.kind === 'unsupported');
      return shell(
        <>
          {title(nomatch ? 'Okumanı anlayamadık' : 'Okumanı inceleyemedik')}
          <p className="notice notice-warn" role="alert">
            {giveUpNow
              ? 'Bu cihaz incelemeyi bitiremedi. Kaydını silip bir bilgisayarda ya da başka bir cihazda yeniden deneyebilirsin.'
              : ANALYSIS_HELP[job.kind]}
          </p>
          {audioGone && <p className="t-small text-ink-2">Ses kaydın silindi.</p>}
          <div className="flex flex-wrap gap-3">
            {nomatch ? (
              <button type="button" className="btn btn-primary btn-lg" onClick={() => toMic()}>
                Yeniden oku
              </button>
            ) : (
              <>
                {!giveUpNow && (
                  <button type="button" className="btn btn-primary btn-lg" onClick={startJob}>
                    Yeniden dene
                  </button>
                )}
                <button type="button" className={giveUpNow ? 'btn btn-primary btn-lg' : 'btn btn-quiet'} onClick={giveUp}>
                  Kaydı sil ve bitir
                </button>
              </>
            )}
          </div>
        </>,
      );
    }
    if (job.status === 'done') {
      return shell(
        <>
          {title(sendError ? 'Rapor hazırlanamadı' : 'Raporun hazırlanıyor…')}
          <p className="notice notice-ok font-bold" role="status">
            Okumanın incelemesi bitti. Ses kaydın silindi.
          </p>
          {sendError && (
            <div className="flex flex-col gap-3">
              <p className="notice notice-danger" role="alert">
                {sendError}
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    setSendError(null);
                    void send(job.result);
                  }}
                >
                  Tekrar dene
                </button>
              </div>
            </div>
          )}
        </>,
      );
    }
    const ratio = job.status === 'running' ? job.ratio : 0;
    const preparing = job.status === 'running' && job.preparing;
    return shell(
      <>
        {title(`Okumanı inceliyoruz… %${Math.round(ratio * 100)}`)}
        <ProgressBar ratio={ratio} label="Okumanın incelenmesi" />
        <p className="text-lg">
          {preparing ? 'Yapay zekâ yeniden hazırlanıyor. ' : ratio >= 0.95 ? 'Neredeyse bitti: son kontrolleri yapıyoruz. ' : ''}
          Bu birkaç dakika sürebilir. Sayfayı kapatma ve başka bir uygulamaya geçme.
        </p>
        <p className="t-small text-ink-2">İnceleme bu cihazda yapılıyor; ses kaydın hiçbir yere gönderilmiyor ve inceleme bitince silinecek.</p>
      </>,
    );
  }

  if (step === 'failed') {
    return shell(
      <>
        {title('Kaydın silindi')}
        <p className="text-lg">
          Bu cihaz okumanı inceleyemedi. Kaydın hiçbir yere gönderilmedi ve silindi. Bir bilgisayarda ya da başka bir cihazda yeniden deneyebilirsin.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" onClick={restart}>
            Baştan başla
          </button>
          <Link href="/testler" className="btn btn-secondary btn-lg">
            Testlerden çık
          </Link>
        </div>
      </>,
    );
  }

  // Beklenmeyen durum (ör. kayıt kaybolduysa): başa dönme seçeneği.
  return shell(
    <>
      {title('Bir şeyler ters gitti')}
      <p>Bu adım için gereken bilgi bulunamadı. Sayfayı yenileyip baştan başla.</p>
    </>,
  );
}
