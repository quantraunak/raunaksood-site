import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/work/quant", "/work/reasoning", "/work/melange", "/work/cardinality", "/work/filings", "/writing", "/writing/testing-for-leakage", "/writing/the-schema-is-not-the-cost"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
