"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/work/quant", label: "Equity research" },
  { href: "/work/reasoning", label: "LLM reasoning" },
  { href: "/work/melange", label: "Melange" },
];

export function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-40 border-b border-rule-soft bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-6 py-3.5 sm:px-10 lg:px-14">
        {/* The home page already says the name in the hero; repeating it in the
            bar puts it on screen twice. */}
        {onHome ? (
          <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--color-sea)]" />
        ) : (
          <Link href="/" className="serif text-[17px] transition-colors hover:text-[var(--color-sea)]">
            Raunak&nbsp;Sood
          </Link>
        )}
        <div className="scroll-x flex items-center gap-6 mono text-[11.5px]">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap transition-colors ${
                  active ? "text-[var(--color-sea)]" : "text-ink-2 hover:text-[var(--color-sea)]"
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
