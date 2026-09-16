import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { CardinalityDemo } from "@/components/cardinality-demo";
import { CrossoverFigure, DilutionFigure } from "@/components/cardinality-figures";

export const metadata: Metadata = {
  title: "cardinality-eval",
  description:
    "Does an extractor get worse as the number of things to find grows? Yes, but only without a JSON schema. The grammar everyone suspects of costing accuracy is what prevents the loss.",
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
          Ask a model to pull ten things out of a document instead of one, and it finds a
          smaller share of them. Unless you make it fill in a form, in which case it
          doesn&apos;t.
        </p>
        <div className="mt-7 flex flex-wrap gap-6 text-[16px]">
          <a href="https://github.com/quantraunak/cardinality-eval" className="link">
            cardinality-eval on GitHub
          </a>
          <Link href="/writing/the-schema-is-not-the-cost" className="link">
            Full write-up
          </Link>
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
          Every number is measured. The three stops are the three levels actually run, 75
          documents each, with nothing interpolated between them.
        </p>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What I found</h2>
        <div className="prose mt-5">
          <p>
            Recall does fall as the list grows — but only when the model is writing freely.
            Under a schema, on the same documents, it doesn&apos;t fall at all.
          </p>
        </div>

        <CrossoverFigure />

        <div className="prose">
          <p>
            The test was fixed in advance: to count, recall had to drop at least 0.15 from
            the short lists to the long ones, <em>and</em> clear p &lt; 0.05. Free generation
            drops <strong>0.214</strong> at p = 0.011. The schema drops{" "}
            <strong>nothing</strong> — recall actually rises, p = 0.73.
          </p>
          <p>
            The reason is visible in how many items each one emits. At sixteen available, the
            schema produces 9.4 and free generation produces 7.2, at the same precision. Left
            to decide when to stop, the model stops early, and stops earlier the longer the
            list gets. A schema takes that decision away, because a half-filled array
            isn&apos;t valid JSON, so it keeps going.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The part that took longest</h2>
        <div className="prose mt-5">
          <p>
            Before measuring anything I set a sanity check: with one item hidden in one
            document, the extractor should find it at least 80% of the time. It came back{" "}
            <strong>33%</strong>. Then 40%. Then 40% again, after fixing four separate bugs I
            could see by reading the output.
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
            costing you recall on long lists. It&apos;s what&apos;s holding recall up. Anyone
            considering free-form generation with post-hoc parsing to escape grammar masking
            should measure this axis first — on this model the trade goes the wrong way, and
            it costs nothing in tokens to find out.
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
