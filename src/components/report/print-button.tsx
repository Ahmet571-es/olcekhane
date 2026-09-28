'use client';

export function PrintButton() {
  return (
    <button type="button" className="btn btn-secondary print:hidden" onClick={() => window.print()}>
      Yazdır ya da PDF olarak kaydet
    </button>
  );
}
