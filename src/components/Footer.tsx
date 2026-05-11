import { Github } from 'lucide-react';

export function Footer({ lastUpdated }: { lastUpdated: Date | null }) {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
        <div>
          Source data lives in <code className="rounded bg-surface px-1.5 py-0.5">src/data/ratings.json</code>
          {lastUpdated && (
            <span>
              {' '}· latest entry {lastUpdated.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <a
          href="https://github.com/alexandersvafdal/OstaslaufuRating"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-muted/40 hover:text-fg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-3.5 w-3.5" /> alexandersvafdal/OstaslaufuRating
        </a>
      </div>
    </footer>
  );
}
