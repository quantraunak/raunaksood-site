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

export function SwipeDemo() {
  const [i, setI] = useState(0);
  const [gone, setGone] = useState<"l" | "r" | null>(null);
  const [likes, setLikes] = useState(0);

  const go = (d: "l" | "r") => {
    setGone(d);
    if (d === "r") setLikes((n) => n + 1);
    setTimeout(() => {
      setI((n) => (n + 1) % CARDS.length);
      setGone(null);
    }, 240);
  };

  return (
    <figure className="my-10">
      <div className="flex flex-col items-center rounded-xl border border-rule p-7">
        <div className="relative h-[250px] w-[190px]">
          {[2, 1, 0].map((off) => {
            const c = CARDS[(i + off) % CARDS.length];
            const top = off === 0;
            return (
              <div
                key={`${c.name}-${off}`}
                className="absolute inset-0 rounded-2xl border border-rule bg-white p-4"
                style={{
                  transitionDuration: "240ms",
                  transitionProperty: "transform, opacity",
                  transform: top
                    ? gone === "l"
                      ? "translateX(-130%) rotate(-14deg)"
                      : gone === "r"
                      ? "translateX(130%) rotate(14deg)"
                      : "none"
                    : `translateY(${off * 8}px) scale(${1 - off * 0.04})`,
                  opacity: top && gone ? 0 : 1 - off * 0.3,
                  zIndex: 3 - off,
                }}
              >
                <div className="h-[140px] w-full rounded-xl" style={{ background: c.color, opacity: 0.16 }} />
                <div className="mt-3 text-[17px]">{c.name}</div>
                <div className="text-[14px] text-ink-3">{c.role}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => go("l")}
            className="rounded-full border border-rule px-6 py-2.5 text-[15px] text-ink-2 transition-colors hover:border-ink-3"
          >
            Pass
          </button>
          <button
            type="button"
            onClick={() => go("r")}
            className="rounded-full border px-6 py-2.5 text-[15px] transition-colors"
            style={{ borderColor: "var(--color-kelp)", color: "var(--color-kelp)" }}
          >
            Interested
          </button>
        </div>
        <div className="mt-4 text-[14px] text-ink-3">
          {likes === 0 ? "Try it" : `${likes} liked — a match needs both people to say yes`}
        </div>
      </div>
      <figcaption className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
        <span className="font-medium text-ink">What to look at: </span>
        the core loop of the app, working. Swipe through people, and when two people both say yes, a
        chat opens.
      </figcaption>
    </figure>
  );
}
