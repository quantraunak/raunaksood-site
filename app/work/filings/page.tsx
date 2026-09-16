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
          Companies name each other in their annual filings. I extracted 10,382 of those
          relationships with a model running on my laptop, built the graph, and then found it
          was too thin to answer the question I built it for. The reason turned out to be the
          interesting part, and acting on it nearly doubled the graph without closing the gap.
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
            3,298 filings, run through a 30-billion-parameter model on a laptop over about
            27 hours across two passes. No API spend. Each extracted relationship survives
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
            2,572 relationships across 220 companies — which sounds like a lot until you ask
            how many companies it covers <em>on any given day</em>. The answer is 47, out of
            roughly 403 trading. The test I built this for needs about 97 to see effects the
            size the literature actually reports.
          </p>
          <p>
            At 47, the bar the test would have to clear is IC 0.024, and published effects sit
            near 0.010 to 0.020. It would run. It still wouldn&apos;t mean anything. So I
            didn&apos;t run it.
          </p>
          <p>
            Four explanations for the shortfall occurred to me, and I tested each against data
            I already had before changing anything: that the name-matching had broken, that
            valid claims were being silently discarded, that the cheaper model had collapsed,
            and that coverage saturates so more filings wouldn&apos;t help. All four were
            wrong. Coverage grows in a straight line with the number of filings, which I have
            now measured twice — ten times the filings gave almost exactly ten times the
            coverage the first time, and running a second corpus 1.7&times; the size moved it
            1.7&times; again.
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
            The design lesson follows directly: this graph should be built from the{" "}
            <strong>supplier</strong> side, because small companies naming their large
            customers is what the law compels. So I ran it.
          </p>
          <p>
            First a check that decided whether it was worth doing at all: none of those 181
            companies were in the price panel, because the panel is built from index
            membership. A company with no share price contributes a relationship but never a
            testable observation. Fetching prices and applying the same screens left 105 that
            are genuinely tradable.
          </p>
          <p>
            Extracting their 1,322 filings confirmed the prediction. They yield 5.9
            relationships per productive filing against 5.0 for the large caps, at an
            unchanged resolution rate, and coverage went from 27 names per day to{" "}
            <strong>47</strong>.
          </p>
          <p>
            And it still wasn&apos;t enough. That is the honest end of this study: the reason
            for the shortfall was right, acting on it nearly doubled the graph, and the bar
            was further away than the gain. Getting to 97 would need roughly 6,800 filings
            against the 3,298 that exist, from companies not yet downloaded. That is a
            different project, not a continuation of this one.
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
