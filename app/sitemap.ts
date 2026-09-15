import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://croissant.cl";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/condiciones-horeca`, changeFrequency: "monthly", priority: 0.4 }
  ];
}
