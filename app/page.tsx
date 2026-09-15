import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { CardVisual } from "@/components/card-visual";
import { Reveal } from "@/components/reveal";

const PROJECTS = [
  {
    href: "/work/quant",
    title: "leakprobe",
    kind: "Open source · Python",
    plain:
      "A model that reads tomorrow's data scores brilliantly and fails in production. This finds it, by changing something your code shouldn't notice and seeing what moves.",
    note: "pip install leakprobe",
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
    href: "https://github.com/quantraunak/cardinality-eval",
    title: "cardinality-eval",
    kind: "LLM evaluation · Python",
    plain:
      "Does an extractor get worse as the number of things to find grows? Yes — but only without a JSON schema. The grammar everyone suspects of costing accuracy turns out to be what prevents the loss.",
    note: "0.214 recall lost unconstrained, none constrained",
  },
  {
    href: "https://github.com/quantraunak/filing-links",
    title: "filing-links",
    kind: "Information extraction · Python",
    plain:
      "A dated map of which companies name which others in their 10-Ks, released with its own coverage ceiling attached. The pre-registered gate fired and the study stopped.",
    note: "27 names/date · the gate fired",
  },
  {
    href: "/work/melange",
    title: "Melange",
    kind: "Product · TypeScript, iOS",
    plain:
      "An app for photographers, models and stylists to find each other. Live on the App Store and the web, two clients against one Postgres.",
    note: "App Store + web · 17k lines",
  },
];

const WRITING: [string, string, string, string][] = [
  [
    "/writing/the-schema-is-not-the-cost",
    "The schema is not the cost",
    "Constrained decoding is supposed to cost you accuracy. On extraction recall as the number of items grows, it is the only thing holding recall up. The instrument failed its own sanity check four times before it found that.",
    "Sep 2026",
  ],
  [
    "/writing/testing-for-leakage",
    "Testing for leakage without knowing the right answer",
    "A factor that looked price-only divided by shares outstanding and inflated mean IC by 59%. Then I benchmarked the detector I built for it against five public datasets, and it caught six of nine.",
    "Sep 2026",
  ],
];

const WORK: [string, string, string, string][] = [
  [
    "Innovius Capital",
    "Machine Learning Engineer",
    "2026 —",
    "Replaced chance-level PCA company scoring with a supervised CatBoost and LLM ranker, raising P@20 from 0.20 to 0.90. Built the 14k-company point-in-time training set, where a label-leakage fix moved AUC 0.62 to 0.66.",
  ],
  [
    "QIAGEN, Redwood City",
    "Machine Learning Intern",
    "2025",
    "GraphRAG system explaining disease target pathways to scientists, and a fine-tuned LLM for gene-variant lookup that cut research time 70%.",
  ],
  [
    "Chapman University",
    "Machine Learning Researcher",
    "2024 —",
    "Functional analysis and stochastic processes at graduate level; transport equations and white-noise space for stochastic modelling.",
  ],
  [
    "QIAGEN, Düsseldorf",
    "Data Science & Global Treasury",
    "2024",
    "LangChain RAG chatbot over financial dashboards, halving internal query time. FX analysis on $10M+ of transactions, trading on Bloomberg.",
  ],
  [
    "York University, Toronto",
    "Data Science",
    "2023",
    "Topic modelling on earnings calls to measure incumbent investment firms' attention to financial technology, and what drives its adoption.",
  ],
  [
    "Precanto",
    "Data Science & Product",
    "2023",
    "Time-series headcount forecasting across several companies, and automated validation of the predictive payroll tax engine, 90% faster.",
  ],
  [
    "Greenfield Research Partners",
    "Private Equity Research Associate",
    "2023",
    "Sourced 100+ real-estate acquisition targets, identifying five deals worth $50M+. LBO modelling and comparables for exit multiples.",
  ],
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

/* Drop a portrait at public/portrait.jpg and it replaces the drawn plate.
   Checked at build time so there is no broken-image state either way. */
const PORTRAIT = ["portrait.jpg", "portrait.jpeg", "portrait.png"].find((f) =>
  existsSync(path.join(process.cwd(), "public", f)),
);

export default function Home() {
  return (
    <>
      <header className="px-6 pt-16 pb-16 sm:px-10 sm:pt-24">
        <Reveal>
          <div
            className={
              PORTRAIT
                ? "grid items-start gap-10 sm:grid-cols-[minmax(0,1fr)_240px] sm:gap-16"
                : ""
            }
          >
            <div>
              <h1 className="display">Raunak Sood</h1>
              <p className="mt-8 max-w-[36rem] text-[19px] leading-[1.6] text-ink-2">
                Master&apos;s student in Computer Science at USC. Machine learning intern at
                Innovius Capital. Previously two summers at QIAGEN, plus Precanto and York
                University. Undergrad in economics at Santa Clara, where I played Division I
                tennis.
              </p>
              <p className="mt-4 max-w-[36rem] text-[16px] leading-[1.7] text-ink-3">
                Graduating May 2027.
              </p>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]">
                {LINKS.map(([href, label]) => (
                  <a key={href} href={href} className="link">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {PORTRAIT && (
              <div className="hidden sm:block">
                <div className="plate">
                  <Image
                    src={`/${PORTRAIT}`}
                    alt="Raunak Sood"
                    fill
                    sizes="240px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </header>

      <section className="border-t border-rule px-6 pt-11 pb-2 sm:px-10">
        <div className="label">Experience</div>
        <Reveal>
          <ul className="mt-4">
            {WORK.map(([org, role, when, detail]) => (
              <li key={org + when} className="border-b border-rule-soft py-5 last:border-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-[17px] leading-snug">{org}</div>
                  <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                </div>
                <div className="mt-0.5 text-[15px] text-ink-3">{role}</div>
                <p className="mt-2 max-w-[44rem] text-[14.5px] leading-[1.6] text-ink-2">
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-t border-rule px-6 pt-11 sm:px-10">
        <div className="label">Things I&apos;ve built</div>

        <div className="mt-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.href} delay={i * 70}>
            <Link
              href={p.href}
              {...(p.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group block border-b border-rule-soft py-10"
            >
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

      <section className="border-t border-rule px-6 pt-11 sm:px-10">
        <h2 className="label mb-1">Writing</h2>
        <ul>
          {WRITING.map(([href, title, blurb, when]) => (
            <li key={href} className="border-b border-rule-soft py-4 last:border-0">
              <Link href={href} className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-[16.5px] leading-snug transition-colors group-hover:text-[var(--color-sea)]">
                    {title}
                  </div>
                  <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                </div>
                <div className="mt-1 text-[14.5px] leading-[1.6] text-ink-3">{blurb}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 pt-12 pb-20 sm:px-10">
        <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
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
          </div>

          <div>
            <h2 className="label mb-3">Tools</h2>
            <p className="mono text-[13px] leading-[2] text-ink-2">
              Python · PyTorch · LightGBM · pandas · SQL
              <br />
              TypeScript · React · Next.js · Postgres · AWS
            </p>

            <h2 className="label mb-3 mt-10">Elsewhere</h2>
            <p className="text-[15px] leading-[1.9] text-ink-2">
              <a href="https://github.com/quantraunak" className="link">GitHub</a>
              {" · "}
              <a href="https://www.linkedin.com/in/raunak-sood" className="link">LinkedIn</a>
              {" · "}
              <a href="mailto:raunak.sood@gmail.com" className="link">raunak.sood@gmail.com</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
