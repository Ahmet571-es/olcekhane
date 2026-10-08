'use client';

import { useEffect, useRef, useState } from 'react';
import { analyzeRecording, frameLevels, FRAME_MS } from '@/lib/oral/audio';
import { MIC_CHECK_SENTENCE } from '@/lib/oral/auto';
import type { AsrClient, AsrProgress } from './asr-client';
import { MIC_PASS_RATIO, sentenceMatch, wipeAudio, type AnalysisErrorKind } from './auto-analysis';
import { micSupported, type MicErrorKind, type MicRecorder, type Recording } from './recorder';

/**
 * Öğrencinin tek başına okuduğu akışta mikrofon denemesi: mikrofonu açma, 2 saniyelik sessizlik ölçümü ve ekrandaki
 * cümleyi söyleme. Cümle hem ses ölçümlerinden (konuşma var mı, gürültü, kırpılma, kısıklık, kesinti) hem de yapay
 * zekânın onu tanımasından geçmeden okumaya geçilmez. Deneme kayıtları yalnızca bellekte durur ve hemen silinir.
 */

export type ModelState =
  | { status: 'idle' }
  | ({ status: 'loading' } & AsrProgress)
  | { status: 'ready' }
  | { status: 'error'; kind: AnalysisErrorKind };

export const MIC_HELP: Record<MicErrorKind, string> = {
  unsupported:
    'Bu tarayıcı ses kaydı yapamıyor. Chrome, Safari, Edge ya da Firefox’un güncel bir sürümünü kullan. Bir uygulamanın içinden açılan sayfalar (ör. mesajlaşma uygulaması) mikrofonu açamayabilir.',
  denied:
    'Mikrofon izni verilmedi. Adres çubuğundaki kilit ya da ayar simgesine dokun, bu site için mikrofona izin ver ve sayfayı yenile. iPhone ve iPad’de: Ayarlar › Safari › Mikrofon. Android’de: tarayıcının site ayarları › Mikrofon. Gerekirse bir büyüğünden yardım iste.',
  notfound: 'Bu cihazda mikrofon bulunamadı. Mikrofonlu bir kulaklık tak ya da mikrofonu olan bir telefon, tablet veya bilgisayar kullan.',
  busy: 'Mikrofon şu an kullanılamıyor: Başka bir uygulama (ör. görüntülü arama) kullanıyor olabilir. O uygulamayı kapatıp yeniden dene.',
  lost: 'Mikrofonla bağlantı kesildi (ör. kulaklık çıkarıldı ya da başka bir uygulama mikrofonu aldı). Mikrofonu yeniden açıp tekrar deneyelim.',
  unknown: 'Mikrofon açılamadı. Sayfayı yenileyip yeniden dene; olmazsa başka bir tarayıcı ya da cihaz kullan.',
};

export const MODEL_HELP: Record<AnalysisErrorKind, string> = {
  unsupported:
    'Bu cihaz ya da tarayıcı, okumanı incelemek için gereken yapay zekâyı çalıştıramıyor. Bir bilgisayarda ya da daha yeni bir cihazda, Chrome, Edge ya da Safari’nin güncel sürümüyle yeniden dene.',
  memory:
    'Bu cihazın belleği yapay zekâyı çalıştırmaya yetmedi. Öteki uygulamaları ve sekmeleri kapatıp yeniden dene; olmazsa bir bilgisayar kullan.',
  network: 'Yapay zekâ indirilemedi: İnternet bağlantısı kesilmiş olabilir. Bağlantını kontrol edip yeniden dene; mümkünse Wi-Fi kullan.',
  unknown: 'Yapay zekâ hazırlanamadı. Yeniden dene; olmazsa başka bir cihaz ya da tarayıcı (ör. bir bilgisayarda Chrome) kullan.',
  nomatch: 'Yapay zekâ hazırlanamadı. Yeniden dene.',
};

/* ---------- Ölçütler ---------- */

/** Düğmeye basma sesi ölçüme girmesin: sessizlik kaydının başından atılan süre. */
const LEAD_MS = 300;
const SILENCE_MS = 2000;
const SENTENCE_MS = 5000;
/** Sessizlik: çerçevelerin ortancası bundan yüksekse ortam gürültülü; en yüksek %5'i bundan yüksekse ölçerken bir ses var. */
const QUIET_FLOOR_MAX_DB = -45;
const QUIET_PEAK_MAX_DB = -32;
/** Deneme cümlesi: kırpılan örnek oranı, konuşma düzeyi, konuşma ile arka plan farkı ve konuşma süresi sınırları. */
const MAX_CLIP_RATIO = 0.002;
const MIN_SPEECH_DB = -40;
const MIN_SNR_DB = 18;
const MIN_SENTENCE_SPEECH_MS = 600;
/** Konuşma kaydın son anına kadar sürdüyse cümle yarıda kesilmiş olabilir. */
const END_MARGIN_MS = 120;

type SilenceState = 'todo' | 'rec' | 'ok' | 'noisy' | 'sound' | 'cut';
type SentenceFail = 'interrupted' | 'silent' | 'loud' | 'quiet' | 'noisy' | 'short' | 'cut' | 'unrecognised' | 'asrError';
type SentenceState = 'todo' | 'rec' | 'asr' | 'ok' | SentenceFail;

function percentile(values: Float32Array, p: number): number {
  if (values.length === 0) return -100;
  const s = Array.from(values).sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))))];
}

function judgeSilence(rec: Recording): SilenceState {
  if (rec.interrupted) return 'cut';
  const levels = frameLevels(rec.samples, rec.sampleRate).subarray(Math.round(LEAD_MS / FRAME_MS));
  if (levels.length < 20) return 'cut';
  if (percentile(levels, 50) > QUIET_FLOOR_MAX_DB) return 'noisy';
  if (percentile(levels, 95) > QUIET_PEAK_MAX_DB) return 'sound';
  return 'ok';
}

function judgeSentence(rec: Recording): SentenceFail | null {
  if (rec.interrupted) return 'interrupted';
  const a = analyzeRecording(rec.samples, rec.sampleRate);
  if (a.quality === 'silent' || a.speechStartMs === null || a.speechEndMs === null) return 'silent';
  if (a.clipRatio > MAX_CLIP_RATIO) return 'loud';
  if (a.speechDb < MIN_SPEECH_DB) return 'quiet';
  if (a.snrDb < MIN_SNR_DB) return 'noisy';
  if (a.speechMs < MIN_SENTENCE_SPEECH_MS) return 'short';
  if (a.speechEndMs >= a.durationMs - END_MARGIN_MS) return 'cut';
  return null;
}

const SILENCE_TEXT: Record<'noisy' | 'sound' | 'cut', string> = {
  noisy: 'Ortam biraz gürültülü. Daha sessiz bir yere geç ya da televizyon, müzik gibi sesleri kapattır. Sonra yeniden ölç.',
  sound: 'Sessiz kalırken bir ses duyduk (konuşma, öksürük, kapı sesi gibi). Biraz bekle ve yeniden ölç; ölçerken hiç konuşma.',
  cut: 'Ölçüm kesildi. Ekranı açık tut ve bu sayfada kal; sonra yeniden ölç.',
};

const SENTENCE_TEXT: Record<SentenceFail, string> = {
  interrupted: 'Kayıt kesildi. Ekranı açık tut ve bu sayfada kal; sonra yeniden dene.',
  silent:
    'Sesini duyamadık. Mikrofonun üstünü elinle ya da kılıfla kapatmadığından emin ol. Görüntülü arama gibi mikrofonu kullanan başka bir uygulama açıksa kapat.',
  loud: 'Sesin çok yüksek geliyor, cızırtılı olabilir. Cihazı biraz uzaklaştır ya da biraz daha yumuşak söyle.',
  quiet: 'Sesin kısık geliyor. Cihaza biraz yaklaş (bir karış uzaklık iyidir) ve biraz daha yüksek sesle söyle.',
  noisy: 'Arka planda gürültü var. Daha sessiz bir yere geç; televizyon, müzik ya da konuşma varsa kapatılmasını iste.',
  short: 'Cümlenin tamamını duyamadık. Düğmeye bastıktan sonra cümlenin hepsini söyle.',
  cut: 'Kayıt bitmeden cümleyi bitiremedin gibi görünüyor. Düğmeye basınca hemen söylemeye başla.',
  unrecognised: 'Yapay zekâ cümleni tam anlayamadı. Cümleyi ekrandaki gibi, tane tane ve normal sesinle söyle. Cihaza bir karış kadar yaklaş.',
  asrError: 'Yapay zekâ cümleni dinlerken bir sorun çıktı. Yeniden dene.',
};

/* ---------- Küçük parçalar ---------- */

/** İlerleme çubuğu; `ratio` null ise süre belli değildir (hareketli çubuk). */
export function ProgressBar({ ratio, label }: { ratio: number | null; label: string }) {
  const pct = ratio === null ? null : Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct ?? undefined}
      className="h-3 overflow-hidden rounded-full bg-surface-2"
    >
      <div
        className={`h-full rounded-full bg-ink transition-[width] duration-300 ${pct === null ? 'w-1/3 animate-pulse' : ''}`}
        style={pct === null ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
}

/** Mikrofonun anlık ses düzeyi (öğrenciye "sen" diye seslenir). Düzey yalnızca ekranda gösterilir. */
export function MicLevel({ recorder, compact = false, quietAfterMs = 6000 }: { recorder: MicRecorder; compact?: boolean; quietAfterMs?: number }) {
  const bar = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'ok' | 'quiet' | 'loud'>('ok');

  useEffect(() => {
    let raf = 0;
    let shown = -100;
    let lastVoice = performance.now();
    // Boş başlar: eşik değişince (ör. cümle denemesi geçince) ilk karede durum yeniden yazılır; eski "sesini duyamıyoruz"
    // uyarısı ekranda kalmaz.
    let current: 'ok' | 'quiet' | 'loud' | '' = '';
    const tick = (now: number) => {
      const { db, peak } = recorder.level;
      shown = db > shown ? db : shown - 1.2;
      const pct = Math.max(0, Math.min(100, ((shown + 60) / 60) * 100));
      if (bar.current) bar.current.style.width = `${pct}%`;
      if (db > -45) lastVoice = now;
      const next = peak >= 0.99 ? 'loud' : now - lastVoice > quietAfterMs ? 'quiet' : 'ok';
      if (next !== current) {
        current = next;
        setState(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [recorder, quietAfterMs]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`overflow-hidden rounded-full bg-surface-2 ${compact ? 'h-2' : 'h-3.5'}`} aria-hidden="true">
        <div ref={bar} className="h-full rounded-full bg-[var(--dim-emo)] transition-[width] duration-75" style={{ width: '0%' }} />
      </div>
      {!compact && <p className="t-small text-ink-3">Konuşunca çubuk hareket etmeli.</p>}
      {state === 'quiet' && (
        <p className="t-small font-bold text-warn" role="status">
          Sesini duyamıyoruz: Mikrofonun açık mı? Cihaza biraz yaklaş.
        </p>
      )}
      {state === 'loud' && (
        <p className="t-small font-bold text-warn" role="status">
          Ses çok yüksek geliyor: Cihazı biraz uzaklaştır.
        </p>
      )}
    </div>
  );
}

/** Kayıt sürerken geri sayım: kalan saniye ve çubuk. */
function Countdown({ startedAt, ms, label }: { startedAt: number; ms: number; label: string }) {
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const t = window.setInterval(() => setNow(performance.now()), 100);
    return () => window.clearInterval(t);
  }, []);
  const left = Math.max(0, ms - (now - startedAt));
  return (
    <div className="flex flex-col gap-2" role="status">
      <p className="flex items-center gap-2 font-bold text-danger">
        <span className="size-3 animate-pulse rounded-full bg-danger" aria-hidden="true" />
        {label} <span className="tabular">{Math.ceil(left / 1000)}</span>
      </p>
      <ProgressBar ratio={1 - left / ms} label={label} />
    </div>
  );
}

/** Yapay zekânın durumu: indiriliyor, hazırlanıyor, hazır ya da hata (yeniden deneme düğmesiyle). */
export function ModelStatus({ model, onRetry }: { model: ModelState; onRetry: () => void }) {
  if (model.status === 'idle') return null;
  if (model.status === 'ready') {
    return (
      <p className="notice notice-ok font-bold" role="status">
        Yapay zekâ hazır ✓
      </p>
    );
  }
  if (model.status === 'error') {
    return (
      <div className="notice notice-danger flex flex-col gap-2" role="alert">
        <p className="font-bold">{model.kind === 'unsupported' ? 'Bu cihazda okuma incelemesi yapılamıyor.' : 'Yapay zekâ hazırlanamadı.'}</p>
        <p>{MODEL_HELP[model.kind]}</p>
        {model.kind !== 'unsupported' && (
          <div>
            <button type="button" className="btn btn-secondary" onClick={onRetry}>
              Yeniden dene
            </button>
          </div>
        )}
      </div>
    );
  }
  const download = model.stage === 'download';
  const ratio = download ? 0.9 * model.ratio : 0.9 + 0.1 * model.ratio;
  const mb = (b: number) => Math.round(b / 1_000_000);
  return (
    <div className="panel flex flex-col gap-2 p-4" role="status">
      <p className="flex flex-wrap items-baseline justify-between gap-x-3 font-bold">
        <span>{download ? 'Yapay zekâ indiriliyor' : 'Yapay zekâ hazırlanıyor'}</span>
        <span className="tabular">%{Math.round(ratio * 100)}</span>
      </p>
      <ProgressBar ratio={ratio} label="Yapay zekânın hazırlanması" />
      <p className="t-small text-ink-3">
        {download && model.totalBytes ? `${mb(model.loadedBytes ?? 0)} / ${mb(model.totalBytes)} MB · ` : ''}
        Bu sırada mikrofonu deneyebilirsin.
      </p>
    </div>
  );
}

function StepHead({ id, n, done, children }: { id: string; n: number; done: boolean; children: React.ReactNode }) {
  return (
    <h2 id={id} className="t-h3 flex items-center gap-2.5">
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? 'bg-ok text-paper' : 'border-[1.5px] border-rule-strong text-ink-3'}`}
        aria-hidden="true"
      >
        {done ? '✓' : n}
      </span>
      {children}
      {done && <span className="sr-only">(tamam)</span>}
    </h2>
  );
}

/* ---------- Mikrofon denemesi ---------- */

export function MicCheck(props: {
  grade: number;
  recorder: MicRecorder | null;
  opening: boolean;
  micError: MicErrorKind | null;
  onOpen: () => void;
  /** Mikrofon koptu ya da ses sistemi yeniden başlatılamadı: üst bileşen mikrofonu kapatıp denemeyi baştan açar. */
  onLost: (kind: MicErrorKind) => void;
  client: AsrClient | null;
  modelReady: boolean;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { recorder, client, modelReady } = props;
  const simple = props.grade <= 2;
  const [silence, setSilence] = useState<SilenceState>('todo');
  const [sentence, setSentence] = useState<SentenceState>('todo');
  const [recAt, setRecAt] = useState(0);
  const [heard, setHeard] = useState<string | null>(null);
  const [fails, setFails] = useState(0);
  // Deneme cümlesinin sesi (tanınana kadar) ve süren zamanlayıcı; bileşen kaldırılınca silinir.
  const vault = useRef<{ clip: Float32Array | null; timer: number | null }>({ clip: null, timer: null });
  const busy = useRef(false);
  const attempt = useRef(0);
  const asrFor = useRef(-1);

  useEffect(() => {
    const v = vault.current;
    return () => {
      if (v.timer !== null) window.clearTimeout(v.timer);
      wipeAudio(v.clip);
      v.clip = null;
    };
  }, []);
  // Ölçüm sürerken bileşen kaldırılırsa kayıt durdurulur ve silinir.
  useEffect(
    () => () => {
      if (recorder?.isRecording) wipeAudio(recorder.stop().samples);
    },
    [recorder],
  );

  /** Kısa bir deneme kaydı başlatır; süre dolunca `done` kayıtla çağrılır. Mikrofon koptuysa üst bileşene bildirir. */
  async function record(ms: number, onStart: () => void, done: (rec: Recording) => void) {
    const r = recorder;
    if (!r || busy.current || r.isRecording) return;
    busy.current = true;
    if (r.lost || !(await r.wake())) {
      busy.current = false;
      props.onLost(r.lost ? 'lost' : 'busy');
      return;
    }
    await r.start();
    setRecAt(performance.now());
    onStart();
    vault.current.timer = window.setTimeout(() => {
      vault.current.timer = null;
      const rec = r.stop();
      busy.current = false;
      done(rec);
    }, ms);
  }

  function measureSilence() {
    void record(
      LEAD_MS + SILENCE_MS,
      () => setSilence('rec'),
      (rec) => {
        const verdict = judgeSilence(rec);
        wipeAudio(rec.samples);
        setSilence(verdict);
      },
    );
  }

  function recordSentence() {
    wipeAudio(vault.current.clip);
    vault.current.clip = null;
    void record(
      SENTENCE_MS,
      () => {
        setHeard(null);
        setSentence('rec');
      },
      (rec) => {
        const fail = judgeSentence(rec);
        if (fail) {
          wipeAudio(rec.samples);
          setSentence(fail);
          setFails((n) => n + 1);
          return;
        }
        attempt.current += 1;
        vault.current.clip = rec.samples;
        setSentence('asr');
      },
    );
  }

  // Ses ölçümlerinden geçen cümle, yapay zekâ hazır olunca tanınır; sonra ses silinir.
  useEffect(() => {
    if (sentence !== 'asr' || !modelReady || !client) return;
    const mine = attempt.current;
    if (asrFor.current === mine) return;
    asrFor.current = mine;
    const clip = vault.current.clip;
    if (!clip) return;
    client
      .transcribeClips([clip])
      .then((res) => {
        if (attempt.current !== mine) return;
        const m = sentenceMatch(res[0] ?? []);
        if (m.ratio >= MIC_PASS_RATIO) {
          setSentence('ok');
        } else {
          setHeard(m.heard);
          setSentence('unrecognised');
          setFails((n) => n + 1);
        }
      })
      .catch(() => {
        if (attempt.current !== mine) return;
        setSentence('asrError');
        setFails((n) => n + 1);
      })
      .finally(() => {
        wipeAudio(clip);
        if (vault.current.clip === clip) vault.current.clip = null;
      });
  }, [sentence, modelReady, client]);

  const recording = silence === 'rec' || sentence === 'rec';
  const silenceOk = silence === 'ok';
  const sentenceFail = sentence !== 'todo' && sentence !== 'rec' && sentence !== 'asr' && sentence !== 'ok' ? sentence : null;

  return (
    <div className="flex flex-col gap-5">
      <section className="panel flex flex-col gap-3 p-5" aria-labelledby="mik-1">
        <StepHead id="mik-1" n={1} done={!!recorder}>
          Mikrofonu aç
        </StepHead>
        {!recorder ? (
          <>
            <p>
              “Mikrofonu aç” düğmesine bas. Tarayıcı izin isteyince <strong>İzin ver</strong>’e bas.
            </p>
            {!micSupported() && <p className="notice notice-danger">{MIC_HELP.unsupported}</p>}
            {props.micError && (
              <p className="notice notice-danger" role="alert">
                {MIC_HELP[props.micError]}
              </p>
            )}
            <div>
              <button type="button" className="btn btn-primary btn-lg" onClick={props.onOpen} disabled={props.opening}>
                {props.opening ? 'Mikrofon açılıyor…' : 'Mikrofonu aç'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Mikrofon açık. Cihazı önüne, ağzına bir karış uzaklıkta koy.</p>
            {/* Deneme geçince "sesini duyamıyoruz" uyarısı çıkmaz: öğrenci sessizce beklerken başarı mesajıyla çelişmesin. */}
            <MicLevel recorder={recorder} quietAfterMs={sentence === 'ok' ? Infinity : 6000} />
          </>
        )}
      </section>

      <section className={`panel flex flex-col gap-3 p-5 ${recorder ? '' : 'opacity-60'}`} aria-labelledby="mik-2">
        <StepHead id="mik-2" n={2} done={silenceOk}>
          Sessizliği ölç
        </StepHead>
        {silenceOk ? (
          <p className="font-bold text-ok">Ortam sessiz ✓</p>
        ) : (
          <>
            <p>{simple ? 'Düğmeye bas. 2 saniye hiç konuşma.' : 'Düğmeye bas ve 2 saniye hiç konuşmadan bekle. Ortamın ne kadar sessiz olduğunu ölçeceğiz.'}</p>
            {silence === 'rec' ? (
              <Countdown startedAt={recAt} ms={LEAD_MS + SILENCE_MS} label="Sessiz kal…" />
            ) : (
              <>
                {(silence === 'noisy' || silence === 'sound' || silence === 'cut') && (
                  <p className="notice notice-warn" role="alert">
                    {SILENCE_TEXT[silence]}
                  </p>
                )}
                <div>
                  <button type="button" className="btn btn-secondary" onClick={measureSilence} disabled={!recorder || recording}>
                    {silence === 'todo' ? 'Ölçmeyi başlat' : 'Yeniden ölç'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </section>

      <section className={`panel flex flex-col gap-3 p-5 ${silenceOk ? '' : 'opacity-60'}`} aria-labelledby="mik-3">
        <StepHead id="mik-3" n={3} done={sentence === 'ok'}>
          Cümleyi söyle
        </StepHead>
        <p>{simple ? 'Düğmeye bas. Bu cümleyi söyle:' : 'Düğmeye bas ve bu cümleyi normal sesinle söyle:'}</p>
        <p className="rounded-xl bg-surface-2 px-4 py-3 font-display text-[1.5rem] font-bold leading-snug sm:text-[1.75rem]">{MIC_CHECK_SENTENCE}</p>
        {sentence === 'rec' && <Countdown startedAt={recAt} ms={SENTENCE_MS} label="Şimdi söyle…" />}
        {sentence === 'asr' && (
          <div className="flex flex-col gap-2" role="status">
            <p className="font-bold">
              {modelReady ? 'Sesin iyi geliyor. Yapay zekâ cümleni tanımaya çalışıyor…' : 'Sesin iyi geliyor. Yapay zekâ hazır olunca cümleni tanıyacak…'}
            </p>
            <ProgressBar ratio={null} label="Cümlenin tanınması" />
          </div>
        )}
        {sentence === 'ok' && (
          <div className="notice notice-ok flex flex-col gap-1" role="status">
            <p className="text-lg font-bold">Sesin çok net geliyor ✓</p>
            <p>Yapay zekâ cümleni doğru anladı. Okumaya hazırsın.</p>
          </div>
        )}
        {sentenceFail && (
          <div className="notice notice-warn flex flex-col gap-2" role="alert">
            <p>{SENTENCE_TEXT[sentenceFail]}</p>
            {sentenceFail === 'unrecognised' && (
              <p className="t-small">{heard ? `Yapay zekânın anladığı: “${heard}”` : 'Yapay zekâ hiçbir kelime anlayamadı.'}</p>
            )}
            {fails >= 2 && (
              <>
                <p className="font-bold">Hâlâ olmuyorsa:</p>
                <ul className="flex list-disc flex-col gap-1 pl-5">
                  <li>Mikrofonlu bir kulaklık takmayı dene.</li>
                  <li>Görüntülü arama gibi mikrofonu kullanan uygulamaları kapat.</li>
                  <li>Daha sessiz bir odaya geç.</li>
                  <li>Olmazsa başka bir cihaz (ör. bir bilgisayar) kullan.</li>
                </ul>
              </>
            )}
          </div>
        )}
        {sentence !== 'rec' && sentence !== 'asr' && sentence !== 'ok' && (
          <div>
            <button type="button" className="btn btn-secondary" onClick={recordSentence} disabled={!recorder || !silenceOk || recording}>
              {sentence === 'todo' ? 'Kaydı başlat' : 'Yeniden dene'}
            </button>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-quiet" onClick={props.onBack} disabled={recording}>
          Geri
        </button>
        <button type="button" className="btn btn-primary btn-lg" disabled={sentence !== 'ok' || !recorder} onClick={props.onContinue}>
          Okumaya geç
        </button>
      </div>
    </div>
  );
}
