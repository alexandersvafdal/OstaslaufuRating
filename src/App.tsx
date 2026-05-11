import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { KpiCards } from './components/KpiCards';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { DistributionHistograms } from './components/DistributionHistograms';
import { CorrelationScatter } from './components/CorrelationScatter';
import { StoreComparison } from './components/StoreComparison';
import { StatsPanel } from './components/StatsPanel';
import { RecentRatingsTable } from './components/RecentRatingsTable';
import { Footer } from './components/Footer';
import { useFilteredRatings, type Filters as FilterState } from './hooks/useFilteredRatings';
import { loadRatings } from './lib/parse';
import type { RawRating } from './lib/types';
import rawData from './data/ratings.json';

export default function App() {
  const ratings = useMemo(() => loadRatings(rawData as RawRating[]), []);
  const allStores = useMemo(
    () => Array.from(new Set(ratings.map((r) => r.store))).sort(),
    [ratings],
  );
  const latest = ratings.length ? ratings[ratings.length - 1].date : new Date();

  const [filters, setFilters] = useState<FilterState>({
    start: null,
    end: null,
    stores: new Set<string>(),
  });

  const filtered = useFilteredRatings(ratings, filters);

  return (
    <div className="min-h-full">
      <Header count={ratings.length} />
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <Filters
          allStores={allStores}
          filters={filters}
          setFilters={setFilters}
          latest={latest}
        />

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center text-muted">
            No ratings match the current filters.
          </div>
        ) : (
          <>
            <KpiCards ratings={filtered} />
            <TimeSeriesChart ratings={filtered} />
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CorrelationScatter ratings={filtered} />
              </div>
              <StoreComparison ratings={filtered} />
            </div>
            <DistributionHistograms ratings={filtered} />
            <StatsPanel ratings={filtered} />
            <RecentRatingsTable ratings={filtered} />
          </>
        )}
      </main>
      <Footer lastUpdated={ratings.length ? ratings[ratings.length - 1].date : null} />
    </div>
  );
}
