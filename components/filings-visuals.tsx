"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/* Why the study stopped. Each dot is a company trading on a given day; the lit
   ones are the companies the extracted graph actually says something about. */
export function CoverageFigure() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const cols = 30, rows = 14, total = cols * rows, covered = 27;
  const dots: React.ReactElement[] = [];
  let filled = 0;
  for (let n = 0; n < total; n++) {
    const on = n % 15 === 7 && filled < covered;
    if (on) filled += 1;
    dots.push(
      <div
        key={n}
        className="aspect-square rounded-full"
        style={{
          background: on ? "var(--color-coral)" : "var(--color-rule)",
          opacity: seen ? (on ? 0.95 : 1) : 0.25,
          transform: seen && on ? "scale(1.35)" : "scale(1)",
          transition: `opacity 500ms ${(n % 40) * 12}ms, transform 500ms ${(n % 40) * 12}ms`,
        }}
      />
    );
  }
  return (
    <figure ref={ref} className="my-10">
      <div className="rounded-lg border border-rule-soft bg-paper-2 px-6 py-6">
        <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {dots}
        </div>
        <div className="mono mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-ink-3">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-coral)" }} />
            27 covered
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-rule)" }} />
            ~420 tradable
          </span>
          <span>6.4%</span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-[1.6] text-ink-3">
        Companies the graph can say something about on a typical day, against every company
        trading that day. A return test needs roughly 145 lit dots to say anything. This is 27.
      </figcaption>
    </figure>
  );
}

/* The disclosure asymmetry, which is the actual finding: filers are compelled to
   name customers and never suppliers, so the corpus is lopsided by law. */
export function AsymmetryFigure() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const rows = [
    { label: "customer", n: 668, color: "var(--color-sea)" },
    { label: "partner", n: 276, color: "var(--color-kelp)" },
    { label: "supplier", n: 241, color: "var(--color-coral)" },
  ];
  const max = 668;
  return (
    <figure ref={ref} className="my-10">
      <div className="rounded-lg border border-rule-soft bg-paper-2 px-6 py-6">
        <div className="space-y-4">
          {rows.map((r, i) => (
            <div key={r.label} className="flex items-center gap-4">
              <div className="mono w-20 shrink-0 text-right text-[12.5px] text-ink-3">{r.label}</div>
              <div className="h-8 flex-1 overflow-hidden rounded-[4px] bg-paper-4">
                <div
                  className="flex h-full items-center justify-end rounded-[4px] pr-2.5"
                  style={{
                    width: seen ? `${(r.n / max) * 100}%` : "0%",
                    background: r.color,
                    opacity: 0.85,
                    transition: `width 950ms cubic-bezier(.4,0,.2,1) ${i * 140}ms`,
                  }}
                >
                  <span className="mono text-[12px] text-white">{r.n}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-[1.6] text-ink-3">
        Relationships extracted, by type. Companies name their customers nearly three times
        as often as their suppliers — not by preference, but because Regulation S-K compels
        one disclosure and not the other.
      </figcaption>
    </figure>
  );
}
