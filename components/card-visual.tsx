"use client";

import q from "@/public/data/quant.json";

/* One live figure per project card, drawn from the real data and sized to be the
   card rather than a strip inside it. Every figure takes a height and lays itself
   out from it, so the same drawing works at 90px in a list and 240px in a grid. */

export function CardVisual({ index, height = 90 }: { index: number; height?: number }) {
  if (index === 0) return <Invariance H={height} />;
  if (index === 1) return <Tree H={height} />;
  if (index === 2) return <Crossover H={height} />;
  if (index === 3) return <Coverage H={height} />;
  return <Phones H={height} />;
}

const W = 560;

/* Most features hold at exactly zero when a source's clock moves. One does not.
   That gap is what the tool reports. */
function Invariance({ H }: { H: number }) {
  const shifts = [0, 0, 0, 0, 0.42, 0, 0, 0, 0, 0.08, 0, 0];
  const mid = H * 0.58, gap = W / shifts.length, r = Math.max(3.5, H * 0.04);
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        <line x1="0" y1={mid} x2={W} y2={mid} stroke="var(--color-rule)" strokeWidth="1.5" />
        {shifts.map((v, i) => {
          const x = gap * i + gap * 0.5;
          if (v === 0) {
            return <circle key={i} cx={x} cy={mid} r={r} fill="none"
              stroke="var(--color-ink-3)" strokeWidth="1.4" strokeDasharray="2 2" />;
          }
          const h = v * H * 0.48, w = Math.max(14, H * 0.16);
          return <rect key={i} x={x - w / 2} y={mid - h} width={w} height={h} rx="2"
            fill="var(--color-coral)" fillOpacity="0.85" />;
        })}
        <text x={gap * 4.5} y={mid - H * 0.48 - 8} textAnchor="middle" fontSize={Math.max(8, H * 0.05)}
          fill="var(--color-coral)" fontFamily="var(--font-mono)">turnover_1m</text>
      </svg>
    </Frame>
  );
}

function Tree({ H }: { H: number }) {
  const rows = [H * 0.14, H * 0.5, H * 0.86];
  const nodes = [
    [280, rows[0]], [150, rows[1]], [280, rows[1]], [410, rows[1]],
    [90, rows[2]], [210, rows[2]], [350, rows[2]], [470, rows[2]],
  ];
  const edges = [[0,1],[0,2],[0,3],[1,4],[1,5],[3,6],[3,7]];
  const dead = new Set([2, 4, 7]);
  const r = Math.max(7, H * 0.055);
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        {edges.map(([a, b]) => (
          <line key={`${a}${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke="var(--color-rule)" strokeWidth="1.5" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={r}
            fill={dead.has(i) ? "var(--color-paper-3)" : "var(--color-kelp)"}
            stroke={dead.has(i) ? "var(--color-rule)" : "none"} strokeWidth="1.2"
            fillOpacity={dead.has(i) ? 1 : 0.85} />
        ))}
      </svg>
    </Frame>
  );
}

/* Two decoding arms on the same documents, crossing between k=1 and k=4. */
function Crossover({ H }: { H: number }) {
  const ks = [1, 4, 16], c = [0.44, 0.64, 0.554], f = [0.64, 0.53, 0.426];
  const L = 34, R = 110, T = H * 0.12, B = H * 0.78;
  const x = (i: number) => L + (i / 2) * (W - L - R);
  const y = (v: number) => B - ((v - 0.38) / 0.30) * (B - T);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const fs = Math.max(8, H * 0.05), r = Math.max(3.2, H * 0.025);
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        <line x1={L} y1={B + 6} x2={W - R} y2={B + 6} stroke="var(--color-rule)" strokeWidth="1.2" />
        {ks.map((k, i) => <text key={k} x={x(i)} y={H - 5} textAnchor="middle" fontSize={fs}
          fill="var(--color-ink-3)" fontFamily="var(--font-mono)">{`k=${k}`}</text>)}
        <path d={path(c)} fill="none" stroke="var(--color-sea)" strokeWidth="2.4" strokeLinejoin="round" />
        <path d={path(f)} fill="none" stroke="var(--color-coral)" strokeWidth="2.4" strokeLinejoin="round" strokeDasharray="6 4" />
        {c.map((v, i) => <circle key={`c${i}`} cx={x(i)} cy={y(v)} r={r} fill="var(--color-sea)" />)}
        {f.map((v, i) => <circle key={`f${i}`} cx={x(i)} cy={y(v)} r={r} fill="var(--color-coral)" />)}
        <text x={W - R + 12} y={y(c[2]) + 4} fontSize={fs} fill="var(--color-sea)" fontFamily="var(--font-mono)">schema</text>
        <text x={W - R + 12} y={y(f[2]) + 4} fontSize={fs} fill="var(--color-coral)" fontFamily="var(--font-mono)">free</text>
      </svg>
    </Frame>
  );
}

/* 47 covered names against ~403 trading, on a typical day. */
function Coverage({ H }: { H: number }) {
  const cols = 42, rows = Math.max(6, Math.round(H / 15)), covered = 47;
  const padX = 8, padY = 8, dx = (W - padX * 2) / (cols - 1), dy = (H - padY * 2 - 16) / (rows - 1);
  const dots = []; let filled = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const n = r * cols + c, on = n % 9 === 4 && filled < covered;
    if (on) filled += 1;
    dots.push(<circle key={n} cx={padX + c * dx} cy={padY + r * dy} r={on ? 2.8 : 1.5}
      fill={on ? "var(--color-coral)" : "var(--color-rule)"} fillOpacity={on ? 0.9 : 1} />);
  }
  return (
    <Frame H={H}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden>
        {dots}
        <text x={padX} y={H - 2} fontSize={Math.max(8, H * 0.045)} fill="var(--color-ink-3)" fontFamily="var(--font-mono)">
          47 covered of ~403 tradable · 9.5%
        </text>
      </svg>
    </Frame>
  );
}

/* Two clients, one database. The interesting thing about this app is the shape. */
function Phones({ H }: { H: number }) {
  const ink = "var(--color-ink-3)", line = "var(--color-rule)";
  const s = H / 108;
  return (
    <Frame H={H}>
      <svg viewBox="0 0 560 108" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden
        style={{ transform: `scale(${Math.min(1, s)})` }}>
        <rect x="150" y="6" width="42" height="62" rx="7" fill="none" stroke={ink} strokeWidth="1.4" />
        <rect x="157" y="15" width="28" height="34" rx="3" fill="var(--color-coral)" fillOpacity="0.14" />
        <line x1="161" y1="56" x2="181" y2="56" stroke={line} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="330" y="10" width="84" height="54" rx="6" fill="none" stroke={ink} strokeWidth="1.4" />
        <line x1="330" y1="23" x2="414" y2="23" stroke={ink} strokeWidth="1.2" />
        <circle cx="338" cy="16.5" r="2" fill={ink} />
        <rect x="339" y="32" width="30" height="22" rx="3" fill="var(--color-coral)" fillOpacity="0.14" />
        <line x1="377" y1="34" x2="405" y2="34" stroke={line} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="377" y1="42" x2="399" y2="42" stroke={line} strokeWidth="2.5" strokeLinecap="round" />
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

function Frame({ H, children }: { H: number; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-rule-soft bg-paper-2 px-5 py-4 transition-colors group-hover:border-[var(--color-rule)]"
      style={{ height: H + 32 }}>
      {children}
    </div>
  );
}
