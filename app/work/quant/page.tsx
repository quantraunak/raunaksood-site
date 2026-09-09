import type { Metadata } from "next";
import Link from "next/link";
import q from "@/public/data/quant.json";
import { Shell } from "@/components/ui";
import { GrowthChart, BetaSplit, SeedLottery, BeforeAfter } from "@/components/simple-charts";
import { Details } from "@/components/details";

export const metadata: Metadata = {
  title: "Equity factor research",
  description:
    "A stock-picking model rebuilt from scratch after finding six bugs that made the original results unreproducible.",
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
          Measuring how wrong a backtest can be
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          Two ordinary data-handling mistakes inflate a stock-picking study&apos;s measured skill by
          59% and turn four meaningless signals into statistically significant ones. I built the
          infrastructure to measure that precisely, and found the two mistakes leave different,
          identifiable marks — so the pattern of which results are wrong is evidence about which
          mistake produced them.
        </p>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">What the project is</h2>
        <div className="prose mt-5">
          <p>
            Almost every published trading result is impossible to check. You can read the numbers
            but not the code that produced them. This project builds a system where the code
            <em> is</em> the variable: the same 22 signals, the same companies, the same prices, run
            once correctly and once with a specific mistake introduced. The difference between the
            two runs is what that mistake is worth.
          </p>
          <p>
            The vehicle is a model that ranks about 500 large US companies each month, buys the ones
            it expects to do well and bets against the rest. It began as an inherited version
            reporting 35% a year. Reproducing it turned up six bugs, and rebuilding it correctly
            produced both an honest number and, more usefully, an instrument for measuring what the
            bugs had been worth.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The errors, and why they are hard to catch</h2>
        <div className="prose mt-5">
          <p>
            Six separate problems, none of which raised an error or produced an implausible number.
            That is what makes them worth studying: every one produced output a reviewer would
            accept. Two need no finance background at all.
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div className="rounded-xl bg-paper-2 p-6">
            <h3 className="text-[18px]">A third of the calendar was missing</h3>
            <p className="mt-2.5 text-[16.5px] leading-[1.7] text-ink-2">
              The code traded on the last day of each month. When the 31st fell on a Saturday it
              found no trading data, skipped that month — and skipped the month&apos;s profit and
              loss with it.{" "}
              <strong className="text-ink">578 of 1,971 days simply weren&apos;t there.</strong> The
              results were an average over whichever days happened to survive.
            </p>
          </div>

          <div className="rounded-xl bg-paper-2 p-6">
            <h3 className="text-[18px]">It only knew about companies that survived</h3>
            <p className="mt-2.5 text-[16.5px] leading-[1.7] text-ink-2">
              The test used today&apos;s list of large companies and applied it to the past decade.
              Every company that went bankrupt or was taken over was invisible — like judging a
              doctor&apos;s record after removing the patients who died.
            </p>
          </div>
        </div>

        <Details summary="The other four bugs, in detail">
          <ol className="space-y-5">
            {q.bugs.slice(2).map((b) => (
              <li key={b.n}>
                <div className="text-[16.5px] font-medium">{b.title}</div>
                <p className="mt-1.5 text-[16px] leading-[1.7] text-ink-2">{b.detail}</p>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-3">{b.evidence}</p>
              </li>
            ))}
          </ol>
        </Details>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What I rebuilt</h2>
        <div className="prose mt-5">
          <p>
            I threw out the data and started again. The new version knows which companies were in the
            index on any given past date — including ones that no longer exist — and pulls each
            company&apos;s financial statements from government filings,{" "}
            <strong>dated to the day they were actually published</strong> rather than the day the
            quarter ended.
          </p>
          <p>
            That detail matters more than it sounds. A company&apos;s Q1 results aren&apos;t public
            until May; using them in April is the most common way to accidentally cheat.
          </p>
        </div>

        <BeforeAfter />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Performance</h2>
        <GrowthChart />
        <div className="prose">
          <p>
            The five bad years aren&apos;t a mistake. The model buys cheap, unglamorous companies,
            and 2014 to 2018 was the worst stretch for that approach in modern history. A reasonable
            strategy living through an unreasonable decade.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Skill versus market exposure</h2>
        <div className="prose mt-5">
          <p>
            Most reported strategy returns are partly just exposure to a rising market, which any
            index fund gives you for free. Separating the two is rarely done and easy to measure
            once the infrastructure is correct.
          </p>
        </div>
        <BetaSplit />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">How stable the result is</h2>
        <div className="prose mt-5">
          <p>
            Machine-learning models contain randomness. I ran the identical model six times, changing
            only that internal randomness, to see how much the headline score moved.
          </p>
        </div>
        <SeedLottery />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Why the honest number is the useful one</h2>
        <div className="prose mt-5">
          <p>
            1.9% is not the finding. It is the control condition — the number you get when nothing
            is wrong, which is what makes it possible to price each mistake against it. Without a
            trustworthy baseline there is nothing to measure the errors <em>with</em>.
          </p>
          <p>
            Telling a real edge from a measurement error{" "}
            <strong>is the job</strong>, and it is not a matter of judgement or care. It is a
            measurement, and this project shows how to take it.
          </p>
        </div>

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

      <section className="rule py-12">
        <div className="label">Paper</div>
        <h2 className="mt-3 text-[25px]">Two Bugs, Two Fingerprints</h2>
        <div className="prose mt-5">
          <p>
            Finding the six bugs raised a second question: if a wrong number looks completely
            reasonable, what does it look like <em>specifically</em>? I measured what two of the
            most common mistakes do to the same study, changing one thing at a time and leaving
            everything else identical.
          </p>
          <p>
            Using a company&apos;s quarterly figures on the day the quarter ended, rather than the
            day they were actually published, inflates the measured signal by 59% and turns four
            insignificant factors into significant ones. Building the universe from today&apos;s
            index members rather than the historical ones does something different: it doesn&apos;t
            uniformly inflate, it <em>relocates</em>. Illiquidity flips from negative to significantly
            positive, and the low-volatility effect inverts.
          </p>
          <p>
            The two mistakes leave different marks. They&apos;re nearly uncorrelated across the 22
            factors, and they push value factors in opposite directions. One leaves the
            price-and-volume factors untouched to machine precision, because those factors never
            read a published figure at all. That means the pattern of which results are wrong is
            evidence about which mistake produced them, which is useful when you can read
            someone&apos;s results but not their code.
          </p>
          <p>
            The paper measures both effects and sets out the four things that would need to be true
            before that inference could be trusted. Those aren&apos;t tested yet, and the paper says
            so.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="/Two-Bugs-Two-Fingerprints.pdf" className="link">Read the paper (PDF)</a>
        </div>
      </section>
    </Shell>
  );
}
