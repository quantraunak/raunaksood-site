import type { Metadata } from "next";
import q from "@/public/data/quant.json";
import { Shell, Section, CaseHeader, Callout, StatRow, Table, Column } from "@/components/ui";
import { Stat } from "@/components/charts";
import { EquityBrush, RegimePanel, SeedPanel, FactorPanel, DecompositionPanel, SmoothingPanel } from "@/components/quant-panels";

export const metadata: Metadata = {
  title: "Point-in-time equity factor research",
  description:
    "A cross-sectional US equity signal on reconstructed point-in-time index membership and SEC XBRL fundamentals keyed on filing date. Out-of-sample IC 0.0165 (t=2.00), decile spread 68bp/month (t=3.08), with a beta decomposition of where the edge comes from.",
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
        title="Point-in-time equity factor research"
        lede={
          <p>
            A cross-sectional US equity signal built on reconstructed point-in-time index
            membership and SEC XBRL fundamentals joined on filing date, with a purged
            walk-forward evaluation that runs before any portfolio is constructed — and a
            decomposition of how much of the resulting spread is selection rather than beta.
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

      <Section eyebrow="The signal" title="Measured before any portfolio exists">
        <Column className="prose">
          <p>
            The evaluation gate is cross-sectional rank correlation between the fitted score and
            the 21-day forward return, computed on {s.n_dates} out-of-sample months that no
            training fold was allowed to see. A model that cannot clear this does not get a
            backtest.
          </p>
        </Column>

        <div className="mt-10">
          <StatRow>
            <Stat value={s.mean_ic.toFixed(4)} label="Mean IC" note={`t = ${s.t_stat.toFixed(2)}`} tone="good" />
            <Stat value={`${s.decile_spread_bps.toFixed(0)}bp`} label="Decile spread / mo" note={`t = ${s.decile_spread_t.toFixed(2)}`} tone="good" />
            <Stat value={s.icir.toFixed(3)} label="IC info ratio" note={`${s.icir_annual.toFixed(2)} annualised`} />
            <Stat value={String(s.n_dates)} label="Independent months" />
            <Stat value={pct(s.selection_turnover, 0)} label="Selection turnover" />
            <Stat value="22" label="Factors" note="each signed to its published direction" />
          </StatRow>
        </div>
      </Section>

      <Section eyebrow="Factors" title="Which ones carry information">
        <Column className="prose">
          <p>
            Each factor is signed so that higher means predicted-higher return, in the direction
            the published anomaly runs. A negative bar therefore means the anomaly failed over
            this sample, not that a sign was flipped somewhere.
          </p>
        </Column>
        <div className="mt-9">
          <FactorPanel />
        </div>
      </Section>

      <Section eyebrow="Data" title="The part that sets the ceiling">
        <Column className="prose">
          <p>
            Universe construction is where the ceiling on a study like this is usually set, so it
            is where most of the work went. Membership is stored as spells of{" "}
            <span className="mono text-[13.5px]">(ticker, start, end)</span> reconstructed from the
            revision history of the index constituents page, so a name enters the cross-section
            the day it joined and leaves the day it left.
          </p>
          <p>
            Applying <strong>current</strong> membership to a historical panel is the standard
            survivorship trap: every company that was ever deleted — acquired, bankrupted,
            demoted — becomes invisible, and the surviving sample is selected on exactly the
            outcome being predicted.
          </p>
        </Column>

        <div className="mt-9">
          <Table
            columns={["", "specification"]}
            rows={[
              ["Universe", "727 names, point-in-time membership spells"],
              ["Span", "2004–2026"],
              ["Fundamentals", "SEC EDGAR XBRL, 648 issuers"],
              ["Keyed on", "filing date, 34-day median lag"],
              ["Industry", "SEC SIC → Fama-French 12, full panel"],
              ["Validation", "membership diffed against the live table on every build"],
            ]}
          />
        </div>

        <Column className="prose mt-10 text-[15px]">
          <p>
            <strong>Fundamentals that respect the filing date.</strong> A quarter ending 31 March
            is only visible once the 10-Q lands in May. Joining on period end instead is the
            classic look-ahead in fundamental research. Three details each cost real coverage if
            handled naively:
          </p>
        </Column>
        <ul className="mt-6 max-w-[720px] space-y-5">
          {[
            [
              "Restatements",
              "A period is reported many times as it is revised. The earliest filing is kept — that is the number the market saw.",
            ],
            [
              "Year-to-date reporting",
              "Cash flow is filed cumulatively, and the 10-K reports the year rather than Q4. Taking “quarterly” facts at face value dropped 56 of 72 quarters of Apple’s operating cash flow.",
            ],
            [
              "Tag migration",
              "Revenue changed XBRL tags under ASC 606 in 2018. Picking one tag truncates history at the switch, so candidates are merged.",
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

      <Section eyebrow="Validation" title="Purged, embargoed, and weighted by uniqueness">
        <Column className="prose">
          <p>
            Expanding walk-forward. Training stops{" "}
            <span className="mono text-[13.5px]">horizon + embargo</span> trading days before each
            prediction date — a purge for the 21-day label span plus a 21-day embargo. Overlapping
            labels are thinned to every fifth day and weighted by average uniqueness, because 300k
            nominal rows are worth roughly 15k independent ones and unweighted fitting overstates
            the effective sample by an order of magnitude.
          </p>
          <p>
            The target is the cross-sectional <em>rank</em> of the forward return rather than the
            return itself. Ranking removes the common date move by construction, weights every
            date equally regardless of market volatility, and bounds outliers. Regressing raw
            returns instead spends a measured 28% of the loss budget on the market component,
            which is identical for every name on a date and so cannot affect the ordering the
            strategy actually trades.
          </p>
          <p>
            Factor lookbacks resolve to trading-day offsets taken from the price index.
            Subtracting calendar days and calling them trading days compresses every horizon by
            roughly 1.45×, quietly turning a 252-day momentum window into 173 trading days.
          </p>
        </Column>
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
            The learning-to-rank variant is the instructive one. It produces a competitive decile
            spread and almost <strong>no rank correlation at all</strong>, because NDCG is
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
            The information sits in fundamentals that only move when a filing lands, yet the score
            churned <strong>{pct(q.smoothing[0].turnover, 0)} of the book every month</strong>.
            Averaging it sheds noise rather than signal: IC improves <em>and</em> turnover halves.
          </p>
        </Column>
        <div className="mt-9">
          <SmoothingPanel />
        </div>
      </Section>

      <Section eyebrow="Portfolio" title="From score to book">
        <Column className="prose">
          <p>
            Alpha is converted to return units by Grinold&apos;s rule,{" "}
            <span className="mono text-[13.5px]">alpha = IC × volatility × score</span>, then
            maximised subject to dollar neutrality, a gross cap, a per-name box, |beta| ≤ 0.03,
            and an explicit annualised volatility budget. Trading costs enter the objective at
            cost, so the optimiser makes the real trade-off between expected alpha and the friction
            of reaching it rather than an invented one.
          </p>
        </Column>

        <div className="mt-10">
          <StatRow>
            <Stat value={pct(p.cagr)} label="CAGR" />
            <Stat value={p.sharpe.toFixed(2)} label="Sharpe" note="0.09–0.49 across seeds" />
            <Stat value={pct(p.annual_vol, 1)} label="Annualised vol" />
            <Stat value={pct(p.max_drawdown, 1)} label="Max drawdown" />
            <Stat value={p.beta_vs_market.toFixed(3)} label="Beta vs SPY" tone="good" />
            <Stat value={pct(p.coverage, 1)} label="Day coverage" note="0 rebalances skipped" tone="good" />
          </StatRow>
        </div>

        <div className="mt-12">
          <EquityBrush />
        </div>
        <Column className="prose mt-8 text-[15px]">
          <p>
            Drag across the chart to select any window and the statistics recompute from the daily
            series. It is worth doing — the headline number is an average over two regimes that
            have very little to do with each other.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Regimes" title="One average over two different periods">
        <Column className="prose">
          <p>
            Aggregate performance figures hide this almost completely, which is a good argument for
            reading the series rather than the summary.
          </p>
        </Column>
        <div className="mt-9">
          <RegimePanel />
        </div>
      </Section>

      <Section eyebrow="Decomposition" title="Where the edge actually comes from">
        <Column className="prose">
          <p>
            This is the part worth reading. A decile spread with a t-statistic above 2 looks like a
            strategy. Regressing that spread on the market is what decides whether it is one.
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
            is cyclical; the book was being paid for market exposure it did not intend to take.{" "}
            <strong>{pct(dec.beta_share, 0)} of the apparent edge is exposure rather than
            selection</strong>, and what remains after removing it is not statistically separable
            from zero.
          </p>
          <p>
            Residualising every factor against beta and size was tried, and made things worse: IC
            falls from {s.mean_ic.toFixed(4)} to 0.0062, because at this horizon the value edge
            substantially <em>is</em> a size effect. Orthogonalising the exposure away removes the
            alpha with it. The code is kept behind a flag, off by default, with the measurement
            recorded rather than the attempt deleted.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Robustness" title="The sharpest result in the project">
        <Column className="prose">
          <p>
            Re-ordering the factor list — no economic change, only the column sampling and
            tie-breaking inside the booster — moved the backtest Sharpe from 0.07 to 0.29. Rather
            than pick one, the whole walk-forward was re-fitted under six seeds with identical
            economics.
          </p>
        </Column>
        <div className="mt-9">
          <SeedPanel />
        </div>
        <Callout tone="note" title="What this means">
          <p>
            <strong>The signal is stable; the Sharpe is not.</strong> IC holds at 0.0164 ± 0.0008
            while Sharpe ranges from 0.09 to 0.49. A single backtest Sharpe from a model with
            stochastic fitting is a draw from that distribution, and quoting one without the spread
            around it reports the draw as though it were the measurement. Every performance figure
            on this page should be read against this table.
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
              At 20bp of slippage the book is roughly flat. For a strategy whose gross edge is of
              the same order as its trading costs, that gradient is the expected shape rather than
              a surprising one.
            </p>
          </Column>
        </div>
      </Section>

      <Section eyebrow="Conclusion" title="What this establishes">
        <Column className="prose text-[16px]">
          <p>
            A defensible cross-sectional signal sits underneath this: value and quality factors,
            constructed on point-in-time data with filing-date-aware fundamentals, reaching IC
            t-statistics near 2 and a decile spread at t = {s.decile_spread_t.toFixed(2)} across{" "}
            {s.n_dates} independent months.
          </p>
          <p>
            At this horizon and in this universe, the portfolio built on it does not clear a
            tradability bar. Large-cap US equity is the most heavily arbitraged cross-section
            available, and 22 public factors on free data is not where an edge in it is likely to
            be found — a study of this design is better read as a measurement of how much of a
            published anomaly stack survives correct construction. The infrastructure is the
            transferable part: the same pipeline runs against a different universe, a different
            horizon, or a licensed data source without changing the evaluation.
          </p>
        </Column>
        <div className="mt-8 mono text-[11.5px] text-ink-3">
          Generated from run {q.run} · {q.equity.length} plotted points · {q.factors.length} factors
        </div>
      </Section>
    </Shell>
  );
}
