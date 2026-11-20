import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { SITE_URL } from "@/lib/site";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  colorScheme: "light dark" as const,
};

/* Set the theme before first paint: the saved choice, else the system's. */
const THEME_SCRIPT =
  '(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t}catch(e){d.dataset.theme="light"}})()';

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
  twitter: { card: "summary_large_image" },
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
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
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
        <TopBar />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
