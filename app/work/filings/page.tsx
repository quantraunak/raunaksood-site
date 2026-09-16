import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { CoverageFigure, AsymmetryFigure } from "@/components/filings-visuals";

export const metadata: Metadata = {
  title: "filing-links",
  description:
    "A dated map of which companies name which others in their 10-K filings, released with its own coverage ceiling attached. The pre-registered gate fired and the study stopped.",
};

export default function FilingsPage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Information extraction · Python</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          A map of who buys from whom, and why it stops short
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          Companies name each other in their annual filings. I extracted 5,461 of those
          relationships with a model running on my laptop, built the graph, and then found it
          was too thin to answer the question I built it for. The reason turned out to be the
          interesting part.
        </p>
        <div className="mt-7 flex flex-wrap gap-6 text-[16px]">
          <a href="https://github.com/quantraunak/filing-links" className="link">
            filing-links on GitHub
          </a>
        </div>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">The idea</h2>
        <div className="prose mt-5">
          <p>
            <em>&ldquo;Intel is one of our most significant customers.&rdquo;</em>{" "}
            <em>&ldquo;We purchase substrates from Ibiden and Unimicron.&rdquo;</em> Sentences
            like these sit in thousands of 10-K filings, and together they describe a network
            of who depends on whom.
          </p>
          <p>
            There&apos;s a known effect that makes this worth mapping: when a company&apos;s
            major customer has a good month, the supplier tends to follow about a month later,
            because investors don&apos;t track relationships no database makes visible.
          </p>
          <p>
            You can buy supply-chain data, but not as a <em>historical series that knows what
            was public on each past date</em>. Without that, any backtest is quietly using
            tomorrow&apos;s knowledge. So I built one: every edge stamped with the day the
            filing appeared, and every claim required to quote the sentence it came from
            word-for-word.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What I built</h2>
        <div className="prose mt-5">
          <p>
            1,989 filings from S&amp;P 500 companies, run through a 30-billion-parameter model
            on a laptop over about 22 hours. No API spend. Each extracted relationship survives
            only if its supporting quote appears literally in the filing, which throws out
            anything the model invented.
          </p>
          <p>
            Before running it I wrote down what would make me stop. If the finished graph
            couldn&apos;t cover enough companies to test the return effect, the study ends at
            the coverage report rather than proceeding to a weaker test that might produce a
            publishable-looking number anyway.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The gate fired</h2>
        <CoverageFigure />
        <div className="prose">
          <p>
            1,185 relationships across 125 companies — which sounds like a lot until you ask
            how many companies it covers <em>on any given day</em>. The answer is 27, out of
            roughly 420 trading. The test I built this for needs about 145.
          </p>
          <p>
            At 27, the statistical bar the test would have to clear is roughly double the size
            of the effect published research reports. It would run. It just wouldn&apos;t mean
            anything. So I didn&apos;t run it.
          </p>
          <p>
            Four explanations for the shortfall occurred to me, and I tested each against data
            I already had before changing anything: that the name-matching had broken, that
            valid claims were being silently discarded, that the cheaper model had collapsed,
            and that coverage saturates so more filings wouldn&apos;t help. All four were
            wrong. Coverage grows in a straight line with the number of filings — ten times
            the filings gives almost exactly ten times the coverage.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What was actually going on</h2>
        <AsymmetryFigure />
        <div className="prose">
          <p>
            US securities regulation requires a company to disclose any customer worth more
            than 10% of its revenue. It requires nothing equivalent about suppliers.
          </p>
          <p>
            So disclosure is lopsided by law, and extracting the S&amp;P 500 means extracting
            the side of every relationship that isn&apos;t obliged to speak. Large companies
            rarely name who they buy from. That also explains why roughly 45% of the filings
            name nobody at all — a rate that held steady across two different models, so
            it&apos;s a property of the filings rather than of the extractor.
          </p>
          <p>
            The design lesson follows directly: this graph is built from the{" "}
            <strong>supplier</strong> side. Small companies naming their large customers is
            what the law compels. 2,261 filings from 181 such companies are already downloaded
            and screened in the repository, waiting.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Why it matters</h2>
        <div className="prose mt-5">
          <p>
            The graph is real and released, with per-edge quotes and its coverage ceiling
            attached. Commercial supply-chain datasets publish neither their point-in-time
            behaviour nor how much of the market they actually cover, and both decide whether
            a result built on them is trustworthy.
          </p>
          <p>
            The rest is a negative result reported at full strength. I built the thing, it
            wasn&apos;t enough, and the reason is a fact about disclosure law that anyone
            planning the same project can use before spending the compute.
          </p>
        </div>
      </section>
    </Shell>
  );
}
