import type { Metadata } from "next";
import { Shell, Section, CaseHeader, Callout, StatRow, Table, Column } from "@/components/ui";
import { Stat } from "@/components/charts";
import { Architecture, RowLevelSecurity, SwipeDeck } from "@/components/melange-panels";

export const metadata: Metadata = {
  title: "Melange",
  description:
    "A creative-collaboration app shipped as a native iOS client and a Next.js web client over one Supabase backend, with authorisation enforced by Postgres row-level security rather than application code.",
};

export default function MelangePage() {
  return (
    <Shell>
      <CaseHeader
        kind="Product · iOS & web"
        title="Melange"
        lede={
          <p>
            A photographer needs a model. A model needs a stylist. A filmmaker needs a whole crew.
            Right now that happens in Instagram DMs. Melange is a place built for it — post what
            you&apos;re working on, swipe, match, and message to plan the shoot.
          </p>
        }
        meta={[
          { label: "Clients", value: "iOS (Expo) + web (Next.js)" },
          { label: "Backend", value: "Supabase · Postgres" },
          { label: "Backend servers", value: "None" },
          { label: "Tests", value: "30 passing · CI on push" },
        ]}
        links={[
          { href: "https://melange-psi.vercel.app", label: "Web app" },
          { href: "https://github.com/quantraunak/Melange", label: "Source" },
        ]}
      />

      <Section eyebrow="Try it" title="The core loop">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:items-center">
          <SwipeDeck />
          <Column className="prose">
            <p>
              Post a collaboration — what you&apos;re looking for, where, paid or unpaid, up to five
              photos. Swipe through other people&apos;s. When you both swipe right you match, and
              the chat opens.
            </p>
            <p>
              Everything below works on <strong>both</strong> the phone and the web: profiles and
              portfolios, posts, the swipe feed with search and blocking, matching, live chat with
              unread counts that stay in sync across devices, events with RSVPs, and reviews after a
              collaboration. iOS adds native swipe gestures and push notifications.
            </p>
          </Column>
        </div>
      </Section>

      <Section eyebrow="Architecture" title="No backend server">
        <Column className="prose">
          <p>
            The interesting decision here is what <em>isn&apos;t</em> in the system. There is no API
            layer. Both clients hold a Supabase session and query Postgres directly — which is only
            safe if the database itself decides what each user may read and write.
          </p>
        </Column>
        <div className="mt-9">
          <Architecture />
        </div>
      </Section>

      <Section eyebrow="Authorisation" title="The database is the security boundary">
        <Column className="prose">
          <p>
            Every table has row-level security enabled and policies written against{" "}
            <code>auth.uid()</code>. A malicious client can send any query it likes; the answer it
            gets back is filtered by Postgres before it leaves the server.
          </p>
        </Column>
        <div className="mt-9">
          <RowLevelSecurity />
        </div>
        <Callout tone="note" title="Why this matters more than it sounds">
          <p>
            Client-side filtering is advisory — it protects the UI, not the data. Moving
            authorisation into the database means a bug in either client cannot leak another
            user&apos;s messages, and adding a third client later inherits the same guarantees for
            free rather than reimplementing them.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Schema" title="Five migrations, run in order">
        <Table
          columns={["migration", "what it adds"]}
          rows={[
            ["01_core.sql", "Accounts, profiles, posts, swipes, matches, messages"],
            ["02_safety.sql", "Blocking, reporting, push tokens, unread tracking"],
            ["03_events.sql", "Events, vibe tags, portfolios"],
            ["04_reviews.sql", "Reviews, social links, feed ranking"],
            ["05_ranking.sql", "Analytics, verified badges, improved ranking, realtime chat"],
          ]}
        />
        <Column className="prose mt-7 text-[15px]">
          <p>
            Each file is idempotent, so any of them can be re-run safely. They were previously six
            loose <code>.sql</code> files sitting at the repository root with names like{" "}
            <code>supabase_schema_v4.sql</code>; reorganising them into an ordered, named sequence
            is the difference between a schema someone else can apply and one only I could.
          </p>
        </Column>
      </Section>

      <Section eyebrow="Shipping" title="What Apple actually requires">
        <Column className="prose">
          <p>
            Any app with user-generated content has to clear a specific safety bar before review.
            All of it is built: reporting and blocking for users, posts and messages; a privacy
            policy and terms; in-app account deletion; an 18+ age gate at signup; and a monitored
            contact address for moderation.
          </p>
        </Column>
        <div className="mt-9">
          <StatRow>
            <Stat value="2" label="shipped clients" />
            <Stat value="5" label="schema migrations" />
            <Stat value="30" label="tests passing" tone="good" />
            <Stat value="1" label="edge function" />
            <Stat value="0" label="backend servers" tone="good" />
            <Stat value="RLS" label="on every table" tone="good" />
          </StatRow>
        </div>
        <Callout tone="warn" title="Where it actually stands">
          <p>
            The app builds and the submission pipeline works, but it is{" "}
            <strong>not submitted yet</strong> — screenshots are the main thing missing. Travel mode
            and Shoot Diary are designed but unbuilt. The repository&apos;s{" "}
            <code>docs/STATUS.md</code> carries the real numbers and what is blocking launch,
            without spin.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Engineering" title="What I would call the real work">
        <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
          {[
            [
              "Cross-device state",
              "Unread counts have to agree whether you read a message on the phone or the web. They are derived in Postgres and pushed over realtime, rather than tracked per-client where the two would drift.",
            ],
            [
              "One schema, two clients",
              "Both apps share a database, so a migration has to land without breaking a build already on someone's phone. Additive migrations, and clients tolerant of columns they do not know about.",
            ],
            [
              "Push without a server",
              "A single Deno edge function subscribes to new matches and messages and fans out Expo push notifications — the only server-side code in the system.",
            ],
            [
              "Tests that survived the cleanup",
              "Thirty vitest cases over review aggregation, unread bookkeeping and config validation, running in CI on every push. They existed only on my machine until recently, which meant the published repository looked untested.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rule-soft pt-5">
              <h3 className="text-[15.5px] font-medium">{title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{body}</p>
            </div>
          ))}
        </div>
      </Section>
    </Shell>
  );
}
