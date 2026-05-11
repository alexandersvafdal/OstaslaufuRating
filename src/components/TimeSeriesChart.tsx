import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Pill } from './ui/Pill';
import type { Rating, Metric } from '../lib/types';
import { rollingMean, mean, nonNull } from '../lib/stats';
import { fmt, fmtDateShort } from '../lib/format';

type Series = { key: Metric; label: string; color: string };

const SERIES: Series[] = [
  { key: 'overall', label: 'Overall', color: 'rgb(var(--chart-1))' },
  { key: 'fylling', label: 'Filling', color: 'rgb(var(--chart-4))' },
  { key: 'end', label: 'Texture', color: 'rgb(var(--chart-2))' },
];

type ChartRow = {
  ts: number;
  dateLabel: string;
  store: string;
  overall: number | null;
  end: number | null;
  fylling: number | null;
  overall_r: number | null;
  end_r: number | null;
  fylling_r: number | null;
};

export function TimeSeriesChart({ ratings }: { ratings: Rating[] }) {
  const [smoothed, setSmoothed] = useState(false);
  const [active, setActive] = useState<Set<Metric>>(new Set(['overall', 'fylling', 'end']));

  const data: ChartRow[] = useMemo(() => {
    const overallRoll = rollingMean(ratings.map((r) => r.overall), 3);
    const endRoll = rollingMean(ratings.map((r) => r.end), 3);
    const fyllingRoll = rollingMean(ratings.map((r) => r.fylling), 3);
    return ratings.map((r, i) => ({
      ts: r.date.getTime(),
      dateLabel: fmtDateShort(r.date),
      store: r.store,
      overall: r.overall,
      end: r.end,
      fylling: r.fylling,
      overall_r: overallRoll[i],
      end_r: endRoll[i],
      fylling_r: fyllingRoll[i],
    }));
  }, [ratings]);

  const overallMean = useMemo(() => mean(nonNull(ratings.map((r) => r.overall))), [ratings]);

  const toggle = (k: Metric) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader
        title="Ratings over time"
        subtitle="Per-visit scores with optional 3-point rolling average."
        right={
          <div className="flex flex-wrap items-center gap-1.5">
            <Pill active={!smoothed} onClick={() => setSmoothed(false)}>Raw</Pill>
            <Pill active={smoothed} onClick={() => setSmoothed(true)}>Rolling avg</Pill>
          </div>
        }
      />
      <div className="flex flex-wrap items-center gap-1.5 px-5 pb-2">
        {SERIES.map((s) => (
          <Pill key={s.key} active={active.has(s.key)} onClick={() => toggle(s.key)}>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </Pill>
        ))}
      </div>
      <CardBody>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="ts"
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
                tickFormatter={(v) => fmtDateShort(new Date(v))}
                minTickGap={28}
              />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} width={32} />
              <Tooltip
                labelFormatter={(v) => fmtDateShort(new Date(v as number))}
                formatter={(value, name) => [
                  value == null ? '—' : fmt(value as number),
                  name as string,
                ]}
                cursor={{ stroke: 'rgb(var(--muted) / 0.4)', strokeWidth: 1 }}
              />
              <Legend
                verticalAlign="bottom"
                height={26}
                wrapperStyle={{ paddingTop: 4 }}
              />
              {overallMean !== null && (
                <ReferenceLine
                  y={overallMean}
                  stroke="rgb(var(--muted) / 0.6)"
                  strokeDasharray="4 4"
                  label={{
                    value: `mean ${fmt(overallMean)}`,
                    position: 'insideTopRight',
                    fill: 'rgb(var(--muted))',
                    fontSize: 11,
                  }}
                />
              )}
              {SERIES.filter((s) => active.has(s.key)).map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={smoothed ? `${s.key}_r` : s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2.25}
                  dot={{ r: 3, strokeWidth: 0, fill: s.color }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: 'rgb(var(--surface))' }}
                  connectNulls
                  isAnimationActive
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

