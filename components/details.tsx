"use client";

import { useState } from "react";

/** Collapsed by default: depth is available without being in the way. */
export function Details({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2.5 text-[15.5px] text-ink-3 transition-colors hover:text-[var(--color-sea)]"
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
          aria-hidden
        >
          ›
        </span>
        {summary}
      </button>
      {open && <div className="mt-5 border-l-2 border-rule pl-5">{children}</div>}
    </div>
  );
}
