import { useMemo } from 'react';
import { Star, Cookie, Droplet, Store as StoreIcon, Hash, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import type { Rating } from '../lib/types';
import { mean, nonNull } from '../lib/stats';
import { fmt, fmtDateShort, fmtRelative } from '../lib/format';

function Kpi({
  icon,
  label,
  value,
  sub,
  tone = 'default',
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'accent' | 'chart2' | 'chart3' | 'chart4' | 'chart5';
}) {
  const toneClass = {
    default: 'text-fg',
    accent: 'text-accent',
    chart2: 'text-chart2',
    chart3: 'text-chart3',
    chart4: 'text-chart4',
    chart5: 'text-chart5',
  }[tone];
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
        <span className={`${toneClass}`}>{icon}</span>
      </div>
      <div className={`mt-3 text-3xl font-semibold tracking-tight ${toneClass}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </Card>
  );
}

export function KpiCards({ ratings }: { ratings: Rating[] }) {
  const stats = useMemo(() => {
    const overall = mean(nonNull(ratings.map((r) => r.overall)));
    const end = mean(nonNull(ratings.map((r) => r.end)));
    const fylling = mean(nonNull(ratings.map((r) => r.fylling)));
    const stores = new Set(ratings.map((r) => r.store)).size;
    const sorted = [...ratings].sort((a, b) => b.date.getTime() - a.date.getTime());
    const latest = sorted[0];
    return { overall, end, fylling, stores, latest };
  }, [ratings]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
      <Kpi icon={<Hash className="h-4 w-4" />} label="Ratings" value={String(ratings.length)} sub="data points" />
      <Kpi
        icon={<Star className="h-4 w-4" />}
        label="Avg Overall"
        value={fmt(stats.overall)}
        sub="combined score"
        tone="accent"
      />
      <Kpi
        icon={<Droplet className="h-4 w-4" />}
        label="Avg Filling"
        value={fmt(stats.fylling)}
        sub="cheese filling"
        tone="chart4"
      />
      <Kpi
        icon={<Cookie className="h-4 w-4" />}
        label="Avg Texture"
        value={fmt(stats.end)}
        sub="bread, dry 0 — soft 10"
        tone="chart2"
      />
      <Kpi icon={<StoreIcon className="h-4 w-4" />} label="Stores" value={String(stats.stores)} sub="covered" tone="chart3" />
      <Kpi
        icon={<Clock className="h-4 w-4" />}
        label="Latest"
        value={stats.latest ? fmt(stats.latest.overall) : '—'}
        sub={stats.latest ? `${fmtDateShort(stats.latest.date)} · ${fmtRelative(stats.latest.date)}` : 'no data'}
        tone="chart5"
      />
    </div>
  );
}
