import { describe, expect, it } from 'vitest';
import { evaluate } from '@/lib/assessment/evaluate';
import { colorWordBody, goNoGoBody, reactionBody } from './helpers/bodies';
import { TASK_VARIANTS } from './helpers/task-variants';

/**
 * Dikkat ve bellek, sürekli dikkat, renk-kelime, dur-git ve tepki hızı raporlarının bağımsız incelemede (2026-10-22)
 * düzeltilen metinleri: sayılar abartılmaz ya da küçültülmez ("hepsinde", "hiçbirinde"), yorumlanmayan kartın grafiği
 * olmaz, aynı öneri iki kartta yinelenmez, veliye yazılan cümlelerin öznesi çocuktur.
 */

const v = (slug: string, name: string) => evaluate(slug, (TASK_VARIANTS[slug] as Record<string, () => Parameters<typeof evaluate>[1]>)[name]());

describe('Dikkat ve bellek', () => {
  it('ok görevi: rozette saniye; kenardaki oklar çok yanıltınca ayrıca söylenir; veli cümlesinin öznesi çocuk', () => {
    const iyi = v('dikkat-ve-bellek', 'iyi');
    const ok = iyi.student.items.find((i) => /doğru · doğru cevaplarda ortalama/.test(i.badge ?? ''))!;
    expect(ok.badge).toMatch(/^%100 doğru · doğru cevaplarda ortalama \d,\d\d saniye$/);
    expect(ok.text).toContain('çoğu kişi biraz yavaşlar ve daha sık yanılır');
    expect(ok.text).not.toContain('çok daha sık yanıldın');
    expect(iyi.student.chartTitle).toBe('Ok görevi: okların yönüne göre doğru cevaplar');
    const zor = v('dikkat-ve-bellek', 'zorlanan');
    const okZor = zor.student.items.find((i) => /doğru · doğru cevaplarda/.test(i.badge ?? ''))!;
    expect(okZor.text).toContain('Kenardaki oklar ters yöne baktığında çok daha sık yanıldın.');
    const okVeli = zor.parent.items.find((i) => /doğru · doğru cevaplarda/.test(i.badge ?? ''))!;
    expect(okVeli.text).toMatch(/^Çocuğunuz yanlardaki oklar/);
    expect(okVeli.text).toContain('Bu sonuç tek başına yorumlanmamalıdır.');
  });

  it('en kısa diziler de doğru tekrarlanmadıysa rozet ve metin bunu açıkça söyler', () => {
    const zor = v('dikkat-ve-bellek', 'zorlanan');
    const floor = zor.student.items.filter((i) => i.badge === 'En kısa dizi doğru tekrarlanmadı');
    expect(floor.length).toBe(3);
    expect(floor[0].text).toContain('Bu görevde en kısa rakam dizilerini de doğru tekrar edemedin. O an dikkatin dağılmış ya da görev sana yeni gelmiş olabilir.');
    const veli = zor.parent.items.filter((i) => i.badge === 'En kısa dizi doğru tekrarlanmadı');
    expect(veli[2].text).toContain('Çocuğunuz bu görevde en kısa kutu dizilerinin sırasını da doğru hatırlayamadı.');
    expect(JSON.stringify(zor)).not.toMatch(/her zaman daha zordur|herkes için/);
  });

  it('hiç sembol eşleştirilmediyse yalnızca o görev yorumlanmaz; grafik çizilmez, not kısa', () => {
    const r = v('dikkat-ve-bellek', 'sembolYok');
    const sym = r.student.items.find((i) => i.badge === 'Cevap verilmedi')!;
    expect(sym.text).toContain('saniye boyunca hiç sembol eşleştirmedin; bu yüzden bu görevin sonucu yorumlanmadı.');
    expect(sym.visual).toBeUndefined();
    expect(r.parent.items.find((i) => i.badge === 'Cevap verilmedi')!.text).toMatch(/^Çocuğunuz \d+ saniye boyunca hiç sembol eşleştirmedi/);
    expect(r.parent.cautions).toContain('Sembol eşleştirme görevinde hiç cevap verilmedi.');
  });
});

describe('Sürekli dikkat', () => {
  it('çok az harf işaretlendiyse dört kart yorumlanmaz ve grafik çizilmez', () => {
    const r = v('surekli-dikkat', 'cokAz');
    for (const rep of [r.student, r.parent]) {
      expect(rep.items.map((i) => i.badge)).toEqual(['Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı', 'Yorumlanmadı']);
      expect(rep.items.every((i) => !i.visual)).toBe(true);
      expect(rep.chart).toBeNull();
    }
    expect(r.student.itemsTitle).toBe('Sonuçların');
    expect(r.student.items[0].text).toContain('Çok az harf işaretlediğin için bu sonuç yorumlanmadı.');
    expect(r.parent.items[0].text).toContain('Çocuğunuz çok az harf işaretlediği için bu sonuç yorumlanmadı.');
  });

  it('yanlış işaretler sayısıyla söylenir; veli metinleri çocuğu anar', () => {
    const r = v('surekli-dikkat', 'yanlisIsaret');
    expect(r.student.items[1].text).toMatch(/Birçok harfi de yanlışlıkla işaretledin \(\d+ yanlış işaret\)/);
    expect(r.parent.items[1].text).toMatch(/Çocuğunuz aranan harflere benzeyen birçok harfi de işaretledi \(\d+ yanlış işaret; ör\./);
    expect(r.parent.items[0].text).toMatch(/^Çocuğunuz harf sayfalarında dakikada ortalama \d+ harf taradı\./);
    expect(r.parent.items[2].text).toContain('rastgele işaretlemek bu sayıyı artırmaz');
  });

  it('bölümler boyunca değişim yoksa başta ve sonda aynı çalışıldığı söylenir; artış veliye çocuğu anarak anlatılır', () => {
    const d = v('surekli-dikkat', 'duzenli');
    expect(d.student.items[3].badge).toBe('Belirgin değişim yok');
    expect(d.student.items[3].text).toContain('görevin başında nasıl çalıştıysan sonunda da öyle çalıştın.');
    expect(d.student.items[3].text).toContain('Dikkatini görev boyunca korudun.');
    expect(d.parent.items[3].text).toContain('çocuğunuz görevin başında ve sonunda benzer biçimde çalıştı.');
    expect(d.parent.items[3].text).toContain('yalnızca büyük farklar yorumlanır');
    const a = v('surekli-dikkat', 'artan');
    expect(a.parent.items[3].badge).toBe('Görev ilerledikçe arttı');
    expect(a.parent.items[3].text).toMatch(/^Çocuğunuzun son bölümlerdeki net doğru sayısı/);
  });
});

describe('Renk-kelime', () => {
  it('bütün hatalar kelime ile renk farklıyken ve hepsinde kelimenin rengine basıldıysa "hepsi" denir', () => {
    const r = evaluate('renk-kelime-gorevi', colorWordBody((t, i) => ({ choice: t.word !== t.ink && i % 4 === 0 ? t.word : t.ink, rtMs: 700 })));
    const t = r.student.items[0].text;
    if (t.includes('kelime ile renk farklıyken oldu')) {
      expect(t).toContain('Hataların hepsi kelime ile renk farklıyken oldu ve bu hataların hepsinde kelimenin söylediği renge bastın');
    }
    // Hız korundu ama farklıyken daha sık yanıldı: etki kartı bunu söyler.
    const etki = r.student.items[2];
    if (etki.badge === 'Belirgin bir fark görülmedi' && t.includes('kelimenin söylediği renge')) {
      expect(etki.text).toContain('Bu görevde kelimenin etkisi daha çok hatalarda görüldü');
    }
  });

  it('cevapsız görev: tek uyarı; renk körlüğü ya da süre notu yinelenmez', () => {
    const r = v('renk-kelime-gorevi', 'cevapsiz');
    const notes = r.parent.cautions.filter((c) => c.startsWith('Renk-kelime'));
    expect(notes).toEqual([
      'Renk-kelime görevinde denemelerin çoğunda süre içinde cevap verilmemiş ya da kelimeye bakmadan çok erken basılmış; görev yarıda bırakılmış ya da yönerge anlaşılmamış olabilir. Bu görevin sonucu yorumlanmamalıdır.',
    ]);
    expect(r.student.items[2].text).toBe('Yeterince doğru cevap olmadığı için kelime ile rengin aynı olduğu ve farklı olduğu denemeler karşılaştırılamadı.');
  });

  it('renk denemesinde karışıklık: not sayıyla; etki kartı dikkatle yorumlanmasını söyler', () => {
    const r = v('renk-kelime-gorevi', 'renkKarisik');
    expect(r.parent.cautions.join(' ')).toMatch(/renk denemesinde \d+ denemenin \d+ tanesinde başka bir rengin düğmesine basıldı\. Renkler birbirine karışmış/);
    if (r.parent.items[2].badge !== 'Hesaplanamadı') expect(r.parent.items[2].text).toContain('Renk denemesindeki karışıklık yüzünden bu fark dikkatle yorumlanmalıdır.');
  });
});

describe('Dur-git', () => {
  it('dikkatli gidip duran ama harf kaçıran: durma kartı bu dengeyi anlatır; öneri tekrarlanmaz', () => {
    const r = v('dur-git-gorevi', 'dikkatli');
    expect(r.student.items[0].text).toMatch(/X geldiğinde (her seferinde|çoğu zaman) durabildin\. Ama bunu yaparken basman gereken bazı harfleri kaçırdın/);
    expect(r.parent.items[0].text).toContain('ancak basması gereken harflerin bir kısmını kaçırdı');
  });

  it('hızlı: öneri yalnızca tepki hızı kartında; veli metninde gelişim cümlesi yok', () => {
    const r = evaluate('dur-git-gorevi', goNoGoBody((t, i) => (t.go ? 300 : i % 2 ? 320 : null)));
    if (r.student.items[2].text.includes('hız öne çıkıyor')) {
      expect(r.student.items[0].text).not.toContain('biraz daha yavaş');
    }
    expect(r.parent.items.map((i) => i.text).join(' ')).not.toContain('Tepki ketlemesi çocukluk ve ergenlik boyunca');
  });
});

describe('Tepki hızı', () => {
  it('kaçırılan ve ters basılan bölümler "hiçbir" ve "hepsi" ile anlatılır', () => {
    const k = v('tepki-hizi', 'kacirdi');
    expect(k.student.items[1].text).toContain('40 denemenin hiçbirinde süre içinde basılmadı.');
    expect(k.student.items[1].text).toContain('Hiçbir denemede süre içinde basmadın');
    const t = v('tepki-hizi', 'ters');
    expect(t.student.items[1].text).toContain('Cevaplarının hepsinde dairenin olmadığı taraftaki düğmeye bastın');
  });

  it('bir bölümde birçok erken basış varsa seçimin etkisi kartı çekinceyle yazılır', () => {
    // Basit bölümde denemelerin üçte biri çok erken: bölüm yorumlanır ama karşılaştırma dikkatle okunur.
    const r = evaluate(SLUG_TEPKI, reactionBody((t) => (t.part === 'simple' && t.i % 3 === 0 ? { choice: 1, rtMs: 40 } : { choice: (t.box + 1) as 1 | 2, rtMs: t.part === 'simple' ? 320 : 480 })));
    expect(r.student.items[0].badge).toMatch(/^Tipik tepki süresi/);
    expect(r.student.items[2].text).toContain('Bölümlerden birinde birçok denemede süre içinde basılmadığı ya da çok erken basıldığı için bu karşılaştırma dikkatle yorumlanmalı.');
  });

  it('tepkiler aynı süreye yığılınca "aralık ne kadar darsa" denmez', () => {
    const r = evaluate(SLUG_TEPKI, reactionBody((t) => ({ choice: (t.box + 1) as 1 | 2, rtMs: t.part === 'simple' ? 300 : 450 })));
    expect(r.student.items[0].text).toContain('Tepkilerin birbirine çok yakındı.');
    expect(r.student.items[0].text).not.toContain('Bu aralık ne kadar darsa');
    expect(r.parent.items[0].text).toContain('Çocuğunuzun tepkileri birbirine çok yakındı; bu, tepkilerinin tutarlı olduğunu gösterir.');
  });
});

const SLUG_TEPKI = 'tepki-hizi';
