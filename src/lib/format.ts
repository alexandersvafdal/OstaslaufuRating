export function fmt(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toFixed(digits);
}

export function fmtSigned(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const s = value.toFixed(digits);
  return value > 0 ? `+${s}` : s;
}

const DATE_FMT = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const SHORT_FMT = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });

export function fmtDate(date: Date): string {
  return DATE_FMT.format(date);
}

export function fmtDateShort(date: Date): string {
  return SHORT_FMT.format(date);
}

export function fmtRelative(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  if (days < 365) return `${Math.round(days / 30)} months ago`;
  return `${Math.round(days / 365)} years ago`;
}
