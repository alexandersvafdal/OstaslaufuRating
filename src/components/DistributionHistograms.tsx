import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Card, CardBody, CardHeader } from './ui/Card';
import type { Rating, Metric } from '../lib/types';
import { METRIC_LABEL, METRICS } from '../lib/types';
import { histogram, mean, median, nonNull } from '../lib/stats';
import { fmt } from '../lib/format';

const COLOR: Record<Metric, string> = {
  overall: 'rgb(var(--chart-1))',
  end: 'rgb(var(--chart-2))',
  fylling: 'rgb(var(--chart-4))',
};

function MetricHistogram({ ratings, metric }: { ratings: Rating[]; metric: Metric }) {
  const data = useMemo(() => {
    const values = nonNull(ratings.map((r) => r[metric]));
    const bins = histogram(values, 10, 0, 10);
    return {
      bins: bins.map((b) => ({
        label: `${b.lo.toFixed(0)}–${b.hi.toFixed(0)}`,
        count: b.count,
        center: (b.lo + b.hi) / 2,
      })),
      mean: mean(values),
      median: median(values),
      count: values.length,
    };
  }, [ratings, metric]);

  const color = COLOR[metric];

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <h4 className="text-sm font-semibold">{METRIC_LABEL[metric]}</h4>
          <p className="text-xs text-muted">
            n={data.count} · mean {fmt(data.mean)} · median {fmt(data.median)}
          </p>
        </div>
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.bins} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} width={28} />
            <Tooltip
              cursor={{ fill: 'rgb(var(--muted) / 0.08)' }}
              formatter={(v: number) => [v, 'count']}
              labelFormatter={(l) => `Score ${l}`}
            />
            {data.mean !== null && (
              <ReferenceLine
                x={data.bins[Math.min(9, Math.max(0, Math.floor(data.mean)))].label}
                stroke="rgb(var(--muted) / 0.7)"
                strokeDasharray="3 3"
                label={{ value: 'μ', position: 'top', fill: 'rgb(var(--muted))', fontSize: 11 }}
              />
            )}
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {data.bins.map((b, i) => (
                <Cell key={i} fill={color} fillOpacity={b.count === 0 ? 0.15 : 0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DistributionHistograms({ ratings }: { ratings: Rating[] }) {
  return (
    <Card>
      <CardHeader
        title="Distributions"
        subtitle="How ratings cluster across the 0 – 10 scale."
      />
      <CardBody>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {METRICS.map((m) => (
            <MetricHistogram key={m} ratings={ratings} metric={m} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
