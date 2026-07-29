import { getSiteUrl } from "./site-url";
import { SOCIAL_LINKS } from "@/components/SocialLinks";

// Helpers puros para armar objetos schema.org (JSON-LD). Cada página los serializa
// con <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

export function organizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ATRPoker",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.svg`,
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };
}

export function websiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ATRPoker",
    url: siteUrl,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function reviewSchema({
  salaName,
  rating,
  description,
  url,
}: {
  salaName: string;
  rating: number;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `Reseña de ${salaName}`,
    reviewBody: description,
    url,
    itemReviewed: {
      "@type": "Organization",
      name: salaName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Organization",
      name: "ATRPoker",
    },
  };
}

export function articleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName ?? "ATRPoker",
    },
    publisher: {
      "@type": "Organization",
      name: "ATRPoker",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/logo.svg`,
      },
    },
  };
}
