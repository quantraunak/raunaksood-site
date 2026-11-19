import Link from "next/link";
import type { Metadata } from "next";
import { DotField } from "@/components/dot-field";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const LINKS: [string, string][] = [
  ["https://github.com/quantraunak", "GitHub"],
  ["https://www.linkedin.com/in/raunak-sood", "LinkedIn"],
  ["/Raunak-Sood-Resume.pdf", "Résumé"],
  ["mailto:raunak.sood@gmail.com", "Email"],
];

const PROJECTS: [string, string, string, string][] = [
  ["/work/quant", "leakprobe", "Python library that finds ML features reading future data.", "PyPI"],
  ["/work/melange", "Melange", "iOS and web app where creative people find collaborators.", "App Store"],
  ["/work/reasoning", "Resampled Thought Trees", "Scores each step of an AI's search by re-running from it.", "Paper"],
  ["https://github.com/quantraunak/deal-desk-voice", "Deal Desk", "Voice agent for deal questions, with an audit of its LLM judge.", "GitHub"],
  ["/work/cardinality", "cardinality-eval", "Tests whether LLM extraction degrades as the list grows.", "Study"],
  ["/work/filings", "filing-links", "A dated map of which companies name each other in 10-Ks.", "Study"],
];

const WRITING: [string, string, string, string][] = [
  ["/writing/testing-for-leakage", "Testing for leakage without knowing the right answer", "", "Essay"],
  ["/writing/the-schema-is-not-the-cost", "The schema is not the cost", "", "Essay"],
  ["/papers/bias-fingerprints.pdf", "Bias Fingerprints", "", "Paper"],
  ["/papers/cardinality.pdf", "What Constrained Decoding Buys at High Item Counts", "", "Paper"],
];

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden className="row-arrow">
      <path d="M3 9l6-6M4.5 3H9v4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Row({ href, name, line, tag }: { href: string; name: string; line: string; tag: string }) {
  const inner = (
    <>
      <span className="min-w-0">
        <span className="row-name">{name}</span>
        {line && <span className="mt-0.5 block text-ink-2">{line}</span>}
      </span>
      <span className="tech flex shrink-0 items-center gap-1.5 pt-[3px] text-ink-3">
        {tag}
        <Arrow />
      </span>
    </>
  );
  const internal = href.startsWith("/") && !href.endsWith(".pdf");
  return (
    <li>
      {internal ? (
        <Link href={href} className="row">
          {inner}
        </Link>
      ) : (
        <a href={href} className="row">
          {inner}
        </a>
      )}
    </li>
  );
}

function Section({ label, i, children }: { label: string; i: number; children: React.ReactNode }) {
  return (
    <section className="enter mt-14" style={{ "--i": i } as React.CSSProperties}>
      <h2 className="sec">
        <span>{label}</span>
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative">
      <DotField />
      <div className="relative mx-auto w-full max-w-[620px] px-6 pb-24 pt-20 text-[15.5px] leading-[1.65] sm:px-8 sm:pt-28">
        <header>
          <div className="enter" style={{ "--i": 0 } as React.CSSProperties}>
            <h1 className="text-[22px] font-medium tracking-[-0.02em]">Raunak Sood</h1>
            <p className="tech mt-2 text-ink-3">
              Machine learning engineer
              <span className="caret" aria-hidden />
            </p>
          </div>
          <div className="enter mt-8 space-y-4" style={{ "--i": 1 } as React.CSSProperties}>
            <p>
              I build ranking models and LLM agents at Innovius Capital, and I&apos;m finishing a
              master&apos;s in computer science at USC in May 2027.
            </p>
            <p>
              At Innovius I rebuilt the firm&apos;s startup-ranking model. Of its top 20 picks,{" "}
              <span className="num">90%</span> advanced, up from <span className="num">20%</span>{" "}
              with the model it replaced. Before that I spent two summers on machine learning at
              QIAGEN and studied economics at Santa Clara, where I played Division I tennis.
            </p>
          </div>
          <p className="enter mt-7 flex flex-wrap gap-x-6 gap-y-1" style={{ "--i": 2 } as React.CSSProperties}>
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} className="mlink">
                {label}
              </a>
            ))}
          </p>
        </header>

        <Section label="Projects" i={3}>
          <ul>
            {PROJECTS.map(([href, name, line, tag]) => (
              <Row key={href} href={href} name={name} line={line} tag={tag} />
            ))}
          </ul>
        </Section>

        <Section label="Writing" i={4}>
          <ul>
            {WRITING.map(([href, name, line, tag]) => (
              <Row key={href} href={href} name={name} line={line} tag={tag} />
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
