'use client';

import { useMemo, useRef, useState } from 'react';
import { WordBody } from '@/components/test/oral-word';
import { oralTokens } from '@/lib/oral/words';
import type { OralMark, OralStatus, OralSubKind } from '@/lib/scoring/oral';
import { MIN_LISTENED } from '@/lib/scoring/oral';
import { RecordingPlayer, type PlayerHandle } from './player';

/**
 * Yetişkinin kaydı dinleyerek okuma hatalarını işaretlediği ekran. Kelimeye dokununca kayıt durur ve altta seçenekler
 * açılır. İşaretler yalnızca bu sayfada tutulur; rapor hazırlanırken gönderilir.
 */

const STATUS: { key: OralStatus | null; label: string; hint: string; error: boolean }[] = [
  { key: null, label: 'Doğru okudu', hint: 'İşaret yok', error: false },
  { key: 'sub', label: 'Yanlış okudu', hint: 'Başka bir kelime ya da yanlış söyleyiş', error: true },
  { key: 'omit', label: 'Atladı', hint: 'Kelimeyi hiç okumadı', error: true },
  { key: 'help', label: 'Yardımla okudu', hint: 'Takılınca kelimeyi siz söylediniz', error: true },
  { key: 'self', label: 'Kendisi düzeltti', hint: 'Önce yanlış okudu, hemen düzeltti', error: false },
];

const KINDS: { key: OralSubKind; label: string }[] = [
  { key: 'suffix', label: 'Kökü doğru, eki yanlış' },
  { key: 'similar', label: 'Benzer başka bir kelime' },
  { key: 'reversal', label: 'Harf ya da hece yer değiştirdi' },
  { key: 'nonword', label: 'Anlamsız bir kelime' },
];

const FLAGS: { key: 'rep' | 'syl' | 'hes'; label: string }[] = [
  { key: 'rep', label: 'Tekrar etti' },
  { key: 'syl', label: 'Heceleyerek okudu' },
  { key: 'hes', label: 'Önce duraksadı' },
];

function clean(m: OralMark): OralMark | null {
  const out: OralMark = {};
  if (m.s) out.s = m.s;
  if (m.s === 'sub') {
    if (m.said?.trim()) out.said = m.said.trim().slice(0, 40);
    if (m.kind) out.kind = m.kind;
    if (m.meaning !== undefined) out.meaning = m.meaning;
  }
  if (m.rep) out.rep = true;
  if (m.syl) out.syl = true;
  if (m.hes) out.hes = true;
  if (m.ins) out.ins = m.ins;
  return Object.keys(out).length ? out : null;
}

export function MarkStep(props: {
  paragraphs: string[];
  fontClass: string;
  recording: { url: string; durationMs: number; contour: number[]; pauses: [number, number][] };
  marks: Record<number, OralMark>;
  onMarks: (m: Record<number, OralMark>) => void;
  listened: number;
  onListened: (r: number) => void;
  onDone: () => void;
}) {
  const { marks, onMarks } = props;
  const tokens = useMemo(() => oralTokens(props.paragraphs), [props.paragraphs]);
  const flat = useMemo(() => tokens.flat(), [tokens]);
  const [sel, setSel] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<'listen' | 'none' | null>(null);
  const player = useRef<PlayerHandle>(null);

  const counts = useMemo(() => {
    let errors = 0;
    let other = 0;
    for (const m of Object.values(marks)) {
      if (m.s === 'sub' || m.s === 'omit' || m.s === 'help') errors++;
      errors += m.ins ?? 0;
      if (m.s === 'self' || m.rep || m.syl || m.hes) other++;
    }
    return { errors, other };
  }, [marks]);

  function update(i: number, patch: Partial<OralMark>) {
    const next = { ...marks };
    const m = clean({ ...(marks[i] ?? {}), ...patch });
    if (m) next[i] = m;
    else delete next[i];
    onMarks(next);
  }

  function pick(i: number) {
    player.current?.pause();
    setSel(i);
    setConfirm(null);
  }

  function finish() {
    if (props.listened < MIN_LISTENED && confirm !== 'listen') return setConfirm('listen');
    if (Object.keys(marks).length === 0 && confirm !== 'none') return setConfirm('none');
    props.onDone();
  }

  const m = sel !== null ? (marks[sel] ?? {}) : null;
  const listenedPct = Math.round(props.listened * 100);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-[24rem] sm:pb-80">
      <div className="flex flex-col gap-2">
        <h1 className="t-h1">Okuma hatalarını işaretleyin</h1>
        <p className="text-ink-2">
          Kaydı baştan dinleyin ve öğrencinin okuduğunu aşağıdaki metinden takip edin. Yanlış okunan, atlanan ya da sizin söylediğiniz bir kelimeye
          dokunup ne olduğunu seçin; kelimeye dokununca kayıt durur. Doğru okunan kelimelere bir şey yapmanız gerekmez.
        </p>
      </div>

      <details className="panel p-5">
        <summary className="cursor-pointer font-bold">İşaretler ne anlama geliyor?</summary>
        <dl className="mt-4 grid gap-x-6 gap-y-3 text-[0.975rem] sm:grid-cols-2">
          <div>
            <dt className="font-bold text-danger">Yanlış okudu (hata)</dt>
            <dd className="text-ink-2">Kelimeyi başka bir kelime gibi ya da yanlış okudu (ör. “geldi” yerine “gelmiş”). İsterseniz ne söylediğini yazın.</dd>
          </div>
          <div>
            <dt className="font-bold text-danger">Atladı (hata)</dt>
            <dd className="text-ink-2">Kelimeyi hiç okumadı.</dd>
          </div>
          <div>
            <dt className="font-bold text-danger">Yardımla okudu (hata)</dt>
            <dd className="text-ink-2">Yaklaşık 3 saniye takılınca kelimeyi siz söylediniz.</dd>
          </div>
          <div>
            <dt className="font-bold text-danger">Ekleme (hata)</dt>
            <dd className="text-ink-2">Bu kelimeden sonra metinde olmayan bir kelime söyledi. Eklediği her kelime bir hatadır.</dd>
          </div>
          <div>
            <dt className="font-bold text-warn">Kendisi düzeltti (hata değil)</dt>
            <dd className="text-ink-2">Önce yanlış okudu ama hemen kendisi fark edip doğrusunu okudu.</dd>
          </div>
          <div>
            <dt className="font-bold text-warn">Tekrar, hece, duraksama (hata değil)</dt>
            <dd className="text-ink-2">Kelimeyi tekrar etti, hece hece okudu ya da kelimeden önce belirgin biçimde durdu. Akıcılığı anlatmak için ayrıca gösterilir.</dd>
          </div>
        </dl>
        <p className="t-small mt-4 text-ink-3">
          Emin olamadığınız yerde “5 sn” düğmesiyle geri dönüp yeniden dinleyin; gerekirse “Hız” düğmesiyle kaydı yavaşlatın. Turuncu bölgeler 1
          saniyeden uzun duraklamalardır.
        </p>
      </details>

      <div className="sticky top-0 z-20 -mx-4 border-b border-rule bg-paper/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <RecordingPlayer
          ref={player}
          url={props.recording.url}
          durationMs={props.recording.durationMs}
          contour={props.recording.contour}
          pauses={props.recording.pauses}
          onListened={props.onListened}
          label="Okuma kaydı"
        />
        <p className="t-small mt-2 flex flex-wrap gap-x-4 gap-y-1 text-ink-2">
          <span>
            Dinlenen: <strong className="tabular">%{listenedPct}</strong>
          </span>
          <span>
            Hata: <strong className="tabular">{counts.errors}</strong>
          </span>
          <span>
            Öteki işaretler: <strong className="tabular">{counts.other}</strong>
          </span>
        </p>
      </div>

      <div className={`flex flex-col gap-5 ${props.fontClass}`}>
        {tokens.map((p, pi) => (
          <p key={pi} className="leading-[2.5]">
            {p.map((t) => (
              <span key={t.i}>
                <button
                  type="button"
                  onClick={() => pick(t.i)}
                  aria-pressed={sel === t.i}
                  className={`relative inline-block rounded-md px-0.5 transition-colors hover:bg-surface-2 focus-visible:outline-2 ${sel === t.i ? 'outline outline-2 outline-offset-1 outline-[var(--focus)]' : ''}`}
                >
                  <WordBody t={{ text: t.text, ...(marks[t.i] ?? {}) }} />
                </button>{' '}
              </span>
            ))}
          </p>
        ))}
      </div>

      {confirm === 'listen' && (
        <div className="notice notice-warn flex flex-col gap-3" role="alert">
          <p>
            Kaydın yalnızca %{listenedPct}’ini dinlediniz. Dinlemediğiniz bölümlerdeki hatalar işaretlenmemiş olur; bu da sonucu olduğundan iyi gösterir.
            Kaydın tamamını dinlemenizi öneririz.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={() => setConfirm(null)}>
              Dinlemeye devam et
            </button>
            <button type="button" className="btn btn-secondary" onClick={finish}>
              Yine de devam et
            </button>
          </div>
        </div>
      )}
      {confirm === 'none' && (
        <div className="notice notice-info flex flex-col gap-3" role="alert">
          <p>Hiç işaret koymadınız. Öğrenci metnin tamamını hatasız mı okudu?</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={props.onDone}>
              Evet, hatasız okudu
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirm(null)}>
              Geri dön
            </button>
          </div>
        </div>
      )}
      {!confirm && (
        <div>
          <button type="button" className="btn btn-primary btn-lg" onClick={finish}>
            İşaretlemeyi bitirdim
          </button>
        </div>
      )}

      {sel !== null && m && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto border-t border-rule-strong bg-surface shadow-[0_-12px_32px_-12px_rgb(19_32_59/0.35)]"
          role="dialog"
          aria-label={`“${flat[sel].text}” kelimesinin işareti`}
        >
          <div className="container-page mx-auto flex max-w-3xl flex-col gap-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="min-w-0 truncate text-lg">
                Kelime: <strong className="font-display text-xl">{flat[sel].text}</strong>
              </p>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                <button type="button" className="btn btn-secondary min-h-10 px-3" onClick={() => player.current?.replay(3000)}>
                  ↺ 3 sn geri dinle
                </button>
                <button type="button" className="btn btn-quiet min-h-10 px-3" disabled={sel === 0} onClick={() => setSel(sel - 1)} aria-label="Önceki kelime">
                  ←
                </button>
                <button
                  type="button"
                  className="btn btn-quiet min-h-10 px-3"
                  disabled={sel === flat.length - 1}
                  onClick={() => setSel(sel + 1)}
                  aria-label="Sonraki kelime"
                >
                  →
                </button>
                <button type="button" className="btn btn-primary min-h-10" onClick={() => setSel(null)}>
                  Tamam
                </button>
              </div>
            </div>

            <fieldset>
              <legend className="t-small mb-1.5 font-bold text-ink-2">Öğrenci bu kelimeyi nasıl okudu?</legend>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {STATUS.map((o) => {
                  const on = (m.s ?? null) === o.key;
                  return (
                    <button
                      key={o.label}
                      type="button"
                      aria-pressed={on}
                      onClick={() => update(sel, { s: o.key ?? undefined })}
                      className={`flex min-h-[2.9rem] flex-col items-start justify-center rounded-lg border-[1.5px] px-2.5 py-1 text-left ${
                        on ? (o.error ? 'border-danger bg-danger-bg' : 'border-ink bg-surface-2') : 'border-rule-strong hover:border-ink'
                      }`}
                    >
                      <span className={`font-bold leading-tight ${o.error ? 'text-danger' : ''}`}>{o.label}</span>
                      <span className="text-[0.72rem] leading-tight text-ink-3">{o.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {m.s === 'sub' && (
              <div className="flex flex-col gap-2 rounded-lg bg-surface-2 p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="soyledigi" className="t-small font-bold text-ink-2">
                    Ne okudu? <span className="font-normal text-ink-3">(isteğe bağlı)</span>
                  </label>
                  <input
                    id="soyledigi"
                    className="input min-h-10 max-w-xs flex-1 py-1.5"
                    maxLength={40}
                    autoComplete="off"
                    value={m.said ?? ''}
                    onChange={(e) => update(sel, { said: e.target.value })}
                    placeholder="Öğrencinin söylediği"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="t-small font-bold text-ink-2">Türü:</span>
                  {KINDS.map((k) => (
                    <button
                      key={k.key}
                      type="button"
                      aria-pressed={m.kind === k.key}
                      onClick={() => update(sel, { kind: m.kind === k.key ? undefined : k.key })}
                      className={`chip ${m.kind === k.key ? 'border-ink bg-ink text-paper' : ''}`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="t-small font-bold text-ink-2">Anlamı bozdu mu?</span>
                  {[
                    { v: true, l: 'Evet, bozdu' },
                    { v: false, l: 'Hayır, anlam aynı kaldı' },
                  ].map((o) => (
                    <button
                      key={o.l}
                      type="button"
                      aria-pressed={m.meaning === o.v}
                      onClick={() => update(sel, { meaning: m.meaning === o.v ? undefined : o.v })}
                      className={`chip ${m.meaning === o.v ? 'border-ink bg-ink text-paper' : ''}`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <fieldset className="flex flex-wrap items-center gap-1.5">
                <legend className="sr-only">Ayrıca (hata sayılmaz)</legend>
                <span className="t-small font-bold text-ink-2" aria-hidden="true">
                  Hata sayılmaz:
                </span>
                {FLAGS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={!!m[f.key]}
                    onClick={() => update(sel, { [f.key]: m[f.key] ? undefined : true })}
                    className={`rounded-lg border-[1.5px] px-2.5 py-1.5 text-[0.9375rem] font-bold ${m[f.key] ? 'border-warn bg-warn-bg' : 'border-rule-strong hover:border-ink'}`}
                  >
                    {m[f.key] ? '✓ ' : ''}
                    {f.label}
                  </button>
                ))}
              </fieldset>
              <div className="flex items-center gap-2">
                <span className="t-small font-bold text-ink-2">Sonrasına ekleme:</span>
                <button
                  type="button"
                  className="btn btn-secondary min-h-9 px-3"
                  disabled={!m.ins}
                  onClick={() => update(sel, { ins: (m.ins ?? 0) > 1 ? (m.ins ?? 0) - 1 : undefined })}
                  aria-label="Eklemeyi bir azalt"
                >
                  −
                </button>
                <span className="tabular min-w-5 text-center text-lg font-bold" aria-live="polite">
                  {m.ins ?? 0}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary min-h-9 px-3"
                  disabled={(m.ins ?? 0) >= 9}
                  onClick={() => update(sel, { ins: (m.ins ?? 0) + 1 })}
                  aria-label="Eklemeyi bir artır"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
