import type { Metadata } from "next";
import Link from "next/link";
import q from "@/public/data/quant.json";
import { Shell } from "@/components/ui";
import { GrowthChart, BetaSplit, SeedLottery, BeforeAfter, Signatures } from "@/components/simple-charts";
import { Details } from "@/components/details";
import { LeakDemo } from "@/components/leak-demo";

export const metadata: Metadata = {
  title: "leakprobe",
  description:
    "Temporal leakage never throws an error and always improves your metrics. leakprobe finds it by changing something your features must be invariant to and reporting whatever moved.",
};

export default function QuantPage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Open source · Python</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          Finding the bug that makes your model look good
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          If a model gets to see data that didn&apos;t exist yet, it scores brilliantly in
          testing and fails the moment it&apos;s real. Nothing crashes. No number looks
          strange. <strong>leakprobe</strong> catches it without needing to know the right
          answer — it changes something your code shouldn&apos;t be able to notice, runs it
          again, and reports whatever moved.
        </p>
        <div className="mt-7 flex flex-wrap gap-6 text-[16px]">
          <a href="https://github.com/quantraunak/leakprobe" className="link">
            leakprobe on GitHub
          </a>
        </div>
      </header>

      <section className="rule py-12">
        <LeakDemo />
        <p className="mt-3 text-[13px] leading-[1.6] text-ink-3">
          Move the clock on one data source. Anything that shifts had a dependency on it that
          nobody declared.
        </p>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The trick</h2>
        <div className="prose mt-5">
          <p>
            Some of your features can&apos;t possibly depend on when a particular table
            arrived. A feature built only from daily prices cannot care what day an earnings
            report was published. That&apos;s not a guess about the code — it&apos;s
            arithmetic.
          </p>
          <p>
            So: push that table&apos;s arrival date a month later and run everything again.
            The features that genuinely can&apos;t see it return <em>identical</em> numbers.
            Not close — identical, to the last decimal, because they got the same arrays
            through the same code. Anything that moves has a connection to that table you
            didn&apos;t know about. And in a system that predicts the future, an unknown
            connection to <em>when data arrived</em> is exactly the bug you&apos;re looking
            for.
          </p>
          <p>
            You never need to know the correct answer. You only need to know one change the
            answer must survive.
          </p>
        </div>

        <div className="code" role="img" aria-label="leakprobe usage and output">
{`report = lp.check(
    compute=build_features,
    sources={"events": events, "tickets": tickets},
    timestamps={"events": "occurred_at", "tickets": "resolved_at"},
    declared={"total_spend": ["events"], "avg_severity": ["tickets"]},
)
report.raise_for_leaks()

feature                 events       tickets
total_spend           reads it     exactly 0
event_count           reads it     exactly 0
tickets_resolved     exactly 0      reads it
avg_severity         exactly 0       bypass?`}
        </div>

        <div className="prose">
          <p>
            That last line is a real bug. <span className="mono">avg_severity</span> filters
            support tickets on when they were <em>opened</em> rather than when they were
            resolved — so tickets still open at scoring time leak in, which are exactly the
            ones that predict churn. It declares that it reads tickets, then doesn&apos;t
            react when the ticket clock moves, because it reached around the clock entirely.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">It caught a real one</h2>
        <div className="prose mt-5">
          <p>
            In the project this came out of, a signal called{" "}
            <span className="mono">turnover_1m</span> was filed under &ldquo;built from
            prices and trading volume.&rdquo; It lives in a file called{" "}
            <span className="mono">price.py</span>. Every person who looked at it agreed.
          </p>
          <p>
            It divides by shares outstanding — a number that comes off a company filing. So
            it was quietly reading regulatory data while sitting in the group that
            supposedly couldn&apos;t. Nobody found that by reading the code. The test found
            it, because it was the one member of its group that moved when the filing
            calendar shifted and eleven others held at exactly zero.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Where the idea came from</h2>
        <div className="prose mt-5">
          <p>
            This started as a question about stock-picking research, where the same bug has
            a name: using a company&apos;s quarterly figures on the day the quarter ended
            rather than the day they were actually published. Roughly, betting on a game
            with tomorrow&apos;s newspaper.
          </p>
          <p>
            I measured what that costs. Take 22 stock-picking rules, run them on identical
            data once correctly and once with the mistake introduced, and compare. Measured
            skill went up 59%, and four rules that were worthless crossed the line into
            statistically significant. But it only touched the eleven rules that read
            company filings. The other eleven use nothing but prices, and they came back
            identical to the last decimal.
          </p>
          <p>
            That block of exact zeros is the whole method. It is what turns &ldquo;this
            number changed a bit&rdquo; into &ldquo;this feature has a dependency it should
            not have,&rdquo; and it is what <span className="mono">leakprobe</span>{" "}
            generalises out of finance.
          </p>
        </div>

        <Signatures />

        <div className="prose">
          <p>
            The chart shows a second mistake alongside the first: building your test from
            today&apos;s list of big companies and running it backwards, which quietly fills
            your sample with firms that were small a decade ago and then grew. It damages a
            completely different set of rules, in a different direction — which is a finding
            in its own right, and the subject of the paper below.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <div className="label">Paper</div>
        <h2 className="mt-3 text-[25px]">Bias Fingerprints</h2>
        <div className="prose mt-5">
          <p>
            A write-up of the measurements above: what each mistake does to 22 stock-picking
            rules, why one of them doesn&apos;t inflate results at all but rearranges which
            rules look good, and a proposal for reading the damage backwards to identify
            which mistake a study contains. That last part is set out and explicitly not yet
            validated.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="/Bias-Fingerprints.pdf" className="link">Read the paper (PDF)</a>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The pipeline underneath</h2>
        <div className="prose mt-5">
          <p>
            None of this works without a pipeline that is correct on the dimension being studied,
            because the correct run is what everything else is measured against. That is
            a model ranking about 500 large US companies each month, buying the ones it expects to
            do well and betting against the rest, built on records of which companies were in the
            index on any past date — including ones that no longer exist — and on government filings
            dated to the day they were published.
          </p>
        </div>

        <GrowthChart />

        <div className="prose">
          <p>
            The five bad years aren&apos;t a mistake. The model buys cheap, unglamorous companies,
            and 2014 to 2018 was the worst stretch for that approach in modern history.
          </p>
          <p>
            1.9% a year is not a finding, and it is not meant to be one. It is the control
            condition: the number you get when nothing is wrong, which is what makes it possible to
            price each mistake against it.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Two things worth knowing about any backtest</h2>
        <div className="prose mt-5">
          <p>
            Building the instrument produced two results that have nothing to do with this
            particular model. The first: most reported strategy returns are partly just exposure to
            a rising market, which an index fund gives you for free. Here 59% of the apparent edge
            turns out to be exactly that.
          </p>
        </div>
        <BetaSplit />
        <div className="prose">
          <p>
            The second: machine-learning models contain randomness. Running the identical model six
            times, changing only that internal randomness, moves the headline score by a factor of
            five while the underlying signal barely moves. A single reported score is a draw from
            that spread, not a measurement of it.
          </p>
        </div>
        <SeedLottery />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">How the pipeline got built</h2>
        <div className="prose mt-5">
          <p>
            The pipeline began as an inherited version reporting 35% a year. Reproducing it turned
            up six separate problems, none of which raised an error or produced an implausible
            number — which is what made them worth studying, and what eventually turned into{" "}
            <span className="mono">leakprobe</span>. Every one produced output a reviewer would
            accept.
          </p>
        </div>

        <BeforeAfter />

        <Details summary="The six problems, in detail">
          <ol className="space-y-5">
            {q.bugs.map((b) => (
              <li key={b.n}>
                <div className="text-[16.5px] font-medium">{b.title}</div>
                <p className="mt-1.5 text-[16px] leading-[1.7] text-ink-2">{b.detail}</p>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-3">{b.evidence}</p>
              </li>
            ))}
          </ol>
        </Details>

        <Details summary="Technical detail, for readers who want it">
          <div className="prose">
            <p>
              Point-in-time S&amp;P 500 membership from reconstructed index spells; SEC EDGAR XBRL
              fundamentals keyed on filing date, handling restatements, year-to-date cash-flow
              reporting and the ASC 606 tag migration. 22 factors on true trading-day horizons,
              signed to the published anomaly direction. Cross-sectional rank target; expanding
              walk-forward with purge, 21-day embargo and label-uniqueness weights. Model selected by
              measured out-of-sample IC across five candidates.
            </p>
            <p>
              Out-of-sample IC {q.signal.mean_ic.toFixed(4)} (t = {q.signal.t_stat.toFixed(2)}),
              decile spread {q.signal.decile_spread_bps.toFixed(0)}bp per month (t ={" "}
              {q.signal.decile_spread_t.toFixed(2)}). Beta-adjusted alpha 2.12% a year at t = 0.92.
              Sharpe {q.performance.sharpe.toFixed(2)} full sample, 0.09–0.49 across seeds; −0.61 for
              2014–2018 and +0.72 for 2019–2026.
            </p>
          </div>
        </Details>

        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="https://github.com/quantraunak/bias-fingerprints" className="link">
            Code on GitHub
          </a>
          <a href="https://quantraunak.github.io/bias-fingerprints/" className="link">
            Full results dashboard
          </a>
        </div>
      </section>
    </Shell>
  );
}
