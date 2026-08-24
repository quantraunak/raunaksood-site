# raunaksood.vercel.app

Personal site and project write-ups. Next.js, TypeScript, Tailwind v4, no chart library —
every figure is hand-built inline SVG so the page ships no third-party JS and the marks
inherit the same colour tokens as the text.

## Data provenance

`public/data/quant.json` is generated from a backtest run directory in
[ls-multifactor-research](https://github.com/quantraunak/ls-multifactor-research); the build
reads it rather than restating numbers by hand, and every page that shows a figure also shows
the run id it came from. Numbers on this site are therefore traceable to a specific run rather
than transcribed from a notebook.

`public/data/reasoning.json` transcribes the tables from the Resampled Thought Trees paper.

## Run

```bash
npm install
npm run dev
npm run build
```

## Layout

```
app/
  page.tsx              index
  work/quant/           equity research case study
  work/reasoning/       LLM reasoning case study
  work/melange/         product case study
  sitemap.ts
components/
  charts.tsx            SVG primitives: equity curve, bars, dot spread
  quant-panels.tsx      interactive panels for the research page
  reasoning-panels.tsx  resampling demo, tree explorer, depth curve
  melange-panels.tsx    architecture, RLS explainer, swipe deck
  ui.tsx                shell, sections, tables, callouts
public/data/            the numbers
```
