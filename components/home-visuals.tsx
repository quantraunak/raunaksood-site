"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* The figures on the home page. Each one is the project's own number, drawn
   so it can be read without the paragraph next to it, and each plays once
   when it scrolls into view and then holds its final state. */

function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return { ref, seen };
}

function PanelHead({ left, right }: { left: string; right?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
      <span className="tech text-ink-3">{left}</span>
      {right && <span className="tech text-ink-3">{right}</span>}
    </div>
  );
}

/* ---------------------------------------------------------------- Innovius */

/* Résumé numbers: 90% of the rebuilt model's top-20 picks advanced, against
   20% before; search-agent recall 49% to 93% in backtests. The squares are a
   count, not a ranking: which of the twenty advanced is not shown. */
function PickRow({
  label,
  sub,
  hits,
  seen,
  tone,
  delay,
}: {
  label: string;
  sub: string;
  hits: number;
  seen: boolean;
  tone: "before" | "after";
  delay: number;
}) {
  const fill = tone === "after" ? "var(--color-sea)" : "var(--color-ink-3)";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[14px] text-ink">
          {label} <span className="text-ink-3">· {sub}</span>
        </div>
        <div className="mono text-[13px]" style={{ color: tone === "after" ? "var(--color-sea)" : "var(--color-ink-2)" }}>
          {hits} of 20
        </div>
      </div>
      <div className="mt-2.5 grid gap-[5px]" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}>
        {Array.from({ length: 20 }, (_, i) => {
          const on = i < hits;
          return (
            <span
              key={i}
              className="aspect-square rounded-[3px]"
              style={{
                background: on && seen ? fill : "transparent",
                boxShadow: on && seen ? "none" : "inset 0 0 0 1.2px var(--color-paper-4)",
                transition: "background 260ms ease, box-shadow 260ms ease",
                transitionDelay: `${delay + i * 45}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function RecallBar({ label, pct, seen, strong, delay }: { label: string; pct: number; seen: boolean; strong?: boolean; delay: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[52px] shrink-0 text-[13px] text-ink-3">{label}</span>
      <div className="relative h-[10px] flex-1 rounded-[2px] bg-[var(--color-paper-3)]">
        <div
          className="absolute inset-y-0 left-0 rounded-[2px]"
          style={{
            width: seen ? `${pct}%` : "0%",
            background: strong ? "var(--color-sea)" : "var(--color-ink-3)",
            transition: "width 900ms cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span className="mono w-[38px] shrink-0 text-right text-[13px]" style={{ color: strong ? "var(--color-sea)" : "var(--color-ink-2)" }}>
        {pct}%
      </span>
    </div>
  );
}

export function RankerFigure() {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="border border-rule bg-paper-2">
      <PanelHead left="startup ranking · top 20 picks" right="picks that advanced" />
      <div className="space-y-6 px-5 py-6">
        <PickRow label="Before" sub="the model it replaced" hits={4} seen={seen} tone="before" delay={100} />
        <PickRow label="After" sub="CatBoost + GPT-4o rubric" hits={18} seen={seen} tone="after" delay={500} />
      </div>
      <div className="border-t border-rule px-5 py-5">
        <div className="tech mb-3.5 text-ink-3">search agent recall · 268,000 companies</div>
        <div className="space-y-2.5">
          <RecallBar label="Before" pct={49} seen={seen} delay={1300} />
          <RecallBar label="After" pct={93} seen={seen} strong delay={1500} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Resampled thoughts */

/* One logged puzzle, the same one the write-up uses: "1 1 13 13", llama3.2,
   temperature 0.2, ten re-runs per first move. */
const MOVES = [
  { label: "1 × 1 = 1", rank: 1, success: 0 },
  { label: "13 + 13 = 26", rank: 2, success: 10 },
  { label: "13 − 1 = 12", rank: 3, success: 8 },
  { label: "13 − 13 = 0", rank: 4, success: 0 },
];

export function ResampleFigure() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [step, setStep] = useState(0); // re-runs revealed so far, 0..40
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(40);
      return;
    }
    setStep(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= 40) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, [seen, run]);

  return (
    <div ref={ref} className="border border-rule bg-paper-2">
      <PanelHead left="make 24 from 1, 1, 13, 13" right="ten re-runs per move" />
      <div className="space-y-3.5 px-5 py-6">
        {MOVES.map((m, r) => {
          const shown = Math.max(0, Math.min(10, step - r * 10));
          const done = shown === 10;
          return (
            <div key={m.label} className="flex items-center gap-3">
              <div className="w-[104px] shrink-0 sm:w-[124px]">
                <div className="mono text-[13px] text-ink">{m.label}</div>
                <div className="text-[11.5px] text-ink-3">AI&apos;s pick #{m.rank}</div>
              </div>
              <div className="grid flex-1 gap-[4px]" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}>
                {Array.from({ length: 10 }, (_, i) => {
                  const revealed = i < shown;
                  const ok = i < m.success;
                  return (
                    <span
                      key={i}
                      className="flex aspect-square items-center justify-center rounded-[3px] text-[10px] leading-none"
                      style={{
                        background: !revealed ? "transparent" : ok ? "var(--color-kelp)" : "var(--color-paper-4)",
                        color: ok ? "#fff" : "var(--color-ink-3)",
                        boxShadow: revealed ? "none" : "inset 0 0 0 1.2px var(--color-paper-4)",
                        transition: "background 160ms ease",
                      }}
                    >
                      {revealed ? (ok ? "✓" : "✕") : ""}
                    </span>
                  );
                })}
              </div>
              <span
                className="mono w-[42px] shrink-0 text-right text-[13px] transition-opacity duration-300"
                style={{
                  opacity: done ? 1 : 0,
                  color: m.success === 0 ? "var(--color-coral)" : "var(--color-kelp)",
                }}
              >
                {m.success * 10}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-start justify-between gap-4 border-t border-rule px-5 py-4">
        <p className="text-[13.5px] leading-[1.6] text-ink-2">
          The AI&apos;s first choice never reached 24. Its second choice always did.
        </p>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="tech shrink-0 text-ink-3 transition-colors hover:text-[var(--color-sea)]"
        >
          Replay
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Melange */

/* Screenshots of the shipped app, the same ones on the Melange site. */
const SHOTS = [
  { src: "/melange/explore.webp", alt: "Melange Explore tab: shoots people made together" },
  { src: "/melange/discover.webp", alt: "Melange Discover: a creative's card with pass and heart" },
  { src: "/melange/showcase.webp", alt: "Melange showcase page crediting everyone on a shoot" },
];

export function PhoneRow({ priority = false }: { priority?: boolean }) {
  return (
    <div className="overflow-hidden border border-rule bg-paper-2 px-5 pt-7 sm:px-8 sm:pt-9">
      <div className="mx-auto flex max-w-[460px] items-start justify-center gap-3 sm:gap-4">
        {SHOTS.map((s, i) => (
          <div
            key={s.src}
            className={`relative w-1/3 overflow-hidden rounded-t-[18px] border-[4px] border-b-0 border-[var(--color-ink)] bg-black sm:rounded-t-[22px] ${
              i === 1 ? "" : "mt-7 sm:mt-9"
            }`}
            style={{ aspectRatio: i === 1 ? "603 / 1180" : "603 / 1090" }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 640px) 30vw, 150px"
              priority={priority}
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- small card marks */

function Frame({ H, children }: { H: number; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden border border-rule-soft bg-paper-2 px-5 py-4 transition-colors group-hover:border-[var(--color-rule)]"
      style={{ height: H + 32 }}
    >
      {children}
    </div>
  );
}

const W = 320;

/* cardinality-eval: valid JSON out of 25 responses at each item count.
   Free-form 25, 23, 21; schema-constrained 25, 25, 25. */
export function ValidityMark({ H = 130 }: { H?: number }) {
  const ks = [1, 4, 16];
  const free = [25, 23, 21];
  const cell = 13, gap = 3, groupW = 5 * cell + 4 * gap, between = 30;
  const x0 = (W - (groupW * 3 + between * 2)) / 2, top = 10;
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        {ks.map((k, g) => {
          const gx = x0 + g * (groupW + between);
          return (
            <g key={k}>
              {Array.from({ length: 25 }, (_, n) => {
                const c = n % 5, r = Math.floor(n / 5);
                const bad = n >= free[g];
                return (
                  <rect key={n} x={gx + c * (cell + gap)} y={top + r * (cell + gap)} width={cell} height={cell} rx="2"
                    fill={bad ? "var(--color-coral)" : "var(--color-sea)"} fillOpacity={bad ? 0.9 : 0.22} />
                );
              })}
              <text x={gx + groupW / 2} y={top + groupW + 20} textAnchor="middle" fontSize="10.5"
                fill="var(--color-ink-3)" fontFamily="var(--font-mono)">
                {`${k} item${k > 1 ? "s" : ""} · ${free[g]}/25`}
              </text>
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

/* filing-links: 47 covered names against about 403 tradable on a typical day.
   31 x 13 = 403 dots; the 47 are a fixed scatter, not real positions. */
export function CoverageMark({ H = 130 }: { H?: number }) {
  const cols = 31, rows = 13, total = cols * rows, covered = 47;
  const padX = 8, padY = 6, dx = (W - padX * 2) / (cols - 1), dy = (H - padY * 2 - 20) / (rows - 1);
  const dots = [];
  for (let n = 0; n < total; n++) {
    const c = n % cols, r = Math.floor(n / cols);
    const on = (n * 97 + 13) % total < covered; // 97 is coprime to 403, so exactly 47 land
    dots.push(
      <circle key={n} cx={padX + c * dx} cy={padY + r * dy} r={on ? 3 : 1.5}
        fill={on ? "var(--color-coral)" : "var(--color-paper-4)"} fillOpacity={on ? 0.9 : 1} />,
    );
  }
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        {dots}
        <text x={W / 2} y={H - 3} textAnchor="middle" fontSize="10.5" fill="var(--color-ink-3)" fontFamily="var(--font-mono)">
          47 covered of ~403 tradable names
        </text>
      </svg>
    </Frame>
  );
}

/* Deal Desk: the platform judge disagreed with the rule-based grader on 17 of
   90 answers. On hand review the judge was wrong on 14; 3 were borderline. */
export function JudgeMark({ H = 130 }: { H?: number }) {
  const cell = 13, gap = 3.5, perRow = 15;
  const x0 = (W - (perRow * cell + (perRow - 1) * gap)) / 2, top = 6;
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        {Array.from({ length: 90 }, (_, n) => {
          const c = n % perRow, r = Math.floor(n / perRow);
          const wrong = n >= 73 && n < 87, borderline = n >= 87;
          return (
            <rect key={n} x={x0 + c * (cell + gap)} y={top + r * (cell + gap)} width={cell} height={cell} rx="2"
              fill={wrong ? "var(--color-coral)" : borderline ? "var(--color-sand)" : "var(--color-sea)"}
              fillOpacity={wrong ? 0.9 : borderline ? 0.75 : 0.22} />
          );
        })}
        <text x={W / 2} y={H - 3} textAnchor="middle" fontSize="10.5" fill="var(--color-ink-3)" fontFamily="var(--font-mono)">
          90 answers · LLM judge wrong on 14
        </text>
      </svg>
    </Frame>
  );
}
