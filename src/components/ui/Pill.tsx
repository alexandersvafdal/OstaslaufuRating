import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function Pill({
  children,
  active,
  onClick,
  title,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all',
        active
          ? 'border-accent/40 bg-accent/15 text-accent shadow-soft'
          : 'border-border bg-surface text-muted hover:border-muted/40 hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}
