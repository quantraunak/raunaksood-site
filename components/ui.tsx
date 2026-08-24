import Link from "next/link";

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1240px] px-7 sm:px-12 lg:px-16">{children}</div>;
}

/** Narrow column for reading; charts and tables break out of it deliberately. */
export function Column({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-[68ch] ${className}`}>{children}</div>;
}

export function Section({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rule py-16 sm:py-24 ${className}`}>
      {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
      {title && <h2 className="serif mb-9 text-[28px] leading-tight sm:text-[34px]">{title}</h2>}
      {children}
    </section>
  );
}

export function CaseHeader({
  kind,
  title,
  lede,
  meta,
  links,
}: {
  kind: string;
  title: string;
  lede: React.ReactNode;
  meta: { label: string; value: string }[];
  links?: { href: string; label: string }[];
}) {
  return (
    <header className="pb-14 pt-14 sm:pb-16 sm:pt-20">
      <Link href="/" className="mono text-[11.5px] text-ink-3 hover:text-[var(--color-sea)] transition-colors">
        ← index
      </Link>
      <div className="eyebrow mt-8">{kind}</div>
      <h1 className="serif mt-3 text-[clamp(34px,5.6vw,58px)] leading-[1.05]">{title}</h1>
      <div className="lede prose mt-6 max-w-[680px]">{lede}</div>
      <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="eyebrow">{m.label}</dt>
            <dd className="mono mt-1 text-[13px] text-ink-2">{m.value}</dd>
          </div>
        ))}
      </dl>
      {links && links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono text-[12.5px] text-[var(--color-sea)] border-b border-transparent hover:border-[var(--color-sea)] transition-colors"
            >
              {l.label} <span className="text-[10px] opacity-60">↗</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/** A claim the reader should not skim past. */
export function Callout({
  tone = "warn",
  title,
  children,
}: {
  tone?: "warn" | "note";
  title?: string;
  children: React.ReactNode;
}) {
  const color = tone === "warn" ? "var(--color-coral)" : "var(--color-kelp)";
  return (
    <div className="my-7 border-l-2 pl-5" style={{ borderColor: color }}>
      {title && (
        <div className="mono text-[11px] uppercase tracking-[0.16em] mb-2" style={{ color }}>
          {title}
        </div>
      )}
      <div className="prose text-[16px] leading-[1.7]">{children}</div>
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">{children}</div>;
}

export function Table({
  columns,
  rows,
  highlight,
}: {
  columns: string[];
  rows: (string | number | React.ReactNode)[][];
  highlight?: number;
}) {
  return (
    <div className="scroll-x">
      <table className="w-full min-w-[520px] border-collapse mono text-[12.5px] tnum">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={c}
                className={`eyebrow border-b border-rule pb-2.5 font-normal ${i === 0 ? "text-left" : "text-right"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr
              key={r}
              className={highlight === r ? "bg-[var(--color-accent-soft)]" : ""}
            >
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`border-b border-rule-soft py-2.5 whitespace-nowrap ${
                    i === 0 ? "text-left text-ink-2 pl-2" : "text-right pr-2"
                  } ${highlight === r ? "text-ink" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
