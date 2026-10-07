'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeRecording, encodeWav, overviewContour, type AudioAnalysis } from '@/lib/oral/audio';
import type { OralMark, OralProsody } from '@/lib/scoring/oral';
import { ProgressRuler } from '../likert-runner';
import { useLeaveWarning } from '../tasks/common';
import { LevelMeter } from './level-meter';
import { MarkStep } from './mark-step';
import { RecordingPlayer, clock } from './player';
import { MicError, MicRecorder, micSupported, type MicErrorKind, type Recording } from './recorder';
import type { OralClientPassage, OralFinish, OralProsodyDimension } from './types';

/**
 * Sesli okuma değerlendirmesi, adım adım: hazırlık (metin seçimi, mikrofon denemesi), öğrencinin bölümü (sesli okuma,
 * kayıt denetimi, yeniden anlatma, sorular) ve yetişkinin bölümü (kaydı dinleyerek hataları işaretleme, anlatmayı ve
 * akıcılığı değerlendirme). Ses kaydı yalnızca bu sayfanın belleğinde durur: sunucuya gönderilmez ve sayfa kapanınca
 * silinir. Rapor için yalnızca işaretler, süreler, cevaplar ve kayıttan cihazda hesaplanan özet sayılar gönderilir.
 */

type Step = 'intro' | 'passage' | 'mic' | 'ready' | 'reading' | 'check' | 'retell' | 'questions' | 'handoff' | 'mark' | 'retellScore' | 'prosody';

const PARTS: { name: string; steps: Step[] }[] = [
  { name: 'Hazırlık', steps: ['intro', 'passage', 'mic'] },
  { name: 'Öğrenci', steps: ['ready', 'reading', 'check', 'retell', 'questions'] },
  { name: 'Değerlendirme', steps: ['handoff', 'mark', 'retellScore', 'prosody'] },
];

const STEP_TITLES: Record<Step, string> = {
  intro: 'Başlarken',
  passage: 'Metin seçimi',
  mic: 'Mikrofon denemesi',
  ready: 'Sesli okuma',
  reading: 'Sesli okuma',
  check: 'Kayıt denetimi',
  retell: 'Yeniden anlatma',
  questions: 'Sorular',
  handoff: 'Değerlendirme',
  mark: 'Hataları işaretleme',
  retellScore: 'Anlatmayı değerlendirme',
  prosody: 'Akıcılık',
};

/** Ekrandaki adım sırası (okuma ve hazır ekranı tek adım sayılır). */
const ORDER: Step[] = ['intro', 'passage', 'mic', 'reading', 'check', 'retell', 'questions', 'mark', 'retellScore', 'prosody'];

const MAX_READING_MS = 10 * 60_000;
const MAX_RETELL_MS = 5 * 60_000;
const MIC_TEST_MS = 4000;

const MIC_HELP: Record<MicErrorKind, string> = {
  unsupported:
    'Bu tarayıcı ses kaydını desteklemiyor. Chrome, Safari, Edge ya da Firefox’un güncel bir sürümüyle açın. Uygulama içindeki tarayıcılar (ör. bir mesajlaşma uygulamasının içinden açılan sayfa) mikrofonu açamayabilir.',
  denied:
    'Mikrofon izni verilmedi. Adres çubuğundaki kilit ya da ayar simgesine dokunup bu site için mikrofona izin verin ve sayfayı yenileyin. iPhone ve iPad’de: Ayarlar › Safari › Mikrofon; Android’de: tarayıcının site ayarları › Mikrofon.',
  notfound: 'Bu cihazda mikrofon bulunamadı. Mikrofonlu bir kulaklık takın ya da mikrofonu olan bir telefon, tablet veya bilgisayar kullanın.',
  busy: 'Mikrofon şu an kullanılamıyor: Başka bir uygulama (ör. görüntülü arama) kullanıyor olabilir. O uygulamayı kapatıp yeniden deneyin.',
  lost: 'Mikrofonla bağlantı kesildi (ör. kulaklık çıkarıldı ya da başka bir uygulama mikrofonu aldı). Mikrofonu yeniden açıp devam edin.',
  unknown: 'Mikrofon açılamadı. Sayfayı yenileyip yeniden deneyin; olmazsa başka bir tarayıcı ya da cihaz kullanın.',
};

/** Sınıfa göre okuma metninin yazı boyutu: küçük sınıflarda daha iri ve seyrek. */
function fontFor(grade: number): string {
  if (grade <= 2) return 'text-[1.6rem] sm:text-[1.85rem]';
  if (grade <= 4) return 'text-[1.4rem] sm:text-[1.55rem]';
  return 'text-[1.25rem] sm:text-[1.375rem]';
}

interface Take {
  rec: Recording;
  analysis: AudioAnalysis;
  url: string;
  overview: number[];
}

function makeTake(rec: Recording): Take {
  const analysis = analyzeRecording(rec.samples, rec.sampleRate);
  const url = URL.createObjectURL(new Blob([encodeWav(rec.samples, rec.sampleRate)], { type: 'audio/wav' }));
  return { rec, analysis, url, overview: overviewContour(rec.samples, rec.sampleRate) };
}

const QUALITY_TEXT: Record<AudioAnalysis['quality'], { ok: boolean; text: string }> = {
  good: { ok: true, text: 'Ses düzeyi iyi.' },
  quiet: { ok: false, text: 'Ses kısık: Cihazı öğrenciye biraz yaklaştırın ve biraz daha yüksek sesle okumasını isteyin.' },
  noisy: { ok: false, text: 'Arka planda gürültü var: Daha sessiz bir yerde kaydetmek dinlemeyi kolaylaştırır.' },
  clipped: { ok: false, text: 'Ses çok yüksek, cızırtılı olabilir: Cihazı biraz uzaklaştırın.' },
  silent: { ok: false, text: 'Kayıtta ses bulunamadı.' },
};

function Stepper({ step }: { step: Step }) {
  const shown = step === 'ready' ? 'reading' : step === 'handoff' ? 'mark' : step;
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
      <LevelMeter recorder={recorder} compact />
    </div>
  );
}

export function OralRunner(props: {
  intro: { title: string; paragraphs: string[] };
  grade: number;
  passages: OralClientPassage[];
  prosody: OralProsodyDimension[];
  onFinish: (data: OralFinish) => Promise<void>;
}) {
  const { grade } = props;
  const [step, setStep] = useState<Step>('intro');
  const [passageKey, setPassageKey] = useState<string | null>(null);
  const passage = props.passages.find((p) => p.key === passageKey) ?? null;

  const [recorder, setRecorder] = useState<MicRecorder | null>(null);
  const [micError, setMicError] = useState<MicErrorKind | null>(null);
  const [opening, setOpening] = useState(false);
  const [testTake, setTestTake] = useState<Take | null>(null);
  const [testing, setTesting] = useState(false);
  const [testHeard, setTestHeard] = useState<boolean | null>(null);
  // Deneme kaydı gerçekten dinlenmeden "duydum" denemez: ses sorunu okumadan önce yakalansın.
  const [testListened, setTestListened] = useState(false);

  const [recStart, setRecStart] = useState(0);
  const [reading, setReading] = useState<Take | null>(null);
  const [retell, setRetell] = useState<Take | null>(null);
  const [retellSkipped, setRetellSkipped] = useState(false);
  const [recordingRetell, setRecordingRetell] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);
  const [marks, setMarks] = useState<Record<number, OralMark>>({});
  const [listened, setListened] = useState(0);
  const [ideas, setIdeas] = useState<Set<string>>(() => new Set());
  const [prosody, setProsody] = useState<Partial<OralProsody>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const urls = useRef<string[]>([]);
  const autoStop = useRef<number | null>(null);
  const testTimer = useRef<number | null>(null);
  // Düğmeye iki kez basılınca iki kayıt başlamasın.
  const starting = useRef(false);

  useLeaveWarning(
    step !== 'intro' && step !== 'passage',
    'Sayfadan ayrılırsanız kayıtlar ve işaretler silinir; hiçbir yere kaydedilmez. Yine de ayrılmak istiyor musunuz?',
  );

  // Her adımda sayfanın başına dön ve başlığa odaklan (ekran okuyucular yeni adımı duyurur).
  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [step, qIndex]);

  // Sayfadan çıkınca mikrofonu kapat ve bellekteki ses dosyalarını bırak.
  useEffect(() => {
    const list = urls.current;
    return () => {
      for (const u of list) URL.revokeObjectURL(u);
    };
  }, []);
  useEffect(() => () => recorder?.close(), [recorder]);
  useEffect(
    () => () => {
      if (autoStop.current) window.clearTimeout(autoStop.current);
      if (testTimer.current) window.clearTimeout(testTimer.current);
    },
    [],
  );

  const keep = (t: Take) => {
    urls.current.push(t.url);
    return t;
  };
  // Yerine yenisi alınan kaydı bellekten hemen bırak (uzun kayıtlar sayfa kapanana kadar bellekte kalmasın).
  const drop = (t: Take | null) => {
    if (!t) return;
    URL.revokeObjectURL(t.url);
    const i = urls.current.indexOf(t.url);
    if (i >= 0) urls.current.splice(i, 1);
  };

  /** Mikrofonu kapatıp mikrofon adımını baştan açar: bağlantı koparsa kullanıcı sayfayı yenilemeden devam edebilir. */
  function resetMic(kind: MicErrorKind | null) {
    if (testTimer.current) window.clearTimeout(testTimer.current);
    recorder?.close();
    setRecorder(null);
    drop(testTake);
    setTestTake(null);
    setTestHeard(null);
    setTestListened(false);
    setTesting(false);
    setMicError(kind);
  }

  async function openMic() {
    setOpening(true);
    setMicError(null);
    try {
      const r = await MicRecorder.open();
      setRecorder(r);
    } catch (err) {
      setMicError(err instanceof MicError ? err.kind : 'unknown');
    } finally {
      setOpening(false);
    }
  }

  async function micTest() {
    if (!recorder || testing || recorder.isRecording) return;
    if (recorder.lost) {
      resetMic('lost');
      return;
    }
    setTesting(true);
    setTestHeard(null);
    drop(testTake);
    setTestTake(null);
    setTestListened(false);
    await recorder.start();
    testTimer.current = window.setTimeout(() => {
      testTimer.current = null;
      const rec = recorder.stop();
      setTestTake(keep(makeTake(rec)));
      setTesting(false);
    }, MIC_TEST_MS);
  }

  async function startReading() {
    if (!recorder || starting.current || recorder.isRecording) return;
    starting.current = true;
    try {
      if (!(await recorder.wake())) {
        // Mikrofon koptuysa ya da ses sistemi yeniden başlatılamıyorsa mikrofon adımı baştan açılır.
        resetMic(recorder.lost ? 'lost' : 'busy');
        setStep('mic');
        return;
      }
      await recorder.start();
      setRecStart(performance.now());
      setStep('reading');
      if (autoStop.current) window.clearTimeout(autoStop.current);
      autoStop.current = window.setTimeout(() => stopReading(), MAX_READING_MS);
    } finally {
      starting.current = false;
    }
  }

  function stopReading() {
    if (!recorder?.isRecording) return;
    if (autoStop.current) window.clearTimeout(autoStop.current);
    setReading(keep(makeTake(recorder.stop())));
    setStep('check');
  }

  async function startRetell() {
    if (!recorder || starting.current || recorder.isRecording) return;
    starting.current = true;
    try {
      // Okumadan sonra mikrofon koptuysa (ör. kulaklık çıkarıldı) anlatma sessiz kaydedilmesin: yeniden açılması istenir.
      if (!(await recorder.wake())) {
        setMicError(recorder.lost ? 'lost' : 'busy');
        return;
      }
      setMicError(null);
      await recorder.start();
      setRecStart(performance.now());
      setRecordingRetell(true);
      if (autoStop.current) window.clearTimeout(autoStop.current);
      autoStop.current = window.setTimeout(() => stopRetell(), MAX_RETELL_MS);
    } finally {
      starting.current = false;
    }
  }

  function stopRetell() {
    if (!recorder?.isRecording) return;
    if (autoStop.current) window.clearTimeout(autoStop.current);
    setRetell(keep(makeTake(recorder.stop())));
    setRecordingRetell(false);
  }

  /** Anlatma adımında mikrofonu yeniden açar: eski kayıtlar korunur, yalnızca mikrofon yenilenir. */
  async function reopenMic() {
    setOpening(true);
    try {
      const r = await MicRecorder.open();
      setRecorder(r);
      setMicError(null);
    } catch (err) {
      setMicError(err instanceof MicError ? err.kind : 'unknown');
    } finally {
      setOpening(false);
    }
  }

  function toHandoff() {
    // Öğrencinin bölümü bitti: mikrofon kapatılır (tarayıcıdaki kayıt simgesi söner).
    recorder?.close();
    setRecorder(null);
    setStep('handoff');
  }

  const readingSummary = useMemo(() => {
    if (!reading) return null;
    const a = reading.analysis;
    const auto = a.speechStartMs !== null && a.speechEndMs !== null && a.speechEndMs - a.speechStartMs >= 1000;
    const readingMs = auto ? a.speechEndMs! - a.speechStartMs! : reading.rec.durationMs;
    const absPauses = auto ? a.pauses.map(([s, e]) => [s + a.speechStartMs!, e + a.speechStartMs!] as [number, number]) : [];
    return { auto, readingMs, absPauses };
  }, [reading]);

  async function submit() {
    if (!passage || !reading || !readingSummary) return;
    const p = prosody as OralProsody;
    setSubmitting(true);
    setError(null);
    const a = reading.analysis;
    const data: OralFinish = {
      passageKey: passage.key,
      recordMs: Math.round(reading.rec.durationMs),
      readingMs: Math.max(1000, Math.round(readingSummary.readingMs)),
      timingAuto: readingSummary.auto,
      audio:
        a.quality === 'silent'
          ? null
          : {
              quality: a.quality,
              pauses: a.pauses.slice(0, 1000).map(([s, e]) => [Math.round(s), Math.round(e)] as [number, number]),
              speechMs: Math.round(a.speechMs),
              contour: a.contour,
              interrupted: reading.rec.interrupted,
            },
      marks: Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, v.said === undefined ? v : { ...v, said: v.said.trim() }])),
      listened,
      retell: retellSkipped ? null : { recorded: !!retell, ideas: [...ideas] },
      answers,
      prosody: { expression: p.expression, phrasing: p.phrasing, smoothness: p.smoothness, pace: p.pace },
    };
    try {
      await props.onFinish(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rapor hazırlanamadı.');
      setSubmitting(false);
    }
  }

  const title = (text: string) => (
    <h1 ref={heading} tabIndex={-1} className="t-h1 outline-none">
      {text}
    </h1>
  );

  const shell = (children: React.ReactNode, wide = false) => (
    <div className={`mx-auto flex w-full flex-col gap-7 ${wide ? 'max-w-3xl' : 'max-w-2xl'}`}>
      <Stepper step={step} />
      {children}
    </div>
  );

  /* ---------- Hazırlık ---------- */

  if (step === 'intro') {
    return shell(
      <>
        {title(props.intro.title)}
        <div className="flex flex-col gap-3 text-lg">
          {props.intro.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <section className="panel flex flex-col gap-3 p-6" aria-labelledby="gerekenler">
          <h2 id="gerekenler" className="t-h3">
            Neler gerekiyor?
          </h2>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>Sessiz bir oda ve yaklaşık 20 dakika.</li>
            <li>Mikrofonu olan bir telefon, tablet ya da bilgisayar. Cihazı öğrencinin önüne, ağzına bir karış uzaklıkta koyun.</li>
            <li>Değerlendirmeyi yapacak bir yetişkin (öğretmen ya da veli). Okuma sırasında öğrencinin yanında oturun ama yardım etmeyin.</li>
            <li>Öğrencinin seçeceğiniz metni daha önce okumamış olması.</li>
          </ul>
        </section>
        <section className="flex flex-col gap-3" aria-labelledby="nasil">
          <h2 id="nasil" className="t-h3">
            Nasıl ilerler?
          </h2>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5">
            <li>
              <strong>Hazırlık:</strong> Metni seçersiniz ve mikrofonu denersiniz.
            </li>
            <li>
              <strong>Öğrenci:</strong> Metni sesli okur (kayda alınır), sonra metni kendi cümleleriyle anlatır ve metne bakmadan soruları cevaplar.
            </li>
            <li>
              <strong>Değerlendirme:</strong> Siz kaydı dinleyerek okuma hatalarını işaretlersiniz, anlatmada söylenen fikirleri ve okumanın akıcılığını
              değerlendirirsiniz.
            </li>
            <li>
              <strong>Rapor:</strong> Öğrenciye ve size ayrı ayrı yazılmış rapor ekranda açılır; PDF olarak indirebilirsiniz.
            </li>
          </ol>
        </section>
        <div className="notice notice-ok flex flex-col gap-1.5">
          <p className="font-bold">Ses kaydı bu cihazdan çıkmaz.</p>
          <p>
            Kayıt yalnızca bu sayfada, cihazın belleğinde durur: Sunucumuza ya da başka bir yere gönderilmez ve sayfayı kapatınca silinir. Uygulama
            konuşmayı yapay zekâyla tanımaya çalışmaz; kaydı siz dinlersiniz, uygulama yalnızca süreyi ve duraklamaları ölçer.
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep('passage')}>
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
              {p.grade}. sınıf · {p.genre === 'narrative' ? 'Öykü' : 'Bilgilendirici metin'} · {p.words} kelime
            </span>
          </button>
        </li>
      );
    };
    return shell(
      <>
        {title('Metni seçin')}
        <p className="text-lg">
          Önce öğrencinin kendi sınıfının ({grade}. sınıf) metinlerinden birini seçin. Öğrencinin daha önce okumadığı bir metin olmalı. Öteki metinleri,
          aynı öğrenciyi birkaç hafta sonra yeniden değerlendirmek için kullanabilirsiniz.
        </p>
        {grade === 1 && (
          <p className="notice notice-info">1. sınıf metinleri, okumayı söken öğrenciler için, ikinci dönem düşünülerek yazıldı.</p>
        )}
        <ul className="flex flex-col gap-2.5">{own.map(card)}</ul>
        {other.length > 0 && (
          <details className="flex flex-col gap-3" open={!!passageKey && !own.some((p) => p.key === passageKey)}>
            <summary className="cursor-pointer font-bold">Bir alt ya da bir üst sınıfın metinleri</summary>
            <p className="t-small mt-2 mb-3 text-ink-2">
              Öğrenci kendi sınıfının metninde çok zorlandıysa bir alt sınıfın, çok rahat okuduysa bir üst sınıfın metniyle değerlendirme yaparak rahat
              okuduğu düzeyi bulabilirsiniz.
            </p>
            <ul className="flex flex-col gap-2.5">{other.map(card)}</ul>
          </details>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-lg" disabled={!passage} onClick={() => setStep('mic')}>
            Bu metinle devam et
          </button>
        </div>
      </>,
    );
  }

  if (step === 'mic') {
    const t = testTake?.analysis;
    return shell(
      <>
        {title('Mikrofonu deneyelim')}
        <p className="text-lg">Kayda geçmeden önce mikrofonun öğrencinin sesini iyi aldığından emin olalım.</p>
        {!recorder ? (
          <div className="flex flex-col gap-4">
            <p>
              “Mikrofonu aç” düğmesine basınca tarayıcı mikrofon izni isteyecek; <strong>İzin ver</strong>’e basın.
            </p>
            {!micSupported() && <p className="notice notice-danger">{MIC_HELP.unsupported}</p>}
            {micError && (
              <p className="notice notice-danger" role="alert">
                {MIC_HELP[micError]}
              </p>
            )}
            <div>
              <button type="button" className="btn btn-primary btn-lg" onClick={openMic} disabled={opening}>
                {opening ? 'Mikrofon açılıyor…' : 'Mikrofonu aç'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="panel flex flex-col gap-3 p-5">
              <p className="font-bold">1. Ses düzeyi</p>
              <LevelMeter recorder={recorder} />
            </div>
            <div className="panel flex flex-col gap-4 p-5">
              <p className="font-bold">2. Deneme kaydı</p>
              <p>Düğmeye basın; öğrenci 4 saniye boyunca normal sesiyle “Merhaba, ben okumaya hazırım.” desin. Sonra kaydı birlikte dinleyin.</p>
              <div>
                <button type="button" className="btn btn-secondary" onClick={micTest} disabled={testing}>
                  {testing ? 'Kaydediliyor… konuşun' : testTake ? 'Deneme kaydını yinele' : 'Deneme kaydını başlat'}
                </button>
              </div>
              {testTake && t && (
                <div className="flex flex-col gap-3">
                  <RecordingPlayer
                    url={testTake.url}
                    durationMs={testTake.rec.durationMs}
                    contour={testTake.overview}
                    label="Deneme kaydı"
                    compact
                    onListened={(r) => r >= 0.6 && setTestListened(true)}
                  />
                  <p className={`notice ${QUALITY_TEXT[t.quality].ok ? 'notice-ok' : t.quality === 'silent' ? 'notice-danger' : 'notice-warn'}`}>
                    {t.quality === 'silent'
                      ? 'Kayıtta ses bulunamadı. Mikrofonun kapalı olmadığından ve cihazın öğrenciye yakın olduğundan emin olup yeniden deneyin.'
                      : QUALITY_TEXT[t.quality].text}
                  </p>
                  <p className="font-bold">Kayıtta öğrencinin sesini açıkça duyabildiniz mi?</p>
                  {!testListened && t.quality !== 'silent' && <p className="t-small text-ink-2">Önce “Dinle” düğmesine basıp deneme kaydını dinleyin.</p>}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn btn-primary" disabled={t.quality === 'silent' || !testListened} onClick={() => setTestHeard(true)}>
                      Evet, açıkça duydum
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setTestHeard(false)}>
                      Hayır
                    </button>
                  </div>
                  {testHeard === false && (
                    <div className="notice notice-warn flex flex-col gap-1.5">
                      <p className="font-bold">Şunları deneyin:</p>
                      <ul className="flex list-disc flex-col gap-1 pl-5">
                        <li>Cihazın sesini açın: Kayıt hoparlörden çalınır.</li>
                        <li>Cihazı öğrenciye yaklaştırın; mikrofonun üstünü elle ya da kılıfla kapatmayın.</li>
                        <li>Kulaklık takılıysa çıkarın ya da kulaklığın mikrofonunu kullanın.</li>
                        <li>iPhone ve iPad’de mikrofon açıkken kayıt kısık sesle çalınabilir: Cihazı kulağınıza yaklaştırarak dinleyin.</li>
                        <li>Görüntülü arama gibi mikrofonu kullanan başka bir uygulama açıksa kapatın.</li>
                      </ul>
                      <p>Sonra deneme kaydını yineleyin.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-quiet" onClick={() => setStep('passage')}>
            Geri
          </button>
          <button type="button" className="btn btn-primary btn-lg" disabled={!recorder || testHeard !== true} onClick={() => setStep('ready')}>
            Ses iyi, okumaya geç
          </button>
        </div>
      </>,
    );
  }

  /* ---------- Öğrencinin bölümü ---------- */

  if (step === 'ready' && passage) {
    return shell(
      <>
        <p className="t-meta">Öğrenciye</p>
        {title(passage.title)}
        <div className="flex flex-col gap-3 text-xl leading-relaxed">
          <p>Birazdan bu metni sesli okuyacaksın.</p>
          <ul className="flex list-disc flex-col gap-2 pl-6">
            <li>Her zamanki gibi, ne çok hızlı ne çok yavaş oku.</li>
            <li>Bilmediğin bir kelimede elinden geleni yap ve devam et.</li>
            <li>Okurken metni iyi anlamaya çalış: Sonra sana anlatmanı ve birkaç soru cevaplamanı isteyeceğiz.</li>
          </ul>
        </div>
        <div className="notice notice-info flex flex-col gap-1.5">
          <p className="font-bold">Yetişkin için</p>
          <p>
            Okuma sırasında yardım etmeyin, düzeltmeyin. Öğrenci bir kelimede yaklaşık 3 saniye takılırsa kelimeyi siz söyleyin; işaretlerken o kelimeyi
            “Yardımla okudu” olarak işaretleyeceksiniz. Öğrenci son kelimeyi okuyunca “Okumayı bitirdim” düğmesine basın.
          </p>
        </div>
        {micError && <p className="notice notice-danger">{MIC_HELP[micError]}</p>}
        <div>
          <button type="button" className="btn btn-primary btn-lg" onClick={startReading} autoFocus>
            Kaydı başlat ve metni aç
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
          <button type="button" className="btn btn-primary btn-lg w-full shadow-[var(--shadow)]" onClick={stopReading}>
            Okumayı bitirdim
          </button>
        </div>
      </article>
    );
  }

  if (step === 'check' && reading && readingSummary && passage) {
    const a = reading.analysis;
    const silent = a.quality === 'silent';
    const problems = [
      ...(!silent && !QUALITY_TEXT[a.quality].ok ? [QUALITY_TEXT[a.quality].text] : []),
      ...(reading.rec.interrupted
        ? ['Kayıt sırasında kesinti oldu (ekran kapandı, sekme değişti ya da başka bir uygulama mikrofonu kullandı). Süre doğru ölçülmemiş olabilir.']
        : []),
      ...(!silent && !readingSummary.auto ? ['Okumanın başı ve sonu kayıtta ayırt edilemedi; süre düğmelere göre ölçülecek.'] : []),
    ];
    return shell(
      <>
        {title('Kayıt denetimi')}
        {silent ? (
          <div className="notice notice-danger flex flex-col gap-2" role="alert">
            <p className="font-bold">Kayıtta ses bulunamadı.</p>
            <p>Mikrofon sesi almamış görünüyor. Mikrofonu yeniden deneyip okumayı yeniden kaydedin.</p>
          </div>
        ) : (
          <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
            <div className="bg-surface p-4">
              <dt className="t-meta">Kayıt süresi</dt>
              <dd className="font-display text-2xl font-bold tabular">{clock(reading.rec.durationMs)}</dd>
            </div>
            <div className="bg-surface p-4">
              <dt className="t-meta">Okuma süresi</dt>
              <dd className="font-display text-2xl font-bold tabular">{clock(readingSummary.readingMs)}</dd>
              <dd className="t-small text-ink-3">{readingSummary.auto ? 'ilk sesten son sese' : 'düğmelere göre'}</dd>
            </div>
            <div className="bg-surface p-4">
              <dt className="t-meta">Ses</dt>
              <dd className="font-display text-2xl font-bold">{QUALITY_TEXT[a.quality].ok && !reading.rec.interrupted ? 'İyi' : 'Dikkat'}</dd>
            </div>
          </dl>
        )}
        {problems.length > 0 && (
          <ul className="notice notice-warn flex list-disc flex-col gap-1 pl-8">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        {!silent && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">İsterseniz kaydın bir kısmını dinleyip sesin anlaşıldığından emin olun:</p>
            <RecordingPlayer url={reading.url} durationMs={reading.rec.durationMs} contour={reading.overview} pauses={readingSummary.absPauses} label="Okuma kaydı" />
          </div>
        )}
        <div className="flex flex-col gap-3">
          {!silent && (
            <div>
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep('retell')}>
                Kayıt iyi, devam et
              </button>
            </div>
          )}
          <details open={silent}>
            <summary className="cursor-pointer font-bold">Yeniden kaydetmek istiyorum</summary>
            <div className="mt-3 flex flex-col gap-3">
              {!silent && (
                <p className="t-small text-ink-2">
                  Öğrenci metni ikinci kez okursa daha hızlı ve rahat okuyabilir; bu sonucu olduğundan iyi gösterir. Mümkünse başka bir metin seçin.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    drop(reading);
                    setReading(null);
                    if (silent) {
                      // Ses alınamadıysa deneme kaydı da yinelenir; mikrofon koptuysa yeniden açılır.
                      if (recorder?.lost) {
                        resetMic('lost');
                      } else {
                        drop(testTake);
                        setTestTake(null);
                        setTestHeard(null);
                        setTestListened(false);
                      }
                    }
                    setStep(silent ? 'mic' : 'ready');
                  }}
                >
                  {silent ? 'Mikrofonu yeniden dene' : 'Aynı metni yeniden kaydet'}
                </button>
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => {
                    drop(reading);
                    setReading(null);
                    setPassageKey(null);
                    setStep('passage');
                  }}
                >
                  Başka metin seç
                </button>
              </div>
            </div>
          </details>
        </div>
      </>,
    );
  }

  if (step === 'retell' && passage && recorder) {
    return shell(
      <>
        <p className="t-meta">Öğrenciye</p>
        {title('Şimdi metni kendi cümlelerinle anlat')}
        {micError && !recordingRetell && (
          <div className="notice notice-danger flex flex-col gap-2" role="alert">
            <p>{MIC_HELP[micError]}</p>
            <div>
              <button type="button" className="btn btn-secondary" onClick={reopenMic} disabled={opening}>
                {opening ? 'Mikrofon açılıyor…' : 'Mikrofonu yeniden aç'}
              </button>
            </div>
          </div>
        )}
        {!retell && !recordingRetell && (
          <>
            <p className="text-xl leading-relaxed">
              “{passage.title}” metninde neler anlatılıyordu? Aklında kalan her şeyi, kendi cümlelerinle anlat. Bitirince “Anlatmayı bitirdim” düğmesine
              basılacak.
            </p>
            <div className="notice notice-info flex flex-col gap-1.5">
              <p className="font-bold">Yetişkin için</p>
              <p>
                Metin artık görünmez. İpucu vermeyin; öğrenci durursa yalnızca bir kez “Başka neler hatırlıyorsun?” diye sorabilirsiniz. Anlatma da kayda
                alınır; söylenen fikirleri sonra dinleyerek işaretleyeceksiniz.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary btn-lg" onClick={startRetell} autoFocus>
                Anlatmayı kaydet
              </button>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  setRetellSkipped(true);
                  setStep('questions');
                }}
              >
                Bu adımı atla
              </button>
            </div>
          </>
        )}
        {recordingRetell && (
          <>
            <RecordingBadge recorder={recorder} startedAt={recStart} />
            <button type="button" className="btn btn-primary btn-lg" onClick={stopRetell}>
              Anlatmayı bitirdim
            </button>
          </>
        )}
        {retell && (
          <>
            {retell.analysis.quality === 'silent' ? (
              <p className="notice notice-warn">
                Anlatma kaydında ses bulunamadı. Yeniden kaydedebilir ya da devam edip söylenen fikirleri hatırladığınız kadarıyla işaretleyebilirsiniz.
              </p>
            ) : (
              <p className="notice notice-ok">Anlatma kaydedildi ({clock(retell.rec.durationMs)}).</p>
            )}
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep('questions')}>
                Sorulara geç
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => {
                  drop(retell);
                  setRetell(null);
                }}>
                Yeniden kaydet
              </button>
            </div>
          </>
        )}
      </>,
    );
  }

  if (step === 'questions' && passage) {
    const qs = passage.questions;
    const q = qs[qIndex];
    const chosen = answers[q.key];
    const isLast = qIndex === qs.length - 1;
    const done = qs.every((x) => answers[x.key]);
    return shell(
      <>
        <div className="flex flex-col gap-1">
          <p className="t-meta">
            Öğrenciye · Soru {qIndex + 1} / {qs.length}
          </p>
          {passage.grade <= 2 && <p className="t-small text-ink-3">Soruyu ve seçenekleri yetişkin sesli okuyabilir; cevabı öğrenci seçer.</p>}
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
            <button type="button" className="btn btn-primary btn-lg" disabled={!done} onClick={toHandoff}>
              Soruları bitir
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={!chosen} onClick={() => setQIndex(qIndex + 1)}>
              Sonraki soru
            </button>
          )}
        </div>
        {isLast && !done && <p className="t-meta">Bitirmek için bütün soruların cevaplanması gerekiyor.</p>}
      </>,
    );
  }

  /* ---------- Yetişkinin bölümü ---------- */

  if (step === 'handoff') {
    return shell(
      <>
        {title('Öğrencinin bölümü bitti')}
        <p className="text-2xl font-bold">Harika iş çıkardın, teşekkürler! 🎉</p>
        <p className="text-lg">
          Şimdi değerlendirme bölümü başlıyor. Bu bölümü öğretmen ya da veli yapar: Kaydı dinleyerek okuma hatalarını işaretler, anlatmayı ve okumanın
          akıcılığını değerlendirir. Yaklaşık 10 dakika sürer. Sessiz bir yerde, gerekirse kulaklıkla dinleyin.
        </p>
        <p className="notice notice-info">Mikrofon kapatıldı. Kayıtlar hâlâ yalnızca bu sayfada; sayfayı kapatırsanız silinir.</p>
        <div>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep('mark')}>
            Değerlendirmeye geç
          </button>
        </div>
      </>,
    );
  }

  if (step === 'mark' && passage && reading && readingSummary) {
    return (
      <div className="flex flex-col gap-7">
        <div className="mx-auto w-full max-w-3xl">
          <Stepper step={step} />
        </div>
        <MarkStep
          paragraphs={passage.paragraphs}
          fontClass={fontFor(passage.grade)}
          recording={{ url: reading.url, durationMs: reading.rec.durationMs, contour: reading.overview, pauses: readingSummary.absPauses }}
          marks={marks}
          onMarks={setMarks}
          listened={listened}
          onListened={setListened}
          onDone={() => setStep(retellSkipped ? 'prosody' : 'retellScore')}
        />
      </div>
    );
  }

  if (step === 'retellScore' && passage) {
    return shell(
      <>
        {title('Yeniden anlatmayı değerlendirin')}
        <p className="text-lg">
          Öğrencinin anlatırken söylediği fikirleri işaretleyin. Kelimesi kelimesine aynı olması gerekmez; anlamca söylediyse işaretleyin. “Temel”
          yazanlar, metni anlamış birinin mutlaka söyleyeceği fikirlerdir.
        </p>
        {retell && retell.analysis.quality !== 'silent' && (
          <div className="panel p-4">
            <RecordingPlayer url={retell.url} durationMs={retell.rec.durationMs} contour={retell.overview} label="Anlatma kaydı" />
          </div>
        )}
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Söylenen fikirler</legend>
          {passage.ideas.map((x) => {
            const on = ideas.has(x.key);
            return (
              <button
                key={x.key}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setIdeas((s) => {
                    const n = new Set(s);
                    if (n.has(x.key)) n.delete(x.key);
                    else n.add(x.key);
                    return n;
                  })
                }
                className={`flex items-start gap-3 rounded-xl border-[1.5px] p-3.5 text-left ${on ? 'border-ok bg-ok-bg' : 'border-rule-strong bg-surface hover:border-ink'}`}
              >
                <span
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-[1.5px] font-bold ${on ? 'border-ok bg-ok text-paper' : 'border-rule-strong'}`}
                  aria-hidden="true"
                >
                  {on ? '✓' : ''}
                </span>
                <span className="flex flex-col">
                  <span>{x.text}</span>
                  {x.core && <span className="t-small font-bold text-brass-ink">Temel fikir</span>}
                </span>
              </button>
            );
          })}
        </fieldset>
        <p className="t-small text-ink-2">
          İşaretlenen: {ideas.size} / {passage.ideas.length}
        </p>
        <div>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep('prosody')}>
            Devam
          </button>
        </div>
      </>,
    );
  }

  if (step === 'prosody' && passage && reading && readingSummary) {
    const ready = props.prosody.every((d) => prosody[d.key]);
    return shell(
      <>
        {title('Okumanın akıcılığını değerlendirin')}
        <p className="text-lg">
          Kaydın tamamını düşünerek her yön için öğrencinin okumasını en iyi anlatan seçeneği işaretleyin. Gerekirse kaydı yeniden dinleyebilirsiniz.
        </p>
        <div className="panel p-4">
          <RecordingPlayer url={reading.url} durationMs={reading.rec.durationMs} contour={reading.overview} pauses={readingSummary.absPauses} label="Okuma kaydı" />
        </div>
        {props.prosody.map((d) => (
          <fieldset key={d.key} className="flex flex-col gap-2">
            <legend className="mb-2 flex flex-col">
              <span className="t-h3">{d.name}</span>
              <span className="text-ink-2">{d.question}</span>
            </legend>
            {d.levels.map((l, i) => {
              const v = i + 1;
              const on = prosody[d.key] === v;
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setProsody((p) => ({ ...p, [d.key]: v }))}
                  className={`flex items-start gap-3 rounded-xl border-[1.5px] p-3.5 text-left ${on ? 'border-ink bg-ink text-paper' : 'border-rule-strong bg-surface hover:border-ink'}`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${on ? 'border-paper/60' : 'border-rule-strong text-ink-3'}`}
                    aria-hidden="true"
                  >
                    {v}
                  </span>
                  <span>{l}</span>
                </button>
              );
            })}
          </fieldset>
        ))}
        {error && <p className="notice notice-danger">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary btn-lg" disabled={!ready || submitting} onClick={submit}>
            {submitting ? 'Rapor hazırlanıyor…' : 'Raporu hazırla'}
          </button>
          {!ready && <p className="t-meta">Raporu hazırlamak için dört yönün hepsini işaretleyin.</p>}
        </div>
      </>,
    );
  }

  // Beklenmeyen durum (ör. kayıt kaybolduysa): başa dönme seçeneği.
  return shell(
    <>
      {title('Bir şeyler ters gitti')}
      <p>Bu adım için gereken bilgi bulunamadı. Lütfen sayfayı yenileyip baştan başlayın.</p>
    </>,
  );
}
