import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/ui";
import { SecurityDemo, SwipeDemo } from "@/components/melange-visuals";
import { Details } from "@/components/details";

export const metadata: Metadata = {
  title: "Melange",
  description:
    "An app for creative people to find collaborators, shipped on iPhone and web, with privacy enforced by the database itself.",
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
          DMs. I built an app for it, and shipped it on both iPhone and the web.
        </p>
      </header>

      <section className="rule py-12">
        <h2 className="text-[25px]">How it works</h2>
        <div className="prose mt-5">
          <p>
            Post what you&apos;re working on. Swipe through other people&apos;s projects. When you
            both say yes, a chat opens and you plan the shoot.
          </p>
        </div>
        <SwipeDemo />
      </section>

      <section className="rule py-12">
        <h2 className="text-[25px]">The interesting engineering</h2>
        <div className="prose mt-5">
          <p>
            Most apps have a server in the middle that decides what each user is allowed to see. This
            one doesn&apos;t. The iPhone app and the website both talk to the database directly.
          </p>
          <p>
            That&apos;s only safe if the <strong>database itself</strong> knows the rules — so
            that&apos;s where I put them. Every table checks who is asking before it returns
            anything.
          </p>
        </div>
        <SecurityDemo />
        <div className="prose">
          <p>
            The payoff: a bug in either app can&apos;t leak private messages, and a third app added
            later inherits the same guarantees for free.
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
            <strong>Where it stands:</strong> version 1.1, iOS build 10, still under active
            development. The app builds, the submission pipeline works and the store screenshots
            are done, but it isn&apos;t in the App Store yet.
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
