import { afterEach, describe, expect, it } from 'vitest';
import { hashLoginCode, newLoginCode, normalizeLoginCode } from '@/lib/auth/codes';
import { describeAgent, maskIp } from '@/lib/auth/devices';
import { safeNextPath } from '@/lib/auth/next-path';
import { csvField, toCsv } from '@/lib/csv';
import { maskEmail } from '@/lib/mask';
import { MAX_IMPORT_ROWS, parseStudentList } from '@/lib/school/import';
import { safeBands, suppress } from '@/lib/school/suppress';
import { ipBucket } from '@/lib/ip';
import { slugifyTr } from '@/lib/slug';

describe('öğrenci listesi aktarma', () => {
  it('sekmeyle ayrılmış e-Okul benzeri listeyi başlığıyla okur', () => {
    const text = 'No\tAdı\tSoyadı\tVeli E-posta\n101\tayşe nur\tYILMAZ\tveli1@ornek.com\n102\tMehmet\tKaya\t\n';
    const { rows, errors } = parseStudentList(text);
    expect(errors).toEqual([]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ firstName: 'Ayşe Nur', lastName: 'Yılmaz', schoolNo: '101', guardianEmail: 'veli1@ornek.com' });
    expect(rows[1]).toMatchObject({ firstName: 'Mehmet', lastName: 'Kaya', schoolNo: '102', guardianEmail: null });
  });

  it('noktalı virgül ve tek sütunda ad soyad', () => {
    const { rows } = parseStudentList('Zeynep Su Demir;VELI@Ornek.com\nİlker Işık');
    expect(rows[0]).toMatchObject({ firstName: 'Zeynep Su', lastName: 'Demir', guardianEmail: 'veli@ornek.com' });
    expect(rows[1]).toMatchObject({ firstName: 'İlker', lastName: 'Işık' });
  });

  it('geçersiz e-postayı ve tekrarlanan okul numarasını satır numarasıyla bildirir', () => {
    const { rows, errors } = parseStudentList('1,Ali,Can,ali@\n2,Ece,Tan\n2,Efe,Er');
    expect(errors.map((e) => e.line).sort()).toEqual([1, 3]);
    expect(rows.map((r) => r.firstName)).toEqual(['Ece']);
  });

  it('e-Okul çıktısı: büyük harfli başlık, sıra numarası, cinsiyet ve şube sütunları', () => {
    const text = [
      'S.NO\tOKUL NO\tADI\tSOYADI\tCINSIYETI\tSINIFI\tVELI E-POSTA',
      '1\t1453\tALİ\tIŞIK\tErkek\t7-A\tALI.ISIK@ORNEK.COM',
      '2\t987\tEce\tAk\tKız\t7/A\t',
    ].join('\n');
    const { rows, errors } = parseStudentList(text);
    expect(errors).toEqual([]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ firstName: 'Ali', lastName: 'Işık', schoolNo: '1453', guardianEmail: 'ali.isik@ornek.com' });
    expect(rows[1]).toMatchObject({ firstName: 'Ece', lastName: 'Ak', schoolNo: '987' });
  });

  it('başlık yalnızca ilk satırda aranır: “Veli” adlı öğrenci atlanmaz', () => {
    const { rows } = parseStudentList('Ad\tSoyad\nVeli\nAyşe\tKaya');
    expect(rows.map((r) => r.firstName)).toEqual(['Veli', 'Ayşe']);
  });

  it('T.C. kimlik numarası içeren satırı aktarmaz', () => {
    const { rows, errors } = parseStudentList('Ayşe Yılmaz\t12345678901');
    expect(rows).toHaveLength(0);
    expect(errors[0].message).toContain('kimlik');
  });

  it('en fazla 200 öğrenci', () => {
    const many = Array.from({ length: MAX_IMPORT_ROWS + 1 }, (_, i) => `Öğrenci${'a'.repeat((i % 5) + 1)} Soyad`).join('\n');
    const { rows, errors } = parseStudentList(many);
    expect(rows).toHaveLength(0);
    expect(errors[0].message).toContain('200');
  });
});

describe('öğrenci giriş kodları', () => {
  const saved = process.env.APP_SECRET;
  afterEach(() => {
    process.env.APP_SECRET = saved;
  });

  it('kodu biçimlendirir ve karışan harfleri reddeder', () => {
    expect(normalizeLoginCode('k7pxm-3qd2a')).toBe('K7PXM3QD2A');
    expect(normalizeLoginCode(' K7PXM 3QD2A ')).toBe('K7PXM3QD2A');
    expect(normalizeLoginCode('K7PXM-3QD20')).toBeNull(); // 0 alfabede yok
    expect(normalizeLoginCode('K7PXM-3QD2I')).toBeNull(); // I alfabede yok
    expect(normalizeLoginCode('K7PX-M3QD')).toBeNull(); // eski 8 karakterlik biçim
  });

  it('yeni kod, gösterim biçiminden hesaplanan özetle saklanır ve özet anahtara bağlıdır', () => {
    process.env.APP_SECRET = 'a'.repeat(40);
    const c = newLoginCode();
    expect(c.display).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/);
    expect(c.hash).toBe(hashLoginCode(normalizeLoginCode(c.display)!));
    process.env.APP_SECRET = 'b'.repeat(40);
    expect(hashLoginCode(normalizeLoginCode(c.display)!)).not.toBe(c.hash);
  });
});

describe('grup raporu gizliliği', () => {
  it('1–2 öğrencilik hücreler gizlenir, sıfır ve 3+ gösterilir', () => {
    expect(suppress(0)).toBe(0);
    expect(suppress(1)).toBeNull();
    expect(suppress(2)).toBeNull();
    expect(suppress(3)).toBe(3);
    expect(suppress(27)).toBe(27);
  });

  it('dağılım sabit basamaklarla birleştirilir; küçük grup kalırsa gösterilmez', () => {
    const cells = (counts: number[]) => counts.map((c, i) => ({ key: `b${i}`, label: `D${i}`, count: c }));
    const show = (counts: number[]) => safeBands(cells(counts))?.map((c) => `${c.label}:${c.count}`) ?? null;
    expect(show([4, 3, 6])).toEqual(['D0:4', 'D1:3', 'D2:6']);
    expect(show([0, 5, 0])).toEqual(['D0:0', 'D1:5', 'D2:0']);
    // Üç düzeyde ara basamak yok: küçük grup varsa dağılım gösterilmez.
    expect(show([3, 3, 1])).toBeNull();
    // Beş düzey: uçlar birleşir.
    expect(show([1, 3, 10, 2, 4])).toEqual(['D0 – D1:4', 'D2:10', 'D3 – D4:6']);
    expect(show([1, 1, 10, 0, 0])).toBeNull();
    // Bütün kombinasyonlarda gösterilen hiçbir grup 1–2 değildir.
    for (let a = 0; a < 5; a++)
      for (let b = 0; b < 5; b++)
        for (let c = 0; c < 5; c++)
          for (let d = 0; d < 5; d++)
            for (let e = 0; e < 5; e++) {
              const out = safeBands(cells([a, b, c, d, e]));
              if (out) for (const g of out) expect(g.count === 0 || g.count >= 3).toBe(true);
            }
  });

  it('IPv6 adresleri /64 önekine indirgenir', () => {
    expect(ipBucket('85.105.12.34')).toBe('85.105.12.34');
    expect(ipBucket('::ffff:10.0.0.7')).toBe('10.0.0.7');
    expect(ipBucket('2a02:e0:1234:5678:abcd::1')).toBe('2a02:e0:1234:5678::/64');
    expect(ipBucket('2a02:e0::1')).toBe('2a02:e0:0:0::/64');
    expect(ipBucket(null)).toBe('bilinmiyor');
  });
});

describe('yardımcılar', () => {
  it('CSV: tırnaklama ve formül koruması', () => {
    expect(csvField('Ali, Veli')).toBe('"Ali, Veli"');
    expect(csvField('"alıntı"')).toBe('"""alıntı"""');
    expect(csvField('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`);
    expect(csvField('-5 + 3')).toBe("'-5 + 3");
    expect(csvField(-2.5)).toBe('-2.5');
    expect(csvField(null)).toBe('');
    const csv = toCsv(['a', 'b'], [[1, 'x']]);
    expect(csv.startsWith('\uFEFFa,b\r\n1,x')).toBe(true);
    // Türkçe Excel: noktalı virgül ve ondalık virgül
    expect(toCsv(['a', 'b'], [[1.5, 'x;y']], { excel: true })).toBe('\uFEFFa;b\r\n1,5;"x;y"\r\n');
  });

  it('dönüş yolu yalnızca site içi olabilir', () => {
    expect(safeNextPath('/veli-onayi/abc')).toBe('/veli-onayi/abc');
    expect(safeNextPath('//kotu.site')).toBeNull();
    expect(safeNextPath('/\\kotu.site')).toBeNull();
    expect(safeNextPath('https://kotu.site')).toBeNull();
    expect(safeNextPath('/a\nb')).toBeNull();
    expect(safeNextPath(undefined)).toBeNull();
  });

  it('cihaz, IP ve e-posta gizleme', () => {
    expect(describeAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36')).toBe('Chrome, Windows');
    expect(describeAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')).toBe('Safari, iPhone');
    expect(describeAgent('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36 Edg/140.0')).toBe('Edge, Windows');
    expect(describeAgent(null)).toBe('Bilinmeyen cihaz');
    expect(maskIp('85.105.12.34')).toBe('85.105.x.x');
    expect(maskIp('::ffff:10.0.0.7')).toBe('10.0.x.x');
    expect(maskIp('2a02:e0:1234::1')).toBe('2a02:e0:…');
    expect(maskEmail('ayse.yilmaz@ornek.com')).toBe('a•••@ornek.com');
  });

  it('Türkçe kısa ad', () => {
    expect(slugifyTr('Atatürk Ortaokulu')).toBe('ataturk-ortaokulu');
    expect(slugifyTr('İstanbul Işık Lisesi (Anadolu)')).toBe('istanbul-isik-lisesi-anadolu');
  });
});
