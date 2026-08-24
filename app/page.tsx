import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { HomeSpark } from "@/components/home-spark";
import { OnScroll } from "@/components/charts";

const PROJECTS = [
  {
    href: "/work/quant",
    kind: "Quantitative research",
    title: "Equity factor research",
    line: "A market-neutral US equity signal — and where its edge actually goes.",
    figures: [
      ["0.0165", "out-of-sample IC"],
      ["59%", "of the edge is beta"],
    ],
    accent: "var(--color-deep)",
  },
  {
    href: "/work/reasoning",
    kind: "LLM reasoning",
    title: "Resampled Thought Trees",
    line: "Which thoughts in a reasoning tree actually matter? Freeze one and re-run the search.",
    figures: [
      ["22,350", "resampling trials"],
      ["280", "search trees"],
    ],
    accent: "var(--color-kelp)",
  },
  {
    href: "/work/melange",
    kind: "Product · iOS & web",
    title: "Melange",
    line: "Two shipped clients on one Postgres, with no backend server to trust.",
    figures: [
      ["2", "shipped clients"],
      ["0", "backend servers"],
    ],
    accent: "var(--color-coral)",
  },
];

const WORK: [string, string, string][] = [
  ["2026 —", "Innovius Capital", "Machine Learning Intern"],
  ["2025", "QIAGEN, Redwood City", "Machine Learning Intern"],
  ["2024", "QIAGEN, Düsseldorf", "Data Science & Treasury"],
  ["2023", "Precanto", "Data Science & Product"],
  ["2023", "York University, Toronto", "Data Science"],
];

const SCHOOL: [string, string, string][] = [
  ["2025 — 27", "University of Southern California", "M.S. Computer Science · GPA 3.85"],
  ["2020 — 24", "Santa Clara University", "B.S. Economics · Division I tennis"],
];

const LINKS: [string, string][] = [
  ["mailto:raunak.sood@gmail.com", "Email"],
  ["https://github.com/quantraunak", "GitHub"],
  ["https://www.linkedin.com/in/raunak-sood", "LinkedIn"],
  ["/Raunak-Sood-Resume.pdf", "Résumé"],
];

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
        <Image
          src="/ocean.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {/* keeps the headline legible over the water without greying the photo */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,.72) 0%, rgba(255,255,255,.34) 34%, rgba(255,255,255,.12) 60%, var(--color-paper) 100%)",
          }}
        />
        <Shell>
          <div className="pb-16 pt-40 sm:pb-24 sm:pt-52">
            <h1 className="serif text-[clamp(44px,9vw,104px)] leading-[0.95] text-[#08202f]">
              Raunak Sood
            </h1>
            <p className="mt-6 max-w-[46ch] text-[clamp(17px,2.1vw,21px)] leading-[1.6] text-[#1d3d51]">
              Machine learning and quantitative research. M.S. Computer Science at USC, machine
              learning at Innovius Capital.
            </p>
          </div>
        </Shell>
      </section>

      <Shell>
        {/* --------------------------------------------------------- links */}
        <nav className="flex flex-wrap gap-x-8 gap-y-3 py-8">
          {LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-[15px] text-ink-2 underline decoration-rule underline-offset-[6px] transition-colors hover:text-[var(--color-sea)] hover:decoration-[var(--color-sea)]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ------------------------------------------------------ projects */}
        <section className="py-14 sm:py-20">
          <h2 className="eyebrow mb-9">Projects</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <OnScroll key={p.href} delay={i * 90} className="h-full">
                <Link
                  href={p.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule-soft bg-paper-2 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-sea)]"
                >
                  <div className="px-5 pt-5">
                    <HomeSpark index={i} accent={p.accent} />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                    <div className="eyebrow">{p.kind}</div>
                    <h3 className="serif mt-2 text-[24px] leading-tight transition-colors group-hover:text-[var(--color-sea)]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{p.line}</p>
                    <div className="mt-auto flex gap-8 pt-7">
                      {p.figures.map(([v, l]) => (
                        <div key={l}>
                          <div className="mono text-[19px] tnum" style={{ color: p.accent }}>
                            {v}
                          </div>
                          <div className="mt-1 text-[12px] leading-snug text-ink-3">{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </OnScroll>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- resume */}
        <section className="rule py-14 sm:py-20">
          <h2 className="eyebrow mb-9">Résumé</h2>

          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
            <div>
              <h3 className="text-[13px] font-medium tracking-wide text-ink-3">EXPERIENCE</h3>
              <ul className="mt-5">
                {WORK.map(([when, org, role]) => (
                  <li
                    key={org + when}
                    className="rule-soft flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 first:border-t-0 first:pt-0"
                  >
                    <div>
                      <div className="text-[16px]">{org}</div>
                      <div className="mt-0.5 text-[14px] text-ink-3">{role}</div>
                    </div>
                    <div className="mono text-[12.5px] tnum text-ink-3">{when}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[13px] font-medium tracking-wide text-ink-3">EDUCATION</h3>
              <ul className="mt-5">
                {SCHOOL.map(([when, org, role]) => (
                  <li
                    key={org}
                    className="rule-soft flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 first:border-t-0 first:pt-0"
                  >
                    <div>
                      <div className="text-[16px]">{org}</div>
                      <div className="mt-0.5 text-[14px] text-ink-3">{role}</div>
                    </div>
                    <div className="mono text-[12.5px] tnum text-ink-3">{when}</div>
                  </li>
                ))}
              </ul>

              <h3 className="mt-11 text-[13px] font-medium tracking-wide text-ink-3">TOOLS</h3>
              <p className="mt-4 text-[15px] leading-[1.9] text-ink-2">
                Python · PyTorch · LightGBM · CVXPY · scikit-learn · pandas · SQL · R
                <br />
                TypeScript · Next.js · Supabase · Postgres · Docker · AWS
              </p>
            </div>
          </div>

          <a
            href="/Raunak-Sood-Resume.pdf"
            className="mt-12 inline-block rounded-full border border-rule px-6 py-2.5 text-[14px] text-ink-2 transition-colors hover:border-[var(--color-sea)] hover:text-[var(--color-sea)]"
          >
            Full résumé (PDF)
          </a>
        </section>
      </Shell>
    </>
  );
}
