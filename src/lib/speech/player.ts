import type { Utterance } from './report-text';
import { isLocalTurkish, sameVoice, type VoiceLike } from './voice';

/**
 * Raporu sesli dinle: okuma kuyruğu. Tarayıcının konuşma özelliği (speechSynthesis) dışarıdan verilir; böylece kuyruk
 * tarayıcısız denenebilir (tests/sesli-dinle.test.ts). Kurallar:
 * - İlk `speak` düğmeye basılınca hemen (aynı olayda) çağrılır: iOS başka türlüsüne izin vermez.
 * - Her parçadan hemen önce ses yeniden aranır (tarayıcının şimdiki ses listesinde, aynı kimlikle, cihazdaki Türkçe ses
 *   olarak); bulunamazsa okuma durur ("error"). Başka bir sese hiçbir zaman geçilmez.
 * - Duraklatma, okunan parçayı keser ve kaldığı yeri tutar; "Devam" o parçanın başından sürer (bazı tarayıcılarda
 *   speechSynthesis.pause güvenilir çalışmaz). Başlattıktan hemen sonraki (çift dokunma) duraklatma yok sayılır.
 * - Her başlatmada "kuşak" artar; iptal edilen konuşmanın geç gelen olayları (onend, onerror) yok sayılır.
 * - Dışarıdan bir kesinti ("interrupted", "canceled") okumayı duraklatır; başka bir hata okumayı "error"la durdurur.
 * - Bazı tarayıcılar "bitti" olayını kaybedebilir: konuşma bitmiş göründüğü hâlde olay gelmezse (WATCHDOG_MS) sonraki
 *   parçaya geçilir.
 * - Sayfadaki oynatıcılardan aynı anda yalnızca biri konuşur (SpeechHub); biri başlayınca öteki duraklar.
 */

export type SpeechPart = 'results' | 'roadmap';
export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'done' | 'error';

export interface PlayerState {
  status: PlayerStatus;
  part: SpeechPart;
  /** Okunan bölümün adı. */
  current: string | null;
  rate: number;
}

export interface UtteranceLike<V> {
  text: string;
  voice: V | null;
  lang: string;
  rate: number;
  onend: ((ev?: unknown) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
}

export interface SynthLike<V> {
  readonly speaking: boolean;
  readonly pending: boolean;
  getVoices(): V[];
  speak(u: UtteranceLike<V>): void;
  cancel(): void;
}

export interface PlayerEnv<V> {
  synth: SynthLike<V>;
  utterance(text: string): UtteranceLike<V>;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(id: unknown): void;
  now(): number;
}

/** "Bitti" olayı gelmezse beklenecek süre (ms). */
export const WATCHDOG_MS = 2000;
/** Başlattıktan sonra duraklatmanın yok sayıldığı süre (ms): çift dokunma okumayı hemen durdurmasın. */
export const PAUSE_GUARD_MS = 400;

/** Sayfadaki oynatıcıları bağlar: aynı anda yalnızca biri konuşur. */
export class SpeechHub {
  private owner: { yieldTurn(): void } | null = null;
  claim(p: { yieldTurn(): void }) {
    const prev = this.owner;
    this.owner = p;
    if (prev && prev !== p) prev.yieldTurn();
  }
  release(p: object) {
    if (this.owner === p) this.owner = null;
  }
  owns(p: object) {
    return this.owner === p;
  }
}

/** Tarayıcıdaki ortak bağlayıcı. */
export const defaultHub = new SpeechHub();

export class SpeechPlayer<V extends VoiceLike> {
  private state: PlayerState = { status: 'idle', part: 'results', current: null, rate: 1 };
  private listeners = new Set<() => void>();
  /** Okunan parçanın sırası; duraklatınca buradan sürer. */
  private index = 0;
  private generation = 0;
  /** Okunan parça (bazı tarayıcılarda başvurusu tutulmazsa olayları gelmez). */
  private utterance: UtteranceLike<V> | null = null;
  private timer: unknown = null;
  private startedAt = -Infinity;

  constructor(
    private env: PlayerEnv<V>,
    private lists: Record<SpeechPart, Utterance[]>,
    private voice: V,
    private hub: SpeechHub = defaultHub,
  ) {}

  getState = (): PlayerState => this.state;

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  private set(p: Partial<PlayerState>) {
    this.state = { ...this.state, ...p };
    for (const l of this.listeners) l();
  }

  private clearTimer() {
    if (this.timer !== null) this.env.clearTimeout(this.timer);
    this.timer = null;
  }

  /** Şimdiki ses listesinde aynı ses, hâlâ cihazdaki Türkçe ses olarak varsa o; yoksa null. */
  private liveVoice(): V | null {
    return this.env.synth.getVoices().find((v) => sameVoice(v, this.voice) && isLocalTurkish(v)) ?? null;
  }

  /** Okumayı keser (olayları yok sayılır); konuşan bu oynatıcıysa tarayıcının kuyruğunu boşaltır. */
  private halt() {
    this.generation++;
    this.clearTimer();
    this.utterance = null;
    if (this.hub.owns(this)) this.env.synth.cancel();
  }

  /** `part` kısmını `from` parçasından okur. */
  play(part: SpeechPart, from = 0) {
    const list = this.lists[part];
    if (list.length === 0) return;
    const gen = ++this.generation;
    this.clearTimer();
    this.utterance = null;
    this.hub.claim(this);
    const synth = this.env.synth;
    if (synth.speaking || synth.pending) synth.cancel();
    this.startedAt = this.env.now();
    this.set({ status: 'playing', part });
    this.step(gen, part, Math.min(Math.max(0, from), list.length - 1));
  }

  private step(gen: number, part: SpeechPart, k: number) {
    if (gen !== this.generation) return;
    this.clearTimer();
    const list = this.lists[part];
    if (k >= list.length) {
      this.utterance = null;
      this.index = 0;
      this.hub.release(this);
      this.set({ status: 'done', current: null });
      return;
    }
    this.index = k;
    const live = this.liveVoice();
    if (!live) {
      this.generation++;
      this.utterance = null;
      this.set({ status: 'error', current: null });
      return;
    }
    const u = this.env.utterance(list[k].text);
    u.voice = live;
    u.lang = live.lang;
    u.rate = this.state.rate;
    let moved = false;
    const next = () => {
      if (moved || gen !== this.generation) return;
      moved = true;
      this.step(gen, part, k + 1);
    };
    u.onend = () => next();
    u.onerror = (e) => {
      if (gen !== this.generation) return;
      this.generation++;
      this.clearTimer();
      this.utterance = null;
      if (e?.error === 'interrupted' || e?.error === 'canceled') this.set({ status: 'paused' });
      else this.set({ status: 'error', current: null });
    };
    this.utterance = u;
    this.set({ current: list[k].segment });
    this.env.synth.speak(u);
    this.watch(gen, k, next);
  }

  private watch(gen: number, k: number, next: () => void) {
    this.timer = this.env.setTimeout(() => {
      this.timer = null;
      if (gen !== this.generation || this.index !== k) return;
      const synth = this.env.synth;
      if (!synth.speaking && !synth.pending) next();
      else this.watch(gen, k, next);
    }, WATCHDOG_MS);
  }

  /** Duraklatır (başlattıktan hemen sonraki çift dokunma yok sayılır). */
  pause() {
    if (this.state.status !== 'playing') return;
    if (this.env.now() - this.startedAt < PAUSE_GUARD_MS) return;
    this.halt();
    this.set({ status: 'paused' });
  }

  /** Kalınan parçanın başından sürer. */
  resume() {
    this.play(this.state.part, this.index);
  }

  stop() {
    this.halt();
    this.index = 0;
    this.hub.release(this);
    this.set({ status: 'idle', part: 'results', current: null });
  }

  /** Hız; okurken değişirse okunan parça yeni hızla bir kez baştan okunur. */
  setRate(rate: number) {
    if (rate === this.state.rate) return;
    this.set({ rate });
    if (this.state.status === 'playing') this.play(this.state.part, this.index);
  }

  /** Sayfa gizlenince ya da sayfadan çıkılırken: okuyorsa duraklar. */
  hide() {
    if (this.state.status !== 'playing') return;
    this.halt();
    this.set({ status: 'paused' });
  }

  /** Başka bir oynatıcı konuşmaya başladı: bu oynatıcı duraklar (tarayıcının kuyruğunu öteki boşaltır). */
  yieldTurn() {
    this.generation++;
    this.clearTimer();
    this.utterance = null;
    if (this.state.status === 'playing') this.set({ status: 'paused' });
  }

  /** Okunacak metin değişti (ör. rapor türü): susar ve baştan başlamaya hazır olur. */
  setLists(lists: Record<SpeechPart, Utterance[]>) {
    if (lists === this.lists) return;
    this.lists = lists;
    if (this.state.status !== 'idle') this.stop();
  }

  /** Oynatıcı kaldırılırken: susar, bağlayıcıdan çıkar. */
  destroy() {
    this.halt();
    this.hub.release(this);
    this.listeners.clear();
  }
}
