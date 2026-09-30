/**
 * Ana sayfadaki "Kendini dene" oyunu: beş kişilik boyutu için kaydırıcı değerlerini (0–1) üç boyutlu
 * şeklin görünümüne çevirir. Bu bir ölçüm değildir: kaydırıcılar ziyaretçinin kendi tahminidir ve
 * şekil yalnızca görseldir. Değerler hiçbir yere gönderilmez ya da kaydedilmez.
 *
 * Eşleme (şiirsel, bilimsel değil):
 *  - Dışadönüklük: şekil dışa doğru uzanır (dalgaların boyu).
 *  - Uyumluluk: şekil yumuşar, lobları büyür ve yuvarlaklaşır.
 *  - Sorumluluk: şekil düzene girer, simetrik loblar belirir.
 *  - Duygusal denge: hareket sakinleşir; düşükken şekil daha hızlı ve titrek dalgalanır.
 *  - Merak ve hayal gücü: yüzeye ayrıntı ve renk katılır.
 */

export type TraitKey = 'extraversion' | 'agreeableness' | 'conscientiousness' | 'emotional_stability' | 'intellect';

export interface TraitDef {
  key: TraitKey;
  /** Beş Faktör Kişilik Profili'ndeki boyut adı. */
  name: string;
  low: string;
  high: string;
  /** Kaydırıcı artınca şeklin nasıl değiştiği. */
  effect: string;
  /** Boyutun rengi (globals.css: --dim-*). */
  cssVar: string;
}

export const TRAITS: readonly TraitDef[] = [
  { key: 'extraversion', name: 'Dışadönüklük', low: 'Sakin', high: 'Sosyal', effect: 'dışa uzanır', cssVar: '--dim-ext' },
  { key: 'agreeableness', name: 'Uyumluluk', low: 'Doğrudan', high: 'Uzlaşmacı', effect: 'yumuşar', cssVar: '--dim-agr' },
  { key: 'conscientiousness', name: 'Sorumluluk', low: 'Esnek', high: 'Planlı', effect: 'düzene girer', cssVar: '--dim-con' },
  { key: 'emotional_stability', name: 'Duygusal Denge', low: 'Çabuk etkilenen', high: 'Kolay sarsılmayan', effect: 'sakinleşir', cssVar: '--dim-emo' },
  { key: 'intellect', name: 'Merak ve Hayal Gücü', low: 'Pratik', high: 'Meraklı', effect: 'ayrıntılanır', cssVar: '--dim-int' },
];

/** Sırası TRAITS ile aynı: dışadönüklük, uyumluluk, sorumluluk, duygusal denge, merak. */
export type Traits = readonly [number, number, number, number, number];

export const DEFAULT_TRAITS: Traits = [0.62, 0.68, 0.46, 0.58, 0.82];

export interface ShapeParams {
  /** Dalgaların boyu (birim kürenin yarıçapına göre). */
  amplitude: number;
  /** Ana dalga sıklığı: düşük = büyük, yumuşak loblar. */
  frequency: number;
  /** 0 = serbest (organik), 1 = düzenli (simetrik loblar). */
  symmetry: number;
  /** Zaman akış hızı. */
  speed: number;
  /** Titreşim payı. */
  jitter: number;
  /** İnce ayrıntı payı. */
  detail: number;
}

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.5);

export function shapeParams(traits: Traits): ShapeParams {
  const [ext, agr, con, emo, int] = traits.map(clamp01);
  return {
    amplitude: 0.1 + 0.2 * ext,
    frequency: 1.7 - 0.8 * agr,
    symmetry: con,
    speed: 0.5 - 0.34 * emo,
    jitter: 0.05 * (1 - emo),
    detail: 0.03 + 0.27 * int,
  };
}

/** Rastgele bir şekil: her boyut 0,1 ile 0,95 arasında. */
export function randomTraits(rand: () => number = Math.random): Traits {
  const r = () => Math.round((0.1 + 0.85 * rand()) * 100) / 100;
  return [r(), r(), r(), r(), r()];
}

/** Kaydırıcının ekran okuyucuya okunan değeri: "Sosyal tarafa yakın (72/100)". */
export function traitValueText(def: TraitDef, value: number): string {
  const v = Math.round(clamp01(value) * 100);
  const side = v >= 60 ? `${def.high} tarafa yakın` : v <= 40 ? `${def.low} tarafa yakın` : 'Ortada';
  return `${side} (${v}/100)`;
}
