import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Testing for leakage without knowing the right answer",
  description:
    "A factor that looked price-only divided by shares outstanding, and inflated mean IC by 59%. You cannot unit-test that, because the correct value is the thing in dispute. What you can test is what the answer must be invariant to.",
};

export default function LeakagePage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Writing · September 2026</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          Testing for leakage without knowing the right answer
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          A factor called <span className="mono">turnover_1m</span> broke a backtest of mine,
          and it took months to notice because nothing about it looked wrong.
        </p>
      </header>

      <Section>
        <div className="prose">
          <p>
            Turnover is a price-and-volume factor. Monthly volume over shares outstanding.
            Everyone treats it as price-only, since volume comes off the tape and the tape is
            available the instant it prints, so there is nothing to date carefully. I had
            twenty-two factors split into two blocks, eleven that read a filed figure and
            eleven that did not, and the split was load-bearing. The whole design depended on
            the second block being unable to respond to the filing calendar.
          </p>
          <p>
            <strong>Shares outstanding comes from a 10-Q.</strong>
          </p>
          <p>
            So <span className="mono">turnover_1m</span> sat in the price-only block,
            inheriting the filing calendar through its denominator. Nothing raised. No number
            looked implausible. The factor behaved, the backtest behaved, and the only symptom
            was that results came out slightly better than they should have, which is not a
            symptom anyone investigates.
          </p>
          <p>
            That is the whole problem with temporal leakage. It has no failure mode. A feature
            reads something that was not knowable yet, your metrics improve, and you find out
            in production or you find out when someone asks a question you cannot answer. Or
            you never find out.
          </p>
        </div>
      </Section>

      <Section title="You cannot test it the normal way">
        <div className="prose">
          <p>
            The normal way to test a computation is to know what it should produce, write the
            expected output, and compare. That does not work here. If you knew what{" "}
            <span className="mono">turnover_1m</span> should have been you would not have had
            the bug, because the correct value is the thing in dispute.
          </p>
          <p>
            There is something you do know without the answer.{" "}
            <strong>
              Changing when a data source became available must change the features that read
              it, and must leave the features that do not read it alone.
            </strong>
          </p>
          <p>
            That is a metamorphic relation, a property linking two runs of the same program
            rather than a program&apos;s output to a known value. The technique is
            Chen&apos;s, from 1998, and it exists precisely for programs where you cannot
            write down the expected answer, which the testing literature calls{" "}
            <a href="https://dl.acm.org/doi/10.1145/3143561" className="link">
              the oracle problem
            </a>
            . Machine learning pipelines are the textbook case, and leakage is a good fit,
            because the property is crisp.
          </p>
          <p>
            Delay your filings by three weeks and recompute. Every factor that reads a filing
            should move. Every factor that does not should come back bit-identical, with a
            difference of exactly zero rather than an acceptably small one. That sharpness is
            what makes it usable. There is no threshold to tune and no judgment call about
            whether a small difference matters.
          </p>
          <p>
            Run it on my twenty-two factors and eleven move, eleven do not, and one of the
            eleven that moves is <span className="mono">turnover_1m</span>, which had declared
            itself price-only. That bug was worth having. Joining fundamentals on period-end
            rather than filing date inflated mean IC by <strong>59%</strong>, and pushed{" "}
            <strong>4 of 11</strong> factors across t = 2 that did not belong there.
          </p>
          <p>
            I packaged the check as{" "}
            <a href="https://pypi.org/project/leakprobe/" className="link">
              leakprobe
            </a>
            . You describe what each feature is supposed to read, it perturbs each source in
            turn, and it reports anything that moved when it should not have or held still
            when it should have moved.
          </p>
        </div>
      </Section>

      <Section title="Then I tried to break it">
        <div className="prose">
          <p>
            A tool that finds the one bug it was built for is not evidence of anything. So I
            built a zoo: five public datasets, five shapes of leakage, and a correct pipeline
            for each dataset.
          </p>
          <p>
            The datasets are UCI Online Retail (406,829 transactions with a customer
            attached), NYC yellow taxi (2.9 million January 2024 trips), Chicago crime reports
            (263,837 from 2023), NYC 311 (200,000 service requests), and UCI bike sharing.
            Real data, ordinary features: per-customer spend, per-zone fare averages,
            per-district report counts.
          </p>
        </div>

        <div className="code mt-7" role="img" aria-label="the five shapes of leakage tested">
{`S1   a cutoff filter is missing, so an aggregate runs over every row
S2   a feature reads a second table it never declared
S3   outcome leakage, the outcome in a table with its own later clock
S4   the same, but read under the event's own timestamp
S5   a z-score whose mean and deviation come from all of time`}
        </div>

        <div className="prose mt-7">
          <p>
            The correct pipelines mattered more to me than the bugged ones. A detector that
            flags clean code is worse than no detector, because it teaches you to ignore it.
          </p>
          <p>
            The shipped version got <strong>zero false positives</strong> on the 5 correct
            pipelines, and caught <strong>6 of 9</strong> planted leaks.
          </p>
          <p>
            Six of nine is not a good number for a tool whose pitch is finding what you cannot
            see.
          </p>
        </div>
      </Section>

      <Section title="The misses had one cause">
        <div className="prose">
          <p>
            Chicago was the clearest. I had split the crime data into reports, carrying an
            incident date, and dispositions, carrying an{" "}
            <span className="mono">updated_on</span> stamp, because whether an arrest happened
            is knowable only later. Then I wrote the classic bug: join the disposition table,
            take the arrest flag, compute an arrest rate per district, and declare the feature
            as reading reports only.
          </p>
          <p>
            <strong>leakprobe saw nothing.</strong>
          </p>
          <p>
            The reason is almost obvious once you say it out loud. The perturbation moves
            timestamps, and moving a timestamp only removes rows from code that filters on
            that timestamp. My buggy code never looked at{" "}
            <span className="mono">updated_on</span> at all. It joined on an ID and took a
            boolean. Shift the disposition clock by three weeks and the arrest flag on every
            row is the same flag it always was, so nothing moves and nothing is reported.
          </p>
          <p>
            The same explanation covers S5. A z-score denominator computed over all of time
            responds to a delayed clock the same way a correct one does, because the visible
            slice shifts either way. Both versions move. Movement was the signal, and here it
            carries no information.
          </p>
          <p>
            I then found this limitation already documented in my own test suite, in a test
            asserting it so it &ldquo;cannot quietly stop being true,&rdquo; with a docstring
            calling it &ldquo;the method&apos;s boundary rather than a miss.&rdquo; I had
            written the gap down and then stopped thinking about it, which is a comfortable
            way to stay wrong about something.
          </p>
        </div>
      </Section>

      <Section title="The principle">
        <div className="prose">
          <p>
            <strong>
              A perturbation detects a dependency only if it changes what the feature actually
              reads.
            </strong>
          </p>
          <p>
            Delay changes which rows are visible, which is the right instrument for code that
            consults a clock and the wrong instrument for everything else. So I added two
            more.
          </p>
          <p>
            The first permutes the payload. For a source a feature claims not to read, shuffle
            every column except the timestamp. Row count unchanged, clock unchanged, every
            row-to-row association destroyed. A feature that genuinely does not read that
            table cannot notice, while one that joins it and takes a column off it moves
            immediately. This costs no false positives because it only ever runs on pairs the
            user declared independent, which turns that declaration into something tested
            rather than assumed.
          </p>
          <p>
            The second deletes the future. Given the cutoff your features are built for, drop
            every row after it. A feature built as of a cutoff cannot notice the removal of
            rows it was never allowed to see, so anything that moves was reading them. This is
            the only probe that catches the all-of-time z-score, and it catches it cleanly.
          </p>
          <p>
            Three probes now run, asking different questions. Does this feature filter on this
            clock, does it touch this table&apos;s contents, and does it reach past the
            cutoff.
          </p>
        </div>

        <div className="code mt-7" role="img" aria-label="benchmark results by leakage shape">
{`shape                                          caught
S1  missing cutoff filter                         3/3
S2  undeclared source read                        2/2
S3  outcome leakage, later clock                  2/2
S4  outcome read under the event's clock          1/1
S5  statistic over all of time                    1/1

correct pipelines flagged                         0/5`}
        </div>
      </Section>

      <Section title="What it still cannot see">
        <div className="prose">
          <p>
            Column-wise permutation preserves a column&apos;s marginal distribution. A mean is
            a mean after shuffling, and so is a max or a sum or a quantile. A feature that
            reads only an aggregate of an undeclared table, never joining on a key and never
            consulting a timestamp, survives every probe.
          </p>
          <p>
            In practice this is narrow. Look-ahead is a dependency on timing or on row
            identity, and both are covered now. What remains is a global constant lifted off
            an undeclared table, and it is asserted in the test suite so that it cannot
            quietly stop being true. That phrasing is load-bearing this time.
          </p>
        </div>
      </Section>

      <Section title="What I would take from this">
        <div className="prose">
          <p>
            The useful idea is not the tool. It is that you can test a computation you cannot
            verify, as long as you can name something it must be invariant to. Temporal
            availability is one such thing, and a good one, because leakage is by construction
            a dependency on time. There are others. A feature set should be invariant to row
            order, to a rename of an ID column, to shuffling entities that are supposed to be
            independent.
          </p>
          <p>
            The second idea is less comfortable. I documented this tool&apos;s limitation in a
            test, then treated having documented it as having dealt with it. It took building
            an adversarial benchmark on data I did not choose to turn that note back into a
            problem. Writing down what your method cannot do is where the work starts.
          </p>
        </div>

        <div className="code mt-7">pip install leakprobe</div>

        <div className="prose mt-7">
          <p>
            The zoo is in <span className="mono">benchmarks/leak_zoo.py</span> in{" "}
            <a href="https://github.com/quantraunak/leakprobe" className="link">
              the repository
            </a>{" "}
            if you want to run it against your own pipeline, or add a shape I did not think
            of.
          </p>
        </div>
      </Section>
    </Shell>
  );
}
