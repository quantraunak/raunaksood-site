import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { LeakDemo } from "@/components/leak-demo";
import {
  CoverageMark,
  JudgeMark,
  PhoneRow,
  RankerFigure,
  ResampleFigure,
  ValidityMark,
} from "@/components/home-visuals";
import { PAPERS, WRITING } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/* The four numbers a reader should leave with if they read nothing else. */
const STATS: [string, string, string][] = [
  ["#innovius", "20% → 90%", "of the top-20 picks advancing, after I rebuilt the startup-ranking model at Innovius"],
  ["#leakprobe", "8 of 9", "planted data leaks caught by leakprobe, my open-source test, with no false alarms"],
  ["#melange", "iOS + web", "where Melange, the app I built, is live: App Store release 2.1 and a web app"],
  ["#reasoning", "11,000", "re-runs to score every step of an AI's search, in a five-author USC paper"],
];

type FeatureLink = { href: string; label: string };

const MORE = [
  {
    href: "/work/cardinality",
    title: "cardinality-eval",
    kind: "LLM evaluation · Python",
    text: "Does extraction get worse as the list of things to find grows? In a one-model pilot, recall does not fall by the pre-registered margin with or without a schema. What the schema buys is validity: free-form output stops being valid JSON as the list lengthens (21 of 25 at sixteen items), schema output never does.",
    mark: <ValidityMark />,
  },
  {
    href: "/work/filings",
    title: "filing-links",
    kind: "Information extraction · Python",
    text: "A dated map of which companies name which others in their 10-Ks, every edge quoting its sentence, built with a model on a laptop. 2,572 relationships over 220 firms, released with its coverage ceiling attached: 47 names per day against the 97 the return test needs.",
    mark: <CoverageMark />,
  },
  {
    href: "https://github.com/quantraunak/deal-desk-voice",
    title: "Deal Desk",
    kind: "Voice agent · evaluation harness",
    text: "A voice agent that answers deal questions from notes, with citations: 87 of 90 on a 30-case eval with a rule-based grader. I also audited the platform's built-in LLM judge against hand labels. It disagreed with the grader 17 times and was wrong in 14 of them.",
    mark: <JudgeMark />,
  },
];

const WORK: [string, string, string, string][] = [
  [
    "Innovius Capital",
    "Machine Learning Engineer, Investment Platform",
    "2026 —",
    "Rebuilt the startup-ranking model and run it in production; built the release grader, a search agent over 268,000 companies, and an agent that answers deal questions with verified citations.",
  ],
  [
    "QIAGEN, Redwood City",
    "Machine Learning Intern",
    "2025",
    "A GraphRAG tool on QIAGEN's knowledge graph that ranks drug-target paths and has an LLM write cited explanations, and a fine-tuned LLM for gene-variant lookups that cut research time 70%.",
  ],
  [
    "Chapman University",
    "Mathematics Research",
    "2024 —",
    "Functional analysis and stochastic processes at graduate level; transport equations and white-noise space for stochastic modelling.",
  ],
  [
    "QIAGEN, Düsseldorf",
    "Data Science & Global Treasury Intern",
    "2024",
    "A LangChain RAG chatbot over financial dashboards that halved internal query time. Currency-risk analysis on $10M+ of transactions, and FX trades on Bloomberg.",
  ],
  [
    "York University, Toronto",
    "Data Science Intern",
    "2023",
    "Topic modelling and regressions on earnings calls, to study how investment firms discuss and adopt fintech.",
  ],
  [
    "Precanto",
    "Data Science and Product Intern",
    "2023",
    "Time-series forecasts of hiring and attrition, and automated payroll-tax validation that raised its efficiency 90%.",
  ],
  [
    "Greenfield Research Partners",
    "Private Equity Research Associate",
    "2023",
    "Sourced 100+ real-estate acquisition targets, five of them potential deals worth $50M+, and supported LBO modelling.",
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

function Feature({
  id,
  n,
  kind,
  title,
  href,
  body,
  result,
  links,
  flip,
  children,
}: {
  id: string;
  n: string;
  kind: string;
  title: string;
  href?: string;
  body: React.ReactNode;
  result: React.ReactNode;
  links: FeatureLink[];
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-8 border-t border-rule px-6 py-14 sm:px-10 sm:py-20">
      <Reveal>
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
          <div className={flip ? "lg:order-2" : ""}>
            <div className="flex items-baseline gap-3">
              <span className="mono text-[12.5px] text-ink-3">{n}</span>
              <span className="label">{kind}</span>
            </div>
            <h2 className="mt-4 text-[28px] leading-[1.12] tracking-[-0.025em] sm:text-[36px]">
              {href ? (
                <Link href={href} className="transition-colors hover:text-[var(--color-sea)]">
                  {title}
                </Link>
              ) : (
                title
              )}
            </h2>
            <p className="mt-5 text-[16.5px] leading-[1.68] text-ink-2">{body}</p>
            <p className="mt-3.5 text-[16.5px] leading-[1.68] text-ink-2">
              <span className="font-medium text-ink">Result. </span>
              {result}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
              {links.map((l) =>
                l.href.startsWith("/") && !l.href.endsWith(".pdf") ? (
                  <Link key={l.href} href={l.href} className="link">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.href} href={l.href} className="link">
                    {l.label}
                  </a>
                ),
              )}
            </div>
          </div>
          <div className={flip ? "lg:order-1" : ""}>{children}</div>
        </div>
      </Reveal>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <header className="px-6 pt-16 pb-14 sm:px-10 sm:pt-24 sm:pb-16">
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
              <p className="mt-8 max-w-[38rem] text-[19px] leading-[1.6] text-ink-2">
                Machine learning engineer on the investment platform at Innovius Capital, and a
                master&apos;s student in Computer Science at USC. Previously two summers at
                QIAGEN, plus Precanto and York University. Undergrad in economics at Santa Clara,
                where I played Division I tennis.
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

      <section aria-label="In numbers" className="border-t border-rule">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map(([href, figure, caption], i) => (
            <li
              key={href}
              className={`border-rule ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${
                i === 2 ? "lg:border-l" : ""
              }`}
            >
              <a href={href} className="group block h-full px-6 py-7 sm:px-10 sm:py-9">
                <div className="whitespace-nowrap text-[30px] leading-none tracking-[-0.035em] text-ink transition-colors group-hover:text-[var(--color-sea)] sm:text-[40px]">
                  {figure}
                </div>
                <div className="mt-3 text-[13.5px] leading-[1.55] text-ink-3">{caption}</div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Feature
        id="innovius"
        n="01"
        kind="Innovius Capital · 2026 to now"
        title="The model that ranks startups for a venture firm"
        body={
          <>
            I rebuilt the firm&apos;s startup-ranking model as CatBoost with a GPT-4o rubric and
            took it to production: a weekly pipeline that scores 14,000 companies with drift
            checks and alerts, and an LLM grader, matched against real investor decisions, that
            gates every model release.
          </>
        }
        result={
          <>
            90% of the model&apos;s top-20 picks advanced, against 20% before. A search agent I
            built over 268,000 companies raised recall from 49% to 93% in backtests, and a
            tool-use agent now answers deal questions from CRM data and call transcripts with
            citations verified in code.
          </>
        }
        links={[{ href: "/Raunak-Sood-Resume.pdf", label: "Résumé" }]}
      >
        <RankerFigure />
      </Feature>

      <Feature
        id="leakprobe"
        n="02"
        kind="Open source · Python · sole author"
        title="leakprobe"
        href="/work/quant"
        flip
        body={
          <>
            A test for data leakage that needs no answer key. You say which tables each feature
            may read; it changes something the code must be blind to, like one table&apos;s
            timestamps, and re-runs. Anything that moves was reading something it shouldn&apos;t.
          </>
        }
        result={
          <>
            It caught a factor declared price-only that was quietly reading company filings; the
            dating mistake it tests for inflated a 22-factor study&apos;s measured skill by 59%.
            Released on PyPI; on five public datasets it catches 8 of 9 planted leaks with no
            false alarms, and the ninth is invisible to it by construction.
          </>
        }
        links={[
          { href: "/work/quant", label: "Read the write-up" },
          { href: "https://github.com/quantraunak/leakprobe", label: "GitHub" },
          { href: "https://pypi.org/project/leakprobe/", label: "pip install leakprobe" },
        ]}
      >
        <LeakDemo />
      </Feature>

      <Feature
        id="melange"
        n="03"
        kind="Product · TypeScript, iOS, Postgres, CLIP"
        title="Melange"
        href="/work/melange"
        body={
          <>
            An app for creative people to find collaborators, with an AI that learns taste from
            the work people make and suggests who to work with, measured against random
            suggestions.
          </>
        }
        result={
          <>
            Live on the App Store (2.1) and the web. Its table composer beats random seating on
            its own taste objective (0.77–0.85 vs 0.64–0.69); whether that yields more real
            collaborations is what the first events will measure. About a dozen accounts so far.
          </>
        }
        links={[
          { href: "/work/melange", label: "Read the write-up" },
          { href: "https://apps.apple.com/app/id6774481477", label: "App Store" },
          { href: "https://melange-psi.vercel.app", label: "Web app" },
        ]}
      >
        <PhoneRow />
      </Feature>

      <Feature
        id="reasoning"
        n="04"
        kind="AI research · USC · five authors"
        title="Resampled Thought Trees"
        href="/work/reasoning"
        flip
        body={
          <>
            Score each step of an AI&apos;s reasoning by freezing the search there and re-running
            it ten times. The share of re-runs that still succeed is what the step was worth.
          </>
        }
        result={
          <>
            A per-step value map from about 11,000 stochastic re-runs on 100 puzzles: most steps
            are dead ends or bottlenecks, and pass/fail scoring hides which branches carried the
            solutions. A five-author course project, built and run collaboratively.
          </>
        }
        links={[
          { href: "/work/reasoning", label: "Read the write-up" },
          { href: "/Resampled-Thought-Trees.pdf", label: "Paper (PDF)" },
        ]}
      >
        <ResampleFigure />
      </Feature>

      <section className="border-t border-rule px-6 pt-11 pb-12 sm:px-10">
        <h2 className="label">Also built</h2>
        <div className="mt-6 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {MORE.map((p, i) => (
            <Reveal key={p.href} delay={i * 60}>
              <Link
                href={p.href}
                {...(p.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group block transition-transform duration-300 ease-out hover:-translate-y-1"
              >
                {p.mark}
                <h3 className="mt-5 text-[21px] leading-tight tracking-[-0.02em] transition-colors group-hover:text-[var(--color-sea)]">
                  {p.title}
                </h3>
                <div className="mt-1.5 text-[12.5px] text-ink-3">{p.kind}</div>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">{p.text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-rule px-6 pt-11 sm:px-10">
        <h2 className="label mb-1">Papers</h2>
        <ul>
          {PAPERS.map(([href, title, blurb, meta]) => (
            <li key={href} className="border-b border-rule-soft py-4 last:border-0">
              <a href={href} target="_blank" rel="noreferrer" className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-[16.5px] leading-snug transition-colors group-hover:text-[var(--color-sea)]">
                    {title}
                  </div>
                  <div className="mono shrink-0 text-[12.5px] text-ink-3">{meta}</div>
                </div>
                <div className="mt-1 max-w-[52rem] text-[14.5px] leading-[1.6] text-ink-3">{blurb}</div>
              </a>
            </li>
          ))}
        </ul>
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
                <div className="mt-1 max-w-[52rem] text-[14.5px] leading-[1.6] text-ink-3">{blurb}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-rule px-6 pt-11 pb-2 sm:px-10">
        <h2 className="label">Experience</h2>
        <Reveal>
          <ul className="mt-4">
            {WORK.map(([org, role, when, did]) => (
              <li
                key={org + when}
                className="grid gap-x-10 gap-y-1.5 border-b border-rule-soft py-5 last:border-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="text-[17px] leading-snug">{org}</div>
                    <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                  </div>
                  <div className="mt-0.5 text-[15px] text-ink-3">{role}</div>
                </div>
                <p className="text-[15px] leading-[1.65] text-ink-2">{did}</p>
              </li>
            ))}
          </ul>
        </Reveal>
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
              Python · PyTorch · CatBoost · LLM agents and evals · SQL
              <br />
              TypeScript · React Native · Next.js · Postgres · AWS
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
