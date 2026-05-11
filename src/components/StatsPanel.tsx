import { useMemo } from 'react';
import { Card, CardBody, CardHeader } from './ui/Card';
import type { Rating, Metric } from '../lib/types';
import { METRIC_DESCRIPTION, METRIC_LABEL, METRICS } from '../lib/types';
import { nonNull, summarise } from '../lib/stats';
import { fmt } from '../lib/format';

const COLOR: Record<Metric, string> = {
  overall: 'rgb(var(--chart-1))',
  end: 'rgb(var(--chart-2))',
  fylling: 'rgb(var(--chart-4))',
};

const STAT_KEYS = ['count', 'mean', 'median', 'std', 'min', 'p25', 'p75', 'max', 'iqr'] as const;
const STAT_LABEL: Record<(typeof STAT_KEYS)[number], string> = {
  count: 'n',
  mean: 'Mean',
  median: 'Median',
  std: 'Std',
  min: 'Min',
  p25: 'P25',
  p75: 'P75',
  max: 'Max',
  iqr: 'IQR',
};

export function StatsPanel({ ratings }: { ratings: Rating[] }) {
  const summaries = useMemo(() => {
    return METRICS.map((m) => ({ metric: m, summary: summarise(nonNull(ratings.map((r) => r[m]))) }));
  }, [ratings]);

  return (
    <Card>
      <CardHeader title="Summary statistics" subtitle="Quartiles, dispersion, and central tendency for each metric." />
      <CardBody>
        <div className="overflow-x-auto scroll-soft">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="py-2 pr-4 font-medium">Metric</th>
                {STAT_KEYS.map((k) => (
                  <th key={k} className="py-2 px-3 text-right font-medium">{STAT_LABEL[k]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summaries.map(({ metric, summary }) => (
                <tr key={metric}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: COLOR[metric] }} />
                      <div>
                        <div className="font-medium">{METRIC_LABEL[metric]}</div>
                        <div className="text-xs text-muted">{METRIC_DESCRIPTION[metric]}</div>
                      </div>
                    </div>
                  </td>
                  {STAT_KEYS.map((k) => {
                    const v = summary[k] as number | null;
                    return (
                      <td key={k} className="py-3 px-3 text-right font-mono tabular-nums">
                        {k === 'count' ? (v ?? 0) : fmt(v, k === 'std' || k === 'iqr' ? 2 : 1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
