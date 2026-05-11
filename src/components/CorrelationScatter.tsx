import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Pill } from './ui/Pill';
import type { Rating, Metric } from '../lib/types';
import { METRIC_LABEL } from '../lib/types';
import { pearson, linearRegression } from '../lib/stats';
import { fmt, fmtDateShort } from '../lib/format';

type Pair = { x: Metric; y: Metric };

const PAIRS: { key: string; pair: Pair; title: string }[] = [
  { key: 'end-overall', pair: { x: 'end', y: 'overall' }, title: 'Texture vs Overall' },
  { key: 'fylling-overall', pair: { x: 'fylling', y: 'overall' }, title: 'Filling vs Overall' },
  { key: 'end-fylling', pair: { x: 'end', y: 'fylling' }, title: 'Texture vs Filling' },
];

function fyllingTone(v: number | null | undefined): string {
  if (v === null || v === undefined) return 'rgb(var(--muted) / 0.4)';
  const t = Math.max(0, Math.min(1, v / 10));
  const lo = [56, 189, 248];
  const hi = [251, 146, 60];
  const r = Math.round(lo[0] + (hi[0] - lo[0]) * t);
  const g = Math.round(lo[1] + (hi[1] - lo[1]) * t);
  const b = Math.round(lo[2] + (hi[2] - lo[2]) * t);
  return `rgb(${r} ${g} ${b})`;
}

export function CorrelationScatter({ ratings }: { ratings: Rating[] }) {
  const [activeKey, setActiveKey] = useState(PAIRS[0].key);
  const active = PAIRS.find((p) => p.key === activeKey)!.pair;

  const { points, r, fit } = useMemo(() => {
    const valid = ratings.filter((rt) => rt[active.x] !== null && rt[active.y] !== null);
    const xs = valid.map((rt) => rt[active.x] as number);
    const ys = valid.map((rt) => rt[active.y] as number);
    return {
      points: valid.map((rt) => ({
        x: rt[active.x] as number,
        y: rt[active.y] as number,
        z: rt.fylling ?? 5,
        date: fmtDateShort(rt.date),
        store: rt.store,
        fylling: rt.fylling,
        overall: rt.overall,
        end: rt.end,
      })),
      r: pearson(xs, ys),
      fit: linearRegression(xs, ys),
    };
  }, [ratings, active]);

  const rLabel = r === null ? '—' : r.toFixed(2);
  const rStrength = r === null ? '' : Math.abs(r) > 0.7 ? 'strong' : Math.abs(r) > 0.4 ? 'moderate' : 'weak';

  return (
    <Card>
      <CardHeader
        title="Correlations"
        subtitle="Point colour and size encode Filling — see how the cheese filling drives the relationship."
        right={
          <div className="flex flex-wrap gap-1.5">
            {PAIRS.map((p) => (
              <Pill key={p.key} active={p.key === activeKey} onClick={() => setActiveKey(p.key)}>
                {p.title}
              </Pill>
            ))}
          </div>
        }
      />
      <CardBody>
        <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <span className="text-muted">Pearson r</span>
          <span className="text-2xl font-semibold tracking-tight">{rLabel}</span>
          <span className="text-xs uppercase tracking-wider text-muted">{rStrength}</span>
          {fit && (
            <span className="text-xs text-muted">
              · ŷ = {fit.slope.toFixed(2)}x + {fit.intercept.toFixed(2)}
            </span>
          )}
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 18, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={METRIC_LABEL[active.x]}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                label={{
                  value: METRIC_LABEL[active.x],
                  position: 'insideBottom',
                  offset: -2,
                  fill: 'rgb(var(--muted))',
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={METRIC_LABEL[active.y]}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                width={32}
                label={{
                  value: METRIC_LABEL[active.y],
                  angle: -90,
                  position: 'insideLeft',
                  offset: 16,
                  fill: 'rgb(var(--muted))',
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="z" range={[40, 240]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active: act, payload }) => {
                  if (!act || !payload?.length) return null;
                  const p = payload[0].payload as {
                    date: string;
                    store: string;
                    overall: number | null;
                    end: number | null;
                    fylling: number | null;
                  };
                  return (
                    <div className="rounded-lg border border-border bg-elevated px-3 py-2 text-xs shadow-soft">
                      <div className="font-semibold">{p.date}</div>
                      <div className="mb-1 text-muted">{p.store}</div>
                      <div>Overall: <span className="font-mono">{fmt(p.overall)}</span></div>
                      <div>Texture: <span className="font-mono">{fmt(p.end)}</span></div>
                      <div>Filling: <span className="font-mono">{fmt(p.fylling)}</span></div>
                    </div>
                  );
                }}
              />
              {fit && (
                <ReferenceLine
                  segment={[
                    { x: 0, y: fit.intercept },
                    { x: 10, y: fit.intercept + fit.slope * 10 },
                  ]}
                  stroke="rgb(var(--accent) / 0.7)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  ifOverflow="hidden"
                />
              )}
              <Scatter data={points}>
                {points.map((p, i) => (
                  <Cell key={i} fill={fyllingTone(p.fylling)} fillOpacity={0.85} stroke="rgb(var(--surface))" strokeWidth={1} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>Filling</span>
          <div
            className="h-2 w-36 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgb(56 189 248), rgb(251 146 60))',
            }}
          />
          <span>0 → 10</span>
        </div>
      </CardBody>
    </Card>
  );
}
