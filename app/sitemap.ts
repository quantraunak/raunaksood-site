import type { MetadataRoute } from "next";

const BASE = "https://raunaksood.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/work/quant", "/work/reasoning", "/work/melange", "/writing/testing-for-leakage"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
