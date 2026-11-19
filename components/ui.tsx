import Link from "next/link";

/* The shared frame for every project page and essay: the same column as the
   home page, a mono label, a small title, hairline sections. */

const NEXT: Record<string, [string, string]> = {
  "/work/quant": ["/work/melange", "Melange"],
  "/work/melange": ["/work/reasoning", "Resampled Thought Trees"],
  "/work/reasoning": ["/work/cardinality", "cardinality-eval"],
  "/work/cardinality": ["/work/filings", "filing-links"],
  "/work/filings": ["/work/quant", "leakprobe"],
  "/writing/testing-for-leakage": ["/writing/the-schema-is-not-the-cost", "The schema is not the cost"],
  "/writing/the-schema-is-not-the-cost": [
    "/writing/testing-for-leakage",
    "Testing for leakage without knowing the right answer",
  ],
};

function BackArrow() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
      <path d="M10 6H2M5.5 2.5L2 6l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Reading column. `numbered` puts a mono counter beside each section title.
 *  `path` adds the "next" link at the foot of the page. */
export function Shell({
  children,
  numbered = false,
  path,
}: {
  children: React.ReactNode;
  numbered?: boolean;
  path?: string;
}) {
  const next = path ? NEXT[path] : undefined;
  return (
    <div className={`doc mx-auto w-full max-w-[620px] px-6 pb-24 sm:px-8${numbered ? " numbered" : ""}`}>
      {children}
      <nav className="foot" aria-label="More pages">
        <Link href="/" className="back">
          <BackArrow />
          Index
        </Link>
        {next && (
          <Link href={next[0]} className="next">
            <span className="tech text-ink-3">Next</span>
            <span className="next-name">{next[1]}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}

/** Top of a page: back link level with the theme switch, label, title, then
 *  whatever the page puts under it. */
export function PageHeader({
  kind,
  title,
  children,
}: {
  kind?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="enter">
      <Link href="/" className="back back-top">
        <BackArrow />
        Index
      </Link>
      {kind && <p className="tech mt-12 text-ink-3 sm:mt-16">{kind}</p>}
      <h1 className={kind ? "mt-3" : "mt-12 sm:mt-16"}>{title}</h1>
      {children}
    </header>
  );
}

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="lede">{children}</p>;
}

/** A row of small mono links. */
export function Links({ children }: { children: React.ReactNode }) {
  return <p className="links">{children}</p>;
}

export function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="part">
      {title && <h2 className="h">{title}</h2>}
      {children}
    </section>
  );
}
