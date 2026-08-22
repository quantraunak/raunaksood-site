import type { Metadata } from "next";
import r from "@/public/data/reasoning.json";
import { Shell, Section, CaseHeader, Callout, StatRow, Table, Column } from "@/components/ui";
import { Stat } from "@/components/charts";
import { ResamplingDemo, TreeExplorer, DepthCurve, AblationPanel } from "@/components/reasoning-panels";

export const metadata: Metadata = {
  title: "Resampled Thought Trees",
  description:
    "A diagnostic framework for measuring the downstream utility of intermediate states in Tree-of-Thought search: freeze a node, restart the search, and estimate the probability it still reaches a solution.",
};

export default function ReasoningPage() {
  return (
    <Shell>
      <CaseHeader
        kind="Research · LLM reasoning"
        title="Which thoughts actually matter?"
        lede={
          <p>
            Tree-of-Thought search treats inference as search over intermediate thoughts. Existing
            work grades the final answer and decides what to explore using local model scores. That
            leaves the central question unasked:{" "}
            <em>does a locally plausible thought actually preserve useful futures?</em>
          </p>
        }
        meta={[
          { label: "Venue", value: "USC · five-author paper" },
          { label: "Tasks", value: "Game24 · crossword fill" },
          { label: "Scale", value: "22,350 resampling trials" },
          { label: "Model", value: "LLaMA family, local via Ollama" },
        ]}
        links={[
          { href: "/Resampled-Thought-Trees.pdf", label: "Paper (PDF)" },
          { href: "https://github.com/quantraunak/tot-resampled-thought-trees", label: "Code & tree logs" },
        ]}
      />

      <Section eyebrow="The method" title="Treat a thought as a measurable state">
        <Column className="prose">
          <p>
            Instead of only observing whether a full search succeeds, we freeze one intermediate
            node, restart the search from exactly that state <em>M</em> times, and estimate the
            probability that it still reaches a correct solution. That turns a local text fragment
            into a conditional quantity: <code>p̂(v) ≈ P(success | state v)</code>.
          </p>
          <p>
            We also record <code>R(v)</code>, the mean number of successful terminal leaves found —
            because binary success and <em>solution mass</em> are different things, and the
            difference turns out to matter.
          </p>
        </Column>

        <div className="mt-9">
          <ResamplingDemo />
        </div>
      </Section>

      <Section eyebrow="Taxonomy" title="Five kinds of intermediate state">
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {r.categories.map((c) => (
            <div key={c.key} className="rule-soft pt-4">
              <div className="flex items-baseline gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background:
                      c.color === "teal"
                        ? "var(--color-kelp)"
                        : c.color === "ochre"
                        ? "var(--color-deep)"
                        : c.color === "clay"
                        ? "var(--color-coral)"
                        : "var(--color-ink-3)",
                    opacity: c.color === "muted" ? 0.35 : 1,
                  }}
                />
                <span className="text-[15px] font-medium">{c.label}</span>
              </div>
              <div className="mono mt-2 text-[11.5px] text-[var(--color-sea)]">{c.rule}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{c.meaning}</p>
            </div>
          ))}
        </div>
        <Callout tone="note" title="These labels are policy-relative">
          <p>
            A node is not universally dead or critical — it is dead or critical{" "}
            <strong>under a given model, branch factor, temperature and resampling budget</strong>.
            With M = 10, the dead-end threshold is simply 0 successes out of 10. Reporting them as
            operational labels rather than intrinsic properties is the honest framing.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Explore" title="A logged search tree">
        <Column className="prose">
          <p>
            Below is a Game24 tree in the shape the study logs them: branch factor 4, maximum depth
            3, nodes coloured by measured category and labelled with the rank the model gave them.
          </p>
        </Column>
        <div className="mt-8">
          <TreeExplorer />
        </div>
      </Section>

      <Section eyebrow="Finding 1" title="Local rank is not a sufficient proxy">
        <Column className="prose">
          <p>
            If the model&apos;s own ranking told you what to explore, rank-1 nodes would dominate.
            They do not.
          </p>
        </Column>
        <div className="mt-8">
          <Table
            columns={["branch rank", "n", "avg success", "avg successful leaves"]}
            rows={r.rank_game24
              .filter((d) => d.temp === "0.0")
              .map((d) => [`rank ${d.rank}`, d.n, d.success.toFixed(4), d.leaves.toFixed(4)])}
            highlight={0}
          />
        </div>
        <Column className="prose mt-8 text-[15px]">
          <p>
            Rank-1 nodes average <strong>0.16</strong> success against 0.39–0.41 for ranks 2–4. But
            this must be read carefully: the rank-1 bucket contains many depth-2 nodes, which are
            low-utility in general. Within depth 1 alone the gap nearly closes — 0.370 for rank-1
            against 0.395 for the rest.
          </p>
          <p>
            So the defensible claim is not &ldquo;rank 1 is bad.&rdquo; It is that{" "}
            <strong>local rank alone is insufficient</strong>: state position, task structure and
            remaining search all matter, and only resampling separates them.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Finding 2" title="Node utility depends on task geometry">
        <Column className="prose">
          <p>
            The two tasks do not collapse into one depth story. They have opposite depth–utility
            curves, and that is the strongest argument for measuring utility directly rather than
            inferring it from position.
          </p>
        </Column>
        <div className="mt-8">
          <DepthCurve />
        </div>
        <div className="mt-10">
          <Table
            columns={["task", "trees", "solved", "avg nodes", "avg max depth", "avg success leaves"]}
            rows={r.trees.map((t) => [
              t.task,
              t.trees,
              t.success_trees,
              t.avg_nodes.toFixed(1),
              t.max_depth.toFixed(1),
              t.leaves.toFixed(3),
            ])}
          />
        </div>
      </Section>

      <Section eyebrow="Finding 3" title="Binary accuracy hides structural loss">
        <Column className="prose">
          <p>
            Resampling estimates utility <em>if a node is reached</em>. Ablation asks a different
            question: does blocking that branch change the tree at all? Running both is what makes
            the taxonomy causal rather than descriptive.
          </p>
        </Column>
        <div className="mt-8">
          <AblationPanel />
        </div>
      </Section>

      <Section eyebrow="Finding 4" title="Temperature is an instability probe">
        <Column className="prose">
          <p>
            Under deterministic search the Game24 categories are sharply polarised — every node is
            dead, critical, or redundant-viable, with no mixed or misleading states at all. Mild
            stochasticity makes brittle states visible.
          </p>
        </Column>
        <div className="mt-8">
          <Table
            columns={["temperature", "dead end", "critical", "redundant-viable", "mixed", "misleading"]}
            rows={r.game24_categories.map((c) => [
              `T = ${c.temp}`,
              c.dead_end,
              c.critical,
              c.redundant_viable,
              c.mixed,
              c.misleading,
            ])}
          />
        </div>
        <Column className="prose mt-7 text-[15px]">
          <p>
            The 47 mixed and 9 misleading nodes that appear at T = 0.2 were present all along; the
            deterministic policy simply never revealed them. Resampling under multiple policies is
            therefore a way to separate stable utility from policy-sensitive utility.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Examples" title="What this looks like in practice">
        <div className="space-y-px">
          {r.examples.map((e, i) => (
            <div key={i} className="rule-soft grid gap-x-6 gap-y-2 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[128px_1fr]">
              <div className="mono text-[11px] text-ink-3 sm:pt-1">
                <div>{e.task}</div>
                <div className="mt-0.5 truncate opacity-70">{e.puzzle}</div>
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="mono text-[14px]">{e.thought}</span>
                  <span
                    className="mono text-[10.5px] uppercase tracking-[0.1em]"
                    style={{
                      color:
                        e.category === "critical"
                          ? "var(--color-kelp)"
                          : e.category === "redundant_viable"
                          ? "var(--color-deep)"
                          : e.category === "misleading"
                          ? "var(--color-coral)"
                          : "var(--color-ink-3)",
                    }}
                  >
                    {e.category.replace("_", " ")}
                  </span>
                  <span className="mono text-[11px] text-ink-3">p̂ = {e.utility.toFixed(1)}</span>
                  {e.rank && <span className="mono text-[11px] text-ink-3">rank {e.rank}</span>}
                </div>
                <p className="mt-1.5 max-w-[600px] text-[14.5px] leading-relaxed text-ink-2">{e.reading}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Scale" title="What was actually run">
        <StatRow>
          <Stat value="22,350" label="resampling trials" />
          <Stat value="2,235" label="node summaries" />
          <Stat value="792" label="ablation rows" />
          <Stat value="280" label="logged trees" />
          <Stat value="2" label="temperatures" />
          <Stat value="2" label="search geometries" />
        </StatRow>
        <div className="mt-9">
          <Table
            columns={["experiment", "node summaries", "trials", "tree logs", "avg success leaves"]}
            rows={r.scale.map((s) => [
              s.experiment,
              s.summaries.toLocaleString(),
              s.trials ? s.trials.toLocaleString() : "—",
              s.trees ?? "—",
              s.leaves != null ? s.leaves.toFixed(3) : "—",
            ])}
          />
        </div>
      </Section>

      <Section eyebrow="Limitations" title="What this does not show">
        <Column className="prose">
          <p>
            The limitations are part of the design rather than an afterthought. Candidate generation
            is <strong>controlled</strong> — arithmetic moves are enumerated symbolically, crossword
            fills come from a candidate bank filtered by crossing letters — and the LLM acts as a{" "}
            <strong>ranker</strong>, not an open-ended generator.
          </p>
          <p>
            That is deliberate. Fully generative ToT conflates invalid thought generation, parsing
            failures, ranking mistakes and true state utility. Controlling generation isolates the
            question we care about: among valid candidate states, which preserve downstream success?
            The cost is generality — these results describe controlled ToT-style search with LLM
            ranking, not arbitrary free-form reasoning.
          </p>
          <p>
            Three further caveats: the Game24 rank analysis is confounded by depth; the crossword
            branch-diverse run intentionally oversamples across rank and includes terminal dead
            nodes, so its category distribution is not the natural one; and the deepest crossword
            bins have single-digit sample sizes.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Contribution" title="Why this is not just running ToT">
        <Column className="prose text-[16px]">
          <p>
            The contribution is a shift in the unit of analysis. Measuring only final accuracy
            cannot distinguish a state that looks plausible but has no future from one that
            reliably preserves success, or from one that preserves many successful futures without
            being necessary for any of them.
          </p>
          <p>
            The overall conclusion is that intermediate thoughts are not simply earlier or later,
            and not simply high- or low-ranked. They have{" "}
            <strong>task-dependent utility that can be measured</strong> — and understanding ToT
            search requires measuring it rather than inferring it from local scores.
          </p>
        </Column>
        <div className="mt-8 mono text-[11.5px] text-ink-3">
          {r.paper.authors.join(" · ")} — {r.paper.affiliation}
        </div>
      </Section>
    </Shell>
  );
}
