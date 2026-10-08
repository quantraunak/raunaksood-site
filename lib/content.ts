// Papers and posts, listed on the home page and on /writing.

export const PAPERS: [string, string, string, string][] = [
  [
    "/papers/bias-fingerprints.pdf",
    "Bias Fingerprints: Diagnosing Data-Handling Errors from the Cross-Section of Reported Factor Performance",
    "Proposes bias fingerprinting: each data-handling mistake in a stock-picking study leaves a fixed pattern of shifts across 22 standard signals, measured once on a controlled pipeline, so a published results table can be read backwards to say which mistake it contains. Result: dating filings to quarter-end inflates measured skill 59% and manufactures four spurious significant results; a survivorship-biased universe rearranges rather than inflates. Under the validation protocol the universe signature is identifiable from outside (99% in simulation) and the dating signature is not, and the geometry says why in advance.",
    "q-fin.ST · 15pp",
  ],
  [
    "/papers/cardinality.pdf",
    "What Constrained Decoding Buys at High Item Counts: Validity, Not Recall",
    "Proposes building the evaluation documents from verbatim filing sentences so the number of items to find is exact and the answer key is free. Result, on one model: neither decoding regime meets the pre-registered test for recall falling with item count (free-form drops 0.131, below the 0.15 rule). What the grammar buys with evidence is validity: free-form responses are valid JSON 25/25, 23/25, 21/25 as items grow; constrained 75/75. An earlier version reported a rejection that turned out to be a scorer defect.",
    "cs.CL · 7pp",
  ],
];

export const WRITING: [string, string, string, string][] = [
  [
    "/writing/the-schema-is-not-the-cost",
    "The schema is not the cost",
    "Constrained decoding is supposed to cost you accuracy. On extraction recall as the number of items grows, this pilot finds no cost and no cure under its pre-registered rule, after a parser defect that had manufactured a rejection was fixed. What the schema buys is valid output. The instrument failed its own sanity check and never cleared it, which bounds what the result can mean.",
    "Sep 2026",
  ],
  [
    "/writing/testing-for-leakage",
    "Testing for leakage without knowing the right answer",
    "A factor that looked price-only divided by shares outstanding, and the dating mistake it exposed inflates mean IC by 59% across the filing-based signals. Then I benchmarked the detector I built for it against five public datasets. It caught eight of nine, and the ninth is invisible to it by construction.",
    "Sep 2026",
  ],
];
