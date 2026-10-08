/**
 * Sesli okumada otomatik analiz: öğrenci okumayı bitirip "Evet, analiz et" deyince kayıt, öğrencinin cihazında (tarayıcıda,
 * bir Web Worker içinde) çalışan konuşma tanıma modeliyle yazıya dökülür; yazıya dökülen kelimeler okunan metinle
 * karşılaştırılıp kelime işaretlerine çevrilir. Ses cihazdan hiç çıkmaz; sunucuya yalnızca işaretler, süreler ve cevaplar
 * gider (yetişkinin işaretlediği sürümle aynı biçimde). Model dosyaları kendi sunucumuzdan iner; hiçbir şey tarayıcı
 * deposuna yazılmaz (yalnızca olağan HTTP önbelleği).
 *
 * Bu dosya, otomatik analizin parçaları (model dosyalarının sunumu, Worker, metinle karşılaştırma, öğrenci akışı) arasındaki
 * ortak türleri ve sabitleri tutar.
 */

/** Konuşma tanıma modeli: Türkçede telefonlarda en iyi doğruluk/boyut dengesi (ölçüm: 2026-10-08, FLEURS tr WER %15). */
export const ASR_MODEL = {
  id: 'onnx-community/whisper-small_timestamped',
  /** Hugging Face'teki sabit sürüm (dosyalar bu sürümden indirilir ve SHA-256 ile doğrulanır). */
  revision: '65caa70f294b46e1c33ff820aae6b16d048ab818',
  dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' },
} as const;

/** Model dosyalarının sitedeki yeri (transformers.js `env.localModelPath`): /model/<id>/... */
export const ASR_MODEL_BASE = '/model/65caa70f/';
/** ONNX Runtime Web dosyaları (wasm ve yükleyicisi). */
export const ORT_BASE = '/ort/4.3.0/';
/** transformers.js'in tarayıcı derlemesi (Next.js paketlemesine girmez; Worker doğrudan yükler). */
export const TRANSFORMERS_URL = '/vendor/4.3.0/transformers.min.js';
/** Analizi yapan Worker. */
export const ASR_WORKER_URL = '/okuma/analiz-isci.js';

/** Konuşma tanımanın çıkardığı bir kelime: başlangıç ve bitiş, verilen sesin başından itibaren saniye. */
export interface AsrWord {
  text: string;
  start: number;
  end: number;
}

/** Sayfa → Worker iletileri. `id`, cevabı isteğe bağlar. Ses 16 kHz tek kanal Float32. */
export type AsrRequest =
  | { id: number; type: 'load' }
  | { id: number; type: 'transcribe'; audio: Float32Array }
  /** Doğrulama: kısa ses parçaları ayrı ayrı yazıya dökülür (Worker parçaları sessizlikle birleştirip tek geçişte işleyebilir). */
  | { id: number; type: 'transcribeClips'; clips: Float32Array[] };

/** Worker → sayfa iletileri. */
export type AsrResponse =
  | { id: number; type: 'progress'; stage: 'download' | 'load' | 'transcribe'; ratio: number; loadedBytes?: number; totalBytes?: number }
  | { id: number; type: 'loaded'; backend: 'wasm' | 'webgpu'; threads: number }
  | { id: number; type: 'words'; words: AsrWord[] }
  | { id: number; type: 'clipWords'; words: AsrWord[][] }
  | { id: number; type: 'error'; kind: 'memory' | 'network' | 'unsupported' | 'unknown'; message: string };

/** Mikrofon denemesinde öğrencinin söylediği cümle; yapay zekâ bunu anlaşılır duymalı. */
export const MIC_CHECK_SENTENCE = 'Merhaba, ben okumaya hazırım.';
