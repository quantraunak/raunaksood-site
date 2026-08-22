"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import quant from "@/public/data/quant.json";

/* A depth field built from the real equity curve: each band is the same
   series offset and scaled, so the thing behind the name is the work rather
   than an ornament. Pointer parallax is small on purpose. */

export function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      setTilt({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const series = useMemo(() => quant.equity.filter((_, i) => i % 2 === 0).map((p) => p.v), []);

  const W = 1200;
  const H = 420;
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const span = hi - lo || 1;

  const bands = [
    { scale: 1.0, y: 0.0, opacity: 0.9, color: "var(--color-abyss)", width: 2 },
    { scale: 0.78, y: 0.13, opacity: 0.5, color: "var(--color-deep)", width: 1.5 },
    { scale: 0.58, y: 0.26, opacity: 0.32, color: "var(--color-sea)", width: 1.25 },
    { scale: 0.4, y: 0.38, opacity: 0.2, color: "var(--color-shallow)", width: 1 },
  ];

  const pathFor = (scale: number, offset: number) =>
    series
      .map((v, i) => {
        const x = (i / (series.length - 1)) * W;
        const norm = (v - lo) / span;
        const y = H * (0.62 + offset) - norm * H * 0.4 * scale;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join("");

  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden" style={{ height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-paper)" stopOpacity="0" />
            <stop offset="72%" stopColor="var(--color-paper)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-paper)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="hero-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-paper)" stopOpacity="0.9" />
            <stop offset="42%" stopColor="var(--color-paper)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {bands.map((b, i) => (
          <g
            key={i}
            style={{
              transform: `translate3d(${tilt.x * (i + 1) * 5}px, ${tilt.y * (i + 1) * 3}px, 0)`,
              transition: "transform .7s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <path
              d={`${pathFor(b.scale, b.y)}L${W},${H}L0,${H}Z`}
              fill={b.color}
              opacity={b.opacity * 0.1}
            />
            <path
              d={pathFor(b.scale, b.y)}
              fill="none"
              stroke={b.color}
              strokeWidth={b.width}
              opacity={b.opacity}
              vectorEffect="non-scaling-stroke"
              className="draw-in"
              style={{ ["--dash" as string]: "4000", animationDelay: `${i * 130}ms` }}
            />
          </g>
        ))}

        <rect width={W} height={H} fill="url(#hero-fade)" />
        <rect width={W} height={H} fill="url(#hero-left)" />
      </svg>
    </div>
  );
}
