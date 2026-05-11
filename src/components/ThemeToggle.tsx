import { Moon, Sun, Monitor } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme, type ThemeMode } from '../hooks/useTheme';

const ICON: Record<ThemeMode, JSX.Element> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
};

const LABEL: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const modes: ThemeMode[] = ['light', 'system', 'dark'];

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5 shadow-soft">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          aria-label={`Use ${LABEL[m].toLowerCase()} theme`}
          title={`${LABEL[m]} theme`}
          onClick={() => setMode(m)}
          className={clsx(
            'inline-flex items-center justify-center rounded-full p-1.5 transition-all',
            mode === m
              ? 'bg-accent/15 text-accent'
              : 'text-muted hover:text-fg',
          )}
        >
          {ICON[m]}
        </button>
      ))}
    </div>
  );
}
