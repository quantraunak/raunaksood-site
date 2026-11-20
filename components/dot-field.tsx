"use client";

import { useEffect, useRef } from "react";

/* The one moving thing on the home page: a grid of dots around the intro.
   A slow wave passes through it, and dots near the pointer swell and take
   the accent colour. The dots stay out of the text column at rest, so none
   of them ever sits behind a word. It reads its colours from the theme,
   stops when it is off screen or the tab is hidden, and draws a still grid
   under prefers-reduced-motion. */

const GAP = 24;
const REACH = 150;
/* Half-width kept clear around the centre line, and the fade beyond it. */
const CLEAR = 300;
const FADE = 80;

function rgb(value: string): [number, number, number] {
  const v = value.trim().replace("#", "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true;
    let ink: [number, number, number] = [0, 0, 0];
    let accent: [number, number, number] = [0, 0, 0];
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false };

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = rgb(cs.getPropertyValue("--color-ink"));
      accent = rgb(cs.getPropertyValue("--color-accent"));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ms: number) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, w, h);
      // ease the pointer so the swell trails the cursor a little
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      const offX = ((w % GAP) + GAP) / 2;
      // on a phone there is no margin; the stylesheet keeps the dots above the name
      const narrow = w < 760;

      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = offX; x < w; x += GAP) {
          const wave = still ? 0 : Math.sin(x * 0.011 + y * 0.017 - t * 0.7) * 0.5 + 0.5;
          const dx = x - pointer.x, dy = y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = pointer.on && d < REACH ? 1 - d / REACH : 0;
          const k = near * near;

          // 0 inside the text column, 1 out in the margins
          const edge = narrow ? 1 : Math.min(1, Math.max(0, (Math.abs(x - w / 2) - CLEAR) / FADE));
          const alpha = (0.14 + wave * 0.1) * edge + k * 0.6 * (0.35 + 0.65 * edge);
          if (alpha < 0.004) continue;
          const r = 1 + k * 1.7;
          const c0 = ink[0] + (accent[0] - ink[0]) * k;
          const c1 = ink[1] + (accent[1] - ink[1]) * k;
          const c2 = ink[2] + (accent[2] - ink[2]) * k;
          // dots lean away from the pointer
          const push = k * 5;
          const px = d > 0 ? x + (dx / d) * push : x;
          const py = d > 0 ? y + (dy / d) * push : y;

          ctx.fillStyle = `rgba(${c0 | 0},${c1 | 0},${c2 | 0},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!still && visible) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const box = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - box.left;
      pointer.ty = e.clientY - box.top;
      if (!pointer.on) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.on = true;
      }
      if (still) start();
    };
    const onLeave = () => {
      pointer.on = false;
      if (still) start();
    };

    readTheme();
    resize();
    start();

    const themeWatch = new MutationObserver(() => {
      readTheme();
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
      resize();
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="dot-field" />;
}
