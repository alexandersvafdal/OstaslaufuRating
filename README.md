# Ostaslaufa Rating Dashboard

Interactive dashboard tracking ratings of Ostaslaufa (Icelandic cheese pastries) across grocery stores. Built with Vite + React + TypeScript + Tailwind CSS + Recharts.

Live: <https://alexandersvafdal.github.io/OstaslaufuRating/>

## What's in it

Three rating dimensions:

- **Filling** — cheese filling quality, 0–10.
- **Texture** — bread texture, dry 0 → soft 10.
- **Overall** — combined overall score, 0–10.

Features:

- **KPI cards** — total ratings, mean Overall / Filling / Texture, store count, latest rating.
- **Time series** — multi-line chart with toggleable series and an optional 3-point rolling average.
- **Distributions** — histograms of every metric across the 0–10 scale with mean markers.
- **Correlations** — Pearson r and best-fit line for any pair of metrics; point color and size encode Filling.
- **Store comparison** — grouped bar chart of mean metrics per store.
- **Summary stats** — n, mean, median, std, min/max, P25/P75, IQR per metric.
- **Sortable table** — all ratings with conditionally color-graded cells.
- **Filters** — date-range presets and store multi-select; all sections react.
- **Dark mode** — three-state toggle (light / system / dark), persisted to `localStorage`.

## Adding new ratings

Edit `src/data/ratings.json`. Each entry is:

```json
{
  "Date": "11MAY2026",
  "Store": "Krambúðin HR",
  "End (dry 0 - soft 10)": 6,
  "Overall": 6.5,
  "Fylling": 7
}
```

`Fylling` (the Icelandic JSON key for filling) may be `null` if not recorded. Push to `main` and the GitHub Action rebuilds and redeploys the site.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into ./dist
npm run preview   # serve the production build locally
```

## Deployment

A workflow at `.github/workflows/deploy.yml` builds on every push to `main` and deploys via `actions/deploy-pages`. On first setup, go to **Settings → Pages** in the GitHub repo and set the source to **GitHub Actions**.

The Vite config's `base: '/OstaslaufuRating/'` keeps asset paths working under the Pages subpath. If you fork or rename the repo, update both `vite.config.ts` and the URL in `src/components/Footer.tsx`.
