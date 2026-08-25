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
          I found out my own model was wrong, and said so
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          A stock-picking model that claimed to return 35% a year. I rebuilt it from scratch, found
          six bugs that had manufactured that number, and published the real one instead: 1.9%.
        </p>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">What the project is</h2>
        <div className="prose mt-5">
          <p>
            A model that ranks about 500 large US companies each month, buys the ones it expects to
            do well, and bets against the ones it expects to do badly. The aim is to make money
            whether the market goes up or down.
          </p>
          <p>
            I inherited a version that reported very strong results. They looked too strong, so
            before adding anything I tried to reproduce them.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What was wrong</h2>
        <div className="prose mt-5">
          <p>
            Six separate problems, each producing output that looked completely reasonable. Two of
            them need no finance background at all:
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
        <h2 className="text-[25px]">What it actually earns</h2>
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
        <h2 className="text-[25px]">Most of the &ldquo;skill&rdquo; wasn&apos;t skill</h2>
        <div className="prose mt-5">
          <p>
            This is the finding I care most about. I separated how much of the return came from
            genuinely picking better companies, versus simply being exposed to a rising market. The
            answer was uncomfortable.
          </p>
        </div>
        <BetaSplit />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">And the score is partly luck</h2>
        <div className="prose mt-5">
          <p>
            Machine-learning models contain randomness. I ran the identical model six times, changing
            only that internal randomness, to see how much the headline score moved.
          </p>
        </div>
        <SeedLottery />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Why this is the interesting outcome</h2>
        <div className="prose mt-5">
          <p>
            The easy version of this project reports 35% and moves on. The useful version finds out
            the number was an artifact, rebuilds the foundation, and publishes a smaller honest
            figure with the evidence for why it&apos;s smaller.
          </p>
          <p>
            Telling the difference between a real edge and a measurement error{" "}
            <strong>is the job</strong>. A firm trading on these signals loses money when someone
            can&apos;t.
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
    </Shell>
  );
}
