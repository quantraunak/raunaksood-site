import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { CardVisual } from "@/components/card-visual";
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
      "An app for photographers, models and stylists to find each other. Live on the App Store and the web, two clients against one Postgres.",
    note: "App Store + web · 17k lines",
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
                Graduating May 2027. Looking for machine learning and AI engineering roles.
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
            {WORK.map(([org, role, when]) => (
              <li key={org + when} className="border-b border-rule-soft py-4 last:border-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-[17px] leading-snug">{org}</div>
                  <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                </div>
                <div className="mt-0.5 text-[15px] text-ink-3">{role}</div>
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
