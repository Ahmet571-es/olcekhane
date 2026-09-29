import { DrizzleQueryError } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { errorSummary } from '@/lib/log';

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
});
