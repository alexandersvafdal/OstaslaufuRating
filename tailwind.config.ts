import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        chart1: 'rgb(var(--chart-1) / <alpha-value>)',
        chart2: 'rgb(var(--chart-2) / <alpha-value>)',
        chart3: 'rgb(var(--chart-3) / <alpha-value>)',
        chart4: 'rgb(var(--chart-4) / <alpha-value>)',
        chart5: 'rgb(var(--chart-5) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.25), 0 8px 30px -8px rgb(var(--accent) / 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
