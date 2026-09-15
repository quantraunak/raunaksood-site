"use client";

import { useEffect, useRef, useState } from "react";

/* The finding is a crossover, and a crossover is worth operating rather than
   reading. Drag k. At one item the unconstrained arm is ahead; by sixteen it is
   behind, because it stops emitting while the schema keeps going. Every number
   here is measured, not interpolated: the three stops are the three levels that
   were actually run. */

type Level = {
  k: number;
  constrained: { recall: number; emitted: number; precision: number };
  free: { recall: number; emitted: number; precision: number };
};

const LEVELS: Level[] = [
  { k: 1,  constrained: { recall: 0.440, emitted: 0.5, precision: 0.917 },
           free:        { recall: 0.640, emitted: 0.8, precision: 0.882 } },
  { k: 4,  constrained: { recall: 0.640, emitted: 2.6, precision: 0.976 },
           free:        { recall: 0.530, emitted: 2.2, precision: 0.973 } },
  { k: 16, constrained: { recall: 0.554, emitted: 9.4, precision: 0.946 },
           free:        { recall: 0.426, emitted: 7.2, precision: 0.948 } },
];

export function CardinalityDemo() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!auto) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % LEVELS.length), 2200);
    return () => clearInterval(timer.current);
  }, [auto]);

  const stop = () => { setAuto(false); clearInterval(timer.current); };
  const level = LEVELS[i];
  const lead = level.free.recall - level.constrained.recall;

  return (
    <div className="rounded-lg border border-rule-soft bg-paper-2 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="label">Items the model was asked to find</div>
        <div className="mono text-[12.5px] text-ink-3">
          {auto ? "playing · click a value to take over" : "click to change k"}
        </div>
      </div>

      <div className="mt-4 flex gap-2" role="group" aria-label="Number of items, k">
        {LEVELS.map((l, n) => (
          <button
            key={l.k}
            onClick={() => { stop(); setI(n); }}
            aria-pressed={n === i}
            className={`mono flex-1 rounded-md border px-3 py-2 text-[13px] transition-colors ${
              n === i
                ? "border-[var(--color-sea)] bg-[var(--color-accent-soft)] text-[var(--color-sea)]"
                : "border-rule-soft text-ink-3 hover:border-[var(--color-ink-3)]"
            }`}
          >
            k = {l.k}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Arm label="with a JSON schema" tone="sea" k={level.k} {...level.constrained} />
        <Arm label="free generation" tone="coral" k={level.k} {...level.free} />
      </div>

      <p className="mt-6 text-[14.5px] leading-[1.65] text-ink-2">
        {lead > 0 ? (
          <>
            At <span className="mono">k = {level.k}</span> free generation is{" "}
            <strong>ahead by {(lead * 100).toFixed(1)} points</strong>. The schema is
            costing recall here, which is what everyone expects it to do.
          </>
        ) : (
          <>
            At <span className="mono">k = {level.k}</span> free generation is{" "}
            <strong>behind by {(-lead * 100).toFixed(1)} points</strong>
            {level.k === 16 ? " (p = 0.005)" : ""}. It emits{" "}
            <span className="mono">{level.free.emitted}</span> of {level.k} items where the
            schema emits <span className="mono">{level.constrained.emitted}</span>, at the
            same precision. Left to decide when to stop, it stops early.
          </>
        )}
      </p>
    </div>
  );
}

function Arm({ label, tone, k, recall, emitted, precision }: {
  label: string; tone: "sea" | "coral"; k: number;
  recall: number; emitted: number; precision: number;
}) {
  const color = tone === "sea" ? "var(--color-sea)" : "var(--color-coral)";
  const found = Math.round(recall * k);
  const slots = Array.from({ length: k });
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[14.5px] text-ink-2">{label}</div>
        <div className="mono text-[15px]" style={{ color }}>{recall.toFixed(3)}</div>
      </div>

      <div
        className={`mt-3 grid gap-1.5 ${k > 8 ? "grid-cols-8" : k > 3 ? "grid-cols-4" : "grid-cols-1"}`}
        aria-label={`${found} of ${k} items recovered`}
      >
        {slots.map((_, n) => (
          <div
            key={n}
            className="h-5 rounded-[3px] transition-all duration-500"
            style={{
              background: n < found ? color : "var(--color-paper-4)",
              opacity: n < found ? 0.9 : 1,
            }}
          />
        ))}
      </div>

      <div className="mono mt-3 text-[12px] leading-[1.7] text-ink-3">
        {found} of {k} recovered<br />
        {emitted} items emitted · precision {precision.toFixed(3)}
      </div>
    </div>
  );
}
