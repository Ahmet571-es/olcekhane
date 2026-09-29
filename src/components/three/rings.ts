/** Ana sayfadaki halkalı kürenin halkaları: her biri bir ölçüm alanı. */
export interface HeroRing {
  key: string;
  label: string;
  hint: string;
  href: string;
  radius: number;
  tilt: [number, number, number];
  speed: number;
}

const deg = (d: number) => (d * Math.PI) / 180;

export const HERO_RINGS: HeroRing[] = [
  { key: 'kisilik', label: 'Kişilik', hint: 'Beş faktör, öz-saygı', href: '/testler#kisilik', radius: 1.62, tilt: [0, deg(90), 0], speed: 0.1 },
  { key: 'ilgi', label: 'İlgi ve meslek', hint: 'Mesleki ilgi profili', href: '/testler#ilgi-ve-meslek', radius: 1.47, tilt: [deg(90), 0, 0], speed: -0.08 },
  { key: 'ogrenme', label: 'Öğrenme', hint: 'Okuma, matematik, çalışma', href: '/testler#ogrenme', radius: 1.32, tilt: [deg(90), deg(23.44), 0], speed: 0.06 },
  { key: 'dikkat', label: 'Dikkat', hint: 'Harf işaretleme, oklar', href: '/testler#bilissel', radius: 1.17, tilt: [deg(52), deg(-34), 0], speed: -0.13 },
  { key: 'bellek', label: 'Çalışma belleği', hint: 'Sayı ve kutu dizileri', href: '/testler#bilissel', radius: 1.02, tilt: [deg(-38), deg(58), deg(20)], speed: 0.18 },
];
