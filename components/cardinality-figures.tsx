"use client";

import { useEffect, useRef, useState } from "react";

/* Two figures that carry an argument the prose cannot make as quickly: the
   crossover, and the dilution measurement that explains why the instrument
   failed its own gate three times. Both animate once on entry -- the line draws
   in the direction you read it -- and both hold their final state. */

function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/* Recall against k for both decoding arms, on the same 75 documents each. */
export function CrossoverFigure() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const ks = [1, 4, 16];
  const constrained = [0.44, 0.64, 0.554];
  const free = [0.64, 0.53, 0.426];
  const [hover, setHover] = useState<number | null>(null);

  const W = 620, H = 300, L = 54, R = 118, T = 24, B = 54;
  const x = (i: number) => L + (i / (ks.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - 0.36) / 0.32) * (H - T - B);
  const line = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <figure ref={ref} className="my-10">
      <div className="overflow-hidden rounded-lg border border-rule-soft bg-paper-2 px-4 py-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}
             role="img" aria-label="Recall against number of items for both decoding arms">
          {[0.4, 0.5, 0.6].map((g) => (
            <g key={g}>
              <line x1={L} y1={y(g)} x2={W - R} y2={y(g)} stroke="var(--color-rule-soft)" strokeWidth="1" />
              <text x={L - 10} y={y(g) + 4} textAnchor="end" fontSize="11"
                    fill="var(--color-ink-3)" fontFamily="var(--font-mono)">{g.toFixed(1)}</text>
            </g>
          ))}
          <line x1={L} y1={y(0.36)} x2={W - R} y2={y(0.36)} stroke="var(--color-rule)" strokeWidth="1.5" />
          {ks.map((k, i) => (
            <text key={k} x={x(i)} y={H - 26} textAnchor="middle" fontSize="12"
                  fill="var(--color-ink-3)" fontFamily="var(--font-mono)">k = {k}</text>
          ))}

          {[
            { d: line(constrained), c: "var(--color-sea)", dash: "none" },
            { d: line(free), c: "var(--color-coral)", dash: "7 4" },
          ].map((s, n) => (
            <path key={n} d={s.d} fill="none" stroke={s.c} strokeWidth="2.6"
                  strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dash === "none" ? undefined : s.dash}
                  style={{
                    strokeDasharray: s.dash === "none" ? 900 : undefined,
                    strokeDashoffset: s.dash === "none" ? (seen ? 0 : 900) : undefined,
                    transition: "stroke-dashoffset 1100ms cubic-bezier(.4,0,.2,1)",
                    opacity: s.dash === "none" ? 1 : seen ? 1 : 0,
                    transitionProperty: "stroke-dashoffset, opacity",
                    transitionDelay: s.dash === "none" ? "0ms" : "500ms",
                  }} />
          ))}

          {ks.map((k, i) => (
            <g key={k} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x(i) - 26} y={T} width="52" height={H - T - B} fill="transparent" />
              <circle cx={x(i)} cy={y(constrained[i])} r={hover === i ? 6 : 4.5} fill="var(--color-sea)"
                      style={{ transition: "r 150ms" }} />
              <circle cx={x(i)} cy={y(free[i])} r={hover === i ? 6 : 4.5} fill="var(--color-coral)"
                      style={{ transition: "r 150ms" }} />
              {hover === i && (
                <text x={x(i)} y={T - 6} textAnchor="middle" fontSize="11.5"
                      fill="var(--color-ink-2)" fontFamily="var(--font-mono)">
                  {constrained[i].toFixed(3)} vs {free[i].toFixed(3)}
                </text>
              )}
            </g>
          ))}

          <text x={W - R + 12} y={y(constrained[2]) + 4} fontSize="12.5"
                fill="var(--color-sea)" fontFamily="var(--font-mono)">schema</text>
          <text x={W - R + 12} y={y(free[2]) + 4} fontSize="12.5"
                fill="var(--color-coral)" fontFamily="var(--font-mono)">free</text>
        </svg>
      </div>
      <figcaption className="mt-3 text-[13px] leading-[1.6] text-ink-3">
        Recall against the number of items to emit, same 75 documents per arm. The arms cross
        between k = 1 and k = 4. At k = 16 the gap is 0.128, p = 0.005. Hover a level for the
        pair.
      </figcaption>
    </figure>
  );
}

/* One item, one document, only the haystack changing. This is the measurement
   that explained three failed gates. */
export function DilutionFigure() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const bars = [
    { chars: "1,500", recall: 0.667 },
    { chars: "4,000", recall: 0.583 },
    { chars: "14,000", recall: 0.417 },
  ];
  return (
    <figure ref={ref} className="my-10">
      <div className="rounded-lg border border-rule-soft bg-paper-2 px-6 py-6">
        <div className="space-y-4">
          {bars.map((b, i) => (
            <div key={b.chars} className="flex items-center gap-4">
              <div className="mono w-24 shrink-0 text-right text-[12.5px] text-ink-3">
                {b.chars}
              </div>
              <div className="h-7 flex-1 overflow-hidden rounded-[4px] bg-paper-4">
                <div
                  className="h-full rounded-[4px]"
                  style={{
                    width: seen ? `${b.recall * 100}%` : "0%",
                    background: "var(--color-kelp)",
                    opacity: 0.85,
                    transition: `width 900ms cubic-bezier(.4,0,.2,1) ${i * 130}ms`,
                  }}
                />
              </div>
              <div className="mono w-14 shrink-0 text-[13px] text-ink-2">
                {b.recall.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-[1.6] text-ink-3">
        The same sentence, the same single item, only the amount of surrounding filler
        changing. Dilution alone is worth 0.25 recall, which is why the k = 1 sanity gate
        failed three times before the cause was measured rather than guessed.
      </figcaption>
    </figure>
  );
}
