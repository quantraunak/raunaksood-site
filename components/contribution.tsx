/* The one block a non-technical reader needs on every project page:
   what was proposed, and what it produced. Two short lines, nothing else. */

export function Contribution({
  proposed,
  result,
  role,
}: {
  proposed: React.ReactNode;
  result: React.ReactNode;
  role?: React.ReactNode;
}) {
  return (
    <div className="mt-8 rounded-lg bg-paper-2 p-6">
      <dl className="space-y-4">
        <div>
          <dt className="text-[12.5px] font-medium uppercase tracking-[0.07em] text-ink-3">
            What I proposed
          </dt>
          <dd className="mt-1.5 text-[16.5px] leading-[1.6] text-ink">{proposed}</dd>
        </div>
        <div>
          <dt className="text-[12.5px] font-medium uppercase tracking-[0.07em] text-ink-3">
            What it produced
          </dt>
          <dd className="mt-1.5 text-[16.5px] leading-[1.6] text-ink">{result}</dd>
        </div>
        {role && (
          <div>
            <dt className="text-[12.5px] font-medium uppercase tracking-[0.07em] text-ink-3">
              My part
            </dt>
            <dd className="mt-1.5 text-[15.5px] leading-[1.6] text-ink-2">{role}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
