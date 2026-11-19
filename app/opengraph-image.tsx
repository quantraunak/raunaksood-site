import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";

/* The card LinkedIn, Slack and iMessage show when the site is shared.
   Same look as the home page in dark: the dot grid, the name, the role. */

export const alt = "Raunak Sood, machine learning engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GAP = 30;
const HOT = { x: 930, y: 190 };
const REACH = 190;

export default function OpengraphImage() {
  const dots = [];
  for (let y = GAP / 2; y < size.height; y += GAP) {
    for (let x = GAP / 2; x < size.width; x += GAP) {
      const d = Math.hypot(x - HOT.x, y - HOT.y);
      const near = d < REACH ? 1 - d / REACH : 0;
      const k = near * near;
      const fade = 1 - (y / size.height) * 0.75;
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={1.3 + k * 2.6}
          fill={k > 0.04 ? "#62b8d1" : "#ededee"}
          opacity={(0.16 + k * 0.7) * fade}
        />,
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0b0b0c",
          color: "#ededee",
        }}
      >
        <svg width={size.width} height={size.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {dots}
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 88px 84px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 500, letterSpacing: -2.5 }}>Raunak Sood</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
            <div style={{ fontSize: 26, letterSpacing: 5, color: "#a5a5ab" }}>MACHINE LEARNING ENGINEER</div>
            <div style={{ width: 13, height: 24, marginLeft: 14, background: "#62b8d1" }} />
          </div>
          <div style={{ marginTop: 46, fontSize: 24, color: "#6c6c74" }}>{new URL(SITE_URL).host}</div>
        </div>
      </div>
    ),
    size,
  );
}
