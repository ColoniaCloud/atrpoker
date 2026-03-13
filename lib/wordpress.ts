import type {
  WPPost,
  WPSala,
  WPCategory,
  WPMedia,
  WPUser,
  WPJWTResponse,
  PaginatedResponse,
} from "./types";

const WP_URL = process.env.WORDPRESS_URL || "https://atrpoker.com";
const API_BASE = `${WP_URL}/wp-json/wp/v2`;

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function wpFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`WP API error: ${res.status} ${res.statusText} — ${url}`);
  }

  return res.json() as Promise<T>;
}

// ─── Posts (Entradas) ────────────────────────────────────────────────────────

export async function getPosts({
  page = 1,
  perPage = 10,
  categoryId,
  categorySlug,
  search,
}: {
  page?: number;
  perPage?: number;
  categoryId?: number;
  categorySlug?: string;
  search?: string;
} = {}): Promise<PaginatedResponse<WPPost>> {
  const params = new URLSearchParams({
    _embed: "1",
    page: String(page),
    per_page: String(perPage),
    status: "publish",
  });

  if (categoryId) params.set("categories", String(categoryId));
  if (search) params.set("search", search);

  // Si se pasa slug de categoría, primero resolvemos el ID
  if (categorySlug && !categoryId) {
    const cat = await getCategoryBySlug(categorySlug);
    if (cat) params.set("categories", String(cat.id));
  }

  const url = `/posts?${params}`;
  const fullUrl = `${API_BASE}${url}`;

  const res = await fetch(fullUrl, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 300, tags: ["posts"] },
  });

  if (!res.ok) {
    throw new Error(`WP API error: ${res.status}`);
  }

  const items = (await res.json()) as WPPost[];
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  return { items, total, totalPages, page, perPage };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const posts = await wpFetch<WPPost[]>(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=1&status=publish`,
      { next: { revalidate: 3600, tags: [`post-${slug}`] } }
    );
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await wpFetch<{ slug: string }[]>(
    `/posts?per_page=100&status=publish&_fields=slug`,
    { next: { revalidate: 3600 } }
  );
  return posts.map((p) => p.slug);
}

// ─── Categorías ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>(`/categories?per_page=100`, {
    next: { revalidate: 3600, tags: ["categories"] },
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<WPCategory | null> {
  try {
    const cats = await wpFetch<WPCategory[]>(
      `/categories?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );
    return cats[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Salas (Custom Post Type) ────────────────────────────────────────────────

export async function getSalas({
  page = 1,
  perPage = 12,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<PaginatedResponse<WPSala>> {
  const params = new URLSearchParams({
    _embed: "1",
    page: String(page),
    per_page: String(perPage),
    status: "publish",
  });

  const fullUrl = `${WP_URL}/wp-json/wp/v2/salas?${params}`;

  const res = await fetch(fullUrl, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600, tags: ["salas"] },
  });

  if (!res.ok) {
    // Si el CPT no está registrado aún, devolver vacío sin lanzar error
    if (res.status === 404) return { items: [], total: 0, totalPages: 0, page, perPage };
    throw new Error(`WP API error: ${res.status}`);
  }

  const items = (await res.json()) as WPSala[];
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  return { items, total, totalPages, page, perPage };
}

export async function getSalaBySlug(slug: string): Promise<WPSala | null> {
  try {
    const salas = await fetch(
      `${WP_URL}/wp-json/wp/v2/salas?slug=${encodeURIComponent(slug)}&_embed=1&status=publish`,
      { next: { revalidate: 3600, tags: [`sala-${slug}`] } }
    );
    if (!salas.ok) return null;
    const data = (await salas.json()) as WPSala[];
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSalaSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/salas?per_page=100&status=publish&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { slug: string }[];
    return data.map((s) => s.slug);
  } catch {
    return [];
  }
}

// ─── Media ───────────────────────────────────────────────────────────────────

export async function getMedia(id: number): Promise<WPMedia | null> {
  try {
    return wpFetch<WPMedia>(`/media/${id}`, { next: { revalidate: 86400 } });
  } catch {
    return null;
  }
}

// ─── Autenticación con WordPress JWT ────────────────────────────────────────
// Requiere plugin: JWT Authentication for WP REST API

export async function wpLogin(
  username: string,
  password: string
): Promise<WPJWTResponse | null> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json() as Promise<WPJWTResponse>;
  } catch {
    return null;
  }
}

export async function validateWPToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getWPCurrentUser(token: string): Promise<WPUser | null> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/me?context=edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<WPUser>;
  } catch {
    return null;
  }
}

// ─── Utilidades de imagen ────────────────────────────────────────────────────

export function getFeaturedImageUrl(
  post: WPPost | WPSala,
  size: string = "large"
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.[size]?.source_url ?? media.source_url;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-UY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
