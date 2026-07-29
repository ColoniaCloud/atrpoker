import type { MetadataRoute } from "next";
import { getPostSlugs, getSalaSlugs, getCoachSlugs } from "@/lib/wordpress";
import { getSiteUrl } from "@/lib/site-url";
import { ESCUELA_SUBCATEGORIES } from "@/lib/types";

const BASE_URL = getSiteUrl();

const TABLAS_SLUGS = ["mid-stakes", "microlimites", "como-usar"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, salaSlugs, coachSlugs] = await Promise.all([
    getPostSlugs(),
    getSalaSlugs(),
    getCoachSlugs(),
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
    {
      url: `${BASE_URL}/academia`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
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

  const academiaPages: MetadataRoute.Sitemap = ESCUELA_SUBCATEGORIES.map((sub) => ({
    url: `${BASE_URL}/academia/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const coachPages: MetadataRoute.Sitemap = coachSlugs.map((slug) => ({
    url: `${BASE_URL}/coaches/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tablasPages: MetadataRoute.Sitemap = TABLAS_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tablas/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...salaPages,
    ...academiaPages,
    ...coachPages,
    ...tablasPages,
  ];
}
