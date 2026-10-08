import type { Sahne } from '@/content/beyin/types';
import { YAPILAR, type Yapi } from '@/content/beyin/yapilar';

/** Sol ve sağ yanı olan yapılarda taraf ekini atar: `talamus-sol` → `talamus`. */
export function tarafsiz(id: string): string {
  return id.replace(/-(sol|sag)$/, '');
}

/** Seçiciler: yapı kimliği, tarafsız kimlik, `bolge:…`, `lob:…`, `katman:…`, `taraf:…`. */
export function seciciUyar(y: Yapi, s: string): boolean {
  const i = s.indexOf(':');
  if (i > 0) {
    const tur = s.slice(0, i);
    const deger = s.slice(i + 1);
    if (tur === 'bolge') return y.bolge === deger;
    if (tur === 'lob') return y.lob === deger;
    if (tur === 'katman') return y.katman === deger;
    if (tur === 'taraf') return y.taraf === deger;
    return false;
  }
  return y.id === s || tarafsiz(y.id) === s;
}

export const uyar = (y: Yapi, liste?: string[]) => Boolean(liste?.some((s) => seciciUyar(y, s)));

/** Sahnede görünen (soluk olanlar dâhil) yapılar. */
export function sahnedekiYapilar(ayar: Sahne): Yapi[] {
  return YAPILAR.filter((y) => {
    if (!ayar.katmanlar.includes(y.katman)) return false;
    if (ayar.goster && !uyar(y, ayar.goster)) return false;
    if (uyar(y, ayar.gizle)) return false;
    if (ayar.yarim && y.taraf && y.taraf !== ayar.yarim) return false;
    return true;
  });
}

/** Sahnede öne çıkan yapılar: vurgu verilmişse onlar, verilmemişse görünenlerin hepsi. */
export function oneCikanlar(ayar: Sahne): Yapi[] {
  const hepsi = sahnedekiYapilar(ayar);
  return ayar.vurgula?.length ? hepsi.filter((y) => uyar(y, ayar.vurgula)) : hepsi;
}
