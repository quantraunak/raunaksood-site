// Papers and posts, listed on the home page and on /writing.

export const PAPERS: [string, string, string, string][] = [
  [
    "/papers/bias-fingerprints.pdf",
    "Bias Fingerprints: Diagnosing Data-Handling Errors from the Cross-Section of Reported Factor Performance",
    "A period-end join inflates mean IC by 59% and manufactures four spurious t-statistics; a survivorship-conditioned universe relocates rather than inflates. Running the validation protocol shows one of the two signatures is diagnosable from outside and one is not, and the geometry says which in advance.",
    "q-fin.ST · 14pp",
  ],
  [
    "/papers/cardinality.pdf",
    "Constrained Decoding Prevents Cardinality Degradation in Structured Extraction",
    "Extraction recall falls 0.214 with the number of items to emit under free generation and not at all under a JSON schema, on the same documents. The grammar is the mitigation, not the cost.",
    "cs.CL · 6pp",
  ],
];

export const WRITING: [string, string, string, string][] = [
  [
    "/writing/the-schema-is-not-the-cost",
    "The schema is not the cost",
    "Constrained decoding is supposed to cost you accuracy. On extraction recall as the number of items grows, it is the only thing holding recall up. The instrument failed its own sanity check four times before it found that.",
    "Sep 2026",
  ],
  [
    "/writing/testing-for-leakage",
    "Testing for leakage without knowing the right answer",
    "A factor that looked price-only divided by shares outstanding and inflated mean IC by 59%. Then I benchmarked the detector I built for it against five public datasets, and it caught nine of nine.",
    "Sep 2026",
  ],
];
