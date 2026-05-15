import type { MetadataRoute } from "next";
import { getPostSlugs, getSalaSlugs } from "@/lib/wordpress";
import { getSiteUrl } from "@/lib/site-url";

const BASE_URL = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, salaSlugs] = await Promise.all([
    getPostSlugs(),
    getSalaSlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/salas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const salaPages: MetadataRoute.Sitemap = salaSlugs.map((slug) => ({
    url: `${BASE_URL}/salas/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...salaPages];
}
