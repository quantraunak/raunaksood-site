import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync("shots", { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1512, height: 950 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const targets = [
  ["/work/quant", "figure", 0, "q-growth"],
  ["/work/quant", "figure", 1, "q-beta"],
  ["/work/quant", "figure", 2, "q-seeds"],
  ["/work/reasoning", "figure", 0, "r-moves"],
  ["/", "main a[href='/work/quant']", 0, "home-card"],
];
for (const [path, sel, idx, name] of targets) {
  await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  const els = await p.$$(sel);
  if (!els[idx]) { console.log("miss", name); continue; }
  await els[idx].scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await els[idx].screenshot({ path: `shots/${name}.png` });
  console.log("shot", name);
}
await b.close();
