"use client";

import { useState } from "react";

function Figure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="my-10">
      <div className="rounded-xl border border-rule p-5 sm:p-7">{children}</div>
      <figcaption className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
        <span className="font-medium text-ink">What to look at: </span>
        {caption}
      </figcaption>
    </figure>
  );
}

/* Click a first move and see how often the AI actually solves the puzzle
   from there. The rank-1 move is a dead end; the rank-4 move always works. */

const MOVES = [
  { label: "1 + 1 = 2", rank: 1, success: 0, note: "The AI's own first choice. It never leads to an answer." },
  { label: "11 − 1 = 10", rank: 2, success: 0, note: "Also a dead end." },
  { label: "11 × 1 = 11", rank: 3, success: 4, note: "Works about 40% of the time." },
  { label: "11 + 11 = 22", rank: 4, success: 10, note: "The AI ranked this last. It works every single time." },
];

export function MoveExplorer() {
  const [pick, setPick] = useState(3);
  const m = MOVES[pick];

  return (
    <Figure caption="The AI ranked these four opening moves from best to worst. Click each one to see how often it actually reaches the right answer. Its top choice never works; its last choice always does.">
      <div className="text-[15px] text-ink-3">
        Puzzle: make 24 from the numbers <span className="text-ink">1, 1, 11, 11</span>
      </div>

      <div className="mt-5 space-y-2.5">
        {MOVES.map((mv, i) => (
          <button
            key={mv.label}
            type="button"
            onClick={() => setPick(i)}
            aria-pressed={pick === i}
            className={`flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors ${
              pick === i ? "border-[var(--color-sea)] bg-[var(--color-accent-soft)]" : "border-rule hover:border-ink-3"
            }`}
          >
            <span className="w-28 shrink-0 text-[13px] text-ink-3">
              AI&apos;s pick #{mv.rank}
            </span>
            <span className="flex-1 text-[17px]">{mv.label}</span>
            <span
              className="text-[15px] tnum"
              style={{ color: mv.success === 0 ? "var(--color-coral)" : "var(--color-kelp)" }}
            >
              {mv.success * 10}%
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-paper-2 p-5">
        <div className="text-[15px] text-ink-3">Restarting the puzzle 10 times from “{m.label}”:</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              title={i < m.success ? "solved" : "failed"}
              className="flex h-9 w-9 items-center justify-center rounded text-[13px]"
              style={{
                background: i < m.success ? "var(--color-kelp)" : "var(--color-paper-3)",
                color: i < m.success ? "#fff" : "var(--color-ink-3)",
              }}
            >
              {i < m.success ? "✓" : "✕"}
            </div>
          ))}
        </div>
        <p className="mt-4 text-[16px] leading-[1.65] text-ink-2">{m.note}</p>
      </div>
    </Figure>
  );
}

/* Two tasks, opposite shapes. */

export function TaskShapes() {
  const [task, setTask] = useState<"crossword" | "game24">("crossword");
  const data =
    task === "crossword"
      ? [
          { x: "1 step in", v: 0.18 },
          { x: "4 steps", v: 0.72 },
          { x: "16 steps", v: 0.76 },
          { x: "24 steps", v: 0.87 },
          { x: "32 steps", v: 1.0 },
        ]
      : [
          { x: "1 step in", v: 0.39 },
          { x: "2 steps", v: 0.12 },
        ];

  return (
    <Figure
      caption={
        task === "crossword"
          ? "In crosswords, the further in you get, the more reliable things become — wrong guesses die early, so anything still alive deep in the puzzle is probably right."
          : "In the arithmetic puzzle it is the opposite: the very first move decides almost everything, and things get worse from there."
      }
    >
      <div className="mb-6 flex gap-2">
        {(["crossword", "game24"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTask(k)}
            aria-pressed={task === k}
            className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
              task === k
                ? "border-[var(--color-sea)] bg-[var(--color-accent-soft)] text-[var(--color-sea)]"
                : "border-rule text-ink-2 hover:border-ink-3"
            }`}
          >
            {k === "crossword" ? "Crossword" : "Arithmetic puzzle"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.x} className="flex items-center gap-4">
            <span className="w-24 shrink-0 text-[14px] text-ink-3">{d.x}</span>
            <div className="relative h-8 flex-1 rounded bg-paper-3">
              <div
                className="absolute inset-y-0 left-0 rounded transition-all duration-500"
                style={{ width: `${d.v * 100}%`, background: "var(--color-sea)", opacity: 0.8 }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-[15px] tnum">{Math.round(d.v * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[14px] text-ink-3">
        How often the AI reaches a correct answer from that point.
      </div>
    </Figure>
  );
}
