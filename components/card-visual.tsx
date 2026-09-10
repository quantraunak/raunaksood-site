"use client";

import q from "@/public/data/quant.json";

/* One small live figure per project card, drawn from the real data. */

export function CardVisual({ index }: { index: number }) {
  if (index === 0) return <Invariance />;
  if (index === 1) return <Tree />;
  return <Phones />;
}

/* Most features hold at exactly zero when a source's clock moves. One does not.
   That gap is what the tool reports. */
function Invariance() {
  const shifts = [0, 0, 0, 0, 0.42, 0, 0, 0, 0, 0.08, 0, 0];
  const W = 560, H = 90, mid = 52;
  const gap = W / shifts.length;
  return (
    <Frame>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }} aria-hidden>
        <line x1="0" y1={mid} x2={W} y2={mid} stroke="var(--color-rule)" strokeWidth="1.5" />
        {shifts.map((v, i) => {
          const x = gap * i + gap * 0.5;
          if (v === 0) {
            return <circle key={i} cx={x} cy={mid} r="3.5" fill="none"
              stroke="var(--color-ink-3)" strokeWidth="1.4" strokeDasharray="2 2" />;
          }
          const h = v * 42;
          return <rect key={i} x={x - 7} y={mid - h} width="14" height={h} rx="2"
            fill="var(--color-coral)" fillOpacity="0.85" />;
        })}
      </svg>
    </Frame>
  );
}

function Equity() {
  const pts = q.equity.filter((_, i) => i % 4 === 0).map((p) => p.v);
  const lo = Math.min(...pts), hi = Math.max(...pts), span = hi - lo || 1;
  const W = 560, H = 90;
  const d = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (pts.length - 1)) * W).toFixed(1)},${((1 - (v - lo) / span) * (H - 10) + 5).toFixed(1)}`)
    .join("");
  return (
    <Frame>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }} aria-hidden>
        <path d={`${d}L${W},${H}L0,${H}Z`} fill="var(--color-sea)" fillOpacity="0.08" />
        <path d={d} fill="none" stroke="var(--color-sea)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </Frame>
  );
}

function Tree() {
  const nodes = [
    [280, 14], [150, 50], [280, 50], [410, 50],
    [90, 82], [210, 82], [350, 82], [470, 82],
  ];
  const edges = [[0,1],[0,2],[0,3],[1,4],[1,5],[3,6],[3,7]];
  const dead = new Set([2, 4, 7]);
  return (
    <Frame>
      <svg viewBox="0 0 560 90" className="w-full" style={{ height: 90 }} aria-hidden>
        {edges.map(([a, b]) => (
          <line key={`${a}${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="var(--color-rule)" strokeWidth="1.5" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7"
            fill={dead.has(i) ? "var(--color-paper-3)" : "var(--color-kelp)"}
            fillOpacity={dead.has(i) ? 1 : 0.85} />
        ))}
      </svg>
    </Frame>
  );
}

function Phones() {
  return (
    <Frame>
      <svg viewBox="0 0 560 90" className="w-full" style={{ height: 90 }} aria-hidden>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${210 + i * 48}, 10) rotate(${(i - 1) * 5} 35 35)`}>
            <rect width="70" height="70" rx="9" fill="#fff" stroke="var(--color-rule)" strokeWidth="1.5" />
            <rect x="10" y="10" width="50" height="32" rx="4" fill="var(--color-coral)" fillOpacity={0.18 + i * 0.08} />
            <rect x="10" y="48" width="34" height="4" rx="2" fill="var(--color-ink-3)" opacity="0.4" />
            <rect x="10" y="57" width="22" height="4" rx="2" fill="var(--color-ink-3)" opacity="0.25" />
          </g>
        ))}
      </svg>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-lg bg-paper-2 px-4 py-3">{children}</div>;
}
