"use client";

import { useId, useMemo, useState } from "react";

/* Charts are hand-built SVG rather than a library: the whole site ships no
   third-party JS, every mark is styleable by the same CSS tokens as the text,
   and the figures read like journal plots instead of dashboard widgets. */

type Point = { d: string; v: number };

const PALETTE = {
  ochre: "var(--color-ochre)",
  teal: "var(--color-teal)",
  clay: "var(--color-clay)",
  ink3: "var(--color-ink-3)",
  rule: "var(--color-rule)",
};

function scale(values: number[], size: number, pad = 0) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  return (v: number) => pad + (1 - (v - lo) / span) * (size - pad * 2);
}

function path(points: number[], x: (i: number) => number, y: (v: number) => number) {
  return points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join("");
}

/* ------------------------------------------------------ equity + drawdown */

export function EquityCurve({
  equity,
  drawdown,
  height = 300,
}: {
  equity: Point[];
  drawdown: Point[];
  height?: number;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000;
  const H = height;
  const ddH = 74;
  const gap = 26;
  const eqH = H - ddH - gap;

  const ev = equity.map((p) => p.v);
  const dv = drawdown.map((p) => p.v);
  const x = (i: number) => (i / (equity.length - 1)) * W;
  const yE = scale(ev, eqH, 6);
  const yD = scale([...dv, 0], ddH, 4);

  const idx = hover ?? equity.length - 1;
  const point = equity[idx];
  const dPoint = drawdown[Math.min(idx, drawdown.length - 1)];

  const ticks = useMemo(() => {
    const years = new Map<number, number>();
    equity.forEach((p, i) => {
      const y = Number(p.d.slice(0, 4));
      if (!years.has(y)) years.set(y, i);
    });
    return [...years.entries()].filter(([y]) => y % 3 === 0);
  }, [equity]);

  return (
    <figure className="mt-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={`Equity curve and drawdown, ${equity[0].d} to ${equity[equity.length - 1].d}`}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const frac = (e.clientX - r.left) / r.width;
          setHover(Math.max(0, Math.min(equity.length - 1, Math.round(frac * (equity.length - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.ochre} stopOpacity="0.16" />
            <stop offset="100%" stopColor={PALETTE.ochre} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map(([year, i]) => (
          <g key={year}>
            <line x1={x(i)} y1={0} x2={x(i)} y2={eqH} stroke={PALETTE.rule} strokeWidth="1" />
            <text x={x(i) + 5} y={12} className="mono" fontSize="10" fill="var(--color-ink-3)">
              {year}
            </text>
          </g>
        ))}

        <line x1={0} y1={yE(1)} x2={W} y2={yE(1)} stroke={PALETTE.rule} strokeDasharray="3 4" />
        <path
          d={`${path(ev, x, yE)}L${W},${eqH}L0,${eqH}Z`}
          fill={`url(#${id}-fill)`}
        />
        <path d={path(ev, x, yE)} fill="none" stroke={PALETTE.ochre} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />

        <g transform={`translate(0,${eqH + gap})`}>
          <text x={0} y={-7} className="mono" fontSize="9.5" fill="var(--color-ink-3)" letterSpacing="0.12em">
            DRAWDOWN
          </text>
          <path
            d={`${path(dv, x, yD)}L${W},${yD(0)}L0,${yD(0)}Z`}
            fill={PALETTE.clay}
            fillOpacity="0.15"
          />
          <path d={path(dv, x, yD)} fill="none" stroke={PALETTE.clay} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        </g>

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(idx)} y1={0} x2={x(idx)} y2={H} stroke="var(--color-ink-3)" strokeWidth="1" />
            <circle cx={x(idx)} cy={yE(point.v)} r="3.5" fill="var(--color-paper)" stroke={PALETTE.ochre} strokeWidth="2" />
          </g>
        )}
      </svg>

      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mono text-[11.5px] text-ink-3">
        <span>{point.d}</span>
        <span className="flex gap-5">
          <span>
            equity <b className="text-ink font-medium">{point.v.toFixed(3)}</b>
          </span>
          <span>
            drawdown <b className="text-ink font-medium">{(dPoint.v * 100).toFixed(1)}%</b>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------- bar chart */

export function Bars({
  data,
  label,
  format = (v) => v.toFixed(2),
  color = PALETTE.ochre,
  height = 200,
  zero = true,
}: {
  data: { name: string; value: number; muted?: boolean }[];
  label?: string;
  format?: (v: number) => string;
  color?: string;
  height?: number;
  zero?: boolean;
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
      <div className="relative">
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }} role="img" aria-label={label ?? "bar chart"}>
          {zero && <line x1="0" y1={baseline} x2="100" y2={baseline} stroke={PALETTE.rule} strokeWidth="1" vectorEffect="non-scaling-stroke" />}
          {data.map((d, i) => {
            const top = Math.min(y(d.value), baseline);
            const h = Math.abs(baseline - y(d.value));
            return (
              <rect
                key={d.name}
                x={i * bw + bw * 0.18}
                y={top}
                width={bw * 0.64}
                height={Math.max(h, 0.6)}
                fill={d.muted ? PALETTE.ink3 : color}
                opacity={hover === null || hover === i ? (d.muted ? 0.35 : 0.85) : 0.28}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                style={{ transition: "opacity .18s" }}
              />
            );
          })}
        </svg>
      </div>
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

/* ---------------------------------------------- horizontal ranked bars */

export function RankedBars({
  data,
  format = (v) => v.toFixed(3),
  highlight = 0,
}: {
  data: { name: string; value: number; note?: string }[];
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
          <div key={d.name} className="group grid grid-cols-[minmax(0,150px)_1fr_62px] items-center gap-3">
            <div className={`mono text-[11.5px] truncate ${i < highlight ? "text-ink" : "text-ink-2"}`}>{d.name}</div>
            <div className="relative h-[15px]">
              <div className="absolute inset-y-0 left-1/2 w-px bg-rule" />
              <div
                className="absolute inset-y-[2px] rounded-[1px] transition-opacity group-hover:opacity-100"
                style={{
                  left: positive ? "50%" : `${50 - pct}%`,
                  width: `${pct}%`,
                  background: positive ? PALETTE.teal : PALETTE.clay,
                  opacity: i < highlight ? 0.85 : 0.42,
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

/* ---------------------------------------------------------- dot spread */

export function DotSpread({
  values,
  mean,
  sd,
  format = (v) => v.toFixed(2),
  label,
}: {
  values: { label: string; value: number }[];
  mean: number;
  sd: number;
  format?: (v: number) => string;
  label?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const all = values.map((v) => v.value);
  const lo = Math.min(...all, mean - sd * 1.6);
  const hi = Math.max(...all, mean + sd * 1.6);
  const span = hi - lo || 1;
  const pos = (v: number) => ((v - lo) / span) * 100;

  return (
    <figure>
      {label && <div className="eyebrow mb-4">{label}</div>}
      <div className="relative h-[70px]">
        <div
          className="absolute top-[26px] h-[13px] rounded-sm"
          style={{ left: `${pos(mean - sd)}%`, width: `${(sd * 2 / span) * 100}%`, background: "var(--color-ochre-soft)" }}
        />
        <div className="absolute top-[20px] h-[25px] w-px bg-ochre" style={{ left: `${pos(mean)}%` }} />
        <div className="absolute inset-x-0 top-[32px] h-px bg-rule" />
        {values.map((v, i) => (
          <div
            key={v.label}
            className="absolute top-[26px] -translate-x-1/2 cursor-default"
            style={{ left: `${pos(v.value)}%` }}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <div
              className="h-[13px] w-[13px] rounded-full border-2 transition-transform"
              style={{
                background: "var(--color-paper)",
                borderColor: PALETTE.ochre,
                transform: hover === i ? "scale(1.35)" : "none",
              }}
            />
            {hover === i && (
              <div className="absolute -top-[22px] left-1/2 -translate-x-1/2 whitespace-nowrap mono text-[10.5px] text-ink">
                {v.label} · {format(v.value)}
              </div>
            )}
          </div>
        ))}
        <div className="absolute bottom-0 inset-x-0 flex justify-between mono text-[10.5px] text-ink-3">
          <span>{format(lo)}</span>
          <span>{format(hi)}</span>
        </div>
      </div>
    </figure>
  );
}

/* ---------------------------------------------------------- stat block */

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
  const color = tone === "warn" ? "var(--color-clay)" : tone === "good" ? "var(--color-teal)" : "var(--color-ink)";
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
