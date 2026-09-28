export function formatCurrency(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  if (val >= 1_000_000_000) {
    const b = val / 1_000_000_000;
    return `$${b.toFixed(2)}B`;
  }
  if (val >= 1_000_000) {
    const m = val / 1_000_000;
    // If exact whole million, e.g. $9.0M; if tenths, $1.5M; if hundredths, $1.97M
    return `$${m >= 10 ? m.toFixed(1) : m.toFixed(2)}M`;
  }
  if (val >= 1_000) {
    const k = val / 1_000;
    return `$${k.toFixed(0)}K`;
  }
  return `$${val.toLocaleString()}`;
}

export function formatCurrencyExact(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  return `$${val.toLocaleString()}`;
}
