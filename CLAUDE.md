# ATRPoker Frontend — Resumen del proyecto para Claude

## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 15 (App Router) | Framework principal, SSR/ISR |
| React | 19 | UI |
| TypeScript | strict | Todo el codebase |
| Tailwind CSS | 3 | Estilos, con shadcn/ui tokens |
| shadcn/ui | manual | Componentes base (Button, Badge, Card, Sheet…) |
| Embla Carousel | embla-carousel-react | Carrusel de logos de salas |
| NextAuth | v5 beta | Autenticación de usuarios |
| WordPress REST API | v2 | CMS headless (backend en atrpoker.com) |

## Backend WordPress

- **URL:** `https://atrpoker.com` (configurable via `WORDPRESS_URL` en `.env.local`)
- **Custom Post Type salas:** endpoint `/wp-json/wp/v2/sala` (singular, no "salas")
- **ACF:** grupo `group_68d7fbd5026fa` — debe tener **"Show in REST API" = Yes** activado en cada campo
- **JWT auth:** plugin JWT Authentication for WP REST API para rutas protegidas

## Estructura de rutas

```
/                       → app/page.tsx            (home: hero + carousel + salas grid + blog)
/salas                  → app/salas/page.tsx       (listado paginado)
/salas/[slug]           → app/salas/[slug]/page.tsx (detalle de sala)
/blog                   → app/blog/page.tsx
/blog/[slug]            → app/blog/[slug]/page.tsx
/streaming              → app/streaming/page.tsx
/streaming/[slug]       → app/streaming/[slug]/page.tsx
```

## Componentes principales

### `SalaLogoCarousel` (`components/SalaLogoCarousel.tsx`)
- **Client component** (`"use client"`) usando Embla Carousel
- Loop infinito con autoplay (2200ms, pausa en hover)
- Tween de opacidad/escala calculado en cada frame de scroll via `scrollProgress()` con normalización `[-0.5, 0.5]` para evitar saltos en el boundary del loop
- `mask-image` CSS para fade lateral (NO usar divs encima)
- Responsive: 70% mobile → 36% sm → 22% lg → 18% xl
- **No tiene CSS `transition`** en los slides — los updates frame-a-frame hacen el efecto suave

### `SalaJugaModal` (`components/SalaJugaModal.tsx`)
- **Client component** con `createPortal` a `document.body` (CRÍTICO: el hero tiene `transform` que rompería `position: fixed` sin portal)
- Se abre con botón "JUGÁ AHORA" (con efecto `animate-pulse-ring`)
- Props: `salaName`, `logo`, `instrucciones` (HTML), `linkAfiliado`, `codigoAfiliado`, `codigoBonificacion`, `web`
- Contiene: logo, instrucciones HTML, botones CREAR CUENTA + CONTACTAR, barra de dirección simulada, botones CopyButton

### `CopyButton` (`components/CopyButton.tsx`)
- **Client component** para copiar al portapapeles
- Estado visual: valor → hover "COPIAR" → click "¡COPIADO! ✓" (2s) → valor
- Fallback con `execCommand` para browsers viejos

### `WhatsAppFloat` (`components/WhatsAppFloat.tsx`)
- Botón fijo `bottom-6 right-6 z-40`
- Número fijo: `5491124932724`
- Agregado en `app/layout.tsx` para aparecer en todas las páginas

### `HeroBackgroundVideo`
- Video de fondo en el hero del home (`/public/videos/hero.mp4`)
- `pointer-events-none`, autoplay, loop, muted, playsInline

## Campos ACF de Salas (`lib/types.ts → SalaACF`)

| Campo | Tipo | Descripción |
|---|---|---|
| `logo_entero` | `number \| ImageObject` | Logo completo (resuelto automáticamente de ID a objeto) |
| `icono_de_la_sala` | `number \| ImageObject` | Ícono pequeño (junto al título del hero) |
| `rakeback` | `string \| number` | % rakeback ATR |
| `instrucciones` | `string` | HTML con pasos para crear cuenta |
| `link_de_afiliado` | `string` | URL directa de afiliado |
| `codigo_de_afiliado` | `string` | Código de afiliado (copiable) |
| `codigo_de_bonificacion` | `string` | Código de bonificación (copiable) |
| `red` | `string` | Red de poker (GGNetwork, etc.) |
| `bonificacion` | `string` | Descripción bono de bienvenida |
| `deposito_minimo` | `string \| number` | Depósito mínimo |
| `permite_trakers` | `boolean \| string` | Acepta "si"/"no"/true/false |
| `beneficio_atr_1/2/3` | `string` | Beneficios exclusivos ATR |
| `web` | `string` | URL del sitio (mostrada en barra simulada) |
| `pais` | `string` | País |
| `estado` | `"activa" \| "inactiva" \| "mantenimiento"` | Estado |
| `rating` | `number` | Rating 1-5 |
| `pros` / `contras` | `string` | Texto multilínea |
| `link_referido` | `string` | URL referido (legacy) |
| `codigo_bono` | `string` | Código bono (legacy) |

## Funciones de fetch (`lib/wordpress.ts`)

```typescript
getSalas({ page, perPage })       // Lista paginada — resuelve logo_entero e icono_de_la_sala
getSalaBySlug(slug)                // Una sala — resuelve imágenes igual que getSalas
getSalaSlugs()                     // Para generateStaticParams
getPosts({ page, perPage, ... })   // Blog posts
getPostBySlug(slug)
getPostSlugs()
getCategories()
getCategoryBySlug(slug)
getMedia(id)                       // Resuelve ID de media a objeto
```

- Prueba endpoints `sala` antes que `salas` (el CPT es singular)
- Revalidación: posts 300s, salas 3600s, media 86400s
- ISR tags: `"posts"`, `"salas"`, `"sala-{slug}"`, `"post-{slug}"`

## Animaciones (`tailwind.config.ts`)

| Clase | Descripción |
|---|---|
| `animate-fade-up` | Sube desde abajo con fade — título y botones del hero |
| `animate-fade-down` | Baja desde arriba con fade — badge del hero |
| `animate-fade-in` | Solo fade — overlay de fondo |
| `animate-pulse-ring` | Anillo que se expande y desvanece — botón JUGÁ AHORA |
| `animate-marquee` | (legacy, no usar) |

## WhatsApp

- **Número global:** `5491124932724`
- **Floating button:** `WhatsAppFloat` en layout (enlace simple al número)
- **Sala detail hero:** mensaje pre-cargado `"Necesito ayuda para jugar en [sala]"`
- **Modal CONTACTAR:** mismo mensaje con nombre de sala

## Layout principal

```
<body>
  <Navbar />                        // sticky top, h-14
  <main class="w-[75vw] mx-auto">   // ancho 75vw centrado
    {children}
  </main>
  <Footer />
  <WhatsAppFloat />                 // fixed bottom-right
</body>
```

- El hero (home y sala) usa `-mt-14 left-1/2 -translate-x-1/2 w-screen` para salir del contenedor `75vw` y ser full-bleed
- **IMPORTANTE:** Cualquier `position: fixed` dentro del hero debe usar `createPortal` porque `transform: translateX(-50%)` crea un nuevo containing block

## Patrones de código establecidos

- Server components por defecto, `"use client"` sólo donde hay estado/efectos/portales
- Props de imágenes ACF siempre como `typeof === "object" ? (x as ImageObject) : null`
- `stripHtml()` para texto plano de WordPress antes de usarlo en atributos
- `dangerouslySetInnerHTML` aceptado para contenido HTML de WordPress (contenido confiable)
- Affiliate links siempre con `rel="noopener noreferrer sponsored"`
- `next/image` para todas las imágenes (dominio `atrpoker.com` configurado en `next.config.ts`)

## Variables de entorno necesarias

```env
WORDPRESS_URL=https://atrpoker.com
WORDPRESS_HOSTNAME=atrpoker.com
NEXTAUTH_URL=https://atrpoker.com
NEXTAUTH_SECRET=...
```

## Informes

Cuando se genera un informe (auditoría, análisis, reporte de estado, etc.):

1. Publicarlo siempre como **Artifact**, no como texto plano en el chat.
2. Registrar la entrada en `documentos/informes.md` con el formato:
   ```
   TIPO - DD/M/AA - enlace_al_artifact
   ```
   Ejemplo: `SEO - 28/7/26 - https://claude.ai/code/artifact/xxxxx`

## Pendientes / notas

- El video `/public/videos/hero.mp4` debe existir en el repo o en el servidor
- `getSalaSlugs()` y `getPostSlugs()` tienen un tope de 100 items — si el catálogo crece, implementar paginación en `generateStaticParams`
- NextAuth v5 está en beta — migrar a stable cuando salga
