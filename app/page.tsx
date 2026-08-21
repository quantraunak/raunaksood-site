import Link from "next/link";
import quant from "@/public/data/quant.json";
import { Shell, Section } from "@/components/ui";
import { HomeSpark } from "@/components/home-spark";

const PROJECTS = [
  {
    href: "/work/quant",
    kind: "Quantitative research",
    title: "Point-in-time equity research",
    blurb:
      "A market-neutral US equity signal on reconstructed index membership and SEC filings. The signal is real; the Sharpe is not — and the write-up shows exactly where the apparent edge goes.",
    figures: [
      { v: "0.0165", l: "out-of-sample IC" },
      { v: "2.00", l: "t-statistic" },
      { v: "59%", l: "of edge is beta" },
    ],
    accent: "var(--color-ochre)",
  },
  {
    href: "/work/reasoning",
    kind: "Research · LLM reasoning",
    title: "Resampled Thought Trees",
    blurb:
      "Which intermediate thoughts in Tree-of-Thought search actually matter? Freeze a node, restart the search many times, and measure the probability it still reaches a solution.",
    figures: [
      { v: "22,350", l: "resampling trials" },
      { v: "2,235", l: "node summaries" },
      { v: "792", l: "ablation rows" },
    ],
    accent: "var(--color-teal)",
  },
  {
    href: "/work/melange",
    kind: "Product · iOS & web",
    title: "Melange",
    blurb:
      "A creative-collaboration app. Native iOS and web on one Supabase backend, where the database itself enforces who can read what — there is no backend server to trust.",
    figures: [
      { v: "2", l: "shipped clients" },
      { v: "0", l: "backend servers" },
      { v: "30", l: "tests passing" },
    ],
    accent: "var(--color-clay)",
  },
];

const EXPERIENCE = [
  {
    when: "2026 —",
    org: "Innovius Capital",
    role: "Machine Learning Intern",
    points: [
      "CatBoost + LLM-as-a-judge deal-scoring model; accuracy of advancing deals ~30% → ~80%.",
      "Rebuilt Athena, an internal platform for automated sourcing and account analysis.",
    ],
  },
  {
    when: "2025",
    org: "QIAGEN",
    role: "Machine Learning Intern · Redwood City",
    points: [
      "Embedding-based GraphRAG system explaining disease–target pathways.",
      "Fine-tuned and deployed an LLM surfacing gene-variant information; −70% research time.",
    ],
  },
  {
    when: "2024",
    org: "QIAGEN",
    role: "Data Science & Treasury · Düsseldorf",
    points: [
      "LangChain RAG assistant over financial dashboards; −50% internal query time.",
      "FX analysis on $10M+ transactions; currency-risk monitoring on Bloomberg.",
    ],
  },
  {
    when: "2023",
    org: "Precanto",
    role: "Data Science & Product",
    points: ["Time-series headcount forecasting; automated payroll-tax-engine validation (+90%)."],
  },
  {
    when: "2023",
    org: "York University",
    role: "Data Science · Toronto",
    points: ["Topic modeling on earnings calls; regression on drivers of fintech adoption."],
  },
];

export default function Home() {
  return (
    <Shell>
      <header className="pt-16 pb-4 sm:pt-24">
        <h1 className="serif text-[clamp(40px,7vw,66px)] leading-[1.02] reveal">Raunak Sood</h1>
        <p className="lede mt-6 max-w-[600px] reveal" style={{ animationDelay: "60ms" }}>
          Machine learning and quantitative research. Currently{" "}
          <strong className="text-ink font-medium">M.S. Computer Science</strong> at USC and{" "}
          <strong className="text-ink font-medium">machine learning</strong> at{" "}
          <strong className="text-ink font-medium">Innovius Capital</strong>.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 mono text-[12.5px] reveal" style={{ animationDelay: "120ms" }}>
          {[
            ["mailto:raunak.sood@gmail.com", "raunak.sood@gmail.com"],
            ["https://github.com/quantraunak", "github.com/quantraunak"],
            ["https://www.linkedin.com/in/raunak-sood", "linkedin.com/in/raunak-sood"],
            ["/Raunak-Sood-Resume.pdf", "résumé.pdf"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-ink-2 border-b border-rule pb-0.5 hover:text-ochre hover:border-ochre transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </header>

      <Section eyebrow="Approach">
        <div className="prose max-w-[700px] text-[17px]">
          <p>
            I build research systems and then try to break them. The most useful thing in the
            equity work below is not its Sharpe ratio — it is the finding that{" "}
            <strong>59% of the apparent edge was market beta</strong>, and that a headline which
            moves from 0.09 to 0.49 under a random seed is a draw from a distribution rather than a
            measurement.
          </p>
          <p>
            Prior to USC, a B.S. in Economics from Santa Clara (Division I tennis), then ML and data
            roles at Innovius Capital, QIAGEN, and earlier research desks.
          </p>
        </div>
      </Section>

      <Section eyebrow="Selected work">
        <div className="space-y-px">
          {PROJECTS.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className="group block rule-soft py-9 first:border-t-0 first:pt-0 transition-colors"
            >
              <div className="grid gap-7 lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-center">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="eyebrow">{p.kind}</div>
                    <span className="mono text-[11px] text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      read →
                    </span>
                  </div>
                  <h3 className="serif mt-2.5 text-[25px] group-hover:text-ochre transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[600px] text-[15.5px] leading-relaxed text-ink-2">{p.blurb}</p>
                  <div className="mt-6 flex flex-wrap gap-x-9 gap-y-3">
                    {p.figures.map((f) => (
                      <div key={f.l}>
                        <div className="mono text-[17px] tnum">{f.v}</div>
                        <div className="eyebrow mt-0.5">{f.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <HomeSpark index={i} accent={p.accent} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Experience">
        <div className="space-y-px">
          {EXPERIENCE.map((e) => (
            <div key={e.org + e.when} className="rule-soft grid gap-x-6 gap-y-2 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[110px_1fr]">
              <div className="mono text-[12px] text-ink-3 tnum sm:pt-1">{e.when}</div>
              <div>
                <div className="text-[15.5px]">
                  <span className="font-medium">{e.org}</span>
                  <span className="text-ink-2"> · {e.role}</span>
                </div>
                <ul className="mt-2.5 space-y-1">
                  {e.points.map((pt) => (
                    <li key={pt} className="relative pl-4 text-[14.5px] leading-relaxed text-ink-2">
                      <span className="absolute left-0 text-ink-3">—</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Education">
        <div className="space-y-px">
          {[
            {
              when: "2025 — 27",
              school: "University of Southern California",
              detail: "M.S. Computer Science · GPA 3.85",
              courses: "Analysis of Algorithms · Applied NLP · Database Systems · Deep Learning · Operating Systems",
            },
            {
              when: "2020 — 24",
              school: "Santa Clara University",
              detail: "B.S. Economics · GPA 3.9 (upper-division) · Dean's List",
              courses: "Machine Learning · Time Series · Algorithms · Linear Algebra · Division I Men's Tennis",
            },
          ].map((e) => (
            <div key={e.school} className="rule-soft grid gap-x-6 gap-y-1 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[110px_1fr]">
              <div className="mono text-[12px] text-ink-3 sm:pt-1">{e.when}</div>
              <div>
                <div className="text-[15.5px] font-medium">{e.school}</div>
                <div className="mt-0.5 text-[14.5px] text-ink-2">{e.detail}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-ink-3">{e.courses}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Stack">
        <div className="mono text-[13px] leading-loose text-ink-2">
          Python · R · SQL · C++ · Java
          <br />
          PyTorch · LightGBM · CVXPY · scikit-learn · LangChain · CatBoost
          <br />
          TypeScript · Next.js · Supabase · Docker · AWS · Git
        </div>
        <div className="mt-8 mono text-[11.5px] text-ink-3">
          Every figure on the equity-research page is read from run{" "}
          <span className="text-ink-2">{quant.run}</span> at build time.
        </div>
      </Section>
    </Shell>
  );
}
