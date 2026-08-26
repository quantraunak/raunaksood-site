import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1512,height:900}})).newPage();
await p.goto("http://localhost:3000/", {waitUntil:"networkidle"});
const r = await p.evaluate(() => {
  const shell = document.querySelector("main div[class*='max-w-']");
  const chain = [];
  let el = shell;
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el);
    const bb = el.getBoundingClientRect();
    chain.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.toString?.()??"").slice(0,54),
      display: cs.display, width: cs.width, maxWidth: cs.maxWidth,
      marginLeft: cs.marginLeft, marginRight: cs.marginRight,
      boxLeft: Math.round(bb.left), boxW: Math.round(bb.width),
    });
    el = el.parentElement;
  }
  return chain;
});
console.table(r);
await b.close();
