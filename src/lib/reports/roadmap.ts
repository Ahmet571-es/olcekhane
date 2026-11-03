import type { AudienceText, BandGroup, NextPurpose, RoadmapTemplate } from '@/content/roadmaps/types';
import type { Band } from '@/lib/instruments/types';
import type { Audience, ReportContent } from './build';
import { basisCaption, scaleGraphic, scalesGraphic, weeksGraphic, type RoadmapGraphic } from './roadmap-graphics';
import { compareOf } from './simple';

/**
 * Gelişim yol haritası: raporun sonundaki öneri bölümleri. Puanlardan ve şablondaki metinlerden kurulur; hiçbir şey
 * saklanmaz. Öneri niteliğindedir: tanı koymaz, kesin hüküm vermez, meslek seçmez.
 */

export interface RoadmapBar {
  key: string;
  label: string;
  value: number | null;
  min: number;
  max: number;
  ciLow: number | null;
  ciHigh: number | null;
  color: string;
  valueLabel: string;
  band: string;
}

export interface Roadmap {
  /** Uzman incelemesinde: yalnızca önizleme bağlantısıyla gösterilir. */
  preview: boolean;
  intro: string;
  bars: RoadmapBar[];
  /** Üç boyutlu grafiğin başlığı ve açıklaması; verilmezse "Profilin üç boyutlu" ve sütunun puanı gösterdiği söylenir. */
  barsTitle?: string;
  barsNote?: string;
  /**
   * "Kısaca": öne çıkan sonuçlar. `keys`: satırın dayandığı ölçekler ya da ölçüler (ör. bir boyut, bir konu alanı, bir görev
   * kartı); `graphic`: onların raporun kartındakiyle aynı grafiği (hesaplanmayan ya da yorumlanmayan sonuçta yok).
   */
  standout: { title: string; text: string; keys?: string[]; graphic?: RoadmapGraphic }[];
  /** Hiçbir boyut belirgin biçimde öne çıkmıyorsa gösterilen cümle. */
  standoutNote: string | null;
  /** Notun grafiği: bütün ölçeklerin yeri (ör. hepsi orta bölgede). */
  standoutGraphic?: RoadmapGraphic;
  study: {
    title: string;
    intro: string;
    /** Kartın grafiği: önerinin seçildiği ölçeğin ya da ölçünün sonucu (herkese aynı önerilerde yok). */
    items: { key: string; title: string; badge: string; color: string; text: string; graphic?: RoadmapGraphic }[];
    links: { label: string; href: string }[];
  };
  /**
   * Ortamı olmayan şablonlarda (ör. çalışma alışkanlıkları) yoktur. `keys` ve `graphic`: önerilerin seçildiği ölçekler ve
   * grafikleri (herkese aynı verilen listelerde yok).
   */
  settings: { title: string; intro: string; items: string[]; note: string; keys?: string[]; graphic?: RoadmapGraphic } | null;
  /**
   * Yalnızca veli raporunda. `items[].keys`: önerinin seçildiği ölçek; `keys` ve `graphic`: bölümün önerilerinin seçildiği
   * sonuçlar ve onların grafiği (ör. en belirgin boyutlar yan yana, okumada anlama soruları). Herkese aynı verilen önerilerde
   * grafik yoktur.
   */
  approach: {
    title: string;
    items: { title: string; text: string; keys?: string[] }[];
    keys?: string[];
    graphic?: RoadmapGraphic;
  } | null;
  /** `fromResult`: haftanın içeriği kişinin sonucuna göre seçildi (zaman çizelgesinde dolu daire). */
  weeks: { label: string; title: string; text: string; fromResult: boolean }[];
  /** Haftaların zaman çizelgesi (lib/reports/visual-roadmap.ts). */
  weeksGraphic: RoadmapGraphic;
  sources: { text: string; url?: string }[];
}

/** Yol haritasının son haftasında önerilecek test (kişinin sınıfına uyan, yayındaki bir test). */
export interface NextTest {
  name: string;
  href: string;
  /**
   * Şablonun önerdiği ilk iki testten biri kişinin sınıfına uymadığı (ya da yayında olmadığı) için listede başka bir test
   * var. Şablonun amaç cümlesi önerilen testlerin hepsini birlikte anlattığı için o zaman kullanılmaz.
   */
  partial?: boolean;
}

export function bandGroup(band: Band | null): BandGroup | null {
  if (band === null) return null;
  if (band === 'very_low' || band === 'low') return 'low';
  if (band === 'high' || band === 'very_high') return 'high';
  return 'average';
}

export function pick(t: AudienceText, audience: Audience): string {
  if (audience === 'parent') return t.parent;
  if (audience === 'adult') return t.adult ?? t.student;
  return t.student;
}

/** "Ayrıntılı Kişilik Profili ve Meslek İlgi Alanları" gibi. */
export function joinNames(names: string[]): string {
  // Adlardan biri "ve", iki nokta ya da soru işareti içeriyorsa ("Erteleme ve Zaman Yönetimi", "Çalışma Değerleri: Bir İşte…?")
  // adlar tırnak içinde yazılır; yoksa cümle karışır. Tek ad iki nokta ya da soru işareti içeriyorsa o da tırnak içinde
  // yazılır ("Sürekli Dikkat: Harf İşaretleme testini").
  const q =
    names.length > 1 ? (names.some((n) => / ve |[:?]/.test(n)) ? names.map((n) => `“${n}”`) : names) : names.map((n) => (/[:?]/.test(n) ? `“${n}”` : n));
  if (q.length <= 1) return q.join('');
  return `${q.slice(0, -1).join(', ')} ve ${q[q.length - 1]}`;
}

const SAYILAR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı'];

/** "dört haftalık küçük adımlar": haftaların sayısı yol haritasındaki haftalardan gelir (başlıklar ve giriş aynı sayıyı söyler). */
export function weeksPhrase(n: number): string {
  return `${SAYILAR[n] ?? String(n)} haftalık küçük adımlar`;
}

/** Bölüm başlığı: "Dört haftalık küçük adımlar". */
export function weeksTitle(n: number): string {
  const p = weeksPhrase(n);
  return p.charAt(0).toLocaleUpperCase('tr-TR') + p.slice(1);
}

/** Son haftanın sonundaki öneri: kişinin sınıfına uyan, yayındaki testler; uyan test yoksa boş. */
export function nextStep(next: NextTest[], purpose: NextPurpose, parent: boolean): string {
  // "Matematik Konu Tarama Testi testini" ya da "Dur-Git Görevi testini" denmez: addaki sözcük cümledeki "testini" ile birleşir.
  const names = next.map((n) => n.name.replace(/ (Testi|Görevi|Görevleri|Envanteri|Ölçeği)$/, ''));
  if (names.length === 0) return '';
  if (!purpose.general && next.some((n) => n.partial)) {
    return parent
      ? ` Bir sonraki adım olarak ${joinNames(names)} ${names.length > 1 ? 'testlerini' : 'testini'} de önerebilirsiniz.`
      : ` Bir sonraki adım olarak ${joinNames(names)} ${names.length > 1 ? 'testlerinden birini' : 'testini'} de çözebilirsin.`;
  }
  return parent
    ? ` Bir sonraki adım olarak ${purpose.parent} için ${joinNames(names)} ${names.length > 1 ? 'testlerini' : 'testini'} önerebilirsiniz.`
    : ` Bir sonraki adım olarak ${purpose.you} için ${joinNames(names)} ${names.length > 1 ? 'testlerinden birini' : 'testini'} çözebilirsin.`;
}

export function buildRoadmap(
  r: ReportContent,
  t: RoadmapTemplate,
  opts: { preview: boolean; next: NextTest[] },
): Roadmap {
  const a = r.audience;
  const parent = a === 'parent';
  const sections = r.sections.filter((s) => t.scales[s.scaleKey]);
  // Önerilerin düzeyi: bir maddesi destek kutusunu açan ölçekte (ör. "Sık sık kendimi hüzünlü hissederim" cümlesine
  // "Oldukça doğru") düşük düzeyin önerileri; cevapları iki uca ayrışan ölçekte orta düzeyinkiler (rapordaki kart
  // "Farklı cevaplar" der). Grafik, öne çıkanlar ve dengeli profil cümlesi puanın kendi düzeyini kullanır.
  // Şablon isterse (`flaggedFromAverage`) destek maddesi yalnızca orta düzeydeki ölçeğin önerilerini düşük düzeye çevirir:
  // yüksek düzeyde kart olumlu kalır, öneriler de onunla çelişmez (ör. Öz-yeterlik: "Sık sık moralim bozuk olur").
  const flaggedLow = (s: (typeof sections)[number]) =>
    !!s.flagged && (!t.flaggedFromAverage || (s.band !== null && bandGroup(s.band) !== 'high'));
  const groupOf = (s: (typeof sections)[number]): BandGroup | null =>
    s.band === null ? null : flaggedLow(s) ? 'low' : s.split ? 'average' : bandGroup(s.band);
  // Önerinin düzeyi puanın düzeyinden farklıysa (destek maddesi ya da ayrışan cevaplar) grafiğin başlığı nedenini söyler:
  // grafik puanın yerini gösterir, öneri başka bir düzeyden seçildi.
  type Why = 'flagged' | 'facets' | 'answers';
  const whyOf = (s: (typeof sections)[number]): Why | null => {
    const g = groupOf(s);
    if (g === null || g === bandGroup(s.band)) return null;
    return flaggedLow(s) ? 'flagged' : facetsOf(s).length > 1 ? 'facets' : 'answers';
  };
  /** Nedenin cümlesi: bir kartta "Öneri, …"; bölümün grafiğinde ölçeklerin adlarıyla ("A ve B: öneriler …"). */
  const whyText = (w: Why, many = false): string => {
    const o = many ? 'öneriler' : 'öneri';
    if (w === 'flagged') return parent ? `${o}, puana değil destek kutusunu açan cevaba göre seçildi.` : `${o}, puanına değil destek kutusunu açan cevabına göre seçildi.`;
    if (w === 'facets') return `alt özellikleri ayrıştığı için ${o} orta düzeyden seçildi.`;
    return parent ? `cevaplar iki uca ayrıştığı için ${o} orta düzeyden seçildi.` : `cevapların iki uca ayrıştığı için ${o} orta düzeyden seçildi.`;
  };
  const cap = (x: string) => x.charAt(0).toLocaleUpperCase('tr-TR') + x.slice(1);
  const why = (s: (typeof sections)[number]): string | null => {
    const w = whyOf(s);
    return w ? cap(whyText(w)) : null;
  };
  // Ayrıntılı profilde alt özellikleri ayrışan boyutun alt özellikleri (grafikte yan yana: ayrışma görünsün).
  const facetsOf = (s: (typeof sections)[number]) => {
    if (!s.split) return [];
    const keys = r.facetGroups?.find((f) => f.domain === s.scaleKey)?.facets ?? [];
    return keys.flatMap((k) => r.sections.filter((x) => x.scaleKey === k && x.value !== null));
  };
  // Bölümün grafiğinin başlığına eklenen not: önerisi puanının düzeyinden seçilmeyen ölçekler, nedenlerine göre.
  const whyNote = (list: (typeof sections)[number][]) =>
    (['flagged', 'facets', 'answers'] as const)
      .flatMap((w) => {
        const names = list.filter((s) => whyOf(s) === w).map((s) => s.name);
        return names.length ? [`${joinNames(names)}: ${whyText(w, names.length > 1)}`] : [];
      })
      .join(' ') || undefined;
  const mid = (s: (typeof sections)[number]) => (s.min + s.max) / 2;
  const distance = (s: (typeof sections)[number]) => (s.value === null ? -1 : Math.abs(s.value - mid(s)));

  const bars: RoadmapBar[] = sections.map((s) => ({
    key: s.scaleKey,
    label: s.name,
    value: s.value,
    min: s.min,
    max: s.max,
    ciLow: s.ciLow,
    ciHigh: s.ciHigh,
    color: t.scales[s.scaleKey].color,
    valueLabel: s.valueLabel,
    band: s.bandLabel,
  }));

  // Öne çıkanlar: ortadan en uzak, orta düzeyde olmayan en çok iki boyut (şablonun öncelik verdiği boyut ve düzeyler önce).
  // Tek boyutlu testte (ör. öz-saygı) o boyut.
  const prior = (s: (typeof sections)[number]) => ((t.standoutFirst ?? []).some((p) => p.scale === s.scaleKey && bandGroup(s.band) === p.group) ? 1 : 0);
  const notable =
    sections.length === 1
      ? sections.filter((s) => s.value !== null)
      : sections
          .filter((s) => {
            const g = bandGroup(s.band);
            return g !== null && g !== 'average';
          })
          .sort((x, y) => prior(y) - prior(x) || distance(y) - distance(x))
          .slice(0, 2);
  const standout = notable.map((s) => {
    const g = scaleGraphic(s);
    return { title: s.name, text: s.summary, keys: [s.scaleKey], ...(g ? { graphic: g } : {}) };
  });
  const unit = t.unit?.one ?? 'boyut';
  // Öne çıkan boyut yoksa notun grafiği bütün boyutların yeridir (ör. hepsi orta bölgede). Üç boyutlu profil değerleri
  // okuduysa (üç ve daha çok boyut) sesli dinlemede düzey düzey adlar okunur.
  const standoutGraphic = standout.length > 0 ? undefined : scalesGraphic(sections, unit, sections.length >= 3);
  // Cevaplarda bir kalite uyarısı varsa (ör. hep aynı seçenek, evet deme eğilimi) orta çıkan profil "dengeli" diye
  // anlatılmaz: puanların ortada toplanması cevap biçiminden de kaynaklanabilir.
  const standoutNote =
    standout.length > 0
      ? null
      : (r.qualityNotes?.length ?? 0) > 0
        ? parent
          ? `Çocuğunuzun puanlarında hiçbir ${unit} belirgin biçimde öne çıkmıyor; ama raporun başındaki uyarı nedeniyle bu sonuç dikkatle yorumlanmalıdır.`
          : r.young
            ? 'Puanlarının hepsi ortaya yakın çıktı. Raporun başındaki notu ailenle birlikte oku.'
            : `Puanlarında hiçbir ${unit} belirgin biçimde öne çıkmıyor; ama raporun başındaki uyarı nedeniyle bu sonuç dikkatle yorumlanmalı.`
      : t.balancedNote
        ? pick(t.balancedNote, a)
        : parent
        ? `Çocuğunuzun profili dengeli: hiçbir ${unit} belirgin biçimde öne çıkmıyor. Duruma göre farklı biçimlerde davranıyor olabilir.`
        : `Profilin dengeli: hiçbir ${unit} belirgin biçimde öne çıkmıyor. Duruma göre farklı biçimlerde davranıyor olabilirsin.`;

  // Çok boyutlu testlerde öneriler yalnızca en belirgin boyutlar için verilir: önce orta düzeyde olmayanlar (eşiğe eşit
  // uzaklıktaki bir orta puan, yüksek ya da düşük bir puanın önüne geçmesin diye), sonra ortadan en uzaktan başlayarak;
  // eşitlikte profildeki sıra korunur.
  const scored = sections.filter((s) => s.value !== null);
  const focusing = !!t.focus && scored.length > t.focus.count;
  const extreme = (s: (typeof sections)[number]) => (groupOf(s) === 'average' ? 0 : 1);
  // İyi oluş: şablondaki sırayla ilk uyan boyut (ör. Duygusal denge düşük, sonra Endişeye yatkınlık yüksek). Önerileri
  // en belirgin boyutlarla sınırlı testte bu boyutun kartı her zaman verilir ve ilk sıradadır (3. hafta ona ayrılır).
  // İyi oluş haftası boyutun kendi düzeyine bakar: alt özellikleri ayrışan (split) düşük bir boyut da haftayı açar.
  const wellGroup = (s: (typeof sections)[number]) => (flaggedLow(s) ? 'low' : bandGroup(s.band));
  const wellbeing = (t.wellbeing ? [t.wellbeing].flat() : [])
    .map((w) => ({ w, s: sections.find((s) => s.scaleKey === w.scale && wellGroup(s) === w.group) }))
    .find((x) => x.s);
  const stress = wellbeing?.s;
  const first = (s: (typeof sections)[number]) => (s === stress ? 1 : 0);
  const rank = (x: (typeof sections)[number], y: (typeof sections)[number]) => first(y) - first(x) || extreme(y) - extreme(x) || distance(y) - distance(x);
  const ranked = focusing ? [...scored].sort(rank) : [];
  const focused = focusing ? ranked.slice(0, t.focus!.count) : sections;
  // Sınır eşit puanların arasından geçiyorsa (ör. bütün özellikler aynı puanda) seçilenler testteki sıradır: söylenir.
  const tieAtCut = focusing && rank(ranked[t.focus!.count - 1], ranked[t.focus!.count]) === 0;
  const plural = (t.unit?.toPlural ?? 'boyutlara').replace(/a$/, 'dan').replace(/e$/, 'den');
  const tieNote = tieAtCut ? ` Puanı ortadan eşit uzaklıkta olan ${plural} testteki sırayla ilk gelenler seçildi.` : '';

  const study = focused.flatMap((s) => {
    const g = groupOf(s);
    if (!g) return [];
    // Kartın grafiği puanın düzey çubuğu (düzey rozette okunur); öneri başka düzeyden seçildiyse başlığı nedenini söyler,
    // alt özellikleri ayrışan boyutta alt özellikler yan yana.
    const w = why(s);
    const facets = w ? compareOf(facetsOf(s)) : undefined;
    const base = facets ? { visual: facets, spoken: facetsOf(s).map((f) => `${f.name}: ${f.valueLabel}, ${f.bandLabel}.`) } : scaleGraphic(s, false);
    const graphic = base && w ? { ...base, caption: w } : base;
    return [
      {
        key: s.scaleKey,
        title: s.name,
        badge: s.bandLabel === s.summary ? s.bandLabel : `${s.bandLabel} · ${s.summary}`,
        color: t.scales[s.scaleKey].color,
        text: pick(t.scales[s.scaleKey].study[g], a),
        ...(graphic ? { graphic } : {}),
      },
    ];
  });
  const links = [{ label: a === 'adult' ? 'Etkili çalışma yöntemleri' : 'Etkili ders çalışma yöntemleri', href: '/rehber/etkili-ders-calisma-yontemleri' }];
  // Varsayılan bağlantı "Sınav kaygısı" yazısıdır; öğrencilere ve velilere yazıldığı için yetişkine verilmez.
  const stressLink =
    wellbeing?.w.link === undefined ? (a === 'adult' ? null : { label: 'Sınav kaygısı', href: '/rehber/sinav-kaygisi' }) : wellbeing.w.link;
  if (stress && stressLink) links.push(stressLink);
  links.push(...(t.links ?? []));

  const hasSettings = Object.values(t.scales).some((x) => x.settings) && !!t.settingsNote;
  const settingFrom = focused.flatMap((s) => {
    const g = groupOf(s);
    const text = g ? t.scales[s.scaleKey].settings?.[g] : undefined;
    return text ? [{ s, text }] : [];
  });
  const settingItems = settingFrom.map((x) => x.text);
  // Ortamların grafiği: ortamların seçildiği boyutlar (sesli dinlemede adları); hiç ortam yoksa bütün boyutlar (ör. hepsi
  // orta; 16 özellikte düzeylere göre özellik sayısı; sesli dinlemede düzey düzey).
  const settingSecs = settingFrom.length ? settingFrom.map((x) => x.s) : sections.filter((s) => s.value !== null);
  const settingGraphic = settingFrom.length
    ? basisCaption(scalesGraphic(settingSecs, unit), settingSecs.length > 1, settingSecs.map((x) => x.name), whyNote(settingSecs))
    : basisCaption(scalesGraphic(settingSecs, unit, true), settingSecs.length > 1);
  // Ortam yazılmamış bir boyut uçta olabilir (ör. 16 Faktörlü'de Düşünsel özgüven): o zaman profil "dengeli" diye anlatılmaz.
  // Dengeli profil puanların kendi düzeyine bakar (alt özellikleri ayrışan yüksek bir boyut da uçtadır).
  const noneExtreme = focused.every((s) => bandGroup(s.band) !== 'low' && bandGroup(s.band) !== 'high');
  // Cevaplarda bir kalite uyarısı varsa orta çıkan profil "dengeli" diye anlatılmaz (Kısaca'daki not gibi).
  const cautioned = (r.qualityNotes?.length ?? 0) > 0;

  // Veliye yaklaşım: en belirgin boyutların her biri için bir öneri; bölümün grafiği o boyutlar yan yana.
  const approachFrom = focused.filter((s) => {
    const g = groupOf(s);
    return !!((g && t.approach?.[s.scaleKey]?.[g]) || s.tips[0]);
  });
  const approachItems = approachFrom.map((s) => {
    const g = groupOf(s);
    return { title: s.name, text: ((g && t.approach?.[s.scaleKey]?.[g]) || s.tips[0])!, keys: [s.scaleKey] };
  });
  const approachScored = approachFrom.filter((s) => s.value !== null);
  const approachGraphic = basisCaption(scalesGraphic(approachFrom, unit), approachScored.length > 1, approachScored.map((s) => s.name), whyNote(approachFrom));

  // Dört hafta: fark et → çalışma düzeni (ör. sorumluluk; başlık şablondan) → iyi oluş ya da en belirgin boyut → gözden
  // geçir.
  const action = (key: string) => {
    const s = sections.find((x) => x.scaleKey === key);
    const g = s ? groupOf(s) : null;
    return s && g ? { name: s.name, text: pick(t.scales[key].action[g], a) } : null;
  };
  const planning = action(t.planningScale);
  // 3. hafta: iyi oluş gerekiyorsa o boyut; değilse ortadan en uzak (şablon isterse en düşük puanlı) boyut; tek boyutlu
  // testte şablondaki ek deneme.
  const rel = (s: (typeof sections)[number]) => (s.value === null ? Infinity : (s.value - s.min) / (s.max - s.min || 1));
  const skip = (s: (typeof sections)[number]) => (t.thirdWeekSkip ?? []).some((p) => p.scale === s.scaleKey && groupOf(s) === p.group);
  const others = sections.filter((s) => s.scaleKey !== t.planningScale && s.value !== null && !skip(s));
  const ordered =
    t.thirdWeek === 'lowest' ? others.sort((x, y) => rel(x) - rel(y)) : others.sort((x, y) => distance(y) - distance(x));
  const thirdKey = stress?.scaleKey ?? ordered[0]?.scaleKey;
  // En uzak boyut birden çoksa (eşit puanlar) 3. hafta testteki sırayla seçildi: "sonuca göre seçildi" denmez.
  const key = (s: (typeof sections)[number]) => (t.thirdWeek === 'lowest' ? rel(s) : distance(s));
  const thirdTie = !stress && ordered.length > 1 && key(ordered[0]) === key(ordered[1]);
  const third = thirdKey ? action(thirdKey) : t.extraWeek ? { name: t.extraWeek.title, text: pick(t.extraWeek.text, a) } : null;
  // Çalışma düzeni boyutu hesaplanamadıysa (ör. o boyutta çok madde boş bırakıldı) 2. hafta sıradaki boyuta ayrılır; plan
  // dört hafta kalır.
  const secondKey = planning ? null : ordered.find((s) => s.scaleKey !== thirdKey && action(s.scaleKey))?.scaleKey;
  const second = planning
    ? { name: t.planningTitle ?? 'Çalışma düzeni', text: planning.text }
    : secondKey
      ? action(secondKey)
      : null;
  const nextSentence = nextStep(opts.next, t.nextPurpose ?? { you: 'ilgilerini görmek', parent: 'çocuğunuzun ilgilerini görmek', general: true }, parent);
  // Haftanın içeriği bir boyutun düzeyinden seçildiyse (çalışma düzeni, iyi oluş, en belirgin boyut) zaman çizelgesinde
  // "sonuca göre"; ilk ve son hafta ile tek boyutlu testteki ek deneme herkes için aynıdır.
  const middle = [
    ...(second ? [{ ...second, fromResult: true }] : []),
    ...(third ? [{ ...third, fromResult: !!thirdKey && !thirdTie }] : []),
  ];
  const weeks = [
    { label: '1. hafta', title: 'Fark et', text: pick(t.firstWeek, a), fromResult: false },
    ...middle.map((x, i) => ({ label: `${i + 2}. hafta`, title: x.name, text: x.text, fromResult: x.fromResult })),
  ];
  weeks.push({ label: `${weeks.length + 1}. hafta`, title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextSentence, fromResult: false });
  const span = weeksPhrase(weeks.length);

  const contents = parent
    ? ['çocuğunuzun nasıl çalışabileceği', ...(hasSettings ? ['hangi ortamlarda rahat edebileceği'] : []), 'ona nasıl yaklaşabileceğiniz']
    : ['nasıl çalışabileceğin', ...(hasSettings ? ['hangi ortamlarda rahat edebileceğin'] : [])];

  return {
    preview: opts.preview,
    intro: parent
      ? `Bu bölüm sonuçları günlük hayata taşımanız için öneriler içerir: ${contents.join(', ')} ve ${span}. Öneriler bir tanı ya da kesin hüküm değildir; çocuğunuza uyanları birlikte seçin.`
      : r.young
        ? `Bu bölümde ailenle birlikte deneyebileceğin öneriler var: ${contents.join(', ')} ve ${span}. Hepsini yapmak zorunda değilsin; sana uyanları seç.`
        : `Bu bölüm sonuçlarını günlük hayata taşıman için öneriler içerir: ${contents.join(', ')} ve ${span}. Öneriler bir tanı ya da kesin hüküm değildir; sana uyanları seç.`,
    bars,
    standout,
    standoutNote,
    ...(standoutGraphic ? { standoutGraphic } : {}),
    study: {
      title: parent ? 'Çocuğunuz nasıl çalışabilir?' : 'Nasıl çalışabilirsin?',
      intro: focusing
        ? `${pick(t.studyIntro, a)} ${pick(t.focus!.note, a).replace('{n}', SAYILAR[study.length] ?? String(study.length))}${tieNote}`
        : pick(t.studyIntro, a),
      items: study,
      links,
    },
    settings: !hasSettings
      ? null
      : {
          title: a === 'adult' ? 'İş ve meslek planı için' : 'Okul ve meslek planı için',
          // Ortam önerilmediyse nedeni: profil dengeli (ya da kalite uyarısıyla orta), ya da öne çıkan sonuçların ortam
          // önerisi yok.
          intro:
            settingItems.length === 0
              ? noneExtreme
                ? cautioned
                  ? parent
                    ? `Hiçbir ${unit} öne çıkmadığı için burada bir ortam önerilmedi; “Kısaca” bölümündeki nota da bakın.`
                    : `Hiçbir ${unit} öne çıkmadığı için burada bir ortam önerilmedi; “Kısaca” bölümündeki notu da oku.`
                  : parent
                    ? 'Çocuğunuzun profili dengeli olduğu için tek bir ortam öne çıkmıyor; farklı ortamlarda rahat edebilir.'
                    : 'Profilin dengeli olduğu için tek bir ortam öne çıkmıyor; farklı ortamlarda rahat edebilirsin.'
                : parent
                  ? 'Çocuğunuzun öne çıkan sonuçları ortam seçimi için bir ipucu vermiyor.'
                  : 'Öne çıkan sonuçların ortam seçimi için bir ipucu vermiyor.'
              : parent
                ? 'Çocuğunuzun kendini daha rahat hissedebileceği ortamlar:'
                : 'Kendini daha rahat hissedebileceğin ortamlar:',
          items: settingItems,
          note: pick(t.settingsNote!, a),
          keys: settingSecs.map((x) => x.scaleKey),
          ...(settingGraphic ? { graphic: settingGraphic } : {}),
        },
    approach: parent
      ? {
          title: 'Çocuğunuza nasıl yaklaşabilirsiniz?',
          items: approachItems,
          keys: approachFrom.map((s) => s.scaleKey),
          ...(approachGraphic ? { graphic: approachGraphic } : {}),
        }
      : null,
    weeks,
    weeksGraphic: weeksGraphic(weeks, parent),
    sources: t.sources,
  };
}

