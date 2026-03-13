import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://atrpoker.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/streaming/", "/sin-acceso", "/login", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
