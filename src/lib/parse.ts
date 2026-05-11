import type { RawRating, Rating } from './types';

const MONTHS: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

export function parseRatingDate(raw: string): Date {
  const match = /^(\d{1,2})([A-Z]{3})(\d{4})$/.exec(raw.trim().toUpperCase());
  if (!match) throw new Error(`Unrecognised date format: ${raw}`);
  const [, dStr, mStr, yStr] = match;
  const month = MONTHS[mStr];
  if (month === undefined) throw new Error(`Unknown month: ${mStr}`);
  return new Date(Number(yStr), month, Number(dStr));
}

export function normaliseRating(raw: RawRating): Rating {
  return {
    date: parseRatingDate(raw.Date),
    store: raw.Store,
    end: raw['End (dry 0 - soft 10)'] ?? null,
    overall: raw.Overall ?? null,
    fylling: raw.Fylling ?? null,
  };
}

export function loadRatings(data: RawRating[]): Rating[] {
  return data
    .map(normaliseRating)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
