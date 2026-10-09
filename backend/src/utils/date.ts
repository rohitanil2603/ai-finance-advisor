// Accepts ISO (YYYY-MM-DD[THH:mm:ss]), DD/MM/YYYY, and DD-MM-YYYY — the formats most bank
// statement exports use — and falls back to the native Date parser for anything else.
export function parseFlexibleDate(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function toDateOnlyIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}
