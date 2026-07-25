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
  bunny_video_id?: string;       // Video ID — curso-principiantes y yoga
  bunny_video_id_2?: string;     // Video ID — resto de subcategorías de Escuela
  bunny_pull_zone?: string;
  is_live?: boolean;
  duracion_del_video?: string;   // Duración — curso-principiantes y yoga
  duracion_de_la_clase?: string; // Duración — resto de subcategorías de Escuela
}

// ─── Progreso del curso ─────────────────────────────────────────────────────

/** Mapa de slug de post → completado (true/false). Guardado en WP user meta. */
export type Progreso = Record<string, boolean>;

// ─── Mensajería interna ──────────────────────────────────────────────────────
// Requiere endpoints custom en WordPress:
//   /wp-json/atrpoker/v1/mensajes/* y /usuarios/buscar
// Ver: /documentos/register-mensajes-endpoint.php (ignorado por git)

export type EstadoSolicitud = "pendiente" | "aceptada";

/** Datos públicos mínimos de un usuario para la UI de mensajería. */
export interface UsuarioPublico {
  id: number;
  nombre: string;
  avatar: string;
}

/** Un mensaje dentro de un hilo. */
export interface Mensaje {
  id: number;
  cuerpo: string;
  mio: boolean;
  autor_id?: number;
  creado_at: string;
}

/** Fila de la bandeja (lista de conversaciones). */
export interface ConversacionResumen {
  id: number;
  estado: EstadoSolicitud;
  con: UsuarioPublico;
  ultimo_mensaje: {
    cuerpo: string;
    mio: boolean;
    creado_at: string;
  } | null;
  no_leidos: number;
  bloqueado: boolean;
  ultimo_at: string;
}

/** Cabecera de una conversación al abrir el hilo. */
export interface ConversacionDetalle {
  id: number;
  estado: EstadoSolicitud;
  inicie_yo: boolean;
  con: UsuarioPublico;
  bloqueado: boolean;
}

/** Respuesta de GET /mensajes/conversaciones/{id}. */
export interface HiloRespuesta {
  conversacion: ConversacionDetalle;
  mensajes: Mensaje[];
}

/** Datos server-only para notificar por email (nunca se envían al cliente). */
export interface NotificarDatos {
  email: string;
  nombre: string;
  de: string;
}

/** Fila del panel de moderación (usuarios reportados). */
export interface ReporteModeracion {
  usuario: UsuarioPublico;
  total: number;
  distintos: number;
  ultimo_motivo: string;
  ultimo_at: string;
  suspendido: boolean;
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
  // Logo entero (ACF image field — puede ser ID numérico o objeto completo según config de ACF)
  logo_entero?: number | {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  // Icono pequeño de la sala (usado junto al título)
  icono_de_la_sala?: number | {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  // Porcentaje de rakeback ofrecido por ATR
  rakeback?: string | number;
  // Instrucciones para crear cuenta (HTML devuelto por ACF)
  instrucciones?: string;
  // Link de afiliado directo (para el botón CREAR CUENTA)
  link_de_afiliado?: string;
  // Códigos de afiliado y bonificación
  codigo_de_afiliado?: string;
  codigo_de_bonificacion?: string;
  // Red de poker
  red?: string;
  // Bono de bienvenida
  bonificacion?: string;
  // Deposito mínimo
  deposito_minimo?: string | number;
  // Permite trackers
  permite_trakers?: boolean | string;
  // Beneficios ATR
  beneficio_atr_1?: string;
  beneficio_atr_2?: string;
  beneficio_atr_3?: string;
  // Website de la sala
  web?: string;
}

// ─── Coach (Custom Post Type) ────────────────────────────────────────────────

export interface WPCoach {
  id: number;
  slug: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  date: string;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };
  acf?: {
    especialidad?: string;
    disciplina?: string;
    descripcion?: string;
    bio?: string;
    whatsapp?: string;
    instagram?: string;
    twitter?: string;
    twitch?: string;
    youtube?: string;
    pais?: string;
    anos_experiencia?: string | number;
    logros?: string;
    estilo_de_juego?: string;
    variantes?: string;
  };
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

export interface WPRegisterPayload {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface WPRegisterResponse {
  success: boolean;
  user_id: number;
  token: string | null;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
  message?: string;
}

export interface WPRegisterError {
  code: string;
  message: string;
  data?: { status?: number };
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
  BLOG: "blog",
  BLOG_POSTS: "blog-blog",     // subcategoría Blog de Póker
  NOTICIAS: "noticias",         // subcategoría Noticias de Póker
  STREAMING: "streaming",
  ESCUELA: "escuela",           // categoría padre de Academia
} as const;

// Subcategorías de Escuela (Academia)
export const ESCUELA_SUBCATEGORIES = [
  { slug: "clases-grupales", label: "Clases con BlueGhost y Piaggesi" },
  { slug: "clases-grupales-straussj", label: "Clases con StraussJ" },
  { slug: "curso-principiantes", label: "Curso Principiantes" },
  { slug: "curso-teorico-practico", label: "Curso Teórico Práctico" },
  { slug: "mental-coach", label: "Mental Coach" },
  { slug: "sesion-live", label: "Sesión Live" },
] as const;

// ─── Bunny Stream Library IDs por subcategoría ────────────────────────────────
// curso-principiantes → 510800
// resto de escuela    → 581821
export const ESCUELA_LIBRARY_IDS: Record<string, string> = {
  "curso-principiantes": "510800",
};
export const ESCUELA_DEFAULT_LIBRARY_ID = "581821";

// ─── Control de acceso a Academia ─────────────────────────────────────────────
// Acceso libre (cualquier usuario registrado):
export const ESCUELA_FREE_SUBCATEGORIES = ["curso-principiantes"] as const;

// Roles con acceso a subcategorías premium:
export const ESCUELA_PREMIUM_ROLES = ["administrator", "editor", "colaborador", "player"] as const;
