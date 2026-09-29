import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';

/** Tarayıcı kaynaklı isteklerde başka bir siteden gönderilmiş istekleri reddeder. */
export function sameOrigin(req: NextRequest): boolean {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}
