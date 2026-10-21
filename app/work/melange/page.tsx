import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { RankingBreakdown } from "@/components/melange-visuals";
import { Details } from "@/components/details";
import { Contribution } from "@/components/contribution";

export const metadata: Metadata = {
  title: "Melange",
  description:
    "Small nights for people who make things. An AI composes who sits with whom from the work people make, and every night is a randomised test of whether it helps.",
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
          Small nights for people who make things: a host, a place, a start time, and the people
          there. The question I care about is the one every host guesses at — who should sit
          with whom — so Melange answers it with a model, and checks the answer at every night.
        </p>
        <Contribution
          proposed="Seat each night with an AI that reads taste from the work people make, and randomise half of every night to random seating, so the effect is measured rather than assumed."
          result="Live on the App Store and the web; nine releases, seven of them in twelve days. The composer runs in production: on real profile data it seated tables with 0.77–0.85 taste similarity against 0.64–0.69 for random seating, across three runs. Whether that turns into more people connecting is what the first nights will measure. About a dozen accounts so far."
        />
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">Why nights, not swipes</h2>
        <div className="prose mt-5">
          <p>
            Melange started as swipe-to-match for creative collaborators. Research said that
            wouldn&apos;t hold: a free collaboration has nothing to build a business on, Instagram
            already makes the introduction, and the apps that tried had stalled.
          </p>
          <p>
            So I studied about fifty consumer social and in-person companies from 2023 to 2026.
            The ones that lasted were built around something that repeats in real life — Timeleft&apos;s
            dinners, Strava&apos;s run clubs — and kept content of you and your friends private.
            The ones that faded had one clever mechanic and no reason to come back. Melange is now
            built around nights; the app is where a night continues.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Who should sit together</h2>
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
            <strong>Tables.</strong> The composer seats whole tables, not pairs. Its objective is
            each person&apos;s average chemistry with their tablemates passed through a concave
            curve, so lifting the person who&apos;s worst off counts for more than making a good
            table slightly better. Blocked pairs are never seated together. It&apos;s a local
            search — random starts and swaps — that finishes in milliseconds at this size.
          </p>
          <p>
            <strong>The test.</strong> Every night, attendees are split at random: half seated by
            the composer, half at random, all in the same room, with nobody told which half
            they&apos;re in. Afterwards the arms are compared on mutual hearts, conversations still
            going a week later, and coming back to another night.
          </p>
          <p>
            The first production run caught a flaw in my own design. With thirteen people, each
            arm got exactly one table — so the composer had no choice to make, and its
            &ldquo;AI&rdquo; table scored worse than the random one. Tables now shrink until each
            arm has at least two. After the fix, the AI tables beat random on every run.
          </p>
        </div>
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Privacy the database enforces</h2>
        <div className="prose mt-5">
          <p>
            Both apps talk straight to Postgres with a public key, so every rule has to live in
            the database. After a night you can quietly heart anyone who was there; you only find
            out if it was mutual. Those hearts sit in a table with row-level security on and no
            read policy at all — the only way in is a function that answers when a heart is
            mutual. My first design reused the app&apos;s general hearts table, which notifies on
            every insert, and would have told everyone about every one-way heart.
          </p>
          <p>
            A night&apos;s photos live in a private bucket whose read rule derives membership from
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
            read a night&apos;s chat, does a forged upload path get through, does a second invite
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
            Between nights, Discover ranks people and projects with one Postgres function: eight
            weighted terms, no service to call. It&apos;s the older half of the system and still
            the simplest thing that works at this size.
          </p>
        </div>
        <RankingBreakdown />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">Where it stands</h2>
        <div className="prose mt-5">
          <p>
            Live on the App Store (1.8, with 1.9 next) and the web. About a dozen accounts — this
            is a working product, not a traction story yet. The composer, the experiment and the
            learner are deployed; the first measured result comes from the first real nights.
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
