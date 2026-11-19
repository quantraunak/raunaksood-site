/* The one block a non-technical reader needs on every project page:
   the idea, and what came of it. Mono labels on the left, hairlines between. */

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
    <dl className="summary">
      <div>
        <dt>Idea</dt>
        <dd>{proposed}</dd>
      </div>
      <div>
        <dt>Result</dt>
        <dd>{result}</dd>
      </div>
      {role && (
        <div>
          <dt>My part</dt>
          <dd>{role}</dd>
        </div>
      )}
    </dl>
  );
}
