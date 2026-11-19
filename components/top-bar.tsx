"use client";

/* The light/dark switch, top right on every page. */

export function TopBar() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[620px] justify-end px-6 pt-6 sm:px-8">
      <button type="button" onClick={toggle} aria-label="Switch between light and dark" className="theme-toggle">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
