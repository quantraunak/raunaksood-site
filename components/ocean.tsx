"use client";

import { useEffect, useRef, useState } from "react";

/* A full-bleed ocean built in SVG: sky, horizon haze, a depth ramp, swell
   lines that follow real sine geometry rather than random blobs, and light
   caustics near the surface. It is procedural so it costs no image payload
   and re-tints itself in dark mode.

   To use a photograph instead, drop one at public/ocean.jpg and set
   `photo` — the layers below become the tint over it. */

export function OceanHero({ photo = false }: { photo?: boolean }) {
  const [t, setT] = useState(0);
  const [tilt, setTilt] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let start: number | null = null;
    const loop = (ts: number) => {
      if (start === null) start = ts;
      setT((ts - start) / 1000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) =>
      setTilt((e.clientX / window.innerWidth - 0.5) * 2);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const W = 1600;
  const H = 620;
  const horizon = 196;

  /* Swell lines: superposed sines, amplitude and wavelength growing with
     distance from the horizon, which is what gives the sense of depth. */
  const swell = (depth: number, phase: number) => {
    const y0 = horizon + depth * (H - horizon);
    const amp = 3 + depth * 26;
    const len = 150 + depth * 460;
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 12) {
      const y =
        y0 +
        Math.sin((x / len) * Math.PI * 2 + phase) * amp +
        Math.sin((x / (len * 0.43)) * Math.PI * 2 + phase * 1.7) * amp * 0.32;
      pts.push(`${x === 0 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join("");
  };

  const bands = Array.from({ length: 13 }, (_, i) => {
    const depth = i / 12;
    return {
      depth,
      d: swell(depth, t * (0.16 + depth * 0.4) + i * 0.8),
      opacity: 0.1 + depth * 0.42,
      width: 0.7 + depth * 2.1,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        style={{ transform: `translateX(${tilt * -10}px) scale(1.03)` }}
      >
        <defs>
          <linearGradient id="oc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-paper)" />
            <stop offset="70%" stopColor="var(--color-paper)" />
            <stop offset="100%" stopColor="var(--color-shallow)" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="oc-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-shallow)" stopOpacity="0.3" />
            <stop offset="34%" stopColor="var(--color-sea)" stopOpacity="0.42" />
            <stop offset="72%" stopColor="var(--color-deep)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-abyss)" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="oc-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-paper)" stopOpacity="0" />
            <stop offset="82%" stopColor="var(--color-paper)" stopOpacity="0.72" />
            <stop offset="100%" stopColor="var(--color-paper)" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="oc-sun" cx="0.72" cy="0.02" r="0.55">
            <stop offset="0%" stopColor="var(--color-shallow)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-shallow)" stopOpacity="0" />
          </radialGradient>
          <filter id="oc-blur">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {photo && (
          <image href="/ocean.jpg" x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" opacity="0.9" />
        )}

        {!photo && (
          <>
            <rect width={W} height={horizon + 8} fill="url(#oc-sky)" />
            <rect y={horizon} width={W} height={H - horizon} fill="url(#oc-water)" />
            <rect width={W} height={horizon * 1.8} fill="url(#oc-sun)" />
            {/* horizon haze */}
            <rect y={horizon - 12} width={W} height={26} fill="var(--color-paper)" opacity="0.5" filter="url(#oc-blur)" />
          </>
        )}

        {/* swell */}
        <g>
          {bands.map((b, i) => (
            <path
              key={i}
              d={b.d}
              fill="none"
              stroke={i > 8 ? "var(--color-abyss)" : i > 4 ? "var(--color-deep)" : "var(--color-sea)"}
              strokeWidth={b.width}
              opacity={b.opacity}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* caustics: short highlights riding the near swell */}
        <g opacity="0.5">
          {Array.from({ length: 26 }, (_, i) => {
            const depth = 0.32 + ((i * 37) % 60) / 100;
            const x = ((i * 197 + t * 26 * (0.4 + depth)) % (W + 200)) - 100;
            const y = horizon + depth * (H - horizon) + Math.sin(x / 180 + t * 0.5) * (4 + depth * 18);
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx={9 + depth * 26}
                ry={0.9 + depth * 1.7}
                fill="var(--color-shallow)"
                opacity={0.14 + depth * 0.2}
              />
            );
          })}
        </g>

        <rect width={W} height={H} fill="url(#oc-fade)" />
      </svg>
    </div>
  );
}
