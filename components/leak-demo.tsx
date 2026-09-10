"use client";

import { useEffect, useRef, useState } from "react";

/* The hero is the tool's own output. Drag the clock and watch what happens:
   features that cannot read the perturbed source stay at exactly zero, and the
   one with an undeclared dependency moves. That is the entire idea, and it is
   more convincing to operate than to read. */

type Feature = { name: string; reads: boolean; scale: number };

const FEATURES: Feature[] = [
  { name: "momentum_12m", reads: false, scale: 0 },
  { name: "volatility_60d", reads: false, scale: 0 },
  { name: "reversal_5d", reads: false, scale: 0 },
  { name: "volume_shock", reads: false, scale: 0 },
  { name: "earnings_yield", reads: true, scale: 0.62 },
  { name: "book_to_market", reads: true, scale: 0.44 },
  { name: "accruals", reads: true, scale: 0.88 },
  { name: "max_return", reads: false, scale: 0 },
  { name: "beta_252d", reads: false, scale: 0 },
  { name: "turnover_1m", reads: true, scale: 0.34 },
];

const DECLARED_PRICE_ONLY = new Set(["turnover_1m"]);

export function LeakDemo() {
  const [days, setDays] = useState(0);
  const [auto, setAuto] = useState(true);
  const raf = useRef<number | undefined>(undefined);

  // Drift on its own until the visitor takes hold of it.
  useEffect(() => {
    if (!auto) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDays(45);
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const phase = ((t - start) / 4200) % 2;
      setDays(Math.round(45 * (phase < 1 ? phase : 2 - phase)));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [auto]);

  const t = days / 45;
  const leaks = FEATURES.filter((f) => f.reads && DECLARED_PRICE_ONLY.has(f.name));

  return (
    <div className="border border-rule bg-paper-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <span className="tech text-ink-3">leakcheck · filings source</span>
        <span className="tech text-ink-3">
          clock <span className="text-[var(--color-sea)]">+{days}d</span>
        </span>
      </div>

      <div className="px-5 py-6">
        {FEATURES.map((f) => {
          const moved = f.reads && days > 0;
          const w = f.scale * t * 100;
          const suspicious = moved && DECLARED_PRICE_ONLY.has(f.name);
          return (
            <div key={f.name} className="flex items-center gap-3 py-[5px]">
              <span
                className="mono w-[118px] shrink-0 truncate text-[11px] transition-colors sm:w-[132px]"
                style={{ color: moved ? "var(--color-ink)" : "var(--color-ink-3)" }}
              >
                {f.name}
              </span>

              <div className="relative h-[9px] flex-1">
                <div className="absolute inset-y-0 left-0 w-px bg-[var(--color-rule)]" />
                {moved ? (
                  <div
                    className="absolute inset-y-0 left-0 rounded-[1px]"
                    style={{
                      width: `${w}%`,
                      background: suspicious ? "var(--color-coral)" : "var(--color-sea)",
                      opacity: suspicious ? 0.95 : 0.55,
                      transition: "width 90ms linear",
                    }}
                  />
                ) : (
                  <div
                    className="absolute left-0 top-1/2 h-px w-[26px] -translate-y-1/2"
                    style={{ background: "var(--color-ink-3)", opacity: 0.45 }}
                  />
                )}
              </div>

              <span
                className="mono w-[62px] shrink-0 text-right text-[10.5px] tabular-nums"
                style={{ color: suspicious ? "var(--color-coral)" : moved ? "var(--color-ink-3)" : "var(--color-ink-3)" }}
              >
                {moved ? `+${(f.scale * t).toFixed(2)}` : "0.00"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-rule px-5 py-4">
        <label className="flex items-center gap-4">
          <span className="tech shrink-0 text-ink-3">shift</span>
          <input
            type="range"
            min={0}
            max={45}
            value={days}
            onChange={(e) => {
              setAuto(false);
              setDays(Number(e.target.value));
            }}
            onPointerDown={() => setAuto(false)}
            aria-label="Shift the filings clock, in days"
            className="h-[3px] w-full cursor-pointer appearance-none rounded-full bg-[var(--color-paper-4)] accent-[var(--color-sea)]"
          />
        </label>

        <p className="mt-4 text-[13.5px] leading-[1.65] text-ink-2">
          {days === 0 ? (
            <>Nothing has moved yet. Drag the clock.</>
          ) : (
            <>
              Six features hold at <span className="mono text-ink">0.00</span> — they never read a
              filing, so they cannot move.{" "}
              {leaks.length > 0 && (
                <>
                  <span className="mono" style={{ color: "var(--color-coral)" }}>
                    {leaks[0].name}
                  </span>{" "}
                  was declared price-only and moved anyway. That&apos;s the bug.
                </>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
