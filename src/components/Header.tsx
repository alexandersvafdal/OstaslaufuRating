import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header({ count }: { count: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent/90 to-chart5/70 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
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
