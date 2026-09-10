import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { CardVisual } from "@/components/card-visual";

const PROJECTS = [
  {
    href: "/work/quant",
    title: "leakcheck",
    plain:
      "A model that reads tomorrow's data scores brilliantly and fails in production. This finds it, by changing something your code shouldn't notice and seeing what moves.",
    tag: "Open source · Python",
  },
  {
    href: "/work/reasoning",
    title: "Resampled Thought Trees",
    plain:
      "When an AI reasons step by step, which steps actually matter? We froze it mid-thought and re-ran the search 22,000 times to find out.",
    tag: "AI research · USC · 5 authors",
  },
  {
    href: "/work/melange",
    title: "Melange",
    plain:
      "An app for photographers, models and stylists to find each other. Shipped on iPhone and the web.",
    tag: "Product · TypeScript, iOS",
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

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ photo */}
      <div className="relative h-[38svh] min-h-[240px] w-full sm:h-[46svh]">
        <Image src="/ocean.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
      </div>

      <Shell>
        {/* ------------------------------------------------------------ me */}
        <header className="pb-12 pt-12 sm:pt-16">
          <h1 className="text-[38px] leading-tight sm:text-[46px]">Raunak Sood</h1>
          <p className="mt-5 text-[19px] leading-[1.65] text-ink-2">
            I build measurement infrastructure — the kind that tells you when a result is real
            and when it&apos;s an artifact of how the data was put together. Master&apos;s in
            Computer Science at USC, machine learning at an investment firm.
          </p>
          <p className="mt-4 text-[19px] leading-[1.65] text-ink-2">
            Three things below. The first is a tool you can install.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[16px]">
            {[
              ["mailto:raunak.sood@gmail.com", "Email"],
              ["/Raunak-Sood-Resume.pdf", "Résumé (PDF)"],
              ["https://github.com/quantraunak", "GitHub"],
              ["https://www.linkedin.com/in/raunak-sood", "LinkedIn"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="link">
                {label}
              </a>
            ))}
          </div>
        </header>

        {/* ------------------------------------------------------ projects */}
        <section className="rule py-14">
          <h2 className="label mb-9">Projects</h2>

          <div className="space-y-4">
            {PROJECTS.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block rounded-xl border border-rule p-7 transition-colors hover:border-[var(--color-sea)]"
              >
                <CardVisual index={i} />
                <div className="mt-5 text-[13px] text-ink-3">{p.tag}</div>
                <h3 className="mt-2 text-[24px] leading-snug transition-colors group-hover:text-[var(--color-sea)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[17.5px] leading-[1.7] text-ink-2">{p.plain}</p>
                <span className="mt-5 inline-block text-[15px] text-ink-3 transition-colors group-hover:text-[var(--color-sea)]">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- resume */}
        <section className="rule py-14">
          <h2 className="label mb-9">Experience</h2>
          <ul>
            {WORK.map(([org, role, when]) => (
              <li
                key={org + when}
                className="rule-soft flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 first:border-t-0 first:pt-0"
              >
                <div>
                  <div className="text-[18px]">{org}</div>
                  <div className="mt-1 text-[16px] text-ink-3">{role}</div>
                </div>
                <div className="text-[15px] tnum text-ink-3">{when}</div>
              </li>
            ))}
          </ul>

          <h2 className="label mb-9 mt-14">Education</h2>
          <ul>
            {SCHOOL.map(([org, role, when]) => (
              <li
                key={org}
                className="rule-soft flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 first:border-t-0 first:pt-0"
              >
                <div>
                  <div className="text-[18px]">{org}</div>
                  <div className="mt-1 text-[16px] text-ink-3">{role}</div>
                </div>
                <div className="text-[15px] tnum text-ink-3">{when}</div>
              </li>
            ))}
          </ul>

          <h2 className="label mb-6 mt-14">Tools</h2>
          <p className="text-[17px] leading-[1.9] text-ink-2">
            Python, PyTorch, LightGBM, scikit-learn, pandas, SQL, R
            <br />
            TypeScript, React, Next.js, Postgres, Docker, AWS
          </p>
        </section>
      </Shell>
    </>
  );
}
