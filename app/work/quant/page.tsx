import type { Metadata } from "next";
import Link from "next/link";
import q from "@/public/data/quant.json";
import { Shell } from "@/components/ui";
import { GrowthChart, BetaSplit, SeedLottery, BeforeAfter, Signatures } from "@/components/simple-charts";
import { Details } from "@/components/details";

export const metadata: Metadata = {
  title: "Bias fingerprints",
  description:
    "A method for checking trading research you cannot audit: measure what each data mistake does to a set of signals, then recognise that pattern in results whose code you will never see.",
};

export default function QuantPage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Quantitative research · Python</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          Telling a real edge from a data mistake
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          Almost every trading result you can read is one you cannot check. The numbers are
          published; the code is not. I propose a way around that: run one study twice, once
          correctly and once with a specific mistake introduced, and record the mark the mistake
          leaves across the signals. Different mistakes leave different marks, so the pattern of
          which results look wrong becomes evidence about what went wrong.
        </p>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">The idea</h2>
        <div className="prose mt-5">
          <p>
            The standard advice about data mistakes is written for the person who owns the code:
            date your figures correctly, build your company list correctly, check your own work.
            That advice is useless to the reader on the other side. An investor reads a fund
            manager&apos;s numbers. A reviewer reads a submitted paper. Neither can run anything.
          </p>
          <p>
            The move is to stop thinking of a mistake as an amount of inflation and start thinking
            of it as a <em>shape</em>. Using a company&apos;s quarterly figures a month before they
            were published can only affect signals that read those figures — the ones built from
            share prices alone cannot move at all. Building your company list from today&apos;s
            index members instead of the historical ones tilts everything toward small companies
            that later grew big. Those two mistakes damage different signals, in different
            directions, and the damage is a property of the mistake rather than of the study.
          </p>
          <p>
            So you measure the shape once, on a pipeline you control, and then look for it in
            results you cannot audit. I call the shapes fingerprints.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The two fingerprints</h2>
        <div className="prose mt-5">
          <p>
            Same 22 signals, same companies, same prices, same test window. One run correct, one run
            with a single mistake introduced. The difference between the two runs is the
            fingerprint.
          </p>
        </div>

        <Signatures />

        <div className="prose">
          <p>
            <strong>Wrong filing date</strong> — using a company&apos;s Q1 figures on the day the
            quarter ended rather than the day they were published — inflates measured skill by 59%
            and pushes four meaningless signals over the line into statistical significance. It
            leaves the eleven price-only signals untouched to machine precision, which is the single
            most useful fact here: a result that leans on those signals cannot have come from this
            mistake, no matter what else is true.
          </p>
          <p>
            <strong>Wrong company list</strong> does something else entirely. Average skill goes{" "}
            <em>down</em>, not up, so nothing about the headline looks improved. Underneath,
            illiquidity flips from meaningless to strongly significant and the low-volatility effect
            inverts. The reason is that today&apos;s index contains companies that were small and
            obscure a decade ago and grew into it, so a backtest on that list rewards being small
            and obscure. It is a description of a company on its way up, read backwards.
          </p>
          <p>
            The two fingerprints are nearly uncorrelated and push value signals in opposite
            directions, so one table cannot be explained by both.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What would make it a test</h2>
        <div className="prose mt-5">
          <p>
            Measuring the fingerprints is not the same as being able to use them, and the method
            says so in advance. Four things have to hold, in order: the fingerprints have to be
            stable across time periods and company samples rather than artifacts of one window;
            each has to come with an error bar; the two have to stay distinguishable once realistic
            noise is added; and only then may the method report anything, as a probability rather
            than a verdict.
          </p>
          <p>
            The third step is usually where a project like this dies, because it needs labelled
            examples and nobody labels their own mistakes. Here they are free: the mistaken versions
            are produced by the same pipeline, so thousands of them can be generated on demand.
            That is the property that makes the rest of it possible for one person.
          </p>
          <p>
            Those four steps have not been run. A diagnostic that announces an answer without a
            calibrated sense of how often it is wrong is worse than no diagnostic, so the method
            reports nothing until they have.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <div className="label">Paper</div>
        <h2 className="mt-3 text-[25px]">Bias Fingerprints</h2>
        <div className="prose mt-5">
          <p>
            The paper sets out the framework — the generator, the fingerprint, the statistical model
            that separates the fingerprint from a study&apos;s genuine skill, and the four-step
            validation protocol — then measures the two fingerprints above and reports the geometry
            of the pair.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="/Bias-Fingerprints.pdf" className="link">Read the paper (PDF)</a>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The instrument</h2>
        <div className="prose mt-5">
          <p>
            None of this works without a pipeline that is correct on the dimension being studied,
            because the correct run is what everything else is measured against. That instrument is
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
        <h2 className="text-[25px]">Where the instrument came from</h2>
        <div className="prose mt-5">
          <p>
            The pipeline began as an inherited version reporting 35% a year. Reproducing it turned
            up six separate problems, none of which raised an error or produced an implausible
            number, which is what made them worth studying: every one produced output a reviewer
            would accept. Rebuilding it correctly is what produced the instrument, and cataloguing
            the six is what suggested the question the framework answers.
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
          <a href="https://github.com/quantraunak/ls-multifactor-research" className="link">
            Code on GitHub
          </a>
          <a href="https://quantraunak.github.io/ls-multifactor-research/" className="link">
            Full results dashboard
          </a>
        </div>
      </section>
    </Shell>
  );
}
