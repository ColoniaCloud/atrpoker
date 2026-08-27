# ATRPoker Frontend

Frontend Next.js 15 con SSR para [atrpoker.com](https://atrpoker.com), usando WordPress como backend headless.

## Stack

- **Next.js 15** — App Router, SSR/ISR
- **TypeScript** — tipado estricto
- **Tailwind CSS** — estilos
- **NextAuth.js v5** — autenticación con WordPress
- **WordPress REST API** — fuente de datos

## Configuración rápida

### 1. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
WORDPRESS_URL=https://atr.academy
WORDPRESS_HOSTNAME=atr.academy
NEXTAUTH_SECRET=   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
STREAMING_ROLES=subscriber,administrator,editor
```

### 2. Plugins requeridos en WordPress

Instalar y activar:

1. **JWT Authentication for WP REST API**
   Configurar en `wp-config.php`:
   ```php
   define('JWT_AUTH_SECRET_KEY', 'tu-clave-secreta');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

2. **ACF to REST API**
   Sin configuración adicional, expone campos ACF en `/wp-json/wp/v2/`.

### 3. Custom Post Type "Salas"

En WordPress, el CPT debe estar registrado con `show_in_rest: true`. Ejemplo en `functions.php`:

```php
register_post_type('salas', [
  'label'        => 'Salas',
  'public'       => true,
  'show_in_rest' => true,
  'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
]);
```

### 4. Slugs de categorías

En `lib/types.ts` ajustar los slugs reales de tus categorías:

```ts
export const CATEGORY_SLUGS = {
  BLOG: "blog",         // slug de tu categoría blog
  STREAMING: "streaming", // slug de tu categoría de streaming
};
```

### 5. Campos ACF para Salas

Crear grupo de campos ACF en WordPress con estos field names:
- `link_referido` (URL)
- `texto_boton_referido` (Texto)
- `codigo_bono` (Texto)
- `descripcion_bono` (Textarea)
- `rating` (Número, 1-5)
- `pais` (Texto)
- `estado` (Select: activa / inactiva / mantenimiento)
- `pros` (Textarea)
- `contras` (Textarea)
- `variantes_poker` (Checkbox)
- `plataformas` (Checkbox)

### 6. Campos ACF para posts de Streaming

En el grupo de campos para la categoría Streaming:
- `bunny_video_id` (Texto) — Video GUID de Bunny.net
- `bunny_library_id` (Texto) — Library ID de Bunny.net
- `is_live` (True/False)

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy

### Vercel (recomendado)

```bash
vercel deploy
```

Agregar las variables de entorno en el dashboard de Vercel.

### DNS

Al poner en producción, apuntar el dominio principal al deploy de Next.js y mover WordPress a `cms.atrpoker.com` (actualizar `WORDPRESS_URL`).
