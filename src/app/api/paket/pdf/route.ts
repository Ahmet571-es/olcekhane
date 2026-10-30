import type { NextRequest } from 'next/server';
import { packagePdfResponse } from '@/lib/assessment/http';

/** Kendini Tanı Paketi'nin tek PDF'i: paketteki testlerin cevaplarından bellekte üretilir ve doğrudan indirilir. Hiçbir şey kaydedilmez. */
export async function POST(req: NextRequest) {
  return packagePdfResponse(req);
}
