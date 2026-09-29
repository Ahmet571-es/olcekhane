import { DrizzleQueryError } from 'drizzle-orm';
import { describe, expect, it, vi } from 'vitest';
import { errorSummary, installLogSanitizer, sanitizeForLog } from '@/lib/log';

describe('günlüğe yazılan hata özeti', () => {
  it('sorgu hatasında parametreleri ve ayrıntı satırını yazmaz', () => {
    const cause = Object.assign(new Error('duplicate key value violates unique constraint "users_email_uq"'), {
      code: '23505',
      detail: 'Key (email)=(veli@ornek.com) already exists.',
    });
    const err = new DrizzleQueryError('insert into "users" ("email", "full_name")\n  values ($1, $2)', ['veli@ornek.com', 'Ayşe Yılmaz'], cause);
    expect(err.message).toContain('veli@ornek.com'); // Drizzle'ın kendi iletisi parametreleri taşır
    const s = errorSummary(err);
    expect(s).not.toContain('veli@ornek.com');
    expect(s).not.toContain('Ayşe');
    expect(s).toContain('23505');
    expect(s).toContain('users_email_uq');
    expect(s).toContain('insert into "users" ("email", "full_name") values ($1, $2)');
  });

  it('diğer hatalarda adı ve iletiyi kısaltarak verir', () => {
    expect(errorSummary(new TypeError('x'.repeat(1000)))).toHaveLength(500);
    expect(errorSummary('düz metin')).toBe('düz metin');
  });

  it('console.error sorgu hatasını parametresiz yazar; diğer değerlere dokunmaz', () => {
    const cause = Object.assign(new Error('duplicate key value violates unique constraint "users_email_uq"'), {
      code: '23505',
      detail: 'Key (email)=(veli@ornek.com) already exists.',
    });
    const err = Object.assign(new DrizzleQueryError('insert into "users" ("email") values ($1)', ['veli@ornek.com'], cause), { digest: '123' });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      installLogSanitizer();
      console.error('⨯', err, 'düz metin');
      const [prefix, logged, text] = spy.mock.calls[0];
      expect(prefix).toBe('⨯');
      expect(text).toBe('düz metin');
      expect(logged).toBeInstanceOf(Error);
      const e = logged as Error & { digest?: string; cause?: unknown };
      expect(`${e.message}\n${e.stack}`).not.toContain('veli@ornek.com');
      expect(e.message).toContain('23505');
      expect(e.digest).toBe('123');
      expect(e.cause).toBeUndefined();
      expect(e.stack).toMatch(/\n\s+at /);
    } finally {
      spy.mockRestore();
    }
    const plain = new Error('sıradan');
    expect(sanitizeForLog(plain)).toBe(plain);
  });
});
