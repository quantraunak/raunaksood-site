import Link from "next/link";
import { Shell } from "@/components/ui";
import { CardVisual } from "@/components/card-visual";
import { LeakDemo } from "@/components/leak-demo";
import { Reveal } from "@/components/reveal";

const PROJECTS = [
  {
    href: "/work/quant",
    title: "leakcheck",
    kind: "Open source · Python",
    plain:
      "A model that reads tomorrow's data scores brilliantly and fails in production. This finds it, by changing something your code shouldn't notice and seeing what moves.",
    note: "pip install leakcheck",
  },
  {
    href: "/work/reasoning",
    title: "Resampled Thought Trees",
    kind: "AI research · USC · 5 authors",
    plain:
      "When an AI reasons step by step, which steps actually matter? We froze it mid-thought and re-ran the search 22,000 times to find out.",
    note: "Paper · 280 logged search trees",
  },
  {
    href: "/work/melange",
    title: "Melange",
    kind: "Product · TypeScript, iOS",
    plain:
      "An app for photographers, models and stylists to find each other. Two clients, one Postgres, shipped on iPhone and the web.",
    note: "Live · 17k lines",
  },
];

const WORK: [string, string, string][] = [
  ["Innovius Capital", "Machine Learning Intern", "2026 —"],
  ["QIAGEN, Redwood City", "Machine Learning Intern", "2025"],
  ["QIAGEN, Düsseldorf", "Data Science & Treasury", "2024"],
  ["Precanto", "Data Science & Product", "2023"],
  ["York University, Toronto", "Data Science", "2023"],
];

const SCHOOL: [string, string, string][] = [
  ["University of Southern California", "M.S. Computer Science · GPA 3.85", "2025 — 27"],
  ["Santa Clara University", "B.S. Economics · Division I tennis", "2020 — 24"],
];

const LINKS: [string, string][] = [
  ["mailto:raunak.sood@gmail.com", "Email"],
  ["/Raunak-Sood-Resume.pdf", "Résumé"],
  ["https://github.com/quantraunak", "GitHub"],
  ["https://www.linkedin.com/in/raunak-sood", "LinkedIn"],
];

export default function Home() {
  return (
    <Shell>
      <header className="pt-16 pb-14 sm:pt-24">
        <Reveal>
          <div className="tech text-ink-3">Raunak Sood</div>
          <h1 className="mt-5 max-w-[26rem] text-[clamp(30px,5.4vw,44px)] leading-[1.08] tracking-[-0.03em]">
            I find the bug that makes your results look good.
          </h1>
          <p className="lede mt-6 max-w-[33rem]">
            Measurement infrastructure — the kind that tells you when a result is real, and when
            it&apos;s an artifact of how the data was put together.
          </p>
          <p className="mt-3.5 text-[15px] leading-[1.7] text-ink-3">
            M.S. Computer Science at USC. Machine learning at Innovius Capital.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} className="link">
                {label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <LeakDemo />
          <p className="mt-3 text-[13px] leading-[1.6] text-ink-3">
            Live output from{" "}
            <Link href="/work/quant" className="link">
              leakcheck
            </Link>
            . Move the clock on one data source; anything that shifts had a dependency on it that
            nobody declared.
          </p>
        </Reveal>
      </header>

      <section className="border-t border-rule pt-11">
        <div className="label">Selected work</div>

        <div className="mt-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.href} delay={i * 70}>
            <Link href={p.href} className="group block border-b border-rule-soft py-10">
              <div className="flex items-baseline gap-4">
                <span className="mono text-[13px] text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[26px] leading-tight tracking-[-0.02em] transition-colors group-hover:text-[var(--color-sea)] sm:text-[29px]">
                  {p.title}
                </h2>
              </div>

              <div className="mt-4 pl-0 sm:pl-[2.1rem]">
                <CardVisual index={i} />
                <p className="mt-5 max-w-[33rem] text-[17px] leading-[1.7] text-ink-2">
                  {p.plain}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-3">
                  <span className="mono">{p.note}</span>
                  <span aria-hidden>·</span>
                  <span>{p.kind}</span>
                  <span
                    aria-hidden
                    className="ml-auto text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Read →
                  </span>
                </div>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pt-12 pb-24">
        <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
          <div>
            <h2 className="label mb-1">Experience</h2>
            <ul>
              {WORK.map(([org, role, when]) => (
                <li key={org + when} className="border-b border-rule-soft py-4 last:border-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="text-[16.5px] leading-snug">{org}</div>
                    <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                  </div>
                  <div className="mt-0.5 text-[14.5px] text-ink-3">{role}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label mb-1">Education</h2>
            <ul>
              {SCHOOL.map(([org, role, when]) => (
                <li key={org} className="border-b border-rule-soft py-4 last:border-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="text-[16.5px] leading-snug">{org}</div>
                    <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                  </div>
                  <div className="mt-0.5 text-[14.5px] text-ink-3">{role}</div>
                </li>
              ))}
            </ul>

            <h2 className="label mb-3 mt-10">Tools</h2>
            <p className="mono text-[13px] leading-[2] text-ink-2">
              Python · PyTorch · LightGBM · pandas · SQL
              <br />
              TypeScript · React · Next.js · Postgres · AWS
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}
