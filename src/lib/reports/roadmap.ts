import type { AudienceText, BandGroup, RoadmapTemplate } from '@/content/roadmaps/types';
import type { Band } from '@/lib/instruments/types';
import type { Audience, ReportContent } from './build';

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
  standout: { title: string; text: string }[];
  /** Hiçbir boyut belirgin biçimde öne çıkmıyorsa gösterilen cümle. */
  standoutNote: string | null;
  study: {
    title: string;
    intro: string;
    items: { key: string; title: string; badge: string; color: string; text: string }[];
    links: { label: string; href: string }[];
  };
  /** Ortamı olmayan şablonlarda (ör. çalışma alışkanlıkları) yoktur. */
  settings: { title: string; intro: string; items: string[]; note: string } | null;
  /** Yalnızca veli raporunda. */
  approach: { title: string; items: { title: string; text: string }[] } | null;
  weeks: { label: string; title: string; text: string }[];
  sources: { text: string; url?: string }[];
}

/** Yol haritasının son haftasında önerilecek test (kişinin sınıfına uyan, yayındaki bir test). */
export interface NextTest {
  name: string;
  href: string;
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
  if (names.length <= 1) return names.join('');
  // Adlardan biri "ve", iki nokta ya da soru işareti içeriyorsa ("Erteleme ve Zaman Yönetimi", "Çalışma Değerleri: Bir İşte…?")
  // adlar tırnak içinde yazılır; yoksa cümle karışır.
  const q = names.length > 1 && names.some((n) => / ve |[:?]/.test(n)) ? names.map((n) => `“${n}”`) : names;
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
export function nextStep(next: NextTest[], purpose: { you: string; parent: string }, parent: boolean): string {
  // "Matematik Konu Tarama Testi testini" ya da "Dur-Git Görevi testini" denmez: addaki sözcük cümledeki "testini" ile birleşir.
  const names = next.map((n) => n.name.replace(/ (Testi|Görevi|Görevleri|Envanteri|Ölçeği)$/, ''));
  if (names.length === 0) return '';
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
  const groupOf = (s: (typeof sections)[number]): BandGroup | null =>
    s.band === null ? null : s.flagged ? 'low' : s.split ? 'average' : bandGroup(s.band);
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
  const standout = notable.map((s) => ({ title: s.name, text: s.summary }));
  const unit = t.unit?.one ?? 'boyut';
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
  const wellGroup = (s: (typeof sections)[number]) => (s.flagged ? 'low' : bandGroup(s.band));
  const wellbeing = (t.wellbeing ? [t.wellbeing].flat() : [])
    .map((w) => ({ w, s: sections.find((s) => s.scaleKey === w.scale && wellGroup(s) === w.group) }))
    .find((x) => x.s);
  const stress = wellbeing?.s;
  const first = (s: (typeof sections)[number]) => (s === stress ? 1 : 0);
  const focused = focusing
    ? [...scored].sort((x, y) => first(y) - first(x) || extreme(y) - extreme(x) || distance(y) - distance(x)).slice(0, t.focus!.count)
    : sections;

  const study = focused.flatMap((s) => {
    const g = groupOf(s);
    if (!g) return [];
    return [
      {
        key: s.scaleKey,
        title: s.name,
        badge: s.bandLabel === s.summary ? s.bandLabel : `${s.bandLabel} · ${s.summary}`,
        color: t.scales[s.scaleKey].color,
        text: pick(t.scales[s.scaleKey].study[g], a),
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
  const settingItems = focused.flatMap((s) => {
    const g = groupOf(s);
    const text = g ? t.scales[s.scaleKey].settings?.[g] : undefined;
    return text ? [text] : [];
  });

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
  const third = thirdKey ? action(thirdKey) : t.extraWeek ? { name: t.extraWeek.title, text: pick(t.extraWeek.text, a) } : null;
  // Çalışma düzeni boyutu hesaplanamadıysa (ör. o boyutta çok madde boş bırakıldı) 2. hafta sıradaki boyuta ayrılır; plan
  // dört hafta kalır.
  const secondKey = planning ? null : ordered.find((s) => s.scaleKey !== thirdKey && action(s.scaleKey))?.scaleKey;
  const second = planning
    ? { name: t.planningTitle ?? 'Çalışma düzeni', text: planning.text }
    : secondKey
      ? action(secondKey)
      : null;
  const nextSentence = nextStep(opts.next, t.nextPurpose ?? { you: 'ilgilerini görmek', parent: 'çocuğunuzun ilgilerini görmek' }, parent);
  const middle = [second, third].filter((x): x is { name: string; text: string } => x !== null);
  const weeks = [
    { label: '1. hafta', title: 'Fark et', text: pick(t.firstWeek, a) },
    ...middle.map((x, i) => ({ label: `${i + 2}. hafta`, title: x.name, text: x.text })),
  ];
  weeks.push({ label: `${weeks.length + 1}. hafta`, title: 'Gözden geçir', text: pick(t.lastWeek, a) + nextSentence });
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
    study: {
      title: parent ? 'Çocuğunuz nasıl çalışabilir?' : 'Nasıl çalışabilirsin?',
      intro: focusing
        ? `${pick(t.studyIntro, a)} ${pick(t.focus!.note, a).replace('{n}', SAYILAR[study.length] ?? String(study.length))}`
        : pick(t.studyIntro, a),
      items: study,
      links,
    },
    settings: !hasSettings
      ? null
      : {
          title: a === 'adult' ? 'İş ve meslek planı için' : 'Okul ve meslek planı için',
          intro:
            settingItems.length === 0
              ? parent
                ? 'Çocuğunuzun profili dengeli olduğu için tek bir ortam öne çıkmıyor; farklı ortamlarda rahat edebilir.'
                : 'Profilin dengeli olduğu için tek bir ortam öne çıkmıyor; farklı ortamlarda rahat edebilirsin.'
              : parent
                ? 'Çocuğunuzun kendini daha rahat hissedebileceği ortamlar:'
                : 'Kendini daha rahat hissedebileceğin ortamlar:',
          items: settingItems,
          note: pick(t.settingsNote!, a),
        },
    approach: parent
      ? {
          title: 'Çocuğunuza nasıl yaklaşabilirsiniz?',
          items: focused.flatMap((s) => {
            const g = groupOf(s);
            const text = (g && t.approach?.[s.scaleKey]?.[g]) || s.tips[0];
            return text ? [{ title: s.name, text }] : [];
          }),
        }
      : null,
    weeks,
    sources: t.sources,
  };
}

