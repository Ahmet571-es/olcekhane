import { describe, expect, it } from 'vitest';
import { ipBucket } from '@/lib/ip';
import { errorSummary } from '@/lib/log';
import { nearestBand } from '@/lib/reports/bands';
import { clientIpFrom } from '@/lib/request';
import { slugifyTr } from '@/lib/slug';

describe('istemci adresi', () => {
  it('X-Forwarded-For başlığında vekilin eklediği son değer kullanılır', () => {
    expect(clientIpFrom(new Headers({ 'x-forwarded-for': '10.0.0.1, 203.0.113.9' }))).toBe('203.0.113.9');
    expect(clientIpFrom(new Headers({ 'x-forwarded-for': ' 203.0.113.9 ' }))).toBe('203.0.113.9');
    expect(clientIpFrom(new Headers({ 'x-real-ip': '203.0.113.10' }))).toBe('203.0.113.10');
    expect(clientIpFrom(new Headers())).toBeNull();
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
  it('hata özeti yalnızca tür ve ileti taşır, uzun iletileri kısaltır', () => {
    expect(errorSummary(new TypeError('olmadı'))).toBe('TypeError: olmadı');
    expect(errorSummary('düz metin')).toBe('düz metin');
    expect(errorSummary(new Error('x'.repeat(1000))).length).toBe(300);
  });

  it('Türkçe kısa ad', () => {
    expect(slugifyTr('Sınav Kaygısı ile Başa Çıkmak')).toBe('sinav-kaygisi-ile-basa-cikmak');
    expect(slugifyTr('İstanbul Işık Lisesi (Anadolu)')).toBe('istanbul-isik-lisesi-anadolu');
  });

  it('norm varken oluşan uç düzeyler üç düzeyli şablonlarda en yakın düzeye iner', () => {
    const three = (b: string) => ['low', 'average', 'high'].includes(b);
    expect(nearestBand('very_high', three)).toBe('high');
    expect(nearestBand('very_low', three)).toBe('low');
    expect(nearestBand('average', three)).toBe('average');
    expect(nearestBand('very_high', () => true)).toBe('very_high');
  });
});
