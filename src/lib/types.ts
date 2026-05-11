export type RawRating = {
  Date: string;
  Store: string;
  'End (dry 0 - soft 10)': number | null;
  Overall: number | null;
  Fylling: number | null;
};

export type Rating = {
  date: Date;
  store: string;
  end: number | null;
  overall: number | null;
  fylling: number | null;
};

export type Metric = 'overall' | 'end' | 'fylling';

export const METRIC_LABEL: Record<Metric, string> = {
  overall: 'Overall',
  end: 'Texture',
  fylling: 'Filling',
};

export const METRIC_DESCRIPTION: Record<Metric, string> = {
  overall: 'Combined overall score, 0–10',
  end: 'Bread texture (dry 0 — soft 10)',
  fylling: 'Cheese filling quality, 0–10',
};

export const METRICS: Metric[] = ['overall', 'end', 'fylling'];
