import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raunaksood.vercel.app"),
  title: {
    default: "Raunak Sood",
    template: "%s — Raunak Sood",
  },
  description:
    "Machine learning and quantitative research. M.S. Computer Science at USC, ML at Innovius Capital. Point-in-time equity research, LLM reasoning diagnostics, and shipped product.",
  authors: [{ name: "Raunak Sood" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: "Raunak Sood",
    description: "Machine learning and quantitative research.",
    url: "https://raunaksood.vercel.app",
    siteName: "Raunak Sood",
  },
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
};

const NAV = [
  { href: "/work/quant", label: "Equity research" },
  { href: "/work/reasoning", label: "LLM reasoning" },
  { href: "/work/melange", label: "Melange" },
];

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Raunak Sood",
  url: "https://raunaksood.vercel.app/",
  jobTitle: "Machine Learning Engineer & Quantitative Researcher",
  email: "mailto:raunak.sood@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Altos",
    addressRegion: "CA",
    addressCountry: "US",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of Southern California" },
    { "@type": "CollegeOrUniversity", name: "Santa Clara University" },
  ],
  worksFor: { "@type": "Organization", name: "Innovius Capital" },
  knowsAbout: [
    "Machine Learning",
    "Large Language Models",
    "Quantitative Finance",
    "Portfolio Optimization",
    "Deep Learning",
  ],
  sameAs: ["https://github.com/quantraunak", "https://www.linkedin.com/in/raunak-sood"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..500&family=Inter:wght@400;450;500;550&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23a06d26'/%3E%3Ctext x='50' y='71' font-size='58' text-anchor='middle' font-family='Georgia,serif' fill='%23f7f5f0'%3ER%3C/text%3E%3C/svg%3E"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--color-paper)_86%,transparent)] border-b border-rule-soft">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-3.5 sm:px-8">
        <Link href="/" className="serif text-[17px] hover:text-ochre transition-colors">
          Raunak&nbsp;Sood
        </Link>
        <div className="scroll-x flex items-center gap-5 mono text-[11.5px] text-ink-2">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-ochre transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1080px] px-6 sm:px-8">
      <div className="rule flex flex-wrap items-baseline justify-between gap-4 py-8 mono text-[11.5px] text-ink-3">
        <span>© {new Date().getFullYear()} Raunak Sood · Los Altos, California</span>
        <span className="flex flex-wrap gap-5">
          <a href="mailto:raunak.sood@gmail.com" className="hover:text-ochre transition-colors">
            email
          </a>
          <a href="https://github.com/quantraunak" className="hover:text-ochre transition-colors">
            github
          </a>
          <a href="https://www.linkedin.com/in/raunak-sood" className="hover:text-ochre transition-colors">
            linkedin
          </a>
          <a href="/Raunak-Sood-Resume.pdf" className="hover:text-ochre transition-colors">
            résumé
          </a>
        </span>
      </div>
    </footer>
  );
}
