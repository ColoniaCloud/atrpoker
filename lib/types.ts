// ─── WordPress REST API Types ────────────────────────────────────────────────

export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<
      string,
      { source_url: string; width: number; height: number }
    >;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  link: string;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  avatar_urls: Record<string, string>;
  description: string;
}

// ─── Post (Entrada) ──────────────────────────────────────────────────────────

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  // Embedded data (cuando se usa _embed)
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPCategory[][];
  };
  // ACF fields (para posts de streaming con datos de Bunny.net)
  acf?: StreamingACF;
}

export interface StreamingACF {
  bunny_video_id?: string;
  bunny_library_id?: string;
  bunny_pull_zone?: string;
  required_role?: string; // rol mínimo requerido para ver el contenido
  is_live?: boolean;
}

// ─── Sala (Custom Post Type) ─────────────────────────────────────────────────

export interface WPSala {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  featured_media: number;
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
  };
  acf: SalaACF;
}

export interface SalaACF {
  // Información general
  pais?: string;
  estado?: "activa" | "inactiva" | "mantenimiento";
  rating?: number; // 1-5
  // Links de referidos
  link_referido?: string;
  texto_boton_referido?: string;
  // Código de bonificación
  codigo_bono?: string;
  descripcion_bono?: string;
  // Características
  variantes_poker?: string[];
  plataformas?: string[]; // "web", "ios", "android", "windows", "mac"
  // Notas para el review
  pros?: string;
  contras?: string;
}

// ─── Auth / Session ──────────────────────────────────────────────────────────

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  email?: string;
  roles: string[];
  avatar_urls: Record<string, string>;
}

export interface WPJWTResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

// ─── Category slugs config ───────────────────────────────────────────────────

export const CATEGORY_SLUGS = {
  BLOG: "blog", // ajusta al slug real de tu categoría de blog
  STREAMING: "streaming", // ajusta al slug real de tu categoría de streaming
} as const;
