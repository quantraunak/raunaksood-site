"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/work/quant", label: "leakprobe" },
  { href: "/work/reasoning", label: "LLM reasoning" },
  { href: "/work/melange", label: "Melange" },
  { href: "/writing/testing-for-leakage", label: "Writing" },
];

export function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <nav className="border-b border-rule-soft">
      <div className="flex w-full items-center justify-between gap-6 px-6 py-4 sm:px-10">
        {/* The home page already says the name in the hero; repeating it in the
            bar puts it on screen twice. */}
        {onHome ? (
          <span className="tech text-ink-3">Raunak Sood</span>
        ) : (
          <Link href="/" className="tech text-ink-2 transition-colors hover:text-[var(--color-sea)]">
            Raunak&nbsp;Sood
          </Link>
        )}
        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`tech whitespace-nowrap transition-colors ${
                  active ? "text-[var(--color-sea)]" : "text-ink-3 hover:text-[var(--color-sea)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
