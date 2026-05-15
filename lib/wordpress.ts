import type {
  WPPost,
  WPSala,
  WPCoach,
  WPCategory,
  WPMedia,
  WPUser,
  WPJWTResponse,
  PaginatedResponse,
  Progreso,
} from "./types";

const WP_URL = process.env.WORDPRESS_URL || "https://atr.academy";
const API_BASE = `${WP_URL}/wp-json/wp/v2`;

// ─── Fetch helper ─────────────────────────────────────────────────────────────

function wpAuthHeader(): Record<string, string> {
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) return {};
  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

async function wpFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...wpAuthHeader() },
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
  categoryIds,
  categorySlug,
  search,
}: {
  page?: number;
  perPage?: number;
  categoryId?: number;
  categoryIds?: number[];
  categorySlug?: string;
  search?: string;
} = {}): Promise<PaginatedResponse<WPPost>> {
  const params = new URLSearchParams({
    _embed: "1",
    page: String(page),
    per_page: String(perPage),
    status: "publish",
  });

  if (categoryIds && categoryIds.length > 0) {
    params.set("categories", categoryIds.join(","));
  } else if (categoryId) {
    params.set("categories", String(categoryId));
  }
  if (search) params.set("search", search);

  // Si se pasa slug de categoría, primero resolvemos el ID
  if (categorySlug && !categoryId && !categoryIds) {
    const cat = await getCategoryBySlug(categorySlug);
    if (cat) params.set("categories", String(cat.id));
  }

  const url = `/posts?${params}`;
  const fullUrl = `${API_BASE}${url}`;

  try {
    const res = await fetch(fullUrl, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300, tags: ["posts"] },
    });

    if (!res.ok) {
      console.error(`[getPosts] WP API error: ${res.status} ${res.statusText}`);
      return { items: [], total: 0, totalPages: 0, page, perPage };
    }

    const items = (await res.json()) as WPPost[];
    const total = Number(res.headers.get("X-WP-Total") ?? 0);
    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

    return { items, total, totalPages, page, perPage };
  } catch (err) {
    console.error("[getPosts] Failed to fetch posts:", err);
    return { items: [], total: 0, totalPages: 0, page, perPage };
  }
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

export async function getCategoryChildren(parentSlug: string): Promise<WPCategory[]> {
  try {
    const parent = await getCategoryBySlug(parentSlug);
    if (!parent) return [];
    return wpFetch<WPCategory[]>(`/categories?parent=${parent.id}&per_page=100`, {
      next: { revalidate: 3600, tags: ["categories"] },
    });
  } catch {
    return [];
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

  // Intentamos primero con el slug singular "sala", luego con "salas"
  const slugsToTry = ["sala", "salas"];
  let res: Response | null = null;

  for (const slug of slugsToTry) {
    const attempt = await fetch(`${WP_URL}/wp-json/wp/v2/${slug}?${params}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600, tags: ["salas"] },
    });
    if (attempt.ok) {
      res = attempt;
      break;
    }
  }

  if (!res || !res.ok) {
    if (!res || res.status === 404) return { items: [], total: 0, totalPages: 0, page, perPage };
    throw new Error(`WP API error: ${res.status}`);
  }

  const rawItems = (await res.json()) as WPSala[];
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  // Resolvemos IDs de imágenes ACF a objetos de media en paralelo.
  const items = await Promise.all(
    rawItems.map(async (sala) => {
      let updated = sala;

      const logo = sala.acf?.logo_entero;
      if (typeof logo === "number" && logo > 0) {
        const media = await getMedia(logo);
        if (media) {
          updated = {
            ...updated,
            acf: {
              ...updated.acf,
              logo_entero: { url: media.source_url, alt: media.alt_text, width: media.media_details?.width, height: media.media_details?.height },
            },
          };
        }
      }

      const icono = sala.acf?.icono_de_la_sala;
      if (typeof icono === "number" && icono > 0) {
        const media = await getMedia(icono);
        if (media) {
          updated = {
            ...updated,
            acf: {
              ...updated.acf,
              icono_de_la_sala: { url: media.source_url, alt: media.alt_text, width: media.media_details?.width, height: media.media_details?.height },
            },
          };
        }
      }

      return updated;
    })
  );

  return { items, total, totalPages, page, perPage };
}

export async function getSalaBySlug(slug: string): Promise<WPSala | null> {
  for (const cptSlug of ["sala", "salas"]) {
    try {
      const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/${cptSlug}?slug=${encodeURIComponent(slug)}&_embed=1&status=publish`,
        { next: { revalidate: 3600, tags: [`sala-${slug}`] } }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as WPSala[];
      if (data.length === 0) continue;

      let sala = data[0];

      // Resolve image IDs → media objects in parallel
      const logo = sala.acf?.logo_entero;
      const icono = sala.acf?.icono_de_la_sala;

      const [logoMedia, iconoMedia] = await Promise.all([
        typeof logo === "number" && logo > 0 ? getMedia(logo) : null,
        typeof icono === "number" && icono > 0 ? getMedia(icono) : null,
      ]);

      if (logoMedia) {
        sala = {
          ...sala,
          acf: {
            ...sala.acf,
            logo_entero: { url: logoMedia.source_url, alt: logoMedia.alt_text, width: logoMedia.media_details?.width, height: logoMedia.media_details?.height },
          },
        };
      }

      if (iconoMedia) {
        sala = {
          ...sala,
          acf: {
            ...sala.acf,
            icono_de_la_sala: { url: iconoMedia.source_url, alt: iconoMedia.alt_text, width: iconoMedia.media_details?.width, height: iconoMedia.media_details?.height },
          },
        };
      }

      return sala;
    } catch {
      continue;
    }
  }
  return null;
}

export async function getSalaSlugs(): Promise<string[]> {
  for (const cptSlug of ["sala", "salas"]) {
    try {
      const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/${cptSlug}?per_page=100&status=publish&_fields=slug`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { slug: string }[];
      if (data.length > 0) return data.map((s) => s.slug);
    } catch {
      continue;
    }
  }
  return [];
}

// ─── Coaches (Custom Post Type) ──────────────────────────────────────────────

export async function getCoaches(): Promise<WPCoach[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/coach?per_page=50&status=publish&_embed=1`,
      { next: { revalidate: 3600, tags: ["coaches"] } }
    );
    if (!res.ok) return [];
    return res.json() as Promise<WPCoach[]>;
  } catch {
    return [];
  }
}

export async function getCoachBySlug(slug: string): Promise<WPCoach | null> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/coach?slug=${encodeURIComponent(slug)}&_embed=1&status=publish`,
      { next: { revalidate: 3600, tags: [`coach-${slug}`] } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WPCoach[];
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCoachSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/coach?per_page=100&status=publish&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { slug: string }[];
    return data.map((c) => c.slug);
  } catch {
    return [];
  }
}

// ─── Media ───────────────────────────────────────────────────────────────────

export async function getMedia(id: number): Promise<WPMedia | null> {
  try {
    return wpFetch<WPMedia>(`/media/${id}`, { next: { revalidate: 86400 } });
  } catch (err) {
    console.warn(`[getMedia] Failed to resolve media ID ${id}:`, err);
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

// ─── Progreso del curso (WP user meta) ──────────────────────────────────────
// Requiere endpoint custom en WordPress:
//   GET/POST /wp-json/atrpoker/v1/progreso
// Ver: /wordpress-snippets/register-progreso-endpoint.php

const PROGRESO_ENDPOINT = `${WP_URL}/wp-json/atrpoker/v1/progreso`;

export async function getProgreso(token: string): Promise<Progreso> {
  try {
    const res = await fetch(PROGRESO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return {};
    const data = await res.json();
    return (data as Progreso) ?? {};
  } catch {
    return {};
  }
}

export async function saveProgreso(
  token: string,
  slug: string,
  completed: boolean
): Promise<boolean> {
  try {
    const res = await fetch(PROGRESO_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, completed }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
