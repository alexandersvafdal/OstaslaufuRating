import { Store, Calendar, X } from 'lucide-react';
import { Pill } from './ui/Pill';
import { Card } from './ui/Card';
import { fmtDateShort } from '../lib/format';
import type { Filters as FilterState } from '../hooks/useFilteredRatings';

type PresetKey = 'all' | '30d' | '90d' | '180d' | 'ytd';

const PRESET_LABEL: Record<PresetKey, string> = {
  all: 'All',
  '30d': '30 days',
  '90d': '90 days',
  '180d': '180 days',
  ytd: 'YTD',
};

function computePreset(key: PresetKey, latest: Date): { start: Date | null; end: Date | null } {
  if (key === 'all') return { start: null, end: null };
  const end = latest;
  const start = new Date(end);
  if (key === '30d') start.setDate(start.getDate() - 30);
  else if (key === '90d') start.setDate(start.getDate() - 90);
  else if (key === '180d') start.setDate(start.getDate() - 180);
  else if (key === 'ytd') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: null };
}

export function Filters({
  allStores,
  filters,
  setFilters,
  latest,
}: {
  allStores: string[];
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  latest: Date;
}) {
  const activePreset: PresetKey | null = (() => {
    if (!filters.start && !filters.end) return 'all';
    return null;
  })();

  const applyPreset = (key: PresetKey) => {
    const { start, end } = computePreset(key, latest);
    setFilters({ ...filters, start, end });
  };

  const toggleStore = (store: string) => {
    const next = new Set(filters.stores);
    if (next.has(store)) next.delete(store);
    else next.add(store);
    setFilters({ ...filters, stores: next });
  };

  const reset = () => setFilters({ start: null, end: null, stores: new Set() });
  const hasActive = filters.start || filters.end || filters.stores.size > 0;

  return (
    <Card className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted">Range</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(PRESET_LABEL) as PresetKey[]).map((k) => (
            <Pill key={k} active={activePreset === k} onClick={() => applyPreset(k)}>
              {PRESET_LABEL[k]}
            </Pill>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {filters.start && (
            <span className="text-xs text-muted">
              from {fmtDateShort(filters.start)}
              {filters.end ? ` to ${fmtDateShort(filters.end)}` : ''}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted">Store</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Pill active={filters.stores.size === 0} onClick={() => setFilters({ ...filters, stores: new Set() })}>
            All stores
          </Pill>
          {allStores.map((s) => (
            <Pill key={s} active={filters.stores.has(s)} onClick={() => toggleStore(s)}>
              {s}
            </Pill>
          ))}
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-fg"
          >
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>
    </Card>
  );
}
