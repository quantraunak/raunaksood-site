import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { MoveExplorer, TaskShapes } from "@/components/reasoning-visuals";
import { Details } from "@/components/details";

export const metadata: Metadata = {
  title: "Resampled Thought Trees",
  description:
    "Measuring which steps in an AI's reasoning actually matter, by freezing it mid-thought and re-running the search 22,000 times.",
};

export default function ReasoningPage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">AI research · USC · five authors</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">
          Resampled Thought Trees
        </h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          When an AI solves a problem step by step, some steps are essential and some are wasted
          effort. Nobody could tell which was which. We built a way to measure it.
        </p>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">The problem</h2>
        <div className="prose mt-5">
          <p>
            Modern AI systems solve hard problems by exploring — trying one line of reasoning, then
            another, like a person working through a puzzle. At each step the model picks which idea
            to pursue next, based on how promising it looks.
          </p>
          <p>
            The catch: nobody knew whether &ldquo;looks promising&rdquo; and &ldquo;actually leads
            somewhere&rdquo; are the same thing. Everyone measured whether the final answer was right,
            which tells you nothing about which steps along the way were doing the work.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What we did</h2>
        <div className="prose mt-5">
          <p>
            Freeze the AI at one specific thought. Restart it from exactly that point, ten times over.
            Count how often it still reaches the right answer.
          </p>
          <p>
            Do that for every thought in the tree and you get a score for each one: how much that
            step was really worth. We ran it <strong>22,350 times</strong> across two kinds of puzzle.
          </p>
        </div>

        <MoveExplorer />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Main finding</h2>
        <div className="prose mt-5">
          <p>
            <strong>The AI&apos;s own confidence is a poor guide.</strong> Its top-ranked next step
            was frequently a dead end, while options it ranked last turned out to be the ones that
            reliably worked.
          </p>
          <p>
            That matters practically: these systems decide what to explore using exactly that
            ranking. If the ranking is unreliable, they spend their budget in the wrong places.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Results differ by task</h2>
        <div className="prose mt-5">
          <p>
            We expected a simple rule like &ldquo;early steps matter most.&rdquo; Instead the two
            tasks behaved in opposite ways — so there is no shortcut, and you have to measure.
          </p>
        </div>
        <TaskShapes />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">A second result</h2>
        <div className="prose mt-5">
          <p>
            We also deleted branches from the tree to see what broke. Judged only on{" "}
            <em>did it still solve the puzzle</em>, deleting things looked harmless.
          </p>
          <p>
            But counting how many <em>different</em> routes to the answer survived told another
            story: some branches quietly removed most of the solutions while leaving one behind. The
            puzzle still solved, so a normal evaluation saw nothing — while the system had become far
            more fragile.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Scope and limitations</h2>
        <div className="prose mt-5">
          <p>
            This was a five-author project at USC. The honest framing of the results: we controlled
            the AI&apos;s options rather than letting it generate freely, which makes the measurement
            much cleaner but means the findings describe this setup rather than every AI system.
          </p>
        </div>

        <Details summary="Technical detail, for readers who want it">
          <div className="prose">
            <p>
              Node-level resampling in Tree-of-Thought search: freeze state v, restart search M = 10
              times, estimate p̂(v) ≈ P(success | v), and record R(v), the mean count of successful
              terminal leaves. Nodes are categorised as dead-end, misleading, mixed, critical or
              redundant-viable under fixed operational thresholds, then validated causally by branch
              ablation.
            </p>
            <p>
              1,600 Game24 node summaries over 16,000 trials and 200 logged trees; 792 ablation rows;
              635 crossword summaries over 6,350 trials and 80 trees. Ablation overall: Δ solve rate
              −0.0016 but Δ successful leaves +0.163 — binary accuracy hides the structural loss.
              Candidate generation is controlled and the LLM acts as ranker, not generator.
            </p>
          </div>
        </Details>

        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="/Resampled-Thought-Trees.pdf" className="link">Read the paper (PDF)</a>
          <a href="https://github.com/quantraunak/tot-resampled-thought-trees" className="link">
            Code and data
          </a>
        </div>
      </section>
    </Shell>
  );
}
