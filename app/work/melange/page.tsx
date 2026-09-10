import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { RankingBreakdown, SwipeDemo } from "@/components/melange-visuals";
import { Details } from "@/components/details";

export const metadata: Metadata = {
  title: "Melange",
  description:
    "An app for creative people to find collaborators. Shipped on iPhone and web against one Postgres, with the feed ranked by a query and matches deduplicated by the database.",
};

export default function MelangePage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Product · TypeScript, iOS</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">Melange</h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          A photographer needs a model. A model needs a stylist. Right now that happens in Instagram
          DMs. I built an app for it — on the App Store and the web, one database behind both — and
          the part that took the thinking was deciding what each person sees first.
        </p>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">What a match actually is</h2>
        <div className="prose mt-5">
          <p>
            Post what you&apos;re working on, swipe through other people&apos;s projects, and when
            you both say yes a chat opens. That&apos;s the product. Underneath, a match is a row
            that neither app is allowed to decide on its own.
          </p>
        </div>
        <SwipeDemo />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The feed is a ranking problem</h2>
        <div className="prose mt-5">
          <p>
            A matching app is only as good as the order it shows things in. With a handful of
            posts you can show everything; past that you have to decide what someone sees first,
            and a bad ordering kills the product before anyone notices the product.
          </p>
          <p>
            The whole ranker is one Postgres function. Eight weighted terms, no service to call,
            no model to deploy — the feed is a query.
          </p>
        </div>

        <RankingBreakdown />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Embeddings without an inference server</h2>
        <div className="prose mt-5">
          <p>
            One of those terms compares the text of your profile against the text of a post. The
            obvious way is to call an embedding API on every write, which means an API key, a
            bill, a network hop in the middle of a database trigger, and a failure mode where
            posts save but arrive unsearchable.
          </p>
          <p>
            Instead the embedding is computed in SQL. Each word is hashed into one of 128 buckets,
            the counts are L2-normalised, and similarity is a cosine between two{" "}
            <span className="mono">REAL[]</span> columns. It&apos;s the hashing trick, which is
            older and dumber than a neural embedding and has the property that matters here:
            it&apos;s a pure function with no dependencies, so a trigger can maintain it on every
            insert and update and it can never fail separately from the write.
          </p>
          <p>
            It doesn&apos;t understand that &ldquo;filmmaker&rdquo; and &ldquo;cinematographer&rdquo;
            are related, and a real embedding would. That&apos;s the trade, made deliberately: at
            this size the recency and role terms carry the ranking anyway, and the version that
            needs no key is the version that still runs in a year.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">A hole in the storage rules</h2>
        <div className="prose mt-5">
          <p>
            Auditing the schema against the live database, I found the upload policy on the media
            bucket checked only that you were signed in — not that you were writing to your own
            folder. Any logged-in user could have written into anyone else&apos;s path. Two more
            buckets had been created directly against production, outside migration tracking, with
            no ownership check at all.
          </p>
          <p>
            All three now require the path to start with your own user ID, and the buckets are
            declared in the schema file so a fresh install can&apos;t silently come up with the
            permissive version. The interesting part isn&apos;t the fix, which is four lines. It&apos;s
            that the schema in the repo and the database in production had quietly drifted apart,
            and nothing would have told me.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">What&apos;s built</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Sign-up, profiles and portfolios",
            "Swipe feed with search",
            "Matching and live chat",
            "Unread counts synced across devices",
            "Events with RSVPs",
            "Reviews after a collaboration",
            "Blocking and reporting",
            "Push notifications on iPhone",
          ].map((f) => (
            <div key={f} className="flex items-start gap-3 text-[16.5px] text-ink-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--color-kelp)" }} />
              {f}
            </div>
          ))}
        </div>

        <div className="prose mt-8">
          <p>
            Everything above works on both the phone and the web, on one shared account. Thirty
            automated tests run on every change.
          </p>
          <p>
            <strong>Where it stands:</strong> 1.0 is live on the App Store. 1.1 is in Prepare for
            Submission — iOS build 10, screenshots captured and uploading through fastlane. Nine
            accounts and effectively no usage; the{" "}
            <a
              href="https://github.com/quantraunak/Melange/blob/main/docs/STATUS.md"
              className="link"
            >
              status doc
            </a>{" "}
            says so in its first paragraph and gives the real numbers.
          </p>
        </div>

        <Details summary="Technical detail, for readers who want it">
          <div className="prose">
            <p>
              Expo / React Native for iOS, Next.js for web, Supabase Postgres shared between them.
              Authorisation via row-level security policies written against auth.uid(); realtime
              subscriptions for chat and unread counts; a single Deno edge function fans out Expo
              push notifications on new matches and messages. Five ordered, idempotent schema
              migrations. Vitest in CI on every push.
            </p>
          </div>
        </Details>

        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="https://melange-psi.vercel.app" className="link">Try the web app</a>
          <a href="https://github.com/quantraunak/Melange" className="link">Code on GitHub</a>
        </div>
      </section>
    </Shell>
  );
}
