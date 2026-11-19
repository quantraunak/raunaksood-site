import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Raunak Sood",
    template: "%s | Raunak Sood",
  },
  description:
    "Machine learning engineer on the investment platform at Innovius Capital and M.S. Computer Science student at USC. Ranking models, LLM agents and evaluation, an open-source leakage test, and an app on the App Store.",
  authors: [{ name: "Raunak Sood" }],
  openGraph: {
    type: "profile",
    title: "Raunak Sood",
    description: "Machine learning engineer. Ranking models, LLM agents and evaluation, and shipped product.",
    siteName: "Raunak Sood",
  },
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Raunak Sood",
  url: `${SITE_URL}/`,
  jobTitle: "Machine Learning Engineer",
  email: "mailto:raunak.sood@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550&family=JetBrains+Mono:wght@400;500&display=swap"
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
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[600px] px-6 pb-12 text-[13px] text-ink-3">
      © {new Date().getFullYear()} Raunak Sood
    </footer>
  );
}
