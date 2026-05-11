import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardBody, CardHeader } from './ui/Card';
import type { Rating, Metric } from '../lib/types';
import { METRIC_LABEL, METRICS } from '../lib/types';
import { mean, nonNull } from '../lib/stats';
import { fmt } from '../lib/format';

const COLOR: Record<Metric, string> = {
  overall: 'rgb(var(--chart-1))',
  end: 'rgb(var(--chart-2))',
  fylling: 'rgb(var(--chart-4))',
};

type Row = {
  store: string;
  count: number;
  overall: number | null;
  end: number | null;
  fylling: number | null;
};

export function StoreComparison({ ratings }: { ratings: Rating[] }) {
  const data: Row[] = useMemo(() => {
    const grouped = new Map<string, Rating[]>();
    for (const r of ratings) {
      const arr = grouped.get(r.store) ?? [];
      arr.push(r);
      grouped.set(r.store, arr);
    }
    return Array.from(grouped.entries())
      .map(([store, rows]) => ({
        store,
        count: rows.length,
        overall: mean(nonNull(rows.map((r) => r.overall))),
        end: mean(nonNull(rows.map((r) => r.end))),
        fylling: mean(nonNull(rows.map((r) => r.fylling))),
      }))
      .sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0));
  }, [ratings]);

  return (
    <Card>
      <CardHeader title="Store comparison" subtitle="Mean score per metric, by store." />
      <CardBody>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="store" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} width={32} />
              <Tooltip
                cursor={{ fill: 'rgb(var(--muted) / 0.08)' }}
                formatter={(value, name) => [
                  value == null ? '—' : fmt(value as number),
                  name as string,
                ]}
                labelFormatter={(label, payload) => {
                  const row = payload?.[0]?.payload as Row | undefined;
                  return row ? `${row.store} · ${row.count} rating${row.count === 1 ? '' : 's'}` : (label as string);
                }}
              />
              <Legend verticalAlign="top" height={26} />
              {METRICS.map((m) => (
                <Bar key={m} dataKey={m} name={METRIC_LABEL[m]} fill={COLOR[m]} radius={[6, 6, 0, 0]} maxBarSize={40} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.map((row) => (
            <div key={row.store} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg/40 px-3 py-2 text-xs">
              <span className="truncate font-medium">{row.store}</span>
              <span className="shrink-0 whitespace-nowrap text-muted">
                {row.count} rating{row.count === 1 ? '' : 's'} · Overall {fmt(row.overall)}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
