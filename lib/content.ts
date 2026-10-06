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
    "Cardinality Degradation in Structured Extraction: A Constructed-Document Pilot of Constrained and Unconstrained Decoding",
    "Proposes building the evaluation documents from verbatim filing sentences so the number of items to find is exact and the answer key is free. Result, on one model: free-form recall falls 0.214 from 1 to 16 items (p = 0.011) and schema-constrained recall does not (p = 0.73). The gap is carried by the one-item documents, so the schema is not the cost, and whether it is the cure is not yet settled.",
    "cs.CL · 7pp",
  ],
];

export const WRITING: [string, string, string, string][] = [
  [
    "/writing/the-schema-is-not-the-cost",
    "The schema is not the cost",
    "Constrained decoding is supposed to cost you accuracy. On extraction recall as the number of items grows, it is the only thing holding recall up. The instrument failed its own sanity check three times during construction and never cleared it, which bounds what the result can mean.",
    "Sep 2026",
  ],
  [
    "/writing/testing-for-leakage",
    "Testing for leakage without knowing the right answer",
    "A factor that looked price-only divided by shares outstanding, and the dating mistake it exposed inflates mean IC by 59% across the filing-based signals. Then I benchmarked the detector I built for it against five public datasets. It caught eight of nine, and the ninth is invisible to it by construction.",
    "Sep 2026",
  ],
];
