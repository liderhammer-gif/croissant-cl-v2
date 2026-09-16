import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/atelier-prive/", "/api/"]
    },
    sitemap: "https://croissant.cl/sitemap.xml",
    host: "https://croissant.cl"
  };
}
