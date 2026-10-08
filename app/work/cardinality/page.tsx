import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { CardinalityDemo } from "@/components/cardinality-demo";
import { CrossoverFigure, DilutionFigure } from "@/components/cardinality-figures";
import { Contribution } from "@/components/contribution";

export const metadata: Metadata = {
  title: "cardinality-eval",
  description:
    "Does an extractor get worse as the number of things to find grows? In a one-model pilot, neither free generation nor a JSON schema meets the pre-registered test. What the schema buys is valid output: free-form responses increasingly break JSON by quoting the source.",
};

export default function CardinalityPage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">LLM evaluation · Python</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          The schema is not the cost
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          Ask a model to pull sixteen things out of a document instead of one, and it finds a
          somewhat smaller share of them, with or without a form. What the form changes, on
          this model, is whether the answer is valid at all: one free-form answer in five at
          sixteen items is not valid JSON as written.
        </p>
        <Contribution
          proposed="A way to measure how extraction recall changes with the number of items, with no annotators: build the documents yourself from verbatim filing sentences, so the number of items is exact and the answer key is free. And a constraint every such study inherits: item count, item density and document length cannot all be held fixed, so each design picks two and should say which."
          result="A pilot on one model, 25 documents per level. Neither arm meets the test I fixed in advance: free-form recall falls 0.131 from 1 to 16 items (the rule needs 0.15) and schema-constrained recall does not fall. The gap between arms is carried by the one-item documents and vanishes without them. What the schema buys, with an artifact, is validity: 25 of 25, 23 of 25, 21 of 25 free-form answers are valid JSON as the list grows; 75 of 75 under the schema. An earlier version of this page reported a rejection; that was a scorer bug, fixed and disclosed."
        />
        <div className="mt-7 flex flex-wrap gap-6 text-[16px]">
          <a href="https://github.com/quantraunak/cardinality-eval" className="link">
            cardinality-eval on GitHub
          </a>
          <Link href="/writing/the-schema-is-not-the-cost" className="link">
            Full write-up
          </Link>
          <a href="/papers/cardinality.pdf" className="link">
            Paper (PDF)
          </a>
        </div>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">The problem</h2>
        <div className="prose mt-5">
          <p>
            When you ask a language model for structured output — a list of records, not a
            paragraph — you usually hand it a schema and force the answer to fit. The schema
            guarantees you get valid JSON back.
          </p>
          <p>
            It also blocks the model from saying what it wanted to say. That has a known
            cost: several percentage points of accuracy across open models, and at least one
            published case where letting the model write freely and parsing afterwards beat
            the schema outright. So the folklore is that grammars make models dumber.
          </p>
          <p>
            I had a specific reason to check. In my extraction work I&apos;d written down
            constrained decoding as the most likely alternative explanation for something I
            was seeing, then never tested it — which is a comfortable way to stay wrong.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What I did</h2>
        <div className="prose mt-5">
          <p>
            The hard part is knowing the right answer. If you take real documents and have
            someone mark up every company mentioned, you get labels that are expensive and
            unreliable — and an annotator&apos;s attention drifts on exactly the long lists
            where the effect should show up.
          </p>
          <p>
            So I built the documents instead. Take sentences from real SEC filings, each one
            naming exactly one company, each verified to appear word-for-word in the source.
            Drop <strong>k</strong> of them at random positions into filler text drawn from
            the same filings with every company name stripped out. Pad everything to the same
            length.
          </p>
          <p>
            Now the right answer is whatever I put in. No annotation, and{" "}
            <strong>k</strong> is exact.
          </p>
        </div>

        <div className="mt-8">
          <CardinalityDemo />
        </div>
        <p className="mt-3 text-[13px] leading-[1.6] text-ink-3">
          Every number is measured. The three stops are the three levels actually run, 25
          documents each and 75 per arm, with nothing interpolated between them.
        </p>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What I found</h2>
        <div className="prose mt-5">
          <p>
            Under the rule I fixed in advance, neither arm clears the bar. Writing freely, recall
            falls 0.131 from one item to sixteen on the same documents, short of the 0.15 the
            rule requires; under a schema it does not fall at all.
          </p>
        </div>

        <CrossoverFigure />

        <div className="prose">
          <p>
            The test was fixed in advance: to count, recall had to drop at least 0.15 from
            the short lists to the long ones, <em>and</em> clear p &lt; 0.05. Free generation
            drops <strong>0.131</strong> at p = 0.027, which clears the second condition and
            not the first. The schema drops <strong>nothing</strong>; recall actually rises,
            p = 0.73. An earlier version of this page said free generation dropped 0.214 and
            rejected the null. Six of its 75 answers had been scored as empty because my
            parser choked on quotation marks the model copied from the filings, such as{" "}
            <span className="mono">Express Scripts, Inc. (&quot;Express Scripts&quot;)</span>.
            Those six answers held 39 items, 38 of them right. The scorer now repairs that,
            and every number here is from the repaired scoring.
          </p>
          <p>
            What the schema does change is whether the answer is valid. Without it, 25 of 25
            answers at one item are valid JSON as written, 23 of 25 at four, 21 of 25 at
            sixteen. Under the schema, 75 of 75. The failures are not the model giving up;
            they are complete answers that break the format by quoting a company&apos;s own
            short name inside a string. That is the one effect of the grammar this study can
            show with an artifact. At sixteen available, the schema emits 9.4 items and free
            generation 8.5, at the same precision, so both stop well short. The schema is a
            plain list with no minimum length, the constrained arm returns nothing at all on 13
            of the 25 one-item documents, and the experiment that would test a grammar-level
            stopping story, a minimum-length rule, has not been run.
          </p>
          <p>
            The test the paper did not run at first is whether the gap between arms grows
            with the list. It does, by 0.061 per doubling (p = 0.020). But drop the one-item
            documents where the schema returned nothing and the slope is gone (p = 0.17).
            Above one item, both arms lose recall at about the same rate. The recall
            difference between arms rests on the shortest lists and is not a finding.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The part that took longest</h2>
        <div className="prose mt-5">
          <p>
            The first pilot came back at <strong>33%</strong>: one item hidden in one
            document, found a third of the time. Only then did I write down the check that
            should have come first, that the extractor must find a single item at least 80%
            of the time before any slope means anything. The pre-registration records the
            gate as added after that failure, not before it. The next two builds came back
            40%, then 40% again after fixing four separate bugs I could see by reading the
            output.
          </p>
          <p>
            Guessing wasn&apos;t working, so I measured instead — same sentence, same single
            item, only the amount of surrounding filler changing.
          </p>
        </div>

        <DilutionFigure />

        <div className="prose">
          <p>
            I had built the filler by picking text <em>for having no company names in it</em>,
            which made it far emptier than any real document. The sanity check was never
            failing because of the bugs I kept fixing. It was failing because I had buried one
            sentence in a haystack nothing like the ones the model actually sees.
          </p>
          <p>
            The check was never passed. The final run came in at 44% under the schema and 64%
            without it, against the 80% I had set, and my own pre-registration said to abandon
            the constructed design at that point. I ran the comparison anyway, and the paper
            says so. The consequence is that the absolute numbers describe the instrument, not
            the model, and only the comparison between arms on identical documents is readable.
          </p>
          <p>
            That also surfaced a constraint worth stating. The number of items, how densely
            they&apos;re packed, and how long the document is are not three independent
            knobs — fix any two and the third follows. So every study of this kind picks two
            and inherits a bias in the third, and which two you pick decides whether your
            answer is an over- or under-estimate.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Why it matters</h2>
        <div className="prose mt-5">
          <p>
            If you run structured extraction in production, the schema is not what&apos;s
            costing you recall on long lists, and what it buys you is answers you can parse.
            Free-form generation with post-hoc parsing costs no fewer tokens here and
            produces output that has to be repaired before it can be scored; whether it costs
            recall is not settled at 25 documents per level. The other lesson is about the
            instrument: a tolerant parser is part of the measurement, and mine manufactured a
            result until it was tested like one.
          </p>
          <p>
            And the thing I&apos;d keep: I had the alternative explanation written down, in my
            own notes, marked as untested. Writing down what you haven&apos;t ruled out is not
            the same as ruling it out. The gap between those two was the entire finding.
          </p>
        </div>
      </section>
    </Shell>
  );
}
