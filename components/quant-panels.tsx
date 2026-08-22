"use client";

import { useState } from "react";
import q from "@/public/data/quant.json";
import { BrushableEquity, RankedBars, DotSpread, Bars } from "@/components/charts";

/* ----------------------------------------------------------- equity */



/* ----------------------------------------------------------- factors */

type FactorKey = "icir" | "ic" | "t";

const FACTOR_VIEWS: { key: FactorKey; label: string; format: (v: number) => string }[] = [
  { key: "icir", label: "IC information ratio", format: (v) => v.toFixed(3) },
  { key: "ic", label: "Mean IC", format: (v) => v.toFixed(4) },
  { key: "t", label: "t-statistic", format: (v) => v.toFixed(2) },
];

export function FactorPanel() {
  const [view, setView] = useState<FactorKey>("icir");
  const active = FACTOR_VIEWS.find((v) => v.key === view)!;
  const data = [...q.factors]
    .sort((a, b) => b[view] - a[view])
    .map((f) => ({ name: f.name, value: f[view] }));

  return (
    <div>
      <Toggle
        options={FACTOR_VIEWS.map((v) => ({ value: v.key, label: v.label }))}
        value={view}
        onChange={(v) => setView(v as FactorKey)}
      />
      <div className="mt-6">
        <RankedBars data={data} format={active.format} highlight={5} />
      </div>
      <p className="mt-5 max-w-[640px] text-[13.5px] leading-relaxed text-ink-3">
        The value and quality complex — cash-flow yield, sales-to-price, earnings yield, accruals,
        ROE — carries the signal. Momentum is flat over this sample, and Amihud illiquidity and
        asset growth run the wrong way.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- seeds */

export function SeedPanel() {
  const [metric, setMetric] = useState<"sharpe" | "ic">("sharpe");
  const values = q.seeds.map((s) => ({ label: `seed ${s.seed}`, value: s[metric] }));
  const nums = values.map((v) => v.value);
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const sd = Math.sqrt(nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (nums.length - 1));
  const format = metric === "sharpe" ? (v: number) => v.toFixed(3) : (v: number) => v.toFixed(4);
  const spread = Math.max(...nums) / Math.max(Math.min(...nums), 1e-9);

  return (
    <div>
      <Toggle
        options={[
          { value: "sharpe", label: "Backtest Sharpe" },
          { value: "ic", label: "Out-of-sample IC" },
        ]}
        value={metric}
        onChange={(v) => setMetric(v as "sharpe" | "ic")}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px] lg:items-center">
        <DotSpread values={values} mean={mean} sd={sd} format={format} />
        <div className="grid grid-cols-3 gap-5 lg:grid-cols-1 lg:gap-4">
          <Metric label="mean" value={format(mean)} />
          <Metric label="std dev" value={format(sd)} />
          <Metric
            label="max ÷ min"
            value={metric === "sharpe" ? `${spread.toFixed(1)}×` : `${spread.toFixed(2)}×`}
            tone={metric === "sharpe" ? "warn" : "good"}
          />
        </div>
      </div>

      <p className="mt-7 max-w-[640px] text-[13.5px] leading-relaxed text-ink-3">
        {metric === "sharpe"
          ? "Six identical models, differing only by random seed. The Sharpe spans a factor of five — 0.09 to 0.49. Any single value is a draw, not a measurement."
          : "The same six models, scored on information coefficient. IC moves by ±5%. The signal the model finds is stable; what the portfolio does with it is not."}
      </p>
    </div>
  );
}

/* --------------------------------------------------------- smoothing */

export function SmoothingPanel() {
  const [metric, setMetric] = useState<"icir" | "turnover">("icir");
  const data = q.smoothing.map((s) => ({
    name: `${s.months}mo`,
    value: metric === "icir" ? s.icir : s.turnover,
    muted: s.months !== 3,
  }));

  return (
    <div>
      <Toggle
        options={[
          { value: "icir", label: "IC information ratio" },
          { value: "turnover", label: "Selection turnover" },
        ]}
        value={metric}
        onChange={(v) => setMetric(v as "icir" | "turnover")}
      />
      <div className="mt-7 grid gap-10 lg:grid-cols-[300px_1fr] lg:items-center">
        <Bars
          data={data}
          format={(v) => (metric === "icir" ? v.toFixed(3) : `${(v * 100).toFixed(0)}%`)}
          color={metric === "icir" ? "var(--color-kelp)" : "var(--color-coral)"}
          height={150}
        />
        <div className="scroll-x">
          <table className="w-full min-w-[380px] border-collapse mono text-[12.5px] tnum">
            <thead>
              <tr>
                {["smoothing", "IC", "ICIR", "spread", "turnover"].map((c, i) => (
                  <th
                    key={c}
                    className={`eyebrow border-b border-rule pb-2 font-normal ${i === 0 ? "text-left" : "text-right"}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.smoothing.map((s) => (
                <tr key={s.months} className={s.months === 3 ? "bg-[var(--color-accent-soft)]" : ""}>
                  <td className="border-b border-rule-soft py-2 pl-2 text-ink-2">
                    {s.months} month{s.months > 1 ? "s" : ""}
                    {s.months === 3 && <span className="text-[var(--color-sea)]"> ←</span>}
                  </td>
                  <td className="border-b border-rule-soft py-2 pr-2 text-right">{s.ic.toFixed(5)}</td>
                  <td className="border-b border-rule-soft py-2 pr-2 text-right">{s.icir.toFixed(4)}</td>
                  <td className="border-b border-rule-soft py-2 pr-2 text-right">{s.spread.toFixed(1)}bp</td>
                  <td className="border-b border-rule-soft py-2 pr-2 text-right">
                    {(s.turnover * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-6 max-w-[640px] text-[13.5px] leading-relaxed text-ink-3">
        Three months was chosen on out-of-sample data, which is disclosed rather than hidden — but
        the effect is monotone from one to six months, so it is not a lucky point.
      </p>
    </div>
  );
}

/* ----------------------------------------------------- decomposition */

export function DecompositionPanel() {
  const d = q.decomposition;
  const betaBps = d.raw_spread_bps - d.alpha_bps;
  const [hover, setHover] = useState<"alpha" | "beta" | null>(null);

  const segments = [
    { key: "beta" as const, bps: betaBps, color: "var(--color-coral)", label: "market beta" },
    { key: "alpha" as const, bps: d.alpha_bps, color: "var(--color-kelp)", label: "stock selection" },
  ];

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between mono text-[11.5px] text-ink-3">
        <span>raw decile spread</span>
        <span className="text-ink">
          {d.raw_spread_bps.toFixed(1)} bp / month · t = {d.raw_spread_t.toFixed(2)}
        </span>
      </div>

      <div className="flex h-14 overflow-hidden rounded-sm">
        {segments.map((seg) => (
          <div
            key={seg.key}
            className="relative flex items-center justify-center transition-opacity"
            style={{
              width: `${(seg.bps / d.raw_spread_bps) * 100}%`,
              background: seg.color,
              opacity: hover === null || hover === seg.key ? 0.88 : 0.34,
            }}
            onPointerEnter={() => setHover(seg.key)}
            onPointerLeave={() => setHover(null)}
          >
            <span className="mono text-[12px] font-medium text-paper">{seg.bps.toFixed(1)}bp</span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex text-[11.5px]">
        {segments.map((seg) => (
          <div key={seg.key} style={{ width: `${(seg.bps / d.raw_spread_bps) * 100}%` }}>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
              <span className="mono text-ink-2">{seg.label}</span>
            </div>
            <div className="mono mt-0.5 pl-3.5 text-ink-3">
              {((seg.bps / d.raw_spread_bps) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <Metric label="spread beta" value={d.beta.toFixed(3)} />
        <Metric label="beta-adj alpha" value={`${d.alpha_bps.toFixed(1)} bp/mo`} />
        <Metric label="alpha, annual" value={`${(d.alpha_annual * 100).toFixed(2)}%`} />
        <Metric label="alpha t-stat" value={d.alpha_t.toFixed(2)} tone="warn" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ shared */

function Toggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="scroll-x flex gap-1 rounded-md border border-rule-soft bg-paper-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded px-3 py-1.5 mono text-[11.5px] transition-colors ${
            value === o.value ? "bg-paper text-ink shadow-sm" : "text-ink-3 hover:text-ink-2"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "warn" | "good" }) {
  const color = tone === "warn" ? "var(--color-coral)" : tone === "good" ? "var(--color-kelp)" : "var(--color-ink)";
  return (
    <div>
      <div className="mono text-[19px] tnum" style={{ color }}>
        {value}
      </div>
      <div className="eyebrow mt-1.5">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------ equity, brushable */

export function EquityBrush() {
  return (
    <BrushableEquity
      equity={q.equity}
      drawdown={q.drawdown}
      daily={q.daily}
      presets={[
        { label: "full sample", from: "2014-01-01", to: "2026-12-31" },
        { label: "2014–2018 · value drawdown", from: "2014-01-01", to: "2018-12-31" },
        { label: "2019–2026", from: "2019-01-01", to: "2026-12-31" },
      ]}
    />
  );
}

/* --------------------------------------------------------- regime split */

export function RegimePanel() {
  const [active, setActive] = useState(0);
  const yearly = q.yearly;
  const max = Math.max(...yearly.map((y) => Math.abs(y.ret)));

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {q.regimes.map((r, i) => {
          const bad = r.sharpe < 0;
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className="card px-5 py-5 text-left transition-all"
              style={{
                borderColor: active === i ? (bad ? "var(--color-coral)" : "var(--color-kelp)") : undefined,
                opacity: active === i ? 1 : 0.62,
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="mono text-[12.5px] text-ink-2">{r.label}</span>
                <span className="mono text-[10.5px] text-ink-3">{r.years}y</span>
              </div>
              <div
                className="mono mt-3 text-[30px] leading-none tnum"
                style={{ color: bad ? "var(--color-coral)" : "var(--color-kelp)" }}
              >
                {r.sharpe.toFixed(2)}
              </div>
              <div className="eyebrow mt-2">Sharpe</div>
              <div className="mt-4 flex gap-6 mono text-[11.5px] text-ink-3">
                <span>
                  CAGR <b className="text-ink font-medium">{(r.cagr * 100).toFixed(2)}%</b>
                </span>
                <span>
                  maxDD <b className="text-ink font-medium">{(r.maxdd * 100).toFixed(1)}%</b>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-9">
        <div className="eyebrow mb-4">Return by calendar year</div>
        <div className="flex items-end gap-1.5" style={{ height: 130 }}>
          {yearly.map((y) => {
            const h = (Math.abs(y.ret) / max) * 100;
            const inRegime =
              (active === 0 && y.year <= 2018) || (active === 1 && y.year >= 2019);
            return (
              <div key={y.year} className="group relative flex-1 flex flex-col justify-end" style={{ height: "100%" }}>
                <div className="relative flex-1 flex flex-col justify-end">
                  <div
                    className="w-full rounded-t-[2px] transition-all duration-500"
                    style={{
                      height: `${h}%`,
                      background: y.ret >= 0 ? "var(--color-deep)" : "var(--color-coral)",
                      opacity: inRegime ? 0.88 : 0.2,
                      transform: y.ret < 0 ? "scaleY(-1)" : undefined,
                      transformOrigin: "bottom",
                    }}
                  />
                </div>
                <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap mono text-[10px] text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  {(y.ret * 100).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-1.5">
          {yearly.map((y) => (
            <div key={y.year} className="flex-1 text-center mono text-[9px] text-ink-3">
              {String(y.year).slice(2)}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-7 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
        {active === 0 ? (
          <>
            One continuous drawdown from March 2014 to December 2018 — every year negative except
            2017 — that did not recover until September 2020. This is not a modelling failure. The
            top factors here are cash-flow yield, sales-to-price and earnings yield: this is a{" "}
            <strong className="text-ink">value</strong> book, and 2014–2018 was the worst stretch
            for value in modern history.
          </>
        ) : (
          <>
            Since 2019, <strong className="text-ink">eight of eight years are positive</strong> at a
            Sharpe of 0.72. Strip the value drawdown and the full-sample Sharpe rises from 0.29 to
            0.73 — which is exactly why quoting a single number over a 12.5-year window hides more
            than it reveals.
          </>
        )}
      </p>
    </div>
  );
}
