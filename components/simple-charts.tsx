"use client";

import { useState } from "react";
import q from "@/public/data/quant.json";

/* Charts for someone who does not read charts for a living: one idea each,
   a plain caption saying what to look at, and no interaction more complex
   than clicking a labelled button. */

function Figure({
  caption,
  children,
  note,
}: {
  caption: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <figure className="my-10">
      <div className="rounded-xl border border-rule p-5 sm:p-7">{children}</div>
      <figcaption className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
        <span className="font-medium text-ink">What to look at: </span>
        {caption}
      </figcaption>
      {note && <div className="mt-2 text-[13.5px] text-ink-3">{note}</div>}
    </figure>
  );
}

/* ------------------------------------------------- growth of $100, by era */

export function GrowthChart() {
  const [era, setEra] = useState<"all" | "early" | "late">("all");

  const daily = q.daily;
  const startIdx = era === "late" ? Math.round(daily.length * (5 / 12.5)) : 0;
  const endIdx = era === "early" ? Math.round(daily.length * (5 / 12.5)) : daily.length;
  const slice = daily.slice(startIdx, endIdx);

  let v = 100;
  const path: number[] = [100];
  for (const r of slice) {
    v *= 1 + r;
    path.push(v);
  }
  const thin = path.filter((_, i) => i % Math.ceil(path.length / 300) === 0);
  const lo = Math.min(...thin, 100);
  const hi = Math.max(...thin, 100);
  const span = hi - lo || 1;
  const W = 900;
  const H = 260;
  const x = (i: number) => (i / (thin.length - 1)) * W;
  const y = (val: number) => 18 + (1 - (val - lo) / span) * (H - 46);
  const d = thin.map((val, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(val).toFixed(1)}`).join("");
  const final = path[path.length - 1];
  const up = final >= 100;

  const YEARS = { all: "2014 – 2026", early: "2014 – 2018", late: "2019 – 2026" };

  return (
    <Figure
      caption={
        era === "early"
          ? "Money going down, for five years straight. This is the stretch that drags the whole result down."
          : era === "late"
          ? "The same model, after 2018. Steady growth — eight positive years out of eight."
          : "$100 invested at the start. It falls for five years, then recovers and grows. The headline number averages those two very different periods together."
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "early", "late"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setEra(k)}
            aria-pressed={era === k}
            className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
              era === k
                ? "border-[var(--color-sea)] bg-[var(--color-accent-soft)] text-[var(--color-sea)]"
                : "border-rule text-ink-2 hover:border-ink-3"
            }`}
          >
            {YEARS[k]}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Growth of $100, ${YEARS[era]}`}>
        <line x1="0" y1={y(100)} x2={W} y2={y(100)} stroke="var(--color-rule)" strokeDasharray="4 4" />
        <text x="4" y={y(100) - 8} className="text-[13px]" fill="var(--color-ink-3)" fontSize="13">
          $100 — break even
        </text>
        <path
          d={`${d}L${W},${H - 28}L0,${H - 28}Z`}
          fill={up ? "var(--color-sea)" : "var(--color-coral)"}
          fillOpacity="0.08"
        />
        <path d={d} fill="none" stroke={up ? "var(--color-sea)" : "var(--color-coral)"} strokeWidth="2.5" />
      </svg>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-[30px] tnum" style={{ color: up ? "var(--color-sea)" : "var(--color-coral)" }}>
          ${final.toFixed(0)}
        </span>
        <span className="text-[15px] text-ink-3">
          from $100 over {YEARS[era].replace(" – ", "–")}
        </span>
      </div>
    </Figure>
  );
}

/* -------------------------------------------------- where the money came from */

export function BetaSplit() {
  const d = q.decomposition;
  const betaPart = Math.round((1 - d.alpha_bps / d.raw_spread_bps) * 100);
  const skillPart = 100 - betaPart;

  return (
    <Figure
      caption={`Of everything the model appeared to earn, ${betaPart}% was just the stock market going up — something you get for free by buying an index fund. Only ${skillPart}% came from actually picking better stocks.`}
    >
      <div className="flex h-16 overflow-hidden rounded-lg">
        <div
          className="flex items-center justify-center text-[15px] font-medium text-white"
          style={{ width: `${betaPart}%`, background: "var(--color-coral)" }}
        >
          {betaPart}%
        </div>
        <div
          className="flex items-center justify-center text-[15px] font-medium text-white"
          style={{ width: `${skillPart}%`, background: "var(--color-kelp)" }}
        >
          {skillPart}%
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: "var(--color-coral)" }} />
          <span className="text-ink-2">The market going up</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: "var(--color-kelp)" }} />
          <span className="text-ink-2">Actual stock picking</span>
        </span>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------ seed lottery */

export function SeedLottery() {
  const seeds = q.seeds;
  const lo = Math.min(...seeds.map((s) => s.sharpe));
  const hi = Math.max(...seeds.map((s) => s.sharpe));

  return (
    <Figure
      caption="Six runs of the same model, changing nothing but an internal random number. The score swings from 0.09 to 0.49 — a five-fold difference. Any single one of those numbers would be a lucky or unlucky draw, not a measurement."
      note="This is why the write-up reports a range rather than one headline figure."
    >
      <div className="space-y-3">
        {seeds.map((s) => {
          const pct = ((s.sharpe - 0) / (hi * 1.15)) * 100;
          return (
            <div key={s.seed} className="flex items-center gap-4">
              <span className="w-16 shrink-0 text-[14px] text-ink-3">Run {s.seed + 1}</span>
              <div className="relative h-7 flex-1 rounded bg-paper-3">
                <div
                  className="absolute inset-y-0 left-0 rounded"
                  style={{ width: `${pct}%`, background: "var(--color-sea)", opacity: 0.75 }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-[15px] tnum">{s.sharpe.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-lg bg-paper-2 px-5 py-4 text-[15.5px] text-ink-2">
        Same data. Same code. Same settings. Only the random seed differs.
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------ before/after */

export function BeforeAfter() {
  const rows: [string, string, string][] = [
    ["Claimed annual return", "35.3%", "1.9%"],
    ["Companies in the test", "429 survivors", "727, including ones that went bust"],
    ["Days of trading missing", "578", "0"],
    ["Company financials used", "None", "SEC filings, dated to filing day"],
  ];
  return (
    <Figure caption="The left column is what the original project reported. The right is what the rebuilt version produces. The gap between them is the work.">
      <div className="grid grid-cols-[1fr] gap-x-6 sm:grid-cols-[1.1fr_0.9fr_1.2fr] sm:gap-y-0">
        <div className="hidden sm:contents">
          <div className="pb-2 text-[13px] text-ink-3">Measure</div>
          <div className="pb-2 text-[13px] text-ink-3">Original</div>
          <div className="pb-2 text-[13px] text-ink-3">Rebuilt</div>
        </div>
      </div>
      <div className="space-y-0">
        {rows.map(([label, before, after], i) => (
          <div
            key={label}
            className={`grid grid-cols-[1fr] gap-x-6 gap-y-1 py-4 sm:grid-cols-[1.1fr_0.9fr_1.2fr] sm:items-baseline ${
              i > 0 ? "rule-soft" : ""
            }`}
          >
            <div className="text-[16px] text-ink-2">{label}</div>
            <div className="text-[15.5px] text-ink-3 line-through">{before}</div>
            <div className="text-[16px] font-medium" style={{ color: "var(--color-sea)" }}>
              {after}
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}

/* -------------------------------------------------- the two bias signatures */

export function Signatures() {
  const s = q.signatures;
  const max = Math.max(...s.rows.flatMap((r) => [Math.abs(r.dating), Math.abs(r.universe)]));

  const bar = (v: number, color: string) => {
    const w = (Math.abs(v) / max) * 50;
    return (
      <div className="relative h-[18px] w-full">
        <div className="absolute left-1/2 top-0 h-full w-px bg-rule" />
        <div
          className="absolute top-[3px] h-[12px] rounded-[2px]"
          style={{
            width: `${w}%`,
            left: v >= 0 ? "50%" : `${50 - w}%`,
            background: v === 0 ? "transparent" : color,
            border: v === 0 ? "1px dashed var(--color-ink-3)" : "none",
            minWidth: v === 0 ? "10px" : undefined,
          }}
        />
      </div>
    );
  };

  return (
    <Figure
      caption={`The eight factors that move most. A dashed outline means the shift is exactly zero — not small, zero — because a factor built from prices alone can never read a company filing. The two columns pick out almost different signals, which is what lets you tell one mistake from the other.`}
      note={`Shift in t-statistic from the correct baseline; the longest bar is ${max.toFixed(2)}. Correlation between the two columns across all ${s.n_factors} factors: ${s.correlation}. ${s.exact_zero_dating} factors are exactly unmoved by the dating mistake.`}
    >
      <div className="grid grid-cols-[1.25fr_1fr_1fr] items-center gap-x-4 text-[13px] text-ink-3">
        <div>Signal</div>
        <div>Wrong filing date</div>
        <div>Wrong company list</div>
      </div>
      <div className="grid grid-cols-[1.25fr_1fr_1fr] items-center gap-x-4 pb-3 pt-1 text-[11.5px] text-ink-3">
        <div />
        <div className="flex justify-between">
          <span>weaker</span>
          <span>stronger</span>
        </div>
        <div className="flex justify-between">
          <span>weaker</span>
          <span>stronger</span>
        </div>
      </div>
      <div>
        {s.rows.map((r, i) => (
          <div
            key={r.factor}
            className={`grid grid-cols-[1.25fr_1fr_1fr] items-center gap-x-4 py-2.5 ${
              i > 0 ? "rule-soft" : ""
            }`}
          >
            <div className="text-[14.5px] text-ink-2">{r.factor.replace(/_/g, " ")}</div>
            {bar(r.dating, "var(--color-sea)")}
            {bar(r.universe, "var(--color-coral)")}
          </div>
        ))}
      </div>
    </Figure>
  );
}
