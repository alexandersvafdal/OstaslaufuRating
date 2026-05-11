import { useMemo } from 'react';
import type { Rating } from '../lib/types';

export type Filters = {
  start: Date | null;
  end: Date | null;
  stores: Set<string>;
};

export function useFilteredRatings(ratings: Rating[], filters: Filters): Rating[] {
  return useMemo(() => {
    return ratings.filter((r) => {
      if (filters.start && r.date.getTime() < filters.start.getTime()) return false;
      if (filters.end && r.date.getTime() > filters.end.getTime()) return false;
      if (filters.stores.size > 0 && !filters.stores.has(r.store)) return false;
      return true;
    });
  }, [ratings, filters.start, filters.end, filters.stores]);
}
