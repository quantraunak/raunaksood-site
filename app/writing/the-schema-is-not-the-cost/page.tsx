import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "The schema is not the cost",
  description:
    "Constrained decoding is supposed to cost you accuracy. On extraction recall as the number of items grows, it is the only thing holding recall up: unconstrained generation loses 0.214 from k=1 to k=16, the same model under a JSON schema loses nothing.",
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
            That is the design. Getting it to work took five attempts, and the four failures
            are more instructive than the design is. I set a sanity gate first: at{" "}
            <span className="mono">k=1</span>, recall must clear 0.80. One needle, from a
            sentence the extractor itself produced in the wild.
          </p>
          <p>
            <strong>It came back 0.333.</strong> Then, after a fix, 0.400. Then 0.400 again.
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

        <div className="code mt-7" role="img" aria-label="recall against filler length at constant k">
{`filler          recall
 1,500 chars     0.667
 4,000 chars     0.583
14,000 chars     0.417`}
        </div>

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
            arm, zero truncations.
          </p>
        </div>

        <div className="code mt-7" role="img" aria-label="recall by k for both decoding arms">
{`k     constrained   unconstrained
 1        0.440          0.640
 4        0.640          0.530
16        0.554          0.426

pre-registered test: drop >= 0.15 and p < 0.05

unconstrained   drop +0.214   p = 0.011   rejects
constrained     drop -0.114   p = 0.73    nothing`}
        </div>

        <div className="prose mt-7">
          <p>
            Paired on the same documents, unconstrained leads by 0.200 at{" "}
            <span className="mono">k=1</span> and trails by 0.128 at{" "}
            <span className="mono">k=16</span> (p = 0.005). The crossover is the effect.
          </p>
          <p>
            <strong>
              So the cardinality effect is real, and the grammar is what prevents it.
            </strong>
          </p>
          <p>
            The emission counts give it away. At <span className="mono">k=16</span> the
            constrained arm emits 9.4 items of the 16 available; the unconstrained arm emits
            7.2. Precision is identical at 0.946 and 0.948, so this is not a quality
            tradeoff. Left to decide when to stop, the model stops early. A schema takes that
            decision away, because a half-filled array is not a valid parse.
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
            you recall at high item counts. It is the thing holding recall up. If you have
            been considering free-form generation with post-hoc parsing to escape grammar
            masking, measure the item-count axis before you switch.
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
