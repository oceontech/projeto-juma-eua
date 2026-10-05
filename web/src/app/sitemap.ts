import type { MetadataRoute } from "next";

const BASE = "https://juma-agro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/kmep", "/aminosan"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));
}
