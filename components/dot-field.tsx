"use client";

import { useEffect, useRef } from "react";

/* The one moving thing on the home page, and it is the leakprobe test.
   A grid of dots sits in the margins. A clock runs from 0 to 45 days and
   back. A few dots read the clock: each grows a short bar as it advances.
   One of them is drawn in coral, the feature that was not supposed to move.
   Every other dot holds exactly still, which is the whole method.

   Moving the mouse left and right sets the clock by hand. Without a mouse
   it runs on its own. The dots stay out of the text column, the still grid
   is drawn once and reused, and under prefers-reduced-motion one fixed
   frame is shown. */

const GAP = 24;
const CLEAR = 300; // half-width kept clear around the centre line
const FADE = 80; // the grid fades in over this distance beyond it
const DAYS = 45;
const HALF = 4200; // ms for the clock to run one way

type Reader = { x: number; y: number; len: number; edge: number; key: number; leak: boolean };
type RGB = [number, number, number];

function rgb(value: string): RGB {
  const v = value.trim().replace("#", "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* Same dots every visit: a fixed hash of the grid cell. */
function hash(a: number, b: number) {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const label = document.getElementById("clock-days");
    const base = document.createElement("canvas");
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let ink: RGB = [0, 0, 0], accent: RGB = [0, 0, 0], coral: RGB = [0, 0, 0];
    let readers: Reader[] = [];
    let s = still ? 0.6 : 0, target = 0, lastMove = -1e9, shown = -1;

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = rgb(cs.getPropertyValue("--color-ink"));
      accent = rgb(cs.getPropertyValue("--color-accent"));
      coral = rgb(cs.getPropertyValue("--color-coral"));
    };

    /* Draw the still grid once and decide which dots read the clock. */
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = base.width = Math.round(w * dpr);
      canvas.height = base.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const b = base.getContext("2d");
      if (!b) return;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, w, h);

      // on a phone there is no margin; the stylesheet keeps a short band above the name
      const narrow = w < 760;
      const share = narrow ? 1 / 7 : 1 / 19;
      const offX = ((w % GAP) + GAP) / 2;
      readers = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = offX; x < w; x += GAP) {
          const edge = narrow ? 1 : Math.min(1, Math.max(0, (Math.abs(x - w / 2) - CLEAR) / FADE));
          if (edge <= 0) continue;
          const cx = Math.floor((x - w / 2) / GAP), cy = Math.round(y / GAP);
          const key = hash(cx, cy);
          if (edge > 0.6 && key < share && x + GAP < w) {
            readers.push({ x, y, len: (0.45 + 0.55 * hash(cy, cx)) * (GAP - 5), edge, key, leak: false });
            continue;
          }
          b.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${(0.16 * edge).toFixed(3)})`;
          b.beginPath();
          b.arc(x, y, 1, 0, Math.PI * 2);
          b.fill();
        }
      }
      // one reader is the leak: somewhere the eye lands, right of the column
      const pool = readers.filter((r) => (narrow ? r.y > 70 && r.y < 125 : r.x > w / 2 && r.y > 100 && r.y < 320));
      const leak = (pool.length ? pool : [...readers]).sort((p, q) => p.key - q.key)[0];
      if (leak) leak.leak = true;
    };

    const draw = (ms: number) => {
      if (!still) {
        if (ms - lastMove > 3000) {
          const phase = (ms / HALF) % 2;
          target = 0.5 - 0.5 * Math.cos(Math.PI * (phase < 1 ? phase : 2 - phase));
        }
        s += (target - s) * 0.07;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);

      const lit = Math.min(1, s * 6);
      ctx.lineCap = "round";
      ctx.lineWidth = 2;
      for (const r of readers) {
        const to = r.leak ? coral : accent;
        const c0 = ink[0] + (to[0] - ink[0]) * lit;
        const c1 = ink[1] + (to[1] - ink[1]) * lit;
        const c2 = ink[2] + (to[2] - ink[2]) * lit;
        const alpha = (0.16 + ((r.leak ? 0.95 : 0.6) - 0.16) * lit) * r.edge;
        ctx.strokeStyle = `rgba(${c0 | 0},${c1 | 0},${c2 | 0},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + r.len * s, r.y);
        ctx.stroke();
      }

      const days = Math.round(s * DAYS);
      if (label && days !== shown) {
        shown = days;
        label.textContent = `+${days}d`;
      }
      if (!still && visible) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || still) return;
      lastMove = performance.now();
      target = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
    };

    readTheme();
    build();
    start();

    const themeWatch = new MutationObserver(() => {
      readTheme();
      build();
      start();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const seen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      if (visible) start();
    });
    seen.observe(canvas);

    const onVis = () => {
      visible = !document.hidden;
      if (visible) start();
    };
    const onResize = () => {
      build();
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="dot-field" />;
}
