import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Section } from "@/components/ui";
import { CardinalityDemo } from "@/components/cardinality-demo";
import { CrossoverFigure, DilutionFigure } from "@/components/cardinality-figures";

export const metadata: Metadata = {
  title: "The schema is not the cost",
  description:
    "Constrained decoding is supposed to cost you accuracy. On extraction recall as the number of items grows, a one-model pilot finds neither regime meets the pre-registered test; what the schema buys is valid output. A scorer bug that once made this post claim more is disclosed inside.",
};

export default function SchemaPage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Writing · September 2026</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          The schema is not the cost
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          If you run an LLM behind a JSON schema, you have probably worried about what the
          grammar is doing to the model. I went looking for that cost in a specific place
          and found the opposite.
        </p>
      </header>

      <div className="pb-4">
        <CardinalityDemo />
      </div>

      <Section>
        <div className="prose">
          <p>
            Constrained decoding masks tokens the model wants, and the reported costs are
            real: several percentage points of accuracy across open-weight models, and at
            least one function-calling result where unconstrained generation with post-hoc
            parsing beat constrained decoding outright.
          </p>
        </div>
      </Section>

      <Section title="The question">
        <div className="prose">
          <p>
            Ask a model to pull every named counterparty out of a 10-K. Does it get worse at
            that as the number of counterparties grows, holding the document length and the
            schema fixed? Call that number <span className="mono">k</span>.
          </p>
          <p>
            It is not a new question in spirit.{" "}
            <a href="https://www.langchain.com/blog/multi-needle-in-a-haystack" className="link">
              Multi-needle NIAH
            </a>{" "}
            already reports that retrieval falls as needle count rises. What nobody had
            measured was the same axis for structured extraction under a grammar, with input
            length actually held constant, reported as a slope rather than as &ldquo;it
            declines.&rdquo;
          </p>
          <p>
            And there was a specific reason to care. In my own extraction work I had written
            down constrained decoding as the strongest competing explanation for any
            cardinality effect I might find. I recorded it as unfalsified and moved on,
            which is a comfortable way to stay wrong.
          </p>
        </div>
      </Section>

      <Section title="Building a ruler that works">
        <div className="prose">
          <p>
            You cannot answer this by annotating documents, because{" "}
            <span className="mono">k</span> is the treatment. If it comes from whichever
            filings you happened to sample and a human has to recover it, it is measured with
            error that correlates with the outcome, because an annotator&apos;s attention
            flags on exactly the long enumerations where the effect should live.
          </p>
          <p>
            So I built the documents instead. Take verbatim-validated sentences from real
            filings, each carrying exactly one named company. Inject{" "}
            <span className="mono">k</span> of them at random positions into filler drawn
            from the same corpus with every capitalised name stripped out. Pad to a constant
            length. Gold is the set you injected, so <span className="mono">k</span> is exact
            and free.
          </p>
          <p>
            That is the design. Getting it to work took four builds, and the failures
            are more instructive than the design is.
          </p>
          <p>
            <strong>The first pilot came back 0.333.</strong> One needle, from a sentence
            the extractor itself produced in the wild, found a third of the time. Only
            then did I add the gate that should have existed from the start: at{" "}
            <span className="mono">k=1</span>, recall must clear 0.80 or no slope is
            interpretable. The pre-registration records it as added after that failure,
            not before. Then, after a fix, 0.400. Then 0.400 again.
          </p>
          <p>
            The first cause was that my injected sentences named their own original filer in
            the third person, while the document was attributed to a placeholder company. The
            model was being asked who ACME deals with and correctly declining to say Lockheed.
            The second round found four more defects at once: an all-caps ticker the
            name-detector missed, paragraph chunking that sliced sentences in half at fixed
            offsets, gold items that were not company names, and a matching rule strict enough
            to score <span className="mono">Komatsu</span> against{" "}
            <span className="mono">Komatsu Cummins Chile, Ltda.</span> as a miss.
          </p>
          <p>
            Fixed all four. Recall: 0.400. At that point I stopped patching things I could
            see and ran a controlled comparison instead.
          </p>
        </div>

        <DilutionFigure />

        <div className="prose mt-7">
          <p>
            <strong>Dilution alone was worth 0.25 recall.</strong> I had built the filler by
            selecting prose <em>for containing no company names</em>, which made it far more
            inert than any real prompt. The gate was never failing because of the bank or the
            chunking. It was failing because I had buried one sentence in a haystack far
            emptier than anything the model sees in practice.
          </p>
          <p>
            It also exposed something structural. Count, density and length are mechanically
            linked: density = (count × span length) / total length. Fix any two and the third
            follows, so every study of item count picks two and inherits a confound in the
            third. Fix length and let density rise with <span className="mono">k</span>, as I
            did, and high-<span className="mono">k</span> documents get a density advantage
            that partially cancels the effect, so your measurement is a lower bound. Fix
            density and let length grow, as multi-needle NIAH does, and length suppresses
            high <span className="mono">k</span>, giving an upper bound. There is no third
            option.
          </p>
        </div>
      </Section>

      <Section title="The result">
        <div className="prose">
          <p>
            <span className="mono">qwen3:14b</span>, 32k context, 75 matched documents per
            arm (25 at each of k = 1, 4, 16), no response within a tenth of the 24,000-token
            ceiling (the longest is 903 tokens). One caveat first: the k=1 gate
            above was never met. The final run came in at 0.440 constrained and 0.640
            unconstrained against the 0.80 I had set, and the pre-registration said to abandon
            the constructed design at that point. I ran the comparison anyway. So the absolute
            levels describe the instrument, not the model, and only the between-arm contrast
            on identical documents is readable.
          </p>
        </div>

        <CrossoverFigure />

        <div className="code" role="img" aria-label="the pre-registered test result">
{`pre-registered: drop >= 0.15 AND p < 0.05

unconstrained   drop +0.131   p = 0.027   does not reject (drop < 0.15)
constrained     drop -0.114   p = 0.73    nothing

valid JSON as emitted, k = 1 / 4 / 16
unconstrained   25/25   23/25   21/25
constrained     25/25   25/25   25/25`}
        </div>

        <div className="prose mt-7">
          <p>
            First, a correction to what this post said until October 2026. It reported a
            0.214 drop under free generation and called it a rejection. Six of the 75
            free-form answers had been scored as empty because my tolerant parser rejected
            JSON whose strings contained quotation marks the model had copied from the
            filings, like <span className="mono">Express Scripts, Inc. (&quot;Express
            Scripts&quot;)</span>. Those six complete answers held 39 items, 38 correct. The
            scorer now repairs interior quotes, fails closed if that does not yield valid
            JSON, and has unit tests. Re-scored, the free-form drop is 0.131 at p = 0.027:
            the rank test clears, the size does not, and the pre-registered rule rejects for
            neither arm.
          </p>
          <p>
            Paired on the same documents, unconstrained leads by 0.200 at{" "}
            <span className="mono">k=1</span> and trails by 0.045 at{" "}
            <span className="mono">k=16</span>. The interaction test, which I did not
            pre-specify, puts the gap at −0.061 per doubling of k (p = 0.020), carried by
            k=1, where the constrained arm returns an empty list on 13 of 25 documents.
            Remove those and the slope is gone (p = 0.17): above one item, both arms lose
            recall at about the same rate.
          </p>
          <p>
            <strong>
              So the grammar is not the cost, and on this evidence it is not the cure
              either. What it buys is validity.
            </strong>{" "}
            Without a grammar, one answer in five at k=16 is not valid JSON as written, and
            a scorer without a repair step reads that as zero recall, which is exactly how
            this post came to report a result it did not have.
          </p>
          <p>
            The emission counts: at <span className="mono">k=16</span> the constrained arm
            emits 9.4 items of the 16 available; the unconstrained arm emits 8.5, at the same
            precision (0.946 and 0.953). Both stop well short. An earlier version of this post
            said a half-filled array is not a valid parse, so the schema forces the model on.
            That is false: the schema is a bare list with no minimum length, and most of the
            emission gap I reported was the parser defect. The experiment that would test a
            grammar-level stopping story, a minimum item count in the schema, has not been
            run.
          </p>
          <p>
            That also kills a number I believed earlier in the week. On a 30B
            mixture-of-experts model, unconstrained generation cost 18× the tokens. I
            reported that as a fact about removing the grammar. It was not. That model was
            writing 7,000 to 12,000 tokens against an 8,192-token context window, so the arm
            was measuring a wall. On a model whose generation fits, unconstrained costs 1.1×
            at <span className="mono">k=1</span> and <strong>0.7× at k=16</strong>. It is
            cheaper and worse.
          </p>
        </div>
      </Section>

      <Section title="What I would take from this">
        <div className="prose">
          <p>
            For anyone shipping structured extraction: the schema is not the thing costing
            you recall at high item counts, and what it buys you is output you can parse.
            Free-form generation with post-hoc parsing costs no fewer tokens here and breaks
            the format more often as the list grows. Whether it costs recall is not settled
            at 25 documents per level. If you are considering it to escape grammar masking,
            measure the item-count axis and test your parser before you switch.
          </p>
          <p>
            For anyone evaluating extraction: a single F1 over a benchmark whose{" "}
            <span className="mono">k</span> distribution is unstated is not comparable to
            another benchmark&apos;s F1. And if you measure the axis, say which two of count,
            density and length you fixed, because that choice decides whether your number is
            an upper or a lower bound.
          </p>
          <p>
            The methodological lesson is narrower and more annoying. I had recorded
            constrained decoding as the strongest competing explanation and left it
            unfalsified. Writing down what you have not ruled out is not the same as ruling
            it out, and the gap between those two things was, in this case, the entire
            finding.
          </p>
          <p>
            One more correction to the record. The pre-registration originally specified a
            different second factor, model size against think/no-think. The think factor
            proved inert on September 11 and was replaced by constrained-vs-unconstrained
            decoding before the unconstrained arm was run; the rejection rule did not change.
            The repository&apos;s first commit contains both the pre-registration and the
            results, so the ordering rests on the document&apos;s own dated amendments, not
            on commit history.
          </p>
          <p>
            Code, pre-registration, evaluation set and all 450 raw model responses:{" "}
            <a href="https://github.com/quantraunak/cardinality-eval" className="link">
              cardinality-eval
            </a>
            . The result re-scores without a GPU.
          </p>
        </div>
      </Section>
    </Shell>
  );
}
