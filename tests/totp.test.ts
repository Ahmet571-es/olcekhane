import { describe, expect, it } from 'vitest';
import { sessionHasTwoFactor } from '@/lib/auth/session';
import { base32Decode, base32Encode, hotp, normalizeRecoveryCode, otpauthUri, totpStep, verifyTotp } from '@/lib/auth/totp';
import { hashRecoveryCode, newRecoveryCodes, openSecret, sealSecret } from '@/lib/auth/two-factor-crypto';

const RFC_KEY = Buffer.from('12345678901234567890', 'ascii');

describe('HOTP ve TOTP (RFC 4226 ve RFC 6238 test vektörleri)', () => {
  it('RFC 4226 HOTP değerleri', () => {
    const expected = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
    expected.forEach((code, counter) => expect(hotp(RFC_KEY, counter)).toBe(code));
  });

  it('RFC 6238 SHA-1 değerleri (8 hane)', () => {
    const vectors: [number, string][] = [
      [59, '94287082'],
      [1111111109, '07081804'],
      [1111111111, '14050471'],
      [1234567890, '89005924'],
      [2000000000, '69279037'],
      [20000000000, '65353130'],
    ];
    for (const [t, code] of vectors) expect(hotp(RFC_KEY, totpStep(t * 1000), 8)).toBe(code);
  });

  it('base32 kodlama gidiş-dönüş', () => {
    expect(base32Encode(RFC_KEY)).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
    expect(base32Decode('gezd gnbv gy3t qojq gezd gnbv gy3t qojq').toString('ascii')).toBe('12345678901234567890');
    const random = Buffer.from([0, 255, 1, 128, 7, 42, 99]);
    expect(base32Decode(base32Encode(random))).toEqual(random);
  });
});

describe('kod doğrulama', () => {
  const now = 1_790_000_000_000;
  const step = totpStep(now);

  it('bir önceki, şimdiki ve bir sonraki adımı kabul eder; daha uzağı reddeder', () => {
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step), null, now)).toBe(step);
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step - 1), null, now)).toBe(step - 1);
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step + 1), null, now)).toBe(step + 1);
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step - 2), null, now)).toBeNull();
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step + 2), null, now)).toBeNull();
  });

  it('kullanılmış adımı ve öncesini yeniden kabul etmez', () => {
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step), step, now)).toBeNull();
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step - 1), step, now)).toBeNull();
    expect(verifyTotp(RFC_KEY, hotp(RFC_KEY, step + 1), step, now)).toBe(step + 1);
  });

  it('biçimi bozuk kodu reddeder, boşlukları yok sayar', () => {
    const code = hotp(RFC_KEY, step);
    expect(verifyTotp(RFC_KEY, `${code.slice(0, 3)} ${code.slice(3)}`, null, now)).toBe(step);
    expect(verifyTotp(RFC_KEY, '12345', null, now)).toBeNull();
    expect(verifyTotp(RFC_KEY, 'abcdef', null, now)).toBeNull();
  });

  it('otpauth adresi', () => {
    const uri = otpauthUri('GEZDGNBVGY3TQOJQ', 'rehber@okul.test');
    expect(uri.startsWith('otpauth://totp/%C3%96l%C3%A7ekhane:rehber%40okul.test?')).toBe(true);
    const params = new URL(uri).searchParams;
    expect(params.get('secret')).toBe('GEZDGNBVGY3TQOJQ');
    expect(params.get('issuer')).toBe('Ölçekhane');
    expect(params.get('digits')).toBe('6');
    expect(params.get('period')).toBe('30');
  });
});

describe('oturumun iki aşamalı sayılması', () => {
  const enabled = new Date('2026-09-01T10:00:00Z');
  it('ikinci adım, doğrulamanın açıldığı an ya da sonrasında doğrulanmış olmalı', () => {
    expect(sessionHasTwoFactor(enabled, new Date('2026-09-01T10:00:00Z'))).toBe(true);
    expect(sessionHasTwoFactor(enabled, new Date('2026-09-02T08:00:00Z'))).toBe(true);
  });
  it('yalnızca şifreyle açılmış oturum, kullanıcı doğrulamayı sonradan açınca yükselmez', () => {
    expect(sessionHasTwoFactor(enabled, null)).toBe(false);
  });
  it('eski bir kurulumda doğrulanmış oturum, doğrulama yeniden kurulunca (ya da taşınınca) geçersiz sayılır', () => {
    expect(sessionHasTwoFactor(enabled, new Date('2026-08-20T09:00:00Z'))).toBe(false);
  });
  it('doğrulama kapalıysa oturum iki aşamalı değildir', () => {
    expect(sessionHasTwoFactor(null, new Date('2026-09-02T08:00:00Z'))).toBe(false);
  });
});

describe('sırrın şifrelenmesi ve kurtarma kodları', () => {
  it('şifreli sır açılır; her şifreleme farklıdır; değiştirilmiş veri reddedilir', () => {
    const a = sealSecret('GEZDGNBVGY3TQOJQ');
    const b = sealSecret('GEZDGNBVGY3TQOJQ');
    expect(a).not.toBe(b);
    expect(openSecret(a)).toBe('GEZDGNBVGY3TQOJQ');
    const parts = a.split('.');
    const ct = Buffer.from(parts[2], 'base64url');
    ct[0] ^= 1;
    parts[2] = ct.toString('base64url');
    expect(() => openSecret(parts.join('.'))).toThrow();
  });

  it('kurtarma kodları: 10 farklı kod, normalleştirilince özet eşleşir', () => {
    const { display, hashes } = newRecoveryCodes();
    expect(display).toHaveLength(10);
    expect(new Set(display).size).toBe(10);
    for (const [i, c] of display.entries()) {
      expect(c).toMatch(/^[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}$/);
      expect(hashRecoveryCode(normalizeRecoveryCode(c.toLowerCase())!)).toBe(hashes[i]);
    }
    expect(normalizeRecoveryCode('abc')).toBeNull();
    expect(normalizeRecoveryCode('K7PXM 3QD2A')).toBe('K7PXM3QD2A');
  });
});
