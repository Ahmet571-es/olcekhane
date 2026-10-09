import type { Sahne } from '@/content/beyin/types';
import type { Bolge, Lob, Yapi } from '@/content/beyin/yapilar';
import { tarafsiz, uyar } from './secici';

/**
 * Üç boyutlu beynin renkleri. Renkler yapıyı ya da bölgeyi tanıtır; iyi ya da kötü anlamı taşımaz. Lob renkleri
 * sitenin tayf renklerinden türetilmiştir; sahne her zaman koyu bir zemin üzerinde çizilir.
 */
export const LOB_RENGI: Record<Lob, string> = {
  frontal: '#5b84f2',
  parietal: '#f2b544',
  temporal: '#25b9a3',
  oksipital: '#ee6a92',
  insula: '#9d7cf2',
  limbik: '#f28a52',
};

export const BOLGE_RENGI: Record<Bolge, string> = {
  serebrum: '#6f90f5',
  diensefalon: '#35c6b2',
  'beyin-sapi': '#a98cf6',
  beyincik: '#f28a5d',
  karincik: '#4f9de0',
  damar: '#d9473c',
  kemik: '#ece3cf',
  disk: '#8fc1dc',
  sinir: '#f2dc8c',
};

/** Her yapıya kendi rengi: derin yapılar birbirinden ayırt edilsin diye. */
const YAPI_RENGI: Record<string, string> = {
  'kaudat-cekirdek': '#36c48f',
  putamen: '#2fae7f',
  'globus-pallidus': '#93d36c',
  talamus: '#3fb7e2',
  hipotalamus: '#f2a65a',
  'mamiller-cisimler': '#f6c177',
  hipokampus: '#f4c84a',
  amigdala: '#ef5d7b',
  forniks: '#f1e9da',
  'forniks-komissuru': '#efe5d2',
  'korpus-kallozum': '#f4eee4',
  'on-komissur': '#eadfc8',
  'arka-komissur': '#eadfc8',
  'ic-kapsul': '#e6dccb',
  hipofiz: '#e98cb9',
  epifiz: '#c59cf1',
  habenula: '#b48ce6',
  'lateral-genikulat-cisim': '#62d2f1',
  'medial-genikulat-cisim': '#8be0c9',
  'optik-kiazma': '#f2dc8c',
  'optik-traktus': '#f2dc8c',
  'optik-sinir': '#f2dc8c',
  'orta-beyin': '#a98cf6',
  'serebral-pedinkul': '#9277e6',
  'ust-tepecik': '#c9b6ff',
  'alt-tepecik': '#b9a2fb',
  pons: '#b7a2f4',
  'omurilik-sogani': '#9b83e9',
  beyincik: '#f28a5d',
  'beyaz-cevher': '#f3ede3',
};

/** Gerçeğe yakın renkler: kabuk pembemsi, beyaz cevher krem, damar kırmızı, kemik fildişi. */
const DOGAL: Partial<Record<Bolge, string>> = {
  serebrum: '#e8b7ab',
  diensefalon: '#d9a59c',
  'beyin-sapi': '#dcaea3',
  beyincik: '#e2ab9d',
  karincik: '#5aa6e6',
  damar: '#cc3b33',
  kemik: '#efe7d5',
  disk: '#9cc7dc',
  sinir: '#f0dfa2',
};

export function yapiRengi(y: Yapi, sema: NonNullable<Sahne['renk']>): string {
  if (sema === 'lob') {
    if (y.lob) return LOB_RENGI[y.lob];
    return YAPI_RENGI[tarafsiz(y.id)] ?? BOLGE_RENGI[y.bolge];
  }
  if (sema === 'bolge') return BOLGE_RENGI[y.bolge];
  if (sema === 'dogal') {
    if (y.katman === 'beyaz' || ['korpus-kallozum', 'forniks', 'forniks-komissuru', 'ic-kapsul', 'on-komissur', 'arka-komissur'].includes(tarafsiz(y.id)))
      return '#f2ece2';
    if (y.katman === 'derin' && y.bolge === 'serebrum' && !y.lob) return '#cf9d95';
    return DOGAL[y.bolge] ?? '#e8b7ab';
  }
  return YAPI_RENGI[tarafsiz(y.id)] ?? (y.lob ? LOB_RENGI[y.lob] : BOLGE_RENGI[y.bolge]);
}

/** Sahnedeki rengi: sahneye özel boya varsa o, yoksa renk şemasının rengi. */
export function sahneRengi(y: Yapi, ayar: Pick<Sahne, 'renk' | 'boya'>): string {
  const boya = ayar.boya?.find((b) => uyar(y, b.secici));
  return boya?.renk ?? yapiRengi(y, ayar.renk ?? 'lob');
}
