import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { RankingBreakdown } from "@/components/melange-visuals";
import { Details } from "@/components/details";
import { Contribution } from "@/components/contribution";

export const metadata: Metadata = {
  title: "Melange",
  description:
    "Where creative people find their next collaboration. An AI learns taste from the work people make and suggests who to work with, checked against random suggestions.",
};

export default function MelangePage() {
  return (
    <Shell>
      <header className="pb-10 pt-14 sm:pt-20">
        <Link href="/" className="text-[15px] text-ink-3 transition-colors hover:text-[var(--color-sea)]">
          ← Back
        </Link>
        <div className="label mt-10">Product · TypeScript, iOS, Postgres, CLIP</div>
        <h1 className="mt-3 text-[34px] leading-[1.15] sm:text-[42px]">Melange</h1>
        <p className="mt-6 text-[19.5px] leading-[1.65] text-ink-2">
          Where creative people find their next collaboration. Photographers, models, stylists and
          other creatives find each other nearby, see who&apos;s into their work, and make something
          together. The hard question is who to show you — so an AI learns taste from the work
          people make, and its suggestions are checked against random ones.
        </p>
        <Contribution
          proposed="An app for creative people to find collaborators, with an AI that learns taste from the work people make and suggests who to work with, measured against random suggestions."
          result="Live on the App Store and the web; nine releases, seven of them in twelve days. In a production test, the AI's suggestions matched taste far better than random ones (0.77–0.85 similarity vs 0.64–0.69). About a dozen accounts so far."
        />
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">What it does</h2>
        <div className="prose mt-5">
          <p>
            Discover is the front door: swipe through creatives and projects near you, heart the
            work you like, and when it&apos;s mutual a conversation opens. Around that sit the
            things a collaboration needs — events where people meet in person, with a group chat
            and a private photo roll for the people who went, and credits that record who made
            what.
          </p>
          <p>
            Some of that came from research. I studied about fifty consumer social companies from
            2023 to 2026; the ones that lasted gave people a reason to come back in real life and
            kept content of you and your friends private. Events and private photos are Melange&apos;s
            version of that.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Who you should work with</h2>
        <div className="prose mt-5">
          <p>
            <strong>Taste.</strong> Each member&apos;s taste is the average CLIP embedding of the
            images they&apos;ve posted and hearted. The model is open-source and runs as a batch
            job on a laptop GPU, so no member&apos;s photos go to a third party, and it never sees
            a question about anyone&apos;s looks — only what they make and like.
          </p>
          <p>
            <strong>Pairs.</strong> A pair score combines taste similarity, whether two roles make
            each other&apos;s work possible (a photographer and a stylist, not two photographers),
            and shared interests. The weights start as a prior and are refit from what actually
            happens: whether two people hearted each other afterwards.
          </p>
          <p>
            <strong>Groups.</strong> At an event, a composer uses the score to seat whole tables,
            not just pairs. Its objective is
            each person&apos;s average chemistry with their tablemates passed through a concave
            curve, so lifting the person who&apos;s worst off counts for more than making a good
            table slightly better. Blocked pairs are never seated together. It&apos;s a local
            search — random starts and swaps — that finishes in milliseconds at this size.
          </p>
          <p>
            <strong>The test.</strong> The AI is checked against random choices instead of being
            assumed to help. At an event, attendees are split at random: half seated by the
            composer, half at random, with nobody told which half they&apos;re in. Afterwards the
            halves are compared on mutual hearts, conversations still going a week later, and
            coming back.
          </p>
          <p>
            The first production run caught a flaw in my own design. With thirteen people, each
            half got exactly one table — so the composer had no choice to make, and its
            &ldquo;AI&rdquo; table scored worse than the random one. Tables now shrink until each
            half has at least two. After the fix, the AI&apos;s groups beat random on every run.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Privacy the database enforces</h2>
        <div className="prose mt-5">
          <p>
            Both apps talk straight to Postgres with a public key, so every rule has to live in
            the database. After an event you can quietly heart anyone who was there; you only find
            out if it was mutual. Those hearts sit in a table with row-level security on and no
            read policy at all — the only way in is a function that answers when a heart is
            mutual. My first design reused the app&apos;s general hearts table, which notifies on
            every insert, and would have told everyone about every one-way heart.
          </p>
          <p>
            An event&apos;s photos live in a private bucket whose read rule derives membership from
            the file&apos;s path, so they&apos;re visible only to the host and the people who went.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Testing against production without changing it</h2>
        <div className="prose mt-5">
          <p>
            Every migration since October runs first inside <span className="mono">BEGIN … ROLLBACK</span>{" "}
            against the live database, with tests that impersonate real roles: can an outsider
            read an event&apos;s chat, does a forged upload path get through, does a second invite
            code get refused. Nothing persists, and the checks run on real data instead of a
            fixture.
          </p>
          <p>
            That caught a policy someone had added in the dashboard — present in production, in
            no migration — that let signed-out visitors read every profile. The schema in the repo
            and the database had quietly drifted apart, and nothing else would have said so.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Discover is a query</h2>
        <div className="prose mt-5">
          <p>
            Discover&apos;s feed is ranked by one Postgres function: eight weighted terms, no
            service to call. Adding the taste score to it as a ninth is the next step.
          </p>
        </div>
        <RankingBreakdown />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Where it stands</h2>
        <div className="prose mt-5">
          <p>
            Live on the App Store (1.8, with 1.9 next) and the web. About a dozen accounts — this
            is a working product, not a traction story yet. The taste model, the composer and the
            experiment are deployed; the first measured result comes from the first real events.
          </p>
        </div>

        <Details summary="Technical detail, for readers who want it">
          <div className="prose">
            <p>
              Expo / React Native for iOS and Next.js for web, one Supabase Postgres behind both.
              Authorisation in row-level security and security-definer functions; realtime for
              chat; two Deno edge functions (push notifications, and the composer, which runs as
              the calling host so the database decides who may seat a room). Taste vectors in
              pgvector, computed with open_clip ViT-B/32 on Apple silicon. 26 ordered, idempotent
              migrations; 57 automated tests, including the composer&apos;s.
            </p>
          </div>
        </Details>

        <div className="mt-9 flex flex-wrap gap-6 text-[16px]">
          <a href="https://melange-psi.vercel.app" className="link">Melange</a>
          <a href="https://apps.apple.com/app/id6774481477" className="link">App Store</a>
          <a href="https://github.com/quantraunak/Melange" className="link">Code on GitHub</a>
        </div>
      </section>
    </Shell>
  );
}
