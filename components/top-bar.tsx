"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* A thin bar on every page: the way home on the left, the time in Los
   Angeles and the light/dark switch on the right. */

function useLosAngelesTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-label="Switch between light and dark" className="theme-toggle">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const time = useLosAngelesTime();
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[680px] items-center justify-between px-6 pt-6 sm:px-8">
      {pathname === "/" ? (
        <span />
      ) : (
        <Link href="/" className="tech text-ink-3 transition-colors hover:text-ink">
          Raunak Sood
        </Link>
      )}
      <div className="flex items-center gap-4">
        <span className="tech text-ink-3" suppressHydrationWarning>
          {time ? `Los Angeles ${time}` : " "}
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}
