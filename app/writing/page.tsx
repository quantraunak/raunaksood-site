import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Section } from "@/components/ui";
import { PAPERS, WRITING } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Posts and papers by Raunak Sood.",
};

export default function WritingIndex() {
  return (
    <Shell>
      <header className="pb-6 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <h1 className="mt-10 text-[34px] leading-[1.15] sm:text-[42px]">Writing</h1>
      </header>

      <Section>
        <h2 className="label mb-1">Posts</h2>
        <ul>
          {WRITING.map(([href, title, blurb, when]) => (
            <li key={href} className="border-b border-rule-soft py-4 last:border-0">
              <Link href={href} className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-[16.5px] leading-snug transition-colors group-hover:text-[var(--color-sea)]">
                    {title}
                  </div>
                  <div className="mono shrink-0 text-[12.5px] text-ink-3">{when}</div>
                </div>
                <div className="mt-1 text-[14.5px] leading-[1.6] text-ink-3">{blurb}</div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="label mb-1">Papers</h2>
        <ul>
          {PAPERS.map(([href, title, blurb, meta]) => (
            <li key={href} className="border-b border-rule-soft py-4 last:border-0">
              <a href={href} className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-[16.5px] leading-snug transition-colors group-hover:text-[var(--color-sea)]">
                    {title}
                  </div>
                  <div className="mono shrink-0 text-[12.5px] text-ink-3">{meta}</div>
                </div>
                <div className="mt-1 text-[14.5px] leading-[1.6] text-ink-3">{blurb}</div>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </Shell>
  );
}
