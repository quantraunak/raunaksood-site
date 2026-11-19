import type { Metadata } from "next";
import Link from "next/link";
import q from "@/public/data/quant.json";
import { Shell, PageHeader, Lede, Links } from "@/components/ui";
import { GrowthChart, SeedLottery, BeforeAfter, Signatures } from "@/components/simple-charts";
import { Details } from "@/components/details";
import { LeakDemo } from "@/components/leak-demo";
import { Contribution } from "@/components/contribution";

export const metadata: Metadata = {
  title: "leakprobe",
  alternates: { canonical: "/work/quant" },
  openGraph: { title: "leakprobe", url: "/work/quant" },
  description:
    "Temporal leakage never throws an error and always improves your metrics. leakprobe finds it by changing something your features must be invariant to and reporting whatever moved.",
};

export default function QuantPage() {
  return (
    <Shell numbered path="/work/quant">
      <PageHeader kind="Open source · Python" title="leakprobe">
        <Lede>
          Finding the bug that makes your model look good. If a model gets to see data that
          didn&apos;t exist yet, it scores brilliantly in testing and fails the moment it&apos;s
          real. Nothing crashes and no number looks strange.
        </Lede>
        <Links>
          <a href="https://github.com/quantraunak/leakprobe" className="mlink">GitHub</a>
          <a href="https://pypi.org/project/leakprobe/" className="mlink">PyPI</a>
          <a href="/Bias-Fingerprints.pdf" className="mlink">Paper</a>
          <Link href="/writing/testing-for-leakage" className="mlink">Essay</Link>
        </Links>
        <div className="mt-10">
          <LeakDemo />
          <p className="cap">
            Move the clock on one data source. Anything that shifts had a dependency on it that
            nobody declared.
          </p>
        </div>
        <Contribution
          proposed="Test a feature pipeline for data leakage without knowing the right answers: declare which tables each feature may read, change something the code must be blind to, and treat any movement as proof of an undeclared dependency. Behind it, bias fingerprinting: each data-handling mistake in a stock-picking study leaves a fixed pattern of shifts across 22 standard signals, so a published results table can be read backwards to say which mistake it contains."
          result="The test caught a factor declared price-only that was reading company filings; the dating mistake it tests for inflated a 22-factor study's measured skill by 59%. Released as pip install leakprobe; on five public datasets it catches 8 of 9 planted leaks with no false alarms, and the one it misses is invisible to it by construction. The fingerprint paper shows a dating mistake inflates and a survivorship mistake rearranges, and that only the second is identifiable from outside."
        />
      </PageHeader>

      <section className="part">
        <h2 className="h">The trick</h2>
        <div className="prose">
          <p>
            Some of your features can&apos;t possibly depend on when a particular table
            arrived. A feature built only from daily prices cannot care what day an earnings
            report was published. You can know that from arithmetic, without reading the code.
          </p>
          <p>
            So push that table&apos;s arrival date a month later and run everything again. The features that can&apos;t see it return <em>identical</em> numbers, to the last decimal, because they got the same arrays through the same code. Their difference is{" "}
            <span className="mono">0.0</span>, not <span className="mono">1e-15</span>. Anything that moves has a connection to that table you
            didn&apos;t know about. In a system that predicts the future, an unknown connection to <em>when data arrived</em> is the bug you&apos;re looking for.
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
            resolved, so tickets still open at scoring time leak in, and those are the ones that predict churn. It declares that it reads tickets, then doesn&apos;t react when the ticket clock moves, because it reached around the clock.
          </p>
        </div>
      </section>

      <section className="part">
        <h2 className="h">It caught a real one</h2>
        <div className="prose">
          <p>
            In the project this came out of, a signal called{" "}
            <span className="mono">turnover_1m</span> was filed under &ldquo;built from
            prices and trading volume.&rdquo; It lives in a file called{" "}
            <span className="mono">price.py</span>. Every person who looked at it agreed.
          </p>
          <p>
            It divides by shares outstanding, a number that comes off a company filing. So it was reading regulatory data while sitting in the group that
            supposedly couldn&apos;t. Nobody found that by reading the code. The test found
            it, because it was the one member of its group that moved when the filing
            calendar shifted and eleven others held at exactly zero.
          </p>
        </div>
      </section>

      <section className="part">
        <h2 className="h">Where the idea came from</h2>
        <div className="prose">
          <p>
            This started as a question about stock-picking research, where the same bug has
            a name: using a company&apos;s quarterly figures on the day the quarter ended
            rather than the day they were published. It is like betting on a game with tomorrow&apos;s newspaper.
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
            today&apos;s list of big companies and running it backwards, which fills your sample with firms that were small a decade ago and then grew. It damages a different set of rules, in a different direction. That is a separate finding and the subject of the paper below.
          </p>
        </div>
      </section>

      <section className="part">
        <h2 className="h">The paper: Bias Fingerprints</h2>
        <div className="prose">
          <p>
            A write-up of the measurements above: what each mistake does to 22 stock-picking
            rules, why one of them doesn&apos;t inflate results at all but rearranges which
            rules look good, and a method for reading the damage backwards to identify
            which mistake a study contains. The method&apos;s validation protocol has been run:
            the universe mistake is identifiable from a results table alone, 99% of the time
            in simulation, and the dating mistake is not, which the geometry predicts. The
            gate statistics were recomputed in October 2026 after a unit mismatch was found;
            the verdicts did not change, the numbers did, and the paper says so.
          </p>
        </div>
        <div className="links">
          <a href="/Bias-Fingerprints.pdf" className="mlink">Read the paper (PDF)</a>
        </div>
      </section>

      <section className="part">
        <h2 className="h">The pipeline underneath</h2>
        <div className="prose">
          <p>
            None of this works without a pipeline that is correct on the dimension being studied,
            because the correct run is what everything else is measured against. That is
            a model ranking about 500 large US companies each month, buying the ones it expects to
            do well and betting against the rest, built on records of which companies were in the
            index on any past date, including ones that have since left it, and on government
            filings dated to the day they were published. One known gap: the price history
            comes from a free source that drops companies after they delist, so the baseline
            is itself partly survivorship-filtered. The paper says so.
          </p>
        </div>

        <GrowthChart />

        <div className="prose">
          <p>
            The five bad years aren&apos;t a mistake. The model buys cheap, unglamorous companies,
            and 2014 to 2018 was the worst stretch for that approach in modern history.
          </p>
          <p>
            1.9% a year is the control condition, not a finding: the number you get when nothing is wrong, which is what makes it possible to
            price each mistake against it.
          </p>
        </div>
      </section>

      <section className="part">
        <h2 className="h">Two things worth knowing about any backtest</h2>
        <div className="prose">
          <p>
            Building the instrument produced two results that have nothing to do with this
            particular model. The first: most reported strategy returns are partly exposure to
            a rising market, which an index fund gives you for free, so a return has to be split
            into market exposure and what is left before it says anything about skill.
          </p>
        </div>
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

      <section className="part">
        <h2 className="h">How the pipeline got built</h2>
        <div className="prose">
          <p>
            The pipeline began as an inherited version whose own output reported 35% a year, a
            number that no longer reproduces and is quoted only as the starting point. Reproducing it turned
            up six separate problems, none of which raised an error or produced an implausible
            number. That made them worth studying, and they are what turned into{" "}
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

        <div className="links">
          <a href="https://github.com/quantraunak/bias-fingerprints" className="mlink">
            Code on GitHub
          </a>
          <a href="https://quantraunak.github.io/bias-fingerprints/" className="mlink">
            Full results dashboard
          </a>
        </div>
      </section>
    </Shell>
  );
}
