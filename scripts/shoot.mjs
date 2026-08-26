/**
 * Screenshot every page at desktop and mobile, and report layout problems
 * that are invisible from the HTML alone: content that misses the centre,
 * elements crossing the viewport edge, and cramped line spacing.
 *
 *   node scripts/shoot.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "shots";
const PAGES = ["/", "/work/quant", "/work/reasoning", "/work/melange"];
const VIEWS = [
  { name: "desktop", width: 1512, height: 950 },
  { name: "mobile", width: 390, height: 844 },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const view of VIEWS) {
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);

    const slug = path === "/" ? "home" : path.replace(/\//g, "-").slice(1);
    await page.screenshot({ path: `${OUT}/${view.name}-${slug}.png`, fullPage: false });

    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const problems = [];

      // anything sticking out past the viewport
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1 || r.left < -1) {
          problems.push({
            kind: "overflow",
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.toString?.() ?? "").slice(0, 60),
            left: Math.round(r.left),
            right: Math.round(r.right),
          });
        }
      }

      // is the main reading column actually centred?
      const main = document.querySelector("main");
      const col = main?.querySelector("div[class*='max-w']");
      const colBox = col?.getBoundingClientRect();

      // line spacing of body copy
      const p = [...document.querySelectorAll("p")].find((n) => n.textContent.length > 80);
      const cs = p ? getComputedStyle(p) : null;

      return {
        viewport: vw,
        column: colBox
          ? {
              left: Math.round(colBox.left),
              width: Math.round(colBox.width),
              rightGap: Math.round(vw - colBox.right),
              centred: Math.abs(colBox.left - (vw - colBox.right)) < 4,
            }
          : null,
        body: cs ? { fontSize: cs.fontSize, lineHeight: cs.lineHeight } : null,
        overflow: problems.slice(0, 6),
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    const c = report.column;
    console.log(
      `${view.name.padEnd(8)} ${path.padEnd(16)} ` +
        (c
          ? `col ${String(c.width).padStart(4)}px  left ${String(c.left).padStart(4)}  right ${String(c.rightGap).padStart(4)}  ${c.centred ? "centred" : "OFF-CENTRE"}`
          : "no column found") +
        `  ${report.body ? `${report.body.fontSize}/${report.body.lineHeight}` : ""}` +
        (report.scrollWidth > report.viewport ? `  H-SCROLL ${report.scrollWidth}` : "") +
        (report.overflow.length ? `  OVERFLOW x${report.overflow.length}` : ""),
    );
    for (const o of report.overflow) {
      console.log(`         └ ${o.tag}.${o.cls} [${o.left} → ${o.right}]`);
    }
  }
  await context.close();
}

await browser.close();
console.log(`\nwrote ${PAGES.length * VIEWS.length} screenshots to ${OUT}/`);
