import type { MetadataRoute } from "next";

const BASE = "https://raunaksood.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/work/quant", "/work/reasoning", "/work/melange", "/work/cardinality", "/work/filings", "/writing/testing-for-leakage", "/writing/the-schema-is-not-the-cost"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
