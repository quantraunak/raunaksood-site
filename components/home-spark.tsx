"use client";

import quant from "@/public/data/quant.json";

/* Each card carries a small, real figure rather than an ornament: the equity
   curve is the actual run, the tree is the actual node taxonomy, the deck is
   the actual product surface. */

export function HomeSpark({ index, accent }: { index: number; accent: string }) {
  if (index === 0) return <EquitySpark accent={accent} />;
  if (index === 1) return <TreeSpark accent={accent} />;
  return <DeckSpark accent={accent} />;
}

function EquitySpark({ accent }: { accent: string }) {
  const pts = quant.equity.filter((_, i) => i % 3 === 0).map((p) => p.v);
  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  const span = hi - lo || 1;
  const W = 300;
  const H = 104;
  const d = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (pts.length - 1)) * W).toFixed(1)},${((1 - (v - lo) / span) * H).toFixed(1)}`)
    .join("");
  const base = (1 - (1 - lo) / span) * H;

  return (
    <Frame label="equity, net of costs">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[104px]" aria-hidden>
        <line x1="0" y1={base} x2={W} y2={base} stroke="var(--color-rule)" strokeDasharray="3 4" />
        <path d={`${d}L${W},${H}L0,${H}Z`} fill={accent} fillOpacity="0.1" />
        <path d={d} fill="none" stroke={accent} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </Frame>
  );
}

function TreeSpark({ accent }: { accent: string }) {
  /* Depth-3 search tree; leaves shaded by the paper's node categories. */
  const nodes: { x: number; y: number; kind: "critical" | "dead" | "redundant" }[] = [
    { x: 150, y: 12, kind: "critical" },
    { x: 70, y: 48, kind: "critical" },
    { x: 150, y: 48, kind: "dead" },
    { x: 230, y: 48, kind: "redundant" },
    { x: 34, y: 88, kind: "critical" },
    { x: 106, y: 88, kind: "dead" },
    { x: 196, y: 88, kind: "redundant" },
    { x: 264, y: 88, kind: "dead" },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3],
    [1, 4], [1, 5], [3, 6], [3, 7],
  ];
  const fill = (k: string) =>
    k === "critical" ? accent : k === "redundant" ? "var(--color-ochre)" : "var(--color-ink-3)";

  return (
    <Frame label="node utility, by category">
      <svg viewBox="0 0 300 104" className="w-full h-[104px]" aria-hidden>
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="var(--color-rule)"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i === 0 ? 6 : 5}
            fill={fill(n.kind)}
            fillOpacity={n.kind === "dead" ? 0.28 : 0.9}
          />
        ))}
      </svg>
    </Frame>
  );
}

function DeckSpark({ accent }: { accent: string }) {
  return (
    <Frame label="swipe deck · ios & web">
      <svg viewBox="0 0 300 104" className="w-full h-[104px]" aria-hidden>
        {[
          { x: 118, r: -7, o: 0.22 },
          { x: 108, r: -3.5, o: 0.42 },
          { x: 98, r: 0, o: 1 },
        ].map((c, i) => (
          <g key={i} transform={`rotate(${c.r} ${c.x + 52} 52)`}>
            <rect
              x={c.x}
              y={14}
              width={104}
              height={76}
              rx={9}
              fill="var(--color-paper-2)"
              stroke={i === 2 ? accent : "var(--color-rule)"}
              strokeWidth={i === 2 ? 1.4 : 1}
              opacity={c.o}
            />
            {i === 2 && (
              <>
                <rect x={c.x + 12} y={26} width={38} height={38} rx={5} fill={accent} fillOpacity="0.2" />
                <rect x={c.x + 58} y={28} width={34} height={5} rx={2.5} fill="var(--color-ink-3)" opacity="0.55" />
                <rect x={c.x + 58} y={39} width={24} height={5} rx={2.5} fill="var(--color-ink-3)" opacity="0.35" />
                <rect x={c.x + 12} y={72} width={80} height={6} rx={3} fill={accent} fillOpacity="0.35" />
              </>
            )}
          </g>
        ))}
      </svg>
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-rule-soft bg-paper-2 px-4 pb-3 pt-3">
      {children}
      <div className="eyebrow mt-1">{label}</div>
    </div>
  );
}
