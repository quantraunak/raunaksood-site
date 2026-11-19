import type { Metadata } from "next";
import Link from "next/link";
import { Shell, PageHeader } from "@/components/ui";
import { PAPERS, WRITING } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  alternates: { canonical: "/writing" },
  openGraph: { title: "Writing", url: "/writing" },
  description: "Posts and papers by Raunak Sood.",
};

function Item({ title, blurb, meta }: { title: string; blurb: string; meta: string }) {
  return (
    <>
      <span className="min-w-0">
        <span className="row-name">{title}</span>
        <span className="mt-1 block text-[14.5px] leading-[1.6] text-ink-2">{blurb}</span>
      </span>
      <span className="tech shrink-0 whitespace-nowrap pt-[3px] text-ink-3">{meta}</span>
    </>
  );
}

export default function WritingIndex() {
  return (
    <Shell>
      <PageHeader title="Writing" />

      <section>
        <h2 className="sec">
          <span>Essays</span>
        </h2>
        <ul>
          {WRITING.map(([href, title, blurb, when]) => (
            <li key={href}>
              <Link href={href} className="row">
                <Item title={title} blurb={blurb} meta={when} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="sec">
          <span>Papers</span>
        </h2>
        <ul>
          {PAPERS.map(([href, title, blurb, meta]) => (
            <li key={href}>
              <a href={href} className="row">
                <Item title={title} blurb={blurb} meta={meta} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
