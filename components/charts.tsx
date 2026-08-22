"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

/* Charts are hand-built SVG rather than a library: the site ships no
   third-party JS, every mark inherits the same tokens as the type, and the
   figures read like plates rather than dashboard widgets. */

type Point = { d: string; v: number };

export const SEA = {
  shallow: "var(--color-shallow)",
  sea: "var(--color-sea)",
  deep: "var(--color-deep)",
  abyss: "var(--color-abyss)",
  kelp: "var(--color-kelp)",
  coral: "var(--color-coral)",
  sand: "var(--color-sand)",
  ink3: "var(--color-ink-3)",
  rule: "var(--color-rule)",
};

/* ------------------------------------------------ scroll-reveal wrapper */

export function OnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`onscroll ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------- brushable equity curve */

function annualise(returns: number[]) {
  if (returns.length < 5) return null;
  const n = returns.length;
  const mean = returns.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  const growth = returns.reduce((a, b) => a * (1 + b), 1);
  const years = n / 252;
  let peak = 1;
  let equity = 1;
  let maxDd = 0;
  for (const r of returns) {
    equity *= 1 + r;
    peak = Math.max(peak, equity);
    maxDd = Math.min(maxDd, equity / peak - 1);
  }
  return {
    sharpe: sd > 0 ? (mean / sd) * Math.sqrt(252) : 0,
    cagr: years > 0 ? Math.pow(growth, 1 / years) - 1 : 0,
    maxDd,
    years,
  };
}

export function BrushableEquity({
  equity,
  drawdown,
  daily,
  presets = [],
}: {
  equity: Point[];
  drawdown: Point[];
  daily: number[];
  presets?: { label: string; from: string; to: string }[];
}) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [range, setRange] = useState<[number, number]>([0, equity.length - 1]);
  const [drag, setDrag] = useState<null | { anchor: number }>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 1000;
  const eqH = 230;
  const ddH = 66;
  const gap = 24;
  const H = eqH + gap + ddH + 22;

  const ev = equity.map((p) => p.v);
  const dv = drawdown.map((p) => p.v);
  const x = (i: number) => (i / (equity.length - 1)) * W;
  const yScale = (vals: number[], size: number, pad: number) => {
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const span = hi - lo || 1;
    return (v: number) => pad + (1 - (v - lo) / span) * (size - pad * 2);
  };
  const yE = yScale(ev, eqH, 8);
  const yD = yScale([...dv, 0], ddH, 4);

  const line = (vals: number[], y: (v: number) => number) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

  /* Map the plotted (thinned) index back onto the full daily series. */
  const step = daily.length / equity.length;
  const stats = useMemo(() => {
    const a = Math.round(range[0] * step);
    const b = Math.round(range[1] * step);
    return annualise(daily.slice(a, Math.max(b, a + 6)));
  }, [range, daily, step]);

  const indexFromEvent = useCallback(
    (clientX: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return 0;
      const frac = (clientX - rect.left) / rect.width;
      return Math.max(0, Math.min(equity.length - 1, Math.round(frac * (equity.length - 1))));
    },
    [equity.length],
  );

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const i = indexFromEvent(e.clientX);
      setRange([Math.min(drag.anchor, i), Math.max(drag.anchor, i)]);
    };
    const up = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, indexFromEvent]);

  const applyPreset = (from: string, to: string) => {
    const a = equity.findIndex((p) => p.d >= from);
    const bRaw = equity.findIndex((p) => p.d > to);
    const b = bRaw === -1 ? equity.length - 1 : bRaw - 1;
    setRange([Math.max(a, 0), Math.max(b, a + 4)]);
  };

  const full = range[0] === 0 && range[1] === equity.length - 1;
  const cursor = hover ?? range[1];

  return (
    <figure>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.from, p.to)}
            className="rounded-full border border-rule px-3 py-1 mono text-[11px] text-ink-2 transition-colors hover:border-[var(--color-sea)] hover:text-[var(--color-sea)]"
          >
            {p.label}
          </button>
        ))}
        {!full && (
          <button
            type="button"
            onClick={() => setRange([0, equity.length - 1])}
            className="rounded-full px-3 py-1 mono text-[11px] text-ink-3 underline underline-offset-2 hover:text-ink"
          >
            reset
          </button>
        )}
        <span className="ml-auto mono text-[11px] text-ink-3">drag across the chart to select</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto cursor-crosshair touch-none select-none"
        role="img"
        aria-label="Equity curve with drawdown. Drag to select a window and recompute statistics."
        onPointerDown={(e) => {
          const i = indexFromEvent(e.clientX);
          setDrag({ anchor: i });
          setRange([i, i]);
        }}
        onPointerMove={(e) => setHover(indexFromEvent(e.clientX))}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`${id}-eq`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SEA.sea} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SEA.sea} stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={SEA.shallow} />
            <stop offset="55%" stopColor={SEA.sea} />
            <stop offset="100%" stopColor={SEA.abyss} />
          </linearGradient>
        </defs>

        {/* year gridlines */}
        {Array.from(new Map(equity.map((p, i) => [p.d.slice(0, 4), i])).entries())
          .filter(([y]) => Number(y) % 2 === 0)
          .map(([year, i]) => (
            <g key={year}>
              <line x1={x(i)} y1={0} x2={x(i)} y2={eqH} stroke={SEA.rule} />
              <text x={x(i) + 5} y={12} className="mono" fontSize="9.5" fill="var(--color-ink-3)">
                {year}
              </text>
            </g>
          ))}

        <line x1={0} y1={yE(1)} x2={W} y2={yE(1)} stroke={SEA.rule} strokeDasharray="3 4" />
        <path d={`${line(ev, yE)}L${W},${eqH}L0,${eqH}Z`} fill={`url(#${id}-eq)`} />
        <path
          d={line(ev, yE)}
          fill="none"
          stroke={`url(#${id}-stroke)`}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="draw-in"
          style={{ ["--dash" as string]: "3000" }}
        />

        {/* dim everything outside the brush */}
        {!full && (
          <>
            <rect x={0} y={0} width={x(range[0])} height={H} fill="var(--color-paper)" opacity="0.66" />
            <rect x={x(range[1])} y={0} width={W - x(range[1])} height={H} fill="var(--color-paper)" opacity="0.66" />
            <line x1={x(range[0])} y1={0} x2={x(range[0])} y2={H - 18} stroke={SEA.deep} strokeWidth="1.5" />
            <line x1={x(range[1])} y1={0} x2={x(range[1])} y2={H - 18} stroke={SEA.deep} strokeWidth="1.5" />
          </>
        )}

        <g transform={`translate(0,${eqH + gap})`}>
          <text x={0} y={-6} className="mono" fontSize="9" fill="var(--color-ink-3)" letterSpacing="0.13em">
            DRAWDOWN
          </text>
          <path d={`${line(dv, yD)}L${W},${yD(0)}L0,${yD(0)}Z`} fill={SEA.coral} fillOpacity="0.16" />
          <path d={line(dv, yD)} fill="none" stroke={SEA.coral} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        </g>

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(cursor)} y1={0} x2={x(cursor)} y2={H - 18} stroke="var(--color-ink-3)" strokeWidth="1" />
            <circle cx={x(cursor)} cy={yE(ev[cursor])} r="4" fill="var(--color-paper)" stroke={SEA.deep} strokeWidth="2" />
          </g>
        )}
      </svg>

      <figcaption className="mt-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mono text-[11.5px] text-ink-3">
          <span>
            {equity[range[0]].d} → {equity[range[1]].d}
          </span>
          <span>
            equity <b className="text-ink font-medium">{ev[cursor].toFixed(3)}</b> · drawdown{" "}
            <b className="text-ink font-medium">{(dv[Math.min(cursor, dv.length - 1)] * 100).toFixed(1)}%</b>
          </span>
        </div>
        {stats && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Window label="Sharpe" value={stats.sharpe.toFixed(2)} tone={stats.sharpe < 0 ? "bad" : stats.sharpe > 0.6 ? "good" : "flat"} />
            <Window label="CAGR" value={`${(stats.cagr * 100).toFixed(2)}%`} tone={stats.cagr < 0 ? "bad" : "flat"} />
            <Window label="Max drawdown" value={`${(stats.maxDd * 100).toFixed(1)}%`} tone="flat" />
            <Window label="Window" value={`${stats.years.toFixed(1)}y`} tone="flat" />
          </div>
        )}
      </figcaption>
    </figure>
  );
}

function Window({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" | "flat" }) {
  const color = tone === "bad" ? SEA.coral : tone === "good" ? SEA.kelp : "var(--color-ink)";
  return (
    <div className="card px-4 py-3">
      <div className="mono text-[19px] tnum leading-none" style={{ color }}>
        {value}
      </div>
      <div className="eyebrow mt-2">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------ bar chart */

export function Bars({
  data,
  label,
  format = (v) => v.toFixed(2),
  color = SEA.deep,
  height = 200,
}: {
  data: { name: string; value: number; muted?: boolean }[];
  label?: string;
  format?: (v: number) => string;
  color?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const values = data.map((d) => d.value);
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  const span = hi - lo || 1;
  const y = (v: number) => ((hi - v) / span) * height;
  const baseline = y(0);
  const bw = 100 / data.length;

  return (
    <figure>
      {label && <div className="eyebrow mb-3">{label}</div>}
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ height }} className="w-full" role="img" aria-label={label ?? "bar chart"}>
        <line x1="0" y1={baseline} x2="100" y2={baseline} stroke={SEA.rule} vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <rect
            key={d.name}
            x={i * bw + bw * 0.17}
            y={Math.min(y(d.value), baseline)}
            width={bw * 0.66}
            height={Math.max(Math.abs(baseline - y(d.value)), 0.6)}
            fill={d.muted ? SEA.ink3 : color}
            opacity={hover === null || hover === i ? (d.muted ? 0.32 : 0.88) : 0.26}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            style={{ transition: "opacity .18s" }}
          />
        ))}
      </svg>
      <div className="mt-2 flex text-[10px] mono text-ink-3">
        {data.map((d, i) => (
          <div key={d.name} className="text-center leading-tight" style={{ width: `${bw}%` }}>
            <div className={hover === i ? "text-ink" : ""}>{format(d.value)}</div>
            <div className="mt-0.5 truncate opacity-70">{d.name}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* -------------------------------------------------- horizontal ranked bars */

export function RankedBars({
  data,
  format = (v) => v.toFixed(3),
  highlight = 0,
}: {
  data: { name: string; value: number }[];
  format?: (v: number) => string;
  highlight?: number;
}) {
  const max = Math.max(...data.map((d) => Math.abs(d.value))) || 1;
  return (
    <div className="space-y-[3px]">
      {data.map((d, i) => {
        const pct = (Math.abs(d.value) / max) * 50;
        const positive = d.value >= 0;
        return (
          <div key={d.name} className="group grid grid-cols-[minmax(0,148px)_1fr_64px] items-center gap-3">
            <div className={`mono text-[11.5px] truncate ${i < highlight ? "text-ink" : "text-ink-2"}`}>{d.name}</div>
            <div className="relative h-[15px]">
              <div className="absolute inset-y-0 left-1/2 w-px bg-rule" />
              <div
                className="absolute inset-y-[2px] rounded-[2px] transition-all duration-500"
                style={{
                  left: positive ? "50%" : `${50 - pct}%`,
                  width: `${pct}%`,
                  background: positive ? SEA.deep : SEA.coral,
                  opacity: i < highlight ? 0.88 : 0.42,
                }}
              />
            </div>
            <div className={`mono text-[11.5px] text-right tnum ${i < highlight ? "text-ink" : "text-ink-3"}`}>
              {format(d.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ dot spread */

export function DotSpread({
  values,
  mean,
  sd,
  format = (v) => v.toFixed(2),
}: {
  values: { label: string; value: number }[];
  mean: number;
  sd: number;
  format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const all = values.map((v) => v.value);
  const lo = Math.min(...all, mean - sd * 1.7);
  const hi = Math.max(...all, mean + sd * 1.7);
  const span = hi - lo || 1;
  const pos = (v: number) => ((v - lo) / span) * 100;

  return (
    <figure className="relative h-[76px]">
      <div
        className="absolute top-[28px] h-[14px] rounded"
        style={{
          left: `${pos(mean - sd)}%`,
          width: `${((sd * 2) / span) * 100}%`,
          background: "var(--color-accent-soft)",
        }}
      />
      <div className="absolute top-[21px] h-[28px] w-px" style={{ left: `${pos(mean)}%`, background: SEA.deep }} />
      <div className="absolute inset-x-0 top-[35px] h-px bg-rule" />
      {values.map((v, i) => (
        <div
          key={v.label}
          className="absolute top-[28px] -translate-x-1/2 cursor-default"
          style={{ left: `${pos(v.value)}%` }}
          onPointerEnter={() => setHover(i)}
          onPointerLeave={() => setHover(null)}
        >
          <div
            className="h-[14px] w-[14px] rounded-full border-2 transition-transform duration-200"
            style={{
              background: "var(--color-paper)",
              borderColor: SEA.deep,
              transform: hover === i ? "scale(1.4)" : "none",
            }}
          />
          {hover === i && (
            <div className="absolute -top-[23px] left-1/2 -translate-x-1/2 whitespace-nowrap mono text-[10.5px] text-ink">
              {v.label} · {format(v.value)}
            </div>
          )}
        </div>
      ))}
      <div className="absolute bottom-0 inset-x-0 flex justify-between mono text-[10.5px] text-ink-3">
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------ stat block */

export function Stat({
  value,
  label,
  note,
  tone = "default",
}: {
  value: string;
  label: string;
  note?: string;
  tone?: "default" | "warn" | "good";
}) {
  const color = tone === "warn" ? SEA.coral : tone === "good" ? SEA.kelp : "var(--color-ink)";
  return (
    <div>
      <div className="mono text-[23px] leading-none tnum" style={{ color }}>
        {value}
      </div>
      <div className="eyebrow mt-2">{label}</div>
      {note && <div className="mt-1 text-[11.5px] text-ink-3 italic leading-snug">{note}</div>}
    </div>
  );
}
