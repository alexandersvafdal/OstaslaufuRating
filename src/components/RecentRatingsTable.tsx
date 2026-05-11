import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Card, CardBody, CardHeader } from './ui/Card';
import type { Rating } from '../lib/types';
import { fmt, fmtDate } from '../lib/format';

type Col = 'date' | 'store' | 'overall' | 'fylling' | 'end';
type SortDir = 'asc' | 'desc';

const STOP_LOW = [239, 68, 68];     // red-500
const STOP_MID = [250, 204, 21];    // yellow-400
const STOP_HIGH = [34, 197, 94];    // green-500

function ratingColor(value: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, value / 10));
  const [from, to, k] = t < 0.5
    ? [STOP_LOW, STOP_MID, t * 2]
    : [STOP_MID, STOP_HIGH, (t - 0.5) * 2];
  return [
    Math.round(from[0] + (to[0] - from[0]) * k),
    Math.round(from[1] + (to[1] - from[1]) * k),
    Math.round(from[2] + (to[2] - from[2]) * k),
  ];
}

function metricCell(value: number | null, emphasized = false) {
  if (value === null) return <span className="text-muted">—</span>;
  const [r, g, b] = ratingColor(value);
  return (
    <span
      className={`inline-flex min-w-[2.5rem] justify-center rounded-md px-2 py-0.5 font-mono tabular-nums ${
        emphasized ? 'text-sm font-semibold' : 'text-xs'
      }`}
      style={{ backgroundColor: `rgb(${r} ${g} ${b} / 0.2)`, color: `rgb(${r} ${g} ${b})` }}
    >
      {fmt(value)}
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
  return dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
}

export function RecentRatingsTable({ ratings }: { ratings: Rating[] }) {
  const [sort, setSort] = useState<Col>('date');
  const [dir, setDir] = useState<SortDir>('desc');

  const sorted = useMemo(() => {
    const sign = dir === 'asc' ? 1 : -1;
    return [...ratings].sort((a, b) => {
      const va = sort === 'date' ? a.date.getTime() : sort === 'store' ? a.store : (a[sort] ?? -Infinity);
      const vb = sort === 'date' ? b.date.getTime() : sort === 'store' ? b.store : (b[sort] ?? -Infinity);
      if (typeof va === 'string' && typeof vb === 'string') return sign * va.localeCompare(vb);
      return sign * ((va as number) - (vb as number));
    });
  }, [ratings, sort, dir]);

  const toggle = (col: Col) => {
    if (col === sort) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSort(col);
      setDir(col === 'date' ? 'desc' : 'desc');
    }
  };

  const Th = ({ col, label, align = 'left' }: { col: Col; label: string; align?: 'left' | 'right' }) => (
    <th
      onClick={() => toggle(col)}
      className={`cursor-pointer select-none px-3 py-2 text-xs uppercase tracking-wider text-muted hover:text-fg ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
        {label} <SortIcon active={sort === col} dir={dir} />
      </span>
    </th>
  );

  return (
    <Card>
      <CardHeader
        title="All ratings"
        subtitle={`${ratings.length} entr${ratings.length === 1 ? 'y' : 'ies'} · click any column to sort.`}
      />
      <CardBody>
        <div className="overflow-x-auto scroll-soft">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <Th col="date" label="Date" />
                <Th col="store" label="Store" />
                <Th col="fylling" label="Filling" align="right" />
                <Th col="end" label="Texture" align="right" />
                <Th col="overall" label="Overall" align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((r, i) => (
                <tr key={i} className="hover:bg-bg/40">
                  <td className="px-3 py-2 font-mono text-xs tabular-nums">{fmtDate(r.date)}</td>
                  <td className="px-3 py-2">{r.store}</td>
                  <td className="px-3 py-2 text-right">{metricCell(r.fylling)}</td>
                  <td className="px-3 py-2 text-right">{metricCell(r.end)}</td>
                  <td className="px-3 py-2 text-right">{metricCell(r.overall, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
