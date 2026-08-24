import Link from "next/link";
import { Shell, Section } from "@/components/ui";
import { HomeSpark } from "@/components/home-spark";
import { OceanHero } from "@/components/ocean";
import { OnScroll } from "@/components/charts";

const PROJECTS = [
  {
    href: "/work/quant",
    kind: "Quantitative research",
    title: "Point-in-time equity factor research",
    line: "Survivorship-free index membership, SEC fundamentals keyed on filing date, and a decomposition of what the signal is really paid for.",
    figures: [
      { v: "0.0165", l: "OOS information coefficient" },
      { v: "t = 3.08", l: "decile spread" },
      { v: "59%", l: "of the spread is market beta" },
    ],
    accent: "var(--color-deep)",
  },
  {
    href: "/work/reasoning",
    kind: "Research · LLM reasoning",
    title: "Resampled Thought Trees",
    line: "Freeze a thought, restart the search ten times, and measure whether it still reaches an answer.",
    figures: [
      { v: "22,350", l: "resampling trials" },
      { v: "280", l: "logged search trees" },
      { v: "5", l: "node categories" },
    ],
    accent: "var(--color-kelp)",
  },
  {
    href: "/work/melange",
    kind: "Product · iOS & web",
    title: "Melange",
    line: "Two shipped clients, one Postgres, and no backend server to trust.",
    figures: [
      { v: "2", l: "shipped clients" },
      { v: "0", l: "backend servers" },
      { v: "RLS", l: "on every table" },
    ],
    accent: "var(--color-coral)",
  },
];

const EXPERIENCE: [string, string, string, string][] = [
  ["2026 —", "Innovius Capital", "Machine Learning Intern", "CatBoost + LLM-as-a-judge deal scoring; advancing-deal accuracy ~30% → ~80%. Rebuilt Athena, an internal sourcing platform."],
  ["2025", "QIAGEN · Redwood City", "Machine Learning Intern", "Embedding-based GraphRAG over disease–target pathways. Fine-tuned and deployed an LLM for gene-variant lookup; −70% research time."],
  ["2024", "QIAGEN · Düsseldorf", "Data Science & Treasury", "LangChain RAG assistant over financial dashboards; −50% query time. FX analysis on $10M+ transactions."],
  ["2023", "Precanto", "Data Science & Product", "Time-series headcount forecasting; automated payroll-tax-engine validation."],
  ["2023", "York University · Toronto", "Data Science", "Topic modeling on earnings calls; drivers of fintech adoption."],
];

const EDUCATION: [string, string, string, string][] = [
  ["2025 — 27", "University of Southern California", "M.S. Computer Science · GPA 3.85", "Analysis of Algorithms · Applied NLP · Database Systems · Deep Learning · Operating Systems"],
  ["2020 — 24", "Santa Clara University", "B.S. Economics · GPA 3.9 upper-division", "Machine Learning · Time Series · Algorithms · Linear Algebra · Division I Men's Tennis"],
];

const STACK = [
  "Python", "PyTorch", "LightGBM", "CVXPY", "scikit-learn", "pandas",
  "LangChain", "CatBoost", "R", "SQL", "C++",
  "TypeScript", "Next.js", "Supabase", "Postgres", "Docker", "AWS",
];

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <div className="relative isolate flex min-h-[70vh] items-center sm:min-h-[78vh]">
        <OceanHero />
        <Shell>
          <div className="max-w-[820px] py-24 sm:py-32">
            <h1 className="serif text-[clamp(46px,8.5vw,96px)] leading-[0.98] reveal">Raunak Sood</h1>
            <p
              className="reveal mt-7 max-w-[620px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-ink-2"
              style={{ animationDelay: "70ms" }}
            >
              Machine learning and quantitative research —{" "}
              <span className="text-ink">M.S. Computer Science at USC</span>, machine learning at{" "}
              <span className="text-ink">Innovius Capital</span>.
            </p>
            <div
              className="reveal mt-9 flex flex-wrap gap-x-6 gap-y-2 mono text-[12.5px]"
              style={{ animationDelay: "140ms" }}
            >
              {[
                ["mailto:raunak.sood@gmail.com", "email"],
                ["https://github.com/quantraunak", "github"],
                ["https://www.linkedin.com/in/raunak-sood", "linkedin"],
                ["/Raunak-Sood-Resume.pdf", "résumé"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="border-b border-rule pb-0.5 text-ink-2 transition-colors hover:border-[var(--color-sea)] hover:text-[var(--color-sea)]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Shell>
      </div>

      <Shell>
        {/* --------------------------------------------------------- work */}
        <section className="py-16 sm:py-20">
          <div className="eyebrow mb-10">Selected work</div>
          <div className="grid gap-5 lg:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <OnScroll key={p.href} delay={i * 90} className="h-full">
                <Link
                  href={p.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule-soft bg-paper-2 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-sea)]"
                >
                  <div className="px-6 pt-6">
                    <HomeSpark index={i} accent={p.accent} />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="eyebrow">{p.kind}</div>
                    <h2 className="serif mt-2 text-[23px] leading-tight transition-colors group-hover:text-[var(--color-sea)]">
                      {p.title}
                    </h2>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">{p.line}</p>
                    <dl className="mt-auto space-y-2 pt-6">
                      {p.figures.map((f) => (
                        <div
                          key={f.l}
                          className="rule-soft flex items-baseline justify-between gap-3 pt-2 first:border-t-0 first:pt-0"
                        >
                          <dt className="text-[11.5px] text-ink-3">{f.l}</dt>
                          <dd className="mono text-[14px] tnum" style={{ color: p.accent }}>
                            {f.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <span className="absolute right-5 top-5 mono text-[11px] text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
                    read →
                  </span>
                </Link>
              </OnScroll>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ position */}
        <Section eyebrow="How I work">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <p className="serif text-[clamp(21px,2.6vw,29px)] leading-[1.35] text-ink">
              I build research systems and then try to break them. In the equity work that meant
              reconstructing point-in-time membership and filing-date-aware fundamentals before
              fitting anything — then measuring that{" "}
              <span className="tide">59% of the apparent edge was market beta</span>. Finding that
              out is the part of the job worth doing well.
            </p>
            <div className="prose self-end text-[15px]">
              <p>
                Before USC, a B.S. in Economics from Santa Clara and Division I tennis, then ML and
                data roles at Innovius Capital, QIAGEN and earlier research desks.
              </p>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------- experience */}
        <Section eyebrow="Experience">
          <div>
            {EXPERIENCE.map(([when, org, role, detail]) => (
              <div
                key={org + when}
                className="rule-soft grid gap-x-8 gap-y-1.5 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[92px_minmax(0,240px)_1fr]"
              >
                <div className="mono text-[12px] tnum text-ink-3 sm:pt-0.5">{when}</div>
                <div>
                  <div className="text-[15.5px] font-medium">{org}</div>
                  <div className="text-[13.5px] text-ink-3">{role}</div>
                </div>
                <p className="text-[14.5px] leading-relaxed text-ink-2">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------- education */}
        <Section eyebrow="Education">
          <div className="grid gap-5 sm:grid-cols-2">
            {EDUCATION.map(([when, school, detail, courses]) => (
              <div key={school} className="card p-6">
                <div className="mono text-[11.5px] text-ink-3">{when}</div>
                <div className="mt-2 text-[16px] font-medium">{school}</div>
                <div className="mt-1 text-[14px] text-ink-2">{detail}</div>
                <div className="mt-4 text-[12.5px] leading-relaxed text-ink-3">{courses}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* --------------------------------------------------------- stack */}
        <Section eyebrow="Stack">
          <div className="flex flex-wrap gap-2">
            {STACK.map((s) => (
              <span
                key={s}
                className="rounded-full border border-rule-soft bg-paper-2 px-3.5 py-1.5 mono text-[12px] text-ink-2"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>
      </Shell>
    </>
  );
}
