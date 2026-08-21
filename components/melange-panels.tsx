"use client";

import { useState } from "react";

/* ------------------------------------------------------- architecture */

const LAYERS = [
  {
    id: "clients",
    label: "Clients",
    nodes: ["iOS · Expo / React Native", "Web · Next.js"],
    note: "Two clients, one account. Sign up on the phone, sign in on the web, same matches and messages.",
  },
  {
    id: "edge",
    label: "Edge function",
    nodes: ["send-push · Deno"],
    note: "The one piece of server code in the system: it fans out push notifications on new matches and messages.",
  },
  {
    id: "db",
    label: "Postgres · Supabase",
    nodes: ["auth", "row-level security", "realtime", "storage"],
    note: "There is no backend server. Both clients talk straight to Postgres, and the database decides what each user is allowed to see.",
  },
];

export function Architecture() {
  const [active, setActive] = useState<string>("db");
  const layer = LAYERS.find((l) => l.id === active)!;

  return (
    <div>
      <div className="grid gap-3">
        {LAYERS.map((l) => {
          const on = active === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setActive(l.id)}
              aria-pressed={on}
              className={`rounded-lg border p-5 text-left transition-colors ${
                on ? "bg-paper-2" : "border-rule-soft hover:border-rule"
              }`}
              style={{ borderColor: on ? "var(--color-clay)" : undefined }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow">{l.label}</span>
                <span className="mono text-[10.5px] text-ink-3">{l.nodes.length} component{l.nodes.length > 1 ? "s" : ""}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {l.nodes.map((n) => (
                  <span
                    key={n}
                    className="rounded border border-rule-soft bg-paper px-2.5 py-1 mono text-[11.5px] text-ink-2"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-5 max-w-[640px] text-[13.5px] leading-relaxed text-ink-3">{layer.note}</p>
    </div>
  );
}

/* --------------------------------------------------------- RLS explainer */

const POLICY_CASES = [
  {
    id: "own",
    actor: "Reading your own profile",
    query: "select * from profiles where id = auth.uid()",
    allowed: true,
    why: "The policy compares the row's id to auth.uid(), which Postgres derives from the signed JWT. It matches.",
  },
  {
    id: "other",
    actor: "Reading someone else's messages",
    query: "select * from messages where match_id = '…'",
    allowed: false,
    why: "Messages are readable only if you are one of the two profiles on the match. The client can ask; the database returns zero rows.",
  },
  {
    id: "blocked",
    actor: "Seeing a user who blocked you",
    query: "select * from posts order by rank",
    allowed: false,
    why: "The feed policy excludes rows authored by anyone in your block relation, in either direction. Filtering in the client would be advisory; here it is enforced.",
  },
  {
    id: "write",
    actor: "Writing a swipe as another user",
    query: "insert into swipes (swiper_id, …) values ('someone-else', …)",
    allowed: false,
    why: "The insert policy requires swiper_id = auth.uid(). A forged client cannot write a swipe it does not own.",
  },
];

export function RowLevelSecurity() {
  const [active, setActive] = useState(POLICY_CASES[1].id);
  const c = POLICY_CASES.find((p) => p.id === active)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="space-y-1.5">
        {POLICY_CASES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            aria-pressed={active === p.id}
            className={`block w-full rounded border px-3.5 py-2.5 text-left text-[13px] transition-colors ${
              active === p.id ? "border-rule bg-paper-2 text-ink" : "border-transparent text-ink-3 hover:text-ink-2"
            }`}
          >
            {p.actor}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-rule-soft bg-paper-2 p-5">
        <div className="scroll-x">
          <code className="mono block whitespace-pre text-[12px] leading-relaxed text-ink-2">{c.query}</code>
        </div>
        <div className="mt-5 flex items-center gap-2.5 rule-soft pt-4">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: c.allowed ? "var(--color-teal)" : "var(--color-clay)" }}
          />
          <span
            className="mono text-[12px] uppercase tracking-[0.12em]"
            style={{ color: c.allowed ? "var(--color-teal)" : "var(--color-clay)" }}
          >
            {c.allowed ? "rows returned" : "zero rows"}
          </span>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{c.why}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ swipe deck */

const CARDS = [
  { name: "Ana", role: "Photographer", tags: ["editorial", "35mm", "Los Angeles"], accent: "var(--color-clay)" },
  { name: "Malik", role: "Stylist", tags: ["archive", "menswear", "NYC"], accent: "var(--color-ochre)" },
  { name: "Yuki", role: "Model", tags: ["runway", "beauty", "Tokyo"], accent: "var(--color-teal)" },
];

export function SwipeDeck() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"left" | "right" | null>(null);
  const [matches, setMatches] = useState(0);

  const swipe = (d: "left" | "right") => {
    setDir(d);
    if (d === "right") setMatches((m) => m + 1);
    setTimeout(() => {
      setIndex((i) => (i + 1) % CARDS.length);
      setDir(null);
    }, 260);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[290px] w-[218px]">
        {[2, 1, 0].map((offset) => {
          const card = CARDS[(index + offset) % CARDS.length];
          const isTop = offset === 0;
          return (
            <div
              key={`${card.name}-${offset}`}
              className="absolute inset-0 rounded-2xl border bg-paper-2 p-4 transition-all"
              style={{
                transitionDuration: "260ms",
                borderColor: isTop ? card.accent : "var(--color-rule)",
                transform: isTop
                  ? dir === "left"
                    ? "translateX(-140%) rotate(-16deg)"
                    : dir === "right"
                    ? "translateX(140%) rotate(16deg)"
                    : "none"
                  : `translateY(${offset * 9}px) scale(${1 - offset * 0.045})`,
                opacity: isTop && dir ? 0 : 1 - offset * 0.28,
                zIndex: 3 - offset,
              }}
            >
              <div
                className="h-[150px] w-full rounded-xl"
                style={{ background: card.accent, opacity: 0.18 }}
              />
              <div className="mt-3.5 text-[16px] font-medium">{card.name}</div>
              <div className="mono text-[11.5px] text-ink-3">{card.role}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.tags.map((t) => (
                  <span key={t} className="rounded-full border border-rule-soft px-2 py-0.5 mono text-[9.5px] text-ink-3">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => swipe("left")}
          className="rounded-full border border-rule px-5 py-2 mono text-[11.5px] text-ink-3 transition-colors hover:text-ink"
        >
          pass
        </button>
        <button
          onClick={() => swipe("right")}
          className="rounded-full border px-5 py-2 mono text-[11.5px] transition-colors"
          style={{ borderColor: "var(--color-teal)", color: "var(--color-teal)" }}
        >
          collaborate
        </button>
      </div>
      <div className="mono mt-4 text-[11px] text-ink-3">
        {matches} right swipe{matches === 1 ? "" : "s"} · a match needs both sides
      </div>
    </div>
  );
}
