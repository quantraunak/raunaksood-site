import type { Metadata } from "next";
import q from "@/public/data/quant.json";
import { Shell, Section, CaseHeader, Callout, StatRow, Table, Column } from "@/components/ui";
import { Stat } from "@/components/charts";
import { EquityBrush, RegimePanel, SeedPanel, FactorPanel, DecompositionPanel, SmoothingPanel } from "@/components/quant-panels";

export const metadata: Metadata = {
  title: "Point-in-time equity research",
  description:
    "A market-neutral US equity signal on reconstructed point-in-time index membership and SEC XBRL fundamentals. Out-of-sample IC 0.0165 (t=2.00) — and a decomposition showing 59% of the apparent edge is market beta.",
};

const pct = (x: number, d = 2) => `${(x * 100).toFixed(d)}%`;
const p = q.performance;
const s = q.signal;
const dec = q.decomposition;

export default function QuantPage() {
  return (
    <Shell>
      <CaseHeader
        kind="Quantitative research"
        title="What a market-neutral signal is actually worth"
        lede={
          <p>
            A cross-sectional US equity model built on point-in-time index membership and SEC
            filings, evaluated before any portfolio is constructed. The signal is real. The
            strategy is not — and the interesting part is the arithmetic that separates the two.
          </p>
        }
        meta={[
          { label: "Out-of-sample", value: `${p.start} → ${p.end}` },
          { label: "Universe", value: "727 names, point-in-time" },
          { label: "Rebalance", value: "Monthly" },
          { label: "Stack", value: "Python · LightGBM · CVXPY" },
        ]}
        links={[
          { href: "https://github.com/quantraunak/ls-multifactor-research", label: "Source" },
          { href: "https://quantraunak.github.io/ls-multifactor-research/", label: "Live results" },
        ]}
      />

      <Section eyebrow="The result">
        <Callout tone="warn" title="Read this before the numbers">
          <p>
            The model has a genuine cross-sectional information coefficient of{" "}
            <strong>{s.mean_ic.toFixed(4)}</strong> (t = {s.t_stat.toFixed(2)}) and a decile spread
            of <strong>{s.decile_spread_bps.toFixed(0)}bp a month</strong> (t ={" "}
            {s.decile_spread_t.toFixed(2)}). But <strong>{pct(dec.beta_share, 0)} of that spread is
            a market beta tilt</strong>. Beta-adjusted alpha is {pct(dec.alpha_annual)} a year at a
            t-statistic of <strong>{dec.alpha_t.toFixed(2)}</strong> — indistinguishable from zero.
            And across six model seeds with identical economics, the Sharpe below ranges from 0.09
            to 0.49.
          </p>
        </Callout>

        <div className="mt-10">
          <StatRow>
            <Stat value={p.sharpe.toFixed(2)} label="Sharpe" note="0.09–0.49 across seeds" tone="warn" />
            <Stat value={pct(p.cagr)} label="CAGR" />
            <Stat value={pct(p.max_drawdown, 1)} label="Max drawdown" />
            <Stat value={pct(p.annual_vol, 1)} label="Annualised vol" />
            <Stat value={p.beta_vs_market.toFixed(3)} label="Beta vs SPY" tone="good" />
            <Stat value={pct(p.coverage, 1)} label="Day coverage" note="0 rebalances skipped" tone="good" />
          </StatRow>
        </div>
      </Section>

      <Section eyebrow="Out-of-sample" title="Equity curve, net of costs">
        <EquityBrush />
        <Column className="prose mt-8 text-[15px]">
          <p>
            Drag across the chart to select any window and the statistics recompute from the daily
            series. It is worth doing: the headline 0.29 is an average over two regimes that have
            almost nothing to do with each other.
          </p>
          <p>
            Every trading day carries a return. That sounds like a low bar; the previous version of
            this engine failed it, and the failure is the first thing the rewrite had to fix.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Why 0.29" title="Two regimes, not one strategy">
        <Column className="prose">
          <p>
            The single most useful thing to know about this backtest is that the Sharpe is not
            uniformly poor. It is one long wound followed by a decent run.
          </p>
        </Column>
        <div className="mt-9">
          <RegimePanel />
        </div>
      </Section>

      <Section eyebrow="Post-mortem" title="Six defects that manufactured an edge">
        <Column className="prose">
          <p>
            The earlier pipeline reported a Sharpe of 0.53, and before that 1.46. Both were
            artefacts. Each defect below produced output that looked entirely reasonable, which is
            the dangerous kind.
          </p>
        </Column>
        <ol className="mt-9 space-y-px">
          {q.bugs.map((b) => (
            <li key={b.n} className="rule-soft grid gap-x-6 gap-y-2 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[34px_1fr]">
              <div className="mono text-[13px] text-ink-3 tnum sm:pt-1">{String(b.n).padStart(2, "0")}</div>
              <div>
                <h3 className="text-[16.5px] font-medium">{b.title}</h3>
                <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-ink-2">{b.detail}</p>
                <p className="mt-2.5 max-w-[640px] border-l border-rule pl-4 mono text-[12.5px] leading-relaxed text-ink-3">
                  {b.evidence}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Column className="prose mt-9 text-[15px]">
          <p>
            All six are now pinned by tests. The rebalance-date test builds a calendar containing
            month-ends that are not trading days and asserts every rebalance date exists in the
            price index; the annualisation test feeds the same span with a third of its days removed
            and asserts the growth rate does not rise.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Data" title="The part that set the ceiling">
        <Column className="prose">
          <p>
            The old universe was <strong>current</strong> S&amp;P 500 membership applied to the
            whole history, so every company that was ever deleted — acquired, bankrupted, demoted —
            was invisible. Membership is now a set of spells, so a name enters the cross-section the
            day it joined and leaves the day it left.
          </p>
        </Column>

        <div className="mt-9">
          <Table
            columns={["", "before", "now"]}
            rows={[
              ["Universe", "429 current members", "727 names, point-in-time"],
              ["Survivorship", "delisted names invisible", "real entry and exit dates"],
              ["Fundamentals", "none", "SEC XBRL, 648 issuers"],
              ["Keyed on", "—", "filing date, 34-day median lag"],
              ["Industry", "yfinance GICS, survivors", "SEC SIC → Fama-French 12"],
              ["Span", "2010–2024", "2004–2026"],
            ]}
          />
        </div>

        <Column className="prose mt-10 text-[15px]">
          <p>
            <strong>Fundamentals that respect the filing date.</strong> A quarter ending 31 March is
            only visible once the 10-Q lands in May. Joining on period end instead is the classic
            look-ahead in fundamental research. Three details cost real coverage:
          </p>
        </Column>
        <ul className="mt-5 max-w-[720px] space-y-4">
          {[
            [
              "Restatements",
              "A period is reported repeatedly as it is revised. The earliest filing is kept, because that is the number the market saw.",
            ],
            [
              "Year-to-date reporting",
              "Cash-flow statements are filed cumulatively and the 10-K reports the year rather than Q4. Taking “quarterly” facts at face value dropped 56 of 72 quarters of operating cash flow for Apple. Both cases are one problem — a long period sharing its start with a shorter one — solved by differencing to a fixed point.",
            ],
            [
              "Tag migration",
              "SalesRevenueNet gave way to RevenueFromContractWithCustomerExcludingAssessedTax under ASC 606 in 2018. Selecting a single tag truncates history at the switch, so candidate tags are merged rather than chosen.",
            ],
          ].map(([t, d]) => (
            <li key={t} className="rule-soft pt-4 first:border-t-0 first:pt-0">
              <div className="mono text-[12.5px] text-[var(--color-sea)]">{t}</div>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{d}</p>
            </li>
          ))}
        </ul>

        <Callout tone="note" title="Residual limitation">
          <p>
            278 of 990 historical members could not be priced — the data source drops delisted
            tickers, and those are exactly the survivorship-relevant names. Survivorship bias is{" "}
            <strong>reduced, not eliminated</strong>, and the remaining bias flatters these results.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Signal" title="Which factors carry information">
        <Column className="prose">
          <p>
            Each factor is signed so that higher means predicted-higher return, in the direction the
            published anomaly runs. A negative bar therefore means the anomaly failed over this
            sample, not that a sign was flipped somewhere.
          </p>
        </Column>
        <div className="mt-9">
          <FactorPanel />
        </div>
      </Section>

      <Section eyebrow="Model selection" title="Chosen by measurement, not preference">
        <div className="scroll-x">
          <Table
            columns={["model", "mean IC", "ICIR", "t", "decile spread", "spread t"]}
            highlight={0}
            rows={q.models.map((m) => [
              m.chosen ? `${m.name}  ←` : m.name,
              m.ic.toFixed(4),
              m.icir.toFixed(3),
              m.t.toFixed(2),
              `${m.spread.toFixed(1)}bp`,
              m.spread_t.toFixed(2),
            ])}
          />
        </div>
        <Column className="prose mt-8 text-[15px]">
          <p>
            The learning-to-rank variant is the instructive failure. It produces a competitive
            decile spread and almost <strong>no rank correlation at all</strong>, because NDCG is
            deliberately top-heavy — it rewards getting the best items right and discounts
            everything below. That is the correct loss for search results and the wrong one for a
            book that earns as much from its short tail as its long.
          </p>
          <p>
            Ridge fails differently: with missing fundamentals filled at zero and heavy shrinkage, a
            linear model cannot express the interactions the trees find.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Turnover" title="Smoothing buys signal and sells churn">
        <Column className="prose">
          <p>
            The information sits mostly in fundamentals that only move when a filing lands, yet the
            fitted score churned{" "}
            <strong>{pct(q.smoothing[0].turnover, 0)} of the selected book every month</strong>.
            Averaging the score over a trailing window sheds model noise rather than signal — it
            improves IC <em>and</em> halves turnover, which is rare enough to be worth showing.
          </p>
        </Column>
        <div className="mt-9">
          <SmoothingPanel />
        </div>
      </Section>

      <Section eyebrow="Decomposition" title="Where the edge actually goes">
        <Column className="prose">
          <p>
            This is the part worth reading. A decile spread with a t-statistic above 2 looks like a
            strategy. Regressing that spread on the market says otherwise.
          </p>
        </Column>
        <div className="mt-9">
          <DecompositionPanel />
        </div>
        <Column className="prose mt-9 text-[15px]">
          <p>
            The long decile runs a beta of <strong>{dec.beta_long.toFixed(2)}</strong> against the
            short decile&apos;s <strong>{dec.beta_short.toFixed(2)}</strong> — a tilt that is
            positive in 73% of months, over a window in which the market compounded at{" "}
            {pct(dec.market_cagr, 1)}. The factors doing the work are value and quality, and value
            is cyclical; the book was being paid for market exposure it did not intend to take.
          </p>
          <p>
            Residualising every factor against beta and size was tried, and made things worse: IC
            falls from {s.mean_ic.toFixed(4)} to 0.0062, because at this horizon the value edge
            substantially <em>is</em> a size effect. Orthogonalising the exposure away removes the
            alpha with it. The code is kept behind a flag, off by default, with the measurement
            recorded.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Robustness" title="The sharpest result in the project">
        <Column className="prose">
          <p>
            Re-ordering the factor list — no economic change, only the column sampling and
            tie-breaking inside the booster — moved the backtest Sharpe from 0.07 to 0.29. That is a
            warning, not a result, so the whole walk-forward was re-fitted under six seeds.
          </p>
        </Column>
        <div className="mt-9">
          <SeedPanel />
        </div>
        <Callout tone="warn" title="What this means">
          <p>
            <strong>The signal is stable and the Sharpe is not.</strong> IC varies by ±5% across
            seeds; Sharpe varies by a factor of five. Quoting any single one of those as{" "}
            <em>the</em> Sharpe would be choosing a draw from a distribution and calling it a
            measurement — which is, in substance, exactly what the 1.46 in the first version of this
            project was.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Costs" title="What friction does to it">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <StatRow>
              <Stat value={p.sharpe_at_5bps.toFixed(2)} label="Sharpe @ 5bp" />
              <Stat value={p.sharpe_at_10bps.toFixed(2)} label="Sharpe @ 10bp" />
              <Stat value={p.sharpe_at_20bps.toFixed(2)} label="Sharpe @ 20bp" tone="warn" />
              <Stat value={q.rebalances.turnover.toFixed(2)} label="Turnover / rebal" />
              <Stat value={`${q.rebalances.gross.toFixed(2)}×`} label="Gross leverage" />
              <Stat value={q.rebalances.n_names.toFixed(0)} label="Avg names" />
            </StatRow>
          </div>
          <Column className="prose text-[15px]">
            <p>
              At 20bp of slippage the strategy is roughly flat. For a book whose gross edge is of
              the same order as its trading costs, that is the expected answer rather than a
              surprising one.
            </p>
          </Column>
        </div>
      </Section>

      <Section eyebrow="Conclusion" title="An honest summary">
        <Column className="prose text-[16px]">
          <p>
            There is a defensible signal underneath this: value and quality factors, correctly
            constructed on point-in-time data, with IC t-statistics near 2. What is not defensible
            is calling it a strategy. In large-cap US equities over {p.years} years, after beta
            neutralisation and realistic costs, this edge does not clear the bar — and the sample
            still carries residual survivorship bias that flatters it.
          </p>
          <p>
            Publishing that, rather than the seed that happened to print 0.49, is the whole point of
            the rewrite.
          </p>
        </Column>
        <div className="mt-8 mono text-[11.5px] text-ink-3">
          Generated from run {q.run} · {q.equity.length} plotted points · {q.factors.length} factors
        </div>
      </Section>
    </Shell>
  );
}
