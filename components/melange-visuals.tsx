"use client";

import { useState } from "react";

const CASES = [
  {
    q: "Can you read your own messages?",
    a: true,
    why: "Yes. You're one of the two people on the match, so the database returns them.",
  },
  {
    q: "Can you read someone else's messages?",
    a: false,
    why: "No. The app can ask, but the database checks who you are and returns nothing at all.",
  },
  {
    q: "Can you see someone who blocked you?",
    a: false,
    why: "No. Blocking is enforced in the database, so it holds even if the app has a bug.",
  },
  {
    q: "Can you pretend to be another user?",
    a: false,
    why: "No. Every write is checked against your verified identity before it's accepted.",
  },
];

export function SecurityDemo() {
  const [i, setI] = useState(1);
  const c = CASES[i];

  return (
    <figure className="my-10">
      <div className="rounded-xl border border-rule p-5 sm:p-7">
        <div className="space-y-2.5">
          {CASES.map((cs, idx) => (
            <button
              key={cs.q}
              type="button"
              onClick={() => setI(idx)}
              aria-pressed={i === idx}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-[16.5px] transition-colors ${
                i === idx ? "border-[var(--color-sea)] bg-[var(--color-accent-soft)]" : "border-rule hover:border-ink-3"
              }`}
            >
              {cs.q}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-paper-2 p-5">
          <div
            className="text-[17px] font-medium"
            style={{ color: c.a ? "var(--color-kelp)" : "var(--color-coral)" }}
          >
            {c.a ? "Allowed" : "Blocked"}
          </div>
          <p className="mt-2 text-[16.5px] leading-[1.7] text-ink-2">{c.why}</p>
        </div>
      </div>
      <figcaption className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
        <span className="font-medium text-ink">What to look at: </span>
        every one of these rules lives in the database, not the app. A bug in the iPhone app or the
        website cannot leak someone else&apos;s data.
      </figcaption>
    </figure>
  );
}

const CARDS = [
  { name: "Ana", role: "Photographer", color: "var(--color-coral)" },
  { name: "Malik", role: "Stylist", color: "var(--color-sea)" },
  { name: "Yuki", role: "Model", color: "var(--color-kelp)" },
];

/* The swipe loop, from the database's side. Two independent clients, one match
   row, and the pair canonicalised so (A,B) and (B,A) cannot both exist.
   Mirrors mobile/src/lib/db.ts and the UNIQUE(user1_id, user2_id) on matches. */

const ME = { name: "You", id: "a41f…" };
const THEM = { name: "Ana", id: "7c02…" };

export function SwipeDemo() {
  const [mine, setMine] = useState(false);
  const [theirs, setTheirs] = useState(false);
  const [raced, setRaced] = useState(false);

  const matched = mine && theirs;
  // Sorted, exactly as the client does before inserting.
  const lower = ME.id < THEM.id ? ME : THEM;
  const upper = ME.id < THEM.id ? THEM : ME;

  const reset = () => {
    setMine(false);
    setTheirs(false);
    setRaced(false);
  };

  return (
    <figure className="my-10">
      <div className="rounded-xl border border-rule p-5 sm:p-7">
        <div className="grid grid-cols-2 gap-4">
          {[
            { who: ME, on: mine, set: setMine, sub: "iPhone" },
            { who: THEM, on: theirs, set: setTheirs, sub: "Web" },
          ].map(({ who, on, set, sub }) => (
            <div key={who.name} className="rounded-lg border border-rule-soft p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px]">{who.name}</span>
                <span className="mono text-[11px] text-ink-3">{sub}</span>
              </div>
              <div className="mono mt-1 text-[11px] text-ink-3">user_id {who.id}</div>
              <button
                onClick={() => set(!on)}
                aria-pressed={on}
                className="mt-3 w-full rounded-full border px-3 py-1.5 text-[13.5px] transition-colors"
                style={{
                  borderColor: on ? "var(--color-kelp)" : "var(--color-rule)",
                  color: on ? "var(--color-kelp)" : "var(--color-ink-2)",
                }}
              >
                {on ? "swiped right ✓" : "swipe right"}
              </button>
            </div>
          ))}
        </div>

        <div className="mono mt-6 mb-2 text-[11.5px] uppercase tracking-[0.12em] text-ink-3">
          public.matches
        </div>
        <div className="overflow-x-auto rounded-lg bg-paper-2 p-4">
          <table className="mono w-full min-w-[300px] text-left text-[11.5px]">
            <thead className="text-ink-3">
              <tr>
                <th className="pb-2 font-medium">user1_id</th>
                <th className="pb-2 font-medium">user2_id</th>
              </tr>
            </thead>
            <tbody>
              {matched ? (
                <tr style={{ color: "var(--color-kelp)" }}>
                  <td className="pt-1">{lower.id}</td>
                  <td className="pt-1">{upper.id}</td>
                </tr>
              ) : (
                <tr className="text-ink-3">
                  <td className="pt-1" colSpan={2}>
                    (0 rows) — one right swipe is not a match
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {matched && (
          <div className="mt-4 text-[13.5px] leading-[1.65] text-ink-2">
            The pair is <strong className="text-ink">sorted before it&apos;s written</strong>, so
            the lower id is always <span className="mono">user1_id</span>. Without that,{" "}
            <span className="mono">(you, Ana)</span> and <span className="mono">(Ana, you)</span>{" "}
            are two different rows and the unique constraint never fires.
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3 border-t border-rule-soft pt-4">
          <button
            onClick={() => {
              setMine(true);
              setTheirs(true);
              setRaced(true);
            }}
            className="rounded-full border border-rule px-3 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-[var(--color-sea)] hover:text-[var(--color-sea)]"
          >
            Both swipe at the same instant
          </button>
          <button
            onClick={reset}
            className="rounded-full px-3 py-1.5 text-[13px] text-ink-3 transition-colors hover:text-ink"
          >
            Reset
          </button>
        </div>

        {raced && (
          <div className="mt-4 rounded-lg bg-paper-2 p-4 text-[13px] leading-[1.7]">
            <div className="mono text-ink-2">
              client A → INSERT … <span style={{ color: "var(--color-kelp)" }}>ok</span>
              <br />
              client B → INSERT …{" "}
              <span style={{ color: "var(--color-coral)" }}>23505 unique_violation</span>
              <br />
              client B → SELECT … <span style={{ color: "var(--color-kelp)" }}>same row</span>
            </div>
            <p className="mt-3 text-ink-2">
              Both people can swipe in the same instant, and both clients then try to create the
              match. Rather than locking, the insert is allowed to fail: the loser catches the
              unique violation and reads back the row the winner wrote. The database arbitrates,
              and a conflict is treated as success.
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
        <span className="font-medium text-ink">What to look at: </span>
        a match isn&apos;t a thing either app decides. It&apos;s a row that can only exist when
        both swipes do, written in a canonical order so it can only exist once.
      </figcaption>
    </figure>
  );
}

/* The eight weighted terms of ranked_feed_posts(), with the real coefficients
   out of supabase/schema/05_ranking.sql. Click a term to see what it does. */
const TERMS = [
  { key: "recency", w: 0.22, label: "Recency", note: "1 / (1 + days / 7). A post decays to half weight in a week." },
  { key: "vibes", w: 0.18, label: "Vibe overlap", note: "Jaccard index over the tags on your profile and the post." },
  { key: "role", w: 0.18, label: "Role fit", note: "1.0 if the post is explicitly looking for your role, 0.55 if you simply do something different from the author, 0.1 otherwise." },
  { key: "embed", w: 0.12, label: "Text similarity", note: "Cosine between a 128-dim embedding of your profile and one of the post." },
  { key: "rep", w: 0.12, label: "Reputation", note: "Average review rating, from reviews that only unlock when both sides have written one." },
  { key: "portfolio", w: 0.08, label: "Portfolio depth", note: "Images on the author's profile, capped at nine." },
  { key: "event", w: 0.05, label: "Shared event", note: "You and the author have RSVP'd to the same upcoming event." },
  { key: "city", w: 0.05, label: "Same city", note: "The post's location matches a city you're going to be in." },
];

export function RankingBreakdown() {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...TERMS.map((t) => t.w));
  const shown = TERMS.find((t) => t.key === active);

  return (
    <figure className="my-10">
      <div className="rounded-xl border border-rule p-5 sm:p-7">
        <div className="mono mb-5 text-[11.5px] uppercase tracking-[0.12em] text-ink-3">
          rank_score — weights that sum to 1.00
        </div>

        {TERMS.map((t) => {
          const on = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(on ? null : t.key)}
              aria-pressed={on}
              className="flex w-full items-center gap-3 py-[7px] text-left"
            >
              <span
                className="w-[104px] shrink-0 text-[13.5px] transition-colors sm:w-[124px]"
                style={{ color: on ? "var(--color-ink)" : "var(--color-ink-2)" }}
              >
                {t.label}
              </span>
              <span className="relative h-[13px] flex-1 rounded-[2px] bg-paper-3">
                <span
                  className="absolute inset-y-0 left-0 rounded-[2px] transition-all"
                  style={{
                    width: `${(t.w / max) * 100}%`,
                    background: on ? "var(--color-sea)" : "var(--color-shallow)",
                    opacity: on ? 1 : 0.62,
                  }}
                />
              </span>
              <span className="mono w-[42px] shrink-0 text-right text-[12px] tabular-nums text-ink-3">
                {t.w.toFixed(2)}
              </span>
            </button>
          );
        })}

        <div className="mt-5 min-h-[3.2em] border-t border-rule-soft pt-4 text-[14px] leading-[1.65] text-ink-2">
          {shown ? (
            <>
              <span className="font-medium text-ink">{shown.label}.</span> {shown.note}
            </>
          ) : (
            <span className="text-ink-3">Pick a term.</span>
          )}
        </div>
      </div>
      <figcaption className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
        <span className="font-medium text-ink">What to look at: </span>
        no single term dominates. Recency is the largest at 0.22, which is deliberate — in a
        marketplace with almost no supply, showing people the newest thing matters more than
        showing them the best-matched thing.
      </figcaption>
    </figure>
  );
}
