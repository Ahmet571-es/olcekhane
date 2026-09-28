import { besFaktorKisilikModeli } from './yazilar/bes-faktor-kisilik-modeli';
import { etkiliDersCalismaYontemleri } from './yazilar/etkili-ders-calisma-yontemleri';
import { kisilikTestleriGuvenilirMi } from './yazilar/kisilik-testleri-guvenilir-mi';
import { meslekSecimindeIlgiEnvanterleri } from './yazilar/meslek-seciminde-ilgi-envanterleri';
import { ogrenmeStilleriEfsanesi } from './yazilar/ogrenme-stilleri-efsanesi';
import { okumaHiziVeAnlama } from './yazilar/okuma-hizi-ve-anlama';
import { ozSaygiNedir } from './yazilar/oz-saygi-nedir';
import { sinavKaygisi } from './yazilar/sinav-kaygisi';
import type { Guide, GuideCategory } from './types';

export type { Guide, GuideCategory, GuideSource } from './types';
export { GUIDE_CATEGORIES } from './types';

/** Yayındaki rehber yazıları. Yeni yazı eklemek için yazilar/ altına dosya ekleyip buraya kaydedin. */
const GUIDES: Guide[] = [
  kisilikTestleriGuvenilirMi,
  besFaktorKisilikModeli,
  ozSaygiNedir,
  sinavKaygisi,
  etkiliDersCalismaYontemleri,
  ogrenmeStilleriEfsanesi,
  okumaHiziVeAnlama,
  meslekSecimindeIlgiEnvanterleri,
];

function byDateDesc(a: Guide, b: Guide) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

/** Tarihe göre yeniden eskiye; aynı tarihte listedeki sıra korunur. */
export function allGuides(): Guide[] {
  return GUIDES.map((g, i) => ({ g, i }))
    .sort((a, b) => byDateDesc(a.g, b.g) || a.i - b.i)
    .map(({ g }) => g);
}

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guidesByCategory(category: GuideCategory): Guide[] {
  return allGuides().filter((g) => g.category === category);
}

export function guidesForTest(testSlug: string): Guide[] {
  return allGuides().filter((g) => g.relatedTests?.includes(testSlug));
}

export function guidesByExpert(expertSlug: string): Guide[] {
  return allGuides().filter((g) => g.authorSlug === expertSlug || g.reviewerSlug === expertSlug);
}

/** Aynı kategoriden başlayarak, yazının kendisi hariç en fazla `n` yazı. */
export function relatedGuides(guide: Guide, n = 3): Guide[] {
  const others = allGuides().filter((g) => g.slug !== guide.slug);
  const same = others.filter((g) => g.category === guide.category);
  const rest = others.filter((g) => g.category !== guide.category);
  return [...same, ...rest].slice(0, n);
}
