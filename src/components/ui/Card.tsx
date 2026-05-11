import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-surface/70 backdrop-blur-sm shadow-soft',
        'transition-colors',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-start justify-between gap-4 px-5 pt-5 pb-2', className)}>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-fg/80">{subtitle}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-5 pb-5 pt-3', className)}>{children}</div>;
}
