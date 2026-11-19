import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const LINKS: [string, string][] = [
  ["mailto:raunak.sood@gmail.com", "Email"],
  ["https://github.com/quantraunak", "GitHub"],
  ["https://www.linkedin.com/in/raunak-sood", "LinkedIn"],
  ["/Raunak-Sood-Resume.pdf", "Résumé"],
];

const PROJECTS: [string, string, string][] = [
  ["/work/quant", "leakprobe", "Python library that finds ML features reading future data. It caught 8 of 9 planted leaks."],
  ["/work/melange", "Melange", "iOS and web app where creative people find collaborators."],
  ["/work/reasoning", "Resampled Thought Trees", "Scores each step of an AI's search by re-running from it. Five-author paper at USC."],
  ["https://github.com/quantraunak/deal-desk-voice", "Deal Desk", "Voice agent that answers deal questions with citations, and an audit of its LLM judge."],
];

const WRITING: [string, string, string][] = [
  ["/writing/testing-for-leakage", "Testing for leakage without knowing the right answer", "Essay"],
  ["/writing/the-schema-is-not-the-cost", "The schema is not the cost", "Essay"],
  ["/papers/bias-fingerprints.pdf", "Bias Fingerprints", "Paper"],
  ["/papers/cardinality.pdf", "What Constrained Decoding Buys at High Item Counts", "Paper"],
];

function Anchor({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const internal = href.startsWith("/") && !href.endsWith(".pdf");
  return internal ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="sec">{children}</h2>;
}

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[600px] px-6 pb-20 pt-16 text-[15.5px] leading-[1.65] sm:pt-28">
      <header>
        <h1 className="text-[15.5px] font-medium tracking-normal">Raunak Sood</h1>
        <p className="mt-5">
          Machine learning engineer at Innovius Capital and master&apos;s student in computer
          science at USC, graduating May 2027.
        </p>
        <p className="mt-3.5">
          At Innovius I rebuilt the firm&apos;s startup-ranking model. Of its top 20 picks, 90%
          advanced, up from 20% with the model it replaced. Before that I spent two summers on
          machine learning at QIAGEN and studied economics at Santa Clara, where I played Division
          I tennis.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="link">
              {label}
            </a>
          ))}
        </p>
      </header>

      <section className="mt-12">
        <Heading>Projects</Heading>
        <ul className="space-y-3">
          {PROJECTS.map(([href, name, line]) => (
            <li key={href} className="sm:grid sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:gap-x-4">
              <span>
                <Anchor href={href} className="title">
                  {name}
                </Anchor>
              </span>
              <span className="block text-ink-2">{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-ink-3">
          Also{" "}
          <Link href="/work/cardinality" className="link">
            cardinality-eval
          </Link>{" "}
          and{" "}
          <Link href="/work/filings" className="link">
            filing-links
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <Heading>Writing</Heading>
        <ul className="space-y-2">
          {WRITING.map(([href, title, kind]) => (
            <li key={href} className="flex items-baseline justify-between gap-6">
              <Anchor href={href} className="title">
                {title}
              </Anchor>
              <span className="shrink-0 text-[13.5px] text-ink-3">{kind}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
