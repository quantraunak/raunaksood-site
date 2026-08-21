"use client";

import { useMemo, useState } from "react";
import r from "@/public/data/reasoning.json";

const COLOR: Record<string, string> = {
  critical: "var(--color-teal)",
  redundant_viable: "var(--color-ochre)",
  mixed: "var(--color-ink-3)",
  misleading: "var(--color-clay)",
  dead_end: "var(--color-ink-3)",
};
const OPACITY: Record<string, number> = {
  critical: 0.9,
  redundant_viable: 0.9,
  mixed: 0.55,
  misleading: 0.9,
  dead_end: 0.25,
};

/* --------------------------------------------------- resampling explainer */

/** The method, made operable: freeze a node, restart search M times, count. */
export function ResamplingDemo() {
  const [trials, setTrials] = useState(10);
  const [pick, setPick] = useState<"critical" | "mixed" | "dead_end">("mixed");

  const trueP = pick === "critical" ? 0.95 : pick === "mixed" ? 0.4 : 0.02;

  // Deterministic pseudo-random so the figure is stable across renders.
  const outcomes = useMemo(() => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    return Array.from({ length: trials }, () => rand() < trueP);
  }, [trials, trueP]);

  const hits = outcomes.filter(Boolean).length;
  const phat = hits / trials;
  const category = phat <= 0.05 ? "dead_end" : phat >= 0.75 ? "critical" : "mixed";

  return (
    <div className="rounded-lg border border-rule-soft bg-paper-2 p-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="eyebrow mb-2.5">Frozen state</div>
          <div className="flex gap-1 rounded-md border border-rule-soft bg-paper p-1">
            {(["critical", "mixed", "dead_end"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setPick(k)}
                aria-pressed={pick === k}
                className={`rounded px-3 py-1.5 mono text-[11px] transition-colors ${
                  pick === k ? "bg-paper-3 text-ink" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {k.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2.5">Trials per node · M = {trials}</div>
          <input
            type="range"
            min={4}
            max={40}
            step={2}
            value={trials}
            onChange={(e) => setTrials(Number(e.target.value))}
            className="w-[200px] accent-[var(--color-ochre)]"
            aria-label="Resampling trials per node"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-[5px]">
        {outcomes.map((ok, i) => (
          <div
            key={i}
            title={ok ? "reached a solution" : "no solution"}
            className="h-6 w-6 rounded-[3px] transition-colors"
            style={{
              background: ok ? "var(--color-teal)" : "var(--color-paper-3)",
              opacity: ok ? 0.85 : 1,
            }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-9 gap-y-3 rule-soft pt-5">
        <Figure label="p̂(v)" value={phat.toFixed(2)} note={`${hits} of ${trials}`} />
        <Figure label="resolution" value={`±${(1 / trials).toFixed(2)}`} note="Monte Carlo increment" />
        <Figure
          label="assigned category"
          value={category.replace("_", " ")}
          color={COLOR[category]}
        />
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-ink-3">
        At M = 10 — the budget used in the paper — p̂ can only take eleven values, so the categories
        are operational labels under a fixed search policy, not intrinsic properties of the state.
        Raise M and the estimate sharpens; the cost is linear in trials × nodes.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ tree explorer */

type Node = {
  id: number;
  parent: number | null;
  depth: number;
  rank: number;
  label: string;
  category: string;
  utility: number;
};

/* A depth-3 Game24 tree in the shape the paper describes: branch factor 4,
   most first moves dead, a lower-ranked move carrying the solution. */
const TREE: Node[] = [
  { id: 0, parent: null, depth: 0, rank: 0, label: "1 1 11 11", category: "critical", utility: 1.0 },
  { id: 1, parent: 0, depth: 1, rank: 1, label: "1 + 1 = 2", category: "dead_end", utility: 0.0 },
  { id: 2, parent: 0, depth: 1, rank: 2, label: "11 − 1 = 10", category: "dead_end", utility: 0.0 },
  { id: 3, parent: 0, depth: 1, rank: 3, label: "11 × 1 = 11", category: "mixed", utility: 0.4 },
  { id: 4, parent: 0, depth: 1, rank: 4, label: "11 + 11 = 22", category: "critical", utility: 1.0 },
  { id: 5, parent: 3, depth: 2, rank: 1, label: "11 + 1 = 12", category: "dead_end", utility: 0.0 },
  { id: 6, parent: 3, depth: 2, rank: 2, label: "11 × 11 = 121", category: "dead_end", utility: 0.0 },
  { id: 7, parent: 4, depth: 2, rank: 1, label: "1 + 1 = 2", category: "critical", utility: 1.0 },
  { id: 8, parent: 4, depth: 2, rank: 2, label: "1 − 1 = 0", category: "redundant_viable", utility: 0.9 },
  { id: 9, parent: 7, depth: 3, rank: 1, label: "22 + 2 = 24 ✓", category: "critical", utility: 1.0 },
  { id: 10, parent: 8, depth: 3, rank: 1, label: "22 + 0 ≠ 24", category: "dead_end", utility: 0.0 },
];

export function TreeExplorer() {
  const [selected, setSelected] = useState<number>(4);
  const [ablated, setAblated] = useState<Set<number>>(new Set());

  const W = 720;
  const rowH = 78;
  const byDepth = useMemo(() => {
    const m = new Map<number, Node[]>();
    TREE.forEach((n) => m.set(n.depth, [...(m.get(n.depth) ?? []), n]));
    return m;
  }, []);

  const pos = useMemo(() => {
    const p = new Map<number, { x: number; y: number }>();
    byDepth.forEach((nodes, depth) => {
      nodes.forEach((n, i) => {
        p.set(n.id, { x: ((i + 1) / (nodes.length + 1)) * W, y: 26 + depth * rowH });
      });
    });
    return p;
  }, [byDepth]);

  const isCut = (id: number): boolean => {
    let cur: Node | undefined = TREE.find((n) => n.id === id);
    while (cur) {
      if (ablated.has(cur.id)) return true;
      cur = TREE.find((n) => n.id === cur!.parent);
    }
    return false;
  };

  const live = TREE.filter((n) => !isCut(n.id));
  const solutionLeaves = live.filter((n) => n.label.includes("✓")).length;
  const node = TREE.find((n) => n.id === selected)!;
  const H = 26 + 3 * rowH + 30;

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_270px]">
        <div className="scroll-x rounded-lg border border-rule-soft bg-paper-2 p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px]" role="img" aria-label="Tree-of-Thought search tree">
            {TREE.filter((n) => n.parent !== null).map((n) => {
              const a = pos.get(n.parent!)!;
              const b = pos.get(n.id)!;
              const cut = isCut(n.id);
              return (
                <path
                  key={n.id}
                  d={`M${a.x},${a.y + 13} C${a.x},${a.y + 44} ${b.x},${b.y - 44} ${b.x},${b.y - 13}`}
                  fill="none"
                  stroke={cut ? "var(--color-clay)" : "var(--color-rule)"}
                  strokeWidth={cut ? 1.2 : 1.4}
                  strokeDasharray={cut ? "3 3" : undefined}
                />
              );
            })}
            {TREE.map((n) => {
              const pt = pos.get(n.id)!;
              const cut = isCut(n.id);
              const active = selected === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${pt.x},${pt.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelected(n.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(n.id)}
                >
                  <circle
                    r={active ? 13 : 11}
                    fill={COLOR[n.category]}
                    fillOpacity={cut ? 0.12 : OPACITY[n.category]}
                    stroke={active ? "var(--color-ink)" : "transparent"}
                    strokeWidth="1.6"
                  />
                  {n.depth > 0 && (
                    <text y={-19} textAnchor="middle" className="mono" fontSize="9" fill="var(--color-ink-3)">
                      r{n.rank}
                    </text>
                  )}
                  <text
                    y={30}
                    textAnchor="middle"
                    className="mono"
                    fontSize="10"
                    fill={cut ? "var(--color-ink-3)" : "var(--color-ink-2)"}
                    opacity={cut ? 0.4 : 1}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div>
          <div className="rounded-lg border border-rule-soft bg-paper-2 p-5">
            <div className="eyebrow">Selected node</div>
            <div className="mono mt-2 text-[15px]">{node.label}</div>
            <div className="mt-4 space-y-2.5">
              <Row label="depth" value={String(node.depth)} />
              {node.depth > 0 && <Row label="local rank" value={`${node.rank} of 4`} />}
              <Row label="p̂(v)" value={node.utility.toFixed(2)} />
              <Row label="category" value={node.category.replace("_", " ")} color={COLOR[node.category]} />
            </div>
            <button
              onClick={() =>
                setAblated((prev) => {
                  const next = new Set(prev);
                  next.has(node.id) ? next.delete(node.id) : next.add(node.id);
                  return next;
                })
              }
              disabled={node.depth === 0}
              className="mt-5 w-full rounded border border-rule px-3 py-2 mono text-[11.5px] text-ink-2 transition-colors hover:border-ochre hover:text-ochre disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink-2"
            >
              {ablated.has(node.id) ? "restore branch" : "ablate branch"}
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-rule-soft bg-paper-2 p-5">
            <div className="eyebrow">Tree after ablation</div>
            <div className="mt-3 space-y-2.5">
              <Row label="nodes reachable" value={`${live.length} of ${TREE.length}`} />
              <Row
                label="solution leaves"
                value={String(solutionLeaves)}
                color={solutionLeaves === 0 ? "var(--color-clay)" : "var(--color-teal)"}
              />
            </div>
            {ablated.size > 0 && (
              <button
                onClick={() => setAblated(new Set())}
                className="mt-4 mono text-[11px] text-ink-3 underline hover:text-ochre"
              >
                reset
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-[680px] text-[13.5px] leading-relaxed text-ink-3">
        Click any node to inspect it, then ablate a branch to see what the rest of the tree loses.
        Note the rank labels: the top-ranked first move <span className="mono">1 + 1 = 2</span> is a
        dead end, while the rank-4 move <span className="mono">11 + 11 = 22</span> carries the whole
        solution. That inversion is the paper&apos;s central point, and it is drawn from a real
        logged tree.
      </p>
    </div>
  );
}

/* ------------------------------------------------------- depth-utility curve */

export function DepthCurve() {
  const [task, setTask] = useState<"game24" | "crossword">("crossword");
  const [temp, setTemp] = useState<"0.0" | "0.2">("0.0");

  const rows =
    task === "game24"
      ? r.depth_game24.filter((d) => d.temp === temp).map((d) => ({ depth: d.depth, success: d.success, n: d.n }))
      : r.depth_crossword.filter((d) => d.temp === temp).map((d) => ({ depth: d.depth, success: d.success, n: d.n }));

  const W = 640;
  const H = 240;
  const maxDepth = Math.max(...rows.map((d) => d.depth));
  const x = (d: number) => 40 + (d / maxDepth) * (W - 70);
  const y = (v: number) => 18 + (1 - v) * (H - 56);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Segmented
          options={[
            { value: "crossword", label: "Crossword" },
            { value: "game24", label: "Game24" },
          ]}
          value={task}
          onChange={(v) => setTask(v as typeof task)}
        />
        <Segmented
          options={[
            { value: "0.0", label: "T = 0.0" },
            { value: "0.2", label: "T = 0.2" },
          ]}
          value={temp}
          onChange={(v) => setTemp(v as typeof temp)}
        />
      </div>

      <div className="scroll-x mt-6 rounded-lg border border-rule-soft bg-paper-2 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[460px]" role="img" aria-label="Depth versus empirical success">
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <g key={g}>
              <line x1={38} y1={y(g)} x2={W - 24} y2={y(g)} stroke="var(--color-rule)" strokeWidth="1" strokeDasharray={g === 0 ? undefined : "2 4"} />
              <text x={30} y={y(g) + 3.5} textAnchor="end" className="mono" fontSize="9.5" fill="var(--color-ink-3)">
                {g.toFixed(2)}
              </text>
            </g>
          ))}
          <polyline
            points={rows.map((d) => `${x(d.depth)},${y(d.success)}`).join(" ")}
            fill="none"
            stroke={task === "crossword" ? "var(--color-teal)" : "var(--color-ochre)"}
            strokeWidth="1.8"
          />
          {rows.map((d) => (
            <g key={d.depth}>
              <circle
                cx={x(d.depth)}
                cy={y(d.success)}
                r={Math.max(3.5, Math.min(9, Math.sqrt(d.n)))}
                fill={task === "crossword" ? "var(--color-teal)" : "var(--color-ochre)"}
                fillOpacity="0.28"
              />
              <circle cx={x(d.depth)} cy={y(d.success)} r="3" fill={task === "crossword" ? "var(--color-teal)" : "var(--color-ochre)"} />
              <text x={x(d.depth)} y={H - 20} textAnchor="middle" className="mono" fontSize="9.5" fill="var(--color-ink-3)">
                {d.depth}
              </text>
              <text x={x(d.depth)} y={H - 8} textAnchor="middle" className="mono" fontSize="8.5" fill="var(--color-ink-3)" opacity="0.65">
                n={d.n}
              </text>
            </g>
          ))}
          <text x={38} y={H - 30} className="mono" fontSize="9" fill="var(--color-ink-3)" letterSpacing="0.1em">
            DEPTH →
          </text>
        </svg>
      </div>

      <p className="mt-5 max-w-[680px] text-[13.5px] leading-relaxed text-ink-3">
        {task === "crossword"
          ? "In crossword fill, depth-1 states succeed only 18% of the time, but selected surviving states at depth 32 reach 1.00. Wrong early fills collapse immediately under crossing constraints; whatever is still alive deep in the tree has passed many compatibility checks and has little search left to get wrong. The deepest bins are small — treat them as evidence about selected survivors, not a universal claim."
          : "In Game24 the curve runs the other way: depth-1 states average 0.39 success and depth-2 only 0.11. With exactly three operations, the first move opens or closes large regions of the remaining space. Depth is a task-geometry signal, not a universal law."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------- ablation panel */

export function AblationPanel() {
  const [metric, setMetric] = useState<"solve_drop" | "leaf_drop">("leaf_drop");
  const rows = r.ablation.by_category;
  const max = Math.max(...rows.map((d) => Math.abs(d[metric])));

  return (
    <div>
      <Segmented
        options={[
          { value: "leaf_drop", label: "Successful-leaf drop" },
          { value: "solve_drop", label: "Binary solve-rate drop" },
        ]}
        value={metric}
        onChange={(v) => setMetric(v as typeof metric)}
      />

      <div className="mt-7 space-y-1.5">
        {rows.map((d) => {
          const v = d[metric];
          const pct = (Math.abs(v) / max) * 50;
          return (
            <div key={d.category} className="grid grid-cols-[minmax(0,140px)_1fr_74px] items-center gap-3">
              <div className="mono text-[11.5px] text-ink-2">{d.category.replace("_", " ")}</div>
              <div className="relative h-[19px]">
                <div className="absolute inset-y-0 left-1/2 w-px bg-rule" />
                <div
                  className="absolute inset-y-[3px] rounded-[1px]"
                  style={{
                    left: v >= 0 ? "50%" : `${50 - pct}%`,
                    width: `${pct}%`,
                    background: v >= 0 ? "var(--color-teal)" : "var(--color-clay)",
                    opacity: 0.8,
                  }}
                />
              </div>
              <div className="mono text-right text-[11.5px] tnum text-ink-2">{v.toFixed(3)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-rule-soft bg-paper-2 p-5">
          <div className="eyebrow mb-3">Whole-tree effect</div>
          <div className="space-y-2.5">
            <Row label="baseline solve rate" value={r.ablation.overall.base_solve.toFixed(4)} />
            <Row label="ablated solve rate" value={r.ablation.overall.abl_solve.toFixed(4)} />
            <Row label="Δ solve" value={r.ablation.overall.d_solve.toFixed(4)} color="var(--color-ink-3)" />
          </div>
        </div>
        <div className="rounded-lg border border-rule-soft bg-paper-2 p-5">
          <div className="eyebrow mb-3">What binary success hides</div>
          <div className="space-y-2.5">
            <Row label="baseline leaves" value={r.ablation.overall.base_leaves.toFixed(4)} />
            <Row label="ablated leaves" value={r.ablation.overall.abl_leaves.toFixed(4)} />
            <Row label="Δ leaves" value={r.ablation.overall.d_leaves.toFixed(4)} color="var(--color-teal)" />
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-[680px] text-[13.5px] leading-relaxed text-ink-3">
        Measured only by whether a puzzle still solves at least once, ablation looks{" "}
        <span className="text-ink-2">neutral</span> — Δ solve is −0.0016. Measured by how many
        successful leaves remain, it is not: redundant-viable branches shed 1.78 solutions each. A
        tree with one solution and a tree with seven are not the same tree, and final-answer
        accuracy cannot tell them apart.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- helpers */

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-md border border-rule-soft bg-paper-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
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

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="mono text-[11.5px] text-ink-3">{label}</span>
      <span className="mono text-[12.5px] tnum" style={{ color: color ?? "var(--color-ink)" }}>
        {value}
      </span>
    </div>
  );
}

function Figure({ label, value, note, color }: { label: string; value: string; note?: string; color?: string }) {
  return (
    <div>
      <div className="mono text-[19px] tnum" style={{ color: color ?? "var(--color-ink)" }}>
        {value}
      </div>
      <div className="eyebrow mt-1">{label}</div>
      {note && <div className="mono mt-0.5 text-[10.5px] text-ink-3">{note}</div>}
    </div>
  );
}
