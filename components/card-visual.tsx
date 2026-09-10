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

/* Two clients, one database. The interesting thing about this app is the shape,
   not that it has screens. */
function Phones() {
  const ink = "var(--color-ink-3)";
  const line = "var(--color-rule)";
  return (
    <Frame>
      <svg viewBox="0 0 560 108" className="w-full" style={{ height: 108 }} aria-hidden>
        {/* iOS client */}
        <rect x="150" y="6" width="42" height="62" rx="7" fill="none" stroke={ink} strokeWidth="1.4" />
        <rect x="157" y="15" width="28" height="34" rx="3" fill="var(--color-coral)" fillOpacity="0.14" />
        <line x1="161" y1="56" x2="181" y2="56" stroke={line} strokeWidth="2.5" strokeLinecap="round" />

        {/* web client */}
        <rect x="330" y="10" width="84" height="54" rx="6" fill="none" stroke={ink} strokeWidth="1.4" />
        <line x1="330" y1="23" x2="414" y2="23" stroke={ink} strokeWidth="1.2" />
        <circle cx="338" cy="16.5" r="2" fill={ink} />
        <rect x="339" y="32" width="30" height="22" rx="3" fill="var(--color-coral)" fillOpacity="0.14" />
        <line x1="377" y1="34" x2="405" y2="34" stroke={line} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="377" y1="42" x2="399" y2="42" stroke={line} strokeWidth="2.5" strokeLinecap="round" />

        {/* both down to one database */}
        <path d="M171 68 L171 82 Q171 88 177 88 L275 88" fill="none" stroke={line} strokeWidth="1.3" />
        <path d="M372 64 L372 82 Q372 88 366 88 L285 88" fill="none" stroke={line} strokeWidth="1.3" />
        <ellipse cx="280" cy="88" rx="17" ry="5.5" fill="none" stroke={ink} strokeWidth="1.4" />
        <path d="M263 88 L263 99 Q263 104 280 104 Q297 104 297 99 L297 88" fill="none" stroke={ink} strokeWidth="1.4" />

        <text x="171" y="80" textAnchor="middle" fontSize="7.5" fill={ink} fontFamily="var(--font-mono)">iOS</text>
        <text x="372" y="77" textAnchor="middle" fontSize="7.5" fill={ink} fontFamily="var(--font-mono)">WEB</text>
      </svg>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-lg border border-rule-soft bg-paper-2 px-5 py-4">{children}</div>;
}
