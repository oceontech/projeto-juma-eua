import type { MetadataRoute } from "next";

const BASE = "https://juma-agro-eua.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/kmep-ultra", "/aminosan"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));
}
