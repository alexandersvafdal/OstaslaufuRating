import { ThemeToggle } from './ThemeToggle';
import { PastryIcon } from './PastryIcon';

export function Header({ count }: { count: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-chart5/30 p-1 shadow-glow ring-1 ring-accent/30">
            <PastryIcon className="h-full w-full drop-shadow-[0_2px_3px_rgba(146,64,14,0.45)]" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight tracking-tight sm:text-lg">
              Ostaslaufa Rating Dashboard
            </h1>
            <p className="text-xs text-muted sm:text-sm">
              Tracking {count} ratings of Icelandic cheese pastries
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
