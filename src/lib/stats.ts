export function nonNull(values: (number | null | undefined)[]): number[] {
  return values.filter((v): v is number => v !== null && v !== undefined && !Number.isNaN(v));
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function std(values: number[]): number | null {
  if (values.length < 2) return null;
  const m = mean(values)!;
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function min(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.min(...values);
}

export function max(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.max(...values);
}

export function quantile(values: number[], q: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1];
  return next !== undefined ? sorted[base] + rest * (next - sorted[base]) : sorted[base];
}

export type Summary = {
  count: number;
  mean: number | null;
  median: number | null;
  std: number | null;
  min: number | null;
  max: number | null;
  p25: number | null;
  p75: number | null;
  iqr: number | null;
};

export function summarise(values: number[]): Summary {
  const p25 = quantile(values, 0.25);
  const p75 = quantile(values, 0.75);
  return {
    count: values.length,
    mean: mean(values),
    median: median(values),
    std: std(values),
    min: min(values),
    max: max(values),
    p25,
    p75,
    iqr: p25 !== null && p75 !== null ? p75 - p25 : null,
  };
}

export function pearson(xs: number[], ys: number[]): number | null {
  if (xs.length !== ys.length || xs.length < 2) return null;
  const mx = mean(xs)!;
  const my = mean(ys)!;
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? null : num / denom;
}

export function linearRegression(xs: number[], ys: number[]): { slope: number; intercept: number } | null {
  if (xs.length !== ys.length || xs.length < 2) return null;
  const mx = mean(xs)!;
  const my = mean(ys)!;
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  if (den === 0) return null;
  const slope = num / den;
  return { slope, intercept: my - slope * mx };
}

export function rollingMean(values: (number | null)[], window: number): (number | null)[] {
  return values.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1).filter((v): v is number => v !== null);
    if (slice.length === 0) return null;
    return slice.reduce((s, v) => s + v, 0) / slice.length;
  });
}

export function histogram(values: number[], binCount: number, lo = 0, hi = 10): { bin: number; lo: number; hi: number; count: number }[] {
  const width = (hi - lo) / binCount;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    bin: i,
    lo: lo + i * width,
    hi: lo + (i + 1) * width,
    count: 0,
  }));
  for (const v of values) {
    if (Number.isNaN(v)) continue;
    let idx = Math.floor((v - lo) / width);
    if (idx === binCount) idx = binCount - 1;
    if (idx >= 0 && idx < binCount) bins[idx].count += 1;
  }
  return bins;
}
