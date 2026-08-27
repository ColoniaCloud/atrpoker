import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const BASE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/sin-acceso",
          "/login",
          "/api/",
          "/perfil/",
          "/debug-acf",
          "/video",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
