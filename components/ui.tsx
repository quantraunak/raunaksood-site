import Link from "next/link";

/** Reading column. Narrow on purpose — long lines are the enemy of "easy to read". */
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[680px] px-6 sm:px-8">{children}</div>;
}

/** Figures break out of the reading column, but never to the viewport edge. */
export function Wide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1000px] px-6 sm:px-8 ${className}`}>{children}</div>;
}

export function Column({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
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
    <section className={`rule py-14 sm:py-16 ${className}`}>
      {eyebrow && <div className="label mb-3">{eyebrow}</div>}
      {title && <h2 className="mb-7 text-[24px] leading-snug sm:text-[27px]">{title}</h2>}
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
    <header className="pb-12 pt-14 sm:pt-20">
      <Link href="/" className="text-[14px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
        ← Index
      </Link>
      <div className="label mt-10">{kind}</div>
      <h1 className="mt-3 text-[clamp(30px,4.6vw,42px)] leading-[1.12]">{title}</h1>
      <div className="lede prose mt-5">{lede}</div>

      <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="text-[12.5px] text-ink-3">{m.label}</dt>
            <dd className="mt-1 text-[14px] text-ink-2">{m.value}</dd>
          </div>
        ))}
      </dl>

      {links && links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="link text-[15px]">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

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
    <div className="my-8 rounded-lg bg-paper-2 p-6">
      {title && (
        <div className="mb-2 text-[12.5px] font-medium uppercase tracking-[0.07em]" style={{ color }}>
          {title}
        </div>
      )}
      <div className="prose">{children}</div>
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3">{children}</div>;
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
      <table className="w-full min-w-[480px] border-collapse text-[14px] tnum">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={c}
                className={`border-b border-rule pb-2.5 text-[12.5px] font-medium text-ink-3 ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className={highlight === r ? "bg-[var(--color-accent-soft)]" : ""}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`border-b border-rule-soft py-2.5 ${
                    i === 0 ? "pl-2 text-left text-ink-2" : "pr-2 text-right"
                  }`}
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
